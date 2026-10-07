'use client';

import React from 'react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Sparkles } from 'lucide-react';
import { AstrolabeGlyph } from '@/components/ui/CosmicGlyphs';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { ModuleRenderer } from '@/components/doc/ModuleRenderer';
import { NextChapter } from '@/components/doc/NextChapter';
import { PartHeading } from '@/components/doc/PartHeading';
import { findModule, moduleHref } from '@/data/sections';
import { MODULE_GUIDES } from '@/data/moduleGuides';
import { TOOL_METHODS } from '@/data/toolMethods';
import { FaqAccordion } from '@/components/doc/FaqAccordion';
import { CelestialHorizonBar } from './CelestialHorizonBar';

const CHAMBER_ROMAN: Record<string, string> = {
  'Doğum & Sinastri': 'I. ODA',
  'Tarot & Kehanet': 'II. ODA',
  'Transitler & Ay': 'III. ODA',
  'Numeroloji & Zodyak': 'IV. ODA',
};

export function AstrologyModuleScreen({ slug }: { slug: string }) {
  const found = findModule('astroloji', slug);
  if (!found) return null;

  const { section, module: mod, index, prev, next } = found;
  const guide = MODULE_GUIDES[`astroloji/${mod.slug}`];
  const method = TOOL_METHODS[`astroloji/${mod.slug}`];
  const chamberName = mod.group || 'Doğum & Sinastri';
  const chamberRoman = CHAMBER_ROMAN[chamberName] || 'I. ODA';

  // Find all sibling modules in the same chamber
  const chamberSiblings = section.modules.filter((m) => m.group === chamberName);

  return (
    <div style={{ '--page-accent': 'var(--gold)' } as CSSProperties} className="relative">
      {/* 1. Bespoke Celestial Subpage Hero */}
      <ChapterHero
        variant="band"
        chapter={`04 · ${String(index + 1).padStart(2, '0')}`}
        section={`Astroloji · ${chamberRoman}: ${chamberName}`}
        headline={[mod.short]}
        accent="var(--gold)"
        image={mod.image}
        crumbs={[
          { label: 'Ana sayfa', href: '/' },
          { label: 'Astroloji', href: '/astroloji' },
          { label: chamberName, href: '/astroloji' },
          { label: mod.short },
        ]}
        lede={
          <>
            <span className="doc-serif mb-2 block text-2xl text-paper sm:text-3xl">
              {mod.title}
            </span>
            <span className="text-paper/80 leading-relaxed block">{mod.blurb}</span>
          </>
        }
        meta={[
          { k: 'Oda', v: chamberRoman },
          { k: 'Tür', v: mod.kind },
          { k: 'Hesaplama', v: 'JPL Efemerisi' },
        ]}
      />

      {/* 2. Live Celestial Horizon Bar */}
      <CelestialHorizonBar compact />

      {/* 3. Chamber Navigation Sibling Strip */}
      {chamberSiblings.length > 1 && (
        <nav
          aria-label={`${chamberName} araçları`}
          className="border-b border-gold/15 bg-ink px-[var(--gutter)] py-3"
        >
          <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-muted uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <AstrolabeGlyph size={13} className="text-gold" />
              <span>{chamberRoman} ENSTRÜMANLARI:</span>
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              {chamberSiblings.map((sib) => {
                const isActive = sib.slug === mod.slug;
                return (
                  <Link
                    key={sib.slug}
                    href={`/astroloji/${sib.slug}`}
                    className={`px-3 py-1 border transition-all uppercase tracking-wider text-[11px] ${
                      isActive
                        ? 'border-gold bg-gold text-ink font-bold shadow-[0_0_12px_rgba(245,197,66,0.3)]'
                        : 'border-white/10 bg-ink-2 text-muted hover:border-gold/40 hover:text-paper'
                    }`}
                  >
                    {sib.short}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* 4. Active Astrology Instrument Stage */}
      <section aria-label={mod.title} className="module px-[var(--gutter)] py-12 sm:py-16">
        <h2 className="sr-only">{mod.title}</h2>
        <div className="mx-auto max-w-6xl">
          <ModuleRenderer id={`astroloji/${mod.slug}`} />
        </div>
      </section>

      {/* 5. Sacred Esoteric Field Guide Slate */}
      {guide && (
        <section
          aria-label={`${mod.title} Rehberi`}
          className="guide border-t border-gold/20 bg-gradient-to-b from-ink-2/60 via-ink to-ink px-[var(--gutter)] py-16 sm:py-24"
        >
          <div className="mx-auto max-w-5xl space-y-14">
            <PartHeading
              part={2}
              title={guide.title}
              serif={guide.serif}
              aside={`EZOTERİK METİN · ${chamberRoman}`}
              description={guide.summary}
            />

            <div className="space-y-6 text-base leading-relaxed text-paper/85 sm:text-lg">
              {guide.intro.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? 'doc-serif text-xl sm:text-2xl text-paper leading-relaxed border-l-2 border-gold pl-5'
                      : 'leading-relaxed text-paper/80'
                  }
                >
                  {p}
                </p>
              ))}
            </div>

            {/* How-To Reading Guide */}
            {guide.howTo && guide.howTo.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-gold/20 pb-3">
                  <span className="doc-kicker text-gold">Kadim Okuma Rehberi</span>
                  <span aria-hidden className="doc-rule flex-1" />
                  <span className="doc-caption text-paper/60">{guide.howToTitle ?? 'Nasıl Okunur?'}</span>
                </div>

                <div className="grid gap-px border border-gold/20 bg-gold/10 sm:grid-cols-3">
                  {guide.howTo.map((step) => (
                    <article key={step.step} className="flex flex-col bg-ink p-6 sm:p-7">
                      <span className="doc-title text-3xl text-gold/70 mb-3">{step.step}</span>
                      <h3 className="doc-title text-xl text-paper mb-2">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-paper/75">{step.desc}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Esoteric Facts Grid */}
            {guide.facts && guide.facts.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-gold/20 pb-3">
                  <span className="doc-kicker text-gold">Göksel Parametreler & Formüller</span>
                  <span aria-hidden className="doc-rule flex-1" />
                  <span className="doc-caption text-paper/60">{guide.factsTitle ?? 'Veriler'}</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {guide.facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="border border-gold/20 bg-ink-2/80 p-4 space-y-1.5"
                    >
                      <span className="doc-caption block text-[10px] text-gold uppercase tracking-wider">
                        {fact.label}
                      </span>
                      <span className="font-mono text-base font-bold text-paper block">
                        {fact.value}
                      </span>
                      {fact.desc && (
                        <p className="text-xs text-paper/60 font-sans leading-relaxed">
                          {fact.desc}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Takeaways / "Biliyor Muydunuz?" */}
            {guide.takeaways && guide.takeaways.length > 0 && (
              <div className="border border-gold/30 bg-gold/[0.04] p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-gold">
                  <Sparkles size={16} />
                  <span className="doc-kicker text-gold">
                    {guide.takeawaysTitle ?? 'Biliyor Muydunuz?'}
                  </span>
                </div>
                <div className="space-y-3">
                  {guide.takeaways.map((takeaway, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm leading-relaxed text-paper/85">
                      <span className="text-gold font-mono font-bold mt-0.5">✦</span>
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. Nasıl hesaplanır? (aracın gerçek yöntemi) */}
      {method && (
        <section aria-label={method.title} className="border-t border-gold/20 px-[var(--gutter)] py-16 sm:py-24">
          <div className="mx-auto max-w-5xl space-y-8">
            <div className="flex items-center gap-4 border-b border-gold/20 pb-3">
              <span className="doc-kicker text-gold">Yöntem</span>
              <span aria-hidden className="doc-rule flex-1" />
              <span className="doc-caption text-paper/60">Hesaplama adımları</span>
            </div>
            <h2 className="doc-title text-3xl text-paper sm:text-4xl">{method.title}</h2>
            <p className="max-w-3xl text-base leading-relaxed text-paper/80 sm:text-lg">{method.intro}</p>
            <ol className="grid gap-px border border-gold/20 bg-gold/10 sm:grid-cols-2">
              {method.steps.map((step, i) => (
                <li key={step.title} className="flex flex-col bg-ink p-6 sm:p-7">
                  <span className="doc-title mb-3 text-2xl text-gold/70">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="doc-title mb-2 text-lg text-paper">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-paper/75">{step.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* 7. Araca özel soru-cevaplar (FAQPage şemasıyla) */}
      {method && method.faq.length > 0 && (
        <FaqAccordion
          items={method.faq}
          title="Sık sorulanlar"
          serif={mod.short}
          kicker="Soru & cevap"
          description={`${mod.short} hakkında en çok merak edilenler.`}
        />
      )}

      {/* 8. Next Instrument in Line */}
      <NextChapter
        next={{
          href: moduleHref(section, next),
          label: 'Sıradaki Enstrüman',
          number: `04.${((index + 1) % section.modules.length) + 1}`,
          title: next.short,
          image: next.image,
        }}
        prev={{ href: moduleHref(section, prev), title: prev.short }}
        indexHref="/astroloji"
        indexLabel="Astroloji · Zodyak Atlası & Göksel Çark"
      />
    </div>
  );
}
