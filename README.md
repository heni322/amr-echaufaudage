# AMR Echafaudage - Landing Page

🌐 **www.amrechaudage.fr**

Static React + Vite landing page with Docker deployment and CI/CD pipeline.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start the service
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop service
docker-compose down
```

The frontend will be available at `http://localhost:3000`

### Manual Docker Deployment

```bash
# Create network (if not exists)
docker network create amr-network

# Build image
docker build -t amr-frontend .

# Run container
docker run -d \
  --name amr-frontend \
  --restart unless-stopped \
  --network amr-network \
  -p 3000:80 \
  amr-frontend
```

### Using Deployment Script

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## 🔄 CI/CD Pipeline

The project uses GitHub Actions for automated deployment to VPS.

### Setup Instructions

1. **Enable GitHub Container Registry**
   - Go to repository Settings → Packages
   - Enable "Container registry"

2. **Configure GitHub Secrets**
   
   Add these secrets in Settings → Secrets and variables → Actions:

   - `VPS_HOST`: Your VPS IP address (e.g., `123.45.67.89`)
   - `VPS_USERNAME`: SSH username (usually `ubuntu` or `root`)
   - `VPS_SSH_KEY`: Your private SSH key (from `~/.ssh/github_deploy`)
   - `VPS_PORT`: SSH port (default: 22)

3. **Get Your SSH Key from VPS**

   ```bash
   # SSH into your VPS
   ssh ubuntu@your-vps-ip
   
   # Display the private key (if you have github_deploy)
   cat ~/.ssh/github_deploy
   
   # OR generate a new one
   ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_deploy -N ""
   cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
   cat ~/.ssh/github_deploy
   
   # Copy the entire output (including BEGIN/END lines) to GitHub Secret
   ```

4. **Prepare VPS**

   SSH into your VPS and run:

   ```bash
   # Create project directory
   mkdir -p ~/amr-echafaudage
   cd ~/amr-echafaudage
   
   # Clone repository
   git clone https://github.com/YOUR_USERNAME/amr-echafaudage.git .
   
   # Create Docker network (if not exists)
   docker network create amr-network || true
   
   # Create .env file (optional for this static site)
   cp .env.example .env
   ```

5. **Trigger Deployment**

   Push to main/master branch or manually trigger workflow:

   ```bash
   git add .
   git commit -m "Setup CI/CD"
   git push origin main
   ```

### Pipeline Workflow

1. **Build Stage**: Builds Docker image and pushes to GitHub Container Registry
2. **Deploy Stage**: 
   - Connects to VPS via SSH
   - Pulls latest image
   - Stops old container
   - Starts new container on port 3000
   - Verifies deployment

## 🔧 Configuration

### Domain

**Production:** https://www.amrechaudage.fr
**Alternative:** https://amrechaudage.fr

See `DOMAIN-SETUP.md` for complete domain configuration guide.

### Port Configuration

**Current Services:**
- **Frontend: Port 3000** ✅ (avoids conflicts)
- **Nginx Reverse Proxy: Port 80/443** (for domain access)

### Environment Variables

Create `.env` file based on `.env.example`:

```bash
NODE_ENV=production

# Optional: If you need to connect to an external API
# API_URL=https://api.example.com
```

### Nginx Configuration

The `nginx.conf` includes:
- Gzip compression
- Security headers
- Static asset caching
- Client-side routing support
- Health check endpoint

## 📊 Monitoring

### Check Container Status

```bash
# View running containers
docker ps

# View logs
docker logs -f amr-frontend

# Check health
docker inspect amr-frontend | grep -A 10 Health
```

### Access Health Endpoint

```bash
# Frontend health
curl http://localhost:3000/
```

## 🔒 Security

- HTTPS should be configured via reverse proxy (nginx/traefik)
- Security headers in nginx configuration
- Regular dependency updates
- Container health checks

## 🛠️ Troubleshooting

### Container won't start

```bash
# Check logs
docker logs amr-frontend

# Verify network
docker network ls | grep amr-network

# Check port conflicts
netstat -tulpn | grep :3000
```

### Deployment fails

```bash
# SSH into VPS
ssh ubuntu@your-vps-ip

# Check Docker status
docker ps -a

# View GitHub Actions logs
# Go to Actions tab in GitHub repository
```

### Update dependencies

```bash
# On VPS
cd ~/amr-echafaudage
git pull
docker-compose down
docker-compose up -d --build
```

## 📁 Project Structure

```
amr-echafaudage/
├── .github/
│   └── workflows/
│       ├── deploy.yml              # CI/CD pipeline
│       └── ci.yml                  # Build testing
├── public/                         # Static assets
├── src/                            # React source code
├── .env.example                    # Environment template
├── docker-compose.yml              # Container configuration
├── Dockerfile                      # Frontend container
├── nginx.conf                      # Web server configuration
├── deploy.sh                       # Manual deployment script
├── setup-vps.sh                    # VPS setup script
├── DOMAIN-SETUP.md                 # Domain configuration guide
├── QUICK-DOMAIN-SETUP.md           # Quick domain setup
├── DEPLOYMENT.md                   # Deployment guide
├── TROUBLESHOOTING.md              # Issue solutions
└── package.json                    # Node dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📝 License

This project is private and confidential.

## 🆘 Support

For issues or questions:
- Check GitHub Issues
- Review GitHub Actions logs
- Check `TROUBLESHOOTING.md`

---

**Deployment Status:** [![Deploy to VPS](https://github.com/YOUR_USERNAME/amr-echafaudage/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/amr-echafaudage/actions/workflows/deploy.yml)
