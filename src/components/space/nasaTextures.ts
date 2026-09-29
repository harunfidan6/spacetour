import * as THREE from 'three';

// NASA & ESA Photorealistic Public Domain Planetary Textures (2K / 1K High-Def)
// Sources: NASA Visible Earth, USGS Astrogeology, Solar System Scope (CC-BY 4.0), Three.js Official Repository
export const NASA_TEXTURES = {
  sun: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/sunmap.jpg',
  earthMap: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg',
  earthNight: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_lights_2048.png',
  earthClouds: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_clouds_1024.png',
  earthSpecular: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_specular_2048.jpg',
  earthNormal: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_normal_2048.jpg',
  moon: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/moon_1024.jpg',
  mars: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/marsmap1k.jpg',
  jupiter: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/jupitermap.jpg',
  saturn: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/saturnmap.jpg',
  mercury: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/mercurymap.jpg',
  venus: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/venusmap.jpg',
  venusAtmosphere: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/venusatmosphere.jpg',
  uranus: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/uranusmap.jpg',
  uranusRing: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/uranusringcolour.jpg',
  neptune: 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/neptunemap.jpg',
  pluto: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/moon_1024.jpg',
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

// -------------------------------------------------------------
// EARTH DYNAMIC DAY/NIGHT TERMINATOR + NASA BLACK MARBLE LIGHTS
// -------------------------------------------------------------
export const EarthDayNightShader = {
  uniforms: {
    dayMap: { value: null as THREE.Texture | null },
    nightMap: { value: null as THREE.Texture | null },
    specularMap: { value: null as THREE.Texture | null },
    sunDirection: { value: new THREE.Vector3(-1, 0, 0) },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    void main() {
      vUv = uv;
      vNormal = normalize(mat3(modelMatrix) * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform sampler2D dayMap;
    uniform sampler2D nightMap;
    uniform sampler2D specularMap;
    uniform vec3 sunDirection;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 sunDir = normalize(sunDirection);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);

      // Light incidence angle relative to Sun
      float NdotL = dot(normal, sunDir);

      // Smooth terminator twilight transition
      float dayFactor = smoothstep(-0.10, 0.16, NdotL);
      float nightFactor = 1.0 - smoothstep(-0.16, 0.08, NdotL);

      vec4 dayCol = texture2D(dayMap, vUv);
      vec4 nightCol = texture2D(nightMap, vUv);
      float specStrength = texture2D(specularMap, vUv).r;

      // Diffuse daylight
      float diffuse = clamp(NdotL, 0.04, 1.0);
      vec3 colorDay = dayCol.rgb * diffuse;

      // Specular ocean glint
      vec3 halfDir = normalize(sunDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 32.0) * specStrength * dayFactor;
      colorDay += vec3(0.9, 0.95, 1.0) * spec * 0.85;

      // Glowing golden night city lights (NASA Black Marble)
      vec3 colorNight = nightCol.rgb * vec3(1.3, 1.05, 0.7) * nightFactor * 1.85;

      gl_FragColor = vec4(colorDay + colorNight, 1.0);
    }
  `,
};

// -------------------------------------------------------------
// SATURN GLOBE WITH ANALYTICAL RING SHADOW PROJECTION
// -------------------------------------------------------------
export const SaturnGlobeShader = {
  uniforms: {
    planetMap: { value: null as THREE.Texture | null },
    sunDirectionLocal: { value: new THREE.Vector3(-0.95, 0.18, 0.25) },
    ringInner: { value: 3.1 },
    ringOuter: { value: 7.2 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vLocalPos;
    void main() {
      vUv = uv;
      vNormal = normalize(normal);
      vLocalPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D planetMap;
    uniform vec3 sunDirectionLocal;
    uniform float ringInner;
    uniform float ringOuter;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vLocalPos;

    void main() {
      vec3 norm = normalize(vNormal);
      vec3 sunDir = normalize(sunDirectionLocal);
      float NdotL = max(0.06, dot(norm, sunDir));

      // Raycast from globe surface towards Sun: intersects ring plane y=0?
      float shadowFactor = 1.0;
      if (abs(sunDir.y) > 0.0001) {
        float t = -vLocalPos.y / sunDir.y;
        if (t > 0.0) {
          vec3 hit = vLocalPos + t * sunDir;
          float r = length(hit.xz);
          if (r >= ringInner && r <= ringOuter) {
            // Point is covered by the ring shadow!
            shadowFactor = 0.20;
          }
        }
      }

      vec4 tex = texture2D(planetMap, vUv);
      gl_FragColor = vec4(tex.rgb * NdotL * shadowFactor, 1.0);
    }
  `,
};

// -------------------------------------------------------------
// SATURN RING WITH ANALYTICAL GLOBE SHADOW PROJECTION
// -------------------------------------------------------------
export const SaturnRingShader = {
  uniforms: {
    ringMap: { value: null as THREE.Texture | null },
    sunDirectionLocal: { value: new THREE.Vector3(-0.95, 0.18, 0.25) },
    saturnRadius: { value: 2.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vLocalPos;
    void main() {
      vUv = uv;
      vLocalPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D ringMap;
    uniform vec3 sunDirectionLocal;
    uniform float saturnRadius;

    varying vec2 vUv;
    varying vec3 vLocalPos;

    void main() {
      vec3 sunDir = normalize(sunDirectionLocal);
      
      // Ring vertices lie in local XY, rotated by -90 deg into group XZ plane
      vec3 posInGroup = vec3(vLocalPos.x, 0.0, vLocalPos.y);
      float b = dot(posInGroup, sunDir);
      float c = dot(posInGroup, posInGroup) - (saturnRadius * saturnRadius);
      float disc = b * b - c;
      
      float shadow = 1.0;
      if (disc > 0.0) {
        float t = -b - sqrt(disc);
        if (t > 0.0) {
          // Blocked by Saturn's spherical body!
          shadow = 0.16;
        }
      }

      vec4 tex = texture2D(ringMap, vUv);
      gl_FragColor = vec4(tex.rgb * shadow, tex.a * 0.94);
    }
  `,
};

// -------------------------------------------------------------
// SOLAR PHOTOSPHERE GRANULATION & LIMB DARKENING SHADER
// -------------------------------------------------------------
export const SolarGranulationShader = {
  uniforms: {
    time: { value: 0 },
    sunMap: { value: null as THREE.Texture | null },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform sampler2D sunMap;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Convective Granulation Cells (Multi-frequency Simmer)
      vec3 p = vPosition * 4.2;
      float c1 = sin(p.x * 2.8 + time * 0.7) * cos(p.y * 2.8 - time * 0.5) * sin(p.z * 2.8 + time * 0.3);
      float c2 = sin(p.x * 6.5 - time * 1.1) * cos(p.y * 6.5 + time * 0.9) * sin(p.z * 6.5 - time * 0.7);
      float granules = 0.85 + 0.15 * (c1 + 0.5 * c2);

      // Eddington Stellar Atmosphere Limb Darkening
      vec3 normal = normalize(vNormal);
      float mu = max(0.0, normal.z);
      float limb = 0.38 + 0.62 * pow(mu, 0.72);

      vec4 baseTex = texture2D(sunMap, vUv);
      vec3 coreGlow = baseTex.rgb * granules * limb;

      // Fiery plasma edge limb
      vec3 edgeColor = vec3(1.0, 0.42, 0.04);
      vec3 finalCol = mix(edgeColor, coreGlow, limb);

      gl_FragColor = vec4(finalCol * 1.25, 1.0);
    }
  `,
};
