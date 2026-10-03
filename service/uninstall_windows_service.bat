@echo off
title VIVA ANALYSER - Uninstall Background Service
echo Removing VIVA Analyser Scheduled Task from Windows...

schtasks /delete /tn "VIVA_Analyser_Background_Service" /f

if %ERRORLEVEL% equ 0 (
    echo [OK] Auto-Start task removed successfully.
) else (
    echo Task was not found or already removed.
)

call "%~dp0stop_service.bat"
pause
