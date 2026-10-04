// SpaceTour TR · astroloji bölümü tanıtım filmi (30 sn, müzik + efekt). Yönetmen: TEK bir duraklatılmış GSAP timeline.
// Kayıt: node tools/film/record.mjs v,h astroloji. Sahneler sitenin GERÇEK astroloji sayfalarıdır (iframe ?film=1).
//
//  0.0  Açılış künyesi: BÖLÜM 04 — ASTROLOJİ · "Gökyüzünün kadim dili."
//  3.0  Usturlap: 12 burçluk çark gerçek düğmelerle döner                           · ZODYAĞI çevir.
//  7.0  Doğum haritası: kişisel yorum; doğum saati değişince yükselen ve yorum değişir · HARİTAN sana özel.
// 11.0  Sinastri: iki kişinin haritası; doğum ayı değişince uyum ve açılar değişir     · İKİ HARİTA, tek hikâye.
// 15.0  Günlük burç: burç seçilir, Ay'ın o günkü evine göre yorum                     · GÖKYÜZÜ her gün yeni.
// 19.0  Numeroloji: ad yazılır, sayılar değişir; sütunlar seçilir                      · SAYILAR konuşur.
// 23.0  Burç dosyası (Başak): Urania's Mirror gravürü ve karakter yazısı                · ON İKİ arketip.
// 26.0  Kapanış: logo, Spacetour.tr, "Yıldızların dili.", spacetour.com.tr/astroloji
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

  const TEXT = await fetch('/film/astroloji/metin.json').then((r) => r.json());
  const LINE = Object.fromEntries(TEXT.satirlar.map((l) => [l.id, l]));

  // Sitenin yazı tipleri ve .doc-* sınıfları: ana sayfanın CSS'i ve <html> sınıfları (font değişkenleri) alınır
  const home = new DOMParser().parseFromString(await fetch('/').then((r) => r.text()), 'text/html');
  await Promise.all($$('link[rel=stylesheet]', home).map((l) => new Promise((res) => {
    const n = document.createElement('link');
    n.rel = 'stylesheet'; n.href = l.getAttribute('href'); n.onload = n.onerror = res;
    document.head.prepend(n); // çekim sayfasının kendi stili sonra gelsin, üstün olsun
  })));
  document.documentElement.className = home.documentElement.className;


  /* ---------- Sahneler: sitenin gerçek astroloji sayfaları ---------- */
  const topY = (d, el) => el.getBoundingClientRect().top + d.defaultView.scrollY;
  const byText = (d, txt) => $$('main *', d).find((e) => e.childElementCount === 0 && e.textContent.trim() === txt);
  const buttonByText = (d, re) => $$('main button', d).find((b) => re.test(b.textContent));
  const SC = {
    ana: {
      url: '/astroloji', acc: '#f5c542',
      ready: (d) => !!$('[aria-label^="Burç seç"]', d),
      y: (d) => topY(d, $('section[aria-label="360 Derece Zodyak Usturlabı"]', d)) + (H ? 120 : 150),
    },
    dogum: {
      url: '/astroloji/dogum-haritasi', acc: '#f5c542',
      ready: (d) => !!byText(d, 'Kozmik üçlü'),
      y: (d) => topY(d, byText(d, 'Kozmik üçlü')) - (H ? 200 : 300),
    },
    sinastri: {
      url: '/astroloji/sinastri', acc: '#f43f5e',
      ready: (d) => !!$('[aria-label="İkinci partnerin adı"]', d),
      y: (d) => topY(d, $('[aria-label="Birinci partnerin adı"]', d)) - (H ? 60 : 200),
    },
    gunluk: {
      url: '/astroloji/gunluk-burc', acc: '#38bdf8',
      ready: (d) => !!$('.choice-rail', d) && /Ay bugün/.test(d.body.innerText),
      y: (d) => topY(d, $('.choice-rail', d)) - (H ? 30 : 50),
    },
    numeroloji: {
      url: '/astroloji/numeroloji', acc: '#a78bfa',
      ready: (d) => !!$('main input[placeholder="Adınız"]', d),
      y: (d) => topY(d, byText(d, 'Numeroloji & Yaşam Yolu Analizi')) - (H ? 70 : 200),
    },
    burc: { url: '/astroloji/burclar/basak', acc: '#f5c542', ready: (d) => !!byText(d, 'Kısım I · Karakter'), y: () => 0 },
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

  const tl = G.timeline({ paused: true });
  const shade = $('#shade'), caps = $('#caps');
  const G0 = H ? 44 : 30;

  // Yazı: altta ortada tek satır ("ZODYAĞI çevir."), bütün olarak yumuşakça belirir
  function caption(id) {
    const L = LINE[id], t0 = L.t, t1 = L.t + L.sure;
    const el = document.createElement('div');
    el.className = 'cap';
    el.style.setProperty('--acc', L.renk);
    el.innerHTML = `<span class="doc-title">${L.metin}</span><span class="c-serif doc-serif">${L.serif}</span>`;
    caps.append(el);
    G.set(el, { autoAlpha: 0 });
    tl.to(shade, { opacity: 1, duration: 0.6, ease: 'power2.out' }, t0 - 0.1)
      .fromTo(el, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, t0)
      .to(el, { autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, t1 - 0.35)
      .to(shade, { opacity: 0, duration: 0.4, ease: 'power2.in' }, t1 - 0.35);
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
  const dip = (t, d = 0.22) => tl.to('#dip', { opacity: 1, duration: d, ease: 'power1.in' }, t - d).to('#dip', { opacity: 0, duration: 0.4, ease: 'power1.out' }, t + 0.02);

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
    $('#slate .s-kick').textContent = L.kunye2;
    $('#slate .s-line').innerHTML = chars(L.metin);
    slateStars.on = true;
    G.set('#slate', { autoAlpha: 1 });
    tl.fromTo('#slate .s-kick', { autoAlpha: 0, letterSpacing: '0.7em', paddingLeft: '0.7em' }, { autoAlpha: 1, letterSpacing: '0.4em', paddingLeft: '0.4em', duration: 1.3, ease: 'expo.out' }, L.t)
      .fromTo('#slate .s-line .ch', { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.028, ease: 'expo.out' }, L.t + 0.45)
      .to(slateStars, { speed: 0.2, duration: 2.6, ease: 'power2.in' }, 0.2)
      .to('#slate .s-copy', { autoAlpha: 0, y: -10, duration: 0.35, ease: 'power2.in' }, 2.42)
      .to('#slate', { autoAlpha: 0, duration: 0.22, ease: 'power1.in' }, 2.84)
      .add(() => { slateStars.on = false; }, 3.1);
  }

  /* ---------- 1. Usturlap: çark gerçek burç düğmeleriyle döner ---------- */
  show('ana', 2.84, 0.18);
  [[3.7, 'Aslan'], [4.7, 'Terazi'], [5.7, 'Balık']].forEach(([t, n]) => tl.add(() => F(SC.ana).tikla(`[aria-label="Burç seç: ${n}"]`), t));
  caption('01-usturlap');

  // Gerçek bir alanı React'in beklediği gibi değiştir (yerel setter + input olayı)
  const setNth = (s, sel, i, v) => {
    const el = $$(sel, doc(s))[i];
    if (!el) return;
    const proto = el.tagName === 'SELECT' ? win(s).HTMLSelectElement.prototype : win(s).HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, String(v));
    el.dispatchEvent(new (win(s).Event)(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
  };

  /* ---------- 2. Doğum haritası: saat değişir, yükselen ve yorum değişir ---------- */
  dip(7.0);
  show('dogum', 7.0);
  tl.add(() => setNth(SC.dogum, 'main input[type=number]', 2, 7), 8.3)
    .add(() => setNth(SC.dogum, 'main input[type=number]', 2, 21), 9.6);
  caption('02-dogum');

  /* ---------- 3. Sinastri: iki kişinin haritası; ikinci doğum ayı değişince uyum ve açılar değişir ---------- */
  tl.add(() => {
    setNth(SC.sinastri, '[aria-label="Birinci partnerin adı"]', 0, 'Elif');
    setNth(SC.sinastri, '[aria-label="İkinci partnerin adı"]', 0, 'Deniz');
  }, 1.0);
  dip(11.0);
  show('sinastri', 11.0);
  tl.add(() => setNth(SC.sinastri, 'main select', 2, 3), 11.9)
    .add(() => setNth(SC.sinastri, 'main select', 2, 11), 13.3);
  caption('03-sinastri');

  /* ---------- 4. Günlük burç ---------- */
  dip(15.0);
  show('gunluk', 15.0);
  [[15.9, 3], [17.3, 7]].forEach(([t, i]) => tl.add(() => F(SC.gunluk).tikla('.choice-rail > *', i), t));
  caption('04-gunluk');

  /* ---------- 5. Numeroloji: ad yazılır, sayılar değişir; sütunlar seçilir ---------- */
  dip(19.0);
  show('numeroloji', 19.0);
  ['E', 'El', 'Eli', 'Elif'].forEach((v, i) => tl.add(() => setNth(SC.numeroloji, 'main input[placeholder="Adınız"]', 0, v), 19.7 + i * 0.12));
  tl.add(() => { const b = buttonByText(doc(SC.numeroloji), /Kader \/ İfade/); if (b) b.click(); }, 20.9)
    .add(() => { const b = buttonByText(doc(SC.numeroloji), /Kişisel Yıl/); if (b) b.click(); }, 21.9);
  caption('05-numeroloji');

  /* ---------- 6. Burç dosyası: gravür, sonra karakter ---------- */
  dip(23.0);
  show('burc', 23.0);
  tl.add(() => { const s = SC.burc; F(s).kaydir(Math.round(topY(doc(s), byText(doc(s), 'Kısım I · Karakter'))) - (H ? 60 : 70), 1.4); }, 24.0);
  caption('06-burc');

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
    { t: 3.0, type: 'hit', g: 0.85 }, { t: 3.0, type: 'sub', g: 0.7 },
    ...[3.7, 4.7, 5.7].flatMap((t) => [{ t, type: 'click', g: 0.6 }, { t: t + 0.02, type: 'whoosh', d: 0.6, g: 0.3, lo: 400, hi: 2200 }]),
    { t: 3.35, type: 'tick', g: 0.35 },
    { t: 6.74, type: 'whoosh', d: 0.55, g: 0.28 }, { t: 7.0, type: 'sub', g: 0.5 },
    { t: 7.35, type: 'tick', g: 0.35 }, { t: 8.3, type: 'click', g: 0.6 }, { t: 9.6, type: 'click', g: 0.6 },
    { t: 8.32, type: 'shimmer', g: 0.25 }, { t: 9.62, type: 'shimmer', g: 0.25 },
    { t: 10.74, type: 'whoosh', d: 0.55, g: 0.28 },
    { t: 11.35, type: 'tick', g: 0.35 },
    ...[11.9, 13.3].flatMap((t) => [{ t, type: 'click', g: 0.6 }, { t: t + 0.02, type: 'shimmer', g: 0.25 }]),
    { t: 14.74, type: 'whoosh', d: 0.55, g: 0.28 },
    { t: 15.35, type: 'tick', g: 0.35 }, { t: 15.9, type: 'click', g: 0.6 }, { t: 17.3, type: 'click', g: 0.6 },
    { t: 18.74, type: 'whoosh', d: 0.55, g: 0.28 },
    { t: 19.0, type: 'hit', g: 0.55 }, { t: 19.35, type: 'tick', g: 0.35 },
    ...[19.7, 19.82, 19.94, 20.06].map((t) => ({ t, type: 'tick', g: 0.3 })), { t: 20.1, type: 'shimmer', g: 0.3 },
    { t: 20.9, type: 'click', g: 0.6 }, { t: 21.9, type: 'click', g: 0.6 },
    { t: 22.84, type: 'whoosh', d: 0.4, g: 0.35 },
    { t: 23.6, type: 'tick', g: 0.35 }, { t: 24.0, type: 'whoosh', d: 1.4, g: 0.3, lo: 300, hi: 1800 },
    { t: 26.0, type: 'hit', g: 1.0 }, { t: 26.0, type: 'sub', g: 1.0 },
    { t: 26.3, type: 'whoosh', d: 1.1, g: 0.4, lo: 500, hi: 3200 },
    { t: 26.25, type: 'shimmer', g: 0.55 }, { t: 27.42, type: 'chime', g: 0.45 },
    { t: 27.6, type: 'tick', g: 0.35 },
  ];

  window.__filmStart = () => { tl.play(0); };
  status('hazır');
  window.__filmReady = true;
})().catch((e) => { window.__filmDurum = `HATA: ${e.message}`; console.error(e); });
