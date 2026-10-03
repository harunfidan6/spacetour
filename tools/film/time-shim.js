// Sanal zaman: kayıt sırasında her sayfada (iframe dahil) bütün kodlardan önce çalışır.
// Zaman yalnızca window.__advance(ms) çağrılınca ilerler; böylece her kare aynı aralıkla, takılmadan çekilir.
// Referans sürüme (docs/video-motoru/referans/time-shim.js) eklenenler:
//  - Takvim sabit: Date.now() ve argümansız new Date() sabit bir başlangıç anından sayar (__filmEpoch).
//    Gökyüzü, Ay evresi, geri sayımlar her çekimde aynı çıkar.
//  - Math.random tohumludur (yıldız alanı, parçacıklar her çekimde aynı).
//  - WebGL bağlamları preserveDrawingBuffer ile açılır (siteye dokunmadan ekran görüntüsünde boş canvas olmaz).
//  - data-hold niteliği taşıyan iframe'ler bekletilir: zamanları sahneleri gelene kadar ilerlemez.
(() => {
  if (window.__advance) return;
  let now = 0;
  const EPOCH = typeof window.__filmEpoch === 'number' ? window.__filmEpoch : Date.now();

  // Tohumlu rastgele (mulberry32)
  let seed = 20261003;
  Math.random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // Sanal takvim
  const RealDate = Date;
  function FilmDate(...a) {
    if (!new.target) return new RealDate(EPOCH + now).toString();
    return a.length ? new RealDate(...a) : new RealDate(EPOCH + now);
  }
  FilmDate.prototype = RealDate.prototype;
  FilmDate.now = () => EPOCH + now;
  FilmDate.parse = RealDate.parse;
  FilmDate.UTC = RealDate.UTC;
  window.Date = FilmDate;
  performance.now = () => now;

  // WebGL: kareyi ekran görüntüsüne kadar koru
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, attrs) {
    if (typeof type === 'string' && type.startsWith('webgl')) attrs = { ...(attrs || {}), preserveDrawingBuffer: true };
    return getContext.call(this, type, attrs);
  };

  const raf = new Map(); let rafId = 0;
  const timers = new Map(); let tid = 0;
  window.requestAnimationFrame = (cb) => { raf.set(++rafId, cb); return rafId; };
  window.cancelAnimationFrame = (id) => raf.delete(id);
  window.setTimeout = (cb, ms = 0, ...a) => { const id = ++tid; timers.set(id, { at: now + Math.max(0, +ms || 0), cb, a }); return id; };
  window.clearTimeout = (id) => timers.delete(id);
  window.setInterval = (cb, ms = 0, ...a) => {
    const id = ++tid, step = Math.max(1, +ms || 0);
    const tick = () => { timers.set(id, { at: now + step, cb: tick, a: [] }); cb(...a); };
    timers.set(id, { at: now + step, cb: tick, a: [] });
    return id;
  };
  window.clearInterval = window.clearTimeout;
  const runTimers = () => {
    for (let guard = 0; guard < 20000; guard++) {
      let best = null;
      for (const [id, t] of timers) if (t.at <= now && (!best || t.at < best[1].at || (t.at === best[1].at && id < best[0]))) best = [id, t];
      if (!best) return;
      timers.delete(best[0]);
      try { if (typeof best[1].cb === 'function') best[1].cb(...best[1].a); } catch (e) { console.error(e); }
    }
  };
  // CSS animasyon ve geçişleri de aynı sanal saatle ilerlesin
  const stepCss = (dt) => {
    try {
      for (const an of document.getAnimations()) {
        if (!an.__v) { an.__v = 1; an.pause(); }
        an.currentTime = (an.currentTime || 0) + dt;
      }
    } catch {}
  };
  window.__advance = (dt) => {
    now += dt;
    runTimers();
    const q = [...raf.values()]; raf.clear();
    for (const cb of q) { try { cb(now); } catch (e) { console.error(e); } }
    stepCss(dt);
    for (const f of document.querySelectorAll('iframe')) {
      if (f.hasAttribute('data-hold')) continue;
      try { if (f.contentWindow.__advance) f.contentWindow.__advance(dt); } catch {}
    }
  };
})();
