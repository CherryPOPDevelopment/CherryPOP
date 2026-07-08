#!/usr/bin/env bash
set -euo pipefail

# Hostinger VPS one-time setup for CherryPOP.
# Usage:
#   sudo bash deploy/hostinger-vps-setup.sh yourdomain.com admin@example.com

DOMAIN="${1:-}"
EMAIL="${2:-}"
APP_DIR="/var/www/cherrypop"
SERVICE_NAME="cherrypop"

if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
  echo "Usage: sudo bash deploy/hostinger-vps-setup.sh <domain> <email>"
  exit 1
fi

echo "[1/8] Installing system packages"
apt update
apt install -y nginx git curl ufw certbot python3-certbot-nginx

if ! command -v node >/dev/null 2>&1; then
  echo "[2/8] Installing Node.js 20"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
else
  echo "[2/8] Node.js already installed"
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "[3/8] Installing PM2"
  npm install -g pm2
else
  echo "[3/8] PM2 already installed"
fi

echo "[4/8] Configuring firewall"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

if [[ ! -d "$APP_DIR" ]]; then
  echo "[5/8] Creating app directory at $APP_DIR"
  mkdir -p "$APP_DIR"
fi

echo "[6/8] Writing Nginx site config"
cat > "/etc/nginx/sites-available/$SERVICE_NAME" <<NGINX
server {
  listen 80;
  server_name $DOMAIN www.$DOMAIN;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_cache_bypass \$http_upgrade;
  }
}
NGINX

ln -sf "/etc/nginx/sites-available/$SERVICE_NAME" "/etc/nginx/sites-enabled/$SERVICE_NAME"
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "[7/8] Enabling SSL certificate"
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --agree-tos -m "$EMAIL" --non-interactive

echo "[8/8] Setup complete"
echo "Next steps:"
echo "1) Upload or git clone your project into $APP_DIR"
echo "2) cd $APP_DIR/Backend && npm ci"
echo "3) cp .env.example .env and fill secrets"
echo "4) npm run migrate"
echo "5) pm2 start ../ecosystem.config.js --only cherrypop"
echo "6) pm2 save && pm2 startup"
