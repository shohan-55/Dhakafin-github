import type { Metadata } from 'next';

import { CtaBand, Section } from '@/components/marketing/Sections';
import { ServiceEcosystem, ServiceIndexList } from '@/components/marketing/ServiceEcosystem';
import { ButtonLink } from '@/components/ui/Button';
import { getDictionary } from '@/lib/dictionary';
import { localeHref, resolveLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';

/**
 * /services — the ecosystem hub (blueprint §5.6.2).
 *
 * The page answers one question before it sells anything: how do these nine fit
 * together, and which one do I need. That ordering is deliberate — a visitor who
 * cannot place themselves in the map will not read a pricing table.
 */
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'bn' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: '/services',
    title: dict.services.metaTitle,
    description: dict.services.metaDescription,
  });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale: Locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const copy = dict.services;

  return (
    <>
      {/* Block 1 — hero */}
      <section className="relative isolate overflow-hidden border-b border-[var(--df-color-border-quiet)]">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[var(--df-gradient-depth)]" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-px bg-[var(--df-gradient-sealine)] opacity-50" />
        <div className="df-container df-container-wide pt-12 pb-16 lg:pt-16 lg:pb-20">
          <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">{copy.eyebrow}</p>
          <h1 className="mt-4 max-w-[22ch] text-display text-strong">{copy.title}</h1>
          <p className="mt-6 max-w-[64ch] text-body-lg text-muted">{copy.lede}</p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {copy.chips.map((chip) => (
              <li
                key={chip.label}
                className="rounded-full border border-[var(--df-color-border-quiet)] px-3 py-1 text-xs text-muted"
              >
                {chip.label}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={localeHref(locale, '/book-consultation')} size="lg" magnetic>
              {copy.cta.primary}
            </ButtonLink>
            <ButtonLink href={localeHref(locale, '/contact')} variant="secondary" size="lg">
              {copy.cta.secondary}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Block 2 — the ecosystem */}
      <Section
        id="ecosystem"
        eyebrow={copy.groups.foundations}
        title={copy.ecosystem.title}
        lede={copy.ecosystem.lede}
      >
        {/* Desktop and mobile are the same markup at different breakpoints, so the
            tab order is 01→09 everywhere and there is no separate mobile diagram. */}
        <ServiceEcosystem locale={locale} copy={copy} servicesCopy={copy} />

        <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-[var(--df-color-border-quiet)] pt-6">
          <p className="flex items-center gap-2 text-xs text-[var(--df-color-muted)]">
            <span aria-hidden="true" className="h-px w-8 bg-[var(--df-color-sea-400)]" />
            {copy.ecosystem.legendPrimary}
          </p>
          <p className="flex items-center gap-2 text-xs text-[var(--df-color-muted)]">
            <span aria-hidden="true" className="h-px w-8 border-t border-dashed border-[var(--df-color-border-quiet)]" />
            {copy.ecosystem.legendSupport}
          </p>
        </div>
      </Section>

      {/* Block 3 — choose by problem, industry or diagnostic */}
      <Section tone="deep" title={copy.chooseBy.title}>
        <div className="grid gap-4 md:grid-cols-3">
          {(
            [
              { title: copy.chooseBy.problem, hint: copy.chooseBy.problemHint, href: '/services#ecosystem' },
              { title: copy.chooseBy.industry, hint: copy.chooseBy.industryHint, href: '/industries/manufacturing' },
              { title: copy.chooseBy.diagnostic, hint: copy.chooseBy.diagnosticHint, href: '/diagnostic' },
            ] as const
          ).map((card) => (
            <a
              key={card.title}
              href={localeHref(locale, card.href)}
              className="group rounded-2xl border border-[var(--df-color-border-quiet)] bg-surface1 p-6 no-underline transition-[border-color,transform] duration-[var(--df-duration-base)] hover:-translate-y-0.5 hover:border-[var(--df-color-border-hover)] motion-reduce:hover:translate-y-0"
            >
              <h3 className="text-base font-semibold text-[var(--df-color-text-strong)] group-hover:text-sea-300">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{card.hint}</p>
            </a>
          ))}
        </div>
      </Section>

      {/* Block 4 — the nine as a grouped index, with a motif each */}
      <Section eyebrow={copy.eyebrow} title={copy.groups.foundations}>
        <ServiceIndexList locale={locale} servicesCopy={copy} groupLabels={copy.groups} />
      </Section>

      {/* Block 5 — CTA */}
      <CtaBand
        title={copy.cta.title}
        body={copy.cta.body}
        primary={{ label: copy.cta.primary, href: localeHref(locale, '/book-consultation') }}
        secondary={{ label: copy.cta.secondary, href: localeHref(locale, '/contact') }}
        footnote={copy.cta.footnote}
      />
    </>
  );
}
