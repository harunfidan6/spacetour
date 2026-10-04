import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { AtmosphereToSpaceElevator } from '@/components/space/AtmosphereToSpaceElevator';

export const metadata: Metadata = {
  title: 'Atmosferden Uzaya Dikey Yükseliş · 0 – 35.786 km',
  description:
    'Troposfer, Ozon tabakası, Kármán Hattı, ISS ve Jeostasyoner yörünge: İrtifa bazlı barometrik basınç, sıcaklık ve yerçekimi simülatörü.',
};

export default function AtmosferPage() {
  return (
    <div className="mx-auto max-w-[var(--container)] px-[var(--gutter)] py-8 space-y-6">
      <nav aria-label="Ekmek kırıntısı" className="flex items-center gap-2 font-mono text-xs text-muted">
        <Link href="/yolculuk" className="hover:text-paper transition-colors">
          Yolculuk
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-paper font-semibold">Atmosferden Uzaya Dikey Yükseliş</span>
      </nav>

      <AtmosphereToSpaceElevator />
    </div>
  );
}
