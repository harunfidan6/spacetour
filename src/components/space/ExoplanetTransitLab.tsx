'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useInView } from '@/lib/useInView';
import { Play, Pause } from 'lucide-react';

// Ortak görünüm sınıfları (sakin okuma düzeni)
const SECTION_LABEL = 'text-sm font-medium text-paper/80';
const PANEL_HEAD = 'flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-3 text-sm';
const PANEL_FOOT =
  'mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-3 text-sm';
const SLIDER_HEAD = 'flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1';
const SLIDER_LABEL = 'text-sm text-paper/80';
const SLIDER_VALUE = 'font-mono text-sm font-semibold tabular-nums text-paper';
const SLIDER_HINT = 'block text-xs text-paper/70';
const STAT_ROW = 'flex items-baseline justify-between gap-3 border-b border-line/60 pb-2';

interface ExoplanetPreset {
  id: string;
  name: string;
  hostStar: string;
  starType: string;
  starRadiusSolar: number;
  starLuminositySolar: number;
  planetRadiusEarth: number;
  orbitalPeriodDays: number;
  distanceLy: number;
  habitabilityStatus: 'Yaşanabilir Bölge (Okyanus / Kayaç)' | 'Aşırı Sıcak Jüpiter (Gaz Devi)' | 'Süper-Dünya (Ilıman)' | 'Gelgit Kilidi / Radyasyon Riski';
  description: string;
  discoveryMethod: string;
}

const EXOPLANET_PRESETS: ExoplanetPreset[] = [
  {
    id: 'trappist-1e',
    name: 'TRAPPIST-1e',
    hostStar: 'TRAPPIST-1 (Ultra Soğuk Kırmızı Cüce)',
    starType: 'M8V Cüce',
    starRadiusSolar: 0.12,
    starLuminositySolar: 0.0005,
    planetRadiusEarth: 0.92,
    orbitalPeriodDays: 6.1,
    distanceLy: 39.5,
    habitabilityStatus: 'Yaşanabilir Bölge (Okyanus / Kayaç)',
    description: 'Dünya ile neredeyse aynı kütle ve yarıçapa sahip kayaç gezegen. Yıldızının yaşanabilir Goldilocks kuşağında bulunur ve yüzeyinde sıvı su okyanusları barındırma ihtimali en yüksek hedeftir.',
    discoveryMethod: 'Transit Fotometrisi (Spitzer & TRAPPIST)'
  },
  {
    id: 'k2-18b',
    name: 'K2-18b',
    hostStar: 'K2-18 (Kırmızı Cüce)',
    starType: 'M2.8V',
    starRadiusSolar: 0.41,
    starLuminositySolar: 0.023,
    planetRadiusEarth: 2.61,
    orbitalPeriodDays: 32.9,
    distanceLy: 124,
    habitabilityStatus: 'Süper-Dünya (Ilıman)',
    description: 'James Webb Uzay Teleskobu tarafından atmosferinde karbondioksit ve metan tespit edilen sub-Neptün. Altında küresel bir hidrojen atmosferi ve sıcak su okyanusu barındıran "Hycean Dünyası" adayıdır.',
    discoveryMethod: 'Kepler Uzay Teleskobu (K2 Görevi)'
  },
  {
    id: 'hd-209458b',
    name: 'HD 209458 b (Osiris)',
    hostStar: 'HD 209458 (Güneş Benzeri)',
    starType: 'G0V',
    starRadiusSolar: 1.15,
    starLuminositySolar: 1.6,
    planetRadiusEarth: 15.1, // ~1.38 Jupiter radii
    orbitalPeriodDays: 3.5,
    distanceLy: 159,
    habitabilityStatus: 'Aşırı Sıcak Jüpiter (Gaz Devi)',
    description: 'Astronomi tarihinde transit yöntemiyle gözlenen ve atmosferi (sodyum, karbon, oksijen) doğrudan spektroskopik olarak kanıtlanan ilk ötegezegendir. Yıldızının kavurucu sıcaklığı nedeniyle atmosferi uzaya buharlaşmaktadır.',
    discoveryMethod: 'Yer Konuşlu STARE & Keck Gözlemleri'
  },
  {
    id: 'kepler-22b',
    name: 'Kepler-22b',
    hostStar: 'Kepler-22 (Güneş Türü)',
    starType: 'G5V',
    starRadiusSolar: 0.98,
    starLuminositySolar: 0.79,
    planetRadiusEarth: 2.38,
    orbitalPeriodDays: 289.9,
    distanceLy: 635,
    habitabilityStatus: 'Yaşanabilir Bölge (Okyanus / Kayaç)',
    description: 'Güneş benzeri bir yıldızın yaşanabilir bölgesinde keşfedilen ilk gezegendir. Yörünge periyodu 290 gün olup Dünya’nın Güneş etrafındaki turuna en yakın ılıman gezegenlerden biridir.',
    discoveryMethod: 'Kepler Uzay Teleskobu Transit Verisi'
  },
  {
    id: 'wasp-12b',
    name: 'WASP-12b',
    hostStar: 'WASP-12 (Sarı-Beyaz Cüce)',
    starType: 'F-tipi',
    starRadiusSolar: 1.57,
    starLuminositySolar: 3.5,
    planetRadiusEarth: 21.3, // ~1.9 Jupiter radii
    orbitalPeriodDays: 1.09,
    distanceLy: 1410,
    habitabilityStatus: 'Gelgit Kilidi / Radyasyon Riski',
    description: 'Yıldızına sadece 3.4 milyon km mesafede dönen cehennem dünyası. Aşırı gelgit çekimi nedeniyle küre değil rugby topu gibi uzamıştır ve yıldızı tarafından her saniye 200 katrilyon ton maddesi yutulmaktadır.',
    discoveryMethod: 'SuperWASP Geniş Açı Transit Taraması'
  }
];

export function ExoplanetTransitLab() {
  const [selectedPreset, setSelectedPreset] = useState<ExoplanetPreset>(EXOPLANET_PRESETS[0]);
  const [planetRadiusEarth, setPlanetRadiusEarth] = useState<number>(EXOPLANET_PRESETS[0].planetRadiusEarth);
  const [starRadiusSolar, setStarRadiusSolar] = useState<number>(EXOPLANET_PRESETS[0].starRadiusSolar);
  const [impactParameter, setImpactParameter] = useState<number>(0.2); // 0 = central transit, 1 = grazing
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [transitPhase, setTransitPhase] = useState<number>(0); // -1.5 to +1.5

  const transitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const visible = useInView(transitCanvasRef);
  const lightCurveCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // When preset changes, update sliders
  const selectPreset = (preset: ExoplanetPreset) => {
    setSelectedPreset(preset);
    setPlanetRadiusEarth(preset.planetRadiusEarth);
    setStarRadiusSolar(preset.starRadiusSolar);
  };

  // Physical calculations:
  // Earth radius in solar radii = 1 / 109.2 ~ 0.00916
  const R_EARTH_IN_SOLAR = 0.009158;
  const Rp_solar = planetRadiusEarth * R_EARTH_IN_SOLAR;
  const radiusRatio = Rp_solar / starRadiusSolar;
  // Maximum transit depth: Delta F / F = (Rp / Rstar)^2
  const maxTransitDepthPercent = Math.min(100, Math.pow(radiusRatio, 2) * 100);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !visible) return;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setTransitPhase((prev) => {
        let next = prev + dt * 0.45;
        if (next > 1.8) next = -1.8;
        return next;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, visible]);

  // Render Star & Planet Transit Canvas
  useEffect(() => {
    const canvas = transitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Deep space backdrop
    ctx.fillStyle = '#06060c';
    ctx.fillRect(0, 0, w, h);

    // Star radius in pixels
    const starPx = Math.min(w, h) * 0.32;

    // Star corona / limb darkening gradient
    const starGrad = ctx.createRadialGradient(cx, cy, starPx * 0.1, cx, cy, starPx);
    starGrad.addColorStop(0, '#ffffff');
    starGrad.addColorStop(0.35, '#ffe599');
    starGrad.addColorStop(0.75, '#ffaa44');
    starGrad.addColorStop(0.95, '#e05511');
    starGrad.addColorStop(1, '#992200');

    // Star glow aura
    const auraGrad = ctx.createRadialGradient(cx, cy, starPx * 0.8, cx, cy, starPx * 1.5);
    auraGrad.addColorStop(0, 'rgba(255, 170, 68, 0.4)');
    auraGrad.addColorStop(0.6, 'rgba(255, 120, 34, 0.1)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, starPx * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Draw Star Disc
    ctx.fillStyle = starGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, starPx, 0, Math.PI * 2);
    ctx.fill();

    // Grid chords / measurement lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, starPx, 0, Math.PI * 2);
    ctx.stroke();

    // Planet transit chord y-level: cy + impactParameter * starPx
    const chordY = cy + impactParameter * starPx * 0.85;
    ctx.beginPath();
    ctx.moveTo(cx - starPx * 1.4, chordY);
    ctx.lineTo(cx + starPx * 1.4, chordY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Planet position along chord
    const planetX = cx + transitPhase * starPx * 1.35;
    const planetPx = Math.max(3, starPx * radiusRatio);

    // Draw Planet Disc (black silhouette against star)
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    ctx.arc(planetX, chordY, planetPx, 0, Math.PI * 2);
    ctx.fill();

    // Atmosphere thin rim glow if transiting
    ctx.strokeStyle = '#d4ff3d';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(planetX, chordY, planetPx, 0, Math.PI * 2);
    ctx.stroke();

    // Telemetry label
    ctx.fillStyle = '#8a8a9a';
    ctx.font = '10px monospace';
    ctx.fillText(`Yıldız: R = ${starRadiusSolar.toFixed(2)} R☉`, cx - starPx + 8, cy - starPx - 10);
    ctx.fillStyle = '#d4ff3d';
    ctx.fillText(`Ötegezegen: R = ${planetRadiusEarth.toFixed(2)} R⊕`, planetX - 30, chordY - planetPx - 8);
  }, [transitPhase, starRadiusSolar, planetRadiusEarth, impactParameter, radiusRatio]);

  // Render Light Curve Canvas
  useEffect(() => {
    const canvas = lightCurveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Dark background
    ctx.fillStyle = '#09090f';
    ctx.fillRect(0, 0, w, h);

    // Padding
    const padL = 60;
    const padR = 25;
    const padT = 30;
    const padB = 40;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    // Grid lines
    ctx.strokeStyle = '#1a1a24';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    for (let i = 0; i <= 4; i++) {
      const y = padT + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Y-Axis labels (Relative Flux F / F0)
    ctx.fillStyle = '#8a8a9a';
    ctx.font = '10px monospace';
    ctx.fillText('1.000', 12, padT + 4);
    ctx.fillText(`${(1.0 - maxTransitDepthPercent / 200).toFixed(4)}`, 12, padT + plotH / 2 + 4);
    ctx.fillText(`${(1.0 - maxTransitDepthPercent / 100).toFixed(4)}`, 12, padT + plotH + 4);

    // X-Axis labels
    ctx.fillText('-1.0 Yörünge Fazı', padL, h - 14);
    ctx.fillText('0.0 (Merkez)', padL + plotW / 2 - 30, h - 14);
    ctx.fillText('+1.0', w - padR - 25, h - 14);

    // Calculate light curve points
    ctx.strokeStyle = '#ff3d7f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const transitStart = -0.75;
    const transitEnd = 0.75;
    const ingressWidth = 0.18;

    for (let px = 0; px <= plotW; px++) {
      const phase = -1.5 + (px / plotW) * 3.0;
      let fluxDrop = 0;

      if (phase >= transitStart && phase <= transitEnd) {
        if (phase < transitStart + ingressWidth) {
          // Ingress curve
          const progress = (phase - transitStart) / ingressWidth;
          fluxDrop = maxTransitDepthPercent * progress;
        } else if (phase > transitEnd - ingressWidth) {
          // Egress curve
          const progress = (transitEnd - phase) / ingressWidth;
          fluxDrop = maxTransitDepthPercent * progress;
        } else {
          // Bottom full transit
          fluxDrop = maxTransitDepthPercent;
        }
      }

      const normY = padT + (fluxDrop / Math.max(0.01, maxTransitDepthPercent)) * (plotH * 0.85);
      const canvasX = padL + px;

      if (px === 0) ctx.moveTo(canvasX, normY);
      else ctx.lineTo(canvasX, normY);
    }
    ctx.stroke();

    // Draw live animated tracker marker
    const currPx = padL + ((transitPhase - (-1.5)) / 3.0) * plotW;
    if (currPx >= padL && currPx <= w - padR) {
      let currentDrop = 0;
      if (transitPhase >= transitStart && transitPhase <= transitEnd) {
        if (transitPhase < transitStart + ingressWidth) {
          currentDrop = maxTransitDepthPercent * ((transitPhase - transitStart) / ingressWidth);
        } else if (transitPhase > transitEnd - ingressWidth) {
          currentDrop = maxTransitDepthPercent * ((transitEnd - transitPhase) / ingressWidth);
        } else {
          currentDrop = maxTransitDepthPercent;
        }
      }
      const markerY = padT + (currentDrop / Math.max(0.01, maxTransitDepthPercent)) * (plotH * 0.85);

      // Vertical line
      ctx.strokeStyle = 'rgba(212, 255, 61, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(currPx, padT);
      ctx.lineTo(currPx, padT + plotH);
      ctx.stroke();

      // Dot
      ctx.fillStyle = '#d4ff3d';
      ctx.beginPath();
      ctx.arc(currPx, markerY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [transitPhase, maxTransitDepthPercent]);

  return (
    <div className="border border-line bg-ink p-4 sm:p-8 space-y-8">
      {/* Başlık */}
      <div className="border-b border-line pb-6">
        <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
          Transit ışık eğrisi ve ötegezegen avı
        </h3>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-paper/85">
          Bir ötegezegen ana yıldızının önünden geçerken yıldızın görünen parlaklığında periyodik mikroskobik düşüşler yaratır. Bu transit derinliği doğrudan gezegenin yarıçapını ve atmosferik bileşimini açığa çıkarır.
        </p>
        <p className="mt-2 text-sm text-paper/70">
          <span className="font-mono text-paper/85">ΔF / F = (Rp / R*)²</span> simülatörü
        </p>
      </div>

      {/* Hazır ötegezegenler */}
      <div>
        <div className={`${SECTION_LABEL} mb-3`}>Tarihi ötegezegen keşifleri</div>
        <div className="grid grid-cols-2 max-sm:fill-row-2 sm:grid-cols-3 sm:max-lg:fill-row-3 lg:grid-cols-5 lg:fill-row-5 gap-px border border-line bg-line">
          {EXOPLANET_PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPreset.id;
            return (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset)}
                className={`flex min-w-0 flex-col p-3 text-left transition-colors cursor-pointer sm:p-4 ${
                  isSelected
                    ? 'bg-rose-signal text-ink'
                    : 'bg-ink text-paper hover:bg-ink-3'
                }`}
              >
                <span className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 font-mono text-xs tabular-nums">
                  <span className={isSelected ? 'text-ink/85' : 'text-rose-signal'}>
                    {preset.distanceLy} ly
                  </span>
                  <span className={isSelected ? 'text-ink/85' : 'text-paper/70'}>
                    {preset.orbitalPeriodDays} gün
                  </span>
                </span>
                <span className="text-sm font-semibold leading-snug">{preset.name}</span>
                <span className={`text-xs ${isSelected ? 'text-ink/85' : 'text-paper/70'}`}>
                  {preset.starType}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual Simulation Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px border border-line bg-line">
        {/* Left: Star & Planet Disc Transit Canvas (6 cols) */}
        <div className="lg:col-span-6 bg-black p-4 sm:p-6 flex flex-col justify-between">
          <div className={PANEL_HEAD}>
            <span className="text-paper/80">Yıldız fotosferi ve transit geometrisi</span>
            <span className="text-xs text-lime-signal">Canlı görünüm</span>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <canvas
              ref={transitCanvasRef}
              width={560}
              height={420}
              className="w-full h-full"
            />
          </div>

          <div className={PANEL_FOOT}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex min-h-9 items-center gap-2 border border-line bg-ink-2 px-3 text-sm text-paper transition-colors hover:bg-ink-3 cursor-pointer"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5 text-rose-signal" /> : <Play className="h-3.5 w-3.5 text-lime-signal" />}
              <span>{isPlaying ? 'Durdur' : 'Oynat'}</span>
            </button>

            <span className="text-paper/70">
              Yarıçap oranı (Rp/R*):{' '}
              <strong className="font-mono font-semibold tabular-nums text-paper">{(radiusRatio * 100).toFixed(2)}%</strong>
            </span>
          </div>
        </div>

        {/* Right: Normalized Flux Light Curve Canvas (6 cols) */}
        <div className="lg:col-span-6 bg-black p-4 sm:p-6 flex flex-col justify-between">
          <div className={PANEL_HEAD}>
            <span className="text-paper/80">Kepler / TESS fotometrik ışık eğrisi</span>
            <span className="text-rose-signal">
              Transit düşüşü:{' '}
              <span className="font-mono tabular-nums">%{maxTransitDepthPercent.toFixed(4)}</span>
            </span>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <canvas
              ref={lightCurveCanvasRef}
              width={560}
              height={420}
              className="w-full h-full"
            />
          </div>

          <div className={`${PANEL_FOOT} text-paper/70`}>
            <span>
              Minimum akı:{' '}
              <strong className="font-mono font-semibold tabular-nums text-paper">{(1 - maxTransitDepthPercent / 100).toFixed(4)} F₀</strong>
            </span>
            <span>Kepler 3. yasası ile yörünge boyutu</span>
          </div>
        </div>
      </div>

      {/* Physics Sliders & Engineering Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-line bg-line">
        {/* Planet Radius Slider */}
        <div className="bg-ink p-4 sm:p-5 space-y-2">
          <div className={SLIDER_HEAD}>
            <span className={SLIDER_LABEL}>Ötegezegen yarıçapı (Rp)</span>
            <span className={SLIDER_VALUE}>{planetRadiusEarth.toFixed(2)} R⊕ (Dünya)</span>
          </div>
          <input aria-label="Ötegezegen yarıçapı"
            type="range"
            min="0.5"
            max="25"
            step="0.1"
            value={planetRadiusEarth}
            onChange={(e) => setPlanetRadiusEarth(parseFloat(e.target.value))}
            className="w-full h-2 bg-ink-3 appearance-none cursor-pointer accent-rose-signal"
          />
          <span className={SLIDER_HINT}>0.5x Dünya ile 25x Jüpiter boyutu</span>
        </div>

        {/* Star Radius Slider */}
        <div className="bg-ink p-4 sm:p-5 space-y-2">
          <div className={SLIDER_HEAD}>
            <span className={SLIDER_LABEL}>Ana yıldız yarıçapı (R*)</span>
            <span className={SLIDER_VALUE}>{starRadiusSolar.toFixed(2)} R☉ (Güneş)</span>
          </div>
          <input aria-label="Ana yıldız yarıçapı"
            type="range"
            min="0.1"
            max="3.0"
            step="0.05"
            value={starRadiusSolar}
            onChange={(e) => setStarRadiusSolar(parseFloat(e.target.value))}
            className="w-full h-2 bg-ink-3 appearance-none cursor-pointer accent-rose-signal"
          />
          <span className={SLIDER_HINT}>0.1x kırmızı cüce ile 3.0x mavi dev</span>
        </div>

        {/* Impact Parameter Slider */}
        <div className="bg-ink p-4 sm:p-5 space-y-2">
          <div className={SLIDER_HEAD}>
            <span className={SLIDER_LABEL}>Transit çarpma parametresi (b)</span>
            <span className={SLIDER_VALUE}>{impactParameter.toFixed(2)}</span>
          </div>
          <input aria-label="Transit çarpma parametresi"
            type="range"
            min="0"
            max="0.9"
            step="0.05"
            value={impactParameter}
            onChange={(e) => setImpactParameter(parseFloat(e.target.value))}
            className="w-full h-2 bg-ink-3 appearance-none cursor-pointer accent-rose-signal"
          />
          <span className={SLIDER_HINT}>0 = tam merkez, 0.9 = kenar sıyırma</span>
        </div>
      </div>

      {/* Target Technical Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px border border-line bg-line">
        <div className="lg:col-span-8 bg-ink p-4 sm:p-8 space-y-3">
          <h4 className="font-display text-xl font-semibold leading-tight text-paper sm:text-2xl">
            {selectedPreset.name}
          </h4>
          <div className="text-base text-rose-signal">
            {selectedPreset.habitabilityStatus}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-paper/70">
            <span>{selectedPreset.hostStar}</span>
            <span>{selectedPreset.discoveryMethod}</span>
          </div>

          <p className="text-base leading-relaxed text-paper/85 pt-2">
            {selectedPreset.description}
          </p>
        </div>

        <div className="lg:col-span-4 bg-ink-2 p-4 sm:p-8 flex flex-col justify-between gap-5">
          <div>
            <div className={`${SECTION_LABEL} mb-3`}>Astrofiziksel hesaplama</div>
            <div className="space-y-3 text-sm">
              <div className={STAT_ROW}>
                <span className="text-paper/70">Işık engelleme oranı</span>
                <span className="font-mono font-semibold tabular-nums text-rose-signal">%{maxTransitDepthPercent.toFixed(4)}</span>
              </div>
              <div className={STAT_ROW}>
                <span className="text-paper/70">Yörünge periyodu</span>
                <span className="text-right font-mono tabular-nums text-paper">{selectedPreset.orbitalPeriodDays} Dünya Günü</span>
              </div>
              <div className={STAT_ROW}>
                <span className="text-paper/70">Dünya’ya mesafe</span>
                <span className="text-right font-mono tabular-nums text-paper">{selectedPreset.distanceLy} Işık Yılı</span>
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-paper/80">
            <span className="font-medium text-paper">Transmisyon spektroskopisi:</span> Gezegen yıldızın önünden geçerken, yıldız ışığının bir kısmı gezegenin atmosfer gazlarından süzülür. Bu sayede Webb su, metan ve karbondioksit tespit edebilir.
          </p>
        </div>
      </div>
    </div>
  );
}
