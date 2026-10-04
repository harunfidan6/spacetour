import { planetaryHourAt } from '@/lib/astrology/dailySky';
export interface FixedStar {
  id: string;
  name: string;
  arabicName: string;
  constellation: string;
  eclipticLongitude: string;
  magnitude: number;
  nature: string; // e.g. "Mars - Jüpiter"
  title: string;
  archetype: string;
  royalStar?: 'Doğu' | 'Kuzey' | 'Batı' | 'Güney';
  guidance: {
    gift: string;
    test: string;
    oracleMessage: string;
    actionAdvice: string;
  };
  favorableActivities: string[];
  resonanceScore: number;
}

export const FIXED_STARS_CATALOG: FixedStar[] = [
  {
    id: 'aldebaran',
    name: 'Aldebaran',
    arabicName: 'El Debaran (Takipçi)',
    constellation: 'Boğa (Taurus)',
    eclipticLongitude: '09° 47\' İkizler',
    magnitude: 0.85,
    nature: 'Mars',
    title: 'Doğunun Kraliyet Bekçisi · Başmelek Mikail',
    archetype: 'Dürüst Savaşçı & Sarsılmaz Doğruluk',
    royalStar: 'Doğu',
    guidance: {
      gift: 'Muazzam zihinsel güç, hatiplik, liderlik ve ticarette büyük başarı kazanma kudreti.',
      test: 'Dürüstlükten ve ahlaki ilkelerden sapma tuzağı. Hile veya çıkar için doğruluktan vazgeçilirse başarı anında yıkıma dönüşür.',
      oracleMessage: 'Bugün Aldebaran gözlerini üzerinize dikiyor. Her adımınızda mutlak dürüstlüğü ve ilkelerinizi savunun; ödülünüz kalıcı bir zafer olacaktır.',
      actionAdvice: 'Önemli sözleşmeler, açık sözlü yüzleşmeler ve yeni ticari anlaşmalar için güçlü bir kozmik destek var.'
    },
    favorableActivities: ['Dürüst Müzakereler', 'Liderlik Kararları', 'Cesaret Gerektiren Başlangıçlar'],
    resonanceScore: 96
  },
  {
    id: 'regulus',
    name: 'Regulus',
    arabicName: 'Kalbü\'l Esed (Aslanın Kalbi)',
    constellation: 'Aslan (Leo)',
    eclipticLongitude: '00° 06\' Başak',
    magnitude: 1.35,
    nature: 'Mars - Jüpiter',
    title: 'Kuzeyin Kraliyet Bekçisi · Başmelek Cebrail',
    archetype: 'Kraliyet Asaleti & Cömert Hükümranlık',
    royalStar: 'Kuzey',
    guidance: {
      gift: 'Toplum önünde yükseliş, şan, şöhret, yüksek makamlar ve doğal karizma.',
      test: 'İntikam hırsı ve kibir sınavı. Gücünüze güvenip başkalarından öç almaya kalkışırsanız tahtınızı kaybedersiniz.',
      oracleMessage: 'Regulus size kraliyet pelerinini uzatıyor; ancak gerçek asalet intikam almamakta ve büyüklük göstermekte saklıdır. Cömert olun.',
      actionAdvice: 'Topluluk önünde konuşmalar yapmak, itibarınızı yükseltmek ve büyük projeleri ilan etmek için mükemmel zaman.'
    },
    favorableActivities: ['Kariyer Sunumları', 'Toplumsal Görünürlük', 'Bağışlama ve Büyüklük'],
    resonanceScore: 98
  },
  {
    id: 'antares',
    name: 'Antares',
    arabicName: 'Kalbü\'l Akreb (Akrebin Kalbi)',
    constellation: 'Akrep (Scorpius)',
    eclipticLongitude: '09° 46\' Yay',
    magnitude: 0.96,
    nature: 'Mars - Jüpiter',
    title: 'Batının Kraliyet Bekçisi · Başmelek Uriel',
    archetype: 'Stratejik Anka & Yıkıcı Dönüşüm',
    royalStar: 'Batı',
    guidance: {
      gift: 'Krizleri fırsata çevirme, psikolojik derinlik, stratejik deha ve sarsılmaz tutku.',
      test: 'Aşırı takıntı, şüphecilik ve kendi kendini tüketen öfke tuzağı.',
      oracleMessage: 'Antares kırmızı gözleriyle ruhunuzdaki ateşi körüklüyor. Bu ateşi yakıp yıkmak için değil, sizi sınırlayan engelleri eritmek için kullanın.',
      actionAdvice: 'Kökten değişim gerektiren meseleleri çözmek, derin araştırmalar yapmak ve cesur yüzleşmeler gerçekleştirmek için ideal.'
    },
    favorableActivities: ['Kriz Yönetimi', 'Stratejik Planlama', 'Eski Kalıpları Yıkma'],
    resonanceScore: 94
  },
  {
    id: 'fomalhaut',
    name: 'Fomalhaut',
    arabicName: 'Femü\'l Hût (Balığın Ağzı)',
    constellation: 'Güney Balığı (Piscis Austrinus)',
    eclipticLongitude: '03° 52\' Balık',
    magnitude: 1.16,
    nature: 'Venüs - Merkür',
    title: 'Güneyin Kraliyet Bekçisi · Başmelek İsrafil',
    archetype: 'Mistik Vizyoner & İlahi Sanatçı',
    royalStar: 'Güney',
    guidance: {
      gift: 'Sanatsal ilham, mistisizm, psişik rüyalar, yüksek idealler ve büyüleyici estetik güç.',
      test: 'Gerçeklikten kopup hayal dünyasında kaybolma veya ideallerini maddi çıkarlar için satma sınavı.',
      oracleMessage: 'Fomalhaut ruhunuza ilahi ilham nehirleri akıtıyor. Kalbinizin en saf rüyasını hayata geçirmek için ilham perilerine güvenin.',
      actionAdvice: 'Sanatsal üretimler, meditasyon, şiir, müzik ve ruhsal şifa çalışmaları için en parlak yıldız frekansı.'
    },
    favorableActivities: ['Sanat & Tasarım', 'Ruhsal İnziva', 'Vizyon Geliştirme'],
    resonanceScore: 95
  },
  {
    id: 'sirius',
    name: 'Sirius (Şi\'ra)',
    arabicName: 'Şi\'ra-yı Yemani (Göklerin Güneşi)',
    constellation: 'Büyük Köpek (Canis Major)',
    eclipticLongitude: '14° 05\' Yengeç',
    magnitude: -1.46,
    nature: 'Jüpiter - Mars',
    title: 'Göklerin En Parlak Yıldızı · İsis Tapınağı',
    archetype: 'Kutsal Çağrı & Kadersel Sıçrama',
    guidance: {
      gift: 'Sıradanlığın ötesine geçme, evrensel tanınma, ruhsal koruma ve kaderin büyük kapılarını açma gücü.',
      test: 'Küçük hırslara takılıp yüksek misyonunu unutma riski.',
      oracleMessage: 'Sirius gökyüzünün en parlak mücevheridir. Bugün başlattığınız işler sadece sizi değil, geleceğinizi ve çevrenizi de aydınlatacak kadar derin etkiye sahip.',
      actionAdvice: 'Uzun vadeli vizyoner kararlar almak, ruhsal yeminler etmek ve hayatın dönüm noktalarını başlatmak için mükemmel gün.'
    },
    favorableActivities: ['Hayat Kararları', 'Ruhsal Uyanış', 'Kutsal Başlangıçlar'],
    resonanceScore: 99
  },
  {
    id: 'vega',
    name: 'Vega (En-Nesrü\'l Vaki)',
    arabicName: 'En-Nesrü\'l Vaki (Düşen Kartal)',
    constellation: 'Çalgı (Lyra)',
    eclipticLongitude: '15° 19\' Oğlak',
    magnitude: 0.03,
    nature: 'Venüs - Merkür',
    title: 'Orpheus\'un Kozmik Liri',
    archetype: 'Büyüleyici Cazibe & Sanatsal Deha',
    guidance: {
      gift: 'Manyetik bir çekim gücü, müzikalite, zarafet, insanları kelimelerle büyüleme yeteneği.',
      test: 'Narsisizm ve kendi karizmasının büyüsüne kapılıp samimiyeti yitirme tehlikesi.',
      oracleMessage: 'Vega göklerin liri gibi ruhunuzda tınılar uyandırıyor. Çekiciliğinizi sevgi yaymak ve insanları birleştirmek için kullanın.',
      actionAdvice: 'Sosyal etkinlikler, sahne performansları, aşk itirafları ve estetik yenilikler için ideal kozmik zaman.'
    },
    favorableActivities: ['Sahne & Hitabet', 'Romantik Buluşmalar', 'Estetik Dönüşüm'],
    resonanceScore: 93
  },
  {
    id: 'spica',
    name: 'Spica (Es-Simak)',
    arabicName: 'Es-Simak el-A\'zel (Silahsız Savaşçı / Başak)',
    constellation: 'Başak (Virgo)',
    eclipticLongitude: '23° 50\' Terazi',
    magnitude: 0.98,
    nature: 'Venüs - Jüpiter',
    title: 'Tanrıçanın Altın Buğday Başağı',
    archetype: 'Saf İlahi Şans & Karşılıksız Lütuf',
    guidance: {
      gift: 'Göklerin en temiz ve en uğurlu yıldızlarından biri. Zenginlik, bilimsel kavrayış, sanat ve ilahi korunma.',
      test: 'Elde ettiği lütfu nankörce harcama veya başkalarına tepeden bakma hatası.',
      oracleMessage: 'Spica size hiçbir çaba göstermeden gelen bir ilahi hediye fısıldıyor. Şükranla kabul edin ve bereketinizi başkalarıyla paylaşın.',
      actionAdvice: 'Yeni eğitimlere başlamak, finansal tohumlar ekmek ve yaratıcı projeleri büyütmek için kusursuz gün.'
    },
    favorableActivities: ['Finansal Yatırım', 'Bilimsel Çalışma', 'Bereket Niyetleri'],
    resonanceScore: 97
  },
  {
    id: 'arcturus',
    name: 'Arcturus (Haris es-Sema)',
    arabicName: 'Haris es-Sema (Göğün Muhafızı)',
    constellation: 'Çoban (Boötes)',
    eclipticLongitude: '24° 14\' Terazi',
    magnitude: -0.05,
    nature: 'Mars - Jüpiter',
    title: 'Gökyüzünün Muhafızı & Yol Açıcı',
    archetype: 'Öncü Bilge & Yargıç',
    guidance: {
      gift: 'Adalet duygusu, yeni yollar açma vizyonu, eskiyi yıkmadan yeniyi inşa etme ustalığı.',
      test: 'Aşırı kuralcılık veya kendi doğrularını başkalarına zorla kabul ettirme isteği.',
      oracleMessage: 'Arcturus gök kubbeyi koruyan fenerdir. Adaletten şaşmadan kendi yolunuzu çizin; arkanızdan kitleler gelecektir.',
      actionAdvice: 'Hukuki süreçleri yönetmek, yeni keşiflere adım atmak ve toplum yararına kararlar almak için güçlü.'
    },
    favorableActivities: ['Hukuk & Adalet', 'Liderlik Yolculuğu', 'Yenilikçi Metotlar'],
    resonanceScore: 92
  }
];

// Chaldean Planetary Hours Calculation
export interface PlanetaryHour {
  hourIndex: number;
  ruler: string;
  rulerId: string;
  title: string;
  theme: string;
  favorableFor: string[];
  unfavorableFor: string[];
  color: string;
}

export const CHALDEAN_ORDER = ['saturn', 'jupiter', 'mars', 'sun', 'venus', 'mercury', 'moon'] as const;

export const PLANETARY_HOUR_DETAILS: Record<string, Omit<PlanetaryHour, 'hourIndex'>> = {
  sun: {
    ruler: 'Güneş (Sol)',
    rulerId: 'gunes',
    title: 'Otorite, Canlılık & Aydınlanma Saati',
    theme: 'Özgüven, liderlik, resmi makamlarla görüşme ve kendini parlatma vakti.',
    favorableFor: ['Resmi Başvurular', 'Yöneticilerle Görüşme', 'Özgüven Gerektiren İşler', 'Altın/Değerli Alımlar'],
    unfavorableFor: ['Gizlilik Gerektiren İşler', 'Tevazu Gösterme', 'İçe Kapanma'],
    color: '#fbbf24'
  },
  venus: {
    ruler: 'Venüs (Afrodit)',
    rulerId: 'venus',
    title: 'Aşk, Cazibe & Sanatsal Uyum Saati',
    theme: 'Romantizm, barışma, güzellik bakımları, diplomasi ve keyifli harcamalar.',
    favorableFor: ['Romantik Buluşmalar', 'Güzellik & Estetik', 'Sanat Eserleri', 'Küsleri Barıştırma'],
    unfavorableFor: ['Ağır Disiplin', 'Tartışmalı Yüzleşmeler', 'Zorlu Efor'],
    color: '#34d399'
  },
  mercury: {
    ruler: 'Merkür (Hermes)',
    rulerId: 'merkur',
    title: 'Zeka, İletişim & Ticari Akış Saati',
    theme: 'Sözleşmeler, e-postalar, eğitim, ticaret, teknoloji ve zihinsel çözümler.',
    favorableFor: ['Sözleşme & Anlaşma', 'Pazarlık & Ticaret', 'Yazı & Kodlama', 'Kısa Seyahatler'],
    unfavorableFor: ['Sessiz Meditasyon', 'Kesin Kararlar (hızlı fikir değişebilir)'],
    color: '#38bdf8'
  },
  moon: {
    ruler: 'Ay (Luna)',
    rulerId: 'ay',
    title: 'Sezgi, Duygusal Bağ & Yuva Saati',
    theme: 'Ailevi işler, rüyalar, mutfak/beslenme, suyla temas ve içsel dinlenme.',
    favorableFor: ['Aile Ziyareti', 'Ev Düzeni & Yemek', 'Ruhsal Arınma', 'Halkla İlişkiler'],
    unfavorableFor: ['Kalıcı Yasal Anlaşmalar', 'Duyguları Bastırma'],
    color: '#a78bfa'
  },
  saturn: {
    ruler: 'Satürn (Kronos)',
    rulerId: 'saturn',
    title: 'Disiplin, Sınırlar & Kalıcı İnşa Saati',
    theme: 'Sabır, uzun vadeli planlar, gayrimenkul, borçları temizleme ve tefekkür.',
    favorableFor: ['Temel Atma & İnşa', 'Bütçe Planlama', 'Zorlu Çalışma', 'Yaşlılardan Tavsiye Alma'],
    unfavorableFor: ['Riskli Başlangıçlar', 'Eğlence & Romantizm', 'Acele Kararlar'],
    color: '#94a3b8'
  },
  jupiter: {
    ruler: 'Jüpiter (Zeus)',
    rulerId: 'jupiter',
    title: 'Bolluk, Şans & Felsefi Vizyon Saati',
    theme: 'Genişleme, finansal kazanç, felsefe, yabancı diller ve cömert niyetler.',
    favorableFor: ['Finansal İşlemler', 'Hukuki Başarı', 'Büyük Yatırımlar', 'Akademi & Seyahat'],
    unfavorableFor: ['Kısıtlama & Diyet (iştah açılır)', 'Aşırı İyimserlik'],
    color: '#eab308'
  },
  mars: {
    ruler: 'Mars (Ares)',
    rulerId: 'mars',
    title: 'Cesaret, Atılım & Mücadele Saati',
    theme: 'Spor, rekabet, ameliyatlar/cerrahi, kararlı adımlar ve fiziksel güç.',
    favorableFor: ['Ağır Spor & Antrenman', 'Mücadele & Rekabet', 'Hızlı Eylem', 'Mekanik İşler'],
    unfavorableFor: ['Diplomasi & Barışma', 'Öfke Kontrolü (kavga riski yüksek)'],
    color: '#f87171'
  }
};

/**
 * Chaldean planetary hour in effect at `date` for İstanbul: the planetary day starts at sunrise
 * with the weekday's ruler, and day and night are each split into twelve unequal hours.
 */
export function getCurrentPlanetaryHour(date = new Date()): PlanetaryHour {
  const slot = planetaryHourAt(date);
  return { hourIndex: slot.index, ...PLANETARY_HOUR_DETAILS[slot.ruler] };
}
