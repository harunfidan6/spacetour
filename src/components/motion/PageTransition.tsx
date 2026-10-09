'use client';

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ScrollTrigger } from './gsap';

type TransitionApi = { navigate: (href: string) => void };
const TransitionContext = createContext<TransitionApi>({ navigate: () => {} });

export const usePageTransition = () => useContext(TransitionContext);

/**
 * Sayfa geçişleri anlıktır (perde animasyonu yok): bağlantılar Next'in kendi
 * gezinmesiyle çalışır. Yeni sayfa yerleşince kaydırma tetikleyicileri yeniden ölçülür.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const api = useMemo<TransitionApi>(() => ({ navigate: (href) => router.push(href) }), [router]);

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // İlk hidrasyon bitti: "geç açılış" işaretini (layout'taki satır içi betik) kaldır
  useEffect(() => {
    const w = window as Window & { __splitLate?: number };
    clearTimeout(w.__splitLate);
    const id = requestAnimationFrame(() => document.documentElement.classList.remove('split-late'));
    return () => cancelAnimationFrame(id);
  }, []);

  return <TransitionContext.Provider value={api}>{children}</TransitionContext.Provider>;
}
