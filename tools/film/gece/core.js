// Çekim sayfasının ortak araçları. Sahneler (sahneler/*.js) yalnızca bu bağlamı kullanır:
//   export default function sahne(ctx, { t0, t1 }) { ... }  → [t0, t1) aralığına çekim, yazı, geçiş ve ses ekler.
// Zaman tek bir duraklatılmış GSAP timeline'ıdır (ctx.tl); kayıt betiği sanal saatle kare kare ilerletir.
import * as THREE from '/film/_three/three.module.js';

export const W = 540, H = 960; // CSS px; kayıt 2x → 1080×1920

export function createContext() {
  const gsap = window.gsap;
  const tl = gsap.timeline({ paused: true });
  const canvas = document.getElementById('gl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(2);
  renderer.setSize(W, H, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x050508, 1);

  const ui = document.getElementById('ui');
  const fx = document.getElementById('fx');
  const shots = [];
  const textures = [];
  const sfx = [];
  const cuts = [];

  /** Tohumlu sözde rastgele (her çekimde aynı) */
  const rand = (seed = 1) => {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const loader = new THREE.TextureLoader();
  /** Doku: hazır olana kadar çekim başlamaz. Sitenin dokuları /textures/planets/*.webp */
  function tex(url, { srgb = true } = {}) {
    const t = loader.load(url);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    textures.push(t);
    return t;
  }

  /**
   * 3D çekim kaydı: [t0, t1) aralığında bu sahne ve kamera çizilir. update(zaman, yerelZaman, süre) her karede.
   * Aralıklar çakışırsa en son kaydedilen çizilir.
   */
  function shot({ t0, t1, scene, camera, update }) {
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    shots.push({ t0, t1, scene, camera, update });
  }

  /** Arka plan yıldız alanı (küre kabuğu); size piksel cinsinden */
  function stars({ count = 2500, radius = 400, seed = 7, size = 1.6, color = 0xf4f3ee } = {}) {
    const r = rand(seed), pos = new Float32Array(count * 3), col = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const u = r() * 2 - 1, a = r() * Math.PI * 2, s = Math.sqrt(1 - u * u), rr = radius * (0.7 + r() * 0.3);
      pos.set([Math.cos(a) * s * rr, u * rr, Math.sin(a) * s * rr], i * 3);
      c.set(color).multiplyScalar(0.35 + r() * 0.65);
      if (r() < 0.12) c.lerp(new THREE.Color(0xffd6a0), 0.6);
      else if (r() < 0.1) c.lerp(new THREE.Color(0xa5c8ff), 0.6);
      col.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const m = new THREE.PointsMaterial({ size: size * 2, sizeAttenuation: false, vertexColors: true, transparent: true, depthWrite: false });
    return new THREE.Points(g, m);
  }

  /** Dokulu gezegen küresi */
  function planet({ map, radius = 1, segments = 96, emissive = false, color = 0xffffff, roughness = 1 }) {
    const geo = new THREE.SphereGeometry(radius, segments, segments);
    const mat = emissive
      ? new THREE.MeshBasicMaterial({ map: map ? tex(map) : null, color, toneMapped: false })
      : new THREE.MeshStandardMaterial({ map: map ? tex(map) : null, color, roughness, metalness: 0 });
    return new THREE.Mesh(geo, mat);
  }

  /** Yumuşak ışık lekesi dokusu (parıltı, toz, meteor başı) */
  const glowCache = new Map();
  function glow(stops = [[0, 'rgba(255,255,255,1)'], [0.25, 'rgba(255,230,190,0.8)'], [0.6, 'rgba(255,150,70,0.2)'], [1, 'rgba(255,120,40,0)']]) {
    const key = JSON.stringify(stops);
    if (glowCache.has(key)) return glowCache.get(key);
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d'), g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    for (const [o, col] of stops) g.addColorStop(o, col);
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    glowCache.set(key, t);
    return t;
  }

  /* ---------- Yazı ---------- */
  /** Yeni öğe (#ui içinde, mutlak konumlu). style: { left, top, ... } css px; başta gizli */
  function el(html, { cls = '', style = {}, parent = ui } = {}) {
    const n = document.createElement('div');
    n.className = cls;
    n.innerHTML = html;
    Object.assign(n.style, { position: 'absolute', ...Object.fromEntries(Object.entries(style).map(([k, v]) => [k, typeof v === 'number' ? `${v}px` : v])) });
    parent.append(n);
    gsap.set(n, { autoAlpha: 0 });
    return n;
  }
  /** Metni harflere böler: <span class="line"><span class="ch">..</span></span> */
  const split = (text) => text.split('\n').map((ln) => `<span class="line">${[...ln].map((c) => `<span class="ch">${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</span>`).join('');
  /**
   * Kinetik giriş. how: 'rise' (alttan maske), 'slam' (büyükten çarpma), 'blur' (bulanıktan netleşme), 'type' (daktilo)
   */
  function kinetic(node, t, { how = 'rise', stagger = 0.03, dur = 0.7, ease } = {}) {
    const chars = node.querySelectorAll('.ch');
    tl.set(node, { autoAlpha: 1 }, t);
    if (!chars.length) return tl.fromTo(node, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: dur, ease: ease || 'power3.out' }, t);
    if (how === 'rise') tl.fromTo(chars, { yPercent: 115 }, { yPercent: 0, duration: dur, stagger, ease: ease || 'expo.out' }, t);
    else if (how === 'slam') tl.fromTo(chars, { scale: 2.4, autoAlpha: 0, filter: 'blur(10px)' }, { scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: dur * 0.6, stagger, ease: ease || 'expo.out' }, t);
    else if (how === 'blur') tl.fromTo(chars, { autoAlpha: 0, filter: 'blur(14px)', y: 10 }, { autoAlpha: 1, filter: 'blur(0px)', y: 0, duration: dur, stagger, ease: ease || 'power3.out' }, t);
    else if (how === 'type') tl.fromTo(chars, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, stagger: stagger || 0.035 }, t);
    return tl;
  }
  /** Çıkış */
  function out(node, t, { dur = 0.25, y = -14 } = {}) {
    return tl.to(node, { autoAlpha: 0, y, duration: dur, ease: 'power2.in' }, t);
  }
  /** Sayaç: from → to, fmt(n) metni üretir */
  function counter(node, from, to, t, dur, fmt = (n) => String(Math.round(n))) {
    const o = { v: from };
    node.textContent = fmt(from);
    return tl.fromTo(o, { v: from }, { v: to, duration: dur, ease: 'power3.out', immediateRender: false, onUpdate: () => { node.textContent = fmt(o.v); } }, t);
  }

  /* ---------- Geçişler ---------- */
  function flash(t, { color = '#fff6e0', peak = 0.85, dur = 0.35 } = {}) {
    const n = document.createElement('div'); n.className = 'flash'; n.style.background = color; fx.append(n);
    tl.fromTo(n, { opacity: 0 }, { opacity: peak, duration: 0.06, ease: 'none', immediateRender: false }, t - 0.03).to(n, { opacity: 0, duration: dur, ease: 'power2.out' }, t + 0.03);
  }
  function whip(t, { dir = 1 } = {}) {
    const n = document.createElement('div'); n.className = 'whip'; fx.append(n);
    tl.fromTo(n, { xPercent: -80 * dir, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.14, ease: 'power2.in', immediateRender: false }, t - 0.14)
      .to(n, { xPercent: 80 * dir, opacity: 0, duration: 0.2, ease: 'power2.out' }, t);
  }
  function dip(t, { dur = 0.18 } = {}) {
    const n = document.createElement('div'); n.className = 'flash'; n.style.background = '#050508'; n.style.mixBlendMode = 'normal'; fx.append(n);
    tl.fromTo(n, { opacity: 0 }, { opacity: 1, duration: dur, ease: 'power1.in', immediateRender: false }, t - dur).to(n, { opacity: 0, duration: 0.25, ease: 'power1.out' }, t + 0.02);
  }

  /* ---------- Ses ---------- */
  /** Efekt: type ∈ hit, sub, whoosh{d,lo,hi}, tick, click, shimmer, chime, swipe, blip{p}, warp{d}, tock{p}, scan{d} */
  const sound = (t, type, g = 0.5, extra = {}) => sfx.push({ t, type, g, ...extra });
  const cut = (t) => cuts.push(t);

  /* ---------- Çizim döngüsü ---------- */
  let started = false;
  function frame() {
    requestAnimationFrame(frame);
    const t = started ? tl.time() : 0;
    let s = null;
    for (const x of shots) if (t >= x.t0 && t < x.t1) s = x;
    if (!s) { renderer.clear(); return; }
    s.update?.(t, t - s.t0, s.t1 - s.t0);
    renderer.render(s.scene, s.camera);
  }
  requestAnimationFrame(frame);

  const texturesReady = () => textures.every((t) => t.image && (t.image.complete === undefined || t.image.complete));
  const start = () => { started = true; tl.play(0); };

  return { THREE, gsap, tl, W, H, renderer, ui, fx, rand, tex, shot, stars, planet, glow, el, split, kinetic, out, counter, flash, whip, dip, sound, cut, sfx, cuts, texturesReady, start, shots };
}
