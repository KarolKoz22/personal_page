import Link from 'next/link';
import { ArrowUpRight, BriefcaseBusiness, FolderGit2, GraduationCap, MicVocal } from 'lucide-react';

import { MotionReveal } from '@/components/motion-reveal';
import { VoiceIntro, TranscriptLine } from '@/components/home/voice-intro';
import { PageContainer } from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getJsonContent } from '@/lib/content';
import { getDictionary } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';

export default async function HomePage() {
  const locale = getServerLocale();
  const dictionary = getDictionary(locale);
  const transcript = await getJsonContent<TranscriptLine[]>(
    locale === 'en' ? 'intro-transcript.en.json' : 'intro-transcript.pl.json'
  );
  const audioSrc = locale === 'en' ? '/audio/intro-en.mp3' : '/audio/intro-pl.mp3';

  const highlights = [
    {
      title: dictionary.nav.education,
      href: '/education',
      icon: GraduationCap,
      description: dictionary.home.highlights.education
    },
    {
      title: dictionary.nav.experience,
      href: '/experience',
      icon: BriefcaseBusiness,
      description: dictionary.home.highlights.career
    },
    {
      title: dictionary.nav.projects,
      href: '/projects',
      icon: FolderGit2,
      description: dictionary.home.highlights.projects
    },
    {
      title: dictionary.nav.podcast,
      href: '/podcast',
      icon: MicVocal,
      description: dictionary.home.highlights.podcast
    }
  ];

  return (
    <PageContainer className="space-y-16">
      <section className="space-y-6 sm:space-y-8">
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
          {siteConfig.role}
        </Badge>
        <div className="vision-prose font-display text-balance max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-6xl">
          <h1>{dictionary.home.title}</h1>
        </div>
        <div className="vision-prose text-balance max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>{dictionary.home.description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-primary to-primary/85 shadow-[0_14px_24px_-18px_hsl(var(--primary)/0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:from-primary/95 hover:to-primary sm:w-auto"
          >
            <Link href="/experience">{dictionary.home.viewExperience}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full border-border/75 bg-background/75 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-accent/45 hover:shadow-[0_12px_24px_-18px_hsl(var(--primary)/0.75)] sm:w-auto"
          >
            <Link href="/contact">{dictionary.home.contact}</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item, index) => {
          const Icon = item.icon;
          return (
            <MotionReveal key={item.title} delay={index * 0.05} revealKey={`home-highlight-${item.title}`}>
              <Card className="h-full">
                <CardHeader>
                  <Icon className="mb-4 h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 text-sm text-muted-foreground">{item.description}</p>
                  <Link
                    href={item.href}
                    className="group/section-link inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 px-3 py-1.5 text-sm font-medium text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-accent/45 hover:shadow-[0_12px_24px_-18px_hsl(var(--primary)/0.8)]"
                  >
                    {dictionary.home.openSection}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/section-link:translate-x-0.5 group-hover/section-link:-translate-y-0.5" />
                  </Link>
                </CardContent>
              </Card>
            </MotionReveal>
          );
        })}
      </section>

      <MotionReveal delay={0.15} revealKey="home-voice-intro">
        <VoiceIntro
          imageSrc={siteConfig.voiceIntro.imageSrc}
          imageAlt={siteConfig.voiceIntro.imageAlt}
          audioSrc={audioSrc}
          transcript={transcript}
          title={dictionary.voice.title}
          placeholderText={dictionary.voice.placeholder}
          playLabel={dictionary.voice.play}
          pauseLabel={dictionary.voice.pause}
          restartLabel={dictionary.voice.restart}
        />
      </MotionReveal>
    </PageContainer>
  );
}
