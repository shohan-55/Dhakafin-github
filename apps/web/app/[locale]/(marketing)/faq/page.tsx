import type { Metadata } from 'next';

import { CtaBand, Section } from '@/components/marketing/Sections';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { faqGroupIds, topicsInFaqGroup } from '@/lib/content/help';
import { getDictionary } from '@/lib/dictionary';
import { absoluteUrl, localeHref, resolveLocale, type Locale } from '@/lib/i18n';
import { buildMetadata, SITE_URL } from '@/lib/seo';

/**
 * /faq — DF-P2-025, blueprint F3.
 * ---------------------------------------------------------------------------
 * The reading surface for the same fifteen questions the help centre searches.
 *
 * Answers are rendered **open** — no accordion, no disclosure — because this page
 * exists to be read, quoted and printed: a search engine that has to guess what is
 * behind a `<summary>`, a reader with JavaScript off, and someone who wants to
 * check two answers side by side all get the whole thing. Each answer carries an
 * `id` so `/help` search results can link to the exact paragraph.
 *
 * The FAQPage structured data is built from the same registry, in the same order,
 * so the markup and the JSON cannot describe different things — and
 * `scripts/check-faq.mjs` proves that from the emitted HTML, including the 40–60
 * word rule F3 sets for every answer.
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
    path: '/faq',
    title: dict.help.faq.meta.metaTitle,
    description: dict.help.faq.meta.metaDescription,
  });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale: Locale = resolveLocale((await params).locale);
  const copy = getDictionary(locale).help;

  const helpHref = localeHref(locale, '/help');
  const bookHref = `${localeHref(locale, '/book-consultation')}?intent=faq`;

  /**
   * The schema is built in the order the page renders — group by group, not
   * registry order. A crawler that reads the markup and the JSON side by side
   * should see the same sequence; `scripts/check-faq.mjs` asserts exactly that,
   * index for index.
   */
  const orderedTopics = faqGroupIds.flatMap((groupId) => topicsInFaqGroup(groupId));

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale === 'bn' ? 'bn-BD' : 'en-BD',
    mainEntity: orderedTopics.map((topic) => ({
      '@type': 'Question',
      '@id': `${absoluteUrl(`${localeHref(locale, '/faq')}#${topic.id}`, SITE_URL)}`,
      name: copy.topics[topic.id].question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: copy.topics[topic.id].answer,
      },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        // Registry-ordered, dictionary-answered: the markup below is generated
        // from the same two sources in the same order.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="df-container pb-10 pt-16 sm:pt-24">
        <Breadcrumb
          items={[{ label: 'DhakaFin', href: localeHref(locale, '/') }, { label: copy.faq.hero.eyebrow }]}
          label={copy.faq.hero.eyebrow}
        />

        <div className="mt-8 max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sea-400">
            {copy.faq.hero.eyebrow}
          </p>
          <h1 className="mt-3 text-display font-semibold text-[var(--df-color-text-strong)]">
            {copy.faq.hero.title}
          </h1>
          <p className="mt-6 text-body-lg leading-relaxed text-[var(--df-color-text)]">
            {copy.faq.hero.lede}
          </p>
          <p className="mt-5 border-l-2 border-[var(--df-color-gold)] ps-4 text-xs leading-relaxed text-muted">
            {copy.faq.structuredNote}
          </p>
        </div>
      </section>

      {/* ── The fifteen, grouped ─────────────────────────────────────────── */}
      {faqGroupIds.map((groupId, index) => (
        <Section
          key={groupId}
          id={groupId}
          title={copy.faq.groups[groupId].name}
          lede={copy.faq.groups[groupId].lede}
          tone={index % 2 === 0 ? 'deep' : 'base'}
        >
          <dl className="space-y-8">
            {topicsInFaqGroup(groupId).map((topic) => (
              <div key={topic.id} id={topic.id} className="scroll-mt-24">
                <dt>
                  <h3
                    data-df-question={topic.id}
                    className="text-h3 font-semibold text-[var(--df-color-text-strong)]"
                  >
                    {copy.topics[topic.id].question}
                  </h3>
                </dt>
                <dd className="mt-3">
                  <p
                    data-df-answer={topic.id}
                    className="max-w-3xl text-body leading-relaxed text-muted"
                  >
                    {copy.topics[topic.id].answer}
                  </p>

                  {topic.related.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                      {topic.related.map((href) => (
                        <li key={href}>
                          <a
                            href={href}
                            className="text-sm text-sea-300 no-underline hover:text-sea-200"
                          >
                            {copy.faq.related[href]}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </Section>
      ))}

      {/* ── Back into the help centre ────────────────────────────────────── */}
      <Section id="help" title={copy.faq.helpTitle} tone="deep" narrow>
        <p className="max-w-3xl text-body leading-relaxed text-muted">{copy.faq.helpBody}</p>
        <div className="mt-6">
          <ButtonLink href={helpHref} variant="secondary">
            {copy.faq.helpLinkLabel}
          </ButtonLink>
        </div>
      </Section>

      <CtaBand
        title={copy.cta.title}
        body={copy.cta.body}
        primary={{ label: copy.cta.primaryLabel, href: `${localeHref(locale, '/contact')}?intent=faq` }}
        secondary={{ label: copy.faq.related['/book-consultation'], href: bookHref }}
      />
    </div>
  );
}
