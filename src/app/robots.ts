import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://proofpulse.dev';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/embed/', '/dashboard', '/testimonials', '/widgets', '/campaigns', '/settings'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
