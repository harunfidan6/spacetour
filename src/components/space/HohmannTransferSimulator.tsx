'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useInView } from '@/lib/useInView';
import {
  Rocket,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Compass
} from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

interface TargetDestination {
  id: string;
  name: string;
  distanceAU: number;
  periodYears: number;
  color: string;
  transferDays: number;
  deltaV1: number; // km/s departure from LEO/Earth orbit
  deltaV2: number; // km/s arrival orbit insertion
  synodicMonths: number; // launch window interval
  description: string;
  historicMission: string;
}

const DESTINATIONS: TargetDestination[] = [
  {
    id: 'mars',
    name: 'Mars (Kızıl Gezegen)',
    distanceAU: 1.524,
    periodYears: 1.88,
    color: 'var(--rose)',
    transferDays: 259,
    deltaV1: 2.94,
    deltaV2: 2.65,
    synodicMonths: 25.6,
    description: 'En popüler gezegenlerarası rota. NASA Perseverance ve ESA ExoMars görevlerinin kullandığı minimum enerjili transfer elipsi.',
    historicMission: 'Mars Pathfinder / Perseverance (2020)'
  },
  {
    id: 'venus',
    name: 'Venüs (Sabah Yıldızı)',
    distanceAU: 0.723,
    periodYears: 0.615,
    color: 'var(--gold)',
    transferDays: 146,
    deltaV1: 2.50,
    deltaV2: 2.71,
    synodicMonths: 19.2,
    description: 'Güneş’e doğru içe doğru düşüş rotası. Yörünge hızını düşürmek için retrograd yönlü kalkış itkisi gerektirir.',
    historicMission: 'Magellan / Venus Express'
  },
  {
    id: 'jupiter',
    name: 'Jüpiter (Gaz Devi)',
    distanceAU: 5.204,
    periodYears: 11.86,
    color: 'var(--paper)',
    transferDays: 997,
    deltaV1: 8.80,
    deltaV2: 5.64,
    synodicMonths: 13.1,
    description: 'Asteroit kuşağını aşan devasa elips. Doğrudan Hohmann transferi neredeyse 3 yıl sürer ve devasa yakıt itkisi ister.',
    historicMission: 'Galileo / Juno (Kütleçekim Sapanı Destekli)'
  },
  {
    id: 'mercury',
    name: 'Merkür (İç Eşik)',
    distanceAU: 0.387,
    periodYears: 0.241,
    color: 'var(--muted)',
    transferDays: 105,
    deltaV1: 7.53,
    deltaV2: 9.61,
    synodicMonths: 3.8,
    description: 'Güneş’in derin çekim kuyusuna iniş. Gezegene yaklaşıldığında yörüngeye girmek için aşırı yüksek frenleme delta-V’si şarttır.',
    historicMission: 'MESSENGER / BepiColombo'
  },
  {
    id: 'saturn',
    name: 'Satürn (Halkalı Dev)',
    distanceAU: 9.582,
    periodYears: 29.46,
    color: 'var(--gold)',
    transferDays: 2209,
    deltaV1: 10.29,
    deltaV2: 5.44,
    synodicMonths: 12.4,
    description: 'Dış güneş sistemine yolculuk. 6 yıllık saf eliptik uçuş süresi ve 15.7 km/s toplam delta-V gereksinimi.',
    historicMission: 'Cassini-Huygens (1997)'
  }
];

export function HohmannTransferSimulator() {
  const [selectedDest, setSelectedDest] = useState<TargetDestination>(DESTINATIONS[0]);
  const [flightProgress, setFlightProgress] = useState<number>(35); // 0 to 100%
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const visible = useInView(canvasRef);

  // Total delta-V
  const totalDeltaV = useMemo(() => {
    return (selectedDest.deltaV1 + selectedDest.deltaV2).toFixed(2);
  }, [selectedDest]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !visible) return;
    const interval = setInterval(() => {
      setFlightProgress((prev) => {
        if (prev >= 100) return 0;
        return Math.min(100, prev + 0.35);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying, visible]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localAnim = 0;

    const render = () => {
      localAnim = requestAnimationFrame(render);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Dark background
      ctx.fillStyle = '#06060c';
      ctx.fillRect(0, 0, w, h);

      // Orbital grid
      ctx.strokeStyle = '#1e1e24';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.arc(cx, cy, 90, 0, Math.PI * 2);
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.arc(cx, cy, 190, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs
      ctx.strokeStyle = '#1a1a20';
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Scale factor based on destination
      const maxAU = Math.max(selectedDest.distanceAU, 1.0);
      const radiusScale = (Math.min(w, h) * 0.42) / (maxAU * 1.15);

      const rEarth = 1.0 * radiusScale;
      const rTarget = selectedDest.distanceAU * radiusScale;

      // 1. Sun at Center
      ctx.fillStyle = '#ff5b22';
      ctx.shadowColor = '#ff5b22';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(cx, cy, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Sun label
      ctx.fillStyle = '#ff5b22';
      ctx.font = '10px monospace';
      ctx.fillText('GÜNEŞ', cx + 13, cy + 3);

      // 2. Earth Orbit (Departure)
      ctx.strokeStyle = 'rgba(122, 92, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, rEarth, 0, Math.PI * 2);
      ctx.stroke();

      // Earth at departure point (Angle 0, left side: -rEarth)
      const earthX = cx - rEarth;
      const earthY = cy;
      ctx.fillStyle = '#7a5cff';
      ctx.shadowColor = '#7a5cff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(earthX, earthY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#efece6';
      ctx.font = '10px monospace';
      ctx.fillText('Dünya (Kalkış)', earthX - 45, earthY - 10);

      // 3. Target Orbit (Arrival)
      ctx.strokeStyle = 'rgba(255, 61, 127, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, rTarget, 0, Math.PI * 2);
      ctx.stroke();

      // Target Planet at destination point (Angle 180°: +rTarget)
      const targetX = cx + rTarget;
      const targetY = cy;
      ctx.fillStyle = '#ff3d7f';
      ctx.shadowColor = '#ff3d7f';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(targetX, targetY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#efece6';
      ctx.fillText(`${selectedDest.name.split(' ')[0]} (Varış)`, targetX - 20, targetY - 12);

      // 4. Hohmann Transfer Ellipse Arc
      // Perihelion / Aphelion between rEarth and rTarget
      // Semi-major axis = (rEarth + rTarget) / 2
      // Ellipse center = cx + (rTarget - rEarth) / 2
      const a = (rEarth + rTarget) / 2;
      const c = Math.abs(rTarget - rEarth) / 2;
      const b = Math.sqrt(Math.max(1, a * a - c * c));

      // Center of ellipse
      const ellipseCenterX = selectedDest.distanceAU >= 1.0 ? cx + c : cx - c;

      // Draw transfer half-ellipse
      ctx.strokeStyle = '#d4ff3d';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      if (selectedDest.distanceAU >= 1.0) {
        ctx.ellipse(ellipseCenterX, cy, a, b, 0, Math.PI, 0, true);
      } else {
        ctx.ellipse(ellipseCenterX, cy, a, b, 0, 0, Math.PI, true);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. Spacecraft Probe Position along transfer arc
      const t = (flightProgress / 100) * Math.PI;
      const angle = selectedDest.distanceAU >= 1.0 ? Math.PI - t : t;
      const probeX = ellipseCenterX + a * Math.cos(angle);
      const probeY = cy - b * Math.sin(angle);

      // Probe trajectory trail
      ctx.strokeStyle = 'rgba(212, 255, 61, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      if (selectedDest.distanceAU >= 1.0) {
        ctx.ellipse(ellipseCenterX, cy, a, b, 0, Math.PI, angle, true);
      } else {
        ctx.ellipse(ellipseCenterX, cy, a, b, 0, 0, angle, true);
      }
      ctx.stroke();

      // Spacecraft Icon / Dot
      ctx.fillStyle = '#d4ff3d';
      ctx.shadowColor = '#d4ff3d';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(probeX, probeY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Velocity thrust vector arrow
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(probeX, probeY);
      const tangentAngle = angle + (selectedDest.distanceAU >= 1.0 ? -Math.PI / 2 : Math.PI / 2);
      ctx.lineTo(probeX + Math.cos(tangentAngle) * 16, probeY + Math.sin(tangentAngle) * 16);
      ctx.stroke();
    };

    render();

    return () => {
      if (localAnim) cancelAnimationFrame(localAnim);
    };
  }, [selectedDest, flightProgress, visible]);

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b border-line pb-6">
        <div>
          <div className="label flex items-center gap-2 text-violet">
            <span className="live-dot" /> Orbital Mekanik & Rota Optimizasyonu
          </div>
          <h3 className="display display-tight mt-3 text-[clamp(1.8rem,3.4vw,3.2rem)] text-paper">
            Hohmann transfer <span className="serif-i text-violet">& gezegenlerarası rota</span>
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/70">
            Walter Hohmann tarafından formüle edilen iki dairesel yörünge arasındaki minimum yakıt tüketimli eliptik transfer manevrası ve delta-V hesabı.
          </p>
        </div>

        <div className="label border border-line bg-ink-2 px-3 py-1.5 text-violet">
          Vis-Viva Denklemi · v² = μ(2/r - 1/a)
        </div>
      </div>

      {/* Destination Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px border border-line bg-line">
        {DESTINATIONS.map((d, idx) => {
          const isSelected = d.id === selectedDest.id;
          return (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDest(d);
                setFlightProgress(0);
              }}
              className={`p-4 text-left transition-colors cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-violet text-paper'
                  : 'bg-ink text-paper hover:bg-ink-3'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`label ${isSelected ? 'text-paper/70' : 'text-muted'}`}>
                  Rota 0{idx + 1}
                </span>
                <span className="label font-mono text-[10px]">
                  {d.distanceAU} AU
                </span>
              </div>
              <div className="display display-tight mt-3 text-base font-bold">
                {d.name.split(' (')[0]}
              </div>
              <div className={`label mt-1 text-[10px] ${isSelected ? 'text-paper/80' : 'text-muted'}`}>
                {d.transferDays} Gün Uçuş
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Simulation Deck (Canvas & Flight Computer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Trajectory Canvas (7 cols) */}
        <div className="lg:col-span-7 relative h-80 sm:h-[460px] w-full border border-line bg-black overflow-hidden">
          <canvas
            ref={canvasRef}
            width={700}
            height={460}
            className="w-full h-full block"
          />

          {/* Canvas HUD Overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none bg-ink/90 px-3 py-1.5 border border-line backdrop-blur">
            <Rocket className="h-3.5 w-3.5 text-lime animate-pulse" />
            <span className="label text-paper">
              Uçuş İlerlemesi: %{Math.round(flightProgress)} · Gün {Math.round((flightProgress / 100) * selectedDest.transferDays)}
            </span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="label px-3 py-1.5 bg-ink/90 border border-line text-paper backdrop-blur hover:bg-ink-3 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPlaying ? 'Durdur' : 'Uçur'}</span>
            </button>
            <button type="button" aria-label="Uçuşu başa sar"
              onClick={() => setFlightProgress(0)}
              className="label px-2.5 py-1.5 bg-ink/90 border border-line text-muted backdrop-blur hover:text-paper transition-colors cursor-pointer"
              title="Başa Sar"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          {/* Bottom Trajectory Legend */}
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between bg-ink/90 px-4 py-2 border border-line backdrop-blur pointer-events-none">
            <div className="flex items-center gap-3">
              <span className="label flex items-center gap-1.5 text-violet">
                <span className="h-1.5 w-1.5 rounded-full bg-violet" /> Dünya
              </span>
              <span className="label flex items-center gap-1.5 text-lime">
                <span className="h-1.5 w-1.5 rounded-full bg-lime" /> Transfer Elipsi
              </span>
              <span className="label flex items-center gap-1.5 text-rose-signal">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-signal" /> Hedef
              </span>
            </div>
            <span className="label text-muted hidden sm:inline">Minimum Yakıtlı Balistik Yörünge</span>
          </div>
        </div>

        {/* Flight Telemetry & Delta-V Computer (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Progress Slider */}
          <div className="border border-line bg-ink-2 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="label text-muted flex items-center gap-1.5">
                <Sliders size={13} className="text-violet" />
                Yörünge Konumunu Kaydır
              </span>
              <span className="label text-lime font-bold">
                %{Math.round(flightProgress)}
              </span>
            </div>

            <input aria-label="Uçuş ilerlemesi"
              type="range"
              min="0"
              max="100"
              step="1"
              value={flightProgress}
              onChange={(e) => {
                setFlightProgress(parseFloat(e.target.value));
                setIsPlaying(false);
              }}
              className="w-full accent-[var(--lime)] cursor-pointer h-1.5 bg-ink"
            />

            <div className="flex justify-between label text-[10px] text-muted">
              <span>Δv₁ Kalkış Yanışı</span>
              <span>Seyir Evresi</span>
              <span>Δv₂ Frenleme Yanışı</span>
            </div>
          </div>

          {/* Delta-V Budget Grid */}
          <div className="grid grid-cols-2 gap-px border border-line bg-line">
            <div className="bg-ink p-4">
              <span className="label text-muted">Δv₁ (Kalkış İtkisi)</span>
              <div className="display display-tight mt-2 text-2xl text-paper">
                {selectedDest.deltaV1.toFixed(2)} <span className="label text-xs">km/s</span>
              </div>
            </div>
            <div className="bg-ink p-4">
              <span className="label text-muted">Δv₂ (Varış Freni)</span>
              <div className="display display-tight mt-2 text-2xl text-paper">
                {selectedDest.deltaV2.toFixed(2)} <span className="label text-xs">km/s</span>
              </div>
            </div>
            <div className="bg-ink p-4">
              <span className="label text-muted">Toplam Δv Bütçesi</span>
              <div className="display display-tight mt-2 text-2xl text-lime">
                {totalDeltaV} <span className="label text-xs">km/s</span>
              </div>
            </div>
            <div className="bg-ink p-4">
              <span className="label text-muted">Uçuş Süresi</span>
              <div className="display display-tight mt-2 text-2xl text-violet">
                {selectedDest.transferDays} <span className="label text-xs">Gün</span>
              </div>
            </div>
          </div>

          {/* Synodic Launch Window Card */}
          <div className="border border-line bg-ink-2 p-5 space-y-2">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="label text-paper flex items-center gap-1.5">
                <Compass size={13} className="text-violet" />
                Fırlatma Penceresi (Sinodik Periyot)
              </span>
              <span className="label text-violet font-bold">
                {selectedDest.synodicMonths} Ayda Bir
              </span>
            </div>

            <p className="text-xs leading-relaxed text-paper/75 pt-1">
              Gezegenlerin Güneş etrafındaki bağıl konumlarının bu transfer elipsine izin verecek hizaya gelmesi her {selectedDest.synodicMonths} ayda bir tekrarlanır. Kaçırılırsa bir sonraki pencere beklenmelidir.
            </p>
          </div>

          {/* Historic Mission Badge */}
          <div className="border border-line bg-ink-2 p-4 flex items-center justify-between">
            <div>
              <span className="label text-muted">Tarihi Referans Görev</span>
              <div className="text-xs font-bold text-paper mt-0.5">{selectedDest.historicMission}</div>
            </div>
            <div className="label text-violet border border-violet/30 bg-ink px-2.5 py-1">
              Kanıtlanmış Yörünge
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
