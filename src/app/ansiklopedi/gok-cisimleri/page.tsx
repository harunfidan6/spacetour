import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import type { CSSProperties } from 'react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { PartHeading } from '@/components/doc/PartHeading';
import { CelestialRegistry } from '@/components/space/CelestialRegistry';
import { DOC_IMAGES } from '@/data/docImages';
import { planets } from '@/data/planets';

export const metadata: Metadata = buildPageMetadata({
  path: '/ansiklopedi/gok-cisimleri',
  title: 'Gök Cisimleri: Güneş’ten Plüton’a | SpaceTour TR',
  description: 'Güneş’ten Plüton’a Güneş Sistemi’nin gök cisimleri: 3D modeller, kütle, çap, sıcaklık gibi fiziksel veriler ve her biri için bilimsel kimlik kartı.',
});

export default function GokCisimleriPage() {
  return (
    <div style={{ '--page-accent': 'var(--violet)' } as CSSProperties}>
      <ChapterHero
        variant="band"
        chapter="03.I"
        section="Ansiklopedi · Kayıt arşivi"
        headline={['Gök', 'cisimleri']}
        lede="Bir kayda tıkla: 3D hologram, fiziksel veriler ve bilimsel rapor açılır."
        accent="var(--violet)"
        image={DOC_IMAGES['ansik-gok-cisimleri']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Ansiklopedi', href: '/ansiklopedi' }, { label: 'Gök cisimleri' }]}
        meta={[{ k: 'Kayıt', v: planets.length }]}
      />
      <section className="px-[var(--gutter)] pb-28 pt-20">
        <PartHeading part={1} title="Kimlik" serif="kartları" description="Ara, türe göre süz, bir gök cismine dokun." aside={`${planets.length} kayıt`} />
        <CelestialRegistry />
      </section>
    </div>
  );
}
