import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ServiceMotif } from '@/components/marketing/ServiceMotif';
import { CtaBand, FaqSection, NotIncluded, PainList, Section, WorkflowTimeline } from '@/components/marketing/Sections';
import { LocaleLink } from '@/components/system/LocaleLink';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { isServiceSlug, serviceSlugs, services } from '@/lib/content/services';
import { toolHref } from '@/lib/content/tools';
import { obligationList } from '@/lib/compliance';
import { getDictionary } from '@/lib/dictionary';
import { localeHref, resolveLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';

/**
 * Service detail — the 14 blocks of blueprint §5.6.3, rendered identically for
 * all nine services.
 *
 * One template, nine content records. The value of that is not code economy: it
 * is that a visitor can compare two services and find the same information in
 * the same place. A page-per-service design would make each page locally
 * beautiful and the set collectively useless.
 */
/**
 * Only the nine official slugs exist. `dynamicParams = false` makes an unknown
 * slug a routing-level 404 rather than a render that calls `notFound()`.
 *
 * That distinction is not cosmetic. The `[locale]` layout declares
 * `force-static`, and a `notFound()` thrown during static rendering cannot set
 * the response status — the client received 200 with the not-found body, which
 * is how a 404 becomes an indexed soft-404. Letting the router decide avoids it
 * entirely. This is safe here in a way it was not for `[locale]`: there is no
 * optional catch-all in this segment for `dynamicParams = false` to suppress.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs.flatMap((slug) => [
    { locale: 'en', slug },
    { locale: 'bn', slug },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  if (!isServiceSlug(slug)) return {};

  const dict = getDictionary(locale);
  const copy = dict.services.items[slug];
  return buildMetadata({
    locale,
    path: `/services/${slug}`,
    title: copy.metaTitle,
    description: copy.metaDescription,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = resolveLocale(rawLocale);
  if (!isServiceSlug(slug)) notFound();

  const dict = getDictionary(locale);
  const hub = dict.services;
  const copy = hub.items[slug];
  const entry = services[slug];
  const obligations = obligationList(entry.obligations);
  const bookHref = localeHref(locale, `/book-consultation?service=${slug}`);

  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-[var(--df-color-border-quiet)]">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[var(--df-gradient-depth)]" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-px bg-[var(--df-gradient-sealine)] opacity-50" />

        <div className="df-container df-container-wide pt-10 pb-16 lg:pt-12 lg:pb-20">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-2 text-xs">
              <li>
                <LocaleLink locale={locale} href="/services" className="text-muted no-underline hover:text-sea-300">
                  {hub.eyebrow}
                </LocaleLink>
              </li>
              <li aria-hidden="true" className="text-[var(--df-color-muted)]">
                /
              </li>
              <li className="text-[var(--df-color-text)]">
                <span className="tabular font-mono text-[11px] text-sea-300 df-num">
                  {String(entry.order).padStart(2, '0')}
                </span>{' '}
                {copy.name}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <h1 className="text-h1 text-strong">{copy.name}</h1>
              <p className="mt-5 max-w-[58ch] text-body-lg text-muted">{copy.outcome}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {copy.hero.chips.map((chip) => (
                  <li key={chip}>
                    <Badge tone="neutral" size="sm">
                      {chip}
                    </Badge>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-[var(--df-color-text)]">
                <span className="text-[var(--df-color-muted)]">{hub.ecosystem.priceLabel}: </span>
                <span className="font-semibold df-num">{copy.hero.priceBand}</span>
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={bookHref} size="lg" magnetic>
                  {copy.cta.primary}
                </ButtonLink>
                <ButtonLink href={localeHref(locale, '/contact')} variant="secondary" size="lg">
                  {copy.cta.secondary}
                </ButtonLink>
              </div>
            </div>

            <figure className="df-glass df-edge rounded-2xl p-6">
              <ServiceMotif motif={entry.motif} />
              <figcaption className="mt-4 border-t border-[var(--df-color-border-quiet)] pt-4 text-xs leading-relaxed text-muted">
                {copy.hero.visualCaption}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── 2. The problem ──────────────────────────────────────────────── */}
      <Section id="problem" title={copy.problem.title} lede={copy.problem.lede}>
        <PainList items={copy.problem.items} />
      </Section>

      {/* ── 3. What's included ──────────────────────────────────────────── */}
      <Section id="included" tone="deep" title={copy.included.title} lede={copy.included.lede}>
        <div className="grid gap-4 md:grid-cols-3">
          {copy.included.groups.map((group) => (
            <Card key={group.heading} tone="quiet" padding="lg" className="h-full">
              <h3 className="text-sm font-semibold text-[var(--df-color-text-strong)]">{group.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <span aria-hidden="true" className="mt-1.5 shrink-0 text-sea-400">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <NotIncluded title={copy.included.notIncluded.title} items={copy.included.notIncluded.items} />
      </Section>

      {/* ── 4. Who needs this ───────────────────────────────────────────── */}
      <Section id="who" title={copy.who.title} lede={copy.who.lede}>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card tone="quiet" padding="lg">
            <ul className="mt-4 space-y-2.5">
              {copy.who.businessTypes.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card tone="quiet" padding="lg">
            <ul className="space-y-2.5">
              {copy.who.turnoverBands.map((band) => (
                <li key={band} className="text-sm font-medium text-[var(--df-color-text)] df-num">
                  {band}
                </li>
              ))}
            </ul>
          </Card>
          <Card tone="context" padding="lg">
            <ul className="space-y-3">
              {copy.who.triggers.map((trigger) => (
                <li key={trigger} className="flex gap-2.5 text-sm leading-relaxed text-[var(--df-color-text)]">
                  <span aria-hidden="true" className="mt-1.5 shrink-0 text-gold-bright">
                    ◆
                  </span>
                  <span>{trigger}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* ── 5. Workflow ─────────────────────────────────────────────────── */}
      <Section id="workflow" tone="deep" title={copy.workflow.title} lede={copy.workflow.lede}>
        <div className="max-w-4xl">
          <WorkflowTimeline steps={copy.workflow.steps} labels={copy.workflow.labels} />
        </div>
      </Section>

      {/* ── 6. Deliverables + 7. SLA ────────────────────────────────────── */}
      <Section id="deliverables" title={copy.deliverables.title} lede={copy.deliverables.lede}>
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <ul className="space-y-3">
            {copy.deliverables.items.map((item) => (
              <li key={item.name} className="rounded-xl border border-[var(--df-color-border-quiet)] bg-surface1 p-5">
                <h3 className="text-sm font-semibold text-[var(--df-color-text-strong)]">{item.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.note}</p>
              </li>
            ))}
          </ul>

          <div className="space-y-6">
            <Card tone="glass" padding="lg">
              <h3 className="text-sm font-semibold text-[var(--df-color-text-strong)]">{copy.sla.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">{copy.sla.lede}</p>
              <dl className="mt-4 divide-y divide-[var(--df-color-border-quiet)]">
                {copy.sla.rows.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="text-xs text-muted">{row.label}</dt>
                    <dd className="shrink-0 text-xs font-medium text-[var(--df-color-text)] df-num">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <div className="rounded-xl border border-[var(--df-color-border-quiet)] p-5">
              <p className="text-xs font-semibold text-[var(--df-color-text-strong)]">{copy.deliverables.sampleLabel}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{copy.deliverables.sampleNote}</p>
              <p className="mt-3">
                <Badge tone="sample" size="sm">
                  {copy.proof.sampleBadge}
                </Badge>
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 8. Pricing ──────────────────────────────────────────────────── */}
      <Section id="pricing" tone="deep" title={copy.pricing.title} lede={copy.pricing.lede}>
        <div className="grid gap-4 md:grid-cols-3">
          {copy.pricing.bands.map((band) => (
            <Card key={band.name} tone="quiet" padding="lg" className="flex h-full flex-col">
              <h3 className="text-sm font-semibold text-[var(--df-color-text-strong)]">{band.name}</h3>
              <p className="mt-2 text-metric-sm text-sea-300 df-num">{band.range}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{band.includes}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <h3 className="text-sm font-semibold text-[var(--df-color-text-strong)]">
            {copy.pricing.title}
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {copy.pricing.drivers.map((driver) => (
              <li key={driver} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                <span aria-hidden="true" className="mt-1.5 shrink-0 text-sea-400">
                  ·
                </span>
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-8 rounded-xl border border-[var(--df-color-border-quiet)] bg-surface1 p-5 text-sm leading-relaxed text-muted">
          {copy.pricing.footnote}
        </p>
      </Section>

      {/* ── 9. Related tools + 10. Related compliance ───────────────────── */}
      <Section id="related" title={copy.compliance.title} lede={copy.compliance.lede}>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <ul className="space-y-3">
              {obligations.map((obligation) => (
                <li
                  key={obligation.id}
                  className="flex flex-wrap items-baseline justify-between gap-3 rounded-xl border border-[var(--df-color-border-quiet)] bg-surface1 p-4"
                >
                  <span className="text-sm font-medium text-[var(--df-color-text-strong)]">
                    {dict.compliance.obligations[
                      obligation.labelKey as keyof typeof dict.compliance.obligations
                    ] ?? obligation.labelKey}
                  </span>
                  <span className="flex items-center gap-3 text-xs text-muted">
                    <span className="df-num">{obligation.authority}</span>
                    <span>
                      {
                        dict.compliance.cadences[
                          obligation.cadence as keyof typeof dict.compliance.cadences
                        ]
                      }
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            {/* Dates are NOT rendered. Publishing a stale due date is a real harm,
                so the register names the obligation and sends you to the source. */}
            <div className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--df-color-warn)_30%,transparent)] bg-[color-mix(in_srgb,var(--df-color-warn)_6%,transparent)] p-4">
              <p className="text-xs font-semibold text-[var(--df-color-text-strong)]">
                {dict.compliance.unverifiedTitle}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{dict.compliance.unverifiedBody}</p>
              <a
                href={obligations[0]?.verifyUrl ?? 'https://nbr.gov.bd'}
                rel="noopener noreferrer nofollow"
                target="_blank"
                className="mt-2 inline-block text-xs font-medium text-sea-300 underline underline-offset-4"
              >
                {copy.compliance.verifyLabel}
              </a>
            </div>
          </div>

          <div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {entry.tools.map((tool) => (
                <li key={tool}>
                  <LocaleLink
                    locale={locale}
                    href={toolHref(tool)}
                    className="group block rounded-xl border border-[var(--df-color-border-quiet)] bg-surface1 p-4 no-underline transition-colors hover:border-[var(--df-color-border-hover)]"
                  >
                    <span className="block text-sm font-semibold text-[var(--df-color-text-strong)] group-hover:text-sea-300 df-num">
                      {tool}
                    </span>
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── 11. Proof ───────────────────────────────────────────────────── */}
      <Section id="proof" tone="deep" title={copy.proof.title}>
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <Card tone="glass" padding="lg">
            <Badge tone="sample" size="sm">
              {copy.proof.sampleBadge}
            </Badge>
            <dl className="mt-5 space-y-4">
              {(
                [
                  ['context', copy.proof.caseStudy.context],
                  ['action', copy.proof.caseStudy.action],
                  ['result', copy.proof.caseStudy.result],
                ] as const
              ).map(([key, value]) => (
                <div key={key} className="border-s-2 border-[var(--df-color-border-quiet)] ps-4">
                  <dd className="text-sm leading-relaxed text-[var(--df-color-text)]">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 border-t border-[var(--df-color-border-quiet)] pt-5">
              <p className="text-metric text-sea-300 df-num">{copy.proof.caseStudy.metric}</p>
              <p className="mt-1 text-xs text-muted">{copy.proof.caseStudy.metricLabel}</p>
            </div>
          </Card>

          <figure className="rounded-2xl border border-[var(--df-color-border-quiet)] bg-surface1 p-6">
            <blockquote className="text-base leading-relaxed text-[var(--df-color-text)]">
              <span aria-hidden="true" className="me-1 text-sea-400">
                “
              </span>
              {copy.proof.testimonial.quote}
            </blockquote>
            <figcaption className="mt-4 border-t border-[var(--df-color-border-quiet)] pt-4 text-xs text-muted">
              {copy.proof.testimonial.attribution}
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* ── 12. FAQ ─────────────────────────────────────────────────────── */}
      <FaqSection id="faq" title={copy.faq.title} items={copy.faq.items} />

      {/* ── 13. CTA + 14. Internal links ────────────────────────────────── */}
      <Section title={copy.cta.title} lede={copy.cta.body} narrow>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={bookHref} size="lg" magnetic>
            {copy.cta.primary}
          </ButtonLink>
          <ButtonLink href={localeHref(locale, '/contact')} variant="secondary" size="lg">
            {copy.cta.secondary}
          </ButtonLink>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-[var(--df-color-muted)]">{copy.cta.footnote}</p>

        <div className="mt-12 border-t border-[var(--df-color-border-quiet)] pt-8">
          <h3 className="text-overline font-semibold text-sea-400">{hub.ecosystem.legendPrimary}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {entry.pairsWith.map((sibling) => (
              <LocaleLink
                key={sibling}
                locale={locale}
                href={`/services/${sibling}`}
                className="group rounded-xl border border-[var(--df-color-border-quiet)] bg-surface1 p-4 no-underline transition-colors hover:border-[var(--df-color-border-hover)]"
              >
                <span className="block text-sm font-semibold text-[var(--df-color-text-strong)] group-hover:text-sea-300">
                  {hub.items[sibling].name}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">
                  {hub.items[sibling].outcome}
                </span>
              </LocaleLink>
            ))}
            <LocaleLink
              locale={locale}
              href={`/industries/${entry.industry.label}`}
              className="group rounded-xl border border-[var(--df-color-border-quiet)] bg-surface1 p-4 no-underline transition-colors hover:border-[var(--df-color-border-hover)]"
            >
              <span className="block text-sm font-semibold text-[var(--df-color-text-strong)] group-hover:text-sea-300">
                {entry.industry.label}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">
                {copy.outcome}
              </span>
            </LocaleLink>
          </div>
        </div>
      </Section>

      <CtaBand
        title={hub.cta.title}
        body={hub.cta.body}
        primary={{ label: hub.cta.primary, href: bookHref }}
        secondary={{ label: hub.cta.secondary, href: localeHref(locale, '/contact') }}
        footnote={hub.cta.footnote}
      />

      {/* Service schema. Generated from the same record the page renders, so the
          markup and the structured data cannot disagree. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: copy.name,
            description: copy.metaDescription,
            serviceType: copy.name,
            areaServed: { '@type': 'Country', name: 'Bangladesh' },
            provider: { '@type': 'Organization', name: 'DhakaFin' },
          }),
        }}
      />
    </>
  );
}
