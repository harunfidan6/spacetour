'use client';

import React, { useState, useRef, useEffect } from 'react';
import { VolumeX } from 'lucide-react';

export function CosmicAudioEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);
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
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!;
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
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? 'Uzay sesini kapat' : 'Uzay sesini aç'}
      title={isPlaying ? 'Kozmik ambiyansı durdur' : 'Kozmik frekans ambiyansını başlat'}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors cursor-pointer ${
        isPlaying ? 'border-solar bg-solar text-ink' : 'border-line bg-ink/60 text-paper/70 hover:border-paper/50 hover:text-paper'
      }`}
    >
      {isPlaying ? (
        <span className="flex h-3.5 items-end gap-[2px]" aria-hidden>
          <span className="w-[2px] animate-[eq_0.9s_ease-in-out_infinite_alternate] bg-ink" style={{ height: '100%' }} />
          <span className="w-[2px] animate-[eq_0.7s_ease-in-out_infinite_alternate] bg-ink" style={{ height: '100%', animationDelay: '-0.3s' }} />
          <span className="w-[2px] animate-[eq_1.1s_ease-in-out_infinite_alternate] bg-ink" style={{ height: '100%', animationDelay: '-0.6s' }} />
        </span>
      ) : (
        <VolumeX size={15} />
      )}
    </button>
  );
}
