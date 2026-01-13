import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';

// List of channel IDs where this command can be used
const ALLOWED_CHANNEL_IDS = [
	// Add your allowed channel IDs here
	 '1459876497866227735',
	// Example: '9876543210987654321',
];

export const data = new SlashCommandBuilder()
	.setName('send-message')
	.setDescription('指定したチャンネルにメッセージと添付ファイルを送信します')
	.addStringOption(option =>
		option.setName('message')
			.setDescription('送信するメッセージ')
			.setRequired(true)
	)
	.addChannelOption(option =>
		option.setName('channel')
			.setDescription('送信先のチャンネル（省略時は現在のチャンネル）')
			.addChannelTypes(ChannelType.GuildText)
			.setRequired(false)
	)
	.addAttachmentOption(option =>
		option.setName('attachment')
			.setDescription('送信する添付ファイル')
			.setRequired(false)
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction: ChatInputCommandInteraction) {
	// Check if command is used in allowed channel
	if (ALLOWED_CHANNEL_IDS.length > 0 && !ALLOWED_CHANNEL_IDS.includes(interaction.channelId)) {
		await interaction.reply({
			content: '❌ このコマンドはこのチャンネルでは使用できません。',
			ephemeral: true
		});
		return;
	}

	const message = interaction.options.getString('message', true);
	const targetChannelOption = interaction.options.getChannel('channel');
	const attachment = interaction.options.getAttachment('attachment');

	// Get the actual channel object
	const targetChannel = targetChannelOption 
		? await interaction.guild?.channels.fetch(targetChannelOption.id)
		: interaction.channel;

	if (!targetChannel || !targetChannel.isTextBased()) {
		await interaction.reply({
			content: '❌ 無効なチャンネルです。',
			ephemeral: true
		});
		return;
	}

	// Type guard: ensure channel has send method
	if (!('send' in targetChannel)) {
		await interaction.reply({
			content: '❌ このチャンネルにはメッセージを送信できません。',
			ephemeral: true
		});
		return;
	}

	try {
		// Send message with optional attachment
		const messagePayload: any = { content: message };
		
		if (attachment) {
			messagePayload.files = [attachment.url];
		}

		await targetChannel.send(messagePayload);

		await interaction.reply({
			content: `✅ メッセージを ${targetChannel} に送信しました。`,
			ephemeral: true
		});
	} catch (error) {
		console.error('Error sending message:', error);
		await interaction.reply({
			content: '❌ メッセージの送信に失敗しました。',
			ephemeral: true
		});
	}
}
