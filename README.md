# AMR Echafaudage - Landing Page

React + Vite landing page with Docker deployment and CI/CD pipeline.

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
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop services
docker-compose down
```

The frontend will be available at `http://localhost:3000`

### Manual Docker Deployment

```bash
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
   - `VPS_SSH_KEY`: Your private SSH key
   - `VPS_PORT`: SSH port (default: 22)

3. **Generate SSH Key** (if you don't have one)

   ```bash
   # On your local machine
   ssh-keygen -t ed25519 -C "github-actions"
   
   # Copy public key to VPS
   ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@your-vps-ip
   
   # Copy private key content for GitHub secret
   cat ~/.ssh/id_ed25519
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
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your configurations
   nano .env
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

### Port Configuration

**Current Services:**
- PostgreSQL: Port 5432 (internal)
- Backend API: Port 4000
- **Frontend: Port 3000** ✅ (avoids conflicts)

### Environment Variables

Create `.env` file based on `.env.example`:

```bash
POSTGRES_DB=amr_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
VITE_API_URL=http://localhost:4000
NODE_ENV=production
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

### Access Health Endpoints

```bash
# Frontend health
curl http://localhost:3000/health

# Backend health
curl http://localhost:4000/health
```

## 🔒 Security

- HTTPS should be configured via reverse proxy (nginx/traefik)
- Environment variables for sensitive data
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
│       └── deploy.yml          # CI/CD pipeline
├── public/                     # Static assets
├── src/                        # React source code
├── .env.example               # Environment template
├── docker-compose.yml         # Multi-service configuration
├── Dockerfile                 # Frontend container
├── nginx.conf                 # Web server configuration
├── deploy.sh                  # Manual deployment script
└── package.json              # Node dependencies
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
- Contact the development team

---

**Deployment Status:** [![Deploy to VPS](https://github.com/YOUR_USERNAME/amr-echafaudage/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/amr-echafaudage/actions/workflows/deploy.yml)
