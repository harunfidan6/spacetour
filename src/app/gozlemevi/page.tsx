'use client';

import { type CSSProperties } from 'react';
import { DEEP_SKY_TARGETS } from '@/data/deepSky';

import dynamic from 'next/dynamic';
import { LabDeck, type LabEntry } from '@/components/ui/LabDeck';
import { SpectrumObservationDesk } from '@/components/space/SpectrumObservationDesk';

function LabLoading() {
  return (
    <div className="grid h-[420px] place-items-center border border-line bg-ink-2">
      <span className="label text-muted">Modül yükleniyor…</span>
    </div>
  );
}

const WebbHubbleCompareSlider = dynamic(() => import('@/components/space/WebbHubbleCompareSlider').then((m) => m.WebbHubbleCompareSlider), { loading: () => <LabLoading /> });
const CosmicRadioSpectrograph = dynamic(() => import('@/components/space/CosmicRadioSpectrograph').then((m) => m.CosmicRadioSpectrograph), { loading: () => <LabLoading /> });
const MegaObservatoriesRegistry = dynamic(() => import('@/components/space/MegaObservatoriesRegistry').then((m) => m.MegaObservatoriesRegistry), { loading: () => <LabLoading /> });
const StellarSpectroscopyLab = dynamic(() => import('@/components/space/StellarSpectroscopyLab').then((m) => m.StellarSpectroscopyLab), { loading: () => <LabLoading /> });
const ExoplanetTransitLab = dynamic(() => import('@/components/space/ExoplanetTransitLab').then((m) => m.ExoplanetTransitLab), { loading: () => <LabLoading /> });
const CosmicAcademyQuiz = dynamic(() => import('@/components/space/CosmicAcademyQuiz').then((m) => m.CosmicAcademyQuiz), { loading: () => <LabLoading /> });

const INSTRUMENTS: LabEntry[] = [
  { id: 'webb-hubble', short: 'Hubble vs Webb', title: 'Hubble vs James Webb', blurb: 'Toz bulutlarının ardındaki proto-yıldızları ve ilk galaksileri kaydırıcıyla karşılaştır.', render: () => <WebbHubbleCompareSlider /> },
  { id: 'radyo', short: 'Radyo spektrografı', title: 'Kozmik radyo & pulsar spektrografı', blurb: 'Pulsar atımlarını ve Satürn’ün auroral ıslıklarını sese çevir.', render: () => <CosmicRadioSpectrograph /> },
  { id: 'gozlemevleri', short: 'Mega gözlemevleri', title: 'Dev teleskoplar atlası', blurb: 'Webb’den ELT’ye, DAG Erzurum’dan ALMA’ya insanlığın en büyük gözleri.', render: () => <MegaObservatoriesRegistry /> },
  { id: 'spektroskopi', short: 'Yıldız spektroskopisi', title: 'Fraunhofer çizgileri & spektral sınıflar', blurb: 'O’dan M’ye tayf tipleri, Balmer serisi ve Doppler kayması.', render: () => <StellarSpectroscopyLab /> },
  { id: 'transit', short: 'Transit fotometrisi', title: 'Ötegezegen transit ışık eğrisi', blurb: 'Bir gezegen yıldızının önünden geçerken ışıktaki düşüşü ölç.', render: () => <ExoplanetTransitLab /> },
  { id: 'akademi', short: 'Astrofizik sınavı', title: 'Astrofizik akademisi', blurb: '10 soruluk sınavla bilgini test et, kişisel sertifikanı oluştur.', render: () => <CosmicAcademyQuiz /> },
];

import { ChapterHero } from '@/components/doc/ChapterHero';
import { PartHeading } from '@/components/doc/PartHeading';
import { DOC_IMAGES } from '@/data/docImages';

export default function GozlemeviPage() {
  const telescopes = new Set(DEEP_SKY_TARGETS.flatMap((t) => Object.values(t.views).map((v) => v.telescope)));

  return (
    <div className="relative" style={{ '--page-accent': 'var(--rose)' } as CSSProperties}>
      <ChapterHero
        chapter="05"
        section="Gözlemevi"
        headline={['Spektrum', 'gözlemevi']}
        lede="Evreni yalnızca gözün gördüğü dar bantta değil; Webb’in kızılötesi, Chandra’nın X-ışını ve dev radyo çanaklarının gözünden izle."
        accent="var(--rose)"
        image={DOC_IMAGES['sec-gozlemevi']}
        meta={[
          { k: 'Hedef', v: DEEP_SKY_TARGETS.length },
          { k: 'Dalgaboyu', v: 4 },
          { k: 'Teleskop', v: telescopes.size },
          { k: 'Aralık', v: '10⁻¹⁰ m' },
        ]}
      />

      <div className="space-y-16 px-[var(--gutter)] pb-28 pt-16">
        <section id="gozlem-masasi" className="scroll-mt-24">
          <PartHeading
            part={1}
            title="Aynı nesne,"
            serif="dört göz"
            aside="4 Dalgaboyu"
            description="Bir hedef seç, ardından spektrum çubuğunda kaydır. Her dalgaboyu nesnenin başka bir fiziksel sürecini açığa çıkarır."
          />
          <SpectrumObservationDesk />
        </section>

        <section id="enstrumanlar" className="scroll-mt-24 pt-16">
          <PartHeading
            part={2}
            title="Altı"
            serif="enstrüman"
            aside="Gözlem Aletleri"
            description="Karşılaştırma kaydırıcısı, radyo spektrografı, dev teleskoplar, yıldız tayfları, ötegezegen avı ve bir sınav. Soldan birini seç."
          />
          <LabDeck labs={INSTRUMENTS} prefix="G" accent="var(--rose)" />
        </section>
      </div>
    </div>
  );
}
