export interface Constellation {
  id: string;
  name: string;
  latinName: string;
  description: string;
  bestMonth: string;
  mainStars: number;
  mythology: string;
  emoji: string;
}

export const constellations: Constellation[] = [
  {
    id: "buyuk-ayi",
    name: "Büyük Ayı",
    latinName: "Ursa Major",
    description: "Kuzey yarımküredeki en tanınmış takımyıldızlardan biridir.",
    bestMonth: "Nisan",
    mainStars: 7,
    mythology: "Yunan mitolojisinde kıskanç Hera tarafından ayıya dönüştürülen Callisto'yu temsil eder.",
    emoji: "🐻"
  },
  {
    id: "kucuk-ayi",
    name: "Küçük Ayı",
    latinName: "Ursa Minor",
    description: "Kuzey Kutup Yıldızı'nı (Polaris) içeren önemli bir takımyıldız.",
    bestMonth: "Haziran",
    mainStars: 7,
    mythology: "Büyük Ayı (Callisto) efsanesindeki oğlu Arcas'ı temsil ettiği düşünülür.",
    emoji: "🐾"
  },
  {
    id: "avci",
    name: "Avcı",
    latinName: "Orion",
    description: "Gece gökyüzündeki en belirgin ve güzel takımyıldızlardan biridir.",
    bestMonth: "Ocak",
    mainStars: 7,
    mythology: "Dev bir avcı olan Orion'u ve onun destansı hikayesini anlatır.",
    emoji: "🏹"
  },
  {
    id: "kugu",
    name: "Kuğu",
    latinName: "Cygnus",
    description: "Samanyolu üzerinde yer alan çarpıcı bir takımyıldız.",
    bestMonth: "Eylül",
    mainStars: 9,
    mythology: "Tanrı Zeus'un Sparta kraliçesi Leda'yı etkilemek için girdiği kuğu formunu sembolize eder.",
    emoji: "🦢"
  },
  {
    id: "akrep",
    name: "Akrep",
    latinName: "Scorpius",
    description: "Gökyüzünde gerçekten bir akrebe benzeyen devasa takımyıldız.",
    bestMonth: "Temmuz",
    mainStars: 15,
    mythology: "Avcı Orion'u öldürmesi için toprak ana Gaia tarafından gönderilen dev akrebi temsil eder.",
    emoji: "🦂"
  },
  {
    id: "aslan",
    name: "Aslan",
    latinName: "Leo",
    description: "Kuzey gökküresinde yer alan zodyak takımyıldızlarından biri.",
    bestMonth: "Nisan",
    mainStars: 9,
    mythology: "Herkül'ün (Herakles) on iki görevinden ilki olan Nemea Aslanı'nı temsil eder.",
    emoji: "🦁"
  },
  {
    id: "boga",
    name: "Boğa",
    latinName: "Taurus",
    description: "Kış gökyüzünde belirgin olan, ünlü Ülker (Pleiades) yıldız kümesini içeren takımyıldız.",
    bestMonth: "Ocak",
    mainStars: 19,
    mythology: "Zeus'un Prenses Europa'yı kaçırmak için büründüğü beyaz boğa şeklini temsil eder.",
    emoji: "🐂"
  },
  {
    id: "ikizler",
    name: "İkizler",
    latinName: "Gemini",
    description: "Castor ve Pollux adlı iki parlak yıldızı ile tanınan zodyak takımyıldızı.",
    bestMonth: "Şubat",
    mainStars: 17,
    mythology: "Yunan mitolojisindeki ayrılmaz ikiz kardeşler Castor ve Pollux'u temsil eder.",
    emoji: "👯"
  },
  {
    id: "kralice",
    name: "Kraliçe",
    latinName: "Cassiopeia",
    description: "Gökyüzünde 'W' veya 'M' harfi çizen belirgin bir takımyıldız.",
    bestMonth: "Kasım",
    mainStars: 5,
    mythology: "Güzelliğiyle övünen ve Poseidon'u kızdıran Etiyopya kraliçesi Cassiopeia'yı temsil eder.",
    emoji: "👑"
  },
  {
    id: "andromeda",
    name: "Andromeda",
    latinName: "Andromeda",
    description: "Bize en yakın büyük galaksi olan Andromeda Galaksisi'ni barındıran takımyıldız.",
    bestMonth: "Kasım",
    mainStars: 14,
    mythology: "Kraliçe Cassiopeia'nın kızı olan ve deniz canavarına kurban edilecekken Perseus tarafından kurtarılan prenses.",
    emoji: "👸"
  },
  {
    id: "kanatli-at",
    name: "Kanatlı At",
    latinName: "Pegasus",
    description: "Sonbahar gökyüzünde büyük bir kare oluşturan dev takımyıldız.",
    bestMonth: "Ekim",
    mainStars: 15,
    mythology: "Medusa'nın kanından doğan ünlü uçan at Pegasus'u temsil eder.",
    emoji: "🐎"
  },
  {
    id: "calgi",
    name: "Çalgı",
    latinName: "Lyra",
    description: "Yaz Üçgeni'nin en parlak yıldızı Vega'yı içeren küçük takımyıldız.",
    bestMonth: "Ağustos",
    mainStars: 5,
    mythology: "Orpheus'un büyülü lirini temsil eder; müziğiyle tüm canlıları ve doğayı büyüleyebilirdi.",
    emoji: "🎵"
  }
];
