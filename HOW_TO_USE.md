# 🚀 How to Use Azure Community Platform

**A complete guide to using and deploying your Discord bot + web app system**

---

## 📋 Table of Contents

1. [What You Have Built](#what-you-have-built)
2. [Quick Start (5 Minutes)](#quick-start-5-minutes)
3. [Web Application Usage](#web-application-usage)
4. [Discord Bot Setup](#discord-bot-setup)
5. [Deployment to Railway](#deployment-to-railway)
6. [Using the Features](#using-the-features)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 What You Have Built

You've created a complete **Discord community management system** with two synchronized parts:

### 1️⃣ **Web Application** (This Spark App)
- **URL Pattern**: `azuret.me/azure-community/{userId}`
- **Features**: Profile cards, AI insights, role customization, rules learning
- **Tech**: React + TypeScript + Spark KV storage
- **Status**: ✅ Ready to use (already running)

### 2️⃣ **Discord Bot** (in `/discord-bot` folder)
- **Features**: XP tracking, role management, rule agreements, commands
- **Tech**: Discord.js + Node.js
- **Status**: ⚠️ Needs deployment to Railway.com

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Test the Web App (Already Working!)

The web app is already running. You can:

1. **View your profile**: Just open this app and navigate through it
2. **Learn rules**: Click through the "Learn" tab to see all community rules
3. **Take quizzes**: Test your knowledge after reading rules
4. **Track progress**: See your completion status in the "Progress" tab

### Step 2: Set Up Discord Bot

```bash
# Navigate to the bot folder
cd discord-bot

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Step 3: Configure Discord Bot

Edit `discord-bot/.env` with your Discord bot credentials:

```env
# Required: Get from Discord Developer Portal
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_server_id_here

# Optional: Web app integration
WEBAPP_URL=https://azuret.me
WEBAPP_API_KEY=your_secure_api_key
```

**How to get Discord credentials:**

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" → Name it "Azure Community Bot"
3. Go to "Bot" tab → Click "Reset Token" → Copy the token (this is `DISCORD_TOKEN`)
4. Go to "OAuth2" tab → Copy "Client ID" (this is `DISCORD_CLIENT_ID`)
5. Open Discord → Right-click your server → "Copy Server ID" (this is `DISCORD_GUILD_ID`)

### Step 4: Deploy Commands & Start Bot

```bash
# Deploy slash commands to Discord
npm run deploy-commands

# Start the bot
npm run dev
```

✅ **Your bot is now running!** Test it in Discord with `/profile`

---

## 🌐 Web Application Usage

### Accessing the Web App

- **Development**: `http://localhost:5173`
- **Production**: `azuret.me/azure-community/{userId}`

### Features Overview

#### 📚 **Learn Tab** - Interactive Rule Learning
- Read through 10 community rules
- Progress automatically tracked
- Move to next rule when complete

#### 🎮 **Quiz Tab** - Test Your Knowledge
- Unlock after reading each rule
- Multiple choice questions
- Earn points for correct answers
- Get perfect score to "master" a rule

#### 🏆 **Progress Tab** - Track Your Achievement
- **AI Personal Insights**: Get personalized encouragement and milestone tracking
- **AI Role Recommendations**: Discover roles that match your profile
- View all rules at a glance
- See completion status and quiz scores
- Click any rule to jump to it

#### 📖 **Reference Tab** - Quick Rule Lookup
- **AI Rules Assistant**: Ask questions about rules in natural language
- Searchable rule list
- Filter by completion status
- Quick reference for experienced members

#### 🤖 **AI Features** (in Profile View)
- **AI Profile Summary**: Generate engaging bio from your achievements
- **AI Activity Analyzer**: Get personalized growth tips
- **AI Role Recommender**: Smart role suggestions based on your activity
- **AI Rules Chatbot**: Interactive Q&A about community guidelines

---

## 🤖 Discord Bot Setup

### Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Discord bot created in Developer Portal
- [ ] Bot invited to your server with proper permissions
- [ ] Environment variables configured

### Bot Permissions Required

When inviting the bot, it needs these permissions:
- ✅ Manage Roles
- ✅ Send Messages
- ✅ Read Message History
- ✅ Use Slash Commands
- ✅ Attach Files

**Invite URL template:**
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435456&scope=bot%20applications.commands
```
*(Replace `YOUR_CLIENT_ID` with your actual client ID)*

### Discord Intents Required

Enable these in Developer Portal → Bot → Privileged Gateway Intents:
- ✅ Server Members Intent
- ✅ Message Content Intent

### Available Discord Commands

Once the bot is running, these commands are available:

```
/profile [@user]        - View user's profile card with XP and rank
/leaderboard [limit]    - Show top members by XP (default: 10)
/rules                  - Display server rules with agreement button
/roles                  - Get link to web role customization page
/reconnect              - (Admin only) Re-register bot interactions
```

### XP System Explained

**How XP Works:**
- Earn **10 XP** per message sent
- **60-second cooldown** between XP gains
- Level formula: `level = floor(sqrt(xp / 100))`

**Rank Tiers:**
| Rank | Level Range | Icon |
|------|-------------|------|
| **Accordian** | 0-14 | 🥉 |
| **Arcadia** | 15-29 | 🥈 |
| **Apex** | 30-49 | 🥇 |
| **Legendary** | 50+ | 👑 |

**Example progression:**
- Level 1: 100 XP (10 messages)
- Level 10: 10,000 XP (1,000 messages)
- Level 50: 250,000 XP (25,000 messages)

### Role System

**Available Roles:**

**Interest & Personality:**
- ☆ଓ｡ Cutie ｡ଓ☆ - Romantic relationship term
- Dreamer - Visionary
- Community Fan - Passionate supporter
- Thinker - Intelligent people
- Smart - Smart as it needs no explanation
- Luminelle - Lightbringer
- Archeborne - Exist

**Talent & Contribution:**
- Rising Star - Emerging talent
- Gifted - Naturally talented
- Artist - Expresser
- Creator - Creator
- Translator - Context harmony through languages

**Core:**
- Dream Maker - Community member (auto-assigned)

**How to get roles:**
1. Use `/roles` command in Discord
2. Click the link to open role customization page
3. Select roles you want
4. Changes sync automatically to Discord

---

## 🚂 Deployment to Railway

### Option 1: Quick Deploy (Recommended)

1. **Go to Railway.com**
   - Visit [railway.app](https://railway.app)
   - Sign up/login with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `discord-bot` folder

3. **Add Environment Variables**
   ```
   DISCORD_TOKEN=your_bot_token
   DISCORD_CLIENT_ID=your_client_id
   DISCORD_GUILD_ID=your_guild_id
   WEBAPP_URL=https://azuret.me
   WEBAPP_API_KEY=your_api_key
   NODE_ENV=production
   ```

4. **Configure Build Settings**
   - Root Directory: `/discord-bot`
   - Build Command: `npm run build`
   - Start Command: `npm start`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - ✅ Your bot is now live 24/7!

### Option 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to bot folder
cd discord-bot

# Initialize Railway project
railway init

# Add environment variables
railway variables set DISCORD_TOKEN=your_token
railway variables set DISCORD_CLIENT_ID=your_client_id
railway variables set DISCORD_GUILD_ID=your_guild_id

# Deploy
railway up
```

### Option 3: Docker (Self-Hosted)

```bash
cd discord-bot

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 🎮 Using the Features

### For Server Members

#### 1. **Join the Server**
   - Automatically receive "Pre-Member" role
   - See rules button in welcome channel

#### 2. **Read & Agree to Rules**
   - Click "View Rules" button
   - Read through all rules
   - Click "I Agree" button
   - Receive "Member" role automatically

#### 3. **Earn XP & Level Up**
   - Chat naturally in any channel
   - Earn 10 XP per message
   - Watch your level increase
   - Advance through rank tiers

#### 4. **Customize Your Roles**
   - Use `/roles` command
   - Select personality/interest roles
   - Changes apply instantly

#### 5. **View Your Profile**
   - Use `/profile` in Discord
   - Or visit `azuret.me/azure-community/{your-user-id}`
   - See your XP, level, rank, and roles

#### 6. **Check Leaderboard**
   - Use `/leaderboard` to see top members
   - Use `/leaderboard 20` for top 20

#### 7. **Learn Rules (Web App)**
   - Open the web application
   - Go through rules one by one
   - Take quizzes to test knowledge
   - Earn points and master rules

#### 8. **Use AI Features (Web App)**
   - Get personalized insights about your progress
   - Ask the AI assistant questions about rules
   - Generate profile summaries
   - Receive role recommendations
   - Get activity growth tips

### For Server Admins

#### 1. **Set Up Roles**
Create these roles in your Discord server:
- `Pre-Member` (no permissions)
- `Member` (basic permissions)
- All custom roles listed above

#### 2. **Set Up Channels**
- Create welcome channel
- Add rules display channel
- Configure permissions for Pre-Member vs Member

#### 3. **Monitor the Bot**
```bash
# Check bot logs
cd discord-bot
npm run dev

# Or on Railway
# View logs in Railway dashboard
```

#### 4. **Use Admin Commands**
- `/reconnect` - Fix button interactions after bot restart
- Use this when buttons stop working

---

## 🔧 Troubleshooting

### Bot Issues

#### ❌ Bot not responding to commands
**Solution:**
```bash
cd discord-bot
npm run deploy-commands
```
Then restart the bot.

#### ❌ Buttons not working
**Solution:**
Use `/reconnect` command in Discord (admin only)

#### ❌ Bot can't assign roles
**Solution:**
1. Check bot role is above the roles it's trying to assign
2. Verify "Manage Roles" permission is enabled
3. Check role hierarchy in Server Settings → Roles

#### ❌ Bot disconnects frequently
**Solution:**
- Deploy to Railway or other hosting (free tier local hosting times out)
- Check your internet connection
- Verify Discord API status

### Web App Issues

#### ❌ Profile not loading
**Solution:**
- Check user ID is correct
- Ensure user has interacted with bot at least once
- Verify KV store is accessible

#### ❌ Roles not syncing
**Solution:**
- Check WEBAPP_API_KEY is set correctly
- Verify bot has Manage Roles permission
- Check network connectivity between bot and web app

#### ❌ XP not updating
**Solution:**
- Wait 60 seconds between messages (cooldown)
- Check bot is online and receiving messages
- Verify Message Content Intent is enabled

### Railway Deployment Issues

#### ❌ Build fails
**Solution:**
- Check `package.json` has correct scripts
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

#### ❌ Bot crashes on Railway
**Solution:**
- Check environment variables are set
- View logs in Railway dashboard
- Ensure `NODE_ENV=production` is set

#### ❌ Running out of free hours
**Solution:**
- Upgrade to Railway Pro ($5/month)
- Or use Docker on your own server
- Or use other hosting (Heroku, DigitalOcean, etc.)

---

## 📊 Data Synchronization

### How It Works

Both the Discord bot and web app share data through **Spark KV Store**:

```
Discord Bot                 Spark KV Store                  Web App
    │                             │                            │
    ├─ User sends message         │                            │
    ├─ Add XP ──────────────────► │ ──────────────────────────►│
    │                             │                            │ Display
    │                             │ ◄─────────────────────────┤ updated
    │                             │    Fetch user data         │ profile
    │                             │                            │
    │                             │                            ├─ User selects role
    │ Assign role ◄───────────────│ ◄─────────────────────────┤
    │                                                          │
```

### Data Structure

**Stored in KV:**
```typescript
{
  "user:{userId}": {
    xp: 1500,
    level: 12,
    rank: "Accordian",
    roles: ["Dreamer", "Artist", "Community Fan"],
    rulesAgreed: true,
    lastXpGain: "2024-01-15T10:30:00Z"
  }
}
```

---

## 🎯 Next Steps

### Immediate Actions
1. ✅ Deploy bot to Railway (follow section above)
2. ✅ Invite bot to your Discord server
3. ✅ Create required roles in Discord
4. ✅ Test with `/profile` command
5. ✅ Share web app link with members

### Optional Enhancements
- 🎨 Customize web app colors in `src/index.css`
- 📝 Modify rules in `src/lib/rules.ts`
- 🎭 Add more custom roles
- 🤖 Enhance AI prompts for better personalization
- 📊 Add more quiz questions
- 🏆 Create custom achievements

---

## 📚 Additional Resources

- **[PROJECT_README.md](./PROJECT_README.md)** - Complete project overview
- **[discord-bot/QUICKSTART.md](./discord-bot/QUICKSTART.md)** - Detailed bot setup
- **[discord-bot/INTEGRATION.md](./discord-bot/INTEGRATION.md)** - Architecture details
- **[PRD.md](./PRD.md)** - Product requirements
- **[Discord.js Guide](https://discordjs.guide/)** - Learn Discord bot development
- **[Railway Docs](https://docs.railway.app/)** - Learn Railway deployment

---

## 💡 Tips & Best Practices

### For Best Performance
1. Deploy bot to Railway (don't run locally 24/7)
2. Use `/reconnect` after every bot restart
3. Keep bot token secret (never commit to Git)
4. Monitor bot logs regularly
5. Back up your data periodically

### For Best User Experience
1. Clear rules and expectations
2. Respond to member questions quickly
3. Celebrate level-ups and milestones
4. Keep leaderboard visible
5. Use AI features to engage members

### Security
- 🔒 Never share your Discord bot token
- 🔒 Use strong API keys
- 🔒 Don't commit `.env` files
- 🔒 Rotate tokens if compromised
- 🔒 Limit admin commands to admins only

---

## 🆘 Getting Help

### Quick Debug Checklist
- [ ] Bot is online in Discord
- [ ] Bot has required permissions
- [ ] Required intents are enabled
- [ ] Environment variables are set
- [ ] Commands are deployed (`npm run deploy-commands`)
- [ ] Roles exist in server
- [ ] Bot role is high enough in hierarchy

### Common Error Messages

**"Missing Permissions"**
→ Bot needs Manage Roles permission and must be higher in role hierarchy

**"Unknown Interaction"**
→ Button expired or bot restarted. Use `/reconnect`

**"Invalid Token"**
→ Check DISCORD_TOKEN in .env file

**"Unknown Guild"**
→ Check DISCORD_GUILD_ID matches your server

---

## ✅ Success Checklist

Your system is fully working when:

- [ ] Web app loads at your domain
- [ ] `/profile` shows user data in Discord
- [ ] New members get Pre-Member role
- [ ] Rules button displays and works
- [ ] Agreement grants Member role
- [ ] XP increases when chatting
- [ ] Level ups display correct rank
- [ ] `/leaderboard` shows accurate data
- [ ] Role selection syncs to Discord
- [ ] AI features provide relevant insights
- [ ] No errors in bot logs

---

## 🎉 You're All Set!

Your Azure Community platform is now ready to use. Enjoy your AI-powered Discord community! 

**Questions?** Check the other documentation files or open an issue on GitHub.

**Happy community building! 🚀**
