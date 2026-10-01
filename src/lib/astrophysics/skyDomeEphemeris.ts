/**
 * SKY DOME ASTRONOMICAL EPHEMERIS & GALACTIC GENERATOR
 * Computes high-precision Alt-Azimuth positions for Solar System bodies
 * and the exact galactic coordinate transformation for the Milky Way dust band.
 */

import { raDecToAltAz, altAzToCartesian } from '@/utils/astronomy';
import { computePlanetState, type HeliocentricState } from './keplerEphemeris';

export interface CelestialBodyDomeState {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'sun' | 'moon';
  ra: number;
  dec: number;
  alt: number;
  az: number;
  isVisible: boolean;
  cartesian: [number, number, number];
  magnitude: number;
  color: string;
  glowColor: string;
  phaseFraction?: number; // 0 to 1 for Moon
  phaseAngle?: number; // elongation
}

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function normalizeDeg(d: number): number {
  let res = d % 360;
  if (res < 0) res += 360;
  return res;
}

/**
 * Computes the Sun's geocentric equatorial coordinates (RA, Dec) with high precision.
 */
export function getSunEquatorial(date: Date): { ra: number; dec: number; lambda: number } {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const d = jd - 2451545.0; // days from J2000.0
  const T = d / 36525.0;

  const L0 = normalizeDeg(280.46646 + 36000.76983 * T);
  const M = normalizeDeg(357.52911 + 35999.05029 * T) * DEG2RAD;
  const C = (1.914602 - 0.004817 * T) * Math.sin(M) + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
  const lambda = normalizeDeg(L0 + C) * DEG2RAD;

  const eps = (23.439291 - 0.0130042 * T) * DEG2RAD;

  const sinDec = Math.sin(eps) * Math.sin(lambda);
  const dec = Math.asin(sinDec) * RAD2DEG;

  const y = Math.cos(eps) * Math.sin(lambda);
  const x = Math.cos(lambda);
  const ra = normalizeDeg(Math.atan2(y, x) * RAD2DEG);

  return { ra, dec, lambda: lambda * RAD2DEG };
}

/**
 * Computes the Moon's geocentric coordinates (RA, Dec, Phase, Illumination fraction).
 */
export function getMoonEquatorial(date: Date): {
  ra: number;
  dec: number;
  phaseFraction: number;
  elongation: number;
  lambda: number;
  distanceKm: number;
} {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const d = jd - 2451545.0;
  const T = d / 36525.0;

  const L_prime = normalizeDeg(218.3164477 + 481267.88125421 * T);
  const D = normalizeDeg(297.8501921 + 445267.1114034 * T) * DEG2RAD;
  const M = normalizeDeg(357.5291092 + 35999.0502909 * T) * DEG2RAD;
  const M_prime = normalizeDeg(134.9633964 + 477198.8675055 * T) * DEG2RAD;
  const F = normalizeDeg(93.272095 + 483202.0175233 * T) * DEG2RAD;

  const dLambda =
    6.288774 * Math.sin(M_prime) +
    1.274027 * Math.sin(2 * D - M_prime) +
    0.658309 * Math.sin(2 * D) +
    0.213618 * Math.sin(2 * M_prime) -
    0.185116 * Math.sin(M) -
    0.114332 * Math.sin(2 * F);

  const lambda = normalizeDeg(L_prime + dLambda) * DEG2RAD;
  const beta = (5.128122 * Math.sin(F) + 0.280606 * Math.sin(M_prime + F) + 0.277693 * Math.sin(M_prime - F)) * DEG2RAD;

  const eps = (23.439291 - 0.0130042 * T) * DEG2RAD;

  const sinDec = Math.sin(beta) * Math.cos(eps) + Math.cos(beta) * Math.sin(eps) * Math.sin(lambda);
  const dec = Math.asin(Math.min(Math.max(sinDec, -1), 1)) * RAD2DEG;

  const y = Math.cos(beta) * Math.cos(eps) * Math.sin(lambda) - Math.sin(beta) * Math.sin(eps);
  const x = Math.cos(beta) * Math.cos(lambda);
  const ra = normalizeDeg(Math.atan2(y, x) * RAD2DEG);

  // Illumination from elongation, measured along the ecliptic (Moon λ − Sun λ)
  const sunEq = getSunEquatorial(date);
  const el = normalizeDeg(lambda * RAD2DEG - sunEq.lambda);
  const phaseFraction = (1 + Math.cos((180 - el) * DEG2RAD)) / 2;

  // Earth–Moon distance, leading periodic terms of Meeus (Astronomical Algorithms, ch. 47)
  const distanceKm =
    385000.56 -
    20905.355 * Math.cos(M_prime) -
    3699.111 * Math.cos(2 * D - M_prime) -
    2955.968 * Math.cos(2 * D) -
    569.925 * Math.cos(2 * M_prime) +
    48.888 * Math.cos(M) -
    3.149 * Math.cos(2 * F) +
    246.158 * Math.cos(2 * D - 2 * M_prime) -
    152.138 * Math.cos(2 * D - M - M_prime) -
    170.733 * Math.cos(2 * D + M_prime) -
    204.586 * Math.cos(2 * D - M) -
    129.62 * Math.cos(M - M_prime) +
    108.743 * Math.cos(D) +
    104.755 * Math.cos(M + M_prime) +
    10.321 * Math.cos(2 * D - 2 * F) +
    79.661 * Math.cos(M_prime - 2 * F) -
    34.782 * Math.cos(4 * D - M_prime) -
    23.21 * Math.cos(3 * M_prime) -
    21.636 * Math.cos(4 * D - 2 * M_prime) +
    24.208 * Math.cos(2 * D + M - M_prime) +
    30.824 * Math.cos(2 * D + M) -
    16.675 * Math.cos(D + M) -
    12.831 * Math.cos(2 * D - M + M_prime) -
    10.445 * Math.cos(2 * D + 2 * M_prime) -
    11.65 * Math.cos(4 * D) +
    14.403 * Math.cos(2 * D - 3 * M_prime) +
    10.056 * Math.cos(2 * D - M - 2 * M_prime);

  return { ra, dec, phaseFraction, elongation: el, lambda: lambda * RAD2DEG, distanceKm };
}

export type MoonPhaseKey =
  | 'new'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full'
  | 'waning-gibbous'
  | 'last-quarter'
  | 'waning-crescent';

const MOON_PHASE_ORDER: MoonPhaseKey[] = [
  'new',
  'waxing-crescent',
  'first-quarter',
  'waxing-gibbous',
  'full',
  'waning-gibbous',
  'last-quarter',
  'waning-crescent',
];

export const MOON_PHASE_NAMES: Record<MoonPhaseKey, string> = {
  new: 'Yeni Ay',
  'waxing-crescent': 'Büyüyen Hilal',
  'first-quarter': 'İlk Dördün',
  'waxing-gibbous': 'Büyüyen Şişkin Ay',
  full: 'Dolunay',
  'waning-gibbous': 'Küçülen Şişkin Ay',
  'last-quarter': 'Son Dördün',
  'waning-crescent': 'Küçülen Hilal',
};

const SYNODIC_MONTH_DAYS = 29.530588;

/** Phase of the Moon from its true elongation; each phase spans ±22.5° around its centre. */
export function getMoonPhase(date: Date): {
  key: MoonPhaseKey;
  name: string;
  illumination: number;
  elongation: number;
  waxing: boolean;
  ageDays: number;
  distanceKm: number;
} {
  const moon = getMoonEquatorial(date);
  const key = MOON_PHASE_ORDER[Math.round(moon.elongation / 45) % 8];
  return {
    key,
    name: MOON_PHASE_NAMES[key],
    illumination: moon.phaseFraction,
    elongation: moon.elongation,
    waxing: moon.elongation < 180,
    ageDays: (moon.elongation / 360) * SYNODIC_MONTH_DAYS,
    distanceKm: moon.distanceKm,
  };
}

export type NakedEyePlanet = 'venus' | 'mars' | 'jupiter' | 'saturn';
export type GeocentricPlanet = NakedEyePlanet | 'mercury';

/**
 * Geocentric view of a planet: RA/Dec, ecliptic longitude, Sun/Earth distances (AU),
 * phase angle and elongation from the Sun (degrees).
 */
export function planetGeocentric(key: GeocentricPlanet, date: Date) {
  const earth = computePlanetState('earth', date);
  const planet = computePlanetState(key, date);
  const x = planet.x - earth.x;
  const y = planet.y - earth.y;
  const z = planet.z - earth.z;
  const delta = Math.hypot(x, y, z);
  const r = planet.rAU;
  const R = earth.rAU;
  const phaseAngle = Math.acos(Math.min(1, Math.max(-1, (r * r + delta * delta - R * R) / (2 * r * delta)))) * RAD2DEG;
  const elongation = Math.acos(Math.min(1, Math.max(-1, (R * R + delta * delta - r * r) / (2 * R * delta)))) * RAD2DEG;
  return {
    ...eclipticToEquatorial(x, y, z),
    lambda: normalizeDeg(Math.atan2(y, x) * RAD2DEG),
    beta: Math.atan2(z, Math.hypot(x, y)) * RAD2DEG,
    r,
    delta,
    phaseAngle,
    elongation,
  };
}

/** True while the planet's geocentric ecliptic longitude is decreasing (apparent retrograde motion). */
export function isRetrograde(key: GeocentricPlanet, date: Date): boolean {
  const today = planetGeocentric(key, date).lambda;
  const tomorrow = planetGeocentric(key, new Date(date.getTime() + 86_400_000)).lambda;
  return ((tomorrow - today + 540) % 360) - 180 < 0;
}

// Mean obliquity of the ecliptic at J2000 — the Keplerian states are in the J2000 ecliptic frame
const J2000_OBLIQUITY = 23.4392911 * DEG2RAD;

/**
 * Geocentric RA/Dec of a planet: heliocentric planet vector minus Earth's,
 * rotated from the ecliptic into the equatorial frame (light-time and aberration ignored).
 */
function planetEquatorial(planet: HeliocentricState, earth: HeliocentricState): { ra: number; dec: number } {
  const x = planet.x - earth.x;
  const y = planet.y - earth.y;
  const z = planet.z - earth.z;
  return eclipticToEquatorial(x, y, z);
}

function eclipticToEquatorial(x: number, y: number, z: number): { ra: number; dec: number } {
  const cosE = Math.cos(J2000_OBLIQUITY);
  const sinE = Math.sin(J2000_OBLIQUITY);
  const yq = y * cosE - z * sinE;
  const zq = y * sinE + z * cosE;
  return {
    ra: normalizeDeg(Math.atan2(yq, x) * RAD2DEG),
    dec: Math.atan2(zq, Math.hypot(x, yq)) * RAD2DEG,
  };
}

/**
 * Computes topocentric state for all naked-eye Solar System bodies on the sky dome.
 */
export function computeSkyDomeSolarSystem(
  date: Date,
  latitude: number,
  lst: number,
  domeRadius: number
): CelestialBodyDomeState[] {
  // 1. Sun
  const sunEq = getSunEquatorial(date);
  const sunAltAz = raDecToAltAz(sunEq.ra, sunEq.dec, latitude, lst);
  const sunCart = altAzToCartesian(sunAltAz.alt, sunAltAz.az, domeRadius * 0.96);

  // 2. Moon
  const moonEq = getMoonEquatorial(date);
  const moonAltAz = raDecToAltAz(moonEq.ra, moonEq.dec, latitude, lst);
  const moonCart = altAzToCartesian(moonAltAz.alt, moonAltAz.az, domeRadius * 0.95);

  // 3-6. Planets from JPL Keplerian elements, seen from Earth
  const earth = computePlanetState('earth', date);
  const venusEq = planetEquatorial(computePlanetState('venus', date), earth);
  const marsEq = planetEquatorial(computePlanetState('mars', date), earth);
  const jupiterEq = planetEquatorial(computePlanetState('jupiter', date), earth);
  const saturnEq = planetEquatorial(computePlanetState('saturn', date), earth);

  const vAltAz = raDecToAltAz(venusEq.ra, venusEq.dec, latitude, lst);
  const vCart = altAzToCartesian(vAltAz.alt, vAltAz.az, domeRadius * 0.95);
  const mAltAz = raDecToAltAz(marsEq.ra, marsEq.dec, latitude, lst);
  const mCart = altAzToCartesian(mAltAz.alt, mAltAz.az, domeRadius * 0.95);
  const jAltAz = raDecToAltAz(jupiterEq.ra, jupiterEq.dec, latitude, lst);
  const jCart = altAzToCartesian(jAltAz.alt, jAltAz.az, domeRadius * 0.95);
  const sAltAz = raDecToAltAz(saturnEq.ra, saturnEq.dec, latitude, lst);
  const sCart = altAzToCartesian(sAltAz.alt, sAltAz.az, domeRadius * 0.95);

  return [
    {
      id: 'sun',
      name: 'Güneş (Sol)',
      type: 'sun',
      ra: sunEq.ra,
      dec: sunEq.dec,
      alt: sunAltAz.alt,
      az: sunAltAz.az,
      isVisible: sunAltAz.isVisible,
      cartesian: sunCart,
      magnitude: -26.7,
      color: '#ffe58f',
      glowColor: '#ff9c1a'
    },
    {
      id: 'moon',
      name: 'Ay (Luna)',
      type: 'moon',
      ra: moonEq.ra,
      dec: moonEq.dec,
      alt: moonAltAz.alt,
      az: moonAltAz.az,
      isVisible: moonAltAz.isVisible,
      cartesian: moonCart,
      magnitude: -12.7 * (0.1 + 0.9 * moonEq.phaseFraction),
      color: '#f5f5f5',
      glowColor: '#90cdf4',
      phaseFraction: moonEq.phaseFraction,
      phaseAngle: moonEq.elongation
    },
    {
      id: 'venus',
      name: 'Venüs (Zühre)',
      type: 'planet',
      ra: venusEq.ra,
      dec: venusEq.dec,
      alt: vAltAz.alt,
      az: vAltAz.az,
      isVisible: vAltAz.isVisible,
      cartesian: vCart,
      magnitude: -4.4,
      color: '#fff4cc',
      glowColor: '#ffd666'
    },
    {
      id: 'mars',
      name: 'Mars (Merih)',
      type: 'planet',
      ra: marsEq.ra,
      dec: marsEq.dec,
      alt: mAltAz.alt,
      az: mAltAz.az,
      isVisible: mAltAz.isVisible,
      cartesian: mCart,
      magnitude: 0.2,
      color: '#ff7875',
      glowColor: '#f5222d'
    },
    {
      id: 'jupiter',
      name: 'Jüpiter (Müşteri)',
      type: 'planet',
      ra: jupiterEq.ra,
      dec: jupiterEq.dec,
      alt: jAltAz.alt,
      az: jAltAz.az,
      isVisible: jAltAz.isVisible,
      cartesian: jCart,
      magnitude: -2.6,
      color: '#fff1b8',
      glowColor: '#faad14'
    },
    {
      id: 'saturn',
      name: 'Satürn (Zühal)',
      type: 'planet',
      ra: saturnEq.ra,
      dec: saturnEq.dec,
      alt: sAltAz.alt,
      az: sAltAz.az,
      isVisible: sAltAz.isVisible,
      cartesian: sCart,
      magnitude: 0.6,
      color: '#ffe7ba',
      glowColor: '#d48806'
    }
  ];
}

/**
 * Transforms Galactic Coordinates (l, b in degrees) into Equatorial Coordinates (RA, Dec in degrees).
 * Standard IAU J2000 definition:
 * North Galactic Pole: RA = 192.85948°, Dec = +27.12825°
 * Galactic longitude of the north celestial pole l0 = 122.93192°
 */
export function galacticToEquatorial(lDeg: number, bDeg: number): { ra: number; dec: number } {
  const l = lDeg * DEG2RAD;
  const b = bDeg * DEG2RAD;

  const raG = 192.85948 * DEG2RAD;
  const decG = 27.12825 * DEG2RAD;
  const l0 = 122.93192 * DEG2RAD;

  // l0 is the galactic longitude of the north celestial pole, so the angle runs (l0 − l)
  const sinDec = Math.sin(decG) * Math.sin(b) + Math.cos(decG) * Math.cos(b) * Math.cos(l0 - l);
  const dec = Math.asin(Math.min(Math.max(sinDec, -1), 1));

  const y = Math.cos(b) * Math.sin(l0 - l);
  const x = Math.cos(decG) * Math.sin(b) - Math.sin(decG) * Math.cos(b) * Math.cos(l0 - l);
  const ra = normalizeDeg((raG + Math.atan2(y, x)) * RAD2DEG);

  return { ra, dec: dec * RAD2DEG };
}

/**
 * Generates procedural Milky Way (Samanyolu) particle buffer data along the galactic plane.
 * Includes galactic core condensation towards Sagittarius (l ≈ 0°) and dust lane absorption.
 */
export function generateMilkyWayParticles(
  count: number = 3200
): {
  galacticCoords: { l: number; b: number; brightness: number; isCore: boolean }[];
} {
  const items: { l: number; b: number; brightness: number; isCore: boolean }[] = [];

  // Seeded pseudo-random generator
  let seed = 4217;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < count; i++) {
    // Galactic longitude 0° to 360°
    const l = rand() * 360;

    // Galactic latitude: concentrated near b = 0°, wider at Sagittarius core
    const isCore = Math.abs(l < 30 || l > 330 ? (l > 180 ? l - 360 : l) : 999) < 28;
    const spread = isCore ? 8.5 : 4.2;

    // Normal distribution box-muller approximation
    const u1 = Math.max(rand(), 1e-4);
    const u2 = rand();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const b = z0 * spread;

    // The Great Rift dust lane absorption simulation between Cygnus (l ≈ 75°) and Sagittarius (l ≈ 0°)
    if (l > 15 && l < 85 && Math.abs(b - 0.5) < 1.4) {
      if (rand() > 0.15) continue; // Absorb particles
    }

    const brightness = isCore ? 0.75 + rand() * 0.25 : 0.35 + rand() * 0.45;

    items.push({ l, b, brightness, isCore });
  }

  return { galacticCoords: items };
}
