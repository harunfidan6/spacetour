'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useInView } from '@/lib/useInView';

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
  const visible = useInView(canvasRef);

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
    if (!canvas || !visible) return;
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
  }, [diameter, speed, megatonsTNT, visible]);

  return (
    <div className="border border-line bg-ink p-4 sm:p-8 space-y-8">
      {/* Header */}
      <div className="border-b border-line pb-6">
        <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
          Asteroit çarpışma simülatörü
        </h3>
        <p className="mt-1.5 text-sm text-paper/70">
          Kinetik enerji ve krater hesabı · gezegen savunma bilimi (NASA DART)
        </p>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-paper/80">
          Farklı çap ve hızlardaki göktaşlarının Dünya atmosferine girişinde açığa çıkaracağı nükleer eşdeğer enerjiyi ve şok dalgasını hesaplayın.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-3">
        <p className="text-sm text-paper/70">Tarihi ve olası asteroit senaryoları</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setDiameter(p.diameterM);
                setSpeed(p.speedKmS);
              }}
              className="min-h-9 border border-line bg-ink-2 px-3 py-1.5 text-left text-sm text-paper/85 transition-colors hover:bg-ink-3 hover:text-paper cursor-pointer"
            >
              {p.name}{' '}
              <span className="font-mono text-xs tabular-nums text-paper/70">({p.diameterM}m)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        <div className="min-w-0 space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-paper/80">Asteroit çapı</span>
            <span className="font-mono text-base font-semibold tabular-nums text-solar">
              {diameter >= 1000 ? `${(diameter / 1000).toFixed(1)} km` : `${diameter} metre`}
            </span>
          </div>
          <input aria-label="Asteroit çapı"
            type="range"
            min="10"
            max="10000"
            step="10"
            value={diameter}
            onChange={(e) => setDiameter(Number(e.target.value))}
            className="block h-8 w-full cursor-pointer bg-transparent accent-solar"
          />
          <span className="block text-xs text-paper/70">Min: 10m • Max: 10 km (küresel yok oluş)</span>
        </div>

        <div className="min-w-0 space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-paper/80">Giriş hızı</span>
            <span className="font-mono text-base font-semibold tabular-nums text-paper">{speed} km/s</span>
          </div>
          <input aria-label="Giriş hızı"
            type="range"
            min="11"
            max="72"
            step="1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="block h-8 w-full cursor-pointer bg-transparent accent-paper"
          />
          <span className="block text-xs text-paper/70">Tipik yörünge hızı: 15-30 km/s</span>
        </div>
      </div>

      {/* Impact Visualizer & Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        <div className="min-w-0 space-y-2 lg:col-span-6">
          <div className="overflow-hidden border border-line bg-black">
            <canvas ref={canvasRef} className="w-full h-[220px] block" />
          </div>
          <p className="text-xs text-paper/70">Kinetik patlama animasyonu</p>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:col-span-6">
          <div className="min-w-0 space-y-1 bg-ink p-4">
            <span className="block text-sm text-paper/70">Açığa çıkan enerji</span>
            <span className="block font-mono text-lg font-semibold tabular-nums text-solar">
              {megatonsTNT < 0.01 ? '<0.01 MT' : megatonsTNT.toLocaleString(undefined, { maximumFractionDigits: 1 })} Megaton
            </span>
            <span className="block font-mono text-xs tabular-nums text-paper/70">
              ~{hiroshimaEquiv.toLocaleString()}x Hiroşima
            </span>
          </div>

          <div className="min-w-0 space-y-1 bg-ink p-4">
            <span className="block text-sm text-paper/70">Krater çapı</span>
            <span className="block font-mono text-lg font-semibold tabular-nums text-paper">
              {craterDiameterKm < 1 ? `${Math.round(craterDiameterKm * 1000)} metre` : `${craterDiameterKm} km`}
            </span>
            <span className="block text-sm text-paper/70">Oluşacak kalıcı krater</span>
          </div>

          <div className="min-w-0 space-y-1 bg-ink p-4">
            <span className="block text-sm text-paper/70">Şok dalgası menzili</span>
            <span className="block font-mono text-lg font-semibold tabular-nums text-gold">
              {shockwaveRadiusKm} km
            </span>
            <span className="block text-sm text-paper/70">Binaları yıkan hava şoku</span>
          </div>

          <div className="min-w-0 space-y-1 bg-ink p-4">
            <span className="block text-sm text-paper/70">Tehlike düzeyi</span>
            <span
              className={`block text-base font-semibold ${
                diameter < 50
                  ? 'text-lime'
                  : diameter < 500
                  ? 'text-gold'
                  : diameter < 2000
                  ? 'text-solar'
                  : 'text-rose-signal'
              }`}
            >
              {diameter < 50
                ? 'Lokal hasar'
                : diameter < 500
                ? 'Bölgesel yıkım'
                : diameter < 2000
                ? 'Kıtasal felaket'
                : 'Küresel yok oluş'}
            </span>
            <span className="block text-sm text-paper/70">Torino ölçeği analizi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
