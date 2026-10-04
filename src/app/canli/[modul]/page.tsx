import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ModuleScreen } from '@/components/doc/ModuleScreen';
import { findModule, getSection } from '@/data/sections';
import {
  buildModuleMetadata,
  getWebApplicationJsonLd,
  getBreadcrumbJsonLd,
} from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return getSection('canli').modules.map((m) => ({ modul: m.slug }));
}

export async function generateMetadata(props: PageProps<'/canli/[modul]'>): Promise<Metadata> {
  const { modul } = await props.params;
  return buildModuleMetadata('canli', modul);
}

export default async function ModulePage(props: PageProps<'/canli/[modul]'>) {
  const { modul } = await props.params;
  const found = findModule('canli', modul);
  if (!found) notFound();

  const webAppJson = getWebApplicationJsonLd('canli', modul);
  const breadcrumbJson = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Canlı Gökyüzü', url: '/canli' },
    { name: found.module.short, url: `/canli/${modul}` },
  ]);

  return (
    <>
      {webAppJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJson) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }}
      />
      <ModuleScreen sectionId="canli" slug={modul} />
    </>
  );
}
