import Link from 'next/link';
import { HomeHero } from '@/components/home/HomeHero';
import { ChapterPanel } from '@/components/doc/ChapterPanel';
import { OrbCanvas } from '@/components/space/PlanetOrb';
import { SECTIONS } from '@/data/sections';

export default function Home() {
  return (
    <div className="relative bg-ink text-paper">
      <HomeHero />

      {/* Table of contents — the seven chapters at a glance */}
      <section id="bolumler" aria-label="Bölümler" className="scroll-mt-16 border-t border-white/10 px-[var(--gutter)] py-16 sm:py-20">
        <div className="flex items-center gap-4">
          <span className="doc-kicker text-gold">İçindekiler</span>
          <span aria-hidden className="doc-rule flex-1" />
          <span className="doc-caption">{SECTIONS.length} bölüm</span>
        </div>
        <ol className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2 sm:max-lg:fill-row-2 lg:grid-cols-7">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <Link href={s.href} className="group flex h-full flex-col gap-6 bg-ink p-5 transition-colors hover:bg-ink-2">
                <span className="doc-title text-4xl text-paper/30 transition-colors group-hover:text-paper">{s.chapter}</span>
                <span>
                  <span className="doc-title block text-xl text-paper">{s.title}</span>
                  <span className="doc-caption mt-2 block">{s.kicker}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {SECTIONS.map((s, i) => (
        <ChapterPanel key={s.id} section={s} flip={i % 2 === 1} />
      ))}

      <OrbCanvas />
    </div>
  );
}
