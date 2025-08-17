import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';
import * as THREE from 'three';
import MusicBackgroundModel from './MusicBackgroundModel';
import { getMe, getNowPlaying, getTopTracks } from '../api/spotify';

function AnimatedCamera({
  focus,
  targetPosition,
  targetLookAt,
}: {
  focus: boolean;
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
}) {
  const { camera, mouse } = useThree();
  const { animatedPosition } = useSpring({
    animatedPosition: focus ? targetPosition : [0, 2, 5],
    config: { mass: 1, tension: 170, friction: 26 },
  });

  const offsetX = useRef(0);
  const offsetY = useRef(0);

  useFrame(() => {
    const base = animatedPosition.get();
    if (!focus) {
      const smoothing = 0.05;
      const targetX = mouse.x * 0.5;
      const targetY = mouse.y * 0.4;
      offsetX.current += (targetX - offsetX.current) * smoothing;
      offsetY.current += (targetY - offsetY.current) * smoothing;
      camera.position.set(base[0] + offsetX.current, base[1] + offsetY.current, base[2]);
      camera.lookAt(0, 1, 0);
    } else {
      for (let i = 0; i < 3; i++) camera.position.setComponent(i, base[i]);
      camera.lookAt(new THREE.Vector3(...targetLookAt));
    }
  });

  return null;
}

// ---- Typed Spotify shapes (minimal fields used) ----
type ApiImage = { url: string };
type ApiExternalUrls = { spotify?: string };
type ApiArtist = { name: string };
type ApiAlbum = { name?: string; images?: ApiImage[] };
type ApiTrack = {
  id: string;
  name: string;
  duration_ms?: number;
  external_urls?: ApiExternalUrls;
  artists?: ApiArtist[];
  album?: ApiAlbum;
};
type ApiTopTracks = { items: ApiTrack[] };
type ApiCurrentlyPlaying =
  | {
      is_playing: boolean;
      progress_ms: number | null;
      item: ApiTrack | null;
    }
  | null;

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

function Progress({ value }: { value: number }) {
  return (
    <div className="mt-3 h-2 w-full rounded-full bg-white/20">
      <div className="h-2 rounded-full bg-white/80" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function mapApiTrack(x: ApiTrack): Track {
  return {
    id: x.id,
    name: x.name,
    url: x.external_urls?.spotify ?? '',
    artists: (x.artists ?? []).map((a) => a.name),
    albumImageUrl: x.album?.images?.[0]?.url ?? null,
  };
}

const MusicPage: React.FC = () => {
  const [focusOnComputer, setFocusOnComputer] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const [targetPosition, setTargetPosition] = useState<[number, number, number]>([0, 2, 5]);
  const [targetLookAt, setTargetLookAt] = useState<[number, number, number]>([0, 1, 0]);

  const [me, setMe] = useState<Me | null>(null);
  const [now, setNow] = useState<Now>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [range, setRange] = useState<(typeof ranges)[number]['key']>('short_term');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const authed = useMemo(() => err !== 'UNAUTHORIZED', [err]);

  const loadAll = useCallback(async (selectedRange = range) => {
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

      // map currently-playing
      const mappedNow: Now =
        n && (n.isPlaying ?? n.is_playing)
          ? {
              isPlaying: n.isPlaying ?? n.is_playing,
              progressMs: n.progressMs ?? n.progress_ms ?? null,
              durationMs:
                n.durationMs ??
                (n.item && typeof n.item.duration_ms === 'number' ? n.item.duration_ms : null),
              track:
                n.track ??
                (n.item
                  ? {
                      name: n.item.name,
                      url: n.item.external_urls?.spotify ?? '',
                      artists: (n.item.artists ?? []).map((a: ApiArtist) => a.name),
                      album: n.item.album?.name ?? '',
                      albumImageUrl: n.item.album?.images?.[0]?.url ?? null,
                    }
                  : null),
            }
          : n
          ? { isPlaying: false }
          : null;
      setNow(mappedNow);

      // map top-tracks
      const items: ApiTrack[] =
        Array.isArray(t?.tracks) ? (t.tracks as ApiTrack[]) : ((t?.items ?? []) as ApiTrack[]);
      setTracks(items.map(mapApiTrack));
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === '401') setErr('UNAUTHORIZED');
      else setErr(msg);
    } finally {
      setLoading(false);
    }
  }, [range]);

  // Fade trigger
  useEffect(() => {
    if (focusOnComputer) {
      const t = setTimeout(() => setFadeOut(true), 800);
      return () => clearTimeout(t);
    }
    setFadeOut(false);
  }, [focusOnComputer]);

  // Load when overlay shown
  useEffect(() => {
    if (fadeOut) loadAll();
  }, [fadeOut, loadAll]);

  // Poll now-playing while overlay visible
  useEffect(() => {
    if (!fadeOut) return;
    const i = setInterval(async () => {
      try {
        const n = await getNowPlaying();
        const mapped: Now =
          n && (n.isPlaying ?? n.is_playing)
            ? {
                isPlaying: n.isPlaying ?? n.is_playing,
                progressMs: n.progressMs ?? n.progress_ms ?? null,
                durationMs:
                  n.durationMs ??
                  (n.item && typeof n.item.duration_ms === 'number' ? n.item.duration_ms : null),
                track:
                  n.track ??
                  (n.item
                    ? {
                        name: n.item.name,
                        url: n.item.external_urls?.spotify ?? '',
                        artists: (n.item.artists ?? []).map((a: ApiArtist) => a.name),
                        album: n.item.album?.name ?? '',
                        albumImageUrl: n.item.album?.images?.[0]?.url ?? null,
                      }
                    : null),
              }
            : n
            ? { isPlaying: false }
            : null;
        setNow(mapped);
      } catch {
        /* ignore */
      }
    }, 15000);
    return () => clearInterval(i);
  }, [fadeOut]);

  // Update top tracks when range changes and overlay visible
  useEffect(() => {
    if (!fadeOut) return;
    (async () => {
      try {
        const t: ApiTopTracks | { tracks: ApiTrack[] } = await getTopTracks(range);
        const items: ApiTrack[] =
          'tracks' in t ? (t.tracks as ApiTrack[]) : ((t.items ?? []) as ApiTrack[]);
        setTracks(items.map(mapApiTrack));
      } catch {
        /* ignore */
      }
    })();
  }, [range, fadeOut]);

  const handleComputerMeshReady = (mesh: THREE.Mesh) => {
    setTimeout(() => {
      const compPos = mesh.getWorldPosition(new THREE.Vector3());
      const cameraOffset = new THREE.Vector3(0, 0, 0.95);
      const elevatedPos = compPos.clone().add(cameraOffset);
      setTargetPosition([elevatedPos.x, elevatedPos.y, elevatedPos.z]);
      setTargetLookAt([compPos.x, compPos.y + 0.2, compPos.z]);
    }, 100);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} />
          <AnimatedCamera focus={focusOnComputer} targetPosition={targetPosition} targetLookAt={targetLookAt} />
          <MusicBackgroundModel
            onComputerClick={() => setFocusOnComputer(true)}
            onComputerMeshReady={handleComputerMeshReady}
          />
        </Suspense>
      </Canvas>

      {focusOnComputer && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className={`w-full h-full transition-opacity duration-700 ease-in-out ${fadeOut ? 'opacity-100 bg-black' : 'opacity-0'}`} />
        </div>
      )}

      {fadeOut && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="bg-black/70 text-white p-6 rounded-lg max-w-3xl w-[92%] pointer-events-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {me?.image && <img src={me.image} alt="pfp" className="h-10 w-10 rounded-full object-cover" />}
                <div>
                  <h2 className="text-lg font-semibold">{me?.display_name ?? 'Spotify'}</h2>
                  {me?.followers ? <p className="text-xs opacity-70">{me.followers} followers</p> : null}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <form action="/api/spotify/logout" method="post">
                  <button className="px-3 py-1 border rounded-md text-xs">Disconnect</button>
                </form>
                <a href={me?.external_url ?? 'https://open.spotify.com/'} target="_blank" rel="noreferrer" className="px-3 py-1 border rounded-md text-xs">
                  Open on Spotify
                </a>
              </div>
            </div>

            {!authed ? (
              <div className="text-center py-10">
                <h3 className="text-xl font-bold mb-2">Connect your Spotify</h3>
                <p className="text-sm opacity-80 mb-4">Authorize to show your profile, now playing, and top tracks.</p>
                <a href="/api/spotify/login" className="px-4 py-2 border rounded-lg">Connect Spotify</a>
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <div className="md:col-span-2 border border-white/15 rounded-xl p-4">
                    <h3 className="font-medium mb-3">Now Playing</h3>
                    {loading ? (
                      <div className="h-24 rounded-lg border border-white/10 animate-pulse" />
                    ) : now?.isPlaying && now?.track ? (
                      <div className="flex gap-4">
                        {now.track.albumImageUrl && <img src={now.track.albumImageUrl} alt="album" className="h-20 w-20 rounded-lg object-cover" />}
                        <div className="flex-1">
                          <a href={now.track.url} target="_blank" rel="noreferrer" className="text-base font-semibold hover:underline">
                            {now.track.name}
                          </a>
                          <p className="opacity-80 text-sm">{now.track.artists.join(', ')}</p>
                          <p className="opacity-60 text-xs mt-1">{now.track.album}</p>
                          {now.durationMs != null && now.progressMs != null ? (
                            <Progress value={(now.progressMs / Math.max(1, now.durationMs)) * 100} />
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <div className="opacity-70 text-sm">Not playing anything right now.</div>
                    )}
                  </div>

                  <div className="border border-white/15 rounded-xl p-4">
                    <h3 className="font-medium mb-3">Time Range</h3>
                    <div className="flex flex-wrap gap-2">
                      {ranges.map((r) => (
                        <button key={r.key} onClick={() => setRange(r.key)} className={`px-3 py-1.5 rounded-lg border text-xs ${range === r.key ? 'opacity-100' : 'opacity-70'}`}>
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border border-white/15 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Top Tracks</h3>
                    <span className="text-xs opacity-60">{range.replace('_', ' ')}</span>
                  </div>
                  <ol className="grid gap-3 md:grid-cols-2">
                    {tracks.map((t, i) => (
                      <li key={t.id} className="flex items-center gap-3 rounded-lg border border-white/10 p-3">
                        {t.albumImageUrl && <img src={t.albumImageUrl} alt="cover" className="h-12 w-12 rounded-md object-cover" />}
                        <div className="min-w-0 flex-1">
                          <a href={t.url} target="_blank" rel="noreferrer" className="font-medium truncate hover:underline">
                            {i + 1}. {t.name}
                          </a>
                        </div>
                        <a href={t.url} target="_blank" rel="noreferrer" className="px-2 py-1 rounded-md border text-xs">Play</a>
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            )}

            {err && err !== 'UNAUTHORIZED' ? <p className="text-xs text-red-400 mt-3">{err}</p> : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPage;