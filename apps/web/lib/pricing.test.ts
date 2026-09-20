/**
 * Pricing page tests — DF-P2-025.
 * ---------------------------------------------------------------------------
 * F3's `/pricing` row has one acceptance criterion above all others: *prices
 * visible*. That is a promise about agreement — the band a reader sees on
 * /pricing has to be the band the service page publishes, in both languages, and
 * the annual column has to be twelve months of that same figure rather than a
 * number someone liked the look of.
 *
 * A page cannot be trusted to keep that promise by inspection, because the
 * failure mode is silent: two files drift by one digit and both still render.
 * So the agreement is asserted here, at the level where the two facts meet —
 * the registry's arithmetic against the dictionaries' published strings — and
 * again in `scripts/check-pricing.mjs`, against the HTML that actually shipped.
 *
 * Runner: `npm run test:engine` (node --test, with --experimental-strip-types).
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  annualAtBand,
  fitQuestions,
  platformFeatures,
  platformTierData,
  priceGroups,
  priceLines,
} from './content/pricing.ts';
import { serviceOrder } from './content/services.ts';
import { pricing as enPricing } from './dictionaries/en/pricing.ts';
import { services as enServices } from './dictionaries/en/services.ts';
import { pricing as bnPricing } from './dictionaries/bn/pricing.ts';
import { services as bnServices } from './dictionaries/bn/services.ts';

/** Bengali digits in, Latin digits out — a band is a number in both locales. */
const toLatinDigits = (text: string): string =>
  text.replace(/[\u09e6-\u09ef]/g, (d) => String(d.charCodeAt(0) - 0x09e6));

/** The digits of a published band, without grouping separators or anything else. */
const digitsOf = (band: string): number => {
  const match = toLatinDigits(band).match(/[\d,]{3,}/);
  assert.ok(match, `no figure found in band string: ${band}`);
  return Number(match[0].replace(/,/g, ''));
};

describe('published bands', () => {
  it('prices all nine service lines, in ecosystem order', () => {
    assert.equal(priceLines.length, serviceOrder.length);
    assert.deepEqual(
      priceLines.map((line) => line.service),
      serviceOrder.map((entry) => entry.slug),
    );
  });

  it('agrees with the English band each service page publishes', () => {
    for (const line of priceLines) {
      const band = enServices.items[line.service].hero.priceBand;
      assert.equal(
        digitsOf(band),
        line.bandFrom,
        `${line.service}: page publishes "${band}" but the registry holds ${line.bandFrom}`,
      );
    }
  });

  it('agrees with the Bengali band, digit for digit', () => {
    for (const line of priceLines) {
      const en = digitsOf(enServices.items[line.service].hero.priceBand);
      const bn = digitsOf(bnServices.items[line.service].hero.priceBand);
      assert.equal(bn, en, `${line.service}: Bengali band ${bn} ≠ English band ${en}`);
    }
  });

  it('states a cadence for every line, and annualises only the monthly ones', () => {
    for (const line of priceLines) {
      assert.ok(line.cadence, `${line.service} has no cadence`);
      assert.equal(
        line.annualisable,
        line.cadence === 'monthly',
        `${line.service}: annualisable must mean "charged monthly", nothing else`,
      );
    }
    // Three monthly retainers today. If this changes, the annual column changes
    // with it — and whoever changes it has to read this line first.
    assert.equal(priceLines.filter((line) => line.annualisable).length, 3);
  });

  it('derives the twelve-month figure by multiplication, never a discount', () => {
    for (const line of priceLines.filter((l) => l.annualisable)) {
      assert.equal(annualAtBand(line.bandFrom), line.bandFrom * 12);
    }
    assert.equal(annualAtBand(8_000), 96_000);
    assert.equal(annualAtBand(150_000), 1_800_000);
  });
});

describe('grouping', () => {
  it('splits the nine into three groups of three, covering every line once', () => {
    assert.deepEqual(
      priceGroups.map((group) => group.group),
      ['foundations', 'control', 'growth'],
    );
    for (const group of priceGroups) assert.equal(group.lines.length, 3, `${group.group} is not three lines`);

    const seen = priceGroups.flatMap((group) => group.lines.map((line) => line.service));
    assert.equal(new Set(seen).size, priceLines.length);
  });
});

describe('the three-question filter', () => {
  it('routes every answer to a line that exists and is priced', () => {
    const priced = new Set(priceLines.map((line) => line.service));
    for (const question of fitQuestions) {
      assert.ok(question.answers.length >= 2, `${question.id} has fewer than two answers`);
      for (const answer of question.answers) {
        assert.ok(
          priced.has(answer.service),
          `${question.id}/${answer.id} routes to ${answer.service}, which has no published band`,
        );
      }
    }
  });

  it('only ever points at questions that exist, or at a result', () => {
    for (const question of fitQuestions) {
      for (const answer of question.answers) {
        if (answer.next === 0) continue;
        assert.ok(
          fitQuestions[answer.next],
          `${question.id}/${answer.id} forwards to question ${answer.next}, which does not exist`,
        );
      }
    }
  });

  it('has a stated reason for every line it can recommend', () => {
    const recommended = new Set(fitQuestions.flatMap((q) => q.answers.map((a) => a.service)));
    for (const slug of recommended) {
      assert.ok((enPricing.fit.reasons[slug] ?? '').length > 40, `no reason written for ${slug} (en)`);
      assert.ok((bnPricing.fit.reasons[slug] ?? '').length > 20, `no reason written for ${slug} (bn)`);
    }
  });
});

describe('the platform tiers', () => {
  it('has four tiers, and only the quoted ones lack a target', () => {
    assert.deepEqual(
      platformTierData.map((tier) => tier.id),
      ['starter', 'growth', 'intelligence', 'enterprise'],
    );
    for (const tier of platformTierData) {
      if (tier.free || tier.quoted) {
        assert.equal(tier.targetMonthly, null, `${tier.id} should not carry a target band`);
      } else {
        assert.ok(tier.targetMonthly, `${tier.id} has no target band`);
        assert.ok(tier.targetMonthly.low < tier.targetMonthly.high, `${tier.id} band is inverted`);
        // A target is not a price: it must stay under what a full retainer costs,
        // or the platform would be priced above the service it supports.
        assert.ok(tier.targetMonthly.high < 30_000, `${tier.id} target left the scaffold's band`);
      }
    }
  });

  it('describes every feature in every tier, in both languages', () => {
    for (const feature of platformFeatures) {
      for (const tier of platformTierData) {
        const en = enPricing.platform.features[feature]?.values[tier.id];
        const bn = bnPricing.platform.features[feature]?.values[tier.id];
        assert.ok(en, `en: ${feature}/${tier.id} is empty`);
        assert.ok(bn, `bn: ${feature}/${tier.id} is empty`);
      }
    }
  });
});

describe('copy completeness', () => {
  it('writes a pricing basis and three drivers for every line, in both languages', () => {
    for (const line of priceLines) {
      for (const [locale, dict] of [
        ['en', enPricing],
        ['bn', bnPricing],
      ] as const) {
        const copy = dict.lines[line.service];
        assert.ok(copy.basis.length > 20, `${locale}/${line.service}: no basis`);
        assert.equal(copy.drivers.length, 3, `${locale}/${line.service}: not three drivers`);
        for (const driver of copy.drivers) assert.ok(driver.length > 20, `${locale}/${line.service}: thin driver`);
      }
    }
  });

  it('states the VAT position and the platform status in both languages', () => {
    assert.ok(enPricing.hero.vatNote.includes('VAT'));
    assert.ok(bnPricing.hero.vatNote.includes('VAT'));
    assert.ok(enPricing.platform.lede.length > 80);
    assert.ok(bnPricing.platform.lede.length > 40);
    assert.ok(enPricing.table.annualNote.includes('not a discount'));
    assert.ok(bnPricing.table.annualNote.includes('ছাড়'));
  });
});
