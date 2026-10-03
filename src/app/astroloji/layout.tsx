import type { Metadata } from 'next';

export const metadata: Metadata = {
  // An object title keeps the root "%s — SpaceTour TR" template working for sub-pages
  title: { absolute: 'Astroloji — SpaceTour TR', template: '%s — SpaceTour TR' },
  description:
    'On iki burç arketipi, doğum haritası, günlük transitler, tarot ve iki haritayı karşılaştıran sinastri analizi.',
};

export default function AstrolojiLayout({ children }: LayoutProps<'/astroloji'>) {
  return children;
}
