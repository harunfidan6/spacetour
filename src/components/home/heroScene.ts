// Ana sayfa açılış sahnesinin three.js'e bağlı olmayan durumu: HomeHero (GSAP, imleç) yazar, 3D sahne okur

/** Mutable state shared with the DOM hero (GSAP writes, the render loop reads). */
export interface HeroSceneState {
  /** 0 → 1 entrance */
  intro: number;
  /** 0 → 1 while the hero scrolls away */
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
