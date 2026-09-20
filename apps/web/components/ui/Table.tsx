import { cn } from '@/lib/cn';

/**
 * Table / Ledger — DFDS component #5.
 *
 * The most important component in a financial product. Rules baked in here:
 *  - Numeric cells use tabular figures and are right-aligned (comparison by column).
 *  - Hairline grid + 2% zebra, never heavy borders.
 *  - Sticky header; horizontal scroll container so mobile never breaks layout.
 *  - Every table renders a visible caption describing what it shows (also the
 *    accessible name).
 */

export function TableWrap({
  children,
  className,
  /** Message announced to screen readers describing the table's purpose. */
  caption,
  stickyHeader = true,
}: {
  children: React.ReactNode;
  className?: string;
  caption: string;
  stickyHeader?: boolean;
}) {
  return (
    <div className={cn('df-scroll-x w-full rounded-xl border border-[var(--df-color-border)] bg-surface1', className)}>
      <table
        className={cn(
          'w-full min-w-[640px] border-collapse text-sm',
          stickyHeader && '[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-[var(--df-z-index-grid)]'
        )}
      >
        <caption className="df-sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export function THead({ children, className, ...rest }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('bg-surface2/95 backdrop-blur-sm', className)} {...rest}>
      {children}
    </thead>
  );
}

export function TR({
  children,
  className,
  hoverable = true,
  ...rest
}: React.HTMLAttributes<HTMLTableRowElement> & { hoverable?: boolean }) {
  return (
    <tr
      className={cn(
        'border-b border-[var(--df-color-border-quiet)] last:border-0',
        hoverable && 'transition-colors duration-[var(--df-duration-fast)] hover:bg-[var(--df-color-surface-tint)]',
        className
      )}
      {...rest}
    >
      {children}
    </tr>
  );
}

export function TH({
  children,
  numeric = false,
  className,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <th
      scope="col"
      className={cn(
        'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted',
        numeric && 'text-right',
        className
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

export function TD({
  children,
  numeric = false,
  className,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <td
      className={cn(
        'px-4 py-3.5 align-top text-[var(--df-color-text)]',
        numeric && 'df-num text-right tabular-nums',
        className
      )}
      {...rest}
    >
      {children}
    </td>
  );
}

/** Compact empty row so a table never renders as a broken shell. */
export function TEmptyRow({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-muted">
        {children}
      </td>
    </tr>
  );
}
