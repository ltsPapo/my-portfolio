import 'dotenv/config';
import express, { type RequestHandler, type NextFunction, type Request, type Response } from 'express';
import cors, { type CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import spotifyRouter from './routes/spotify.js';

const app = express();
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

const { ORIGIN = 'http://127.0.0.1:5173', PORT = process.env.PORT || '3001',
  SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env;

app.use(cookieParser());
app.use(express.json());
const corsOptions: CorsOptions = { origin: ORIGIN, credentials: true };
app.use(cors(corsOptions));

const healthz: RequestHandler = (_req, res) => res.json({ ok: true });
app.get('/healthz', healthz);

app.use('/api/spotify', spotifyRouter);

// serve Vite output
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distA = path.resolve(__dirname, '..', 'dist');       // tsx path
const distB = path.resolve(__dirname, '..', '..', 'dist'); // compiled path
const DIST = fs.existsSync(path.join(distA, 'index.html')) ? distA : distB;

app.use(express.static(DIST));
const spaFallback: RequestHandler = (req, res) => {
  if (req.path.startsWith('/api/')) return void res.status(404).end();
  res.sendFile(path.join(DIST, 'index.html'));
};
app.get('*', spaFallback);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  void _next;
  const msg = err instanceof Error ? err.message : String(err);
  console.error('❗ API Error:', msg);
  res.status(500).json({ error: { message: msg } });
});

function must(name: string, v?: string) { if (!v) throw new Error(`Missing env: ${name}`); }
must('SPOTIFY_CLIENT_ID', SPOTIFY_CLIENT_ID);
must('SPOTIFY_CLIENT_SECRET', SPOTIFY_CLIENT_SECRET);
must('SPOTIFY_REDIRECT_URI', SPOTIFY_REDIRECT_URI);

app.listen(Number(PORT), () => console.log(`✅ Listening on http://localhost:${PORT}`));