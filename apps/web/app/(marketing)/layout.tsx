import { SiteFooter } from '@/components/layouts/SiteFooter';
import { SiteHeader } from '@/components/layouts/SiteHeader';

/**
 * Marketing shell — header, main landmark, footer (blueprint §3.6 layout archetypes).
 * The portal shell (rail navigation + bottom tabs) is built in Phase 5; the reading
 * shell (720px measure for insights) is extracted in Phase 8.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-void">
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
