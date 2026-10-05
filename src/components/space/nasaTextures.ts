import * as THREE from 'three';

// NASA & ESA Photorealistic Public Domain Planetary Textures (2K / 1K High-Def)
// Sources: NASA Visible Earth, USGS Astrogeology, Solar System Scope (CC-BY 4.0), Three.js Official Repository
// Sitede barındırılır (public/textures/planets, çoğu WebP): dış CDN'e ve sabitlenmemiş @master/@dev dallarına bağlı değil
export const NASA_TEXTURES = {
  sun: '/textures/planets/sun.webp',
  earthMap: '/textures/planets/earthMap.webp',
  earthNight: '/textures/planets/earthNight.webp',
  earthClouds: '/textures/planets/earthClouds.png',
  earthSpecular: '/textures/planets/earthSpecular.webp',
  earthNormal: '/textures/planets/earthNormal.webp',
  moon: '/textures/planets/moon.webp',
  mars: '/textures/planets/mars.webp',
  jupiter: '/textures/planets/jupiter.webp',
  saturn: '/textures/planets/saturn.webp',
  mercury: '/textures/planets/mercury.webp',
  venus: '/textures/planets/venus.webp',
  uranus: '/textures/planets/uranus.webp',
  uranusRing: '/textures/planets/uranusRing.webp',
  neptune: '/textures/planets/neptune.webp',
  pluto: '/textures/planets/pluto.webp',
  saturnRing: '/textures/planets/saturnRing.webp',
  saturnRingPattern: '/textures/planets/saturnRingPattern.webp',
  milkyWay: '/textures/planets/milkyWay.png',
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
    uTime: { value: 0 },
    uDoppler: { value: 0.85 },
    innerRadius: { value: 2.2 },
    outerRadius: { value: 7.8 },
  },
  vertexShader: `
    varying vec3 vLocalPos;
    varying vec3 vWorldPos;
    void main() {
      vLocalPos = position;
      vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uDoppler;
    uniform float innerRadius;
    uniform float outerRadius;
    varying vec3 vLocalPos;
    varying vec3 vWorldPos;

    void main() {
      // Distance from singularity in local plane
      float r = length(vLocalPos.xy);
      float norm = clamp((r - innerRadius) / (outerRadius - innerRadius), 0.0, 1.0);

      // Continuous polar angle in [-PI, PI] (zero seam discontinuity)
      float angle = atan(vLocalPos.y, vLocalPos.x);

      // Relativistic Keplerian differential rotation: inner orbits spin much faster (omega ~ r^-1.5)
      float omega = (uTime * 2.2) / pow(max(r, 1.2), 1.25);
      float spinAngle = angle - omega;

      // Multi-frequency spiral turbulent plasma filaments
      float wave1 = sin(spinAngle * 8.0 + r * 3.8);
      float wave2 = sin(spinAngle * 14.0 - r * 5.5 + uTime * 1.1);
      float wave3 = cos(spinAngle * 24.0 + r * 8.5);
      float plasma = 0.68 + 0.18 * wave1 + 0.10 * wave2 + 0.04 * wave3;

      // Relativistic Doppler beaming: approaching side (x < 0) boosted by aberration
      float approach = -sin(angle);
      float dopplerFactor = clamp(1.0 + approach * uDoppler * 0.85, 0.22, 2.7);

      // Relativistic temperature / color ramp:
      // Inner ISCO: Ultra-hot (25,000K) white-blue -> Radiant gold -> Amber -> Deep crimson
      vec3 colCore = vec3(1.0, 0.98, 0.92);
      vec3 colMid = vec3(1.0, 0.68, 0.18);
      vec3 colOuter = vec3(0.85, 0.22, 0.04);
      vec3 colSmoke = vec3(0.25, 0.04, 0.01);

      vec3 col = mix(colCore, colMid, smoothstep(0.0, 0.35, norm));
      col = mix(col, colOuter, smoothstep(0.35, 0.85, norm));
      col = mix(col, colSmoke, smoothstep(0.85, 1.0, norm));

      // Relativistic Doppler spectral shift
      vec3 dopplerCol = mix(vec3(0.8, 0.95, 1.25), vec3(1.2, 0.75, 0.4), clamp(-approach * 0.5 + 0.5, 0.0, 1.0));
      col *= plasma * dopplerFactor * dopplerCol;

      // Razor-sharp inner edge at ISCO, smooth exponential smoke falloff at outer rim
      float alpha = smoothstep(0.0, 0.06, norm) * (1.0 - smoothstep(0.82, 1.0, norm));
      gl_FragColor = vec4(col * 1.35, alpha * 0.95);
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
    ringInner: { value: 2.75 },
    ringOuter: { value: 6.8 },
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
      float NdotL = max(0.08, dot(norm, sunDir));

      // Raycast from globe surface towards Sun: does ray cross the equatorial ring plane y=0?
      float shadowFactor = 1.0;
      if (abs(sunDir.y) > 0.001) {
        float t = -vLocalPos.y / sunDir.y;
        if (t > 0.0) {
          vec3 hit = vLocalPos + t * sunDir;
          float r = length(hit.xz);
          if (r >= ringInner && r <= ringOuter) {
            // Point is shaded by the rings!
            // Cassini gap at norm ~0.60 lets light through!
            float normR = (r - ringInner) / (ringOuter - ringInner);
            if (normR > 0.58 && normR < 0.63) {
              shadowFactor = 0.85; // Cassini division lets sunlight leak through
            } else {
              shadowFactor = 0.22; // Dense rings cast prominent shadow
            }
          }
        }
      }

      vec4 tex = texture2D(planetMap, vUv);
      vec3 globeColor = tex.a > 0.0 ? tex.rgb : vec3(0.91, 0.83, 0.67);
      gl_FragColor = vec4(globeColor * NdotL * shadowFactor, 1.0);
    }
  `,
};

// -------------------------------------------------------------
// SATURN RING WITH CONCENTRIC RADIAL MAPPING & ANALYTICAL GLOBE SHADOW
// -------------------------------------------------------------
export const SaturnRingShader = {
  uniforms: {
    ringMap: { value: null as THREE.Texture | null },
    sunDirectionLocal: { value: new THREE.Vector3(-0.95, 0.18, 0.25) },
    saturnRadius: { value: 2.5 },
    ringInner: { value: 2.75 },
    ringOuter: { value: 6.8 },
  },
  vertexShader: `
    varying vec3 vLocalPos;
    varying float vRadius;
    void main() {
      vLocalPos = position;
      vRadius = length(position.xy);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D ringMap;
    uniform vec3 sunDirectionLocal;
    uniform float saturnRadius;
    uniform float ringInner;
    uniform float ringOuter;

    varying vec3 vLocalPos;
    varying float vRadius;

    void main() {
      // 1. Concentric Radial Distance (100% circular, NO diagonal stripes!)
      float norm = clamp((vRadius - ringInner) / (ringOuter - ringInner), 0.0, 1.0);

      // 2. Sample Texture Radially or Procedural High-Precision Cassini Profile
      vec4 tex = texture2D(ringMap, vec2(norm, 0.5));
      
      // Photorealistic Ring Bands Profile:
      // C Ring (Crepe): 0.0 - 0.20
      // B Ring (Dense & Bright): 0.20 - 0.58
      // Cassini Division (Empty Gap): 0.58 - 0.63
      // A Ring: 0.63 - 0.92 (Encke gap at 0.82)
      // F Ring: 0.95 - 1.0
      vec3 ringColor = vec3(0.88, 0.80, 0.65);
      float ringAlpha = 0.85;

      if (norm < 0.20) {
        // C Ring
        ringColor = vec3(0.55, 0.48, 0.38);
        ringAlpha = smoothstep(0.0, 0.08, norm) * 0.45;
      } else if (norm < 0.58) {
        // B Ring (brightest, high albedo icy particles)
        float fineBands = 0.92 + 0.08 * sin(norm * 180.0);
        ringColor = vec3(0.95, 0.88, 0.72) * fineBands;
        ringAlpha = 0.95;
      } else if (norm < 0.63) {
        // Cassini Division (dark prominent gap)
        ringAlpha = 0.04;
      } else if (norm < 0.92) {
        // A Ring with Encke gap
        float isEncke = (norm > 0.81 && norm < 0.835) ? 0.08 : 1.0;
        float fineBands = 0.93 + 0.07 * sin(norm * 220.0);
        ringColor = vec3(0.86, 0.78, 0.64) * fineBands;
        ringAlpha = 0.78 * isEncke;
      } else {
        // Outer falloff to F ring
        ringAlpha = (1.0 - smoothstep(0.92, 1.0, norm)) * 0.35;
      }

      // If texture loaded successfully with color, blend it
      if (tex.a > 0.05 && (tex.r + tex.g + tex.b) > 0.1) {
        ringColor = mix(ringColor, tex.rgb * 1.15, 0.6);
        ringAlpha *= tex.a;
      }

      // 3. Exact Analytical Globe Shadow onto the Rings:
      // Ring is in XZ plane of Saturn, local position (x, 0, -y)
      vec3 posInSaturn = vec3(vLocalPos.x, 0.0, -vLocalPos.y);
      vec3 sunDir = normalize(sunDirectionLocal);
      
      float t = -dot(posInSaturn, sunDir);
      float shadow = 1.0;
      if (t > 0.0) {
        float d2 = dot(posInSaturn, posInSaturn) - t * t;
        float rSat2 = saturnRadius * saturnRadius;
        if (d2 < rSat2 * 1.05) {
          // Penumbra smooth transition at shadow boundary
          shadow = smoothstep(rSat2 * 0.92, rSat2 * 1.05, d2) * 0.84 + 0.16;
        }
      }

      gl_FragColor = vec4(ringColor * shadow, ringAlpha);
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
