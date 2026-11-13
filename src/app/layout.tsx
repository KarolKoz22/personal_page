import type { Metadata } from 'next';
import { Manrope, Sora } from 'next/font/google';

import '@/app/globals.css';
import { AmbientBackdrop } from '@/components/layout/ambient-backdrop';
import { Footer } from '@/components/layout/footer';
import { PageTransition } from '@/components/layout/page-transition';
import { LanguageProvider } from '@/components/language-provider';
import { SocialPromoPopup } from '@/components/social-promo-popup';
import { Navbar } from '@/components/layout/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { siteConfig } from '@/config/site';
import { getServerLocale } from '@/lib/i18n-server';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.author}`
  },
  description: siteConfig.description,
  keywords: siteConfig.seoKeywords,
  category: 'technology',
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description
  },
  alternates: {
    canonical: siteConfig.url
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${manrope.variable} ${sora.variable} font-sans`}>
        <LanguageProvider initialLocale={locale}>
          <ThemeProvider>
            <div className="flex min-h-screen flex-col">
              <AmbientBackdrop />
              <Navbar />
              <main className="flex-1">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
              <SocialPromoPopup />
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
