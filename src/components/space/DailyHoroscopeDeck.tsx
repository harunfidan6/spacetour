'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Briefcase,
  Zap,
  Calendar,
  AlertTriangle,
  Clock,
  Gem,
  Award
} from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
import {
  ZodiacGlyph,
  PlanetGlyph,
  AstrolabeGlyph,
  FireElementGlyph,
  EarthElementGlyph,
  AirElementGlyph,
  WaterElementGlyph
} from '@/components/ui/CosmicGlyphs';
import { ZODIAC_SIGNS, type ZodiacElement } from '@/data/zodiac';

export function DailyHoroscopeDeck() {
  const [selectedSignId, setSelectedSignId] = useState<string>('koc');
  const [activeCategory, setActiveCategory] = useState<'genel' | 'ask' | 'kariyer' | 'tilsim'>('genel');

  const selectedSign = ZODIAC_SIGNS.find((s) => s.id === selectedSignId) || ZODIAC_SIGNS[0];

  // Dynamic daily energy scores deterministically computed for today
  const dailyScores = React.useMemo(() => {
    // Generate deterministic daily scores per sign based on current day of year
    const today = new Date();
    const daySeed = today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate();
    const signIdx = ZODIAC_SIGNS.findIndex((s) => s.id === selectedSign.id) + 1;

    const love = 70 + ((daySeed * signIdx * 7) % 28);
    const career = 68 + ((daySeed * signIdx * 11) % 30);
    const vitality = 65 + ((daySeed * signIdx * 13) % 33);
    const luck = 72 + ((daySeed * signIdx * 17) % 26);

    return { love, career, vitality, luck };
  }, [selectedSign.id]);

  const elementGlyphMap: Record<ZodiacElement, React.ReactNode> = {
    Ateş: <FireElementGlyph size={14} className="text-solar" />,
    Toprak: <EarthElementGlyph size={14} className="text-lime" />,
    Hava: <AirElementGlyph size={14} className="text-cyan-400" />,
    Su: <WaterElementGlyph size={14} className="text-blue-400" />
  };

  return (
    <div className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8" id="gunluk-burc-fali">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-line pb-6">
        <div>
          <div className="label flex items-center gap-2 text-solar">
            <AstrolabeGlyph size={16} />
            <span>12 ZODYAK KAPISI · GÜNLÜK HOROSKOP VE YAŞAM ENERJİSİ RADARI</span>
          </div>
          <h3 className="display display-tight text-3xl sm:text-4xl text-paper mt-2">
            Günlük Burç Falı & Enerji Radarı
          </h3>
          <p className="text-sm text-paper/70 mt-1 max-w-2xl leading-relaxed">
            Burcunuzu seçerek bugünün aşk, kariyer, zihinsel güç ve kozmik şans potansiyelini anlık efemeris etkileşimiyle inceleyin.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-muted bg-ink-2 p-2.5 border border-line shrink-0">
          <Calendar size={14} className="text-solar" />
          <span>BUGÜN: <strong className="text-paper">{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
        </div>
      </div>

      {/* 12 Zodiac Sign Selector Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
        {ZODIAC_SIGNS.map((sign) => {
          const isSelected = sign.id === selectedSign.id;
          return (
            <button
              key={sign.id}
              onClick={() => setSelectedSignId(sign.id)}
              className={`p-2.5 border text-center transition-all cursor-pointer font-mono flex flex-col items-center justify-between ${
                isSelected
                  ? 'border-solar bg-solar text-ink font-bold shadow-md scale-102 z-10'
                  : 'border-line bg-ink-2 text-muted hover:border-paper hover:text-paper'
              }`}
            >
              <div className="p-1.5 rounded-full mb-1">
                <ZodiacGlyph sign={sign.id} size={22} className={isSelected ? 'text-ink' : 'text-solar'} />
              </div>
              <span className="text-xs font-bold">{sign.name}</span>
              <span className="text-[9px] opacity-75 mt-0.5 truncate w-full">{sign.element}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sign Comprehensive Showcase */}
      <div className="border border-solar/40 bg-ink-2 p-6 sm:p-8 space-y-8">
        {/* Banner with Sign Meta */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-line pb-6">
          <div className="flex items-center gap-5">
            <div className="w-18 h-18 rounded-full border border-line bg-ink flex items-center justify-center p-3 shadow-inner">
              <ZodiacGlyph sign={selectedSign.id} size={48} className="text-solar" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-solar font-bold uppercase tracking-wider">
                  {selectedSign.element} ELEMENTİ · {selectedSign.modality} NİTELİK
                </span>
                <span className="text-muted">·</span>
                <span className="font-mono text-xs text-muted">{selectedSign.dates}</span>
              </div>
              <h4 className="display text-3xl sm:text-4xl text-paper">
                {selectedSign.name} Burcu <span className="serif-i text-xl sm:text-2xl text-gold">({selectedSign.latinName})</span>
              </h4>
              <p className="font-mono text-xs text-muted mt-1">
                Yönetici Gezegen: <strong className="text-paper">{selectedSign.rulingPlanet}</strong> · Arketip: <strong className="text-paper">{selectedSign.traits.archetype}</strong>
              </p>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 border border-line bg-ink p-1 font-mono text-xs shrink-0">
            <button
              onClick={() => setActiveCategory('genel')}
              className={`px-3 py-1.5 cursor-pointer uppercase transition-colors border ${
                activeCategory === 'genel' ? 'border-solar bg-solar text-ink font-bold' : 'border-transparent text-muted hover:text-paper'
              }`}
            >
              Günün Genel Falı
            </button>
            <button
              onClick={() => setActiveCategory('ask')}
              className={`px-3 py-1.5 cursor-pointer uppercase transition-colors border ${
                activeCategory === 'ask' ? 'border-solar bg-solar text-ink font-bold' : 'border-transparent text-muted hover:text-paper'
              }`}
            >
              Aşk & Kalp
            </button>
            <button
              onClick={() => setActiveCategory('kariyer')}
              className={`px-3 py-1.5 cursor-pointer uppercase transition-colors border ${
                activeCategory === 'kariyer' ? 'border-solar bg-solar text-ink font-bold' : 'border-transparent text-muted hover:text-paper'
              }`}
            >
              Kariyer & Para
            </button>
            <button
              onClick={() => setActiveCategory('tilsim')}
              className={`px-3 py-1.5 cursor-pointer uppercase transition-colors border ${
                activeCategory === 'tilsim' ? 'border-solar bg-solar text-ink font-bold' : 'border-transparent text-muted hover:text-paper'
              }`}
            >
              Günün Tılsımları
            </button>
          </div>
        </div>

        {/* 4 Big Daily Energy Gauges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="p-4 border border-line bg-ink space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose flex items-center gap-1.5 font-bold uppercase text-[11px]">
                <Heart size={14} /> Aşk Frekansı
              </span>
              <span className="font-bold text-paper text-sm">%{dailyScores.love}</span>
            </div>
            <div className="h-1.5 w-full bg-ink-2 border border-line overflow-hidden">
              <div className="h-full bg-rose transition-all duration-700" style={{ width: `${dailyScores.love}%` }} />
            </div>
            <span className="text-[10px] text-muted block">Manyetik çekim ve duygusal uyum</span>
          </div>

          <div className="p-4 border border-line bg-ink space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-solar flex items-center gap-1.5 font-bold uppercase text-[11px]">
                <Briefcase size={14} /> Kariyer & Para
              </span>
              <span className="font-bold text-paper text-sm">%{dailyScores.career}</span>
            </div>
            <div className="h-1.5 w-full bg-ink-2 border border-line overflow-hidden">
              <div className="h-full bg-solar transition-all duration-700" style={{ width: `${dailyScores.career}%` }} />
            </div>
            <span className="text-[10px] text-muted block">Verimlilik ve stratejik fırsatlar</span>
          </div>

          <div className="p-4 border border-line bg-ink space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-lime flex items-center gap-1.5 font-bold uppercase text-[11px]">
                <Zap size={14} /> Canlılık & Güç
              </span>
              <span className="font-bold text-paper text-sm">%{dailyScores.vitality}</span>
            </div>
            <div className="h-1.5 w-full bg-ink-2 border border-line overflow-hidden">
              <div className="h-full bg-lime transition-all duration-700" style={{ width: `${dailyScores.vitality}%` }} />
            </div>
            <span className="text-[10px] text-muted block">Zihinsel motivasyon ve dayanıklılık</span>
          </div>

          <div className="p-4 border border-line bg-ink space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gold flex items-center gap-1.5 font-bold uppercase text-[11px]">
                <Sparkles size={14} /> Kozmik Şans
              </span>
              <span className="font-bold text-paper text-sm">%{dailyScores.luck}</span>
            </div>
            <div className="h-1.5 w-full bg-ink-2 border border-line overflow-hidden">
              <div className="h-full bg-gold transition-all duration-700" style={{ width: `${dailyScores.luck}%` }} />
            </div>
            <span className="text-[10px] text-muted block">Eşzamanlılık ve fırsat kapıları</span>
          </div>
        </div>

        {/* Dynamic Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
          {/* Main Interpretation Box */}
          <div className="lg:col-span-8 space-y-4">
            {activeCategory === 'genel' && (
              <div className="space-y-4">
                <div className="p-5 border border-line bg-ink space-y-2">
                  <span className="text-solar uppercase font-bold text-[10px] block">
                    Günün Kozmik Akışı & Gökyüzü Rezonansı
                  </span>
                  <p className="text-paper/90 text-sm leading-relaxed">
                    {selectedSign.dailyHoroscope.energy}
                  </p>
                </div>

                <div className="p-4 border border-line bg-ink flex items-start gap-3">
                  <AlertTriangle size={16} className="text-solar shrink-0 mt-0.5" />
                  <div>
                    <span className="text-solar font-bold uppercase text-[10px] block">Günün Kozmik Tavsiyesi & Sınavı:</span>
                    <p className="text-paper/85 text-xs leading-relaxed mt-1">
                      {selectedSign.dailyHoroscope.cosmicTip}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'ask' && (
              <div className="p-5 border border-line bg-ink space-y-3">
                <span className="text-rose uppercase font-bold text-[10px] flex items-center gap-1.5">
                  <Heart size={14} />
                  Kalp Titreşimleri & Aşk Falı
                </span>
                <p className="text-paper/90 text-sm leading-relaxed">
                  {selectedSign.dailyHoroscope.love}
                </p>
                <div className="pt-3 border-t border-line text-[11px] text-muted">
                  <strong className="text-paper">En Yüksek Aşk Rezonansı:</strong> {selectedSign.loveCompatibility.map((id) => {
                    const compSign = ZODIAC_SIGNS.find((s) => s.id === id);
                    return compSign ? compSign.name : id;
                  }).join(', ')} burçlarıyla derin uyum.
                </div>
              </div>
            )}

            {activeCategory === 'kariyer' && (
              <div className="p-5 border border-line bg-ink space-y-3">
                <span className="text-solar uppercase font-bold text-[10px] flex items-center gap-1.5">
                  <Briefcase size={14} />
                  Kariyer, Başarı & Maddi Fırsatlar
                </span>
                <p className="text-paper/90 text-sm leading-relaxed">
                  {selectedSign.dailyHoroscope.career}
                </p>
                <div className="pt-3 border-t border-line text-[11px] text-muted flex items-center gap-2">
                  <Clock size={13} className="text-solar" />
                  <span>En Verimli Eylem Saatleri: <strong className="text-paper">{selectedSign.dailyHoroscope.luckyHours}</strong></span>
                </div>
              </div>
            )}

            {activeCategory === 'tilsim' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 border border-line bg-ink space-y-1">
                  <span className="text-muted block text-[10px] uppercase">Günün Uğurlu Taşı</span>
                  <div className="flex items-center gap-2">
                    <Gem size={15} className="text-lime" />
                    <span className="text-paper font-bold text-sm">{selectedSign.details.stone}</span>
                  </div>
                  <span className="text-[10px] text-muted">Toprak ve beden rezonansını güçlendirir.</span>
                </div>

                <div className="p-4 border border-line bg-ink space-y-1">
                  <span className="text-muted block text-[10px] uppercase">Günün Sayıları</span>
                  <div className="flex items-center gap-2">
                    <Award size={15} className="text-solar" />
                    <span className="text-paper font-bold text-sm">
                      {selectedSign.details.luckyNumbers.join(', ')}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted">Kozmik numerolojik uyum frekansları.</span>
                </div>

                <div className="p-4 border border-line bg-ink space-y-1">
                  <span className="text-muted block text-[10px] uppercase">Günün Renkleri</span>
                  <span className="text-paper font-bold text-sm">
                    {selectedSign.details.colors.join(', ')}
                  </span>
                  <span className="text-[10px] text-muted">Aura katmanını besleyen tonlar.</span>
                </div>

                <div className="p-4 border border-line bg-ink space-y-1">
                  <span className="text-muted block text-[10px] uppercase">Motto & Olumlama</span>
                  <span className="text-paper italic font-serif text-sm">
                    &quot;{selectedSign.traits.motto}&quot;
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Dossier */}
          <div className="lg:col-span-4 border border-line bg-ink p-5 space-y-4">
            <span className="text-[10px] text-muted uppercase tracking-widest block border-b border-line pb-2">
              BURÇ KİMLİK KARTI
            </span>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted">Kozmik Element:</span>
                <span className="text-paper font-bold flex items-center gap-1.5">
                  {elementGlyphMap[selectedSign.element]}
                  {selectedSign.element}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted">Nitelik:</span>
                <span className="text-paper font-bold">{selectedSign.modality}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted">Yönetici Prensip:</span>
                <span className="text-paper font-bold flex items-center gap-1.5">
                  <PlanetGlyph planet={selectedSign.rulingPlanetId} size={14} className="text-solar" />
                  {selectedSign.rulingPlanet}
                </span>
              </div>

              <div className="pt-2 border-t border-line">
                <span className="text-muted block text-[10px] uppercase mb-1">Güçlü Yönler:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedSign.traits.strengths.slice(0, 3).map((st) => (
                    <span key={st} className="px-2 py-0.5 bg-ink-2 border border-line text-lime text-[10px]">
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-line">
                <span className="text-muted block text-[10px] uppercase mb-1">Gölge Yönler:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedSign.traits.shadows.slice(0, 2).map((sh) => (
                    <span key={sh} className="px-2 py-0.5 bg-ink-2 border border-line text-rose text-[10px]">
                      {sh}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
