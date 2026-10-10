/**
 * Gök olayı sayfaları için hesaplanmış ayrıntılar (İstanbul, Ankara, İzmir):
 * meteor yağmurunda radyantın yüksekliği, Ay ışığı ve en iyi gözlem penceresi;
 * dolunay / yeni Ay'da şehir şehir Ay doğuşu, uzaklık ve burç.
 */

import type { AstronomicalEvent } from '@/data/events';
import { getMoonEquatorial, getSunEquatorial } from '@/lib/astrophysics/skyDomeEphemeris';
import { getLocalSiderealTime, raDecToAltAz } from '@/utils/astronomy';
import { ISS_CITIES, compassName } from '@/lib/issPasses';
import { moonPhase } from '@/lib/sky';
import { moonSign } from '@/lib/astrology/dailySky';

const MIN = 60_000;
const HOUR = 3_600_000;
const ISTANBUL = ISS_CITIES[0];
export const EVENT_CITIES = ISS_CITIES.slice(0, 3);

type Site = { lat: number; lon: number };
const alt = (ra: number, dec: number, t: number, s: Site) => raDecToAltAz(ra, dec, s.lat, getLocalSiderealTime(new Date(t), s.lon));
const sunAlt = (t: number, s: Site) => { const g = getSunEquatorial(new Date(t)); return alt(g.ra, g.dec, t, s).alt; };
const moonPos = (t: number, s: Site) => { const g = getMoonEquatorial(new Date(t)); return alt(g.ra, g.dec, t, s); };

/** `iso` gününün İstanbul saatiyle `hour`:00 anı (UTC ms) */
const localTime = (iso: string, hour: number) => Date.parse(`${iso}T00:00:00+03:00`) + hour * HOUR;

/** [from, to] aralığında f'nin işaret değiştirdiği ilk an (yükselen = eksiden artıya) */
function crossing(f: (t: number) => number, from: number, to: number, rising: boolean, step = 5 * MIN): number | null {
  let prev = f(from);
  for (let t = from + step; t <= to; t += step) {
    const cur = f(t);
    if (rising ? prev < 0 && cur >= 0 : prev >= 0 && cur < 0) return t - step + (prev / (prev - cur)) * step;
    prev = cur;
  }
  return null;
}

/* ------------------------------ Meteor yağmurları ------------------------------ */

export interface ShowerInfo {
  key: string;
  /** Radyant (J2000, derece) */
  ra: number;
  dec: number;
  /** Takımyıldız / yön tarifi */
  where: string;
  zhr: number;
  speed: number;
  parent: string;
}

// IMO değerleri (radyant zirve gecesindeki konum)
const SHOWERS: ShowerInfo[] = [
  { key: 'Quadrantid', ra: 230, dec: 49, where: 'Çoban (Boötes) ile Ejderha arasında, Büyükayı’nın kuyruğunun altında', zhr: 110, speed: 41, parent: '2003 EH1 asteroidi' },
  { key: 'Lyrid', ra: 271, dec: 34, where: 'Çalgı (Lyra) takımyıldızında, parlak Vega’nın yakınında', zhr: 18, speed: 49, parent: 'C/1861 G1 (Thatcher) kuyruklu yıldızı' },
  { key: 'Eta Aquariid', ra: 338, dec: -1, where: 'Kova (Aquarius) takımyıldızında', zhr: 50, speed: 66, parent: '1P/Halley kuyruklu yıldızı' },
  { key: 'Perseid', ra: 48, dec: 58, where: 'Kahraman (Perseus) takımyıldızında, Kraliçe’nin (Kassiopeia) altında', zhr: 100, speed: 59, parent: '109P/Swift–Tuttle kuyruklu yıldızı' },
  { key: 'Orionid', ra: 95, dec: 16, where: 'Avcı (Orion) takımyıldızının kuzeyinde, Betelgeuse’ün yakınında', zhr: 20, speed: 66, parent: '1P/Halley kuyruklu yıldızı' },
  { key: 'Leonid', ra: 153, dec: 22, where: 'Aslan (Leo) takımyıldızının “orak” biçimli başında', zhr: 15, speed: 71, parent: '55P/Tempel–Tuttle kuyruklu yıldızı' },
  { key: 'Geminid', ra: 112, dec: 33, where: 'İkizler (Gemini) takımyıldızında, Kastor’un yakınında', zhr: 150, speed: 35, parent: '3200 Phaethon asteroidi' },
];

export const showerOf = (e: AstronomicalEvent) => (e.type === 'meteor-yagmuru' ? SHOWERS.find((s) => e.title.includes(s.key) || (s.key === 'Quadrantid' && e.title.includes('Dörtlük'))) ?? null : null);

export interface MeteorDetail {
  shower: ShowerInfo;
  /** Zirve gecesi: tarih akşamından ertesi sabaha */
  dusk: number;
  dawn: number;
  radiantRise: number | null;
  radiantPeak: { at: number; alt: number };
  moon: { illumination: number; set: number | null; rise: number | null; upAtPeak: boolean };
  window: { from: number; to: number } | null;
  rate: number;
}

export function meteorDetail(e: AstronomicalEvent): MeteorDetail | null {
  const shower = showerOf(e);
  if (!shower) return null;
  const s = { lat: ISTANBUL.lat, lon: ISTANBUL.lon };
  const from = localTime(e.date, 15), to = localTime(e.date, 33); // 15:00 → ertesi gün 09:00
  // Astronomik karanlık: Güneş −18°
  const dusk = crossing((t) => -18 - sunAlt(t, s), from, to, true) ?? localTime(e.date, 20);
  const dawn = crossing((t) => -18 - sunAlt(t, s), dusk + HOUR, to, false) ?? localTime(e.date, 29);
  const rAlt = (t: number) => alt(shower.ra, shower.dec, t, s).alt;
  const radiantRise = rAlt(dusk) > 0 ? null : crossing(rAlt, dusk, dawn, true);
  let peak = { at: dusk, alt: -90 };
  for (let t = dusk; t <= dawn; t += 10 * MIN) { const a = rAlt(t); if (a > peak.alt) peak = { at: t, alt: a }; }

  const mAlt = (t: number) => moonPos(t, s).alt;
  const moonSet = crossing(mAlt, dusk, dawn, false);
  const moonRise = crossing(mAlt, dusk, dawn, true);
  const illumination = moonPhase(new Date(peak.at)).illumination;

  // Karanlık ve radyant 20°'nin üstündeyken: Ay ufkun altında ya da çok ince
  const good = (t: number) => rAlt(t) >= 20 && (mAlt(t) < 0 || illumination < 0.25);
  let wFrom = 0, wTo = 0;
  for (let t = dusk; t <= dawn; t += 10 * MIN) if (good(t)) { if (!wFrom) wFrom = t; wTo = t; }
  const window = wFrom ? { from: wFrom, to: wTo } : null;

  // Beklenen saatlik sayı: ZHR × sin(radyant yüksekliği), Ay ışığı varsa yarıya yakın
  const best = window ? window.to : peak.at;
  const moonUp = mAlt(best) > 0 && illumination >= 0.25;
  const rate = Math.max(1, Math.round(shower.zhr * Math.sin((Math.max(rAlt(best), 5) * Math.PI) / 180) * (moonUp ? 0.45 : 0.85)));
  return { shower, dusk, dawn, radiantRise, radiantPeak: peak, moon: { illumination, set: moonSet, rise: moonRise, upAtPeak: mAlt(peak.at) > 0 }, window, rate };
}

/* ------------------------------ Dolunay / yeni Ay ------------------------------ */

export interface LunationDetail {
  at: number;
  full: boolean;
  sign: number;
  distanceKm: number;
  /** Dolunaya en yakın iki akşam (İstanbul saatiyle 14:00 başlangıçları) */
  evenings: number[];
  /** Şehir şehir, her akşam için Ay doğuşu ve yönü */
  cities: { name: string; rises: { rise: number | null; az: number | null }[] }[];
}

export function lunationDetail(e: AstronomicalEvent): LunationDetail | null {
  if (!['dolunay', 'super-ay', 'yeni-ay'].includes(e.type) || !e.time) return null;
  const at = Date.parse(`${e.date}T${e.time}:00+03:00`);
  const full = e.type !== 'yeni-ay';
  const g = getMoonEquatorial(new Date(at));
  // Dolunay öğleden önceyse en dolgun akşamlar önceki akşam ile o akşam; sonraysa o akşam ile ertesi akşam
  const morning = Number(e.time.slice(0, 2)) < 14;
  const first = localTime(e.date, morning ? -10 : 14);
  const evenings = full ? [first, first + 24 * HOUR] : [];
  const cities = full
    ? EVENT_CITIES.map((c) => {
        const site = { lat: c.lat, lon: c.lon };
        // Ay doğuşu: merkezin geosentrik yüksekliği +0,125° (paralaks ve kırılma dahil)
        const f = (t: number) => moonPos(t, site).alt - 0.125;
        return {
          name: c.name,
          rises: evenings.map((ev) => {
            const rise = crossing(f, ev, ev + 14 * HOUR, true);
            return { rise, az: rise ? moonPos(rise, site).az : null };
          }),
        };
      })
    : [];
  return { at, full, sign: moonSign(new Date(at)), distanceKm: g.distanceKm, evenings, cities };
}

export { compassName };
