'use client';

import { useState } from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import type { PricingCopy } from '@/lib/content/pricing-copy';
import type { ServiceSlug } from '@/lib/content/services';

/**
 * "Which fits me?" — the three-question filter F3 asks for.
 * ---------------------------------------------------------------------------
 * The questions ask what the business can already do today, not what it would
 * like to buy, and the routing follows the ecosystem's own logic: you cannot test
 * a control on books that do not close, and you cannot plan a decision on numbers
 * nobody trusts. So the branches end at a real service line with a published
 * band, and the reason text says why.
 *
 * Nothing here is a lead-capture device. There is no email field, the result is
 * not gated, and the last thing the panel offers is an exit to the free
 * diagnostic — because the honest answer to "which one do I need" is sometimes
 * "none of them yet".
 */

export interface FitStepData {
  id: string;
  question: string;
  answers: { id: string; label: string; next: 0 | number; service: ServiceSlug }[];
}

export interface FitResultData {
  service: ServiceSlug;
  name: string;
  band: string;
  reason: string;
  href: string;
}

export function FitFilter({
  copy,
  steps,
  results,
  diagnosticHref,
}: {
  copy: PricingCopy['fit'];
  steps: FitStepData[];
  results: Record<string, FitResultData>;
  diagnosticHref: string;
}) {
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState<FitResultData | null>(null);
  const [trail, setTrail] = useState<string[]>([]);

  const step = steps[current];

  const choose = (option: FitStepData['answers'][number]) => {
    setTrail((t) => [...t, option.label]);
    if (option.next === 0) {
      setAnswer(results[option.service] ?? null);
      return;
    }
    setCurrent(option.next);
  };

  const restart = () => {
    setCurrent(0);
    setAnswer(null);
    setTrail([]);
  };

  return (
    <div className="rounded-2xl border border-[var(--df-color-border)] bg-surface1 p-6 sm:p-8">
      {trail.length ? (
        <ol className="mb-6 space-y-1 text-xs text-[var(--df-color-muted-2)]">
          {trail.map((line, index) => (
            <li key={`${line}-${index}`} className="flex gap-2">
              <span aria-hidden="true" className="df-num">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      ) : null}

      <div aria-live="polite" className="min-h-[13rem]">
        {answer ? (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sea-400">
              {copy.resultHeading}
            </p>
            <h3 className="mt-2 text-h3 font-semibold text-[var(--df-color-text-strong)]">
              {answer.name}
            </h3>

            <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--df-color-muted-2)]">
                {copy.resultBandLabel}
              </span>
              <span className="df-num text-lg text-sea-300">{answer.band}</span>
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
              <span className="font-medium text-[var(--df-color-text)]">{copy.resultWhyLabel}: </span>
              {answer.reason}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ButtonLink href={answer.href} variant="secondary">
                {copy.openLabel}
              </ButtonLink>
              <button
                type="button"
                onClick={restart}
                className="text-xs text-muted underline-offset-4 hover:text-[var(--df-color-text)] hover:underline"
              >
                {copy.restartLabel}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--df-color-muted-2)]">
              {copy.stepLabel} <span className="df-num">{current + 1}</span> /{' '}
              <span className="df-num">{steps.length}</span>
            </p>
            <h3 className="mt-2 max-w-2xl text-h4 font-semibold text-[var(--df-color-text-strong)]">
              {step?.question}
            </h3>

            <ul className="mt-6 space-y-2.5">
              {(step?.answers ?? []).map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => choose(option)}
                    className={cn(
                      'w-full rounded-lg border border-[var(--df-color-border)] bg-void/30 px-4 py-3 text-left text-sm text-[var(--df-color-text)]',
                      'transition-[border-color,background-color,transform] duration-[var(--df-duration-fast)] ease-[var(--ease-out)]',
                      'hover:-translate-y-px hover:border-[var(--df-color-border-hover)] hover:bg-[var(--df-color-surface-tint)]',
                      'motion-reduce:hover:translate-y-0',
                    )}
                  >
                    {option.label}
                    <span aria-hidden="true" className="ms-2 text-sea-400">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {trail.length ? (
              <button
                type="button"
                onClick={restart}
                className="mt-5 text-xs text-muted underline-offset-4 hover:text-[var(--df-color-text)] hover:underline"
              >
                {copy.restartLabel}
              </button>
            ) : null}
          </div>
        )}
      </div>

      <p className="mt-8 border-t border-[var(--df-color-border-quiet)] pt-5 text-xs leading-relaxed text-[var(--df-color-muted-2)]">
        <a href={diagnosticHref} className="text-sea-300 underline-offset-4 hover:underline">
          {copy.notSureLabel}
        </a>{' '}
        {copy.notSureNote}
      </p>
    </div>
  );
}
