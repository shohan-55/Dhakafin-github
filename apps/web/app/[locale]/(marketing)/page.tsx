import type { Metadata } from 'next';

import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardDescription, CardTitle } from '@/components/ui/Card';
import { DeadlineItem } from '@/components/ui/DeadlineItem';
import { KpiRow, KpiTile } from '@/components/ui/KpiTile';
import { RateCard } from '@/components/ui/RateCard';
import { Accordion } from '@/components/ui/Accordion';
import { Alert, ProvenanceNote } from '@/components/ui/States';
import { Reveal } from '@/components/system/Reveal';
import { SpotlightCard } from '@/components/system/SpotlightCard';
import { TierSwitcher } from '@/components/system/TierControls';
import { LocaleLink } from '@/components/system/LocaleLink';
import { getDictionary } from '@/lib/dictionary';
import { localeHref, resolveLocale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const t = dict.home;

  return buildMetadata({
    locale,
    path: '/',
    title: t.meta.title,
    description: t.meta.description,
    keywords: ['accounting Bangladesh', 'TDS rate', 'VAT return', 'financial intelligence', 'virtual CFO'],
  });
}

/**
 * Home route.
 *
 * PHASE 1 SCOPE (DF-P1-005/006/014): this page is the living proof that the design
 * system, token pipeline, motion language and state kit all work together on real
 * components. It is deliberately NOT the production homepage — that is F1 in Phase 2,
 * with the WebGL financial universe, the money-flow experience and API-driven rates.
 *
 * Two integrity rules are demonstrated here:
 *   1. Every illustrative figure is labelled "Sample data" — demo numbers must never
 *      be mistakable for a client's real numbers.
 *   2. No rate value is hardcoded into a component; values are passed in as data and
 *      carry their provenance (source, effective date, verifier).
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const t = dict.home;

  return (
    <>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative isolate overflow-hidden df-grain">
        {/* Atmosphere: layered gradients only — WebGL arrives in Phase 2 behind this */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[var(--df-gradient-ocean)]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 df-atmosphere" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 df-hairline-grid opacity-[0.35]" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-px bg-[var(--df-gradient-sealine)] opacity-60"
        />

        <div className="df-container df-container-wide pt-20 pb-16 lg:pt-28 lg:pb-20">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <Reveal>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">
                    {t.hero.eyebrow}
                  </p>
                  <Badge tone="sea" size="sm">
                    {t.hero.phaseBadge}
                  </Badge>
                </div>
              </Reveal>

              <Reveal delay={60}>
                <h1 className="mt-6 max-w-[16ch] text-display text-[var(--df-color-text-strong)]">
                  {t.hero.titleLead} <span className="text-sea-400">{t.hero.titleAccent}</span> {t.hero.titleTail}
                </h1>
              </Reveal>

              <Reveal delay={120}>
                <p className="mt-6 max-w-[58ch] text-bodyLg text-muted">
                  {t.hero.lede}
                </p>
              </Reveal>

              <Reveal delay={180}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <LocaleLink locale={locale} href="/design-system" className="inline-flex h-12 items-center rounded-lg border border-sea-500/40 px-6 text-sm font-semibold text-sea-300 no-underline transition-colors duration-[var(--df-duration-fast)] hover:bg-surface-tint">
                    {dict.common.exploreDesignSystem}
                  </LocaleLink>
                  <ButtonLink href={localeHref(locale, '/book-consultation')} variant="secondary" size="lg">
                    {dict.common.bookConsultation}
                  </ButtonLink>
                </div>
              </Reveal>

              <Reveal delay={240}>
                <p className="mt-8 max-w-[52ch] border-l-2 border-sea-500/40 pl-4 text-sm italic leading-relaxed text-muted">
                  {t.hero.pullQuote}
                </p>
              </Reveal>
            </div>

            {/* Right column — the "instrument panel" first impression */}
            <Reveal delay={120} className="lg:pt-2">
              <Card tone="glass" padding="none" className="overflow-hidden">
                <div className="flex items-center justify-between gap-4 border-b border-[var(--df-color-border-quiet)] px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ok" />
                    <span className="text-xs font-medium text-[var(--df-color-text)]">{t.hero.terminalTitle}</span>
                  </div>
                  <Badge tone="sample" size="sm">
                    {dict.common.sampleData}
                  </Badge>
                </div>

                <div className="space-y-3 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: t.hero.stats.reconciled, value: '98%', note: 'Aug 2026' },
                      { label: t.hero.stats.nextFiling, value: '6 days', note: 'Mushak 9.1' },
                      { label: t.hero.stats.runway, value: '7.2 mo', note: t.hero.stats.atCurrentBurn },
                      { label: t.hero.stats.openFlags, value: '3', note: t.hero.stats.oneHigh },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg border border-[var(--df-color-border-quiet)] bg-surface1/60 px-3.5 py-3"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                          {item.label}
                        </p>
                        <p className="df-num mt-1.5 text-metric-sm tabular-nums text-[var(--df-color-text-strong)]">
                          {item.value}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[var(--df-color-muted-2)]">{item.note}</p>
                      </div>
                    ))}
                  </div>

                  {/* Signature motion: animated data stream between two nodes */}
                  <div className="rounded-lg border border-[var(--df-color-border-quiet)] bg-surface1/60 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                      {t.hero.flow.heading}
                    </p>
                    <svg viewBox="0 0 320 56" className="mt-3 h-14 w-full" role="img" aria-label={t.hero.flow.alt}>
                      <defs>
                        <linearGradient id="df-stream-grad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="var(--df-color-sea-700)" />
                          <stop offset="50%" stopColor="var(--df-color-sea-400)" />
                          <stop offset="100%" stopColor="var(--df-color-cyan)" />
                        </linearGradient>
                      </defs>

                      <path
                        d="M16 40 C 90 40, 110 16, 160 16 S 240 40, 304 40"
                        fill="none"
                        stroke="var(--df-color-border-strong)"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M16 40 C 90 40, 110 16, 160 16 S 240 40, 304 40"
                        fill="none"
                        stroke="url(#df-stream-grad)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="df-stream"
                      />

                      <circle cx="16" cy="40" r="5" fill="var(--df-color-sea-500)" />
                      <circle cx="160" cy="16" r="4" fill="var(--df-color-sea-400)" />
                      <circle cx="304" cy="40" r="5" fill="var(--df-color-cyan)" />
                    </svg>

                    <div className="mt-1 flex justify-between text-[11px] text-muted">
                      <span>{t.hero.flow.revenue}</span>
                      <span className="text-sea-300">{t.hero.flow.core}</span>
                      <span>{t.hero.flow.netProfit}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--df-color-border-quiet)] bg-surface2/40 px-5 py-3">
                  <p className="text-[11px] leading-relaxed text-[var(--df-color-muted-2)]">
                    {t.hero.terminalFootnote}
                  </p>
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────── PHASE STATUS ─────────────────────── */}
      <section className="df-container df-container-wide df-section-tight">
        <Reveal>
          <Alert
            tone="info"
            title={t.phaseNotice.title}
            action={{ label: t.phaseNotice.action, href: localeHref(locale, '/design-system') }}
          >
            {t.phaseNotice.body}
          </Alert>
        </Reveal>
      </section>

      {/* ─────────────────── INTELLIGENCE COMPONENTS ─────────────────── */}
      <section className="df-container df-container-wide df-section">
        <Reveal>
          <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">{t.intelligence.eyebrow}</p>
          <h2 className="mt-4 max-w-[24ch] text-h2 text-[var(--df-color-text-strong)]">
            {t.intelligence.title}
          </h2>
          <p className="mt-4 max-w-[62ch] text-bodyLg text-muted">
            {t.intelligence.body}
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <KpiRow columns={4}>
            <KpiTile
              label={t.intelligence.kpi.revenue}
              value={1250000}
              delta={18.4}
              qualifier={t.intelligence.kpi.revenueQualifier}
              driver={{ text: t.intelligence.kpi.revenueDriver, href: localeHref(locale, '/design-system#kpi') }}
              period={`${t.intelligence.period} · ${t.intelligence.fromBooks}`}
              sample
            />
            <KpiTile
              label={t.intelligence.kpi.grossProfit}
              value={410000}
              delta={9.1}
              qualifier={t.intelligence.kpi.grossProfitQualifier}
              driver={{ text: t.intelligence.kpi.grossProfitDriver }}
              period={`${t.intelligence.period} · ${t.intelligence.fromBooks}`}
              sample
            />
            <KpiTile
              label={t.intelligence.kpi.netProfit}
              value={190000}
              delta={-2.3}
              qualifier={t.intelligence.kpi.netProfitQualifier}
              driver={{ text: t.intelligence.kpi.netProfitDriver, href: localeHref(locale, '/design-system#kpi') }}
              period={`${t.intelligence.period} · ${t.intelligence.fromBooks}`}
              sample
            />
            <KpiTile
              label={t.intelligence.kpi.cash}
              value={320000}
              delta={0.8}
              qualifier={t.intelligence.kpi.cashQualifier}
              driver={{ text: t.intelligence.kpi.cashDriver }}
              period={`${t.intelligence.period} · ${t.intelligence.fromBank}`}
              sample
            />
          </KpiRow>
        </Reveal>
      </section>

      {/* ─────────────────── REGULATORY + COMPLIANCE ─────────────────── */}
      <section className="border-y border-[var(--df-color-border-quiet)] bg-[var(--df-color-slate-deep)]">
        <div className="df-container df-container-wide df-section">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">{t.regulatory.eyebrow}</p>
              <h2 className="mt-4 max-w-[22ch] text-h2 text-[var(--df-color-text-strong)]">
                {t.regulatory.title}
              </h2>
              <p className="mt-4 max-w-[54ch] text-bodyLg text-muted">
                {t.regulatory.body}
              </p>

              <div className="mt-8 space-y-3">
                {[
                  { term: t.regulatory.terms.effectiveDate, text: t.regulatory.terms.effectiveDateText },
                  { term: t.regulatory.terms.reference, text: t.regulatory.terms.referenceText },
                  { term: t.regulatory.terms.verified, text: t.regulatory.terms.verifiedText },
                ].map((item) => (
                  <div key={item.term} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sea-400" />
                    <p className="text-sm leading-relaxed text-muted">
                      <span className="font-medium text-[var(--df-color-text)]">{item.term} — </span>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={80}>
              <RateCard
                title={t.regulatory.rate.title}
                sectionRef="89"
                rateType="percent"
                value={7.5}
                base={t.regulatory.rate.base}
                applicability={t.regulatory.rate.applicability}
                taxpayerType={t.regulatory.rate.taxpayerType}
                effectiveFrom="01 Jul 2025"
                previousValue={7.5}
                provenance={{
                  referenceSro: 'SRO 173-AIN/2025',
                  verifiedAt: '12 Sep 2026',
                  verifiedBy: t.regulatory.rate.verifiedBy,
                }}
                status="current"
                fiscalYear="FY 2025–26"
                sample
                onViewDetailHref={localeHref(locale, '/design-system#rate-card')}
              />

              <div className="mt-4">
                <Alert
                  tone="regulatory"
                  title={t.regulatory.placeholderTitle}
                >
                  {t.regulatory.placeholderBody}
                </Alert>
              </div>

              <div className="mt-4">
                <ProvenanceNote verifiedAt="12 Sep 2026" verifiedBy={t.regulatory.rate.verifiedBy} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────── COMPLIANCE CALM ─────────────────── */}
      <section className="df-container df-container-wide df-section">
        <Reveal>
          <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">{t.compliance.eyebrow}</p>
          <h2 className="mt-4 max-w-[26ch] text-h2 text-[var(--df-color-text-strong)]">
            {t.compliance.title}
          </h2>
          <p className="mt-4 max-w-[62ch] text-bodyLg text-muted">
            {t.compliance.body}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <Reveal delay={60}>
            <DeadlineItem
              title={t.compliance.vatTitle}
              formRef="Mushak 9.1"
              daysRemaining={6}
              dueDate="15 Oct 2026"
              requirements={{
                description: t.compliance.vatRequirements,
                met: 2,
                total: 3,
              }}
              owner={t.compliance.vatOwner}
              primaryAction={{ label: t.compliance.vatAction, href: localeHref(locale, '/design-system') }}
            />
          </Reveal>

          <Reveal delay={120}>
            <DeadlineItem
              title={t.compliance.tdsTitle}
              formRef="Section 89–90"
              daysRemaining={11}
              dueDate="15 Oct 2026"
              owner={t.compliance.tdsOwner}
              primaryAction={{ label: t.compliance.tdsAction, href: localeHref(locale, '/design-system') }}
            />
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── MATERIALS & MOTION ─────────────────── */}
      <section className="border-y border-[var(--df-color-border-quiet)] bg-[var(--df-color-slate-deep)]">
        <div className="df-container df-container-wide df-section">
          <Reveal>
            <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">{t.designLanguage.eyebrow}</p>
            <h2 className="mt-4 max-w-[24ch] text-h2 text-[var(--df-color-text-strong)]">
              {t.designLanguage.title}
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { ...t.designLanguage.depth, tag: '3D' },
              { ...t.designLanguage.motion, tag: '4D' },
              { ...t.designLanguage.scroll, tag: '5D' },
              { ...t.designLanguage.data, tag: '6D' },
              { ...t.designLanguage.context, tag: '7D' },
              { ...t.designLanguage.continuity, tag: '9D' },
            ].map((item, index) => (
              <Reveal key={item.title} index={index} delay={40}>
                <SpotlightCard className="h-full rounded-xl">
                  <Card tone="context" padding="lg" className="h-full">
                    <Badge tone="sea" size="sm">
                      {item.tag}
                    </Badge>
                    <CardTitle className="mt-3">{item.title}</CardTitle>
                    <CardDescription>{item.body}</CardDescription>
                  </Card>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="mt-12">
            <Card tone="glass" padding="lg">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <CardTitle as="h3">{t.designLanguage.tiersTitle}</CardTitle>
                  <CardDescription>{t.designLanguage.tiersBody}</CardDescription>
                </div>
                <TierSwitcher />
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── FAQ (schema-ready) ─────────────────── */}
      <section className="df-container df-container-wide df-section">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">{t.faq.eyebrow}</p>
            <h2 className="mt-4 text-h2 text-[var(--df-color-text-strong)]">
              {t.faq.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {t.faq.note}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <Accordion
              exclusive
              defaultOpenId="q1"
              items={[
                { id: 'q1', question: t.faq.what, answer: t.faq.whatAnswer },
                { id: 'q2', question: t.faq.firm, answer: t.faq.firmAnswer },
                { id: 'q3', question: t.faq.freshness, answer: t.faq.freshnessAnswer },
                { id: 'q4', question: t.faq.security, answer: t.faq.securityAnswer },
                { id: 'q5', question: t.faq.bangla, answer: t.faq.banglaAnswer },
                { id: 'q6', question: t.faq.today, answer: t.faq.todayAnswer },
              ]}
            />
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── FINAL CTA ─────────────────── */}
      <section className="relative isolate overflow-hidden border-t border-[var(--df-color-border-quiet)] df-grain">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[var(--df-gradient-ocean)]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 df-atmosphere" />

        <div className="df-container df-container-wide df-section text-center">
          <Reveal>
            <h2 className="mx-auto max-w-[22ch] text-h2 text-[var(--df-color-text-strong)]">
              {t.finalCta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-[54ch] text-bodyLg text-muted">
              {t.finalCta.body}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href={localeHref(locale, '/book-consultation')} size="lg" magnetic>
                {dict.common.bookConsultation}
              </ButtonLink>
              <LocaleLink
                locale={locale}
                href="/design-system"
                className="inline-flex h-12 items-center rounded-lg border border-[var(--df-color-border)] px-6 text-sm font-semibold text-[var(--df-color-text)] no-underline transition-colors duration-[var(--df-duration-fast)] hover:bg-surface-tint"
              >
                {dict.common.exploreDesignSystem}
              </LocaleLink>
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-[var(--df-color-muted-2)]">
              {dict.common.disclaimer}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
