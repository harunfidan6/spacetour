import type { MetadataRoute } from 'next';
import { SECTIONS, moduleHref } from '@/data/sections';
import { planets } from '@/data/planets';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import { BASE_URL } from '@/lib/seo';

// Günlük içerikli sayfaların değişiklik tarihi her gün yenilensin
export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // 1. Core Hub & Landmark Pages
  const coreHubs: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/takvim`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/canli`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/astroloji`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/harita`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ansiklopedi`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/gozlemevi`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/yolculuk`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ansiklopedi/laboratuvar`,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
  ];

  // 2. Collections across all sections (e.g. /astroloji/burclar, /ansiklopedi/gok-cisimleri)
  const collectionRoutes: MetadataRoute.Sitemap = SECTIONS.flatMap((section) =>
    (section.collections ?? []).map((col) => ({
      url: `${BASE_URL}${col.href}`,
      changeFrequency: 'weekly' as MetadataRoute.Sitemap[number]['changeFrequency'],
      priority: 0.88,
    }))
  );

  // 3. All Section Modules & Instruments dynamically (All 10 astrology tools, labs, iss, telescopes, etc.)
  const moduleRoutes: MetadataRoute.Sitemap = SECTIONS.flatMap((section) =>
    section.modules.map((mod) => {
      const path = moduleHref(section, mod);
      // High-intent tools get higher priority and daily/weekly refresh
      const isDailyTool =
        path.includes('iss') ||
        path.includes('uzay-havasi') ||
        path.includes('bu-gece') ||
        path.includes('gunluk-burc') ||
        path.includes('transitler') ||
        path.includes('ay-evreleri') ||
        path.includes('tarot');

      return {
        url: `${BASE_URL}${path}`,
        ...(isDailyTool ? { lastModified: currentDate } : {}),
        changeFrequency: (isDailyTool ? 'daily' : 'weekly') as MetadataRoute.Sitemap[number]['changeFrequency'],
        priority: isDailyTool ? 0.92 : 0.85,
      };
    })
  );

  // 4. All 11 Celestial Bodies (/ansiklopedi/[id])
  const planetRoutes: MetadataRoute.Sitemap = planets.map((body) => ({
    url: `${BASE_URL}/ansiklopedi/${body.id}`,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  // 5. All 12 Zodiac Archetypes (/astroloji/burclar/[burc])
  const zodiacRoutes: MetadataRoute.Sitemap = ZODIAC_SIGNS.map((sign) => ({
    url: `${BASE_URL}/astroloji/burclar/${sign.id}`,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // Deduplicate URLs in case of overlaps
  const allRoutes = [...coreHubs, ...collectionRoutes, ...moduleRoutes, ...planetRoutes, ...zodiacRoutes];
  const seenUrls = new Set<string>();
  const uniqueRoutes: MetadataRoute.Sitemap = [];

  for (const item of allRoutes) {
    if (!seenUrls.has(item.url)) {
      seenUrls.add(item.url);
      uniqueRoutes.push(item);
    }
  }

  return uniqueRoutes;
}
