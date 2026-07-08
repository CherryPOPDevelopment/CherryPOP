# CherryPOP Hostinger Deployment

This repo is now prepared for Hostinger VPS deployment.

## 1) Point DNS to VPS

Create A records in Hostinger DNS:
- @ -> your VPS public IP
- www -> your VPS public IP

Wait for DNS propagation before SSL setup.

## 2) Upload code to server

On the VPS:

```bash
sudo mkdir -p /var/www/cherrypop
sudo chown -R $USER:$USER /var/www/cherrypop
cd /var/www/cherrypop
git clone <YOUR_REPO_URL> .
```

## 3) Run one-time server setup

From project root on the server:

```bash
sudo bash deploy/hostinger-vps-setup.sh cherrypopdevelopment.com admin@cherrypopdevelopment.com
```

This installs Nginx, Node.js, PM2, firewall rules, and SSL.

## 4) Configure app environment

```bash
cd /var/www/cherrypop/Backend
cp .env.example .env
nano .env
```

Required values in Backend/.env:
- NODE_ENV=production
- PORT=3000
- SESSION_SECRET=<long-random-secret>
- SITE_URL=https://cherrypopdevelopment.com
- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
- RESEND_API_KEY

## 5) Install and start app

```bash
cd /var/www/cherrypop/Backend
npm ci
npm run migrate
npm run pm2:start
pm2 save
pm2 startup
```

## 6) Deploy future updates

On every new release:

```bash
bash /var/www/cherrypop/deploy/hostinger-update.sh
```

## 7) Health checks

```bash
pm2 status
pm2 logs cherrypop --lines 100
sudo nginx -t
sudo systemctl status nginx
curl -I https://cherrypopdevelopment.com
```

If your default branch is not main, update BRANCH in deploy/hostinger-update.sh.
