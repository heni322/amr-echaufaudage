# 🔧 PORT 3000 IN USE - Quick Fix

## The Problem

```
Error: failed to bind host port for 0.0.0.0:3000: address already in use
```

Port 3000 is already being used by another process on your VPS.

## ✅ Immediate Solution

SSH to your VPS and run these commands:

```bash
ssh ubuntu@YOUR_VPS_IP

# Find what's using port 3000
sudo lsof -i:3000

# Kill the process(es) using port 3000
sudo lsof -ti:3000 | xargs sudo kill -9

# Verify port is free
sudo lsof -i:3000  # Should return nothing

# Now redeploy
git commit --allow-empty -m "Redeploy after freeing port"
git push origin main
```

## 🔍 Detailed Troubleshooting

### Step 1: Identify What's Using Port 3000

```bash
# Check what's using the port
sudo lsof -i:3000

# Or use netstat
sudo netstat -tulpn | grep :3000
```

You'll see output like:
```
COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node      1234 ubuntu  12u  IPv4  12345      0t0  TCP *:3000 (LISTEN)
```

### Step 2: Stop the Process

**Option A: If it's a Docker container**
```bash
# Find and stop the container
docker ps -a
docker stop CONTAINER_NAME
docker rm CONTAINER_NAME
```

**Option B: If it's a Node/npm process**
```bash
# Kill by port
sudo kill -9 $(sudo lsof -ti:3000)
```

**Option C: If it's a systemd service**
```bash
# Find the service
sudo systemctl list-units --type=service | grep -i node

# Stop the service
sudo systemctl stop SERVICE_NAME
sudo systemctl disable SERVICE_NAME  # Prevent auto-start
```

### Step 3: Verify Port is Free

```bash
sudo lsof -i:3000
# Should return nothing if port is free
```

### Step 4: Redeploy

```bash
# On your local machine
git commit --allow-empty -m "Redeploy after freeing port 3000"
git push origin main
```

## 🚨 Common Causes

1. **Old Docker container** still running
   ```bash
   docker ps -a | grep amr-frontend
   docker stop amr-frontend && docker rm amr-frontend
   ```

2. **Development server** left running
   ```bash
   ps aux | grep node
   kill -9 PID
   ```

3. **Previous deployment** failed to clean up
   ```bash
   docker stop $(docker ps -aq)
   ```

4. **Port forwarding or SSH tunnel**
   ```bash
   ps aux | grep ssh
   # Check for processes with ":3000" in command
   ```

## 🛠️ Prevention

The updated workflow now automatically:
- ✅ Stops old containers before starting new ones
- ✅ Checks if port is in use
- ✅ Attempts to free the port
- ✅ Provides better error messages

## 🔄 Alternative: Use a Different Port

If you want to use a different port (e.g., 3001):

**Update workflow:**
```yaml
-p 3001:8080  # Instead of 3000:8080
```

**Update Nginx config** (if using):
```nginx
proxy_pass http://localhost:3001;  # Instead of 3000
```

## ✅ Verification

After fixing:

```bash
# Check container is running
docker ps | grep amr-frontend

# Check port is bound
sudo netstat -tulpn | grep :3000

# Test the application
curl http://localhost:3000/health
```

## 📝 One-Liner Fix

```bash
# SSH to VPS and run this
sudo lsof -ti:3000 | xargs -r sudo kill -9 && docker stop amr-frontend 2>/dev/null; docker rm amr-frontend 2>/dev/null; echo "Port 3000 freed!"
```

Then redeploy from your local machine.

---

**The updated workflow now handles this automatically, but if you need to fix it manually, use the commands above!**
