#!/bin/bash

# AMR Echafaudage - Troubleshooting Script
# Run this on your VPS to diagnose deployment issues

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 AMR Echafaudage - System Diagnostics${NC}"
echo "========================================"

# Check Docker
echo -e "\n${YELLOW}1. Docker Installation${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker is installed${NC}"
    docker --version
else
    echo -e "${RED}❌ Docker is not installed${NC}"
fi

# Check Docker Compose
echo -e "\n${YELLOW}2. Docker Compose${NC}"
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose is available${NC}"
    docker compose version 2>/dev/null || docker-compose --version
else
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
fi

# Check if Docker daemon is running
echo -e "\n${YELLOW}3. Docker Service Status${NC}"
if systemctl is-active --quiet docker; then
    echo -e "${GREEN}✅ Docker daemon is running${NC}"
else
    echo -e "${RED}❌ Docker daemon is not running${NC}"
    echo "Try: sudo systemctl start docker"
fi

# Check Docker network
echo -e "\n${YELLOW}4. Docker Network${NC}"
if docker network ls | grep -q amr-network; then
    echo -e "${GREEN}✅ amr-network exists${NC}"
    docker network inspect amr-network --format '{{.Name}}: {{.Driver}}'
else
    echo -e "${RED}❌ amr-network does not exist${NC}"
    echo "Create it with: docker network create amr-network"
fi

# Check running containers
echo -e "\n${YELLOW}5. Running Containers${NC}"
if docker ps | grep -q amr-frontend; then
    echo -e "${GREEN}✅ amr-frontend container is running${NC}"
    docker ps --filter "name=amr-frontend" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
    echo -e "${RED}❌ amr-frontend container is not running${NC}"
    if docker ps -a | grep -q amr-frontend; then
        echo "Container exists but is stopped:"
        docker ps -a --filter "name=amr-frontend" --format "table {{.Names}}\t{{.Status}}"
    else
        echo "Container does not exist at all"
    fi
fi

# Check all containers (including stopped)
echo -e "\n${YELLOW}6. All Containers (including stopped)${NC}"
docker ps -a

# Check images
echo -e "\n${YELLOW}7. Docker Images${NC}"
if docker images | grep -q amr-echafaudage-frontend; then
    echo -e "${GREEN}✅ amr-echafaudage-frontend image exists${NC}"
    docker images | grep amr-echafaudage-frontend
else
    echo -e "${RED}❌ amr-echafaudage-frontend image not found${NC}"
    echo "Try pulling: docker-compose pull"
fi

# Check ports
echo -e "\n${YELLOW}8. Port Usage${NC}"
echo "Checking port 3000 (frontend)..."
if sudo netstat -tulpn 2>/dev/null | grep -q :3000; then
    echo -e "${GREEN}✅ Port 3000 is in use${NC}"
    sudo netstat -tulpn | grep :3000
else
    echo -e "${YELLOW}⚠️  Port 3000 is not in use${NC}"
fi

echo ""
echo "Checking port 80 (Nginx)..."
if sudo netstat -tulpn 2>/dev/null | grep -q :80; then
    echo -e "${GREEN}✅ Port 80 is in use${NC}"
    sudo netstat -tulpn | grep :80
else
    echo -e "${YELLOW}⚠️  Port 80 is not in use${NC}"
fi

# Check project directory
echo -e "\n${YELLOW}9. Project Directory${NC}"
PROJECT_DIR="$HOME/amr-echaufaudage"
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${GREEN}✅ Project directory exists: $PROJECT_DIR${NC}"
    cd "$PROJECT_DIR"
    
    # Check for required files
    if [ -f "docker-compose.yml" ]; then
        echo -e "${GREEN}✅ docker-compose.yml found${NC}"
    else
        echo -e "${RED}❌ docker-compose.yml not found${NC}"
    fi
    
    if [ -f "Dockerfile" ]; then
        echo -e "${GREEN}✅ Dockerfile found${NC}"
    else
        echo -e "${RED}❌ Dockerfile not found${NC}"
    fi
    
    # Check git status
    if [ -d ".git" ]; then
        echo -e "${GREEN}✅ Git repository initialized${NC}"
        echo "Current branch: $(git branch --show-current)"
        echo "Latest commit: $(git log -1 --oneline)"
    fi
else
    echo -e "${RED}❌ Project directory not found: $PROJECT_DIR${NC}"
fi

# Check GHCR login
echo -e "\n${YELLOW}10. GitHub Container Registry Login${NC}"
if [ -f "$HOME/.docker/config.json" ]; then
    if grep -q "ghcr.io" "$HOME/.docker/config.json"; then
        echo -e "${GREEN}✅ Logged in to ghcr.io${NC}"
    else
        echo -e "${YELLOW}⚠️  Not logged in to ghcr.io${NC}"
        echo "Login with: echo TOKEN | docker login ghcr.io -u USERNAME --password-stdin"
    fi
else
    echo -e "${YELLOW}⚠️  Docker config not found${NC}"
fi

# Check Nginx
echo -e "\n${YELLOW}11. Nginx Status${NC}"
if command -v nginx &> /dev/null; then
    echo -e "${GREEN}✅ Nginx is installed${NC}"
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✅ Nginx is running${NC}"
    else
        echo -e "${RED}❌ Nginx is not running${NC}"
    fi
    
    # Test configuration
    if sudo nginx -t &> /dev/null; then
        echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    else
        echo -e "${RED}❌ Nginx configuration has errors${NC}"
        sudo nginx -t
    fi
else
    echo -e "${YELLOW}⚠️  Nginx is not installed${NC}"
fi

# Check disk space
echo -e "\n${YELLOW}12. Disk Space${NC}"
df -h / | tail -1 | awk '{
    usage = substr($5, 1, length($5)-1)
    if (usage > 90) {
        print "\033[0;31m❌ Disk usage is critical: " $5 " used\033[0m"
    } else if (usage > 80) {
        print "\033[1;33m⚠️  Disk usage is high: " $5 " used\033[0m"
    } else {
        print "\033[0;32m✅ Disk usage is healthy: " $5 " used\033[0m"
    }
}'

# Check memory
echo -e "\n${YELLOW}13. Memory Usage${NC}"
free -h | grep Mem | awk '{
    total = $2
    used = $3
    free = $4
    print "Total: " total ", Used: " used ", Free: " free
}'

# Container logs if exists
echo -e "\n${YELLOW}14. Recent Container Logs${NC}"
if docker ps -a | grep -q amr-frontend; then
    echo "Last 15 lines of amr-frontend logs:"
    echo "-----------------------------------"
    docker logs --tail 15 amr-frontend 2>&1
else
    echo -e "${YELLOW}No container logs available${NC}"
fi

# Docker Compose status
echo -e "\n${YELLOW}15. Docker Compose Status${NC}"
if [ -d "$PROJECT_DIR" ]; then
    cd "$PROJECT_DIR"
    if [ -f "docker-compose.yml" ]; then
        docker-compose ps 2>/dev/null || docker compose ps 2>/dev/null
    fi
fi

# Summary
echo -e "\n${BLUE}================================${NC}"
echo -e "${BLUE}📋 Diagnostic Summary${NC}"
echo -e "${BLUE}================================${NC}"

echo -e "\n${YELLOW}Quick Fixes:${NC}"
echo "If container is not running, try:"
echo "  cd ~/amr-echaufaudage"
echo "  docker-compose up -d"
echo ""
echo "If image is missing, try:"
echo "  docker-compose pull"
echo ""
echo "If network is missing, try:"
echo "  docker network create amr-network"
echo ""
echo "To view live logs:"
echo "  docker logs -f amr-frontend"
echo ""
echo "To restart services:"
echo "  docker-compose restart"

echo -e "\n${GREEN}Diagnostics complete!${NC}"
