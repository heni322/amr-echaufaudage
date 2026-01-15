# ✅ Deployment Checklist - AMR Echafaudage

Use this checklist to track your deployment setup progress.

## 📋 Pre-Deployment Setup

### Local Environment
- [ ] Project cloned/located at `D:\amr-echafaudage`
- [ ] Node.js 20+ installed
- [ ] Git installed and configured
- [ ] All dependencies installed (`npm install`)
- [ ] Project builds successfully (`npm run build`)
- [ ] No lint errors (`npm run lint`)

### GitHub Repository
- [ ] GitHub account created
- [ ] Repository created on GitHub
- [ ] Local repository connected to GitHub remote
- [ ] Code pushed to main/master branch
- [ ] Repository is private/public as desired

### VPS Access
- [ ] VPS server accessible (IP: _______________)
- [ ] SSH access working
- [ ] Ubuntu OS confirmed
- [ ] Sudo privileges available
- [ ] Existing services noted (postgres:5432, backend:4000)

## 🔐 SSH Configuration

### SSH Keys
- [ ] SSH key pair generated (`~/.ssh/amr-vps`)
- [ ] Public key added to VPS `~/.ssh/authorized_keys`
- [ ] Private key saved securely
- [ ] SSH connection tested successfully
- [ ] SSH key passphrase documented (if used)

## 🔧 VPS Setup

### Docker Installation
- [ ] Docker installed on VPS
- [ ] Docker Compose installed
- [ ] User added to docker group
- [ ] Docker service running
- [ ] Can run docker commands without sudo

### Network Configuration
- [ ] Docker network `amr-network` created
- [ ] Existing containers using network confirmed
- [ ] Network connectivity tested

### Project Setup
- [ ] Project directory created (`~/amr-echafaudage`)
- [ ] Repository cloned to VPS
- [ ] `.env` file created from template
- [ ] `.env` file configured with secure values
- [ ] PostgreSQL password changed from default
- [ ] `VITE_API_URL` set to correct backend URL

## 🔑 GitHub Configuration

### GitHub Secrets
- [ ] `VPS_HOST` secret added (VPS IP address)
- [ ] `VPS_USERNAME` secret added (usually 'ubuntu')
- [ ] `VPS_SSH_KEY` secret added (private key content)
- [ ] `VPS_PORT` secret added (if not 22)
- [ ] All secrets verified (no extra spaces/newlines)

### GitHub Packages
- [ ] GitHub Container Registry enabled
- [ ] Package visibility configured
- [ ] `GITHUB_TOKEN` permissions verified

### GitHub Actions
- [ ] Workflows visible in Actions tab
- [ ] No workflow syntax errors
- [ ] Deployment workflow file present
- [ ] CI workflow file present

## 🚀 First Deployment

### Automatic Deployment
- [ ] Code pushed to main branch
- [ ] GitHub Actions workflow triggered
- [ ] Build job completed successfully
- [ ] Docker image built and pushed
- [ ] Deploy job completed successfully
- [ ] No errors in Actions logs

### Verification
- [ ] Frontend container running (`docker ps`)
- [ ] Container name is `amr-frontend`
- [ ] Port 3000 mapped correctly
- [ ] Container connected to `amr-network`
- [ ] Health check passing

## ✅ Testing

### Basic Functionality
- [ ] Frontend accessible at `http://VPS_IP:3000`
- [ ] Health endpoint working (`/health`)
- [ ] No 404 errors on main page
- [ ] Static assets loading (CSS, JS, images)
- [ ] No console errors in browser

### API Integration
- [ ] Frontend can reach backend API
- [ ] CORS configured correctly (if needed)
- [ ] API endpoints responding
- [ ] No network errors in browser console

### Container Health
- [ ] Container logs show no errors
- [ ] nginx started successfully
- [ ] No crash loop detected
- [ ] Memory usage acceptable
- [ ] CPU usage normal

## 🔒 Security Setup

### Firewall
- [ ] UFW installed
- [ ] Port 22 (SSH) allowed
- [ ] Port 3000 (Frontend) allowed
- [ ] Port 4000 (Backend) allowed
- [ ] UFW enabled
- [ ] Unnecessary ports blocked

### Security Best Practices
- [ ] Default passwords changed
- [ ] SSH key authentication only (no password)
- [ ] Root login disabled
- [ ] Fail2ban installed (optional)
- [ ] Automatic security updates enabled

## 🌐 Domain Setup (Optional)

### DNS Configuration
- [ ] Domain purchased/available
- [ ] DNS A record pointing to VPS IP
- [ ] DNS propagation completed (check: `nslookup yourdomain.com`)
- [ ] WWW subdomain configured (if desired)

### Reverse Proxy (Optional)
- [ ] Nginx installed on host
- [ ] Site configuration created
- [ ] Site enabled
- [ ] Nginx restarted
- [ ] Domain accessible on port 80

### SSL Certificate (Optional)
- [ ] Certbot installed
- [ ] SSL certificate obtained
- [ ] Auto-renewal configured
- [ ] HTTPS working
- [ ] HTTP redirects to HTTPS

## 📊 Monitoring Setup

### Logging
- [ ] Can view container logs
- [ ] Log rotation configured
- [ ] Disk space monitored

### Alerts (Optional)
- [ ] Uptime monitoring configured
- [ ] Email alerts set up
- [ ] Disk space alerts
- [ ] Container restart alerts

## 📝 Documentation

### Project Documentation
- [ ] README.md reviewed
- [ ] DEPLOYMENT.md read
- [ ] TROUBLESHOOTING.md familiarized
- [ ] Environment variables documented
- [ ] Access credentials stored securely

### Team Knowledge
- [ ] Deployment process documented
- [ ] Team members trained
- [ ] Access credentials shared securely
- [ ] Emergency contacts listed

## 🔄 Post-Deployment

### Backup Strategy
- [ ] Database backup scheduled
- [ ] Code backup (GitHub)
- [ ] `.env` file backed up securely
- [ ] SSL certificates backed up (if applicable)

### Update Process
- [ ] Update procedure tested
- [ ] Rollback procedure documented
- [ ] Zero-downtime deployment verified
- [ ] Team aware of update process

### Monitoring
- [ ] Daily health checks scheduled
- [ ] Weekly log reviews
- [ ] Monthly security updates
- [ ] Performance baselines established

## 🎉 Launch Checklist

### Pre-Launch
- [ ] All tests passing
- [ ] Performance acceptable
- [ ] Security audit completed
- [ ] Backup system verified
- [ ] Monitoring active

### Launch
- [ ] DNS updated (if applicable)
- [ ] SSL working (if applicable)
- [ ] All services running
- [ ] Team notified
- [ ] Users can access

### Post-Launch
- [ ] Monitor for 24 hours
- [ ] Check error logs
- [ ] Verify analytics working
- [ ] User feedback collected
- [ ] Document any issues

---

## 📌 Important Information

**VPS Details:**
- IP Address: _______________
- SSH Port: _______________
- Username: _______________

**URLs:**
- Frontend: http://_______________:3000
- Backend: http://_______________:4000
- Health Check: http://_______________:3000/health

**Repository:**
- URL: https://github.com/_______________/amr-echafaudage

**Deployment Time:**
- First deployment: _______________
- Last update: _______________

**Contact:**
- Developer: _______________
- DevOps: _______________
- Emergency: _______________

---

**Tips:**
- Check off items as you complete them
- Save this file with your progress
- Refer back when troubleshooting
- Update with any custom changes

**Status:** ⬜ Not Started | 🔄 In Progress | ✅ Complete | ❌ Blocked
