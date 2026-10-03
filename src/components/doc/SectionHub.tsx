import type { CSSProperties, ReactNode } from 'react';
import { ChapterHero } from './ChapterHero';
import { EpisodeCard } from './EpisodeCard';
import { PartHeading } from './PartHeading';
import { Reveal } from '@/components/motion/primitives';
import { getSection, moduleHref, type DocCollection, type DocModule, type DocSection, type SectionId } from '@/data/sections';

type Entry = { kind: 'module'; item: DocModule } | { kind: 'collection'; item: DocCollection };

function entryCard(section: DocSection, entry: Entry, number: string, size: 'md' | 'lg') {
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
      sizes={size === 'lg' ? '(min-width: 1024px) 66vw, 100vw' : undefined}
    />
  );
}

/** A grid of episode cards; the first can be featured across two columns. */
export function EpisodeGrid({ section, entries, featureFirst = true }: { section: DocSection; entries: Entry[]; featureFirst?: boolean }) {
  return (
    <Reveal items="[data-ep]" stagger={0.06} className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry, i) => {
        const featured = featureFirst && i === 0 && entries.length > 2;
        return (
          <div key={i} className={`min-w-0 ${featured ? 'sm:col-span-2 lg:col-span-2' : ''}`}>
            {entryCard(section, entry, String(i + 1).padStart(2, '0'), featured ? 'lg' : 'md')}
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
  partTitle,
  partSerif,
  partDescription,
}: {
  sectionId: SectionId;
  meta?: { k: string; v: ReactNode }[];
  intro?: ReactNode;
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
      </div>
    </div>
  );
}
