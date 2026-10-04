'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CameraOff, AlertCircle, RefreshCw, Eye } from 'lucide-react';

interface ArCameraOverlayProps {
  isActive: boolean;
  /** True once the phone's orientation sensor drives the sky */
  tracking?: boolean;
  onClose: () => void;
  opacity: number; // 0.1 to 1.0 (opacity of the 3D star layer over the camera)
  setOpacity: (val: number) => void;
}

export function ArCameraOverlay({
  isActive,
  tracking = false,
  onClose,
  opacity,
  setOpacity
}: ArCameraOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

        // AR was switched off while the permission prompt was open: release at once.
        if (cancelled) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }
        currentStream = mediaStream;

        if (video) {
          video.srcObject = mediaStream;
          video.play().catch(() => {});
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
    };
  }, [isActive, facingMode]);

  if (!isActive) return null;

  return (
    // No z-index on the root: the video sits under the 3D canvas (z-10), the controls above it
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 1. Live Background Video Stream */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className="absolute inset-0 h-full w-full object-cover z-0"
      />

      {/* 2. Soft Dark Vignette for Star Contrast */}
      <div className="absolute inset-0 z-[1] bg-ink/35" />

      {/* 3. AR Status & Controls Header */}
      <div className="pointer-events-auto absolute left-4 right-4 top-16 z-30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-full border border-lime/40 bg-ink/70 px-4 py-1.5 backdrop-blur-xl shadow-2xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
          </span>
          <span className="text-[11px] font-mono font-bold tracking-widest text-lime uppercase">
            CANLI AR GÖKYÜZÜ KAMERASI
          </span>
        </div>
        <div className="order-last w-full rounded-full border border-paper/15 bg-ink/70 px-4 py-1.5 text-center text-[11px] text-paper/80 backdrop-blur-xl sm:order-none sm:w-auto">
          {tracking
            ? 'Telefonu gökyüzüne doğrult: yıldızlar baktığın yönü izliyor'
            : 'Yön sensörü bulunamadı: gökyüzünü sürükleyerek kamerayla hizala'}
        </div>

        {/* Opacity Slider & Camera Switcher */}
        <div className="flex items-center gap-3 rounded-full border border-paper/15 bg-ink/70 px-4 py-1.5 backdrop-blur-xl">
          <div className="flex items-center gap-1.5 text-xs font-mono text-paper/75">
            <Eye size={13} className="text-primary" />
            <span className="hidden sm:inline">Yıldız Saydamlığı:</span>
            <input aria-label="Yıldız katmanı saydamlığı"
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-16 sm:w-24 accent-primary cursor-pointer"
            />
          </div>

          <button type="button" aria-label="Ön ve arka kamera arasında geçiş yap"
            onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
            className="text-muted hover:text-paper transition-colors p-1"
            title="Kamera Değiştir (Ön/Arka)"
          >
            <RefreshCw size={14} />
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-mono text-muted hover:text-red-400 transition-colors pl-1 border-l border-paper/10"
          >
            <CameraOff size={14} />
            <span className="hidden sm:inline">Kapat</span>
          </button>
        </div>
      </div>

      {/* Loading or Error State */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink/60 backdrop-blur-sm pointer-events-auto">
          <div className="flex items-center gap-3 border border-line bg-ink-2 p-4 text-sm font-mono text-paper">
            <RefreshCw className="animate-spin text-solar" size={18} />
            <span>Kamera başlatılıyor...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="max-w-md border border-rose/50 bg-ink-2 p-6 text-center space-y-3">
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
