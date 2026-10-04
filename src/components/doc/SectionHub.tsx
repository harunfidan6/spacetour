import type { CSSProperties, ReactNode } from 'react';
import { ChapterHero } from './ChapterHero';
import { EpisodeCard } from './EpisodeCard';
import { PartHeading } from './PartHeading';
import { Reveal } from '@/components/motion/primitives';
import { getSection, moduleHref, type DocCollection, type DocModule, type DocSection, type SectionId } from '@/data/sections';

type Entry = { kind: 'module'; item: DocModule } | { kind: 'collection'; item: DocCollection };

function entryCard(section: DocSection, entry: Entry, number: string, size: 'md' | 'lg', wide: boolean) {
  const { item } = entry;
  const href = entry.kind === 'module' ? moduleHref(section, entry.item) : entry.item.href;
  const title = entry.kind === 'module' ? entry.item.short : entry.item.title;
  return (
    <EpisodeCard
      key={href}
      href={href}
      index={number}
      title={title}
      blurb={item.blurb}
      kind={item.kind}
      image={item.image}
      accent={section.accent}
      size={size}
      sizes={wide ? '(min-width: 1024px) 66vw, 100vw' : undefined}
    />
  );
}

// Literal class names so Tailwind generates them
const SPAN_SM = { 1: 'sm:col-span-1', 2: 'sm:col-span-2' } as const;
const SPAN_LG = { 1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3' } as const;

/**
 * Column spans per breakpoint (2 columns on sm, 3 on lg). The featured first card spans two;
 * the last card stretches over whatever the final row has left, so the hairline grid never
 * shows its background through an empty cell.
 */
function layoutSpans(count: number, featureFirst: boolean) {
  const spans = Array.from({ length: count }, (_, i) => (featureFirst && i === 0 && count > 2 ? { sm: 2, lg: 2 } : { sm: 1, lg: 1 }));
  for (const [bp, cols] of [['sm', 2], ['lg', 3]] as const) {
    const used = spans.reduce((n, s) => n + s[bp], 0) % cols;
    if (used && count > 0) spans[count - 1][bp] += cols - used;
  }
  return spans as { sm: 1 | 2; lg: 1 | 2 | 3 }[];
}

/** A grid of episode cards; the first can be featured across two columns. */
export function EpisodeGrid({ section, entries, featureFirst = true }: { section: DocSection; entries: Entry[]; featureFirst?: boolean }) {
  const spans = layoutSpans(entries.length, featureFirst);
  return (
    <Reveal items="[data-ep]" stagger={0.06} className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry, i) => {
        const featured = featureFirst && i === 0 && entries.length > 2;
        const { sm, lg } = spans[i];
        return (
          <div key={i} className={`min-w-0 ${SPAN_SM[sm]} ${SPAN_LG[lg]}`}>
            {entryCard(section, entry, String(i + 1).padStart(2, '0'), featured ? 'lg' : 'md', lg > 1)}
          </div>
        );
      })}
    </Reveal>
  );
}

/**
 * Section hub: full-screen chapter opening, then the parts of the chapter as
 * episode cards. Hubs with `groups` (astrology) get one part per group.
 */
export function SectionHub({
  sectionId,
  meta,
  intro,
  outro,
  partTitle,
  partSerif,
  partDescription,
}: {
  sectionId: SectionId;
  meta?: { k: string; v: ReactNode }[];
  intro?: ReactNode;
  /** Rendered after the parts, e.g. a foundations section */
  outro?: ReactNode;
  partTitle?: string;
  partSerif?: string;
  partDescription?: string;
}) {
  const section = getSection(sectionId);
  const modules: Entry[] = section.modules.map((item) => ({ kind: 'module', item }));
  const collections: Entry[] = (section.collections ?? []).map((item) => ({ kind: 'collection', item }));

  return (
    <div style={{ '--page-accent': section.accent } as CSSProperties}>
      <ChapterHero
        chapter={section.chapter}
        section={section.title}
        headline={section.headline}
        lede={section.lede}
        accent={section.accent}
        image={section.image}
        meta={meta}
      />

      <div className="space-y-24 px-[var(--gutter)] pb-28 pt-20 sm:space-y-32">
        {intro}
        {section.groups ? (
          section.groups.map((g, gi) => {
            const entries = [...modules, ...collections].filter((e) => e.item.group === g.name);
            const [title, ...rest] = g.name.split(' & ');
            return (
              <section key={g.name}>
                <PartHeading part={gi + 1} title={title} serif={rest.length ? `& ${rest.join(' & ')}` : undefined} description={g.description} aside={`${entries.length} kısım`} />
                <EpisodeGrid section={section} entries={entries} featureFirst={false} />
              </section>
            );
          })
        ) : (
          <section>
            <PartHeading
              part={1}
              title={partTitle ?? 'Bölümün'}
              serif={partSerif ?? 'kısımları'}
              description={partDescription}
              aside={`${modules.length} kısım`}
            />
            <EpisodeGrid section={section} entries={[...modules, ...collections]} />
          </section>
        )}
        {outro}
      </div>
    </div>
  );
}
