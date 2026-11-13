import Image from 'next/image';
import Link from 'next/link';
import type { ComponentType } from 'react';
import { Instagram, Linkedin, Mail } from 'lucide-react';

import { MotionReveal } from '@/components/motion-reveal';
import { PageContainer } from '@/components/layout/page-container';
import { SocialIcon } from '@/components/ui/brand-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getDictionary } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';
import { seoMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';

export const generateMetadata = seoMetadata('contact');

type ContactLink = {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  socialIconName?: string;
};

export default async function ContactPage() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);

  const links: ContactLink[] = [
    { label: dictionary.contact.email, href: `mailto:${siteConfig.email}`, icon: Mail },
    { label: 'TikTok', href: siteConfig.social.tiktok, socialIconName: 'tiktok' },
    { label: 'LinkedIn', href: siteConfig.social.linkedin, icon: Linkedin },
    { label: 'Instagram', href: siteConfig.social.instagram, icon: Instagram }
  ];

  const toneClassByLabel: Record<string, string> = {
    [dictionary.contact.email]: 'social-tone-mail',
    TikTok: 'social-tone-tiktok',
    LinkedIn: 'social-tone-linkedin',
    Instagram: 'social-tone-instagram'
  };

  return (
    <PageContainer className="space-y-6">
      <MotionReveal revealKey="contact-title">
        <div className="vision-prose experience-prose mb-8 max-w-2xl space-y-2 font-display text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl">
          <h1>{dictionary.contact.title}</h1>
        </div>
      </MotionReveal>

      <div className="space-y-4">
        <MotionReveal delay={0.08} revealKey="contact-hero">
          <Card className="overflow-hidden">
            <div className="relative min-h-[360px] md:min-h-[460px]">
              <Image
                src={siteConfig.contactShowcase.imageSrc}
                alt=""
                fill
                aria-hidden="true"
                className="object-cover blur-md scale-105 opacity-28"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/20 to-background/35" />
              <Image
                src={siteConfig.contactShowcase.imageSrc}
                alt={siteConfig.contactShowcase.imageAlt}
                fill
                className="object-contain object-center p-4 md:p-6"
              />
            </div>
          </Card>
        </MotionReveal>

        <MotionReveal delay={0.14} revealKey="contact-links">
          <Card>
            <CardHeader>
              <CardTitle className="podcast-section-title text-xl sm:text-2xl">
                {dictionary.contact.getInTouch}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {links.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('mailto') ? undefined : '_blank'}
                    rel={item.href.startsWith('mailto') ? undefined : 'noreferrer'}
                    className={cn(
                      'footer-social-link group flex items-center justify-between rounded-xl border p-4 text-sm transition-all duration-200 hover:-translate-y-0.5',
                      toneClassByLabel[item.label] ?? 'social-tone-github'
                    )}
                  >
                    <span className="inline-flex items-center gap-2">
                      {item.socialIconName ? (
                        <SocialIcon
                          name={item.socialIconName}
                          className="footer-social-icon h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110"
                        />
                      ) : Icon ? (
                        <Icon className="footer-social-icon h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110" />
                      ) : null}
                      {item.label}
                    </span>
                    <span className="rounded-full border border-border/65 bg-background/65 px-2.5 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                      {dictionary.contact.open}
                    </span>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </MotionReveal>
      </div>
    </PageContainer>
  );
}
