// Tarihsiz Instagram gönderi serisi (№ 02–11), 1080×1350. "Işık yolculuğu" (№ 01) ile aynı afiş dili:
// İsviçre tipografisi, tek vurgu rengi, ince ızgara; her gönderinin kendi rengi ve kendi görseli var.
//   node build.mjs            → ../../cikti/gonderi/kalici-NN-<ad>.png (hepsi)
//   node build.mjs 04         → yalnızca № 04
//   node build.mjs debug      → 1080×1080 ızgara kırpımı çizili (out-debug-NN.png)
// Sayılar tarihe bağlı olmayan fiziksel değerler (NASA gezegen bilgi sayfaları); kaynak notları kalici-gonderiler.md'de.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(DIR, '../../cikti/gonderi');
fs.mkdirSync(OUT_DIR, { recursive: true });
const args = process.argv.slice(2);
const debug = args.includes('debug');
const only = args.find((a) => /^\d\d$/.test(a));

const LOGO = fs
  .readFileSync(path.resolve(DIR, '../kalici-isik-yolculugu/logo.svg'), 'utf8')
  .replace(/<radialGradient[\s\S]*?<\/linearGradient>/, '')
  .replace('fill="url(#gpl)"', 'style="fill:var(--ink)"')
  .replace(/stroke="url\(#gring\)" stroke-width="4" clip-path="url\(#gback\)"/, 'style="stroke:var(--ink)" stroke-width="4" clip-path="url(#gback)"')
  .replace(
    /<ellipse cx="32" cy="32" rx="27" ry="7" fill="none" stroke="url\(#gring\)" stroke-width="4" clip-path="url\(#gfront\)"\/>/,
    '<ellipse cx="32" cy="32" rx="27" ry="7" fill="none" style="stroke:var(--bg)" stroke-width="9" clip-path="url(#gfront)"/><ellipse cx="32" cy="32" rx="27" ry="7" fill="none" style="stroke:var(--ink)" stroke-width="4" clip-path="url(#gfront)"/>',
  )
  .replace('fill="#38bdf8"', 'style="fill:var(--acc)"');

const f1 = (n) => (Math.round(n * 10) / 10).toString();
const tr = (n, d = 0) => n.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });

/* ======================= Görsel yapı taşları ======================= */

/** Şerit tablo: her satırda ad, ölçekli çizgi + nokta, sağda değer. scale: { type: 'lin'|'log', min, max } */
function serit({ rows, scale, rowH = 60, marker, ticks = [], baslik, X0 = 230, X1 = 700 }) {
  const xOf = (v) => {
    const u = scale.type === 'log' ? (Math.log(v) - Math.log(scale.min)) / (Math.log(scale.max) - Math.log(scale.min)) : (v - scale.min) / (scale.max - scale.min);
    return X0 + Math.max(0, Math.min(1, u)) * (X1 - X0);
  };
  const top = baslik || ticks.length || marker ? 52 : 14;
  const H = top + rows.length * rowH;
  const r = rows.map((row, i) => {
    const y = top + i * rowH + rowH / 2, x = xOf(row.v), d = row.d ?? 16;
    return `<div class="sr${row.hi ? ' hi' : ''}" style="top:${y}px">
      <div class="ad">${row.ad}</div>
      <div class="iz" style="left:${X0}px;width:${(x - X0).toFixed(1)}px"></div>
      <div class="iz2" style="left:${x.toFixed(1)}px;width:${(X1 - x).toFixed(1)}px"></div>
      <div class="dot" style="left:${(x - d / 2).toFixed(1)}px;width:${d}px;height:${d}px;margin-top:${-d / 2}px;${row.renk ? `background:${row.renk}` : ''}"></div>
      <div class="val">${row.etiket}</div>
    </div>`;
  }).join('');
  const t = ticks.map(([v, l]) => `<div class="tk" style="left:${xOf(v).toFixed(1)}px;top:${top - 34}px;height:${rows.length * rowH + 34}px"><span>${l}</span></div>`).join('');
  const m = marker ? `<div class="mk" style="left:${xOf(marker.v).toFixed(1)}px;top:${top - 40}px;height:${rows.length * rowH + 44}px"><span>${marker.l}</span></div>` : '';
  const b = baslik ? `<div class="sbas">${baslik}</div>` : '';
  return `<div class="serit" style="height:${H}px">${b}${t}${m}${r}</div>`;
}

const kart = (items) => `<div class="kartlar">${items.map(([b, k]) => `<div class="kart"><b>${b}</b><span>${k}</span></div>`).join('')}</div>`;

/* ======================= Gönderiler ======================= */

const POSTS = [
  {
    no: '02', ad: 'saturn-yuzer', tema: { bg: '#0d5566', ink: '#f2efe6', acc: '#ffd23f' },
    ust: ['Satürn', 'Yoğunluk · g/cm³'],
    bas: [['Satürn', 'ink'], ['suda', 'acc'], ['yüzerdi.', 'ink']],
    deck: 'Yoğunluğu sudan düşük olan tek gezegen: santimetreküpü yalnızca <em>0,69 gram</em>.',
    gorsel: () => serit({
      scale: { type: 'lin', min: 0, max: 6 }, rowH: 48, marker: { v: 1, l: 'SU · 1,0' },
      rows: [
        ['Dünya', 5.51], ['Merkür', 5.43], ['Venüs', 5.24], ['Mars', 3.93], ['Neptün', 1.64], ['Jüpiter', 1.33], ['Uranüs', 1.27], ['Satürn', 0.69],
      ].map(([ad, v]) => ({ ad, v, etiket: tr(v, 2), hi: ad === 'Satürn' })),
    }),
    not: ['Ortalama yoğunluklar.', 'Kaynak: NASA'],
  },
  {
    no: '03', ad: 'venus-gunu', tema: { bg: '#f0cf2c', ink: '#17150f', acc: '#c2310c' },
    ust: ['Venüs', 'Gün ve yıl'],
    bas: [['Venüs’te', 'ink'], ['bir gün,', 'acc'], ['bir yıldan', 'ink'], ['uzun.', 'ink']],
    deck: null,
    gorsel: () => {
      const bar = (lab, gun, w, cls) => `<div class="vbar ${cls}"><div class="vlab">${lab}</div><div class="vrow"><div class="vfill" style="width:${w}px"></div><div class="vnum">${gun}<small> gün</small></div></div></div>`;
      return `<div class="venus">
        ${bar('Kendi ekseni etrafında bir tur', '243', 600, 'a')}
        ${bar('Güneş’in etrafında bir tur', '225', Math.round((600 * 224.7) / 243), 'b')}
        <div class="vnot"><span class="ok">↻</span><p>Üstelik öteki gezegenlerin çoğunun tersine döner:<br><b>Venüs’te Güneş batıdan doğar.</b></p></div>
      </div>`;
    },
    not: ['Yıldızlara göre dönüş süresi.', 'Kaynak: NASA'],
  },
  {
    no: '04', ad: 'ay-da-agirlik', tema: { bg: '#ebe5d6', ink: '#141311', acc: '#e0301e' },
    ust: ['Ağırlık', '70 kg · terazide'],
    bas: [['Ay’da 70 kilo', 'ink'], ['12 kilo', 'acc'], ['gelir.', 'ink']],
    deck: 'Dünya’da 70 kilo gelen biri, öteki dünyalarda terazide <em>ne görür?</em>',
    gorsel: () => serit({
      scale: { type: 'lin', min: 0, max: 180 }, rowH: 46, marker: { v: 70, l: 'DÜNYA · 70' },
      rows: [
        ['Ay', 0.165], ['Merkür', 0.378], ['Mars', 0.379], ['Uranüs', 0.886], ['Venüs', 0.904], ['Dünya', 1], ['Satürn', 1.065], ['Neptün', 1.137], ['Jüpiter', 2.528],
      ].map(([ad, g]) => ({ ad, v: 70 * g, etiket: `${Math.round(70 * g)} kg`, hi: ad === 'Ay' })),
    }),
    not: ['Kütlen değişmez, çekim değişir.', 'Gaz devlerinde bulut tepeleri.'],
  },
  {
    no: '05', ad: 'gunes-1-3-milyon', tema: { bg: '#f4ebdb', ink: '#1b1410', acc: '#ff4a12' },
    ust: ['Güneş', 'Ölçekli'],
    bas: [['Güneş’e', 'ink'], ['1,3 milyon', 'acc'], ['Dünya sığar.', 'ink']],
    deck: null,
    gorsel: () => {
      const rE = 4.5, R = rE * 109; // çaplar ölçekli
      return `<div class="gunes">
        <svg viewBox="0 0 936 430" width="936" height="430">
          <defs><radialGradient id="gg" cx=".35" cy=".35" r=".75"><stop offset="0" stop-color="#ffd25a"/><stop offset=".55" stop-color="#ff7a1a"/><stop offset="1" stop-color="#e2370c"/></radialGradient></defs>
          <circle cx="${936 + 60}" cy="${430 + 200}" r="${R}" fill="url(#gg)"/>
          <circle cx="118" cy="330" r="${rE}" style="fill:var(--ink)"/>
          <path d="M118 316 L118 250" style="stroke:var(--ink)" stroke-width="2"/>
          <text x="118" y="238" text-anchor="middle" class="svgl">DÜNYA</text>
        </svg>
        ${kart([['109', 'Dünya çapında'], ['333.000', 'Dünya kütlesinde'], ['%99,86', 'Güneş Sistemi’nin kütlesi']])}
      </div>`;
    },
    not: ['Çaplar ölçekli.', 'Kaynak: NASA'],
  },
  {
    no: '06', ad: 'ay-uzaklasiyor', tema: { bg: '#18181d', ink: '#f1f0ea', acc: '#c8f135' },
    ust: ['Ay', 'Yılda 3,8 cm'],
    bas: [['Ay her yıl', 'ink'], ['3,8 cm', 'acc'], ['uzaklaşıyor.', 'ink']],
    deck: 'Yaklaşık tırnaklarının bir yılda uzadığı kadar.',
    gorsel: () => {
      const PX = 168, L = 5; // 1 cm = 168 px, 0–5 cm
      let ticks = '';
      for (let mm = 0; mm <= L * 10; mm++) {
        const x = 30 + (mm * PX) / 10, h = mm % 10 === 0 ? 54 : mm % 5 === 0 ? 36 : 22;
        ticks += `<line x1="${x}" x2="${x}" y1="150" y2="${150 + h}" style="stroke:var(--ink)" stroke-width="${mm % 10 === 0 ? 2.5 : 1.4}"/>`;
        if (mm % 10 === 0) ticks += `<text x="${x}" y="${150 + h + 30}" text-anchor="middle" class="svgl">${mm / 10}</text>`;
      }
      const w = 3.8 * PX;
      return `<div class="cetvel">
        <svg viewBox="0 0 936 300" width="936" height="300">
          <rect x="30" y="40" width="${w}" height="96" rx="4" style="fill:var(--acc)"/>
          <text x="${30 + w - 18}" y="108" text-anchor="end" class="svgbig">3,8 cm</text>
          <path d="M${30 + w + 10} 88 l34 0 m-12 -12 l12 12 l-12 12" fill="none" style="stroke:var(--ink)" stroke-width="3"/>
          <line x1="30" x2="${30 + L * PX}" y1="150" y2="150" style="stroke:var(--ink)" stroke-width="2.5"/>
          ${ticks}
          <text x="${30 + L * PX}" y="${150 + 84}" text-anchor="end" class="svgl">cm</text>
        </svg>
        ${kart([['384.400 km', 'ortalama uzaklık'], ['Lazerle', 'Apollo’nun bıraktığı aynalara ölçülüyor'], ['Yavaşlıyoruz', 'Dünya’nın dönüşü de azar azar yavaşlıyor']])}
      </div>`;
    },
    not: ['Ay Lazer Menzil Ölçümü.', 'Kaynak: NASA'],
  },
  {
    no: '07', ad: 'gezegenler-dunya-ay-arasi', tema: { bg: '#0b1a3d', ink: '#eef2f8', acc: '#7dd3fc' },
    ust: ['Ölçekli', 'Ay en uzaktayken'],
    bas: [['Bütün gezegenler', 'ink'], ['Dünya ile Ay’ın', 'acc'], ['arasına sığar.', 'ink']],
    deck: 'Ay en uzak noktasındayken (405.500 km) aradaki boşluğa öteki yedi gezegen yan yana sığar; geriye bir Dünya’lık yer bile kalır.',
    gorsel: () => {
      const W = 936, s = W / (405500 + 6371 + 1737); // px/km, merkezler arası 405.500 km
      const P = [['Merkür', 2440, '#b9b2a6'], ['Venüs', 6052, '#efd9a6'], ['Mars', 3390, '#e0723f'], ['Jüpiter', 69911, '#e3c49a'], ['Satürn', 58232, '#f0dcae'], ['Uranüs', 25362, '#a8e6ef'], ['Neptün', 24622, '#6f95ff']];
      const cy = 214, rE = 6371 * s;
      let x = 2 * rE, svg = '', lab = '';
      for (const [ad, r, c] of P) {
        const rp = r * s; x += rp;
        svg += `<circle cx="${x.toFixed(1)}" cy="${cy}" r="${rp.toFixed(1)}" fill="${c}"/>`;
        if (rp > 40) lab += `<text x="${x.toFixed(1)}" y="${cy + rp + 34}" text-anchor="middle" class="svgl">${ad.toUpperCase()}</text>`;
        else { const dy = { Merkür: 46, Venüs: 82, Mars: 118 }[ad]; lab += `<text x="${(x + 6).toFixed(1)}" y="${cy - dy}" text-anchor="end" class="svgs">${ad.toUpperCase()}</text><line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${cy - dy + 6}" y2="${cy - rp - 4}" style="stroke:var(--ink)" stroke-width="1" opacity=".6"/>`; }
        x += rp;
      }
      const xm = W - 1737 * s;
      return `<div class="hat"><svg viewBox="0 0 936 420" width="936" height="420" style="overflow:visible">
        <circle cx="${rE.toFixed(1)}" cy="${cy}" r="${rE.toFixed(1)}" fill="#3b82f6"/>
        <text x="0" y="${cy + 48}" class="svgl" style="fill:var(--acc)">DÜNYA</text>
        ${svg}${lab}
        <circle cx="${xm.toFixed(1)}" cy="${cy}" r="${Math.max(2, 1737 * s).toFixed(1)}" fill="#d9d6cf"/>
        <text x="${W}" y="${cy + 48}" text-anchor="end" class="svgl" style="fill:var(--acc)">AY</text>
        <line x1="${x.toFixed(1)}" x2="${(xm - 6).toFixed(1)}" y1="${cy + 98}" y2="${cy + 98}" style="stroke:var(--acc)" stroke-width="2"/>
        <text x="${W}" y="${cy + 124}" text-anchor="end" class="svgs" style="fill:var(--acc)">ARTAN BOŞLUK ~17.000 KM</text>
        <line x1="${rE.toFixed(1)}" x2="${xm.toFixed(1)}" y1="30" y2="30" style="stroke:var(--ink)" stroke-width="1.5" opacity=".5"/>
        <text x="${(W / 2).toFixed(1)}" y="18" text-anchor="middle" class="svgs">405.500 KM</text>
      </svg></div>`;
    },
    not: ['Çaplar ve uzaklık ölçekli.', 'Satürn’ün halkaları hariç.'],
  },
  {
    no: '08', ad: 'neptun-bir-tur', tema: { bg: '#24124a', ink: '#f1eefa', acc: '#8fb1ff' },
    ust: ['Neptün', 'Bir yıl · 164,8 Dünya yılı'],
    bas: [['Neptün,', 'ink'], ['keşfinden beri', 'ink'], ['yalnızca 1 tur', 'acc'], ['attı.', 'ink']],
    deck: null,
    gorsel: () => {
      const rows = [['Merkür', '88 gün'], ['Venüs', '225 gün'], ['Dünya', '365 gün'], ['Mars', '687 gün'], ['Jüpiter', '11,9 yıl'], ['Satürn', '29,5 yıl'], ['Uranüs', '84 yıl'], ['Neptün', '164,8 yıl']];
      return `<div class="neptun">
        <svg viewBox="0 0 440 440" width="440" height="440">
          <circle cx="220" cy="220" r="170" fill="none" style="stroke:var(--ink)" stroke-width="1.5" stroke-dasharray="3 7" opacity=".55"/>
          <path d="M220 50 A170 170 0 1 1 205 50.7" fill="none" style="stroke:var(--acc)" stroke-width="5" stroke-linecap="round"/>
          <path d="M196 42 l12 9 l-12 9" fill="none" style="stroke:var(--acc)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="220" cy="220" r="16" fill="#ffc94a"/>
          <circle cx="220" cy="50" r="15" fill="#5f88ff"/>
          <text x="244" y="34" class="svgl" style="fill:var(--acc)">1846 · KEŞİF</text>
          <text x="244" y="84" class="svgl">2011 · İLK TUR</text>
          <text x="220" y="262" text-anchor="middle" class="svgs">GÜNEŞ</text>
        </svg>
        <div class="liste"><div class="lbas">Bir yıl ne kadar?</div>${rows.map(([a, b]) => `<div class="li${a === 'Neptün' ? ' hi' : ''}"><span>${a}</span><b>${b}</b></div>`).join('')}</div>
      </div>`;
    },
    not: ['Neptün 1846’da keşfedildi.', 'Kaynak: NASA'],
  },
  {
    no: '09', ad: 'olympus-mons', tema: { bg: '#a8381a', ink: '#fcebd9', acc: '#1c0d07' },
    ust: ['Mars', 'Olympus Mons'],
    bas: [['Mars’taki dağ,', 'ink'], ['Everest’in', 'ink'], ['2,5 katı.', 'acc']],
    deck: 'Güneş Sistemi’nin en yüksek yanardağı: yaklaşık <em>22 km</em>. Tabanı ~600 km genişliğinde.',
    gorsel: () => {
      const G = 390, K = 16.4; // zemin y ve px/km (dikey ölçek)
      const yE = G - 8.849 * K, yO = G - 21.9 * K, yU = G - 11 * K;
      // Olympus: geniş kalkan yanardağ, tepede kaldera
      let d = `M300 ${G}`;
      for (let i = 0; i <= 60; i++) { const u = i / 60, x = 300 + u * 620, e = 1 - Math.abs(2 * u - 1), h = Math.min(1, e / 0.04) * 6 + 15.9 * Math.pow(e, 1.35); d += ` L${x.toFixed(1)} ${(G - h * K + (Math.abs(u - 0.5) < 0.045 ? 14 : 0)).toFixed(1)}`; }
      d += ' Z';
      return `<div class="dag"><svg viewBox="0 0 936 440" width="936" height="440">
        <line x1="0" x2="936" y1="${yU}" y2="${yU}" style="stroke:var(--ink)" stroke-width="1.2" stroke-dasharray="4 8" opacity=".6"/>
        <text x="0" y="${yU - 10}" class="svgs">YOLCU UÇAĞI · ~11 KM</text>
        <path d="${d}" style="fill:var(--acc)"/>
        <path d="M70 ${G} L150 ${yE} L230 ${G} Z" style="fill:var(--ink)"/>
        <line x1="0" x2="936" y1="${G}" y2="${G}" style="stroke:var(--ink)" stroke-width="3"/>
        <text x="150" y="${yE - 18}" text-anchor="middle" class="svgl">EVEREST</text>
        <text x="150" y="${G + 34}" text-anchor="middle" class="svgs">8.849 M</text>
        <text x="610" y="${yO - 18}" text-anchor="middle" class="svgl">OLYMPUS MONS</text>
        <text x="610" y="${G + 34}" text-anchor="middle" class="svgs">~21,9 KM</text>
      </svg></div>`;
    },
    not: ['Yükseklikler ölçekli,', 'genişlik temsili.'],
  },
  {
    no: '10', ad: 'andromeda-gecmis', tema: { bg: '#09090d', ink: '#f2f0ee', acc: '#ff8fcf' },
    ust: ['Geçmişe bakmak', 'Işığın yolu'],
    bas: [['Andromeda’ya bakınca', 'ink'], ['2,5 milyon yıl', 'acc'], ['öncesini görürsün.', 'ink']],
    deck: 'Gökyüzündeki her ışık, yola çıktığı andan bir kartpostal.',
    gorsel: () => {
      const Y = 365.25 * 86400;
      return serit({
        baslik: 'Işığı ne kadar önce yola çıktı?',
        scale: { type: 'log', min: 1, max: 1e14 }, rowH: 56,
        rows: [
          ['Ay', 1.28, '1,3 saniye'], ['Güneş', 499, '8 dk 19 sn'], ['Sirius', 8.6 * Y, '8,6 yıl'], ['Vega', 25 * Y, '25 yıl'], ['Ülker', 444 * Y, '444 yıl'], ['Betelgeuse', 550 * Y, '~550 yıl'], ['Andromeda', 2.5e6 * Y, '2,5 milyon yıl'],
        ].map(([ad, v, etiket]) => ({ ad, v, etiket, hi: ad === 'Andromeda' })),
        X1: 640,
      });
    },
    not: ['Çıplak gözle görülebilen', 'en uzak cisimlerden biri.'],
  },
  {
    no: '11', ad: 'iss-16-gun-dogumu', tema: { bg: '#0c6b4a', ink: '#effaf3', acc: '#fff16b' },
    ust: ['Uluslararası Uzay İstasyonu', '~400 km'],
    bas: [['Uzay İstasyonu’nda', 'ink'], ['günde 16 kez', 'acc'], ['Güneş doğar.', 'ink']],
    deck: null,
    gorsel: () => {
      let gd = '';
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 - Math.PI / 2, x = 220 + Math.cos(a) * 200, y = 220 + Math.sin(a) * 200;
        gd += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" style="fill:var(--acc)"/>`;
      }
      return `<div class="iss">
        <svg viewBox="0 0 440 440" width="440" height="440">
          <defs><clipPath id="yer"><circle cx="220" cy="220" r="118"/></clipPath></defs>
          <circle cx="220" cy="220" r="118" fill="#2f7fd6"/>
          <rect x="220" y="90" width="140" height="260" fill="#071b2e" opacity=".7" clip-path="url(#yer)"/>
          <circle cx="220" cy="220" r="150" fill="none" style="stroke:var(--ink)" stroke-width="2" stroke-dasharray="2 8"/>
          <rect x="${220 + 150 * Math.cos(-0.7) - 9}" y="${220 + 150 * Math.sin(-0.7) - 4}" width="18" height="8" style="fill:var(--ink)"/>
          ${gd}
        </svg>
        ${kart([['~92 dk', 'Dünya çevresinde bir tur'], ['28.000 km/sa', 'yörünge hızı'], ['~16 tur', 'bir günde: her turda bir gün doğumu, bir gün batımı']])}
      </div>`;
    },
    not: ['Yükseklik ~400 km.', 'Kaynak: NASA'],
  },
];

/* ======================= Sayfa ======================= */

function sayfa(p) {
  const { bg, ink, acc } = p.tema;
  const bas = p.bas.map(([t, c], i) => `<span class="hl ${c}" data-fit="${i}">${t}</span>`).join('');
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="../kalici-isik-yolculugu/fonts/fonts.css">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
:root { --bg: ${bg}; --ink: ${ink}; --acc: ${acc}; }
html, body { width: 1080px; height: 1350px; background: var(--bg); }
.page { position: relative; width: 1080px; height: 1350px; overflow: hidden; background: var(--bg); color: var(--ink);
  font-family: 'Inter Tight', sans-serif; -webkit-font-smoothing: antialiased; display: flex; flex-direction: column; padding: 84px 72px 0; }
.grid { position: absolute; inset: 0; background-image: linear-gradient(90deg, color-mix(in srgb, var(--ink) 8%, transparent) 1px, transparent 1px); background-size: 108px 100%; background-position: 72px 0; pointer-events: none; }
.top { position: relative; display: flex; justify-content: space-between; align-items: baseline; font-family: 'IBM Plex Mono', monospace;
  font-size: 21px; letter-spacing: 0.14em; text-transform: uppercase; border-top: 3px solid var(--ink); padding-top: 16px; }
.top b { font-weight: 500; }
.head { position: relative; margin-top: 26px; font-weight: 900; letter-spacing: -0.045em; line-height: 0.9; }
.hl { display: block; white-space: nowrap; width: max-content; }
.hl.acc { color: var(--acc); }
.deck { position: relative; margin-top: 22px; font-size: 31px; font-weight: 500; line-height: 1.24; letter-spacing: -0.01em; max-width: 900px; }
.deck em { font-style: normal; color: var(--acc); }
.viz { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: center; }
.foot { position: absolute; left: 72px; right: 72px; top: 1212px; border-top: 3px solid var(--ink); padding-top: 18px; display: flex; justify-content: space-between; align-items: center; }
.brand { display: flex; align-items: center; gap: 14px; font-size: 30px; font-weight: 800; letter-spacing: -0.02em; }
.brand svg { width: 52px; height: 52px; }
.note { font-family: 'IBM Plex Mono', monospace; font-size: 16px; line-height: 1.45; text-align: right; opacity: 0.85; letter-spacing: 0.02em; }
.svgl { font-family: 'IBM Plex Mono', monospace; font-size: 19px; font-weight: 500; letter-spacing: 0.12em; fill: var(--ink); }
.svgs { font-family: 'IBM Plex Mono', monospace; font-size: 15px; letter-spacing: 0.12em; fill: var(--ink); opacity: .85; }
.svgbig { font-family: 'Inter Tight', sans-serif; font-size: 56px; font-weight: 900; letter-spacing: -0.03em; fill: var(--bg); }
/* şerit tablo */
.serit { position: relative; width: 936px; }
.sbas { position: absolute; left: 0; top: 0; font-family: 'IBM Plex Mono', monospace; font-size: 17px; letter-spacing: 0.14em; text-transform: uppercase; opacity: .85; }
.sr { position: absolute; left: 0; width: 936px; height: 0; }
.sr .ad { position: absolute; left: 0; top: -19px; font-size: 32px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
.sr .val { position: absolute; right: 0; top: -16px; font-family: 'IBM Plex Mono', monospace; font-size: 26px; font-weight: 500; line-height: 1; }
.sr .iz { position: absolute; top: -1.5px; height: 3px; background: var(--ink); opacity: .85; }
.sr .iz2 { position: absolute; top: -0.5px; height: 1px; background: var(--ink); opacity: .22; }
.sr .dot { position: absolute; top: 0; border-radius: 50%; background: var(--ink); box-shadow: 0 0 0 4px var(--bg); }
.sr.hi .ad, .sr.hi .val { color: var(--acc); }
.sr.hi .iz { background: var(--acc); opacity: 1; height: 5px; top: -2.5px; }
.sr.hi .dot { background: var(--acc); }
.tk { position: absolute; border-left: 1px dashed color-mix(in srgb, var(--ink) 30%, transparent); }
.tk span { position: absolute; left: 6px; top: -2px; font-family: 'IBM Plex Mono', monospace; font-size: 15px; opacity: .75; white-space: nowrap; }
.mk { position: absolute; border-left: 2px solid var(--acc); }
.mk span { position: absolute; left: 8px; top: -4px; font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 500; letter-spacing: .1em; color: var(--acc); white-space: nowrap; }
/* kartlar */
.kartlar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border-top: 1.5px solid var(--ink); }
.kart { padding: 16px 16px 0 0; }
.kart + .kart { padding-left: 18px; border-left: 1.5px solid color-mix(in srgb, var(--ink) 35%, transparent); }
.kart b { display: block; font-size: 40px; font-weight: 900; letter-spacing: -0.03em; line-height: 1; color: var(--acc); }
.kart span { display: block; margin-top: 8px; font-size: 19px; font-weight: 500; line-height: 1.25; }
/* Venüs */
.venus { display: flex; flex-direction: column; gap: 34px; }
.vlab { font-family: 'IBM Plex Mono', monospace; font-size: 19px; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 10px; }
.vrow { display: flex; align-items: center; gap: 20px; }
.vfill { height: 64px; background: var(--ink); }
.vbar.a .vfill { background: var(--acc); }
.vnum { font-size: 76px; font-weight: 900; letter-spacing: -0.04em; line-height: 1; }
.vnum small { font-size: 32px; letter-spacing: -0.01em; }
.vbar.a .vnum { color: var(--acc); }
.vnot { display: flex; gap: 20px; align-items: center; border-top: 1.5px solid var(--ink); padding-top: 22px; }
.vnot .ok { font-size: 64px; font-weight: 900; line-height: 1; color: var(--acc); }
.vnot p { font-size: 27px; line-height: 1.3; font-weight: 500; }
/* Güneş, cetvel, ISS */
.gunes, .cetvel { display: flex; flex-direction: column; gap: 6px; }
.gunes svg { margin-bottom: -10px; }
.neptun, .iss { display: flex; align-items: center; gap: 36px; }
.iss { flex-direction: row; }
.iss .kartlar { grid-template-columns: 1fr; border-top: 0; flex: 1; }
.iss .kart { padding: 14px 0; border-left: 0 !important; padding-left: 0 !important; border-top: 1.5px solid color-mix(in srgb, var(--ink) 35%, transparent); }
.liste { flex: 1; }
.lbas { font-family: 'IBM Plex Mono', monospace; font-size: 18px; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 10px; opacity: .85; }
.li { display: flex; justify-content: space-between; align-items: baseline; padding: 7px 0; border-top: 1px solid color-mix(in srgb, var(--ink) 25%, transparent); font-size: 27px; font-weight: 800; letter-spacing: -0.01em; }
.li b { font-family: 'IBM Plex Mono', monospace; font-weight: 500; font-size: 24px; }
.li.hi { color: var(--acc); }
${debug ? '.crop { position: absolute; left: 0; right: 0; top: 135px; height: 1080px; outline: 4px solid #0f0; z-index: 9; pointer-events: none; }' : ''}
</style></head><body><div class="page">
<div class="grid"></div>
<div class="top"><b>№ ${p.no} · ${p.ust[0]}</b><span>${p.ust[1]}</span></div>
<h1 class="head">${bas}</h1>
${p.deck ? `<p class="deck">${p.deck}</p>` : ''}
<div class="viz">${p.gorsel()}</div>
<div class="foot"><div class="brand">${LOGO}<span>spacetour.com.tr</span></div><div class="note">${p.not.join('<br>')}</div></div>
${debug ? '<div class="crop"></div>' : ''}
</div>
<script>
  // Başlık satırları: her satır 936 px'e sığacak en büyük boyda; vurgulu satır daha iri olabilir
  const MAX = { ink: 112, acc: 150 };
  for (const el of document.querySelectorAll('.hl')) {
    let fs = el.classList.contains('acc') ? MAX.acc : MAX.ink;
    el.style.fontSize = fs + 'px';
    while (el.getBoundingClientRect().width > 936 && fs > 40) { fs -= 2; el.style.fontSize = fs + 'px'; }
  }
  // Satırlar arasında tutarlı ritim: beyaz satırlar aynı boyda (en küçüğü)
  const inks = [...document.querySelectorAll('.hl:not(.acc)')];
  const min = Math.min(...inks.map((e) => parseFloat(e.style.fontSize)));
  inks.forEach((e) => { e.style.fontSize = min + 'px'; });
  window.__ok = true;
</script>
</body></html>`;
}

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
for (const p of POSTS.filter((x) => !only || x.no === only)) {
  const file = path.join(DIR, `out-${p.no}.html`);
  fs.writeFileSync(file, sayfa(p));
  await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => window.__ok);
  await new Promise((r) => setTimeout(r, 300));
  const rep = await page.evaluate(() => {
    const b = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)]; };
    const vizChild = document.querySelector('.viz > *');
    const vr = vizChild.getBoundingClientRect();
    return { head: b('.head'), deck: b('.deck'), vizIcerik: [Math.round(vr.top), Math.round(vr.bottom)], viz: b('.viz'), sizes: [...document.querySelectorAll('.hl')].map((e) => e.style.fontSize).join(' ') };
  });
  const tasma = rep.vizIcerik[1] > 1196 || rep.vizIcerik[0] < (rep.deck ?? rep.head)[1] + 10;
  console.log(`№ ${p.no} ${p.ad}  başlık ${rep.head} [${rep.sizes}]  görsel ${rep.vizIcerik}${tasma ? '  ⚠ TAŞMA' : ''}`);
  await page.screenshot({ path: debug ? path.join(DIR, `out-debug-${p.no}.png`) : path.join(OUT_DIR, `kalici-${p.no}-${p.ad}.png`) });
}
await browser.close();
