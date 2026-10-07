import type { Metadata } from 'next';
import Link from 'next/link';
import { InfoPage, Block } from '@/components/doc/InfoPage';
import { CookiePreferenceButton } from '@/components/analytics/CookieConsent';
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
          <table className="w-full min-w-[36rem] border border-line text-sm">
            <thead>
              <tr className="bg-ink-2 text-left text-paper/70"><th className="p-3 font-medium">Ad</th><th className="p-3 font-medium">Sağlayıcı</th><th className="p-3 font-medium">Amaç</th><th className="p-3 font-medium">Süre</th></tr>
            </thead>
            <tbody className="align-top text-paper/85">
              <tr className="border-t border-line"><td className="p-3 font-mono text-[13px]">_ga, _ga_*</td><td className="p-3">Google Analytics</td><td className="p-3">Ziyaretçileri ayırt ederek kullanım istatistiği üretir; yalnızca onay verirseniz yerleşir</td><td className="p-3">2 yıla kadar</td></tr>
              <tr className="border-t border-line"><td className="p-3 font-mono text-[13px]">spacetour:cerez</td><td className="p-3">SpaceTour TR (localStorage)</td><td className="p-3">Çerez tercihinizi hatırlar</td><td className="p-3">Siz silene dek</td></tr>
              <tr className="border-t border-line"><td className="p-3 font-mono text-[13px]">astro_sid</td><td className="p-3">SpaceTour TR (sessionStorage)</td><td className="p-3">Aynı ziyaretteki sayfa görüntülemelerini ilişkilendirir</td><td className="p-3">Sekme kapanana dek</td></tr>
              <tr className="border-t border-line"><td className="p-3 font-mono text-[13px]">spacetour:intro</td><td className="p-3">SpaceTour TR (sessionStorage)</td><td className="p-3">Açılış animasyonunun aynı ziyarette tekrar oynamasını önler</td><td className="p-3">Sekme kapanana dek</td></tr>
            </tbody>
          </table>
        </div>
        <p>Plausible Analytics ile Vercel Analytics ve Speed Insights çerez kullanmaz.</p>
      </Block>
      <Block title="Çerezleri nasıl yönetirsiniz?">
        <p>Google Analytics çerezleri yalnızca sitenin altındaki çerez şeridinde “Kabul et” derseniz kullanılır. Tercihinizi istediğiniz an değiştirebilirsiniz; reddettiğinizde mevcut Analytics çerezleri silinir.</p>
        <div><CookiePreferenceButton /></div>
        <p>Tarayıcınızın ayarlarından çerezleri silebilir veya engelleyebilirsiniz. Google Analytics’i bütün sitelerde devre dışı bırakmak için Google’ın tarayıcı eklentisini kullanabilirsiniz. Çerezleri engellemek sitenin temel işlevlerini etkilemez.</p>
      </Block>
      <Block title="Ayrıntılı bilgi">
        <p>Kişisel verilerin işlenmesi hakkında ayrıntılar için <Link href="/gizlilik" className="text-gold underline underline-offset-2 hover:text-paper">gizlilik ve KVKK aydınlatma metnine</Link> bakın.</p>
      </Block>
    </InfoPage>
  );
}
