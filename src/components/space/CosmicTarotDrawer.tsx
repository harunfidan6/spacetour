'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Shuffle,
  Eye,
  Flame,
  Globe2,
  Wind,
  Droplets,
  RotateCw,
  Compass,
  Star,
  Shield,
  Lightbulb,
  HeartHandshake
} from 'lucide-react';

export interface CosmicCard {
  id: string;
  number: string;
  name: string;
  archetype: string;
  associatedZodiacOrPlanet: string;
  element: 'Ateş' | 'Toprak' | 'Hava' | 'Su' | 'Eter';
  symbol: string;
  imagePrompt: string;
  cardColor: string; // Tailwind gradient
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
    symbol: '♈',
    imagePrompt: 'A majestic emperor on a carved stone throne with ram heads',
    cardColor: 'from-amber-600/40 via-red-900/30 to-black',
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
    symbol: '♉',
    imagePrompt: 'Ancient priest holding keys of wisdom in a celestial temple',
    cardColor: 'from-emerald-700/40 via-green-950/30 to-black',
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
    symbol: '♊',
    imagePrompt: 'Two souls reaching out under the wings of an angel',
    cardColor: 'from-cyan-600/40 via-blue-950/30 to-black',
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
    symbol: '♋',
    imagePrompt: 'A celestial chariot steered by an armored navigator across stars',
    cardColor: 'from-blue-600/40 via-indigo-950/30 to-black',
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
    symbol: '♌',
    imagePrompt: 'A gentle woman closing the jaws of a golden lion with tenderness',
    cardColor: 'from-amber-500/40 via-yellow-900/30 to-black',
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
    symbol: '♍',
    imagePrompt: 'An elder on a mountain holding a lantern illuminating the path',
    cardColor: 'from-teal-600/40 via-neutral-900/50 to-black',
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
    symbol: '♃',
    imagePrompt: 'A great glowing cosmic wheel spinning in the center of the universe',
    cardColor: 'from-purple-600/40 via-violet-950/30 to-black',
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
    symbol: '♎',
    imagePrompt: 'A blindfolded deity holding balanced scales and an upright sword',
    cardColor: 'from-cyan-500/40 via-indigo-950/30 to-black',
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
    symbol: '♏',
    imagePrompt: 'A dark armored knight on a white horse, a black rose, sunrise behind',
    cardColor: 'from-rose-900/40 via-purple-950/40 to-black',
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
    symbol: '♐',
    imagePrompt: 'An angel pouring glowing water between two golden chalices',
    cardColor: 'from-amber-600/40 via-purple-950/30 to-black',
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
    symbol: '♒',
    imagePrompt: 'A maiden under seven bright stars pouring crystal water into a pool',
    cardColor: 'from-blue-500/40 via-cyan-950/30 to-black',
    message: 'Karanlık gecenin ardından parlayan en parlak kutup yıldızı sizin için doğuyor. Geleceğe güvenle bakın, ilham dolu projelere başlayın ve şifalanın.',
    shadowWarning: 'Aşırı hayalperestlik veya pratik eylemler yerine sadece hayallerde yaşamak.',
    affirmation: 'Yıldızların parlak ışığı yolumu aydınlatıyor; umut ve şifa doluyum.'
  },
  {
    id: 'gunes',
    number: 'XIX',
    name: 'Güneş (The Sun)',
    archetype: 'Kozmik Aydınlanma & Saf Yaşam Coşkusu',
    associatedZodiacOrPlanet: 'Güneş (Sol)',
    element: 'Ateş',
    symbol: '☉',
    imagePrompt: 'A radiant golden child on a white steed under a blazing smiling sun',
    cardColor: 'from-amber-400/40 via-yellow-950/30 to-black',
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
      // Pick random card different from current
      let nextIndex = Math.floor(Math.random() * COSMIC_TAROT_DECK.length);
      if (nextIndex === currentCardIndex) {
        nextIndex = (currentCardIndex + 1) % COSMIC_TAROT_DECK.length;
      }
      setCurrentCardIndex(nextIndex);
      setHasDrawn(true);
      setIsFlipping(false);
    }, 400);
  };

  const elementIcons = {
    Ateş: <Flame className="text-amber-400" size={14} />,
    Toprak: <Globe2 className="text-emerald-400" size={14} />,
    Hava: <Wind className="text-cyan-400" size={14} />,
    Su: <Droplets className="text-blue-400" size={14} />,
    Eter: <Sparkles className="text-purple-400" size={14} />
  };

  return (
    <div id="kozmik-tarot" className="rounded-3xl border border-white/10 bg-black/60 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-widest">
              GÜNÜN KOZMİK ARKETİP KARTI
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Kozmik Tarot & Bilinçaltı Rehberi
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Carl Gustav Jung&apos;un arketip psikolojisi ve kadim Zodyak sembolizmiyle harmanlanan günlük kozmik kartınızı çekin ve bugüne dair ilhamınızı keşfedin.
          </p>
        </div>

        <button
          onClick={handleDrawCard}
          disabled={isFlipping}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-black font-bold text-xs font-mono shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all cursor-pointer transform active:scale-95 disabled:opacity-50"
        >
          <Shuffle size={16} className={isFlipping ? 'animate-spin' : ''} />
          <span>{hasDrawn ? 'YENİ BİR KART ÇEK' : 'GÜNÜN KARTINI ÇEK'}</span>
        </button>
      </div>

      {/* Main Interactive Card Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Tarot Card Deck (3D perspective feel) */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            className={`w-64 sm:w-72 h-96 sm:h-[420px] rounded-3xl border-2 border-amber-400/40 bg-gradient-to-br ${card.cardColor} p-6 flex flex-col justify-between shadow-[0_0_40px_rgba(251,191,36,0.15)] relative overflow-hidden transition-all duration-500 transform ${
              isFlipping ? 'scale-90 rotate-6 opacity-30 blur-sm' : 'scale-100 rotate-0 opacity-100'
            }`}
          >
            {/* Cosmic Card Corner Accents */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-amber-400/60">✦</div>
            <div className="absolute top-2 right-2 text-[10px] font-mono text-amber-400/60">✦</div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-amber-400/60">✦</div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-amber-400/60">✦</div>

            {/* Card Top: Number & Symbol */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-lg font-black text-amber-300 tracking-widest">
                {card.number}
              </span>
              <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                {card.symbol}
              </span>
            </div>

            {/* Card Middle: Archetype Title & Emblem */}
            <div className="text-center space-y-3 my-auto">
              <div className="h-20 w-20 mx-auto rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-4xl shadow-inner">
                {card.symbol}
              </div>
              <h3 className="text-2xl font-black text-white tracking-wide">
                {card.name}
              </h3>
              <p className="text-xs font-mono text-amber-300/90 uppercase tracking-wider">
                {card.archetype}
              </p>
            </div>

            {/* Card Bottom: Element & Astro Link */}
            <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[11px] font-mono text-neutral-300">
              <span className="flex items-center gap-1 font-bold">
                {elementIcons[card.element]}
                {card.element}
              </span>
              <span className="text-neutral-400">{card.associatedZodiacOrPlanet}</span>
            </div>
          </div>
        </div>

        {/* Card Guidance & Psycho-Astrological Reading */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
                KART ARMETİPİ & ANLAMI
              </span>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-neutral-300">
                {card.associatedZodiacOrPlanet}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {card.name} — {card.archetype}
            </h3>
          </div>

          {/* 1. Main Daily Guidance */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
              <Lightbulb size={16} className="text-amber-400" />
              <span>Günün Kozmik Rehberliği</span>
            </div>
            <p className="text-sm text-neutral-200 leading-relaxed font-sans">
              {card.message}
            </p>
          </div>

          {/* 2. Shadow Warning */}
          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-4 space-y-1">
            <div className="flex items-center gap-2 text-rose-300 font-mono text-xs font-bold uppercase tracking-wider">
              <Shield size={14} className="text-rose-400" />
              <span>Gölge Yüzü & Dikkat Edilmesi Gerekenler</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              {card.shadowWarning}
            </p>
          </div>

          {/* 3. Daily Affirmation / Mantra */}
          <div className="rounded-2xl border border-purple-500/20 bg-purple-950/20 p-4 space-y-1">
            <div className="flex items-center gap-2 text-purple-300 font-mono text-xs font-bold uppercase tracking-wider">
              <HeartHandshake size={14} className="text-purple-400" />
              <span>Günün Olumlaması / Mantrası</span>
            </div>
            <p className="text-xs sm:text-sm text-purple-200 font-sans italic font-medium leading-relaxed">
              &quot;{card.affirmation}&quot;
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>Toplam Deste: <strong>{COSMIC_TAROT_DECK.length} Kozmik Arketip</strong></span>
            <button
              onClick={handleDrawCard}
              className="text-amber-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-bold"
            >
              Farklı Bir Kart Seç →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
