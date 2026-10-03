import type { Metadata } from 'next';

export const metadata: Metadata = {
  // An object title keeps the root "%s — SpaceTour TR" template working for sub-pages
  title: { absolute: 'Gözlemevi — SpaceTour TR', template: '%s — SpaceTour TR' },
  description:
    'Evreni Webb’in kızılötesi, Chandra’nın X-ışını ve dev radyo çanaklarının gözünden izle: çok dalgaboylu gözlem laboratuvarları.',
};

export default function GozlemeviLayout({ children }: LayoutProps<'/gozlemevi'>) {
  return children;
}
