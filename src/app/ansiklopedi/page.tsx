'use client';

import { useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { matchesQuery } from '@/lib/text';
import { ArrowUpRight, Search } from 'lucide-react';
import { planets } from '@/data/planets';
import { constellations } from '@/data/constellations';
import dynamic from 'next/dynamic';
import { LabDeck, type LabEntry } from '@/components/ui/LabDeck';
import { PlanetOrb, OrbCanvas } from '@/components/space/PlanetOrb';
import { PageHero, SectionHead, Em } from '@/components/ui/Headings';
import { Reveal, RotatingBadge } from '@/components/motion/primitives';
import { ConstellationGlyph } from '@/components/ui/CosmicGlyphs';


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
  const list = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      planets.filter((p) => {
        const matchesSearch = matchesQuery(searchTerm, p.name, p.description);
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

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Gök cismi veya gezegen ara…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-ink-2/80 py-2.5 pl-10 pr-4 text-sm text-paper placeholder:text-muted/60 transition-all focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet/30"
              />
            </div>
            <div className="flex max-w-full gap-1.5 self-start overflow-x-auto no-scrollbar rounded-full border border-white/[0.08] bg-ink-2/60 p-1 backdrop-blur-md" role="group" aria-label="Kayıt türü">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  aria-pressed={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-all ${
                    activeTab === tab
                      ? 'bg-violet text-ink font-semibold shadow-md'
                      : 'text-paper/70 hover:text-paper hover:bg-white/[0.04]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div ref={list} className="space-y-2">
              <div className="hidden grid-cols-[3rem_1fr_10rem_10rem_6rem_3rem] items-center gap-4 px-5 py-2 font-mono text-xs uppercase tracking-wider text-muted md:grid">
                <span>No</span>
                <span>Gök Cismi</span>
                <span>Tür</span>
                <span>Çap</span>
                <span>Uydu</span>
                <span className="text-right">Detay</span>
              </div>
              {filtered.map((p) => {
                const index = planets.indexOf(p) + 1;
                return (
                  <div key={p.id} data-row>
                    <Link
                      href={`/ansiklopedi/${p.id}`}
                      className="group flex flex-col md:grid md:grid-cols-[3rem_1fr_10rem_10rem_6rem_3rem] items-start md:items-center gap-4 rounded-xl border border-white/[0.06] bg-ink-2/50 px-5 py-4 backdrop-blur-md transition-all duration-300 hover:border-violet/40 hover:bg-ink-2/90 hover:shadow-[0_10px_30px_rgba(129,140,248,0.1)]"
                    >
                      <span className="font-mono text-xs text-muted group-hover:text-paper transition-colors">
                        {String(index).padStart(2, '0')}
                      </span>
                      <div className="flex items-center gap-4">
                        <PlanetOrb id={p.id} className="h-10 w-10 shrink-0 transition-transform duration-500 group-hover:scale-115 sm:h-12 sm:w-12" spin={1.5} />
                        <div>
                          <div className="display text-xl sm:text-2xl font-semibold text-paper group-hover:text-violet transition-colors">
                            {p.name}
                          </div>
                          <div className="text-xs text-muted md:hidden mt-0.5">
                            {TYPE_LABEL[p.type] ?? p.type} · Çap: {p.facts.çap}
                          </div>
                        </div>
                      </div>
                      <span className="hidden font-mono text-xs text-paper/70 md:block">{TYPE_LABEL[p.type] ?? p.type}</span>
                      <span className="hidden font-mono text-xs text-paper/70 md:block">{p.facts.çap}</span>
                      <span className="hidden font-mono text-xs text-paper/70 md:block">{p.facts.uyduSayısı}</span>
                      <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03] text-paper/60 transition-all duration-300 group-hover:border-violet/40 group-hover:bg-violet group-hover:text-ink md:flex ml-auto">
                        <ArrowUpRight size={15} />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-ink-2/30 py-16 text-center">
              <p className="display text-2xl text-paper">Kayıt bulunamadı</p>
              <p className="mt-2 text-sm text-muted">“{searchTerm}” ile eşleşen gök cismi bulunamadı.</p>
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
