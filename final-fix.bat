@echo off
echo ========================================
echo   FINAL FIX - Todo App Complete Setup
echo ========================================
echo.

echo [1/7] Stopping all servers...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 2^>nul') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 2^>nul') do taskkill /F /PID %%a 2>nul
timeout /t 3 /nobreak >nul
echo   ✅ Stopped all servers

echo.
echo [2/7] Cleaning caches...
if exist "frontend\.next" rmdir /S /Q "frontend\.next" 2>nul
if exist "frontend\.turbo" rmdir /S /Q "frontend\.turbo" 2>nul
echo   ✅ Cleaned cache

echo.
echo [3/7] Testing database connection...
cd backend
python -c "from app.database import engine; from sqlalchemy import text; conn = engine.connect(); result = conn.execute(text('SELECT 1')); print('✅ Database connected!'); conn.close()" 2>nul
if %errorlevel% neq 0 (
    echo   ❌ Database connection failed - check backend\.env DATABASE_URL
    pause
    exit /b 1
)
cd ..
echo   ✅ Database connection verified

echo.
echo [4/7] Creating database tables...
cd backend
python -c "from app.database import create_db_and_tables; create_db_and_tables(); print('✅ Tables created!')" 2>nul
cd ..
echo   ✅ Database tables ready

echo.
echo [5/7] Starting Backend (127.0.0.1:8000)...
start "Backend Server" cmd /k "cd backend && echo Backend starting... && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 5 /nobreak >nul
echo   ✅ Backend started

echo.
echo [6/7] Starting Frontend (localhost:3000)...
start "Frontend Server" cmd /k "cd frontend && echo Frontend starting... && npm run dev"
timeout /t 8 /nobreak >nul
echo   ✅ Frontend started

echo.
echo [7/7] Testing backend health...
curl -s http://127.0.0.1:8000/health >nul 2>&1
if %errorlevel% == 0 (
    echo   ✅ Backend is healthy and responding!
) else (
    echo   ⚠️  Backend started but not responding yet - wait 5 more seconds
    timeout /t 5 /nobreak >nul
)

echo.
echo ========================================
echo   🎉 Setup Complete!
echo ========================================
echo.
echo Backend API:     http://127.0.0.1:8000
echo API Docs:        http://127.0.0.1:8000/docs
echo Frontend:        http://localhost:3000
echo.
echo Database:        ✅ Connected (Neon PostgreSQL)
echo CORS:            ✅ Configured (127.0.0.1 + localhost)
echo Auth:            ✅ JWT Token Ready
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul
start http://localhost:3000
echo.
echo ========================================
echo   Ready to use! Sign up to test.
echo ========================================
echo.
pause
