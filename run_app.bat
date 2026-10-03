@echo off
title VIVA ANALYSER - Launch Control Panel
cd /d "%~dp0"

:menu
cls
echo ========================================================
echo   VIVA ANALYSER - UNIVERSAL OFFLINE ASSESSMENT PLATFORM
echo   Zero Cloud Dependency • 100%% Local File Manager Storage
echo ========================================================
echo.
echo   [1] Launch Desktop App Window (Option C - Electron)
echo   [2] Start Local Server & Open Browser (http://localhost:5173)
echo   [3] Install 24/7 Windows Background Service (Option B - Auto-Start)
echo   [4] Open Viva_Records Folder in Windows File Explorer
echo   [5] Stop Running Background Service
echo   [6] Exit
echo.
echo ========================================================
set /p choice="Enter your choice (1-6) [Default=1]: "

if "%choice%"=="" set choice=1
if "%choice%"=="1" goto desktop
if "%choice%"=="2" goto browser
if "%choice%"=="3" goto service
if "%choice%"=="4" goto folder
if "%choice%"=="5" goto stop
if "%choice%"=="6" goto exit

echo Invalid choice. Please try again.
pause
goto menu

:desktop
echo.
echo Launching VIVA ANALYSER Desktop Application...
start "" npx electron electron/main.cjs
exit

:browser
echo.
echo Starting Standalone Offline Server...
start "" node server.cjs
timeout /t 2 /nobreak >nul
start "" http://localhost:5173/
exit

:service
echo.
call "%~dp0service\setup_windows_service.bat"
goto menu

:folder
echo.
echo Opening Viva_Records directory in File Explorer...
if not exist "%~dp0Viva_Records" mkdir "%~dp0Viva_Records"
start "" "%~dp0Viva_Records"
goto menu

:stop
echo.
call "%~dp0service\stop_service.bat"
goto menu

:exit
exit
