import {
  ActionRowBuilder,
  ChannelType,
  EmbedBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
  type Interaction,
  type RepliableInteraction,
} from 'discord.js';
import { dbService } from '../lib/db-service.mjs';
import { handleRulesVerification } from '../commands/rules-verification.mjs';

type ReplyOptions = Parameters<RepliableInteraction['reply']>[0];

function isRepliable(interaction: Interaction): interaction is RepliableInteraction {
  return interaction.isRepliable();
}

async function safeReply(interaction: Interaction, options: ReplyOptions) {
  if (!isRepliable(interaction)) return;
  if (interaction.replied || interaction.deferred) return interaction.followUp(options);
  return interaction.reply(options);
}

function isAdmin(interaction: Interaction): boolean {
  if (!interaction.inGuild()) return false;
  return Boolean(interaction.memberPermissions?.has(PermissionFlagsBits.Administrator));
}

async function handleApproveJoinButton(interaction: Interaction): Promise<boolean> {
  if (!interaction.isButton()) return false;
  if (!interaction.customId.startsWith('approve_join_')) return false;

  if (!isAdmin(interaction)) {
    await safeReply(interaction, {
      content: '❌ このボタンは管理者のみが使用できます。',
      ephemeral: true,
    });
    return true;
  }

  // approve_join_${userId}_${currentVCId}
  const remainder = interaction.customId.slice('approve_join_'.length);
  const [userId, currentVCId] = remainder.split('_');

  if (!userId) {
    await safeReply(interaction, { content: '❌ 不正なリクエストです。', ephemeral: true });
    return true;
  }

  // NOTE: TARGET_VOICE_CHANNEL_ID is not currently configurable in this repo.
  // If you want this feature, add it to data.json config and fetch it here.
  const TARGET_VOICE_CHANNEL_ID = '';

  if (!TARGET_VOICE_CHANNEL_ID) {
    await safeReply(interaction, {
      content: '❌ 移動先VCが未設定です。管理者に設定を依頼してください。',
      ephemeral: true,
    });
    return true;
  }

  const guild = interaction.guild;
  if (!guild) return true;

  try {
    const member = await guild.members.fetch(userId);

    if (!member.voice.channelId) {
      await safeReply(interaction, {
        content: '❌ ユーザーがボイスチャンネルにいません。',
        ephemeral: true,
      });
      return true;
    }

    if (currentVCId && member.voice.channelId !== currentVCId) {
      await safeReply(interaction, {
        content: '❌ ユーザーの参加チャンネルが変更されています。',
        ephemeral: true,
      });
      return true;
    }

    const targetVC = await guild.channels.fetch(TARGET_VOICE_CHANNEL_ID);

    if (!targetVC || targetVC.type !== ChannelType.GuildVoice) {
      await safeReply(interaction, {
        content: '❌ 移動先のボイスチャンネルが見つかりません。',
        ephemeral: true,
      });
      return true;
    }

    await member.voice.setChannel(targetVC);

    await safeReply(interaction, {
      content: `✅ ${member} を ${targetVC} に移動しました。`,
      ephemeral: true,
    });

    try {
      await interaction.message.edit({
        content:
          interaction.message.content +
          `\n\n✅ **承認済み** - ${interaction.user} によって承認されました`,
        components: [],
      });
    } catch {
      // ignore
    }

    try {
      await member.send(`✅ 通話参加が承認されました！${targetVC.name} に移動しました。`);
    } catch {
      // ignore
    }

    return true;
  } catch {
    await safeReply(interaction, {
      content: '❌ ユーザーの移動に失敗しました。',
      ephemeral: true,
    });
    return true;
  }
}

async function handleDenyJoinButton(interaction: Interaction): Promise<boolean> {
  if (!interaction.isButton()) return false;
  if (!interaction.customId.startsWith('deny_join_')) return false;

  if (!isAdmin(interaction)) {
    await safeReply(interaction, {
      content: '❌ このボタンは管理者のみが使用できます。',
      ephemeral: true,
    });
    return true;
  }

  const userId = interaction.customId.slice('deny_join_'.length);
  if (!userId) {
    await safeReply(interaction, { content: '❌ 不正なリクエストです。', ephemeral: true });
    return true;
  }

  try {
    await safeReply(interaction, { content: '❌ リクエストを拒否しました。', ephemeral: true });

    try {
      await interaction.message.edit({
        content:
          interaction.message.content +
          `\n\n❌ **拒否されました** - ${interaction.user} によって拒否されました`,
        components: [],
      });
    } catch {
      // ignore
    }

    const guild = interaction.guild;
    if (guild) {
      const member = await guild.members.fetch(userId);
      try {
        await member.send('❌ 通話参加リクエストが拒否されました。');
      } catch {
        // ignore
      }
    }

    return true;
  } catch {
    return true;
  }
}

async function handleTranslatorOpenModal(interaction: Interaction): Promise<boolean> {
  if (!interaction.isButton()) return false;
  if (interaction.customId !== 'open_translator_modal') return false;

  const modal = new ModalBuilder().setCustomId('translator_modal').setTitle('翻訳者 応募フォーム');

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
    new ActionRowBuilder<TextInputBuilder>().addComponents(expInput),
  );

  await interaction.showModal(modal);
  return true;
}

async function handleTranslatorSubmit(interaction: Interaction): Promise<boolean> {
  if (!interaction.isModalSubmit()) return false;
  if (interaction.customId !== 'translator_modal') return false;

  if (!interaction.inGuild() || !interaction.guildId) {
    await safeReply(interaction, { content: 'エラー: サーバー内で実行してください。', ephemeral: true });
    return true;
  }

  const guild = interaction.guild;
  if (!guild) {
    await safeReply(interaction, { content: 'エラー: サーバー情報の取得に失敗しました。', ephemeral: true });
    return true;
  }

  const languages = interaction.fields.getTextInputValue('languages');
  const experience = interaction.fields.getTextInputValue('experience');

  const guildConfig = (await dbService.getTranslatorConfig(interaction.guildId)) as
    | { logChannelId: string }
    | null
    | undefined;

  if (!guildConfig?.logChannelId) {
    await safeReply(interaction, {
      content: 'エラー: ログチャンネルが設定されていません。',
      ephemeral: true,
    });
    return true;
  }

  const logChannel = await guild.channels.fetch(guildConfig.logChannelId).catch(() => null);

  if (!logChannel || !logChannel.isTextBased() || !logChannel.isSendable()) {
    await safeReply(interaction, {
      content: 'エラー: ログチャンネルが見つからないか、送信できません。',
      ephemeral: true,
    });
    return true;
  }

  const embed = new EmbedBuilder()
    .setTitle('📩 新規翻訳者応募')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .addFields(
      { name: '対応言語', value: languages },
      { name: '経験・PR', value: experience },
    )
    .setColor('#5865F2')
    .setTimestamp();

  await logChannel.send({ embeds: [embed] });
  await safeReply(interaction, {
    content: '応募を送信しました。管理者の確認をお待ちください！',
    ephemeral: true,
  });

  return true;
}

async function handleRulesAgree(interaction: Interaction): Promise<boolean> {
  if (!interaction.isButton()) return false;
  if (interaction.customId !== 'agree_rules') return false;

  const { handleRulesAgreement } = await import('../commands/rules.mjs');
  await handleRulesAgreement(interaction);
  return true;
}

async function handleRulesVerificationInteraction(interaction: Interaction): Promise<boolean> {
  if (!interaction.isButton() && !interaction.isStringSelectMenu()) return false;
  return await handleRulesVerification(interaction);
}

export async function handleInteractionExtras(interaction: Interaction): Promise<boolean> {
  return (
    (await handleApproveJoinButton(interaction)) ||
    (await handleDenyJoinButton(interaction)) ||
    (await handleTranslatorOpenModal(interaction)) ||
    (await handleTranslatorSubmit(interaction)) ||
    (await handleRulesAgree(interaction)) ||
    (await handleRulesVerificationInteraction(interaction))
  );
}
