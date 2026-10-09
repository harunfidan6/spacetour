'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import { gsap, ScrollTrigger, SplitText, useGsap, prefersReducedMotion, whenIntroDone } from './gsap';

type SplitRevealProps = {
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'section' | 'ul' | 'ol' | 'li' | 'dl' | 'header';
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Unit that animates. Chars rise under a line mask; words/lines rise under their own mask. */
  by?: 'chars' | 'words' | 'lines';
  /** mount: on mount · scroll: when entering viewport · intro: after the preloader clears */
  trigger?: 'mount' | 'scroll' | 'intro';
  delay?: number;
  stagger?: number;
  duration?: number;
  effect?: 'rise' | 'tilt' | 'fade';
  id?: string;
};

/**
 * Kinetic text reveal. Use for static copy only — SplitText owns the DOM
 * inside, so remount (via `key`) if the text changes.
 */
export function SplitReveal({
  as = 'div',
  children,
  className,
  style,
  by = 'chars',
  trigger = 'scroll',
  delay = 0,
  stagger,
  duration = 1.1,
  effect = 'rise',
  id,
}: SplitRevealProps) {
  // Rendered tag varies; typed as div for the ref.
  const Tag = as as 'div';
  const ref = useRef<HTMLDivElement>(null);

  useGsap(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.setAttribute('data-split-ready', '');
      return;
    }
    // İlk açılış yavaş geçtiyse metin zaten bölünmeden görünüyor: ekrandakini yeniden gizleyip oynatma
    if (document.documentElement.classList.contains('split-late')) {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        el.setAttribute('data-split-ready', '');
        return;
      }
    }

    let started = false;
    let current: gsap.core.Animation | null = null;
    const label = el.textContent?.replace(/\s+/g, ' ').trim() ?? '';

    SplitText.create(el, {
      aria: 'hidden',
      type: by === 'lines' ? 'lines' : by === 'words' ? 'words,lines' : 'chars,words,lines',
      mask: by === 'chars' ? 'lines' : by,
      linesClass: 'split-line',
      wordsClass: 'split-word',
      autoSplit: true,
      onSplit(self) {
        el.setAttribute('data-split-ready', '');
        // Parçalar aria-hidden; tam metni ekran okuyucular bu kopyadan okur (her bölmede yeniden eklenir)
        const sr = document.createElement('span');
        sr.className = 'sr-only';
        sr.textContent = label;
        el.appendChild(sr);
        const targets = by === 'chars' ? self.chars : by === 'words' ? self.words : self.lines;
        const each = stagger ?? (by === 'chars' ? 0.028 : by === 'words' ? 0.06 : 0.1);
        const vars: gsap.TweenVars =
          effect === 'fade'
            ? { autoAlpha: 0, filter: 'blur(8px)', yPercent: 20 }
            : effect === 'tilt'
              ? { yPercent: 165, rotate: 8, transformOrigin: '0% 100%' }
              : { yPercent: 165 };
        current = gsap.from(targets, {
          ...vars,
          duration,
          delay,
          stagger: each,
          ease: 'mg.out',
          paused: !started,
        });
        return current;
      },
    });

    const start = () => {
      started = true;
      current?.play();
    };

    if (trigger === 'mount') start();
    else if (trigger === 'intro') return whenIntroDone(start);
    else {
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: start });
    }
  }, []);

  return (
    <Tag ref={ref} data-split="" className={className} style={style} id={id}>
      {children}
    </Tag>
  );
}
