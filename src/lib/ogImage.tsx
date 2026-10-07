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

/**
 * Günlük burç paylaşım kartı (1200×630): burç, tarih, günün yorumunun açılış cümlesi ve
 * aşk / kariyer / şans puanları. WhatsApp ve sosyal ağlarda bağlantı önizlemesi olarak görünür.
 */
export function renderDailyHoroscopeOg({ sign, signMeta, date, headline, scores, footer }: {
  sign: string;
  /** "21 Mart – 19 Nisan · Ateş" (burç sembolü yazı tipinde olmadığı için yazıyla) */
  signMeta: string;
  date: string;
  headline: string;
  scores: { label: string; value: number; color: string }[];
  footer: string;
}) {
  const gold = '#f5c542';
  const text = clip(headline, 140);
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #020206 0%, #0b0a18 50%, #1a1430 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 72px',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: '720px',
            height: '720px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${rgba(gold, 0.2)} 0%, rgba(0, 0, 0, 0) 70%)`,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- next/og yalnızca img kabul eder */}
            <img src={LOGO} width={52} height={52} alt="" />
            <div style={{ fontSize: '20px', letterSpacing: '0.3em', color: gold }}>SPACETOUR.COM.TR</div>
          </div>
          <div style={{ display: 'flex', fontSize: '18px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.75)' }}>
            {date}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1000px' }}>
          <div style={{ display: 'flex', fontSize: '18px', letterSpacing: '0.18em', textTransform: 'uppercase', color: gold }}>{signMeta}</div>
          <div style={{ display: 'flex', fontSize: '68px', fontWeight: 600, lineHeight: 1 }}>{`${sign} burcu bugün`}</div>
          <div style={{ display: 'flex', fontSize: text.length > 95 ? '27px' : '31px', lineHeight: 1.35, color: 'rgba(240, 240, 246, 0.85)' }}>{text}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '36px' }}>
            {scores.map((sc) => (
              <div key={sc.label} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '330px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', color: 'rgba(255, 255, 255, 0.75)' }}>
                  <span>{sc.label}</span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>{`%${sc.value}`}</span>
                </div>
                <div style={{ display: 'flex', height: '10px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.12)' }}>
                  <div style={{ display: 'flex', width: `${sc.value}%`, height: '10px', borderRadius: '999px', background: sc.color }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', fontSize: '17px', color: '#a0a0b2' }}>{clip(footer, 100)}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
