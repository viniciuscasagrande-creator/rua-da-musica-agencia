import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import b2bHandler from './api/b2b.js';
import healthHandler from './api/health.js';

const env = loadEnv('development', process.cwd(), '');
if (env.DATABASE_URL && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = env.DATABASE_URL;
}

function vercelApiLocalPlugin() {
  return {
    name: 'vercel-api-local-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();

        const sendHelper = (resObj) => {
          resObj.status = (code) => {
            resObj.statusCode = code;
            return resObj;
          };
          resObj.json = (data) => {
            resObj.setHeader('Content-Type', 'application/json; charset=utf-8');
            resObj.end(JSON.stringify(data));
          };
          return resObj;
        };

        if (req.method === 'POST') {
          let raw = '';
          req.on('data', (chunk) => {
            raw += chunk;
          });
          req.on('end', async () => {
            try {
              req.body = raw ? JSON.parse(raw) : {};
            } catch {
              req.body = {};
            }
            const wrappedRes = sendHelper(res);
            if (req.url.startsWith('/api/b2b')) return b2bHandler(req, wrappedRes);
            if (req.url.startsWith('/api/health')) return healthHandler(req, wrappedRes);
            next();
          });
          return;
        }

        const wrappedRes = sendHelper(res);
        if (req.url.startsWith('/api/b2b')) return b2bHandler(req, wrappedRes);
        if (req.url.startsWith('/api/health')) return healthHandler(req, wrappedRes);
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), vercelApiLocalPlugin()],
  server: {
    port: 5173,
    open: false
  }
});
