// Tanıtım filmini kare kare kaydeder ve MP4'e çevirir.
// Kullanım (sunucu açıkken):  npm run film                 → ilk film (kapak patlıyor), dikey + yatay
//                             npm run film -- v            → sadece dikey
//                             npm run film -- v,h retro    → retro TV reklamı (seslendirme + müzik, bkz. miks.mjs)
// Gerekenler: Chrome (CHROME_PATH ile değiştirilebilir) ve PATH'te ffmpeg.
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderSfx } from './sfx.mjs';
import { mixAudio, mux } from './miks.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../..');
const OUT = path.join(ROOT, 'video');
const BASE = process.env.FILM_URL || `http://localhost:${process.env.PORT || 3500}`;
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const FPS = Number(process.env.FPS || 60), DUR = 30;
const FORMATS = { v: { w: 540, h: 960, name: 'dikey' }, h: { w: 960, h: 540, name: 'yatay' } };
const only = (process.argv[2] || 'v,h').split(',');
// Senaryolar: kapak = ilk film (yalnız efekt), retro = seslendirmeli TV reklamı (görüntü video/_goruntu'da saklanır, ses sonradan değişebilir)
const SCENES = { kapak: { page: '/film/', out: 'nese-tanitim' }, retro: { page: '/film/retro/', out: 'nese-retro', mix: true } };
const SCENE = process.argv[3] || 'kapak', SC = SCENES[SCENE];
if (!SC) throw new Error(`Bilinmeyen senaryo: ${SCENE} (${Object.keys(SCENES).join(', ')})`);
const SHIM = fs.readFileSync(path.join(DIR, 'time-shim.js'), 'utf8');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ffmpeg = (args, stdin) => {
  const p = spawn('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: [stdin ? 'pipe' : 'ignore', 'ignore', 'inherit'] });
  p.done = new Promise((res, rej) => p.on('close', (c) => (c ? rej(new Error(`ffmpeg çıkış kodu ${c}`)) : res())));
  return p;
};

fs.mkdirSync(OUT, { recursive: true });
for (const key of only) {
  const F = FORMATS[key];
  if (!F) continue;
  console.log(`\n▶ ${F.name}: ${F.w * 2}x${F.h * 2}, ${FPS} fps, ${DUR} sn`);
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: true, protocolTimeout: 90000,
    args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars', '--mute-audio'],
    defaultViewport: { width: F.w, height: F.h, deviceScaleFactor: 2 },
  });
  try {
    const page = await browser.newPage();
    page.on('pageerror', (e) => console.log('  [sayfa hatası]', e.message));
    page.on('console', (m) => { if (m.type() === 'error') console.log('  [konsol]', m.text()); });
    await page.evaluateOnNewDocument(SHIM);
    await page.goto(`${BASE}${SC.page}?fmt=${key}`, { waitUntil: 'load', timeout: 60000 });

    // Isınma: sanal saati ilerlet; 3D şişe, site ve görseller hazır olana dek bekle
    let ready = false;
    for (let i = 0; i < 3000 && !ready; i++) {
      ready = await page.evaluate(() => { window.__advance(1000 / 60); return !!window.__filmReady; });
      await sleep(10);
    }
    if (!ready) throw new Error('Çekim sayfası hazır olmadı (3D veya site yüklenemedi).');
    console.log('  sahne hazır');

    // Kontrol modu: SNAP="1,6.5,12" → video yerine o saniyelerden kare (video/_kontrol/)
    if (process.env.SNAP) {
      const dir = path.join(OUT, '_kontrol', SCENE); fs.mkdirSync(dir, { recursive: true });
      await page.evaluate(() => { window.__filmStart(); });
      let t = 0;
      for (const target of process.env.SNAP.split(',').map(Number).sort((a, b) => a - b)) {
        while (t + 1e-6 < target) {
          await page.evaluate((dt) => window.__advance(dt), 1000 / FPS); t += 1 / FPS;
          if (Math.round(t * FPS) % 12 === 0) await page.screenshot({ type: 'jpeg', quality: 10 }); // tarayıcı kareyi işlesin
        }
        console.log('  t =', t.toFixed(2));
        const file = path.join(dir, `${key}-${target.toFixed(1).padStart(4, '0')}.jpg`);
        fs.writeFileSync(file, await page.screenshot({ type: 'jpeg', quality: 85 }));
        console.log('  kare:', path.relative(ROOT, file));
      }
      continue;
    }

    const GDIR = path.join(OUT, '_goruntu'); fs.mkdirSync(GDIR, { recursive: true });
    const tmp = SC.mix ? path.join(GDIR, `${SCENE}-${key}.mp4`) : path.join(OUT, `_${key}.mp4`);
    const enc = ffmpeg(['-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', tmp], true);
    await page.evaluate(() => { window.__filmStart(); });
    const total = FPS * DUR, t0 = Date.now();
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
    const final = path.join(OUT, `${SC.out}-${F.name}.mp4`);
    if (SC.mix) { // görüntü saklanır; ses: efekt + müzik + seslendirme (sonradan: node tools/film/miks.mjs retro)
      const cut = await page.evaluate(() => window.__filmMeta && window.__filmMeta.cut);
      fs.writeFileSync(path.join(GDIR, `${SCENE}-olaylar.json`), JSON.stringify({ dur: DUR, cut, sfx: events }, null, 1));
      const wav = path.join(GDIR, `${SCENE}-ses.wav`);
      console.log('\n  ' + mixAudio({ scene: SCENE, events, dur: DUR, out: wav, cut }).join('\n  '));
      mux(tmp, wav, final);
    } else {
      const wav = path.join(OUT, '_sfx.wav');
      renderSfx(events, DUR, wav);
      await ffmpeg(['-i', tmp, '-i', wav, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final]).done;
      fs.rmSync(tmp); fs.rmSync(wav);
    }
    console.log(`\n  ✓ ${path.relative(ROOT, final)}  (${Math.round((Date.now() - t0) / 1000)} sn)`);
  } finally {
    await browser.close();
  }
}
