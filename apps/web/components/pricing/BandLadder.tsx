import { formatBDT, type NumeralSystem } from '@/lib/format';

/**
 * Band ladder — the page's one signature visual.
 * ---------------------------------------------------------------------------
 * A pricing page invites two wrong readings, and this chart is built to refuse
 * both of them:
 *
 *   · **That a bar is a range.** It is not. Every figure on this page is a floor —
 *     a line starts here and the top is set by the work. So each row prints the
 *     published band string next to the bar, and the caption says "starting band"
 *     rather than leaving the reader to infer it from a coloured rectangle.
 *   · **That the axis is linear.** It is logarithmic, because a linear axis with
 *      ৳8,000 and ৳180,000 on it would render four of the nine lines as invisible
 *     slivers and quietly tell the reader that small engagements do not exist.
 *     The scale note says so in words.
 *
 * Server component, no client JavaScript, no animation: a bar chart of nine
 * numbers does not need to move to be read, and §5.9.4's performance rule applies
 * to every page rather than only to the one it was written for.
 */

export interface BandLadderRow {
  slug: string;
  name: string;
  /** The numeric starting band, in BDT. Drives the bar. */
  amount: number;
  /** The published band string, exactly as the service page prints it. */
  band: string;
}

export function BandLadder({
  rows,
  heading,
  caption,
  scaleNote,
  numerals,
}: {
  rows: BandLadderRow[];
  heading: string;
  caption: string;
  scaleNote: string;
  numerals: NumeralSystem;
}) {
  const amounts = rows.map((row) => row.amount);
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  const span = Math.log10(max) - Math.log10(min) || 1;

  return (
    <figure className="rounded-2xl border border-[var(--df-color-border-quiet)] bg-void/30 p-6 sm:p-8">
      <figcaption className="text-sm font-semibold text-[var(--df-color-text-strong)]">{heading}</figcaption>

      <ul className="mt-6 space-y-4">
        {rows.map((row) => {
          // 14% floor so the smallest band still reads as a bar rather than a dot.
          const pct = 14 + ((Math.log10(row.amount) - Math.log10(min)) / span) * 86;
          return (
            <li key={row.slug} className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] items-center gap-x-4 gap-y-1 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,9rem)]">
              <span className="truncate text-xs text-[var(--df-color-text)] sm:text-sm">{row.name}</span>

              <span
                aria-hidden="true"
                className="col-span-2 flex h-2.5 items-center sm:col-span-1"
              >
                <span
                  className="h-1.5 rounded-full bg-[var(--df-gradient-focus)]"
                  style={{ width: `${pct}%` }}
                />
              </span>

              <span className="df-num col-start-2 text-right text-xs tabular-nums text-[var(--df-color-muted)] sm:col-start-3 sm:text-sm">
                {row.band}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-xs leading-relaxed text-[var(--df-color-muted)]">{caption}</p>
      <p className="mt-2 text-xs leading-relaxed text-[var(--df-color-muted)]">
        {scaleNote}{' '}
        <span className="whitespace-nowrap">
          ({formatBDT(min, { numerals })} – {formatBDT(max, { numerals })})
        </span>
      </p>
    </figure>
  );
}
