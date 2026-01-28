# 🚨 IMMEDIATE FIX - Container Not Starting

## The Problem

Your deployment is failing with:
```
❌ Frontend container failed to start
Error response from daemon: No such container: amr-frontend
```

This means the container never starts because **the image cannot be pulled from GHCR**.

## Root Cause

Your Docker image is **private** by default in GitHub Container Registry, and the VPS has no authentication to pull it.

## ⚡ Quick Fix (Choose ONE)

### Option A: Make Image Public (FASTEST - 2 minutes)

This is the **easiest and recommended solution** for a landing page.

1. **Go to your package:**
   - Visit: `https://github.com/YOUR_USERNAME?tab=packages`
   - Or go to your repo and click "Packages" in the right sidebar
   
2. **Click on your package:**
   - Should be named: `amr-echaufaudage/amr-echafaudage-frontend`
   
3. **Go to Package settings:**
   - Click "Package settings" button (bottom right)
   
4. **Change visibility:**
   - Scroll to bottom "Danger Zone"
   - Click "Change visibility"
   - Select "Public"
   - Type the package name to confirm
   - Click "I understand, change package visibility"

5. **Redeploy:**
   ```bash
   # On your local machine
   git commit --allow-empty -m "Trigger redeploy"
   git push origin main
   ```

**Done!** The deployment should work now.

---

### Option B: Use Authentication Token (For Private Images)

If you need to keep the image private:

#### Step 1: Create Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: `VPS Docker Pull`
4. Select permission: `read:packages`
5. Click "Generate token"
6. **COPY THE TOKEN** immediately

#### Step 2: Add to GitHub Secrets

1. Go to your repository settings
2. **Settings** → **Secrets and variables** → **Actions**
3. Click "New repository secret"
4. Name: `GHCR_PAT`
5. Value: Paste your token
6. Click "Add secret"

#### Step 3: Redeploy

```bash
# Commit and push (the updated workflow already handles GHCR_PAT)
git add .
git commit -m "Add GHCR authentication"
git push origin main
```

---

## 🔍 Verify the Fix

After making the change and redeploying:

1. **Watch GitHub Actions:**
   - Go to: `https://github.com/YOUR_USERNAME/amr-echaufaudage/actions`
   - Latest workflow should succeed

2. **Check on VPS:**
   ```bash
   ssh ubuntu@YOUR_VPS_IP
   docker ps
   # Should see amr-frontend running
   ```

3. **Test the app:**
   ```bash
   curl http://localhost:3000/health
   # Should return "healthy"
   ```

## 📊 Why This Happened

```
GitHub Actions (has access)
    ↓
  Builds image
    ↓
  Pushes to GHCR (private by default)
    ↓
GitHub Actions → VPS (no access!) ❌
    ↓
  Cannot pull image
    ↓
  Container fails to start
```

**Solution:** Either make image public OR give VPS authentication.

## ✅ Expected Result

After the fix, you should see:

```
✅ Container started successfully

📊 Container Status:
NAMES          STATUS              PORTS
amr-frontend   Up 2 minutes        0.0.0.0:3000->8080/tcp

📝 Recent logs:
[nginx logs showing successful startup]

🎉 Deployment verification successful!
```

## 🆘 Still Not Working?

Run diagnostics on your VPS:

```bash
ssh ubuntu@YOUR_VPS_IP
cd ~/amr-echaufaudage

# Check if we can pull the image
docker pull ghcr.io/YOUR_USERNAME/amr-echaufaudage/amr-echafaudage-frontend:latest

# If it fails, check:
1. Is the image public? (Check package settings)
2. Do you have GHCR_PAT secret set? (Check repo secrets)
3. Does the image exist? (Check GitHub Packages)
```

## 📝 Quick Checklist

- [ ] Chose Option A (public) or Option B (PAT)
- [ ] Made the change (visibility or added secret)
- [ ] Committed and pushed code
- [ ] GitHub Actions workflow succeeded
- [ ] Container is running on VPS
- [ ] App is accessible at http://YOUR_VPS_IP:3000

---

**Recommendation: Use Option A (Make it Public)**

For a landing page, there's no security concern, and it makes deployment much simpler!
