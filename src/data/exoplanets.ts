export interface Exoplanet {
  id: string;
  name: string;
  hostStar: string;
  distanceLightYears: number;
  discoveryYear: number;
  discoveryMethod: 'Geçiş Yöntemi (Transit)' | 'Radyal Hız' | 'Doğrudan Görüntüleme';
  planetType: 'Süper-Dünya' | 'Sıcak Jüpiter' | 'Lav Dünyası' | 'Okyanus Dünyası' | 'Karasal Gezegen';
  habitableZone: boolean;
  orbitalPeriodDays: number;
  massEarth: number;
  radiusEarth: number;
  surfaceTemp: string;
  description: string;
  atmosphere: string;
  emoji: string;
  color: string;
}

export const EXOPLANETS: Exoplanet[] = [
  {
    id: 'trappist-1e',
    name: 'TRAPPIST-1e',
    hostStar: 'TRAPPIST-1 (Kırmızı Cüce)',
    distanceLightYears: 39.5,
    discoveryYear: 2017,
    discoveryMethod: 'Geçiş Yöntemi (Transit)',
    planetType: 'Karasal Gezegen',
    habitableZone: true,
    orbitalPeriodDays: 6.1,
    massEarth: 0.69,
    radiusEarth: 0.92,
    surfaceTemp: '-15°C ila +20°C',
    description: 'James Webb’in birincil hedeflerinden biri. Kompakt bir kırmızı cüce sisteminde yer alır ve sıvı su barındırma olasılığı en yüksek olan potansiyel yaşam adayıdır.',
    atmosphere: 'Yoğun su buharı ve karbondioksit potansiyeli',
    emoji: '🌊',
    color: '#00d4ff'
  },
  {
    id: 'proxima-b',
    name: 'Proxima Centauri b',
    hostStar: 'Proxima Centauri',
    distanceLightYears: 4.24,
    discoveryYear: 2016,
    discoveryMethod: 'Radyal Hız',
    planetType: 'Süper-Dünya',
    habitableZone: true,
    orbitalPeriodDays: 11.2,
    massEarth: 1.17,
    radiusEarth: 1.08,
    surfaceTemp: '-39°C (Atmosfersiz denge)',
    description: 'Bize en yakın yıldız sisteminde yer alır. Yıldızına çok yakın olduğu için gelgit kilitlenmesi yaşaması (bir yüzünün hep gündüz, diğerinin hep gece olması) muhtemeldir.',
    atmosphere: 'Yıldız patlamaları nedeniyle incelmiş olabilir',
    emoji: '🔴',
    color: '#ff6b35'
  },
  {
    id: 'wasp-76b',
    name: 'WASP-76b',
    hostStar: 'WASP-76 (Sarı-Beyaz Yıldız)',
    distanceLightYears: 640,
    discoveryYear: 2013,
    discoveryMethod: 'Geçiş Yöntemi (Transit)',
    planetType: 'Sıcak Jüpiter',
    habitableZone: false,
    orbitalPeriodDays: 1.8,
    massEarth: 292,
    radiusEarth: 20.7,
    surfaceTemp: '2,400°C (Gündüz tarafı)',
    description: 'Gündüz tarafında demir dahi buharlaşır; şiddetli rüzgarlar bu demir buharını daha soğuk olan gece tarafına taşır ve gece gökyüzünden sıvı demir yağmuru yağar!',
    atmosphere: 'Gaz fazında demir, sodyum ve magnezyum buharı',
    emoji: '🔥',
    color: '#ff3300'
  },
  {
    id: 'cancri-55e',
    name: '55 Cancri e (Janssen)',
    hostStar: 'Copernicus (55 Cancri A)',
    distanceLightYears: 41.0,
    discoveryYear: 2004,
    discoveryMethod: 'Radyal Hız',
    planetType: 'Lav Dünyası',
    habitableZone: false,
    orbitalPeriodDays: 0.74,
    massEarth: 8.0,
    radiusEarth: 1.88,
    surfaceTemp: '2,000°C',
    description: 'Yıldızına o kadar yakındır ki yılı sadece 18 saat sürer. Yüksek karbon oranı ve aşırı basınç nedeniyle iç katmanlarının büyük oranda elmastan oluştuğu öngörülmektedir.',
    atmosphere: 'Aşırı sıcak karbondioksit ve mineral buharları',
    emoji: '💎',
    color: '#a855f7'
  },
  {
    id: 'kepler-452b',
    name: 'Kepler-452b',
    hostStar: 'Kepler-452 (Güneş İkizi)',
    distanceLightYears: 1402,
    discoveryYear: 2015,
    discoveryMethod: 'Geçiş Yöntemi (Transit)',
    planetType: 'Süper-Dünya',
    habitableZone: true,
    orbitalPeriodDays: 384.8,
    massEarth: 5.0,
    radiusEarth: 1.63,
    surfaceTemp: '-8°C (Tahmini sera etkisi hariç)',
    description: 'Dünya’nın Güneş benzeri bir yıldız etrafında yaşanabilir bölgede bulunan ilk süper-Dünya kuzeni. Yılı 385 gün sürer ve kayalık bir yüzeye sahip olduğu düşünülmektedir.',
    atmosphere: 'Yoğun bulut katmanları ve aktif volkanizma ihtimali',
    emoji: '🪐',
    color: '#22c55e'
  }
];
