import { NextResponse, type NextRequest } from 'next/server';

import { defaultLocale, isLocale } from '@/lib/i18n';

/**
 * Locale routing — DF-P2-001
 *
 * Next.js 16 renamed this convention from `middleware` to `proxy`; the file is
 * `proxy.ts` and the export is `proxy`. The behaviour is identical — it runs
 * before routing on every matched request.
 * ---------------------------------------------------------------------------
 * Implements the `as-needed` prefix scheme from `lib/i18n.ts`:
 *
 *   /                 → rewritten to /en internally, URL stays "/"
 *   /tools/vat        → rewritten to /en/tools/vat
 *   /bn               → served as-is
 *   /bn/tools/vat     → served as-is
 *   /en/tools/vat     → 308 redirect to /tools/vat  (canonicalisation)
 *
 * A REWRITE, not a redirect, for the default locale. A redirect would put a hop
 * between every visitor and the site, and would mean the English URL a user sees
 * differs from the one they typed. The rewrite keeps `/` as the canonical English
 * URL while still letting `[locale]` be a real route segment — which is what
 * makes `<html lang>` correct on the server.
 *
 * `/en/…` redirects rather than renders so that one page has exactly one URL.
 * Two URLs serving identical content splits ranking signals and makes analytics
 * lie about which page is being read.
 */
/**
 * Tag the request with the resolved locale.
 *
 * The root `app/not-found.tsx` sits outside the `[locale]` segment, so it has no
 * route params — and unlike a nested not-found, `headers()` there does not drag
 * the marketing pages into dynamic rendering. It is the only place the locale can
 * be read without either a client boundary or an all-dynamic segment.
 */
function withLocale(incoming: Headers, locale: string): Headers {
  const headers = new Headers(incoming);
  headers.set('x-dhakafin-locale', locale);
  return headers;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // ── Canonicalise an explicit default-locale prefix ────────────────────────
  // /en and /en/anything are not canonical URLs — drop the prefix permanently.
  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const stripped = pathname.slice(`/${defaultLocale}`.length) || '/';
    const url = request.nextUrl.clone();
    url.pathname = stripped;
    return NextResponse.redirect(url, 308);
  }

  // ── Already localised (a non-default locale) — let it through ─────────────
  const firstSegment = pathname.split('/')[1] ?? '';
  if (isLocale(firstSegment) && firstSegment !== defaultLocale) {
    return NextResponse.next({ request: { headers: withLocale(request.headers, firstSegment) } });
  }

  // ── Internal rewrite to the default locale ────────────────────────────────
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  url.search = search;
  return NextResponse.rewrite(url, { request: { headers: withLocale(request.headers, defaultLocale) } });
}

export const config = {
  /**
   * Skip anything that must never be locale-rewritten:
   *   _next/static, _next/image  — build assets
   *   api                        — route handlers
   *   files with an extension    — favicon.ico, robots.txt, sitemap.xml, og images
   *
   * Getting this wrong is the classic i18n bug: `/logo.svg` becomes
   * `/en/logo.svg` and every image on the site 404s.
   */
  matcher: ['/((?!_next/static|_next/image|api/|.*\\.[\\w]+$).*)'],
};
