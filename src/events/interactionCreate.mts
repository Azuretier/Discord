// src/events/interactionCreate.ts 内の処理
import type { Interaction, TextChannel } from 'discord.js';
import { dbService  } from '../lib/db-service.js';
import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } from 'discord.js';

export const handleExecution = async (interaction: Interaction) => {
    // ボタンが押されたとき
    if (interaction.isButton() && interaction.customId === 'open_translator_modal') {
        const modal = new ModalBuilder()
            .setCustomId('translator_modal')
            .setTitle('翻訳者 応募フォーム');

        const langInput = new TextInputBuilder()
            .setCustomId('languages')
            .setLabel('対応可能な言語 (例: 日英、日韓など)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('例: 日本語・英語')
            .setRequired(true);

        const expInput = new TextInputBuilder()
            .setCustomId('experience')
            .setLabel('翻訳の経験や自己PR')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('意気込みを書いてください')
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(langInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(expInput)
        );

        await interaction.showModal(modal);
    }

    // モーダルが送信されたとき
    if (interaction.isModalSubmit() && interaction.customId === 'translator_modal') {
        const languages = interaction.fields.getTextInputValue('languages');
        const experience = interaction.fields.getTextInputValue('experience');

        // data.json からログ用チャンネルIDを取得 (dbService経由)
        const guildConfig = await dbService.getTranslatorConfig(interaction.guildId!) as { logChannelId: string } | null | undefined;
        
        // Type guard: check if config exists and has logChannelId
        if (!guildConfig?.logChannelId) {
            await interaction.reply({ 
                content: 'エラー: ログチャンネルが設定されていません。', 
                ephemeral: true 
            });
            return;
        }
        
        const logChannel = interaction.guild?.channels.cache.get(guildConfig.logChannelId) as TextChannel;

        const embed = new EmbedBuilder()
            .setTitle('📩 新規翻訳者応募')
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .addFields(
                { name: '対応言語', value: languages },
                { name: '経験・PR', value: experience }
            )
            .setColor('#5865F2')
            .setTimestamp();

        if (logChannel) {
            await logChannel.send({ embeds: [embed] });
            await interaction.reply({ content: '応募を送信しました。管理者の確認をお待ちください！', ephemeral: true });
        } else {
            await interaction.reply({ content: 'エラー：ログチャンネルが設定されていません。', ephemeral: true });
        }
    }
}