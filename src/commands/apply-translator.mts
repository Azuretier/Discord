// src/commands/apply.ts
import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction } from 'discord.js';

export const applyCommand = {
    data: new SlashCommandBuilder()
        .setName('apply-translator')
        .setDescription('翻訳者応募フォームを表示します'),

    async execute(interaction: ChatInputCommandInteraction) {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('open_translator_modal')
                .setLabel('翻訳者に応募する')
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            content: 'Azure Supporter 翻訳チームへようこそ！下のボタンを押して応募フォームを入力してください。',
            components: [row]
        });
    }
};