import type { CSSProperties } from 'react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { YolculukExperience } from '@/components/space/YolculukExperience';
import { getSection } from '@/data/sections';

export default function YolculukPage() {
  const section = getSection('yolculuk');
  return (
    <div style={{ '--page-accent': section.accent } as CSSProperties}>
      <ChapterHero
        section={section.title}
        headline={section.headline}
        lede={section.lede}
        accent={section.accent}
        image={section.image}
        meta={[
          { k: 'Güneş Sistemi', v: '7 Durak' },
          { k: 'Dikey İrtifa', v: '0 – 35.786 km' },
          { k: 'Motor', v: 'WebGL' },
          { k: 'Efemeris', v: 'J2000' },
        ]}
      />
      <YolculukExperience />
    </div>
  );
}
