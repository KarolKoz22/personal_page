import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
import { getPodcastEpisodesSafe } from '@/lib/podcast';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { episodes } = await getPodcastEpisodesSafe();
  const base = siteConfig.url;

  const staticRoutes = ['', '/education', '/experience', '/projects', '/podcast', '/contact'].map(
    (route) => ({
      url: `${base}${route}`,
      lastModified: new Date()
    })
  );

  const episodeRoutes = episodes.map((episode) => ({
    url: `${base}/podcast/${episode.slug}`,
    lastModified: new Date(episode.date)
  }));

  return [...staticRoutes, ...episodeRoutes];
}
