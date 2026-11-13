import Image from 'next/image';
import Link from 'next/link';
import { AudioLines, ExternalLink, MicVocal, Radio } from 'lucide-react';

import { MotionReveal } from '@/components/motion-reveal';
import { PageContainer } from '@/components/layout/page-container';
import { SocialIcon } from '@/components/ui/brand-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getJsonContent, getMdxContent, localizedMdxFile } from '@/lib/content';
import { getDictionary } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';
import { seoMetadata } from '@/lib/seo';
import { getYouTubeUploadsSafe, type YouTubeVideo } from '@/lib/youtube';
import { cn } from '@/lib/utils';

export const generateMetadata = seoMetadata('podcast');

type PodcastFrontmatter = {
  platforms?: { label: string; url: string }[];
  featuredEpisodes?: { title: string; url: string; description?: string }[];
};

type PodcastEpisode = { title: string; url: string };
type PodcastShort = { title?: string; url: string };

type ShortsData = {
  title?: string;
  url: string;
}[];

const socialToneClass: Record<string, string> = {
  github: 'social-tone-github',
  linkedin: 'social-tone-linkedin',
  youtube: 'social-tone-youtube',
  spotify: 'social-tone-spotify',
  instagram: 'social-tone-instagram',
  tiktok: 'social-tone-tiktok',
  x: 'social-tone-x'
};

function toEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v') || parsed.pathname.split('/').pop();
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return '';
  }
  return '';
}

export default async function PodcastPage() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);

  const [{ content, frontmatter }, shortsFallback, liveYoutube] = await Promise.all([
    getMdxContent<PodcastFrontmatter>(localizedMdxFile('podcast', locale)),
    getJsonContent<ShortsData>('shorts.json'),
    getYouTubeUploadsSafe()
  ]);

  const featuredEpisodes: PodcastEpisode[] =
    liveYoutube.liveAvailable
      ? liveYoutube.featured.map((video: YouTubeVideo) => ({
          title: video.title,
          url: video.url
        }))
      : (frontmatter.featuredEpisodes ?? []).map((episode) => ({
          title: episode.title,
          url: episode.url
        }));

  const shorts: PodcastShort[] =
    liveYoutube.liveAvailable
      ? liveYoutube.shorts.map((video: YouTubeVideo) => ({
          title: video.title,
          url: video.url
        }))
      : shortsFallback;

  return (
    <PageContainer className="space-y-12">
      <MotionReveal revealKey="podcast-title">
        <div className="vision-prose experience-prose mb-8 max-w-2xl space-y-2 font-display text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl">
          <h1>{dictionary.podcast.title}</h1>
        </div>
      </MotionReveal>

      <MotionReveal delay={0.08} revealKey="podcast-hero">
        <Card className="overflow-hidden">
          <div className="grid items-stretch md:grid-cols-[280px_1fr]">
            <div className="relative min-h-[260px]">
              <Image
                src={siteConfig.voiceIntro.imageSrc}
                alt=""
                fill
                aria-hidden="true"
                className="object-cover blur-md scale-105 opacity-26"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/20 to-background/35" />
              <Image
                src={siteConfig.voiceIntro.imageSrc}
                alt={siteConfig.voiceIntro.imageAlt}
                fill
                className="object-contain object-[center_18%] p-4 sm:p-6"
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Host</p>
              <h2 className="font-display text-2xl font-semibold tracking-tight">{siteConfig.author}</h2>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                  <MicVocal className="h-3.5 w-3.5 text-primary" />
                  Podcast
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                  <Radio className="h-3.5 w-3.5 text-primary" />
                  Stories
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                  <AudioLines className="h-3.5 w-3.5 text-primary" />
                  Insights
                </span>
              </div>
            </div>
          </div>
        </Card>
      </MotionReveal>

      <MotionReveal delay={0.14} revealKey="podcast-content">
        <Card>
          <CardContent className="prose-custom vision-prose experience-prose pt-6">{content}</CardContent>
        </Card>
      </MotionReveal>

      {featuredEpisodes.length ? (
        <MotionReveal delay={0.2} revealKey="podcast-episodes">
          <section className="space-y-5">
            <h2 className="podcast-section-title text-2xl font-semibold">{dictionary.podcast.episodes}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {featuredEpisodes.map((episode: PodcastEpisode) => (
                <Card key={episode.url}>
                  <CardHeader>
                    <CardTitle className="text-base">{episode.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="podcast-video-frame aspect-video overflow-hidden rounded-md border">
                      <iframe
                        src={toEmbedUrl(episode.url)}
                        title={episode.title}
                        className="h-full w-full"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <Link
                      href={episode.url}
                      target="_blank"
                      rel="noreferrer"
                      className="podcast-watch-btn inline-flex items-center gap-2 text-sm font-medium"
                    >
                      {dictionary.podcast.watchOnYoutube}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </MotionReveal>
      ) : null}

      {shorts.length ? (
        <MotionReveal delay={0.26} revealKey="podcast-shorts">
          <section className="space-y-5">
            <h2 className="podcast-section-title text-2xl font-semibold">{dictionary.podcast.shorts}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {shorts.map((short: PodcastShort) => (
                <div key={short.url} className="podcast-video-frame aspect-video overflow-hidden rounded-xl border">
                  <iframe
                    src={toEmbedUrl(short.url)}
                    title={short.title ?? 'YouTube Short'}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </section>
        </MotionReveal>
      ) : null}

      <MotionReveal delay={0.32} revealKey="podcast-platforms">
        <section className="space-y-4">
          <h2 className="podcast-section-title text-2xl font-semibold">{dictionary.podcast.platforms}</h2>
          <div className="flex flex-wrap gap-3">
            {(frontmatter.platforms ?? []).map((platform) => (
              <Link
                key={platform.label}
                href={platform.url}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  'footer-social-link group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-200',
                  socialToneClass[platform.label.toLowerCase()] ?? 'social-tone-github'
                )}
              >
                <SocialIcon
                  name={platform.label.toLowerCase()}
                  className="footer-social-icon transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110"
                />
                {platform.label}
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </section>
      </MotionReveal>
    </PageContainer>
  );
}
