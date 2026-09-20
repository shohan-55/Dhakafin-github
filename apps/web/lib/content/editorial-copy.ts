/**
 * Bilingual contract for `/editorial-policy` — DF-P2-025.
 * ---------------------------------------------------------------------------
 * Every claim on this page is a claim about how the practice works, so the
 * contract is written to make omissions obvious rather than forgivable: the
 * sections, roles, pipeline stages and refusals are keyed by the registry ids,
 * which means a section added to the policy without copy fails the build instead
 * of rendering an empty heading.
 */

import type {
  EditorialRoleId,
  PipelineStageId,
  PolicySectionId,
  RefusalId,
} from './editorial';

export interface EditorialCopy {
  meta: { title: string; metaTitle: string; metaDescription: string };

  hero: {
    eyebrow: string;
    title: string;
    lede: string;
    /** The one-sentence version of the whole page, stated up front. */
    note: string;
  };

  /** Section headings and bodies, keyed by the registry. */
  sections: Record<PolicySectionId, { title: string; lede: string; body: string[] }>;

  /** The anatomy of a sourced figure: what must accompany it, labelled. */
  sourceAnatomy: {
    heading: string;
    intro: string;
    items: { label: string; what: string }[];
    footnote: string;
  };

  roles: Record<EditorialRoleId, { title: string; accountable: string; cannot: string }>;
  rolesAccountableLabel: string;
  rolesCannotLabel: string;

  pipeline: Record<PipelineStageId, { title: string; body: string }>;
  pipelineCaption: string;

  ai: {
    mayHeading: string;
    mayItems: string[];
    mayNotHeading: string;
    mayNotItems: string[];
  };

  corrections: {
    slaLabel: string;
    slaBody: string;
    logHeading: string;
    logEmpty: string;
    logColumns: { date: string; page: string; what: string; verifiedBy: string };
    reportLabel: string;
    reportBody: string;
    reportCta: string;
  };

  refusals: Record<RefusalId, { title: string; body: string }>;

  cta: { title: string; body: string; primaryLabel: string; secondaryLabel: string };
}
