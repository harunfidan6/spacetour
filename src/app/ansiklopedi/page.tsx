'use client';

import { type CSSProperties } from 'react';
import { planets } from '@/data/planets';
import { constellations } from '@/data/constellations';
import dynamic from 'next/dynamic';
import { LabDeck, type LabEntry } from '@/components/ui/LabDeck';
import { CelestialRegistry } from '@/components/space/CelestialRegistry';
import { Reveal } from '@/components/motion/primitives';
import { ConstellationGlyph } from '@/components/ui/CosmicGlyphs';

import { ChapterHero } from '@/components/doc/ChapterHero';
import { PartHeading } from '@/components/doc/PartHeading';
import { DOC_IMAGES } from '@/data/docImages';

function LabLoading() {
  return (
    <div className="grid h-[420px] place-items-center border border-line bg-ink-2">
      <span className="label text-muted">Modül yükleniyor…</span>
    </div>
  );
}

const SolarSystemOrrery = dynamic(() => import('@/components/space/SolarSystemOrrery').then((m) => m.SolarSystemOrrery), { loading: () => <LabLoading /> });
const PlanetScaleComparator = dynamic(() => import('@/components/space/PlanetScaleComparator').then((m) => m.PlanetScaleComparator), { loading: () => <LabLoading /> });
const GravityCalculator = dynamic(() => import('@/components/space/GravityCalculator').then((m) => m.GravityCalculator), { loading: () => <LabLoading /> });
const CosmicTimeMachine = dynamic(() => import('@/components/space/CosmicTimeMachine').then((m) => m.CosmicTimeMachine), { loading: () => <LabLoading /> });
const ExoplanetExplorer = dynamic(() => import('@/components/space/ExoplanetExplorer').then((m) => m.ExoplanetExplorer), { loading: () => <LabLoading /> });
const AsteroidImpactSimulator = dynamic(() => import('@/components/space/AsteroidImpactSimulator').then((m) => m.AsteroidImpactSimulator), { loading: () => <LabLoading /> });
const BlackHoleSimulator = dynamic(() => import('@/components/space/BlackHoleSimulator').then((m) => m.BlackHoleSimulator), { loading: () => <LabLoading /> });
const HohmannTransferSimulator = dynamic(() => import('@/components/space/HohmannTransferSimulator').then((m) => m.HohmannTransferSimulator), { loading: () => <LabLoading /> });
const GravitationalWaveInterferometer = dynamic(() => import('@/components/space/GravitationalWaveInterferometer').then((m) => m.GravitationalWaveInterferometer), { loading: () => <LabLoading /> });
const PlanckCMBExplorer = dynamic(() => import('@/components/space/PlanckCMBExplorer').then((m) => m.PlanckCMBExplorer), { loading: () => <LabLoading /> });

const LABS: LabEntry[] = [
  { id: 'orrery', short: 'Kepler orrery’si', title: '3D Kepler orrery’si', blurb: 'Gezegenlerin gerçek oranlı yörünge hızlarıyla dönen üç boyutlu Güneş Sistemi çarkı.', render: () => <SolarSystemOrrery /> },
  { id: 'olcek', short: 'Ölçek karşılaştırıcı', title: 'Gezegen ölçek karşılaştırıcı', blurb: 'Gezegenleri yan yana koy, çaplarının gerçek oranını gör.', render: () => <PlanetScaleComparator /> },
  { id: 'kutlecekim', short: 'Kütleçekim', title: 'Kütleçekim hesaplayıcı', blurb: 'Kendi kütlenle her gezegende ne kadar geldiğini ve ne kadar zıplayabileceğini hesapla.', render: () => <GravityCalculator /> },
  { id: 'zaman', short: 'Zaman makinesi', title: 'Kozmik zaman makinesi', blurb: 'Büyük Patlama’dan bugüne evrenin kilometre taşları.', render: () => <CosmicTimeMachine /> },
  { id: 'otegezegen', short: 'Ötegezegenler', title: 'Ötegezegen gezgini', blurb: 'Yaşanabilir kuşaktaki en ilginç ötegezegenleri karşılaştır.', render: () => <ExoplanetExplorer /> },
  { id: 'asteroit', short: 'Asteroit çarpması', title: 'Asteroit çarpışma simülatörü', blurb: 'Çap, hız ve yoğunluğu ayarla; krater ve enerjiyi hesapla.', render: () => <AsteroidImpactSimulator /> },
  { id: 'karadelik', short: 'Kara delik', title: 'Kara delik & zaman genleşmesi', blurb: 'Olay ufkuna yaklaştıkça saatlerin nasıl yavaşladığını gör.', render: () => <BlackHoleSimulator /> },
  { id: 'hohmann', short: 'Hohmann transferi', title: 'Hohmann transfer yörüngesi', blurb: 'İki gezegen arasındaki en verimli rotayı ve fırlatma penceresini hesapla.', render: () => <HohmannTransferSimulator /> },
  { id: 'ligo', short: 'Kütleçekim dalgaları', title: 'LIGO kütleçekim dalgası interferometresi', blurb: 'Çarpışan kara deliklerin uzayzamanda yarattığı dalgalanmayı simüle et.', render: () => <GravitationalWaveInterferometer /> },
  { id: 'cmb', short: 'Kozmik arka plan', title: 'Planck kozmik mikrodalga arka planı', blurb: 'Evrenin ilk ışığındaki sıcaklık dalgalanmaları ve geometrisi.', render: () => <PlanckCMBExplorer /> },
];

export default function AnsiklopediPage() {
  const planetCount = planets.filter((p) => p.type === 'gezegen').length;

  return (
    <div className="relative" style={{ '--page-accent': 'var(--violet)' } as CSSProperties}>
      <ChapterHero
        chapter="03"
        section="Ansiklopedi"
        headline={['Kozmik', 'arşiv']}
        lede="Gök cisimlerinin kimlik kartları, dokunabileceğin 3D hologramlar ve evrenin fiziğini deneyerek öğreten on laboratuvar modülü."
        accent="var(--violet)"
        image={DOC_IMAGES['sec-ansiklopedi']}
        meta={[
          { k: 'Kayıt', v: planets.length },
          { k: 'Gezegen', v: planetCount },
          { k: 'Takımyıldızı', v: constellations.length },
          { k: 'Laboratuvar', v: LABS.length },
        ]}
      />

      <div className="space-y-24 px-[var(--gutter)] pb-28 pt-16">
        {/* Records */}
        <section id="gok-cisimleri" className="scroll-mt-24">
          <PartHeading
            part={1}
            title="Kimlik"
            serif="kartları"
            aside="11 Kayıtlı Cisim"
            description="Bir kayda tıkla: 3D hologram, fiziksel veriler ve bilimsel rapor açılır."
          />
          <CelestialRegistry />
        </section>

        {/* Lab */}
        <section id="laboratuvar" className="scroll-mt-24">
          <PartHeading
            part={2}
            title="Deneyerek"
            serif="öğren"
            aside="10 Fizik Laboratuvarı"
            description="Kepler yörüngelerinden kütleçekim dalgalarına: evrenin kurallarını kaydırıcılarla dene. Soldan bir modül seç."
          />
          <LabDeck labs={LABS} accent="var(--violet)" />
        </section>

        {/* Constellations */}
        <section id="takimyildizlar" className="scroll-mt-24">
          <PartHeading
            part={3}
            title="Gökyüzünün"
            serif="haritası"
            aside="12 Takımyıldız"
            description="Kuzey yarımküreden çıplak gözle görülebilen takımyıldızları, en iyi gözlem ayları ve mitolojik hikâyeleriyle."
          />
          <Reveal items="[data-card]" stagger={0.05} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {constellations.map((c, i) => (
              <article key={c.id} data-card className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-ink-2/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-violet/40 hover:bg-ink-2 hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] p-2 transition-all duration-300 group-hover:border-violet/40 group-hover:bg-violet/10">
                    <ConstellationGlyph id={c.id} size={26} className="text-violet transition-colors" />
                  </div>
                </div>
                <h3 className="display mt-6 text-xl sm:text-2xl font-semibold text-paper group-hover:text-violet transition-colors">{c.name}</h3>
                <p className="serif-i text-base text-violet/90">{c.latinName}</p>
                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-paper/70">{c.description}</p>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{c.mythology}</p>
                <div className="mt-auto flex justify-between border-t border-white/[0.06] pt-4 font-mono text-[11px] text-muted">
                  <span>{c.mainStars} ana yıldız</span>
                  <span className="text-paper/90 font-medium">En iyi: {c.bestMonth}</span>
                </div>
              </article>
            ))}
          </Reveal>
        </section>
      </div>
    </div>
  );
}
