import { SectionHub } from '@/components/doc/SectionHub';

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
    />
  );
}
