import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gözlemevi',
  description:
    'Evreni Webb’in kızılötesi, Chandra’nın X-ışını ve dev radyo çanaklarının gözünden izle: çok dalgaboylu gözlem laboratuvarları.',
};

export default function GozlemeviLayout({ children }: LayoutProps<'/gozlemevi'>) {
  return children;
}
