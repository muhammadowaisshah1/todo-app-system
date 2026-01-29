# Quick Deployment Guide

## Current Status

**Frontend:** ✅ DEPLOYED
- URL: https://frontend-psi-ten-81.vercel.app
- Platform: Vercel
- Status: Live

**Backend:** ⏳ PENDING
- Platform: Render.com (ready to deploy)
- Status: Awaiting GitHub repository setup

---

## Complete Backend Deployment (15 minutes)

### Option 1: Automated Script (Recommended)

If GitHub repository exists:

```bash
cd "D:\hackathoons\Hackthon_Full-Stack_App"
bash deploy-backend-to-render.sh
```

The script will:
1. Verify environment variables
2. Create Render service
3. Deploy backend
4. Update frontend with backend URL
5. Redeploy frontend

### Option 2: Manual Deployment (Step-by-Step)

#### Step 1: Create GitHub Repository (2 minutes)

1. Go to https://github.com/new
2. Repository name: `hackathon-todo-app`
3. Description: "Full-stack todo application"
4. Visibility: **Public**
5. **Do NOT** check "Initialize with README"
6. Click "Create repository"

#### Step 2: Push Code to GitHub (2 minutes)

```bash
cd "D:\hackathoons\Hackthon_Full-Stack_App"

# Add remote (if not already added)
git remote add origin https://github.com/muhammad-owais-shah/hackathon-todo-app.git

# Push current branch
git push -u origin 001-fullstack-todo-app

# Verify push
git remote -v
```

#### Step 3: Deploy Backend to Render (10 minutes)

**Via Render Dashboard:**

1. Visit https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect a repository"**
4. Select: `muhammad-owais-shah/hackathon-todo-app`
5. Configure service:

   **Basic Settings:**
   - Name: `todo-api-backend`
   - Branch: `001-fullstack-todo-app`
   - Root Directory: `backend`
   - Runtime: **Python 3**

   **Build & Deploy:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

   **Plan:**
   - Select: **Free**

   **Advanced:**
   - Health Check Path: `/health`
   - Auto-Deploy: **Yes**

6. Click **"Environment"** tab and add variables:

   ```
   DATABASE_URL=postgresql+psycopg://neondb_owner:npg_JIVLmKzCs30W@ep-bold-surf-ah3dx6q5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

   BETTER_AUTH_SECRET=UU0V8CQWto33dvA8n5QXLFaiG/pZqHfmM1rEqMUU76Q=

   JWT_ALGORITHM=HS256

   JWT_EXPIRY_DAYS=7

   CORS_ORIGINS=https://frontend-psi-ten-81.vercel.app,http://localhost:3000
   ```

7. Click **"Create Web Service"**
8. Wait 5-10 minutes for deployment
9. Copy your backend URL (e.g., `https://todo-api-backend.onrender.com`)

#### Step 4: Update Frontend (3 minutes)

```bash
cd "D:\hackathoons\Hackthon_Full-Stack_App\frontend"

# Update environment variable (replace with your actual backend URL)
echo "NEXT_PUBLIC_API_URL=https://todo-api-backend.onrender.com" > .env.production

# Redeploy to Vercel
cd ..
source .env
cd frontend
vercel --prod --token "$VERCEL_TOKEN" --yes
```

#### Step 5: Verify Deployment (2 minutes)

**Test Backend:**
```bash
# Replace with your actual backend URL
curl https://todo-api-backend.onrender.com/health

# Expected response:
# {"status":"healthy"}
```

**Test Frontend:**
1. Visit: https://frontend-psi-ten-81.vercel.app
2. Click "Sign Up"
3. Create account with email/password
4. Create a new todo item
5. Verify it saves and displays

**Check Integration:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Create/update a todo
4. Verify API calls to your backend URL
5. Check for errors (should be none)

---

## Troubleshooting

### Backend Build Fails

**Error:** `pip install` fails
**Solution:** Check Python version in Render settings (should be 3.11+)

**Error:** Module not found
**Solution:** Verify `requirements.txt` is in `backend/` directory

### Backend Health Check Fails

**Error:** `/health` returns 404
**Solution:** Verify start command is correct: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Error:** Database connection fails
**Solution:** Verify `DATABASE_URL` environment variable is set correctly

### Frontend Shows API Errors

**Error:** CORS error in browser console
**Solution:**
1. Check `CORS_ORIGINS` in backend includes frontend URL
2. Redeploy backend after updating

**Error:** Network error / timeout
**Solution:**
1. Render free tier sleeps after 15 min inactivity
2. First request takes 30-60 seconds to wake up
3. Subsequent requests are fast

**Error:** 404 on API calls
**Solution:** Verify `NEXT_PUBLIC_API_URL` in frontend `.env.production` is correct

### GitHub Push Fails

**Error:** Repository not found
**Solution:** Create repository first (see Step 1)

**Error:** Authentication failed
**Solution:**
```bash
# Use token in URL
git remote set-url origin https://YOUR_GITHUB_TOKEN@github.com/muhammad-owais-shah/hackathon-todo-app.git
git push -u origin 001-fullstack-todo-app
```

---

## Environment Variables Reference

### Backend (Render)

```bash
DATABASE_URL=postgresql+psycopg://neondb_owner:npg_JIVLmKzCs30W@ep-bold-surf-ah3dx6q5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

BETTER_AUTH_SECRET=UU0V8CQWto33dvA8n5QXLFaiG/pZqHfmM1rEqMUU76Q=

JWT_ALGORITHM=HS256

JWT_EXPIRY_DAYS=7

CORS_ORIGINS=https://frontend-psi-ten-81.vercel.app,http://localhost:3000
```

### Frontend (Vercel)

```bash
NEXT_PUBLIC_API_URL=https://todo-api-backend.onrender.com
```

**Note:** Replace `todo-api-backend` with your actual Render service name.

---

## Useful Commands

### Check Backend Status
```bash
# Health check
curl https://YOUR-BACKEND-URL.onrender.com/health

# API documentation
open https://YOUR-BACKEND-URL.onrender.com/docs

# Test authentication
curl -X POST https://YOUR-BACKEND-URL.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

### Check Frontend Status
```bash
# View deployment logs
vercel logs https://frontend-psi-ten-81.vercel.app

# Redeploy frontend
cd frontend
vercel --prod --token "$VERCEL_TOKEN" --yes
```

### Check Database Status
```bash
# Connect to database (requires psql)
psql "postgresql+psycopg://neondb_owner:npg_JIVLmKzCs30W@ep-bold-surf-ah3dx6q5-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# List tables
\dt

# Check users
SELECT * FROM users;

# Check tasks
SELECT * FROM tasks;
```

---

## Dashboard Links

- **Frontend (Vercel):** https://vercel.com/muhammad-owais-shahs-projects/frontend
- **Backend (Render):** https://dashboard.render.com/
- **Database (Neon):** https://console.neon.tech/
- **GitHub Repository:** https://github.com/muhammad-owais-shah/hackathon-todo-app

---

## Support

If you encounter issues:

1. Check deployment logs in respective dashboards
2. Verify all environment variables are set correctly
3. Ensure CORS origins match exactly (no trailing slashes)
4. Wait 60 seconds for Render free tier to wake up
5. Check browser console for detailed error messages

---

## Success Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Backend health check passes
- [ ] Frontend environment updated
- [ ] Frontend redeployed to Vercel
- [ ] Can sign up new user
- [ ] Can create todo items
- [ ] Can update todo items
- [ ] Can delete todo items
- [ ] No CORS errors in console

---

**Estimated Total Time:** 15-20 minutes

**Current Status:** Frontend deployed, backend ready for deployment
