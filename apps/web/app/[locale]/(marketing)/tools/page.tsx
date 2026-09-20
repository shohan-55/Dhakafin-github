import type { Metadata } from 'next';

import { LocaleLink } from '@/components/system/LocaleLink';
import { Reveal } from '@/components/system/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { toolCategories, toolOrder, tools as toolRegistry } from '@/lib/content/tools';
import { getDictionary } from '@/lib/dictionary';
import { localeHref, resolveLocale, type Locale } from '@/lib/i18n';
import { getToolDefinition } from '@/lib/tools/definitions';
import { formatBDT } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

/**
 * Tools hub — DF-P2-011, blueprint §5.5.
 * ---------------------------------------------------------------------------
 * Grouped by the question a reader is asking rather than by how the maths is
 * implemented, because nobody arrives looking for "a ratio calculation". The
 * three tools whose calculators are held back are shown as clearly as the live
 * ones, with the reason stated on the card: hiding them would make the hub look
 * complete while a visitor's specific question went unanswered, and the page
 * behind each is still worth reading.
 */

export const generateStaticParams = () =>
  ['en', 'bn'].map((locale) => ({ locale }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: '/tools',
    title: dict.tools.meta.metaTitle,
    description: dict.tools.meta.metaDescription,
  });
}

export default async function ToolsHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale: Locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const copy = dict.tools;
  const numerals = locale === 'bn' ? 'bn' : 'latin';

  return (
    <main id="main" className="df-container py-16 sm:py-24">
      <Breadcrumb
        items={[
          { label: 'DhakaFin', href: localeHref(locale, '/') },
          { label: copy.hub.toolsNavLabel },
        ]}
        label={copy.hub.toolsNavLabel}
      />

      <header className="mt-8 max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sea-400">
          {copy.hero.eyebrow}
        </p>
        <h1 className="mt-3 text-h1 font-semibold text-[var(--df-color-text-strong)]">
          {copy.hero.title}
        </h1>
        <p className="mt-5 text-body-lg leading-relaxed text-muted">{copy.hero.lead}</p>
      </header>

      <div className="mt-16 max-w-3xl">
        <h2 className="text-h3 font-semibold text-[var(--df-color-text-strong)]">
          {copy.index.heading}
        </h2>
        <p className="mt-2 text-sm text-muted">{copy.index.lead}</p>
      </div>

      {toolCategories.map((category, categoryIndex) => {
        const entries = toolOrder.filter((t) => t.category === category);
        const categoryCopy = copy.categories[category];

        return (
          <section key={category} className="mt-16" aria-labelledby={`tools-${category}`}>
            <Reveal index={categoryIndex}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-[var(--df-color-border-quiet)] pb-3">
                <h2
                  id={`tools-${category}`}
                  className="text-h3 font-semibold text-[var(--df-color-text-strong)]"
                >
                  {categoryCopy.label}
                </h2>
                <p className="text-sm text-muted">{categoryCopy.blurb}</p>
              </div>
            </Reveal>

            <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {entries.map((entry, index) => {
                const toolCopy = copy.tools[entry.slug];
                const definition = getToolDefinition(entry.slug);
                const pending = definition.pending !== null;

                return (
                  <Reveal as="li" key={entry.slug} index={index}>
                    <Card
                      tone="quiet"
                      padding="lg"
                      interactive
                      className="flex h-full flex-col"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="df-num text-xs font-semibold text-[var(--df-color-muted-2)]">
                          {String(entry.order).padStart(2, '0')}
                        </span>
                        {pending ? (
                          <Badge tone="regulatory" glyph="◷">
                            {copy.index.pendingBadge}
                          </Badge>
                        ) : null}
                      </div>

                      <h3 className="mt-4 text-base font-semibold text-[var(--df-color-text-strong)]">
                        {toolCopy.name}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                        {toolCopy.tagline}
                      </p>

                      {/* The example figure is the fastest way to show what a tool
                          is for. It is a worked example, not a claim about anyone. */}
                      <p className="df-num mt-5 text-xs text-[var(--df-color-muted-2)]">
                        {toolCopy.examples.items[0]?.title ?? formatBDT(entry.example.amount, { numerals })}
                      </p>

                      <LocaleLink
                        locale={locale}
                        href={`/tools/${entry.slug}`}
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-sea-300 underline-offset-4 hover:underline"
                      >
                        {copy.index.openLabel}
                        <span aria-hidden="true">→</span>
                      </LocaleLink>
                    </Card>
                  </Reveal>
                );
              })}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
