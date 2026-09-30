'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

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
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-solar">
            <Flame className="h-4 w-4 animate-pulse" />
            <span>KİNETİK ENERJİ & KRATER HESAPLAYICI</span>
          </div>
          <h3 className="display display-tight mt-3 text-[clamp(1.8rem,3.2vw,3rem)] text-paper">
            Asteroit <span className="serif-i text-solar">Çarpışma Simülatörü</span>
          </h3>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-paper/70">
            Farklı çap ve hızlardaki göktaşlarının Dünya atmosferine girişinde açığa çıkaracağı nükleer eşdeğer enerjiyi ve şok dalgasını hesaplayın.
          </p>
        </div>
        <span className="label text-solar bg-ink-2 border border-line px-3 py-1.5 shrink-0">
          GEZEGEN SAVUNMA BİLİMİ (NASA DART)
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2 font-mono text-xs">
        <span className="label text-muted">TARİHİ VE POTANSİYEL ASTEROİT SENARYOLARI:</span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setDiameter(p.diameterM);
                setSpeed(p.speedKmS);
              }}
              className="px-3 py-1.5 border border-line bg-ink-2 hover:bg-ink-3 text-paper/80 hover:text-paper whitespace-nowrap transition-colors cursor-pointer text-xs"
            >
              {p.name} ({p.diameterM}m)
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-line bg-line font-mono text-xs">
        <div className="p-5 bg-ink-2 space-y-3">
          <div className="flex justify-between items-center">
            <span className="label text-muted">ASTEROİT ÇAPI</span>
            <span className="display display-tight text-base font-bold text-solar">
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
            className="w-full accent-solar bg-ink h-1.5 cursor-pointer"
          />
          <span className="label text-[10px] text-muted block">Min: 10m • Max: 10 km (Küresel Yok Oluş)</span>
        </div>

        <div className="p-5 bg-ink-2 space-y-3">
          <div className="flex justify-between items-center">
            <span className="label text-muted">GİRİŞ HIZI</span>
            <span className="display display-tight text-base font-bold text-paper">{speed} km/s</span>
          </div>
          <input
            type="range"
            min="11"
            max="72"
            step="1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-paper bg-ink h-1.5 cursor-pointer"
          />
          <span className="label text-[10px] text-muted block">Tipik Yörünge Hızı: 15-30 km/s</span>
        </div>
      </div>

      {/* Impact Visualizer & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-6 border border-line bg-black relative overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-[220px] block" />
          <div className="pointer-events-none absolute top-3 left-4 flex items-center gap-1.5 label text-solar bg-ink/80 px-2 py-0.5 border border-line backdrop-blur-xs">
            <Flame size={12} />
            <span>KİNETİK PATLAMA ANİMASYONU</span>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-px border border-line bg-line text-xs font-mono">
          <div className="p-4 bg-ink space-y-1">
            <span className="label text-muted block">AÇIĞA ÇIKAN ENERJİ</span>
            <span className="display display-tight text-lg font-black text-solar block">
              {megatonsTNT < 0.01 ? '<0.01 MT' : megatonsTNT.toLocaleString(undefined, { maximumFractionDigits: 1 })} Megaton
            </span>
            <span className="label text-[10px] text-muted block">
              ~{hiroshimaEquiv.toLocaleString()}x Hiroşima
            </span>
          </div>

          <div className="p-4 bg-ink space-y-1">
            <span className="label text-muted block">KRATER ÇAPI</span>
            <span className="display display-tight text-lg font-black text-paper block">
              {craterDiameterKm < 1 ? `${Math.round(craterDiameterKm * 1000)} metre` : `${craterDiameterKm} km`}
            </span>
            <span className="label text-[10px] text-muted block">Oluşacak kalıcı krater</span>
          </div>

          <div className="p-4 bg-ink space-y-1">
            <span className="label text-muted block">ŞOK DALGASI MENZİLİ</span>
            <span className="display display-tight text-lg font-black text-gold block">
              {shockwaveRadiusKm} km
            </span>
            <span className="label text-[10px] text-muted block">Binaları yıkan hava şoku</span>
          </div>

          <div className="p-4 bg-ink space-y-1">
            <span className="label text-muted block">KÜRESEL TEHLİKE DÜZEYİ</span>
            <span
              className={`display display-tight text-sm font-bold block ${
                diameter < 50
                  ? 'text-lime'
                  : diameter < 500
                  ? 'text-gold'
                  : diameter < 2000
                  ? 'text-solar'
                  : 'text-rose-signal animate-pulse'
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
            <span className="label text-[10px] text-muted block">Torino Ölçeği Analizi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
