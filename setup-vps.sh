#!/bin/bash

# VPS Setup Script for AMR Echafaudage
# Run this script on your VPS server

set -e

echo "🔧 Setting up VPS for AMR Echafaudage deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
PROJECT_DIR="$HOME/amr-echafaudage"
NETWORK_NAME="amr-network"

# Check if running as ubuntu user
if [ "$USER" != "ubuntu" ] && [ "$USER" != "root" ]; then
    echo -e "${RED}⚠️  Warning: This script is designed for ubuntu or root user${NC}"
fi

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}🐳 Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker installed${NC}"
else
    echo -e "${GREEN}✅ Docker already installed${NC}"
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}🐳 Installing Docker Compose...${NC}"
    sudo apt-get install docker-compose -y
    echo -e "${GREEN}✅ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✅ Docker Compose already installed${NC}"
fi

# Create Docker network if not exists
echo -e "${YELLOW}🌐 Creating Docker network...${NC}"
docker network create $NETWORK_NAME 2>/dev/null || echo -e "${GREEN}✅ Network already exists${NC}"

# Create project directory
echo -e "${YELLOW}📁 Creating project directory...${NC}"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Initialize git repository
echo -e "${YELLOW}🔧 Setting up Git repository...${NC}"
if [ ! -d ".git" ]; then
    echo "Enter your GitHub repository URL (e.g., https://github.com/username/amr-echafaudage.git):"
    read REPO_URL
    git clone $REPO_URL .
else
    echo -e "${GREEN}✅ Git repository already initialized${NC}"
fi

# Create .env file if not exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cat > .env << 'EOF'
# Node Environment
NODE_ENV=production

# Optional: If you need to connect to an external API
# API_URL=https://api.example.com
EOF
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Install GitHub CLI (optional, for easier authentication)
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}📦 Installing GitHub CLI...${NC}"
    type -p curl >/dev/null || sudo apt install curl -y
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
    sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
    sudo apt update
    sudo apt install gh -y
    echo -e "${GREEN}✅ GitHub CLI installed${NC}"
    echo -e "${YELLOW}Run 'gh auth login' to authenticate${NC}"
fi

# Display current containers
echo -e "\n${YELLOW}🐳 Current Docker containers:${NC}"
docker ps -a

# Display network info
echo -e "\n${YELLOW}🌐 Docker networks:${NC}"
docker network ls

# Final instructions
echo -e "\n${GREEN}🎉 VPS setup completed!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Verify repository: ${GREEN}cd $PROJECT_DIR && git status${NC}"
echo "2. Test Docker: ${GREEN}docker run hello-world${NC}"
echo "3. Configure GitHub Actions secrets in your repository"
echo "4. Push to trigger deployment or run: ${GREEN}./deploy.sh${NC}"

echo -e "\n${YELLOW}📊 Service Ports:${NC}"
echo "- Frontend: http://$(curl -s ifconfig.me):3000"

echo -e "\n${YELLOW}🔐 Security Recommendations:${NC}"
echo "- Configure firewall: sudo ufw allow 3000/tcp"
echo "- Set up HTTPS with Let's Encrypt"
echo "- Enable automatic security updates"

echo -e "\n${GREEN}✨ Setup completed successfully!${NC}"
