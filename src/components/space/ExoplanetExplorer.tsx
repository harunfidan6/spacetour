'use client';

import React, { useState, useRef, useEffect } from 'react';
import { EXOPLANETS, Exoplanet } from '@/data/exoplanets';
import { Globe, Orbit, ShieldCheck, Thermometer, Wind, Sparkles, Compass } from 'lucide-react';

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
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.arc(cx, cy, 75, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Orbit path
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
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
    <div className="rounded-3xl border border-primary/30 bg-card-bg/75 p-6 backdrop-blur-md shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-card-border pb-3">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary animate-spin" style={{ animationDuration: '20s' }} />
          <div>
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider font-mono">
              Ötegezegen & Yaşanabilir Bölge Keşif Laboratuvarı
            </h3>
            <span className="text-[10px] text-text-secondary font-mono">GÜNEŞ DIŞI GEZEGENLER (EXOPLANETS)</span>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold">
          KEPLER, TESS & JAMES WEBB ARŞİVİ
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
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-background font-bold shadow-[0_0_20px_rgba(0,212,255,0.4)] scale-102'
                  : 'bg-background/60 text-text-secondary border border-card-border/60 hover:text-white'
              }`}
            >
              <span className="mr-1">{planet.emoji}</span> {planet.name}
            </button>
          );
        })}
      </div>

      {/* Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Orbit & Goldilocks Zone Canvas */}
        <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-card-border/60 relative">
          <canvas ref={canvasRef} className="w-full h-[240px] block" />
          <div className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-2 text-[10px] font-mono text-white/70 bg-black/60 px-2.5 py-1 rounded backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Yeşil Kuşak: Yaşanabilir Bölge (Sıvı Su Olasılığı)</span>
          </div>
        </div>

        {/* Right: Telemetry & Scientific Findings */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-card-border/40 pb-2">
            <div>
              <span className="text-[11px] font-mono text-text-secondary">YILDIZ: {selectedPlanet.hostStar}</span>
              <h4 className="text-2xl font-black text-foreground font-mono">{selectedPlanet.name}</h4>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                selectedPlanet.habitableZone
                  ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
                  : 'text-accent bg-accent/10 border-accent/30'
              }`}
            >
              {selectedPlanet.habitableZone ? '✓ YAŞANABİLİR BÖLGEDE' : '✗ AŞIRI EKSTREM'}
            </span>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed">
            {selectedPlanet.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-background/50 border border-card-border/50">
              <span className="text-[9px] text-text-secondary block">DÜNYA'YA MESAFE</span>
              <span className="font-bold text-foreground">{selectedPlanet.distanceLightYears} Işık Yılı</span>
            </div>

            <div className="p-2.5 rounded-xl bg-background/50 border border-card-border/50">
              <span className="text-[9px] text-text-secondary block">YIL SÜRESİ</span>
              <span className="font-bold text-primary">{selectedPlanet.orbitalPeriodDays} Gün</span>
            </div>

            <div className="p-2.5 rounded-xl bg-background/50 border border-card-border/50">
              <span className="text-[9px] text-text-secondary block">KÜTLE / ÇAP</span>
              <span className="font-bold text-foreground">{selectedPlanet.massEarth}x / {selectedPlanet.radiusEarth}x Dünya</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs font-mono space-y-1">
            <span className="text-[10px] text-primary font-bold block uppercase">ATMOSFER & SPEKTRUM</span>
            <p className="text-text-secondary">{selectedPlanet.atmosphere}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
