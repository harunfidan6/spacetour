import type { Metadata } from 'next';

export const metadata: Metadata = {
  // A plain string here would stop the root template from reaching /ansiklopedi/[id]
  title: { absolute: 'Gezegen Ansiklopedisi — SpaceTour TR', template: '%s — SpaceTour TR' },
  description:
    'Gök cisimlerinin kimlik kartları, 3D hologramlar ve evrenin fiziğini deneyerek öğreten laboratuvar modülleri.',
};

export default function AnsiklopediLayout({ children }: LayoutProps<'/ansiklopedi'>) {
  return children;
}
