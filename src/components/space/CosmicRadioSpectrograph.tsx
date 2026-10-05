'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from '@/lib/useInView';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Activity,
  Zap,
  Info,
  Waves,
  Disc
} from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';

interface CelestialSignal {
  id: string;
  name: string;
  source: string;
  distance: string;
  frequency: string;
  discoveryMission: string;
  description: string;
  scientificMechanism: string;
  audioParams: {
    type: OscillatorType;
    baseFreq: number;
    modFreq: number;
    pulseInterval: number; // ms, or 0 if continuous
    harmonics: number[];
  };
}

const CELESTIAL_SIGNALS: CelestialSignal[] = [
  {
    id: 'vela-pulsar',
    name: 'Vela Pulsarı (PSR B0833-45)',
    source: 'Nötron Yıldızı / Süpernova Kalıntısı',
    distance: '959 Işık Yılı',
    frequency: '11.19 Hz (89.3 ms darbe aralığı)',
    discoveryMission: 'Parkes Radyo Teleskobu',
    description: 'Kendi etrafında saniyede 11 kereden fazla dönen, 20 km çapında fakat Güneş’ten daha ağır bir süperyoğun nötron yıldızı.',
    scientificMechanism: 'Manyetik kutuplardan fışkıran göreli elektron demetleri Dünya yönünden geçerken periyodik radyo flaşları üretir. Tıpkı devasa bir kozmik deniz feneri gibi.',
    audioParams: {
      type: 'sawtooth',
      baseFreq: 110,
      modFreq: 11.19,
      pulseInterval: 89,
      harmonics: [1, 2, 3]
    }
  },
  {
    id: 'crab-pulsar',
    name: 'Yengeç Pulsarı (PSR B0531+21)',
    source: 'Süpernova Kalıntısı Nötron Yıldızı',
    distance: '6.500 Işık Yılı',
    frequency: '29.8 Hz (33 ms darbe aralığı)',
    discoveryMission: 'Arecibo Gözlemevi (1968)',
    description: '1054 yılındaki süpernovanın merkezinde kalan, saniyede neredeyse 30 devir atan genç ve enerjik pulsar.',
    scientificMechanism: 'Aşırı güçlü manyetik alan (10¹² Gauss), senkrotron radyasyonu üreterek radyo dalgalarından gama ışınlarına kadar tüm spektrumda nabız atar.',
    audioParams: {
      type: 'square',
      baseFreq: 180,
      modFreq: 29.8,
      pulseInterval: 33,
      harmonics: [1, 3, 5]
    }
  },
  {
    id: 'saturn-rpws',
    name: 'Satürn Kutup Işıması Emisyonları',
    source: 'Satürn Manyetosferi (SKR)',
    distance: '1.4 Milyar Kilometre',
    frequency: '100 kHz – 1.3 MHz (Duyulabilir Spektruma İndirgenmiş)',
    discoveryMission: 'Cassini Uzay Aracı (RPWS Cihazı)',
    description: 'Satürn’ün auroralarından (kutup ışıkları) kaynaklanan, ıslık ve rüzgar benzeri tekinsiz manyetosferik plazma salınımları.',
    scientificMechanism: 'Güneş rüzgarı parçacıklarının Satürn’ün manyetik kutup çizgileri boyunca hızlanmasıyla oluşan elektron siklotron mazer radyasyonu.',
    audioParams: {
      type: 'sine',
      baseFreq: 420,
      modFreq: 1.8,
      pulseInterval: 0,
      harmonics: [1, 1.4, 2.1]
    }
  },
  {
    id: 'perseus-blackhole',
    name: 'Perseus Kara Delik Basınç Dalgası',
    source: 'Perseus Gökada Kümesi / Süper Kütleli Kara Delik',
    distance: '250 Milyon Işık Yılı',
    frequency: 'B-flat (Doğal notadan 57 oktav yukarı transpoze)',
    discoveryMission: 'NASA Chandra X-Ray Gözlemevi Sonifikasyonu',
    description: 'Kara deliğin fışkırttığı jetlerin galaksiler arası sıcak gaz ortamında yarattığı devasa akustik basınç dalgası.',
    scientificMechanism: 'Kara delikten fırlatılan plazma kümesi gazı sıkıştırarak 10 milyon yıllık periyotlarla ses dalgaları yayar. NASA bu dalgaları insan işitme sınırına 57 oktav yükseltmiştir.',
    audioParams: {
      type: 'triangle',
      baseFreq: 55,
      modFreq: 0.25,
      pulseInterval: 0,
      harmonics: [1, 1.5, 2]
    }
  },
  {
    id: 'voyager-plasma',
    name: 'Voyager 1 Yıldızlararası Plazma Dalgası',
    source: 'Helyopoz Ötesi Yıldızlararası Uzay',
    distance: '24 Milyar Kilometre (160+ AU)',
    frequency: '2.6 kHz – 3.2 kHz Plazma Rezonansı',
    discoveryMission: 'Voyager 1 Plasma Wave Science (PWS)',
    description: 'İnsanlık tarihinde Güneş’in etki alanından çıkıp yıldızlararası ortama adım atan ilk uzay aracının kaydettiği saf uzay plazması dalgalanması.',
    scientificMechanism: 'Güneş patlamalarından gelen şok dalgalarının yıldızlararası soğuk iyonize gazı titreştirmesiyle ortaya çıkan plazma osilasyonları.',
    audioParams: {
      type: 'sine',
      baseFreq: 2600,
      modFreq: 6.5,
      pulseInterval: 0,
      harmonics: [1]
    }
  },
  {
    id: 'solar-soho',
    name: 'Güneş Plazma Akustik Uğultusu',
    source: 'Güneş Konveksiyon Bölgesi (Helyosismoloji)',
    distance: '149.6 Milyon Kilometre (1 AU)',
    frequency: '3 mHz (42.000 kat hızlandırılmış)',
    discoveryMission: 'ESA / NASA SOHO Uzay Gözlemevi',
    description: 'Güneş’in içinde sürekli kaynayan nükleer enerjinin ve konveksiyon akımlarının yarattığı global sismik rezonans.',
    scientificMechanism: 'Güneş’in içi devasa bir çan gibi akustik dalgalarla çınlar. Basınç dalgaları (p-modları) çekirdeğe kadar iner ve yüzeye yansır.',
    audioParams: {
      type: 'triangle',
      baseFreq: 88,
      modFreq: 0.6,
      pulseInterval: 0,
      harmonics: [1, 2.5]
    }
  }
];

export function CosmicRadioSpectrograph() {
  const [selectedSignal, setSelectedSignal] = useState<CelestialSignal>(CELESTIAL_SIGNALS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.35);
  const [displayMode, setDisplayMode] = useState<'oscilloscope' | 'spectrogram'>('oscilloscope');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const visible = useInView(canvasRef);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize or resume audio context
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const master = audioCtxRef.current.createGain();
      master.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
      master.connect(analyser);
      analyser.connect(audioCtxRef.current.destination);
      masterGainRef.current = master;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, [volume]);

  // Stop currently playing sound nodes
  const stopAudio = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    nodesRef.current.forEach((n) => {
      try {
        if ('stop' in n && typeof (n as AudioScheduledSourceNode).stop === 'function') {
          (n as AudioScheduledSourceNode).stop();
        }
        n.disconnect();
      } catch {
        // ignore
      }
    });
    nodesRef.current = [];
    setIsPlaying(false);
  }, []);

  // Play celestial synthesizer synthesized audio
  const startAudio = useCallback((signal: CelestialSignal = selectedSignal) => {
    stopAudio();
    const ctx = getAudioContext();
    if (!masterGainRef.current) return;

    const { audioParams } = signal;

    if (audioParams.pulseInterval > 0) {
      // Pulsar rhythmic trigger
      const triggerPulse = () => {
        if (!masterGainRef.current || !ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = audioParams.type;
        osc.frequency.setValueAtTime(audioParams.baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(audioParams.baseFreq * 0.4, now + 0.04);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.8, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGainRef.current);

        osc.start(now);
        osc.stop(now + 0.05);
      };

      triggerPulse();
      intervalRef.current = setInterval(triggerPulse, audioParams.pulseInterval);
    } else {
      // Continuous ambient / wave sonification
      const now = ctx.currentTime;
      const carrier = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      carrier.type = audioParams.type;
      carrier.frequency.setValueAtTime(audioParams.baseFreq, now);

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(audioParams.modFreq, now);
      lfoGain.gain.setValueAtTime(audioParams.baseFreq * 0.15, now);

      lfo.connect(lfoGain);
      lfoGain.connect(carrier.frequency);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(audioParams.baseFreq, now);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.2);

      carrier.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current);

      carrier.start(now);
      lfo.start(now);

      nodesRef.current.push(carrier, lfo, lfoGain, filter, gain);
    }

    setIsPlaying(true);
  }, [selectedSignal, getAudioContext, stopAudio]);

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  // Adjust volume
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Clean up on unmount or signal change
  useEffect(() => {
    return () => {
      stopAudio();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [stopAudio]);


  // Canvas visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      time += 0.05;

      const width = canvas.width;
      const height = canvas.height;

      // Dark CRT phosphor background
      ctx.fillStyle = '#06060c';
      ctx.fillRect(0, 0, width, height);

      // CRT Scanlines
      ctx.fillStyle = 'rgba(0, 255, 180, 0.02)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      const analyser = analyserRef.current;

      if (displayMode === 'oscilloscope') {
        // Oscilloscope Waveform
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = isPlaying ? '#00ffa3' : 'rgba(0, 255, 163, 0.25)';
        ctx.shadowColor = '#00ffa3';
        ctx.shadowBlur = isPlaying ? 10 : 0;
        ctx.beginPath();

        if (isPlaying && analyser) {
          const bufferLength = analyser.fftSize;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteTimeDomainData(dataArray);

          const sliceWidth = width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * height) / 2;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            x += sliceWidth;
          }
        } else {
          // Idle baseline wave
          const sliceWidth = width / 100;
          for (let i = 0; i <= 100; i++) {
            const x = i * sliceWidth;
            const y = height / 2 + Math.sin(i * 0.15 + time) * 4;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // Frequency Spectrogram Bars
        const bufferLength = analyser ? analyser.frequencyBinCount : 64;
        const dataArray = new Uint8Array(bufferLength);
        if (isPlaying && analyser) {
          analyser.getByteFrequencyData(dataArray);
        }

        const barWidth = (width / bufferLength) * 1.8;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = isPlaying ? (dataArray[i] / 255) * (height - 20) : Math.sin(i * 0.4 + time) * 6 + 8;

          const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
          grad.addColorStop(0, '#005533');
          grad.addColorStop(0.7, '#00ffa3');
          grad.addColorStop(1, '#ffffff');

          ctx.fillStyle = grad;
          ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);

          x += barWidth;
        }
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, displayMode, visible]);

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-lime">
            <span className="live-dot" /> Kozmik Radyo Spektrografı & Pulsar Akustiği
          </div>
          <h3 className="display display-tight mt-3 text-[clamp(1.8rem,3.4vw,3.2rem)] text-paper">
            Evrenin <span className="serif-i text-lime">radyo şarkıları</span>
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/70">
            Radyo teleskopların ve derin uzay sondalarının ölçtüğü gerçek darbe periyotları ve plazma frekanslarıyla tarayıcında sentezlenen kozmik sonifikasyonlar. Nötron yıldızlarının nabzını ve yıldızlararası plazmayı duyulabilir aralıkta dinle.
          </p>
        </div>

        {/* Global Sound Controls */}
        <div className="flex items-center gap-4 border border-line bg-ink-2 p-3">
          <button
            onClick={togglePlay}
            className={`label flex items-center gap-2 px-4 py-2 border transition-colors cursor-pointer ${
              isPlaying
                ? 'border-rose-signal/60 bg-rose-signal/20 text-rose-signal'
                : 'border-lime bg-lime text-ink font-bold hover:bg-lime/90'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Durdur</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Sinyali Dinle</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 text-muted">
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.35)}
              className="hover:text-paper transition-colors"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input aria-label="Ses seviyesi"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-[var(--lime)] cursor-pointer h-1 bg-ink"
            />
          </div>
        </div>
      </div>

      {/* Signal Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px border border-line bg-line">
        {CELESTIAL_SIGNALS.map((sig, idx) => {
          const isSelected = sig.id === selectedSignal.id;
          return (
            <button
              key={sig.id}
              onClick={() => {
                setSelectedSignal(sig);
                // Retune live: restart the synth on the newly selected source.
                if (isPlaying) startAudio(sig);
              }}
              className={`p-4 text-left flex flex-col justify-between transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-lime text-ink'
                  : 'bg-ink text-paper hover:bg-ink-3'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`label ${isSelected ? 'text-ink/85' : 'text-muted'}`}>
                  0{idx + 1}
                </span>
                <Disc className={`w-3.5 h-3.5 ${isSelected ? 'text-ink animate-spin' : 'text-muted'}`} />
              </div>
              <div>
                <div className="display display-tight text-base font-bold truncate">
                  {sig.name.split(' (')[0]}
                </div>
                <div className={`label mt-1 text-[10px] truncate ${isSelected ? 'text-ink/80' : 'text-muted'}`}>
                  {sig.source.split(' / ')[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Real-time Oscilloscope & Spectrogram Canvas Display */}
      <div className="relative border border-line bg-black overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={240}
          className="w-full h-[220px] md:h-[260px] block"
        />

        {/* Display Overlay Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          <span className="label px-3 py-1 bg-ink/90 border border-line text-lime flex items-center gap-2 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-lime animate-ping" />
            <span>{selectedSignal.frequency}</span>
          </span>
          <span className="label px-2.5 py-1 bg-ink/80 border border-line text-muted backdrop-blur">
            {selectedSignal.discoveryMission}
          </span>
        </div>

        {/* Oscilloscope vs Spectrogram Mode Toggles */}
        <div className="absolute top-4 right-4 flex items-center border border-line bg-ink/90 backdrop-blur">
          <button
            onClick={() => setDisplayMode('oscilloscope')}
            className={`label px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
              displayMode === 'oscilloscope' ? 'bg-paper text-ink font-bold' : 'text-muted hover:text-paper'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>Osiloskop</span>
          </button>
          <button
            onClick={() => setDisplayMode('spectrogram')}
            className={`label px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 border-l border-line ${
              displayMode === 'spectrogram' ? 'bg-paper text-ink font-bold' : 'text-muted hover:text-paper'
            }`}
          >
            <Waves className="w-3 h-3" />
            <span>Spektrogram</span>
          </button>
        </div>

        {/* Status watermark */}
        <div className="absolute bottom-3 right-4 label text-[10px] text-muted pointer-events-none">
          {isPlaying ? 'Canlı Rezonans Aktif · 256-pt FFT' : 'Sinyali Seçin ve Oynatın'}
        </div>
      </div>

      {/* Signal Scientific Explanation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-line bg-line">
        <div className="bg-ink p-6 space-y-2">
          <div className="label text-muted flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-paper" />
            <span>Gök Cismi & Keşif Bilgisi</span>
          </div>
          <p className="text-xs text-paper/80 leading-relaxed pt-1">
            {selectedSignal.description}
          </p>
        </div>

        <div className="bg-ink p-6 space-y-2">
          <div className="label text-lime flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Fiziksel Akustik Mekanizması</span>
          </div>
          <p className="text-xs text-paper/80 leading-relaxed pt-1">
            {selectedSignal.scientificMechanism}
          </p>
        </div>
      </div>
    </div>
  );
}
