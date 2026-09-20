import { cn } from '@/lib/cn';
import { formatDueIn } from '@/lib/format';
import { RadialProgress } from './Progress';

export type DeadlineState = 'calm' | 'approaching' | 'urgent' | 'overdue' | 'completed';

export interface DeadlineItemProps {
  title: string;
  /** e.g. "Mushak 9.1" */
  formRef?: string;
  /** Whole days until the due date; negative means overdue. */
  daysRemaining: number;
  dueDate: string;
  /** Documents or actions still blocking this obligation. */
  requirements?: { description: string; met: number; total: number };
  owner?: string;
  penaltyNote?: string;
  primaryAction?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}

/**
 * DeadlineItem — DFDS component #8.
 *
 * Encodes the product's calm-urgency policy (blueprint §5.10.2). Urgency escalates
 * ONLY at these thresholds, and always with an icon + label as well as colour:
 *
 *   calm        > 14 days   sea accents
 *   approaching 8–14 days   warn + a single accent dot
 *   urgent      1–7 days    risk + countdown ring
 *   overdue     < 0 days    danger + penalty note + escalation CTA
 *   completed   —           ok, no urgency at all
 *
 * There is deliberately no flashing, no red flooding and no countdown clock —
 * the interface should feel intelligent, not stressful.
 */
function resolveState(daysRemaining: number): DeadlineState {
  if (daysRemaining < 0) return 'overdue';
  if (daysRemaining <= 7) return 'urgent';
  if (daysRemaining <= 14) return 'approaching';
  return 'calm';
}

const stateStyles: Record<DeadlineState, { border: string; dot: string; text: string; label: string; glyph: string }> = {
  calm: { border: 'border-[var(--df-color-border)]', dot: 'bg-sea-400', text: 'text-sea-300', label: 'On track', glyph: '○' },
  approaching: { border: 'border-[color-mix(in_srgb,var(--df-color-warn)_35%,transparent)]', dot: 'bg-warn', text: 'text-warn', label: 'Approaching', glyph: '▲' },
  urgent: { border: 'border-[color-mix(in_srgb,var(--df-color-risk)_45%,transparent)]', dot: 'bg-risk', text: 'text-risk', label: 'Action needed', glyph: '▲' },
  overdue: { border: 'border-[color-mix(in_srgb,var(--df-color-danger)_55%,transparent)]', dot: 'bg-danger', text: 'text-danger', label: 'Overdue', glyph: '!' },
  completed: { border: 'border-[var(--df-color-border-quiet)]', dot: 'bg-ok', text: 'text-ok', label: 'Completed', glyph: '✓' },
};

export function DeadlineItem({
  title,
  formRef,
  daysRemaining,
  dueDate,
  requirements,
  owner,
  penaltyNote,
  primaryAction,
  className,
}: DeadlineItemProps) {
  const state = resolveState(daysRemaining);
  const style = stateStyles[state];
  const isOverdue = state === 'overdue';

  return (
    <article
      className={cn('relative rounded-xl border bg-surface1 p-5', style.border, className)}
      aria-label={`${title}, ${formatDueIn(daysRemaining)}`}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', style.dot)}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-sm font-semibold text-[var(--df-color-text-strong)]">{title}</h3>
            {formRef ? (
              <span className="df-num rounded border border-[var(--df-color-border-quiet)] px-1.5 py-0.5 text-[11px] text-muted">
                {formRef}
              </span>
            ) : null}
          </div>

          <p className={cn('mt-1.5 flex items-center gap-1.5 text-xs font-medium', style.text)}>
            <span aria-hidden="true">{style.glyph}</span>
            <span>{style.label}</span>
            <span aria-hidden="true" className="text-[var(--df-color-muted)]">·</span>
            <span className="df-num text-[var(--df-color-text)]">{formatDueIn(daysRemaining)}</span>
            <span className="df-num text-[var(--df-color-muted)]">({dueDate})</span>
          </p>

          {requirements ? (
            <div className="mt-3">
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-xs text-muted">Documents received</span>
                <span className="df-num text-xs tabular-nums text-[var(--df-color-text)]">
                  {requirements.met} of {requirements.total}
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-surface3">
                <div
                  className="h-full rounded-full bg-[var(--df-gradient-focus)]"
                  style={{ width: `${(requirements.met / Math.max(1, requirements.total)) * 100}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted">{requirements.description}</p>
            </div>
          ) : null}

          {isOverdue && penaltyNote ? (
            <p className="mt-3 rounded-lg border border-[color-mix(in_srgb,var(--df-color-danger)_35%,transparent)] bg-[color-mix(in_srgb,var(--df-color-danger)_8%,transparent)] px-3 py-2 text-xs leading-relaxed text-[var(--df-color-text)]">
              <span className="font-semibold text-danger">Penalty risk: </span>
              {penaltyNote}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
            {owner ? <span>Owner: {owner}</span> : null}
            {primaryAction ? (
              primaryAction.href ? (
                <a
                  href={primaryAction.href}
                  className="font-medium text-sea-400 no-underline hover:text-sea-300"
                >
                  {primaryAction.label} <span aria-hidden="true">→</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={primaryAction.onClick}
                  className="font-medium text-sea-400 hover:text-sea-300"
                >
                  {primaryAction.label} <span aria-hidden="true">→</span>
                </button>
              )
            ) : null}
          </div>
        </div>

        {state !== 'completed' ? (
          <div className="hidden shrink-0 sm:block">
            <RadialProgress
              value={Math.max(0, Math.min(daysRemaining, 30))}
              max={30}
              label="Days left"
              tone={state === 'overdue' ? 'danger' : state === 'urgent' ? 'risk' : state === 'approaching' ? 'warn' : 'sea'}
              size={64}
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}
