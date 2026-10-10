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

/**
 * Cihaza göre sahne ayrıntısı: 2 masaüstü, 1 telefon ya da orta sınıf, 0 eski/zayıf cihaz.
 * `detail` parçacık, yıldız ve küre bölüt sayılarının çarpanıdır; bileşenler kurulurken bir kez okur.
 * Kademe sahne açıldıktan sonra kare hızı düşük kalırsa ayrıca düşer (çözünürlük, kare sınırı).
 */
export type HeroTier = 0 | 1 | 2;
export const TIER_DETAIL: Record<HeroTier, number> = { 0: 0.4, 1: 0.65, 2: 1 };
export const heroQuality: { tier: HeroTier; detail: number } = { tier: 2, detail: 1 };

export function detectHeroTier(): HeroTier {
  if (typeof window === 'undefined') return 2;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory ?? 8; // Safari bildirmez
  if (nav.connection?.saveData || cores <= 4 || memory <= 3) return 0;
  if (window.matchMedia('(pointer: coarse)').matches || cores <= 6 || memory <= 4) return 1;
  return 2;
}

/** Bölüt/parçacık sayısını ayrıntıya göre ölçekler (alt sınırla). */
export const scaled = (n: number, min = 1) => Math.max(min, Math.round(n * heroQuality.detail));
