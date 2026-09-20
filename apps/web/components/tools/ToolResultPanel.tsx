/**
 * Tool result panel — the arithmetic, its disclosure, and its honesty.
 * ---------------------------------------------------------------------------
 * Server-rendered. The shell holds the state and passes a finished result down,
 * so this file has no hooks and never re-renders on its own. That split matters
 * for §5.5.4: `aria-live` on the panel is the only thing that has to be correct
 * for a screen reader, and keeping it in one place is how that stays true across
 * thirteen tools.
 *
 * Two rules from the blueprint are structural here rather than editorial:
 *
 *   · **Every figure shows its working.** §5.5.3 makes "How this was calculated"
 *     a required feature, not an extra. The steps come from the engine itself, so
 *     the explanation cannot drift from the arithmetic it explains.
 *   · **No rate is presented as authoritative when the user supplied it.** The
 *     disclosure says "as entered", never "per NBR" — different claims, and only
 *     one of them is true while the rate service does not exist.
 */

import { CountUp } from '@/components/system/CountUp';
import { Badge } from '@/components/ui/Badge';
import { TableWrap, THead, TR, TH, TD } from '@/components/ui/Table';
import type { ToolCopy, ToolsHubCopy } from '@/lib/content/tool-copy';
import { formatBDT, formatNumber, formatPercent } from '@/lib/format';
import type { CalcResult } from '@/lib/tools/engine';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/cn';

/** Which result rows a given tool's output can produce, in display order. */
const ROW_ORDER = [
  'base',
  'amount',
  'revenue',
  'cost',
  'contribution',
  'grossProfit',
  'grossMargin',
  'grossPay',
  'allowances',
  'overtime',
  'totalTaxablePayroll',
  'employerContribution',
  'operatingProfit',
  'operatingMargin',
  'price',
  'markup',
  'margin',
  'deduction',
  'netPayable',
  'effectiveRate',
  'difference',
  'vat',
  'total',
  'inputCredit',
  'breakEvenUnits',
  'breakEvenRevenue',
  'marginOfSafetyUnits',
  'marginOfSafetyPercent',
  'roi',
  'annualised',
  'payback',
  'npv',
  'totalReturn',
  'netReturn',
  'workingCapital',
  'currentRatio',
  'quickRatio',
  'ccc',
  'fundingGap',
  'closing',
  'lowest',
  'firstNegative',
  'runway',
  'months',
  'taxableIncome',
  'slabTax',
  'rebate',
  'minimumTax',
  'taxPayable',
  'liability',
  'adjustment',
  'baseRate',
  'tds',
  'costPerHead',
  'totalAnnualCost',
  'low',
  'high',
  'riskScore',
  'breakdown',
] as const;

/** Rows whose value is a ratio rather than taka, so the formatter is right. */
const PERCENT_ROWS = new Set([
  'grossMargin',
  'operatingMargin',
  'margin',
  'markup',
  'effectiveRate',
  'marginOfSafetyPercent',
  'roi',
  'annualised',
  'currentRatio',
  'quickRatio',
  'baseRate',
  'riskScore',
]);
const COUNT_ROWS = new Set(['breakEvenUnits', 'marginOfSafetyUnits', 'payback', 'ccc', 'months', 'firstNegative', 'runway']);
const INT_PERCENT_ONLY = new Set(['marginOfSafetyPercent']);

export interface ResultRow {
  key: string;
  label: string;
  value: string;
  /** Emphasis for the row that is the point of the tool. */
  emphasis?: boolean;
}

/**
 * Read a flat record off a `CalcResult` for display.
 *
 * The engine returns a union of shapes, and each tool's row set is a subset.
 * Rather than thirteen bespoke panels, the result is treated as a bag of figures
 * and every present, named row is rendered — which also means a new output field
 * shows up automatically instead of being forgotten in a hand-written list.
 */
function rowsFor(
  result: CalcResult,
  copy: ToolCopy,
  locale: Locale,
): ResultRow[] {
  const bag = result as unknown as Record<string, unknown>;
  const rows: ResultRow[] = [];

  for (const key of ROW_ORDER) {
    const label = copy.result.rows[key];
    if (!label) continue;
    const raw = bag[key];
    if (raw === null || raw === undefined) continue;

    let value: string;
    if (typeof raw === 'string') {
      value = raw;
    } else if (key === 'firstNegative') {
      value = raw === null ? '—' : formatNumber(raw as number, locale === 'bn' ? 'bn' : 'latin');
    } else if (key === 'runway') {
      value = '∞';
    } else if (INT_PERCENT_ONLY.has(key)) {
      value = formatPercent(raw as number, 2, locale === 'bn' ? 'bn' : 'latin');
    } else if (PERCENT_ROWS.has(key)) {
      value = formatPercent(raw as number, 1, locale === 'bn' ? 'bn' : 'latin');
    } else if (COUNT_ROWS.has(key)) {
      value = formatNumber(raw as number, locale === 'bn' ? 'bn' : 'latin');
    } else {
      value = formatBDT(raw as number, { numerals: locale === 'bn' ? 'bn' : 'latin' });
    }

    rows.push({ key, label, value });
  }

  return rows;
}

/** Notes the engine raises become reader-facing statements, never bare codes. */
function noteFor(note: string, copy: ToolCopy): string | null {
  const notes: Record<string, string> = {
    'price-below-variable':
      'The price does not cover the variable cost, so no volume reaches break-even. Each additional sale widens the loss.',
    'no-fixed-cost': 'With no fixed costs, the business covers its costs at zero sales.',
    'below-break-even': 'Current volume is below break-even, so the business is running at a loss.',
    'below-cost': 'The price is below cost, so every unit sold loses money.',
    'margin-target-impossible':
      'A margin target of 100% has no finite price — give a target below 100.',
    'goes-negative': 'The balance turns negative within this horizon.',
    'burning-cash': 'More cash leaves than arrives on average, so the runway below is finite.',
    'no-months': 'No months supplied, so only the opening balance is shown.',
    'current-ratio-below-one': 'Current liabilities exceed current assets.',
    'quick-ratio-estimated':
      'The quick ratio is an estimate: it excludes inventory using the days you supplied, not an actual inventory balance.',
    'cash-tied-up': 'The operating cycle absorbs cash: you pay before you are paid.',
    'supplier-funded': 'The cycle releases cash: suppliers wait longer than your customers do.',
    'rate-required':
      'Reducing balance needs a rate. Without one there is nothing to depreciate against.',
    'nothing-to-depreciate': 'Cost equals residual value, so there is nothing to depreciate.',
    'negative-return': 'The investment returns less than it costs.',
    'payback-beyond-horizon': 'Payback falls outside the period you entered.',
    'npv-negative': 'At the discount rate you supplied, this does not beat the alternative.',
    'rate-not-supplied':
      'No rate entered, so the deduction is zero. The rate is yours to supply — see the note below.',
    'does-not-reconcile':
      'The deduction differs from the amount already taken. The effective rate explains the gap.',
    'credit-carried-forward':
      'Input credit exceeds output tax. The balance is carried forward under the rules rather than refunded.',
    'gross-loss': 'Cost of goods exceeds revenue, so no volume of sales fixes this.',
    'operating-loss': 'Operating expenses exceed the gross profit.',
    'no-headcount': 'Enter a headcount to see a monthly cost.',
    'tds-not-supplied': 'No rate supplied, so tax withheld is shown as zero and excluded from the cost.',
    'contribution-not-supplied':
      'No contribution rate supplied, so employer cost excludes it. Add one if you make contributions.',
  };
  return notes[note] ?? null;
}

export function ToolResultPanel({
  copy,
  shell,
  disclosure,
  result,
  locale,
  rateFree,
}: {
  copy: ToolCopy;
  /** The shared shell chrome: disclosure and live-region wording. */
  shell: Pick<ToolsHubCopy['shell'], 'liveRegionLabel' | 'inputsTitle' | 'resultsNote'>;
  disclosure: ToolsHubCopy['disclosure'];
  result: CalcResult | null;
  locale: Locale;
  /** True when the tool never consults a published rate. */
  rateFree: boolean;
}) {
  if (!result) {
    return (
      <div className="df-glass df-edge rounded-xl p-6">
        <p className="text-sm leading-relaxed text-muted">{copy.result.empty}</p>
      </div>
    );
  }

  // The primary figure has its own panel above; repeating it as the first table
  // row would suggest two different figures. `primaryKey` names which row to drop.
  const rows = rowsFor(result, copy, locale).filter((r) => r.key !== copy.result.primaryKey);
  const notes = result.notes
    .map((n) => noteFor(n, copy))
    .filter((n): n is string => n !== null);

  return (
    <div className="space-y-5">
      {/* The primary figure. `aria-live` is on the wrapper so a screen reader
          hears the new value once, not once per animated frame — the count-up
          writes to the DOM many times and announcing each would be unusable. */}
      <div
        className="df-glass df-edge rounded-xl p-6"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`${shell.liveRegionLabel}: ${copy.result.primaryLabel}`}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--df-color-muted)]">
          {copy.result.primaryLabel}
        </p>
        <p className="mt-2 flex items-baseline gap-2">
          <CountUp
            value={result.primary}
            format={(v) =>
              formatBDT(v, { compact: v >= 10_000_000, numerals: locale === 'bn' ? 'bn' : 'latin' })
            }
            className="df-num text-4xl font-semibold tabular-nums text-[var(--df-color-text-strong)] sm:text-5xl"
          />
          {copy.result.primaryUnit ? (
            <span className="text-sm text-muted">{copy.result.primaryUnit}</span>
          ) : null}
        </p>
      </div>

      {rows.length ? (
        <TableWrap caption={copy.result.title}>
          <THead>
            <TR>
              <TH scope="col">{copy.result.title}</TH>
              <TH scope="col" className="text-end">
                {disclosure.formulaLabel}
              </TH>
            </TR>
          </THead>
          <tbody>
            {rows.map((row) => (
              <TR key={row.key}>
                <TD className="text-sm text-muted">{row.label}</TD>
                <TD className={cn('df-num text-end text-sm tabular-nums text-[var(--df-color-text-strong)]')}>
                  {row.value}
                </TD>
              </TR>
            ))}
          </tbody>
        </TableWrap>
      ) : null}

      {notes.length ? (
        <ul className="space-y-2 rounded-xl border border-[color-mix(in_srgb,var(--df-color-warn)_30%,transparent)] bg-[color-mix(in_srgb,var(--df-color-warn)_6%,transparent)] p-4">
          {notes.map((note) => (
            <li key={note} className="flex gap-2.5 text-sm leading-relaxed text-[var(--df-color-text)]">
              <span aria-hidden="true" className="mt-0.5 shrink-0 text-warn">
                ▲
              </span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {/* §5.5.3: formula transparency is a trust feature, not an extra. */}
      <details className="group rounded-xl border border-[var(--df-color-border-quiet)] bg-surface1/40">
        <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium text-[var(--df-color-text-strong)] marker:content-none">
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="text-sea-400 transition-transform duration-[var(--df-duration-fast)] group-open:rotate-90"
            >
              ▸
            </span>
            {disclosure.title}
          </span>
        </summary>
        <div className="border-t border-[var(--df-color-border-quiet)] px-5 py-4">
          <ol className="space-y-3">
            {result.steps.map((step) => (
              <li key={step.label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-sm text-[var(--df-color-text)]">{step.label}</span>
                <span className="df-num text-xs text-[var(--df-color-muted)]">{step.expression}</span>
                <span className="df-num w-full text-end text-sm tabular-nums text-[var(--df-color-text-strong)] sm:w-auto">
                  {formatBDT(step.value, { compact: Math.abs(step.value) >= 10_000_000 })}
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-4 text-xs leading-relaxed text-muted">{disclosure.roundingNote}</p>

          <p className="mt-3 text-xs leading-relaxed text-muted">
            {rateFree ? disclosure.rateFreeNote : disclosure.rateNote}
          </p>
        </div>
      </details>
    </div>
  );
}

/** Badge shown on a tool whose result panel is held back. */
export function PendingBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge tone="regulatory" glyph="◷">
      {children}
    </Badge>
  );
}
