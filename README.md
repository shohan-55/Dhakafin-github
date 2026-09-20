# DhakaFin

Financial intelligence, accounting, tax, VAT and compliance for Bangladeshi businesses.

This repository is the product. The plan that drives it is
[`docs/blueprint/DhakaFin_100_Percent_Master_Roadmap_Blueprint.md`](docs/blueprint/DhakaFin_100_Percent_Master_Roadmap_Blueprint.md) —
281 tasks across 11 phases (0–10) with a gate at the end of each. Work is done
phase by phase; nothing ships that fails its gate.

**Current phase: 1 — Foundation.** See [`docs/phase-1-status.md`](docs/phase-1-status.md)
for the honest state of every DF-P1 task, including the five that are blocked on
credentials rather than code.

---

## Quick start

```bash
git clone <repo> && cd Dhakafin-github
npm install
npm run dev          # → http://localhost:3000
```

No `.env.local` is required. The marketing site builds and runs with an empty
environment on purpose — a public site must not fail because a database is
asleep. Copy `.env.example` → `.env.local` when you need the backend.

```bash
npm run verify       # the full gate chain — run this before every push
```

---

## The gate chain

`npm run verify` runs seven gates in order. Each one exists because a specific
class of mistake reached production somewhere, once.

| # | Gate | Command | Catches |
|---|---|---|---|
| 1 | Contrast contract | `tokens:validate` | A palette change that breaks a WCAG pairing — or quietly *fixes* a forbidden one |
| 2 | Token build | `tokens:build` | Generated CSS/TS drifting from `df.tokens.json` (CI also fails on uncommitted drift) |
| 3 | Token discipline | `guard:tokens` | A component hardcoding `#14b8a6` or `rgba(…)` instead of using a token |
| 4 | Types | `typecheck` | `tsc --noEmit`, strict |
| 5 | Build | `build` | The production build, including static prerendering |
| 6 | Font budget | `guard:fonts` | A page downloading more font bytes than `font.budgetKB` |
| 7 | Audit | `audit` | Advisories in production dependencies |

Everything runs in CI on every push and pull request
([`.github/workflows/ci.yml`](.github/workflows/ci.yml)).

---

## Repository layout

```
apps/
  web/                     Next.js 16 app (App Router, React 19, Tailwind v4)
    app/
      fonts/               Self-hosted woff2 — see its README before touching
      globals.css          Tailwind v4 import order + the few app-level utilities
      layout.tsx           Font pipeline, metadata, tier bootstrap
      (marketing)/         Public site: layout shell + home + /design-system
    components/
      system/              Runtime layer: tier provider, motion primitives, toasts
      ui/                  The DFDS component library (19 exports)
      layouts/             Logo, SiteHeader, SiteFooter
    lib/                   cn · format · tier · contrast

packages/
  tokens/                  SOURCE OF TRUTH for every visual constant
    df.tokens.json         Edit this, never the output
    token.schema.json      Editor schema + documentation
    build.mjs              → dist/ (zero-dependency generator)
    validate.mjs           WCAG maths and the contrast contract
    dist/                  Generated. Committed so the app builds without the pipeline.

scripts/                   CI gates (token discipline, font budget)
docs/
  blueprint/               The 281-task roadmap, appendices, gate sign-offs
  adr/                     Architecture decisions, with the reasoning and the cost
  phase-1-status.md        Where Phase 1 actually stands
```

---

## The design system (DFDS)

Every colour, size, duration and easing curve in the product is a token in
[`packages/tokens/df.tokens.json`](packages/tokens/df.tokens.json). Components
consume tokens; `guard:tokens` fails the build if one doesn't.

**Browse it live at `/design-system`** (noindex — it is an internal reference,
not a page for visitors). It renders every token, every component state, the
computed contrast table and the accessibility checklist.

### How a token reaches a component

```
df.tokens.json
   │  build.mjs  (validated by validate.mjs on every run)
   ▼
dist/tokens.css     @theme inline → Tailwind utilities resolve to --df-* vars
   │                so theme and tier switches work at runtime, not build time
   ▼
globals.css         imported after Tailwind, before app utilities
   ▼
className="text-sea-400 bg-surface1 duration-200"
```

Because Tailwind's `@theme` is `inline`, `text-sea-400` compiles to
`color: var(--df-color-sea-400)` rather than a baked-in hex. That single
decision is what makes the light theme and the four experience tiers work by
swapping a `data-` attribute instead of shipping a second stylesheet.

### The contrast contract

`validate.mjs` proves 16 required pairings on every build and confirms that 2
forbidden pairings still fail. It is not decoration: `text-muted2` on the base
surface is *deliberately* too low-contrast for body text, and the contract keeps
it that way so nobody "fixes" it later.

The notable rule: **primary buttons use sea-500 background with void text.**
White on sea-500 measures 2.49:1 and fails AA — which is exactly the shortcut a
generic fintech template takes. Void text on the same fill measures 8.00:1.

### Experience tiers

Four tiers (`lite` · `balanced` · `high` · `ultra`) degrade motion, blur, WebGL
and pinned scroll **without changing the layout**. A blocking inline script sets
`data-tier` before first paint, reading the visitor's "Reduce effects" choice
from storage, plus `prefers-reduced-motion`, `saveData`, core count and WebGL
support. Reducing effects never removes information — it removes cost.

---

## Conventions

- **Never hardcode a design value.** Use the token. If you genuinely must, write
  `// df-guard-allow: <reason>` on the line — it will show up in review, which is
  the point.
- **Never hardcode regulatory data.** Tax, VAT and TDS figures come from the
  database, imported from a reviewed source with a named verifier. The blueprint
  and the code both treat a hardcoded rate as a defect, not a shortcut.
- **Illustrative figures are labelled.** Any sample number on a public page
  carries a visible `Sample data` badge. Demo integrity is a product requirement.
- **Server by default.** `'use client'` is opt-in and should be as deep in the
  tree as possible.
- **Accessibility is a gate, not a review comment.** Keyboard, semantics,
  contrast and reduced-motion are verified mechanically.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for branch, commit and review
conventions, and [`docs/adr/`](docs/adr/) for why the stack is what it is.

---

## Status and honesty

Phase 1 is complete except for work that cannot be done in a code environment:

| Blocked | Why | Unblocks when |
|---|---|---|
| Laravel + Filament (DF-P1-009/010) | needs PHP 8.3 + Composer | a host with PHP is chosen |
| Hosting, DNS, SSL (DF-P1-011) | needs accounts and credentials | credentials exist |
| Deploy pipeline (DF-P1-012) | needs a deploy target | hosting exists |
| Observability (DF-P1-013) | nothing to observe yet | hosting exists |

These are **not** deferred for convenience. They are blocked on decisions and
accounts that no amount of code can substitute for, and
[`docs/phase-1-status.md`](docs/phase-1-status.md) says so plainly.
