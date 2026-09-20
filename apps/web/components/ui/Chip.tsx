'use client';

import { cn } from '@/lib/cn';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  /** Renders a removable × with an accessible label. */
  onRemove?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Chip — filter/selection control (DFDS component #11).
 * Interactive by default (a real button), minimum 32px hit area with 8px separation,
 * and `aria-pressed` so assistive tech reports the selection state.
 */
export function Chip({
  selected = false,
  onRemove,
  icon,
  className,
  children,
  onClick,
  ...rest
}: ChipProps) {
  const removable = typeof onRemove === 'function';

  return (
    <span className="inline-flex">
      <button
        type="button"
        aria-pressed={onClick ? selected : undefined}
        onClick={onClick}
        className={cn(
          'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium',
          'transition-[background-color,border-color,color] duration-[var(--df-duration-fast)] ease-[var(--ease-out)]',
          'focus-visible:outline-none',
          selected
            ? 'border-sea-500/50 bg-sea-500/16 text-sea-200'
            : 'border-[var(--df-color-border)] bg-surface1 text-muted hover:border-[var(--df-color-border-hover)] hover:text-[var(--df-color-text)]',
          removable && 'rounded-r-none border-r-0',
          !onClick && 'cursor-default',
          className
        )}
        {...rest}
      >
        {icon ? <span aria-hidden="true" className="shrink-0 text-[0.9em]">{icon}</span> : null}
        {children}
      </button>

      {removable ? (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            'inline-flex h-8 w-7 items-center justify-center rounded-r-full border border-l-0 text-xs',
            'transition-colors duration-[var(--df-duration-fast)]',
            selected
              ? 'border-sea-500/50 bg-sea-500/16 text-sea-200 hover:bg-sea-500/25'
              : 'border-[var(--df-color-border)] bg-surface1 text-muted hover:text-[var(--df-color-text)]'
          )}
          aria-label={`Remove filter: ${typeof children === 'string' ? children : 'filter'}`}
        >
          <span aria-hidden="true">✕</span>
        </button>
      ) : null}
    </span>
  );
}

export interface ChipGroupProps {
  label: string;
  options: { id: string; label: string; hint?: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  /** Allows at most N selections (e.g. diagnostic "choose up to 2"). */
  max?: number;
  className?: string;
}

export function ChipGroup({ label, options, selected, onToggle, max, className }: ChipGroupProps) {
  const atLimit = typeof max === 'number' && selected.length >= max;

  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="group" aria-label={label}>
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        const disabled = atLimit && !isSelected;
        return (
          <span key={option.id} title={option.hint}>
            <Chip
              selected={isSelected}
              onClick={() => {
                if (disabled) return;
                onToggle(option.id);
              }}
              className={cn(disabled && 'cursor-not-allowed opacity-45')}
              aria-disabled={disabled || undefined}
            >
              {option.label}
            </Chip>
          </span>
        );
      })}
      {typeof max === 'number' ? (
        <p className="w-full text-xs text-muted" aria-live="polite">
          {selected.length} of {max} selected
        </p>
      ) : null}
    </div>
  );
}
