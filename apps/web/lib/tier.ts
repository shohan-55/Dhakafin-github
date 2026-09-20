/**
 * Experience tier system — DF-P1-007 · blueprint §3.9
 *
 * Four tiers degrade gracefully instead of shipping one heavy experience to every
 * device. Detection is deterministic and explainable; the user can always override
 * ("Reduce effects"), and any error path falls back to the cheapest tier.
 *
 *   ultra     desktop, capable GPU, fast connection, no reduced-motion
 *   high      desktop mid-range / high-end mobile
 *   balanced  mid mobile or constrained connection
 *   lite      low-end, saveData, reduced-motion, no WebGL, or explicit override
 */

export const TIERS = ['ultra', 'high', 'balanced', 'lite'] as const;
export type ExperienceTier = (typeof TIERS)[number];

export const TIER_STORAGE_KEY = 'dhakafin.effects';
export type TierPreference = 'auto' | 'reduced';

export const TIER_CAPABILITIES: Record<
  ExperienceTier,
  { webgl: 'full' | 'simplified' | 'none'; blur: boolean; spotlight: boolean; pinnedScroll: boolean; label: string; description: string }
> = {
  ultra: {
    webgl: 'full',
    blur: true,
    spotlight: true,
    pinnedScroll: true,
    label: 'Ultra',
    description: 'Full WebGL scenes, spotlight cards, scroll storytelling.',
  },
  high: {
    webgl: 'full',
    blur: true,
    spotlight: true,
    pinnedScroll: true,
    label: 'High',
    description: 'Full WebGL at reduced device-pixel ratio, all interactions.',
  },
  balanced: {
    webgl: 'simplified',
    blur: true,
    spotlight: false,
    pinnedScroll: false,
    label: 'Balanced',
    description: 'Simplified 3D, CSS micro-interactions, no pinned scroll.',
  },
  lite: {
    webgl: 'none',
    blur: false,
    spotlight: false,
    pinnedScroll: false,
    label: 'Lite',
    description: 'No WebGL or glass blur. Every feature still fully usable.',
  },
};

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string; downlink?: number };
}

/** Runs in the browser only. Returns the tier implied by the device/environment. */
export function detectTier(): ExperienceTier {
  if (typeof window === 'undefined') return 'high';

  try {
    const nav = window.navigator as NavigatorWithMemory;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Hard stops → lite. These are promises, not heuristics.
    if (prefersReduced) return 'lite';
    if (nav.connection?.saveData) return 'lite';
    if (!supportsWebGL()) return 'lite';

    const cores = nav.hardwareConcurrency ?? 4;
    const memory = nav.deviceMemory ?? 4;
    const slowConnection =
      nav.connection?.effectiveType === 'slow-2g' || nav.connection?.effectiveType === '2g';

    if (slowConnection || cores <= 2 || memory <= 2) return 'lite';
    if (cores <= 4 || memory <= 4) return 'balanced';

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(nav.userAgent);
    if (isMobile) return 'balanced';

    return cores >= 8 && memory >= 8 ? 'ultra' : 'high';
  } catch {
    // Any failure means the safest experience, never a broken one.
    return 'lite';
  }
}

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

/** Applies tier + motion attributes to <html> so CSS can respond without JS re-render. */
export function applyTier(tier: ExperienceTier, preference: TierPreference): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.tier = tier;
  root.dataset.motion = tier === 'lite' ? 'off' : 'on';
  root.dataset.effects = preference;
  root.style.setProperty('--df-tier-duration-scale', TIER_CAPABILITIES[tier].blur ? '1' : '0.4');
}

/**
 * Blocking script body, injected in <head> before paint so the first frame is
 * already correct (no flash of a heavy tier on a low-end device).
 */
export const tierBootstrapScript = `
(function(){
  try {
    var KEY='${TIER_STORAGE_KEY}';
    var pref=null;
    try{ pref=localStorage.getItem(KEY); }catch(e){}
    var root=document.documentElement;
    if(pref==='reduced'){ root.dataset.tier='lite'; root.dataset.motion='off'; root.dataset.effects='reduced'; return; }
    root.dataset.effects='auto';
  } catch(e) {}
})();
`.trim();
