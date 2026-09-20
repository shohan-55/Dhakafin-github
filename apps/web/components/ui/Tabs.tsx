'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  /** Optional count badge (e.g. number of rates in a family). */
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  /** Visual style: underline for sections, pill for filters/toggles. */
  variant?: 'underline' | 'pill' | 'segmented';
  label: string;
  defaultId?: string;
  className?: string;
}

/**
 * Tabs — DFDS component #10.
 *
 * Implements the WAI-ARIA tabs pattern with a roving tabindex: arrow keys move
 * between tabs, Home/End jump to the ends, and only the active tab is in the tab
 * order. The active underline is a shared element that slides between tabs.
 */
export function Tabs({ items, variant = 'underline', label, defaultId, className }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultId ?? items[0]?.id ?? '');
  const listRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const active = items[activeIndex];

  const move = (delta: number) => {
    const next = (activeIndex + delta + items.length) % items.length;
    const nextItem = items[next];
    if (!nextItem) return;
    setActiveId(nextItem.id);
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[next]?.focus();
  };

  const containerClasses = {
    underline: 'gap-1 border-b border-[var(--df-color-border-quiet)]',
    pill: 'gap-2',
    segmented: 'gap-1 rounded-lg border border-[var(--df-color-border)] bg-surface1 p-1',
  }[variant];

  const tabClasses = (isActive: boolean) =>
    cn(
      'relative inline-flex items-center gap-2 whitespace-nowrap px-3.5 py-2.5 text-sm font-medium',
      'transition-colors duration-[var(--df-duration-base)] ease-[var(--ease-out)]',
      'focus-visible:outline-none rounded-t-md',
      variant === 'underline' && (isActive ? 'text-sea-300' : 'text-muted hover:text-[var(--df-color-text)]'),
      variant === 'pill' &&
        (isActive
          ? 'rounded-full border border-sea-500/50 bg-sea-500/16 text-sea-200'
          : 'rounded-full border border-[var(--df-color-border)] text-muted hover:text-[var(--df-color-text)]'),
      variant === 'segmented' &&
        (isActive ? 'rounded-md bg-sea-500/16 text-sea-300' : 'rounded-md text-muted hover:text-[var(--df-color-text)]')
    );

  return (
    <div className={className}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        className={cn('flex overflow-x-auto', containerClasses)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            move(1);
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            move(-1);
          } else if (event.key === 'Home') {
            event.preventDefault();
            move(-activeIndex);
          } else if (event.key === 'End') {
            event.preventDefault();
            move(items.length - 1 - activeIndex);
          }
        }}
      >
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              role="tab"
              id={`tab-${item.id}`}
              type="button"
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              className={tabClasses(isActive)}
            >
              {item.label}
              {typeof item.count === 'number' ? (
                <span
                  className={cn(
                    'df-num rounded-full px-1.5 py-0.5 text-[11px]',
                    isActive ? 'bg-sea-500/20 text-sea-200' : 'bg-surface2 text-muted'
                  )}
                >
                  {item.count}
                </span>
              ) : null}

              {variant === 'underline' && isActive ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--df-gradient-focus)]"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {active ? (
        <div
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          tabIndex={0}
          className="pt-5 focus-visible:outline-none"
        >
          {active.content}
        </div>
      ) : null}
    </div>
  );
}
