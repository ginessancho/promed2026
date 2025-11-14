# Deployment Configuration Summary

## Domain: promed.alteridad.org

This document summarizes the deployment configuration created for the Promed 2026 project.

## Files Created

### 1. `.env.example`
Template file with all required environment variables:
- Application settings (title, logo, domain)
- Database configuration
- OAuth settings (optional)
- Analytics configuration (optional)
- JWT secret for sessions

**Action Required**: Copy to `.env` and fill in your production values.

### 2. `DEPLOYMENT.md`
Comprehensive deployment guide covering:
- 4 deployment options (Own Server, Vercel, Netlify, Docker)
- Step-by-step instructions for each option
- DNS configuration
- SSL setup with Let's Encrypt
- Post-deployment checklist
- Troubleshooting guide

### 3. `nginx.conf.example`
Production-ready Nginx configuration:
- HTTP to HTTPS redirect
- SSL/TLS configuration
- Security headers
- Gzip compression
- Reverse proxy to Node.js app
- Static asset caching
- WebSocket support

### 4. `deploy.sh`
Automated deployment script:
- Validates environment setup
- Installs dependencies
- Runs type checking
- Builds the project
- Manages PM2 process
- Shows deployment status

**Usage**: `./deploy.sh production`

## Quick Start Guide

### For Local Development
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env with your values (minimal config for local dev)
VITE_APP_TITLE="Propuesta F-007 Enhanced - Promed S.A."
VITE_APP_LOGO="/logo-alteridad.png"

# 3. Install and run
pnpm install
pnpm dev
```

### For Production Deployment

#### Option A: Using the Deploy Script (Recommended)
```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with production values

# 2. Run deployment
./deploy.sh production
```

#### Option B: Manual Deployment
```bash
# 1. Build
pnpm install
pnpm build

# 2. Deploy to server
# Upload dist/, node_modules/, package.json, .env

# 3. On server, start with PM2
pm2 start dist/index.js --name promed2026
pm2 save
```

## DNS Configuration Required

To make the site accessible at `promed.alteridad.org`, configure DNS:

```
Type: A
Name: promed
Value: [Your Server IP Address]
TTL: 3600
```

Or if using a hosting platform (Vercel/Netlify):
```
Type: CNAME
Name: promed
Value: [Platform-provided URL]
TTL: 3600
```

## SSL Certificate Setup

### Using Let's Encrypt (Free)
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d promed.alteridad.org

# Auto-renewal is configured automatically
```

## Environment Variables Priority

### Required (Minimal Setup)
- `VITE_APP_TITLE` - Application title
- `VITE_APP_LOGO` - Logo path
- `NODE_ENV` - Set to "production"

### Optional (Enhanced Features)
- `DATABASE_URL` - For user authentication
- `JWT_SECRET` - For session management
- `OAUTH_SERVER_URL` - For OAuth login
- `VITE_ANALYTICS_ENDPOINT` - For analytics tracking

## Port Configuration

The application will:
1. Try to use port 3000
2. If busy, automatically find next available port (3001, 3002, etc.)
3. Log the actual port being used

## Monitoring Commands

```bash
# View logs
pm2 logs promed2026

# Monitor resources
pm2 monit

# Check status
pm2 status

# Restart application
pm2 restart promed2026
```

## Next Steps

1. ✅ Environment files created
2. ✅ Deployment documentation written
3. ✅ Nginx configuration prepared
4. ✅ Deployment script ready
5. ⏳ **TODO**: Copy `.env.example` to `.env` and configure
6. ⏳ **TODO**: Set up DNS for promed.alteridad.org
7. ⏳ **TODO**: Choose deployment method and deploy
8. ⏳ **TODO**: Configure SSL certificate
9. ⏳ **TODO**: Test the deployed site

## Support

For deployment assistance:
- **Email**: gines@alteridad.org
- **Phone**: +33 0664691043

## Additional Resources

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Full deployment guide
- [nginx.conf.example](./nginx.conf.example) - Nginx configuration
- [.env.example](./.env.example) - Environment variables template
- [README.md](./README.md) - Project documentation
