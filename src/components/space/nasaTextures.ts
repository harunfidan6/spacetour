import * as THREE from 'three';

// NASA & ESA Photorealistic Public Domain Planetary Textures (2K / 1K High-Def)
// Sources: NASA Visible Earth, USGS Astrogeology, Solar System Scope (CC-BY 4.0), Three.js Official Repository
export const NASA_TEXTURES = {
  sun: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/sunmap.jpg',
  earthMap: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg',
  earthClouds: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_clouds_1024.png',
  earthSpecular: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_specular_2048.jpg',
  earthNormal: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_normal_2048.jpg',
  moon: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/moon_1024.jpg',
  mars: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/marsmap1k.jpg',
  jupiter: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/jupitermap.jpg',
  saturn: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/saturnmap.jpg',
  saturnRing: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/saturnringcolor.jpg',
  saturnRingPattern: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/saturnringpattern.gif',
  milkyWay: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/galaxy_starfield.png',
};

// Texture Loader cache to prevent duplicate fetches
const textureCache = new Map<string, THREE.Texture>();
const loader = typeof window !== 'undefined' ? new THREE.TextureLoader() : null;

export function loadNasaTexture(url: string): THREE.Texture | null {
  if (!loader) return null;
  if (textureCache.has(url)) {
    return textureCache.get(url)!;
  }
  const tex = loader.load(
    url,
    (loadedTex) => {
      loadedTex.colorSpace = THREE.SRGBColorSpace;
      loadedTex.generateMipmaps = true;
      loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
    },
    undefined,
    (err) => {
      console.warn('Failed to load NASA texture from CDN:', url, err);
    }
  );
  textureCache.set(url, tex);
  return tex;
}

// -------------------------------------------------------------
// ATMOSPHERIC RAYLEIGH SCATTERING FRESNEL SHADER (NASA Blue Marble Glow)
// -------------------------------------------------------------
export const AtmosphereShader = {
  uniforms: {
    color: { value: new THREE.Color(0x00aaff) },
    glowColor: { value: new THREE.Color(0x0077ff) },
    viewVector: { value: new THREE.Vector3() },
    coefficient: { value: 0.7 },
    power: { value: 3.5 },
  },
  vertexShader: `
    uniform vec3 viewVector;
    uniform float coefficient;
    uniform float power;
    varying float intensity;
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec3 vNormel = normalize(normalMatrix * viewVector);
      intensity = pow(coefficient - dot(vNormal, vec3(0.0, 0.0, 1.0)), power);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    varying float intensity;
    void main() {
      vec3 glow = color * intensity;
      gl_FragColor = vec4(glow, intensity * 0.75);
    }
  `,
};

// -------------------------------------------------------------
// RELATIVISTIC BLACK HOLE ACCRETION DISK SHADER (Interstellar Gargantua)
// -------------------------------------------------------------
export const AccretionDiskShader = {
  uniforms: {
    time: { value: 0 },
    innerRadius: { value: 3.2 },
    outerRadius: { value: 9.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      // Distance from center
      float r = length(vPosition.xy);
      float norm = clamp((r - 3.2) / (9.5 - 3.2), 0.0, 1.0);
      
      // Relativistic Doppler beaming: approaching side (x < 0) is brighter and shifted blue-white
      float doppler = 1.0 - 0.45 * (vPosition.x / r);
      
      // Multi-frequency spiral plasma temperature
      float angle = atan(vPosition.y, vPosition.x);
      float spiral = sin(angle * 8.0 - time * 3.0 + r * 2.0);
      float turbulence = 0.8 + 0.2 * spiral;
      
      // Color ramp: Inner ultra-hot blue-white (15,000K) -> Mid golden-orange -> Outer deep crimson
      vec3 colInner = vec3(1.0, 0.95, 0.85);
      vec3 colMid = vec3(1.0, 0.6, 0.15);
      vec3 colOuter = vec3(0.8, 0.15, 0.02);
      
      vec3 col = mix(colInner, colMid, smoothstep(0.0, 0.4, norm));
      col = mix(col, colOuter, smoothstep(0.4, 1.0, norm));
      col *= doppler * turbulence;
      
      // Soft alpha falloff at edges
      float alpha = smoothstep(0.0, 0.1, norm) * (1.0 - smoothstep(0.85, 1.0, norm));
      gl_FragColor = vec4(col, alpha * 0.92);
    }
  `,
};
