// s2 · Ay (2.5–6.0): dolunaydan incecik hilale. Sayaç %100 → %4 inerken ışık Ay'ın arkasına, sola döner;
// sayaçla ışık aynı eğriyi izler (ekrandaki yüzde ile görüntüdeki aydınlık pay hep aynı).
// Dev yakın planda yalnızca sol-üst kenarda ince hilal kalır, gece yüzü hafif Dünya ışığıyla seçilir. 6.0'da kırbaç.
// Buradaki ayKur() ve iz() s6-yeni-ay.js tarafından da kullanılır.

const FOTO = '/images/space/fullmoon2010-a02ba6.jpg'; // dolunay fotoğrafı (1920×1825): yakın yüzün albedosu
const HARITA = '/textures/planets/moon.webp'; // eşdikdörtgen harita: kenar ötesi yedek
// Fotoğraftaki Ay diski: merkez (961, 930) px, yarıçap 797 px
const DISK = [961 / 1920, 1 - 930 / 1825, (797 / 1920) * 0.994, (797 / 1825) * 0.994];

const AY_VERT = /* glsl */ `
varying vec3 vP;
varying vec3 vN;
varying vec3 vO;
varying vec3 vEX;
varying vec3 vEY;
void main() {
  vO = normalize(position);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vP = wp.xyz;
  mat3 m = mat3(modelMatrix);
  vN = normalize(m * vO);
  vEX = normalize(m * vec3(1.0, 0.0, 0.0));
  vEY = normalize(m * vec3(0.0, 1.0, 0.0));
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const AY_FRAG = /* glsl */ `
uniform sampler2D uFoto;
uniform sampler2D uHarita;
uniform vec4 uDisk;
uniform vec2 uTexel;
uniform float uHaritaGain;
uniform vec3 uSun;
uniform float uSunI;
uniform vec3 uEarth;
uniform float uEarthI;
uniform vec3 uEarthCol;
uniform float uRimI;
uniform float uRimIso;
uniform vec3 uRimCol;
uniform float uBump;
uniform vec3 uCenter;
uniform float uTanR;
varying vec3 vP;
varying vec3 vN;
varying vec3 vO;
varying vec3 vEX;
varying vec3 vEY;
const float PI = 3.141592653589793;
float lum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
void main() {
  vec3 o = normalize(vO);
  vec2 fuv = uDisk.xy + o.xy * uDisk.zw;
  vec3 aF = texture2D(uFoto, fuv).rgb;
  vec2 huv = vec2(0.5 + atan(o.x, o.z) / (2.0 * PI), 0.5 + asin(clamp(o.y, -1.0, 1.0)) / PI);
  vec3 aH = texture2D(uHarita, huv).rgb * uHaritaGain;
  float w = smoothstep(0.02, 0.16, o.z);
  vec3 albedo = mix(aH, aF, w);
  // fotoğrafın parlaklığından kabartı: terminatörde kraterler belirsin
  float h0 = lum(aF);
  float hx = lum(texture2D(uFoto, fuv + vec2(uTexel.x, 0.0)).rgb) - h0;
  float hy = lum(texture2D(uFoto, fuv + vec2(0.0, uTexel.y)).rgb) - h0;
  // Işık için "uzaktan bakış" normali: kamera ne kadar yakın olursa olsun evre görüntüsü uzak gözlemcininki gibi
  // (yakın kamera yarım küreden azını görür; gerçek normal hilali görünür kenarın arkasına saklardı)
  vec3 C = normalize(uCenter - cameraPosition);
  vec3 D = normalize(vP - cameraPosition);
  float cd = dot(D, C);
  vec3 e = D - C * cd;
  float el = length(e);
  e = el > 1e-6 ? e / el : vec3(0.0);
  float rho = clamp((el / max(cd, 1e-4)) / uTanR, 0.0, 1.0);
  vec3 V = -C;
  vec3 N = normalize(rho * e + sqrt(max(1.0 - rho * rho, 0.0)) * V);
  vec3 Np = normalize(N - uBump * w * (hx * vEX + hy * vEY));
  float nl = dot(N, uSun);
  float mu0 = max(dot(Np, uSun), 0.0);
  float mu = max(dot(N, V), 0.0);
  // Lommel-Seeliger + Lambert: Ay'ın düz görünen diski ve parlak hilal kenarı
  float ls = mu0 / (mu0 + mu + 0.08);
  float shade = mix(mu0, 1.7 * ls, 0.6) * smoothstep(-0.03, 0.05, nl);
  vec3 col = albedo * shade * uSunI * vec3(1.0, 0.975, 0.94);
  // Dünya ışığı (earthshine): gözlemci yönünden gelen soluk mavimsi aydınlık
  float es = max(dot(Np, uEarth), 0.0);
  col += albedo * uEarthCol * uEarthI * (0.3 + 0.7 * es);
  // Kenar ışığı: arkadan aydınlanınca diskin çevresinde ince halka
  vec3 Lp = uSun - V * dot(uSun, V);
  float lpl = length(Lp);
  Lp = lpl > 1e-4 ? Lp / lpl : vec3(0.0);
  float dirf = mix(pow(max(dot(N, Lp), 0.0), 2.0), 1.0, uRimIso);
  col += uRimCol * uRimI * pow(1.0 - mu, 7.0) * dirf;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const HALE_VERT = /* glsl */ `
varying vec2 vQ;
void main() {
  vQ = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const HALE_FRAG = /* glsl */ `
uniform float uRs;
uniform float uI;
uniform float uIso;
uniform float uW;
uniform float uSoft;
uniform float uSoftI;
uniform vec2 uSun2;
uniform vec3 uCol;
varying vec2 vQ;
void main() {
  float l = length(vQ);
  float r = l / uRs;
  vec2 n = vQ / max(l, 1e-5);
  float d = max(dot(n, uSun2), 0.0);
  float dirf = mix(d * d * d, 1.0, uIso);
  float x = max(r - 1.0, 0.0);
  float ring = exp(-(x * x) / (uW * uW));
  float soft = exp(-x * uSoft) * uSoftI;
  float a = (ring + soft) * dirf * uI * smoothstep(0.985, 1.0, r);
  gl_FragColor = vec4(uCol * a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

/** Anahtar kareli iz: [[t, {değerler}, ease], ...] → (t) => {değerler}. Her anahtar aynı alanları taşır. */
export function iz(gsap, keys) {
  const E = keys.map((k) => gsap.parseEase(k[2] || 'power2.inOut'));
  return (t) => {
    if (t <= keys[0][0]) return { ...keys[0][1] };
    for (let i = 1; i < keys.length; i++) {
      const [tb, b] = keys[i];
      const [ta, a] = keys[i - 1];
      if (t <= tb) {
        const u = E[i](Math.min(1, Math.max(0, (t - ta) / (tb - ta))));
        const o = {};
        for (const k in b) o[k] = a[k] + (b[k] - a[k]) * u;
        return o;
      }
    }
    return { ...keys[keys.length - 1][1] };
  };
}

/** Aydınlık pay (%) → evre açısı (radyan): k = (1 + cos α) / 2 */
export const evreAcisi = (yuzde) => Math.acos(Math.min(1, Math.max(-1, (2 * yuzde) / 100 - 1)));

const dokular = new WeakMap();

/**
 * Ay sahnesi: yıldızlar, gölgelendiricili Ay (R = 1, merkez 0), çevresinde hale, hız çizgileri.
 * kur(t, s) her karede: s = { rpx, cx, cy, yaw, pitch, roll, pan, alfa, fi, sunI, earthI, rimI, rimIso, haleI, haleIso, haleW, haleSoft, haleSoftI }
 *  rpx: Ay'ın ekrandaki yarıçapı (CSS px), cx/cy: merkezin ekrandaki yeri (mercek kaydırma; disk yuvarlak kalır)
 *  alfa: evre açısı (0 dolunay, π yeni ay), fi: aydınlık kenarın ekrandaki yönü (π sol, 3π/4 sol üst)
 */
export function ayKur(ctx, { seed = 11 } = {}) {
  const { THREE, W, H } = ctx;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, W / H, 0.01, 3000);
  const rnd = ctx.rand(seed);

  if (!dokular.has(ctx)) {
    const foto = ctx.tex(FOTO);
    const harita = ctx.tex(HARITA);
    dokular.set(ctx, { foto, harita });
  }
  const { foto, harita } = dokular.get(ctx);

  // Yıldızlar (uzak kabuk)
  const yildiz = ctx.stars({ count: 1700, radius: 700, seed: seed + 3, size: 1.25 });
  scene.add(yildiz);

  // Ay
  const U = {
    uFoto: { value: foto }, uHarita: { value: harita },
    uDisk: { value: new THREE.Vector4(...DISK) },
    uTexel: { value: new THREE.Vector2(1.5 / 1920, 1.5 / 1825) },
    uHaritaGain: { value: 0.5 },
    uSun: { value: new THREE.Vector3(0, 0, 1) }, uSunI: { value: 5.5 },
    uEarth: { value: new THREE.Vector3(0, 0, 1) }, uEarthI: { value: 0.1 },
    uEarthCol: { value: new THREE.Color(0.55, 0.68, 1.0) },
    uRimI: { value: 0 }, uRimIso: { value: 0 }, uRimCol: { value: new THREE.Color(1.0, 0.82, 0.5) },
    uBump: { value: 1.6 },
    uCenter: { value: new THREE.Vector3(0, 0, 0) }, uTanR: { value: 0.4 },
  };
  const ayMat = new THREE.ShaderMaterial({ uniforms: U, vertexShader: AY_VERT, fragmentShader: AY_FRAG });
  const ay = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), ayMat);
  scene.add(ay);

  // Hale: Ay'ın merkezinde kameraya bakan düzlem; diskin içi Ay'ın arkasında kalır, dışı parlar
  const HU = {
    uRs: { value: 1.1 }, uI: { value: 0.8 }, uIso: { value: 0 }, uW: { value: 0.02 }, uSoft: { value: 7 }, uSoftI: { value: 0.45 },
    uSun2: { value: new THREE.Vector2(-1, 0) }, uCol: { value: new THREE.Color(1.0, 0.84, 0.6) },
  };
  const hale = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 4.6),
    new THREE.ShaderMaterial({ uniforms: HU, vertexShader: HALE_VERT, fragmentShader: HALE_FRAG, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  hale.renderOrder = 2;
  scene.add(hale);

  // Hız çizgileri: yakın toz (ileri hareket) + parlak yıldızlar (dönüş); kuyruk = önceki karedeki görünür yer
  const cizgi = (pts, cols, gain) => {
    const n = pts.length / 3;
    const pos = new Float32Array(n * 6), col = new Float32Array(n * 6);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const m = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
    const obj = new THREE.LineSegments(g, m);
    obj.frustumCulled = false;
    obj.renderOrder = 3;
    const v = new THREE.Vector3();
    obj.guncelle = (M, cp, pxPerRad) => {
      for (let i = 0; i < n; i++) {
        const x = pts[i * 3], y = pts[i * 3 + 1], z = pts[i * 3 + 2];
        v.set(x, y, z).applyMatrix4(M);
        const dist = Math.hypot(x - cp.x, y - cp.y, z - cp.z);
        const px = (Math.hypot(v.x - x, v.y - y, v.z - z) / Math.max(dist, 1e-3)) * pxPerRad;
        const k = Math.min(1, Math.max(0, (px - 3) / 26)) * gain;
        pos.set([x, y, z, v.x, v.y, v.z], i * 6);
        col.set([cols[i * 3] * k, cols[i * 3 + 1] * k, cols[i * 3 + 2] * k, 0, 0, 0], i * 6);
      }
      g.attributes.position.needsUpdate = true;
      g.attributes.color.needsUpdate = true;
    };
    scene.add(obj);
    return obj;
  };
  const tozN = 320, tozP = new Float32Array(tozN * 3), tozC = new Float32Array(tozN * 3);
  for (let i = 0; i < tozN; i++) {
    const u = rnd() * 2 - 1, a = rnd() * Math.PI * 2, s = Math.sqrt(1 - u * u), r = 1.35 + Math.pow(rnd(), 0.7) * 9;
    tozP.set([Math.cos(a) * s * r, u * r, Math.sin(a) * s * r], i * 3);
    const b = 0.35 + rnd() * 0.5;
    tozC.set([b, b * 0.95, b * 0.88], i * 3);
  }
  const toz = cizgi(tozP, tozC, 0.9);
  const ySrc = yildiz.geometry.attributes.position.array, yCol = yildiz.geometry.attributes.color.array;
  const yN = 700;
  const yizP = new Float32Array(ySrc.buffer.slice(0, yN * 3 * 4)), yizC = new Float32Array(yCol.buffer.slice(0, yN * 3 * 4));
  const yiz = cizgi(yizP, yizC, 0.8);

  // Kamera: Ay'a bakar, mercek kaydırmayla merkez (cx, cy)'ye taşınır
  const onceki = new THREE.PerspectiveCamera(32, W / H, 0.01, 3000);
  const poz = (cam, s) => {
    const tanH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const q = (s.rpx / (H / 2)) * tanH;
    const d = Math.sqrt(1 + q * q) / q;
    cam.position.set(Math.sin(s.yaw) * Math.cos(s.pitch), Math.sin(s.pitch), Math.cos(s.yaw) * Math.cos(s.pitch)).multiplyScalar(d);
    cam.up.set(0, 1, 0);
    cam.lookAt(0, 0, 0);
    cam.rotateZ(s.roll || 0);
    if (s.pan) cam.rotateY(-s.pan);
    cam.updateMatrixWorld(true);
    cam.aspect = W / H;
    cam.updateProjectionMatrix();
    const e = cam.projectionMatrix.elements;
    e[8] = (-2 * (s.cx - W / 2)) / W;
    e[9] = (2 * (s.cy - H / 2)) / H;
    cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
    return d;
  };

  const V0 = new THREE.Vector3(), R = new THREE.Vector3(), Up = new THREE.Vector3(), L = new THREE.Vector3();
  const M = new THREE.Matrix4(), qx = new THREE.Vector3(), qy = new THREE.Vector3();

  /** s: o anki durum, sOnce: τ önceki durum (hız çizgileri için) */
  function kur(s, sOnce) {
    const d = poz(camera, s);
    // Işık: kameraya göre tanımlı → ekrandaki evre hep alfa'ya eşit; fi ekranda aydınlık kenarın yönü
    V0.copy(camera.position).normalize();
    // pan'sız sağ/yukarı: Ay'a bakan eksene göre (rulo dahil)
    R.set(1, 0, 0).applyQuaternion(camera.quaternion);
    Up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    if (s.pan) {
      // pan dönüşünü geri al: ışık Ay'a göre sabit kalsın
      const qp = new THREE.Quaternion().setFromAxisAngle(Up, s.pan);
      R.applyQuaternion(qp);
    }
    R.sub(V0.clone().multiplyScalar(R.dot(V0))).normalize();
    Up.crossVectors(V0, R).normalize();
    L.copy(V0).multiplyScalar(Math.cos(s.alfa))
      .addScaledVector(R, Math.sin(s.alfa) * Math.cos(s.fi))
      .addScaledVector(Up, Math.sin(s.alfa) * Math.sin(s.fi)).normalize();
    U.uSun.value.copy(L);
    U.uEarth.value.copy(V0);
    U.uSunI.value = s.sunI ?? 5.5;
    U.uEarthI.value = s.earthI ?? 0.1;
    U.uRimI.value = s.rimI ?? 0;
    U.uRimIso.value = s.rimIso ?? 0;

    hale.position.set(0, 0, 0);
    hale.lookAt(camera.position);
    hale.updateMatrixWorld(true);
    qx.setFromMatrixColumn(hale.matrixWorld, 0);
    qy.setFromMatrixColumn(hale.matrixWorld, 1);
    const lx = L.dot(qx), ly = L.dot(qy), ll = Math.hypot(lx, ly) || 1;
    HU.uSun2.value.set(lx / ll, ly / ll);
    HU.uRs.value = d / Math.sqrt(d * d - 1);
    U.uTanR.value = 1 / Math.sqrt(d * d - 1); // görünür açısal yarıçapın tanjantı
    HU.uI.value = s.haleI ?? 0.8;
    HU.uIso.value = s.haleIso ?? 0;
    HU.uW.value = s.haleW ?? 0.02;
    HU.uSoft.value = s.haleSoft ?? 7;
    HU.uSoftI.value = s.haleSoftI ?? 0.45;

    // Hız çizgileri
    poz(onceki, sOnce);
    M.copy(camera.matrixWorld).multiply(onceki.matrixWorldInverse);
    const pxPerRad = (H / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    toz.guncelle(M, camera.position, pxPerRad);
    yiz.guncelle(M, camera.position, pxPerRad);
  }

  return { scene, camera, ay, hale, kur, U, HU };
}

/** Saatin yönelme eki, okunuşa göre: 04:33 → ’e (otuz üçe), 05:42 → ’ye (kırk ikiye), 06:00 → ’ya (altıya) */
export function yonelme(saat) {
  const [h, m] = String(saat).split(':').map(Number);
  const BIR = ['', 'e', 'ye', 'e', 'e', 'e', 'ya', 'ye', 'e', 'a'];
  const ON = ['', 'a', 'ye', 'a', 'a', 'ye'];
  const ek = (n) => (n % 10 ? BIR[n % 10] : ON[Math.floor(n / 10) % 6]);
  return '’' + (m ? ek(m) : ek(h % 12 || 12));
}

/** split() satırlarının maskesi (overflow: hidden) yazı gölgesini keser; giriş bitince maskeyi kaldır */
export function maskeAc(ctx, node, t) {
  ctx.tl.set(node.querySelectorAll('.line'), { overflow: 'visible' }, t);
}

export default function sahne(ctx, { t0, t1 }) {
  const { tl, gsap, el, split, kinetic } = ctx;
  const ay = ctx.veri?.ay ?? { aydinlik: 4, dogus: '05:42' };
  const BUYUK = (x) => String(x).toLocaleUpperCase('tr-TR');
  const A = ayKur(ctx, { seed: 21 });

  // Sayaç zamanı: %100 → %4, 2.62'de başlar, 3.5 vuruşunda biter. Işık aynı eğriyi izler.
  const SAY0 = t0 + 0.12, SAYD = 0.88, EASE = gsap.parseEase('power3.out');
  const HEDEF = ay.aydinlik;
  const yuzde = (t) => (t <= SAY0 ? 100 : t >= SAY0 + SAYD ? HEDEF : 100 - (100 - HEDEF) * EASE((t - SAY0) / SAYD));

  // Son kadraj: Ay sağ altta dev; hilal sol üst kenarında, ekranı soldan sağa kesen bir yay. Yazılar yayın üstünde.
  const kam = iz(gsap, [
    [t0, { rpx: 78, cx: 270, cy: 560, yaw: -0.34, pitch: 0.13, roll: 0.16, pan: 0 }],
    [t0 + 0.45, { rpx: 205, cx: 270, cy: 566, yaw: -0.15, pitch: 0.07, roll: 0.05, pan: 0 }, 'expo.out'],
    [t0 + 0.62, { rpx: 224, cx: 274, cy: 576, yaw: -0.12, pitch: 0.06, roll: 0.035, pan: 0 }, 'none'],
    [t0 + 1.48, { rpx: 700, cx: 580, cy: 1180, yaw: 0.05, pitch: -0.02, roll: -0.05, pan: 0 }, 'power3.inOut'],
    [t1 - 0.32, { rpx: 745, cx: 566, cy: 1196, yaw: 0.3, pitch: -0.06, roll: -0.13, pan: 0 }, 'none'],
    [t1, { rpx: 775, cx: 560, cy: 1200, yaw: 0.34, pitch: -0.06, roll: -0.17, pan: 0.6 }, 'power3.in'],
  ]);
  // Nabız: sayaç bitişinde (3.5) ve künye değişiminde (5.0) hilal parlar
  const nabiz = (t, at, amp, w = 0.35) => (t < at ? 0 : amp * Math.exp(-(t - at) / w) * Math.min(1, (t - at) / 0.04));

  const durum = (t) => {
    const s = kam(t);
    s.rpx += nabiz(t, t0 + 2.0, 16, 0.22); // 4.5 vuruşunda hafif kamera darbesi
    s.alfa = evreAcisi(yuzde(t));
    s.fi = Math.PI * 0.75 + 0.05 * Math.sin((t - t0) * 1.3);
    // Hale: dolunayda çevrede yumuşak ışık, hilalde yalnızca aydınlık kenarda hafif parıltı
    const iso = Math.pow(Math.max(0, 1 - s.alfa / 1.1), 2);
    s.haleIso = iso;
    s.haleI = 0.3 + 0.3 * iso + nabiz(t, t0 + 1.0, 0.6) + nabiz(t, t0 + 2.5, 0.35);
    s.haleW = 0.012;
    s.haleSoft = 16;
    s.haleSoftI = 0.2 + 0.25 * iso;
    s.sunI = 5.5 + 1.8 * (1 - iso) + nabiz(t, t0 + 1.0, 3.2, 0.3) + nabiz(t, t0 + 2.5, 1.6, 0.3);
    s.earthI = 0.11;
    s.rimI = 0;
    s.rimIso = 0;
    return s;
  };

  ctx.shot({
    t0, t1, scene: A.scene, camera: A.camera,
    update: (t) => {
      A.ay.rotation.y = -0.05 + (t - t0) * 0.035; // Ay kendi ekseninde ağır ağır döner
      A.kur(durum(t), durum(t - 0.05));
    },
  });

  /* ---------- Yazılar (güvenli alan: y 110–760, kenarlardan ≥ 28 px) ---------- */
  const sayac = el('%100', { cls: 'display shadow', style: { left: 28, width: 484, top: 116, fontSize: 150, textAlign: 'center', fontVariantNumeric: 'tabular-nums', transformOrigin: '50% 60%' } });
  tl.fromTo(sayac, { autoAlpha: 0, scale: 1.7, filter: 'blur(14px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.32, ease: 'expo.out', immediateRender: false }, t0);
  ctx.counter(sayac, 100, HEDEF, SAY0, SAYD, (n) => `%${Math.round(n)}`);
  // Vuruşta darbe
  tl.fromTo(sayac, { scale: 1.16 }, { scale: 1, duration: 0.4, ease: 'expo.out', immediateRender: false }, SAY0 + SAYD);

  const serif = el(split('Ay neredeyse yok.'), { cls: 'serif gold shadow', style: { left: 28, width: 484, top: 268, fontSize: 68, textAlign: 'center' } });
  kinetic(serif, t0 + 1.0, { how: 'rise', stagger: 0.022, dur: 0.6 });
  maskeAc(ctx, serif, t0 + 1.75);

  const cizik = el('', { style: { left: 250, top: 362, width: 40, height: 2, background: '#f5c542', transformOrigin: '50% 50%' } });
  tl.set(cizik, { autoAlpha: 1 }, t0 + 1.5);
  tl.fromTo(cizik, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'expo.out', immediateRender: false }, t0 + 1.5);

  const kunye1 = el(split(BUYUK(`${ay.dogus}${yonelme(ay.dogus)} kadar doğmuyor`)), { cls: 'mono shadow', style: { left: 20, width: 500, top: 380, fontSize: 22, textAlign: 'center', letterSpacing: '0.2em' } });
  maskeAc(ctx, kunye1, t0);
  kinetic(kunye1, t0 + 1.5, { how: 'type', stagger: 0.022 });
  tl.to(kunye1, { autoAlpha: 0, y: -10, filter: 'blur(6px)', duration: 0.16, ease: 'power2.in' }, t0 + 2.36);

  const kunye2 = el(split('GECE BOYUNCA GÖKTE DEĞİL'), { cls: 'mono shadow', style: { left: 20, width: 500, top: 380, fontSize: 22, textAlign: 'center', letterSpacing: '0.2em' } });
  maskeAc(ctx, kunye2, t0);
  kinetic(kunye2, t0 + 2.5, { how: 'blur', stagger: 0.018, dur: 0.35 });

  // Kırbaçla birlikte yazılar sola kayarak çıkar
  tl.to([sayac, serif, cizik, kunye2], { x: -90, autoAlpha: 0, filter: 'blur(8px)', duration: 0.24, ease: 'power3.in', stagger: 0.02 }, t1 - 0.36);

  /* ---------- Geçiş ve ses ---------- */
  ctx.whip(t1, { dir: -1 });
  ctx.sound(t0, 'sub', 0.35);
  ctx.sound(t0 + 0.02, 'whoosh', 0.3, { d: 0.45, lo: 400, hi: 3000 });
  ctx.sound(SAY0, 'scan', 0.28, { d: 0.86 });
  ctx.sound(SAY0 + SAYD, 'hit', 0.55);
  ctx.sound(t0 + 1.5, 'tick', 0.4);
  ctx.sound(t1 - 0.25, 'whoosh', 0.5, { d: 0.5, lo: 500, hi: 3600 });
}
