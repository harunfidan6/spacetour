'use client';

import Link from 'next/link';
import {
  Telescope,
  Calendar,
  BookOpen,
  Globe2,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Compass,
  Layers,
  Flame,
  Radio,
  Rocket,
  Zap
} from 'lucide-react';
import { useSpace, DestinationId } from '@/components/space/SpaceContext';
import { IssTracker } from '@/components/space/IssTracker';
import { NasaApodSection } from '@/components/space/NasaApodSection';
import { SpaceWeatherWidget } from '@/components/space/SpaceWeatherWidget';
import { InterstellarProbes } from '@/components/space/InterstellarProbes';
import { SkyTonightWidget } from '@/components/space/SkyTonightWidget';

export default function Home() {
  const { setDestination, currentDestination } = useSpace();

  const celestialDestinations: {
    id: DestinationId;
    label: string;
    sublabel: string;
    coords: string;
    icon: string;
  }[] = [
    { id: 'earth', label: 'Dünya & Ay', sublabel: '1.00 AU • Yaşam Beşiği', coords: '149.6M km', icon: '🌍' },
    { id: 'mars', label: 'Mars', sublabel: '1.52 AU • Kızıl Çöl', coords: '227.9M km', icon: '🔴' },
    { id: 'jupiter', label: 'Jüpiter', sublabel: '5.20 AU • Fırtınalar Devi', coords: '778.5M km', icon: '🪐' },
    { id: 'saturn', label: 'Satürn', sublabel: '9.58 AU • Buz Halkaları', coords: '1.43B km', icon: '🪐' },
    { id: 'sun', label: 'Güneş', sublabel: 'G2V • Sistem Merkezi', coords: 'Sol Çekirdeği', icon: '☀️' },
    { id: 'blackhole', label: 'Gargantua', sublabel: 'Rölativistik Olay Ufku', coords: '100M M☉', icon: '🕳️' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Subtle vignette so text is always perfectly legible over 3D space */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-black/25 to-black/85 z-0" />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center max-w-4xl mx-auto">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-mono tracking-widest text-neutral-300 backdrop-blur-xl">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>NASA 3D UZAY ATLASI & ORRERY</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white drop-shadow-2xl">
          Güneş Sistemi &{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
            Derin Uzay
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base sm:text-lg text-neutral-300 leading-relaxed font-normal backdrop-blur-md bg-black/20 rounded-2xl p-4 border border-white/5">
          NASA ve ESA verileriyle modellenmiş 3D gezegenler arasında serbestçe seyahat edin, 
          gökyüzünü 360° planetaryumda inceleyin ve evrenin fiziksel zarafetini keşfedin.
        </p>

        {/* Hero Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setDestination('earth')}
            className="flex items-center gap-2.5 rounded-full bg-white text-black font-semibold px-7 py-3.5 text-sm shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>Dünya Yörüngesine Gir</span>
            <ArrowRight size={16} />
          </button>

          <Link
            href="/harita"
            className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 text-white font-medium px-7 py-3.5 text-sm backdrop-blur-xl hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer"
          >
            <Telescope size={16} className="text-cyan-400" />
            <span>3D Gök Haritası</span>
          </Link>
        </div>
      </section>

      {/* QUICK CELESTIAL FLYBYS */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-14">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-bold tracking-widest text-neutral-300 uppercase">
              3D Yörünge Hedefleri • Farenizle Serbestçe Keşfedin
            </h2>
          </div>
          <div className="text-[11px] font-mono text-neutral-400 hidden sm:block">
            Mevcut Konum: <strong className="text-white">{currentDestination.name}</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {celestialDestinations.map((target) => {
            const isSelected = currentDestination.id === target.id;
            return (
              <button
                key={target.id}
                onClick={() => setDestination(target.id)}
                className={`group flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-300 backdrop-blur-xl cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400/60 bg-white/10 shadow-[0_0_25px_rgba(0,212,255,0.25)] scale-102 ring-1 ring-cyan-400/40'
                    : 'border-white/10 bg-black/40 hover:border-white/25 hover:bg-white/5 hover:-translate-y-1'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-2xl">{target.icon}</span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                    isSelected ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300' : 'border-white/10 text-neutral-400'
                  }`}>
                    {isSelected ? 'GÖRÜNÜMDE' : 'SEÇ'}
                  </span>
                </div>
                <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {target.label}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                  {target.sublabel}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* BU GECE GÖKYÜZÜ - LIVE SKY TONIGHT RADAR */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-14">
        <SkyTonightWidget />
      </section>

      {/* MISSION TELEMETRY (ISS, SPACE WEATHER, APOD) */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-16 space-y-8">
        <div className="rounded-3xl border border-white/10 bg-black/50 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-12">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-sm font-mono font-bold tracking-widest text-neutral-200 uppercase">
                Uzay Gözlem Telemetrisi & Canlı Uydular
              </h3>
            </div>
            <div className="text-xs font-mono text-neutral-400">
              NASA JPL / NOAA Real-time
            </div>
          </div>

          {/* Live ISS Orbital Tracker */}
          <IssTracker />

          {/* Space Weather & Solar Wind */}
          <SpaceWeatherWidget />

          {/* Interstellar Probes Radar */}
          <InterstellarProbes />

          {/* NASA APOD Daily Discovery */}
          <NasaApodSection />
        </div>
      </section>

      {/* EXPLORATION MODULES */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-20">
        <div className="flex flex-col items-center mb-8">
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            SpaceTour Keşif Modülleri
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/harita"
            className="group rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:-translate-y-1"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-white/5 p-3.5 text-cyan-300 border border-white/10 group-hover:scale-105 transition-transform">
              <Telescope size={24} />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
              3D Gökyüzü Haritası
              <ChevronRight className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" size={16} />
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-400">
              360° gök kubbeyi çevirin, Samanyolu çekirdeğini ve 100 parlak referans yıldızını inceleyin.
            </p>
          </Link>

          <Link
            href="/takvim"
            className="group rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:-translate-y-1"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-white/5 p-3.5 text-amber-300 border border-white/10 group-hover:scale-105 transition-transform">
              <Calendar size={24} />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
              Olay Takvimi
              <ChevronRight className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" size={16} />
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-400">
              Ay ve Güneş tutulmaları, meteor yağmurları ve gezegen kavuşumlarını tarihe göre takip edin.
            </p>
          </Link>

          <Link
            href="/ansiklopedi"
            className="group rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:-translate-y-1"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-white/5 p-3.5 text-purple-300 border border-white/10 group-hover:scale-105 transition-transform">
              <BookOpen size={24} />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
              Uzay Ansiklopedisi & Orrery
              <ChevronRight className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" size={16} />
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-400">
              3D Keplerian Güneş Sistemi çarkı, gezegen boyut karşılaştırma laboratuvarı ve bilimsel raporlar.
            </p>
          </Link>

          <Link
            href="/gozlemevi"
            className="group rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:-translate-y-1"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-white/5 p-3.5 text-emerald-300 border border-white/10 group-hover:scale-105 transition-transform">
              <Layers size={24} />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
              Multispektral Gözlemevi
              <ChevronRight className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" size={16} />
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-400">
              James Webb kızılötesi, Chandra X-Ray ve radyo dalgaları ile evrenin görünmeyen yüzünü keşfedin.
            </p>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/60 py-8 text-center text-xs text-neutral-400 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">SpaceTour TR</span>
            <span className="text-neutral-500">•</span>
            <span className="font-mono text-neutral-400">spacetour.com.tr</span>
          </div>
          <p className="text-neutral-500">
            NASA / ESA / USGS Açık Veri Lisanslı 3D Uzay Seyahati Platformu
          </p>
        </div>
      </footer>
    </div>
  );
}
