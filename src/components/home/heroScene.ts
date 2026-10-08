// Ana sayfa 3D güneş sisteminin three.js'e bağlı olmayan verileri: SolarSystemBand bunları sahne yüklenmeden de kullanır

/** Mutable state shared with the DOM hero (GSAP writes, the render loop reads). */
export interface HeroSceneState {
  /** 0 → 1 entrance */
  intro: number;
  /** 0 → 1 scroll fly-in toward the Sun */
  scroll: number;
  /** pointer, -0.5 … 0.5 */
  px: number;
  py: number;
  /** freeze orbital motion (reduced motion) */
  frozen: boolean;
}

/** Only one hero is mounted at a time, so a module-level store is enough. */
export const heroScene: HeroSceneState = { intro: 0, scroll: 0, px: 0, py: 0, frozen: false };

export function resetHeroScene() {
  Object.assign(heroScene, { intro: 0, scroll: 0, px: 0, py: 0, frozen: false });
}

/** Receives each planet's screen position so the DOM can pin its label. */
export type LabelProjector = (index: number, x: number, y: number, alpha: number) => void;

export const HERO_BODIES = [
  { id: 'merkur', name: 'Merkür', au: '0.39 AU', dist: 5.4, r: 0.3, period: 9, phase: 0.15 },
  { id: 'venus', name: 'Venüs', au: '0.72 AU', dist: 7.3, r: 0.52, period: 13, phase: 0.62 },
  { id: 'dunya', name: 'Dünya', au: '1.00 AU', dist: 9.4, r: 0.56, period: 18, phase: 0.02 },
  { id: 'mars', name: 'Mars', au: '1.52 AU', dist: 11.5, r: 0.42, period: 25, phase: 0.4 },
  { id: 'jupiter', name: 'Jüpiter', au: '5.20 AU', dist: 15.2, r: 1.4, period: 40, phase: 0.78 },
  { id: 'saturn', name: 'Satürn', au: '9.58 AU', dist: 19.6, r: 1.1, period: 58, phase: 0.93 },
] as const;
