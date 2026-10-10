// Dolunay ve yeni Ay olaylarını efemeristen üretir → src/data/lunarEvents.ts
//   node tools/data/ay-evreleri.mjs          (dosyayı yazar)
//   node tools/data/ay-evreleri.mjs --kuru   (yalnızca listeler)
// Elle yazılmış ay evresi tarihleri 9–10 gün kaymıştı; bu veri artık hep hesaptan gelir.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createJiti } from 'jiti';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const jiti = createJiti(import.meta.url, { alias: { '@': path.join(ROOT, 'src') } });
const { mainPhasesBetween } = await jiti.import(path.join(ROOT, 'src/lib/astrology/lunarCalendar.ts'));
const { SIGN_NAMES } = await jiti.import(path.join(ROOT, 'src/lib/astrology/dailySky.ts'));
const { getMoonEquatorial, getSunEquatorial } = await jiti.import(path.join(ROOT, 'src/lib/astrophysics/skyDomeEphemeris.ts'));

const YEARS = [2026, 2027, 2028];
const DAY = 86_400_000;
const TZ = 'Europe/Istanbul';
const SUPER_KM = 362_500; // perijeye yakın dolunay (yaygın tanım: ~360–362 bin km altı)
const MICRO_KM = 405_000; // apojeye yakın dolunay

const isoDay = (d) => d.toLocaleDateString('sv-SE', { timeZone: TZ });
const hhmm = (d) => d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
const monthOf = (d) => Number(isoDay(d).slice(5, 7)) - 1;

// Geleneksel dolunay adları (Kuzey Amerika kökenli, Türkçe basında da yaygın)
const MONTHLY = ['Kurt', 'Kar', 'Solucan', 'Pembe', 'Çiçek', 'Çilek', 'Geyik', 'Mersin Balığı', 'Mısır', 'Avcı', 'Kunduz', 'Soğuk'];
const ORIGIN = {
  Kurt: 'Adını, kış gecelerinde açlıktan uluyan kurtlardan alır.',
  Kar: 'Kuzey yarımkürede karın en yoğun yağdığı aydan adını alır.',
  Solucan: 'Toprağın çözülüp solucanların yüzeye çıktığı bahar başından adını alır.',
  Pembe: 'Baharda açan pembe yabani çiçeklerden adını alır; Ay pembe görünmez.',
  Çiçek: 'Mayısta açan çiçeklerin bolluğundan adını alır.',
  Çilek: 'Yabani çileklerin toplandığı mevsimden adını alır.',
  Geyik: 'Erkek geyiklerin yeni boynuzlarının çıktığı aydan adını alır.',
  'Mersin Balığı': 'Göllerde mersin balığının en kolay avlandığı yaz sonundan adını alır.',
  Mısır: 'Mısır hasadının yapıldığı eylülden adını alır.',
  Hasat: 'Sonbahar ekinoksuna en yakın dolunaydır; Ay birkaç akşam üst üste gün batımına yakın doğar ve eskiden çiftçilere hasat için ışık verirdi.',
  Avcı: 'Hasat Dolunayı’ndan sonraki dolunaydır; hasadı biten tarlalarda avcılara ışık verdiği için bu adı alır.',
  Kunduz: 'Kunduzların kış için baraj kurduğu ve tuzakların kurulduğu aydan adını alır.',
  Soğuk: 'Uzun ve soğuk kış gecelerinden adını alır; yılın en yüksekte seyreden dolunaylarındandır.',
};
const dolunayName = (n) => (n === 'Soğuk' || n === 'Pembe' ? `${n} Dolunay` : `${n} Dolunayı`);

/** Sonbahar ekinoksu (Güneş boylamı 180°) */
function equinox(year) {
  let lo = Date.UTC(year, 8, 15), hi = Date.UTC(year, 8, 30);
  const f = (t) => ((getSunEquatorial(new Date(t)).lambda - 180 + 540) % 360) - 180;
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (f(m) < 0) lo = m; else hi = m; }
  return hi;
}

const all = mainPhasesBetween(Date.UTC(YEARS[0] - 1, 11, 1), Date.UTC(YEARS.at(-1) + 1, 0, 15));
const fulls = all.filter((p) => p.key === 'full');
const news = all.filter((p) => p.key === 'new');
if (!fulls.length || !news.length) throw new Error('Evre anahtarları beklenenden farklı: ' + [...new Set(all.map((p) => p.key))].join(','));

const out = [];
for (const year of YEARS) {
  const eq = equinox(year);
  const harvest = fulls.reduce((a, b) => (Math.abs(b.at - eq) < Math.abs(a.at - eq) ? b : a));
  const hunter = fulls.find((p) => p.at > harvest.at);
  const yearFulls = fulls.filter((p) => isoDay(p.at).startsWith(String(year)));
  for (const p of yearFulls) {
    const m = monthOf(p.at);
    const blue = yearFulls.some((q) => q !== p && monthOf(q.at) === m && q.at < p.at);
    let base = p === harvest ? 'Hasat' : p === hunter ? 'Avcı' : MONTHLY[m];
    // Hasat ekimde ise eylülünki Mısır, Avcı kasıma kayar
    const dist = getMoonEquatorial(p.at).distanceKm;
    const isSuper = dist < SUPER_KM, isMicro = dist > MICRO_KM;
    const name = blue ? 'Mavi Ay' : dolunayName(base);
    const title = isSuper ? `${name} (Süper Ay)` : name;
    const sign = SIGN_NAMES[p.sign];
    const extra = isSuper
      ? ` Ay, Dünya’ya yaklaşık ${(Math.round(dist / 1000) * 1000).toLocaleString("tr-TR")} km uzaklıkla yörüngesinin en yakın kesimine yakın: sıradan bir dolunaydan biraz daha büyük ve parlak görünür.`
      : isMicro
        ? ` Ay bu kez Dünya’dan uzakta (yaklaşık ${(Math.round(dist / 1000) * 1000).toLocaleString("tr-TR")} km): yılın en küçük görünen dolunaylarından, bir “mikro ay”.`
        : '';
    out.push({
      id: `fm-${isoDay(p.at)}`,
      title,
      type: isSuper ? 'super-ay' : 'dolunay',
      date: isoDay(p.at),
      time: hhmm(p.at),
      description: `${blue ? 'Aynı ay içindeki ikinci dolunay, halk arasında “Mavi Ay”.' : `${dolunayName(base)}: ${ORIGIN[base]}`} Ay ${sign} burcunda.`,
      details: `Dolunay anı İstanbul saatiyle ${hhmm(p.at)}. Ay gün batımında doğudan doğar ve bütün gece gökyüzünde kalır.${extra} Dolunay gecesi sönük yıldızlar ve meteorlar Ay ışığında kaybolur; Ay yüzeyini incelemek için ise birkaç gün önce ya da sonrası daha iyidir.`,
      visibility: 'tüm-dünya',
      emoji: '🌕',
      km: Math.round(dist),
    });
  }
  for (const p of news.filter((q) => isoDay(q.at).startsWith(String(year)))) {
    const sign = SIGN_NAMES[p.sign];
    out.push({
      id: `nm-${isoDay(p.at)}`,
      title: 'Yeni Ay',
      type: 'yeni-ay',
      date: isoDay(p.at),
      time: hhmm(p.at),
      description: `Ay, Güneş ile aynı doğrultuya geliyor ve görünmez oluyor; ${sign} burcunda yeni Ay.`,
      details: `Yeni Ay anı İstanbul saatiyle ${hhmm(p.at)}. Bu gece ve önceki-sonraki birkaç gece ayın en karanlık geceleri: şehir ışıklarından uzakta Samanyolu, bulutsular ve sönük meteorlar için en iyi zaman. İnce hilal, yeni Ay’dan 1–2 gün sonra gün batımında batı ufkunda belirir.`,
      visibility: 'tüm-dünya',
      emoji: '🌑',
    });
  }
}
out.sort((a, b) => a.date.localeCompare(b.date));

if (process.argv.includes('--kuru')) {
  for (const e of out) console.log(e.date, e.time, e.type.padEnd(8), e.title.padEnd(32), e.km ? `${e.km} km` : '');
} else {
  const rows = out.map(({ km, ...e }) => e);
  const file = `// Bu dosya tools/data/ay-evreleri.mjs ile efemeristen üretilir; elle düzenlemeyin.
import type { AstronomicalEvent } from './events';

export const LUNAR_EVENTS: AstronomicalEvent[] = ${JSON.stringify(rows, null, 2)};
`;
  fs.writeFileSync(path.join(ROOT, 'src/data/lunarEvents.ts'), file);
  console.log(`✓ src/data/lunarEvents.ts (${rows.length} olay)`);
}
