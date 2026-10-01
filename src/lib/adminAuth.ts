import { createHmac, timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'admin_telemetry_session';
// Older builds stored the raw key in this cookie; it is only ever cleared now.
export const LEGACY_ADMIN_COOKIE = 'admin_telemetry_key';

const DEV_FALLBACK_KEY = 'astro2026';

/** The configured admin key. Production never falls back to the public dev key. */
export function getAdminKey(): string | null {
  const key = process.env.ADMIN_TELEMETRY_KEY?.trim();
  if (key) return key;
  return process.env.NODE_ENV === 'production' ? null : DEV_FALLBACK_KEY;
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

function sign(key: string, expiresAt: number): string {
  return createHmac('sha256', key).update(`telemetry-session:${expiresAt}`).digest('base64url');
}

export function isValidAdminKey(candidate: string): boolean {
  const key = getAdminKey();
  return key !== null && candidate.length > 0 && safeEqual(candidate, key);
}

/** Signed, expiring session token — the cookie never carries the key itself. */
export function createSessionToken(maxAgeSeconds: number): string | null {
  const key = getAdminKey();
  if (!key) return null;
  const expiresAt = Date.now() + maxAgeSeconds * 1000;
  return `${expiresAt}.${sign(key, expiresAt)}`;
}

function isValidSessionToken(token: string | undefined): boolean {
  const key = getAdminKey();
  if (!key || !token) return false;
  const [expStr, signature] = token.split('.');
  const expiresAt = Number(expStr);
  if (!signature || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  return safeEqual(signature, sign(key, expiresAt));
}

/** Accepts either the session cookie or an `x-admin-key` header (for scripted access). */
export function isAdminRequest(req: NextRequest): boolean {
  const headerKey = req.headers.get('x-admin-key');
  if (headerKey && isValidAdminKey(headerKey)) return true;
  return isValidSessionToken(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

// ---------- Brute-force throttle (per warm instance) ----------

declare global {
  var __astro_admin_failures: Map<string, { count: number; firstAt: number }> | undefined;
}

const failures = (globalThis.__astro_admin_failures ??= new Map());
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;

export function clientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
}

/** Seconds until the client may try again, or 0 when not throttled. */
export function throttleRemaining(ip: string): number {
  const entry = failures.get(ip);
  if (!entry) return 0;
  const elapsed = Date.now() - entry.firstAt;
  if (elapsed > WINDOW_MS) {
    failures.delete(ip);
    return 0;
  }
  return entry.count >= MAX_FAILURES ? Math.ceil((WINDOW_MS - elapsed) / 1000) : 0;
}

export function registerFailure(ip: string): void {
  const entry = failures.get(ip);
  if (!entry || Date.now() - entry.firstAt > WINDOW_MS) {
    failures.set(ip, { count: 1, firstAt: Date.now() });
  } else {
    entry.count++;
  }
}

export function clearFailures(ip: string): void {
  failures.delete(ip);
}
