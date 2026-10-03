'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Smartphone,
  Monitor,
  Eye,
  Activity,
  Layers,
  Sparkles,
  Compass,
  Radio,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { heroScene } from '@/components/home/HeroSolarSystem3D';
import { HERO_BODIES } from '@/components/home/HeroSolarSystem3D';
import { DOC_IMAGES } from '@/data/docImages';

// Dynamically import heavy 3D & client components to prevent SSR hydration mismatches
const HeroSolarSystem3D = dynamic(
  () => import('@/components/home/HeroSolarSystem3D').then((m) => m.HeroSolarSystem3D),
  { ssr: false }
);

const BlackHoleSimulator = dynamic(
  () => import('@/components/space/BlackHoleSimulator').then((m) => m.BlackHoleSimulator),
  { ssr: false }
);

const Planetarium3D = dynamic(
  () => import('@/components/space/Planetarium3D').then((m) => m.Planetarium3D),
  { ssr: false }
);

const SpectrumObservationDesk = dynamic(
  () => import('@/components/space/SpectrumObservationDesk').then((m) => m.SpectrumObservationDesk),
  { ssr: false }
);

const ZodiacAtlas = dynamic(
  () => import('@/components/space/ZodiacAtlas').then((m) => m.ZodiacAtlas),
  { ssr: false }
);

const IssTracker = dynamic(
  () => import('@/components/space/IssTracker').then((m) => m.IssTracker),
  { ssr: false }
);

export const SCENES = [
  { id: 0, title: 'Kozmografya (Giriş)', start: 0.0, end: 3.75, voice: 'Evren... milyarlarca yıldır durmaksızın dönen, devasa bir mekanizma.' },
  { id: 1, title: '3D Güneş Sistemi', start: 3.75, end: 8.0, voice: 'SpaceTour TR; bu mekanizmayı parmaklarınızın ucuna getiriyor. Üç boyutlu Güneş Sistemi\'nde gezegenlerin yörüngelerini keşfedin...' },
  { id: 2, title: '360° Planetaryum', start: 8.0, end: 12.5, voice: '...360 derece planetaryumda gökyüzünü okuyun, yaklaşan gök olaylarını takviminizde anbean takip edin.' },
  { id: 3, title: 'Spektrum Gözlemevi', start: 12.5, end: 17.0, voice: 'Gözlemevinde çok dalgaboylu evreni inceleyin; optikten X-ışınına, görünmeyeni görün.' },
  { id: 4, title: 'Kerr Kara Deliği', start: 17.0, end: 21.75, voice: 'Genel görelilik simülatöründe olay ufkuna yaklaşın, zamanın bükülmesine tanık olun.' },
  { id: 5, title: '1824 Zodyak Atlası', start: 21.75, end: 25.0, voice: '1824 Urania\'s Mirror tarihi taş baskılarıyla gökyüzünün mitolojik köklerini aralayın.' },
  { id: 6, title: 'Canlı ISS Takibi', start: 25.0, end: 27.5, voice: 'Uluslararası Uzay İstasyonu\'nu anlık yörünge telemetrileriyle canlı izleyin.' },
  { id: 7, title: 'Final & Kapanış', start: 27.5, end: 30.0, voice: 'Burası SpaceTour TR. Evren hiç durmaz... siz de keşfetmekten geri kalmayın.' },
];

function StudioContent() {
  const searchParams = useSearchParams();
  const formatParam = searchParams.get('format') || 'yatay';
  const sceneParam = searchParams.get('scene');
  const hideControlsParam = searchParams.get('hideControls') === '1' || searchParams.get('render') === '1';

  const [format, setFormat] = useState<'yatay' | 'dikey'>(formatParam === 'dikey' ? 'dikey' : 'yatay');
  const [activeSceneId, setActiveSceneId] = useState<number>(sceneParam !== null ? parseInt(sceneParam, 10) || 0 : 0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(sceneParam === null || sceneParam === 'all');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hideControls, setHideControls] = useState<boolean>(hideControlsParam);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const labelsRef = useRef<(HTMLElement | null)[]>([]);

  // Calculate current scene from currentTime when auto-playing
  const currentScene = useMemo(() => {
    if (!isAutoPlay) {
      return SCENES.find((s) => s.id === activeSceneId) || SCENES[0];
    }
    const found = SCENES.find((s) => currentTime >= s.start && currentTime < s.end);
    return found || SCENES[SCENES.length - 1];
  }, [isAutoPlay, activeSceneId, currentTime]);

  const sceneProgress = useMemo(() => {
    const dur = currentScene.end - currentScene.start;
    if (dur <= 0) return 0;
    return Math.min(1, Math.max(0, (currentTime - currentScene.start) / dur));
  }, [currentTime, currentScene]);

  // Sync with HeroSolarSystem3D camera & intro
  useEffect(() => {
    if (currentScene.id === 1) {
      heroScene.intro = 1;
      heroScene.scroll = sceneProgress * 0.35;
      heroScene.px = Math.sin(sceneProgress * Math.PI) * 0.15;
      heroScene.py = Math.cos(sceneProgress * Math.PI) * 0.08;
    }
  }, [currentScene.id, sceneProgress]);

  // Place 3D labels for HeroSolarSystem3D
  const placeLabel = useCallback((i: number, x: number, y: number, alpha: number) => {
    const el = labelsRef.current[i];
    if (!el) return;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    el.style.opacity = (alpha * 0.9).toFixed(2);
  }, []);

  // Expose seeking API for Puppeteer frame recording
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__studioSeek = (seconds: number) => {
      setCurrentTime(seconds);
      const scene = SCENES.find((s) => seconds >= s.start && seconds < s.end) || SCENES[SCENES.length - 1];
      setActiveSceneId(scene.id);
      setIsAutoPlay(true);
      return { sceneId: scene.id, time: seconds };
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__studioGetState = () => ({
      currentTime,
      sceneId: currentScene.id,
      format,
    });
  }, [currentScene.id, currentTime, format]);

  // Audio & Animation loop
  const animate = useCallback(
    (timestamp: number) => {
      if (lastTimeRef.current !== null && isPlaying) {
        const delta = (timestamp - lastTimeRef.current) / 1000;
        setCurrentTime((prev) => {
          let next = prev + delta;
          if (next >= 30.0) {
            next = 0;
          }
          if (audioRef.current && Math.abs(audioRef.current.currentTime - next) > 0.3) {
            audioRef.current.currentTime = next;
          }
          return next;
        });
      }
      lastTimeRef.current = timestamp;
      requestRef.current = requestAnimationFrame(animate);
    },
    [isPlaying]
  );

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, animate]);

  const handleSceneClick = (id: number) => {
    setActiveSceneId(id);
    setIsAutoPlay(false);
    const scene = SCENES.find((s) => s.id === id);
    if (scene) {
      setCurrentTime(scene.start);
      if (audioRef.current) {
        audioRef.current.currentTime = scene.start;
      }
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    setIsAutoPlay(true);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  return (
    <div
      id="studio-stage"
      className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black font-sans text-paper select-none overflow-hidden"
    >
      <audio
        ref={audioRef}
        src="/audio/final_soundtrack.m4a"
        preload="auto"
        muted={isMuted}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Main Aspect Ratio Container */}
      <div
        style={{
          width: format === 'dikey' ? 'min(100vw, 56.25vh)' : 'min(100vw, 177.78vh)',
          height: format === 'dikey' ? 'min(177.78vw, 100vh)' : 'min(56.25vw, 100vh)',
          aspectRatio: format === 'dikey' ? '9/16' : '16/9',
        }}
        className="relative overflow-hidden bg-ink shadow-2xl border border-white/10"
      >
        {/* ========================================================= */}
        {/* SCENE 0: KOZMOĞRAFYA & CELLARIUS 1660 (0.0s - 3.75s)        */}
        {/* ========================================================= */}
        {currentScene.id === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 sm:p-12 overflow-hidden bg-black">
            {/* Antique Macrocosm Engraving Plate */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85"
              style={{
                transform: `scale(${1.0 + sceneProgress * 0.12}) rotate(${sceneProgress * 4}deg)`,
                transition: 'transform 0.05s linear',
              }}
            >
              <div className="relative w-[110%] h-[110%] max-w-none">
                <Image
                  src="/images/space/cellarius-harmonia-macrocosmica-planisphaerium-braheum-f160fa.jpg"
                  alt="Harmonia Macrocosmica"
                  fill
                  priority
                  className="object-contain filter sepia-[0.35] brightness-90 contrast-110"
                />
              </div>
            </div>

            {/* Vignette & Radial Atmospheric Fog */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.88)_85%)] pointer-events-none" />

            {/* Anamorphic Laser Guide Star */}
            <div
              className="absolute h-px bg-gradient-to-r from-transparent via-[#ffd700] to-transparent pointer-events-none"
              style={{
                width: '100%',
                top: `${48 + Math.sin(sceneProgress * Math.PI) * 4}%`,
                opacity: 0.75 + Math.sin(sceneProgress * Math.PI * 4) * 0.25,
                boxShadow: '0 0 16px rgba(255, 215, 0, 0.8)',
              }}
            />

            {/* Cinematic Typography Slate */}
            <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 border border-gold/40 bg-ink/75 px-4 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
                  BÖLÜM 00 // KOZMOĞRAFYA
                </span>
              </div>

              <h1 className="font-serif text-5xl sm:text-7xl font-normal tracking-tight text-paper drop-shadow-2xl">
                SPACETOUR <span className="text-gold italic">TR</span>
              </h1>

              <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-paper/70">
                Kinetik Açık Kaynak Uzay Atlası
              </p>

              <div className="pt-6 flex items-center justify-center gap-6 font-mono text-[10px] text-paper/50">
                <span>EPOCH J2000.0</span>
                <span>•</span>
                <span>41.0082° N, 28.9784° E</span>
                <span>•</span>
                <span>NASA & ESA VERİLERİYLE</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 1: 3D GÜNEŞ SİSTEMİ (HeroSolarSystem3D) (3.75s-8.0s) */}
        {/* ========================================================= */}
        {currentScene.id === 1 && (
          <div className="absolute inset-0 bg-black">
            {/* The Live Three.js Orrery Component */}
            <HeroSolarSystem3D project={placeLabel} active={true} />

            {/* Planet DOM telemetry labels */}
            {HERO_BODIES.map((b, i) => (
              <span
                key={b.id}
                ref={(node) => {
                  labelsRef.current[i] = node;
                }}
                className="absolute left-0 top-0 whitespace-nowrap pl-4 font-mono text-[11px] font-semibold text-paper/90 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                style={{ opacity: 0, marginTop: '-1.4em' }}
              >
                <span className="mr-1.5 inline-block h-px w-3 bg-gold align-middle" />
                {b.name.toLocaleUpperCase('tr-TR')} · <span className="text-gold">{b.au}</span>
              </span>
            ))}

            {/* Cinematic Overlay Framing */}
            <div className="absolute inset-x-8 top-8 flex items-center justify-between pointer-events-none z-10">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">
                  BÖLÜM 01 // ORRERY 3D
                </span>
                <div className="font-mono text-xs text-paper/70">KEPLER YÖRÜNGELERİ VE GÜNEŞ SİSTEMİ</div>
              </div>

              <div className="flex items-center gap-2 rounded border border-white/10 bg-ink/70 px-3 py-1.5 backdrop-blur font-mono text-[10px] text-gold">
                <Activity size={12} className="animate-spin" />
                <span>CANLI 3D MOTOR</span>
              </div>
            </div>

            {/* Signature Site Typography: EVREN hiç durmaz. */}
            <div className="absolute inset-x-8 bottom-12 pointer-events-none z-10">
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-paper leading-none">
                EVREN{' '}
                <span className="font-serif font-normal italic lowercase text-gold block sm:inline">
                  hiç durmaz.
                </span>
              </h2>
              <p className="mt-3 max-w-md font-sans text-xs sm:text-sm text-paper/80 leading-relaxed">
                Güneş ve 8 gezegenin Kepler eliptik yörüngelerini Three.js WebGL motoruyla anlık keşfedin.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 2: 360° PLANETARYUM (Planetarium3D) (8.0s - 12.5s)    */}
        {/* ========================================================= */}
        {currentScene.id === 2 && (
          <div className="absolute inset-0 bg-[#04040a] overflow-hidden">
            {/* The Live Planetarium3D Component */}
            <div className="absolute inset-0">
              <Planetarium3D />
            </div>

            {/* Cinematic Telemetry Overlay */}
            <div className="absolute inset-x-8 top-8 flex items-center justify-between pointer-events-none z-20">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00d4ff]">
                  BÖLÜM 02 // 360° PLANETARYUM
                </span>
                <div className="font-mono text-xs text-paper/70">HİPPARCOS GÖK KÜRESİ KATALOĞU</div>
              </div>

              <div className="flex items-center gap-2 rounded border border-[#00d4ff]/30 bg-ink/80 px-3 py-1.5 backdrop-blur font-mono text-[10px] text-[#00d4ff]">
                <Sparkles size={12} />
                <span>120.000+ YILDIZ & TAKIMYILDIZLAR</span>
              </div>
            </div>

            <div className="absolute left-8 bottom-12 pointer-events-none z-20 max-w-lg">
              <div className="inline-block border-l-2 border-[#00d4ff] pl-3 py-1 bg-ink/70 backdrop-blur">
                <span className="font-mono text-[11px] text-paper">ORION // AVCI TAKIMYILDIZI</span>
                <div className="font-mono text-[10px] text-[#00d4ff]">RA 05h 35m / DEC +09° 56&apos;</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 3: SPEKTRUM GÖZLEMEVİ (12.5s - 17.0s)                */}
        {/* ========================================================= */}
        {currentScene.id === 3 && (
          <div className="absolute inset-0 bg-ink-2 flex flex-col justify-center p-6 sm:p-12 overflow-hidden">
            {/* Live Spectrum Component */}
            <div className="w-full max-w-4xl mx-auto z-10 scale-[0.92] sm:scale-100">
              <SpectrumObservationDesk />
            </div>

            {/* Cinematic Title & HUD */}
            <div className="absolute inset-x-8 top-8 flex items-center justify-between pointer-events-none z-20">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#ff6b35]">
                  BÖLÜM 03 // ÇOK DALGABOYLU GÖZLEMEVİ
                </span>
                <div className="font-mono text-xs text-paper/70">OPTİK, KIZILÖTESİ VE X-IŞINI TAYFI</div>
              </div>

              <div className="flex items-center gap-2 rounded border border-[#ff6b35]/30 bg-ink/80 px-3 py-1.5 backdrop-blur font-mono text-[10px] text-[#ff6b35]">
                <Radio size={12} />
                <span>ELEKTROMANYETİK SPEKTRUM</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 4: KERR KARA DELİĞİ (BlackHoleSimulator) (17.0s-21.75s) */}
        {/* ========================================================= */}
        {currentScene.id === 4 && (
          <div className="absolute inset-0 bg-black flex flex-col justify-center p-6 sm:p-10 overflow-hidden">
            {/* The Live BlackHoleSimulator Component */}
            <div className="w-full max-w-5xl mx-auto z-10 scale-[0.88] sm:scale-100">
              <BlackHoleSimulator />
            </div>

            {/* Cinematic Title & HUD */}
            <div className="absolute inset-x-8 top-8 flex items-center justify-between pointer-events-none z-20">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#a855f7]">
                  BÖLÜM 04 // GENEL GÖRELİLİK
                </span>
                <div className="font-mono text-xs text-paper/70">KERR DÖNEN KARA DELİK SİMÜLATÖRÜ</div>
              </div>

              <div className="flex items-center gap-2 rounded border border-[#a855f7]/30 bg-ink/80 px-3 py-1.5 backdrop-blur font-mono text-[10px] text-[#a855f7]">
                <Clock size={12} />
                <span>ZAMAN GENLEŞMESİ: 1 SAAT = 7.2 YIL</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 5: 1824 ZODYAK ATLASI (ZodiacAtlas) (21.75s - 25.0s) */}
        {/* ========================================================= */}
        {currentScene.id === 5 && (
          <div className="absolute inset-0 bg-ink flex flex-col justify-center p-6 sm:p-12 overflow-hidden">
            {/* The Live ZodiacAtlas Component */}
            <div className="w-full max-w-5xl mx-auto z-10 scale-[0.85] sm:scale-95">
              <ZodiacAtlas />
            </div>

            {/* Cinematic Title & HUD */}
            <div className="absolute inset-x-8 top-8 flex items-center justify-between pointer-events-none z-20">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">
                  BÖLÜM 05 // TARİHİ GÖK ATLASI
                </span>
                <div className="font-mono text-xs text-paper/70">1824 URANIA&apos;S MIRROR • SIDNEY HALL</div>
              </div>

              <div className="flex items-center gap-2 rounded border border-gold/30 bg-ink/80 px-3 py-1.5 backdrop-blur font-mono text-[10px] text-gold">
                <Layers size={12} />
                <span>12 ZODYAK GRAVÜRÜ</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 6: CANLI ISS TAKİBİ (IssTracker) (25.0s - 27.5s)     */}
        {/* ========================================================= */}
        {currentScene.id === 6 && (
          <div className="absolute inset-0 bg-black flex flex-col justify-center p-6 sm:p-12 overflow-hidden">
            {/* The Live IssTracker Component */}
            <div className="w-full max-w-4xl mx-auto z-10 scale-[0.9] sm:scale-100">
              <IssTracker />
            </div>

            {/* Cinematic Title & HUD */}
            <div className="absolute inset-x-8 top-8 flex items-center justify-between pointer-events-none z-20">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00d4ff]">
                  BÖLÜM 06 // CANLI YÖRÜNGE İZLEME
                </span>
                <div className="font-mono text-xs text-paper/70">NORAD 25544 • ISS ULUSLARARASI UZAY İSTASYONU</div>
              </div>

              <div className="flex items-center gap-2 rounded border border-[#00d4ff]/30 bg-ink/80 px-3 py-1.5 backdrop-blur font-mono text-[10px] text-[#00d4ff]">
                <Activity size={12} className="animate-pulse" />
                <span>HIZ: ~27.580 KM/S</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 7: FİNALE & LOGO KAPANIŞ (27.5s - 30.0s)              */}
        {/* ========================================================= */}
        {currentScene.id === 7 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black overflow-hidden">
            {/* Glowing Celestial Compass Rings */}
            <div
              className="absolute w-[460px] h-[460px] rounded-full border border-gold/20 flex items-center justify-center pointer-events-none"
              style={{
                transform: `rotate(${sceneProgress * 45}deg)`,
                boxShadow: '0 0 80px rgba(255, 215, 0, 0.15)',
              }}
            >
              <div className="w-[360px] h-[360px] rounded-full border border-dashed border-white/10" />
            </div>

            {/* Center Vector Compass Logo */}
            <div className="relative z-10 space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full border border-gold/40 flex items-center justify-center bg-ink/80 shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                <Compass size={40} className="text-gold" />
              </div>

              <div className="space-y-2">
                <h1 className="font-serif text-5xl sm:text-7xl font-normal tracking-tight text-paper">
                  SPACETOUR <span className="text-gold italic">TR</span>
                </h1>
                <p className="font-serif text-2xl sm:text-3xl text-gold italic font-normal">
                  Evren hiç durmaz.
                </p>
              </div>

              <div className="pt-4 font-mono text-xs uppercase tracking-[0.3em] text-paper/70">
                spacetour.com.tr
              </div>

              <div className="pt-2 text-[10px] font-mono text-paper/40">
                AÇIK KAYNAK ASTRONOMİ ATLASI // 2026
              </div>
            </div>
          </div>
        )}

        {/* Cinematic Voiceover Subtitle Bar */}
        <div className="absolute inset-x-0 bottom-4 pointer-events-none z-30 flex justify-center px-6">
          <div className="max-w-xl text-center px-4 py-2 rounded-full bg-black/75 border border-white/10 backdrop-blur-md">
            <p className="font-sans text-xs sm:text-sm text-paper/90 italic font-medium leading-snug">
              &ldquo;{currentScene.voice}&rdquo;
            </p>
          </div>
        </div>

        {/* Global Cinematic Timecode & Section Indicator */}
        <div className="absolute top-4 right-4 pointer-events-none z-30 font-mono text-[10px] text-paper/60 flex items-center gap-3">
          <span>{currentScene.title}</span>
          <span className="text-gold">
            {Math.floor(currentTime / 60)
              .toString()
              .padStart(2, '0')}
            :{(currentTime % 60).toFixed(2).padStart(5, '0')} / 00:30.00
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FLOATING STUDIO CONTROL PANEL (HIDDEN IN RENDER MODE)      */}
      {/* ========================================================= */}
      {!hideControls && (
        <div className="fixed bottom-4 inset-x-4 max-w-4xl mx-auto z-[99999999] rounded-2xl border border-white/15 bg-ink/90 p-3 sm:p-4 backdrop-blur-2xl shadow-2xl flex flex-col gap-3">
          {/* Top row: Scrub slider & Time */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="p-2.5 rounded-full bg-gold text-ink font-bold hover:scale-105 transition-transform cursor-pointer"
              title={isPlaying ? 'Durdur' : 'Oynat'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
              onClick={() => {
                setCurrentTime(0);
                if (audioRef.current) audioRef.current.currentTime = 0;
              }}
              className="p-2 rounded-full border border-white/15 text-paper/70 hover:text-paper cursor-pointer"
              title="Başa Sar"
            >
              <RotateCcw size={14} />
            </button>

            <input
              type="range"
              min="0"
              max="30"
              step="0.05"
              value={currentTime}
              onChange={handleTimeScrub}
              className="w-full accent-gold h-1.5 bg-white/20 rounded cursor-pointer"
            />

            <span className="font-mono text-xs text-gold whitespace-nowrap">
              {currentTime.toFixed(1)}s / 30.0s
            </span>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full border border-white/15 text-paper/70 hover:text-paper cursor-pointer"
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            <button
              onClick={() => setFormat(format === 'yatay' ? 'dikey' : 'yatay')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 text-xs font-mono text-paper/80 hover:text-paper cursor-pointer"
              title="Format Değiştir (16:9 Yatay / 9:16 Dikey)"
            >
              {format === 'yatay' ? <Monitor size={14} /> : <Smartphone size={14} />}
              <span>{format === 'yatay' ? '16:9 Yatay' : '9:16 Dikey'}</span>
            </button>

            <button
              onClick={() => setHideControls(true)}
              className="p-2 rounded-full border border-white/15 text-paper/70 hover:text-paper cursor-pointer"
              title="Kontrol Panelini Gizle"
            >
              <Eye size={14} />
            </button>
          </div>

          {/* Bottom row: Scene quick jumpers */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-white/10">
            <span className="font-mono text-[10px] uppercase text-paper/40 mr-1 shrink-0">SAHNELER:</span>
            {SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => handleSceneClick(scene.id)}
                className={`shrink-0 px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  currentScene.id === scene.id
                    ? 'bg-gold text-ink font-bold shadow'
                    : 'bg-white/5 text-paper/70 hover:bg-white/10 hover:text-paper'
                }`}
              >
                {scene.id}: {scene.title}
              </button>
            ))}

            <button
              onClick={() => {
                setIsAutoPlay(true);
                setCurrentTime(0);
                setIsPlaying(true);
              }}
              className="ml-auto shrink-0 px-3 py-1 rounded bg-white/10 hover:bg-gold hover:text-ink text-[11px] font-mono text-gold transition-colors cursor-pointer"
            >
              Tümünü Oynat (30s)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-black flex items-center justify-center font-mono text-xs text-gold">Stüdyo Yükleniyor...</div>}>
      <StudioContent />
    </Suspense>
  );
}
