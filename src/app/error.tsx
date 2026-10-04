'use client';

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { LostInSpace } from '@/components/ui/LostInSpace';

/** Route-level error boundary: keeps the site chrome and offers a retry. */
export default function RouteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <LostInSpace
      code="Hata"
      kicker="(Sinyal) Bağlantı koptu"
      title="Bu bölüm şu an yüklenemedi"
      text="Geçici bir aksaklık oldu. Sayfayı yeniden deneyebilir ya da ana sayfadan yolculuğa devam edebilirsin."
      href="/"
      cta="Ana sayfaya dön"
      actions={
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-paper transition-colors hover:border-gold hover:text-gold"
        >
          <RotateCcw size={15} /> Tekrar dene
        </button>
      }
    />
  );
}
