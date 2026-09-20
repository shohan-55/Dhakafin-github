/**
 * Benchmark resolution — the one place the cost-efficiency estimator is allowed
 * to obtain a published range.
 * ---------------------------------------------------------------------------
 * Blueprint §5.9.2 asks for an estimator whose honesty is the product: "Documented
 * benchmark ranges per industry and category (sourced: NBR/industry reports/
 * internal engagement data with consent), question-weighted adjustment, output as
 * a **range** (low–high) with the mid-point labelled as a typical value."
 *
 * A range is a claim about what is normal, and §5.13's own rule for the industry
 * pages applies with more force here, because this page exists to be believed:
 * publishing a band requires a measured sample and a published method. We have
 * neither yet. So this module is written as `lib/rates.ts` is written — as the
 * contract a data-backed implementation will satisfy, with the data absent by
 * design rather than by omission.
 *
 * WHY THERE ARE NO RANGES IN THIS FILE
 * "2–6% of operating cost is typically avoidable" is repeated all over the
 * internet, usually without a sample, a sector or a year. One number of that kind
 * on this page would undo the credibility the rest of the page is engineered to
 * earn — and worse, a business would make a real purchase decision on it. The
 * estimator therefore computes what can be computed from the reader's own figures
 * (their turnover and their category spends, which are verifiable arithmetic) and
 * *withholds* the savings range, stating which rows are missing and why.
 *
 * A review's actual job, in that state, is to produce the first defensible rows.
 *
 * When the benchmark table lands (sourced, dated, with sample sizes), only
 * `lookupBenchmark` changes: it returns a `verified` resolution and every
 * component responds, because each one is already written against the status
 * union instead of against a number.
 *
 * Sources: blueprint §5.9.2 (inputs, model, output, guardrails), §5.9.4
 *          (criteria 1–2), §5.13.2 (why we do not publish a band we cannot show
 *          the sample for), DF-P2-043 (the same decision, made twice for the
 *          industry KPI tables).
 */

import type { IndustrySlug } from './content/industries';

/** The five leakage surfaces of §5.9.1 beat 4, in the order the page reveals them. */
export const leakagePillars = [
  'purchase-price-variance',
  'supplier-dependency',
  'expense-leakage',
  'inventory-variance',
  'payment-controls',
] as const;

export type LeakagePillarId = (typeof leakagePillars)[number];

export const isLeakagePillar = (value: string): value is LeakagePillarId =>
  (leakagePillars as readonly string[]).includes(value);

/**
 * Which part of the cost base a pillar acts on.
 *
 * This is the one piece of model structure that is *not* dependent on benchmark
 * data: whether purchase-price variance touches procurement or payroll is a fact
 * about the mechanism, not a claim about how large it typically is. Keeping it as
 * data here means the exposure arithmetic in `lib/cost-efficiency.ts` is derived
 * rather than hardcoded per pillar, and a reviewer can check the mapping in one
 * place instead of five.
 */
export type SpendBaseId = 'procurement' | 'payroll' | 'logistics' | 'marketing' | 'all';

/**
 * Provenance for a published range. Deliberately stricter than `RateProvenance`:
 * it also demands the size of the sample, because "industry reports" is not a
 * source and a range without an n is an opinion with a decimal point.
 */
export interface BenchmarkProvenance {
  /** What the range was measured from, e.g. an engagement-data extract or a report. */
  reference: string;
  /** Where a reader can check it. An authority or publisher URL, never a summary. */
  sourceUrl: string;
  /** ISO date the underlying sample ends. A range describes a period, not a moment. */
  sampleTo: string;
  /** How many observations the range was computed from. Required, not optional. */
  sampleSize: number;
  /** The method, in one sentence a reader could repeat to someone else. */
  method: string;
  /** ISO date a named person last recomputed it. */
  verifiedAt: string;
  /** Who is accountable for the figure. */
  verifiedBy: string;
}

export type BenchmarkResolution =
  | {
      status: 'verified';
      pillar: LeakagePillarId;
      industry: IndustrySlug | 'other';
      /** Lower bound of the avoidable share, in basis points. 100 = 1%. */
      lowBasisPoints: number;
      /** Upper bound of the avoidable share, in basis points. */
      highBasisPoints: number;
      provenance: BenchmarkProvenance;
    }
  | {
      /**
       * No sourced range exists for this pillar and industry yet. This is the
       * Phase 2 state for every row, and it is a *designed* state: the estimator
       * renders the reader's own exposure and lists the missing rows instead of
       * inventing a number.
       */
      status: 'unverified';
      pillar: LeakagePillarId;
      industry: IndustrySlug | 'other';
      /** Why it is not published, in the reader's language. */
      reasonKey: BenchmarkReasonKey;
    }
  | {
      /** The pillar's mechanism does not apply to this industry at all. */
      status: 'not-applicable';
      pillar: LeakagePillarId;
      industry: IndustrySlug | 'other';
    };

export type BenchmarkReasonKey =
  | 'no-sample'
  | 'sample-too-small'
  | 'industry-not-covered'
  | 'method-under-review';

/**
 * The rows we owe the reader: every pillar × every industry we serve. Declared
 * rather than hidden inside a lookup, because the method disclosure on the page
 * prints this list with each row's status — a table of what we do not know yet is
 * more useful to a reader than a blank space where a number should be.
 */
export interface BenchmarkRequirement {
  pillar: LeakagePillarId;
  industry: IndustrySlug | 'other';
}

export const benchmarkRequirements = (
  industries: readonly (IndustrySlug | 'other')[],
): BenchmarkRequirement[] =>
  industries.flatMap((industry) => leakagePillars.map((pillar) => ({ pillar, industry })));

/**
 * The benchmark service, in its Phase 2 form: a lookup that finds nothing and
 * says so, with a reason.
 *
 * Deliberately not `async`, for the same reason `lookupRate` is not: when this
 * becomes a fetch the signature changes to `Promise<BenchmarkResolution>` and the
 * compiler walks every call site. A stub that is already async would hide that
 * migration behind an `await` that returns the same empty answer either way.
 */
function lookupBenchmark(
  pillar: LeakagePillarId,
  industry: IndustrySlug | 'other',
): BenchmarkResolution {
  return { status: 'unverified', pillar, industry, reasonKey: 'no-sample' };
}

/**
 * Resolve the avoidable-share range for a pillar in an industry.
 *
 * @param pillar    Which leakage surface is being sized.
 * @param industry  Which industry's cost structure is being described. The same
 *                  pillar behaves differently in a factory and in a distributor,
 *                  so a range is always a pair (pillar, industry) and never a
 *                  single global percentage.
 */
export function resolveBenchmark(
  pillar: LeakagePillarId,
  industry: IndustrySlug | 'other',
): BenchmarkResolution {
  return lookupBenchmark(pillar, industry);
}

/** How many benchmark rows are published. Zero until the sample exists. */
export const publishedBenchmarkCount = (
  industries: readonly (IndustrySlug | 'other')[],
): number =>
  benchmarkRequirements(industries).filter(
    (row) => lookupBenchmark(row.pillar, row.industry).status === 'verified',
  ).length;

/**
 * The sensitivity ladder the estimator exposes instead of a published range.
 *
 * These are not benchmark values — they are the rates at which a reader can see
 * their own arithmetic. The page says so on every step: the amount is
 * "spend × the share you asked about", which a finance manager can check with a
 * calculator, whereas "we think 3% of your cost is recoverable" cannot be checked
 * by anyone and is therefore not said.
 */
export const sensitivityBasisPoints = [25, 50, 100, 200] as const;

export type SensitivityBasisPoint = (typeof sensitivityBasisPoints)[number];
