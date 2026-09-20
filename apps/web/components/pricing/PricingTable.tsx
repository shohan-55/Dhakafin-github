'use client';

import { useState } from 'react';

import { TableWrap, THead, TR, TH, TD } from '@/components/ui/Table';
import { cn } from '@/lib/cn';
import type { PricingCopy } from '@/lib/content/pricing-copy';
import type { PriceCadence } from '@/lib/content/pricing';

/**
 * The pricing ledger — DF-P2-025, blueprint §2.2 component #23.
 * ---------------------------------------------------------------------------
 * Three decisions worth stating, because each one is a place where a pricing
 * table usually slips:
 *
 *  1. **The band is a string, not a number.** Every row carries the published
 *     band exactly as `lib/dictionaries/{en,bn}/services.ts` renders it on the
 *     service page ("from ৳8,000 / month"). The table never reformats it, so the
 *     two pages cannot disagree — and `scripts/check-pricing.mjs` asserts it from
 *     the emitted HTML.
 *  2. **The annual view is arithmetic, labelled as arithmetic.** Twelve months at
 *     the starting band. The copy says "not a discount" in both languages, because
 *     a two-column price table is exactly where a reader assumes one.
 *  3. **Nothing is compared until the reader asks.** The comparison panel renders
 *     only what was ticked, and leads with exclusions: two service lines differ
 *     far less in what they include than in what they leave out.
 */

export interface PricingRowData {
  slug: string;
  name: string;
  group: 'foundations' | 'control' | 'growth';
  /** Published band string, verbatim from the service dictionary. */
  band: string;
  cadence: PriceCadence;
  /** Localised cadence label ("per month", "per engagement"). */
  cadenceLabel: string;
  /** Twelve months at the starting band, pre-formatted. Null when not annualisable. */
  annualValue: string | null;
  basis: string;
  drivers: string[];
  note?: string;
  included: string[];
  excluded: string[];
  /** Locale-prefixed href to the full service page. */
  href: string;
}

export interface PricingGroupData {
  id: 'foundations' | 'control' | 'growth';
  name: string;
  lede: string;
}

const MAX_COMPARE = 3;

export function PricingTable({
  copy,
  rows,
  groups,
}: {
  copy: PricingCopy['table'];
  rows: PricingRowData[];
  groups: PricingGroupData[];
}) {
  const [annual, setAnnual] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (slug: string) =>
    setSelected((current) =>
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : current.length >= MAX_COMPARE
          ? current
          : [...current, slug],
    );

  const chosen = selected
    .map((slug) => rows.find((row) => row.slug === slug))
    .filter((row): row is PricingRowData => Boolean(row));

  return (
    <div>
      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div role="group" aria-label={copy.billingLabel}>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--df-color-muted-2)]">
            {copy.billingLabel}
          </span>
          <div className="mt-2 inline-flex rounded-lg border border-[var(--df-color-border)] bg-surface1 p-0.5">
            {[
              { id: false, label: copy.billingMonthly },
              { id: true, label: copy.billingAnnual },
            ].map((option) => (
              <button
                key={String(option.id)}
                type="button"
                aria-pressed={annual === option.id}
                onClick={() => setAnnual(option.id)}
                className={cn(
                  'rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors duration-[var(--df-duration-fast)]',
                  annual === option.id
                    ? 'bg-sea-500/16 text-sea-200'
                    : 'text-muted hover:text-[var(--df-color-text)]',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <p className="max-w-md text-xs leading-relaxed text-muted sm:text-right">
          {copy.compareHint}
          {selected.length >= MAX_COMPARE ? (
            <span className="mt-1 block text-[var(--df-color-warn)]">{copy.compareMax}</span>
          ) : null}
        </p>
      </div>

      {/* ── The ledger ───────────────────────────────────────────────────── */}
      <TableWrap caption={copy.heading} className="mt-6">
        <THead>
          <TR hoverable={false}>
            <TH className="w-12">
              <span className="df-sr-only">{copy.compareLabel}</span>
            </TH>
            <TH>{copy.columns.line}</TH>
            <TH numeric>{copy.columns.band}</TH>
            <TH>{copy.columns.basis}</TH>
            <TH>{copy.columns.included}</TH>
            <TH>
              <span className="df-sr-only">{copy.openLabel}</span>
            </TH>
          </TR>
        </THead>

        {groups.map((group) => (
          <tbody key={group.id}>
            <TR hoverable={false} className="bg-[var(--df-color-surface-tint)]">
              <TD colSpan={6} className="py-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sea-400">
                  {group.name}
                </span>
                <span className="ms-3 text-xs font-normal normal-case tracking-normal text-[var(--df-color-muted-2)]">
                  {group.lede}
                </span>
              </TD>
            </TR>

            {rows
              .filter((row) => row.group === group.id)
              .map((row) => {
                const checked = selected.includes(row.slug);
                const showAnnual = annual && row.annualValue !== null;
                return (
                  <TR key={row.slug}>
                    <TD>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={!checked && selected.length >= MAX_COMPARE}
                        onChange={() => toggle(row.slug)}
                        aria-label={`${copy.compareLabel}: ${row.name}`}
                        className="h-4 w-4 accent-[var(--df-color-sea-400)] disabled:opacity-40"
                      />
                    </TD>

                    <TD>
                      <a
                        href={row.href}
                        className="text-sm font-medium text-[var(--df-color-text-strong)] underline-offset-4 hover:text-sea-300 hover:underline"
                      >
                        {row.name}
                      </a>
                    </TD>

                    <TD numeric>
                      <span className="block text-sm text-[var(--df-color-text-strong)]">
                        {showAnnual ? row.annualValue : row.band}
                      </span>
                      <span className="mt-0.5 block text-[11px] font-normal text-[var(--df-color-muted-2)]">
                        {showAnnual ? copy.billingAnnual : row.cadenceLabel}
                      </span>
                    </TD>

                    <TD>
                      <span className="block max-w-[26ch] text-xs leading-relaxed text-muted">
                        {row.basis}
                      </span>
                    </TD>

                    <TD>
                      <ul className="space-y-1 text-xs text-muted">
                        {row.included.slice(0, 3).map((item) => (
                          <li key={item} className="flex gap-2">
                            <span aria-hidden="true" className="text-sea-400">
                              ·
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </TD>

                    <TD>
                      <a
                        href={row.href}
                        className="whitespace-nowrap text-xs text-sea-300 underline-offset-4 hover:underline"
                      >
                        {copy.openLabel}
                        <span aria-hidden="true"> →</span>
                      </a>
                    </TD>
                  </TR>
                );
              })}
          </tbody>
        ))}
      </TableWrap>

      <p className="mt-3 text-xs leading-relaxed text-muted sm:hidden">{copy.scrollHint}</p>

      {/* ── Annual arithmetic, and the one-off exception ─────────────────── */}
      <p className="mt-3 max-w-3xl text-xs leading-relaxed text-[var(--df-color-muted-2)]">
        {copy.annualNote} {copy.oneOffNote}
      </p>

      {/* ── Compare panel ────────────────────────────────────────────────── */}
      <section aria-labelledby="compare-heading" className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--df-color-border-quiet)] pb-3">
          <h3 id="compare-heading" className="text-h4 font-semibold text-[var(--df-color-text-strong)]">
            {copy.compareHeading}
          </h3>
          {selected.length > 0 ? (
            <button
              type="button"
              onClick={() => setSelected([])}
              className="text-xs text-muted underline-offset-4 hover:text-[var(--df-color-text)] hover:underline"
            >
              {copy.compareClear}
            </button>
          ) : null}
        </div>

        {chosen.length < 2 ? (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{copy.compareEmpty}</p>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {chosen.map((row) => (
              <article
                key={row.slug}
                className="rounded-xl border border-[var(--df-color-border)] bg-surface1 p-6"
              >
                <h4 className="text-base font-semibold text-[var(--df-color-text-strong)]">
                  {row.name}
                </h4>
                <p className="df-num mt-2 text-lg text-sea-300">
                  {annual && row.annualValue ? row.annualValue : row.band}
                </p>
                <p className="mt-1 text-[11px] text-[var(--df-color-muted-2)]">
                  {annual && row.annualValue ? copy.billingAnnual : row.cadenceLabel}
                </p>

                <p className="mt-4 text-xs leading-relaxed text-muted">{row.basis}</p>

                {row.drivers.length ? (
                  <ul className="mt-3 space-y-1 text-xs text-muted">
                    {row.drivers.map((driver) => (
                      <li key={driver} className="flex gap-2">
                        <span aria-hidden="true" className="text-[var(--df-color-muted-2)]">
                          —
                        </span>
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <h5 className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--df-color-muted-2)]">
                  {copy.excludesLabel}
                </h5>
                <ul className="mt-2 space-y-1 text-xs text-muted">
                  {row.excluded.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-[var(--df-color-risk)]">
                        ×
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {row.note ? (
                  <p className="mt-4 text-xs italic leading-relaxed text-[var(--df-color-muted-2)]">
                    {row.note}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
