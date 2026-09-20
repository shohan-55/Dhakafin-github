/**
 * About-page structure — DF-P2-025 (blueprint F3, §1.2, §6.1).
 * ---------------------------------------------------------------------------
 * The page's facts live here and its words live in the dictionaries, for the same
 * reason every other page on the site is split that way: Phase 3 hands the words
 * to Filament, and structure that a marketer reorders in a CMS must not be welded
 * into JSX.
 *
 * Two things in this file are deliberate refusals:
 *
 *   · **The flywheel is §1.2's own loop**, not a decorative ring. Its eight nodes
 *     are the funnel the business is actually built on, and the diagram in the
 *     page component draws exactly these, in this order, with the regulatory
 *     engine named at the centre — because §1.2 says the engine is what makes the
 *     loop turn, and an unlabelled circle would say nothing.
 *   · **There are no invented people here.** F3 asks `/about` for leadership and
 *     `/team` for named professionals with credentials, and the acceptance line
 *     is "no placeholder bios". The honest way to satisfy that today is to
 *     publish the roles and their authority boundaries — which are real, and are
 *     the part a client actually needs to know — and to leave the names to the
 *     verification step §6.1 requires before a profile can carry a credential.
 */

/** §1.2 — the loop, in order. Labels come from `about.flywheel.nodes`. */
export const flywheelNodes = [
  'search',
  'tools',
  'account',
  'compliance',
  'diagnostic',
  'engagement',
  'results',
  'content',
] as const;

export type FlywheelNodeId = (typeof flywheelNodes)[number];

/**
 * The wheel's engine, per §1.2: "the single most defensible growth loop DhakaFin
 * has". Named in the registry so the diagram cannot quietly lose it.
 */
export const flywheelEngine = 'regulatory-change' as const;

/** Story spine stages, in order. Only the first carries a year — see the copy. */
export const storyStages = ['first-engagements', 'verification-rule', 'free-tools', 'platform'] as const;
export type StoryStageId = (typeof storyStages)[number];

/** The five values. Each one must be shown next to the product behaviour it produces. */
export const valueIds = [
  'sourced-number',
  'method-travels',
  'uncomfortable-first',
  'bangla-first',
  'cheap-pages',
] as const;
export type ValueId = (typeof valueIds)[number];

/**
 * Who does what on an engagement. Derived from §6.1's role table: the roles, what
 * they are accountable for, and — the part clients never get told — what they are
 * not allowed to touch.
 */
export const engagementRoles = ['client-partner', 'tax-compliance-lead', 'cost-control-lead', 'accounting-lead'] as const;
export type EngagementRoleId = (typeof engagementRoles)[number];

/** Where the firm is, and what that means for when it can be reached. */
export const officeFacts = {
  city: 'Dhaka',
  country: 'Bangladesh',
  /** The clock the published working hours are expressed in. */
  timeZone: 'Asia/Dhaka',
  utcOffset: '+06:00',
} as const;
