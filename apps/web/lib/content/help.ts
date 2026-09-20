/**
 * Help centre and FAQ — structural registry (DF-P2-025).
 * ---------------------------------------------------------------------------
 * One register of questions, two surfaces, no second copy of anything.
 *
 *   /help  — the searchable centre: categories, search, shortcuts, the
 *            accessibility statement. It shows questions and a snippet.
 *   /faq   — the reading surface: the same questions grouped by theme with
 *            their full answers, and the FAQPage structured data.
 *
 * The acceptance line for the second one is "answers 40–60 words for AEO", so
 * the answers are written to that length and `scripts/check-faq.mjs` counts the
 * words in the *emitted* HTML rather than trusting the author.
 *
 * Rules held here:
 *   · `related` points only at routes that exist or that the route register
 *     already knows about (`scripts/planned-routes.mjs`). A help page that links
 *     into the void is worse than one that says "not built yet".
 *   · Questions describe this site and this practice — nothing here is a claim
 *     about Bangladeshi law, so nothing here needs a rate source.
 */

export const helpCategoryIds = [
  'getting-started',
  'tools',
  'services-and-pricing',
  'compliance',
  'documents',
  'platform',
] as const;
export type HelpCategoryId = (typeof helpCategoryIds)[number];

export const faqGroupIds = [
  'working-together',
  'numbers-and-tools',
  'rates-and-deadlines',
  'data-and-platform',
] as const;
export type FaqGroupId = (typeof faqGroupIds)[number];

export const shortcutIds = ['focus-search', 'close-overlay', 'tab-order'] as const;
export type ShortcutId = (typeof shortcutIds)[number];

export const a11yIds = ['contrast', 'motion', 'keyboard', 'numerals'] as const;
export type A11yItemId = (typeof a11yIds)[number];

/**
 * Every route a help answer may link to, as a closed set.
 *
 * Closed on purpose: the label for each one lives in the dictionary (a route is
 * not a title), and `tsc` will not let a topic link somewhere that has no label —
 * so the FAQ cannot grow a link that reads as a raw path.
 */
export const relatedRoutes = [
  '/about',
  '/book-consultation',
  '/contact',
  '/editorial-policy',
  '/pricing',
  '/privacy',
  '/rates/tds',
  '/rates/vat',
  '/security',
  '/services',
  '/services/accounting-bookkeeping',
  '/services/cost-efficiency-internal-control',
  '/tools',
  '/tools/income-tax-calculator',
  '/tools/tds-calculator',
  '/tools/vat-calculator',
] as const;
export type RelatedRoute = (typeof relatedRoutes)[number];

export interface HelpTopic {
  readonly id: string;
  readonly category: HelpCategoryId;
  /** Which `/faq` group it reads under. Every topic appears on both surfaces. */
  readonly faqGroup: FaqGroupId;
  /** Live routes, or routes the register already carries as pending. */
  readonly related: readonly RelatedRoute[];
}

export const helpTopics = [
  {
    id: 'first-consultation',
    category: 'getting-started',
    faqGroup: 'working-together',
    related: ['/book-consultation', '/contact'],
  },
  {
    id: 'what-to-send',
    category: 'getting-started',
    faqGroup: 'working-together',
    related: ['/services/accounting-bookkeeping', '/contact'],
  },
  {
    id: 'response-times',
    category: 'getting-started',
    faqGroup: 'working-together',
    related: ['/contact'],
  },
  {
    id: 'tool-cost',
    category: 'tools',
    faqGroup: 'numbers-and-tools',
    related: ['/tools'],
  },
  {
    id: 'tool-numerals',
    category: 'tools',
    faqGroup: 'numbers-and-tools',
    related: ['/tools/tds-calculator', '/tools/vat-calculator'],
  },
  {
    id: 'tool-unavailable-rate',
    category: 'tools',
    faqGroup: 'numbers-and-tools',
    related: ['/rates/tds', '/tools/income-tax-calculator'],
  },
  {
    id: 'starting-band',
    category: 'services-and-pricing',
    faqGroup: 'numbers-and-tools',
    related: ['/pricing', '/services'],
  },
  {
    id: 'vat-included',
    category: 'services-and-pricing',
    faqGroup: 'numbers-and-tools',
    related: ['/pricing'],
  },
  {
    id: 'service-exclusions',
    category: 'services-and-pricing',
    faqGroup: 'working-together',
    related: ['/services/cost-efficiency-internal-control', '/pricing'],
  },
  {
    id: 'rate-verification',
    category: 'compliance',
    faqGroup: 'rates-and-deadlines',
    related: ['/editorial-policy', '/rates/tds'],
  },
  {
    id: 'rate-change-alerts',
    category: 'compliance',
    faqGroup: 'rates-and-deadlines',
    related: ['/contact', '/rates/vat'],
  },
  {
    id: 'data-access',
    category: 'documents',
    faqGroup: 'data-and-platform',
    related: ['/security', '/contact'],
  },
  {
    id: 'record-retention',
    category: 'documents',
    faqGroup: 'data-and-platform',
    related: ['/security', '/privacy'],
  },
  {
    id: 'platform-availability',
    category: 'platform',
    faqGroup: 'data-and-platform',
    related: ['/pricing', '/about'],
  },
  {
    id: 'account-required',
    category: 'platform',
    faqGroup: 'data-and-platform',
    related: ['/tools', '/about'],
  },
] as const satisfies readonly HelpTopic[];

export type HelpTopicId = (typeof helpTopics)[number]['id'];

/**
 * One entry of the register, with its id kept as a literal type.
 *
 * The distinction matters: `HelpTopic` describes an entry so the list can be
 * checked, but a function that returns `HelpTopic[]` erases the ids back to
 * `string`, and then `copy.topics[topic.id]` is an implicit-any lookup. Keeping
 * the literal type is what makes a missing translation a compile error at the
 * point of use.
 */
export type HelpTopicEntry = (typeof helpTopics)[number];

export function topicsInCategory(id: HelpCategoryId): HelpTopicEntry[] {
  return helpTopics.filter((topic) => topic.category === id);
}

export function topicsInFaqGroup(id: FaqGroupId): HelpTopicEntry[] {
  return helpTopics.filter((topic) => topic.faqGroup === id);
}

/**
 * The opening of an answer, for search results. Sixteen words is enough to show
 * what the answer is about without becoming a second, shorter version of it —
 * which is the failure mode this whole registry exists to avoid.
 */
export function snippetOf(answer: string, words = 16): string {
  const parts = answer.split(/\s+/);
  if (parts.length <= words) return answer;
  return `${parts.slice(0, words).join(' ')} …`;
}

/** Case-folded corpus for the client-side filter: question + answer + keywords. */
export function searchableHaystack(question: string, answer: string, keywords: string[]): string {
  return `${question} ${answer} ${keywords.join(' ')}`;
}

export function helpTopic(id: HelpTopicId): HelpTopic {
  const topic = helpTopics.find((t) => t.id === id);
  if (!topic) throw new Error(`Unknown help topic: ${id}`);
  return topic;
}
