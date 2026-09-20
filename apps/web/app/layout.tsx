import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import './globals.css';
import { Providers } from '@/components/system/Providers';
import { tokens } from '@dhakafin/tokens';
import { tierBootstrapScript } from '@/lib/tier';

/* ─── Font pipeline (DF-P1-004) ───
 * SELF-HOSTED, not next/font/google. Why this matters beyond style:
 *   · no third-party connection on first paint (no DNS + TLS + RTT to fonts.gstatic.com)
 *   · the build is hermetic — CI and air-gapped deploys cannot fail on a Google outage
 *   · no IP disclosure to a third party (blueprint §9 privacy posture)
 *   · Next.js fingerprints every file and injects `size-adjust` fallback metrics,
 *     so the system-font fallback occupies identical space → zero layout shift.
 *
 * Budget: 180 KB (token `font.budgetKB`, blueprint §3.4.1). Files total 244 KB on
 * disk, but the *first-paint* cost on an English page is 50 KB — see below.
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
  src: './fonts/plus-jakarta-sans-latin-wght-normal.woff2',
  weight: '200 800',
  style: 'normal',
  display: 'swap',
  preload: true,
  variable: '--font-jakarta',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});

const grotesk = localFont({
  src: './fonts/space-grotesk-latin-wght-normal.woff2',
  weight: '300 700',
  style: 'normal',
  display: 'swap',
  preload: true,
  variable: '--font-grotesk',
  fallback: ['ui-monospace', 'monospace'],
});

const hind = localFont({
  src: [
    { path: './fonts/hind-siliguri-bengali-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/hind-siliguri-bengali-600-normal.woff2', weight: '600', style: 'normal' },
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
  src: './fonts/jetbrains-mono-latin-wght-normal.woff2',
  weight: '100 800',
  style: 'normal',
  display: 'swap',
  preload: false,
  variable: '--font-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});

/* ─── The taka sign, and why it needs its own font ───
 * ৳ is U+09F3 — inside the Bengali block, but it appears in *English* prose
 * ("৳12.5 L"). No Latin face we ship carries it, so before this face existed the
 * browser downloaded the entire 139 KB Bengali font to draw one currency sign.
 *
 * These are pyftsubset extractions of Hind Siliguri covering only U+09F2/09F3/20B9:
 * 960 bytes total. Two weights so ৳ is never synthesised-bolded beside a heavy
 * metric numeral. Regeneration is documented in ./fonts/README.md.
 */
const currency = localFont({
  src: [
    { path: './fonts/dhakafin-currency-bn-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/dhakafin-currency-bn-600.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-currency',
  fallback: ['sans-serif'],
  declarations: [{ prop: 'unicode-range', value: 'U+09F2-09F3,U+20B9' }],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dhakafin.com'),
  title: {
    default: 'DhakaFin — Financial Intelligence, Accounting & Compliance for Bangladesh',
    template: '%s | DhakaFin',
  },
  description:
    'Make better financial decisions. Accounting, audit, tax, VAT and financial intelligence for Bangladeshi businesses — with free tools, verified NBR rates and a compliance calendar.',
  applicationName: 'DhakaFin',
  keywords: [
    'accounting firm Bangladesh',
    'TDS rate Bangladesh',
    'VDS rate',
    'VAT return Mushak 9.1',
    'income tax slab Bangladesh',
    'financial intelligence',
    'virtual CFO Bangladesh',
  ],
  authors: [{ name: 'DhakaFin' }],
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    siteName: 'DhakaFin',
    title: 'DhakaFin — Make Better Financial Decisions.',
    description:
      'Accounting, audit, tax, VAT and financial intelligence built around one goal — helping businesses understand their numbers, control their costs and grow with confidence.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DhakaFin — Make Better Financial Decisions.',
    description: 'Financial intelligence, compliance and accounting for Bangladeshi businesses.',
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: tokens['color.void'],
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-tier="high"
      data-motion="on"
      data-theme="dark"
      className={`${jakarta.variable} ${grotesk.variable} ${hind.variable} ${mono.variable} ${currency.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies a stored "Reduce effects" preference before paint → no flash. */}
        <script dangerouslySetInnerHTML={{ __html: tierBootstrapScript }} />
      </head>
      <body className="min-h-dvh bg-void antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
