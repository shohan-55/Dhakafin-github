import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { DesignSystemGallery } from './DesignSystemGallery';

export const metadata: Metadata = {
  title: 'Design system — internal reference',
  description: 'Internal DhakaFin design-system reference: tokens, components, states, motion and accessibility contract.',
  robots: { index: false, follow: false },
};

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
