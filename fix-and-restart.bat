@echo off
echo ========================================
echo   Fixing and Restarting Todo App
echo ========================================
echo.

echo [1/5] Stopping all existing servers...
REM Kill processes on ports 3000 and 8000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 2^>nul') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 2^>nul') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul
echo   ✅ Stopped existing servers

echo.
echo [2/5] Cleaning Next.js cache...
if exist "frontend\.next" rmdir /S /Q "frontend\.next" 2>nul
if exist "frontend\.next\cache" rmdir /S /Q "frontend\.next\cache" 2>nul
echo   ✅ Cleaned cache

echo.
echo [3/5] Starting Backend Server (Port 8000)...
start "Backend Server" cmd /k "cd backend && echo Starting backend... && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level debug"
timeout /t 5 /nobreak >nul
echo   ✅ Backend started

echo.
echo [4/5] Starting Frontend Server (Port 3000)...
start "Frontend Server" cmd /k "cd frontend && echo Starting frontend... && npm run dev"
timeout /t 8 /nobreak >nul
echo   ✅ Frontend started

echo.
echo [5/5] Testing connection...
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% == 0 (
    echo   ✅ Backend is responding
) else (
    echo   ❌ Backend not responding - check Backend Server window
)

echo.
echo ========================================
echo   Application Restarted!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Opening browser...
timeout /t 2 /nobreak >nul
start http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
