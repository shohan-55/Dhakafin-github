import { LocaleLink } from '@/components/system/LocaleLink';
import { localeHref, type Locale } from '@/lib/i18n';
import { interpolate, type Dictionary } from '@/lib/dictionary';
import { footerColumns, legalLinks } from '@/lib/navigation';
import { ReduceEffectsToggle } from '../system/TierControls';
import { Logo } from './Logo';

interface SiteFooterProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Site footer — blueprint §2.3.
 * Doubles as an SEO surface (keyword-rich intelligence links) and as the home of
 * the accessibility escape hatch ("Reduce effects", §3.9).
 *
 * Every link is locale-aware, and every label comes from the dictionary — the
 * route inventory lives in `lib/navigation.ts`. Column headings are real `<h2>`
 * inside a labelled `<nav>`, so a screen-reader user can jump between columns by
 * heading rather than walking 29 links.
 */
export function SiteFooter({ locale, dict }: SiteFooterProps) {
  const t = dict.footer;

  return (
    <footer className="mt-0 border-t border-[var(--df-color-border-quiet)] bg-[var(--df-color-slate-deep)]">
      <div className="df-container df-container-wide py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">{t.tagline}</p>
            <p className="mt-4 text-sm font-medium text-sea-300">{t.promise}</p>
          </div>

          {footerColumns.map((column) => {
            const heading = t.columns[column.key];
            return (
              <nav key={column.key} aria-label={heading}>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{heading}</h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <LocaleLink
                        locale={locale}
                        href={link.href}
                        className="text-sm text-[var(--df-color-text)] no-underline transition-colors duration-[var(--df-duration-fast)] hover:text-sea-300"
                      >
                        {t.links[link.key]}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              </nav>
            );
          })}
        </div>

        <hr className="df-rule my-10" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5 text-xs text-muted">
            <p>{interpolate(t.rights, { year: new Date().getFullYear() })}</p>
            <p className="max-w-3xl leading-relaxed">{t.disclaimerLong}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <nav aria-label={t.legalNav} className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {legalLinks.map((item) => (
                <LocaleLink
                  key={item.href}
                  locale={locale}
                  href={item.href}
                  className="text-xs text-muted no-underline hover:text-sea-300"
                >
                  {t.links[item.key]}
                </LocaleLink>
              ))}
            </nav>

            <ReduceEffectsToggle
              label={t.reduceEffects}
              hint={t.reduceEffectsHint}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Re-exported so a server component can build a locale-aware href without importing i18n. */
export { localeHref };
