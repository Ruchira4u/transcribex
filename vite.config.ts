import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function apiPlugin(): Plugin {
  return {
    name: 'audio2text-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();

        if (req.url === '/api/health' && req.method === 'GET') {
          const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({
            status: 'ok',
            hasApiKey: hasKey,
            model: 'gemini-3.5-transcribe',
            timestamp: new Date().toISOString()
          }));
        }

        if (req.url === '/api/transcribe' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const { processAudioTranscription } = await server.ssrLoadModule('./src/api/transcribeHandler.ts');
              const data = await processAudioTranscription(parsed);
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                success: true,
                data,
                taskMode: parsed.taskMode || 'verbatim',
                timestamp: new Date().toISOString()
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: err.message || 'Transcription error' }));
            }
          });
          return;
        }

        if (req.url === '/api/chat-transcription' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { transcript, userQuery, customApiKey } = JSON.parse(body || '{}');
              const { processChatTranscription } = await server.ssrLoadModule('./src/api/transcribeHandler.ts');
              const answer = await processChatTranscription(transcript, userQuery, customApiKey);
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ answer }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: err.message || 'Chat error' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
