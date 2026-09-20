import Link from 'next/link';

import { localeHref, type Locale } from '@/lib/i18n';

interface LocaleLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  locale: Locale;
  /** Canonical (default-locale) path, e.g. `/rates/tds`. */
  href: string;
  children: React.ReactNode;
}

/**
 * A link that knows which locale it is rendered in.
 * ---------------------------------------------------------------------------
 * Server component, zero client JavaScript. Use this for every internal link in
 * a server-rendered tree.
 *
 * Why this exists rather than `${locale === 'en' ? '' : '/bn'}${href}` inlined
 * everywhere: that expression is exactly the kind of thing that gets copy-pasted
 * and then subtly wrong in one place, and a single link pointing at the English
 * page from the Bengali site is the defect users actually notice. One function,
 * one place to be correct.
 *
 * `hreflang` is emitted on the link so search engines can confirm the pairing
 * from the markup itself.
 */
export function LocaleLink({ locale, href, children, ...rest }: LocaleLinkProps) {
  return (
    <Link href={localeHref(locale, href)} hrefLang={locale} {...rest}>
      {children}
    </Link>
  );
}
