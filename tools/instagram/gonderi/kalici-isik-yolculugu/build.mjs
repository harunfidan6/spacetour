// "Işık yolculuğu" — tarihsiz (her gün paylaşılabilir) Instagram gönderisi, 1080×1350.
// Kobalt zeminde İsviçre tipografisi afişi: Güneş'ten çıkan ışık her gezegene ne kadar sürede varır?
//   node build.mjs          → out.html + ../../cikti/gonderi/kalici-isik-yolculugu.png
//   node build.mjs debug    → 1080×1080 ızgara kırpımını çizer (out-debug.png)
// Süreler ortalama uzaklıktan (büyük yarı eksen, AU) ve ışık hızından hesaplanır; tarihe bağlı değildir.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(DIR, '../../cikti/gonderi');
fs.mkdirSync(OUT_DIR, { recursive: true });
const debug = process.argv[2] === 'debug';

const BLUE = '#1533c4';
const WHITE = '#f5f3ec';
const ORANGE = '#ff6b1a';

const AU_KM = 149597870.7;
const C_KMS = 299792.458;
// [ad, büyük yarı eksen (AU), nokta rengi, nokta boyu px]
const GEZEGENLER = [
  ['Merkür', 0.387098, '#c9c3b8', 12],
  ['Venüs', 0.723332, '#f3d9a4', 16],
  ['Dünya', 1.000001, ORANGE, 17],
  ['Mars', 1.523679, '#ff8a5c', 14],
  ['Jüpiter', 5.2044, '#f1d2a6', 26],
  ['Satürn', 9.5826, '#f4e1b0', 23],
  ['Uranüs', 19.2184, '#a8e6ef', 19],
  ['Neptün', 30.11, '#8fb1ff', 19],
];
const sure = (au) => (au * AU_KM) / C_KMS; // saniye
function bicim(s) {
  if (s < 3600) {
    const d = Math.floor(s / 60), sn = Math.round(s - d * 60);
    return `${d} dk ${sn} sn`;
  }
  const dk = Math.round(s / 60);
  return `${Math.floor(dk / 60)} sa ${dk % 60} dk`;
}
const DUNYA = bicim(sure(1.000001)); // "8 dk 19 sn"
const [dDk, , dSn] = DUNYA.split(' ');

// Logaritmik zaman ekseni: 1 dk … 5 sa
const X0 = 300, X1 = 812, T0 = 60, T1 = 5 * 3600;
const xOf = (s) => X0 + ((Math.log(s) - Math.log(T0)) / (Math.log(T1) - Math.log(T0))) * (X1 - X0);

const LOGO = fs
  .readFileSync(path.join(DIR, 'logo.svg'), 'utf8')
  .replace(/<radialGradient[\s\S]*?<\/linearGradient>/, '')
  .replace('fill="url(#gpl)"', `fill="${WHITE}"`)
  .replace(/stroke="url\(#gring\)" stroke-width="4" clip-path="url\(#gback\)"/, `stroke="${WHITE}" stroke-width="4" clip-path="url(#gback)"`)
  .replace(
    /<ellipse cx="32" cy="32" rx="27" ry="7" fill="none" stroke="url\(#gring\)" stroke-width="4" clip-path="url\(#gfront\)"\/>/,
    `<ellipse cx="32" cy="32" rx="27" ry="7" fill="none" stroke="${BLUE}" stroke-width="9" clip-path="url(#gfront)"/><ellipse cx="32" cy="32" rx="27" ry="7" fill="none" stroke="${WHITE}" stroke-width="4" clip-path="url(#gfront)"/>`,
  )
  .replace('#38bdf8', ORANGE);

const ROW_H = 62, CHART_TOP = 712;
const rows = GEZEGENLER.map(([ad, au, renk, boy], i) => {
  const s = sure(au), x = xOf(s), y = CHART_TOP + i * ROW_H;
  const biz = ad === 'Dünya';
  return `
  <div class="row${biz ? ' biz' : ''}" style="top:${y}px">
    <div class="ad">${ad}</div>
    <div class="iz" style="left:${X0}px;width:${(x - X0).toFixed(1)}px"></div>
    <div class="iz-sonra" style="left:${x.toFixed(1)}px;width:${(X1 - x).toFixed(1)}px"></div>
    <div class="dot" style="left:${(x - boy / 2).toFixed(1)}px;width:${boy}px;height:${boy}px;margin-top:${-boy / 2}px;background:${renk}"></div>
    <div class="t">${bicim(s)}</div>
  </div>`;
}).join('');

const TICKS = [[60, '1 dk'], [600, '10 dk'], [3600, '1 sa'], [3 * 3600, '3 sa']]
  .map(([s, l]) => `<div class="tick" style="left:${xOf(s).toFixed(1)}px"><span>${l}</span></div>`).join('');

const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="fonts/fonts.css">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1080px; height: 1350px; background: ${BLUE}; }
.page { position: relative; width: 1080px; height: 1350px; overflow: hidden; background: ${BLUE}; color: ${WHITE};
  font-family: 'Inter Tight', sans-serif; -webkit-font-smoothing: antialiased; }
.mono { font-family: 'IBM Plex Mono', monospace; }
/* İnce ızgara çizgileri: afişin İsviçre iskeleti */
.grid { position: absolute; inset: 0; background-image: linear-gradient(90deg, rgb(245 243 236 / 0.07) 1px, transparent 1px); background-size: 108px 100%; background-position: 72px 0; }
.top { position: absolute; left: 72px; right: 72px; top: 84px; display: flex; justify-content: space-between; align-items: baseline;
  font-size: 21px; letter-spacing: 0.14em; text-transform: uppercase; border-top: 3px solid ${WHITE}; padding-top: 16px; }
.top b { font-weight: 500; }
.head { position: absolute; left: 66px; right: 60px; top: 152px; font-weight: 900; letter-spacing: -0.045em; line-height: 0.88; }
.head .l1, .head .l3 { font-size: 104px; display: block; white-space: nowrap; }
.head .l2 { display: block; white-space: nowrap; color: ${ORANGE}; font-size: 214px; letter-spacing: -0.06em; line-height: 0.86; margin: 6px 0 2px -6px; }
.head .l2 small { font-size: 0.5em; letter-spacing: -0.03em; margin: 0 22px 0 6px; }
.deck { position: absolute; left: 72px; width: 936px; top: 566px; font-size: 31px; font-weight: 500; line-height: 1.22; letter-spacing: -0.01em; }
.deck em { font-style: normal; color: ${ORANGE}; }
.sun { position: absolute; left: ${X0 - 30}px; top: ${CHART_TOP - 36}px; width: 30px; height: ${ROW_H * 8 + 12}px; background: ${ORANGE};
  box-shadow: 0 0 60px 14px rgb(255 107 26 / 0.45); border-radius: 3px; }
.sun span { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) rotate(-90deg); font-size: 18px; font-weight: 800; letter-spacing: 0.5em; color: ${BLUE}; white-space: nowrap; }
.row { position: absolute; left: 0; width: 1080px; height: 0; }
.row .ad { position: absolute; left: 72px; top: -21px; font-size: 34px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
.row .t { position: absolute; right: 72px; top: -17px; font-family: 'IBM Plex Mono', monospace; font-size: 27px; font-weight: 500; line-height: 1; text-align: right; }
.row .iz { position: absolute; top: -1.5px; height: 3px; background: linear-gradient(90deg, rgb(255 210 150 / 0.95), rgb(245 243 236 / 0.85)); }
.row .iz-sonra { position: absolute; top: -0.5px; height: 1px; background: rgb(245 243 236 / 0.22); }
.row .dot { position: absolute; top: 0; border-radius: 50%; box-shadow: 0 0 0 4px ${BLUE}; }
.row.biz .ad, .row.biz .t { color: ${ORANGE}; }
.row.biz .iz { background: ${ORANGE}; height: 5px; top: -2.5px; box-shadow: 0 0 18px rgb(255 107 26 / 0.7); }
.row.biz .t::after { content: 'şu an gördüğün Güneş ↑'; position: absolute; right: 0; top: 34px; font-size: 15px; letter-spacing: 0.08em; white-space: nowrap; color: ${ORANGE}; opacity: 0.95; }
.tick { position: absolute; top: ${CHART_TOP - 50}px; height: ${ROW_H * 8 + 18}px; border-left: 1px dashed rgb(245 243 236 / 0.28); }
.tick span { position: absolute; left: 6px; top: -4px; font-family: 'IBM Plex Mono', monospace; font-size: 15px; letter-spacing: 0.08em; opacity: 0.75; white-space: nowrap; }
.foot { position: absolute; left: 72px; right: 72px; top: 1212px; border-top: 3px solid ${WHITE}; padding-top: 18px; display: flex; justify-content: space-between; align-items: center; }
.brand { display: flex; align-items: center; gap: 14px; font-size: 30px; font-weight: 800; letter-spacing: -0.02em; }
.brand svg { width: 52px; height: 52px; }
.note { font-family: 'IBM Plex Mono', monospace; font-size: 16px; line-height: 1.45; text-align: right; opacity: 0.85; letter-spacing: 0.02em; }
${debug ? `.crop { position: absolute; left: 0; right: 0; top: 135px; height: 1080px; outline: 4px solid #0f0; z-index: 9; pointer-events: none; }` : ''}
</style></head><body><div class="page">
<div class="grid"></div>
<div class="top mono"><b>Işık yolculuğu</b><span>c = 299.792 km/sn</span></div>
<h1 class="head"><span class="l1">Gördüğün Güneş,</span><span class="l2">${dDk}<small>dk</small>${dSn}<small>sn</small></span><span class="l3">önceki Güneş.</span></h1>
<p class="deck">Güneş’ten çıkan ışık her gezegene <em>ne kadar sürede</em> varır?</p>
${TICKS}
<div class="sun"><span>GÜNEŞ</span></div>
${rows}
<div class="foot"><div class="brand">${LOGO}<span>spacetour.com.tr</span></div><div class="note">Ortalama uzaklıklarla.<br>Ölçek logaritmik.</div></div>
${debug ? '<div class="crop"></div>' : ''}
</div></body></html>`;

fs.writeFileSync(path.join(DIR, 'out.html'), html);

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--allow-file-access-from-files'] });
const p = await browser.newPage();
await p.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
await p.goto(pathToFileURL(path.join(DIR, 'out.html')).href, { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 800));
const report = await p.evaluate(() => {
  const fonts = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight} ${f.style}`);
  const r = (s) => { const b = document.querySelector(s).getBoundingClientRect(); return `${s}: ${Math.round(b.top)}–${Math.round(b.bottom)} (${Math.round(b.left)}–${Math.round(b.right)})`; };
  const wide = [...document.querySelectorAll('.head span')].map((e) => Math.round(e.getBoundingClientRect().right));
  return { fonts: [...new Set(fonts)], boxes: ['.top', '.head', '.deck', '.sun', '.foot'].map(r), headRight: wide };
});
console.log(JSON.stringify(report, null, 1));
await p.screenshot({ path: debug ? path.join(DIR, 'out-debug.png') : path.join(OUT_DIR, 'kalici-isik-yolculugu.png') });
await browser.close();
