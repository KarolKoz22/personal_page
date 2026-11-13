import { Badge } from '@/components/ui/badge';
import { MotionReveal } from '@/components/motion-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type TimelineItem = {
  title: string;
  company?: string;
  period: string;
  location?: string;
  summary: string;
  highlights?: string[];
  tags?: string[];
};

export function Timeline({
  items,
  remoteLabel = 'Remote'
}: {
  items: TimelineItem[];
  remoteLabel?: string;
}) {
  const tagStyle = (cardIndex: number, tagIndex: number) =>
    ({
      '--tag-hue': `${(cardIndex * 53 + tagIndex * 31) % 360}`
    }) as React.CSSProperties;

  return (
    <ol className="relative border-l border-border pl-5 sm:ml-3 sm:pl-8">
      {items.map((item, index) => (
        <li key={`${item.title}-${item.period}`} className="relative mb-6 sm:mb-8">
          <span className="absolute -left-[1.45rem] top-6 h-3 w-3 rounded-full bg-primary sm:-left-[2.15rem]" />
          <MotionReveal
            delay={index * 0.05}
            direction={index % 2 === 0 ? 'left' : 'right'}
            revealKey={`timeline-${item.title}-${item.period}`}
          >
            <div className="vision-prose">
              <Card>
                <CardHeader>
                  <p className="text-sm text-muted-foreground">{item.period}</p>
                  <CardTitle className="timeline-role-title text-lg">{item.title}</CardTitle>
                  <p className="timeline-meta text-sm text-muted-foreground">
                    {item.company ? `${item.company} • ` : ''}
                    {item.location ?? remoteLabel}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                  {item.highlights?.length ? (
                    <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                      {item.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-2.5">
                          <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden="true" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {item.tags?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, tagIndex) => (
                        <Badge key={tag} variant="secondary" className="timeline-tech-pill" style={tagStyle(index, tagIndex)}>
                          <span className="timeline-tech-dot" aria-hidden="true" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </MotionReveal>
        </li>
      ))}
    </ol>
  );
}
