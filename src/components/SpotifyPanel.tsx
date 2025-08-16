import React, { useEffect, useMemo, useState } from 'react';
import { getMe, getNowPlaying, getTopTracks } from '../api/spotify';

type Me = { display_name: string; followers?: number; image?: string | null; external_url?: string };
type Now = {
  isPlaying: boolean;
  progressMs?: number | null;
  durationMs?: number | null;
  track?: { name: string; url: string; artists: string[]; album: string; albumImageUrl?: string | null } | null;
} | null;
type Track = { id: string; name: string; url: string; artists: string[]; albumImageUrl?: string | null };

const ranges = [
  { key: 'short_term', label: 'Last 4 weeks' },
  { key: 'medium_term', label: 'Last 6 months' },
  { key: 'long_term', label: 'All time' },
] as const;

export default function SpotifyPanel() {
  const [me, setMe] = useState<Me | null>(null);
  const [now, setNow] = useState<Now>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [range, setRange] = useState<(typeof ranges)[number]['key']>('short_term');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const authed = useMemo(() => err !== 'UNAUTHORIZED', [err]);

  async function loadAll(selectedRange = range) {
    setLoading(true);
    setErr(null);
    try {
      const [m, n, t] = await Promise.all([getMe(), getNowPlaying(), getTopTracks(selectedRange)]);
      setMe({
        display_name: m.display_name,
        followers: m.followers,
        image: m.image,
        external_url: m.external_url,
      });
      setNow(
        n
          ? {
              isPlaying: n.isPlaying ?? n.is_playing,
              progressMs: n.progressMs ?? n.progress_ms ?? null,
              durationMs: n.durationMs ?? n.item?.duration_ms ?? null,
              track: n.track
                ? n.track
                : n.item
                ? {
                    name: n.item.name,
                    url: n.item.external_urls?.spotify,
                    artists: (n.item.artists ?? []).map((a: any) => a.name),
                    album: n.item.album?.name,
                    albumImageUrl: n.item.album?.images?.[0]?.url ?? null,
                  }
                : null,
            }
          : null,
      );
      const items = t.tracks ?? t.items ?? [];
      setTracks(
        items.map((x: any) => ({
          id: x.id,
          name: x.name,
          url: x.url ?? x.external_urls?.spotify,
          artists: x.artists?.map((a: any) => a.name) ?? x.artists ?? [],
          albumImageUrl: x.albumImageUrl ?? x.album?.images?.[0]?.url ?? null,
        })),
      );
    } catch (e: any) {
      if (String(e?.message) === '401') setErr('UNAUTHORIZED');
      else setErr(e?.message ?? 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    const t = setInterval(async () => {
      try {
        const n = await getNowPlaying();
        setNow(
          n
            ? {
                isPlaying: n.isPlaying ?? n.is_playing,
                progressMs: n.progressMs ?? n.progress_ms ?? null,
                durationMs: n.durationMs ?? n.item?.duration_ms ?? null,
                track: n.track
                  ? n.track
                  : n.item
                  ? {
                      name: n.item.name,
                      url: n.item.external_urls?.spotify,
                      artists: (n.item.artists ?? []).map((a: any) => a.name),
                      album: n.item.album?.name,
                      albumImageUrl: n.item.album?.images?.[0]?.url ?? null,
                    }
                  : null,
              }
            : null,
        );
      } catch {
        /* WHY: polling failures shouldn't break UI */
      }
    }, 15000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const t = await getTopTracks(range);
        const items = t.tracks ?? t.items ?? [];
        setTracks(
          items.map((x: any) => ({
            id: x.id,
            name: x.name,
            url: x.url ?? x.external_urls?.spotify,
            artists: x.artists?.map((a: any) => a.name) ?? x.artists ?? [],
            albumImageUrl: x.albumImageUrl ?? x.album?.images?.[0]?.url ?? null,
          })),
        );
      } catch {
        /* WHY: passive update; stale data is acceptable */
      }
    })();
  }, [range]);

  if (!authed) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Connect your Spotify</h1>
          <p style={{ opacity: 0.8, marginBottom: 16 }}>
            Authorize to show your profile, now playing, and top tracks.
          </p>
          <a
            href="/api/spotify/login"
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 12 }}
          >
            Connect Spotify
          </a>
        </div>
      </div>
    );
  }

  const meFollowers = me?.followers ?? 0;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {me?.image ? (
            <img
              src={me.image}
              alt="pfp"
              style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : null}
          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{me?.display_name ?? 'Spotify'}</div>
            {meFollowers ? <div style={{ fontSize: 12, opacity: 0.7 }}>{meFollowers} followers</div> : null}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <form action="/api/spotify/logout" method="post">
            <button
              style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: 10, fontSize: 12 }}
            >
              Disconnect
            </button>
          </form>
          <a
            href={me?.external_url ?? 'https://open.spotify.com/'}
            target="_blank"
            rel="noreferrer"
            style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: 10, fontSize: 12 }}
          >
            Open on Spotify
          </a>
        </div>
      </header>

      {/* Now Playing + Range */}
      <section style={{ display: 'grid', gap: 16, gridTemplateColumns: '2fr 1fr', marginBottom: 16 }}>
        <div style={{ border: '1px solid #eee', borderRadius: 16, padding: 16 }}>
          <h2 style={{ marginBottom: 8 }}>Now Playing</h2>
          {loading ? (
            <div style={{ height: 100, border: '1px dashed #ddd', borderRadius: 12 }} />
          ) : now?.isPlaying && now?.track ? (
            <div style={{ display: 'flex', gap: 12 }}>
              {now.track.albumImageUrl ? (
                <img
                  src={now.track.albumImageUrl}
                  alt="album"
                  style={{ width: 96, height: 96, borderRadius: 12, objectFit: 'cover' }}
                />
              ) : null}
              <div style={{ flex: 1 }}>
                <a
                  href={now.track.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 18, fontWeight: 600 }}
                >
                  {now.track.name}
                </a>
                <div style={{ opacity: 0.8, fontSize: 14 }}>{now.track.artists.join(', ')}</div>
                <div style={{ opacity: 0.6, fontSize: 12, marginTop: 4 }}>{now.track.album}</div>
                {now.durationMs != null && now.progressMs != null ? (
                  <div style={{ marginTop: 8, height: 8, borderRadius: 999, background: '#0001' }}>
                    <div
                      style={{
                        height: 8,
                        borderRadius: 999,
                        background: '#0006',
                        width: `${(now.progressMs / Math.max(1, now.durationMs)) * 100}%`,
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div style={{ opacity: 0.7, fontSize: 14 }}>Not playing anything right now.</div>
          )}
        </div>

        <div style={{ border: '1px solid #eee', borderRadius: 16, padding: 16 }}>
          <h2 style={{ marginBottom: 8 }}>Time Range</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ranges.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                style={{
                  padding: '6px 10px',
                  border: '1px solid #ddd',
                  borderRadius: 10,
                  fontSize: 12,
                  opacity: range === r.key ? 1 : 0.6,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Top Tracks */}
      <section style={{ border: '1px solid #eee', borderRadius: 16, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <h2>Top Tracks</h2>
          <span style={{ fontSize: 12, opacity: 0.6 }}>{range.replace('_', ' ')}</span>
        </div>
        <ol
          style={{
            display: 'grid',
            gap: 8,
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          }}
        >
          {tracks.map((t, i) => (
            <li
              key={t.id}
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                border: '1px solid #eee',
                borderRadius: 12,
                padding: 10,
              }}
            >
              {t.albumImageUrl ? (
                <img
                  src={t.albumImageUrl}
                  alt="cover"
                  style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }}
                />
              ) : null}
              <div style={{ minWidth: 0, flex: 1 }}>
                <a
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontWeight: 600 }}
                >
                  {i + 1}. {t.name}
                </a>
                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.7,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {/* WHY: artist names can overflow */}
                </div>
              </div>
              <a
                href={t.url}
                target="_blank"
                rel="noreferrer"
                style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: 8, fontSize: 12 }}
              >
                Play
              </a>
            </li>
          ))}
        </ol>
      </section>

      {err && err !== 'UNAUTHORIZED' ? (
        <div style={{ color: '#b00', fontSize: 12, marginTop: 8 }}>{err}</div>
      ) : null}
    </div>
  );
}