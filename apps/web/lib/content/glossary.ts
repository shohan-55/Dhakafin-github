/**
 * Glossary — structural registry (DF-P2-025, blueprint F3).
 * ---------------------------------------------------------------------------
 * A bilingual glossary is the cheapest test of a bilingual site's honesty: if
 * the Bengali term only exists as a transliteration of the English one, the
 * reader can tell. Every entry here carries both, and the Bengali page renders
 * the Bengali term first.
 *
 * SCOPE RULE
 * Definitions describe *what a term means and where you meet it on this site*.
 * They deliberately carry no rates, slabs, thresholds, deadlines or form
 * requirements — those live on the rate pages, each with its source attached,
 * and the glossary says so rather than repeating a figure that will age badly.
 * Authorities are named because who administers an instrument is structural, not
 * a figure that changes by notification.
 */

export const glossaryCategoryIds = [
  'authorities-and-instruments',
  'tax-and-vat',
  'accounting',
  'cost-and-control',
  'numbers-you-meet',
] as const;
export type GlossaryCategoryId = (typeof glossaryCategoryIds)[number];

/** Named in the dictionary so the Bengali page can write them in Bengali. */
export const glossaryAuthorityIds = ['nbr', 'rjsc'] as const;
export type GlossaryAuthorityId = (typeof glossaryAuthorityIds)[number];

export interface GlossaryTerm {
  readonly id: string;
  readonly category: GlossaryCategoryId;
  /** Absent for concept terms — the authority only applies to instruments. */
  readonly authority: GlossaryAuthorityId | undefined;
  /** The page where a reader meets the term in use. */
  readonly href: string | undefined;
}

export const glossaryTerms = [

  /* ── Authorities and instruments ── */
  { id: 'nbr', category: 'authorities-and-instruments', authority: 'nbr', href: undefined },
  { id: 'sro', category: 'authorities-and-instruments', authority: 'nbr', href: undefined },
  { id: 'mushak', category: 'authorities-and-instruments', authority: 'nbr', href: '/services/vat-services' },
  { id: 'tin', category: 'authorities-and-instruments', authority: 'nbr', href: undefined },
  { id: 'bin', category: 'authorities-and-instruments', authority: 'nbr', href: '/services/vat-services' },
  { id: 'rjsc', category: 'authorities-and-instruments', authority: 'rjsc', href: '/services/corporate-compliance' },
  { id: 'return', category: 'authorities-and-instruments', authority: 'nbr', href: '/compliance-calendar' },

  /* ── Tax and VAT ── */
  { id: 'tds', category: 'tax-and-vat', authority: 'nbr', href: '/tools/tds-calculator' },
  { id: 'vds', category: 'tax-and-vat', authority: 'nbr', href: '/tools/vds-calculator' },
  { id: 'vat', category: 'tax-and-vat', authority: 'nbr', href: '/tools/vat-calculator' },
  { id: 'input-tax-credit', category: 'tax-and-vat', authority: 'nbr', href: '/services/vat-services' },

  /* ── Accounting ── */
  { id: 'accrual-basis', category: 'accounting', authority: undefined, href: '/services/accounting-bookkeeping' },
  { id: 'bank-reconciliation', category: 'accounting', authority: undefined, href: '/services/accounting-bookkeeping' },
  { id: 'depreciation', category: 'accounting', authority: undefined, href: '/tools/profit-calculator' },
  { id: 'working-paper', category: 'accounting', authority: undefined, href: '/services/audit-support' },

  /* ── Cost and control ── */
  { id: 'internal-control', category: 'cost-and-control', authority: undefined, href: '/services/cost-efficiency-internal-control' },
  { id: 'segregation-of-duties', category: 'cost-and-control', authority: undefined, href: '/services/internal-control-governance' },
  { id: 'purchase-price-variance', category: 'cost-and-control', authority: undefined, href: '/tools/cost-efficiency-calculator' },
  { id: 'inventory-variance', category: 'cost-and-control', authority: undefined, href: '/services/cost-efficiency-internal-control' },
  { id: 'payment-controls', category: 'cost-and-control', authority: undefined, href: '/services/internal-control-governance' },

  /* ── Numbers you meet ── */
  { id: 'contribution-margin', category: 'numbers-you-meet', authority: undefined, href: '/tools/break-even-calculator' },
  { id: 'break-even', category: 'numbers-you-meet', authority: undefined, href: '/tools/break-even-calculator' },
  { id: 'working-capital', category: 'numbers-you-meet', authority: undefined, href: '/tools/working-capital-calculator' },
  { id: 'cash-flow', category: 'numbers-you-meet', authority: undefined, href: '/tools/cash-flow-calculator' },
  { id: 'roi', category: 'numbers-you-meet', authority: undefined, href: '/tools/roi-calculator' },
] as const satisfies readonly GlossaryTerm[];

export type GlossaryTermId = (typeof glossaryTerms)[number]['id'];

export type GlossaryTermEntry = (typeof glossaryTerms)[number];

export function termsInCategory(id: GlossaryCategoryId): GlossaryTermEntry[] {
  return glossaryTerms.filter((term) => term.category === id);
}
