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
  return getSection('harita').modules.map((m) => ({ modul: m.slug }));
}

export async function generateMetadata(props: PageProps<'/harita/[modul]'>): Promise<Metadata> {
  const { modul } = await props.params;
  return buildModuleMetadata('harita', modul);
}

export default async function ModulePage(props: PageProps<'/harita/[modul]'>) {
  const { modul } = await props.params;
  const found = findModule('harita', modul);
  if (!found) notFound();

  const webAppJson = getWebApplicationJsonLd('harita', modul);
  const breadcrumbJson = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Gök Haritası', url: '/harita' },
    { name: found.module.short, url: `/harita/${modul}` },
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
      <ModuleScreen sectionId="harita" slug={modul} />
    </>
  );
}
