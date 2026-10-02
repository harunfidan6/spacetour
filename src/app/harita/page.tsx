'use client';

import dynamic from 'next/dynamic';
import { type CSSProperties } from 'react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { PartHeading } from '@/components/doc/PartHeading';
import { DOC_IMAGES } from '@/data/docImages';
import { LabDeck, type LabEntry } from '@/components/ui/LabDeck';

const Planetarium3D = dynamic(() => import('@/components/space/Planetarium3D').then((mod) => mod.Planetarium3D), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center bg-black">
      <span className="label text-muted">Gök kubbesi hesaplanıyor…</span>
    </div>
  ),
});

function ToolLoading() {
  return (
    <div className="grid h-[420px] place-items-center border border-line bg-ink-2">
      <span className="label text-muted">Araç yükleniyor…</span>
    </div>
  );
}

const BrightStarsRadar = dynamic(() => import('@/components/space/BrightStarsRadar').then((m) => m.BrightStarsRadar), { loading: () => <ToolLoading /> });
const BortleScaleSimulator = dynamic(() => import('@/components/space/BortleScaleSimulator').then((m) => m.BortleScaleSimulator), { loading: () => <ToolLoading /> });
const MessierDeepSkyRadar = dynamic(() => import('@/components/space/MessierDeepSkyRadar').then((m) => m.MessierDeepSkyRadar), { loading: () => <ToolLoading /> });
const PolarisPrecessionHop = dynamic(() => import('@/components/space/PolarisPrecessionHop').then((m) => m.PolarisPrecessionHop), { loading: () => <ToolLoading /> });

const TOOLS: LabEntry[] = [
  { id: 'parlak-yildizlar', short: 'En parlak 8 yıldız', title: 'Gökkubbe kerterizleri', blurb: 'Kadir, tayf türü, uzaklık ve anlık Alt-Az koordinatlarıyla gece göğünün devleri.', render: () => <BrightStarsRadar /> },
  { id: 'bortle', short: 'Bortle skalası', title: 'Işık kirliliği & gökyüzü karanlığı', blurb: 'Sınıf 1 (saf karanlık) ile Sınıf 9 (şehir merkezi) arasında kaybolan yıldızları gör.', render: () => <BortleScaleSimulator /> },
  { id: 'messier', short: 'Messier hedefleri', title: 'Messier derin uzay hedefleri', blurb: 'Kuzey göğünün en görkemli galaksileri, bulutsuları ve yıldız kümeleri.', render: () => <MessierDeepSkyRadar /> },
  { id: 'polaris', short: 'Kutup yıldızı & presesyon', title: 'Kutup yıldızı & presesyon çemberi', blurb: 'Büyük Ayı’dan Polaris’e yıldız atlama ve 25.772 yıllık presesyon döngüsü.', render: () => <PolarisPrecessionHop /> },
];

export default function HaritaPage() {
  return (
    <div className="relative" style={{ '--page-accent': 'var(--lime)' } as CSSProperties}>
      <ChapterHero
        chapter="01"
        section="Gök Haritası"
        headline={['GÖK', 'kubbesi']}
        lede="Konumuna göre anlık hesaplanan 360° interaktif planetaryum, en parlak kerteriz yıldızları, ışık kirliliği analizi ve Messier derin uzay atlası."
        accent="var(--lime)"
        image={DOC_IMAGES['sec-harita']}
        meta={[
          { k: 'Görünür Yıldız', v: '9,000+' },
          { k: 'Takımyıldızı', v: 88 },
          { k: 'Messier Hedefi', v: 110 },
          { k: 'Optik Mod', v: 'Alt-Az & AR' },
        ]}
      />

      <div className="space-y-20 px-[var(--gutter)] pb-28 pt-12">
        {/* 01.1 - 3D Interactive Planetarium Dome */}
        <section id="planetaryum" className="scroll-mt-24">
          <PartHeading
            part={1}
            title="360° Gözlem"
            serif="kubbesi"
            description="Bulunduğun konumun şu anki gökyüzü. Mouse ile sürükle, yakınlaş, yıldızlara dokun veya AR kamera modunu aç."
            aside={
              <span className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-1 font-mono text-xs text-lime">
                <span className="live-dot" /> Yerel Ufuk Aktif
              </span>
            }
          />

          <div className="relative h-[72svh] sm:h-[84svh] w-full rounded-2xl border border-white/[0.12] bg-[#020206] shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden">
            <Planetarium3D />
          </div>
        </section>

        {/* 01.2 - Observer Toolkit */}
        <section id="araclar" className="scroll-mt-24">
          <PartHeading
            part={2}
            title="Gözlemcinin"
            serif="alet çantası"
            description="Parlak yıldız kerterizleri, ışık kirliliği, Messier hedefleri ve kutup yıldızı rehberi. Soldan birini seç."
          />
          <LabDeck labs={TOOLS} prefix="A" accent="var(--lime)" />
        </section>
      </div>
    </div>
  );
}
