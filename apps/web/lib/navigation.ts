/**
 * Navigation model — DF-P2-001
 * ---------------------------------------------------------------------------
 * Routes and ordering live in code. Labels live in the dictionaries.
 *
 * The split matters for Phase 3: when Filament takes over content, a marketer
 * will want to reorder or relabel footer links without a deploy. Keeping the
 * *structure* here and the *words* in the dictionary means that migration is a
 * change to one loader rather than a hunt through JSX.
 *
 * Every entry carries a `key` that must exist in `Dictionary['footer']['links']`.
 * `tsc` enforces that — a route with no translation cannot be added silently.
 */
import type { Dictionary } from './dictionary';
import { toolHref } from './content/tools';

export type FooterLinkKey = keyof Dictionary['footer']['links'];
export type FooterColumnKey = keyof Dictionary['footer']['columns'];

export interface FooterColumn {
  key: FooterColumnKey;
  links: { key: FooterLinkKey; href: string }[];
}

/**
 * Ordered footer columns. The sequence is intentional: regulatory intelligence
 * first (it is what people arrive searching for and what earns the backlinks),
 * then the free tools, then the paid services, then the company.
 */
export const footerColumns: FooterColumn[] = [
  {
    key: 'intelligence',
    links: [
      { key: 'tdsRates', href: '/rates/tds' },
      { key: 'vdsRates', href: '/rates/vds' },
      { key: 'vatRates', href: '/rates/vat' },
      { key: 'incomeTaxSlabs', href: '/rates/income-tax' },
      { key: 'corporateTaxRates', href: '/rates/corporate-tax' },
      { key: 'complianceCalendar', href: '/compliance-calendar' },
      { key: 'sroLibrary', href: '/sro' },
    ],
  },
  {
    key: 'tools',
    links: [
      // The six with the strongest search demand (§5.4 keyword table), then the hub.
      // Hrefs come from the tool registry — never typed by hand, because that is
      // how this column once pointed at `/tools/break-even-calculator` while the
      // service pages pointed at `/tools/break-even` and neither route existed.
      { key: 'tdsCalculator', href: toolHref('tds-calculator') },
      { key: 'vdsCalculator', href: toolHref('vds-calculator') },
      { key: 'vatCalculator', href: toolHref('vat-calculator') },
      { key: 'incomeTaxCalculator', href: toolHref('income-tax-calculator') },
      { key: 'breakEvenCalculator', href: toolHref('break-even-calculator') },
      { key: 'costEfficiencyCalculator', href: toolHref('cost-efficiency-calculator') },
      { key: 'allTools', href: '/tools' },
    ],
  },
  {
    key: 'services',
    links: [
      { key: 'accountingBookkeeping', href: '/services/accounting-bookkeeping' },
      { key: 'auditSupport', href: '/services/audit-support' },
      { key: 'taxServices', href: '/services/tax-services' },
      { key: 'vatServices', href: '/services/vat-services' },
      { key: 'costEfficiency', href: '/services/cost-efficiency-internal-control' },
      { key: 'corporateCompliance', href: '/services/corporate-compliance' },
      { key: 'financialAdvisory', href: '/services/financial-advisory' },
      { key: 'virtualCfo', href: '/services/virtual-cfo' },
    ],
  },
  {
    key: 'company',
    links: [
      { key: 'about', href: '/about' },
      { key: 'team', href: '/team' },
      { key: 'clients', href: '/clients' },
      { key: 'pricing', href: '/pricing' },
      { key: 'security', href: '/security' },
      { key: 'editorialPolicy', href: '/editorial-policy' },
      { key: 'contact', href: '/contact' },
      { key: 'help', href: '/help' },
      { key: 'faq', href: '/faq' },
    ],
  },
];

/** Legal navigation, deliberately separate from the sitemap columns. */
export const legalLinks: { key: FooterLinkKey; href: string }[] = [
  { key: 'terms', href: '/terms' },
  { key: 'privacy', href: '/privacy' },
  { key: 'disclaimer', href: '/disclaimer' },
  { key: 'refundPolicy', href: '/refund-policy' },
];

/** Primary header routes. Labels come from `Dictionary['nav']`. */
export const primaryNav = [
  { key: 'rates', href: '/rates' },
  { key: 'tools', href: '/tools' },
  { key: 'services', href: '/services' },
  { key: 'industries', href: '/industries' },
  { key: 'insights', href: '/insights' },
] as const;
