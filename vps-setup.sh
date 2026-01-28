#!/bin/bash

# AMR Echafaudage - VPS Setup and Deployment Script
# This script should be run on your VPS to set up the environment

set -e

echo "🚀 AMR Echafaudage - VPS Setup"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as correct user
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}❌ Please do not run as root. Run as ubuntu user.${NC}"
   exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Check prerequisites
echo -e "\n${YELLOW}📋 Checking prerequisites...${NC}"

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Install Docker with: curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
    exit 1
fi

if ! command_exists git; then
    echo -e "${RED}❌ Git is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites met${NC}"

# 2. Navigate to project directory
PROJECT_DIR="$HOME/amr-echaufaudage"
echo -e "\n${YELLOW}📂 Setting up project directory...${NC}"

if [ ! -d "$PROJECT_DIR" ]; then
    echo "Cloning repository..."
    cd ~
    # Replace with your actual repository URL
    read -p "Enter your GitHub repository URL: " REPO_URL
    git clone "$REPO_URL" amr-echaufaudage
    cd amr-echaufaudage
else
    echo "Project directory exists, updating..."
    cd "$PROJECT_DIR"
    git pull
fi

# 3. Create Docker network
echo -e "\n${YELLOW}🌐 Creating Docker network...${NC}"
docker network create amr-network 2>/dev/null && echo -e "${GREEN}✅ Network created${NC}" || echo -e "${YELLOW}⚠️  Network already exists${NC}"

# 4. Set up environment file
echo -e "\n${YELLOW}⚙️  Setting up environment...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created from template${NC}"
    echo "Please edit .env if needed"
else
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
fi

# 5. Login to GitHub Container Registry
echo -e "\n${YELLOW}🔐 GitHub Container Registry Login${NC}"
echo "You need a GitHub Personal Access Token with packages:read permission"
read -p "Enter your GitHub username: " GITHUB_USER
read -sp "Enter your GitHub Personal Access Token: " GITHUB_TOKEN
echo ""

echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USER" --password-stdin

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully logged in to GHCR${NC}"
else
    echo -e "${RED}❌ Failed to login to GHCR${NC}"
    exit 1
fi

# 6. Create .env file for docker-compose
echo -e "\n${YELLOW}📝 Setting up Docker Compose environment...${NC}"
read -p "Enter your GitHub repository (e.g., username/repo): " GITHUB_REPO
echo "GITHUB_REPOSITORY=$GITHUB_REPO" > .env.docker
echo -e "${GREEN}✅ Docker Compose environment configured${NC}"

# 7. Pull the latest image
echo -e "\n${YELLOW}📦 Pulling latest Docker image...${NC}"
export GITHUB_REPOSITORY="$GITHUB_REPO"
docker-compose pull

# 8. Stop any running containers
echo -e "\n${YELLOW}🛑 Stopping old containers...${NC}"
docker-compose down 2>/dev/null || true

# 9. Start the services
echo -e "\n${YELLOW}🚀 Starting services...${NC}"
docker-compose up -d

# 10. Wait for container to be healthy
echo -e "\n${YELLOW}⏳ Waiting for container to be healthy...${NC}"
sleep 10

# 11. Check status
echo -e "\n${YELLOW}📊 Checking deployment status...${NC}"
if docker ps | grep -q amr-frontend; then
    echo -e "${GREEN}✅ Container is running!${NC}"
    echo ""
    docker ps --filter "name=amr-frontend" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo -e "${YELLOW}📝 Recent logs:${NC}"
    docker logs --tail 20 amr-frontend
else
    echo -e "${RED}❌ Container failed to start${NC}"
    docker logs amr-frontend 2>&1
    exit 1
fi

# 12. Configure Nginx (if needed)
echo -e "\n${YELLOW}🌐 Nginx Configuration${NC}"
if command_exists nginx; then
    echo "Nginx is installed. You may need to configure it as a reverse proxy."
    echo "Example configuration:"
    echo ""
    cat << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
    echo ""
    echo "Save this to: /etc/nginx/sites-available/amr-frontend"
    echo "Then: sudo ln -s /etc/nginx/sites-available/amr-frontend /etc/nginx/sites-enabled/"
    echo "And: sudo nginx -t && sudo systemctl reload nginx"
fi

echo -e "\n${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Configure your domain/DNS to point to this server"
echo "2. Set up Nginx reverse proxy (if not already done)"
echo "3. Configure SSL/TLS with Let's Encrypt"
echo "4. Test your application at http://$(curl -s ifconfig.me):3000"
echo ""
echo "🔧 Useful commands:"
echo "  docker-compose logs -f           # View logs"
echo "  docker-compose restart           # Restart services"
echo "  docker-compose down              # Stop services"
echo "  docker-compose up -d             # Start services"
