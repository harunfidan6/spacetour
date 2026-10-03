import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ModuleScreen } from '@/components/doc/ModuleScreen';
import { findModule, getSection } from '@/data/sections';

export const dynamicParams = false;

export function generateStaticParams() {
  return getSection('harita').modules.map((m) => ({ modul: m.slug }));
}

export async function generateMetadata(props: PageProps<'/harita/[modul]'>): Promise<Metadata> {
  const { modul } = await props.params;
  const found = findModule('harita', modul);
  if (!found) return {};
  return { title: `${found.module.short} · ${found.section.title}`, description: found.module.blurb };
}

export default async function ModulePage(props: PageProps<'/harita/[modul]'>) {
  const { modul } = await props.params;
  if (!findModule('harita', modul)) notFound();
  return <ModuleScreen sectionId="harita" slug={modul} />;
}
