'use client';

import React, { useState } from 'react';
import { Rocket, Orbit, Compass } from 'lucide-react';
import { Voyage } from '@/components/home/Voyage';
import { AtmosphereToSpaceElevator } from './AtmosphereToSpaceElevator';

export function YolculukExperience() {
  const [activeTab, setActiveTab] = useState<'solar' | 'vertical'>('solar');

  return (
    <div className="space-y-6">
      {/* Experience Mode Switcher Bar */}
      <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] pt-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-line bg-ink-2 p-2 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1 text-muted uppercase text-[11px] tracking-wider">
            <Compass className="h-3.5 w-3.5 text-solar" />
            <span>YOLCULUK MODU SEÇİN:</span>
          </div>

          <div className="grid grid-cols-2 gap-1 sm:flex sm:items-center">
            <button
              type="button"
              onClick={() => setActiveTab('solar')}
              className={`px-4 py-2 flex items-center justify-center gap-2 transition-all cursor-pointer border uppercase tracking-wider text-[11px] ${
                activeTab === 'solar'
                  ? 'border-solar bg-solar text-ink font-bold shadow-[0_0_15px_rgba(255,91,34,0.25)]'
                  : 'border-transparent bg-ink/60 text-muted hover:text-paper hover:border-line'
              }`}
            >
              <Orbit className="h-3.5 w-3.5" />
              <span>Güneş Sistemi (3D)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vertical')}
              className={`px-4 py-2 flex items-center justify-center gap-2 transition-all cursor-pointer border uppercase tracking-wider text-[11px] ${
                activeTab === 'vertical'
                  ? 'border-cyan-400 bg-cyan-400 text-ink font-bold shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                  : 'border-transparent bg-ink/60 text-muted hover:text-paper hover:border-line'
              }`}
            >
              <Rocket className="h-3.5 w-3.5" />
              <span>Dikey Yükseliş (0–36k km)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Active Experience */}
      {activeTab === 'solar' ? (
        <Voyage />
      ) : (
        <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] pb-24">
          <AtmosphereToSpaceElevator />
        </div>
      )}
    </div>
  );
}
