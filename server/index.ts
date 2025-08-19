// FILE: server/index.ts
import 'dotenv/config';
import express, { type RequestHandler, type NextFunction, type Request, type Response } from 'express';
import cors, { type CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'node:fs';
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

if (NODE_ENV === 'production') app.set('trust proxy', 1);

process.on('unhandledRejection', (r) => console.error('UnhandledRejection', r));
process.on('uncaughtException', (e) => console.error('UncaughtException', e));

app.use(cookieParser());
app.use(express.json());

const corsOptions: CorsOptions = { origin: ORIGIN, credentials: true };
app.use(cors(corsOptions));

// --- health ---
const healthz: RequestHandler = (_req, res) => res.json({ ok: true });
app.get('/healthz', healthz);

// --- diagnostics (no secrets) ---
const diagnostics: RequestHandler = (_req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const distFromTsx = path.resolve(__dirname, '..', 'dist');        // when running via tsx
  const distFromCompiled = path.resolve(__dirname, '..', '..', 'dist'); // when running compiled
  const aHtml = fs.existsSync(path.join(distFromTsx, 'index.html'));
  const bHtml = fs.existsSync(path.join(distFromCompiled, 'index.html'));

  res.json({
    ok: true,
    node: process.version,
    env: {
      NODE_ENV,
      ORIGIN,
      SPOTIFY_CLIENT_ID: Boolean(SPOTIFY_CLIENT_ID),
      SPOTIFY_CLIENT_SECRET: Boolean(SPOTIFY_CLIENT_SECRET),
      SPOTIFY_REDIRECT_URI: SPOTIFY_REDIRECT_URI ?? null,
    },
    paths: {
      cwd: process.cwd(),
      __dirname,
      distFromTsx,
      distFromCompiled,
      distFromTsxHasIndexHtml: aHtml,
      distFromCompiledHasIndexHtml: bHtml,
    },
  });
};
app.get('/api/diagnostics', diagnostics);

// --- API routes ---
app.use('/api/spotify', spotifyRouter);

// --- static + SPA fallback (Express 5-safe) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_A = path.resolve(__dirname, '..', 'dist');        // tsx layout
const DIST_B = path.resolve(__dirname, '..', '..', 'dist');  // compiled layout
const DIST = fs.existsSync(path.join(DIST_A, 'index.html')) ? DIST_A : DIST_B;

app.use(express.static(DIST));

// IMPORTANT: use middleware fallback, not `app.get('*', ...)` (Express 5 + path-to-regexp v6)
const spaFallback: RequestHandler = (req, res) => {
  if (req.path.startsWith('/api/')) return void res.status(404).end();
  res.sendFile(path.join(DIST, 'index.html'));
};
app.use(spaFallback); // ← catch-all without wildcard pattern

// --- errors ---
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  void _next;
  const message = err instanceof Error ? err.message : String(err);
  console.error('❗ API Error:', message);
  res.status(500).json({ error: { message } });
});

// basic env sanity (fail fast if missing)
function must(name: string, v?: string) { if (!v) throw new Error(`Missing env: ${name}`); }
must('SPOTIFY_CLIENT_ID', SPOTIFY_CLIENT_ID);
must('SPOTIFY_CLIENT_SECRET', SPOTIFY_CLIENT_SECRET);
must('SPOTIFY_REDIRECT_URI', SPOTIFY_REDIRECT_URI);

app.listen(Number(PORT), () =>
  console.log(`✅ Listening on http://localhost:${PORT} (${NODE_ENV})`),
);
