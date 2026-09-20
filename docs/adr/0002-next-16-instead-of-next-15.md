# ADR-002: Next.js 16 instead of the blueprint's Next.js 15

- **Status:** Accepted
- **Date:** 2026-09-20
- **Phase:** 1 (DF-P1-002)
- **Deciders:** DhakaFin engineering
- **Supersedes:** the stack table in blueprint §4.2

## Context

The blueprint specifies Next.js 15. Following it precisely produced a build with
**three production dependency advisories**:

- `next@15.5.4` was flagged deprecated with CVE-2025-66478.
- Moving to the 15.x backport line (`15.5.25`) resolved that, but Next 15 bundles
  `postcss <= 8.5.22` and `sharp`, both with open advisories that no `npm audit
  fix` on the 15.x line can clear.

The measurable facts were: 15.x → 3 advisories, unfixable within the major.
16.3.5 → 0 advisories.

## Decision

Ship **Next.js 16.3.5** with React 19.1.0 and Tailwind v4.1.13, and amend the
blueprint's stack table. `next.config.ts` sets `reactStrictMode`,
`poweredByHeader: false`, and explicit security headers (`nosniff`,
`SAMEORIGIN`, referrer policy, permissions policy, HSTS).

## Consequences

**Positive**

- Zero known production dependency advisories. For a product holding client
  financial data, a knowingly unpatched transitive dependency is not a
  trade-off that can be argued into existence.
- Turbopack is the default builder — the production build of three routes
  completes in under a second of compile time, which keeps the CI gate chain
  fast enough that nobody is tempted to skip it.
- `allowedDevOrigins` is set for the sandbox preview hosts, so the documented
  preview workflow works without disabling a security check.

**Negative**

- **The blueprint and the code now disagree**, and a reader who trusts the
  blueprint will be wrong. Mitigated by this ADR and by amending §4.2 directly —
  both, because a reader may consult either.
- Next 16 is newer, so it has a shorter track record and a smaller corpus of
  answered questions. Every deviation from Next 15 documentation costs debugging
  time that the ADR cannot repay.
- Some Next 15-era libraries and examples will not apply. This is a tax paid
  steadily over Phase 2–4, not once.

**Neutral**

- App Router, Server Components, `next/font` and route groups are unchanged
  between the versions, so the blueprint's architecture survives intact.

## Alternatives considered

- **`next@15.5.25`** (the maintained backport). Closest to the blueprint and
  resolves the CVE. Rejected because the postcss and sharp advisories cannot be
  cleared within the major — the product would ship with known advisories purely
  to match a document.
- **`npm audit` with overrides** to force newer postcss/sharp into Next 15.
  Rejected: overriding a framework's bundled dependencies is precisely the kind
  of cleverness that produces an unexplainable production bug in six months.
- **Pin to `next@15.5.4` and accept the CVE.** Rejected without discussion.

## Review trigger

Revisit when Next 16.4/17 lands and the upgrade path from 16.3.5 is clear, or if
a Phase 2–4 dependency is found to be genuinely incompatible with Next 16.
