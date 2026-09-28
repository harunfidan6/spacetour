'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Activity } from 'lucide-react';

export function CosmicAudioEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);
  const pulsarOscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const toggleSound = () => {
    if (isPlaying) {
      // Stop audio
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlaying(false);
    } else {
      // Start procedural ambient space drone
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.08, ctx.currentTime); // gentle ambient volume
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        // 1. Deep Space Sub-Drone (55Hz + 110Hz harmonics)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(160, ctx.currentTime);

        osc1.connect(filter);
        filter.connect(masterGain);
        osc1.start();
        droneOscRef.current = osc1;

        // 2. Secondary Ethereal Frequency (165Hz)
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(164.8, ctx.currentTime);
        const osc2Gain = ctx.createGain();
        osc2Gain.gain.setValueAtTime(0.03, ctx.currentTime);
        osc2.connect(osc2Gain);
        osc2Gain.connect(masterGain);
        osc2.start();

        setIsPlaying(true);
      } catch (err) {
        console.error('Audio initialization error:', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleSound}
        className={`flex items-center gap-2 rounded-2xl border px-3.5 py-1.5 text-xs font-mono font-bold backdrop-blur-md transition-all cursor-pointer ${
          isPlaying
            ? 'border-primary bg-primary/20 text-primary shadow-[0_0_20px_rgba(0,212,255,0.4)]'
            : 'border-card-border bg-background/80 text-text-secondary hover:text-white hover:border-primary/40'
        }`}
        title={isPlaying ? 'Kozmik Ambiyansı Durdur' : 'Kozmik Frekans Ambiyansını Başlat'}
      >
        {isPlaying ? <Volume2 size={15} className="animate-pulse" /> : <VolumeX size={15} />}
        <span>{isPlaying ? 'Kozmik Ses Aktif' : 'Uzay Sesi'}</span>

        {isPlaying && (
          <span className="flex items-center gap-0.5 ml-1">
            <span className="h-2 w-0.5 bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-3.5 w-0.5 bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-2 w-0.5 bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        )}
      </button>
    </div>
  );
}
