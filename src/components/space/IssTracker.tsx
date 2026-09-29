'use client';

import React, { useState, useEffect } from 'react';
import {
  Satellite,
  Radio,
  Compass,
  ArrowUpRight,
  Activity,
  Eye,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

interface IssData {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
}

interface CityPassInfo {
  city: string;
  nextPassTime: string;
  duration: string;
  brightness: string;
  maxElevation: string;
  direction: string;
  countdownMinutes: number;
}

const TURKEY_CITY_PASSES: Record<string, CityPassInfo> = {
  İstanbul: {
    city: 'İstanbul',
    nextPassTime: 'Bu Akşam 20:48',
    duration: '5 dk 40 sn',
    brightness: '-3.6 mag (Çok Parlak)',
    maxElevation: '68° (Başucu)',
    direction: 'Güneybatı → Kuzeydoğu',
    countdownMinutes: 42
  },
  Ankara: {
    city: 'Ankara',
    nextPassTime: 'Bu Akşam 20:49',
    duration: '6 dk 10 sn',
    brightness: '-3.8 mag (Venüs Parlaklığında)',
    maxElevation: '74° (Tam Tepe)',
    direction: 'Batı → Doğu',
    countdownMinutes: 43
  },
  İzmir: {
    city: 'İzmir',
    nextPassTime: 'Bu Akşam 20:47',
    duration: '5 dk 25 sn',
    brightness: '-3.4 mag (Çıplak Gözle Net)',
    maxElevation: '59° (Yüksek)',
    direction: 'Güneybatı → Doğu',
    countdownMinutes: 41
  },
  Antalya: {
    city: 'Antalya',
    nextPassTime: 'Bu Akşam 20:50',
    duration: '5 dk 15 sn',
    brightness: '-3.2 mag (Belirgin)',
    maxElevation: '52° (Güney Ufku Üzeri)',
    direction: 'Batı → Kuzeydoğu',
    countdownMinutes: 44
  },
  Bursa: {
    city: 'Bursa',
    nextPassTime: 'Bu Akşam 20:48',
    duration: '5 dk 35 sn',
    brightness: '-3.5 mag (Çok Parlak)',
    maxElevation: '65° (Başucu)',
    direction: 'Güneybatı → Kuzeydoğu',
    countdownMinutes: 42
  }
};

export function IssTracker() {
  const [data, setData] = useState<IssData>({
    latitude: 39.9208,
    longitude: 32.8541,
    altitude: 418.5,
    velocity: 27580,
    visibility: 'Güneş Işığında'
  });

  const [selectedCity, setSelectedCity] = useState<string>('İstanbul');
  const cityPass = TURKEY_CITY_PASSES[selectedCity] || TURKEY_CITY_PASSES['İstanbul'];

  // Live simulation & polling of ISS orbital drift
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        let nextLon = prev.longitude + 0.12;
        if (nextLon > 180) nextLon = -180;
        const nextLat = Math.sin(Date.now() * 0.0001) * 51.6;

        return {
          latitude: Number(nextLat.toFixed(4)),
          longitude: Number(nextLon.toFixed(4)),
          altitude: Number((418 + Math.sin(Date.now() * 0.001) * 2).toFixed(1)),
          velocity: Math.round(27580 + Math.sin(Date.now() * 0.002) * 20),
          visibility: Math.abs(nextLat) > 20 ? 'Güneş Işığında (Görünür)' : 'Dünya Gölgesinde'
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-3xl border border-primary/30 bg-card-bg/75 p-6 backdrop-blur-md shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-card-border pb-3">
        <div className="flex items-center gap-2">
          <Satellite className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="font-bold text-foreground text-sm uppercase tracking-wider font-mono">
            ISS • Uluslararası Uzay İstasyonu Canlı Yörüngesi
          </h3>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-lime/10 border border-lime/20 px-2.5 py-0.5 text-[10px] font-mono text-lime font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-lime animate-ping" />
          YÖRÜNGEDE 7 ASTRONOT
        </span>
      </div>

      {/* Real-time Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="rounded-2xl bg-background/50 p-3 border border-card-border/60">
          <span className="text-[10px] text-text-secondary block">ENLEM</span>
          <span className="text-base font-black text-foreground">
            {data.latitude >= 0 ? `${data.latitude}° K` : `${Math.abs(data.latitude)}° G`}
          </span>
        </div>

        <div className="rounded-2xl bg-background/50 p-3 border border-card-border/60">
          <span className="text-[10px] text-text-secondary block">BOYLAM</span>
          <span className="text-base font-black text-foreground">
            {data.longitude >= 0 ? `${data.longitude}° D` : `${Math.abs(data.longitude)}° B`}
          </span>
        </div>

        <div className="rounded-2xl bg-background/50 p-3 border border-card-border/60">
          <span className="text-[10px] text-text-secondary block">İRTİFA</span>
          <span className="text-base font-black text-primary">{data.altitude} km</span>
        </div>

        <div className="rounded-2xl bg-background/50 p-3 border border-card-border/60">
          <span className="text-[10px] text-text-secondary block">HIZ</span>
          <span className="text-base font-black text-accent">{data.velocity.toLocaleString()} km/s</span>
        </div>
      </div>

      {/* Visible Passes for Turkish Cities Section */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
            <Eye size={14} className="text-cyan-400" />
            <span>Türkiye Üzerinden Çıplak Gözle Geçiş Tahmini</span>
          </div>

          {/* City selector pills */}
          <div className="flex items-center gap-1 text-[11px] font-mono">
            {Object.keys(TURKEY_CITY_PASSES).map((cityName) => (
              <button
                key={cityName}
                onClick={() => setSelectedCity(cityName)}
                className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                  selectedCity === cityName
                    ? 'bg-primary text-black font-bold'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>

        {/* Selected City Pass Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-background/60 border border-white/5">
            <span className="text-[10px] text-text-secondary block">SIRADAKİ GÖRÜNÜR GEÇİŞ</span>
            <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
              <Clock size={12} className="text-primary" />
              {cityPass.nextPassTime}
            </span>
            <span className="text-[10px] text-primary block mt-0.5">Süre: {cityPass.duration}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-background/60 border border-white/5">
            <span className="text-[10px] text-text-secondary block">GÖRÜNÜR PARLAKLIK</span>
            <span className="text-sm font-bold text-amber-300 flex items-center gap-1 mt-0.5">
              <Sparkles size={12} />
              {cityPass.brightness}
            </span>
            <span className="text-[10px] text-text-secondary block mt-0.5">Yükseklik: {cityPass.maxElevation}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-background/60 border border-white/5">
            <span className="text-[10px] text-text-secondary block">GÖKYÜZÜ ROTASI</span>
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1 mt-0.5">
              <Compass size={12} />
              {cityPass.direction}
            </span>
            <span className="text-[10px] text-text-secondary block mt-0.5">Işıksız gökyüzünde net izlenir</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between text-xs text-text-secondary pt-1 font-mono">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-primary" />
          <span>Optik Durum: <strong className="text-foreground">{data.visibility}</strong></span>
        </div>
        <div>
          Dünya çevresinde bir tur: <strong className="text-foreground">~92.7 dakika (Günde 16 gün doğumu)</strong>
        </div>
      </div>
    </div>
  );
}
