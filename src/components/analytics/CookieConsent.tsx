'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';

const KEY = 'spacetour:cerez';
const GA_ID = 'G-5F797S90G9';
export const OPEN_EVENT = 'spacetour:cerez-tercihi';
type Choice = 'kabul' | 'red';

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'kabul' || v === 'red' ? v : null;
  } catch {
    return null;
  }
}

/** Reddedilince Google Analytics çerezlerini siler ve o sayfada ölçümü durdurur */
function dropGaCookies() {
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
  const host = window.location.hostname;
  for (const c of document.cookie.split(';')) {
    const name = c.split('=')[0].trim();
    if (!name.startsWith('_ga')) continue;
    for (const domain of ['', `; domain=${host}`, `; domain=.${host.replace(/^www\./, '')}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}

/**
 * Çerez onayı: Google Analytics yalnızca ziyaretçi kabul ederse yüklenir. Çerezsiz araçlar
 * (Plausible, Vercel Analytics) ve sitenin kendi anonim istatistikleri bundan bağımsızdır.
 */
export function CookieConsent() {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.film !== undefined || window.location.pathname.startsWith('/admin')) return;
    const c = readChoice();
    const id = requestAnimationFrame(() => {
      setChoice(c);
      setOpen(c === null);
    });
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener(OPEN_EVENT, reopen);
    };
  }, []);

  const decide = (c: Choice) => {
    try {
      localStorage.setItem(KEY, c);
    } catch {
      /* depolama kapalı: tercih bu ziyaret için geçerli */
    }
    if (c === 'red') dropGaCookies();
    setChoice(c);
    setOpen(false);
  };

  return (
    <>
      {choice === 'kabul' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
          <Script id="ga4-init" strategy="lazyOnload">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:true});`}
          </Script>
        </>
      )}
      {open && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Çerez tercihi"
          className="fixed inset-x-3 bottom-3 z-[200] border border-line bg-ink-2/95 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-sm"
        >
          <p className="doc-kicker text-gold">Çerezler</p>
          <p className="mt-2 text-sm leading-relaxed text-paper/85">
            Ziyaret istatistikleri için Google Analytics çerezlerini kullanmak istiyoruz. Reddetseniz de site eksiksiz çalışır.{' '}
            <Link href="/cerezler" className="text-gold underline underline-offset-2 hover:text-paper">Çerez politikası</Link>
          </p>
          <div className="mt-4 flex gap-2 font-mono text-xs">
            <button type="button" onClick={() => decide('kabul')} className="flex-1 border border-gold bg-gold px-3 py-2 font-bold text-ink hover:bg-gold/90">
              Kabul et
            </button>
            <button type="button" onClick={() => decide('red')} className="flex-1 border border-line px-3 py-2 text-paper/85 hover:border-paper">
              Reddet
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Çerez politikası sayfasından tercihi yeniden açar */
export function CookiePreferenceButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className="border border-gold px-4 py-2 font-mono text-xs text-gold hover:bg-gold hover:text-ink"
    >
      Çerez tercihimi değiştir
    </button>
  );
}
