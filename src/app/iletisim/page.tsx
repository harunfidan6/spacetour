import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoPage, Block, CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/components/doc/InfoPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  path: '/iletisim',
  title: 'İletişim | SpaceTour TR',
  description: 'SpaceTour TR ile iletişim: hata bildirimi, içerik düzeltmesi, iş birliği ve basın talepleri için e-posta adresimiz.',
});

export default function Page() {
  return (
    <InfoPage kicker="Kurumsal" title="İletişim" path="/iletisim" updated="6 Ekim 2026" lede="Hata bildirimleri, düzeltme önerileri, iş birliği ve basın talepleri için bize e-postayla ulaşabilirsiniz.">
      <Block title="E-posta">
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-lg text-gold hover:underline">{CONTACT_EMAIL}</a>
        </p>
        <p>Genellikle birkaç iş günü içinde yanıt veririz.</p>
      </Block>
      <Block title="Instagram">
        <p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener me" className="font-mono text-lg text-gold hover:underline">@{INSTAGRAM_HANDLE}</a>
        </p>
        <p>Gök olayı duyuruları, günlük burç kartları ve kısa videolar.</p>
      </Block>
      <Block title="Hata veya düzeltme bildirirken">
        <p>Sorunun bulunduğu sayfanın adresini, kullandığınız cihaz ve tarayıcıyı ve mümkünse bir ekran görüntüsünü eklemeniz işimizi çok kolaylaştırır. Bilimsel bir bilgide hata gördüğünüzde kaynağını da paylaşırsanız hemen inceleriz.</p>
      </Block>
      <Block title="Kişisel verileriniz">
        <p>KVKK kapsamındaki başvurularınızı da aynı adrese iletebilirsiniz. Ayrıntılar için <Link href="/gizlilik" className="text-gold underline underline-offset-2 hover:text-paper">gizlilik ve KVKK</Link> metnine bakın.</p>
      </Block>
    </InfoPage>
  );
}
