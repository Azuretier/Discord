# Azure Community - AI-Powered Discord Hub

An intelligent Discord community management system with XP tracking, role customization, and AI-powered insights, all synchronized through a modern web interface.

## 🎯 Overview

This project consists of two synchronized components powered by AI:

1. **Smart Web Application** - React-based profile cards with AI-powered insights, recommendations, and assistance
2. **Discord Bot** - Node.js bot for member management, XP tracking, and commands

Both components share data through the Spark KV store for real-time synchronization, enhanced with AI capabilities for personalized experiences.

## 🚀 Quick Start

### Web Application

The web app is already running in this Spark environment. Visit:
- `http://localhost:5173` (development)
- `azuret.me/azure-community/{userId}` (production)

### Discord Bot

See detailed setup instructions in:
- **[QUICKSTART.md](./discord-bot/QUICKSTART.md)** - Get the bot running in 5 minutes
- **[INTEGRATION.md](./discord-bot/INTEGRATION.md)** - Detailed architecture and integration guide

Quick setup:
```bash
cd discord-bot
npm install
cp .env.example .env
# Edit .env with your Discord credentials
npm run deploy-commands
npm run dev
```

## ✨ Features

### Smart Web Application
- 📊 **Profile Cards** - Beautiful profile displays with XP, level, and rank
- 🤖 **AI Personal Insights** - Personalized encouragement and progress recommendations
- 🧠 **AI Role Recommendations** - Smart suggestions for roles that match your profile
- 💬 **AI Rules Assistant** - Interactive chatbot for rules Q&A
- ✨ **AI Profile Summary** - Generate engaging bios from your achievements
- 📈 **AI Growth Tips** - Personalized activity and engagement suggestions
- 🎭 **Role Customization** - Select custom roles via intuitive interface
- 📈 **Progress Tracking** - Visual XP progress and rank advancement
- 🎨 **Modern Design** - Cyberpunk-inspired dark theme with AI-enhanced glowing accents

### Discord Bot
- 👋 **Auto Member Management** - Pre-Member role assignment on join
- 📜 **Rules System** - Interactive rule display with agreement tracking
- ⚡ **XP & Leveling** - Message-based XP with 4-tier rank system
- 🏆 **Leaderboards** - Top members by XP
- 🎭 **Role Integration** - Syncs with web-based role selection
- 🔄 **Auto-Reconnection** - Handles disconnections gracefully

## 🎮 Discord Commands

- `/profile [@user]` - View user profile card
- `/leaderboard [limit]` - View XP leaderboard
- `/rules` - Display server rules with agreement
- `/roles` - Get link to role customization
- `/reconnect` - (Admin) Re-register interactions

## 📊 XP System

**Formula:** `level = floor(sqrt(xp / 100))`

**Rank Tiers:**
- 🥉 **Accordian** - Level 0-14
- 🥈 **Arcadia** - Level 15-29
- 🥇 **Apex** - Level 30-49
- 👑 **Legendary** - Level 50+

**XP Earning:**
- 10 XP per message
- 60-second cooldown between gains

## 🤖 AI-Powered Smart Features

The web application now includes advanced AI capabilities powered by GPT-4o-mini:

### 1. **AI Personal Insights**
Get personalized encouragement and progress analysis based on your:
- Current level and rank
- XP accumulation rate
- Active roles and interests
- Membership duration

The AI provides specific suggestions for engagement and highlights upcoming milestones.

### 2. **AI Role Recommendations**
Discover roles that match your community presence:
- Analyzes your current roles and activity patterns
- Suggests 3 complementary roles with personalized explanations
- One-click role addition directly from recommendations
- Contextual reasons for each suggestion

### 3. **AI Rules Assistant**
Interactive chatbot for community guidelines:
- Ask questions about any rule in natural language
- Get instant, accurate answers with rule references
- Maintains conversation context
- Suggested questions for common queries
- Friendly, helpful tone

### 4. **AI Profile Summary Generator**
Create compelling profile bios automatically:
- Analyzes your achievements, roles, and rank
- Generates natural, engaging 2-3 sentence summaries
- One-click copy to clipboard
- Regenerate for different variations
- Highlights your unique community story

### 5. **AI Activity Analyzer**
Smart growth tips for maximum impact:
- Analyzes your XP patterns and engagement rate
- Provides 3 actionable tips categorized by type
- Impact ratings (high/medium/low) for each tip
- Specific suggestions tailored to your level
- Refreshable for new recommendations

All AI features:
- ⚡ Fast response times (2-3 seconds)
- 🎯 Contextually relevant to your profile
- 🔒 Privacy-focused (no external data sharing)
- ♻️ Refreshable for new insights
- 🎨 Beautiful, integrated UI design

## 🎭 Available Roles

### Special Roles
- ☆ଓ｡ Cutie ｡ଓ☆ - Romantic relationship term
- Luminelle - Lightbringer
- Archeborne - Exist

### Interest Roles
- Dreamer - Visionary
- Community Fan - Passionate supporter
- Thinker - Intelligent people
- Smart - Smart as it needs no explanation

### Contribution Roles
- Rising Star - Emerging talent
- Gifted - Naturally talented
- Artist - Expresser
- Creator - Creator
- Translator - Context harmony through languages

### Activity Roles
- Dream Maker - Community member

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Discord Bot    │◄───────►│  Shared KV Store │◄───────►│   Web App       │
│  (Node.js)      │         │  (Spark Runtime) │         │   (React)       │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

All user data is stored in the Spark KV store, ensuring both the bot and web app always have synchronized data.

## 📁 Project Structure

```
.
├── discord-bot/              # Discord bot repository
│   ├── src/
│   │   ├── commands/        # Slash command handlers
│   │   ├── events/          # Discord event handlers
│   │   ├── services/        # Business logic (XP, roles, KV)
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Bot entry point
│   ├── QUICKSTART.md        # Quick setup guide
│   ├── INTEGRATION.md       # Detailed integration docs
│   └── package.json
│
├── src/                     # Web application
│   ├── components/          # React components
│   │   ├── ProfileCard.tsx
│   │   ├── RoleCustomizer.tsx
│   │   └── RulesDialog.tsx
│   ├── lib/                 # Utilities and types
│   │   ├── types.ts         # Shared type definitions
│   │   ├── api.ts           # API utilities
│   │   └── sync.ts          # Bot sync functions
│   └── App.tsx              # Main application
│
└── PRD.md                   # Product requirements document
```

## 🔧 Development

### Web App
```bash
npm install
npm run dev
```

### Discord Bot
```bash
cd discord-bot
npm install
npm run dev
```

## 🚀 Deployment

### Web App
Automatically deployed via Spark platform.

### Discord Bot

**Option 1: Docker**
```bash
cd discord-bot
docker-compose up -d
```

**Option 2: Node.js**
```bash
cd discord-bot
npm run build
npm start
```

**Option 3: Process Manager (PM2)**
```bash
cd discord-bot
npm run build
pm2 start dist/index.js --name azure-bot
```

## 🔐 Environment Variables

### Bot Requirements
```env
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_GUILD_ID=your_guild_id
WEBAPP_URL=https://azuret.me
WEBAPP_API_KEY=your_api_key
```

## 📚 Documentation

- **[PRD.md](./PRD.md)** - Product requirements and design specifications
- **[discord-bot/README.md](./discord-bot/README.md)** - Bot overview and features
- **[discord-bot/QUICKSTART.md](./discord-bot/QUICKSTART.md)** - Quick setup guide
- **[discord-bot/INTEGRATION.md](./discord-bot/INTEGRATION.md)** - Architecture and integration details

## 🐛 Troubleshooting

### Bot Issues
- Check bot token is valid
- Verify required intents are enabled
- Ensure bot has Manage Roles permission
- Use `/reconnect` to re-register commands

### Web App Issues
- Clear browser cache
- Check KV store connectivity
- Verify API endpoints are accessible

### Sync Issues
- Ensure both bot and webapp use same KV store
- Check API key authentication
- Verify network connectivity

## 🎯 Future Enhancements

- ✅ AI-powered insights and recommendations (IMPLEMENTED)
- ✅ AI rules assistant chatbot (IMPLEMENTED)
- ✅ AI profile summary generation (IMPLEMENTED)
- ✅ AI activity analysis and growth tips (IMPLEMENTED)
- AI-powered auto-moderation
- Advanced analytics dashboard with AI predictions
- Custom profile card themes with AI color suggestions
- Achievement system with AI milestone recommendations
- Voice channel activity tracking
- AI sentiment analysis for community health

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
