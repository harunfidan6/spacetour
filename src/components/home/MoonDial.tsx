import { MoonOrb } from '@/components/space/PlanetOrb';

const SYNODIC = 29.53;
const MARKS = [
  { at: 0, label: 'Yeni Ay' },
  { at: 0.25, label: 'İlk dördün' },
  { at: 0.5, label: 'Dolunay' },
  { at: 0.75, label: 'Son dördün' },
];

const point = (fraction: number, r: number) => {
  const a = fraction * Math.PI * 2 - Math.PI / 2;
  return [50 + Math.cos(a) * r, 50 + Math.sin(a) * r] as const;
};

/** Bugünün Ay'ı, çevresinde 29,5 günlük evre kadranı: tepede yeni Ay, saat yönünde ilerler. */
export function MoonDial({ fraction, illumination, name, age }: { fraction: number; illumination: number; name: string; age: number }) {
  const R = 46;
  const [mx, my] = point(fraction, R);
  const large = fraction > 0.5 ? 1 : 0;

  return (
    <figure className="relative mx-auto w-[min(78vw,460px)]">
      <div className="relative aspect-square">
        <div aria-hidden className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,rgb(239_236_230/0.10),transparent_70%)] blur-2xl" />
        <div className="absolute inset-[15%]">
          <MoonOrb fraction={fraction} className="h-full w-full" />
        </div>
        <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
          <circle cx="50" cy="50" r={R} fill="none" stroke="rgb(239 236 230 / 0.14)" strokeWidth="0.3" />
          {Array.from({ length: 30 }, (_, i) => {
            const [x1, y1] = point(i / 30, R - 1.2);
            const [x2, y2] = point(i / 30, R + 0.8);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgb(239 236 230 / 0.3)" strokeWidth="0.3" />;
          })}
          {MARKS.map((m) => {
            const [x1, y1] = point(m.at, R - 2);
            const [x2, y2] = point(m.at, R + 2);
            return <line key={m.at} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgb(239 236 230 / 0.6)" strokeWidth="0.4" />;
          })}
          <path d={`M 50 ${50 - R} A ${R} ${R} 0 ${large} 1 ${mx} ${my}`} fill="none" stroke="var(--gold)" strokeWidth="0.6" strokeLinecap="round" />
          <circle cx={mx} cy={my} r="1.5" fill="var(--gold)" />
          {MARKS.map((m) => {
            const [x, y] = point(m.at, R + 4.5);
            return (
              <text
                key={m.label}
                x={x}
                y={y}
                fill="rgb(239 236 230 / 0.6)"
                fontSize="2.6"
                textAnchor={m.at === 0.25 ? 'start' : m.at === 0.75 ? 'end' : 'middle'}
                dominantBaseline={m.at === 0 ? 'auto' : m.at === 0.5 ? 'hanging' : 'middle'}
                className="hidden sm:block"
              >
                {m.label}
              </text>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-white/15 pt-3 text-sm">
        <span className="text-paper/65">Ay evresi · {Math.round(age)}. gün / {SYNODIC.toLocaleString('tr-TR')}</span>
        <span className="font-medium text-paper">
          %{Math.round(illumination * 100)} · {name}
        </span>
      </figcaption>
    </figure>
  );
}
