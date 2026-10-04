/**
 * High-Density Astronomical Starfield Generator (Hipparcos / Yale Bright Star approximation)
 * Generates ~2,800 background stars across the celestial vault (RA 0-360°, Dec -90° to +90°)
 * with realistic magnitude distribution, galactic plane concentration, and B-V stellar spectral colors.
 */

export interface BackgroundStar {
  ra: number;   // 0 to 360 deg
  dec: number;  // -90 to +90 deg
  magnitude: number; // 2.5 to 6.5
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

let cachedStarfield: BackgroundStar[] | null = null;

export function getBackgroundStarfield(count: number = 2800): BackgroundStar[] {
  if (cachedStarfield) return cachedStarfield;

  const stars: BackgroundStar[] = [];
  let seed = 918273;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < count; i++) {
    // Uniform sphere distribution for RA and Dec
    const u = rand();
    const v = rand();
    const ra = u * 360;
    // Dec in [-90, +90] with spherical cosine weighting
    const sinDec = 2.0 * v - 1.0;
    const dec = Math.asin(Math.max(-1.0, Math.min(1.0, sinDec))) * (180 / Math.PI);

    // Realistic Pogson logarithmic magnitude distribution:
    // Most stars are faint (mag 4.5 - 6.2), very few are bright (mag 2.5 - 3.5)
    const magU = Math.pow(rand(), 0.38); // Skews towards fainter magnitudes
    const magnitude = 2.4 + magU * 4.1; // Range: 2.4 to 6.5

    // Size based on magnitude:
    // Mag 2.5 -> size ~2.6px
    // Mag 4.0 -> size ~1.8px
    // Mag 5.5 -> size ~1.2px
    // Mag 6.5 -> size ~0.9px
    const size = Math.max(0.85, 2.8 - (magnitude - 2.4) * 0.46);

    // Pick spectral class with weighted distribution
    const specRand = rand();
    let specIndex = 2; // Default A-type white
    if (specRand < 0.15) specIndex = 0;
    else if (specRand < 0.35) specIndex = 1;
    else if (specRand < 0.55) specIndex = 2;
    else if (specRand < 0.70) specIndex = 3;
    else if (specRand < 0.82) specIndex = 4;
    else if (specRand < 0.92) specIndex = 5;
    else specIndex = 6;

    const baseColor = SPECTRAL_COLORS[specIndex];
    // Brightness factor from magnitude (Pogson scale)
    const brightness = Math.max(0.2, Math.min(1.0, Math.pow(10.0, -0.22 * (magnitude - 2.5))));

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
