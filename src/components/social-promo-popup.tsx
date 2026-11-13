'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, ExternalLink, Linkedin, Instagram, X, Youtube } from 'lucide-react';

import { useLanguage } from '@/components/language-provider';
import { SocialIcon } from '@/components/ui/brand-icons';
import { siteConfig } from '@/config/site';

const POPUP_DELAY_MS = 10_000;
// Each card is filled with the platform's own brand colour and a large logo.
const brandTile = {
  youtube: 'linear-gradient(135deg, #ff0033 0%, #c4001f 100%)',
  linkedin: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)',
  instagram: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)',
  tiktok: 'linear-gradient(135deg, #010101 0%, #1c1c1c 100%)'
} as const;

export function SocialPromoPopup() {
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOpen(true);
      setMobileExpanded(false);
    }, POPUP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!open) return null;

  const isPl = locale === 'pl';
  const title = isPl ? 'Bądźmy w kontakcie' : "Let's stay connected";
  const description = isPl ? 'Obserwuj mnie w social mediach.' : 'Follow me on socials.';
  const maybeLater = isPl ? 'Może później' : 'Maybe later';
  const youtubeLabel = isPl ? 'Kanał YouTube' : 'YouTube Channel';
  const linkedinLabel = 'LinkedIn';
  const instagramLabel = 'Instagram';
  const tiktokLabel = 'TikTok';
  const openLabel = isPl ? 'Otwórz' : 'Open';
  const openPanelLabel = isPl ? 'Rozwiń' : 'Expand';
  const collapseLabel = isPl ? 'Zwiń' : 'Collapse';

  const cards: {
    key: string;
    href: string;
    tile: string;
    title: string;
    accent: string;
    logo: ReactNode;
  }[] = [
    {
      key: 'youtube',
      href: siteConfig.social.youtube,
      tile: brandTile.youtube,
      title: youtubeLabel,
      accent: '#ff0033',
      logo: <Youtube className="h-full w-auto text-white" strokeWidth={1.6} />
    },
    {
      key: 'linkedin',
      href: siteConfig.social.linkedin,
      tile: brandTile.linkedin,
      title: linkedinLabel,
      accent: '#0a66c2',
      logo: <Linkedin className="h-full w-auto text-white" strokeWidth={1.6} />
    },
    {
      key: 'instagram',
      href: siteConfig.social.instagram,
      tile: brandTile.instagram,
      title: instagramLabel,
      accent: '#d6249f',
      logo: <Instagram className="h-full w-auto text-white" strokeWidth={1.6} />
    },
    {
      key: 'tiktok',
      href: siteConfig.social.tiktok,
      tile: brandTile.tiktok,
      title: tiktokLabel,
      accent: '#25f4ee',
      logo: (
        <span className="relative inline-flex h-full aspect-square">
          <SocialIcon name="tiktok" className="absolute inset-0 h-full w-full translate-x-[3%] translate-y-[3%] text-[#fe2c55]" />
          <SocialIcon name="tiktok" className="absolute inset-0 h-full w-full -translate-x-[3%] -translate-y-[3%] text-[#25f4ee]" />
          <SocialIcon name="tiktok" className="relative h-full w-full text-white" />
        </span>
      )
    }
  ];

  const cardClass =
    'group overflow-hidden rounded-xl border border-border/70 bg-background/75 transition-all duration-200 hover:-translate-y-0.5';

  return (
    <>
      <div className="hidden md:block">
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/38 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border/70 bg-card/95 p-5 shadow-[0_28px_60px_-28px_hsl(var(--foreground)/0.55)]"
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={isPl ? 'Zamknij' : 'Close'}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mb-4 pr-10">
              <p className="font-display text-xl font-semibold tracking-tight">{title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {cards.map((card) => (
                <Link
                  key={card.key}
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cardClass}
                  style={{ borderColor: `color-mix(in oklab, hsl(var(--border)) 72%, ${card.accent} 28%)` }}
                >
                  <div
                    className="flex h-28 items-center justify-center p-5 transition-transform duration-300 [&_svg]:drop-shadow-[0_6px_14px_rgba(0,0,0,0.25)] group-hover:[&>*]:scale-105"
                    style={{ background: card.tile }}
                    aria-hidden="true"
                  >
                    <span className="flex h-full items-center justify-center transition-transform duration-300">{card.logo}</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <span className="text-sm font-medium">{card.title}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">
                      {openLabel}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {maybeLater}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="md:hidden">
        <AnimatePresence>
          {mobileExpanded ? (
            <motion.button
              type="button"
              aria-label={isPl ? 'Zamknij panel' : 'Close panel'}
              className="fixed inset-0 z-[79] bg-black/30 backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileExpanded(false)}
            />
          ) : null}
        </AnimatePresence>

        <motion.div
          className="fixed inset-x-3 bottom-3 z-[80]"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {!mobileExpanded ? (
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-[0_20px_36px_-24px_hsl(var(--foreground)/0.5)]">
              <button
                type="button"
                onClick={() => setMobileExpanded(true)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left"
              >
                <div>
                  <p className="font-display text-sm font-semibold tracking-tight">{title}</p>
                  <p className="text-[11px] text-muted-foreground">{description}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-border/65 bg-background/70 px-2.5 py-1 text-[11px] text-muted-foreground">
                  {openPanelLabel}
                  <ChevronUp className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          ) : (
            <motion.div
              className="overflow-hidden rounded-2xl border border-border/70 bg-card/95 p-3 shadow-[0_28px_60px_-28px_hsl(var(--foreground)/0.55)]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <p className="font-display text-sm font-semibold tracking-tight">{title}</p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMobileExpanded(false)}
                    className="rounded-full border border-border/65 bg-background/70 px-2 py-1 text-[11px] text-muted-foreground"
                  >
                    {collapseLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {cards.map((card) => (
                  <Link
                    key={card.key}
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                    className={cardClass}
                    style={{ borderColor: `color-mix(in oklab, hsl(var(--border)) 72%, ${card.accent} 28%)` }}
                  >
                    <div className="flex h-16 items-center justify-center p-3" style={{ background: card.tile }} aria-hidden="true">
                      <span className="flex h-full items-center justify-center">{card.logo}</span>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <span className="text-[11px] font-medium">{card.title}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
