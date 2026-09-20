import type { Metadata } from 'next';

import { LeakageEstimator } from '@/components/cost-efficiency/LeakageEstimator';
import { PillarGrid, resolvePillarBenchmarks } from '@/components/cost-efficiency/PillarGrid';
import { CtaBand, FaqSection, Section } from '@/components/marketing/Sections';
import { LocaleLink } from '@/components/system/LocaleLink';
import { Reveal } from '@/components/system/Reveal';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { estimatorIndustries } from '@/lib/content/cost-efficiency';
import type { CostEfficiencyCopy } from '@/lib/content/cost-efficiency-copy';
import { industryHref, industryOrder } from '@/lib/content/industries';
import { services as serviceRegistry } from '@/lib/content/services';
import { toolHref } from '@/lib/content/tools';
import { getDictionary } from '@/lib/dictionary';
import { localeHref, resolveLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';

/**
 * /cost-efficiency — DF-P2-044, blueprint §5.9.
 * ---------------------------------------------------------------------------
 * The six beats of §5.9.1, in order, as sections. The page is statically
 * prerendered in both locales; everything interactive lives in the estimator,
 * which is the only client component on the page.
 *
 * The two things this page is judged on, both stated in the open rather than
 * buried in a footnote:
 *
 *   · **No savings claim.** The estimator's range is withheld with the reason
 *     and the list of unpublished rows, and a visible method-and-limitations
 *     block carries `data-df-disclosure` so `scripts/check-estimate.mjs` can
 *     assert it reached the HTML in both languages.
 *   · **Complete without motion or WebGL.** Every diagram is SVG drawn from
 *     literal coordinates; the only animation is a width transition on a CSS bar,
 *     wrapped in `motion-safe:` so it disappears when motion is off (§5.9.4
 *     criterion 4).
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
    path: '/cost-efficiency',
    title: dict.costEfficiency.meta.metaTitle,
    description: dict.costEfficiency.meta.metaDescription,
  });
}

export default async function CostEfficiencyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale: Locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const copy = dict.costEfficiency;
  const { industries } = dict.industries;

  const industryNames = Object.fromEntries(
    estimatorIndustries.map((id) => [
      id,
      id === 'other' ? (locale === 'bn' ? 'অন্য কিছু' : 'Something else') : industries[id].name,
    ]),
  ) as Record<(typeof estimatorIndustries)[number], string>;

  const resolutions = resolvePillarBenchmarks('other');

  const bookHref = `${localeHref(locale, '/book-consultation')}?service=cost-efficiency-internal-control&intent=cost-review`;
  const quoteHref = `${localeHref(locale, '/contact')}?intent=cost-review-quote`;
  const checklistHref = `${localeHref(locale, '/contact')}?intent=checklist&topic=cost-efficiency`;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faqs.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Cost efficiency review',
    description: copy.meta.metaDescription,
    serviceType: 'Cost efficiency review',
    areaServed: { '@type': 'Country', name: 'Bangladesh' },
  };

  /** The service this page belongs to, so the ecosystem keeps its links. */
  const parentService = serviceRegistry['cost-efficiency-internal-control'];

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {/* ── Beat 1 — the headline ────────────────────────────────────────── */}
      <section className="df-container pb-14 pt-16 sm:pt-24">
        <div className="max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sea-400">
            {copy.hero.eyebrow}
          </p>
          <h1 className="mt-3 text-display font-semibold text-[var(--df-color-text-strong)]">
            {copy.hero.headline}
          </h1>
          <p className="mt-6 max-w-3xl text-body-lg leading-relaxed text-[var(--df-color-text)]">
            {copy.hero.sub}
          </p>
          <p className="mt-4 max-w-3xl border-l-2 border-[var(--df-color-sea-400)] ps-4 text-sm leading-relaxed text-muted">
            {copy.hero.premise}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#estimate" size="lg" magnetic>
              {copy.estimator.heading}
            </ButtonLink>
            <ButtonLink href={bookHref} variant="secondary" size="lg">
              {copy.delivery.bookLabel}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── Beats 2 and 3 — the visible costs, then the drift ────────────── */}
      <Section id="visible-costs" eyebrow={copy.beats['visible-costs'].marker} title={copy.beats['visible-costs'].title} lede={copy.beats['visible-costs'].lead} tone="deep">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start">
          <StructureSchematic copy={copy} />
          <div>
            <h3 className="text-h4 font-semibold text-[var(--df-color-text-strong)]">
              {copy.beats.drift.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--df-color-text)]">
              {copy.beats.drift.lead}
            </p>
            <Badge tone="regulatory" glyph="◷" className="mt-5">
              {copy.method.statusUnverified}
            </Badge>
          </div>
        </div>
      </Section>

      {/* ── Beat 4 — the five surfaces ───────────────────────────────────── */}
      <Section id="pillars" eyebrow={copy.beats.leakage.marker} title={copy.beats.leakage.title} lede={copy.beats.leakage.lead}>
        <PillarGrid copy={copy} resolutions={resolutions} />
      </Section>

      {/* ── Beat 5 — the estimator ───────────────────────────────────────── */}
      <Section
        id="estimate"
        eyebrow={copy.beats['profit-impact'].marker}
        title={copy.estimator.heading}
        lede={copy.beats['profit-impact'].lead}
        tone="deep"
      >
        <LeakageEstimator
          copy={copy}
          locale={locale}
          industryNames={industryNames}
          bookHref={bookHref}
          quoteHref={quoteHref}
          checklistHref={checklistHref}
        />

        {/*
          Method and limitations. Required by §5.9.2's guardrails and §5.9.4
          criterion 1, and marked so the gate can assert it was emitted — a
          disclosure that only exists in a component's props is not a disclosure.
        */}
        <div
          id="method-and-limitations"
          data-df-disclosure="cost-efficiency"
          className="mt-10 rounded-2xl border border-dashed border-[var(--df-color-border-strong)] bg-void/30 p-6"
        >
          <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
            {copy.disclosure.heading}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--df-color-text)]">
            {copy.disclosure.body}
          </p>
          <ul className="mt-4 space-y-2 text-xs leading-relaxed text-muted">
            <li>{copy.disclosure.numbersNote}</li>
            <li>{copy.disclosure.privacyNote}</li>
            <li>{copy.method.summary.replace('{published}', '0').replace('{required}', '20')}</li>
          </ul>
        </div>
      </Section>

      {/* ── Beat 6 — what a review delivers ──────────────────────────────── */}
      <Section id="delivery" eyebrow={copy.beats.delivery.marker} title={copy.delivery.heading} lede={copy.delivery.lead}>
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {copy.delivery.items.map((item, index) => (
            <Reveal as="li" key={item.title} index={index}>
              <Card tone="context" padding="lg" className="h-full">
                <span className="df-num text-[11px] font-semibold tracking-[0.14em] text-[var(--df-color-muted-2)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-base font-semibold text-[var(--df-color-text-strong)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <FaqSection
        id="faq"
        title={copy.faqs.heading}
        items={copy.faqs.items.map((item) => ({
          id: item.id,
          question: item.question,
          answer: item.answer,
        }))}
      />

      {/* ── Where this sits in the ecosystem ─────────────────────────────── */}
      <Section id="related" title={dict.tools.related.heading} tone="deep">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted-2)]">
              {dict.nav.services.label}
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <LocaleLink
                  locale={locale}
                  href={`/services/${parentService.slug}`}
                  className="text-sm text-sea-300 underline-offset-4 hover:underline"
                >
                  {dict.services.items[parentService.slug].name}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  locale={locale}
                  href="/services/accounting-bookkeeping"
                  className="text-sm text-muted underline-offset-4 hover:text-[var(--df-color-text-strong)] hover:underline"
                >
                  {dict.services.items['accounting-bookkeeping'].name}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  locale={locale}
                  href="/services/virtual-cfo"
                  className="text-sm text-muted underline-offset-4 hover:text-[var(--df-color-text-strong)] hover:underline"
                >
                  {dict.services.items['virtual-cfo'].name}
                </LocaleLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted-2)]">
              {dict.nav.tools.label}
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <LocaleLink
                  locale={locale}
                  href={toolHref('cost-efficiency-calculator')}
                  className="text-sm text-sea-300 underline-offset-4 hover:underline"
                >
                  {dict.tools.tools['cost-efficiency-calculator'].name}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  locale={locale}
                  href={toolHref('break-even-calculator')}
                  className="text-sm text-muted underline-offset-4 hover:text-[var(--df-color-text-strong)] hover:underline"
                >
                  {dict.tools.tools['break-even-calculator'].name}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  locale={locale}
                  href={toolHref('working-capital-calculator')}
                  className="text-sm text-muted underline-offset-4 hover:text-[var(--df-color-text-strong)] hover:underline"
                >
                  {dict.tools.tools['working-capital-calculator'].name}
                </LocaleLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted-2)]">
              {dict.nav.industries.label}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {industryOrder.map((entry) => (
                <li key={entry.slug}>
                  <LocaleLink
                    locale={locale}
                    href={industryHref(entry.slug)}
                    className="text-sm text-muted underline-offset-4 hover:text-[var(--df-color-text-strong)] hover:underline"
                  >
                    {industries[entry.slug].name}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaBand
        title={copy.delivery.heading}
        body={copy.delivery.lead}
        primary={{ label: copy.delivery.bookLabel, href: bookHref }}
        secondary={{ label: copy.delivery.checklistLabel, href: checklistHref }}
      />
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Beats 2 and 3 as one diagram
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * A schematic, deliberately without figures.
 *
 * Beats 2 and 3 introduce the idea of cost drifting out of an orderly structure,
 * and there is no honest number to put beside it yet — so this diagram carries the
 * *shape* only: full turnover, necessary cost, the profit that remains, and a
 * hatched band where a recoverable figure would go, labelled as withheld. The
 * reader's own figures arrive in beat 5, where they are theirs.
 */
function StructureSchematic({ copy }: { copy: CostEfficiencyCopy }) {
  const rows = [
    { label: copy.chart.revenue, width: '100%', className: 'bg-[var(--df-gradient-focus)]' },
    { label: copy.chart.necessary, width: '68%', className: 'bg-[var(--df-color-border-strong)]' },
    { label: copy.chart.profitReported, width: '32%', className: 'bg-ok' },
  ];

  return (
    <figure className="rounded-2xl border border-[var(--df-color-border-quiet)] bg-void/30 p-6">
      <ul className="space-y-5">
        {rows.map((row, index) => (
          <li key={row.label}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-[var(--df-color-text)]">{row.label}</span>
              {index === rows.length - 1 ? (
                <Badge tone="sample" size="sm" glyph="◇">
                  {copy.chart.legendNecessary}
                </Badge>
              ) : null}
            </div>
            <div className="mt-2 h-3.5 w-full overflow-hidden rounded-full bg-void/60">
              <div className={`h-full rounded-full ${row.className}`} style={{ width: row.width }} />
            </div>
          </li>
        ))}

        <li>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-gold-bright">{copy.chart.exposure}</span>
            <span className="text-xs text-[var(--df-color-muted-2)]">{copy.chart.legendWithheld}</span>
          </div>
          <div className="mt-2 h-3.5 w-full rounded-full border border-dashed border-[var(--df-color-gold)] bg-[repeating-linear-gradient(135deg,transparent,transparent_6px,color-mix(in_srgb,var(--df-color-gold)_35%,transparent)_6px,color-mix(in_srgb,var(--df-color-gold)_35%,transparent)_12px)]" />
        </li>
      </ul>
      <figcaption className="mt-5 text-xs leading-relaxed text-[var(--df-color-muted-2)]">
        {copy.chart.axisNote}
      </figcaption>
    </figure>
  );
}
