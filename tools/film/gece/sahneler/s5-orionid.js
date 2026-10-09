// s5 · Orionid meteor yağmuru (13.5–17.0): karanlıktan Avcı (Orion) takımyıldızı belirir, çizgileri çizilir;
// Betelgeuse'ün sol üstündeki ışınım noktasından meteorlar saçılır, 15.0'te büyük bir ateş topu ekranı aydınlatır.
// Altta sayaç: SAATTE ~20 METEOR. 16.0'da "Halley'den kalan tozlar". 17.0'de ikinci ateş topunun parlamasıyla s6'ya.
import { maskeAc } from './s2-ay.js';

// Avcı'nın yıldızları: [ad, sağ açıklık (saat), dik açıklık (°), boyut (px), renk]
const AVCI = [
  ['Betelgeuse', 5.919, 7.41, 15, '#ffb27a'],
  ['Bellatrix', 5.419, 6.35, 9.5, '#dfe8ff'],
  ['Meissa', 5.585, 9.93, 6.5, '#e6ecff'],
  ['Mintaka', 5.533, -0.3, 8.5, '#e3ebff'],
  ['Alnilam', 5.604, -1.2, 9.5, '#e8efff'],
  ['Alnitak', 5.679, -1.94, 9, '#e6edff'],
  ['Saiph', 5.796, -9.67, 9, '#dde6ff'],
  ['Rigel', 5.242, -8.2, 14, '#cfe0ff'],
];
const CIZGI = [['Meissa', 'Betelgeuse'], ['Meissa', 'Bellatrix'], ['Betelgeuse', 'Alnitak'], ['Bellatrix', 'Mintaka'], ['Mintaka', 'Alnilam'], ['Alnilam', 'Alnitak'], ['Alnitak', 'Saiph'], ['Mintaka', 'Rigel']];
const ISINIM = [6.33, 15.6]; // Orionid ışınım noktası (RA saat, Dec °)
const MERKEZ = [300, 512], OLCEK = 12.5; // ekranda Avcı'nın merkezi (CSS px) ve px/derece

/** RA/Dec → ekran (CSS px, roll 0): doğu solda */
const ekran = ([ra, dec]) => [MERKEZ[0] - (ra - 5.6) * 15 * Math.cos((dec * Math.PI) / 180) * OLCEK, MERKEZ[1] - dec * OLCEK];

export default function sahne(ctx, { t0, t1 }) {
  const { THREE, tl, el, split, kinetic, W, H, veri } = ctx;
  const T = (x) => t0 + x;
  const o = veri?.orionid ?? { kalanGun: 12, tarih: '21 Ekim', saatte: 20 };
  const BUYUK = (x) => String(x).toLocaleUpperCase('tr-TR');

  /* ---------- 3D: her şey z = -D düzleminde; kamera yalnızca döner ve yakınlaşır ---------- */
  const scene = new THREE.Scene();
  const FOV0 = 32, D = 100;
  const camera = new THREE.PerspectiveCamera(FOV0, W / H, 0.1, 2000);
  const k = (D * Math.tan((FOV0 * Math.PI) / 360)) / (H / 2); // 1 CSS px kaç birim (FOV0'da)
  const P = (x, y, z = 0) => new THREE.Vector3((x - W / 2) * k, (H / 2 - y) * k, -D + z);
  scene.add(ctx.stars({ count: 3400, radius: 700, seed: 91, size: 1.2 }));

  const isik = (stops) => new THREE.SpriteMaterial({ map: ctx.glow(stops), transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
  const nokta = (renk) => [[0, 'rgba(255,255,255,1)'], [0.12, renk], [0.4, renk.replace(/[\d.]+\)$/, '0.18)')], [1, 'rgba(0,0,0,0)']];
  const rgba = (hex, a) => { const c = new THREE.Color(hex); return `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a})`; };

  // Orion Bulutsusu (kılıçta): soluk pembe ışık
  const m42 = new THREE.Sprite(isik([[0, 'rgba(255,150,200,0.55)'], [0.3, 'rgba(190,90,170,0.18)'], [1, 'rgba(120,40,140,0)']]));
  const [mx, my] = ekran([5.59, -5.4]);
  m42.position.copy(P(mx, my, -1)); m42.scale.set(70 * k, 70 * k, 1);
  scene.add(m42);

  // Yıldızlar
  const yer = {};
  const yildizlar = AVCI.map(([ad, ra, dec, boy, renk], i) => {
    const [x, y] = ekran([ra, dec]);
    yer[ad] = [x, y];
    const s = new THREE.Sprite(isik(nokta(rgba(renk, 0.85))));
    s.position.copy(P(x, y)); s.scale.set(boy * 3.2 * k, boy * 3.2 * k, 1);
    s.userData = { boy, gir: T(0.12 + i * 0.07), faz: i * 1.7 };
    scene.add(s);
    return s;
  });

  // Takımyıldız çizgileri: ince altın şeritler, uçtan uca çizilir
  const serit = new THREE.PlaneGeometry(1, 1).translate(0.5, 0, 0);
  const cizgiler = CIZGI.map(([a, b], i) => {
    const [x0, y0] = yer[a], [x1, y1] = yer[b];
    const m = new THREE.Mesh(serit, new THREE.MeshBasicMaterial({ color: 0xf5c542, transparent: true, opacity: 0, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending }));
    m.position.copy(P(x0, y0, 0.5));
    m.rotation.z = -Math.atan2(y1 - y0, x1 - x0);
    m.userData = { L: Math.hypot(x1 - x0, y1 - y0) * k, gir: T(0.75 + i * 0.07) };
    m.scale.set(1e-4, 1.3 * k, 1);
    scene.add(m);
    return m;
  });

  // Işınım noktası: hafif nabız atan parıltı
  const [rx, ry] = ekran(ISINIM);
  const kaynak = new THREE.Sprite(isik([[0, 'rgba(255,236,190,0.9)'], [0.2, 'rgba(255,200,120,0.25)'], [1, 'rgba(255,160,80,0)']]));
  kaynak.position.copy(P(rx, ry, 1)); kaynak.scale.set(46 * k, 46 * k, 1);
  scene.add(kaynak);

  // Meteor izi dokusu: kuyruk saydam → baş beyaz; enine yumuşak
  const izDoku = (() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 32;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 512, 0);
    g.addColorStop(0, 'rgba(255,150,80,0)'); g.addColorStop(0.55, 'rgba(255,190,130,0.35)'); g.addColorStop(0.9, 'rgba(225,235,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,1)');
    x.fillStyle = g; x.fillRect(0, 0, 512, 32);
    x.globalCompositeOperation = 'destination-in';
    const v = x.createLinearGradient(0, 0, 0, 32);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(0.5, 'rgba(0,0,0,1)'); v.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = v; x.fillRect(0, 0, 512, 32);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const basDoku = [[0, 'rgba(255,255,255,1)'], [0.15, 'rgba(225,238,255,0.7)'], [0.45, 'rgba(160,200,255,0.12)'], [1, 'rgba(120,170,255,0)']];

  // Meteorlar: tohumlu; zamanla sıklaşır. Yukarı (yazılara) gidenler seyrek.
  const r = ctx.rand(2110);
  const meteorlar = [];
  const ekle = (ts, { aci, r0, hiz, boy, kalin, sure, parlak }) => {
    const iz = new THREE.Mesh(serit, new THREE.MeshBasicMaterial({ map: izDoku, transparent: true, opacity: 0, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    const bas = new THREE.Sprite(new THREE.SpriteMaterial({ map: ctx.glow(basDoku), transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0, toneMapped: false }));
    iz.visible = bas.visible = false;
    scene.add(iz, bas);
    meteorlar.push({ ts, aci, r0, hiz, boy, kalin, sure, parlak, iz, bas });
  };
  for (let i = 0; i < 46; i++) {
    const u = i / 46;
    const ts = T(0.35 + Math.pow(u, 0.8) * 3.05 + (r() - 0.5) * 0.08);
    let aci = -0.3 * Math.PI + r() * 1.6 * Math.PI; // ekran açısı (y aşağı): düz yukarı yön dışarıda
    if (aci > 1.15 * Math.PI && r() < 0.6) aci -= 0.5 * Math.PI;
    ekle(ts, { aci, r0: 18 + r() * 120, hiz: 650 + r() * 750, boy: 60 + r() * 170, kalin: 3.5 + r() * 3.5, sure: 0.26 + r() * 0.32, parlak: 0.6 + r() * 0.6 });
  }
  // Ateş topları: 15.0 (aşağı sağa, ekranı boydan geçer) ve 16.7 (geçiş parlaması)
  const AT1 = T(1.5), AT2 = T(3.2);
  ekle(AT1, { aci: 0.33 * Math.PI, r0: 30, hiz: 1500, boy: 560, kalin: 13, sure: 0.62, parlak: 2 });
  ekle(AT2, { aci: 0.18 * Math.PI, r0: 20, hiz: 1700, boy: 640, kalin: 14, sure: 0.36, parlak: 2 });

  const ss = (a, b, x) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
  const nabiz = (t, at, amp, w = 0.3) => (t < at ? 0 : amp * Math.exp(-(t - at) / w) * Math.min(1, (t - at) / 0.04));

  ctx.shot({
    t0, t1, scene, camera,
    update: (t) => {
      const lt = t - t0;
      camera.fov = 34.5 - 3.2 * ss(0, 3.5, lt) + 2.2 * nabiz(t, AT1 + 0.1, 1, 0.25);
      camera.updateProjectionMatrix();
      camera.rotation.set(0, 0, 0.07 - 0.05 * lt / 3.5);
      // Ateş topu ışığı: yıldızlar ve bulutsu kısa bir an parlar
      const parla = nabiz(t, AT1 + 0.12, 1, 0.35) + nabiz(t, AT2 + 0.12, 1.4, 0.3);
      for (const s of yildizlar) {
        const { boy, gir, faz } = s.userData;
        const a = ss(gir, gir + 0.35, t);
        const tw = 0.85 + 0.15 * Math.sin(t * 9 + faz);
        s.material.opacity = Math.min(1, a * tw * (1 + 0.6 * parla));
        const sc = boy * 3.2 * k * (1 + 0.6 * nabiz(t, gir, 1, 0.18) + 0.25 * parla);
        s.scale.set(sc, sc, 1);
      }
      m42.material.opacity = 0.7 * ss(T(0.6), T(1.4), t) * (1 + parla);
      for (const m of cizgiler) {
        const p = ss(m.userData.gir, m.userData.gir + 0.38, t);
        m.scale.x = Math.max(1e-4, p * m.userData.L);
        m.material.opacity = 0.55 * Math.min(1, p * 3) * (1 - 0.4 * ss(T(3.0), T(3.4), t));
      }
      kaynak.material.opacity = ss(T(0.3), T(0.8), t) * (0.55 + 0.25 * Math.sin(lt * 7)) + 0.8 * parla;
      // Meteorlar
      for (const m of meteorlar) {
        const p = (t - m.ts) / m.sure;
        const on = p >= 0 && p <= 1;
        m.iz.visible = m.bas.visible = on;
        if (!on) continue;
        const dx = Math.cos(m.aci), dy = Math.sin(m.aci);
        const yol = m.r0 + m.hiz * (t - m.ts);
        const hx = rx + dx * yol, hy = ry + dy * yol;
        const L = Math.min(m.boy * Math.sqrt(Math.min(1, p * 1.8)), yol - m.r0 + 4);
        const a = Math.sin(Math.PI * Math.min(1, p * 1.05)) ** 0.7 * m.parlak;
        m.iz.position.copy(P(hx - dx * L, hy - dy * L, 2));
        m.iz.rotation.z = -m.aci;
        m.iz.scale.set(L * k, m.kalin * 3.2 * k, 1);
        m.iz.material.opacity = Math.min(1, a);
        m.bas.position.copy(P(hx, hy, 2.1));
        const hs = (14 + m.kalin * 5.5) * k * (0.8 + 0.4 * a);
        m.bas.scale.set(hs, hs, 1);
        m.bas.material.opacity = Math.min(1, a * 0.95);
      }
    },
  });

  /* ---------- Yazılar ---------- */
  const ust = el(split(BUYUK(`${o.kalanGun} gün sonra · ${o.tarih}`)), { cls: 'mono gold shadow', style: { left: 20, width: 500, top: 116, fontSize: 19, textAlign: 'center', letterSpacing: '0.24em' } });
  maskeAc(ctx, ust, t0);
  kinetic(ust, T(0.04), { how: 'type', stagger: 0.02 });

  const baslik = el(split('Orionid'), { cls: 'display shadow', style: { left: 10, width: 520, top: 146, fontSize: 96, textAlign: 'center', whiteSpace: 'nowrap', transformOrigin: '50% 60%' } });
  kinetic(baslik, T(0.14), { how: 'blur', stagger: 0.05, dur: 0.55 });
  maskeAc(ctx, baslik, T(0.9));

  const serif1 = el(split('meteor yağmuru'), { cls: 'serif gold shadow', style: { left: 20, width: 500, top: 246, fontSize: 52, textAlign: 'center' } });
  kinetic(serif1, T(0.5), { how: 'rise', stagger: 0.022, dur: 0.55 });
  maskeAc(ctx, serif1, T(1.1));
  tl.to(serif1, { autoAlpha: 0, y: -10, filter: 'blur(6px)', duration: 0.18, ease: 'power2.in' }, T(2.4));
  const serif2 = el(split('Halley’den kalan tozlar'), { cls: 'serif gold shadow', style: { left: 20, width: 500, top: 246, fontSize: 50, textAlign: 'center' } });
  kinetic(serif2, T(2.55), { how: 'rise', stagger: 0.016, dur: 0.5 });
  maskeAc(ctx, serif2, T(3.1));

  const avci = el(split(BUYUK(o.sacilma ?? 'Avcı (Orion)')), { cls: 'mono shadow', style: { left: 384, top: 522, fontSize: 13, letterSpacing: '0.22em', opacity: 0.8, whiteSpace: 'nowrap' } });
  kinetic(avci, T(1.0), { how: 'type', stagger: 0.03 });

  // Sayaç: SAATTE ~20 METEOR
  const sayi = el('0', { cls: 'display shadow', style: { left: 0, width: 262, top: 656, fontSize: 112, textAlign: 'right', fontVariantNumeric: 'tabular-nums', transformOrigin: '100% 60%' } });
  tl.fromTo(sayi, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: 'expo.out', immediateRender: false }, AT1 + 0.1);
  ctx.counter(sayi, 0, o.saatte ?? 20, AT1 + 0.12, 0.9, (n) => `~${Math.round(n)}`);
  tl.fromTo(sayi, { scale: 1.15 }, { scale: 1, duration: 0.4, ease: 'expo.out', immediateRender: false }, AT1 + 1.02);
  const birim1 = el(split('METEOR'), { cls: 'mono shadow', style: { left: 280, top: 678, fontSize: 24, letterSpacing: '0.2em' } });
  const birim2 = el(split('SAATTE'), { cls: 'mono gold shadow', style: { left: 280, top: 714, fontSize: 24, letterSpacing: '0.2em' } });
  kinetic(birim1, AT1 + 0.25, { how: 'rise', stagger: 0.03, dur: 0.4 });
  kinetic(birim2, AT1 + 0.4, { how: 'rise', stagger: 0.03, dur: 0.4 });
  maskeAc(ctx, birim1, AT1 + 0.9); maskeAc(ctx, birim2, AT1 + 1.0);

  // Çıkış: ikinci ateş topuyla yazılar parlayıp dağılır
  tl.to([ust, baslik, serif2, avci, sayi, birim1, birim2], { autoAlpha: 0, scale: 1.12, filter: 'blur(10px)', duration: 0.24, ease: 'power2.in', stagger: 0.012 }, t1 - 0.32);

  /* ---------- Geçiş ve ses ---------- */
  ctx.flash(AT1 + 0.14, { color: '#dfe9ff', peak: 0.2, dur: 0.3 });
  ctx.flash(t1, { color: '#f4f7ff', peak: 0.95, dur: 0.32 });
  ctx.sound(t0, 'sub', 0.3);
  ctx.sound(T(0.04), 'shimmer', 0.35);
  ctx.sound(T(0.14), 'hit', 0.42);
  for (const m of meteorlar) if (m.parlak > 1.0 && m.parlak < 1.5) ctx.sound(m.ts, 'swipe', 0.08 + 0.08 * m.parlak);
  ctx.sound(AT1 - 0.05, 'whoosh', 0.5, { d: 0.7, lo: 300, hi: 4200 });
  ctx.sound(AT1 + 0.12, 'hit', 0.6);
  ctx.sound(AT1 + 0.12, 'scan', 0.22, { d: 0.9 });
  ctx.sound(AT1 + 1.02, 'tock', 0.32, { p: 0.7 });
  ctx.sound(T(2.55), 'chime', 0.3);
  ctx.sound(AT2 - 0.05, 'whoosh', 0.5, { d: 0.45, lo: 400, hi: 4800 });
}
