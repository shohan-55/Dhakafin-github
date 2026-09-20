import { cn } from '@/lib/cn';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label: string;
  /** Hide the numeric readout when the value is already shown elsewhere. */
  hideValue?: boolean;
  tone?: 'sea' | 'ok' | 'warn' | 'risk' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

const toneBg: Record<NonNullable<ProgressBarProps['tone']>, string> = {
  sea: 'bg-[var(--df-gradient-focus)]',
  ok: 'bg-[var(--df-color-ok)]',
  warn: 'bg-[var(--df-color-warn)]',
  risk: 'bg-[var(--df-color-risk)]',
  danger: 'bg-[var(--df-color-danger)]',
};

/**
 * Progress bar — DFDS component #17.
 * Renders as a real progressbar role with a text label, so the value is announced
 * and is also visible in the DOM (never a bar with no accessible name).
 */
export function ProgressBar({
  value,
  max = 100,
  label,
  hideValue = false,
  tone = 'sea',
  size = 'md',
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, max));
  const percent = max === 0 ? 0 : (clamped / max) * 100;

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-xs text-muted">{label}</span>
        {!hideValue ? (
          <span className="df-num text-xs tabular-nums text-[var(--df-color-text)]">
            {Math.round(clamped)} / {max}
          </span>
        ) : null}
      </div>

      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className={cn(
          'w-full overflow-hidden rounded-full bg-surface3',
          size === 'sm' ? 'h-1' : 'h-1.5'
        )}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-[var(--df-duration-reveal)] ease-[var(--ease-out)] motion-reduce:transition-none', toneBg[tone])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export interface StepperProps {
  steps: { id: string; label: string }[];
  currentIndex: number;
  label: string;
  className?: string;
}

/**
 * Stepper — used by the diagnostic engine, quote wizard and onboarding
 * (blueprint §5.8.2, §5.11.3). Shows "Step N of M" textually as well as visually.
 */
export function Stepper({ steps, currentIndex, label, className }: StepperProps) {
  return (
    <ol className={cn('flex items-center gap-2', className)} aria-label={label}>
      <li className="sr-only">
        Step {currentIndex + 1} of {steps.length}: {steps[currentIndex]?.label}
      </li>

      {steps.map((step, index) => {
        const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming';
        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-center gap-2">
            <span
              aria-hidden="true"
              className={cn(
                'grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-semibold',
                state === 'done' && 'border-sea-500 bg-sea-500 text-[var(--df-color-void)]',
                state === 'current' && 'border-sea-400 bg-sea-500/16 text-sea-300',
                state === 'upcoming' && 'border-[var(--df-color-border)] bg-surface1 text-muted'
              )}
            >
              {state === 'done' ? '✓' : index + 1}
            </span>

            <span
              aria-hidden="true"
              className={cn(
                'hidden truncate text-xs md:block',
                state === 'current' ? 'text-[var(--df-color-text)]' : 'text-muted'
              )}
            >
              {step.label}
            </span>

            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn(
                  'h-px min-w-3 flex-1',
                  index < currentIndex ? 'bg-sea-500/60' : 'bg-[var(--df-color-border-quiet)]'
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export interface RadialProgressProps {
  value: number;
  max?: number;
  label: string;
  caption?: string;
  size?: number;
  tone?: 'sea' | 'ok' | 'warn' | 'risk' | 'danger';
}

const strokeColour: Record<NonNullable<RadialProgressProps['tone']>, string> = {
  sea: 'var(--df-color-sea-400)',
  ok: 'var(--df-color-ok)',
  warn: 'var(--df-color-warn)',
  risk: 'var(--df-color-risk)',
  danger: 'var(--df-color-danger)',
};

/**
 * Radial progress ring — used for "days remaining" on compliance obligations
 * (blueprint §5.10.2) and for the business health score.
 * Data is still exposed as text: rings are a visual, never the only data channel.
 */
export function RadialProgress({
  value,
  max = 100,
  label,
  caption,
  size = 72,
  tone = 'sea',
}: RadialProgressProps) {
  const clamped = Math.max(0, Math.min(value, max));
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / max);

  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`${label}: ${clamped} of ${max}`}
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--df-color-surface3)"
            strokeWidth="4"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColour[tone]}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-[var(--df-duration-reveal)] ease-[var(--ease-out)] motion-reduce:transition-none"
          />
        </svg>

        <span className="absolute inset-0 grid place-items-center">
          <span className="df-num text-sm font-medium tabular-nums text-[var(--df-color-text-strong)]">
            {clamped}
          </span>
        </span>
      </div>

      <span className="min-w-0">
        <span className="block text-xs font-medium text-[var(--df-color-text)]">{label}</span>
        {caption ? <span className="mt-0.5 block text-xs text-muted">{caption}</span> : null}
      </span>
    </div>
  );
}
