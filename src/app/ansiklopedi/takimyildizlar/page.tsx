import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import type { CSSProperties } from 'react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { PartHeading } from '@/components/doc/PartHeading';
import { ConstellationGlyph } from '@/components/ui/CosmicGlyphs';
import { Reveal } from '@/components/motion/primitives';
import { DOC_IMAGES } from '@/data/docImages';
import { constellations } from '@/data/constellations';

export const metadata: Metadata = buildPageMetadata({
  path: '/ansiklopedi/takimyildizlar',
  title: 'Takımyıldızları: Gözlem Ayları ve Mitolojisi | SpaceTour TR',
  description: 'Kuzey yarımküreden çıplak gözle görülebilen takımyıldızları: en iyi gözlem ayları, parlak yıldızları ve mitolojik hikâyeleri.',
});

export default function TakimyildizlarPage() {
  return (
    <div style={{ '--page-accent': 'var(--violet)' } as CSSProperties}>
      <ChapterHero
        variant="band"
        chapter="03.III"
        section="Ansiklopedi · Gökyüzü haritası"
        headline={['Takım', 'yıldızları']}
        lede="Kuzey yarımküreden çıplak gözle görülebilen takımyıldızları, en iyi gözlem ayları ve mitolojik hikâyeleriyle."
        accent="var(--violet)"
        image={DOC_IMAGES['ansik-takimyildizlar']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Ansiklopedi', href: '/ansiklopedi' }, { label: 'Takımyıldızları' }]}
        meta={[{ k: 'Takımyıldızı', v: constellations.length }]}
      />
      <section className="px-[var(--gutter)] pb-28 pt-20">
        <PartHeading part={1} title="Gökyüzünün" serif="haritası" aside={`${constellations.length} takımyıldızı`} />
        <Reveal items="[data-card]" stagger={0.05} className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3 sm:max-lg:fill-row-2 lg:fill-row-3">
          {constellations.map((c, i) => (
            <article key={c.id} id={c.id} data-card className="flex scroll-mt-24 flex-col bg-ink p-7 sm:p-8">
              <div className="flex items-start justify-between">
                <span className="doc-title text-4xl text-paper/80">{String(i + 1).padStart(2, '0')}</span>
                <ConstellationGlyph id={c.id} size={44} className="text-violet" />
              </div>
              <h2 className="doc-title mt-8 text-3xl text-paper">{c.name}</h2>
              <p className="doc-serif text-xl text-violet">{c.latinName}</p>
              <p className="mt-4 text-sm leading-relaxed text-paper/75">{c.description}</p>
              <p className="mt-4 border-l border-violet/40 pl-4 text-sm leading-relaxed text-paper/55">{c.mythology}</p>
              <div className="mt-6 space-y-1.5 border-t border-white/10 pt-4 text-xs font-mono">
                <div className="flex justify-between text-paper/80">
                  <span className="text-muted">En Parlak Yıldız</span>
                  <span className="text-violet text-right font-sans text-xs">{c.brightestStar}</span>
                </div>
                <div className="flex justify-between text-paper/80">
                  <span className="text-muted">Gözlem Mevsimi</span>
                  <span>{c.season}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between border-t border-white/10 pt-4">
                <span className="doc-caption">{c.mainStars} ana yıldız</span>
                <span className="doc-caption text-paper/80">En iyi · {c.bestMonth}</span>
              </div>
            </article>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
