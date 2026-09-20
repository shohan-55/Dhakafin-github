'use client';

import { useId } from 'react';
import { useExperienceTier } from './ExperienceTierProvider';
import { cn } from '@/lib/cn';

interface TierControlsProps {
  /** `toggle` = simple accessibility escape hatch; `full` = gallery/debug switcher */
  variant?: 'toggle' | 'full';
  className?: string;
}

/**
 * The "Reduce effects" control — an accessibility escape hatch that is also a
 * performance control. Present in the footer of every page (blueprint §3.9).
 */
interface ReduceEffectsToggleProps {
  className?: string;
  /** Translated visible label. Defaults to English so the design-system gallery can render it bare. */
  label?: string;
  /** Translated explanation, surfaced as the accessible description. */
  hint?: string;
}

export function ReduceEffectsToggle({
  className,
  label = 'Reduce effects',
  hint = 'Fewer animations and effects. Honoured before the first paint.',
}: ReduceEffectsToggleProps) {
  const { preference, setPreference, tier } = useExperienceTier();
  const id = useId();
  const hintId = `${id}-hint`;
  const reduced = preference === 'reduced';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <label htmlFor={id} className="text-xs text-muted cursor-pointer select-none">
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={reduced}
        aria-describedby={hintId}
        onClick={() => setPreference(reduced ? 'auto' : 'reduced')}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors',
          'duration-[var(--df-duration-base)] ease-[var(--ease-out)]',
          reduced ? 'border-sea-500/60 bg-sea-500/25' : 'border-[var(--df-color-border)] bg-surface2'
        )}
      >
        <span id={hintId} className="sr-only">
          {hint} (currently {reduced ? 'on' : 'off'}, experience tier {tier})
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-sea-400 transition-transform',
            'duration-[var(--df-duration-base)] ease-[var(--ease-out)]',
            reduced ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
}

/** Full tier switcher used on the internal design-system page. */
export function TierSwitcher({ className }: TierControlsProps) {
  const { tier, preference, setPreference } = useExperienceTier();

  return (
    <div
      role="group"
      aria-label="Experience tier"
      className={cn(
        'inline-flex flex-wrap items-center gap-1 rounded-lg border border-[var(--df-color-border)] bg-surface1 p-1',
        className
      )}
    >
      {(['auto', 'reduced'] as const).map((option) => {
        const active = preference === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => setPreference(option)}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              'duration-[var(--df-duration-fast)] ease-[var(--ease-out)]',
              active ? 'bg-sea-500/16 text-sea-300' : 'text-muted hover:text-[var(--df-color-text)]'
            )}
          >
            {option === 'auto' ? `Auto (${tier})` : 'Reduced'}
          </button>
        );
      })}
    </div>
  );
}
