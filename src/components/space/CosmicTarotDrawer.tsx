'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Shuffle,
  Shield,
  Lightbulb,
  HeartHandshake
} from 'lucide-react';
import { Ticks } from '@/components/motion/primitives';
import {
  ZodiacGlyph,
  PlanetGlyph,
  FireElementGlyph,
  EarthElementGlyph,
  AirElementGlyph,
  WaterElementGlyph,
  AstrolabeGlyph
} from '@/components/ui/CosmicGlyphs';

export interface CosmicCard {
  id: string;
  number: string;
  name: string;
  archetype: string;
  associatedZodiacOrPlanet: string;
  element: 'Ateş' | 'Toprak' | 'Hava' | 'Su' | 'Eter';
  glyphType: 'zodiac' | 'planet';
  glyphId: string;
  cardColor: string;
  message: string;
  shadowWarning: string;
  affirmation: string;
}

export const COSMIC_TAROT_DECK: CosmicCard[] = [
  {
    id: 'imparator',
    number: 'IV',
    name: 'İmparator',
    archetype: 'Egemen Lider & İnşa Edici İrade',
    associatedZodiacOrPlanet: 'Koç Burcu (Mars)',
    element: 'Ateş',
    glyphType: 'zodiac',
    glyphId: 'koc',
    cardColor: 'from-gold/30 via-red-950/20 to-ink',
    message: 'Bugün hayatınızda düzen ve disiplin kurma günü. Fikirlerinizi somut kurallarla koruyun, sınırlarınızı net çizin ve liderlik etmekten çekinmeyin.',
    shadowWarning: 'Aşırı katılık, inatçılık ve başkalarının fikirlerine alan tanımama riskine dikkat edin.',
    affirmation: 'Kendi hayatımın egemen mimarıyım; kararlarımı cesaret ve bilgelikle alıyorum.'
  },
  {
    id: 'aziz',
    number: 'V',
    name: 'Aziz (Hierophant)',
    archetype: 'Kadim Bilgelik & Ruhsal Rehber',
    associatedZodiacOrPlanet: 'Boğa Burcu (Venüs)',
    element: 'Toprak',
    glyphType: 'zodiac',
    glyphId: 'boga',
    cardColor: 'from-lime/30 via-green-950/20 to-ink',
    message: 'Geleneksel bilgi, derin ahlaki değerler ve sabır bugün size en büyük gücü verecektir. Güvendiğiniz mentörlerin sözlerine kulak verin.',
    shadowWarning: 'Değişime kapalı dogmatik inançlara ve geçmişin kalıplarına takılı kalmayın.',
    affirmation: 'Doğanın ve kadim bilgeliğin sessiz rehberliğine güveniyorum.'
  },
  {
    id: 'asiklar',
    number: 'VI',
    name: 'Âşıklar (The Lovers)',
    archetype: 'Kozmik Birlik & Kalp Seçimi',
    associatedZodiacOrPlanet: 'İkizler Burcu (Merkür)',
    element: 'Hava',
    glyphType: 'zodiac',
    glyphId: 'ikizler',
    cardColor: 'from-primary/30 via-blue-950/20 to-ink',
    message: 'Önemli bir yol ayrımında kalbinizin pusulasını takip edin. Zihinsel çelişkileri bir kenara bırakıp içsel bütünlüğünüzle uyumlu olan seçimi yapın.',
    shadowWarning: 'Kararsızlık, yüzeysellik veya başkalarını memnun etmek için kendi değerlerinizden ödün verme.',
    affirmation: 'Her seçimimde sevgi, dürüstlük ve ruhsal uyumu temel alıyorum.'
  },
  {
    id: 'araba',
    number: 'VII',
    name: 'Araba (The Chariot)',
    archetype: 'Zafer & Odaklanmış Kararlılık',
    associatedZodiacOrPlanet: 'Yengeç Burcu (Ay)',
    element: 'Su',
    glyphType: 'zodiac',
    glyphId: 'yengec',
    cardColor: 'from-blue-600/30 via-indigo-950/20 to-ink',
    message: 'Zıt duyguları ve farklı güçleri tek bir amaca yönlendirerek zafere ulaşabilirsiniz. Duygusal disiplininiz sizi istediğiniz menzile taşıyacak.',
    shadowWarning: 'Agresif hırs, kontrolü kaybetme korkusu veya çevrenizdekileri ezerek ilerleme tehlikesi.',
    affirmation: 'İçsel dengemle rotamı çiziyor, tüm fırtınalara rağmen hedefime güvenle ilerliyorum.'
  },
  {
    id: 'guc',
    number: 'VIII',
    name: 'Güç (Strength)',
    archetype: 'Şefkatli Cesaret & İçsel Ehlileştirme',
    associatedZodiacOrPlanet: 'Aslan Burcu (Güneş)',
    element: 'Ateş',
    glyphType: 'zodiac',
    glyphId: 'aslan',
    cardColor: 'from-gold/30 via-yellow-950/20 to-ink',
    message: 'Gerçek güç kaslarda veya kaba kuvvette değil, kalbinizin sabrında ve şefkatindedir. Karşınıza çıkan agresif enerjileri nezaketle dönüştürün.',
    shadowWarning: 'Kibir, ego çatışması veya öfkeyi bastırıp aniden patlama riski.',
    affirmation: 'En vahşi engelleri bile sakinliğimin ve koşulsuz sevgimin gücüyle aşıyorum.'
  },
  {
    id: 'ermis',
    number: 'IX',
    name: 'Ermiş (The Hermit)',
    archetype: 'İçsel Işık & Hakikat Arayışı',
    associatedZodiacOrPlanet: 'Başak Burcu (Merkür)',
    element: 'Toprak',
    glyphType: 'zodiac',
    glyphId: 'basak',
    cardColor: 'from-teal-600/30 via-neutral-900/30 to-ink',
    message: 'Gürültülü dünyadan bir anlığına geri çekilip iç sesinizi dinleme zamanı. İhtiyacınız olan bütün cevaplar zaten kendi derinliklerinizde gizli.',
    shadowWarning: 'Aşırı izolasyon, insanlardan kopma ve aşırı eleştirel bir zihne hapsolma.',
    affirmation: 'Kendi içsel fenerimle karanlık yolları aydınlatıyor, hakikate doğru yürüyorum.'
  },
  {
    id: 'kader-carki',
    number: 'X',
    name: 'Kader Çarkı (Wheel of Fortune)',
    archetype: 'Kozmik Döngüler & Büyük Şans',
    associatedZodiacOrPlanet: 'Jüpiter (Bolluk & Şans)',
    element: 'Eter',
    glyphType: 'planet',
    glyphId: 'jupiter',
    cardColor: 'from-violet/30 via-violet/10 to-ink',
    message: 'Evrenin çarkı lehinize dönüyor! Beklenmedik fırsatlara, şanslı tesadüflere ve yeni kapılara açık olun. Değişime direnmek yerine akışa güvenin.',
    shadowWarning: 'Her şeyi şansa bırakıp emek vermeyi unutmak veya geçici zorlukları felaket saymak.',
    affirmation: 'Hayatın mucizevi ritmine güveniyorum; evren benim en yüksek hayrıma çalışıyor.'
  },
  {
    id: 'adalet',
    number: 'XI',
    name: 'Adalet (Justice)',
    archetype: 'Kozmik Denge & Sebep-Sonuç',
    associatedZodiacOrPlanet: 'Terazi Burcu (Venüs)',
    element: 'Hava',
    glyphType: 'zodiac',
    glyphId: 'terazi',
    cardColor: 'from-primary/30 via-indigo-950/20 to-ink',
    message: 'Ektiğinizi biçeceğiniz bir gündesiniz. Kararlarınızı objektif gerçeklere, dürüstlüğe ve etik değerlere dayandırın. Denge ve adalet er ya da geç tecelli eder.',
    shadowWarning: 'Önyargılar, aşırı katı hükümler verme veya kendi hatalarından kaçınma.',
    affirmation: 'Dürüstlük ve hakkaniyetle hareket ediyor, hayatımın sorumluluğunu üstleniyorum.'
  },
  {
    id: 'olum-donusum',
    number: 'XIII',
    name: 'Dönüşüm & Yeniden Doğuş',
    archetype: 'Karmik Arınma & Metamorfoz',
    associatedZodiacOrPlanet: 'Akrep Burcu (Mars/Plüton)',
    element: 'Su',
    glyphType: 'zodiac',
    glyphId: 'akrep',
    cardColor: 'from-rose-signal/20 via-violet/10 to-ink',
    message: 'Eski olanın sona ermesine izin verin. Hizmet etmeyen alışkanlıkları, toksik bağları veya eski kimliğinizi geride bıraktığınızda muazzam bir yeniden doğuş başlar.',
    shadowWarning: 'Biten şeylere umutsuzca tutunmak ve değişimin kaçınılmaz doğasından korkmak.',
    affirmation: 'Eskiye veda ediyor, ruhumun küllerinden daha güçlü ve aydınlık doğuyorum.'
  },
  {
    id: 'denge',
    number: 'XIV',
    name: 'Denge / İtidal (Temperance)',
    archetype: 'Ruhsal Simya & Uyum',
    associatedZodiacOrPlanet: 'Yay Burcu (Jüpiter)',
    element: 'Ateş',
    glyphType: 'zodiac',
    glyphId: 'yay',
    cardColor: 'from-gold/30 via-violet/10 to-ink',
    message: 'Aşırılıklardan kaçının ve zıtlıkları altın bir oranda birleştirin. Sabırlı, ölçülü ve sakin bir yaklaşım karmaşık krizleri mucizevi bir uyuma çevirir.',
    shadowWarning: 'Sabırsızlık, doyumsuzluk veya kutuplaşmış siyah-beyaz bakış açısı.',
    affirmation: 'Ruhumu sevgi, sabır ve ılımlılıkla besliyorum; her koşulda merkezimde kalıyorum.'
  },
  {
    id: 'yildiz',
    number: 'XVII',
    name: 'Yıldız (The Star)',
    archetype: 'Kozmik Umut & İlahi İlham',
    associatedZodiacOrPlanet: 'Kova Burcu (Uranüs)',
    element: 'Hava',
    glyphType: 'zodiac',
    glyphId: 'kova',
    cardColor: 'from-blue-500/30 via-primary/10 to-ink',
    message: 'Karanlık gecenin ardından parlayan en parlak kutup yıldızı sizin için doğuyor. Geleceğe güvenle bakın, ilham dolu projelere başlayın ve şifalanın.',
    shadowWarning: 'Aşırı hayalperestlik veya pratik eylemler yerine sadece hayallerde yaşamak.',
    affirmation: 'Yıldızların parlak ışığı yolumu aydınlatıyor; umut ve şifa doluyum.'
  },
  {
    id: 'gunes',
    number: 'XIX',
    name: 'Güneş (The Sun)',
    archetype: 'Kozmik Aydınlanma & Yaşam Coşkusu',
    associatedZodiacOrPlanet: 'Güneş (Sol)',
    element: 'Ateş',
    glyphType: 'planet',
    glyphId: 'sun',
    cardColor: 'from-gold/30 via-yellow-950/20 to-ink',
    message: 'Tam bir berraklık, neşe ve başarı kartı! Kendinizi saklamayın, ışığınızı tüm dünyaya yansıtın. Bugün başladığınız her iş bereket ve neşeyle sonuçlanacaktır.',
    shadowWarning: 'Aşırı kibir, kendini beğenmişlik veya başkalarının başarısını gölgeleme dürtüsü.',
    affirmation: 'İçimdeki yaşam enerjisini neşeyle paylaşıyorum; hayatım ışık ve başarıyla dolu.'
  }
];

export function CosmicTarotDrawer() {
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);

  const card = COSMIC_TAROT_DECK[currentCardIndex];

  const handleDrawCard = () => {
    setIsFlipping(true);
    setTimeout(() => {
      let nextIndex = Math.floor(Math.random() * COSMIC_TAROT_DECK.length);
      if (nextIndex === currentCardIndex) {
        nextIndex = (currentCardIndex + 1) % COSMIC_TAROT_DECK.length;
      }
      setCurrentCardIndex(nextIndex);
      setHasDrawn(true);
      setIsFlipping(false);
    }, 350);
  };

  const elementIcons = {
    Ateş: <FireElementGlyph size={14} className="text-gold" />,
    Toprak: <EarthElementGlyph size={14} className="text-lime" />,
    Hava: <AirElementGlyph size={14} className="text-primary" />,
    Su: <WaterElementGlyph size={14} className="text-blue-400" />,
    Eter: <AstrolabeGlyph size={14} className="text-violet" />
  };

  return (
    <div id="kozmik-tarot" className="ticks relative border border-line bg-ink p-6 sm:p-10 space-y-8">
      <Ticks />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="label flex items-center gap-2 text-gold">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>GÜNÜN KOZMİK ARKETİP KARTI</span>
          </div>
          <h2 className="display display-tight mt-3 text-[clamp(1.8rem,3.2vw,3rem)] text-paper">
            Kozmik Tarot <span className="serif-i text-gold">& Bilinçaltı Rehberi</span>
          </h2>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-paper/70">
            Carl Gustav Jung&apos;un arketip psikolojisi ve kadim Zodyak sembolizmiyle harmanlanan günlük kozmik kartınızı çekin ve bugüne dair ilhamınızı keşfedin.
          </p>
        </div>

        <button
          onClick={handleDrawCard}
          disabled={isFlipping}
          className="flex items-center gap-2 px-5 py-3 border border-line bg-gold hover:bg-paper text-ink font-bold text-xs font-mono transition-colors cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Shuffle size={16} className={isFlipping ? 'animate-spin' : ''} />
          <span>{hasDrawn ? 'YENİ BİR KART ÇEK' : 'GÜNÜN KARTINI ÇEK'}</span>
        </button>
      </div>

      {/* Main Interactive Card Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Tarot Card Deck with Sacred Geometry Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            className={`w-64 sm:w-72 h-96 sm:h-[420px] border border-gold/40 bg-gradient-to-br ${card.cardColor} p-6 flex flex-col justify-between shadow-[0_0_35px_rgba(229,193,88,0.15)] relative overflow-hidden transition-all duration-500 transform ${
              isFlipping ? 'scale-90 rotate-6 opacity-30 blur-sm' : 'scale-100 rotate-0 opacity-100'
            }`}
          >
            {/* Sacred Geometry Corner Accents */}
            <div className="absolute top-2.5 left-2.5 text-[9px] font-mono text-gold/60 select-none">✦</div>
            <div className="absolute top-2.5 right-2.5 text-[9px] font-mono text-gold/60 select-none">✦</div>
            <div className="absolute bottom-2.5 left-2.5 text-[9px] font-mono text-gold/60 select-none">✦</div>
            <div className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-gold/60 select-none">✦</div>

            {/* Inner Engraved Border */}
            <div className="absolute inset-2 border border-gold/20 pointer-events-none" />

            {/* Card Top: Number & Mini Emblem */}
            <div className="flex items-center justify-between border-b border-gold/30 pb-3 relative z-10">
              <span className="font-mono text-lg font-black text-gold tracking-widest">
                {card.number}
              </span>
              {card.glyphType === 'zodiac' ? (
                <ZodiacGlyph sign={card.glyphId} size={24} className="text-gold" />
              ) : (
                <PlanetGlyph planet={card.glyphId} size={24} className="text-gold" />
              )}
            </div>

            {/* Card Middle: Archetype Title & Large Vector Emblem */}
            <div className="text-center space-y-3 my-auto relative z-10">
              <div className="h-24 w-24 mx-auto rounded-full bg-ink/70 border border-gold/40 flex items-center justify-center shadow-inner">
                {card.glyphType === 'zodiac' ? (
                  <ZodiacGlyph sign={card.glyphId} size={48} className="text-gold" />
                ) : (
                  <PlanetGlyph planet={card.glyphId} size={48} className="text-gold" />
                )}
              </div>
              <h3 className="display display-tight text-2xl font-black text-paper tracking-wide">
                {card.name}
              </h3>
              <p className="label text-gold/90 uppercase tracking-wider text-[10px]">
                {card.archetype}
              </p>
            </div>

            {/* Card Bottom: Element & Astro Link */}
            <div className="border-t border-gold/30 pt-3 flex items-center justify-between text-[11px] font-mono text-paper/75 relative z-10">
              <span className="flex items-center gap-1.5 font-bold">
                {elementIcons[card.element]}
                {card.element}
              </span>
              <span className="label text-muted">{card.associatedZodiacOrPlanet}</span>
            </div>
          </div>
        </div>

        {/* Card Guidance & Psycho-Astrological Reading */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="label text-gold">
                KART ARKETİPİ & ANLAMI
              </span>
              <span className="label text-muted">
                · {card.associatedZodiacOrPlanet}
              </span>
            </div>
            <h3 className="display display-tight text-2xl sm:text-3xl font-black text-paper">
              {card.name} — <span className="serif-i text-gold">{card.archetype}</span>
            </h3>
          </div>

          {/* 1. Main Daily Guidance */}
          <div className="border border-line bg-ink-2 p-5 space-y-2">
            <div className="label text-gold flex items-center gap-2">
              <Lightbulb size={14} className="text-gold" />
              <span>Günün Kozmik Rehberliği</span>
            </div>
            <p className="text-sm text-paper/85 leading-relaxed font-sans">
              {card.message}
            </p>
          </div>

          {/* 2. Shadow Warning */}
          <div className="border border-line bg-ink-2 p-5 space-y-1">
            <div className="label text-rose-signal flex items-center gap-2">
              <Shield size={14} className="text-rose-signal" />
              <span>Gölge Yüzü & Dikkat Edilmesi Gerekenler</span>
            </div>
            <p className="text-xs text-paper/75 leading-relaxed font-sans pt-1">
              {card.shadowWarning}
            </p>
          </div>

          {/* 3. Daily Affirmation / Mantra */}
          <div className="border border-line bg-ink-2 p-5 space-y-1">
            <div className="label text-violet flex items-center gap-2">
              <HeartHandshake size={14} className="text-violet" />
              <span>Günün Olumlaması / Mantrası</span>
            </div>
            <p className="text-sm text-paper font-sans serif-i leading-relaxed pt-1">
              &quot;{card.affirmation}&quot;
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between label text-muted">
            <span>Toplam Deste: <strong className="text-paper">{COSMIC_TAROT_DECK.length} Kozmik Arketip</strong></span>
            <button
              onClick={handleDrawCard}
              className="text-gold hover:text-paper transition-colors cursor-pointer flex items-center gap-1 font-bold"
            >
              Farklı Bir Kart Seç →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
