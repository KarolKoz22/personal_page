import Link from 'next/link';

import { SocialIcon } from '@/components/ui/brand-icons';
import { siteConfig } from '@/config/site';
import { getServerLocale } from '@/lib/i18n-server';
import { cn } from '@/lib/utils';

const socialLabels: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  spotify: 'Spotify',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  x: 'X'
};

const socials = Object.entries(siteConfig.social).map(([key, href]) => ({
  key,
  label: socialLabels[key] ?? key,
  href
}));

const socialToneClass: Record<string, string> = {
  github: 'social-tone-github',
  linkedin: 'social-tone-linkedin',
  youtube: 'social-tone-youtube',
  spotify: 'social-tone-spotify',
  instagram: 'social-tone-instagram',
  tiktok: 'social-tone-tiktok',
  x: 'social-tone-x'
};

export async function Footer() {
  const locale = await getServerLocale();
  const isPl = locale === 'pl';
  const year = new Date().getFullYear();

  const availabilityLabel = isPl ? 'Dostępny do współpracy' : 'Available for collaboration';

  return (
    <footer className="footer-shell mt-10">
      <div className="container space-y-5 py-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="footer-pill footer-pill-status">
            <span className="footer-status-dot" aria-hidden="true" />
            {availabilityLabel}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {socials.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className={cn(
                'footer-social-link group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-all duration-200 sm:text-sm',
                socialToneClass[social.key] ?? 'social-tone-github'
              )}
            >
              <SocialIcon
                name={social.key}
                className="footer-social-icon transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110"
              />
              {social.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground/75 sm:flex-row sm:items-center sm:justify-between">
          <p>{`© ${year} ${siteConfig.author}`}</p>
        </div>
      </div>
    </footer>
  );
}
