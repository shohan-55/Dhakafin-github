/**
 * Pricing structure — DF-P2-025, blueprint F3 and §2.2's `/pricing` row.
 * ---------------------------------------------------------------------------
 * THE RULE THIS FILE EXISTS TO KEEP
 * A price is a commitment. The bands published on `/pricing` are the same bands
 * the service pages publish, and they live in exactly one place —
 * `lib/dictionaries/{en,bn}/services.ts` → `items[slug].hero.priceBand`. This file does
 * **not** restate them for display.
 *
 * What it does hold is the numeric form of each band (`bandFrom`), because two
 * things genuinely need a number rather than a sentence:
 *
 *   1. `Offer` structured data, which is a claim made to search engines. Sending
 *      them a machine-readable price that disagrees with the visible one is worse
 *      than sending none, and parsing "from ৳8,000 / month" at render time to
 *      build schema would be a second implementation of the same fact.
 *   2. The annual view of a monthly retainer — ৳8,000/month is a starting band,
 *      and "from ৳96,000 over twelve months" is arithmetic on it, not a discount
 *      we have agreed to.
 *
 * `scripts/check-pricing.mjs` asserts the two agree on every build: for each of
 * the nine lines it reads the digits out of the visible band, compares them with
 * the number in the emitted `Offer`, and fails the build if they differ. A drift
 * between the dictionary and this file can therefore never reach a reader.
 *
 * Sources: blueprint F3 (`/pricing` row), §2.2 (route, schema, priority),
 *          §5.7 §1.5 (the draft SaaS scaffold and its "finalize in Phase 5"
 *          instruction, which is why the platform tiers carry no buyable price).
 */

import { serviceOrder, services as serviceRegistry, type ServiceGroupId, type ServiceSlug } from './services.ts';

/* ═══════════════════════════════════════════════════════════════════════════
   Advisory and compliance lines
   ═══════════════════════════════════════════════════════════════════════════ */

/** How a line is charged. Drives the label next to the band, and the annual view. */
export type PriceCadence = 'monthly' | 'annual' | 'engagement' | 'review';

export interface PriceLine {
  service: ServiceSlug;
  /** The "from" figure in the published band, in BDT. Asserted against the band. */
  bandFrom: number;
  cadence: PriceCadence;
  /**
   * True when a client can reasonably annualise the figure. Monthly retainers can;
   * a one-off review cannot, and pretending otherwise would invent a commitment.
   */
  annualisable: boolean;
}

/**
 * The nine lines, in ecosystem order.
 *
 * Cadence is a commercial fact, not a presentation choice, so it lives here rather
 * than in the dictionary: a translator cannot accidentally turn a monthly retainer
 * into an annual one.
 */
const cadences: Record<ServiceSlug, { bandFrom: number; cadence: PriceCadence }> = {
  'accounting-bookkeeping': { bandFrom: 8_000, cadence: 'monthly' },
  'audit-support': { bandFrom: 45_000, cadence: 'engagement' },
  'tax-services': { bandFrom: 18_000, cadence: 'annual' },
  'vat-services': { bandFrom: 12_000, cadence: 'monthly' },
  'cost-efficiency-internal-control': { bandFrom: 150_000, cadence: 'review' },
  'internal-control-governance': { bandFrom: 180_000, cadence: 'engagement' },
  'corporate-compliance': { bandFrom: 60_000, cadence: 'annual' },
  'financial-advisory': { bandFrom: 120_000, cadence: 'engagement' },
  'virtual-cfo': { bandFrom: 85_000, cadence: 'monthly' },
};

export const priceLines: PriceLine[] = serviceOrder.map((entry) => {
  const { bandFrom, cadence } = cadences[entry.slug];
  return { service: entry.slug, bandFrom, cadence, annualisable: cadence === 'monthly' };
});

export const priceLine = (slug: ServiceSlug): PriceLine =>
  priceLines.find((line) => line.service === slug) as PriceLine;

/** The nine lines grouped the way the ecosystem groups them. */
export const priceGroups: { group: ServiceGroupId; lines: PriceLine[] }[] = (
  ['foundations', 'control', 'growth'] as ServiceGroupId[]
).map((group) => ({
  group,
  lines: priceLines.filter((line) => serviceRegistry[line.service].group === group),
}));

/** Twelve months at the starting band. Arithmetic on a published figure, not a discount. */
export const annualAtBand = (bandFrom: number): number => bandFrom * 12;

/* ═══════════════════════════════════════════════════════════════════════════
   "Which fits me?" — the three-question filter (F3 acceptance)
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Three questions, each answer routing to one recommendation.
 *
 * The questions are diagnostic, not commercial: they ask what the business can
 * do today, and the routing follows the ecosystem's own logic (foundations before
 * control before growth — you cannot test a control on books that do not close).
 * Every branch ends in a real service line with a published band, and "not sure"
 * routes to the diagnostic rather than to a sales call.
 */
export type FitQuestionId = 'close' | 'leakage' | 'pressure';

export interface FitAnswer {
  id: string;
  /** The service this answer recommends. */
  service: ServiceSlug;
  /** Where this answer sits in the flow: 1 asks it, 0 shows the result. */
  next: 0 | 1;
}

export interface FitQuestion {
  id: FitQuestionId;
  answers: FitAnswer[];
}

export const fitQuestions: FitQuestion[] = [
  {
    id: 'close',
    answers: [
      { id: 'no', service: 'accounting-bookkeeping', next: 0 },
      { id: 'yes', service: 'cost-efficiency-internal-control', next: 1 },
    ],
  },
  {
    id: 'leakage',
    answers: [
      { id: 'no', service: 'cost-efficiency-internal-control', next: 0 },
      { id: 'yes', service: 'virtual-cfo', next: 1 },
    ],
  },
  {
    id: 'pressure',
    answers: [
      { id: 'filings', service: 'vat-services', next: 0 },
      { id: 'audit', service: 'audit-support', next: 0 },
      { id: 'outsiders', service: 'financial-advisory', next: 0 },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   The platform (in development) — blueprint §1.5's draft scaffold
   ═══════════════════════════════════════════════════════════════════════════ */

export const platformTiers = ['starter', 'growth', 'intelligence', 'enterprise'] as const;
export type PlatformTierId = (typeof platformTiers)[number];

export interface PlatformTier {
  id: PlatformTierId;
  /**
   * Design target in BDT per month, from §1.5's scaffold. `null` for Starter,
   * which is free, and `null` for Enterprise, which is quoted.
   *
   * These are NOT prices. The blueprint says "finalize pricing in Phase 5,
   * validate with 10 interviews", the platform does not exist yet, and the page
   * says both of those things next to the numbers. A target band shown as a
   * target is information; the same number shown as a price would be a promise
   * nobody can keep.
   */
  targetMonthly: { low: number; high: number } | null;
  free: boolean;
  quoted: boolean;
}

export const platformTierData: PlatformTier[] = [
  { id: 'starter', targetMonthly: null, free: true, quoted: false },
  { id: 'growth', targetMonthly: { low: 2_500, high: 4_000 }, free: false, quoted: false },
  { id: 'intelligence', targetMonthly: { low: 6_000, high: 12_000 }, free: false, quoted: false },
  { id: 'enterprise', targetMonthly: null, free: false, quoted: true },
];

/**
 * The feature ids, in the order the matrix prints them. The values live in the
 * dictionaries, because "Unlimited (fair use)" has to read as Bengali too.
 */
export const platformFeatures = [
  'saved-calculations',
  'compliance-calendar',
  'document-vault',
  'dashboards',
  'workflow',
  'assistant',
  'multi-business',
  'api-export',
  'support',
] as const;

export type PlatformFeatureId = (typeof platformFeatures)[number];

/** Annual billing in the scaffold: twelve months for the price of ten. */
export const platformAnnualMonthsFree = 2;

/** Where the platform is, so no page has to guess whether to sell it. */
export const platformAvailability = 'in-development' as const;
