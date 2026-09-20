import { cn } from '@/lib/cn';

export type CardTone = 'context' | 'glass' | 'quiet';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  tone?: CardTone;
  /** Adds the cursor-following spotlight (requires SpotlightCard wrapper). */
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'article' | 'section' | 'li';
  children: React.ReactNode;
}

const toneClasses: Record<CardTone, string> = {
  context: 'bg-surface1 border border-[var(--df-color-border)] shadow-[var(--shadow-2)]',
  glass: 'df-glass df-edge',
  quiet: 'bg-surface1/50 border border-[var(--df-color-border-quiet)]',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const;

/**
 * Card — DFDS component #3.
 * Every dark card carries the `metal-edge` inner highlight (inset white 6% +
 * bottom shadow) — the single detail that makes DhakaFin surfaces read as
 * machined rather than as default dark-theme boxes.
 */
export function Card({
  tone = 'context',
  interactive = false,
  padding = 'md',
  as: Tag = 'div',
  className,
  children,
  ...rest
}: CardProps) {
  // Polymorphic for markup semantics (article/section/li). TS cannot narrow the
  // attribute union per tag, so we render through a concrete element type.
  const Component = Tag as 'div';

  return (
    <Component
      className={cn(
        'relative rounded-xl transition-[transform,border-color,box-shadow]',
        'duration-[var(--df-duration-slow)] ease-[var(--ease-out)]',
        toneClasses[tone],
        paddingClasses[padding],
        interactive &&
          cn(
            'hover:-translate-y-0.5 hover:border-[var(--df-color-border-hover)] hover:shadow-[var(--shadow-3)]',
            'motion-reduce:hover:translate-y-0'
          ),
        className
      )}
      {...rest}
    >
      {tone === 'context' ? (
        <span
          aria-hidden="true"
          className="df-edge-top"
        />
      ) : null}
      {children}
    </Component>
  );
}

export function CardHeader({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  as: Tag = 'h3',
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h2' | 'h3' | 'h4' }) {
  return (
    <Tag className={cn('text-h4 font-semibold text-[var(--df-color-text-strong)]', className)} {...rest}>
      {children}
    </Tag>
  );
}

export function CardDescription({ className, children, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('mt-2 text-sm leading-relaxed text-muted', className)} {...rest}>
      {children}
    </p>
  );
}

export function CardFooter({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--df-color-border-quiet)] pt-4', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
