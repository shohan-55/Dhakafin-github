import type { Metadata } from 'next';

import { CtaBand, FaqSection, NotIncluded, Section } from '@/components/marketing/Sections';
import { BandLadder } from '@/components/pricing/BandLadder';
import { FitFilter, type FitResultData, type FitStepData } from '@/components/pricing/FitFilter';
import { PlatformMatrix } from '@/components/pricing/PlatformMatrix';
import { PricingTable, type PricingGroupData, type PricingRowData } from '@/components/pricing/PricingTable';
import { LocaleLink } from '@/components/system/LocaleLink';
import { Reveal } from '@/components/system/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { annualAtBand, fitQuestions, platformFeatures, priceLines } from '@/lib/content/pricing';
import { services as serviceRegistry, type ServiceGroupId } from '@/lib/content/services';
import { getDictionary } from '@/lib/dictionary';
import { formatBDT, type NumeralSystem } from '@/lib/format';
import { absoluteUrl, localeHref, resolveLocale, type Locale } from '@/lib/i18n';
import { buildMetadata, SITE_URL } from '@/lib/seo';

/**
 * /pricing — DF-P2-025, blueprint F3 and §2.2.
 * ---------------------------------------------------------------------------
 * F3 asks for four things, and each one is a promise this page has to keep:
 *
 *   · **Bands, not "contact us".** All nine lines publish a starting band, and
 *     the band strings are read out of the service dictionary rather than typed
 *     here — the service page and this page cannot disagree, and
 *     `scripts/check-pricing.mjs` proves it from the emitted HTML.
 *   · **Inclusions and exclusions, stated up front.** The five exclusions that
 *     apply to every line are printed once, plainly, rather than buried per row.
 *   · **An annual toggle and a compare mode.** Interactive table, client island,
 *     with the annual figure always described as twelve months at the same band —
 *     never as a discount.
 *   · **A "which fits me?" filter.** Three questions, no email gate.
 *
 * The platform tiers are shown with their design targets and their status,
 * because §1.5 says to finalise that pricing in Phase 5 and a page that hides a
 * product behind "coming soon" is less honest than one that shows the plan and
 * says it is a plan.
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
    path: '/pricing',
    title: dict.pricing.meta.metaTitle,
    description: dict.pricing.meta.metaDescription,
  });
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale: Locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const copy = dict.pricing;
  const services = dict.services.items;
  const numerals: NumeralSystem = locale === 'bn' ? 'bn' : 'latin';

  const bookHref = `${localeHref(locale, '/book-consultation')}?intent=pricing`;
  const quoteHref = `${localeHref(locale, '/contact')}?intent=project-quote`;
  const diagnosticHref = localeHref(locale, '/diagnostic');

  const serviceHref = (slug: keyof typeof services) => localeHref(locale, `/services/${slug}`);

  const groups: PricingGroupData[] = (['foundations', 'control', 'growth'] as ServiceGroupId[]).map(
    (id) => ({ id, name: dict.services.groups[id], lede: dict.services.groupsLede[id] }),
  );

  /**
   * One row per published line. `band` is the dictionary's own string — the same
   * one the service page renders — and `annualValue` is arithmetic on the band
   * the registry holds. Neither is reformatted on the way to the screen.
   */
  const rows: PricingRowData[] = priceLines.map((line) => {
    const item = services[line.service];
    const lineCopy = copy.lines[line.service];
    const firstGroup = item.included.groups.at(0);

    return {
      slug: line.service,
      name: item.name,
      group: serviceRegistry[line.service].group,
      band: item.hero.priceBand,
      cadence: line.cadence,
      cadenceLabel: copy.table.cadence[line.cadence],
      annualValue: line.annualisable
        ? formatBDT(annualAtBand(line.bandFrom), { numerals })
        : null,
      basis: lineCopy.basis,
      drivers: lineCopy.drivers,
      ...(lineCopy.note ? { note: lineCopy.note } : {}),
      included: firstGroup ? firstGroup.items.slice(0, 3) : [],
      excluded: item.included.notIncluded.items.slice(0, 2),
      href: serviceHref(line.service),
    };
  });

  /** The same nine bands, shaped for the chart. Built from `rows`, not beside it. */
  const ladderRows = rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    amount: priceLines.find((line) => line.service === row.slug)?.bandFrom ?? 0,
    band: row.band,
  }));

  const steps: FitStepData[] = fitQuestions.map((question) => ({
    id: question.id,
    question: copy.fit.questions[question.id].question,
    answers: question.answers.map((answer) => ({
      id: answer.id,
      label: copy.fit.questions[question.id].answers[answer.id] ?? answer.id,
      next: answer.next,
      service: answer.service,
    })),
  }));

  const fitResults: Record<string, FitResultData> = Object.fromEntries(
    priceLines.map((line) => [
      line.service,
      {
        service: line.service,
        name: services[line.service].name,
        band: services[line.service].hero.priceBand,
        reason: copy.fit.reasons[line.service],
        href: serviceHref(line.service),
      },
    ]),
  );

  /**
   * `Offer` for the nine service lines, and nothing else.
   *
   * Search engines read this as a price, so it has to be the same figure the
   * reader sees: `minPrice` is the published "from" band, VAT is declared
   * excluded, and the platform tiers are deliberately absent — they are design
   * targets for something that cannot be bought.
   */
  const offerCatalog = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: copy.hero.title,
    itemListElement: priceLines.map((line) => ({
      '@type': 'Offer',
      priceCurrency: 'BDT',
      price: line.bandFrom,
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'BDT',
        minPrice: line.bandFrom,
        valueAddedTaxIncluded: false,
      },
      itemOffered: {
        '@type': 'Service',
        name: services[line.service].name,
        areaServed: { '@type': 'Country', name: 'Bangladesh' },
      },
      url: absoluteUrl(serviceHref(line.service), SITE_URL),
    })),
  };

  /* The marketing layout owns the single main landmark and the skip-link
     target. A page that renders its own would nest landmarks and duplicate the
     id, so this wrapper is a plain div for exactly that reason. */
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalog) }}
      />

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <section className="df-container pb-14 pt-16 sm:pt-24">
        <Breadcrumb
          items={[{ label: 'DhakaFin', href: localeHref(locale, '/') }, { label: copy.hero.eyebrow }]}
          label={copy.hero.eyebrow}
        />

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sea-400">
              {copy.hero.eyebrow}
            </p>
            <h1 className="mt-3 text-display font-semibold text-[var(--df-color-text-strong)]">
              {copy.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg leading-relaxed text-[var(--df-color-text)]">
              {copy.hero.lede}
            </p>

            <p className="mt-5 max-w-2xl border-l-2 border-[var(--df-color-gold)] ps-4 text-sm leading-relaxed text-muted">
              {copy.hero.vatNote}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={bookHref} size="lg" magnetic>
                {copy.hero.primaryCta}
              </ButtonLink>
              <ButtonLink href={quoteHref} variant="secondary" size="lg">
                {copy.hero.secondaryCta}
              </ButtonLink>
            </div>
          </div>

          <BandLadder
            rows={ladderRows}
            heading={copy.ladder.heading}
            caption={copy.ladder.caption}
            scaleNote={copy.ladder.scaleNote}
            numerals={numerals}
          />
        </div>
      </section>

      {/* ── What moves a figure ──────────────────────────────────────────── */}
      <Section id="drivers" title={copy.drivers.heading} lede={copy.drivers.lede} tone="deep">
        <ul className="grid gap-5 md:grid-cols-3">
          {copy.drivers.items.map((item, index) => (
            <Reveal as="li" key={item.title} index={index}>
              <Card tone="context" padding="lg" className="h-full">
                <span className="df-num text-[11px] font-semibold tracking-[0.14em] text-[var(--df-color-muted)]">
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

      {/* ── The ledger ───────────────────────────────────────────────────── */}
      <Section
        id="lines"
        eyebrow={copy.hero.eyebrow}
        title={copy.table.heading}
        lede={copy.table.lede}
      >
        <PricingTable copy={copy.table} rows={rows} groups={groups} />

        <NotIncluded title={copy.table.exclusionsHeading} items={copy.table.exclusions} />
        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-[var(--df-color-muted)]">
          {copy.table.exclusionsLede}
        </p>
      </Section>

      {/* ── Which fits me ────────────────────────────────────────────────── */}
      <Section id="fit" title={copy.fit.heading} lede={copy.fit.lede} tone="deep">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
          <FitFilter
            copy={copy.fit}
            steps={steps}
            results={fitResults}
            diagnosticHref={diagnosticHref}
          />

          <div className="rounded-2xl border border-[var(--df-color-border-quiet)] bg-void/30 p-6">
            <Badge tone="sea" glyph="⌘">
              {dict.nav.tools.label}
            </Badge>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {dict.tools.index.lead}
            </p>
            <ul className="mt-5 space-y-2.5">
              {(['break-even-calculator', 'working-capital-calculator', 'vat-calculator'] as const).map(
                (slug) => (
                  <li key={slug}>
                    <LocaleLink
                      locale={locale}
                      href={`/tools/${slug}`}
                      className="text-sm text-sea-300 underline-offset-4 hover:underline"
                    >
                      {dict.tools.tools[slug].name}
                    </LocaleLink>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── The platform ─────────────────────────────────────────────────── */}
      <Section id="platform" title={copy.platform.heading}>
        <PlatformMatrix copy={copy.platform} features={platformFeatures} numerals={numerals} />
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

      {/* ── How this connects to the service pages ───────────────────────── */}
      <Section id="lines-list" title={dict.services.ecosystem.title} lede={dict.services.ecosystem.lede}>
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <li key={row.slug} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--df-color-border-quiet)] pb-2">
              <LocaleLink
                locale={locale}
                href={`/services/${row.slug}`}
                className="text-sm text-[var(--df-color-text)] underline-offset-4 hover:text-sea-300 hover:underline"
              >
                {row.name}
              </LocaleLink>
              <span className="df-num text-xs text-[var(--df-color-muted)]">{row.band}</span>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title={copy.cta.title}
        body={copy.cta.body}
        primary={{ label: copy.cta.primaryLabel, href: bookHref }}
        secondary={{ label: copy.cta.secondaryLabel, href: quoteHref }}
        footnote={copy.cta.footnote}
      />
    </div>
  );
}
