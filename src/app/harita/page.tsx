import { SectionHub } from '@/components/doc/SectionHub';
import { FaqAccordion } from '@/components/doc/FaqAccordion';
import { FAQS_BY_SECTION } from '@/data/faqs';

export default function HaritaPage() {
  return (
    <SectionHub
      sectionId="harita"
      meta={[
        { k: 'Görünür yıldız', v: '9.000+' },
        { k: 'Takımyıldızı', v: 88 },
        { k: 'Messier hedefi', v: 110 },
        { k: 'Optik mod', v: 'Alt-Az & AR' },
      ]}
      partTitle="Gözlemcinin"
      partSerif="alet çantası"
      partDescription="3D gök küresiyle başla; ardından parlak yıldız kerterizleri, ışık kirliliği, Messier hedefleri ve kutup yıldızı rehberi."
      outro={
        <FaqAccordion
          items={FAQS_BY_SECTION.harita}
          title="Gök Küresi & Gök Haritası Rehberi"
          serif="sıkça sorulan sorular"
          kicker="Gözlem Geometrisi · SSS"
          description="İnteraktif gökyüzü haritası, Bortle ışık kirliliği ölçeği ve en parlak yıldızlar hakkında rehber."
          accentColor="var(--lime)"
        />
      }
    />
  );
}
