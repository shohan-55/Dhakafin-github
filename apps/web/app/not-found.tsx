import { headers } from 'next/headers';

import { Providers } from '@/components/system/Providers';
import { SiteFooter } from '@/components/layouts/SiteFooter';
import { SiteHeader } from '@/components/layouts/SiteHeader';
import { LocaleLink } from '@/components/system/LocaleLink';
import { ButtonLink } from '@/components/ui/Button';
import { getDictionary } from '@/lib/dictionary';
import { htmlLang, localeHref, resolveLocale } from '@/lib/i18n';

/**
 * 404 — art-directed, never a dead end (blueprint §5.14.2).
 * Turns a wrong turn into a path: the highest-value destinations plus a human contact.
 *
 * WHY THIS FILE IS AT THE ROOT OF `app/`, AND WHY IT IS A CLIENT COMPONENT
 * -------------------------------------------------------------------------
 * Three facts about the App Router force this shape, and each one is load-bearing:
 *
 * 1. **A nested `not-found.tsx` does not handle URL mismatches.** Per the Next.js
 *    docs, a `not-found.tsx` inside a segment only handles `notFound()` calls
 *    thrown *within* that segment. A URL that simply matches no route falls
 *    through to the root not-found. So this file must live here.
 *
 * 2. **It must render its own `<html>` and `<body>`.** `app/layout.tsx` is a
 *    pass-through that returns `children` so that `[locale]/layout.tsx` can own
 *    `<html lang>` per locale. When the root layout emits no document, the
 *    root not-found must emit the whole thing.
 *
 * 3. **It gets no route params**, so the locale comes from the request header set
 *    in `proxy.ts`. This file is a *sibling* of `[locale]`, not inside it, so
 *    reading a header here marks only `_not-found` as dynamic — the marketing
 *    pages stay statically prerendered. (Putting the same call in a nested
 *    not-found makes the entire `[locale]` segment dynamic, which costs far
 *    more than translating one 404 screen is worth.)
 *
 * The result: a real 404 status, the correct `lang`, the correct language, and
 * the full site chrome so the visitor is never stranded.
 */
export default async function NotFound() {
  const locale = resolveLocale((await headers()).get('x-dhakafin-locale') ?? undefined);
  const dict = getDictionary(locale);
  const t = dict.states.notFound;

  const destinations = [
    { label: dict.nav.rates.label, href: '/rates' },
    { label: dict.nav.tools.label, href: '/tools' },
    { label: dict.footer.links.complianceCalendar, href: '/compliance-calendar' },
    { label: dict.common.bookConsultation, href: '/book-consultation' },
  ];

  return (
    <html lang={htmlLang[locale]} data-tier="high" data-motion="on" data-theme="dark" data-locale={locale}>
      <body className="min-h-dvh bg-void antialiased">
        <Providers>
        <div className="flex min-h-dvh flex-col bg-void">
          <SiteHeader locale={locale} dict={dict} />

          <main id="main" className="df-container df-container-wide flex flex-1 flex-col justify-center py-20">
            <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">{t.eyebrow}</p>

            <h1 className="mt-4 max-w-2xl text-h1 text-[var(--df-color-text-strong)]">{t.title}</h1>

            <p className="mt-4 max-w-xl text-body-lg text-muted">{t.body}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:max-w-3xl">
              {destinations.map((item) => (
                <LocaleLink
                  key={item.href}
                  locale={locale}
                  href={item.href}
                  className="group rounded-xl border border-[var(--df-color-border)] bg-surface1 p-5 no-underline transition-[border-color,transform] duration-[var(--df-duration-base)] hover:-translate-y-0.5 hover:border-[var(--df-color-border-hover)] motion-reduce:hover:translate-y-0"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-[var(--df-color-text-strong)]">{item.label}</span>
                    <span aria-hidden="true" className="text-sea-400 transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </LocaleLink>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href={localeHref(locale, '/')} size="lg">
                {t.home}
              </ButtonLink>
            </div>
          </main>

          <SiteFooter locale={locale} dict={dict} />
        </div>
        </Providers>
      </body>
    </html>
  );
}
