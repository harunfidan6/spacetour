import * as THREE from 'three';

// Ultra-realistic procedural textures for the cinematic solar system & deep space

// 1. THE SUN: Multi-layer solar granulation and turbulent plasma
export function createSunTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Plasma gradient base
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#fff4cc');
  grad.addColorStop(0.15, '#ffbb00');
  grad.addColorStop(0.5, '#ff6600');
  grad.addColorStop(0.85, '#ff3300');
  grad.addColorStop(1, '#ffaa00');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Solar granules (convection cells)
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 24 + 4;
    const alpha = Math.random() * 0.45 + 0.15;
    ctx.fillStyle = Math.random() > 0.4 ? `rgba(255, 255, 200, ${alpha})` : `rgba(200, 40, 0, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Solar flares / sunspots
  for (let s = 0; s < 12; s++) {
    const sx = Math.random() * canvas.width;
    const sy = canvas.height * 0.25 + Math.random() * (canvas.height * 0.5);
    const rad = Math.random() * 30 + 10;
    
    // Penumbra
    const spotGrad = ctx.createRadialGradient(sx, sy, 2, sx, sy, rad);
    spotGrad.addColorStop(0, '#220800');
    spotGrad.addColorStop(0.5, '#551500');
    spotGrad.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = spotGrad;
    ctx.beginPath();
    ctx.arc(sx, sy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 2. EARTH: Daytime oceans/continents + Night city lights + Clouds
export function createEarthTexture(): {
  map: THREE.CanvasTexture;
  clouds: THREE.CanvasTexture;
} {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Deep Ocean with depth variations
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#0d223a');
    oceanGrad.addColorStop(0.5, '#0a192f');
    oceanGrad.addColorStop(1, '#0d223a');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Continental landmasses approximation
    ctx.fillStyle = '#1c4d25';
    const continents = [
      { x: 350, y: 350, w: 280, h: 220 }, // N. America
      { x: 480, y: 650, w: 180, h: 260 }, // S. America
      { x: 950, y: 300, w: 320, h: 180 }, // Europe
      { x: 1000, y: 550, w: 340, h: 320 }, // Africa
      { x: 1450, y: 320, w: 420, h: 280 }, // Asia
      { x: 1650, y: 720, w: 220, h: 160 }, // Australia
    ];

    continents.forEach((c) => {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.w, c.h, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Organic coastlines
      for (let k = 0; k < 60; k++) {
        const ox = c.x + (Math.random() - 0.5) * c.w * 1.5;
        const oy = c.y + (Math.random() - 0.5) * c.h * 1.4;
        const orad = Math.random() * 70 + 20;
        ctx.fillStyle = Math.random() > 0.4 ? '#265930' : '#4a6741';
        ctx.beginPath();
        ctx.ellipse(ox, oy, orad, orad * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mountain ranges & Sahara/Gobi deserts
      for (let d = 0; d < 40; d++) {
        const dx = c.x + (Math.random() - 0.5) * c.w * 0.8;
        const dy = c.y + (Math.random() - 0.5) * c.h * 0.7;
        ctx.fillStyle = Math.random() > 0.5 ? '#bfa06b' : '#8c764e';
        ctx.fillRect(dx, dy, Math.random() * 45 + 15, Math.random() * 25 + 10);
      }
    });

    // Polar ice caps (Antarctica & Arctic) with crystalline gradient
    const iceTop = ctx.createLinearGradient(0, 0, 0, 90);
    iceTop.addColorStop(0, '#ffffff');
    iceTop.addColorStop(0.7, '#d6e9f8');
    iceTop.addColorStop(1, 'rgba(214, 233, 248, 0)');
    ctx.fillStyle = iceTop;
    ctx.fillRect(0, 0, canvas.width, 90);

    const iceBot = ctx.createLinearGradient(0, canvas.height - 110, 0, canvas.height);
    iceBot.addColorStop(0, 'rgba(214, 233, 248, 0)');
    iceBot.addColorStop(0.3, '#d6e9f8');
    iceBot.addColorStop(1, '#ffffff');
    ctx.fillStyle = iceBot;
    ctx.fillRect(0, canvas.height - 110, canvas.width, 110);
  }

  // Realistic turbulent cloud layer
  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = 2048;
  cloudCanvas.height = 1024;
  const cctx = cloudCanvas.getContext('2d');
  if (cctx) {
    cctx.clearRect(0, 0, cloudCanvas.width, cloudCanvas.height);

    // Weather swirl bands
    for (let i = 0; i < 350; i++) {
      const cx = Math.random() * cloudCanvas.width;
      const cy = Math.random() * cloudCanvas.height;
      const r = Math.random() * 110 + 30;
      const alpha = Math.random() * 0.5 + 0.2;

      cctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      cctx.beginPath();
      cctx.ellipse(cx, cy, r, r * 0.35, Math.sin(cx * 0.01) * 0.8, 0, Math.PI * 2);
      cctx.fill();
    }

    // Cyclone vortexes
    for (let c = 0; c < 4; c++) {
      const vx = Math.random() * cloudCanvas.width;
      const vy = cloudCanvas.height * 0.3 + Math.random() * (cloudCanvas.height * 0.4);
      const vGrad = cctx.createRadialGradient(vx, vy, 5, vx, vy, 90);
      vGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
      vGrad.addColorStop(0.5, 'rgba(255,255,255,0.4)');
      vGrad.addColorStop(1, 'rgba(255,255,255,0)');
      cctx.fillStyle = vGrad;
      cctx.beginPath();
      cctx.arc(vx, vy, 90, 0, Math.PI * 2);
      cctx.fill();
    }
  }

  return {
    map: new THREE.CanvasTexture(canvas),
    clouds: new THREE.CanvasTexture(cloudCanvas)
  };
}

// 3. JUPITER: Turbulent bands, eddy swirls and Great Red Spot
export function createJupiterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const bands = 36;
  const bandHeight = canvas.height / bands;
  const colors = [
    '#c88b3a', '#e6c587', '#9c5b23', '#d7b98d', '#8b4513',
    '#f5a65b', '#b36b28', '#dfc499', '#703311', '#e8cc99'
  ];

  for (let i = 0; i < bands; i++) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(0, i * bandHeight, canvas.width, bandHeight);

    // Zonal wind turbulence
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    for (let j = 0; j < 50; j++) {
      const wx = Math.random() * canvas.width;
      const wy = i * bandHeight + Math.random() * bandHeight * 0.6;
      ctx.fillRect(wx, wy, Math.random() * 120 + 30, Math.random() * 6 + 2);
    }
  }

  // The Great Red Spot with detailed counter-rotating vortex
  ctx.save();
  ctx.translate(canvas.width * 0.68, canvas.height * 0.64);
  ctx.beginPath();
  ctx.ellipse(0, 0, 110, 70, 0.12, 0, Math.PI * 2);
  const spotGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 110);
  spotGrad.addColorStop(0, '#9e2211');
  spotGrad.addColorStop(0.4, '#c9441e');
  spotGrad.addColorStop(0.8, '#e0854a');
  spotGrad.addColorStop(1, 'rgba(200, 139, 58, 0)');
  ctx.fillStyle = spotGrad;
  ctx.fill();

  // White storm pearls surrounding Great Red Spot
  for (let w = 0; w < 6; w++) {
    const wx = (Math.random() - 0.5) * 260;
    const wy = (Math.random() - 0.5) * 110;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.ellipse(wx, wy, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  return new THREE.CanvasTexture(canvas);
}

// 4. SATURN RINGS: Photo-accurate translucent icy ring system with Cassini & Encke divisions
export function createSaturnRingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  // D Ring (faint)
  grad.addColorStop(0.12, 'rgba(170, 150, 120, 0.15)');
  // C Ring (Crepe ring)
  grad.addColorStop(0.22, 'rgba(190, 170, 135, 0.45)');
  // B Ring (Dense & brightest)
  grad.addColorStop(0.35, 'rgba(240, 225, 185, 0.95)');
  grad.addColorStop(0.55, 'rgba(235, 215, 175, 0.9)');
  // Cassini Division (Major gap)
  grad.addColorStop(0.58, 'rgba(10, 10, 18, 0.04)');
  grad.addColorStop(0.63, 'rgba(10, 10, 18, 0.04)');
  // A Ring
  grad.addColorStop(0.66, 'rgba(210, 190, 150, 0.8)');
  // Encke Gap
  grad.addColorStop(0.82, 'rgba(15, 15, 25, 0.1)');
  grad.addColorStop(0.84, 'rgba(15, 15, 25, 0.1)');
  // Outer A ring
  grad.addColorStop(0.86, 'rgba(195, 175, 140, 0.6)');
  // Outer edge
  grad.addColorStop(0.94, 'rgba(160, 140, 110, 0.2)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return new THREE.CanvasTexture(canvas);
}

// 5. MARS: High-res rust basalt, canyons (Valles Marineris) & polar caps
export function createMarsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Red planet rust base
  ctx.fillStyle = '#b74418';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dark volcanic basalt provinces (Syrtis Major, Acidalia Planitia)
  ctx.fillStyle = '#5a2211';
  for (let i = 0; i < 70; i++) {
    ctx.beginPath();
    ctx.ellipse(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 90 + 30,
      Math.random() * 45 + 15,
      Math.random() * Math.PI,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Valles Marineris canyon scar
  ctx.fillStyle = '#331008';
  ctx.fillRect(canvas.width * 0.35, canvas.height * 0.48, canvas.width * 0.28, 14);

  // Olympus Mons volcano calderas
  const ox = canvas.width * 0.25;
  const oy = canvas.height * 0.42;
  const oGrad = ctx.createRadialGradient(ox, oy, 2, ox, oy, 35);
  oGrad.addColorStop(0, '#752a12');
  oGrad.addColorStop(0.8, '#b74418');
  oGrad.addColorStop(1, 'rgba(183, 68, 24, 0)');
  ctx.fillStyle = oGrad;
  ctx.beginPath();
  ctx.arc(ox, oy, 35, 0, Math.PI * 2);
  ctx.fill();

  // Ice caps (Carbon dioxide dry ice + water ice)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, 24);
  ctx.fillRect(0, canvas.height - 24, canvas.width, 24);

  return new THREE.CanvasTexture(canvas);
}

// 6. SATURN PLANET SURFACE: Creamy golden-amber atmospheric bands & polar hexagon
export function createSaturnTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const bands = [
    { pos: 0.0, color: '#4a3e2e' }, // North polar dark region
    { pos: 0.1, color: '#70624a' },
    { pos: 0.2, color: '#c7b48a' },
    { pos: 0.35, color: '#e8dbb7' },
    { pos: 0.48, color: '#faeed2' }, // Equatorial bright zone
    { pos: 0.52, color: '#f3e5c4' },
    { pos: 0.65, color: '#d9c49a' },
    { pos: 0.8, color: '#ad9871' },
    { pos: 0.9, color: '#6e5d44' },
    { pos: 1.0, color: '#382f22' }, // South polar region
  ];

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bands.forEach((b) => grad.addColorStop(b.pos, b.color));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Soft atmospheric zonal eddies
  for (let i = 0; i < 40; i++) {
    const y = Math.random() * canvas.height;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(90, 60, 20, 0.06)';
    ctx.fillRect(0, y, canvas.width, Math.random() * 8 + 2);
  }

  // North polar hexagonal vortex
  const hexGrad = ctx.createRadialGradient(canvas.width * 0.5, 30, 2, canvas.width * 0.5, 30, 45);
  hexGrad.addColorStop(0, '#2e3a35'); // Distinct blue-green polar tint observed by Cassini
  hexGrad.addColorStop(1, 'rgba(74, 62, 46, 0)');
  ctx.fillStyle = hexGrad;
  ctx.fillRect(0, 0, canvas.width, 70);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 7. BLACK HOLE ACCRETION DISK: Relativistic Doppler-beaming swirling plasma
export function createAccretionDiskTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = canvas.width / 2;

  // Clear transparent
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Concentric fiery rings with turbulence
  const ringCount = 180;
  for (let r = 50; r < maxRadius; r += 2) {
    const norm = (r - 50) / (maxRadius - 50); // 0 at inner, 1 at outer
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);

    // Color gradient from inner ultra-hot white-blue to bright gold to outer deep red
    let rCol = 255;
    let gCol = Math.floor(255 * Math.pow(1 - norm, 0.8));
    let bCol = Math.floor(180 * Math.pow(1 - norm, 2.5));
    let alpha = (1 - norm) * 0.85;

    ctx.strokeStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${alpha})`;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  // Spiral plasma filaments and Doppler asymmetry
  for (let i = 0; i < 600; i++) {
    const angle = Math.random() * Math.PI * 2;
    const rad = 80 + Math.random() * (maxRadius - 90);
    const x = centerX + Math.cos(angle) * rad;
    const y = centerY + Math.sin(angle) * rad;
    const length = Math.random() * 40 + 10;

    // Doppler boost on the left side (x < centerX)
    const isApproaching = x < centerX;
    const boost = isApproaching ? 1.5 : 0.6;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2); // tangent to circle
    const pGrad = ctx.createLinearGradient(0, -length / 2, 0, length / 2);
    pGrad.addColorStop(0, 'rgba(255, 200, 100, 0)');
    pGrad.addColorStop(0.5, `rgba(255, ${Math.floor(220 * boost)}, ${Math.floor(150 * boost)}, ${0.6 * boost})`);
    pGrad.addColorStop(1, 'rgba(255, 100, 50, 0)');
    ctx.fillStyle = pGrad;
    ctx.fillRect(-2, -length / 2, 4, length);
    ctx.restore();
  }

  return new THREE.CanvasTexture(canvas);
}

// 8. EARTH NIGHT CITY LIGHTS: Twinkling urban grid constellations
export function createEarthNightTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Black background
  ctx.fillStyle = '#010307';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // City clusters (aligned approximately with continents)
  const clusters = [
    { x: 420, y: 340, count: 180, spread: 80 },  // N. America East & Midwest
    { x: 320, y: 360, count: 80, spread: 60 },   // N. America West Coast
    { x: 530, y: 720, count: 90, spread: 50 },   // S. America coastal
    { x: 1020, y: 290, count: 260, spread: 65 }, // Western & Central Europe
    { x: 1040, y: 380, count: 70, spread: 45 },  // Mediterranean & Nile delta
    { x: 1350, y: 440, count: 220, spread: 70 }, // India subcontinent
    { x: 1550, y: 390, count: 320, spread: 90 }, // East China, Japan, Korea
    { x: 1680, y: 760, count: 50, spread: 40 },  // SE Australia
  ];

  clusters.forEach((cl) => {
    for (let i = 0; i < cl.count; i++) {
      const px = cl.x + (Math.random() - 0.5) * cl.spread * (1 + Math.random());
      const py = cl.y + (Math.random() - 0.5) * cl.spread * 0.7;
      const size = Math.random() * 2.2 + 0.8;
      const alpha = Math.random() * 0.8 + 0.2;

      // Golden incandescent city glow
      ctx.fillStyle = `rgba(255, 210, 110, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();

      // Soft light bleed
      if (Math.random() > 0.7) {
        ctx.fillStyle = `rgba(255, 170, 60, ${alpha * 0.25})`;
        ctx.beginPath();
        ctx.arc(px, py, size * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 9. PROCEDURAL NEBULA GAS CLOUD SPRITE
export function createNebulaDustTexture(color: string = '#8a3ffc'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = 128;
  const cy = 128;
  const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 120);
  grad.addColorStop(0, color);
  grad.addColorStop(0.3, color + '99');
  grad.addColorStop(0.6, color + '33');
  grad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 120, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// 10. MERCURY: Heavily cratered silicate crust with Caloris Basin & impact rays
export function createMercuryTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Grey rocky regolith base
  ctx.fillStyle = '#6e6f73';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Surface tonal variation
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 40 + 10;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(60,60,65,0.4)' : 'rgba(150,150,155,0.3)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Craters & ray systems
  for (let c = 0; c < 120; c++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const rad = Math.random() * 25 + 5;

    // Rim highlight
    ctx.strokeStyle = 'rgba(210, 210, 215, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.stroke();

    // Dark crater bowl
    ctx.fillStyle = 'rgba(40, 40, 45, 0.7)';
    ctx.beginPath();
    ctx.arc(cx, cy, rad * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // Central peak
    if (rad > 12) {
      ctx.fillStyle = 'rgba(200, 200, 205, 0.8)';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return new THREE.CanvasTexture(canvas);
}

// 11. VENUS: Dense, turbulent sulfuric acid atmosphere with golden-cream vortex clouds
export function createVenusTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#a57e3f');
  grad.addColorStop(0.2, '#c99f57');
  grad.addColorStop(0.4, '#e6be79');
  grad.addColorStop(0.5, '#f4d89e');
  grad.addColorStop(0.6, '#e6be79');
  grad.addColorStop(0.8, '#c99f57');
  grad.addColorStop(1, '#a57e3f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Chevron-shaped atmospheric cloud waves
  for (let i = 0; i < 60; i++) {
    const y = Math.random() * canvas.height;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 245, 220, 0.25)' : 'rgba(150, 100, 40, 0.2)';
    ctx.beginPath();
    ctx.ellipse(Math.random() * canvas.width, y, 140, 18, (Math.random() - 0.5) * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// 12. MOON: Lunar Maria (dark basalt plains) and bright cratered anorthosite highlands
export function createMoonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Highlands bright base
  ctx.fillStyle = '#b0b3b8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dark Lunar Maria (Sea of Tranquility, Oceanus Procellarum, Sea of Serenity)
  ctx.fillStyle = '#484b50';
  const maria = [
    { x: 380, y: 220, rx: 110, ry: 70 },
    { x: 490, y: 260, rx: 80, ry: 60 },
    { x: 620, y: 190, rx: 90, ry: 80 },
    { x: 320, y: 310, rx: 140, ry: 100 },
    { x: 550, y: 340, rx: 70, ry: 50 }
  ];
  maria.forEach((m) => {
    ctx.beginPath();
    ctx.ellipse(m.x, m.y, m.rx, m.ry, 0.2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Thousands of impact craters & Tycho-like ray systems
  for (let i = 0; i < 180; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const rad = Math.random() * 20 + 3;

    ctx.fillStyle = 'rgba(35, 38, 42, 0.7)';
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(240, 242, 245, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Tycho bright crater rays
  const tychoX = 480;
  const tychoY = 380;
  for (let r = 0; r < 24; r++) {
    const angle = (r * Math.PI * 2) / 24;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(tychoX, tychoY);
    ctx.lineTo(tychoX + Math.cos(angle) * 160, tychoY + Math.sin(angle) * 160);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

// 13. URANUS: Aquamarine cyan atmosphere with subtle methane bands & polar collar
export function createUranusTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#5ab4c5');
  grad.addColorStop(0.3, '#76cedd');
  grad.addColorStop(0.5, '#8be4f0');
  grad.addColorStop(0.7, '#76cedd');
  grad.addColorStop(1, '#5ab4c5');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle zonal hazes
  for (let i = 0; i < 30; i++) {
    const y = Math.random() * canvas.height;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(0, y, canvas.width, Math.random() * 10 + 2);
  }

  return new THREE.CanvasTexture(canvas);
}

// 14. NEPTUNE: Deep cobalt-azure storm bands & Great Dark Spot with white methane cirrus
export function createNeptuneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#1c3066');
  grad.addColorStop(0.3, '#26458c');
  grad.addColorStop(0.5, '#3b62ba');
  grad.addColorStop(0.7, '#26458c');
  grad.addColorStop(1, '#1c3066');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Great Dark Spot vortex
  ctx.fillStyle = '#0d1838';
  ctx.beginPath();
  ctx.ellipse(canvas.width * 0.4, canvas.height * 0.58, 80, 45, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // White high-altitude methane cirrus streaks ("Scooter")
  for (let c = 0; c < 25; c++) {
    const sx = Math.random() * canvas.width;
    const sy = canvas.height * 0.35 + Math.random() * (canvas.height * 0.4);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.ellipse(sx, sy, Math.random() * 50 + 20, 3, (Math.random() - 0.5) * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// 15. PLUTO: Brownish tholin plains with the bright nitrogen ice heart (Tombaugh Regio)
export function createPlutoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Reddish-brown organic tholin crust
  ctx.fillStyle = '#7a5135';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dark equatorial belt (Cthulhu Macula)
  ctx.fillStyle = '#3a2012';
  ctx.fillRect(0, canvas.height * 0.55, canvas.width, 90);

  // Tombaugh Regio: Bright nitrogen ice heart
  ctx.fillStyle = '#eedec5';
  const hx = canvas.width * 0.5;
  const hy = canvas.height * 0.45;
  ctx.beginPath();
  ctx.ellipse(hx - 35, hy, 45, 55, -0.2, 0, Math.PI * 2);
  ctx.ellipse(hx + 35, hy, 45, 55, 0.2, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}


