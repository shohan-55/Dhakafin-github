'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { THead, TH, TR, TD, TableWrap } from '@/components/ui/Table';
import { sensitivityBasisPoints, type LeakagePillarId } from '@/lib/benchmarks';
import type { CostEfficiencyCopy } from '@/lib/content/cost-efficiency-copy';
import {
  categoryBounds,
  categoryRegistry,
  costCategories,
  estimatorIndustries,
  pillarOrder,
  turnoverBounds,
  type CostCategoryId,
} from '@/lib/content/cost-efficiency';
import {
  buildEstimate,
  decodeEstimateToken,
  methodRows,
  type CostEfficiencyInput,
  type EstimatorIndustry,
} from '@/lib/cost-efficiency';
import { cn } from '@/lib/cn';
import { formatBDT, formatNumber, formatPercent } from '@/lib/format';
import type { Locale } from '@/lib/i18n';

/**
 * The estimator (DF-P2-044, blueprint §5.9.2–5.9.3).
 * ---------------------------------------------------------------------------
 * Client component, because §5.9.3 asks for sliders that move the whole page
 * together. Four rules shape everything below:
 *
 * 1. **Nothing here is benchmarked.** Exposure is the reader's own arithmetic;
 *    the savings range comes from `estimate.range`, which is `null` and rendered
 *    as a stated absence with the reason. No component in this file computes a
 *    savings figure, so none can accidentally display one.
 *
 * 2. **Slider updates are batched to animation frames.** A range input fires on
 *    every pixel of drag; React state per event would re-render this tree dozens
 *    of times per frame. Values land in a ref and flush on rAF, so the visuals
 *    move with the frame rate and a slow device drops frames rather than queueing
 *    work it cannot finish (§5.9.4 criterion 3).
 *
 * 3. **Screen readers hear the committed value, not the drag.** A live region
 *    that announces every intermediate number is unusable. Announcements fire on
 *    release — pointerup, keyup, blur — with the figure that was settled on.
 *
 * 4. **Reduced motion and no-WebGL are the same path.** Every visual is CSS and
 *    SVG, and transitions are `motion-safe:` only, so the page is complete and
 *    static when motion is off (§5.9.4 criterion 4).
 */

interface LeakageEstimatorProps {
  copy: CostEfficiencyCopy;
  locale: Locale;
  /** Industry names, from the industries dictionary — a slug is not a name. */
  industryNames: Record<EstimatorIndustry, string>;
  /** Where the review CTA goes, including the estimate tag. */
  bookHref: string;
  quoteHref: string;
  checklistHref: string;
}

const taka = (value: number, locale: Locale) =>
  formatBDT(value, { numerals: locale === 'bn' ? 'bn' : 'latin' });

/** Slider value → the amount it represents, so both stay in one source of truth. */
const shareToPercent = (basisPoints: number) => basisPoints / 100;

/**
 * The opening state: preset category shares, no answers. The preset is the
 * industry-shaped starting point §5.9.2 asks for, labelled on the page as a
 * starting shape rather than an estimate about the reader.
 */
const initialInput: CostEfficiencyInput = {
  industry: 'manufacturing',
  turnover: turnoverBounds.default,
  categories: Object.fromEntries(
    costCategories.map((id) => [id, categoryRegistry[id].defaultBasisPoints]),
  ) as Record<CostCategoryId, number>,
  answers: Object.fromEntries(pillarOrder.map((id) => [id, null])) as Record<
    LeakagePillarId,
    boolean | null
  >,
};

export function LeakageEstimator({
  copy,
  locale,
  industryNames,
  bookHref,
  quoteHref,
  checklistHref,
}: LeakageEstimatorProps) {
  const [input, setInput] = useState<CostEfficiencyInput>(initialInput);
  /**
   * A share link is read here rather than from `searchParams`, because every page
   * in this tree is statically prerendered and a query string would force it
   * dynamic. The decode is synchronous, so a shared estimate is applied in the
   * first frame after hydration.
   */
  const [shared, setShared] = useState<'none' | 'valid' | 'invalid'>('none');

  const estimate = useMemo(() => buildEstimate(input), [input]);
  const rows = useMemo(() => methodRows(), []);
  const numerals = locale === 'bn' ? 'bn' : 'latin';

  /* ── Share-link restore ───────────────────────────────────────────────── */
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('e');
    if (!token) return;
    const decoded = decodeEstimateToken(token);
    if (!decoded) {
      setShared('invalid');
      return;
    }
    setInput(decoded);
    setShared('valid');
  }, []);

  /* ── Batched slider updates ───────────────────────────────────────────── */
  const pending = useRef<CostEfficiencyInput | null>(null);
  const frame = useRef<number | null>(null);

  const flush = useCallback(() => {
    frame.current = null;
    if (pending.current) {
      setInput(pending.current);
      pending.current = null;
    }
  }, []);

  const queue = useCallback(
    (next: CostEfficiencyInput) => {
      pending.current = next;
      if (frame.current === null && typeof requestAnimationFrame !== 'undefined') {
        frame.current = requestAnimationFrame(flush);
      } else if (typeof requestAnimationFrame === 'undefined') {
        flush();
      }
    },
    [flush],
  );

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  /* ── Announced value: committed, never per-frame ──────────────────────── */
  const [announced, setAnnounced] = useState('');
  const [copied, setCopied] = useState(false);

  const commit = useCallback((label: string, value: string) => setAnnounced(`${label}: ${value}`), []);

  const setTurnover = (value: number) =>
    queue({ ...input, turnover: Math.max(0, Math.round(value)) });

  const setCategory = (id: CostCategoryId, basisPoints: number) =>
    queue({ ...input, categories: { ...input.categories, [id]: basisPoints } });

  const setAnswer = (id: LeakagePillarId, value: boolean | null) =>
    queue({ ...input, answers: { ...input.answers, [id]: value } });

  /* ── Share link ───────────────────────────────────────────────────────── */
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return `?e=${estimate.token}`;
    const url = new URL(window.location.href);
    url.search = `?e=${estimate.token}`;
    url.hash = '';
    return url.toString();
  }, [estimate.token]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setAnnounced(copy.estimator.shareCopied);
      window.setTimeout(() => setCopied(false), 4000);
    } catch {
      // Clipboard permission is the browser's to withhold; the link stays visible
      // in the summary bar either way, so nothing is lost when it is refused.
      setCopied(false);
    }
  };

  const reset = () => {
    setShared('none');
    setInput({
      industry: input.industry,
      turnover: turnoverBounds.default,
      categories: Object.fromEntries(
        costCategories.map((id) => [id, categoryRegistry[id].defaultBasisPoints]),
      ) as Record<CostCategoryId, number>,
      answers: Object.fromEntries(pillarOrder.map((id) => [id, null])) as Record<
        LeakagePillarId,
        boolean | null
      >,
    });
    setAnnounced(copy.estimator.resetLabel);
  };

  const publishedOf = `${estimate.publishedRows} / ${estimate.requiredRows}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
      {/* ── Inputs ────────────────────────────────────────────────────────── */}
      <div className="space-y-6 lg:sticky lg:top-24">
        {/* Industry */}
        <Card tone="context" padding="lg">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted)]">
            {locale === 'bn' ? 'খাত' : 'Industry'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {estimatorIndustries.map((id) => {
              const selected = input.industry === id;
              const label = industryNames[id];
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setInput({ ...input, industry: id });
                    commit(locale === 'bn' ? 'খাত' : 'Industry', label);
                  }}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-sm transition-colors duration-[var(--df-duration-fast)]',
                    selected
                      ? 'border-sea-500/50 bg-sea-500/12 text-sea-200'
                      : 'border-[var(--df-color-border-quiet)] text-muted hover:text-[var(--df-color-text-strong)]',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Turnover */}
        <Card tone="context" padding="lg">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="ce-turnover" className="text-sm font-medium text-[var(--df-color-text-strong)]">
              {copy.estimator.turnoverLabel}
            </label>
            <output htmlFor="ce-turnover" className="df-num text-base font-semibold text-sea-300">
              {taka(input.turnover, locale)}
            </output>
          </div>
          <p className="mt-1 text-xs text-muted">{copy.estimator.turnoverHint}</p>

          <input
            id="ce-turnover"
            type="range"
            min={turnoverBounds.min}
            max={turnoverBounds.max}
            step={turnoverBounds.step}
            value={input.turnover}
            aria-valuetext={taka(input.turnover, locale)}
            onChange={(event) => setTurnover(Number(event.target.value))}
            onPointerUp={() => commit(copy.estimator.turnoverLabel, taka(input.turnover, locale))}
            onKeyUp={() => commit(copy.estimator.turnoverLabel, taka(input.turnover, locale))}
            onBlur={() => commit(copy.estimator.turnoverLabel, taka(input.turnover, locale))}
            className="mt-4 h-11 w-full cursor-pointer accent-[var(--df-color-sea-400)]"
          />

          <div className="mt-2 flex items-center gap-3">
            <input
              type="number"
              inputMode="numeric"
              aria-label={copy.estimator.turnoverInputLabel}
              value={input.turnover}
              min={turnoverBounds.min}
              max={turnoverBounds.max}
              step={turnoverBounds.step}
              onChange={(event) => setTurnover(Number(event.target.value))}
              onBlur={() => commit(copy.estimator.turnoverLabel, taka(input.turnover, locale))}
              className="df-num h-11 w-40 rounded-lg border border-[var(--df-color-border-quiet)] bg-void/40 px-3 text-sm text-[var(--df-color-text-strong)]"
            />
            <span className="text-xs text-[var(--df-color-muted)]">{copy.estimator.turnoverInputLabel}</span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[var(--df-color-muted)]">
            {copy.estimator.turnoverFloorNote}
          </p>
        </Card>

        {/* Category spends */}
        <Card tone="context" padding="lg">
          <h3 className="text-sm font-medium text-[var(--df-color-text-strong)]">
            {copy.estimator.categoryHeading}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">{copy.estimator.categoryNote}</p>

          <ul className="mt-5 space-y-5">
            {costCategories.map((id) => {
              const share = input.categories[id];
              const amount = estimate.categories.find((line) => line.id === id)?.amount ?? 0;
              const label = copy.estimator.categories[id].label;
              return (
                <li key={id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor={`ce-${id}`} className="text-sm text-[var(--df-color-text)]">
                      {label}
                    </label>
                    <span className="df-num text-sm font-medium text-[var(--df-color-text-strong)]">
                      {formatPercent(shareToPercent(share), 1, numerals)}{' '}
                      <span className="text-xs text-[var(--df-color-muted)]">
                        {taka(amount, locale)}
                      </span>
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--df-color-muted)]">
                    {copy.estimator.categories[id].hint}
                  </p>
                  <input
                    id={`ce-${id}`}
                    type="range"
                    min={categoryBounds.min}
                    max={categoryBounds.max}
                    step={categoryBounds.step}
                    value={share}
                    aria-valuetext={`${formatPercent(shareToPercent(share), 1, numerals)} — ${taka(amount, locale)}`}
                    onChange={(event) => setCategory(id, Number(event.target.value))}
                    onPointerUp={() =>
                      commit(label, `${formatPercent(shareToPercent(share), 1, numerals)}, ${taka(amount, locale)}`)
                    }
                    onKeyUp={() =>
                      commit(label, `${formatPercent(shareToPercent(share), 1, numerals)}, ${taka(amount, locale)}`)
                    }
                    onBlur={() =>
                      commit(label, `${formatPercent(shareToPercent(share), 1, numerals)}, ${taka(amount, locale)}`)
                    }
                    className="mt-3 h-11 w-full cursor-pointer accent-[var(--df-color-sea-400)]"
                  />
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex items-baseline justify-between border-t border-[var(--df-color-border-quiet)] pt-4">
            <span className="text-sm text-muted">{copy.estimator.operatingCostLabel}</span>
            <span className="df-num text-base font-semibold text-[var(--df-color-text-strong)]">
              {taka(estimate.operatingCost, locale)}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--df-color-muted)]">{copy.estimator.operatingCostNote}</p>
        </Card>

        {/* Five process questions */}
        <Card tone="context" padding="lg">
          <h3 className="text-sm font-medium text-[var(--df-color-text-strong)]">
            {copy.estimator.questionHeading}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">{copy.estimator.questionNote}</p>

          <ul className="mt-5 space-y-5">
            {pillarOrder.map((id) => {
              const answer = input.answers[id];
              return (
                <li key={id}>
                  <fieldset>
                    <legend className="text-sm text-[var(--df-color-text)]">
                      {copy.pillars[id].question}
                    </legend>
                    <div className="mt-2 flex gap-2">
                      {([true, false, null] as const).map((value) => {
                        const selected = answer === value;
                        const label =
                          value === true
                            ? copy.estimator.answerYes
                            : value === false
                              ? copy.estimator.answerNo
                              : copy.estimator.answerUnanswered;
                        return (
                          <button
                            key={String(value)}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => {
                              setAnswer(id, value);
                              commit(copy.pillars[id].name, label);
                            }}
                            className={cn(
                              'rounded-lg border px-3 py-1.5 text-xs transition-colors duration-[var(--df-duration-fast)]',
                              selected
                                ? value === true
                                  ? 'border-[color-mix(in_srgb,var(--df-color-warn)_45%,transparent)] bg-[color-mix(in_srgb,var(--df-color-warn)_12%,transparent)] text-warn'
                                  : 'border-sea-500/45 bg-sea-500/12 text-sea-200'
                                : 'border-[var(--df-color-border-quiet)] text-muted hover:text-[var(--df-color-text-strong)]',
                            )}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* ── Output ────────────────────────────────────────────────────────── */}
      <div className="space-y-8">
        {shared === 'valid' ? (
          <Card tone="quiet" padding="lg">
            <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
              {copy.share.heading}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{copy.share.body}</p>
          </Card>
        ) : null}

        {shared === 'invalid' ? (
          <Card tone="quiet" padding="lg" className="border-l-2 border-l-[var(--df-color-warn)]">
            <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
              {copy.share.invalidHeading}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{copy.share.invalidBody}</p>
            <ButtonLink href={bookHref} variant="secondary" size="sm" className="mt-4">
              {copy.share.backLabel}
            </ButtonLink>
          </Card>
        ) : null}

        {/* Exposure by surface */}
        <Card tone="context" padding="lg">
          <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
            {copy.estimator.exposureHeading}
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{copy.estimator.exposureNote}</p>

          <ul className="mt-6 space-y-5">
            {estimate.pillars.map((pillar) => (
              <li key={pillar.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="flex items-center gap-2 text-sm font-medium text-[var(--df-color-text-strong)]">
                    {copy.pillars[pillar.id].name}
                    {pillar.flagged ? (
                      <Badge tone="warn" size="sm" glyph="▲">
                        {copy.estimator.answerYes}
                      </Badge>
                    ) : null}
                  </span>
                  <span className="df-num text-sm font-semibold text-sea-300">
                    {taka(pillar.spendBaseAmount, locale)}
                  </span>
                </div>
                <div className="mt-2">
                  <ProgressBar
                    value={pillar.shareOfOperatingCostBasisPoints}
                    max={10_000}
                    label={`${copy.pillars[pillar.id].name} — ${copy.estimator.exposureHeading}`}
                    hideValue
                    size="sm"
                    tone={pillar.flagged ? 'warn' : 'sea'}
                  />
                </div>
                <p className="mt-1.5 text-xs text-[var(--df-color-muted)]">
                  {formatPercent(pillar.shareOfOperatingCostBasisPoints / 100, 1, numerals)}{' '}
                  {locale === 'bn' ? '— মোট পরিচালন ব্যয়ের' : 'of total operating cost'}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        {/* Waterfall */}
        <Card tone="context" padding="lg">
          <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
            {copy.chart.heading}
          </h3>
          <Waterfall estimate={estimate} copy={copy} locale={locale} />
        </Card>

        {/* Sensitivity ladder */}
        <Card tone="context" padding="lg">
          <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
            {copy.estimator.ladderHeading}
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{copy.estimator.ladderNote}</p>

          <TableWrap caption={copy.estimator.ladderHeading} stickyHeader={false}>
            <THead>
              <TR>
                <TH scope="col">{copy.method.columns.pillar}</TH>
                {sensitivityBasisPoints.map((basisPoints) => (
                  <TH key={basisPoints} scope="col" className="df-num text-end">
                    {formatPercent(basisPoints / 100, 2, numerals)}
                  </TH>
                ))}
              </TR>
            </THead>
            <tbody>
              {estimate.pillars.map((pillar) => (
                <TR key={pillar.id}>
                  <TD className="text-sm text-[var(--df-color-text)]">{copy.pillars[pillar.id].name}</TD>
                  {pillar.ladder.map((step) => (
                    <TD key={step.basisPoints} className="df-num text-end text-sm text-[var(--df-color-text-strong)]">
                      {taka(step.amount, locale)}
                    </TD>
                  ))}
                </TR>
              ))}
            </tbody>
          </TableWrap>
        </Card>

        {/* The withheld range — the page's most important paragraph */}
        <Card tone="quiet" padding="lg" className="border-l-2 border-l-[var(--df-color-gold)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
              {copy.estimator.withheldHeading}
            </h3>
            <Badge tone="regulatory" glyph="◷">
              {copy.estimator.methodStatus} · {publishedOf}
            </Badge>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--df-color-text)]">
            {copy.estimator.withheldBody}
          </p>

          <details className="mt-5 rounded-xl border border-[var(--df-color-border-quiet)] bg-void/30 p-4">
            <summary className="cursor-pointer text-sm font-medium text-sea-300">{copy.method.heading}</summary>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{copy.method.lead}</p>

            <TableWrap caption={copy.method.heading} stickyHeader={false} className="mt-4">
              <THead>
                <TR>
                  <TH scope="col">{copy.method.columns.pillar}</TH>
                  <TH scope="col">{copy.method.columns.industry}</TH>
                  <TH scope="col">{copy.method.columns.range}</TH>
                  <TH scope="col">{copy.method.columns.status}</TH>
                  <TH scope="col">{copy.method.columns.source}</TH>
                </TR>
              </THead>
              <tbody>
                {rows.map((row) => (
                  <TR key={`${row.pillar}-${row.industry}`}>
                    <TD className="text-sm text-[var(--df-color-text)]">{copy.pillars[row.pillar].name}</TD>
                    <TD className="text-sm text-muted">{industryNames[row.industry]}</TD>
                    <TD className="text-sm text-[var(--df-color-muted)]">{copy.method.sourceMissing}</TD>
                    <TD className="text-sm text-muted">
                      {row.resolution.status === 'verified'
                        ? copy.method.statusVerified
                        : row.resolution.status === 'unverified'
                          ? `${copy.method.statusUnverified} — ${copy.method.reason[row.resolution.reasonKey]}`
                          : copy.method.statusUnverified}
                    </TD>
                    <TD className="text-sm text-[var(--df-color-muted)]">{copy.method.sourceMissing}</TD>
                  </TR>
                ))}
              </tbody>
            </TableWrap>

            <p className="mt-3 text-xs leading-relaxed text-muted">
              {copy.method.summary
                .replace('{published}', formatNumber(estimate.publishedRows, numerals))
                .replace('{required}', formatNumber(estimate.requiredRows, numerals))}
            </p>
          </details>
        </Card>

        {/* Priority */}
        <Card tone="context" padding="lg">
          <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
            {copy.estimator.priorityHeading}
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{copy.estimator.priorityNote}</p>

          {estimate.priority.some((id) => input.answers[id] !== null) ? (
            <ol className="mt-5 space-y-3">
              {estimate.priority.map((id, index) => (
                <li key={id} className="flex items-baseline gap-3">
                  <span className="df-num text-xs font-semibold text-[var(--df-color-muted)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-[var(--df-color-text-strong)]">{copy.pillars[id].name}</span>
                  <span className="df-num text-xs text-[var(--df-color-muted)]">
                    {taka(estimate.pillars.find((p) => p.id === id)?.spendBaseAmount ?? 0, locale)}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-[var(--df-color-muted)]">{copy.estimator.priorityEmpty}</p>
          )}
        </Card>

        {/* Recovery window + actions */}
        <Card tone="context" padding="lg">
          <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
            {copy.estimator.recoveryHeading}
          </h3>
          <p className="df-num mt-2 text-2xl font-semibold text-sea-300">
            {locale === 'bn'
              ? `${formatNumber(estimate.recoveryWindowMonths.low, numerals)}–${formatNumber(estimate.recoveryWindowMonths.high, numerals)} মাস`
              : `${estimate.recoveryWindowMonths.low}–${estimate.recoveryWindowMonths.high} months`}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{copy.estimator.recoveryNote}</p>

          {/* Compare-with-industry: a control that exists and says why it is inert. */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-dashed border-[var(--df-color-border-strong)] p-4">
            <input
              id="ce-compare"
              type="checkbox"
              disabled
              aria-describedby="ce-compare-note"
              className="mt-0.5 h-4 w-4"
            />
            <div>
              <label htmlFor="ce-compare" className="text-sm text-muted">
                {copy.estimator.compareLabel}
              </label>
              <p id="ce-compare-note" className="mt-1 text-xs leading-relaxed text-[var(--df-color-muted)]">
                {copy.estimator.compareNote}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={bookHref} size="lg" magnetic>
              {copy.delivery.bookLabel}
            </ButtonLink>
            <ButtonLink href={quoteHref} variant="secondary" size="lg">
              {copy.delivery.quoteLabel}
            </ButtonLink>
            <ButtonLink href={checklistHref} variant="ghost" size="lg">
              {copy.delivery.checklistLabel}
            </ButtonLink>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--df-color-muted)]">
            {copy.delivery.checklistNote}
          </p>

          <div className="mt-6 space-y-3 border-t border-[var(--df-color-border-quiet)] pt-5">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" onClick={copyLink}>
                {copied ? copy.estimator.shareCopied : copy.estimator.shareLabel}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => window.print()}>
                {copy.estimator.printLabel}
              </Button>
              <Button variant="ghost" size="sm" onClick={reset}>
                {copy.estimator.resetLabel}
              </Button>
            </div>
            <p className="text-xs leading-relaxed text-[var(--df-color-muted)]">{copy.estimator.shareHint}</p>
            <p className="df-num break-all rounded-lg border border-[var(--df-color-border-quiet)] bg-void/40 px-3 py-2 text-xs text-muted">
              {shareUrl}
            </p>
          </div>
        </Card>

        {/* Mobile sticky summary — §5.9.3 */}
        <div className="sticky bottom-4 z-[var(--df-z-index-context)] lg:hidden">
          <div className="df-glass df-edge flex items-center justify-between gap-4 rounded-2xl p-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--df-color-muted)]">
                {copy.estimator.stickyLabel}
              </p>
              <p className="df-num text-lg font-semibold text-sea-300">
                {taka(estimate.operatingCost, locale)}
              </p>
            </div>
            <ButtonLink href={bookHref} size="md">
              {copy.estimator.stickyCta}
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* One live region for the whole estimator: committed values only. */}
      <p aria-live="polite" className="df-sr-only">
        {announced}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Waterfall — CSS bars, no canvas, no WebGL (§5.9.4 criterion 4)
   ═══════════════════════════════════════════════════════════════════════════ */

function Waterfall({
  estimate,
  copy,
  locale,
}: {
  estimate: ReturnType<typeof buildEstimate>;
  copy: CostEfficiencyCopy;
  locale: Locale;
}) {
  const numerals = locale === 'bn' ? 'bn' : 'latin';
  const scale = Math.max(estimate.turnover, 1);
  const necessary = Math.min(estimate.operatingCost, estimate.turnover);
  const profit = Math.max(0, estimate.turnover - necessary);

  const bar = (value: number) => `${Math.min(100, (value / scale) * 100)}%`;

  return (
    <figure className="mt-6">
      <div className="space-y-4">
        <Row label={copy.chart.revenue} value={estimate.turnover} width="100%" tone="sea" locale={locale} />
        <Row
          label={copy.chart.necessary}
          value={necessary}
          width={bar(necessary)}
          tone="neutral"
          locale={locale}
        />
        <Row
          label={copy.chart.exposure}
          value={estimate.operatingCost}
          width={bar(estimate.operatingCost)}
          tone="warn"
          locale={locale}
          dashed
        />
        <Row label={copy.chart.profitReported} value={profit} width={bar(profit)} tone="ok" locale={locale} />
        {/* The beat that must stay empty until a benchmark exists. */}
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <span className="text-sm text-[var(--df-color-muted)]">{copy.chart.profitAfter}</span>
            <span className="df-num text-sm font-medium text-[var(--df-color-muted)]">
              {copy.chart.profitAfterWithheld}
            </span>
          </div>
          <div className="mt-2 h-3 w-full rounded-full border border-dashed border-[var(--df-color-border-strong)] bg-[repeating-linear-gradient(135deg,transparent,transparent_6px,color-mix(in_srgb,var(--df-color-border-strong)_60%,transparent)_6px,color-mix(in_srgb,var(--df-color-border-strong)_60%,transparent)_12px)]" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--df-color-muted)]">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-3 rounded-full bg-[var(--df-color-ok)]" />
          {copy.chart.legendNecessary}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-3 rounded-full bg-warn" />
          {copy.chart.legendExposure}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-3 rounded-full border border-dashed border-[var(--df-color-border-strong)]" />
          {copy.chart.legendWithheld}
        </span>
      </div>

      <figcaption className="mt-3 text-xs leading-relaxed text-[var(--df-color-muted)]">
        {copy.chart.axisNote} · {copy.estimator.operatingCostLabel}:{' '}
        {formatNumber(estimate.operatingCost, numerals)} ({formatPercent(estimate.operatingCostShareBasisPoints / 100, 1, numerals)})
      </figcaption>
    </figure>
  );
}

function Row({
  label,
  value,
  width,
  tone,
  locale,
  dashed = false,
}: {
  label: string;
  value: number;
  width: string;
  tone: 'sea' | 'neutral' | 'warn' | 'ok';
  locale: Locale;
  dashed?: boolean;
}) {
  const toneClass = {
    sea: 'bg-[var(--df-gradient-focus)]',
    neutral: 'bg-[var(--df-color-border-strong)]',
    warn: 'bg-warn',
    ok: 'bg-ok',
  }[tone];

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <span className="text-sm text-[var(--df-color-text)]">{label}</span>
        <span className="df-num text-sm font-medium text-[var(--df-color-text-strong)]">
          {taka(value, locale)}
        </span>
      </div>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-void/50">
        <div
          className={cn(
            'h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-out',
            toneClass,
            dashed && 'opacity-70',
          )}
          style={{ width }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════════════════ */

