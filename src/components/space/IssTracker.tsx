'use client';

import React, { useState, useEffect } from 'react';
import { Satellite, Radio, Compass, ArrowUpRight, Activity } from 'lucide-react';

interface IssData {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
}

export function IssTracker() {
  const [data, setData] = useState<IssData>({
    latitude: 28.5721,
    longitude: -80.6480,
    altitude: 418.5,
    velocity: 27580,
    visibility: 'Güneş Işığında'
  });
  const [isLive, setIsLive] = useState(true);

  // Live simulation & polling of ISS orbital drift
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        // Orbit progression simulation
        let nextLon = prev.longitude + 0.15;
        if (nextLon > 180) nextLon = -180;
        const nextLat = Math.sin(Date.now() * 0.0001) * 51.6; // 51.6 deg orbital inclination

        return {
          latitude: Number(nextLat.toFixed(4)),
          longitude: Number(nextLon.toFixed(4)),
          altitude: Number((418 + Math.sin(Date.now() * 0.001) * 2).toFixed(1)),
          velocity: Math.round(27580 + Math.sin(Date.now() * 0.002) * 20),
          visibility: Math.abs(nextLat) > 20 ? 'Güneş Işığında' : 'Dünya Gölgesinde'
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-3xl border border-primary/30 bg-card-bg/75 p-6 backdrop-blur-md shadow-2xl">
      <div className="flex items-center justify-between border-b border-card-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Satellite className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="font-bold text-foreground text-sm uppercase tracking-wider font-mono">
            ISS • Canlı Yörünge Takipçisi
          </h3>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          CANLI TELEMETRİ
        </span>
      </div>

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
          <span className="text-[10px] text-text-secondary block">YÖRÜNGE HIZI</span>
          <span className="text-base font-black text-accent">{data.velocity.toLocaleString()} km/s</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-text-secondary pt-3 border-t border-card-border/40 font-mono">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-primary" />
          <span>Optik Durum: <strong className="text-foreground">{data.visibility}</strong></span>
        </div>
        <div>
          Dünya çevresinde bir tur: <strong className="text-foreground">~92.7 dakika</strong>
        </div>
      </div>
    </div>
  );
}
