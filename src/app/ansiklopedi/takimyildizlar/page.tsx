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
        section="Ansiklopedi · Gökyüzü haritası"
        headline={['Takım', 'yıldızları']}
        lede="Kuzey yarımküreden çıplak gözle görülebilen takımyıldızları, en iyi gözlem ayları ve mitolojik hikâyeleriyle."
        accent="var(--violet)"
        image={DOC_IMAGES['ansik-takimyildizlar']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Ansiklopedi', href: '/ansiklopedi' }, { label: 'Takımyıldızları' }]}
        meta={[{ k: 'Takımyıldızı', v: constellations.length }]}
      />
      <section className="px-[var(--gutter)] py-14 sm:py-20">
        <PartHeading title="Gökyüzünün" serif="haritası" />
        <Reveal items="[data-card]" stagger={0.05} className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3 sm:max-lg:fill-row-2 lg:fill-row-3">
          {constellations.map((c) => (
            <article key={c.id} id={c.id} data-card className="flex scroll-mt-24 flex-col bg-ink p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="doc-title text-xl text-paper sm:text-2xl">{c.name}</h2>
                  <p className="doc-serif mt-1 text-lg text-violet">{c.latinName}</p>
                </div>
                <ConstellationGlyph id={c.id} size={44} className="shrink-0 text-violet" />
              </div>
              <p className="mt-5 text-base leading-relaxed text-paper/85">{c.description}</p>
              <p className="mt-4 border-l border-violet/40 pl-4 text-[15px] leading-relaxed text-paper/80">{c.mythology}</p>
              {/* Gözlem verileri kartın dibinde, komşu kartlarla hizalı */}
              <div className="mt-auto pt-6">
                <dl className="space-y-2 border-t border-white/10 pt-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="shrink-0 text-paper/70">En Parlak Yıldız</dt>
                    <dd className="text-right text-violet">{c.brightestStar}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="shrink-0 text-paper/70">Gözlem Mevsimi</dt>
                    <dd className="text-right text-paper/90">{c.season}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="shrink-0 text-paper/70">En iyi ay</dt>
                    <dd className="text-right text-paper/90">{c.bestMonth}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="shrink-0 text-paper/70">Ana yıldız</dt>
                    <dd className="text-right tabular-nums text-paper/90">{c.mainStars}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
