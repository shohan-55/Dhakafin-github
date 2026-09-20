import { LocaleLink } from '@/components/system/LocaleLink';
import { Badge } from '@/components/ui/Badge';
import { ServiceMotif } from '@/components/marketing/ServiceMotif';
import { serviceOrder, type ServiceGroupId } from '@/lib/content/services';
import type { ServiceHubCopy, ServicesCopy } from '@/lib/content/service-copy';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/cn';

/**
 * The service ecosystem.
 * ---------------------------------------------------------------------------
 * Blueprint §5.6.2 asks for an interactive node map. It also asks, in the same
 * acceptance list (§5.6.4 #3 and #5), for keyboard navigation in numeric order,
 * a non-visual list in the DOM, and — on mobile — a grouped accordion and
 * *never* a squashed diagram.
 *
 * Those requirements fight each other if you build a canvas diagram and bolt
 * accessibility on afterwards. So this is built the other way round: it is a
 * numbered, grouped list of links. The vertical spine, the group bands and the
 * connector marks are styling applied to that list. The result is that the
 * desktop and mobile renderings are the *same* markup at different breakpoints,
 * there is one tab order (01→09), the screen-reader experience is the primary
 * experience rather than a fallback, and a crawlable link to all nine services
 * sits in the HTML.
 *
 * The preview card is CSS-only (`group-hover` / `group-focus-within`), so this
 * is a server component with zero client JavaScript.
 */
export function ServiceEcosystem({
  locale,
  copy,
  servicesCopy,
}: {
  locale: Locale;
  copy: ServiceHubCopy;
  servicesCopy: ServicesCopy;
}) {
  const groups: ServiceGroupId[] = ['foundations', 'control', 'growth'];

  return (
    /* The numbered spine. */
      <ol
        aria-label={copy.ecosystem.listLabel}
        className="relative border-s border-[var(--df-color-border-quiet)] ps-6 md:ps-10"
      >
        {serviceOrder.map((entry, index) => {
          const item = servicesCopy.items[entry.slug];
          const previous = index > 0 ? serviceOrder[index - 1] : undefined;
          const startsGroup = !previous || previous.group !== entry.group;

          return (
            <li key={entry.slug} className={cn('relative', startsGroup && index > 0 && 'mt-14')}>
              {startsGroup ? (
                <div className={cn('mb-4', index > 0 && '-mt-6')}>
                  <p className="text-overline font-semibold text-sea-400">{copy.groups[entry.group]}</p>
                  <p className="mt-1.5 max-w-[58ch] text-sm text-muted">{copy.groupsLede[entry.group]}</p>
                </div>
              ) : null}

              <LocaleLink
                locale={locale}
                href={`/services/${entry.slug}`}
                aria-label={`${copy.ecosystem.openLabel}: ${item.name}`}
                className="group relative block rounded-2xl border border-[var(--df-color-border-quiet)] bg-surface1 p-5 no-underline transition-colors duration-[var(--df-duration-base)] hover:border-[var(--df-color-border-hover)] focus-visible:border-[var(--df-color-sea-400)]"
              >
                <span className="flex flex-wrap items-center gap-3">
                  <span className="tabular font-mono text-xs font-semibold text-sea-300 df-num">
                    {String(entry.order).padStart(2, '0')}
                  </span>
                  <span className="text-lg font-semibold text-strong">{item.name}</span>
                  <Badge tone="sea" className="ms-auto hidden sm:inline-flex">
                    {item.hero.priceBand}
                  </Badge>
                </span>
                <span className="mt-2 block max-w-[62ch] text-sm text-muted">{item.outcome}</span>

                {/* Preview: problem, three deliverables, who it is for, price. */}
                <span className="mt-4 hidden gap-6 border-t border-[var(--df-color-border-quiet)] pt-4 group-focus-within:grid group-hover:grid md:grid-cols-[1.2fr_1fr]">
                  <span className="block">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted-2)]">
                      {copy.ecosystem.problemLabel}
                    </span>
                    <span className="mt-1.5 block text-sm text-[var(--df-color-text)]">{item.problem.items[0]}</span>
                    <span className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted-2)]">
                      {copy.ecosystem.deliverablesLabel}
                    </span>
                    <span className="mt-1.5 block space-y-1">
                      {item.deliverables.items.slice(0, 3).map((d) => (
                        <span key={d.name} className="block text-sm text-muted">
                          · {d.name}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="block">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted-2)]">
                      {copy.ecosystem.whoLabel}
                    </span>
                    <span className="mt-1.5 block text-sm text-muted">{item.hero.chips.join(' · ')}</span>
                    <span className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--df-color-muted-2)]">
                      {copy.ecosystem.priceLabel}
                    </span>
                    <span className="mt-1.5 block text-sm text-[var(--df-color-text)] df-num">{item.hero.priceBand}</span>
                  </span>
                </span>
              </LocaleLink>
            </li>
          );
        })}
    </ol>
  );
}

/**
 * The nine services as a plain grouped list, for pages that need the links
 * without the spine (the hub's "choose by" band, footer cross-links).
 */
export function ServiceIndexList({
  locale,
  servicesCopy,
  groupLabels,
}: {
  locale: Locale;
  servicesCopy: ServicesCopy;
  groupLabels: Record<ServiceGroupId, string>;
}) {
  const groups: ServiceGroupId[] = ['foundations', 'control', 'growth'];

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {groups.map((group) => (
        <div key={group}>
          <h3 className="text-overline font-semibold text-sea-400">{groupLabels[group]}</h3>
          <ul className="mt-4 space-y-3">
            {serviceOrder
              .filter((e) => e.group === group)
              .map((entry) => (
                <li key={entry.slug}>
                  <LocaleLink
                    locale={locale}
                    href={`/services/${entry.slug}`}
                    className="group flex gap-3 no-underline"
                  >
                    <ServiceMotif
                      motif={entry.motif}
                      className="mt-0.5 h-8 w-12 shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-[var(--df-color-text-strong)] group-hover:text-sea-300">
                        {servicesCopy.items[entry.slug].name}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                        {servicesCopy.items[entry.slug].outcome}
                      </span>
                    </span>
                  </LocaleLink>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
