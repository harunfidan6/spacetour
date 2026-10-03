import { SectionHub } from '@/components/doc/SectionHub';

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
      partDescription="Canlı planetaryumla başla; ardından parlak yıldız kerterizleri, ışık kirliliği, Messier hedefleri ve kutup yıldızı rehberi."
    />
  );
}
