'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { SpaceProvider } from './SpaceContext';

// Dynamically import the 3D WebGL engine with SSR disabled for optimal Next.js performance
const SpaceJourneyEngine = dynamic(
  () => import('./SpaceJourneyEngine').then((mod) => mod.SpaceJourneyEngine),
  { ssr: false }
);

export function SpaceExperienceWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SpaceProvider>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground">
        {/* 3D WebGL Universe Layer (Cinematic Deep Space Background) */}
        <SpaceJourneyEngine />

        {/* Clean, Modern Page Content Layer */}
        <div className="relative z-10">{children}</div>
      </div>
    </SpaceProvider>
  );
}
