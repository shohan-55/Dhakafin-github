'use client';

import { ExperienceTierProvider } from './ExperienceTierProvider';
import { ToastProvider } from './Toast';

/**
 * Single composition point for client-side providers.
 * Order matters: tier first (it owns the root data attributes that CSS reads),
 * then toast (which uses tier-aware animation classes).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ExperienceTierProvider>
      <ToastProvider>{children}</ToastProvider>
    </ExperienceTierProvider>
  );
}
