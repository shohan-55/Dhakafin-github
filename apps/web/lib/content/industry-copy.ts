/**
 * Industry copy — the bilingual contract.
 * ---------------------------------------------------------------------------
 * Both dictionaries are annotated with these types, so a field added in English
 * without a Bengali counterpart fails `tsc`. Plain strings and arrays only:
 * when Filament takes over in Phase 3 this maps onto a translatable JSON column,
 * and a React node in a dictionary cannot make that journey.
 *
 * The blocks follow §5.13.1's template exactly, in the same order, because the
 * whole point of a template is that the fourteenth industry is a data entry
 * rather than a design exercise.
 */

import type { IndustryAccent, IndustrySlug } from './industries';

/** One industry KPI: the formula, and how to read it. */
export interface IndustryKpi {
  id: string;
  /** Short label, e.g. `Material cost %`. */
  label: string;
  /**
   * The formula, written out. Definitional, so it cannot go stale — which is
   * deliberately the half of §5.13.1's "formulas and benchmark bands" that can
   * be published without a measured source behind it.
   */
  formula: string;
  /** What the number tells you. */
  meaning: string;
  /** The move that improves it, and the cost of making that move. */
  lever: string;
}

/** A pain point, in the owner's own words, and the service that answers it. */
export interface IndustryPain {
  text: string;
  /** Index into the industry's ranked `services` array. */
  serviceIndex: number;
}

export interface IndustryRisk {
  text: string;
  /** How it is detected or handled — the credibility half of the pair. */
  handling: string;
}

export interface IndustryProfileRow {
  /** The obligation's label; the authority and cadence come from the register. */
  obligationId: string;
  /** Why it applies to this sector specifically, not to businesses in general. */
  why: string;
}

export interface IndustryCopy {
  name: string;
  /** Used in the hero H1: "{industry} accounting, tax, VAT & cost control". */
  heroPhrase: string;
  metaTitle: string;
  metaDescription: string;
  /** The one-line promise. Industry-specific, not a generic tagline. */
  promise: string;
  /** 40–60 word answer block, quotable standing alone. */
  answer: string;

  complianceProfile: {
    heading: string;
    /** Explains the profile without stating a single rate or deadline. */
    lede: string;
    rows: IndustryProfileRow[];
    /** Shown alongside, because obligations without dates must say why. */
    noDatesNote: string;
  };

  financialDna: {
    heading: string;
    lede: string;
    /** Revenue and cost structure, as proportions to look for. */
    structure: { label: string; note: string }[];
    /** Where the money characteristically escapes in this sector. */
    leakage: string[];
    /** How cash behaves: the timing pattern, not a number. */
    workingCapital: string;
    /** Explains why the numbers are described rather than published. */
    bandsNote: string;
  };

  kpis: {
    heading: string;
    lede: string;
    items: IndustryKpi[];
    bandsNote: string;
  };

  pains: {
    heading: string;
    lede: string;
    items: IndustryPain[];
  };

  risks: {
    heading: string;
    lede: string;
    items: IndustryRisk[];
  };

  recommended: {
    heading: string;
    lede: string;
    /** Keyed by service slug; only the ranked services need an entry. */
    reasons: Record<string, string>;
  };

  tools: {
    heading: string;
    lede: string;
    /** The preset explained in words — never a figure. */
    presetNote: string;
  };

  caseStudy: {
    heading: string;
    challenge: string;
    intervention: string;
    result: string;
    /** §5.13.1 and the demo-integrity rule: illustrative, and labelled so. */
    sampleNote: string;
  };

  faqs: { heading: string; items: { id: string; question: string; answer: string }[] };

  cta: {
    title: string;
    body: string;
    primary: string;
    magnet: string;
    secondary: string;
  };
}

export interface IndustriesHubCopy {
  meta: { title: string; metaTitle: string; metaDescription: string };
  hero: { eyebrow: string; title: string; lead: string };
  rail: {
    heading: string;
    lead: string;
    liveBadge: string;
    plannedBadge: string;
    plannedNote: string;
    openLabel: string;
  };
  accents: Record<IndustryAccent, string>;
}

export type IndustriesDictionary = IndustriesHubCopy & {
  industries: Record<IndustrySlug, IndustryCopy>;
};
