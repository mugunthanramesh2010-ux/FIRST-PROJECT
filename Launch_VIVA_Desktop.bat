@echo off
title VIVA ANALYSER - Launch Desktop Application
cd /d "%~dp0"

echo ========================================================
echo   VIVA ANALYSER - Standalone Desktop Application (Option C)
echo   100%% Offline Local AI Platform
echo ========================================================
echo.
echo Launching VIVA ANALYSER Desktop Window...

start "" npx electron electron/main.cjs

exit
