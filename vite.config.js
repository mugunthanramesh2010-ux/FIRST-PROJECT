import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { saveVivaRecord, openRecordsFolder, getRecordsSummary } = require('./server/fileStorage.cjs')

function offlineFileStoragePlugin() {
  return {
    name: 'offline-file-storage-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : ''

        if (url === '/api/save-record' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}')
              const result = saveVivaRecord(data)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify(result))
            } catch (err) {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 500
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
          return
        }

        if (url === '/api/open-folder') {
          try {
            const result = openRecordsFolder()
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify(result))
          } catch (err) {
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, error: err.message }))
          }
          return
        }

        if (url === '/api/records-summary') {
          try {
            const result = getRecordsSummary()
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify(result))
          } catch (err) {
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, error: err.message }))
          }
          return
        }

        if (url === '/api/lan-info') {
          const os = require('os')
          const interfaces = os.networkInterfaces()
          let localIp = '127.0.0.1'
          for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]) {
              if ('IPv4' === iface.family && !iface.internal) {
                localIp = iface.address
                break
              }
            }
          }
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 200
          res.end(JSON.stringify({
            hostIp: localIp,
            port: 5173,
            studentUrl: `http://${localIp}:5173/`
          }))
          return
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), offlineFileStoragePlugin()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true
  }
})
