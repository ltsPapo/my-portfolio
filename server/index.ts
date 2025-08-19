import 'dotenv/config';
import express, { type RequestHandler, type NextFunction, type Request, type Response } from 'express';
import cors, { type CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import spotifyRouter from './routes/spotify.js'; // tsx resolves .js -> .ts in dev; compiled uses .js

const app = express();
const {
  NODE_ENV = 'development',
  PORT = process.env.PORT || '3001',
  ORIGIN = 'http://127.0.0.1:5173',
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} = process.env;

// Behind Render’s proxy, enable secure cookies.
if (NODE_ENV === 'production') app.set('trust proxy', 1);

process.on('unhandledRejection', (r) => console.error('UnhandledRejection', r));
process.on('uncaughtException', (e) => console.error('UncaughtException', e));

app.use(cookieParser());
app.use(express.json());

// CORS (typed to avoid Express v5 overload confusion)
const corsOptions: CorsOptions = { origin: ORIGIN, credentials: true };
app.use(cors(corsOptions));

// Health
const healthz: RequestHandler = (_req, res) => res.json({ ok: true });
app.get('/healthz', healthz);

// ---- Diagnostics (no secrets) ----
const diagnostics: RequestHandler = (_req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // If running compiled: dist/server/index.js is near __dirname
  const distA = path.resolve(__dirname, '..', 'dist');        // when running via tsx (src/server -> ../dist)
  const distB = path.resolve(__dirname, '..', '..', 'dist');  // when running compiled (dist/server -> ../../dist)

  const aHtml = fs.existsSync(path.join(distA, 'index.html'));
  const bHtml = fs.existsSync(path.join(distB, 'index.html'));

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
      distA,
      distB,
      distAHasIndexHtml: aHtml,
      distBHasIndexHtml: bHtml,
      compiledServerExpectedAt: path.resolve(__dirname, 'index.js'),
    },
  });
};
app.get('/api/diagnostics', diagnostics);

// API routes
app.use('/api/spotify', spotifyRouter);

// Static client (Vite build). Support both tsx-run and compiled-run layouts.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distFromTsx = path.resolve(__dirname, '..', 'dist');        // src/server -> ../dist
const distFromCompiled = path.resolve(__dirname, '..', '..', 'dist'); // dist/server -> ../../dist
const DIST = fs.existsSync(path.join(distFromTsx, 'index.html')) ? distFromTsx : distFromCompiled;

app.use(express.static(DIST));

// SPA fallback (exclude /api/*)
const spaFallback: RequestHandler = (req, res) => {
  if (req.path.startsWith('/api/')) return void res.status(404).end();
  res.sendFile(path.join(DIST, 'index.html'));
};
app.get('*', spaFallback);

// Error middleware
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  void _next;
  const message = err instanceof Error ? err.message : String(err);
  console.error('❗ API Error:', message);
  res.status(500).json({ error: { message } });
});

// Basic env guards (don’t crash early on Render preview; comment if you prefer)
function must(name: string, v?: string) { if (!v) throw new Error(`Missing env: ${name}`); }
must('SPOTIFY_CLIENT_ID', SPOTIFY_CLIENT_ID);
must('SPOTIFY_CLIENT_SECRET', SPOTIFY_CLIENT_SECRET);
must('SPOTIFY_REDIRECT_URI', SPOTIFY_REDIRECT_URI);

// Boot
app.listen(Number(PORT), () => {
  console.log(`✅ Listening on http://localhost:${PORT} (${NODE_ENV})`);
});
