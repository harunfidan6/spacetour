import React from 'react';
import { HomeHero } from '@/components/home/HomeHero';
import { CosmicGateways } from '@/components/home/CosmicGateways';
import { Voyage } from '@/components/home/Voyage';
import { MissionControlDashboard } from '@/components/home/MissionControlDashboard';
import { OrbCanvas } from '@/components/space/PlanetOrb';

export default function Home() {
  return (
    <main className="relative bg-ink text-paper overflow-x-hidden">
      {/* 1. Interactive 3D Cosmic Hero */}
      <HomeHero />

      {/* 2. The 5 Core Cosmic Gateway Stations (Bento Grid) */}
      <div id="istasyonlar">
        <CosmicGateways />
      </div>

      {/* 3. Interactive Keplerian 3D Solar System Voyage */}
      <Voyage />

      {/* 4. Real-Time Mission Control Dashboard (ISS, Space Weather, Sky Tonight, Deep Space Probes, NASA APOD) */}
      <div id="telemetri">
        <MissionControlDashboard />
      </div>

      <OrbCanvas />
    </main>
  );
}
