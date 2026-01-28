#!/bin/bash

# Health Check Script for AMR Echafaudage
# Run this to verify the application is working correctly

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🏥 AMR Echafaudage - Health Check"
echo "=================================="

# Function to check HTTP endpoint
check_endpoint() {
    local url=$1
    local name=$2
    
    if curl -s -f -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        echo -e "${GREEN}✅ $name is responding${NC}"
        return 0
    else
        echo -e "${RED}❌ $name is not responding${NC}"
        return 1
    fi
}

# Check container is running
echo -e "\n${YELLOW}1. Container Status${NC}"
if docker ps | grep -q amr-frontend; then
    echo -e "${GREEN}✅ Container is running${NC}"
    docker ps --filter "name=amr-frontend" --format "{{.Names}}: {{.Status}}"
else
    echo -e "${RED}❌ Container is not running${NC}"
    exit 1
fi

# Check container health
echo -e "\n${YELLOW}2. Container Health${NC}"
health=$(docker inspect --format='{{.State.Health.Status}}' amr-frontend 2>/dev/null)
if [ "$health" = "healthy" ]; then
    echo -e "${GREEN}✅ Container is healthy${NC}"
elif [ "$health" = "starting" ]; then
    echo -e "${YELLOW}⏳ Container is starting...${NC}"
elif [ -z "$health" ]; then
    echo -e "${YELLOW}⚠️  No health check configured${NC}"
else
    echo -e "${RED}❌ Container is unhealthy: $health${NC}"
fi

# Check internal health endpoint
echo -e "\n${YELLOW}3. Internal Health Endpoint${NC}"
if docker exec amr-frontend wget -q -O - http://localhost:8080/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Internal health endpoint responding${NC}"
else
    echo -e "${RED}❌ Internal health endpoint not responding${NC}"
fi

# Check if port 3000 is accessible
echo -e "\n${YELLOW}4. Port Accessibility${NC}"
if curl -s -f -o /dev/null http://localhost:3000 2>/dev/null; then
    echo -e "${GREEN}✅ Port 3000 is accessible${NC}"
else
    echo -e "${RED}❌ Port 3000 is not accessible${NC}"
fi

# Check external access (if domain configured)
echo -e "\n${YELLOW}5. External Access${NC}"
read -p "Enter your domain (or press Enter to skip): " domain
if [ -n "$domain" ]; then
    if curl -s -f -o /dev/null "http://$domain" 2>/dev/null; then
        echo -e "${GREEN}✅ $domain is accessible${NC}"
    else
        echo -e "${RED}❌ $domain is not accessible${NC}"
    fi
else
    echo "Skipped"
fi

# Check Nginx status (if installed)
echo -e "\n${YELLOW}6. Nginx Status${NC}"
if command -v nginx &> /dev/null; then
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✅ Nginx is running${NC}"
    else
        echo -e "${RED}❌ Nginx is not running${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Nginx is not installed${NC}"
fi

# Check recent logs for errors
echo -e "\n${YELLOW}7. Recent Error Logs${NC}"
error_count=$(docker logs --since 5m amr-frontend 2>&1 | grep -i "error" | wc -l)
if [ "$error_count" -eq 0 ]; then
    echo -e "${GREEN}✅ No errors in last 5 minutes${NC}"
else
    echo -e "${YELLOW}⚠️  Found $error_count error(s) in last 5 minutes${NC}"
    docker logs --since 5m amr-frontend 2>&1 | grep -i "error" | tail -5
fi

# Resource usage
echo -e "\n${YELLOW}8. Resource Usage${NC}"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" amr-frontend

# Summary
echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}Health check complete!${NC}"
echo -e "${GREEN}================================${NC}"

# Quick access URLs
echo -e "\n${YELLOW}📍 Access URLs:${NC}"
echo "Local: http://localhost:3000"
if [ -n "$domain" ]; then
    echo "Domain: http://$domain"
fi
echo "Health: http://localhost:3000/health"
