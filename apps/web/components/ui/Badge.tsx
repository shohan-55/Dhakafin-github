import { cn } from '@/lib/cn';

export type BadgeTone = 'neutral' | 'sea' | 'regulatory' | 'ok' | 'warn' | 'risk' | 'danger' | 'ai' | 'sample';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
  /** Small leading glyph (never the only carrier of meaning — always paired with text). */
  glyph?: string;
  children: React.ReactNode;
}

/**
 * Badge — DFDS component #11.
 * Gold is reserved for regulatory provenance (effective dates, SRO references).
 * `sample` tone marks illustrative data — a trust-critical device: we never let
 * demo numbers look like a client's real figures (blueprint §5.1.6, §5.7.1).
 */
const toneClasses: Record<BadgeTone, string> = {
  neutral: 'border-[var(--df-color-border-quiet)] bg-surface2 text-muted',
  sea: 'border-sea-500/35 bg-sea-500/12 text-sea-300',
  regulatory:
    'border-[color-mix(in_srgb,var(--df-color-gold-bright)_40%,transparent)] bg-[color-mix(in_srgb,var(--df-color-gold)_14%,transparent)] text-gold-bright',
  ok: 'border-[color-mix(in_srgb,var(--df-color-ok)_35%,transparent)] bg-[color-mix(in_srgb,var(--df-color-ok)_12%,transparent)] text-ok',
  warn: 'border-[color-mix(in_srgb,var(--df-color-warn)_35%,transparent)] bg-[color-mix(in_srgb,var(--df-color-warn)_12%,transparent)] text-warn',
  risk: 'border-[color-mix(in_srgb,var(--df-color-risk)_35%,transparent)] bg-[color-mix(in_srgb,var(--df-color-risk)_12%,transparent)] text-risk',
  danger: 'border-[color-mix(in_srgb,var(--df-color-danger)_35%,transparent)] bg-[color-mix(in_srgb,var(--df-color-danger)_12%,transparent)] text-danger',
  ai: 'border-[color-mix(in_srgb,var(--df-color-violet-dusk)_40%,transparent)] bg-[color-mix(in_srgb,var(--df-color-violet-dusk)_14%,transparent)] text-[color-mix(in_srgb,var(--df-color-violet-dusk)_85%,white)]',
  sample: 'border-dashed border-[var(--df-color-border-strong)] bg-transparent text-muted',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[11px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
};

export function Badge({ tone = 'neutral', size = 'md', glyph, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium whitespace-nowrap',
        toneClasses[tone],
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      {glyph ? (
        <span aria-hidden="true" className="text-[0.9em] leading-none">
          {glyph}
        </span>
      ) : null}
      {children}
    </span>
  );
}

export interface StatusBadgeProps extends Omit<BadgeProps, 'tone' | 'glyph' | 'children'> {
  status: 'compliant' | 'due-soon' | 'overdue' | 'in-progress' | 'filed' | 'not-applicable';
}

/**
 * Status badge with icon + label + colour (WCAG 1.4.1: colour is never the only
 * signal). Used by compliance obligations, tasks and filings.
 */
const statusMap: Record<StatusBadgeProps['status'], { tone: BadgeTone; glyph: string; label: string }> = {
  compliant: { tone: 'ok', glyph: '✓', label: 'Compliant' },
  filed: { tone: 'ok', glyph: '✓', label: 'Filed' },
  'due-soon': { tone: 'warn', glyph: '▲', label: 'Due soon' },
  overdue: { tone: 'danger', glyph: '!', label: 'Overdue' },
  'in-progress': { tone: 'sea', glyph: '•', label: 'In progress' },
  'not-applicable': { tone: 'neutral', glyph: '—', label: 'Not applicable' },
};

export function StatusBadge({ status, size = 'md', className, ...rest }: StatusBadgeProps) {
  const config = statusMap[status];
  return (
    <Badge tone={config.tone} size={size} glyph={config.glyph} className={className} {...rest}>
      {config.label}
    </Badge>
  );
}
