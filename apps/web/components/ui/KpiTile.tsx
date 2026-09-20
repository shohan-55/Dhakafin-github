import { cn } from '@/lib/cn';
import { deltaDirection, formatBDT, formatDelta } from '@/lib/format';
import { Badge } from './Badge';

export interface KpiTileProps {
  label: string;
  value: number;
  /** Percentage change vs the comparison period. */
  delta: number;
  /**
   * Plain-language judgement, 2–4 words: "Growth accelerating", "Margin softening".
   * Required by design — a bare number is not allowed in DhakaFin (blueprint §5.7.2).
   */
  qualifier: string;
  /** What actually drove the change. Rendered as a link to the explanation. */
  driver?: { text: string; href?: string };
  /** Fiscal period and comparison basis — always visible, never implied. */
  period: string;
  /** True when the delta direction is not automatically good (e.g. costs down = good). */
  invertDelta?: boolean;
  /** Lowercase qualifier line for KPIs where "up" is bad. */
  currency?: boolean;
  compact?: boolean;
  /** Marks illustrative/demo figures. Never let sample data look like real data. */
  sample?: boolean;
  className?: string;
  href?: string;
}

/**
 * KPI Tile — DFDS component #4, and the single clearest expression of the product
 * philosophy: "numbers tell you what happened, intelligence tells you what to do next".
 *
 * Every tile is REQUIRED to carry six elements:
 *   1. label   2. value   3. delta   4. qualifier (plain-language judgement)
 *   5. driver  6. period/source
 * A tile missing qualifier or period does not compile — the types enforce the rule
 * that reviewers would otherwise have to catch by eye.
 */
export function KpiTile({
  label,
  value,
  delta,
  qualifier,
  driver,
  period,
  invertDelta = false,
  currency = true,
  compact = false,
  sample = false,
  className,
  href,
}: KpiTileProps) {
  const direction = deltaDirection(delta);
  const positive = invertDelta ? direction === 'down' : direction === 'up';
  const negative = invertDelta ? direction === 'up' : direction === 'down';

  const deltaTone = direction === 'flat'
    ? 'text-muted'
    : positive
      ? 'text-ok'
      : negative
        ? 'text-danger'
        : 'text-muted';

  const Wrapper = href ? 'a' : 'div';

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={cn(
        'group relative flex flex-col gap-3 rounded-xl border border-[var(--df-color-border)] bg-surface1 p-5',
        'shadow-[var(--shadow-1)] transition-[transform,border-color,box-shadow]',
        'duration-[var(--df-duration-slow)] ease-[var(--ease-out)]',
        href && 'block no-underline hover:-translate-y-0.5 hover:border-[var(--df-color-border-hover)] hover:shadow-[var(--shadow-3)] motion-reduce:hover:translate-y-0',
        className
      )}
    >
      <span
        aria-hidden="true"
        className="df-edge-top"
      />

      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
        {sample ? (
          <Badge tone="sample" size="sm">
            Sample
          </Badge>
        ) : null}
      </div>

      <div className="flex items-baseline gap-2.5">
        <span className={cn('df-num font-medium tabular-nums text-[var(--df-color-text-strong)]', compact ? 'text-metric' : 'text-metric-xl')}>
          {currency ? formatBDT(value, { compact: true }) : value.toLocaleString('en-IN')}
        </span>
        <span className={cn('df-num inline-flex items-center gap-0.5 text-sm font-medium tabular-nums', deltaTone)}>
          <span aria-hidden="true">{direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→'}</span>
          {formatDelta(delta)}
        </span>
      </div>

      <p className="text-sm font-medium text-[var(--df-color-text)]">{qualifier}</p>

      <div className="mt-auto space-y-1">
        {driver ? (
          <p className="text-xs text-muted">
            <span className="text-[var(--df-color-muted)]">Driver: </span>
            {driver.href ? (
              <a href={driver.href} className="text-sea-400 no-underline hover:text-sea-300 hover:underline">
                {driver.text}
              </a>
            ) : (
              driver.text
            )}
          </p>
        ) : null}
        <p className="text-xs text-[var(--df-color-muted)]">{period}</p>
      </div>
    </Wrapper>
  );
}

export interface KpiRowProps {
  children: React.ReactNode;
  className?: string;
  /** Column count at desktop; mobile is always a 1–2 column snap grid. */
  columns?: 2 | 3 | 4;
}

export function KpiRow({ children, className, columns = 4 }: KpiRowProps) {
  const cols = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  }[columns];

  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2', cols, className)} role="list">
      {children}
    </div>
  );
}
