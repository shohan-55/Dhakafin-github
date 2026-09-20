import { cn } from '@/lib/cn';

/**
 * DhakaFin wordmark + monogram.
 *
 * The monogram carries the brand's one piece of custom lettering: the vertical
 * stroke on the "D" is drawn as a rising bar chart inside the counter — the
 * visual shorthand for "financial intelligence". Drawn as inline SVG in
 * currentColor so it inherits tokens anywhere it is used (including the
 * eventual favicon/PWA maskable icon, blueprint Appendix I).
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-sea-500/40 bg-[var(--df-gradient-metal)]">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className="text-sea-300">
          <path
            d="M5 4.5h5.2c4.4 0 7.3 2.9 7.3 7.5s-2.9 7.5-7.3 7.5H5V4.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M8.6 15.6V9.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M11.4 15.6V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
          <path d="M14.2 15.6v-2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
        </svg>
      </span>

      {!compact ? (
        <span className="flex flex-col leading-none">
          <span className="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--df-color-text-strong)]">
            Dhaka<span className="text-sea-400">Fin</span>
          </span>
          <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--df-color-muted-2)]">
            Financial Intelligence
          </span>
        </span>
      ) : null}
    </span>
  );
}
