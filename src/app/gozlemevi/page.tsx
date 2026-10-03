import { SectionHub } from '@/components/doc/SectionHub';
import { DEEP_SKY_TARGETS } from '@/data/deepSky';

export default function GozlemeviPage() {
  const telescopes = new Set(DEEP_SKY_TARGETS.flatMap((t) => Object.values(t.views).map((v) => v.telescope)));
  return (
    <SectionHub
      sectionId="gozlemevi"
      meta={[
        { k: 'Hedef', v: DEEP_SKY_TARGETS.length },
        { k: 'Dalgaboyu', v: 4 },
        { k: 'Teleskop', v: telescopes.size },
        { k: 'Aralık', v: '10⁻¹⁰ m' },
      ]}
      partTitle="Yedi"
      partSerif="enstrüman"
      partDescription="Çok dalgaboylu gözlem masası, karşılaştırma kaydırıcısı, radyo spektrografı, dev teleskoplar, yıldız tayfları, ötegezegen avı ve bir sınav."
    />
  );
}
