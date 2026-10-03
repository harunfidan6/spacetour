import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\asus\\.gemini\\antigravity\\brain\\7506e3c1-2152-463d-8144-cc082ab2514f';
const FPS = 30;
const DURATION_SEC = 30.0;
const TOTAL_FRAMES = Math.round(FPS * DURATION_SEC); // 900 frames

async function renderStudioShowcase(format = 'yatay') {
  const isVertical = format === 'dikey';
  const width = isVertical ? 1080 : 1920;
  const height = isVertical ? 1920 : 1080;
  const outputName = `spacetour_30s_${format}.mp4`;
  const outputPublic = path.resolve(`public/${outputName}`);
  const outputArtifact = path.join(artifactDir, outputName);
  const framesDir = path.resolve(`temp_studio_frames_${format}`);
  const studioUrl = `http://localhost:3000/studio?format=${format}&render=1`;
  const masterAudio = path.resolve('temp_audio_master/final_soundtrack.m4a');

  console.log(`\n======================================================`);
  console.log(`RECORDING ISOLATED STUDIO STAGE: ${outputName} (${width}x${height} @ ${FPS} FPS)`);
  console.log(`Target: ${studioUrl}`);
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
      '--disable-web-security',
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

  console.log('Navigating to live studio stage...');
  await page.goto(studioUrl, { waitUntil: 'networkidle0' });

  // Allow WebGL / Three.js and textures to stabilize
  console.log('Waiting 2.5s for Three.js 3D WebGL contexts to initialize...');
  await new Promise((r) => setTimeout(r, 2500));

  console.log(`Starting deterministic frame recording (${TOTAL_FRAMES} frames)...`);
  const startTime = Date.now();

  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const timeSec = f / FPS;

    // Scrub studio timeline to this exact sub-second
    await page.evaluate((t) => {
      if (typeof window.__studioSeek === 'function') {
        window.__studioSeek(t);
      }
    }, timeSec);

    // Wait a brief tick for render updates
    if (f % 5 === 0) {
      await new Promise((r) => setTimeout(r, 15));
    }

    const filename = path.join(framesDir, `frame_${String(f).padStart(5, '0')}.jpg`);
    const buffer = await page.screenshot({ type: 'jpeg', quality: 95 });
    fs.writeFileSync(filename, buffer);

    if (f > 0 && f % 90 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const percent = ((f / TOTAL_FRAMES) * 100).toFixed(0);
      const fpsRate = (f / ((Date.now() - startTime) / 1000)).toFixed(1);
      console.log(`Progress: ${percent}% (${f}/${TOTAL_FRAMES} frames) · ${fpsRate} fps · ${elapsed}s elapsed`);
    }
  }

  await browser.close();
  console.log(`All ${TOTAL_FRAMES} frames recorded! Compiling video with FFmpeg...`);

  // Ensure soundtrack exists
  if (!fs.existsSync(masterAudio)) {
    console.log('Synthesizing broadcast audio track...');
    execSync('python scripts/build_soundtrack.py', { stdio: 'inherit' });
  }

  const framePattern = path.join(framesDir, 'frame_%05d.jpg');
  const mergeCmd = `ffmpeg -y -framerate ${FPS} -i "${framePattern}" -i "${masterAudio}" -c:v libx264 -pix_fmt yuv420p -b:v 10000k -maxrate 15000k -bufsize 20000k -preset fast -c:a aac -b:a 256k -shortest "${outputPublic}"`;
  execSync(mergeCmd, { stdio: 'inherit' });

  // Copy to brain artifacts directory
  fs.copyFileSync(outputPublic, outputArtifact);

  // Clean temporary frames
  fs.rmSync(framesDir, { recursive: true, force: true });

  console.log(`\nCOMPLETED: Master Showcase Video Generated!`);
  console.log(`- Web Public: ${outputPublic}`);
  console.log(`- Artifact: ${outputArtifact}\n`);
}

async function main() {
  console.log('========================================================');
  console.log('SPACETOUR TR - ISOLATED STUDIO SCENE SHOWCASE PIPELINE');
  console.log('========================================================\n');

  // Verify soundtrack
  const masterAudio = path.resolve('temp_audio_master/final_soundtrack.m4a');
  if (!fs.existsSync(masterAudio)) {
    execSync('python scripts/build_soundtrack.py', { stdio: 'inherit' });
  }

  // 1. Render Yatay (1920x1080 @ 30 FPS)
  await renderStudioShowcase('yatay');

  // 2. Render Dikey (1080x1920 @ 30 FPS)
  await renderStudioShowcase('dikey');

  console.log('\n========================================================');
  console.log('ALL CINEMATIC STUDIO TRAILERS SUCCESSFULLY GENERATED!');
  console.log('========================================================\n');
}

main().catch((err) => {
  console.error('Showcase generation error:', err);
  process.exit(1);
});
