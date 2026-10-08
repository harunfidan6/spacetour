'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useInView } from '@/lib/useInView';
import { EXOPLANETS, Exoplanet } from '@/data/exoplanets';

// Ortak görünüm sınıfları
const TAB_BUTTON =
  'inline-flex min-h-9 items-center gap-2 border px-3 text-sm whitespace-nowrap transition-colors cursor-pointer';
const TAB_IDLE = 'border-line bg-ink text-paper/80 hover:border-paper/40 hover:text-paper';
const TAB_ACTIVE = 'border-solar bg-solar text-ink font-medium';
const STAT_LABEL = 'block text-sm text-paper/70';
const STAT_VALUE = 'mt-1 block font-mono text-base tabular-nums';

export function ExoplanetExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet>(EXOPLANETS[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visible = useInView(canvasRef);

  // Animated Goldilocks Orbit Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) return;
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
  }, [selectedPlanet, visible]);

  return (
    <div className="border border-line bg-ink p-4 sm:p-8 space-y-6">
      {/* Başlık */}
      <div className="border-b border-line pb-5">
        <h3 className="font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
          Ötegezegenler ve yaşanabilir bölge
        </h3>
        <p className="mt-1.5 text-sm text-paper/70">
          Güneş dışı gezegenler (exoplanets) · Kepler, TESS ve JWST arşivi
        </p>
      </div>

      {/* Exoplanet Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {EXOPLANETS.map((planet) => {
          const isActive = selectedPlanet.id === planet.id;
          return (
            <button
              key={planet.id}
              type="button"
              onClick={() => setSelectedPlanet(planet)}
              className={`${TAB_BUTTON} ${isActive ? TAB_ACTIVE : TAB_IDLE}`}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full border border-paper/40"
                style={{ backgroundColor: planet.color }}
              />
              <span>{planet.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
        {/* Left: Orbit & Goldilocks Zone Canvas */}
        <div className="lg:col-span-6">
          <div className="border border-line bg-ink-2 overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-[240px] block" />
          </div>
          <p className="mt-2 flex items-center gap-2 text-xs text-paper/70">
            <span className="h-2 w-2 shrink-0 bg-lime" />
            <span>Yeşil kuşak: yaşanabilir bölge (sıvı su olasılığı)</span>
          </p>
        </div>

        {/* Right: Telemetry & Scientific Findings */}
        <div className="lg:col-span-6 min-w-0 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <span className="block text-sm text-paper/70">
                Konak yıldız: {selectedPlanet.hostStar}
              </span>
              <h4 className="mt-1 font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
                {selectedPlanet.name}
              </h4>
            </div>
            <span
              className={`shrink-0 border px-2 py-0.5 text-xs font-medium ${
                selectedPlanet.habitableZone
                  ? 'text-lime border-lime/40'
                  : 'text-solar border-solar/40'
              }`}
            >
              {selectedPlanet.habitableZone ? '✓ Yaşanabilir bölgede' : '✗ Ekstrem koşullar'}
            </span>
          </div>

          <p className="text-base leading-relaxed text-paper/85">
            {selectedPlanet.description}
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-line pt-4 sm:grid-cols-3">
            <div>
              <span className={STAT_LABEL}>Dünya’ya mesafe</span>
              <span className={`${STAT_VALUE} text-paper`}>{selectedPlanet.distanceLightYears} Işık Yılı</span>
            </div>

            <div>
              <span className={STAT_LABEL}>Yıl süresi</span>
              <span className={`${STAT_VALUE} text-solar`}>{selectedPlanet.orbitalPeriodDays} Gün</span>
            </div>

            <div>
              <span className={STAT_LABEL}>Kütle / çap</span>
              <span className={`${STAT_VALUE} text-paper`}>{selectedPlanet.massEarth}x / {selectedPlanet.radiusEarth}x</span>
            </div>
          </div>

          <div className="border-t border-line pt-4">
            <span className="block text-sm font-medium text-solar">Atmosfer ve spektrum</span>
            <p className="mt-1.5 text-sm leading-relaxed text-paper/80">{selectedPlanet.atmosphere}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
