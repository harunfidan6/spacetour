'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Flame, AlertTriangle, ShieldAlert, Sparkles, Activity, Crosshair } from 'lucide-react';

interface PresetAsteroid {
  name: string;
  diameterM: number;
  speedKmS: number;
  desc: string;
}

const PRESETS: PresetAsteroid[] = [
  { name: 'Çelyabinsk (2013)', diameterM: 20, speedKmS: 19, desc: 'Atmosferde patlayan süper-bolit. 1500 kişi yaralandı.' },
  { name: 'Tunguska (1908)', diameterM: 60, speedKmS: 20, desc: 'Sibirya’da 2.000 km² ormanı dümdüz eden hava patlaması.' },
  { name: 'Barringer Krateri (Arizona)', diameterM: 50, speedKmS: 12.8, desc: 'Demir-nikel göktaşı. 1.2 km çapında dev krater açtı.' },
  { name: 'Apophis (Potansiyel Tehdit)', diameterM: 340, speedKmS: 30, desc: 'Şehir yok edici sınıfında kıtasal felaket asteroiti.' },
  { name: 'Chicxulub (Dinozor Katili)', diameterM: 10000, speedKmS: 20, desc: '66 milyon yıl önce dinozorların neslini tüketen küresel yok oluş çarpması.' },
];

export function AsteroidImpactSimulator() {
  const [diameter, setDiameter] = useState<number>(340);
  const [speed, setSpeed] = useState<number>(25);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const radiusM = diameter / 2;
  const volumeM3 = (4 / 3) * Math.PI * Math.pow(radiusM, 3);
  const massKg = volumeM3 * 2800;
  const speedMS = speed * 1000;
  const energyJoules = 0.5 * massKg * Math.pow(speedMS, 2);
  const megatonsTNT = energyJoules / (4.184 * Math.pow(10, 15));
  const hiroshimaEquiv = Math.round(megatonsTNT / 0.015);
  const craterDiameterKm = Number((0.07 * Math.pow(megatonsTNT, 0.29)).toFixed(2));
  const shockwaveRadiusKm = Math.round(Math.pow(megatonsTNT, 0.33) * 6);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    const height = (canvas.height = 220);

    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.75;

      // Dark sci-fi grid background
      ctx.fillStyle = '#060610';
      ctx.fillRect(0, 0, width, height);

      // Ground curve
      ctx.fillStyle = '#111018';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 20, width * 0.7, 60, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 107, 53, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Shockwave pulses
      const pulseRadius = (t * 60) % (width * 0.5);
      const alpha = Math.max(0, 1 - pulseRadius / (width * 0.5));
      ctx.strokeStyle = `rgba(255, 107, 53, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy, pulseRadius, pulseRadius * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Fireball / Crater Center
      const fireballSize = Math.min(80, Math.max(20, Math.log10(megatonsTNT + 1) * 15));
      const fireGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, fireballSize);
      fireGrad.addColorStop(0, '#ffffff');
      fireGrad.addColorStop(0.3, '#ffcc00');
      fireGrad.addColorStop(0.7, '#ff3300');
      fireGrad.addColorStop(1, 'rgba(255,50,0,0)');
      ctx.fillStyle = fireGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, fireballSize, 0, Math.PI * 2);
      ctx.fill();

      // Target reticle
      ctx.strokeStyle = 'rgba(255,91,34, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, fireballSize + 25, 0, Math.PI * 2);
      ctx.stroke();

      // Ejected debris particles
      ctx.fillStyle = '#ff7733';
      for (let i = 0; i < 20; i++) {
        const pAngle = (i / 20) * Math.PI + Math.PI;
        const dist = ((t * 90 + i * 25) % (width * 0.35));
        const px = cx + Math.cos(pAngle) * dist;
        const py = cy + Math.sin(pAngle) * dist * 0.6;
        ctx.fillRect(px, py, 2.5, 2.5);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [diameter, speed, megatonsTNT]);

  return (
    <div className="rounded-3xl border border-accent/30 bg-card-bg/75 p-6 backdrop-blur-md shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border pb-3">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-accent animate-pulse" />
          <div>
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider font-mono">
              Kozmik Çarpışma & Asteroit Etki Simülatörü
            </h3>
            <span className="text-[10px] text-text-secondary font-mono">KİNETİK ENERJİ & KRATER HESAPLAYICI</span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 font-bold">
          GEZEGEN SAVUNMA BİLİMİ (NASA DART)
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-1.5 font-mono text-xs">
        <span className="text-[10px] text-text-secondary uppercase">TARİHİ VE POTANSİYEL ASTEROİT SENARYOLARI:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setDiameter(p.diameterM);
                setSpeed(p.speedKmS);
              }}
              className="px-3 py-1.5 rounded-xl bg-background/60 border border-card-border/60 hover:border-accent/50 text-text-secondary hover:text-paper whitespace-nowrap transition-all cursor-pointer"
            >
              {p.name} ({p.diameterM}m)
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-background/50 border border-card-border/60 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">ASTEROİT ÇAPI</span>
            <span className="text-base font-bold text-accent">
              {diameter >= 1000 ? `${(diameter / 1000).toFixed(1)} km` : `${diameter} metre`}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="10000"
            step="10"
            value={diameter}
            onChange={(e) => setDiameter(Number(e.target.value))}
            className="w-full accent-accent bg-accent/20 h-2 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-text-secondary block">Min: 10m • Max: 10 km (Küresel Yok Oluş)</span>
        </div>

        <div className="p-4 rounded-2xl bg-background/50 border border-card-border/60 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">GİRİŞ HIZI</span>
            <span className="text-base font-bold text-primary">{speed} km/s</span>
          </div>
          <input
            type="range"
            min="11"
            max="72"
            step="1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-primary bg-primary/20 h-2 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-text-secondary block">Tipik Yörünge Hızı: 15-30 km/s</span>
        </div>
      </div>

      {/* Impact Visualizer & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-card-border/60 relative">
          <canvas ref={canvasRef} className="w-full h-[220px] block" />
          <div className="pointer-events-none absolute top-3 left-4 flex items-center gap-1.5 text-[10px] font-mono text-accent bg-ink/60 px-2 py-0.5 rounded backdrop-blur-xs">
            <Flame size={12} />
            <span>KİNETİK PATLAMA ANİMASYONU</span>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-background/60 border border-card-border/60">
            <span className="text-[10px] text-text-secondary block">AÇIĞA ÇIKAN ENERJİ</span>
            <span className="text-lg font-black text-accent block mt-0.5">
              {megatonsTNT < 0.01 ? '<0.01 MT' : megatonsTNT.toLocaleString(undefined, { maximumFractionDigits: 1 })} Megaton
            </span>
            <span className="text-[10px] text-text-secondary block mt-1">
              ~{hiroshimaEquiv.toLocaleString()}x Hiroşima Bombası
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-background/60 border border-card-border/60">
            <span className="text-[10px] text-text-secondary block">KRATER ÇAPI</span>
            <span className="text-lg font-black text-foreground block mt-0.5">
              {craterDiameterKm < 1 ? `${Math.round(craterDiameterKm * 1000)} metre` : `${craterDiameterKm} km`}
            </span>
            <span className="text-[10px] text-text-secondary block mt-1">Oluşacak kalıcı krater</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-background/60 border border-card-border/60">
            <span className="text-[10px] text-text-secondary block">ŞOK DALGASI MENZİLİ</span>
            <span className="text-lg font-black text-yellow-400 block mt-0.5">
              {shockwaveRadiusKm} km
            </span>
            <span className="text-[10px] text-text-secondary block mt-1">Binaları yıkan hava şoku</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-background/60 border border-card-border/60">
            <span className="text-[10px] text-text-secondary block">KÜRESEL TEHLİKE DÜZEYİ</span>
            <span
              className={`text-sm font-bold block mt-1 ${
                diameter < 50
                  ? 'text-lime'
                  : diameter < 500
                  ? 'text-yellow-400'
                  : diameter < 2000
                  ? 'text-accent'
                  : 'text-red-500 animate-pulse'
              }`}
            >
              {diameter < 50
                ? 'Lokal Hasar'
                : diameter < 500
                ? 'Bölgesel Yıkım'
                : diameter < 2000
                ? 'Kıtasal Felaket'
                : 'KÜRESEL YOK OLUŞ'}
            </span>
            <span className="text-[10px] text-text-secondary block mt-1">Torino Ölçeği Analizi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
