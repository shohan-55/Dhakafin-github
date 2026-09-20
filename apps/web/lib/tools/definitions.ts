/**
 * Tool definitions — what each calculator asks for, and how it computes.
 * ---------------------------------------------------------------------------
 * §5.5.2 says all thirteen tools share one shell. That is only true if the shell
 * is told what to render, so each tool declares its inputs here as data and the
 * shell renders whatever it is given. A new tool is a registry entry and a
 * dictionary entry — no new component, no new layout, no new interaction spec to
 * get subtly wrong.
 *
 * WHY INPUTS ARE DATA RATHER THAN JSX
 * It is what makes the accessibility, the mobile layout, the thousand-separator
 * formatting and the "live results" behaviour applied once instead of thirteen
 * times. It is also what makes §5.5.4 criterion 2 checkable: not one of these
 * definitions contains a rate, a slab or a threshold — a rate either comes from
 * the person doing the calculation or, when the tool genuinely cannot work
 * without a verified published figure, the tool says so instead of inventing one.
 *
 * `pending` is the honest-state mechanism. Three tools cannot function without
 * data that does not exist yet in this build, and a calculator that returns a
 * plausible-looking wrong answer is worse than one that explains what it is
 * waiting for. Each of those still ships a complete page: formula, example,
 * FAQs, schema, related links. Only the result panel is held back.
 *
 * Sources: blueprint §5.5.1 (inventory), §5.5.2 (shell), §5.5.3 (interaction),
 *          §5.5.4 (acceptance criteria).
 */

import type { ToolSlug } from '../content/tools';
import {
  breakEven,
  cashFlow,
  margin,
  payroll,
  profit,
  roi,
  vat,
  withholding,
  workingCapital,
  type CalcResult,
} from './engine';

/* ── Input vocabulary ──────────────────────────────────────────────────── */

export type ToolInputKind =
  | 'currency'
  | 'number'
  | 'percent'
  | 'date'
  | 'select'
  | 'toggle'
  | 'series';

export interface ToolInputSpec {
  id: string;
  kind: ToolInputKind;
  default: number | string | boolean | number[];
  /** `select` only. Labels come from the dictionary for this tool. */
  options?: { value: string }[];
  /** `series` only — how many periods to collect. */
  count?: number;
  /** Render the input inside the collapsed advanced group. */
  advanced?: boolean;
}

/**
 * Values as the shell hands them to a definition. Accessors rather than a raw
 * record so a misspelled id is a visible `0` at the call site during review,
 * instead of `undefined` propagating through the arithmetic.
 */
export interface ToolValues {
  num(id: string): number;
  str(id: string): string;
  bool(id: string): boolean;
  series(id: string): number[];
}

export type ToolPendingReason = 'rates' | 'benchmarks';

export interface ToolDefinition {
  slug: ToolSlug;
  inputs: ToolInputSpec[];
  /**
   * Why this tool cannot produce a result yet, or `null` when it can.
   * `rates` — needs a verified published figure resolved for a date.
   * `benchmarks` — needs the documented avoidable-cost model to be defensible.
   */
  pending: ToolPendingReason | null;
  /** Absent while `pending` is set. */
  compute?: (values: ToolValues) => CalcResult;
}

/* ── Definitions ───────────────────────────────────────────────────────── */

const definitions: Record<ToolSlug, ToolDefinition> = {
  /* ── Compliance tools with a rate the user supplies ───────────────────── */

  'tds-calculator': {
    slug: 'tds-calculator',
    pending: null,
    inputs: [
      { id: 'paymentType', kind: 'select', default: 'service', options: [
        { value: 'service' }, { value: 'contract' }, { value: 'rent' }, { value: 'professional' },
        { value: 'supply' }, { value: 'other' },
      ] },
      { id: 'amount', kind: 'currency', default: 500_000 },
      { id: 'rate', kind: 'percent', default: 0 },
      { id: 'date', kind: 'date', default: '' },
      { id: 'alreadyDeducted', kind: 'currency', default: 0, advanced: true },
    ],
    compute: (v) =>
      withholding({
        amount: v.num('amount'),
        ratePercent: v.num('rate'),
        alreadyDeducted: v.num('alreadyDeducted') || undefined,
      }),
  },

  'vds-calculator': {
    slug: 'vds-calculator',
    pending: null,
    inputs: [
      { id: 'serviceType', kind: 'select', default: 'consulting', options: [
        { value: 'consulting' }, { value: 'contract' }, { value: 'advertising' },
        { value: 'transport' }, { value: 'other' },
      ] },
      { id: 'amount', kind: 'currency', default: 500_000 },
      { id: 'rate', kind: 'percent', default: 0 },
      { id: 'vatRegistered', kind: 'toggle', default: true },
      { id: 'date', kind: 'date', default: '' },
    ],
    compute: (v) =>
      withholding({ amount: v.num('amount'), ratePercent: v.num('rate') }),
  },

  'vat-calculator': {
    slug: 'vat-calculator',
    pending: null,
    inputs: [
      { id: 'mode', kind: 'select', default: 'exclusive', options: [
        { value: 'exclusive' }, { value: 'inclusive' },
      ] },
      { id: 'amount', kind: 'currency', default: 100_000 },
      { id: 'rate', kind: 'percent', default: 0 },
      { id: 'inputCredit', kind: 'currency', default: 0, advanced: true },
    ],
    compute: (v) =>
      vat({
        mode: v.str('mode') === 'inclusive' ? 'inclusive' : 'exclusive',
        amount: v.num('amount'),
        ratePercent: v.num('rate'),
        inputCredit: v.num('inputCredit'),
      }),
  },

  'payroll-calculator': {
    slug: 'payroll-calculator',
    pending: null,
    inputs: [
      { id: 'headcount', kind: 'number', default: 40 },
      { id: 'grossPerHead', kind: 'currency', default: 35_000 },
      { id: 'allowancesPerHead', kind: 'currency', default: 5_000 },
      { id: 'overtimePerHead', kind: 'currency', default: 0, advanced: true },
      { id: 'tdsRate', kind: 'percent', default: 0, advanced: true },
      { id: 'contributionRate', kind: 'percent', default: 0, advanced: true },
    ],
    compute: (v) =>
      payroll({
        headcount: v.num('headcount'),
        grossPerHead: v.num('grossPerHead'),
        allowancesPerHead: v.num('allowancesPerHead'),
        overtimePerHead: v.num('overtimePerHead'),
        tdsRatePercent: v.num('tdsRate') || undefined,
        employerContributionPercent: v.num('contributionRate') || undefined,
      }),
  },

  /* ── Tools whose arithmetic is entirely the user's own figures ────────── */

  'profit-calculator': {
    slug: 'profit-calculator',
    pending: null,
    inputs: [
      { id: 'revenue', kind: 'currency', default: 3_000_000 },
      { id: 'costOfGoods', kind: 'currency', default: 1_800_000 },
      { id: 'operatingExpenses', kind: 'currency', default: 850_000 },
    ],
    compute: (v) =>
      profit({
        revenue: v.num('revenue'),
        costOfGoods: v.num('costOfGoods'),
        operatingExpenses: v.num('operatingExpenses'),
      }),
  },

  'profit-margin-calculator': {
    slug: 'profit-margin-calculator',
    pending: null,
    inputs: [
      { id: 'cost', kind: 'currency', default: 850 },
      { id: 'price', kind: 'currency', default: 1_050 },
      { id: 'targetMargin', kind: 'percent', default: 0, advanced: true },
    ],
    compute: (v) =>
      margin({
        cost: v.num('cost'),
        price: v.num('price'),
        targetMarginPercent: v.num('targetMargin') || undefined,
      }),
  },

  'break-even-calculator': {
    slug: 'break-even-calculator',
    pending: null,
    inputs: [
      { id: 'fixedCost', kind: 'currency', default: 400_000 },
      { id: 'pricePerUnit', kind: 'currency', default: 850 },
      { id: 'variableCostPerUnit', kind: 'currency', default: 520 },
      { id: 'currentUnits', kind: 'number', default: 1_400, advanced: true },
    ],
    compute: (v) =>
      breakEven({
        fixedCost: v.num('fixedCost'),
        pricePerUnit: v.num('pricePerUnit'),
        variableCostPerUnit: v.num('variableCostPerUnit'),
        currentUnits: v.num('currentUnits') || undefined,
      }),
  },

  'roi-calculator': {
    slug: 'roi-calculator',
    pending: null,
    inputs: [
      { id: 'investment', kind: 'currency', default: 2_500_000 },
      { id: 'annualReturn', kind: 'currency', default: 700_000 },
      { id: 'years', kind: 'number', default: 5 },
      { id: 'discountRate', kind: 'percent', default: 0, advanced: true },
    ],
    compute: (v) =>
      roi({
        investment: v.num('investment'),
        annualReturn: v.num('annualReturn'),
        years: v.num('years') || 1,
        discountRatePercent: v.num('discountRate') || undefined,
      }),
  },

  'cash-flow-calculator': {
    slug: 'cash-flow-calculator',
    pending: null,
    inputs: [
      { id: 'openingBalance', kind: 'currency', default: 1_500_000 },
      {
        id: 'monthlyNet',
        kind: 'series',
        count: 12,
        default: [-80_000, -40_000, 120_000, 60_000, -20_000, 90_000, 140_000, -60_000, 30_000, 80_000, 110_000, 160_000],
      },
    ],
    compute: (v) =>
      cashFlow({ openingBalance: v.num('openingBalance'), monthlyNet: v.series('monthlyNet') }),
  },

  'working-capital-calculator': {
    slug: 'working-capital-calculator',
    pending: null,
    inputs: [
      { id: 'currentAssets', kind: 'currency', default: 4_000_000 },
      { id: 'currentLiabilities', kind: 'currency', default: 2_500_000 },
      { id: 'inventoryDays', kind: 'number', default: 60, advanced: true },
      { id: 'receivableDays', kind: 'number', default: 45, advanced: true },
      { id: 'payableDays', kind: 'number', default: 30, advanced: true },
      { id: 'annualRevenue', kind: 'currency', default: 0, advanced: true },
    ],
    compute: (v) =>
      workingCapital({
        currentAssets: v.num('currentAssets'),
        currentLiabilities: v.num('currentLiabilities'),
        inventoryDays: v.num('inventoryDays'),
        receivableDays: v.num('receivableDays'),
        payableDays: v.num('payableDays'),
        annualRevenue: v.num('annualRevenue') || undefined,
      }),
  },

  /* ── Held back until the data that makes them meaningful exists ───────── */

  'income-tax-calculator': {
    slug: 'income-tax-calculator',
    // A slab engine whose slabs are unknown would be a random number generator
    // wearing a tax calculator's clothes. The slab structure is a published
    // instrument that changes with the Finance Act, and it is precisely the kind
    // of figure that must be resolved for a date rather than typed into a file
    // and forgotten.
    pending: 'rates',
    inputs: [
      { id: 'taxableIncome', kind: 'currency', default: 1_200_000 },
      { id: 'taxAlreadyPaid', kind: 'currency', default: 0, advanced: true },
    ],
  },

  'corporate-tax-calculator': {
    slug: 'corporate-tax-calculator',
    // Worse than unknown here: three different official figures for the same
    // threshold are in circulation depending on which circular is read, and the
    // rate also varies by entity class and by compliance conditions. Any single
    // figure published as authoritative would be misleading.
    pending: 'rates',
    inputs: [
      { id: 'taxableProfit', kind: 'currency', default: 5_000_000 },
      { id: 'entityType', kind: 'select', default: 'private', options: [
        { value: 'private' }, { value: 'public' }, { value: 'bank' }, { value: 'other' },
      ] },
    ],
  },

  'cost-efficiency-calculator': {
    slug: 'cost-efficiency-calculator',
    // The avoidable-cost ranges come from a benchmark model, and a benchmark is
    // only worth anything if it is defensible. Publishing an invented range
    // would be the single most damaging thing this site could do to its own
    // credibility — the tool's entire promise is that the number is real.
    pending: 'benchmarks',
    inputs: [
      { id: 'turnover', kind: 'currency', default: 50_000_000 },
      { id: 'categorySpend', kind: 'series', count: 6, default: [0, 0, 0, 0, 0, 0] },
    ],
  },
};

export const toolDefinitions = definitions;

export const getToolDefinition = (slug: ToolSlug): ToolDefinition => definitions[slug];

/** True when the tool can produce a result today. */
export const isToolLive = (slug: ToolSlug): boolean => definitions[slug].pending === null;
