// Neşe Gazozcusu · Retro TV reklamı (30 sn, seslendirme + jingle + efekt).
// Kayıt: npm run film:retro → tools/film/record.mjs bu sayfayı kare kare çeker, ses miks.mjs'te kurulur
// (müzik: 80'ler–90'lar jingle'ı + vokoder koro, muzik.mjs / koro.mjs).
//  0.3   Tüplü televizyon açılır: renk çubukları + test sinyali
//  1.5   Kanal değişir: güneş ışınlı başlık kartı "NEŞE GAZOZCUSU sunar"
//  4.0   Grenli makro: buğulu bilyeli şişe
//  6.8   Geniş plan: açacak iner, bilye düşer → 8.0 "Fışşş!", orkestra vuruşu, koro "Ne-şe Ga-zoz-cu-su!"
//  9.5   Şişeye dalış → site (eşlik eden 3D şişeyle)
// 12.0   Raf ve renkler · 18.0 kasaya sürükle · 21.5 sepet ve ödeme
// 24.0   Kanal değişir: retro tabela logosu + koro, 26.4 "Kapağı aç, hikâyesini iç!", 29.0 son vuruş
// (anonsçu metin.json'da "seslendirme": false ile kapalı; yazılar ekranda kalır)
// 29.33  Televizyon kapanır
(async () => {
  const G = window.gsap, FX = window.FX;
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const H = new URLSearchParams(location.search).get('fmt') === 'h';
  document.body.classList.add(H ? 'fmt-h' : 'fmt-v');
  const waitFor = (fn) => new Promise((res) => { const k = () => (fn() ? res() : setTimeout(k, 30)); k(); });

  const LINES = (await fetch('metin.json').then((r) => r.json())).satirlar;
  const OPEN = 6.8, CUT = 29.33;
  window.__filmMeta = { cut: CUT };

  // Ses efektleri (müzik ve seslendirme ayrıca eklenir: muzik.mjs, metin.json)
  window.__sfx = [
    { t: 0.3, type: 'tvOn' }, { t: 0.62, type: 'tone', d: 0.8 },
    { t: 1.46, type: 'static', d: 0.18 }, { t: 3.96, type: 'static', d: 0.14, g: 0.8 },
    { t: 6.72, type: 'whoosh', d: 0.45, g: 0.6 },
    { t: OPEN + 0.85, type: 'thud' }, { t: OPEN + 1.1, type: 'press' },
    { t: OPEN + 1.2, type: 'pop' }, { t: OPEN + 1.2, type: 'hit', g: 0.45 }, { t: OPEN + 1.22, type: 'fizz', d: 2.4 },
    { t: OPEN + 1.32, type: 'rattle' },
    { t: OPEN + 1.75, type: 'whoosh', d: 1.3, g: 0.7 }, { t: OPEN + 2.7, type: 'whoosh', d: 0.7, g: 0.6 },
    ...[0, 1, 2, 3, 4].map((i) => ({ t: OPEN + 3.6 + i * 0.09, type: 'bubble', g: 0.5 + i * 0.05 })),
    { t: 12.0, type: 'whoosh', d: 0.55, g: 0.35 },
    ...[13.0, 14.0, 15.0, 16.2].map((t) => ({ t, type: 'swipe', g: 0.8 })),
    { t: 18.0, type: 'lift' }, { t: 19.6, type: 'drop' }, { t: 19.66, type: 'kaching', g: 0.8 },
    { t: 20.0, type: 'swipe', g: 0.6 },
    { t: 20.5, type: 'pop', g: 0.5 }, { t: 21.3, type: 'clink', g: 0.8 },
    { t: 21.0, type: 'pop', g: 0.5 }, { t: 21.8, type: 'clink', p: 1.12, g: 0.8 },
    { t: 21.5, type: 'whoosh', d: 0.5, g: 0.45 },
    { t: 23.96, type: 'static', d: 0.16 },
    { t: 24.8, type: 'clink', g: 0.35 }, { t: 25.5, type: 'pop', g: 0.35 }, // koro söylerken hafif
    { t: 27.0, type: 'fizz', d: 2.0, g: 0.3 },
    { t: CUT, type: 'tvOff' },
  ];

  /* ---------- Eski TV dokusu: film greni, toz, titreme, görüntü kayması, kanal cızırtısı ---------- */
  let seed = 11; const rnd = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const tv = $('#tv'), flick = $('#flick');
  const mk = (id, w, h) => { const c = $(id); c.width = w; c.height = h; const x = c.getContext('2d'); return { c, x, img: x.createImageData(w, h) }; };
  const gr = mk('#grain', H ? 320 : 180, H ? 180 : 320), st = mk('#static', H ? 240 : 135, H ? 135 : 240);
  let frame = 0, staticOn = false;
  (function texture() {
    requestAnimationFrame(texture); frame++;
    const d = gr.img.data;
    for (let i = 0; i < d.length; i += 4) { d[i] = d[i + 1] = d[i + 2] = 128 + (rnd() - 0.5) * 150; d[i + 3] = 255; }
    gr.x.putImageData(gr.img, 0, 0);
    if (rnd() < 0.45) { gr.x.fillStyle = 'rgba(0,0,0,.85)'; for (let k = 0; k < 3; k++) { gr.x.beginPath(); gr.x.arc(rnd() * gr.c.width, rnd() * gr.c.height, 0.3 + rnd() * 1.4, 0, 7); gr.x.fill(); } }
    if (rnd() < 0.1) { gr.x.fillStyle = 'rgba(255,255,255,.6)'; gr.x.fillRect(rnd() * gr.c.width, 0, 0.5, gr.c.height); }
    const t = frame / 60;
    tv.style.transform = `translate(${(Math.sin(t * 9.1) * 0.45 + (rnd() - 0.5) * 0.5).toFixed(2)}px,${(Math.sin(t * 5.3) * 0.7 + (rnd() - 0.5) * 0.4).toFixed(2)}px)`;
    flick.style.opacity = (rnd() * 0.08).toFixed(3);
    if (staticOn) {
      const s = st.img.data, W = st.c.width, Hh = st.c.height, roll = (frame * 9) % Hh;
      for (let y = 0; y < Hh; y++) { const band = 0.55 + 0.45 * Math.sin((y + roll) * 0.16); for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; s[i] = s[i + 1] = s[i + 2] = rnd() * 255 * band; s[i + 3] = 255; } }
      st.x.putImageData(st.img, 0, 0);
    }
  })();

  const tl = G.timeline({ paused: true });
  const zap = (t, d) => tl.add(() => { staticOn = true; G.set(st.c, { opacity: 1 }); }, t).add(() => { staticOn = false; G.set(st.c, { opacity: 0 }); }, t + d);

  /* ---------- Seslendirme yazıları ---------- */
  const EM = new Set(['tatlar,', 'sofranızda!', 'koleksiyonluk', 'gazozlar!', 'rengi,', 'hikâyesi', 'kasaya', 'at…', 'kapına', 'kadar!']);
  const sups = $('#sups');
  function sup(id, mode) {
    const i = LINES.findIndex((l) => l.id === id), l = LINES[i], next = LINES[i + 1];
    const words = l.metin.split(' '), per = Math.min(0.24, (l.sure * 0.72) / words.length);
    const life = Math.min(l.sure + 0.45, (next ? next.t - l.t : 9) - 0.2);
    tl.add(() => {
      const el = document.createElement('div');
      el.className = `sup sup-${mode}`;
      el.innerHTML = words.map((w) => `<span class="w"><span>${EM.has(w) ? `<em>${w}</em>` : w}</span></span>`).join(' ');
      sups.append(el);
      const t = G.timeline({ onComplete: () => el.remove() });
      if (mode === 'ban') t.fromTo(el, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.32, ease: 'back.out(1.6)' }, 0);
      t.from(el.querySelectorAll('.w > span'), { y: 34, scale: 0.35, opacity: 0, duration: 0.42, stagger: per, ease: 'back.out(2.2)' }, mode === 'ban' ? 0.1 : 0)
        .to(el, { opacity: 0, duration: 0.22, ease: 'power2.in' }, life - 0.22);
    }, l.t - 0.06);
  }

  /* ---------- Hazırlık: 3D şişe, site, kapanış logosu, yazı tipleri ---------- */
  const frameEl = $('#site');
  const { start } = await import('/intro3d.js');
  const ctrl = await start({ host: $('#stage3d'), film: true });
  await waitFor(() => frameEl.contentWindow && frameEl.contentWindow.__nese);
  const S = frameEl.contentWindow.__nese;
  await S.ready();
  const page = new DOMParser().parseFromString(await fetch('/').then((r) => r.text()), 'text/html');
  const logo = $('#endLogo'); logo.innerHTML = page.querySelector('#footLogo').innerHTML;
  await Promise.all([document.fonts.load('74px Lobster', 'sunar Kapağı aç, hikâyesini iç!'), document.fonts.load('800 100px Bricolage', 'NEŞE GAZOZCUSU Fışşş!')]).catch(() => {});

  const cam = ctrl.cam, off = H ? -0.95 : 0; // yatayda şişe sağda, yazılar solda
  const screen = $('#screen'), power = $('#power'), flash = $('#flash'), dip = $('#dip'), iris = $('#iris');
  G.set(screen, { scaleX: 0, scaleY: 0.004 });

  /* ---------- 0. Televizyon açılır ---------- */
  tl.set('#bars', { opacity: 1 }, 0)
    .set(power, { opacity: 1 }, 0.3)
    .fromTo(power, { scaleX: 0 }, { scaleX: 1, duration: 0.09, ease: 'power2.out' }, 0.3)
    .set(screen, { scaleX: 1 }, 0.39)
    .fromTo(screen, { scaleY: 0.004 }, { scaleY: 1, duration: 0.28, ease: 'expo.out' }, 0.39)
    .to(power, { opacity: 0, duration: 0.12 }, 0.42)
    .fromTo(flash, { opacity: 0.85 }, { opacity: 0, duration: 0.55, ease: 'power2.out' }, 0.39);

  /* ---------- 1. Başlık kartı ---------- */
  zap(1.46, 0.18);
  tl.set('#bars', { opacity: 0 }, 1.56).set('#title', { opacity: 1 }, 1.56)
    .to('#title .sun', { rotation: 36, duration: 2.6, ease: 'none' }, 1.56)
    .fromTo('.t-neshe span', { yPercent: -170, rotation: (i) => [-14, 10, -8, 12][i], opacity: 0 }, { yPercent: 0, rotation: 0, opacity: 1, duration: 0.75, stagger: 0.07, ease: 'bounce.out' }, 1.6)
    .fromTo('.t-rib', { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'back.out(1.7)' }, 2.05)
    .fromTo('.t-sunar', { scale: 0, rotation: -40 }, { scale: 1, rotation: -9, duration: 0.6, ease: 'back.out(2.5)' }, 2.35)
    .to('.t-sunar', { rotation: -3, duration: 0.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 3.05)
    .to('.t-box', { scale: 1.06, duration: 1.2, ease: 'sine.inOut' }, 2.8);

  /* ---------- 2. Makro: buğulu şişe ---------- */
  Object.assign(cam, { x: 0.8, y: 0.32, z: 1.75, lx: off * 0.35, ly: 0.55, lz: 0, fov: 34 });
  zap(3.96, 0.14);
  tl.set('#title', { opacity: 0 }, 4.04)
    .fromTo(cam, { x: 0.8, y: 0.32, z: 1.75, ly: 0.55 }, { x: -0.3, y: 1.62, z: 2.15, ly: 1.55, duration: 2.8, ease: 'sine.inOut' }, 4.0);
  sup('02-tatlar', 'big');

  /* ---------- 3. Geniş plan: açılış ---------- */
  const pts = []; for (let i = 0; i < 36; i++) { const a = (i / 36) * Math.PI * 2, r = i % 2 ? 62 : 96; pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`); }
  $('#slam polygon').setAttribute('points', pts.join(' '));
  tl.to(dip, { opacity: 1, duration: 0.08 }, OPEN - 0.1)
    .add(() => Object.assign(cam, { x: 0, y: 1.62, z: 6.3, lx: off, ly: H ? 1.12 : 1.0, lz: 0, fov: 30 }), OPEN)
    .to(dip, { opacity: 0, duration: 0.25 }, OPEN)
    .to(cam, { z: 5.5, duration: 1.3, ease: 'power2.out' }, OPEN)
    .add(() => ctrl.open(), OPEN)
    .set('#slam', { opacity: 1 }, OPEN + 1.2)
    .fromTo('#slam .burst', { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.42, ease: 'back.out(2)' }, OPEN + 1.2)
    .fromTo('#slam span', { scale: 2.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2.5)' }, OPEN + 1.24)
    .to('#slam .burst', { rotation: 25, duration: 1.2, ease: 'none' }, OPEN + 1.62)
    .to('#slam span', { x: 6, duration: 0.04, repeat: 5, yoyo: true }, OPEN + 1.5)
    .to('#slam', { opacity: 0, scale: 0.85, duration: 0.35, ease: 'power2.in' }, OPEN + 2.35);

  /* ---------- 4. Dalış → site ---------- */
  tl.set(iris, { opacity: 1, '--r': '0%' }, OPEN + 2.7)
    .to(iris, { '--r': '95%', duration: 0.7, ease: 'power1.in' }, OPEN + 2.7)
    .add(() => {
      ctrl.dispose(); $('#stage3d').style.display = 'none';
      G.set('#siteWrap', { opacity: 1 });
      S.reveal();
      if (H) G.from('#phone', { y: 90, opacity: 0, duration: 1, ease: 'expo.out' });
    }, OPEN + 3.5)
    .to(iris, { opacity: 0, duration: 0.7, ease: 'power1.out' }, OPEN + 3.55);
  if (H) tl.to('#hbg', { rotation: 30, duration: 14, ease: 'none' }, OPEN + 3.5);
  sup('03-anadolu', H ? 'big' : 'ban');

  /* ---------- 5. Raf ---------- */
  tl.add(() => S.scrollTo('#koleksiyon', 1.1, H ? -58 : 30), 12.0);
  [13.0, 14.0, 15.0, 16.2].forEach((t, i) => tl.add(() => S.rail(i + 1, 0.7), t));
  sup('04-renk', H ? 'big' : 'ban');

  /* ---------- 6. Kasaya ---------- */
  tl.add(() => S.drag(1.25), 18.0)
    .add(() => S.rail(3, 0.5), 20.0)
    .add(() => S.add(3), 20.5)
    .add(() => S.add(3), 21.0)
    .add(() => S.cart(), 21.5);
  sup('05-kasa', H ? 'big' : 'ban');
  sup('06-odeme', H ? 'big' : 'ban');

  /* ---------- 7. Kapanış: retro tabela logosu (sitedeki alt logonun animasyonu) ---------- */
  const q = (s) => logo.querySelector(s);
  const crimp = []; for (let i = 0; i < 56; i++) { const a = (i / 56) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 188 : 197; crimp.push(`${(200 + r * Math.cos(a)).toFixed(1)},${(200 + r * Math.sin(a)).toFixed(1)}`); }
  q('.nl-crimp').setAttribute('points', crimp.join(' '));
  const liquid = q('.nl-liquid'), outline = q('.nl-outline'), arcs = q('.nl-arcs'), ribbon = q('.nl-ribbon'), ribText = q('.nl-rib');
  const words = logo.querySelectorAll('.nl-w'), layers = [...logo.querySelectorAll('.nl-depth .nl-w')];
  const depthAt = (el, f) => `translate(${(el.dataset.k * 0.8 * f).toFixed(2)} ${(el.dataset.k * 1.1 * f).toFixed(2)})`;
  const RIB = (s) => `translate(200 279) scale(${s} 1) translate(-200 -279)`;
  G.set([arcs, ribbon], { opacity: 0 }); G.set(words, { letterSpacing: 44 }); G.set([...layers, outline], { opacity: 0 });
  layers.forEach((el) => el.setAttribute('transform', depthAt(el, 0)));
  G.set(liquid, { attr: { transform: 'translate(0 150)' } }); G.set(logo, { opacity: 0 });

  const E = 24.06;
  zap(23.96, 0.16);
  tl.add(() => { G.set('#end', { opacity: 1 }); G.set('#siteWrap', { opacity: 0 }); }, E)
    .to('#end .sun', { rotation: 40, duration: 5.4, ease: 'none' }, E)
    .fromTo(logo, { opacity: 0, scale: 0.55, rotation: -150 }, { opacity: 1, scale: 1, rotation: 0, duration: 1.1, ease: 'back.out(1.5)' }, E)
    .add(() => { const r = logo.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.bottom - r.height * 0.05, { count: 34, up: 0.9, spread: 1.9, color: '#ffe08a', drops: 0.4 }); }, E + 0.75)
    .fromTo(arcs, { opacity: 0, attr: { transform: 'rotate(-30 200 200)' } }, { opacity: 1, attr: { transform: 'rotate(0 200 200)' }, duration: 0.9, ease: 'power3.out' }, E + 0.55)
    .to(words, { letterSpacing: -1, duration: 1.1, ease: 'expo.out' }, E + 0.8)
    .to(outline, { opacity: 1, duration: 0.5 }, E + 1.15)
    .to(layers, { opacity: 1, duration: 0.01 }, E + 1.45)
    .add(() => layers.forEach((el) => G.fromTo(el, { attr: { transform: depthAt(el, 0) } }, { attr: { transform: depthAt(el, 1) }, duration: 0.55, ease: 'back.out(2.4)' })), E + 1.45)
    .to(liquid, { attr: { transform: 'translate(0 0)' }, duration: 1.8, ease: 'power2.out' }, E + 1.7)
    .fromTo(ribbon, { opacity: 0, attr: { transform: RIB(0) } }, { opacity: 1, attr: { transform: RIB(1) }, duration: 0.8, ease: 'back.out(1.4)' }, E + 1.95)
    .from(ribText, { opacity: 0, duration: 0.5 }, E + 2.4)
    .fromTo('.e-tag', { scale: 0, rotation: -30, opacity: 0 }, { scale: 1, rotation: -4, opacity: 1, duration: 0.6, ease: 'back.out(2.2)' }, 26.4)
    .fromTo('.e-sub', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 27.0)
    .to(logo, { scale: 1.04, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 27.0);
  [E + 0.1, 25.6, 27.0].forEach((t) => tl.add(() => FX.burst(innerWidth / 2, innerHeight + 10, { count: 60, up: 1.9, spread: 1, color: '#8ff0d8', drops: 0 }), t));

  /* ---------- 8. Televizyon kapanır ---------- */
  tl.to(flash, { opacity: 0.9, duration: 0.1 }, CUT)
    .to(screen, { scaleY: 0.004, duration: 0.12, ease: 'power3.in' }, CUT)
    .set(power, { opacity: 1, scaleX: 1 }, CUT + 0.12)
    .to(screen, { scaleX: 0, duration: 0.14, ease: 'power3.in' }, CUT + 0.12)
    .to(power, { scaleX: 0.012, duration: 0.14, ease: 'power3.in' }, CUT + 0.12)
    .to(power, { opacity: 0, duration: 0.35, ease: 'power1.in' }, CUT + 0.3);

  window.__filmStart = () => { tl.play(0); };
  window.__filmReady = true;
})();
