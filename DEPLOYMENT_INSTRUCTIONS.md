# Backend Deployment Instructions - Quick Start

## Current Status
- Backend code: Ready for deployment
- Dockerfile: Configured
- Environment variables: Validated
- Database: Connected (Neon PostgreSQL)

## Issue Encountered
The GitHub token doesn't have permissions to create repositories via API. You'll need to create the repository manually.

---

## Step-by-Step Deployment

### Step 1: Create GitHub Repository (2 minutes)

1. Go to: https://github.com/new
2. Fill in:
   - **Repository name:** `hackathon-todo-app`
   - **Description:** `Full-stack todo application - FastAPI backend + Next.js frontend`
   - **Visibility:** Private (recommended)
   - **DO NOT** check "Initialize this repository with a README"
3. Click **"Create repository"**

### Step 2: Push Code to GitHub (1 minute)

Open your terminal in the project root and run:

```bash
cd "D:\hackathoons\Hackthon_Full-Stack_App"
git push -u origin 001-fullstack-todo-app
```

This will push your current branch with all the backend code to GitHub.

### Step 3: Deploy to Render (5 minutes)

#### Option A: Via Render Dashboard (Recommended - Easiest)

1. Go to: https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. If prompted, connect your GitHub account
5. Select repository: **hackathon-todo-app**
6. Configure:

**Basic Settings:**
```
Name: hackathon-todo-backend-api
Region: Oregon (US West)
Branch: 001-fullstack-todo-app
Root Directory: backend
Runtime: Python 3
```

**Build & Deploy:**
```
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Advanced:**
```
Health Check Path: /health
Auto-Deploy: Yes
```

7. Click **"Environment"** and add these variables:

```
DATABASE_URL
postgresql://neondb_owner:npg_JIVLmKzCs30W@ep-bold-surf-ah3dx6q5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

BETTER_AUTH_SECRET
iQqaa/xGZmT9Gb0Jh4KEvMJVXghH82rxBk6tqPOsqgQ=

CORS_ORIGINS
http://localhost:3000,https://*.vercel.app

DEBUG
false

JWT_ALGORITHM
HS256

JWT_EXPIRY_DAYS
7
```

8. Click **"Create Web Service"**

#### Option B: Via Render API (After GitHub repo exists)

Run this command from your terminal:

```bash
curl -X POST https://api.render.com/v1/services \
  -H "Authorization: Bearer rnd_f4eZfVGaWjdCx6BbN1uaAVXKSh03" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "web_service",
    "name": "hackathon-todo-backend-api",
    "ownerId": "tea-cvhvsmpopnds73fojki0",
    "repo": "https://github.com/muhammad-owais-shah/hackathon-todo-app",
    "branch": "001-fullstack-todo-app",
    "rootDir": "backend",
    "serviceDetails": {
      "env": "python",
      "buildCommand": "pip install -r requirements.txt",
      "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
      "healthCheckPath": "/health",
      "envVars": [
        {"key": "DATABASE_URL", "value": "postgresql://neondb_owner:npg_JIVLmKzCs30W@ep-bold-surf-ah3dx6q5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"},
        {"key": "BETTER_AUTH_SECRET", "value": "iQqaa/xGZmT9Gb0Jh4KEvMJVXghH82rxBk6tqPOsqgQ="},
        {"key": "CORS_ORIGINS", "value": "http://localhost:3000,https://*.vercel.app"},
        {"key": "DEBUG", "value": "false"},
        {"key": "JWT_ALGORITHM", "value": "HS256"},
        {"key": "JWT_EXPIRY_DAYS", "value": "7"}
      ]
    },
    "plan": "free",
    "region": "oregon",
    "autoDeploy": "yes"
  }'
```

### Step 4: Monitor Deployment (3-5 minutes)

1. Go to your Render dashboard
2. Click on your service: **hackathon-todo-backend-api**
3. Click **"Logs"** tab
4. Watch for these messages:
   - ✓ "Build started"
   - ✓ "Installing dependencies"
   - ✓ "Build succeeded"
   - ✓ "Starting up: Creating database tables..."
   - ✓ "Database tables created successfully"
   - ✓ "Deploy live"

### Step 5: Verify Deployment (1 minute)

Once the service shows **"Live"**, test it:

1. Copy your service URL from Render (e.g., `https://hackathon-todo-backend-api.onrender.com`)

2. Test in browser or terminal:

```bash
# Health check
curl https://YOUR-SERVICE-URL.onrender.com/health

# Root endpoint
curl https://YOUR-SERVICE-URL.onrender.com/

# API documentation (open in browser)
https://YOUR-SERVICE-URL.onrender.com/docs
```

Expected responses:
- `/health` → `{"status": "healthy"}`
- `/` → `{"status": "healthy", "app_name": "Todo API", "version": "1.0.0", ...}`

### Step 6: Update Frontend (2 minutes)

Once backend is deployed, update your frontend:

```bash
cd frontend

# Add production API URL
vercel env add NEXT_PUBLIC_API_URL production
# When prompted, enter: https://YOUR-SERVICE-URL.onrender.com

# Redeploy frontend
vercel --prod
```

---

## Troubleshooting

### "Repository not found" when pushing
- Make sure you created the repository on GitHub
- Verify the repository name is exactly: `hackathon-todo-app`
- Check that you're logged into the correct GitHub account

### Build fails on Render
- Check the logs for specific error messages
- Verify `requirements.txt` is in the backend directory
- Ensure Python version is compatible (3.11)

### Service won't start
- Verify the start command uses `$PORT` variable
- Check that `main.py` exists in backend directory
- Review logs for import errors

### Database connection fails
- Ensure `DATABASE_URL` includes `?sslmode=require`
- Verify Neon database is active
- Check connection string is correct

### Health check fails
- Wait 30-60 seconds after "Deploy live" message
- Verify `/health` endpoint exists in `main.py`
- Check service is binding to `0.0.0.0:$PORT`

---

## Important Notes

1. **Free Tier:** Service spins down after 15 minutes of inactivity. First request after spin-down takes 30-60 seconds.

2. **Auto-Deploy:** Any push to the `001-fullstack-todo-app` branch will trigger automatic redeployment.

3. **Environment Variables:** Never commit `.env` to Git. Update via Render dashboard.

4. **CORS:** After deploying frontend, update `CORS_ORIGINS` in Render with your actual frontend URL.

---

## Quick Reference

**GitHub Repository:** https://github.com/muhammad-owais-shah/hackathon-todo-app

**Render Dashboard:** https://dashboard.render.com/

**Service Name:** hackathon-todo-backend-api

**Branch:** 001-fullstack-todo-app

**Root Directory:** backend

**Health Check:** `/health`

---

## What's Already Done

✓ Backend code is production-ready
✓ Dockerfile configured
✓ Environment variables validated
✓ Database (Neon) is set up and connected
✓ Git repository initialized locally
✓ All dependencies listed in requirements.txt
✓ Health check endpoint implemented
✓ CORS configured
✓ JWT authentication ready

## What You Need to Do

1. Create GitHub repository (2 min)
2. Push code (1 min)
3. Deploy to Render (5 min)
4. Verify deployment (1 min)
5. Update frontend (2 min)

**Total Time: ~11 minutes**

---

For detailed information, see: `backend/RENDER_DEPLOYMENT_GUIDE.md`
