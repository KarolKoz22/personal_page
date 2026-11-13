import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { notFound } from 'next/navigation';

import { PageContainer } from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { formatDate } from '@/lib/date';
import { getDictionary } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';
import { getPodcastEpisodesSafe } from '@/lib/podcast';

type Params = {
  slug: string;
};

// Pre-build only the newest episodes; older ones render on first request
// (dynamicParams defaults to true) instead of bloating every build.
const PREBUILT_EPISODES = 50;

export async function generateStaticParams() {
  const { episodes } = await getPodcastEpisodesSafe();
  return episodes.slice(0, PREBUILT_EPISODES).map((episode) => ({ slug: episode.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { episodes } = await getPodcastEpisodesSafe();
  const episode = episodes.find((item) => item.slug === params.slug);

  if (!episode) {
    return { title: 'Episode' };
  }

  return {
    title: episode.title,
    description: episode.description
  };
}

export default async function EpisodePage({ params }: { params: Params }) {
  const locale = getServerLocale();
  const dictionary = getDictionary(locale);

  const { episodes } = await getPodcastEpisodesSafe();
  const episode = episodes.find((item) => item.slug === params.slug);

  if (!episode) notFound();

  return (
    <PageContainer className="space-y-8">
      <div className="space-y-3">
        <Badge variant="secondary">{dictionary.podcast.detail.badge}</Badge>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">{episode.title}</h1>
        <p className="text-sm text-muted-foreground">
          {formatDate(episode.date)} {episode.duration ? `• ${episode.duration}` : ''}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 text-muted-foreground">{episode.description}</CardContent>
      </Card>

      <section className="flex flex-wrap gap-3">
        {episode.audioUrl ? (
          <Link
            href={episode.audioUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
          >
            {dictionary.podcast.detail.listenAudio}{' '}
            <ExternalLink className="ml-2 inline h-3.5 w-3.5" />
          </Link>
        ) : null}
        {episode.episodeUrl ? (
          <Link
            href={episode.episodeUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
          >
            {dictionary.podcast.detail.episodePage}{' '}
            <ExternalLink className="ml-2 inline h-3.5 w-3.5" />
          </Link>
        ) : null}
        <Link
          href={siteConfig.social.spotify}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
        >
          Spotify <ExternalLink className="ml-2 inline h-3.5 w-3.5" />
        </Link>
      </section>

      {episode.spotifyEmbed ? (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">{dictionary.podcast.detail.spotifyEmbed}</h2>
          <iframe
            src={episode.spotifyEmbed}
            width="100%"
            height="232"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify player"
            className="rounded-md border"
          />
        </div>
      ) : null}

      {episode.youtubeEmbed ? (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">{dictionary.podcast.detail.youtubeEmbed}</h2>
          <div className="aspect-video overflow-hidden rounded-md border">
            <iframe
              src={episode.youtubeEmbed}
              title="YouTube player"
              className="h-full w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
}
