'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Wind,
  AlertTriangle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

interface SpaceWeatherData {
  solarWindSpeed: number; // km/s
  solarWindDensity: number; // p/cm³
  kpIndex: number; // 0-9
  geomagneticStorm: string;
  auroraChance: string;
  solarFlareStatus: string;
  flareClass: string;
}

export function SpaceWeatherWidget() {
  const [weather, setWeather] = useState<SpaceWeatherData>({
    solarWindSpeed: 442,
    solarWindDensity: 6.8,
    kpIndex: 3.2,
    geomagneticStorm: 'Sakin / Normal (G0)',
    auroraChance: '%35 (Kuzey İskandinavya & Alaska)',
    solarFlareStatus: 'M1.4 Orta Şiddet Patlama',
    flareClass: 'M1.4'
  });

  // Minor live fluctuations simulating real-time NOAA/DSCOVR satellite telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      setWeather((prev) => ({
        ...prev,
        solarWindSpeed: Math.round(440 + Math.sin(Date.now() * 0.001) * 25),
        solarWindDensity: Number((6.5 + Math.cos(Date.now() * 0.0015) * 0.8).toFixed(1)),
        kpIndex: Number((3.0 + Math.sin(Date.now() * 0.0008) * 0.6).toFixed(1))
      }));
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  const getKpColor = (kp: number) => {
    if (kp < 4) return 'border-lime/30 bg-lime/10 text-lime';
    if (kp < 6) return 'border-solar/30 bg-solar/10 text-solar';
    return 'border-rose/30 bg-rose/10 text-rose';
  };

  return (
    <div className="relative ticks border border-line bg-ink p-6 sm:p-8 space-y-5">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-solar animate-spin" style={{ animationDuration: '15s' }} />
          <div>
            <h3 className="display display-tight text-xl text-paper sm:text-2xl">
              Güneş & Uzay Hava Durumu
            </h3>
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
              NOAA & SOHO UYDU TELEMETRİSİ
            </span>
          </div>
        </div>
        <span className={`px-2.5 py-1 text-[10px] font-mono border font-bold uppercase tracking-wider ${getKpColor(weather.kpIndex)}`}>
          KP {weather.kpIndex} · {weather.kpIndex < 4 ? 'JEOMANYETİK SAKİN' : 'FIRTINA UYARISI'}
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-ink-2 p-3.5 border border-line">
          <div className="flex items-center gap-1.5 text-muted text-[10px] uppercase tracking-wider mb-1">
            <Wind size={12} className="text-solar" /> GÜNEŞ RÜZGARI
          </div>
          <div className="text-base font-bold text-paper">
            {weather.solarWindSpeed} <span className="text-[10px] font-normal text-muted">km/s</span>
          </div>
          <div className="text-[10px] text-muted mt-1">Hızlı Plazma Akışı</div>
        </div>

        <div className="bg-ink-2 p-3.5 border border-line">
          <div className="flex items-center gap-1.5 text-muted text-[10px] uppercase tracking-wider mb-1">
            <Zap size={12} className="text-solar" /> PROTON YOĞUNLUĞU
          </div>
          <div className="text-base font-bold text-solar">
            {weather.solarWindDensity} <span className="text-[10px] font-normal text-muted">p/cm³</span>
          </div>
          <div className="text-[10px] text-muted mt-1">Partikül Yoğunluğu</div>
        </div>

        <div className="bg-ink-2 p-3.5 border border-line">
          <div className="flex items-center gap-1.5 text-muted text-[10px] uppercase tracking-wider mb-1">
            <AlertTriangle size={12} className="text-solar" /> FLARE AKTİVİTESİ
          </div>
          <div className="text-base font-bold text-paper">{weather.flareClass}</div>
          <div className="text-[10px] text-muted mt-1">X-Ray Radyasyon Sınıfı</div>
        </div>

        <div className="bg-ink-2 p-3.5 border border-line">
          <div className="flex items-center gap-1.5 text-muted text-[10px] uppercase tracking-wider mb-1">
            <ShieldCheck size={12} className="text-lime" /> KUTUP IŞIĞI (AURORA)
          </div>
          <div className="text-base font-bold text-lime">{weather.auroraChance.split(' ')[0]}</div>
          <div className="text-[10px] text-muted mt-1 truncate">{weather.auroraChance.split(' ')[1]}</div>
        </div>
      </div>
    </div>
  );
}
