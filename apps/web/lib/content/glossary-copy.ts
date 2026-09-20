/**
 * Bilingual contract for `/glossary` — DF-P2-025.
 * ---------------------------------------------------------------------------
 * Each entry carries both languages of its own name: the page's language comes
 * first and the other one sits beside it, greyed. On the Bengali page that means
 * the Bengali term leads and the Latin one follows — which is how the term is
 * actually said in a Dhaka accounting office, and the opposite of what a
 * machine-translated glossary does.
 *
 * `definition` carries no figures by design. Rates, slabs and thresholds belong
 * on the rate pages where each one arrives with its source; a glossary that
 * repeats them is a second place to be wrong.
 */

import type { GlossaryAuthorityId, GlossaryCategoryId, GlossaryTermId } from './glossary';

export interface GlossaryCopy {
  meta: { title: string; metaTitle: string; metaDescription: string };

  hero: { eyebrow: string; title: string; lede: string; note: string };

  /** How to read an entry — the two-line legend above the first category. */
  legend: { heading: string; bothLanguages: string; scoped: string };

  categories: Record<GlossaryCategoryId, { name: string; lede: string }>;
  authorities: Record<GlossaryAuthorityId, string>;

  terms: Record<
    GlossaryTermId,
    {
      /** The term in this page's language. */
      term: string;
      /** The same term in the other language, shown beside it. */
      alt: string;
      definition: string;
      /** Label for the link to the page where the term is in use. */
      where: string;
    }
  >;

  labels: { authority: string; alsoKnownAs: string; index: string };

  cta: { title: string; body: string; primaryLabel: string; secondaryLabel: string };
}
