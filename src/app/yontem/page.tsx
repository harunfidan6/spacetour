import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoPage, Block } from '@/components/doc/InfoPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  path: '/yontem',
  title: 'Yöntem ve Kaynaklar | SpaceTour TR',
  description: 'SpaceTour TR’de gezegen, Güneş ve Ay konumları, doğum haritası, Yükselen burç, gezegen saatleri ve retrolar nasıl hesaplanır; doğruluk ve veri kaynakları.',
});

export default function Page() {
  return (
    <InfoPage kicker="Kurumsal" title="Yöntem ve kaynaklar" path="/yontem" updated="6 Ekim 2026" lede="Sitedeki gökyüzü hesaplamaları tarayıcınızda, yayımlanmış gök mekaniği formülleriyle yapılır. Bu sayfa hangi yöntemleri kullandığımızı, ne kadar doğru olduklarını ve verilerin nereden geldiğini açıklar.">
      <Block title="Gezegen, Güneş ve Ay konumları">
        <p>Gezegen konumları, NASA JPL’nin yayımladığı yaklaşık Kepler yörünge elemanlarıyla; Güneş ve Ay ise kısaltılmış analitik serilerle hesaplanır. Gezegenlerin boylamlarına günün ekinoksuna göre presesyon düzeltmesi eklenir. Bu yöntemler 1800–2050 aralığında gezegenlerde genellikle birkaç yay dakikası, Ay’da yarım dereceden az hata verir. Gözlem planı ve eğitim için yeterlidir; profesyonel efemerislerin yerini tutmaz.</p>
      </Block>
      <Block title="Doğum haritası ve Yükselen burç">
        <p>Doğum anı, Türkiye’de tarih boyunca değişen saat dilimi ve yaz saati uygulamaları dikkate alınarak evrensel zamana çevrilir. Yükselen burç, doğum yerinin enlem ve boylamı ile yerel yıldız zamanından hesaplanır. Evler, Yükselen burçtan başlayan tam burç ev sistemiyle belirlenir. Gezegenler arası açılarda kavuşum, sekstil, kare, üçgen ve karşıtlık için geleneksel orb değerleri kullanılır.</p>
      </Block>
      <Block title="Günlük yorumlar, gezegen saatleri ve retrolar">
        <p>Günlük burç yorumları Ay’ın o günkü gerçek burcuna ve bu burcun her burç için düştüğü güneş evine dayanır. Gezegen saatleri İstanbul için hesaplanan gerçek gün doğumu ve gün batımıyla, Keldani sırasına göre bulunur. Retro dönemleri gezegenin yer merkezli boylamının azalmaya başladığı ve yeniden artmaya döndüğü istasyon anları aranarak hesaplanır; gölge dönemleri bu derecelerin geçildiği tarihlerdir.</p>
      </Block>
      <Block title="Gök olayları ve canlı veriler">
        <p>Tutulma, meteor yağmuru ve kavuşum tarihleri NASA ve Uluslararası Meteor Örgütü gibi kaynakların yayımladığı tahminlere dayanır. ISS’in konumu ve uzay havası gibi canlı veriler herkese açık bilimsel servislerden okunur.</p>
      </Block>
      <Block title="Görseller">
        <p>Görseller NASA, ESA, ESO, USGS ve Wikimedia Commons arşivlerinden, kamu malı veya Creative Commons lisanslarıyla kullanılır. Her görselin altında kaynak ve lisans bilgisi yer alır. Burç sayfalarındaki gravürler Sidney Hall’un 1824 tarihli Urania’s Mirror atlasındandır.</p>
      </Block>
      <Block title="Hata mı buldunuz?">
        <p>Bir hesaplamada ya da bilgide hata görürseniz <Link href="/iletisim" className="text-gold underline underline-offset-2 hover:text-paper">bize bildirin</Link>; inceleyip düzeltiriz.</p>
      </Block>
    </InfoPage>
  );
}
