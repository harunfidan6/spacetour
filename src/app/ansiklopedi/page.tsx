import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { PartHeading } from '@/components/doc/PartHeading';
import { EpisodeCard } from '@/components/doc/EpisodeCard';
import { EpisodeGrid } from '@/components/doc/SectionHub';
import { planets } from '@/data/planets';
import { constellations } from '@/data/constellations';
import { getSection } from '@/data/sections';
import { FaqAccordion } from '@/components/doc/FaqAccordion';
import { FAQS_BY_SECTION } from '@/data/faqs';

export default function AnsiklopediPage() {
  const section = getSection('ansiklopedi');
  const [bodies, skies] = section.collections ?? [];
  const planetCount = planets.filter((p) => p.type === 'gezegen').length;

  return (
    <div style={{ '--page-accent': section.accent } as CSSProperties}>
      <ChapterHero
        chapter={section.chapter}
        section={section.title}
        headline={section.headline}
        lede={section.lede}
        accent={section.accent}
        image={section.image}
        meta={[
          { k: 'Kayıt', v: planets.length },
          { k: 'Gezegen', v: planetCount },
          { k: 'Takımyıldızı', v: constellations.length },
          { k: 'Laboratuvar', v: section.modules.length },
        ]}
      />

      <div className="space-y-24 px-[var(--gutter)] pb-28 pt-20 sm:space-y-32">
        <section>
          <PartHeading part={1} title="Kimlik" serif="kartları" description={bodies.blurb} aside={`${planets.length} kayıt`} />
          <div className="grid grid-cols-1 gap-px bg-white/10 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <EpisodeCard href={bodies.href} index="01" title={bodies.title} blurb={bodies.blurb} kind={bodies.kind} image={bodies.image} accent={section.accent} size="lg" sizes="(min-width: 1024px) 58vw, 100vw" />
            </div>
            <ol className="grid grid-cols-2 content-start gap-px bg-white/10 max-sm:fill-row-2 sm:grid-cols-3 sm:max-lg:fill-row-3 lg:col-span-5 lg:grid-cols-2 lg:fill-row-2">
              {planets.map((p, i) => (
                <li key={p.id}>
                  <Link href={`/ansiklopedi/${p.id}`} className="group flex h-full items-baseline gap-3 bg-ink px-5 py-5 transition-colors hover:bg-ink-2">
                    <span className="doc-caption">{String(i + 1).padStart(2, '0')}</span>
                    <span className="doc-title text-xl text-paper transition-colors group-hover:text-violet">{p.name}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section>
          <PartHeading
            part={2}
            title="Deneyerek"
            serif="öğren"
            description="Kepler yörüngelerinden kütleçekim dalgalarına: evrenin kurallarını kaydırıcılarla dene. Her deney kendi sayfasında."
            aside={`${section.modules.length} laboratuvar`}
          />
          <EpisodeGrid section={section} entries={section.modules.map((item) => ({ kind: 'module', item }))} />
        </section>

        <section>
          <PartHeading part={3} title="Gökyüzünün" serif="haritası" description={skies.blurb} aside={`${constellations.length} takımyıldızı`} />
          <EpisodeCard href={skies.href} index="03" title={skies.title} blurb={skies.blurb} kind={skies.kind} image={skies.image} accent={section.accent} size="lg" sizes="100vw" />
        </section>

        {/* Encyclopedia & Celestial Mechanics FAQ Guide */}
        <FaqAccordion
          items={FAQS_BY_SECTION.ansiklopedi}
          title="Gezegenler & Evren Rehberi"
          serif="sıkça sorulan sorular"
          kicker="Astrofizik Ansiklopedisi · SSS"
          description="Güneş Sistemi gezegenleri, cüce gezegenler ve temel astrofizik kavramları rehberi."
          accentColor="var(--violet)"
        />
      </div>
    </div>
  );
}
