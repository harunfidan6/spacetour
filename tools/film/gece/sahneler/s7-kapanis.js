// s7 · Kapanış (20.0–24.0): ışık hızından iniş → güncel logo canlı kurulur → Spacetour.tr · Evren hiç durmaz. · spacetour.com.tr
//  20.0 kesim: hit+sub, yıldız çizgileri yavaşlar, logo büyük kurulur (gezegen, halkalar çizilir, ay yörüngede)
//  20.7 logo yerine oturur · 21.0 Spacetour.tr · 21.5 EVREN · 22.0 hiç durmaz. · 22.5 adres · 23.0 çağrı · 23.5 nefes
import { warpField, travelTable, kick, smooth, spl } from './s1-acilis.js';

const NS = 'http://www.w3.org/2000/svg';

export default function sahne(ctx, { t0, t1 }) {
  const { THREE, tl, W, H, gsap } = ctx;
  const T = (x) => t0 + x;

  /* ---------- Yerleşim (CSS px) ---------- */
  const LOGO = 280, LOGO_TOP = 106, LOGO_CY = LOGO_TOP + LOGO / 2; // logo merkezi y≈246
  const HERO_DY = 150, HERO_S = 1.42;                               // açılışta büyük ve ortada
  const MOVE_AT = T(0.68), MOVE_DUR = 0.47;
  const moveEase = gsap.parseEase('expo.inOut');
  const heroK = (t) => 1 - moveEase(Math.min(Math.max((t - MOVE_AT) / MOVE_DUR, 0), 1)); // 1 = büyük, 0 = yerinde

  /* ---------- 3B: iniş yapan yıldız alanı + bulutsu ---------- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 1200);
  const field = warpField(ctx, { count: 1500, seed: 2024, rMax: 70, gold: 0.1, sky: 0.16 });
  scene.add(field.mesh);

  const neb = new THREE.Group();
  scene.add(neb);
  const blob = (stops, x, y, z, s, op) => {
    const m = new THREE.SpriteMaterial({ map: ctx.glow(stops), transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
    const sp = new THREE.Sprite(m);
    sp.position.set(x, y, z); sp.scale.set(s, s, 1); sp.userData = { s, op };
    neb.add(sp);
    return sp;
  };
  const blobs = [
    blob([[0, 'rgba(99,102,241,0.5)'], [0.4, 'rgba(76,29,149,0.18)'], [1, 'rgba(5,5,8,0)']], 0, 2, -160, 165, 0.55),
    blob([[0, 'rgba(56,189,248,0.4)'], [1, 'rgba(56,189,248,0)']], 30, 26, -150, 90, 0.4),
    blob([[0, 'rgba(124,58,237,0.4)'], [1, 'rgba(124,58,237,0)']], -36, -30, -170, 110, 0.3),
    blob([[0, 'rgba(255,190,90,0.5)'], [0.4, 'rgba(245,158,11,0.16)'], [1, 'rgba(245,158,11,0)']], 0, 0, -140, 55, 0.4),
  ];

  // İniş: kesimde ışık hızında, 0.6 sn'de süzülmeye iner
  const speed = (t) => 6 + 1700 * Math.exp(-Math.max(0, t - t0) / 0.13) * smooth(t0 - 0.01, t0 + 0.02, t);
  const travel = travelTable(speed, t0, t1 + 0.1);
  const tanHalf = (fov) => Math.tan((fov * Math.PI) / 360);

  ctx.shot({
    t0, t1, scene, camera,
    update(t, local) {
      const v = speed(t);
      field.u.uTravel.value = travel(t) + 40;
      field.u.uStretch.value = 0.02 + v * 0.05;
      field.u.uBlue.value = 0.4 * Math.exp(-local / 0.2);
      field.u.uWidth.value = 4.0;
      field.mesh.rotation.z = -0.2 * Math.exp(-local / 0.25) + 0.045 * local;
      // Son yarım saniye: hafif yakınlaşma (nefes)
      const br = smooth(3.5, 4.0, local);
      camera.fov = 58 + 10 * Math.exp(-local / 0.18) - 2.5 * br;
      camera.updateProjectionMatrix();
      // Kaçış noktası logonun merkezini izler
      const cy = LOGO_CY + HERO_DY * heroK(t);
      const ndcY = 1 - (2 * cy) / H;
      camera.rotation.set(-Math.atan(ndcY * tanHalf(camera.fov)), 0.012 * Math.sin(local * 0.9), 0);
      // Bulutsu açılır, yavaşça döner ve nefes alır
      const bloom = gsap.parseEase('expo.out')(Math.min(local / 0.9, 1));
      neb.rotation.z = 0.06 * local;
      blobs.forEach((b, i) => {
        const s = b.userData.s * (0.45 + 0.55 * bloom) * (1 + 0.05 * Math.sin(local * 1.6 + i) + 0.06 * br) * (1 + 0.25 * heroK(t));
        b.scale.set(s, s, 1);
        b.material.opacity = b.userData.op * bloom * (1 + 0.6 * kick(local - 0.02, 0.03, 0.25));
      });
    },
  });

  /* ---------- Kapak kartı (DOM) ---------- */
  const card = ctx.el('', { style: { left: 0, top: 0, width: W, height: H, transformOrigin: `50% ${LOGO_CY + 120}px` } });
  tl.set(card, { autoAlpha: 1 }, t0);

  // Logo: sitenin güncel logosu (logo.svg) — parçaları ayrı ayrı canlandırılır
  const logoBox = ctx.el(ctx.logo, { parent: card, style: { left: (W - LOGO) / 2, top: LOGO_TOP, width: LOGO, height: LOGO } });
  const svg = logoBox.querySelector('svg');
  svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%');
  svg.style.overflow = 'visible'; svg.style.display = 'block';
  const q = (s) => svg.querySelector(s), qa = (s) => [...svg.querySelectorAll(s)];
  const mk = (tag, attrs = {}) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };
  const wrapNodes = (nodes, attrs = {}) => { const g = mk('g', attrs); nodes[0].before(g); nodes.forEach((n) => g.append(n)); return g; };

  const nebA = q('circle[fill="url(#gneb)"]'), nebB = q('circle[fill="url(#gneb2)"]');
  const dots = wrapNodes(qa('circle[fill="#f4f3ee"]'));
  const halo = q('circle[filter="url(#gblur)"]');
  const orbit = q('ellipse[stroke-dasharray]');
  const ringBack = q('g[clip-path="url(#gback)"]'), ringFront = q('g[clip-path="url(#gfront)"]');
  const planet = wrapNodes([q('circle[fill="url(#gpl)"]'), q('g[clip-path="url(#gdisc)"]'), q('circle[stroke="url(#grim)"]')]);
  const bands = q('g[clip-path="url(#gdisc)"] > g');
  qa('circle[cx="323.5"]').forEach((n) => n.remove()); // durağan ay → yörüngede dönen ay
  const sparks = qa('path');

  // Halkalar: iç sarmalayıcı (ölçek) + her elips çizilerek gelir; halkada gezen parıltı
  const glintF = mk('filter', { id: 's7glint', x: '-1', y: '-1', width: '3', height: '3' });
  glintF.append(mk('feGaussianBlur', { stdDeviation: '1.4' }));
  svg.querySelector('defs').append(glintF);
  const ringInner = [ringBack, ringFront].map((g) => wrapNodes([...g.children]));
  const ringEls = ringInner.flatMap((g) => [...g.querySelectorAll('ellipse')]);
  ringEls.forEach((e) => { e.setAttribute('pathLength', '1'); e.style.strokeDasharray = '1 1'; });
  const glints = ringInner.map((g) => {
    const e = mk('ellipse', { cx: 200, cy: 200, rx: 146, ry: 32, fill: 'none', stroke: '#ffffff', 'stroke-width': 5, 'stroke-linecap': 'round', pathLength: 100, 'stroke-dasharray': '3 97', opacity: 0, filter: 'url(#s7glint)' });
    g.append(e);
    return e;
  });

  // Fırtına lekesi: gezegen kendi ekseninde döner (sitedeki hareketli logodaki gibi)
  const spot = mk('g');
  spot.append(mk('ellipse', { cx: 200, cy: 222, rx: 17, ry: 8, fill: '#7c2d12' }), mk('ellipse', { cx: 200, cy: 221, rx: 10, ry: 4.5, fill: '#fdba74', opacity: 0.8 }));
  bands.append(spot);

  // Ay: eğik yörünge (−38°); arka yarıda gezegenin arkasından geçer
  const moonGroup = (clip) => {
    const outer = mk('g', { transform: 'rotate(-38 200 200)' });
    const c = mk('g', { 'clip-path': `url(#${clip})` });
    const m = mk('g');
    m.append(mk('circle', { r: 15, fill: '#38bdf8', opacity: 0.55, filter: 'url(#gsoft)' }), mk('circle', { r: 8.5, fill: '#e0f2fe' }));
    c.append(m); outer.append(c);
    return { outer, m };
  };
  const moonB = moonGroup('gback'), moonF = moonGroup('gfront');
  ringBack.before(moonB.outer);
  ringFront.after(moonF.outer);
  const moonAngle = (u) => -0.42 - 4.6 * Math.pow(Math.max(0, 1 - u / 4), 2.2) + 0.07 * (u - 4); // sonda logodaki yerine (−0.42) varır
  const placeMoon = (u) => {
    const a = moonAngle(u), x = 200 + 196 * Math.cos(a), y = 200 + 70 * Math.sin(a);
    for (const g of [moonB.m, moonF.m]) g.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
  };
  placeMoon(0);
  const clock = { u: 0 };
  tl.fromTo(clock, { u: 0 }, {
    u: 4, duration: 4, ease: 'none', immediateRender: false,
    onUpdate() {
      const u = clock.u;
      placeMoon(u);
      // fırtına lekesi soldan sağa kayar, kenarlarda kaybolur
      const sx = -95 + 47.5 * u;
      spot.setAttribute('transform', `translate(${sx.toFixed(2)} 0)`);
      spot.setAttribute('opacity', (Math.max(0, 1 - Math.abs(sx) / 85) * 0.9).toFixed(3));
      // yörünge çizgisi ilerler
      orbit.style.strokeDashoffset = String(-u * 9);
    },
  }, t0);

  // — Logo kurulumu —
  tl.set(logoBox, { autoAlpha: 1 }, t0);
  tl.fromTo(logoBox, { scale: HERO_S, y: HERO_DY }, { scale: HERO_S * 1.035, y: HERO_DY, duration: 0.68, ease: 'none', immediateRender: false }, t0);
  tl.to(logoBox, { scale: 1, y: 0, duration: MOVE_DUR, ease: 'expo.inOut' }, MOVE_AT);
  // dönüş/ölçek merkezleri (SVG kullanıcı koordinatı)
  gsap.set([nebA, halo, planet, ...ringInner], { svgOrigin: '200 200' });
  gsap.set(nebB, { svgOrigin: '300 96' });
  // Not: kurulum tweenleri hemen başlangıç durumuna geçer (immediateRender); logo t0'a kadar zaten gizli
  tl.fromTo([nebA, nebB], { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'expo.out' }, t0);
  tl.fromTo(dots, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'power2.out' }, T(0.15));
  tl.fromTo(halo, { scale: 0.2, opacity: 0 }, { scale: 1.15, opacity: 0.85, duration: 0.45, ease: 'expo.out' }, T(0.02))
    .to(halo, { scale: 1, opacity: 0.5, duration: 0.6, ease: 'power2.inOut' }, T(0.47));
  tl.fromTo(planet, { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.62, ease: 'back.out(1.5)' }, T(0.03));
  // halkalar düz bir çizgiden açılır
  tl.fromTo(ringInner, { scaleX: 0.8, scaleY: 0 }, { scaleX: 1, scaleY: 1, duration: 0.6, ease: 'expo.out' }, T(0.08));
  // her halka elipsi iki yarıda eşzamanlı çizilir (içten dışa)
  const ringOrder = ringInner.map((g) => [...g.querySelectorAll('ellipse')].filter((e) => !glints.includes(e)));
  ringOrder[0].forEach((e, i) => {
    tl.fromTo([e, ringOrder[1][i]], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.42, ease: 'power2.out' }, T(0.05 + i * 0.035));
  });
  tl.fromTo(orbit, { opacity: 0 }, { opacity: 0.45, duration: 0.6, ease: 'power2.out' }, T(0.25));
  tl.fromTo([moonB.m.parentNode, moonF.m.parentNode], { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' }, T(0.18));
  sparks.forEach((p, i) => {
    const c = [[84, 92], [98, 318], [336, 312]][i] || [200, 200];
    gsap.set(p, { svgOrigin: `${c[0]} ${c[1]}` });
    tl.fromTo(p, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.55, ease: 'back.out(2.2)' }, T(0.32 + i * 0.09));
    tl.to(p, { scale: 1.45, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 }, T(2.0 + i * 0.12));
    tl.to(p, { rotation: 90, duration: 0.45, ease: 'expo.out' }, T(3.5 + i * 0.06)); // 4 köşeli yıldız: 90° sonra logodaki hâli
  });
  // halkada parıltı (shimmer anı ve kapanışta)
  for (const [at, dur] of [[0.35, 0.75], [2.9, 0.8]]) {
    tl.fromTo(glints, { strokeDashoffset: 102 }, { strokeDashoffset: 0, duration: dur, ease: 'power2.inOut', immediateRender: false }, T(at));
    tl.fromTo(glints, { opacity: 0 }, { opacity: 0.95, duration: dur * 0.3, ease: 'power1.out', yoyo: true, repeat: 1, repeatDelay: dur * 0.4, immediateRender: false }, T(at));
  }
  // logo yerine oturduktan sonra hafif süzülme
  tl.fromTo(svg, { y: 0 }, { y: -4, duration: 1.25, ease: 'sine.inOut', yoyo: true, repeat: 1, immediateRender: false }, T(1.5));

  /* ---------- Yazılar ---------- */
  const CX = { left: 0, width: W, textAlign: 'center' };
  // Gölge: text-shadow yerine düğüm filtresi (maskeli satırlarda dikdörtgen gölge kırpıntısı olmasın)
  const SH = 'drop-shadow(0 2px 12px rgb(0 0 0 / 0.55))';
  const unclip = (n) => n.querySelectorAll('.line').forEach((l) => { l.style.overflow = 'visible'; });

  // Spacetour.tr — sitenin üst menüsündeki yazı biçimi (küçük harf, .tr altın)
  const word = ctx.el(spl([['Spacetour'], ['.tr', 'gold']]), {
    parent: card, cls: 'display',
    style: { ...CX, top: 386, fontSize: 58, textTransform: 'none', fontStretch: '108%', letterSpacing: '-0.02em', filter: SH },
  });
  ctx.kinetic(word, T(1.0), { how: 'rise', stagger: 0.028, dur: 0.7 });

  // Evren / hiç durmaz.
  const evren = ctx.el(ctx.split('evren'), { parent: card, cls: 'display', style: { ...CX, top: 470, fontSize: 86, filter: SH } });
  unclip(evren);
  ctx.kinetic(evren, T(1.5), { how: 'slam', stagger: 0.04, dur: 0.55 });
  const durmaz = ctx.el(ctx.split('hiç durmaz.'), { parent: card, cls: 'serif gold', style: { ...CX, top: 550, fontSize: 86, filter: `drop-shadow(0 0 16px rgb(245 197 66 / 0.3)) ${SH}` } });
  unclip(durmaz);
  ctx.kinetic(durmaz, T(2.0), { how: 'blur', stagger: 0.03, dur: 0.6 });
  // vurgu: hafif ölçek darbesi
  tl.fromTo(evren, { scale: 1.08 }, { scale: 1, duration: 0.8, ease: 'expo.out', immediateRender: false }, T(1.5));

  // — spacetour.com.tr — (iki yanında altın çizgi)
  const url = ctx.el(`<span class="u-ln"></span>${spl([['spacetour.com.tr']])}<span class="u-ln"></span>`, {
    parent: card, cls: 'mono', style: { ...CX, top: 666, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#f4f3ee' },
  });
  Object.assign(url.querySelector('.line').style, { paddingLeft: '0.28em', overflow: 'visible' });
  const ul = [...url.querySelectorAll('.u-ln')];
  ul.forEach((n, i) => Object.assign(n.style, { display: 'block', width: '46px', height: '1.5px', background: '#f5c542', transformOrigin: i ? '0% 50%' : '100% 50%', boxShadow: '0 0 10px rgb(245 197 66 / 0.6)' }));
  ctx.kinetic(url, T(2.5), { how: 'type', stagger: 0.024 });
  tl.fromTo(ul, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.out', immediateRender: false }, T(2.5));

  // Çağrı
  const cta = ctx.el('Her gece gökyüzü, tek sayfada.', { parent: card, cls: 'sans', style: { ...CX, top: 708, fontSize: 22, color: 'rgb(244 243 238 / 0.72)', letterSpacing: '0.01em' } });
  tl.fromTo(cta, { autoAlpha: 0, y: 10, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out', immediateRender: false }, T(3.0));

  // 23.5–24.0: nefes — bütün kart çok hafif yakınlaşır
  tl.fromTo(card, { scale: 1 }, { scale: 1.022, duration: 0.5, ease: 'sine.inOut', immediateRender: false }, T(3.5));

  // Kesim: flaş yok — geçişi ışık hızından iniş (yıldız çizgileri) ve hit taşır

  /* ---------- Ses ---------- */
  ctx.sound(t0, 'hit', 0.9);
  ctx.sound(t0, 'sub', 0.8);
  ctx.sound(T(0.35), 'shimmer', 0.7);
  ctx.sound(T(1.5), 'swipe', 0.45);
  ctx.sound(T(2.0), 'chime', 0.7);
  ctx.sound(T(2.5), 'tick', 0.5);
}
