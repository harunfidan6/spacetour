import type { Metadata } from 'next';

export const metadata: Metadata = {
  // An object title keeps the root "%s — SpaceTour TR" template working for sub-pages
  title: { absolute: 'Canlı Gökyüzü — SpaceTour TR', template: '%s — SpaceTour TR' },
  description:
    'ISS’in anlık konumu, NOAA uzay hava durumu, bu gece görülebilecek gezegenler ve yıldızlararası sondalar.',
};

export default function CanliLayout({ children }: LayoutProps<'/canli'>) {
  return children;
}
