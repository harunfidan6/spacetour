// SpaceTour TR · “Bu gece gökyüzü” Reels (24 sn, dikey, müzik + efekt, anlatıcısız).
// Siteden bağımsız hareketli grafik: kendi 3D sahneleri (three.js) ve kinetik yazılar; veriler veri.json'da.
// Kayıt:  FILM_EPOCH="2026-10-09T21:00:00+03:00" npm run film -- v gece   (GPU'suz Linux'ta FILM_GL=swiftshader)
//
//  0.0  Açılış: yıldızlar arasından hızla geçiş · tarih / BU GECE GÖKYÜZÜ (tarih, gün ve sayılar veri.json'dan)
//  2.5  Ay: incecik hilal, %100 → aydınlık pay · "Ay neredeyse yok"
//  6.0  Satürn: halkalar, gölge · saat şeridi 19:10–06:10 · en iyi an 00:30 güneyde
// 10.5  Mars 01:50 · Jüpiter 03:00 (hızlı kesmeler)
// 13.5  Orionid meteor yağmuru · Avcı takımyıldızı, ateş topu · SAATTE ~20 METEOR
// 17.0  Yeni Ay'a kalan gün
// 20.0  Kapanış: güncel logo · Evren hiç durmaz. · spacetour.com.tr
import { createContext } from './core.js';

const SAHNELER = [
  ['s1-acilis', 0.0, 2.5],
  ['s2-ay', 2.5, 6.0],
  ['s3-saturn', 6.0, 10.5],
  ['s4-mars-jupiter', 10.5, 13.5],
  ['s5-orionid', 13.5, 17.0],
  ['s6-yeni-ay', 17.0, 20.0],
  ['s7-kapanis', 20.0, 24.0],
];

(async () => {
  const status = (s) => { window.__filmDurum = s; };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  status('yazı tipleri');
  // Sitenin yazı tipleri: ana sayfanın CSS'i ve <html> sınıfları (font değişkenleri)
  const home = new DOMParser().parseFromString(await fetch('/').then((r) => r.text()), 'text/html');
  await Promise.all([...home.querySelectorAll('link[rel=stylesheet]')].map((l) => new Promise((res) => {
    const n = document.createElement('link');
    n.rel = 'stylesheet'; n.href = l.getAttribute('href'); n.onload = n.onerror = res;
    document.head.prepend(n);
  })));
  document.documentElement.className = home.documentElement.className;

  const ctx = createContext();
  ctx.veri = await fetch('/film/gece/veri.json').then((r) => r.json());
  ctx.logo = await fetch('/film/gece/logo.svg').then((r) => r.text());

  for (const [id, t0, t1] of SAHNELER) {
    status(`sahne: ${id}`);
    try {
      const mod = await import(`./sahneler/${id}.js`);
      mod.default(ctx, { t0, t1 });
    } catch (e) {
      // Eksik ya da hatalı sahne çekimi durdurmaz: o aralık siyah kalır, hata konsola yazılır
      console.error(`[${id}]`, e);
    }
  }

  status('dokular');
  for (let i = 0; i < 600 && !ctx.texturesReady(); i++) await sleep(100);
  await Promise.all([...document.fonts].map((f) => f.load().catch(() => {})));
  await document.fonts.ready;
  await sleep(300);

  window.__filmMeta = { cuts: [2.5, 6.0, 10.5, 12.0, 13.5, 17.0, 20.0], end: 24 };
  window.__sfx = ctx.sfx.sort((a, b) => a.t - b.t);
  window.__filmStart = () => ctx.start();
  status('hazır');
  window.__filmReady = true;
})().catch((e) => { window.__filmDurum = `HATA: ${e.message}`; console.error(e); });
