# ADR-001: Monorepo with npm workspaces

- **Status:** Accepted
- **Date:** 2026-09-20
- **Phase:** 1 (DF-P1-002)
- **Deciders:** DhakaFin engineering
- **Supersedes:** —

## Context

DhakaFin ships a public marketing site, a customer portal, an internal admin
panel and a Laravel API. They share a design language, a formatting layer and —
critically — a definition of what a "verified rate" is.

The blueprint assumed pnpm + Turborepo. Neither is available in the current build
environment, and adding a package manager that is not present on the deployment
host is a dependency to carry forever.

The real requirement is not a specific tool. It is: **a token change must
propagate to every surface in one commit, and it must be impossible for the web
app and the admin panel to disagree about what sea-500 is.**

## Decision

A single repository using **npm workspaces** (`apps/*`, `packages/*`), with the
design system's source of truth in `packages/tokens`.

The Next.js app consumes tokens through the workspace dependency
`@dhakafin/tokens`, and generated output is committed to `packages/tokens/dist/`
so the app can build without running the token pipeline first.

## Consequences

**Positive**

- One commit changes a token and the surfaces that use it. Cross-repo version
  skew — the most common way a design system rots — is structurally impossible.
- npm ships with Node. No new package manager in CI, Docker or on a host, and no
  lockfile format that a new contributor has to install a tool to read.
- Committed `dist/` means a fresh clone can `npm run build` with no codegen step.
  CI separately fails if `dist/` has drifted from `df.tokens.json`, so the
  convenience cannot rot into a lie.

**Negative**

- npm workspaces are slower and less space-efficient than pnpm's content-addressed
  store. On a repo this size the difference is seconds, and it is measured by CI
  time, not by feel.
- No Turborepo means no remote caching and no automatic task graph. `npm run
  verify` is an explicit chain instead. If build times become a bottleneck, this
  is the decision to revisit.
- Committed generated files appear in diffs. Mitigated by `.gitattributes`, a
  `.editorconfig` rule marking `dist/` as generated, and a CI drift check.

**Neutral**

- Laravel lives in a sibling directory inside the same repository rather than a
  separate one. PHP and Node toolchains do not need to share a build, only a
  commit.

## Alternatives considered

- **pnpm + Turborepo** (blueprint's assumption). Better caching and stricter
  dependency isolation. Lost on the toolchain constraint: requiring an
  unavailable package manager to work on the repo is a real cost paid on day one
  by every contributor, against a benefit that only materialises at a scale this
  project has not reached.
- **Polyrepo.** Cleanest CI isolation. Rejected outright: it makes "the design
  system drifted between the site and the admin panel" a routine failure mode,
  and that is the failure this project can least afford.
- **Single Next.js app with no packages.** Simplest. Rejected because the token
  pipeline must be independently validatable in CI, and because Phase 3 adds a
  Laravel service that also needs the rate definitions.

## Review trigger

Revisit if `npm run verify` exceeds 10 minutes, or if the Laravel app needs to
consume the token/rate definitions as a versioned package rather than from the
filesystem.
