@echo off
echo ========================================
echo   Adding Windows Firewall Rules
echo ========================================
echo.
echo This will allow Python to accept connections on port 8000
echo.

REM Check for admin privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: This script must be run as Administrator!
    echo.
    echo Right-click on this file and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo [1/3] Removing old firewall rules (if any)...
netsh advfirewall firewall delete rule name="Todo App Backend - Python" >nul 2>&1
netsh advfirewall firewall delete rule name="Todo App Backend - Port 8000" >nul 2>&1
echo   ✅ Cleaned old rules

echo.
echo [2/3] Adding firewall rule for Python...
netsh advfirewall firewall add rule name="Todo App Backend - Python" dir=in action=allow program="%~dp0backend\.venv\Scripts\python.exe" enable=yes
if %errorlevel% neq 0 (
    REM Try system Python if venv not found
    for /f "tokens=*" %%i in ('where python') do set PYTHON_PATH=%%i
    netsh advfirewall firewall add rule name="Todo App Backend - Python" dir=in action=allow program="!PYTHON_PATH!" enable=yes
)
echo   ✅ Added Python rule

echo.
echo [3/3] Adding firewall rule for port 8000...
netsh advfirewall firewall add rule name="Todo App Backend - Port 8000" dir=in action=allow protocol=TCP localport=8000
echo   ✅ Added port rule

echo.
echo ========================================
echo   Firewall Rules Added Successfully!
echo ========================================
echo.
echo Now backend connections should work from browser.
echo.
pause
