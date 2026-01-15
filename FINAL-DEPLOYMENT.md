# 🎯 Final Solution: Container Port 8080 + System Nginx Port 80

## ✅ What Changed

**Container (Internal):**
- Changed from port 80 → port 8080
- Updated nginx.conf inside container
- Updated Dockerfile
- Updated docker-compose.yml to map 3000:8080

**Host (External):**
- System Nginx on port 80
- Proxies to localhost:3000
- Handles SSL/HTTPS

---

## 📊 New Architecture

```
Internet (Port 80/443)
    ↓
System Nginx (Port 80)
    ↓
Docker Container (Host Port 3000 → Container Port 8080)
    ↓
React App
```

---

## 🚀 DEPLOYMENT STEPS

### **Step 1: Push Updated Code**

```bash
# On your local machine
cd D:\amr-echafaudage

git add .
git commit -m "Change container to use port 8080 internally"
git push origin main
```

---

### **Step 2: Update VPS**

```bash
# SSH into VPS
ssh ubuntu@YOUR_VPS_IP

# Navigate to project
cd ~/amr-echaufaudage

# Pull latest code
git pull origin main

# Stop current container
docker stop amr-frontend
docker rm amr-frontend

# Rebuild and start with new port
docker-compose up -d --build

# Wait for container
sleep 5

# Test container on port 3000
curl http://localhost:3000

# Should show your website! ✅
```

---

### **Step 3: Install System Nginx**

```bash
# Install nginx
sudo apt update
sudo apt install nginx -y

# Create configuration
sudo tee /etc/nginx/sites-available/amrechaudage.fr > /dev/null << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name amrechaudage.fr www.amrechaudage.fr;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript image/svg+xml;

    # Proxy to Docker container on port 3000
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/amrechaudage.fr /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

---

### **Step 4: Configure Firewall**

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check firewall
sudo ufw status
```

---

### **Step 5: Test Everything**

```bash
# Test Docker container
curl http://localhost:3000

# Test Nginx
curl http://localhost

# Test from outside
curl http://www.amrechaudage.fr
```

**Visit in browser:**
```
http://www.amrechaudage.fr
```

Should work! ✅

---

### **Step 6: Add SSL Certificate**

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d amrechaudage.fr -d www.amrechaudage.fr

# Follow prompts:
# 1. Enter email: your-email@example.com
# 2. Agree to terms: Y
# 3. Redirect HTTP to HTTPS: 2 (Yes)
```

**Visit:**
```
https://www.amrechaudage.fr
```

Should have 🔒 padlock! ✅

---

## 🎯 Port Summary

| Service | Port | Purpose |
|---------|------|---------|
| Container Internal | 8080 | Nginx inside container |
| Host Mapping | 3000 | Exposed to host |
| System Nginx | 80 | HTTP (public) |
| System Nginx | 443 | HTTPS (public, after SSL) |
| Your Backend | 4000 | Existing service |
| PostgreSQL | 5432 | Existing service |

**No conflicts!** ✅

---

## ✅ Verification Checklist

After setup:

- [ ] Container running: `docker ps | grep amr-frontend`
- [ ] Container healthy: `docker ps` (should say "healthy")
- [ ] Port 3000 responds: `curl http://localhost:3000`
- [ ] Nginx running: `sudo systemctl status nginx`
- [ ] Port 80 responds: `curl http://localhost`
- [ ] Domain works: `curl http://www.amrechaudage.fr`
- [ ] SSL works: `https://www.amrechaudage.fr` (after certbot)

---

## 🔍 Troubleshooting

### Container unhealthy?
```bash
docker logs amr-frontend
docker exec -it amr-frontend wget -O- http://localhost:8080/health
```

### Nginx won't start?
```bash
sudo nginx -t
sudo journalctl -xeu nginx
sudo lsof -i :80
```

### 502 Bad Gateway?
```bash
# Check container is running
docker ps | grep amr-frontend

# Restart container
docker restart amr-frontend

# Check nginx config
cat /etc/nginx/sites-available/amrechaudage.fr | grep proxy_pass
```

---

## 🔄 Future Updates

To update your site:

```bash
# Just push to GitHub
git push origin main

# GitHub Actions will automatically:
# 1. Build new Docker image
# 2. Deploy to VPS
# 3. Restart container

# Or manually on VPS:
cd ~/amr-echaufaudage
git pull
docker-compose up -d --build
```

---

## 🎉 Summary

1. ✅ Container uses port 8080 internally
2. ✅ Host exposes it on port 3000
3. ✅ System Nginx on port 80 proxies to 3000
4. ✅ SSL on port 443 (after certbot)
5. ✅ No port conflicts!

**Your site is live at: https://www.amrechaudage.fr** 🎊
