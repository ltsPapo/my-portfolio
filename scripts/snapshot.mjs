// scripts/snapshot-full.mjs
// Usage: node scripts/snapshot-full.mjs --out snapshot-full.json
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const ROOT = process.cwd();
const args = Object.fromEntries(
  process.argv.slice(2).map(a => (a.startsWith('--') ? a.slice(2).split('=') : [a, 'true'])),
);
const outPath = path.resolve(args.out || 'snapshot-full.json');

const EXIST = p => { try { fs.accessSync(p); return true; } catch { return false; } };
const READ = p => fs.readFileSync(p, 'utf8');
const TRYJSON = s => { try { return JSON.parse(s); } catch { return null; } };

function listTree(dir, depth = 2) {
  function walk(d, level) {
    if (level < 0) return [];
    let out = [];
    for (const name of fs.readdirSync(d)) {
      if (name === 'node_modules' || name === '.git') continue;
      const fp = path.join(d, name);
      let st; try { st = fs.statSync(fp); } catch { continue; }
      if (st.isDirectory()) out.push({ name, type: 'dir', children: walk(fp, level - 1) });
      else out.push({ name, type: 'file' });
    }
    return out;
  }
  return EXIST(dir) ? walk(dir, depth) : null;
}

function grepRoutes(dir) {
  const out = [];
  function scan(d) {
    if (!EXIST(d)) return;
    for (const name of fs.readdirSync(d)) {
      const fp = path.join(d, name);
      let st; try { st = fs.statSync(fp); } catch { continue; }
      if (st.isDirectory()) { scan(fp); continue; }
      if (!/\.(ts|js|mjs|cjs)$/.test(name)) continue;
      let src = ''; try { src = READ(fp); } catch { continue; }
      const matches = [
        ...src.matchAll(/app\.(get|post|put|delete|patch)\(\s*['"`]([^'"`]+)['"`]/g),
        ...src.matchAll(/router\.(get|post|put|delete|patch)\(\s*['"`]([^'"`]+)['"`]/g),
      ];
      if (matches.length) {
        out.push({
          file: path.relative(ROOT, fp).replace(/\\/g, '/'),
          routes: matches.map(m => ({ method: m[1].toUpperCase(), path: m[2] })),
        });
      }
    }
  }
  scan(dir);
  return out;
}

function envKeys(files = ['.env', '.env.local', '.env.development', '.env.production']) {
  files = files.filter(EXIST);
  const keys = new Set();
  const linesPer = {};
  for (const f of files) {
    const txt = READ(f);
    const lines = txt.split(/\r?\n/);
    linesPer[f] = lines.slice(0, 80); // preview only
    for (const line of lines) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=/);
      if (m) keys.add(m[1]);
    }
  }
  return { files, keys: [...keys].sort(), preview: linesPer };
}

function readIfExists(file) {
  if (!EXIST(file)) return null;
  const txt = READ(file);
  // strip very long lines
  return txt.length > 50000 ? txt.slice(0, 50000) + '\n/*…truncated…*/' : txt;
}

// Whitelist of files we care about the content of (if present)
const contentWhitelist = [
  'package.json',
  'vite.config.ts',
  'vite.config.js',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'src/main.tsx',
  'src/api/spotify.ts',
  'server/index.ts',
  'dev-server.mjs',
];

// Also include server routes recursively
function readServerRoutes() {
  const results = {};
  function scan(d) {
    if (!EXIST(d)) return;
    for (const name of fs.readdirSync(d)) {
      const fp = path.join(d, name);
      let st; try { st = fs.statSync(fp); } catch { continue; }
      if (st.isDirectory()) { scan(fp); continue; }
      if (!/\.(ts|js|mjs)$/.test(name)) continue;
      results[path.relative(ROOT, fp).replace(/\\/g, '/')] = readIfExists(fp);
    }
  }
  scan(path.join(ROOT, 'server', 'routes'));
  return results;
}

// ---- Collect ----
const pkg = EXIST('package.json') ? TRYJSON(READ('package.json')) : null;
const files = Object.fromEntries(
  contentWhitelist
    .filter(EXIST)
    .map(f => [f, readIfExists(f)]),
);
const serverRoutesFiles = readServerRoutes();

const viteConfig = files['vite.config.ts'] || files['vite.config.js'] || '';
const viteHasApiProxy = /['"`]\/api['"`]\s*:\s*{[^}]*target\s*:\s*['"`]http:\/\/localhost:3001['"`]/s.test(viteConfig);

const hasServerIndex = EXIST('server/index.ts');
const redirectUriLine = (files['.env'] || '').split(/\r?\n/).find(l => l.startsWith('SPOTIFY_REDIRECT_URI=')) || '';
const redirectUriValue = redirectUriLine.split('=')[1]?.trim() || '';
const redirectUsesLocalhost = /localhost/.test(redirectUriValue);
const redirectUses127 = /127\.0\.0\.1/.test(redirectUriValue);

const checks = {
  hasServerIndex,
  viteHasApiProxy,
  redirectUri: redirectUriValue || null,
  redirectUriUsesLocalhost: redirectUsesLocalhost,
  redirectUriUses127001: redirectUses127,
};

// ---- Output ----
const out = {
  system: { platform: os.platform(), release: os.release(), node: process.version },
  summary: {
    hasServerIndex,
    viteHasApiProxy,
    advice: [
      !hasServerIndex ? 'Create server/index.ts (Express) or switch to PKCE-only auth.' : null,
      !viteHasApiProxy ? 'Add Vite dev proxy /api → http://localhost:3001.' : null,
      redirectUsesLocalhost ? 'Switch SPOTIFY_REDIRECT_URI to 127.0.0.1 (Spotify disallows localhost).' : null,
    ].filter(Boolean),
  },
  tree: {
    root: listTree(ROOT, 1),
    server: listTree('server', 3),
    src: listTree('src', 3),
  },
  routes: grepRoutes('server'),
  env: envKeys(),
  files: {
    ...files,
    ...serverRoutesFiles,
  },
  checks,
};

fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.error(`Snapshot written: ${outPath}`);
