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

      <div className="space-y-16 px-[var(--gutter)] py-14 sm:space-y-20 sm:py-20">
        {/* Kart açıklaması başlığın altında tekrar edilmez */}
        <section>
          <PartHeading title="Kimlik" serif="kartları" />
          <div className="grid grid-cols-1 gap-px bg-white/10 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <EpisodeCard href={bodies.href} title={bodies.title} blurb={bodies.blurb} kind={bodies.kind} image={bodies.image} accent={section.accent} size="lg" sizes="(min-width: 1024px) 58vw, 100vw" />
            </div>
            <ol className="grid grid-cols-2 content-start gap-px bg-white/10 max-sm:fill-row-2 sm:grid-cols-3 sm:max-lg:fill-row-3 lg:col-span-5 lg:grid-cols-2 lg:fill-row-2">
              {planets.map((p) => (
                <li key={p.id}>
                  <Link href={`/ansiklopedi/${p.id}`} className="group flex h-full items-center bg-ink px-5 py-4 transition-colors hover:bg-ink-2 sm:py-5">
                    <span className="doc-title text-lg text-paper transition-colors group-hover:text-violet sm:text-xl">{p.name}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section>
          <PartHeading
            title="Deneyerek"
            serif="öğren"
            description="Kepler yörüngelerinden kütleçekim dalgalarına: evrenin kurallarını kaydırıcılarla dene. Her deney kendi sayfasında."
          />
          <EpisodeGrid section={section} entries={section.modules.map((item) => ({ kind: 'module', item }))} />
        </section>

        <section>
          <PartHeading title="Gökyüzünün" serif="haritası" />
          <EpisodeCard href={skies.href} title={skies.title} blurb={skies.blurb} kind={skies.kind} image={skies.image} accent={section.accent} size="lg" sizes="100vw" />
        </section>
      </div>

      {/* SSS kendi kenar boşluğu ve zemini olan tam genişlik bant */}
      <FaqAccordion
        items={FAQS_BY_SECTION.ansiklopedi}
        title="Gezegenler & Evren Rehberi"
        serif="sıkça sorulan sorular"
        description="Güneş Sistemi gezegenleri, cüce gezegenler ve temel astrofizik kavramları rehberi."
        accentColor="var(--violet)"
      />
    </div>
  );
}
