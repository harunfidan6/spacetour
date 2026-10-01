'use client';

import React, { useState } from 'react';
import { Rocket, Radio } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
import { useNow } from '@/lib/useNow';

const AU_KM = 149_597_870.7;
const LIGHT_KM_S = 299_792.458;
// Epoch of the tabulated distances; outbound probes are extrapolated from here at their radial speed
const DATA_EPOCH = Date.UTC(2024, 2, 1);
const YEAR_MS = 365.25 * 86_400_000;

interface Probe {
  id: string;
  name: string;
  mission: string;
  distanceKm: number; // in billions or millions
  distanceAu: number;
  speedKmH: number;
  launchYear: number;
  /** Radial recession (AU per year) for probes coasting out of the Solar System. */
  auPerYear?: number;
  status: 'Yıldızlararası Uzayda' | 'Kuiper Kuşağında' | 'L2 Yörüngesinde' | 'Güneş Tacında';
  badgeColor: string;
}

const PROBES_DATA: Probe[] = [
  {
    id: 'voyager-1',
    name: 'Voyager 1',
    mission: 'Yıldızlararası Görev',
    distanceKm: 24450000000,
    distanceAu: 163.4,
    speedKmH: 61198,
    launchYear: 1977,
    auPerYear: 3.58,
    status: 'Yıldızlararası Uzayda',
    badgeColor: 'text-violet bg-violet/10 border-violet/30'
  },
  {
    id: 'voyager-2',
    name: 'Voyager 2',
    mission: 'Yıldızlararası Görev',
    distanceKm: 20400000000,
    distanceAu: 136.3,
    speedKmH: 55346,
    launchYear: 1977,
    auPerYear: 3.25,
    status: 'Yıldızlararası Uzayda',
    badgeColor: 'text-violet bg-violet/10 border-violet/30'
  },
  {
    id: 'new-horizons',
    name: 'New Horizons',
    mission: 'Kuiper Kuşağı & Plüton',
    distanceKm: 8850000000,
    distanceAu: 59.1,
    speedKmH: 49600,
    launchYear: 2006,
    auPerYear: 2.9,
    status: 'Kuiper Kuşağında',
    badgeColor: 'text-primary bg-primary/10 border-primary/30'
  },
  {
    id: 'parker',
    name: 'Parker Solar Probe',
    mission: 'Güneş Tacı İncelemesi',
    distanceKm: 145000000,
    distanceAu: 0.97,
    speedKmH: 635266, // Peak speed at perihelion — fastest human-made object in history
    launchYear: 2018,
    status: 'Güneş Tacında',
    badgeColor: 'text-primary bg-primary/10 border-primary/30'
  },
  {
    id: 'jwst',
    name: 'James Webb (JWST)',
    mission: 'Derin Uzay Teleskobu',
    distanceKm: 1500000,
    distanceAu: 0.01,
    speedKmH: 720,
    launchYear: 2021,
    status: 'L2 Yörüngesinde',
    badgeColor: 'text-star-gold bg-star-gold/10 border-star-gold/30'
  }
];

function formatLightTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)} saniye`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m} dk ${Math.round(seconds % 60)} sn`;
  return `${h} sa ${m} dk`;
}

export function InterstellarProbes() {
  const [selectedProbe, setSelectedProbe] = useState<Probe>(PROBES_DATA[0]);
  const now = useNow(60_000);

  const years = now ? (now.getTime() - DATA_EPOCH) / YEAR_MS : 0;
  const distanceAu = selectedProbe.auPerYear
    ? selectedProbe.distanceAu + selectedProbe.auPerYear * years
    : selectedProbe.distanceAu;
  const distanceKm = selectedProbe.auPerYear ? distanceAu * AU_KM : selectedProbe.distanceKm;
  const lightSeconds = distanceKm / LIGHT_KM_S;

  return (
    <div className="relative ticks border border-line bg-ink p-6 sm:p-8 space-y-5">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <Rocket className="h-4 w-4 text-violet animate-pulse" />
          <div>
            <h3 className="display display-tight text-xl text-paper sm:text-2xl">
              Yıldızlararası Sondalar & Uzay Araçları
            </h3>
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
              DERİN UZAY İLETİŞİM AĞI (NASA DSN)
            </span>
          </div>
        </div>
        <span className="flex items-center gap-1.5 border border-violet/30 bg-violet/10 px-2.5 py-1 text-[10px] font-mono text-violet font-bold uppercase tracking-wider">
          <Radio size={12} className="animate-spin text-violet" style={{ animationDuration: '4s' }} />
          {selectedProbe.auPerYear ? 'MESAFE ANLIK TAHMİN' : 'YAKLAŞIK KONUM'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        {PROBES_DATA.map((probe) => {
          const isActive = selectedProbe.id === probe.id;
          return (
            <button
              key={probe.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelectedProbe(probe)}
              className={`px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer border uppercase tracking-wider ${
                isActive
                  ? 'border-violet bg-violet text-ink font-bold'
                  : 'border-line bg-ink-2 text-muted hover:border-line hover:text-paper'
              }`}
            >
              <span lang="en">{probe.name}</span>
            </button>
          );
        })}
      </div>

      {/* Detail Showcase */}
      <div className="border border-line bg-ink-2 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
          <div>
            <span className="text-[10px] text-muted font-mono uppercase tracking-wider">{selectedProbe.mission}</span>
            <h4 className="text-xl font-bold text-paper font-mono mt-0.5">{selectedProbe.name}</h4>
          </div>
          <span className={`px-2.5 py-1 text-[10px] font-mono font-bold border uppercase tracking-wider ${selectedProbe.badgeColor}`}>
            {selectedProbe.status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-muted block uppercase tracking-wider">DÜNYA’YA UZAKLIK</span>
            <span className="text-base font-bold text-paper mt-0.5 block">
              {!now
                ? '—'
                : distanceAu >= 1
                  ? `${distanceAu.toFixed(2)} AU`
                  : `${(distanceKm / 1_000_000).toFixed(2)} Milyon km`}
            </span>
            <span className="text-[10px] text-muted block mt-1">
              {now ? `${(distanceKm / 1_000_000_000).toFixed(2)} Milyar km` : '—'}
            </span>
          </div>

          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-muted block uppercase tracking-wider">
              {selectedProbe.id === 'parker' ? 'TEPE HIZ' : 'MEVCUT HIZ'}
            </span>
            <span className="text-base font-bold text-solar mt-0.5 block">
              {selectedProbe.speedKmH.toLocaleString('tr-TR')} km/sa
            </span>
            <span className="text-[10px] text-muted block mt-1">
              {(selectedProbe.speedKmH / 3600).toFixed(1)} km/saniye
            </span>
          </div>

          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-muted block uppercase tracking-wider">SİNYAL GECİKMESİ</span>
            <span className="text-sm font-bold text-paper block mt-0.5 sm:text-base">
              {now ? formatLightTime(lightSeconds) : '—'}
            </span>
            <span className="text-[10px] text-muted block mt-1">Işık hızıyla tek yön</span>
          </div>

          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-muted block uppercase tracking-wider">FIRLATILIŞ YILI</span>
            <span className="text-base font-bold text-paper mt-0.5 block">{selectedProbe.launchYear}</span>
            <span className="text-[10px] text-muted block mt-1">
              {now ? `${now.getFullYear() - selectedProbe.launchYear} yıldır görevde` : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
