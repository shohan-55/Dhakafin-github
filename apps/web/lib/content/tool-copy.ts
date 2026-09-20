/**
 * Tool copy — the bilingual contract.
 * ---------------------------------------------------------------------------
 * Both dictionaries are annotated with these types, so a field added in English
 * without a Bengali counterpart fails `tsc`. The services vertical established
 * that pattern; this extends it to the tools, because the failure mode it
 * prevents is worse here: a Bengali calculator page that falls back to English
 * field labels would look finished in review and be unusable to the person it
 * was built for.
 *
 * Plain strings and arrays only — no JSX, no functions. When Filament takes over
 * content in Phase 3, this maps onto a translatable JSON column, and a React
 * node in a dictionary cannot make that journey.
 */

import type { ToolCategoryId, ToolSlug } from './tools';

/** Field and result labels for a single tool. */
export interface ToolCopy {
  /** Short name, used in navigation and breadcrumbs. */
  name: string;
  /** Search-result title. Must be unique across the site. */
  metaTitle: string;
  /** ~150–160 display-width units. The metadata gate enforces the band. */
  metaDescription: string;
  /** One line under the h1: what the tool does and for whom. */
  tagline: string;
  /**
   * The 40–60 word answer block required by §5.5.4 #5. Written to be quotable,
   * because this is the paragraph a search engine or an AI assistant will lift.
   */
  answer: string;

  fields: Record<
    string,
    {
      label: string;
      hint?: string;
      /** Rendered inside the field as a suffix, e.g. `%`. Not part of the value. */
      unit?: string;
      /** For `select` and `toggle` inputs, keyed by option value. */
      options?: Record<string, string>;
    }
  >;
  /** Label for one row of a `series` input. `{n}` is replaced with the period. */
  seriesRowLabel: string;

  result: {
    /** Heading of the result panel. */
    title: string;
    primaryLabel: string;
    /**
     * Which `rows` key is the primary figure, so the panel does not repeat it in
     * the table below. Optional because a tool whose headline is itself a ratio
     * may want it in both places.
     */
    primaryKey?: string;
    /** Optional qualifier under the primary figure, e.g. units. */
    primaryUnit?: string;
    /** Empty-state prompt before the user has entered anything usable. */
    empty: string;
    rows: Record<string, string>;
  };

  /** Why the tool cannot compute yet, on the three that cannot. */
  pendingState?: {
    title: string;
    body: string;
    whatWeNeed: string;
  };

  howItWorks: { heading: string; paragraphs: string[] };
  examples: { heading: string; items: { title: string; body: string }[] };
  faqs: { heading: string; items: { id: string; question: string; answer: string }[] };
}

/** Shared shell chrome, once for all thirteen. */
export interface ToolsHubCopy {
  meta: { title: string; metaTitle: string; metaDescription: string };
  hero: { eyebrow: string; title: string; lead: string };
  categories: Record<ToolCategoryId, { label: string; blurb: string }>;

  index: {
    heading: string;
    lead: string;
    /** Shown on a card whose calculator is held back. */
    pendingBadge: string;
    openLabel: string;
  };

  shell: {
    inputsTitle: string;
    inputsNote: string;
    advancedTitle: string;
    exampleLabel: string;
    resetLabel: string;
    resultsNote: string;
    liveRegionLabel: string;
  };

  disclosure: {
    title: string;
    formulaLabel: string;
    roundingNote: string;
    /**
     * The honesty statement on every tool that accepts a rate. It must say that
     * the rate was typed by the reader, because "as entered" and "per NBR" are
     * different claims and only one of them is true.
     */
    rateNote: string;
    /** Rendered instead of `rateNote` on tools that never consult a rate. */
    rateFreeNote: string;
  };

  pending: {
    ratesTitle: string;
    ratesBody: string;
    benchmarksTitle: string;
    benchmarksBody: string;
    /** What happens when the data lands — sets an expectation rather than an apology. */
    outlook: string;
  };

  related: {
    heading: string;
    toolLabel: string;
    serviceLabel: string;
    rateLabel: string;
    ratePendingNote: string;
  };

  /** §5.5.4 #5 requires a visible disclaimer on every tool page. */
  disclaimer: string;

  cta: {
    title: string;
    body: string;
    primary: string;
    secondary: string;
  };

  /** Link labels used by the hub when pointing at a tool. */
  hub: {
    allToolsLabel: string;
    toolsNavLabel: string;
  };
}

export type ToolsDictionary = ToolsHubCopy & {
  tools: Record<ToolSlug, ToolCopy>;
};
