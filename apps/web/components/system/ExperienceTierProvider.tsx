'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  applyTier,
  detectTier,
  TIERS,
  TIER_CAPABILITIES,
  TIER_STORAGE_KEY,
  type ExperienceTier,
  type TierPreference,
} from '@/lib/tier';

interface ExperienceTierContextValue {
  tier: ExperienceTier;
  preference: TierPreference;
  capabilities: (typeof TIER_CAPABILITIES)[ExperienceTier];
  setPreference: (preference: TierPreference) => void;
  /** True once detection has run in the browser (avoids hydration mismatch). */
  resolved: boolean;
}

const ExperienceTierContext = createContext<ExperienceTierContextValue | null>(null);

/**
 * Provides the experience tier to the tree and keeps <html data-tier> in sync.
 *
 * Sizing notes:
 * - SSR renders the `high` tier so markup is stable; detection runs immediately
 *   after mount and before any heavy child effect.
 * - The inline script in <head> (tierBootstrapScript) already applied a stored
 *   "reduced" preference before paint, so there is no flash for those users.
 */
export function ExperienceTierProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<ExperienceTier>('high');
  const [preference, setPreferenceState] = useState<TierPreference>('auto');
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let stored: TierPreference = 'auto';
    try {
      const value = window.localStorage.getItem(TIER_STORAGE_KEY);
      if (value === 'reduced') stored = 'reduced';
    } catch {
      /* storage blocked — stay on auto */
    }

    const nextTier: ExperienceTier = stored === 'reduced' ? 'lite' : detectTier();
    setPreferenceState(stored);
    setTier(nextTier);
    applyTier(nextTier, stored);
    setResolved(true);

    // React to OS-level changes (e.g. user enables Reduce Motion while browsing)
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      const autoTier = media.matches ? 'lite' : detectTier();
      if (stored === 'auto') {
        setTier(autoTier);
        applyTier(autoTier, 'auto');
      }
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const setPreference = useCallback((next: TierPreference) => {
    setPreferenceState(next);
    const nextTier: ExperienceTier = next === 'reduced' ? 'lite' : detectTier();
    setTier(nextTier);
    applyTier(nextTier, next);
    try {
      if (next === 'auto') window.localStorage.removeItem(TIER_STORAGE_KEY);
      else window.localStorage.setItem(TIER_STORAGE_KEY, next);
    } catch {
      /* storage blocked — preference simply does not persist */
    }
  }, []);

  const value = useMemo<ExperienceTierContextValue>(
    () => ({ tier, preference, capabilities: TIER_CAPABILITIES[tier], setPreference, resolved }),
    [tier, preference, setPreference, resolved]
  );

  return <ExperienceTierContext.Provider value={value}>{children}</ExperienceTierContext.Provider>;
}

export function useExperienceTier(): ExperienceTierContextValue {
  const ctx = useContext(ExperienceTierContext);
  if (!ctx) {
    throw new Error('useExperienceTier must be used inside <ExperienceTierProvider>');
  }
  return ctx;
}

/**
 * Manifest of the tier model for the design-system gallery and internal docs.
 * Exported so the UI can never drift from lib/tier.ts.
 */
export const TIER_MANIFEST = TIERS.map((id) => ({
  id,
  ...TIER_CAPABILITIES[id],
}));
