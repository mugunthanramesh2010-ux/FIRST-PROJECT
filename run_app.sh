#!/usr/bin/env bash
# VIVA ANALYSER - Linux & macOS Launcher
echo "========================================================"
echo "  VIVA ANALYSER - Universal AI Assessment & Learning DNA"
echo "  100% Offline Platform for PC, Mobile and Tablets"
echo "========================================================"

if command -v npm &> /dev/null; then
    echo "Starting Vite local server..."
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:5173/" &
    elif command -v open &> /dev/null; then
        open "http://localhost:5173/" &
    fi
    npm run dev -- --host --port 5173
elif command -v python3 &> /dev/null; then
    echo "Starting Standalone Python server..."
    python3 start_server.py
else
    echo "ERROR: Neither Node/npm nor Python3 was found on this system."
    exit 1
fi
