/**
 * Industries — structural registry.
 * ---------------------------------------------------------------------------
 * Blueprint §5.13.1 defines one template; §5.13.2 constrains how the eleven
 * industries may differ from each other:
 *
 *   "Each industry gets a distinct illustration motif, an accent pair drawn from
 *    the permitted palette, and its own KPI chart style. **Layout, components,
 *    tokens, motion and typography stay identical** — differentiation lives in
 *    content and illustration, never in structure."
 *
 * That constraint is why this file exists rather than eleven page files. The
 * template is one route; what varies is the motif, the accent rotation, the
 * obligation set, the ranked services, the tool presets and the words. Anything
 * that would need a second layout is, by definition, not an industry difference.
 *
 * THREE OF ELEVEN, DELIBERATELY
 * DF-P2-043 ships the first three — manufacturing, trading, e-commerce — so the
 * site's industry links resolve and the template is proven against three
 * genuinely different financial profiles before the remaining eight are
 * commissioned in Phase 6. The other eight are declared in `plannedIndustries`
 * with their owning task so the registry does not silently become the source of
 * a dead link.
 *
 * NO FIGURES LIVE HERE
 * §5.13.1 asks for compliance profiles and KPI benchmark bands. Obligations are
 * named and linked; bands are not published, for the same reason `lib/rates.ts`
 * holds no rates: a benchmark that nobody has measured is a number shaped like
 * evidence. Every KPI ships with its formula, which is definitional and cannot go
 * stale, and the band is held back behind a visible note.
 *
 * Sources: blueprint §5.13.1 (template), §5.13.2 (differentiation), §5.13.3
 *          (acceptance criteria), DF-P2-043 (scope).
 */

import type { ServiceSlug } from './services';
import type { ToolSlug } from './tools';

export const industrySlugs = ['manufacturing', 'trading', 'ecommerce'] as const;

export type IndustrySlug = (typeof industrySlugs)[number];

/**
 * Accent rotation, per §5.13.2. Sea is the signature and carries the largest
 * share; cyan and gold are the permitted partners. Never a fourth hue — the
 * palette is a brand decision, not a per-page one.
 */
export type IndustryAccent = 'sea' | 'cyan' | 'gold';

export interface IndustryEntry {
  slug: IndustrySlug;
  /** Rail position. Matches the order of `industrySlugs`. */
  order: number;
  accent: IndustryAccent;
  /** Illustration key — see components/marketing/IndustryMotif.tsx. */
  motif: IndustryMotifKey;
  /**
   * Compliance obligations this sector carries, by id in `lib/compliance.ts`.
   * Naming the obligation is durable; naming its due date is not.
   */
  obligations: string[];
  /**
   * Ranked, with the reason expressed in the copy rather than as a number here.
   * Rank order is the recommendation; it is deliberately not alphabetical.
   */
  services: ServiceSlug[];
  /** Three calculators, offered with this industry's preset. §5.13.1. */
  tools: ToolSlug[];
  /** The service a booking from this page pre-fills. §5.13.3 #3. */
  bookingService: ServiceSlug;
  /** Service the "get the checklist" lead magnet attaches to. */
  leadMagnetService: ServiceSlug;
}

export type IndustryMotifKey = 'machineLine' | 'tradeFlow' | 'parcelFlow';

export const industries: Record<IndustrySlug, IndustryEntry> = {
  manufacturing: {
    slug: 'manufacturing',
    order: 1,
    accent: 'sea',
    motif: 'machineLine',
    obligations: ['vat-return-monthly', 'vds-deposit', 'income-tax-return', 'tds-deposit-monthly'],
    services: [
      'cost-efficiency-internal-control',
      'accounting-bookkeeping',
      'audit-support',
      'vat-services',
      'internal-control-governance',
      'virtual-cfo',
    ],
    tools: ['cost-efficiency-calculator', 'break-even-calculator', 'working-capital-calculator'],
    bookingService: 'cost-efficiency-internal-control',
    leadMagnetService: 'audit-support',
  },
  trading: {
    slug: 'trading',
    order: 2,
    accent: 'cyan',
    motif: 'tradeFlow',
    obligations: ['vat-return-monthly', 'vds-deposit', 'income-tax-return', 'advance-tax'],
    services: [
      'accounting-bookkeeping',
      'tax-services',
      'vat-services',
      'financial-advisory',
      'corporate-compliance',
      'virtual-cfo',
    ],
    tools: ['profit-margin-calculator', 'working-capital-calculator', 'vat-calculator'],
    bookingService: 'accounting-bookkeeping',
    leadMagnetService: 'tax-services',
  },
  ecommerce: {
    slug: 'ecommerce',
    order: 3,
    accent: 'gold',
    motif: 'parcelFlow',
    obligations: ['vat-return-monthly', 'vds-deposit', 'bin-registration', 'income-tax-return'],
    services: [
      'vat-services',
      'accounting-bookkeeping',
      'cost-efficiency-internal-control',
      'financial-advisory',
      'corporate-compliance',
      'virtual-cfo',
    ],
    tools: ['profit-margin-calculator', 'break-even-calculator', 'cash-flow-calculator'],
    bookingService: 'vat-services',
    leadMagnetService: 'vat-services',
  },
};

export const industryOrder: IndustryEntry[] = industrySlugs
  .map((slug) => industries[slug])
  .sort((a, b) => a.order - b.order);

/**
 * The remaining eight, with the task that owns each. Declared rather than
 * omitted so that "why is my industry missing" has an answer in the code, and so
 * the industries rail can show what is coming without linking to a 404.
 * DF-P6-020 builds them.
 */
export const plannedIndustries: { slug: string; task: string }[] = [
  { slug: 'retail', task: 'DF-P6-020' },
  { slug: 'startup', task: 'DF-P6-020' },
  { slug: 'sme', task: 'DF-P6-020' },
  { slug: 'professional-services', task: 'DF-P6-020' },
  { slug: 'real-estate', task: 'DF-P6-020' },
  { slug: 'restaurant', task: 'DF-P6-020' },
  { slug: 'technology', task: 'DF-P6-020' },
  { slug: 'import-export', task: 'DF-P6-020' },
];

export const isIndustrySlug = (value: string): value is IndustrySlug =>
  (industrySlugs as readonly string[]).includes(value);

/** Canonical path. Use this rather than writing `/industries/…` by hand. */
export const industryHref = (slug: IndustrySlug) => `/industries/${slug}`;
