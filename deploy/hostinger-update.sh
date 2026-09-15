#!/usr/bin/env bash
set -euo pipefail

# Zero-downtime app update script for CherryPOP on Hostinger VPS.
# Run this on the server after pushing new commits.

APP_DIR="/var/www/cherrypop"
BRANCH="main"

cd "$APP_DIR"

echo "[1/5] Pulling latest code"
git fetch --all --prune
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "[2/7] Installing backend dependencies"
cd Backend
npm ci

echo "[3/7] Installing SOVA demo dependencies"
cd ../SOVA-demo
npm ci

echo "[4/7] Installing Aurelia dependencies"
cd ../Aurelia-app
npm ci --omit=dev

echo "[5/7] Running migrations"
cd ../Backend
npm run migrate

echo "[6/7] Reloading CherryPOP, SOVA, and Aurelia processes with PM2"
npm run pm2:reload || npm run pm2:start

echo "[7/7] Saving PM2 process list"
pm2 save

echo "Deployment update complete."
