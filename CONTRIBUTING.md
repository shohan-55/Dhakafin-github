# Contributing to DhakaFin

The blueprint is the source of truth for *what* to build. This file covers *how*.

## Before you push

```bash
npm run verify
```

Seven gates. All of them must pass. CI runs the same chain, so a local pass means
a green build — there should be no such thing as "works locally, fails in CI".

## Branches

`main` is deployable at all times. Work happens on short-lived branches:

```
feat/rate-database-import
fix/tds-slab-boundary
docs/adr-005-search-architecture
chore/bump-next
```

One branch, one concern. A branch that needs "and" in its description is two
branches.

## Commits

Conventional Commits, because the changelog is generated and because a commit
message is the only documentation that reliably survives.

```
<type>(<scope>): <subject>

<body — why, not what. The diff already says what.>
```

Types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`
Scopes: `web` `tokens` `ui` `admin` `api` `rates` `calc` `a11y` `ci` `docs`

```
feat(ui): add DeadlineItem with escalating urgency

Urgency escalates at >14 / 8–14 / 1–7 / <0 days. Colour is always paired with
an icon and a text label so the state survives greyscale, colour-blindness and
a screen reader. Required by the accessibility baseline (DF-P1-015).
```

## The rules that are not negotiable

These come from the product brief and are enforced where possible:

1. **No hardcoded design values.** Tokens only. `guard:tokens` fails the build.
   Genuine exceptions take an inline `// df-guard-allow: <reason>`.
2. **No hardcoded regulatory data.** Ever. Rates live in the database, imported
   from a reviewed source with a named verifier and a citation. A rate literal in
   a component is a defect that ships incorrect tax advice to someone's business.
3. **No generic fintech/SaaS/accounting-template layouts.** No predictable card
   grids, overused gradients, neon, or template-looking surfaces. Every major
   visual element must connect to a real product capability.
4. **Animation must earn its place** on the ladder: clarity → storytelling →
   usability → premium perception. Motion that only decorates is removed.
5. **Performance precedes effects.** Budgets are measured, not asserted. If an
   effect breaks the budget, the effect goes.
6. **Accessibility is a gate.** WCAG 2.2 AA: keyboard, semantics, contrast,
   screen readers, reduced motion. Colour never carries meaning alone.
7. **Sample data is labelled.** Any illustrative figure on a public page shows a
   visible `Sample data` badge. Never invent a plausible-looking rate.
8. **Filament owns the content.** If a marketer would need a developer to change
   a word on a page, the model is wrong.

## Reviews

A reviewer checks, in this order:

1. Does it do what the task said — and does the task still serve the blueprint?
2. Does it hold the eight rules above?
3. Is the accessibility story complete: keyboard, focus, screen reader, contrast?
4. What happens on a slow connection, a small screen, and with reduced motion?
5. Is the failure path defined — empty, loading, error, permission denied?

## Adding a design token

1. Add it to `packages/tokens/df.tokens.json` with a `role` and, where misuse is
   plausible, a `usageRule`.
2. If it is a text/background pairing, add a `contrastContract.required` entry.
   Component changes must not be the first place a contrast problem is noticed.
3. `npm run tokens:validate && npm run tokens:build` and **commit the `dist/`
   output** — CI fails on drift.
4. Use it in a component that a designer or reviewer can see at
   `/design-system`.

## Changing a font

Read [`apps/web/app/fonts/README.md`](apps/web/app/fonts/README.md) first, then
run the budget gate. One `preload: true` on the Bengali subset adds 139 KB to
every English page load, and nothing visibly breaks.
