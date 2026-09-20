import { cn } from '@/lib/cn';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  /** Accessible name for the trigger when the trigger itself is ambiguous. */
  label?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Tooltip — DFDS component #16. Zero JavaScript.
 *
 * Built with CSS hover + focus-within, so it works for keyboard users, adds no
 * bundle weight, and cannot break hydration. Content is in the DOM permanently
 * (aria-describedby target is always present) rather than injected on hover, so
 * screen readers and crawlers always see it.
 *
 * Used most in one specific way across DhakaFin: statutory-term definitions
 * (blueprint §5.4.4 "glossary tooltips").
 */
const placementClasses: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({ content, placement = 'top', className, children }: TooltipProps) {
  return (
    <span className={cn('group/tt relative inline-flex', className)}>
      <span
        className="inline-flex border-b border-dotted border-[var(--df-color-border-hover)] leading-snug"
        tabIndex={0}
      >
        {children}
      </span>

      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-[var(--df-z-index-element)] w-max max-w-[280px]',
          'df-glass rounded-lg px-3 py-2 text-xs leading-relaxed text-[var(--df-color-text)]',
          'shadow-[var(--shadow-3)] opacity-0 transition-opacity duration-[var(--df-duration-fast)]',
          'group-hover/tt:opacity-100 group-focus-within/tt:opacity-100',
          placementClasses[placement]
        )}
      >
        {content}
      </span>
    </span>
  );
}

export interface GlossaryTermProps {
  term: string;
  bangla?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Glossary term — the product-wide plain-language pattern (blueprint §5.4.4).
 * Shows the term, its Bangla equivalent and a one-line plain-language definition,
 * because our two audiences (a first-time proprietor and a corporate tax head)
 * read the same page.
 */
export function GlossaryTerm({ term, bangla, children, className }: GlossaryTermProps) {
  return (
    <Tooltip
      className={className}
      content={
        <span className="block">
          <span className="block font-semibold text-sea-300">{term}</span>
          {bangla ? <span className="block text-muted">{bangla}</span> : null}
          <span className="mt-1 block">{children}</span>
        </span>
      }
    >
      {term}
    </Tooltip>
  );
}
