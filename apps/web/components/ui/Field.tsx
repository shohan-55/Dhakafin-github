'use client';

import { forwardRef, useId, useState } from 'react';
import { cn } from '@/lib/cn';

export interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  hint?: string;
  error?: string;
  success?: string;
  /** Money field: shows a ৳ prefix and switches to numeric input mode on mobile. */
  currency?: boolean;
  suffix?: string;
  inputSize?: 'sm' | 'md' | 'lg';
}

/**
 * Field — DFDS component #2.
 *
 * Accessibility: a real <label> is always rendered (never placeholder-only),
 * help and error text are wired through aria-describedby, errors set aria-invalid,
 * and the error message is announced politely. Numeric fields get inputMode so
 * mobile keyboards open the number pad — critical for Bangladeshi users on phones.
 */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, error, success, currency = false, suffix, inputSize = 'md', className, id, required, ...rest },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? `field-${autoId}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const successId = success ? `${fieldId}-success` : undefined;
  const describedBy = [hintId, errorId, successId].filter(Boolean).join(' ') || undefined;

  const sizeClasses = {
    sm: 'h-9 text-sm',
    md: 'h-11 text-sm',
    lg: 'h-[52px] text-base',
  }[inputSize];

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <label htmlFor={fieldId} className="text-xs font-medium text-muted">
        {label}
        {required ? <span className="ml-0.5 text-sea-400" aria-hidden="true">*</span> : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>

      <div
        className={cn(
          'group flex items-center gap-2 rounded-lg border bg-surface1 px-3',
          'transition-[border-color,box-shadow] duration-[var(--df-duration-fast)] ease-[var(--ease-out)]',
          'focus-within:border-sea-400 focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--df-color-sea-400)_18%,transparent)]',
          error
            ? 'border-[color-mix(in_srgb,var(--df-color-danger)_55%,transparent)]'
            : 'border-[var(--df-color-border)] hover:border-[var(--df-color-border-hover)]',
          sizeClasses
        )}
      >
        {currency ? (
          <span aria-hidden="true" className="df-num shrink-0 text-muted">
            ৳
          </span>
        ) : null}

        <input
          ref={ref}
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          inputMode={rest.type === 'number' || currency ? 'decimal' : rest.inputMode}
          className={cn(
            'h-full w-full min-w-0 bg-transparent text-[var(--df-color-text-strong)] outline-none',
            'placeholder:text-[var(--df-color-muted-2)]',
            (rest.type === 'number' || currency) && 'df-num tabular-nums'
          )}
          {...rest}
        />

        {suffix ? (
          <span aria-hidden="true" className="shrink-0 text-xs text-muted">
            {suffix}
          </span>
        ) : null}
      </div>

      {hint && !error ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 text-xs font-medium text-danger" role="alert">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      ) : null}

      {success && !error ? (
        <p id={successId} className="flex items-start gap-1.5 text-xs font-medium text-ok">
          <span aria-hidden="true">✓</span>
          {success}
        </p>
      ) : null}
    </div>
  );
});

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

/** Native select — accessible, mobile-friendly and fast. Styled to the DFDS spec. */
export function SelectField({
  label,
  hint,
  error,
  options,
  placeholder,
  className,
  id,
  required,
  ...rest
}: SelectFieldProps) {
  const autoId = useId();
  const fieldId = id ?? `select-${autoId}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <label htmlFor={fieldId} className="text-xs font-medium text-muted">
        {label}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>

      <div className="relative">
        <select
          id={fieldId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'h-11 w-full appearance-none rounded-lg border bg-surface1 px-3 pr-10 text-sm',
            'text-[var(--df-color-text-strong)] outline-none',
            'transition-[border-color,box-shadow] duration-[var(--df-duration-fast)] ease-[var(--ease-out)]',
            'focus:border-sea-400 focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--df-color-sea-400)_18%,transparent)]',
            error
              ? 'border-[color-mix(in_srgb,var(--df-color-danger)_55%,transparent)]'
              : 'border-[var(--df-color-border)] hover:border-[var(--df-color-border-hover)]'
          )}
          {...rest}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-muted"
        >
          ▾
        </span>
      </div>

      {hint && !error ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 text-xs font-medium text-danger" role="alert">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
  /** Warns the writer when the message is getting long (used by contact/quote forms). */
  showCount?: boolean;
}

export function TextareaField({
  label,
  hint,
  error,
  showCount = false,
  className,
  id,
  required,
  maxLength,
  value,
  defaultValue,
  ...rest
}: TextareaFieldProps) {
  const autoId = useId();
  const fieldId = id ?? `textarea-${autoId}`;
  const [count, setCount] = useState(String(value ?? defaultValue ?? '').length);

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <label htmlFor={fieldId} className="text-xs font-medium text-muted">
        {label}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>

      <textarea
        id={fieldId}
        required={required}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => {
          setCount(event.target.value.length);
          rest.onChange?.(event);
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hint ? `${fieldId}-hint` : null, error ? `${fieldId}-error` : null].filter(Boolean).join(' ') || undefined}
        className={cn(
          'min-h-[120px] w-full resize-y rounded-lg border bg-surface1 px-3 py-2.5 text-sm leading-relaxed',
          'text-[var(--df-color-text-strong)] outline-none placeholder:text-[var(--df-color-muted-2)]',
          'transition-[border-color,box-shadow] duration-[var(--df-duration-fast)] ease-[var(--ease-out)]',
          'focus:border-sea-400 focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--df-color-sea-400)_18%,transparent)]',
          error
            ? 'border-[color-mix(in_srgb,var(--df-color-danger)_55%,transparent)]'
            : 'border-[var(--df-color-border)] hover:border-[var(--df-color-border-hover)]'
        )}
        {...rest}
      />

      <div className="flex items-start justify-between gap-3">
        {hint && !error ? (
          <p id={`${fieldId}-hint`} className="text-xs text-muted">
            {hint}
          </p>
        ) : (
          <span />
        )}
        {showCount && maxLength ? (
          <span className="df-num shrink-0 text-xs text-muted" aria-hidden="true">
            {count}/{maxLength}
          </span>
        ) : null}
      </div>

      {error ? (
        <p id={`${fieldId}-error`} className="flex items-start gap-1.5 text-xs font-medium text-danger" role="alert">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  hint?: string;
}

export function CheckboxField({ label, hint, className, id, ...rest }: CheckboxFieldProps) {
  const autoId = useId();
  const fieldId = id ?? `check-${autoId}`;

  return (
    <div className={cn('flex items-start gap-2.5', className)}>
      <input
        id={fieldId}
        type="checkbox"
        className={cn(
          'mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border bg-surface1',
          'border-[var(--df-color-border-strong)] transition-colors duration-[var(--df-duration-fast)]',
          'checked:border-sea-400 checked:bg-sea-500',
          'focus-visible:outline-none focus-visible:shadow-[var(--df-focus-ring)]'
        )}
        {...rest}
      />
      <div className="min-w-0">
        <label htmlFor={fieldId} className="cursor-pointer text-sm text-[var(--df-color-text)]">
          {label}
        </label>
        {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
      </div>
    </div>
  );
}
