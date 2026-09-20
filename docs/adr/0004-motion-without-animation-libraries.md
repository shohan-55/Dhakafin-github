# ADR-004: Motion foundation without GSAP, Motion or Lenis

- **Status:** Accepted
- **Date:** 2026-09-20
- **Phase:** 1 (DF-P1-008)
- **Deciders:** DhakaFin engineering
- **Supersedes:** — (deviates from DF-P1-008 as written)

## Context

DF-P1-008 specifies a Phase 1 motion foundation of **GSAP + Motion (Framer) +
Lenis**, a shared motion-token set, and a `MotionProvider` that disables
everything under reduced-motion.

At the point that task came up, the application consisted of three statically
prerendered routes. The measured state:

- Font payload: 88.9 KB of a 180 KB budget.
- JS shipped: the Next.js runtime plus a small tier provider and toast system.
- GSAP + Motion + Lenis together add well over 100 KB minified before a single
  animation is written, and Lenis takes over the scroll loop — which interacts
  with `prefers-reduced-motion`, browser scroll anchoring and mobile scroll
  physics in ways that need to be tested on real devices, not in a sandbox.

## Decision

Build the motion foundation on **the platform**: CSS transitions and keyframes
driven by the existing duration/easing tokens, an `IntersectionObserver`-based
`<Reveal>`, and a `requestAnimationFrame`-based `<CountUp>` and `<SpotlightCard>`.

Three animation libraries are **not** installed. They will be evaluated when a
task actually needs them.

## Consequences

**Positive**

- Motion is expressed in the token file, so `[data-tier]` and
  `prefers-reduced-motion` collapse every animation by changing one
  `duration-scale` number. There is no second animation system to keep in sync.
- No scroll hijacking. Lenis's smooth scroll is the single most reliable way to
  make a financial product feel untrustworthy and to break accessibility on
  Android — and Bengali users are overwhelmingly on Android.
- `<CountUp>` uses real text nodes, so the number is present and readable to
  screen readers and to search engines at every frame.
- Deferred weight: adding 100+ KB of animation libraries to a three-route
  scaffold would spend the entire performance budget before Phase 2 has a hero
  to animate.

**Negative**

- **This is a real deviation from the blueprint and it has a cost.** Complex
  sequenced work — the Phase 2 financial universe, scroll-pinned storytelling —
  is genuinely easier in GSAP's timeline model than in CSS keyframes plus a
  scroll listener. Rewriting the primitives later is real work, not a
  configuration change.
- Stagger orchestration currently relies on indexed `transition-delay` values
  rather than a timeline. Past roughly a dozen elements this becomes hard to
  reason about.
- No Lenis means premium easing on long scroll is not yet solved, and the
  blueprint lists it as part of the intended feel.

**Neutral**

- `<Reveal>`, `<CountUp>` and `<SpotlightCard>` are the only three motion
  primitives in Phase 1. They are small enough to reimplement on top of a library
  if one is adopted, rather than a framework to be migrated away from.

## Alternatives considered

- **Install all three now, per the blueprint.** Rejected: it spends four-fifths
  of the performance budget on a scaffold with nothing to animate, and adopting
  Lenis means owning scroll physics on low-end Android before there is a test
  device plan.
- **GSAP only.** The most likely future outcome if Phase 2's hero is built as
  specified — GSAP's timeline model is the right tool for sequenced scroll work.
  Deferred, not rejected.
- **CSS-only with no observer primitives.** Rejected: `<Reveal>` needs to know
  when an element enters the viewport, and doing that without an observer means a
  scroll listener on every page.

## Review trigger

Revisit at the **start of Phase 2**, before the flagship industry pages are
built, and specifically if the hero is implemented as WebGL. The decision then is
not "is GSAP good" but "does the Phase 2 hero need a timeline model", and it
should be made with that hero's storyboard in hand rather than in advance.
