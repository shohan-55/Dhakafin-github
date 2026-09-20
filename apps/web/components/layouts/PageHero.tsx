import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import type { Locale } from '@/lib/i18n';

export interface Crumb {
  label: string;
  href: string;
}

interface PageHeroProps {
  locale: Locale;
  eyebrow?: string;
  title: React.ReactNode;
  /** One-line promise. Always a sentence, never a fragment — it is the page's contract. */
  lede: string;
  crumbs: Crumb[];
  /** Short qualifiers shown as chips: who the page is for, price band, coverage. */
  chips?: { label: string; tone?: BadgeTone }[];
  actions?: React.ReactNode;
  /** Right column. Optional — pages without one get a single-column hero. */
  aside?: React.ReactNode;
  /** Translated breadcrumb landmark label. */
  breadcrumbLabel: string;
}

/**
 * Shared page hero for every Phase 2 content page.
 * ---------------------------------------------------------------------------
 * One component so that a service page, an industry page and the tools hub all
 * start the same way. The alternative — each page hand-rolling its own header —
 * is how a site ends up with four subtly different h1 sizes and three breadcrumb
 * styles, which reads as unfinished no matter how good each page is alone.
 *
 * The eyebrow → h1 → lede → chips → actions order is fixed. Only the content
 * changes, which is what makes 20+ pages feel like one product.
 */
export function PageHero({
  locale,
  eyebrow,
  title,
  lede,
  crumbs,
  chips,
  actions,
  aside,
  breadcrumbLabel,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-[var(--df-color-border-quiet)]">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[var(--df-gradient-depth)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-px bg-[var(--df-gradient-sealine)] opacity-50" />

      <div className="df-container df-container-wide pt-10 pb-14 lg:pt-12 lg:pb-16">
        <Breadcrumb items={crumbs} label={breadcrumbLabel} className="mb-8" />

        <div className={cn('grid gap-10', aside ? 'lg:grid-cols-[1.1fr_0.9fr] lg:items-start' : '')}>
          <div className={cn(!aside && 'max-w-3xl')}>
            {eyebrow ? (
              <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">{eyebrow}</p>
            ) : null}

            <h1 className={cn('text-h1 text-[var(--df-color-text-strong)]', eyebrow && 'mt-4')}>{title}</h1>

            <p className="mt-5 max-w-[62ch] text-body-lg text-muted">{lede}</p>

            {chips && chips.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <li key={chip.label}>
                    <Badge tone={chip.tone ?? 'neutral'} size="sm">
                      {chip.label}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : null}

            {actions ? <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div> : null}
          </div>

          {aside ? <div>{aside}</div> : null}
        </div>
      </div>

      {/* Locale is carried on the section so nested links can be resolved without
          threading the prop through every child component. */}
      <span className="hidden" data-locale={locale} aria-hidden="true" />
    </section>
  );
}
