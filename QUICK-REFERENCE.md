# 🏗️ AMR Echafaudage - Quick Reference

## 🚀 Quick Start

### For New VPS Setup:
```bash
ssh ubuntu@your-vps-ip
cd ~
git clone https://github.com/YOUR_USERNAME/amr-echaufaudage.git
cd amr-echaufaudage
chmod +x vps-setup.sh
./vps-setup.sh
```

### For Existing Setup:
Just push to `main` branch - GitHub Actions will handle deployment automatically!

## 📜 Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `vps-setup.sh` | First-time VPS setup | `./vps-setup.sh` |
| `quick-deploy-manual.sh` | Manual deployment | `./quick-deploy-manual.sh` |
| `diagnose.sh` | System diagnostics | `./diagnose.sh` |
| `health-check.sh` | Verify app health | `./health-check.sh` |

## 🛠️ Common Commands

```bash
# View logs (real-time)
docker logs -f amr-frontend

# View last 50 lines
docker logs --tail 50 amr-frontend

# Check container status
docker ps

# Check container health
docker inspect --format='{{.State.Health.Status}}' amr-frontend

# Restart container
docker-compose restart

# Full restart (stop & start)
docker-compose down && docker-compose up -d

# Pull latest changes
git pull && docker-compose pull && docker-compose up -d

# Clean up old images
docker image prune -a

# Enter container shell
docker exec -it amr-frontend sh

# Check resource usage
docker stats amr-frontend
```

## 🔧 Troubleshooting

### Container not starting?
```bash
./diagnose.sh                           # Run diagnostics
docker logs amr-frontend                # Check logs
docker-compose down && docker-compose up -d  # Restart
```

### Image pull fails?
```bash
# Re-login to GHCR
echo YOUR_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
docker-compose pull
```

### Port already in use?
```bash
sudo lsof -i :3000                      # Find process
sudo kill -9 PID                        # Kill process
```

### Network issues?
```bash
docker network rm amr-network           # Remove network
docker network create amr-network       # Recreate network
docker-compose up -d                    # Start services
```

## 📊 Monitoring

```bash
# Health check
./health-check.sh

# Container status
docker ps --filter "name=amr-frontend"

# Resource usage
docker stats amr-frontend

# Nginx status
sudo systemctl status nginx

# Port usage
sudo netstat -tulpn | grep -E ':(80|3000)'
```

## 🌐 URLs

- **Local:** http://localhost:3000
- **Health Check:** http://localhost:3000/health
- **Domain:** http://your-domain.com (after Nginx setup)

## 🔐 GitHub Secrets

Required in GitHub repository (Settings → Secrets):
- `VPS_HOST` - Your VPS IP
- `VPS_USERNAME` - SSH username (usually `ubuntu`)
- `VPS_SSH_KEY` - Private SSH key
- `VPS_PORT` - SSH port (optional, default 22)

## 📁 Important Files

```
amr-echaufaudage/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions workflow
├── docker-compose.yml          # Docker Compose config
├── Dockerfile                  # Docker build instructions
├── nginx.conf                  # Nginx config for container
├── vps-setup.sh               # VPS setup script
├── quick-deploy-manual.sh     # Manual deployment
├── diagnose.sh                # Diagnostics script
├── health-check.sh            # Health check script
├── DEPLOYMENT.md              # Full deployment guide
└── FIX-SUMMARY.md             # What was fixed
```

## 🔄 Deployment Flow

```
Push to GitHub
    ↓
GitHub Actions Triggered
    ↓
Build Docker Image
    ↓
Push to GHCR (ghcr.io)
    ↓
SSH to VPS
    ↓
Pull Latest Image
    ↓
Deploy Container
    ↓
Verify Running
```

## ✅ Pre-flight Checklist

Before first deployment:
- [ ] Docker installed on VPS
- [ ] Git installed on VPS
- [ ] Repository cloned to `~/amr-echaufaudage`
- [ ] `vps-setup.sh` executed successfully
- [ ] GitHub secrets configured
- [ ] Nginx configured (optional but recommended)
- [ ] Domain DNS pointed to VPS (if using domain)
- [ ] SSL certificate installed (if using HTTPS)

## 🆘 Emergency Fixes

### Complete Reset:
```bash
cd ~/amr-echaufaudage
docker-compose down
docker rm -f amr-frontend
docker network rm amr-network
docker network create amr-network
./vps-setup.sh
```

### Force Rebuild:
```bash
cd ~/amr-echaufaudage
git pull
docker-compose pull
docker-compose down
docker-compose up -d --force-recreate
```

## 📞 Support

1. Check logs: `docker logs amr-frontend`
2. Run diagnostics: `./diagnose.sh`
3. Check GitHub Actions logs
4. Review DEPLOYMENT.md for detailed guide

## 🎯 Success Indicators

✅ Container shows as "Up" in `docker ps`  
✅ Health endpoint returns 200: `curl http://localhost:3000/health`  
✅ Port 3000 is listening: `netstat -tulpn | grep 3000`  
✅ No errors in logs: `docker logs amr-frontend`  
✅ Application loads in browser  

---

**Need detailed info?** See `DEPLOYMENT.md`  
**Having issues?** Run `./diagnose.sh`  
**Want to deploy manually?** Run `./quick-deploy-manual.sh`
