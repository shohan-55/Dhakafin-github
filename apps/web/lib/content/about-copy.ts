/**
 * Bilingual contract for `/about` — DF-P2-025.
 * ---------------------------------------------------------------------------
 * The type is the acceptance check. F3 asks `/about` for a story, a philosophy,
 * a flywheel, leadership, values, a location and a careers link; each of those is
 * a required field below, so the page cannot ship missing one of them — and
 * `tsc` fails the build in both locales if a translator drops a section rather
 * than leaving a page that silently renders nine tenths of itself.
 *
 * `flywheel.nodes` is keyed by the registry's node ids, and `values` and `roles`
 * the same way: the diagram, the value grid and the role list are generated from
 * `lib/content/about.ts`, so adding a node without a label is a compile error
 * instead of an empty circle.
 */

import type { FlywheelNodeId, EngagementRoleId, StoryStageId, ValueId } from './about';

export interface AboutCopy {
  meta: { title: string; metaTitle: string; metaDescription: string };

  hero: {
    eyebrow: string;
    title: string;
    lede: string;
    /** Two or three facts, stated as facts. "Since 2019" is one of them. */
    chips: { label: string }[];
    premise: string;
  };

  /** The full-bleed typographic moment F3 calls for. Short, and load-bearing. */
  philosophy: {
    quote: string;
    attribution: string;
    body: string;
  };

  story: {
    heading: string;
    lede: string;
    stages: Record<StoryStageId, { marker: string; title: string; body: string }>;
  };

  flywheel: {
    heading: string;
    lede: string;
    nodes: Record<FlywheelNodeId, string>;
    engineLabel: string;
    engineNote: string;
    loopLabel: string;
  };

  values: {
    heading: string;
    lede: string;
    items: Record<ValueId, { title: string; body: string; behaviour: string }>;
    behaviourLabel: string;
  };

  roles: {
    heading: string;
    lede: string;
    items: Record<EngagementRoleId, { title: string; accountable: string; cannot: string }>;
    accountableLabel: string;
    cannotLabel: string;
    /** Why there are no faces on this page yet — stated, not hidden. */
    profilesNote: string;
  };

  location: {
    heading: string;
    body: string;
    facts: { label: string; value: string }[];
    note: string;
  };

  careers: {
    heading: string;
    body: string;
    linkLabel: string;
  };

  cta: {
    title: string;
    body: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
}
