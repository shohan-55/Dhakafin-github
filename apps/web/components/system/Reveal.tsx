'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface RevealProps {
  children: ReactNode;
  /** Stagger index — capped at 8 items per blueprint §3.10. */
  index?: number;
  as?: ElementType;
  className?: string;
  /** Delay in ms before the reveal starts (used for deliberate sequencing). */
  delay?: number;
}

const MAX_STAGGER = 8;
const STAGGER_STEP = 40;

/**
 * Section entrance: fade + 16px rise, once, 560ms ease-out.
 * Signature motion #1 of the DhakaFin motion language (blueprint §3.10).
 *
 * Contract: the content is *always* present in the DOM (crawlable, screen-reader
 * accessible). Under `data-motion="off"` (lite tier / reduced motion) the CSS
 * shows it immediately with no animation, and the observer is never attached.
 */
export function Reveal({ children, index = 0, as: Tag = 'div', className, delay }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [motionOff, setMotionOff] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const motionDisabled =
      document.documentElement.dataset.motion === 'off' ||
      document.documentElement.dataset.tier === 'lite' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (motionDisabled || typeof IntersectionObserver === 'undefined') {
      setMotionOff(true);
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stagger = Math.min(index, MAX_STAGGER) * STAGGER_STEP;

  return (
    <Tag
      ref={ref}
      className={cn('df-reveal', className)}
      data-visible={visible ? 'true' : 'false'}
      data-motion={motionOff ? 'off' : 'on'}
      style={delay ? { animationDelay: `${delay + stagger}ms` } : stagger ? { animationDelay: `${stagger}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
