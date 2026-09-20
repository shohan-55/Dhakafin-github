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

/* ═══════════════════════════════════════════════════════════════════════════
   Withholding  ·  §5.5.1 #1 and #2
   TDS and VDS are the same arithmetic on different instruments, so they are one
   function. The rate is always supplied by the caller — see `lib/rates.ts` for
   why this engine never knows a rate.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface WithholdingInput {
  amount: number;
  /** Percentage, supplied by the caller. 0 is a valid rate; absent is not. */
  ratePercent: number;
  /** Optional: an amount already deducted, to reconcile against a document. */
  alreadyDeducted?: number;
}

export interface WithholdingResult extends CalcResult {
  deduction: number;
  netPayable: number;
  effectiveRatePercent: number;
  /** Present only when `alreadyDeducted` was supplied. */
  difference: number | null;
}

/**
 * A withholding deduction: TDS on a payment, VDS on a service bill.
 *
 * The one non-obvious behaviour is `effectiveRatePercent`. When reconciling
 * against a document, the amount actually withheld divided by the gross is the
 * only figure that explains a mismatch, and it is routinely different from the
 * headline rate — because of a threshold applying to part of the payment, or
 * because the deduction was computed on an amount that already excluded VAT.
 * Showing it turns "the numbers don't match" into "the rate applied was 4.17%".
 */
export function withholding(input: WithholdingInput): WithholdingResult {
  const amount = Math.max(0, input.amount);
  const rate = Math.max(0, input.ratePercent);
  const deduction = roundTaka(amount * (rate / 100));
  const netPayable = roundTaka(amount - deduction);
  const effectiveRatePercent = amount > 0 ? round2((deduction / amount) * 100) : 0;

  const difference =
    input.alreadyDeducted === undefined ? null : roundTaka(deduction - input.alreadyDeducted);

  const notes: string[] = [];
  if (rate === 0) notes.push('rate-not-supplied');
  if (difference !== null && difference !== 0) notes.push('does-not-reconcile');

  return {
    primary: deduction,
    deduction,
    netPayable,
    effectiveRatePercent,
    difference,
    steps: [
      { label: 'Deduction', expression: 'amount × rate ÷ 100', value: deduction },
      { label: 'Net payable', expression: 'amount − deduction', value: netPayable },
      { label: 'Effective rate', expression: 'deduction ÷ amount × 100', value: effectiveRatePercent },
    ],
    notes,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   VAT  ·  §5.5.1 #3
   Exclusive and inclusive directions, and input credit.
   ═══════════════════════════════════════════════════════════════════════════ */

export type VatMode = 'exclusive' | 'inclusive';

export interface VatInput {
  mode: VatMode;
  amount: number;
  ratePercent: number;
  /** Eligible input VAT to offset, e.g. from purchases. */
  inputCredit?: number;
}

export interface VatResult extends CalcResult {
  base: number;
  vat: number;
  total: number;
  netPayable: number;
}

/**
 * VAT in both directions, with input credit.
 *
 * The direction is the whole tool. Entering a VAT-inclusive invoice total into
 * the exclusive form overstates the tax by the tax — a 15% error on a 15% rate,
 * and one of the most common mistakes in a Mushak 9.1 reconciliation. The mode
 * is therefore an explicit, required choice rather than something inferred from
 * the size of the number.
 *
 * Net payable is floored at zero. A credit balance is carried forward under the
 * rules rather than refunded at the counter, so printing a negative "payable"
 * would suggest money is coming back when it is not.
 */
export function vat(input: VatInput): VatResult {
  const amount = Math.max(0, input.amount);
  const rate = Math.max(0, input.ratePercent);
  const credit = Math.max(0, input.inputCredit ?? 0);

  let base: number;
  let vatAmount: number;
  let total: number;

  if (input.mode === 'inclusive') {
    base = roundTaka(amount / (1 + rate / 100));
    total = roundTaka(amount);
    vatAmount = roundTaka(total - base);
  } else {
    base = roundTaka(amount);
    vatAmount = roundTaka(base * (rate / 100));
    total = roundTaka(base + vatAmount);
  }

  const net = vatAmount - credit;
  const netPayable = Math.max(0, net);

  const notes: string[] = [];
  if (rate === 0) notes.push('rate-not-supplied');
  if (net < 0) notes.push('credit-carried-forward');

  return {
    primary: vatAmount,
    base,
    vat: vatAmount,
    total,
    netPayable,
    steps: [
      {
        label: 'Taxable base',
        expression: input.mode === 'inclusive' ? 'gross ÷ (1 + rate)' : 'as entered',
        value: base,
      },
      {
        label: 'VAT',
        expression: input.mode === 'inclusive' ? 'gross − base' : 'base × rate',
        value: vatAmount,
      },
      { label: 'Input credit applied', expression: 'eligible input VAT', value: credit },
      { label: 'Net payable', expression: 'VAT − input credit, floored at zero', value: netPayable },
    ],
    notes,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   Profit  ·  §5.5.1 #6
   ═══════════════════════════════════════════════════════════════════════════ */

export interface ProfitInput {
  revenue: number;
  costOfGoods: number;
  operatingExpenses: number;
}

export interface ProfitResult extends CalcResult {
  grossProfit: number;
  operatingProfit: number;
  grossMarginPercent: number;
  operatingMarginPercent: number;
  /** True when cost of goods exceeds revenue — the gross loss case. */
  grossLoss: boolean;
}

/**
 * A three-line profit and loss.
 *
 * Gross and operating margin are reported separately because they fail
 * differently. A healthy gross margin with a negative operating margin is an
 * overhead problem; a negative gross margin is a pricing or input-cost problem,
 * and no amount of overhead discipline fixes it. Collapsing them into one "net
 * margin" figure hides which conversation the business needs to have.
 */
export function profit(input: ProfitInput): ProfitResult {
  const revenue = Math.max(0, input.revenue);
  const cogs = Math.max(0, input.costOfGoods);
  const opex = Math.max(0, input.operatingExpenses);

  const grossProfit = roundTaka(revenue - cogs);
  const operatingProfit = roundTaka(grossProfit - opex);
  const grossMarginPercent = revenue > 0 ? round2((grossProfit / revenue) * 100) : 0;
  const operatingMarginPercent = revenue > 0 ? round2((operatingProfit / revenue) * 100) : 0;

  const notes: string[] = [];
  if (grossProfit < 0) notes.push('gross-loss');
  else if (operatingProfit < 0) notes.push('operating-loss');

  return {
    primary: operatingProfit,
    grossProfit,
    operatingProfit,
    grossMarginPercent,
    operatingMarginPercent,
    grossLoss: grossProfit < 0,
    steps: [
      { label: 'Gross profit', expression: 'revenue − cost of goods', value: grossProfit },
      { label: 'Gross margin', expression: 'gross profit ÷ revenue × 100', value: grossMarginPercent },
      { label: 'Operating profit', expression: 'gross profit − operating expenses', value: operatingProfit },
      {
        label: 'Operating margin',
        expression: 'operating profit ÷ revenue × 100',
        value: operatingMarginPercent,
      },
    ],
    notes,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   Payroll cost  ·  §5.5.1 #12
   ═══════════════════════════════════════════════════════════════════════════ */

export interface PayrollInput {
  headcount: number;
  grossPerHead: number;
  /** Total allowances per head across the month. */
  allowancesPerHead: number;
  /** Total overtime per head, already at the overtime rate. */
  overtimePerHead: number;
  /** Optional: the rate applied to the taxable portion. Supplied, never assumed. */
  tdsRatePercent?: number;
  /** Optional: employer contribution rate. Supplied, never assumed. */
  employerContributionPercent?: number;
}

export interface PayrollResult extends CalcResult {
  /** What the employee is contractually owed, before any deduction. */
  grossPay: number;
  allowances: number;
  overtime: number;
  totalTaxablePayroll: number;
  tds: number;
  employerContribution: number;
  /** What actually leaves the bank: everything above the salary lines. */
  totalMonthlyCost: number;
  totalAnnualCost: number;
  costPerHead: number;
}

/**
 * Fully-loaded monthly payroll cost.
 *
 * The distinction that matters to a business owner is `grossPay` versus
 * `totalMonthlyCost`. Budgeting on the salary figures is the classic
 * small-business cash-flow error: statutory contributions and the overtime that
 * actually gets worked are both real, and both are invisible in a headcount ×
 * gross salary estimate.
 *
 * `tds` is withheld from the employee, not added to the employer's cost, so it
 * is reported but deliberately excluded from `totalMonthlyCost`. Employer
 * contribution is added, because it is the employer's money.
 */
export function payroll(input: PayrollInput): PayrollResult {
  const headcount = Math.max(0, Math.floor(input.headcount));
  const grossPerHead = Math.max(0, input.grossPerHead);
  const allowancesPerHead = Math.max(0, input.allowancesPerHead);
  const overtimePerHead = Math.max(0, input.overtimePerHead);

  const grossPay = roundTaka(headcount * grossPerHead);
  const allowances = roundTaka(headcount * allowancesPerHead);
  const overtime = roundTaka(headcount * overtimePerHead);
  const totalTaxablePayroll = roundTaka(grossPay + allowances + overtime);

  const tds =
    input.tdsRatePercent === undefined
      ? 0
      : roundTaka(totalTaxablePayroll * (input.tdsRatePercent / 100));
  const employerContribution =
    input.employerContributionPercent === undefined
      ? 0
      : roundTaka(totalTaxablePayroll * (input.employerContributionPercent / 100));

  const totalMonthlyCost = roundTaka(totalTaxablePayroll + employerContribution);
  const totalAnnualCost = roundTaka(totalMonthlyCost * 12);

  const notes: string[] = [];
  if (headcount === 0) notes.push('no-headcount');
  if (input.tdsRatePercent === undefined) notes.push('tds-not-supplied');
  if (input.employerContributionPercent === undefined) notes.push('contribution-not-supplied');

  return {
    primary: totalMonthlyCost,
    grossPay,
    allowances,
    overtime,
    totalTaxablePayroll,
    tds,
    employerContribution,
    totalMonthlyCost,
    totalAnnualCost,
    costPerHead: headcount > 0 ? roundTaka(totalMonthlyCost / headcount) : 0,
    steps: [
      { label: 'Gross salary', expression: 'headcount × gross per head', value: grossPay },
      { label: 'Allowances', expression: 'headcount × allowances per head', value: allowances },
      { label: 'Overtime', expression: 'headcount × overtime per head', value: overtime },
      { label: 'Taxable payroll', expression: 'gross + allowances + overtime', value: totalTaxablePayroll },
      { label: 'Employer contribution', expression: 'taxable payroll × contribution rate', value: employerContribution },
      { label: 'Total monthly cost', expression: 'taxable payroll + employer contribution', value: totalMonthlyCost },
    ],
    notes,
  };
}
