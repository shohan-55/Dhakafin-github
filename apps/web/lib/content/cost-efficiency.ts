/**
 * Cost-efficiency experience — structure (DF-P2-044, blueprint §5.9).
 * ---------------------------------------------------------------------------
 * The six narrative beats of §5.9.1, the four cost categories of §5.9.2 and the
 * five process questions that weight the estimate. Everything here is structure:
 * the words live in the dictionaries, the arithmetic lives in
 * `lib/cost-efficiency.ts`, and the published ranges live (absent) in
 * `lib/benchmarks.ts`.
 *
 * Why structure is separated from copy: the Bengali page must be the same page.
 * If a beat or a category were renamed in one dictionary the layout would quietly
 * diverge, so both dictionaries are typed against the registries here and a
 * mismatch is a compile error rather than a discovery made by a Bangla reader.
 */

import type { LeakagePillarId, SpendBaseId } from '../benchmarks';
import { leakagePillars } from '../benchmarks.ts';
import type { IndustrySlug } from './industries';

/* ═══════════════════════════════════════════════════════════════════════════
   The narrative
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * §5.9.1's six beats.
 *
 * The page renders in this order and never omits a beat; `interactive` marks the
 * beat that owns the estimator, so the mobile sticky summary knows which section
 * it is summarising without a second source of truth.
 */
export const narrativeBeats = [
  'headline',
  'visible-costs',
  'drift',
  'leakage',
  'profit-impact',
  'delivery',
] as const;

export type NarrativeBeatId = (typeof narrativeBeats)[number];

export interface NarrativeBeat {
  id: NarrativeBeatId;
  /** 1-based, printed as the beat marker. The story is numbered on purpose. */
  index: number;
  interactive: boolean;
}

export const beats: NarrativeBeat[] = narrativeBeats.map((id, index) => ({
  id,
  index: index + 1,
  interactive: id === 'profit-impact',
}));

/* ═══════════════════════════════════════════════════════════════════════════
   Cost categories — §5.9.2 inputs
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * The four categories the estimator asks about, with the spend base each one
 * feeds. These are the reader's own percentages of turnover: nothing here is a
 * published figure, which is why the estimator can be live today.
 */
export const costCategories = ['procurement', 'payroll', 'logistics', 'marketing'] as const;

export type CostCategoryId = (typeof costCategories)[number];

export interface CostCategory {
  id: CostCategoryId;
  /** Feed into the exposure model: which line a pillar acts on. */
  spendBase: SpendBaseId;
  /** Slider default, in basis points of turnover. A starting shape, not a claim. */
  defaultBasisPoints: number;
}

export const categoryRegistry: Record<CostCategoryId, CostCategory> = {
  procurement: { id: 'procurement', spendBase: 'procurement', defaultBasisPoints: 5500 },
  payroll: { id: 'payroll', spendBase: 'payroll', defaultBasisPoints: 1800 },
  logistics: { id: 'logistics', spendBase: 'logistics', defaultBasisPoints: 1200 },
  marketing: { id: 'marketing', spendBase: 'marketing', defaultBasisPoints: 900 },
};

/* ═══════════════════════════════════════════════════════════════════════════
   Pillars and their questions — §5.9.1 beat 4, §5.9.4 criterion 2
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Each pillar declares which spend base it acts on and which process question
 * probes it. §5.9.4 criterion 2 requires every pillar to carry a name, a
 * question, a typical range, an example and a policy note — the range comes from
 * `resolveBenchmark` (currently unverified and labelled as such), and the other
 * four are required properties of the dictionary entries, so a pillar cannot ship
 * without them.
 *
 * The question is phrased so that "yes" means *the exposure is likely present*:
 * a reader who answers "yes" five times has told us where to look first, and a
 * reader who answers "no" has told us the control exists, which is the strongest
 * thing a five-question screen can learn.
 */
export interface PillarDefinition {
  id: LeakagePillarId;
  spendBase: SpendBaseId;
  questionId: string;
}

export const pillarRegistry: Record<LeakagePillarId, PillarDefinition> = {
  'purchase-price-variance': {
    id: 'purchase-price-variance',
    spendBase: 'procurement',
    questionId: 'price-dispersion',
  },
  'supplier-dependency': {
    id: 'supplier-dependency',
    spendBase: 'procurement',
    questionId: 'single-source',
  },
  'expense-leakage': {
    id: 'expense-leakage',
    spendBase: 'all',
    questionId: 'post-hoc-approval',
  },
  'inventory-variance': {
    id: 'inventory-variance',
    spendBase: 'procurement',
    questionId: 'count-difference',
  },
  'payment-controls': {
    id: 'payment-controls',
    spendBase: 'all',
    questionId: 'release-check',
  },
};

/** Pillars in the order §5.9.1 reveals them, derived from the registry. */
export const pillarOrder: LeakagePillarId[] = [...leakagePillars];

/* ═══════════════════════════════════════════════════════════════════════════
   Estimator bounds
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Turnover slider bounds, in ৳.
 *
 * The band starts at ৳5,000,000 because below that a commissioned review costs
 * more than the leakage it would find, and an estimator that invites a review it
 * cannot pay for is a sales device rather than a tool. The page says that out
 * loud next to the slider instead of quietly refusing to help.
 */
export const turnoverBounds = {
  min: 5_000_000,
  max: 2_000_000_000,
  step: 5_000_000,
  default: 50_000_000,
} as const;

/** Category spend sliders are shares of turnover, in basis points. */
export const categoryBounds = { min: 0, max: 10_000, step: 50 } as const;

/**
 * Recovery timeline from §5.9.2's output row: "realistic recovery timeline
 * (3–6 months)".
 *
 * This is a statement about review mechanics — how long it takes to change a
 * purchase process, renegotiate a supply agreement or install a control — not
 * about how much money is there, so it does not depend on benchmark data and can
 * be stated today.
 */
export const recoveryWindowMonths = { low: 3, high: 6 } as const;

/** Industries the estimator offers. `other` is a real answer, not a fallback. */
export const estimatorIndustries: (IndustrySlug | 'other')[] = [
  'manufacturing',
  'trading',
  'ecommerce',
  'other',
];

/** The estimate token's version. Bumping it invalidates old share links loudly. */
export const estimateTokenVersion = 1;
