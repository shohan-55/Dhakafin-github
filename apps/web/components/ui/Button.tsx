'use client';

import { forwardRef, useCallback, useRef } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'regulatory' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Magnetic drift toward the cursor (desktop, ultra/high tiers only). */
  magnetic?: boolean;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Button — DFDS component #1.
 *
 * Design rules encoded here (blueprint §3.2.7, §5.14.3):
 *  - Primary = sea-500 fill with VOID text. White on sea-500 measures 2.49:1 and
 *    is forbidden; dark-on-sea measures 8.00:1 and is the only legal combination.
 *  - Press feedback is 40ms/0.98 scale; hover is a 1px lift + border brighten.
 *  - Magnetic drift is capped at 6px and disabled on touch and lighter tiers.
 *  - Loading swaps an inline spinner without changing the button width (no layout shift).
 */

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-sea-500 text-[var(--df-color-void)] font-semibold',
    'hover:bg-sea-400 active:bg-sea-500',
    'shadow-[var(--shadow-2)] hover:shadow-[var(--shadow-3)]'
  ),
  secondary: cn(
    'border border-[var(--df-color-border-strong)] text-[var(--df-color-text-strong)] font-medium',
    'bg-surface1/40 hover:bg-surface-tint hover:border-[var(--df-color-border-hover)]'
  ),
  ghost: cn(
    'text-muted hover:text-[var(--df-color-text-strong)] hover:bg-surface-tint',
    'border border-transparent font-medium'
  ),
  regulatory: cn(
    'border border-[color-mix(in_srgb,var(--df-color-gold-bright)_45%,transparent)] font-medium',
    'text-gold-bright bg-[color-mix(in_srgb,var(--df-color-gold)_12%,transparent)]',
    'hover:bg-[color-mix(in_srgb,var(--df-color-gold)_20%,transparent)]'
  ),
  danger: cn(
    'border border-[color-mix(in_srgb,var(--df-color-danger)_45%,transparent)] font-medium',
    'text-danger bg-[color-mix(in_srgb,var(--df-color-danger)_10%,transparent)]',
    'hover:bg-[color-mix(in_srgb,var(--df-color-danger)_18%,transparent)]'
  ),
  link: 'text-sea-400 hover:text-sea-300 underline underline-offset-4 decoration-sea-400/40 hover:decoration-current font-medium px-0',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5 rounded-md',
  md: 'h-11 px-5 text-sm gap-2 rounded-lg',
  lg: 'h-[52px] px-6 text-base gap-2 rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    magnetic = false,
    loading = false,
    leadingIcon,
    trailingIcon,
    fullWidth = false,
    className,
    children,
    disabled,
    ...rest
  },
  forwardedRef
) {
  const innerRef = useRef<HTMLButtonElement | null>(null);
  const frame = useRef<number | null>(null);

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    },
    [forwardedRef]
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!magnetic || event.pointerType !== 'mouse') return;
      const el = innerRef.current;
      if (!el) return;

      const root = document.documentElement;
      const spotlightAllowed = root.dataset.tier === 'ultra' || root.dataset.tier === 'high';
      if (root.dataset.motion === 'off' || !spotlightAllowed) return;

      const rect = el.getBoundingClientRect();
      const dx = Math.max(-6, Math.min(6, (event.clientX - (rect.left + rect.width / 2)) * 0.12));
      const dy = Math.max(-6, Math.min(6, (event.clientY - (rect.top + rect.height / 2)) * 0.18));

      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
    },
    [magnetic]
  );

  const resetMagnet = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.transform = '';
  }, []);

  const isDisabled = disabled || loading;

  return (
    <button
      ref={setRefs}
      type={rest.type ?? 'button'}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      data-variant={variant}
      onPointerMove={onPointerMove}
      onPointerLeave={resetMagnet}
      onBlur={resetMagnet}
      className={cn(
        'relative inline-flex select-none items-center justify-center whitespace-nowrap',
        'transition-[transform,background-color,border-color,box-shadow,color]',
        'duration-[var(--df-duration-fast)] ease-[var(--ease-out)]',
        'active:scale-[0.98] motion-reduce:active:scale-100',
        'focus-visible:outline-none',
        sizeClasses[size],
        variantClasses[variant],
        variant === 'link' && 'h-auto',
        fullWidth && 'w-full',
        isDisabled && 'pointer-events-none opacity-50',
        className
      )}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center"
        >
          <span
            className={cn(
              'h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent',
              'motion-reduce:animate-none'
            )}
          />
        </span>
      ) : null}

      <span className={cn('inline-flex items-center gap-2', loading && 'invisible')}>
        {leadingIcon ? <span aria-hidden="true" className="shrink-0">{leadingIcon}</span> : null}
        {children}
        {trailingIcon ? <span aria-hidden="true" className="shrink-0">{trailingIcon}</span> : null}
      </span>
    </button>
  );
});

export interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Magnetic drift toward the cursor (desktop, ultra/high tiers only). */
  magnetic?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
  /** Adds an external-link indicator and the right rel/target pair. */
  external?: boolean;
}

/** Anchor variant — same visual language, real link semantics. */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  magnetic = false,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  external = false,
  className,
  children,
  href,
  ...rest
}: ButtonLinkProps) {
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const frame = useRef<number | null>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!magnetic || event.pointerType !== 'mouse') return;
    const el = linkRef.current;
    if (!el) return;

    const root = document.documentElement;
    if (root.dataset.motion === 'off' || (root.dataset.tier !== 'ultra' && root.dataset.tier !== 'high')) return;

    const rect = el.getBoundingClientRect();
    const dx = Math.max(-6, Math.min(6, (event.clientX - (rect.left + rect.width / 2)) * 0.12));
    const dy = Math.max(-6, Math.min(6, (event.clientY - (rect.top + rect.height / 2)) * 0.18));

    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    });
  };

  const resetMagnet = () => {
    const el = linkRef.current;
    if (el) el.style.transform = '';
  };

  return (
    <a
      ref={linkRef}
      href={href}
      onPointerMove={onPointerMove}
      onPointerLeave={resetMagnet}
      onBlur={resetMagnet}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'relative inline-flex select-none items-center justify-center whitespace-nowrap no-underline',
        'transition-[transform,background-color,border-color,box-shadow,color]',
        'duration-[var(--df-duration-fast)] ease-[var(--ease-out)]',
        'active:scale-[0.98] motion-reduce:active:scale-100',
        'focus-visible:outline-none hover:no-underline',
        sizeClasses[size],
        variantClasses[variant],
        variant === 'link' && 'h-auto',
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {leadingIcon ? <span aria-hidden="true" className="shrink-0">{leadingIcon}</span> : null}
      {children}
      {trailingIcon || external ? (
        <span aria-hidden="true" className="shrink-0">
          {trailingIcon ?? '↗'}
        </span>
      ) : null}
    </a>
  );
}
