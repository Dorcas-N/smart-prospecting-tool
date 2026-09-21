# ⚡ Quick Start - Deploy in 5 Minutes

**Fast track deployment guide for Smart Prospecting Tool**

---

## What You Need

✅ Your website/portfolio URL  
✅ Claude API key (get from https://console.anthropic.com)  
✅ Vibe Prospecting API key (optional)  
✅ GitHub account  
✅ Node.js 18+ installed  

---

## Step 1: Create GitHub Repo (1 min)

```bash
# Create new repo at github.com/new
# Name: smart-prospecting-tool
# Public or Private: your choice

# Clone it
git clone https://github.com/yourusername/smart-prospecting-tool.git
cd smart-prospecting-tool

# Copy all files from this template into the directory
```

---

## Step 2: Setup Supabase (2 mins)

1. Go to https://supabase.com
2. Click "New Project"
   - Name: `smart-prospecting-tool`
   - Password: (strong password)
   - Region: **Europe (Paris)** ← Important!
   - Click "Create new project"
3. Wait 5-10 minutes for creation

**Once ready:**

4. Go to **Settings → API**
   - Copy `Project URL` (e.g., `https://xxx.supabase.co`)
   - Copy `anon public` key (starts with `eyJ...`)

5. Go to **Settings → Secrets**
   - Click "Add secret"
   - Name: `CLAUDE_API_KEY`
   - Value: `sk-ant-api03-...` (your Claude key)
   - Click "Add secret"
   - Name: `VIBE_PROSPECTING_API_KEY`
   - Value: (your Vibe key, or leave empty for demo)

---

## Step 3: Configure App (2 mins)

```bash
# Create .env.local
echo "VITE_SUPABASE_URL=https://your-project.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=eyJ..." >> .env.local

# Replace with your actual values from Step 2
```

---

## Step 4: Deploy Edge Functions (1 min)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project (get Project ID from Supabase Dashboard → Settings)
supabase link --project-ref YOUR_PROJECT_ID

# Deploy the 3 functions
supabase functions deploy analyze-website
supabase functions deploy get-prospects
supabase functions deploy generate-message

# You should see 3 green checkmarks ✓
```

---

## Step 5: Build & Deploy (1 min)

```bash
# Install dependencies
npm install

# Build
npm run build

# Verify dist/ folder was created

# Push to GitHub
git add .
git commit -m "Deploy: Smart Prospecting Tool"
git push origin main
```

---

## Step 6: Enable GitHub Pages (1 min)

1. Go to your GitHub repo → **Settings**
2. Left sidebar → **Pages**
3. Source: Select **Deploy from a branch**
4. Branch: `main`
5. Folder: `/` (root)
6. Click **Save**

---

## Step 7: Test It 🎉

Wait 2-3 minutes, then visit:

```
https://yourusername.github.io/smart-prospecting-tool
```

### Test the Tool:
1. Go to **ICP Generator** tab
2. Paste your portfolio URL
3. Click "Analyze Website"
4. You should see your ICP generated!
5. Go to **Smart Prospecting** tab
6. Click "Load Prospects for Today"
7. See 15 prospects with scores
8. Expand one → click "Generate Message"
9. Copy the message
10. Paste in LinkedIn DM

✅ **It works!** You're done!

---

## 🔐 Security Checklist

Before sharing your tool:
- [ ] `.env.local` is NOT in Git (check `.gitignore`)
- [ ] API keys are in Supabase Secrets only
- [ ] GitHub repo has `.env` in `.gitignore`
- [ ] No API keys visible in GitHub
- [ ] All 3 Edge Functions deployed successfully

---

## 🆘 Troubleshooting

### "Supabase URL not found"
→ Check `.env.local` has correct URL  
→ Restart dev server: `npm run dev`

### "Unauthorized" from Edge Functions
→ Verify secrets set in Supabase  
→ Redeploy: `supabase functions deploy analyze-website --force`

### "GitHub Pages shows 404"
→ Check Settings → Pages → Source is set to `main /`  
→ Wait 3-5 minutes for deployment

### Nothing loads on GitHub Pages
→ Check browser console (F12 → Console)  
→ Verify `.env.local` is NOT committed  
→ Try viewing `dist/index.html` directly

---

## 📞 Next Steps

Once deployed:

1. **Customize ICP** with your actual website
2. **Test messages** - send 3-5 test invitations
3. **Monitor acceptance rate** in Pipeline tab
4. **Scale to 15/day** once validated
5. **Export results** to CSV for your CRM

---

## 🚀 You're Live!

Your Smart Prospecting Tool is now deployed on GitHub Pages.

**Next:**
- Read README.md for all features
- Check SETUP.md for advanced config
- Review DEPLOYMENT_CHECKLIST.md to verify everything

**Go find those ideal customers!** 💪
