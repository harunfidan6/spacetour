/**
 * SKY DOME ASTRONOMICAL EPHEMERIS & GALACTIC GENERATOR
 * Computes high-precision Alt-Azimuth positions for Solar System bodies
 * and the exact galactic coordinate transformation for the Milky Way dust band.
 */

import { raDecToAltAz, altAzToCartesian } from '@/utils/astronomy';

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
export function getSunEquatorial(date: Date): { ra: number; dec: number } {
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

  return { ra, dec };
}

/**
 * Computes the Moon's geocentric coordinates (RA, Dec, Phase, Illumination fraction).
 */
export function getMoonEquatorial(date: Date): { ra: number; dec: number; phaseFraction: number; elongation: number } {
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

  // Illumination calculation from elongation
  const sunEq = getSunEquatorial(date);
  const el = normalizeDeg(lambda * RAD2DEG - sunEq.ra);
  const phaseFraction = (1 + Math.cos((180 - el) * DEG2RAD)) / 2;

  return { ra, dec, phaseFraction, elongation: el };
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
  const jd = date.getTime() / 86400000 + 2440587.5;
  const d = jd - 2451545.0;
  const T = d / 36525.0;

  // 1. Sun
  const sunEq = getSunEquatorial(date);
  const sunAltAz = raDecToAltAz(sunEq.ra, sunEq.dec, latitude, lst);
  const sunCart = altAzToCartesian(sunAltAz.alt, sunAltAz.az, domeRadius * 0.96);

  // 2. Moon
  const moonEq = getMoonEquatorial(date);
  const moonAltAz = raDecToAltAz(moonEq.ra, moonEq.dec, latitude, lst);
  const moonCart = altAzToCartesian(moonAltAz.alt, moonAltAz.az, domeRadius * 0.95);

  // 3. Venus (Analytic Keplerian Mean Motion)
  const lVenus = normalizeDeg(181.979 + 58517.815 * T + 0.77 * Math.sin(normalizeDeg(212.6 + 58517.8 * T) * DEG2RAD));
  const decVenus = 23.4 * Math.sin(lVenus * DEG2RAD);
  const vAltAz = raDecToAltAz(lVenus, decVenus, latitude, lst);
  const vCart = altAzToCartesian(vAltAz.alt, vAltAz.az, domeRadius * 0.95);

  // 4. Mars
  const lMars = normalizeDeg(355.433 + 19140.299 * T + 10.7 * Math.sin(normalizeDeg(319.5 + 19140.3 * T) * DEG2RAD));
  const decMars = 24.5 * Math.sin(lMars * DEG2RAD);
  const mAltAz = raDecToAltAz(lMars, decMars, latitude, lst);
  const mCart = altAzToCartesian(mAltAz.alt, mAltAz.az, domeRadius * 0.95);

  // 5. Jupiter
  const lJup = normalizeDeg(34.351 + 3034.906 * T + 5.5 * Math.sin(normalizeDeg(273.8 + 3034.9 * T) * DEG2RAD));
  const decJup = 23.1 * Math.sin(lJup * DEG2RAD);
  const jAltAz = raDecToAltAz(lJup, decJup, latitude, lst);
  const jCart = altAzToCartesian(jAltAz.alt, jAltAz.az, domeRadius * 0.95);

  // 6. Saturn
  const lSat = normalizeDeg(50.077 + 1222.114 * T + 6.3 * Math.sin(normalizeDeg(339.4 + 1222.1 * T) * DEG2RAD));
  const decSat = 22.8 * Math.sin(lSat * DEG2RAD);
  const sAltAz = raDecToAltAz(lSat, decSat, latitude, lst);
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
      ra: lVenus,
      dec: decVenus,
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
      ra: lMars,
      dec: decMars,
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
      ra: lJup,
      dec: decJup,
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
      ra: lSat,
      dec: decSat,
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
 * Ascending node theta0 = 122.93192°
 */
export function galacticToEquatorial(lDeg: number, bDeg: number): { ra: number; dec: number } {
  const l = lDeg * DEG2RAD;
  const b = bDeg * DEG2RAD;

  const raG = 192.85948 * DEG2RAD;
  const decG = 27.12825 * DEG2RAD;
  const l0 = 122.93192 * DEG2RAD;

  const sinDec = Math.sin(decG) * Math.sin(b) + Math.cos(decG) * Math.cos(b) * Math.cos(l - l0);
  const dec = Math.asin(Math.min(Math.max(sinDec, -1), 1));

  const y = Math.cos(b) * Math.sin(l - l0);
  const x = Math.cos(decG) * Math.sin(b) - Math.sin(decG) * Math.cos(b) * Math.cos(l - l0);
  const ra = normalizeDeg((raG + Math.atan2(y, x)) * RAD2DEG);

  return { ra, dec: dec * RAD2DEG };
}

/**
 * Generates procedural Milky Way (Samanyolu) particle buffer data along the galactic plane.
 * Includes galactic core condensation towards Sagittarius (l ≈ 0°) and dust lane absorption.
 */
export function generateMilkyWayParticles(
  count: number = 3200,
  domeRadius: number = 90
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
    let b = z0 * spread;

    // The Great Rift dust lane absorption simulation between Cygnus (l ≈ 75°) and Sagittarius (l ≈ 0°)
    if (l > 15 && l < 85 && Math.abs(b - 0.5) < 1.4) {
      if (rand() > 0.15) continue; // Absorb particles
    }

    const brightness = isCore ? 0.75 + rand() * 0.25 : 0.35 + rand() * 0.45;

    items.push({ l, b, brightness, isCore });
  }

  return { galacticCoords: items };
}
