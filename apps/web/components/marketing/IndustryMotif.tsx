import type { CSSProperties } from 'react';

import type { IndustryMotifKey } from '@/lib/content/industries';

/**
 * Industry motifs — one illustration per industry, per §5.13.2.
 * ---------------------------------------------------------------------------
 * §5.13.1 asks for "industry-specific visual (custom illustration/3D accent, not
 * a generic icon)". Three factory/machine/truck glyphs would satisfy the letter
 * and fail the intent, and they would also fail the same test the service motifs
 * had to pass: every major visual element must connect to a real capability.
 *
 * So each motif draws a *financial structure specific to that sector*, the thing
 * an accountant actually looks at when they open the file:
 *
 *   machineLine · manufacturing — conversion: raw material entering a process,
 *                work-in-progress sitting between stages, and the yield line that
 *                says how much of each input survived to become sellable output.
 *   tradeFlow   · trading — the buy-sell-timing triangle: a purchase leg and a
 *                sale leg offset in time by the stock-holding period, which is
 *                where a distributor's cash is actually made or lost.
 *   parcelFlow  · e-commerce — a sales funnel with the two returns that define
 *                the sector: the cancelled order before dispatch and the returned
 *                parcel after it. Both are units that were paid for and did not
 *                become revenue.
 *
 * All three are `aria-hidden` and purely decorative; the words carry the meaning.
 * Colours come in as props from the token layer, never as literals.
 */

export interface IndustryMotifProps {
  motif: IndustryMotifKey;
  /** Primary stroke — the accent colour for this industry. */
  accent: string;
  /** Secondary, quieter stroke for structure that is not the point. */
  muted: string;
  /** The colour used for the thing the reader should notice. */
  highlight: string;
  className?: string;
  style?: CSSProperties;
}

/** One faint measurement grid, shared, so the three read as a family. */
function Grid({ muted }: { muted: string }) {
  return (
    <g opacity="0.28">
      {[12, 24, 36, 48, 60, 72, 84].map((y) => (
        <line key={y} x1="8" y1={y} x2="152" y2={y} stroke={muted} strokeWidth="0.5" strokeDasharray="1 5" />
      ))}
    </g>
  );
}

/** Manufacturing — conversion, WIP, and the yield line. */
function MachineLine({ accent, muted, highlight }: Omit<IndustryMotifProps, 'motif' | 'className' | 'style'>) {
  return (
    <>
      <Grid muted={muted} />
      {/* Raw material in. */}
      <rect x="12" y="34" width="22" height="28" rx="2" stroke={muted} strokeWidth="1.25" fill="none" />
      <line x1="12" y1="43" x2="34" y2="43" stroke={muted} strokeWidth="0.75" />
      <line x1="12" y1="52" x2="34" y2="52" stroke={muted} strokeWidth="0.75" />

      {/* The process: two stages with WIP held between them. */}
      <path d="M34 48 H52" stroke={accent} strokeWidth="1.5" />
      <path d="M48 45 l4 3 -4 3" stroke={accent} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      <rect x="52" y="36" width="26" height="24" rx="3" stroke={accent} strokeWidth="1.5" fill="none" />
      <circle cx="65" cy="48" r="5" stroke={accent} strokeWidth="1.25" fill="none" />
      <line x1="65" y1="48" x2="65" y2="44.5" stroke={accent} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="65" y1="48" x2="68" y2="50" stroke={accent} strokeWidth="1.25" strokeLinecap="round" />

      <path d="M78 48 H96" stroke={muted} strokeWidth="1.25" strokeDasharray="3 3" />

      {/* Second stage. */}
      <rect x="96" y="36" width="26" height="24" rx="3" stroke={accent} strokeWidth="1.5" fill="none" />
      <line x1="102" y1="44" x2="116" y2="44" stroke={accent} strokeWidth="1.25" />
      <line x1="102" y1="49" x2="116" y2="49" stroke={accent} strokeWidth="1.25" />
      <line x1="102" y1="54" x2="110" y2="54" stroke={accent} strokeWidth="1.25" />

      {/* Finished goods out. */}
      <path d="M122 48 H138" stroke={highlight} strokeWidth="1.5" />
      <path d="M134 45 l4 3 -4 3" stroke={highlight} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="138" y="36" width="14" height="24" rx="2" stroke={highlight} strokeWidth="1.5" fill="none" />

      {/* Conversion cost accumulating under the line. */}
      <path d="M12 68 H96" stroke={muted} strokeWidth="1" />
      {[22, 38, 54, 70, 86].map((x, i) => (
        <rect key={x} x={x} y={72 - i * 1.5} width="4" height={8 + i * 1.5} rx="1" fill={accent} opacity={0.35 + i * 0.1} />
      ))}
      <text x="100" y="76" fill={muted} fontSize="6" fontFamily="var(--font-mono, monospace)">
        conversion
      </text>

      {/* The yield line: output over input. */}
      <path d="M12 86 C40 86, 60 78, 84 74 S130 68, 152 66" stroke={highlight} strokeWidth="1.5" fill="none" />
      <circle cx="152" cy="66" r="2.4" fill={highlight} />
    </>
  );
}

/** Trading — the purchase and sale legs, offset by the holding period. */
function TradeFlow({ accent, muted, highlight }: Omit<IndustryMotifProps, 'motif' | 'className' | 'style'>) {
  return (
    <>
      <Grid muted={muted} />

      {/* Purchase leg down, sale leg up — the gap is the holding period. */}
      <path d="M22 20 V78" stroke={accent} strokeWidth="1.5" />
      <path d="M18 74 l4 5 4 -5" stroke={accent} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="30" y="30" fill={accent} fontSize="6" fontFamily="var(--font-mono, monospace)">
        buy
      </text>

      {/* The held stock, between the legs. */}
      <rect x="46" y="30" width="46" height="40" rx="3" stroke={muted} strokeWidth="1.25" fill="none" strokeDasharray="4 3" />
      {[36, 44, 52, 60].map((y) => (
        <line key={y} x1="51" y1={y} x2="87" y2={y} stroke={muted} strokeWidth="0.75" opacity="0.7" />
      ))}
      <line x1="58" y1="30" x2="58" y2="70" stroke={muted} strokeWidth="0.75" opacity="0.7" />
      <line x1="80" y1="30" x2="80" y2="70" stroke={muted} strokeWidth="0.75" opacity="0.7" />

      <path d="M92 62 H138" stroke={highlight} strokeWidth="1.5" />
      <path d="M134 59 l4 3 -4 3" stroke={highlight} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="100" y="56" fill={highlight} fontSize="6" fontFamily="var(--font-mono, monospace)">
        sell
      </text>

      {/* The timing gap — where the cash sits. */}
      <path d="M22 82 H92" stroke={muted} strokeWidth="1" />
      <path d="M22 79 v6 M92 79 v6" stroke={muted} strokeWidth="1" />
      <text x="42" y="92" fill={muted} fontSize="6" fontFamily="var(--font-mono, monospace)">
        holding period
      </text>

      {/* Margin band: the thin slice between the two legs. */}
      <line x1="118" y1="30" x2="118" y2="70" stroke={muted} strokeWidth="0.75" />
      <rect x="112" y="42" width="12" height="10" rx="1" fill={highlight} opacity="0.5" />
      <text x="128" y="48" fill={muted} fontSize="6" fontFamily="var(--font-mono, monospace)">
        margin
      </text>
    </>
  );
}

/** E-commerce — the funnel, and the two returns that shrink it. */
function ParcelFlow({ accent, muted, highlight }: Omit<IndustryMotifProps, 'motif' | 'className' | 'style'>) {
  return (
    <>
      <Grid muted={muted} />

      {/* Funnel: orders narrowing to realised revenue. */}
      <path d="M14 22 H114 L84 52 V80 L58 88 V52 Z" stroke={accent} strokeWidth="1.5" fill="none" strokeLinejoin="round" />

      {/* Cancelled before dispatch — the first return. */}
      <path d="M114 22 H146" stroke={muted} strokeWidth="1.25" strokeDasharray="3 3" />
      <circle cx="150" cy="22" r="5" stroke={highlight} strokeWidth="1.5" fill="none" />
      <line x1="147" y1="19" x2="153" y2="25" stroke={highlight} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="153" y1="19" x2="147" y2="25" stroke={highlight} strokeWidth="1.5" strokeLinecap="round" />

      {/* Returned after delivery — the second. */}
      <path d="M58 88 V96 H26" stroke={muted} strokeWidth="1.25" strokeDasharray="3 3" />
      <path d="M31 93 l-5 3 5 3" stroke={muted} strokeWidth="1.25" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="90" width="12" height="12" rx="1.5" stroke={highlight} strokeWidth="1.5" fill="none" />
      <line x1="14" y1="94" x2="26" y2="94" stroke={highlight} strokeWidth="0.75" />

      {/* Realised revenue, out of the bottom of the funnel. */}
      <path d="M71 88 V100" stroke={highlight} strokeWidth="1.5" />
      <circle cx="71" cy="103" r="2.4" fill={highlight} />

      {/* Contribution, per order, as the stacked bar that makes or loses it. */}
      <g opacity="0.9">
        {[
          { x: 126, h: 10, fill: muted },
          { x: 134, h: 14, fill: muted },
          { x: 142, h: 7, fill: highlight },
        ].map((bar) => (
          <rect key={bar.x} x={bar.x} y={70 - bar.h} width="5" height={bar.h} rx="1" fill={bar.fill} />
        ))}
        <line x1="122" y1="70" x2="152" y2="70" stroke={muted} strokeWidth="0.75" />
      </g>
      <text x="120" y="80" fill={muted} fontSize="6" fontFamily="var(--font-mono, monospace)">
        per order
      </text>
    </>
  );
}

const MOTIFS = {
  machineLine: MachineLine,
  tradeFlow: TradeFlow,
  parcelFlow: ParcelFlow,
} as const;

export function IndustryMotif({ motif, accent, muted, highlight, className, style }: IndustryMotifProps) {
  const Shape = MOTIFS[motif];
  return (
    <svg
      viewBox="0 0 160 112"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
    >
      <Shape accent={accent} muted={muted} highlight={highlight} />
    </svg>
  );
}
