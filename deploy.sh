#!/bin/bash

# AMR Echafaudage Deployment Script
# This script deploys the frontend application to the VPS

set -e

echo "🚀 Starting deployment for AMR Echafaudage..."

# Configuration
CONTAINER_NAME="amr-frontend"
IMAGE_NAME="ghcr.io/$(git config --get remote.origin.url | sed 's/.*://;s/.git$//')/amr-echafaudage-frontend:latest"
PORT=3000
NETWORK_NAME="amr-network"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker build -t $IMAGE_NAME .

echo -e "${YELLOW}🌐 Creating network if it doesn't exist...${NC}"
docker network create $NETWORK_NAME 2>/dev/null || echo -e "${GREEN}✅ Network already exists${NC}"

echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

echo -e "${YELLOW}🚀 Starting new container...${NC}"
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  --network $NETWORK_NAME \
  -p $PORT:80 \
  -e NODE_ENV=production \
  $IMAGE_NAME

echo -e "${YELLOW}⏳ Waiting for container to be healthy...${NC}"
sleep 5

# Check if container is running
if docker ps | grep -q $CONTAINER_NAME; then
  echo -e "${GREEN}✅ Deployment successful!${NC}"
  echo -e "${GREEN}🌐 Frontend is running on port $PORT${NC}"
  echo -e "${GREEN}📊 Access it at: http://$(curl -s ifconfig.me 2>/dev/null || echo 'your-vps-ip'):$PORT${NC}"
  
  echo -e "\n${YELLOW}📋 Container logs:${NC}"
  docker logs --tail 20 $CONTAINER_NAME
else
  echo -e "${RED}❌ Deployment failed!${NC}"
  echo -e "${RED}📋 Container logs:${NC}"
  docker logs $CONTAINER_NAME
  exit 1
fi

echo -e "\n${YELLOW}🐳 Running containers:${NC}"
docker ps

echo -e "\n${GREEN}✨ Deployment completed successfully!${NC}"
