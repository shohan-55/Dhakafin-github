/**
 * Route-level loading state — a skeleton that mirrors the real hero layout so the
 * page has zero layout shift when content arrives (blueprint §5.14.2: never a
 * bare spinner for more than 300ms).
 */
export default function Loading() {
  return (
    <div className="df-container df-container-wide py-24" aria-busy="true" aria-live="polite">
      <span className="df-sr-only">Loading page content…</span>

      <div className="df-shimmer h-4 w-40 rounded" />

      <div className="mt-8 space-y-4">
        <div className="df-shimmer h-14 w-3/4 rounded-lg lg:h-20" />
        <div className="df-shimmer h-14 w-1/2 rounded-lg lg:h-20" />
      </div>

      <div className="mt-8 space-y-3">
        <div className="df-shimmer h-4 w-full max-w-2xl rounded" />
        <div className="df-shimmer h-4 w-full max-w-xl rounded" />
      </div>

      <div className="mt-10 flex gap-3">
        <div className="df-shimmer h-12 w-48 rounded-lg" />
        <div className="df-shimmer h-12 w-48 rounded-lg" />
      </div>

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-[var(--df-color-border)] bg-surface1 p-5">
            <div className="df-shimmer h-3 w-20 rounded" />
            <div className="df-shimmer mt-4 h-8 w-28 rounded" />
            <div className="df-shimmer mt-3 h-3 w-36 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
