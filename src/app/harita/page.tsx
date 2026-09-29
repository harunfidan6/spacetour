'use client';

import dynamic from 'next/dynamic';
import { useRef, type CSSProperties } from 'react';
import { PageHero, SectionHead, Em } from '@/components/ui/Headings';
import { LiveClock, RotatingBadge, Ticks } from '@/components/motion/primitives';
import { BrightStarsRadar } from '@/components/space/BrightStarsRadar';
import { BortleScaleSimulator } from '@/components/space/BortleScaleSimulator';
import { MessierDeepSkyRadar } from '@/components/space/MessierDeepSkyRadar';
import { HaritaGraphic } from '@/components/home/ModuleGraphics';

const Planetarium3D = dynamic(() => import('@/components/space/Planetarium3D').then((mod) => mod.Planetarium3D), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center bg-black">
      <span className="label text-muted">Gök kubbesi hesaplanıyor…</span>
    </div>
  ),
});

export default function HaritaPage() {
  return (
    <div className="relative" style={{ '--page-accent': 'var(--lime)' } as CSSProperties}>
      <PageHero
        index="01"
        section="Gök Haritası"
        accent="var(--lime)"
        lines={['Gök', <Em key="a">kubbesi</Em>]}
        size="clamp(3.4rem, 13vw, 14rem)"
        lede="Konumuna göre anlık hesaplanan 360° interaktif planetaryum, en parlak kerteriz yıldızları, ışık kirliliği analizi ve Messier derin uzay atlası."
        meta={[
          { k: 'Görünür Yıldız', v: '9,000+' },
          { k: 'Takımyıldızı', v: 88 },
          { k: 'Messier Hedefi', v: 110 },
          { k: 'Optik Mod', v: 'Alt-Az & AR' },
        ]}
        graphic={
          <RotatingBadge text="Gök Kubbesi · Planetaryum · Alt-Azimuth · " size={220} className="text-paper/80">
            <div className="aspect-square w-24 text-lime">
              <HaritaGraphic />
            </div>
          </RotatingBadge>
        }
        ticker={['Polaris', 'Sirius', 'Vega', 'Betelgeuse', 'Arcturus', 'Rigel', 'Capella', 'Antares', 'Andromeda (M31)', 'Orion (M42)']}
      />

      <div className="space-y-24 px-[var(--gutter)] pb-28 pt-16">
        {/* 01.1 - 3D Interactive Planetarium Dome */}
        <section>
          <SectionHead
            index="01.1"
            kicker="Canlı planetaryum simülasyonu"
            title={
              <>
                360° <Em>gözlem kubbesi</Em>
              </>
            }
            lede="Bulunduğun konumun şu anki gökyüzü. Mouse ile sürükle, yakınlaş, yıldızlara dokun veya AR kamera modunu aç."
            aside={
              <span className="inline-flex items-center gap-2 label text-lime">
                <span className="live-dot" /> Yerel Ufuk Aktif
              </span>
            }
          />

          <div className="ticks relative h-[70svh] sm:h-[82svh] w-full border border-line bg-black overflow-hidden">
            <Ticks />
            <Planetarium3D />
          </div>
        </section>

        {/* 01.2 - Brightest 8 Stars Radar */}
        <section>
          <SectionHead
            index="01.2"
            kicker="Gökkubbe kerterizleri"
            title={
              <>
                En parlak <Em>sekiz yıldız</Em>
              </>
            }
            lede="Kuzey yarımkürenin gece göğünde ilk göze çarpan devleri. Kadir, tayf türü, uzaklık ve Alt-Azimuth koordinatları."
          />
          <BrightStarsRadar />
        </section>

        {/* 01.3 - Light Pollution & Bortle Scale Simulator */}
        <section>
          <SectionHead
            index="01.3"
            kicker="Atmosferik görüş analizi"
            title={
              <>
                Bortle skalası <Em>& gökyüzü karanlığı</Em>
              </>
            }
            lede="Kentsel aydınlatmanın gökyüzünü nasıl sildiğini interaktif ölçekle incele: Sınıf 1 (saf karanlık) ile Sınıf 9 (şehir merkezi) arası yıldız kaybı."
          />
          <BortleScaleSimulator />
        </section>

        {/* 01.4 - Messier Deep Sky Radar */}
        <section>
          <SectionHead
            index="01.4"
            kicker="Derin uzay atlası"
            title={
              <>
                Messier <Em>derin uzay hedefleri</Em>
              </>
            }
            lede="Charles Messier’in 110 nesnelik kataloğundan kuzey göğünün en görkemli 6 derin uzay hedefi: galaksiler, gaz bulutsuları ve yıldız kümeleri."
          />
          <MessierDeepSkyRadar />
        </section>
      </div>
    </div>
  );
}
