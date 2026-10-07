import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import type { CSSProperties } from 'react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { PartHeading } from '@/components/doc/PartHeading';
import { EpisodeGrid } from '@/components/doc/SectionHub';
import { DOC_IMAGES } from '@/data/docImages';
import { getSection } from '@/data/sections';

export const metadata: Metadata = buildPageMetadata({
  path: '/ansiklopedi/laboratuvar',
  title: 'Astronomi Laboratuvarı: 10 Fizik Simülasyonu | SpaceTour TR',
  description: 'Kepler yörüngelerinden kütleçekim dalgalarına, kara deliklerden asteroit çarpışmalarına on etkileşimli fizik laboratuvarıyla evreni deneyerek öğren.',
});

export default function LaboratuvarPage() {
  const section = getSection('ansiklopedi');
  return (
    <div style={{ '--page-accent': section.accent } as CSSProperties}>
      <ChapterHero
        variant="band"
        section="Ansiklopedi · Laboratuvar"
        headline={['Deneyerek', 'öğren']}
        lede="Kepler yörüngelerinden kütleçekim dalgalarına: evrenin kurallarını kaydırıcılarla dene."
        accent={section.accent}
        image={DOC_IMAGES['lab-zaman']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Ansiklopedi', href: '/ansiklopedi' }, { label: 'Laboratuvar' }]}
        meta={[{ k: 'Deney', v: section.modules.length }]}
      />
      <section className="px-[var(--gutter)] py-14 sm:py-20">
        <PartHeading title="On" serif="laboratuvar" />
        <EpisodeGrid section={section} entries={section.modules.map((item) => ({ kind: 'module', item }))} />
      </section>
    </div>
  );
}
