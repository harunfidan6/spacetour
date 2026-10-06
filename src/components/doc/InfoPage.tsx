import type { ReactNode } from 'react';
import Link from 'next/link';

export const CONTACT_EMAIL = 'info@spacetour.com.tr';

const PAGES = [
  { href: '/hakkinda', label: 'Hakkında' },
  { href: '/yontem', label: 'Yöntem ve kaynaklar' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/gizlilik', label: 'Gizlilik ve KVKK' },
  { href: '/cerezler', label: 'Çerez politikası' },
];

/** Kurumsal ve yasal sayfaların ortak düzeni: başlık, kısa giriş, güncelleme tarihi, metin, sayfalar arası gezinme */
export function InfoPage({ kicker, title, lede, updated, path, children }: { kicker: string; title: string; lede: string; updated: string; path: string; children: ReactNode }) {
  return (
    <div className="px-[var(--gutter)] pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-3xl">
        <span className="doc-kicker text-gold">{kicker}</span>
        <h1 className="doc-title mt-3 text-4xl text-paper sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-paper/80">{lede}</p>
        <p className="mt-3 font-mono text-xs text-muted">Son güncelleme: {updated}</p>
        <div className="info-prose mt-12 space-y-10 text-base leading-relaxed text-paper/85">{children}</div>
        <nav aria-label="Kurumsal sayfalar" className="mt-16 flex flex-wrap gap-2 border-t border-line pt-6 font-mono text-xs">
          {PAGES.filter((p) => p.href !== path).map((p) => (
            <Link key={p.href} href={p.href} className="border border-line px-3 py-2 text-paper/80 hover:border-gold hover:text-gold">{p.label}</Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="doc-title text-2xl text-paper">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export const INFO_PAGES = PAGES;
