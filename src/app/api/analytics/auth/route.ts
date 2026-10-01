import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  LEGACY_ADMIN_COOKIE,
  clearFailures,
  clientIp,
  createSessionToken,
  getAdminKey,
  isAdminRequest,
  isValidAdminKey,
  registerFailure,
  throttleRemaining,
} from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!getAdminKey()) {
    return NextResponse.json(
      { ok: false, error: 'Telemetri anahtarı sunucuda yapılandırılmamış (ADMIN_TELEMETRY_KEY).' },
      { status: 503 }
    );
  }

  const ip = clientIp(req);
  const wait = throttleRemaining(ip);
  if (wait > 0) {
    return NextResponse.json(
      { ok: false, error: `Çok fazla hatalı deneme. ${Math.ceil(wait / 60)} dakika sonra tekrar dene.` },
      { status: 429, headers: { 'Retry-After': String(wait) } }
    );
  }

  const body = await req.json().catch(() => ({}));
  const key = typeof body?.key === 'string' ? body.key.trim() : '';
  const remember = Boolean(body?.remember);

  if (!isValidAdminKey(key)) {
    registerFailure(ip);
    return NextResponse.json(
      { ok: false, error: 'Hatalı yetki anahtarı. Erişim reddedildi.' },
      { status: 401 }
    );
  }

  clearFailures(ip);
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8; // 30 days if remember, otherwise 8 hours
  const res = NextResponse.json({ ok: true, message: 'Yetkilendirme başarılı.' });

  res.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createSessionToken(maxAge) ?? '',
    path: '/',
    sameSite: 'strict',
    httpOnly: true,
    maxAge,
    secure: process.env.NODE_ENV === 'production',
  });
  res.cookies.delete(LEGACY_ADMIN_COOKIE);

  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true, message: 'Oturum kapatıldı.' });
  res.cookies.delete(ADMIN_SESSION_COOKIE);
  res.cookies.delete(LEGACY_ADMIN_COOKIE);
  return res;
}

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { authenticated: isAdminRequest(req) },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
