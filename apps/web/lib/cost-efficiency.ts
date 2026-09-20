/**
 * Cost-efficiency estimator — the arithmetic (DF-P2-044, blueprint §5.9.2).
 * ---------------------------------------------------------------------------
 * Pure functions, no React, no I/O, testable from `node --test`.
 *
 * WHAT THIS COMPUTES, AND WHAT IT REFUSES TO
 * The estimator has two kinds of output and keeps them strictly apart:
 *
 *   1. **Exposure** — how many taka of the reader's own cost base each leakage
 *      surface can act on. This is multiplication of figures the reader supplied
 *      plus the published spend-base mapping in `lib/content/cost-efficiency.ts`.
 *      Nothing is assumed, so nothing can be wrong: if they change a slider the
 *      number moves exactly as their own calculator would move it.
 *
 *   2. **The avoidable range** — how much of that exposure is typically
 *      recoverable. This requires a published benchmark, `resolveBenchmark` has
 *      none, so `range` is `null` and `rangeStatus` says why. It is deliberately
 *      not extrapolated from the exposure, not taken from the widely-quoted
 *      "2–6%", and not replaced by a placeholder ৳0 — each of those would be a
 *      false statement dressed as a conservative one.
 *
 * §5.9.4 criterion 1 requires the estimator to output a range with a method
 * disclosure and never a single "you will save ৳X". Until the benchmark table
 * exists, the criterion the page satisfies is the second half of that sentence:
 * no savings figure is asserted anywhere, and the method table prints every
 * missing row with its reason.
 *
 * Sources: blueprint §5.9.1 beat 5, §5.9.2 (inputs/model/output/guardrails),
 *          §5.9.4 criteria 1, 4, 6.
 */

import {
  benchmarkRequirements,
  isLeakagePillar,
  publishedBenchmarkCount,
  resolveBenchmark,
  sensitivityBasisPoints,
  type BenchmarkResolution,
  type LeakagePillarId,
  type SpendBaseId,
} from './benchmarks.ts';
import {
  categoryBounds,
  categoryRegistry,
  costCategories,
  estimateTokenVersion,
  estimatorIndustries,
  pillarOrder,
  pillarRegistry,
  recoveryWindowMonths,
  turnoverBounds,
  type CostCategoryId,
} from './content/cost-efficiency.ts';
import { isIndustrySlug, type IndustrySlug } from './content/industries.ts';

export type EstimatorIndustry = IndustrySlug | 'other';

export interface CostEfficiencyInput {
  industry: EstimatorIndustry;
  /** Annual turnover in taka. */
  turnover: number;
  /** Each category as a share of turnover, in basis points (5500 = 55%). */
  categories: Record<CostCategoryId, number>;
  /**
   * Process-question answers. `null` is "not answered yet" and is a real state:
   * a screen that forces five answers before showing anything teaches the reader
   * to click through it.
   */
  answers: Record<LeakagePillarId, boolean | null>;
}

export interface CategoryLine {
  id: CostCategoryId;
  shareBasisPoints: number;
  amount: number;
}

export interface PillarExposure {
  id: LeakagePillarId;
  spendBase: SpendBaseId;
  /** Taka of the cost base this surface acts on. */
  spendBaseAmount: number;
  /** That amount as a share of the reader's total operating cost. */
  shareOfOperatingCostBasisPoints: number;
  /**
   * The reader's own arithmetic at four assumed shares. Labelled as theirs
   * everywhere it is shown: `amount = spendBaseAmount × basisPoints / 10 000`.
   */
  ladder: { basisPoints: number; amount: number }[];
  /** What we can publish about the typical avoidable share. Empty of numbers. */
  benchmark: BenchmarkResolution;
  answer: boolean | null;
  /** True when the reader answered the diagnostic question with "yes". */
  flagged: boolean;
}

export interface LeakageEstimate {
  /** Round-trips the inputs. See `encodeEstimateToken` for why this is safe. */
  token: string;
  industry: EstimatorIndustry;
  turnover: number;
  /** Sum of the four category amounts, in taka. */
  operatingCost: number;
  /** Operating cost as a share of turnover, in basis points. */
  operatingCostShareBasisPoints: number;
  categories: CategoryLine[];
  pillars: PillarExposure[];
  /** Null until a published benchmark exists. Never a placeholder zero. */
  range: { low: number; high: number; midpoint: number } | null;
  rangeStatus: 'withheld';
  /** Rows published / rows owed, so the page can say "0 of 20" out loud. */
  publishedRows: number;
  requiredRows: number;
  /** §5.9.2: how long changing a process actually takes, not how long the money takes. */
  recoveryWindowMonths: { low: number; high: number };
  /** Flagged pillars first, then by exposure — the review agenda. */
  priority: LeakagePillarId[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   Defaults
   ═══════════════════════════════════════════════════════════════════════════ */

export const defaultInput = (): CostEfficiencyInput => ({
  industry: 'manufacturing',
  turnover: turnoverBounds.default,
  categories: Object.fromEntries(
    costCategories.map((id) => [id, categoryRegistry[id].defaultBasisPoints]),
  ) as Record<CostCategoryId, number>,
  answers: Object.fromEntries(
    pillarOrder.map((id) => [id, null]),
  ) as Record<LeakagePillarId, boolean | null>,
});

/* ═══════════════════════════════════════════════════════════════════════════
   The estimate
   ═══════════════════════════════════════════════════════════════════════════ */

/** Round to whole taka, so no figure on the page is a float artefact. */
const taka = (value: number) => Math.round(value);

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Build the estimate.
 *
 * Everything the reader sees is derived here in one pass, so a component can
 * never show a figure computed two different ways — which is how a duplicate
 * total appears and destroys trust in a page whose whole argument is arithmetic.
 */
export function buildEstimate(input: CostEfficiencyInput): LeakageEstimate {
  const turnover = clamp(
    Math.round(input.turnover),
    0,
    Number.MAX_SAFE_INTEGER,
  );

  const categories: CategoryLine[] = costCategories.map((id) => {
    const share = clamp(Math.round(input.categories[id] ?? 0), 0, 10_000);
    return { id, shareBasisPoints: share, amount: taka((turnover * share) / 10_000) };
  });

  const operatingCost = taka(categories.reduce((sum, line) => sum + line.amount, 0));
  const operatingCostShareBasisPoints =
    turnover > 0 ? Math.round((operatingCost / turnover) * 10_000) : 0;

  /** Sum of the categories feeding a spend base. `all` means the whole cost base. */
  const baseAmount = (base: SpendBaseId): number => {
    if (base === 'all') return operatingCost;
    return categories
      .filter((line) => categoryRegistry[line.id].spendBase === base)
      .reduce((sum, line) => sum + line.amount, 0);
  };

  const pillars: PillarExposure[] = pillarOrder.map((id) => {
    const definition = pillarRegistry[id];
    const amount = baseAmount(definition.spendBase);
    const answer = input.answers[id] ?? null;
    return {
      id,
      spendBase: definition.spendBase,
      spendBaseAmount: amount,
      shareOfOperatingCostBasisPoints:
        operatingCost > 0 ? Math.round((amount / operatingCost) * 10_000) : 0,
      ladder: sensitivityBasisPoints.map((basisPoints) => ({
        basisPoints,
        amount: taka((amount * basisPoints) / 10_000),
      })),
      benchmark: resolveBenchmark(id, input.industry),
      answer,
      flagged: answer === true,
    };
  });

  const priority = [...pillars]
    .sort((a, b) => {
      if (a.flagged !== b.flagged) return a.flagged ? -1 : 1;
      if (a.spendBaseAmount !== b.spendBaseAmount) return b.spendBaseAmount - a.spendBaseAmount;
      return pillarOrder.indexOf(a.id) - pillarOrder.indexOf(b.id);
    })
    .map((pillar) => pillar.id);

  return {
    token: encodeEstimateToken({ ...input, turnover }),
    industry: input.industry,
    turnover,
    operatingCost,
    operatingCostShareBasisPoints,
    categories,
    pillars,
    range: null,
    rangeStatus: 'withheld',
    publishedRows: publishedBenchmarkCount(estimatorIndustries),
    requiredRows: benchmarkRequirements(estimatorIndustries).length,
    recoveryWindowMonths: { ...recoveryWindowMonths },
    priority,
  };
}

/** §5.9.2's "how we calculated this": every row we owe, with its status. */
export function methodRows(): { pillar: LeakagePillarId; industry: EstimatorIndustry; resolution: BenchmarkResolution }[] {
  return estimatorIndustries.flatMap((industry) =>
    pillarOrder.map((pillar) => ({
      pillar,
      industry,
      resolution: resolveBenchmark(pillar, industry),
    })),
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Share token
   ═══════════════════════════════════════════════════════════════════════════ */

/** One character per answer state, so a token is short and still readable. */
const answerChar = (value: boolean | null): string => (value === null ? '-' : value ? '1' : '0');

/**
 * Encode the inputs into a shareable, inspectable token.
 *
 * The result is a *stateless* link: `?e=v1.manufacturing.50000.5500.…` carries the
 * reader's own figures, so the page they share renders the estimate they saw with
 * no server, no database and no row that could leak someone else's numbers when a
 * URL is mistyped. §5.9.2 asks for a `LeakageEstimate` record with a token; when
 * the Phase 3 API commits one, this token becomes its primary key and the link
 * format does not change — the payload simply stops being the whole record.
 *
 * Deliberately human-readable. A finance professional pasting a link into a
 * WhatsApp thread should be able to see that it contains no more than the numbers
 * they typed, which is the strongest possible answer to "what did I just share?".
 */
export function encodeEstimateToken(input: CostEfficiencyInput): string {
  const categories = costCategories
    .map((id) => clamp(Math.round(input.categories[id] ?? 0), 0, 10_000))
    .join('.');
  const answers = pillarOrder.map((id) => answerChar(input.answers[id] ?? null)).join('');
  const turnoverThousands = Math.round(clamp(Math.round(input.turnover), 0, Number.MAX_SAFE_INTEGER) / 1000);
  return [
    `v${estimateTokenVersion}`,
    input.industry,
    turnoverThousands,
    categories,
    answers,
  ].join('.');
}

/**
 * Decode a share token back to inputs, or return `null`.
 *
 * Strict on purpose: anything unrecognised — a future version, an industry we do
 * not serve, a share above 100%, an unknown answer character — is rejected rather
 * than coerced into a plausible-looking estimate. A shared link that silently
 * renders different numbers than the sender saw is worse than one that says it is
 * out of date.
 */
export function decodeEstimateToken(token: string): CostEfficiencyInput | null {
  // `v1 · industry · turnover · four category shares · answers`
  const expectedParts = 3 + costCategories.length + 1;
  const parts = token.split('.');
  if (parts.length !== expectedParts) return null;

  // Defaults are unreachable after the arity check, but they let the compiler
  // see that every segment is a string without a cast buried in the loop below.
  const [version = '', industry = '', turnoverThousands = '', ...tail] = parts;
  const answerPart = tail.pop() ?? '';
  const shares = tail;
  if (shares.length !== costCategories.length) return null;
  if (version !== `v${estimateTokenVersion}`) return null;

  if (industry !== 'other' && !isIndustrySlug(industry)) return null;
  if (!(estimatorIndustries as readonly string[]).includes(industry)) return null;

  const turnover = Number(turnoverThousands);
  if (!Number.isInteger(turnover) || turnover < 0) return null;
  if (turnover * 1000 < turnoverBounds.min || turnover * 1000 > turnoverBounds.max) return null;

  const categories = {} as Record<CostCategoryId, number>;
  for (const [index, id] of costCategories.entries()) {
    const share = Number(shares[index]);
    if (!Number.isInteger(share) || share < categoryBounds.min || share > categoryBounds.max) {
      return null;
    }
    categories[id] = share;
  }

  if (answerPart.length !== pillarOrder.length) return null;
  const answers = {} as Record<LeakagePillarId, boolean | null>;
  for (const [index, id] of pillarOrder.entries()) {
    const character = answerPart[index];
    if (character === '1') answers[id] = true;
    else if (character === '0') answers[id] = false;
    else if (character === '-') answers[id] = null;
    else return null;
  }

  return { industry: industry as EstimatorIndustry, turnover: turnover * 1000, categories, answers };
}

/** Type guard kept beside the codec so a decoded pillar id is never reassembled by hand. */
export const isPillarId = isLeakagePillar;
