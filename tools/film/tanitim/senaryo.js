// SpaceTour TR · tanıtım filmi (30 sn, müzik + efekt, anlatıcısız). Yönetmen: TEK bir duraklatılmış GSAP timeline.
// Kayıt: npm run film → tools/film/record.mjs bu sayfayı sanal saatle kare kare çeker; ses miks.mjs'te kurulur.
// Sahneler sitenin GERÇEK sayfalarıdır (iframe ?film=1); etkileşimler window.__film kumandasıyla yapılır.
//
//  0.0  Açılış künyesi: BÖLÜM 00 — BİR UZAY BELGESELİ · "Gökyüzü hiç durmadı."
//  3.0  Ana sayfa: Güneş doğar, "EVREN hiç durmaz." gelir; 5.0'te kaydırma "İçindekiler"e (yedi bölüm) iner
//  7.0  Gök haritası: canlı planetaryum, gökyüzü gerçek bakış kontrolleriyle döner     · GÖĞÜ oku.
// 11.0  Gözlemevi: Yengeç Bulutsusu radyo → görünür → X-ışını arasında silinir          · GÖRÜNMEYENİ gör.
// 15.0  Kara delik: olay ufkuna yaklaşıldıkça saatler yavaşlar (kaydırıcı)                · ZAMANI bük.
// 19.0  Astroloji: Urania's Mirror (1824) burç kartları                                  · YILDIZLARINI keşfet.
// 23.0  Canlı gökyüzü: ISS'in anlık konumu                                               · ŞU AN, gökyüzünde.
// 26.0  Kapanış: logo, Spacetour.tr, "EVREN hiç durmaz.", spacetour.com.tr, görsel künyesi
(async () => {
  const G = window.gsap;
  const H = new URLSearchParams(location.search).get('fmt') === 'h';
  document.body.classList.add(H ? 'fmt-h' : 'fmt-v');
  const W = H ? 960 : 540, HH = H ? 540 : 960; // sahne (CSS px); kayıt 2x
  const VW = H ? 1280 : 540, VH = H ? 720 : 960; // sitenin gördüğü pencere
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms)); // sanal saat
  const status = (s) => { window.__filmDurum = s; };
  async function waitFor(fn, label, max = 90000) {
    const t0 = performance.now();
    status(label);
    for (;;) {
      let ok = false;
      try { ok = !!fn(); } catch { ok = false; }
      if (ok) return;
      if (performance.now() - t0 > max) throw new Error(`zaman aşımı: ${label}`);
      await sleep(100);
    }
  }

  const TEXT = await fetch('/film/tanitim/metin.json').then((r) => r.json());
  const LINE = Object.fromEntries(TEXT.satirlar.map((l) => [l.id, l]));

  // Sitenin yazı tipleri ve .doc-* sınıfları: ana sayfanın CSS'i ve <html> sınıfları (font değişkenleri) alınır
  const home = new DOMParser().parseFromString(await fetch('/').then((r) => r.text()), 'text/html');
  await Promise.all($$('link[rel=stylesheet]', home).map((l) => new Promise((res) => {
    const n = document.createElement('link');
    n.rel = 'stylesheet'; n.href = l.getAttribute('href'); n.onload = n.onerror = res;
    document.head.prepend(n); // çekim sayfasının kendi stili sonra gelsin, üstün olsun
  })));
  document.documentElement.className = home.documentElement.className;

  /* ---------- Sahneler: sitenin gerçek sayfaları ---------- */
  const topY = (d, el) => el.getBoundingClientRect().top + d.defaultView.scrollY;
  const textIs = (d, txt) => $$('main span', d).some((e) => e.textContent.trim() === txt);
  const SC = {
    // Ana sayfa yüklenir ama sahnesi gelene kadar saati durur: girişi (Güneş, başlık) tam 3. saniyede oynar
    ana: { url: '/', holdFromLoad: true, ready: (d) => $$('main canvas', d).length > 0 },
    gok: {
      url: '/harita/planetaryum', acc: '#38bdf8',
      ready: (d, w) => !!w.__film.eylemler.gokyuzu,
      y: (d) => topY(d, $('.cursor-grab', d)) - (H ? 46 : 64),
    },
    spek: {
      url: '/gozlemevi/spektrum', acc: '#f43f5e',
      ready: (d) => !!$('[aria-label="Dalgaboyu"]', d),
      y: (d) => topY(d, $('[aria-label="Dalgaboyu"]', d).parentElement) - (H ? 22 : 4),
    },
    kara: {
      url: '/ansiklopedi/laboratuvar/kara-delik', acc: '#818cf8',
      ready: (d) => !!$('main canvas', d) && !!$('input[type=range]', d),
      y: (d) => topY(d, $('main canvas', d)) - (H ? 104 : -50), // dikeyde zaman okumaları yazının üstünde kalsın
    },
    burc: {
      url: '/astroloji/burclar', acc: '#f5c542',
      ready: (d) => $$('main a[href^="/astroloji/burclar/"]', d).length >= 12,
      y: (d) => topY(d, $('main a[href^="/astroloji/burclar/"]', d)) - (H ? 116 : 70),
    },
    // ISS kartı yalnızca ekrandayken veri çeker: ısınmada karta kaydırılır, veri gelince başa döner
    iss: {
      url: '/canli/iss', acc: '#38bdf8',
      warm: (d) => topY(d, $('main .ticks.space-y-5', d)) - 120,
      ready: (d) => textIs(d, 'CANLI KONUM'), y: () => 0,
    },
  };
  const frames = $('#frames');
  for (const [id, s] of Object.entries(SC)) {
    const f = document.createElement('iframe');
    f.src = `${s.url}?film=1`;
    f.width = VW; f.height = VH; f.dataset.id = id;
    if (s.holdFromLoad) f.setAttribute('data-hold', '');
    frames.append(f);
    s.el = f;
  }
  const win = (s) => s.el.contentWindow, doc = (s) => s.el.contentDocument, F = (s) => s.el.contentWindow.__film;

  // Isınma: her sayfa hazır (görseller, yazı tipleri, 3D, canlı veri) olana dek bekle
  for (const [id, s] of Object.entries(SC)) {
    await waitFor(() => F(s) && F(s).hazir(), `${id} yükleniyor`);
    if (s.warm) F(s).kaydir(Math.round(s.warm(doc(s))), 0);
    await waitFor(() => s.ready(doc(s), win(s)), `${id} hazırlanıyor`);
  }
  for (const s of Object.values(SC)) if (s.y) { s.y0 = Math.round(s.y(doc(s))); F(s).kaydir(s.y0, 0); }
  await sleep(2600); // kaydırmayla açılan öğeler yerine otursun
  for (const [id, s] of Object.entries(SC)) await waitFor(() => F(s).hazir(), `${id} görselleri`);
  await Promise.all([...document.fonts].map((f) => f.load().catch(() => {})));
  for (const s of Object.values(SC)) s.el.setAttribute('data-hold', '');

  /* ---------- Yazı yardımcıları ---------- */
  const chars = (t) => [...t].map((c) => `<span class="ch">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  function fit(el, sel, maxW, maxPx) { // satırı genişliğe sığdır
    const lines = $$(sel, el);
    let px = maxPx;
    el.style.fontSize = `${px}px`;
    const widest = () => Math.max(...lines.map((l) => l.firstElementChild.getBoundingClientRect().width));
    for (let i = 0; i < 40 && widest() > maxW; i++) { px *= 0.95; el.style.fontSize = `${px}px`; }
    return px;
  }

  const tl = G.timeline({ paused: true });
  const shade = $('#shade'), caps = $('#caps');
  const G0 = H ? 44 : 30;

  function caption(id, side = 'l') {
    const L = LINE[id], t0 = L.t, t1 = L.t + L.sure, right = H && side === 'r';
    const el = document.createElement('div');
    el.className = `cap${right ? ' r' : ''}`;
    el.style.setProperty('--acc', L.renk);
    el.innerHTML = `<div class="kick"><span class="k-no doc-kicker" style="color:${L.renk}">${L.kunye}</span><span class="k-rule"></span><span class="k-name doc-kicker">${L.kunye2}</span></div>`
      + `<div class="c-title doc-title"><span class="ln ln1"><span class="in">${chars(L.metin)}</span></span><span class="ln ln2 doc-serif"><span class="in">${chars(L.serif)}</span></span></div>`;
    caps.append(el);
    fit($('.c-title', el), '.ln', H ? W * 0.5 : W - G0 * 2, H ? 76 : 104);
    G.set(el, { autoAlpha: 0 });
    tl.add(() => shade.classList.toggle('r', right), t0 - 0.12)
      .to(shade, { opacity: 1, duration: 0.5, ease: 'power2.out' }, t0 - 0.1)
      .set(el, { autoAlpha: 1 }, t0)
      .fromTo($('.k-rule', el), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' }, t0)
      .fromTo($$('.kick .doc-kicker', el), { autoAlpha: 0, x: right ? 10 : -10 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, t0 + 0.05)
      .fromTo($$('.ln1 .ch', el), { yPercent: 118 }, { yPercent: 0, duration: 0.8, stagger: 0.032, ease: 'expo.out' }, t0 + 0.14)
      .fromTo($$('.ln2 .ch', el), { yPercent: 118 }, { yPercent: 0, duration: 0.8, stagger: 0.03, ease: 'expo.out' }, t0 + 0.3)
      .to(el, { autoAlpha: 0, y: -12, duration: 0.28, ease: 'power2.in' }, t1 - 0.28)
      .to(shade, { opacity: 0, duration: 0.35, ease: 'power2.in' }, t1 - 0.3);
  }

  // Sahne değişimi: yeni sayfanın saati biraz önce açılır (perde arkasında ilk kareleri hazırlansın), eskisi durur
  function show(id, t, release = 0.3) {
    tl.add(() => SC[id].el.removeAttribute('data-hold'), t - release)
      .add(() => {
        for (const s of Object.values(SC)) {
          const on = s === SC[id];
          s.el.style.opacity = on ? '1' : '0';
          if (!on) s.el.setAttribute('data-hold', '');
        }
      }, t);
  }
  G.set('#wipe', { xPercent: -101, autoAlpha: 1 }); // konum yalnızca GSAP'te (CSS transform ile toplanmasın)
  const wipe = (t, acc) => tl
    .add(() => $('#wipe').style.setProperty('--acc', acc), t - 0.3)
    .fromTo('#wipe', { xPercent: -101 }, { xPercent: 0, duration: 0.24, ease: 'power3.in', immediateRender: false }, t - 0.24)
    .to('#wipe', { xPercent: 101, duration: 0.36, ease: 'power3.out' }, t + 0.02);
  const dip = (t, d = 0.16) => tl.to('#dip', { opacity: 1, duration: d, ease: 'power1.in' }, t - d).to('#dip', { opacity: 0, duration: 0.3, ease: 'power1.out' }, t + 0.02);

  /* ---------- Yıldız alanı (açılış ve kapanış kartları) ---------- */
  function starfield(card, seed, speed) {
    const c = $('canvas.stars', card), x = c.getContext('2d');
    c.width = W * 2; c.height = HH * 2;
    let s = seed; const r = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
    const stars = Array.from({ length: 520 }, () => ({ x: r() * 2 - 1, y: r() * 2 - 1, z: 0.05 + r() * 0.95, m: 0.35 + r() * 0.65, w: r() < 0.18 }));
    const st = { on: false, speed };
    let last = performance.now();
    (function draw() {
      requestAnimationFrame(draw);
      const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!st.on) return;
      x.fillStyle = '#050508'; x.fillRect(0, 0, c.width, c.height);
      const cx = c.width / 2, cy = c.height * 0.46, k = Math.max(c.width, c.height) * 0.42;
      for (const p of stars) {
        p.z -= dt * st.speed;
        if (p.z < 0.04) p.z += 0.96;
        const px = cx + (p.x / p.z) * k, py = cy + (p.y / p.z) * k;
        if (px < -4 || py < -4 || px > c.width + 4 || py > c.height + 4) continue;
        const near = 1 - p.z, a = Math.min(1, 0.3 + near * 1.3) * p.m;
        x.fillStyle = p.w ? `rgba(255,214,150,${a})` : `rgba(226,232,255,${a})`;
        x.beginPath(); x.arc(px, py, 0.8 + near * near * 3.2 * p.m, 0, 6.2832); x.fill();
      }
    })();
    return st;
  }
  const slateStars = starfield($('#slate'), 7, 0.05), endStars = starfield($('#end'), 29, 0.03);

  /* ---------- 0. Açılış künyesi ---------- */
  {
    const L = LINE['00-acilis'];
    $('#slate .k-no').textContent = L.kunye;
    $('#slate .k-name').textContent = L.kunye2;
    $('#slate .s-line').innerHTML = chars(L.metin);
    $('#slate .s-cap').textContent = L.alt;
    slateStars.on = true;
    G.set('#slate', { autoAlpha: 1 });
    tl.fromTo('#slate .k-rule', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.inOut' }, L.t)
      .fromTo('#slate .kick .doc-kicker', { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.16, ease: 'power2.out' }, L.t + 0.1)
      .fromTo('#slate .s-line .ch', { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.028, ease: 'expo.out' }, L.t + 0.6)
      .fromTo('#slate .s-cap', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, L.t + 1.25)
      .to(slateStars, { speed: 0.42, duration: 2.6, ease: 'power2.in' }, 0.2)
      .to('#slate .s-copy', { autoAlpha: 0, y: -10, duration: 0.35, ease: 'power2.in' }, 2.42)
      .to('#slate', { autoAlpha: 0, duration: 0.22, ease: 'power1.in' }, 2.84)
      .add(() => { slateStars.on = false; }, 3.1);
  }

  /* ---------- 1. Ana sayfa: Güneş doğar, başlık gelir, kamera Güneş'e uçar ---------- */
  show('ana', 2.84, 0.18);
  {
    const s = SC.ana, sway = { x: 0.5, y: 0.5 };
    const point = () => { const w = win(s); w.dispatchEvent(new w.PointerEvent('pointermove', { clientX: sway.x * VW, clientY: sway.y * VH })); };
    tl.add(point, 2.7)
      .to(sway, { x: 0.28, y: 0.36, duration: 3.2, ease: 'sine.inOut', onUpdate: point }, 2.9)
      // Kaydırma Güneş'i geride bırakıp sitenin "İçindekiler" listesine iner: yedi bölüm, filmin geri kalanının haritası
      .add(() => F(s).kaydir('#bolumler', 1.3, H ? 40 : 56), 5.0);
  }
  wipe(7.0, SC.gok.acc);

  /* ---------- 2. Gök haritası: gökyüzü gerçek bakış kontrolleriyle döner ---------- */
  show('gok', 7.0);
  {
    const s = SC.gok, pan = { k: 0 }; let a0 = [0, 0];
    tl.add(() => { a0 = F(s).eylemler.gokyuzu.aci(); }, 6.95)
      .fromTo(pan, { k: 0 }, { k: 1, duration: 4.1, ease: 'sine.inOut', immediateRender: false,
        onUpdate: () => F(s).eylemler.gokyuzu.bak(a0[0] - (H ? 0.6 : 0.55) * pan.k, a0[1] - 0.08 * pan.k) }, 6.96);
    caption('02-gok', 'l');
  }

  /* ---------- 3. Gözlemevi: aynı nesne, dört göz ---------- */
  wipe(11.0, SC.spek.acc);
  show('spek', 11.0);
  {
    const s = SC.spek, band = '[aria-label="Dalgaboyu"] [role=radio]';
    [[11.55, 0], [12.75, 2], [13.95, 3]].forEach(([t, i]) => tl.add(() => F(s).tikla(band, i), t));
    caption('03-spek', 'r');
  }

  /* ---------- 4. Kara delik: ufka yaklaştıkça zaman yavaşlar ---------- */
  wipe(15.0, SC.kara.acc);
  show('kara', 15.0);
  {
    const s = SC.kara, dist = { v: 3.5 }; let shown = '';
    const set = () => { const v = dist.v.toFixed(1); if (v !== shown) { shown = v; F(s).deger('input[type=range]', v); } };
    tl.add(() => { dist.v = Number($('input[type=range]', doc(s)).value) || 3.5; }, 15.25)
      .to(dist, { v: 1.1, duration: 2.9, ease: 'power2.inOut', onUpdate: set }, 15.3);
    caption('04-kara', H ? 'r' : 'l');
  }

  /* ---------- 5. Astroloji: Urania's Mirror kartları ---------- */
  wipe(19.0, SC.burc.acc);
  show('burc', 19.0);
  tl.add(() => F(SC.burc).kaydir(SC.burc.y0 + (H ? 560 : 762), 4.2), 19.02);
  caption('05-burc', 'l');

  /* ---------- 6. Canlı gökyüzü: ISS ---------- */
  dip(23.0);
  show('iss', 23.0);
  tl.add(() => { const s = SC.iss; F(s).kaydir(Math.round(topY(doc(s), $('main .ticks.space-y-5', doc(s)))) - (H ? 70 : 76), 1.3); }, 23.3);
  caption('06-iss', H ? 'r' : 'l');

  /* ---------- 7. Kapanış ---------- */
  const E = 26.0;
  {
    const L = LINE['07-son'];
    $('#end .e-slogan .w1').innerHTML = `<span class="ln">${chars(L.metin)}</span>`;
    $('#end .e-slogan .w2').innerHTML = `<span class="ln">${chars(L.serif)}</span>`;
    $('#end .u-text').textContent = L.adres;
    $('#end .e-credit').textContent = L.kunye;
    $$('#end .e-slogan .ln').forEach((l) => Object.assign(l.style, { display: 'inline-block', overflow: 'hidden', padding: '0.08em 0 0.04em' }));
    const planet = $('#end .l-planet'), orbit = { a: -Math.PI * 1.35 };
    const place = () => { planet.setAttribute('cx', (32 + 21 * Math.cos(orbit.a)).toFixed(2)); planet.setAttribute('cy', (32 + 21 * Math.sin(orbit.a)).toFixed(2)); };
    place();
    G.set(['#end .l-bg', '#end .l-sun'], { scale: 0, svgOrigin: '32 32' });
    G.set('#end .l-ring', { strokeDasharray: 1, strokeDashoffset: 1 });
    G.set(planet, { opacity: 0 });
    dip(E, 0.2);
    tl.add(() => { endStars.on = true; }, E - 0.1)
      .set('#end', { autoAlpha: 1 }, E)
      .add(() => { for (const s of Object.values(SC)) { s.el.style.opacity = '0'; s.el.setAttribute('data-hold', ''); } }, E)
      .fromTo('#end .e-glow', { opacity: 0, scale: 0.55 }, { opacity: 1, scale: 1, duration: 2.4, ease: 'power2.out' }, E)
      .to('#end .l-bg', { scale: 1, duration: 0.7, ease: 'expo.out' }, E)
      .to('#end .l-ring', { strokeDashoffset: 0, duration: 1.0, ease: 'expo.inOut' }, E + 0.12)
      .to('#end .l-sun', { scale: 1, duration: 1.0, ease: 'elastic.out(1, 0.55)' }, E + 0.22)
      .to(planet, { opacity: 1, duration: 0.2 }, E + 0.3)
      .to(orbit, { a: 0, duration: 1.15, ease: 'power3.out', onUpdate: place }, E + 0.3)
      .fromTo('#end .e-word', { autoAlpha: 0, y: 18, letterSpacing: '0.06em' }, { autoAlpha: 1, y: 0, letterSpacing: '-0.035em', duration: 1.1, ease: 'expo.out' }, E + 0.55)
      .fromTo('#end .e-slogan .w1 .ch', { yPercent: 118 }, { yPercent: 0, duration: 0.8, stagger: 0.04, ease: 'expo.out' }, L.t)
      .fromTo('#end .e-slogan .w2 .ch', { yPercent: 118 }, { yPercent: 0, duration: 0.8, stagger: 0.03, ease: 'expo.out' }, L.t + 0.18)
      .fromTo('#end .u-rule', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' }, L.t + 0.6)
      .fromTo('#end .u-text', { autoAlpha: 0, letterSpacing: '0.6em' }, { autoAlpha: 1, letterSpacing: '0.3em', duration: 0.9, ease: 'expo.out' }, L.t + 0.68)
      .fromTo('#end .e-credit', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, L.t + 1.1)
      .to('#end .e-logo', { scale: 1.035, duration: 2.6, ease: 'sine.inOut', transformOrigin: '50% 50%' }, E + 1.4);
  }

  /* ---------- Ses olayları (müzik ayrıca: muzik.mjs, aynı kesim saniyeleriyle) ---------- */
  window.__filmMeta = { cuts: [3, 7, 11, 15, 19, 23, 26], end: 30 };
  window.__sfx = [
    { t: 0.32, type: 'tick', g: 0.5 }, { t: 0.95, type: 'shimmer', g: 0.35 },
    { t: 2.45, type: 'whoosh', d: 0.55, g: 0.35 },
    { t: 3.0, type: 'hit', g: 0.9 }, { t: 3.0, type: 'sub', g: 0.8 },
    { t: 4.95, type: 'whoosh', d: 1.4, g: 0.45, lo: 160, hi: 1400 },
    { t: 6.74, type: 'whoosh', d: 0.55, g: 0.5 }, { t: 7.0, type: 'sub', g: 0.55 },
    { t: 7.35, type: 'tick', g: 0.35 },
    { t: 10.74, type: 'whoosh', d: 0.55, g: 0.5 },
    ...[11.55, 12.75, 13.95].flatMap((t) => [{ t, type: 'click', g: 0.7 }, { t: t + 0.02, type: 'scan', d: 1.1, g: 0.45 }]),
    { t: 11.35, type: 'tick', g: 0.35 },
    { t: 14.74, type: 'whoosh', d: 0.55, g: 0.5 },
    { t: 15.0, type: 'sub', g: 0.9 }, { t: 15.05, type: 'warp', d: 3.4, g: 0.55 },
    ...[15.45, 15.98, 16.56, 17.2, 17.92, 18.72].map((t, i) => ({ t, type: 'tock', g: 0.55 - i * 0.04, p: 1 - i * 0.07 })),
    { t: 18.74, type: 'whoosh', d: 0.55, g: 0.5 },
    { t: 19.0, type: 'hit', g: 0.65 }, { t: 19.35, type: 'tick', g: 0.35 },
    ...[19.4, 20.8, 22.2].map((t) => ({ t, type: 'swipe', g: 0.3 })),
    { t: 22.84, type: 'whoosh', d: 0.4, g: 0.35 },
    { t: 23.3, type: 'whoosh', d: 1.3, g: 0.3, lo: 300, hi: 1800 },
    ...[23.55, 23.7, 24.55, 24.7, 25.55].map((t, i) => ({ t, type: 'blip', g: 0.4, p: i % 2 ? 1.5 : 1 })),
    { t: 26.0, type: 'hit', g: 1.0 }, { t: 26.0, type: 'sub', g: 1.0 },
    { t: 26.3, type: 'whoosh', d: 1.1, g: 0.4, lo: 500, hi: 3200 },
    { t: 26.25, type: 'shimmer', g: 0.55 }, { t: 27.42, type: 'chime', g: 0.45 },
    { t: 27.6, type: 'tick', g: 0.35 },
  ];

  window.__filmStart = () => { tl.play(0); };
  status('hazır');
  window.__filmReady = true;
})().catch((e) => { window.__filmDurum = `HATA: ${e.message}`; console.error(e); });
