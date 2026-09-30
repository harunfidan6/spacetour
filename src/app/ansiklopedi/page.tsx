'use client';

import { useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import { planets } from '@/data/planets';
import { constellations } from '@/data/constellations';
import dynamic from 'next/dynamic';
import { LabDeck, type LabEntry } from '@/components/ui/LabDeck';
import { PlanetOrb, OrbCanvas } from '@/components/space/PlanetOrb';
import { PageHero, SectionHead, Em } from '@/components/ui/Headings';
import { Reveal, RotatingBadge } from '@/components/motion/primitives';


import { gsap, useGsap, prefersReducedMotion } from '@/components/motion/gsap';

const TABS = ['Tümü', 'Gezegenler', 'Yıldızlar', 'Diğer'] as const;
type Tab = (typeof TABS)[number];

const TYPE_LABEL: Record<string, string> = {
  gezegen: 'Gezegen',
  yıldız: 'Yıldız',
  ay: 'Uydu',
  'cüce-gezegen': 'Cüce gezegen',
};

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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('Tümü');
  const list = useRef<HTMLOListElement>(null);

  const filtered = useMemo(
    () =>
      planets.filter((p) => {
        const matchesSearch = p.name.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR'));
        const matchesTab =
          activeTab === 'Tümü' ||
          (activeTab === 'Gezegenler' && p.type === 'gezegen') ||
          (activeTab === 'Yıldızlar' && p.type === 'yıldız') ||
          (activeTab === 'Diğer' && (p.type === 'ay' || p.type === 'cüce-gezegen'));
        return matchesSearch && matchesTab;
      }),
    [searchTerm, activeTab]
  );

  useGsap(
    () => {
      if (prefersReducedMotion() || !list.current) return;
      gsap.from(list.current.querySelectorAll('[data-row]'), { yPercent: 60, autoAlpha: 0, duration: 0.7, stagger: 0.04, ease: 'mg.out' });
    },
    [activeTab]
  );

  const planetCount = planets.filter((p) => p.type === 'gezegen').length;

  return (
    <div className="relative" style={{ '--page-accent': 'var(--violet)' } as CSSProperties}>
      <PageHero
        index="03"
        section="Ansiklopedi"
        accent="var(--violet)"
        lines={['Kozmik', <Em key="a">arşiv</Em>]}
        size="clamp(3.4rem, 13vw, 14rem)"
        lede="Gök cisimlerinin kimlik kartları, dokunabileceğin 3D hologramlar ve evrenin fiziğini deneyerek öğreten on laboratuvar modülü."
        meta={[
          { k: 'Kayıt', v: planets.length },
          { k: 'Gezegen', v: planetCount },
          { k: 'Takımyıldızı', v: constellations.length },
          { k: 'Laboratuvar', v: LABS.length },
        ]}
        graphic={
          <RotatingBadge text="Kayıt · Arşiv · Laboratuvar · Orrery · " size={220} className="text-paper/80">
            <svg viewBox="-50 -50 100 100" className="h-24 w-24" aria-hidden>
              <circle r="22" fill="var(--violet)" />
              <ellipse rx="42" ry="10" fill="none" stroke="var(--paper)" strokeWidth="2" transform="rotate(-18)" />
            </svg>
          </RotatingBadge>
        }
        ticker={planets.map((p) => p.name)}
      />

      <OrbCanvas />
      <div className="space-y-24 px-[var(--gutter)] pb-28 pt-16">
        {/* Records */}
        <section>
          <SectionHead
            index="03.1"
            kicker="Kayıtlı gök cisimleri"
            title={
              <>
                Kimlik <Em>kartları</Em>
              </>
            }
            lede="Bir kayda tıkla: 3D hologram, fiziksel veriler ve bilimsel rapor açılır."
          />

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <label className="group relative block w-full max-w-xl">
              <span className="sr-only">Kozmik arşivde ara</span>
              <Search className="pointer-events-none absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 text-muted transition-colors group-focus-within:text-violet" />
              <input
                type="text"
                placeholder="Arşivde ara…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-b-2 border-line bg-transparent py-3 pl-10 font-display text-3xl font-bold uppercase text-paper placeholder:text-muted/60 focus:border-violet focus:outline-none sm:text-4xl"
                style={{ fontStretch: '112%' }}
              />
            </label>
            <div className="flex gap-1 rounded-full border border-line p-1" role="tablist" aria-label="Kayıt türü">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`label rounded-full px-4 py-2 transition-colors ${activeTab === tab ? 'bg-violet text-ink' : 'text-paper/70 hover:text-paper'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filtered.length > 0 ? (
            <ol ref={list} className="border-t border-line">
              <li className="label hidden grid-cols-[4rem_1fr_10rem_10rem_6rem_3rem] items-center gap-4 border-b border-line py-3 text-muted md:grid">
                <span>No</span>
                <span>Ad</span>
                <span>Tür</span>
                <span>Çap</span>
                <span>Uydu</span>
                <span />
              </li>
              {filtered.map((p) => {
                const index = planets.indexOf(p) + 1;
                return (
                  <li key={p.id} data-row className="overflow-hidden border-b border-line">
                    <Link href={`/ansiklopedi/${p.id}`} className="group relative grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-4 md:grid-cols-[4rem_1fr_10rem_10rem_6rem_3rem] md:py-5">
                      <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-violet transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100" />
                      <span className="label relative text-muted transition-colors group-hover:text-ink">{String(index).padStart(2, '0')}</span>
                      <span className="relative flex items-center gap-4">
                        <PlanetOrb id={p.id} className="h-12 w-12 transition-transform duration-500 group-hover:scale-125 sm:h-16 sm:w-16" spin={1.5} />
                        <span className="display display-tight pt-[0.12em] text-[clamp(1.8rem,4vw,3.6rem)] text-paper transition-[color,letter-spacing] duration-500 group-hover:tracking-[0.01em] group-hover:text-ink">
                          {p.name}
                        </span>
                      </span>
                      <span className="label relative hidden text-paper/70 group-hover:text-ink md:block">{TYPE_LABEL[p.type] ?? p.type}</span>
                      <span className="relative hidden font-mono text-sm text-paper/70 group-hover:text-ink md:block">{p.facts.çap}</span>
                      <span className="relative hidden font-mono text-sm text-paper/70 group-hover:text-ink md:block">{p.facts.uyduSayısı}</span>
                      <span className="relative grid h-10 w-10 place-items-center justify-self-end rounded-full border border-line text-paper transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink">
                        <ArrowUpRight size={16} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="border border-dashed border-line py-16 text-center">
              <p className="display display-tight text-3xl text-paper">Kayıt yok</p>
              <p className="mt-2 text-sm text-muted">“{searchTerm}” için eşleşen gök cismi bulunamadı.</p>
            </div>
          )}
        </section>

        {/* Lab */}
        <section id="laboratuvar">
          <SectionHead
            index="03.2"
            kicker="Laboratuvar"
            title={
              <>
                Deneyerek <Em>öğren</Em>
              </>
            }
            lede="Kepler yörüngelerinden kütleçekim dalgalarına: evrenin kurallarını kaydırıcılarla dene. Soldan bir modül seç."
          />
          <LabDeck labs={LABS} accent="var(--violet)" />
        </section>

        {/* Constellations */}
        <section>
          <SectionHead
            index="03.3"
            kicker="Gözlemlenebilir takımyıldızları"
            title={
              <>
                Gökyüzünün <Em>haritası</Em>
              </>
            }
            lede="Kuzey yarımküreden çıplak gözle görülebilen takımyıldızları, en iyi gözlem ayları ve mitolojik hikâyeleriyle."
          />
          <Reveal items="[data-card]" stagger={0.06} className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {constellations.map((c, i) => (
              <article key={c.id} data-card className="group relative flex flex-col bg-ink p-6 transition-colors duration-500 hover:bg-ink-3">
                <div className="flex items-start justify-between">
                  <span className="label text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-5xl transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-rotate-12 group-hover:scale-110">{c.emoji}</span>
                </div>
                <h3 className="display display-tight mt-8 pt-[0.12em] text-3xl text-paper">{c.name}</h3>
                <p className="serif-i text-xl text-violet">{c.latinName}</p>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-paper/60">{c.description}</p>
                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted">{c.mythology}</p>
                <div className="label mt-auto flex justify-between border-t border-line pt-4 text-[10px] text-muted">
                  <span>{c.mainStars} ana yıldız</span>
                  <span className="text-paper">En iyi: {c.bestMonth}</span>
                </div>
              </article>
            ))}
          </Reveal>
        </section>
      </div>
    </div>
  );
}
