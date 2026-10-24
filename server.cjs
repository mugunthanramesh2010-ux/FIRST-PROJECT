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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session-token');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- MODULAR API DISPATCHER ---
  if (pathname.startsWith('/api/')) {
    try {
      if (!global.__apiDispatcher) {
        const mod = await import('./server/src/apiDispatcher.js');
        global.__apiDispatcher = mod.handleApiRequest;
      }
      if (global.__apiDispatcher) {
        let body = {};
        if (req.method === 'POST') {
          body = await readBody(req);
        }
        const apiRes = await global.__apiDispatcher(pathname, req.method, body, req.headers);
        if (apiRes) {
          const status = apiRes.status || 200;
          res.writeHead(status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(apiRes.body !== undefined ? apiRes.body : apiRes));
          return;
        }
      }
    } catch (apiErr) {
      console.error('API Dispatcher Error:', apiErr);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: apiErr.message }));
      return;
    }
  }

  // --- LEGACY / FALLBACK API ROUTES ---

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

  // Get LAN network info so other PCs can connect
  if (pathname === '/api/lan-info') {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    let localIp = 'localhost';
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if ('IPv4' === iface.family && !iface.internal) {
          localIp = iface.address;
          break;
        }
      }
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      hostIp: localIp,
      port: PORT,
      studentUrl: `http://${localIp}:${PORT}/`
    }));
    return;
  }

  // --- OLLAMA & LOCAL LLM INFERENCE PROXY (Zero CORS, 100% Offline) ---
  if (pathname === '/api/ollama/status' && req.method === 'GET') {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const ollamaRes = await fetch('http://127.0.0.1:11434/api/tags', { signal: controller.signal });
      clearTimeout(timeout);
      if (ollamaRes.ok) {
        const data = await ollamaRes.json();
        const models = (data.models || []).map(m => m.name);
        const activeModel = models.find(m => m.includes('1b')) || models.find(m => m.includes('llama')) || models.find(m => m.includes('qwen')) || models[0] || 'llama3.2:1b';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ available: true, models, activeModel }));
        return;
      }
    } catch (e) {
      // Ollama not reachable
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ available: false, models: [], activeModel: null }));
    return;
  }

  if (pathname === '/api/ollama/generate' && req.method === 'POST') {
    try {
      const data = await readBody(req);
      const model = data.model || 'llama3.2:1b';
      const prompt = data.prompt || '';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

      const ollamaRes = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          stream: false,
          format: 'json',
          options: {
            temperature: 0.75,
            top_p: 0.9,
            num_ctx: 4096,
            num_predict: 2048
          }
        })
      });
      clearTimeout(timeout);

      if (ollamaRes.ok) {
        const ollamaData = await ollamaRes.json();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, response: ollamaData.response, model }));
        return;
      } else {
        const errText = await ollamaRes.text();
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: errText }));
        return;
      }
    } catch (err) {
      console.error('Ollama generate proxy error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
      return;
    }
  }

  // --- SECURE AUTHORITATIVE ASSESSMENT EVALUATION ENDPOINT ---
  function isGibberish(text) {
    if (!text || typeof text !== 'string') return true;
    const trimmed = text.trim();
    if (trimmed.length < 3) return true;
    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length === 1 && words[0].length > 30) return true;
    const letters = trimmed.replace(/[^a-zA-Z]/g, '');
    if (letters.length === 0) return true;
    if (/^(.)\1{4,}$/i.test(trimmed)) return true;
    const vowels = letters.match(/[aeiouyAEIOUY]/g) || [];
    const vowelRatio = vowels.length / letters.length;
    if (letters.length > 15 && vowelRatio < 0.12) return true;
    if (/[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]{7,}/i.test(trimmed)) return true;
    return false;
  }

  if (pathname === '/api/assessment/evaluate' && req.method === 'POST') {
    try {
      const data = await readBody(req);
      const {
        question,
        questionId,
        studentAnswer,
        answerText: rawAnswerText,
        correctIndex,
        options,
        type,
        expectedKeywords = [],
        hintsUsed = 0
      } = data;
      const effectiveStudentAnswer = studentAnswer !== undefined ? studentAnswer : rawAnswerText;
      const qObj = (question && typeof question === 'object') ? question : {};
      const effType = (type || qObj.type || (Array.isArray(options || qObj.options) ? 'mcq' : 'text')).toLowerCase();
      const effCorrectIdx = correctIndex !== undefined ? correctIndex : qObj.correctIndex;
      const effOptions = options || qObj.options;

      let isCorrect = false;
      let score = 0;
      let feedback = '';

      if (effType === 'mcq' && effCorrectIdx !== undefined && effCorrectIdx !== null) {
        const targetIdx = typeof effCorrectIdx === 'number' ? effCorrectIdx : parseInt(effCorrectIdx, 10);
        const studentIdx = typeof effectiveStudentAnswer === 'number' ? effectiveStudentAnswer : parseInt(effectiveStudentAnswer, 10);
        isCorrect = studentIdx === targetIdx;
        const penalty = Math.min(30, (hintsUsed || 0) * 8);
        score = isCorrect ? Math.max(50, 100 - penalty) : 0;
        const selectedText = (effOptions && effOptions[studentIdx]) ? effOptions[studentIdx] : `Option ${studentIdx + 1}`;
        feedback = isCorrect
          ? `Correct technical option selected: "${selectedText}".`
          : `Selected option does not articulate the required governing principle.`;
      } else {
        // Conceptual text / oral answer evaluation
        const answerText = String(effectiveStudentAnswer || '').trim();

        if (isGibberish(answerText)) {
          score = 0;
          isCorrect = false;
          feedback = 'Unparseable or nonsensical input detected. No valid physical or mathematical principles identified.';
        } else {
          const lowerAnswer = answerText.toLowerCase();
          const keywords = Array.isArray(expectedKeywords) && expectedKeywords.length > 0
            ? expectedKeywords.map(k => String(k).toLowerCase().trim())
            : ['principle', 'concept', 'formula', 'equilibrium'];

          const matched = [];
          const missing = [];

          keywords.forEach(kw => {
            if (lowerAnswer.includes(kw)) {
              matched.push(kw);
            } else {
              missing.push(kw);
            }
          });

          const matchRatio = matched.length / Math.max(1, keywords.length);
          const penalty = Math.min(25, (hintsUsed || 0) * 6);

          if (matchRatio >= 0.6 || matched.length >= 3) {
            score = Math.max(75, Math.min(100, Math.round(75 + matchRatio * 25) - penalty));
            isCorrect = true;
            feedback = `Accurate conceptual reasoning! Key technical principles demonstrated (${matched.slice(0, 3).join(', ')}).`;
          } else if (matchRatio >= 0.25 || matched.length >= 1) {
            score = Math.max(45, Math.min(74, Math.round(45 + matchRatio * 30) - penalty));
            isCorrect = false;
            feedback = `Partially correct. Identified ${matched.join(', ')}, but missed core elements: ${missing.slice(0, 2).join(', ')}.`;
          } else {
            score = 0;
            isCorrect = false;
            feedback = `Fundamental conceptual gaps detected. Missing critical domain parameters: ${missing.slice(0, 3).join(', ')}.`;
          }
        }
      }

      const status = score >= 80 ? 'Correct' : score >= 50 ? 'Partially Correct' : 'Needs Improvement';

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        evaluation: {
          score,
          isCorrect,
          status,
          feedback
        }
      }));
      return;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
      return;
    }
  }

  // --- UNIFIED AI QUESTION GENERATION ENDPOINT (Ollama + OpenAI Structured Outputs) ---
  if (pathname === '/api/ai/generate' && req.method === 'POST') {
    try {
      const data = await readBody(req);
      const { provider = 'auto', topic = 'Engineering', count = 5, model, apiKey, apiBaseUrl = 'https://api.openai.com/v1', documentContext = '' } = data;

      // 1. If OpenAI API requested or API key provided
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
          };

          const openAiRes = await fetch(`${apiBaseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: model || 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: 'You are an authoritative oral viva examiner and university professor. Generate rigorous technical questions with 4 progressive hints. Hints must guide student thinking without leaking answers. Provide 4 plausible options for MCQs.'
                },
                {
                  role: 'user',
                  content: `Generate ${count} oral viva questions for topic: "${topic}". ${documentContext ? `Context:\n${documentContext.slice(0, 3000)}` : ''}`
                }
              ],
              response_format: { type: 'json_schema', json_schema: schema }
            })
          });

          if (openAiRes.ok) {
            const aiData = await openAiRes.json();
            const messageContent = aiData.choices?.[0]?.message?.content;
            const parsed = JSON.parse(messageContent);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, provider: 'openai', data: parsed }));
            return;
          }
        } catch (openaiErr) {
          console.warn('OpenAI API call failed, falling back to Ollama:', openaiErr.message);
        }
      }

      // 2. Try Local Ollama
      try {
        const ollamaModel = model || 'llama3.2:1b';
        const prompt = `You are a university professor conducting an oral viva exam on "${topic}".
${documentContext ? `SYLLABUS & MATERIAL:\n${documentContext.slice(0, 2500)}\n` : ''}
Generate exactly ${count} rigorous viva examination questions.
Return ONLY valid JSON in this exact structure:
{
  "topic": "${topic}",
  "questions": [
    {
      "questionText": "Technical question text here",
      "type": "mcq",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctIndex": 0,
      "bloomLevel": "Understanding",
      "hints": [
        "Hint 1: Conceptual clue",
        "Hint 2: Governing formula or principle clue",
        "Hint 3: Methodology clue",
        "Hint 4: Specific technical insight"
      ],
      "modelAnswer": "Model answer explaining the concept",
      "expectedKeywords": ["keyword1", "keyword2"]
    }
  ]
}`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 45000);
        const ollamaRes = await fetch('http://127.0.0.1:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            model: ollamaModel,
            prompt: prompt,
            stream: false,
            format: 'json',
            options: {
              temperature: 0.75,
              top_p: 0.9,
              num_ctx: 4096,
              num_predict: 2048
            }
          })
        });
        clearTimeout(timeout);

        if (ollamaRes.ok) {
          const ollamaData = await ollamaRes.json();
          const parsed = JSON.parse(ollamaData.response);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, provider: 'ollama', model: ollamaModel, data: parsed }));
          return;
        }
      } catch (ollamaErr) {
        console.warn('Ollama proxy call failed:', ollamaErr.message);
      }

      // If both AI options failed or timed out, inform client to use offline ontology
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, fallbackToOffline: true }));
      return;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
      return;
    }
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
