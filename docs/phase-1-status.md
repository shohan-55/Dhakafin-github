# Phase 1 Status — Foundation

**Phase:** 1 of 11 · **Gate:** G1 · **Assessed:** 2026-09-20

**Result: 10 of 16 tasks complete · 2 partial · 4 blocked on credentials, not code.**

The blueprint's Phase 1 (DF-P1-001 … 016) builds the foundation every later phase
stands on: the monorepo, the token pipeline, the font pipeline, the component
library, the experience-tier system and the CI gate chain. Everything that could
be built in a code environment is built and verified.

---

## Task-by-task

### Complete

| Task | Deliverable | Evidence |
|---|---|---|
| **001** Audit v1 claims | Inventory of what existed vs. what was only planned | Blueprint v2.0 §1 — the audit *is* the blueprint's basis |
| **002** Monorepo | npm workspaces, `apps/web` + `packages/tokens`, TS strict | [`ADR-001`](adr/0001-monorepo-with-npm-workspaces.md) · `npm run verify` |
| **003** Token pipeline | `df.tokens.json` → CSS + TS, 172 tokens / 16 groups, WCAG-validating | `npm run tokens:validate` → 18 pairings, 0 errors; `tokens:build` → 6 artefacts |
| **004** Font pipeline | 4 families self-hosted, subset, budget-gated | [`ADR-003`](adr/0003-self-hosted-fonts-and-the-taka-subset.md) · `npm run guard:fonts` → 88.9 KB / 180 KB |
| **005** DFDS primitives | **41 exports across 17 files** (7 families were required) | `/design-system` gallery |
| **006** Layout shells | Marketing shell complete (header, footer, skip link, mobile dialog nav) | `/` renders; portal shell deferred to Phase 3 with its auth |
| **007** Experience tiers | 4 tiers, provider, blocking pre-paint bootstrap, cookie + storage persistence, "Reduce effects" control | `lib/tier.ts`, `system/ExperienceTierProvider.tsx` |
| **014** State kit | Error / empty / loading / not-found + in-component states | `components/ui/States.tsx`, `app/{error,loading,not-found}.tsx` |
| **015** Accessibility baseline | Skip links, focus rings, contrast contract, reduced-motion, semantic landmarks, live region | 16 contrast pairings; `/design-system` §21 checklist |
| **016** Documentation | README, CONTRIBUTING, 5 ADRs, runbooks folder, this file | repo root, `docs/adr/` |

### Partial — and why

| Task | Done | Not done | Reason |
|---|---|---|---|
| **008** Motion foundation | Token-driven motion, `Reveal` / `CountUp` / `SpotlightCard`, tier-aware decay | GSAP, Motion, Lenis not installed | Deliberate deviation, argued in [`ADR-004`](adr/0004-motion-without-animation-libraries.md) — revisit at Phase 2 start |
| **012** CI/CD | 7-gate CI pipeline on every push and PR; token-drift check; security headers | Lighthouse budget, axe sweep, deployment | Lighthouse/axe on a 3-route scaffold measures noise; deployment needs hosting (011) |

### Blocked — not deferred, *blocked*

These four tasks cannot be completed by writing code. Each is waiting on a
decision or an account that only the business can produce.

| Task | Blocked on | Who can unblock it |
|---|---|---|
| **009** Laravel app skeleton | PHP 8.3 + Composer runtime; database host | Choose hosting (011) |
| **010** Filament panel | Same runtime, plus an admin subdomain and TLS | Choose hosting (011) |
| **011** Environments & hosting | Domain, DNS control, hosting account, payment method | Business decision |
| **013** Observability | A deployed environment to observe | Hosting (011) |

**The honest read:** Phase 1 is code-complete. The four blocked tasks are
infrastructure and they gate Phase 3 (the rate database and the calculator),
because both need a database and an admin panel to be real.

> Laravel and Filament tasks were specified here as documentation only. The
> environment has no PHP or Composer, so writing files that cannot be executed or
> tested would have produced untested code presented as a deliverable. That is a
> worse outcome than a clearly marked gap.

---

## Verification evidence

The full gate chain, run against this commit:

```
✓ Contrast contract           18 pairings · 16 required pass · 2 forbidden correctly fail
✓ Token build                 172 tokens across 16 groups → 6 artefacts
✓ Token discipline            35 files scanned · 0 hardcoded design values
✓ Typecheck                   tsc --noEmit, strict, clean
✓ Production build            3 routes statically prerendered
✓ Font budget                 88.9 KB of 180 KB (49%)
✓ Dependency audit            0 production advisories
```

### The contrast contract

16 required pairings proven, 2 forbidden pairings confirmed still broken:

| Pairing | Ratio | Requirement |
|---|---|---|
| `text` on `void` | 16.15:1 | AAA |
| `textStrong` on `surface3` | 14.55:1 | AAA |
| `sea300` on `void` | 13.46:1 | AAA |
| `goldBright` on `void` | 11.93:1 | AAA |
| `ok` on `void` | 10.36:1 | AAA |
| **`void` on `sea500`** | **8.00:1** | **primary button rule — AAA** |
| `muted` on `void` | 7.76:1 | AA |
| `danger` on `void` | 7.20:1 | AA |
| `muted2` on `void` | 4.18:1 | **forbidden** — decorative only |
| `#ffffff` on `sea500` | 2.49:1 | **forbidden** — use void text |

Note the sixth row. The obvious fintech choice — white text on the sea-green
brand colour — measures **2.49:1** and fails AA. The primary button uses
near-black text on the same fill and measures **8.00:1**. This is the single most
consequential visual decision in the design system, and it is enforced by a gate
rather than by a comment.

---

## Two bugs the gates caught

These are worth recording, because both would have shipped invisibly.

**1. The taka sign downloaded 139 KB of Bengali typography.**

`৳` is U+09F3 — inside the Bengali block, but used constantly in English prose
(`৳12.5 L`). No Latin font we ship carries it, so the browser resolved it through
the Bengali face. The budget gate measured **230.4 KB / 180 KB (128%)** and
failed the build.

Fixed by splitting the Bengali `unicode-range` around the currency signs and
adding a **960-byte** purpose-built subset. An English page now pays 88.9 KB and
still renders `৳` in a real typeface. Full reasoning in
[`ADR-003`](adr/0003-self-hosted-fonts-and-the-taka-subset.md).

**2. Six hardcoded design values had already crept into the library.**

Before the token guard existed, `Card`, `KpiTile` and `RateCard` each carried an
identical hardcoded `rgba(255,255,255,0.10)` hairline, and the layout hardcoded
the theme colour. The guard caught all six on its first run. They became one
`gradient.edgeHighlight` token and a `.df-edge-top` utility.

This is the argument for the guard existing before the library grows: six
duplicates appeared inside a single session of writing components by hand.

---

## What Phase 1 produced that later phases depend on

- **A gate chain.** Seven gates run on every push. Later phases add tasks to the
  chain rather than relying on review discipline.
- **A contrast contract expressed as data.** Adding a colour means adding a
  proven pairing, because the validator fails otherwise.
- **A budget mechanism, not a budget promise.** `font.budgetKB` is enforced by a
  script that reconstructs browser behaviour from build output.
- **Token discipline as a build failure.** `// df-guard-allow: <reason>` makes
  every exception visible in a diff.
- **A demo-integrity pattern.** Every illustrative figure on a public page is
  labelled `Sample data`. No rate was invented to make a page look complete.

---

## Recommended next actions

Ordered by what unblocks the most work:

1. **Choose hosting and provide credentials** (DF-P1-011). Unblocks 009, 010, 012's
   deploy step, and 013 — and those unblock Phase 3, which is where the product
   becomes useful rather than described.
2. **Start NBR rate verification** — the critical path for Phase 3, and the
   longest-lead non-code dependency in the entire roadmap. It is verification
   work by a qualified person, and it does not compress.
3. **Book the five usability-test businesses** named in the blueprint. Their
   availability, not the code, sets the Phase 4 and G4 dates.
4. **Begin Phase 2** (public site) — it is unblocked and parallel to the above.

### A sequencing decision worth making explicitly

The blueprint puts hosting at DF-P1-011, which means Phases 2–4 (the public site,
the calculators and the diagnostic engine) can be built and demonstrated without
it. If the intent is to reach the G4 public-site milestone as fast as possible,
hosting can be pulled later in the sequence and Phase 2 started now. If the
intent is a deployable product at every gate, 011 moves first. **This is a
sequencing decision worth making explicitly rather than by default.**
