import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';
import type { Locale } from '@/lib/i18n';
import { getServerLocale } from '@/lib/i18n-server';

export type SeoPage = 'home' | 'experience' | 'education' | 'projects' | 'podcast' | 'contact' | 'about';

const PATHS: Record<SeoPage, string> = {
  home: '/',
  experience: '/experience',
  education: '/education',
  projects: '/projects',
  podcast: '/podcast',
  contact: '/contact',
  about: '/about'
};

// Titles stay short (they get " | Karol Kozłowski" appended); descriptions stay within ~160 characters.
const COPY: Record<Locale, Record<SeoPage, { title: string; description: string }>> = {
  pl: {
    home: {
      title: 'Karol Kozłowski | DevOps & Platform Engineer',
      description:
        'Inżynier DevOps i Platform z Warszawy: CI/CD, DevSecOps, Kubernetes i Linux. Doświadczenie w Visa i Samsung, homelab GitOps na żywo i podcast „Rozmowy z Kozłem”.'
    },
    experience: {
      title: 'Doświadczenie',
      description:
        'Doświadczenie zawodowe: DevOps Engineer w Visa (CI/CD, DevSecOps, kontenery) oraz Linux, hypervisor i security w Samsung Electronics.'
    },
    education: {
      title: 'Edukacja',
      description:
        'Inżynier Informatyki Stosowanej (AGH), studia magisterskie na Politechnice Warszawskiej oraz projekty akademickie z uczenia maszynowego.'
    },
    projects: {
      title: 'Projekty',
      description:
        'Homelab Kubernetes zarządzany w modelu GitOps przez Argo CD, z podglądem na żywo stanu aplikacji i grafu zależności zasobów klastra.'
    },
    podcast: {
      title: 'Podcast „Rozmowy z Kozłem”',
      description:
        '„Rozmowy z Kozłem” to interdyscyplinarny podcast: kariera, technologia, przedsiębiorczość, zdrowie i świat. Najnowsze odcinki i shorty z YouTube.'
    },
    contact: {
      title: 'Kontakt',
      description: 'Kontakt z Karolem Kozłowskim: e-mail, LinkedIn, GitHub i social media.'
    },
    about: {
      title: 'O mnie',
      description:
        'Karol Kozłowski: inżynier DevOps i Platform. Moja droga od Linuksa i bezpieczeństwa w Samsungu do CI/CD w Visa, zasady pracy i stack technologiczny.'
    }
  },
  en: {
    home: {
      title: 'Karol Kozłowski | DevOps & Platform Engineer',
      description:
        'DevOps and Platform Engineer in Warsaw: CI/CD, DevSecOps, Kubernetes, Linux. Visa and Samsung experience, a live GitOps homelab and the Rozmowy z Kozłem podcast.'
    },
    experience: {
      title: 'Experience',
      description:
        'Professional experience: DevOps Engineer at Visa (CI/CD, DevSecOps, containers) and Linux, hypervisor and security engineering at Samsung Electronics.'
    },
    education: {
      title: 'Education',
      description:
        'B.Eng. in Applied Computer Science (AGH), graduate studies at Warsaw University of Technology, and academic machine learning projects.'
    },
    projects: {
      title: 'Projects',
      description:
        'A Kubernetes homelab managed with GitOps and Argo CD, with live application status and a dependency graph of the cluster’s resources.'
    },
    podcast: {
      title: 'Rozmowy z Kozłem Podcast',
      description:
        'Rozmowy z Kozłem is an interdisciplinary podcast about careers, technology, entrepreneurship, health and the world. Latest YouTube episodes and shorts.'
    },
    contact: {
      title: 'Contact',
      description: 'Get in touch with Karol Kozłowski by e-mail, LinkedIn, GitHub or social media.'
    },
    about: {
      title: 'About',
      description:
        'Karol Kozłowski, DevOps and Platform Engineer: my path from Linux and security at Samsung to CI/CD at Visa, how I work, and my tech stack.'
    }
  }
};

const OG_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: 'Karol Kozłowski: DevOps & Platform Engineer' };

// Pages whose content is not ready for search engines yet.
const NOINDEX: SeoPage[] = [];

export function buildMetadata(page: SeoPage, locale: Locale): Metadata {
  const { title, description } = COPY[locale][page];
  const url = new URL(PATHS[page], siteConfig.url).toString();
  const fullTitle = page === 'home' ? title : `${title} | ${siteConfig.author}`;

  return {
    // Home already carries the full name; subpages use the layout's "%s | Karol Kozłowski" template.
    title: page === 'home' ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    ...(NOINDEX.includes(page) ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.author,
      locale: locale === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: locale === 'pl' ? ['en_US'] : ['pl_PL'],
      type: 'website',
      // Set explicitly: a page-level openGraph replaces the layout's, image included.
      images: [OG_IMAGE]
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [OG_IMAGE.url]
    }
  };
}

/** `export const generateMetadata = seoMetadata('projects')` in a page. */
export function seoMetadata(page: SeoPage) {
  return async (): Promise<Metadata> => buildMetadata(page, await getServerLocale());
}
