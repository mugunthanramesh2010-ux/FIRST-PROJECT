@echo off
title VIVA ANALYSER - Stop Background Service
echo Stopping background Node server running on port 5173...

powershell -Command "Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue; Write-Host 'Stopped Process ID: ' $_ }"

echo.
echo Service stopped.
pause
