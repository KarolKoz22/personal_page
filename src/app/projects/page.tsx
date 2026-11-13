import { ArrowUpRight, Server } from 'lucide-react';

import { MotionReveal } from '@/components/motion-reveal';
import { PageContainer } from '@/components/layout/page-container';
import { ArgoCdLivePanel } from '@/components/projects/argocd-live-panel';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getDictionary } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';

export const metadata = {
  title: 'Projects'
};

export default function ProjectsPage() {
  const locale = getServerLocale();
  const dictionary = getDictionary(locale);
  const t = dictionary.projects;

  return (
    <PageContainer className="space-y-8 md:space-y-10">
      <div className="space-y-3">
        <div className="vision-prose experience-prose max-w-2xl font-display text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl">
          <h1>{t.title}</h1>
        </div>
        <p className="max-w-2xl text-muted-foreground">{t.description}</p>
      </div>

      <MotionReveal revealKey="projects-homelab">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl sm:text-2xl">{t.homelab.name}</CardTitle>
              </div>
              <a
                href={siteConfig.homelab.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="group/section-link inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 px-3 py-1.5 text-sm font-medium text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-accent/45"
              >
                {t.source}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/section-link:translate-x-0.5 group-hover/section-link:-translate-y-0.5" />
              </a>
            </div>
            <p className="max-w-3xl text-muted-foreground">{t.homelab.summary}</p>
            <div className="flex flex-wrap gap-2">
              {siteConfig.homelab.stack.map((tech) => (
                <Badge key={tech} variant="secondary" className="rounded-full">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {t.homelab.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <ArgoCdLivePanel initial={null} />
          </CardContent>
        </Card>
      </MotionReveal>
    </PageContainer>
  );
}
