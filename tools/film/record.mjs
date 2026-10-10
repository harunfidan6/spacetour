// Tanıtım filmini kare kare kaydeder ve MP4'e çevirir (bkz. docs/video-motoru/SARTNAME.md).
// Kullanım:  npm run build            (bir kez; çekim production derlemesiyle yapılır)
//            npm run film             → dikey + yatay, video/spacetour-tanitim-{dikey,yatay}.mp4
//            npm run film -- v        → yalnız dikey
//            SNAP="1,5,12" npm run film -- v   → video yerine o saniyelerden kontrol karesi (video/_kontrol/)
//            node tools/film/miks.mjs  → görüntüyü yeniden çekmeden yalnızca sesi yeniden kur
// Sunucu: `next start` 3100'de açık değilse betik kendisi açar. Çekim sayfası /film/... yalnızca bu betiğin
// küçük vekil sunucusunda (3500) var; sitenin kendisinde böyle bir rota yoktur (production'da /film kapalı).
// Gerekenler: Chrome (CHROME_PATH) ve PATH'te ffmpeg.
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mixAudio, mux, VF, COLOR } from './miks.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../..');
const OUT = path.join(ROOT, 'video');
const NEXT = process.env.NEXT_URL || 'http://localhost:3100';
const PORT = Number(process.env.FILM_PORT || 3500);
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
// Sitenin saati: gökyüzü, Ay evresi ve geri sayımlar her çekimde aynı çıksın (İstanbul, 3 Ekim 2026 21:30)
const EPOCH = Date.parse(process.env.FILM_EPOCH || '2026-10-03T21:30:00+03:00');
const FPS = Number(process.env.FPS || 60);
const FORMATS = { v: { w: 540, h: 960, name: 'dikey' }, h: { w: 960, h: 540, name: 'yatay' } };
const only = (process.argv[2] || 'v,h').split(',');
// Senaryolar. veri: dış API'lerin çekimde yerine geçen sabit yanıtları (canlı veri her çekimde değişmesin)
const SCENES = {
  tanitim: {
    dur: 30, out: 'spacetour-tanitim',
    veri: { 'https://api.wheretheiss.at/v1/satellites/25544': 'iss.json' },
  },
  // Yalnızca astroloji bölümü
  astroloji: { dur: 30, out: 'spacetour-astroloji', veri: {} },
  // Günlük Reels: yeni ana sayfa ve o günün gökyüzü (21 sn)
  gunluk: { dur: 21, out: 'spacetour-gunluk', veri: {} },
  // "Bu gece gökyüzü" Reels: siteden bağımsız hareketli grafik (24 sn)
  gece: { dur: 24, out: 'spacetour-gece', veri: {} },
};
const SCENE = process.argv[3] || 'tanitim', SC = SCENES[SCENE];
if (!SC) throw new Error(`Bilinmeyen senaryo: ${SCENE} (${Object.keys(SCENES).join(', ')})`);
const DUR = Number(process.env.SURE || SC.dur);
const SHIM = `window.__filmEpoch=${EPOCH};\n` + fs.readFileSync(path.join(DIR, 'time-shim.js'), 'utf8');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ffmpeg = (args, stdin) => {
  const p = spawn('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: [stdin ? 'pipe' : 'ignore', 'ignore', 'inherit'] });
  p.done = new Promise((res, rej) => p.on('close', (c) => (c ? rej(new Error(`ffmpeg çıkış kodu ${c}`)) : res())));
  return p;
};

/* ---------- next start (gerekirse) ---------- */
const up = () => new Promise((res) => http.get(NEXT, (r) => { r.resume(); res(r.statusCode < 500); }).on('error', () => res(false)));
let nextProc = null;
if (!(await up())) {
  if (!fs.existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) throw new Error('Önce `npm run build` çalıştırın.');
  console.log('▶ next start', NEXT);
  nextProc = spawn(`npx next start -p ${new URL(NEXT).port || 3100}`, { cwd: ROOT, shell: true, stdio: 'ignore' });
  for (let i = 0; i < 120 && !(await up()); i++) await sleep(500);
  if (!(await up())) throw new Error('next start açılmadı.');
}

/* ---------- Vekil sunucu: /film/* bu klasörden, gerisi Next'e ---------- */
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname.startsWith('/film/')) {
    const THREE_DIR = path.join(ROOT, 'node_modules/three/build');
    let file = u.pathname === '/film/_gsap.js'
      ? path.join(ROOT, 'node_modules/gsap/dist/gsap.min.js')
      : u.pathname.startsWith('/film/_three/')
        ? path.join(THREE_DIR, path.basename(decodeURIComponent(u.pathname)))
        : path.join(DIR, decodeURIComponent(u.pathname.slice('/film/'.length)));
    if (!file.startsWith(DIR) && !file.startsWith(THREE_DIR) && !file.endsWith('gsap.min.js')) { res.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    fs.createReadStream(file).pipe(res);
    return;
  }
  const target = new URL(req.url, NEXT);
  const p = http.request(target, { method: req.method, headers: { ...req.headers, host: target.host } }, (r) => { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
  p.on('error', () => { if (!res.headersSent) res.writeHead(502); res.end(); });
  req.pipe(p);
});
await new Promise((r) => server.listen(PORT, r));
const BASE = `http://localhost:${PORT}`;

fs.mkdirSync(OUT, { recursive: true });
try {
  for (const key of only) {
    const F = FORMATS[key];
    if (!F) continue;
    console.log(`\n▶ ${F.name}: ${F.w * 2}x${F.h * 2}, ${FPS} fps, ${DUR} sn`);
    const browser = await puppeteer.launch({
      executablePath: CHROME, headless: true, protocolTimeout: 180000,
      // FILM_GL=swiftshader: GPU'suz Linux/bulut makinelerinde yazılımsal WebGL
      args: [...(process.env.FILM_GL === 'swiftshader' ? ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist']), '--hide-scrollbars', '--mute-audio', '--autoplay-policy=user-gesture-required'],
      defaultViewport: { width: F.w, height: F.h, deviceScaleFactor: 2 },
    });
    try {
      const page = await browser.newPage();
      page.on('pageerror', (e) => console.log('  [sayfa hatası]', e.message));
      page.on('console', (m) => { if (m.type() === 'error') console.log('  [konsol]', m.text().slice(0, 300)); });
      await page.evaluateOnNewDocument(SHIM);
      // Canlı veri yerine sabit yanıt; analytics çekimde hiçbir yere gitmez
      await page.setRequestInterception(true);
      page.on('request', (r) => {
        const url = r.url(), fx = Object.keys(SC.veri || {}).find((k) => url.startsWith(k));
        if (fx) return r.respond({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(path.join(DIR, SCENE, 'veri', SC.veri[fx])) });
        if (/\/_vercel\/|\/api\/analytics\//.test(url)) return r.respond({ status: 204, body: '' });
        return r.continue();
      });
      await page.goto(`${BASE}/film/${SCENE}/?fmt=${key}`, { waitUntil: 'load', timeout: 90000 });

      // Isınma: sanal saati ilerlet; sayfalar, görseller, 3D ve veriler hazır olana dek bekle (gerçek 10 ms aralıkla)
      let ready = false, last = '';
      for (let i = 0; i < 12000 && !ready; i++) {
        const [ok, st] = await page.evaluate(() => { window.__advance(1000 / 60); return [!!window.__filmReady, window.__filmDurum || '']; });
        ready = ok;
        if (st !== last) { console.log('  ·', st); last = st; }
        if (st.startsWith('HATA')) throw new Error(st);
        await sleep(10);
      }
      if (!ready) throw new Error(`Çekim sayfası hazır olmadı (${last}).`);

      // Kontrol modu: SNAP="1,6.5,12" → video yerine o saniyelerden kare
      if (process.env.SNAP) {
        const dir = path.join(OUT, '_kontrol', SCENE); fs.mkdirSync(dir, { recursive: true });
        await page.evaluate(() => { window.__filmStart(); });
        let f = 0;
        for (const target of process.env.SNAP.split(',').map(Number).sort((a, b) => a - b)) {
          const tf = Math.round(target * FPS);
          while (f < tf) {
            await page.evaluate((dt) => window.__advance(dt), 1000 / FPS); f++;
            if (f % 6 === 0) await page.screenshot({ type: 'jpeg', quality: 10 }); // tarayıcı kareleri işlesin
          }
          const file = path.join(dir, `${key}-${target.toFixed(2).padStart(5, '0')}.jpg`);
          fs.writeFileSync(file, await page.screenshot({ type: 'jpeg', quality: 88 }));
          console.log('  kare:', path.relative(ROOT, file));
        }
        continue;
      }

      const GDIR = path.join(OUT, '_goruntu'); fs.mkdirSync(GDIR, { recursive: true });
      const tmp = path.join(GDIR, `${SCENE}-${key}.mp4`);
      const enc = ffmpeg(['-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
        '-vf', VF, ...COLOR, '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-movflags', '+faststart', tmp], true);
      await page.evaluate(() => { window.__filmStart(); });
      const total = Math.round(FPS * DUR), t0 = Date.now();
      for (let f = 0; f < total; f++) {
        const jpg = await page.screenshot({ type: 'jpeg', quality: 95, optimizeForSpeed: true });
        if (!enc.stdin.write(jpg)) await new Promise((r) => enc.stdin.once('drain', r));
        await page.evaluate((dt) => window.__advance(dt), 1000 / FPS);
        if (f % FPS === 0 && f) {
          const left = Math.round(((Date.now() - t0) / f) * (total - f) / 1000);
          process.stdout.write(`  %${Math.round((f / total) * 100)}  ${f / FPS}/${DUR} sn  kalan ~${left} sn   \r`);
        }
      }
      enc.stdin.end(); await enc.done;
      const events = await page.evaluate(() => window.__sfx);
      const meta = await page.evaluate(() => window.__filmMeta || {});
      fs.writeFileSync(path.join(GDIR, `${SCENE}-olaylar.json`), JSON.stringify({ dur: DUR, meta, sfx: events }, null, 1));
      const wav = path.join(GDIR, `${SCENE}-ses.wav`);
      if (!fs.existsSync(wav) || process.env.SES_YENILE !== '0') {
        console.log('\n  ' + mixAudio({ scene: SCENE, events, dur: DUR, meta, out: wav }).join('\n  '));
      }
      const final = path.join(OUT, `${SC.out}-${F.name}.mp4`);
      mux(tmp, wav, final);
      console.log(`\n  ✓ ${path.relative(ROOT, final)}  (${Math.round((Date.now() - t0) / 1000)} sn)`);
    } finally {
      await browser.close();
    }
  }
} finally {
  server.close();
  if (nextProc) {
    try {
      if (process.platform === 'win32') spawn('taskkill', ['/pid', String(nextProc.pid), '/T', '/F']);
      else nextProc.kill();
    } catch {}
  }
}
