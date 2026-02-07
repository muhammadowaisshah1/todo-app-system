@echo off
echo ========================================
echo   Quick Fix (No Admin Required)
echo ========================================
echo.

echo [1/4] Stopping servers...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 2^>nul') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 2^>nul') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul
echo   ✅ Stopped

echo.
echo [2/4] Starting Backend on 127.0.0.1:8000...
start "Backend Server" cmd /k "cd backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 5 /nobreak >nul
echo   ✅ Backend started

echo.
echo [3/4] Updating Frontend to use 127.0.0.1...
powershell -Command "(Get-Content frontend\.env.local) -replace 'localhost:8000', '127.0.0.1:8000' | Set-Content frontend\.env.local"
echo   ✅ Updated config

echo.
echo [4/4] Starting Frontend...
start "Frontend Server" cmd /k "cd frontend && npm run dev"
timeout /t 8 /nobreak >nul
echo   ✅ Frontend started

echo.
echo ========================================
echo   Servers Started!
echo ========================================
echo.
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul
start http://localhost:3000
echo.
pause
