# ✅ Deployment Checklist

## Pre-Deployment Setup

### GitHub Repository Configuration
- [ ] Repository exists and is accessible
- [ ] You have admin access to repository
- [ ] All code changes are committed

### GitHub Secrets Configuration
Navigate to: **Repository → Settings → Secrets and variables → Actions**

- [ ] `VPS_HOST` added (Your VPS IP address)
- [ ] `VPS_USERNAME` added (Usually `ubuntu`)
- [ ] `VPS_SSH_KEY` added (Your private SSH key)
- [ ] `VPS_PORT` added (Usually `22`, optional)

**How to generate SSH key (if needed):**
```bash
# On your local machine
ssh-keygen -t ed25519 -C "your_email@example.com"
# Copy the private key (~/.ssh/id_ed25519)
# Add public key to VPS: ~/.ssh/authorized_keys
```

### VPS Prerequisites
- [ ] Ubuntu Server 20.04+ installed
- [ ] You have SSH access to VPS
- [ ] VPS has public IP address
- [ ] Ports 22, 80, and 3000 are open in firewall

## Initial VPS Setup

### 1. Connect to VPS
```bash
ssh ubuntu@YOUR_VPS_IP
```
- [ ] Successfully connected to VPS

### 2. Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in
```
- [ ] Docker installed
- [ ] User added to docker group
- [ ] Logged out and back in
- [ ] Verify: `docker --version` works without sudo

### 3. Install Git (if not installed)
```bash
sudo apt update
sudo apt install git -y
```
- [ ] Git installed
- [ ] Verify: `git --version`

### 4. Clone Repository
```bash
cd ~
git clone https://github.com/YOUR_USERNAME/amr-echaufaudage.git
cd amr-echaufaudage
```
- [ ] Repository cloned to `~/amr-echaufaudage`
- [ ] Successfully navigated to directory

### 5. Make Scripts Executable
```bash
chmod +x make-executable.sh
./make-executable.sh
```
- [ ] All scripts are executable

### 6. Run VPS Setup
```bash
./vps-setup.sh
```
**During setup, you'll be asked for:**
- [ ] GitHub username (entered)
- [ ] GitHub Personal Access Token (entered)
  - Token needs `read:packages` permission
  - Create at: https://github.com/settings/tokens
- [ ] GitHub repository name (entered)

**Setup should complete successfully:**
- [ ] Network created
- [ ] Environment configured
- [ ] Logged into GHCR
- [ ] Image pulled
- [ ] Container started
- [ ] Container is running

## Nginx Configuration (Optional but Recommended)

### 1. Install Nginx
```bash
sudo apt update
sudo apt install nginx -y
```
- [ ] Nginx installed

### 2. Create Site Configuration
```bash
sudo nano /etc/nginx/sites-available/amr-frontend
```
Paste the configuration from DEPLOYMENT.md
- [ ] Configuration file created

### 3. Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/amr-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
- [ ] Site enabled
- [ ] Configuration valid
- [ ] Nginx reloaded

### 4. Configure Firewall
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```
- [ ] Firewall configured

## SSL/TLS Setup (Optional but Highly Recommended)

### 1. Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```
- [ ] Certbot installed

### 2. Get Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```
- [ ] Certificate obtained
- [ ] Auto-renewal configured

## DNS Configuration (If using domain)

- [ ] A record points to VPS IP
- [ ] www subdomain configured (if needed)
- [ ] DNS propagated (check with `nslookup your-domain.com`)

## Testing & Verification

### 1. Local Container Test
```bash
cd ~/amr-echaufaudage
docker ps | grep amr-frontend
```
- [ ] Container is running

### 2. Health Check
```bash
./health-check.sh
```
- [ ] All health checks pass

### 3. Access Tests
Test all access methods:
- [ ] `curl http://localhost:3000/health` returns "healthy"
- [ ] `curl http://localhost:3000` returns HTML
- [ ] Browser: `http://YOUR_VPS_IP:3000` works
- [ ] Browser: `http://your-domain.com` works (if configured)
- [ ] Browser: `https://your-domain.com` works (if SSL configured)

### 4. Run Diagnostics
```bash
./diagnose.sh
```
- [ ] All diagnostics pass

## GitHub Actions Deployment Test

### 1. Make a Test Change
```bash
# On your local machine
cd path/to/amr-echaufaudage
echo "# Test" >> README.md
git add .
git commit -m "Test deployment"
git push origin main
```
- [ ] Changes pushed

### 2. Monitor GitHub Actions
- [ ] Go to: https://github.com/YOUR_USERNAME/amr-echaufaudage/actions
- [ ] Workflow triggered automatically
- [ ] Build job completed successfully
- [ ] Deploy job completed successfully

### 3. Verify Deployment
```bash
# On VPS
cd ~/amr-echaufaudage
docker ps
docker logs --tail 20 amr-frontend
./health-check.sh
```
- [ ] New container deployed
- [ ] No errors in logs
- [ ] Health check passes
- [ ] Application updated

## Production Readiness

### Security
- [ ] Using SSH keys (not passwords)
- [ ] Firewall configured
- [ ] SSL/TLS enabled (if production)
- [ ] Strong passwords/keys used
- [ ] Unnecessary ports closed

### Monitoring
- [ ] Know how to check logs: `docker logs -f amr-frontend`
- [ ] Know how to run diagnostics: `./diagnose.sh`
- [ ] Know how to check health: `./health-check.sh`

### Backup & Recovery
- [ ] Know how to manually deploy: `./quick-deploy-manual.sh`
- [ ] Know how to restart: `docker-compose restart`
- [ ] Know emergency reset procedure (see COMPLETE-SOLUTION.md)

### Documentation
- [ ] Read DEPLOYMENT.md
- [ ] Read QUICK-REFERENCE.md
- [ ] Bookmarked important commands
- [ ] Team members have access to documentation

## Post-Deployment

### Regular Maintenance
Set up reminders for:
- [ ] Weekly: Check logs for errors
- [ ] Weekly: Review disk space usage
- [ ] Monthly: Update system packages
- [ ] Monthly: Clean up old Docker images
- [ ] Quarterly: Review security configurations

### Monitoring Setup (Optional)
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Configure alerting for downtime
- [ ] Set up log aggregation (optional)

## Troubleshooting Knowledge

I know how to:
- [ ] View logs: `docker logs amr-frontend`
- [ ] Restart service: `docker-compose restart`
- [ ] Check container status: `docker ps`
- [ ] Run diagnostics: `./diagnose.sh`
- [ ] Check health: `./health-check.sh`
- [ ] Manual deploy: `./quick-deploy-manual.sh`
- [ ] Access container shell: `docker exec -it amr-frontend sh`
- [ ] Find and read error logs
- [ ] Perform emergency reset

## Success Criteria

### Deployment is successful when:
- [x] Container shows "Up" status in `docker ps`
- [x] Health endpoint returns 200 OK
- [x] Application loads in browser
- [x] No errors in logs
- [x] GitHub Actions deploy successfully
- [x] Can manually deploy when needed
- [x] All diagnostic checks pass

## Final Verification

- [ ] Application accessible from internet
- [ ] SSL certificate valid (if using HTTPS)
- [ ] Auto-deployment working via GitHub Actions
- [ ] Manual deployment option works
- [ ] All team members have access
- [ ] Documentation reviewed and understood
- [ ] Backup/recovery procedures tested

---

## 🎉 Deployment Complete!

Date completed: _________________

Deployed by: _________________

Notes:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

## 📞 Important Information

**VPS IP:** _________________

**Domain:** _________________

**GitHub Repo:** _________________

**Key Locations:**
- Repository: `~/amr-echaufaudage`
- Logs: `docker logs amr-frontend`
- Config: `/etc/nginx/sites-available/amr-frontend`

**Key Commands:**
- Health check: `./health-check.sh`
- Diagnostics: `./diagnose.sh`
- Manual deploy: `./quick-deploy-manual.sh`
- View logs: `docker logs -f amr-frontend`
- Restart: `docker-compose restart`
