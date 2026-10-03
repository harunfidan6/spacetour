import type { Metadata } from 'next';

export const metadata: Metadata = {
  // An object title keeps the root "%s — SpaceTour TR" template working for sub-pages
  title: { absolute: 'Gök Haritası — SpaceTour TR', template: '%s — SpaceTour TR' },
  description:
    'Konumuna göre anlık hesaplanan 360° interaktif planetaryum, en parlak kerteriz yıldızları, ışık kirliliği (Bortle) analizi ve Messier derin uzay atlası.',
};

export default function HaritaLayout({ children }: LayoutProps<'/harita'>) {
  return children;
}
