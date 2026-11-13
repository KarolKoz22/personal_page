import { PageContainer } from '@/components/layout/page-container';
import { SectionHeading } from '@/components/sections/section-heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { getDictionary } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';
import { seoMetadata } from '@/lib/seo';

export const generateMetadata = seoMetadata('about');

export default async function AboutPage() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);

  const bio = dictionary.about.bioText
    .replace('{author}', siteConfig.author)
    .replace('{role}', siteConfig.role)
    .replace('{location}', siteConfig.location);

  return (
    <PageContainer className="space-y-10">
      <SectionHeading title={dictionary.about.title} description={dictionary.about.description} />

      <Card>
        <CardHeader>
          <CardTitle>{dictionary.about.bioTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>{bio}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.about.valuesTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {dictionary.about.values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{dictionary.about.stackTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {dictionary.about.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
