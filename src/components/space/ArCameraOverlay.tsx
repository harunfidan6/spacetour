'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  CameraOff,
  AlertCircle,
  RefreshCw,
  Eye,
  Compass,
  Crosshair,
  Flashlight,
  Sparkles,
  Zap,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export interface OffScreenTarget {
  id: string;
  name: string;
  type: 'planet' | 'star' | 'moon' | 'sun';
  direction: 'left' | 'right' | 'up' | 'down';
  degrees: number;
  color: string;
}

interface ArCameraOverlayProps {
  isActive: boolean;
  /** True once the phone's orientation sensor drives the sky */
  tracking?: boolean;
  onClose: () => void;
  opacity: number; // 0.1 to 1.0 (opacity of the 3D star layer over the camera)
  setOpacity: (val: number) => void;
  azimuth?: number; // 0 - 360 degrees
  pitch?: number; // -90 to +90 degrees
  offScreenTargets?: OffScreenTarget[];
  onRequestSensor?: () => void;
  nightVision?: boolean;
  onToggleNightVision?: () => void;
}

const CARDINALS = [
  { deg: 0, label: 'K' },
  { deg: 45, label: 'KD' },
  { deg: 90, label: 'D' },
  { deg: 135, label: 'GD' },
  { deg: 180, label: 'G' },
  { deg: 225, label: 'GB' },
  { deg: 270, label: 'B' },
  { deg: 315, label: 'KB' },
  { deg: 360, label: 'K' }
];

function getCardinalName(deg: number): string {
  const norm = ((deg % 360) + 360) % 360;
  if (norm >= 337.5 || norm < 22.5) return 'Kuzey (0°)';
  if (norm >= 22.5 && norm < 67.5) return 'Kuzeydoğu (45°)';
  if (norm >= 67.5 && norm < 112.5) return 'Doğu (90°)';
  if (norm >= 112.5 && norm < 157.5) return 'Güneydoğu (135°)';
  if (norm >= 157.5 && norm < 202.5) return 'Güney (180°)';
  if (norm >= 202.5 && norm < 247.5) return 'Güneybatı (225°)';
  if (norm >= 247.5 && norm < 292.5) return 'Batı (270°)';
  return 'Kuzeybatı (315°)';
}

export function ArCameraOverlay({
  isActive,
  tracking = false,
  onClose,
  opacity,
  setOpacity,
  azimuth = 0,
  pitch = 0,
  offScreenTargets = [],
  onRequestSensor,
  nightVision = false,
  onToggleNightVision
}: ArCameraOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);

  useEffect(() => {
    if (!isActive) return;

    let currentStream: MediaStream | null = null;
    let cancelled = false;
    const video = videoRef.current;

    async function startCamera() {
      setIsLoading(true);
      setError(null);

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Tarayıcınız kamera erişimini desteklemiyor.');
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });

        if (cancelled) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }
        currentStream = mediaStream;
        streamRef.current = mediaStream;

        if (video) {
          video.srcObject = mediaStream;
          video.play().catch(() => {});
        }

        // Check if device video track supports flashlight / torch
        const track = mediaStream.getVideoTracks()[0];
        if (track) {
          const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as { torch?: boolean };
          setHasTorch(Boolean(capabilities.torch));
        }
      } catch (err: unknown) {
        console.warn('Camera access error:', err);
        setError(
          err instanceof DOMException && err.name === 'NotAllowedError'
            ? 'Kamera izni verilmedi. Lütfen tarayıcı ayarlarından kamera iznini onaylayın.'
            : 'Kamera başlatılamadı veya cihazınızda kamera bulunamadı.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      if (video) {
        video.srcObject = null;
      }
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
      streamRef.current = null;
      setTorchOn(false);
    };
  }, [isActive, facingMode]);

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && hasTorch) {
      try {
        const nextState = !torchOn;
        await (track.applyConstraints as unknown as (constraints: { advanced: Array<{ torch: boolean }> }) => Promise<void>)({
          advanced: [{ torch: nextState }]
        });
        setTorchOn(nextState);
      } catch (err) {
        console.warn('Torch toggle error:', err);
      }
    }
  };

  if (!isActive) return null;

  const currentHeadingStr = getCardinalName(azimuth);
  const roundedAzimuth = Math.round(((azimuth % 360) + 360) % 360);
  const roundedPitch = Math.round(pitch);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {/* 1. Live Background Video Stream */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className={`absolute inset-0 h-full w-full object-cover z-0 transition-opacity duration-300 ${
          nightVision ? 'filter brightness-90 contrast-125 sepia hue-rotate-[-50deg]' : ''
        }`}
      />

      {/* 2. Soft Dark Vignette for Star Layer Legibility */}
      <div
        className={`absolute inset-0 z-[1] pointer-events-none transition-colors ${
          nightVision
            ? 'bg-red-950/40 mix-blend-color-burn'
            : 'bg-gradient-to-b from-ink/60 via-ink/20 to-ink/70'
        }`}
      />

      {/* 3. TOP TELEMETRY COMPASS TAPE (Observatory Grade Azimuth Band) */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 z-30 pt-2 pb-3 px-4 flex flex-col items-center">
        {/* Cardinal Needle Marker */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-solar tracking-wider mb-1 bg-ink/80 px-3 py-0.5 rounded-full border border-solar/40 backdrop-blur-md">
          <Compass size={13} className="animate-spin-slow" />
          <span>{roundedAzimuth.toString().padStart(3, '0')}° AZ</span>
          <span className="text-paper/40">|</span>
          <span className="text-paper">{currentHeadingStr.split(' ')[0]}</span>
          <span className="text-paper/40">|</span>
          <span className={roundedPitch >= 0 ? 'text-lime' : 'text-cyan-400'}>
            ALT {roundedPitch >= 0 ? `+${roundedPitch}°` : `${roundedPitch}°`}
          </span>
        </div>

        {/* Dynamic Compass Ribbon */}
        <div className="relative w-64 sm:w-80 h-7 overflow-hidden border-x border-paper/20 border-b border-paper/30 bg-ink/70 backdrop-blur-md rounded-b-md">
          {/* Center alignment triangle */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-solar z-10" />

          {/* Compass Ribbon Strip */}
          <div
            className="absolute top-1 flex items-center transition-transform duration-100 ease-out font-mono text-[10px]"
            style={{
              left: '50%',
              transform: `translateX(-${(roundedAzimuth / 360) * 576}px)`,
              width: '1152px' // 2 full revolutions for smooth wrap
            }}
          >
            {[...CARDINALS, ...CARDINALS].map((c, i) => (
              <div
                key={i}
                className="flex-1 text-center font-bold flex flex-col items-center"
                style={{ width: '72px' }}
              >
                <span className={c.deg % 90 === 0 ? 'text-solar font-black' : 'text-paper/60'}>
                  {c.label}
                </span>
                <span className="h-1.5 w-[1px] bg-paper/30 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. CENTRAL SCI-FI / OBSERVATORY TARGETING RETICLE */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-full border border-paper/20 flex items-center justify-center">
          {/* Outer Tick Marks */}
          <div className="absolute -top-1.5 w-1 h-3 bg-solar/80" />
          <div className="absolute -bottom-1.5 w-1 h-3 bg-solar/80" />
          <div className="absolute -left-1.5 h-1 w-3 bg-solar/80" />
          <div className="absolute -right-1.5 h-1 w-3 bg-solar/80" />

          {/* Inner Crosshair Target */}
          <div className="h-2 w-2 rounded-full bg-solar animate-ping opacity-60" />
          <div className="absolute h-1.5 w-1.5 rounded-full bg-solar" />

          {/* Reticle Corner Brackets */}
          <div className="absolute top-2 left-2 text-paper/30 font-mono text-[9px] tracking-widest">
            ┌ F:65°
          </div>
          <div className="absolute top-2 right-2 text-paper/30 font-mono text-[9px] tracking-widest">
            {tracking ? 'GYRO:LOCK' : 'MANUAL'} ┐
          </div>
          <div className="absolute bottom-2 left-2 text-paper/30 font-mono text-[9px]">
            └ OPTIC
          </div>
          <div className="absolute bottom-2 right-2 text-paper/30 font-mono text-[9px]">
            {roundedPitch > 0 ? 'SKY' : 'GROUND'} ┘
          </div>
        </div>
      </div>

      {/* 5. OFF-SCREEN TARGET POINTER RADAR ARROWS */}
      {offScreenTargets.map((target) => {
        const isRight = target.direction === 'right';
        const isLeft = target.direction === 'left';
        const isUp = target.direction === 'up';
        const isDown = target.direction === 'down';

        return (
          <div
            key={target.id}
            className={`pointer-events-auto absolute z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-xl shadow-lg transition-all animate-pulse ${
              isRight ? 'right-4 top-1/2 -translate-y-1/2 flex-row-reverse border-solar/60 bg-solar/15 text-solar' : ''
            } ${
              isLeft ? 'left-4 top-1/2 -translate-y-1/2 border-solar/60 bg-solar/15 text-solar' : ''
            } ${
              isUp ? 'top-20 left-1/2 -translate-x-1/2 flex-col border-cyan-400/60 bg-cyan-400/15 text-cyan-400' : ''
            } ${
              isDown ? 'bottom-20 left-1/2 -translate-x-1/2 flex-col-reverse border-cyan-400/60 bg-cyan-400/15 text-cyan-400' : ''
            }`}
          >
            {isRight && <ChevronRight size={16} className="animate-bounce" />}
            {isLeft && <ChevronLeft size={16} className="animate-bounce" />}
            {isUp && <ChevronUp size={16} className="animate-bounce" />}
            {isDown && <ChevronDown size={16} className="animate-bounce" />}

            <div className="font-mono text-xs font-bold leading-tight flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: target.color }} />
              <span>{target.name}</span>
              <span className="opacity-70 text-[10px]">({Math.round(target.degrees)}°)</span>
            </div>
          </div>
        );
      })}

      {/* 6. BOTTOM CONTROL & SENSOR HUD DECK */}
      <div className="pointer-events-auto absolute left-4 right-4 bottom-5 z-30 flex flex-wrap items-center justify-between gap-2.5">
        {/* Tracking Status & Calibration Trigger */}
        <div className="flex items-center gap-2">
          {tracking ? (
            <div className="flex items-center gap-2 rounded-full border border-lime/40 bg-ink/80 px-3.5 py-1.5 backdrop-blur-xl shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
              </span>
              <span className="text-[11px] font-mono font-bold tracking-wider text-lime uppercase">
                JİROSKOP KİLİTLİ (60 FPS)
              </span>
            </div>
          ) : (
            <button
              onClick={onRequestSensor}
              className="flex items-center gap-2 rounded-full border border-solar bg-solar/20 px-3.5 py-1.5 text-[11px] font-mono font-bold text-solar backdrop-blur-xl shadow-[0_0_15px_rgba(255,91,34,0.4)] hover:bg-solar hover:text-ink transition-all cursor-pointer animate-pulse"
            >
              <Zap size={13} />
              <span>JİROSKOP SENSÖRÜNÜ BAŞLAT (iOS/AND)</span>
            </button>
          )}

          {/* Night Vision Red Filter Toggle */}
          {onToggleNightVision && (
            <button
              onClick={onToggleNightVision}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-mono font-bold backdrop-blur-xl transition-all cursor-pointer ${
                nightVision
                  ? 'border-rose bg-rose/30 text-rose shadow-[0_0_12px_rgba(255,50,50,0.5)]'
                  : 'border-paper/20 bg-ink/70 text-paper/70 hover:text-paper hover:border-paper/40'
              }`}
              title="Gece Görüşü Kırmızı Filtre"
            >
              <span className={`h-2 w-2 rounded-full ${nightVision ? 'bg-rose animate-pulse' : 'bg-paper/40'}`} />
              <span className="hidden sm:inline">Gece Görüşü</span>
            </button>
          )}
        </div>

        {/* Right Tools Deck: Opacity, Flashlight, Camera Switch, Close */}
        <div className="flex items-center gap-2 rounded-full border border-paper/15 bg-ink/85 px-3 py-1.5 backdrop-blur-xl shadow-2xl">
          {/* Opacity Slider */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-paper/80 pr-2 border-r border-paper/15">
            <Eye size={13} className="text-solar" />
            <span className="hidden md:inline text-[11px]">Yıldız Katmanı:</span>
            <input
              aria-label="Yıldız katmanı saydamlığı"
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-16 sm:w-20 accent-solar cursor-pointer"
            />
          </div>

          {/* Flashlight / Torch (if hardware supports) */}
          {hasTorch && (
            <button
              type="button"
              onClick={toggleTorch}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                torchOn ? 'text-solar bg-solar/20' : 'text-muted hover:text-paper'
              }`}
              title={torchOn ? 'Feneri Kapat' : 'Feneri Aç'}
            >
              <Flashlight size={14} />
            </button>
          )}

          {/* Front / Rear Camera Flip */}
          <button
            type="button"
            onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
            className="p-1.5 text-muted hover:text-paper transition-colors cursor-pointer"
            title="Kamera Değiştir (Ön/Arka)"
          >
            <RefreshCw size={14} />
          </button>

          {/* Exit AR */}
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-mono text-muted hover:text-rose transition-colors pl-2 border-l border-paper/15 cursor-pointer"
          >
            <CameraOff size={14} />
            <span className="hidden sm:inline font-bold">Kapat</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink/60 backdrop-blur-sm pointer-events-auto">
          <div className="flex items-center gap-3 border border-line bg-ink-2 p-4 text-sm font-mono text-paper shadow-2xl">
            <RefreshCw className="animate-spin text-solar" size={18} />
            <span>AR Kamerası ve Gökyüzü Hizalanıyor...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="max-w-md border border-rose/50 bg-ink-2 p-6 text-center space-y-3 shadow-2xl">
            <AlertCircle className="mx-auto text-rose" size={28} />
            <h4 className="font-mono text-base font-bold text-paper uppercase tracking-wider">Kamera Erişilemedi</h4>
            <p className="text-xs text-muted leading-relaxed font-sans">{error}</p>
            <button
              onClick={onClose}
              className="mt-2 border border-line bg-ink hover:border-paper text-paper text-xs font-mono font-bold px-4 py-2 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Simülasyon Moduna Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
