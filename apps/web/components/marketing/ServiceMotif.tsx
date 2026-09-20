import type { ServiceMotifKey } from '@/lib/content/services';
import { cn } from '@/lib/cn';

/**
 * Service motifs — nine distinct, capability-specific diagrams.
 * ---------------------------------------------------------------------------
 * The blueprint (§5.6.3) requires a hero visual "specific to the service, not a
 * generic illustration", and the standing brief requires every major visual
 * element to connect to a real product capability. So these are not decoration:
 *
 *   ledger   two ledger columns that meet at a reconciled balance
 *   sampling the auditor's sampling frame, with exceptions marked not hidden
 *   brackets a progressive-rate ladder with the effective-rate line across it
 *   mushak   a sales register flowing into a return, input credit matched
 *   leak     a cost waterfall with the recovered leakage marked where found
 *   gate     dual authorisation — two independent paths to one release point
 *   calendar a month-by-month obligation grid across the year
 *   fan      three scenarios diverging from one baseline, downside drawn equal
 *   cockpit  runway, burn and working capital read together
 *
 * Each one is described in the accessible caption beside it, so the meaning
 * survives without the drawing. All stroke/fill colours come from tokens and
 * are passed in as props rather than referenced through arbitrary-value classes,
 * because these are `currentColor`-driven and inherit from their container.
 */
export function ServiceMotif({
  motif,
  className,
}: {
  motif: ServiceMotifKey;
  className?: string;
}) {
  const accent = 'var(--df-color-sea-400)';
  const accentDim = 'color-mix(in srgb, var(--df-color-sea-400) 34%, transparent)';
  const quiet = 'var(--df-color-border-quiet)';
  const strong = 'var(--df-color-text-strong)';

  const line = { fill: 'none', stroke: accent, strokeWidth: 1.6, strokeLinecap: 'round' as const };

  return (
    <svg
      viewBox="0 0 320 200"
      role="presentation"
      aria-hidden="true"
      className={cn('h-auto w-full', className)}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Every motif sits on the same faint measurement grid, so the nine read
          as one family rather than nine drawings. */}
      <g opacity="0.35">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="16" x2="304" y1={32 + i * 34} y2={32 + i * 34} stroke={quiet} strokeWidth="1" />
        ))}
      </g>

      {motif === 'ledger' && (
        <g>
          <rect x="40" y="40" width="70" height="120" rx="4" fill="none" stroke={accentDim} />
          <rect x="120" y="40" width="70" height="120" rx="4" fill="none" stroke={accentDim} />
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1="52" x2="98" y1={62 + i * 20} y2={62 + i * 20} stroke={quiet} strokeWidth="1" />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={`b${i}`} x1="132" x2="178" y1={62 + i * 20} y2={62 + i * 20} stroke={quiet} strokeWidth="1" />
          ))}
          {/* The reconciliation: the two columns agree on one line. */}
          <line x1="40" y1="160" x2="190" y2="160" stroke={accent} strokeWidth="2.4" />
          <circle cx="190" cy="160" r="4" fill={accent} />
          <path d="M232 176 L232 118" stroke={accent} strokeWidth="1.4" strokeDasharray="4 4" />
          <path d="M232 176 C232 160 262 128 262 118" {...line} />
          <circle cx="262" cy="118" r="3.5" fill={accent} />
        </g>
      )}

      {motif === 'sampling' && (
        <g>
          {Array.from({ length: 24 }).map((_, i) => {
            const col = i % 6;
            const row = Math.floor(i / 6);
            const selected = [2, 7, 12, 17, 20].includes(i);
            const exception = [12, 20].includes(i);
            return (
              <rect
                key={i}
                x={40 + col * 32}
                y={40 + row * 30}
                width="22"
                height="20"
                rx="3"
                fill={selected ? accentDim : 'none'}
                stroke={exception ? 'var(--df-color-risk)' : selected ? accent : quiet}
                strokeWidth={selected ? 1.6 : 1}
              />
            );
          })}
          <path d="M262 40 L262 160" stroke={quiet} strokeWidth="1" strokeDasharray="3 5" />
          <path d="M270 62 h14 M270 92 h14 M270 122 h8" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}

      {motif === 'brackets' && (
        <g>
          {[
            { x: 40, y: 128, h: 32 },
            { x: 96, y: 100, h: 60 },
            { x: 152, y: 70, h: 90 },
            { x: 208, y: 46, h: 114 },
          ].map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width="44" height={b.h} rx="3" fill={accentDim} stroke="none" />
          ))}
          {/* Effective rate climbs more slowly than the brackets step. */}
          <path d="M40 148 C110 128 190 84 274 62" {...line} />
          <circle cx="274" cy="62" r="3.5" fill={accent} />
          <line x1="20" y1="160" x2="300" y2="160" stroke={quiet} strokeWidth="1" />
        </g>
      )}

      {motif === 'mushak' && (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="36" y={44 + i * 30} width="58" height="22" rx="3" fill="none" stroke={quiet} />
          ))}
          <path d="M94 55 C130 55 130 108 164 108" {...line} />
          <path d="M94 145 C130 145 130 108 164 108" {...line} />
          <rect x="164" y="72" width="72" height="72" rx="5" fill="none" stroke={accent} strokeWidth="1.6" />
          <line x1="176" y1="94" x2="224" y2="94" stroke={accentDim} strokeWidth="2" />
          <line x1="176" y1="112" x2="224" y2="112" stroke={accentDim} strokeWidth="2" />
          <line x1="176" y1="130" x2="212" y2="130" stroke={accent} strokeWidth="2.4" />
          <path d="M236 108 L272 108" {...line} />
          <circle cx="280" cy="108" r="4" fill={accent} />
        </g>
      )}

      {motif === 'leak' && (
        <g>
          {[
            { x: 36, w: 66, y: 46 },
            { x: 92, w: 58, y: 78 },
            { x: 140, w: 52, y: 106 },
            { x: 184, w: 46, y: 128 },
          ].map((s, i) => (
            <rect key={i} x={s.x} y={s.y} width={s.w} height="20" rx="3" fill={accentDim} stroke="none" />
          ))}
          {/* The found leak, marked at the step where it was discovered. */}
          <circle cx="166" cy="116" r="9" fill="none" stroke="var(--df-color-risk)" strokeWidth="1.8" />
          <path d="M166 100 L166 88 M172 92 L180 84" stroke="var(--df-color-risk)" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M230 128 L230 74" stroke={accent} strokeWidth="2.2" />
          <path d="M224 82 L230 72 L236 82" {...line} />
          <line x1="20" y1="160" x2="300" y2="160" stroke={quiet} strokeWidth="1" />
        </g>
      )}

      {motif === 'gate' && (
        <g>
          <path d="M96 40 L96 110 C96 140 140 158 160 164" {...line} />
          <path d="M224 40 L224 110 C224 140 180 158 160 164" {...line} />
          <circle cx="96" cy="40" r="6" fill="none" stroke={accent} strokeWidth="1.8" />
          <circle cx="224" cy="40" r="6" fill="none" stroke={accent} strokeWidth="1.8" />
          <rect x="140" y="158" width="40" height="14" rx="4" fill={accentDim} stroke="none" />
          <line x1="140" y1="176" x2="180" y2="176" stroke={accent} strokeWidth="2.4" />
          {/* Nothing passes on one path alone. */}
          <path d="M160 60 L160 30" stroke={quiet} strokeWidth="1" strokeDasharray="3 4" />
        </g>
      )}

      {motif === 'calendar' && (
        <g>
          {Array.from({ length: 36 }).map((_, i) => {
            const col = i % 12;
            const row = Math.floor(i / 12);
            const filled = [1, 5, 8, 13, 17, 22, 26, 29, 34].includes(i);
            const urgent = [17, 29].includes(i);
            return (
              <rect
                key={i}
                x={36 + col * 21}
                y={44 + row * 38}
                width="15"
                height="28"
                rx="3"
                fill={filled ? (urgent ? 'var(--df-color-warn)' : accentDim) : 'none'}
                stroke={filled ? 'none' : quiet}
                strokeWidth="1"
              />
            );
          })}
          <line x1="30" y1="36" x2="290" y2="36" stroke={accent} strokeWidth="1.6" />
          <circle cx="36" cy="36" r="3.5" fill={accent} />
        </g>
      )}

      {motif === 'fan' && (
        <g>
          <path d="M40 158 L96 158" stroke={strong} strokeWidth="2" />
          <path d="M96 158 C150 150 200 120 276 62" {...line} />
          <path d="M96 158 C150 156 200 146 276 124" stroke={accent} strokeWidth="1.6" fill="none" />
          {/* The downside is drawn as deliberately as the upside. */}
          <path d="M96 158 C150 160 206 168 276 178" stroke="var(--df-color-risk)" strokeWidth="1.8" fill="none" />
          <circle cx="276" cy="62" r="3.5" fill={accent} />
          <circle cx="276" cy="124" r="3" fill={accent} />
          <circle cx="276" cy="178" r="3.5" fill="var(--df-color-risk)" />
          <circle cx="96" cy="158" r="4" fill={strong} />
        </g>
      )}

      {motif === 'cockpit' && (
        <g>
          {/* Runway bar. */}
          <rect x="36" y="52" width="248" height="14" rx="7" fill="none" stroke={quiet} />
          <rect x="36" y="52" width="164" height="14" rx="7" fill={accentDim} stroke="none" />
          <line x1="200" y1="46" x2="200" y2="72" stroke={accent} strokeWidth="1.6" />
          {/* Burn against plan. */}
          <path d="M36 108 L84 100 L132 112 L180 92 L228 104 L284 88" {...line} />
          <path d="M36 108 L284 108" stroke={quiet} strokeWidth="1" strokeDasharray="3 4" />
          {/* Working capital gauges, read together. */}
          <circle cx="92" cy="156" r="20" fill="none" stroke={quiet} strokeWidth="1.4" />
          <path d="M92 136 A20 20 0 0 1 109 166" stroke={accent} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <circle cx="160" cy="156" r="20" fill="none" stroke={quiet} strokeWidth="1.4" />
          <path d="M160 136 A20 20 0 0 1 172 172" stroke={accent} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <circle cx="228" cy="156" r="20" fill="none" stroke={quiet} strokeWidth="1.4" />
          <path d="M228 136 A20 20 0 0 1 247 148" stroke="var(--df-color-warn)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
