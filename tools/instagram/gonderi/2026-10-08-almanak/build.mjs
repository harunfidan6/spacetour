// "Gök Almanağı" — krem kâğıt üstüne eski gazete / gök almanağı sayfası, Instagram gönderisi 1080×1350.
//   node build.mjs          → out.html + out.png
//   node build.mjs debug    → 1080×1080 ızgara kırpımını ve güvenli alanı çizer (out-debug.png)
// Veri: sitenin src/lib/astrophysics/skyTonight.ts hesabı, İstanbul, 8 → 9 Ekim 2026 gecesi.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(DIR, '../../cikti/gonderi');
fs.mkdirSync(OUT_DIR, { recursive: true });
const debug = process.argv[2] === 'debug';

const PAPER = '#efe6d1';
const INK = '#1e1a14';
const RED = '#c63d1b';

// ---------- Logo: sitenin logoSmallSvg geometrisi, tek renk mürekkep + kırmızı uydu ----------
const LOGO = fs
  .readFileSync(path.join(DIR, 'logo.svg'), 'utf8')
  .replace(/<radialGradient[\s\S]*?<\/linearGradient>/, '')
  .replace('fill="url(#gpl)"', `fill="${INK}"`)
  .replace(/stroke="url\(#gring\)" stroke-width="4" clip-path="url\(#gback\)"/, `stroke="${INK}" stroke-width="4" clip-path="url(#gback)"`)
  .replace(
    /<ellipse cx="32" cy="32" rx="27" ry="7" fill="none" stroke="url\(#gring\)" stroke-width="4" clip-path="url\(#gfront\)"\/>/,
    `<ellipse cx="32" cy="32" rx="27" ry="7" fill="none" stroke="${PAPER}" stroke-width="9" clip-path="url(#gfront)"/><ellipse cx="32" cy="32" rx="27" ry="7" fill="none" stroke="${INK}" stroke-width="4" clip-path="url(#gfront)"/>`,
  )
  .replace('#38bdf8', RED);

// ---------- Gravür: prosedürel Satürn levhası ----------
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f1 = (n) => n.toFixed(1);

// Bir eğri boyunca kalınlığı değişen çizgi (bakır kalem gibi şişen/incelen) → dolu poligon
function taper(pts, widths) {
  if (pts.length < 2) return '';
  const top = [], bot = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0];
    const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
    const w = widths[i] / 2;
    top.push(`${f1(pts[i][0] + nx * w)},${f1(pts[i][1] + ny * w)}`);
    bot.push(`${f1(pts[i][0] - nx * w)},${f1(pts[i][1] - ny * w)}`);
  }
  return `M${top.join('L')}L${bot.reverse().join('L')}Z`;
}

function engraving(W, H) {
  const rnd = mulberry32(1987);
  const cx = W / 2, cy = H / 2 + 4;
  const R = 101;                      // ekvator yarıçapı (px)
  const Rp = R * 0.9;                 // kutup yarıçapı (basıklık)
  const B = (17 * Math.PI) / 180;     // halka açıklığı (üsluplaştırılmış)
  const ROT = -13;                    // levhadaki eğim (derece)
  const sB = Math.sin(B), cB = Math.cos(B);
  const Ry = Math.sqrt(Rp * Rp * cB * cB + R * R * sB * sB);
  const rot = (x, y) => {
    const t = (ROT * Math.PI) / 180;
    return [cx + x * Math.cos(t) - y * Math.sin(t), cy + x * Math.sin(t) + y * Math.cos(t)];
  };

  // Gök: yatay kazıma çizgileri; gezegenin çevresinde incelir (hale), köşelerde kalınlaşır
  let sky = '';
  for (let y = 2; y < H; y += 3.3) {
    const pts = [], ws = [];
    for (let x = -2; x <= W + 2; x += 5) {
      const dx = (x - cx) / (W * 0.62), dy = (y - cy) / (H * 0.62);
      const d = Math.min(1, Math.hypot(dx, dy));
      const glow = Math.exp(-((x - cx) ** 2 / (2 * 150 ** 2) + (y - cy) ** 2 / (2 * 70 ** 2)));
      pts.push([x, y + (rnd() - 0.5) * 0.25]);
      ws.push(Math.max(0.35, 1.35 + 1.25 * d * d - 0.75 * glow));
    }
    sky += taper(pts, ws);
  }

  // Yıldızlar: kazımanın içinden kâğıt rengiyle açılmış noktalar, parlaklarda dört ışın
  let stars = '';
  let placed = 0, guard = 0;
  while (placed < 46 && guard++ < 2000) {
    const x = 8 + rnd() * (W - 16), y = 8 + rnd() * (H - 16);
    // halka sisteminin çevresinde yıldız olmasın
    const t = (-ROT * Math.PI) / 180;
    const lx = (x - cx) * Math.cos(t) - (y - cy) * Math.sin(t);
    const ly = (x - cx) * Math.sin(t) + (y - cy) * Math.cos(t);
    if ((lx / (2.5 * R)) ** 2 + (ly / (Ry * 1.25)) ** 2 < 1) continue;
    const m = rnd();
    const r = m > 0.93 ? 2.4 : m > 0.75 ? 1.6 : 1.0;
    stars += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r + 1.3}" fill="${INK}" opacity=".0"/>`;
    stars += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${PAPER}"/>`;
    if (r > 2) {
      const L = 9 + rnd() * 4;
      stars += `<path d="M${f1(x - L)} ${f1(y)}H${f1(x + L)}M${f1(x)} ${f1(y - L)}V${f1(y + L)}" stroke="${PAPER}" stroke-width=".9"/>`;
    }
    placed++;
  }

  // Halkalar (yerel düzlem): r birimi R
  const ringPts = (r) => {
    const pts = [], ws = [];
    for (let a = 0; a <= 360; a += 3) {
      const l = (a * Math.PI) / 180;
      pts.push([r * Math.sin(l), r * Math.cos(l) * sB]);
      ws.push(Math.abs(Math.sin(l)) ** 3);
    }
    return [pts, ws];
  };
  const ellipsePath = (r) => {
    const ry = r * sB;
    return `M${-r},0A${r},${ry} 0 1 0 ${r},0A${r},${ry} 0 1 0 ${-r},0Z`;
  };
  const annulus = (r1, r2) => `${ellipsePath(r2 * R)}${ellipsePath(r1 * R)}`;
  const ringLines = (r1, r2, step, w0, w1) => {
    let d = '';
    for (let r = r1 * R + step / 2; r < r2 * R; r += step) {
      const [pts, ws] = ringPts(r);
      d += taper(pts, ws.map((k) => w0 + w1 * k));
    }
    return d;
  };
  const edge = (r, w) => `<path d="${ellipsePath(r * R)}" fill="none" stroke="${INK}" stroke-width="${w}"/>`;
  const rings = () => `
    <path d="${annulus(1.24, 1.53)}" fill="${PAPER}" fill-rule="evenodd"/>
    <path d="${annulus(1.53, 1.95)}" fill="${PAPER}" fill-rule="evenodd"/>
    <path d="${annulus(2.03, 2.27)}" fill="${PAPER}" fill-rule="evenodd"/>
    <path d="${ringLines(1.24, 1.53, 2.6, 0.9, 0.9)}" fill="${INK}"/>
    <path d="${ringLines(1.53, 1.95, 4.6, 0.35, 0.95)}" fill="${INK}"/>
    <path d="${ringLines(2.03, 2.27, 3.4, 0.6, 1.0)}" fill="${INK}"/>
    ${edge(1.24, 0.8)}${edge(1.53, 1.1)}${edge(1.95, 1.2)}${edge(2.03, 1.0)}${edge(2.21, 1.3)}${edge(2.27, 1.9)}`;

  // Gezegen: enlem çizgileri (görünen yay), kenara doğru kalınlaşır; kuşaklar daha koyu
  const band = (deg) => {
    const a = Math.abs(deg);
    if (a < 7) return 0.45;
    if (a < 20) return 1.35;
    if (a < 32) return 0.8;
    if (a < 48) return 1.05;
    if (a < 62) return 1.25;
    return 1.55;
  };
  let globe = '';
  const N = 46;
  for (let i = 1; i < N; i++) {
    const s = -1 + (2 * i) / N;
    const phi = Math.asin(s);
    const cp = Math.cos(phi);
    const runs = [];
    let cur = [];
    for (let a = -180; a <= 180; a += 2.5) {
      const l = (a * Math.PI) / 180;
      const depth = Rp * s * sB + R * cp * Math.cos(l) * cB;
      if (depth > 0) {
        const x = R * cp * Math.sin(l);
        const y = -(Rp * s * cB - R * cp * Math.cos(l) * sB);
        cur.push([x, y]);
      } else if (cur.length) { runs.push(cur); cur = []; }
    }
    if (cur.length) runs.push(cur);
    if (runs.length > 1 && runs[0][0] && runs[runs.length - 1].length) {
      // −180 ve +180'de görünürse iki ucu birleştir
      const first = runs[0][0], lastRun = runs[runs.length - 1], last = lastRun[lastRun.length - 1];
      if (Math.hypot(first[0] - last[0], first[1] - last[1]) < 3) {
        runs[0] = lastRun.concat(runs[0]);
        runs.pop();
      }
    }
    if (phi > (58 * Math.PI) / 180) continue; // kuzey kutup başlığı çapraz taramayla doldurulur
    const k = band((phi * 180) / Math.PI);
    for (const run of runs) {
      const ws = run.map(([x, y]) => {
        const e = Math.min(1, Math.hypot(x / R, y / Ry));
        return k * (0.35 + 1.9 * e ** 7);
      });
      globe += taper(run, ws);
    }
  }

  // Kenar kararması: diskin iki yanında boylam boyunca kısa tarama (çapraz kazıma)
  let limb = '';
  for (const side of [-1, 1]) {
    for (let dl = 58; dl <= 88; dl += 3.2) {
      const l = (side * dl * Math.PI) / 180;
      const pts = [], ws = [];
      for (let pd = -78; pd <= 78; pd += 2) {
        const ph = (pd * Math.PI) / 180;
        const sp = Math.sin(ph), cpp = Math.cos(ph);
        const depth = Rp * sp * sB + R * cpp * Math.cos(l) * cB;
        if (depth <= 0) continue;
        const x = R * cpp * Math.sin(l);
        const y = -(Rp * sp * cB - R * cpp * Math.cos(l) * sB);
        pts.push([x, y]);
        const e = Math.min(1, Math.hypot(x / R, y / Ry));
        ws.push(0.15 + 1.5 * Math.max(0, (e - 0.72) / 0.28) ** 1.6);
      }
      limb += taper(pts, ws);
    }
  }
  // Kutup başlığı: ince çapraz tarama (Satürn’ün koyu kutbu)
  const capPts = [];
  for (let a = 0; a <= 360; a += 4) {
    const l = (a * Math.PI) / 180, ph = (60 * Math.PI) / 180;
    capPts.push([R * Math.cos(ph) * Math.sin(l), -(Rp * Math.sin(ph) * cB - R * Math.cos(ph) * Math.cos(l) * sB)]);
  }
  let capHatch = '';
  for (let k = -140; k <= 140; k += 3.4) capHatch += `M${k - 60},${-Ry - 10}L${k + 60},${-Ry + 90}`;

  const g = `<g transform="translate(${cx} ${cy}) rotate(${ROT})">
    ${rings()}
    <ellipse rx="${R}" ry="${f1(Ry)}" fill="${PAPER}"/>
    <defs><clipPath id="disc"><ellipse rx="${R}" ry="${f1(Ry)}"/></clipPath>
      <clipPath id="cap"><path d="M${capPts.map((q) => q.map(f1).join(',')).join('L')}Z"/></clipPath></defs>
    <path d="${globe}" fill="${INK}"/>
    <g clip-path="url(#disc)"><path d="${limb}" fill="${INK}"/>
      <g clip-path="url(#cap)"><path d="${capHatch}" stroke="${INK}" stroke-width=".9" fill="none"/></g></g>
    <ellipse rx="${R}" ry="${f1(Ry)}" fill="none" stroke="${INK}" stroke-width="2"/>
    <g clip-path="url(#front)">${rings()}</g>
  </g>`;

  return `<svg class="plate-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><clipPath id="front" clipPathUnits="userSpaceOnUse"><rect x="-400" y="0" width="800" height="400"/></clipPath></defs>
  <path d="${sky}" fill="${INK}"/>
  ${stars}
  ${g}
</svg>`;
}

// ---------- Sayfa ----------
const PLATE_W = 588, PLATE_H = 336;
const PLATE = engraving(PLATE_W, PLATE_H);

// Saat çizelgesi: [saat, olay, ayrıntı, satürn mü]
const TIMES = [
  ['18.34', 'Gün batımı', '', false],
  ['19.10', 'Satürn sahneye çıkar', '', true],
  ['20.10', 'Tam karanlık başlar', '', false],
  ['00.40', 'Satürn en iyi konumda', 'güneyde, 51° yükseklikte', true],
  ['01.50', 'Mars görünür', 'Yengeç’te, +1,1 kadir', false],
  ['03.00', 'Jüpiter görünür', 'Aslan’da, −1,9 kadir; en parlak gezegen', false],
  ['05.30', 'Tam karanlık biter', '', false],
  ['05.42', 'Ay doğar', 'karanlık bittikten sonra, 9 Ekim', false],
  ['06.10', 'Satürn sahneden iner', '', true],
  ['06.40', 'Mars ve Jüpiter en iyi', 'güneydoğuda, 59° ve 46°', false],
  ['07.08', 'Gün doğumu', '', false],
];
const timeRows = TIMES.map(([t, ev, det, sat]) => `
  <div class="trow${sat ? ' sat' : ''}">
    <div class="tline"><span class="ev">${ev}</span><span class="dots"></span><span class="tm${/\d/.test(t) ? '' : ' word'}">${t}</span></div>
    ${det ? `<div class="det">${det}</div>` : ''}
  </div>`).join('');

const fontsCss = fs.readFileSync(path.join(DIR, 'fonts/fonts.css'), 'utf8').replace(/url\(([^)]+)\)/g, (m, u) => `url(${pathToFileURL(path.join(DIR, 'fonts', u)).href})`);

const html = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8">
<style>
${fontsCss}
:root { --paper: ${PAPER}; --ink: ${INK}; --red: ${RED}; --soft: #5a4f42; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1080px; height: 1350px; background: var(--paper); }
body { position: relative; overflow: hidden; color: var(--ink); font-family: 'EB Garamond', serif; font-kerning: normal; -webkit-font-smoothing: antialiased; }

/* kâğıt dokusu */
.paper { position: absolute; inset: 0; z-index: 50; pointer-events: none; mix-blend-mode: multiply; }
.vignette { position: absolute; inset: 0; z-index: 49; pointer-events: none;
  background: radial-gradient(ellipse 75% 70% at 50% 46%, rgba(0,0,0,0) 55%, rgba(120,84,40,.16) 100%); }

.frame { position: absolute; inset: 26px; border: 2.5px solid var(--ink); }
.frame::after { content: ''; position: absolute; inset: 5px; border: 1px solid var(--ink); }

.page { position: absolute; left: 56px; right: 56px; top: 44px; bottom: 44px; display: flex; flex-direction: column; }

/* üst: künye + kulaklar */
.mast { display: grid; grid-template-columns: 200px 1fr 200px; align-items: center; height: 84px; }
.ear { display: flex; flex-direction: column; gap: 2px; font-size: 17px; line-height: 1.15; }
.ear.l { align-items: flex-start; }
.ear.r { align-items: flex-end; text-align: right; }
.cap { font-family: 'EB Garamond'; font-weight: 600; font-size: 15px; letter-spacing: .16em; text-transform: none; }
.ear .it { font-style: italic; font-size: 19px; color: var(--soft); }
.brand { display: flex; align-items: center; gap: 8px; font-family: 'Playfair Display'; font-weight: 700; font-size: 21px; letter-spacing: .005em; }
.brand svg { width: 34px; height: 34px; }
.nameplate { filter: url(#ink); text-align: center; font-family: 'Playfair Display'; font-weight: 900; font-size: 80px; line-height: 1; letter-spacing: -.005em; white-space: nowrap; }
.nameplate .orn { display: inline-block; vertical-align: middle; margin: 0 14px; transform: translateY(-6px); }

.dbl { height: 7px; border-top: 3px solid var(--ink); border-bottom: 1px solid var(--ink); }
.dateline { display: flex; justify-content: space-between; align-items: center; height: 38px; font-size: 17px; letter-spacing: .14em; font-weight: 600; border-bottom: 1px solid var(--ink); }
.dateline .mid { font-style: italic; font-weight: 500; font-size: 21px; letter-spacing: .01em; }

/* manşet */
.kicker { margin-top: 22px; text-align: center; color: var(--red); font-weight: 600; font-size: 19px; letter-spacing: .26em; }
.kicker::before, .kicker::after { content: ''; display: inline-block; width: 64px; height: 1px; background: var(--red); vertical-align: middle; margin: 0 18px 4px; }
.head { filter: url(#ink); margin-top: 10px; font-family: 'Playfair Display'; font-weight: 900; line-height: .9; letter-spacing: -.012em; }
.head .ln { display: block; white-space: nowrap; text-align: center; }
.deck { margin: 16px auto 0; width: 900px; text-align: center; font-style: italic; font-size: 30px; line-height: 1.22; }
.deck b { font-style: normal; font-weight: 600; }

.rule { height: 1px; background: var(--ink); }

/* gövde: levha + çizelge */
.body { display: grid; grid-template-columns: ${PLATE_W}px 1fr; column-gap: 0; margin-top: 22px; border-top: 1px solid var(--ink); flex: 1; min-height: 0; }
.left { padding: 18px 26px 0 0; border-right: 1px solid var(--ink); display: flex; flex-direction: column; }
.plate { position: relative; border: 2px solid var(--ink); padding: 4px; width: ${PLATE_W}px; }
.plate::after { content: ''; position: absolute; inset: 3px; border: .8px solid var(--ink); pointer-events: none; }
.plate-svg { display: block; width: calc(${PLATE_W}px - 12px); height: auto; }
.caption { margin-top: 10px; font-size: 19.5px; line-height: 1.25; text-align: justify; hyphens: none; }
.caption .cap { color: var(--red); font-size: 16px; margin-right: 6px; }
.briefs { flex: 1; margin-top: 12px; display: grid; grid-template-columns: 1.28fr 1fr; border-top: 1px solid var(--ink); }
.brief { padding-top: 10px; font-size: 21px; line-height: 1.22; }
.brief + .brief { border-left: 1px solid var(--ink); padding-left: 18px; }
.brief:first-child { padding-right: 18px; }
.brief h3 { font-family: 'Playfair Display'; font-weight: 900; font-size: 25px; line-height: 1; margin-bottom: 6px; }
.brief .drop { float: left; font-family: 'Playfair Display'; font-weight: 900; font-size: 50px; line-height: .82; margin: 4px 6px 0 0; color: var(--red); }

.right { padding: 14px 0 0 24px; display: flex; flex-direction: column; }
.right h2 { font-family: 'Playfair Display'; font-weight: 900; font-size: 30px; line-height: 1; text-align: center; }
.right .sub { text-align: center; font-style: italic; font-size: 18px; color: var(--soft); margin: 2px 0 6px; padding-bottom: 7px; border-bottom: 1px solid var(--ink); }
.table { position: relative; padding-left: 34px; }
.trow { padding: 4px 0 4px; }
.tline { display: flex; align-items: baseline; font-size: 23px; line-height: 1.1; }
.ev { white-space: nowrap; }
.dots { flex: 1; margin: 0 5px; border-bottom: 2px dotted rgba(30,26,20,.55); transform: translateY(-5px); min-width: 10px; }
.tm { font-family: 'EB Garamond'; font-weight: 700; font-variant-numeric: lining-nums tabular-nums; font-size: 23.5px; }
.tm.word { font-style: italic; font-weight: 500; }
.det { font-style: italic; font-size: 20px; color: #43392d; line-height: 1.1; margin-top: 1px; }
.trow.sat .ev, .trow.sat .tm { color: var(--red); }
.bracket { position: absolute; left: 19px; width: 9px; border: 2px solid var(--red); border-right: 0; }
.bracket span { position: absolute; right: 100%; margin-right: 3px; top: 50%; transform: translateY(-50%) rotate(180deg); writing-mode: vertical-rl; white-space: nowrap; font-size: 15px; line-height: 1; letter-spacing: .24em; font-weight: 700; color: var(--red); }

/* alt şerit + künye */
.next { display: flex; align-items: center; gap: 16px; height: 50px; border-top: 3px solid var(--ink); border-bottom: 1px solid var(--ink); margin-top: 14px; font-size: 22px; }
.next .cap { color: var(--red); font-size: 16px; white-space: nowrap; }
.next .txt { flex: 1; white-space: nowrap; }
.next .txt b { font-family: 'Playfair Display'; font-weight: 700; word-spacing: .12em; letter-spacing: .01em; }
.foot { display: flex; justify-content: space-between; align-items: center; height: 44px; font-size: 16px; letter-spacing: .02em; }
.foot .brand { font-size: 19px; }
.foot .brand svg { width: 28px; height: 28px; }
.foot .url { font-weight: 600; font-size: 19px; letter-spacing: .01em; }
.foot .src { font-style: italic; color: var(--soft); font-size: 17px; }

.dbg { position: absolute; left: 0; right: 0; top: 135px; height: 1080px; outline: 3px solid #0af; z-index: 99; pointer-events: none; }
</style></head>
<body>
<svg class="paper" width="1080" height="1350">
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/>
    <feColorMatrix type="matrix" values="0 0 0 0 .45  0 0 0 0 .35  0 0 0 0 .22  0 0 0 -1.1 .62"/>
  </filter>
  <filter id="mottle" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".006" numOctaves="3" seed="9"/>
    <feColorMatrix type="matrix" values="0 0 0 0 .55  0 0 0 0 .40  0 0 0 0 .20  0 0 0 -1.6 1.0"/>
  </filter>
  <filter id="ink" x="-2%" y="-2%" width="104%" height="104%">
    <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="3" result="w"/>
    <feDisplacementMap in="SourceGraphic" in2="w" scale="2" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feTurbulence type="fractalNoise" baseFrequency=".32" numOctaves="2" seed="12" result="s"/>
    <feColorMatrix in="s" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -40 0 0 0 31.6" result="holes"/>
    <feComposite in="d" in2="holes" operator="in"/>
  </filter>
  <rect width="1080" height="1350" filter="url(#mottle)" opacity=".35"/>
  <rect width="1080" height="1350" filter="url(#grain)" opacity=".55"/>
</svg>
<div class="vignette"></div>
<div class="frame"></div>

<div class="page">
  <header class="mast">
    <div class="ear l">
      <div class="brand">${LOGO}<span>Spacetour.tr</span></div>
      <div class="it">gece eki</div>
    </div>
    <div class="nameplate">Gök Almanağı</div>
    <div class="ear r">
      <div class="cap">İSTANBUL BASKISI</div>
      <div class="it">Bedeli: bir bakış</div>
    </div>
  </header>
  <div class="dbl"></div>
  <div class="dateline">
    <span>AY IŞIĞI: YOK</span>
    <span class="mid">8 Ekim 2026 Perşembe gecesi</span>
    <span>CUMA SABAHINA DEK</span>
  </div>

  <div class="kicker">AYSIZ GECENİN BAŞROLÜ</div>
  <h1 class="head"><span class="ln" data-fit>Satürn bütün</span><span class="ln" data-fit>gece sahnede</span></h1>
  <p class="deck">Ay gökte yok, perde açık. Güneş’in neredeyse tam karşısındaki halkalı dev <b>19.10</b>’dan <b>06.10</b>’a dek gökte; en iyi an <b>00.40</b>, güney ufkunun 51° üzerinde.</p>

  <section class="body">
    <div class="left">
      <figure class="plate">${PLATE}</figure>
      <p class="caption"><span class="cap">LEVHA</span>Halkalı dev, gravür üslubunda. Bu gece Balıklar takımyıldızında; parlaklığı +0,3 kadir, Güneş’ten uzanımı 174,5°.</p>
      <div class="briefs">
        <div class="brief"><h3>Ay</h3>%4 küçülen hilal; 17.21’de battı, karanlıkta gökte yok. Yeni&nbsp;Ay: 10&nbsp;Ekim Cumartesi, 19.00.</div>
        <div class="brief"><h3>Venüs</h3>Bu gece görünmez: Güneş’e çok yakın, uzanımı yalnızca&nbsp;23°.</div>
      </div>
    </div>
    <div class="right">
      <h2>Saat Çizelgesi</h2>
      <div class="sub">Spacetour.tr hesabı · İstanbul, 8 → 9 Ekim</div>
      <div class="table">
        <div class="bracket"><span>SATÜRN SAHNEDE</span></div>
        ${timeRows}
      </div>
    </div>
  </section>

  <div class="next"><span class="cap">SIRADAKİ GÖK OLAYI</span><span class="txt"><b>Orionid meteor yağmuru</b> · 21 Ekim, 13 gün sonra · saatte ~20 meteor</span></div>
  <footer class="foot">
    <span class="src">Hesap: Spacetour.tr gökyüzü motoru · İstanbul</span>
    <span class="url">spacetour.com.tr/canli/bu-gece</span>
  </footer>
</div>
${debug ? '<div class="dbg"></div>' : ''}
<script>
  // Manşet satırlarını sütun genişliğine tam oturt
  function fit() {
    const W = document.querySelector('.page').clientWidth;
    document.querySelectorAll('[data-fit]').forEach((el) => {
      el.style.fontSize = '100px';
      el.style.display = 'inline-block';
      const w = el.getBoundingClientRect().width;
      el.style.fontSize = (100 * W / w).toFixed(2) + 'px';
      el.style.display = 'block';
    });
    // Satürn köşeli ayracı: ilk ve son Satürn satırları arası
    const sats = [...document.querySelectorAll('.trow.sat')];
    const tb = document.querySelector('.table').getBoundingClientRect();
    const a = sats[0].querySelector('.tline').getBoundingClientRect();
    const b = sats[sats.length - 1].querySelector('.tline').getBoundingClientRect();
    const br = document.querySelector('.bracket');
    br.style.top = (a.top - tb.top + a.height / 2) + 'px';
    br.style.height = (b.top - a.top) + 'px';
  }
  document.fonts.ready.then(fit);
</script>
</body></html>`;

fs.writeFileSync(path.join(DIR, 'out.html'), html);

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--allow-file-access-from-files'] });
const p = await browser.newPage();
await p.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
await p.goto(pathToFileURL(path.join(DIR, 'out.html')).href, { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 1500));
const report = await p.evaluate(() => {
  const fonts = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight} ${f.style}`);
  const over = [];
  document.querySelectorAll('.page *').forEach((el) => {
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible') over.push(el.className);
  });
  const r = (s) => { const b = document.querySelector(s).getBoundingClientRect(); return `${s}: ${Math.round(b.top)}–${Math.round(b.bottom)} (${Math.round(b.left)}–${Math.round(b.right)})`; };
  return { fonts: [...new Set(fonts)], over, boxes: ['.mast', '.dateline', '.kicker', '.head', '.deck', '.body', '.left', '.right', '.table', '.briefs', '.next', '.foot', '.page'].map(r),
    heads: [...document.querySelectorAll('[data-fit]')].map((e) => e.style.fontSize),
    lastRow: (() => { const t = [...document.querySelectorAll('.trow')].pop().getBoundingClientRect(); return Math.round(t.bottom); })(),
    briefsBottom: Math.round(document.querySelector('.briefs').getBoundingClientRect().bottom) };
});
console.log(JSON.stringify(report, null, 1));
await p.screenshot({ path: debug ? path.join(DIR, 'out-debug.png') : path.join(OUT_DIR, '2026-10-08-gok-almanagi.png') });
await browser.close();
