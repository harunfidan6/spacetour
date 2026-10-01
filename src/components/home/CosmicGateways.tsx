'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, Orbit, Calendar, BookOpen, Telescope } from 'lucide-react';
import {
  HaritaGraphic,
  TakvimGraphic,
  AnsiklopediGraphic,
  AstrolojiGraphic,
  GozlemeviGraphic,
} from './ModuleGraphics';
import { CinematicCard } from '@/components/motion/CinematicCard';

interface Gateway {
  id: string;
  href: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  icon: React.ComponentType<{ className?: string; size?: number }>;
  accent: string;
  graphic: React.ReactNode;
}

const GATEWAYS: Gateway[] = [
  {
    id: 'harita',
    href: '/harita',
    index: '01',
    title: 'Gök Haritası',
    subtitle: '360° Planetaryum & AR Gözlem Kubbesi',
    description:
      'Bulunduğunuz konumun gökyüzünü anlık hesaplayın. 88 takımyıldız, 7 yıldızlı Küçük Ayı lazer çizimi, Büyük Ayı’dan Polaris’e yıldız atlama kılavuzu ve Messier derin uzay atlası.',
    tags: ['360° Planetaryum', 'Küçük Ayı Çizimi', 'Star-Hopping', 'AR Kamera'],
    icon: Telescope,
    accent: '#f5c542', // gold
    graphic: <HaritaGraphic />,
  },
  {
    id: 'takvim',
    href: '/takvim',
    index: '02',
    title: 'Olay Takvimi',
    subtitle: 'Astronomik Efemeris & Gök Olayları',
    description:
      'Güneş ve Ay tutulmaları, Perseid & Geminid meteor yağmurları, gezegen kavuşumları ve süper aylar. Anlık geri sayım sayacı ve Türkiye gözlem pencereleri.',
    tags: ['Canlı Geri Sayım', 'Tutulmalar', 'Meteor Yağmurları', 'Kavuşumlar'],
    icon: Calendar,
    accent: '#f59e0b', // solar amber
    graphic: <TakvimGraphic />,
  },
  {
    id: 'ansiklopedi',
    href: '/ansiklopedi',
    index: '03',
    title: 'Kozmik Ansiklopedi',
    subtitle: '3D Gezegen Atlası & 10 Fizik Laboratuvarı',
    description:
      'Güneş Sistemi’ndeki tüm gezegenlerin bilimsel kimlik kartları, 3D Keplerian orrery çarkı, ölçek karşılaştırıcı, asteroit çarpışma simülatörü ve kütleçekim laboratuvarı.',
    tags: ['Kepler Orrery', 'Gezegen Atlası', '10 Fizik Labı', 'Asteroit Çarpması'],
    icon: BookOpen,
    accent: '#818cf8', // violet
    graphic: <AnsiklopediGraphic />,
  },
  {
    id: 'astroloji',
    href: '/astroloji',
    index: '04',
    title: 'Astroloji Stüdyosu',
    subtitle: 'Doğum Haritası, Sinastri & Kozmik Tarot',
    description:
      'Placidus ev sistemli interaktif doğum haritası, iki kişi arası kozmik uyum kimyası (sinastri), 22 Majör Arkana kozmik tarot açılımı ve canlı gezegen transitleri.',
    tags: ['Natal Doğum Haritası', '22 Majör Tarot', 'Sinastri Uyumu', 'Canlı Transitler'],
    icon: Orbit,
    accent: '#f5c542', // gold
    graphic: <AstrolojiGraphic />,
  },
  {
    id: 'gozlemevi',
    href: '/gozlemevi',
    index: '05',
    title: 'Derin Uzay Gözlemevi',
    subtitle: 'Çok Dalgaboylu Spektrum Atlası',
    description:
      'Evreni görünür ışığın ötesinde inceleyin: James Webb kızılötesi ile Hubble optik karşılaştırma kaydırıcısı, pulsar radyo spektrografı ve dünyanın en büyük teleskopları.',
    tags: ['Webb vs Hubble', 'Radyo Spektrografı', 'X-Işını & Kızılötesi', 'Mega Teleskoplar'],
    icon: Sparkles,
    accent: '#f43f5e', // rose
    graphic: <GozlemeviGraphic />,
  },
];

export function CosmicGateways() {
  return (
    <section className="relative px-[var(--gutter)] py-20 bg-ink">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8 mb-12">
        <div>
          <div className="label text-gold flex items-center gap-2 mb-2 font-mono">
            <span>✦</span>
            <span>BEŞ KOZMİK İSTASYON</span>
          </div>
          <h2 className="display display-tight text-3xl sm:text-5xl text-paper">
            Evreni Keşfetmenin Beş Yolu
          </h2>
        </div>
        <p className="max-w-md text-sm text-paper/70 font-sans leading-relaxed">
          Gökkubbeden derin uzay spektroskopisine, doğum haritasından 3D gezegen simülatörüne her biri bağımsız birer rasathane enstrümanı.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Gök Haritası (Featured Large 2-column card) */}
        <div className="md:col-span-2">
          <CinematicCard accent={GATEWAYS[0].accent} className="h-full">
            <Link
              href={GATEWAYS[0].href}
              className="flex h-full min-h-[380px] flex-col justify-between p-7 sm:p-8"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/40 bg-gold/10 text-gold shadow-[0_0_15px_rgba(245,197,66,0.2)]">
                    <Telescope size={20} />
                  </span>
                  <div>
                    <span className="font-mono text-gold text-xs font-semibold">{GATEWAYS[0].index} / 05</span>
                    <span className="font-mono text-muted block text-[10px] uppercase">Gözlem İstasyonu</span>
                  </div>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-paper transition-all duration-300 group-hover:bg-gold group-hover:text-ink group-hover:rotate-45">
                  <ArrowUpRight size={18} />
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-6">
                <div className="lg:col-span-7">
                  <h3 className="display text-3xl sm:text-4xl font-semibold text-paper group-hover:text-gold transition-colors">
                    {GATEWAYS[0].title}
                  </h3>
                  <p className="font-mono text-gold/90 text-xs mt-1 mb-4">
                    {GATEWAYS[0].subtitle}
                  </p>
                  <p className="text-sm text-paper/75 leading-relaxed font-sans max-w-lg">
                    {GATEWAYS[0].description}
                  </p>
                </div>
                <div className="lg:col-span-5 flex items-center justify-center">
                  <div className="h-48 w-48 text-gold/80 transition-transform duration-700 ease-out group-hover:scale-110">
                    {GATEWAYS[0].graphic}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.06]">
                {GATEWAYS[0].tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[10px] text-paper/80 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </CinematicCard>
        </div>

        {/* Card 2: Olay Takvimi */}
        <div>
          <CinematicCard accent={GATEWAYS[1].accent} className="h-full">
            <Link
              href={GATEWAYS[1].href}
              className="flex h-full min-h-[380px] flex-col justify-between p-7"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-solar/40 bg-solar/10 text-solar shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <Calendar size={18} />
                  </span>
                  <div>
                    <span className="font-mono text-solar text-xs font-semibold">{GATEWAYS[1].index} / 05</span>
                    <span className="font-mono text-muted block text-[10px] uppercase">Efemeris</span>
                  </div>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-paper transition-all duration-300 group-hover:bg-solar group-hover:text-ink group-hover:rotate-45">
                  <ArrowUpRight size={18} />
                </span>
              </div>

              <div className="my-4">
                <h3 className="display text-2xl font-semibold text-paper group-hover:text-solar transition-colors">
                  {GATEWAYS[1].title}
                </h3>
                <p className="font-mono text-solar/90 text-xs mt-1 mb-3">
                  {GATEWAYS[1].subtitle}
                </p>
                <p className="text-xs text-paper/70 leading-relaxed font-sans line-clamp-3">
                  {GATEWAYS[1].description}
                </p>
                <div className="h-32 w-full flex items-center justify-center text-solar/80 my-3">
                  <div className="h-28 w-28 transition-transform duration-700 ease-out group-hover:scale-110">
                    {GATEWAYS[1].graphic}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                {GATEWAYS[1].tags.slice(0, 3).map((t) => (
                  <span key={t} className="px-2.5 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[9px] text-paper/80 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </CinematicCard>
        </div>

        {/* Card 3: Kozmik Ansiklopedi & Laboratuvar */}
        <div>
          <CinematicCard accent={GATEWAYS[2].accent} className="h-full">
            <Link
              href={GATEWAYS[2].href}
              className="flex h-full min-h-[380px] flex-col justify-between p-7"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet/40 bg-violet/10 text-violet shadow-[0_0_15px_rgba(129,140,248,0.2)]">
                    <BookOpen size={18} />
                  </span>
                  <div>
                    <span className="font-mono text-violet text-xs font-semibold">{GATEWAYS[2].index} / 05</span>
                    <span className="font-mono text-muted block text-[10px] uppercase">Laboratuvar</span>
                  </div>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-paper transition-all duration-300 group-hover:bg-violet group-hover:text-ink group-hover:rotate-45">
                  <ArrowUpRight size={18} />
                </span>
              </div>

              <div className="my-4">
                <h3 className="display text-2xl font-semibold text-paper group-hover:text-violet transition-colors">
                  {GATEWAYS[2].title}
                </h3>
                <p className="font-mono text-violet/90 text-xs mt-1 mb-3">
                  {GATEWAYS[2].subtitle}
                </p>
                <p className="text-xs text-paper/70 leading-relaxed font-sans line-clamp-3">
                  {GATEWAYS[2].description}
                </p>
                <div className="h-32 w-full flex items-center justify-center text-violet/80 my-3">
                  <div className="h-28 w-28 transition-transform duration-700 ease-out group-hover:scale-110">
                    {GATEWAYS[2].graphic}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                {GATEWAYS[2].tags.slice(0, 3).map((t) => (
                  <span key={t} className="px-2.5 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[9px] text-paper/80 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </CinematicCard>
        </div>

        {/* Card 4: Astroloji Stüdyosu */}
        <div>
          <CinematicCard accent={GATEWAYS[3].accent} className="h-full">
            <Link
              href={GATEWAYS[3].href}
              className="flex h-full min-h-[380px] flex-col justify-between p-7"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/40 bg-gold/10 text-gold shadow-[0_0_15px_rgba(245,197,66,0.2)]">
                    <Orbit size={18} />
                  </span>
                  <div>
                    <span className="font-mono text-gold text-xs font-semibold">{GATEWAYS[3].index} / 05</span>
                    <span className="font-mono text-muted block text-[10px] uppercase">Zodyak Stüdyosu</span>
                  </div>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-paper transition-all duration-300 group-hover:bg-gold group-hover:text-ink group-hover:rotate-45">
                  <ArrowUpRight size={18} />
                </span>
              </div>

              <div className="my-4">
                <h3 className="display text-2xl font-semibold text-paper group-hover:text-gold transition-colors">
                  {GATEWAYS[3].title}
                </h3>
                <p className="font-mono text-gold/90 text-xs mt-1 mb-3">
                  {GATEWAYS[3].subtitle}
                </p>
                <p className="text-xs text-paper/70 leading-relaxed font-sans line-clamp-3">
                  {GATEWAYS[3].description}
                </p>
                <div className="h-32 w-full flex items-center justify-center text-gold/80 my-3">
                  <div className="h-28 w-28 transition-transform duration-700 ease-out group-hover:scale-110">
                    {GATEWAYS[3].graphic}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                {GATEWAYS[3].tags.slice(0, 3).map((t) => (
                  <span key={t} className="px-2.5 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[9px] text-paper/80 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </CinematicCard>
        </div>

        {/* Card 5: Derin Uzay Gözlemevi */}
        <div>
          <CinematicCard accent={GATEWAYS[4].accent} className="h-full">
            <Link
              href={GATEWAYS[4].href}
              className="flex h-full min-h-[380px] flex-col justify-between p-7"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose/40 bg-rose/10 text-rose shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                    <Sparkles size={18} />
                  </span>
                  <div>
                    <span className="font-mono text-rose text-xs font-semibold">{GATEWAYS[4].index} / 05</span>
                    <span className="font-mono text-muted block text-[10px] uppercase">Spektroskopi</span>
                  </div>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-paper transition-all duration-300 group-hover:bg-rose group-hover:text-ink group-hover:rotate-45">
                  <ArrowUpRight size={18} />
                </span>
              </div>

              <div className="my-4">
                <h3 className="display text-2xl font-semibold text-paper group-hover:text-rose transition-colors">
                  {GATEWAYS[4].title}
                </h3>
                <p className="font-mono text-rose/90 text-xs mt-1 mb-3">
                  {GATEWAYS[4].subtitle}
                </p>
                <p className="text-xs text-paper/70 leading-relaxed font-sans line-clamp-3">
                  {GATEWAYS[4].description}
                </p>
                <div className="h-32 w-full flex items-center justify-center text-rose/80 my-3">
                  <div className="h-28 w-28 transition-transform duration-700 ease-out group-hover:scale-110">
                    {GATEWAYS[4].graphic}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                {GATEWAYS[4].tags.slice(0, 3).map((t) => (
                  <span key={t} className="px-2.5 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[9px] text-paper/80 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </CinematicCard>
        </div>
      </div>
    </section>
  );
}
