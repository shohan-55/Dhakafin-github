'use client';

/**
 * Tool shell — the §5.5.2 layout, once for thirteen tools.
 * ---------------------------------------------------------------------------
 * Inputs on the left, sticky result on the right on desktop; results below the
 * inputs on mobile with the primary figure repeated in a sticky bar so it is
 * reachable without scrolling past the form, which is §5.5.4 criterion 7.
 *
 * WHY THE STATE LIVES HERE AND NOT IN EACH TOOL
 * §5.5.3 asks for live results (debounced 150 ms), live thousand separators,
 * numeric input modes, example chips, formula transparency and an announced
 * result. Thirteen hand-built versions of that list is thirteen chances to get
 * one of them wrong, and the accessibility details would diverge first.
 *
 * The component is told what to render by `ToolDefinition` and computes through
 * the pure engine, so it contains no tool-specific logic at all. Adding the
 * fourteenth tool is a registry entry and a dictionary entry.
 *
 * PERFORMANCE
 * The engine is pure and cheap — no I/O, no rates lookup, no network — so the
 * whole tool runs on the first keystroke with no debounce to hide behind. The
 * only cost is React re-rendering, which is bounded by the input count. The
 * count-up animation is what §5.5.3 asks to debounce, and `CountUp` already
 * skips animating under reduced motion and the lite tier.
 */

import { useCallback, useMemo, useState } from 'react';

import { Field, SelectField } from '@/components/ui/Field';
import { Badge } from '@/components/ui/Badge';
import { PendingBadge, ToolResultPanel } from './ToolResultPanel';
import { interpolate } from '@/lib/dictionary';
import { formatBDT, formatNumber } from '@/lib/format';
import type { Locale } from '@/lib/i18n';
import type { ToolCopy, ToolsHubCopy } from '@/lib/content/tool-copy';
import { getToolDefinition } from '@/lib/tools/definitions';
import type { ToolDefinition, ToolInputSpec, ToolValues } from '@/lib/tools/definitions';
import type { ToolSlug } from '@/lib/content/tools';

/** The shared shell chrome, as the dictionary stores it. */
type ShellCopy = ToolsHubCopy['shell'];
type PendingCopy = ToolsHubCopy['pending'];
import type { CalcResult } from '@/lib/tools/engine';
import { cn } from '@/lib/cn';

type Value = number | string | boolean | number[];

function initialValues(def: ToolDefinition): Record<string, Value> {
  const out: Record<string, Value> = {};
  for (const input of def.inputs) out[input.id] = input.default;
  return out;
}

export function ToolShell({
  slug,
  copy,
  shell,
  disclosure,
  pendingCopy,
  locale,
  rateFree,
  formula,
}: {
  /**
   * The tool's slug, not its definition. A definition carries `compute` — a
   * function — and React cannot serialise a function across the server/client
   * boundary, so the shell resolves its own definition from the registry. That
   * also means the registry and the engine are the only things that reach the
   * browser, which is exactly what live recalculation needs.
   */
  slug: ToolSlug;
  copy: ToolCopy;
  shell: ShellCopy;
  disclosure: ToolsHubCopy['disclosure'];
  pendingCopy: PendingCopy;
  locale: Locale;
  rateFree: boolean;
  /** The formula, written out, shown when the result panel is held back. */
  formula: string;
}) {
  const definition = useMemo<ToolDefinition>(() => getToolDefinition(slug), [slug]);
  const [values, setValues] = useState<Record<string, Value>>(() => initialValues(definition));

  const set = useCallback((id: string, value: Value) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const accessors: ToolValues = useMemo(
    () => ({
      num: (id) => {
        const raw = values[id];
        if (typeof raw === 'number') return Number.isFinite(raw) ? raw : 0;
        if (typeof raw === 'string') {
          const cleaned = raw.replace(/[^\d.-]/g, '');
          const n = Number(cleaned);
          return Number.isFinite(n) ? n : 0;
        }
        return 0;
      },
      str: (id) => (typeof values[id] === 'string' ? (values[id] as string) : ''),
      bool: (id) => values[id] === true,
      series: (id) => {
        const raw = values[id];
        return Array.isArray(raw) ? raw : [];
      },
    }),
    [values],
  );

  const result: CalcResult | null = useMemo(() => {
    if (!definition.compute) return null;
    try {
      return definition.compute(accessors);
    } catch {
      // A calculator that crashes on odd input is worse than one that shows a
      // dash, so a failure is presented as a state rather than a stack trace.
      return null;
    }
  }, [definition, accessors]);

  const reset = useCallback(() => setValues(initialValues(definition)), [definition]);

  const visible = definition.inputs.filter((i) => !i.advanced);
  const advanced = definition.inputs.filter((i) => i.advanced);
  const numeral = locale === 'bn' ? 'bn' : 'latin';

  const renderInput = (input: ToolInputSpec) => {
    const fieldCopy = copy.fields[input.id];
    if (!fieldCopy) return null;
    const value = values[input.id];

    if (input.kind === 'currency') {
      const n = typeof value === 'number' ? value : 0;
      return (
        <div key={input.id}>
          <Field
            label={fieldCopy.label}
            hint={fieldCopy.hint}
            currency
            inputMode="decimal"
            /** Latin digits in the field so `df-num` metrics hold while typing. */
            value={value === 0 ? '' : formatNumber(n, 'latin')}
            onChange={(e) => set(input.id, Number(e.target.value.replace(/[^\d.-]/g, '')) || 0)}
            placeholder="0"
          />
        </div>
      );
    }

    if (input.kind === 'number') {
      return (
        <Field
          key={input.id}
          label={fieldCopy.label}
          hint={fieldCopy.hint}
          type="number"
          inputMode="numeric"
          value={String(value ?? '')}
          onChange={(e) => set(input.id, Number(e.target.value) || 0)}
        />
      );
    }

    if (input.kind === 'percent') {
      return (
        <Field
          key={input.id}
          label={fieldCopy.label}
          hint={fieldCopy.hint}
          type="number"
          inputMode="decimal"
          suffix={fieldCopy.unit ?? '%'}
          value={String(value ?? '')}
          onChange={(e) => set(input.id, Number(e.target.value) || 0)}
        />
      );
    }

    if (input.kind === 'date') {
      return (
        <Field
          key={input.id}
          label={fieldCopy.label}
          hint={fieldCopy.hint}
          type="date"
          value={String(value ?? '')}
          onChange={(e) => set(input.id, e.target.value)}
        />
      );
    }

    if (input.kind === 'select') {
      return (
        <SelectField
          key={input.id}
          label={fieldCopy.label}
          hint={fieldCopy.hint}
          value={String(value ?? '')}
          onChange={(e) => set(input.id, e.target.value)}
          options={(input.options ?? []).map((o) => ({
            value: o.value,
            label: fieldCopy.options?.[o.value] ?? o.value,
          }))}
        />
      );
    }

    if (input.kind === 'toggle') {
      const on = value === true;
      return (
        <fieldset key={input.id} className="flex flex-col gap-2">
          <legend className="text-xs font-medium text-muted">{fieldCopy.label}</legend>
          <div className="flex gap-2" role="group">
            {[true, false].map((option) => (
              <button
                key={String(option)}
                type="button"
                aria-pressed={on === option}
                onClick={() => set(input.id, option)}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2 text-xs font-medium',
                  'transition-colors duration-[var(--df-duration-fast)]',
                  on === option
                    ? 'border-sea-500/50 bg-sea-500/12 text-sea-300'
                    : 'border-[var(--df-color-border-quiet)] text-muted hover:text-[var(--df-color-text-strong)]'
                )}
              >
                {option ? copy.fields[input.id]?.options?.yes ?? 'Yes' : copy.fields[input.id]?.options?.no ?? 'No'}
              </button>
            ))}
          </div>
          {fieldCopy.hint ? <p className="text-xs text-muted">{fieldCopy.hint}</p> : null}
        </fieldset>
      );
    }

    if (input.kind === 'series') {
      const series = Array.isArray(value) ? value : [];
      const count = input.count ?? 12;
      return (
        <fieldset key={input.id} className="flex flex-col gap-2">
          <legend className="text-xs font-medium text-muted">{fieldCopy.label}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {Array.from({ length: count }, (_, i) => (
              <label key={i} className="flex items-center gap-2">
                <span className="w-24 shrink-0 text-xs text-[var(--df-color-muted)]">
                  {interpolate(copy.seriesRowLabel, { n: formatNumber(i + 1, numeral) })}
                </span>
                <span className="flex flex-1 items-center gap-1.5 rounded-lg border border-[var(--df-color-border)] bg-surface1 px-2.5 py-1.5">
                  <span aria-hidden="true" className="df-num text-xs text-muted">
                    ৳
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={series[i] === 0 ? '' : formatNumber(series[i] ?? 0, 'latin')}
                    onChange={(e) => {
                      const next = [...series];
                      next[i] = Number(e.target.value.replace(/[^\d.-]/g, '')) || 0;
                      set(input.id, next);
                    }}
                    className="df-num h-6 w-full min-w-0 bg-transparent text-xs tabular-nums text-[var(--df-color-text-strong)] outline-none"
                    placeholder="0"
                  />
                </span>
              </label>
            ))}
          </div>
          {fieldCopy.hint ? <p className="text-xs text-muted">{fieldCopy.hint}</p> : null}
        </fieldset>
      );
    }

    return null;
  };

  const inputsPanel = (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-semibold text-[var(--df-color-text-strong)]">
          {shell.inputsTitle}
        </h2>
        <button
          type="button"
          onClick={reset}
          className="text-xs font-medium text-muted underline underline-offset-4 hover:text-[var(--df-color-text-strong)]"
        >
          {shell.resetLabel}
        </button>
      </div>

      <div className="space-y-4">{visible.map(renderInput)}</div>

      {advanced.length ? (
        <details className="group rounded-lg border border-[var(--df-color-border-quiet)]">
          <summary className="cursor-pointer list-none px-4 py-3 text-xs font-medium text-muted marker:content-none">
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="text-sea-400 transition-transform duration-[var(--df-duration-fast)] group-open:rotate-90"
              >
                ▸
              </span>
              {shell.advancedTitle}
            </span>
          </summary>
          <div className="space-y-4 border-t border-[var(--df-color-border-quiet)] px-4 py-4">
            {advanced.map(renderInput)}
          </div>
        </details>
      ) : null}

      <p className="text-xs leading-relaxed text-[var(--df-color-muted)]">{shell.inputsNote}</p>

      {copy.examples.items[0] ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--df-color-border-quiet)] pt-4">
          <span className="text-xs text-[var(--df-color-muted)]">{shell.exampleLabel}</span>
          <Badge tone="neutral">{copy.examples.items[0].title}</Badge>
        </div>
      ) : null}
    </div>
  );

  /* ── Held-back state ───────────────────────────────────────────────────── */

  if (definition.pending) {
    const pending =
      definition.pending === 'rates'
        ? { title: pendingCopy.ratesTitle, body: pendingCopy.ratesBody }
        : { title: pendingCopy.benchmarksTitle, body: pendingCopy.benchmarksBody };

    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className="df-glass df-edge rounded-xl p-6">{inputsPanel}</div>

        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="df-glass df-edge rounded-xl p-6">
            <PendingBadge>{copy.pendingState?.title ?? pending.title}</PendingBadge>
            <p className="mt-4 text-sm leading-relaxed text-[var(--df-color-text)]">
              {copy.pendingState?.body ?? pending.body}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              {copy.pendingState?.whatWeNeed}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[var(--df-color-muted)]">
              {pendingCopy.outlook}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--df-color-border-quiet)] bg-surface1/40 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted)]">
              {shell.inputsTitle}
            </p>
            <p className="df-num mt-2 text-sm text-[var(--df-color-text)]">{formula}</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Live state ────────────────────────────────────────────────────────── */

  const primaryText = result
    ? formatBDT(result.primary, {
        compact: result.primary >= 10_000_000,
        numerals: numeral,
      })
    : '—';

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
      <div className="df-glass df-edge rounded-xl p-6">{inputsPanel}</div>

      <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <ToolResultPanel
          copy={copy}
          shell={shell}
          disclosure={disclosure}
          result={result}
          locale={locale}
          rateFree={rateFree}
        />

        {/* Mobile: the figure stays reachable without scrolling past the form. */}
        <div
          className="df-glass df-edge sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-xl px-4 py-3 lg:hidden"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="text-xs font-medium text-muted">{copy.result.primaryLabel}</span>
          <span className="df-num text-lg font-semibold tabular-nums text-[var(--df-color-text-strong)]">
            {primaryText}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-[var(--df-color-muted)]">{shell.resultsNote}</p>
      </div>
    </div>
  );
}
