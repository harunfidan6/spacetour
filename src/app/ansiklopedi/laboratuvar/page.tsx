import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { PartHeading } from '@/components/doc/PartHeading';
import { EpisodeGrid } from '@/components/doc/SectionHub';
import { DOC_IMAGES } from '@/data/docImages';
import { getSection } from '@/data/sections';

export const metadata: Metadata = {
  title: 'Laboratuvar · Ansiklopedi',
  description: 'Kepler yörüngelerinden kütleçekim dalgalarına on fizik laboratuvarı.',
};

export default function LaboratuvarPage() {
  const section = getSection('ansiklopedi');
  return (
    <div style={{ '--page-accent': section.accent } as CSSProperties}>
      <ChapterHero
        variant="band"
        chapter="03.II"
        section="Ansiklopedi · Laboratuvar"
        headline={['Deneyerek', 'öğren']}
        lede="Kepler yörüngelerinden kütleçekim dalgalarına: evrenin kurallarını kaydırıcılarla dene."
        accent={section.accent}
        image={DOC_IMAGES['lab-zaman']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Ansiklopedi', href: '/ansiklopedi' }, { label: 'Laboratuvar' }]}
        meta={[{ k: 'Deney', v: section.modules.length }]}
      />
      <section className="px-[var(--gutter)] pb-28 pt-20">
        <PartHeading part={1} title="On" serif="laboratuvar" aside={`${section.modules.length} kısım`} />
        <EpisodeGrid section={section} entries={section.modules.map((item) => ({ kind: 'module', item }))} />
      </section>
    </div>
  );
}
