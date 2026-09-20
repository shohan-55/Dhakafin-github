/**
 * Bilingual contract for the cost-efficiency experience (DF-P2-044).
 * ---------------------------------------------------------------------------
 * Both dictionaries are typed against this file, so the Bengali page cannot
 * drift from the English one in structure — only in language.
 *
 * Two properties are non-negotiable and therefore typed rather than remembered:
 *
 *   · `disclosure` is a required block. §5.9.4 criterion 1 asks for a test that
 *     asserts the disclosure element exists; typing it here means the page cannot
 *     compile without it, and `scripts/check-estimate.mjs` checks that it reached
 *     the emitted HTML.
 *   · every pillar carries `name`, `question`, `rangeStatus`, `example` and
 *     `policyNote` — §5.9.4 criterion 2's five fields. The range itself is a
 *     status sentence, not a number, until `resolveBenchmark` returns one.
 */

import type { LeakagePillarId } from '../benchmarks';
import type { CostCategoryId, NarrativeBeatId } from './cost-efficiency';

export interface CostEfficiencyPillarCopy {
  /** What the surface is called, in the reader's language. */
  name: string;
  /** The diagnostic question the card reveals on hover or focus. */
  question: string;
  /** What it means when the answer is "yes". */
  yesMeans: string;
  /**
   * The typical range. A sentence while no benchmark is published, and the place
   * a published range will be rendered once one is.
   */
  rangeStatus: string;
  /** The full example narrative behind the expand. */
  example: string;
  /** What policy closes it. §5.9.4 criterion 2's fifth field. */
  policyNote: string;
  /** Accessible description of the card's mini chart. */
  chartCaption: string;
}

export interface CostEfficiencyBeatCopy {
  marker: string;
  title: string;
  lead: string;
}

export interface CostEfficiencyCopy {
  meta: { title: string; metaTitle: string; metaDescription: string };

  hero: {
    eyebrow: string;
    headline: string;
    sub: string;
    /** One line under the hero stating what kind of page this is. */
    premise: string;
  };

  beats: Record<Exclude<NarrativeBeatId, 'headline'>, CostEfficiencyBeatCopy>;

  chart: {
    heading: string;
    revenue: string;
    necessary: string;
    exposure: string;
    profitReported: string;
    profitAfter: string;
    profitAfterWithheld: string;
    axisNote: string;
    legendNecessary: string;
    legendExposure: string;
    legendWithheld: string;
  };

  pillars: Record<LeakagePillarId, CostEfficiencyPillarCopy>;

  estimator: {
    heading: string;
    lead: string;

    turnoverLabel: string;
    turnoverHint: string;
    turnoverFloorNote: string;
    turnoverInputLabel: string;

    categoryHeading: string;
    categoryNote: string;
    categories: Record<CostCategoryId, { label: string; hint: string }>;
    operatingCostLabel: string;
    operatingCostNote: string;

    questionHeading: string;
    questionNote: string;
    answerYes: string;
    answerNo: string;
    answerUnanswered: string;

    exposureHeading: string;
    exposureNote: string;
    ladderHeading: string;
    ladderNote: string;

    withheldHeading: string;
    withheldBody: string;
    methodStatus: string;

    priorityHeading: string;
    priorityNote: string;
    priorityEmpty: string;

    recoveryHeading: string;
    recoveryNote: string;

    compareLabel: string;
    compareNote: string;

    stickyLabel: string;
    stickyCta: string;

    shareLabel: string;
    shareCopied: string;
    shareHint: string;
    printLabel: string;
    resetLabel: string;
  };

  method: {
    heading: string;
    lead: string;
    columns: { pillar: string; industry: string; range: string; status: string; source: string };
    statusUnverified: string;
    statusVerified: string;
    reason: Record<'no-sample' | 'sample-too-small' | 'industry-not-covered' | 'method-under-review', string>;
    sourceMissing: string;
    summary: string;
  };

  disclosure: {
    heading: string;
    /** The sentence that must exist on the page. Checked in emitted HTML. */
    body: string;
    numbersNote: string;
    privacyNote: string;
  };

  delivery: {
    heading: string;
    lead: string;
    items: { title: string; body: string }[];
    bookLabel: string;
    quoteLabel: string;
    checklistLabel: string;
    checklistNote: string;
  };

  faqs: {
    heading: string;
    items: { id: string; question: string; answer: string }[];
  };

  share: {
    heading: string;
    body: string;
    invalidHeading: string;
    invalidBody: string;
    backLabel: string;
  };
}
