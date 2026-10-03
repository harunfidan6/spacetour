'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useInView } from '@/lib/useInView';
import { Orbit, Play, Pause } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

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
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-rose-signal">
            <Orbit className="h-4 w-4" /> Ötegezegen Keşif & Fotometri Laboratuvarı
          </div>
          <h3 className="display display-tight mt-3 text-[clamp(1.8rem,3.4vw,3.2rem)] text-paper">
            Transit ışık eğrisi <span className="serif-i text-rose-signal">& ötegezegen avı</span>
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper/70">
            Bir ötegezegen ana yıldızının önünden geçerken yıldızın görünen parlaklığında periyodik mikroskobik düşüşler yaratır. Bu transit derinliği doğrudan gezegenin yarıçapını ve atmosferik bileşimini açığa çıkarır.
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-3 border border-line bg-ink-2 px-4 py-2 text-xs font-mono text-paper">
          <span className="live-dot" />
          <span>ΔF / F = (Rp / R*)² Simülatörü</span>
        </div>
      </div>

      {/* Exoplanet Presets Bar */}
      <div>
        <span className="label text-muted block mb-3">Tarihi Ötegezegen Keşif Referansları</span>
        <div className="grid grid-cols-2 max-sm:fill-row-2 sm:grid-cols-3 sm:max-lg:fill-row-3 lg:grid-cols-5 lg:fill-row-5 gap-px border border-line bg-line">
          {EXOPLANET_PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPreset.id;
            return (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset)}
                className={`p-3 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-rose-signal text-ink'
                    : 'bg-ink text-paper hover:bg-ink-3'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`label text-[10px] ${isSelected ? 'text-ink/80' : 'text-rose-signal'}`}>
                    {preset.distanceLy} ly
                  </span>
                  <span className={`label text-[9px] ${isSelected ? 'text-ink/70' : 'text-muted'}`}>
                    {preset.orbitalPeriodDays} gün
                  </span>
                </div>
                <div className="font-mono text-xs font-bold truncate">{preset.name}</div>
                <div className={`text-[10px] truncate ${isSelected ? 'text-ink/70' : 'text-muted'}`}>
                  {preset.starType}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual Simulation Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px border border-line bg-line">
        {/* Left: Star & Planet Disc Transit Canvas (6 cols) */}
        <div className="lg:col-span-6 bg-black p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between font-mono text-xs text-muted mb-3">
            <span>Yıldız Fotosferi & Transit Geometrisi</span>
            <span className="text-lime-signal">Canlı Optik Projeksiyon</span>
          </div>

          <div className="relative aspect-[4/3] w-full border border-line/40 overflow-hidden bg-ink/40">
            <canvas
              ref={transitCanvasRef}
              width={560}
              height={420}
              className="w-full h-full"
            />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-line pt-3 font-mono text-xs">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-3 py-1.5 border border-line bg-ink-2 hover:bg-ink-3 text-paper transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5 text-rose-signal" /> : <Play className="h-3.5 w-3.5 text-lime-signal" />}
              <span>{isPlaying ? 'Durdur' : 'Oynat'}</span>
            </button>

            <span className="text-muted">
              Yarıçap Oranı (Rp/R*): <strong className="text-paper">{(radiusRatio * 100).toFixed(2)}%</strong>
            </span>
          </div>
        </div>

        {/* Right: Normalized Flux Light Curve Canvas (6 cols) */}
        <div className="lg:col-span-6 bg-black p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between font-mono text-xs text-muted mb-3">
            <span>Kepler / TESS Fotometrik Işık Eğrisi</span>
            <span className="text-rose-signal">
              Transit Düşüşü: %{maxTransitDepthPercent.toFixed(4)}
            </span>
          </div>

          <div className="relative aspect-[4/3] w-full border border-line/40 overflow-hidden bg-ink/40">
            <canvas
              ref={lightCurveCanvasRef}
              width={560}
              height={420}
              className="w-full h-full"
            />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-line pt-3 font-mono text-xs text-muted">
            <span>Minimum Akı: <strong>{(1 - maxTransitDepthPercent / 100).toFixed(4)} F₀</strong></span>
            <span className="text-rose-signal">Kepler 3. Yasası ile Yörünge Boyutu</span>
          </div>
        </div>
      </div>

      {/* Physics Sliders & Engineering Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-line bg-line">
        {/* Planet Radius Slider */}
        <div className="bg-ink p-5 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="label text-muted">Ötegezegen Yarıçapı (Rp)</span>
            <span className="text-paper font-bold">{planetRadiusEarth.toFixed(2)} R⊕ (Dünya)</span>
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
          <span className="text-[10px] font-mono text-muted block">0.5x Dünya ile 25x Jüpiter Boyutu</span>
        </div>

        {/* Star Radius Slider */}
        <div className="bg-ink p-5 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="label text-muted">Ana Yıldız Yarıçapı (R*)</span>
            <span className="text-paper font-bold">{starRadiusSolar.toFixed(2)} R☉ (Güneş)</span>
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
          <span className="text-[10px] font-mono text-muted block">0.1x Kırmızı Cüce ile 3.0x Mavi Dev</span>
        </div>

        {/* Impact Parameter Slider */}
        <div className="bg-ink p-5 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="label text-muted">Transit Çarpma Parametresi (b)</span>
            <span className="text-paper font-bold">{impactParameter.toFixed(2)}</span>
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
          <span className="text-[10px] font-mono text-muted block">0 = Tam Merkez, 0.9 = Kenar Sıyırma</span>
        </div>
      </div>

      {/* Target Technical Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px border border-line bg-line">
        <div className="lg:col-span-8 bg-ink p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <span className="label text-rose-signal">{selectedPreset.discoveryMethod}</span>
            <span className="label text-muted">{selectedPreset.hostStar}</span>
          </div>

          <h4 className="display display-tight text-3xl text-paper">
            {selectedPreset.name}
          </h4>
          <div className="serif-i text-base text-rose-signal">
            {selectedPreset.habitabilityStatus}
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-paper/75 pt-2">
            {selectedPreset.description}
          </p>
        </div>

        <div className="lg:col-span-4 bg-ink-2 p-6 sm:p-8 flex flex-col justify-between gap-4">
          <div>
            <span className="label text-muted block mb-3">Astrofiziksel Hesaplama</span>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-line/60 pb-2">
                <span className="text-muted">Işık Engelleme Oranı:</span>
                <span className="text-rose-signal font-bold">%{maxTransitDepthPercent.toFixed(4)}</span>
              </div>
              <div className="flex justify-between border-b border-line/60 pb-2">
                <span className="text-muted">Yörünge Periyodu:</span>
                <span className="text-paper">{selectedPreset.orbitalPeriodDays} Dünya Günü</span>
              </div>
              <div className="flex justify-between border-b border-line/60 pb-2">
                <span className="text-muted">Dünya’ya Mesafe:</span>
                <span className="text-paper">{selectedPreset.distanceLy} Işık Yılı</span>
              </div>
            </div>
          </div>

          <div className="border-l-2 border-rose-signal pl-3 py-1 font-mono text-[11px] text-muted">
            Transmisyon Spektroskopisi: Gezegen yıldızın önünden geçerken, yıldız ışığının bir kısmı gezegenin atmosfer gazlarından süzülür. Bu sayede Webb su, metan ve karbondioksit tespit edebilir.
          </div>
        </div>
      </div>
    </div>
  );
}
