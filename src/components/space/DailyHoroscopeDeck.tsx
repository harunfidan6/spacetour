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
import { useNow } from '@/lib/useNow';
import { dailyReading } from '@/lib/astrology/dailyHoroscope';

export function DailyHoroscopeDeck() {
  const [selectedSignId, setSelectedSignId] = useState<string>('koc');
  const [activeCategory, setActiveCategory] = useState<'genel' | 'ask' | 'kariyer' | 'tilsim'>('genel');

  const selectedSign = ZODIAC_SIGNS.find((s) => s.id === selectedSignId) || ZODIAC_SIGNS[0];

  // Today's reading from the real sky; only known after mount so the static HTML never freezes a date
  const now = useNow(60_000);
  const reading = React.useMemo(() => (now ? dailyReading(selectedSign.id, now) : null), [now, selectedSign.id]);
  const dailyScores = reading?.scores ?? { love: 0, career: 0, vitality: 0, luck: 0 };
  const pending = 'Bugünün gökyüzü hesaplanıyor…';
  const today = now ? now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' }) : '—';

  const elementGlyphMap: Record<ZodiacElement, React.ReactNode> = {
    Ateş: <FireElementGlyph size={14} className="text-gold" />,
    Toprak: <EarthElementGlyph size={14} className="text-lime" />,
    Hava: <AirElementGlyph size={14} className="text-cyan-400" />,
    Su: <WaterElementGlyph size={14} className="text-blue-400" />
  };

  return (
    <div className="relative border border-line bg-ink p-6 sm:p-10 space-y-8" id="gunluk-burc-fali">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-line pb-6">
        <div>
          <div className="doc-kicker text-gold flex items-center gap-2">
            <AstrolabeGlyph size={16} />
            <span>12 Zodyak Burcu · Günlük Yorum ve Gezegen Konumları</span>
          </div>
          <h3 className="doc-title text-2xl sm:text-3xl text-paper mt-2">
            Günlük Burç Yorumu
          </h3>
          <p className="text-sm text-paper/70 mt-1 max-w-2xl leading-relaxed">
            Burcunuzu seçerek bugünün aşk, kariyer, zihinsel odak ve gezegensel etkileşimlerini inceleyin.
          </p>
        </div>

        <div className="flex items-center gap-2 doc-caption text-paper/80 bg-ink-2 p-2.5 border border-line shrink-0">
          <Calendar size={14} className="text-gold" />
          <span>BUGÜN: <strong className="text-paper">{today}</strong></span>
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
                  ? 'border-gold bg-gold text-ink font-bold shadow-md scale-102 z-10'
                  : 'border-line bg-ink-2 text-paper/70 hover:border-paper/40 hover:text-paper'
              }`}
            >
              <div className="p-1.5 rounded-full mb-1">
                <ZodiacGlyph sign={sign.id} size={22} className={isSelected ? 'text-ink' : 'text-gold'} />
              </div>
              <span className="text-xs font-bold">{sign.name}</span>
              <span className="text-[10px] opacity-75 mt-0.5 truncate w-full">{sign.element}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sign Comprehensive Showcase */}
      <div className="border border-line bg-ink-2 p-6 sm:p-8 space-y-8">
        {/* Banner with Sign Meta */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-line pb-6">
          <div className="flex items-center gap-5">
            <div className="w-18 h-18 rounded-full border border-line bg-ink flex items-center justify-center p-3 shadow-inner">
              <ZodiacGlyph sign={selectedSign.id} size={48} className="text-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="doc-kicker text-gold uppercase">
                  {selectedSign.element} Elementi · {selectedSign.modality} Nitelik
                </span>
                <span className="text-muted">·</span>
                <span className="doc-caption text-paper/60">{selectedSign.dates}</span>
              </div>
              <h4 className="doc-title text-2xl sm:text-3xl text-paper">
                {selectedSign.name} Burcu <span className="doc-serif italic text-xl sm:text-2xl text-gold/90">({selectedSign.latinName})</span>
              </h4>
              <p className="doc-caption text-xs text-paper/60 mt-1">
                Yönetici Gezegen: <strong className="text-paper">{selectedSign.rulingPlanet}</strong> · Arketip: <strong className="text-paper">{selectedSign.traits.archetype}</strong>
              </p>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 border border-line bg-ink p-1 font-mono text-xs shrink-0">
            <button
              onClick={() => setActiveCategory('genel')}
              className={`px-3 py-1.5 cursor-pointer uppercase transition-colors border ${
                activeCategory === 'genel' ? 'border-gold bg-gold text-ink font-semibold' : 'border-transparent text-paper/60 hover:text-paper'
              }`}
            >
              Günün Genel Falı
            </button>
            <button
              onClick={() => setActiveCategory('ask')}
              className={`px-3 py-1.5 cursor-pointer uppercase transition-colors border ${
                activeCategory === 'ask' ? 'border-gold bg-gold text-ink font-semibold' : 'border-transparent text-paper/60 hover:text-paper'
              }`}
            >
              Aşk & Kalp
            </button>
            <button
              onClick={() => setActiveCategory('kariyer')}
              className={`px-3 py-1.5 cursor-pointer uppercase transition-colors border ${
                activeCategory === 'kariyer' ? 'border-gold bg-gold text-ink font-semibold' : 'border-transparent text-paper/60 hover:text-paper'
              }`}
            >
              Kariyer & Para
            </button>
            <button
              onClick={() => setActiveCategory('tilsim')}
              className={`px-3 py-1.5 cursor-pointer uppercase transition-colors border ${
                activeCategory === 'tilsim' ? 'border-gold bg-gold text-ink font-semibold' : 'border-transparent text-paper/60 hover:text-paper'
              }`}
            >
              Burç Tılsımları
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
              <span className="text-gold flex items-center gap-1.5 font-bold uppercase text-[11px]">
                <Briefcase size={14} /> Kariyer & Para
              </span>
              <span className="font-bold text-paper text-sm">%{dailyScores.career}</span>
            </div>
            <div className="h-1.5 w-full bg-ink-2 border border-line overflow-hidden">
              <div className="h-full bg-gold transition-all duration-700" style={{ width: `${dailyScores.career}%` }} />
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

        {/* Today's sky behind the reading */}
        {reading && (
          <div className="flex flex-wrap gap-2 font-mono text-[11px]">
            <span className="border border-line bg-ink px-3 py-1.5 text-paper/80">Ay bugün <strong className="text-paper">{reading.moonIn}</strong></span>
            <span className="border border-line bg-ink px-3 py-1.5 text-paper/80">Senin <strong className="text-paper">{reading.house}. evin</strong> · {reading.houseArea}</span>
            <span className="border border-line bg-ink px-3 py-1.5 text-paper/80">{reading.phaseName}</span>
            <span className="border border-line bg-ink px-3 py-1.5 text-paper/80">Günün yöneticisi: {reading.dayRuler}</span>
            {reading.mercuryRetro && <span className="border border-rose/50 bg-rose/10 px-3 py-1.5 text-rose">Merkür geri harekette</span>}
          </div>
        )}
        {reading?.moonChange && <p className="font-mono text-[11px] text-muted">{reading.moonChange}</p>}

        {/* Dynamic Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
          {/* Main Interpretation Box */}
          <div className="lg:col-span-8 space-y-4">
            {activeCategory === 'genel' && (
              <div className="space-y-4">
                <div className="p-5 border border-line bg-ink space-y-2">
                  <span className="doc-kicker text-gold uppercase block mb-1">
                    Günün Kozmik Akışı & Gökyüzü Rezonansı
                  </span>
                  <p className="text-paper/90 text-sm leading-relaxed">
                    {reading ? reading.energy : pending}
                  </p>
                </div>

                <div className="p-4 border border-line bg-ink flex items-start gap-3">
                  <AlertTriangle size={16} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="doc-kicker text-gold block">Günün Kozmik Tavsiyesi & Sınavı:</span>
                    <p className="text-paper/85 text-xs leading-relaxed mt-1">
                      {reading ? reading.tip : pending}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'ask' && (
              <div className="p-5 border border-line bg-ink space-y-3">
                <span className="doc-kicker text-rose uppercase flex items-center gap-1.5">
                  <Heart size={14} />
                  Kalp Titreşimleri & Aşk Falı
                </span>
                <p className="text-paper/90 text-sm leading-relaxed">
                  {reading ? reading.love : pending}
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
                <span className="doc-kicker text-gold uppercase flex items-center gap-1.5">
                  <Briefcase size={14} />
                  Kariyer, Başarı & Maddi Fırsatlar
                </span>
                <p className="text-paper/90 text-sm leading-relaxed">
                  {reading ? reading.career : pending}
                </p>
                <div className="pt-3 border-t border-line text-[11px] text-muted flex items-center gap-2">
                  <Clock size={13} className="text-gold" />
                  <span>En verimli saatler: <strong className="text-paper">{reading ? reading.luckyHours : '—'}</strong></span>
                </div>
              </div>
            )}

            {activeCategory === 'tilsim' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 border border-line bg-ink space-y-1">
                  <span className="text-muted block text-[10px] uppercase">Uğurlu Taş</span>
                  <div className="flex items-center gap-2">
                    <Gem size={15} className="text-lime" />
                    <span className="text-paper font-bold text-sm">{selectedSign.details.stone}</span>
                  </div>
                  <span className="text-[10px] text-muted">Toprak ve beden rezonansını güçlendirir.</span>
                </div>

                <div className="p-4 border border-line bg-ink space-y-1">
                  <span className="text-muted block text-[10px] uppercase">Uğurlu Sayılar</span>
                  <div className="flex items-center gap-2">
                    <Award size={15} className="text-gold" />
                    <span className="text-paper font-bold text-sm">
                      {selectedSign.details.luckyNumbers.join(', ')}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted">Kozmik numerolojik uyum frekansları.</span>
                </div>

                <div className="p-4 border border-line bg-ink space-y-1">
                  <span className="text-muted block text-[10px] uppercase">Uğurlu Renkler</span>
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
            <span className="doc-kicker text-gold tracking-widest block border-b border-line pb-2">
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
                  <PlanetGlyph planet={selectedSign.rulingPlanetId} size={14} className="text-gold" />
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
