import type { Request, Response } from 'express';
import fetch from 'node-fetch';

const isProd = () => process.env.NODE_ENV === 'production';

const cookieBase = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: isProd(),
  path: '/',
};

function requireEnv(name: string, val?: string) {
  if (!val) throw new Error(`Missing env: ${name}`);
  return val;
}

function b64Creds(): string {
  return Buffer.from(
    `${requireEnv('SPOTIFY_CLIENT_ID', process.env.SPOTIFY_CLIENT_ID)}:${requireEnv(
      'SPOTIFY_CLIENT_SECRET',
      process.env.SPOTIFY_CLIENT_SECRET,
    )}`,
  ).toString('base64');
}

export type SpotifyUser = {
  id: string;
  display_name: string;
  followers?: { total: number };
  external_urls?: { spotify?: string };
  images?: { url: string }[];
};

export type TokenResponse = {
  access_token: string;
  token_type: 'Bearer';
  scope: string;
  expires_in: number;
  refresh_token?: string;
};

export async function tokenExchange(body: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${b64Creds()}` },
    body: new URLSearchParams(body).toString(),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }
  return (await res.json()) as TokenResponse;
}

export function setAccessCookies(res: Response, access: string, refresh: string, expiresInSec: number): void {
  const exp = Math.floor(Date.now() / 1000) + expiresInSec;
  res.cookie('sp_access', access, { ...cookieBase, maxAge: expiresInSec * 1000 });
  res.cookie('sp_access_exp', String(exp), { ...cookieBase, maxAge: expiresInSec * 1000 });
  res.cookie('sp_refresh', refresh, { ...cookieBase, maxAge: 30 * 24 * 60 * 60 * 1000 });
}

export async function ensureAccessToken(req: Request, res: Response): Promise<string | null> {
  const access = req.cookies['sp_access'] as string | undefined;
  const refresh = req.cookies['sp_refresh'] as string | undefined;
  const exp = Number(req.cookies['sp_access_exp'] ?? '0');
  const now = Math.floor(Date.now() / 1000);

  if (access && now < exp - 15) return access;
  if (!refresh) return null;

  try {
    const token = await tokenExchange({ grant_type: 'refresh_token', refresh_token: refresh });
    const newExp = Math.floor(Date.now() / 1000) + token.expires_in;
    res.cookie('sp_access', token.access_token, { ...cookieBase, maxAge: token.expires_in * 1000 });
    res.cookie('sp_access_exp', String(newExp), { ...cookieBase, maxAge: token.expires_in * 1000 });
    if (token.refresh_token) {
      res.cookie('sp_refresh', token.refresh_token, { ...cookieBase, maxAge: 30 * 24 * 60 * 60 * 1000 });
    }
    return token.access_token;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('⚠️ refresh failed:', msg);
    return null;
  }
}

export async function spotifyGet<T>(accessToken: string, endpoint: string): Promise<T | null> {
  const res = await fetch(`https://api.spotify.com${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 204) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Spotify API ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}