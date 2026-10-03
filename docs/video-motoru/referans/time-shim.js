// Sanal zaman: kayıt sırasında her sayfada (iframe dahil) en önce çalışır.
// Zaman yalnızca window.__advance(ms) çağrılınca ilerler; böylece her kare aynı aralıkla, takılmadan çekilir.
(() => {
  if (window.__advance) return;
  let now = 0;
  const base = Date.now();
  const raf = new Map(); let rafId = 0;
  const timers = new Map(); let tid = 0;
  performance.now = () => now;
  Date.now = () => base + now;
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
      try { best[1].cb(...best[1].a); } catch (e) { console.error(e); }
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
    for (const f of document.querySelectorAll('iframe')) { try { f.contentWindow.__advance && f.contentWindow.__advance(dt); } catch {} }
  };
})();
