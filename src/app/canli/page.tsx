import { SectionHub } from '@/components/doc/SectionHub';
import { FaqAccordion } from '@/components/doc/FaqAccordion';
import { FAQS_BY_SECTION } from '@/data/faqs';

export default function CanliPage() {
  return (
    <SectionHub
      sectionId="canli"
      meta={[
        { k: 'Kaynak', v: 'NASA · NOAA' },
        { k: 'ISS güncelleme', v: '5 sn' },
        { k: 'Uzay havası', v: '5 dk' },
        { k: 'Konum', v: 'İstanbul' },
      ]}
      partTitle="Şu an"
      partSerif="gökyüzünde"
      partDescription="Bu gecenin gökyüzü, istasyonun anlık konumu, Güneş’in nabzı ve insanlığın en uzak elçileri."
      outro={
        <FaqAccordion
          items={FAQS_BY_SECTION.canli}
          title="Canlı Gökyüzü & ISS Rehberi"
          serif="sıkça sorulan sorular"
          description="ISS geçiş saatleri, çıplak gözle gözlem ipuçları ve jeomanyetik fırtınalar hakkında merak edilenler."
          accentColor="var(--lime)"
        />
      }
    />
  );
}
