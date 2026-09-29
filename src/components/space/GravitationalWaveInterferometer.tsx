'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Volume2, VolumeX, Play, RotateCcw, Activity, Disc3 } from 'lucide-react';
import { Scramble } from '@/components/motion/primitives';

interface EventPreset {
  id: string;
  name: string;
  date: string;
  m1: number;
  m2: number;
  distMpc: number;
  desc: string;
  type: 'BBH' | 'BNS' | 'IMBH';
}

const PRESETS: EventPreset[] = [
  {
    id: 'gw150914',
    name: 'GW150914',
    date: '14 Eylül 2015',
    m1: 36,
    m2: 29,
    distMpc: 410,
    desc: 'İnsanlık tarihinin ilk doğrudan kütleçekimsel dalga tespiti. 3 güneş kütlesi enerji uzayzaman dalgasına dönüştü.',
    type: 'BBH',
  },
  {
    id: 'gw170817',
    name: 'GW170817',
    date: '17 Ağustos 2017',
    m1: 1.46,
    m2: 1.27,
    distMpc: 40,
    desc: 'İlk çift nötron yıldızı birleşmesi. Gama ışını patlaması ve kilonova optik teleskoplarla da eşzamanlı gözlendi.',
    type: 'BNS',
  },
  {
    id: 'gw190521',
    name: 'GW190521',
    date: '21 Mayıs 2019',
    m1: 85,
    m2: 66,
    distMpc: 5300,
    desc: 'Kütle açığı bölgesinde ilk orta kütleli kara delik (142 M☉) oluşumu.',
    type: 'IMBH',
  },
];

export function GravitationalWaveInterferometer() {
  const [selectedPreset, setSelectedPreset] = useState<string>('gw150914');
  const [m1, setM1] = useState<number>(36);
  const [m2, setM2] = useState<number>(29);
  const [distance, setDistance] = useState<number>(410); // Mpc
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [activePolarization, setActivePolarization] = useState<'plus' | 'cross'>('plus');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Load preset
  const handleSelectPreset = (p: EventPreset) => {
    setSelectedPreset(p.id);
    setM1(p.m1);
    setM2(p.m2);
    setDistance(p.distMpc);
  };

  // Astrophysical calculations
  const totalMass = m1 + m2;
  // Chirp mass Mc = (m1*m2)^(3/5) / (m1+m2)^(1/5)
  const chirpMass = Math.pow(m1 * m2, 0.6) / Math.pow(totalMass, 0.2);
  // ISCO merger frequency in Hz: f_isco ~ 4396 / (M_total / M_sun)
  const fMerge = Math.min(Math.round(4396 / totalMass), 2000);
  // Starting frequency ~ 35 Hz
  const fStart = Math.min(35, Math.max(15, Math.round(fMerge * 0.15)));
  // Radiated energy ~ 0.05 * totalMass (in M_sun * c^2)
  const radiatedEnergy = (0.052 * totalMass).toFixed(1);
  // Peak strain estimate h_peak ~ (4 * G * Mc / (c^2 * d))
  const peakStrainExp = Math.log10(m1 * m2 / distance) - 22.8;
  const peakStrainFormatted = `~10^${peakStrainExp.toFixed(1)}`;

  // Web Audio Chirp Sound Synthesis
  const playChirp = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      setIsPlayingSound(true);
      const now = ctx.currentTime;
      const duration = Math.min(1.8, Math.max(0.4, 25 / totalMass));

      // Main Oscillator (chirp frequency sweep)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Exponential frequency ramp from fStart to fMerge
      osc.frequency.setValueAtTime(Math.max(30, fStart), now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(60, fMerge), now + duration * 0.88);
      // Ringdown damping frequency
      osc.frequency.linearRampToValueAtTime(Math.max(50, fMerge * 0.8), now + duration);

      // Amplitude envelope (growing to peak at merger, rapid ringdown decay)
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.28, now + duration * 0.85);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);

      setTimeout(() => {
        setIsPlayingSound(false);
      }, duration * 1000);
    } catch {
      setIsPlayingSound(false);
    }
  }, [totalMass, fStart, fMerge]);

  // Live Canvas Waveform and Spacetime Metric Distortion Ring
  useEffect(() => {
    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.05;

      // 1. Draw Waveform
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.fillStyle = '#09090b';
          ctx.fillRect(0, 0, w, h);

          // Grid lines
          ctx.strokeStyle = 'rgba(239, 236, 230, 0.06)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, h / 2);
          ctx.lineTo(w, h / 2);
          ctx.stroke();

          // Chirp waveform path
          ctx.strokeStyle = '#d4ff3d';
          ctx.lineWidth = 2;
          ctx.beginPath();

          const cycles = 12;
          for (let x = 0; x < w; x++) {
            const progress = x / w;
            // Frequency grows quadratically towards the right
            const freq = (fStart / 10 + Math.pow(progress, 2.5) * (fMerge / 12)) * 0.4;
            // Amplitude grows towards merger then drops
            const env = progress < 0.88 
              ? Math.pow(progress, 1.8) * 0.85 + 0.08
              : Math.max(0, 0.93 - (progress - 0.88) * 7.5);

            const y = h / 2 + Math.sin(progress * cycles * Math.PI * 2 * freq - t * 4) * env * (h * 0.42);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Marker at merger point
          ctx.strokeStyle = '#ff5b22';
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(w * 0.88, 0);
          ctx.lineTo(w * 0.88, h);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // 2. Draw Spacetime Test Ring Distortion (h+ and hx)
      const ringCanvas = ringCanvasRef.current;
      if (ringCanvas) {
        const rCtx = ringCanvas.getContext('2d');
        if (rCtx) {
          const rw = ringCanvas.width;
          const rh = ringCanvas.height;
          const cx = rw / 2;
          const cy = rh / 2;
          const baseRadius = rw * 0.36;

          rCtx.fillStyle = '#09090b';
          rCtx.fillRect(0, 0, rw, rh);

          // Strain oscillation
          const strainVal = Math.sin(t * 3.5) * 0.28;

          // Plus polarization: stretches X, squeezes Y
          // Cross polarization: stretches at 45 deg
          rCtx.strokeStyle = 'rgba(239, 236, 230, 0.15)';
          rCtx.lineWidth = 1;
          rCtx.setLineDash([2, 4]);
          rCtx.beginPath();
          rCtx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
          rCtx.stroke();
          rCtx.setLineDash([]);

          // Distorted ring
          rCtx.strokeStyle = activePolarization === 'plus' ? '#d4ff3d' : '#ff5b22';
          rCtx.lineWidth = 2.5;
          rCtx.beginPath();

          const numPoints = 64;
          for (let i = 0; i <= numPoints; i++) {
            const theta = (i / numPoints) * Math.PI * 2;
            let rMod = 0;
            if (activePolarization === 'plus') {
              rMod = strainVal * Math.cos(2 * theta);
            } else {
              rMod = strainVal * Math.sin(2 * theta);
            }
            const currentR = baseRadius * (1 + rMod);
            const px = cx + Math.cos(theta) * currentR;
            const py = cy + Math.sin(theta) * currentR;

            if (i === 0) rCtx.moveTo(px, py);
            else rCtx.lineTo(px, py);
          }
          rCtx.closePath();
          rCtx.stroke();

          // Particle beads on the ring
          for (let i = 0; i < 16; i++) {
            const theta = (i / 16) * Math.PI * 2;
            let rMod = activePolarization === 'plus' ? strainVal * Math.cos(2 * theta) : strainVal * Math.sin(2 * theta);
            const currentR = baseRadius * (1 + rMod);
            const px = cx + Math.cos(theta) * currentR;
            const py = cy + Math.sin(theta) * currentR;

            rCtx.fillStyle = '#efece6';
            rCtx.beginPath();
            rCtx.arc(px, py, 3, 0, Math.PI * 2);
            rCtx.fill();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [fStart, fMerge, activePolarization]);

  return (
    <div className="border border-line bg-ink p-6 sm:p-8">
      {/* Header bar */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="border border-lime/30 bg-lime/10 px-2 py-0.5 font-mono text-[10px] text-lime font-bold uppercase tracking-wider">
              LIGO · VIRGO · KAGRA
            </span>
            <span className="label text-muted">2017 Nobel Fizik Ödülü</span>
          </div>
          <h3 className="display display-tight mt-2 text-2xl text-paper sm:text-3xl">
            Lazer İnterferometresi Kütleçekimsel Dalga Laboratuvarı
          </h3>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-paper/70">
            Uzayzaman dokusunda ışık hızında yayılan metrik dalgalanmalarını ($h_+, h_\times$) ve 
            karadelik birleşmelerinin &ldquo;kozmik cıvıltı&rdquo; sesini gerçek ses senteziyle deneyimle.
          </p>
        </div>

        {/* Chirp Audio Button */}
        <button
          type="button"
          onClick={playChirp}
          disabled={isPlayingSound}
          className={`flex items-center justify-center gap-2.5 border px-5 py-3 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
            isPlayingSound
              ? 'border-lime bg-lime text-ink font-black shadow-[0_0_25px_rgba(212,255,61,0.5)] scale-105'
              : 'border-solar bg-solar text-ink font-bold hover:bg-solar/90 shadow-[0_0_15px_rgba(255,91,34,0.3)]'
          }`}
        >
          {isPlayingSound ? (
            <>
              <Volume2 size={16} className="animate-bounce" />
              <span>Cıvıltı Çalıyor ({fStart}Hz → {fMerge}Hz)</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Cıvıltıyı Dinle (Chirp Sound)</span>
            </>
          )}
        </button>
      </div>

      {/* Preset selection tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelectPreset(p)}
            className={`border px-3.5 py-2 font-mono text-xs transition-colors cursor-pointer ${
              selectedPreset === p.id
                ? 'border-solar bg-solar/15 text-solar font-bold'
                : 'border-line bg-ink-2 text-paper/70 hover:border-paper/30 hover:text-paper'
            }`}
          >
            <span className="mr-2 text-[10px] opacity-70">[{p.type}]</span>
            {p.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSelectedPreset('custom')}
          className={`border px-3.5 py-2 font-mono text-xs transition-colors cursor-pointer ${
            selectedPreset === 'custom'
              ? 'border-lime bg-lime/15 text-lime font-bold'
              : 'border-line bg-ink-2 text-paper/70 hover:border-paper/30 hover:text-paper'
          }`}
        >
          Özel Birleşme Simülatörü
        </button>
      </div>

      {/* Main Grid: Visualizers + Sliders */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Left: Waveform & Metric ring */}
        <div className="space-y-6 lg:col-span-7">
          {/* Waveform monitor */}
          <div className="border border-line bg-ink-2 p-4">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-lime" />
                <span className="font-mono text-xs uppercase tracking-wider text-paper">
                  Gerinim Dalga Formu: h(t) [Time-Domain Chirp]
                </span>
              </div>
              <span className="font-mono text-[10px] text-solar">ISCO: {fMerge} Hz</span>
            </div>
            <div className="relative mt-3">
              <canvas
                ref={canvasRef}
                width={560}
                height={160}
                className="w-full h-36 bg-black border border-line"
              />
              <div className="absolute bottom-2 right-2 flex gap-3 font-mono text-[9px] text-muted bg-ink/80 px-2 py-1 border border-line">
                <span>Başlangıç: {fStart} Hz</span>
                <span className="text-solar">Birleşme: {fMerge} Hz</span>
              </div>
            </div>
          </div>

          {/* Spacetime Distortion Metric Quadrupole Ring */}
          <div className="border border-line bg-ink-2 p-4">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div className="flex items-center gap-2">
                <Disc3 size={14} className="text-solar" />
                <span className="font-mono text-xs uppercase tracking-wider text-paper">
                  Uzayzaman Metrik Salınımı: Kuadrupol Test Halkası
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setActivePolarization('plus')}
                  className={`px-2 py-0.5 font-mono text-[10px] border cursor-pointer ${
                    activePolarization === 'plus'
                      ? 'border-lime bg-lime/20 text-lime font-bold'
                      : 'border-line text-muted hover:text-paper'
                  }`}
                >
                  h+ (Plus)
                </button>
                <button
                  type="button"
                  onClick={() => setActivePolarization('cross')}
                  className={`px-2 py-0.5 font-mono text-[10px] border cursor-pointer ${
                    activePolarization === 'cross'
                      ? 'border-solar bg-solar/20 text-solar font-bold'
                      : 'border-line text-muted hover:text-paper'
                  }`}
                >
                  h× (Cross)
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-col sm:flex-row items-center gap-4">
              <canvas
                ref={ringCanvasRef}
                width={180}
                height={180}
                className="h-36 w-36 border border-line bg-black shrink-0"
              />
              <div className="text-xs leading-relaxed text-paper/70">
                <p>
                  Kütleçekimsel dalgalar enine (transverse) ve kuadrupoler polarizasyona sahiptir. 
                  Dalga ekrandan geçerken serbest parçacıklardan oluşan dairesel test halkasını 
                  <strong> {activePolarization === 'plus' ? 'dik eksenlerde (+)' : '45° çapraz eksenlerde (×)'}</strong> uzatıp daraltır.
                </p>
                <div className="mt-3 font-mono text-[10px] text-lime">
                  ΔL / L ≈ {peakStrainFormatted} · Uzunluk deformasyonu proton çapının 1/10.000’i kadar!
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sliders & Live Telemetry */}
        <div className="flex flex-col justify-between border border-line bg-ink-2 p-5 lg:col-span-5">
          <div>
            <div className="border-b border-line pb-3">
              <span className="label text-solar">İkili Kütle & Mesafe Parametreleri</span>
              <p className="mt-1 text-xs text-muted">Kütleleri değiştirerek dalga frekansı ve açığa çıkan enerjiyi hesapla.</p>
            </div>

            {/* Mass 1 Slider */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-paper/80">Birinci Cisim Kütlesi (M₁):</span>
                <span className="text-solar font-bold">{m1} M☉</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                step={1}
                value={m1}
                onChange={(e) => {
                  setM1(Number(e.target.value));
                  setSelectedPreset('custom');
                }}
                className="w-full accent-[var(--solar)] cursor-pointer"
              />
            </div>

            {/* Mass 2 Slider */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-paper/80">İkinci Cisim Kütlesi (M₂):</span>
                <span className="text-solar font-bold">{m2} M☉</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                step={1}
                value={m2}
                onChange={(e) => {
                  setM2(Number(e.target.value));
                  setSelectedPreset('custom');
                }}
                className="w-full accent-[var(--solar)] cursor-pointer"
              />
            </div>

            {/* Distance Slider */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-paper/80">Aydınlatma Mesafesi:</span>
                <span className="text-lime font-bold">{distance} Mpc ({Math.round(distance * 3.26)} Milyon Işık Yılı)</span>
              </div>
              <input
                type="range"
                min={10}
                max={3000}
                step={20}
                value={distance}
                onChange={(e) => {
                  setDistance(Number(e.target.value));
                  setSelectedPreset('custom');
                }}
                className="w-full accent-[var(--lime)] cursor-pointer"
              />
            </div>
          </div>

          {/* Telemetry output readout */}
          <div className="mt-6 border-t border-line pt-4">
            <span className="label text-muted">Astrofiziksel Telemetri Çıktısı</span>
            <dl className="mt-3 grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="border border-line bg-ink p-2.5">
                <dt className="text-[10px] text-muted">Toplam Kütle (M)</dt>
                <dd className="mt-1 text-paper font-bold">{totalMass} M☉</dd>
              </div>
              <div className="border border-line bg-ink p-2.5">
                <dt className="text-[10px] text-muted">Cıvıltı Kütlesi (ℳ)</dt>
                <dd className="mt-1 text-lime font-bold">{chirpMass.toFixed(2)} M☉</dd>
              </div>
              <div className="border border-line bg-ink p-2.5">
                <dt className="text-[10px] text-muted">Birleşme Frekansı (f)</dt>
                <dd className="mt-1 text-solar font-bold">{fMerge} Hz</dd>
              </div>
              <div className="border border-line bg-ink p-2.5">
                <dt className="text-[10px] text-muted">Işınan Enerji (E=mc²)</dt>
                <dd className="mt-1 text-violet font-bold">~{radiatedEnergy} M☉ c²</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
