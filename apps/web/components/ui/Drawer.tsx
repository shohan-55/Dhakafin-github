'use client';

import { useCallback, useEffect, useId, useRef } from 'react';
import { cn } from '@/lib/cn';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: 'right' | 'bottom';
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Drawer — DFDS component #14.
 *
 * On mobile the money-flow and service experiences open node detail in a bottom
 * sheet (blueprint §5.2.4); on desktop the same component presents as a side
 * panel from the right. One component, two presentations, identical a11y contract.
 */
export function Drawer({ open, onClose, title, description, children, footer, side = 'right' }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
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
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    (panel?.querySelector<HTMLElement>(FOCUSABLE) ?? panel)?.focus();

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

  const isBottom = side === 'bottom';

  return (
    <div className="fixed inset-0 z-[var(--df-z-index-overlay)]" role="presentation">
      <div
        className="absolute inset-0 bg-[var(--df-color-scrim)] animate-[df-fade_var(--df-duration-base)_var(--ease-out)_both]"
        onClick={onClose}
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
          'absolute flex flex-col border-[var(--df-color-border-strong)] bg-surface3 shadow-[var(--shadow-4)] outline-none',
          isBottom
            ? 'inset-x-0 bottom-0 max-h-[88dvh] rounded-t-2xl border-t animate-[df-rise_var(--df-duration-slow)_var(--ease-out)_both]'
            : 'inset-y-0 right-0 w-full max-w-[440px] border-l'
        )}
      >
        {/* Swipe affordance for the bottom sheet presentation */}
        {isBottom ? (
          <div className="flex justify-center pt-3" aria-hidden="true">
            <span className="h-1 w-10 rounded-full bg-[var(--df-color-border-strong)]" />
          </div>
        ) : null}

        <div className="flex items-start justify-between gap-4 border-b border-[var(--df-color-border-quiet)] p-5">
          <div className="min-w-0">
            <h2 id={titleId} className="text-h4 font-semibold text-[var(--df-color-text-strong)]">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 text-sm text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="shrink-0 rounded-md p-2 text-muted transition-colors hover:bg-surface-tint hover:text-[var(--df-color-text)] focus-visible:outline-none"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {footer ? (
          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--df-color-border-quiet)] bg-surface2/40 p-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
