import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { IndustryMotif } from '@/components/marketing/IndustryMotif';
import { CtaBand, FaqSection, PainList, Section } from '@/components/marketing/Sections';
import { LocaleLink } from '@/components/system/LocaleLink';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TableWrap, TD, TH, THead, TR } from '@/components/ui/Table';
import { obligations as obligationRegister } from '@/lib/compliance';
import {
  industryHref,
  industryOrder,
  industrySlugs,
  industries as industryRegistry,
  isIndustrySlug,
  type IndustryAccent,
} from '@/lib/content/industries';
import { services as serviceRegistry } from '@/lib/content/services';
import { toolHref } from '@/lib/content/tools';
import { getDictionary } from '@/lib/dictionary';
import { localeHref, resolveLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';
import { cn } from '@/lib/cn';

/**
 * Industry page — DF-P2-043, blueprint §5.13.1.
 * ---------------------------------------------------------------------------
 * One route, three pages, and the same layout for all eleven when the remaining
 * eight are commissioned. §5.13.2 is explicit that differentiation lives in
 * content and illustration and never in structure, so the only per-industry
 * variables reaching this file are the motif, the accent rotation and the words.
 *
 * Every block in §5.13.1's table is present and in its order. Two of them are
 * deliberately partial:
 *
 *   · **Compliance profile** names each obligation and links to the authority
 *     instead of printing a due date, exactly as the service pages do.
 *   · **KPI bands** are not published. Formulas are, because a formula is
 *     definitional and cannot go stale; a band is a claim about what is normal,
 *     and a claim about what is normal needs a measured sample behind it. The
 *     note under the KPI table says so rather than leaving the omission silent.
 *
 * The case study is badged as illustrative, per the demo-integrity rule. A case
 * study without a stated measurement period and consent is a testimonial, and
 * this page will not ship one.
 */

export const dynamicParams = false;

export const generateStaticParams = () =>
  ['en', 'bn'].flatMap((locale) =>
    industrySlugs.map((slug) => ({ locale, slug })),
  );

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  if (!isIndustrySlug(slug)) return {};
  const copy = getDictionary(locale).industries.industries[slug];
  return buildMetadata({
    locale,
    path: industryHref(slug),
    title: copy.metaTitle,
    description: copy.metaDescription,
  });
}

function accentTokens(accent: IndustryAccent) {
  switch (accent) {
    case 'cyan':
      return {
        accent: 'var(--df-color-cyan)',
        muted: 'var(--df-color-border-strong)',
        highlight: 'var(--df-color-cyan)',
        text: 'text-[color-mix(in_srgb,var(--df-color-cyan)_85%,white)]',
      };
    case 'gold':
      return {
        accent: 'var(--df-color-gold)',
        muted: 'var(--df-color-border-strong)',
        highlight: 'var(--df-color-gold-bright)',
        text: 'text-gold-bright',
      };
    default:
      return {
        accent: 'var(--df-color-sea-400)',
        muted: 'var(--df-color-border-strong)',
        highlight: 'var(--df-color-sea-300)',
        text: 'text-sea-300',
      };
  }
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = resolveLocale(rawLocale);
  if (!isIndustrySlug(slug)) notFound();

  const dict = getDictionary(locale);
  const copy = dict.industries;
  const industry = copy.industries[slug];
  const entry = industryRegistry[slug];
  const tokens = accentTokens(entry.accent);

  const ranked = entry.services.map((serviceSlug) => serviceRegistry[serviceSlug]);
  const relatedTools = entry.tools.map((toolSlug) => ({
    slug: toolSlug,
    copy: dict.tools.tools[toolSlug],
  }));

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: industry.faqs.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${industry.name} — accounting, tax, VAT and cost control`,
    description: industry.metaDescription,
    serviceType: industry.name,
    areaServed: { '@type': 'Country', name: 'Bangladesh' },
  };

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="df-container pb-16 pt-16 sm:pt-24">
        <Breadcrumb
          items={[
            { label: 'DhakaFin', href: localeHref(locale, '/') },
            { label: copy.hero.eyebrow, href: localeHref(locale, '/industries') },
            { label: industry.name },
          ]}
          label={copy.hero.eyebrow}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center">
          <div>
            <p className={cn('text-[11px] font-semibold uppercase tracking-[0.14em]', tokens.text)}>
              {industry.name}
            </p>
            <h1 className="mt-3 text-h1 font-semibold text-[var(--df-color-text-strong)]">
              {industry.heroPhrase} &mdash;{' '}
              {locale === 'bn'
                ? 'হিসাব, কর, ভ্যাট ও ব্যয় নিয়ন্ত্রণ'
                : 'accounting, tax, VAT and cost control'}
            </h1>
            <p className="mt-5 text-body-lg leading-relaxed text-[var(--df-color-text)]">
              {industry.promise}
            </p>
            {/* The 40–60 word answer block, quotable standing alone. */}
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted">{industry.answer}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href={`${localeHref(locale, '/book-consultation')}?industry=${entry.slug}&service=${entry.bookingService}`}
                size="lg"
                magnetic
              >
                {industry.cta.primary}
              </ButtonLink>
              <ButtonLink
                href={`${localeHref(locale, '/contact')}?industry=${entry.slug}&intent=checklist`}
                variant="secondary"
                size="lg"
              >
                {industry.cta.magnet}
              </ButtonLink>
            </div>
          </div>

          <div className="df-glass df-edge rounded-2xl p-8">
            <IndustryMotif
              motif={entry.motif}
              accent={tokens.accent}
              muted={tokens.muted}
              highlight={tokens.highlight}
              className="h-48 w-full"
            />
          </div>
        </div>
      </section>

      {/* ── Compliance profile ───────────────────────────────────────────── */}
      <Section id="compliance" title={industry.complianceProfile.heading} lede={industry.complianceProfile.lede} tone="deep">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
          <TableWrap caption={industry.complianceProfile.heading}>
              <THead>
                <TR>
                  <TH scope="col">{locale === 'bn' ? 'বাধ্যবাধকতা' : 'Obligation'}</TH>
                  <TH scope="col">{locale === 'bn' ? 'এই খাতে কেন' : 'Why it applies here'}</TH>
                </TR>
              </THead>
              <tbody>
                {industry.complianceProfile.rows.map((row) => {
                  const register = obligationRegister[row.obligationId];
                  const label = register
                    ? dict.compliance.obligations[register.labelKey as keyof typeof dict.compliance.obligations]
                    : row.obligationId;
                  return (
                    <TR key={row.obligationId}>
                      <TD className="align-top">
                        <span className="font-medium text-[var(--df-color-text-strong)]">{label}</span>
                        {register ? (
                          <span className="mt-1 block text-xs text-[var(--df-color-muted-2)]">
                            {register.authority} · {dict.compliance.cadences[register.cadence]}
                          </span>
                        ) : null}
                      </TD>
                      <TD className="align-top text-sm leading-relaxed text-muted">{row.why}</TD>
                    </TR>
                  );
                })}
              </tbody>
          </TableWrap>

          <Card tone="quiet" padding="lg" className="h-fit">
            <Badge tone="regulatory" glyph="◷">
              {dict.compliance.unverifiedTitle}
            </Badge>
            <p className="mt-4 text-sm leading-relaxed text-muted">{industry.complianceProfile.noDatesNote}</p>
            <p className="mt-3 text-xs leading-relaxed text-[var(--df-color-muted-2)]">
              {dict.compliance.unverifiedBody}
            </p>
          </Card>
        </div>
      </Section>

      {/* ── Financial DNA ────────────────────────────────────────────────── */}
      <Section id="financial-dna" title={industry.financialDna.heading} lede={industry.financialDna.lede}>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted-2)]">
              {locale === 'bn' ? 'আয় ও ব্যয়ের গঠন' : 'Revenue and cost structure'}
            </h3>
            <ul className="mt-4 space-y-4">
              {industry.financialDna.structure.map((row, index) => (
                <li key={row.label} className="flex gap-4">
                  <span className="df-num mt-0.5 text-xs font-semibold text-[var(--df-color-muted-2)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-[var(--df-color-text-strong)]">{row.label}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{row.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <Card tone="quiet" padding="lg">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted-2)]">
                {locale === 'bn' ? 'যেখানে ব্যয় বেরিয়ে যায়' : 'Where cost leaks'}
              </h3>
              <ul className="mt-4 space-y-3">
                {industry.financialDna.leakage.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-[var(--df-color-text)]">
                    <span aria-hidden="true" className="mt-1.5 shrink-0 text-warn">
                      ▲
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card tone="quiet" padding="lg">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted-2)]">
                {locale === 'bn' ? 'নগদের ধরন' : 'Working capital pattern'}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--df-color-text)]">
                {industry.financialDna.workingCapital}
              </p>
            </Card>
          </div>
        </div>

        <p className="mt-8 max-w-3xl border-l-2 border-[var(--df-color-border-strong)] ps-4 text-xs leading-relaxed text-muted">
          {industry.financialDna.bandsNote}
        </p>
      </Section>

      {/* ── KPIs ─────────────────────────────────────────────────────────── */}
      <Section id="kpis" title={industry.kpis.heading} lede={industry.kpis.lede} tone="deep">
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {industry.kpis.items.map((kpi) => (
            <li key={kpi.id}>
              <Card tone="context" padding="lg" className="flex h-full flex-col">
                <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">{kpi.label}</h3>
                <p className="df-num mt-3 break-words rounded-lg border border-[var(--df-color-border-quiet)] bg-void/40 px-3 py-2 text-xs leading-relaxed text-[var(--df-color-text)]">
                  {kpi.formula}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{kpi.meaning}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--df-color-text)]">
                  <span className={cn('font-medium', tokens.text)}>
                    {locale === 'bn' ? 'লিভার: ' : 'Lever: '}
                  </span>
                  {kpi.lever}
                </p>
              </Card>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-3xl border-l-2 border-[var(--df-color-border-strong)] ps-4 text-xs leading-relaxed text-muted">
          {industry.kpis.bandsNote}
        </p>
      </Section>

      {/* ── Pains ────────────────────────────────────────────────────────── */}
      <Section id="pains" title={industry.pains.heading} lede={industry.pains.lede}>
        <PainList items={industry.pains.items.map((p) => p.text)} />
      </Section>

      {/* ── Risks ────────────────────────────────────────────────────────── */}
      <Section id="risks" title={industry.risks.heading} lede={industry.risks.lede} tone="deep">
        <ul className="grid gap-4 md:grid-cols-2">
          {industry.risks.items.map((risk) => (
            <li key={risk.text}>
              <Card tone="quiet" padding="lg" className="h-full">
                <p className="flex gap-2.5 text-sm font-medium text-[var(--df-color-text-strong)]">
                  <span aria-hidden="true" className="mt-0.5 shrink-0 text-risk">
                    !
                  </span>
                  <span>{risk.text}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{risk.handling}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Recommended services ─────────────────────────────────────────── */}
      <Section id="services" title={industry.recommended.heading} lede={industry.recommended.lede}>
        <ol className="space-y-4">
          {ranked.map((service, index) => (
            <li key={service.slug}>
              <LocaleLink locale={locale} href={`/services/${service.slug}`} className="group block no-underline">
                <Card tone="quiet" padding="lg" interactive>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <span className="df-num text-xs font-semibold text-[var(--df-color-muted-2)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
                      {dict.services.items[service.slug].name}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {industry.recommended.reasons[service.slug]}
                  </p>
                </Card>
              </LocaleLink>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Tools with presets ───────────────────────────────────────────── */}
      <Section id="tools" title={industry.tools.heading} lede={industry.tools.lede} tone="deep">
        <ul className="grid gap-4 md:grid-cols-3">
          {relatedTools.map((tool) => (
            <li key={tool.slug}>
              <LocaleLink locale={locale} href={toolHref(tool.slug)} className="group block h-full no-underline">
                <Card tone="quiet" padding="lg" interactive className="h-full">
                  <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">{tool.copy.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{tool.copy.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sea-300">
                    {dict.tools.index.openLabel}
                    <span aria-hidden="true">→</span>
                  </span>
                </Card>
              </LocaleLink>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted">{industry.tools.presetNote}</p>
      </Section>

      {/* ── Case study ───────────────────────────────────────────────────── */}
      <Section id="case-study" title={industry.caseStudy.heading}>
        <Card tone="context" padding="lg" className="max-w-3xl">
          <dl className="space-y-5">
            {[
              { term: locale === 'bn' ? 'চ্যালেঞ্জ' : 'Challenge', body: industry.caseStudy.challenge },
              { term: locale === 'bn' ? 'হস্তক্ষেপ' : 'Intervention', body: industry.caseStudy.intervention },
              { term: locale === 'bn' ? 'ফলাফল' : 'Result', body: industry.caseStudy.result },
            ].map((part) => (
              <div key={part.term}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted-2)]">
                  {part.term}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-[var(--df-color-text)]">{part.body}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 border-t border-[var(--df-color-border-quiet)] pt-4">
            <Badge tone="sample" glyph="◇">
              {locale === 'bn' ? 'নমুনা তথ্য' : 'Sample data'}
            </Badge>
            <p className="mt-3 text-xs leading-relaxed text-muted">{industry.caseStudy.sampleNote}</p>
          </div>
        </Card>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <FaqSection
        id="faq"
        title={industry.faqs.heading}
        items={industry.faqs.items.map((item) => ({
          id: item.id,
          question: item.question,
          answer: item.answer,
        }))}
      />

      {/* ── Internal link cluster + CTA ──────────────────────────────────── */}
      <Section id="related" title={dict.tools.related.heading}>
        <ul className="flex flex-wrap gap-2.5">
          {industryOrder
            .filter((other) => other.slug !== slug)
            .map((other) => (
              <li key={other.slug}>
                <LocaleLink
                  locale={locale}
                  href={industryHref(other.slug)}
                  className="inline-flex rounded-lg border border-[var(--df-color-border-quiet)] px-3 py-1.5 text-sm text-muted no-underline transition-colors duration-[var(--df-duration-fast)] hover:text-[var(--df-color-text-strong)]"
                >
                  {copy.industries[other.slug].name}
                </LocaleLink>
              </li>
            ))}
          <li>
            <LocaleLink
              locale={locale}
              href="/rates"
              className="inline-flex rounded-lg border border-dashed border-[var(--df-color-border-strong)] px-3 py-1.5 text-sm text-muted no-underline"
            >
              {locale === 'bn' ? 'রেট হাব' : 'Rate hub'}
            </LocaleLink>
          </li>
          <li>
            <LocaleLink
              locale={locale}
              href="/compliance-calendar"
              className="inline-flex rounded-lg border border-dashed border-[var(--df-color-border-strong)] px-3 py-1.5 text-sm text-muted no-underline"
            >
              {locale === 'bn' ? 'কমপ্লায়েন্স ক্যালেন্ডার' : 'Compliance calendar'}
            </LocaleLink>
          </li>
        </ul>
      </Section>

      <CtaBand
        title={industry.cta.title}
        body={industry.cta.body}
        primary={{
          label: industry.cta.primary,
          href: `${localeHref(locale, '/book-consultation')}?industry=${entry.slug}&service=${entry.bookingService}`,
        }}
        secondary={{
          label: industry.cta.magnet,
          href: `${localeHref(locale, '/contact')}?industry=${entry.slug}&intent=checklist`,
        }}
      />
    </main>
  );
}
