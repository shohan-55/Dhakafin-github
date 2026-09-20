'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { ErrorState } from '@/components/ui/States';
import { getDictionary } from '@/lib/dictionary';
import { localeHref } from '@/lib/i18n';

/**
 * Route error boundary — calm, specific, always with a way forward.
 *
 * The digest is the correlation id support can trace; Sentry attaches the same id
 * once it is wired in (DF-P1-013). Until then the console keeps it visible in dev.
 *
 * Locale handling: an error boundary is a client component and receives no route
 * params, so the locale is derived from the pathname `proxy.ts` produced. Next.js
 * lazy-loads error boundaries, so a visitor who never sees an error never pays
 * for the dictionary — checked by the bundle budget gate.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = pathname === '/bn' || pathname?.startsWith('/bn/') ? 'bn' : 'en';
  const t = getDictionary(locale).states.error;

  useEffect(() => {
    console.error('[DhakaFin] route error', error);
  }, [error]);

  return (
    <main id="main" className="df-container df-container-wide py-24">
      <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">{t.eyebrow}</p>

      <h1 className="mt-4 max-w-2xl text-h1 text-[var(--df-color-text-strong)]">{t.heading}</h1>

      <div className="mt-8 max-w-2xl">
        <ErrorState
          title={t.title}
          description={t.body}
          reference={error.digest}
          referenceLabel={t.reference}
          onRetry={reset}
          retryLabel={t.retry}
          href={localeHref(locale, '/')}
          hrefLabel={t.home}
        />
      </div>
    </main>
  );
}
