import { cn } from '@/lib/cn';
import { Badge } from './Badge';

/**
 * RateCard — DFDS component #7 and the most trust-critical surface in the product
 * (blueprint §5.4.2).
 *
 * Every rate in DhakaFin must expose, in this exact order:
 *   current rate · effective date · applicability · taxpayer type ·
 *   source · reference/SRO · last verified · previous rate (when one exists)
 *
 * The component takes all of these as props and has NO defaults for the
 * provenance fields — a rate cannot be rendered without its source. That is the
 * architectural enforcement of "never publish an unsourced number".
 */

export type RateType = 'percent' | 'fixed' | 'range' | 'table' | 'nil';

export interface RateProvenance {
  /** e.g. "SRO 173-AIN/2025" */
  referenceSro?: string;
  /** Official source URL (NBR, gazette…). Required for a verified rate. */
  sourceUrl?: string;
  /** ISO date the DhakaFin tax team last verified this row. */
  verifiedAt: string;
  /** Human name of the verifier (or "DhakaFin tax team"). */
  verifiedBy: string;
}

export interface RateCardProps {
  title: string;
  /** e.g. "89", "Annexure 2" */
  sectionRef?: string;
  rateType: RateType;
  /** Percent value, fixed amount, or the low end of a range. */
  value: number;
  valueMax?: number;
  unit?: string;
  base: string;
  applicability: string;
  taxpayerType: string;
  effectiveFrom: string;
  effectiveTo?: string;
  previousValue?: number;
  provenance: RateProvenance;
  status?: 'current' | 'superseded' | 'under-review' | 'draft';
  fiscalYear?: string;
  /** Renders a clearly-marked sample card. Required for demos and docs. */
  sample?: boolean;
  onViewDetailHref?: string;
  className?: string;
  compact?: boolean;
}

const statusTone = {
  current: 'ok',
  superseded: 'neutral',
  'under-review': 'warn',
  draft: 'sample',
} as const;

const statusLabel = {
  current: 'Current',
  superseded: 'Superseded',
  'under-review': 'Under review',
  draft: 'Draft',
} as const;

function formatRateValue(rateType: RateType, value: number, valueMax?: number, unit?: string): string {
  const pct = unit ?? (rateType === 'percent' ? '%' : '');

  if (rateType === 'range' && typeof valueMax === 'number') {
    return `${value}% – ${valueMax}%`;
  }
  if (rateType === 'table') return 'See table';
  if (rateType === 'nil') return 'Nil';
  if (rateType === 'fixed') return `৳${value.toLocaleString('en-IN')}`;

  return `${value}${pct}`;
}

export function RateCard({
  title,
  sectionRef,
  rateType,
  value,
  valueMax,
  unit,
  base,
  applicability,
  taxpayerType,
  effectiveFrom,
  effectiveTo,
  previousValue,
  provenance,
  status = 'current',
  fiscalYear,
  sample = false,
  onViewDetailHref,
  className,
  compact = false,
}: RateCardProps) {
  const changed = typeof previousValue === 'number' && previousValue !== value;

  return (
    <article
      className={cn(
        'relative rounded-xl border bg-surface1',
        'transition-[border-color,box-shadow] duration-[var(--df-duration-slow)] ease-[var(--ease-out)]',
        status === 'current'
          ? 'border-[var(--df-color-border)] hover:border-[var(--df-color-border-hover)]'
          : 'border-[var(--df-color-border-quiet)] opacity-90',
        compact ? 'p-4' : 'p-5',
        className
      )}
    >
      <span
        aria-hidden="true"
        className="df-edge-top"
      />

      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {sectionRef ? (
              <Badge tone="neutral" size="sm" className="df-num">
                Sec {sectionRef}
              </Badge>
            ) : null}
            <Badge tone={statusTone[status]} size="sm">
              {statusLabel[status]}
            </Badge>
            {sample ? (
              <Badge tone="sample" size="sm">
                Sample data
              </Badge>
            ) : null}
          </div>

          <h3 className={cn('mt-2.5 font-semibold text-[var(--df-color-text-strong)]', compact ? 'text-sm' : 'text-h4')}>
            {title}
          </h3>
        </div>

        <p className="shrink-0 text-right">
          <span className={cn('df-num block font-medium tabular-nums text-sea-400', compact ? 'text-metric-sm' : 'text-metric')}>
            {formatRateValue(rateType, value, valueMax, unit)}
          </span>
          {changed ? (
            <span className="df-num mt-0.5 block text-[11px] text-muted">
              was {previousValue}
              {unit ?? '%'}
            </span>
          ) : null}
        </p>
      </header>

      <dl className={cn('grid gap-x-6 gap-y-2 text-xs', compact ? 'mt-3' : 'mt-4', 'sm:grid-cols-2')}>
        <div>
          <dt className="text-[var(--df-color-muted-2)]">Base</dt>
          <dd className="mt-0.5 text-[var(--df-color-text)]">{base}</dd>
        </div>
        <div>
          <dt className="text-[var(--df-color-muted-2)]">Taxpayer type</dt>
          <dd className="mt-0.5 text-[var(--df-color-text)]">{taxpayerType}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[var(--df-color-muted-2)]">Applicability</dt>
          <dd className="mt-0.5 leading-relaxed text-[var(--df-color-text)]">{applicability}</dd>
        </div>
      </dl>

      {/* Provenance strip — the reason users trust this page */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--df-color-border-quiet)] pt-3 text-[11px]">
        <span className="inline-flex items-center gap-1.5">
          <span className="text-[var(--df-color-muted-2)]">Effective</span>
          <span className="df-num text-[var(--df-color-text)]">
            {effectiveFrom}
            {effectiveTo ? ` – ${effectiveTo}` : ''}
          </span>
        </span>

        {provenance.referenceSro ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="text-[var(--df-color-muted-2)]">SRO</span>
            {provenance.sourceUrl ? (
              <a
                href={provenance.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="df-num text-gold-bright no-underline hover:underline"
              >
                {provenance.referenceSro} ↗
              </a>
            ) : (
              <span className="df-num text-gold-bright">{provenance.referenceSro}</span>
            )}
          </span>
        ) : null}

        <span className="inline-flex items-center gap-1.5">
          <span className="text-[var(--df-color-muted-2)]">Verified</span>
          <span className="df-num text-[var(--df-color-text)]">{provenance.verifiedAt}</span>
          <span className="text-[var(--df-color-muted-2)]">by {provenance.verifiedBy}</span>
        </span>

        {fiscalYear ? (
          <span className="df-num text-[var(--df-color-muted-2)]">{fiscalYear}</span>
        ) : null}
      </div>

      {onViewDetailHref ? (
        <a
          href={onViewDetailHref}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-sea-400 no-underline hover:text-sea-300"
        >
          View full detail
          <span aria-hidden="true">→</span>
        </a>
      ) : null}
    </article>
  );
}
