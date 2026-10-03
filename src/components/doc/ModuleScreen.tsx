import type { CSSProperties } from 'react';
import { ChapterHero, type Crumb } from './ChapterHero';
import { ModuleRenderer } from './ModuleRenderer';
import { NextChapter } from './NextChapter';
import { findModule, moduleHref, type SectionId } from '@/data/sections';

/** Shared shell for every tool sub-page: title band, the tool itself, then the next-part slate. */
export function ModuleScreen({ sectionId, slug }: { sectionId: SectionId; slug: string }) {
  const found = findModule(sectionId, slug);
  if (!found) return null;
  const { section, module: mod, index, prev, next } = found;
  const total = section.modules.length;
  const nextIndex = (index + 1) % total;
  const isLab = sectionId === 'ansiklopedi';
  const indexHref = isLab ? '/ansiklopedi/laboratuvar' : section.href;

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
        {mod.immersive ? (
          <div className="relative h-[86svh] w-full overflow-hidden border border-white/[0.12] bg-[#020206]">
            <ModuleRenderer id={`${sectionId}/${mod.slug}`} />
          </div>
        ) : (
          <ModuleRenderer id={`${sectionId}/${mod.slug}`} />
        )}
      </section>

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
