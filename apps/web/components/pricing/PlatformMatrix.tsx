import { Badge } from '@/components/ui/Badge';
import { TableWrap, THead, TR, TH, TD } from '@/components/ui/Table';
import { platformTierData, type PlatformFeatureId } from '@/lib/content/pricing';
import type { PricingCopy } from '@/lib/content/pricing-copy';
import { formatBDT, formatNumber, type NumeralSystem } from '@/lib/format';

/**
 * The platform tiers — and the honest problem with publishing them.
 * ---------------------------------------------------------------------------
 * The blueprint gives a draft SaaS scaffold in §1.5 and then says, in the same
 * section, to finalise it in Phase 5 after ten interviews. The platform does not
 * exist yet. So this component shows the design targets, marks them as design
 * targets, states the tier's status on the card and above the table, and refuses
 * to attach them to anything a reader could mistake for a checkout.
 *
 * That is also why the numbers live outside `Offer` structured data: a price
 * feed that search engines treat as an offer, for a product that cannot be bought,
 * is a claim rather than a plan. `scripts/check-pricing.mjs` asserts there are
 * exactly nine offers on the page — the nine service lines — and none for a tier.
 */

export interface PlatformTierCopy {
  name: string;
  description: string;
  audience: string;
}

export function PlatformMatrix({
  copy,
  features,
  numerals,
}: {
  copy: PricingCopy['platform'];
  features: readonly PlatformFeatureId[];
  numerals: NumeralSystem;
}) {
  const target = (low: number, high: number) =>
    `${formatBDT(low, { numerals })}–${formatNumber(high, numerals)}`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="regulatory" glyph="◷">
          {copy.statusBadge}
        </Badge>
        <span className="text-xs text-[var(--df-color-muted)]">{copy.notOnSaleLabel}</span>
      </div>

      <p className="mt-5 max-w-3xl text-body leading-relaxed text-muted">{copy.lede}</p>

      {/* ── Tier cards ───────────────────────────────────────────────────── */}
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {platformTierData.map((tier) => {
          const tierCopy: PlatformTierCopy = copy.tiers[tier.id];
          return (
            <li
              key={tier.id}
              className="flex flex-col rounded-xl border border-[var(--df-color-border-quiet)] bg-void/30 p-6"
            >
              <h3 className="text-base font-semibold text-[var(--df-color-text-strong)]">
                {tierCopy.name}
              </h3>

              <p className="mt-3 min-h-[3.5rem]">
                {tier.free ? (
                  <span className="text-lg font-semibold text-sea-300">{copy.freeLabel}</span>
                ) : tier.quoted ? (
                  <span className="text-sm text-muted">{copy.quotedLabel}</span>
                ) : tier.targetMonthly ? (
                  <>
                    <span className="df-num text-lg text-sea-300">
                      {target(tier.targetMonthly.low, tier.targetMonthly.high)}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[var(--df-color-muted)]">
                      {copy.targetLabel} · {copy.monthlySuffix}
                    </span>
                  </>
                ) : null}
              </p>

              <p className="mt-2 text-xs leading-relaxed text-muted">{tierCopy.description}</p>

              <p className="mt-4 border-t border-[var(--df-color-border-quiet)] pt-4 text-[11px] leading-relaxed text-[var(--df-color-muted)]">
                <span className="font-semibold uppercase tracking-[0.1em]">{copy.audienceLabel}: </span>
                {tierCopy.audience}
              </p>
            </li>
          );
        })}
      </ul>

      {/* ── Feature matrix ───────────────────────────────────────────────── */}
      <TableWrap caption={copy.heading} className="mt-8">
        <THead>
          <TR hoverable={false}>
            <TH>{copy.featureColumn}</TH>
            {platformTierData.map((tier) => (
              <TH key={tier.id}>{copy.tiers[tier.id].name}</TH>
            ))}
          </TR>
        </THead>
        <tbody>
          {features.map((feature) => (
            <TR key={feature}>
              <TH scope="row" className="text-left text-xs font-medium normal-case tracking-normal text-[var(--df-color-text)]">
                {copy.features[feature].label}
              </TH>
              {platformTierData.map((tier) => (
                <TD key={tier.id} className="text-xs text-muted">
                  {copy.features[feature].values[tier.id]}
                </TD>
              ))}
            </TR>
          ))}
        </tbody>
      </TableWrap>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <p className="rounded-xl border border-[var(--df-color-border-quiet)] bg-void/30 p-4 text-xs leading-relaxed text-muted">
          <span className="font-semibold text-[var(--df-color-text)]">{copy.annualLabel}: </span>
          {copy.annualNote}
        </p>
        <p className="rounded-xl border border-dashed border-[var(--df-color-border-strong)] bg-void/30 p-4 text-xs leading-relaxed text-[var(--df-color-muted)]">
          {copy.finalNote}
        </p>
      </div>
    </div>
  );
}
