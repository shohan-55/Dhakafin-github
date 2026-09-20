'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

type ToastTone = 'success' | 'error' | 'info' | 'warning';
type ToastAction = { label: string; onClick: () => void };

interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Milliseconds; errors never auto-dismiss. */
  duration?: number;
  action?: ToastAction;
}

interface Toast extends ToastInput {
  id: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_VISIBLE = 3;
const DEFAULT_DURATION = 6000;

const toneStyles: Record<ToastTone, { border: string; icon: string; label: string }> = {
  success: { border: 'border-l-[var(--df-color-ok)]', icon: 'text-ok', label: 'Success' },
  error: { border: 'border-l-[var(--df-color-danger)]', icon: 'text-danger', label: 'Error' },
  warning: { border: 'border-l-[var(--df-color-warn)]', icon: 'text-warn', label: 'Warning' },
  info: { border: 'border-l-[var(--df-color-sea-400)]', icon: 'text-sea-400', label: 'Information' },
};

const toneGlyph: Record<ToastTone, string> = {
  success: '✓',
  error: '!',
  warning: '▲',
  info: 'i',
};

/**
 * Toast system — blueprint §5.14.2 / component #21.
 * Presentation: bottom-right on desktop, top on mobile.
 * Accessibility: polite live region, keyboard dismissible, errors never auto-dismiss,
 * and every toast carries an accessible label (colour is never the only signal).
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = `toast-${Math.random().toString(36).slice(2, 10)}`;
      const tone = input.tone ?? 'info';
      const next: Toast = { ...input, id, tone };

      setToasts((current) => [...current, next].slice(-MAX_VISIBLE));

      if (tone !== 'error') {
        const timer = setTimeout(() => dismiss(id), input.duration ?? DEFAULT_DURATION);
        timers.current.set(id, timer);
      }

      return id;
    },
    [dismiss]
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((timer) => clearTimeout(timer));
      map.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        className={cn(
          'pointer-events-none fixed inset-x-0 top-4 z-[var(--df-z-index-system)] flex flex-col gap-2 px-4',
          'md:inset-x-auto md:top-auto md:right-6 md:bottom-6 md:w-[380px] md:px-0'
        )}
      >
        <div aria-live="polite" aria-atomic="false" className="flex flex-col gap-2">
          {toasts.map((t) => {
            const tones = toneStyles[t.tone];
            return (
              <div
                key={t.id}
                className={cn(
                  'df-glass pointer-events-auto flex items-start gap-3 rounded-lg px-4 py-3 shadow-[var(--shadow-3)]',
                  'animate-[df-rise_var(--df-duration-slow)_var(--ease-out)_both]',
                  'border-l-2',
                  tones.border
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-[11px] font-bold',
                    tones.icon
                  )}
                >
                  {toneGlyph[t.tone]}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--df-color-text-strong)]">
                    <span className="sr-only">{tones.label}: </span>
                    {t.title}
                  </p>
                  {t.description ? (
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">{t.description}</p>
                  ) : null}

                  {t.action ? (
                    <button
                      type="button"
                      onClick={() => {
                        t.action?.onClick();
                        dismiss(t.id);
                      }}
                      className={cn(
                        'mt-2 rounded-md border border-[var(--df-color-border)] px-2.5 py-1 text-xs font-medium',
                        'text-sea-300 transition-colors duration-[var(--df-duration-fast)] hover:border-[var(--df-color-border-hover)]'
                      )}
                    >
                      {t.action.label}
                    </button>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  aria-label={`Dismiss notification: ${t.title}`}
                  className={cn(
                    'shrink-0 rounded-md p-1 text-muted transition-colors duration-[var(--df-duration-fast)]',
                    'hover:text-[var(--df-color-text)] focus-visible:outline-none'
                  )}
                >
                  <span aria-hidden="true" className="text-sm leading-none">
                    ✕
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
