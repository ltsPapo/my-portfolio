// server/index.ts  (drop-in replacement for the route bits; rest unchanged)
import 'dotenv/config';
import express, { type RequestHandler, type NextFunction, type Request, type Response } from 'express';
import cors, { type CorsOptions } from 'cors';
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

const corsOptions: CorsOptions = { origin: ORIGIN, credentials: true };
app.use(cors(corsOptions));

// ✅ Type handlers as RequestHandler (avoid overload picking)
const healthz: RequestHandler = (_req, res) => {
  res.json({ ok: true });
};
app.get('/healthz', healthz);

app.use('/api/spotify', spotifyRouter);

// Static + SPA fallback
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST = path.resolve(__dirname, '..', 'dist');

app.use(express.static(DIST));

const spaFallback: RequestHandler = (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).end();
    return;
  }
  res.sendFile(path.join(DIST, 'index.html'));
};
app.get('*', spaFallback);

// Error middleware
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  void _next; // intentional
  const message = err instanceof Error ? err.message : String(err);
  console.error('❗ API Error:', message);
  res.status(500).json({ error: { message } });
});

(async () => {
  requireEnv('SPOTIFY_CLIENT_ID', SPOTIFY_CLIENT_ID);
  requireEnv('SPOTIFY_CLIENT_SECRET', SPOTIFY_CLIENT_SECRET);
  requireEnv('SPOTIFY_REDIRECT_URI', SPOTIFY_REDIRECT_URI);
  app.listen(Number(PORT), () =>
    console.log(`✅ Listening on http://localhost:${PORT} (${NODE_ENV})`),
  );
})();
