#!/bin/bash
# Backend Deployment Script for Render.com
# This script automates the backend deployment process

set -e  # Exit on error

echo "=========================================="
echo "Backend Deployment to Render.com"
echo "=========================================="
echo ""

# Load environment variables
if [ ! -f .env ]; then
    echo "ERROR: .env file not found!"
    echo "Please create .env file with required credentials."
    exit 1
fi

source .env

# Verify required environment variables
echo "Step 1: Verifying environment variables..."
if [ -z "$RENDER_API_KEY" ]; then
    echo "ERROR: RENDER_API_KEY not found in .env"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL not found in .env"
    exit 1
fi

if [ -z "$BETTER_AUTH_SECRET" ]; then
    echo "ERROR: BETTER_AUTH_SECRET not found in .env"
    exit 1
fi

echo "✓ Environment variables verified"
echo ""

# Get Render owner ID
echo "Step 2: Fetching Render account information..."
OWNER_RESPONSE=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
    -H "Accept: application/json" \
    https://api.render.com/v1/owners)

OWNER_ID=$(echo $OWNER_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$OWNER_ID" ]; then
    echo "ERROR: Could not fetch Render owner ID"
    echo "Response: $OWNER_RESPONSE"
    exit 1
fi

echo "✓ Owner ID: $OWNER_ID"
echo ""

# Check if GitHub repository exists
echo "Step 3: Verifying GitHub repository..."
REPO_URL="https://github.com/muhammad-owais-shah/hackathon-todo-app"
REPO_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$REPO_URL")

if [ "$REPO_CHECK" != "200" ]; then
    echo "WARNING: GitHub repository not accessible (HTTP $REPO_CHECK)"
    echo ""
    echo "=========================================="
    echo "MANUAL SETUP REQUIRED"
    echo "=========================================="
    echo ""
    echo "Please complete these steps:"
    echo ""
    echo "1. Create GitHub Repository:"
    echo "   - Go to: https://github.com/new"
    echo "   - Name: hackathon-todo-app"
    echo "   - Visibility: Public"
    echo "   - Do NOT initialize with README"
    echo "   - Click 'Create repository'"
    echo ""
    echo "2. Push code to GitHub:"
    echo "   cd \"$(pwd)\""
    echo "   git remote add origin $REPO_URL"
    echo "   git push -u origin 001-fullstack-todo-app"
    echo ""
    echo "3. Deploy to Render:"
    echo "   - Visit: https://dashboard.render.com/"
    echo "   - Click 'New +' → 'Web Service'"
    echo "   - Connect repository: muhammad-owais-shah/hackathon-todo-app"
    echo "   - Branch: 001-fullstack-todo-app"
    echo "   - Root Directory: backend"
    echo "   - Build Command: pip install -r requirements.txt"
    echo "   - Start Command: uvicorn main:app --host 0.0.0.0 --port \$PORT"
    echo ""
    echo "4. Add environment variables in Render dashboard:"
    echo "   DATABASE_URL=$DATABASE_URL"
    echo "   BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET"
    echo "   JWT_ALGORITHM=HS256"
    echo "   JWT_EXPIRY_DAYS=7"
    echo "   CORS_ORIGINS=https://frontend-psi-ten-81.vercel.app,http://localhost:3000"
    echo ""
    echo "5. After deployment, update frontend:"
    echo "   cd frontend"
    echo "   echo \"NEXT_PUBLIC_API_URL=https://YOUR-SERVICE-NAME.onrender.com\" > .env.production"
    echo "   vercel --prod --token \"$VERCEL_TOKEN\" --yes"
    echo ""
    exit 1
fi

echo "✓ GitHub repository accessible"
echo ""

# Create Render service
echo "Step 4: Creating Render service..."

FRONTEND_URL="https://frontend-psi-ten-81.vercel.app"

SERVICE_RESPONSE=$(curl -s -X POST https://api.render.com/v1/services \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"web_service\",
    \"name\": \"todo-api-backend\",
    \"ownerId\": \"$OWNER_ID\",
    \"repo\": \"$REPO_URL\",
    \"autoDeploy\": \"yes\",
    \"branch\": \"001-fullstack-todo-app\",
    \"rootDir\": \"backend\",
    \"serviceDetails\": {
      \"env\": \"python\",
      \"buildCommand\": \"pip install -r requirements.txt\",
      \"startCommand\": \"uvicorn main:app --host 0.0.0.0 --port \$PORT\",
      \"healthCheckPath\": \"/health\",
      \"envVars\": [
        {
          \"key\": \"DATABASE_URL\",
          \"value\": \"$DATABASE_URL\"
        },
        {
          \"key\": \"BETTER_AUTH_SECRET\",
          \"value\": \"$BETTER_AUTH_SECRET\"
        },
        {
          \"key\": \"JWT_ALGORITHM\",
          \"value\": \"HS256\"
        },
        {
          \"key\": \"JWT_EXPIRY_DAYS\",
          \"value\": \"7\"
        },
        {
          \"key\": \"CORS_ORIGINS\",
          \"value\": \"$FRONTEND_URL,http://localhost:3000\"
        }
      ]
    }
  }")

# Check if service was created successfully
SERVICE_ID=$(echo $SERVICE_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$SERVICE_ID" ]; then
    echo "ERROR: Failed to create Render service"
    echo "Response: $SERVICE_RESPONSE"
    exit 1
fi

echo "✓ Service created successfully"
echo "  Service ID: $SERVICE_ID"
echo ""

# Get service URL
SERVICE_URL=$(echo $SERVICE_RESPONSE | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$SERVICE_URL" ]; then
    SERVICE_URL="https://todo-api-backend.onrender.com"
fi

echo "Step 5: Waiting for deployment..."
echo "This may take 5-10 minutes..."
echo ""

# Wait for deployment to complete
MAX_ATTEMPTS=60
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    DEPLOY_STATUS=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
        "https://api.render.com/v1/services/$SERVICE_ID/deploys" | \
        grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)

    if [ "$DEPLOY_STATUS" = "live" ]; then
        echo "✓ Deployment successful!"
        break
    elif [ "$DEPLOY_STATUS" = "build_failed" ] || [ "$DEPLOY_STATUS" = "deploy_failed" ]; then
        echo "ERROR: Deployment failed"
        echo "Check logs at: https://dashboard.render.com/"
        exit 1
    fi

    echo "  Status: $DEPLOY_STATUS (attempt $((ATTEMPT+1))/$MAX_ATTEMPTS)"
    sleep 10
    ATTEMPT=$((ATTEMPT+1))
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo "WARNING: Deployment timeout. Check status at: https://dashboard.render.com/"
fi

echo ""
echo "Step 6: Verifying backend health..."
sleep 5

HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL/health")

if [ "$HEALTH_CHECK" = "200" ]; then
    echo "✓ Backend is healthy"
else
    echo "WARNING: Health check returned HTTP $HEALTH_CHECK"
    echo "Backend may still be starting up. Check: $SERVICE_URL/health"
fi

echo ""
echo "Step 7: Updating frontend environment..."

cd frontend
echo "NEXT_PUBLIC_API_URL=$SERVICE_URL" > .env.production

echo "✓ Frontend environment updated"
echo ""

echo "Step 8: Redeploying frontend to Vercel..."

VERCEL_OUTPUT=$(vercel --prod --token "$VERCEL_TOKEN" --yes 2>&1)
FRONTEND_URL=$(echo "$VERCEL_OUTPUT" | grep -o 'https://[^[:space:]]*vercel.app' | tail -1)

echo "✓ Frontend redeployed"
echo ""

echo "=========================================="
echo "DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "Backend API:"
echo "  URL: $SERVICE_URL"
echo "  Health: $SERVICE_URL/health"
echo "  Docs: $SERVICE_URL/docs"
echo ""
echo "Frontend:"
echo "  URL: $FRONTEND_URL"
echo ""
echo "Next Steps:"
echo "  1. Test backend: curl $SERVICE_URL/health"
echo "  2. Visit frontend: $FRONTEND_URL"
echo "  3. Sign up and create a todo"
echo "  4. Monitor logs: https://dashboard.render.com/"
echo ""
echo "=========================================="
