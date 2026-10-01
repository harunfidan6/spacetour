'use client';

import React from 'react';

// =============================================================================
// BESPOKE CELESTIAL VECTOR GLYPH SYSTEM
// Swiss Scientific Line-Art & Sacred Astrological Geometry
// Zero default emojis, 100% custom SVG precision vectors
// =============================================================================

export interface GlyphProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

/**
 * Lookup key for glyph switches: Turkish-aware lowercase, diacritics folded to ASCII.
 * 'Merkür (Hermes)' → 'merkur', 'İkizler' → 'ikizler', 'büyük-ayı' → 'buyuk-ayi'.
 */
function glyphKey(value: string, firstWordOnly = false): string {
  let key = value.trim().toLocaleLowerCase('tr-TR');
  if (firstWordOnly) key = key.split(/[\s(]/)[0];
  return key.replace(/ı/g, 'i').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// -----------------------------------------------------------------------------
// 1. ZODIAC GLYPHS (12 Sacred Signs)
// -----------------------------------------------------------------------------

export function AriesGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Central rising axis */}
      <line x1="12" y1="21" x2="12" y2="9" />
      {/* Left curling horn */}
      <path d="M12 9C12 5.5 9.5 3 6.5 3C4 3 2.5 4.8 2.5 7C2.5 10 6 11.5 8 11.5" />
      {/* Right curling horn */}
      <path d="M12 9C12 5.5 14.5 3 17.5 3C20 3 21.5 4.8 21.5 7C21.5 10 18 11.5 16 11.5" />
      {/* Base baseline tick */}
      <line x1="10" y1="21" x2="14" y2="21" strokeWidth={1} />
    </svg>
  );
}

export function TaurusGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Sun/Bull Disc */}
      <circle cx="12" cy="14" r="6" />
      {/* Crescent Horns */}
      <path d="M5 4.5C6.5 8 9 9.5 12 9.5C15 9.5 17.5 8 19 4.5" />
      {/* Micro axis center dot */}
      <circle cx="12" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}

export function GeminiGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Top arched lintel */}
      <path d="M4 4.5C7.5 6 16.5 6 20 4.5" />
      {/* Bottom arched lintel */}
      <path d="M4 19.5C7.5 18 16.5 18 20 19.5" />
      {/* Twin columns */}
      <line x1="9" y1="5.2" x2="9" y2="18.8" />
      <line x1="15" y1="5.2" x2="15" y2="18.8" />
      {/* Pillar capitals */}
      <line x1="7.5" y1="8" x2="10.5" y2="8" strokeWidth={1} />
      <line x1="13.5" y1="8" x2="16.5" y2="8" strokeWidth={1} />
    </svg>
  );
}

export function CancerGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Top spiral node */}
      <circle cx="7" cy="8" r="3" />
      <path d="M7 5C11 5 19 6 19 11C19 12 18 12.5 17 12.5" />
      {/* Bottom spiral node */}
      <circle cx="17" cy="16" r="3" />
      <path d="M17 19C13 19 5 18 5 13C5 12 6 11.5 7 11.5" />
    </svg>
  );
}

export function LeoGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Solar origin head */}
      <circle cx="6.5" cy="15.5" r="2.5" />
      {/* Cresting mane */}
      <path d="M8.5 14C9.5 9 12.5 5 16 5C18.5 5 20.5 7 20.5 9.5C20.5 13.5 16 16 16.5 19.5" />
      {/* Whip tail curl */}
      <circle cx="18" cy="19.5" r="1.5" />
    </svg>
  );
}

export function VirgoGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* M-shape columns */}
      <path d="M3.5 17.5V6.5C3.5 4.5 5 3.5 7 3.5C9 3.5 10.5 4.5 10.5 6.5V17.5" />
      <path d="M10.5 6.5C10.5 4.5 12 3.5 14 3.5C16 3.5 17.5 4.5 17.5 6.5V17.5" />
      {/* Looped maiden tail with crossing blade */}
      <path d="M17.5 12.5C18.5 10.5 20.5 10.5 21.5 12C22.5 14 21 17 17 19.5L16 21.5" />
      <line x1="15" y1="18.5" x2="19" y2="19.5" />
    </svg>
  );
}

export function LibraGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Base equilibrium line */}
      <line x1="3" y1="19" x2="21" y2="19" />
      {/* Top scale bar with central sun dome */}
      <line x1="3" y1="13" x2="8" y2="13" />
      <path d="M8 13C8 8.5 16 8.5 16 13" />
      <line x1="16" y1="13" x2="21" y2="13" />
      {/* Micro balance indicators */}
      <circle cx="12" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

export function ScorpioGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* M-shape columns */}
      <path d="M3.5 17.5V6.5C3.5 4.5 5 3.5 7 3.5C9 3.5 10.5 4.5 10.5 6.5V17.5" />
      <path d="M10.5 6.5C10.5 4.5 12 3.5 14 3.5C16 3.5 17.5 4.5 17.5 6.5V15" />
      {/* Sting barb */}
      <path d="M17.5 15C17.5 18 19 19 21.5 19" />
      <path d="M19.5 16.5L22 19L19.5 21.5" />
    </svg>
  );
}

export function SagittariusGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Diagonal arrow shaft */}
      <line x1="4" y1="20" x2="20" y2="4" />
      {/* Arrow head */}
      <path d="M14 4H20V10" />
      {/* Bow crossbar */}
      <line x1="8" y1="12" x2="14" y2="18" />
    </svg>
  );
}

export function CapricornGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Horn v-stem */}
      <path d="M4 5L8 16L12 7" />
      {/* Curved back descending into fish tail */}
      <path d="M12 7C14 4.5 17 5 18 7.5C19 10 17 12 15 13C13 14 13.5 17 15.5 18.5C17.5 20 20 18 19.5 15" />
      {/* Tail fin accent */}
      <circle cx="17.5" cy="16.5" r="1.5" />
    </svg>
  );
}

export function AquariusGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Upper celestial frequency wave */}
      <path d="M3 8.5L6.5 5.5L10 8.5L13.5 5.5L17 8.5L20.5 5.5" />
      {/* Lower celestial frequency wave */}
      <path d="M3 15.5L6.5 12.5L10 15.5L13.5 12.5L17 15.5L20.5 12.5" />
      {/* Dynamic current flow dots */}
      <circle cx="21.5" cy="7" r="0.75" fill="currentColor" />
      <circle cx="21.5" cy="14" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function PiscesGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Left crescent fish */}
      <path d="M6 3.5C8.5 7.5 8.5 16.5 6 20.5" />
      {/* Right crescent fish */}
      <path d="M18 3.5C15.5 7.5 15.5 16.5 18 20.5" />
      {/* Central linking cosmic ribbon */}
      <line x1="4" y1="12" x2="20" y2="12" />
      {/* Ribbon knot */}
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// 2. PLANETARY & CELESTIAL BODY GLYPHS (Astrophysical & Alchemical)
// -----------------------------------------------------------------------------

export function SunGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      {/* 4 Fine Cardinal Ray Ticks */}
      <line x1="12" y1="2" x2="12" y2="3.5" strokeWidth={1} />
      <line x1="12" y1="20.5" x2="12" y2="22" strokeWidth={1} />
      <line x1="2" y1="12" x2="3.5" y2="12" strokeWidth={1} />
      <line x1="20.5" y1="12" x2="22" y2="12" strokeWidth={1} />
    </svg>
  );
}

export function MoonGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M15 3.5C8.5 4.5 4.5 10 5.5 16C6.5 21 11.5 22.5 15.5 21C11.5 19 9.5 14.5 11 10C12 7 13.5 5 15 3.5Z" />
      <circle cx="14" cy="12" r="1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function MercuryGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Horns */}
      <path d="M8 3.5C9.5 5.5 14.5 5.5 16 3.5" />
      {/* Disc */}
      <circle cx="12" cy="10" r="4.5" />
      {/* Cross */}
      <line x1="12" y1="14.5" x2="12" y2="22" />
      <line x1="8.5" y1="18.5" x2="15.5" y2="18.5" />
    </svg>
  );
}

export function VenusGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="8.5" r="5.5" />
      <line x1="12" y1="14" x2="12" y2="22" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
  );
}

export function MarsGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="9.5" cy="14.5" r="5.5" />
      <line x1="13.5" y1="10.5" x2="20" y2="4" />
      <polyline points="14,4 20,4 20,10" />
    </svg>
  );
}

export function JupiterGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M6 5C9 5 11 7 11 11V21" />
      <line x1="5" y1="14.5" x2="19" y2="14.5" />
      <line x1="15.5" y1="11" x2="15.5" y2="21" />
    </svg>
  );
}

export function SaturnGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="9" y1="3" x2="9" y2="13" />
      <line x1="5.5" y1="6" x2="12.5" y2="6" />
      <path d="M9 11C12 9 15.5 10 15.5 13.5C15.5 17.5 12 21 8.5 21C6 21 5.5 19.5 6 18.5" />
    </svg>
  );
}

export function UranusGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Central disc */}
      <circle cx="12" cy="18.5" r="2.5" />
      {/* Vertical axis */}
      <line x1="12" y1="3" x2="12" y2="16" />
      {/* Crossbar */}
      <line x1="6" y1="7.5" x2="18" y2="7.5" />
      {/* Side antennas */}
      <line x1="6" y1="4.5" x2="6" y2="13" />
      <line x1="18" y1="4.5" x2="18" y2="13" />
    </svg>
  );
}

export function NeptuneGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Central mast */}
      <line x1="12" y1="3" x2="12" y2="21" />
      {/* Crossbar at base */}
      <line x1="8.5" y1="18" x2="15.5" y2="18" />
      {/* Trident bowl */}
      <path d="M6 7V9C6 12.3 8.7 15 12 15C15.3 15 18 12.3 18 9V7" />
      {/* Trident spears */}
      <polyline points="4.5,8 6,6 7.5,8" strokeWidth={1} />
      <polyline points="10.5,5 12,3 13.5,5" strokeWidth={1} />
      <polyline points="16.5,8 18,6 19.5,8" strokeWidth={1} />
    </svg>
  );
}

export function PlutoGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* P-L monogram inside sphere */}
      <path d="M8 20V5H13C15.5 5 17 6.5 17 9C17 11.5 15.5 13 13 13H8" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  );
}

export function EarthGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="8" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}

export function AscendantGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Horizon line */}
      <line x1="3" y1="17" x2="21" y2="17" strokeWidth={1} strokeDasharray="2 2" />
      {/* Rising vector */}
      <line x1="6" y1="17" x2="17" y2="6" strokeWidth={strokeWidth} />
      <polyline points="11,6 17,6 17,12" strokeWidth={strokeWidth} />
      {/* Text mark ASC */}
      <text x="3" y="10" fontSize="7" fontWeight="900" fill="currentColor" stroke="none" fontFamily="monospace">ASC</text>
    </svg>
  );
}

export function MidheavenGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="12" y1="21" x2="12" y2="5" />
      <polyline points="8,9 12,5 16,9" />
      <text x="5" y="22" fontSize="7" fontWeight="900" fill="currentColor" stroke="none" fontFamily="monospace">MC</text>
    </svg>
  );
}

export function NorthNodeGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="7" cy="16" r="3" />
      <circle cx="17" cy="16" r="3" />
      <path d="M7 13C7 7.5 17 7.5 17 13" />
    </svg>
  );
}

export function ChironGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="17" r="4" />
      <line x1="12" y1="3" x2="12" y2="13" />
      <path d="M12 7L17 3" />
      <path d="M12 7L17 11" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// 3. ASTROLOGICAL ASPECT GLYPHS (Conjunction, Trine, Square, Sextile, Opposition)
// -----------------------------------------------------------------------------

export function ConjunctionGlyph({ size = 20, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="10" cy="13" r="5" />
      <line x1="10" y1="8" x2="16" y2="2" />
    </svg>
  );
}

export function SextileGlyph({ size = 20, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="10" y1="2" x2="10" y2="18" />
      <line x1="3.07" y1="6" x2="16.93" y2="14" />
      <line x1="3.07" y1="14" x2="16.93" y2="6" />
    </svg>
  );
}

export function SquareGlyph({ size = 20, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="3.5" y="3.5" width="13" height="13" />
    </svg>
  );
}

export function TrineGlyph({ size = 20, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polygon points="10,2.5 18,16.5 2,16.5" />
    </svg>
  );
}

export function OppositionGlyph({ size = 20, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="10" cy="4" r="2.5" />
      <line x1="10" y1="6.5" x2="10" y2="13.5" />
      <circle cx="10" cy="16" r="2.5" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// 4. PRECISE VECTOR MOON PHASES (Terminator Geometry)
// -----------------------------------------------------------------------------

export function VectorMoonPhase({
  phase,
  illumination,
  waning,
  size = 28,
  className = ''
}: {
  phase?: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';
  /** Illuminated fraction in percent; takes precedence over the preset for `phase`. */
  illumination?: number;
  /** Lit limb on the left (northern-hemisphere view); inferred from `phase` when omitted. */
  waning?: boolean;
  size?: number;
  className?: string;
}) {
  const PRESET = {
    new: 0,
    'waxing-crescent': 0.2,
    'first-quarter': 0.5,
    'waxing-gibbous': 0.8,
    full: 1,
    'waning-gibbous': 0.8,
    'last-quarter': 0.5,
    'waning-crescent': 0.2
  } as const;
  const p = Math.min(1, Math.max(0, illumination !== undefined ? illumination / 100 : phase ? PRESET[phase] : 0.5));
  const isWaning = waning ?? (phase?.startsWith('waning') || phase === 'last-quarter');
  const r = 11;
  const cx = 14;
  const cy = 14;

  // The terminator is a half-ellipse whose midpoint sits at x = cx ± (1 − 2p)·r.
  // A quadratic Bézier passes through its midpoint halfway to the control point,
  // so the control point is pushed twice as far: (1 − 2p)·2r from the centre.
  const bulge = (1 - 2 * p) * 2 * r;

  return (
    <svg viewBox="0 0 28 28" width={size} height={size} className={`select-none ${className}`}>
      {/* Outer subtle orbital boundary ring */}
      <circle cx={cx} cy={cy} r={r + 1.5} fill="none" stroke="currentColor" strokeWidth={0.75} strokeDasharray="1.5 2" opacity={0.35} />

      {/* Dark background hemisphere */}
      <circle cx={cx} cy={cy} r={r} fill="#14141c" stroke="currentColor" strokeWidth={1} />

      {/* Moon Surface Illumination Path */}
      {p > 0.03 && (
        <path
          d={
            p >= 0.97
              ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`
              : isWaning
              ? `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} Q ${cx - bulge} ${cy} ${cx} ${cy - r}`
              : `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Q ${cx + bulge} ${cy} ${cx} ${cy - r}`
          }
          fill="currentColor"
          opacity={0.92}
        />
      )}

      {/* Subtle Mare (lunar basaltic plain) features for realism */}
      <circle cx={cx - 3} cy={cy - 2} r={1.8} fill="#000" opacity={0.12} />
      <circle cx={cx + 2} cy={cy + 3} r={2.2} fill="#000" opacity={0.14} />
      <circle cx={cx + 4} cy={cy - 4} r={1.5} fill="#000" opacity={0.1} />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// 5. FOUR SACRED ELEMENTS (Alchemical Geometry)
// -----------------------------------------------------------------------------

export function FireElementGlyph({ size = 20, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polygon points="10,3 18,17 2,17" />
      <circle cx="10" cy="13" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function EarthElementGlyph({ size = 20, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polygon points="10,17 2,3 18,3" />
      <line x1="4.5" y1="12" x2="15.5" y2="12" />
    </svg>
  );
}

export function AirElementGlyph({ size = 20, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polygon points="10,3 18,17 2,17" />
      <line x1="4.5" y1="8" x2="15.5" y2="8" />
    </svg>
  );
}

export function WaterElementGlyph({ size = 20, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polygon points="10,17 2,3 18,3" />
      <circle cx="10" cy="7" r="1.5" fill="currentColor" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// 6. GENERAL CELESTIAL & ASTRONOMICAL LINE ICONS
// -----------------------------------------------------------------------------

export function GalaxySpiralGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      {/* 2 Logarithmic Spiral Arms */}
      <path d="M12 9.5C14.5 9.5 17 11 18 13.5C19 16 17.5 19 14.5 20C11.5 21 8 19 7 15" />
      <path d="M12 14.5C9.5 14.5 7 13 6 10.5C5 8 6.5 5 9.5 4C12.5 3 16 5 17 9" />
    </svg>
  );
}

export function AstrolabeGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Outer suspension throne */}
      <circle cx="12" cy="3.5" r="2" />
      {/* Mater (main outer rim) */}
      <circle cx="12" cy="13.5" r="8.5" />
      {/* Limb degree ticks */}
      <circle cx="12" cy="13.5" r="6.5" strokeDasharray="1.5 2" strokeWidth={0.8} />
      {/* Alidade sight rule */}
      <line x1="5.5" y1="6" x2="18.5" y2="21" strokeWidth={strokeWidth} />
      <circle cx="12" cy="13.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function TelescopeGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Barrel */}
      <path d="M5 15L15 5L19 9L9 19L5 15Z" />
      {/* Dew shield */}
      <line x1="14" y1="4" x2="20" y2="10" />
      {/* Eyepiece focus */}
      <path d="M4 16L2 18" />
      {/* Tripod Mount */}
      <circle cx="11" cy="13" r="1.5" fill="currentColor" />
      <line x1="11" y1="14.5" x2="7" y2="22" />
      <line x1="11" y1="14.5" x2="15" y2="22" />
      <line x1="11" y1="14.5" x2="11" y2="22" strokeDasharray="1 2" strokeWidth={1} />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// DYNAMIC GLYPH RESOLVER
// -----------------------------------------------------------------------------

export function ZodiacGlyph({
  sign,
  size = 24,
  className = '',
  strokeWidth = 1.5,
  ...props
}: { sign: string } & GlyphProps) {
  const s = glyphKey(sign);
  switch (s) {
    case 'koc':
    case 'aries':
      return <AriesGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'boga':
    case 'taurus':
      return <TaurusGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'ikizler':
    case 'gemini':
      return <GeminiGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'yengec':
    case 'cancer':
      return <CancerGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'aslan':
    case 'leo':
      return <LeoGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'basak':
    case 'virgo':
      return <VirgoGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'terazi':
    case 'libra':
      return <LibraGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'akrep':
    case 'scorpio':
      return <ScorpioGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'yay':
    case 'sagittarius':
      return <SagittariusGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'oglak':
    case 'capricorn':
      return <CapricornGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'kova':
    case 'aquarius':
      return <AquariusGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'balik':
    case 'pisces':
      return <PiscesGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    default:
      return <AriesGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
  }
}

export function PlanetGlyph({
  planet,
  size = 24,
  className = '',
  strokeWidth = 1.5,
  ...props
}: { planet: string } & GlyphProps) {
  const p = glyphKey(planet, true);
  switch (p) {
    case 'gunes':
    case 'sun':
    case 'sol':
      return <SunGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'ay':
    case 'moon':
    case 'luna':
      return <MoonGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'merkur':
    case 'mercury':
      return <MercuryGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'venus':
      return <VenusGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'mars':
      return <MarsGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'jupiter':
      return <JupiterGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'saturn':
      return <SaturnGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'uranus':
      return <UranusGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'neptun':
    case 'neptune':
      return <NeptuneGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'pluto':
    case 'pluton':
      return <PlutoGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'dunya':
    case 'earth':
      return <EarthGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'asc':
    case 'yukselen':
      return <AscendantGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'mc':
    case 'tepe':
      return <MidheavenGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'northnode':
    case 'kuzeydugumu':
      return <NorthNodeGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'chiron':
    case 'kiron':
      return <ChironGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    default:
      return <SunGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
  }
}

// -----------------------------------------------------------------------------
// CONSTELLATION ASTERISM GLYPHS
// -----------------------------------------------------------------------------

export function UrsaMajorGlyph({ size = 24, className = '', strokeWidth = 1.2, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Dipper Bowl & Handle */}
      <polyline points="4,22 10,18 15,19 19,15 28,14 27,24 19,25 19,15" />
      {/* Stars */}
      <circle cx="4" cy="22" r="1.5" fill="currentColor" />
      <circle cx="10" cy="18" r="1.5" fill="currentColor" />
      <circle cx="15" cy="19" r="1.5" fill="currentColor" />
      <circle cx="19" cy="15" r="1.5" fill="currentColor" />
      <circle cx="28" cy="14" r="1.8" fill="currentColor" />
      <circle cx="27" cy="24" r="1.5" fill="currentColor" />
      <circle cx="19" cy="25" r="1.5" fill="currentColor" />
      {/* Pointer vector line towards north */}
      <line x1="27" y1="24" x2="28" y2="14" strokeWidth={1.5} strokeDasharray="1 1" />
    </svg>
  );
}

export function UrsaMinorGlyph({ size = 24, className = '', strokeWidth = 1.2, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Little Dipper */}
      <polyline points="28,8 21,12 17,11 14,14 6,15 7,23 14,21 14,14" />
      <circle cx="28" cy="8" r="2.5" fill="currentColor" />
      {/* Polaris radiance */}
      <line x1="28" y1="4" x2="28" y2="12" strokeWidth={1} />
      <line x1="24" y1="8" x2="32" y2="8" strokeWidth={1} />
      {/* Other stars */}
      <circle cx="21" cy="12" r="1.2" fill="currentColor" />
      <circle cx="17" cy="11" r="1.2" fill="currentColor" />
      <circle cx="14" cy="14" r="1.2" fill="currentColor" />
      <circle cx="6" cy="15" r="1.4" fill="currentColor" />
      <circle cx="7" cy="23" r="1.4" fill="currentColor" />
      <circle cx="14" cy="21" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function OrionGlyph({ size = 24, className = '', strokeWidth = 1.2, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Shoulders to Feet */}
      <polygon points="8,7 24,9 22,25 9,23" />
      {/* Orion's Belt */}
      <line x1="13" y1="16.5" x2="19" y2="15.5" strokeWidth={1.5} />
      <circle cx="13" cy="16.5" r="1.5" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      <circle cx="19" cy="15.5" r="1.5" fill="currentColor" />
      {/* Betelgeuse (Red supergiant star) */}
      <circle cx="8" cy="7" r="2.2" fill="currentColor" />
      {/* Bellatrix */}
      <circle cx="24" cy="9" r="1.5" fill="currentColor" />
      {/* Rigel */}
      <circle cx="22" cy="25" r="2" fill="currentColor" />
      {/* Saiph */}
      <circle cx="9" cy="23" r="1.5" fill="currentColor" />
      {/* Head */}
      <line x1="16" y1="4" x2="16" y2="8" strokeDasharray="1 1" />
      <circle cx="16" cy="4" r="1" fill="currentColor" />
    </svg>
  );
}

export function CygnusGlyph({ size = 24, className = '', strokeWidth = 1.2, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Northern Cross backbone */}
      <line x1="16" y1="4" x2="16" y2="28" />
      {/* Wing wingspan */}
      <line x1="5" y1="14" x2="27" y2="14" />
      {/* Deneb */}
      <circle cx="16" cy="4" r="2.2" fill="currentColor" />
      {/* Sadr (center) */}
      <circle cx="16" cy="14" r="1.8" fill="currentColor" />
      {/* Albireo (head) */}
      <circle cx="16" cy="28" r="1.5" fill="currentColor" />
      {/* Wingtips */}
      <circle cx="5" cy="14" r="1.5" fill="currentColor" />
      <circle cx="27" cy="14" r="1.5" fill="currentColor" />
      {/* Wing diagonal bracing */}
      <line x1="10" y1="14" x2="7" y2="19" />
      <line x1="22" y1="14" x2="25" y2="19" />
    </svg>
  );
}

export function CassiopeiaGlyph({ size = 24, className = '', strokeWidth = 1.2, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* W Shape */}
      <polyline points="5,12 11,22 16,13 22,23 27,10" />
      <circle cx="5" cy="12" r="1.8" fill="currentColor" />
      <circle cx="11" cy="22" r="2" fill="currentColor" />
      <circle cx="16" cy="13" r="1.8" fill="currentColor" />
      <circle cx="22" cy="23" r="2.2" fill="currentColor" />
      <circle cx="27" cy="10" r="1.8" fill="currentColor" />
    </svg>
  );
}

export function PegasusGlyph({ size = 24, className = '', strokeWidth = 1.2, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Great Square */}
      <polygon points="9,9 23,9 23,23 9,23" />
      <line x1="9" y1="9" x2="4" y2="14" />
      <line x1="9" y1="23" x2="3" y2="28" />
      <circle cx="9" cy="9" r="1.8" fill="currentColor" />
      <circle cx="23" cy="9" r="1.8" fill="currentColor" />
      <circle cx="23" cy="23" r="1.8" fill="currentColor" />
      <circle cx="9" cy="23" r="1.8" fill="currentColor" />
      <circle cx="4" cy="14" r="1.2" fill="currentColor" />
      <circle cx="3" cy="28" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function LyraGlyph({ size = 24, className = '', strokeWidth = 1.2, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Vega Star */}
      <circle cx="16" cy="6" r="2.5" fill="currentColor" />
      <line x1="16" y1="2" x2="16" y2="10" strokeWidth={1} />
      <line x1="12" y1="6" x2="20" y2="6" strokeWidth={1} />
      {/* Triangle to Rhombus */}
      <polyline points="16,6 10,14 22,14 16,6" />
      <polygon points="10,14 22,14 19,26 7,26" />
      <circle cx="10" cy="14" r="1.5" fill="currentColor" />
      <circle cx="22" cy="14" r="1.5" fill="currentColor" />
      <circle cx="19" cy="26" r="1.5" fill="currentColor" />
      <circle cx="7" cy="26" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function ConstellationGlyph({
  id,
  size = 28,
  className = '',
  strokeWidth = 1.3,
  ...props
}: { id: string } & GlyphProps) {
  const norm = glyphKey(id).replace(/[^a-z0-9-]/g, '');
  switch (norm) {
    case 'buyuk-ayi':
    case 'ursa-major':
      return <UrsaMajorGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'kucuk-ayi':
    case 'ursa-minor':
      return <UrsaMinorGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'avci':
    case 'orion':
      return <OrionGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'kugu':
    case 'cygnus':
      return <CygnusGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'kralice':
    case 'cassiopeia':
      return <CassiopeiaGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'kanatli-at':
    case 'pegasus':
      return <PegasusGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'calgi':
    case 'lyra':
      return <LyraGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'aslan':
    case 'leo':
      return <LeoGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'boga':
    case 'taurus':
      return <TaurusGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'akrep':
    case 'scorpius':
    case 'scorpio':
      return <ScorpioGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'ikizler':
    case 'gemini':
      return <GeminiGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'andromeda':
      return <GalaxySpiralGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    default:
      return <AstrolabeGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
  }
}

// -----------------------------------------------------------------------------
// ASTRONOMICAL EVENT GLYPHS (Eclipses, Meteor Showers, Conjunctions)
// -----------------------------------------------------------------------------

export function LunarEclipseGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Earth umbral shadow disc */}
      <circle cx="12" cy="12" r="9" strokeDasharray="2 2" strokeWidth={1} />
      {/* Blood moon entering shadow */}
      <path d="M12 3A9 9 0 0 0 12 21A6.5 6.5 0 0 1 12 3Z" fill="currentColor" fillOpacity={0.25} />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

export function SolarEclipseGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Corona rays */}
      <circle cx="12" cy="12" r="9" strokeWidth={1} strokeDasharray="1 3" />
      {/* Corona flares */}
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      {/* Sun edge with Moon occulting disc */}
      <circle cx="12" cy="12" r="6" strokeWidth={1.5} />
      <circle cx="13" cy="11.5" r="5.5" fill="currentColor" />
    </svg>
  );
}

export function MeteorShowerGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Radiant star point */}
      <circle cx="19" cy="5" r="1.5" fill="currentColor" />
      {/* Meteor streak 1 */}
      <line x1="18" y1="6" x2="4" y2="20" strokeWidth={1.8} />
      <circle cx="4" cy="20" r="1" fill="currentColor" />
      {/* Meteor streak 2 */}
      <line x1="14" y1="4" x2="6" y2="12" strokeWidth={1.2} strokeDasharray="3 2" />
      {/* Meteor streak 3 */}
      <line x1="20" y1="10" x2="12" y2="18" strokeWidth={1.2} strokeDasharray="3 2" />
    </svg>
  );
}

export function AstronomicalEventGlyph({
  type,
  size = 24,
  className = '',
  strokeWidth = 1.4,
  ...props
}: { type: string } & GlyphProps) {
  const t = glyphKey(type);
  switch (t) {
    case 'ay-tutulmasi':
      return <LunarEclipseGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'gunes-tutulmasi':
      return <SolarEclipseGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'meteor-yagmuru':
      return <MeteorShowerGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'gezegen-kavusumu':
      return <ConjunctionGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
    case 'super-ay':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="12" cy="12" r="9" strokeDasharray="1 2" strokeWidth={1} />
          <circle cx="12" cy="12" r="6.5" fill="currentColor" fillOpacity={0.2} />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    case 'yeni-ay':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="12" cy="12" r="7" strokeDasharray="2 2" strokeWidth={1.2} />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    case 'dolunay':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="12" cy="12" r="7" fill="currentColor" fillOpacity={0.8} />
          <circle cx="12" cy="12" r="9" strokeWidth={0.8} />
        </svg>
      );
    case 'equinoks':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="12" cy="12" r="8" />
          <line x1="4" y1="12" x2="20" y2="12" strokeWidth={1.5} />
          <line x1="6" y1="18" x2="18" y2="6" strokeWidth={1} strokeDasharray="1 2" />
        </svg>
      );
    case 'solstis':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="12" cy="12" r="8" />
          <line x1="6" y1="7" x2="18" y2="7" strokeWidth={1.5} />
          <line x1="6" y1="17" x2="18" y2="17" strokeWidth={1.5} />
          <line x1="12" y1="4" x2="12" y2="20" strokeWidth={1} strokeDasharray="2 2" />
        </svg>
      );
    default:
      return <AstrolabeGlyph size={size} className={className} strokeWidth={strokeWidth} {...props} />;
  }
}

// -----------------------------------------------------------------------------
// SACRED ESOTERIC & LUNAR GLYPHS (Retrogrades, Moon Phases, Numerology)
// -----------------------------------------------------------------------------

export function RetrogradeGlyph({ size = 24, className = '', strokeWidth = 1.5, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Capital R */}
      <line x1="6" y1="4" x2="6" y2="20" strokeWidth={1.8} />
      <path d="M6 4H14C16.5 4 18 5.5 18 8C18 10.5 16.5 12 14 12H6" strokeWidth={1.8} />
      <line x1="12" y1="12" x2="18" y2="20" strokeWidth={1.8} />
      {/* Crossed leg slash (℞) */}
      <line x1="11" y1="18" x2="16" y2="14" strokeWidth={1.6} />
      {/* Outer subtle orbital ring */}
      <circle cx="12" cy="12" r="10.5" strokeWidth={0.8} strokeDasharray="2 3" strokeOpacity={0.6} />
    </svg>
  );
}

export function SacredTetractysGlyph({ size = 24, className = '', strokeWidth = 1.2, ...props }: GlyphProps) {
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      {/* Outer Sacred Triangle */}
      <polygon points="14,3 25,23 3,23" strokeOpacity={0.4} strokeDasharray="1.5 2" />
      {/* Row 1 (1 point) */}
      <circle cx="14" cy="6" r="1.6" fill="currentColor" />
      {/* Row 2 (2 points) */}
      <circle cx="10.5" cy="11.5" r="1.4" fill="currentColor" />
      <circle cx="17.5" cy="11.5" r="1.4" fill="currentColor" />
      {/* Row 3 (3 points) */}
      <circle cx="7" cy="17" r="1.4" fill="currentColor" />
      <circle cx="14" cy="17" r="1.4" fill="currentColor" />
      <circle cx="21" cy="17" r="1.4" fill="currentColor" />
      {/* Row 4 (4 points) */}
      <circle cx="3.5" cy="22.5" r="1.4" fill="currentColor" />
      <circle cx="10.5" cy="22.5" r="1.4" fill="currentColor" />
      <circle cx="17.5" cy="22.5" r="1.4" fill="currentColor" />
      <circle cx="24.5" cy="22.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function MoonPhaseVectorGlyph({
  phaseId,
  size = 28,
  className = '',
  strokeWidth = 1.2,
  ...props
}: { phaseId: string } & GlyphProps) {
  switch (phaseId) {
    case 'new-moon':
      return (
        <svg viewBox="0 0 28 28" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...props}>
          <circle cx="14" cy="14" r="11" strokeDasharray="2 2" strokeOpacity={0.6} />
          <circle cx="14" cy="14" r="11" fill="currentColor" fillOpacity={0.08} />
          <circle cx="14" cy="14" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'waxing-crescent':
      return (
        <svg viewBox="0 0 28 28" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...props}>
          <circle cx="14" cy="14" r="11" strokeOpacity={0.4} />
          <path d="M14 3 A 11 11 0 0 1 14 25 A 7 11 0 0 0 14 3" fill="currentColor" fillOpacity={0.8} />
        </svg>
      );
    case 'first-quarter':
      return (
        <svg viewBox="0 0 28 28" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...props}>
          <circle cx="14" cy="14" r="11" />
          <path d="M14 3 A 11 11 0 0 1 14 25 Z" fill="currentColor" fillOpacity={0.85} />
          <line x1="14" y1="2" x2="14" y2="26" strokeWidth={1} />
        </svg>
      );
    case 'waxing-gibbous':
      return (
        <svg viewBox="0 0 28 28" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...props}>
          <circle cx="14" cy="14" r="11" />
          <path d="M14 3 A 11 11 0 0 1 14 25 A 6 11 0 0 1 14 3" fill="currentColor" fillOpacity={0.85} />
        </svg>
      );
    case 'full-moon':
      return (
        <svg viewBox="0 0 28 28" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...props}>
          <circle cx="14" cy="14" r="11" fill="currentColor" fillOpacity={0.9} />
          <circle cx="14" cy="14" r="13" strokeWidth={0.8} strokeDasharray="1 2" strokeOpacity={0.5} />
        </svg>
      );
    case 'waning-gibbous':
      return (
        <svg viewBox="0 0 28 28" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...props}>
          <circle cx="14" cy="14" r="11" />
          <path d="M14 3 A 11 11 0 0 0 14 25 A 6 11 0 0 0 14 3" fill="currentColor" fillOpacity={0.85} />
        </svg>
      );
    case 'third-quarter':
      return (
        <svg viewBox="0 0 28 28" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...props}>
          <circle cx="14" cy="14" r="11" />
          <path d="M14 3 A 11 11 0 0 0 14 25 Z" fill="currentColor" fillOpacity={0.85} />
          <line x1="14" y1="2" x2="14" y2="26" strokeWidth={1} />
        </svg>
      );
    case 'balsamic-moon':
    default:
      return (
        <svg viewBox="0 0 28 28" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className} {...props}>
          <circle cx="14" cy="14" r="11" strokeOpacity={0.4} />
          <path d="M14 3 A 11 11 0 0 0 14 25 A 7 11 0 0 1 14 3" fill="currentColor" fillOpacity={0.8} />
        </svg>
      );
  }
}

