@echo off
echo ========================================
echo   Stopping Todo App Servers
echo ========================================
echo.

echo [1/4] Killing processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /F /PID %%a 2>nul
)

echo [2/4] Killing processes on port 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do (
    taskkill /F /PID %%a 2>nul
)

echo [3/4] Killing processes on port 3002...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3002') do (
    taskkill /F /PID %%a 2>nul
)

echo [4/4] Killing processes on port 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do (
    taskkill /F /PID %%a 2>nul
)

echo.
echo [5/5] Cleaning Next.js cache and lockfiles...
if exist "frontend\.next\dev\lock" del /F /Q "frontend\.next\dev\lock"
if exist "frontend\.next\cache" rmdir /S /Q "frontend\.next\cache"

echo.
echo ========================================
echo   All servers stopped successfully!
echo ========================================
echo.
pause
