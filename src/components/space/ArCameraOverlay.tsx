'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, AlertCircle, RefreshCw, Eye, Sparkles } from 'lucide-react';

interface ArCameraOverlayProps {
  isActive: boolean;
  onClose: () => void;
  opacity: number; // 0.1 to 1.0 (opacity of the 3D star layer over the camera)
  setOpacity: (val: number) => void;
}

export function ArCameraOverlay({
  isActive,
  onClose,
  opacity,
  setOpacity
}: ArCameraOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isActive) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      return;
    }

    let currentStream: MediaStream | null = null;

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

        currentStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      } catch (err: any) {
        console.warn('Camera access error:', err);
        setError(
          err.name === 'NotAllowedError'
            ? 'Kamera izni verilmedi. Lütfen tarayıcı ayarlarından kamera iznini onaylayın.'
            : 'Kamera başlatılamadı veya cihazınızda kamera bulunamadı.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isActive, facingMode]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* 1. Live Background Video Stream */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className="absolute inset-0 h-full w-full object-cover z-0"
      />

      {/* 2. Soft Dark Vignette for Star Contrast */}
      <div className="absolute inset-0 bg-black/35 z-1" />

      {/* 3. AR Status & Controls Header */}
      <div className="absolute top-20 left-4 right-4 z-30 pointer-events-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/40 bg-black/70 px-4 py-1.5 backdrop-blur-xl shadow-2xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-300 uppercase">
            CANLI AR GÖKYÜZÜ KAMERASI
          </span>
        </div>

        {/* Opacity Slider & Camera Switcher */}
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/70 px-4 py-1.5 backdrop-blur-xl">
          <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-300">
            <Eye size={13} className="text-cyan-400" />
            <span className="hidden sm:inline">Yıldız Saydamlığı:</span>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-16 sm:w-24 accent-cyan-400 cursor-pointer"
            />
          </div>

          <button
            onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
            className="text-neutral-400 hover:text-white transition-colors p-1"
            title="Kamera Değiştir (Ön/Arka)"
          >
            <RefreshCw size={14} />
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-red-400 transition-colors pl-1 border-l border-white/10"
          >
            <CameraOff size={14} />
            <span className="hidden sm:inline">Kapat</span>
          </button>
        </div>
      </div>

      {/* Loading or Error State */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/80 p-4 text-sm font-mono text-white">
            <RefreshCw className="animate-spin text-cyan-400" size={18} />
            <span>Kamera başlatılıyor...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="max-w-md rounded-3xl border border-red-500/40 bg-red-950/80 p-6 text-center space-y-3">
            <AlertCircle className="mx-auto text-red-400" size={32} />
            <h4 className="text-base font-bold text-white">Kamera Erişilemedi</h4>
            <p className="text-xs text-red-200 leading-relaxed font-sans">{error}</p>
            <button
              onClick={onClose}
              className="mt-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-mono font-bold px-4 py-2 transition-colors"
            >
              Simülasyon Moduna Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
