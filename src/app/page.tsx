import type { CSSProperties } from 'react';
import { planets } from '@/data/planets';
import { events } from '@/data/events';
import { constellations } from '@/data/constellations';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import { HomeHero } from '@/components/home/HomeHero';
import { Manifesto, CrossTapes } from '@/components/home/Manifesto';
import { Voyage } from '@/components/home/Voyage';
import { ModulesRail } from '@/components/home/ModulesRail';
import { SectionHead, Em } from '@/components/ui/Headings';
import { Reveal } from '@/components/motion/primitives';
import { SkyTonightWidget } from '@/components/space/SkyTonightWidget';
import { IssTracker } from '@/components/space/IssTracker';
import { SpaceWeatherWidget } from '@/components/space/SpaceWeatherWidget';
import { InterstellarProbes } from '@/components/space/InterstellarProbes';
import { NasaApodSection } from '@/components/space/NasaApodSection';

export default function Home() {
  const stats = [
    { value: planets.length, label: 'Gök cismi kaydı' },
    { value: events.length, label: 'Takvimli gök olayı' },
    { value: constellations.length, label: 'Takımyıldızı rehberi' },
    { value: ZODIAC_SIGNS.length, label: 'Zodyak arketipi' },
  ];

  return (
    <>
      <HomeHero />
      <Manifesto stats={stats} />
      <CrossTapes />
      <Voyage />
      <ModulesRail />

      <section className="relative bg-ink px-[var(--gutter)] pb-28 pt-24 sm:pt-32" style={{ '--page-accent': 'var(--lime)' } as CSSProperties}>
        <SectionHead
          index="04"
          kicker="Bu gece"
          aside={
            <span className="inline-flex items-center gap-2">
              <span className="live-dot" /> Canlı veri
            </span>
          }
          title={
            <>
              Gökyüzü <Em>canlı</Em>
            </>
          }
          lede="Görünür gezegenler, Uluslararası Uzay İstasyonu'nun anlık konumu, Güneş rüzgarı ve yıldızlararası sondalar — hepsi tek ekranda."
        />

        <div className="module space-y-4">
          <Reveal mode="clip">
            <SkyTonightWidget />
          </Reveal>
          <Reveal className="grid gap-4 lg:grid-cols-2" items=":scope > *" stagger={0.12}>
            <IssTracker />
            <SpaceWeatherWidget />
          </Reveal>
          <Reveal mode="clip">
            <InterstellarProbes />
          </Reveal>
          <Reveal mode="clip">
            <NasaApodSection />
          </Reveal>
        </div>
      </section>
    </>
  );
}
