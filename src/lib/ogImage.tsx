import { ImageResponse } from 'next/og';
import type { SectionId } from '@/data/sections';
import { logoDataUri, logoSmallSvg } from '@/lib/logoSvg';

const LOGO = logoDataUri(logoSmallSvg({ background: false, id: 'og' }));

/** Bölüm renkleri (paylaşım görselleri CSS değişkenlerini okuyamaz) */
export const SECTION_ACCENT: Record<SectionId, string> = {
  harita: '#38bdf8',
  takvim: '#f59e0b',
  ansiklopedi: '#a78bfa',
  astroloji: '#f5c542',
  gozlemevi: '#34d399',
  canli: '#f43f5e',
  yolculuk: '#00d4ff',
};

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

/**
 * Sitenin ortak paylaşım görseli (1200×630): üstte alan adı ve künye, ortada başlık ve
 * açıklama, altta kısa bilgi satırı. Ana sayfa görseliyle aynı görsel dil.
 */
export function renderOgImage({ kicker, title, subtitle, footer, accent = '#f5c542' }: {
  kicker?: string;
  title: string;
  subtitle?: string;
  footer?: string;
  accent?: string;
}) {
  const titleSize = title.length > 36 ? 54 : title.length > 22 ? 66 : 80;
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #020206 0%, #090914 45%, #120e24 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-14%',
            right: '-6%',
            width: '640px',
            height: '640px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${rgba(accent, 0.22)} 0%, rgba(0, 0, 0, 0) 70%)`,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- next/og yalnızca img kabul eder */}
            <img src={LOGO} width={56} height={56} alt="" />
            <div style={{ fontSize: '20px', letterSpacing: '0.3em', color: accent }}>SPACETOUR.COM.TR</div>
          </div>
          {kicker ? (
            <div
              style={{
                display: 'flex',
                fontSize: '14px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.72)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '999px',
                padding: '8px 18px',
              }}
            >
              {kicker}
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1020px' }}>
          <div style={{ display: 'flex', fontSize: `${titleSize}px`, fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.01em' }}>
            {clip(title, 70)}
          </div>
          {subtitle ? (
            <div style={{ display: 'flex', fontSize: '26px', lineHeight: 1.4, color: 'rgba(240, 240, 246, 0.8)' }}>
              {clip(subtitle, 150)}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '24px',
            fontSize: '17px',
            color: '#a0a0b2',
          }}
        >
          <span style={{ color: accent }}>●</span>
          <span>{clip(footer ?? 'Kinetik uzay atlası', 90)}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
