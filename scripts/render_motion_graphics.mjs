import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\asus\\.gemini\\antigravity\\brain\\7506e3c1-2152-463d-8144-cc082ab2514f';
const FPS = 30;
const TOTAL_FRAMES = 900; // 30.00 seconds exactly @ 30 FPS

async function renderVideo(format = 'yatay') {
  const isVertical = format === 'dikey';
  const width = isVertical ? 1080 : 1920;
  const height = isVertical ? 1920 : 1080;
  const outputName = `spacetour_30s_${format}.mp4`;
  const outputPublic = path.resolve(`public/${outputName}`);
  const outputArtifact = path.join(artifactDir, outputName);
  const framesDir = path.resolve(`temp_mg_frames_${format}`);
  const studioHtmlPath = 'file:///' + path.resolve('scripts/motion_studio.html').replace(/\\/g, '/');
  const masterAudio = path.resolve('temp_audio_master/final_soundtrack.m4a');

  console.log(`\n======================================================`);
  console.log(`RENDERING PURE MOTION GRAPHICS: ${outputName} (${width}x${height}, ${FPS} FPS)`);
  console.log(`======================================================\n`);

  if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  const ASSET_PATHS = {
    cellarius: 'public/images/space/cellarius-harmonia-macrocosmica-planisphaerium-braheum-f160fa.jpg',
    earth: 'public/images/space/the-earth-seen-from-apollo-17-e09623.jpg',
    vlt_laser: 'public/images/space/vlt-laser-guide-star-img-4310-c2ab6c.jpg',
    crab_opt: 'public/images/space/crab-nebula-bf6d6a.jpg',
    crab_multi: 'public/images/space/crab-nebula-ngc-1952-composite-from-chandra-hubble-and-spitz-bf199c.jpg',
    pillars: 'public/images/space/pillars-of-creation-nircam-image-98baee.jpg',
    zodiac: 'public/images/space/sidney-hall-urania-s-mirror-leo-major-and-leo-minor-ae1988.jpg',
    iss: 'public/images/space/iss-62-city-lights-at-the-intersection-of-europe-and-asia-eb1c8f.jpg',
  };

  console.log('Reading high-resolution space assets into memory (base64)...');
  const dataUrlMap = {};
  for (const [key, relPath] of Object.entries(ASSET_PATHS)) {
    const fullPath = path.resolve(relPath);
    if (fs.existsSync(fullPath)) {
      const b64 = fs.readFileSync(fullPath).toString('base64');
      dataUrlMap[key] = `data:image/jpeg;base64,${b64}`;
    }
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: [
      `--window-size=${width},${height}`,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--allow-file-access-from-files',
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

  console.log('Loading Motion Graphics Studio and preloading raw NASA/ESA/ESO assets...');
  await page.goto(studioHtmlPath, { waitUntil: 'domcontentloaded' });
  await page.evaluate((w, h, map) => window.__initStudio(w, h, map), width, height, dataUrlMap);

  // Give 1.5s for fonts and image textures to stabilize in GPU memory
  await new Promise(r => setTimeout(r, 1500));
  console.log('Assets loaded into memory. Starting sub-pixel frame rendering (900 frames)...');

  const startTime = Date.now();

  for (let f = 0; f < TOTAL_FRAMES; f++) {
    // Render current frame on canvas
    await page.evaluate((frameIdx, fmt) => window.renderFrame(frameIdx, fmt), f, format);

    // Capture frame buffer
    const filename = path.join(framesDir, `frame_${String(f).padStart(5, '0')}.jpg`);
    const buffer = await page.screenshot({ type: 'jpeg', quality: 95 });
    fs.writeFileSync(filename, buffer);

    if (f > 0 && f % 150 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const percent = ((f / TOTAL_FRAMES) * 100).toFixed(0);
      const fpsRender = (f / ((Date.now() - startTime) / 1000)).toFixed(1);
      console.log(`Progress: ${percent}% (${f}/${TOTAL_FRAMES} frames) · ${fpsRender} fps · ${elapsed}s elapsed`);
    }
  }

  await browser.close();
  console.log(`All ${TOTAL_FRAMES} frames rendered! Compiling with master studio soundtrack...`);

  // Ensure soundtrack exists
  if (!fs.existsSync(masterAudio)) {
    console.log('Synthesizing broadcast audio track...');
    execSync('python scripts/build_soundtrack.py', { stdio: 'inherit' });
  }

  const framePattern = path.join(framesDir, 'frame_%05d.jpg');
  const mergeCmd = `ffmpeg -y -framerate ${FPS} -i "${framePattern}" -i "${masterAudio}" -c:v libx264 -pix_fmt yuv420p -b:v 9500k -maxrate 14000k -bufsize 20000k -preset medium -c:a copy -shortest "${outputPublic}"`;
  execSync(mergeCmd, { stdio: 'inherit' });

  // Copy to artifacts directory
  fs.copyFileSync(outputPublic, outputArtifact);

  // Clean up temporary frame folder
  fs.rmSync(framesDir, { recursive: true, force: true });

  console.log(`SUCCESS: Master Motion Graphics Film generated!`);
  console.log(`- Public: ${outputPublic}`);
  console.log(`- Artifact: ${outputArtifact}`);
}

async function main() {
  console.log('=== SPACETOUR TR PURE MOTION GRAPHICS PIPELINE ===');

  // Verify soundtrack
  const masterAudio = path.resolve('temp_audio_master/final_soundtrack.m4a');
  if (!fs.existsSync(masterAudio)) {
    execSync('python scripts/build_soundtrack.py', { stdio: 'inherit' });
  }

  // 1. Render Yatay (1920x1080 @ 30 FPS)
  await renderVideo('yatay');

  // 2. Render Dikey (1080x1920 @ 30 FPS)
  await renderVideo('dikey');

  console.log('\n=== BOTH MOTION GRAPHICS FILMS CREATED FROM RAW ASSETS FLAWLESSLY! ===\n');
}

main().catch(err => {
  console.error('Rendering pipeline error:', err);
  process.exit(1);
});
