@echo off
title VIVA ANALYSER - One-Click Deploy to Vercel (24/7 Free Cloud)
cd /d "%~dp0"

echo ========================================================
echo   VIVA ANALYSER - One-Click Deploy to Free 24/7 Cloud
echo   Runs 24/7 on phones & tablets with NO PC running!
echo ========================================================
echo.
echo [1/3] Building production assets...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build failed. Please check the code.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Preparing deployment to Vercel...
echo If this is your first time, a browser tab will open to log in with GitHub/Email.
echo.
call npx vercel --prod

echo.
echo ========================================================
echo [3/3] DEPLOYMENT COMPLETE!
echo.
echo You now have a permanent 24/7 link!
echo - You can TURN OFF this laptop completely.
echo - Any student can open that link on their phone anytime.
echo ========================================================
pause
