// s3 · Satürn (6.0–10.5): kırbaçtan halkaların hemen yanına inilir, kamera geri çekilip Satürn'ü bütün olarak açar.
// Halka gölgesi küreye, küre gölgesi halkaya düşer. Üstte SATÜRN · "bütün gece sahnede"; saat şeridinde işaret
// 19:10'dan en iyi ana (00:30) koşar, saat etiketi akarak sayar. 10.1'de kamera halkalara dalar, 10.5'te kırbaç.
import { iz, maskeAc } from './s2-ay.js';

const GLOBE_VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vL;
varying vec3 vLN;
varying vec3 vWN;
varying vec3 vWP;
void main() {
  vUv = uv;
  vL = position;
  vLN = normalize(normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWP = wp.xyz;
  vWN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const GLOBE_FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform sampler2D uPat;
uniform vec3 uSun;   // küre yerel çerçevesinde Güneş yönü
uniform vec3 uSunW;  // dünya çerçevesinde
uniform float uIn;
uniform float uOut;
uniform float uGain;
varying vec2 vUv;
varying vec3 vL;
varying vec3 vLN;
varying vec3 vWN;
varying vec3 vWP;
void main() {
  vec3 n = normalize(vLN);
  vec3 s = normalize(uSun);
  float ndl = dot(n, s);
  float diff = smoothstep(-0.06, 0.5, ndl) * (0.55 + 0.45 * clamp(ndl, 0.0, 1.0));
  // Halka gölgesi: yüzeyden Güneş'e giden ışın halka düzlemini (y = 0) halkanın içinden keser mi?
  float sh = 1.0;
  if (abs(s.y) > 0.001) {
    float k = -vL.y / s.y;
    if (k > 0.0) {
      float r = length((vL + k * s).xz);
      if (r > uIn && r < uOut) {
        float a = texture2D(uPat, vec2(1.0 - (r - uIn) / (uOut - uIn), 0.5)).r;
        sh = 1.0 - 0.78 * a;
      }
    }
  }
  vec3 c = texture2D(uMap, vUv).rgb;
  vec3 v = normalize(cameraPosition - vWP);
  vec3 wn = normalize(vWN);
  float mu = clamp(dot(wn, v), 0.0, 1.0);
  float limb = 0.55 + 0.45 * pow(mu, 0.45);
  float rim = pow(1.0 - mu, 3.0) * clamp(dot(wn, normalize(uSunW)) * 0.8 + 0.25, 0.0, 1.0);
  vec3 col = c * (0.025 + 1.5 * diff * sh) * limb * uGain + vec3(1.0, 0.82, 0.55) * rim * 0.35;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const RING_VERT = /* glsl */ `
varying vec2 vXY;
void main() {
  vXY = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const RING_FRAG = /* glsl */ `
uniform sampler2D uCol;
uniform sampler2D uPat;
uniform vec3 uSun;   // Satürn grubunun çerçevesinde
uniform float uR;
uniform float uIn;
uniform float uOut;
uniform float uGain;
varying vec2 vXY;
void main() {
  float r = length(vXY);
  float u = 1.0 - clamp((r - uIn) / (uOut - uIn), 0.0, 1.0); // dokuda sol kenar dış halka
  vec3 c = texture2D(uCol, vec2(u, 0.5)).rgb;
  float a = texture2D(uPat, vec2(u, 0.5)).r;
  // Küre gölgesi: halkadaki noktadan Güneş'e giden ışın küreye çarpar mı?
  vec3 p = vec3(vXY.x, 0.0, -vXY.y);
  vec3 s = normalize(uSun);
  float t = -dot(p, s);
  float sh = 1.0;
  if (t > 0.0) {
    float d2 = dot(p, p) - t * t;
    sh = 0.06 + 0.94 * smoothstep(uR * uR * 0.9, uR * uR * 1.04, d2);
  }
  float lit = 0.35 + 0.65 * smoothstep(0.0, 0.25, abs(s.y));
  gl_FragColor = vec4(c * 1.2 * sh * lit * uGain, a * 0.96);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

/** "19:10" → dakika; gece yarısını geçen saatler 24 saat ileri sayılır (başlangıçtan küçükse) */
const dk = (s) => { const [h, m] = String(s).split(':').map(Number); return h * 60 + m; };
const saat = (m) => { const x = ((Math.round(m) % 1440) + 1440) % 1440; return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`; };

export default function sahne(ctx, { t0, t1 }) {
  const { THREE, tl, gsap, el, split, kinetic, W, H } = ctx;
  const T = (x) => t0 + x;
  const v = ctx.veri?.saturn ?? { aralik: ['19:10', '06:10'], enIyi: '00:30', yon: 'Güney', yukseklik: 51 };
  const BUYUK = (x) => String(x).toLocaleUpperCase('tr-TR');

  /* ---------- 3D ---------- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, W / H, 0.01, 2000);
  scene.add(camera);
  scene.add(ctx.stars({ count: 2600, radius: 600, seed: 33, size: 1.3 }));

  const R = 1, IN = 1.24, OUT = 2.3;
  const sat = new THREE.Group();
  sat.rotation.set(0.06, 0, 0.36);
  scene.add(sat);

  const pat = ctx.tex('/textures/planets/saturnRingPattern.webp', { srgb: false });
  const SUN = new THREE.Vector3(-0.93, 0.3, 0.2).normalize(); // soldan: sağda gece yüzü, halkada küre gölgesi
  const gU = {
    uMap: { value: ctx.tex('/textures/planets/saturn.webp') }, uPat: { value: pat },
    uSun: { value: new THREE.Vector3() }, uSunW: { value: SUN.clone() }, uIn: { value: IN }, uOut: { value: OUT }, uGain: { value: 1 },
  };
  const globe = new THREE.Mesh(new THREE.SphereGeometry(R, 128, 96), new THREE.ShaderMaterial({ uniforms: gU, vertexShader: GLOBE_VERT, fragmentShader: GLOBE_FRAG }));
  globe.scale.y = 0.91;
  sat.add(globe);

  const rU = {
    uCol: { value: ctx.tex('/textures/planets/saturnRing.webp') }, uPat: { value: pat },
    uSun: { value: new THREE.Vector3() }, uR: { value: R }, uIn: { value: IN }, uOut: { value: OUT }, uGain: { value: 1 },
  };
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(IN, OUT, 320, 4),
    new THREE.ShaderMaterial({ uniforms: rU, vertexShader: RING_VERT, fragmentShader: RING_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide }),
  );
  ring.rotation.x = -Math.PI / 2;
  sat.add(ring);

  // Halka tozu: kamera halkaların yanından geçerken hız hissi veren parçacıklar
  {
    const r = ctx.rand(303), N = 2600, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const rr = IN + 0.04 + Math.sqrt(r()) * (OUT - IN - 0.12), a = r() * Math.PI * 2;
      pos.set([Math.cos(a) * rr, (r() - 0.5) * 0.03, Math.sin(a) * rr], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(g, new THREE.PointsMaterial({ size: 0.014, color: 0xf3dfb8, transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending }));
    sat.add(dust);
  }

  // Sol üst köşede Güneş'in mercek parıltısı (kameraya bağlı)
  const flare = new THREE.Sprite(new THREE.SpriteMaterial({ map: ctx.glow([[0, 'rgba(255,240,215,0.9)'], [0.18, 'rgba(255,200,130,0.35)'], [0.55, 'rgba(255,150,70,0.08)'], [1, 'rgba(255,120,40,0)']]), transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55 }));
  flare.position.set(-3.1, 6.2, -10);
  flare.scale.set(9, 9, 1);
  camera.add(flare);

  // Kamera: Satürn merkezi etrafında küresel iz; merkez ekranda (cx, cy) noktasına mercek kaydırmayla oturur
  const kam = iz(gsap, [
    [T(0), { d: 3.4, el: 0.07, az: -1.05, cx: 270, cy: 640, roll: 0.42 }],
    [T(0.95), { d: 15.2, el: 0.3, az: -0.3, cx: 270, cy: 652, roll: 0.03 }, 'expo.out'],
    [T(4.0), { d: 12.6, el: 0.36, az: 0.1, cx: 270, cy: 650, roll: -0.04 }, 'sine.inOut'],
    [T(4.5), { d: 3.1, el: 0.16, az: 0.42, cx: 270, cy: 640, roll: -0.32 }, 'power3.in'],
  ]);
  const nabiz = (t, at, amp, w = 0.3) => (t < at ? 0 : amp * Math.exp(-(t - at) / w) * Math.min(1, (t - at) / 0.04));
  const q = new THREE.Quaternion();

  ctx.shot({
    t0, t1, scene, camera,
    update: (t) => {
      const k = kam(t);
      const d = k.d * (1 - 0.025 * nabiz(t, T(2.0), 1, 0.25));
      camera.position.set(Math.sin(k.az) * Math.cos(k.el) * d, Math.sin(k.el) * d, Math.cos(k.az) * Math.cos(k.el) * d);
      camera.up.set(0, 1, 0);
      camera.lookAt(0, 0, 0);
      camera.rotateZ(k.roll);
      camera.setViewOffset(W, H, W / 2 - k.cx, H / 2 - k.cy, W, H);
      globe.rotation.y = 0.6 + (t - t0) * 0.22;
      // Güneş yönü: küre ve halka için yerel çerçeveye çevrilir
      sat.updateMatrixWorld();
      globe.getWorldQuaternion(q).invert();
      gU.uSun.value.copy(SUN).applyQuaternion(q);
      sat.getWorldQuaternion(q).invert();
      rU.uSun.value.copy(SUN).applyQuaternion(q);
      const g = 1 + nabiz(t, T(2.0), 0.35, 0.3);
      gU.uGain.value = g; rU.uGain.value = g;
      flare.material.opacity = 0.5 + 0.3 * nabiz(t, T(2.0), 1, 0.35);
    },
  });

  /* ---------- Yazılar (güvenli alan y 110–760) ---------- */
  const baslik = el(split('Satürn'), { cls: 'display shadow', style: { left: 20, width: 500, top: 112, fontSize: 98, textAlign: 'center', whiteSpace: 'nowrap', transformOrigin: '50% 60%' } });
  kinetic(baslik, T(0.04), { how: 'slam', stagger: 0.045, dur: 0.7 });
  maskeAc(ctx, baslik, T(0.6));

  const serif = el(split('bütün gece sahnede'), { cls: 'serif gold shadow', style: { left: 20, width: 500, top: 232, fontSize: 56, textAlign: 'center' } });
  kinetic(serif, T(0.5), { how: 'rise', stagger: 0.02, dur: 0.6 });
  maskeAc(ctx, serif, T(1.2));

  // Saat şeridi: 19:10 ───●─── 06:10
  const X0 = 66, X1 = 474, LY = 352;
  const m0 = dk(v.aralik[0]);
  let m1 = dk(v.aralik[1]); if (m1 <= m0) m1 += 1440;
  let mb = dk(v.enIyi); if (mb < m0) mb += 1440;
  const FR = (mb - m0) / (m1 - m0), XB = X0 + (X1 - X0) * FR;

  const cizgi = el('', { style: { left: X0, top: LY, width: X1 - X0, height: 2, background: 'linear-gradient(90deg, rgb(244 243 238 / 0.35), rgb(244 243 238 / 0.85) 50%, rgb(244 243 238 / 0.35))', transformOrigin: '0 50%', boxShadow: '0 0 12px rgb(0 0 0 / 0.6)' } });
  tl.set(cizgi, { autoAlpha: 1 }, T(0.9));
  tl.fromTo(cizgi, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'expo.inOut', immediateRender: false }, T(0.9));
  const uc = (x) => el('', { style: { left: x - 1, top: LY - 7, width: 2, height: 16, background: '#f4f3ee' } });
  const [u0, u1] = [uc(X0), uc(X1)];
  tl.fromTo(u0, { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.2, ease: 'back.out(3)', immediateRender: false }, T(0.92));
  tl.fromTo(u1, { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.2, ease: 'back.out(3)', immediateRender: false }, T(1.32));

  const etiket = (txt, x, align) => el(split(txt), { cls: 'mono shadow', style: { left: align === 'left' ? x - 6 : x - 120 + 6, width: 120, top: LY + 16, fontSize: 18, textAlign: align, letterSpacing: '0.16em' } });
  const e0 = etiket(v.aralik[0], X0, 'left'), e1 = etiket(v.aralik[1], X1, 'right');
  kinetic(e0, T(0.95), { how: 'blur', stagger: 0.03, dur: 0.3 });
  kinetic(e1, T(1.35), { how: 'blur', stagger: 0.03, dur: 0.3 });
  maskeAc(ctx, e0, T(1.4)); maskeAc(ctx, e1, T(1.8));

  // İşaret: 19:10'dan en iyi ana koşar; üstündeki saat akarak sayar
  const KOS0 = T(1.3), KOS = 0.72;
  const isaret = el('<div class="nokta"></div><div class="halka"></div>', { style: { left: X0 - 9, top: LY - 8, width: 18, height: 18 } });
  const nokta = isaret.querySelector('.nokta'), halka = isaret.querySelector('.halka');
  Object.assign(nokta.style, { position: 'absolute', inset: '2px', borderRadius: '50%', background: '#f5c542', boxShadow: '0 0 14px 3px rgb(245 197 66 / 0.75)' });
  Object.assign(halka.style, { position: 'absolute', inset: '0', borderRadius: '50%', border: '2px solid #f5c542', opacity: '0' });
  tl.fromTo(isaret, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.2, ease: 'back.out(3)', immediateRender: false }, KOS0 - 0.08);
  tl.to(isaret, { x: XB - X0, duration: KOS, ease: 'power3.inOut' }, KOS0);
  tl.fromTo(halka, { scale: 1, opacity: 0.9 }, { scale: 4.2, opacity: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, KOS0 + KOS);
  tl.fromTo(halka, { scale: 1, opacity: 0.7 }, { scale: 3.2, opacity: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, KOS0 + KOS + 0.5);

  const zaman = el(v.aralik[0], { cls: 'display gold shadow', style: { left: X0 - 70, width: 140, top: LY - 50, fontSize: 34, textAlign: 'center', letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' } });
  tl.fromTo(zaman, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: 'power2.out', immediateRender: false }, KOS0 - 0.05);
  tl.to(zaman, { x: XB - X0, duration: KOS, ease: 'power3.inOut' }, KOS0);
  ctx.counter(zaman, m0, mb, KOS0, KOS, (n) => saat(n));
  tl.fromTo(zaman, { scale: 1.35 }, { scale: 1, duration: 0.4, ease: 'expo.out', immediateRender: false }, KOS0 + KOS);

  const eniyi = el(split('EN İYİ AN'), { cls: 'mono gold shadow', style: { left: XB - 100, width: 200, top: LY + 16, fontSize: 18, textAlign: 'center', letterSpacing: '0.2em' } });
  kinetic(eniyi, KOS0 + KOS + 0.05, { how: 'rise', stagger: 0.025, dur: 0.4 });
  maskeAc(ctx, eniyi, KOS0 + KOS + 0.5);

  // Bilgi satırı: nereye bakılır → çıplak gözle görülür
  const bilgi1 = el(split(BUYUK(`${v.yon}de · ufkun ${v.yukseklik}° üzerinde`)), { cls: 'mono shadow', style: { left: 20, width: 500, top: 418, fontSize: 19, textAlign: 'center', letterSpacing: '0.18em' } });
  maskeAc(ctx, bilgi1, t0);
  kinetic(bilgi1, T(2.25), { how: 'type', stagger: 0.02 });
  tl.to(bilgi1, { autoAlpha: 0, y: -8, filter: 'blur(6px)', duration: 0.16, ease: 'power2.in' }, T(3.3));
  const bilgi2 = el(split('ÇIPLAK GÖZLE GÖRÜLÜR'), { cls: 'mono shadow', style: { left: 20, width: 500, top: 418, fontSize: 19, textAlign: 'center', letterSpacing: '0.18em' } });
  maskeAc(ctx, bilgi2, t0);
  kinetic(bilgi2, T(3.45), { how: 'blur', stagger: 0.016, dur: 0.32 });

  // Dalış: yazılar yukarı savrulur
  const hepsi = [baslik, serif, cizgi, u0, u1, e0, e1, isaret, zaman, eniyi, bilgi2];
  tl.to(hepsi, { y: -60, autoAlpha: 0, filter: 'blur(8px)', duration: 0.26, ease: 'power3.in', stagger: 0.012 }, t1 - 0.4);

  /* ---------- Geçiş ve ses ---------- */
  ctx.whip(t1, { dir: 1 });
  ctx.sound(t0, 'sub', 0.4);
  ctx.sound(t0 + 0.02, 'whoosh', 0.34, { d: 0.6, lo: 300, hi: 2600 });
  ctx.sound(T(0.5), 'shimmer', 0.32);
  ctx.sound(T(0.9), 'swipe', 0.3);
  ctx.sound(KOS0, 'scan', 0.26, { d: KOS });
  ctx.sound(KOS0 + KOS, 'hit', 0.55);
  ctx.sound(KOS0 + KOS + 0.02, 'chime', 0.35);
  ctx.sound(T(2.25), 'tick', 0.35);
  ctx.sound(T(3.45), 'blip', 0.3, { p: 1.5 });
  ctx.sound(t1 - 0.35, 'warp', 0.4, { d: 0.4 });
}
