'use client';

import React, { useState, useEffect } from 'react';
import { useSpace, DESTINATIONS, DestinationId } from './SpaceContext';
import {
  Compass,
  Zap,
  Gauge,
  Eye,
  EyeOff,
  Play,
  Pause,
  Radio,
  ChevronRight,
  Crosshair,
  Thermometer,
  Weight,
  Activity,
  Cpu,
  Target,
  Signal
} from 'lucide-react';
import { CosmicAudioEngine } from './CosmicAudioEngine';

export function SpaceCockpitHUD() {
  const {
    currentDestination,
    setDestination,
    isWarping,
    autoPilot,
    toggleAutoPilot,
    hudVisible,
    toggleHud,
    throttle,
    setThrottle
  } = useSpace();

  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toISOString().substring(11, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const destinationsList: DestinationId[] = [
    'solar-overview',
    'sun',
    'earth',
    'mars',
    'jupiter',
    'saturn',
    'blackhole'
  ];

  return (
    <>
      <div className="scanline-overlay"></div>
      
      {/* 1. FULL-SCREEN WARP TUNNEL FLASH EFFECT */}
      {isWarping && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-background/60 to-transparent backdrop-blur-[4px] transition-all duration-300">
          <div className="flex flex-col items-center gap-4">
            <div className="sci-fi-box rounded-full px-8 py-3 flex items-center gap-3 shadow-neon-cyan">
              <Zap className="h-6 w-6 animate-bounce text-primary" />
              <span className="font-mono text-base font-black tracking-[0.3em] text-primary uppercase drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]">
                WARP ATLAMASI AKTİF • {currentDestination.name}
              </span>
            </div>
            {/* Animated warp speed gauge segmented bars */}
            <div className="flex gap-1">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-4 w-2 bg-primary"
                  style={{ 
                    opacity: Math.random(), 
                    animation: `pulse-dot ${Math.random() * 0.5 + 0.1}s infinite` 
                  }} 
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. MINIMAL HUD TOGGLE BUTTON */}
      <button
        onClick={toggleHud}
        title={hudVisible ? 'Kokpiti Gizle' : 'Kokpiti Aç'}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 sci-fi-box rounded-sm px-4 py-2 text-xs font-medium text-primary hover:shadow-neon-cyan transition-all uppercase tracking-widest"
      >
        <div className="corner-bracket corner-bracket-tl"></div>
        <div className="corner-bracket corner-bracket-br"></div>
        {hudVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        <span>{hudVisible ? 'SİSTEM KAPAN' : 'SİSTEM AKTİF'}</span>
      </button>

      {/* HUD CONTAINER */}
      {hudVisible && (
        <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-6 select-none font-mono text-primary">
          
          {/* TOP BAR: Telemetry & Autopilot */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            
            {/* Left Top: Status Panel */}
            <div className="pointer-events-auto sci-fi-box glass-panel p-4 flex flex-col gap-3 min-w-[240px]">
              <div className="corner-bracket corner-bracket-tl"></div>
              <div className="corner-bracket corner-bracket-tr"></div>
              <div className="corner-bracket corner-bracket-bl"></div>
              <div className="corner-bracket corner-bracket-br"></div>
              
              <div className="flex items-center justify-between border-b border-primary/30 pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 animate-pulse text-accent" />
                  <span className="text-[10px] font-bold tracking-widest text-primary/80 uppercase">SİSTEM DURUMU</span>
                </div>
                <span className="text-[10px] text-text-secondary">{time}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex h-4 w-4 items-center justify-center">
                  <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${isWarping ? 'bg-accent' : 'bg-primary'}`} />
                  <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isWarping ? 'bg-accent' : 'bg-primary'} shadow-neon-cyan`} />
                </div>
                <div>
                  <div className="text-[10px] text-text-secondary tracking-widest">SEYİR MODU</div>
                  <div className={`font-bold tracking-widest ${isWarping ? 'text-accent drop-shadow-[0_0_8px_rgba(255,107,53,0.8)]' : 'text-primary'}`}>
                    {isWarping ? 'HİPERUZAY GEÇİŞİ' : 'YÖRÜNGESEL SEYİR'}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-primary/60 tracking-widest">HIZ</span>
                  <span className="font-bold text-foreground">{isWarping ? 'WARP 9.6' : currentDestination.speed}</span>
                </div>
                <div className="h-1 w-full bg-primary/20 rounded overflow-hidden">
                  <div className="h-full bg-primary animate-pulse" style={{ width: isWarping ? '100%' : '35%' }}></div>
                </div>
              </div>
            </div>

            {/* Top Center: Animated Radar / Target Crosshair */}
            <div className="hidden md:flex flex-col items-center justify-center mt-2">
               <div className="relative w-32 h-32 flex items-center justify-center">
                 {/* Rotating Radar Rings */}
                 <div className="absolute inset-0 rounded-full border border-primary/30 border-dashed animate-[spin_10s_linear_infinite]" />
                 <div className="absolute inset-2 rounded-full border-2 border-primary/10 border-t-primary/60 border-l-primary/60 animate-[spin_4s_linear_infinite_reverse]" />
                 <Target className="absolute h-8 w-8 text-primary opacity-60 drop-shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
                 
                 {/* Scanning Line */}
                 <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent to-primary origin-left animate-[spin_3s_linear_infinite]" />
               </div>
            </div>

            {/* Right Top: Audio Engine & Autopilot Controls */}
            <div className="pointer-events-auto sci-fi-box glass-panel p-3 flex flex-col gap-3 min-w-[220px]">
              <div className="corner-bracket corner-bracket-tl"></div>
              <div className="corner-bracket corner-bracket-tr"></div>
              <div className="corner-bracket corner-bracket-bl"></div>
              <div className="corner-bracket corner-bracket-br"></div>

              <div className="flex items-center justify-between border-b border-primary/30 pb-2">
                <div className="flex items-center gap-2">
                  <Signal className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-bold tracking-widest text-primary/80 uppercase">HABERLEŞME & OTO</span>
                </div>
              </div>

              <CosmicAudioEngine />

              <button
                onClick={toggleAutoPilot}
                className={`group relative flex items-center justify-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all ${
                  autoPilot
                    ? 'border-accent bg-accent/10 text-accent shadow-neon-orange'
                    : 'border-primary/40 bg-primary/5 text-primary hover:border-primary hover:bg-primary/20'
                }`}
              >
                <div className="corner-bracket corner-bracket-tl group-hover:scale-110"></div>
                <div className="corner-bracket corner-bracket-br group-hover:scale-110"></div>
                {autoPilot ? <Pause size={14} className="animate-pulse" /> : <Play size={14} />}
                <span>{autoPilot ? 'OTO-TUR AKTİF' : 'SİNEMATİK TUR'}</span>
              </button>
            </div>
          </div>

          {/* MIDDLE: TARGET RETICLE (Central) */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 mix-blend-screen">
            <div className="relative">
              <Crosshair className="h-32 w-32 text-primary stroke-[0.5] animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-12 h-12 border border-primary/50 rounded-full animate-ping" />
              </div>
              <div className="absolute -left-16 top-1/2 w-12 h-[1px] bg-primary/40" />
              <div className="absolute -right-16 top-1/2 w-12 h-[1px] bg-primary/40" />
              <div className="absolute -top-16 left-1/2 w-[1px] h-12 bg-primary/40" />
              <div className="absolute -bottom-16 left-1/2 w-[1px] h-12 bg-primary/40" />
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="flex flex-col gap-6 w-full">
            
            {/* Telemetry Target Info & Throttle */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-6">
              
              {/* Target Scanner */}
              <div className="pointer-events-auto sci-fi-box glass-panel p-5 max-w-sm w-full">
                <div className="corner-bracket corner-bracket-tl"></div>
                <div className="corner-bracket corner-bracket-tr"></div>
                <div className="corner-bracket corner-bracket-bl"></div>
                <div className="corner-bracket corner-bracket-br"></div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Radio className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-[11px] font-bold tracking-widest text-primary uppercase">
                      HEDEF VERİSİ
                    </span>
                  </div>
                  <span className="text-[10px] border border-primary/40 bg-primary/10 px-2 py-0.5 text-primary font-medium tracking-widest shadow-neon-cyan">
                    {currentDestination.tag}
                  </span>
                </div>

                <h2 className="text-2xl font-black text-foreground mb-2 tracking-[0.1em] uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                  {currentDestination.name}
                </h2>
                <p className="text-xs text-primary/70 leading-relaxed mb-5 min-h-[3rem]">
                  {currentDestination.description}
                </p>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="flex items-center gap-3 bg-primary/5 p-2 border border-primary/20">
                    <Thermometer size={16} className="text-accent drop-shadow-[0_0_5px_rgba(255,107,53,0.8)]" />
                    <div>
                      <div className="text-[9px] text-primary/60 tracking-widest">SICAKLIK</div>
                      <div className="font-bold text-foreground truncate">{currentDestination.temperature}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-primary/5 p-2 border border-primary/20">
                    <Weight size={16} className="text-secondary drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]" />
                    <div>
                      <div className="text-[9px] text-primary/60 tracking-widest">YERÇEKİMİ</div>
                      <div className="font-bold text-foreground truncate">{currentDestination.gravity}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Throttle Module */}
              <div className="pointer-events-auto sci-fi-box glass-panel p-4 flex flex-col gap-3 min-w-[200px]">
                <div className="corner-bracket corner-bracket-tl"></div>
                <div className="corner-bracket corner-bracket-br"></div>
                
                <div className="flex items-center gap-2 border-b border-star-gold/30 pb-2">
                  <Zap className="h-4 w-4 text-star-gold animate-pulse" />
                  <span className="text-[10px] font-bold tracking-widest text-star-gold uppercase">WARP ÇEKİRDEĞİ</span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-star-gold/80 font-bold">
                  <span>GÜÇ SEVİYESİ</span>
                  <span className="text-lg drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">{throttle}x</span>
                </div>
                
                <div className="relative mt-2">
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={throttle}
                    onChange={(e) => setThrottle(Number(e.target.value))}
                    className="w-full h-2 bg-star-gold/20 appearance-none outline-none rounded-none border border-star-gold/50 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-star-gold [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,215,0,0.8)] [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  {/* Segmented marks */}
                  <div className="flex justify-between mt-1 px-1">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className={`w-[2px] h-2 ${i < throttle ? 'bg-star-gold shadow-[0_0_5px_rgba(255,215,0,0.8)]' : 'bg-star-gold/20'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Console */}
            <div className="pointer-events-auto sci-fi-box glass-panel p-3">
              <div className="flex items-center gap-2 mb-3 px-2">
                <Compass className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                  NAVİGASYON BİLGİSAYARI / HEDEF SEÇİMİ
                </span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-primary/40 to-transparent ml-4"></div>
              </div>
              
              <div className="flex items-center gap-3 overflow-x-auto pb-2 px-2 scrollbar-none snap-x">
                {destinationsList.map((destId) => {
                  const dest = DESTINATIONS[destId];
                  const isActive = currentDestination.id === destId;

                  return (
                    <button
                      key={destId}
                      onClick={() => setDestination(destId)}
                      className={`relative flex-shrink-0 flex items-center justify-center min-w-[120px] border px-4 py-3 text-xs tracking-widest uppercase font-bold transition-all duration-300 snap-start
                        ${isActive
                          ? 'border-primary bg-primary/20 text-white shadow-neon-cyan scale-105'
                          : 'border-primary/30 bg-primary/5 text-primary/60 hover:border-primary/80 hover:text-primary hover:bg-primary/10'
                      }`}
                    >
                      {isActive && (
                        <>
                          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white"></div>
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white"></div>
                        </>
                      )}
                      <span className="relative z-10">{dest.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
