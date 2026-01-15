# 🚀 Deployment Guide - AMR Echafaudage

Complete step-by-step guide to deploy your React landing page to VPS with CI/CD.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] VPS server with Ubuntu (currently running: postgres on 5432, backend on 4000)
- [ ] SSH access to VPS
- [ ] GitHub account with this repository
- [ ] Docker installed on VPS
- [ ] Git installed locally and on VPS

## 🎯 Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│                   VPS Server                    │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐           │
│  │  PostgreSQL  │  │   Backend    │           │
│  │  Port: 5432  │  │  Port: 4000  │           │
│  │  (existing)  │  │  (existing)  │           │
│  └──────────────┘  └──────────────┘           │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │         Frontend (New)                  │  │
│  │         React + Vite + Nginx             │  │
│  │         Port: 3000 ✅                     │  │
│  │         (avoids port conflicts)          │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  Network: amr-network (Docker bridge)          │
└─────────────────────────────────────────────────┘
```

## 📝 Step 1: Prepare Local Repository

### 1.1 Initialize Git (if not already done)

```bash
cd D:\amr-echafaudage

# Initialize git if needed
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit with CI/CD setup"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create repository: `amr-echafaudage`
3. Don't initialize with README (we have one)
4. Copy the repository URL

### 1.3 Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/amr-echafaudage.git

# Push to main branch
git branch -M main
git push -u origin main
```

## 🔐 Step 2: Configure SSH Access

### 2.1 Generate SSH Key (if you don't have one)

On your **local machine**:

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/amr-vps

# This creates:
# ~/.ssh/amr-vps (private key) - for GitHub
# ~/.ssh/amr-vps.pub (public key) - for VPS
```

### 2.2 Add Public Key to VPS

```bash
# Copy public key
cat ~/.ssh/amr-vps.pub

# SSH into your VPS
ssh ubuntu@YOUR_VPS_IP

# Add the public key
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the public key, save and exit

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
exit
```

### 2.3 Test SSH Connection

```bash
# Test from local machine
ssh -i ~/.ssh/amr-vps ubuntu@YOUR_VPS_IP

# If successful, you're connected!
exit
```

## 🔧 Step 3: Setup VPS

### 3.1 Copy Setup Script to VPS

```bash
# From your local machine
scp -i ~/.ssh/amr-vps D:\amr-echafaudage\setup-vps.sh ubuntu@YOUR_VPS_IP:~/
```

### 3.2 Run Setup Script on VPS

```bash
# SSH into VPS
ssh -i ~/.ssh/amr-vps ubuntu@YOUR_VPS_IP

# Make script executable
chmod +x ~/setup-vps.sh

# Run setup
./setup-vps.sh

# Follow the prompts:
# - Enter your GitHub repository URL when asked
# - Edit .env file with secure passwords
```

### 3.3 Configure Environment

```bash
# Edit environment file
cd ~/amr-echafaudage
nano .env
```

Update with your values:
```env
POSTGRES_DB=amr_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD_HERE
VITE_API_URL=http://YOUR_VPS_IP:4000
NODE_ENV=production
```

Save and exit (Ctrl+X, Y, Enter)

## 🔑 Step 4: Configure GitHub Secrets

### 4.1 Get Private SSH Key

On your **local machine**:

```bash
# Display private key
cat ~/.ssh/amr-vps

# Copy the entire output (including -----BEGIN and -----END lines)
```

### 4.2 Add Secrets to GitHub

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `VPS_HOST` | Your VPS IP address | `123.45.67.89` |
| `VPS_USERNAME` | SSH username | `ubuntu` |
| `VPS_SSH_KEY` | Private SSH key content | Entire content from `cat ~/.ssh/amr-vps` |
| `VPS_PORT` | SSH port (optional) | `22` |

### 4.3 Enable GitHub Container Registry

1. Go to repository **Settings**
2. Scroll to **Packages**
3. Enable **Container registry**
4. Make sure package visibility is set correctly

## 🚀 Step 5: Deploy

### 5.1 Trigger Automatic Deployment

Simply push to main branch:

```bash
git add .
git commit -m "Trigger deployment"
git push origin main
```

### 5.2 Monitor Deployment

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Watch the "Deploy to VPS" workflow
4. Check for any errors in the logs

### 5.3 Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# SSH into VPS
ssh -i ~/.ssh/amr-vps ubuntu@YOUR_VPS_IP

# Navigate to project
cd ~/amr-echafaudage

# Pull latest changes
git pull

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

## ✅ Step 6: Verify Deployment

### 6.1 Check Services

```bash
# On VPS, check running containers
docker ps

# You should see:
# - postgres (port 5432)
# - backend (port 4000)
# - amr-frontend (port 3000) ✅ NEW
```

### 6.2 Test Frontend

```bash
# From VPS
curl http://localhost:3000
curl http://localhost:3000/health

# From browser
http://YOUR_VPS_IP:3000
```

### 6.3 Check Logs

```bash
# View frontend logs
docker logs -f amr-frontend

# View all services
docker-compose logs -f
```

## 🔄 Step 7: Configure Firewall (Optional but Recommended)

```bash
# SSH into VPS
ssh -i ~/.ssh/amr-vps ubuntu@YOUR_VPS_IP

# Allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Frontend
sudo ufw allow 4000/tcp  # Backend

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## 🌐 Step 8: Setup Domain (Optional)

### 8.1 DNS Configuration

Point your domain to VPS:
```
A Record: @ → YOUR_VPS_IP
A Record: www → YOUR_VPS_IP
```

### 8.2 Nginx Reverse Proxy

Create `/etc/nginx/sites-available/amr-echafaudage`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/amr-echafaudage /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8.3 SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🎉 Success!

Your landing page is now deployed! 

**Access URLs:**
- Frontend: `http://YOUR_VPS_IP:3000`
- Backend API: `http://YOUR_VPS_IP:4000`
- Health Check: `http://YOUR_VPS_IP:3000/health`

## 🔄 Making Updates

### Automatic Updates (Recommended)

Just push to GitHub:
```bash
git add .
git commit -m "Update landing page content"
git push origin main
```

GitHub Actions will automatically:
1. Build new Docker image
2. Push to GitHub Container Registry
3. Deploy to VPS
4. Restart container

### Manual Updates

```bash
# SSH into VPS
ssh -i ~/.ssh/amr-vps ubuntu@YOUR_VPS_IP

# Navigate to project
cd ~/amr-echafaudage

# Pull changes
git pull

# Rebuild and restart
docker-compose up -d --build frontend
```

## 📊 Monitoring

### View Status

```bash
# Check all containers
docker ps

# View resource usage
docker stats

# Check logs
docker logs -f amr-frontend
```

### Health Checks

```bash
# Frontend health
curl http://localhost:3000/health

# Backend health
curl http://localhost:4000/health

# Database
docker exec postgres pg_isready
```

## 🆘 Troubleshooting

If something goes wrong, check:

1. **GitHub Actions logs** - See deployment errors
2. **Container logs** - `docker logs amr-frontend`
3. **VPS connectivity** - Can you SSH in?
4. **Port conflicts** - `netstat -tulpn | grep 3000`
5. **Docker status** - `docker ps -a`

See `TROUBLESHOOTING.md` for detailed solutions.

## 📞 Support

- GitHub Issues: Create an issue in the repository
- Check logs: `docker logs amr-frontend`
- Run debug: See troubleshooting guide
- Contact: Development team

---

**Congratulations! Your CI/CD pipeline is now set up! 🎊**

Every push to main branch will automatically deploy your changes to the VPS.
