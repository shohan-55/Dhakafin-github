import type { Metadata } from 'next';

import { resolveLocale } from '@/lib/i18n';
import { buildMetadata } from '@/lib/seo';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { DesignSystemGallery } from './DesignSystemGallery';

/**
 * Internal reference page — not a marketing surface, so it is `noindex`. It
 * still needs a canonical and reciprocal hreflang (a crawler that reaches it
 * through a link should be told which locale it is), and it still needs a
 * per-locale description so two locales never ship identical metadata.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy =
    locale === 'bn'
      ? {
          title: 'ডিজাইন সিস্টেম — অভ্যন্তরীণ রেফারেন্স',
          description:
            'DhakaFin ডিজাইন সিস্টেমের অভ্যন্তরীণ রেফারেন্স: প্রতিটি টোকেন, কম্পোনেন্ট, স্টেট ও মোশন স্তর, আর প্রতিটি রিলিজের আগে যাচাই করা কনট্রাস্ট কনট্র্যাক্ট ও অ্যাক্সেসিবিলিটি নিয়মের তালিকা।',
        }
      : {
          title: 'Design system — internal reference',
          description:
            'Internal reference for the DhakaFin design system: every token, component, state and motion tier, plus the contrast contract checked before each release.',
        };

  return {
    ...buildMetadata({
      locale,
      path: '/design-system',
      title: copy.title,
      description: copy.description,
    }),
    robots: { index: false, follow: false },
  };
}
/**
 * The internal design-system gallery (blueprint §3.6 component quality gate).
 *
 * Purpose: make the design system falsifiable. Every component renders in every
 * state, every token is visible with its measured contrast, and the accessibility
 * contract is stated in the same place the components live — so a reviewer can
 * check a screen against the system without leaving the browser.
 */
export default function DesignSystemPage() {
  return (
    <div className="df-container df-container-wide py-10 lg:py-14">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Design system' }]} />

      <header className="mt-6 max-w-3xl">
        <p className="text-overline df-eyebrow-bar font-semibold text-sea-400">Internal reference · not indexed</p>
        <h1 className="mt-4 text-h1 text-[var(--df-color-text-strong)]">DhakaFin Design System</h1>
        <p className="mt-4 text-body-lg text-muted">
          The constitution for every screen. Tokens are the single source of truth, components declare all states, and
          motion is limited to the documented signatures. If a screen contradicts this page, the screen is wrong.
        </p>
      </header>

      <DesignSystemGallery />
    </div>
  );
}
