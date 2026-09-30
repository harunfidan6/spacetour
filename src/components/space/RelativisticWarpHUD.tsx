'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

interface RelativisticWarpHUDProps {
  isWarping: boolean;
  destinationName: string;
  destinationDistance: string;
}

export function RelativisticWarpHUD({
  isWarping,
  destinationName,
  destinationDistance
}: RelativisticWarpHUDProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [warpFactor, setWarpFactor] = useState<number>(0.1);
  const [lorentzGamma, setLorentzGamma] = useState<number>(1.0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [phaseText, setPhaseText] = useState<string>('UZAY-ZAMAN BÜKÜLMESİ');

  // Procedural Web Audio Warp Sound Generator
  useEffect(() => {
    if (!isWarping) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, now);
      master.gain.exponentialRampToValueAtTime(0.18, now + 0.3);
      master.gain.setValueAtTime(0.18, now + 1.6);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);
      master.connect(ctx.destination);

      // 1. Sub-bass engine spool-up (45Hz -> 240Hz)
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(45, now);
      subOsc.frequency.exponentialRampToValueAtTime(260, now + 1.2);
      subOsc.frequency.exponentialRampToValueAtTime(50, now + 2.2);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.7, now);
      subOsc.connect(subGain);
      subGain.connect(master);
      subOsc.start(now);
      subOsc.stop(now + 2.4);

      // 2. Relativistic wind / filtered noise burst
      const bufferSize = ctx.sampleRate * 2.3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(300, now);
      bandpass.frequency.exponentialRampToValueAtTime(2400, now + 1.1);
      bandpass.frequency.exponentialRampToValueAtTime(400, now + 2.1);
      bandpass.Q.setValueAtTime(3.5, now);

      whiteNoise.connect(bandpass);
      bandpass.connect(master);
      whiteNoise.start(now);
      whiteNoise.stop(now + 2.4);

      // 3. Drop-out bass impact at 1.9s
      const thumpOsc = ctx.createOscillator();
      thumpOsc.type = 'sine';
      thumpOsc.frequency.setValueAtTime(110, now + 1.85);
      thumpOsc.frequency.exponentialRampToValueAtTime(28, now + 2.25);
      const thumpGain = ctx.createGain();
      thumpGain.gain.setValueAtTime(0.001, now);
      thumpGain.gain.setValueAtTime(0.4, now + 1.85);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 2.3);
      thumpOsc.connect(thumpGain);
      thumpGain.connect(master);
      thumpOsc.start(now + 1.85);
      thumpOsc.stop(now + 2.35);

      return () => {
        try {
          ctx.close();
        } catch {
          // ignore
        }
      };
    } catch {
      // Audio autoplay policy fallback
    }
  }, [isWarping]);

  // Telemetry updates and relativistic calculation
  useEffect(() => {
    if (!isWarping) return;

    const startTime = performance.now();
    const duration = 2200; // ms

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      setProgressPercent(Math.round(progress * 100));

      if (progress < 0.25) {
        setPhaseText('METRİK GENLEŞME & SÜRÜCÜ ŞARJI');
        setWarpFactor(parseFloat((1.0 + progress * 16).toFixed(1)));
        setLorentzGamma(parseFloat((1.2 + progress * 40).toFixed(1)));
      } else if (progress < 0.75) {
        setPhaseText('HİPERUZAY AKIŞI · ALCUBIERRE TÜNELİ');
        setWarpFactor(parseFloat((8.5 + Math.random() * 1.4).toFixed(1)));
        setLorentzGamma(parseFloat((340 + Math.random() * 85).toFixed(1)));
      } else if (progress < 0.92) {
        setPhaseText('HEDEF ÇEVRESİNDE DESELERASYON');
        setWarpFactor(parseFloat((3.2 - (progress - 0.75) * 15).toFixed(1)));
        setLorentzGamma(parseFloat((50 - (progress - 0.75) * 200).toFixed(1)));
      } else {
        setPhaseText('YÖRÜNGE YAKALAMA · NORMAL UZAY');
        setWarpFactor(0.08);
        setLorentzGamma(1.0);
      }
    }, 45);

    return () => {
      clearInterval(interval);
      // Drop back to sub-light readouts once the jump ends.
      setProgressPercent(0);
      setWarpFactor(0.1);
    };
  }, [isWarping]);

  // Relativistic Hyperspace Streak Canvas
  useEffect(() => {
    if (!isWarping) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth || 800);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 800;
      height = canvas.height = canvas.offsetHeight || 600;
    };
    window.addEventListener('resize', onResize);

    // Particle streak stars
    const rayCount = 420;
    const rays = Array.from({ length: rayCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 20 + 2;
      const speed = Math.random() * 4 + 3;
      const length = Math.random() * 30 + 15;
      const hue = Math.random() > 0.4 ? 'cyan' : Math.random() > 0.5 ? 'lime' : 'violet';
      return { angle, dist, speed, length, hue };
    });

    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000; // in seconds
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxDist = Math.hypot(cx, cy) * 1.15;

      // Dynamic acceleration multiplier
      let speedMult = 1.0;
      if (elapsed < 0.4) {
        speedMult = 1.0 + (elapsed / 0.4) * 8.0;
      } else if (elapsed < 1.7) {
        speedMult = 11.0;
      } else {
        speedMult = Math.max(0.5, 11.0 - ((elapsed - 1.7) / 0.5) * 10.5);
      }

      // Alcubierre Distortion Circles
      const ringCount = 3;
      for (let r = 0; r < ringCount; r++) {
        const ringRadius = ((elapsed * 280 + r * 120) % (maxDist * 0.8)) + 15;
        const alpha = Math.max(0, 1 - ringRadius / (maxDist * 0.8)) * 0.35;
        ctx.strokeStyle = `rgba(212, 255, 61, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw relativistic star streaks
      rays.forEach((ray) => {
        ray.dist += ray.speed * speedMult * 1.8;
        if (ray.dist > maxDist) {
          ray.dist = Math.random() * 15 + 2;
          ray.angle = Math.random() * Math.PI * 2;
        }

        const streakLen = ray.length * (speedMult * 0.45);
        const x1 = cx + Math.cos(ray.angle) * ray.dist;
        const y1 = cy + Math.sin(ray.angle) * ray.dist;
        const x2 = cx + Math.cos(ray.angle) * (ray.dist + streakLen);
        const y2 = cy + Math.sin(ray.angle) * (ray.dist + streakLen);

        // Doppler Blueshift gradient
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        if (ray.hue === 'lime') {
          grad.addColorStop(0, 'rgba(212, 255, 61, 0.1)');
          grad.addColorStop(1, 'rgba(212, 255, 61, 0.95)');
        } else if (ray.hue === 'cyan') {
          grad.addColorStop(0, 'rgba(128, 223, 255, 0.1)');
          grad.addColorStop(1, 'rgba(128, 223, 255, 0.95)');
        } else {
          grad.addColorStop(0, 'rgba(122, 92, 255, 0.1)');
          grad.addColorStop(1, 'rgba(239, 236, 230, 0.9)');
        }

        ctx.strokeStyle = grad;
        ctx.lineWidth = speedMult > 5 ? 1.8 : 1.0;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // Central Spacetime Compression Glow
      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 140);
      coreGrad.addColorStop(0, 'rgba(212, 255, 61, 0.25)');
      coreGrad.addColorStop(0.4, 'rgba(128, 223, 255, 0.12)');
      coreGrad.addColorStop(1, 'rgba(9, 9, 11, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.fill();

      // Exit flash on deceleration
      if (elapsed > 1.9 && elapsed < 2.2) {
        const flashAlpha = (1 - (elapsed - 1.9) / 0.3) * 0.45;
        ctx.fillStyle = `rgba(239, 236, 230, ${flashAlpha})`;
        ctx.fillRect(0, 0, width, height);
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', onResize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isWarping]);

  if (!isWarping) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between overflow-hidden bg-black/60 backdrop-blur-[2px] p-6 sm:p-10 transition-opacity duration-300"
    >
      <Ticks />

      {/* Relativistic Ray Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
      />

      {/* Top Telemetry Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line/80 bg-ink/85 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="live-dot" />
          <span className="font-mono text-xs uppercase tracking-widest text-lime-signal font-bold">
            ALCUBIERRE WARP METRİK SÜRÜCÜSÜ AKTİF
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span className="text-muted">Hedef Kilit:</span>
          <span className="text-paper font-bold tracking-wider">{destinationName}</span>
          <span className="text-line">|</span>
          <span className="text-muted">Mesafe:</span>
          <span className="text-solar-signal font-bold">{destinationDistance}</span>
        </div>
      </div>

      {/* Center Reticle & Massive Speed Readout */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Reticle brackets */}
        <div className="relative p-6 sm:p-10 border border-line/60 bg-ink/80 backdrop-blur-md max-w-lg w-full">
          <div className="absolute top-2 left-2 label text-[9px] text-muted">
            LORENTZ FAKTÖRÜ: γ = {lorentzGamma}
          </div>
          <div className="absolute top-2 right-2 label text-[9px] text-lime-signal">
            Gμν = 8πG Tμν
          </div>

          <span className="label block text-xs tracking-widest text-muted uppercase">
            {phaseText}
          </span>

          <div className="display display-tight mt-2 text-[clamp(2.5rem,6vw,5.5rem)] font-bold text-paper drop-shadow-[0_0_24px_rgba(212,255,61,0.35)]">
            WARP {warpFactor >= 1 ? warpFactor.toFixed(1) : '< 1.0c'}
          </div>

          <div className="serif-i text-base sm:text-lg text-lime-signal mt-1">
            {warpFactor >= 1
              ? `Işık Hızının ${Math.round(Math.pow(warpFactor, 3.3)).toLocaleString('tr-TR')} Katı`
              : 'Yarı-Işık İtki Modu'}
          </div>

          {/* Progress Bar */}
          <div className="mt-6 space-y-1.5">
            <div className="flex justify-between font-mono text-[10px] text-muted">
              <span>Sıçrama İlerlemesi</span>
              <span className="text-lime-signal font-bold">%{progressPercent}</span>
            </div>
            <div className="h-1.5 w-full bg-ink-3 overflow-hidden border border-line/50">
              <div
                className="h-full bg-lime-signal transition-all duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Footer */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-line/80 bg-ink/85 px-4 py-2.5 backdrop-blur-md font-mono text-[11px] text-muted">
        <div className="flex items-center gap-4">
          <span>UZAY-ZAMAN TENSÖRÜ: <strong className="text-paper">DARALMA ÖN / GENLEŞME ARKA</strong></span>
          <span className="hidden sm:inline text-line">|</span>
          <span className="hidden sm:inline">DOPPLER MAVİYE KAYMA: <strong className="text-blue-400">Δλ / λ = -0.94</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-lime-signal animate-pulse" />
          <span className="text-paper font-bold uppercase tracking-wider">
            Yörüngeye Giriş Bekleniyor
          </span>
        </div>
      </div>
    </div>
  );
}
