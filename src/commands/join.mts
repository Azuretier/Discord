import type { ChatInputCommandInteraction, GuildMember, VoiceChannel } from 'discord.js';
import { 
	SlashCommandBuilder, 
	ChannelType, 
	PermissionFlagsBits,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	TextChannel
} from 'discord.js';

// List of channel IDs where this command can be used
const ALLOWED_CHANNEL_IDS = [
	'1459876497866227735',
	// Add more allowed channel IDs here
];

// Target voice channel ID (the locked VC users will be moved to)
const TARGET_VOICE_CHANNEL_ID = ''; // Set your locked VC ID here

// Category where private text channels will be created
const PRIVATE_CATEGORY_ID = ''; // Set your category ID here (optional)

// Admin user ID who can approve requests
const ADMIN_USER_ID = ''; // Set your admin user ID here

export const data = new SlashCommandBuilder()
	.setName('join')
	.setDescription('ロックされたボイスチャンネルへの参加をリクエストします');

export async function execute(interaction: ChatInputCommandInteraction) {
	// Check if command is used in allowed channel
	if (ALLOWED_CHANNEL_IDS.length > 0 && !ALLOWED_CHANNEL_IDS.includes(interaction.channelId)) {
		await interaction.reply({
			content: '❌ このコマンドはこのチャンネルでは使用できません。',
			ephemeral: true
		});
		return;
	}

	if (!interaction.guild) {
		await interaction.reply({
			content: '❌ このコマンドはサーバー内でのみ使用できます。',
			ephemeral: true
		});
		return;
	}

	const member = interaction.member as GuildMember;
	
	// Check if user is in a voice channel
	if (!member.voice.channel) {
		await interaction.reply({
			content: '❌ まずボイスチャンネルに参加してください。',
			ephemeral: true
		});
		return;
	}

	const currentVC = member.voice.channel;

	try {
		// Defer reply as this might take a moment
		await interaction.deferReply({ ephemeral: true });

		// Create private text channel for communication
		const privateChannel = await interaction.guild.channels.create({
			name: `join-request-${interaction.user.username}`,
			type: ChannelType.GuildText,
			parent: PRIVATE_CATEGORY_ID || undefined,
			permissionOverwrites: [
				{
					id: interaction.guild.id,
					deny: [PermissionFlagsBits.ViewChannel],
				},
				{
					id: interaction.user.id,
					allow: [
						PermissionFlagsBits.ViewChannel,
						PermissionFlagsBits.SendMessages,
						PermissionFlagsBits.ReadMessageHistory,
					],
				},
				...(ADMIN_USER_ID ? [{
					id: ADMIN_USER_ID,
					allow: [
						PermissionFlagsBits.ViewChannel,
						PermissionFlagsBits.SendMessages,
						PermissionFlagsBits.ReadMessageHistory,
					],
				}] : []),
			],
		});

		// Create button that only admin can click
		const approveButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId(`approve_join_${interaction.user.id}_${currentVC.id}`)
				.setLabel('承認して移動')
				.setStyle(ButtonStyle.Success)
				.setEmoji('✅'),
			new ButtonBuilder()
				.setCustomId(`deny_join_${interaction.user.id}`)
				.setLabel('拒否')
				.setStyle(ButtonStyle.Danger)
				.setEmoji('❌')
		);

		// Send message in private channel
		await privateChannel.send({
			content: `${interaction.user} さんが通話参加をリクエストしました。\n**現在のVC:** ${currentVC}\n**移動先VC:** <#${TARGET_VOICE_CHANNEL_ID}>\n\n${ADMIN_USER_ID ? `<@${ADMIN_USER_ID}>` : '管理者'} のみが承認できます。`,
			components: [approveButton],
		});

		// Try to send DM to user
		try {
			await interaction.user.send({
				content: `✅ 通話参加リクエストを送信しました。\n管理者の承認をお待ちください。\n詳細: ${privateChannel}`,
			});
		} catch (dmError) {
			console.log('Could not send DM to user:', dmError);
		}

		// Reply to the user
		await interaction.editReply({
			content: `✅ 通話リクエストが送信されました。\n管理者の承認をお待ちください。\nステータス: ${privateChannel}`,
		});

	} catch (error) {
		console.error('Error creating join request:', error);
		
		if (interaction.deferred) {
			await interaction.editReply({
				content: '❌ 通話リクエストの作成に失敗しました。',
			});
		} else {
			await interaction.reply({
				content: '❌ 通話リクエストの作成に失敗しました。',
				ephemeral: true,
			});
		}
	}
}
