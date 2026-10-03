import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\asus\\.gemini\\antigravity\\brain\\7506e3c1-2152-463d-8144-cc082ab2514f';
const FPS = 25;

// Document overlay script injected into pages
const DOC_OVERLAY_SCRIPT = `
(function() {
  if (document.getElementById('doc-overlay-root')) return;

  const style = document.createElement('style');
  style.id = 'doc-overlay-style';
  style.innerHTML = \`
    ::-webkit-scrollbar { display: none !important; }
    * { scrollbar-width: none !important; }

    #doc-overlay-root {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999999;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      opacity: 0;
      transition: opacity 0.35s ease;
    }
    .doc-vignette-top {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 90px;
      background: linear-gradient(180deg, rgba(5,5,8,0.85) 0%, rgba(5,5,8,0) 100%);
      pointer-events: none;
    }
    .doc-vignette-bottom {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 220px;
      background: linear-gradient(0deg, rgba(5,5,8,0.96) 0%, rgba(5,5,8,0.55) 50%, rgba(5,5,8,0) 100%);
      pointer-events: none;
    }
    .doc-lower-third {
      position: absolute;
      bottom: 42px;
      left: 54px;
      right: 54px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 32px;
    }
    .doc-title-block {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .doc-kicker-row {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .doc-kicker-text {
      font-family: 'Geist Mono', monospace;
      font-size: 13px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #F5C542;
      font-weight: 600;
    }
    .doc-kicker-line {
      width: 70px;
      height: 1px;
      background: linear-gradient(90deg, #F5C542, rgba(245,197,66,0.1));
    }
    .doc-heading-row {
      display: flex;
      align-items: baseline;
      gap: 12px;
      line-height: 0.95;
    }
    .doc-main-word {
      font-family: 'Archivo', var(--font-display, sans-serif);
      font-size: 54px;
      font-weight: 800;
      font-stretch: 118%;
      text-transform: uppercase;
      letter-spacing: -0.035em;
      color: #F4F3EE;
      text-shadow: 0 4px 24px rgba(0,0,0,0.8);
    }
    .doc-serif-word {
      font-family: 'Instrument Serif', var(--font-serif, serif);
      font-size: 60px;
      font-style: italic;
      font-weight: 400;
      text-transform: lowercase;
      letter-spacing: -0.015em;
      color: #F5C542;
      text-shadow: 0 4px 24px rgba(0,0,0,0.8);
    }
    .doc-credit-text {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(244, 243, 238, 0.65);
      margin-bottom: 6px;
      white-space: nowrap;
    }

    /* Vertical mode adjustments */
    .vertical .doc-lower-third {
      bottom: 160px;
      left: 40px;
      right: 40px;
      flex-direction: column;
      align-items: flex-start;
      gap: 18px;
    }
    .vertical .doc-main-word { font-size: 64px; }
    .vertical .doc-serif-word { font-size: 72px; }
    .vertical .doc-kicker-text { font-size: 15px; }
    .vertical .doc-credit-text { font-size: 13px; }

    /* Scene flash / fade transition */
    #doc-curtain {
      position: absolute;
      inset: 0;
      background: #050508;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
    }
  \`;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'doc-overlay-root';
  root.innerHTML = \`
    <div class="doc-vignette-top"></div>
    <div class="doc-vignette-bottom"></div>
    <div class="doc-lower-third">
      <div class="doc-title-block">
        <div class="doc-kicker-row">
          <span class="doc-kicker-text" id="docKicker">BÖLÜM 00 — BİR UZAY BELGESELİ</span>
          <span class="doc-kicker-line"></span>
        </div>
        <div class="doc-heading-row">
          <span class="doc-main-word" id="docMainWord">EVREN</span>
          <span class="doc-serif-word" id="docSerifWord">hiç durmaz.</span>
        </div>
      </div>
      <div class="doc-credit-text" id="docCredit">GÖRSEL · JPL / NASA</div>
    </div>
    <div id="doc-curtain"></div>
  \`;
  document.body.appendChild(root);

  window.__showDocOverlay = function(kicker, mainWord, serifWord, credit, isVertical = false) {
    const rootEl = document.getElementById('doc-overlay-root');
    if (!rootEl) return;
    if (isVertical) rootEl.classList.add('vertical');
    else rootEl.classList.remove('vertical');

    document.getElementById('docKicker').textContent = kicker;
    document.getElementById('docMainWord').textContent = mainWord;
    document.getElementById('docSerifWord').textContent = serifWord;
    document.getElementById('docCredit').textContent = credit;
    rootEl.style.opacity = '1';
  };

  window.__fadeCurtain = function(opacity) {
    const curtain = document.getElementById('doc-curtain');
    if (curtain) curtain.style.opacity = String(opacity);
  };
})();
`;

// Helper: render custom standalone HTML slate (Opening Title or Outro Logo)
function getOpeningSlateHtml(isVertical) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin:0; padding:0; box-sizing: border-box; }
    body {
      background: #050508;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #F4F3EE;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .kicker {
      font-family: 'Geist Mono', monospace;
      font-size: ${isVertical ? '18px' : '15px'};
      letter-spacing: 0.35em;
      color: #F5C542;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .rule {
      width: ${isVertical ? '140px' : '200px'};
      height: 2px;
      background: linear-gradient(90deg, transparent, #F5C542, transparent);
      margin-bottom: 32px;
    }
    .title {
      font-size: ${isVertical ? '72px' : '84px'};
      font-weight: 800;
      font-stretch: 118%;
      text-transform: uppercase;
      letter-spacing: -0.035em;
      line-height: 0.92;
      display: flex;
      align-items: baseline;
      gap: 16px;
    }
    .serif {
      font-family: 'Instrument Serif', serif;
      font-style: italic;
      font-weight: 400;
      text-transform: lowercase;
      color: #F5C542;
      font-size: ${isVertical ? '80px' : '94px'};
    }
    .sub {
      font-family: 'Geist Mono', monospace;
      font-size: ${isVertical ? '14px' : '12px'};
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: rgba(244,243,238,0.55);
      margin-top: 28px;
    }
  </style>
</head>
<body>
  <div class="kicker">BÖLÜM 00 — BİR UZAY BELGESELİ</div>
  <div class="rule"></div>
  <div class="title">
    <span>SPACETOUR</span>
    <span class="serif">atlası</span>
  </div>
  <div class="sub">YEDİ BÖLÜMLÜK SİNEMATİK GÖKYÜZÜ REHBERİ</div>
</body>
</html>
`;
}

function getOutroSlateHtml(isVertical) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin:0; padding:0; box-sizing: border-box; }
    body {
      background: #050508;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #F4F3EE;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      text-align: center;
      padding: 0 40px;
    }
    .logo-box {
      width: ${isVertical ? '96px' : '88px'};
      height: ${isVertical ? '96px' : '88px'};
      margin-bottom: 28px;
      filter: drop-shadow(0 0 35px rgba(245,197,66,0.3));
    }
    .brand-name {
      font-size: ${isVertical ? '64px' : '68px'};
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1;
    }
    .brand-name span { color: #F5C542; }
    .slogan {
      font-family: 'Instrument Serif', serif;
      font-style: italic;
      font-size: ${isVertical ? '44px' : '46px'};
      color: #F5C542;
      margin-top: 10px;
    }
    .rule {
      width: 260px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(245,197,66,0.8), transparent);
      margin: 32px 0 24px;
    }
    .url {
      font-family: 'Geist Mono', monospace;
      font-size: ${isVertical ? '22px' : '20px'};
      letter-spacing: 0.18em;
      color: #F4F3EE;
      font-weight: 600;
    }
    .credit {
      font-family: 'Geist Mono', monospace;
      font-size: ${isVertical ? '12px' : '11px'};
      letter-spacing: 0.08em;
      color: rgba(244,243,238,0.45);
      margin-top: 48px;
      max-width: ${isVertical ? '800px' : '700px'};
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="logo-box">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
      <rect width="64" height="64" rx="14" fill="#0B0B10" stroke="rgba(244,243,238,0.15)" stroke-width="1"/>
      <circle cx="32" cy="32" r="21" fill="none" stroke="#f4f3ee" stroke-opacity="0.55" stroke-width="2.2"/>
      <circle cx="32" cy="32" r="9.5" fill="#f59e0b"/>
      <circle cx="53" cy="32" r="5" fill="#38bdf8"/>
    </svg>
  </div>
  <div class="brand-name">Spacetour<span>.tr</span></div>
  <div class="slogan">Evren hiç durmaz.</div>
  <div class="rule"></div>
  <div class="url">spacetour.com.tr</div>
  <div class="credit">
    Görseller: NASA, ESA, CSA, STScI, ESO, Wikimedia Commons ve ilgili sahipleri. Bazı görseller CC BY / CC BY-SA lisanslıdır.<br>
    Bölüm 00–07 Atlası Şimdi Yayında.
  </div>
</body>
</html>
`;
}

async function recordShowcase(format = 'yatay') {
  const isVertical = format === 'dikey';
  const width = isVertical ? 1080 : 1920;
  const height = isVertical ? 1920 : 1080;
  const outputName = `spacetour_30s_${format}.mp4`;
  const outputPublic = path.resolve(`public/${outputName}`);
  const outputArtifact = path.join(artifactDir, outputName);
  const framesDir = path.resolve(`temp_frames_${format}`);
  const audioTrackPath = path.resolve(`temp_audio_${format}.m4a`);

  console.log(`\n======================================================`);
  console.log(`PRODUCING: ${outputName} (${width}x${height}, ${FPS} FPS)`);
  console.log(`======================================================\n`);

  if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: [
      `--window-size=${width},${height}`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--use-gl=angle',
      '--ignore-gpu-blocklist',
    ],
    defaultViewport: {
      width,
      height,
      deviceScaleFactor: 1,
    },
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(60000);
  let frameIndex = 0;

  async function snap(count = 1, delayMs = 30) {
    for (let c = 0; c < count; c++) {
      const filename = path.join(framesDir, `frame_${String(frameIndex).padStart(5, '0')}.jpg`);
      const buffer = await page.screenshot({ type: 'jpeg', quality: 90 });
      fs.writeFileSync(filename, buffer);
      frameIndex++;
      if (delayMs > 0) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
  }

  // Set sessionStorage bypass before page load
  async function preparePageBypass() {
    await page.evaluateOnNewDocument(() => {
      try {
        sessionStorage.setItem('spacetour:intro', '1');
      } catch (e) {}
    });
  }

  await preparePageBypass();

  // -------------------------------------------------------------------------
  // SCENE 1: (0.0s - 3.0s = 75 frames) OPENING SLATE
  // -------------------------------------------------------------------------
  console.log('[1/8] Scene 1: Opening Slate (0-3s)...');
  await page.setContent(getOpeningSlateHtml(isVertical), { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));
  await snap(75, 10);

  // -------------------------------------------------------------------------
  // SCENE 2: (3.0s - 7.0s = 100 frames) HOME HERO 3D ORRERY
  // -------------------------------------------------------------------------
  console.log('[2/8] Scene 2: Home Hero 3D Orrery "EVREN hiç durmaz." (3-7s)...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(DOC_OVERLAY_SCRIPT);
  await page.evaluate((isVert) => {
    window.__showDocOverlay('BÖLÜM 00 — GİRİŞ', 'EVREN', 'hiç durmaz.', 'JPL / NASA YÖRÜNGE ELEMANLARI', isVert);
  }, isVertical);
  // Snap 3D rotation in hero
  await snap(100, 25);

  // -------------------------------------------------------------------------
  // SCENE 3: (7.0s - 11.0s = 100 frames) PLANETARIUM 360° SKY MAP
  // -------------------------------------------------------------------------
  console.log('[3/8] Scene 3: Planetarium 360 "GÖĞÜ oku." (7-11s)...');
  await page.goto('http://localhost:3000/harita/planetaryum', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.evaluate(DOC_OVERLAY_SCRIPT);
  await page.evaluate((isVert) => {
    window.__showDocOverlay('BÖLÜM 01 — GÖK HARİTASI', 'GÖĞÜ', 'oku.', 'GÖRSEL · VLT LAZER REHBER YILDIZ / ESO', isVert);
  }, isVertical);

  // Smooth drag across the sky sphere
  const midX = width / 2;
  const midY = height / 2;
  await page.mouse.move(midX, midY);
  await page.mouse.down();
  for (let i = 0; i < 40; i++) {
    await page.mouse.move(midX - i * 6, midY - i * 2);
    await snap(2, 20);
  }
  await page.mouse.up();
  await snap(20, 20);

  // -------------------------------------------------------------------------
  // SCENE 4: (11.0s - 15.0s = 100 frames) OBSERVATORY SPECTRUM
  // -------------------------------------------------------------------------
  console.log('[4/8] Scene 4: Observatory Spectrum "GÖRÜNMEYENİ gör." (11-15s)...');
  await page.goto('http://localhost:3000/gozlemevi/spektrum', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.evaluate(DOC_OVERLAY_SCRIPT);
  await page.evaluate((isVert) => {
    window.__showDocOverlay('BÖLÜM 05 — GÖZLEMEVİ', 'GÖRÜNMEYENİ', 'gör.', 'GÖRSEL · NASA / ESA / CHANDRA / ALMA', isVert);
  }, isVertical);

  // Click multi-wavelength buttons if present or smooth pan
  for (let step = 0; step < 50; step++) {
    if (step === 15) {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const infraredBtn = btns.find(b => b.textContent?.includes('Kızılötesi') || b.textContent?.includes('Radyo'));
        infraredBtn?.click();
      });
    } else if (step === 32) {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const xrayBtn = btns.find(b => b.textContent?.includes('X-Işını') || b.textContent?.includes('Görünür'));
        xrayBtn?.click();
      });
    }
    await snap(2, 20);
  }

  // -------------------------------------------------------------------------
  // SCENE 5: (15.0s - 19.0s = 100 frames) BLACK HOLE ACCRETION DISK
  // -------------------------------------------------------------------------
  console.log('[5/8] Scene 5: Black Hole Lab "ZAMANI bük." (15-19s)...');
  await page.goto('http://localhost:3000/ansiklopedi/laboratuvar/kara-delik', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2400));
  await page.evaluate(DOC_OVERLAY_SCRIPT);
  await page.evaluate((isVert) => {
    window.__showDocOverlay('BÖLÜM 03 — ANSİKLOPEDİ', 'ZAMANI', 'bük.', 'GÖRSEL · EVENT HORIZON TELESCOPE / ESO', isVert);
  }, isVertical);

  // Smooth orbit around black hole canvas
  await page.mouse.move(midX, midY);
  await page.mouse.down();
  for (let i = 0; i < 40; i++) {
    await page.mouse.move(midX + Math.sin(i * 0.15) * 120, midY + Math.cos(i * 0.15) * 60);
    await snap(2, 20);
  }
  await page.mouse.up();
  await snap(20, 20);

  // -------------------------------------------------------------------------
  // SCENE 6: (19.0s - 23.0s = 100 frames) URANIA'S MIRROR ENGRAVINGS
  // -------------------------------------------------------------------------
  console.log('[6/8] Scene 6: Urania\'s Mirror Cards "YILDIZLARINI keşfet." (19-23s)...');
  await page.goto('http://localhost:3000/astroloji/burclar', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.evaluate(DOC_OVERLAY_SCRIPT);
  await page.evaluate((isVert) => {
    window.__showDocOverlay('BÖLÜM 04 — ASTROLOJİ', 'YILDIZLARINI', 'keşfet.', 'GÖRSEL · SIDNEY HALL, URANIA\'S MIRROR (1824)', isVert);
  }, isVertical);

  // Slow documentary glide down through the cards
  for (let i = 0; i < 50; i++) {
    await page.evaluate(() => window.scrollBy(0, 16));
    await snap(2, 20);
  }

  // -------------------------------------------------------------------------
  // SCENE 7: (23.0s - 26.5s = 88 frames) ISS LIVE TELEMETRY
  // -------------------------------------------------------------------------
  console.log('[7/8] Scene 7: ISS Live Tracker "ŞU AN, gökyüzünde." (23-26.5s)...');
  await page.goto('http://localhost:3000/canli/iss', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.evaluate(DOC_OVERLAY_SCRIPT);
  await page.evaluate((isVert) => {
    window.__showDocOverlay('BÖLÜM 06 — CANLI GÖKYÜZÜ', 'ŞU AN,', 'gökyüzünde.', 'TELEMETRİ · WHERE THE ISS AT? & NASA', isVert);
  }, isVertical);
  await snap(88, 25);

  // -------------------------------------------------------------------------
  // SCENE 8: (26.5s - 30.0s = 88 frames) OUTRO BRAND SLATE
  // -------------------------------------------------------------------------
  console.log('[8/8] Scene 8: Outro Brand Slate (26.5-30s)...');
  await page.setContent(getOutroSlateHtml(isVertical), { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));
  await snap(88, 15);

  await browser.close();
  console.log(`Captured total ${frameIndex} frames for ${outputName}!`);

  // -------------------------------------------------------------------------
  // AUDIO SYNTHESIS & ENCODING
  // -------------------------------------------------------------------------
  const totalDuration = Math.ceil(frameIndex / FPS);
  console.log(`Synthesizing harmonic ambient soundtrack (${totalDuration}s)...`);

  // Rich atmospheric cosmic drone: A1 (55Hz), E2 (82.41Hz), A2 (110Hz), E3 (164.81Hz) + cosmic noise, normalized to -14 LUFS
  const audioCmd = `ffmpeg -y -f lavfi -i "sine=frequency=55:duration=${totalDuration}" -f lavfi -i "sine=frequency=82.41:duration=${totalDuration}" -f lavfi -i "sine=frequency=110:duration=${totalDuration}" -f lavfi -i "sine=frequency=164.81:duration=${totalDuration}" -f lavfi -i "anoisesrc=d=${totalDuration}:c=pink:r=48000:a=0.03" -filter_complex "[0:a]volume=0.35[a0];[1:a]volume=0.25[a1];[2:a]volume=0.2[a2];[3:a]volume=0.15[a3];[4:a]lowpass=f=400,volume=0.08[a4];[a0][a1][a2][a3][a4]amix=inputs=5,afade=t=in:ss=0:d=2.5,afade=t=out:st=${totalDuration - 2.5}:d=2.5,loudnorm=I=-14:LRA=7:tp=-1.5[out]" -map "[out]" -c:a aac -b:a 256k "${audioTrackPath}"`;
  execSync(audioCmd, { stdio: 'ignore' });

  console.log(`Encoding high-fidelity H.264 MP4 (${width}x${height})...`);
  const framePattern = path.join(framesDir, 'frame_%05d.jpg');
  const mergeCmd = `ffmpeg -y -framerate ${FPS} -i "${framePattern}" -i "${audioTrackPath}" -c:v libx264 -pix_fmt yuv420p -b:v ${isVertical ? '8000k' : '9000k'} -preset medium -c:a copy -shortest "${outputPublic}"`;
  execSync(mergeCmd, { stdio: 'inherit' });

  // Copy to artifacts dir
  fs.copyFileSync(outputPublic, outputArtifact);

  // Cleanup temp frame directory and audio
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.rmSync(audioTrackPath, { force: true });

  console.log(`SUCCESS: ${outputName} generated!`);
  console.log(`- Public: ${outputPublic}`);
  console.log(`- Artifact: ${outputArtifact}`);
}

async function main() {
  console.log('=== SPACETOUR TR CINEMATIC TEASER GENERATION ===');

  // Produce both formats according to Section 7 of the brief
  await recordShowcase('yatay');
  await recordShowcase('dikey');

  // Clean up old legacy AstroTR mp4 files as specified in Section 6
  const oldFiles = [
    path.resolve('public/AstroTR_Guncel_Tanitim.mp4'),
    path.resolve('public/AstroTR_Sinematik_Tanitim.mp4')
  ];
  for (const f of oldFiles) {
    if (fs.existsSync(f)) {
      try {
        fs.unlinkSync(f);
        console.log(`Cleaned up obsolete legacy file: ${f}`);
      } catch (e) {}
    }
  }

  console.log('\n=== ALL DELIVERABLES PRODUCED IN FULL COMPLIANCE WITH BRIEF! ===\n');
}

main().catch(err => {
  console.error('Video generation failed:', err);
  process.exit(1);
});
