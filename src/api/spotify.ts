export async function getMe() {
  const r = await fetch('/api/spotify/me', { credentials: 'include' });
  if (r.status === 401) throw new Error('401');
  if (!r.ok) throw new Error(`me ${r.status}`);
  return r.json();
}
export async function getNowPlaying() {
  const r = await fetch('/api/spotify/now-playing', { credentials: 'include' });
  if (r.status === 204) return null;
  if (r.status === 401) throw new Error('401');
  if (!r.ok) throw new Error(`now-playing ${r.status}`);
  return r.json();
}
export async function getTopTracks(range: 'short_term' | 'medium_term' | 'long_term' = 'short_term') {
  const r = await fetch(`/api/spotify/top-tracks?range=${range}`, { credentials: 'include' });
  if (r.status === 401) throw new Error('401');
  if (!r.ok) throw new Error(`top-tracks ${r.status}`);
  return r.json();
}
