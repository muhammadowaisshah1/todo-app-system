@echo off
echo ========================================
echo   Starting Todo App - Full Stack
echo ========================================
echo.

echo [Step 0/3] Cleaning up previous instances...
REM Clean Next.js lockfiles and cache
if exist "frontend\.next\dev\lock" del /F /Q "frontend\.next\dev\lock" 2>nul
if exist "frontend\.next\cache" rmdir /S /Q "frontend\.next\cache" 2>nul

REM Kill any processes on required ports
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 2^>nul') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 2^>nul') do taskkill /F /PID %%a 2>nul

timeout /t 2 /nobreak >nul
echo.

echo [1/3] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"
timeout /t 5 /nobreak >nul

echo [3/3] Opening Browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
