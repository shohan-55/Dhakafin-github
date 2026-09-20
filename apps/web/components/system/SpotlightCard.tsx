'use client';

import { useCallback, useRef } from 'react';
import { cn } from '@/lib/cn';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'li' | 'section';
}

/**
 * Signature motion #6 — "Spotlight Card".
 * A radial highlight follows the pointer inside the card. Enabled only on
 * ultra/high tiers (CSS hides the effect on balanced/lite), and it never runs
 * during pointer drags or for keyboard users — hover/focus-within only.
 *
 * Cost: one CSS custom property write per pointer move (no React re-render,
 * no layout reads), throttled to animation frames.
 */
export function SpotlightCard({ children, className, as: Tag = 'div' }: SpotlightCardProps) {
  const ref = useRef<HTMLElement | null>(null);
  const frame = useRef<number | null>(null);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    if (event.pointerType !== 'mouse') return;

    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      el.style.setProperty('--df-spot-x', `${x}%`);
      el.style.setProperty('--df-spot-y', `${y}%`);
    });
  }, []);

  // The tag is polymorphic for markup semantics; TS cannot narrow the ref union,
  // so we render through a single concrete element type and keep the ref honest.
  const Component = Tag as 'div';

  return (
    <Component ref={ref as React.Ref<HTMLDivElement>} onPointerMove={onPointerMove} className={cn('df-spotlight', className)}>
      {children}
    </Component>
  );
}
