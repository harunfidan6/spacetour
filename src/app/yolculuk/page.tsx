import type { CSSProperties } from 'react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { Voyage } from '@/components/home/Voyage';
import { getSection } from '@/data/sections';

export default function YolculukPage() {
  const section = getSection('yolculuk');
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
          { k: 'Durak', v: 7 },
          { k: 'Efemeris', v: 'J2000' },
          { k: 'Motor', v: 'WebGL' },
          { k: 'Mod', v: 'Didaktik & gerçek' },
        ]}
      />
      <Voyage />
    </div>
  );
}
