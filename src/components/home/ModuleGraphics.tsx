/* Looping vector vignettes for each module — pure SVG + CSS keyframes. */

const ORION = [
  [-60, -80], [55, -70], [-18, -8], [0, -4], [18, 0], [-50, 80], [62, 74], [0, -120],
] as const;
const ORION_LINES = [
  [7, 0], [7, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6],
] as const;

export function HaritaGraphic() {
  return (
    <svg viewBox="-160 -160 320 320" className="h-full w-full" aria-hidden>
      <g className="spin-slower">
        <circle r="150" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="2 6" />
        <circle r="100" fill="none" stroke="currentColor" strokeOpacity="0.2" />
      </g>
      <g style={{ animation: 'spin-slow 5s linear infinite' }}>
        <path d="M0 0 L0 -150 A150 150 0 0 1 106 -106 Z" fill="currentColor" opacity="0.12" />
        <line y2="-150" stroke="currentColor" strokeWidth="1.5" />
      </g>
      {ORION_LINES.map(([a, b], i) => (
        <line
          key={i}
          x1={ORION[a][0]}
          y1={ORION[a][1]}
          x2={ORION[b][0]}
          y2={ORION[b][1]}
          pathLength={1}
          stroke="currentColor"
          strokeWidth="1.6"
          className="draw-loop"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
      {ORION.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 || i === 6 ? 6 : 4} fill="currentColor" className="twinkle" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      <path d="M-160 0H-120M120 0H160M0 -160V-128M0 128V160" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function TakvimGraphic() {
  return (
    <svg viewBox="0 0 360 280" className="h-full w-full" aria-hidden>
      {Array.from({ length: 8 }, (_, i) => {
        const x = 26 + i * 44;
        const k = Math.round(Math.cos((i / 8) * Math.PI * 2) * 1000) / 1000;
        const waxing = i < 4;
        return (
          <g key={i} transform={`translate(${x} 56)`}>
            <circle r="17" fill="currentColor" opacity="0.18" />
            <path d={waxing ? 'M0,-17 A17,17 0 0,1 0,17 Z' : 'M0,-17 A17,17 0 0,0 0,17 Z'} fill="currentColor" opacity={i === 0 ? 0 : 1} />
            <ellipse rx={Math.abs(k) * 17} ry="17" fill="currentColor" opacity={k > 0 ? 0.18 : 1} />
          </g>
        );
      })}
      <rect x="4" y="30" width="44" height="52" fill="none" stroke="currentColor" strokeWidth="2" className="slide-8" />
      {Array.from({ length: 35 }, (_, i) => {
        const col = i % 7;
        const row = Math.floor(i / 7);
        const hot = [4, 11, 17, 23, 30].includes(i);
        return (
          <rect
            key={i}
            x={26 + col * 46}
            y={112 + row * 32}
            width="30"
            height="22"
            fill="currentColor"
            opacity={hot ? 1 : 0.14}
            className={hot ? 'twinkle' : undefined}
            style={hot ? { animationDelay: `${i * 0.12}s` } : undefined}
          />
        );
      })}
    </svg>
  );
}

const SIZES = [
  { r: 5, label: 'Me' },
  { r: 11, label: 'V' },
  { r: 12, label: 'D' },
  { r: 7, label: 'Ma' },
  { r: 58, label: 'J' },
  { r: 48, label: 'S' },
  { r: 22, label: 'U' },
  { r: 21, label: 'N' },
].reduce<{ r: number; label: string; cx: number }[]>((acc, p) => {
  const prev = acc[acc.length - 1];
  const cx = (prev ? prev.cx + prev.r + 6 : 6) + p.r;
  return [...acc, { ...p, cx }];
}, []);

export function AnsiklopediGraphic() {
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" aria-hidden>
      <line x1="0" x2="400" y1="200" y2="200" stroke="currentColor" strokeOpacity="0.4" />
      {SIZES.map((p, i) => {
        const { cx } = p;
        return (
          <g key={p.label}>
            <circle cx={cx} cy={200 - p.r} r={p.r} fill="currentColor" className="pop" style={{ animationDelay: `${i * 0.12}s` }} />
            <text x={cx} y="222" textAnchor="middle" fill="currentColor" style={{ font: '600 10px var(--font-mono)', letterSpacing: '0.1em' }}>
              {p.label}
            </text>
          </g>
        );
      })}
      <line x1="0" x2="0" y1="20" y2="240" stroke="currentColor" strokeWidth="1.5" className="scan-x" />
      <text x="0" y="40" fill="currentColor" style={{ font: '600 10px var(--font-mono)', letterSpacing: '0.14em' }}>
        ÖLÇEK 1 : 10.000 KM
      </text>
    </svg>
  );
}

/** Round for SSR/CSR-stable SVG attributes. */
const r2 = (n: number) => Math.round(n * 100) / 100;

/** Zodiac signs forced to text presentation (U+FE0E) so they never render as emoji tiles. */
const GLYPHS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((g) => `${g}︎`);

export function AstrolojiGraphic() {
  return (
    <svg viewBox="-160 -160 320 320" className="h-full w-full" aria-hidden>
      <g className="spin-slower">
        <circle r="148" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle r="112" fill="none" stroke="currentColor" strokeWidth="1" />
        {GLYPHS.map((g, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          return (
            <g key={g}>
              <line x1={r2(Math.cos(a + Math.PI / 12) * 112)} y1={r2(Math.sin(a + Math.PI / 12) * 112)} x2={r2(Math.cos(a + Math.PI / 12) * 148)} y2={r2(Math.sin(a + Math.PI / 12) * 148)} stroke="currentColor" />
              <text x={r2(Math.cos(a) * 130)} y={r2(Math.sin(a) * 130)} textAnchor="middle" dominantBaseline="central" fill="currentColor" className="glyph" style={{ fontSize: 22 }}>
                {g}
              </text>
            </g>
          );
        })}
      </g>
      <g className="spin-rev">
        <polygon points="0,-96 83,48 -83,48" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="0,96 83,-48 -83,-48" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </g>
      <circle r="18" fill="currentColor" />
    </svg>
  );
}

export function GozlemeviGraphic() {
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" aria-hidden>
      {Array.from({ length: 28 }, (_, i) => (
        <rect
          key={i}
          x={8 + i * 14}
          y="40"
          width="8"
          height="170"
          fill="currentColor"
          className="eq-bar"
          style={{ animationDelay: `${-(i * 0.137) % 1.3}s`, animationDuration: `${0.9 + (i % 5) * 0.15}s` }}
        />
      ))}
      <path d="M0 225 Q 25 205 50 225 T 100 225 T 150 225 T 200 225 T 250 225 T 300 225 T 350 225 T 400 225 T 450 225 T 500 225" fill="none" stroke="currentColor" strokeWidth="2" className="wave-x" />
      <text x="0" y="22" fill="currentColor" style={{ font: '600 10px var(--font-mono)', letterSpacing: '0.14em' }}>
        RADYO · KIZILÖTESİ · GÖRÜNÜR · X-IŞINI
      </text>
    </svg>
  );
}
