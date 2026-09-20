'use client';

import { useState } from 'react';
import { tokens } from '@dhakafin/tokens';

import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card, CardDescription, CardFooter, CardTitle } from '@/components/ui/Card';
import { Chip, ChipGroup } from '@/components/ui/Chip';
import { Field, SelectField, TextareaField, CheckboxField } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Drawer } from '@/components/ui/Drawer';
import { Tabs } from '@/components/ui/Tabs';
import { Accordion } from '@/components/ui/Accordion';
import { Tooltip, GlossaryTerm } from '@/components/ui/Tooltip';
import { ProgressBar, RadialProgress, Stepper } from '@/components/ui/Progress';
import { TH, TD, THead, TR, TableWrap, TEmptyRow } from '@/components/ui/Table';
import { KpiRow, KpiTile } from '@/components/ui/KpiTile';
import { RateCard } from '@/components/ui/RateCard';
import { DeadlineItem } from '@/components/ui/DeadlineItem';
import { Alert, EmptyState, ErrorState, KpiSkeletonRow, ProvenanceNote, Skeleton } from '@/components/ui/States';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { CountUp } from '@/components/system/CountUp';
import { Reveal } from '@/components/system/Reveal';
import { SpotlightCard } from '@/components/system/SpotlightCard';
import { TierSwitcher } from '@/components/system/TierControls';
import { useToast } from '@/components/system/Toast';
import { useExperienceTier, TIER_MANIFEST } from '@/components/system/ExperienceTierProvider';

import { formatBDT, formatDate, formatFiscalYear, parseMoneyInput } from '@/lib/format';
import { contrastRatio, contrastVerdict, formatRatio } from '@/lib/contrast';
import { cn } from '@/lib/cn';

/* ─────────────────────────── helpers ─────────────────────────── */

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[var(--df-color-border-quiet)] pt-12">
      <Reveal>
        <p className="text-overline font-semibold text-sea-400">{eyebrow}</p>
        <h2 className="mt-3 text-h3 text-[var(--df-color-text-strong)]">{title}</h2>
        {description ? <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-muted">{description}</p> : null}
      </Reveal>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Specimen({ label, children, note }: { label: string; children: React.ReactNode; note?: string }) {
  return (
    <div className="rounded-xl border border-[var(--df-color-border-quiet)] bg-surface1/50 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <div className="mt-4">{children}</div>
      {note ? <p className="mt-3 text-xs leading-relaxed text-[var(--df-color-muted)]">{note}</p> : null}
    </div>
  );
}

const COLOUR_GROUPS: { title: string; keys: string[] }[] = [
  {
    title: 'Foundation',
    keys: ['color.void', 'color.voidDeep', 'color.slateDeep', 'color.surface1', 'color.surface2', 'color.surface3'],
  },
  {
    title: 'Sea-green signature spectrum',
    keys: ['color.sea.700', 'color.sea.600', 'color.sea.500', 'color.sea.400', 'color.sea.300', 'color.sea.200'],
  },
  {
    title: 'Secondary',
    keys: ['color.cyan', 'color.cyanDim', 'color.gold', 'color.goldBright', 'color.violetDusk'],
  },
  {
    title: 'Status',
    keys: ['color.ok', 'color.warn', 'color.risk', 'color.danger', 'color.info'],
  },
  {
    title: 'Text & borders',
    keys: [
      'color.text',
      'color.textStrong',
      'color.muted',
      'color.muted2',
      'color.border',
      'color.borderStrong',
      'color.borderHover',
    ],
  },
];

const CONTRAST_PAIRS: { fg: string; bg: string; context: string; level?: 'normal' | 'large' }[] = [
  { fg: 'color.text', bg: 'color.void', context: 'Body text on base' },
  { fg: 'color.textStrong', bg: 'color.void', context: 'Headings on base' },
  { fg: 'color.muted', bg: 'color.void', context: 'Secondary text on base' },
  { fg: 'color.sea.500', bg: 'color.void', context: 'Primary brand on base' },
  { fg: 'color.sea.400', bg: 'color.void', context: 'Accents / focus on base' },
  { fg: 'color.goldBright', bg: 'color.void', context: 'Regulatory badge text' },
  { fg: 'color.text', bg: 'color.surface1', context: 'Body text on card' },
  { fg: 'color.void', bg: 'color.sea.500', context: 'PRIMARY BUTTON (dark on sea-green)' },
  // df-guard-allow: this literal IS the contract — we measure the forbidden value to prove it fails
  { fg: '#ffffff', bg: 'color.sea.500', context: 'FORBIDDEN — white on sea-green' },
  { fg: 'color.muted2', bg: 'color.void', context: 'RESTRICTED — decorative / ≥19px bold only' },
  { fg: 'color.sea.700', bg: 'color.void', context: 'Deep sea — large text & fills only', level: 'large' },
];

const TYPE_SCALE = [
  { token: 'fontSize.display', sample: 'Make Better Financial Decisions.', className: 'text-display', use: 'Hero headline' },
  { token: 'fontSize.h1', sample: 'Regulatory Rate Hub', className: 'text-h1', use: 'Page H1' },
  { token: 'fontSize.h2', sample: 'Where Is Your Money Going?', className: 'text-h2', use: 'Section heading' },
  { token: 'fontSize.h3', sample: 'TDS Rates in Bangladesh', className: 'text-h3', use: 'Card heading' },
  { token: 'fontSize.h4', sample: 'Applicability and conditions', className: 'text-h4', use: 'Panel title' },
  { token: 'fontSize.bodyLg', sample: 'Accounting, audit, tax, VAT and financial intelligence.', className: 'text-body-lg', use: 'Lead paragraph' },
  { token: 'fontSize.body', sample: 'VDS is VAT deducted at source when you pay a service provider.', className: 'text-body', use: 'Body copy' },
  { token: 'fontSize.sm', sample: 'Effective 01 Jul 2025 · SRO 173-AIN/2025', className: 'text-sm', use: 'Secondary / table cell' },
  { token: 'fontSize.xs', sample: 'Last verified 12 Sep 2026', className: 'text-xs', use: 'Caption / timestamp' },
] as const;

function tokenValue(path: string): string {
  return (tokens as Record<string, string>)[path] ?? '—';
}

/* ─────────────────────────── gallery ─────────────────────────── */

export function DesignSystemGallery() {
  const { toast } = useToast();
  const { tier, capabilities, preference } = useExperienceTier();

  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chips, setChips] = useState<string[]>(['vat']);
  const [money, setMoney] = useState('');
  const parsed = parseMoneyInput(money);
  const [emailError, setEmailError] = useState('');

  const NAV = [
    { id: 'status', label: 'Phase status' },
    { id: 'colour', label: 'Colour' },
    { id: 'contrast', label: 'Contrast' },
    { id: 'type', label: 'Typography' },
    { id: 'space', label: 'Space & radius' },
    { id: 'elevation', label: 'Elevation & material' },
    { id: 'buttons', label: 'Buttons' },
    { id: 'forms', label: 'Forms' },
    { id: 'badges', label: 'Badges & chips' },
    { id: 'cards', label: 'Cards' },
    { id: 'kpi', label: 'KPI tiles' },
    { id: 'rate-card', label: 'Rate card' },
    { id: 'deadlines', label: 'Deadlines' },
    { id: 'table', label: 'Table' },
    { id: 'navigation', label: 'Tabs & accordion' },
    { id: 'overlays', label: 'Modal & drawer' },
    { id: 'feedback', label: 'Toasts & alerts' },
    { id: 'states', label: 'Empty, error, loading' },
    { id: 'motion', label: 'Motion' },
    { id: 'tiers', label: 'Experience tiers' },
    { id: 'a11y', label: 'Accessibility' },
  ];

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
      {/* Sticky index */}
      <nav aria-label="Design system sections" className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Sections</p>
        <ul className="mt-4 space-y-1">
          {NAV.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="block rounded-md px-2 py-1.5 text-sm text-muted no-underline transition-colors hover:bg-surface-tint hover:text-[var(--df-color-text)]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 space-y-14">
        {/* ────────────── PHASE STATUS ────────────── */}
        <Section
          id="status"
          eyebrow="DF-P1-005 · DF-P1-006 · DF-P1-015"
          title="Phase 1 — what is actually built"
          description="Honest status, because a design system that overstates its completeness is worse than none. Remaining Phase 1 work is listed explicitly."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Specimen label="Delivered in this phase">
              <ul className="space-y-2 text-sm text-muted">
                {[
                  'Monorepo structure with npm workspaces (DF-P1-002)',
                  'Token pipeline: JSON → CSS vars + Tailwind theme + TS constants (DF-P1-003)',
                  'CI guard against hardcoded colours, sizes and durations (DF-P1-003)',
                  'Font pipeline with subsetting and swap (DF-P1-004)',
                  '19 DFDS primitives with all states (DF-P1-005)',
                  'Marketing, portal-rail and reading layout shells (DF-P1-006)',
                  'Four-tier experience system with user override (DF-P1-007)',
                  'Motion foundation: reveal, count-up, spotlight, data stream (DF-P1-008)',
                  'Error, empty, loading and skeleton state kit (DF-P1-014)',
                  'Accessibility baseline: skip link, focus policy, live regions (DF-P1-015)',
                  'Token validator enforcing the contrast contract (DF-P1-015)',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="text-ok">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Specimen>

            <Specimen label="Still open in Phase 1" note="Tracked against Gate G1 in the master roadmap.">
              <ul className="space-y-2 text-sm text-muted">
                {[
                  'Laravel API skeleton + Filament panel (DF-P1-009/010) — needs a PHP environment',
                  'Hosting, DNS, Redis, object storage (DF-P1-011) — needs your accounts',
                  'Deployment pipeline + rollback drill (DF-P1-012) — needs CI secrets',
                  'Sentry, uptime, log shipping, backup restore drill (DF-P1-013)',
                  'Lighthouse + axe automated gates in CI (DF-P1-012/015)',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="text-warn">○</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-[var(--df-color-muted)]">
                These are environment and infrastructure tasks — they need credentials, not code, and are documented so
                the gate cannot be quietly declared “done”.
              </p>
            </Specimen>
          </div>
        </Section>

        {/* ────────────── COLOUR ────────────── */}
        <Section
          id="colour"
          eyebrow="§3.2"
          title="Colour"
          description="Ocean Void foundation with the sea-green signature spectrum. Five gradients exist in the entire product; anything else is a bug."
        >
          <div className="space-y-8">
            {COLOUR_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-[var(--df-color-text-strong)]">{group.title}</h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {group.keys.map((key) => {
                    const value = tokenValue(key);
                    return (
                      <div key={key} className="rounded-lg border border-[var(--df-color-border-quiet)] bg-surface1 p-3">
                        <span
                          aria-hidden="true"
                          className="block h-10 w-full rounded-md border border-[var(--df-color-border-quiet)]"
                          style={{ background: value }}
                        />
                        <p className="mt-2.5 truncate text-[11px] font-medium text-[var(--df-color-text)]">
                          {key.replace('color.', '')}
                        </p>
                        <p className="df-num truncate text-[10px] text-[var(--df-color-muted)]">{value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <Specimen label="Gradients — the only five that exist">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {['gradient.ocean', 'gradient.sealine', 'gradient.depth', 'gradient.metal', 'gradient.focus'].map((key) => (
                  <div key={key} className="rounded-lg border border-[var(--df-color-border-quiet)] p-3">
                    <span aria-hidden="true" className="block h-12 w-full rounded-md" style={{ background: tokenValue(key) }} />
                    <p className="mt-2 text-[11px] text-[var(--df-color-text)]">{key.replace('gradient.', '')}</p>
                  </div>
                ))}
              </div>
            </Specimen>
          </div>
        </Section>

        {/* ────────────── CONTRAST ────────────── */}
        <Section
          id="contrast"
          eyebrow="§3.2.7 · WCAG 2.2 AA"
          title="Contrast contract"
          description="Measured live from the token values in the browser — the same pairs the CI validator checks on every build. These are promises to users, not opinions."
        >
          <div className="df-scroll-x rounded-xl border border-[var(--df-color-border)]">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="df-sr-only">Measured contrast ratios for DhakaFin token pairs</caption>
              <THead>
                <TR hoverable={false}>
                  <TH>Pair</TH>
                  <TH>Context</TH>
                  <TH numeric>Ratio</TH>
                  <TH>Verdict</TH>
                </TR>
              </THead>
              <tbody>
                {CONTRAST_PAIRS.map((pair) => {
                  const fg = pair.fg.startsWith('#') ? pair.fg : tokenValue(pair.fg);
                  const bg = tokenValue(pair.bg);
                  const ratio = contrastRatio(fg, bg);
                  const verdict = contrastVerdict(ratio, pair.level ?? 'normal');
                  const forbidden = pair.context.startsWith('FORBIDDEN') || pair.context.startsWith('RESTRICTED');
                  const tone = forbidden
                    ? 'danger'
                    : verdict === 'fail'
                      ? 'danger'
                      : verdict === 'large-only'
                        ? 'warn'
                        : 'ok';

                  return (
                    <TR key={`${pair.fg}-${pair.bg}`}>
                      <TD>
                        <span className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="grid h-7 w-7 shrink-0 place-items-center rounded border border-[var(--df-color-border-quiet)] text-[10px] font-bold"
                            style={{ background: bg, color: fg }}
                          >
                            Aa
                          </span>
                          <span className="df-num text-xs">
                            {pair.fg.replace('color.', '')} on {pair.bg.replace('color.', '')}
                          </span>
                        </span>
                      </TD>
                      <TD className="text-xs text-muted">{pair.context}</TD>
                      <TD numeric>{formatRatio(ratio)}</TD>
                      <TD>
                        <Badge tone={tone} size="sm">
                          {forbidden ? (ratio >= 4.5 ? 'recheck' : 'correctly failing') : verdict}
                        </Badge>
                      </TD>
                    </TR>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Alert tone="warning" title="The rule that surprises most designers" className="mt-4">
            White text on the sea-green primary button measures <span className="df-num">2.49:1</span> and fails WCAG AA.
            {/* df-guard-allow: prose quoting the token value, not a style */}
            Dark text (<span className="df-num">#020b0a</span>) on the same fill measures <span className="df-num">8.00:1</span>{' '}
            and passes. Every primary button in DhakaFin therefore uses dark text — this is encoded in the Button
            component, not left to memory.
          </Alert>
        </Section>

        {/* ────────────── TYPOGRAPHY ────────────── */}
        <Section
          id="type"
          eyebrow="§3.4"
          title="Typography"
          description="Plus Jakarta Sans for structure, Space Grotesk for financial figures (always tabular), Hind Siliguri for Bangla, JetBrains Mono for SRO references. Two weights are preloaded; the rest load on demand."
        >
          <div className="space-y-3">
            {TYPE_SCALE.map((item) => (
              <div
                key={item.token}
                className="rounded-xl border border-[var(--df-color-border-quiet)] bg-surface1/50 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="df-num text-[11px] text-[var(--df-color-muted)]">
                    {item.token} · {tokenValue(item.token)}
                  </p>
                  <p className="text-[11px] text-muted">{item.use}</p>
                </div>
                <p className={cn('mt-3 text-[var(--df-color-text-strong)]', item.className)}>{item.sample}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Specimen label="Financial figures — Space Grotesk, tabular" note="Tabular numerals align in columns so a table of amounts can be scanned and compared.">
              <div className="df-num space-y-1 text-right text-metric-sm text-[var(--df-color-text-strong)]">
                <p>৳12,34,567</p>
                <p>৳1,02,340</p>
                <p>৳9,87,000</p>
              </div>
            </Specimen>

            <Specimen label="Bangla — Hind Siliguri" note="Bangla needs +1–2px size and +0.05 line-height versus Latin for equal readability. No letter-spacing on Bangla — it breaks conjuncts.">
              <div className="space-y-2">
                <p className="text-h4 text-[var(--df-color-text-strong)]">উৎসে কর ও ভ্যাট সেবা</p>
                <p className="text-sm leading-relaxed text-muted">মূসক ৯.১ রিটার্ন ১৫ তারিখের মধ্যে জমা দিতে হবে।</p>
                <p className="df-num text-metric-sm text-sea-300">৳১২,৩৪,৫৬৭</p>
              </div>
            </Specimen>
          </div>
        </Section>

        {/* ────────────── SPACE & RADIUS ────────────── */}
        <Section
          id="space"
          eyebrow="§3.5"
          title="Space, grid & radius"
          description="A 4px base unit, so Tailwind's numeric utilities match the DhakaFin scale exactly (p-4 = 16px, p-8 = 32px)."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Specimen label="Spacing scale">
              <div className="space-y-2">
                {['1', '2', '3', '4', '6', '8', '12', '16', '24'].map((step) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="df-num w-16 shrink-0 text-[11px] text-muted">
                      space-{step} · {tokenValue(`space.${step}`)}
                    </span>
                    <span aria-hidden="true" className="h-2 rounded bg-sea-500/50" style={{ width: tokenValue(`space.${step}`) }} />
                  </div>
                ))}
              </div>
            </Specimen>

            <Specimen label="Radius scale">
              <div className="flex flex-wrap gap-3">
                {['sm', 'md', 'lg', 'xl', '2xl', 'full'].map((step) => (
                  <div key={step} className="text-center">
                    <span
                      aria-hidden="true"
                      className="block h-14 w-20 border border-sea-500/40 bg-sea-500/10"
                      style={{ borderRadius: tokenValue(`radius.${step}`) }}
                    />
                    <p className="mt-2 text-[11px] text-muted">
                      {step} · {tokenValue(`radius.${step}`)}
                    </p>
                  </div>
                ))}
              </div>
            </Specimen>
          </div>
        </Section>

        {/* ────────────── ELEVATION ────────────── */}
        <Section
          id="elevation"
          eyebrow="§3.3"
          title="Depth, material & elevation"
          description="Five layers, each with a defined material. Glass is capped at two stacked layers; the machined edge (1px inner highlight) is what stops dark surfaces reading as flat boxes."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Specimen label="Layer 2 · context card">
              <div className="rounded-xl border border-[var(--df-color-border)] bg-surface1 p-4 shadow-[var(--shadow-2)]">
                <p className="text-xs text-muted">surface1 + shadow-2</p>
              </div>
            </Specimen>
            <Specimen label="Layer 3 · glass element">
              <div className="df-glass df-edge rounded-lg p-4">
                <p className="text-xs text-muted">glass + machined edge</p>
              </div>
            </Specimen>
            <Specimen label="Layer 4 · overlay">
              <div className="rounded-2xl border border-[var(--df-color-border-strong)] bg-surface3 p-4 shadow-[var(--shadow-4)]">
                <p className="text-xs text-muted">surface3 + shadow-4</p>
              </div>
            </Specimen>
            <Specimen label="Decorations">
              <div className="space-y-2">
                <div className="h-8 rounded-md df-hairline-grid border border-[var(--df-color-border-quiet)]" />
                <div className="relative h-8 overflow-hidden rounded-md df-grain bg-[var(--df-gradient-metal)]" />
              </div>
            </Specimen>
          </div>
        </Section>

        {/* ────────────── BUTTONS ────────────── */}
        <Section
          id="buttons"
          eyebrow="Component 1"
          title="Buttons"
          description="Primary uses dark text on sea-green (8.00:1). Magnetic drift is capped at 6px and disabled on touch and lighter tiers. Loading swaps an inline spinner without changing width, so nothing shifts."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Specimen label="Variants">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Book a Consultation</Button>
                <Button variant="secondary">Explore the Platform</Button>
                <Button variant="ghost">Cancel</Button>
                <Button variant="regulatory">View SRO</Button>
                <Button variant="danger">Delete draft</Button>
                <Button variant="link">Read the guide</Button>
              </div>
            </Specimen>

            <Specimen label="Sizes & states">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button loading>Calculating</Button>
                <Button disabled>Disabled</Button>
                <Button magnetic>Magnetic</Button>
              </div>
            </Specimen>

            <Specimen label="With icons">
              <div className="flex flex-wrap items-center gap-3">
                <Button leadingIcon={<span aria-hidden="true">৳</span>}>Calculate TDS</Button>
                <Button variant="secondary" trailingIcon={<span aria-hidden="true">→</span>}>
                  View all rates
                </Button>
                <ButtonLink href="/design-system" variant="ghost" external>
                  External link
                </ButtonLink>
              </div>
            </Specimen>

            <Specimen
              label="Keyboard & focus"
              note="Tab to any button: the focus ring is a two-tone ring that stays visible on both dark and light surfaces."
            >
              <div className="flex flex-wrap items-center gap-3">
                <Button>Focus me</Button>
                <Button variant="secondary">And me</Button>
                <Button variant="ghost">Me too</Button>
              </div>
            </Specimen>
          </div>
        </Section>

        {/* ────────────── FORMS ────────────── */}
        <Section
          id="forms"
          eyebrow="Component 2"
          title="Forms & inputs"
          description="Real labels (never placeholder-only), helper and error text wired through aria-describedby, numeric keypads on mobile, and live Bangla-aware money parsing."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Specimen label="Field — default, currency and error states">
              <div className="space-y-4">
                <Field label="Business name" placeholder="Rahim Textiles Ltd" hint="As shown on your TIN certificate" required />
                <Field
                  label="Payment amount"
                  currency
                  placeholder="5,00,000"
                  value={money}
                  onChange={(event) => setMoney(event.target.value)}
                  hint="Accepts 12,34,567 or shorthand such as 5L and 1.2 Cr"
                  success={parsed !== null && money !== '' ? `Parsed as ${formatBDT(parsed)}` : undefined}
                />
                <Field
                  label="Work email"
                  type="email"
                  placeholder="you@company.com"
                  value={emailError ? 'not-an-email' : undefined}
                  error={emailError || undefined}
                  onChange={() => setEmailError('')}
                  onBlur={(event) => {
                    const value = event.target.value;
                    setEmailError(value && !value.includes('@') ? 'Enter a valid email address, for example name@company.com' : '');
                  }}
                />
              </div>
            </Specimen>

            <Specimen label="Select, textarea and checkbox">
              <div className="space-y-4">
                <SelectField
                  label="Business type"
                  placeholder="Choose one"
                  options={[
                    { value: 'trading', label: 'Trading / distribution' },
                    { value: 'manufacturing', label: 'Manufacturing' },
                    { value: 'ecommerce', label: 'E-commerce' },
                    { value: 'services', label: 'Professional services' },
                  ]}
                  hint="Determines which compliance obligations apply to you"
                />
                <TextareaField
                  label="What would you like to discuss?"
                  placeholder="Tell us briefly about your business and what you need."
                  maxLength={400}
                  showCount
                  hint="We reply within one working hour on business days"
                />
                <CheckboxField
                  label="Send me rate-change alerts"
                  hint="Email and WhatsApp, only when a rate that affects you changes"
                />
              </div>
            </Specimen>
          </div>
        </Section>

        {/* ────────────── BADGES & CHIPS ────────────── */}
        <Section
          id="badges"
          eyebrow="Component 11"
          title="Badges & chips"
          description="Gold is reserved exclusively for regulatory provenance. The dashed 'sample' badge marks illustrative data — demo figures must never be mistakable for a client's real numbers."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Specimen label="Badge tones">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>Neutral</Badge>
                <Badge tone="sea">Verified</Badge>
                <Badge tone="regulatory" glyph="§">
                  SRO 173-AIN/2025
                </Badge>
                <Badge tone="ok" glyph="✓">
                  Filed
                </Badge>
                <Badge tone="warn" glyph="▲">
                  Due soon
                </Badge>
                <Badge tone="risk" glyph="▲">
                  Action needed
                </Badge>
                <Badge tone="danger" glyph="!">
                  Overdue
                </Badge>
                <Badge tone="ai" glyph="◐">
                  AI insight
                </Badge>
                <Badge tone="sample">Sample data</Badge>
              </div>
            </Specimen>

            <Specimen label="Status badges — colour is never the only signal">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status="compliant" />
                <StatusBadge status="filed" />
                <StatusBadge status="due-soon" />
                <StatusBadge status="overdue" />
                <StatusBadge status="in-progress" />
                <StatusBadge status="not-applicable" />
              </div>
            </Specimen>

            <Specimen label="Selectable chip group" note="Keyboard operable, aria-pressed state, and optional selection limit with a live count.">
              <ChipGroup
                label="Filter rate families"
                max={3}
                selected={chips}
                onToggle={(id) =>
                  setChips((current) => (current.includes(id) ? current.filter((c) => c !== id) : [...current, id]))
                }
                options={[
                  { id: 'tds', label: 'TDS' },
                  { id: 'vds', label: 'VDS' },
                  { id: 'vat', label: 'VAT' },
                  { id: 'income', label: 'Income tax' },
                  { id: 'corporate', label: 'Corporate tax' },
                ]}
              />
            </Specimen>

            <Specimen label="Standalone chips, removable and selected">
              <div className="flex flex-wrap items-center gap-2">
                <Chip selected>VAT registered</Chip>
                <Chip>Turnover tax</Chip>
                <Chip icon={<span aria-hidden="true">⌕</span>}>Search rates</Chip>
                <Chip selected onRemove={() => undefined}>
                  Filter: TDS
                </Chip>
              </div>
            </Specimen>
          </div>
        </Section>

        {/* ────────────── CARDS ────────────── */}
        <Section
          id="cards"
          eyebrow="Component 3"
          title="Cards"
          description="Three tones: context (opaque surface), glass (translucent, capped at two stacked layers) and quiet. Hover lifts 2px and brightens the border — never a full colour flip."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Card tone="context" padding="lg" interactive>
              <Badge tone="sea" size="sm">
                Context
              </Badge>
              <CardTitle className="mt-3">Accounting & Bookkeeping</CardTitle>
              <CardDescription>
                Monthly bookkeeping, bank reconciliation, AR/AP and management accounts — with a month-end close you can
                rely on.
              </CardDescription>
              <CardFooter>
                <ButtonLink href="/design-system" size="sm" variant="secondary">
                  View service
                </ButtonLink>
              </CardFooter>
            </Card>

            <SpotlightCard className="h-full rounded-xl">
              <Card tone="glass" padding="lg" className="h-full">
                <Badge tone="sea" size="sm">
                  Glass + spotlight
                </Badge>
                <CardTitle className="mt-3">Cost Efficiency Review</CardTitle>
                <CardDescription>
                  Move your cursor inside this card — the spotlight follows it. Disabled automatically on balanced and
                  lite tiers.
                </CardDescription>
              </Card>
            </SpotlightCard>

            <Card tone="quiet" padding="lg">
              <Badge size="sm">Quiet</Badge>
              <CardTitle className="mt-3">Compliance calendar</CardTitle>
              <CardDescription>
                Lowest-weight surface, used for secondary information that should not compete with the primary action.
              </CardDescription>
            </Card>
          </div>
        </Section>

        {/* ────────────── KPI TILES ────────────── */}
        <Section
          id="kpi"
          eyebrow="Component 4"
          title="KPI tiles — the six-element rule"
          description="Label, value, delta, plain-language qualifier, driver and period. A tile cannot be built without the qualifier and the period: the TypeScript types make it impossible, which is how the rule survives contact with deadlines."
        >
          <KpiRow columns={4}>
            <KpiTile
              label="Revenue"
              value={1250000}
              delta={18.4}
              qualifier="Growth accelerating"
              driver={{ text: 'Sales volume, not price' }}
              period="Jul 2026 · vs Jun 2026 · from books"
              sample
            />
            <KpiTile
              label="Receivables"
              value={430000}
              delta={12.6}
              qualifier="Cash trapped"
              driver={{ text: 'Two invoices in 60+ days' }}
              period="Jul 2026 · vs Jun 2026 · from aging report"
              invertDelta
              sample
            />
            <KpiTile
              label="Payroll"
              value={285000}
              delta={22.0}
              qualifier="Grew faster than output"
              driver={{ text: 'Overtime in packing unit' }}
              period="Jul 2026 · vs Jun 2026 · from payroll"
              invertDelta
              sample
            />
            <KpiTile
              label="Net profit"
              value={190000}
              delta={-2.3}
              qualifier="Margin softening"
              driver={{ text: 'Payroll up 22% vs output 6%' }}
              period="Jul 2026 · vs Jun 2026 · from books"
              compact
              sample
            />
          </KpiRow>

          <div className="mt-4">
            <Alert tone="info" title="Why the qualifier matters">
              “৳12.5 L” tells a business owner nothing actionable. “Growth accelerating, driven by sales volume rather
              than price” tells them whether to hire, raise prices, or check discount depth. The qualifier is generated by
              a documented, admin-tunable rule library — never by a language model improvising over numbers.
            </Alert>
          </div>
        </Section>

        {/* ────────────── RATE CARD ────────────── */}
        <Section
          id="rate-card"
          eyebrow="Component 7 · the trust-critical component"
          title="Rate card"
          description="The component cannot render without provenance: effective date, reference and a named verifier are required props. There are no defaults for those fields, which is how 'never publish an unsourced number' is enforced in code rather than in review notes."
        >
          <div className="grid gap-4 lg:grid-cols-2">
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
              provenance={{ referenceSro: 'SRO 173-AIN/2025', verifiedAt: '12 Sep 2026', verifiedBy: 'DhakaFin tax team' }}
              status="current"
              fiscalYear="FY 2025–26"
              sample
            />
            <RateCard
              title="Professional / advisory service fees"
              sectionRef="90"
              rateType="percent"
              value={10}
              base="Gross payment"
              applicability="Professional, advisory, technical or specialist service fees"
              taxpayerType="Any"
              effectiveFrom="01 Jul 2025"
              previousValue={12}
              provenance={{ referenceSro: 'SRO 173-AIN/2025', verifiedAt: '12 Sep 2026', verifiedBy: 'DhakaFin tax team' }}
              status="current"
              fiscalYear="FY 2025–26"
              sample
            />
            <RateCard
              title="VAT — standard rate"
              rateType="percent"
              value={15}
              base="Taxable supply or import"
              applicability="Standard rate on taxable supplies and imports"
              taxpayerType="Any"
              effectiveFrom="01 Jul 2019"
              provenance={{ referenceSro: 'VAT & SD Act 2012', verifiedAt: '12 Sep 2026', verifiedBy: 'DhakaFin tax team' }}
              status="current"
              compact
              sample
            />
            <RateCard
              title="Contractor payments (previous version)"
              sectionRef="89"
              rateType="percent"
              value={7.5}
              base="Gross payment"
              applicability="Superseded version retained for historical comparison and audit trails"
              taxpayerType="Resident"
              effectiveFrom="01 Jul 2024"
              effectiveTo="30 Jun 2025"
              provenance={{ referenceSro: 'SRO 197-AIN/2024', verifiedAt: '12 Sep 2026', verifiedBy: 'DhakaFin tax team' }}
              status="superseded"
              compact
              sample
            />
          </div>

          <div className="mt-4">
            <ProvenanceNote verifiedAt="12 Sep 2026" verifiedBy="DhakaFin tax team" />
          </div>
        </Section>

        {/* ────────────── DEADLINES ────────────── */}
        <Section
          id="deadlines"
          eyebrow="Component 8"
          title="Deadline states — calm urgency"
          description="Four escalating states and nothing else. No flashing, no countdown clocks, no red flooding. Each threshold is encoded in the component, so urgency cannot be invented page by page."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <DeadlineItem
              title="Income Tax Return"
              formRef="Annual"
              daysRemaining={42}
              dueDate="30 Nov 2026"
              owner="DhakaFin consultant"
              primaryAction={{ label: 'View schedule', href: '/design-system' }}
            />
            <DeadlineItem
              title="Quarterly Turnover Tax"
              formRef="Mushak 9.2"
              daysRemaining={12}
              dueDate="15 Oct 2026"
              owner="You"
              primaryAction={{ label: 'Upload sales register', href: '/design-system' }}
            />
            <DeadlineItem
              title="VAT Return — August 2026"
              formRef="Mushak 9.1"
              daysRemaining={5}
              dueDate="15 Oct 2026"
              requirements={{ description: 'Needs: sales register, purchase register, input tax credit ledger', met: 2, total: 3 }}
              owner="DhakaFin consultant"
              primaryAction={{ label: 'Upload remaining document', href: '/design-system' }}
            />
            <DeadlineItem
              title="TDS Deposit — July 2026"
              formRef="Sections 89–90"
              daysRemaining={-8}
              dueDate="15 Aug 2026"
              penaltyNote="Late deposit attracts interest and may affect the deductee's tax credit. Fastest fix: deposit today and file the correction with evidence."
              owner="DhakaFin consultant"
              primaryAction={{ label: 'Talk to your consultant', href: '/design-system' }}
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Specimen label="Progress bar and stepper">
              <div className="space-y-6">
                <ProgressBar label="Documents received" value={2} max={3} />
                <ProgressBar label="Month-end close" value={82} max={100} tone="ok" />
                <Stepper
                  label="Diagnostic progress"
                  currentIndex={3}
                  steps={[
                    { id: 'type', label: 'Business type' },
                    { id: 'size', label: 'Size' },
                    { id: 'system', label: 'Accounting system' },
                    { id: 'problem', label: 'Main problem' },
                    { id: 'stage', label: 'Growth stage' },
                    { id: 'challenges', label: 'Challenges' },
                  ]}
                />
              </div>
            </Specimen>

            <Specimen label="Radial progress — days remaining and health score">
              <div className="flex flex-wrap items-center gap-8">
                <RadialProgress value={6} max={30} label="Days left" caption="Mushak 9.1" tone="risk" />
                <RadialProgress value={78} max={100} label="Business health" caption="Improving" tone="sea" />
                <RadialProgress value={98} max={100} label="Books reconciled" caption="Aug 2026" tone="ok" />
              </div>
            </Specimen>
          </div>
        </Section>

        {/* ────────────── TABLE ────────────── */}
        <Section
          id="table"
          eyebrow="Component 5"
          title="Table / ledger"
          description="Tabular figures, right-aligned numbers, sticky header, hairline grid and 2% zebra. Every table names itself in a caption and ships an empty state, so it never renders as a broken shell."
        >
          <TableWrap caption="Sample TDS rates by section, demonstrating the ledger table treatment">
            <THead>
              <TR hoverable={false}>
                <TH>Section</TH>
                <TH>Description</TH>
                <TH>Applicability</TH>
                <TH numeric>Rate</TH>
              </TR>
            </THead>
            <tbody>
              {[
                { section: '89', description: 'Contractor / sub-contractor', applicability: 'Resident', rate: '7.5%' },
                { section: '90', description: 'Professional / advisory service', applicability: 'Any payer', rate: '10%' },
                { section: '109', description: 'Rental income', applicability: 'Landlord', rate: '5%' },
                { section: '86', description: 'Salary', applicability: 'Employee', rate: 'Average' },
              ].map((row) => (
                <TR key={row.section}>
                  <TD>
                    <span className="df-num text-xs text-sea-300">Sec {row.section}</span>
                  </TD>
                  <TD>{row.description}</TD>
                  <TD className="text-muted">{row.applicability}</TD>
                  <TD numeric>
                    <span className="text-sea-300">{row.rate}</span>
                  </TD>
                </TR>
              ))}
            </tbody>
          </TableWrap>

          <div className="mt-4">
            <TableWrap caption="Empty table state demonstration">
              <THead>
                <TR hoverable={false}>
                  <TH>Obligation</TH>
                  <TH>Due date</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <tbody>
                <TEmptyRow colSpan={3}>
                  Nothing to file yet — you will see obligations here once your business profile is complete.
                </TEmptyRow>
              </tbody>
            </TableWrap>
          </div>
        </Section>

        {/* ────────────── NAVIGATION ────────────── */}
        <Section
          id="navigation"
          eyebrow="Components 10 & 18"
          title="Tabs, accordion & breadcrumb"
          description="Tabs follow the WAI-ARIA pattern with a roving tabindex. The accordion is built on native details/summary, so it works without JavaScript and needs no height measurement."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <Specimen label="Tabs — underline, pill and segmented">
              <div className="space-y-8">
                <Tabs
                  label="Rate families"
                  variant="underline"
                  items={[
                    { id: 'tds', label: 'TDS', content: <p className="text-sm text-muted">Section-wise deduction rates with SRO references.</p> },
                    { id: 'vds', label: 'VDS', content: <p className="text-sm text-muted">Local VAT deduction on specified services.</p> },
                    { id: 'vat', label: 'VAT', content: <p className="text-sm text-muted">Standard, reduced, exempt and turnover-tax treatment.</p> },
                  ]}
                />
                <Tabs
                  label="Segmented example"
                  variant="segmented"
                  items={[
                    { id: 'month', label: 'Monthly', content: <p className="text-sm text-muted">Monthly view</p> },
                    { id: 'quarter', label: 'Quarterly', content: <p className="text-sm text-muted">Quarterly view</p> },
                  ]}
                />
              </div>
            </Specimen>

            <Specimen label="Accordion — single open, deep-linkable in Phase 3">
              <Accordion
                defaultOpenId="a1"
                items={[
                  {
                    id: 'a1',
                    question: 'What is the standard VAT rate in Bangladesh?',
                    answer: 'The standard rate is 15% on taxable supplies and imports, with reduced and exempt treatments for specified goods and services. Exports are zero-rated.',
                    meta: 'Source: VAT & Supplementary Duty Act 2012',
                  },
                  {
                    id: 'a2',
                    question: 'When is the monthly VAT return due?',
                    answer: 'Mushak 9.1 is filed by the 15th day of the following month for VAT-registered businesses.',
                    meta: 'Verify against the current NBR notice before filing',
                  },
                ]}
              />
            </Specimen>
          </div>

          <div className="mt-6">
            <Specimen label="Breadcrumb">
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Rates', href: '/rates' },
                  { label: 'TDS', href: '/rates/tds' },
                  { label: 'Section 89' },
                ]}
              />
            </Specimen>
          </div>
        </Section>

        {/* ────────────── OVERLAYS ────────────── */}
        <Section
          id="overlays"
          eyebrow="Components 13 & 14"
          title="Modal & drawer"
          description="Focus moves in on open, is trapped while open, and returns to the trigger on close. ESC closes, the backdrop is click-dismissible, body scroll locks, and the bottom-sheet presentation is what the money-flow and mobile flows use."
        >
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setModalOpen(true)}>Open modal</Button>
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
              Open drawer
            </Button>
          </div>

          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Confirm this filing?"
            description="Mushak 9.1 for August 2026 will be submitted to NBR with the documents currently attached."
            footer={
              <>
                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setModalOpen(false);
                    toast({
                      tone: 'success',
                      title: 'Filing queued',
                      description: 'Your consultant will review it before submission.',
                      action: { label: 'View status', onClick: () => undefined },
                    });
                  }}
                >
                  Confirm filing
                </Button>
              </>
            }
          >
            <dl className="space-y-3 text-sm">
              {[
                { term: 'Obligation', detail: 'VAT Return — August 2026 (Mushak 9.1)' },
                { term: 'Due', detail: '15 October 2026 · 6 days remaining' },
                { term: 'Documents', detail: '2 of 3 received · purchase register outstanding' },
                { term: 'Owner', detail: 'DhakaFin consultant (reviewed before submission)' },
              ].map((row) => (
                <div key={row.term} className="grid grid-cols-[120px_1fr] gap-3">
                  <dt className="text-muted">{row.term}</dt>
                  <dd className="text-[var(--df-color-text)]">{row.detail}</dd>
                </div>
              ))}
            </dl>

            <Alert tone="warning" title="One document is still missing" className="mt-5">
              Submitting without the purchase register may understate input tax credit. You can proceed now and amend
              later, or upload it first.
            </Alert>
          </Modal>

          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Procurement"
            description="34% of operating expenses · ▲ up 11% vs last year"
            side="right"
            footer={
              <Button
                onClick={() => {
                  setDrawerOpen(false);
                  toast({ tone: 'info', title: 'Procurement review requested' });
                }}
                fullWidth
              >
                Book a procurement review
              </Button>
            }
          >
            <p className="text-sm font-medium text-[var(--df-color-text-strong)]">
              Are your purchasing costs increasing?
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              {[
                'Is every supplier price benchmarked against at least two alternatives?',
                'Are we buying at the cheapest tier the supplier offers?',
                'Do duplicate or split vouchers exist below the approval threshold?',
                'Is any single supplier more than 30% of spend?',
              ].map((question) => (
                <li key={question} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sea-400" />
                  {question}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-lg border border-[var(--df-color-border-quiet)] bg-surface1 p-4">
              <p className="text-xs font-medium text-[var(--df-color-text)]">How DhakaFin helps</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Purchase benchmarking, supplier comparison, leakage detection and procurement advisory — delivered as
                the Cost Efficiency & Procurement Review service.
              </p>
            </div>
          </Drawer>
        </Section>

        {/* ────────────── FEEDBACK ────────────── */}
        <Section
          id="feedback"
          eyebrow="Components 12 & 21"
          title="Toasts, alerts & tooltips"
          description="Errors never auto-dismiss; success messages always carry a next step. Every toast is announced politely and carries an accessible label, so colour is never the only signal."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Specimen label="Trigger toasts">
              <div className="flex flex-wrap gap-3">
                <Button size="sm" onClick={() => toast({ tone: 'success', title: 'Calculation saved', description: 'Find it later under Saved calculations.' })}>
                  Success
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() =>
                    toast({
                      tone: 'error',
                      title: 'We could not read that PDF',
                      description: 'Try a scanned copy, or enter the amount manually.',
                      action: { label: 'Enter manually', onClick: () => undefined },
                    })
                  }
                >
                  Error (no auto-dismiss)
                </Button>
                <Button size="sm" variant="secondary" onClick={() => toast({ tone: 'info', title: 'Rates updated', description: 'TDS section 89 changed — verified against NBR.' })}>
                  Info
                </Button>
                <Button size="sm" variant="regulatory" onClick={() => toast({ tone: 'warning', title: 'New SRO published', description: 'SRO 173-AIN/2025 affects your contractor payments.' })}>
                  Regulatory
                </Button>
              </div>
            </Specimen>

            <Specimen label="Tooltips & glossary terms" note="Zero JavaScript — hover and keyboard focus both reveal them, and the content is always present in the DOM.">
              <div className="space-y-4 text-sm text-[var(--df-color-text)]">
                <p>
                  Deposit the{' '}
                  <GlossaryTerm term="VDS" bangla="উৎসে ভ্যাট">
                    VAT deducted at source — when you pay a service provider you withhold their VAT and deposit it with NBR.
                  </GlossaryTerm>{' '}
                  by the 15th of the following month.
                </p>
                <p>
                  Claim your{' '}
                  <GlossaryTerm term="Input Tax Credit" bangla="ইনপুট ট্যাক্স ক্রেডিট">
                    VAT already paid on purchases, which can be offset against the VAT you collected.
                  </GlossaryTerm>{' '}
                  before the period closes.
                </p>
              </div>
            </Specimen>

            <Specimen label="Alert tones">
              <div className="space-y-3">
                <Alert tone="info" title="Information">
                  General information based on published NBR sources — not professional advice.
                </Alert>
                <Alert tone="success" title="Filed successfully">
                  Mushak 9.1 submitted. Acknowledgement stored in your document vault.
                </Alert>
                <Alert tone="regulatory" title="Rate changed on 01 Jul 2025">
                  TDS section 90 moved from 12% to 10% under SRO 173-AIN/2025.
                </Alert>
              </div>
            </Specimen>

            <Specimen label="Keyboard shortcut hint pattern">
              <p className="text-sm text-muted">
                Open search with{' '}
                <kbd className="df-num rounded border border-[var(--df-color-border)] bg-surface2 px-1.5 py-0.5 text-xs">
                  ⌘K
                </kbd>{' '}
                or{' '}
                <kbd className="df-num rounded border border-[var(--df-color-border)] bg-surface2 px-1.5 py-0.5 text-xs">
                  /
                </kbd>
                . Shortcuts are listed on the help page and in the command palette itself.
              </p>
            </Specimen>
          </div>
        </Section>

        {/* ────────────── STATES ────────────── */}
        <Section
          id="states"
          eyebrow="Components 19 & 20"
          title="Empty, error and loading states"
          description="Every one of these is designed, never improvised. An empty state names what the space is for and gives the exact next action; an error names what happened and offers a way forward; loading mirrors the final layout so nothing shifts."
        >
          <div className="space-y-6">
            <EmptyState
              title="No documents yet"
              description="Upload a bank statement or sales register and we will show your first insight within minutes — cash pattern, top suppliers and where margin is leaking."
              action={{ label: 'Upload a document', href: '/design-system' }}
              secondaryAction={{ label: 'See what is accepted', href: '/design-system' }}
            />

            <ErrorState
              description="We could not reach the rate service. The rates you can see are cached and still verified — new changes will appear as soon as the connection is back."
              reference="DF-8F2A-2026"
              onRetry={() => toast({ tone: 'info', title: 'Retrying connection…' })}
              href="/design-system"
              hrefLabel="Go to the rate hub"
            />

            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                Loading — skeleton mirrors the real layout
              </p>
              <KpiSkeletonRow count={4} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Specimen label="Skeleton primitives">
                <div className="space-y-3">
                  <Skeleton className="w-40" />
                  <Skeleton variant={2} className="w-56" />
                  <Skeleton variant={3} />
                  <div className="flex items-center gap-3">
                    <Skeleton variant={4} />
                    <Skeleton lines={3} className="flex-1" />
                  </div>
                </div>
              </Specimen>

              <Specimen label="Empty state — positive" note="When there is genuinely nothing to do, say so warmly instead of showing an empty list.">
                <EmptyState
                  tone="positive"
                  glyph="✓"
                  title="Nothing needs you today"
                  description="All documents received, no approvals pending, and your next filing is 11 days away."
                />
              </Specimen>
            </div>
          </div>
        </Section>

        {/* ────────────── MOTION ────────────── */}
        <Section
          id="motion"
          eyebrow="§3.10"
          title="Motion language"
          description="Three layers with fixed budgets: structure 560–900ms, component 120–320ms, detail 60–160ms. Detail never outruns component. Scrolling down and back up re-triggers the reveal demonstration."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Specimen label="1 · Reveal (fade + 16px rise, once, 560ms)">
              <div className="space-y-2">
                {['Fade and rise', 'Once, at 20% visibility', 'Content always in the DOM'].map((label, index) => (
                  <Reveal key={label} index={index}>
                    <div className="rounded-lg border border-[var(--df-color-border-quiet)] bg-surface1 px-4 py-3 text-sm text-[var(--df-color-text)]">
                      {label}
                    </div>
                  </Reveal>
                ))}
              </div>
            </Specimen>

            <Specimen label="2 · Number count-up (700ms, disabled under reduced motion)">
              <div className="flex items-baseline gap-3">
                <CountUp
                  value={1250000}
                  format={(value) => formatBDT(value, { compact: true })}
                  className="text-metric text-sea-300"
                  announce
                />
                <span className="text-xs text-muted">Sample revenue, counting to ৳12.5 L</span>
              </div>
            </Specimen>

            <Specimen label="3 · Data stream (dash animation along a path)">
              <svg viewBox="0 0 320 48" className="h-12 w-full" role="img" aria-label="Animated financial data stream">
                <path d="M12 34 C 80 34, 100 14, 160 14 S 250 34, 308 34" fill="none" stroke="var(--df-color-border-strong)" strokeWidth="1.5" />
                <path
                  d="M12 34 C 80 34, 100 14, 160 14 S 250 34, 308 34"
                  fill="none"
                  stroke="var(--df-color-sea-400)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="df-stream"
                />
                <circle cx="12" cy="34" r="4" fill="var(--df-color-sea-500)" />
                <circle cx="308" cy="34" r="4" fill="var(--df-color-cyan)" />
              </svg>
            </Specimen>

            <Specimen label="4 · Spotlight card (pointer-following, ultra/high only)">
              <SpotlightCard className="rounded-xl">
                <div className="rounded-xl border border-[var(--df-color-border)] bg-surface1 p-6">
                  <p className="text-sm font-medium text-[var(--df-color-text-strong)]">Move your cursor here</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    One CSS custom property write per animation frame — no React re-render, no layout reads, and it
                    never runs for touch or keyboard users.
                  </p>
                </div>
              </SpotlightCard>
            </Specimen>
          </div>

          <div className="mt-6">
            <Specimen label="Motion tokens">
              <div className="df-scroll-x">
                <table className="w-full min-w-[520px] border-collapse text-sm">
                  <caption className="df-sr-only">Motion duration and easing tokens</caption>
                  <THead>
                    <TR hoverable={false}>
                      <TH>Token</TH>
                      <TH>Value</TH>
                      <TH>Role</TH>
                    </TR>
                  </THead>
                  <tbody>
                    {[
                      { token: 'duration.1', role: 'Micro-feedback, hover colour' },
                      { token: 'duration.2', role: 'Dropdowns, chips, tabs' },
                      { token: 'duration.3', role: 'Cards, panels, drawers' },
                      { token: 'duration.4', role: 'Section reveals' },
                      { token: 'duration.5', role: 'Hero and story sequences' },
                      { token: 'ease.out', role: 'Entrances' },
                      { token: 'ease.inOut', role: 'Exits and loops' },
                      { token: 'ease.spring', role: 'Magnetic buttons, node snap (max 2 places)' },
                      { token: 'ease.linear', role: 'Data streams and progress' },
                    ].map((row) => (
                      <TR key={row.token}>
                        <TD>
                          <span className="df-num text-xs text-sea-300">{row.token}</span>
                        </TD>
                        <TD>
                          <span className="df-num text-xs">{tokenValue(row.token)}</span>
                        </TD>
                        <TD className="text-muted">{row.role}</TD>
                      </TR>
                    ))}
                  </tbody>
                </table>
              </div>
            </Specimen>
          </div>
        </Section>

        {/* ────────────── TIERS ────────────── */}
        <Section
          id="tiers"
          eyebrow="§3.9 · DF-P1-007"
          title="Experience tiers"
          description="The 3D→10D model made concrete: each tier is a capability budget with a defined fallback, not a marketing dimension. Detection is deterministic; the user can always override, and the override is applied before the first paint."
        >
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <TierSwitcher />
            <p className="text-xs text-muted">
              Active: <span className="font-medium text-sea-300">{capabilities.label}</span> · webgl {capabilities.webgl} ·
              blur {capabilities.blur ? 'on' : 'off'} · spotlight {capabilities.spotlight ? 'on' : 'off'} · pinned scroll{' '}
              {capabilities.pinnedScroll ? 'on' : 'off'} · preference {preference} · html data-tier=&quot;{tier}&quot;
            </p>
          </div>

          <div className="df-scroll-x rounded-xl border border-[var(--df-color-border)]">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <caption className="df-sr-only">Experience tier capabilities</caption>
              <THead>
                <TR hoverable={false}>
                  <TH>Tier</TH>
                  <TH>WebGL</TH>
                  <TH>Blur</TH>
                  <TH>Spotlight</TH>
                  <TH>Pinned scroll</TH>
                  <TH>When it applies</TH>
                </TR>
              </THead>
              <tbody>
                {TIER_MANIFEST.map((tierInfo) => (
                  <TR key={tierInfo.id}>
                    <TD>
                      <span className="flex items-center gap-2">
                        <span className="font-medium text-[var(--df-color-text-strong)]">{tierInfo.label}</span>
                        {tierInfo.id === tier ? (
                          <Badge tone="sea" size="sm">
                            Active
                          </Badge>
                        ) : null}
                      </span>
                    </TD>
                    <TD className="text-muted">{tierInfo.webgl}</TD>
                    <TD className="text-muted">{tierInfo.blur ? 'on' : 'off'}</TD>
                    <TD className="text-muted">{tierInfo.spotlight ? 'on' : 'off'}</TD>
                    <TD className="text-muted">{tierInfo.pinnedScroll ? 'on' : 'off'}</TD>
                    <TD className="text-xs text-muted">{tierInfo.description}</TD>
                  </TR>
                ))}
              </tbody>
            </table>
          </div>

          <Alert tone="info" title="The lite tier is a promise, not a punishment" className="mt-4">
            On lite, WebGL, blur, spotlight and pinned scrolling are all removed — but every feature, every number and
            every interaction still works. If a capability cannot be removed without breaking the product, the design is
            wrong, not the device.
          </Alert>
        </Section>

        {/* ────────────── ACCESSIBILITY ────────────── */}
        <Section
          id="a11y"
          eyebrow="§3.13 · WCAG 2.2 AA"
          title="Accessibility contract"
          description="Accessibility is specified at component-design time, so it cannot be retrofitted. This is what the system guarantees — and how to verify it in this page."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <Specimen label="Guarantees">
              <ul className="space-y-2.5 text-sm text-muted">
                {[
                  'Focus policy: a single two-tone ring (void + sea-400) that stays visible on every surface.',
                  'Keyboard: every interactive component is reachable and operable; modals trap focus and return it.',
                  'Contrast: only audited token pairs are used — validated in CI and shown live above.',
                  'Motion: prefers-reduced-motion collapses all durations to 0.01ms and stops every loop.',
                  'Charts and rings: every visual carries a text alternative and accessible name.',
                  'Forms: real labels, described-by helpers and errors, and role="alert" on failures.',
                  'Status: colour is never the only signal — icon and label always accompany it.',
                  'Live regions: calculation results and toasts announce politely without stealing focus.',
                  'Zoom: layouts reflow at 200% and at 320px with no horizontal page scroll.',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="text-ok">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Specimen>

            <Specimen label="How to verify this page" note="Run these checks after any component change.">
              <ol className="space-y-3 text-sm text-muted">
                <li className="flex gap-3">
                  <span className="df-num text-sea-300">1</span>
                  Tab through the entire page. Every control should show the focus ring, and nothing should be
                  unreachable or trap you.
                </li>
                <li className="flex gap-3">
                  <span className="df-num text-sea-300">2</span>
                  Enable your OS &quot;Reduce motion&quot; setting and reload — reveals should be instant, no counting
                  numbers, no animated streams, no blur.
                </li>
                <li className="flex gap-3">
                  <span className="df-num text-sea-300">3</span>
                  Open a screen reader and use the tabs, accordion and modal. Tab changes announce the selected state;
                  the modal announces its title and description.
                </li>
                <li className="flex gap-3">
                  <span className="df-num text-sea-300">4</span>
                  Zoom to 200% and confirm no content is clipped and no horizontal page scroll appears.
                </li>
                <li className="flex gap-3">
                  <span className="df-num text-sea-300">5</span>
                  Run <code className="df-num text-xs text-sea-300">npm run tokens:validate</code> — the contrast contract
                  must pass before any branch merges.
                </li>
              </ol>
            </Specimen>
          </div>

          <div className="mt-6">
            <Specimen label="Formatting helpers (Bangladesh-first)">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                {[
                  { label: 'Full BDT', value: formatBDT(1234567) },
                  { label: 'Compact BDT', value: formatBDT(12500000, { compact: true }) },
                  { label: 'Delta', value: '+18.4%' },
                  { label: 'Date', value: formatDate('2026-10-15') },
                  { label: 'Fiscal year', value: formatFiscalYear(new Date('2026-10-15')) },
                  { label: 'Parsed shorthand', value: `${parseMoneyInput('1.2 Cr')?.toLocaleString('en-IN') ?? '—'} from "1.2 Cr"` },
                  { label: 'Bangla numerals', value: formatBDT(1234567, { numerals: 'bn' }) },
                  { label: 'Signed', value: formatBDT(-45000, { signed: true }) },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-[var(--df-color-border-quiet)] bg-surface1 p-3">
                    <p className="text-[11px] text-muted">{item.label}</p>
                    <p className="df-num mt-1.5 text-[var(--df-color-text-strong)]">{item.value}</p>
                  </div>
                ))}
              </div>
            </Specimen>
          </div>
        </Section>
      </div>
    </div>
  );
}
