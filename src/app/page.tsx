'use client';

import Link from 'next/link';
import {
  Telescope,
  Calendar,
  BookOpen,
  Rocket,
  Zap,
  Globe2,
  Flame,
  Radio,
  Sparkles,
  ChevronRight,
  Satellite,
  Layers
} from 'lucide-react';
import { useSpace, DestinationId } from '@/components/space/SpaceContext';
import { IssTracker } from '@/components/space/IssTracker';
import { NasaApodSection } from '@/components/space/NasaApodSection';
import { SpaceWeatherWidget } from '@/components/space/SpaceWeatherWidget';
import { InterstellarProbes } from '@/components/space/InterstellarProbes';
import { SkyTonightWidget } from '@/components/space/SkyTonightWidget';

export default function Home() {
  const { setDestination, currentDestination, isWarping } = useSpace();

  const quickJumpTargets: { id: DestinationId; label: string; icon: any; color: string; desc: string }[] = [
    { id: 'earth', label: 'Dünya & Ay', icon: Globe2, color: 'text-primary border-primary/40 bg-primary/10', desc: 'Mavi gezegen yörüngesi' },
    { id: 'mars', label: 'Mars Kolonisi', icon: Rocket, color: 'text-accent border-accent/40 bg-accent/10', desc: 'Kızıl çöl ve kanyonlar' },
    { id: 'jupiter', label: 'Jüpiter Dev', icon: Sparkles, color: 'text-amber-400 border-amber-400/40 bg-amber-400/10', desc: 'Büyük Kırmızı Leke' },
    { id: 'saturn', label: 'Satürn Halkaları', icon: Radio, color: 'text-yellow-300 border-yellow-300/40 bg-yellow-300/10', desc: 'Muhteşem buz diskleri' },
    { id: 'sun', label: 'Güneş Plazması', icon: Flame, color: 'text-orange-500 border-orange-500/40 bg-orange-500/10', desc: 'Korona ve çekirdek füzyonu' },
    { id: 'blackhole', label: 'Gargantua Karadelik', icon: Zap, color: 'text-purple-400 border-purple-400/40 bg-purple-400/10', desc: 'Olay ufku ve akresyon diski' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Subtle vignette gradient for legibility without blocking 3D view */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-background/30 to-background/90 z-0" />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 pt-16 pb-12 text-center sm:pt-24 sm:pb-16 max-w-5xl mx-auto">
        {/* Animated Orbital Ring Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/20 border-dashed animate-[spin_60s_linear_infinite] pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-secondary/20 animate-[spin_40s_linear_infinite_reverse] pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial from-primary/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest text-primary backdrop-blur-md shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-shadow cursor-default">
          <Zap size={14} className="animate-pulse" />
          İNTERAKTİF 3D UZAY DENEYİMİ AKTİF
        </div>

        <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-7xl drop-shadow-2xl">
          Evrende{' '}
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(0,212,255,0.5)]">
            Işık Hızında
          </span>{' '}
          Yolculuk
        </h1>

        <p className="mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-text-secondary font-medium backdrop-blur-sm bg-background/20 rounded-2xl p-4 border border-white/5 shadow-xl">
          Gerçek zamanlı 3D WebGL Güneş Sistemi simülasyonu ile gezegenler arasında serbestçe uçun, 
          kara deliğin çekimini hissedin ve gök kubbeyi keşfedin.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <button
            onClick={() => setDestination('earth')}
            className="group relative inline-flex items-center gap-3 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-background shadow-[0_0_40px_rgba(0,212,255,0.5)] transition-all hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Globe2 size={20} className="relative z-10" />
            <span className="relative z-10 tracking-wide">Dünya’ya Yaklaş</span>
          </button>

          <button
            onClick={() => setDestination('blackhole')}
            className="group relative inline-flex items-center gap-3 rounded-2xl border-2 border-secondary/50 bg-secondary/10 px-8 py-4 text-sm font-bold text-foreground backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all hover:border-secondary hover:bg-secondary/20 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
          >
            <Zap size={20} className="text-secondary relative z-10 group-hover:animate-pulse" />
            <span className="relative z-10 tracking-wide">Karadeliğe Warp Yap</span>
          </button>
        </div>
      </section>

      {/* QUICK FLIGHT LAUNCHPAD (Direct 3D Jump Cards) */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-12">
        <div className="flex items-center justify-between mb-6 border-b border-primary/20 pb-3 bg-background/40 p-3 rounded-t-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
              <Rocket className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase font-mono">
              3D Gezegen Keşfi • Doğrudan Yörüngeye Uçun
            </h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-card-bg/80 rounded-md border border-card-border">
            <span className={`w-2 h-2 rounded-full ${isWarping ? 'bg-secondary animate-pulse' : 'bg-primary'}`} />
            <span className="text-xs text-text-secondary font-mono font-bold tracking-wider">
              {isWarping ? 'WARP AKTİF' : `KONUM: ${currentDestination.name.toUpperCase()}`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickJumpTargets.map((target) => {
            const Icon = target.icon;
            const isSelected = currentDestination.id === target.id;

            return (
              <button
                key={target.id}
                onClick={() => setDestination(target.id)}
                className={`group relative flex flex-col items-start p-4 rounded-xl border backdrop-blur-xl transition-all duration-300 text-left cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'border-primary bg-primary/20 shadow-[0_0_30px_rgba(0,212,255,0.4)] scale-105 ring-1 ring-primary/50 z-10'
                    : 'border-primary/20 bg-card-bg/60 hover:border-primary/60 hover:bg-primary/10 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,212,255,0.2)]'
                }`}
              >
                <div className="flex w-full justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-lg border relative transition-all duration-300 ${target.color} ${isSelected ? 'shadow-[0_0_20px_currentColor] scale-110' : 'group-hover:shadow-[0_0_15px_currentColor] group-hover:scale-110'}`}>
                    <Icon size={22} className={`relative z-10 ${isSelected ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className={`text-[9px] font-mono tracking-wider px-2 py-1 rounded flex items-center gap-1.5 transition-colors ${isSelected ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-background/80 text-text-secondary border border-card-border group-hover:text-primary group-hover:border-primary/30'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary animate-ping' : 'bg-emerald-400'}`} />
                    {isSelected ? 'KİLİTLİ' : 'HAZIR'}
                  </div>
                </div>
                <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors tracking-wide">
                  {target.label}
                </div>
                <div className="text-[11px] text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                  {target.desc}
                </div>
                
                <div className={`mt-4 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-all duration-500 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                
                {/* Sci-fi corner markers */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>
      </section>

      {/* BU GECE GÖKYÜZÜ - SKY TONIGHT OBSERVATORY RADAR */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-12">
        <SkyTonightWidget />
      </section>

      {/* LIVE ORBIT & NASA APOD SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-16 space-y-8">
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-primary/30 via-primary/5 to-transparent overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Mission Control Container Background */}
          <div className="absolute inset-0 bg-card-bg/80 backdrop-blur-2xl rounded-3xl" />
          
          {/* High-tech corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/40 rounded-tl-3xl z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/40 rounded-tr-3xl z-20 pointer-events-none" />
          
          {/* Status header */}
          <div className="relative z-20 flex justify-between items-center px-6 py-4 border-b border-primary/10 bg-primary/5 rounded-t-3xl">
            <div className="flex items-center gap-2">
              <Satellite className="text-primary h-5 w-5" />
              <span className="font-mono text-sm tracking-widest text-primary/80 font-bold uppercase">Mission Control Center</span>
            </div>
            <div className="flex items-center gap-3 bg-background/50 px-3 py-1.5 rounded-full border border-primary/20">
              <span className="text-[10px] font-mono text-primary tracking-widest uppercase">Live Feed</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
              </span>
            </div>
          </div>

          <div className="relative z-10 p-6 sm:p-8 space-y-12">
            {/* Live ISS Tracker */}
            <IssTracker />

            {/* Space Weather & Solar Wind Telemetry */}
            <SpaceWeatherWidget />

            {/* Interstellar Probes Radar */}
            <InterstellarProbes />

            {/* NASA APOD Discovery */}
            <NasaApodSection />
          </div>
        </div>
      </section>

      {/* Feature Modules */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-20">
        <div className="flex flex-col items-center mb-10">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mb-4" />
          <h2 className="text-3xl font-black text-center tracking-tight text-foreground drop-shadow-md">
            AstroTR Keşif Modülleri
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/harita"
            className="group relative overflow-hidden rounded-3xl border border-primary/20 bg-card-bg/60 p-6 backdrop-blur-xl transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(0,212,255,0.2)] hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-4 text-primary border border-primary/20 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all duration-300">
                <Telescope size={28} />
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                3D Gökyüzü Haritası
                <ChevronRight className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Gök kubbeyi 360 derece döndürün, takımyıldızların geometrisini ve 100 parlak yıldızı keşfedin.
              </p>
            </div>
          </Link>

          <Link
            href="/takvim"
            className="group relative overflow-hidden rounded-3xl border border-accent/20 bg-card-bg/60 p-6 backdrop-blur-xl transition-all duration-500 hover:border-accent/50 hover:shadow-[0_0_40px_rgba(255,107,53,0.2)] hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="mb-5 inline-flex rounded-2xl bg-accent/10 p-4 text-accent border border-accent/20 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] transition-all duration-300">
                <Calendar size={28} />
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors flex items-center justify-between">
                Olay Takvimi
                <ChevronRight className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Güneş ve Ay tutulmaları, meteor yağmurları ve gezegen kavuşumlarını canlı takip edin.
              </p>
            </div>
          </Link>

          <Link
            href="/ansiklopedi"
            className="group relative overflow-hidden rounded-3xl border border-secondary/20 bg-card-bg/60 p-6 backdrop-blur-xl transition-all duration-500 hover:border-secondary/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="mb-5 inline-flex rounded-2xl bg-secondary/10 p-4 text-secondary border border-secondary/20 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors flex items-center justify-between">
                Uzay Ansiklopedisi
                <ChevronRight className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Gezegenlerin 3D hologram modelleri, boyut kıyaslama laboratuvarı ve bilimsel telemetri.
              </p>
            </div>
          </Link>

          <Link
            href="/gozlemevi"
            className="group relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-card-bg/60 p-6 backdrop-blur-xl transition-all duration-500 hover:border-emerald-400/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="mb-5 inline-flex rounded-2xl bg-emerald-500/10 p-4 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300">
                <Layers size={28} />
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                Derin Uzay
                <ChevronRight className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Kızılötesi, X-Ray ve Radyo dalgaları ile evrenin görünmeyen yüzünü inceleyin.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-card-border bg-card-bg/40 py-6 text-center text-xs text-text-secondary backdrop-blur-md">
        <p>
          © 2026 SpaceTour TR (spacetour.com.tr) — 3D WebGL Uzay Seyahati & Planetaryum Simülasyonu
        </p>
      </footer>
    </div>
  );
}
