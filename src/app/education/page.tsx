import Image from 'next/image';

import { MotionReveal } from '@/components/motion-reveal';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getMdxContent, localizedMdxFile } from '@/lib/content';
import { getDictionary } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';
import { seoMetadata } from '@/lib/seo';

export const generateMetadata = seoMetadata('education');

export default async function EducationPage() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);
  const { content } = await getMdxContent(localizedMdxFile('education', locale));

  return (
    <PageContainer className="space-y-8 md:space-y-10">
      <MotionReveal revealKey="education-title">
        <div className="vision-prose experience-prose mb-8 max-w-2xl space-y-2 font-display text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl">
          <h1>{dictionary.education.title}</h1>
        </div>
      </MotionReveal>
      <MotionReveal delay={0.08} revealKey="education-gallery">
        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-12">
            <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-muted/30 shadow-[0_22px_38px_-28px_hsl(var(--primary)/0.42)] md:col-span-7">
              <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(120%_110%_at_8%_0%,hsl(var(--primary)/0.2),transparent_58%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative aspect-[3/4] min-h-[420px] md:min-h-[560px]">
                <Image
                  src={siteConfig.educationGallery.thesisPhoto.src}
                  alt={siteConfig.educationGallery.thesisPhoto.alt}
                  fill
                  className="object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>

            <div className="grid gap-4 md:col-span-5 md:grid-rows-2">
              <div className="group relative min-h-[250px] overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-[0_20px_34px_-28px_hsl(var(--primary)/0.38)] md:min-h-[300px]">
                <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(120%_110%_at_8%_0%,hsl(var(--primary)/0.18),transparent_58%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                <Image
                  src={siteConfig.educationGallery.aghLogo.src}
                  alt={siteConfig.educationGallery.aghLogo.alt}
                  fill
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03] sm:p-4 md:p-5"
                />
              </div>

              <div className="group relative min-h-[250px] overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-[0_20px_34px_-28px_hsl(var(--primary)/0.38)] md:min-h-[300px]">
                <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(120%_110%_at_8%_0%,hsl(var(--primary)/0.18),transparent_58%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                <Image
                  src={siteConfig.educationGallery.pwLogo.src}
                  alt={siteConfig.educationGallery.pwLogo.alt}
                  fill
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03] sm:p-4 md:p-5"
                />
              </div>
            </div>
          </div>
        </section>
      </MotionReveal>

      <MotionReveal delay={0.14} revealKey="education-content">
        <Card>
          <CardContent className="prose-custom vision-prose experience-prose pt-6">{content}</CardContent>
        </Card>
      </MotionReveal>
    </PageContainer>
  );
}
