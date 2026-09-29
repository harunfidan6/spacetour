/**
 * KEPLERIAN ORBITAL EPHEMERIS ENGINE (J2000.0 Standards)
 * Computes exact heliocentric planetary positions and Keplerian anomalies
 * using NASA/JPL orbital elements and Newton-Raphson solution to Kepler's Equation.
 */

export interface KeplerianElements {
  id: string;
  name: string;
  // Semi-major axis (AU)
  a0: number;
  aDot: number;
  // Eccentricity
  e0: number;
  eDot: number;
  // Inclination (degrees)
  I0: number;
  IDot: number;
  // Mean longitude (degrees)
  L0: number;
  LDot: number;
  // Longitude of perihelion (degrees)
  w0: number;
  wDot: number;
  // Longitude of ascending node (degrees)
  node0: number;
  nodeDot: number;
  // Visual scene orbit radius scale factor
  sceneRadius: number;
}

// NASA JPL Keplerian Elements for Epoch J2000.0 (valid 1800 AD – 2050 AD)
export const PLANET_EPHEMERIS: Record<string, KeplerianElements> = {
  earth: {
    id: 'earth',
    name: 'Dünya',
    a0: 1.00000018,
    aDot: -0.00000003,
    e0: 0.01673163,
    eDot: -0.00003661,
    I0: -0.00054346,
    IDot: -0.01337178,
    L0: 100.46691572,
    LDot: 35999.37306329,
    w0: 102.93005885,
    wDot: 0.31795260,
    node0: -5.11260389,
    nodeDot: -0.24123856,
    sceneRadius: 24,
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    a0: 1.52367934,
    aDot: 0.00000319,
    e0: 0.09340062,
    eDot: 0.00009206,
    I0: 1.849726,
    IDot: -0.008147,
    L0: -4.56813164,
    LDot: 19140.29934243,
    w0: -239.94174472,
    wDot: 0.44374980,
    node0: 49.55809321,
    nodeDot: -0.29498465,
    sceneRadius: 34,
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jüpiter',
    a0: 5.20248019,
    aDot: -0.00002864,
    e0: 0.04853590,
    eDot: 0.00018026,
    I0: 1.303613,
    IDot: -0.005699,
    L0: 34.33479152,
    LDot: 3034.90371757,
    w0: 14.27495244,
    wDot: 0.18199196,
    node0: 100.46444105,
    nodeDot: 0.17668285,
    sceneRadius: 50,
  },
  saturn: {
    id: 'saturn',
    name: 'Satürn',
    a0: 9.54149883,
    aDot: -0.00003065,
    e0: 0.05550825,
    eDot: -0.00032044,
    I0: 2.48898,
    IDot: -0.003736,
    L0: 50.07571329,
    LDot: 1222.11494724,
    w0: 92.86136063,
    wDot: 0.54179478,
    node0: 113.665524,
    nodeDot: -0.25666495,
    sceneRadius: 70,
  },
};

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/**
 * Calculates Julian Date from JavaScript Date
 */
export function getJulianDate(date: Date = new Date()): number {
  return 2440587.5 + date.getTime() / 86400000;
}

/**
 * Calculates centuries elapsed since J2000.0 epoch (2000 Jan 1 12:00 TT)
 */
export function getCenturiesSinceJ2000(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

/**
 * Solves Kepler's Equation M = E - e*sin(E) using Newton-Raphson iteration
 */
export function solveKeplerEquation(M_rad: number, e: number): number {
  let E = M_rad;
  const tolerance = 1e-7;
  const maxIter = 30;

  for (let i = 0; i < maxIter; i++) {
    const f = E - e * Math.sin(E) - M_rad;
    if (Math.abs(f) < tolerance) break;
    const fPrime = 1 - e * Math.cos(E);
    E = E - f / fPrime;
  }
  return E;
}

export interface HeliocentricState {
  x: number;
  y: number;
  z: number;
  rAU: number;
  rKm: number;
  speedKmS: number;
  trueAnomalyDeg: number;
  meanAnomalyDeg: number;
  sceneX: number;
  sceneY: number;
  sceneZ: number;
}

/**
 * Computes exact heliocentric 3D position and telemetry for a planet at a given date
 */
export function computePlanetState(
  planetKey: keyof typeof PLANET_EPHEMERIS,
  date: Date = new Date()
): HeliocentricState {
  const elem = PLANET_EPHEMERIS[planetKey];
  const jd = getJulianDate(date);
  const T = getCenturiesSinceJ2000(jd);

  // Compute elements at time T
  const a = elem.a0 + elem.aDot * T;
  const e = elem.e0 + elem.eDot * T;
  const I = (elem.I0 + elem.IDot * T) * DEG2RAD;
  const L = elem.L0 + elem.LDot * T;
  const w = elem.w0 + elem.wDot * T;
  const node = (elem.node0 + elem.nodeDot * T) * DEG2RAD;

  // Mean anomaly M = L - w
  let M = (L - w) % 360;
  if (M < 0) M += 360;
  const M_rad = M * DEG2RAD;

  // Solve Kepler's equation
  const E = solveKeplerEquation(M_rad, e);

  // True Anomaly nu
  const x_orb = a * (Math.cos(E) - e);
  const y_orb = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const r = Math.sqrt(x_orb * x_orb + y_orb * y_orb);
  const nu = Math.atan2(y_orb, x_orb);

  // Argument of perihelion omega = w - node
  const omega = (w - (elem.node0 + elem.nodeDot * T)) * DEG2RAD;

  // Transform orbital plane to heliocentric ecliptic frame
  const cosNode = Math.cos(node);
  const sinNode = Math.sin(node);
  const cosInc = Math.cos(I);
  const sinInc = Math.sin(I);
  const cosU = Math.cos(omega + nu);
  const sinU = Math.sin(omega + nu);

  const x_ecl = r * (cosNode * cosU - sinNode * sinU * cosInc);
  const y_ecl = r * (sinNode * cosU + cosNode * sinU * cosInc);
  const z_ecl = r * (sinU * sinInc);

  // Speed in km/s: v = sqrt(GM * (2/r - 1/a))
  // Standard gravitational parameter of Sun mu = 1.3271244e11 km^3/s^2, 1 AU = 1.4959787e8 km
  const rKm = r * 149597870.7;
  const aKm = a * 149597870.7;
  const muSun = 1.32712440018e11;
  const speed = Math.sqrt(muSun * (2 / rKm - 1 / aKm));

  // Map to scene coordinates: X -> x_ecl, Z -> y_ecl, Y -> z_ecl (normalized by semi-major axis ratio)
  const normFactor = elem.sceneRadius / a;
  const sceneX = x_ecl * normFactor;
  const sceneZ = y_ecl * normFactor;
  const sceneY = z_ecl * normFactor * 1.5;

  return {
    x: x_ecl,
    y: y_ecl,
    z: z_ecl,
    rAU: r,
    rKm,
    speedKmS: speed,
    trueAnomalyDeg: ((nu * RAD2DEG) % 360 + 360) % 360,
    meanAnomalyDeg: M,
    sceneX,
    sceneY,
    sceneZ,
  };
}
