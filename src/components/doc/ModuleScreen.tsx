import type { CSSProperties } from 'react';
import { ChapterHero, type Crumb } from './ChapterHero';
import { ModuleRenderer } from './ModuleRenderer';
import { NextChapter } from './NextChapter';
import { PartHeading } from './PartHeading';
import { findModule, moduleHref, type SectionId } from '@/data/sections';
import { MODULE_GUIDES } from '@/data/moduleGuides';

/** Shared shell for every tool sub-page: title band, the tool itself, then the guide & next-part slate. */
export function ModuleScreen({ sectionId, slug }: { sectionId: SectionId; slug: string }) {
  const found = findModule(sectionId, slug);
  if (!found) return null;
  const { section, module: mod, prev, next } = found;
  const total = section.modules.length;
  const isLab = sectionId === 'ansiklopedi';
  const indexHref = isLab ? '/ansiklopedi/laboratuvar' : section.href;
  const guide = MODULE_GUIDES[`${sectionId}/${mod.slug}`];

  const crumbs: Crumb[] = [
    { label: 'Ana sayfa', href: '/' },
    { label: section.title, href: section.href },
    ...(isLab ? [{ label: 'Laboratuvar', href: '/ansiklopedi/laboratuvar' }] : []),
    { label: mod.short },
  ];

  return (
    <div style={{ '--page-accent': section.accent } as CSSProperties}>
      <ChapterHero
        variant="band"
        section={section.title}
        headline={[mod.short]}
        accent={section.accent}
        image={mod.image}
        crumbs={crumbs}
        lede={
          <>
            <span className="doc-serif mb-3 block text-xl text-paper sm:text-2xl">{mod.title}</span>
            {mod.blurb}
          </>
        }
        meta={[{ k: 'Tür', v: mod.kind }]}
      />

      <section aria-label={mod.title} className="module px-[var(--gutter)] py-14 sm:py-20">
        <h2 className="sr-only">{mod.title}</h2>
        {mod.immersive ? (
          <div className="relative h-[86svh] w-full overflow-hidden border border-white/[0.12] bg-[#020206]">
            <ModuleRenderer id={`${sectionId}/${mod.slug}`} />
          </div>
        ) : (
          <ModuleRenderer id={`${sectionId}/${mod.slug}`} />
        )}
      </section>

      {guide && (
        <section aria-label={`${mod.title} Rehberi`} className="guide border-t border-white/[0.08] bg-ink-2/40 px-[var(--gutter)] py-14 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <PartHeading title={guide.title} serif={guide.serif} description={guide.summary} />

            <div className="space-y-5 text-base leading-relaxed text-paper/85 sm:text-lg">
              {guide.intro.map((p, i) => (
                <p key={i} className={i === 0 ? 'doc-serif text-lg leading-relaxed text-paper sm:text-xl' : undefined}>
                  {p}
                </p>
              ))}
            </div>

            {/* Alt bölümler: süs künyesi yerine tek, sade ara başlık */}
            {guide.howTo && guide.howTo.length > 0 && (
              <div className="mt-14 sm:mt-16">
                <p className="mb-5 text-lg font-semibold text-paper">{guide.howToTitle ?? 'Nasıl Okunur?'}</p>
                <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3 sm:fill-row-3">
                  {guide.howTo.map((step) => (
                    <article key={step.step} className="flex min-w-0 flex-col bg-ink p-6">
                      <span className="mb-3 text-sm font-semibold tabular-nums" style={{ color: 'var(--page-accent)' }}>
                        {step.step}
                      </span>
                      <h3 className="doc-title mb-2 text-lg text-paper">{step.title}</h3>
                      <p className="text-[15px] leading-relaxed text-paper/80">{step.desc}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {guide.facts && guide.facts.length > 0 && (
              <div className="mt-14 sm:mt-16">
                <p className="mb-5 text-lg font-semibold text-paper">{guide.factsTitle ?? 'Kozmik Kayıtlar'}</p>
                <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4 sm:max-lg:fill-row-2 lg:fill-row-4">
                  {guide.facts.map((fact, idx) => (
                    <div key={idx} className="flex min-w-0 flex-col bg-ink p-5 sm:p-6">
                      <span className="text-sm text-paper/70">{fact.label}</span>
                      <span className="doc-title mt-2 break-words text-xl text-paper">{fact.value}</span>
                      {fact.desc && <span className="mt-2 text-sm leading-relaxed text-paper/70">{fact.desc}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {guide.takeaways && guide.takeaways.length > 0 && (
              <div className="mt-14 border border-white/10 bg-ink p-6 sm:mt-16 sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: 'var(--page-accent)' }} />
                  <h3 className="doc-title text-lg text-paper">{guide.takeawaysTitle ?? 'Biliyor Muydunuz?'}</h3>
                </div>
                <ul className="space-y-3">
                  {guide.takeaways.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-base leading-relaxed text-paper/85">
                      <span className="shrink-0 text-paper/40">—</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <NextChapter
        next={{
          href: moduleHref(section, next),
          label: 'Sıradaki kısım',
          title: next.short,
          image: next.image,
        }}
        prev={{ href: moduleHref(section, prev), title: prev.short }}
        indexHref={indexHref}
        indexLabel={`${isLab ? 'Laboratuvar' : section.title} · ${total} kısım`}
      />
    </div>
  );
}
