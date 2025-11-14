# Vercel Deployment Guide - promed.alteridad.org

Complete guide to deploy the Promed 2026 project to Vercel with custom domain.

## Prerequisites

- Vercel account (free tier works)
- GitHub repository access
- Domain access for `promed.alteridad.org`

## Method 1: Deploy via Vercel CLI (Recommended)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Configure Environment Variables

Create a `.env.production` file or set them in Vercel dashboard:

```bash
VITE_APP_TITLE="Propuesta F-007 Enhanced - Promed S.A."
VITE_APP_LOGO="/logo-alteridad.png"
VITE_APP_DOMAIN="promed.alteridad.org"
NODE_ENV="production"
```

Optional variables (if using authentication/analytics):
```bash
DATABASE_URL="your-database-url"
JWT_SECRET="your-jwt-secret"
OAUTH_SERVER_URL=""
VITE_ANALYTICS_ENDPOINT=""
VITE_ANALYTICS_WEBSITE_ID=""
```

### Step 4: Deploy to Vercel

```bash
# From project root
cd /Users/sanchomini/Development/promed2026

# Deploy to production
vercel --prod
```

The CLI will:
1. Ask you to link to existing project or create new one
2. Build the project
3. Deploy to Vercel
4. Provide you with a deployment URL

### Step 5: Add Custom Domain

After deployment:

```bash
# Add custom domain via CLI
vercel domains add promed.alteridad.org
```

Or use the Vercel Dashboard (easier):
1. Go to your project on vercel.com
2. Settings → Domains
3. Add `promed.alteridad.org`
4. Follow DNS configuration instructions

## Method 2: Deploy via Vercel Dashboard (GitHub Integration)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Add Vercel configuration"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `ginessancho/promed2026`
4. Configure project:
   - **Framework Preset**: Other
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `pnpm install`

### Step 3: Add Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_APP_TITLE` | `Propuesta F-007 Enhanced - Promed S.A.` | Production |
| `VITE_APP_LOGO` | `/logo-alteridad.png` | Production |
| `VITE_APP_DOMAIN` | `promed.alteridad.org` | Production |
| `NODE_ENV` | `production` | Production |

### Step 4: Deploy

Click "Deploy" button. Vercel will:
- Install dependencies
- Run build
- Deploy your application
- Provide a `.vercel.app` URL

### Step 5: Add Custom Domain

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter `promed.alteridad.org`
4. Click "Add"

## DNS Configuration

After adding the domain in Vercel, you'll need to configure DNS:

### Option A: Using Vercel Nameservers (Recommended)

Vercel will provide nameservers. Update at your domain registrar:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Option B: Using CNAME Record

If you want to keep your current nameservers:

```
Type: CNAME
Name: promed
Value: cname.vercel-dns.com
TTL: 3600
```

**Note**: For root domain (alteridad.org), you may need to use ALIAS or ANAME record depending on your DNS provider.

## Vercel Configuration File

The project includes `vercel.json` with:
- Build configuration
- Static asset serving
- API route handling
- Proper routing for SPA

## Environment Variables in Vercel

### Required Variables
- `VITE_APP_TITLE` - Application title
- `VITE_APP_LOGO` - Logo path
- `NODE_ENV` - Set to "production"

### Optional Variables
- `DATABASE_URL` - MySQL connection string (if using auth)
- `JWT_SECRET` - For session management
- `OAUTH_SERVER_URL` - OAuth configuration
- `VITE_ANALYTICS_ENDPOINT` - Analytics endpoint
- `VITE_ANALYTICS_WEBSITE_ID` - Analytics site ID

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch → Production deployment
- Every push to other branches → Preview deployment
- Pull requests → Preview deployment with unique URL

## Vercel CLI Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# List deployments
vercel ls

# View logs
vercel logs [deployment-url]

# Remove deployment
vercel rm [deployment-url]

# Add environment variable
vercel env add [name]

# List environment variables
vercel env ls

# Pull environment variables locally
vercel env pull
```

## SSL Certificate

Vercel automatically provisions and renews SSL certificates for all domains. No configuration needed!

## Performance Optimizations

Vercel automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Gzip/Brotli compression
- ✅ HTTP/2 & HTTP/3
- ✅ Edge caching
- ✅ DDoS protection

## Monitoring

Access deployment analytics:
1. Go to your project on vercel.com
2. Click "Analytics" tab
3. View:
   - Page views
   - Response times
   - Error rates
   - Geographic distribution

## Troubleshooting

### Build Fails

Check build logs in Vercel dashboard. Common issues:
- Missing environment variables
- TypeScript errors
- Dependency issues

**Solution**: Ensure all environment variables are set and code passes `pnpm check`

### 404 Errors

If routes return 404:
- Check `vercel.json` routing configuration
- Ensure `dist/` directory is being deployed
- Verify build output in deployment logs

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_` for client-side access
- Redeploy after adding/changing environment variables
- Check variable scope (Production/Preview/Development)

### Domain Not Working

- Wait for DNS propagation (can take up to 48 hours, usually minutes)
- Verify DNS configuration with `dig promed.alteridad.org`
- Check domain status in Vercel dashboard

## Cost

Vercel Free Tier includes:
- Unlimited deployments
- 100 GB bandwidth/month
- Automatic SSL
- Global CDN
- Preview deployments

This should be sufficient for the Promed 2026 project.

## Rollback

To rollback to a previous deployment:

1. Go to Deployments tab
2. Find the working deployment
3. Click "..." menu → "Promote to Production"

Or via CLI:
```bash
vercel rollback [deployment-url]
```

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Project Support**: gines@alteridad.org
- **Phone**: +33 0664691043

## Quick Reference

```bash
# Initial setup
vercel login
vercel --prod

# Add domain
vercel domains add promed.alteridad.org

# View logs
vercel logs

# Redeploy
git push origin main  # (if using GitHub integration)
# or
vercel --prod  # (if using CLI)
```

---

**Next Steps After Deployment:**
1. ✅ Verify site loads at temporary Vercel URL
2. ✅ Add custom domain `promed.alteridad.org`
3. ✅ Configure DNS
4. ✅ Wait for DNS propagation
5. ✅ Test site at https://promed.alteridad.org
6. ✅ Verify all features work (charts, diagrams, PDF export)
