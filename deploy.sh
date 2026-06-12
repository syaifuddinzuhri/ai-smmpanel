#!/bin/bash
set -e

APP_NAME="smm-panel-ai"

echo "==> Node version..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 20 && nvm use 20

echo "==> Git pull..."
git restore package-lock.json
git pull origin main

echo "==> Install dependencies..."
npm ci

echo "==> Build..."
npm run build

echo "==> PM2 start/restart..."
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 restart "$APP_NAME"
else
  pm2 start ecosystem.config.cjs
fi

echo "==> Deploy selesai!"
