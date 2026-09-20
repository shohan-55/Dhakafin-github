import { cn } from '@/lib/cn';
import { Badge } from './Badge';

/**
 * System states — DFDS component #19/#20 (blueprint §5.14.2).
 *
 * Design rule: an empty state is never a sad-face illustration and never a dead
 * end. It states what the space is for, then gives the exact next action.
 * Error states are calm, specific and always contain a way forward.
 */

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; href?: string; onClick?: () => void };
  secondaryAction?: { label: string; href: string };
  /** Renders an icon glyph instead of illustration art. */
  glyph?: string;
  tone?: 'neutral' | 'positive';
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  secondaryAction,
  glyph = '◌',
  tone = 'neutral',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-xl border border-dashed px-6 py-12 text-center',
        tone === 'positive'
          ? 'border-[color-mix(in_srgb,var(--df-color-ok)_35%,transparent)] bg-[color-mix(in_srgb,var(--df-color-ok)_5%,transparent)]'
          : 'border-[var(--df-color-border-strong)] bg-surface1/50',
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'grid h-11 w-11 place-items-center rounded-full border text-lg',
          tone === 'positive'
            ? 'border-[color-mix(in_srgb,var(--df-color-ok)_40%,transparent)] text-ok'
            : 'border-[var(--df-color-border)] text-sea-400'
        )}
      >
        {glyph}
      </span>

      <h3 className="mt-4 text-h4 font-semibold text-[var(--df-color-text-strong)]">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>

      {action || secondaryAction ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {action ? (
            action.href ? (
              <a
                href={action.href}
                className="inline-flex h-11 items-center rounded-lg bg-sea-500 px-5 text-sm font-semibold text-[var(--df-color-void)] no-underline transition-colors hover:bg-sea-400"
              >
                {action.label}
              </a>
            ) : (
              <button
                type="button"
                onClick={action.onClick}
                className="inline-flex h-11 items-center rounded-lg bg-sea-500 px-5 text-sm font-semibold text-[var(--df-color-void)] transition-colors hover:bg-sea-400"
              >
                {action.label}
              </button>
            )
          ) : null}

          {secondaryAction ? (
            <a
              href={secondaryAction.href}
              className="inline-flex h-11 items-center rounded-lg border border-[var(--df-color-border-strong)] px-5 text-sm font-medium text-[var(--df-color-text-strong)] no-underline transition-colors hover:border-[var(--df-color-border-hover)]"
            >
              {secondaryAction.label}
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  description: string;
  /** Short correlation id shown to the user and logged for support. */
  reference?: string;
  onRetry?: () => void;
  href?: string;
  hrefLabel?: string;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong on our side',
  description,
  reference,
  onRetry,
  href,
  hrefLabel,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-xl border border-[color-mix(in_srgb,var(--df-color-danger)_35%,transparent)] bg-[color-mix(in_srgb,var(--df-color-danger)_6%,transparent)] p-6',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[color-mix(in_srgb,var(--df-color-danger)_45%,transparent)] text-xs font-bold text-danger"
        >
          !
        </span>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[var(--df-color-text-strong)]">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>

          {reference ? (
            <p className="df-num mt-2 text-xs text-[var(--df-color-muted-2)]">Reference: {reference}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex h-9 items-center rounded-lg border border-[var(--df-color-border-strong)] px-4 text-sm font-medium text-[var(--df-color-text-strong)] transition-colors hover:border-[var(--df-color-border-hover)]"
              >
                Try again
              </button>
            ) : null}

            {href ? (
              <a href={href} className="text-sm font-medium text-sea-400 no-underline hover:text-sea-300">
                {hrefLabel ?? 'Go back'} <span aria-hidden="true">→</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface SkeletonProps {
  className?: string;
  /** 1 = text line, 2 = title, 3 = block, 4 = circle */
  variant?: 1 | 2 | 3 | 4;
  lines?: number;
}

export function Skeleton({ className, variant = 1, lines = 1 }: SkeletonProps) {
  const heights = { 1: 'h-4', 2: 'h-6', 3: 'h-24', 4: 'h-10 w-10' } as const;

  if (lines > 1) {
    return (
      <div className={cn('space-y-2', className)} aria-hidden="true">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn('df-shimmer rounded', heights[variant], index === lines - 1 && 'w-3/5')}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn('df-shimmer rounded', heights[variant], variant === 4 && 'rounded-full', className)}
    />
  );
}

/** Suspense fallback for a KPI row — mirrors the real layout to avoid layout shift. */
export function KpiSkeletonRow({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-xl border border-[var(--df-color-border)] bg-surface1 p-5">
          <Skeleton className="w-24" />
          <Skeleton variant={2} className="mt-4 w-32" />
          <Skeleton className="mt-3 w-40" />
          <Skeleton className="mt-4 w-28" />
        </div>
      ))}
    </div>
  );
}

export interface AlertProps {
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'regulatory';
  title: string;
  children?: React.ReactNode;
  action?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}

const alertTones = {
  info: { border: 'border-[var(--df-color-border-strong)]', bg: 'bg-surface1', text: 'text-sea-300', glyph: 'i' },
  success: { border: 'border-[color-mix(in_srgb,var(--df-color-ok)_40%,transparent)]', bg: 'bg-[color-mix(in_srgb,var(--df-color-ok)_6%,transparent)]', text: 'text-ok', glyph: '✓' },
  warning: { border: 'border-[color-mix(in_srgb,var(--df-color-warn)_40%,transparent)]', bg: 'bg-[color-mix(in_srgb,var(--df-color-warn)_6%,transparent)]', text: 'text-warn', glyph: '▲' },
  danger: { border: 'border-[color-mix(in_srgb,var(--df-color-danger)_40%,transparent)]', bg: 'bg-[color-mix(in_srgb,var(--df-color-danger)_6%,transparent)]', text: 'text-danger', glyph: '!' },
  regulatory: { border: 'border-[color-mix(in_srgb,var(--df-color-gold-bright)_40%,transparent)]', bg: 'bg-[color-mix(in_srgb,var(--df-color-gold)_8%,transparent)]', text: 'text-gold-bright', glyph: '§' },
} as const;

/** Alert / banner — DFDS component #12. Also the home of the rate-update banner. */
export function Alert({ tone = 'info', title, children, action, className }: AlertProps) {
  const styles = alertTones[tone];

  return (
    <div
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
      className={cn('flex items-start gap-3 rounded-xl border p-4', styles.border, styles.bg, className)}
    >
      <span
        aria-hidden="true"
        className={cn('mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-[11px] font-bold', styles.text)}
      >
        {styles.glyph}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--df-color-text-strong)]">{title}</p>
        {children ? <div className="mt-1 text-sm leading-relaxed text-muted">{children}</div> : null}

        {action ? (
          <div className="mt-3">
            {action.href ? (
              <a href={action.href} className="text-sm font-medium text-sea-400 no-underline hover:text-sea-300">
                {action.label} <span aria-hidden="true">→</span>
              </a>
            ) : (
              <button type="button" onClick={action.onClick} className="text-sm font-medium text-sea-400 hover:text-sea-300">
                {action.label} <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Data-provenance footer used under every rate table and tool result. */
export function ProvenanceNote({
  verifiedAt,
  verifiedBy,
  sourceLabel = 'NBR sources',
  className,
}: {
  verifiedAt: string;
  verifiedBy: string;
  sourceLabel?: string;
  className?: string;
}) {
  return (
    <p className={cn('flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted', className)}>
      <Badge tone="sea" size="sm" glyph="✓">
        Verified
      </Badge>
      <span className="df-num">{verifiedAt}</span>
      <span className="text-[var(--df-color-muted-2)]">by {verifiedBy}</span>
      <span aria-hidden="true" className="text-[var(--df-color-muted-2)]">·</span>
      <span>Source: {sourceLabel}</span>
      <span aria-hidden="true" className="text-[var(--df-color-muted-2)]">·</span>
      <span>DhakaFin verifies rates within 48 working hours of NBR publication.</span>
    </p>
  );
}
