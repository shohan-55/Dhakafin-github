import localFont from 'next/font/local';

/* ─── Font pipeline (DF-P1-004) — see ./README.md before changing anything ───
 * SELF-HOSTED, not next/font/google. Why this matters beyond style:
 *   · no third-party connection on first paint (no DNS + TLS + RTT to fonts.gstatic.com)
 *   · the build is hermetic — CI and air-gapped deploys cannot fail on a Google outage
 *   · no IP disclosure to a third party (blueprint §9 privacy posture)
 *   · Next.js fingerprints every file and injects `size-adjust` fallback metrics,
 *     so the system-font fallback occupies identical space → zero layout shift.
 *
 * Budget: 180 KB (token `font.budgetKB`, blueprint §3.4.1). Files total 244 KB on
 * disk, but the *first-paint* cost on an English page is ~50 KB — see below.
 *
 * Bengali is the expensive subset (71 KB + 74 KB). It carries an explicit
 * `unicode-range`, so a browser only fetches it when the page actually renders a
 * Bengali codepoint. An English page therefore never downloads it; a Bangla page
 * pays for it and gets correct conjunct shaping instead of tofu. This is why the
 * budget is expressed per-page rather than per-repo.
 *
 * Bangla weight 500 is deliberately absent: Hind Siliguri's 400/600 pair covers
 * body and emphasis in Bangla, and shipping a third 72 KB file to render one
 * eyebrow label is not a trade the performance directive allows.
 */
const jakarta = localFont({
  src: './plus-jakarta-sans-latin-wght-normal.woff2',
  weight: '200 800',
  style: 'normal',
  display: 'swap',
  preload: true,
  variable: '--font-jakarta',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});

const grotesk = localFont({
  src: './space-grotesk-latin-wght-normal.woff2',
  weight: '300 700',
  style: 'normal',
  display: 'swap',
  preload: true,
  variable: '--font-grotesk',
  fallback: ['ui-monospace', 'monospace'],
});

const hind = localFont({
  src: [
    { path: './hind-siliguri-bengali-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './hind-siliguri-bengali-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  preload: false,
  variable: '--font-hind',
  fallback: ['sans-serif'],
  // NOTE: the literal must be inline — next/font serialises options into a query
  // string at build time and cannot evaluate a module-level constant.
  declarations: [
    {
      prop: 'unicode-range',
      value:
        'U+0951-0952,U+0964-0965,U+0980-09F1,U+09F4-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CE1,U+1CEA,U+1CED,U+1CF2,U+1CF5-1CF7,U+200C-200D,U+25CC,U+A8F1',
    },
  ],
});

const mono = localFont({
  src: './jetbrains-mono-latin-wght-normal.woff2',
  weight: '100 800',
  style: 'normal',
  display: 'swap',
  preload: false,
  variable: '--font-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});

/* ─── The Bengali glyphs that appear in LATIN UI — and why they need their own font ───
 * Two things are Bengali-script but belong to the English page:
 *   · ৳ (U+09F3) — the taka sign, written constantly in English prose ("৳12.5 L")
 *   · বাংলা (U+09AC, U+09BE, U+0982, U+09B2) — the language switcher's own label
 *
 * No Latin face we ship carries either. Without this face, the browser resolved
 * them through the full Bengali font and downloaded 139 KB to draw six glyphs —
 * 58% of the English page's entire font payload, for a currency symbol and a
 * two-word link.
 *
 * These are pyftsubset extractions of Hind Siliguri at 748 bytes each. Two weights
 * so a glyph is never synthesised-bolded beside a heavy metric numeral.
 *
 * No `unicode-range` carve-out is needed on the Bengali face below: this family is
 * listed BEFORE it in every stack in globals.css, and the browser uses the first
 * family that covers a codepoint. Adding a glyph here is therefore a one-line
 * change with no risk of breaking the Bengali page.
 *
 * Regeneration is documented in ./README.md.
 */
const uiBengali = localFont({
  src: [
    { path: './dhakafin-ui-bn-400.woff2', weight: '400', style: 'normal' },
    { path: './dhakafin-ui-bn-600.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-ui-bn',
  fallback: ['sans-serif'],
  declarations: [{ prop: 'unicode-range', value: 'U+0982,U+09AC,U+09B2,U+09BE,U+09F2-09F3,U+20B9' }],
});

/** Class string that must be applied to `<html>` for every font variable to exist. */
export const fontVariables = [
  jakarta.variable,
  grotesk.variable,
  hind.variable,
  mono.variable,
  uiBengali.variable,
].join(' ');
