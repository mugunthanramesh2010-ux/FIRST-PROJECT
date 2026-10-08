// server.cjs
// VIVA ANALYSER - Standalone Production Offline Server & Local File Sync
// Runs 100% offline, zero cloud, zero external server dependencies.

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { saveVivaRecord, openRecordsFolder, getRecordsSummary, BASE_RECORDS_DIR } = require('./server/fileStorage.cjs');

const PORT = process.env.PORT || 5173;
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = path.resolve(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.csv': 'text/csv; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 50 * 1024 * 1024) { // 50MB limit
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({ raw: body });
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  let pathname = '/';
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    pathname = parsedUrl.pathname;
  } catch (e) {
    pathname = req.url.split('?')[0];
  }

  // Enable local CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API ROUTES ---

  // Health check
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', offline: true, time: new Date().toISOString() }));
    return;
  }

  // Save viva assessment record directly to physical folders
  if (pathname === '/api/save-record' && req.method === 'POST') {
    try {
      const data = await readBody(req);
      const result = saveVivaRecord(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      console.error('Save record error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // Open Viva_Records directory in Windows File Explorer
  if (pathname === '/api/open-folder') {
    try {
      const result = openRecordsFolder();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // Get records summary
  if (pathname === '/api/records-summary') {
    try {
      const result = getRecordsSummary();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --- STATIC FILE SERVING (from dist/) ---
  let filePath = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);

  // Normalize path to prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback: serve index.html for client-side routing
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (indexErr, content) => {
        if (indexErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('VIVA Analyser production build not found. Please run "npm run build" first.');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading file');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is in use. Retrying or waiting...`);
  } else {
    console.error('Server error:', err);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception in server:', err);
});

server.listen(PORT, HOST, () => {
  console.log('========================================================');
  console.log('  VIVA ANALYSER - OFFLINE STANDALONE SERVER');
  console.log(`  Local URL:   http://localhost:${PORT}/`);
  console.log(`  Records Dir: ${BASE_RECORDS_DIR}`);
  console.log('  100% Offline Persistence Active (No Cloud Needed)');
  console.log('========================================================');
});
