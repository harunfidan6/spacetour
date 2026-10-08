'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { stars, constellationLines } from '@/data/stars';
import { getBackgroundStarfield } from '@/lib/astrophysics/starfieldCatalog';
import { getLocalSiderealTime, POPULAR_LOCATIONS } from '@/utils/astronomy';
import { longitude, BODY_NAMES, SIGN_NAMES, type SkyBody } from '@/lib/astrology/dailySky';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import { NASA_TEXTURES, loadNasaTexture } from './nasaTextures';
import { Pause, Play, RotateCcw } from 'lucide-react';

/**
 * 3D gök küresi: Dünya ortada, gök küresi dışarıdan döndürülerek izlenir. Gök ekvatoru,
 * 23,44° eğik ekliptik ve zodyak, parlak yıldızlar ve takımyıldız çizgileri, Güneş, Ay ve
 * gezegenlerin gerçek ekliptik boylamları; zaman hızlandırılıp geri sarılabilir.
 * Kamera, konum izni veya cihaz sensörü kullanmaz.
 */

const R = 1.6; // gök küresi yarıçapı
const EPS = (23.4393 * Math.PI) / 180; // ekliptik eğikliği
const DEG = Math.PI / 180;

/** Ekvatoral (RA, Dec derece) → sahne koordinatı; y ekseni gök kuzey kutbu */
function eq(raDeg: number, decDeg: number, r = R) {
  const ra = raDeg * DEG, dec = decDeg * DEG;
  return new THREE.Vector3(r * Math.cos(dec) * Math.cos(ra), r * Math.sin(dec), -r * Math.cos(dec) * Math.sin(ra));
}

/** Ekliptik boylam (β = 0) → sahne koordinatı */
function ecl(lonDeg: number, r = R) {
  const l = lonDeg * DEG;
  const X = Math.cos(l), Y = Math.sin(l) * Math.cos(EPS), Z = Math.sin(l) * Math.sin(EPS);
  return new THREE.Vector3(r * X, r * Z, -r * Y);
}

function ring(fn: (t: number) => THREE.Vector3, n = 256) {
  return Array.from({ length: n + 1 }, (_, i) => fn((i / n) * 360));
}

const BODIES: { id: SkyBody; color: string; size: number }[] = [
  { id: 'sun', color: '#fbbf24', size: 0.075 },
  { id: 'moon', color: '#e5e7eb', size: 0.05 },
  { id: 'mercury', color: '#a8a29e', size: 0.028 },
  { id: 'venus', color: '#fde68a', size: 0.036 },
  { id: 'mars', color: '#f87171', size: 0.032 },
  { id: 'jupiter', color: '#fdba74', size: 0.044 },
  { id: 'saturn', color: '#fcd34d', size: 0.04 },
];

const SPEEDS = [
  { label: 'Gerçek zaman', perSec: 1 },
  { label: '1 saat / sn', perSec: 3600 },
  { label: '1 gün / sn', perSec: 86400 },
  { label: '1 hafta / sn', perSec: 604800 },
  { label: '1 ay / sn', perSec: 2592000 },
];

type Layers = { equator: boolean; ecliptic: boolean; constellations: boolean; horizon: boolean; labels: boolean };
type Picked = { kind: 'body'; id: SkyBody } | { kind: 'star'; index: number } | null;

function Line({ points, color, opacity = 1, dashed = false }: { points: THREE.Vector3[]; color: string; opacity?: number; dashed?: boolean }) {
  const line = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    const m = dashed
      ? new THREE.LineDashedMaterial({ color, transparent: true, opacity, dashSize: 0.04, gapSize: 0.03 })
      : new THREE.LineBasicMaterial({ color, transparent: true, opacity });
    const l = new THREE.Line(g, m);
    if (dashed) l.computeLineDistances();
    return l;
  }, [points, color, opacity, dashed]);
  useEffect(() => () => { line.geometry.dispose(); (line.material as THREE.Material).dispose(); }, [line]);
  return <primitive object={line} />;
}

const labelCache = new Map<string, THREE.Texture>();
/** Metni tuval dokusuna çizer (önbellekli); sahne içi etiketler için */
function labelTexture(text: string, color: string, weight = 600) {
  const key = `${text}|${color}|${weight}`;
  const hit = labelCache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  const x = c.getContext('2d')!;
  const font = `${weight} 44px ui-monospace, "Geist Mono", monospace`;
  x.font = font;
  c.width = Math.ceil(x.measureText(text).width) + 24;
  c.height = 64;
  x.font = font;
  x.textBaseline = 'middle';
  x.shadowColor = 'rgba(0,0,0,0.9)';
  x.shadowBlur = 8;
  x.fillStyle = color;
  x.fillText(text, 12, 34);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  labelCache.set(key, t);
  return t;
}

/** Kameraya dönük, sahne içine çizilen yazı (drei Html yerine: hafif ve her zaman görünür) */
function Label({ text, color, position, height = 0.07, weight }: { text: string; color: string; position: THREE.Vector3 | [number, number, number]; height?: number; weight?: number }) {
  const tex = useMemo(() => labelTexture(text, color, weight), [text, color, weight]);
  const img = tex.image as HTMLCanvasElement;
  const aspect = img.width / img.height;
  return (
    <sprite position={position} scale={[height * aspect, height, 1]} renderOrder={10}>
      <spriteMaterial map={tex} transparent depthWrite={false} depthTest={false} />
    </sprite>
  );
}

function Grid() {
  const lines = useMemo(() => {
    const out: THREE.Vector3[][] = [];
    for (let ra = 0; ra < 360; ra += 30) out.push(Array.from({ length: 65 }, (_, i) => eq(ra, -90 + (i / 64) * 180)));
    for (const dec of [-60, -30, 30, 60]) out.push(ring((t) => eq(t, dec)));
    return out;
  }, []);
  return <>{lines.map((p, i) => <Line key={i} points={p} color="#94a3b8" opacity={0.08} />)}</>;
}

function StarField({ onPick }: { onPick: (i: number) => void }) {
  const bright = useMemo(() => {
    const pos = new Float32Array(stars.length * 3), col = new Float32Array(stars.length * 3), size = new Float32Array(stars.length);
    stars.forEach((s, i) => {
      const v = eq(s.ra, s.dec, R * 0.995);
      pos.set([v.x, v.y, v.z], i * 3);
      const c = new THREE.Color(s.color || '#ffffff');
      col.set([c.r, c.g, c.b], i * 3);
      size[i] = Math.max(2.2, 7.5 - s.magnitude * 1.4);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('size', new THREE.BufferAttribute(size, 1));
    return g;
  }, []);
  const faint = useMemo(() => {
    const bg = getBackgroundStarfield();
    const pos = new Float32Array(bg.length * 3);
    bg.forEach((s, i) => { const v = eq(s.ra, s.dec, R * 0.998); pos.set([v.x, v.y, v.z], i * 3); });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, vertexColors: true,
    vertexShader: 'attribute float size; varying vec3 vColor; void main(){ vColor = color; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = size * (3.2 / -mv.z); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'varying vec3 vColor; void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vColor, a); }',
  }), []);
  useEffect(() => () => { bright.dispose(); faint.dispose(); material.dispose(); }, [bright, faint, material]);
  return (
    <>
      <points geometry={faint}>
        <pointsMaterial size={0.008} color="#cbd5e1" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
      </points>
      <points
        geometry={bright}
        material={material}
        onClick={(e) => { e.stopPropagation(); if (e.index !== undefined) onPick(e.index); }}
      />
    </>
  );
}

function Constellations() {
  const segs = useMemo(() => {
    const out: THREE.Vector3[][] = [];
    for (const c of constellationLines) for (const [a, b] of c.lines) {
      const s1 = stars[a], s2 = stars[b];
      if (s1 && s2) out.push([eq(s1.ra, s1.dec, R * 0.99), eq(s2.ra, s2.dec, R * 0.99)]);
    }
    return out;
  }, []);
  return <>{segs.map((p, i) => <Line key={i} points={p} color="#7dd3fc" opacity={0.35} />)}</>;
}

function Earth({ gmst }: { gmst: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => loadNasaTexture(NASA_TEXTURES.earthMap), []);
  useFrame(() => { if (ref.current) ref.current.rotation.y = gmst * DEG + Math.PI; });
  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[0.2, 48, 48]} />
        <meshStandardMaterial map={tex ?? undefined} color={tex ? '#ffffff' : '#2563eb'} roughness={0.9} />
      </mesh>
      <Line points={[new THREE.Vector3(0, -0.34, 0), new THREE.Vector3(0, 0.34, 0)]} color="#e2e8f0" opacity={0.5} />
    </group>
  );
}

function Body({ id, color, size, lon, label, selected, onPick, stagger }: { id: SkyBody; color: string; size: number; lon: number; label: boolean; selected: boolean; onPick: (id: SkyBody) => void; stagger: number }) {
  const p = ecl(lon, R * 0.97);
  // Etiket kürenin içine doğru (burç etiketleri dışarıda kalır); yakın cisimler için dikey kaydırma
  const labelPos = p.clone().normalize().multiplyScalar(-(size + 0.16)).add(new THREE.Vector3(0, stagger, 0));
  return (
    <group position={p}>
      <mesh onClick={(e) => { e.stopPropagation(); onPick(id); }}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {(id === 'sun' || selected) && (
        <mesh>
          <sphereGeometry args={[size * 1.9, 24, 24]} />
          <meshBasicMaterial color={color} transparent opacity={selected ? 0.25 : 0.15} depthWrite={false} />
        </mesh>
      )}
      {label && <Label text={BODY_NAMES[id]} color={color} position={labelPos} height={0.11} />}
    </group>
  );
}

/** Dar (dikey) ekranlarda kamera uzaklaşır: küre her ekrana sığar */
function FitCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    camera.position.setLength(aspect < 1 ? Math.min(9.5, 5.4 / aspect) : 4.8);
  }, [camera, size.width, size.height]);
  return null;
}

function Scene({ time, layers, picked, setPicked, auto }: { time: Date; layers: Layers; picked: Picked; setPicked: (p: Picked) => void; auto: boolean }) {
  const gmst = getLocalSiderealTime(time, 0);
  const ist = POPULAR_LOCATIONS[0];
  const lst = getLocalSiderealTime(time, ist.longitude);
  const lons = BODIES.map((b) => longitude(b.id, time));
  const equator = useMemo(() => ring((t) => eq(t, 0)), []);
  const ecliptic = useMemo(() => ring((t) => ecl(t)), []);
  const zodiacTicks = useMemo(() => Array.from({ length: 12 }, (_, i) => [ecl(i * 30, R * 0.94), ecl(i * 30, R * 1.06)]), []);
  // Ufuk: başucu yönü (RA = yerel yıldız zamanı, Dec = enlem) etrafındaki büyük daire
  const horizon = useMemo(() => {
    const z = eq(lst, ist.latitude, 1).normalize();
    const a = new THREE.Vector3(0, 1, 0).cross(z).normalize();
    const b = z.clone().cross(a).normalize();
    return ring((t) => a.clone().multiplyScalar(Math.cos(t * DEG) * R).add(b.clone().multiplyScalar(Math.sin(t * DEG) * R)));
  }, [lst, ist.latitude]);

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={ecl(lons[0], 4)} intensity={30} />
      <mesh>
        <sphereGeometry args={[R, 64, 64]} />
        <meshBasicMaterial color="#0b1220" transparent opacity={0.18} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <Grid />
      <StarField onPick={(i) => setPicked({ kind: 'star', index: i })} />
      {layers.constellations && <Constellations />}
      {layers.equator && <Line points={equator} color="#22d3ee" opacity={0.75} />}
      {layers.ecliptic && (
        <>
          <Line points={ecliptic} color="#f5c542" opacity={0.85} />
          {zodiacTicks.map((p, i) => <Line key={i} points={p} color="#f5c542" opacity={0.6} />)}
          {layers.labels && ZODIAC_SIGNS.map((sg, i) => (
            <Label key={sg.id} text={sg.name.toLocaleUpperCase('tr-TR')} color="#e8c766" position={ecl(i * 30 + 15, R * 1.2)} height={0.13} weight={500} />
          ))}
        </>
      )}
      {layers.horizon && <Line points={horizon} color="#a3e635" opacity={0.7} dashed />}
      <Earth gmst={gmst} />
      {BODIES.map((b, i) => (
        <Body key={b.id} {...b} lon={lons[i]} stagger={(i % 2 ? -1 : 1) * 0.045} label={layers.labels} selected={picked?.kind === 'body' && picked.id === b.id} onPick={(id) => setPicked({ kind: 'body', id })} />
      ))}
      <FitCamera />
      <OrbitControls enablePan={false} minDistance={2.2} maxDistance={10} autoRotate={auto} autoRotateSpeed={0.35} enableDamping />
    </>
  );
}

const fmt = (d: Date) => d.toLocaleString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });
const signOf = (lon: number) => `${SIGN_NAMES[Math.floor((((lon % 360) + 360) % 360) / 30)]} ${Math.floor(((lon % 30) + 30) % 30)}°`;

export function CelestialSphere3D() {
  const [time, setTime] = useState(() => new Date());
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [auto, setAuto] = useState(true);
  const [picked, setPicked] = useState<Picked>(null);
  const [layers, setLayers] = useState<Layers>({ equator: true, ecliptic: true, constellations: true, horizon: false, labels: true });

  useEffect(() => {
    if (!playing) return;
    let last = performance.now(), raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      setTime((t) => new Date(t.getTime() + dt * SPEEDS[speed].perSec * 1000));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed]);

  const info = (() => {
    if (!picked) return null;
    if (picked.kind === 'body') {
      const lon = longitude(picked.id, time);
      return { title: BODY_NAMES[picked.id], lines: [`Ekliptik boylam: ${lon.toFixed(1)}°`, `Burç: ${signOf(lon)}`] };
    }
    const s = stars[picked.index];
    return { title: s.turkishName ?? s.name, lines: [s.turkishName ? s.name : '', s.constellation ? `Takımyıldız: ${s.constellation}` : '', `Parlaklık (kadir): ${s.magnitude.toFixed(2)}`, `RA ${(s.ra / 15).toFixed(2)} sa · Dec ${s.dec.toFixed(1)}°`].filter(Boolean) };
  })();

  const toggle = (k: keyof Layers) => setLayers((l) => ({ ...l, [k]: !l[k] }));
  const LAYER_LABELS: [keyof Layers, string, string][] = [
    ['equator', 'Gök ekvatoru', '#22d3ee'], ['ecliptic', 'Ekliptik ve zodyak', '#f5c542'], ['constellations', 'Takımyıldızlar', '#7dd3fc'], ['horizon', 'İstanbul ufku', '#a3e635'], ['labels', 'Etiketler', '#e5e7eb'],
  ];

  return (
    <div className="relative border border-line bg-ink">
      <div className="relative h-[72svh] min-h-[460px] w-full">
        <Canvas camera={{ position: [3.2, 1.6, 3.2], fov: 45 }} dpr={[1, 2]} onPointerMissed={() => setPicked(null)}>
          <color attach="background" args={['#05060a']} />
          <Scene time={time} layers={layers} picked={picked} setPicked={setPicked} auto={auto && !picked} />
        </Canvas>

        <div className="pointer-events-none absolute left-4 right-4 top-4 space-y-1 sm:right-auto sm:max-w-sm">
          <div className="text-sm font-medium text-gold">3D gök küresi</div>
          <div className="font-mono text-sm tabular-nums text-paper">{fmt(time)}</div>
          <div className="text-sm leading-snug text-paper/80">İstanbul saati · sürükle, yakınlaştır, gök cismine dokun</div>
        </div>

        {info && (
          <div className="absolute inset-x-4 bottom-4 border border-line bg-ink/90 p-4 sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-4 sm:w-64" aria-live="polite">
            <div className="text-base font-semibold text-paper">{info.title}</div>
            {info.lines.map((l) => <div key={l} className="mt-1 text-sm tabular-nums text-paper/80">{l}</div>)}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-line bg-ink-2 p-4 text-sm">
        <button type="button" onClick={() => setPlaying((p) => !p)} className="flex h-9 items-center gap-2 border border-gold/50 px-3 text-gold hover:bg-gold hover:text-ink" aria-label={playing ? 'Durdur' : 'Oynat'}>
          {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? 'Durdur' : 'Oynat'}
        </button>
        <label className="flex items-center gap-2 text-paper/70">
          Hız
          <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="h-9 border border-line bg-ink px-2 text-paper">
            {SPEEDS.map((s, i) => <option key={s.label} value={i}>{s.label}</option>)}
          </select>
        </label>
        <button type="button" onClick={() => setTime((t) => new Date(t.getTime() - 86400000))} className="h-9 whitespace-nowrap border border-line px-3 tabular-nums text-paper/80 hover:border-paper">−1 gün</button>
        <button type="button" onClick={() => setTime((t) => new Date(t.getTime() + 86400000))} className="h-9 whitespace-nowrap border border-line px-3 tabular-nums text-paper/80 hover:border-paper">+1 gün</button>
        <button type="button" onClick={() => { setTime(new Date()); setSpeed(0); }} className="flex h-9 items-center gap-2 border border-line px-3 text-paper/80 hover:border-paper">
          <RotateCcw size={13} /> Şimdi
        </button>
        <label className="flex min-h-9 items-center gap-2 text-paper/70">
          <input type="checkbox" checked={auto} onChange={() => setAuto((a) => !a)} className="accent-[var(--gold)]" /> Kendiliğinden dön
        </label>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          {LAYER_LABELS.map(([k, label, color]) => (
            <button key={k} type="button" onClick={() => toggle(k)} aria-pressed={layers[k]}
              className={`flex h-9 items-center gap-2 whitespace-nowrap border px-3 ${layers[k] ? 'border-paper/40 text-paper' : 'border-line text-paper/70'}`}>
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: layers[k] ? color : 'transparent', border: `1px solid ${color}` }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-line bg-line max-sm:fill-row-2 sm:grid-cols-4 sm:max-lg:fill-row-4 lg:grid-cols-7">
        {BODIES.map((b) => {
          const lon = longitude(b.id, time);
          return (
            <button key={b.id} type="button" onClick={() => setPicked({ kind: 'body', id: b.id })} className="min-w-0 bg-ink p-3 text-left hover:bg-ink-2">
              <span className="flex items-center gap-2 text-sm font-medium text-paper"><span className="h-2 w-2 shrink-0 rounded-full" style={{ background: b.color }} />{BODY_NAMES[b.id]}</span>
              <span className="mt-1 block text-sm tabular-nums text-paper/70">{signOf(lon)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
