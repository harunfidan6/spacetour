import { NASA_TEXTURES } from './nasaTextures';

export interface PlanetVisual {
  /** Surface map (equirectangular). */
  map: string;
  /** Multiplies the map — used where no dedicated texture exists (e.g. Pluto). */
  tint?: string;
  /** Self-lit body (the Sun). */
  emissive?: boolean;
  /** Axial tilt in degrees. */
  tilt: number;
  /** Relative spin speed (radians / second at 1×). */
  spin: number;
  /** Placeholder / glow colour. */
  color: string;
  ring?: { map: string; alpha?: string; inner: number; outer: number; opacity: number };
  atmosphere?: string;
}

/** Keyed by the encyclopedia ids in `src/data/planets.ts`. */
export const PLANET_VISUALS: Record<string, PlanetVisual> = {
  gunes: { map: NASA_TEXTURES.sun, emissive: true, tilt: 7, spin: 0.05, color: '#ff7a1a' },
  merkur: { map: NASA_TEXTURES.mercury, tilt: 0, spin: 0.25, color: '#9c948a' },
  venus: { map: NASA_TEXTURES.venus, tilt: 177, spin: 0.12, color: '#e8c48a', atmosphere: '#ffd9a0' },
  dunya: { map: NASA_TEXTURES.earthMap, tilt: 23.4, spin: 0.35, color: '#3b6fd8', atmosphere: '#6fb4ff' },
  ay: { map: NASA_TEXTURES.moon, tilt: 6.7, spin: 0.15, color: '#bdbab4' },
  mars: { map: NASA_TEXTURES.mars, tilt: 25, spin: 0.33, color: '#c1502e', atmosphere: '#ff9a6b' },
  jupiter: { map: NASA_TEXTURES.jupiter, tilt: 3, spin: 0.6, color: '#d8b48a' },
  saturn: {
    map: NASA_TEXTURES.saturn,
    tilt: 26.7,
    spin: 0.55,
    color: '#e2c58a',
    ring: { map: NASA_TEXTURES.saturnRing, alpha: NASA_TEXTURES.saturnRingPattern, inner: 1.25, outer: 2.3, opacity: 0.95 },
  },
  uranus: {
    map: NASA_TEXTURES.uranus,
    tilt: 97.8,
    spin: 0.4,
    color: '#9fd9e0',
    ring: { map: NASA_TEXTURES.uranusRing, inner: 1.5, outer: 1.95, opacity: 0.35 },
  },
  neptun: { map: NASA_TEXTURES.neptune, tilt: 28.3, spin: 0.42, color: '#3f63d6', atmosphere: '#7fa0ff' },
  pluton: { map: NASA_TEXTURES.moon, tint: '#d9b48f', tilt: 120, spin: 0.1, color: '#c9a37f' },
};

export function planetVisual(id: string): PlanetVisual {
  return PLANET_VISUALS[id] ?? PLANET_VISUALS.ay;
}
