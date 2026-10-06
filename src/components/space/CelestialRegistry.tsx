'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import { planets } from '@/data/planets';
import { matchesQuery } from '@/lib/text';
import { PlanetOrb, OrbCanvas } from '@/components/space/PlanetOrb';
import { gsap, useGsap, prefersReducedMotion } from '@/components/motion/gsap';

const TABS = ['Tümü', 'Gezegenler', 'Yıldızlar', 'Diğer'] as const;
type Tab = (typeof TABS)[number];

export const CELESTIAL_TYPE_LABEL: Record<string, string> = {
  gezegen: 'Gezegen',
  yıldız: 'Yıldız',
  ay: 'Uydu',
  'cüce-gezegen': 'Cüce gezegen',
};

/** Searchable register of every catalogued body; each row opens its own record page. */
export function CelestialRegistry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('Tümü');
  const list = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      planets.filter((p) => {
        const matchesSearch = matchesQuery(searchTerm, p.name, p.description);
        const matchesTab =
          activeTab === 'Tümü' ||
          (activeTab === 'Gezegenler' && p.type === 'gezegen') ||
          (activeTab === 'Yıldızlar' && p.type === 'yıldız') ||
          (activeTab === 'Diğer' && (p.type === 'ay' || p.type === 'cüce-gezegen'));
        return matchesSearch && matchesTab;
      }),
    [searchTerm, activeTab]
  );

  useGsap(
    () => {
      if (prefersReducedMotion() || !list.current) return;
      gsap.fromTo(list.current.querySelectorAll('[data-row]'), { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7, stagger: 0.04, ease: 'mg.out', clearProps: 'opacity,visibility,transform' });
    },
    [activeTab]
  );

  return (
    <div>
      <OrbCanvas />
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="relative w-full max-w-md">
          <span className="sr-only">Gök cismi ara</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Gök cismi veya gezegen ara…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-white/[0.1] bg-ink-2/80 py-3 pl-10 pr-4 text-sm text-paper placeholder:text-muted/60 transition-all focus:border-violet focus:outline-none"
          />
        </label>
        <div className="flex max-w-full gap-1.5 self-start overflow-x-auto no-scrollbar border border-white/[0.08] bg-ink-2/60 p-1" role="group" aria-label="Kayıt türü">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              aria-pressed={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-3.5 py-1.5 font-mono text-xs transition-all ${
                activeTab === tab ? 'bg-violet font-semibold text-ink' : 'text-paper/70 hover:bg-white/[0.04] hover:text-paper'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div ref={list} className="border-t border-white/10">
          <div className="hidden grid-cols-[3.5rem_1fr_10rem_10rem_3rem] items-center gap-4 border-b border-white/10 py-3 text-muted md:grid">
            <span className="doc-kicker text-[10px]">No</span>
            <span className="doc-kicker text-[10px]">Gök Cismi & Hologram</span>
            <span className="doc-kicker text-[10px]">Kategori</span>
            <span className="doc-kicker text-[10px]">Ekvator Çapı</span>
            <span className="doc-kicker text-[10px] text-right">İncele</span>
          </div>
          {filtered.map((p) => {
            const index = planets.indexOf(p) + 1;
            return (
              <div key={p.id} data-row>
                <Link
                  href={`/ansiklopedi/${p.id}`}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-white/10 py-5 transition-colors hover:bg-white/[0.02] md:grid-cols-[3.5rem_1fr_10rem_10rem_3rem]"
                >
                  <span className="doc-caption">{String(index).padStart(2, '0')}</span>
                  <span className="flex min-w-0 items-center gap-4">
                    <PlanetOrb id={p.id} className="h-11 w-11 shrink-0 transition-transform duration-500 group-hover:scale-110 sm:h-14 sm:w-14" spin={1.5} />
                    <span>
                      <span className="doc-title block text-2xl text-paper transition-colors group-hover:text-violet sm:text-4xl">{p.name}</span>
                      <span className="mt-1 block text-xs text-muted md:hidden">
                        {CELESTIAL_TYPE_LABEL[p.type] ?? p.type} · Çap: {p.facts.çap}
                      </span>
                    </span>
                  </span>
                  <span className="doc-caption hidden md:block">{CELESTIAL_TYPE_LABEL[p.type] ?? p.type}</span>
                  <span className="doc-caption hidden md:block">Çap · {p.facts.çap}</span>
                  <span className="grid h-10 w-10 place-items-center justify-self-end rounded-full border border-white/15 text-paper/70 transition-colors group-hover:border-violet group-hover:bg-violet group-hover:text-ink">
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-white/10 py-16 text-center">
          <p className="doc-title text-3xl text-paper">Kayıt bulunamadı</p>
          <p className="mt-2 text-sm text-muted">“{searchTerm}” ile eşleşen gök cismi bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
