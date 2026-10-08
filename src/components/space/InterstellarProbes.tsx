'use client';

import React, { useState } from 'react';
import { Radio, Box, Activity } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
import { useNow } from '@/lib/useNow';
import { SpacecraftExplorer3D } from './SpacecraftExplorer3D';

// Ortak görünüm sınıfları
const VIEW_BUTTON = 'inline-flex min-h-9 items-center gap-1.5 px-3 text-sm transition-colors cursor-pointer';
const STAT_CELL = 'min-w-0 bg-ink p-3';
const STAT_LABEL = 'block text-sm text-paper/70';
const STAT_VALUE = 'mt-1 block font-mono text-base font-semibold tabular-nums';
const STAT_NOTE = 'mt-1 block text-sm text-paper/70';

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
  const [viewMode, setViewMode] = useState<'3d' | 'telemetry'>('3d');
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

      {/* Başlık ve görünüm seçimi */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line pb-5">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
            Yıldızlararası sondalar ve uzay araçları
          </h3>
          <p className="mt-1.5 text-sm text-paper/70">
            Derin uzay iletişim ağı ve 3D hangar
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="flex items-center border border-line p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`${VIEW_BUTTON} ${
                viewMode === '3d'
                  ? 'bg-paper text-ink font-semibold'
                  : 'text-paper/80 hover:text-paper'
              }`}
            >
              <Box size={14} />
              <span>3D modeller</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('telemetry')}
              className={`${VIEW_BUTTON} ${
                viewMode === 'telemetry'
                  ? 'bg-paper text-ink font-semibold'
                  : 'text-paper/80 hover:text-paper'
              }`}
            >
              <Activity size={14} />
              <span>DSN telemetrisi</span>
            </button>
          </div>
          {viewMode === 'telemetry' && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-paper/70">
              <Radio size={13} className="text-violet" />
              {selectedProbe.auPerYear ? 'Anlık mesafe tahmini' : 'Yaklaşık konum'}
            </span>
          )}
        </div>
      </div>

      {viewMode === '3d' ? (
        <SpacecraftExplorer3D />
      ) : (
        <>
          {/* Sonda seçimi */}
          <div className="flex flex-wrap items-center gap-2">
            {PROBES_DATA.map((probe) => {
              const isActive = selectedProbe.id === probe.id;
              return (
                <button
                  key={probe.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedProbe(probe)}
                  className={`min-h-9 whitespace-nowrap border px-3 text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'border-violet bg-violet text-ink font-semibold'
                      : 'border-line text-paper/80 hover:border-paper/40 hover:text-paper'
                  }`}
                >
                  <span lang="en">{probe.name}</span>
                </button>
              );
            })}
          </div>

          {/* Seçili sondanın ayrıntıları */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
              <div className="min-w-0">
                <span className="block text-sm text-paper/70">{selectedProbe.mission}</span>
                <h4 className="mt-0.5 font-display text-xl font-semibold leading-tight text-paper">{selectedProbe.name}</h4>
              </div>
              <span className={`shrink-0 border px-2.5 py-1 text-xs font-medium ${selectedProbe.badgeColor}`}>
                {selectedProbe.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
              <div className={STAT_CELL}>
                <span className={STAT_LABEL}>Dünya’ya uzaklık</span>
                <span className={`${STAT_VALUE} text-paper`}>
                  {!now
                    ? '—'
                    : distanceAu >= 1
                      ? `${distanceAu.toFixed(2)} AU`
                      : `${(distanceKm / 1_000_000).toFixed(2)} Milyon km`}
                </span>
                <span className={`${STAT_NOTE} font-mono tabular-nums`}>
                  {now ? `${(distanceKm / 1_000_000_000).toFixed(2)} Milyar km` : '—'}
                </span>
              </div>

              <div className={STAT_CELL}>
                <span className={STAT_LABEL}>
                  {selectedProbe.id === 'parker' ? 'Tepe hız' : 'Mevcut hız'}
                </span>
                <span className={`${STAT_VALUE} text-solar`}>
                  {selectedProbe.speedKmH.toLocaleString('tr-TR')} km/sa
                </span>
                <span className={`${STAT_NOTE} font-mono tabular-nums`}>
                  {(selectedProbe.speedKmH / 3600).toFixed(1)} km/saniye
                </span>
              </div>

              <div className={STAT_CELL}>
                <span className={STAT_LABEL}>Sinyal gecikmesi</span>
                <span className={`${STAT_VALUE} text-paper`}>
                  {now ? formatLightTime(lightSeconds) : '—'}
                </span>
                <span className={STAT_NOTE}>Işık hızıyla tek yön</span>
              </div>

              <div className={STAT_CELL}>
                <span className={STAT_LABEL}>Fırlatılış yılı</span>
                <span className={`${STAT_VALUE} text-paper`}>{selectedProbe.launchYear}</span>
                <span className={STAT_NOTE}>
                  {now ? `${now.getFullYear() - selectedProbe.launchYear} yıldır görevde` : '—'}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
