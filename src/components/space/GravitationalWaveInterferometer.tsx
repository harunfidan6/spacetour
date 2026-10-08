'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useInView } from '@/lib/useInView';
import { Volume2, Play, Activity, Disc3 } from 'lucide-react';

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
  const visible = useInView(canvasRef);
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
    if (!visible) return;
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
            const rMod = activePolarization === 'plus' ? strainVal * Math.cos(2 * theta) : strainVal * Math.sin(2 * theta);
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
  }, [fStart, fMerge, activePolarization, visible]);

  return (
    <div className="border border-line bg-ink p-4 sm:p-8">
      {/* Başlık ve cıvıltı sesi */}
      <div className="flex flex-col gap-5 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
            Kütleçekimsel dalga laboratuvarı
          </h3>
          <p className="mt-1.5 text-sm text-paper/70">
            Lazer interferometresi · LIGO, Virgo, KAGRA · 2017 Nobel Fizik Ödülü
          </p>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-paper/80">
            Uzayzaman dokusunda ışık hızında yayılan metrik dalgalanmalarını (h+, h×) ve
            karadelik birleşmelerinin &ldquo;kozmik cıvıltı&rdquo; sesini gerçek ses senteziyle deneyimle.
          </p>
        </div>

        {/* Chirp Audio Button */}
        <button
          type="button"
          onClick={playChirp}
          disabled={isPlayingSound}
          className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border px-4 text-sm font-medium transition-colors cursor-pointer ${
            isPlayingSound
              ? 'border-lime bg-lime text-ink'
              : 'border-solar bg-solar text-ink hover:bg-solar/90'
          }`}
        >
          {isPlayingSound ? (
            <>
              <Volume2 size={16} className="shrink-0" />
              <span>
                Cıvıltı çalıyor (<span className="font-mono">{fStart} Hz → {fMerge} Hz</span>)
              </span>
            </>
          ) : (
            <>
              <Play size={16} className="shrink-0" />
              <span>Cıvıltıyı dinle (chirp)</span>
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
            className={`inline-flex min-h-9 items-center gap-2 border px-3 text-sm transition-colors cursor-pointer ${
              selectedPreset === p.id
                ? 'border-solar bg-solar/15 text-solar font-medium'
                : 'border-line bg-ink-2 text-paper/80 hover:border-paper/40 hover:text-paper'
            }`}
          >
            <span className="text-xs opacity-75">{p.type}</span>
            <span className="font-mono">{p.name}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSelectedPreset('custom')}
          className={`inline-flex min-h-9 items-center border px-3 text-sm transition-colors cursor-pointer ${
            selectedPreset === 'custom'
              ? 'border-lime bg-lime/15 text-lime font-medium'
              : 'border-line bg-ink-2 text-paper/80 hover:border-paper/40 hover:text-paper'
          }`}
        >
          Özel birleşme
        </button>
      </div>

      {/* Main Grid: Visualizers + Sliders */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left: Waveform & Metric ring */}
        <div className="min-w-0 space-y-8 lg:col-span-7">
          {/* Waveform monitor */}
          <div>
            <div className="flex items-center gap-2">
              <Activity size={16} className="shrink-0 text-lime" />
              <span className="text-sm font-medium text-paper">
                Gerinim dalga formu <span className="font-mono">h(t)</span> · zaman alanı
              </span>
            </div>
            <canvas
              ref={canvasRef}
              width={560}
              height={160}
              className="mt-3 block w-full h-36 bg-black border border-line"
            />
            <div className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm text-paper/70">
              <span>
                Başlangıç: <span className="font-mono text-paper/85">{fStart} Hz</span>
              </span>
              <span className="text-solar">
                Birleşme (ISCO): <span className="font-mono">{fMerge} Hz</span>
              </span>
            </div>
          </div>

          {/* Spacetime Distortion Metric Quadrupole Ring */}
          <div className="border-t border-line pt-6">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
              <div className="flex min-w-0 items-center gap-2">
                <Disc3 size={16} className="shrink-0 text-solar" />
                <span className="text-sm font-medium text-paper">
                  Uzayzaman salınımı: kuadrupol test halkası
                </span>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setActivePolarization('plus')}
                  className={`inline-flex min-h-9 items-center border px-3 text-sm transition-colors cursor-pointer ${
                    activePolarization === 'plus'
                      ? 'border-lime bg-lime/15 text-lime font-medium'
                      : 'border-line text-paper/75 hover:text-paper'
                  }`}
                >
                  h+ (plus)
                </button>
                <button
                  type="button"
                  onClick={() => setActivePolarization('cross')}
                  className={`inline-flex min-h-9 items-center border px-3 text-sm transition-colors cursor-pointer ${
                    activePolarization === 'cross'
                      ? 'border-solar bg-solar/15 text-solar font-medium'
                      : 'border-line text-paper/75 hover:text-paper'
                  }`}
                >
                  h× (cross)
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <canvas
                ref={ringCanvasRef}
                width={180}
                height={180}
                className="h-36 w-36 border border-line bg-black shrink-0"
              />
              <div className="min-w-0 text-sm leading-relaxed text-paper/80">
                <p>
                  Kütleçekimsel dalgalar enine (transverse) ve kuadrupoler polarizasyona sahiptir. 
                  Dalga ekrandan geçerken serbest parçacıklardan oluşan dairesel test halkasını 
                  <strong className="font-semibold text-paper"> {activePolarization === 'plus' ? 'dik eksenlerde (+)' : '45° çapraz eksenlerde (×)'}</strong> uzatıp daraltır.
                </p>
                <p className="mt-3">
                  <span className="font-mono text-lime">ΔL / L ≈ {peakStrainFormatted}</span>
                  {' · '}Uzunluk deformasyonu proton çapının 1/10.000’i kadar!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sliders & Live Telemetry */}
        <div className="flex min-w-0 flex-col justify-between border-t border-line pt-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
          <div>
            <div>
              <span className="text-base font-semibold text-paper">İkili kütle ve mesafe</span>
              <p className="mt-1 text-sm text-paper/80">Kütleleri değiştirerek dalga frekansı ve açığa çıkan enerjiyi hesapla.</p>
            </div>

            {/* Mass 1 Slider */}
            <div className="mt-5 space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-sm">
                <span className="text-paper/80">Birinci cisim kütlesi (M₁)</span>
                <span className="font-mono font-semibold text-solar">{m1} M☉</span>
              </div>
              <input aria-label="Birinci cisim kütlesi"
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
            <div className="mt-5 space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-sm">
                <span className="text-paper/80">İkinci cisim kütlesi (M₂)</span>
                <span className="font-mono font-semibold text-solar">{m2} M☉</span>
              </div>
              <input aria-label="İkinci cisim kütlesi"
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
            <div className="mt-5 space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-sm">
                <span className="text-paper/80">Aydınlatma mesafesi</span>
                <span>
                  <span className="font-mono font-semibold text-lime">{distance} Mpc</span>{' '}
                  <span className="text-paper/70">(<span className="font-mono">{Math.round(distance * 3.26)}</span> Milyon Işık Yılı)</span>
                </span>
              </div>
              <input aria-label="Aydınlatma mesafesi"
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
          <div className="mt-8 border-t border-line pt-5">
            <span className="text-sm font-medium text-paper/80">Hesaplanan değerler</span>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4">
              <div className="min-w-0">
                <dt className="text-sm text-paper/70">Toplam kütle (M)</dt>
                <dd className="mt-0.5 font-mono text-base font-semibold text-paper">{totalMass} M☉</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-sm text-paper/70">Cıvıltı kütlesi (ℳ)</dt>
                <dd className="mt-0.5 font-mono text-base font-semibold text-lime">{chirpMass.toFixed(2)} M☉</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-sm text-paper/70">Birleşme frekansı (f)</dt>
                <dd className="mt-0.5 font-mono text-base font-semibold text-solar">{fMerge} Hz</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-sm text-paper/70">Işınan enerji (E=mc²)</dt>
                <dd className="mt-0.5 font-mono text-base font-semibold text-violet">~{radiatedEnergy} M☉ c²</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
