// Ortak ses araçları: sfx.mjs, muzik.mjs ve miks.mjs kullanır. 48 kHz, Float32 tamponlar.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

export const SR = 48000;
export const TAU = Math.PI * 2;

// Tohumlu rastgele (her çalıştırmada aynı ses)
export const rng = (seed) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

// Durum-değişken filtre: frekans her örnekte değişebilir → { lp, bp, hp }
export const svf = () => { let lp = 0, bp = 0; return (x, f, q = 1.5) => { const F = 2 * Math.sin((Math.PI * Math.min(f, SR / 6)) / SR); const hp = x - lp - bp / q; bp += F * hp; lp += F * bp; return { lp, bp, hp }; }; };

// Tek kutuplu alçak/yüksek geçiren
export const onePole = (f) => { const a = Math.exp((-TAU * f) / SR); let y = 0; return { lp: (x) => (y = x + (y - x) * a), hp: (x) => x - (y = x + (y - x) * a) }; };

// Bant sınırlı testere dişi için polyBLEP düzeltmesi
export const blep = (t, dt) => { if (t < dt) { t /= dt; return t + t - t * t - 1; } if (t > 1 - dt) { t = (t - 1) / dt; return t * t + t + t + 1; } return 0; };

// Schroeder yankısı (4 tarak + 2 tüm geçiren); off: sağ kanal için farklı gecikme
export const verb = (off = 0, fb = 0.8) => {
  const combs = [1557, 1617, 1491, 1422].map((n) => ({ b: new Float32Array(n + off), i: 0 }));
  const aps = [225, 556].map((n) => ({ b: new Float32Array(n + off), i: 0 }));
  return (x) => {
    let s = 0;
    for (const c of combs) { const y = c.b[c.i]; c.b[c.i] = x + y * fb; c.i = (c.i + 1) % c.b.length; s += y; }
    s /= 4;
    for (const a of aps) { const bv = a.b[a.i], y = -0.5 * s + bv; a.b[a.i] = s + 0.5 * y; a.i = (a.i + 1) % a.b.length; s = y; }
    return s;
  };
};

// Stereo tampon + yankı gönderimi
export function bus(dur) {
  const N = Math.ceil(dur * SR);
  const b = { N, L: new Float32Array(N), R: new Float32Array(N), V: new Float32Array(N) };
  b.put = (i, v, pan = 0, send = 0.25) => {
    if (i < 0 || i >= N) return;
    b.L[i] += v * Math.min(1, 1 - pan); b.R[i] += v * Math.min(1, 1 + pan); b.V[i] += v * send;
  };
  b.addVerb = (amount = 0.35, fb = 0.8) => {
    const vl = verb(0, fb), vr = verb(23, fb);
    for (let i = 0; i < N; i++) { b.L[i] += vl(b.V[i] * amount) * 0.6; b.R[i] += vr(b.V[i] * amount) * 0.6; }
  };
  return b;
}

export const peak = (...chs) => { let p = 1e-9; for (const c of chs) for (let i = 0; i < c.length; i++) p = Math.max(p, Math.abs(c[i])); return p; };

// Herhangi bir ses dosyasını ffmpeg ile 48 kHz mono Float32'ye çöz (af: ek ffmpeg filtresi)
export function decode(file, af = '') {
  const args = ['-v', 'error', '-i', file, ...(af ? ['-af', af] : []), '-ac', '1', '-ar', String(SR), '-f', 'f32le', 'pipe:1'];
  const r = spawnSync('ffmpeg', args, { maxBuffer: 1 << 28 });
  if (r.status) throw new Error(`ffmpeg çözemedi: ${file}\n${r.stderr}`);
  const b = r.stdout; return new Float32Array(b.buffer, b.byteOffset, b.byteLength / 4).slice();
}

// 16-bit stereo WAV
export function writeWav(file, L, R, n = L.length) {
  const buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 4, 40);
  const q = (v) => Math.max(-32768, Math.min(32767, Math.round(v * 32767)));
  for (let i = 0; i < n; i++) { buf.writeInt16LE(q(L[i]), 44 + i * 4); buf.writeInt16LE(q(R[i]), 46 + i * 4); }
  fs.writeFileSync(file, buf);
}
