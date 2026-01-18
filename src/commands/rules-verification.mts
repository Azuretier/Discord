import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  type ChatInputCommandInteraction,
  type ButtonInteraction,
  type StringSelectMenuInteraction,
  type Client,
  type TextChannel,
  PermissionFlagsBits,
} from 'discord.js';
import { Logger } from '../utils/logger.mjs';

const logger = new Logger('RulesVerification');

// ============================================================================
// CONFIGURATION - Easily add more languages and rules here
// ============================================================================

export interface RuleConfig {
  title: string;
  description: string;
}

export interface LanguageConfig {
  code: string;
  name: string;
  emoji: string;
  rules: RuleConfig[];
  messages: {
    selectLanguage: string;
    rulesTitle: string;
    rulesDescription: string;
    ruleProgress: string;
    nextButton: string;
    previousButton: string;
    agreeButton: string;
    completed: string;
    alreadyVerified: string;
    error: string;
  };
}

export interface RolesConfig {
  // Role IDs for each rule step (e.g., ServerRule1, ServerRule2, etc.)
  ruleProgressRoles: string[];
  // Role ID given after completing all rules
  verifiedRoleId: string;
  // Role ID to remove after verification (optional)
  preVerifiedRoleId?: string;
}

// Language configurations - Add new languages here
export const LANGUAGES: Record<string, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    emoji: '🇬🇧',
    rules: [
      {
        title: '1. Be Respectful and Inclusive',
        description:
          'Treat all community members with respect. No harassment, hate speech, discrimination, or personal attacks. We welcome everyone regardless of background, experience level, or identity.',
      },
      {
        title: '2. Keep Content Appropriate',
        description:
          'Share content that is safe for work and appropriate for all ages. No NSFW, illegal, or harmful content. Keep discussions professional and constructive.',
      },
      {
        title: '3. No Spam or Self-Promotion',
        description:
          'Avoid excessive self-promotion, spam, or unsolicited advertising. Share your projects in designated channels and contribute meaningfully to discussions.',
      },
      {
        title: '4. Use Channels Appropriately',
        description:
          'Post content in the correct channels. Read channel descriptions before posting. Keep conversations on-topic and use threads for extended discussions.',
      },
      {
        title: '5. Respect Privacy and Security',
        description:
          'Do not share personal information of others without consent. Keep credentials, API keys, and sensitive data private. Report security issues to moderators.',
      },
      {
        title: '6. Follow Discord Terms of Service',
        description:
          'All Discord Terms of Service and Community Guidelines apply. Violations may result in warnings, temporary restrictions, or permanent bans.',
      },
    ],
    messages: {
      selectLanguage: 'Please select your preferred language:',
      rulesTitle: '📜 Server Rules',
      rulesDescription: 'Please read and agree to the following rules to gain access to the server.',
      ruleProgress: 'Rule {current} of {total}',
      nextButton: 'Next →',
      previousButton: '← Previous',
      agreeButton: 'I Agree ✓',
      completed:
        '✅ Thank you for agreeing to the rules! You now have full access to the server. Welcome! 🎉',
      alreadyVerified: '✅ You have already been verified!',
      error: '❌ An error occurred. Please try again or contact an administrator.',
    },
  },
  ja: {
    code: 'ja',
    name: '日本語',
    emoji: '🇯🇵',
    rules: [
      {
        title: '1. 敬意を持ち、包括的であること',
        description:
          'すべてのコミュニティメンバーに敬意を持って接してください。ハラスメント、ヘイトスピーチ、差別、個人攻撃は禁止です。背景、経験レベル、アイデンティティに関係なく、すべての人を歓迎します。',
      },
      {
        title: '2. 適切なコンテンツを共有する',
        description:
          '職場で安全で、全年齢に適したコンテンツを共有してください。NSFW、違法、有害なコンテンツは禁止です。議論はプロフェッショナルで建設的に保ってください。',
      },
      {
        title: '3. スパムや自己宣伝の禁止',
        description:
          '過度な自己宣伝、スパム、迷惑な広告は避けてください。プロジェクトは指定されたチャンネルで共有し、議論に有意義に貢献してください。',
      },
      {
        title: '4. チャンネルを適切に使用する',
        description:
          '正しいチャンネルにコンテンツを投稿してください。投稿前にチャンネルの説明を読んでください。会話はトピックに沿って行い、長い議論にはスレッドを使用してください。',
      },
      {
        title: '5. プライバシーとセキュリティを尊重する',
        description:
          '同意なく他人の個人情報を共有しないでください。認証情報、APIキー、機密データは非公開にしてください。セキュリティ問題はモデレーターに報告してください。',
      },
      {
        title: '6. Discord利用規約に従う',
        description:
          'Discordの利用規約とコミュニティガイドラインがすべて適用されます。違反は警告、一時的な制限、または永久BANにつながる可能性があります。',
      },
    ],
    messages: {
      selectLanguage: '言語を選択してください：',
      rulesTitle: '📜 サーバールール',
      rulesDescription: 'サーバーにアクセスするには、以下のルールを読んで同意してください。',
      ruleProgress: 'ルール {current} / {total}',
      nextButton: '次へ →',
      previousButton: '← 前へ',
      agreeButton: '同意します ✓',
      completed:
        '✅ ルールに同意いただきありがとうございます！サーバーへのフルアクセスが可能になりました。ようこそ！ 🎉',
      alreadyVerified: '✅ すでに認証済みです！',
      error: '❌ エラーが発生しました。もう一度お試しいただくか、管理者にお問い合わせください。',
    },
  },
};

// Role configuration - Update these IDs for your server
export const ROLES_CONFIG: RolesConfig = {
  // Role IDs for tracking rule progress (ServerRule1, ServerRule2, etc.)
  // These roles are given as users progress through the rules
  ruleProgressRoles: [
    '1459876672420577291', // ServerRule1 role ID
    '1459876718604193957', // ServerRule2 role ID
    '1459876737969029171', // ServerRule3 role ID
    '1459876754830266671', // ServerRule4 role ID
    '1459876754830266671', // ServerRule5 role ID
    '1462483303763542332', // ServerRule6 role ID
  ],
  // Role ID given after completing all rules (Verified/Member role)
  verifiedRoleId: '1461233507849474180',
  // Role ID to remove after verification (optional - Pre-Member role)
  preVerifiedRoleId: '',
};

// Channel ID where the rules verification button will be posted
export const RULES_CHANNEL_ID = '1461219536316665991';

// ============================================================================
// SLASH COMMAND - For admins to post the rules button
// ============================================================================

export const data = new SlashCommandBuilder()
  .setName('rules-setup')
  .setDescription('Post the rules verification button (Admin only)')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('📜 Server Rules Verification')
    .setDescription(
      'Welcome to the server! Please click the button below to read and agree to our rules.\n\n' +
        'サーバーへようこそ！下のボタンをクリックしてルールを確認し、同意してください。'
    )
    .setFooter({ text: 'Click the button to begin • ボタンをクリックして開始' });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('rules_start')
      .setLabel('📋 Start Verification / 認証を開始')
      .setStyle(ButtonStyle.Primary)
  );

  await interaction.reply({ embeds: [embed], components: [row] });
}

// ============================================================================
// INTERACTION HANDLERS
// ============================================================================

/**
 * Handle the initial rules button click - Show language selection
 */
export async function handleRulesStart(interaction: ButtonInteraction): Promise<boolean> {
  if (interaction.customId !== 'rules_start') return false;

  const guild = interaction.guild;
  if (!guild) return true;

  // Check if user is already verified
  if (ROLES_CONFIG.verifiedRoleId) {
    const member = await guild.members.fetch(interaction.user.id);
    if (member.roles.cache.has(ROLES_CONFIG.verifiedRoleId)) {
      const lang = LANGUAGES['en']!; // Default to English for this message
      await interaction.reply({
        content: lang.messages.alreadyVerified,
        ephemeral: true,
      });
      return true;
    }
  }

  // Show language selection
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('rules_language_select')
    .setPlaceholder('Select Language / 言語を選択')
    .addOptions(
      Object.values(LANGUAGES).map((lang) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(lang.name)
          .setDescription(`View rules in ${lang.name}`)
          .setValue(lang.code)
          .setEmoji(lang.emoji)
      )
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  await interaction.reply({
    content: '🌐 Please select your preferred language:\n言語を選択してください：',
    components: [row],
    ephemeral: true,
  });

  return true;
}

/**
 * Handle language selection - Show first rule
 */
export async function handleLanguageSelect(interaction: StringSelectMenuInteraction): Promise<boolean> {
  if (interaction.customId !== 'rules_language_select') return false;

  const langCode = interaction.values[0];
  if (!langCode) {
    await interaction.reply({ content: 'Invalid language selection.', ephemeral: true });
    return true;
  }
  const lang = LANGUAGES[langCode];

  if (!lang) {
    await interaction.reply({ content: 'Invalid language selection.', ephemeral: true });
    return true;
  }

  await showRule(interaction, lang, 0);
  return true;
}

/**
 * Handle rule navigation (next/previous buttons)
 */
export async function handleRuleNavigation(interaction: ButtonInteraction): Promise<boolean> {
  // Format: rules_nav_{langCode}_{direction}_{currentIndex}
  if (!interaction.customId.startsWith('rules_nav_')) return false;

  const parts = interaction.customId.split('_');
  const langCode = parts[2];
  const direction = parts[3]; // 'next' or 'prev'
  const indexStr = parts[4];
  
  if (!langCode || !direction || !indexStr) return true;
  
  const currentIndex = parseInt(indexStr, 10);
  const lang = LANGUAGES[langCode];
  if (!lang) return true;

  const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
  await showRule(interaction, lang, newIndex);

  return true;
}

/**
 * Handle final agreement button
 */
export async function handleRulesAgree(interaction: ButtonInteraction): Promise<boolean> {
  // Format: rules_agree_{langCode}
  if (!interaction.customId.startsWith('rules_agree_')) return false;

  const langCode = interaction.customId.split('_')[2];
  if (!langCode) return true;
  
  const lang = LANGUAGES[langCode];
  if (!lang) return true;

  const guild = interaction.guild;
  if (!guild) return true;

  try {
    const member = await guild.members.fetch(interaction.user.id);

    // Add verified role
    if (ROLES_CONFIG.verifiedRoleId) {
      await member.roles.add(ROLES_CONFIG.verifiedRoleId);
      logger.info(`Added verified role to ${interaction.user.username}`);
    }

    // Remove pre-verified role if configured
    if (ROLES_CONFIG.preVerifiedRoleId && member.roles.cache.has(ROLES_CONFIG.preVerifiedRoleId)) {
      await member.roles.remove(ROLES_CONFIG.preVerifiedRoleId);
      logger.info(`Removed pre-verified role from ${interaction.user.username}`);
    }

    // Remove all progress roles
    for (const roleId of ROLES_CONFIG.ruleProgressRoles) {
      if (roleId && member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);
      }
    }

    const completedEmbed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle('✅ Verification Complete!')
      .setDescription(lang.messages.completed)
      .setTimestamp();

    await interaction.update({
      embeds: [completedEmbed],
      components: [],
    });

    logger.info(`User ${interaction.user.username} completed rules verification`);
  } catch (error) {
    logger.error('Error completing rules verification', error);
    await interaction.reply({
      content: lang.messages.error,
      ephemeral: true,
    });
  }

  return true;
}

/**
 * Display a specific rule with navigation buttons
 */
async function showRule(
  interaction: ButtonInteraction | StringSelectMenuInteraction,
  lang: LanguageConfig,
  ruleIndex: number
) {
  const rule = lang.rules[ruleIndex];
  if (!rule) {
    await interaction.reply({ content: 'Invalid rule index.', ephemeral: true });
    return;
  }
  const totalRules = lang.rules.length;
  const isFirstRule = ruleIndex === 0;
  const isLastRule = ruleIndex === totalRules - 1;

  // Update progress role if configured
  const guild = interaction.guild;
  if (guild && ROLES_CONFIG.ruleProgressRoles[ruleIndex]) {
    try {
      const member = await guild.members.fetch(interaction.user.id);
      const roleId = ROLES_CONFIG.ruleProgressRoles[ruleIndex];

      // Remove previous progress roles
      for (let i = 0; i < ruleIndex; i++) {
        const prevRoleId = ROLES_CONFIG.ruleProgressRoles[i];
        if (prevRoleId && member.roles.cache.has(prevRoleId)) {
          await member.roles.remove(prevRoleId);
        }
      }

      // Add current progress role
      if (roleId && !member.roles.cache.has(roleId)) {
        await member.roles.add(roleId);
      }
    } catch (error) {
      logger.warn('Could not update progress role', error);
    }
  }

  const progressText = lang.messages.ruleProgress
    .replace('{current}', String(ruleIndex + 1))
    .replace('{total}', String(totalRules));

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(lang.messages.rulesTitle)
    .setDescription(`**${progressText}**\n\n${lang.messages.rulesDescription}`)
    .addFields({
      name: rule.title,
      value: rule.description,
      inline: false,
    })
    .setFooter({ text: `${lang.emoji} ${lang.name}` });

  const buttons: ButtonBuilder[] = [];

  // Previous button (disabled on first rule)
  buttons.push(
    new ButtonBuilder()
      .setCustomId(`rules_nav_${lang.code}_prev_${ruleIndex}`)
      .setLabel(lang.messages.previousButton)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(isFirstRule)
  );

  if (isLastRule) {
    // Agree button on last rule
    buttons.push(
      new ButtonBuilder()
        .setCustomId(`rules_agree_${lang.code}`)
        .setLabel(lang.messages.agreeButton)
        .setStyle(ButtonStyle.Success)
    );
  } else {
    // Next button
    buttons.push(
      new ButtonBuilder()
        .setCustomId(`rules_nav_${lang.code}_next_${ruleIndex}`)
        .setLabel(lang.messages.nextButton)
        .setStyle(ButtonStyle.Primary)
    );
  }

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

  await interaction.update({
    content: '',
    embeds: [embed],
    components: [row],
  });
}

// ============================================================================
// MASTER HANDLER - Call this from interactionExtras.mts
// ============================================================================

export async function handleRulesVerification(
  interaction: ButtonInteraction | StringSelectMenuInteraction
): Promise<boolean> {
  if (interaction.isButton()) {
    return (
      (await handleRulesStart(interaction)) ||
      (await handleRuleNavigation(interaction)) ||
      (await handleRulesAgree(interaction))
    );
  }

  if (interaction.isStringSelectMenu()) {
    return await handleLanguageSelect(interaction);
  }

  return false;
}

// ============================================================================
// BOT READY HANDLER - Call this on bot ready to ensure buttons work after restart
// ============================================================================

export function registerRulesVerificationHandlers(client: Client) {
  logger.info('Rules verification handlers registered');
  // The handlers are stateless and work via customId matching
  // No additional setup needed as long as handleRulesVerification is called
  // from the interactionCreate event handler
}
