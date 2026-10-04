import { ImageResponse } from 'next/og';

export const alt = 'SpaceTour TR — Kinetik Uzay Atlası & 3D Planetaryum';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
        {/* Subtle radial cosmic glow accents */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            left: '10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 197, 66, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
          }}
        />

        {/* Top Header / Kicker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: '1.5px solid #00d4ff',
                background: 'rgba(0, 212, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              ✦
            </div>
            <span
              style={{
                fontSize: '20px',
                letterSpacing: '0.25em',
                fontWeight: 700,
                color: '#00d4ff',
                textTransform: 'uppercase',
              }}
            >
              SPACETOUR.COM.TR
            </span>
          </div>

          <div
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '14px',
              letterSpacing: '0.1em',
              color: 'rgba(255, 255, 255, 0.7)',
              textTransform: 'uppercase',
            }}
          >
            Kinetik Uzay Atlası
          </div>
        </div>

        {/* Center Main Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '960px' }}>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            Evrenin Geometrisini Keşfet
          </div>
          <div
            style={{
              fontSize: '24px',
              lineHeight: 1.45,
              color: 'rgba(240, 240, 246, 0.8)',
              fontWeight: 400,
            }}
          >
            3D Planetaryum · Canlı ISS Takibi · Güneş Sistemi Simülasyonu · 2026 Gök Olayları · 12 Arketip Astroloji Atlası
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#a0a0b2' }}>
            <span style={{ color: '#00d4ff' }}>●</span> 360° Gökkubbe
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#a0a0b2' }}>
            <span style={{ color: '#f5c542' }}>●</span> Keldani Efemerisi
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#a0a0b2' }}>
            <span style={{ color: '#a855f7' }}>●</span> J2000 Simülatörü
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#a0a0b2' }}>
            <span style={{ color: '#10b981' }}>●</span> NOAA Uzay Havası
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
