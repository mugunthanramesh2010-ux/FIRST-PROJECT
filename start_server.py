#!/usr/bin/env python3
"""
VIVA ANALYSER - Standalone 100% Offline Python Server
Runs on any PC, Mac, Linux, or embedded device without internet or cloud APIs.
"""

import http.server
import socketserver
import webbrowser
import socket
import os
import sys

PORT = 5173

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable Service Worker and modern PWA headers
        self.send_header('Service-Worker-Allowed', '/')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

def run_server():
    # If dist exists, serve dist, otherwise serve root
    web_dir = os.path.join(os.path.dirname(__file__), 'dist')
    if os.path.exists(web_dir) and os.path.exists(os.path.join(web_dir, 'index.html')):
        os.chdir(web_dir)
        print(f"[*] Serving production build from: {web_dir}")
    else:
        print(f"[*] Serving source directory from: {os.path.dirname(__file__)}")

    local_ip = get_local_ip()

    print("=" * 65)
    print("  VIVA ANALYSER — Universal AI Cognitive Assessment Platform")
    print("  100% Offline Standalone Architecture")
    print("=" * 65)
    print(f"  Local PC URL:      http://localhost:{PORT}/")
    print(f"  Mobile Phone URL:  http://{local_ip}:{PORT}/")
    print("=" * 65)
    print("  Press Ctrl+C to stop server.\n")

    # Automatically open local browser
    try:
        webbrowser.open(f"http://localhost:{PORT}/")
    except Exception:
        pass

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer gracefully stopped.")

if __name__ == '__main__':
    run_server()
