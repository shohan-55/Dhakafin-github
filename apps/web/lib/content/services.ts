/**
 * The nine services — structural registry.
 * ---------------------------------------------------------------------------
 * This file holds everything about a service that is NOT prose: its slug, its
 * position in the ecosystem, which group it belongs to on mobile, which tools
 * and sibling services it links to, and which illustration motif represents it.
 *
 * All words live in `lib/dictionaries/<locale>/services.ts`, keyed by the slugs
 * below. That split is deliberate and it is what makes the Filament migration a
 * data move rather than a rewrite: this registry becomes the `Service` model's
 * structural columns, the dictionary becomes its translatable JSON column.
 *
 * `Record<ServiceSlug, …>` is load-bearing. Adding a tenth service here without
 * adding its copy to both dictionaries is a `tsc` error, not a 404 discovered in
 * production.
 *
 * Sources: blueprint §5.6.1 (the locked nine), §5.6.2 (ecosystem wireframe).
 */

export const serviceSlugs = [
  'accounting-bookkeeping',
  'audit-support',
  'tax-services',
  'vat-services',
  'cost-efficiency-internal-control',
  'internal-control-governance',
  'corporate-compliance',
  'financial-advisory',
  'virtual-cfo',
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

/** Foundations → Control → Growth. The mobile accordion groups (acceptance #5). */
export type ServiceGroupId = 'foundations' | 'control' | 'growth';

export interface ServiceEntry {
  slug: ServiceSlug;
  /** Ecosystem node number, 01–09. Used as the tab order (acceptance #3). */
  order: number;
  group: ServiceGroupId;
  /**
   * The services this one genuinely hands off to. Rendered as "pairs well with"
   * on the detail page — a real workflow relationship, not a cross-sell.
   */
  pairsWith: [ServiceSlug, ServiceSlug];
  /** The industry page most often paired with this service. */
  industry: { label: 'manufacturing' | 'trading' | 'ecommerce' };
  /** Registerable tool slugs on /tools that compute something for this service. */
  tools: string[];
  /** Which compliance obligations this service carries (ids in `lib/compliance.ts`). */
  obligations: string[];
  /** Illustration motif key — see components/marketing/ServiceMotif.tsx. */
  motif: ServiceMotifKey;
}

export type ServiceMotifKey =
  | 'ledger'
  | 'sampling'
  | 'brackets'
  | 'mushak'
  | 'leak'
  | 'gate'
  | 'calendar'
  | 'fan'
  | 'cockpit';

export const services: Record<ServiceSlug, ServiceEntry> = {
  'accounting-bookkeeping': {
    slug: 'accounting-bookkeeping',
    order: 1,
    group: 'foundations',
    pairsWith: ['audit-support', 'tax-services'],
    industry: { label: 'trading' },
    tools: ['break-even', 'cash-runway'],
    obligations: ['income-tax-return', 'vat-return-monthly'],
    motif: 'ledger',
  },
  'audit-support': {
    slug: 'audit-support',
    order: 2,
    group: 'foundations',
    pairsWith: ['accounting-bookkeeping', 'internal-control-governance'],
    industry: { label: 'manufacturing' },
    tools: ['depreciation', 'break-even'],
    obligations: ['income-tax-return', 'rjsc-annual-return'],
    motif: 'sampling',
  },
  'tax-services': {
    slug: 'tax-services',
    order: 3,
    group: 'foundations',
    pairsWith: ['vat-services', 'accounting-bookkeeping'],
    industry: { label: 'trading' },
    tools: ['tds-calculator', 'income-tax-calculator'],
    obligations: ['income-tax-return', 'tds-deposit-monthly', 'advance-tax'],
    motif: 'brackets',
  },
  'vat-services': {
    slug: 'vat-services',
    order: 4,
    group: 'control',
    pairsWith: ['tax-services', 'corporate-compliance'],
    industry: { label: 'ecommerce' },
    tools: ['vat-calculator', 'pricing-margin'],
    obligations: ['vat-return-monthly', 'vds-deposit', 'bin-registration'],
    motif: 'mushak',
  },
  'cost-efficiency-internal-control': {
    slug: 'cost-efficiency-internal-control',
    order: 5,
    group: 'control',
    pairsWith: ['accounting-bookkeeping', 'internal-control-governance'],
    industry: { label: 'manufacturing' },
    tools: ['pricing-margin', 'break-even'],
    obligations: ['income-tax-return'],
    motif: 'leak',
  },
  'internal-control-governance': {
    slug: 'internal-control-governance',
    order: 6,
    group: 'control',
    pairsWith: ['cost-efficiency-internal-control', 'audit-support'],
    industry: { label: 'manufacturing' },
    tools: ['cash-runway', 'break-even'],
    obligations: ['income-tax-return'],
    motif: 'gate',
  },
  'corporate-compliance': {
    slug: 'corporate-compliance',
    order: 7,
    group: 'growth',
    pairsWith: ['vat-services', 'financial-advisory'],
    industry: { label: 'manufacturing' },
    tools: ['compliance-calendar'],
    obligations: ['rjsc-annual-return', 'vat-return-monthly', 'income-tax-return'],
    motif: 'calendar',
  },
  'financial-advisory': {
    slug: 'financial-advisory',
    order: 8,
    group: 'growth',
    pairsWith: ['virtual-cfo', 'corporate-compliance'],
    industry: { label: 'ecommerce' },
    tools: ['cash-runway', 'break-even'],
    obligations: ['income-tax-return'],
    motif: 'fan',
  },
  'virtual-cfo': {
    slug: 'virtual-cfo',
    order: 9,
    group: 'growth',
    pairsWith: ['financial-advisory', 'cost-efficiency-internal-control'],
    industry: { label: 'manufacturing' },
    tools: ['cash-runway', 'pricing-margin'],
    obligations: ['income-tax-return', 'vat-return-monthly'],
    motif: 'cockpit',
  },
};

/** Ecosystem render order — numeric, and the keyboard tab order with it. */
export const serviceOrder: ServiceEntry[] = serviceSlugs
  .map((slug) => services[slug])
  .sort((a, b) => a.order - b.order);

/**
 * Ecosystem edges. Direction is "hands work to".
 * Drawn from §5.6.2's wireframe; kept here so the mobile list and the desktop
 * diagram are guaranteed to describe the same graph.
 */
export const serviceEdges: { from: ServiceSlug; to: ServiceSlug; kind: 'primary' | 'support' }[] = [
  { from: 'accounting-bookkeeping', to: 'audit-support', kind: 'primary' },
  { from: 'accounting-bookkeeping', to: 'cost-efficiency-internal-control', kind: 'primary' },
  { from: 'audit-support', to: 'corporate-compliance', kind: 'support' },
  { from: 'tax-services', to: 'vat-services', kind: 'primary' },
  { from: 'tax-services', to: 'corporate-compliance', kind: 'primary' },
  { from: 'vat-services', to: 'internal-control-governance', kind: 'support' },
  { from: 'cost-efficiency-internal-control', to: 'internal-control-governance', kind: 'primary' },
  { from: 'internal-control-governance', to: 'corporate-compliance', kind: 'primary' },
  { from: 'corporate-compliance', to: 'financial-advisory', kind: 'primary' },
  { from: 'financial-advisory', to: 'virtual-cfo', kind: 'primary' },
];

export const isServiceSlug = (value: string): value is ServiceSlug =>
  (serviceSlugs as readonly string[]).includes(value);
