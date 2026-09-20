import { Accordion } from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

/**
 * Shared marketing sections for every Phase 2 content page.
 * ---------------------------------------------------------------------------
 * These are the blocks that appear on a service page, an industry page and the
 * cost-efficiency page with the same visual grammar and different words. Having
 * one implementation is what makes twenty pages look like one product rather
 * than twenty pages that were each designed in isolation.
 *
 * Every section is a server component with no client JavaScript. The only
 * interactive element on these pages is the FAQ accordion, and that uses native
 * `<details>`.
 */

/* ───────────────────────────── Section shell ───────────────────────────── */

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  lede?: string;
  children: React.ReactNode;
  /** `deep` sits on the raised slate surface; used to break up long pages. */
  tone?: 'base' | 'deep';
  className?: string;
  /** Constrain the text column. Long-form benefits from a narrower measure. */
  narrow?: boolean;
}

export function Section({ id, eyebrow, title, lede, children, tone = 'base', className, narrow }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'df-section',
        tone === 'deep' && 'border-y border-[var(--df-color-border-quiet)] bg-[var(--df-color-slate-deep)]',
        className
      )}
    >
      <div className={cn('df-container', narrow ? 'df-container-reading' : 'df-container-wide')}>
        {eyebrow || title || lede ? (
          <div className="max-w-3xl">
            {eyebrow ? <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">{eyebrow}</p> : null}
            {title ? (
              <h2 className={cn('text-h2 text-[var(--df-color-text-strong)]', eyebrow && 'mt-4')}>{title}</h2>
            ) : null}
            {lede ? <p className="mt-4 text-body-lg text-muted">{lede}</p> : null}
          </div>
        ) : null}
        <div className={cn(eyebrow || title || lede ? 'mt-10' : '')}>{children}</div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Pain list ───────────────────────────── */

/**
 * "The problem", in the client's own words.
 * A list of one-line statements, not a paragraph — each line should be something
 * a business owner has actually said out loud, which is why they are short.
 */
export function PainList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {items.map((pain) => (
        <li
          key={pain}
          className="flex gap-3 rounded-xl border border-[var(--df-color-border-quiet)] bg-surface1 p-4"
        >
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
          <p className="text-sm leading-relaxed text-[var(--df-color-text)]">{pain}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * The honesty block. Required on every service page by the blueprint — a scope
 * boundary stated up front prevents the conversation where a client assumes
 * something was included and finds out during an audit.
 */
export function NotIncluded({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-6 rounded-xl border border-[color-mix(in_srgb,var(--df-color-warn)_30%,transparent)] bg-[color-mix(in_srgb,var(--df-color-warn)_6%,transparent)] p-5">
      <h3 className="text-sm font-semibold text-[var(--df-color-text-strong)]">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
            <span aria-hidden="true" className="mt-1.5 shrink-0 text-warn">
              ✕
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────────── Workflow timeline ───────────────────────────── */

export interface WorkflowStep {
  title: string;
  weDo: string;
  weNeed: string;
  timeline: string;
}

/**
 * The 5–7 step delivery timeline. Rendered as an ordered list, not a diagram —
 * a screen reader reads a numbered sequence correctly and a decorative SVG does
 * not. The visual timeline is the list's styling, not a separate graphic.
 */
export function WorkflowTimeline({
  steps,
  labels,
}: {
  steps: WorkflowStep[];
  labels: { weDo: string; weNeed: string; timeline: string };
}) {
  return (
    <ol className="relative space-y-4 border-s border-[var(--df-color-border-quiet)] ps-6">
      {steps.map((step, index) => (
        <li key={step.title} className="relative">
          <span
            aria-hidden="true"
            className="absolute -start-[31px] top-1 grid h-6 w-6 place-items-center rounded-full border border-sea-500/50 bg-void text-[10px] font-bold text-sea-300 df-num"
          >
            {index + 1}
          </span>
          <Card tone="quiet" padding="lg">
            <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.weDo}</p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted)]">
                  {labels.weNeed}
                </dt>
                <dd className="mt-1 text-sm text-[var(--df-color-text)]">{step.weNeed}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted)]">
                  {labels.timeline}
                </dt>
                <dd className="mt-1 text-sm text-[var(--df-color-text)]">{step.timeline}</dd>
              </div>
            </dl>
          </Card>
        </li>
      ))}
    </ol>
  );
}

/* ───────────────────────────── FAQ ───────────────────────────── */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * FAQ with schema markup.
 * `FAQPage` JSON-LD is emitted alongside the visible accordion. Emitting it for
 * questions that are not visibly on the page is a search-engine violation, so
 * the two are generated from the same array and cannot drift.
 */
export function FaqSection({
  id = 'faq',
  eyebrow,
  title,
  items,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  items: FaqItem[];
  className?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <Section id={id} eyebrow={eyebrow} title={title} tone="deep" className={className}>
      <div className="max-w-3xl">
        <Accordion items={items} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </Section>
  );
}

/* ───────────────────────────── CTA band ───────────────────────────── */

/**
 * The closing call to action. Every content page ends with one, and it always
 * offers the same two things: a human, and a self-serve next step. A page that
 * ends without either is a dead end.
 */
export function CtaBand({
  title,
  body,
  primary,
  secondary,
  footnote,
}: {
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  footnote?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-t border-[var(--df-color-border-quiet)] df-grain">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[var(--df-gradient-ocean)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 df-atmosphere" />

      <div className="df-container df-container-wide df-section text-center">
        <h2 className="mx-auto max-w-[24ch] text-h2 text-[var(--df-color-text-strong)]">{title}</h2>
        <p className="mx-auto mt-5 max-w-[56ch] text-body-lg text-muted">{body}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={primary.href} size="lg" magnetic>
            {primary.label}
          </ButtonLink>
          {secondary ? (
            <ButtonLink href={secondary.href} variant="secondary" size="lg">
              {secondary.label}
            </ButtonLink>
          ) : null}
        </div>
        {footnote ? (
          <p className="mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-[var(--df-color-muted)]">{footnote}</p>
        ) : null}
      </div>
    </section>
  );
}
