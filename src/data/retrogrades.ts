/**
 * 2026 - 2027 Planetary Retrogrades & Station Guide
 * High-precision ephemeris calendar for planetary stations and shadow periods.
 * Swiss technical engraving standards — zero default emojis.
 */

export interface RetrogradeCycle {
  id: string;
  planet: string;
  planetSymbol: string;
  planetGlyphKey: string;
  signRange: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  preShadowStart: string;
  postShadowEnd: string;
  isCurrentlyRetrograde: boolean;
  stationDegrees: string;
  elementFocus: 'Ateş' | 'Toprak' | 'Hava' | 'Su';
  coreThemes: string[];
  guidance: {
    whatToDo: string[];
    whatToAvoid: string[];
    cosmicLesson: string;
  };
}

export const PLANETARY_RETROGRADES: RetrogradeCycle[] = [
  {
    id: 'mercury-retro-1-2026',
    planet: 'Merkür Retrosu (Bahar)',
    planetSymbol: '☿',
    planetGlyphKey: 'merkur',
    signRange: 'Balık 22° → Kova 8°',
    startDate: '2026-02-26',
    endDate: '2026-03-20',
    preShadowStart: '2026-02-11',
    postShadowEnd: '2026-04-09',
    isCurrentlyRetrograde: false,
    stationDegrees: '22° Balık & 8° Kova',
    elementFocus: 'Su',
    coreThemes: ['Sezgisel İletişim', 'Teknolojik Yedekleme', 'Eski Arkadaşlarla Karşılaşma', 'Sanatsal Revizyon'],
    guidance: {
      whatToDo: [
        'Eski taslakları, yarım kalmış kitapları ve projeleri yeniden elden geçirin.',
        'Tüm bilgisayar ve telefon verilerinizi buluta yedekleyin.',
        'Sezgilerinize ve rüyalarınıza kulak verin; geçmiş affedişleri tamamlayın.'
      ],
      whatToAvoid: [
        'Yeni bir elektronik cihaz veya araba satın almak.',
        'Okumadan ve şartları müzakere etmeden bağlayıcı sözleşme imzalamak.',
        'E-posta ve mesajları öfkeyle acelece göndermek.'
      ],
      cosmicLesson: 'Hızlı konuşmak yerine derin dinlemeyi; dış dünyanın telaşı yerine içsel netliği seç.'
    }
  },
  {
    id: 'mercury-retro-2-2026',
    planet: 'Merkür Retrosu (Yaz)',
    planetSymbol: '☿',
    planetGlyphKey: 'merkur',
    signRange: 'Yengeç 26° → Yengeç 16°',
    startDate: '2026-06-29',
    endDate: '2026-07-23',
    preShadowStart: '2026-06-14',
    postShadowEnd: '2026-08-07',
    isCurrentlyRetrograde: false,
    stationDegrees: '26° – 16° Yengeç',
    elementFocus: 'Su',
    coreThemes: ['Aile İçi Konuşmalar', 'Geçmiş Anılar', 'Ev ve Gayrimenkul Düzenlemeleri', 'Duygusal Nostalji'],
    guidance: {
      whatToDo: [
        'Eski aile albümlerini düzenleyin ve köklerinizle barışın.',
        'Evinizdeki bozuk eşyaları tamir ettirin, tadilat eksiklerini giderin.',
        'Çocukluk arkadaşlarınızla buluşup samimi sohbetler yapın.'
      ],
      whatToAvoid: [
        'Aceleyle ev kiralamak veya emlak kontratına imza atmak.',
        'Eski duygusal yaraları küskünlükle masaya yatırmak.',
        'Aşırı alınganlık ve savunmacı tepkiler vermek.'
      ],
      cosmicLesson: 'Güvenlik dış koşullarda değil; kendi içsel sığınağında inşa ettiğin şefkattedir.'
    }
  },
  {
    id: 'mercury-retro-3-2026',
    planet: 'Merkür Retrosu (Sonbahar)',
    planetSymbol: '☿',
    planetGlyphKey: 'merkur',
    signRange: 'Akrep 20° → Terazi 6°',
    startDate: '2026-10-24',
    endDate: '2026-11-13',
    preShadowStart: '2026-10-06',
    postShadowEnd: '2026-11-29',
    isCurrentlyRetrograde: true, // Oct-Nov 2026 active window
    stationDegrees: '20° Akrep → 6° Terazi',
    elementFocus: 'Su',
    coreThemes: ['Gizli Sırların Açığa Çıkışı', 'Finansal İncelemeler', 'İlişkide Dürüstlük', 'Dedektiflik ve Araştırma'],
    guidance: {
      whatToDo: [
        'Banka hesaplarını, borçları ve sigorta poliçelerini titizlikle denetleyin.',
        'Gizli kalmış psikolojik blokajları terapi ve meditasyonla dönüştürün.',
        'Müzakerelerde karşı tarafın satır aralarını dikkatle okuyun.'
      ],
      whatToAvoid: [
        'Kuşku ve kıskançlıkla gizli telefon karıştırmak.',
        'Büyük borç veya kredi altına plansız girmek.',
        'İntikam odaklı sözlü tartışmalara çekilmek.'
      ],
      cosmicLesson: 'Kelimelerinin gücünü zehirlemek için değil, hakikati aydınlatmak ve şifalandırmak için kullan.'
    }
  },
  {
    id: 'venus-retro-2026',
    planet: 'Venüs Retrosu (Akrep & Terazi)',
    planetSymbol: '♀',
    planetGlyphKey: 'venus',
    signRange: 'Akrep 10° → Terazi 25°',
    startDate: '2026-10-03',
    endDate: '2026-11-14',
    preShadowStart: '2026-08-25',
    postShadowEnd: '2026-12-12',
    isCurrentlyRetrograde: true, // Active in autumn 2026
    stationDegrees: '10° Akrep & 25° Terazi',
    elementFocus: 'Su',
    coreThemes: ['Karmik İlişkiler', 'Eski Sevgililerin Dönüşü', 'Özdeğer Muhasebesi', 'Estetik ve Lüks Tüketim'],
    guidance: {
      whatToDo: [
        'Kendi değerinizi başkalarının onayından bağımsız kılmayı öğrenin.',
        'Eski ilişkilerden kalan kırgınlıkları affedip helalleşerek serbest bırakın.',
        'Finansal harcama alışkanlıklarınızı ve gereksiz lüks masrafları gözden geçirin.'
      ],
      whatToAvoid: [
        'Radikal estetik ameliyatlar veya saç kesimi/rengi değişiklikleri yaptırmak.',
        'Eski sevgiliye ani bir zaafla geri dönüp aynı döngüye kapılmak.',
        'Pahalı sanat eserleri veya lüks takı yatırımlarına plansız atılmak.'
      ],
      cosmicLesson: 'Sevgi başkasından dilenilen bir borç değil; kendi ruhunda keşfettiğin tükenmez bir kaynaktır.'
    }
  },
  {
    id: 'jupiter-retro-2026',
    planet: 'Jüpiter Retrosu (Aslan)',
    planetSymbol: '♃',
    planetGlyphKey: 'jupiter',
    signRange: 'Aslan 25° → Aslan 15°',
    startDate: '2026-07-15',
    endDate: '2026-11-13',
    preShadowStart: '2026-04-20',
    postShadowEnd: '2026-12-28',
    isCurrentlyRetrograde: true,
    stationDegrees: '25° → 15° Aslan',
    elementFocus: 'Ateş',
    coreThemes: ['İçsel İnanç & Felsefe', 'Özgüvenin Olgunlaşması', 'Ruhsal Genişleme', 'Aşırı Cömertliğin Dengelenmesi'],
    guidance: {
      whatToDo: [
        'Hayat felsefenizi ve inanç sisteminizi gözden geçirin; derinleşin.',
        'Kibrinizi törpüleyip samimi bir tevazu ve bilgelik geliştirin.',
        'Eğitim ve manevi yolculuklarda içe dönük araştırmalar yapın.'
      ],
      whatToAvoid: [
        'Körlemesine iyimserlikle büyük finansal spekülasyonlara girmek.',
        'Her şeyi bildiğini iddia eden gururlu tavırlar sergilemek.',
        'Tembelliğe ve aşırı konfora teslim olmak.'
      ],
      cosmicLesson: 'Gerçek şans dışarıdaki fırsatlarda değil; içindeki ahlaki ve manevi olgunluktadır.'
    }
  },
  {
    id: 'saturn-retro-2026',
    planet: 'Satürn Retrosu (Koç & Balık)',
    planetSymbol: '☿',
    planetGlyphKey: 'saturn',
    signRange: 'Koç 1° → Balık 26°',
    startDate: '2026-07-06',
    endDate: '2026-11-20',
    preShadowStart: '2026-04-12',
    postShadowEnd: '2026-12-30',
    isCurrentlyRetrograde: true,
    stationDegrees: '1° Koç → 26° Balık',
    elementFocus: 'Ateş',
    coreThemes: ['Karmik Sorumluluk', 'Sınırların Yeniden Çizilmesi', 'Disiplin ve Sabır', 'Yetişkinlik Sınavları'],
    guidance: {
      whatToDo: [
        'Hayatınızdaki zayıf temelleri sabırla yeniden güçlendirin.',
        'Başkalarına sınır koymayı ve hayır diyebilmeyi öğrenin.',
        'Uzun vadeli kariyer projelerinde eksik kalmış yasal ve yapısal pürüzleri çözün.'
      ],
      whatToAvoid: [
        'Sorumluluklardan şikayet ederek kurban psikolojisine girmek.',
        'Zorluklar karşısında pes edip hedefleri terk etmek.',
        'Katı ve yargılayıcı bir tutumla sevdiklerinize mesafe koymak.'
      ],
      cosmicLesson: 'Zamanın efendisi olan Satürn sabırla çalışanları ebedi bir ustalıkla taçlandırır.'
    }
  },
  {
    id: 'pluto-retro-2026',
    planet: 'Plüton Retrosu (Kova)',
    planetSymbol: '♇',
    planetGlyphKey: 'pluto',
    signRange: 'Kova 5° → Kova 3°',
    startDate: '2026-05-04',
    endDate: '2026-10-14',
    preShadowStart: '2026-01-20',
    postShadowEnd: '2026-12-05',
    isCurrentlyRetrograde: true, // Ending mid-October 2026
    stationDegrees: '5° → 3° Kova',
    elementFocus: 'Hava',
    coreThemes: ['Kolektif Güç & Dönüşüm', 'Bilinçaltı Tabularının Yıkılışı', 'Özgürlük ve Bağımsızlık', 'Karanlık Odalarla Yüzleşme'],
    guidance: {
      whatToDo: [
        'Korkularınızın köküne inin; sizi manipüle eden bağları kesin.',
        'Grup dinamikleri ve topluluklar içindeki rolünüzü adil şekilde değerlendirin.',
        'Kişisel gücünüzü başkalarının üzerine baskı kurmadan dönüştürün.'
      ],
      whatToAvoid: [
        'Kontrol deliliği ve gizli güç savaşlarına girişmek.',
        'Dönüşüme direnmek ve çürümüş yapıları zorla ayakta tutmaya çalışmak.',
        'Şüpheciliği paranoyaya dönüştürmek.'
      ],
      cosmicLesson: 'Ölmeden önce ölenler için karanlık sadece yeniden doğuşun kutsal beşiğidir.'
    }
  }
];

export function getActiveRetrogrades(currentDate: Date = new Date()): RetrogradeCycle[] {
  const dateStr = currentDate.toISOString().split('T')[0];
  return PLANETARY_RETROGRADES.filter((r) => {
    return dateStr >= r.startDate && dateStr <= r.endDate;
  });
}
