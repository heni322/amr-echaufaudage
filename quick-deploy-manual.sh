#!/bin/bash

# Quick Deploy Script for AMR Echafaudage
# Run this on your VPS to manually deploy the latest version

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🚀 Quick Deploy - AMR Echafaudage${NC}"
echo "=================================="

# Navigate to project directory
cd ~/amr-echaufaudage || {
    echo -e "${RED}❌ Project directory not found${NC}"
    exit 1
}

# Load environment
if [ -f .env.docker ]; then
    export $(cat .env.docker | grep -v '^#' | xargs)
fi

# Pull latest code
echo -e "\n${YELLOW}📥 Pulling latest code...${NC}"
git pull

# Pull latest image
echo -e "\n${YELLOW}📦 Pulling latest Docker image...${NC}"
docker-compose pull

# Restart services
echo -e "\n${YELLOW}🔄 Restarting services...${NC}"
docker-compose down
docker-compose up -d

# Wait for startup
echo -e "\n${YELLOW}⏳ Waiting for container...${NC}"
sleep 10

# Check status
if docker ps | grep -q amr-frontend; then
    echo -e "\n${GREEN}✅ Deployment successful!${NC}"
    echo ""
    docker ps --filter "name=amr-frontend" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo -e "${YELLOW}📝 Recent logs:${NC}"
    docker logs --tail 20 amr-frontend
else
    echo -e "\n${RED}❌ Deployment failed${NC}"
    docker logs amr-frontend 2>&1
    exit 1
fi
