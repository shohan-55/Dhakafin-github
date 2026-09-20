/**
 * Internationalisation foundation — English + Bengali (DF-P2-001)
 * ---------------------------------------------------------------------------
 * DhakaFin is bilingual, and the decision that matters is made here rather than
 * in a translation library: **is the locale part of the URL?**
 *
 * It has to be. Three reasons, in order of consequence:
 *
 *   1. Server-rendered `<html lang>` per locale. A screen reader only picks the
 *      correct Bengali voice if the document says `lang="bn"`. Switching text
 *      client-side after hydration means the first thing a screen-reader user
 *      hears is the wrong language, and search engines index the wrong one.
 *   2. Static prerendering. Every page is generated at build time in both
 *      languages. No locale flash, no layout shift, no hydration mismatch.
 *   3. Shareable, indexable URLs. `/bn/tds-rate` is a thing you can send someone.
 *
 * The prefix scheme is `as-needed`: English is served from the bare path and
 * Bengali from `/bn`. Middleware performs an internal rewrite, so the visitor
 * never sees `/en` and there is no redirect hop on the root — see `middleware.ts`.
 */

export const locales = ['en', 'bn'] as const;

export type Locale = (typeof locales)[number];

/** English is the default. The B2B audience reads it; Bengali is a deliberate offer, not a fallback. */
export const defaultLocale: Locale = 'en';

/**
 * `lang` attribute values. Bengali is `bn-BD`, not `bn` — the regional variant
 * determines date, numeral and currency formatting, and Bangladesh differs from
 * West Bengal on all three.
 */
export const htmlLang: Record<Locale, string> = {
  en: 'en-BD',
  bn: 'bn-BD',
};

/** Open Graph locale codes, which use underscores rather than hyphens. */
export const ogLocale: Record<Locale, string> = {
  en: 'en_BD',
  bn: 'bn_BD',
};

export const localeNames: Record<Locale, { english: string; native: string }> = {
  en: { english: 'English', native: 'English' },
  bn: { english: 'Bengali', native: 'বাংলা' },
};

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/**
 * Narrow an arbitrary route param to a Locale, falling back to the default.
 * Used in layouts so an unexpected segment cannot crash a render.
 */
export function resolveLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/**
 * Build a locale-aware href.
 *
 *   localeHref('en', '/tools/vat')  → '/tools/vat'
 *   localeHref('bn', '/tools/vat')  → '/bn/tools/vat'
 *
 * The default locale is unprefixed, which is why this is a function rather than
 * string concatenation scattered across components.
 */
export function localeHref(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean === '/' ? '/' : clean;
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}

/**
 * Strip a locale prefix from a pathname, yielding the canonical, unprefixed path.
 *
 * Strips the default locale's prefix as well as the others, which is not
 * cosmetic — it is the difference between a correct link and a broken one.
 *
 * `usePathname()` in a client component answers differently depending on where
 * it runs. In the browser it returns the URL the visitor sees, so the internal
 * `/en` rewrite is invisible and `/services` on the English page is just
 * `/services`. But while Next.js is *prerendering* that same page there is no
 * URL yet: the value is the route's own pathname, which for the default locale
 * is `/en/services`. Anything that concatenates without normalising therefore
 * bakes `/bn/en/services` into the static HTML — a 404 for anyone without
 * JavaScript and a dead link for a crawler, while looking perfectly correct in a
 * browser with JavaScript on. Normalising both shapes to one canonical path is
 * what makes the markup and the hydrated result agree.
 */
export function stripLocalePrefix(pathname: string): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return '/';
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

/**
 * The equivalent path in another locale — used by the language switcher and by
 * `hreflang` alternates, both of which must point at the *same page*, not the
 * home page. A switcher that dumps you on `/bn` when you were reading a VAT
 * guide is a bug users report as "the Bengali site is broken".
 *
 * Accepts a pathname with or without a locale prefix, so it is safe to call with
 * the output of `usePathname()` in either environment. See `stripLocalePrefix`.
 */
export function switchLocale(pathname: string, target: Locale): string {
  return localeHref(target, stripLocalePrefix(pathname));
}

/** Turn a canonical path into the absolute URL for metadata. */
export function absoluteUrl(path: string, siteUrl = 'https://dhakafin.com'): string {
  const base = siteUrl.replace(/\/$/, '');
  return path === '/' ? `${base}/` : `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
