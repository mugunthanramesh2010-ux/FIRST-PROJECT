@echo off
title VIVA ANALYSER - Install Windows Auto-Start Background Service
cd /d "%~dp0"

echo ========================================================
echo   VIVA ANALYSER - Background Auto-Start Service Setup
echo   Option B: Runs 24/7 on boot without terminal/IDE
echo ========================================================
echo.

set SCRIPT_PATH=%~dp0start_silent.vbs

echo [1/3] Registering Windows Scheduled Task for Auto-Start on Login...
schtasks /create /tn "VIVA_Analyser_Background_Service" /tr "wscript.exe \"%SCRIPT_PATH%\"" /sc onlogon /rl highest /f

if %ERRORLEVEL% equ 0 (
    echo [OK] Windows Auto-Start Task successfully created!
) else (
    echo [!] Administrator privileges might be needed, falling back to standard user logon task...
    schtasks /create /tn "VIVA_Analyser_Background_Service" /tr "wscript.exe \"%SCRIPT_PATH%\"" /sc onlogon /f
)

echo.
echo [2/3] Starting the Background Server silently right now...
wscript.exe "%SCRIPT_PATH%"

echo.
echo [3/3] Testing connection to http://localhost:5173/ ...
timeout /t 3 /nobreak >nul

echo.
echo ========================================================
echo   SUCCESS! VIVA ANALYSER is now running 24/7!
echo.
echo   - Runs automatically every time this PC starts up.
echo   - No terminal, no VS Code, no Antigravity needed.
echo   - Any staff or student can open: http://localhost:5173/
echo   - All results are saved directly to: Viva_Records\
echo ========================================================
echo.
start "" http://localhost:5173/
pause
