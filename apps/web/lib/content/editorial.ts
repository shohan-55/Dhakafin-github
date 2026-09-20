/**
 * Editorial policy — structural registry (DF-P2-025, blueprint L269/L2362/L3049).
 * ---------------------------------------------------------------------------
 * `/editorial-policy` is the page that says how everything else on this site
 * earns the right to be believed. The blueprint fixes its contents in three
 * places, and they are the spine of this file:
 *
 *   · L269 — "who writes, who verifies, correction policy, review date on every
 *     article";
 *   · L2362 — "every article has an author and a named reviewer with credentials,
 *     a 'reviewed on' date, a sourced fact table, and a correction policy. Claims
 *     must cite NBR sources with links. No AI-generated publishable content
 *     without expert review — AI may draft structure and Bangla translation,
 *     never the statutory fact";
 *   · L3049 — a correction request is "acknowledged in 1 working day; corrected
 *     in 3".
 *
 * Structure lives here; every word of it lives in the dictionary. The correction
 * log is a real (currently empty) list rather than a paragraph promising one: the
 * page renders from it, so the first entry a person adds appears on the page
 * without touching JSX — and an empty log is a fact, not a placeholder.
 */

/** The seven commitments, in the order the page argues them. */
export const policySectionIds = [
  'source-rule',
  'who-publishes',
  'pipeline',
  'dates',
  'artificial-intelligence',
  'corrections',
  'refusals',
] as const;
export type PolicySectionId = (typeof policySectionIds)[number];

/**
 * Publishing roles. Names deliberately match §6.1 and `/about`, because the
 * person who cannot change a rate is the same person on both pages — a reader
 * who checks should not find two different authority maps.
 */
export const editorialRoleIds = [
  'content-editor',
  'tax-compliance-lead',
  'service-delivery-lead',
  'client-partner',
] as const;
export type EditorialRoleId = (typeof editorialRoleIds)[number];

/** Draft → published, with the two checks a statutory fact passes through. */
export const pipelineStageIds = [
  'drafted',
  'sourced',
  'specialist-review',
  'second-verification',
  'published',
] as const;
export type PipelineStageId = (typeof pipelineStageIds)[number];

/** What we refuse to publish, in the order of how tempting each one is. */
export const refusalIds = [
  'rate-without-source',
  'estimate-around-a-gap',
  'saving-without-a-sample',
  'guaranteed-saving',
  'paid-ranking',
] as const;
export type RefusalId = (typeof refusalIds)[number];

/**
 * The correction log.
 *
 * Append-only, newest first. An entry is added when a published page changes a
 * fact — not when wording is tightened, and not when a design changes. Keep the
 * shape narrow on purpose: date, page, what changed, and who verified the fix.
 */
export interface CorrectionEntry {
  /** ISO date the correction was published. */
  date: string;
  /** Route that changed, e.g. `/services/vat-services`. */
  page: string;
  /** What was wrong, what it says now — one sentence, no spin. */
  what: string;
  /** The person accountable for the corrected figure. */
  verifiedBy: string;
}

export const corrections: readonly CorrectionEntry[] = [];
