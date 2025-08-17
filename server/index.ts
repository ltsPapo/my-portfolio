import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import spotifyRouter from './routes/spotify.js';

const app = express();

const {
  NODE_ENV = 'development',
  PORT = process.env.PORT || '3001',
  ORIGIN = 'http://127.0.0.1:5173',
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} = process.env;

function requireEnv(name: string, val?: string) {
  if (!val) throw new Error(`Missing env: ${name}`);
  return val;
}

process.on('unhandledRejection', (r) => console.error('UnhandledRejection', r));
process.on('uncaughtException', (e) => console.error('UncaughtException', e));

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: ORIGIN, credentials: true }));

app.get('/healthz', (_req: Request, res: Response) => res.json({ ok: true }));

app.use('/api/spotify', spotifyRouter);

// Serve Vite build (single domain)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST = path.resolve(__dirname, '..', 'dist');
app.use(express.static(DIST));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).end();
  res.sendFile(path.join(DIST, 'index.html'));
});

// Error middleware (typed)
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // Use _next to satisfy no-unused-vars
  void _next;
  const status = 500;
  const message = err instanceof Error ? err.message : String(err);
  console.error('❗ API Error:', message);
  res.status(status).json({ error: { message } });
});

(async () => {
  requireEnv('SPOTIFY_CLIENT_ID', SPOTIFY_CLIENT_ID);
  requireEnv('SPOTIFY_CLIENT_SECRET', SPOTIFY_CLIENT_SECRET);
  requireEnv('SPOTIFY_REDIRECT_URI', SPOTIFY_REDIRECT_URI);
  app.listen(Number(PORT), () =>
    console.log(`✅ Listening on http://localhost:${PORT} (${NODE_ENV})`),
  );
})();
