@echo off
title VIVA ANALYSER - Universal AI Assessment Platform
echo ========================================================
echo   VIVA ANALYSER - Universal AI Assessment & Learning DNA
echo   100%% Offline Local Platform for PC, Mobile and Tablets
echo ========================================================
echo.
echo Checking dependencies...

where npm >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Starting Vite local server...
    start "" http://localhost:5173/
    npm run dev -- --host --port 5173
    goto end
)

where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Starting Standalone Python server...
    python start_server.py
    goto end
)

echo ERROR: Neither Node/npm nor Python was found on this system.
echo Please install Node.js (https://nodejs.org/) or Python (https://python.org/).
pause

:end
