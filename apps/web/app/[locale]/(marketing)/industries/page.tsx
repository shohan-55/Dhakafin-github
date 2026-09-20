import type { Metadata } from 'next';

import { LocaleLink } from '@/components/system/LocaleLink';
import { Reveal } from '@/components/system/Reveal';
import { IndustryMotif } from '@/components/marketing/IndustryMotif';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { industryOrder, industryHref, plannedIndustries, type IndustryAccent } from '@/lib/content/industries';
import { getDictionary } from '@/lib/dictionary';
import { localeHref, resolveLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';
import { cn } from '@/lib/cn';

/**
 * Industries hub — DF-P2-043.
 * ---------------------------------------------------------------------------
 * The three built industries are shown with their motif, their accent and the
 * specific thing each page covers. The eight not yet built are listed too, with
 * the honest label, because a rail that silently omits eight of eleven says
 * nothing about whether yours is missing.
 *
 * Accent rotation comes from the registry (§5.13.2), not from this file: the
 * colour a page uses is a brand decision recorded next to the page's data.
 */

export const generateStaticParams = () => ['en', 'bn'].map((locale) => ({ locale }));

/** Token names per accent. Never a literal — the token guard would fail the build. */
function accentTokens(accent: IndustryAccent) {
  switch (accent) {
    case 'cyan':
      return {
        accent: 'var(--df-color-cyan)',
        muted: 'var(--df-color-border-strong)',
        highlight: 'var(--df-color-cyan)',
        className: 'text-[color-mix(in_srgb,var(--df-color-cyan)_85%,white)]',
      };
    case 'gold':
      return {
        accent: 'var(--df-color-gold)',
        muted: 'var(--df-color-border-strong)',
        highlight: 'var(--df-color-gold-bright)',
        className: 'text-gold-bright',
      };
    default:
      return {
        accent: 'var(--df-color-sea-400)',
        muted: 'var(--df-color-border-strong)',
        highlight: 'var(--df-color-sea-300)',
        className: 'text-sea-300',
      };
  }
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
    path: '/industries',
    title: dict.industries.meta.metaTitle,
    description: dict.industries.meta.metaDescription,
  });
}

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale: Locale = resolveLocale((await params).locale);
  const copy = getDictionary(locale).industries;

  /* The marketing layout owns the single main landmark and the skip-link
     target. A page that renders its own would nest landmarks and duplicate the
     id, so this wrapper is a plain div for exactly that reason. */
  return (
    <div className="df-container py-16 sm:py-24">
      <Breadcrumb
        items={[{ label: 'DhakaFin', href: localeHref(locale, '/') }, { label: copy.hero.eyebrow }]}
        label={copy.hero.eyebrow}
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

      <section className="mt-16" aria-labelledby="industries-live">
        <div className="border-b border-[var(--df-color-border-quiet)] pb-3">
          <h2 id="industries-live" className="text-h3 font-semibold text-[var(--df-color-text-strong)]">
            {copy.rail.heading}
          </h2>
          <p className="mt-1 text-sm text-muted">{copy.rail.lead}</p>
        </div>

        <ul className="mt-8 space-y-5">
          {industryOrder.map((entry, index) => {
            const industry = copy.industries[entry.slug];
            const tokens = accentTokens(entry.accent);
            return (
              <Reveal as="li" key={entry.slug} index={index}>
                <Card tone="context" padding="none" interactive className="overflow-hidden">
                  <div className="grid gap-0 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
                    <div className="flex items-center justify-center border-b border-[var(--df-color-border-quiet)] bg-void/40 p-6 md:border-b-0 md:border-e">
                      <IndustryMotif
                        motif={entry.motif}
                        accent={tokens.accent}
                        muted={tokens.muted}
                        highlight={tokens.highlight}
                        className="h-32 w-full max-w-[18rem]"
                      />
                    </div>

                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge tone="ok" glyph="✓">
                          {copy.rail.liveBadge}
                        </Badge>
                        <span className={cn('text-[11px] font-semibold uppercase tracking-[0.1em]', tokens.className)}>
                          {copy.accents[entry.accent]}
                        </span>
                      </div>

                      <h3 className="mt-4 text-h3 font-semibold text-[var(--df-color-text-strong)]">
                        {industry.name}
                      </h3>
                      <p className="mt-3 max-w-2xl text-body leading-relaxed text-muted">
                        {industry.promise}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--df-color-muted)]">
                        <span>
                          {industry.kpis.items.length} {locale === 'bn' ? 'টি KPI' : 'KPIs'}
                        </span>
                        <span>
                          {industry.pains.items.length}{' '}
                          {locale === 'bn' ? 'টি সাধারণ সমস্যা' : 'recurring pain points'}
                        </span>
                        <span>
                          {entry.services.length}{' '}
                          {locale === 'bn' ? 'টি প্রস্তাবিত সেবা' : 'recommended services'}
                        </span>
                      </div>

                      <LocaleLink
                        locale={locale}
                        href={industryHref(entry.slug)}
                        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-sea-300 underline-offset-4 hover:underline"
                      >
                        {copy.rail.openLabel}
                        <span aria-hidden="true">→</span>
                      </LocaleLink>
                    </div>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* The remaining eight, declared rather than omitted. */}
      <section className="mt-16" aria-labelledby="industries-planned">
        <div className="border-b border-[var(--df-color-border-quiet)] pb-3">
          <h2 id="industries-planned" className="text-h3 font-semibold text-[var(--df-color-text-strong)]">
            {locale === 'bn' ? 'যেগুলো আসছে' : 'In preparation'}
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-muted">{copy.rail.plannedNote}</p>
        </div>

        <ul className="mt-6 flex flex-wrap gap-2.5">
          {plannedIndustries.map((planned) => (
            <li key={planned.slug}>
              <span className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[var(--df-color-border-strong)] px-3 py-1.5 text-sm text-muted">
                {planned.slug.replace(/-/g, ' ')}
                <span className="text-[10px] uppercase tracking-[0.1em] text-[var(--df-color-muted)]">
                  {copy.rail.plannedBadge}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
