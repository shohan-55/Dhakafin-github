'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import type { HelpCopy } from '@/lib/content/help-copy';

/**
 * Help search — the only client island on `/help`.
 * ---------------------------------------------------------------------------
 * The whole question set is server-rendered into this component's initial HTML,
 * so the page works with JavaScript off, keeps its content in the document for
 * a crawler, and filters instantly once the island hydrates. Search narrows what
 * is already there; it never fetches, so nothing about a search leaves the page.
 *
 * The `/` shortcut is registered here rather than globally, and it is listed in
 * the shortcuts table below the results — we only publish shortcuts that work.
 */

export interface HelpSearchItem {
  id: string;
  categoryId: string;
  categoryName: string;
  question: string;
  snippet: string;
  href: string;
  /** Space-joined corpus — question, answer snippet and the locale's keywords. */
  haystack: string;
}

export interface HelpSearchProps {
  copy: HelpCopy['search'];
  items: HelpSearchItem[];
  categories: { id: string; name: string }[];
}

/** Fold case and strip punctuation so "VAT?" and "vat" are the same query. */
function normalise(value: string): string {
  return value.toLowerCase().replace(/[’'`“”"]/g, '').replace(/\s+/g, ' ').trim();
}

export function HelpSearch({ copy, items, categories }: HelpSearchProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  /* `/` focuses search — the one keyboard shortcut this page owns. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    const needle = normalise(query);
    return items.filter((item) => {
      if (category !== 'all' && item.categoryId !== category) return false;
      if (!needle) return true;
      return needle.split(' ').every((token) => normalise(item.haystack).includes(token));
    });
  }, [items, query, category]);

  const countLine = copy.resultCount.replace('{count}', String(results.length));

  return (
    <div className="mt-8">
      <div role="search" className="rounded-2xl border border-[var(--df-color-border-quiet)] bg-surface1 p-5">
        <label htmlFor="help-search" className="text-sm font-semibold text-[var(--df-color-text-strong)]">
          {copy.label}
        </label>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            ref={inputRef}
            id="help-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setQuery('');
            }}
            placeholder={copy.placeholder}
            autoComplete="off"
            className={cn(
              'min-w-0 flex-1 rounded-xl border border-[var(--df-color-border)] bg-void/40 px-4 py-2.5',
              'text-sm text-[var(--df-color-text-strong)] outline-none',
              'placeholder:text-[var(--df-color-muted)]',
              'focus-visible:border-[var(--df-color-sea-400)]',
            )}
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="rounded-lg border border-[var(--df-color-border)] px-3 py-2 text-xs text-muted transition-colors duration-[var(--df-duration-fast)] hover:text-sea-300"
            >
              {copy.clear}
            </button>
          ) : null}
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted">{copy.hint}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <CategoryChip active={category === 'all'} onClick={() => setCategory('all')}>
            {copy.allCategories}
          </CategoryChip>
          {categories.map((item) => (
            <CategoryChip
              key={item.id}
              active={category === item.id}
              onClick={() => setCategory(item.id)}
            >
              {item.name}
            </CategoryChip>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="df-num mt-6 text-xs uppercase tracking-[0.12em] text-muted">
        {countLine}
      </p>

      <h3 className="df-sr-only">{copy.resultsLabel}</h3>

      {results.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-[var(--df-color-border-strong)] p-6">
          <p className="text-sm font-semibold text-[var(--df-color-text-strong)]">{copy.empty}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{copy.emptyHint}</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {results.map((item) => (
            <li key={item.id}>
              <article className="rounded-xl border border-[var(--df-color-border-quiet)] bg-void/30 p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="sea" size="sm">
                    {item.categoryName}
                  </Badge>
                </div>
                <h4 className="mt-3 text-base font-semibold text-[var(--df-color-text-strong)]">
                  {item.question}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.snippet}</p>
                <a
                  href={item.href}
                  className="mt-3 inline-flex text-sm font-medium text-sea-300 no-underline hover:text-sea-200"
                >
                  {copy.moreLabel}
                </a>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-[var(--df-duration-fast)]',
        active
          ? 'border-[var(--df-color-sea-400)] bg-[var(--df-color-sea-500)]/15 text-sea-200'
          : 'border-[var(--df-color-border)] text-muted hover:border-[var(--df-color-border-hover)] hover:text-sea-300',
      )}
    >
      {children}
    </button>
  );
}
