'use client';

import { useLayoutEffect, useEffect, type DependencyList, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, CustomEase);
  // Signature motion curves
  CustomEase.create('mg.out', '0.16,1,0.3,1');
  CustomEase.create('mg.inOut', '0.76,0,0.24,1');
  CustomEase.create('mg.snap', '0.87,0,0.13,1');
  gsap.defaults({ ease: 'mg.out', duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText };

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Runs GSAP code inside a gsap.context scoped to `scope`, reverting everything
 * (tweens, ScrollTriggers, SplitTexts) on unmount or when deps change.
 */
export function useGsap(
  setup: (ctx: gsap.Context) => void | (() => void),
  deps: DependencyList,
  scope?: RefObject<Element | null>
) {
  useIsoLayoutEffect(() => {
    const ctx = gsap.context((self) => setup(self), scope?.current ?? undefined);
    return () => ctx.revert();
  }, deps);
}

/* --------------------------------------------------------------------------
   Stage gate — entrance animations wait until the preloader has cleared
   and no page-transition curtain is covering the viewport.
   -------------------------------------------------------------------------- */
let introDone = false;
let curtainDown = false;
const stageListeners = new Set<() => void>();

function flushStage() {
  if (!introDone || curtainDown) return;
  const pending = Array.from(stageListeners);
  stageListeners.clear();
  pending.forEach((fn) => fn());
}

export function markIntroDone() {
  if (introDone) return;
  introDone = true;
  flushStage();
}

export function setCurtain(covering: boolean) {
  curtainDown = covering;
  flushStage();
}

export function whenIntroDone(fn: () => void) {
  if (introDone && !curtainDown) {
    fn();
    return () => {};
  }
  stageListeners.add(fn);
  return () => {
    stageListeners.delete(fn);
  };
}
