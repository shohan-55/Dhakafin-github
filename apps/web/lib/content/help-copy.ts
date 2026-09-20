/**
 * Bilingual contract for `/help` and `/faq` — DF-P2-025.
 * ---------------------------------------------------------------------------
 * One namespace, two pages, because the questions are the same questions. The
 * difference between the surfaces is presentation — search and snippets on
 * `/help`, full answers and structured data on `/faq` — so the copy lives in one
 * place and cannot drift apart between them.
 *
 * Every map is keyed by a registry id from `lib/content/help.ts`, which means a
 * question added to the register without a translation fails the build rather
 * than rendering an empty row. `answer` is a required field on purpose: the
 * acceptance criterion is a 40–60 word answer for every FAQ entry, and a
 * missing one should be a compile error, not a warning.
 */

import type {
  A11yItemId,
  FaqGroupId,
  HelpCategoryId,
  HelpTopicId,
  RelatedRoute,
  ShortcutId,
} from './help';

export interface HelpCopy {
  /** The `/help` surface. */
  meta: { title: string; metaTitle: string; metaDescription: string };

  hero: { eyebrow: string; title: string; lede: string; note: string };

  search: {
    label: string;
    placeholder: string;
    hint: string;
    allCategories: string;
    /** `{count}` is interpolated — one string per plural rule would be worse. */
    resultCount: string;
    empty: string;
    emptyHint: string;
    clear: string;
    /** Shown above the result list; also the list's accessible name. */
    resultsLabel: string;
    moreLabel: string;
  };

  categories: Record<HelpCategoryId, { name: string; lede: string }>;

  /** The fifteen questions. `keywords` is what search matches besides the text. */
  topics: Record<HelpTopicId, { question: string; answer: string; keywords: string[] }>;

  shortcuts: {
    heading: string;
    lede: string;
    keysLabel: string;
    actionLabel: string;
    items: Record<ShortcutId, { keys: string; label: string }>;
    note: string;
  };

  a11y: {
    heading: string;
    lede: string;
    items: Record<A11yItemId, { title: string; body: string }>;
    reportLabel: string;
    reportBody: string;
    reportCta: string;
  };

  cta: { title: string; body: string; primaryLabel: string; secondaryLabel: string };

  /** The `/faq` surface. */
  faq: {
    meta: { title: string; metaTitle: string; metaDescription: string };
    hero: { eyebrow: string; title: string; lede: string };
    groups: Record<FaqGroupId, { name: string; lede: string }>;
    /** One label per allowed related route — never a raw path on screen. */
    related: Record<RelatedRoute, string>;
    questionLabel: string;
    answerLabel: string;
    structuredNote: string;
    helpTitle: string;
    helpBody: string;
    helpLinkLabel: string;
  };
}
