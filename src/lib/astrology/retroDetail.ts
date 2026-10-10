/**
 * Bir retro döneminin ayrıntıları, efemeristen: duruşların tam anı, retro ve gölge boyunca burç
 * değişimleri, Güneş'le kavuşum (Merkür/Venüs: iç kavuşum) ya da karşı konum (dış gezegenler)
 * ve retrodan sonra İstanbul'dan görünürlük penceresi.
 */

import { planetGeocentric, type GeocentricPlanet } from '@/lib/astrophysics/skyDomeEphemeris';
import { ISTANBUL_SITE } from '@/lib/astrophysics/skyTonight';
import { getLocalSiderealTime, raDecToAltAz } from '@/utils/astronomy';
import { exactRetro } from './retrogradeCalendar';
import { longitude, sunEvent } from './dailySky';

const DAY = 86_400_000;
const MIN = 60_000;
const wrap180 = (d: number) => ((d + 540) % 360) - 180;
const sign = (lon: number) => Math.floor((((lon % 360) + 360) % 360) / 30);

export interface Ingress {
  at: number;
  /** Girilen burç (0 = Koç) */
  sign: number;
  /** Gezegen o sırada geri mi gidiyor */
  retro: boolean;
}

export interface Visibility {
  /** Sabah (gün doğumundan önce doğu ufku) ya da akşam (gün batımından sonra batı ufku) */
  when: 'sabah' | 'akşam';
  /** İstanbul'dan, Güneş ufkun altındayken (doğumdan önce / batımdan sonra 45 dk) 5°'nin üstünde olduğu ilk ve son gün */
  from: number;
  to: number;
  /** En iyi gün ve o günkü yükseklik (°) */
  best: number;
  altitude: number;
}

export interface RetroDetail {
  sr: number;
  sd: number;
  lonSR: number;
  lonSD: number;
  days: number;
  preShadow: number;
  postShadow: number;
  ingresses: Ingress[];
  /** Merkür/Venüs: iç kavuşum (Güneş'in önünden geçiş); dış gezegenler: karşı konum (opozisyon) */
  sunAlignment: { at: number; kind: 'iç kavuşum' | 'karşı konum' } | null;
  /** İç gezegenler için retrodan sonraki sabah görünürlüğü, dış gezegenler için karşı konum gecesi */
  visibility: Visibility | null;
}

function bisect(f: (t: number) => boolean, lo: number, hi: number) {
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) === f(lo)) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Gezegenin İstanbul'daki yüksekliği (°) */
function altitude(key: GeocentricPlanet, t: number) {
  const g = planetGeocentric(key, new Date(t));
  return raDecToAltAz(g.ra, g.dec, ISTANBUL_SITE.latitude, getLocalSiderealTime(new Date(t), ISTANBUL_SITE.longitude)).alt;
}

/** İç gezegen: sabah ya da akşam ufkundaki görünürlük penceresi (gün doğumu −45 dk / gün batımı +45 dk) */
function twilightWindow(key: GeocentricPlanet, start: number, days: number, when: 'sabah' | 'akşam'): Visibility | null {
  let from = 0, to = 0, best = 0, bestAlt = -90;
  for (let d = 0; d <= days; d++) {
    const day = new Date(start + d * DAY);
    const t = when === 'sabah' ? sunEvent(day, true).getTime() - 45 * MIN : sunEvent(day, false).getTime() + 45 * MIN;
    const alt = altitude(key, t);
    if (alt > bestAlt) { bestAlt = alt; best = t; }
    if (alt >= 5) { if (!from) from = t; to = t; }
  }
  return from ? { when, from, to, best, altitude: bestAlt } : null;
}

export function retroDetail(glyph: string, startDate: string): RetroDetail | null {
  const ex = exactRetro(glyph, startDate);
  if (!ex) return null;
  const { key, sr, sd, lonSR, lonSD, preShadow, postShadow } = ex;
  const lon = ex.lon;

  // Gölge başından gölge sonuna burç değişimleri
  const ingresses: Ingress[] = [];
  const step = 6 * 3_600_000;
  for (let t = preShadow; t < postShadow; t += step) {
    const a = sign(lon(t)), b = sign(lon(t + step));
    if (a !== b) {
      const at = bisect((x) => sign(lon(x)) === a, t, t + step);
      ingresses.push({ at, sign: b, retro: at > sr && at < sd });
    }
  }

  // Güneş'le hizalanma: iç gezegenlerde kavuşum, dış gezegenlerde karşı konum (retronun ortasına düşer)
  const inner = key === 'mercury' || key === 'venus';
  const target = inner ? 0 : 180;
  const diff = (t: number) => wrap180(lon(t) - longitude('sun', new Date(t)) - target);
  let sunAlignment: RetroDetail['sunAlignment'] = null;
  for (let t = sr; t < sd; t += DAY) {
    if (Math.sign(diff(t)) !== Math.sign(diff(t + DAY)) && Math.abs(diff(t)) < 30) {
      sunAlignment = { at: bisect((x) => diff(x) > 0, t, t + DAY), kind: inner ? 'iç kavuşum' : 'karşı konum' };
      break;
    }
  }

  // Görünürlük: iç gezegen kavuşumdan sonra sabah yıldızı olur; dış gezegen karşı konumda bütün gece görünür
  let visibility: Visibility | null = null;
  if (inner && sunAlignment) {
    visibility = twilightWindow(key, sunAlignment.at + 3 * DAY, key === 'mercury' ? 40 : 120, 'sabah');
  } else if (sunAlignment) {
    // Karşı konum gecesi (İstanbul'da gün batımından ertesi gün doğumuna): en yüksek olduğu an
    const day = new Date(sunAlignment.at);
    const dusk = sunEvent(day, false).getTime();
    const dawn = sunEvent(new Date(dusk + DAY / 2), true).getTime();
    let best = dusk, bestAlt = -90;
    for (let t = dusk; t <= dawn; t += 10 * MIN) {
      const alt = altitude(key, t);
      if (alt > bestAlt) { bestAlt = alt; best = t; }
    }
    visibility = { when: 'akşam', from: sunAlignment.at - 30 * DAY, to: sunAlignment.at + 30 * DAY, best, altitude: bestAlt };
  }

  return {
    sr,
    sd,
    lonSR,
    lonSD,
    days: Math.round((sd - sr) / DAY),
    preShadow,
    postShadow,
    ingresses,
    sunAlignment,
    visibility,
  };
}

/** Bir anın Güneş'e göre uzanımı (°), görünürlük metinleri için */
export function elongationAt(key: GeocentricPlanet, t: number) {
  return planetGeocentric(key, new Date(t)).elongation;
}

