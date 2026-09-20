import type { ServiceSlug } from './services';

/**
 * The bilingual copy contract for the service ecosystem.
 * ---------------------------------------------------------------------------
 * Every field here is a plain string or an array of plain strings. No JSX, no
 * functions, no imports. That constraint is what makes this content relocatable:
 * the same shape becomes a `jsonb` translatable column on the `Service` model
 * in Filament, and the site keeps working unchanged.
 *
 * Both `en/services.ts` and `bn/services.ts` are annotated `ServiceCopy`, so a
 * field added in English without a Bengali counterpart is a `tsc` failure. The
 * blueprint's acceptance criterion for §5.6.4 is "fully written in English with
 * Bangla versions" — this type is how that stays true after this session.
 *
 * Field guidance is in the doc comments. They are not decoration: each one
 * encodes a rule from §5.6.3, and a field that ignores its rule is worse than a
 * missing field, because it looks finished.
 */

export interface NamedItem {
  name: string;
  /** One line on what it actually is. Never a repeat of `name`. */
  note: string;
}

export interface ChecklistGroupCopy {
  heading: string;
  items: string[];
}

export interface WorkflowStepCopy {
  title: string;
  /** What DhakaFin does. */
  weDo: string;
  /** What we need from the client. Stated plainly, because this is where clients stall. */
  weNeed: string;
  timeline: string;
}

export interface FaqCopy {
  id: string;
  question: string;
  answer: string;
}

/** The 14 blocks of §5.6.3, in order. */
export interface ServiceCopy {
  /** Service name, as a client would say it. */
  name: string;
  /** One line: the outcome, not the activity. "Numbers you can act on", not "bookkeeping". */
  outcome: string;
  metaTitle: string;
  /** 150–160 characters. Enforced by the SEO gate. */
  metaDescription: string;

  hero: {
    /** Self-qualifying price band, e.g. "from ৳8,000 / month". */
    priceBand: string;
    /** Who this is for, as chips. Four maximum — more is a filter, not a qualifier. */
    chips: string[];
    /** Alt-text-style description of the motif and what it depicts. */
    visualCaption: string;
  };

  problem: {
    title: string;
    lede: string;
    /** Each item must be a sentence a client has actually said out loud. */
    items: string[];
  };

  included: {
    title: string;
    lede: string;
    groups: ChecklistGroupCopy[];
    /** Mandatory. An honest boundary stated up front prevents the worst conversation. */
    notIncluded: { title: string; items: string[] };
  };

  who: {
    title: string;
    lede: string;
    businessTypes: string[];
    /** Turnover bands — the primary qualifier. */
    turnoverBands: string[];
    /** Trigger conditions: "if X is true, you need this". */
    triggers: string[];
  };

  workflow: {
    title: string;
    lede: string;
    labels: { weDo: string; weNeed: string; timeline: string };
    steps: WorkflowStepCopy[];
  };

  deliverables: {
    title: string;
    lede: string;
    items: NamedItem[];
    /** Copy for the redacted sample affordance. */
    sampleLabel: string;
    sampleNote: string;
  };

  sla: {
    title: string;
    lede: string;
    rows: { label: string; value: string }[];
  };

  pricing: {
    title: string;
    lede: string;
    bands: { name: string; range: string; includes: string }[];
    /** What moves the price. Stated so a client can self-qualify before calling. */
    drivers: string[];
    footnote: string;
  };

  compliance: {
    title: string;
    lede: string;
    /** Fallback shown while the compliance register is offline (Phase 3). */
    verifyLabel: string;
  };

  proof: {
    title: string;
    /** Sample-data badge — mandatory while these are illustrative (demo-integrity rule). */
    sampleBadge: string;
    caseStudy: {
      context: string;
      action: string;
      result: string;
      /** The headline number. Rendered in the numeric face, never in prose. */
      metric: string;
      metricLabel: string;
    };
    testimonial: { quote: string; attribution: string };
  };

  faq: { title: string; lede: string; items: FaqCopy[] };

  cta: {
    title: string;
    body: string;
    primary: string;
    secondary: string;
    footnote: string;
  };
}

export interface ServiceHubCopy {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lede: string;
  chips: { label: string }[];
  /** Ecosystem section. */
  ecosystem: {
    title: string;
    lede: string;
    /** Legend labels for the two edge kinds. */
    legendPrimary: string;
    legendSupport: string;
    /** Screen-reader list heading — acceptance #3 requires a non-visual version. */
    listLabel: string;
    /** Mobile accordion + desktop node preview. */
    problemLabel: string;
    deliverablesLabel: string;
    priceLabel: string;
    whoLabel: string;
    openLabel: string;
  };
  groups: { foundations: string; control: string; growth: string };
  groupsLede: { foundations: string; control: string; growth: string };
  /** "Choose by problem / industry / diagnostic" band. */
  chooseBy: {
    title: string;
    problem: string;
    problemHint: string;
    industry: string;
    industryHint: string;
    diagnostic: string;
    diagnosticHint: string;
  };
  cta: {
    title: string;
    body: string;
    primary: string;
    secondary: string;
    footnote: string;
  };
}

export type ServicesCopy = ServiceHubCopy & {
  /** Ordered by `serviceOrder` at render time; keyed for O(1) detail lookup. */
  items: Record<ServiceSlug, ServiceCopy>;
};
