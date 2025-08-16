import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import spotifyRouter from './routes/spotify.js';

const app = express();
const { NODE_ENV = 'development', PORT = '3001', ORIGIN = 'http://127.0.0.1:5173',
  SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env;

function requireEnv(name: string, val?: string) { if (!val) throw new Error(`Missing env: ${name}`); return val; }

process.on('unhandledRejection', (r) => console.error('UnhandledRejection', r));
process.on('uncaughtException', (e) => console.error('UncaughtException', e));

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: ORIGIN, credentials: true }));

app.get('/healthz', (_req: Request, res: Response) => res.json({ ok: true }));
app.get('/api/diagnostics', (_req, res) => res.json({
  nodeEnv: NODE_ENV,
  origin: ORIGIN,
  redirectUri: SPOTIFY_REDIRECT_URI,
  hasClientId: !!SPOTIFY_CLIENT_ID,
  hasClientSecret: !!SPOTIFY_CLIENT_SECRET,
}));

app.use('/api/spotify', spotifyRouter);

// error middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❗ API Error:', err?.message || err);
  res.status(typeof err?.status === 'number' ? err.status : 500).json({ error: { message: err?.message || 'Internal Server Error' } });
});

(async () => {
  requireEnv('SPOTIFY_CLIENT_ID', SPOTIFY_CLIENT_ID);
  requireEnv('SPOTIFY_CLIENT_SECRET', SPOTIFY_CLIENT_SECRET);
  requireEnv('SPOTIFY_REDIRECT_URI', SPOTIFY_REDIRECT_URI);
  app.listen(Number(PORT), () => console.log(`⚡ Express listening on http://127.0.0.1:${PORT}`));
})();
