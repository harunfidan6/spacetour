import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gök Haritası',
  description:
    'Konumuna göre anlık hesaplanan 360° interaktif planetaryum, en parlak kerteriz yıldızları, ışık kirliliği (Bortle) analizi ve Messier derin uzay atlası.',
};

export default function HaritaLayout({ children }: LayoutProps<'/harita'>) {
  return children;
}
