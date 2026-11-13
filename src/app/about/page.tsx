import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Cpu, GitBranch, Layers, Repeat, ShieldCheck } from 'lucide-react';

import { MotionReveal } from '@/components/motion-reveal';
import { PageContainer } from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getDictionary } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';
import { seoMetadata } from '@/lib/seo';

export const generateMetadata = seoMetadata('about');

// One icon per principle, in the order they appear in the dictionary.
const principleIcons = [Repeat, ShieldCheck, GitBranch, Layers, Cpu];

export default async function AboutPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale).about;

  return (
    <PageContainer className="space-y-10 md:space-y-14">
      <MotionReveal revealKey="about-title">
        <div className="space-y-3">
          <div className="vision-prose experience-prose max-w-2xl font-display text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl">
            <h1>{t.title}</h1>
          </div>
          <p className="max-w-2xl text-muted-foreground">{t.description}</p>
        </div>
      </MotionReveal>

      <MotionReveal delay={0.05} revealKey="about-bio">
        <Card>
          <CardContent className="grid gap-6 pt-6 md:grid-cols-[200px_1fr] md:items-center">
            <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-2xl border border-border/70 md:w-full">
              <Image
                src={siteConfig.voiceIntro.imageSrc}
                alt={siteConfig.author}
                fill
                sizes="200px"
                className="object-cover object-top"
              />
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-xl font-semibold">{t.bioTitle}</h2>
              {t.bio.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </MotionReveal>

      <MotionReveal delay={0.08} revealKey="about-principles">
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight">{t.principlesTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.principles.map((principle, index) => {
              const Icon = principleIcons[index] ?? Layers;
              return (
                <Card key={principle.title} className="h-full">
                  <CardHeader className="space-y-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg leading-snug">{principle.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">{principle.text}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </MotionReveal>

      <MotionReveal delay={0.1} revealKey="about-stack">
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight">{t.stackTitle}</h2>
          <Card>
            <CardContent className="divide-y divide-border/60 pt-2">
              {t.stack.map((group) => (
                <div key={group.area} className="grid gap-2 py-3 sm:grid-cols-[200px_1fr] sm:items-center">
                  <p className="text-sm font-medium">{group.area}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Badge key={item} variant="secondary" className="rounded-full font-normal">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </MotionReveal>

      <MotionReveal delay={0.12} revealKey="about-beyond">
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight">{t.beyondTitle}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {t.beyond.map((item) => (
              <Card key={item.title} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                  <Link
                    href={item.href}
                    className="group/section-link inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 px-3 py-1.5 text-sm font-medium text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-accent/45"
                  >
                    {item.cta}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/section-link:-translate-y-0.5 group-hover/section-link:translate-x-0.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </MotionReveal>
    </PageContainer>
  );
}
