import type { Metadata } from 'next';

export const metadata: Metadata = {
  // An object title keeps the root "%s — SpaceTour TR" template working for sub-pages
  title: { absolute: 'Gök Olayları Takvimi — SpaceTour TR', template: '%s — SpaceTour TR' },
  description:
    'Güneş ve Ay tutulmaları, meteor yağmurları, gezegen kavuşumları ve ekinokslar. Gözlem planını yap, geri sayımı başlat.',
};

export default function TakvimLayout({ children }: LayoutProps<'/takvim'>) {
  return children;
}
