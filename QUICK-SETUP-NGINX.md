# 🚀 Quick Setup - Run This on VPS

## ✅ One-Command Complete Setup

```bash
# SSH into VPS
ssh ubuntu@YOUR_VPS_IP

# Download and run the complete setup script
cd ~/amr-echaufaudage
chmod +x complete-domain-setup.sh
./complete-domain-setup.sh
```

---

## 🎯 Port Configuration

```
Internet (Port 80/443)
    ↓
Nginx Reverse Proxy
    ↓
Docker Container (Port 3000)
    ↓
React Landing Page
```

---

## 📝 Manual Step-by-Step (If Script Fails)

### 1. Stop Conflicting Containers
```bash
docker ps | grep "0.0.0.0:80->" | awk '{print $1}' | xargs -r docker stop
```

### 2. Start Docker on Port 3000
```bash
cd ~/amr-echaufaudage

docker stop amr-frontend 2>/dev/null || true
docker rm amr-frontend 2>/dev/null || true

docker run -d \
  --name amr-frontend \
  --restart unless-stopped \
  --network amr-network \
  -p 3000:80 \
  -e NODE_ENV=production \
  amr-frontend

docker ps | grep amr-frontend
```

### 3. Configure Nginx
```bash
sudo tee /etc/nginx/sites-available/amrechaudage.fr > /dev/null << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name amrechaudage.fr www.amrechaudage.fr;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/amrechaudage.fr /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
```

### 4. Start Nginx
```bash
sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. Test
```bash
curl http://localhost:3000  # Test Docker
curl http://localhost       # Test Nginx
```

---

## 🔒 Add SSL Certificate

After HTTP works:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d amrechaudage.fr -d www.amrechaudage.fr
```

---

## ✅ Verification

```bash
# Check container
docker ps | grep amr-frontend

# Check Nginx
sudo systemctl status nginx

# Check ports
sudo netstat -tulpn | grep -E ':(80|3000)'

# Test locally
curl http://localhost:3000
curl http://localhost
```

---

## 🌐 Final URLs

- Docker Direct: http://YOUR_VPS_IP:3000
- Nginx Proxy: http://YOUR_VPS_IP
- Domain: http://www.amrechaudage.fr
- SSL (after certbot): https://www.amrechaudage.fr

---

## 🔧 Troubleshooting

### Container not responding?
```bash
docker logs amr-frontend
docker restart amr-frontend
```

### Nginx not starting?
```bash
sudo netstat -tulpn | grep :80
sudo nginx -t
sudo systemctl status nginx
```

### 502 Bad Gateway?
```bash
# Check container is running
docker ps | grep amr-frontend

# Restart container
docker restart amr-frontend

# Check Nginx config
cat /etc/nginx/sites-available/amrechaudage.fr | grep proxy_pass
```

---

## 📊 Port Summary

| Service | Port | Purpose |
|---------|------|---------|
| Docker Container | 3000 | React app (internal) |
| Nginx | 80 | HTTP (public) |
| Nginx | 443 | HTTPS (after SSL) |
| Your Backend | 4000 | Existing service |
| PostgreSQL | 5432 | Existing service |

---

**Everything is on different ports - no conflicts!** ✅
