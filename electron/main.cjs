// electron/main.cjs
// Native Desktop Application Window for VIVA ANALYSER
// 100% Offline, Native Windows File Storage Integration

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');
const { saveVivaRecord, openRecordsFolder, getRecordsSummary, BASE_RECORDS_DIR } = require('../server/fileStorage.cjs');

let mainWindow = null;
let internalServer = null;

// Ensure records directory exists on launch
const { ensureDirectoriesExist } = require('../server/fileStorage.cjs');
ensureDirectoriesExist();

// Start a lightweight internal server to serve dist/ cleanly inside Electron
function startInternalServer(port = 51730) {
  return new Promise((resolve) => {
    const DIST_DIR = path.resolve(__dirname, '..', 'dist');
    const MIME_TYPES = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.mjs': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff2': 'font/woff2'
    };

    internalServer = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      let filePath = path.join(DIST_DIR, reqPath === '/' ? 'index.html' : reqPath);

      if (!filePath.startsWith(DIST_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          filePath = path.join(DIST_DIR, 'index.html');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (readErr, content) => {
          if (readErr) {
            res.writeHead(500);
            res.end('Error loading file');
            return;
          }
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        });
      });
    });

    internalServer.listen(port, '127.0.0.1', () => {
      resolve(`http://127.0.0.1:${port}`);
    });
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'VIVA ANALYSER - Offline AI Assessment Platform',
    backgroundColor: '#0D1117',
    icon: path.join(__dirname, '..', 'dist', 'favicon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Try connecting to active Vite dev server (if running during dev), otherwise load internal offline server
  const devUrl = 'http://localhost:5173';
  let targetUrl = devUrl;

  const isDevRunning = await new Promise((resolve) => {
    http.get(devUrl, () => resolve(true)).on('error', () => resolve(false));
  });

  if (isDevRunning) {
    targetUrl = devUrl;
  } else {
    // Check if dist/ exists, if not build it
    const distIndex = path.join(__dirname, '..', 'dist', 'index.html');
    if (!fs.existsSync(distIndex)) {
      console.log('Building dist bundle for offline desktop app...');
      const { execSync } = require('child_process');
      execSync('npm run build', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    }
    targetUrl = await startInternalServer();
  }

  await mainWindow.loadURL(targetUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers for Local Disk Storage
ipcMain.handle('save-viva-record', async (event, data) => {
  try {
    return saveVivaRecord(data);
  } catch (err) {
    console.error('IPC save error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('open-records-folder', async () => {
  return openRecordsFolder();
});

ipcMain.handle('get-records-summary', async () => {
  return getRecordsSummary();
});

ipcMain.handle('toggle-fullscreen', async () => {
  if (mainWindow) {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
    return mainWindow.isFullScreen();
  }
  return false;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (internalServer) {
    internalServer.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
