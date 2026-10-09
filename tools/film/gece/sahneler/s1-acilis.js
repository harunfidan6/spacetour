// s1 · Soğuk açılış (0–2.5): siyahtan yıldızların arasına hiper hız.
//   0.0 yıldızlar belirir · 0.5 "8 EKİM" çarpar · 1.0 "bu gece gökyüzünde" · 1.5 "NELER VAR?" · 2.2–2.5 hız tepesi + beyaz flaş → Ay
// warpField / travelTable / spl kapanış sahnesi (s7) tarafından da kullanılır.

/** Hız eğrisinden yol tablosu: t → kat edilen yol (sabit adımlı yamuk toplamı, her karede aynı) */
export function travelTable(speed, t0, t1, dt = 1 / 600) {
  const n = Math.ceil((t1 - t0) / dt) + 1, acc = new Float64Array(n);
  for (let i = 1; i < n; i++) acc[i] = acc[i - 1] + 0.5 * (speed(t0 + (i - 1) * dt) + speed(t0 + i * dt)) * dt;
  return (t) => {
    const x = Math.min(Math.max((t - t0) / dt, 0), n - 1), i = Math.floor(x), f = x - i;
    return i >= n - 1 ? acc[n - 1] : acc[i] * (1 - f) + acc[i + 1] * f;
  };
}

/** Darbe: t=0'da hızla yükselip üstel söner */
export const kick = (x, rise = 0.025, decay = 0.2) => (x <= 0 ? 0 : (1 - Math.exp(-x / rise)) * Math.exp(-x / decay));
export const smooth = (a, b, x) => { const u = Math.min(Math.max((x - a) / (b - a), 0), 1); return u * u * (3 - 2 * u); };

const VERT = /* glsl */ `
uniform float uTravel, uStretch, uDepth, uExtra, uWidth, uMinLen, uFade, uNear, uBlue, uNearBoost;
uniform vec2 uRes;
attribute vec2 aCorner;   // x: 0 baş / 1 kuyruk · y: -1 / +1 yan
attribute vec4 aInfo;     // rgb renk, a parlaklık
attribute float aWidth;
varying vec2 vUv; varying vec3 vColor; varying float vAlpha;
void main() {
  float span = uDepth + uExtra;
  float z = -uDepth + mod(position.z + uTravel, span);
  vec4 h = modelViewMatrix * vec4(position.xy, z, 1.0);
  vec4 t = modelViewMatrix * vec4(position.xy, z - uStretch, 1.0);
  float n = -uNear;
  if (h.z > n && t.z > n) { gl_Position = vec4(4.0, 4.0, 4.0, 1.0); vAlpha = 0.0; vUv = vec2(0.0); vColor = vec3(0.0); return; }
  if (h.z > n) h = t + (h - t) * ((n - t.z) / (h.z - t.z));
  if (t.z > n) t = h + (t - h) * ((n - h.z) / (t.z - h.z));
  vec4 ch = projectionMatrix * h, ct = projectionMatrix * t;
  vec2 sh = ch.xy / ch.w * 0.5 * uRes, st = ct.xy / ct.w * 0.5 * uRes;
  vec2 d = sh - st; float L = length(d);
  vec2 dir = L > 0.001 ? d / L : vec2(0.0, 1.0);
  float dist = max(-h.z, 0.5);
  float w = uWidth * aWidth * clamp(uNearBoost / dist, 0.85, 4.0);
  if (L < uMinLen) st = sh - dir * uMinLen;
  float isTail = aCorner.x;
  vec2 s = mix(sh + dir * w * 0.5, st - dir * w * 0.5, isTail);
  s += vec2(-dir.y, dir.x) * aCorner.y * w * 0.5;
  vec4 c = isTail > 0.5 ? ct : ch;
  gl_Position = vec4(s / (0.5 * uRes) * c.w, c.z, c.w);
  float far = smoothstep(-uDepth, -uDepth * 0.7, z);
  vAlpha = aInfo.a * uFade * far * clamp(uNearBoost * 2.6 / dist, 0.6, 1.0);
  vColor = mix(aInfo.rgb, vec3(0.74, 0.88, 1.0), uBlue);
  vUv = vec2(isTail, aCorner.y);
}`;
const FRAG = /* glsl */ `
varying vec2 vUv; varying vec3 vColor; varying float vAlpha;
void main() {
  float side = 1.0 - abs(vUv.y); side = side * side * (3.0 - 2.0 * side);
  float along = pow(1.0 - vUv.x, 1.7);
  float a = vAlpha * side * (0.12 + 0.88 * along);
  gl_FragColor = vec4(vColor, a);
}`;

/**
 * Işık hızı yıldız alanı: her yıldız kamera eksenine paralel bir tünelde ilerler; çizgi uzunluğu hıza bağlı.
 * Konumlar gölgelendiricide yoldan (uTravel) hesaplanır → her kare deterministik.
 */
export function warpField(ctx, { count = 1600, depth = 420, extra = 160, rMin = 1.6, rMax = 62, seed = 11, gold = 0.12, sky = 0.12 } = {}) {
  const { THREE } = ctx;
  const r = ctx.rand(seed), N = count;
  const pos = new Float32Array(N * 12), corner = new Float32Array(N * 8), info = new Float32Array(N * 16), wid = new Float32Array(N * 4);
  const idx = new Uint16Array(N * 6);
  const PAPER = [0.957, 0.953, 0.933], GOLD = [0.96, 0.77, 0.26], SKY = [0.22, 0.74, 0.97];
  const C = [[0, -1], [0, 1], [1, -1], [1, 1]];
  for (let i = 0; i < N; i++) {
    const a = r() * Math.PI * 2, rr = rMin + (rMax - rMin) * Math.sqrt(r()), z0 = r() * (depth + extra);
    const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
    const k = r(), col = k < gold ? GOLD : k < gold + sky ? SKY : PAPER;
    const b = 0.45 + 0.55 * Math.pow(r(), 1.3), w = 0.7 + 0.9 * r();
    for (let j = 0; j < 4; j++) {
      const v = i * 4 + j;
      pos.set([x, y, z0], v * 3);
      corner.set(C[j], v * 2);
      info.set([col[0], col[1], col[2], b], v * 4);
      wid[v] = w;
    }
    idx.set([i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 2, i * 4 + 1, i * 4 + 3], i * 6);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aCorner', new THREE.BufferAttribute(corner, 2));
  g.setAttribute('aInfo', new THREE.BufferAttribute(info, 4));
  g.setAttribute('aWidth', new THREE.BufferAttribute(wid, 1));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  const size = ctx.renderer.getDrawingBufferSize(new THREE.Vector2());
  const u = {
    uTravel: { value: 0 }, uStretch: { value: 0.1 }, uDepth: { value: depth }, uExtra: { value: extra },
    uWidth: { value: 4.2 }, uMinLen: { value: 4 }, uFade: { value: 1 }, uNear: { value: 0.12 }, uBlue: { value: 0 },
    uNearBoost: { value: 26 }, uRes: { value: new THREE.Vector2(size.x, size.y) },
  };
  const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending });
  const mesh = new THREE.Mesh(g, mat);
  mesh.frustumCulled = false;
  return { mesh, u };
}

/** Harflere böl (parça başına sınıf): [[metin, sınıf?], ...] → tek satır */
export const spl = (parts) => `<span class="line">${parts.map(([txt, cls = '']) => [...txt].map((c) => `<span class="ch${cls ? ' ' + cls : ''}">${c === ' ' ? '&nbsp;' : c}</span>`).join('')).join('')}</span>`;

export default function sahne(ctx, { t0, t1 }) {
  const { THREE, tl, W, H } = ctx;
  const T = (x) => t0 + x; // sahne içi saniye → mutlak

  /* ---------- 3B: hiper hız tüneli ---------- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(66, W / H, 0.1, 1200);
  const field = warpField(ctx, { count: 1700, seed: 2610, rMax: 64 });
  scene.add(field.mesh);

  // Tünelin ucundaki ışık: hız tepesinde ekranı beyaza boğar
  const coreMat = new THREE.SpriteMaterial({
    map: ctx.glow([[0, 'rgba(255,255,255,1)'], [0.18, 'rgba(225,238,255,0.75)'], [0.45, 'rgba(140,190,255,0.22)'], [1, 'rgba(90,130,255,0)']]),
    transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0,
  });
  const core = new THREE.Sprite(coreMat);
  core.position.set(0, 0, -300);
  scene.add(core);
  // Altın çekirdek (sıcak vurgu)
  const warmMat = new THREE.SpriteMaterial({
    map: ctx.glow([[0, 'rgba(255,230,170,0.9)'], [0.3, 'rgba(245,197,66,0.35)'], [1, 'rgba(245,160,40,0)']]),
    transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0,
  });
  const warm = new THREE.Sprite(warmMat);
  warm.position.set(0, 0, -280);
  scene.add(warm);
  // Kesimden hemen önce ekranı dolduran geniş beyaz ışıma
  const whiteMat = new THREE.SpriteMaterial({
    map: ctx.glow([[0, 'rgba(255,255,255,1)'], [0.25, 'rgba(240,246,255,0.8)'], [0.6, 'rgba(205,225,255,0.3)'], [1, 'rgba(180,210,255,0)']]),
    transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0,
  });
  const white = new THREE.Sprite(whiteMat);
  white.position.set(0, 0, -250);
  scene.add(white);

  // Hız eğrisi (birim/sn): yavaş süzülme → vuruşlarda darbe → 1.8'den sonra tepeye rampa
  const ramp = (t) => Math.pow(smooth(1.75, 2.5, t), 2.3);
  const speed = (t) => 55 + 120 * smooth(0.1, 0.6, t) + 560 * kick(t - 0.5, 0.02, 0.2) + 420 * kick(t - 1.5, 0.02, 0.2) + 2300 * ramp(t);
  const travel = travelTable(speed, t0, t1 + 0.1);

  ctx.shot({
    t0, t1, scene, camera,
    update(t, local) {
      const v = speed(t);
      field.u.uTravel.value = travel(t);
      field.u.uStretch.value = 0.02 + v * 0.05;
      field.u.uFade.value = smooth(0.0, 0.16, local);
      field.u.uBlue.value = 0.55 * ramp(t);
      field.u.uMinLen.value = 4 + 2 * ramp(t);
      // Tünel kendi ekseninde döner (sarmal hissi), tepeye doğru hızlanır
      field.mesh.rotation.z = 0.16 * local + 0.9 * Math.pow(ramp(t), 1.5);

      // Kaçış noktası yazıların altına iner (y≈560), hafifçe salınır
      const k1 = kick(t - 0.5, 0.02, 0.22), k2 = kick(t - 1.5, 0.02, 0.22);
      camera.rotation.set(0.12 * smooth(0.05, 0.9, local) - 0.05 * ramp(t), 0.035 * Math.sin(local * 1.7), 0);
      camera.fov = 64 + 12 * k1 + 9 * k2 + 34 * ramp(t);
      // Darbelerde küçük sarsıntı
      const sh = 0.05 * (k1 + k2);
      camera.position.set(sh * Math.sin(local * 91), sh * Math.cos(local * 77), 0);
      camera.updateProjectionMatrix();
      coreMat.opacity = 0.3 * smooth(0.05, 0.5, local) + 0.25 * (k1 + k2) + 0.7 * ramp(t);
      const wr = Math.pow(smooth(2.05, 2.5, t), 2.2);
      whiteMat.opacity = 0.6 * wr;
      white.scale.set(200 + 1200 * wr, 200 + 1200 * wr, 1);
      const cs = 70 + 40 * (k1 + k2) + 820 * Math.pow(ramp(t), 1.6);
      core.scale.set(cs, cs, 1);
      warmMat.opacity = 0.25 * smooth(0.3, 0.8, local) + 0.35 * (k1 + k2);
      warm.scale.set(40 + 30 * k1 + 25 * k2, 40 + 30 * k1 + 25 * k2, 1);
    },
  });

  /* ---------- Yazılar ---------- */
  const CX = { left: 0, width: W, textAlign: 'center' };

  // Künye: şehir · gün (veri.json; altın nokta), iki yanında ince çizgi
  const kunye = ctx.el(`<span class="k-ln"></span>${spl([[`${ctx.veri?.sehir ?? 'İstanbul'} `], ['·', 'gold'], [` ${ctx.veri?.gun ?? 'Cuma'}`]])}<span class="k-ln"></span>`, {
    cls: 'mono shadow', style: { ...CX, top: 146, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' },
  });
  Object.assign(kunye.querySelector('.line').style, { paddingLeft: '0.28em', overflow: 'visible' });
  const kl = kunye.querySelectorAll('.k-ln');
  kl.forEach((n) => Object.assign(n.style, { display: 'block', width: '34px', height: '1px', background: '#f5c542', opacity: '0.9' }));
  ctx.kinetic(kunye, T(0.25), { how: 'type', stagger: 0.028 });
  tl.fromTo(kl, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'expo.out', immediateRender: false }, T(0.25));

  // Tarih (veri.json, ör. 9 EKİM) — dev başlık
  const title = ctx.el(ctx.split((ctx.veri?.tarih ?? '9 Ekim 2026').replace(/\s*\d{4}$/, '').toLocaleLowerCase('tr-TR')), { cls: 'display shadow', style: { ...CX, top: 252, fontSize: 116 } });
  const unclip = (n) => n.querySelectorAll('.line').forEach((l) => { l.style.overflow = 'visible'; });
  unclip(title);
  ctx.kinetic(title, T(0.5), { how: 'slam', stagger: 0.035, dur: 0.55 });
  tl.fromTo(title, { scale: 1 }, { scale: 1.05, duration: 0.83, ease: 'none', immediateRender: false }, T(0.55));
  tl.fromTo(title, { filter: 'blur(0px)' }, { scale: 2.3, autoAlpha: 0, filter: 'blur(16px)', duration: 0.26, ease: 'power3.in', immediateRender: false }, T(1.38));

  // Altın çizgi: başlığın altında açılır
  const rule = ctx.el('', { style: { left: (W - 300) / 2, top: 372, width: 300, height: 3, background: 'linear-gradient(90deg, transparent, #f5c542 18%, #ffe9a8 50%, #f5c542 82%, transparent)', boxShadow: '0 0 18px rgb(245 197 66 / 0.7)' } });
  tl.set(rule, { autoAlpha: 1 }, T(0.56));
  tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'expo.out', immediateRender: false }, T(0.56));
  tl.to(rule, { scaleX: 2.2, autoAlpha: 0, duration: 0.24, ease: 'power3.in' }, T(1.38));

  // bu gece gökyüzünde — serif kanca; 1.5'te yukarı kayar
  const hook = ctx.el(ctx.split('bu gece gökyüzünde'), { cls: 'serif', style: { ...CX, top: 396, fontSize: 66 } });
  ctx.kinetic(hook, T(1.0), { how: 'rise', stagger: 0.018, dur: 0.6 });
  tl.fromTo(hook, { y: 0 }, { y: -92, duration: 0.5, ease: 'expo.inOut', immediateRender: false }, T(1.32));
  tl.set(hook.querySelectorAll('.line'), { overflow: 'visible' }, T(1.7)); // çıkışta bulanıklık kırpılmasın

  // NELER VAR? — altın vurgu
  const ask = ctx.el(ctx.split('neler var?'), { cls: 'display gold', style: { ...CX, top: 392, fontSize: 62, textShadow: '0 0 28px rgb(245 197 66 / 0.45), 0 2px 24px rgb(0 0 0 / 0.65)' } });
  unclip(ask);
  ctx.kinetic(ask, T(1.5), { how: 'slam', stagger: 0.03, dur: 0.5 });
  tl.fromTo(ask, { scale: 1 }, { scale: 1.04, duration: 0.6, ease: 'power1.out', immediateRender: false }, T(1.55));

  // Hız tepesi: yazılar ışığa doğru savrulur (t1'den önce tamamen çıkar)
  for (const [n, d] of [[hook, 0], [ask, 0.03]]) {
    tl.fromTo(n, { filter: 'blur(0px)' }, { scale: 1.9, autoAlpha: 0, filter: 'blur(18px)', duration: 0.24, ease: 'power4.in', immediateRender: false }, T(2.16 + d));
  }
  ctx.out(kunye, T(2.1), { dur: 0.22 });

  // Geçiş: kaçış noktasından yayılan yumuşak beyaz ışıma → 2.5'te beyaz flaş
  const bloom = ctx.el('', { parent: ctx.fx, style: { left: -270, top: -480, width: W * 2, height: H * 2, mixBlendMode: 'screen',
    background: 'radial-gradient(circle at 50% 52%, #ffffff 0%, rgb(236 244 255 / 0.9) 16%, rgb(190 215 255 / 0.35) 34%, rgb(150 190 255 / 0) 52%)' } });
  tl.fromTo(bloom, { autoAlpha: 0, scale: 0.35 }, { autoAlpha: 1, scale: 1.25, duration: 0.32, ease: 'power2.in', immediateRender: false }, T(2.18));
  tl.to(bloom, { autoAlpha: 0, duration: 0.08, ease: 'none' }, t1 + 0.02);
  ctx.flash(t1, { color: '#ffffff', peak: 0.95, dur: 0.4 });

  /* ---------- Ses ---------- */
  ctx.sound(T(0.0), 'warp', 0.5, { d: 2.5 });
  ctx.sound(T(0.5), 'hit', 0.9);
  ctx.sound(T(0.5), 'sub', 0.7);
  ctx.sound(T(1.0), 'swipe', 0.5);
  ctx.sound(T(1.5), 'hit', 0.55);
  ctx.sound(T(2.08), 'whoosh', 0.85, { d: 0.5, lo: 260, hi: 4200 });
}
