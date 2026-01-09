# 🚀 Quick Reference Card

## Essential Commands

### Discord Bot Setup
```bash
cd discord-bot
npm install
cp .env.example .env
# Edit .env file with your credentials
npm run deploy-commands
npm run dev
```

### Web App Setup
```bash
npm install
npm run dev
# Open http://localhost:5173
```

---

## Discord Bot Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/profile [@user]` | View profile card | `/profile @username` |
| `/leaderboard [limit]` | Show XP rankings | `/leaderboard 20` |
| `/rules` | Display server rules | `/rules` |
| `/roles` | Get role customization link | `/roles` |
| `/reconnect` | Re-register interactions (admin) | `/reconnect` |

---

## Environment Variables (Required)

```env
# Discord Bot Token from Developer Portal
DISCORD_TOKEN=your_bot_token_here

# Application Client ID from Developer Portal
DISCORD_CLIENT_ID=your_client_id_here

# Your Discord Server ID (right-click server → Copy ID)
DISCORD_GUILD_ID=your_guild_id_here

# Your web app URL
WEBAPP_URL=https://azuret.me

# Secure API key (any random string)
WEBAPP_API_KEY=your_secure_random_key
```

---

## Getting Discord Credentials

### 1. Create Bot Application
1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "Azure Community Bot"

### 2. Get Bot Token
1. Go to "Bot" tab
2. Click "Reset Token"
3. Copy token → This is `DISCORD_TOKEN`

### 3. Get Client ID
1. Go to "OAuth2" tab
2. Copy "Client ID" → This is `DISCORD_CLIENT_ID`

### 4. Enable Intents
1. Go to "Bot" tab
2. Enable "Server Members Intent"
3. Enable "Message Content Intent"

### 5. Get Server ID
1. Open Discord
2. Enable Developer Mode (Settings → Advanced → Developer Mode)
3. Right-click your server
4. Click "Copy Server ID" → This is `DISCORD_GUILD_ID`

### 6. Invite Bot to Server
Use this URL (replace `YOUR_CLIENT_ID`):
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435456&scope=bot%20applications.commands
```

---

## Deploy to Railway (5 Minutes)

### Step 1: Sign Up
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### Step 2: Create Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository
- Set root directory to `discord-bot`

### Step 3: Add Environment Variables
Add all 5 variables from above (DISCORD_TOKEN, etc.)

### Step 4: Configure Build
- Build Command: `npm run build`
- Start Command: `npm start`

### Step 5: Deploy
- Click "Deploy"
- Wait 2-3 minutes
- ✅ Bot is now online 24/7!

---

## XP System Quick Reference

| Action | XP Gained | Cooldown |
|--------|-----------|----------|
| Send message | 10 XP | 60 seconds |

### Level Formula
```
level = floor(sqrt(xp / 100))
```

### Rank Tiers
| Rank | Level Range | Icon |
|------|-------------|------|
| Accordian | 0-14 | 🥉 |
| Arcadia | 15-29 | 🥈 |
| Apex | 30-49 | 🥇 |
| Legendary | 50+ | 👑 |

### Level Milestones
- Level 1: 100 XP (10 messages)
- Level 5: 2,500 XP (250 messages)
- Level 10: 10,000 XP (1,000 messages)
- Level 20: 40,000 XP (4,000 messages)
- Level 50: 250,000 XP (25,000 messages)

---

## Required Discord Roles

Create these roles in your Discord server:

### System Roles (Required)
- `Pre-Member` - Assigned on join
- `Member` - Assigned after rules agreement

### Custom Roles (Optional but Recommended)
- ☆ଓ｡ Cutie ｡ଓ☆
- Luminelle
- Dreamer
- Community Fan
- Thinker
- Smart
- Rising Star
- Gifted
- Artist
- Creator
- Translator
- Archeborne
- Dream Maker

---

## Troubleshooting Checklist

### Bot Not Responding
- [ ] Check bot is online in Discord
- [ ] Run `npm run deploy-commands`
- [ ] Restart bot
- [ ] Check `DISCORD_TOKEN` is correct

### Buttons Not Working
- [ ] Use `/reconnect` command
- [ ] Check bot has "Manage Roles" permission
- [ ] Verify bot role is high in hierarchy

### Roles Not Assigned
- [ ] Check role names match exactly
- [ ] Bot role must be above roles it assigns
- [ ] Verify "Manage Roles" permission

### XP Not Updating
- [ ] Wait 60 seconds between messages (cooldown)
- [ ] Check "Message Content Intent" is enabled
- [ ] Verify bot can read messages in channel

---

## File Structure

```
.
├── HOW_TO_USE.md           👈 Complete guide
├── README.md               Overview
├── PROJECT_README.md       Full documentation
├── PRD.md                  Product requirements
│
├── src/                    Web application
│   ├── App.tsx            Main app
│   ├── components/        UI components
│   └── lib/               Utilities
│
└── discord-bot/           Discord bot
    ├── QUICKSTART.md      5-minute setup
    ├── INTEGRATION.md     Architecture
    ├── src/               Bot source code
    └── .env.example       Config template
```

---

## Support Links

- **Discord Developer Portal**: [discord.com/developers](https://discord.com/developers/applications)
- **Railway**: [railway.app](https://railway.app)
- **Discord.js Guide**: [discordjs.guide](https://discordjs.guide/)
- **Full Documentation**: [HOW_TO_USE.md](./HOW_TO_USE.md)

---

## One-Liner Commands

```bash
# Test web app locally
npm install && npm run dev

# Test bot locally
cd discord-bot && npm install && npm run dev

# Deploy commands to Discord
cd discord-bot && npm run deploy-commands

# Build for production
cd discord-bot && npm run build && npm start

# View bot logs on Railway
railway logs

# Quick bot restart
pm2 restart azure-bot
```

---

**For complete instructions, see [HOW_TO_USE.md](./HOW_TO_USE.md)**
