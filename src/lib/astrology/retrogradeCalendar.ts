/**
 * Retrograde calendar computed from the ephemeris, so it never runs out of dates:
 * stations (geocentric longitude turning points) of Mercury–Saturn, with pre/post shadow
 * periods. Hand-written 2026 cycles keep their names and texts (never their dates); other cycles reuse the planet's texts.
 */

import { planetGeocentric, type GeocentricPlanet } from '@/lib/astrophysics/skyDomeEphemeris';
import { PLANETARY_RETROGRADES, type RetrogradeCycle } from '@/data/retrogrades';
import { SIGN_NAMES } from './dailySky';

const DAY = 86_400_000;
const norm = (d: number) => ((d % 360) + 360) % 360;
const wrap180 = (d: number) => ((d + 540) % 360) - 180;
const precession = (t: number) => 1.39697 * ((t / DAY + 2440587.5 - 2451545) / 36525);
const lon = (p: GeocentricPlanet, t: number) => norm(planetGeocentric(p, new Date(t)).lambda + precession(t));
const speed = (p: GeocentricPlanet, t: number) => wrap180(lon(p, t + DAY / 2) - lon(p, t - DAY / 2));
const iso = (t: number) => new Date(t + 3 * 3_600_000).toISOString().slice(0, 10);
const fmtDeg = (l: number) => `${SIGN_NAMES[Math.floor(norm(l) / 30)]} ${Math.floor(norm(l) % 30)}°`;

const PLANETS: { key: GeocentricPlanet; glyph: string; symbol: string; name: string }[] = [
  { key: 'mercury', glyph: 'merkur', symbol: '☿', name: 'Merkür' },
  { key: 'venus', glyph: 'venus', symbol: '♀', name: 'Venüs' },
  { key: 'mars', glyph: 'mars', symbol: '♂', name: 'Mars' },
  { key: 'jupiter', glyph: 'jupiter', symbol: '♃', name: 'Jüpiter' },
  { key: 'saturn', glyph: 'saturn', symbol: '♄', name: 'Satürn' },
];

const ELEMENTS: RetrogradeCycle['elementFocus'][] = ['Ateş', 'Toprak', 'Hava', 'Su'];

// Texts for planets that have no hand-written cycle to borrow from
const MARS_TEXT: Pick<RetrogradeCycle, 'coreThemes' | 'guidance'> = {
  coreThemes: ['Eylem ve motivasyonun gözden geçirilmesi', 'Bastırılmış öfke ve çatışmalar', 'Yarım kalan projeler', 'Bedensel enerji ve dinlenme'],
  guidance: {
    whatToDo: ['Yarım kalan işleri bitirmek', 'Antrenman ve beden rutinini yeniden kurmak', 'Eski bir anlaşmazlığı sakin bir zeminde konuşmak'],
    whatToAvoid: ['Ani kavgalar ve fevri kararlar', 'Riskli fiziksel girişimler', 'Büyük yeni projelere aceleyle başlamak'],
    cosmicLesson: 'Güç, her zaman ileri atılmakta değil; ne zaman duracağını bilmekte de saklıdır.',
  },
};

function bisect(f: (t: number) => boolean, lo: number, hi: number): number {
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) === f(lo)) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Retrograde periods (station retrograde → station direct) overlapping [from, to]. */
function stations(p: GeocentricPlanet, from: number, to: number): { sr: number; sd: number }[] {
  const out: { sr: number; sd: number }[] = [];
  const begin = from - 200 * DAY; // catch a cycle already under way
  let prev = speed(p, begin);
  let sr: number | null = null;
  for (let t = begin + DAY; t <= to + 200 * DAY; t += DAY) {
    const cur = speed(p, t);
    if (prev >= 0 && cur < 0) sr = bisect((x) => speed(p, x) < 0, t - DAY, t);
    if (prev < 0 && cur >= 0 && sr !== null) {
      const sd = bisect((x) => speed(p, x) >= 0, t - DAY, t);
      if (sd >= from && sr <= to) out.push({ sr, sd });
      sr = null;
    }
    prev = cur;
  }
  return out;
}

/** Moment the planet crosses longitude `target` while moving direct, searching from `t` in `dir`. */
function crossing(p: GeocentricPlanet, target: number, t: number, dir: 1 | -1): number {
  const f = (x: number) => wrap180(lon(p, x) - target) >= 0;
  let a = t;
  for (let i = 0; i < 400; i++) {
    const b = a + dir * DAY;
    if (f(a) !== f(b) && Math.abs(wrap180(lon(p, b) - target)) < 20) return bisect(f, Math.min(a, b), Math.max(a, b));
    a = b;
  }
  return t;
}

function computedCycle(planet: (typeof PLANETS)[number], sr: number, sd: number): RetrogradeCycle {
  const lsr = lon(planet.key, sr), lsd = lon(planet.key, sd);
  const template = PLANETARY_RETROGRADES.find((r) => r.planetGlyphKey === planet.glyph);
  const year = new Date(sr).getFullYear();
  return {
    id: `${planet.key}-retro-${iso(sr)}`,
    planet: `${planet.name} Retrosu (${year})`,
    planetSymbol: planet.symbol,
    planetGlyphKey: planet.glyph,
    signRange: `${fmtDeg(lsr)} → ${fmtDeg(lsd)}`,
    startDate: iso(sr),
    endDate: iso(sd),
    preShadowStart: iso(crossing(planet.key, lsd, sr, -1)),
    postShadowEnd: iso(crossing(planet.key, lsr, sd, 1)),
    isCurrentlyRetrograde: false,
    stationDegrees: `${fmtDeg(lsr)} & ${fmtDeg(lsd)}`,
    elementFocus: ELEMENTS[Math.floor(norm(lsr) / 30) % 4],
    coreThemes: template?.coreThemes ?? MARS_TEXT.coreThemes,
    guidance: template?.guidance ?? MARS_TEXT.guidance,
  };
}

/**
 * Retrograde cycles from six months before `now` to eighteen months after, sorted by start.
 * `isCurrentlyRetrograde` reflects `now`.
 */
export function retrogradeCalendar(now: Date): RetrogradeCycle[] {
  const t = now.getTime();
  const from = t - 182 * DAY, to = t + 548 * DAY;
  const out: RetrogradeCycle[] = [];
  for (const planet of PLANETS) {
    for (const { sr, sd } of stations(planet.key, from, to)) {
      // A hand-written cycle for the same retrograde keeps its name and texts; dates, degrees and
      // shadows always come from the ephemeris (the hand-typed ones had wrong signs and days)
      const curated = PLANETARY_RETROGRADES.find(
        (r) => r.planetGlyphKey === planet.glyph && Math.abs(Date.parse(r.startDate) - sr) < 12 * DAY,
      );
      const computed = computedCycle(planet, sr, sd);
      out.push(curated ? { ...computed, id: curated.id, planet: curated.planet, coreThemes: curated.coreThemes, guidance: curated.guidance } : computed);
    }
  }
  // Planets outside the ephemeris (Plüton) come only from the hand-written list
  for (const r of PLANETARY_RETROGRADES) {
    if (PLANETS.some((p) => p.glyph === r.planetGlyphKey)) continue;
    if (Date.parse(r.endDate) >= from && Date.parse(r.startDate) <= to) out.push({ ...r });
  }
  const today = iso(t);
  return out
    .map((r) => ({ ...r, isCurrentlyRetrograde: today >= r.startDate && today <= r.endDate }))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

/**
 * Exact station moments (ms) of the retrograde that starts near `startDate` (YYYY-MM-DD),
 * plus the station longitudes and the shadow-period edges. Used by the retro detail pages.
 */
export function exactRetro(glyph: string, startDate: string) {
  const planet = PLANETS.find((p) => p.glyph === glyph);
  if (!planet) return null;
  const t = Date.parse(`${startDate}T12:00:00Z`);
  const found = stations(planet.key, t - 20 * DAY, t + 20 * DAY).find(({ sr }) => Math.abs(sr - t) < 15 * DAY);
  if (!found) return null;
  const { sr, sd } = found;
  const lonSR = lon(planet.key, sr), lonSD = lon(planet.key, sd);
  return {
    key: planet.key,
    sr,
    sd,
    lonSR,
    lonSD,
    preShadow: crossing(planet.key, lonSD, sr, -1),
    postShadow: crossing(planet.key, lonSR, sd, 1),
    lon: (ms: number) => lon(planet.key, ms),
  };
}
