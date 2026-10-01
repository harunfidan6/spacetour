import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gök Olayları Takvimi',
  description:
    'Güneş ve Ay tutulmaları, meteor yağmurları, gezegen kavuşumları ve ekinokslar. Gözlem planını yap, geri sayımı başlat.',
};

export default function TakvimLayout({ children }: LayoutProps<'/takvim'>) {
  return children;
}
