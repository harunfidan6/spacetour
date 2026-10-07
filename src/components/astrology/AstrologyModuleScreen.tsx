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

export function AstrologyModuleScreen({ slug }: { slug: string }) {
  const found = findModule('astroloji', slug);
  if (!found) return null;

  const { section, module: mod, prev, next } = found;
  const guide = MODULE_GUIDES[`astroloji/${mod.slug}`];
  const method = TOOL_METHODS[`astroloji/${mod.slug}`];
  const chamberName = mod.group || 'Doğum & Sinastri';

  // Find all sibling modules in the same chamber
  const chamberSiblings = section.modules.filter((m) => m.group === chamberName);

  return (
    <div style={{ '--page-accent': 'var(--gold)' } as CSSProperties} className="relative">
      {/* 1. Bespoke Celestial Subpage Hero ("I. ODA" gibi süs künyeleri yok; grup adı içerik yolunda) */}
      <ChapterHero
        variant="band"
        section={`Astroloji · ${chamberName}`}
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
            <span className="doc-serif mb-3 block text-xl text-paper sm:text-2xl">
              {mod.title}
            </span>
            <span className="block leading-relaxed">{mod.blurb}</span>
          </>
        }
        meta={[
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
          className="border-b border-white/10 bg-ink px-[var(--gutter)] py-3"
        >
          <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
            <span className="flex items-center gap-2 text-paper/70">
              <AstrolabeGlyph size={14} className="text-gold" />
              <span>{chamberName}</span>
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              {chamberSiblings.map((sib) => {
                const isActive = sib.slug === mod.slug;
                return (
                  <Link
                    key={sib.slug}
                    href={`/astroloji/${sib.slug}`}
                    className={`border px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? 'border-gold bg-gold font-semibold text-ink'
                        : 'border-white/10 bg-ink-2 text-paper/75 hover:border-gold/40 hover:text-paper'
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
          className="guide border-t border-white/10 bg-ink-2/40 px-[var(--gutter)] py-14 sm:py-20"
        >
          <div className="mx-auto max-w-5xl space-y-12 sm:space-y-14">
            {/* Başlık; "EZOTERİK METİN · I. ODA" yan künyesi kaldırıldı */}
            <PartHeading title={guide.title} serif={guide.serif} description={guide.summary} />

            <div className="space-y-5 text-base leading-relaxed text-paper/85 sm:text-lg">
              {guide.intro.map((p, i) => (
                <p
                  key={i}
                  className={i === 0 ? 'doc-serif border-l-2 border-gold/60 pl-5 text-lg leading-relaxed text-paper sm:text-xl' : undefined}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* How-To Reading Guide: süs künyesi yerine sade ara başlık */}
            {guide.howTo && guide.howTo.length > 0 && (
              <div>
                <p className="mb-5 text-lg font-semibold text-paper">{guide.howToTitle ?? 'Nasıl Okunur?'}</p>

                <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3 sm:fill-row-3">
                  {guide.howTo.map((step) => (
                    <article key={step.step} className="flex flex-col bg-ink p-6">
                      <span className="mb-3 text-sm font-semibold tabular-nums text-gold">{step.step}</span>
                      <h3 className="doc-title mb-2 text-lg text-paper">{step.title}</h3>
                      <p className="text-[15px] leading-relaxed text-paper/80">{step.desc}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Facts Grid */}
            {guide.facts && guide.facts.length > 0 && (
              <div>
                <p className="mb-5 text-lg font-semibold text-paper">{guide.factsTitle ?? 'Veriler'}</p>

                <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4 sm:max-lg:fill-row-2 lg:fill-row-4">
                  {guide.facts.map((fact) => (
                    <div key={fact.label} className="flex min-w-0 flex-col bg-ink p-5">
                      <span className="text-sm text-paper/70">{fact.label}</span>
                      <span className="mt-2 break-words font-mono text-base font-semibold text-paper">
                        {fact.value}
                      </span>
                      {fact.desc && (
                        <p className="mt-2 text-sm leading-relaxed text-paper/75">
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
              <div className="space-y-4 border border-white/10 bg-ink p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-gold" />
                  <span className="text-lg font-semibold text-paper">
                    {guide.takeawaysTitle ?? 'Biliyor Muydunuz?'}
                  </span>
                </div>
                <div className="space-y-3">
                  {guide.takeaways.map((takeaway, i) => (
                    <div key={i} className="flex items-start gap-3 text-base leading-relaxed text-paper/85">
                      <span className="shrink-0 text-gold/70">✦</span>
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
        <section aria-label={method.title} className="border-t border-white/10 px-[var(--gutter)] py-14 sm:py-20">
          <div className="mx-auto max-w-5xl">
            {/* PartHeading ile aynı düzen: tek ince çizgi + başlık (künye satırı yok) */}
            <span aria-hidden className="doc-rule block w-16" />
            <h2 className="doc-title mt-5 text-[clamp(1.6rem,3.4vw,2.5rem)] text-paper">{method.title}</h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-paper/85 sm:text-lg">{method.intro}</p>
            <ol className="mt-8 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 sm:fill-row-2">
              {method.steps.map((step, i) => (
                <li key={step.title} className="flex flex-col bg-ink p-6">
                  <span className="mb-3 text-sm font-semibold tabular-nums text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="doc-title mb-2 text-lg text-paper">{step.title}</h3>
                  <p className="text-[15px] leading-relaxed text-paper/80">{step.desc}</p>
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
          description={`${mod.short} hakkında en çok merak edilenler.`}
        />
      )}

      {/* 8. Next Instrument in Line */}
      <NextChapter
        next={{
          href: moduleHref(section, next),
          label: 'Sıradaki Enstrüman',
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
