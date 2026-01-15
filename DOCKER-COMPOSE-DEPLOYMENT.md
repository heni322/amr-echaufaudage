# 🎯 New Approach: Docker Compose with Nginx

## ✅ What Changed

Your project now includes:
- **Frontend container** (no external port, internal only)
- **Nginx container** (handles port 80/443 and proxies to frontend)
- **docker-compose.yml** (manages both containers)

---

## 📊 New Architecture

```
Internet (Port 80/443)
    ↓
Nginx Container (amr-nginx)
    ↓
Frontend Container (amr-frontend) - Internal only
    ↓
React App
```

---

## 🚀 **STEP 1: Push Updated Code**

From your local machine:

```bash
cd D:\amr-echafaudage

# Add new files
git add docker-compose.yml
git add nginx/
git add quick-deploy.sh
git add .github/workflows/deploy.yml

# Commit
git commit -m "Add Nginx container to docker-compose"

# Push
git push origin main
```

---

## 🔧 **STEP 2: Clean Up VPS (Run on VPS)**

SSH into your VPS and run:

```bash
# SSH into VPS
ssh ubuntu@YOUR_VPS_IP

# Stop system nginx
sudo systemctl stop nginx
sudo systemctl disable nginx

# Stop and remove old containers
docker stop frontend nginx amr-nginx amr-frontend 2>/dev/null || true
docker rm frontend nginx amr-nginx amr-frontend 2>/dev/null || true

# Restart Docker to clear port 80
sudo systemctl restart docker

# Wait for Docker to restart
sleep 5

# Check port 80 is free
sudo lsof -i :80

# If still in use, reboot VPS:
# sudo reboot
```

---

## 🚀 **STEP 3: Deploy with Docker Compose (Run on VPS)**

```bash
# Navigate to project
cd ~/amr-echaufaudage

# Pull latest code
git pull origin main

# Stop any running deployment
docker-compose down 2>/dev/null || true

# Create network
docker network create amr-network 2>/dev/null || true

# Start services
docker-compose up -d --build

# Wait for startup
sleep 10

# Check status
docker-compose ps

# Should show:
# - amr-frontend (running)
# - amr-nginx (running)
```

---

## ✅ **STEP 4: Verify**

```bash
# Check containers
docker ps

# Test locally
curl http://localhost

# Check logs
docker-compose logs

# Test frontend health
curl http://localhost/health
```

---

## 🌐 **STEP 5: Test Domain**

Visit in browser:
```
http://www.amrechaudage.fr
```

Should work! ✅

---

## 🔒 **STEP 6: Add SSL (After HTTP Works)**

Create SSL setup script on VPS:

```bash
cd ~/amr-echaufaudage

# Create SSL setup script
cat > setup-ssl.sh << 'EOF'
#!/bin/bash
# Stop nginx container
docker stop amr-nginx

# Get SSL certificate
docker run -it --rm \
  -v ~/amr-echaufaudage/nginx/ssl:/etc/letsencrypt \
  -p 80:80 \
  certbot/certbot certonly \
  --standalone \
  -d amrechaudage.fr \
  -d www.amrechaudage.fr \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive

# Update nginx config for SSL
cat > nginx/nginx.conf << 'NGINXEOF'
server {
    listen 80;
    server_name amrechaudage.fr www.amrechaudage.fr;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name amrechaudage.fr www.amrechaudage.fr;

    ssl_certificate /etc/nginx/ssl/live/amrechaudage.fr/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/live/amrechaudage.fr/privkey.pem;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://amr-frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINXEOF

# Restart nginx with SSL
docker-compose up -d amr-nginx

echo "✅ SSL configured! Visit: https://www.amrechaudage.fr"
EOF

chmod +x setup-ssl.sh
./setup-ssl.sh
```

---

## 🎯 **Quick Commands**

### Start Services:
```bash
cd ~/amr-echaufaudage
docker-compose up -d
```

### Stop Services:
```bash
docker-compose down
```

### View Logs:
```bash
docker-compose logs -f
```

### Restart Services:
```bash
docker-compose restart
```

### Update and Redeploy:
```bash
git pull
docker-compose up -d --build
```

---

## 🔍 **Troubleshooting**

### Port 80 still in use?
```bash
# Find what's using it
sudo lsof -i :80

# Restart Docker
sudo systemctl restart docker

# Or reboot VPS
sudo reboot
```

### Container not starting?
```bash
# Check logs
docker-compose logs amr-nginx
docker-compose logs amr-frontend

# Check container status
docker ps -a
```

### 502 Bad Gateway?
```bash
# Restart frontend
docker-compose restart amr-frontend

# Check network
docker network inspect amr-network
```

---

## 📋 **Summary**

1. ✅ Push updated code to GitHub
2. ✅ Clean up VPS (stop old containers, restart Docker)
3. ✅ Pull latest code on VPS
4. ✅ Run `docker-compose up -d`
5. ✅ Test at http://www.amrechaudage.fr
6. ✅ Add SSL with setup-ssl.sh

---

**Everything runs in Docker now - cleaner and no port conflicts!** 🎉
