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
  const { section, module: mod, index, prev, next } = found;
  const total = section.modules.length;
  const nextIndex = (index + 1) % total;
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
        chapter={`${section.chapter}.${index + 1}`}
        section={`${section.title} · Kısım ${index + 1} / ${total}`}
        headline={[mod.short]}
        accent={section.accent}
        image={mod.image}
        crumbs={crumbs}
        lede={
          <>
            <span className="doc-serif mb-3 block text-2xl text-paper sm:text-3xl">{mod.title}</span>
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
        <section aria-label={`${mod.title} Rehberi`} className="guide border-t border-white/[0.08] bg-ink-2/40 px-[var(--gutter)] py-16 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <PartHeading
              part={2}
              title={guide.title}
              serif={guide.serif}
              aside={guide.kicker}
              description={guide.summary}
            />

            <div className="mt-10 space-y-6 text-base leading-relaxed text-paper/80 sm:text-lg">
              {guide.intro.map((p, i) => (
                <p key={i} className={i === 0 ? 'doc-serif text-xl sm:text-2xl text-paper leading-relaxed break-words' : 'break-words'}>
                  {p}
                </p>
              ))}
            </div>

            {guide.howTo && guide.howTo.length > 0 && (
              <div className="mt-16 sm:mt-20">
                <div className="flex items-center gap-4 mb-8">
                  <span className="doc-kicker" style={{ color: 'var(--page-accent)' }}>
                    Rehber & Okuma
                  </span>
                  <span aria-hidden className="doc-rule flex-1" />
                  <span className="doc-caption">{guide.howToTitle ?? 'Nasıl Okunur?'}</span>
                </div>
                <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3 sm:fill-row-3">
                  {guide.howTo.map((step) => (
                    <article key={step.step} className="flex min-w-0 flex-col bg-ink p-6 sm:p-7">
                      <span className="doc-title text-3xl text-paper/40 mb-4">{step.step}</span>
                      <h3 className="doc-title break-words text-xl text-paper mb-2">{step.title}</h3>
                      <p className="text-sm leading-relaxed text-paper/70 break-words">{step.desc}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {guide.facts && guide.facts.length > 0 && (
              <div className="mt-16 sm:mt-20">
                <div className="flex items-center gap-4 mb-8">
                  <span className="doc-kicker" style={{ color: 'var(--page-accent)' }}>
                    Parametreler & Veriler
                  </span>
                  <span aria-hidden className="doc-rule flex-1" />
                  <span className="doc-caption">{guide.factsTitle ?? 'Kozmik Kayıtlar'}</span>
                </div>
                <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4 sm:max-lg:fill-row-2 lg:fill-row-4">
                  {guide.facts.map((fact, idx) => (
                    <div key={idx} className="flex min-w-0 flex-col justify-between bg-ink p-5 sm:p-6">
                      <span className="doc-kicker break-words text-paper/60 mb-3">{fact.label}</span>
                      <span className="doc-title break-words text-xl sm:text-2xl text-paper mb-2">{fact.value}</span>
                      {fact.desc && <span className="doc-caption break-words text-paper/50">{fact.desc}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {guide.takeaways && guide.takeaways.length > 0 && (
              <div className="mt-16 sm:mt-20 rounded-xl border border-white/[0.08] bg-black/40 p-6 sm:p-8 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-2 w-2 rounded-full" style={{ background: 'var(--page-accent)' }} />
                  <h3 className="doc-title text-xl text-paper">{guide.takeawaysTitle ?? 'Biliyor Muydunuz?'}</h3>
                </div>
                <ul className="space-y-4">
                  {guide.takeaways.map((tip, i) => (
                    <li key={i} className="flex items-start gap-4 text-sm sm:text-base leading-relaxed text-paper/75">
                      <span className="doc-kicker shrink-0 mt-0.5 text-paper/40">—</span>
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
          number: `${section.chapter}.${nextIndex + 1}`,
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
