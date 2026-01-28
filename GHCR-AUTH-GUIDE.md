# 🔐 GitHub Container Registry (GHCR) Authentication Guide

## Problem
Your Docker image is private by default in GHCR, so the VPS can't pull it without authentication.

## Solutions

### Option 1: Make the Image Public (Recommended for Open Source)

1. Go to your GitHub repository
2. Click on **Packages** (in the right sidebar) or go to:
   `https://github.com/users/YOUR_USERNAME/packages/container/amr-echaufaudage%2Famr-echafaudage-frontend/settings`
3. Scroll down to **Danger Zone**
4. Click **Change visibility**
5. Select **Public**
6. Confirm the change

**Pros:**
- ✅ Simple - no authentication needed
- ✅ Works immediately
- ✅ No secrets to manage on VPS

**Cons:**
- ❌ Anyone can pull your image
- ❌ Not suitable for proprietary code

### Option 2: Use Personal Access Token (For Private Images)

#### Step 1: Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name: "VPS Docker Pull"
4. Select these permissions:
   - ✅ `read:packages` - Download packages from GitHub Packages
5. Click **Generate token**
6. **COPY THE TOKEN** - you won't see it again!

#### Step 2: Add Token to GitHub Secrets

1. Go to your repository: `https://github.com/YOUR_USERNAME/amr-echaufaudage`
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GHCR_PAT`
5. Value: Paste the Personal Access Token you just created
6. Click **Add secret**

#### Step 3: Update Workflow

The workflow has been updated to use this token. It will:
- Login to GHCR using your PAT
- Pull the private image
- Deploy it

### Option 3: Manual Login on VPS (Temporary)

If you want to test immediately:

```bash
# SSH to your VPS
ssh ubuntu@YOUR_VPS_IP

# Login to GHCR
echo YOUR_GITHUB_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Now the deployment should work
cd ~/amr-echaufaudage
docker pull ghcr.io/YOUR_USERNAME/amr-echaufaudage/amr-echafaudage-frontend:latest
docker run -d --name amr-frontend -p 3000:8080 ghcr.io/YOUR_USERNAME/amr-echaufaudage/amr-echafaudage-frontend:latest
```

## Recommended Approach

**For this project, I recommend Option 1 (Make it Public)** because:
- It's a landing page (not sensitive)
- Simplifies deployment
- No need to manage authentication
- Standard practice for open-source projects

## Quick Decision Matrix

| Scenario | Recommended Option |
|----------|-------------------|
| Open source project | **Option 1: Public** |
| Learning/Portfolio project | **Option 1: Public** |
| Company/Private project | **Option 2: PAT** |
| Quick testing | **Option 3: Manual** |

## After Making Changes

Once you've chosen and implemented an option:

1. **Test the pull:**
   ```bash
   docker pull ghcr.io/YOUR_USERNAME/amr-echaufaudage/amr-echafaudage-frontend:latest
   ```

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Update deployment configuration"
   git push origin main
   ```

3. **Monitor GitHub Actions** to see if it works

## Troubleshooting

### "unauthorized: unauthenticated"
- Image is private and you're not authenticated
- Use Option 1 (make public) or Option 2 (use PAT)

### "manifest unknown"
- Image doesn't exist yet
- Make sure the build-and-push job completed successfully
- Check package name matches exactly

### "denied: permission_denied"
- PAT doesn't have correct permissions
- Recreate PAT with `read:packages` permission
