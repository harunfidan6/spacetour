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

// Ortak görünüm sınıfları
const DATA_LABEL = 'block text-sm text-paper/70';
const DATA_VALUE = 'mt-2 font-mono text-xl font-semibold tabular-nums leading-none sm:text-2xl';
const DATA_UNIT = 'text-sm font-normal text-paper/70';

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
    <div className="border border-line bg-ink p-4 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Hohmann transferi ve gezegenlerarası rota
          </h3>
          <p className="mt-1.5 text-sm text-paper/70">Yörünge mekaniği ve rota optimizasyonu</p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-paper/80">
            Walter Hohmann tarafından formüle edilen iki dairesel yörünge arasındaki minimum yakıt tüketimli eliptik transfer manevrası ve delta-V hesabı.
          </p>
        </div>

        <p className="shrink-0 text-sm text-paper/70">
          Vis-viva denklemi:{' '}
          <span className="whitespace-nowrap font-mono text-paper/90">v² = μ(2/r - 1/a)</span>
        </p>
      </div>

      {/* Destination Selector Tabs */}
      <div className="choice-rail grid grid-cols-2 max-sm:fill-row-2 sm:grid-cols-3 sm:max-lg:fill-row-3 lg:grid-cols-5 lg:fill-row-5 gap-px border border-line bg-line">
        {DESTINATIONS.map((d) => {
          const isSelected = d.id === selectedDest.id;
          return (
            <button
              key={d.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setSelectedDest(d);
                setFlightProgress(0);
              }}
              className={`flex min-w-0 flex-col gap-1 p-4 text-left transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-violet text-paper'
                  : 'bg-ink text-paper hover:bg-ink-3'
              }`}
            >
              <span className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                <span className="font-display text-base font-semibold leading-tight sm:text-lg">
                  {d.name.split(' (')[0]}
                </span>
                <span className={`font-mono text-xs tabular-nums ${isSelected ? 'text-paper/85' : 'text-paper/70'}`}>
                  {d.distanceAU} AU
                </span>
              </span>
              <span className={`text-sm ${isSelected ? 'text-paper/85' : 'text-paper/70'}`}>
                <span className="font-mono tabular-nums">{d.transferDays}</span> gün uçuş
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Simulation Deck (Canvas & Flight Computer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Trajectory Canvas (7 cols) */}
        <div className="lg:col-span-7 min-w-0 space-y-3">
          {/* Flight status & controls */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-paper/70">
              <Rocket className="h-4 w-4 shrink-0 text-lime" />
              <span>Uçuş ilerlemesi</span>
              <span className="font-mono tabular-nums text-paper">
                %{Math.round(flightProgress)} · {Math.round((flightProgress / 100) * selectedDest.transferDays)}. gün
              </span>
            </p>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex h-9 items-center gap-1.5 border border-line bg-ink-2 px-3 text-sm text-paper hover:bg-ink-3 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? 'Durdur' : 'Uçur'}</span>
              </button>
              <button type="button" aria-label="Uçuşu başa sar"
                onClick={() => setFlightProgress(0)}
                className="inline-flex h-9 w-9 items-center justify-center border border-line bg-ink-2 text-paper/75 hover:text-paper transition-colors cursor-pointer"
                title="Başa sar"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          <div className="w-full border border-line bg-black overflow-hidden">
            <canvas
              ref={canvasRef}
              width={700}
              height={460}
              className="block h-auto w-full"
            />
          </div>

          {/* Trajectory Legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-paper/75">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-violet" /> Dünya
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-lime" /> Transfer elipsi
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-rose-signal" /> Hedef
            </span>
            <span className="text-paper/70 sm:ml-auto">Minimum yakıtlı balistik yörünge</span>
          </div>
        </div>

        {/* Flight Telemetry & Delta-V Computer (5 cols) */}
        <div className="lg:col-span-5 min-w-0 space-y-6">
          {/* Progress Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-sm text-paper/70">
                <Sliders size={14} className="shrink-0 text-violet" />
                Yörünge konumunu kaydır
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums text-lime">
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
              className="w-full accent-[var(--lime)] cursor-pointer"
            />

            <div className="flex justify-between gap-3 text-xs leading-snug text-paper/70">
              <span>Δv₁ kalkış yanışı</span>
              <span className="text-center">Seyir evresi</span>
              <span className="text-right">Δv₂ frenleme yanışı</span>
            </div>
          </div>

          {/* Delta-V Budget Grid */}
          <div className="grid grid-cols-2 gap-px border border-line bg-line">
            <div className="min-w-0 bg-ink p-4">
              <span className={DATA_LABEL}>Δv₁ (kalkış itkisi)</span>
              <div className={`${DATA_VALUE} text-paper`}>
                {selectedDest.deltaV1.toFixed(2)} <span className={DATA_UNIT}>km/s</span>
              </div>
            </div>
            <div className="min-w-0 bg-ink p-4">
              <span className={DATA_LABEL}>Δv₂ (varış freni)</span>
              <div className={`${DATA_VALUE} text-paper`}>
                {selectedDest.deltaV2.toFixed(2)} <span className={DATA_UNIT}>km/s</span>
              </div>
            </div>
            <div className="min-w-0 bg-ink p-4">
              <span className={DATA_LABEL}>Toplam Δv bütçesi</span>
              <div className={`${DATA_VALUE} text-lime`}>
                {totalDeltaV} <span className={DATA_UNIT}>km/s</span>
              </div>
            </div>
            <div className="min-w-0 bg-ink p-4">
              <span className={DATA_LABEL}>Uçuş süresi</span>
              <div className={`${DATA_VALUE} text-violet`}>
                {selectedDest.transferDays} <span className={DATA_UNIT}>gün</span>
              </div>
            </div>
          </div>

          {/* Synodic Launch Window */}
          <div className="border-t border-line pt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="flex items-center gap-1.5 text-sm font-medium text-paper">
                <Compass size={14} className="shrink-0 text-violet" />
                Fırlatma penceresi (sinodik periyot)
              </span>
              <span className="text-sm text-violet">
                <span className="font-mono tabular-nums">{selectedDest.synodicMonths}</span> ayda bir
              </span>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-paper/80">
              Gezegenlerin Güneş etrafındaki bağıl konumlarının bu transfer elipsine izin verecek hizaya gelmesi her {selectedDest.synodicMonths} ayda bir tekrarlanır. Kaçırılırsa bir sonraki pencere beklenmelidir.
            </p>
          </div>

          {/* Historic Mission */}
          <div className="border-t border-line pt-5">
            <span className="block text-sm text-paper/70">Tarihi referans görev · kanıtlanmış yörünge</span>
            <div className="mt-1 text-base font-medium text-paper">{selectedDest.historicMission}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
