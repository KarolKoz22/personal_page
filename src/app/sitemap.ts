import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  return ['', '/education', '/experience', '/projects', '/podcast', '/contact'].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date()
  }));
}
