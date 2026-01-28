# 🚀 AMR Echafaudage - Complete Deployment Fix

## ✅ What Was Fixed

### 1. **Docker Compose Configuration** (`docker-compose.yml`)
**Problem:** The compose file was configured to BUILD the image instead of pulling from GHCR.

**Fix:**
- Changed from `build:` to `image:` directive
- Now pulls pre-built images from GitHub Container Registry
- Added `pull_policy: always` to ensure latest image is used
- Changed network from `external: true` to properly creating it

### 2. **GitHub Actions Workflow** (`deploy.yml`)
**Problem:** Missing the actual container deployment step.

**Fix:**
- Added explicit `docker pull` command
- Set `GITHUB_REPOSITORY` environment variable
- Added `--no-build --pull always` flags to docker-compose
- Improved error handling and logging
- Better status verification

### 3. **Helper Scripts Created**

#### `vps-setup.sh` - Initial VPS Setup
Complete automated setup script that:
- ✅ Checks all prerequisites
- ✅ Creates Docker network
- ✅ Configures environment
- ✅ Logs into GHCR
- ✅ Pulls and starts containers
- ✅ Verifies deployment

#### `quick-deploy-manual.sh` - Manual Deployment
Quick script for manual deployments when needed.

#### `diagnose.sh` - System Diagnostics
Comprehensive troubleshooting script that checks:
- Docker installation and status
- Network configuration
- Container status
- Port usage
- Image availability
- Disk space and memory
- Logs and errors

## 📋 Action Items

### For First-Time Setup on VPS:

1. **SSH into your VPS:**
   ```bash
   ssh ubuntu@your-vps-ip
   ```

2. **Ensure Docker is installed:**
   ```bash
   docker --version
   ```
   If not installed:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```
   Then log out and back in.

3. **Clone the repository (if not already done):**
   ```bash
   cd ~
   git clone https://github.com/YOUR_USERNAME/amr-echaufaudage.git
   cd amr-echaufaudage
   ```

4. **Run the setup script:**
   ```bash
   chmod +x vps-setup.sh
   ./vps-setup.sh
   ```
   This will guide you through the setup process.

5. **Configure Nginx reverse proxy** (See DEPLOYMENT.md for details)

### For GitHub Actions:

1. **Ensure these secrets are set in GitHub:**
   - `VPS_HOST` - Your VPS IP address
   - `VPS_USERNAME` - Usually `ubuntu`
   - `VPS_SSH_KEY` - Your private SSH key
   - `VPS_PORT` - SSH port (usually 22)

2. **Commit and push the updated files:**
   ```bash
   git add .
   git commit -m "Fix deployment configuration"
   git push origin main
   ```

3. **Monitor the GitHub Actions workflow** in your repository

## 🔍 Troubleshooting

If deployment fails, run the diagnostic script on your VPS:

```bash
cd ~/amr-echaufaudage
chmod +x diagnose.sh
./diagnose.sh
```

This will show you exactly what's wrong.

## 🎯 Key Changes Summary

| File | Change | Why |
|------|--------|-----|
| `docker-compose.yml` | Use `image:` instead of `build:` | Pull from GHCR instead of building |
| `deploy.yml` | Add container deployment step | Actually deploy the container |
| `deploy.yml` | Set `GITHUB_REPOSITORY` env var | Needed for image path |
| `deploy.yml` | Add `--no-build --pull always` | Ensure we use pulled image |
| Network config | Change to `driver: bridge` | Properly create network if not exists |

## 🎬 What Happens Now

When you push to `main` or `master`:

1. **GitHub Actions runs** → Builds Docker image
2. **Image pushed to GHCR** → Available at `ghcr.io/your-username/amr-echaufaudage/amr-echafaudage-frontend:latest`
3. **SSH to VPS** → Connects to your server
4. **Pull latest code** → Updates repository
5. **Login to GHCR** → Authenticates with GitHub
6. **Create network** → Ensures `amr-network` exists
7. **Pull image** → Downloads latest image from GHCR
8. **Stop old container** → Removes previous version
9. **Start new container** → Launches updated version
10. **Verify deployment** → Checks if running successfully

## 📞 Quick Commands Reference

```bash
# On VPS - View logs
docker logs -f amr-frontend

# On VPS - Check status
docker ps

# On VPS - Restart
cd ~/amr-echaufaudage && docker-compose restart

# On VPS - Full diagnostics
cd ~/amr-echaufaudage && ./diagnose.sh

# On VPS - Manual deploy
cd ~/amr-echaufaudage && ./quick-deploy-manual.sh
```

## ✨ Expected Result

After deployment, you should see:
- ✅ Container `amr-frontend` running
- ✅ Accessible on `http://your-vps-ip:3000`
- ✅ If Nginx configured, accessible on `http://your-domain.com`

## 📚 Documentation

- **DEPLOYMENT.md** - Complete deployment guide with all details
- **vps-setup.sh** - Automated VPS setup
- **diagnose.sh** - System diagnostics
- **quick-deploy-manual.sh** - Manual deployment script

---

**Your Next Steps:**
1. Commit these changes to your repository
2. Ensure GitHub secrets are configured
3. Run `vps-setup.sh` on your VPS if this is first-time setup
4. Push to main branch and watch GitHub Actions deploy!

Good luck! 🚀
