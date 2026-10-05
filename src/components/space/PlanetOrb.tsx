'use client';

import dynamic from 'next/dynamic';
import { planetVisual } from './planetVisuals';
import { useIdleReady } from '@/lib/useIdleReady';

// three.js bu dosyada yok: 3D görünümler ve ortak tuval sayfa boşa çıkınca ayrı parça olarak yüklenir
const PlanetOrbView = dynamic(() => import('./PlanetOrbViews').then((m) => m.PlanetOrbView), { ssr: false });
const MoonOrbView = dynamic(() => import('./PlanetOrbViews').then((m) => m.MoonOrbView), { ssr: false });
const OrbCanvasLazy = dynamic(() => import('./OrbCanvasImpl').then((m) => m.OrbCanvasImpl), { ssr: false });

const FOV = 30;
const HALF_TAN = Math.tan(((FOV / 2) * Math.PI) / 180);

/**
 * A small live 3D planet that sits in normal page flow. It renders through the
 * page's shared <OrbCanvas /> (one WebGL context for every orb on the page);
 * without that canvas the CSS placeholder disc is shown instead.
 */
export function PlanetOrb({ id, className = '', spin = 1 }: { id: string; className?: string; spin?: number }) {
  const ready = useIdleReady();
  const v = planetVisual(id);
  // Frame the body (or body + ring) at ~90% of the slot.
  const extent = v.ring ? v.ring.outer * 1.02 : 1;
  const distance = extent / (HALF_TAN * 0.9);
  const bodyShare = 1 / (distance * HALF_TAN); // body diameter as a fraction of the slot
  const inset = `${((1 - bodyShare) / 2) * 100}%`;

  return (
    <div className={`relative shrink-0 ${className}`}>
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{ inset, background: `radial-gradient(circle at 35% 30%, ${v.color}, #000 78%)`, boxShadow: v.emissive ? `0 0 24px ${v.color}` : undefined }}
      />
      {ready && <PlanetOrbView id={id} spin={spin} distance={distance} />}
    </div>
  );
}

/** Shared fixed canvas that paints every <PlanetOrb /> on the page. */
export function OrbCanvas() {
  const ready = useIdleReady();
  return ready ? <OrbCanvasLazy /> : null;
}

/**
 * The Moon lit for a given synodic phase (0 → new, 0.5 → full), as seen from
 * the northern hemisphere: waxing light comes from the right.
 */
export function MoonOrb({ fraction, className = '' }: { fraction: number; className?: string }) {
  const ready = useIdleReady();
  const distance = 1 / (HALF_TAN * 0.9);
  return (
    <div className={`relative shrink-0 ${className}`}>
      <span aria-hidden className="absolute inset-[5%] rounded-full bg-ink-3" />
      {ready && <MoonOrbView fraction={fraction} distance={distance} />}
    </div>
  );
}
