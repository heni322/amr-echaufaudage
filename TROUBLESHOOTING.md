# 🔧 Troubleshooting Guide - AMR Echafaudage

## Common Issues and Solutions

### 1. Port Already in Use

**Problem:** Container fails to start with error "port is already allocated"

```bash
Error: bind: address already in use
```

**Solution:**

```bash
# Check what's using the port
netstat -tulpn | grep :3000
# or
lsof -i :3000

# Stop the conflicting service
docker stop <container-name>

# Or change the port in docker-compose.yml
ports:
  - "3001:80"  # Use different external port
```

### 2. Container Crashes Immediately

**Problem:** Container starts but immediately stops

**Solution:**

```bash
# View container logs
docker logs amr-frontend

# Check container status
docker ps -a

# Inspect container
docker inspect amr-frontend

# Common fixes:
# - Check nginx.conf syntax
# - Verify build completed successfully
# - Check for missing files in /usr/share/nginx/html
```

### 3. Network Connection Issues

**Problem:** Frontend can't connect to backend

**Solution:**

```bash
# Verify both containers are on same network
docker network inspect amr-network

# Ensure network exists
docker network create amr-network

# Reconnect container to network
docker network connect amr-network amr-frontend

# Test connectivity from frontend container
docker exec amr-frontend ping backend
docker exec amr-frontend curl http://backend:4000/health
```

### 4. GitHub Actions Deployment Fails

**Problem:** CI/CD pipeline fails during deployment

**Common Causes:**

#### 4.1 SSH Connection Failed

```bash
# Test SSH connection manually
ssh -i /path/to/key ubuntu@your-vps-ip

# Verify SSH key is correct
cat ~/.ssh/id_ed25519.pub

# Check VPS firewall
sudo ufw status
sudo ufw allow 22/tcp
```

#### 4.2 Permission Denied

```bash
# On VPS, add GitHub Actions to docker group
sudo usermod -aG docker ubuntu

# Verify permissions
groups ubuntu

# Restart SSH session
exit
ssh ubuntu@your-vps-ip
```

#### 4.3 Image Pull Failed

```bash
# Login to GitHub Container Registry on VPS
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Make repository package public or add access
# Go to GitHub → Package Settings → Change visibility
```

### 5. Build Failures

**Problem:** Docker build fails

**Solutions:**

```bash
# Clear Docker cache
docker builder prune -af

# Build without cache
docker build --no-cache -t amr-frontend .

# Check disk space
df -h

# Check Docker space
docker system df
docker system prune -af
```

### 6. Environment Variables Not Working

**Problem:** Frontend can't access API_URL

**Solution:**

```bash
# Check .env file exists
cat .env

# Verify environment variables in container
docker exec amr-frontend env | grep VITE

# Rebuild with environment variables
docker-compose up -d --build

# For Vite, env vars must start with VITE_
# And must be defined at build time
```

### 7. Nginx 403 Forbidden

**Problem:** Accessing frontend shows 403 error

**Solution:**

```bash
# Check file permissions in container
docker exec amr-frontend ls -la /usr/share/nginx/html

# Verify index.html exists
docker exec amr-frontend cat /usr/share/nginx/html/index.html

# Check nginx configuration
docker exec amr-frontend cat /etc/nginx/conf.d/default.conf

# Test nginx config
docker exec amr-frontend nginx -t
```

### 8. CORS Issues

**Problem:** Frontend can't make API requests due to CORS

**Solution:**

Add to nginx.conf:
```nginx
location /api {
    proxy_pass http://backend:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    
    # CORS headers
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
}
```

Or configure backend to allow CORS from frontend domain.

### 9. Database Connection Issues

**Problem:** Backend can't connect to PostgreSQL

**Solution:**

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Test connection from backend
docker exec backend psql -h postgres -U postgres -d amr_db

# Verify DATABASE_URL
docker exec backend env | grep DATABASE_URL

# Check PostgreSQL logs
docker logs postgres

# Restart services in order
docker-compose restart postgres
sleep 5
docker-compose restart backend
```

### 10. Out of Disk Space

**Problem:** Build fails with "no space left on device"

**Solution:**

```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -af --volumes
docker volume prune -f
docker image prune -af

# Remove old images
docker images | grep "<none>" | awk '{print $3}' | xargs docker rmi

# Check and clean logs
sudo journalctl --vacuum-size=100M
```

## Debugging Commands

### View Logs

```bash
# Real-time logs
docker logs -f amr-frontend

# Last 100 lines
docker logs --tail 100 amr-frontend

# Logs with timestamps
docker logs -t amr-frontend

# All services
docker-compose logs -f
```

### Container Information

```bash
# Container details
docker inspect amr-frontend

# Resource usage
docker stats amr-frontend

# Running processes
docker top amr-frontend

# Health status
docker inspect --format='{{.State.Health.Status}}' amr-frontend
```

### Network Debugging

```bash
# Test external connectivity
curl http://localhost:3000
curl http://localhost:3000/health

# Test from another container
docker run --rm --network amr-network alpine wget -qO- http://amr-frontend

# DNS resolution
docker exec amr-frontend nslookup backend
```

### File System Access

```bash
# Access container shell
docker exec -it amr-frontend sh

# Copy files from container
docker cp amr-frontend:/usr/share/nginx/html/index.html ./

# Copy files to container
docker cp ./new-file.html amr-frontend:/usr/share/nginx/html/
```

## Performance Issues

### Slow Build Times

```bash
# Use BuildKit
export DOCKER_BUILDKIT=1
docker build -t amr-frontend .

# Multi-stage cache
docker build --cache-from=amr-frontend:latest -t amr-frontend .
```

### High Memory Usage

```bash
# Limit container memory
docker run -m 512m amr-frontend

# Or in docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 512M
```

## Getting Help

### Generate Debug Report

```bash
#!/bin/bash
echo "=== System Info ===" > debug-report.txt
uname -a >> debug-report.txt
docker version >> debug-report.txt
docker-compose version >> debug-report.txt

echo "=== Running Containers ===" >> debug-report.txt
docker ps -a >> debug-report.txt

echo "=== Networks ===" >> debug-report.txt
docker network ls >> debug-report.txt

echo "=== Images ===" >> debug-report.txt
docker images >> debug-report.txt

echo "=== Disk Usage ===" >> debug-report.txt
df -h >> debug-report.txt
docker system df >> debug-report.txt

echo "=== Frontend Logs ===" >> debug-report.txt
docker logs amr-frontend >> debug-report.txt 2>&1

cat debug-report.txt
```

### Contact Support

If you're still experiencing issues:

1. Generate debug report (above)
2. Check GitHub Actions logs
3. Review VPS system logs: `journalctl -xe`
4. Contact the development team with:
   - Error message
   - Debug report
   - Steps to reproduce
   - Expected vs actual behavior

---

## Quick Reference

```bash
# Restart everything
docker-compose restart

# Fresh start
docker-compose down && docker-compose up -d

# Full cleanup and rebuild
docker-compose down -v
docker system prune -af
docker-compose up -d --build

# Emergency stop
docker stop $(docker ps -q)

# View all logs
docker-compose logs -f --tail=100
```
