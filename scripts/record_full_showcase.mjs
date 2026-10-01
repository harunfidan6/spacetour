import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const framesDir = path.resolve('temp_showcase_frames');
const artifactDir = 'C:\\Users\\asus\\.gemini\\antigravity\\brain\\7506e3c1-2152-463d-8144-cc082ab2514f';
const outputPublic = path.resolve('public/AstroTR_Guncel_Tanitim.mp4');
const outputArtifact = path.join(artifactDir, 'AstroTR_Guncel_Tanitim.mp4');

async function capture() {
  if (fs.existsSync(framesDir)) {
    fs.rmSync(framesDir, { recursive: true, force: true });
  }
  fs.mkdirSync(framesDir, { recursive: true });

  console.log('1. Launching Chrome (1920x1080 Full HD)...');
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

  async function snap(count = 1, delayMs = 40) {
    for (let c = 0; c < count; c++) {
      const filename = path.join(framesDir, `frame_${String(frameIndex).padStart(5, '0')}.jpg`);
      const buffer = await page.screenshot({ type: 'jpeg', quality: 85 });
      fs.writeFileSync(filename, buffer);
      frameIndex++;
      if (delayMs > 0) {
        await new Promise(r => setTimeout(r, delayMs));
      }
    }
  }

  // =========================================================================
  // SCENE 1: HOME PAGE & 3D SOLAR SYSTEM ORRERY
  // =========================================================================
  console.log('2. Recording Scene 1: Home Page & 3D Solar System...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  // Wait for preloader to finish
  await new Promise(r => setTimeout(r, 3400));

  // Hero still & smooth hover
  await snap(25, 30);
  await page.mouse.move(960, 540);
  await snap(15, 30);
  await page.mouse.move(1400, 680, { steps: 10 }); // hover towards Jupiter / Saturn
  await snap(20, 30);

  // Scroll down smoothly through Quick Access
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollBy(0, 35));
    await snap(1, 20);
  }
  await snap(15, 30);

  // Scroll into Voyage Section (Orbital journey without warp)
  for (let i = 0; i < 25; i++) {
    await page.evaluate(() => window.scrollBy(0, 40));
    await snap(1, 20);
  }
  await snap(30, 30);

  // =========================================================================
  // SCENE 2: GÖKKUBBE / PLANETARIUM 3D (/harita)
  // =========================================================================
  console.log('3. Recording Scene 2: Gökkubbe / Planetarium 3D (/harita)...');
  await page.goto('http://localhost:3000/harita', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await snap(15, 30);

  // Scroll into the 3D celestial sphere
  for (let i = 0; i < 16; i++) {
    await page.evaluate(() => window.scrollBy(0, 30));
    await snap(1, 20);
  }
  await snap(20, 30);

  // Drag and rotate the celestial sphere to showcase the Milky Way & Cardinal horizon
  const canvasEl = await page.$('canvas');
  if (canvasEl) {
    const box = await canvasEl.boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      for (let s = 0; s < 25; s++) {
        await page.mouse.move(cx + s * 12, cy - s * 3, { steps: 2 });
        await snap(1, 20);
      }
      await page.mouse.up();
      await snap(25, 30);
    }
  } else {
    await snap(35, 30);
  }

  // =========================================================================
  // SCENE 3: ASTROLOJİ & 360° INTERACTIVE NATAL CHART (/astroloji)
  // =========================================================================
  console.log('4. Recording Scene 3: Astroloji & 360° Natal Chart Wheel (/astroloji)...');
  await page.goto('http://localhost:3000/astroloji', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));
  await snap(20, 30);

  // Scroll to 360° Natal Wheel calculator
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollBy(0, 35));
    await snap(1, 20);
  }
  await snap(20, 30);

  // Hover over the Natal Chart Wheel planet pins
  const chartSvg = await page.$('svg');
  if (chartSvg) {
    const box = await chartSvg.boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      // Move around the wheel sectors to activate aspect chords and cards
      await page.mouse.move(cx - 100, cy, { steps: 5 });
      await snap(18, 30);
      await page.mouse.move(cx, cy - 100, { steps: 5 });
      await snap(18, 30);
      await page.mouse.move(cx + 100, cy, { steps: 5 });
      await snap(18, 30);
    }
  }

  // Scroll down to Daily Cosmic Transit & Cosmic Tarot
  for (let i = 0; i < 30; i++) {
    await page.evaluate(() => window.scrollBy(0, 45));
    await snap(1, 20);
  }
  await snap(30, 30);

  // =========================================================================
  // SCENE 4: ANSIKLOPEDİ & CONSTELLATION ASTERISMS (/ansiklopedi)
  // =========================================================================
  console.log('5. Recording Scene 4: Ansiklopedi & Constellations (/ansiklopedi)...');
  await page.goto('http://localhost:3000/ansiklopedi', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await snap(15, 30);

  // Scroll down to Constellations with custom asterisms
  for (let i = 0; i < 30; i++) {
    await page.evaluate(() => window.scrollBy(0, 45));
    await snap(1, 20);
  }
  await snap(35, 30);

  console.log(`Captured total ${frameIndex} frames!`);
  await browser.close();

  // =========================================================================
  // ENCODING WITH FFMPEG
  // =========================================================================
  console.log('6. Encoding final high-definition MP4 with ffmpeg...');
  const ffmpegCmd = `ffmpeg -y -framerate 25 -i "temp_showcase_frames/frame_%05d.jpg" -c:v libx264 -pix_fmt yuv420p -b:v 5500k -preset medium "${outputPublic}"`;
  execSync(ffmpegCmd, { stdio: 'inherit' });

  // Copy to artifacts directory
  fs.copyFileSync(outputPublic, outputArtifact);
  console.log(`Video saved to:\n- Public: ${outputPublic}\n- Artifacts: ${outputArtifact}`);

  // Cleanup temp frames
  fs.rmSync(framesDir, { recursive: true, force: true });
  console.log('Temp frames cleaned up. Done!');
}

capture().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});
