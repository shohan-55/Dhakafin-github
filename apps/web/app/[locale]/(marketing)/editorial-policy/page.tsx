import type { Metadata } from 'next';

import { CtaBand, Section } from '@/components/marketing/Sections';
import { Reveal } from '@/components/system/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TableWrap, TEmptyRow, TH, TR, TD } from '@/components/ui/Table';
import {
  corrections,
  editorialRoleIds,
  pipelineStageIds,
  refusalIds,
  type EditorialRoleId,
  type PipelineStageId,
  type RefusalId,
} from '@/lib/content/editorial';
import { getDictionary } from '@/lib/dictionary';
import { localeHref, resolveLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';

/**
 * /editorial-policy — DF-P2-025, blueprint L269 / L2362 / L3049.
 * ---------------------------------------------------------------------------
 * This page is the reason a stranger should believe the rest of the site, so it
 * is written to be checkable rather than reassuring. Three things make that
 * concrete:
 *
 *   · **The source rule is stated with its current consequence.** No rate is
 *     published yet, because the rate service is not built — and the page says so
 *     in the section about sourcing rather than in a footnote. A policy that
 *     describes a capability the site does not have is marketing.
 *   · **The correction log is a rendered list, not a promise.** It is empty
 *     today, and the empty state says why: an entry appears when a published
 *     fact changes. When the first correction is made, it is added to
 *     `lib/content/editorial.ts` and appears here with its date.
 *   · **The refusals name the temptation.** "A rate without its source" and "a
 *     saving without a sample" are the two things this practice is most likely to
 *     be pushed toward, and both are on the record.
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
    path: '/editorial-policy',
    title: dict.editorial.meta.metaTitle,
    description: dict.editorial.meta.metaDescription,
  });
}

export default async function EditorialPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale: Locale = resolveLocale((await params).locale);
  const copy = getDictionary(locale).editorial;

  const reportHref = `${localeHref(locale, '/contact')}?intent=correction`;
  const pricingHref = localeHref(locale, '/pricing');

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

      {/* ── Where a number comes from ────────────────────────────────────── */}
      <Section
        id="source-rule"
        title={copy.sections['source-rule'].title}
        lede={copy.sections['source-rule'].lede}
        tone="deep"
      >
        <div className="space-y-5">
          {copy.sections['source-rule'].body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="max-w-3xl text-body leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
            {copy.sourceAnatomy.heading}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            {copy.sourceAnatomy.intro}
          </p>

          <div className="mt-5">
            <TableWrap caption={copy.sourceAnatomy.heading}>
              <tbody>
                {copy.sourceAnatomy.items.map((item) => (
                  <TR key={item.label} hoverable={false}>
                    <TD className="w-44 text-sm font-medium text-sea-300">{item.label}</TD>
                    <TD className="text-sm leading-relaxed text-muted">{item.what}</TD>
                  </TR>
                ))}
              </tbody>
            </TableWrap>
          </div>

          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted">
            {copy.sourceAnatomy.footnote}
          </p>
        </div>
      </Section>

      {/* ── Who writes, who verifies ─────────────────────────────────────── */}
      <Section
        id="who-publishes"
        title={copy.sections['who-publishes'].title}
        lede={copy.sections['who-publishes'].lede}
      >
        <div className="space-y-5">
          {copy.sections['who-publishes'].body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="max-w-3xl text-body leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {editorialRoleIds.map((id, index) => {
            const role = copy.roles[id as EditorialRoleId];
            return (
              <Reveal as="li" key={id} index={index}>
                <Card tone="quiet" padding="lg" className="h-full">
                  <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
                    {role.title}
                  </h3>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                    {copy.rolesAccountableLabel}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{role.accountable}</p>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--df-color-risk)]">
                    {copy.rolesCannotLabel}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{role.cannot}</p>
                </Card>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      {/* ── The pipeline ─────────────────────────────────────────────────── */}
      <Section
        id="pipeline"
        title={copy.sections.pipeline.title}
        lede={copy.sections.pipeline.lede}
        tone="deep"
      >
        <div className="space-y-5">
          {copy.sections.pipeline.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="max-w-3xl text-body leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>

        <ol className="mt-8 space-y-4 border-s border-[var(--df-color-border-quiet)] ps-6">
          {pipelineStageIds.map((id, index) => {
            const stage = copy.pipeline[id as PipelineStageId];
            return (
              <Reveal as="li" key={id} index={index} className="relative">
                <span
                  aria-hidden="true"
                  className="df-num absolute -start-[35px] top-0 grid h-6 w-6 place-items-center rounded-full border border-sea-500/50 bg-void text-[10px] font-bold text-sea-300"
                >
                  {index + 1}
                </span>
                <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
                  {stage.title}
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{stage.body}</p>
              </Reveal>
            );
          })}
        </ol>
      </Section>

      {/* ── Dates ────────────────────────────────────────────────────────── */}
      <Section id="dates" title={copy.sections.dates.title} lede={copy.sections.dates.lede}>
        <div className="space-y-5">
          {copy.sections.dates.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="max-w-3xl text-body leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      {/* ── AI ───────────────────────────────────────────────────────────── */}
      <Section
        id="artificial-intelligence"
        title={copy.sections['artificial-intelligence'].title}
        lede={copy.sections['artificial-intelligence'].lede}
        tone="deep"
      >
        <div className="space-y-5">
          {copy.sections['artificial-intelligence'].body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="max-w-3xl text-body leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[var(--df-color-border-quiet)] bg-void/30 p-6">
            <div className="flex items-center gap-3">
              <Badge tone="sea" size="sm" glyph="✓">
                {copy.ai.mayHeading}
              </Badge>
            </div>
            <ul className="mt-4 space-y-3">
              {copy.ai.mayItems.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[var(--df-color-border-quiet)] bg-void/30 p-6">
            <div className="flex items-center gap-3">
              <Badge tone="risk" size="sm" glyph="✕">
                {copy.ai.mayNotHeading}
              </Badge>
            </div>
            <ul className="mt-4 space-y-3">
              {copy.ai.mayNotItems.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── Corrections ──────────────────────────────────────────────────── */}
      <Section
        id="corrections"
        title={copy.sections.corrections.title}
        lede={copy.sections.corrections.lede}
      >
        <div className="space-y-5">
          {copy.sections.corrections.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="max-w-3xl text-body leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-[var(--df-color-border-quiet)] bg-surface1 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--df-color-gold-bright)]">
            {copy.corrections.slaLabel}
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            {copy.corrections.slaBody}
          </p>
        </div>

        <h3 className="mt-10 text-base font-semibold text-[var(--df-color-text-strong)]">
          {copy.corrections.logHeading}
        </h3>

        <div className="mt-4">
          <TableWrap caption={copy.corrections.logHeading} stickyHeader={false}>
            <thead>
              <TR>
                <TH scope="col" className="df-num w-32 px-4 py-3 text-start text-xs uppercase tracking-[0.1em] text-muted">
                  {copy.corrections.logColumns.date}
                </TH>
                <TH scope="col" className="px-4 py-3 text-start text-xs uppercase tracking-[0.1em] text-muted">
                  {copy.corrections.logColumns.page}
                </TH>
                <TH scope="col" className="px-4 py-3 text-start text-xs uppercase tracking-[0.1em] text-muted">
                  {copy.corrections.logColumns.what}
                </TH>
                <TH scope="col" className="px-4 py-3 text-start text-xs uppercase tracking-[0.1em] text-muted">
                  {copy.corrections.logColumns.verifiedBy}
                </TH>
              </TR>
            </thead>
            <tbody>
              {corrections.length === 0 ? (
                <TEmptyRow colSpan={4}>{copy.corrections.logEmpty}</TEmptyRow>
              ) : (
                corrections.map((entry) => (
                  <TR key={`${entry.date}-${entry.page}`} hoverable={false}>
                    <TD className="df-num text-sm text-[var(--df-color-text)]">{entry.date}</TD>
                    <TD className="df-num text-sm text-sea-300">{entry.page}</TD>
                    <TD className="text-sm leading-relaxed text-muted">{entry.what}</TD>
                    <TD className="text-sm text-[var(--df-color-text)]">{entry.verifiedBy}</TD>
                  </TR>
                ))
              )}
            </tbody>
          </TableWrap>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-dashed border-[var(--df-color-border-strong)] p-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[var(--df-color-text-strong)]">
              {copy.corrections.reportLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{copy.corrections.reportBody}</p>
          </div>
          <ButtonLink href={reportHref} variant="secondary">
            {copy.corrections.reportCta}
          </ButtonLink>
        </div>
      </Section>

      {/* ── What we will not publish ─────────────────────────────────────── */}
      <Section
        id="refusals"
        title={copy.sections.refusals.title}
        lede={copy.sections.refusals.lede}
        tone="deep"
      >
        <div className="space-y-5">
          {copy.sections.refusals.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="max-w-3xl text-body leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {refusalIds.map((id, index) => {
            const refusal = copy.refusals[id as RefusalId];
            return (
              <Reveal as="li" key={id} index={index}>
                <Card tone="context" padding="lg" className="h-full">
                  <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
                    {refusal.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{refusal.body}</p>
                </Card>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      <CtaBand
        title={copy.cta.title}
        body={copy.cta.body}
        primary={{ label: copy.cta.primaryLabel, href: reportHref }}
        secondary={{ label: copy.cta.secondaryLabel, href: pricingHref }}
      />
    </div>
  );
}
