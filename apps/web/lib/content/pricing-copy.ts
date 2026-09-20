/**
 * Bilingual contract for `/pricing` (DF-P2-025).
 * ---------------------------------------------------------------------------
 * F3 asks for bands, inclusions and exclusions, an annual toggle, a compare mode
 * and a "which fits me?" filter — and, in the same row, that prices are visible
 * rather than replaced by "contact us".
 *
 * The type below enforces the two things that make that claim safe:
 *
 *   · `lines` is a `Record<ServiceSlug, …>`, so all nine service lines must carry
 *     a stated pricing basis in both languages. Adding a tenth service line to the
 *     registry without pricing it is a compile error, not a page that quietly
 *     omits it.
 *   · `platform.tiers` is keyed by tier id and the copy must state, in both
 *     languages, that the platform is not yet on sale. The blueprint finalises
 *     platform pricing in Phase 5 after ten interviews; until then the page shows
 *     the design target and says what it is, because a target presented as a price
 *     is a promise the business cannot keep.
 */

import type { ServiceSlug } from './services';
import type {
  FitQuestionId,
  PlatformFeatureId,
  PlatformTierId,
  PriceCadence,
} from './pricing';

export interface PricingLineCopy {
  /** What moves the figure up or down — the sentence a buyer self-qualifies with. */
  basis: string;
  /** Three factors, printed under the basis. */
  drivers: string[];
  /** Anything the reader must know before comparing this row with another. */
  note?: string;
}

export interface PricingCopy {
  meta: { title: string; metaTitle: string; metaDescription: string };

  hero: {
    eyebrow: string;
    title: string;
    lede: string;
    /** "+ applicable VAT", stated in full. */
    vatNote: string;
    primaryCta: string;
    secondaryCta: string;
  };

  drivers: {
    heading: string;
    lede: string;
    items: { title: string; body: string }[];
  };

  /**
   * The band ladder under the hero.
   *
   * It plots the nine published starting bands on a log scale. The caption has to
   * say "starting band, log scale" out loud: a bar chart invites the reader to
   * read the bar as a range and the axis as linear, and both readings would be
   * wrong here.
   */
  ladder: {
    heading: string;
    caption: string;
    scaleNote: string;
  };

  table: {
    heading: string;
    lede: string;
    columns: {
      line: string;
      band: string;
      basis: string;
      included: string;
      excluded: string;
    };
    billingMonthly: string;
    billingAnnual: string;
    /** Accessible group label for the billing toggle — a toggle without a label is a riddle. */
    billingLabel: string;
    /** Shown only on narrow screens, where the six-column ledger scrolls sideways. */
    scrollHint: string;
    billingLegend: string;
    annualNote: string;
    oneOffNote: string;
    /** Compare mode: the checkbox column, the panel, and what it says when empty. */
    compareLabel: string;
    compareHint: string;
    compareHeading: string;
    compareClear: string;
    compareMax: string;
    compareEmpty: string;
    cadence: Record<PriceCadence, string>;
    openLabel: string;
    includesLabel: string;
    excludesLabel: string;
    moreLabel: string;
    exclusionsHeading: string;
    exclusionsLede: string;
    exclusions: string[];
  };

  lines: Record<ServiceSlug, PricingLineCopy>;

  fit: {
    heading: string;
    lede: string;
    stepLabel: string;
    restartLabel: string;
    resultHeading: string;
    resultBandLabel: string;
    resultWhyLabel: string;
    openLabel: string;
    notSureLabel: string;
    notSureNote: string;
    questions: Record<FitQuestionId, { question: string; answers: Record<string, string> }>;
    reasons: Record<ServiceSlug, string>;
  };

  platform: {
    statusBadge: string;
    heading: string;
    lede: string;
    targetLabel: string;
    freeLabel: string;
    quotedLabel: string;
    monthlySuffix: string;
    annualLabel: string;
    annualNote: string;
    finalNote: string;
    featureColumn: string;
    audienceLabel: string;
    notOnSaleLabel: string;
    tiers: Record<PlatformTierId, { name: string; description: string; audience: string }>;
    /**
     * The comparison matrix. Values are strings rather than booleans on purpose:
     * the scaffold's answers are limits ("5 GB"), counts ("100 / month") and
     * availability, and flattening those to ✓/— would lose what a buyer compares.
     * They live in the dictionary rather than the registry because "Unlimited
     * (fair use)" and "Unlimited + private" have to be readable in Bengali.
     */
    features: Record<PlatformFeatureId, { label: string; values: Record<PlatformTierId, string> }>;
  };

  faqs: {
    heading: string;
    items: { id: string; question: string; answer: string }[];
  };

  cta: {
    title: string;
    body: string;
    primaryLabel: string;
    secondaryLabel: string;
    footnote: string;
  };
}
