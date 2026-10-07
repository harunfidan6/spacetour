'use client';

import { useState, useSyncExternalStore } from 'react';
import { Check, Link2, Send, Share2 } from 'lucide-react';

const noop = () => () => {};
// Telefonların kendi paylaşım menüsü (Web Share API) yalnızca tarayıcıda bilinir
const useCanNativeShare = () =>
  useSyncExternalStore(noop, () => typeof navigator !== 'undefined' && typeof navigator.share === 'function', () => false);

/** WhatsApp, X, Telegram, bağlantı kopyalama ve (telefonda) sistem paylaşım menüsü. */
export function ShareButtons({ url, text, title, label = 'Paylaş' }: { url: string; text: string; title: string; label?: string }) {
  const canNativeShare = useCanNativeShare();
  const [copied, setCopied] = useState(false);
  const message = `${text} ${url}`;

  const links = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(message)}` },
    { name: 'X', href: `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    { name: 'Telegram', href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // pano izni yoksa sessizce geç
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text, url });
    } catch {
      // kullanıcı paylaşımı iptal etti
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="mr-1 inline-flex items-center gap-1.5 font-medium text-gold"><Share2 size={14} />{label}</span>
      {canNativeShare && (
        <button type="button" onClick={nativeShare} className="inline-flex items-center gap-1.5 border border-gold bg-gold px-3 py-2 font-semibold text-ink hover:opacity-90">
          <Send size={12} /> Paylaş…
        </button>
      )}
      {links.map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="border border-line px-3 py-2 text-paper/85 hover:border-gold hover:text-gold">
          {l.name}
        </a>
      ))}
      <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-paper/85 hover:border-gold hover:text-gold" aria-live="polite">
        {copied ? <Check size={12} /> : <Link2 size={12} />} {copied ? 'Kopyalandı' : 'Bağlantıyı kopyala'}
      </button>
    </div>
  );
}
