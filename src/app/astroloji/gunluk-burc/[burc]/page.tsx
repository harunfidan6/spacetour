import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { ChapterHero } from '@/components/doc/ChapterHero';
import { ZodiacGlyph } from '@/components/ui/CosmicGlyphs';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import { DOC_IMAGES, type DocImageKey } from '@/data/docImages';
import { dailyReading } from '@/lib/astrology/dailyHoroscope';
import { BASE_URL, SITE_NAME, getArticleJsonLd, getBreadcrumbJsonLd } from '@/lib/seo';
import { nameCase } from '@/lib/text';
import { ShareButtons } from '@/components/ui/ShareButtons';

// Her burcun bugünkü yorumu sunucuda üretilir; sayfa yarım saatte bir yenilenir (gece yarısından sonra yeni gün)
export const revalidate = 1800;
export const dynamicParams = false;

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ burc: s.id }));
}

const todayLabel = (d: Date) => d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long', timeZone: 'Europe/Istanbul' });
const isoDay = (d: Date) => d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Istanbul' });

export async function generateMetadata(props: PageProps<'/astroloji/gunluk-burc/[burc]'>): Promise<Metadata> {
  const { burc } = await props.params;
  const s = ZODIAC_SIGNS.find((x) => x.id === burc);
  if (!s) return { title: 'Burç bulunamadı', robots: { index: false } };
  const now = new Date();
  const r = dailyReading(s.id, now);
  const url = `${BASE_URL}/astroloji/gunluk-burc/${s.id}`;
  const title = `${s.name} Burcu Günlük Yorum · Bugün | SpaceTour TR`;
  const description = `${todayLabel(now)}: Ay ${r.moonIn}, ${nameCase(s.name, 'ilgi', '’')} ${r.house}. evinde (${r.houseArea}). ${s.name} burcu için bugünün aşk, kariyer ve sağlık yorumu.`.slice(0, 158);
  // Günün yorumunu gösteren paylaşım kartı (opengraph-image.tsx)
  const image = `${BASE_URL}/astroloji/gunluk-burc/${s.id}/opengraph-image`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, locale: 'tr_TR', type: 'article', images: [{ url: image, width: 1200, height: 630, alt: `${s.name} burcu` }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

function Score({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-paper/75">
        <span>{label}</span>
        <span className="font-semibold tabular-nums text-paper">%{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full bg-ink-3">
        <div className="h-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export default async function GunlukBurcPage(props: PageProps<'/astroloji/gunluk-burc/[burc]'>) {
  const { burc } = await props.params;
  const index = ZODIAC_SIGNS.findIndex((x) => x.id === burc);
  if (index === -1) notFound();
  const s = ZODIAC_SIGNS[index];
  const now = new Date();
  const r = dailyReading(s.id, now);
  const day = todayLabel(now);

  const sections: { k: string; title: string; text: string }[] = [
    { k: 'Genel enerji', title: `Bugün ${s.name} burcu için öne çıkan`, text: r.energy },
    { k: 'Aşk ve ilişkiler', title: 'Kalbin gündemi', text: r.love },
    { k: 'Kariyer ve para', title: 'İş ve kararlar', text: r.career },
    { k: 'Sağlık ve iyi oluş', title: 'Bedenine iyi bak', text: r.wellbeing },
    { k: 'Sosyal hayat', title: 'Çevrenle bağın', text: r.social },
  ];

  const articleJsonLd = getArticleJsonLd({
    path: `/astroloji/gunluk-burc/${s.id}`,
    headline: `${s.name} burcu günlük yorum · ${day}`,
    image: `${BASE_URL}/astroloji/gunluk-burc/${s.id}/opengraph-image`,
    datePublished: isoDay(now),
  });
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Astroloji', url: '/astroloji' },
    { name: 'Günlük burç falı', url: '/astroloji/gunluk-burc' },
    { name: `${s.name} burcu bugün`, url: `/astroloji/gunluk-burc/${s.id}` },
  ]);

  return (
    // data-generated: yönetici panelindeki günlük içerik denetimi sayfanın üretildiği anı buradan okur
    <div style={{ '--page-accent': 'var(--gold)' } as CSSProperties} className="relative" data-generated={now.toISOString()}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <ChapterHero
        variant="band"
        chapter={`04 · Günlük · ${String(index + 1).padStart(2, '0')}`}
        section={`Günlük burç yorumu · ${day}`}
        headline={[`${s.name} burcu`, 'bugün']}
        lede={`Ay bugün ${r.moonIn}; ${nameCase(s.name, 'ilgi', '’')} güneş haritasında ${r.house}. evi, yani ${r.houseArea} alanını aydınlatıyor. Günün tonu: ${r.tone}.`}
        accent="var(--gold)"
        image={DOC_IMAGES[`sign-${s.id}` as DocImageKey]}
        crumbs={[
          { label: 'Ana sayfa', href: '/' },
          { label: 'Astroloji', href: '/astroloji' },
          { label: 'Günlük burç', href: '/astroloji/gunluk-burc' },
          { label: s.name },
        ]}
        meta={[
          { k: 'Ay', v: r.moonSignName },
          { k: 'Ev', v: `${r.house}. ev` },
          { k: 'Ay evresi', v: r.phaseName },
          { k: 'Günün yöneticisi', v: r.dayRuler },
        ]}
      />

      <section aria-label={`${s.name} burcu günlük yorum`} className="px-[var(--gutter)] py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            {/* Tarihli bağlantı: WhatsApp gibi uygulamalar önizlemeyi adrese göre önbellekler, her gün yeni kart görünsün */}
            <ShareButtons
              url={`${BASE_URL}/astroloji/gunluk-burc/${s.id}?tarih=${isoDay(now)}`}
              title={`${s.name} burcu bugün · ${day}`}
              text={`${s.name} burcu bugün (${day}): ${r.headline}`}
              label="Yorumu paylaş"
            />
            {(r.moonChange || r.mercuryRetro) && (
              <div className="space-y-2 border-l-2 border-gold bg-ink-2 p-4 text-[15px] leading-relaxed text-paper/85">
                {r.moonChange && <p>{r.moonChange}</p>}
                {r.mercuryRetro && <p>Merkür bugün geri harekette: yazışmalarda ve sözleşmelerde iki kez kontrol et.</p>}
              </div>
            )}
            {sections.map((sec) => (
              <article key={sec.k} className="border-b border-line pb-8">
                <span className="text-sm font-medium text-gold">{sec.k}</span>
                <h2 className="doc-title mt-2 text-2xl text-paper">{sec.title}</h2>
                <p className="mt-3 text-base leading-relaxed text-paper/85">{sec.text}</p>
              </article>
            ))}
            <article>
              <span className="text-sm font-medium text-gold">Ay’ın havası</span>
              <h2 className="doc-title mt-2 text-2xl text-paper">Ay {r.moonIn}</h2>
              <p className="mt-3 text-base leading-relaxed text-paper/85">{r.moonMood} {r.moonFocus}</p>
            </article>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="border border-line bg-ink-2 p-5">
              <div className="flex items-center gap-3">
                <ZodiacGlyph sign={s.id} size={32} className="text-gold" />
                <div>
                  <div className="doc-title text-xl text-paper">{s.name}</div>
                  <div className="mt-0.5 text-sm text-paper/70">{s.dates} · {s.element}</div>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <Score label="Aşk" value={r.scores.love} color="var(--rose, #f43f5e)" />
                <Score label="Kariyer" value={r.scores.career} color="var(--gold)" />
                <Score label="Enerji" value={r.scores.vitality} color="var(--lime, #a3e635)" />
                <Score label="Şans" value={r.scores.luck} color="var(--primary, #38bdf8)" />
              </div>
            </div>
            <div className="border border-line bg-ink-2 p-5 leading-relaxed">
              <span className="text-sm font-medium text-gold">Günün tavsiyesi</span>
              <p className="mt-2 text-[15px] text-paper/85">{r.tip}</p>
              <span className="mt-5 block text-sm font-medium text-gold">Uğurlu saatler</span>
              <p className="mt-2 text-[15px] tabular-nums text-paper/85">{r.luckyHours}</p>
            </div>
            <div className="space-y-2 text-sm">
              <Link href={`/astroloji/burclar/${s.id}`} className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">
                {s.name} burcunun özellikleri <ArrowUpRight size={14} />
              </Link>
              <Link href={`/astroloji/burclar/${s.id}#uyum`} className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">
                {s.name} burcunun uyumları <ArrowUpRight size={14} />
              </Link>
              <Link href="/astroloji/dogum-haritasi" className="flex items-center justify-between border border-line p-3 text-paper/85 hover:border-gold hover:text-gold">
                Doğum haritanı çıkar <ArrowUpRight size={14} />
              </Link>
            </div>
          </aside>
        </div>

        <nav aria-label="Diğer burçların günlük yorumu" className="mx-auto mt-16 max-w-6xl border-t border-line pt-8">
          <h2 className="doc-title text-xl text-paper sm:text-2xl">Diğer burçlar bugün</h2>
          {/* 11 burç: boş hücre gri kutu bırakmasın diye her bağlantı kendi çerçevesinde */}
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {ZODIAC_SIGNS.filter((x) => x.id !== s.id).map((x) => (
              <li key={x.id}>
                <Link href={`/astroloji/gunluk-burc/${x.id}`} className="flex items-center gap-2 border border-line p-3 text-sm text-paper/85 hover:border-gold hover:text-gold">
                  <ZodiacGlyph sign={x.id} size={16} className="text-gold/80" /> {x.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </div>
  );
}
