# Deployment Guide - promed.alteridad.org

This guide explains how to deploy the Promed 2026 project to `promed.alteridad.org`.

## Prerequisites

1. Domain `promed.alteridad.org` configured in your DNS
2. Server or hosting platform ready
3. Node.js 18+ installed on the server
4. MySQL database (optional, for user authentication features)

## Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your production values:
   ```bash
   VITE_APP_TITLE="Propuesta F-007 Enhanced - Promed S.A."
   VITE_APP_LOGO="/logo-alteridad.png"
   VITE_APP_DOMAIN="promed.alteridad.org"
   NODE_ENV="production"
   ```

3. **Optional**: Configure database if using authentication:
   ```bash
   DATABASE_URL="mysql://user:password@host:3306/promed2026"
   JWT_SECRET="generate-a-secure-random-string"
   ```

## Deployment Options

### Option 1: Deploy to Your Own Server (VPS/Dedicated)

1. **Build the project:**
   ```bash
   pnpm install
   pnpm build
   ```

2. **Transfer files to server:**
   ```bash
   # Upload these directories/files to your server:
   - dist/
   - node_modules/
   - package.json
   - .env (with production values)
   ```

3. **Run on server with PM2:**
   ```bash
   # Install PM2 globally
   npm install -g pm2

   # Start the application
   pm2 start dist/index.js --name promed2026

   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx as reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name promed.alteridad.org;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Enable SSL with Let's Encrypt:**
   ```bash
   sudo certbot --nginx -d promed.alteridad.org
   ```

### Option 2: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json`:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "dist/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "dist/index.js"
       }
     ]
   }
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Configure custom domain in Vercel dashboard:**
   - Go to Project Settings → Domains
   - Add `promed.alteridad.org`
   - Update DNS records as instructed

### Option 3: Deploy to Netlify

1. **Create `netlify.toml`:**
   ```toml
   [build]
     command = "pnpm build"
     publish = "dist/public"
     functions = "dist"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Deploy
   netlify deploy --prod
   ```

3. **Configure custom domain in Netlify dashboard**

### Option 4: Docker Deployment

1. **Create `Dockerfile`:**
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   COPY package.json pnpm-lock.yaml ./
   RUN npm install -g pnpm && pnpm install --frozen-lockfile

   COPY . .
   RUN pnpm build

   EXPOSE 3000

   CMD ["node", "dist/index.js"]
   ```

2. **Build and run:**
   ```bash
   docker build -t promed2026 .
   docker run -d -p 3000:3000 --env-file .env promed2026
   ```

## DNS Configuration

Point your domain to your server:

```
Type: A
Name: promed
Value: [Your Server IP]
TTL: 3600
```

Or for CNAME (if using hosting platform):
```
Type: CNAME
Name: promed
Value: [Platform URL]
TTL: 3600
```

## Post-Deployment Checklist

- [ ] Verify domain resolves correctly: `nslookup promed.alteridad.org`
- [ ] Test HTTPS is working
- [ ] Check all environment variables are set correctly
- [ ] Verify the application loads at https://promed.alteridad.org
- [ ] Test all interactive features (charts, diagrams, timeline)
- [ ] Verify PDF export functionality works
- [ ] Check mobile responsiveness
- [ ] Monitor server logs for errors

## Monitoring

Monitor your application with PM2:
```bash
pm2 logs promed2026
pm2 monit
pm2 status
```

## Troubleshooting

**Issue: Environment variables not loading**
- Ensure `.env` file is in the correct location
- Restart the application after changing `.env`

**Issue: Port already in use**
- The app will automatically find an available port
- Or specify a port: `PORT=3000 node dist/index.js`

**Issue: Database connection errors**
- Verify `DATABASE_URL` is correct
- Check database server is accessible
- Ensure database exists and user has permissions

## Support

For issues or questions:
- Email: gines@alteridad.org
- Phone: +33 0664691043
