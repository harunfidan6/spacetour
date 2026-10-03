import type { Metadata } from 'next';

export const metadata: Metadata = {
  // An object title keeps the root "%s — SpaceTour TR" template working for sub-pages
  title: { absolute: 'Göklerde Yolculuk — SpaceTour TR', template: '%s — SpaceTour TR' },
  description:
    'Güneş Sistemi’nde 3D yolculuk: didaktik dizilim ve gerçek J2000 yörünge konumları.',
};

export default function YolculukLayout({ children }: LayoutProps<'/yolculuk'>) {
  return children;
}
