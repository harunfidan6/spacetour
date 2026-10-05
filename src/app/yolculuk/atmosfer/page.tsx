import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { AtmosphereToSpaceElevator } from '@/components/space/AtmosphereToSpaceElevator';

export const metadata: Metadata = buildPageMetadata({
  path: '/yolculuk/atmosfer',
  title: 'Atmosferden Uzaya Yükseliş Simülatörü | SpaceTour TR',
  description: 'Troposferden Kármán hattına, ISS’ten jeostasyoner yörüngeye 0–35.786 km yükseliş: irtifaya göre basınç, sıcaklık ve yerçekimini canlı izle.',
});

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

      <header className="max-w-3xl space-y-2">
        <h1 className="display display-tight text-3xl sm:text-4xl text-paper">Atmosferden uzaya dikey yükseliş</h1>
        <p className="text-sm leading-relaxed text-paper/70">
          Deniz seviyesinden jeostasyoner yörüngeye, 35.786 km’ye yüksel: troposfer, ozon tabakası, Kármán hattı ve ISS’in
          yörüngesi boyunca basıncın, sıcaklığın ve yerçekiminin nasıl değiştiğini izle.
        </p>
      </header>

      <AtmosphereToSpaceElevator />
    </div>
  );
}
