import { SECTIONS } from '@/data/sections';
import { DOC_IMAGES } from '@/data/docImages';
import type { AstroImage } from '@/data/astroImages';

export interface SiteRoute {
  href: string;
  label: string;
  /** Compact label for the desktop bar. */
  short: string;
  index: string;
  accent: string;
  blurb: string;
  image: AstroImage;
}

const SHORT: Record<string, string> = {
  harita: 'Harita',
  takvim: 'Takvim',
  ansiklopedi: 'Ansiklopedi',
  astroloji: 'Astroloji',
  gozlemevi: 'Gözlemevi',
  canli: 'Canlı',
  yolculuk: 'Yolculuk',
};

export const SITE_ROUTES: SiteRoute[] = [
  {
    href: '/',
    label: 'Ana Sayfa',
    short: 'Ana Sayfa',
    index: '00',
    accent: 'var(--gold)',
    blurb: 'Bir uzay belgeseli',
    image: DOC_IMAGES['sec-yolculuk'],
  },
  ...SECTIONS.map((s) => ({
    href: s.href,
    label: s.title,
    short: SHORT[s.id] ?? s.title,
    index: s.chapter,
    accent: s.accent,
    blurb: s.kicker,
    image: s.image,
  })),
];

export const TELEMETRY_ROUTE: SiteRoute = {
  href: '/admin/analitik',
  label: 'Canlı Telemetri',
  short: 'Telemetri',
  index: '08',
  accent: 'var(--lime)',
  blurb: 'Ziyaretçi & trafik paneli',
  image: DOC_IMAGES['sec-canli'],
};

export function routeFor(pathname: string): SiteRoute {
  if (pathname.startsWith(TELEMETRY_ROUTE.href)) return TELEMETRY_ROUTE;
  const match = SITE_ROUTES.filter((r) => r.href !== '/' && pathname.startsWith(r.href))[0];
  return match ?? SITE_ROUTES[0];
}
