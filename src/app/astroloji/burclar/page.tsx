import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { PartHeading } from '@/components/doc/PartHeading';
import { ZodiacAtlas } from '@/components/space/ZodiacAtlas';
import { DOC_IMAGES } from '@/data/docImages';

export const metadata: Metadata = {
  title: 'On iki arketip · Astroloji',
  description: 'Her burcun elementi, yönetici gezegeni, mitolojik arketipi ve tarot karşılığı; her burcun kendi dosyası.',
};

export default function BurclarPage() {
  return (
    <div style={{ '--page-accent': 'var(--gold)' } as CSSProperties}>
      <ChapterHero
        variant="band"
        chapter="04"
        section="Astroloji · 12 burç arşivi"
        headline={['On iki', 'arketip']}
        lede="Her burcun elementi, yönetici gezegeni, mitolojik arketipi ve tarot karşılığı. Bir karta dokun, dosyası açılsın."
        accent="var(--gold)"
        image={DOC_IMAGES['astro-burclar']}
        crumbs={[{ label: 'Ana sayfa', href: '/' }, { label: 'Astroloji', href: '/astroloji' }, { label: '12 burç' }]}
      />
      <section className="px-[var(--gutter)] pb-28 pt-20">
        <PartHeading
          part={1}
          title="12 zodyak"
          serif="takımyıldızı"
          description="Sidney Hall’un 1824 tarihli Urania’s Mirror yıldız kartlarıyla, elementlerine göre süzülebilir arşiv."
          aside="Urania’s Mirror · 1824"
        />
        <ZodiacAtlas />
      </section>
    </div>
  );
}
