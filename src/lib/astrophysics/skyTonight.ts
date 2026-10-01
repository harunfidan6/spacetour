/**
 * TONIGHT'S SKY PLANNER
 * Samples one night (local noon → next noon) at a fixed site and derives
 * darkness windows, planet visibility and Moon rise/set from the ephemeris.
 */

import { getLocalSiderealTime, raDecToAltAz } from '@/utils/astronomy';
import {
  getMoonEquatorial,
  getMoonPhase,
  getSunEquatorial,
  planetGeocentric,
  type NakedEyePlanet,
} from './skyDomeEphemeris';

export interface ObservingSite {
  city: string;
  latitude: number;
  longitude: number;
  utcOffset: number; // hours; Turkey has stayed on UTC+3 year-round since 2016
  timeZone: string;
}

export const ISTANBUL_SITE: ObservingSite = {
  city: 'İstanbul',
  latitude: 41.0082,
  longitude: 28.9784,
  utcOffset: 3,
  timeZone: 'Europe/Istanbul',
};

const STEP_MIN = 10;
const HOUR_MS = 3_600_000;
const DEG = Math.PI / 180;

// Ecliptic longitudes (J2000) where the ecliptic enters each IAU constellation
const ECLIPTIC_CONSTELLATIONS: [number, string][] = [
  [29.1, 'Koç (Aries)'],
  [53.5, 'Boğa (Taurus)'],
  [90.4, 'İkizler (Gemini)'],
  [118.3, 'Yengeç (Cancer)'],
  [138.2, 'Aslan (Leo)'],
  [174.2, 'Başak (Virgo)'],
  [218.0, 'Terazi (Libra)'],
  [241.1, 'Akrep (Scorpius)'],
  [247.7, 'Yılancı (Ophiuchus)'],
  [266.3, 'Yay (Sagittarius)'],
  [299.7, 'Oğlak (Capricornus)'],
  [327.5, 'Kova (Aquarius)'],
  [351.6, 'Balıklar (Pisces)'],
];

export function constellationOnEcliptic(lambda: number): string {
  let name = 'Balıklar (Pisces)'; // 351.6° → 29.1° wraps through 0°
  for (const [start, label] of ECLIPTIC_CONSTELLATIONS) {
    if (lambda >= start) name = label;
  }
  return name;
}

const COMPASS = ['Kuzey', 'Kuzeydoğu', 'Doğu', 'Güneydoğu', 'Güney', 'Güneybatı', 'Batı', 'Kuzeybatı'];
export function compassPoint(az: number): string {
  return COMPASS[Math.round(az / 45) % 8];
}

/** Tilt of Saturn's rings towards Earth (Meeus ch. 45), from its geocentric ecliptic coordinates. */
function saturnRingTilt(lambda: number, beta: number): number {
  const i = 28.075216 * DEG;
  const node = 169.50847 * DEG;
  const l = lambda * DEG;
  const b = beta * DEG;
  return Math.asin(Math.sin(i) * Math.cos(b) * Math.sin(l - node) - Math.cos(i) * Math.sin(b));
}

/** Apparent visual magnitude (Meeus, Astronomical Algorithms ch. 41). */
function apparentMagnitude(key: NakedEyePlanet, r: number, delta: number, i: number, ringTilt = 0): number {
  const base = 5 * Math.log10(r * delta);
  switch (key) {
    case 'venus':
      return -4.4 + base + 0.0009 * i + 0.000239 * i * i - 0.00000065 * i * i * i;
    case 'mars':
      return -1.52 + base + 0.016 * i;
    case 'jupiter':
      return -9.4 + base + 0.005 * i;
    case 'saturn': {
      const sinB = Math.sin(Math.abs(ringTilt));
      return -8.88 + base + 0.044 * i - 2.6 * sinB + 1.25 * sinB * sinB;
    }
  }
}

function altitude(date: Date, ra: number, dec: number, site: ObservingSite) {
  return raDecToAltAz(ra, dec, site.latitude, getLocalSiderealTime(date, site.longitude));
}

/** Local calendar noon at the site, in UTC milliseconds. */
function localNoon(date: Date, site: ObservingSite, dayOffset = 0): number {
  const local = new Date(date.getTime() + site.utcOffset * HOUR_MS);
  return Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + dayOffset, 12) - site.utcOffset * HOUR_MS;
}

export type VisibilityRating = 'Mükemmel' | 'İyi' | 'Düşük' | 'Görünmüyor';

export interface PlanetTonight {
  key: NakedEyePlanet;
  name: string;
  constellation: string;
  magnitude: number;
  elongation: number;
  rating: VisibilityRating;
  window: { start: Date; end: Date } | null;
  peak: { time: Date; altitude: number; direction: string } | null;
}

export interface MoonTonight {
  phaseKey: ReturnType<typeof getMoonPhase>['key'];
  phaseName: string;
  illumination: number;
  waxing: boolean;
  ageDays: number;
  distanceKm: number;
  rise: Date | null;
  set: Date | null;
  upDuringDarkFraction: number;
}

export interface SkyTonight {
  site: ObservingSite;
  nightOf: Date;
  sunset: Date | null;
  sunrise: Date | null;
  astroDark: { start: Date; end: Date } | null;
  planets: PlanetTonight[];
  moon: MoonTonight;
}

const PLANETS: { key: NakedEyePlanet; name: string }[] = [
  { key: 'venus', name: 'Venüs' },
  { key: 'jupiter', name: 'Jüpiter' },
  { key: 'mars', name: 'Mars' },
  { key: 'saturn', name: 'Satürn' },
];

/** First/last sample times where `test` holds, or null when it never does. */
function span(times: Date[], flags: boolean[]): { start: Date; end: Date } | null {
  const first = flags.indexOf(true);
  if (first === -1) return null;
  const last = flags.lastIndexOf(true);
  return { start: times[first], end: times[last] };
}

/** Time the altitude series crosses `h0` in the given direction, linearly interpolated. */
function crossing(times: Date[], alts: number[], h0: number, rising: boolean): Date | null {
  for (let i = 1; i < alts.length; i++) {
    const a = alts[i - 1] - h0;
    const b = alts[i] - h0;
    if (rising ? a < 0 && b >= 0 : a >= 0 && b < 0) {
      const f = a / (a - b);
      return new Date(times[i - 1].getTime() + f * (times[i].getTime() - times[i - 1].getTime()));
    }
  }
  return null;
}

export function computeSkyTonight(now: Date, site: ObservingSite = ISTANBUL_SITE): SkyTonight {
  // Before local noon we are still in last night; afterwards plan the coming night
  const localHour = (now.getUTCHours() + site.utcOffset + 24) % 24;
  const start = localNoon(now, site, localHour < 12 ? -1 : 0);

  const times: Date[] = [];
  for (let t = start; t <= start + 24 * HOUR_MS; t += STEP_MIN * 60_000) times.push(new Date(t));

  const sunAlt = times.map((t) => {
    const sun = getSunEquatorial(t);
    return altitude(t, sun.ra, sun.dec, site).alt;
  });
  const moonAlt = times.map((t) => {
    const moon = getMoonEquatorial(t);
    return altitude(t, moon.ra, moon.dec, site).alt;
  });

  const astroDark = span(times, sunAlt.map((a) => a < -18));
  const darkFlags = sunAlt.map((a) => a < -18);
  const darkCount = darkFlags.filter(Boolean).length;
  const moonUpInDark = darkFlags.filter((dark, i) => dark && moonAlt[i] > 0).length;

  // Planets move little in one night: one position at local midnight is enough
  const midnight = new Date(start + 12 * HOUR_MS);
  const planets: PlanetTonight[] = PLANETS.map(({ key, name }) => {
    const geo = planetGeocentric(key, midnight);
    const twilightFlags = times.map((t, i) => sunAlt[i] < -6 && altitude(t, geo.ra, geo.dec, site).alt > 5);
    const window = span(times, twilightFlags);

    let peak: PlanetTonight['peak'] = null;
    twilightFlags.forEach((ok, i) => {
      if (!ok) return;
      const pos = altitude(times[i], geo.ra, geo.dec, site);
      if (!peak || pos.alt > peak.altitude) peak = { time: times[i], altitude: pos.alt, direction: compassPoint(pos.az) };
    });
    const best = peak as PlanetTonight['peak'];

    const rating: VisibilityRating = !best
      ? 'Görünmüyor'
      : best.altitude >= 35
        ? 'Mükemmel'
        : best.altitude >= 15
          ? 'İyi'
          : 'Düşük';

    return {
      key,
      name,
      constellation: constellationOnEcliptic(geo.lambda),
      magnitude: apparentMagnitude(
        key,
        geo.r,
        geo.delta,
        geo.phaseAngle,
        key === 'saturn' ? saturnRingTilt(geo.lambda, geo.beta) : 0
      ),
      elongation: geo.elongation,
      rating,
      window,
      peak: best,
    };
  });

  // Moon rise/set within the local calendar day (midnight → midnight); h0 ≈ +0.125° for the Moon
  const dayStart = localNoon(now, site) - 12 * HOUR_MS;
  const dayTimes: Date[] = [];
  for (let t = dayStart; t <= dayStart + 24 * HOUR_MS; t += STEP_MIN * 60_000) dayTimes.push(new Date(t));
  const dayMoonAlt = dayTimes.map((t) => {
    const moon = getMoonEquatorial(t);
    return altitude(t, moon.ra, moon.dec, site).alt;
  });
  const phase = getMoonPhase(now);

  return {
    site,
    nightOf: new Date(start),
    sunset: crossing(times, sunAlt, -0.833, false),
    sunrise: crossing(times, sunAlt, -0.833, true),
    astroDark,
    planets,
    moon: {
      phaseKey: phase.key,
      phaseName: phase.name,
      illumination: phase.illumination,
      waxing: phase.waxing,
      ageDays: phase.ageDays,
      distanceKm: phase.distanceKm,
      rise: crossing(dayTimes, dayMoonAlt, 0.125, true),
      set: crossing(dayTimes, dayMoonAlt, 0.125, false),
      upDuringDarkFraction: darkCount ? moonUpInDark / darkCount : 0,
    },
  };
}
