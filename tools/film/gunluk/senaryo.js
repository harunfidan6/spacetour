// SpaceTour TR · günlük Reels (21 sn, dikey, müzik + efekt). Yönetmen: tek bir duraklatılmış GSAP timeline.
// Kayıt: FILM_GL=swiftshader node tools/film/record.mjs v gunluk  (Windows'ta FILM_GL gerekmez)
// Sahne sitenin gerçek ana sayfasıdır (iframe ?film=1); yazılardaki sayılar çekim anında sayfadan okunur.
//
//  0.0  Açılış: canlı 3D Güneş Sistemi, "EVREN hiç durmaz."
//  5.6  Bu gece: Ay evresi, özet ve Ay kadranı              · AY %x, evre.
//  9.6  Günün bilgisi: Ay burcu, gün doğumu/batımı, ISS      · AY BAŞAK'TA bugün.
// 12.0  Günlük burç: 12 burcun bugünkü başlığı               · BURCUN ne diyor?
// 16.0  Yaklaşan gök olayları                                · 13 GÜN kaldı.
// 18.5  Kapanış: logo, "Evren hiç durmaz.", spacetour.com.tr
(async () => {
  const G = window.gsap;
  document.body.classList.add('fmt-v');
  const W = 540, HH = 960, VW = 540, VH = 960;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms)); // sanal saat
  const status = (s) => { window.__filmDurum = s; };
  async function waitFor(fn, label, max = 120000) {
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

  const TEXT = await fetch('/film/gunluk/metin.json').then((r) => r.json());
  const LINE = Object.fromEntries(TEXT.satirlar.map((l) => [l.id, l]));

  // Sitenin yazı tipleri ve .doc-* sınıfları
  const home = new DOMParser().parseFromString(await fetch('/').then((r) => r.text()), 'text/html');
  await Promise.all($$('link[rel=stylesheet]', home).map((l) => new Promise((res) => {
    const n = document.createElement('link');
    n.rel = 'stylesheet'; n.href = l.getAttribute('href'); n.onload = n.onerror = res;
    document.head.prepend(n);
  })));
  document.documentElement.className = home.documentElement.className;

  /* ---------- Sahne: ana sayfa ---------- */
  const f = document.createElement('iframe');
  f.src = '/?film=1'; f.width = VW; f.height = VH;
  $('#frames').append(f);
  const win = () => f.contentWindow, doc = () => f.contentDocument, F = () => f.contentWindow.__film;
  await waitFor(() => F() && F().hazir(), 'ana sayfa yükleniyor');
  await waitFor(() => $$('main canvas', doc()).length > 0, '3D sahne');
  // Tembel görseller ve kaydırmayla açılan öğeler: sayfayı bir kez baştan sona gez
  for (const sel of ['section[aria-labelledby="bu-gece"]', 'section[aria-label="Bugün gökyüzü"]', '#burclar', 'section[aria-labelledby="olaylar"]', '#bolumler']) {
    F().kaydir(sel, 0, 0); await sleep(500);
  }
  F().kaydir(0, 0);
  await sleep(800);
  await waitFor(() => F().hazir(), 'görseller');
  await Promise.all([...document.fonts].map((x) => x.load().catch(() => {})));
  await sleep(4000); // 3D dokular yerine otursun, sahne canlansın

  /* ---------- Günün verisi: sayfadan oku ---------- */
  const d = doc();
  const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  const hero = $('section[aria-labelledby="evren"]', d);
  const dds = $$('dd', hero);
  const ay = txt($('.doc-title', dds[0])).replace('%', '');
  const evre = txt($$('.doc-kicker', dds[0]).pop());
  const gun = txt($('.doc-title', dds[1]));
  const olay = txt($('.truncate', dds[1]));
  const tarih = txt($('section[aria-labelledby="bu-gece"] p span', d));
  const ayburc = txt($$('section[aria-label="Bugün gökyüzü"] a', d)[0]?.querySelectorAll(':scope > span')[1]);
  const fill = (s) => (s || '').replace('{ay}', ay).replace('{evre}', evre.toLocaleLowerCase('tr-TR')).replace('{gun}', gun)
    .replace('{olay}', olay).replace('{tarih}', tarih).replace('{ayburc}', ayburc);
  for (const l of TEXT.satirlar) for (const k of ['kunye', 'kunye2', 'metin', 'serif']) if (l[k]) l[k] = fill(l[k]);
  status(`veri: ay %${ay} ${evre} · ${ayburc} · ${gun} ${olay} · ${tarih}`);

  /* ---------- Yazı yardımcıları ---------- */
  const chars = (t) => [...t].map((c) => `<span class="ch">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  function fit(el, sel, maxW, maxPx) {
    const lines = $$(sel, el);
    let px = maxPx;
    el.style.fontSize = `${px}px`;
    const widest = () => Math.max(...lines.map((l) => l.firstElementChild.getBoundingClientRect().width));
    for (let i = 0; i < 40 && widest() > maxW; i++) { px *= 0.95; el.style.fontSize = `${px}px`; }
  }

  const tl = G.timeline({ paused: true });
  const tops = $('#tops'), topshade = $('#topshade');
  const G0 = 30;

  function caption(id) {
    const L = LINE[id], t0 = L.t, t1 = L.t + L.sure;
    const el = document.createElement('div');
    el.className = 'top';
    el.style.setProperty('--acc', L.renk);
    el.innerHTML = `<div class="kick"><span class="k-no doc-kicker" style="color:${L.renk}">${L.kunye}</span><span class="k-rule"></span><span class="k-name doc-kicker">${L.kunye2}</span></div>`
      + `<div class="t-title doc-title"><span class="ln ln1"><span class="in">${chars(L.metin)}</span></span><span class="ln ln2 doc-serif"><span class="in">${chars(L.serif)}</span></span></div>`;
    tops.append(el);
    fit($('.t-title', el), '.ln', W - G0 * 2, 50);
    G.set(el, { autoAlpha: 0 });
    tl.to(topshade, { opacity: 1, duration: 0.4, ease: 'power2.out' }, t0 - 0.15)
      .set(el, { autoAlpha: 1 }, t0)
      .fromTo($('.k-rule', el), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' }, t0)
      .fromTo($$('.kick .doc-kicker', el), { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, t0 + 0.05)
      .fromTo($$('.ln1 .ch', el), { yPercent: 118 }, { yPercent: 0, duration: 0.75, stagger: 0.028, ease: 'expo.out' }, t0 + 0.12)
      .fromTo($$('.ln2 .ch', el), { yPercent: 118 }, { yPercent: 0, duration: 0.75, stagger: 0.026, ease: 'expo.out' }, t0 + 0.26)
      .to(el, { autoAlpha: 0, y: -10, duration: 0.25, ease: 'power2.in' }, t1 - 0.25)
      .to(topshade, { opacity: 0, duration: 0.3, ease: 'power2.in' }, t1 - 0.22);
  }
  const dip = (t, dd = 0.16) => tl.to('#dip', { opacity: 1, duration: dd, ease: 'power1.in' }, t - dd).to('#dip', { opacity: 0, duration: 0.3, ease: 'power1.out' }, t + 0.02);
  const go = (t, target, dur, ofset = 0) => tl.add(() => F().kaydir(target, dur, ofset), t);

  /* ---------- 0. Açılış: canlı Güneş Sistemi ---------- */
  {
    const sway = { x: 0.5, y: 0.45 };
    const point = () => win().dispatchEvent(new (win().PointerEvent)('pointermove', { clientX: sway.x * VW, clientY: sway.y * VH }));
    G.set('#dip', { opacity: 1 });
    tl.add(point, 0)
      .to('#dip', { opacity: 0, duration: 0.5, ease: 'power1.out' }, 0.05)
      .to(sway, { x: 0.22, y: 0.3, duration: 5.2, ease: 'sine.inOut', onUpdate: point }, 0.1);
  }

  /* ---------- 1. Bu gece ---------- */
  go(5.55, 'section[aria-labelledby="bu-gece"]', 1.1, 110);
  tl.set('#chip', { autoAlpha: 1 }, 5.6).fromTo('#chip', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 5.6)
    .to('#botshade', { opacity: 1, duration: 0.5 }, 5.6).to('#botshade', { opacity: 0, duration: 0.2 }, 18.3);
  tl.add(() => { const s = $('section[aria-labelledby="bu-gece"] figure', doc()); if (s) F().kaydir(Math.round(s.getBoundingClientRect().top + win().scrollY - 230), 2.0); }, 7.4);
  caption('1-bugece');

  /* ---------- 2. Günün bilgisi ---------- */
  go(9.55, 'section[aria-label="Bugün gökyüzü"]', 1.0, 240);
  caption('2-gun');

  /* ---------- 3. Günlük burç: 12 burç aşağı doğru akar ---------- */
  go(11.95, '#burclar', 1.0, 110); // sayfanın kendi başlığı üst gölgenin altında kalsın: tek başlık
  tl.add(() => { const g = $('#burclar', doc()); if (g) F().kaydir(Math.round(g.getBoundingClientRect().top + win().scrollY - 110 + 880), 2.6); }, 13.15);
  caption('3-burc');

  /* ---------- 4. Yaklaşan gök olayları ---------- */
  go(15.95, 'section[aria-labelledby="olaylar"]', 1.0, 200);
  caption('4-olay');

  /* ---------- 5. Kapanış ---------- */
  const E = 18.5;
  {
    const L = LINE['5-son'];
    $('#chip .c-date').textContent = tarih;
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
    // Kapanış yıldız alanı
    const c = $('#end canvas.stars'), x = c.getContext('2d');
    c.width = W * 2; c.height = HH * 2;
    let sd = 29; const r = () => ((sd = (Math.imul(sd, 1664525) + 1013904223) >>> 0) / 4294967296);
    const stars = Array.from({ length: 520 }, () => ({ x: r() * 2 - 1, y: r() * 2 - 1, z: 0.05 + r() * 0.95, m: 0.35 + r() * 0.65, w: r() < 0.18 }));
    const st = { on: false, speed: 0.03 }; let last = performance.now();
    (function draw() {
      requestAnimationFrame(draw);
      const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!st.on) return;
      x.fillStyle = '#050508'; x.fillRect(0, 0, c.width, c.height);
      const cx = c.width / 2, cy = c.height * 0.46, k = Math.max(c.width, c.height) * 0.42;
      for (const p of stars) {
        p.z -= dt * st.speed; if (p.z < 0.04) p.z += 0.96;
        const px = cx + (p.x / p.z) * k, py = cy + (p.y / p.z) * k;
        if (px < -4 || py < -4 || px > c.width + 4 || py > c.height + 4) continue;
        const near = 1 - p.z, a = Math.min(1, 0.3 + near * 1.3) * p.m;
        x.fillStyle = p.w ? `rgba(255,214,150,${a})` : `rgba(226,232,255,${a})`;
        x.beginPath(); x.arc(px, py, 0.8 + near * near * 3.2 * p.m, 0, 6.2832); x.fill();
      }
    })();
    dip(E, 0.22);
    tl.add(() => { st.on = true; }, E - 0.1)
      .set('#end', { autoAlpha: 1 }, E)
      .to('#chip', { autoAlpha: 0, duration: 0.2 }, E - 0.2)
      .fromTo('#end .e-glow', { opacity: 0, scale: 0.55 }, { opacity: 1, scale: 1, duration: 2.2, ease: 'power2.out' }, E)
      .to('#end .l-bg', { scale: 1, duration: 0.7, ease: 'expo.out' }, E)
      .to('#end .l-ring', { strokeDashoffset: 0, duration: 1.0, ease: 'expo.inOut' }, E + 0.12)
      .to('#end .l-sun', { scale: 1, duration: 1.0, ease: 'elastic.out(1, 0.55)' }, E + 0.22)
      .to(planet, { opacity: 1, duration: 0.2 }, E + 0.3)
      .to(orbit, { a: 0, duration: 1.15, ease: 'power3.out', onUpdate: place }, E + 0.3)
      .fromTo('#end .e-word', { autoAlpha: 0, y: 18, letterSpacing: '0.06em' }, { autoAlpha: 1, y: 0, letterSpacing: '-0.035em', duration: 1.1, ease: 'expo.out' }, E + 0.5)
      .fromTo('#end .e-slogan .w1 .ch', { yPercent: 118 }, { yPercent: 0, duration: 0.8, stagger: 0.04, ease: 'expo.out' }, E + 0.75)
      .fromTo('#end .e-slogan .w2 .ch', { yPercent: 118 }, { yPercent: 0, duration: 0.8, stagger: 0.03, ease: 'expo.out' }, E + 0.93)
      .fromTo('#end .u-rule', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' }, E + 1.3)
      .fromTo('#end .u-text', { autoAlpha: 0, letterSpacing: '0.6em' }, { autoAlpha: 1, letterSpacing: '0.3em', duration: 0.9, ease: 'expo.out' }, E + 1.38)
      .fromTo('#end .e-credit', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, E + 1.6)
      .to('#end .e-logo', { scale: 1.035, duration: 2.4, ease: 'sine.inOut', transformOrigin: '50% 50%' }, E + 1.2);
  }

  /* ---------- Ses ---------- */
  window.__filmMeta = { cuts: [0.2, 5.6, 9.6, 12.0, 14.0, 16.0, 18.5], end: 21 };
  window.__sfx = [
    { t: 0.1, type: 'hit', g: 0.7 }, { t: 0.1, type: 'sub', g: 0.7 }, { t: 0.4, type: 'shimmer', g: 0.35 },
    ...[5.5, 9.5, 11.9, 15.9].map((t) => ({ t, type: 'whoosh', d: 0.9, g: 0.4, lo: 200, hi: 1600 })),
    ...[5.85, 9.85, 12.25, 16.2].map((t) => ({ t, type: 'tick', g: 0.35 })),
    ...[12.5, 13.3, 14.1, 14.9].map((t) => ({ t, type: 'swipe', g: 0.25 })),
    ...[16.5, 16.65].map((t, i) => ({ t, type: 'blip', g: 0.35, p: i ? 1.5 : 1 })),
    { t: 18.5, type: 'hit', g: 1.0 }, { t: 18.5, type: 'sub', g: 0.9 },
    { t: 18.75, type: 'shimmer', g: 0.5 }, { t: 19.9, type: 'chime', g: 0.45 },
  ];

  window.__filmStart = () => { F().kaydir(0, 0); tl.play(0); };
  status('hazır');
  window.__filmReady = true;
})().catch((e) => { window.__filmDurum = `HATA: ${e.message}`; console.error(e); });
