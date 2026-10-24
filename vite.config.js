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

        if (!url.startsWith('/api/')) {
          return next();
        }

        if (url.startsWith('/api/')) {
          try {
            const mod = await import('./server/src/apiDispatcher.js');
            const dispatcher = mod.handleApiRequest;
            if (dispatcher) {
              let body = {};
              if (req.method === 'POST') {
                body = await new Promise((resolve) => {
                  let b = '';
                  req.on('data', chunk => { b += chunk; });
                  req.on('end', () => {
                    try { resolve(JSON.parse(b || '{}')); } catch (e) { resolve({}); }
                  });
                });
              }
              const apiRes = await dispatcher(url, req.method, body, req.headers);
              if (apiRes) {
                const status = apiRes.status || 200;
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = status;
                res.end(JSON.stringify(apiRes.body !== undefined ? apiRes.body : apiRes));
                return;
              }
            }
          } catch (err) {
            console.error('Vite Middleware API error:', err);
          }
        }

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

        if (url === '/api/ollama/status' && req.method === 'GET') {
          try {
            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 2000)
            const ollamaRes = await fetch('http://127.0.0.1:11434/api/tags', { signal: controller.signal })
            clearTimeout(timeout)
            if (ollamaRes.ok) {
              const data = await ollamaRes.json()
              const models = (data.models || []).map(m => m.name)
              const activeModel = models.find(m => m.includes('1b')) || models.find(m => m.includes('llama')) || models.find(m => m.includes('qwen')) || models[0] || 'llama3.2:1b'
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ available: true, models, activeModel }))
              return
            }
          } catch (e) { }
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 200
          res.end(JSON.stringify({ available: false, models: [], activeModel: null }))
          return
        }

        if (url === '/api/ollama/generate' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}')
              const model = data.model || 'llama3.2:1b'
              const prompt = data.prompt || ''
              const controller = new AbortController()
              const timeout = setTimeout(() => controller.abort(), 60000)
              const ollamaRes = await fetch('http://127.0.0.1:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                  model: model,
                  prompt: prompt,
                  stream: false,
                  format: 'json',
                  options: { temperature: 0.75, top_p: 0.9, num_ctx: 4096, num_predict: 2048 }
                })
              })
              clearTimeout(timeout)
              if (ollamaRes.ok) {
                const ollamaData = await ollamaRes.json()
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 200
                res.end(JSON.stringify({ success: true, response: ollamaData.response, model }))
                return
              }
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 502
              res.end(JSON.stringify({ success: false, error: 'Ollama error' }))
            } catch (err) {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 500
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
          return
        }

        if (url === '/api/ai/generate' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}')
              const { provider = 'auto', topic = 'Engineering', count = 5, model, apiKey, apiBaseUrl = 'https://api.openai.com/v1', documentContext = '' } = data

              if ((provider === 'openai' || apiKey) && apiKey) {
                try {
                  const schema = {
                    name: 'viva_examination',
                    strict: true,
                    schema: {
                      type: 'object',
                      properties: {
                        topic: { type: 'string' },
                        questions: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              questionText: { type: 'string' },
                              type: { type: 'string', enum: ['mcq', 'text'] },
                              options: { type: 'array', items: { type: 'string' } },
                              correctIndex: { type: 'integer' },
                              bloomLevel: { type: 'string', enum: ['Remembering', 'Understanding', 'Application', 'Analysis', 'Evaluation'] },
                              hints: { type: 'array', items: { type: 'string' } },
                              modelAnswer: { type: 'string' },
                              expectedKeywords: { type: 'array', items: { type: 'string' } }
                            },
                            required: ['questionText', 'type', 'options', 'correctIndex', 'bloomLevel', 'hints', 'modelAnswer', 'expectedKeywords'],
                            additionalProperties: false
                          }
                        }
                      },
                      required: ['topic', 'questions'],
                      additionalProperties: false
                    }
                  }
                  const openAiRes = await fetch(`${apiBaseUrl}/chat/completions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                    body: JSON.stringify({
                      model: model || 'gpt-4o-mini',
                      messages: [
                        { role: 'system', content: 'You are an authoritative oral viva examiner. Generate questions with 4 progressive hints and 4 MCQ options. Do not leak answers.' },
                        { role: 'user', content: `Generate ${count} viva questions on: "${topic}".` }
                      ],
                      response_format: { type: 'json_schema', json_schema: schema }
                    })
                  })
                  if (openAiRes.ok) {
                    const aiData = await openAiRes.json()
                    const parsed = JSON.parse(aiData.choices?.[0]?.message?.content)
                    res.setHeader('Content-Type', 'application/json')
                    res.statusCode = 200
                    res.end(JSON.stringify({ success: true, provider: 'openai', data: parsed }))
                    return
                  }
                } catch (oe) { }
              }

              // Ollama
              try {
                const ollamaModel = model || 'llama3.2:1b'
                const prompt = `You are a university professor conducting a viva exam on "${topic}".
Generate exactly ${count} viva questions. Return ONLY valid JSON:
{"topic": "${topic}", "questions": [{"questionText": "...", "type": "mcq", "options": ["opt1","opt2","opt3","opt4"], "correctIndex": 0, "bloomLevel": "Understanding", "hints": ["h1","h2","h3","h4"], "modelAnswer": "...", "expectedKeywords": ["k1","k2"]}]}`

                const controller = new AbortController()
                const timeout = setTimeout(() => controller.abort(), 45000)
                const ollamaRes = await fetch('http://127.0.0.1:11434/api/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  signal: controller.signal,
                  body: JSON.stringify({
                    model: ollamaModel,
                    prompt: prompt,
                    stream: false,
                    format: 'json',
                    options: { temperature: 0.75, top_p: 0.9, num_ctx: 4096, num_predict: 2048 }
                  })
                })
                clearTimeout(timeout)
                if (ollamaRes.ok) {
                  const oData = await ollamaRes.json()
                  const parsed = JSON.parse(oData.response)
                  res.setHeader('Content-Type', 'application/json')
                  res.statusCode = 200
                  res.end(JSON.stringify({ success: true, provider: 'ollama', model: ollamaModel, data: parsed }))
                  return
                }
              } catch (oErr) { }

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ success: false, fallbackToOffline: true }))
            } catch (err) {
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 500
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
          return
        }

        next();
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
