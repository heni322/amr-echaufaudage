# 📂 Project Structure - AMR Echafaudage

## Complete File Tree

```
D:\amr-echafaudage\
│
├── 📁 .github/
│   └── 📁 workflows/
│       ├── 🆕 ci.yml                    # Test builds on PRs
│       └── 🆕 deploy.yml                # Auto-deploy on push
│
├── 📁 public/                            # Static assets
├── 📁 src/                               # React source code
├── 📁 node_modules/                      # Dependencies
│
├── 🆕 .dockerignore                      # Docker build exclusions
├── 🆕 .env.example                       # Environment template
├── .gitignore                            # Git exclusions
│
├── ✏️  docker-compose.yml                # UPDATED - Port 3000
├── Dockerfile                            # Frontend container
├── nginx.conf                            # Web server config
│
├── 🆕 deploy.sh                          # Manual deployment
├── 🆕 setup-vps.sh                       # VPS setup script
├── 🆕 start.sh                           # Local dev helper
│
├── 🆕 README.md                          # UPDATED - Complete guide
├── 🆕 DEPLOYMENT.md                      # Step-by-step deployment
├── 🆕 TROUBLESHOOTING.md                 # Issue solutions
├── 🆕 CHECKLIST.md                       # Progress tracker
├── 🆕 SETUP-COMPLETE.md                  # This summary!
│
├── package.json                          # Node dependencies
├── package-lock.json                     # Locked versions
├── vite.config.js                        # Vite configuration
├── tailwind.config.js                    # Tailwind CSS
├── postcss.config.js                     # PostCSS
├── eslint.config.js                      # ESLint rules
└── index.html                            # Entry HTML

Legend:
🆕 = New file created
✏️  = Updated existing file
```

---

## 📋 File Categories

### 🔄 CI/CD Files (GitHub Actions)
```
.github/workflows/
├── deploy.yml          # Automatic deployment
└── ci.yml              # Continuous integration
```

**Purpose:** Automate build, test, and deployment

### 🐳 Docker Files
```
docker-compose.yml      # Multi-container orchestration
Dockerfile              # Frontend container definition
.dockerignore          # Build optimization
nginx.conf             # Web server configuration
```

**Purpose:** Containerization and production serving

### 🚀 Deployment Scripts
```
deploy.sh              # Manual deployment to VPS
setup-vps.sh          # One-time VPS configuration
start.sh              # Local development helper
```

**Purpose:** Simplified deployment process

### 📚 Documentation
```
README.md              # Project overview
DEPLOYMENT.md          # Deployment guide
TROUBLESHOOTING.md     # Issue resolution
CHECKLIST.md           # Progress tracker
SETUP-COMPLETE.md      # Quick reference
```

**Purpose:** Guide users through setup and usage

### ⚙️ Configuration
```
.env.example           # Environment variables template
package.json           # Dependencies and scripts
vite.config.js        # Build configuration
tailwind.config.js    # Styling framework
```

**Purpose:** Project configuration

---

## 🎯 Quick Access Guide

### Want to Deploy?
1. **First time:** Read `DEPLOYMENT.md`
2. **Auto deploy:** Just push to GitHub
3. **Manual deploy:** Run `./deploy.sh`

### Need Help?
1. **Common issues:** Check `TROUBLESHOOTING.md`
2. **Track progress:** Use `CHECKLIST.md`
3. **Quick overview:** Read `SETUP-COMPLETE.md`

### Local Development?
1. **Quick start:** Run `./start.sh`
2. **Manual:** `npm run dev`
3. **Build:** `npm run build`

### Monitoring?
1. **GitHub Actions:** Check Actions tab
2. **Container logs:** `docker logs amr-frontend`
3. **Health check:** `http://localhost:3000/health`

---

## 📊 Deployment Flow

```
┌─────────────────────────────────────────────────────────┐
│                     Local Development                    │
│                                                          │
│  Edit Code → Test Locally → Commit → Push to GitHub    │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    GitHub Actions                        │
│                                                          │
│  1. Trigger workflow (deploy.yml)                       │
│  2. Build Docker image                                   │
│  3. Run tests (ci.yml on PRs)                           │
│  4. Push to GitHub Container Registry                   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    VPS Deployment                        │
│                                                          │
│  1. SSH into VPS                                         │
│  2. Pull latest image                                    │
│  3. Stop old container                                   │
│  4. Start new container                                  │
│  5. Verify deployment                                    │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    Live Application                      │
│                                                          │
│  Frontend: http://YOUR_VPS_IP:3000                      │
│  Backend:  http://YOUR_VPS_IP:4000                      │
│  Health:   http://YOUR_VPS_IP:3000/health               │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuration Summary

### Ports
- **Frontend:** 3000 ✅ (no conflicts)
- **Backend:** 4000 (existing)
- **PostgreSQL:** 5432 (existing)

### Docker Network
- **Name:** amr-network
- **Type:** bridge
- **Services:** postgres, backend, amr-frontend

### Environment Variables
```env
POSTGRES_DB=amr_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=***
VITE_API_URL=http://localhost:4000
NODE_ENV=production
```

### GitHub Secrets Required
- `VPS_HOST` - Your VPS IP address
- `VPS_USERNAME` - SSH username (ubuntu)
- `VPS_SSH_KEY` - Private SSH key
- `VPS_PORT` - SSH port (22)

---

## 📝 Scripts Overview

### deploy.sh
```bash
./deploy.sh
```
- Builds Docker image
- Stops old container
- Starts new container
- Verifies deployment
- Shows logs

### setup-vps.sh
```bash
./setup-vps.sh
```
- Installs Docker
- Creates network
- Clones repository
- Sets up environment
- Configures GitHub CLI

### start.sh
```bash
./start.sh
```
Interactive menu:
1. Dev server
2. Production build
3. Preview build
4. Run linter
5. Docker Compose
6. Exit

---

## ✅ Verification Checklist

After setup, verify:

- [ ] All files present in project directory
- [ ] `.github/workflows/` contains 2 YAML files
- [ ] `docker-compose.yml` uses port 3000
- [ ] Scripts are executable (`chmod +x *.sh`)
- [ ] `.env.example` exists
- [ ] Documentation files created

---

## 🎓 Learning Resources

### Understanding the Setup

1. **Docker Basics**
   - Read: `docker-compose.yml`
   - Learn: Container orchestration

2. **CI/CD Pipeline**
   - Read: `.github/workflows/deploy.yml`
   - Learn: GitHub Actions

3. **Deployment Process**
   - Read: `DEPLOYMENT.md`
   - Learn: Complete workflow

4. **Troubleshooting**
   - Read: `TROUBLESHOOTING.md`
   - Learn: Common issues

---

## 🚀 Ready to Deploy!

Everything is set up and ready to go!

**Next Step:** Open `DEPLOYMENT.md` and follow the step-by-step guide.

**Estimated Time:** 30 minutes for first deployment

**Good Luck!** 🎉

---

**Setup Date:** $(date)
**Project:** AMR Echafaudage Landing Page
**Stack:** React + Vite + Docker + GitHub Actions
**Status:** ✅ Ready for deployment
