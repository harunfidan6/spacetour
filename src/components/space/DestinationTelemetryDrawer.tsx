'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Thermometer,
  Zap,
  Globe2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Gauge,
  Radio,
  Sparkles
} from 'lucide-react';
import { useSpace, DESTINATIONS, DestinationId } from './SpaceContext';

export function DestinationTelemetryDrawer() {
  const { currentDestination, isWarping, triggerWarp, throttle, setThrottle } = useSpace();
  const [isOpen, setIsOpen] = useState(true);

  // Map destination id to encyclopedia page slug if available
  const encyclopediaSlugs: Partial<Record<DestinationId, string>> = {
    sun: 'gunes',
    earth: 'dunya',
    mars: 'mars',
    jupiter: 'jupiter',
    saturn: 'saturn'
  };

  const slug = encyclopediaSlugs[currentDestination.id];

  return (
    <div className="fixed bottom-20 right-4 z-30 pointer-events-auto hidden md:block">
      {/* Drawer Container */}
      <div className="w-80 rounded-3xl border border-primary/25 bg-background/85 shadow-[0_8px_32px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all duration-300 overflow-hidden">
        {/* Header Toggle */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between px-4 py-3 cursor-pointer bg-card-bg/60 border-b border-card-border/60 hover:bg-card-bg/90 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isWarping ? 'bg-secondary' : 'bg-primary'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isWarping ? 'bg-secondary' : 'bg-primary'}`} />
            </span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase">
              {currentDestination.tag}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-text-secondary hover:text-white transition-colors">
            <span className="text-xs font-mono font-bold text-foreground">{currentDestination.name}</span>
            {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-4 space-y-3.5">
            {/* Short Description */}
            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              {currentDestination.description}
            </p>

            {/* Scientific Readouts Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="rounded-2xl border border-card-border/60 bg-card-bg/70 p-2.5">
                <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                  <Compass size={12} className="text-primary" />
                  <span className="text-[10px]">Güneş'e Uzaklık</span>
                </div>
                <div className="font-bold text-foreground truncate">{currentDestination.distance}</div>
              </div>

              <div className="rounded-2xl border border-card-border/60 bg-card-bg/70 p-2.5">
                <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                  <Thermometer size={12} className="text-amber-400" />
                  <span className="text-[10px]">Sıcaklık</span>
                </div>
                <div className="font-bold text-foreground truncate">{currentDestination.temperature}</div>
              </div>

              <div className="rounded-2xl border border-card-border/60 bg-card-bg/70 p-2.5">
                <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                  <Gauge size={12} className="text-emerald-400" />
                  <span className="text-[10px]">Yörünge Hızı</span>
                </div>
                <div className="font-bold text-foreground truncate">{currentDestination.speed}</div>
              </div>

              <div className="rounded-2xl border border-card-border/60 bg-card-bg/70 p-2.5">
                <div className="flex items-center gap-1.5 text-text-secondary mb-1">
                  <Globe2 size={12} className="text-purple-400" />
                  <span className="text-[10px]">Yüzey Çekimi</span>
                </div>
                <div className="font-bold text-foreground truncate">{currentDestination.gravity}</div>
              </div>
            </div>

            {/* Warp Throttle & Action Bar */}
            <div className="pt-2 border-t border-card-border/60 flex items-center justify-between gap-2">
              <button
                onClick={triggerWarp}
                disabled={isWarping}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                  isWarping
                    ? 'bg-secondary/30 text-secondary border border-secondary/50 animate-pulse'
                    : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 hover:border-primary/60 shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                }`}
              >
                <Zap size={13} className={isWarping ? 'animate-bounce' : ''} />
                <span>{isWarping ? 'WARP MOTORU DEVREDE' : 'IŞIK HIZI TESTİ'}</span>
              </button>

              {slug && (
                <Link
                  href={`/ansiklopedi/${slug}`}
                  className="p-2 rounded-xl border border-card-border/80 bg-card-bg/80 text-text-secondary hover:text-white hover:border-primary/50 transition-colors"
                  title="Ansiklopedi Raporu"
                >
                  <ExternalLink size={14} />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
