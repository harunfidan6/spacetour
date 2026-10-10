// s4 · Mars ve Jüpiter (10.5–13.5): iki hızlı kesme. Her gezegen uzaktan dönerek kadraja çarpar, saat dev yazıyla gelir.
//  10.5 Mars · GECE YARISINDAN SONRA · 01:50 · doğudan yükseliyor     12.0 kesme (ışık patlaması)
//  12.0 Jüpiter · VE SABAHA KARŞI · 03:00 · gecenin en parlak gezegeni    13.5 karartma → Orionid
import { iz, maskeAc } from './s2-ay.js';

const VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vWN;
varying vec3 vWP;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWP = wp.xyz;
  vWN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform vec3 uSun;
uniform vec3 uRim;
uniform float uRimI;
uniform float uGain;
varying vec2 vUv;
varying vec3 vWN;
varying vec3 vWP;
void main() {
  vec3 n = normalize(vWN);
  vec3 s = normalize(uSun);
  float ndl = dot(n, s);
  float diff = smoothstep(-0.22, 0.62, ndl) * (0.5 + 0.5 * clamp(ndl, 0.0, 1.0));
  vec3 v = normalize(cameraPosition - vWP);
  float mu = clamp(dot(n, v), 0.0, 1.0);
  float limb = 0.5 + 0.5 * pow(mu, 0.5);
  float rim = pow(1.0 - mu, 2.6) * clamp(ndl * 0.9 + 0.35, 0.0, 1.0);
  vec3 c = texture2D(uMap, vUv).rgb;
  vec3 col = c * (0.02 + 1.55 * diff) * limb * uGain + uRim * rim * uRimI;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

/** Tek gezegenli sahne: kamera +z'den bakar; kur({ rpx, cx, cy, roll, gain }) ekrandaki yarıçapı (CSS px) ve yeri ayarlar */
function gezegenSahnesi(ctx, { map, sun, rim, rimI = 0.9, halo, seed, tilt = 0 }) {
  const { THREE, W, H } = ctx;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, W / H, 0.01, 2000);
  scene.add(ctx.stars({ count: 2400, radius: 600, seed, size: 1.3 }));
  const U = { uMap: { value: ctx.tex(map) }, uSun: { value: sun.clone().normalize() }, uRim: { value: new THREE.Color(rim) }, uRimI: { value: rimI }, uGain: { value: 1 } };
  const govde = new THREE.Group();
  govde.rotation.z = tilt;
  scene.add(govde);
  const kure = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), new THREE.ShaderMaterial({ uniforms: U, vertexShader: VERT, fragmentShader: FRAG }));
  govde.add(kure);
  // Güneş tarafına kayık hafif hale
  const hale = new THREE.Sprite(new THREE.SpriteMaterial({ map: ctx.glow(halo), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.5 }));
  hale.position.copy(sun.clone().normalize().multiplyScalar(0.25)).setZ(-1.2);
  hale.scale.set(3.4, 3.4, 1);
  scene.add(hale);
  const TAN = Math.tan((camera.fov * Math.PI) / 360);
  function kur(k) {
    const a = (k.rpx / (H / 2)) * TAN; // yarıçapın açısal tanjantı
    const d = Math.sqrt(1 + a * a) / a;
    camera.position.set(0, 0, d);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
    camera.rotateZ(k.roll);
    camera.setViewOffset(W, H, W / 2 - k.cx, H / 2 - k.cy, W, H);
    U.uGain.value = k.gain ?? 1;
    hale.material.opacity = 0.5 * (k.hale ?? 1);
  }
  return { scene, camera, kure, kur, U };
}

export default function sahne(ctx, { t0, t1 }) {
  const { THREE, tl, gsap, el, split, kinetic, veri } = ctx;
  const TM = t0 + (t1 - t0) / 2; // 12.0 kesme
  const mars = veri?.mars ?? { aralik: ['01:50', '06:40'] };
  const jup = veri?.jupiter ?? { aralik: ['03:00', '06:40'], not: 'Gecenin en parlak gezegeni' };
  const nabiz = (t, at, amp, w = 0.3) => (t < at ? 0 : amp * Math.exp(-(t - at) / w) * Math.min(1, (t - at) / 0.04));

  /* ---------- Mars ---------- */
  const M = gezegenSahnesi(ctx, {
    map: '/textures/planets/mars.webp', sun: new THREE.Vector3(-0.92, 0.3, 0.42), rim: 0xff9a6b, rimI: 0.8, seed: 41, tilt: 0.44,
    halo: [[0, 'rgba(255,140,90,0.55)'], [0.35, 'rgba(255,110,60,0.16)'], [1, 'rgba(255,90,40,0)']],
  });
  const mKam = iz(gsap, [
    [t0, { rpx: 24, cx: 300, cy: 660, roll: 0.7 }],
    [t0 + 0.42, { rpx: 182, cx: 270, cy: 652, roll: 0.06 }, 'expo.out'],
    [TM - 0.16, { rpx: 200, cx: 268, cy: 650, roll: -0.02 }, 'none'],
    [TM, { rpx: 330, cx: 262, cy: 640, roll: -0.22 }, 'power3.in'],
  ]);
  ctx.shot({
    t0, t1: TM, scene: M.scene, camera: M.camera,
    update: (t) => {
      const k = mKam(t);
      k.gain = 1 + nabiz(t, t0 + 0.42, 0.4, 0.3);
      M.kur(k);
      M.kure.rotation.y = 1.9 + (t - t0) * 0.55;
    },
  });

  /* ---------- Jüpiter ---------- */
  const J = gezegenSahnesi(ctx, {
    map: '/textures/planets/jupiter.webp', sun: new THREE.Vector3(0.9, 0.22, 0.45), rim: 0xffd8a8, rimI: 0.7, seed: 52, tilt: -0.05,
    halo: [[0, 'rgba(255,222,170,0.5)'], [0.35, 'rgba(255,200,140,0.14)'], [1, 'rgba(255,190,120,0)']],
  });
  const jKam = iz(gsap, [
    [TM, { rpx: 36, cx: 240, cy: 700, roll: -0.6 }],
    [TM + 0.42, { rpx: 206, cx: 270, cy: 684, roll: -0.04 }, 'expo.out'],
    [t1 - 0.2, { rpx: 222, cx: 272, cy: 680, roll: 0.02 }, 'none'],
    [t1, { rpx: 760, cx: 280, cy: 620, roll: 0.2 }, 'power4.in'],
  ]);
  ctx.shot({
    t0: TM, t1, scene: J.scene, camera: J.camera,
    update: (t) => {
      const k = jKam(t);
      k.gain = 1 + nabiz(t, TM + 0.42, 0.45, 0.3);
      J.kur(k);
      J.kure.rotation.y = -0.4 + (t - TM) * 0.8; // Jüpiter hızlı döner (10 saatlik gün)
    },
  });

  /* ---------- Yazılar ---------- */
  const blok = (ust, ad, adRenk, saat, alt, altCls, t, adBoy) => {
    const n1 = el(split(ust), { cls: 'mono gold shadow', style: { left: 20, width: 500, top: 116, fontSize: 19, textAlign: 'center', letterSpacing: '0.24em' } });
    const n2 = el(split(ad), { cls: 'display shadow', style: { left: 10, width: 520, top: 148, fontSize: adBoy, textAlign: 'center', whiteSpace: 'nowrap', color: adRenk, transformOrigin: '50% 60%' } });
    const n3 = el(split(saat), { cls: 'display shadow', style: { left: 20, width: 500, top: 262, fontSize: 104, textAlign: 'center', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' } });
    const n4 = el(split(alt), { cls: `${altCls} shadow`, style: { left: 20, width: 500, top: altCls === 'serif gold' ? 380 : 392, fontSize: altCls === 'serif gold' ? 46 : 19, textAlign: 'center', letterSpacing: altCls === 'serif gold' ? '-0.01em' : '0.2em' } });
    [n1, n2, n3, n4].forEach((n) => maskeAc(ctx, n, t + 0.9));
    kinetic(n1, t + 0.02, { how: 'type', stagger: 0.016 });
    kinetic(n2, t + 0.1, { how: 'slam', stagger: 0.045, dur: 0.62 });
    kinetic(n3, t + 0.42, { how: 'rise', stagger: 0.04, dur: 0.55 });
    tl.fromTo(n3, { scale: 1.12 }, { scale: 1, duration: 0.45, ease: 'expo.out', immediateRender: false }, t + 0.5);
    kinetic(n4, t + 0.72, altCls === 'serif gold' ? { how: 'rise', stagger: 0.014, dur: 0.5 } : { how: 'blur', stagger: 0.016, dur: 0.32 });
    return [n1, n2, n3, n4];
  };
  const mb = blok('GECE YARISINDAN SONRA', 'Mars', '#ff8656', mars.aralik[0], 'DOĞUDAN YÜKSELİYOR', 'mono', t0, 132);
  tl.to(mb, { x: 90, autoAlpha: 0, filter: 'blur(8px)', duration: 0.18, ease: 'power3.in', stagger: 0.015 }, TM - 0.22);
  const jb = blok('VE SABAHA KARŞI', 'Jüpiter', '#ffe2b0', jup.aralik[0], (jup.not ?? 'Gecenin en parlak gezegeni').toLocaleLowerCase('tr-TR'), 'serif gold', TM, 90);
  tl.to(jb, { scale: 1.4, autoAlpha: 0, filter: 'blur(10px)', duration: 0.22, ease: 'power2.in', stagger: 0.015 }, t1 - 0.3);

  /* ---------- Geçiş ve ses ---------- */
  ctx.flash(TM, { color: '#ffd9b0', peak: 0.9, dur: 0.3 });
  ctx.dip(t1, { dur: 0.22 });
  ctx.sound(t0, 'sub', 0.35);
  ctx.sound(t0 + 0.02, 'whoosh', 0.32, { d: 0.42, lo: 400, hi: 3000 });
  ctx.sound(t0 + 0.42, 'hit', 0.5);
  ctx.sound(t0 + 0.42, 'tock', 0.3, { p: 0.8 });
  ctx.sound(t0 + 0.72, 'tick', 0.32);
  ctx.sound(TM - 0.2, 'swipe', 0.32);
  ctx.sound(TM, 'hit', 0.6);
  ctx.sound(TM, 'sub', 0.4);
  ctx.sound(TM + 0.42, 'tock', 0.32, { p: 0.6 });
  ctx.sound(TM + 0.72, 'shimmer', 0.4);
  ctx.sound(t1 - 0.3, 'whoosh', 0.42, { d: 0.4, lo: 500, hi: 3600 });
}
