'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/cn';
import { localeHref, type Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/dictionary';
import { ButtonLink } from '../ui/Button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';

/** Route definitions are locale-independent; only their labels are translated. */
const NAV_ROUTES = [
  { key: 'rates', href: '/rates' },
  { key: 'tools', href: '/tools' },
  { key: 'services', href: '/services' },
  { key: 'industries', href: '/industries' },
  { key: 'insights', href: '/insights' },
] as const;

interface SiteHeaderProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Site header — blueprint §2.3.
 *
 * Phase 1 scope: the shell, the real navigation model, the mobile panel, the
 * language switcher and the primary conversion CTA. The mega-panels (DB-driven
 * "popular right now" rates, tool search) arrive with the rate hub in Phase 3,
 * and the ⌘K command palette with the search service in Phase 2.
 *
 * Behaviour: transparent over the hero, opaque + hairline after 24px of scroll.
 */
export function SiteHeader({ locale, dict }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile panel is open, and allow ESC to close it.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const navItems = NAV_ROUTES.map((route) => ({
    ...route,
    label: dict.nav[route.key].label,
    hint: dict.nav[route.key].hint,
    localizedHref: localeHref(locale, route.href),
  }));

  return (
    <>
      {/* The skip link is the first thing a keyboard user reaches. It must be
          translated: its whole purpose is to be found and read under pressure. */}
      <a href="#main" className="df-sr-only df-skip-link">
        {dict.common.skipToContent}
      </a>

      <header
        className={cn(
          'sticky top-0 z-[var(--df-z-index-element)] w-full transition-colors duration-[var(--df-duration-slow)] ease-[var(--ease-out)]',
          scrolled
            ? 'border-b border-[var(--df-color-border-quiet)] bg-[color-mix(in_srgb,var(--df-color-void)_88%,transparent)] backdrop-blur-xl'
            : 'border-b border-transparent'
        )}
      >
        <div className="df-container df-container-wide flex h-[72px] items-center justify-between gap-6">
          <a href={localeHref(locale, '/')} className="shrink-0 no-underline" aria-label={dict.common.homeLabel}>
            <Logo />
          </a>

          <nav aria-label={dict.common.primaryNav} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.localizedHref}
                    title={item.hint}
                    className={cn(
                      'inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted no-underline',
                      'transition-colors duration-[var(--df-duration-fast)]',
                      'hover:bg-surface-tint hover:text-[var(--df-color-text-strong)]'
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Command palette trigger — wired to the search service in Phase 2 */}
            <button
              type="button"
              disabled
              aria-disabled="true"
              title={dict.common.searchSoon}
              className={cn(
                'hidden h-9 items-center gap-2 rounded-lg border border-[var(--df-color-border)] px-3 text-xs text-muted xl:inline-flex',
                'cursor-not-allowed opacity-60'
              )}
            >
              <span aria-hidden="true">⌕</span>
              {dict.common.search}
              <kbd className="df-num ml-1 rounded border border-[var(--df-color-border-quiet)] px-1.5 py-0.5 text-[10px]">
                ⌘K
              </kbd>
            </button>

            <LanguageSwitcher
              current={locale}
              labels={{
                languageLabel: dict.common.languageLabel,
                switchTo: dict.common.switchTo,
              }}
              className="hidden sm:flex"
            />

            <a
              href="/sign-in"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted no-underline transition-colors hover:text-[var(--df-color-text-strong)] md:inline-flex"
            >
              {dict.common.signIn}
            </a>

            <ButtonLink href="/book-consultation" size="sm" className="hidden lg:inline-flex">
              {dict.common.bookConsultation}
            </ButtonLink>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={dict.common.openMenu}
              className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--df-color-border)] text-[var(--df-color-text)] lg:hidden"
            >
              <span aria-hidden="true" className="flex flex-col gap-1">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation panel — full-screen, staggered, thumb-friendly */}
      {menuOpen ? (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-[var(--df-z-index-overlay)] flex flex-col bg-void lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={dict.common.mobileNav}
        >
          <div className="df-container flex h-[72px] shrink-0 items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={dict.common.closeMenu}
              className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--df-color-border)]"
              autoFocus
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <nav aria-label={dict.common.mobileNav} className="df-container flex-1 overflow-y-auto py-6">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li
                  key={item.href}
                  className="animate-[df-rise_var(--df-duration-slow)_var(--ease-out)_both]"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <a
                    href={item.localizedHref}
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-col rounded-xl border border-[var(--df-color-border-quiet)] px-4 py-3.5 no-underline"
                  >
                    <span className="text-base font-semibold text-[var(--df-color-text-strong)]">{item.label}</span>
                    <span className="mt-0.5 text-xs text-muted">{item.hint}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* The language switcher sits above the fold of the mobile panel —
                a Bengali speaker must not have to scroll to find their language. */}
            <div className="mt-6">
              <LanguageSwitcher
                current={locale}
                labels={{
                  languageLabel: dict.common.languageLabel,
                  switchTo: dict.common.switchTo,
                }}
                className="mb-4"
              />
            </div>

            <div className="space-y-3">
              <ButtonLink href="/book-consultation" size="lg" fullWidth>
                {dict.common.bookConsultation}
              </ButtonLink>
              <ButtonLink href="/sign-in" variant="secondary" size="lg" fullWidth>
                {dict.common.signIn}
              </ButtonLink>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-muted">{dict.common.disclaimer}</p>
          </nav>
        </div>
      ) : null}
    </>
  );
}
