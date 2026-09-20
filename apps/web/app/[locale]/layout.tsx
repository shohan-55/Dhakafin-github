import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';

import '../globals.css';
import { fontVariables } from '../fonts/fonts';
import { Providers } from '@/components/system/Providers';
import { tokens } from '@dhakafin/tokens';
import { isLocale, htmlLang, locales, type Locale } from '@/lib/i18n';
import { SITE_URL } from '@/lib/seo';
import { tierBootstrapScript } from '@/lib/tier';

/**
 * Localised root layout — DF-P2-001
 * ---------------------------------------------------------------------------
 * This is the ROOT layout: it owns `<html>` and `<body>`. There is deliberately
 * no `app/layout.tsx`, because a root layout cannot read route params and would
 * therefore force one hardcoded `lang` on the whole site.
 *
 * `lang` is the reason the locale lives in the URL. A screen reader chooses its
 * voice from this attribute; a client-side language toggle would leave the first
 * utterance in the wrong language, and it is the first utterance that tells a
 * blind user whether the site is for them.
 *
 * Every page is statically prerendered in both locales via `generateStaticParams`.
 */
export function generateStaticParams(): { locale: Locale }[] {
  return locales.map((locale) => ({ locale }));
}

/**
 * Pin this segment to static rendering.
 *
 * The root `app/not-found.tsx` reads a request header to learn the locale, and
 * because a not-found boundary belongs to the root layout, that dynamic usage
 * would otherwise propagate to every route beneath it — turning every marketing
 * page into a server-rendered response. `force-static` here scopes the exception:
 * the 404 stays dynamic, everything the visitor actually reads stays prerendered.
 *
 * If you remove this line, check `npm run build` — the route table will silently
 * switch from ● (SSG) to ƒ (Dynamic) and nothing else will look wrong.
 */
export const dynamic = 'force-static';

/**
 * NOTE: `dynamicParams` is deliberately left at its default (true).
 *
 * Setting it to `false` here does not merely reject unknown locales — it stops
 * the `[...rest]` catch-all from rendering inside this segment at all, so an
 * unmatched path falls through to Next.js's bare error document instead of the
 * art-directed 404 with the site's header and footer.
 *
 * It is also unnecessary: `proxy.ts` guarantees this segment only ever receives
 * `en` or `bn`, because anything else is rewritten to the default locale first.
 * The `notFound()` guard below still catches a locale that slips through.
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'DhakaFin — Financial Intelligence, Accounting & Compliance for Bangladesh',
    template: '%s | DhakaFin',
  },
  description:
    'Make better financial decisions. Accounting, audit, tax, VAT and financial intelligence for Bangladeshi businesses — with free tools, verified NBR rates and a compliance calendar.',
  applicationName: 'DhakaFin',
  keywords: [
    'accounting firm Bangladesh',
    'TDS rate Bangladesh',
    'VDS rate',
    'VAT return Mushak 9.1',
    'income tax slab Bangladesh',
    'financial intelligence',
    'virtual CFO Bangladesh',
  ],
  authors: [{ name: 'DhakaFin' }],
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: tokens['color.void'],
  colorScheme: 'dark',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // A locale segment that is not a real locale is a 404, not a silent fallback.
  // Falling back would serve English content at a Bengali URL and let a search
  // engine index it as duplicate content.
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={htmlLang[locale]}
      data-tier="high"
      data-motion="on"
      data-theme="dark"
      data-locale={locale}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        {/* Applies a stored "Reduce effects" preference before paint → no flash. */}
        <script dangerouslySetInnerHTML={{ __html: tierBootstrapScript }} />
      </head>
      <body className="min-h-dvh bg-void antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
