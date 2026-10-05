/**
 * High-Density Astronomical Starfield Generator (Hipparcos / Yale Bright Star approximation)
 * Generates ~2,200 background stars across the celestial vault (RA 0-360°, Dec -90° to +90°)
 * with Fibonacci organic spherical distribution (zero Marsaglia lattice artifacts),
 * realistic magnitude distribution, and B-V stellar spectral colors.
 */

export interface BackgroundStar {
  ra: number;   // 0 to 360 deg
  dec: number;  // -90 to +90 deg
  magnitude: number; // 3.2 to 6.5
  color: [number, number, number]; // RGB 0..1
  size: number; // screen point size
  twinklePhase: number;
}

const SPECTRAL_COLORS: [number, number, number][] = [
  [0.72, 0.83, 1.0],   // O/B (Diamond Blue-White)
  [0.82, 0.90, 1.0],   // B (Icy Blue)
  [0.96, 0.98, 1.0],   // A (Crisp Pure White)
  [1.0,  0.96, 0.86],  // F (Yellow-White)
  [1.0,  0.92, 0.68],  // G (Solar Warm Yellow)
  [1.0,  0.74, 0.48],  // K (Amber Orange)
  [1.0,  0.55, 0.35],  // M (Ruby Red-Orange)
];

// Mulberry32 32-bit PRNG
function createPrng(seed: number) {
  let s = seed >>> 0;
  return () => {
    let t = (s += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let cachedStarfield: BackgroundStar[] | null = null;

export function getBackgroundStarfield(count: number = 2200): BackgroundStar[] {
  if (cachedStarfield) return cachedStarfield;

  const stars: BackgroundStar[] = [];
  const rand = createPrng(19840214);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.39996 rad / 137.5°

  for (let i = 0; i < count; i++) {
    // 1. Fibonacci spherical distribution with organic Poisson-disk jitter
    const z = 1.0 - (2.0 * i + 1.0) / count + (rand() - 0.5) * (1.6 / count);
    const clampedZ = Math.max(-0.9999, Math.min(0.9999, z));
    const dec = Math.asin(clampedZ) * (180 / Math.PI);

    // RA angle using golden angle plus gentle angular jitter
    const angle = i * goldenAngle + (rand() - 0.5) * 0.18;
    let ra = ((angle * 180) / Math.PI) % 360;
    if (ra < 0) ra += 360;

    // 2. Realistic Pogson logarithmic magnitude distribution
    const magU = Math.pow(rand(), 0.35);
    const magnitude = 3.2 + magU * 3.3; // Range: 3.2 to 6.5

    // Delicate background pinpoints: 1.8px to 3.4px
    const size = Math.max(1.8, 3.4 - (magnitude - 3.2) * 0.48);

    // 3. Spectral class weighted selection
    const specRand = rand();
    let specIndex = 2; // Default A-type white
    if (specRand < 0.18) specIndex = 0;
    else if (specRand < 0.38) specIndex = 1;
    else if (specRand < 0.58) specIndex = 2;
    else if (specRand < 0.72) specIndex = 3;
    else if (specRand < 0.84) specIndex = 4;
    else if (specRand < 0.94) specIndex = 5;
    else specIndex = 6;

    const baseColor = SPECTRAL_COLORS[specIndex];
    const brightness = Math.max(0.35, Math.min(0.90, Math.pow(10.0, -0.14 * (magnitude - 3.2))));

    stars.push({
      ra,
      dec,
      magnitude,
      color: [baseColor[0] * brightness, baseColor[1] * brightness, baseColor[2] * brightness],
      size,
      twinklePhase: rand() * Math.PI * 2,
    });
  }

  cachedStarfield = stars;
  return cachedStarfield;
}
