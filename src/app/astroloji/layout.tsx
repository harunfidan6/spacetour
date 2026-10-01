import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Astroloji',
  description:
    'On iki burç arketipi, doğum haritası, günlük transitler, tarot ve iki haritayı karşılaştıran sinastri analizi.',
};

export default function AstrolojiLayout({ children }: LayoutProps<'/astroloji'>) {
  return children;
}
