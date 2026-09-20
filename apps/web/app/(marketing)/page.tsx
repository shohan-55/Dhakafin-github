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

export const metadata: Metadata = {
  title: 'DhakaFin — Make Better Financial Decisions.',
  description:
    'Financial intelligence, accounting, tax and VAT compliance for Bangladeshi businesses. Phase 1: the design system and engineering foundation.',
};

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
export default function HomePage() {
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
                    Financial intelligence for Bangladesh
                  </p>
                  <Badge tone="sea" size="sm">
                    Phase 1 · Foundation
                  </Badge>
                </div>
              </Reveal>

              <Reveal delay={60}>
                <h1 className="mt-6 max-w-[16ch] text-display text-[var(--df-color-text-strong)]">
                  Make Better <span className="text-sea-400">Financial</span> Decisions.
                </h1>
              </Reveal>

              <Reveal delay={120}>
                <p className="mt-6 max-w-[58ch] text-bodyLg text-muted">
                  Accounting, audit, tax, VAT and financial intelligence built around one goal — helping businesses
                  understand their numbers, control their costs and move forward with confidence.
                </p>
              </Reveal>

              <Reveal delay={180}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <ButtonLink href="/design-system" size="lg" magnetic>
                    Explore the design system
                  </ButtonLink>
                  <ButtonLink href="/book-consultation" variant="secondary" size="lg">
                    Book a Consultation
                  </ButtonLink>
                </div>
              </Reveal>

              <Reveal delay={240}>
                <p className="mt-8 max-w-[52ch] border-l-2 border-sea-500/40 pl-4 text-sm italic leading-relaxed text-muted">
                  Numbers tell you what happened. Intelligence tells you what to do next.
                </p>
              </Reveal>
            </div>

            {/* Right column — the "instrument panel" first impression */}
            <Reveal delay={120} className="lg:pt-2">
              <Card tone="glass" padding="none" className="overflow-hidden">
                <div className="flex items-center justify-between gap-4 border-b border-[var(--df-color-border-quiet)] px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ok" />
                    <span className="text-xs font-medium text-[var(--df-color-text)]">Control terminal</span>
                  </div>
                  <Badge tone="sample" size="sm">
                    Sample data
                  </Badge>
                </div>

                <div className="space-y-3 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Books reconciled', value: '98%', note: 'Aug 2026' },
                      { label: 'Next filing', value: '6 days', note: 'Mushak 9.1' },
                      { label: 'Cash runway', value: '7.2 mo', note: 'at current burn' },
                      { label: 'Open flags', value: '3', note: '1 high' },
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
                      Money flow · signature motion
                    </p>
                    <svg viewBox="0 0 320 56" className="mt-3 h-14 w-full" role="img" aria-label="Animated data stream from revenue to net profit">
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
                      <span>Revenue</span>
                      <span className="text-sea-300">Profit core</span>
                      <span>Net profit</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--df-color-border-quiet)] bg-surface2/40 px-5 py-3">
                  <p className="text-[11px] leading-relaxed text-[var(--df-color-muted-2)]">
                    Illustrative interface. Live dashboards, real business data and the full command centre ship in
                    Phase 6.
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
            title="Phase 1 build — this is the foundation, not the finished homepage"
            action={{ label: 'See what is built and what is next', href: '/design-system' }}
          >
            The token pipeline, component library, motion language, experience tiers, accessibility baseline and CI
            quality gates are in place. The signature homepage (WebGL financial universe), the money-flow experience,
            the rate hub, the 13 tools and the SaaS portal follow in Phases 2–7 as specified in the master roadmap.
          </Alert>
        </Reveal>
      </section>

      {/* ─────────────────── INTELLIGENCE COMPONENTS ─────────────────── */}
      <section className="df-container df-container-wide df-section">
        <Reveal>
          <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">Signature components</p>
          <h2 className="mt-4 max-w-[24ch] text-h2 text-[var(--df-color-text-strong)]">
            Numbers that explain themselves.
          </h2>
          <p className="mt-4 max-w-[62ch] text-bodyLg text-muted">
            A bare figure is not intelligence. Every KPI in DhakaFin carries its delta, a plain-language judgement, the
            driver behind the change and the period it refers to — so a business owner knows what to do next, not just
            what happened.
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <KpiRow columns={4}>
            <KpiTile
              label="Revenue"
              value={1250000}
              delta={18.4}
              qualifier="Growth accelerating"
              driver={{ text: 'Sales volume, not price', href: '/design-system#kpi' }}
              period="Jul 2026 · vs Jun 2026 · from books"
              sample
            />
            <KpiTile
              label="Gross profit"
              value={410000}
              delta={9.1}
              qualifier="Margin holding steady"
              driver={{ text: 'Direct cost in line with sales' }}
              period="Jul 2026 · vs Jun 2026 · from books"
              sample
            />
            <KpiTile
              label="Net profit"
              value={190000}
              delta={-2.3}
              qualifier="Margin softening"
              driver={{ text: 'Payroll up 22% vs output 6%', href: '/design-system#kpi' }}
              period="Jul 2026 · vs Jun 2026 · from books"
              sample
            />
            <KpiTile
              label="Cash position"
              value={320000}
              delta={0.8}
              qualifier="Runway steady"
              driver={{ text: 'Receivables ageing in 60+ days' }}
              period="Jul 2026 · vs Jun 2026 · from bank"
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
              <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">Regulatory trust</p>
              <h2 className="mt-4 max-w-[22ch] text-h2 text-[var(--df-color-text-strong)]">
                Every rate shows its source. Every time.
              </h2>
              <p className="mt-4 max-w-[54ch] text-bodyLg text-muted">
                A rate without provenance is a liability. The rate card component cannot render without an effective
                date, a reference and a named verifier — the database, the API contract and the component all enforce
                the same rule, and CI fails the build if a rate value is ever hardcoded into the frontend.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  { term: 'Effective date', text: 'The date the rate took legal effect, not the date we published it.' },
                  { term: 'Reference / SRO', text: 'The instrument that changed it, linked to the official PDF.' },
                  { term: 'Verified', text: 'Who checked it against the source, and when — refreshed on a 45-day cycle.' },
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
                title="Contractor / sub-contractor payments"
                sectionRef="89"
                rateType="percent"
                value={7.5}
                base="Gross payment"
                applicability="Payments to resident contractors, sub-contractors and suppliers for works"
                taxpayerType="Resident"
                effectiveFrom="01 Jul 2025"
                previousValue={7.5}
                provenance={{
                  referenceSro: 'SRO 173-AIN/2025',
                  verifiedAt: '12 Sep 2026',
                  verifiedBy: 'DhakaFin tax team',
                }}
                status="current"
                fiscalYear="FY 2025–26"
                sample
                onViewDetailHref="/design-system#rate-card"
              />

              <div className="mt-4">
                <Alert
                  tone="regulatory"
                  title="Rate values on this page are placeholders"
                >
                  The rows above demonstrate the component&apos;s structure with clearly-marked sample values. The rate
                  database — with historical versions, SRO links and comparison across fiscal years — is built in
                  Phase 3, and no rate ships until a named reviewer verifies it against the official source.
                </Alert>
              </div>

              <div className="mt-4">
                <ProvenanceNote verifiedAt="12 Sep 2026" verifiedBy="DhakaFin tax team" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────────────── COMPLIANCE CALM ─────────────────── */}
      <section className="df-container df-container-wide df-section">
        <Reveal>
          <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">Compliance intelligence</p>
          <h2 className="mt-4 max-w-[26ch] text-h2 text-[var(--df-color-text-strong)]">
            Urgency that stays calm.
          </h2>
          <p className="mt-4 max-w-[62ch] text-bodyLg text-muted">
            Deadlines escalate through four deliberate states and nothing else. No flashing, no countdown clocks, no
            red flooding — the interface should feel intelligent, not stressful. Each item names what it is, who owns
            it, what is still missing and what happens next.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <Reveal delay={60}>
            <DeadlineItem
              title="VAT Return — August 2026"
              formRef="Mushak 9.1"
              daysRemaining={6}
              dueDate="15 Oct 2026"
              requirements={{
                description: 'Needs: sales register, purchase register, input tax credit ledger',
                met: 2,
                total: 3,
              }}
              owner="DhakaFin consultant"
              primaryAction={{ label: 'Upload remaining document', href: '/design-system' }}
            />
          </Reveal>

          <Reveal delay={120}>
            <DeadlineItem
              title="TDS Deposit — September 2026"
              formRef="Section 89–90"
              daysRemaining={11}
              dueDate="15 Oct 2026"
              owner="You"
              primaryAction={{ label: 'Review deduction schedule', href: '/design-system' }}
            />
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── MATERIALS & MOTION ─────────────────── */}
      <section className="border-y border-[var(--df-color-border-quiet)] bg-[var(--df-color-slate-deep)]">
        <div className="df-container df-container-wide df-section">
          <Reveal>
            <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">Design language</p>
            <h2 className="mt-4 max-w-[24ch] text-h2 text-[var(--df-color-text-strong)]">
              Ten principles, one system.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Depth with purpose',
                body: 'Five layers — canvas, grid, context, element, overlay — each one expressing a level of information, never decoration.',
                tag: '3D',
              },
              {
                title: 'Motion with meaning',
                body: 'Three motion layers with fixed durations: structure 560–900ms, component 120–320ms, detail 60–160ms. Detail never outruns component.',
                tag: '4D',
              },
              {
                title: 'Scroll that tells the story',
                body: 'Pinned sequences are capped at two per page and always degrade to a static, complete layout.',
                tag: '5D',
              },
              {
                title: 'Data you can interrogate',
                body: 'Charts animate their draw, never the data. Hover, keyboard and a data-table fallback reach the same numbers.',
                tag: '6D',
              },
              {
                title: 'Context-aware by design',
                body: 'Four experience tiers detect the device, the connection and the user’s motion preference, then drop heavy effects without dropping features.',
                tag: '7D',
              },
              {
                title: 'Continuity across sections',
                body: 'Selecting a node updates the insight rail, the chart, the related service and the URL together — one interaction, one state.',
                tag: '9D',
              },
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
                  <CardTitle as="h3">Experience tiers</CardTitle>
                  <CardDescription>
                    The full experience on capable hardware; a complete, fast, fully usable product everywhere else.
                    The “Reduce effects” switch in the footer is the accessibility escape hatch — it is honoured
                    before the first paint.
                  </CardDescription>
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
            <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">Questions</p>
            <h2 className="mt-4 text-h2 text-[var(--df-color-text-strong)]">
              What DhakaFin is — and is not.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              These six answers carry FAQPage structured data on the production homepage in Phase 2.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <Accordion
              exclusive
              defaultOpenId="q1"
              items={[
                {
                  id: 'q1',
                  question: 'What does DhakaFin actually do?',
                  answer:
                    'Three connected layers: a free public intelligence hub (verified tax, VAT, TDS and VDS rates, a compliance calendar and 13 calculators), a SaaS platform for running your books, documents and compliance, and professional services delivered by accountants, tax specialists and analysts.',
                },
                {
                  id: 'q2',
                  question: 'Is DhakaFin a chartered accountancy firm?',
                  answer:
                    'DhakaFin is a financial intelligence and compliance platform backed by professional financial services. We do not claim to be a CA firm; statutory audits are coordinated with licensed auditors, and our team page names the qualifications of every professional who works on your account.',
                },
                {
                  id: 'q3',
                  question: 'How often are the rates updated?',
                  answer:
                    'Every rate row carries an effective date, a source link and the name of the person who verified it. Our commitment is to publish NBR changes within 24–48 working hours, and every family is re-verified on a 45-day cycle. The rate database ships in Phase 3.',
                },
                {
                  id: 'q4',
                  question: 'Is my financial data safe?',
                  answer:
                    'Documents live in a private storage bucket and are reachable only through time-limited signed links. Every download is logged, access is scoped per business, and the portal enforces role-based permissions. The full security architecture is specified in the master roadmap.',
                },
                {
                  id: 'q5',
                  question: 'Do you support Bangla?',
                  answer:
                    'Yes. The design system ships a Bangla typeface, Bangla numerals and lakh-crore number formatting from day one, and the public content is written in both languages rather than machine-translated.',
                },
                {
                  id: 'q6',
                  question: 'What can I use today?',
                  answer:
                    'Right now: the design system and this foundation build. The rate hub and tools arrive in Phases 3 and 4, the SaaS portal in Phases 5–6. The master roadmap in the repository lists every task and gate, so you can see exactly where the build stands.',
                },
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
              Make Better Financial Decisions.
            </h2>
            <p className="mx-auto mt-5 max-w-[54ch] text-bodyLg text-muted">
              Numbers tell you what happened. Intelligence tells you what to do next.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/book-consultation" size="lg" magnetic>
                Book a Consultation
              </ButtonLink>
              <ButtonLink href="/design-system" variant="secondary" size="lg">
                Explore the design system
              </ButtonLink>
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-[var(--df-color-muted-2)]">
              General information based on published NBR sources — not professional advice for your specific case.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
