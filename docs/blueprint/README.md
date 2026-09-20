# DhakaFin Blueprint Folder

This folder holds the planning and build-governance documents for **DhakaFin.com**. Nothing in `apps/` or `packages/` should contradict what is written here — if it does, one of them is a bug.

| File | What it is | How to use it |
|---|---|---|
| **`DhakaFin_100_Percent_Master_Roadmap_Blueprint.md`** | The complete master blueprint: strategy, information architecture, design language, tech stack, feature specifications (F1–F14), Filament admin spec, growth engine, the 11-phase roadmap with 281 numbered tasks and 11 gates, quality/launch/operations runbooks, risk register, and 13 appendices including the 100% Completeness Matrix. | This is the **single source of truth**. Work through §8 phase by phase. Every branch, commit and PR should reference a task ID (`DF-P<phase>-<number>`). |
| `Appendix_B_Design_Tokens.json` | The design token file that feeds CSS variables, the Tailwind theme and typed TS constants. | Copy into `packages/tokens/df.tokens.json` when scaffolding Phase 1, then run the token build. Never hardcode a hex, size or duration in a component. |
| `Appendix_C_Rates_Seed_Template.csv` | The import template for regulatory rate records (TDS/VDS/VAT/income tax/corporate tax/AIT). | Use it to seed the database in Phase 3. **Every row must be verified against an official NBR source** before `status` moves to `verified`. The placeholders are deliberate — do not guess a statutory figure. |
| `DhakaFin - Complete Master Product, SaaS & Technology Roadmap (Official Blueprint) (1).pdf` | The original v1 blueprint (8 pages) kept for history. | Read for context only. Where it conflicts with the v2.0 markdown, the markdown wins (see §0.5 of the blueprint for the reconciliation table). |

## Getting started (the short version)

1. Read **§0** (how to use this document, the definition of done) and **§1** (strategy).
2. Run the **Phase 0 checklist** in §0.4 — accounts, decisions, legal, sources. Do not skip; it prevents rework later.
3. Scaffold with **Phase 1** tasks: tokens → components → CI/CD → environments.
4. Build the public surface in **Phases 2–4**, then the SaaS in **Phases 5–7**.
5. Never start a phase before its gate is signed off. Record gate sign-offs in `gate-signoffs.md`.

## Non-negotiables (the four rules that protect this product)

1. **No hardcoded regulatory data.** Rates, slabs, thresholds and deadlines live in the database with a source, an effective date and a named verifier. The frontend fetches them. This is CI-enforced.
2. **Every number shows its provenance.** Rate + effective date + SRO/source + last-verified date. On a financial platform, an unsourced number is a liability.
3. **No screen ships until it passes the 12-Question Review** (§10.2) — hierarchy, interaction purpose, accessibility, performance, premium feel, and whether it feels uniquely DhakaFin.
4. **The design tokens and motion language are the brand.** No one-off colours, no bespoke animations without an ADR.

## Governance

- Scope changes are recorded as dated entries in the blueprint's **revision log (§11)** — never silently edited.
- Task IDs are permanent. Dropped work is marked `CANCELLED` with a reason, never renumbered.
- Gate sign-offs, retros and estimate-accuracy notes go in `gate-signoffs.md` (create it at Gate G0).

> **Make Better Financial Decisions.**
> *Numbers tell you what happened. Intelligence tells you what to do next.*
