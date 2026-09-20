/**
 * Calculation engine — published test vectors.
 * ---------------------------------------------------------------------------
 * Blueprint §5.5.4 acceptance criterion 1: "Formula matches the published test
 * vectors in `packages/tax-engine` (unit tests: ≥ 3 vectors per tool including
 * boundary and rounding cases)."
 *
 * These vectors are the contract. They are deliberately written as arithmetic a
 * reviewer can check by hand rather than as captured output, because a test that
 * asserts whatever the function already returns proves only that the function is
 * deterministic.
 *
 * Run with:  npm run test:engine
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  breakEven,
  cashFlow,
  depreciation,
  margin,
  payroll,
  profit,
  roi,
  roundTaka,
  toNumber,
  vat,
  withholding,
  workingCapital,
} from './engine.ts';
import { isRateFree, resolveRate, todayIso, type RateResolution } from '../rates.ts';

/* ── Input coercion ─────────────────────────────────────────────────────── */

test('toNumber survives everything a text field can produce', () => {
  // An empty field is the single most common state of a calculator.
  assert.equal(toNumber(''), 0);
  assert.equal(toNumber('   '), 0);
  assert.equal(toNumber('-'), 0);
  assert.equal(toNumber(null), 0);
  assert.equal(toNumber(undefined), 0);
  assert.equal(toNumber(NaN), 0);
  assert.equal(toNumber(Infinity), 0);
  // A pasted currency amount is a normal way to fill a money field.
  assert.equal(toNumber('৳ 5,00,000'), 500000);
  assert.equal(toNumber('500000'), 500000);
  assert.equal(toNumber(-2500), -2500);
  assert.equal(toNumber('12.5'), 12.5);
});

test('roundTaka is half-up on the taka, which is the documented rule', () => {
  assert.equal(roundTaka(0.4), 0);
  assert.equal(roundTaka(0.5), 1);
  assert.equal(roundTaka(1.5), 2);
  assert.equal(roundTaka(2.5), 3);
  assert.equal(roundTaka(-0.5), -0);
  assert.equal(roundTaka(1212.12), 1212);
});

/* ── Break-even ─────────────────────────────────────────────────────────── */

test('break-even vector 1 — the plain case', () => {
  // Fixed 400,000. Price 850, variable 520 → contribution 330.
  // 400,000 ÷ 330 = 1,212.12… → 1,213 units, because you cannot sell 0.12 of a
  // unit and rounding down would understate the requirement.
  const r = breakEven({ fixedCost: 400_000, pricePerUnit: 850, variableCostPerUnit: 520 });
  assert.equal(r.contributionPerUnit, 330);
  assert.equal(r.breakEvenUnits, 1213);
  assert.equal(r.breakEvenRevenue, 1213 * 850);
  assert.equal(r.unreachable, false);
  assert.deepEqual(r.notes, []);
});

test('break-even vector 2 — boundary: price equals variable cost', () => {
  // No volume ever covers fixed costs. Dividing gives Infinity.
  const r = breakEven({ fixedCost: 100_000, pricePerUnit: 400, variableCostPerUnit: 400 });
  assert.equal(r.contributionPerUnit, 0);
  assert.equal(r.unreachable, true);
  assert.equal(r.breakEvenUnits, 0);
  assert.equal(r.breakEvenRevenue, 0);
  assert.ok(Number.isFinite(r.breakEvenRevenue), 'must never emit Infinity');
  assert.deepEqual(r.notes, ['price-below-variable']);
});

test('break-even vector 3 — boundary: price below variable cost is not a large number', () => {
  const r = breakEven({ fixedCost: 250_000, pricePerUnit: 300, variableCostPerUnit: 340 });
  assert.equal(r.unreachable, true);
  assert.ok(r.breakEvenUnits >= 0, 'a negative unit count is never a valid answer');
  assert.deepEqual(r.notes, ['price-below-variable']);
});

test('break-even vector 4 — margin of safety, and the honest negative', () => {
  // Selling 2,000 units against a break-even of 1,213 → 787 units of headroom.
  const safe = breakEven({
    fixedCost: 400_000,
    pricePerUnit: 850,
    variableCostPerUnit: 520,
    currentUnits: 2000,
  });
  assert.equal(safe.marginOfSafetyUnits, 787);
  assert.equal(safe.marginOfSafetyPercent, 39.35);
  assert.deepEqual(safe.notes, []);

  // Selling below break-even must say so rather than report a small positive.
  const unsafe = breakEven({
    fixedCost: 400_000,
    pricePerUnit: 850,
    variableCostPerUnit: 520,
    currentUnits: 1200,
  });
  assert.equal(unsafe.marginOfSafetyUnits, -13);
  assert.deepEqual(unsafe.notes, ['below-break-even']);
});

test('break-even vector 5 — zero fixed cost breaks even immediately', () => {
  const r = breakEven({ fixedCost: 0, pricePerUnit: 100, variableCostPerUnit: 40 });
  assert.equal(r.breakEvenUnits, 0);
  assert.equal(r.marginOfSafetyPercent, null, 'no current sales supplied → null, not a guess');
  assert.deepEqual(r.notes, ['no-fixed-cost']);
});

/* ── Margin ─────────────────────────────────────────────────────────────── */

test('margin vector 1 — the markup/margin confusion the tool exists for', () => {
  // Cost 800, sell 1,000. Profit 200. Margin 20%, markup 25%.
  const r = margin({ cost: 800, price: 1000 });
  assert.equal(r.grossProfit, 200);
  assert.equal(r.marginPercent, 20);
  assert.equal(r.markupPercent, 25);
  assert.equal(r.priceSolved, false);
});

test('margin vector 2 — solving backwards from a target margin', () => {
  // A 20% margin on cost 800 needs a price of 800 ÷ 0.8 = 1,000.
  const r = margin({ cost: 800, targetMarginPercent: 20 });
  assert.equal(r.price, 1000);
  assert.equal(r.priceSolved, true);
  assert.equal(r.marginPercent, 20);
});

test('margin vector 3 — boundary: selling below cost', () => {
  const r = margin({ cost: 1_000, price: 900 });
  assert.equal(r.marginPercent, -11.11);
  assert.equal(r.belowCost, true);
  assert.deepEqual(r.notes, ['below-cost']);
});

test('margin vector 4 — boundary: a 100% margin target has no finite price', () => {
  const r = margin({ cost: 500, targetMarginPercent: 100 });
  assert.equal(r.price, 0, 'must not emit Infinity as a price');
  assert.deepEqual(r.notes, ['margin-target-impossible']);
});

test('margin vector 5 — zero cost does not divide by zero', () => {
  const r = margin({ cost: 0, price: 100 });
  assert.equal(r.markupPercent, 0);
  assert.equal(r.marginPercent, 100);
});

/* ── Cash flow ──────────────────────────────────────────────────────────── */

test('cash-flow vector 1 — cumulative balance and the lowest point', () => {
  // A single loss-making month inside a net-positive year is not a runway
  // problem, so runway must be null rather than a frightening small number
  // derived from one bad quarter.
  const r = cashFlow({ openingBalance: 1_000_000, monthlyNet: [200_000, -150_000, 100_000] });
  assert.deepEqual(
    r.points.map((p) => p.closing),
    [1_200_000, 1_050_000, 1_150_000]
  );
  assert.equal(r.lowestBalance, 1_050_000, 'the lowest point, not the closing balance');
  assert.equal(r.closingBalance, 1_150_000);
  assert.equal(r.firstNegativeMonth, null);
  assert.equal(r.runwayMonths, null, 'net-positive over the horizon → no finite runway');
  assert.deepEqual(r.riskMonths, []);
});

test('cash-flow vector 1b — a net-negative horizon has a runway even before it goes negative', () => {
  // Average burn is 116,667 a month against 1,000,000 of cash: 8 months of
  // runway, reported while the balance is still comfortably positive. This is
  // the whole point of a runway figure.
  const r = cashFlow({ openingBalance: 1_000_000, monthlyNet: [200_000, -150_000, -400_000] });
  assert.equal(r.lowestBalance, 650_000);
  assert.equal(r.runwayMonths, 8);
  assert.equal(r.firstNegativeMonth, null);
});

test('cash-flow vector 2 — runway while burning cash', () => {
  // Opening 1,000,000, average burn 100,000 a month → 10 months.
  const r = cashFlow({ openingBalance: 1_000_000, monthlyNet: [-100_000, -100_000, -100_000] });
  assert.equal(r.runwayMonths, 10);
  assert.ok(r.notes.includes('burning-cash'));
});

test('cash-flow vector 3 — boundary: the month the balance turns negative', () => {
  const r = cashFlow({ openingBalance: 300_000, monthlyNet: [-100_000, -100_000, -150_000] });
  assert.equal(r.firstNegativeMonth, 3);
  assert.deepEqual(r.riskMonths, [3]);
  assert.equal(r.lowestBalance, -50_000);
  assert.deepEqual(r.notes, ['goes-negative', 'burning-cash']);
});

test('cash-flow vector 4 — boundary: no months supplied', () => {
  const r = cashFlow({ openingBalance: 500_000, monthlyNet: [] });
  assert.equal(r.closingBalance, 500_000);
  assert.equal(r.lowestBalance, 500_000);
  assert.deepEqual(r.notes, ['no-months']);
});

/* ── Working capital ────────────────────────────────────────────────────── */

test('working-capital vector 1 — ratios and the conversion cycle', () => {
  const r = workingCapital({
    currentAssets: 4_000_000,
    currentLiabilities: 2_500_000,
    inventoryDays: 60,
    receivableDays: 45,
    payableDays: 30,
  });
  assert.equal(r.workingCapital, 1_500_000);
  assert.equal(r.currentRatio, 1.6);
  assert.equal(r.cashConversionCycleDays, 75);
  assert.equal(r.quickRatio, 0.53);
});

test('working-capital vector 2 — boundary: liabilities greater than assets', () => {
  const r = workingCapital({ currentAssets: 800_000, currentLiabilities: 1_200_000 });
  assert.equal(r.workingCapital, -400_000);
  assert.equal(r.currentRatio, 0.67);
  assert.deepEqual(r.notes, ['current-ratio-below-one']);
});

test('working-capital vector 3 — boundary: no current liabilities', () => {
  const r = workingCapital({ currentAssets: 500_000, currentLiabilities: 0 });
  assert.equal(r.currentRatio, 0, 'must not divide by zero');
  assert.equal(r.quickRatio, null);
});

test('working-capital vector 4 — a negative cycle means suppliers fund the business', () => {
  const r = workingCapital({
    currentAssets: 2_000_000,
    currentLiabilities: 1_000_000,
    inventoryDays: 10,
    receivableDays: 15,
    payableDays: 60,
    annualRevenue: 36_500_000,
  });
  assert.equal(r.cashConversionCycleDays, -35);
  // −35 ÷ 365 × 36,500,000 = −3,500,000: cash the cycle releases.
  assert.equal(r.fundingGap, -3_500_000);
  assert.ok(r.notes.includes('supplier-funded'));
});

/* ── Depreciation ───────────────────────────────────────────────────────── */

test('depreciation vector 1 — straight line reconciles exactly', () => {
  const r = depreciation({ cost: 1_000_000, residual: 100_000, usefulLifeYears: 5, method: 'straight-line' });
  assert.equal(r.schedule.length, 5);
  assert.equal(r.totalCharge, 900_000);
  assert.equal(r.closingValue, 100_000, 'the schedule must land on the residual value');
  assert.deepEqual(r.schedule.map((y) => y.charge), [180_000, 180_000, 180_000, 180_000, 180_000]);
});

test('depreciation vector 2 — straight line with a rounding remainder', () => {
  // 1,000,000 ÷ 3 = 333,333.33… The remainder must not be stranded at the end.
  const r = depreciation({ cost: 1_000_000, residual: 0, usefulLifeYears: 3, method: 'straight-line' });
  assert.equal(r.totalCharge, 1_000_000);
  assert.equal(r.closingValue, 0);
});

test('depreciation vector 3 — reducing balance clips the final year', () => {
  // 25% on 1,000,000: 250,000 · 187,500 · 140,625 over three years.
  const r = depreciation({ cost: 1_000_000, usefulLifeYears: 3, method: 'reducing-balance', ratePercent: 25 });
  assert.deepEqual(r.schedule.map((y) => y.charge), [250_000, 187_500, 140_625]);
  assert.equal(r.closingValue, 421_875);
});

test('depreciation vector 4 — boundary: a book value never goes negative', () => {
  // Marginal rates are what break a naive reducing-balance schedule: apply 110%
  // and the book value flips sign in year two. Clipping must hold for any rate.
  for (const rate of [110, 200]) {
    const r = depreciation({
      cost: 100_000,
      residual: 0,
      usefulLifeYears: 4,
      method: 'reducing-balance',
      ratePercent: rate,
    });
    for (const year of r.schedule) {
      assert.ok(year.closing >= 0, `rate ${rate}% closed year ${year.year} at ${year.closing}`);
      assert.ok(year.charge >= 0, `rate ${rate}% charged ${year.charge} in year ${year.year}`);
    }
    assert.equal(r.closingValue, 0, `rate ${rate}% must clip to zero, not overshoot`);
    assert.equal(r.totalCharge, 100_000, `rate ${rate}% must reconcile to cost`);
  }

  // At a realistic rate the schedule deliberately stops above zero — reducing
  // balance approaches the residual asymptotically and never reaches it. A tool
  // that forced the final year to zero would be reporting something the method
  // does not do, and it would disagree with the tax computation.
  const realistic = depreciation({
    cost: 100_000,
    residual: 0,
    usefulLifeYears: 4,
    method: 'reducing-balance',
    ratePercent: 80,
  });
  assert.deepEqual(realistic.schedule.map((y) => y.charge), [80_000, 16_000, 3_200, 640]);
  assert.equal(realistic.closingValue, 160);
});

test('depreciation vector 5 — boundary: reducing balance with no rate is flagged, not assumed', () => {
  const r = depreciation({ cost: 500_000, usefulLifeYears: 3, method: 'reducing-balance' });
  assert.equal(r.totalCharge, 0);
  assert.deepEqual(r.notes, ['rate-required']);
});

test('depreciation vector 6 — boundary: nothing to depreciate', () => {
  const r = depreciation({ cost: 200_000, residual: 200_000, usefulLifeYears: 5, method: 'straight-line' });
  assert.equal(r.totalCharge, 0);
  assert.equal(r.closingValue, 200_000);
  assert.deepEqual(r.notes, ['nothing-to-depreciate']);
});

/* ── ROI ────────────────────────────────────────────────────────────────── */

test('roi vector 1 — total return and payback', () => {
  // 1,000,000 invested, 300,000 a year for 5 years → 1,500,000 back, +50%.
  const r = roi({ investment: 1_000_000, annualReturn: 300_000, years: 5 });
  assert.equal(r.totalReturn, 1_500_000);
  assert.equal(r.netReturn, 500_000);
  assert.equal(r.roiPercent, 50);
  assert.equal(r.paybackYears, 3.33);
});

test('roi vector 2 — annualisation is geometric, not division', () => {
  // Doubling in 5 years is 14.87% a year, not 20%.
  const r = roi({ investment: 1_000_000, annualReturn: 200_000, years: 5 });
  assert.equal(r.roiPercent, 0, 'return equals investment → no net gain');
  const doubling = roi({ investment: 1_000_000, annualReturn: 400_000, years: 5 });
  // 100% over five years. Compounding gives 14.87% a year; dividing gives 20%.
  // The gap is the whole reason a naive investment memo overstates returns.
  assert.equal(doubling.roiPercent, 100);
  assert.equal(doubling.annualisedRoiPercent, 14.87);
  assert.notEqual(doubling.annualisedRoiPercent, 20, 'it is emphatically not roi ÷ years');
});

test('roi vector 3 — NPV only appears when a discount rate is supplied', () => {
  const without = roi({ investment: 1_000_000, annualReturn: 300_000, years: 5 });
  assert.equal(without.npv, null);
  assert.equal(without.steps.length, 3);

  const withRate = roi({ investment: 1_000_000, annualReturn: 300_000, years: 5, discountRatePercent: 10 });
  // 300,000 × 3.790786… = 1,137,236 − 1,000,000
  assert.equal(withRate.npv, 137_236);
  assert.equal(withRate.steps.length, 4);
});

test('roi vector 4 — boundary: a loss and a negative NPV are reported as such', () => {
  const r = roi({ investment: 1_000_000, annualReturn: 100_000, years: 4, discountRatePercent: 12 });
  assert.equal(r.netReturn, -600_000);
  assert.equal(r.roiPercent, -60);
  assert.ok(r.npv! < 0);
  assert.deepEqual(r.notes, ['negative-return', 'payback-beyond-horizon', 'npv-negative']);
});

test('roi vector 5 — boundary: zero investment does not divide by zero', () => {
  const r = roi({ investment: 0, annualReturn: 100_000, years: 3 });
  assert.equal(r.roiPercent, 0);
  assert.ok(Number.isFinite(r.roiPercent));
});

/* ── Every tool: the result shape the shell depends on ──────────────────── */

test('every engine result carries a disclosure the presenter can render', () => {
  const results = [
    breakEven({ fixedCost: 100, pricePerUnit: 10, variableCostPerUnit: 4 }),
    margin({ cost: 100, price: 150 }),
    cashFlow({ openingBalance: 1000, monthlyNet: [100, -50] }),
    workingCapital({ currentAssets: 100, currentLiabilities: 50 }),
    depreciation({ cost: 1000, usefulLifeYears: 3, method: 'straight-line' }),
    roi({ investment: 1000, annualReturn: 300, years: 3 }),
  ];

  for (const r of results) {
    assert.ok(Number.isFinite(r.primary), 'primary must be a finite number');
    // Two is the floor: working-capital has nothing to say about the conversion
    // cycle when the caller supplies no day counts, and inventing a third step
    // to satisfy a count would be worse than showing two.
    assert.ok(r.steps.length >= 2, 'at least two disclosure steps');
    for (const step of r.steps) {
      assert.ok(Number.isFinite(step.value), `step "${step.label}" produced ${step.value}`);
      assert.ok(step.expression.length > 0, 'every step states its arithmetic');
    }
    assert.ok(Array.isArray(r.notes));
  }
});

/* ═══════════════════════════════════════════════════════════════════════════
   Rate resolution  ·  the boundary that keeps regulatory data out of tools
   ═══════════════════════════════════════════════════════════════════════════ */

test('rate resolution: no family is ever silently given a figure', () => {
  // Phase 2 has no rate service, so every family must resolve to `unavailable`
  // and say which date it looked for. The day this test fails is the day
  // somebody seeded a rate literal to make a calculator look finished — and the
  // correct response is to wire the resolver, not to update the expectation.
  const families = ['tds', 'vds', 'vat', 'income-tax-slabs', 'corporate-tax'] as const;
  for (const family of families) {
    const resolved = resolveRate(family, '2026-09-20');
    assert.equal(resolved.status, 'unavailable', `${family} resolved to a value`);
    assert.equal(resolved.family, family);
    if (resolved.status === 'unavailable') {
      assert.equal(resolved.onDate, '2026-09-20', 'must echo the date it was asked about');
      assert.equal(resolved.nearest, null);
    }
  }
});

test('rate resolution: the verified shape cannot exist without provenance', () => {
  // The `RateCard` component has no defaults for these four fields, so a
  // `verified` resolution that lacks them would be unusable rather than wrong —
  // which is the intended design. This asserts the union keeps them inseparable.
  type Verified = Extract<RateResolution, { status: 'verified' }>;
  const sample: Verified = {
    status: 'verified',
    family: 'vat',
    basisPoints: 1500,
    provenance: {
      reference: 'placeholder for the type check only — never rendered',
      sourceUrl: 'https://example.invalid/',
      effectiveFrom: '2026-07-01',
      verifiedAt: '2026-09-20',
      verifiedBy: 'placeholder',
    },
  };
  assert.equal(sample.basisPoints, 1500, 'basis points, so 15% is exactly 1500');
  assert.ok(Number.isInteger(sample.basisPoints), 'integers only — no float drift in tax maths');
});

test('rate-free tools are identified as such, not assumed to be', () => {
  assert.equal(isRateFree([]), true);
  assert.equal(isRateFree(['vat']), false);
});

test('todayIso returns a plain ISO date', () => {
  assert.match(todayIso(), /^\d{4}-\d{2}-\d{2}$/);
});
