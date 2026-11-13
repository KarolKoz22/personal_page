'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { LanguageToggle } from '@/components/language-toggle';
import { useLanguage } from '@/components/language-provider';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger
} from '@/components/ui/sheet';

export function Navbar() {
  const pathname = usePathname();
  const { dictionary } = useLanguage();

  const navItems = [
    { href: '/', label: dictionary.nav.home },
    { href: '/about', label: dictionary.nav.about },
    { href: '/experience', label: dictionary.nav.experience },
    { href: '/education', label: dictionary.nav.education },
    { href: '/projects', label: dictionary.nav.projects },
    { href: '/podcast', label: dictionary.nav.podcast },
    { href: '/contact', label: dictionary.nav.contact }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/65 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-3">
        <Link
          href="/"
          className="group relative min-w-0 rounded-full border border-transparent px-2 py-1.5 font-display text-sm font-semibold tracking-tight transition-colors hover:border-border/70 hover:bg-card/45 sm:px-3 sm:text-base"
        >
          <span className="absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-[#1434CB]/0 via-[#3B82F6]/80 to-[#F7B600]/0 opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="truncate">{siteConfig.author}</span>
          <span className="ml-2 hidden rounded-full border border-border/60 bg-background/80 px-2 py-0.5 text-[11px] font-medium tracking-wide sm:inline-flex">
            <span className="bg-[linear-gradient(95deg,#1E40AF_0%,#3B82F6_58%,#F7B600_100%)] bg-clip-text text-transparent">
              {siteConfig.role}
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/55 p-1 shadow-sm xl:flex"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={pathname === item.href}
              className={cn(
                'nav-gradient-link group relative whitespace-nowrap rounded-full px-3 py-2 text-sm transition-all duration-200 hover:bg-accent/70',
                pathname === item.href
                  ? 'bg-secondary text-secondary-foreground shadow-sm after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[#3B82F6] after:shadow-[0_0_10px_rgba(59,130,246,0.65)]'
                  : 'text-muted-foreground'
              )}
            >
              <span className="nav-gradient-text">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-card/55 px-2 py-1 shadow-sm sm:flex">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-border/70 bg-card/70 shadow-sm xl:hidden"
                aria-label={dictionary.nav.openMenu}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="!w-[88vw] !max-w-[370px] border-l border-border/70 bg-card/95 pt-12">
              <SheetHeader className="space-y-4">
                <p className="rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-sm font-medium tracking-wide">
                  <span className="bg-[linear-gradient(95deg,#1E40AF_0%,#3B82F6_58%,#F7B600_100%)] bg-clip-text text-transparent">
                    {siteConfig.role}
                  </span>
                </p>
                <div className="grid gap-3 rounded-xl border border-border/60 bg-background/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">{dictionary.controls.language}</span>
                    <LanguageToggle />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">{dictionary.controls.theme}</span>
                    <ThemeToggle />
                  </div>
                </div>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      data-active={pathname === item.href}
                      className={cn(
                        'nav-gradient-link group rounded-lg border px-3 py-2.5 text-sm transition-colors',
                        pathname === item.href
                          ? 'border-primary/35 bg-secondary text-secondary-foreground'
                          : 'border-transparent text-muted-foreground hover:border-border/70 hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <span className="nav-gradient-text">{item.label}</span>
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
