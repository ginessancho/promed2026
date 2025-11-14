#!/bin/bash

# Deployment script for promed.alteridad.org
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e

ENVIRONMENT=${1:-production}

echo "🚀 Starting deployment for environment: $ENVIRONMENT"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure it."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Run type check
echo "🔍 Running type check..."
pnpm check

# Build the project
echo "🏗️  Building project..."
pnpm build

echo "✅ Build completed successfully!"

# Check if PM2 is installed
if command -v pm2 &> /dev/null; then
    echo "🔄 Restarting application with PM2..."
    
    # Check if app is already running
    if pm2 list | grep -q "promed2026"; then
        pm2 restart promed2026
        echo "✅ Application restarted"
    else
        pm2 start dist/index.js --name promed2026
        pm2 save
        echo "✅ Application started"
    fi
    
    # Show status
    pm2 status promed2026
else
    echo "⚠️  PM2 not found. Starting application directly..."
    echo "💡 Consider installing PM2 for production: npm install -g pm2"
    NODE_ENV=production node dist/index.js
fi

echo ""
echo "🎉 Deployment completed!"
echo "📍 Application should be running at: https://promed.alteridad.org"
echo ""
echo "Useful commands:"
echo "  pm2 logs promed2026    - View logs"
echo "  pm2 monit              - Monitor application"
echo "  pm2 restart promed2026 - Restart application"
echo "  pm2 stop promed2026    - Stop application"
