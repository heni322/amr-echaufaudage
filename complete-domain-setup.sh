#!/bin/bash

# Complete Domain Setup Script for www.amrechaudage.fr
# This configures Nginx on port 80/443 and Docker on port 3000

set -e

echo "🌐 Setting up www.amrechaudage.fr with Nginx and Docker"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Step 1: Stop any containers using port 80
echo -e "${YELLOW}Step 1: Checking port 80...${NC}"
if sudo lsof -i :80 > /dev/null 2>&1; then
    echo "Port 80 is in use. Stopping containers..."
    docker ps | grep "0.0.0.0:80->" | awk '{print $1}' | xargs -r docker stop
    echo -e "${GREEN}✅ Port 80 cleared${NC}"
else
    echo -e "${GREEN}✅ Port 80 is available${NC}"
fi
echo ""

# Step 2: Install Nginx if not installed
echo -e "${YELLOW}Step 2: Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt update
    sudo apt install nginx -y
    echo -e "${GREEN}✅ Nginx installed${NC}"
else
    echo -e "${GREEN}✅ Nginx already installed${NC}"
fi
echo ""

# Step 3: Create Nginx configuration
echo -e "${YELLOW}Step 3: Creating Nginx configuration...${NC}"
sudo tee /etc/nginx/sites-available/amrechaudage.fr > /dev/null << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name amrechaudage.fr www.amrechaudage.fr;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

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

    # Health check
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
echo -e "${GREEN}✅ Nginx configuration created${NC}"
echo ""

# Step 4: Enable site
echo -e "${YELLOW}Step 4: Enabling site...${NC}"
sudo ln -sf /etc/nginx/sites-available/amrechaudage.fr /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
echo -e "${GREEN}✅ Site enabled${NC}"
echo ""

# Step 5: Test Nginx configuration
echo -e "${YELLOW}Step 5: Testing Nginx configuration...${NC}"
if sudo nginx -t; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
else
    echo -e "${RED}❌ Nginx configuration has errors${NC}"
    exit 1
fi
echo ""

# Step 6: Stop and remove old frontend container
echo -e "${YELLOW}Step 6: Preparing Docker container...${NC}"
docker stop amr-frontend 2>/dev/null || true
docker rm amr-frontend 2>/dev/null || true
echo -e "${GREEN}✅ Old container removed${NC}"
echo ""

# Step 7: Start Docker container on port 3000
echo -e "${YELLOW}Step 7: Starting Docker container on port 3000...${NC}"
cd ~/amr-echaufaudage

# Check if image exists, if not build it
if ! docker images | grep -q "amr-echafaudage-frontend"; then
    echo "Building Docker image..."
    docker build -t amr-frontend .
fi

docker run -d \
  --name amr-frontend \
  --restart unless-stopped \
  --network amr-network \
  -p 3000:80 \
  -e NODE_ENV=production \
  amr-frontend

echo -e "${GREEN}✅ Docker container started on port 3000${NC}"
echo ""

# Step 8: Wait for container to be ready
echo -e "${YELLOW}Step 8: Waiting for container to be ready...${NC}"
sleep 5

if docker ps | grep -q amr-frontend; then
    echo -e "${GREEN}✅ Container is running${NC}"
else
    echo -e "${RED}❌ Container failed to start${NC}"
    docker logs amr-frontend
    exit 1
fi
echo ""

# Step 9: Start Nginx
echo -e "${YELLOW}Step 9: Starting Nginx...${NC}"
sudo systemctl daemon-reload
sudo systemctl start nginx
sudo systemctl enable nginx

if sudo systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx is running${NC}"
else
    echo -e "${RED}❌ Nginx failed to start${NC}"
    sudo systemctl status nginx
    exit 1
fi
echo ""

# Step 10: Configure firewall
echo -e "${YELLOW}Step 10: Configuring firewall...${NC}"
sudo ufw allow 80/tcp 2>/dev/null || true
sudo ufw allow 443/tcp 2>/dev/null || true
echo -e "${GREEN}✅ Firewall configured${NC}"
echo ""

# Step 11: Test setup
echo -e "${YELLOW}Step 11: Testing setup...${NC}"
echo "Testing Docker container..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker container responding${NC}"
else
    echo -e "${RED}❌ Docker container not responding${NC}"
fi

echo "Testing Nginx proxy..."
if curl -f http://localhost > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Nginx proxy working${NC}"
else
    echo -e "${RED}❌ Nginx proxy not working${NC}"
fi
echo ""

# Final summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📊 Service Status:"
echo "  - Docker Container: Running on port 3000"
echo "  - Nginx: Running on port 80"
echo ""
echo "🌐 Access URLs:"
echo "  - Direct Container: http://localhost:3000"
echo "  - Via Nginx: http://localhost"
echo "  - Public: http://www.amrechaudage.fr"
echo ""
echo "📝 Next Steps:"
echo "  1. Test: http://www.amrechaudage.fr"
echo "  2. Install SSL: sudo certbot --nginx -d amrechaudage.fr -d www.amrechaudage.fr"
echo ""
echo "🔍 Useful Commands:"
echo "  - Check container: docker ps | grep amr-frontend"
echo "  - Container logs: docker logs -f amr-frontend"
echo "  - Nginx status: sudo systemctl status nginx"
echo "  - Nginx logs: sudo tail -f /var/log/nginx/access.log"
echo ""
