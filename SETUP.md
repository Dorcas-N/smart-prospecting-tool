# 📚 Complete Setup Guide

**Detailed step-by-step setup for Smart Prospecting Tool**

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Repository Setup](#repository-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [API Keys Setup](#api-keys-setup)
5. [Edge Functions Deployment](#edge-functions-deployment)
6. [Local Development](#local-development)
7. [GitHub Pages Deployment](#github-pages-deployment)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- Node.js 18 or higher
- npm or yarn
- Git

### Required Accounts
- GitHub account (for hosting)
- Supabase account (free tier works)
- Claude API key from Anthropic
- Vibe Prospecting API key (optional - demo works without it)

### Check Your Setup
```bash
node --version  # Should be v18+
npm --version   # Should be 9+
git --version   # Should be 2.x+
```

---

## Repository Setup

### Clone the Repository
```bash
# Clone the template
git clone https://github.com/yourusername/smart-prospecting-tool.git
cd smart-prospecting-tool

# Verify all files are there
ls -la  # You should see src/, supabase/, .github/, etc.
```

### Verify File Structure
```
smart-prospecting-tool/
├── src/
│   ├── components/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── supabase/
│   └── functions/
│       ├── analyze-website/
│       ├── get-prospects/
│       └── generate-message/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## Supabase Configuration

### Create Supabase Project

1. Go to https://supabase.com
2. Sign in or create account
3. Click "New Project"
4. Fill in:
   - **Project Name**: `smart-prospecting-tool`
   - **Password**: Create a strong password (save it!)
   - **Region**: Europe (Paris) ← **IMPORTANT**
5. Click "Create new project"
6. Wait 5-10 minutes for creation (you'll see a progress bar)

### Get Your Supabase Credentials

1. Once project is created, go to **Settings** (bottom left)
2. Click **API** tab
3. You'll see:
   - **Project URL**: Copy this (e.g., `https://abcdef123456.supabase.co`)
   - **Key / anon / public**: Copy this (e.g., `eyJ...`)

### Create Local .env File

```bash
# Copy the template
cp .env.example .env.local

# Edit the file with your credentials
# On macOS/Linux:
nano .env.local

# Add your Supabase credentials:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJ...
```

**Save the file** (Ctrl+S or Cmd+S)

### Verify .gitignore

Check that `.gitignore` has these lines:
```
.env
.env.local
.env.*.local
```

This ensures your secrets are never committed to GitHub.

---

## API Keys Setup

### Add Secrets to Supabase

Supabase Secrets are environment variables accessible only by your Edge Functions (not your frontend).

1. In Supabase Dashboard, go to **Settings** → **Secrets**
2. Click "New secret"

**Secret 1: Claude API Key**
- Name: `CLAUDE_API_KEY`
- Value: `sk-ant-api03-...` (your full Claude key)
- Click "Add secret"

**Secret 2: Vibe Prospecting API Key** (Optional)
- Name: `VIBE_PROSPECTING_API_KEY`
- Value: `your-vibe-key-here`
- Click "Add secret"

**Note:** If you don't have Vibe API key yet, you can skip this. The tool has mock data for testing.

### Get Claude API Key

1. Go to https://console.anthropic.com
2. Sign in or create account
3. Click "Settings" or "API Keys"
4. Click "Create API Key"
5. Copy the full key (starts with `sk-ant-api03-`)
6. **Never share this key!**

### Verify Secrets Were Added

1. Go back to Supabase Dashboard
2. Settings → Secrets
3. You should see both secrets listed (values hidden)

---

## Edge Functions Deployment

### Install Supabase CLI

```bash
npm install -g supabase
```

Verify installation:
```bash
supabase --version
```

### Link to Your Supabase Project

1. Get your **Project ID** from Supabase Dashboard:
   - Settings → General → Copy "Project ID"

2. Link in terminal:
```bash
supabase link --project-ref YOUR_PROJECT_ID
```

You'll see:
```
✓ Linked to project ref: abc123def456
```

### Deploy Edge Functions

The 3 functions are already created in `supabase/functions/`. Deploy them:

```bash
supabase functions deploy analyze-website
supabase functions deploy get-prospects
supabase functions deploy generate-message
```

Each should show:
```
✓ Function deployed successfully
```

### Verify Deployment

1. Go to Supabase Dashboard
2. Click **Functions** (left sidebar)
3. You should see all 3 functions listed:
   - `analyze-website`
   - `get-prospects`
   - `generate-message`

---

## Local Development

### Install Dependencies

```bash
npm install
```

This installs:
- React 18
- Vite (bundler)
- TypeScript
- Supabase JS Client
- Lucide Icons

### Run Development Server

```bash
npm run dev
```

You should see:
```
  ➜  Local:   http://localhost:3000/smart-prospecting-tool
  ➜  press h to show help
```

Open http://localhost:3000/smart-prospecting-tool in your browser.

### Test Locally

1. Go to ICP Generator tab
2. Paste a website URL
3. Click "Analyze Website"
4. Should see ICP generated within 5-10 seconds

If you see errors:
- Check browser console (F12)
- Verify `.env.local` has correct URLs
- Restart dev server: Press `q` then run `npm run dev` again

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized build.

Check it was created:
```bash
ls dist/
```

---

## GitHub Pages Deployment

### Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** (top right)
3. Left sidebar → **Pages**
4. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/** (root)
5. Click **Save**

### Push to GitHub

```bash
# Stage all files
git add .

# Commit
git commit -m "Deploy: Smart Prospecting Tool"

# Push to GitHub
git push origin main
```

### GitHub Actions Deployment

The `.github/workflows/deploy.yml` file automatically:
1. Runs when you push to main
2. Installs dependencies
3. Builds the project
4. Uploads to GitHub Pages

Check deployment:
1. Go to your GitHub repo
2. Click **Actions** tab
3. Wait for "Deploy to GitHub Pages" to finish (green checkmark)
4. Click on the workflow to see details

### Access Your Live Site

Once deployment is complete:

```
https://yourusername.github.io/smart-prospecting-tool
```

---

## Testing

### Test ICP Generator

1. Go to ICP Generator tab
2. Paste your portfolio URL (must be https)
3. Click "Analyze Website"
4. Should complete in 5-10 seconds
5. Verify output shows:
   - Job titles
   - Industries
   - Company size
   - Problems solved
   - Value propositions

### Test Smart Prospecting

1. ICP must be generated first (above)
2. Go to Smart Prospecting tab
3. Click "Load Prospects for Today"
4. Should see 15 prospects with:
   - Names and titles
   - Match scores
   - Company information
   - Location

5. Click expand arrow on a prospect
6. Click "Generate Message"
7. Should see personalized message in 5-8 seconds

### Test Message Copying

1. With message displayed, click "Copy Message"
2. You should see "Copied!" briefly
3. Paste in a text editor to verify the message is there

### Test Pipeline Tab

1. In Smart Prospecting, click "Mark as Sent" on a prospect
2. Go to Pipeline tab
3. Should show:
   - "Sent Today: 1"
   - "Monthly Total: 1"
   - Prospect appears in the table

### Test Language Switching

1. Click language selector (top right)
2. Select a different language (French, Spanish, Portuguese)
3. Verify all text updates
4. Go back to English

---

## Troubleshooting

### "Cannot find module" Error

**Problem**: Error when running `npm install` or `npm run dev`

**Solution**:
```bash
# Clear cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules

# Reinstall
npm install
```

### "Supabase URL not found"

**Problem**: Error message: "Missing Supabase credentials"

**Solution**:
1. Check `.env.local` exists
2. Verify both variables are set:
   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
3. Restart dev server (Ctrl+C, then `npm run dev`)

### "Unauthorized" from Edge Functions

**Problem**: Messages like "401 Unauthorized"

**Solution**:
1. Verify secrets in Supabase → Settings → Secrets
2. Redeploy functions:
   ```bash
   supabase functions deploy analyze-website --force
   supabase functions deploy get-prospects --force
   supabase functions deploy generate-message --force
   ```

### ICP Analysis Fails

**Problem**: Error when clicking "Analyze Website"

**Solution**:
1. Verify Claude API key in Supabase Secrets
2. Check URL is valid (must be https://)
3. Website must be publicly accessible
4. Check browser console (F12) for error details

### GitHub Pages Shows 404

**Problem**: Site not found at `yourusername.github.io/smart-prospecting-tool`

**Solution**:
1. Go to repo Settings → Pages
2. Verify:
   - Source: "Deploy from a branch" is selected
   - Branch: "main" is selected
   - Folder: "/" is selected
3. Check Actions tab - is deployment finished?
4. Wait 3-5 minutes for GitHub Pages to update
5. Try hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

### Nothing Loads on GitHub Pages

**Problem**: Blank page or error in console

**Solution**:
1. Open browser console (F12)
2. Check for errors about `.env` or Supabase
3. Verify `vite.config.ts` has correct base path:
   ```
   base: "/smart-prospecting-tool/",
   ```
4. Check that `dist/` folder was built:
   ```bash
   npm run build
   ls dist/
   ```

### Prospects Not Loading

**Problem**: "No prospects loaded yet" message

**Solution**:
1. Generate ICP first (ICP Generator tab)
2. Verify all 3 Edge Functions deployed:
   - Supabase Dashboard → Functions
3. Click "Load Prospects" again

### Messages Not Generating

**Problem**: "Generate Message" button doesn't work

**Solution**:
1. Check Claude API key in Supabase Secrets
2. Verify Edge Function `generate-message` is deployed
3. Check Supabase Logs (Functions tab) for errors
4. Try generating message again

### Build Fails

**Problem**: `npm run build` shows errors

**Solution**:
1. Check TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```
2. Fix any type errors
3. Try rebuild:
   ```bash
   npm run build
   ```

---

## Security Best Practices

✅ **DO:**
- Store API keys in Supabase Secrets
- Add `.env*` to `.gitignore`
- Use HTTPS for all connections
- Rotate API keys regularly
- Keep dependencies updated

❌ **DON'T:**
- Commit `.env.local` to Git
- Put API keys in frontend code
- Share API keys in issues/PRs
- Use API keys in browser console
- Expose Supabase service role key

---

## Performance Tips

1. **Image Optimization**: Supabase stores images efficiently
2. **Edge Function Caching**: Claude responses are cached
3. **Message Generation**: Reuse messages for similar prospects
4. **Database Queries**: Pipeline uses localStorage (very fast)

---

## Next Steps

After successful setup:

1. Read **README.md** for feature documentation
2. Review **DEPLOYMENT_CHECKLIST.md** to verify everything
3. Customize colors in `src/styles/globals.css`
4. Start prospecting with 3-5 test invitations
5. Monitor acceptance rate in Pipeline tab
6. Scale to 15/day once validated

---

## Support

**Stuck?** Here's the checklist:

1. ✅ Node 18+ installed
2. ✅ `.env.local` created with Supabase credentials
3. ✅ Supabase project created (region: Paris)
4. ✅ All 3 Edge Functions deployed
5. ✅ `npm run build` succeeds
6. ✅ GitHub Pages enabled
7. ✅ GitHub Actions deployment shows green checkmark
8. ✅ Can access GitHub Pages URL
9. ✅ ICP Generator works
10. ✅ Smart Prospecting loads prospects

If any step fails, re-read that section of this guide.

**Questions?** Check README.md for FAQ and troubleshooting tips.

---

**You're ready to deploy! 🚀**

Go find those ideal customers and build your 40-50% acceptance rate pipeline!
