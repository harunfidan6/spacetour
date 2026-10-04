/**
 * Real-sky inputs for the astrology pages: tropical longitudes of the Sun, Moon and planets,
 * Moon sign changes, void-of-course windows and Chaldean planetary hours, all computed from
 * the site's own ephemeris for İstanbul (Türkiye is on UTC+3 all year).
 */

import { getLocalSiderealTime, raDecToAltAz } from '@/utils/astronomy';
import { getMoonEquatorial, getSunEquatorial, planetGeocentric, type GeocentricPlanet } from '@/lib/astrophysics/skyDomeEphemeris';
import { ISTANBUL_SITE } from '@/lib/astrophysics/skyTonight';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const TZ_OFFSET = 3 * HOUR;

export const SIGN_IDS = ['koc', 'boga', 'ikizler', 'yengec', 'aslan', 'basak', 'terazi', 'akrep', 'yay', 'oglak', 'kova', 'balik'] as const;
export const SIGN_NAMES = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];
/** Turkish locative of each sign name ("Koç'ta", "Boğa'da"). */
export const SIGN_IN = ['Koç’ta', 'Boğa’da', 'İkizler’de', 'Yengeç’te', 'Aslan’da', 'Başak’ta', 'Terazi’de', 'Akrep’te', 'Yay’da', 'Oğlak’ta', 'Kova’da', 'Balık’ta'];

export type SkyBody = 'sun' | 'moon' | 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn';
export const BODY_NAMES: Record<SkyBody, string> = {
  sun: 'Güneş', moon: 'Ay', mercury: 'Merkür', venus: 'Venüs', mars: 'Mars', jupiter: 'Jüpiter', saturn: 'Satürn',
};

const norm = (d: number) => ((d % 360) + 360) % 360;
const wrap180 = (d: number) => ((d + 540) % 360) - 180;

/* ---------- Calendar (İstanbul) ---------- */

/** İstanbul calendar day of a moment: 'YYYY-MM-DD'. */
export function dayKey(date: Date): string {
  return new Date(date.getTime() + TZ_OFFSET).toISOString().slice(0, 10);
}
/** UTC ms of İstanbul local midnight for the day of `date` (+ dayOffset days). */
export function localMidnight(date: Date, dayOffset = 0): number {
  const l = new Date(date.getTime() + TZ_OFFSET);
  return Date.UTC(l.getUTCFullYear(), l.getUTCMonth(), l.getUTCDate() + dayOffset) - TZ_OFFSET;
}
export function localWeekday(date: Date): number {
  return new Date(date.getTime() + TZ_OFFSET).getUTCDay();
}
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: ISTANBUL_SITE.timeZone });
}
/** "Bugün 14:20", "Yarın 09:05", or "6 Ekim 11:40". */
export function formatWhen(date: Date, now: Date): string {
  const diff = Math.round((localMidnight(date) - localMidnight(now)) / DAY);
  const prefix = diff === 0 ? 'Bugün' : diff === 1 ? 'Yarın' : diff === -1 ? 'Dün' : date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', timeZone: ISTANBUL_SITE.timeZone });
  return `${prefix} ${formatTime(date)}`;
}

/* ---------- Positions ---------- */

// Planet longitudes come in the J2000 frame; add general precession so they match the
// Sun and Moon, which are referred to the equinox of date.
const precession = (date: Date) => 1.39697 * ((date.getTime() / DAY + 2440587.5 - 2451545) / 36525);

export function longitude(body: SkyBody, date: Date): number {
  if (body === 'moon') return getMoonEquatorial(date).lambda;
  if (body === 'sun') return getSunEquatorial(date).lambda;
  return norm(planetGeocentric(body as GeocentricPlanet, date).lambda + precession(date));
}
export const signIndex = (lon: number) => Math.floor(norm(lon) / 30) % 12;
export const moonSign = (date: Date) => signIndex(longitude('moon', date));
export const sunSign = (date: Date) => signIndex(longitude('sun', date));

/** Next moment the Moon enters a new sign (≈ every 2.5 days). */
export function nextMoonIngress(from: Date): { at: Date; sign: number } {
  const start = moonSign(from);
  let lo = from.getTime();
  let hi = lo;
  do hi += 2 * HOUR; while (moonSign(new Date(hi)) === start && hi - lo < 4 * DAY);
  lo = hi - 2 * HOUR;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (moonSign(new Date(mid)) === start) lo = mid; else hi = mid;
  }
  return { at: new Date(hi), sign: (start + 1) % 12 };
}
function previousMoonIngress(from: Date): Date {
  const start = moonSign(from);
  let hi = from.getTime();
  let lo = hi;
  do lo -= 2 * HOUR; while (moonSign(new Date(lo)) === start && hi - lo < 4 * DAY);
  hi = lo + 2 * HOUR;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (moonSign(new Date(mid)) === start) hi = mid; else lo = mid;
  }
  return new Date(hi);
}

/* ---------- Void-of-course Moon ---------- */

const ASPECTS = [0, 60, 90, 120, 180];
const ASPECT_BODIES: SkyBody[] = ['sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
const ASPECT_NAMES: Record<number, string> = { 0: 'kavuşum', 60: 'altmışlık', 90: 'kare', 120: 'üçgen', 180: 'karşıt' };

export interface VoidOfCourse {
  /** Last exact Ptolemaic aspect of the Moon in its current sign: the void starts here */
  start: Date;
  /** Moon enters the next sign: the void ends */
  end: Date;
  nextSign: number;
  lastAspect: { body: SkyBody; aspect: string } | null;
  isVoid: boolean;
}

/**
 * Traditional void-of-course Moon: from the Moon's last exact major aspect (conjunction, sextile,
 * square, trine, opposition) to the Sun or a classical planet until it leaves the sign.
 * If the current sign's window is already over, the next sign's window is returned.
 */
export function voidOfCourse(now: Date): VoidOfCourse {
  const ingress = nextMoonIngress(now);
  const entry = previousMoonIngress(now);
  const window = lastAspectBefore(entry, ingress.at);
  const start = window ? window.at : entry;
  const current: VoidOfCourse = {
    start, end: ingress.at, nextSign: ingress.sign,
    lastAspect: window ? { body: window.body, aspect: ASPECT_NAMES[window.aspect] } : null,
    isVoid: now.getTime() >= start.getTime(),
  };
  return current;
}

function lastAspectBefore(from: Date, to: Date): { at: Date; body: SkyBody; aspect: number } | null {
  const step = 20 * 60_000;
  let found: { at: Date; body: SkyBody; aspect: number } | null = null;
  const sep = (t: number, body: SkyBody) => norm(longitude('moon', new Date(t)) - longitude(body, new Date(t)));
  for (const body of ASPECT_BODIES) {
    let t0 = from.getTime();
    let s0 = sep(t0, body);
    for (let t = t0 + step; t <= to.getTime(); t += step) {
      const s1 = sep(t, body);
      for (const a of [...ASPECTS, ...ASPECTS.filter((x) => x > 0 && x < 180).map((x) => 360 - x)]) {
        const f0 = wrap180(s0 - a), f1 = wrap180(s1 - a);
        if (f0 < 0 && f1 >= 0 && f1 - f0 < 30) {
          let lo = t - step, hi = t;
          for (let i = 0; i < 14; i++) {
            const mid = (lo + hi) / 2;
            if (wrap180(sep(mid, body) - a) < 0) lo = mid; else hi = mid;
          }
          if (!found || hi > found.at.getTime()) found = { at: new Date(hi), body, aspect: a > 180 ? 360 - a : a };
        }
      }
      t0 = t; s0 = s1;
    }
  }
  return found;
}

/* ---------- Sun times & planetary hours ---------- */

function sunAltitude(t: number): number {
  const sun = getSunEquatorial(new Date(t));
  return raDecToAltAz(sun.ra, sun.dec, ISTANBUL_SITE.latitude, getLocalSiderealTime(new Date(t), ISTANBUL_SITE.longitude)).alt;
}
/** Sunrise or sunset (h0 = −0.833°) within İstanbul's calendar day of `date`. */
export function sunEvent(date: Date, rising: boolean): Date {
  const start = localMidnight(date);
  const step = 5 * 60_000;
  let prev = sunAltitude(start) + 0.833;
  for (let t = start + step; t <= start + DAY; t += step) {
    const cur = sunAltitude(t) + 0.833;
    if (rising ? prev < 0 && cur >= 0 : prev >= 0 && cur < 0) return new Date(t - step + (prev / (prev - cur)) * step);
    prev = cur;
  }
  return new Date(start + (rising ? 6 : 18) * HOUR); // polar fallback, never reached at 41°N
}

export const CHALDEAN: Exclude<SkyBody, never>[] = ['saturn', 'jupiter', 'mars', 'sun', 'venus', 'mercury', 'moon'];
// Weekday (0 = Sunday) → index of the day ruler in the Chaldean order
const DAY_RULER = [3, 6, 2, 5, 1, 4, 0];

export interface PlanetaryHourSlot {
  index: number; // 0–23 within the planetary day (0–11 day hours, 12–23 night hours)
  ruler: SkyBody;
  start: Date;
  end: Date;
  isDay: boolean;
}

/**
 * The 24 unequal planetary hours of the planetary day containing `date`: the day runs from
 * sunrise to the next sunrise, the first hour belongs to the weekday's ruler and the rest
 * follow the Chaldean order.
 */
export function planetaryHours(date: Date): PlanetaryHourSlot[] {
  let rise = sunEvent(date, true);
  if (date.getTime() < rise.getTime()) rise = sunEvent(new Date(date.getTime() - DAY), true);
  const set = sunEvent(rise, false);
  const nextRise = sunEvent(new Date(rise.getTime() + DAY), true);
  const first = DAY_RULER[localWeekday(rise)];
  const dayLen = (set.getTime() - rise.getTime()) / 12;
  const nightLen = (nextRise.getTime() - set.getTime()) / 12;
  return Array.from({ length: 24 }, (_, i) => {
    const isDay = i < 12;
    const start = isDay ? rise.getTime() + i * dayLen : set.getTime() + (i - 12) * nightLen;
    return { index: i, ruler: CHALDEAN[(first + i) % 7], start: new Date(start), end: new Date(start + (isDay ? dayLen : nightLen)), isDay };
  });
}
export function planetaryHourAt(date: Date): PlanetaryHourSlot {
  const hours = planetaryHours(date);
  return hours.find((h) => date >= h.start && date < h.end) ?? hours[0];
}
