export interface SiteRoute {
  href: string;
  label: string;
  index: string;
  accent: string;
  blurb: string;
}

export const SITE_ROUTES: SiteRoute[] = [
  { href: '/', label: 'Ana Sayfa', index: '00', accent: 'var(--solar)', blurb: 'Kinetik uzay atlası' },
  { href: '/harita', label: 'Gök Haritası', index: '01', accent: 'var(--lime)', blurb: '360° planetaryum & AR' },
  { href: '/takvim', label: 'Olay Takvimi', index: '02', accent: 'var(--solar)', blurb: 'Tutulmalar, yağmurlar, kavuşumlar' },
  { href: '/ansiklopedi', label: 'Ansiklopedi', index: '03', accent: 'var(--violet)', blurb: 'Gezegenler, laboratuvar, orrery' },
  { href: '/astroloji', label: 'Astroloji', index: '04', accent: 'var(--gold)', blurb: 'Doğum haritası, tarot, sinastri' },
  { href: '/gozlemevi', label: 'Gözlemevi', index: '05', accent: 'var(--rose)', blurb: 'Çok dalgaboylu derin uzay' },
];

export const TELEMETRY_ROUTE: SiteRoute = {
  href: '/admin/analitik',
  label: 'Canlı Telemetri',
  index: '06',
  accent: 'var(--lime)',
  blurb: 'Ziyaretçi & trafik paneli',
};

export function routeFor(pathname: string): SiteRoute {
  if (pathname.startsWith(TELEMETRY_ROUTE.href)) return TELEMETRY_ROUTE;
  const match = SITE_ROUTES.filter((r) => r.href !== '/' && pathname.startsWith(r.href))[0];
  return match ?? SITE_ROUTES[0];
}
