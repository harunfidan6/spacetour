// SpaceTour TR tanıtım filmi ses efektleri: dosya ve telif yok, hepsi kodla sentezlenir (48 kHz, tohumlu).
// Olay listesi senaryodaki window.__sfx'ten gelir: { t: saniye, type, d?: süre, g?: kazanç, p?: perde, lo?, hi? }
// Ton belgeseldir: efektler müziğin altında, yumuşak ve geniş (bol yankılı) durur.
import { SR, TAU, rng, svf, bus } from './dsp.mjs';

export function synthSfx(events, dur) {
  const b = bus(dur + 2), put = b.put;
  const rnd = rng(1969), noise = () => rnd() * 2 - 1;
  const at = (t) => Math.round(t * SR);
  const S = {
    // Sinematik vuruş: derin gövde + kısa çatırtı + metalik tını
    hit(t, _d, g = 1) {
      const i0 = at(t), f = svf(), m = svf(); let ph = 0;
      for (let k = 0; k < 2.2 * SR; k++) {
        const x = k / SR; ph += (TAU * (38 + 70 * Math.exp(-x * 9))) / SR;
        let v = Math.sin(ph) * Math.exp(-x * 2.4) * 0.85 * Math.min(1, x * 600);
        if (x < 0.2) v += f(noise(), 1100, 0.7).lp * Math.exp(-x * 22) * 0.55;
        v += m(noise(), 2300, 6).bp * Math.exp(-x * 3.5) * 0.1;
        put(i0 + k, v * g, 0, 0.55);
      }
    },
    // Alt bas düşüşü (hissedilen, duyulmaktan çok)
    sub(t, _d, g = 1) {
      const i0 = at(t); let ph = 0;
      for (let k = 0; k < 2.6 * SR; k++) {
        const x = k / SR; ph += (TAU * (52 * Math.exp(-x * 0.9) + 26)) / SR;
        put(i0 + k, Math.sin(ph) * Math.exp(-x * 1.5) * Math.min(1, x * 300) * 0.8 * g, 0, 0.1);
      }
    },
    // Hava süpürmesi; lo/hi: filtrenin gezdiği aralık
    whoosh(t, d = 0.7, g = 1, _p, lo = 300, hi = 2800) {
      const i0 = at(t), n = Math.round(d * SR), f = svf(), f2 = svf();
      for (let k = 0; k < n; k++) {
        const x = k / n, env = Math.pow(Math.sin(Math.PI * Math.pow(x, 0.8)), 1.6), fr = lo + (hi - lo) * Math.sin(Math.PI * x);
        put(i0 + k, (f(noise(), fr, 1.2).bp * 0.5 + f2(noise(), fr * 0.5, 0.8).lp * 0.25) * env * 0.6 * g, -0.75 + 1.5 * x, 0.4);
      }
    },
    swipe(t, _d, g = 1) { S.whoosh(t, 0.42, 0.6 * g, 1, 700, 3600); },
    // Künye çizgisi / yazı girişi: yumuşak, cam gibi tık
    tick(t, _d, g = 1) {
      const i0 = at(t), f = svf();
      for (let k = 0; k < 0.25 * SR; k++) {
        const x = k / SR;
        const v = Math.sin(TAU * 3200 * x) * Math.exp(-x * 60) * 0.35 + Math.sin(TAU * 5100 * x) * Math.exp(-x * 90) * 0.15 + f(noise(), 6000, 2).bp * Math.exp(-x * 200) * 0.3;
        put(i0 + k, v * g * Math.min(1, x * 4000), 0.2, 0.6);
      }
    },
    // Arayüz tıklaması (spektrum düğmeleri)
    click(t, _d, g = 1) {
      const i0 = at(t), f = svf();
      for (let k = 0; k < 0.08 * SR; k++) {
        const x = k / SR;
        put(i0 + k, (f(noise(), 2600, 1.4).bp * Math.exp(-x * 140) * 0.8 + Math.sin(TAU * 1500 * x) * Math.exp(-x * 90) * 0.25) * g, 0.15, 0.3);
      }
    },
    // Dalgaboyu taraması: rezonanslı süpürme, alçaktan tize
    scan(t, d = 1.1, g = 1) {
      const i0 = at(t), n = Math.round(d * SR), f = svf(); let ph = 0;
      for (let k = 0; k < n; k++) {
        const x = k / n, fr = 220 * Math.pow(18, x), env = Math.sin(Math.PI * x) ** 1.4;
        ph += (TAU * fr) / SR;
        put(i0 + k, (f(noise(), fr * 2, 5).bp * 0.45 + Math.sin(ph) * 0.08) * env * 0.55 * g, -0.6 + 1.2 * x, 0.5);
      }
    },
    // Güneş parlaması: aydınlık gürültü patlaması + parıldayan tiz küme
    glare(t, _d, g = 1) {
      const i0 = at(t), f = svf(), h = svf();
      for (let k = 0; k < 1.6 * SR; k++) {
        const x = k / SR, e = Math.min(1, x / 0.14) * Math.exp(-Math.max(0, x - 0.14) * 3.2);
        let v = f(noise(), 1800 + 3000 * Math.exp(-x * 2), 0.6).bp * 0.45 + h(noise(), 9000, 1).hp * 0.12;
        for (const fr of [2637, 3520, 4699, 5274]) v += Math.sin(TAU * fr * x + fr) * 0.025 * Math.exp(-x * 1.8);
        put(i0 + k, v * e * g, Math.sin(x * 9) * 0.3, 0.7);
      }
    },
    // Zaman bükülmesi: aşağı kayan çift ton + uğultu
    warp(t, d = 3.4, g = 1) {
      const i0 = at(t), n = Math.round(d * SR), f = svf(); let a = 0, c = 0;
      for (let k = 0; k < n; k++) {
        const x = k / SR, p = x / d, fr = 220 * Math.pow(0.5, p * 1.6);
        a += (TAU * fr) / SR; c += (TAU * fr * 1.007) / SR;
        const env = Math.min(1, x / 0.6) * Math.min(1, (d - x) / 0.5);
        const v = (Math.sin(a) + Math.sin(c)) * 0.16 + f(noise(), 120 + 200 * (1 - p), 1.5).bp * 0.5;
        put(i0 + k, v * env * g, Math.sin(x * 1.3) * 0.4, 0.6);
      }
    },
    // Saat tıkırtısı (kara delikte giderek yavaşlar ve kalınlaşır)
    tock(t, _d, g = 1, p = 1) {
      const i0 = at(t), f = svf();
      for (let k = 0; k < 0.3 * SR; k++) {
        const x = k / SR;
        const v = Math.sin(TAU * 1250 * p * x) * Math.exp(-x * 45) * 0.4 + f(noise(), 3000 * p, 3).bp * Math.exp(-x * 120) * 0.5 + Math.sin(TAU * 420 * p * x) * Math.exp(-x * 30) * 0.25;
        put(i0 + k, v * g * Math.min(1, x * 3000), -0.2, 0.55);
      }
    },
    // Telemetri bip'i (ISS)
    blip(t, _d, g = 1, p = 1) {
      const i0 = at(t), n = Math.round(0.07 * SR);
      for (let k = 0; k < n; k++) {
        const x = k / SR, e = Math.min(1, x * 800, (0.07 - x) * 800);
        put(i0 + k, (Math.sin(TAU * 1760 * p * x) * 0.6 + Math.sin(TAU * 3520 * p * x) * 0.12) * e * 0.4 * g, 0.35, 0.45);
      }
    },
    // Parıltı: çan kümesi (logo, açılış yazısı)
    shimmer(t, _d, g = 1) {
      [[0, 2093, 0.8], [0.05, 2637, 0.6], [0.11, 3136, 0.5], [0.18, 4186, 0.4], [0.26, 5274, 0.3]].forEach(([o, fr, a], j) => {
        const i0 = at(t + o);
        for (let k = 0; k < 2.2 * SR; k++) {
          const x = k / SR;
          put(i0 + k, Math.sin(TAU * fr * x + 1.4 * Math.exp(-x * 5) * Math.sin(TAU * fr * 2.01 * x)) * Math.exp(-x * 2.2) * a * 0.12 * g * Math.min(1, x * 2000), -0.5 + j * 0.25, 0.8);
        }
      });
    },
    chime(t, _d, g = 1) { // gezegen yerine oturur: yumuşak FM çan
      for (const [o, fr, a] of [[0, 1174.7, 1], [0.0, 1760, 0.5], [0.12, 2349.3, 0.4]]) {
        const i0 = at(t + o);
        for (let k = 0; k < 2.6 * SR; k++) {
          const x = k / SR;
          put(i0 + k, Math.sin(TAU * fr * x + 2 * Math.exp(-x * 3) * Math.sin(TAU * fr * 3.5 * x)) * Math.exp(-x * 1.6) * a * 0.14 * g * Math.min(1, x * 2000), 0.3, 0.8);
        }
      }
    },
  };
  for (const e of events) S[e.type]?.(e.t, e.d, e.g ?? 1, e.p ?? 1, e.lo, e.hi);
  b.addVerb(0.4, 0.84);
  return b;
}
