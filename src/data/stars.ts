import { ASTRO_IMAGES, type AstroImage } from '@/data/astroImages';
export interface StarData {
  name: string;
  turkishName?: string;
  ra: number;  // right ascension in degrees (0 to 360)
  dec: number; // declination in degrees (-90 to +90)
  magnitude: number; // apparent magnitude
  color: string; // hex color
  constellation?: string;
}

export interface ConstellationLine {
  constellation: string;
  turkishName: string;
  lines: [number, number][]; // pairs of star indices to connect
}

// 0: Sirius, 1: Canopus, 2: Arcturus, 3: Vega, 4: Capella, 5: Rigel, 6: Procyon, 7: Achernar, 8: Betelgeuse, 9: Hadar
// 10: Altair, 11: Acrux, 12: Aldebaran, 13: Spica, 14: Antares, 15: Pollux, 16: Fomalhaut, 17: Deneb, 18: Mimosa, 19: Regulus
// 20: Castor, 21: Gacrux, 22: Shaula, 23: Bellatrix, 24: Elnath, 25: Miaplacidus, 26: Alnilam, 27: Alnitak, 28: Alioth, 29: Dubhe
// 30: Mirfak, 31: Wezen, 32: Sargas, 33: Kaus Australis, 34: Avior, 35: Alkaid, 36: Menkalinan, 37: Atria, 38: Alhena, 39: Peacock
// 40: Alsephina, 41: Mirzam, 42: Alphard, 43: Polaris, 44: Hamal, 45: Algieba, 46: Diphda, 47: Mizar, 48: Nunki, 49: Menkent
// 50: Alpheratz, 51: Mirach, 52: Kochab, 53: Saiph, 54: Denebola, 55: Algol, 56: Tiaki, 57: Muhlifain, 58: Aspidiske, 59: Suhail
// 60: Alphecca, 61: Mintaka, 62: Sadr, 63: Eltanin, 64: Schedar, 65: Naos, 66: Almach, 67: Caph, 68: Izar, 69: 
// We will fill a substantial list.

export const stars: StarData[] = [
  { name: "Sirius", turkishName: "Akyıldız", ra: 101.287, dec: -16.716, magnitude: -1.46, color: "#ffffff", constellation: "Canis Major" }, // 0
  { name: "Canopus", ra: 95.987, dec: -52.695, magnitude: -0.74, color: "#ffffdd", constellation: "Carina" }, // 1
  { name: "Arcturus", turkishName: "Arkturus", ra: 213.915, dec: 19.182, magnitude: -0.05, color: "#ffd2a1", constellation: "Bootes" }, // 2
  { name: "Vega", turkishName: "Vega", ra: 279.234, dec: 38.783, magnitude: 0.03, color: "#e3e9ff", constellation: "Lyra" }, // 3
  { name: "Capella", turkishName: "Kapella", ra: 79.172, dec: 45.997, magnitude: 0.08, color: "#ffffdd", constellation: "Auriga" }, // 4
  { name: "Rigel", turkishName: "Rigel", ra: 78.634, dec: -8.201, magnitude: 0.13, color: "#d1dfff", constellation: "Orion" }, // 5
  { name: "Procyon", ra: 114.825, dec: 5.224, magnitude: 0.34, color: "#ffffdd", constellation: "Canis Minor" }, // 6
  { name: "Achernar", ra: 24.428, dec: -57.236, magnitude: 0.46, color: "#d1dfff", constellation: "Eridanus" }, // 7
  { name: "Betelgeuse", turkishName: "İkizlerevi", ra: 88.792, dec: 7.407, magnitude: 0.50, color: "#ffb470", constellation: "Orion" }, // 8
  { name: "Hadar", ra: 210.955, dec: -60.373, magnitude: 0.61, color: "#d1dfff", constellation: "Centaurus" }, // 9
  { name: "Altair", ra: 297.695, dec: 8.868, magnitude: 0.76, color: "#ffffff", constellation: "Aquila" }, // 10
  { name: "Acrux", ra: 186.649, dec: -63.099, magnitude: 0.77, color: "#d1dfff", constellation: "Crux" }, // 11
  { name: "Aldebaran", turkishName: "Aldebaran", ra: 68.980, dec: 16.509, magnitude: 0.86, color: "#ffb470", constellation: "Taurus" }, // 12
  { name: "Spica", ra: 201.298, dec: -11.161, magnitude: 0.98, color: "#d1dfff", constellation: "Virgo" }, // 13
  { name: "Antares", turkishName: "Antares", ra: 247.351, dec: -26.432, magnitude: 1.06, color: "#ff824d", constellation: "Scorpius" }, // 14
  { name: "Pollux", ra: 116.328, dec: 28.026, magnitude: 1.14, color: "#ffb470", constellation: "Gemini" }, // 15
  { name: "Fomalhaut", ra: 344.412, dec: -29.622, magnitude: 1.16, color: "#ffffff", constellation: "Piscis Austrinus" }, // 16
  { name: "Deneb", ra: 310.357, dec: 45.280, magnitude: 1.25, color: "#ffffff", constellation: "Cygnus" }, // 17
  { name: "Mimosa", ra: 191.930, dec: -59.688, magnitude: 1.25, color: "#d1dfff", constellation: "Crux" }, // 18
  { name: "Regulus", turkishName: "Regulus", ra: 152.092, dec: 11.967, magnitude: 1.36, color: "#d1dfff", constellation: "Leo" }, // 19
  { name: "Castor", ra: 113.649, dec: 31.888, magnitude: 1.58, color: "#ffffff", constellation: "Gemini" }, // 20
  { name: "Gacrux", ra: 187.791, dec: -57.113, magnitude: 1.64, color: "#ffb470", constellation: "Crux" }, // 21
  { name: "Shaula", ra: 263.402, dec: -37.103, magnitude: 1.62, color: "#d1dfff", constellation: "Scorpius" }, // 22
  { name: "Bellatrix", ra: 81.282, dec: 6.349, magnitude: 1.64, color: "#d1dfff", constellation: "Orion" }, // 23
  { name: "Elnath", ra: 81.572, dec: 28.607, magnitude: 1.65, color: "#d1dfff", constellation: "Taurus" }, // 24
  { name: "Miaplacidus", ra: 138.300, dec: -69.717, magnitude: 1.69, color: "#ffffff", constellation: "Carina" }, // 25
  { name: "Alnilam", ra: 84.053, dec: -1.201, magnitude: 1.69, color: "#d1dfff", constellation: "Orion" }, // 26
  { name: "Alnitak", ra: 85.189, dec: -1.942, magnitude: 1.77, color: "#d1dfff", constellation: "Orion" }, // 27
  { name: "Alioth", ra: 193.507, dec: 55.959, magnitude: 1.76, color: "#ffffff", constellation: "Ursa Major" }, // 28
  { name: "Dubhe", ra: 165.931, dec: 61.751, magnitude: 1.79, color: "#ffb470", constellation: "Ursa Major" }, // 29
  { name: "Mirfak", ra: 51.080, dec: 49.861, magnitude: 1.79, color: "#ffffdd", constellation: "Perseus" }, // 30
  { name: "Wezen", ra: 107.098, dec: -26.393, magnitude: 1.83, color: "#ffffdd", constellation: "Canis Major" }, // 31
  { name: "Sargas", ra: 264.410, dec: -43.003, magnitude: 1.86, color: "#ffffdd", constellation: "Scorpius" }, // 32
  { name: "Kaus Australis", ra: 276.042, dec: -34.384, magnitude: 1.84, color: "#d1dfff", constellation: "Sagittarius" }, // 33
  { name: "Avior", ra: 125.628, dec: -59.509, magnitude: 1.86, color: "#ffb470", constellation: "Carina" }, // 34
  { name: "Alkaid", ra: 206.885, dec: 49.313, magnitude: 1.85, color: "#d1dfff", constellation: "Ursa Major" }, // 35
  { name: "Menkalinan", ra: 89.882, dec: 44.947, magnitude: 1.90, color: "#ffffff", constellation: "Auriga" }, // 36
  { name: "Atria", ra: 252.166, dec: -69.027, magnitude: 1.91, color: "#ffb470", constellation: "Triangulum Australe" }, // 37
  { name: "Alhena", ra: 99.427, dec: 16.399, magnitude: 1.93, color: "#ffffff", constellation: "Gemini" }, // 38
  { name: "Peacock", ra: 306.411, dec: -56.735, magnitude: 1.94, color: "#d1dfff", constellation: "Pavo" }, // 39
  { name: "Alsephina", ra: 133.903, dec: -54.708, magnitude: 1.93, color: "#ffffff", constellation: "Vela" }, // 40
  { name: "Mirzam", ra: 95.674, dec: -17.955, magnitude: 1.98, color: "#d1dfff", constellation: "Canis Major" }, // 41
  { name: "Alphard", ra: 141.896, dec: -8.658, magnitude: 1.99, color: "#ffb470", constellation: "Hydra" }, // 42
  { name: "Polaris", turkishName: "Kutup Yıldızı", ra: 37.954, dec: 89.264, magnitude: 1.97, color: "#ffffdd", constellation: "Ursa Minor" }, // 43
  { name: "Hamal", ra: 31.793, dec: 23.462, magnitude: 2.01, color: "#ffb470", constellation: "Aries" }, // 44
  { name: "Algieba", ra: 154.993, dec: 19.841, magnitude: 2.08, color: "#ffb470", constellation: "Leo" }, // 45
  { name: "Diphda", ra: 10.897, dec: -17.986, magnitude: 2.04, color: "#ffb470", constellation: "Cetus" }, // 46
  { name: "Mizar", ra: 200.981, dec: 54.925, magnitude: 2.23, color: "#ffffff", constellation: "Ursa Major" }, // 47
  { name: "Nunki", ra: 283.763, dec: -26.296, magnitude: 2.05, color: "#d1dfff", constellation: "Sagittarius" }, // 48
  { name: "Menkent", ra: 211.670, dec: -36.370, magnitude: 2.06, color: "#ffb470", constellation: "Centaurus" }, // 49
  { name: "Alpheratz", ra: 2.096, dec: 29.090, magnitude: 2.07, color: "#d1dfff", constellation: "Andromeda" }, // 50
  { name: "Mirach", ra: 17.432, dec: 35.620, magnitude: 2.05, color: "#ff824d", constellation: "Andromeda" }, // 51
  { name: "Kochab", ra: 222.676, dec: 74.155, magnitude: 2.07, color: "#ffb470", constellation: "Ursa Minor" }, // 52
  { name: "Saiph", ra: 86.939, dec: -9.669, magnitude: 2.07, color: "#d1dfff", constellation: "Orion" }, // 53
  { name: "Denebola", ra: 177.264, dec: 14.572, magnitude: 2.14, color: "#ffffff", constellation: "Leo" }, // 54
  { name: "Algol", ra: 47.042, dec: 40.955, magnitude: 2.09, color: "#d1dfff", constellation: "Perseus" }, // 55
  { name: "Almac", ra: 30.974, dec: 42.329, magnitude: 2.10, color: "#ffb470", constellation: "Andromeda" }, // 56
  { name: "Muhlifain", ra: 184.978, dec: -48.959, magnitude: 2.20, color: "#ffffff", constellation: "Centaurus" }, // 57
  { name: "Aspidiske", ra: 139.387, dec: -59.507, magnitude: 2.21, color: "#ffffdd", constellation: "Carina" }, // 58
  { name: "Suhail", ra: 136.983, dec: -43.432, magnitude: 2.21, color: "#ffb470", constellation: "Vela" }, // 59
  { name: "Alphecca", ra: 233.671, dec: 26.714, magnitude: 2.22, color: "#ffffff", constellation: "Corona Borealis" }, // 60
  { name: "Mintaka", ra: 83.001, dec: -0.299, magnitude: 2.23, color: "#d1dfff", constellation: "Orion" }, // 61
  { name: "Sadr", ra: 305.557, dec: 40.256, magnitude: 2.23, color: "#ffffdd", constellation: "Cygnus" }, // 62
  { name: "Eltanin", ra: 269.151, dec: 51.488, magnitude: 2.24, color: "#ffb470", constellation: "Draco" }, // 63
  { name: "Schedar", ra: 10.127, dec: 56.537, magnitude: 2.24, color: "#ffb470", constellation: "Cassiopeia" }, // 64
  { name: "Naos", ra: 120.896, dec: -40.003, magnitude: 2.21, color: "#d1dfff", constellation: "Puppis" }, // 65
  { name: "Caph", ra: 2.293, dec: 59.149, magnitude: 2.28, color: "#ffffdd", constellation: "Cassiopeia" }, // 66
  { name: "Izar", ra: 221.246, dec: 27.074, magnitude: 2.35, color: "#ffb470", constellation: "Bootes" }, // 67
  { name: "Merak", ra: 165.460, dec: 56.382, magnitude: 2.34, color: "#ffffff", constellation: "Ursa Major" }, // 68
  { name: "Phecda", ra: 178.457, dec: 53.694, magnitude: 2.41, color: "#ffffff", constellation: "Ursa Major" }, // 69
  { name: "Megrez", ra: 183.856, dec: 57.032, magnitude: 3.32, color: "#ffffff", constellation: "Ursa Major" }, // 70
  { name: "Tsih", ra: 14.177, dec: 60.716, magnitude: 2.15, color: "#d1dfff", constellation: "Cassiopeia" }, // 71
  { name: "Ruchbah", ra: 21.113, dec: 60.235, magnitude: 2.66, color: "#ffffff", constellation: "Cassiopeia" }, // 72
  { name: "Segin", ra: 28.598, dec: 63.670, magnitude: 3.37, color: "#d1dfff", constellation: "Cassiopeia" }, // 73
  { name: "Sulafat", ra: 284.606, dec: 32.688, magnitude: 3.25, color: "#d1dfff", constellation: "Lyra" }, // 74
  { name: "Sheliak", ra: 282.529, dec: 33.362, magnitude: 3.52, color: "#d1dfff", constellation: "Lyra" }, // 75
  { name: "Tarazed", ra: 296.565, dec: 10.613, magnitude: 2.72, color: "#ffb470", constellation: "Aquila" }, // 76
  { name: "Alshain", ra: 298.828, dec: 6.406, magnitude: 3.71, color: "#ffffdd", constellation: "Aquila" }, // 77
  { name: "Albireo", ra: 292.680, dec: 27.959, magnitude: 3.05, color: "#ffb470", constellation: "Cygnus" }, // 78
  { name: "Fawaris", ra: 291.564, dec: 44.884, magnitude: 2.89, color: "#d1dfff", constellation: "Cygnus" }, // 79
  { name: "Aljanah", ra: 311.562, dec: 33.968, magnitude: 2.48, color: "#ffb470", constellation: "Cygnus" }, // 80
  { name: "Zosma", ra: 168.527, dec: 20.523, magnitude: 2.56, color: "#ffffff", constellation: "Leo" }, // 81
  { name: "Chort", ra: 168.625, dec: 15.426, magnitude: 3.33, color: "#ffffff", constellation: "Leo" }, // 82
  { name: "Al Niyat", ra: 245.334, dec: -28.214, magnitude: 2.90, color: "#d1dfff", constellation: "Scorpius" }, // 83
  { name: "Dschubba", ra: 240.083, dec: -22.621, magnitude: 2.29, color: "#d1dfff", constellation: "Scorpius" }, // 84
  { name: "Acrab", ra: 241.341, dec: -19.805, magnitude: 2.56, color: "#d1dfff", constellation: "Scorpius" }, // 85
];

export const constellationLines: ConstellationLine[] = [
  {
    constellation: "Ursa Major",
    turkishName: "Büyük Ayı",
    lines: [
      [29, 68], // Dubhe - Merak
      [68, 69], // Merak - Phecda
      [69, 70], // Phecda - Megrez
      [70, 29], // Megrez - Dubhe
      [70, 28], // Megrez - Alioth
      [28, 47], // Alioth - Mizar
      [47, 35], // Mizar - Alkaid
    ]
  },
  {
    constellation: "Ursa Minor",
    turkishName: "Küçük Ayı",
    lines: [
      [43, 52], // Polaris - Kochab (simplified)
    ]
  },
  {
    constellation: "Cassiopeia",
    turkishName: "Kraliçe",
    lines: [
      [66, 64], // Caph - Schedar
      [64, 71], // Schedar - Tsih
      [71, 72], // Tsih - Ruchbah
      [72, 73], // Ruchbah - Segin
    ]
  },
  {
    constellation: "Orion",
    turkishName: "Avcı",
    lines: [
      [8, 23],  // Betelgeuse - Bellatrix
      [23, 26], // Bellatrix - Alnilam
      [26, 61], // Alnilam - Mintaka
      [26, 27], // Alnilam - Alnitak
      [26, 5],  // Alnilam - Rigel
      [27, 53], // Alnitak - Saiph
      [5, 53],  // Rigel - Saiph
      [8, 27],  // Betelgeuse - Alnitak
    ]
  },
  {
    constellation: "Cygnus",
    turkishName: "Kuğu",
    lines: [
      [17, 62], // Deneb - Sadr
      [62, 78], // Sadr - Albireo
      [62, 79], // Sadr - Fawaris
      [62, 80], // Sadr - Aljanah
    ]
  },
  {
    constellation: "Lyra",
    turkishName: "Çalgı",
    lines: [
      [3, 74],  // Vega - Sulafat
      [3, 75],  // Vega - Sheliak
      [74, 75], // Sulafat - Sheliak
    ]
  },
  {
    constellation: "Aquila",
    turkishName: "Kartal",
    lines: [
      [10, 76], // Altair - Tarazed
      [10, 77], // Altair - Alshain
    ]
  },
  {
    constellation: "Taurus",
    turkishName: "Boğa",
    lines: [
      [12, 24], // Aldebaran - Elnath
    ]
  },
  {
    constellation: "Gemini",
    turkishName: "İkizler",
    lines: [
      [15, 20], // Pollux - Castor
      [15, 38], // Pollux - Alhena
    ]
  },
  {
    constellation: "Leo",
    turkishName: "Aslan",
    lines: [
      [19, 45], // Regulus - Algieba
      [45, 81], // Algieba - Zosma
      [81, 54], // Zosma - Denebola
      [54, 82], // Denebola - Chort
      [82, 19], // Chort - Regulus
    ]
  },
  {
    constellation: "Scorpius",
    turkishName: "Akrep",
    lines: [
      [14, 83], // Antares - Al Niyat
      [83, 32], // Al Niyat - Sargas
      [32, 22], // Sargas - Shaula
      [14, 84], // Antares - Dschubba
      [84, 85], // Dschubba - Acrab
    ]
  }
];

export interface DeepSkyObject {
  id: string;
  name: string;
  catalog: string;
  type: 'galaksi' | 'bulutsu' | 'yıldız-kümesi' | 'süpernova-kalıntısı';
  ra: number;
  dec: number;
  magnitude: number;
  description: string;
  distanceLightYears: string;
  color: string;
  emoji: string;
  image?: AstroImage;
}

export const deepSkyObjects: DeepSkyObject[] = [
  {
    id: 'm31',
    name: 'Andromeda Galaksisi',
    catalog: 'Messier 31 / NGC 224',
    type: 'galaksi',
    ra: 10.68,
    dec: 41.27,
    magnitude: 3.44,
    description: 'Samanyolu’na en yakın büyük komşu spiral galaksi. Yaklaşık 1 trilyon yıldız barındırır ve çıplak gözle görülebilen en uzak gökcismidir.',
    distanceLightYears: '2.54 milyon Işık Yılı',
    color: '#00d4ff',
    emoji: '🌀',
    image: ASTRO_IMAGES.m31
  },
  {
    id: 'm42',
    name: 'Büyük Orion Bulutsusu',
    catalog: 'Messier 42 / NGC 1976',
    type: 'bulutsu',
    ra: 83.82,
    dec: -5.39,
    magnitude: 4.0,
    description: 'Gece göğünün en parlak ve en aktif yıldız doğumevlerinden biridir. Merkezindeki Trapezium yıldız kümesi gaz bulutunu aydınlatır.',
    distanceLightYears: '1,344 Işık Yılı',
    color: '#ff2a85',
    emoji: '✨',
    image: ASTRO_IMAGES.m42
  },
  {
    id: 'm45',
    name: 'Pleiades (Yedi Kız Kardeş / Ülker)',
    catalog: 'Messier 45',
    type: 'yıldız-kümesi',
    ra: 56.75,
    dec: 24.11,
    magnitude: 1.6,
    description: 'Boğa takımyıldızında yer alan parıltılı açık yıldız kümesi. Genç mavi dev yıldızlar ve etraflarındaki yansıma bulutsusuyla ünlüdür.',
    distanceLightYears: '444 Işık Yılı',
    color: '#70baff',
    emoji: '💎',
    image: ASTRO_IMAGES.m45
  },
  {
    id: 'm13',
    name: 'Herkül Küresel Kümesi',
    catalog: 'Messier 13 / NGC 6205',
    type: 'yıldız-kümesi',
    ra: 250.42,
    dec: 36.46,
    magnitude: 5.8,
    description: 'Kuzey yarıkürenin en görkemli küresel yıldız kümesi. Yaklaşık 300,000 yaşlı yıldız yerçekimiyle küresel bir top şeklinde kümelenmiştir.',
    distanceLightYears: '22,200 Işık Yılı',
    color: '#ffd700',
    emoji: '🔮',
    image: ASTRO_IMAGES.m13
  },
  {
    id: 'm57',
    name: 'Halka Bulutsusu (Ring Nebula)',
    catalog: 'Messier 57 / NGC 6720',
    type: 'bulutsu',
    ra: 283.4,
    dec: 33.03,
    magnitude: 8.8,
    description: 'Çalgı takımyıldızında ölen bir güneş benzeri yıldızın uzaya fırlattığı iyonize gaz kabuğundan oluşan gezegenimsi bulutsu halkası.',
    distanceLightYears: '2,570 Işık Yılı',
    color: '#00ffcc',
    emoji: '💍',
    image: ASTRO_IMAGES.m57
  },
  {
    id: 'm1',
    name: 'Yengeç Bulutsusu (Crab Nebula)',
    catalog: 'Messier 1 / NGC 1952',
    type: 'süpernova-kalıntısı',
    ra: 83.63,
    dec: 22.01,
    magnitude: 8.4,
    description: 'MS 1054 yılında Çinli astronomlar tarafından gündüz bile görülen tarihi süpernova patlamasının kalıntısı ve merkezindeki dönen pulsar.',
    distanceLightYears: '6,500 Işık Yılı',
    color: '#ff6633',
    emoji: '💥',
    image: ASTRO_IMAGES.m1
  }
];

