import { cn } from '@/lib/cn';

export interface AccordionItem {
  id: string;
  question: string;
  answer: React.ReactNode;
  /** Optional meta line: "SRO 173-AIN/2025 · effective 01 Jul 2025" */
  meta?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Native name attribute → browser-enforced single-open behaviour, zero JS. */
  exclusive?: boolean;
  defaultOpenId?: string;
  className?: string;
}

/**
 * Accordion / Disclosure — DFDS component #18.
 *
 * Built on native <details>/<summary>: keyboard operable, screen-reader correct,
 * open by default for crawlers that execute JS, functional with JS disabled, and
 * cheap. The height animation uses the grid-template-rows 0fr→1fr technique so
 * there is no JavaScript measuring and therefore no layout shift.
 */
export function Accordion({ items, exclusive = true, defaultOpenId, className }: AccordionProps) {
  return (
    <div className={cn('divide-y divide-[var(--df-color-border-quiet)]', className)}>
      {items.map((item) => (
        <details
          key={item.id}
          name={exclusive ? 'df-accordion' : undefined}
          open={item.id === defaultOpenId}
          className="group py-1"
        >
          <summary
            className={cn(
              'flex cursor-pointer list-none items-start justify-between gap-4 rounded-lg px-3 py-4',
              'transition-colors duration-[var(--df-duration-fast)]',
              'hover:bg-surface-tint focus-visible:outline-none',
              '[&::-webkit-details-marker]:hidden'
            )}
          >
            <span className="min-w-0">
              <span className="block text-sm font-medium text-[var(--df-color-text-strong)] sm:text-base">
                {item.question}
              </span>
              {item.meta ? <span className="mt-1 block text-xs text-muted">{item.meta}</span> : null}
            </span>

            <span
              aria-hidden="true"
              className={cn(
                'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--df-color-border)]',
                'text-muted transition-transform duration-[var(--df-duration-base)] ease-[var(--ease-out)]',
                'group-open:rotate-45 group-open:border-sea-500/50 group-open:text-sea-300'
              )}
            >
              +
            </span>
          </summary>

          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[var(--df-duration-slow)] ease-[var(--ease-out)] group-open:grid-rows-[1fr] motion-reduce:transition-none">
            <div className="overflow-hidden">
              <div className="px-3 pb-5 pr-10 text-sm leading-relaxed text-muted">{item.answer}</div>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
