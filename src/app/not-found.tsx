import Link from 'next/link';

import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';

export default async function NotFound() {
  const locale = await getServerLocale();
  const dictionary = getDictionary(locale);

  return (
    <PageContainer className="space-y-4">
      <h1 className="text-3xl font-semibold">{dictionary.notFound.title}</h1>
      <p className="text-muted-foreground">{dictionary.notFound.description}</p>
      <Button asChild>
        <Link href="/">{dictionary.notFound.back}</Link>
      </Button>
    </PageContainer>
  );
}
