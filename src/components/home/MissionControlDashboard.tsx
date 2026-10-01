'use client';

import React from 'react';
import { SkyTonightWidget } from '@/components/space/SkyTonightWidget';
import { IssTracker } from '@/components/space/IssTracker';
import { SpaceWeatherWidget } from '@/components/space/SpaceWeatherWidget';
import { InterstellarProbes } from '@/components/space/InterstellarProbes';
import { NasaApodSection } from '@/components/space/NasaApodSection';
import { Radio } from 'lucide-react';

export function MissionControlDashboard() {
  return (
    <section className="relative px-[var(--gutter)] py-20 bg-ink border-t border-line">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line pb-8 mb-12">
        <div>
          <div className="label text-lime flex items-center gap-2 mb-2 font-mono">
            <Radio size={14} className="animate-pulse text-lime" />
            <span>CANLI TELEMETRİ MERKEZİ</span>
          </div>
          <h2 className="display display-tight text-3xl sm:text-5xl text-paper">
            Kozmik Görev Kontrolü
          </h2>
        </div>
        <p className="max-w-md text-sm text-paper/70 font-sans leading-relaxed">
          NASA, NOAA ve ESA canlı veri akışlarıyla Dünya yörüngesindeki istasyonlardan yıldızlararası sınıra kadar anlık uzay telemetrisi.
        </p>
      </div>

      {/* Grid */}
      <div className="space-y-8">
        {/* 1. Sky Tonight */}
        <div className="rounded-2xl border border-line bg-ink-2/95 overflow-hidden shadow-2xl">
          <SkyTonightWidget />
        </div>

        {/* 2. Middle Row: ISS & Space Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-line bg-ink-2/95 overflow-hidden shadow-2xl">
            <IssTracker />
          </div>
          <div className="rounded-2xl border border-line bg-ink-2/95 overflow-hidden shadow-2xl">
            <SpaceWeatherWidget />
          </div>
        </div>

        {/* 3. Bottom Row: Interstellar Probes & NASA APOD */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-line bg-ink-2/95 overflow-hidden shadow-2xl">
            <InterstellarProbes />
          </div>
          <div className="rounded-2xl border border-line bg-ink-2/95 overflow-hidden shadow-2xl">
            <NasaApodSection />
          </div>
        </div>
      </div>
    </section>
  );
}
