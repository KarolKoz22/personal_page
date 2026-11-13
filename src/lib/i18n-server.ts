import { cookies } from 'next/headers';

import { defaultLocale, isLocale, type Locale } from '@/lib/i18n';

export async function getServerLocale(): Promise<Locale> {
  const cookieLocale = (await cookies()).get('site_locale')?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;
  return defaultLocale;
}
