/**
 * Compliance obligations referenced by services.
 * ---------------------------------------------------------------------------
 * STRUCTURAL DATA ONLY.
 *
 * The id, the authority and the cadence are structure — they describe that an
 * obligation exists and recurs. They are safe to keep in code because they do
 * not change, and a wrong value would be caught by any accountant.
 *
 * Dates, rates, thresholds, forms and legal references are NOT here. Those are
 * regulatory data: they change by SRO, they differ by turnover, and publishing
 * a stale figure is a real-world harm to a client who relies on it. They live in
 * the CMS with the provenance fields DFDS's `RateCard` already requires
 * (`referenceSro`, `sourceUrl`, `verifiedAt`, `verifiedBy`) — none of which has
 * a default, so an unverified obligation cannot be rendered as a fact.
 *
 * Until the CMS is wired (Phase 3), surfaces that need a date render the
 * "verify at source" affordance instead of a number. That is the honest state
 * of the system, not a placeholder.
 *
 * Blueprint §7.1, ADR-005.
 */

export type ObligationAuthority = 'NBR' | 'RJSC' | 'DEDO' | 'OTHER';

export interface Obligation {
  /** Stable id, referenced by `ServiceEntry.obligations`. */
  id: string;
  authority: ObligationAuthority;
  cadence: 'monthly' | 'quarterly' | 'annual' | 'event';
  /** Key into `dictionary.chrome.obligations` for the human label. */
  labelKey: string;
  /** Official surface a client can verify against. */
  verifyUrl: string;
}

export const obligations: Record<string, Obligation> = {
  'vat-return-monthly': {
    id: 'vat-return-monthly',
    authority: 'NBR',
    cadence: 'monthly',
    labelKey: 'vatReturn',
    verifyUrl: 'https://nbr.gov.bd',
  },
  'vds-deposit': {
    id: 'vds-deposit',
    authority: 'NBR',
    cadence: 'monthly',
    labelKey: 'vdsDeposit',
    verifyUrl: 'https://nbr.gov.bd',
  },
  'bin-registration': {
    id: 'bin-registration',
    authority: 'NBR',
    cadence: 'event',
    labelKey: 'binRegistration',
    verifyUrl: 'https://nbr.gov.bd',
  },
  'income-tax-return': {
    id: 'income-tax-return',
    authority: 'NBR',
    cadence: 'annual',
    labelKey: 'incomeTaxReturn',
    verifyUrl: 'https://nbr.gov.bd',
  },
  'tds-deposit-monthly': {
    id: 'tds-deposit-monthly',
    authority: 'NBR',
    cadence: 'monthly',
    labelKey: 'tdsDeposit',
    verifyUrl: 'https://nbr.gov.bd',
  },
  'advance-tax': {
    id: 'advance-tax',
    authority: 'NBR',
    cadence: 'quarterly',
    labelKey: 'advanceTax',
    verifyUrl: 'https://nbr.gov.bd',
  },
  'rjsc-annual-return': {
    id: 'rjsc-annual-return',
    authority: 'RJSC',
    cadence: 'annual',
    labelKey: 'rjscAnnualReturn',
    verifyUrl: 'https://roc.gov.bd',
  },
};

export const obligationList = (ids: string[]): Obligation[] =>
  ids.map((id) => obligations[id]).filter((o): o is Obligation => Boolean(o));
