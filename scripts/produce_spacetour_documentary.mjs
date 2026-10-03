import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\asus\\.gemini\\antigravity\\brain\\7506e3c1-2152-463d-8144-cc082ab2514f';
const FPS = 30; // 30 FPS standard requested by user

// Documentary lower-third and cinematic letterbox overlay script
const DOC_OVERLAY_SCRIPT = `
(function() {
  if (document.getElementById('doc-cinematic-overlay')) return;

  const style = document.createElement('style');
  style.id = 'doc-cinematic-style';
  style.innerHTML = \`
    ::-webkit-scrollbar { display: none !important; }
    * { scrollbar-width: none !important; }

    #doc-cinematic-overlay {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 99999999;
      box-sizing: border-box;
      opacity: 0;
      transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Anamorphic Letterboxing */
    .doc-bar-top {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 48px;
      background: #050508;
      border-bottom: 1px solid rgba(244, 243, 238, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 48px;
    }
    .doc-bar-bottom {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 64px;
      background: #050508;
      border-top: 1px solid rgba(244, 243, 238, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 48px;
    }

    .doc-header-kicker {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #F5C542;
      font-weight: 600;
    }
    .doc-header-meta {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 10px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(244, 243, 238, 0.5);
    }

    /* Cinematic Lower Third Card */
    .doc-lower-card {
      position: absolute;
      bottom: 84px;
      left: 48px;
      right: 48px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 32px;
      pointer-events: none;
    }
    .doc-lower-gradient {
      position: absolute;
      bottom: 64px;
      left: 0; right: 0;
      height: 180px;
      background: linear-gradient(0deg, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.5) 50%, rgba(5,5,8,0) 100%);
      pointer-events: none;
    }

    .doc-title-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .doc-badge-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .doc-badge-pill {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: #F5C542;
      font-weight: 700;
      background: rgba(245, 197, 66, 0.12);
      border: 1px solid rgba(245, 197, 66, 0.35);
      padding: 3px 10px;
      border-radius: 9999px;
    }
    .doc-badge-rule {
      width: 60px;
      height: 1px;
      background: linear-gradient(90deg, #F5C542, transparent);
    }
    .doc-title-row {
      display: flex;
      align-items: baseline;
      gap: 14px;
      line-height: 0.92;
    }
    .doc-title-main {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 52px;
      font-weight: 900;
      letter-spacing: -0.035em;
      text-transform: uppercase;
      color: #F4F3EE;
      text-shadow: 0 4px 30px rgba(0,0,0,0.9);
    }
    .doc-title-accent {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 58px;
      font-style: italic;
      font-weight: 400;
      text-transform: lowercase;
      color: #F5C542;
      text-shadow: 0 4px 30px rgba(0,0,0,0.9);
    }
    .doc-source-credit {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(244, 243, 238, 0.65);
      background: rgba(11, 11, 16, 0.75);
      border: 1px solid rgba(244, 243, 238, 0.12);
      padding: 6px 14px;
      border-radius: 6px;
      backdrop-filter: blur(8px);
      white-space: nowrap;
    }

    /* Vertical formatting */
    .vertical .doc-bar-top { height: 64px; padding: 0 32px; }
    .vertical .doc-bar-bottom { height: 80px; padding: 0 32px; }
    .vertical .doc-lower-card {
      bottom: 180px;
      left: 36px;
      right: 36px;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    .vertical .doc-title-main { font-size: 60px; }
    .vertical .doc-title-accent { font-size: 68px; }
    .vertical .doc-source-credit { font-size: 13px; }
  \`;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'doc-cinematic-overlay';
  root.innerHTML = \`
    <div class="doc-bar-top">
      <span class="doc-header-kicker" id="docTopKicker">SPACETOUR TR · KOZMİK GÖZLEM ATLASI</span>
      <span class="doc-header-meta" id="docTopMeta">J2000 EFEMERİS · CANLI VERİ AĞI</span>
    </div>
    <div class="doc-lower-gradient"></div>
    <div class="doc-lower-card">
      <div class="doc-title-group">
        <div class="doc-badge-row">
          <span class="doc-badge-pill" id="docBadgePill">BÖLÜM 00</span>
          <span class="doc-badge-rule"></span>
          <span style="font-family:ui-monospace; font-size:11px; letter-spacing:0.2em; color:rgba(244,243,238,0.7); text-transform:uppercase;" id="docBadgeLabel">GİRİŞ</span>
        </div>
        <div class="doc-title-row">
          <span class="doc-title-main" id="docTitleMain">EVREN</span>
          <span class="doc-title-accent" id="docTitleAccent">hiç durmaz.</span>
        </div>
      </div>
      <div class="doc-source-credit" id="docSourceCredit">GÖRSEL · NASA / ESA</div>
    </div>
    <div class="doc-bar-bottom">
      <span style="font-family:ui-monospace; font-size:10px; letter-spacing:0.18em; color:rgba(244,243,238,0.45); text-transform:uppercase;">BİR UZAY BELGESELİ · YEDİ BÖLÜM</span>
      <span style="font-family:ui-monospace; font-size:10px; letter-spacing:0.18em; color:#F5C542; font-weight:600;">SPACETOUR.COM.TR</span>
    </div>
  \`;
  document.body.appendChild(root);

  window.__updateCinematicOverlay = function(pill, label, main, accent, credit, isVertical = false) {
    const el = document.getElementById('doc-cinematic-overlay');
    if (!el) return;
    if (isVertical) el.classList.add('vertical');
    else el.classList.remove('vertical');

    document.getElementById('docBadgePill').textContent = pill;
    document.getElementById('docBadgeLabel').textContent = label;
    document.getElementById('docTitleMain').textContent = main;
    document.getElementById('docTitleAccent').textContent = accent;
    document.getElementById('docSourceCredit').textContent = credit;
    el.style.opacity = '1';
  };
})();
`;

function getPrologueHtml(isVertical) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin:0; padding:0; box-sizing: border-box; }
    body {
      background: #050508;
      width: 100vw; height: 100vh;
      overflow: hidden;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      color: #F4F3EE;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      text-align: center;
    }
    .kicker {
      font-family: ui-monospace, monospace;
      font-size: ${isVertical ? '16px' : '13px'};
      letter-spacing: 0.35em;
      color: #F5C542;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 24px;
    }
    .beam {
      width: ${isVertical ? '180px' : '280px'};
      height: 2px;
      background: linear-gradient(90deg, transparent, #F5C542, transparent);
      box-shadow: 0 0 20px #F5C542;
      margin-bottom: 36px;
      animation: pulseBeam 2s infinite ease-in-out;
    }
    @keyframes pulseBeam {
      0%, 100% { opacity: 0.6; transform: scaleX(0.85); }
      50% { opacity: 1; transform: scaleX(1.15); }
    }
    .title {
      font-size: ${isVertical ? '76px' : '88px'};
      font-weight: 900;
      letter-spacing: -0.035em;
      text-transform: uppercase;
      line-height: 0.9;
      display: flex;
      align-items: baseline;
      gap: 18px;
    }
    .serif {
      font-family: Georgia, serif;
      font-style: italic;
      font-weight: 400;
      text-transform: lowercase;
      color: #F5C542;
      font-size: ${isVertical ? '84px' : '96px'};
    }
    .sub {
      font-family: ui-monospace, monospace;
      font-size: ${isVertical ? '14px' : '12px'};
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: rgba(244,243,238,0.55);
      margin-top: 32px;
    }
  </style>
</head>
<body>
  <div class="kicker">BÖLÜM 00 — BİR UZAY BELGESELİ</div>
  <div class="beam"></div>
  <div class="title">
    <span>SPACETOUR</span>
    <span class="serif">atlası</span>
  </div>
  <div class="sub">YEDİ BÖLÜMLÜK SİNEMATİK GÖKYÜZÜ REHBERİ</div>
</body>
</html>
`;
}

function getEpilogueHtml(isVertical) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin:0; padding:0; box-sizing: border-box; }
    body {
      background: #050508;
      width: 100vw; height: 100vh;
      overflow: hidden;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      color: #F4F3EE;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      text-align: center;
      padding: 0 40px;
    }
    .logo {
      width: ${isVertical ? '100px' : '92px'};
      height: ${isVertical ? '100px' : '92px'};
      margin-bottom: 24px;
      filter: drop-shadow(0 0 40px rgba(245,197,66,0.35));
    }
    .brand {
      font-size: ${isVertical ? '68px' : '72px'};
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1;
    }
    .brand span { color: #F5C542; }
    .slogan {
      font-family: Georgia, serif;
      font-style: italic;
      font-size: ${isVertical ? '48px' : '50px'};
      color: #F5C542;
      margin-top: 10px;
    }
    .rule {
      width: 280px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(245,197,66,0.85), transparent);
      margin: 32px 0 24px;
    }
    .url {
      font-family: ui-monospace, monospace;
      font-size: ${isVertical ? '24px' : '22px'};
      letter-spacing: 0.22em;
      color: #F4F3EE;
      font-weight: 700;
    }
    .license {
      font-family: ui-monospace, monospace;
      font-size: ${isVertical ? '12px' : '11px'};
      letter-spacing: 0.1em;
      color: rgba(244,243,238,0.45);
      margin-top: 48px;
      max-width: ${isVertical ? '850px' : '760px'};
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="logo">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
      <rect width="64" height="64" rx="14" fill="#0B0B10" stroke="rgba(244,243,238,0.18)" stroke-width="1"/>
      <circle cx="32" cy="32" r="21" fill="none" stroke="#f4f3ee" stroke-opacity="0.6" stroke-width="2.2"/>
      <circle cx="32" cy="32" r="9.5" fill="#f59e0b"/>
      <circle cx="53" cy="32" r="5" fill="#38bdf8"/>
    </svg>
  </div>
  <div class="brand">Spacetour<span>.tr</span></div>
  <div class="slogan">Evren hiç durmaz.</div>
  <div class="rule"></div>
  <div class="url">spacetour.com.tr</div>
  <div class="license">
    Görseller: NASA, ESA, CSA, STScI, ESO, Wikimedia Commons ve ilgili sahipleri. Bazı görseller CC BY / CC BY-SA lisanslıdır.<br>
    Bölüm 00–07 Atlası Şimdi Yayında.
  </div>
</body>
</html>
`;
}

async function renderDocumentaryTeaser(format = 'yatay') {
  const isVertical = format === 'dikey';
  const width = isVertical ? 1080 : 1920;
  const height = isVertical ? 1920 : 1080;
  const outputName = `spacetour_30s_${format}.mp4`;
  const outputPublic = path.resolve(`public/${outputName}`);
  const outputArtifact = path.join(artifactDir, outputName);
  const framesDir = path.resolve(`temp_doc_frames_${format}`);
  const masterAudio = path.resolve('temp_audio_master/final_soundtrack.m4a');

  console.log(`\n======================================================`);
  console.log(`PRODUCING 30 FPS CINEMATIC MASTER: ${outputName} (${width}x${height})`);
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

  async function snap(count = 1, delayMs = 25) {
    for (let c = 0; c < count; c++) {
      const filename = path.join(framesDir, `frame_${String(frameIndex).padStart(5, '0')}.jpg`);
      const buffer = await page.screenshot({ type: 'jpeg', quality: 92 });
      fs.writeFileSync(filename, buffer);
      frameIndex++;
      if (delayMs > 0) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
  }

  // Set sessionStorage bypass before page load
  await page.evaluateOnNewDocument(() => {
    try {
      sessionStorage.setItem('spacetour:intro', '1');
    } catch (e) {}
  });

  // -------------------------------------------------------------------------
  // ACT 1: (0.0s - 3.5s = 105 frames) PROLOGUE SLATE
  // Voice: "Gökyüzü hiç durmadı."
  // -------------------------------------------------------------------------
  console.log('[1/7] Act 1: Prologue Slate "Gökyüzü hiç durmadı." (0-3.5s)...');
  await page.setContent(getPrologueHtml(isVertical), { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));
  await snap(105, 15);

  // -------------------------------------------------------------------------
  // ACT 2: (3.5s - 8.0s = 135 frames) 3D LIVE SOLAR SYSTEM (HomeHero)
  // Voice: "Yıldızlar yer değiştirdi, gezegenler yollarını çizdi..."
  // -------------------------------------------------------------------------
  console.log('[2/7] Act 2: 3D Solar System "EVREN hiç durmaz." (3.5-8.0s)...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.evaluate(DOC_OVERLAY_SCRIPT);
  await page.evaluate((isVert) => {
    window.__updateCinematicOverlay('BÖLÜM 00', 'GİRİŞ', 'EVREN', 'hiç durmaz.', 'JPL / NASA YÖRÜNGE ELEMANLARI', isVert);
  }, isVertical);
  await snap(135, 20);

  // -------------------------------------------------------------------------
  // ACT 3: (8.0s - 12.5s = 135 frames) 360° PLANETARIUM SKY MAP
  // Voice: "...ışık milyarlarca yıl yol aldı."
  // -------------------------------------------------------------------------
  console.log('[3/7] Act 3: 360 Planetarium "GÖĞÜ oku." (8.0-12.5s)...');
  await page.goto('http://localhost:3000/harita/planetaryum', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.evaluate(DOC_OVERLAY_SCRIPT);
  await page.evaluate((isVert) => {
    window.__updateCinematicOverlay('BÖLÜM 01', 'GÖK HARİTASI', 'GÖĞÜ', 'oku.', 'GÖRSEL · VLT LAZER REHBER YILDIZ / ESO', isVert);
  }, isVertical);

  // Smooth orbital sweep of the celestial sphere
  const midX = width / 2;
  const midY = height / 2;
  await page.mouse.move(midX, midY);
  await page.mouse.down();
  for (let i = 0; i < 45; i++) {
    await page.mouse.move(midX - i * 5, midY - i * 1.5);
    await snap(2, 15);
  }
  await page.mouse.up();
  await snap(45, 15);

  // -------------------------------------------------------------------------
  // ACT 4: (12.5s - 16.5s = 120 frames) OBSERVATORY SPECTRUM WIPES
  // (Instrumental Crescendo & Sound Design)
  // -------------------------------------------------------------------------
  console.log('[4/7] Act 4: Observatory Spectrum "GÖRÜNMEYENİ gör." (12.5-16.5s)...');
  await page.goto('http://localhost:3000/gozlemevi/spektrum', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await page.evaluate(DOC_OVERLAY_SCRIPT);
  await page.evaluate((isVert) => {
    window.__updateCinematicOverlay('BÖLÜM 05', 'GÖZLEMEVİ', 'GÖRÜNMEYENİ', 'gör.', 'NASA / ESA / CHANDRA / ALMA', isVert);
  }, isVertical);

  for (let step = 0; step < 60; step++) {
    if (step === 18) {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const target = btns.find(b => b.textContent?.includes('Kızılötesi') || b.textContent?.includes('Radyo'));
        target?.click();
      });
    } else if (step === 38) {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const target = btns.find(b => b.textContent?.includes('X-Işını') || b.textContent?.includes('Optik'));
        target?.click();
      });
    }
    await snap(2, 15);
  }

  // -------------------------------------------------------------------------
  // ACT 5: (16.5s - 20.5s = 120 frames) BLACK HOLE ACCRETION DISK
  // Voice: "Şimdi hepsi tek bir yerde."
  // -------------------------------------------------------------------------
  console.log('[5/7] Act 5: Black Hole Accretion Disk "ZAMANI bük." (16.5-20.5s)...');
  await page.goto('http://localhost:3000/ansiklopedi/laboratuvar/kara-delik', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2400));
  await page.evaluate(DOC_OVERLAY_SCRIPT);
  await page.evaluate((isVert) => {
    window.__updateCinematicOverlay('BÖLÜM 03', 'ANSİKLOPEDİ', 'ZAMANI', 'bük.', 'EVENT HORIZON TELESCOPE / ESO', isVert);
  }, isVertical);

  // Smooth relativistic camera curve around the event horizon
  await page.mouse.move(midX, midY);
  await page.mouse.down();
  for (let i = 0; i < 50; i++) {
    await page.mouse.move(midX + Math.sin(i * 0.12) * 140, midY + Math.cos(i * 0.12) * 70);
    await snap(2, 15);
  }
  await page.mouse.up();
  await snap(20, 15);

  // -------------------------------------------------------------------------
  // ACT 6: (20.5s - 24.5s = 120 frames) HISTORY & REAL-TIME (Zodiac + ISS)
  // (Fast match cut between 1824 engraving and modern orbit)
  // -------------------------------------------------------------------------
  console.log('[6/7] Act 6: Urania\'s Mirror & ISS Live "YILDIZLARINI keşfet." (20.5-24.5s)...');
  await page.goto('http://localhost:3000/astroloji/burclar', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(DOC_OVERLAY_SCRIPT);
  await page.evaluate((isVert) => {
    window.__updateCinematicOverlay('BÖLÜM 04', 'ASTROLOJİ', 'YILDIZLARINI', 'keşfet.', 'SIDNEY HALL, URANIA\'S MIRROR (1824)', isVert);
  }, isVertical);

  for (let i = 0; i < 30; i++) {
    await page.evaluate(() => window.scrollBy(0, 18));
    await snap(2, 15);
  }

  // Match-cut to ISS Live
  await page.goto('http://localhost:3000/canli/iss', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1800));
  await page.evaluate(DOC_OVERLAY_SCRIPT);
  await page.evaluate((isVert) => {
    window.__updateCinematicOverlay('BÖLÜM 06', 'CANLI GÖKYÜZÜ', 'ŞU AN,', 'gökyüzünde.', 'TELEMETRİ · WHERE THE ISS AT? & NASA', isVert);
  }, isVertical);
  await snap(60, 20);

  // -------------------------------------------------------------------------
  // ACT 7: (24.5s - 30.0s = 165 frames) FINALE & LOGO OUTRO
  // Voice: "Spacetour. Evren hiç durmaz."
  // -------------------------------------------------------------------------
  console.log('[7/7] Act 7: Finale & Outro "Spacetour. Evren hiç durmaz." (24.5-30s)...');
  await page.setContent(getEpilogueHtml(isVertical), { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));
  await snap(165, 15);

  await browser.close();
  console.log(`Captured total ${frameIndex} frames for ${outputName}!`);

  // -------------------------------------------------------------------------
  // MULTIPLEX VIDEO + MASTER SOUNDTRACK
  // -------------------------------------------------------------------------
  console.log(`Merging ${frameIndex} frames @ ${FPS} FPS with master narration audio...`);
  const framePattern = path.join(framesDir, 'frame_%05d.jpg');
  const mergeCmd = `ffmpeg -y -framerate ${FPS} -i "${framePattern}" -i "${masterAudio}" -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -c:a copy -shortest "${outputPublic}"`;
  execSync(mergeCmd, { stdio: 'inherit' });

  // Copy to artifact directory
  fs.copyFileSync(outputPublic, outputArtifact);

  // Cleanup temp frames
  fs.rmSync(framesDir, { recursive: true, force: true });
  console.log(`SUCCESS: Master ${outputName} generated!`);
  console.log(`- Public: ${outputPublic}`);
  console.log(`- Artifact: ${outputArtifact}`);
}

async function main() {
  console.log('=== STARTING BROADCAST DOCUMENTARY TEASER PRODUCTION (OPTION 1) ===');

  // Verify soundtrack exists
  const masterAudio = path.resolve('temp_audio_master/final_soundtrack.m4a');
  if (!fs.existsSync(masterAudio)) {
    console.log('Building soundtrack first...');
    execSync('python scripts/build_soundtrack.py', { stdio: 'inherit' });
  }

  // 1. Render Yatay 1080p @ 30 FPS
  await renderDocumentaryTeaser('yatay');

  // 2. Render Dikey 1080p @ 30 FPS
  await renderDocumentaryTeaser('dikey');

  console.log('\n=== BOTH 1080P 30FPS DOCUMENTARY TEASERS PRODUCED FLAWLESSLY! ===\n');
}

main().catch(err => {
  console.error('Documentary production failed:', err);
  process.exit(1);
});
