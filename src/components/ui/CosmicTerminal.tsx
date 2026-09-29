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
import { useSpace, DestinationId } from '@/components/space/SpaceContext';

export interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'WARP' | 'LAB' | 'NAV' | 'SYSTEM';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  action: () => void;
}

export function CosmicTerminal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'WARP' | 'LAB' | 'NAV' | 'SYSTEM'>('ALL');
  
  const router = useRouter();
  const { setDestination, triggerWarp, toggleAutoPilot, toggleOrbitMode, orbitMode } = useSpace();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Define commands
  const commands: CommandItem[] = useMemo(() => [
    // --- WARP COMMANDS ---
    {
      id: 'warp-sun',
      title: 'Warp: Güneş (Sol)',
      subtitle: 'Sarı cüce yıldız · Plazma granülasyonu · 0.00 AU',
      category: 'WARP',
      badge: 'YILDIZ',
      icon: Flame,
      action: () => {
        setDestination('sun');
        setOpen(false);
      },
    },
    {
      id: 'warp-earth',
      title: 'Warp: Dünya (Terra) & ISS Yörüngesi',
      subtitle: 'NASA Gece/Gündüz haritası · 420 km ISS uydusu · 1.00 AU',
      category: 'WARP',
      badge: 'YAŞAM ALANI',
      icon: Globe,
      action: () => {
        setDestination('earth');
        setOpen(false);
      },
    },
    {
      id: 'warp-mars',
      title: 'Warp: Mars (Kızıl Gezegen)',
      subtitle: 'Demir oksit regolit · Olympus Mons · 1.52 AU',
      category: 'WARP',
      badge: 'KOLONİ',
      icon: Compass,
      action: () => {
        setDestination('mars');
        setOpen(false);
      },
    },
    {
      id: 'warp-jupiter',
      title: 'Warp: Jüpiter (Gaz Devi)',
      subtitle: 'Büyük Kırmızı Leke · NASA Cassini zonel bantları · 5.20 AU',
      category: 'WARP',
      badge: 'GAZ DEVİ',
      icon: Orbit,
      action: () => {
        setDestination('jupiter');
        setOpen(false);
      },
    },
    {
      id: 'warp-saturn',
      title: 'Warp: Satürn (Halkalı Dev)',
      subtitle: 'Analitik halka ve küre gölge iz düşümü · 9.58 AU',
      category: 'WARP',
      badge: 'HALKALI DEV',
      icon: Moon,
      action: () => {
        setDestination('saturn');
        setOpen(false);
      },
    },
    {
      id: 'warp-blackhole',
      title: 'Warp: Gargantua (Tekillik & Olay Ufku)',
      subtitle: 'Göreli Doppler akresyon diski · Işık bükülmesi',
      category: 'WARP',
      badge: 'KARA DELİK',
      icon: Sparkles,
      action: () => {
        setDestination('blackhole');
        setOpen(false);
      },
    },
    {
      id: 'warp-overview',
      title: 'Warp: Güneş Sistemi Genel Görünümü',
      subtitle: 'Tüm gezegen yörüngelerinin heliosferik perspektifi',
      category: 'WARP',
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
      action: () => {
        router.push('/ansiklopedi#L9');
        setOpen(false);
      },
    },
    {
      id: 'lab-cmb',
      title: 'Laboratuvar: Planck CMB 3D Kozmik Arka Plan Işıması',
      subtitle: 'Büyük Patlama relikti 2.725K · Akustik tepeler & Evrenin geometrisi',
      category: 'LAB',
      badge: 'KOZMOLOJİ',
      icon: Globe,
      action: () => {
        router.push('/ansiklopedi#L10');
        setOpen(false);
      },
    },
    {
      id: 'lab-orrery',
      title: 'Laboratuvar: 3D Kepler Solar Orrery',
      subtitle: 'Gezegenlerin gerçek açısal hızlarıyla dönen 3D mekanik model',
      category: 'LAB',
      badge: 'L1',
      icon: Orbit,
      action: () => {
        router.push('/ansiklopedi#L1');
        setOpen(false);
      },
    },
    {
      id: 'lab-scale',
      title: 'Laboratuvar: Gezegen Boyut & Ölçek Karşılaştırıcı',
      subtitle: 'Hacimsel oranlar ve gök cisimlerinin görsel ölçeklenmesi',
      category: 'LAB',
      badge: 'L2',
      icon: Maximize2,
      action: () => {
        router.push('/ansiklopedi#L2');
        setOpen(false);
      },
    },
    {
      id: 'lab-gravity',
      title: 'Laboratuvar: Kütleçekim Alanı & Zıplama Hesaplayıcı',
      subtitle: 'Farklı gezegenlerde ağırlık ve dikey zıplama yüksekliği',
      category: 'LAB',
      badge: 'L3',
      icon: Activity,
      action: () => {
        router.push('/ansiklopedi#L3');
        setOpen(false);
      },
    },
    {
      id: 'lab-impact',
      title: 'Laboratuvar: Asteroit Çarpışma & Torino Ölçeği Simülatörü',
      subtitle: 'Kinetik enerji, krater çapı ve küresel etki tahmini',
      category: 'LAB',
      badge: 'L6',
      icon: Flame,
      action: () => {
        router.push('/ansiklopedi#L6');
        setOpen(false);
      },
    },
    {
      id: 'lab-hohmann',
      title: 'Laboratuvar: Hohmann Transfer Yörüngesi',
      subtitle: 'Gezegenlerarası minimum enerji rotası ve Delta-v hesabı',
      category: 'LAB',
      badge: 'L8',
      icon: Compass,
      action: () => {
        router.push('/ansiklopedi#L8');
        setOpen(false);
      },
    },

    // --- NAVIGATION ---
    {
      id: 'nav-map',
      title: 'Modül: Gökyüzü Haritası (Planetarium)',
      subtitle: 'Yıldız katalogları, takımyıldız çizgileri ve gök koordinatları',
      category: 'NAV',
      badge: 'GÖKKUBE',
      icon: Compass,
      action: () => {
        router.push('/harita');
        setOpen(false);
      },
    },
    {
      id: 'nav-calendar',
      title: 'Modül: Astronomik Olay Takvimi',
      subtitle: 'Güneş ve Ay tutulmaları, meteor yağmurları, kavuşumlar',
      category: 'NAV',
      badge: 'TAKVİM',
      icon: Calendar,
      action: () => {
        router.push('/takvim');
        setOpen(false);
      },
    },
    {
      id: 'nav-encyclopedia',
      title: 'Modül: Kozmik Ansiklopedi',
      subtitle: 'Güneş Sistemi, uydular, takımyıldızları ve 10 interaktif laboratuvar',
      category: 'NAV',
      badge: 'ANSİKLOPEDİ',
      icon: BookOpen,
      action: () => {
        router.push('/ansiklopedi');
        setOpen(false);
      },
    },
    {
      id: 'nav-observatory',
      title: 'Modül: Canlı Gözlemevi',
      subtitle: 'Görüş kalitesi, bulutluluk, NASA APOD ve atmosferik şeffaflık',
      category: 'NAV',
      badge: 'GÖZLEMEVİ',
      icon: Eye,
      action: () => {
        router.push('/gozlemevi');
        setOpen(false);
      },
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
      id: 'sys-warp',
      title: 'Kumanda: Relativistik Warp Sıçraması',
      subtitle: 'Hiperuzay FOV distorsiyonu ve maviye kayma parçacık akışı',
      category: 'SYSTEM',
      badge: 'HİPERUZAY',
      icon: Zap,
      action: () => {
        triggerWarp();
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
  ], [orbitMode, setDestination, toggleOrbitMode, triggerWarp, toggleAutoPilot, router]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      // Escape
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };

    const handleCustomOpen = () => setOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-cosmic-terminal', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-cosmic-terminal', handleCustomOpen);
    };
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setQuery('');
      setSelectedIndex(0);
    }
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
            placeholder="Bir warp hedefi, laboratuvar veya sistem komutu arayın..."
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
          {(['ALL', 'WARP', 'LAB', 'NAV', 'SYSTEM'] as const).map((cat) => (
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
              {cat === 'ALL' ? 'Tümü' : cat}
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
