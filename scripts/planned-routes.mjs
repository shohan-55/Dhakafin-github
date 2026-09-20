/**
 * Routes that are linked from the site but deliberately not built yet.
 * ---------------------------------------------------------------------------
 * This list exists so `check-links.mjs` can be a real gate from the first day of
 * Phase 2 instead of a warning nobody reads. The site is being built in public
 * order — the header and footer already point at the whole information
 * architecture, because that IA is the design, and a nav that only lists what
 * happens to exist this week is not a design.
 *
 * The rule that keeps this honest: **the list may only shrink.**
 *
 *   · Building a route means deleting its line here in the same commit. If you
 *     forget, `check-links.mjs` reports it as a stale entry and the build fails.
 *   · Adding a line requires the blueprint task that owns it. A route with no
 *     owner is a route nobody will build.
 *   · When the list is empty, delete this file and the checks that read it.
 *
 * `href` is the canonical (default-locale) path. It is checked in every locale,
 * so a route listed once here is exempt in both English and Bengali.
 */
export const plannedRoutes = [
  // ── Free tools — §5.5, BUILT in DF-P2-011. Re-add nothing here. ──────────

  // ── Regulatory intelligence — §5.4, Phase 3 data, Phase 2 shell ──────────
  { href: '/rates', task: 'DF-P3-001', what: 'Rate hub landing' },
  { href: '/rates/tds', task: 'DF-P3-002', what: 'TDS rate family' },
  { href: '/rates/vds', task: 'DF-P3-002', what: 'VDS rate family' },
  { href: '/rates/vat', task: 'DF-P3-002', what: 'VAT rate family' },
  { href: '/rates/income-tax', task: 'DF-P3-002', what: 'Income-tax slab family' },
  { href: '/rates/corporate-tax', task: 'DF-P3-002', what: 'Corporate-tax family' },
  { href: '/sro', task: 'DF-P3-005', what: 'SRO library' },
  { href: '/compliance-calendar', task: 'DF-P2-015', what: 'Public compliance calendar' },

  // ── Static core pages — DF-P2-025 ────────────────────────────────────────
  { href: '/about', task: 'DF-P2-025', what: 'About' },
  { href: '/team', task: 'DF-P2-025', what: 'Team' },
  { href: '/clients', task: 'DF-P2-025', what: 'Clients and case studies' },
  { href: '/pricing', task: 'DF-P2-025', what: 'Pricing' },
  { href: '/security', task: 'DF-P2-025', what: 'Security and data handling' },
  { href: '/contact', task: 'DF-P2-025', what: 'Contact' },
  { href: '/editorial-policy', task: 'DF-P2-025', what: 'Editorial and verification policy' },
  { href: '/terms', task: 'DF-P2-025', what: 'Terms' },
  { href: '/privacy', task: 'DF-P2-025', what: 'Privacy' },
  { href: '/disclaimer', task: 'DF-P2-025', what: 'Disclaimer' },
  { href: '/refund-policy', task: 'DF-P2-025', what: 'Refund policy' },

  // ── Experiences and conversion — DF-P2-044, DF-P2-026, DF-P2-019 ─────────
  { href: '/cost-efficiency', task: 'DF-P2-044', what: 'Cost-efficiency experience page' },
  { href: '/diagnostic', task: 'DF-P2-015', what: 'Financial health diagnostic' },
  { href: '/book-consultation', task: 'DF-P2-026', what: 'Booking flow' },
  { href: '/insights', task: 'DF-P2-017', what: 'Insights index (CMS-driven)' },

  // ── Portal entry point — Phase 5, linked from the header for continuity ──
  { href: '/sign-in', task: 'DF-P5-001', what: 'Portal sign-in' },
];

/** Fast membership test for the gate. */
export const plannedSet = new Set(plannedRoutes.map((r) => r.href));
