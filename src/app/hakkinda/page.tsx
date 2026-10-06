import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoPage, Block } from '@/components/doc/InfoPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  path: '/hakkinda',
  title: 'Hakkında: SpaceTour TR Nedir? | SpaceTour TR',
  description: 'SpaceTour TR, Türkçe ve ücretsiz bir etkileşimli uzay atlası: 3D Güneş Sistemi, gök küresi, gök olayları takvimi, ansiklopedi, gözlemevi ve astroloji.',
});

export default function Page() {
  return (
    <InfoPage kicker="Kurumsal" title="Hakkında" path="/hakkinda" updated="6 Ekim 2026" lede="SpaceTour TR, gökyüzünü Türkçe, ücretsiz ve etkileşimli olarak keşfetmek için hazırlanmış bağımsız bir uzay atlasıdır.">
      <Block title="Ne yapıyoruz?">
        <p>Sitede yedi bölüm var: gök haritası ve 3D gök küresi, gök olayları takvimi, gezegen ansiklopedisi ve fizik laboratuvarları, çok dalgaboylu gözlemevi, canlı gökyüzü (ISS, uzay havası), 3D Güneş Sistemi yolculuğu ve astroloji. Amacımız, okul kitaplarındaki kavramları dokunup döndürülebilen modellere dönüştürmek ve gökyüzüne bakmayı herkes için kolaylaştırmak.</p>
      </Block>
      <Block title="Veriler nereden geliyor?">
        <p>Gezegen, Güneş ve Ay konumları tarayıcıda gök mekaniği formülleriyle hesaplanır; ayrıntılar <Link href="/yontem" className="text-gold underline underline-offset-2 hover:text-paper">yöntem ve kaynaklar</Link> sayfasında. Görseller NASA, ESA, ESO ve Wikimedia Commons gibi açık lisanslı arşivlerden alınır ve her görselin altında kaynağı belirtilir. ISS konumu ve uzay havası gibi canlı veriler herkese açık bilimsel servislerden okunur.</p>
      </Block>
      <Block title="Astroloji bölümü hakkında">
        <p>Astroloji, binlerce yıllık bir kültürel gelenek olarak sunulur; bilimsel bir yöntem değildir. Bu bölümdeki konumlar gerçek gökyüzünden hesaplanır, yorumlar ise geleneksel astrolojinin kurallarına dayanır ve eğlence ile kendini tanıma amacı taşır. Sağlık, hukuk veya finans kararları için uzman görüşünün yerini tutmaz.</p>
      </Block>
      <Block title="Bize ulaşın">
        <p>Hata bildirimi, düzeltme önerisi veya iş birliği için <Link href="/iletisim" className="text-gold underline underline-offset-2 hover:text-paper">iletişim</Link> sayfasını kullanabilirsiniz.</p>
      </Block>
    </InfoPage>
  );
}
