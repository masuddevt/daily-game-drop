# 🎮 Daily Game Drop

A website that automatically adds a **new browser game every single day** — powered by Claude AI and GitHub Actions. Zero effort after initial setup.

---

## ✅ One-Time Setup (Takes ~10 minutes)

### Step 1 — Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon → **New repository**
3. Name it anything, e.g. `daily-game-drop`
4. Set it to **Public** (required for free GitHub Pages)
5. Click **Create repository**

---

### Step 2 — Upload These Files

1. On your new repo page, click **uploading an existing file**
2. Drag and drop **all the files/folders** from this zip
3. Click **Commit changes**

---

### Step 3 — Add Your Claude API Key

1. Go to [platform.anthropic.com](https://platform.anthropic.com) and sign up (free)
2. Go to **API Keys** → create a new key → copy it
3. In your GitHub repo, go to **Settings → Secrets and variables → Actions**
4. Click **New repository secret**
5. Name: `ANTHROPIC_API_KEY`
6. Value: paste your API key
7. Click **Add secret**

---

### Step 4 — Enable GitHub Pages

1. In your repo, go to **Settings → Pages**
2. Under **Source**, select **Deploy from a branch**
3. Branch: `main`, folder: `/ (root)`
4. Click **Save**
5. Wait 1-2 minutes — your site will be live at:
   `https://YOUR-USERNAME.github.io/daily-game-drop`

---

### Step 5 — Test It Right Now (Optional)

Don't want to wait until midnight? Run it manually:

1. Go to your repo → **Actions** tab
2. Click **🎮 Daily Game Generator** in the left sidebar
3. Click **Run workflow** → **Run workflow**
4. Watch it generate your first game in ~30 seconds!

---

## 🔄 How It Works (Automatic After Setup)

Every day at **midnight UTC**, GitHub Actions:
1. Wakes up on GitHub's servers (your computer stays off)
2. Calls the Claude AI API with a game prompt
3. Claude generates a complete, playable HTML game
4. The script saves it to `games/day-X/index.html`
5. Updates `games.json` so the homepage lists it
6. Commits and pushes — your site updates live

**Your computer never needs to be on.**

---

## 💰 Cost Estimate

Each daily game call uses ~3,000 tokens with Claude Haiku:
- ~$0.01–$0.02 per day
- ~$0.40 per month
- New API accounts get **$5 free credits** = ~12 months free

---

## 📁 File Structure

```
your-repo/
├── index.html              ← Homepage (auto-updated)
├── games.json              ← Game list (auto-updated)
├── generate-game.js        ← AI generation script
├── games/
│   ├── day-1/index.html    ← Auto-generated
│   ├── day-2/index.html    ← Auto-generated
│   └── ...
└── .github/
    └── workflows/
        └── daily-game.yml  ← The scheduler
```

---

## 🛠️ Customization

**Change the schedule** — edit `daily-game.yml`:
```yaml
- cron: '0 12 * * *'   # noon UTC instead of midnight
```

**Change game style** — edit the `gameConcepts` array in `generate-game.js` to add your own ideas.

---

Built with ❤️ by Claude AI
