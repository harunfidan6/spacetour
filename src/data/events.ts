export type EventType = 'ay-tutulmasi' | 'gunes-tutulmasi' | 'meteor-yagmuru' | 'gezegen-kavusumu' | 'super-ay' | 'yeni-ay' | 'dolunay' | 'equinoks' | 'solstis';

import { LUNAR_EVENTS } from './lunarEvents';

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

/** Signal colour per event type (CSS colour values from the design tokens). */
export const eventTypeTones: Record<EventType, string> = {
  'ay-tutulmasi': 'var(--rose)',
  'gunes-tutulmasi': 'var(--gold)',
  'meteor-yagmuru': 'var(--solar)',
  'gezegen-kavusumu': 'var(--violet)',
  'super-ay': '#8fd3ff',
  'yeni-ay': 'var(--muted)',
  'dolunay': 'var(--paper)',
  'equinoks': 'var(--lime)',
  'solstis': '#ff9f43'
};

/** Elle girilen olaylar: tutulmalar, meteor yağmurları, ekinoks/gündönümü ve kavuşumlar (tarihler efemerisle denetlendi). */
const BASE_EVENTS: AstronomicalEvent[] = [
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
  {
    id: '2026-conj-1',
    title: 'Venüs ve Jüpiter Kavuşumu',
    type: 'gezegen-kavusumu',
    date: '2026-06-09',
    time: '21:00',
    description: 'Gökyüzünün en parlak iki gezegeni Yengeç takımyıldızında 1,6° arayla yan yana.',
    details: 'Gün batımından sonra batı-kuzeybatı ufkunda, Güneş’in 37° doğusunda görülürler. Venüs çok daha parlaktır; ikisini aynı dürbün görüş alanında yakalamak kolaydır. Ufku açık bir yerden, gün batımından 30–60 dakika sonra bakın.',
    visibility: 'tüm-dünya',
    emoji: '🪐'
  },
  {
    id: '2026-conj-2',
    title: 'Mars ve Jüpiter Kavuşumu',
    type: 'gezegen-kavusumu',
    date: '2026-11-16',
    time: '03:00',
    description: 'Kızıl Mars ile dev Jüpiter, Aslan takımyıldızında 1,2° arayla buluşuyor.',
    details: 'İkisi de Güneş’in yaklaşık 88° batısında: gece yarısından sonra doğudan yükselir, şafak öncesinde güneydoğu göğünde yüksekte parlarlar. Jüpiter’in beyaz, Mars’ın turuncu rengi yan yana çıplak gözle bile fark edilir; dürbünle Jüpiter’in dört büyük uydusu da görülebilir.',
    visibility: 'tüm-dünya',
    emoji: '🪐'
  },
  {
    id: '2027-conj-1',
    title: 'Mars ve Jüpiter Yakınlaşması',
    type: 'gezegen-kavusumu',
    date: '2027-03-28',
    time: '03:00',
    description: 'Retrodaki Mars, Aslan takımyıldızında Jüpiter’e 3,6° kadar yaklaşıyor.',
    details: 'Mars şubattaki karşı konumundan sonra hâlâ çok parlak. İkili gün batımında doğu-güneydoğudan yükselir ve gecenin büyük bölümünde görünür; gece yarısına doğru güney göğünde en yüksektedir. Tam bir kavuşum değil, yakın bir geçiştir: iki gezegen birkaç gece boyunca birbirine yakın kalır.',
    visibility: 'tüm-dünya',
    emoji: '🪐'
  },
  {
    id: '2027-conj-2',
    title: 'Venüs ve Satürn Kavuşumu',
    type: 'gezegen-kavusumu',
    date: '2027-05-07',
    time: '21:00',
    description: 'Sabah yıldızı Venüs, Satürn’ün 0,6° yakınından geçiyor.',
    details: 'İkisi de Güneş’in yaklaşık 26° batısında: 7 ve 8 Mayıs sabahları gün doğumundan önce doğu ufkunda alçakta görülürler. Venüs çok parlak olduğu için önce onu bulun; Satürn hemen yanındaki sönük, sarımsı noktadır. Dürbün işinizi kolaylaştırır.',
    visibility: 'tüm-dünya',
    emoji: '🪐'
  },
  {
    id: '2028-ms-1',
    title: 'Dörtlük (Quadrantid) Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2028-01-03',
    time: '23:00',
    description: 'Yılın ilk ve en yoğun meteor yağmurlarından biri; saatte 100’den fazla meteor görülebilir.',
    details: '2003 EH1 asteroidinin parçacıklarından oluşur. Zirve süresi yalnızca birkaç saat sürer, gece yarısından sonra kuzey-kuzeydoğu yönüne bakın.',
    visibility: 'kuzey-yarıküre',
    emoji: '🌠'
  },
  {
    id: '2028-le-1',
    title: 'Kısmi Ay Tutulması',
    type: 'ay-tutulmasi',
    date: '2028-01-12',
    time: '04:14',
    description: 'Avrupa, Afrika, Asya ve Türkiye’den gözlemlenebilecek kısmi ay tutulması.',
    details: 'Ay’ın güney kenarı Dünya’nın tam gölgesine girerek kararma ve bakır rengi ışıma sergileyecektir. Türkiye’den sabaha karşı net izlenebilir.',
    visibility: 'türkiye',
    emoji: '🌑'
  },
  {
    id: '2028-se-1',
    title: 'Halkalı Güneş Tutulması',
    type: 'gunes-tutulmasi',
    date: '2028-01-26',
    description: 'Güney Amerika, Atlas Okyanusu ve İspanya’dan izlenebilecek ateş çemberi tutulması.',
    details: 'Ay Güneş diskini tam örtemeyerek gökyüzünde parlak bir altın halka bırakır. Türkiye’den parçalı olarak gözlenemez.',
    visibility: 'güney-yarıküre',
    emoji: '🌞'
  },
  {
    id: '2028-eq-1',
    title: 'İlkbahar Ekinoksu',
    type: 'equinoks',
    date: '2028-03-20',
    time: '03:17',
    description: 'Güneş ışınlarının ekvatora dik geldiği ve gece ile gündüzün eşitlendiği an.',
    details: 'Kuzey yarımkürede astronomik ilkbaharın, güney yarımkürede ise sonbaharın başlangıcıdır.',
    visibility: 'tüm-dünya',
    emoji: '🌱'
  },
  {
    id: '2028-cj-1',
    title: 'Venüs – Jüpiter Büyük Kavuşumu',
    type: 'gezegen-kavusumu',
    date: '2028-11-10',
    time: '03:00',
    description: 'Gökyüzünün en parlak iki gezegeni Terazi takımyıldızında 0,6° arayla buluşuyor.',
    details: 'İkisi de Güneş’in yaklaşık 32° batısında: şafaktan önce doğu-güneydoğu ufkunda, birbirine çok yakın iki parlak nokta olarak görülürler. Çıplak gözle bile etkileyicidir; dürbünle Jüpiter’in uyduları da seçilebilir.',
    visibility: 'tüm-dünya',
    emoji: '🪐'
  },
  {
    id: '2028-ms-2',
    title: 'Çalgı (Lyrid) Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2028-04-22',
    time: '01:00',
    description: 'Thatcher kuyruklu yıldızının antik tozlarının oluşturduğu bahar meteorları.',
    details: 'Saatte ortalama 18 parlak meteor üretir. Ay ışığı engeli olmadığı saatlerde Vega yıldızı yönüne bakılarak izlenebilir.',
    visibility: 'kuzey-yarıküre',
    emoji: '🌠'
  },
  {
    id: '2028-ms-3',
    title: 'Eta Aquariid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2028-05-06',
    time: '03:30',
    description: 'Meşhur Halley kuyruklu yıldızının arkasında bıraktığı enkaz kuşağı.',
    details: 'Saatte 50’ye varan hızlı ve iz bırakan meteorlar üretir. Şafak öncesi saatlerde güneydoğu ufkunda gözlenir.',
    visibility: 'tüm-dünya',
    emoji: '🌠'
  },
  {
    id: '2028-cj-2',
    title: 'Venüs ve Ülker Buluşması',
    type: 'gezegen-kavusumu',
    date: '2028-04-03',
    time: '21:00',
    description: 'Venüs, sekiz yılda bir yinelenen bir geçişle Ülker (Pleiades) yıldız kümesinin içinden geçiyor.',
    details: '3 ve 4 Nisan akşamları gün batımından sonra batı göğünde Venüs, Ülker’in parlak yıldızlarının arasında görülür. Çıplak gözle güzel, dürbünle büyüleyicidir: kümenin mavi yıldızları Venüs’ün parıltısının çevresine dizilir. Bir sonraki benzer geçiş 2036’da.',
    visibility: 'tüm-dünya',
    emoji: '✨'
  },
  {
    id: '2028-ss-1',
    title: 'Yaz Gündönümü (Solstis)',
    type: 'solstis',
    date: '2028-06-20',
    time: '20:46',
    description: 'Yılın en uzun gündüzü ve en kısa gecesi.',
    details: 'Güneş Yengeç Dönencesi’ne dik açı yapar; kuzey yarımkürede yaz mevsiminin resmi başlangıcıdır.',
    visibility: 'tüm-dünya',
    emoji: '☀️'
  },
  {
    id: '2028-le-2',
    title: 'Kısmi Ay Tutulması',
    type: 'ay-tutulmasi',
    date: '2028-07-06',
    description: 'Pasifik Okyanusu, Avustralya ve Amerika’dan izlenecek kısmi tutulma.',
    details: 'Ay Dünya’nın gölgesinden kısmen geçerek güney ufuklarında hafif kızıl tonlar bırakır.',
    visibility: 'güney-yarıküre',
    emoji: '🌑'
  },
  {
    id: '2028-se-2',
    title: 'Tam Güneş Tutulması',
    type: 'gunes-tutulmasi',
    date: '2028-07-22',
    description: 'Sidney ve Avustralya merkez hattından geçecek tarihi tam güneş tutulması.',
    details: 'Avustralya ve Yeni Zelanda üzerinde gündüz aniden geceye dönecek; Güneş tacı (korona) 5 dakikadan uzun süre çıplak gözle izlenebilecek.',
    visibility: 'güney-yarıküre',
    emoji: '👑'
  },
  {
    id: '2028-ms-4',
    title: 'Perseid Meteor Yağmuru Zirvesi',
    type: 'meteor-yagmuru',
    date: '2028-08-12',
    time: '23:30',
    description: 'Yılın en popüler ve göz kamaştırıcı meteor şöleni; saatte 100 meteor.',
    details: 'Swift-Tuttle kuyruklu yıldızının parçacıkları atmosfere saniyede 59 km hızla girer. Şehir ışıklarından uzakta çıplak gözle tüm gece izlenebilir.',
    visibility: 'kuzey-yarıküre',
    emoji: '🌠'
  },
  {
    id: '2028-eq-2',
    title: 'Sonbahar Ekinoksu',
    type: 'equinoks',
    date: '2028-09-22',
    time: '13:08',
    description: 'İkinci gece ve gündüz eşitliği; sonbaharın resmi başlangıcı.',
    details: 'Güneş göksel ekvatoru güneye doğru keser; geceler gündüzlerden daha uzun olmaya başlar.',
    visibility: 'tüm-dünya',
    emoji: '🍂'
  },
  {
    id: '2028-ms-5',
    title: 'Orionid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2028-10-21',
    time: '02:00',
    description: 'Halley kuyruklu yıldızının bıraktığı sonbahar meteor akıntısı.',
    details: 'Avcı (Orion) takımyıldızının başucuna yükseldiği gece yarısından sonra saatte yaklaşık 20-25 çok hızlı meteor görülebilir.',
    visibility: 'tüm-dünya',
    emoji: '🌠'
  },
  {
    id: '2028-ms-6',
    title: 'Leonid Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2028-11-17',
    time: '03:00',
    description: 'Tempel-Tuttle kuyruklu yıldızı kaynaklı parlak ateş topları.',
    details: 'Hızı saatte 71 km/s’ye varan en hızlı meteorlardır; yeşilimsi kalıcı duman izleri bırakabilir.',
    visibility: 'kuzey-yarıküre',
    emoji: '🌠'
  },
  {
    id: '2028-ms-7',
    title: 'Geminid (İkizler) Meteor Yağmuru',
    type: 'meteor-yagmuru',
    date: '2028-12-14',
    time: '22:00',
    description: 'Yılın en zengin ve güvenilir meteor yağmuru; saatte 120-150 meteor.',
    details: '3200 Phaethon asteroidi kaynaklıdır. Yavaş ve parlak beyaz/sarı izler bırakır; kış gökyüzünün en görkemli tablosudur.',
    visibility: 'tüm-dünya',
    emoji: '🌠'
  },
  {
    id: '2028-ss-2',
    title: 'Kış Gündönümü (Solstis)',
    type: 'solstis',
    date: '2028-12-21',
    time: '09:20',
    description: 'Kuzey yarımkürede yılın en uzun gecesi ve en kısa gündüzü.',
    details: 'Astronomik kış mevsiminin başlangıcıdır; bu tarihten itibaren günler yeniden uzamaya başlar.',
    visibility: 'tüm-dünya',
    emoji: '❄️'
  },
  {
    id: '2028-le-3',
    title: 'Tam Ay Tutulması (Yılbaşı Tutulması)',
    type: 'ay-tutulmasi',
    date: '2028-12-31',
    time: '18:52',
    description: 'Tarihi yılbaşı gecesinde tam kanlı ay tutulması; Türkiye’den izlenebilir.',
    details: 'Ay tamamen Dünya’nın gölgesine girerek derin bakır-kızıl rengine bürünecek. Türkiye’den akşam saatlerinde ufuktan doğarken tam tutulma halinde büyüleyici şekilde izlenebilir.',
    visibility: 'türkiye',
    emoji: '🩸'
  }
];

/** Bütün olaylar: elle girilenler + efemeristen üretilen dolunay ve yeni Aylar (src/data/lunarEvents.ts), tarih sırasıyla */
export const events: AstronomicalEvent[] = [...BASE_EVENTS, ...LUNAR_EVENTS].sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? '').localeCompare(b.time ?? ''));

