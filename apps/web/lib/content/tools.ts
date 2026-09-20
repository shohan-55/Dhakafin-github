/**
 * The thirteen free tools — structural registry.
 * ---------------------------------------------------------------------------
 * Blueprint §5.5.1 is the authoritative inventory. This file is its structural
 * half: slug, position, category, the service each tool cross-sells to, the rate
 * families it consumes, and a headline figure to preview it with. All prose
 * lives in `lib/dictionaries/<locale>/tools.ts`.
 *
 * WHY A REGISTRY RATHER THAN A FOLDER OF PAGE FILES
 * The same thirteen appear in five places — the footer, the tools hub, the
 * service pages that cross-sell them, the command palette, and their own routes.
 * Before this file existed each of those carried its own slug, and they had
 * already drifted: the footer linked `/tools/break-even-calculator` while the
 * accounting service page linked `/tools/break-even`, and neither existed. A
 * registry makes the slug list the single source, and `ToolSlug` turns a typo
 * into a compile error.
 *
 * `rateFamilies` is the load-bearing field for DF-P2-011 acceptance criterion 2:
 * "no rate, slab, or threshold literal exists in tool components — all resolved
 * via the API for the selected date". A tool declares *which* families it needs;
 * `lib/rates.ts` resolves them. When the Phase 3 rate API lands, only that
 * resolver changes and no component is touched.
 *
 * Sources: blueprint §5.5.1 (inventory and formulas), §5.5.2 (shared shell).
 */

export const toolSlugs = [
  'tds-calculator',
  'vds-calculator',
  'vat-calculator',
  'income-tax-calculator',
  'corporate-tax-calculator',
  'profit-calculator',
  'profit-margin-calculator',
  'break-even-calculator',
  'roi-calculator',
  'cash-flow-calculator',
  'cost-efficiency-calculator',
  'payroll-calculator',
  'working-capital-calculator',
] as const;

export type ToolSlug = (typeof toolSlugs)[number];

/** Hub grouping. Ordered by how a finance team actually starts looking. */
export type ToolCategoryId = 'compliance' | 'profitability' | 'cash' | 'cost';

export interface ToolEntry {
  slug: ToolSlug;
  /** Hub position, 01–13. */
  order: number;
  category: ToolCategoryId;
  /** The service this tool most naturally hands off to. */
  crossSell: string;
  /**
   * Rate families resolved from the rate source for the selected date.
   * Empty for tools that compute from the user's own figures only — those must
   * not pretend to cite an authority.
   */
  rateFamilies: RateFamily[];
  /** A representative input pair, used for the hub preview and the example chips. */
  example: { label: string; amount: number };
}

/**
 * Rate families as they exist in `lib/rates.ts`. Named for the instrument the
 * authority publishes, not for the page that displays it, because one family can
 * appear on several pages and the SRO that governs it is the same object.
 */
export type RateFamily = 'tds' | 'vds' | 'vat' | 'income-tax-slabs' | 'corporate-tax';

export const tools: Record<ToolSlug, ToolEntry> = {
  'tds-calculator': {
    slug: 'tds-calculator',
    order: 1,
    category: 'compliance',
    crossSell: 'tax-services',
    rateFamilies: ['tds'],
    example: { label: 'Consulting fee', amount: 500_000 },
  },
  'vds-calculator': {
    slug: 'vds-calculator',
    order: 2,
    category: 'compliance',
    crossSell: 'vat-services',
    rateFamilies: ['vds'],
    example: { label: 'Service bill, VAT-registered supplier', amount: 500_000 },
  },
  'vat-calculator': {
    slug: 'vat-calculator',
    order: 3,
    category: 'compliance',
    crossSell: 'vat-services',
    rateFamilies: ['vat'],
    example: { label: 'Standard-rated supply', amount: 100_000 },
  },
  'income-tax-calculator': {
    slug: 'income-tax-calculator',
    order: 4,
    category: 'compliance',
    crossSell: 'tax-services',
    rateFamilies: ['income-tax-slabs'],
    example: { label: 'Salaried, one employer', amount: 1_200_000 },
  },
  'corporate-tax-calculator': {
    slug: 'corporate-tax-calculator',
    order: 5,
    category: 'compliance',
    crossSell: 'tax-services',
    rateFamilies: ['corporate-tax'],
    example: { label: 'Private company, taxable profit', amount: 5_000_000 },
  },
  'profit-calculator': {
    slug: 'profit-calculator',
    order: 6,
    category: 'profitability',
    crossSell: 'accounting-bookkeeping',
    rateFamilies: [],
    example: { label: 'Trading business, monthly revenue', amount: 3_000_000 },
  },
  'profit-margin-calculator': {
    slug: 'profit-margin-calculator',
    order: 7,
    category: 'profitability',
    crossSell: 'cost-efficiency-internal-control',
    rateFamilies: [],
    example: { label: 'Unit cost and selling price', amount: 850 },
  },
  'break-even-calculator': {
    slug: 'break-even-calculator',
    order: 8,
    category: 'profitability',
    crossSell: 'cost-efficiency-internal-control',
    rateFamilies: [],
    example: { label: 'Fixed cost, price and unit cost', amount: 400_000 },
  },
  'roi-calculator': {
    slug: 'roi-calculator',
    order: 9,
    category: 'profitability',
    crossSell: 'financial-advisory',
    rateFamilies: [],
    example: { label: 'Equipment investment', amount: 2_500_000 },
  },
  'cash-flow-calculator': {
    slug: 'cash-flow-calculator',
    order: 10,
    category: 'cash',
    crossSell: 'virtual-cfo',
    rateFamilies: [],
    example: { label: 'Opening balance and monthly burn', amount: 1_500_000 },
  },
  'working-capital-calculator': {
    slug: 'working-capital-calculator',
    order: 11,
    category: 'cash',
    crossSell: 'financial-advisory',
    rateFamilies: [],
    example: { label: 'Inventory, receivable and payable days', amount: 90 },
  },
  'cost-efficiency-calculator': {
    slug: 'cost-efficiency-calculator',
    order: 12,
    category: 'cost',
    // The only tool that takes a rate-free benchmark model as well as inputs;
    // the avoidable-cost ranges come from a documented model, not from a rate.
    crossSell: 'cost-efficiency-internal-control',
    rateFamilies: ['vat'],
    example: { label: 'Manufacturer, annual turnover', amount: 50_000_000 },
  },
  'payroll-calculator': {
    slug: 'payroll-calculator',
    order: 13,
    category: 'cost',
    crossSell: 'accounting-bookkeeping',
    rateFamilies: ['tds'],
    example: { label: 'Headcount', amount: 40 },
  },
};

export const toolOrder: ToolEntry[] = toolSlugs
  .map((slug) => tools[slug])
  .sort((a, b) => a.order - b.order);

export const toolCategories: ToolCategoryId[] = ['compliance', 'profitability', 'cash', 'cost'];

export const isToolSlug = (value: string): value is ToolSlug =>
  (toolSlugs as readonly string[]).includes(value);

/** Canonical path for a tool. Use this rather than writing `/tools/…` by hand. */
export const toolHref = (slug: ToolSlug) => `/tools/${slug}`;
