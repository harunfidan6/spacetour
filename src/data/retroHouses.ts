/**
 * Retronun güneş burcuna göre düştüğü ev (tam burç ev sistemi) için yorumlar. Merkür ve Venüs
 * retroları en çok aranan dönemler olduğundan her ev için elle yazıldı; diğer gezegenler ev
 * alanıyla gezegenin konularını birleştirir.
 */
import { HOUSE_AREA } from './natalTexts';

export const MERCURY_RETRO_HOUSE = [
  'Kendini nasıl ifade ettiğini, ilk izlenimini ve kişisel planlarını gözden geçirdiğin bir dönem. Söylediklerin yanlış anlaşılabilir; önemli konuşmalarda ne demek istediğini bir kez daha açıkla.',
  'Bütçe, faturalar ve ödemelerde hata payı artıyor; hesap özetlerini ve abonelikleri kontrol etmek için iyi bir zaman. Büyük harcamaları retro sonrasına bırakmak akıllıca.',
  'Merkür kendi alanında: mesajlar, yazışmalar, kısa yolculuklar ve kardeş ilişkilerindeki aksaklıklar en çok burada hissedilir. Göndermeden önce bir kez daha oku.',
  'Evdeki onarımlar, taşınma planları ve aile içi konuşmalar gündemde. Eski bir aile meselesi yeniden açılabilir; çözmek için sakin bir zemin ara.',
  'Eski bir aşk ya da yarım kalmış bir hobi geri dönebilir. Flörtte yanlış anlaşılmalara açık bir dönem; yaratıcı işlerini düzeltmek ve yeniden yazmak içinse verimli.',
  'Günlük iş akışında, cihazlarda ve randevularda aksaklıklar olabilir. Rutinlerini sadeleştirmek ve ertelediğin sağlık kontrollerini planlamak için uygun.',
  'Partnerinle ya da iş ortaklarınla iletişimde netlik gerekiyor. Sözleşmeleri imzalamadan önce iki kez oku; eski bir ortak ya da sevgili yeniden ortaya çıkabilir.',
  'Kredi, borç, vergi ve ortak hesaplarda belgeleri gözden geçir. Derin konuşmalar, uzun süre ertelenmiş bir yüzleşmeyi gündeme getirebilir.',
  'Uzak yolculuklarda rötar, bilet ve vize aksaklıklarına hazırlıklı ol. Yarım kalan bir eğitimi tamamlamak ya da eski bir fikri yeniden düşünmek içinse iyi bir dönem.',
  'İş yerinde yöneticilerle iletişim ve kariyer planların gözden geçiriliyor. Yeni bir işe başvurmaktan çok özgeçmişini ve projelerini güncellemek verimli olur.',
  'Arkadaş grupları, sosyal medya ve topluluk projelerinde yanlış anlaşılmalar olabilir. Uzun zamandır görmediğin bir arkadaşla yeniden bağ kurmak için güzel bir zaman.',
  'İçe dönme, dinlenme ve geçmişi sindirme zamanı. Rüyalar ve sezgiler daha belirgin; yalnız kalıp düşüncelerini yazmak iyi gelir.',
];

export const VENUS_RETRO_HOUSE = [
  'Görünüşünde, tarzında ve kendini sevme biçiminde değişiklik isteği artıyor. Saç, estetik işlem gibi büyük kararları retro bitene kadar ertelemek gelenekte önerilir.',
  'Para ve değerler gözden geçiriliyor: harcama alışkanlıklarını ve gerçekten neye değer verdiğini sorgulamak için iyi. Lüks alımları ertele.',
  'Yakın çevrenle ilişkilerde eski kırgınlıklar konuşulabilir. İçten bir mesaj, uzun süredir kopuk bir bağı onarabilir.',
  'Ev düzeni, dekorasyon ve aile içindeki sevgi dengesi gündemde. Evi değiştirmeden önce seni neyin gerçekten huzurlu kıldığını düşün.',
  'Aşk hayatı Venüs retrosunun en çok hissedildiği alan: eski sevgililer geri dönebilir. Yeni bir ilişkiye hızla atılmak yerine ne istediğini netleştir.',
  'İş yerindeki ilişkiler ve günlük alışkanlıklar gözden geçiriliyor. Beden bakımı ve sağlıklı rutinler için sabırlı adımlar at.',
  'İlişkinin dengesi sorgulanıyor. Evlilik ya da nişan gibi büyük adımları retro sonrasına bırakmak gelenekte önerilir; mevcut ilişkide açık konuşmalar yakınlaştırır.',
  'Ortak para, miras ve yakınlık konuları derinleşiyor. Ortak harcamalarda şeffaflık, ilişkide güveni artırır.',
  'Uzak bir yer ya da yabancı biriyle ilgili duygular yeniden canlanabilir. İnançlarını ve ilişkide aradığın anlamı gözden geçir.',
  'İş hayatında imajın ve iş ilişkilerin gözden geçiriliyor. Görünürlük isteyen yeni girişimleri ertele, mevcut bağlantılarını güçlendir.',
  'Arkadaşlıklarda kimin gerçekten yanında olduğu netleşiyor. Eski bir dostla barışmak ya da tükenmiş bir bağı bırakmak için uygun.',
  'Gizli duygular ve geçmiş ilişkilerin izleri yüzeye çıkıyor. Kendine şefkat göstermek ve eski yaraları sindirmek için sessiz bir dönem.',
];

/** `house` 1–12; `about`: gezegenin konuları ("enerji, motivasyon, rekabet ve öfke") */
export function retroHouseText(planetSlug: string, planetName: string, about: string, house: number): string {
  if (planetSlug === 'merkur') return MERCURY_RETRO_HOUSE[house - 1];
  if (planetSlug === 'venus') return VENUS_RETRO_HOUSE[house - 1];
  return `${planetName} retrosu, ${HOUSE_AREA[house - 1].text} alanda ${about} konularını yavaşlatıp gözden geçirmeni istiyor.`;
}

/** Gezegenlerin yönettiği burçlar (dailySky burç sırası, 0 = Koç); klasik yöneticiler dahil */
export const RULED_SIGNS: Record<string, number[]> = {
  merkur: [2, 5],
  venus: [1, 6],
  mars: [0, 7],
  jupiter: [8, 11],
  saturn: [9, 10],
};
