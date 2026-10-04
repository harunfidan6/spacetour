import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AstrologyModuleScreen } from '@/components/astrology/AstrologyModuleScreen';
import { findModule, getSection } from '@/data/sections';
import {
  buildModuleMetadata,
  getWebApplicationJsonLd,
  getBreadcrumbJsonLd,
} from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return getSection('astroloji').modules.map((m) => ({ modul: m.slug }));
}

export async function generateMetadata(props: PageProps<'/astroloji/[modul]'>): Promise<Metadata> {
  const { modul } = await props.params;
  return buildModuleMetadata('astroloji', modul);
}

export default async function ModulePage(props: PageProps<'/astroloji/[modul]'>) {
  const { modul } = await props.params;
  const found = findModule('astroloji', modul);
  if (!found) notFound();

  const webAppJson = getWebApplicationJsonLd('astroloji', modul);
  const breadcrumbJson = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Astroloji', url: '/astroloji' },
    { name: found.module.short, url: `/astroloji/${modul}` },
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
      <AstrologyModuleScreen slug={modul} />
    </>
  );
}
