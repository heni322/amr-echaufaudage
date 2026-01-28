# AMR Echafaudage - Deployment Guide

## 🚀 Automated Deployment (GitHub Actions)

The project uses GitHub Actions for CI/CD. Every push to `main` or `master` branch automatically:
1. Builds a Docker image
2. Pushes it to GitHub Container Registry (GHCR)
3. Deploys to your VPS

### Prerequisites on VPS

1. **Ubuntu Server** (20.04 or later)
2. **Docker** and **Docker Compose** installed
3. **Git** installed
4. **Project cloned** in `~/amr-echaufaudage`

### GitHub Secrets Required

Add these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

| Secret Name | Description | Example |
|------------|-------------|---------|
| `VPS_HOST` | Your VPS IP address or domain | `123.45.67.89` |
| `VPS_USERNAME` | SSH username | `ubuntu` |
| `VPS_SSH_KEY` | Private SSH key for authentication | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VPS_PORT` | SSH port (optional) | `22` |

### How It Works

```mermaid
graph LR
    A[Push to main] --> B[Build Docker Image]
    B --> C[Push to GHCR]
    C --> D[SSH to VPS]
    D --> E[Pull Latest Image]
    E --> F[Deploy with Docker Compose]
    F --> G[Verify Deployment]
```

## 📦 Initial VPS Setup

### Step 1: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Log out and log back in for group changes to take effect
```

### Step 2: Install Docker Compose

```bash
# Docker Compose v2 is included with Docker Desktop
# Verify installation
docker compose version
```

### Step 3: Clone Repository

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/amr-echaufaudage.git
cd amr-echaufaudage
```

### Step 4: Run Setup Script

```bash
# Make script executable
chmod +x vps-setup.sh

# Run setup
./vps-setup.sh
```

This script will:
- ✅ Check prerequisites
- ✅ Create Docker network
- ✅ Set up environment files
- ✅ Login to GitHub Container Registry
- ✅ Pull and start containers
- ✅ Verify deployment

### Step 5: Configure Nginx (Reverse Proxy)

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/amr-frontend
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

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
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/amr-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Set Up SSL (Optional but Recommended)

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is set up automatically
```

## 🔧 Manual Deployment

If you need to deploy manually:

```bash
# Navigate to project
cd ~/amr-echaufaudage

# Run quick deploy script
chmod +x quick-deploy-manual.sh
./quick-deploy-manual.sh
```

Or step by step:

```bash
# Pull latest code
git pull

# Set environment variable
export GITHUB_REPOSITORY="your-username/amr-echaufaudage"

# Login to GHCR (if not already logged in)
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Pull latest image
docker-compose pull

# Restart services
docker-compose down
docker-compose up -d

# Check status
docker ps
docker logs -f amr-frontend
```

## 📊 Monitoring & Maintenance

### View Logs

```bash
# Real-time logs
docker logs -f amr-frontend

# Last 100 lines
docker logs --tail 100 amr-frontend

# Logs with timestamps
docker logs -t amr-frontend
```

### Check Container Status

```bash
# List running containers
docker ps

# Detailed container info
docker inspect amr-frontend

# Health check status
docker inspect --format='{{.State.Health.Status}}' amr-frontend
```

### Restart Services

```bash
cd ~/amr-echaufaudage
docker-compose restart
```

### Update to Latest Version

```bash
cd ~/amr-echaufaudage
git pull
docker-compose pull
docker-compose up -d
```

### Clean Up Old Images

```bash
# Remove unused images
docker image prune -a

# Remove all stopped containers and unused networks
docker system prune -a
```

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs amr-frontend

# Check if port is available
sudo netstat -tulpn | grep :3000

# Check if network exists
docker network ls | grep amr-network

# Recreate network if needed
docker network rm amr-network
docker network create amr-network
```

### Image Pull Fails

```bash
# Re-login to GHCR
echo YOUR_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Try pulling manually
docker pull ghcr.io/your-username/amr-echaufaudage/amr-echafaudage-frontend:latest
```

### Port Already in Use

```bash
# Find what's using port 3000
sudo lsof -i :3000

# Kill the process (if safe to do so)
sudo kill -9 PID
```

### GitHub Actions Deployment Fails

1. Check GitHub Actions logs in your repository
2. Verify all secrets are correctly set
3. Ensure SSH key has correct permissions (600)
4. Test SSH connection manually:
   ```bash
   ssh -i ~/.ssh/your-key ubuntu@your-vps-ip
   ```

## 🔐 Security Best Practices

1. **Use SSH Keys** - Never use password authentication
2. **Firewall** - Configure UFW to allow only necessary ports:
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
3. **SSL/TLS** - Always use HTTPS in production
4. **Regular Updates** - Keep system and Docker updated:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
5. **Secrets Management** - Never commit secrets to git

## 📝 Environment Variables

Create a `.env.docker` file in the project root:

```env
GITHUB_REPOSITORY=your-username/amr-echaufaudage
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           Internet Traffic              │
└──────────────┬──────────────────────────┘
               │
               ▼
     ┌─────────────────┐
     │  Nginx (Port 80) │ → Reverse Proxy
     └────────┬─────────┘
              │
              ▼
   ┌──────────────────────┐
   │  Docker Container     │
   │  amr-frontend         │
   │  (Port 3000→8080)     │
   │  nginx:alpine         │
   └──────────────────────┘
```

## 📚 Useful Commands Reference

```bash
# Docker Compose
docker-compose up -d              # Start services
docker-compose down               # Stop services
docker-compose restart            # Restart services
docker-compose logs -f            # View logs
docker-compose ps                 # List services
docker-compose pull               # Pull latest images

# Docker
docker ps                         # List running containers
docker ps -a                      # List all containers
docker images                     # List images
docker logs amr-frontend          # View container logs
docker exec -it amr-frontend sh   # Enter container shell
docker stats amr-frontend         # View resource usage

# System
sudo systemctl status nginx       # Check Nginx status
sudo systemctl reload nginx       # Reload Nginx config
sudo netstat -tulpn              # List listening ports
df -h                            # Check disk space
free -m                          # Check memory
```

## 🆘 Support

If you encounter issues:
1. Check the logs: `docker logs amr-frontend`
2. Verify network: `docker network inspect amr-network`
3. Check GitHub Actions logs in your repository
4. Ensure all prerequisites are met

## 📄 License

[Your License Here]
