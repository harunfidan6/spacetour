'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { DEEP_SKY_TARGETS, type DeepSkyTarget, type WavelengthMode } from '@/data/deepSky';
import { PageHero, SectionHead, Em } from '@/components/ui/Headings';
import { GozlemeviGraphic } from '@/components/home/ModuleGraphics';
import { Scramble, Ticks } from '@/components/motion/primitives';
import { gsap, useGsap, prefersReducedMotion } from '@/components/motion/gsap';
import { WebbHubbleCompareSlider } from '@/components/space/WebbHubbleCompareSlider';
import { CosmicRadioSpectrograph } from '@/components/space/CosmicRadioSpectrograph';
import { MegaObservatoriesRegistry } from '@/components/space/MegaObservatoriesRegistry';
import { StellarSpectroscopyLab } from '@/components/space/StellarSpectroscopyLab';
import { ExoplanetTransitLab } from '@/components/space/ExoplanetTransitLab';
import { CosmicAcademyQuiz } from '@/components/space/CosmicAcademyQuiz';

/* Long → short wavelength, left to right, like a real EM spectrum chart. */
const BANDS: { id: WavelengthMode; label: string; band: string; desc: string; stop: number }[] = [
  { id: 'radio', label: 'Radyo', band: '1 cm – 1 m', desc: 'Soğuk gaz & pulsar atımları', stop: 12.5 },
  { id: 'infrared', label: 'Kızılötesi', band: '1 – 30 µm', desc: 'Tozun ardı & yıldız doğumu', stop: 37.5 },
  { id: 'optical', label: 'Görünür', band: '400 – 700 nm', desc: 'İnsan gözünün penceresi', stop: 62.5 },
  { id: 'xray', label: 'X-ışını', band: '0.1 – 10 nm', desc: 'Aşırı enerji & kara delikler', stop: 87.5 },
];

export default function GozlemeviPage() {
  const [target, setTarget] = useState<DeepSkyTarget>(DEEP_SKY_TARGETS[0]);
  const [mode, setMode] = useState<WavelengthMode>('infrared');
  const [previous, setPrevious] = useState<string | null>(null);
  const viewport = useRef<HTMLDivElement>(null);

  const view = target.views[mode];
  const band = BANDS.find((b) => b.id === mode)!;
  const telescopes = new Set(DEEP_SKY_TARGETS.flatMap((t) => Object.values(t.views).map((v) => v.telescope)));

  const change = (nextTarget: DeepSkyTarget, nextMode: WavelengthMode) => {
    if (nextTarget.id === target.id && nextMode === mode) return;
    setPrevious(view.image);
    setTarget(nextTarget);
    setMode(nextMode);
  };

  // Wipe the new exposure over the previous one
  useGsap(
    () => {
      const el = viewport.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(el.querySelector('[data-exposure]'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'mg.inOut' });
      gsap.fromTo(el.querySelector('[data-wipe-edge]'), { left: '0%', autoAlpha: 1 }, { left: '100%', duration: 1.1, ease: 'mg.inOut', onComplete: () => void gsap.set(el.querySelector('[data-wipe-edge]'), { autoAlpha: 0 }) });
    },
    [target.id, mode]
  );

  return (
    <div className="relative" style={{ '--page-accent': 'var(--rose)' } as CSSProperties}>
      <PageHero
        index="05"
        section="Gözlemevi"
        accent="var(--rose)"
        lines={['Spektrum', <Em key="a">gözlemevi</Em>]}
        size="clamp(3.2rem, 11.5vw, 12rem)"
        lede="Evreni yalnızca gözün gördüğü dar bantta değil; Webb’in kızılötesi, Chandra’nın X-ışını ve dev radyo çanaklarının gözünden izle."
        meta={[
          { k: 'Hedef', v: DEEP_SKY_TARGETS.length },
          { k: 'Dalgaboyu', v: BANDS.length },
          { k: 'Teleskop', v: telescopes.size },
          { k: 'Aralık', v: '10⁻¹⁰ m' },
        ]}
        graphic={
          <div className="aspect-square w-full max-w-[300px] text-rose-signal">
            <GozlemeviGraphic />
          </div>
        }
        ticker={['Hubble', 'James Webb', 'Chandra', 'VLA', 'Spitzer', 'XMM-Newton', 'Effelsberg']}
      />

      <div className="space-y-12 px-[var(--gutter)] pb-28 pt-16">
        <SectionHead
          index="05.1"
          kicker="Gözlem masası"
          title={
            <>
              Aynı nesne, <Em>dört göz</Em>
            </>
          }
          lede="Bir hedef seç, ardından spektrum çubuğunda kaydır. Her dalgaboyu nesnenin başka bir fiziksel sürecini açığa çıkarır."
        />

        {/* Targets */}
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
          {DEEP_SKY_TARGETS.map((t, i) => {
            const on = t.id === target.id;
            return (
              <button key={t.id} type="button" onClick={() => change(t, mode)} aria-pressed={on} className={`group relative overflow-hidden p-5 text-left transition-colors sm:p-7 ${on ? 'bg-rose-signal text-ink' : 'bg-ink text-paper hover:bg-ink-3'}`}>
                <span className={`label ${on ? 'text-ink/70' : 'text-muted'}`}>
                  Hedef {String(i + 1).padStart(2, '0')} · {t.catalog}
                </span>
                <span className="display display-tight mt-3 block pt-[0.12em] text-[clamp(1.8rem,3.6vw,3.2rem)]">{t.name}</span>
                <span className={`serif-i mt-1 block text-lg ${on ? 'text-ink/80' : 'text-rose-signal'}`}>{t.type}</span>
              </button>
            );
          })}
        </div>

        {/* Spectrum selector */}
        <div>
          <div className="relative h-14 overflow-hidden border border-line bg-[linear-gradient(90deg,#3b1d7a_0%,#7a5cff_18%,#ff3d7f_36%,#ff5b22_50%,#ffc53d_58%,#d4ff3d_64%,#8fd3ff_74%,#efece6_100%)]">
            <svg viewBox="0 0 400 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full mix-blend-multiply" aria-hidden>
              <path
                d={Array.from({ length: 200 }, (_, i) => {
                  const x = i * 2;
                  const freq = 0.02 + (x / 400) ** 2 * 0.9;
                  const y = 28 + Math.sin(x * freq * 6) * 16;
                  return `${i === 0 ? 'M' : 'L'}${x} ${y.toFixed(2)}`;
                }).join(' ')}
                fill="none"
                stroke="#09090b"
                strokeWidth="1.5"
              />
            </svg>
            <span className="absolute inset-y-0 w-[3px] bg-ink shadow-[0_0_0_2px_var(--paper)] transition-[left] duration-700 ease-[cubic-bezier(.76,0,.24,1)]" style={{ left: `calc(${band.stop}% - 1.5px)` }} />
          </div>
          <div className="grid grid-cols-2 gap-px border-x border-b border-line bg-line sm:grid-cols-4" role="radiogroup" aria-label="Dalgaboyu">
            {BANDS.map((b) => {
              const on = b.id === mode;
              return (
                <button key={b.id} type="button" role="radio" aria-checked={on} onClick={() => change(target, b.id)} className={`p-4 text-left transition-colors ${on ? 'bg-paper text-ink' : 'bg-ink text-paper hover:bg-ink-3'}`}>
                  <span className={`label ${on ? 'text-ink/60' : 'text-muted'}`}>{b.band}</span>
                  <span className="display display-tight mt-2 block text-2xl">{b.label}</span>
                  <span className={`mt-1 block text-xs ${on ? 'text-ink/70' : 'text-paper/55'}`}>{b.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Observation */}
        <div className="grid gap-px border border-line bg-line lg:grid-cols-12">
          <div ref={viewport} className="ticks relative min-h-[360px] overflow-hidden bg-black sm:min-h-[520px] lg:col-span-7" data-cursor="Gözlem">
            <Ticks />
            {previous && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={previous} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
            )}
            <div data-exposure className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={view.image} alt={`${target.name} — ${band.label} gözlemi`} className="h-full w-full object-cover" />
              <div className="absolute inset-0 mix-blend-color" style={{ background: view.color, opacity: 0.35 }} />
            </div>
            <span data-wipe-edge aria-hidden className="absolute inset-y-0 w-[2px] bg-paper shadow-[0_0_24px_4px_var(--paper)]" style={{ visibility: 'hidden' }} />

            <svg viewBox="-100 -100 200 200" className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2" aria-hidden>
              <g className="spin-slow">
                <circle r="70" fill="none" stroke="var(--paper)" strokeOpacity="0.6" strokeDasharray="2 6" />
              </g>
              <circle r="40" fill="none" stroke="var(--paper)" strokeOpacity="0.4" />
              <path d="M-96 0H-52M52 0H96M0 -96V-52M0 52V96" stroke="var(--paper)" strokeWidth="1.2" />
            </svg>

            <div className="absolute left-4 top-4 flex items-center gap-2 bg-ink/80 px-3 py-1.5 backdrop-blur">
              <span className="h-2 w-2 rounded-full" style={{ background: view.color }} />
              <span className="label text-paper">
                <Scramble key={mode} text={`${band.label} · ${band.band}`} onView={false} />
              </span>
            </div>
            <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-2 bg-ink/80 px-4 py-2.5 backdrop-blur">
              <span className="label text-muted">Gözlem aracı</span>
              <span className="font-mono text-xs text-paper">
                <Scramble text={view.telescope} onView={false} />
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8 bg-ink p-6 sm:p-8 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="label text-rose-signal">{target.catalog}</span>
                <span className="label text-muted">{target.distance}</span>
              </div>
              <h2 className="display display-tight mt-6 pt-[0.12em] text-[clamp(2.2rem,4vw,3.6rem)] text-paper">{target.name}</h2>
              <p className="serif-i mt-1 text-xl text-rose-signal">{target.type}</p>
              <p className="mt-5 text-sm leading-relaxed text-paper/70">{target.description}</p>
            </div>
            <div className="border-l-2 pl-5" style={{ borderColor: view.color }}>
              <div className="label text-paper">Bu dalgaboyunda görülen</div>
              <p className="mt-3 text-base leading-relaxed text-paper/80">{view.highlights}</p>
              <div className="label mt-4 text-muted">Spektrum · {view.wavelength}</div>
            </div>
          </div>
        </div>

        {/* 05.2 - Webb vs Hubble Infrared Comparison Deck */}
        <section className="pt-16">
          <SectionHead
            index="05.2"
            kicker="Kızılötesi derin uzay devrimi"
            title={
              <>
                Hubble <Em>vs</Em> James Webb
              </>
            }
            lede="Toz bulutlarının ardındaki proto-yıldızları ve 13.1 milyar yıl önceki bebek galaksileri interaktif kaydırıcıyla keşfet."
          />
          <WebbHubbleCompareSlider />
        </section>

        {/* 05.3 - Cosmic Radio Spectrograph & Pulsar Audio */}
        <section className="pt-16">
          <SectionHead
            index="05.3"
            kicker="Elektromanyetik ses laboratuvarı"
            title={
              <>
                Kozmik radyo & <Em>pulsar akustik spektrografı</Em>
              </>
            }
            lede="Nötron yıldızlarının periyodik radyo atımlarını, Satürn’ün auroral ıslıklarını ve yıldızlararası plazmayı canlı dinle."
          />
          <CosmicRadioSpectrograph />
        </section>

        {/* 05.4 - Mega Observatories & Optical Aperture Scale */}
        <section className="pt-16">
          <SectionHead
            index="05.4"
            kicker="Dev diyaframlar & aynalar atlası"
            title={
              <>
                Karasal & uzay konuşlu <Em>mega gözlemevleri</Em>
              </>
            }
            lede="Webb'in altın berilyum altıgenlerinden ELT'nin 39 metrelik dev aynasına, DAG Erzurum'dan ALMA radyo interferometresine insanlığın en büyük gözleri."
          />
          <MegaObservatoriesRegistry />
        </section>

        {/* 05.5 - Stellar Spectroscopy & Fraunhofer Lines */}
        <section className="pt-16">
          <SectionHead
            index="05.5"
            kicker="Yıldızların kimyasal parmak izleri"
            title={
              <>
                Fraunhofer soğurma & <Em>spektral sınıflar</Em>
              </>
            }
            lede="O'dan M'ye Harvard tayf tipleri, canlı spektrogram çubuğu, hidrojen Balmer serisi ve Doppler radyal hız kayması simülatörü."
          />
          <StellarSpectroscopyLab />
        </section>

        {/* 05.6 - Exoplanet Transit Photometry & Kepler Light Curves */}
        <section className="pt-16">
          <SectionHead
            index="05.6"
            kicker="Ötegezegen avı & fotometrik eğriler"
            title={
              <>
                Transit ışık eğrisi & <Em>ötegezegen fotometrisi</Em>
              </>
            }
            lede="Kepler ve TESS yöntemleriyle bir gezegen yıldızının önünden geçerken ışık akısındaki düşüşü (ΔF/F) ve yaşanabilir kuşağı hesapla."
          />
          <ExoplanetTransitLab />
        </section>

        {/* 05.7 - Cosmic Academy & Astrophysics Certification */}
        <section className="pt-16">
          <SectionHead
            index="05.7"
            kicker="AstroTR Gözlemevi Değerlendirmesi"
            title={
              <>
                Astrofizik akademisi & <Em>unvan sertifikası</Em>
              </>
            }
            lede="10 soruluk interaktif sınavla evrenin fiziksel yasalarındaki yetkinliğini test et ve onaylı resmi sertifikanı oluştur."
          />
          <CosmicAcademyQuiz />
        </section>
      </div>
    </div>
  );
}
