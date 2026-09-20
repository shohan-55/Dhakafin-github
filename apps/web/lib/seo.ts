import type { Metadata } from 'next';

import {
  absoluteUrl,
  defaultLocale,
  htmlLang,
  localeHref,
  locales,
  switchLocale,
  type Locale,
  stripLocalePrefix,
} from './i18n';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://dhakafin.com';

export const SITE_NAME = 'DhakaFin';

interface PageMetaInput {
  locale: Locale;
  /** Canonical path in the DEFAULT locale, e.g. `/tools/vat-calculator`. */
  path: string;
  title: string;
  description: string;
  /** Set true for internal or thin pages that must not be indexed. */
  noindex?: boolean;
  keywords?: string[];
  ogType?: 'website' | 'article';
  /** ISO date, for article pages. */
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Build page metadata with correct canonicals and `hreflang` alternates.
 * ---------------------------------------------------------------------------
 * Two things are easy to get wrong here and expensive to discover late:
 *
 *   1. **Canonical must be the default-locale URL for the same page.** A Bengali
 *      page that canonicalises to `/` tells Google the Bengali content is a
 *      duplicate of the home page. It must canonicalise to its own `bn` URL.
 *   2. **Every locale needs a reciprocal alternate, including `x-default`.**
 *      Missing `x-default` means a search engine picks a language for an
 *      unmatched visitor, and it usually picks wrong.
 *
 * Both are handled here so no page has to remember.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  noindex = false,
  keywords,
  ogType = 'website',
  publishedTime,
  modifiedTime,
}: PageMetaInput): Metadata {
  const canonicalPath = localeHref(locale, path);

  // Every locale's URL for THIS page, keyed by its `hreflang` value.
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[htmlLang[l]] = absoluteUrl(localeHref(l, path), SITE_URL);
  }
  // x-default points at the default locale — what an unmatched visitor gets.
  languages['x-default'] = absoluteUrl(localeHref(defaultLocale, path), SITE_URL);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: absoluteUrl(canonicalPath, SITE_URL),
      languages,
    },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
    openGraph: {
      type: ogType,
      siteName: SITE_NAME,
      locale: locale === 'bn' ? 'bn_BD' : 'en_BD',
      alternateLocale: locale === 'bn' ? 'en_BD' : 'bn_BD',
      url: absoluteUrl(canonicalPath, SITE_URL),
      title,
      description,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/**
 * The language switcher's data: for a given pathname, where does each locale live?
 * Keeps the switcher honest about pointing at the equivalent page.
 */
export function localeTargets(pathname: string): { locale: Locale; href: string; current: boolean }[] {
  const canonical = stripLocalePrefix(pathname);
  const active: Locale = pathname === '/bn' || pathname.startsWith('/bn/') ? 'bn' : defaultLocale;

  return locales.map((l) => ({
    locale: l,
    href: switchLocale(canonical, l),
    current: l === active,
  }));
}
