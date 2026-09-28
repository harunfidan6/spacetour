'use client';

import React, { useState, useEffect } from 'react';
import { Rocket, Radio, Signal, ArrowUpRight, Clock, MapPin } from 'lucide-react';

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
    badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/30'
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
    badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/30'
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
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30'
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
    badgeColor: 'text-orange-400 bg-orange-400/10 border-orange-400/30'
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
    <div className="rounded-3xl border border-card-border bg-card-bg/75 p-6 backdrop-blur-md shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-secondary animate-pulse" />
          <div>
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider font-mono">
              Yıldızlararası Sondalar & Uzay Araçları
            </h3>
            <span className="text-[10px] text-text-secondary font-mono">DERİN UZAY İLETİŞİM AĞI (NASA DSN)</span>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-primary font-bold">
          <Radio size={12} className="animate-spin text-primary" style={{ animationDuration: '4s' }} />
          CANLI SİNYAL TAKİBİ
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono">
        {PROBES_DATA.map((probe) => {
          const isActive = selectedProbe.id === probe.id;
          return (
            <button
              key={probe.id}
              onClick={() => setSelectedProbe(probe)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-secondary/20 text-secondary border border-secondary/40 shadow-[0_0_15px_rgba(168,85,247,0.3)] scale-102 font-bold'
                  : 'bg-background/50 text-text-secondary border border-card-border/60 hover:text-white'
              }`}
            >
              {probe.name}
            </button>
          );
        })}
      </div>

      {/* Detail Showcase */}
      <div className="rounded-2xl bg-background/50 p-5 border border-card-border/60 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border/40 pb-3">
          <div>
            <span className="text-xs text-text-secondary font-mono">{selectedProbe.mission}</span>
            <h4 className="text-xl font-black text-foreground font-mono">{selectedProbe.name}</h4>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${selectedProbe.badgeColor}`}>
            {selectedProbe.status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-card-bg/60 border border-card-border/40">
            <span className="text-[10px] text-text-secondary block">DÜNYA'YA UZAKLIK</span>
            <span className="text-base font-bold text-foreground">
              {selectedProbe.distanceAu >= 1 ? `${selectedProbe.distanceAu} AU` : `${(selectedProbe.distanceKm / 1000000).toFixed(2)} Milyon km`}
            </span>
            <span className="text-[10px] text-text-secondary block mt-0.5">
              {(selectedProbe.distanceKm / 1000000000).toFixed(2)} Milyar km
            </span>
          </div>

          <div className="p-3 rounded-xl bg-card-bg/60 border border-card-border/40">
            <span className="text-[10px] text-text-secondary block">MEVCUT HIZ</span>
            <span className="text-base font-bold text-accent">
              {selectedProbe.speedKmH.toLocaleString()} km/s
            </span>
            <span className="text-[10px] text-text-secondary block mt-0.5">
              {(selectedProbe.speedKmH / 3600).toFixed(1)} km/saniye
            </span>
          </div>

          <div className="p-3 rounded-xl bg-card-bg/60 border border-card-border/40">
            <span className="text-[10px] text-text-secondary block">SİNYAL GECİKMESİ</span>
            <span className="text-base font-bold text-primary truncate block" title={selectedProbe.signalDelay}>
              {selectedProbe.signalDelay.split(' ')[0]} {selectedProbe.signalDelay.split(' ')[1]}
            </span>
            <span className="text-[10px] text-text-secondary block mt-0.5">Işık hızı telsiz süresi</span>
          </div>

          <div className="p-3 rounded-xl bg-card-bg/60 border border-card-border/40">
            <span className="text-[10px] text-text-secondary block">FIRLATILIŞ YILI</span>
            <span className="text-base font-bold text-star-gold">{selectedProbe.launchYear}</span>
            <span className="text-[10px] text-text-secondary block mt-0.5">
              {2026 - selectedProbe.launchYear} yıldır görevde
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
