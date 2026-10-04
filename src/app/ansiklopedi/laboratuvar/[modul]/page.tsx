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
  return getSection('ansiklopedi').modules.map((m) => ({ modul: m.slug }));
}

export async function generateMetadata(props: PageProps<'/ansiklopedi/laboratuvar/[modul]'>): Promise<Metadata> {
  const { modul } = await props.params;
  return buildModuleMetadata('ansiklopedi', modul);
}

export default async function ModulePage(props: PageProps<'/ansiklopedi/laboratuvar/[modul]'>) {
  const { modul } = await props.params;
  const found = findModule('ansiklopedi', modul);
  if (!found) notFound();

  const webAppJson = getWebApplicationJsonLd('ansiklopedi', modul);
  const breadcrumbJson = getBreadcrumbJsonLd([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Ansiklopedi', url: '/ansiklopedi' },
    { name: 'Laboratuvar', url: '/ansiklopedi/laboratuvar' },
    { name: found.module.short, url: `/ansiklopedi/laboratuvar/${modul}` },
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
      <ModuleScreen sectionId="ansiklopedi" slug={modul} />
    </>
  );
}
