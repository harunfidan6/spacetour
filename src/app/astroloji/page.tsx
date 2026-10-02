'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Droplets, Flame, Globe2, Telescope, Wind, X } from 'lucide-react';
import { ZODIAC_SIGNS, ASTROLOGICAL_HOUSES, type ZodiacSign, type ZodiacElement } from '@/data/zodiac';
import { NatalChartCalculator } from '@/components/space/NatalChartCalculator';
import { DailyCosmicTransitWidget } from '@/components/space/DailyCosmicTransitWidget';
import { CosmicTarotDrawer } from '@/components/space/CosmicTarotDrawer';
import { DailyHoroscopeDeck } from '@/components/space/DailyHoroscopeDeck';
import { StarOracleWidget } from '@/components/space/StarOracleWidget';
import { SynastryChartCalculator } from '@/components/space/SynastryChartCalculator';
import { LunarPhaseTracker } from '@/components/space/LunarPhaseTracker';
import { CosmicRetrogradeRadar } from '@/components/space/CosmicRetrogradeRadar';
import { CosmicNumerologyMatrix } from '@/components/space/CosmicNumerologyMatrix';
import { ZodiacCompatibility } from '@/components/space/ZodiacCompatibility';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { DOC_IMAGES } from '@/data/docImages';
import { PageHero, SectionHead, Em } from '@/components/ui/Headings';
import { Reveal, Ticks } from '@/components/motion/primitives';
import { gsap, useGsap, prefersReducedMotion } from '@/components/motion/gsap';
import { ZodiacGlyph } from '@/components/ui/CosmicGlyphs';

const ELEMENTS = ['Tümü', 'Ateş', 'Toprak', 'Hava', 'Su'] as const;
const ELEMENT_ICON: Record<ZodiacElement, typeof Flame> = { Ateş: Flame, Toprak: Globe2, Hava: Wind, Su: Droplets };

const CHAPTERS = [
  { href: '#dogum-haritasi', label: 'Doğum haritası' },
  { href: '#gunluk-burc-fali', label: 'Günlük burç falı' },
  { href: '#yildiz-fali', label: 'Yıldız falı & saatler' },
  { href: '#kozmik-tarot', label: 'Kozmik tarot (22 arkana)' },
  { href: '#ay-takvimi', label: 'Ay fazları & VoC' },
  { href: '#gezegen-retrolari', label: 'Gezegen retroları' },
  { href: '#kozmik-numeroloji', label: 'Numeroloji matrisi' },
  { href: '#gunluk-transitler', label: 'Canlı transitler' },
  { href: '#zodyak-atlasi', label: '12 zodyak arşivi' },
  { href: '#burc-uyumu', label: 'Burç uyumu' },
  { href: '#sinastri-analizi', label: 'Sinastri analizi' },
];

function Chapter({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="module">
      <div className="mb-5 flex items-center gap-3 border-t border-line pt-4">
        <span className="label text-gold">({index})</span>
        <span className="label text-paper">{title}</span>
      </div>
      <Reveal mode="clip">{children}</Reveal>
    </section>
  );
}

/* Slide-in dossier for a sign */
function SignPanel({ sign, onClose }: { sign: ZodiacSign | null; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<ZodiacSign | null>(sign);
  const closeBtn = useRef<HTMLButtonElement>(null);

  if (sign && sign !== shown) setShown(sign);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    if (sign) {
      const opener = document.activeElement as HTMLElement | null;
      document.documentElement.style.overflow = 'hidden';
      el.style.visibility = 'visible';
      closeBtn.current?.focus({ preventScroll: true });
      if (!reduced) {
        gsap.fromTo(el.querySelector('[data-backdrop]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
        gsap.fromTo(el.querySelector('[data-sheet]'), { xPercent: 100 }, { xPercent: 0, duration: 0.8, ease: 'mg.inOut' });
        gsap.fromTo(el.querySelectorAll('[data-in]'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.05, delay: 0.35 });
      }
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }
        // Keep Tab cycling inside the open sheet
        if (e.key !== 'Tab') return;
        const focusables = [...el.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      };
      window.addEventListener('keydown', onKey);
      return () => {
        window.removeEventListener('keydown', onKey);
        document.documentElement.style.overflow = '';
        // Return focus to the sign card that opened the sheet
        if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
      };
    }
    document.documentElement.style.overflow = '';
    if (reduced) {
      el.style.visibility = 'hidden';
      return;
    }
    gsap.to(el.querySelector('[data-backdrop]'), { autoAlpha: 0, duration: 0.4 });
    gsap.to(el.querySelector('[data-sheet]'), {
      xPercent: 100,
      duration: 0.6,
      ease: 'mg.inOut',
      onComplete: () => {
        el.style.visibility = 'hidden';
      },
    });
  }, [sign, onClose]);

  const s = shown;
  return (
    <div ref={root} className="fixed inset-0 z-[180]" style={{ visibility: 'hidden' }} role="dialog" aria-modal="true" aria-label={s ? `${s.name} burç dosyası` : 'Burç dosyası'}>
      <div data-backdrop className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onClick={onClose} />
      <div data-sheet className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col overflow-y-auto border-l border-line bg-ink-2">
        {s && (
          <>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-ink-2/95 px-6 py-4 backdrop-blur">
              <span className="label text-gold">
                Burç dosyası · {String(ZODIAC_SIGNS.indexOf(s) + 1).padStart(2, '0')} / 12
              </span>
              <button ref={closeBtn} type="button" onClick={onClose} className="flex items-center gap-2 rounded-full border border-line py-1.5 pl-3 pr-1.5 text-paper transition-colors hover:border-gold hover:text-gold">
                <span className="label">Kapat</span>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-paper text-ink">
                  <X size={13} />
                </span>
              </button>
            </div>
            <div className="space-y-8 p-6 sm:p-10">
              <div data-in className="flex items-end justify-between gap-4 border-b border-line pb-6">
                <div>
                  <div className="display text-[clamp(3rem,9vw,6rem)] text-paper">{s.name}</div>
                  <div className="serif-i text-2xl text-gold">{s.latinName}</div>
                  <div className="label mt-2 text-muted">{s.dates}</div>
                </div>
                <ZodiacGlyph sign={s.id} size={88} className="text-gold shrink-0" />
              </div>
              <p data-in className="text-lg leading-relaxed text-paper/80">{s.overview}</p>
              <dl data-in className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
                {[
                  { k: 'Element', v: `${s.element} · ${s.modality}` },
                  { k: 'Yönetici', v: s.rulingPlanet },
                  { k: 'Uğurlu taş', v: s.details.stone },
                  { k: 'Arketip', v: s.traits.archetype },
                ].map((m) => (
                  <div key={m.k} className="bg-ink p-4">
                    <dt className="label text-muted">{m.k}</dt>
                    <dd className="mt-2 text-sm font-semibold text-paper">{m.v}</dd>
                  </div>
                ))}
              </dl>
              <div data-in className="border-l-2 border-gold pl-5">
                <div className="label text-gold">
                  Tarot · {s.tarotCard.name} ({s.tarotCard.number})
                </div>
                <p className="mt-3 text-sm leading-relaxed text-paper/75">{s.tarotCard.symbolism}</p>
                <p className="serif-i mt-3 text-xl text-paper">“{s.tarotCard.guidance}”</p>
              </div>
              <div data-in className="grid gap-6 sm:grid-cols-2">
                <div>
                  <div className="label mb-3 text-muted">Güçlü yönler</div>
                  <div className="flex flex-wrap gap-2">
                    {s.traits.strengths.map((t) => (
                      <span key={t} className="rounded-full border border-lime/40 px-3 py-1 text-xs text-lime">
                        + {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="label mb-3 text-muted">Gölge yönler</div>
                  <div className="flex flex-wrap gap-2">
                    {s.traits.shadows.map((t) => (
                      <span key={t} className="rounded-full border border-rose-signal/40 px-3 py-1 text-xs text-rose-signal">
                        − {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Link data-in href="/harita" className="group flex items-center justify-between border-t border-line pt-6 text-paper hover:text-gold">
                <span className="flex items-center gap-2 text-sm">
                  <Telescope size={16} /> {s.name} takımyıldızını gök haritasında gör
                </span>
                <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

type AstroWorkspace = 'charts' | 'divination' | 'transits' | 'archetypes' | 'all';

interface WorkspaceTab {
  id: AstroWorkspace;
  title: string;
  badge: string;
  count: number;
  description: string;
  submodules: string[];
}

const WORKSPACES: WorkspaceTab[] = [
  {
    id: 'charts',
    title: 'Doğum & Sinastri',
    badge: '01',
    count: 3,
    description: 'Bireysel doğum haritası, eşzamanlı sinastri analizi ve burçlar arası çekim kimyası.',
    submodules: ['Doğum Haritası', 'Sinastri Analizi', 'Burç Uyumu']
  },
  {
    id: 'divination',
    title: 'Tarot & Kehanet',
    badge: '02',
    count: 3,
    description: '22 Majör Arkana kozmik tarot açılımı, 12 burç günlük falı ve Keldani gezegen saatleri.',
    submodules: ['Kozmik Tarot', 'Günlük Burç Falı', 'Yıldız Falı & Saatler']
  },
  {
    id: 'transits',
    title: 'Transitler & Ay',
    badge: '03',
    count: 3,
    description: 'Canlı efemeris transitleri, Ay fazları & Boşluktaki Ay (VoC) ritüelleri ve retro radarı.',
    submodules: ['Canlı Transitler', 'Ay Fazları & VoC', 'Gezegen Retroları']
  },
  {
    id: 'archetypes',
    title: 'Numeroloji & Zodyak',
    badge: '04',
    count: 2,
    description: 'Pisagor 4 sütunlu kozmik numeroloji matrisi ve 12 zodyak takımyıldızının derin arşivi.',
    submodules: ['Numeroloji Matrisi', '12 Arketip Arşivi']
  },
  {
    id: 'all',
    title: 'Tüm Modüller',
    badge: 'ALL',
    count: 11,
    description: 'Astroloji stüdyosundaki tüm modülleri eksiksiz tek bir akışta görüntüle.',
    submodules: ['11 Modül Sıralı']
  }
];

export default function AstrolojiPage() {
  const [workspace, setWorkspace] = useState<AstroWorkspace>('charts');
  const [element, setElement] = useState<(typeof ELEMENTS)[number]>('Tümü');
  const [active, setActive] = useState<ZodiacSign | null>(null);
  const grid = useRef<HTMLDivElement>(null);

  const signs = useMemo(() => ZODIAC_SIGNS.filter((s) => element === 'Tümü' || s.element === element), [element]);
  const closePanel = useCallback(() => setActive(null), []);

  useGsap(
    () => {
      if (prefersReducedMotion() || !grid.current) return;
      gsap.from(grid.current.querySelectorAll('[data-sign]'), { y: 40, autoAlpha: 0, rotate: 2, duration: 0.8, stagger: 0.04, ease: 'mg.out' });
    },
    [element, workspace]
  );

  const currentWorkspace = WORKSPACES.find((w) => w.id === workspace) || WORKSPACES[0];

  return (
    <div className="relative" style={{ '--page-accent': 'var(--gold)' } as CSSProperties}>
      <ChapterHero
        chapter="04"
        section="Astroloji"
        headline={['Zodyak', 'atlası']}
        lede="Kadim gökyüzü gözlemleriyle şekillenen on iki arketip. Doğum haritanı çıkar, günlük transitleri oku, tarot çek, iki haritayı karşılaştır."
        accent="var(--gold)"
        image={DOC_IMAGES['sec-astroloji']}
        meta={[
          { k: 'Burç', v: ZODIAC_SIGNS.length },
          { k: 'Element', v: 4 },
          { k: 'Ev', v: ASTROLOGICAL_HOUSES.length },
          { k: 'Nitelik', v: 3 },
        ]}
      />

      <div className="space-y-16 px-[var(--gutter)] pb-28 pt-8">
        {/* WORKSPACE SELECTOR CONSOLE */}
        <section aria-label="Astroloji Çalışma Alanı" className="sticky top-16 z-30 -mx-[var(--gutter)] px-[var(--gutter)] py-3 bg-ink/90 backdrop-blur-2xl border-y border-line">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {WORKSPACES.map((w) => {
                const isSelected = workspace === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      setWorkspace(w.id);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className={`label whitespace-nowrap px-3.5 py-2 rounded-full border transition-all flex items-center gap-2 cursor-pointer text-xs ${
                      isSelected
                        ? 'border-gold bg-gold text-ink font-bold shadow-[0_0_15px_rgba(255,197,61,0.25)]'
                        : 'border-line bg-ink-2/80 text-paper/70 hover:border-paper/40 hover:text-paper'
                    }`}
                  >
                    <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                      isSelected ? 'bg-ink text-gold' : 'bg-line text-muted'
                    }`}>
                      {w.badge}
                    </span>
                    <span>{w.title}</span>
                    <span className="text-[10px] opacity-70">({w.count})</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs text-muted">
              <span className="text-gold">✦</span>
              <span className="truncate max-w-sm">{currentWorkspace.description}</span>
            </div>
          </div>
        </section>


        {/* 1. CHARTS & SYNASTRY WORKSPACE */}
        {(workspace === 'charts' || workspace === 'all') && (
          <div className="space-y-16">
            <div id="dogum-haritasi">
              <Chapter index="04.1" title="Doğum haritası, gezegenler & açı şebekesi">
                <NatalChartCalculator />
              </Chapter>
            </div>

            <div id="sinastri-analizi">
              <Chapter index="04.2" title="Sinastri & ikili doğum haritası karşılaştırması">
                <SynastryChartCalculator />
              </Chapter>
            </div>

            {/* Compatibility */}
            <section id="burc-uyumu" className="scroll-mt-24">
              <SectionHead
                index="04.3"
                kicker="Kozmik kimya"
                title={
                  <>
                    Burç <Em>uyumu</Em>
                  </>
                }
                lede="İki burç seç: element sinerjisi, nitelik dengesi ve kadim uyum tablolarına göre bir çekim skoru hesaplıyoruz."
              />
              <ZodiacCompatibility />
            </section>
          </div>
        )}

        {/* 2. DIVINATION & TAROT WORKSPACE */}
        {(workspace === 'divination' || workspace === 'all') && (
          <div className="space-y-16">
            <div id="kozmik-tarot">
              <Chapter index={workspace === 'all' ? '04.4' : '04.1'} title="Kozmik tarot açılımı (22 majör arkana & 3 açılım düzeni)">
                <CosmicTarotDrawer />
              </Chapter>
            </div>

            <div id="gunluk-burc-fali">
              <Chapter index={workspace === 'all' ? '04.5' : '04.2'} title="Günlük burç falı & yaşam enerjisi radarı">
                <DailyHoroscopeDeck />
              </Chapter>
            </div>

            <div id="yildiz-fali">
              <Chapter index={workspace === 'all' ? '04.6' : '04.3'} title="Yıldız falı, Keldani gezegen saatleri & kraliyet yıldızları">
                <StarOracleWidget />
              </Chapter>
            </div>
          </div>
        )}

        {/* 3. TRANSITS & LUNAR WORKSPACE */}
        {(workspace === 'transits' || workspace === 'all') && (
          <div className="space-y-16">
            <div id="gunluk-transitler">
              <Chapter index={workspace === 'all' ? '04.7' : '04.1'} title="Canlı efemeris transitleri & gökyüzü nabzı">
                <DailyCosmicTransitWidget />
              </Chapter>
            </div>

            <div id="ay-takvimi">
              <Chapter index={workspace === 'all' ? '04.8' : '04.2'} title="Ay evreleri, boşluktaki ay (VoC) & kozmik niyet ritüelleri">
                <LunarPhaseTracker />
              </Chapter>
            </div>

            <div id="gezegen-retrolari">
              <Chapter index={workspace === 'all' ? '04.9' : '04.3'} title="Gezegen retroları, gölge periyotları & astrolojik koruma radarı">
                <CosmicRetrogradeRadar />
              </Chapter>
            </div>
          </div>
        )}

        {/* 4. NUMEROLOGY & ARCHETYPES WORKSPACE */}
        {(workspace === 'archetypes' || workspace === 'all') && (
          <div className="space-y-16">
            <div id="kozmik-numeroloji">
              <Chapter index={workspace === 'all' ? '04.10' : '04.1'} title="Pisagor kozmik numeroloji matrisi & 4 sütun yaşam yolu">
                <CosmicNumerologyMatrix />
              </Chapter>
            </div>

            {/* Zodiac directory */}
            <section id="zodyak-atlasi">
              <SectionHead
                index={workspace === 'all' ? '04.11' : '04.2'}
                kicker="12 zodyak takımyıldızı"
                title={
                  <>
                    On iki <Em>arketip</Em>
                  </>
                }
                lede="Her burcun elementi, yönetici gezegeni, mitolojik arketipi ve tarot karşılığı. Bir karta dokun, dosyası açılsın."
              />
              <div className="mb-6 flex w-fit gap-1.5 rounded-full border border-white/[0.08] bg-ink-2/60 p-1 backdrop-blur-md" role="group" aria-label="Element filtresi">
                {ELEMENTS.map((el) => (
                  <button
                    key={el}
                    type="button"
                    aria-pressed={element === el}
                    onClick={() => setElement(el)}
                    className={`rounded-full px-4 py-1.5 font-mono text-xs transition-all ${
                      element === el
                        ? 'bg-gold text-ink font-semibold shadow-md'
                        : 'text-paper/70 hover:text-paper hover:bg-white/[0.04]'
                    }`}
                  >
                    {el}
                  </button>
                ))}
              </div>
              <div ref={grid} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {signs.map((s) => {
                  const Icon = ELEMENT_ICON[s.element];
                  return (
                    <button
                      key={s.id}
                      type="button"
                      data-sign
                      onClick={() => setActive(s)}
                      className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-2/60 p-6 text-left backdrop-blur-md transition-all duration-300 hover:border-gold/50 hover:bg-ink-2 hover:shadow-[0_12px_36px_rgba(245,197,66,0.12)] cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-xs text-muted">{String(ZODIAC_SIGNS.indexOf(s) + 1).padStart(2, '0')}</span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-paper/80">
                          <Icon size={11} className="text-gold" /> {s.element}
                        </span>
                      </div>
                      <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 transition-all duration-500 group-hover:border-gold/30 group-hover:bg-gold/[0.06]">
                        <ZodiacGlyph
                          sign={s.id}
                          size={46}
                          className="text-gold transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-0.5"
                        />
                      </div>
                      <span className="display mt-6 text-2xl font-semibold text-paper group-hover:text-gold transition-colors">{s.name}</span>
                      <span className="mt-1 font-mono text-xs text-muted">{s.dates}</span>
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-paper/70">{s.overview}</p>
                      <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4 font-mono text-[11px] text-muted">
                        <span>Yönetici: <strong className="text-paper/90 font-medium">{s.rulingPlanet}</strong></span>
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] text-muted transition-colors group-hover:border-gold/40 group-hover:text-gold">
                          <ArrowUpRight size={13} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </div>

      <SignPanel sign={active} onClose={closePanel} />
    </div>
  );
}
