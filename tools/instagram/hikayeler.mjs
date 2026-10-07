// Günlük burç hikâyeleri (1080×1920, 9:16): her gün için 1 kapak + 4 element sayfası (her birinde 3 burç).
// Yorumlar sitenin günlük burç motorundan (src/lib/astrology/dailyHoroscope.ts) gelir; sitedeki yorumla birebir aynıdır.
//   node tools/instagram/hikayeler.mjs                    → 7–13 Ekim 2026
//   node tools/instagram/hikayeler.mjs 2026-10-14 7       → başlangıç günü ve gün sayısı
// Çıktı: tools/instagram/cikti/hikaye/<gün>/0-kapak.png, 1-ates.png, 2-toprak.png, 3-hava.png, 4-su.png

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import { createJiti } from 'jiti';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, '../..');
const OUT = path.join(DIR, 'cikti', 'hikaye');
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const jiti = createJiti(import.meta.url, { alias: { '@': path.join(ROOT, 'src') } });
const { logoSmallSvg } = await jiti.import(path.join(ROOT, 'src/lib/logoSvg.ts'));
const { dailyReading } = await jiti.import(path.join(ROOT, 'src/lib/astrology/dailyHoroscope.ts'));
const { ZODIAC_SIGNS } = await jiti.import(path.join(ROOT, 'src/data/zodiac.ts'));
const LOGO = logoSmallSvg({ background: false, id: 'h' });
const img = (file) => pathToFileURL(path.join(ROOT, 'public/images/space', file)).href;
const HALL = 'Sidney Hall, Urania’s Mirror (1824)';

const ELEMENTS = [
  { id: 'ates', name: 'Ateş', element: 'Ateş', accent: '#fb923c', image: img('sidney-hall-urania-s-mirror-leo-major-and-leo-minor-ae1988.jpg') },
  { id: 'toprak', name: 'Toprak', element: 'Toprak', accent: '#a3c585', image: img('taurus-sidy-hall-sculpt-lccn2002695510-e1e39a.jpg') },
  { id: 'hava', name: 'Hava', element: 'Hava', accent: '#7dd3fc', image: img('sidney-hall-urania-s-mirror-libra-58ab4d.jpg') },
  { id: 'su', name: 'Su', element: 'Su', accent: '#a5b4fc', image: img('sidney-hall-urania-s-mirror-scorpio-fb50ba.jpg') },
];

const dateLabel = (d) => d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', timeZone: 'Europe/Istanbul' });
const weekday = (d) => d.toLocaleDateString('tr-TR', { weekday: 'long', timeZone: 'Europe/Istanbul' });

function storiesFor(day) {
  const date = new Date(`${day}T12:00:00+03:00`);
  const kicker = `${dateLabel(date)} · ${weekday(date)}`;
  const any = dailyReading('koc', date);
  const rows = [
    { label: 'Ay bugün', value: `${any.moonIn} · ${any.phaseName}`, note: any.moonMood },
    { label: 'Günün odağı', value: any.moonFocus },
    { label: 'Günün yöneticisi', value: any.dayRuler + (any.mercuryRetro ? ' · Merkür geri harekette' : '') },
  ];
  if (any.moonChange) rows[0].note = `${any.moonChange.split(';')[0]}.`;

  const cover = {
    id: '0-kapak',
    kicker: 'Günlük burç',
    title: dateLabel(date),
    serif: `${weekday(date)}.`,
    size: 140,
    rows,
    elements: ELEMENTS.map((e) => [e.name, e.accent]),
    image: img('fullmoon2010-a02ba6.jpg'),
    position: 'center 20%',
    dim: 0.45,
    credit: 'Gregory H. Revera · CC BY-SA 3.0',
    url: 'spacetour.com.tr/astroloji/gunluk-burc',
  };

  const pages = ELEMENTS.map((e, i) => ({
    id: `${i + 1}-${e.id}`,
    kicker,
    title: e.name,
    serif: 'burçları.',
    size: 108,
    accent: e.accent,
    image: e.image,
    dim: 0.55,
    credit: HALL,
    url: 'Detaylı yorum: spacetour.com.tr/astroloji/gunluk-burc',
    signs: ZODIAC_SIGNS.filter((s) => s.element === e.element).map((s) => {
      const r = dailyReading(s.id, date);
      return {
        symbol: s.symbol,
        name: s.name,
        dates: s.dates,
        area: r.houseArea,
        text: r.headline,
        scores: [['Aşk', r.scores.love], ['İş', r.scores.career], ['Şans', r.scores.luck]],
      };
    }),
  }));

  return [cover, ...pages];
}

async function main() {
  const start = process.argv[2] ?? '2026-10-07';
  const days = Number(process.argv[3] ?? 7);
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, defaultViewport: { width: 1080, height: 1920 }, args: ['--allow-file-access-from-files'] });
  for (let n = 0; n < days; n++) {
    const day = new Date(Date.parse(`${start}T12:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
    const dir = path.join(OUT, day);
    fs.mkdirSync(dir, { recursive: true });
    for (const h of storiesFor(day)) {
      // Her hikâye temiz bir sayfada açılır (önceki verinin karışmaması için)
      const p = await browser.newPage();
      await p.evaluateOnNewDocument((data) => { window.HIKAYE = data; }, { ...h, logo: LOGO });
      await p.goto(pathToFileURL(path.join(DIR, 'hikaye.html')).href, { waitUntil: 'networkidle0' });
      await p.evaluate(() => document.fonts.ready);
      // Uzun bir yorum alttaki künyeye taşarsa uyar
      const overlap = await p.evaluate(() => document.querySelector('.main').getBoundingClientRect().bottom - document.querySelector('.foot').getBoundingClientRect().top);
      if (overlap > -16) console.warn(`! ${day}/${h.id}: içerik künyeye ${Math.round(overlap + 16)}px taşıyor`);
      const file = path.join(dir, `${h.id}.png`);
      await p.screenshot({ path: file });
      await p.close();
      console.log('✓', path.relative(ROOT, file));
    }
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
