import type { Metadata } from 'next';

import { CtaBand, Section } from '@/components/marketing/Sections';
import { HelpSearch, type HelpSearchItem } from '@/components/help/HelpSearch';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { TableWrap, TH, TR, TD } from '@/components/ui/Table';
import { helpCategoryIds, helpTopics, searchableHaystack, snippetOf } from '@/lib/content/help';
import { getDictionary } from '@/lib/dictionary';
import { localeHref, resolveLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';

/**
 * /help — DF-P2-025, blueprint F3.
 * ---------------------------------------------------------------------------
 * The searchable help centre: six categories, one search field over the fifteen
 * questions, the keyboard shortcuts we actually ship, and the accessibility
 * statement.
 *
 * Three decisions worth stating:
 *
 *   · **Answers live on `/faq`, not here.** Search results show the question, its
 *     category and the opening of the answer, then link to the anchored answer.
 *     One canonical copy of each answer means Ctrl+F finds it once, a translation
 *     cannot drift, and an AI reader that follows the link gets the whole thing.
 *   · **The search island contains its own payload.** All fifteen questions are
 *     in the initial HTML, so the page is useful with JavaScript off and nothing
 *     about a search is sent anywhere — the filter runs in the browser over
 *     markup that is already on the screen.
 *   · **The shortcut list is short because it is true.** `/`, `Esc` and `Tab` are
 *     exactly what works today. The site-wide command palette is a later phase
 *     and is described as such; a promised shortcut that does nothing would be
 *     the same failure as a rate without a source.
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
    path: '/help',
    title: dict.help.meta.metaTitle,
    description: dict.help.meta.metaDescription,
  });
}

export default async function HelpPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale: Locale = resolveLocale((await params).locale);
  const copy = getDictionary(locale).help;

  const faqHref = localeHref(locale, '/faq');
  const contactHref = `${localeHref(locale, '/contact')}?intent=accessibility`;
  const categories = helpCategoryIds.map((id) => ({
    id,
    name: copy.categories[id].name,
    lede: copy.categories[id].lede,
    count: helpTopics.filter((topic) => topic.category === id).length,
  }));

  const nameOf = (id: string) => categories.find((c) => c.id === id)?.name ?? id;

  const items: HelpSearchItem[] = helpTopics.map((topic) => {
    const text = copy.topics[topic.id];
    return {
      id: topic.id,
      categoryId: topic.category,
      categoryName: nameOf(topic.category),
      question: text.question,
      snippet: snippetOf(text.answer),
      href: `${faqHref}#${topic.id}`,
      haystack: searchableHaystack(text.question, text.answer, text.keywords),
    };
  });

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="df-container pb-12 pt-16 sm:pt-24">
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
          <p className="mt-5 border-l-2 border-[var(--df-color-sea-400)] ps-4 text-sm leading-relaxed text-muted">
            {copy.hero.note}
          </p>
        </div>
      </section>

      {/* ── Search ───────────────────────────────────────────────────────── */}
      <Section id="search" tone="deep" narrow>
        <HelpSearch copy={copy.search} items={items} categories={categories} />
      </Section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <Section id="categories" title={copy.search.allCategories}>
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id}>
              <div className="h-full rounded-xl border border-[var(--df-color-border-quiet)] bg-void/30 p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
                    {category.name}
                  </h3>
                  <span className="df-num text-xs text-muted">
                    {copy.search.resultCount.replace('{count}', String(category.count))}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{category.lede}</p>
                <ul className="mt-4 space-y-2">
                  {helpTopics
                    .filter((topic) => topic.category === category.id)
                    .map((topic) => (
                      <li key={topic.id}>
                        <a
                          href={`${faqHref}#${topic.id}`}
                          className="text-sm text-[var(--df-color-text)] no-underline hover:text-sea-300"
                        >
                          {copy.topics[topic.id].question}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Shortcuts ────────────────────────────────────────────────────── */}
      <Section id="shortcuts" title={copy.shortcuts.heading} lede={copy.shortcuts.lede} tone="deep">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
          <TableWrap caption={copy.shortcuts.heading}>
            <thead>
              <TR>
                <TH scope="col" className="df-num w-24 px-4 py-3 text-start text-xs uppercase tracking-[0.1em] text-muted">
                  {copy.shortcuts.keysLabel}
                </TH>
                <TH scope="col" className="px-4 py-3 text-start text-xs uppercase tracking-[0.1em] text-muted">
                  {copy.shortcuts.actionLabel}
                </TH>
              </TR>
            </thead>
            <tbody>
              <TR>
                <TD className="df-num text-sm text-sea-300">/</TD>
                <TD className="text-sm text-[var(--df-color-text)]">
                  {copy.shortcuts.items['focus-search'].label}
                </TD>
              </TR>
              <TR>
                <TD className="df-num text-sm text-sea-300">Esc</TD>
                <TD className="text-sm text-[var(--df-color-text)]">
                  {copy.shortcuts.items['close-overlay'].label}
                </TD>
              </TR>
              <TR>
                <TD className="df-num text-sm text-sea-300">Tab</TD>
                <TD className="text-sm text-[var(--df-color-text)]">
                  {copy.shortcuts.items['tab-order'].label}
                </TD>
              </TR>
            </tbody>
          </TableWrap>

          <p className="rounded-xl border border-dashed border-[var(--df-color-border-strong)] bg-void/30 p-5 text-xs leading-relaxed text-muted">
            {copy.shortcuts.note}
          </p>
        </div>
      </Section>

      {/* ── Accessibility statement ──────────────────────────────────────── */}
      <Section id="accessibility" title={copy.a11y.heading} lede={copy.a11y.lede}>
        <ul className="grid gap-5 md:grid-cols-2">
          {(['contrast', 'motion', 'keyboard', 'numerals'] as const).map((id) => (
            <li key={id}>
              <div className="h-full rounded-xl border border-[var(--df-color-border-quiet)] bg-surface1 p-5">
                <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
                  {copy.a11y.items[id].title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{copy.a11y.items[id].body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-[var(--df-color-border-quiet)] bg-void/30 p-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[var(--df-color-text-strong)]">
              {copy.a11y.reportLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{copy.a11y.reportBody}</p>
          </div>
          <ButtonLink href={contactHref} variant="secondary">
            {copy.a11y.reportCta}
          </ButtonLink>
        </div>
      </Section>

      <CtaBand
        title={copy.cta.title}
        body={copy.cta.body}
        primary={{ label: copy.cta.primaryLabel, href: `${localeHref(locale, '/contact')}?intent=help` }}
        secondary={{ label: copy.cta.secondaryLabel, href: faqHref }}
      />
    </div>
  );
}
