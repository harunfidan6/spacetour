import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoPage, Block } from '@/components/doc/InfoPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  path: '/cerezler',
  title: 'Çerez Politikası | SpaceTour TR',
  description: 'SpaceTour TR’de kullanılan çerezler ve tarayıcı depolaması: Google Analytics çerezleri, oturum kimliği ve açılış animasyonu tercihi; nasıl silinir.',
});

export default function Page() {
  return (
    <InfoPage kicker="Yasal" title="Çerez politikası" path="/cerezler" updated="6 Ekim 2026" lede="Çerezler, ziyaret ettiğiniz sitenin tarayıcınıza kaydettiği küçük metin dosyalarıdır. Bu sayfa, sitemizde hangi çerezlerin ve tarayıcı depolama alanlarının kullanıldığını açıklar.">
      <Block title="Kullandığımız çerezler ve depolama alanları">
        <div className="overflow-x-auto">
          <table className="w-full border border-line font-mono text-xs">
            <thead>
              <tr className="bg-ink-2 text-left text-muted"><th className="p-3 font-normal">Ad</th><th className="p-3 font-normal">Sağlayıcı</th><th className="p-3 font-normal">Amaç</th><th className="p-3 font-normal">Süre</th></tr>
            </thead>
            <tbody className="text-paper/85">
              <tr className="border-t border-line"><td className="p-3">_ga, _ga_*</td><td className="p-3">Google Analytics</td><td className="p-3">Ziyaretçileri ayırt ederek anonim kullanım istatistiği üretir</td><td className="p-3">2 yıla kadar</td></tr>
              <tr className="border-t border-line"><td className="p-3">astro_sid</td><td className="p-3">SpaceTour TR (sessionStorage)</td><td className="p-3">Aynı ziyaretteki sayfa görüntülemelerini ilişkilendirir</td><td className="p-3">Sekme kapanana dek</td></tr>
              <tr className="border-t border-line"><td className="p-3">spacetour:intro</td><td className="p-3">SpaceTour TR (sessionStorage)</td><td className="p-3">Açılış animasyonunun aynı ziyarette tekrar oynamasını önler</td><td className="p-3">Sekme kapanana dek</td></tr>
            </tbody>
          </table>
        </div>
        <p>Plausible Analytics ile Vercel Analytics ve Speed Insights çerez kullanmaz.</p>
      </Block>
      <Block title="Çerezleri nasıl yönetirsiniz?">
        <p>Tarayıcınızın ayarlarından çerezleri silebilir veya engelleyebilirsiniz. Google Analytics’i bütün sitelerde devre dışı bırakmak için Google’ın tarayıcı eklentisini kullanabilirsiniz. Çerezleri engellemek sitenin temel işlevlerini etkilemez.</p>
      </Block>
      <Block title="Ayrıntılı bilgi">
        <p>Kişisel verilerin işlenmesi hakkında ayrıntılar için <Link href="/gizlilik" className="text-gold underline underline-offset-2 hover:text-paper">gizlilik ve KVKK aydınlatma metnine</Link> bakın.</p>
      </Block>
    </InfoPage>
  );
}
