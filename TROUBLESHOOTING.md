# 🔧 Troubleshooting Guide

## Quick Diagnostic Flowchart

```
Is your issue with...

┌─────────────┬─────────────┬─────────────┬─────────────┐
│   Bot Not   │   Commands  │    XP Not   │    Roles    │
│  Responding │  Not Found  │   Updating  │ Not Working │
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────┘
       │             │              │             │
       ▼             ▼              ▼             ▼
   [Section A]  [Section B]    [Section C]   [Section D]
```

---

## Section A: Bot Not Responding

### Symptom
Bot shows as online but doesn't respond to commands or messages

### Diagnostic Steps

```
1. Is the bot online in Discord?
   ├─ NO → Check Railway deployment or restart bot
   └─ YES → Continue

2. Run this command in Discord: /profile
   ├─ "Unknown Interaction" → Go to Step 3
   ├─ Nothing happens → Go to Step 4
   └─ Works fine → Bot is working! Issue elsewhere

3. Deploy commands:
   cd discord-bot
   npm run deploy-commands
   └─ Restart bot → Try /profile again

4. Check bot logs:
   railway logs (or npm run dev output)
   ├─ See errors? → Go to Section F (Error Messages)
   └─ No logs? → Bot isn't receiving events
```

### Solutions

#### Bot offline in Discord
```bash
# Check if bot process is running
ps aux | grep node

# Restart on Railway
railway restart

# Restart locally
cd discord-bot
npm run dev
```

#### Commands not registered
```bash
cd discord-bot
npm run deploy-commands
# Wait for "Successfully registered X commands"
# Then restart bot
```

#### Bot token invalid
```bash
# In discord-bot/.env
# Get new token from Discord Developer Portal
DISCORD_TOKEN=your_new_token_here
```

---

## Section B: Commands Not Found

### Symptom
When typing `/profile`, no autocomplete appears

### Diagnostic Steps

```
1. Are slash commands enabled?
   Developer Portal → Bot → Privileged Gateway Intents
   └─ Enable "Server Members Intent" ✓

2. Was bot invited with correct scope?
   Invite URL must include: scope=bot applications.commands
   └─ Check invite URL in Section G

3. Were commands deployed?
   cd discord-bot
   npm run deploy-commands
   └─ See "Successfully registered" message?

4. Is DISCORD_GUILD_ID correct?
   .env file: DISCORD_GUILD_ID should match your server ID
   └─ Right-click server → Copy Server ID
```

### Solutions

#### Re-invite bot with correct permissions
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435456&scope=bot%20applications.commands
```

#### Deploy commands to correct server
```bash
cd discord-bot

# Edit .env - verify DISCORD_GUILD_ID
DISCORD_GUILD_ID=your_actual_server_id

# Deploy commands
npm run deploy-commands

# Should see:
# ✓ Successfully registered 5 application commands
```

#### Reset application commands
```bash
# In Discord Developer Portal
Applications → Your Bot → General Information
→ Delete all commands
→ Then run: npm run deploy-commands
```

---

## Section C: XP Not Updating

### Symptom
Users send messages but XP doesn't increase

### Diagnostic Steps

```
1. Check Message Content Intent
   Developer Portal → Bot → Privileged Gateway Intents
   └─ "Message Content Intent" must be ENABLED ✓

2. Is there a 60-second cooldown?
   XP only awarded once per 60 seconds
   └─ Wait 60 seconds and try again

3. Check bot logs when message sent
   npm run dev → Send message → See any logs?
   ├─ No logs → Bot not receiving messages (go to Step 4)
   └─ Logs appear → Bot is working

4. Check bot permissions in channel
   Right-click channel → Edit Channel → Permissions
   └─ Bot needs "Read Messages" and "Read Message History"
```

### Solutions

#### Enable Message Content Intent
1. Go to Discord Developer Portal
2. Your Application → Bot
3. Scroll to "Privileged Gateway Intents"
4. Enable "Message Content Intent"
5. **IMPORTANT**: Restart bot after enabling

#### Verify cooldown behavior
```typescript
// XP is only awarded if:
// - 60 seconds have passed since last XP gain
// - User sends a message
// - Message is not from a bot

// Check last XP timestamp:
const user = await spark.kv.get(`user:${userId}`)
console.log(user.lastXpGain)
// Should be more than 60 seconds ago
```

#### Check bot can read messages
```bash
# Test in bot code (discord-bot/src/events/messageCreate.ts)
client.on('messageCreate', (message) => {
  console.log('Message received:', message.content)
  // If you don't see this, bot isn't receiving messages
})
```

---

## Section D: Roles Not Working

### Symptom
Bot can't assign roles or roles disappear

### Diagnostic Steps

```
1. Check role hierarchy
   Server Settings → Roles
   └─ Bot's role MUST be ABOVE roles it assigns

2. Check bot permissions
   Server Settings → Roles → [Bot Role]
   └─ "Manage Roles" permission ✓

3. Check role names match exactly
   Discord role name must match exactly (case-sensitive)
   └─ "Member" ≠ "member" ≠ "Members"

4. Check role exists
   Server Settings → Roles
   └─ Does "Pre-Member" role exist?
      Does "Member" role exist?
```

### Solutions

#### Fix role hierarchy
```
Server Settings → Roles → Drag to reorder

✓ CORRECT:              ❌ WRONG:
1. Admin                1. Admin
2. Moderator            2. Member
3. [Bot Role] ←HERE     3. Pre-Member
4. Member               4. [Bot Role] ←Bot too low!
5. Pre-Member
```

#### Create missing roles
```
Server Settings → Roles → Create Role

Required roles:
- Pre-Member (assign to new members)
- Member (assign after rules agreement)

Optional custom roles:
- Dreamer, Artist, Creator, etc.
```

#### Check permissions
```
Server Settings → Roles → [Your Bot's Role]

Required permissions:
✓ Manage Roles
✓ Send Messages
✓ Read Messages
✓ Read Message History
✓ Attach Files
```

---

## Section E: Web App Issues

### Symptom
Web app not loading or showing errors

### Diagnostic Steps

```
1. Is Spark dev server running?
   npm run dev
   └─ Should see "Local: http://localhost:5173"

2. Is the correct user ID in URL?
   azuret.me/azure-community/{userId}
   └─ Check user ID format (should be Discord ID)

3. Check browser console for errors
   F12 → Console tab
   └─ See any red errors?

4. Is KV store accessible?
   Check if useKV hook is working
   └─ Look for "KV error" in console
```

### Solutions

#### Start dev server
```bash
# Make sure you're in project root
npm install
npm run dev

# Should see:
# ➜  Local:   http://localhost:5173/
# ➜  press h + enter to show help
```

#### Clear cache
```bash
# In browser
Ctrl+Shift+Delete → Clear cache

# Or hard refresh
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

#### Check KV store
```typescript
// In browser console
const [value] = useKV('test-key', 'default')
console.log(value)
// Should show 'default' if working
```

---

## Section F: Error Messages

### "Missing Permissions"

**Cause**: Bot doesn't have required permissions

**Solution**:
```
1. Check bot role permissions:
   Server Settings → Roles → [Bot Role]
   → Enable "Manage Roles" ✓

2. Check role hierarchy (bot role must be high)

3. Re-invite bot with permissions:
   Use invite URL from Section G
```

---

### "Unknown Interaction"

**Cause**: Interaction token expired or bot restarted

**Solution**:
```bash
# Use /reconnect command in Discord (admin only)
/reconnect

# Or restart bot
cd discord-bot
npm run dev

# Buttons should work again
```

---

### "Invalid Token" or "Incorrect login credentials"

**Cause**: Discord bot token is wrong or expired

**Solution**:
```bash
# Get new token from Discord Developer Portal
1. Applications → Your Bot → Bot → Reset Token
2. Copy new token
3. Update discord-bot/.env:
   DISCORD_TOKEN=your_new_token_here
4. Restart bot
```

---

### "Missing Access"

**Cause**: Bot can't access channel or role

**Solution**:
```
1. Check bot can see channel:
   Right-click channel → Edit Channel → Permissions
   → Add bot role → Enable "View Channel"

2. Check bot can manage role:
   Server Settings → Roles
   → Drag bot role above target role
```

---

### "Unknown Guild"

**Cause**: DISCORD_GUILD_ID doesn't match server

**Solution**:
```bash
# Get correct server ID
1. Enable Developer Mode: Settings → Advanced → Developer Mode
2. Right-click your server → Copy Server ID
3. Update discord-bot/.env:
   DISCORD_GUILD_ID=your_server_id_here
4. Restart bot
```

---

### "Rate Limited"

**Cause**: Too many API requests in short time

**Solution**:
```
This is usually automatic and resolves in a few seconds.

If persistent:
- Reduce XP tracking frequency
- Add request delays
- Check for infinite loops in code
```

---

## Section G: Invite & Setup Checklist

### ✅ Complete Setup Checklist

```
□ Created bot in Discord Developer Portal
□ Enabled "Server Members Intent"
□ Enabled "Message Content Intent"
□ Copied bot token to .env
□ Copied client ID to .env
□ Copied guild/server ID to .env
□ Invited bot with correct URL (below)
□ Created "Pre-Member" role in Discord
□ Created "Member" role in Discord
□ Bot role is high in role hierarchy
□ Bot has "Manage Roles" permission
□ Ran "npm run deploy-commands"
□ Started bot with "npm run dev"
□ Tested /profile command
□ Tested XP gain (wait 60 seconds between messages)
□ Tested rules agreement flow
```

### Correct Invite URL

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435456&scope=bot%20applications.commands
```

**Replace `YOUR_CLIENT_ID` with your actual client ID from .env**

### Permissions Breakdown
- `268435456` = Manage Roles + Send Messages + Read Messages + Read Message History + Attach Files + Use Slash Commands

---

## Section H: Logs & Debugging

### Bot Logs (Local Development)

```bash
cd discord-bot
npm run dev

# Watch for:
✓ "Bot is ready!"
✓ "Logged in as YourBot#1234"
✓ "Registered X commands"

# When user sends message:
✓ "Message from User#1234: hello"
✓ "Added 10 XP to User#1234"
✓ "User is now level 5"
```

### Bot Logs (Railway Production)

```bash
# View live logs
railway logs

# Or in Railway dashboard
→ Your Project → View Logs

# Download logs
railway logs > bot-logs.txt
```

### Web App Logs (Browser Console)

```javascript
// Press F12 → Console tab

// Look for:
✓ "KV: Loaded user data"
✓ "Profile: User#1234, XP: 1500"

// Errors to watch for:
❌ "KV error: ..."
❌ "API error: ..."
❌ "Failed to fetch user data"
```

### Enable Debug Mode

```bash
# In discord-bot/.env
DEBUG=true

# Shows extra logs:
- All Discord API calls
- KV store operations
- XP calculations
- Role assignments
```

---

## Section I: Common Mistakes

### ❌ Mistake 1: Bot token in code
```typescript
// DON'T DO THIS:
const token = "MTIzNDU2Nzg5..."

// DO THIS:
const token = process.env.DISCORD_TOKEN
```

### ❌ Mistake 2: Wrong guild ID format
```bash
# WRONG (with quotes in .env)
DISCORD_GUILD_ID="123456789"

# CORRECT (no quotes)
DISCORD_GUILD_ID=123456789
```

### ❌ Mistake 3: Not restarting after changes
```bash
# After editing .env or code:
# ALWAYS restart the bot
Ctrl+C
npm run dev
```

### ❌ Mistake 4: Bot role too low
```
# Role hierarchy matters!
# Bot must be ABOVE roles it manages
# Drag bot role higher in Server Settings → Roles
```

### ❌ Mistake 5: Forgetting to deploy commands
```bash
# After adding new commands:
npm run deploy-commands
# Then restart bot
```

---

## Section J: Getting More Help

### Check Documentation
- [HOW_TO_USE.md](./HOW_TO_USE.md) - Complete guide
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Command reference
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [discord-bot/QUICKSTART.md](./discord-bot/QUICKSTART.md) - Bot setup

### External Resources
- [Discord.js Guide](https://discordjs.guide/) - Discord bot development
- [Discord Developer Portal](https://discord.com/developers/docs) - API reference
- [Railway Docs](https://docs.railway.app/) - Deployment help

### Debug Commands

```bash
# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version

# Check if port 5173 is in use
lsof -i :5173

# Check if bot process is running
ps aux | grep node

# Check environment variables loaded
cd discord-bot
node -e "require('dotenv').config(); console.log(process.env.DISCORD_TOKEN)"
```

---

## Section K: Emergency Recovery

### If everything breaks...

```bash
# 1. Stop all processes
killall node

# 2. Clean install
cd /workspaces/spark-template
rm -rf node_modules
npm install

cd discord-bot
rm -rf node_modules
npm install

# 3. Verify .env file
cat discord-bot/.env
# Make sure all 5 variables are set

# 4. Deploy commands fresh
cd discord-bot
npm run deploy-commands

# 5. Start bot
npm run dev

# 6. Test in Discord
/profile

# 7. Start web app
cd ..
npm run dev
```

### Nuclear Option: Complete Reset

```bash
# ⚠️ WARNING: This erases all data
# Only use if absolutely necessary

# 1. Delete all data from KV store
# (Run in browser console on web app)
const keys = await spark.kv.keys()
for (const key of keys) {
  await spark.kv.delete(key)
}

# 2. Delete bot from Discord server
Server Settings → Integrations → [Your Bot] → Remove

# 3. Delete all slash commands
Discord Developer Portal → Applications → Your Bot
→ Delete application

# 4. Start fresh from Section G
```

---

**Still having issues? Check [HOW_TO_USE.md](./HOW_TO_USE.md) or review bot logs for specific errors.**
