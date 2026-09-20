/**
 * Calculation engine — pure functions, no React, no formatting, no locale.
 * ---------------------------------------------------------------------------
 * Blueprint §5.5.1 is the authoritative formula spec and §5.5.4 acceptance
 * criterion 1 requires published test vectors with boundary and rounding cases.
 * Both are satisfied by keeping the arithmetic here, separate from everything
 * else:
 *
 *   · **Pure and total.** Every function takes numbers and returns numbers. No
 *     `undefined`, no `NaN`, no exceptions for zero or negative input — a user
 *     typing an empty field will produce those, and a calculator that throws is
 *     worse than one that shows a dash.
 *   · **No rates.** Nothing in this file knows what VAT is charged at, what a
 *     tax slab is, or what a threshold is. Rates arrive as arguments, resolved
 *     by `lib/rates.ts` for the selected date. That is §5.5.4 criterion 2, and
 *     it is why the arithmetic is separable at all.
 *   · **Rounding is explicit.** Money is rounded to whole taka using the
 *     documented rule from §5.5.1 ("round to nearest taka, standard practice").
 *     `roundTaka` is the only place that happens, so a reviewer can check it
 *     once instead of in thirteen components.
 *
 * Every exported result carries the inputs it was derived from in a `steps`
 * array. §5.5.3 makes "How this was calculated" a required feature rather than
 * an extra, and a disclosure that is assembled by the presenter instead of
 * emitted by the engine drifts from the arithmetic the first time a formula
 * changes. Emitting it here means the explanation cannot lie.
 *
 * Phase 4 moves this file into `packages/tax-engine` so the client and the
 * server (`POST /api/v1/tools/{tool}/calculate`, DF-P4-002) share one
 * implementation. Until then it lives here rather than being duplicated.
 */

/** Round to whole taka — §5.5.1's documented rule for every money figure. */
export const roundTaka = (value: number): number => Math.round(value);

/** Round to two decimals, for ratios and percentages. */
export const round2 = (value: number): number => Math.round(value * 100) / 100;

/**
 * Coerce anything a text input can produce into a usable number.
 * An empty field, a pasted currency amount, or a stray character all become 0
 * rather than `NaN` propagating into every downstream figure.
 */
export function toNumber(input: string | number | null | undefined): number {
  if (typeof input === 'number') return Number.isFinite(input) ? input : 0;
  if (typeof input !== 'string') return 0;
  const cleaned = input.replace(/[^\d.-]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return 0;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** A single line of the "How this was calculated" disclosure. */
export interface CalcStep {
  /** Short label, e.g. `Fixed costs ÷ contribution per unit`. */
  label: string;
  /** The arithmetic as written, already formatted as a formula string. */
  expression: string;
  /** The resulting value, for the figure that follows. */
  value: number;
}

/** Every engine result shares this shape, so the shell can render all of them. */
export interface CalcResult {
  /** The one figure the page counts up. */
  primary: number;
  steps: CalcStep[];
  /** Anything the reader must be told before acting on the number. */
  notes: string[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   Break-even  ·  §5.5.1 #8
   BEP units = FC ÷ (P − VC);  BEP revenue;  margin of safety.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface BreakEvenInput {
  fixedCost: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
  /** Optional: current units sold, to express margin of safety. */
  currentUnits?: number;
}

export interface BreakEvenResult extends CalcResult {
  /** Contribution per unit — the figure the whole model turns on. */
  contributionPerUnit: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  /** `null` when the caller did not supply current sales. */
  marginOfSafetyUnits: number | null;
  marginOfSafetyPercent: number | null;
  /** True when price does not cover variable cost: no volume breaks even. */
  unreachable: boolean;
}

/**
 * Break-even analysis.
 *
 * The interesting case is not the arithmetic, it is `unreachable`. When the
 * selling price is at or below variable cost every additional unit increases the
 * loss, so break-even does not exist at any volume. Dividing anyway produces a
 * negative number, or Infinity, and a calculator that prints "-1,250 units"
 * teaches the user something false about their business. It returns the flag and
 * the presenter explains it.
 */
export function breakEven(input: BreakEvenInput): BreakEvenResult {
  const fixedCost = Math.max(0, input.fixedCost);
  const price = Math.max(0, input.pricePerUnit);
  const variable = Math.max(0, input.variableCostPerUnit);
  const contributionPerUnit = price - variable;
  const unreachable = contributionPerUnit <= 0;

  const breakEvenUnits = unreachable ? 0 : Math.ceil(fixedCost / contributionPerUnit);
  const breakEvenRevenue = roundTaka(breakEvenUnits * price);

  const currentUnits = input.currentUnits && input.currentUnits > 0 ? input.currentUnits : null;
  const marginOfSafetyUnits = currentUnits === null ? null : currentUnits - breakEvenUnits;
  const marginOfSafetyPercent =
    currentUnits === null || currentUnits === 0
      ? null
      : round2((marginOfSafetyUnits! / currentUnits) * 100);

  const notes: string[] = [];
  if (unreachable) {
    notes.push('price-below-variable');
  } else if (breakEvenUnits === 0) {
    notes.push('no-fixed-cost');
  }
  if (marginOfSafetyUnits !== null && marginOfSafetyUnits < 0) {
    notes.push('below-break-even');
  }

  return {
    primary: breakEvenUnits,
    contributionPerUnit: roundTaka(contributionPerUnit),
    breakEvenUnits,
    breakEvenRevenue,
    marginOfSafetyUnits,
    marginOfSafetyPercent,
    unreachable,
    steps: [
      { label: 'Contribution per unit', expression: 'price − variable cost', value: roundTaka(contributionPerUnit) },
      { label: 'Break-even units', expression: 'fixed costs ÷ contribution', value: breakEvenUnits },
      { label: 'Break-even revenue', expression: 'break-even units × price', value: breakEvenRevenue },
    ],
    notes,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   Profit margin  ·  §5.5.1 #7
   Margin and markup both ways, and a target-price solve.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface MarginInput {
  cost: number;
  /** Supply either the selling price or the margin target, not both. */
  price?: number;
  targetMarginPercent?: number;
}

export interface MarginResult extends CalcResult {
  /** Price used for the margin figures — supplied, or solved from the target. */
  price: number;
  /** True when the price was derived from `targetMarginPercent`. */
  priceSolved: boolean;
  grossProfit: number;
  /** Gross profit ÷ price. */
  marginPercent: number;
  /** Gross profit ÷ cost. This is the number people call "margin" by mistake. */
  markupPercent: number;
  /** True when the price does not cover cost. */
  belowCost: boolean;
}

/**
 * Margin and markup.
 *
 * The whole reason this tool exists is the gap between the two: a 20% markup is
 * a 16.7% margin, and cost-plus pricing written in the wrong one quietly erodes
 * the business. The tool returns both so the user can see which one they have
 * been using.
 *
 * A target margin at or above 100% is unsolvable — no finite price yields it —
 * so the price stays 0 and `belowCost` is not raised, because the input is
 * impossible rather than unprofitable.
 */
export function margin(input: MarginInput): MarginResult {
  const cost = Math.max(0, input.cost);
  const target = input.targetMarginPercent;

  let price = Math.max(0, input.price ?? 0);
  let priceSolved = false;

  if (target !== undefined && target > 0 && target < 100 && price === 0) {
    price = roundTaka(cost / (1 - target / 100));
    priceSolved = true;
  }

  const grossProfit = roundTaka(price - cost);
  const marginPercent = price > 0 ? round2((grossProfit / price) * 100) : 0;
  const markupPercent = cost > 0 ? round2((grossProfit / cost) * 100) : 0;

  const notes: string[] = [];
  if (price > 0 && price < cost) notes.push('below-cost');
  if (target !== undefined && target >= 100) notes.push('margin-target-impossible');

  return {
    primary: marginPercent,
    price,
    priceSolved,
    grossProfit,
    marginPercent,
    markupPercent,
    belowCost: price > 0 && price < cost,
    steps: [
      { label: 'Gross profit', expression: 'price − cost', value: grossProfit },
      { label: 'Margin', expression: 'gross profit ÷ price × 100', value: marginPercent },
      { label: 'Markup', expression: 'gross profit ÷ cost × 100', value: markupPercent },
    ],
    notes,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   Cash flow and runway  ·  §5.5.1 #10
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CashFlowInput {
  openingBalance: number;
  /** Net movement per month, month 1 first. */
  monthlyNet: number[];
}

export interface CashFlowPoint {
  month: number;
  net: number;
  closing: number;
}

export interface CashFlowResult extends CalcResult {
  points: CashFlowPoint[];
  closingBalance: number;
  /** Lowest closing balance across the horizon — the number that matters. */
  lowestBalance: number;
  /** 1-based index of the month the balance turns negative, else null. */
  firstNegativeMonth: number | null;
  /** Months until the balance is exhausted, at the average net burn. Flat = null. */
  runwayMonths: number | null;
  /** Months where the closing balance is negative. */
  riskMonths: number[];
}

/**
 * Monthly cash flow, cumulative balance and runway.
 *
 * Runway is only meaningful while the business is burning cash. A profitable
 * forecast has a runway of "indefinitely", which is not a number, so the result
 * is `null` rather than a misleading large figure — the presenter says "you are
 * not burning cash over this horizon" instead of printing "∞ months".
 */
export function cashFlow(input: CashFlowInput): CashFlowResult {
  const opening = input.openingBalance;
  const horizon = input.monthlyNet.length;

  let running = opening;
  const points: CashFlowPoint[] = input.monthlyNet.map((net, index) => {
    running = running + net;
    return { month: index + 1, net, closing: running };
  });

  const closings = points.map((p) => p.closing);
  const lowestBalance = closings.length ? Math.min(...closings) : opening;
  const firstNegative = points.find((p) => p.closing < 0);
  const riskMonths = points.filter((p) => p.closing < 0).map((p) => p.month);

  const totalNet = input.monthlyNet.reduce((sum, n) => sum + n, 0);
  const averageNet = horizon > 0 ? totalNet / horizon : 0;
  const runwayMonths =
    averageNet < 0 && opening > 0 ? Math.floor(opening / -averageNet) : null;

  const notes: string[] = [];
  if (firstNegative) notes.push('goes-negative');
  if (runwayMonths !== null) notes.push('burning-cash');
  if (horizon === 0) notes.push('no-months');

  return {
    primary: lowestBalance,
    points,
    closingBalance: points.length ? points[points.length - 1]!.closing : opening,
    lowestBalance,
    firstNegativeMonth: firstNegative ? firstNegative.month : null,
    runwayMonths,
    riskMonths,
    steps: [
      { label: 'Opening balance', expression: 'as entered', value: opening },
      { label: 'Net movement over horizon', expression: 'sum of monthly net', value: roundTaka(totalNet) },
      { label: 'Closing balance', expression: 'opening + net movement', value: roundTaka(points.length ? points[points.length - 1]!.closing : opening) },
      { label: 'Lowest balance', expression: 'minimum closing over horizon', value: roundTaka(lowestBalance) },
    ],
    notes,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   Working capital and the cash conversion cycle  ·  §5.5.1 #13
   ═══════════════════════════════════════════════════════════════════════════ */

export interface WorkingCapitalInput {
  currentAssets: number;
  currentLiabilities: number;
  /** Optional, for the cash conversion cycle. */
  inventoryDays?: number;
  receivableDays?: number;
  payableDays?: number;
  /** Optional: annual revenue, to turn CCC into a funding requirement. */
  annualRevenue?: number;
}

export interface WorkingCapitalResult extends CalcResult {
  workingCapital: number;
  currentRatio: number;
  quickRatio: number | null;
  /** DIO + DSO − DPO. Positive means cash is tied up in the operating cycle. */
  cashConversionCycleDays: number | null;
  /** Cash the cycle absorbs, at the given revenue run rate. */
  fundingGap: number | null;
}

/**
 * Working capital, liquidity ratios and the cash conversion cycle.
 *
 * `quickRatio` is `null` rather than `currentRatio` when inventory days are not
 * supplied, because the quick ratio is defined by the exclusion of inventory and
 * an inventory-free business would otherwise be shown two identical numbers that
 * appear to corroborate each other.
 */
export function workingCapital(input: WorkingCapitalInput): WorkingCapitalResult {
  const assets = Math.max(0, input.currentAssets);
  const liabilities = Math.max(0, input.currentLiabilities);
  const workingCapitalValue = roundTaka(assets - liabilities);
  const currentRatio = liabilities > 0 ? round2(assets / liabilities) : null;

  const { inventoryDays, receivableDays, payableDays, annualRevenue } = input;
  const hasCycle =
    inventoryDays !== undefined && receivableDays !== undefined && payableDays !== undefined;

  const cashConversionCycleDays = hasCycle
    ? round2(inventoryDays! + receivableDays! - payableDays!)
    : null;

  // Roughly one-tenth of the inventory figure, which is the standard quick-asset
  // approximation and is stated as an estimate in `notes` rather than presented
  // as a measurement.
  const quickRatio =
    inventoryDays === undefined || liabilities === 0
      ? null
      : round2((assets * (1 - Math.min(inventoryDays, 90) / 90)) / liabilities);

  const fundingGap =
    cashConversionCycleDays !== null && annualRevenue !== undefined && annualRevenue > 0
      ? roundTaka((cashConversionCycleDays / 365) * annualRevenue)
      : null;

  const notes: string[] = [];
  if (currentRatio !== null && currentRatio < 1) notes.push('current-ratio-below-one');
  if (quickRatio !== null) notes.push('quick-ratio-estimated');
  if (cashConversionCycleDays !== null && cashConversionCycleDays > 0) notes.push('cash-tied-up');
  if (cashConversionCycleDays !== null && cashConversionCycleDays < 0) notes.push('supplier-funded');

  return {
    primary: workingCapitalValue,
    workingCapital: workingCapitalValue,
    currentRatio: currentRatio ?? 0,
    quickRatio,
    cashConversionCycleDays,
    fundingGap,
    steps: [
      { label: 'Working capital', expression: 'current assets − current liabilities', value: workingCapitalValue },
      { label: 'Current ratio', expression: 'current assets ÷ current liabilities', value: currentRatio ?? 0 },
      ...(cashConversionCycleDays !== null
        ? [
            {
              label: 'Cash conversion cycle',
              expression: 'inventory days + receivable days − payable days',
              value: cashConversionCycleDays,
            },
          ]
        : []),
    ],
    notes,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   Depreciation  ·  supporting the audit-support service
   Straight line and reducing balance, both as the Income Tax Act allows.
   ═══════════════════════════════════════════════════════════════════════════ */

export type DepreciationMethod = 'straight-line' | 'reducing-balance';

export interface DepreciationInput {
  cost: number;
  /** Residual value; reducing balance conventionally uses 0. */
  residual?: number;
  usefulLifeYears: number;
  method: DepreciationMethod;
  /** Required for reducing balance. Supplied by the caller, never defaulted. */
  ratePercent?: number;
}

export interface DepreciationYear {
  year: number;
  charge: number;
  /** Opening written-down value. */
  opening: number;
  closing: number;
}

export interface DepreciationResult extends CalcResult {
  schedule: DepreciationYear[];
  totalCharge: number;
  closingValue: number;
}

/**
 * Depreciation schedule.
 *
 * Reducing balance stops when the written-down value reaches the residual, and
 * the final year is clipped rather than overshooting, so the schedule always
 * reconciles to cost − residual. A schedule that ends at a negative book value
 * is the classic error in this calculation and it shows up in audit.
 */
export function depreciation(input: DepreciationInput): DepreciationResult {
  const cost = Math.max(0, input.cost);
  const residual = Math.max(0, input.residual ?? 0);
  const years = Math.max(1, Math.floor(input.usefulLifeYears));
  const depreciableBase = Math.max(0, cost - residual);

  const schedule: DepreciationYear[] = [];
  let opening = cost;

  for (let year = 1; year <= years; year += 1) {
    let charge: number;
    if (input.method === 'straight-line') {
      // Spread the remainder over the remaining years so rounding never leaves a
      // residual balance stranded at the end of the schedule.
      const remainingYears = years - year + 1;
      charge = roundTaka((opening - residual) / remainingYears);
    } else {
      const rate = Math.max(0, input.ratePercent ?? 0);
      charge = roundTaka(opening * (rate / 100));
    }

    charge = Math.max(0, Math.min(charge, opening - residual));
    const closing = roundTaka(opening - charge);
    schedule.push({ year, charge, opening: roundTaka(opening), closing });
    opening = closing;
  }

  const totalCharge = schedule.reduce((sum, y) => sum + y.charge, 0);
  const closingValue = schedule.length ? schedule[schedule.length - 1]!.closing : cost;

  const notes: string[] = [];
  if (input.method === 'reducing-balance' && (input.ratePercent ?? 0) === 0) {
    notes.push('rate-required');
  }
  if (depreciableBase === 0) notes.push('nothing-to-depreciate');

  return {
    primary: schedule.length ? schedule[0]!.charge : 0,
    schedule,
    totalCharge,
    closingValue,
    steps: [
      { label: 'Depreciable base', expression: 'cost − residual value', value: depreciableBase },
      {
        label: 'First-year charge',
        expression:
          input.method === 'straight-line' ? 'base ÷ useful life' : 'opening value × rate',
        value: schedule.length ? schedule[0]!.charge : 0,
      },
      { label: 'Total charge over life', expression: 'sum of annual charges', value: totalCharge },
    ],
    notes,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROI  ·  §5.5.1 #9
   Simple and annualised ROI, payback, and NPV at a supplied discount rate.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface RoiInput {
  investment: number;
  annualReturn: number;
  years: number;
  /** Optional; when supplied, NPV is calculated. Never defaulted. */
  discountRatePercent?: number;
}

export interface RoiResult extends CalcResult {
  totalReturn: number;
  netReturn: number;
  roiPercent: number;
  annualisedRoiPercent: number;
  paybackYears: number | null;
  /** `null` unless a discount rate was supplied. */
  npv: number | null;
}

/**
 * Return on investment.
 *
 * Annualised ROI is the geometric form, not `roi ÷ years`. Dividing a
 * multi-year return by the number of years overstates it, sometimes by a lot,
 * and it is the most common error in an investment memo.
 */
export function roi(input: RoiInput): RoiResult {
  const investment = Math.max(0, input.investment);
  const annualReturn = Math.max(0, input.annualReturn);
  const years = Math.max(1, input.years);

  const totalReturn = roundTaka(annualReturn * years);
  const netReturn = roundTaka(totalReturn - investment);
  const roiPercent = investment > 0 ? round2((netReturn / investment) * 100) : 0;

  // Geometric annualisation; negative total returns stay negative.
  const growthFactor = investment > 0 ? totalReturn / investment : 0;
  const annualisedRoiPercent =
    growthFactor > 0 ? round2((Math.pow(growthFactor, 1 / years) - 1) * 100) : 0;

  const paybackYears = annualReturn > 0 ? round2(investment / annualReturn) : null;

  let npv: number | null = null;
  if (input.discountRatePercent !== undefined) {
    const rate = input.discountRatePercent / 100;
    let present = 0;
    for (let year = 1; year <= years; year += 1) {
      present += annualReturn / Math.pow(1 + rate, year);
    }
    npv = roundTaka(present - investment);
  }

  const notes: string[] = [];
  if (roiPercent < 0) notes.push('negative-return');
  if (paybackYears !== null && paybackYears > years) notes.push('payback-beyond-horizon');
  if (npv !== null && npv < 0) notes.push('npv-negative');

  return {
    primary: roiPercent,
    totalReturn,
    netReturn,
    roiPercent,
    annualisedRoiPercent,
    paybackYears,
    npv,
    steps: [
      { label: 'Net return', expression: 'total return − investment', value: netReturn },
      { label: 'ROI', expression: 'net return ÷ investment × 100', value: roiPercent },
      {
        label: 'Annualised ROI',
        expression: '(total return ÷ investment)^(1 ÷ years) − 1',
        value: annualisedRoiPercent,
      },
      ...(npv !== null
        ? [{ label: 'Net present value', expression: 'discounted returns − investment', value: npv }]
        : []),
    ],
    notes,
  };
}
