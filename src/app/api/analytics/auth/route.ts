import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const key = typeof body?.key === 'string' ? body.key.trim() : '';
    const remember = Boolean(body?.remember);
    const adminKey = process.env.ADMIN_TELEMETRY_KEY || 'astro2026';

    if (!key || key !== adminKey) {
      return NextResponse.json(
        { ok: false, error: 'Hatalı yetki anahtarı. Erişim reddedildi.' },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ ok: true, message: 'Yetkilendirme başarılı.' });

    // Set auth cookie
    res.cookies.set({
      name: 'admin_telemetry_key',
      value: adminKey,
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
      maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8, // 30 days if remember, otherwise 8 hours
      secure: process.env.NODE_ENV === 'production'
    });

    return res;
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Doğrulama hatası' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true, message: 'Oturum kapatıldı.' });
  res.cookies.set({
    name: 'admin_telemetry_key',
    value: '',
    path: '/',
    maxAge: 0
  });
  return res;
}

export async function GET(req: NextRequest) {
  const adminKey = process.env.ADMIN_TELEMETRY_KEY || 'astro2026';
  const cookieKey = req.cookies.get('admin_telemetry_key')?.value;
  const headerKey = req.headers.get('x-admin-key');
  const authenticated = cookieKey === adminKey || headerKey === adminKey;

  return NextResponse.json({ authenticated });
}
