'use client';

import { usePathname } from 'next/navigation';

import { cn } from '@/lib/cn';
import { locales, localeNames, switchLocale, type Locale } from '@/lib/i18n';
import { interpolate } from '@/lib/dictionary';

interface LanguageSwitcherProps {
  /** The locale currently being rendered, supplied by the server layout. */
  current: Locale;
  /** Translated labels, passed down so this component stays dictionary-agnostic. */
  labels: { languageLabel: string; switchTo: string };
  className?: string;
}

/**
 * Language switcher — DF-P2-001
 * ---------------------------------------------------------------------------
 * Deliberately a pair of real `<a>` elements, not a `<select>` or a button:
 *
 *   · **Works without JavaScript.** A Bengali reader on a slow connection, or
 *     with JS blocked, can still change language. A client-side toggle cannot.
 *   · **Crawlable.** Search engines follow these to discover the Bengali site
 *     and to confirm the `hreflang` pairs are reciprocal.
 *   · **Middle-click and "open in new tab" behave normally**, which is what
 *     people actually do with a language link.
 *
 * `hreflang` on each link is the machine-readable half of the same statement the
 * visible label makes to the reader. `lang` is set on the non-current option so
 * a screen reader pronounces "বাংলা" with a Bengali voice rather than an English
 * one reading Bengali glyphs.
 *
 * The path is preserved: switching language on `/rates/tds` lands on
 * `/bn/rates/tds`, not the homepage. A switcher that loses your page is the
 * single most common bilingual-site defect.
 */
export function LanguageSwitcher({ current, labels, className }: LanguageSwitcherProps) {
  // `usePathname` answers two different questions depending on when it is asked.
  // In the browser it returns the URL the visitor sees, so the internal `/en`
  // rewrite is invisible. During prerendering there is no URL yet and it returns
  // the route's own pathname, which carries the prefix — `/en/services`. Passing
  // it through `switchLocale` normalises both shapes, so the static HTML and the
  // hydrated page agree. Skipping that step emits `/bn/en/services`: it works in
  // a browser with JavaScript and 404s for everyone else.
  const pathname = usePathname() || '/';

  return (
    <nav aria-label={labels.languageLabel} className={cn('flex items-center', className)}>
      <ul className="flex items-center rounded-lg border border-[var(--df-color-border-quiet)] p-0.5">
        {locales.map((locale) => {
          const isCurrent = locale === current;
          const name = localeNames[locale].native;

          return (
            <li key={locale}>
              {isCurrent ? (
                <span
                  aria-current="true"
                  lang={locale}
                  className="block rounded-[6px] bg-surface-tint px-2.5 py-1 text-xs font-semibold text-[var(--df-color-text-strong)]"
                >
                  {name}
                </span>
              ) : (
                <a
                  href={switchLocale(pathname, locale)}
                  hrefLang={locale}
                  lang={locale}
                  aria-label={interpolate(labels.switchTo, { language: name })}
                  className={cn(
                    'block rounded-[6px] px-2.5 py-1 text-xs font-medium text-muted no-underline',
                    'transition-colors duration-[var(--df-duration-fast)]',
                    'hover:bg-surface-tint hover:text-[var(--df-color-text-strong)]'
                  )}
                >
                  {name}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
