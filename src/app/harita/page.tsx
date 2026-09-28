'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Planetarium3D = dynamic(
  () => import('@/components/space/Planetarium3D').then((mod) => mod.Planetarium3D),
  { ssr: false }
);

export default function HaritaPage() {
  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      <Planetarium3D />
    </div>
  );
}
