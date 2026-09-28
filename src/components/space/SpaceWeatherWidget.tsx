'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Wind, Compass, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

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
    if (kp < 4) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
    if (kp < 6) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    return 'text-red-400 bg-red-400/10 border-red-400/30';
  };

  return (
    <div className="rounded-3xl border border-card-border bg-card-bg/75 p-6 backdrop-blur-md shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-card-border pb-3">
        <div className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-orange-400 animate-spin" style={{ animationDuration: '15s' }} />
          <div>
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider font-mono">
              Güneş & Uzay Hava Durumu
            </h3>
            <span className="text-[10px] text-text-secondary font-mono">NOAA & SOHO UYDU TELEMETRİSİ</span>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono border font-bold ${getKpColor(weather.kpIndex)}`}>
          KP {weather.kpIndex} • {weather.kpIndex < 4 ? 'JEOMANYETİK SAKİN' : 'FIRTINA UYARISI'}
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="rounded-2xl bg-background/50 p-3.5 border border-card-border/60">
          <div className="flex items-center gap-1.5 text-text-secondary text-[10px] mb-1">
            <Wind size={12} className="text-primary" /> GÜNEŞ RÜZGARI
          </div>
          <div className="text-lg font-black text-foreground">{weather.solarWindSpeed} <span className="text-xs font-normal text-text-secondary">km/s</span></div>
          <div className="text-[10px] text-text-secondary mt-0.5">Hızlı Plazma Akışı</div>
        </div>

        <div className="rounded-2xl bg-background/50 p-3.5 border border-card-border/60">
          <div className="flex items-center gap-1.5 text-text-secondary text-[10px] mb-1">
            <Zap size={12} className="text-accent" /> PROTON YOĞUNLUĞU
          </div>
          <div className="text-lg font-black text-accent">{weather.solarWindDensity} <span className="text-xs font-normal text-text-secondary">p/cm³</span></div>
          <div className="text-[10px] text-text-secondary mt-0.5">Partikül Konsantrasyonu</div>
        </div>

        <div className="rounded-2xl bg-background/50 p-3.5 border border-card-border/60">
          <div className="flex items-center gap-1.5 text-text-secondary text-[10px] mb-1">
            <AlertTriangle size={12} className="text-yellow-400" /> FLARE AKTİVİTESİ
          </div>
          <div className="text-lg font-black text-yellow-300">{weather.flareClass}</div>
          <div className="text-[10px] text-text-secondary mt-0.5">X-Ray Radyasyon Sınıfı</div>
        </div>

        <div className="rounded-2xl bg-background/50 p-3.5 border border-card-border/60">
          <div className="flex items-center gap-1.5 text-text-secondary text-[10px] mb-1">
            <ShieldCheck size={12} className="text-secondary" /> KUTUP IŞIĞI (AURORA)
          </div>
          <div className="text-lg font-black text-secondary">{weather.auroraChance.split(' ')[0]}</div>
          <div className="text-[10px] text-text-secondary mt-0.5 truncate">{weather.auroraChance.split(' ')[1]}</div>
        </div>
      </div>
    </div>
  );
}
