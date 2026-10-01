'use client';

import React, { useEffect, useState } from 'react';

export function HeroKineticHUD() {
  const [coords, setCoords] = useState({ ra: '18h 36m 56s', dec: '+38° 47\' 01"', speed: 29.78 });

  useEffect(() => {
    // Subtle realistic fluctuation
    const interval = setInterval(() => {
      const s = 29.78 + (Math.random() * 0.04 - 0.02);
      setCoords((prev) => ({
        ...prev,
        speed: parseFloat(s.toFixed(2)),
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden opacity-60">
      {/* 1. Large Outer Astrolabe Ring (Clockwise) */}
      <div className="hud-ring-cw absolute h-[700px] w-[700px] rounded-full border border-white/[0.05] sm:h-[900px] sm:w-[900px]">
        <svg viewBox="0 0 900 900" className="h-full w-full opacity-40">
          <circle cx="450" cy="450" r="440" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" className="text-white/20" />
          <circle cx="450" cy="450" r="420" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 12" className="text-gold/30" />
          {/* Degree Ticks */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x1 = 450 + Math.cos(angle) * 430;
            const y1 = 450 + Math.sin(angle) * 430;
            const x2 = 450 + Math.cos(angle) * 440;
            const y2 = 450 + Math.sin(angle) * 440;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5" className="text-gold/50" />;
          })}
        </svg>
      </div>

      {/* 2. Middle Orbital Guidance Ring (Counter-Clockwise) */}
      <div className="hud-ring-ccw absolute h-[480px] w-[480px] rounded-full border border-white/[0.06] sm:h-[620px] sm:w-[620px]">
        <svg viewBox="0 0 620 620" className="h-full w-full opacity-35">
          <circle cx="310" cy="310" r="300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="16 32" className="text-lime/40" />
          <circle cx="310" cy="310" r="280" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 8" className="text-white/20" />
          {/* Celestial Cardinal Markers */}
          <text x="310" y="24" textAnchor="middle" fill="#f5c542" fontSize="9" fontFamily="monospace" letterSpacing="0.2em">NORTH POLE · 000°</text>
          <text x="596" y="313" textAnchor="start" fill="#f5c542" fontSize="9" fontFamily="monospace" letterSpacing="0.2em">090°</text>
          <text x="310" y="605" textAnchor="middle" fill="#f5c542" fontSize="9" fontFamily="monospace" letterSpacing="0.2em">EQUATOR · 180°</text>
          <text x="24" y="313" textAnchor="end" fill="#f5c542" fontSize="9" fontFamily="monospace" letterSpacing="0.2em">270°</text>
        </svg>
      </div>

      {/* 3. Sweeping Radar Beam */}
      <div className="hud-radar-sweep absolute h-[380px] w-[380px] rounded-full sm:h-[480px] sm:w-[480px]">
        <div
          className="h-full w-full rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, rgba(245, 197, 66, 0.15) 0deg, transparent 60deg, transparent 360deg)',
          }}
        />
      </div>

      {/* 4. Pulsing Resonant Core Ring */}
      <div className="hud-pulse-ring absolute h-[240px] w-[240px] rounded-full border border-gold/30 shadow-[0_0_30px_rgba(245,197,66,0.15)] sm:h-[300px] sm:w-[300px]" />

      {/* 5. Precision Reticle Crosshairs */}
      <div className="absolute h-[520px] w-[520px] sm:h-[680px] sm:w-[680px]">
        <span className="absolute left-0 top-1/2 h-[1px] w-12 -translate-y-1/2 bg-white/20" />
        <span className="absolute right-0 top-1/2 h-[1px] w-12 -translate-y-1/2 bg-white/20" />
        <span className="absolute left-1/2 top-0 h-12 w-[1px] -translate-x-1/2 bg-white/20" />
        <span className="absolute bottom-0 left-1/2 h-12 w-[1px] -translate-x-1/2 bg-white/20" />
      </div>

      {/* 6. Floating Telemetry HUD Readouts (Desktop) */}
      <div className="absolute right-8 top-32 hidden flex-col items-end gap-1 font-mono text-[10px] text-muted sm:flex lg:right-16">
        <div className="flex items-center gap-2 rounded border border-white/[0.08] bg-ink-2/60 px-2 py-1 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-solar animate-ping" />
          <span className="text-paper/90">ORB-VEL: <strong className="text-gold font-bold">{coords.speed} km/s</strong></span>
        </div>
        <div className="rounded border border-white/[0.06] bg-ink-2/40 px-2 py-0.5 text-[9px] text-muted">
          COORD: {coords.ra} · {coords.dec}
        </div>
        <div className="text-[9px] text-muted/60">
          SOLAR FLUX: 1361 W/m² · J2000
        </div>
      </div>
    </div>
  );
}
