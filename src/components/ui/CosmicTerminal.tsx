'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Terminal, 
  Search, 
  Zap, 
  Orbit, 
  Compass, 
  Activity, 
  Globe, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  Eye, 
  Moon, 
  Flame, 
  Maximize2,
  X
} from 'lucide-react';
import { useSpace } from '@/components/space/SpaceContext';

export interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'ORBIT' | 'LAB' | 'NAV' | 'SYSTEM';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  action: () => void;
}

export function CosmicTerminal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'ORBIT' | 'LAB' | 'NAV' | 'SYSTEM'>('ALL');
  
  const router = useRouter();
  const { setDestination, focusCurrentDestination, toggleAutoPilot, toggleOrbitMode, orbitMode } = useSpace();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const navigateTo = (path: string, hash?: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === path && hash) {
        window.location.hash = hash;
      } else {
        router.push(hash ? `${path}${hash}` : path);
      }
    }
    setOpen(false);
  };

  // Define commands
  const commands: CommandItem[] = useMemo(() => [
    // --- ORBIT & CELESTIAL DESTINATIONS ---
    {
      id: 'nav-dest-sun',
      title: 'Hedef: Güneş (Sol)',
      subtitle: 'Sarı cüce yıldız · Plazma granülasyonu · 0.00 AU',
      category: 'ORBIT',
      badge: 'YILDIZ',
      icon: Flame,
      action: () => {
        setDestination('sun');
        setOpen(false);
      },
    },
    {
      id: 'nav-dest-earth',
      title: 'Hedef: Dünya (Terra) & ISS Yörüngesi',
      subtitle: 'NASA Gece/Gündüz haritası · 420 km ISS uydusu · 1.00 AU',
      category: 'ORBIT',
      badge: 'YAŞAM ALANI',
      icon: Globe,
      action: () => {
        setDestination('earth');
        setOpen(false);
      },
    },
    {
      id: 'nav-dest-mars',
      title: 'Hedef: Mars (Kızıl Gezegen)',
      subtitle: 'Demir oksit regolit · Olympus Mons · 1.52 AU',
      category: 'ORBIT',
      badge: 'KOLONİ',
      icon: Compass,
      action: () => {
        setDestination('mars');
        setOpen(false);
      },
    },
    {
      id: 'nav-dest-jupiter',
      title: 'Hedef: Jüpiter (Gaz Devi)',
      subtitle: 'Büyük Kırmızı Leke · NASA Cassini zonel bantları · 5.20 AU',
      category: 'ORBIT',
      badge: 'GAZ DEVİ',
      icon: Orbit,
      action: () => {
        setDestination('jupiter');
        setOpen(false);
      },
    },
    {
      id: 'nav-dest-saturn',
      title: 'Hedef: Satürn (Halkalı Dev)',
      subtitle: 'Analitik halka ve küre gölge iz düşümü · 9.58 AU',
      category: 'ORBIT',
      badge: 'HALKALI DEV',
      icon: Moon,
      action: () => {
        setDestination('saturn');
        setOpen(false);
      },
    },
    {
      id: 'nav-dest-blackhole',
      title: 'Hedef: Gargantua (Tekillik & Olay Ufku)',
      subtitle: 'Göreli Doppler akresyon diski · Işık bükülmesi',
      category: 'ORBIT',
      badge: 'KARA DELİK',
      icon: Sparkles,
      action: () => {
        setDestination('blackhole');
        setOpen(false);
      },
    },
    {
      id: 'nav-dest-overview',
      title: 'Hedef: Güneş Sistemi Genel Görünümü',
      subtitle: 'Tüm gezegen yörüngelerinin heliosferik perspektifi',
      category: 'ORBIT',
      badge: 'SİSTEM',
      icon: Maximize2,
      action: () => {
        setDestination('solar-overview');
        setOpen(false);
      },
    },

    // --- NOBEL SCIENCE LABS ---
    {
      id: 'lab-ligo',
      title: 'Laboratuvar: LIGO / Virgo Kütleçekimsel Dalga İnterferometresi',
      subtitle: 'Uzayzaman dalgaları (h+, h×) · Cıvıltı ses sentezleyicisi (Chirp)',
      category: 'LAB',
      badge: 'NOBEL 2017',
      icon: Activity,
      action: () => navigateTo('/ansiklopedi', '#lab-ligo'),
    },
    {
      id: 'lab-cmb',
      title: 'Laboratuvar: Planck CMB 3D Kozmik Arka Plan Işıması',
      subtitle: 'Büyük Patlama relikti 2.725K · Akustik tepeler & Evrenin geometrisi',
      category: 'LAB',
      badge: 'KOZMOLOJİ',
      icon: Globe,
      action: () => navigateTo('/ansiklopedi', '#lab-cmb'),
    },
    {
      id: 'lab-orrery',
      title: 'Laboratuvar: 3D Kepler Solar Orrery',
      subtitle: 'Gezegenlerin gerçek açısal hızlarıyla dönen 3D mekanik model',
      category: 'LAB',
      badge: 'L1',
      icon: Orbit,
      action: () => navigateTo('/ansiklopedi', '#lab-orrery'),
    },
    {
      id: 'lab-scale',
      title: 'Laboratuvar: Gezegen Boyut & Ölçek Karşılaştırıcı',
      subtitle: 'Hacimsel oranlar ve gök cisimlerinin görsel ölçeklenmesi',
      category: 'LAB',
      badge: 'L2',
      icon: Maximize2,
      action: () => navigateTo('/ansiklopedi', '#lab-olcek'),
    },
    {
      id: 'lab-gravity',
      title: 'Laboratuvar: Kütleçekim Alanı & Zıplama Hesaplayıcı',
      subtitle: 'Farklı gezegenlerde ağırlık ve dikey zıplama yüksekliği',
      category: 'LAB',
      badge: 'L3',
      icon: Activity,
      action: () => navigateTo('/ansiklopedi', '#lab-kutlecekim'),
    },
    {
      id: 'lab-time',
      title: 'Laboratuvar: Kozmik Zaman Makinesi',
      subtitle: 'Büyük Patlama’dan bugüne evrenin kilometre taşları ve ışık gecikmesi',
      category: 'LAB',
      badge: 'L4',
      icon: Sparkles,
      action: () => navigateTo('/ansiklopedi', '#lab-zaman'),
    },
    {
      id: 'lab-exoplanet',
      title: 'Laboratuvar: Ötegezegen Gezgini',
      subtitle: 'Yaşanabilir kuşaktaki ötegezegenlerin atmosferik ve termal karşılaştırması',
      category: 'LAB',
      badge: 'L5',
      icon: Compass,
      action: () => navigateTo('/ansiklopedi', '#lab-otegezegen'),
    },
    {
      id: 'lab-impact',
      title: 'Laboratuvar: Asteroit Çarpışma & Torino Ölçeği Simülatörü',
      subtitle: 'Kinetik enerji, krater çapı ve küresel etki tahmini',
      category: 'LAB',
      badge: 'L6',
      icon: Flame,
      action: () => navigateTo('/ansiklopedi', '#lab-asteroit'),
    },
    {
      id: 'lab-blackhole',
      title: 'Laboratuvar: Kara Delik & Zaman Genleşmesi',
      subtitle: 'Olay ufkuna yaklaştıkça yerçekimsel kırmızıya kayma ve saatlerin yavaşlaması',
      category: 'LAB',
      badge: 'L7',
      icon: Sparkles,
      action: () => navigateTo('/ansiklopedi', '#lab-karadelik'),
    },
    {
      id: 'lab-hohmann',
      title: 'Laboratuvar: Hohmann Transfer Yörüngesi',
      subtitle: 'Gezegenlerarası minimum enerji rotası ve Delta-v hesabı',
      category: 'LAB',
      badge: 'L8',
      icon: Compass,
      action: () => navigateTo('/ansiklopedi', '#lab-hohmann'),
    },

    // --- OBSERVATORY INSTRUMENTS ---
    {
      id: 'inst-webb-hubble',
      title: 'Gözlem Enstrümanı: Hubble vs James Webb',
      subtitle: 'Kızılötesi ve optik derin uzay karşılaştırma sürgüsü',
      category: 'LAB',
      badge: 'TELESKOP',
      icon: Eye,
      action: () => navigateTo('/gozlemevi', '#lab-webb-hubble'),
    },
    {
      id: 'inst-radio',
      title: 'Gözlem Enstrümanı: Kozmik Radyo & Pulsar Spektrografı',
      subtitle: 'Pulsar atımlarını ve radyo emisyonlarını sese çevir',
      category: 'LAB',
      badge: 'RADYO',
      icon: Activity,
      action: () => navigateTo('/gozlemevi', '#lab-radyo'),
    },
    {
      id: 'inst-spectroscopy',
      title: 'Gözlem Enstrümanı: Yıldız Spektroskopisi & Fraunhofer',
      subtitle: 'Balmer serisi, tayf sınıfları ve Doppler kayması',
      category: 'LAB',
      badge: 'SPEKTRUM',
      icon: Sparkles,
      action: () => navigateTo('/gozlemevi', '#lab-spektroskopi'),
    },
    {
      id: 'inst-transit',
      title: 'Gözlem Enstrümanı: Ötegezegen Transit Fotometrisi',
      subtitle: 'Işık eğrisi düşüşü ile ötegezegen yarıçapı ölçümü',
      category: 'LAB',
      badge: 'FOTOMETRİ',
      icon: Orbit,
      action: () => navigateTo('/gozlemevi', '#lab-transit'),
    },

    // --- SKY MAP TOOLS ---
    {
      id: 'tool-bright-stars',
      title: 'Gök Haritası: En Parlak 8 Yıldız & Kerteriz Radarı',
      subtitle: 'Kadir, tayf türü, uzaklık ve anlık Alt-Azimuth koordinatları',
      category: 'LAB',
      badge: 'KERTERİZ',
      icon: Sparkles,
      action: () => navigateTo('/harita', '#lab-parlak-yildizlar'),
    },
    {
      id: 'tool-bortle',
      title: 'Gök Haritası: Bortle Işık Kirliliği Skalası',
      subtitle: 'Sınıf 1 (saf karanlık) ile Sınıf 9 (şehir merkezi) simülasyonu',
      category: 'LAB',
      badge: 'BORTLE',
      icon: Eye,
      action: () => navigateTo('/harita', '#lab-bortle'),
    },
    {
      id: 'tool-messier',
      title: 'Gök Haritası: Messier Derin Uzay Atlası & Radarı',
      subtitle: 'Galaksiler, salma bulutsuları ve yıldız kümeleri konumları',
      category: 'LAB',
      badge: 'MESSIER',
      icon: Compass,
      action: () => navigateTo('/harita', '#lab-messier'),
    },
    {
      id: 'tool-polaris',
      title: 'Gök Haritası: Kutup Yıldızı & 25.772 Yıllık Presesyon',
      subtitle: 'Büyük Ayı yıldız atlaması ve Dünya presesyon döngüsü',
      category: 'LAB',
      badge: 'POLARİS',
      icon: Compass,
      action: () => navigateTo('/harita', '#lab-polaris'),
    },

    // --- NAVIGATION ---
    {
      id: 'nav-map',
      title: 'Modül: Gökyüzü Haritası (Planetarium)',
      subtitle: 'Yıldız katalogları, takımyıldız çizgileri ve gök koordinatları',
      category: 'NAV',
      badge: 'GÖKKUBE',
      icon: Compass,
      action: () => navigateTo('/harita'),
    },
    {
      id: 'nav-calendar',
      title: 'Modül: Astronomik Olay Takvimi',
      subtitle: 'Güneş ve Ay tutulmaları, meteor yağmurları, kavuşumlar',
      category: 'NAV',
      badge: 'TAKVİM',
      icon: Calendar,
      action: () => navigateTo('/takvim'),
    },
    {
      id: 'nav-encyclopedia',
      title: 'Modül: Kozmik Ansiklopedi',
      subtitle: 'Güneş Sistemi, uydular, takımyıldızları ve 10 interaktif laboratuvar',
      category: 'NAV',
      badge: 'ANSİKLOPEDİ',
      icon: BookOpen,
      action: () => navigateTo('/ansiklopedi'),
    },
    {
      id: 'nav-observatory',
      title: 'Modül: Canlı Gözlemevi',
      subtitle: 'Görüş kalitesi, bulutluluk, NASA APOD ve atmosferik şeffaflık',
      category: 'NAV',
      badge: 'GÖZLEMEVİ',
      icon: Eye,
      action: () => navigateTo('/gozlemevi'),
    },
    {
      id: 'nav-astrology',
      title: 'Modül: Astroloji & Zodyak Atlası',
      subtitle: 'Doğum haritası, günlük göksel transitler, sinastri analizi ve kozmik tarot',
      category: 'NAV',
      badge: 'ZODYAK',
      icon: Moon,
      action: () => navigateTo('/astroloji'),
    },

    // --- SYSTEM CONTROLS ---
    {
      id: 'sys-orbit-toggle',
      title: `Kumanda: Yörünge Efemerisi (${orbitMode === 'j2000' ? 'Didaktik Sıralamaya Geç' : 'Canlı J2000 Moduna Geç'})`,
      subtitle: 'NASA/JPL Keplerian yörünge mekaniği ile gezegenleri gerçek koordinatlara yerleştirir',
      category: 'SYSTEM',
      badge: orbitMode === 'j2000' ? 'AKTİF: J2000' : 'DİDAKTİK',
      icon: Orbit,
      action: () => {
        toggleOrbitMode();
        setOpen(false);
      },
    },
    {
      id: 'sys-focus',
      title: 'Kumanda: Seçili Hedefe Odaklan',
      subtitle: 'Kamerayı seçili gök cismine doğru yumuşak açıyla hizalar',
      category: 'SYSTEM',
      badge: 'KAMERA',
      icon: Orbit,
      action: () => {
        focusCurrentDestination();
        setOpen(false);
      },
    },
    {
      id: 'sys-autopilot',
      title: 'Kumanda: Sinematik Otopilotu Aç / Kapat',
      subtitle: 'Güneş Sistemi durakları arasında otomatik sinematik tur',
      category: 'SYSTEM',
      badge: 'OTONOM',
      icon: Compass,
      action: () => {
        toggleAutoPilot();
        setOpen(false);
      },
    },
  ], [orbitMode, setDestination, toggleOrbitMode, focusCurrentDestination, toggleAutoPilot, router]);

  const resetSearch = () => {
    setQuery('');
    setSelectedIndex(0);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (!open) resetSearch();
        setOpen((prev) => !prev);
      }
      // Escape
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };

    const handleCustomOpen = () => {
      resetSearch();
      setOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-cosmic-terminal', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-cosmic-terminal', handleCustomOpen);
    };
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, [open]);

  // Filter commands
  const filteredCommands = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    return commands.filter((cmd) => {
      const matchesCategory = selectedCategory === 'ALL' || cmd.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        cmd.title.toLocaleLowerCase('tr-TR').includes(q) ||
        cmd.subtitle.toLocaleLowerCase('tr-TR').includes(q) ||
        cmd.category.toLocaleLowerCase('tr-TR').includes(q)
      );
    });
  }, [commands, query, selectedCategory]);

  // Arrow key navigation
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (filteredCommands.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredCommands[selectedIndex];
      if (selected) {
        selected.action();
      }
    }
  };

  // Keep selected in view
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.children;
    if (items[selectedIndex]) {
      (items[selectedIndex] as HTMLElement).scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-start justify-center bg-black/85 p-4 pt-16 backdrop-blur-md sm:pt-24"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-2xl border border-line bg-ink shadow-[0_25px_80px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyNavigation}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-line bg-ink-2 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Terminal size={14} className="text-solar" />
            <span className="font-mono text-xs uppercase tracking-wider text-paper font-bold">
              Kozmik Kumanda Terminali
            </span>
            <span className="border border-line bg-ink px-1.5 py-0.5 font-mono text-[9px] text-muted">
              v2.4 ASTRO-OS
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[10px] text-muted sm:inline">
              [ESC] Kapat
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-paper/60 hover:text-paper cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Search size={16} className="text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Bir yörünge hedefi, laboratuvar veya sistem komutu arayın..."
            className="w-full bg-transparent font-mono text-sm text-paper placeholder:text-paper/30 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }}
              className="font-mono text-xs text-muted hover:text-paper cursor-pointer"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Filter Category Pills */}
        <div className="no-scrollbar flex items-center gap-1.5 border-b border-line bg-ink-2 px-4 py-2 overflow-x-auto">
          {(['ALL', 'ORBIT', 'LAB', 'NAV', 'SYSTEM'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'border border-solar bg-solar/15 text-solar font-bold'
                  : 'text-muted hover:text-paper'
              }`}
            >
              {cat === 'ALL' ? 'Tümü' : cat === 'ORBIT' ? 'Yörünge' : cat}
            </button>
          ))}
          <span className="ml-auto font-mono text-[10px] text-muted">
            {filteredCommands.length} komut
          </span>
        </div>

        {/* Command List */}
        <ul
          ref={listRef}
          className="max-h-[380px] overflow-y-auto divide-y divide-line/40 p-2"
        >
          {filteredCommands.length === 0 ? (
            <li className="p-8 text-center font-mono text-xs text-muted">
              Eşleşen komut bulunamadı. Lütfen başka bir anahtar kelime deneyin.
            </li>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = cmd.icon;

              return (
                <li
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group flex items-center justify-between gap-3 p-3 transition-colors cursor-pointer ${
                    isSelected
                      ? 'border border-solar/60 bg-solar/10 text-paper'
                      : 'border border-transparent hover:bg-ink-3 text-paper/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`grid h-8 w-8 place-items-center border shrink-0 transition-colors ${
                        isSelected
                          ? 'border-solar bg-solar text-ink'
                          : 'border-line bg-ink-2 text-paper/70'
                      }`}
                    >
                      <Icon size={14} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-paper truncate">
                          {cmd.title}
                        </span>
                        {cmd.badge && (
                          <span className="border border-line bg-ink px-1.5 py-0.2 font-mono text-[9px] text-muted shrink-0">
                            {cmd.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 font-mono text-[11px] text-muted truncate">
                        {cmd.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <span className="font-mono text-[10px] text-solar font-bold">
                        ↵ ÇALIŞTIR
                      </span>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>

        {/* Terminal Footer */}
        <div className="flex flex-wrap items-center justify-between border-t border-line bg-ink-2 px-4 py-2.5 font-mono text-[10px] text-muted">
          <div className="flex items-center gap-3">
            <span>[↑↓] Gezin</span>
            <span>[↵] Seç</span>
            <span>[ESC] Kapat</span>
          </div>
          <span className="text-solar">SpaceTour Kinetik Kozmos Engine</span>
        </div>
      </div>
    </div>
  );
}
