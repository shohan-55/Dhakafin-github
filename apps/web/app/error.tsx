'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/States';

/**
 * Route error boundary — calm, specific, always with a way forward.
 * The digest is the correlation id support can trace (Sentry attaches the same id
 * once wired in DF-P1-013).
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replaced by Sentry.captureException in DF-P1-013; console keeps dev visible.
    console.error('[DhakaFin] route error', error);
  }, [error]);

  return (
    <main id="main" className="df-container df-container-wide py-24">
      <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">Unexpected error</p>

      <h1 className="mt-4 max-w-2xl text-h1 text-[var(--df-color-text-strong)]">
        We couldn&apos;t load this page.
      </h1>

      <div className="mt-8 max-w-2xl">
        <ErrorState
          title="The page failed to render"
          description="This is on our side, not yours. Nothing you entered has been lost. You can retry, or reach the team directly if it keeps happening."
          reference={error.digest}
          onRetry={reset}
          href="/contact"
          hrefLabel="Contact support"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button onClick={reset} size="md">
          Try again
        </Button>
        <Button variant="secondary" size="md" onClick={() => (window.location.href = '/')}>
          Go to home
        </Button>
      </div>
    </main>
  );
}
