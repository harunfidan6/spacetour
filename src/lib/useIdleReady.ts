'use client';

import { useEffect, useState } from 'react';

/**
 * Sayfa yüklenip tarayıcı boşa çıkınca true olur. Ağır 3D sahneler (three.js) ilk boyamayı ve
 * etkileşimi geciktirmesin diye bununla ertelenir. Film çekiminde (?film=1) hemen true döner.
 */
export function useIdleReady(timeout = 2500) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const go = () => setReady(true);
    if (document.documentElement.dataset.film !== undefined) {
      const t = setTimeout(go, 0);
      return () => clearTimeout(t);
    }
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(go, { timeout });
      else timer = setTimeout(go, 200);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      window.removeEventListener('load', schedule);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer) clearTimeout(timer);
    };
  }, [timeout]);
  return ready;
}
