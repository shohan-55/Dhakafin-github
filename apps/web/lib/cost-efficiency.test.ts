/**
 * Cost-efficiency estimator tests — DF-P2-044.
 * ---------------------------------------------------------------------------
 * Two things are worth testing here and one of them is an absence.
 *
 * The arithmetic is locked because it is the page's whole claim: the reader can
 * reproduce every figure with a calculator, so a drift in the model is a broken
 * promise rather than a rounding difference.
 *
 * The absence is locked because it is the thing most likely to be "fixed" by a
 * future contributor. `range` must stay `null` while no benchmark is published —
 * a well-meaning change that fills it with an extrapolation would be the single
 * most damaging edit possible to this page, and it would pass every other test in
 * the repository. So here it fails.
 *
 * Runner: `npm run test:engine` (node --test, with --experimental-strip-types).
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { sensitivityBasisPoints } from './benchmarks.ts';
import { costCategories, estimatorIndustries, pillarOrder, turnoverBounds } from './content/cost-efficiency.ts';
import {
  buildEstimate,
  decodeEstimateToken,
  defaultInput,
  encodeEstimateToken,
  methodRows,
  type CostEfficiencyInput,
} from './cost-efficiency.ts';

const baseline = (): CostEfficiencyInput => defaultInput();

/** Find a pillar, failing loudly rather than returning undefined into a compare. */
function pillarOf(estimate: ReturnType<typeof buildEstimate>, id: string) {
  const found = estimate.pillars.find((pillar) => pillar.id === id);
  assert.ok(found, `pillar ${id} is missing from the estimate`);
  return found;
}

describe('exposure arithmetic', () => {
  it('sums the four categories into the operating cost', () => {
    const input: CostEfficiencyInput = {
      ...baseline(),
      turnover: 10_000_000,
      categories: { procurement: 5_000, payroll: 2_000, logistics: 1_000, marketing: 1_000 },
    };
    const estimate = buildEstimate(input);

    assert.equal(estimate.operatingCost, 9_000_000);
    assert.equal(estimate.operatingCostShareBasisPoints, 9_000);
    assert.deepEqual(
      estimate.categories.map((line) => line.amount),
      [5_000_000, 2_000_000, 1_000_000, 1_000_000],
    );
  });

  it('maps each pillar to its spend base, not to the whole cost base', () => {
    const estimate = buildEstimate({
      ...baseline(),
      turnover: 10_000_000,
      categories: { procurement: 4_000, payroll: 3_000, logistics: 2_000, marketing: 1_000 },
    });

    // Procurement-only surfaces see ৳40 lakh, not the ৳1 crore of total cost.
    for (const id of ['purchase-price-variance', 'supplier-dependency', 'inventory-variance']) {
      assert.equal(pillarOf(estimate, id).spendBaseAmount, 4_000_000, id);
    }
    // Whole-cost surfaces see everything.
    for (const id of ['expense-leakage', 'payment-controls']) {
      assert.equal(pillarOf(estimate, id).spendBaseAmount, 10_000_000, id);
    }
  });

  it('builds the sensitivity ladder as spend × rate, at every published rate', () => {
    const estimate = buildEstimate({
      ...baseline(),
      turnover: 1_000_000,
      categories: { procurement: 10_000, payroll: 0, logistics: 0, marketing: 0 },
    });
    const pillar = pillarOf(estimate, 'purchase-price-variance');

    assert.deepEqual(
      pillar.ladder.map((step) => step.basisPoints),
      [...sensitivityBasisPoints],
    );
    for (const step of pillar.ladder) {
      assert.equal(step.amount, (1_000_000 * step.basisPoints) / 10_000);
    }
    // 25 bps of ৳10 lakh is ৳2,500 — the figure a reader can check by hand.
    assert.equal(pillar.ladder.at(0)?.amount, 2_500);
    assert.equal(pillar.ladder.at(-1)?.amount, 20_000);
  });

  it('never reports a spend base larger than the cost base', () => {
    for (const industry of estimatorIndustries) {
      const estimate = buildEstimate({
        ...baseline(),
        industry,
        turnover: 7_500_000,
        categories: { procurement: 3_300, payroll: 3_300, logistics: 3_300, marketing: 3_300 },
      });
      for (const pillar of estimate.pillars) {
        assert.ok(
          pillar.spendBaseAmount <= estimate.operatingCost,
          `${pillar.id} exceeded the operating cost`,
        );
        assert.ok(pillar.shareOfOperatingCostBasisPoints <= 10_000);
      }
    }
  });

  it('handles a zero-share cost base without dividing by zero', () => {
    const estimate = buildEstimate({
      ...baseline(),
      turnover: 0,
      categories: { procurement: 0, payroll: 0, logistics: 0, marketing: 0 },
    });
    assert.equal(estimate.operatingCost, 0);
    assert.equal(estimate.operatingCostShareBasisPoints, 0);
    for (const pillar of estimate.pillars) {
      assert.equal(pillar.shareOfOperatingCostBasisPoints, 0);
      assert.deepEqual(pillar.ladder.map((step) => step.amount), [0, 0, 0, 0]);
    }
  });

  it('orders the review agenda by flagged answers first, then by exposure', () => {
    const estimate = buildEstimate({
      ...baseline(),
      turnover: 10_000_000,
      categories: { procurement: 2_000, payroll: 5_000, logistics: 1_000, marketing: 1_000 },
      answers: {
        'purchase-price-variance': null,
        'supplier-dependency': null,
        'expense-leakage': null,
        'inventory-variance': true,
        'payment-controls': null,
      },
    });
    // Flagged first, even though procurement is the smaller base here.
    assert.equal(estimate.priority[0], 'inventory-variance');
    // Then whole-cost surfaces, which touch more taka than procurement does.
    assert.ok(estimate.priority.indexOf('expense-leakage') < estimate.priority.indexOf('supplier-dependency'));
  });

  it('marks a pillar flagged only when the answer is yes', () => {
    const estimate = buildEstimate({
      ...baseline(),
      answers: Object.fromEntries(pillarOrder.map((id) => [id, id === 'expense-leakage' ? true : false])) as CostEfficiencyInput['answers'],
    });
    assert.deepEqual(
      estimate.pillars.filter((pillar) => pillar.flagged).map((pillar) => pillar.id),
      ['expense-leakage'],
    );
  });
});

describe('the withheld range', () => {
  it('does not produce a savings figure, ever', () => {
    for (const industry of estimatorIndustries) {
      const estimate = buildEstimate({ ...baseline(), industry, turnover: 120_000_000 });
      assert.equal(estimate.range, null, `${industry} invented a range`);
      assert.equal(estimate.rangeStatus, 'withheld');
    }
  });

  it('states the size of the gap rather than hiding it', () => {
    const estimate = buildEstimate(baseline());
    assert.equal(estimate.publishedRows, 0);
    assert.equal(estimate.requiredRows, pillarOrder.length * estimatorIndustries.length);
    assert.equal(estimate.requiredRows, 20);
    assert.equal(estimate.publishedRows < estimate.requiredRows, true);
  });

  it('resolves every benchmark row as unverified, with a reason', () => {
    const rows = methodRows();
    assert.equal(rows.length, 20);
    for (const row of rows) {
      assert.equal(row.resolution.status, 'unverified');
      assert.equal(row.resolution.status === 'unverified' && row.resolution.reasonKey, 'no-sample');
    }
  });

  it('leaves the recovery window as a mechanism statement, not a money claim', () => {
    const estimate = buildEstimate(baseline());
    assert.deepEqual(estimate.recoveryWindowMonths, { low: 3, high: 6 });
  });
});

describe('share token', () => {
  it('round-trips every input the reader can set', () => {
    const input: CostEfficiencyInput = {
      industry: 'ecommerce',
      turnover: 123_000_000,
      categories: { procurement: 6_150, payroll: 1_750, logistics: 900, marketing: 1_200 },
      answers: {
        'purchase-price-variance': true,
        'supplier-dependency': false,
        'expense-leakage': null,
        'inventory-variance': true,
        'payment-controls': false,
      },
    };
    const decoded = decodeEstimateToken(encodeEstimateToken(input));
    assert.deepEqual(decoded, input);
  });

  it('round-trips the default state, including unanswered questions', () => {
    const decoded = decodeEstimateToken(encodeEstimateToken(baseline()));
    assert.deepEqual(decoded, baseline());
  });

  it('is readable, so a reader can see what they are sharing', () => {
    // version · industry · turnover (thousands) · four shares · five answers
    const token = encodeEstimateToken(baseline());
    assert.match(token, /^v1\.manufacturing\.50000\.\d+\.\d+\.\d+\.\d+\.-----$/, token);
  });

  it('rebuilds the identical estimate from a token', () => {
    const estimate = buildEstimate({ ...baseline(), turnover: 88_000_000 });
    const decoded = decodeEstimateToken(estimate.token);
    assert.ok(decoded);
    assert.deepEqual(buildEstimate(decoded), estimate);
  });

  it('rejects anything it cannot vouch for', () => {
    const good = encodeEstimateToken(baseline());
    const mangled = [
      '',
      'v1',
      good.replace('v1', 'v2'), // future version
      good.replace('manufacturing', 'aerospace'), // industry we do not serve
      good.replace('50000', '999999999'), // above the slider's ceiling
      good.replace('50000', 'abc'), // not a number
      good.replace('5500', '20000'), // share above 100%
      `${good}.extra`, // wrong arity
      good.replace('-----', '--'), // too few answers
      good.replace('-----', 'xx---'), // unknown answer character
      good.slice(0, -1), // truncated, as a chat client might
    ];
    for (const token of mangled) {
      assert.equal(decodeEstimateToken(token), null, `accepted ${JSON.stringify(token)}`);
    }
  });

  it('refuses a share below the review floor rather than rendering it', () => {
    const below = encodeEstimateToken({ ...baseline(), turnover: turnoverBounds.min - 1_000_000 });
    assert.equal(decodeEstimateToken(below), null);
  });
});

describe('category registry', () => {
  it('covers every category the estimator asks about', () => {
    for (const id of costCategories) {
      const estimate = buildEstimate(baseline());
      assert.ok(estimate.categories.some((line) => line.id === id));
    }
  });
});
