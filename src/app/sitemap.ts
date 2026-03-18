import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://proofpulse.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['sv', 'en'];
  const publicPages = [''];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of publicPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1 : 0.8,
        alternates: {
          languages: {
            sv: `${BASE_URL}/sv${page}`,
            en: `${BASE_URL}/en${page}`,
          },
        },
      });
    }
  }

  return entries;
}
