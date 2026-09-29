import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SplitReveal } from '@/components/motion/SplitReveal';

/** 404 title card: a black hole slowly swallowing its accretion rings. */
export function LostInSpace({ title, text, href, cta }: { title: string; text: string; href: string; cta: string }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-[var(--gutter)] pb-16 pt-28">
      <svg viewBox="-200 -200 400 400" className="pointer-events-none absolute right-[-20vw] top-1/2 h-[120vmin] w-[120vmin] -translate-y-1/2 opacity-70 sm:right-[-8vw]" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i} className={i % 2 ? 'spin-slow' : 'spin-rev'} style={{ animationDuration: `${14 + i * 5}s` }}>
            <ellipse rx={60 + i * 16} ry={(60 + i * 16) * 0.32} fill="none" stroke={i % 3 === 0 ? 'var(--solar)' : 'var(--paper)'} strokeOpacity={0.5 - i * 0.04} strokeDasharray={i % 2 ? '2 8' : undefined} />
          </g>
        ))}
        <circle r="52" fill="var(--ink)" stroke="var(--gold)" strokeWidth="1.5" />
      </svg>

      <div className="relative">
        <div className="label text-solar">(404) Sinyal kayboldu</div>
        <SplitReveal as="h1" trigger="intro" effect="tilt" className="display mt-6 text-[clamp(6rem,26vw,24rem)] leading-[0.78] text-paper">
          404
        </SplitReveal>
        <SplitReveal as="p" trigger="intro" delay={0.2} className="display display-tight mt-4 max-w-3xl text-[clamp(1.8rem,4vw,3.6rem)] text-paper">
          {title}
        </SplitReveal>
        <p className="mt-6 max-w-md text-base leading-relaxed text-paper/65">{text}</p>
        <Link href={href} className="group mt-10 inline-flex items-center gap-3 rounded-full bg-paper py-3 pl-3 pr-6 text-sm font-semibold text-ink transition-colors hover:bg-solar">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-paper transition-transform group-hover:-translate-x-0.5">
            <ArrowLeft size={15} />
          </span>
          {cta}
        </Link>
      </div>
    </section>
  );
}
