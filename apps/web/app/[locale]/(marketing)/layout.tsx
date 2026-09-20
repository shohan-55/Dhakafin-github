import { SiteFooter } from '@/components/layouts/SiteFooter';
import { SiteHeader } from '@/components/layouts/SiteHeader';
import { getDictionary } from '@/lib/dictionary';
import { resolveLocale } from '@/lib/i18n';

/**
 * Marketing shell — header, main landmark, footer (blueprint §3.6 layout archetypes).
 * The portal shell (rail navigation + bottom tabs) is built in Phase 5; the reading
 * shell (720px measure for insights) is extracted in Phase 8.
 *
 * The dictionary is loaded here, once, and passed down. Client components receive
 * plain serialisable strings rather than importing the dictionary themselves —
 * which keeps the translation payload out of the client bundle for everything
 * that does not need it.
 */
export default async function MarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = getDictionary(locale);

  return (
    <div className="flex min-h-dvh flex-col bg-void">
      <SiteHeader locale={locale} dict={dict} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter locale={locale} dict={dict} />
    </div>
  );
}
