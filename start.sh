#!/bin/bash

# Quick Start Script for AMR Echafaudage Development

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║   AMR Echafaudage - Quick Start       ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed${NC}"
    echo "Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠️  npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

# Create .env file if not exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cp .env.example .env 2>/dev/null || cat > .env << 'EOF'
VITE_API_URL=http://localhost:4000
NODE_ENV=development
EOF
    echo -e "${GREEN}✅ .env file created${NC}"
fi

echo ""
echo -e "${BLUE}Choose an option:${NC}"
echo "1) Start development server (npm run dev)"
echo "2) Build for production (npm run build)"
echo "3) Preview production build (npm run preview)"
echo "4) Run linter (npm run lint)"
echo "5) Start with Docker Compose"
echo "6) Exit"
echo ""

read -p "Enter your choice [1-6]: " choice

case $choice in
    1)
        echo -e "${YELLOW}🚀 Starting development server...${NC}"
        echo -e "${GREEN}Server will be available at http://localhost:5173${NC}"
        npm run dev
        ;;
    2)
        echo -e "${YELLOW}🏗️  Building for production...${NC}"
        npm run build
        echo -e "${GREEN}✅ Build completed! Check the 'dist' folder${NC}"
        ;;
    3)
        if [ ! -d "dist" ]; then
            echo -e "${YELLOW}📦 Building first...${NC}"
            npm run build
        fi
        echo -e "${YELLOW}👀 Starting preview server...${NC}"
        echo -e "${GREEN}Preview will be available at http://localhost:4173${NC}"
        npm run preview
        ;;
    4)
        echo -e "${YELLOW}🔍 Running linter...${NC}"
        npm run lint
        ;;
    5)
        if ! command -v docker &> /dev/null; then
            echo -e "${YELLOW}⚠️  Docker is not installed${NC}"
            echo "Please install Docker from https://www.docker.com/"
            exit 1
        fi
        echo -e "${YELLOW}🐳 Starting with Docker Compose...${NC}"
        docker-compose up -d
        echo ""
        echo -e "${GREEN}✅ Services started!${NC}"
        echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
        echo -e "${GREEN}Backend: http://localhost:4000${NC}"
        echo ""
        echo "View logs: docker-compose logs -f"
        echo "Stop services: docker-compose down"
        ;;
    6)
        echo -e "${BLUE}👋 Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${YELLOW}Invalid option. Please run the script again.${NC}"
        exit 1
        ;;
esac
