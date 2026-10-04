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
  return getSection('gozlemevi').modules.map((m) => ({ modul: m.slug }));
}

export async function generateMetadata(props: PageProps<'/gozlemevi/[modul]'>): Promise<Metadata> {
  const { modul } = await props.params;
  return buildModuleMetadata('gozlemevi', modul);
}

export default async function ModulePage(props: PageProps<'/gozlemevi/[modul]'>) {
  const { modul } = await props.params;
  const found = findModule('gozlemevi', modul);
  if (!found) notFound();

  const webAppJson = getWebApplicationJsonLd('gozlemevi', modul);
  const breadcrumbJson = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Gözlemevi', url: '/gozlemevi' },
    { name: found.module.short, url: `/gozlemevi/${modul}` },
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
      <ModuleScreen sectionId="gozlemevi" slug={modul} />
    </>
  );
}
