import type { Metadata } from 'next';

import { CtaBand, Section } from '@/components/marketing/Sections';
import { Reveal } from '@/components/system/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TableWrap, TR, TD } from '@/components/ui/Table';
import {
  engagementRoles,
  flywheelNodes,
  storyStages,
  valueIds,
  type EngagementRoleId,
  type FlywheelNodeId,
  type StoryStageId,
  type ValueId,
} from '@/lib/content/about';
import { getDictionary } from '@/lib/dictionary';
import { formatNumber } from '@/lib/format';
import { localeHref, resolveLocale, type Locale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';

/**
 * /about — DF-P2-025, blueprint F3.
 * ---------------------------------------------------------------------------
 * F3 asks for a story, a philosophy, the flywheel, leadership, values, location
 * and a careers link. The first, second, third and fifth are here in full; the
 * fourth is here as roles and authority boundaries rather than as faces, because
 * the acceptance line beside it is "no placeholder bios" and a verified
 * credential is not something a page can invent.
 *
 * The two signature elements F3 names are built and marked up properly:
 *
 *   · the **story spine** is a real ordered list, revealed with the site's motion
 *     primitive (fade + rise, once, nothing under `prefers-reduced-motion`), not a
 *     decorative line;
 *   · the **philosophy quote** is a full-bleed typographic moment — the one place
 *     on the site where type is allowed to be the whole design, because the
 *     sentence is the product claim everything else in the practice follows from.
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
    path: '/about',
    title: dict.about.meta.metaTitle,
    description: dict.about.meta.metaDescription,
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale: Locale = resolveLocale((await params).locale);
  const copy = getDictionary(locale).about;

  const careersHref = `${localeHref(locale, '/contact')}?intent=careers`;
  const bookHref = `${localeHref(locale, '/book-consultation')}?intent=about`;
  const pricingHref = localeHref(locale, '/pricing');

  /* The marketing layout owns the single main landmark and the skip-link
     target. A page that renders its own would nest landmarks and duplicate the
     id, so this wrapper is a plain div for exactly that reason. */
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="df-container pb-14 pt-16 sm:pt-24">
        <Breadcrumb
          items={[{ label: 'DhakaFin', href: localeHref(locale, '/') }, { label: copy.hero.eyebrow }]}
          label={copy.hero.eyebrow}
        />

        <div className="mt-8 max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sea-400">
            {copy.hero.eyebrow}
          </p>
          <h1 className="mt-3 text-display font-semibold text-[var(--df-color-text-strong)]">
            {copy.hero.title}
          </h1>
          <p className="mt-6 max-w-3xl text-body-lg leading-relaxed text-[var(--df-color-text)]">
            {copy.hero.lede}
          </p>
          <p className="mt-5 max-w-3xl border-l-2 border-[var(--df-color-sea-400)] ps-4 text-sm leading-relaxed text-muted">
            {copy.hero.premise}
          </p>

          <ul className="mt-7 flex flex-wrap gap-2.5">
            {copy.hero.chips.map((chip) => (
              <li key={chip.label}>
                <Badge tone="sea" size="sm">
                  {chip.label}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Philosophy: the full-bleed typographic moment ────────────────── */}
      <section className="relative isolate overflow-hidden border-y border-[var(--df-color-border-quiet)] df-grain">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[var(--df-gradient-ocean)]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 df-atmosphere" />

        <figure className="df-container df-container-reading df-section">
          <blockquote>
            <p className="text-h1 font-semibold leading-[1.15] text-[var(--df-color-text-strong)]">
              <span aria-hidden="true" className="me-1 text-sea-400">
                “
              </span>
              {copy.philosophy.quote}
              <span aria-hidden="true" className="ms-1 text-sea-400">
                ”
              </span>
            </p>
          </blockquote>
          <figcaption className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--df-color-muted)]">
            {copy.philosophy.attribution}
          </figcaption>
          <p className="mt-8 text-body leading-relaxed text-muted">{copy.philosophy.body}</p>
        </figure>
      </section>

      {/* ── Story spine ──────────────────────────────────────────────────── */}
      <Section id="story" title={copy.story.heading} lede={copy.story.lede}>
        <ol className="relative space-y-10 border-s border-[var(--df-color-border-quiet)] ps-6 sm:ps-8">
          {storyStages.map((id, index) => {
            const stage = copy.story.stages[id as StoryStageId];
            return (
              <Reveal as="li" key={id} index={index} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -start-[calc(1.5rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-sea-400 sm:-start-[calc(2rem+5px)]"
                />
                <p className="df-num text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--df-color-muted)]">
                  {stage.marker}
                </p>
                <h3 className="mt-2 text-h3 font-semibold text-[var(--df-color-text-strong)]">
                  {stage.title}
                </h3>
                <p className="mt-3 max-w-3xl text-body leading-relaxed text-muted">{stage.body}</p>
              </Reveal>
            );
          })}
        </ol>
      </Section>

      {/* ── The flywheel ─────────────────────────────────────────────────── */}
      <Section id="flywheel" title={copy.flywheel.heading} lede={copy.flywheel.lede} tone="deep">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-center">
          <FlywheelDiagram
            numbers={flywheelNodes.map((_, index) => formatNumber(index + 1, locale === 'bn' ? 'bn' : 'latin'))}
            label={copy.flywheel.loopLabel}
            engineNote={copy.flywheel.engineLabel}
          />

          <ol className="grid gap-4 sm:grid-cols-2">
            {flywheelNodes.map((id, index) => (
              <Reveal as="li" key={id} index={index}>
                <div className="flex h-full gap-3 rounded-xl border border-[var(--df-color-border-quiet)] bg-void/30 p-4">
                  <span className="df-num mt-0.5 text-xs font-semibold text-sea-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm leading-relaxed text-[var(--df-color-text)]">
                    {copy.flywheel.nodes[id as FlywheelNodeId]}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <p className="mt-8 max-w-3xl border-l-2 border-[var(--df-color-gold)] ps-4 text-sm leading-relaxed text-muted">
          <span className="font-semibold text-gold-bright">{copy.flywheel.engineLabel}. </span>
          {copy.flywheel.engineNote}
        </p>
      </Section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <Section id="values" title={copy.values.heading} lede={copy.values.lede}>
        <ul className="space-y-4">
          {valueIds.map((id, index) => {
            const value = copy.values.items[id as ValueId];
            return (
              <Reveal as="li" key={id} index={index}>
                <Card tone="quiet" padding="lg">
                  <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <div>
                      <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
                        {value.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{value.body}</p>
                    </div>
                    <div className="md:border-s md:border-[var(--df-color-border-quiet)] md:ps-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--df-color-muted)]">
                        {copy.values.behaviourLabel}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-sea-300">{value.behaviour}</p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      {/* ── Roles: who does what, and what they cannot do ────────────────── */}
      <Section id="roles" title={copy.roles.heading} lede={copy.roles.lede} tone="deep">
        <ul className="grid gap-5 md:grid-cols-2">
          {engagementRoles.map((id, index) => {
            const role = copy.roles.items[id as EngagementRoleId];
            return (
              <Reveal as="li" key={id} index={index}>
                <Card tone="context" padding="lg" className="h-full">
                  <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
                    {role.title}
                  </h3>

                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--df-color-muted)]">
                    {copy.roles.accountableLabel}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{role.accountable}</p>

                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--df-color-risk)]">
                    {copy.roles.cannotLabel}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{role.cannot}</p>
                </Card>
              </Reveal>
            );
          })}
        </ul>

        {/*
          The honest answer to "where are the faces?". F3 asks for named people
          and forbids placeholder bios; this states the verification rule instead
          of inventing a name to fill the gap.
        */}
        <p className="mt-8 max-w-3xl rounded-xl border border-dashed border-[var(--df-color-border-strong)] bg-void/30 p-5 text-xs leading-relaxed text-[var(--df-color-muted)]">
          {copy.roles.profilesNote}
        </p>
      </Section>

      {/* ── Location ─────────────────────────────────────────────────────── */}
      <Section id="location" title={copy.location.heading}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start">
          <div>
            <p className="max-w-3xl text-body leading-relaxed text-muted">{copy.location.body}</p>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[var(--df-color-muted)]">
              {copy.location.note}
            </p>
          </div>

          <TableWrap caption={copy.location.heading} stickyHeader={false}>
            <tbody>
              {copy.location.facts.map((fact) => (
                <TR key={fact.label} hoverable={false}>
                  <TD className="w-1/3 text-xs uppercase tracking-[0.1em] text-[var(--df-color-muted)]">
                    {fact.label}
                  </TD>
                  <TD className="text-sm text-[var(--df-color-text)]">{fact.value}</TD>
                </TR>
              ))}
            </tbody>
          </TableWrap>
        </div>
      </Section>

      {/* ── Careers ──────────────────────────────────────────────────────── */}
      <Section id="careers" title={copy.careers.heading} tone="deep">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-3xl text-body leading-relaxed text-muted">{copy.careers.body}</p>
          <ButtonLink href={careersHref} variant="secondary">
            {copy.careers.linkLabel}
          </ButtonLink>
        </div>
      </Section>

      <CtaBand
        title={copy.cta.title}
        body={copy.cta.body}
        primary={{ label: copy.cta.primaryLabel, href: bookHref }}
        secondary={{ label: copy.cta.secondaryLabel, href: pricingHref }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   The flywheel, drawn from the registry
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * §1.2's loop as a ring of eight, with the engine at the centre.
 *
 * The SVG carries no words: node numbers are figures the reader can match to the
 * list beside it, and the centre is the loop arrow itself. That is deliberate —
 * SVG text in Bengali inside a 320px circle either wraps badly or hides content,
 * and the list next to it is the accessible, translatable version of the same
 * eight steps. The whole figure is `role="img"` with a label, and it is
 * decorative *in the semantic sense only*: every fact in it is read out in the
 * list, so nothing is lost when it is announced as an image.
 */
function FlywheelDiagram({
  numbers,
  label,
  engineNote,
}: {
  numbers: string[];
  label: string;
  engineNote: string;
}) {
  const size = 320;
  const centre = size / 2;
  const radius = 118;
  const node = 20;

  const points = numbers.map((_, index) => {
    const angle = (index / numbers.length) * Math.PI * 2 - Math.PI / 2;
    return { x: centre + Math.cos(angle) * radius, y: centre + Math.sin(angle) * radius };
  });

  return (
    <figure className="mx-auto w-full max-w-[22rem]">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full" role="img" aria-label={label}>
        <circle
          cx={centre}
          cy={centre}
          r={radius}
          fill="none"
          stroke="var(--df-color-border-strong)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {points.map((point, index) => {
          const next = points[(index + 1) % points.length] as { x: number; y: number };
          const midAngle = (index + 0.5) * (Math.PI * 2 / numbers.length) - Math.PI / 2;
          const ax = centre + Math.cos(midAngle) * (radius + 12);
          const ay = centre + Math.sin(midAngle) * (radius + 12);
          const angle = Math.atan2(next.y - point.y, next.x - point.x) * (180 / Math.PI);
          return (
            <g key={`node-${index}`}>
              <circle cx={point.x} cy={point.y} r={node} fill="var(--df-color-surface2)" stroke="var(--df-color-sea-500)" />
              <text
                x={point.x}
                y={point.y + 4}
                textAnchor="middle"
                fontSize="11"
                fill="var(--df-color-sea-300)"
              >
                {numbers[index]}
              </text>
              <path
                d={`M ${ax - 5} ${ay - 5} L ${ax + 5} ${ay + 5}`}
                stroke="var(--df-color-sea-400)"
                strokeWidth="1.5"
                transform={`rotate(${angle} ${ax} ${ay})`}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* The engine. §1.2: without regulatory change the loop does not turn. */}
        <circle cx={centre} cy={centre} r="46" fill="var(--df-color-surface1)" stroke="var(--df-color-gold)" strokeDasharray="3 4" />
        <path
          d={`M ${centre - 14} ${centre + 6} a 14 14 0 1 1 6 10`}
          fill="none"
          stroke="var(--df-color-gold-bright)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d={`M ${centre - 16} ${centre + 2} l 3 6 l 6 -3 z`} fill="var(--df-color-gold-bright)" />
      </svg>

      <figcaption className="mt-5 text-center text-xs leading-relaxed text-[var(--df-color-muted)]">
        <span className="font-semibold text-gold-bright">{engineNote}</span>
      </figcaption>
    </figure>
  );
}
