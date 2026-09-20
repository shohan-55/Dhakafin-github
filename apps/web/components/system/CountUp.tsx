'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

interface CountUpProps {
  value: number;
  /** Formatter applied to the animating value (e.g. formatBDT). */
  format?: (value: number) => string;
  durationMs?: number;
  className?: string;
  /** Announce the final value to assistive tech (polite). */
  announce?: boolean;
}

const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Signature motion #2 — "Number Count-Up".
 * 700ms ease-out, tabular digits, and under reduced motion / lite tier the final
 * value is rendered instantly (never animated). The value stays in the DOM as
 * text at all times so it is selectable and copyable.
 */
export function CountUp({ value, format = (v) => v.toFixed(0), durationMs = 700, className, announce = false }: CountUpProps) {
  const [display, setDisplay] = useState(value);
  const frame = useRef<number | null>(null);
  const fromRef = useRef(value);
  const startRef = useRef(0);

  useEffect(() => {
    const motionOff =
      document.documentElement.dataset.motion === 'off' ||
      document.documentElement.dataset.tier === 'lite' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (motionOff) {
      setDisplay(value);
      return;
    }

    const from = fromRef.current;
    const delta = value - from;

    if (delta === 0) {
      setDisplay(value);
      return;
    }

    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / durationMs);
      setDisplay(from + delta * EASE_OUT(t));

      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = value;
        setDisplay(value);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [value, durationMs]);

  return (
    <span className={cn('df-num tabular-nums', className)} data-numeric aria-live={announce ? 'polite' : undefined}>
      {format(display)}
    </span>
  );
}
