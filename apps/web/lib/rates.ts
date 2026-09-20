/**
 * Rate resolution — the one place a tool is allowed to obtain a regulatory
 * figure.
 * ---------------------------------------------------------------------------
 * Blueprint §5.5.4 criterion 2: "No rate, slab, or threshold literal exists in
 * tool components — all resolved via API for the selected date; test-verified."
 * §5.5.3 makes the same point from the reader's side: every tool must show "Rates
 * used: TDS sec 90 (10%) · effective 01 Jul 2025 · verified 12 Sep 2026" with
 * links, and a missing rate must produce a designed state — *"We don't have a
 * verified rate for that date yet — here's the closest, with dates"* — **never a
 * generic error**.
 *
 * This module is that contract. Components ask for a rate and receive one of
 * four statuses; they never see a number they did not obtain here.
 *
 * WHY THERE IS NO DATA IN THIS FILE
 * The Phase 3 rate service does not exist yet. The temptation is to seed a few
 * well-known figures so the calculators do something — and it is the wrong call
 * every time. A published rate that is six months stale, or that applies to a
 * different taxpayer class, or that was changed by an SRO nobody checked, is a
 * liability to the business that relied on it and to the reader who trusted a
 * site that presents sources as its whole value proposition. Bangladesh's
 * corporate-tax thresholds are the clearest example: three different official
 * figures are in circulation for the same concept, and publishing one of them as
 * authoritative would be actively misleading.
 *
 * So `RATE_SOURCE` is empty, every family resolves to `unavailable`, and the
 * tools that need a rate ask the user for the rate printed on their own document
 * — which is both honest and, for a VAT or TDS calculation, what the person
 * doing the work already has in front of them. The disclosure then says "as
 * entered", not "per NBR", because those are different claims.
 *
 * The shape is what matters: when the Phase 3 API arrives, `lookupRate` becomes
 * a fetch, `RATE_SOURCE` disappears, and **not one component changes**, because
 * every component is already written against the status union rather than
 * against a number.
 *
 * Sources: blueprint §5.5.3 (provenance and error states), §5.5.4 (criteria 1–2),
 *          §5.4.2 (rate row anatomy), and the DFDS `RateCard` invariant that
 *          `referenceSro`, `sourceUrl`, `verifiedAt` and `verifiedBy` have no
 *          defaults — a rate card cannot render without them.
 */

import type { RateFamily } from './content/tools';

/**
 * Provenance for a resolved rate. Mirrors the `RateCard` component's required
 * props exactly: the component has no defaults for these four fields, so a rate
 * that cannot supply them cannot be displayed.
 */
export interface RateProvenance {
  /** The instrument that sets the rate, e.g. an SRO or a section of the Act. */
  reference: string;
  /** Where the figure was read from — an authority URL, not a blog. */
  sourceUrl: string;
  /** ISO date the rate took effect, which is not the date it was noticed. */
  effectiveFrom: string;
  /** ISO date a named person last checked it against the source. */
  verifiedAt: string;
  /** Who checked it. A rate with no accountable verifier is not verified. */
  verifiedBy: string;
}

export type RateResolution =
  | {
      status: 'verified';
      family: RateFamily;
      /** Basis points. 1500 = 15%. Integers, so no float drift in tax maths. */
      basisPoints: number;
      provenance: RateProvenance;
    }
  | {
      /**
       * No verified rate exists for this family on this date. This is the
       * Phase 2 state for every family, and the permanent state for any family
       * whose SRO has lapsed and not been re-verified.
       */
      status: 'unavailable';
      family: RateFamily;
      /** ISO date requested; echoed so the UI can say which date it looked for. */
      onDate: string;
      /** The nearest verified date, when one exists. Renders as "closest, with dates". */
      nearest: { date: string; basisPoints: number } | null;
    }
  | {
      /** The family does not apply to this question at all. */
      status: 'not-applicable';
      family: RateFamily;
    };

/**
 * The Phase 3 rate service, in its Phase 2 form: a lookup that finds nothing and
 * says so.
 *
 * Deliberately not `async`. When it becomes a fetch the signature changes to
 * `Promise<RateResolution>` and the compiler will walk every call site — which
 * is the point. A stub that is already async would hide that migration behind an
 * `await` that returns the same empty answer either way.
 */
function lookupRate(family: RateFamily, onDate: string): RateResolution {
  return { status: 'unavailable', family, onDate, nearest: null };
}

/**
 * Resolve a rate for a date.
 *
 * @param family  Which instrument is being asked about.
 * @param onDate  ISO date. A rate is a function of time — the same question
 *                asked about last March has a different answer, and the whole
 *                value of the rate hub is that it remembers which.
 */
export function resolveRate(family: RateFamily, onDate: string): RateResolution {
  return lookupRate(family, onDate);
}

/** Today, as an ISO date. The default `onDate` for a tool with no date input. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ═══════════════════════════════════════════════════════════════════════════
   The rate-free tools
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * A tool whose calculation uses only the user's own figures.
 *
 * These are fully functional in Phase 2 — nothing about break-even, margin,
 * runway, working capital, depreciation or ROI depends on an external
 * regulatory fact, so there is nothing to wait for and no reason to gate them.
 * Saying so explicitly here keeps the distinction visible in review: a tool
 * either declares a rate family and inherits the obligation to show provenance,
 * or it declares none and must not imply an authority it never consulted.
 */
export const isRateFree = (families: RateFamily[]): boolean => families.length === 0;
