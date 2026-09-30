'use client';

import React, { useState, useRef, useEffect } from 'react';
import { EXOPLANETS, Exoplanet } from '@/data/exoplanets';
import { Globe } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

export function ExoplanetExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet>(EXOPLANETS[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated Goldilocks Orbit Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    const height = (canvas.height = 240);

    const render = () => {
      angle += 0.02;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Dark space bg
      ctx.fillStyle = '#060614';
      ctx.fillRect(0, 0, width, height);

      // Star in center
      const starGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 35);
      starGrad.addColorStop(0, '#ffffff');
      starGrad.addColorStop(0.3, selectedPlanet.color);
      starGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = starGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 35, 0, Math.PI * 2);
      ctx.fill();

      // Habitable zone ring (Green band)
      if (selectedPlanet.habitableZone) {
        ctx.strokeStyle = 'rgba(212, 255, 61, 0.25)';
        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.arc(cx, cy, 75, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Orbit path
      ctx.strokeStyle = 'rgba(239, 236, 230, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 75, 0, Math.PI * 2);
      ctx.stroke();

      // Exoplanet moving
      const px = cx + Math.cos(angle) * 75;
      const py = cy + Math.sin(angle) * 75;

      ctx.fillStyle = selectedPlanet.color;
      ctx.shadowColor = selectedPlanet.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [selectedPlanet]);

  return (
    <div className="relative ticks border border-line bg-ink p-6 sm:p-8 space-y-6">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-solar animate-spin" style={{ animationDuration: '20s' }} />
          <div>
            <h3 className="display display-tight text-xl text-paper sm:text-2xl">
              Ötegezegen & Yaşanabilir Bölge Keşif Laboratuvarı
            </h3>
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
              GÜNEŞ DIŞI GEZEGENLER (EXOPLANETS)
            </span>
          </div>
        </div>
        <span className="font-mono text-[10px] px-2.5 py-1 border border-solar/30 bg-solar/10 text-solar font-bold uppercase tracking-wider">
          KEPLER · TESS · JWST ARŞİVİ
        </span>
      </div>

      {/* Exoplanet Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        {EXOPLANETS.map((planet) => {
          const isActive = selectedPlanet.id === planet.id;
          return (
            <button
              key={planet.id}
              onClick={() => setSelectedPlanet(planet)}
              className={`px-3 py-1.5 whitespace-nowrap transition-colors cursor-pointer border uppercase tracking-wider ${
                isActive
                  ? 'border-solar bg-solar text-ink font-bold'
                  : 'border-line bg-ink-2 text-muted hover:border-line hover:text-paper'
              }`}
            >
              <span className="mr-1.5">{planet.emoji}</span> {planet.name}
            </button>
          );
        })}
      </div>

      {/* Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Orbit & Goldilocks Zone Canvas */}
        <div className="lg:col-span-6 border border-line bg-ink-2 overflow-hidden relative">
          <canvas ref={canvasRef} className="w-full h-[240px] block" />
          <div className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-2 text-[10px] font-mono text-paper/80 bg-ink/80 px-2.5 py-1 border border-line backdrop-blur-xs">
            <span className="h-2 w-2 bg-lime" />
            <span>Yeşil Kuşak: Yaşanabilir Bölge (Sıvı Su Olasılığı)</span>
          </div>
        </div>

        {/* Right: Telemetry & Scientific Findings */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div>
              <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
                KONAK YILDIZ: {selectedPlanet.hostStar}
              </span>
              <h4 className="font-mono text-xl font-bold text-paper">{selectedPlanet.name}</h4>
            </div>
            <span
              className={`px-2.5 py-1 text-[11px] font-mono font-bold border uppercase tracking-wider ${
                selectedPlanet.habitableZone
                  ? 'text-lime bg-lime/10 border-lime/30'
                  : 'text-solar bg-solar/10 border-solar/30'
              }`}
            >
              {selectedPlanet.habitableZone ? '✓ YAŞANABİLİR BÖLGEDE' : '✗ AŞIRI EKSTREM'}
            </span>
          </div>

          <p className="text-xs text-muted leading-relaxed">
            {selectedPlanet.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-2.5 bg-ink-2 border border-line">
              <span className="text-[9px] text-muted block uppercase">Dünya’ya Mesafe</span>
              <span className="font-bold text-paper">{selectedPlanet.distanceLightYears} Işık Yılı</span>
            </div>

            <div className="p-2.5 bg-ink-2 border border-line">
              <span className="text-[9px] text-muted block uppercase">Yıl Süresi</span>
              <span className="font-bold text-solar">{selectedPlanet.orbitalPeriodDays} Gün</span>
            </div>

            <div className="p-2.5 bg-ink-2 border border-line">
              <span className="text-[9px] text-muted block uppercase">Kütle / Çap</span>
              <span className="font-bold text-paper">{selectedPlanet.massEarth}x / {selectedPlanet.radiusEarth}x</span>
            </div>
          </div>

          <div className="p-3 bg-ink-2 border border-line text-xs font-mono space-y-1">
            <span className="text-[10px] text-solar font-bold block uppercase tracking-wider">ATMOSFER & SPEKTRUM</span>
            <p className="text-muted leading-relaxed">{selectedPlanet.atmosphere}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
