'use client';

import { useCallback, useEffect, useId, useRef } from 'react';
import { cn } from '@/lib/cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Prevents ESC/backdrop dismissal for destructive or money-affecting flows. */
  dismissible?: boolean;
}

const sizeClasses = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' } as const;

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Modal — DFDS component #13.
 *
 * Implements the full accessible dialog contract: focus moves in on open, focus is
 * trapped while open, ESC closes (unless `dismissible={false}`), backdrop click
 * closes, body scroll locks, and focus returns to the trigger on close.
 * Exit animation delay is tier-aware so `lite` closes instantly.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  dismissible = true,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dismissible) {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [dismissible, onClose]
  );

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (firstFocusable ?? panel)?.focus();

    const scrollLock = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = scrollLock;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--df-z-index-overlay)] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-[var(--df-color-scrim)] backdrop-blur-[2px] animate-[df-fade_var(--df-duration-base)_var(--ease-out)_both]"
        onClick={dismissible ? onClose : undefined}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative w-full rounded-t-2xl border border-[var(--df-color-border-strong)] bg-surface3',
          'shadow-[var(--shadow-4)] outline-none sm:rounded-2xl',
          'animate-[df-rise_var(--df-duration-slow)_var(--ease-out)_both] motion-reduce:animate-none',
          sizeClasses[size]
        )}
      >
        <div className="flex items-start justify-between gap-6 border-b border-[var(--df-color-border-quiet)] p-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-h4 font-semibold text-[var(--df-color-text-strong)]">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1.5 text-sm leading-relaxed text-muted">
                {description}
              </p>
            ) : null}
          </div>

          {dismissible ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className={cn(
                'shrink-0 rounded-md p-2 text-muted transition-colors duration-[var(--df-duration-fast)]',
                'hover:bg-surface-tint hover:text-[var(--df-color-text)] focus-visible:outline-none'
              )}
            >
              <span aria-hidden="true">✕</span>
            </button>
          ) : null}
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>

        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--df-color-border-quiet)] bg-surface2/40 p-4 sm:rounded-b-2xl">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
