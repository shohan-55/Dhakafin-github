import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

/**
 * 404 — art-directed, never a dead end (blueprint §5.14.2).
 * Turns a wrong turn into a path: the highest-value destinations plus a human contact.
 */
export default function NotFound() {
  return (
    <main id="main" className="df-container df-container-wide flex min-h-dvh flex-col justify-center py-20">
      <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">Error 404</p>

      <h1 className="mt-4 max-w-2xl text-h1 text-[var(--df-color-text-strong)]">
        That page isn&apos;t here.
      </h1>

      <p className="mt-4 max-w-xl text-bodyLg text-muted">
        The link may be outdated, or the page may not exist yet. Here are the places people usually need:
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:max-w-3xl">
        {[
          { label: 'TDS, VDS & VAT rates', href: '/rates', hint: 'Verified against NBR sources' },
          { label: 'Free calculators', href: '/tools', hint: '13 tools, no signup required' },
          { label: 'Compliance calendar', href: '/compliance-calendar', hint: 'Every statutory deadline' },
          { label: 'Talk to a specialist', href: '/book-consultation', hint: 'Response within 1 working hour' },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="group rounded-xl border border-[var(--df-color-border)] bg-surface1 p-5 no-underline transition-[border-color,transform] duration-[var(--df-duration-base)] hover:-translate-y-0.5 hover:border-[var(--df-color-border-hover)] motion-reduce:hover:translate-y-0"
          >
            <span className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[var(--df-color-text-strong)]">{item.label}</span>
              <span aria-hidden="true" className="text-sea-400 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
            <span className="mt-1 block text-xs text-muted">{item.hint}</span>
          </a>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <ButtonLink href="/" size="md">
          Back to home
        </ButtonLink>
        <ButtonLink href="/contact" variant="secondary" size="md">
          Report a broken link
        </ButtonLink>
      </div>
    </main>
  );
}
