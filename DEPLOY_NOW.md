# 🚀 Deploy to Vercel NOW - Quick Start

The Vercel CLI is ready and waiting for your input!

## Current Status

✅ Vercel CLI installed  
✅ Project configured with `vercel.json`  
✅ Code committed and pushed to GitHub  
⏳ **Waiting for your input in the terminal**

## Complete the Deployment (2 minutes)

### Step 1: Answer Vercel CLI Prompts

The CLI is currently asking: **"Set up and deploy ~/Development/promed2026?"**

**Answer the prompts as follows:**

1. **Set up and deploy?** → Press `Y` (Yes)

2. **Which scope?** → Select your Vercel account/team

3. **Link to existing project?** → Press `N` (No) - Create new project

4. **What's your project's name?** → Type: `promed2026` (or your preferred name)

5. **In which directory is your code located?** → Press Enter (use `./`)

6. **Want to override the settings?** → Press `N` (No) - Use vercel.json settings

The deployment will then start automatically!

### Step 2: Wait for Build & Deploy

You'll see:
```
🔍 Inspect: https://vercel.com/...
✅ Production: https://promed2026.vercel.app
```

### Step 3: Add Custom Domain

Once deployed, add your custom domain:

```bash
vercel domains add promed.alteridad.org
```

Or use the Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Domains
4. Click "Add Domain"
5. Enter: `promed.alteridad.org`
6. Follow DNS configuration instructions

## Alternative: Deploy via GitHub (No CLI needed)

If you prefer not to use CLI:

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import `ginessancho/promed2026` from GitHub
4. Configure:
   - Framework: Other
   - Build Command: `pnpm build`
   - Output Directory: `dist/public`
   - Install Command: `pnpm install`
5. Add environment variables (see below)
6. Click "Deploy"

## Required Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_APP_TITLE = Propuesta F-007 Enhanced - Promed S.A.
VITE_APP_LOGO = /logo-alteridad.png
VITE_APP_DOMAIN = promed.alteridad.org
NODE_ENV = production
```

## DNS Configuration for promed.alteridad.org

After adding the domain in Vercel, configure DNS:

**Option A: CNAME (Subdomain)**
```
Type: CNAME
Name: promed
Value: cname.vercel-dns.com
TTL: 3600
```

**Option B: Vercel Nameservers (Recommended)**
Update nameservers at your domain registrar to:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

## What Happens Next?

1. ⏱️ Build takes ~2-3 minutes
2. 🌐 Site deployed to `https://promed2026.vercel.app`
3. 🔒 SSL certificate automatically provisioned
4. 🌍 Distributed to global CDN
5. ⏳ DNS propagation (5 mins - 48 hours, usually quick)
6. ✅ Site live at `https://promed.alteridad.org`

## Verify Deployment

After deployment completes:

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Test the site
curl https://promed2026.vercel.app
```

## Troubleshooting

**If build fails:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are set

**If domain doesn't work:**
- Wait for DNS propagation (check with `dig promed.alteridad.org`)
- Verify DNS configuration in your domain registrar
- Check domain status in Vercel dashboard

## Need Help?

- **Full Guide**: See `VERCEL_DEPLOYMENT.md`
- **Vercel Docs**: https://vercel.com/docs
- **Support**: gines@alteridad.org

---

## Quick Commands Reference

```bash
# Deploy to production
vercel --prod

# Add domain
vercel domains add promed.alteridad.org

# View deployments
vercel ls

# View logs
vercel logs

# Rollback
vercel rollback [url]
```

---

**🎯 Your Next Action:** Go to the terminal and answer `Y` to the Vercel CLI prompt!
