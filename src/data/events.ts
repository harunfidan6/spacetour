export type EventType = 'ay-tutulmasi' | 'gunes-tutulmasi' | 'meteor-yagmuru' | 'gezegen-kavusumu' | 'super-ay' | 'yeni-ay' | 'dolunay' | 'equinoks' | 'solstis';

export interface AstronomicalEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // ISO date string YYYY-MM-DD
  time?: string; // HH:MM format, optional
  description: string;
  details: string; // 2-3 sentences with observation tips
  visibility: 'tüm-dünya' | 'kuzey-yarıküre' | 'güney-yarıküre' | 'türkiye';
  emoji: string;
}

export const eventTypeLabels: Record<EventType, string> = {
  'ay-tutulmasi': 'Ay Tutulması',
  'gunes-tutulmasi': 'Güneş Tutulması',
  'meteor-yagmuru': 'Meteor Yağmuru',
  'gezegen-kavusumu': 'Gezegen Kavuşumu',
  'super-ay': 'Süper Ay',
  'yeni-ay': 'Yeni Ay',
  'dolunay': 'Dolunay',
  'equinoks': 'Ekinoks',
  'solstis': 'Gündönümü'
};

export const eventTypeColors: Record<EventType, string> = {
  'ay-tutulmasi': 'bg-red-500 text-white',
  'gunes-tutulmasi': 'bg-star-gold text-black',
  'meteor-yagmuru': 'bg-accent text-white',
  'gezegen-kavusumu': 'bg-primary text-black',
  'super-ay': 'bg-blue-300 text-black',
  'yeni-ay': 'bg-gray-800 text-white',
  'dolunay': 'bg-gray-200 text-black',
  'equinoks': 'bg-secondary text-white',
  'solstis': 'bg-orange-500 text-white'
};

export const events: AstronomicalEvent[] = [
  // 2026 Eclipses
  {
    id: '2026-se-1',
    title: 'Halkalı Güneş Tutulması',
    type: 'gunes-tutulmasi',
    date: '2026-02-17',
    description: 'Antarktika ve Güney Amerika\'nın güneyinden izlenebilecek halkalı güneş tutulması.',
    details: 'Bu tutulma sırasında Ay Güneş\'i tam olarak örtmeyecek ve gökyüzünde bir "ateş çemberi" oluşturacak. Türkiye\'den gözlemlenemeyecek.',
    visibility: 'güney-yarıküre',
    emoji: '🌞'
  },
  {
    id: '2026-le-1',
    title: 'Tam Ay Tutulması',
    type: 'ay-tutulmasi',
    date: '2026-03-03',
    description: 'Amerika kıtası, Avrupa ve Afrika\'dan görülebilecek tam ay tutulması.',
    details: 'Ay Dünya\'nın gölgesine girerek kırmızımsı bir renk alacak. Türkiye\'den sabah erken saatlerde kısmen gözlemlenebilir.',
    visibility: 'tüm-dünya',
    emoji: '🌑'
  },
  {
    id: '2026-se-2',
    title: 'Tam Güneş Tutulması',
    type: 'gunes-tutulmasi',
    date: '2026-08-12',
    description: 'Kuzey Amerika, Avrupa ve Asya\'nın kuzeyinden izlenebilecek tam güneş tutulması.',
    details: 'İzlanda, İspanya ve Rusya\'da tam olarak gözlemlenecek. Türkiye\'den parçalı tutulma olarak izlenebilecek.',
    visibility: 'kuzey-yarıküre',
    emoji: '☀️'
  },
  {
    id: '2026-le-2',
    title: 'Parçalı Ay Tutulması',
    type: 'ay-tutulmasi',
    date: '2026-08-28',
    description: 'Pasifik Okyanusu, Asya ve Avustralya\'dan görülebilecek parçalı ay tutulması.',
    details: 'Ay\'ın sadece bir kısmı Dünya\'nın tam gölgesinden geçecek. Sabaha karşı batı ufkunda izlenebilir.',
    visibility: 'tüm-dünya',
    emoji: '🌗'
  },

  // 2027 Eclipses
  {
    id: '2027-se-1',
    title: 'Halkalı Güneş Tutulması',
    type: 'gunes-tutulmasi',
    date: '2027-02-06',
    description: 'Güney Amerika, Antarktika ve Güney Afrika\'dan izlenebilecek.',
    details: 'Ay\'ın diski Güneş\'ten küçük kalacağı için halkalı bir görünüm oluşacak. Uygun filtreler kullanılarak izlenmesi gerekir.',
    visibility: 'güney-yarıküre',
    emoji: '🌅'
  },
  {
    id: '2027-le-1',
    title: 'Gölgeli Ay Tutulması',
    type: 'ay-tutulmasi',
    date: '2027-02-20',
    description: 'Amerika kıtası, Avrupa ve Afrika\'dan görülebilecek.',
    details: 'Ay, Dünya\'nın dış gölgesinden (penumbra) geçeceği için sadece hafif bir kararma fark edilebilecek. Çıplak gözle fark edilmesi zor olabilir.',
    visibility: 'tüm-dünya',
    emoji: '🌘'
  },
  {
    id: '2027-se-2',
    title: 'Tam Güneş Tutulması',
    type: 'gunes-tutulmasi',
    date: '2027-08-02',
    description: 'Kuzey Afrika ve Orta Doğu\'dan tam olarak izlenebilecek.',
    details: 'Mısır ve Suudi Arabistan\'dan en iyi şekilde gözlemlenecek. Türkiye\'nin güney bölgelerinden çok büyük oranda kapalı olarak izlenebilecek muhteşem bir gök olayı.',
    visibility: 'kuzey-yarıküre',
    emoji: '🌞'
  },
  {
    id: '2027-le-2',
    title: 'Gölgeli Ay Tutulması',
    type: 'ay-tutulmasi',
    date: '2027-08-17',
    description: 'Asya, Avustralya ve Pasifik\'ten görülebilecek.',
    details: 'Ay\'ın yüzeyinde hafif bir loşlaşma gözlemlenecek. Hava şartlarının uygun olduğu karanlık bölgelerden daha iyi seçilebilir.',
    visibility: 'tüm-dünya',
    emoji: '🌖'
  },

  // 2026 Meteor Showers
  {
    id: '2026-met-1',
    title: 'Quadrantid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2026-01-03',
    description: 'Yılın ilk büyük meteor yağmuru, saatte 40-120 göktaşı.',
    details: 'Kuzey yarımküreden en iyi şekilde izlenir. Gece yarısından sonra karanlık bir bölgeden Çoban (Boötes) takımyıldızı yönüne bakılmalıdır.',
    visibility: 'kuzey-yarıküre',
    emoji: '🌠'
  },
  {
    id: '2026-met-2',
    title: 'Lyrid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2026-04-22',
    description: 'İlkbaharın ortasında gerçekleşen, saatte ortalama 15-20 meteor.',
    details: 'Çalgı (Lyra) takımyıldızı yönünden gelir. Ay\'ın evresine göre görünürlüğü değişebilir, karanlık alanları tercih edin.',
    visibility: 'tüm-dünya',
    emoji: '✨'
  },
  {
    id: '2026-met-3',
    title: 'Eta Aquariid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2026-05-06',
    description: 'Halley Kuyrukluyıldızı\'nın kalıntılarından oluşan meteor yağmuru.',
    details: 'Özellikle güney yarımkürede daha yoğundur, saatte 60 kadar meteor izlenebilir. Kova takımyıldızı yönünden gelir.',
    visibility: 'tüm-dünya',
    emoji: '☄️'
  },
  {
    id: '2026-met-4',
    title: 'Perseid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2026-08-12',
    description: 'Yılın en görkemli meteor yağmurlarından biri, saatte 100 civarı meteor.',
    details: 'Yaz aylarında denk geldiği için izlemesi en keyifli yağmurlardandır. Kahraman (Perseus) takımyıldızı yönüne doğru, şehir ışıklarından uzak bir yerde izlenmelidir.',
    visibility: 'kuzey-yarıküre',
    emoji: '🌟'
  },
  {
    id: '2026-met-5',
    title: 'Orionid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2026-10-21',
    description: 'Halley Kuyrukluyıldızı kaynaklı, saatte 20 meteor.',
    details: 'Avcı (Orion) takımyıldızı saçılma noktasıdır. Oldukça hızlı ve parlak izler bırakan meteorlar görülebilir.',
    visibility: 'tüm-dünya',
    emoji: '🌠'
  },
  {
    id: '2026-met-6',
    title: 'Leonid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2026-11-17',
    description: 'Aslan (Leo) takımyıldızından yayılan, hızlı meteor yağmuru.',
    details: 'Ortalama saatte 15 meteor üretir ancak bazı yıllar meteor fırtınalarına neden olabilir. Gece yarısından sabaha karşı izlenmesi tavsiye edilir.',
    visibility: 'tüm-dünya',
    emoji: '✨'
  },
  {
    id: '2026-met-7',
    title: 'Geminid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2026-12-14',
    description: 'Yılın en yoğun ve güvenilir meteor yağmuru, saatte 120-150 meteor.',
    details: 'İkizler takımyıldızı civarından gelir. Genellikle çok renkli ve parlak olan Geminid meteorları soğuk kış gecelerine değer bir şölen sunar.',
    visibility: 'tüm-dünya',
    emoji: '☄️'
  },

  // 2027 Meteor Showers
  {
    id: '2027-met-1',
    title: 'Quadrantid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2027-01-04',
    description: 'Kısa süreli ama yoğun meteor yağmuru.',
    details: 'Zirve süresi sadece birkaç saat sürdüğünden doğru zamanlama önemlidir. Kuzey yönüne doğru gözlem yapılmalıdır.',
    visibility: 'kuzey-yarıküre',
    emoji: '🌠'
  },
  {
    id: '2027-met-2',
    title: 'Lyrid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2027-04-22',
    description: 'İlkbaharın popüler meteor etkinliği.',
    details: 'Toz kuyruklu C/1861 G1 Thatcher kuyrukluyıldızından gelir. Bazen ateş topları (fireball) olarak bilinen çok parlak meteorlar da oluşturabilir.',
    visibility: 'tüm-dünya',
    emoji: '✨'
  },
  {
    id: '2027-met-3',
    title: 'Eta Aquariid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2027-05-06',
    description: 'Bahar mevsiminin göktaşı yağmuru.',
    details: 'Dünya\'nın atmosferine giren meteorlar saniyede 66 km hıza ulaşır. Bu da gökyüzünde uzun parlak izler bırakmalarını sağlar.',
    visibility: 'tüm-dünya',
    emoji: '☄️'
  },
  {
    id: '2027-met-4',
    title: 'Perseid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2027-08-13',
    description: 'Swift-Tuttle kuyrukluyıldızının kalıntıları.',
    details: 'Ağustos ortasında harika bir yaz etkinliği. Işık kirliliğinin olmadığı yüksek rakımlı yerler en iyi gözlem noktalarıdır.',
    visibility: 'kuzey-yarıküre',
    emoji: '🌟'
  },
  {
    id: '2027-met-5',
    title: 'Orionid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2027-10-22',
    description: 'Ekim aynın belirgin gök olayı.',
    details: 'Gece yarısından sonra doğu ufkuna bakılarak rahatça izlenebilir. Karanlık gökyüzü koşulları esastır.',
    visibility: 'tüm-dünya',
    emoji: '🌠'
  },
  {
    id: '2027-met-6',
    title: 'Leonid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2027-11-18',
    description: 'Kasım ortasında Aslan takımyıldızından gelen göktaşları.',
    details: 'Tempel-Tuttle kuyrukluyıldızının enkazından oluşur. Sabaha karşı gözlemlemek en yüksek verimi sağlar.',
    visibility: 'tüm-dünya',
    emoji: '✨'
  },
  {
    id: '2027-met-7',
    title: 'Geminid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2027-12-14',
    description: 'Yıl sonunun en parlak meteor yağmuru.',
    details: 'Phaethon asteroidinin bıraktığı parçacıklar nedeniyle oluşur, bu yüzden kuyrukluyıldız kaynaklı olmayan nadir yağmurlardandır. Her yönden meteor görülebilir.',
    visibility: 'tüm-dünya',
    emoji: '☄️'
  },

  // Equinoxes and Solstices 2026-2027
  {
    id: '2026-eq-1',
    title: 'İlkbahar Ekinoksu',
    type: 'equinoks',
    date: '2026-03-20',
    description: 'Kuzey yarımkürede ilkbaharın, güneyde sonbaharın başlangıcı.',
    details: 'Gece ve gündüz süreleri neredeyse eşitlenir. Güneş tam doğudan doğup tam batıdan batar.',
    visibility: 'tüm-dünya',
    emoji: '🌱'
  },
  {
    id: '2026-sol-1',
    title: 'Yaz Gündönümü',
    type: 'solstis',
    date: '2026-06-21',
    description: 'Kuzey yarımkürede yılın en uzun gündüzü.',
    details: 'Güneş ışınları Yengeç Dönencesi\'ne dik gelir. Kuzey yarımküre için yaz mevsiminin astronomik başlangıcıdır.',
    visibility: 'tüm-dünya',
    emoji: '🌞'
  },
  {
    id: '2026-eq-2',
    title: 'Sonbahar Ekinoksu',
    type: 'equinoks',
    date: '2026-09-22',
    description: 'Kuzey yarımkürede sonbaharın, güneyde ilkbaharın başlangıcı.',
    details: 'Güneş ışınları Ekvator\'a dik gelir. Tüm dünyada gece ve gündüz yaklaşık 12şer saat yaşanır.',
    visibility: 'tüm-dünya',
    emoji: '🍂'
  },
  {
    id: '2026-sol-2',
    title: 'Kış Gündönümü',
    type: 'solstis',
    date: '2026-12-21',
    description: 'Kuzey yarımkürede yılın en uzun gecesi.',
    details: 'Güneş ışınları Oğlak Dönencesi\'ne dik gelir. Kuzey yarımküre için astronomik kışın başlangıcıdır.',
    visibility: 'tüm-dünya',
    emoji: '❄️'
  },
  {
    id: '2027-eq-1',
    title: 'İlkbahar Ekinoksu',
    type: 'equinoks',
    date: '2027-03-20',
    description: 'Gece ve gündüzün eşitlenmesi.',
    details: 'Kuzey yarımkürede havaların ısınmaya başladığı dönemi işaret eder. Güneş doğu ufkundan tam doğuda belirir.',
    visibility: 'tüm-dünya',
    emoji: '🌱'
  },
  {
    id: '2027-sol-1',
    title: 'Yaz Gündönümü',
    type: 'solstis',
    date: '2027-06-21',
    description: 'Yazın başlangıcı.',
    details: 'Kuzey Kutup Dairesi içinde 24 saat gündüz yaşanır. Türkiye\'de en kısa gölgeler bu tarihte öğle vakti oluşur.',
    visibility: 'tüm-dünya',
    emoji: '🌞'
  },
  {
    id: '2027-eq-2',
    title: 'Sonbahar Ekinoksu',
    type: 'equinoks',
    date: '2027-09-23',
    description: 'Sonbaharın astronomik başlangıcı.',
    details: 'Kuzey Kutbunda 6 aylık gece, Güney Kutbunda ise 6 aylık gündüz dönemi başlar.',
    visibility: 'tüm-dünya',
    emoji: '🍂'
  },
  {
    id: '2027-sol-2',
    title: 'Kış Gündönümü',
    type: 'solstis',
    date: '2027-12-22',
    description: 'Yılın en uzun gecesi.',
    details: 'Bu tarihten sonra kuzey yarımkürede günler uzamaya, geceler kısalmaya başlar.',
    visibility: 'tüm-dünya',
    emoji: '❄️'
  },

  // Super Moons & Planet Conjunctions (approximate dates for realism)
  {
    id: '2026-sm-1',
    title: 'Süper Ay',
    type: 'super-ay',
    date: '2026-05-31',
    description: 'Ay\'ın Dünya\'ya en yakın olduğu noktada gerçekleşen dolunay.',
    details: 'Normal dolunaylardan yaklaşık %14 daha büyük ve %30 daha parlak görünür. Ay doğarken veya batarken izlemesi çok keyiflidir.',
    visibility: 'tüm-dünya',
    emoji: '🌕'
  },
  {
    id: '2026-sm-2',
    title: 'Süper Ay',
    type: 'super-ay',
    date: '2026-06-29',
    description: 'Yılın ikinci süper ayı.',
    details: 'Fotoğrafçılar için harika bir fırsat sunar. Telefoto lens ile ufuk çizgisindeki objelerle birlikte çok etkileyici kareler yakalanabilir.',
    visibility: 'tüm-dünya',
    emoji: '🌕'
  },
  {
    id: '2026-conj-1',
    title: 'Jüpiter ve Venüs Kavuşumu',
    type: 'gezegen-kavusumu',
    date: '2026-08-25',
    description: 'Gökyüzünün en parlak iki gezegeninin yakınlaşması.',
    details: 'Güneş battıktan hemen sonra batı ufkunda birbirine çok yakın iki parlak nokta olarak görülecekler. Çıplak gözle çok rahat izlenebilir.',
    visibility: 'tüm-dünya',
    emoji: '🪐'
  },
  {
    id: '2026-conj-2',
    title: 'Mars ve Satürn Kavuşumu',
    type: 'gezegen-kavusumu',
    date: '2026-11-15',
    description: 'Kızıl gezegen Mars ile halkalı gezegen Satürn gökyüzünde buluşuyor.',
    details: 'Gece yarısına doğru güney ufkunda bir araya gelecekler. Bir teleskopla bakıldığında aynı görüş alanında harika görünebilirler.',
    visibility: 'tüm-dünya',
    emoji: '🪐'
  },
  {
    id: '2027-sm-1',
    title: 'Süper Ay',
    type: 'super-ay',
    date: '2027-07-18',
    description: 'Dünya\'ya oldukça yaklaşmış dev dolunay.',
    details: 'Ay Dünya etrafındaki eliptik yörüngesinde perije (en yakın) noktasına geldiğinde dolunay evresiyle çakışır. Çok parlak bir gece bekliyor.',
    visibility: 'tüm-dünya',
    emoji: '🌕'
  },
  {
    id: '2027-sm-2',
    title: 'Süper Ay',
    type: 'super-ay',
    date: '2027-08-16',
    description: 'Yılın en dikkat çeken süper ayı.',
    details: 'Özellikle ay doğuşu sırasında (ufka yakınken) Ay yanılsaması (Moon illusion) sebebiyle devasa boyutlarda algılanır.',
    visibility: 'tüm-dünya',
    emoji: '🌕'
  },
  {
    id: '2027-conj-1',
    title: 'Mars ve Jüpiter Kavuşumu',
    type: 'gezegen-kavusumu',
    date: '2027-04-12',
    description: 'Gece gökyüzünde çok yakın iki parlak cisim.',
    details: 'Sabaha karşı doğu ufkunda birbirine sadece 0.5 derece mesafede parlayacaklar. Bir dürbün bile muazzam bir görüntü sağlar.',
    visibility: 'tüm-dünya',
    emoji: '🪐'
  },
  {
    id: '2027-conj-2',
    title: 'Venüs ve Pleiades Kavuşumu',
    type: 'gezegen-kavusumu',
    date: '2027-06-05',
    description: 'Venüs gezegeninin Ülker (Pleiades) yıldız kümesiyle yakınlaşması.',
    details: 'Akşam saatlerinde batı ufkunda görülebilir. Dürbün veya küçük bir teleskopla bu muhteşem kozmik buluşma çok net izlenebilir.',
    visibility: 'tüm-dünya',
    emoji: '✨'
  },
  
  // Extra Full Moons and New Moons to fill up the calendar (2026-2027)
  {
    id: '2026-fm-1',
    title: 'Kurt Dolunayı',
    type: 'dolunay',
    date: '2026-01-23',
    description: 'Ocak ayının dolunayı.',
    details: 'Kışın ortasında, kurtların ulumasının duyulduğu dönemlerde gerçekleştiği için eski kültürlerde bu isim verilmiştir.',
    visibility: 'tüm-dünya',
    emoji: '🌝'
  },
  {
    id: '2026-nm-1',
    title: 'Yeni Ay',
    type: 'yeni-ay',
    date: '2026-02-07',
    description: 'Derin uzay gözlemleri için en uygun zaman.',
    details: 'Ay gökyüzünde görünmediği için ışık kirliliği azalır. Galaksileri, nebulaları ve yıldız kümelerini izlemek için en iyi gecedir.',
    visibility: 'tüm-dünya',
    emoji: '🌑'
  },
  {
    id: '2026-fm-2',
    title: 'Kar Dolunayı',
    type: 'dolunay',
    date: '2026-02-22',
    description: 'Şubat ayının dolunayı.',
    details: 'Kuzey yarımkürede yılın en yoğun kar yağışlı aylarından birine denk geldiği için bu isimle anılır.',
    visibility: 'tüm-dünya',
    emoji: '🌝'
  },
  {
    id: '2026-nm-2',
    title: 'Yeni Ay',
    type: 'yeni-ay',
    date: '2026-04-06',
    description: 'Asteroit ve sönük gök cisimlerini gözlemlemek için iyi bir gece.',
    details: 'Gökyüzünün karanlık olmasından faydalanarak iyi bir teleskopla Messier objeleri avına çıkabilirsiniz.',
    visibility: 'tüm-dünya',
    emoji: '🌑'
  },
  {
    id: '2026-fm-3',
    title: 'Solucan Dolunayı',
    type: 'dolunay',
    date: '2026-03-24',
    description: 'Mart ayının dolunayı.',
    details: 'Toprağın yumuşamaya başlaması ve solucanların yüzeye çıkması dolayısıyla isimlendirilmiştir. İlkbaharın müjdecisidir.',
    visibility: 'tüm-dünya',
    emoji: '🌝'
  },
  {
    id: '2026-nm-3',
    title: 'Yeni Ay',
    type: 'yeni-ay',
    date: '2026-09-01',
    description: 'Samanyolu galaksisini fotoğraflamak için muazzam bir fırsat.',
    details: 'Işık kirliliğinden uzak bir noktada, Ay ışığının yokluğunda Samanyolu kuşağı tüm ihtişamıyla izlenebilir.',
    visibility: 'tüm-dünya',
    emoji: '🌑'
  },
  {
    id: '2026-fm-4',
    title: 'Hasat Dolunayı',
    type: 'dolunay',
    date: '2026-09-17',
    description: 'Sonbahar ekinoksuna en yakın dolunay.',
    details: 'Eskiden çiftçiler Ay\'ın güçlü ışığından faydalanarak gece geç saatlere kadar hasat yapabildikleri için bu ismi almıştır.',
    visibility: 'tüm-dünya',
    emoji: '🌾'
  },
  {
    id: '2027-fm-1',
    title: 'Pembe Dolunay',
    type: 'dolunay',
    date: '2027-04-11',
    description: 'Nisan ayının dolunayı.',
    details: 'Adını ayın renginden değil, erken açan pembe yabani phlox çiçeklerinden alır. Baharın gelişini simgeler.',
    visibility: 'tüm-dünya',
    emoji: '🌸'
  },
  {
    id: '2027-nm-1',
    title: 'Yeni Ay',
    type: 'yeni-ay',
    date: '2027-05-02',
    description: 'Teleskoplu gözlemciler için ideal gece.',
    details: 'Derin gökyüzü objelerini (DSO) tespit etmek için mükemmel şartlar sağlar.',
    visibility: 'tüm-dünya',
    emoji: '🌑'
  },
  {
    id: '2027-fm-2',
    title: 'Çiçek Dolunayı',
    type: 'dolunay',
    date: '2027-05-11',
    description: 'Mayıs ayının dolunayı.',
    details: 'Bahar çiçeklerinin bolca açtığı döneme denk geldiği için bu isimle bilinir.',
    visibility: 'tüm-dünya',
    emoji: '🌺'
  },
  {
    id: '2027-nm-2',
    title: 'Yeni Ay',
    type: 'yeni-ay',
    date: '2027-11-28',
    description: 'Karanlık kış gecesinin başlangıcı.',
    details: 'Gökyüzü yeterince karanlık olduğu için Andromeda galaksisi çıplak gözle (veya küçük bir dürbünle) gözlemlenebilir.',
    visibility: 'tüm-dünya',
    emoji: '🌑'
  },
  {
    id: '2027-fm-3',
    title: 'Avcı Dolunayı',
    type: 'dolunay',
    date: '2027-10-15',
    description: 'Ekim ayının dolunayı.',
    details: 'Kış yaklaşırken hayvanların semirdiği ve avcıların kışlık erzak hazırladığı dönemde gerçekleşir. Gece boyu gökyüzünü aydınlatır.',
    visibility: 'tüm-dünya',
    emoji: '🏹'
  }
];
