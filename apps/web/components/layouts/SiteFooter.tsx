import { Logo } from './Logo';
import { ReduceEffectsToggle } from '../system/TierControls';

/**
 * Site footer — blueprint §2.3.
 * Doubles as an SEO surface (keyword-rich intelligence links) and as the home of
 * the accessibility escape hatch ("Reduce effects", §3.9).
 */
const COLUMNS = [
  {
    title: 'Intelligence',
    links: [
      { label: 'TDS Rates in Bangladesh', href: '/rates/tds' },
      { label: 'VDS Rates', href: '/rates/vds' },
      { label: 'VAT Rates', href: '/rates/vat' },
      { label: 'Income Tax Slabs', href: '/rates/income-tax' },
      { label: 'Corporate Tax Rates', href: '/rates/corporate-tax' },
      { label: 'Compliance Calendar', href: '/compliance-calendar' },
      { label: 'SRO & Circular Library', href: '/sro' },
    ],
  },
  {
    title: 'Free tools',
    links: [
      { label: 'TDS Calculator', href: '/tools/tds-calculator' },
      { label: 'VDS Calculator', href: '/tools/vds-calculator' },
      { label: 'VAT Calculator', href: '/tools/vat-calculator' },
      { label: 'Income Tax Calculator', href: '/tools/income-tax-calculator' },
      { label: 'Break-even Calculator', href: '/tools/break-even-calculator' },
      { label: 'Cost Efficiency Calculator', href: '/tools/cost-efficiency-calculator' },
      { label: 'All tools', href: '/tools' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Accounting & Bookkeeping', href: '/services/accounting-bookkeeping' },
      { label: 'Audit Support', href: '/services/audit-support' },
      { label: 'Tax Services', href: '/services/tax-services' },
      { label: 'VAT Services', href: '/services/vat-services' },
      { label: 'Cost Efficiency & Internal Control', href: '/services/cost-efficiency-internal-control' },
      { label: 'Corporate Compliance', href: '/services/corporate-compliance' },
      { label: 'Financial Advisory', href: '/services/financial-advisory' },
      { label: 'Virtual CFO', href: '/services/virtual-cfo' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Team', href: '/team' },
      { label: 'Clients & case studies', href: '/clients' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Security & data', href: '/security' },
      { label: 'Editorial policy', href: '/editorial-policy' },
      { label: 'Contact', href: '/contact' },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-0 border-t border-[var(--df-color-border-quiet)] bg-[var(--df-color-slate-deep)]">
      <div className="df-container df-container-wide py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Accounting, audit, tax, VAT and financial intelligence built around one goal — helping businesses
              understand their numbers, control their costs and move forward with confidence.
            </p>
            <p className="mt-4 text-sm font-medium text-sea-300">
              Make Better Financial Decisions.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{column.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-[var(--df-color-text)] no-underline transition-colors duration-[var(--df-duration-fast)] hover:text-sea-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <hr className="df-rule my-10" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5 text-xs text-muted">
            <p>© {new Date().getFullYear()} DhakaFin. All rights reserved.</p>
            <p className="max-w-3xl leading-relaxed">
              General information based on published NBR sources — not professional advice for your specific case.
              Rate and deadline figures are verified by our tax team; always confirm against the official source before filing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {[
                { label: 'Terms', href: '/terms' },
                { label: 'Privacy', href: '/privacy' },
                { label: 'Disclaimer', href: '/disclaimer' },
                { label: 'Refund policy', href: '/refund-policy' },
              ].map((item) => (
                <a key={item.href} href={item.href} className="text-xs text-muted no-underline hover:text-sea-300">
                  {item.label}
                </a>
              ))}
            </nav>

            <ReduceEffectsToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
