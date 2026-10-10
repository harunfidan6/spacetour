// s6 · Yeni Ay'a 2 gün (17.0–20.0): hilal iyice incelip söner, Ay'ın çevresinde ince bir ışık halkası kalır.
// Kararmış diskin ortasında dev "2" (makara sayaç) ve "GÜN"; üstte serif "Yeni Ay'a"; altta tarih ve not.
// 19.4'ten sonra kamera karanlık diskin içine dalar, 19.7–20.0 karartma ile kapanışa.
import { ayKur, iz, evreAcisi, maskeAc } from './s2-ay.js';

export default function sahne(ctx, { t0, t1 }) {
  const { tl, gsap, el, split, kinetic, veri } = ctx;
  const A = ayKur(ctx, { seed: 61 });

  const kam = iz(gsap, [
    [t0, { rpx: 660, cx: 520, cy: 1040, yaw: 0.16, pitch: -0.04, roll: -0.14, pan: 0 }],
    [t0 + 0.8, { rpx: 206, cx: 270, cy: 452, yaw: -0.05, pitch: 0.025, roll: 0.03, pan: 0 }, 'expo.out'],
    [t1 - 0.62, { rpx: 240, cx: 270, cy: 450, yaw: 0.1, pitch: 0.05, roll: -0.06, pan: 0 }, 'none'],
    [t1 - 0.02, { rpx: 2600, cx: 270, cy: 450, yaw: 0.1, pitch: 0.05, roll: -0.13, pan: 0 }, 'power4.in'],
  ]);
  // Evre: %4'lük hilal (s2 ile aynı) → 18.0'de tamamen söner
  const a0 = evreAcisi(veri?.ay?.aydinlik ?? 4), a1 = Math.PI + 0.05;
  const evre = iz(gsap, [
    [t0, { a: a0, fi: Math.PI * 0.75 }],
    [t0 + 1.0, { a: a1, fi: Math.PI * 0.98 }, 'power2.inOut'],
  ]);
  const nabiz = (t, at, amp, w = 0.35) => (t < at ? 0 : amp * Math.exp(-(t - at) / w) * Math.min(1, (t - at) / 0.04));
  const ss = (a, b, x) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u); };

  const durum = (t) => {
    const s = kam(t);
    const e = evre(t);
    s.alfa = e.a;
    s.fi = e.fi;
    const halka = ss(2.85, Math.PI, e.a); // hilal söndükçe halka belirir
    s.haleIso = halka;
    s.haleI = 0.4 + 0.9 * halka + nabiz(t, t0 + 1.0, 2.0, 0.4) + nabiz(t, t0 + 1.5, 0.35, 0.25) + nabiz(t, t0 + 2.0, 0.5, 0.3);
    s.haleW = 0.014 - 0.005 * halka;
    s.haleSoft = 12 + 4 * halka;
    s.haleSoftI = 0.32 - 0.1 * halka;
    s.sunI = 5.5 + nabiz(t, t0 + 0.5, 2.5, 0.3);
    s.rimI = 0.9 * halka + 0.8 * nabiz(t, t0 + 1.0, 1, 0.4);
    s.rimIso = halka;
    s.earthI = 0.11 + 0.03 * halka;
    return s;
  };

  ctx.shot({
    t0, t1, scene: A.scene, camera: A.camera,
    update: (t) => {
      A.ay.rotation.y = 0.04 - (t - t0) * 0.03;
      A.kur(durum(t), durum(t - 0.05));
    },
  });

  /* ---------- Yazılar ---------- */
  const yeni = el(split('Yeni Ay’a'), { cls: 'serif gold shadow', style: { left: 28, width: 484, top: 116, fontSize: 84, textAlign: 'center' } });
  kinetic(yeni, t0 + 0.1, { how: 'rise', stagger: 0.03, dur: 0.6 });
  maskeAc(ctx, yeni, t0 + 0.95);

  // Dev "2": makara sayaç, 17.5 vuruşunda durur
  // "2 GÜN" bir grup: kamerayla birlikte yavaşça büyür, dalışta diskin merkezinden kameraya doğru açılır
  const grup = el('', { style: { left: 0, top: 0, width: 540, height: 960, transformOrigin: '270px 452px' } });
  tl.set(grup, { autoAlpha: 1 }, t0);
  const KALAN = veri?.yeniAy?.kalanGun ?? 2, FS = 270;
  const RAK = [...Array(8)].map((_, i) => String((KALAN + 7 - i) % 10)); // …4, 3, 2: makara kalan günde durur
  const makara = el(`<div class="kol">${RAK.map((d) => `<div style="height:1em;line-height:1em">${d}</div>`).join('')}</div>`, {
    cls: 'display shadow', parent: grup, style: { left: 40, top: 319, width: 224, height: FS, overflow: 'hidden', fontSize: FS, lineHeight: 1, textAlign: 'right' },
  });
  const kol = makara.querySelector('.kol');
  const son = -(RAK.length - 1) * FS;
  tl.fromTo(makara, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08, ease: 'none', immediateRender: false }, t0 + 0.04);
  tl.fromTo(kol, { y: -FS * 1.2, filter: 'blur(9px)' }, { y: son - 34, filter: 'blur(10px)', duration: 0.42, ease: 'power1.in', immediateRender: false }, t0 + 0.04);
  tl.to(kol, { y: son, filter: 'blur(0px)', duration: 0.3, ease: 'back.out(2.6)' }, t0 + 0.46);
  tl.fromTo(makara, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: 'expo.out', immediateRender: false }, t0 + 0.5);

  const gun = el(split('gün'), { cls: 'display shadow', parent: grup, style: { left: 276, top: 489, fontSize: 66 } });
  tl.fromTo(grup, { scale: 1 }, { scale: 1.05, duration: 1.3, ease: 'none', immediateRender: false }, t0 + 1.1);
  kinetic(gun, t0 + 0.55, { how: 'slam', stagger: 0.05, dur: 0.6 });
  maskeAc(ctx, gun, t0 + 0.55);

  const kunye1 = el(split(`${(veri?.yeniAy?.tarih ?? '10 Ekim Cumartesi').toLocaleUpperCase('tr-TR')} · ${veri?.yeniAy?.saat ?? '19:00'}`), {
    cls: 'mono shadow', style: { left: 20, width: 500, top: 706, fontSize: 22, textAlign: 'center', letterSpacing: '0.2em' },
  });
  maskeAc(ctx, kunye1, t0);
  kinetic(kunye1, t0 + 0.8, { how: 'blur', stagger: 0.012, dur: 0.3 });
  tl.to(kunye1, { autoAlpha: 0, y: -10, filter: 'blur(6px)', duration: 0.16, ease: 'power2.in' }, t0 + 1.62);

  const kunye2 = el(split('Ayın en karanlık geceleri bu hafta sonu'), {
    cls: 'serif shadow', style: { left: 20, width: 500, top: 696, fontSize: 31, textAlign: 'center' },
  });
  kinetic(kunye2, t0 + 1.72, { how: 'rise', stagger: 0.008, dur: 0.45 });
  maskeAc(ctx, kunye2, t0 + 2.3);

  // Dalış: yazılar kameraya doğru büyüyerek dağılır
  tl.to([yeni, grup, kunye2], { scale: 1.45, autoAlpha: 0, filter: 'blur(10px)', duration: 0.22, ease: 'power2.in', stagger: 0.015 }, t1 - 0.46);

  /* ---------- Geçiş ve ses ---------- */
  ctx.dip(t1, { dur: 0.3 });
  ctx.sound(t0, 'sub', 0.4);
  ctx.sound(t0 + 0.1, 'whoosh', 0.26, { d: 0.4, lo: 600, hi: 3400 });
  ctx.sound(t0 + 0.5, 'hit', 0.55);
  ctx.sound(t0 + 1.0, 'shimmer', 0.5);
  ctx.sound(t1 - 0.6, 'warp', 0.4, { d: 0.6 });
}
