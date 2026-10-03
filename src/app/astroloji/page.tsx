import { SectionHub } from '@/components/doc/SectionHub';
import { ZODIAC_SIGNS, ASTROLOGICAL_HOUSES } from '@/data/zodiac';

export default function AstrolojiPage() {
  return (
    <SectionHub
      sectionId="astroloji"
      meta={[
        { k: 'Burç', v: ZODIAC_SIGNS.length },
        { k: 'Element', v: 4 },
        { k: 'Ev', v: ASTROLOGICAL_HOUSES.length },
        { k: 'Nitelik', v: 3 },
      ]}
    />
  );
}
