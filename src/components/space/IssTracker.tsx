'use client';

import React, { useState, useEffect } from 'react';
import {
  Satellite,
  Compass,
  Activity,
  Eye,
  Clock,
  Sparkles
} from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

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
    <div className="relative ticks border border-line bg-ink p-6 sm:p-8 space-y-5">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <Satellite className="h-4 w-4 text-solar animate-pulse" />
          <h3 className="display display-tight text-xl text-paper sm:text-2xl">
            ISS · Uluslararası Uzay İstasyonu Canlı Yörüngesi
          </h3>
        </div>
        <span className="flex items-center gap-1.5 border border-lime/30 bg-lime/10 px-2.5 py-1 text-[10px] font-mono text-lime font-bold uppercase tracking-wider">
          <span className="h-1.5 w-1.5 bg-lime animate-ping" />
          YÖRÜNGEDE 7 ASTRONOT
        </span>
      </div>

      {/* Real-time Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-ink-2 p-3 border border-line">
          <span className="text-[10px] text-muted block uppercase tracking-wider">ENLEM</span>
          <span className="text-base font-bold text-paper mt-0.5 block">
            {data.latitude >= 0 ? `${data.latitude}° K` : `${Math.abs(data.latitude)}° G`}
          </span>
        </div>

        <div className="bg-ink-2 p-3 border border-line">
          <span className="text-[10px] text-muted block uppercase tracking-wider">BOYLAM</span>
          <span className="text-base font-bold text-paper mt-0.5 block">
            {data.longitude >= 0 ? `${data.longitude}° D` : `${Math.abs(data.longitude)}° B`}
          </span>
        </div>

        <div className="bg-ink-2 p-3 border border-line">
          <span className="text-[10px] text-muted block uppercase tracking-wider">İRTİFA</span>
          <span className="text-base font-bold text-solar mt-0.5 block">{data.altitude} km</span>
        </div>

        <div className="bg-ink-2 p-3 border border-line">
          <span className="text-[10px] text-muted block uppercase tracking-wider">HIZ</span>
          <span className="text-base font-bold text-paper mt-0.5 block">{data.velocity.toLocaleString()} km/s</span>
        </div>
      </div>

      {/* Visible Passes for Turkish Cities Section */}
      <div className="border border-line bg-ink-2 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-line pb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-paper">
            <Eye size={14} className="text-solar" />
            <span className="uppercase tracking-wider">Türkiye Üzerinden Çıplak Gözle Geçiş Tahmini</span>
          </div>

          {/* City selector pills */}
          <div className="flex items-center gap-1 text-[11px] font-mono">
            {Object.keys(TURKEY_CITY_PASSES).map((cityName) => (
              <button
                key={cityName}
                onClick={() => setSelectedCity(cityName)}
                className={`px-2 py-0.5 border text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedCity === cityName
                    ? 'border-solar bg-solar text-ink font-bold'
                    : 'border-transparent text-muted hover:text-paper'
                }`}
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>

        {/* Selected City Pass Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-muted block uppercase tracking-wider">SIRADAKİ GÖRÜNÜR GEÇİŞ</span>
            <span className="text-sm font-bold text-paper flex items-center gap-1.5 mt-1">
              <Clock size={12} className="text-solar" />
              {cityPass.nextPassTime}
            </span>
            <span className="text-[10px] text-solar block mt-1">Süre: {cityPass.duration}</span>
          </div>

          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-muted block uppercase tracking-wider">GÖRÜNÜR PARLAKLIK</span>
            <span className="text-sm font-bold text-paper flex items-center gap-1.5 mt-1">
              <Sparkles size={12} className="text-solar" />
              {cityPass.brightness}
            </span>
            <span className="text-[10px] text-muted block mt-1">Yükseklik: {cityPass.maxElevation}</span>
          </div>

          <div className="p-3 bg-ink border border-line">
            <span className="text-[10px] text-muted block uppercase tracking-wider">GÖKYÜZÜ ROTASI</span>
            <span className="text-xs font-bold text-paper flex items-center gap-1.5 mt-1">
              <Compass size={12} className="text-lime" />
              {cityPass.direction}
            </span>
            <span className="text-[10px] text-muted block mt-1">Işıksız gökyüzünde net izlenir</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between text-xs text-muted pt-1 font-mono">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-solar" />
          <span>Optik Durum: <strong className="text-paper">{data.visibility}</strong></span>
        </div>
        <div>
          Dünya çevresinde bir tur: <strong className="text-paper">~92.7 dakika (Günde 16 gün doğumu)</strong>
        </div>
      </div>
    </div>
  );
}
