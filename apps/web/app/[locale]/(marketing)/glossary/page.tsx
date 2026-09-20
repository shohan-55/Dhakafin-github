import type { Metadata } from 'next';

import { CtaBand, Section } from '@/components/marketing/Sections';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import {
  glossaryCategoryIds,
  termsInCategory,
  type GlossaryCategoryId,
  type GlossaryTermId,
} from '@/lib/content/glossary';
import { getDictionary } from '@/lib/dictionary';
import { localeHref, resolveLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';

/**
 * /glossary — DF-P2-025, blueprint F3.
 * ---------------------------------------------------------------------------
 * Twenty-five terms, both languages, five categories. Three decisions:
 *
 *   · **The term appears in both languages on every entry**, with this page's
 *     language first. On the Bengali page that means the Bengali term leads and
 *     the Latin one follows — which is how the term is said in a Dhaka
 *     accounting office, and the opposite of what a translated glossary does.
 *   · **No figures.** A definition says what a term means; the rate, slab or
 *     threshold behind it lives on the page that publishes it with its source.
 *     A glossary that repeats a rate is a second place to be wrong.
 *   · **Static, with an index.** No search island: 25 entries fit on one page,
 *     and the index at the top is faster than any filter, works with JavaScript
 *     off, and gives each term a URL someone can send to a colleague.
 */

export const generateStaticParams = () => ['en', 'bn'].map((locale) => ({ locale }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: '/glossary',
    title: dict.glossary.meta.metaTitle,
    description: dict.glossary.meta.metaDescription,
  });
}

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale: Locale = resolveLocale((await params).locale);
  const copy = getDictionary(locale).glossary;

  const helpHref = localeHref(locale, '/help');
  const contactHref = `${localeHref(locale, '/contact')}?intent=glossary`;

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="df-container pb-10 pt-16 sm:pt-24">
        <Breadcrumb
          items={[{ label: 'DhakaFin', href: localeHref(locale, '/') }, { label: copy.hero.eyebrow }]}
          label={copy.hero.eyebrow}
        />

        <div className="mt-8 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sea-400">
            {copy.hero.eyebrow}
          </p>
          <h1 className="mt-3 text-display font-semibold text-[var(--df-color-text-strong)]">
            {copy.hero.title}
          </h1>
          <p className="mt-6 text-body-lg leading-relaxed text-[var(--df-color-text)]">
            {copy.hero.lede}
          </p>
          <p className="mt-5 border-l-2 border-[var(--df-color-gold)] ps-4 text-sm leading-relaxed text-muted">
            {copy.hero.note}
          </p>
        </div>
      </section>

      {/* ── How to read an entry ─────────────────────────────────────────── */}
      <Section id="legend" title={copy.legend.heading} tone="deep">
        <ul className="grid gap-5 md:grid-cols-2">
          <li className="rounded-xl border border-[var(--df-color-border-quiet)] bg-void/30 p-5">
            <p className="text-sm leading-relaxed text-muted">{copy.legend.bothLanguages}</p>
          </li>
          <li className="rounded-xl border border-[var(--df-color-border-quiet)] bg-void/30 p-5">
            <p className="text-sm leading-relaxed text-muted">{copy.legend.scoped}</p>
          </li>
        </ul>

        {/* The index: every term, in this page's language, linking to its entry. */}
        <nav aria-label={copy.labels.index} className="mt-8">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            {copy.labels.index}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {glossaryCategoryIds.flatMap((category) =>
              termsInCategory(category).map((term) => (
                <li key={term.id}>
                  <a
                    href={`#${term.id}`}
                    className="text-sm text-[var(--df-color-text)] no-underline hover:text-sea-300"
                  >
                    {copy.terms[term.id as GlossaryTermId].term}
                  </a>
                </li>
              )),
            )}
          </ul>
        </nav>
      </Section>

      {/* ── Terms by category ────────────────────────────────────────────── */}
      {glossaryCategoryIds.map((category, index) => (
        <Section
          key={category}
          id={category}
          title={copy.categories[category as GlossaryCategoryId].name}
          lede={copy.categories[category as GlossaryCategoryId].lede}
          tone={index % 2 === 0 ? 'base' : 'deep'}
        >
          <dl className="grid gap-5 lg:grid-cols-2">
            {termsInCategory(category).map((term) => {
              const entry = copy.terms[term.id as GlossaryTermId];
              const authority = term.authority ? copy.authorities[term.authority] : null;
              return (
                <div key={term.id} id={term.id} className="h-full scroll-mt-24">
                  <div className="h-full rounded-xl border border-[var(--df-color-border-quiet)] bg-surface1 p-5">
                    <dt>
                      <span className="text-base font-semibold text-[var(--df-color-text-strong)]">
                        {entry.term}
                      </span>
                      <span className="mt-1 block text-xs text-muted">
                        {copy.labels.alsoKnownAs}: {entry.alt}
                      </span>
                    </dt>
                    <dd className="mt-3">
                      <p className="text-sm leading-relaxed text-muted">{entry.definition}</p>

                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                        {authority ? (
                          <span className="text-[var(--df-color-muted)]">
                            {copy.labels.authority}: <span className="text-sea-300">{authority}</span>
                          </span>
                        ) : null}
                        {term.href ? (
                          <a
                            href={localeHref(locale, term.href)}
                            className="text-sea-300 no-underline hover:text-sea-200"
                          >
                            {entry.where} →
                          </a>
                        ) : null}
                      </div>
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </Section>
      ))}

      <CtaBand
        title={copy.cta.title}
        body={copy.cta.body}
        primary={{ label: copy.cta.primaryLabel, href: contactHref }}
        secondary={{ label: copy.cta.secondaryLabel, href: helpHref }}
      />
    </div>
  );
}
