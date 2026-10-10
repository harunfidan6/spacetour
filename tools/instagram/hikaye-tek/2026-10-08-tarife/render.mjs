// "Gökyüzü tarifesi": split-flap (Solari) kalkış panosu tarzında Instagram hikâyesi, 1080×1920.
//   node render.mjs          → out.html + out.png
//   node render.mjs debug    → güvenli alanları ve çıkartma alanını çizer (out-debug.png)
// Veri: sitenin src/lib/astrophysics/skyTonight.ts hesabı, İstanbul, 8 → 9 Ekim 2026 gecesi.
// Not: Ay 8 Ekim sabahı 04:33’te doğmuş, 17:21’de (gün batımından önce) batmıştı; bir sonraki doğuş
// karanlık bittikten sonra. Bu yüzden panoda Ay, en üstte "KALKTI" durumunda (gitmiş sefer) duruyor.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(DIR, '../../cikti/hikaye-tek');
fs.mkdirSync(OUT_DIR, { recursive: true });
const debug = process.argv[2] === 'debug';
const LOGO = fs.readFileSync(path.join(DIR, 'logo.svg'), 'utf8');
const logo = (id) => LOGO.replace(/id="t/g, `id="${id}`).replace(/url\(#t/g, `url(#${id}`);

// [saat, sefer, durum, ton, ayrıntı, satır sınıfı, dönen hücre [sıra, eski harf]]
const ROWS = [
  ['17:21', 'AY', 'KALKTI', 'gone', '%4 Küçülen Hilal, Güneş’ten önce battı · Yeni Ay 10 Ekim', 'gone'],
  ['18:34', 'GÜN BATIMI', 'ZAMANINDA', 'go', 'Alacakaranlık başlıyor'],
  ['19:10', 'SATÜRN', 'BÜTÜN GECE', 'go', '<b>Balıklar</b> · +0,3 kadir · en iyi <b>00:40</b>, güneyde 51°', 'hot'],
  ['20:10', 'TAM KARANLIK', 'BİNİŞ', 'amber', 'Astronomik karanlık <b>05:30</b>’a dek sürer'],
  ['01:50', 'MARS', 'RÖTARLI', 'amber', '<b>Yengeç</b> · +1,1 kadir · en iyi <b>06:40</b>, güneydoğuda 59°'],
  ['03:00', 'JÜPİTER', 'EN PARLAK', 'white', '<b>Aslan</b> · −1,9 kadir · en iyi <b>06:40</b>, güneydoğuda 46°'],
  ['07:08', 'GÜN DOĞUMU', 'SON ÇAĞRI', 'amber', 'Tam karanlık <b>05:30</b>’da biter'],
  ['--:--', 'VENÜS', 'İPTAL', 'red', 'Güneş’e çok yakın (uzanım 23°), bu gece görünmez', 'off'],
];
const NAME_CELLS = 12;
const STATUS_CELLS = 10;

const flap = (ch, cls = '', old = '') =>
  `<span class="f ${cls}${ch === ' ' ? ' blank' : ''}${old ? ' flip' : ''}"><i>${ch === ' ' ? '' : ch}</i>${old ? `<b class="leaf"><i>${old}</i></b>` : ''}</span>`;
const cells = (text, n, cls) => [...text.padEnd(n, ' ')].map((c) => flap(c, cls)).join('');
// flip: [hücre sırası, eski harf] → o hücre dönerken yakalanmış gibi çizilir
const statusCells = (text, n, flip) =>
  [...text.padStart(n, ' ')].map((c, i) => flap(c, 's', flip && flip[0] === i ? flip[1] : '')).join('');
const time = (t) => `<div class="time">${flap(t[0])}${flap(t[1])}<span class="colon">:</span>${flap(t[3])}${flap(t[4])}</div>`;

const rows = ROWS.map(([t, name, status, tone, detail, cls = '', flip]) => `
  <div class="row ${cls}">
    <div class="line1">${time(t)}<div class="name">${cells(name, NAME_CELLS)}</div></div>
    <div class="line2"><p class="detail">${detail}</p><div class="status ${tone}">${statusCells(status, STATUS_CELLS, flip)}</div></div>
  </div>`).join('');

const arrowRight = `<svg viewBox="0 0 40 20" width="38" height="19"><path d="M2 10H36M28 3l8 7-8 7" fill="none" stroke="#111110" stroke-width="3.6" stroke-linecap="square"/></svg>`;

const html = `<!doctype html>
<html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="fonts/fonts.css">
<style>
:root{
  --sign:#ffcf00; --ink:#111110;
  --flap-hi:#2e2f33; --flap-lo:#1f2023; --char:#f3f0e6;
  --go:#4fe08a; --amber:#ffae1a; --red:#ff5548; --white:#f3f0e6;
  --cw:54px; --ch:50px; --sw:35px; --sh:34px;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden}
body{background:var(--sign);color:var(--ink);font-family:'Barlow',sans-serif;position:relative;-webkit-font-smoothing:antialiased}
.grain{position:absolute;inset:0;opacity:.30;mix-blend-mode:multiply;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .55  0 0 0 0 .45  0 0 0 0 0  0 0 0 .55 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")}

/* ---------- tabela başlığı ---------- */
.sign{position:absolute;left:36px;right:36px;top:276px;display:flex;gap:22px;align-items:stretch}
.box{flex:none;width:112px;height:112px;align-self:center;background:var(--ink);border-radius:14px;display:grid;place-items:center}
.box.logo svg{width:84px;height:84px}
.box.up{margin-left:auto}
.titles{display:flex;flex-direction:column;justify-content:space-between;padding:0 0 2px}
h1{font-family:'Barlow Condensed';font-weight:800;font-size:100px;line-height:.82;letter-spacing:-.005em}
.sub{display:flex;align-items:center;gap:13px;font-family:'Barlow Semi Condensed';font-weight:700;font-size:26px;letter-spacing:.08em}
.sub .city{background:var(--ink);color:var(--sign);padding:3px 10px 2px;border-radius:4px;letter-spacing:.1em}

/* ---------- pano ---------- */
.board{position:absolute;left:36px;right:36px;top:406px;background:linear-gradient(#18191c,#101113);border-radius:20px;padding:10px 20px 42px;
  box-shadow:0 0 0 3px #08090a, 0 2px 0 5px rgba(0,0,0,.18), 0 34px 60px -18px rgba(60,40,0,.55), inset 0 1px 0 rgba(255,255,255,.07)}
.screw{position:absolute;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#55575c,#1b1c1e 70%);box-shadow:inset 0 0 0 1px #000}
.screw::after{content:'';position:absolute;left:2px;right:2px;top:5px;height:2px;background:#0a0a0b;transform:rotate(35deg)}
.head{display:flex;align-items:flex-end;height:30px;padding:0 2px 7px;border-bottom:2px solid #050506;box-shadow:0 1px 0 rgba(255,255,255,.05);
  font-family:'Barlow Semi Condensed';font-weight:700;font-size:20px;letter-spacing:.2em;color:var(--sign)}
.head .c1{width:calc(4*var(--cw) + 3*4px + 12px + 30px)}
.head .c3{margin-left:auto}
.row{position:relative;padding:4px 0 4px;border-bottom:2px solid #050506;box-shadow:0 1px 0 rgba(255,255,255,.045)}
.line1{display:flex;align-items:center;gap:30px}
.time,.name,.status{display:flex;gap:4px;align-items:center}
.status{gap:3px}
.colon{width:12px;text-align:center;font-family:'Barlow Condensed';font-weight:700;font-size:42px;line-height:1;color:var(--char);margin-top:-6px}
.line2{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:4px}
.detail{font-family:'Barlow Semi Condensed';font-weight:500;font-size:25px;line-height:1;color:#b9bbc1;white-space:nowrap;letter-spacing:.01em}
.detail b{font-weight:700;color:#ece9df}

/* kanatçık hücresi */
.f{position:relative;flex:none;width:var(--cw);height:var(--ch);border-radius:5px;overflow:hidden;
  background:
    linear-gradient(#060607,#060607) left 50% / 2px 10px no-repeat,
    linear-gradient(#060607,#060607) right 50% / 2px 10px no-repeat,
    linear-gradient(to bottom,var(--flap-hi) 0%,#27282c 49%,var(--flap-lo) 51%,#1a1b1e 100%);
  box-shadow:0 3px 0 #040405, 0 6px 7px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.09), inset 0 -1px 0 rgba(255,255,255,.03)}
.f i{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-style:normal;
  font-family:'Barlow';font-weight:600;font-size:calc(var(--ch)*.84);line-height:1;color:var(--char);padding-top:calc(var(--ch)*.05)}
.f::after{content:'';position:absolute;left:0;right:0;top:50%;bottom:0;background:linear-gradient(rgba(0,0,0,.30),rgba(0,0,0,.06) 40%,rgba(0,0,0,.14))}
.f::before{content:'';position:absolute;left:0;right:0;top:calc(50% - 1px);height:2px;background:#050506;z-index:2;box-shadow:0 1px 0 rgba(255,255,255,.07)}
.f.s{width:var(--sw);height:var(--sh);border-radius:3px;background:
    linear-gradient(to bottom,var(--flap-hi) 0%,#27282c 49%,var(--flap-lo) 51%,#1a1b1e 100%);
  box-shadow:0 2px 0 #040405, 0 4px 5px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.08)}
.f.s i{font-family:'Barlow Semi Condensed';font-size:calc(var(--sh)*.86);font-weight:700;padding-top:calc(var(--sh)*.05)}
/* dönmekte olan kanatçık: üst yarı menteşe çevresinde öne düşüyor */
.f.flip{overflow:visible}
.f.flip::after{background:linear-gradient(rgba(0,0,0,.62),rgba(0,0,0,.22) 70%,rgba(0,0,0,.18))}
.leaf{position:absolute;left:0;right:0;top:0;height:50%;overflow:hidden;z-index:3;border-radius:3px 3px 0 0;transform-origin:50% 100%;transform:perspective(90px) rotateX(-62deg);
  background:linear-gradient(#3a3b40,#2c2d31);box-shadow:inset 0 1px 0 rgba(255,255,255,.14)}
.leaf i{height:200%;bottom:auto}
.f.blank{background:linear-gradient(to bottom,#222326 0%,#1e1f22 49%,#18191b 51%,#151618 100%);box-shadow:0 3px 0 #040405, 0 5px 6px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.05)}
.f.s.blank{box-shadow:0 2px 0 #040405, 0 3px 4px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04)}
.go .f i{color:var(--go)} .amber .f i{color:var(--amber)} .red .f i{color:var(--red)} .white .f i{color:var(--white)} .gone .f i{color:#8d8f95}
/* gitmiş sefer: soluk */
.row.gone .line1 .f i,.row.gone .colon{color:#9a9ca2}
.row.gone .detail{color:#8f9197}
/* gecenin yıldızı */
.row.hot .name .f i{color:var(--sign)}
.row.hot::before{content:'';position:absolute;left:-14px;top:5px;width:8px;height:var(--ch);border-radius:2px;background:var(--sign);box-shadow:0 0 12px rgba(255,207,0,.45)}

.notice{display:grid;grid-template-columns:auto 1fr;column-gap:14px;row-gap:8px;align-items:center;margin-top:8px;padding:11px 12px;border-radius:10px;background:#0a0a0b;box-shadow:inset 0 2px 6px rgba(0,0,0,.8), 0 1px 0 rgba(255,255,255,.05)}
.notice .tag{justify-self:stretch;text-align:center;background:var(--sign);color:var(--ink);font-family:'Barlow Semi Condensed';font-weight:800;font-size:19px;letter-spacing:.16em;padding:5px 10px 4px;border-radius:4px}
.notice .tag.dim{background:transparent;color:var(--sign);box-shadow:inset 0 0 0 2px var(--sign)}
.notice p{font-family:'Barlow Semi Condensed';font-weight:600;font-size:25px;line-height:1.1;color:#f3f0e6;letter-spacing:.01em;white-space:nowrap}
.notice p b{color:var(--sign);font-weight:800;letter-spacing:.04em}

/* üretici plakası (Solari panolarındaki gibi): künye */
.plate{position:absolute;left:50%;bottom:9px;transform:translateX(-50%);display:flex;align-items:center;gap:8px;padding:3px 14px 3px 8px;border-radius:5px;
  background:linear-gradient(#c9c7c0,#a19f98 55%,#8d8b85);box-shadow:inset 0 1px 0 rgba(255,255,255,.6), inset 0 -1px 0 rgba(0,0,0,.25), 0 1px 2px rgba(0,0,0,.6);
  font-family:'Barlow Semi Condensed';font-weight:800;font-size:22px;letter-spacing:.06em;color:#1a1a19}
.plate svg{width:26px;height:26px}
.plate .rivet{width:5px;height:5px;border-radius:50%;background:#6c6a65;box-shadow:inset 0 1px 0 rgba(255,255,255,.4)}

/* biniş kapısı: bağlantı çıkartmasına işaret */
.gate{position:absolute;left:90px;right:90px;top:1392px;display:flex;align-items:center;justify-content:center;gap:14px;font-family:'Barlow Semi Condensed'}
.gate .arr{flex:none;width:42px;height:42px;border-radius:7px;background:var(--ink);display:grid;place-items:center}
.gate span{font-weight:800;font-size:24px;letter-spacing:.12em}
.gate em{font-style:normal;font-weight:600;font-size:24px;letter-spacing:.03em}

.fine{position:absolute;left:0;right:0;top:1592px;text-align:center;font-family:'Barlow Semi Condensed';font-weight:600;font-size:18px;letter-spacing:.08em;color:rgba(17,17,16,.62)}

/* debug */
.dbg{display:none;position:absolute;left:0;right:0;z-index:50;pointer-events:none}
body.debug .dbg{display:block}
</style></head>
<body class="${debug ? 'debug' : ''}">
<div class="grain"></div>

<header class="sign">
  <div class="box logo">${logo('a')}</div>
  <div class="titles">
    <h1>GÖKYÜZÜ TARİFESİ</h1>
    <div class="sub"><span class="city">İSTANBUL</span><span>8 EKİM PERŞEMBE</span>${arrowRight}<span>9 EKİM CUMA</span></div>
  </div>
  <div class="box up"><svg viewBox="0 0 40 40" width="70" height="70"><path d="M20 36V6M8 17 20 5l12 12" fill="none" stroke="#ffcf00" stroke-width="5.2" stroke-linecap="square"/></svg></div>
</header>

<section class="board">
  <span class="screw" style="left:9px;top:9px"></span><span class="screw" style="right:9px;top:9px"></span>
  <span class="screw" style="left:9px;bottom:9px"></span><span class="screw" style="right:9px;bottom:9px"></span>
  <div class="head"><span class="c1">SAAT</span><span>SEFER</span><span class="c3">DURUM</span></div>
  ${rows}
  <div class="notice">
    <span class="tag">DUYURU</span><p><b>AY IŞIĞI YOK.</b> Ayın en karanlık gecelerinden biri.</p>
    <span class="tag dim">SIRADAKİ</span><p>Orionid meteor yağmuru · <b>21 Ekim</b> · saatte ~20 meteor</p>
  </div>
  <div class="plate"><span class="rivet"></span>${logo('b')}<span>SPACETOUR.TR</span><span class="rivet"></span></div>
</section>

<div class="gate">
  <div class="arr"><svg viewBox="0 0 40 40" width="28" height="28"><path d="M20 4v30M8 23l12 12 12-12" fill="none" stroke="#ffcf00" stroke-width="5.2" stroke-linecap="square"/></svg></div>
  <span>BİNİŞ KAPISI</span><em>spacetour.com.tr/canli/bu-gece</em>
</div>

<p class="fine">Saatler İstanbul’a göredir · Veri: Spacetour.tr gökyüzü hesabı</p>

<div class="dbg" style="top:0;height:250px;background:rgba(255,0,0,.25)"></div>
<div class="dbg" style="top:1620px;height:300px;background:rgba(255,0,0,.25)"></div>
<div class="dbg" style="top:1400px;height:190px;left:90px;right:90px;background:rgba(0,120,255,.35);border:2px dashed #00f"></div>
</body></html>`;

fs.writeFileSync(path.join(DIR, 'out.html'), html);

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('[hata]', e.message));
await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(DIR, 'out.html')).href, { waitUntil: 'networkidle0', timeout: 90000 });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 1500));
const report = await page.evaluate(() => {
  const R = (el) => el.getBoundingClientRect();
  const box = (s) => { const r = R(document.querySelector(s)); return `${s}: x ${Math.round(r.left)}–${Math.round(r.right)}, y ${Math.round(r.top)}–${Math.round(r.bottom)}`; };
  const out = ['.sign', 'h1', '.sub', '.board', '.notice', '.plate', '.gate', '.fine'].map(box);
  document.querySelectorAll('.row').forEach((r, i) => {
    const d = r.querySelector('.detail'), st = r.querySelector('.status'), nm = r.querySelector('.name');
    out.push(`row${i}: y ${Math.round(R(r).top)}–${Math.round(R(r).bottom)} name→${Math.round(R(nm).right)} detail→${Math.round(R(d).right)} (scrollW ${d.scrollWidth}/${d.clientWidth}) status←${Math.round(R(st).left)}→${Math.round(R(st).right)}`);
  });
  document.querySelectorAll('.notice p').forEach((p, i) => out.push(`notice p${i}: →${Math.round(R(p).right)} scrollW ${p.scrollWidth}/${p.clientWidth}`));
  const h = document.querySelector('h1'); out.push(`h1 scrollW ${h.scrollWidth} / ${h.clientWidth}`);
  const fonts = [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`))];
  return { out, fonts };
});
console.log(report.out.join('\n'));
console.log('yazı tipleri:', report.fonts.join(', '));
const out = debug ? path.join(DIR, 'out-debug.png') : path.join(OUT_DIR, '2026-10-08-gokyuzu-tarifesi.png');
await page.screenshot({ path: out });
console.log('kaydedildi:', out);
await browser.close();
