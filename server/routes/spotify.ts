import { Router, type RequestHandler } from 'express';
import crypto from 'node:crypto';
import {
  ensureAccessToken,
  setAccessCookies,
  spotifyGet,
  tokenExchange,
  type SpotifyUser,
} from '../spotifyClient.js';

const router = Router();

const cookieOpts = (maxAgeSec: number) => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: maxAgeSec * 1000,
});

const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// --- response types (minimal, only what we read) ---
type Image = { url: string };
type Artist = { name: string };
type ExternalUrls = { spotify: string };
type Album = { name: string; images?: Image[] };
type Track = {
  id: string;
  name: string;
  duration_ms: number;
  external_urls: ExternalUrls;
  artists: Artist[];
  album: Album;
};

type CurrentlyPlaying = {
  is_playing: boolean;
  progress_ms: number;
  item: Track | null;
} | null;

type TopTracksResponse = { items: Track[] };

// --- routes ---
const login: RequestHandler = (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  res.cookie('spotify_oauth_state', state, cookieOpts(600));

  const url = new URL('https://accounts.spotify.com/authorize');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', process.env.SPOTIFY_CLIENT_ID!);
  url.searchParams.set(
    'scope',
    process.env.SPOTIFY_SCOPES ??
      'user-read-currently-playing user-read-playback-state user-top-read',
  );
  url.searchParams.set('redirect_uri', process.env.SPOTIFY_REDIRECT_URI!);
  url.searchParams.set('state', state);

  if (req.query.debug === '1') {
    res.json({
      authorizeUrl: url.toString(),
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
      clientIdLast8: process.env.SPOTIFY_CLIENT_ID?.slice(-8),
    });
    return;
  }
  res.redirect(url.toString());
};

const callback: RequestHandler = async (req, res) => {
  const { code, state } = req.query as { code?: string; state?: string };
  const expected = req.cookies['spotify_oauth_state'];
  if (!code || !state || !expected || state !== expected) {
    res.redirect(
      `${process.env.FRONTEND_BASE_URL ?? 'http://127.0.0.1:5173'}/music?error=state`,
    );
    return;
  }
  res.clearCookie('spotify_oauth_state');

  const token = await tokenExchange({
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
  });

  setAccessCookies(res, token.access_token, token.refresh_token!, token.expires_in);
  res.redirect(
    `${process.env.FRONTEND_BASE_URL ?? 'http://127.0.0.1:5173'}/music?from=spotify`,
  );
};

const logout: RequestHandler = (_req, res) => {
  res.clearCookie('sp_access', { path: '/' });
  res.clearCookie('sp_access_exp', { path: '/' });
  res.clearCookie('sp_refresh', { path: '/' });
  res.status(204).end();
};

const me: RequestHandler = async (req, res) => {
  const token = await ensureAccessToken(req, res);
  if (!token) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  const user = await spotifyGet<SpotifyUser>(token, '/v1/me');
  if (!user) {
    res.status(204).end();
    return;
  }
  res.json({
    id: user.id,
    display_name: user.display_name,
    followers: user.followers?.total ?? null,
    image: user.images?.[0]?.url ?? null,
    external_url: user.external_urls?.spotify ?? null,
  });
};

const nowPlaying: RequestHandler = async (req, res) => {
  const token = await ensureAccessToken(req, res);
  if (!token) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  const data = await spotifyGet<CurrentlyPlaying>(
    token,
    '/v1/me/player/currently-playing',
  );
  if (!data || !data?.item) {
    res.json({ isPlaying: false });
    return;
  }
  const t = data.item;
  res.json({
    isPlaying: data.is_playing,
    progressMs: data.progress_ms,
    durationMs: t.duration_ms,
    track: {
      id: t.id,
      name: t.name,
      url: t.external_urls.spotify,
      artists: t.artists.map((a) => a.name),
      album: t.album.name,
      albumImageUrl: t.album.images?.[0]?.url ?? null,
    },
  });
};

const topTracks: RequestHandler = async (req, res) => {
  const token = await ensureAccessToken(req, res);
  if (!token) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  const range = (req.query.range as string) ?? 'short_term';
  const data = await spotifyGet<TopTracksResponse>(
    token,
    `/v1/me/top/tracks?time_range=${encodeURIComponent(range)}&limit=12`,
  );
  if (!data) {
    res.json({ tracks: [] });
    return;
  }
  res.json({
    tracks: data.items.map((t) => ({
      id: t.id,
      name: t.name,
      url: t.external_urls.spotify,
      artists: t.artists.map((a) => a.name),
      albumImageUrl: t.album.images?.[0]?.url ?? null,
    })),
  });
};

router.get('/login', login);
router.get('/callback', asyncHandler(callback));
router.post('/logout', logout);
router.get('/me', asyncHandler(me));
router.get('/now-playing', asyncHandler(nowPlaying));
router.get('/top-tracks', asyncHandler(topTracks));

export default router;
