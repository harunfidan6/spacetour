// SpaceTour TR astroloji filmi müziği: mistik, "kadim" tema. Re Kürdi dizisi (Re–La–Si♭–Do–Re–Mi–Fa–Sol–La), ızgara 0.25 sn.
// Ana tanıtım müziğinden (muzik.mjs) bilerek farklı: davul seti, braam ve yaylı yok; yerine hang benzeri metal davul,
// Tibet çanağı, ney benzeri nefesli ezgi, bendir/def ve uzun yankı. Tamamı kodla sentezlenir, telifsiz.
// Bölümler senaryonun kesim saniyelerine (window.__filmMeta.cuts) oturur:
//   0–3   giriş: Re uğultusu, çanak, yavaş açılan hava, dört hang notası
//   3     yumuşak vuruş (bendir + pes çanak) → Dm · B♭, hang ostinatosu (aksak 3-3-2), kalp atışı
//   7     ney teması (La–Si♭–La–Sol–Fa–Mi–Re) · Gm · Dm, def ritmi
//   11    iki ses: ney ezgisini hang yarım vuruş arkadan, bir oktav yukarıda izler · B♭ · C
//   15    aydınlık: F · C, yıldız çanları, ritim hafifler
//   19    doruk: Dm · B♭, tam def ritmi, tema yukarıda (Re–Do–La–Si♭–La–Sol)
//   23    gerilim: Gm → Asus → A (Do diyez), bendir rulosu, yükselen nefes
//   26    son: Dm, pes çanak ve bendir; hang inen arpej, ney uzun Re ile söner
import { SR, TAU, rng, svf, onePole, blep, bus, peak } from './dsp.mjs';

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Akorlar: b = bas (MIDI), v = pad dizilişi, a = hang arpeji (8 adım)
const CH = {
  Dm: { b: 38, v: [50, 57, 62, 64, 65], a: [50, 57, 62, 65, 69, 65, 62, 57] },
  Bb: { b: 34, v: [46, 53, 58, 60, 65], a: [58, 62, 65, 69, 72, 69, 65, 62] },
  Gm: { b: 31, v: [43, 50, 58, 62, 65], a: [55, 62, 65, 67, 70, 67, 65, 62] },
  C: { b: 36, v: [48, 55, 60, 64, 67], a: [60, 64, 67, 72, 76, 72, 67, 64] },
  F: { b: 29, v: [53, 57, 60, 64, 67], a: [53, 60, 65, 69, 72, 69, 65, 60] },
  As: { b: 33, v: [45, 52, 57, 62, 64], a: [57, 62, 64, 69, 74, 69, 64, 62] },
  A: { b: 33, v: [45, 52, 57, 61, 64], a: [57, 61, 64, 69, 73, 69, 64, 61] },
};

export function renderMusic(dur, meta = {}) {
  const [C1, C2, C3, C4, C5, C6, C7] = meta.cuts || [3, 7, 11, 15, 19, 23, 26];
  const mb = bus(dur + 1), N = mb.N, put = mb.put;
  const cb = bus(dur + 1); // chorus: pad, ney
  const db = bus(dur + 1); // eko: yıldız çanları
  const rnd = rng(1824), noise = () => rnd() * 2 - 1;
  const at = (t) => Math.round(t * SR);

  /* ---------- Vurmalılar: bendir / def ---------- */
  const dum = (t, g = 1) => { let ph = 0; const i0 = at(t), f = svf(); // pes, gergin deri
    for (let k = 0; k < 0.8 * SR; k++) { const x = k / SR; ph += (TAU * (58 + 60 * Math.exp(-x * 30))) / SR;
      put(i0 + k, (Math.sin(ph) * Math.exp(-x * 5) + f(noise(), 250, 0.7).lp * Math.exp(-x * 25) * 0.8) * 0.55 * g, 0, 0.3); } };
  const tek = (t, g = 1, pan = 0.2) => { const i0 = at(t), f = svf(); let ph = 0; // kenar vuruşu
    for (let k = 0; k < 0.16 * SR; k++) { const x = k / SR; ph += (TAU * 420) / SR;
      put(i0 + k, (f(noise(), 2300, 1.1).bp * Math.exp(-x * 38) + Math.sin(ph) * 0.3 * Math.exp(-x * 50)) * 0.32 * g, pan, 0.3); } };
  const zil = (t, g = 1, pan = -0.3) => { const i0 = at(t), f = svf(), f2 = svf(); // def zilleri
    for (let k = 0; k < 0.22 * SR; k++) { const x = k / SR, n = noise();
      put(i0 + k, (f(n, 7200, 6).bp + f2(n, 9800, 6).bp * 0.7) * Math.exp(-x * 22) * Math.min(1, x * 2000) * 0.05 * g, pan, 0.3); } };
  const roll = (t0, d, g = 1) => { for (let t = 0; t < d; ) { const p = t / d; tek(t0 + t, g * (0.2 + 0.8 * p * p), (rnd() - 0.5) * 0.4); if (rnd() < 0.5) zil(t0 + t, 0.5 * p); t += 0.14 - 0.08 * p; } };
  const boom = (t, g = 1) => { let ph = 0; const i0 = at(t);
    for (let k = 0; k < 3.0 * SR; k++) { const x = k / SR; ph += (TAU * (34 + 30 * Math.exp(-x * 4))) / SR;
      put(i0 + k, Math.sin(ph) * Math.exp(-x * 1.4) * Math.min(1, x * 400) * 0.45 * g, 0, 0.4); } };
  const swell = (tEnd, d, g = 1) => { const i0 = at(tEnd - d), n = Math.round(d * SR), fl = svf(), fr = svf(); // yükselen nefes
    for (let k = 0; k < n && i0 + k < N; k++) { const p = k / n, e = Math.pow(p, 2.5) * 0.22 * g;
      mb.L[i0 + k] += fl(noise(), 600 + 4000 * p, 1.2).bp * e; mb.R[i0 + k] += fr(noise(), 600 + 4000 * p, 1.2).bp * e; mb.V[i0 + k] += e * 0.15; } };

  /* ---------- Ezgili sesler ---------- */
  // Hang: temel + oktav + üst beşli kısmi, yumuşak tokmak; dec: sönüm çarpanı
  const hang = (t, m, g = 1, pan = 0, dec = 1) => { const f = mtof(m), i0 = at(t), th = svf(); let p1 = 0, p2 = 0, p3 = 0;
    for (let k = 0; k < 2.4 * dec * SR; k++) { const x = k / SR, bend = 1 + 0.006 * Math.exp(-x * 40);
      p1 += (TAU * f * bend) / SR; p2 += (TAU * f * 2.003 * bend) / SR; p3 += (TAU * f * 3.01) / SR;
      const s = Math.sin(p1) * Math.exp((-x * 2.6) / dec) + 0.45 * Math.sin(p2) * Math.exp((-x * 4) / dec) + 0.18 * Math.sin(p3) * Math.exp(-x * 4.5);
      const thump = th(noise(), 900, 0.8).lp * Math.exp(-x * 60) * 0.5;
      put(i0 + k, (s + thump) * Math.min(1, x * 350) * 0.1 * g, pan, 0.5); } };
  // Tibet çanağı: uyumsuz kısmiler, her biri hafifçe çırpan iki ton; len sonunda sıfıra iner
  const bowl = (t, m, g = 1, pan = 0, len = 6) => { const f = mtof(m), i0 = at(t);
    const parts = [[1, 1, 0.9], [2.76, 0.55, 1.4], [5.4, 0.28, 2.2], [8.9, 0.12, 3.2]];
    for (let k = 0; k < len * SR; k++) { const x = k / SR; let s = 0;
      for (const [r, a, d] of parts) s += a * 0.5 * (Math.sin(TAU * f * r * x) + Math.sin(TAU * f * r * 1.0025 * x + 1)) * Math.exp((-x * d) / 1.6);
      const tail = Math.min(1, (len - x) / 0.5);
      put(i0 + k, s * Math.min(1, x * 200) * tail * 0.07 * g, pan, 0.6); } };
  // Ney benzeri nefesli: sinüs + zayıf üst kısmiler + nefes gürültüsü; başta aşağıdan kayış, gecikmeli vibrato
  const ney = (t, m, d, g = 1, pan = 0.1) => { const f = mtof(m), i0 = at(t), bf = svf(); let ph = 0;
    for (let k = 0; k < (d + 0.6) * SR; k++) { const x = k / SR;
      const glide = Math.pow(2, (-0.35 * Math.exp(-x * 14)) / 12);
      const vib = 1 + 0.006 * Math.sin(TAU * 5.2 * x) * Math.min(1, Math.max(0, (x - 0.35) * 2));
      ph += (TAU * f * glide * vib) / SR;
      const env = Math.min(1, x / 0.14) * (x > d ? Math.exp(-(x - d) * 6) : 1) * (0.85 + 0.15 * Math.sin(TAU * 0.7 * x));
      const tone = Math.sin(ph) + 0.18 * Math.sin(2 * ph) + 0.06 * Math.sin(3 * ph);
      const breath = bf(noise(), f * 2.2, 2.5).bp * (0.35 + 0.65 * Math.exp(-x * 5));
      cb.put(i0 + k, (tone * 0.8 + breath * 0.9) * env * 0.09 * g, pan, 0.7); } };
  const theme = (t0, mel, g = 1) => mel.forEach(([o, m, d]) => ney(t0 + o, m, d * 0.96, g));
  // Yıldız çanı: kısa FM çanı, ekoya gider
  const star = (t, m, g = 1, pan = 0.3) => { const f = mtof(m), i0 = at(t);
    for (let k = 0; k < 1.6 * SR; k++) { const x = k / SR;
      db.put(i0 + k, Math.sin(TAU * f * x + 1.6 * Math.exp(-x * 4) * Math.sin(TAU * f * 3.5 * x)) * Math.exp(-x * 2.6) * Math.min(1, x * 1500) * 0.06 * g, pan, 0.6); } };
  const sawStack = (ph, f, dets) => { let s = 0; for (let j = 0; j < dets.length; j++) { const dt = (f * dets[j]) / SR; ph[j] += dt; ph[j] -= Math.floor(ph[j]); s += 2 * ph[j] - 1 - blep(ph[j], dt); } return s / dets.length; };
  // Pad: yavaş açılan, karanlık testere dişi katmanı
  const pad = (t, notes, d, g = 1, cut = 900, att = 1.4, rel = 1.8) => notes.forEach((m, i) => {
    const f = mtof(m), i0 = at(t), flt = svf(), dets = [0.993, 1, 1.007], ph = dets.map(() => rnd());
    for (let k = 0; k < (d + rel) * SR; k++) { const x = k / SR;
      const env = Math.min(1, x / att) * (x > d ? Math.exp(-(x - d) * (3 / rel)) : 1);
      const fc = cut * (0.8 + 0.25 * Math.sin(TAU * 0.11 * x + i));
      cb.put(i0 + k, flt(sawStack(ph, f, dets), fc, 0.7).lp * env * 0.008 * g, -0.45 + i * (0.9 / Math.max(1, notes.length - 1)), 0.65); } });
  const bass = (t, m, d, g = 1) => { const f = mtof(m), i0 = at(t);
    for (let k = 0; k < (d + 0.4) * SR; k++) { const x = k / SR, env = Math.min(1, x / 0.08) * (x > d ? Math.exp(-(x - d) * 8) : 1);
      put(i0 + k, (Math.sin(TAU * f * x) + 0.25 * Math.sin(TAU * 2 * f * x)) * env * 0.16 * g, 0, 0.05); } };
  const drone = (t, d, m, g = 1) => { const f = mtof(m), i0 = at(t), flt = svf(); let p = 0;
    for (let k = 0; k < d * SR; k++) { const x = k / SR, env = Math.min(1, x / 1.5) * Math.min(1, (d - x) / 0.8); p += f / SR; p -= Math.floor(p);
      put(i0 + k, (Math.sin(TAU * f * x) * 0.6 + Math.sin(TAU * f * 2 * x) * 0.15 + flt(2 * p - 1, 300 + 120 * Math.sin(x * 0.7), 0.6).lp * 0.25) * env * 0.2 * g, Math.sin(x * 0.5) * 0.15, 0.35); } };

  /* ---------- Kalıplar (2 sn'lik ölçü) ---------- */
  const RH = {
    seyrek: [[0, 0, 1], [0.75, 3, 0.75], [1.0, 4, 0.85], [1.5, 6, 0.7], [1.75, 7, 0.6]], // aksak 3-3-2
    tam: [0, 1, 2, 3, 4, 5, 6, 7].map((s) => [s * 0.25, s, s % 4 === 0 ? 1 : s % 2 ? 0.6 : 0.78]),
  };
  const ost = (t0, ch, rh = 'seyrek', g = 1, oct = 0, to = 2) => RH[rh].forEach(([o, s, v]) => { if (o < to - 1e-6) hang(t0 + o, CH[ch].a[s] + oct, g * v, s % 2 ? 0.35 : -0.35); });
  const chord = (t, ch, d, { padG = 1, cut = 900, bassG = 1 } = {}) => { pad(t, CH[ch].v, d, padG, cut); if (bassG) bass(t, CH[ch].b + 12, d * 0.96, bassG); };
  const DEF = {
    kalp: [['d', 0, 1], ['d', 0.32, 0.6], ['d', 1.0, 0.8], ['d', 1.32, 0.5]],
    def: [['d', 0, 1], ['t', 0.75, 0.8], ['d', 1.0, 0.8], ['t', 1.5, 0.9], ['t', 1.75, 0.5]],
    hafif: [['t', 0.5, 0.6], ['t', 1.5, 0.7]],
    tam: [['d', 0, 1], ['t', 0.5, 0.8], ['d', 0.75, 0.7], ['d', 1.0, 0.9], ['t', 1.5, 0.9], ['t', 1.75, 0.6]],
  };
  const drum = (t0, kind, g = 1) => DEF[kind].forEach(([k, o, v]) => (k === 'd' ? dum : tek)(t0 + o, g * v));
  const zils = (t0, t1, step, g = 1) => { for (let t = t0, i = 0; t < t1 - 1e-6; t += step, i++) zil(t, g * (i % 2 ? 0.55 : 1)); };

  /* ---------- 0. Giriş ---------- */
  drone(0, C1 + 0.8, 26, 0.4); drone(0.2, C1 + 0.6, 38, 0.8);
  pad(0.1, CH.Dm.v, C1 - 0.1, 0.9, 600, 2.0, 1.0);
  bowl(0.3, 62, 0.9, -0.2, 6);
  [[0.9, 69], [1.4, 65], [1.9, 64], [2.4, 62]].forEach(([t, m], i) => hang(t, m, 0.55 - i * 0.05, i % 2 ? 0.3 : -0.3, 1.3));
  swell(C1, 1.6, 0.8);

  /* ---------- 1. Usturlap ---------- */
  boom(C1, 0.8); dum(C1, 1.1); bowl(C1, 50, 0.9, 0, 6);
  chord(C1, 'Dm', 2.0); chord(C1 + 2, 'Bb', 2.0);
  ost(C1, 'Dm', 'seyrek', 0.9); ost(C1 + 2, 'Bb', 'seyrek', 0.9);
  drum(C1, 'kalp', 0.7); drum(C1 + 2, 'kalp', 0.7);

  /* ---------- 2. Doğum haritası: ney teması ---------- */
  dum(C2, 0.9); bowl(C2, 57, 0.45, 0.3, 5);
  chord(C2, 'Gm', 2.0, { cut: 1000 }); chord(C2 + 2, 'Dm', 2.0, { cut: 1000 });
  ost(C2, 'Gm', 'seyrek', 0.75); ost(C2 + 2, 'Dm', 'seyrek', 0.75);
  theme(C2, [[0.25, 69, 0.75], [1.0, 70, 0.5], [1.5, 69, 0.5], [2.0, 67, 0.75], [2.75, 65, 0.25], [3.0, 64, 0.5], [3.5, 62, 0.5]], 1);
  drum(C2, 'def', 0.75); drum(C2 + 2, 'def', 0.75);

  /* ---------- 3. Sinastri: iki ses ---------- */
  dum(C3, 0.9);
  chord(C3, 'Bb', 2.0, { cut: 1100 }); chord(C3 + 2, 'C', 2.0, { cut: 1100 });
  const duet = [[0, 65, 0.75], [0.75, 67, 0.25], [1.0, 69, 1.0], [2.0, 72, 0.75], [2.75, 69, 0.25], [3.0, 67, 0.75]];
  theme(C3, duet, 0.95);
  duet.forEach(([o, m]) => hang(C3 + o + 0.5, m + 12, 0.45, 0.4, 0.8));
  ost(C3, 'Bb', 'seyrek', 0.6); ost(C3 + 2, 'C', 'seyrek', 0.6);
  drum(C3, 'def', 0.7); drum(C3 + 2, 'def', 0.7); zils(C3, C4, 0.5, 0.6);

  /* ---------- 4. Günlük burç: aydınlık ---------- */
  bowl(C4, 65, 0.5, -0.3, 5); tek(C4, 0.8);
  chord(C4, 'F', 2.0, { cut: 1400, padG: 1.1 }); chord(C4 + 2, 'C', 2.0, { cut: 1400, padG: 1.1 });
  ost(C4, 'F', 'tam', 0.65); ost(C4 + 2, 'C', 'tam', 0.65);
  [[0.5, 81], [1.25, 84], [2.0, 79], [2.5, 88], [3.25, 84]].forEach(([o, m], i) => star(C4 + o, m, 0.5, i % 2 ? 0.45 : -0.45));
  drum(C4, 'hafif', 0.7); drum(C4 + 2, 'hafif', 0.7); zils(C4, C5, 0.25, 0.5);
  swell(C5, 1.2, 0.6);

  /* ---------- 5. Numeroloji: doruk ---------- */
  boom(C5, 0.7); dum(C5, 1.1); bowl(C5, 50, 0.6, 0, 4);
  chord(C5, 'Dm', 2.0, { cut: 1500, padG: 1.15 }); chord(C5 + 2, 'Bb', 2.0, { cut: 1500, padG: 1.15 });
  ost(C5, 'Dm', 'tam', 0.85); ost(C5 + 2, 'Bb', 'tam', 0.85);
  theme(C5, [[0, 74, 1.0], [1.0, 72, 0.5], [1.5, 69, 0.5], [2.0, 70, 1.0], [3.0, 69, 0.5], [3.5, 67, 0.5]], 1.1);
  drum(C5, 'tam', 0.9); drum(C5 + 2, 'tam', 0.9); zils(C5, C6, 0.25, 0.65);

  /* ---------- 6. Burç dosyası: gerilim ---------- */
  const tA = C6 + 1.5, tA2 = C6 + 2.25;
  chord(C6, 'Gm', 1.5, { cut: 1300 }); chord(tA, 'As', tA2 - tA, { cut: 1500 }); chord(tA2, 'A', C7 - tA2, { cut: 1700 });
  ost(C6, 'Gm', 'seyrek', 0.75, 0, 1.5); ost(tA, 'As', 'tam', 0.7, 0, tA2 - tA); ost(tA2, 'A', 'tam', 0.8, 0, C7 - tA2);
  theme(C6, [[0, 69, 0.75], [0.75, 70, 0.75], [1.5, 73, 1.4]], 1.0);
  roll(tA, C7 - tA, 0.9); swell(C7, 1.5, 1.0);

  /* ---------- 7. Son ---------- */
  boom(C7, 1.1); dum(C7, 1.3); bowl(C7, 45, 1.2, 0, dur - C7); bowl(C7 + 0.02, 62, 0.6, 0.3, dur - C7);
  pad(C7, CH.Dm.v, dur - C7 - 0.8, 1.3, 1200, 0.2, 1.4); bass(C7, 38 + 12, 2.6, 1); drone(C7, dur - C7, 26, 0.35);
  [74, 69, 65, 62, 57, 50].forEach((m, i) => hang(C7 + 0.1 + i * 0.16, m, 0.7 - i * 0.06, -0.4 + i * 0.16, 1.4));
  ney(C7 + 1.0, 74, 2.4, 1.0);
  [[0.4, 86], [0.9, 81], [1.6, 77]].forEach(([o, m], i) => star(C7 + o, m, 0.45 - i * 0.1, i % 2 ? 0.4 : -0.4));

  /* ---------- Efektler: chorus, ping-pong eko, büyük salon yankısı ---------- */
  const D = 32768, rl = new Float32Array(D), rr = new Float32Array(D);
  const tap = (ring, i, sec) => { const p = i - sec * SR, i1 = Math.floor(p), fr = p - i1; return i1 < 1 ? 0 : ring[i1 % D] * (1 - fr) + ring[(i1 + 1) % D] * fr; };
  for (let i = 0; i < N; i++) {
    rl[i % D] = cb.L[i]; rr[i % D] = cb.R[i];
    const x = i / SR;
    mb.L[i] += cb.L[i] * 0.75 + tap(rl, i, 0.011 + 0.003 * Math.sin(TAU * 0.3 * x)) * 0.5;
    mb.R[i] += cb.R[i] * 0.75 + tap(rr, i, 0.011 + 0.003 * Math.sin(TAU * 0.3 * x + Math.PI)) * 0.5;
    mb.V[i] += cb.V[i];
  }
  const el = new Float32Array(D), er = new Float32Array(D), dl = Math.round(0.375 * SR);
  for (let i = 0; i < N; i++) {
    const fl = i >= dl ? el[(i - dl) % D] : 0, fr = i >= dl ? er[(i - dl) % D] : 0;
    el[i % D] = db.L[i] + fr * 0.45; er[i % D] = db.R[i] * 0.3 + fl * 0.45;
    mb.L[i] += db.L[i] + fl * 0.4; mb.R[i] += db.R[i] + fr * 0.4; mb.V[i] += db.V[i];
  }
  mb.addVerb(0.6, 0.88);

  // Master: yumuşak doygunluk, 35 Hz altı ve 11 kHz üstü yumuşatma
  const out = { L: new Float32Array(N), R: new Float32Array(N) };
  for (const ch of ['L', 'R']) { const hp = onePole(35), hp2 = onePole(35), lp = onePole(11000), lp2 = onePole(13000);
    for (let i = 0; i < N; i++) out[ch][i] = lp2.lp(lp.lp(hp2.hp(hp.hp(Math.tanh(mb[ch][i] * 1.1) / Math.tanh(1.1))))); }
  const g = 0.8 / peak(out.L, out.R);
  for (let i = 0; i < N; i++) { out.L[i] *= g; out.R[i] *= g; }
  return out;
}
