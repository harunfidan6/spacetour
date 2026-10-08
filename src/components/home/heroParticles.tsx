'use client';
/* eslint-disable react-hooks/immutability -- the R3F frame loop mutates three.js objects (buffers, uniforms, pooled vectors) by design */

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { heroScene } from './heroScene';
import { HOT, SOFT, placeStreak, radialTexture, streakMaterial } from './heroEffects';

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/* ---------- Parçacık havuzu ---------- */

const PARTICLE_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  uniform float uScale;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vAlpha = aAlpha;
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale / max(-mv.z, 0.001);
    gl_Position = projectionMatrix * mv;
  }
`;
const PARTICLE_FRAGMENT = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.0, r);
    a = a * a * vAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor * a, a);
  }
`;

/**
 * Sabit boyutlu, halka biçiminde dolan parçacık havuzu. Her parçacığın konumu, hızı, ömrü, boyu ve
 * rengi tutulur; çizim tek bir Points çağrısıyla yapılır.
 */
class ParticlePool {
  readonly geometry = new THREE.BufferGeometry();
  readonly material: THREE.ShaderMaterial;
  readonly pos: Float32Array;
  readonly vel: Float32Array;
  readonly age: Float32Array;
  readonly life: Float32Array;
  readonly size0: Float32Array;
  readonly alpha0: Float32Array;
  readonly c0: Float32Array;
  readonly c1: Float32Array;
  private readonly size: Float32Array;
  private readonly alpha: Float32Array;
  private readonly color: Float32Array;
  private next = 0;

  constructor(readonly count: number) {
    this.pos = new Float32Array(count * 3);
    this.vel = new Float32Array(count * 3);
    this.age = new Float32Array(count).fill(1e9);
    this.life = new Float32Array(count).fill(1);
    this.size0 = new Float32Array(count);
    this.alpha0 = new Float32Array(count);
    this.c0 = new Float32Array(count * 3);
    this.c1 = new Float32Array(count * 3);
    this.size = new Float32Array(count);
    this.alpha = new Float32Array(count);
    this.color = new Float32Array(count * 3);
    const attr = (a: Float32Array, n: number) => new THREE.BufferAttribute(a, n).setUsage(THREE.DynamicDrawUsage);
    this.geometry.setAttribute('position', attr(this.pos, 3));
    this.geometry.setAttribute('aSize', attr(this.size, 1));
    this.geometry.setAttribute('aAlpha', attr(this.alpha, 1));
    this.geometry.setAttribute('aColor', attr(this.color, 3));
    this.material = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERTEX,
      fragmentShader: PARTICLE_FRAGMENT,
      uniforms: { uScale: { value: 400 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }

  emit(p: THREE.Vector3, v: THREE.Vector3, life: number, size: number, alpha: number, from: THREE.Color, to: THREE.Color) {
    const i = this.next;
    this.next = (this.next + 1) % this.count;
    this.pos[i * 3] = p.x;
    this.pos[i * 3 + 1] = p.y;
    this.pos[i * 3 + 2] = p.z;
    this.vel[i * 3] = v.x;
    this.vel[i * 3 + 1] = v.y;
    this.vel[i * 3 + 2] = v.z;
    this.age[i] = 0;
    this.life[i] = life;
    this.size0[i] = size;
    this.alpha0[i] = alpha;
    this.c0[i * 3] = from.r;
    this.c0[i * 3 + 1] = from.g;
    this.c0[i * 3 + 2] = from.b;
    this.c1[i * 3] = to.r;
    this.c1[i * 3 + 1] = to.g;
    this.c1[i * 3 + 2] = to.b;
  }

  /** `push` > 0: Güneş'ten (dünya merkezi) dışarı doğru ivme, örn. ışınım basıncı. `drag`: hız sönümü. */
  step(dt: number, push = 0, drag = 0) {
    const damp = drag > 0 ? Math.exp(-drag * dt) : 1;
    for (let i = 0; i < this.count; i++) {
      const k = this.age[i] / this.life[i];
      if (k >= 1) {
        this.alpha[i] = 0;
        continue;
      }
      this.age[i] += dt;
      const j = i * 3;
      if (push) {
        const x = this.pos[j];
        const y = this.pos[j + 1];
        const z = this.pos[j + 2];
        const inv = push / Math.max(Math.hypot(x, y, z), 0.5);
        this.vel[j] += x * inv * dt;
        this.vel[j + 1] += y * inv * dt;
        this.vel[j + 2] += z * inv * dt;
      }
      this.vel[j] *= damp;
      this.vel[j + 1] *= damp;
      this.vel[j + 2] *= damp;
      this.pos[j] += this.vel[j] * dt;
      this.pos[j + 1] += this.vel[j + 1] * dt;
      this.pos[j + 2] += this.vel[j + 2] * dt;
      // Doğarken hızla belirir, ömrünün sonuna doğru söner; boyu biraz büyür
      const fade = Math.min(1, k * 6) * (1 - k);
      this.alpha[i] = this.alpha0[i] * fade;
      this.size[i] = this.size0[i] * (0.7 + 0.8 * k);
      this.color[j] = this.c0[j] + (this.c1[j] - this.c0[j]) * k;
      this.color[j + 1] = this.c0[j + 1] + (this.c1[j + 1] - this.c0[j + 1]) * k;
      this.color[j + 2] = this.c0[j + 2] + (this.c1[j + 2] - this.c0[j + 2]) * k;
    }
    for (const name of ['position', 'aSize', 'aAlpha', 'aColor']) this.geometry.attributes[name].needsUpdate = true;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

/** Nokta boyutlarını dünya birimine bağlar: ekran yüksekliği, görüş açısı ve piksel yoğunluğu. */
function usePointScale(pools: ParticlePool[]) {
  const { size, camera, gl } = useThree();
  useFrame(() => {
    const fov = (camera as THREE.PerspectiveCamera).fov;
    const scale = (size.height * gl.getPixelRatio() * 0.5) / Math.tan(THREE.MathUtils.degToRad(fov / 2));
    for (const p of pools) p.material.uniforms.uScale.value = scale;
  });
}

/* ---------- Kuyruklu yıldızlar ---------- */

export interface CometOrbit {
  /** Büyük yarı eksen, basıklık, günberi yönü (rad), başlangıç açısı (rad) */
  a: number;
  e: number;
  omega: number;
  start: number;
  /** Yörünge düzleminin eğimi */
  tilt: [number, number, number];
  /** Kuyruk ve baş boyutu çarpanı */
  scale: number;
  /** Kepler hız sabiti: büyüdükçe daha hızlı */
  pace: number;
}

const ION_FROM = new THREE.Color('#e6f2ff');
const ION_TO = new THREE.Color('#3f7bff');
const DUST_FROM = new THREE.Color('#fff2d2');
const DUST_TO = new THREE.Color('#b9772f');

/**
 * Parçacıklı kuyruklu yıldız: parlak çekirdek ve koma, Güneş'in tam tersine akan mavi iyon kuyruğu,
 * yörüngede geride kalıp ışınım basıncıyla kıvrılan geniş toz kuyruğu. Güneş'e yaklaştıkça hızlanır,
 * kuyrukları uzar ve parlar.
 */
export function Comet({ orbit }: { orbit: CometOrbit }) {
  const { camera } = useThree();
  const ion = useMemo(() => new ParticlePool(260), []);
  const dust = useMemo(() => new ParticlePool(380), []);
  usePointScale([ion, dust]);
  const coma = useRef<THREE.Sprite>(null);
  const core = useRef<THREE.Sprite>(null);
  const beam = useRef<THREE.Mesh>(null);
  const beamMat = useMemo(() => streakMaterial('#dcebff', '#4f86ff', 1.6, 0), []);
  const soft = useMemo(() => radialTexture(SOFT), []);
  const hot = useMemo(() => radialTexture(HOT), []);
  const tilt = useMemo(() => new THREE.Euler(...orbit.tilt), [orbit.tilt]);
  const nu = useRef(orbit.start);
  const debt = useRef({ ion: 0, dust: 0 });
  const v = useMemo(
    () => ({ pos: new THREE.Vector3(), prev: new THREE.Vector3(), vel: new THREE.Vector3(), away: new THREE.Vector3(), tmp: new THREE.Vector3(), jitter: new THREE.Vector3(), end: new THREE.Vector3() }),
    []
  );
  const p = orbit.a * (1 - orbit.e * orbit.e);

  useEffect(
    () => () => {
      ion.dispose();
      dust.dispose();
      beamMat.dispose();
    },
    [ion, dust, beamMat]
  );

  const at = (angle: number, out: THREE.Vector3) => {
    const r = p / (1 + orbit.e * Math.cos(angle));
    return out.set(Math.cos(angle + orbit.omega) * r, 0, Math.sin(angle + orbit.omega) * r).applyEuler(tilt);
  };

  useFrame((_, dt) => {
    const delta = Math.min(dt, 0.05);
    const s = orbit.scale;
    const r = p / (1 + orbit.e * Math.cos(nu.current));
    at(nu.current, v.prev);
    if (!heroScene.frozen) nu.current += (delta * orbit.pace) / (r * r);
    if (nu.current > Math.PI) nu.current -= Math.PI * 2;
    at(nu.current, v.pos);
    v.vel.subVectors(v.pos, v.prev).divideScalar(Math.max(delta, 1e-4));
    v.away.copy(v.pos).normalize();

    const show = THREE.MathUtils.clamp(heroScene.intro * 1.5 - 0.5, 0, 1);
    // Güneş'e yakınken etkinlik artar (yaklaşık 1/r²), uzakta sönük bir nokta kalır
    const activity = THREE.MathUtils.clamp((9 / r) * (9 / r), 0.12, 2.2);

    if (!heroScene.frozen && show > 0) {
      const rate = THREE.MathUtils.clamp(activity, 0.55, 1.4);
      debt.current.ion += delta * 150 * rate;
      debt.current.dust += delta * 190 * rate;
      while (debt.current.ion >= 1) {
        debt.current.ion -= 1;
        v.jitter.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).multiplyScalar(0.12 * s);
        v.tmp.copy(v.away).multiplyScalar(rand(5, 8) * s * (0.6 + 0.4 * activity)).add(v.jitter);
        ion.emit(v.pos, v.tmp, rand(1.1, 1.7), rand(0.22, 0.4) * s, 0.9 * show, ION_FROM, ION_TO);
      }
      while (debt.current.dust >= 1) {
        debt.current.dust -= 1;
        // Toz, çekirdeğin yörünge hızının bir kısmını korur: yörüngenin gerisinde kalıp kıvrılır
        v.jitter.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).multiplyScalar(0.25 * s);
        v.tmp.copy(v.vel).multiplyScalar(0.55).addScaledVector(v.away, rand(0.6, 1.6) * s).add(v.jitter);
        dust.emit(v.pos, v.tmp, rand(2.2, 3.4), rand(0.45, 0.9) * s, 0.5 * show, DUST_FROM, DUST_TO);
      }
    }
    ion.step(delta, 0, 0);
    dust.step(delta, 1.4 * s, 0.6);

    if (coma.current) {
      coma.current.position.copy(v.pos);
      coma.current.scale.setScalar((1.2 + 1.1 * Math.min(activity, 1.6)) * s);
      (coma.current.material as THREE.SpriteMaterial).opacity = 0.75 * show;
    }
    if (core.current) {
      core.current.position.copy(v.pos);
      core.current.scale.setScalar((0.4 + 0.25 * Math.min(activity, 1.6)) * s);
      (core.current.material as THREE.SpriteMaterial).opacity = show;
    }
    if (beam.current) {
      // Parçacıkların altında ince, kesintisiz iyon ışını: kuyruk seyrekken de çizgi okunur
      v.end.copy(v.pos).addScaledVector(v.away, (4 + 6 * Math.min(activity, 1.4)) * s);
      placeStreak(beam.current, v.end, v.pos, 0.18 * s, camera);
      beamMat.uniforms.uOpacity.value = 0.45 * show * Math.min(1, activity);
    }
  });

  return (
    <>
      <points geometry={dust.geometry} material={dust.material} frustumCulled={false} />
      <points geometry={ion.geometry} material={ion.material} frustumCulled={false} />
      <mesh ref={beam} geometry={UNIT} material={beamMat} frustumCulled={false} />
      <sprite ref={coma}>
        <spriteMaterial map={soft} color="#bfe0ff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
      <sprite ref={core}>
        <spriteMaterial map={hot} color="#f6fbff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
    </>
  );
}

const UNIT = new THREE.PlaneGeometry(1, 1);

/* ---------- Güneş etkinliği: ilmekler, parlamalar, taç kütle atımları ---------- */

const LOOP_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const LOOP_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uGrow;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    // Ayaklardan tepeye akan plazma: ilmek önce ayaktan uzar, sonra akış bantları kayar
    float along = vUv.x;
    float reveal = smoothstep(uGrow, uGrow - 0.06, along);
    float flow = 0.72 + 0.28 * sin(along * 14.0 - uTime * 3.0);
    float ends = smoothstep(0.0, 0.06, along) * smoothstep(1.0, 0.94, along);
    float edge = pow(abs(dot(normalize(vN), normalize(vV))), 0.8);
    float a = reveal * ends * edge * flow * uOpacity;
    vec3 hot = vec3(1.0, 0.86, 0.55);
    vec3 cool = vec3(1.0, 0.32, 0.08);
    vec3 col = mix(cool, hot, flow * 0.8 + 0.2 * (1.0 - abs(along - 0.5) * 2.0));
    gl_FragColor = vec4(col * a * 1.6, a);
  }
`;

interface Loop {
  mesh: THREE.Mesh | null;
  t: number;
  life: number;
  grow: number;
}

const FLARE_FROM = new THREE.Color('#fff6dc');
const FLARE_TO = new THREE.Color('#ff4a12');
const _view = new THREE.Vector3();
const _n = new THREE.Vector3();
const _t = new THREE.Vector3();

/** Güneş kenarına yakın (kameradan bakınca silüet olan) rastgele bir yüzey normali. */
function limbNormal(viewLocal: THREE.Vector3, out: THREE.Vector3) {
  for (let i = 0; i < 24; i++) {
    out.set(rand(-1, 1), rand(-1, 1), rand(-1, 1));
    if (out.lengthSq() < 0.05) continue;
    out.normalize();
    const d = out.dot(viewLocal);
    if (d > -0.12 && d < 0.32) return out;
  }
  return out;
}

/**
 * Güneş'in kenarında yükselen manyetik ilmekler (prominanslar), ara ara parlayıp uzaya madde
 * savuran taç kütle atımları. Güneş grubunun içinde, Güneş yarıçapına göre çizilir.
 */
export function SolarActivity({ radius, loops = 4 }: { radius: number; loops?: number }) {
  const { camera } = useThree();
  const root = useRef<THREE.Group>(null);
  const flash = useRef<THREE.Sprite>(null);
  const cme = useMemo(() => new ParticlePool(420), []);
  usePointScale([cme]);
  const hot = useMemo(() => radialTexture(HOT), []);
  const loopMats = useMemo(
    () =>
      Array.from(
        { length: loops },
        () =>
          new THREE.ShaderMaterial({
            vertexShader: LOOP_VERTEX,
            fragmentShader: LOOP_FRAGMENT,
            uniforms: { uTime: { value: 0 }, uGrow: { value: 0 }, uOpacity: { value: 0 } },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
      ),
    [loops]
  );
  const state = useRef<Loop[]>(Array.from({ length: loops }, (_, i) => ({ mesh: null, t: 0, life: 0, grow: 1.4 + i * 0.7 })));
  const eruption = useRef({ wait: 2.5, t: 9, at: new THREE.Vector3() });
  const clock = useRef(0);
  const v = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3(), p: new THREE.Vector3(), d: new THREE.Vector3(), w: new THREE.Vector3() }), []);

  useEffect(
    () => () => {
      cme.dispose();
      loopMats.forEach((m) => m.dispose());
      state.current.forEach((l) => l.mesh?.geometry.dispose());
    },
    [cme, loopMats]
  );

  /** Yeni bir ilmek: kenara yakın iki ayak noktası arasında yükselen bir yay. */
  const respawnLoop = (loop: Loop, viewLocal: THREE.Vector3) => {
    if (!loop.mesh) return;
    limbNormal(viewLocal, _n);
    _t.crossVectors(_n, viewLocal);
    if (_t.lengthSq() < 1e-4) _t.set(0, 1, 0);
    _t.normalize().applyAxisAngle(_n, rand(-0.6, 0.6));
    const sep = rand(0.28, 0.55);
    const lift = rand(0.22, 0.5);
    v.a.copy(_n).multiplyScalar(radius * 0.99);
    v.b.copy(_n).addScaledVector(_t, sep).normalize().multiplyScalar(radius * 0.99);
    v.c.copy(_n).addScaledVector(_t, sep / 2).normalize().multiplyScalar(radius * (1 + lift * 2));
    const curve = new THREE.QuadraticBezierCurve3(v.a.clone(), v.c.clone(), v.b.clone());
    loop.mesh.geometry.dispose();
    loop.mesh.geometry = new THREE.TubeGeometry(curve, 56, radius * rand(0.035, 0.06), 10, false);
    loop.t = 0;
    loop.life = rand(6, 10);
    loop.grow = 1.4;
  };

  useFrame((_, dt) => {
    const delta = Math.min(dt, 0.05);
    const g = root.current;
    if (!g) return;
    if (!heroScene.frozen) clock.current += delta;
    const intro = heroScene.intro;
    // Kameranın Güneş'e göre yönü, Güneş'in kendi çerçevesinde
    g.worldToLocal(_view.copy(camera.position)).normalize();

    state.current.forEach((loop, i) => {
      const mat = loopMats[i];
      mat.uniforms.uTime.value = clock.current + i * 3.1;
      if (!loop.mesh) return;
      if (loop.life === 0) {
        // İlk açılışta ilmekler sırayla belirsin
        loop.grow -= delta;
        if (loop.grow <= 0 && intro > 0.8) respawnLoop(loop, _view);
        mat.uniforms.uOpacity.value = 0;
        return;
      }
      if (!heroScene.frozen) loop.t += delta;
      const k = loop.t / loop.life;
      mat.uniforms.uGrow.value = Math.min(1.06, (loop.t / 1.6) * 1.06);
      mat.uniforms.uOpacity.value = intro * Math.min(1, (1 - k) * 4) * 0.95;
      if (k >= 1) respawnLoop(loop, _view);
    });

    // Parlama ve taç kütle atımı
    const e = eruption.current;
    if (!heroScene.frozen && intro > 0.9) {
      e.wait -= delta;
      if (e.wait <= 0) {
        e.wait = rand(5, 9);
        e.t = 0;
        limbNormal(_view, e.at);
        for (let i = 0; i < 260; i++) {
          v.d.set(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize().multiplyScalar(rand(0.1, 0.45)).add(e.at).normalize();
          v.p.copy(e.at).multiplyScalar(radius * 1.02);
          v.w.copy(v.d).multiplyScalar(radius * rand(0.5, 1.9));
          cme.emit(v.p, v.w, rand(2.2, 3.6), radius * rand(0.05, 0.13), rand(0.5, 0.9), FLARE_FROM, FLARE_TO);
        }
      }
    }
    e.t += delta;
    cme.step(delta, 0, 0.35);
    if (flash.current) {
      const k = e.t / 1.3;
      flash.current.visible = k < 1;
      if (k < 1) {
        flash.current.position.copy(e.at).multiplyScalar(radius * 1.03);
        flash.current.scale.setScalar(radius * (0.5 + 1.6 * Math.sqrt(k)));
        (flash.current.material as THREE.SpriteMaterial).opacity = Math.pow(1 - k, 1.4);
      }
    }
  });

  return (
    <group ref={root}>
      {loopMats.map((m, i) => (
        <mesh
          key={i}
          material={m}
          ref={(node) => {
            state.current[i].mesh = node;
          }}
          frustumCulled={false}
        >
          <bufferGeometry />
        </mesh>
      ))}
      <points geometry={cme.geometry} material={cme.material} frustumCulled={false} />
      <sprite ref={flash} visible={false}>
        <spriteMaterial map={hot} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </sprite>
    </group>
  );
}
