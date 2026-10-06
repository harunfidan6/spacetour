import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoPage, Block, CONTACT_EMAIL } from '@/components/doc/InfoPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  path: '/gizlilik',
  title: 'Gizlilik Politikası ve KVKK Aydınlatma Metni | SpaceTour TR',
  description: 'SpaceTour TR hangi verileri işler: anonim ziyaret istatistikleri, analiz araçları ve tarayıcıda kalan hesaplamalar. KVKK kapsamındaki haklarınız ve başvuru yolu.',
});

export default function Page() {
  return (
    <InfoPage kicker="Yasal" title="Gizlilik ve KVKK aydınlatma metni" path="/gizlilik" updated="6 Ekim 2026" lede="Bu metin, spacetour.com.tr adresini ziyaret ettiğinizde hangi verilerin, hangi amaçla işlendiğini ve 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamındaki haklarınızı açıklar.">
      <Block title="Veri sorumlusu">
        <p>Veri sorumlusu SpaceTour TR’dir (spacetour.com.tr). Başvurularınız için: <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold underline underline-offset-2 hover:text-paper">{CONTACT_EMAIL}</a>.</p>
      </Block>
      <Block title="Hesaplayıcılara girdiğiniz bilgiler">
        <p>Doğum haritası, sinastri, numeroloji, yıldız falı ve benzeri araçlara yazdığınız ad, doğum tarihi, saat ve şehir bilgileri yalnızca tarayıcınızda işlenir. Bu bilgiler sunucularımıza gönderilmez ve saklanmaz.</p>
      </Block>
      <Block title="Ziyaret istatistikleri">
        <p>Sitenin nasıl kullanıldığını anlamak ve geliştirmek için her sayfa görüntülemesinde şu bilgileri kaydederiz: ziyaret edilen sayfa ve başlığı, geldiğiniz site, IP adresinizden türetilen ülke ve şehir, cihaz türü, tarayıcı, işletim sistemi ve ekran boyutu. IP adresinizin kendisini saklamayız; onun yerine kısa bir özet değeri (hash) tutarız. Aynı ziyaret içindeki sayfaları ilişkilendirmek için tarayıcı sekmenizde rastgele bir oturum kimliği oluşturulur ve sekme kapanınca silinir.</p>
        <p>Bunlara ek olarak şu üçüncü taraf analiz araçlarını kullanıyoruz:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Google Analytics 4 (Google LLC): sayfa görüntüleme ve etkileşim istatistikleri; tarayıcınıza çerez yerleştirir. Ayrıntılar <Link href="/cerezler" className="text-gold underline underline-offset-2 hover:text-paper">çerez politikasında</Link>.</li>
          <li>Plausible Analytics: çerez kullanmayan, kişisel veri saklamayan ziyaret sayacı.</li>
          <li>Vercel Analytics ve Speed Insights: çerezsiz ziyaret ve sayfa hızı ölçümü.</li>
        </ul>
      </Block>
      <Block title="İşleme amacı ve hukuki sebep">
        <p>Veriler; sitenin güvenli ve doğru çalışması, hataların bulunması, içeriklerin ve sayfa hızının iyileştirilmesi amacıyla, KVKK m.5/2-f uyarınca meşru menfaatimiz kapsamında işlenir. Çerez kullanan analiz araçları için hukuki sebep açık rızanızdır.</p>
      </Block>
      <Block title="Aktarım">
        <p>Site Vercel Inc. altyapısında barındırılır; analiz hizmetlerini Google LLC, Plausible Insights ve Vercel Inc. sağlar. Bu hizmet sağlayıcıların sunucuları yurt dışında bulunabileceğinden veriler KVKK m.9 çerçevesinde yurt dışına aktarılabilir. Verilerinizi satmıyor, reklam amacıyla üçüncü kişilerle paylaşmıyoruz.</p>
      </Block>
      <Block title="Saklama süresi">
        <p>Ziyaret istatistikleri, amaca ulaşmak için gereken süre boyunca toplu ve anonimleştirilmiş özetler halinde saklanır. Üçüncü taraf araçların saklama süreleri kendi politikalarına tabidir.</p>
      </Block>
      <Block title="Haklarınız (KVKK m.11)">
        <p>Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, amacına uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, KVKK’da öngörülen şartlarla silinmesini veya yok edilmesini isteme, bu işlemlerin aktarılan kişilere bildirilmesini isteme, otomatik sistemlerle analiz sonucu aleyhinize bir sonuca itiraz etme ve kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.</p>
        <p>Başvurularınızı <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold underline underline-offset-2 hover:text-paper">{CONTACT_EMAIL}</a> adresine iletebilirsiniz; başvurular en geç 30 gün içinde yanıtlanır.</p>
      </Block>
    </InfoPage>
  );
}
