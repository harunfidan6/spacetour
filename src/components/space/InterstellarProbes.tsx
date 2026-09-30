'use client';

import React, { useState } from 'react';
import { Rocket, Radio } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

interface Probe {
  id: string;
  name: string;
  mission: string;
  distanceKm: number; // in billions or millions
  distanceAu: number;
  speedKmH: number;
  launchYear: number;
  signalDelay: string;
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
    signalDelay: '22 saat 39 dakika (Tek yön)',
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
    signalDelay: '18 saat 54 dakika (Tek yön)',
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
    signalDelay: '8 saat 12 dakika',
    status: 'Kuiper Kuşağında',
    badgeColor: 'text-primary bg-primary/10 border-primary/30'
  },
  {
    id: 'parker',
    name: 'Parker Solar Probe',
    mission: 'Güneş Tacı İncelemesi',
    distanceKm: 145000000,
    distanceAu: 0.97,
    speedKmH: 635266, // Fastest human-made object in history!
    launchYear: 2018,
    signalDelay: '8 dakika 19 saniye',
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
    signalDelay: '5 saniye (Işık Hızı)',
    status: 'L2 Yörüngesinde',
    badgeColor: 'text-star-gold bg-star-gold/10 border-star-gold/30'
  }
];

export function InterstellarProbes() {
  const [selectedProbe, setSelectedProbe] = useState<Probe>(PROBES_DATA[0]);

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
          CANLI SİNYAL TAKİBİ
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        {PROBES_DATA.map((probe) => {
          const isActive = selectedProbe.id === probe.id;
          return (
            <button
              key={probe.id}
              onClick={() => setSelectedProbe(probe)}
              className={`px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer border uppercase tracking-wider ${
                isActive
                  ? 'border-violet bg-violet text-ink font-bold'
                  : 'border-line bg-ink-2 text-muted hover:border-line hover:text-paper'
              }`}
            >
              {probe.name}
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
              {selectedProbe.distanceAu >= 1 ? `${selectedProbe.distanceAu} AU` : `${(selectedProbe.distanceKm / 1000000).toFixed(2)} Milyon km`}
            </span>
            <span className="text-[10px] text-muted block mt-1">
              {(selectedProbe.distanceKm / 1000000000).toFixed(2)} Milyar km
            </span>
          </div>

          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-muted block uppercase tracking-wider">MEVCUT HIZ</span>
            <span className="text-base font-bold text-solar mt-0.5 block">
              {selectedProbe.speedKmH.toLocaleString()} km/s
            </span>
            <span className="text-[10px] text-muted block mt-1">
              {(selectedProbe.speedKmH / 3600).toFixed(1)} km/saniye
            </span>
          </div>

          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-muted block uppercase tracking-wider">SİNYAL GECİKMESİ</span>
            <span className="text-base font-bold text-paper truncate block mt-0.5" title={selectedProbe.signalDelay}>
              {selectedProbe.signalDelay.split(' ')[0]} {selectedProbe.signalDelay.split(' ')[1]}
            </span>
            <span className="text-[10px] text-muted block mt-1">Işık hızı telsiz süresi</span>
          </div>

          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-muted block uppercase tracking-wider">FIRLATILIŞ YILI</span>
            <span className="text-base font-bold text-paper mt-0.5 block">{selectedProbe.launchYear}</span>
            <span className="text-[10px] text-muted block mt-1">
              {2026 - selectedProbe.launchYear} yıldır görevde
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
