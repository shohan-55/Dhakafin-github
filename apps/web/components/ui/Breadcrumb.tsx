import { cn } from '@/lib/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Breadcrumb — DFDS component #30.
 * Renders a real <nav> landmark with an ordered list. The last item is marked
 * aria-current="page"; separators are decorative and hidden from assistive tech.
 * Every page at level 2+ renders this, and each instance is mirrored in
 * BreadcrumbList schema (blueprint §7.3).
 */
export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <a href={item.href} className="text-muted no-underline hover:text-sea-300">
                  {item.label}
                </a>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-[var(--df-color-text)]' : 'text-muted'}>
                  {item.label}
                </span>
              )}

              {!isLast ? (
                <span aria-hidden="true" className="text-[var(--df-color-muted-2)]">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
