import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const framesDir = path.resolve('temp_cinematic_frames');
const artifactDir = 'C:\\Users\\asus\\.gemini\\antigravity\\brain\\7506e3c1-2152-463d-8144-cc082ab2514f';
const outputVideoPublic = path.resolve('public/AstroTR_Sinematik_Tanitim.mp4');
const outputVideoArtifact = path.join(artifactDir, 'AstroTR_Sinematik_Tanitim.mp4');
const audioTrackPath = path.resolve('temp_soundtrack.m4a');

// Perfectionist broadcast HUD overlay script (Hides all dev badges and renders crisp cinematic lower-thirds)
const HUD_SCRIPT = `
(function() {
  // Hide Next.js dev overlays completely
  const devStyle = document.createElement('style');
  devStyle.innerHTML = \`
    nextjs-portal, [data-nextjs-toast], [data-nextjs-dialog-overlay], #__next-build-watcher {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }
  \`;
  document.head.appendChild(devStyle);

  if (document.getElementById('cinematic-hud-root')) return;

  const style = document.createElement('style');
  style.id = 'cinematic-hud-style';
  style.innerHTML = \`
    #cinematic-hud-root {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 999999;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      color: #efece6;
      box-sizing: border-box;
    }
    .hud-letterbox-top {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 42px;
      background: linear-gradient(180deg, rgba(6,6,18,0.92) 0%, rgba(6,6,18,0) 100%);
      border-bottom: 1px solid rgba(239,236,230,0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      font-size: 11px;
      letter-spacing: 0.12em;
    }
    .hud-letterbox-bottom {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 54px;
      background: linear-gradient(0deg, rgba(6,6,18,0.95) 0%, rgba(6,6,18,0) 100%);
      border-top: 1px solid rgba(239,236,230,0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      font-size: 11px;
    }
    .hud-rec-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #d4ff3d;
      margin-right: 10px;
      box-shadow: 0 0 12px #d4ff3d;
      animation: hudPulse 1.2s infinite ease-in-out;
    }
    @keyframes hudPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.35; transform: scale(0.8); }
    }
    .hud-bracket {
      position: absolute;
      width: 20px;
      height: 20px;
      border-color: rgba(255,107,53,0.8);
      border-style: solid;
      pointer-events: none;
    }
    .hud-b-tl { top: 52px; left: 32px; border-width: 2px 0 0 2px; }
    .hud-b-tr { top: 52px; right: 32px; border-width: 2px 2px 0 0; }
    .hud-b-bl { bottom: 64px; left: 32px; border-width: 0 0 2px 2px; }
    .hud-b-br { bottom: 64px; right: 32px; border-width: 0 2px 2px 0; }

    .hud-chapter-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(14,14,32,0.92);
      border: 1px solid rgba(212,255,61,0.5);
      padding: 6px 16px;
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 24px rgba(0,0,0,0.7);
    }
    .hud-chapter-tag {
      background: #d4ff3d;
      color: #060614;
      font-weight: 900;
      font-size: 11px;
      padding: 2px 8px;
      letter-spacing: 0.12em;
    }
    .hud-chapter-text {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.05em;
    }
    .hud-timecode {
      font-variant-numeric: tabular-nums;
      color: #ffd700;
      font-weight: 700;
      letter-spacing: 0.1em;
    }
    .hud-flash-overlay {
      position: absolute;
      inset: 0;
      background: #ffffff;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease-out;
    }
  \`;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'cinematic-hud-root';
  root.innerHTML = \`
    <div class="hud-letterbox-top">
      <div style="display:flex; align-items:center;">
        <span class="hud-rec-dot"></span>
        <span style="font-weight:800; color:#d4ff3d; margin-right:14px;">CANLI YAYIN // 60 FPS</span>
        <span style="color:rgba(239,236,230,0.75);">SPACETOUR.TR · KİNETİK UZAY ATLASI</span>
      </div>
      <div style="color:rgba(239,236,230,0.65); font-size:10px;">
        KOORDİNAT: 41°00'N 28°58'E · OPTİK SİSTEM: NOMİNAL
      </div>
    </div>

    <div class="hud-bracket hud-b-tl"></div>
    <div class="hud-bracket hud-b-tr"></div>
    <div class="hud-bracket hud-b-bl"></div>
    <div class="hud-bracket hud-b-br"></div>

    <div class="hud-letterbox-bottom">
      <div class="hud-chapter-card" id="hudChapterBox">
        <span class="hud-chapter-tag" id="hudChapterTag">ACT 01</span>
        <span class="hud-chapter-text" id="hudChapterText">GÜNEŞ SİSTEMİ ORRERY (3D HAREKET)</span>
      </div>
      <div style="display:flex; align-items:center; gap:24px;">
        <span style="font-size:10px; color:#ff9f43; font-weight:600;">IAU J2000 EPHEMERIS ACTIVE</span>
        <span class="hud-timecode" id="hudTimecode">TC 00:00:00:00</span>
      </div>
    </div>

    <div class="hud-flash-overlay" id="hudFlash"></div>
  \`;
  document.body.appendChild(root);

  window.__updateCinematicHUD = function(actTag, actText, timecodeStr) {
    const tagEl = document.getElementById('hudChapterTag');
    const textEl = document.getElementById('hudChapterText');
    const tcEl = document.getElementById('hudTimecode');
    if (tagEl) tagEl.textContent = actTag;
    if (textEl) textEl.textContent = actText;
    if (tcEl && timecodeStr) tcEl.textContent = timecodeStr;
  };

  window.__triggerSceneFlash = function() {
    const flash = document.getElementById('hudFlash');
    if (!flash) return;
    flash.style.opacity = '0.5';
    setTimeout(() => { flash.style.opacity = '0'; }, 180);
  };
})();
`;

async function main() {
  console.log('=== SPACETOUR TR CINEMATIC VIDEO PRODUCTION (V2 MASTER) ===');

  if (fs.existsSync(framesDir)) {
    fs.rmSync(framesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(framesDir, { recursive: true });

  console.log('1. Launching Google Chrome (1920x1080 Full HD, Angle WebGL)...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: [
      '--window-size=1920,1080',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--use-gl=angle',
      '--ignore-gpu-blocklist',
    ],
    defaultViewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1
    }
  });

  const page = await browser.newPage();
  let frameIndex = 0;
  const FPS = 25;

  async function snap(count = 1, delayMs = 35) {
    for (let c = 0; c < count; c++) {
      const tcSeconds = Math.floor(frameIndex / FPS);
      const tcFrames = frameIndex % FPS;
      const tcMin = String(Math.floor(tcSeconds / 60)).padStart(2, '0');
      const tcSec = String(tcSeconds % 60).padStart(2, '0');
      const tcFr = String(tcFrames).padStart(2, '0');
      const timecode = `TC 00:${tcMin}:${tcSec}:${tcFr}`;

      await page.evaluate((tc) => {
        const el = document.getElementById('hudTimecode');
        if (el) el.textContent = tc;
      }, timecode);

      const filename = path.join(framesDir, `frame_${String(frameIndex).padStart(5, '0')}.jpg`);
      const buffer = await page.screenshot({ type: 'jpeg', quality: 88 });
      fs.writeFileSync(filename, buffer);
      frameIndex++;
      if (delayMs > 0) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
  }

  async function setChapter(actTag, actText) {
    await page.evaluate(HUD_SCRIPT);
    await page.evaluate((tag, text) => {
      if (window.__updateCinematicHUD) window.__updateCinematicHUD(tag, text);
      if (window.__triggerSceneFlash) window.__triggerSceneFlash();
    }, actTag, actText);
  }

  // =========================================================================
  // ACT 1: COLD OPEN & 3D SOLAR SYSTEM ORRERY (http://localhost:3000)
  // =========================================================================
  console.log('2. Act 1: Cold Open & 3D Solar System Orrery...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3400));
  await setChapter('ACT 01', 'KİNETİK GÜNEŞ SİSTEMİ · 3D ORRERY & CANLI EFEMERİS');

  // Hero still frame
  await snap(20, 25);

  // Smooth mouse exploration across planetary orbits
  await page.mouse.move(960, 540);
  await snap(15, 25);
  await page.mouse.move(1180, 520, { steps: 8 });
  await snap(20, 25);
  await page.mouse.move(1480, 680, { steps: 12 });
  await snap(25, 25);

  // Focus callout: Moon phase & upcoming astronomical countdown
  await page.mouse.move(1050, 930, { steps: 10 });
  await snap(25, 25);

  // =========================================================================
  // ACT 2: VOYAGE & SPACE FLIGHT (WARP ERADICATED - PURE ORBITAL FOCUS)
  // =========================================================================
  console.log('3. Act 2: Clean Orbital Voyage (Arcade Warp Eradicated)...');
  await setChapter('ACT 02', 'ORBİTAL YOLCULUK MOTORU · GERÇEKÇİ HEDEF ODAKLAMA');

  // Smooth scroll down to Quick Navigation & Voyage
  for (let i = 0; i < 22; i++) {
    await page.evaluate(() => window.scrollBy(0, 38));
    await snap(1, 15);
  }
  await snap(20, 25);

  // Scroll into the 3D Space Flight Canvas
  for (let i = 0; i < 26; i++) {
    await page.evaluate(() => window.scrollBy(0, 42));
    await snap(1, 15);
  }
  await snap(25, 25);

  // Telemetry controls
  await page.mouse.move(960, 600, { steps: 8 });
  await snap(30, 25);

  // =========================================================================
  // ACT 3: GÖKKUBBE / PLANETARIUM 3D (/harita)
  // =========================================================================
  console.log('4. Act 3: Gökkubbe / Planetarium 3D (Milky Way & Alt-Azimuth Horizon)...');
  await page.goto('http://localhost:3000/harita', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await setChapter('ACT 03', '360° PLANETARYUM · SAMANYOLU TOZ KUŞAĞI & ALT-AZ UFUK');

  await snap(18, 25);

  // Scroll into full 3D celestial sky dome
  for (let i = 0; i < 16; i++) {
    await page.evaluate(() => window.scrollBy(0, 32));
    await snap(1, 15);
  }
  await snap(20, 25);

  // 360° Interactive Orbit Drag on the Celestial Sky Dome
  const skyCanvas = await page.$('canvas');
  if (skyCanvas) {
    const box = await skyCanvas.boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      for (let s = 0; s < 35; s++) {
        await page.mouse.move(cx + s * 14, cy - Math.sin(s * 0.1) * 20, { steps: 2 });
        await snap(1, 15);
      }
      await page.mouse.up();
      await snap(25, 25);
    }
  }

  // =========================================================================
  // ACT 4: ASTROLOJİ & 360° INTERACTIVE NATAL CHART WHEEL (/astroloji)
  // =========================================================================
  console.log('5. Act 4: Astroloji & 360° Interactive Natal Wheel (/astroloji)...');
  await page.goto('http://localhost:3000/astroloji', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await setChapter('ACT 04', 'ZODYAK ATLASI · 360° DOĞUM HARİTASI & AÇI ŞEBEKESİ');
  await snap(18, 25);

  // Scroll into the 360° Natal Wheel & Aspect Network
  for (let i = 0; i < 22; i++) {
    await page.evaluate(() => window.scrollBy(0, 36));
    await snap(1, 15);
  }
  await snap(25, 25);

  // Interactive Hovering over Natal Chart Wheel Planets & Aspect Lines
  const natalSvg = await page.$('svg');
  if (natalSvg) {
    const box = await natalSvg.boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;

      await page.mouse.move(cx - 120, cy, { steps: 6 });
      await snap(20, 25);

      await page.mouse.move(cx, cy - 120, { steps: 6 });
      await snap(20, 25);

      await page.mouse.move(cx + 90, cy - 60, { steps: 6 });
      await snap(25, 25);
    }
  }

  // Scroll down to Günlük Kozmik Transitler with VectorMoonPhase
  await setChapter('ACT 04.2', 'KOZMİK TRANSİTLER · VEKTÖREL AY FAZI & GEZEGEN GLİFLERİ');
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollBy(0, 40));
    await snap(1, 15);
  }
  await snap(25, 25);

  // Scroll down to Cosmic Tarot with sacred geometry engravings
  await setChapter('ACT 04.3', 'KOZMİK TAROT · ÖZGÜN TEKNİK GRAVÜR KARTLARI');
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollBy(0, 42));
    await snap(1, 15);
  }
  await snap(25, 25);

  // =========================================================================
  // ACT 5: ANSIKLOPEDİ & CONSTELLATION ASTERISMS (/ansiklopedi)
  // =========================================================================
  console.log('6. Act 5: Ansiklopedi & Custom Constellation Asterisms (/ansiklopedi)...');
  await page.goto('http://localhost:3000/ansiklopedi', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await setChapter('ACT 05', 'KOZMİK ARŞİV · GEZEGENLER & ÖZGÜN TAKIMYILDIZ ASTERİZMLERİ');
  await snap(18, 25);

  // Scroll down through planet cards into the constellation grid
  for (let i = 0; i < 35; i++) {
    await page.evaluate(() => window.scrollBy(0, 45));
    await snap(1, 15);
  }
  await snap(35, 25);

  // =========================================================================
  // ACT 6: FINALE & HERO OUTRO
  // =========================================================================
  console.log('7. Act 6: Finale & Outro...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3400));
  await setChapter('FINALE', 'SPACETOUR.TR // TÜM SİSTEMLER OPERASYONEL');

  for (let i = 0; i < 15; i++) {
    await page.evaluate(() => window.scrollBy(0, 15));
    await snap(1, 25);
  }
  await snap(35, 25);

  console.log(`Successfully captured ${frameIndex} frames!`);
  await browser.close();

  // =========================================================================
  // 8. SYNTHESIZE ATMOSPHERIC COSMIC SOUNDTRACK
  // =========================================================================
  console.log('8. Synthesizing atmospheric cosmic soundtrack with FFmpeg...');
  const totalDurationSeconds = Math.ceil(frameIndex / FPS);
  console.log(`Video duration: ${totalDurationSeconds} seconds.`);

  const audioCmd = `ffmpeg -y -f lavfi -i "sine=frequency=55:duration=${totalDurationSeconds}" -f lavfi -i "sine=frequency=110:duration=${totalDurationSeconds}" -filter_complex "[0:a]volume=0.3[a0];[1:a]volume=0.15[a1];[a0][a1]amix=inputs=2,afade=t=in:ss=0:d=1.5,afade=t=out:st=${totalDurationSeconds - 2}:d=2[out]" -map "[out]" -c:a aac -b:a 192k "${audioTrackPath}"`;
  execSync(audioCmd, { stdio: 'inherit' });
  console.log('Cosmic soundtrack generated!');

  // =========================================================================
  // 9. FINAL MULTIPLEX & ENCODE (VIDEO + AUDIO)
  // =========================================================================
  console.log('9. Merging 1080p frames + audio into final high-bitrate MP4...');
  const mergeCmd = `ffmpeg -y -framerate ${FPS} -i "temp_cinematic_frames/frame_%05d.jpg" -i "${audioTrackPath}" -c:v libx264 -pix_fmt yuv420p -b:v 6500k -preset medium -c:a copy -shortest "${outputVideoPublic}"`;
  execSync(mergeCmd, { stdio: 'inherit' });

  // Copy to artifact directory
  fs.copyFileSync(outputVideoPublic, outputVideoArtifact);
  console.log('=== VIDEO PRODUCTION COMPLETE! ===');
  console.log(`- Public URL: http://localhost:3000/AstroTR_Sinematik_Tanitim.mp4`);
  console.log(`- Local Path: ${outputVideoPublic}`);
  console.log(`- Artifact Path: ${outputVideoArtifact}`);

  // Cleanup temp files
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.rmSync(audioTrackPath, { force: true });
  console.log('Cleaned up temporary frame caches.');
}

main().catch(err => {
  console.error('Video production error:', err);
  process.exit(1);
});
