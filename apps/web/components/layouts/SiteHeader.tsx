'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';
import { ButtonLink } from '../ui/Button';

const NAV_ITEMS = [
  { label: 'Rates', href: '/rates', hint: 'TDS · VDS · VAT · Income tax' },
  { label: 'Tools', href: '/tools', hint: '13 free calculators' },
  { label: 'Services', href: '/services', hint: '9 professional service lines' },
  { label: 'Industries', href: '/industries', hint: 'Manufacturing to e-commerce' },
  { label: 'Insights', href: '/insights', hint: 'Explainers and updates' },
] as const;

/**
 * Site header — blueprint §2.3.
 *
 * Phase 1 scope: the shell, the real navigation model, the mobile panel and the
 * primary conversion CTA. The mega-panels (DB-driven "popular right now" rates,
 * tool search) arrive with the rate hub in Phase 3, and the ⌘K command palette
 * with the search service in Phase 2.
 *
 * Behaviour: transparent over the hero, opaque + hairline after 24px of scroll.
 */
export function SiteHeader() {
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

  return (
    <>
      <a href="#main" className="df-sr-only df-skip-link">
        Skip to main content
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
          <a href="/" className="shrink-0 no-underline" aria-label="DhakaFin home">
            <Logo />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
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
              title="Command palette arrives with the search service (Phase 2)"
              className={cn(
                'hidden h-9 items-center gap-2 rounded-lg border border-[var(--df-color-border)] px-3 text-xs text-muted lg:inline-flex',
                'cursor-not-allowed opacity-60'
              )}
            >
              <span aria-hidden="true">⌕</span>
              Search
              <kbd className="df-num ml-1 rounded border border-[var(--df-color-border-quiet)] px-1.5 py-0.5 text-[10px]">
                ⌘K
              </kbd>
            </button>

            <a
              href="/sign-in"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted no-underline transition-colors hover:text-[var(--df-color-text-strong)] sm:inline-flex"
            >
              Sign in
            </a>

            <ButtonLink href="/book-consultation" size="sm" className="hidden sm:inline-flex">
              Book a Consultation
            </ButtonLink>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label="Open navigation menu"
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
          aria-label="Navigation"
        >
          <div className="df-container flex h-[72px] shrink-0 items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
              className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--df-color-border)]"
              autoFocus
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <nav aria-label="Mobile" className="df-container flex-1 overflow-y-auto py-6">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item, index) => (
                <li
                  key={item.href}
                  className="animate-[df-rise_var(--df-duration-slow)_var(--ease-out)_both]"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex flex-col rounded-xl border border-[var(--df-color-border-quiet)] px-4 py-3.5 no-underline"
                  >
                    <span className="text-base font-semibold text-[var(--df-color-text-strong)]">{item.label}</span>
                    <span className="mt-0.5 text-xs text-muted">{item.hint}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-3">
              <ButtonLink href="/book-consultation" size="lg" fullWidth>
                Book a Consultation
              </ButtonLink>
              <ButtonLink href="/sign-in" variant="secondary" size="lg" fullWidth>
                Sign in to the platform
              </ButtonLink>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-muted">
              General information based on published NBR sources — not professional advice for your specific case.
            </p>
          </nav>
        </div>
      ) : null}
    </>
  );
}
