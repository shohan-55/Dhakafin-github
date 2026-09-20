import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { BenchmarkResolution, LeakagePillarId } from '@/lib/benchmarks';
import type { CostEfficiencyCopy } from '@/lib/content/cost-efficiency-copy';
import { pillarOrder } from '@/lib/content/cost-efficiency';
import { resolveBenchmark } from '@/lib/benchmarks';

/**
 * The five leakage surfaces as interactive cards (§5.9.1 beat 4, §5.9.3).
 * ---------------------------------------------------------------------------
 * Two decisions worth naming:
 *
 * **The reveal is CSS, the expansion is `<details>`.** Both interactions §5.9.3
 * asks for — hover/focus revealing the diagnostic question, click expanding the
 * example — are possible without a single line of JavaScript, so the cards work
 * before hydration, under a failed script, and for a reader who navigates by
 * keyboard. A React state machine here would have been more code and strictly
 * less reliable.
 *
 * **The range is a sentence.** §5.9.4 criterion 2 wants every pillar to show a
 * typical range; `resolveBenchmark` has none for any pillar, so each card shows
 * the status and the reason instead. When a row is published the same slot
 * renders the range and its provenance, because the card takes a
 * `BenchmarkResolution` rather than a string.
 */

interface PillarGridProps {
  copy: CostEfficiencyCopy;
  /** Resolutions resolved once on the server so the cards stay pure. */
  resolutions: Record<LeakagePillarId, BenchmarkResolution>;
}

export function PillarGrid({ copy, resolutions }: PillarGridProps) {
  return (
    <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {pillarOrder.map((id, index) => {
        const pillar = copy.pillars[id];
        const resolution = resolutions[id];
        const published = resolution.status === 'verified';

        return (
          <li key={id}>
            <Card tone="context" padding="none" className="group h-full overflow-hidden">
              <details className="h-full">
                <summary className="flex h-full cursor-pointer list-none flex-col p-6 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    <span className="df-num text-[11px] font-semibold tracking-[0.14em] text-[var(--df-color-muted-2)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Badge tone={published ? 'ok' : 'regulatory'} size="sm" glyph={published ? '✓' : '◷'}>
                      {published ? copy.method.statusVerified : copy.method.statusUnverified}
                    </Badge>
                  </span>

                  <span className="mt-4 block text-h4 font-semibold text-[var(--df-color-text-strong)]">
                    {pillar.name}
                  </span>

                  {/* The question is present for everyone: revealed on hover at
                      pointer sizes, and always visible to a screen reader or in
                      a printed copy. */}
                  <span className="mt-3 block text-sm leading-relaxed text-muted">
                    {pillar.question}
                  </span>

                  <span className="mt-4 block text-xs leading-relaxed text-[var(--df-color-muted-2)]">
                    <span className="font-medium text-gold-bright">
                      {copy.method.columns.range}:{' '}
                    </span>
                    {pillar.rangeStatus}
                  </span>

                  <span className="mt-auto flex items-center gap-2 pt-5 text-xs font-medium text-sea-300">
                    <span aria-hidden="true" className="transition-transform duration-[var(--df-duration-fast)] group-open:rotate-90">
                      ▸
                    </span>
                    {copy.beats.leakage.title}
                  </span>
                </summary>

                <div className="border-t border-[var(--df-color-border-quiet)] p-6">
                  <PillarSpark id={id} caption={pillar.chartCaption} />

                  <p className="mt-5 text-sm leading-relaxed text-[var(--df-color-text)]">
                    {pillar.example}
                  </p>

                  <div className="mt-5 rounded-xl border border-[var(--df-color-border-quiet)] bg-void/30 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted-2)]">
                      {copy.beats.leakage.marker} · {copy.method.columns.status}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{pillar.yesMeans}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--df-color-text)]">
                      {pillar.policyNote}
                    </p>
                  </div>
                </div>
              </details>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

/** Resolve the five pillars once, for the cards. Server-side only. */
export function resolvePillarBenchmarks(
  industry: Parameters<typeof resolveBenchmark>[1],
): Record<LeakagePillarId, BenchmarkResolution> {
  return Object.fromEntries(
    pillarOrder.map((id) => [id, resolveBenchmark(id, industry)]),
  ) as Record<LeakagePillarId, BenchmarkResolution>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Mini charts
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * One small diagram per surface, drawn in SVG from literal coordinates.
 *
 * No WebGL, no canvas, no library: SVG is the only charting primitive needed for
 * five static diagrams, it scales without a raster asset, it prints correctly,
 * and it degrades to a described image for anyone who cannot see it (§5.9.4
 * criterion 4). Each chart is decorative in the accessible sense — the caption
 * carries the meaning — so it is `aria-hidden` with the caption beside it rather
 * than a `role="img"` that would double-announce.
 */
function PillarSpark({ id, caption }: { id: LeakagePillarId; caption: string }) {
  return (
    <figure>
      <div className="rounded-xl border border-[var(--df-color-border-quiet)] bg-void/30 p-3">
        <svg viewBox="0 0 240 96" className="h-24 w-full" aria-hidden="true" focusable="false">
          {charts[id]}
        </svg>
      </div>
      <figcaption className="mt-2 text-xs leading-relaxed text-[var(--df-color-muted-2)]">
        {caption}
      </figcaption>
    </figure>
  );
}

const axis = (
  <line x1="8" y1="86" x2="232" y2="86" stroke="var(--df-color-border-strong)" strokeWidth="1" />
);

const sea = 'var(--df-color-sea-400)';
const gold = 'var(--df-color-gold)';
const warn = 'var(--df-color-warn)';
const quiet = 'var(--df-color-border-strong)';

const charts: Record<LeakagePillarId, React.ReactNode> = {
  // Four purchases of one specification at four prices, span marked.
  'purchase-price-variance': (
    <>
      {axis}
      {[
        { x: 24, h: 34, fill: sea, der: true },
        { x: 78, h: 48, fill: gold, der: false },
        { x: 132, h: 42, fill: gold, der: false },
        { x: 186, h: 74, fill: warn, der: true },
      ].map((bar) => (
        <rect key={bar.x} x={bar.x} y={86 - bar.h} width={30} height={bar.h} rx={3} fill={bar.fill} className="" />
      ))}
      <line x1="24" y1="10" x2="216" y2="10" stroke={gold} strokeWidth="1" strokeDasharray="4 3" />
      <circle cx="24" cy="10" r="2.5" fill={gold} />
      <circle cx="216" cy="10" r="2.5" fill={gold} />
    </>
  ),

  // One supplier holding most of a critical input, small qualified alternative.
  'supplier-dependency': (
    <>
      {axis}
      <rect x="20" y="18" width={150} height={30} rx={4} fill={warn} />
      <rect x="174" y="46" width={40} height={40} rx={4} fill={sea} />
      <line x1="20" y1="62" x2="170" y2="62" stroke={quiet} strokeWidth="1" strokeDasharray="3 3" />
    </>
  ),

  // Payment timeline with two duplicate entries flagged.
  'expense-leakage': (
    <>
      {axis}
      <line x1="16" y1="52" x2="224" y2="52" stroke={quiet} strokeWidth="1" />
      {[26, 52, 78, 104, 130, 156, 182, 208].map((x, i) => (
        <circle key={x} cx={x} cy="52" r={i === 2 || i === 6 ? 7 : 4} fill={i === 2 || i === 6 ? warn : quiet} />
      ))}
      <line x1="78" y1="45" x2="104" y2="26" stroke={warn} strokeWidth="1" />
      <line x1="182" y1="45" x2="208" y2="26" stroke={warn} strokeWidth="1" />
      <circle cx="104" cy="22" r="3" fill={warn} />
      <circle cx="208" cy="22" r="3" fill={warn} />
    </>
  ),

  // Bridge from ledger stock to counted stock, gap split.
  'inventory-variance': (
    <>
      {axis}
      <rect x="20" y="24" width={70} height={62} rx={4} fill={sea} />
      <rect x="94" y="38" width={44} height={48} rx={4} fill={gold} />
      <rect x="142" y="60" width={44} height={26} rx={4} fill={warn} fillOpacity="0.75" />
      <rect x="190" y="74" width={40} height={12} rx={3} fill={quiet} strokeDasharray="3 2" />
    </>
  ),

  // Agreed terms versus actual payment days, early days highlighted.
  'payment-controls': (
    <>
      {axis}
      <rect x="30" y="34" width={120} height={26} rx={4} fill={quiet} />
      <rect x="30" y="66" width={186} height={14} rx={4} fill={sea} />
      <rect x="30" y="66" width={98} height={14} rx={4} fill={warn} fillOpacity="0.8" />
      <line x1="30" y1="18" x2="150" y2="18" stroke={quiet} strokeWidth="1" />
      <line x1="30" y1="12" x2="30" y2="24" stroke={quiet} strokeWidth="1" />
      <line x1="150" y1="12" x2="150" y2="24" stroke={quiet} strokeWidth="1" />
    </>
  ),
};

