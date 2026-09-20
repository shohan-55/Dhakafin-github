# DhakaFin.com — 100% Master Roadmap Blueprint
### The complete, executable build plan for a next-generation Financial Intelligence, Accounting & Compliance SaaS ecosystem

| Field | Value |
|---|---|
| **Document** | `DhakaFin_100_Percent_Master_Roadmap_Blueprint.md` |
| **Version** | v2.0 (supersedes the v1 8-page PDF "Complete Master Product, SaaS & Technology Roadmap") |
| **Status** | 🔒 **APPROVED BASELINE** — build against this, do not improvise scope |
| **Owner** | Founder / Product Lead — DhakaFin.com |
| **Created** | 2026-09-20 |
| **Target market** | Bangladesh (SME, Trading, Manufacturing, E-commerce, Startup, Corporate, Professional Services) |
| **Primary language** | English content + Bangla (`bn-BD`) localization, `৳` BDT-first |
| **Primary domains** | `dhakafin.com` (marketing + public tools + rate hub), `app.dhakafin.com` (SaaS portal), `admin.dhakafin.com` (Filament back office), `api.dhakafin.com` (API) |
| **Companion artifacts** | `docs/blueprint/Appendix_B_Design_Tokens.json` (build-ready token file) · `docs/blueprint/Appendix_C_Rates_Seed_Template.csv` (rate import template) · `docs/blueprint/README.md` (folder guide) — Appendix A (database DDL) is inline in this document |
| **Gate log (create at G0)** | `docs/blueprint/gate-signoffs.md` — one dated entry per gate with evidence links |
| **Related existing file** | `DhakaFin - Complete Master Product, SaaS & Technology Roadmap (Official Blueprint) (1).pdf` (v1 — reconciled in §0.5) |

---

## ⚡ TL;DR — what this document is

This is **not a mood board**. It is a build order.

It contains, in one place: the product strategy, the locked design language, the full architecture, the database, the API, every feature specified screen-by-screen with acceptance criteria, the Filament admin spec, the SEO/growth engine, **11 build phases with 281 numbered tasks and 11 gates**, QA/launch runbooks, risks, budget, and the **100% Completeness Matrix** that maps every single requirement from the original concept prompt to a phase + task ID — so nothing gets silently dropped.

**How you use it:** open §8 (Roadmap), find your current phase, open that phase's task table, take tasks top-to-bottom, ship, tick the Gate criteria, move to next phase. Use §3–§7 as the reference library while you build.

**🇧🇩 Banglish quick note:** ei file ta tomar "single source of truth". Kono feature niye confusion hole — ei file e dekho. Jeta ekhane nai, seta scope na. Jeta ekhane ache, seta korte hobe (task ID soho). Phase gate pass na korle next phase e jabe na.

---

# 0. HOW TO USE THIS BLUEPRINT

## 0.1 Purpose & scope

**In scope:** everything required to design, build, launch and operate DhakaFin.com end-to-end — public marketing site, public financial tools & regulatory rate hub, multi-tenant SaaS portal, compliance intelligence, AI assistant, and the Filament back office + CRM that runs the business.

**Out of scope (v1, deliberately deferred to Phase 9+):** native iOS/Android apps (PWA first), direct bank API feeds, full double-entry general-ledger engine (v1 does *reporting-grade* bookkeeping, not a replacement for Tally/QuickBooks), real-time NBR API integration (NBR has no public write API — we use monitored scraping + human verification), and crypto/digital-asset features.

**Guiding constraint:** every visual "wow" must map to a real product capability (§25 of the concept). No decorative-only features.

## 0.2 The 100% Definition (Definition of Done — applies to EVERY task)

A task is **not done** until all eleven boxes are ticked:

1. **Built** — feature works on real data, not hardcoded mock values.
2. **Designed** — matches the DhakaFin design tokens; reviewed against §3; no default/Tailwind-out-of-the-box look.
3. **Responsive** — verified at 360, 390, 768, 1024, 1280, 1440, 1920 px.
4. **Accessible** — keyboard operable, focus visible, contrast ≥ WCAG 2.2 AA, screen-reader labels, honours `prefers-reduced-motion`.
5. **Fast** — meets the page's performance budget (§9.2); Lighthouse ≥ 95 desktop / ≥ 90 mobile on public pages.
6. **Tested** — unit + at least one E2E path; no console errors; no unstyled flash.
7. **Content-complete** — final English copy + Bangla translation present; no lorem ipsum; no "TODO" text.
8. **Admin-manageable** — if it is content or a rate, an admin can edit it without a developer (§23 of the concept: **no hardcoded regulatory data, ever**).
9. **Instrumented** — analytics events fire per Appendix G; errors reported to Sentry.
10. **Documented** — README/API doc/ADR updated if behaviour or contract changed.
11. **Reviewed** — self-review + one peer/mentor review pass, linked in the PR.

> **The 100% Rule:** a phase is 100% only when *all* its tasks are DoD-complete **and** its Gate (§8) is signed off. Partial = not shipped. Ship smaller, ship complete.

## 0.3 Reading paths (don't read this linearly — pick your lane)

| You are… | Read in this order |
|---|---|
| **Founder / product owner** | §0 → §1 → §8 → §10 → §9.9, then skim everything else |
| **Creative director / designer** | §3 → §5 (all wireframes) → §2 → Appendix B |
| **Frontend engineer** | §3.11 → §4.1–4.3 → §5 (interaction + motion specs) → §2.3 (route table) |
| **Backend engineer** | §4.4 → Appendix A → §4.5–4.6 → §6 (Filament spec) |
| **Content / SEO specialist** | §7 → §2.4 → Appendix J (copy deck) → §6.2 (publishing workflow) |
| **QA / tester** | §0.2 → §5 acceptance criteria → §9.1 → Appendix H |
| **New team member (day 1)** | §1 (vision) → §2.1 (sitemap) → §3 (design language) → §4.2 (repo tree) |

## 0.4 Before you write code — accounts, tools & decisions to secure (Phase 0 checklist)

| # | Item | Why it matters | Cost signal |
|---|---|---|---|
| 1 | Domain `dhakafin.com` + `app.` / `admin.` / `api.` subdomains + SSL | Multi-surface architecture needs DNS from day 1 | Domain fee |
| 2 | **NBR source-of-truth list** (see Appendix K) — saved, monitored, bookmarked | Rates hub accuracy = brand trust | Free |
| 3 | GitHub org + private repos + branch protection | CI/CD, review discipline | Free |
| 4 | Hosting: VPS (8–16 GB RAM) **or** managed Laravel host (Ploi/Forge/Cloudways) + managed MySQL/Postgres | BD traffic + BDIX latency consideration | ~$20–80/mo |
| 5 | Redis (self-hosted on VPS or managed) | Cache, queues, sessions, Horizon | Included or ~$10–15/mo |
| 6 | Object storage: AWS S3 / DigitalOcean Spaces / Wasabi (BDIX-friendly option: local SSD volume at start) | Encrypted document vault | ~$5–15/mo |
| 7 | Email: transactional provider (Postmark/Resend/SES) + SPF, DKIM, DMARC on `dhakafin.com` | Deliverability of deadline alerts = product value | ~$10–20/mo |
| 8 | SMS gateway (Bangladesh: SSL Wireless / Bulk SMS BD / Robi/Airtel aggregator) + WhatsApp Cloud API | Compliance alerts by SMS/WhatsApp | Pay-per-SMS |
| 9 | Payments: SSLCommerz + bKash/Nagad (Merchant) + Stripe/Paddle for international | Subscriptions + invoices | MDR % |
| 10 | AI provider keys (OpenAI / Anthropic / Gemini) + budget cap + local fallback | "Ask DhakaFin" copilot | Usage-based |
| 11 | Analytics (GA4 + PostHog free tier) + Sentry + UptimeRobot/Better Stack | Growth + reliability | Free tier OK |
| 12 | Fonts licensing / self-hosting decision (see §3.4) | Premium typography is non-negotiable | Free (open-source set) |
| 13 | Legal: Terms, Privacy, Refund, Service disclaimer, NBR-sourced-data disclaimer, NDA template | Trust + dispute protection | One-time legal review |
| 14 | Business registration docs, TIN/BIN, RJSC, trade licence, VAT certificate of your own firm | Needed on Trust page + invoicing + credibility | Admin cost |
| 15 | **Professional identity decision:** named CA/ACCA on panel, or "team of certified accountants" wording | Legal + trust; do not fake credentials | — |

## 0.5 Status reconciliation with v1 PDF blueprint

The v1 PDF declared an 8-step plan with Steps 1–2 marked **Completed**. This document keeps that history and maps it forward — verify before assuming:

| v1 Step | v1 Name | v1 Status | This blueprint maps it to | Verification action |
|---|---|---|---|---|
| 1 | Core Foundation & Master Design System | ✅ Completed (claimed) | §3 + Phase 1 | **Audit:** confirm tokens exist in code; if only in Figma, treat as 30% done (task DF-P1-001) |
| 2 | Ultra-Premium Homepage & Interactive Components | ✅ Completed (claimed) | §5 F1, F2 + Phase 2 | **Audit:** is hero + money-flow live on real data? If static/hardcoded, re-open tasks DF-P2-010…040 |
| 3 | Dynamic Regulatory Hub & Rate Directory (`/rates`) | ⏭️ **Next** | §5 F4 + **Phase 3** | This blueprint's Phase 3 is the authoritative spec — it is broader than v1 (adds sections, slabs, SROs, circulars, comparison view, versioning, change-alerts) |
| 4 | Public Financial Calculators Suite (`/tools`) | Pending | §5 F5 + **Phase 4** | Expanded from 7 to **13 tools**, plus the Diagnostic Engine and leakage estimator |
| 5 | Compliance Calendar & Automated Alerts | Pending | §5 F10 + **Phases 3** (public) **& 6** (personalised) | — |
| 6 | Multi-Tenant SaaS Onboarding & Subscription | Pending | §5 F11 + Phase 5 | — |
| 7 | Client Portal & Encrypted Document Vault | Pending | §5 F11 + Phase 6 | — |
| 8 | Backoffice CRM, Quotation Engine, Security Hardening & Deployment | Pending | §6 + Phase 7/8 | — |

**New in v2.0** (from the new concept prompt): the 3D→10D experience model (concrete, budgeted — §3.9), "Where Is Your Money Going?" signature flow, Cost Efficiency / leakage estimator, Business Diagnostic Engine, 11 Industry experiences, AI Financial Assistant, Mobile-first dedicated experience, Motion language, Filament content-model expansion, and a formal 100% Completeness Matrix (Appendix M).

## 0.6 Assumption & Decision Log (ADR-lite)

| ID | Decision | Rationale | Revisit when |
|---|---|---|---|
| **AD-001** | Backend = **Laravel 12 + Filament v4** | Concept §23 explicitly requires Filament admin; Laravel gives queues/Horizon/policies/tenancy out of the box | — |
| **AD-002** | Frontend = **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4** | Needed for SSG/ISR SEO on rate pages + React 3D/animation ecosystem (R3F, GSAP) | If team is Laravel-only → switch to Inertia+Vue (cost: lose best-in-class 3D libraries) |
| **AD-003** | Split domains: marketing `dhakafin.com`, SaaS `app.` | Different caching/security postures; SaaS behind auth | — |
| **AD-004** | **Dark-first** design; light mode is a secondary, fully-specified theme | Brand is "Ocean Void" cinematic; light mode added for accessibility/document printing | Phase 6 |
| **AD-005** | 3D/WebGL is **progressive enhancement** — zero critical content depends on WebGL | Performance + a11y + elderly/low-end device users | — |
| **AD-006** | Regulatory data is **database-driven + human-verified**, never hardcoded | Legal risk + trust; NBR changes mid-year via SRO | Quarterly |
| **AD-007** | Payments: local gateways first (SSLCommerz/bKash/Nagad), international later | Target market is BD businesses paying in BDT | Phase 8 |
| **AD-008** | AI assistant uses **RAG over our own curated corpus**, never free-form answers about law | Hallucinated tax advice = legal + reputational catastrophe | — |
| **AD-009** | v1 SaaS = *insight & compliance layer*, not a full GL ledger | Faster to value; avoids competing with Tally/QuickBooks on day 1 | Phase 9 |
| **AD-010** | Design tokens live in **one JSON source** → CSS vars + Tailwind | Single source of truth; Figma parity | — |

## 0.7 Naming, numbering & ID conventions

| Thing | Convention | Example |
|---|---|---|
| Task ID | `DF-P<phase>-<3 digits>` | `DF-P3-014` |
| Gate ID | `G<phase>` | `G3` |
| Feature ID (spec) | `F1…F14` | `F2` = Money-Flow section |
| API endpoint | `/api/v1/<resource>` (kebab, plural) | `/api/v1/vat-rates` |
| DB table | `snake_case`, plural | `vat_rates`, `business_users` |
| Component | `PascalCase.tsx` in `components/<domain>/` | `MoneyFlowCanvas.tsx` |
| Analytics event | `snake_case`, `<object>_<action>` | `money_flow_node_opened` |
| Branch | `feat/DF-P3-014-rates-comparison` | — |
| Commit | Conventional Commits | `feat(rates): add effective-date comparison view` |
| ADR | `ADR-0NN` | `ADR-011` |
| Copy string key | `namespace.component.key` | `hero.cta.book_consultation` |

## 0.8 Bangla quick-note legend

Throughout this blueprint, **🇧🇩 notes** are short Banglish clarifications for the founder/team — they restate the important decision in plain language. They are not extra requirements.

---

# 1. PRODUCT STRATEGY & POSITIONING

## 1.1 Vision, mission, and message architecture

| Element | Statement |
|---|---|
| **One-line vision** | DhakaFin is the financial intelligence layer for Bangladeshi businesses — accounting, compliance and advisory fused into one intelligent platform. |
| **Mission** | Help every business in Bangladesh understand their numbers, control their costs, and stay permanently compliant. |
| **Primary tagline (locked)** | **Make Better Financial Decisions.** |
| **Philosophy line (locked)** | *Numbers tell you what happened. Intelligence tells you what to do next.* |
| **Positioning statement** | For Bangladeshi SMEs and corporates who are tired of accounting that reports the past, DhakaFin is a financial intelligence platform that turns books, tax and VAT data into decisions — combining certified professional services with a SaaS command centre, unlike traditional firms that only file returns, and unlike global SaaS that ignores NBR. |
| **Category we are creating** | "Financial Intelligence & Compliance OS" (not "accounting firm website", not "bookkeeping software") |
| **Brand personality** | Authoritative · Precise · Calm · Futuristic · Plain-spoken · Never flashy-for-its-own-sake |
| **Brand promise (proof-backed)** | You will always know: where your money went, what you owe, what is due next, and what to do about it. |

### Message house (use everywhere — site, ads, decks, emails)

```
                    Make Better Financial Decisions.
                    ───────────────────────────────
   PILLAR 1              PILLAR 2               PILLAR 3              PILLAR 4
   UNDERSTAND            CONTROL                COMPLY                GROW
   Your numbers,         Cost leakage,          TDS/VDS/VAT/Tax       Advisory + Virtual CFO
   finally clear         procurement, waste     deadlines & filings   for the next stage
   ───────────────       ───────────────        ───────────────       ───────────────
   Proof: financial      Proof: leakage         Proof: live rate      Proof: Virtual CFO MIS,
   command centre,       estimator, cost        hub w/ SRO refs,      forecasting, investment
   live dashboards       efficiency review      deadline engine       appraisal
```

## 1.2 The DhakaFin Flywheel (locked from v1, extended)

```
 Organic search intent                    Free tool engagement              Account creation
 ("current TDS rate BD",        ┌──►     (TDS/VAT/Profit calculator,  ┌──►  (save results, get
  "VAT calculator",             │         rate comparison, leakage    │      compliance calendar,
  "corporate tax rate")   ──────┘         estimator)                   │      rate-change alerts)
        ▲                                                               │
        │                                                               ▼
  Content & SEO ◄────── Rate-change alerts + insights ◄────── Compliance Intelligence
  amplification         (email/WhatsApp/SMS) — the retention hook      (deadline tracking)
        ▲                                                               │
        │                                                               ▼
  Client results &      ◄──── Paid engagement ◄──── Service request /    Business Diagnostic
  testimonials          (retainer / SaaS sub)     consultation booking   Engine result page
        ▲                                                               │
        └───────────────  Full platform client (SaaS + advisory)  ◄───────┘
```

**The flywheel's engine is regulatory change.** Every NBR SRO or rate change is a *content event* that drives traffic, proves the platform is alive, and re-engages every account holder with a personalized alert. This is the single most defensible growth loop DhakaFin has. **Build the rate-change pipeline in Phase 3, not later.**

## 1.3 Three-layer product architecture (locked from v1)

| Layer | Surface | Purpose in funnel | Monetization | Phase |
|---|---|---|---|---|
| **L1 — Public Intelligence** | `dhakafin.com` (`/rates`, `/tools`, `/compliance-calendar`, `/insights`, `/industries`) | Top-of-funnel traffic, authority, trust, lead capture | Free (drives everything else) | 3–4 |
| **L2 — SaaS Platform** | `app.dhakafin.com` | Retention, daily utility, switching cost, recurring revenue | Subscription tiers | 5–6 |
| **L3 — Professional Services** | Human delivery, orchestrated through the platform | High-margin revenue, differentiation, real outcomes | Retainers + project fees | 2 + 7 |

**🇧🇩 Banglish note:** L1 free tools = customer ashe. L2 platform = customer thake (retention + subscription). L3 service = taka ashe (revenue). Tin layer ekshathe kaj korle competitor copy korte parbe na.

## 1.4 Audiences & personas

| # | Persona | Business profile | Core job-to-be-done | Pains | Trigger event | What converts them |
|---|---|---|---|---|---|---|
| **P1** | **Rakib — SME Owner (Trading)** | ৳3–20 Cr turnover, 15–60 staff, Tally/Excel, part-time accountant | "I want to know if I'm actually making profit and stop paying unnecessary tax." | Suspects leakage, no MIS, fears NBR notice, accountant gives numbers he can't interpret | VAT audit notice / bank loan application / profit dropped | Leakage estimator + free health diagnostic + consultation |
| **P2** | **Farhana — Finance Manager (Manufacturing)** | ৳50–300 Cr, in-house accounts team, ERP | "I need clean audit-ready books, correct TDS/VDS deductions and zero late filings." | Manual TDS rates lookup, mushrooming compliance calendar, audit findings | Annual audit / TDS short-deduction risk | Rate hub accuracy + compliance calendar + audit support |
| **P3** | **Sabbir — Startup Founder (Tech/E-com)** | ৳0.5–5 Cr, remote team, no accountant | "I need investor-ready numbers and I don't want to hire a CFO." | Cash runway blindness, VAT on digital services unclear, no reporting discipline | Fundraising / investor diligence / first VAT registration | Virtual CFO tier + break-even & runway tools |
| **P4** | **Nasrin — Proprietor (Restaurant/Retail)** | ৳0.5–3 Cr, single/few outlets, cash heavy | "Keep VAT filing correct and stop cash leakage between outlets." | Daily sales vs z-report mismatch, turnover tax vs VAT confusion, penalties | VAT registration / first penalty | Plain-language Bangla explainers + done-for-you VAT service |
| **P5** | **Imran — Corporate Tax/Treasury Lead** | ৳300 Cr+, listed group | "Zero tolerance for non-compliance; evidence trail for regulators and audit committee." | Documentation, SRO tracking, withholding correctness | Regulatory change / board query | Rate change alerts with SRO PDF + audit trail + SLA |
| **P6** | **Consultant/CA Partner (Channel)** | Small practice, many SME clients | "Serve more clients without hiring; use a reliable back office." | Capacity, tooling, rate research | Client volume growth | White-label/partner plan (Phase 9) |

**Design implication:** the site must serve a spectrum from *"I don't know what VAT is"* (Nasrin, Bangla-first, plain language) to *"show me the SRO"* (Imran, exact references, verifiable). **Same page, progressive disclosure** — plain answer on top, statutory detail in an expandable "Statutory basis" block. This is a core design principle (§3.1, DP-07).

## 1.5 Revenue architecture

| Stream | Description | Pricing model | Launch phase |
|---|---|---|---|
| **R1 — Advisory retainers** | Accounting, VAT, Tax, Compliance retainers (monthly) | Tiered by transaction volume + entities | Phase 2 (lead), Phase 7 (scale) |
| **R2 — SaaS subscriptions** | Platform access: Starter / Growth / Intelligence / Enterprise | Monthly + annual (2 months free), per business + per user seats | Phase 5–6 |
| **R3 — Project/one-off** | Audit support, internal control review, cost-efficiency study, tax planning, registration (BIN/TIN/RJSC), tax return filing | Fixed quote via Quote Engine (§6.6) | Phase 7 |
| **R4 — Virtual CFO** | Executive MIS, budget-vs-actual, board pack, forecasting | Premium monthly retainer (highest margin) | Phase 7–8 |
| **R5 — Premium content/data** | SRO alert subscription for corporates; compiled rate books (PDF/Excel); industry compliance checklists | Annual access | Phase 8 |
| **R6 — Partner/white-label** | CA firms, business associations, chambers | Revenue share | Phase 9 |

### Draft SaaS tier scaffold (finalize pricing in Phase 5, validate with 10 interviews)

| Feature | Starter (free) | Growth | Intelligence | Enterprise |
|---|---|---|---|---|
| Saved calculations, rate alerts | ✅ (3 alerts) | ✅ | ✅ | ✅ |
| Compliance calendar (personalized) | Basic | ✅ | ✅ | ✅ |
| Document vault | 100 MB | 5 GB | 25 GB | Custom |
| Financial dashboards / MIS | — | ✅ | ✅ (advanced + industry benchmarks) | ✅ + custom KPIs |
| Task & service workflow | — | ✅ | ✅ | ✅ + SLA + dedicated manager |
| AI assistant "Ask DhakaFin" | 10 questions/mo | 100/mo | Unlimited fair-use | Unlimited + private mode |
| Multi-business / multi-user | 1 / 1 | 2 / 5 | 5 / 20 | Unlimited |
| API access & data export | — | CSV/Excel | + API | + API + warehouse sync |
| **Target price band (BDT/mo)** | 0 | 2,500–4,000 | 6,000–12,000 | 25,000+ / custom |

**Unit economics to watch from day 1:** CAC (by channel), activation = *business profile completed + first document uploaded within 7 days*, trial→paid conversion, logo churn, net revenue retention, gross margin per service line, support minutes per client.

## 1.6 Competitive differentiation (study internally, copy nothing)

| Dimension | Traditional BD accounting firm | Local bookkeeping software | Global accounting SaaS | **DhakaFin** |
|---|---|---|---|---|
| Local NBR/TDS/VDS depth | ✅ (but offline, per-partner) | ⚠️ partial | ❌ ignores NBR | ✅ database-driven + SRO-referenced |
| Human expert delivery | ✅ | ❌ | ❌ | ✅ platform-orchestrated |
| Decision intelligence (not just reporting) | ⚠️ ad-hoc | ⚠️ reports only | ⚠️ generic | ✅ insights, leakage, diagnostics, benchmarks |
| Transparency (rates, deadlines, pricing) | ❌ opaque | ⚠️ | ⚠️ | ✅ public + verifiable |
| Experience quality | ❌ dated sites | ⚠️ template UI | ✅ but generic | ✅ cinematic + purposeful |
| Cost-efficiency / internal control offer | ⚠️ rare, premium | ❌ | ❌ | ✅ signature service line |

**Anti-positioning (what we deliberately are NOT):** a gaming/crypto-looking site, a generic glassmorphism template, a "we are a CA firm since 1995" brochure, a Tally clone.

## 1.7 Trust & authority system (this is a financial product — trust is a feature)

| Trust asset | Where it appears | Build phase |
|---|---|---|
| **Statutory basis on every number** — rate + SRO + effective date + last-verified date + reviewer | Rate hub, tools, alerts, AI answers | 3 |
| Rate change history & changelog ("what changed, when, why") | Rate detail pages | 3 |
| Team credibility: named professionals, certifications (CA/ACCA/CMA), years, specialities | `/about`, `/team` | 2 |
| Client outcomes with permission (case studies with real numbers, anonymized if needed) | `/clients`, home | 2/7 |
| Security & data handling page (encryption, signed URLs, access logs, retention) | `/security`, portal footer | 5 |
| Editorial policy: who writes, who verifies, correction policy, review date on every article | `/editorial-policy` | 4 |
| Clear disclaimer: information ≠ professional advice; engagement required | Footer + rate/tool pages | 3 |
| Third-party validation: association membership, registrations, partner badges (only real ones) | Footer, `/trust` | 2 |
| SLA on rate updates: "NBR change published → DhakaFin updated within 24–48 working hours" | Rate hub banner, marketing | 3 |

## 1.8 KPIs, funnel math & instrumented targets

**North-star metric:** *Monthly Active Businesses taking an intelligence action* (an action = viewing an insight/dashboard, running a tool, opening compliance item, downloading a report, or completing a service request).

| Funnel stage | Metric | 6-month target (realistic seed) | 18-month target |
|---|---|---|---|
| Reach | Organic sessions/mo | 8,000 | 60,000 |
| Tool engagement | Calculator completions/mo | 1,200 | 12,000 |
| Capture | Accounts created (free) | 400 | 4,000 |
| Activation | Profile completed + 1 doc uploaded in 7d | 40% of signups | 55% |
| Qualified lead | Diagnostic completed / consultation booked | 120 /mo | 900 /mo |
| Paid | Service clients / SaaS paid subs | 15 / 30 | 120 / 400 |
| Retention | Logo churn (SaaS) | < 4%/mo | < 2.5%/mo |
| Authority | Ranking “TDS rate Bangladesh” etc. (top-10 keywords) | 5 keywords | 40 keywords |

**Analytics stack:** GA4 (acquisition) + PostHog (product funnel, session replay on marketing only, heatmaps) + server-side events from Laravel + UTM discipline. Full event taxonomy in Appendix G.

## 1.9 Legal, ethical & data posture (non-negotiables)

1. **Never publish a rate without a source and a last-verified date.** Every rate row carries `reference_sro`, `source_url`, `verified_by`, `verified_at`, `effective_from`.
2. **Never present information as personalized advice.** Standard disclaimer component on every rate/tool/AI surface.
3. **Never overstate credentials.** Team page must reflect real qualifications; marketing copy avoids "we are CA firm" unless true.
4. **Data protection:** Bangladeshi businesses' financial data — treat as confidential by default: encryption at rest (AES-256) + in transit (TLS 1.3), least-privilege access, audit log of every document access/download, signed time-limited URLs, no client data in AI prompts without explicit opt-in, no client data in analytics tools, PII redaction in logs.
5. **Data residency preference:** host in Singapore/India-region or BD-based hosting where possible; document it on `/security`.
6. **Retention & deletion:** documented retention matrix (documents 7 years for statutory reasons, chat 3 years, marketing leads 24 months), self-service export & deletion workflow with 30-day grace, and a legal-hold exception for audit matters.
7. **Ethical AI:** AI answers must cite DhakaFin's curated corpus; if confidence is low, the answer is "I don't have a verified answer — here is a human" (fallback CTA), never a guess.
---

# 2. INFORMATION ARCHITECTURE

## 2.1 Full sitemap

```
dhakafin.com  (Public — Next.js, SSG/ISR)
│
├── /                                  Home (Signature Experience — §5 F1–F3)
│
├── INTELLIGENCE HUB
│   ├── /rates                         Regulatory Rate Hub — landing (all rate families)
│   │   ├── /rates/tds                 TDS rates (section-wise, searchable, filterable)
│   │   │   └── /rates/tds/[section]   e.g. /rates/tds/section-89 (contractor, supplier…)
│   │   ├── /rates/vds                 VDS rates (local VAT deduction on services)
│   │   ├── /rates/vat                 VAT rates (standard, truncated, exempt, zero-rated, turnover)
│   │   ├── /rates/income-tax          Individual income tax slabs & thresholds
│   │   ├── /rates/corporate-tax       Corporate tax by entity type
│   │   ├── /rates/ait                 Advance Income Tax (import stage)
│   │   ├── /rates/withholding-tax     Withholding overview (TDS + VDS in one view)
│   │   ├── /rates/tax-slabs           Consolidated slab viewer with year-over-year compare
│   │   ├── /rates/thresholds          Registration thresholds, exemption limits, turnover ceilings
│   │   └── /rates/compare             Year-over-year / act-over-act comparison workbench
│   ├── /sro                           SRO & Circular library (searchable, filterable, PDF-linked)
│   │   ├── /sro/[slug]                Individual SRO detail + plain-language summary + affected rates
│   │   └── /circulars, /circulars/[slug]
│   ├── /compliance-calendar           Public statutory deadline calendar (monthly/annual views)
│   │   └── /compliance-calendar/[month-year]
│   └── /insights                      Editorial hub (blog / explainers / updates)
│       ├── /insights/[slug]
│       ├── /insights/category/[slug]  (tax, vat, compliance, cost-efficiency, industry, news)
│       └── /insights/authors/[slug]
│
├── TOOLS
│   ├── /tools                         Tool suite landing
│   ├── /tools/tds-calculator
│   ├── /tools/vds-calculator
│   ├── /tools/vat-calculator          (inclusive/exclusive + Mushak-aligned breakdown)
│   ├── /tools/income-tax-calculator   (individual + salary)
│   ├── /tools/corporate-tax-calculator
│   ├── /tools/profit-calculator
│   ├── /tools/profit-margin-calculator
│   ├── /tools/break-even-calculator
│   ├── /tools/roi-calculator
│   ├── /tools/cash-flow-calculator    (incl. runway)
│   ├── /tools/cost-efficiency-calculator  (leakage estimator)
│   ├── /tools/payroll-calculator
│   └── /tools/working-capital-calculator
│
├── DIAGNOSTIC & EXPERIENCES
│   ├── /diagnostic                    Business Diagnostic Engine (§5 F8) — 6 steps
│   │   └── /diagnostic/result/[token] Shareable/saved result (privacy-safe token)
│   ├── /money-flow                    "Where Is Your Money Going?" signature experience (§5 F2)
│   ├── /cost-efficiency               Cost Efficiency experience + leakage explorer (§5 F9)
│   └── /platform                      Financial Intelligence Platform tour (dashboard preview) (§5 F7)
│
├── SERVICES
│   ├── /services                      Service ecosystem (§5 F6)
│   └── /services/[slug]               9 service pages:
│       accounting-bookkeeping · audit-support · tax-services · vat-services ·
│       cost-efficiency-internal-control · corporate-compliance · financial-advisory ·
│       virtual-cfo · internal-control-governance
│
├── INDUSTRIES
│   ├── /industries
│   └── /industries/[slug]             11 industry pages (§5 F13):
│       manufacturing · trading · retail · ecommerce · startup · sme ·
│       professional-services · real-estate · restaurant · technology · import-export
│
├── COMPANY & TRUST
│   ├── /about · /team · /careers · /clients (case studies) · /security ·
│   ├── /editorial-policy · /contact · /book-consultation · /partners · /press
│
├── CONVERSION
│   ├── /pricing                      (services + SaaS pricing transparency)
│   ├── /quote                        Quote request wizard (multi-step, saves draft)
│   └── /get-started                  Onboarding entry (choose: Service / SaaS / Both)
│
├── SUPPORT & LEGAL
│   ├── /faq · /help · /glossary · /support · /status
│   ├── /terms · /privacy · /refund-policy · /disclaimer · /cookies · /sitemap (HTML)
│
└── SYSTEM
    ├── /search                        Site-wide search (rates + tools + insights + services)
    ├── /rate-alerts                   Subscribe to rate-change alerts (topic + channel)
    └── 404 / 500 / offline            Art-directed error states (§5 F14)
```

```
app.dhakafin.com  (SaaS Portal — auth required)
│
├── /onboarding            4-step wizard: business → profile → documents → plan
├── /dashboard             Financial Command Centre (§5 F7)
├── /insights              AI-detected insights feed with explanations
├── /accounting            Books snapshot: revenue, expense, AR, AP, reconciliation status
├── /tax                   Tax position, TDS/withholding tracker, returns, assessments
├── /vat                   VAT position, output/input, Mushak 6.6 tracker, returns
├── /compliance            Compliance Intelligence Centre (§5 F10) — deadlines, obligations, docs
├── /documents             Encrypted vault: folders, tags, versions, permissions, audit trail
├── /reports               Report library + scheduled delivery (monthly MIS, P&L, ratios)
├── /tasks                 Task board (client ↔ DhakaFin), approvals, evidence upload
├── /messages              Secure threaded messaging with consultants
├── /requests              Service requests, quotes, acceptance, progress
├── /assistant             "Ask DhakaFin" AI copilot (§5 F12)
├── /billing               Invoices, payments, subscription, plan change, receipts
├── /notifications         Notification centre + channel preferences
├── /business              Business profile, entities, users & roles, integrations
├── /settings              Personal profile, security (2FA), sessions, data export/delete
└── /support               Tickets, help, escalation
```

```
admin.dhakafin.com  (Filament v4 Back Office — §6)
├── Dashboard (business KPIs)        ├── Regulatory rates (all families + SROs + circulars)
├── Content (pages/sections/blog)    ├── CRM (leads → pipeline → quotes → clients)
├── Tools & calculators config       ├── Platform ops (users/businesses/subs/billing)
├── Service delivery (requests/tasks)├── Documents & audit          ├── Settings (roles/SEO/menus)
```

## 2.2 Route specification table (public — SEO-bearing)

| Route | Rendering | Title pattern | Primary intent keyword | Schema.org | Priority |
|---|---|---|---|---|---|
| `/` | ISR 1h | `DhakaFin — Financial Intelligence, Accounting & Compliance for Bangladesh` | dhakafin / accounting firm bangladesh | Organization, WebSite, FinancialService | 1.0 |
| `/rates` | ISR 6h | `Bangladesh Tax, VAT & TDS Rates — Live Regulatory Hub` | tax rates bangladesh | Dataset, FAQPage | 0.95 |
| `/rates/tds` | ISR 12h | `TDS Rates in Bangladesh (FY {year}): Section-wise Table & SRO Reference` | tds rate bangladesh | Dataset, Table, FAQPage | 0.95 |
| `/rates/tds/[section]` | ISR 24h | `{Section title} — TDS Rate {x}% \| Bangladesh {FY}` | tds section 89 rate | Legislation, FAQPage | 0.9 |
| `/rates/vds` | ISR 12h | `VDS Rates in Bangladesh {FY} — Local VAT Deduction Table` | vds rate bangladesh | Dataset, FAQPage | 0.9 |
| `/rates/vat` | ISR 12h | `VAT Rates in Bangladesh {FY}: 15%, Reduced, Exempt & Turnover Tax` | vat rate in bangladesh | Dataset, FAQPage | 0.95 |
| `/rates/income-tax` | ISR 12h | `Income Tax Slab for Individuals (FY {year}) — Bangladesh` | income tax slab bangladesh | Dataset, FAQPage | 0.95 |
| `/rates/corporate-tax` | ISR 12h | `Corporate Tax Rate in Bangladesh {FY} by Company Type` | corporate tax rate bangladesh | Dataset | 0.9 |
| `/rates/ait` | ISR 24h | `Advance Income Tax (AIT) on Import — Rates & Thresholds` | ait rate bangladesh import | Dataset | 0.85 |
| `/rates/withholding-tax` | ISR 24h | `Withholding Tax in Bangladesh: TDS & VDS in One Guide` | withholding tax bangladesh | Dataset, FAQPage | 0.85 |
| `/rates/compare` | Client + API | `Compare Tax & VAT Rates Across Years — Bangladesh` | vat rate change 2025 2026 | DataFeed | 0.8 |
| `/sro` | ISR 6h | `SRO & Circular Library — Bangladesh Tax & VAT` | nbr sro 2025 | Dataset | 0.85 |
| `/compliance-calendar` | ISR 12h | `Bangladesh Tax, VAT & TDS Compliance Calendar {FY}` | vat return due date bangladesh | Event | 0.9 |
| `/tools/[tool]` | SSG + client | `Free {Tool Name} — {Benefit} \| DhakaFin` | vds calculator bangladesh | SoftwareApplication, HowTo, FAQPage | 0.9 |
| `/diagnostic` | SSG + client | `Free Business Financial Health Diagnostic — 2 Minutes` | business health check bangladesh | WebApplication | 0.85 |
| `/money-flow` | SSG + WebGL | `Where Is Your Money Going? — Interactive Financial Flow` | where does business profit go | WebApplication | 0.8 |
| `/cost-efficiency` | SSG + client | `Cost Efficiency & Financial Leakage Review — Bangladesh` | reduce business cost bangladesh | Service, FAQPage | 0.85 |
| `/services/[slug]` | ISR 24h | `{Service} in Bangladesh — {Outcome} \| DhakaFin` | vat services bangladesh | Service, FAQPage, BreadcrumbList | 0.9 |
| `/industries/[slug]` | ISR 24h | `Accounting & Compliance for {Industry} in Bangladesh` | accounting for manufacturing company bangladesh | Service, FAQPage | 0.85 |
| `/insights/[slug]` | ISR 1h | `{Post title} \| DhakaFin Insights` | long-tail | Article, BreadcrumbList | 0.7 |
| `/pricing` | ISR 24h | `DhakaFin Pricing — Services & Platform Plans` | accounting service price bangladesh | Offer, FAQPage | 0.9 |
| `/book-consultation` | SSG + client | `Book a Free Financial Consultation \| DhakaFin` | tax consultant bangladesh | — | 0.9 |

**Rules:** (a) URL slugs are permanent — use 301s if ever changed; (b) every rate/tool page has a *last-updated* timestamp visible in the first viewport; (c) every page defines `canonical`, OG image (auto-generated via `@vercel/og`-style template or Satori), and locale alternates (`en`, `bn`); (d) no page ships without an H1 containing the primary intent phrase.

## 2.3 Navigation design

**Primary header (desktop, 72px, translucent dark, blur 16px, becomes opaque-on-scroll):**

```
[DhakaFin logo]  Rates ▾   Tools ▾   Services ▾   Industries ▾   Insights   [Search ⌘K]   [Sign in]  [Book a Consultation]
```

- **Rates ▾** mega-panel: 3 columns — *By tax type* (TDS/VDS/VAT/Income/Corporate/AIT) · *Popular now* (top 6 most-viewed rate pages, DB-driven) · *Also* (SRO & Circulars, Compliance Calendar, Rate alerts signup, "What changed this month").
- **Tools ▾** mega-panel: grouped by *Tax · VAT · Business* with search field inside panel.
- **Services ▾**: 9 services + "Not sure? Take the 2-minute diagnostic →".
- **Industries ▾**: 11 industries in a compact visual grid with icons.
- **⌘K command palette** (also `/` key): searches rates, tools, services, insights, and offers *actions* ("Calculate VDS", "Book consultation", "Download compliance calendar"). This is a signature navigation feature — spec in §5 F14.
- **Mobile header:** logo + search icon + hamburger → full-screen panel with accordion sections, sticky "Book consultation" CTA, and sign-in. Panel animates from the right with staggered children (200–320ms).

**Portal left nav (app.dhakafin.com):** icon + label rail, collapsible to 64px icons; grouped: *Overview* (Dashboard, Insights, Assistant) · *Finance* (Accounting, Tax, VAT, Reports) · *Compliance* (Compliance, Documents, Tasks, Requests) · *Account* (Billing, Notifications, Business, Settings, Support). Global topbar: business switcher, search, notification bell, help, avatar.

**Footer (5 columns + trust strip):** Product · Intelligence (rates, SRO, calendar) · Services · Industries · Company · Legal + newsletter/rate-alert capture + office address, TIN/BIN if applicable, social, and a one-line disclaimer. Footer is also a **SEO surface**: top 20 rate/tool links with keyword-rich labels.

## 2.4 Content model (drives both Filament admin and API)

| Model | Key fields | Relationships | Public surface | Admin surface |
|---|---|---|---|---|
| `Page` | slug, title, seo fields, status, sections[] | hasMany Section | any static page | Content → Pages |
| `SectionBlock` | type (hero/features/flow/faq/cta/table/gallery…), order, content JSON, visibility | belongsTo Page or Service/Industry | rendered dynamically | Page builder |
| `Service` | slug, name, tagline, problem, who, includes[], workflow steps[], deliverables[], relatedTools[], relatedRates[], faq[], icon, price_from, order | hasMany CaseStudy, FAQ | /services/[slug] | Services |
| `Industry` | slug, name, icon, painPoints[], kpis[], complianceProfile[], recommendedServices[], caseStudy | belongsToMany Service | /industries/[slug] | Industries |
| `RateFamily` | code (tds/vds/vat/income_tax/corporate_tax/ait), name, description, basis (Act), source_url | hasMany Rate | /rates/* | Regulatory → Rate families |
| `Rate` | family, title, description, section_ref, rate_type (percent/fixed/range/table), rate_value, rate_min, rate_max, base, applicability, taxpayer_type, conditions, effective_from, effective_to, reference_sro, source_url, status (draft/verified/superseded), verified_by, verified_at, notes, version, previous_rate_id | belongsTo RateFamily, SRO; hasMany RateChange | /rates/*, tools, alerts | Regulatory → Rates |
| `TaxSlab` | year, taxpayer_type, slab_order, income_from, income_to, rate, surcharge_rule, rebate_rule | belongsTo RateFamily | /rates/income-tax | Regulatory → Slabs |
| `SRO` | number, year, date, title, summary_plain, full_text_link, pdf_url, affected_rate_ids[], status | hasMany Rate | /sro/[slug] | Regulatory → SROs |
| `Circular` | number, year, date, title, summary, pdf | — | /circulars | Regulatory → Circulars |
| `ComplianceDeadline` | obligation_type, title, applies_to (criteria JSON: entity type, turnover band, VAT-registered, industry), due_rule (e.g. "15th monthly"), periodicity, form_ref, penalty_ref, notes | belongsTo ObligationType | /compliance-calendar | Regulatory → Deadlines |
| `Tool` | slug, name, category, inputs config (JSON schema), formula config, defaults, disclaimers, relatedServices[], relatedRates[], cta | hasMany ToolPreset | /tools/* | Tools |
| `BlogPost` | slug, title, excerpt, body (blocks), cover, author, reviewer, review_date, category, tags, reading_time, status, published_at, seo | belongsTo Author, Category | /insights | Content → Posts |
| `FAQ` | question, answer, context (page/service/tool/rate), order, tags | morphTo context | everywhere + schema | Content → FAQs |
| `CaseStudy` | client (or anonymized label), industry, challenge, intervention, results[] (metric, before, after), quote, permission status | belongsTo Service/Industry | /clients | Content → Case studies |
| `GlossaryTerm` | term, bn_term, definition, related[], see_also | — | /glossary | Content → Glossary |
| `Testimonial` | person, role, company, quote, avatar, consent flag | — | home, services | Content → Testimonials |
| `TeamMember` | name, role, credentials[], bio, photo, linkedin, specialities[] | — | /team | Content → Team |
| `Lead` | type, source, name, phone, email, business_name, industry, turnover_band, message, diagnostic_result_token, utm, status, owner | hasMany Activity, Quote | — | CRM → Leads |
| `Consultation` | lead_id, slot_at, mode (call/office/video), assigned_to, status, notes, reminder_sent | belongsTo Lead | booking flow | CRM → Consultations |
| `Quote` | quote_no, lead_id, items[] (service, qty, freq, fee), subtotal, discount, vat, total, terms, validity_days, status, accepted_at, pdf_path | belongsTo Lead | /quote (client view) | CRM → Quotes |
| `PricingPlan` | code, name, description, price_monthly, price_yearly, currency, features[], limits JSON, order, is_public, is_popular | hasMany Subscription | /pricing, portal billing | Platform → Plans |
| `Subscription` | business_id, plan_id, status, trial_ends_at, current_period_start/end, gateway, gateway_ref, cancel_at | belongsTo Business, Plan; hasMany Invoice | portal billing | Platform → Subscriptions |
| `Business` | name, legal_name, entity_type, TIN, BIN, RJSC, industry, turnover_band, vat_registered, fiscal_year_end, address, contacts, logo, status, onboarding_step | hasMany Users, Documents, Tasks… | portal | Platform → Businesses |
| `User` | name, phone (unique), email, password, locale, 2FA secret, last_login, status, roles/direct perms | belongsToMany Business (pivot: role, permissions) | portal | Platform → Users |
| `Document` | business_id, category, title, file_path, mime, size, checksum, version, uploader, documentable (morph: task/request/compliance/return), expires_at, confidentiality | morphTo | portal vault | Documents module |
| `Task` | business_id, title, description, type (client/platform), assignee, due_at, status, priority, requires_document, reviewer, approved_at, evidence_document_id | belongsTo Business, User | portal tasks | Service delivery |
| `ServiceRequest` | business_id, service_id, scope, status workflow, quote_id, assigned_manager, sla_due, comments | belongsTo Business, Service | portal requests | Service delivery |
| `Invoice` | number, business_id or lead_id, items[], subtotal, vat, total, due_at, status (draft/sent/partial/paid/void), gateway_refs[], pdf_path | belongsTo Business/Lead | portal billing | Finance → Invoices |
| `Notification` | user_id, type, title, body, action_url, channels_sent[], read_at, severity | belongsTo User | portal bell | Platform → Notifications |
| `RateChangeAlert` | rate_id, change_type, old→new, headline, affected_segments[], sent_at, opens, clicks | belongsTo Rate; hasMany subscriptions | email/WhatsApp/SMS | Regulatory → Alerts |
| `Insight` (AI) | business_id, type, severity, title, explanation, driver_refs, recommendation, confidence, dismissed_at | belongsTo Business | portal insights | Platform → Insights |
| `AssistantConversation` | user_id, business_id, messages[] (with citations), feedback, tokens_used, cost | belongsTo User | portal assistant | Platform → AI logs |
| `AuditLog` | actor, action, subject (morph), ip, user_agent, meta JSON, at | — | — | Audit module (read-only) |
| `LeakageEstimate` | inputs JSON (turnover, industry, spend categories), outputs JSON, benchmark_ref, token, email_captured | — | /cost-efficiency + tool | CRM → Leads (linked) |
| `MenuItem` / `Redirect` / `GlobalSetting` / `MediaAsset` | config-level | — | everywhere | Settings |

**Conventions:** every public content model has `status` (draft/published/archived), `published_at`, `seo_title`, `seo_description`, `og_image`, `noindex` flag, `order`; every model uses soft deletes; every rate/regulatory row records `verified_by` + `verified_at` (audit requirement, §1.9).

## 2.5 SEO architecture at a glance

- **Programmatic SEO:** rate pages (1 per family + 1 per TDS section ≈ 80–120 pages), tool pages (13), industry pages (11), service pages (9), SRO pages (one per SRO published, grows 100+/yr), insight articles. Machine-generated *layout*, human-written *copy* — never thin auto-content.
- **Internal linking rule:** every tool links to its related rate page + 2 related tools + 1 service; every rate page links to its tool + related SRO + relevant service; every insight links to 3 rates/tools. Enforced via FK arrays in the content model, rendered automatically.
- **Structured data:** Organization, WebSite+SearchAction, BreadcrumbList, FAQPage, Dataset (rates), SoftwareApplication (tools), Article (insights), Service (services), Event (deadlines), HowTo (where relevant).
- **Freshness signals:** visible "Last verified: {date}" + `dateModified` in schema + automatic sitemap ping on rate update.
- **Local SEO:** Google Business Profile, NAP consistency, BN-language service pages, "Dhaka" location pages only if genuinely differentiated (avoid doorway pages).
- **Answer-engine optimisation (AEO/GEO):** every rate page opens with a 40–60 word direct-answer block that LLM crawlers can lift, followed by the detailed table. Comparison tables are semantic `<table>` with proper `<th scope>`.
- **i18n:** `en` default, `bn-BD` full translation for public marketing + tools + top tools' help text; `hreflang` pairs; Bangla slugs only if SEO research supports it (default: keep Latin slugs, translate content).

## 2.6 Key user flows (happy paths + edge cases)

**FLOW A — Anonymous researcher → lead (highest volume path)**
```
Google: "vds rate bangladesh"
   → /rates/vds  (answer block, table, filters, effective date, SRO ref)
   → inline "Calculate VDS on ৳X" widget (no signup)
   → result panel: deduction, net payable, Mushak 6.6 note
   → CTA: "Save this calculation & get rate-change alerts"  [Email only]
   → account created (magic link) → business profile prompt (3 fields skippable)
   → 7 days later: rate-change or deadline email → returns
   → diagnostic → consultation booked → lead in CRM
```
*Edge cases:* rate lookup miss → "Can't find your case? Ask our tax team (form)" capturing the query into `Leads` with `source=rate_miss`; outdated rate → the page shows both current and superseded with a changelog.

**FLOW B — SME owner → paid service**
```
Ad/referral/home → /cost-efficiency (leakage experience) → estimator with turnover slider
   → "Your estimated avoidable cost: ৳X–৳Y" (range + assumptions + disclaimer)
   → "Get a Cost Efficiency Review" → /quote wizard (5 steps, progress %, saves draft)
   → consultation booking (pick slot, confirm by SMS+email)
   → CRM: lead → qualified → proposal → won → onboarding (portal account created)
```

**FLOW C — Startup → Virtual CFO**
```
Search "virtual cfo bangladesh" → /services/virtual-cfo → problem/who/what's included/workflow/deliverables
   → interactive "CFO gap check" (5 questions) → tailored scope card
   → /pricing (transparent bands) → book consultation
```

**FLOW D — Corporate finance manager → self-serve SaaS + rate alerts**
```
/rates/tds → subscribes to "TDS changes" alerts (email + WhatsApp)
   → /platform tour → free account → onboarding: entity, TIN/BIN, VAT reg status, industry, turnover band
   → personalized compliance calendar generated
   → 14-day Growth trial → usage: docs uploaded, tasks completed → paid subscription (SSLCommerz/bKash)
```

**FLOW E — Rate change event (retention loop)**
```
NBR publishes SRO → admin enters new Rate (draft) → second admin verifies → status verified
   → system: (1) supersedes old rate (effective_to set), (2) generates changelog entry,
     (3) builds RateChangeAlert, (4) fans out: in-app, email, WhatsApp/SMS to subscribers of that family,
     (5) opens a Task for affected clients ("Your TDS on contractor payments changed — review"),
     (6) publishes an Insights article draft for the content team, (7) pings sitemap.
```

**FLOW F — Document-driven task loop**
```
DhakaFin creates Task ("Upload bank statement for March") → client notified
   → uploads PDF via portal (drag-drop, virus-scan queued, checksum, in-vault)
   → consultant reviews → approve or request changes with note
   → task closed → audit log entry → monthly MIS report updated
```

**FLOW G — AI assistant with guardrails**
```
User: "Why did my profit fall last month?"
 → router checks intent + entitlement → retrieves scoped data (business_id enforced) + curated corpus
 → answer with: headline, driver breakdown (chart), cited data points, "based on: March MIS, ledger" chips,
   confidence badge, and 2 follow-up suggestions
 → if data insufficient: "I can't verify this yet — here's what's missing" + upload CTA
 → if legal/rate question: answer only from verified rate rows + SRO link, else human fallback
 → thumbs up/down feeds eval set; low-rated answers create a review task for the ops team
```

## 2.7 Notification & messaging architecture

| Channel | Used for | Cadence rules | Fallback chain |
|---|---|---|---|
| **In-app** | Everything (single source of truth) | Real-time | — |
| **Email** | Deadline alerts, rate changes, reports, invoices, digests | Max 1 marketing/day; transactional immediate | Retry ×3, then flag |
| **WhatsApp (Cloud API)** | Deadline alerts (opt-in), document requests, consultation reminders | Max 4/month marketing; transactional permitted | → SMS |
| **SMS** | Critical only: deadline T-1, overdue, OTP, payment receipt | OTP immediate; alerts batched at 09:00 | → email |
| **Push (PWA)** | Optional, opt-in | Max 1/day | — |
| **Consultant call** | High-value/at-risk accounts | Per CRM playbook | — |

**Compliance deadline cadence (locked):** T-30 (planning), T-7 (reminder), T-3 (action), T-1 (urgent), T-0 (due today), T+1 (overdue, with penalty reference), T+7 (escalation to account manager). Severity colour mapping in §3.6. All notification templates are admin-editable with variable interpolation and bilingual variants.

## 2.8 Multilingual & localization rules

- **Default locale** `en`; **`bn-BD`** full translation for: home, services, industries, tools UI + help text, rate page intros, compliance calendar, notifications, emails, portal navigation.
- **Numbers:** Bangla locale uses `৳` + Latin digits by default (research shows easier parsing for financial data); Bangla numerals (`৳১২,৫০,০০০`) available as a user preference toggle in portal settings and in the calculator display.
- **Number formatting:** Bangladeshi lakh-crore grouping (**12,34,567**) is mandatory everywhere money is shown, with a compact form (`৳12.35 L`, `৳1.23 Cr`) for dashboard tiles. Formatting utility is centralized (`formatBDT()`) — never inline.
- **Dates:** `DD MMM YYYY` (en) / Bangla month names in `bn`; fiscal year always shown as `FY 2025–26` and `FY ২০২৫–২৬`.
- **Currency:** BDT only in v1; USD equivalent tooltip on pricing for international visitors.
- **Terms:** keep statutory English terms (TDS, VDS, Mushak 9.1, SRO) with Bangla gloss on first use — a bilingual glossary (§5 F4) stores these pairs and is used as tooltips globally.
---

# 3. DESIGN LANGUAGE & EXPERIENCE SYSTEM

> This section is the constitution. If a screen contradicts it, the screen is wrong.

## 3.1 Design principles

| ID | Principle | What it means in practice | Test question |
|---|---|---|---|
| **DP-01** | **Intelligence over decoration** | Every animation, glow and 3D object communicates a fact (a flow, a change, a dependency). No ambient sparkle. | "What does this effect tell the user?" If there's no answer, delete it. |
| **DP-02** | **Calm authority** | Dark, spacious, confident. Financial data is presented like instrumentation, not like a casino. Motion is slow and eased, never bouncy. | "Would a CFO trust this?" |
| **DP-03** | **Depth with purpose** | Layered planes (canvas → context → surface → element) express information hierarchy, not just style. | "Does this layer mean something?" |
| **DP-04** | **Data is the hero** | Numbers, charts and rates get the highest contrast, largest type, cleanest space. Chrome recedes. | "Is attention landing on the number?" |
| **DP-05** | **Original, not trendy** | We do not use default glassmorphism, purple-blue AI gradients, floating blob illustration, or stock-photo handshakes. | "Have I seen this exact layout on 50 other sites?" |
| **DP-06** | **Never sacrifice clarity for spectacle** | Effects may never delay, hide, or obscure content. Content exists in DOM first, enhancement second. | "With JS off / WebGL blocked, is the page still excellent?" |
| **DP-07** | **Two audiences, one page** | Plain-language answer first, statutory depth on demand. Progressive disclosure everywhere. | "Would both a first-time proprietor and a tax head be satisfied?" |
| **DP-08** | **Bangladeshi by construction** | ৳, lakh-crore grouping, Mushak forms, NBR SROs, BD fiscal years, Bangla typography, BD payment methods. Global templates cannot fake this. | "Could this be an Indian/US site with find-replace?" |
| **DP-09** | **Premium = restraint** | Premium is expressed with spacing, one accent colour, precise type, and flawless micro-states — not with more effects. | "Can I remove 20% and have it feel *more* expensive?" |
| **DP-10** | **Accessible is not a mode** | Accessibility considered at component-design time (focus rings, min touch 44px, contrast tokens, reduced-motion variants). | "Can it be used keyboard-only, one-handed, at 200% zoom?" |

## 3.2 Colour system

### 3.2.1 Foundation (locked brand palette — "Ocean Void")

| Token | Hex | Role | Notes |
|---|---|---|---|
| `--void` | `#020b0a` | App/site base background | Near-black with a green undertone — the signature "Ocean Void" |
| `--void-deep` | `#010807` | Canvas under WebGL, gradient floor | For depth beyond base |
| `--slate-deep` | `#041312` | Section background alternates | Creates rhythm without borders |
| `--surface-1` | `#061715` | Card/panel base (opaque fallback) |  |
| `--glass-tint` | `rgba(8,30,27,0.65)` | Glass card tint (composite → `#061715` over void) | Always paired with blur 16px + 1px hairline border |
| `--surface-2` | `#0a1f1c` | Raised elements, popovers, menus |  |
| `--surface-3` | `#0f2a26` | Highest elevation (modals, command palette) |  |

### 3.2.2 Sea-green signature spectrum (primary brand)

| Token | Hex | Use | Contrast on `--void` |
|---|---|---|---|
| `--sea-700` | `#0d9488` | Deep fills, gradients, chart floors, large decorative | 5.32:1 — ✅ large text/UI, ⚠️ not for small body text |
| `--sea-600` | `#0f9e93` | Hover of deep fills | ~5.9:1 |
| `--sea-500` | `#14b8a6` | **Primary brand** — buttons, active states, key chart series, links | **8.00:1** ✅ AA/AAA normal text |
| `--sea-400` | `#2dd4bf` | Luminous — highlights, hover glow, KPI accent, focus ring | **10.69:1** ✅ |
| `--sea-300` | `#5eead4` | Glow — data streams, sparkline tips, "live" pulses | **13.46:1** ✅ |
| `--sea-200` | `#99f6e4` | Text on deep-green fills, subtle labels | ~15:1 ✅ |
| `--sea-tint-08` | `rgba(20,184,166,0.08)` | Table row hover, selected node fill | — |
| `--sea-tint-16` | `rgba(20,184,166,0.16)` | Chips, badges, active nav pill | — |
| `--sea-border` | `rgba(45,212,191,0.18)` | Default hairline border | — |
| `--sea-border-hover` | `rgba(94,234,212,0.50)` | Hover border on interactive surfaces | — |
| `--sea-glow` | `rgba(45,212,191,0.35)` | Box-shadow glow (used sparingly, max 2 per viewport) | — |

### 3.2.3 Secondary accents

| Token | Hex | Role | Constraint |
|---|---|---|---|
| `--cyan` | `#22d3ee` | Data streams, secondary chart series, "inflow" direction | Never used for CTA or legal text |
| `--cyan-dim` | `#0891b2` | Cyan fills | — |
| `--gold` | `#d97706` | **Regulatory/SRO/alert accent** (v1 token) | 6.25:1 ✅ normal text |
| `--gold-bright` | `#fbbf24` | Small-text gold, badges, "effective from" pills | 11.93:1 ✅ AAA |
| `--violet-dusk` | `#7c6cf0` | Reserved for AI/assistant surfaces only | ≤ 10% coverage |

### 3.2.4 Status / semantic

| Token | Hex | Meaning | Text-on-void |
|---|---|---|---|
| `--ok` | `#34d399` | Paid, filed, compliant, healthy | 9.9:1 ✅ |
| `--ok-deep` | `#10b981` | OK fills | 7.0:1 ✅ |
| `--warn` | `#fbbf24` | Due soon, attention, incomplete data | 11.9:1 ✅ |
| `--risk` | `#fb923c` | Overdue, risk, penalty exposure | 9.0:1 ✅ |
| `--danger` | `#f87171` | Critical: missed deadline, failed payment, security | 7.6:1 ✅ |
| `--info` | `#2dd4bf` | Informational (reuses sea-400 to avoid palette noise) | 10.7:1 ✅ |
| `--muted` | `#94a3b8` | Secondary text, captions, metadata | **7.76:1** ✅ |
| `--muted-2` | `#64748b` | ⚠️ **Decorative only / ≥19px bold** — fails AA for normal body text (4.18:1) | Restricted token |
| `--text` | `#e2e8f0` | Primary body text (16.15:1 ✅) | — |
| `--text-strong` | `#f8fafc` | Headings, key numbers (19.03:1) | — |

### 3.2.5 Gradient engine (only five gradients exist in the whole product)

1. **`grad-ocean`** — `linear-gradient(160deg, #020b0a 0%, #041312 55%, #06231f 100%)` — page/section backgrounds.
2. **`grad-sea-line`** — `linear-gradient(90deg, transparent, #14b8a6, #2dd4bf, transparent)` — data streams, section dividers (animated).
3. **`grad-depth`** — `radial-gradient(120% 80% at 50% 0%, rgba(20,184,166,0.14), transparent 60%)` — hero spotlight.
4. **`grad-metal`** — `linear-gradient(135deg, #1c2b2a 0%, #0b1817 40%, #16302c 70%, #0a1615 100%)` — metallic surfaces (badges, coin/ingot 3D materials).
5. **`grad-focus`** — `linear-gradient(90deg, #5eead4, #22d3ee)` — progress bars, active tab underline, featured borders.

**Banned:** purple→pink AI gradient, rainbow mesh, neon-green-on-black "hacker" glow, over-saturated teal-on-teal blobs.

### 3.2.6 Light theme (secondary, must be perfect — not an afterthought)

| Token | Light value | Rule |
|---|---|---|
| `--void` | `#f7faf9` | Warm off-white (never pure white for large areas) |
| `--surface-1` | `#ffffff` | Cards with `--border` `#e2efe d`… → use `#e3efec` |
| `--text` | `#0b1f1c` | 15.8:1 on light base ✅ |
| `--muted` | `#4b6a65` | 5.6:1 ✅ |
| `--sea-500` | `#0d9488` | Darkened for contrast; **buttons use `#0f766e`** (sea-700-light) for 4.9:1 with white text ✅ |
| `--gold` | `#a16207` | Darkened gold for light surfaces |
| Borders | `#d7e5e2` / hover `#0d9488` 40% | — |

Light mode is used for: printed reports/invoices, PDF exports of MIS, users who explicitly choose it, and OS-level `prefers-color-scheme: light` on *public* marketing only if analytics show benefit. Portal defaults to dark (data density reads better).

### 3.2.7 Critical contrast rules (measured, non-negotiable)

| Rule | Why |
|---|---|
| **Primary button = `--sea-500` background with `--void` (dark) text** | Measured: white on sea-500 = **2.49:1 (FAIL)**; dark on sea-500 = **8.00:1 (PASS)** |
| Never place `--muted-2` (`#64748b`) as normal body text | 4.18:1 fails AA at <19px |
| `--sea-700` only for ≥19px bold text, borders, fills, icons — not small copy | 5.32:1 |
| Status colours always paired with an icon + label, never colour alone | Colour-blind safety (WCAG 1.4.1) |
| Charts: minimum 3:1 contrast between adjacent series + pattern/dash differentiation | Non-colour encoding |
| Text over glass must be tested over the *composite* (`#061715`), not the source tint | Real-world rendering |

## 3.3 Depth, material & surface system

**Five-layer depth model** (each layer has a defined material, blur, border, shadow and z-index band):

| Layer | Material | Blur | Border | Shadow / glow | z-index | Use |
|---|---|---|---|---|---|---|
| **L0 Canvas** | WebGL / gradient / generative | — | — | — | 0 | Hero, money-flow, section atmospheres |
| **L1 Grid** | Faint 1px dot/line grid at 3–6% opacity, 32/64px | — | — | — | 1 | Adds spatial reference; disabled on mobile |
| **L2 Context** | `--surface-1`, radius 20px | — | `1px --sea-border` | `0 8px 32px rgba(0,0,0,.4)` | 10 | Sections, panels, dashboard cards |
| **L3 Element** | `--glass-tint` glass, radius 14–16px | 16px | hairline + inner top highlight | `0 4px 20px rgba(0,0,0,.35)` | 20 | Floating cards, KPI tiles, tool results |
| **L4 Overlay** | `--surface-3`, radius 18px, 1px sea-border-hover | 24px | strong | `0 24px 64px rgba(0,0,0,.6)` | 100 | Modals, command palette, drawers, tooltips |
| **L5 System** | Toasts, alerts, sticky CTA bar | 20px | accent-tinted | elevated | 1000 | Feedback & guidance |

**Material vocabulary (named, reusable):**

- **`glass-panel`** — tint + blur 16 + hairline; the workhorse. *Rule: max 2 glass layers stacked; never glass-on-glass-on-glass.*
- **`metal-edge`** — 1px top inner highlight `rgba(255,255,255,.06)` + 1px bottom `rgba(0,0,0,.4)` → gives "machined" edge on cards. This single detail is what makes DHakaFin surfaces feel premium vs default dark cards.
- **`hairline-grid`** — 1px lines at `rgba(45,212,191,0.08)` used in tables and rate sheets (the "financial ledger" motif).
- **`data-stream`** — 2px path with `grad-sea-line` + animated dash offset + soft outer glow; the connective tissue of every flow visual.
- **`focus-ring`** — `0 0 0 2px var(--void), 0 0 0 4px var(--sea-400)` — visible on all backgrounds, 3:1+ against both dark and light.
- **`noise-layer`** — 3% film grain SVG overlay on hero/3D only; kills banding in dark gradients (subtle but essential for a "cinematic" feel).

**Elevation shadow scale (dark-theme specific — shadows must be deep and wide, not grey):**
`--sh-1: 0 1px 2px rgba(0,0,0,.4)` · `--sh-2: 0 4px 16px rgba(0,0,0,.45)` · `--sh-3: 0 12px 32px rgba(0,0,0,.5)` · `--sh-4: 0 24px 64px rgba(0,0,0,.6)` · `--sh-glow: 0 0 32px rgba(45,212,191,.25)`

## 3.4 Typography system

### 3.4.1 Typefaces (all open-source, self-hosted, subset)

| Role | Family | Weights | Why |
|---|---|---|---|
| **Structural / headings / UI** | **Plus Jakarta Sans** | 400, 500, 600, 700, 800 | Locked in v1; geometric-humanist, modern, premium; excellent at large sizes |
| **Numeric / financial data** | **Space Grotesk** | 400, 500, 700 | Locked in v1; distinctive numerals, tabular-friendly, "instrument panel" character |
| **Bangla** | **Hind Siliguri** | 400, 500, 600, 700 | Locked in v1; clean Bangla rendering, good x-height match with Jakarta |
| **Long-form editorial (optional, insights only)** | **Newsreader** or **Source Serif 4** | 400, 500 | Gives insights a magazine feel and separates "reading" from "operating" |
| **Monospace (code/API keys/SRO numbers)** | **JetBrains Mono** | 400, 500 | For `SRO 123/AIN/2025` style refs and API docs |

**Loading strategy:** `next/font` self-hosted, `woff2`, subset `latin` + `bengali`, `display: swap`, preload only the 2 critical weights (Jakarta 600, Space Grotesk 500), everything else lazy. Total font budget ≤ 180 KB. Bangla font loads only when `lang="bn"` is active or content contains Bangla (measured: Bangla subset is heavy).

### 3.4.2 Type scale (fluid, `clamp()` based, 1.25 major-third-ish with tuned steps)

| Token | Size (min→max) | Line-height | Weight | Letter-spacing | Use |
|---|---|---|---|---|---|
| `--fs-display` | 44 → 88px | 0.98 | 800 | −0.03em | Hero headline, signature section titles |
| `--fs-h1` | 36 → 60px | 1.05 | 700 | −0.02em | Page H1 |
| `--fs-h2` | 28 → 42px | 1.12 | 700 | −0.015em | Section headings |
| `--fs-h3` | 22 → 30px | 1.2 | 600 | −0.01em | Card/section sub-heads |
| `--fs-h4` | 18 → 22px | 1.3 | 600 | −0.005em | Minor headings, panel titles |
| `--fs-body-lg` | 17 → 19px | 1.65 | 400 | 0 | Lead paragraphs, service intros |
| `--fs-body` | 15 → 16px | 1.7 | 400 | 0 | Default body |
| `--fs-sm` | 13 → 14px | 1.6 | 400/500 | 0.005em | Secondary, table cells |
| `--fs-xs` | 11 → 12px | 1.5 | 500 | 0.02em | Captions, timestamps, badges |
| `--fs-metric-xl` | 32 → 52px | 1.0 | 500 (Space Grotesk) | −0.02em, **tabular-nums** | Dashboard hero KPIs |
| `--fs-metric` | 22 → 32px | 1.05 | 500 | −0.01em, tabular | KPI tiles, tool results |
| `--fs-metric-sm` | 16 → 20px | 1.1 | 500 | 0, tabular | Inline figures, table numbers |
| `--fs-overline` | 10 → 12px | 1.2 | 600 | **0.14em UPPERCASE** | Section eyebrows ("COMPLIANCE", "01 — ACCOUNTING") |

**Rules:** max measure 68ch for prose (Bangla 58ch); never justify text; numbers always tabular; currency symbol rendered at 0.6em with slight optical raise; headings never all-caps except overlines; keep ≥2 weight steps between a heading and its body.

### 3.4.3 Bangla typography rules

Bangla needs +1–2px size and +0.05 line-height vs Latin for equal readability. Bangla headings use 600–700 (never 800 — strokes collide). Avoid letter-spacing on Bangla (breaks conjuncts). Mixed-script lines: set Bangla first in fallback stack so conjuncts render in Hind Siliguri. Test strings: `উৎসে কর`, `মূসক ৯.১`, `ভ্যাট রিটার্ন`, `৳১২,৩৪,৫৬৭`, `এসআরও নং ১৭৩-আইন/২০২৫`.

## 3.5 Spacing, grid & layout

**Base unit 4px; scale:** `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 200` (tokens `--space-1…--space-15`).

**Containers:** `max-w-content: 1200px` (default), `max-w-wide: 1440px` (hero, money-flow, dashboards), `max-w-reading: 720px` (articles). Fluid gutters: 20px (mobile) → 32px (tablet) → 48px (desktop).

**Grid:** 12-col desktop / 8-col tablet / 4-col mobile, `gap: 24px` desktop, 16px mobile.

**Vertical rhythm:** section padding `clamp(72px, 10vw, 160px)`; heading→body gap 16px; card internal padding 24–32px; table row height 52px (comfortable) / 40px (compact mode).

**Layout archetypes (reused — this is what makes the site feel like one product):**
1. `Split-Hero` (60/40 with 3D right)
2. `Editorial-Flow` (centered overline → H2 → lead → interactive canvas full-bleed)
3. `Bento-Intelligence` (asymmetric 2–4 tile grid, mixed sizes — used for dashboards and platform tours, *not* the classic 3-equal-cards row)
4. `Ledger-Table` (dense data with sticky header, filters, and inline actions)
5. `Rail-Cards` (horizontal snap-scroll for tools/industries on mobile, grid on desktop)
6. `Story-Scroll` (pinned element + scroll-driven narrative — hero and money-flow only)
7. `Console-Split` (portal: fixed rail + fluid content)

**Anti-patterns (forbidden):** three identical feature cards in a row; centered hero with a stock photo; "Our Services" 2×2 icon grid; carousel autoplay; full-width testimonial slider with dots; footer sitemaps of 60 links.

## 3.6 Component library (DhakaFin Design System — "DFDS")

Each component is specified with: anatomy · states · sizes · tokens · behaviour · a11y notes. Full Figma/code parity required. Components marked ⭐ are signature (must feel unique to DhakaFin).

| # | Component | Variants | Notes |
|---|---|---|---|
| 1 | **Button** | primary (sea-500 + dark text), secondary (outline), ghost, gold (regulatory), danger, link; sizes sm/md/lg | ⭐ **Magnetic** on hover (max 6px translate, springs back), 40ms press scale to 0.98, loading spinner swaps in-place, never changes width |
| 2 | **Input / Field** | text, number (with `৳` prefix), phone (+880 mask), email, select, combobox, textarea, file drop, date, OTP | ⭐ Animated label lift, numeric keypad on mobile, thousand-separator live formatting, inline validation with icon+text, error shake ≤120ms |
| 3 | **Card** | context card, glass KPI card, media card, action card, insight card | ⭐ `metal-edge` token; hover lifts 2px + border brightens + optional radial spotlight following cursor (desktop only) |
| 4 | **KPI Tile** | with delta, with sparkline, with progress ring, with qualifier line | ⭐ **Never a bare number** — always: value, delta (arrow + %), qualifier sentence ("Growth accelerating"), driver note, timestamp. See §5 F7 |
| 5 | **Table / Ledger** | default, compact, sticky-header, selectable, expandable rows, grouped | Zebra at 2%, hairline grid, tabular numerals, right-align figures, column pinning, CSV export, empty state |
| 6 | **Chart kit** | line, area, bar, stacked bar, waterfall, donut, radial gauge, heat calendar, sankey/flow, sparkline, bullet | Unified axis/legend/grid styling; animated draw-in 700ms; hover crosshair with shared tooltip; **always** has a data-table toggle for a11y |
| 7 | **Rate Card** ⭐ | compact, detailed, comparison, superseded | The most important content component in the product — see §5 F4 spec |
| 8 | **Deadline Item** ⭐ | calm (T-30+), approaching (T-7), urgent (T-1), overdue, completed | Colour + icon + label; timeline bar shows days remaining; "Mark handled" inline action |
| 9 | **Flow Node** ⭐ | default/hover/active/related/dimmed | Used in money-flow, cost-efficiency, service ecosystem; animated data-stream connectors; keyboard navigable (arrow keys move between nodes) |
| 10 | **Tabs / Segmented** | underline, pill, segmented control | Underline animates between tabs (FLIP); query-param sync so states are shareable |
| 11 | **Badge / Chip / Pill** | status, category, SRO ref, effective-date, filter-chip (removable) | Gold reserved for regulatory; never more than 3 chips per row |
| 12 | **Alert / Banner** | info, success, warning, danger, regulatory-update, offline | ⭐ Stripe-style top banner for "Rates updated: {date}" with link to changelog |
| 13 | **Modal / Dialog** | confirm, form, calculator embed, media, full-screen (mobile) | Focus trap, ESC close, scroll-lock, `aria-modal`, entry 220ms scale+blur |
| 14 | **Drawer / Sheet** | right, bottom (mobile), full | For filters, service detail, node detail |
| 15 | **Command Palette** ⭐ | ⌘K / `/` | Fuzzy search + grouped results + keyboard-first + recent + actions; the site's power feature |
| 16 | **Tooltip / Popover** | definition, glossary, metric explainer, chart detail | Glossary-linked tooltips everywhere a statutory term appears |
| 17 | **Progress / Stepper** | line, ring, multi-step wizard (diagnostic, quote, onboarding) | Shows "Step 3 of 6" + estimated time remaining |
| 18 | **Accordion / Disclosure** | rate detail, FAQ, service inclusions | Single-open default; deep-linkable |
| 19 | **Empty State** ⭐ | no-data-yet, no-results, premium-locked, error | Never a sad-face illustration — instead a mini-guidance card with the exact next action |
| 20 | **Skeleton / Loader** | shimmer, chart skeleton, table skeleton, brand loader | Brand loader = animated DhakaFin glyph drawing a rising line (§4.7) |
| 21 | **Toast / Notification** | success, error, info, undo, action-required | Bottom-right desktop, top mobile; auto-dismiss 6s except errors; stack max 3 |
| 22 | **Upload Zone** | drag-drop, click, camera (mobile), bulk | ⭐ Shows per-file progress, virus-scan state, checksum verified, category auto-suggest |
| 23 | **Pricing Table** | 4 tiers, comparison mode, annual toggle | Transparent, no "Contact us" for 3 of 4 tiers |
| 24 | **Testimonial / Quote block** | card, inline, video, metric-led | Metric-led is preferred: "Cut procurement cost 11% in 2 quarters" |
| 25 | **Case Study Card** | challenge/intervention/result | Always with industry + measurement method footnote |
| 26 | **Service Node** ⭐ | ecosystem map, list item, detail panel | §5 F6 |
| 27 | **Insight Card (AI)** ⭐ | severity-tinted, explainable, actionable | Every AI insight shows *why* + *source data* + *recommended action* |
| 28 | **Document Row** | vault list item | Icon, category, size, uploaded-by, expiry, actions (preview, download, versions, share-link with expiry) |
| 29 | **Data Table Filter Bar** | combined search + chips + saved views | Saved views per user; shareable via URL |
| 30 | **Breadcrumb** | inline, compact | Always present ≥ level 2; matches BreadcrumbList schema |
| 31 | **Footer** | full, compact (portal) | See §2.3 |
| 32 | **Sticky CTA Bar** | mobile only | "Book a Consultation" + "Call" — appears after 60% scroll, never covers content |
| 33 | **Comparison Slider** ⭐ | year-over-year rate compare | Drag handle between two rate tables/years |
| 34 | **Search Field** | inline, command, scoped | Instant results with type badges (Rate/Tool/Service/Article) |
| 35 | **Timeline** | compliance history, service progress, audit trail | Vertical on mobile, horizontal on desktop |
| 36 | **Avatar / Identity chip** | user, business, team member | Business chip shows entity type + TIN last 4 |
| 37 | **System status strip** | portal | "All systems normal · Last sync 4 min ago" — trust builder |

**Component quality gate:** every component must define hover, focus-visible, active, disabled, loading, error, empty, and reduced-motion states before it ships. Missing states = task not done.

## 3.7 Iconography

- **Style:** 1.5px stroke, 24px grid, rounded caps, geometric — a single custom set built on Lucide as the base, with **12 bespoke DhakaFin icons** drawn for domain concepts: *Mushak form, SRO scroll, audit stamp, procurement crate, TDS droplet, cash-flow loop, VDS shield, cost-leak funnel, compliance calendar-BD, intelligence spark, ledger book, VAT invoice*.
- **Rules:** icons never carry meaning alone (always pair with text); financial icons must be unambiguous (no generic "coins" for tax); two-tone allowed via `currentColor` + 30% accent; size tokens 16/20/24/32; inconsistent icon sets are a design-review failure.
- **Logos/wordmark:** custom lettering for "DhakaFin" with the `৳`-inspired vertical stroke detail on the "D"; monogram "DF" for favicons/PWA/app icon (maskable, 512px, on `--void`).

## 3.8 Data visualisation language

**Chart principles:** (1) show the *decision* the chart supports in its title ("Payroll grew 2× faster than revenue"); (2) prefer fewer series (≤4); (3) annotate the important point; (4) always provide the underlying numbers; (5) animate the draw, not the data.

**Series palette (in order):** `#2dd4bf` (sea-400) · `#22d3ee` (cyan) · `#d97706` (gold, for cost/leakage) · `#94a3b8` (neutral) · `#f87171` (danger) · `#7c6cf0` (AI only). Sequential: sea-700 → sea-200. Diverging: sea-400 ↔ gold-400.

**Chart types by job:**
| Job | Chart | Never use |
|---|---|---|
| Trend vs benchmark | Line/area with comparison ghost line | Pie |
| Composition over time | Stacked bar (max 4 + "Other") | Donut |
| Single-part-of-whole | Progress ring / bullet | Pie with 6 slices |
| Money flow | Sankey / animated flow map (signature) | Tree map on mobile |
| Variance (budget vs actual) | Waterfall + variance bars | Radar |
| Compliance status | Heat calendar (month × obligation) | Gauge |
| Cost leakage | Funnel + stacked bars | — |
| Ranking | Horizontal bars sorted, with delta arrows | 3D bars (never) |

**Accessibility:** every chart has an accessible `<table>` fallback, a text summary (`aria-describedby`), a legend that is always visible (not hover-only), and patterns/line-styles as secondary encoding. No 3D perspective charts, ever (misleading).

## 3.9 The "3D → 10D" experience model (concrete, budgeted, non-hand-wavy)

The concept asks for "3D to 10D". Interpretation: **a stacked enhancement model** — each "dimension" is a technical capability layer we deliberately add, with its own budget, fallback, and gate. Nothing here is literal physics.

| Dim | Capability layer | Concrete implementation | Where it appears | Performance budget | Fallback |
|---|---|---|---|---|---|
| **3D** | Real depth | WebGL scene (React Three Fiber): floating financial entities (revenue orb, expense cluster, tax ingot, profit core) with PBR-ish materials, soft shadows, DOF-lite | Hero (F1), Money-flow (F2) | ≤ 2.5 MB scene payload, ≤ 3.5 s to interactive on mid Android, 60fps desktop / 30fps mobile | Static high-quality WebP poster + CSS parallax + SVG flow diagram (identical content) |
| **4D** | Time & motion | Motion system: entrances, state transitions, morphs, data-draw animations, magnetic interactions | Everywhere | 60fps; no layout thrash; JS animation budget ≤ 250 KB gzip | Instant state swaps |
| **5D** | Scroll narrative | GSAP + ScrollTrigger pinned sequences, parallax layers, scrub-linked charts | Hero, money-flow, cost-efficiency story, platform tour | Max 2 pinned sections per page; `will-change` discipline; kill on `prefers-reduced-motion` | Static sequential sections with the same content, graceful fade-ins only |
| **6D** | Interactive data environment | Live charts driven by real DB rates/formulas; node selection changes data, service CTA, and charts simultaneously | Rate hub, tools, money-flow, dashboards | Chart updates ≤ 16 ms; data cached | Server-rendered default state |
| **7D** | Context-aware adaptation | Device/network/context responsiveness: `deviceMemory`, `hardwareConcurrency`, `navigator.connection.saveData`, viewport, input type, locale (en/bn), `prefers-reduced-motion`, `prefers-contrast`; personalization by persona (industry/turnover band from profile) | Site-wide, portal home | Adaptive quality tiers: `ultra` (WebGL high), `high`, `balanced`, `lite` (no WebGL, no blur) | `lite` tier is fully functional |
| **8D** | Intelligence layer | AI insights, "Ask DhakaFin", anomaly detection, personalized recommendations, adaptive content (home hero variant by persona, diagnostic-driven CTAs) | Portal, diagnostic, assistant, home (returning visitors) | AI response ≤ 4 s p50; streaming UI | Curated rule-based recommendations |
| **9D** | Cross-section continuity | Interactions ripple across the interface: selecting a node in money-flow updates the sticky insight rail, the related-service card, URL state and the CTA; shared global state (filters, business context, fiscal year) persists across pages; page→page morph transitions | Signature experiences, portal | State updates ≤ 8 ms; no full re-render | Independent components with same data |
| **10D** | Unified ecosystem | The whole experience feels like one organism: shared design tokens, shared motion language, shared data layer, consistent voice, and a single narrative thread from Google search → rate page → tool → diagnostic → portal → advisory → growth. Measured by **journey continuity** (no dead ends, every surface hands off with context) | Product-wide | — | — |

**Quality tiers (auto-detected at runtime, top-down first match wins):**

| Tier | Condition | What's enabled |
|---|---|---|
| `ultra` | desktop, ≥8 GB RAM signal, WebGL2, fast connection, no reduced-motion | Full WebGL scene, high particle count, post-processing (bloom off/on-lite), all scroll storytelling, spotlights |
| `high` | desktop mid-range or high-end mobile | WebGL with reduced DPR (≤1.5), fewer particles, simplified materials, no post-processing |
| `balanced` | mid mobile / saveData false but slow conn | WebGL at 1.0 DPR, static-ish scene (slow rotation only), CSS-only micro-interactions, no pinned scroll |
| `lite` | low-end mobile, `saveData`, reduced-motion, WebGL unavailable, or user toggle | No WebGL, no blur (solid surfaces), instant transitions, SVG/gradient visuals, full functionality |

Implementation: a single `useExperienceTier()` hook (client) + server-side UA hints; tier is exposed to components via context and stored in a cookie; a visible "Reduce effects" toggle in the footer (and portal settings) switches to `lite` permanently — this doubles as the accessibility escape hatch.

## 3.10 Motion & interaction language ("DhakaFin Motion")

**Motion principles:** *Ingest → Settle → Respond.* Entrances convey arrival (fade + rise + subtle blur-out). State changes convey continuity (morph, not cut). Feedback conveys causality (the thing you touched reacts).

**Three-layer motion model:** **Layer 1 (Structure)** page/section transitions, 400–800 ms, ease `cubic-bezier(.22,1,.36,1)`; **Layer 2 (Component)** hover/expand/select, 120–240 ms; **Layer 3 (Detail)** icon swap, ripple, number count, 60–160 ms. Never let Layer 3 exceed Layer 2 duration (that's what makes UIs feel sloppy).

**Duration & easing tokens:**
| Token | Value | Use |
|---|---|---|
| `--dur-1` | 120ms | Micro-feedback, hover colour |
| `--dur-2` | 200ms | Dropdowns, chips, tabs |
| `--dur-3` | 320ms | Cards, panels, drawers |
| `--dur-4` | 560ms | Section reveals |
| `--dur-5` | 900ms | Hero/story sequences |
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` | Entrances (expo-out feel) |
| `--ease-in-out` | `cubic-bezier(.65,0,.35,1)` | Exits/loops |
| `--ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | Magnetic buttons, node snap (used sparingly — max 2 places) |
| `--ease-linear` | `linear` | Data-stream dash offset, progress |

**Stagger rules:** list children 40–70 ms apart, capped at 8 items (rest instant). Section reveals use `IntersectionObserver` at 20% threshold, `once: true`.

**Signature motions (the ones users remember):**
1. **Data Stream** — flows along money-flow connectors: 2px `grad-sea-line` path with `stroke-dasharray` animation + leading glow dot; direction inverts when a value is negative (outflow).
2. **Number Count-Up** — KPI values count from 0 with tabular digits, 700 ms, ease-out; disables under reduced-motion (shows final value instantly).
3. **Ledger Reveal** — table rows slide in with a 1px accent line that draws left→right, like ink on a ledger.
4. **Node Focus Ripple** — selecting a flow node sends a subtle pulse along connected edges, dimming unrelated nodes to 30%.
5. **Magnetic CTA** — primary buttons drift ≤ 6px toward cursor (desktop, `ultra`/`high` only).
6. **Spotlight Card** — radial gradient follows pointer inside a card (desktop only, GPU-cheap, disabled on `balanced`).
7. **Command Palette Bloom** — palette opens from the search field with scale 0.98→1 + blur 8→0, results stagger 30 ms.
8. **Chart Draw** — path length animation with gradient mask; area chart masks upward.
9. **Rate Update Pulse** — when a rate changes, its row briefly shows a gold "Updated" sweep + the previous value ghosted beside it.
10. **Page Continuity Morph** — shared elements (e.g. a service node → service page hero) morph via View Transitions API where supported.

**Forbidden motions:** parallax on text (nausea), autoplaying carousels, bounce/elastic on data, spinner over 400 ms without a skeleton first, background video loops, cursor-following custom cursors on data tables, anything that moves > 600 ms without user intent.

**Reduced motion contract (`prefers-reduced-motion: reduce` or `lite` tier):** all scroll-scrubbed animation → static final state; all loops stop; all fades ≤ 100 ms with no translate; charts render complete immediately; WebGL disabled; number count-up replaced with direct values. **Non-negotiable and tested in CI via a Playwright reduced-motion project.**

## 3.11 Design token architecture (single source of truth)

`tokens/df.tokens.json` → build script → `tokens.css` (CSS custom properties) + `tailwind.tokens.js` (Tailwind v4 `@theme`) + `tokens.ts` (typed TS constants for JS/Three.js) + optional Figma variables export. **Never hardcode a hex, size or duration in a component.**

```jsonc
// tokens/df.tokens.json  (excerpt — full file in Appendix B)
{
  "color": {
    "void":        { "value": "#020b0a" },
    "voidDeep":    { "value": "#010807" },
    "surface1":    { "value": "#061715" },
    "surface2":    { "value": "#0a1f1c" },
    "surface3":    { "value": "#0f2a26" },
    "glassTint":   { "value": "rgba(8,30,27,0.65)" },
    "sea": { "700": {"value":"#0d9488"}, "600": {"value":"#0f9e93"},
             "500": {"value":"#14b8a6"}, "400": {"value":"#2dd4bf"},
             "300": {"value":"#5eead4"}, "200": {"value":"#99f6e4"} },
    "cyan":  { "value": "#22d3ee" },
    "gold":  { "value": "#d97706", "bright": { "value": "#fbbf24" } },
    "text": { "value": "#e2e8f0" }, "textStrong": { "value": "#f8fafc" },
    "muted": { "value": "#94a3b8" }, "muted2": { "value": "#64748b", "$restricted": "decorative only" },
    "ok": { "value": "#34d399" }, "warn": { "value": "#fbbf24" },
    "risk": { "value": "#fb923c" }, "danger": { "value": "#f87171" }
  },
  "space": { "1":"4px","2":"8px","3":"12px","4":"16px","5":"20px","6":"24px","8":"32px",
             "10":"40px","12":"48px","16":"64px","20":"80px","24":"96px","30":"128px" },
  "radius": { "sm":"8px","md":"12px","lg":"16px","xl":"20px","2xl":"28px","full":"9999px" },
  "font": {
    "sans": { "value": "'Plus Jakarta Sans', 'Hind Siliguri', system-ui, sans-serif" },
    "num":  { "value": "'Space Grotesk', 'Plus Jakarta Sans', ui-monospace, monospace" },
    "bn":   { "value": "'Hind Siliguri', 'Plus Jakarta Sans', sans-serif" },
    "mono": { "value": "'JetBrains Mono', ui-monospace, monospace" }
  },
  "duration": { "1":"120ms","2":"200ms","3":"320ms","4":"560ms","5":"900ms" },
  "ease": {
    "out":    { "value": "cubic-bezier(.16,1,.3,1)" },
    "inOut":  { "value": "cubic-bezier(.65,0,.35,1)" },
    "spring": { "value": "cubic-bezier(.34,1.56,.64,1)" }
  },
  "blur": { "glass":"16px", "overlay":"24px", "heavy":"32px" },
  "elevation": {
    "1": { "value": "0 1px 2px rgba(0,0,0,.40)" },
    "2": { "value": "0 4px 16px rgba(0,0,0,.45)" },
    "3": { "value": "0 12px 32px rgba(0,0,0,.50)" },
    "4": { "value": "0 24px 64px rgba(0,0,0,.60)" },
    "glow": { "value": "0 0 32px rgba(45,212,191,.25)" }
  }
}
```

**Theme switching:** `:root[data-theme="dark"]` (default) and `[data-theme="light"]` override the same variable names; `[data-tier="lite"]` sets `--blur: 0`, disables glows, and reduces `--dur-*` to ≤ 150 ms.

## 3.12 Responsive & mobile-first strategy

**Breakpoints:** `xs 360` (min supported), `sm 480`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.

**Responsive philosophy (concept §20 — do NOT shrink the desktop site):**

| Concern | Mobile decision |
|---|---|
| Hero 3D | Replaced by an **animated SVG financial-relationships diagram** + gradient depth + a compact scrollable KPI ribbon. Full WebGL never loads on `lite`. On `balanced`, a simplified WebGL scene (static rotation, 1/4 particles) may load *after* first paint. |
| Money-flow | Becomes a **vertical flow with sticky node summary**; tapping a node opens a bottom sheet (not a side panel); flow lines drawn as SVG between stacked cards. |
| Signature scroll sections | Convert to snap-scroll horizontal rails or simple stacked sections with reveal animations; no pinned scrubbing. |
| Tables | Card-per-row transformation (label-value list) OR horizontal scroll with pinned first column; never tiny unreadable tables. |
| Charts | Simplified: fewer series, no crosshair on tap (tap = tooltip), larger touch targets, taller aspect, horizontal bar labels truncated with ellipsis + full value on tap. |
| Navigation | Full-screen bottom-anchored panel; thumb-zone CTAs; back gesture aware. |
| Tools | Single-column inputs, sticky live-result bar at bottom (updates as you type), big numeric keypad, no multi-column grids. |
| Portal | Bottom tab bar: Home · Compliance · Documents · Tasks · More. |
| Forms | One question per screen on mobile wizards; autofill + OTP paste support; inline validation on blur, not on keystroke. |
| Touch targets | ≥ 44×44 px with ≥ 8 px separation. |
| Safe areas | `env(safe-area-inset-*)` respected on notched devices. |
| Performance | Mobile budget is the *hard* budget: LCP ≤ 2.5 s on 4G mid-range Android; total JS ≤ 200 KB gzip for marketing pages (3D chunk lazy-loaded and excluded). |

## 3.13 Accessibility specification (WCAG 2.2 AA — target AA on all public pages, AAA where feasible for text)

| Area | Requirement |
|---|---|
| **Contrast** | Body text ≥ 4.5:1; large text ≥ 3:1; UI components/borders ≥ 3:1; use only audited token pairs (§3.2.7) |
| **Keyboard** | Full operability: skip-link, logical tab order, no traps (except intentional modal traps with ESC), visible focus ring at all times, shortcut map (`⌘K` search, `?` help, `Esc` close) documented on `/help` |
| **Charts & data** | Every chart: `role="img"` + `aria-label` summary + accessible data table toggle + non-colour encoding |
| **Forms** | Programmatic labels, `aria-describedby` for help/error, error summary at top on submit, no placeholder-only labels, autocomplete attributes, OTP input with `inputmode="numeric"` |
| **Motion** | `prefers-reduced-motion` honoured; no flashing > 3 Hz; no motion without user control |
| **Screen readers** | Semantic landmarks, heading hierarchy (one H1), live regions for async results (`aria-live="polite"` for calculator outputs, `assertive` for errors), descriptive link text ("View TDS rates", never "click here") |
| **Zoom/reflow** | Usable at 200% zoom and 320px width without horizontal scroll (tables get scroll containers) |
| **Touch/pointer** | 44px targets; no hover-only affordances; pointer gestures have single-pointer alternatives |
| **Language** | `lang` attribute per content block (`bn` for Bangla text) |
| **Cognitive** | Plain-language mode for legal/tax explanations (short sentences, glossary tooltips, "what this means for you" boxes) |
| **Testing** | axe-core in CI on key routes; manual NVDA + VoiceOver pass per phase; keyboard-only pass per phase; automated contrast check against tokens |

## 3.14 Performance budget (enforced in CI, per page type)

| Page type | LCP | INP | CLS | Total JS (gzip) | Images | WebGL |
|---|---|---|---|---|---|---|
| Marketing (home, services, industries) | ≤ 2.5 s | ≤ 200 ms | ≤ 0.05 | ≤ 200 KB (excl. lazy 3D) | ≤ 900 KB total, AVIF/WebP | Lazy, post-interactive, ≤ 2.5 MB |
| Rate hub / compliance calendar | ≤ 2.0 s | ≤ 150 ms | ≤ 0.02 | ≤ 150 KB | minimal | none |
| Tools | ≤ 2.5 s | ≤ 200 ms (input latency ≤ 50 ms) | ≤ 0.05 | ≤ 220 KB | minimal | none |
| Portal (authenticated) | ≤ 2.5 s | ≤ 200 ms | ≤ 0.05 | ≤ 300 KB | lazy | none (charts only, Canvas/SVG) |
| Any page on `lite` tier | ≤ 2.0 s | ≤ 150 ms | ≤ 0.02 | ≤ 120 KB | — | none |

**Techniques:** Next.js App Router with server components by default; route-level code splitting; dynamic import for all 3D/animation libs; `next/image` with AVIF + responsive `sizes`; font subsetting + `font-display: swap`; Redis full-page cache for anonymous rate pages (Laravel) + ISR (Next.js); HTTP/2 + Brotli; CDN in front of static assets; DB indexes on all rate/tool queries; `EXPLAIN` review for any query > 20 ms; queue everything non-blocking (emails, PDFs, AI, thumbnails); Lighthouse CI budget file committed to the repo; bundle-size check in CI fails the build on regression > 5%.

## 3.15 Voice, tone & content style

| Context | Voice | Example |
|---|---|---|
| Headlines | Confident, plain, benefit-first | "Make Better Financial Decisions." / "Your Biggest Cost May Be the One You Don't See." |
| Explanations | Teacher, not lawyer | "VDS is VAT deducted at source — when you pay a service provider, you withhold their VAT and deposit it." |
| Errors | Calm, specific, with the fix | "We couldn't read that PDF. Try a scanned copy or enter the amount manually." Never "Error 500". |
| Compliance/urgency | Calm authority, never fear | "VAT return (Mushak 9.1) is due on 15 October — 6 days left. Upload the sales register to let us file." |
| Legal/disclaimer | Precise, short, linked | "This is general information based on NBR sources, not professional advice for your specific case." |
| Bangla | Simple, respectful, no slang | "আপনার ব্যবসার জন্য সঠিক সিদ্ধান্ত নিতে সাহায্য করি।" |

**Style rules:** short sentences; active voice; second person ("you/your business"); define a statutory term on first use with a glossary tooltip; never use "utilize", "leveraging", "cutting-edge" or "world-class" in customer-facing copy; numbers with units always (`৳12.5 L`, `18.4%`, `FY 2025–26`); no exclamation marks in financial messaging; every claim must be verifiable or clearly framed as an estimate.
---

# 4. SYSTEM ARCHITECTURE, TECH STACK & ENGINEERING STANDARDS

## 4.1 Stack (locked — do not substitute casually; every change needs an ADR)

| Layer | Choice | Version | Why this, not the alternative |
|---|---|---|---|
| **Marketing + Tools + Rate Hub** | Next.js (App Router) + TypeScript + React | Next 15 / React 19 / TS 5.x | SSG/ISR for SEO on hundreds of rate/tool pages; best 3D + animation ecosystem; user's stack |
| **Styling** | Tailwind CSS v4 + CSS custom properties + tokens build | v4 | Token-driven, no runtime CSS-in-JS cost |
| **3D / WebGL** | React Three Fiber + drei + three.js (+ custom GLSL shaders) | three r16x | Declarative, tree-shakeable, lazy-loadable |
| **Animation** | GSAP + ScrollTrigger (signature scroll), Motion (Framer Motion) for UI state, Lenis for smooth scroll (opt-out-able) | latest | GSAP = best scroll control; Motion = best React state transitions |
| **Charts** | Recharts or Visx for standard charts; custom SVG/Canvas for signature flows & Sankey | — | Avoid heavy chart libs; full token control |
| **Command palette / search UI** | `cmdk` + server search endpoint | — | Keyboard-first, small |
| **Portal (app.dhakafin.com)** | Two viable paths → **choose one in Phase 0 (ADR-011)**: (a) Next.js frontend consuming the Laravel JSON API (recommended for design control); (b) Laravel + Inertia + React (faster if team is Laravel-centric) | — | (a) is recommended for design parity with marketing; (b) is recommended if only one team exists |
| **Backend API + Admin** | Laravel + Filament | Laravel 12 / PHP 8.3 / Filament v4 | Filament is a hard requirement of the concept; Laravel gives queues, policies, notifications, scheduling |
| **Database** | MySQL 8 (or PostgreSQL 16 if team prefers) | MySQL 8.0.3x | Row-level `business_id` scoping; JSON columns for config; full-text + generated columns for rate search |
| **Cache / Queue / Sessions** | Redis 7 + Laravel Horizon | — | Cache, queue, rate limit, session, lock |
| **Search** | MySQL full-text + `LIKE` fallback in v1 → Meilisearch (Phase 8) if volume demands | — | Avoid Elasticsearch ops burden early |
| **Storage** | S3-compatible object storage (private buckets) | — | Signed URLs, versioning, lifecycle rules |
| **PDF generation** | Laravel: `spatie/laravel-pdf` (Browsershot/Puppeteer) or DomPDF for simple; Reports use HTML→PDF templates matching the design system | — | Invoice/quote/MIS PDFs must look designed |
| **Auth** | Session-based for portal (httpOnly, SameSite=Lax, secure) + optional API tokens (Sanctum); OTP login by phone (primary BD-friendly) + email magic link; TOTP 2FA; WebAuthn (Phase 8) | — | Phone-first login is essential in BD |
| **AI** | Provider-agnostic service layer (`AiProvider` interface) → OpenAI/Anthropic/Gemini; vector store: Postgres pgvector or Qdrant; embeddings over curated corpus + business data snapshots | — | Avoid lock-in; allows cost routing |
| **Notifications** | Laravel Notifications: mail (Postmark/Resend/SES), SMS gateway, WhatsApp Cloud API, database (in-app), web push (VAPID) | — | One `Notifiable` per user, channel fan-out |
| **Payments** | SSLCommerz + bKash/Nagad (BD), Stripe/Paddle (intl), manual bank transfer with proof upload | — | Local reality first |
| **Analytics** | GA4 + PostHog + server-side event relay | — | Marketing + product funnels |
| **Errors / APM** | Sentry (frontend + backend) + Laravel Telescope (dev) + Horizon metrics + UptimeRobot | — | Must know before clients do |
| **CI/CD** | GitHub Actions: lint → typecheck → tests → build → Lighthouse budget → deploy (zero-downtime) | — | Quality gates are the only way "100%" survives |
| **Infra** | VPS (8–16 GB) with Docker Compose **or** Ploi/Forge-managed; Nginx; Let's Encrypt; cloudflare CDN + WAF; daily DB backups to object storage + weekly restore test | — | Cost-effective for BD scale, easy to grow |

## 4.2 Repository structure (monorepo)

```
dhakafin/
├── apps/
│   ├── web/                        # Next.js — marketing, rates, tools, experiences
│   │   ├── app/
│   │   │   ├── (marketing)/        # home, services, industries, about, pricing…
│   │   │   ├── (intelligence)/     # rates, sro, circulars, compliance-calendar, insights
│   │   │   ├── (tools)/tools/[tool]/
│   │   │   ├── (experiences)/money-flow/, cost-efficiency/, diagnostic/, platform/
│   │   │   ├── api/                # BFF route handlers (search, alerts, lead capture, og-image)
│   │   │   ├── sitemap.ts, robots.ts, manifest.ts
│   │   ├── components/
│   │   │   ├── ui/                 # DFDS primitives (button, card, table, tabs…)
│   │   │   ├── domain/             # rate-card, flow-node, deadline-item, kpi-tile, insight-card
│   │   │   ├── charts/             # chart kit + signature visualisations
│   │   │   ├── three/              # R3F scenes (hero, money-flow, cost-funnel)
│   │   │   └── layouts/
│   │   ├── lib/                    # api client, formatters (formatBDT), analytics, seo, hooks
│   │   ├── content/                # MDX fallback / static copy decks (en, bn)
│   │   ├── messages/en.json, bn.json
│   │   └── tests/ (unit: vitest, e2e: playwright)
│   ├── portal/                     # if ADR-011 = (a): separate Next app for app.dhakafin.com
│   │   (or `laravel/resources/js` Inertia pages if ADR-011 = (b))
│   └── api/                        # Laravel 12 application
│       ├── app/
│       │   ├── Actions/            # single-purpose business actions
│       │   ├── Console/Commands/   # rate sync monitor, deadline generator, digest builders
│       │   ├── Domain/             # DDD-lite: Rates/, Compliance/, Tools/, Billing/, Ai/, Documents/
│       │   ├── Filament/           # Resources, Pages, Widgets, Tables, Forms
│       │   ├── Http/Controllers/Api/V1/
│       │   ├── Http/Middleware/    # tenant scope, entitlement, 2FA, rate limit, audit
│       │   ├── Models/
│       │   ├── Policies/           # business_id scoping enforced here
│       │   ├── Services/           # TaxCalculator, VatEngine, LeakageEstimator, AlertFanout, Embeddings
│       │   └── Support/            # Bdt, FiscalYear, SroNumber, MushakForm helpers
│       ├── database/migrations/, seeders/, factories/
│       ├── routes/api.php, web.php, console.php
│       └── tests/ (Feature, Unit, Pest)
├── packages/
│   ├── tokens/                     # tokens/df.tokens.json + build script + generated CSS/TS/Tailwind
│   ├── tax-engine/                 # shared pure TS/PHP calculators + test vectors (single source of truth for formulas)
│   └── ui-icons/                   # custom icon set + Svgo pipeline
├── docs/
│   ├── blueprint/                  # THIS document + appendices
│   ├── adr/                        # ADR-001…ADR-0NN
│   ├── content/                    # copy decks, glossary, Bangla translations
│   └── runbooks/                   # deploy, incident, backup-restore, rate-update SOP
├── infra/
│   ├── docker/ (Dockerfile.web, Dockerfile.api, nginx/)
│   ├── github-actions/
│   └── backups/
└── .github/workflows/ (ci.yml, deploy-web.yml, deploy-api.yml, lighthouse.yml, security.yml)
```

## 4.3 Frontend architecture (Next.js)

- **Rendering map:** marketing & rates → ISR (revalidate 1–24 h, `on-demand revalidation` webhook from Laravel when a rate changes); tools → SSG shell + client island; portal → dynamic/server-rendered behind auth; OG images → edge/server dynamic.
- **Data access:** all DB access via the Laravel API (`/api/v1/*`); Next.js uses `fetch` with `next: { revalidate, tags }`. Tags allow surgical revalidation: `revalidateTag('rate:tds')` after an admin update. **No direct DB connections from Next.js.**
- **State:** server state via TanStack Query (portal), UI state via Zustand (small, scoped), URL as state for all shareable filters/tabs (search params), business context in a React context provider for the portal.
- **Forms:** React Hook Form + Zod schemas shared with the API contract; optimistic UI for tasks/notes; server validation as source of truth.
- **i18n:** `next-intl` with `en`/`bn` message files; number/date formatting through `formatBDT`/`formatDate` helpers (Bangladeshi lakh-crore grouping via `Intl.NumberFormat('en-IN')` wrapper + custom compact logic).
- **Error handling:** error boundaries per route group with art-directed fallbacks; Sentry; offline banner.
- **SEO plumbing:** `generateMetadata` per route, JSON-LD builders per content type, dynamic `sitemap.ts` fed by the API, `robots.ts` with environment rules (never index `app.` or `admin.`).
- **Accessibility plumbing:** `A11yProvider` for reduced-motion/tier detection, skip-links in root layout, focus management on route change, live regions in tool results.
- **Testing:** Vitest for logic (especially the tax engine), Testing Library for components with a11y assertions, Playwright E2E (desktop + mobile + reduced-motion projects), visual regression snapshots on key components (Playwright screenshots, threshold 0.1%).

## 4.4 Backend architecture (Laravel)

- **Domain orientation:** `Domain/{Rates, Compliance, Tools, Documents, Billing, ServiceDelivery, Ai, Crm}` each with Actions, Data objects (spatie/laravel-data), and Services. Controllers stay thin.
- **Multi-tenancy:** single database, **row-level `business_id` scoping** enforced by: (1) a global scope on tenant models, (2) policies checking membership, (3) a middleware that binds the active business from the route/session and never trusts a client-supplied `business_id`, (4) tests that attempt cross-tenant access and must receive 403/404.
- **Entitlements:** `EntitlementService` reads the subscription plan limits; feature gates (`vault.storage`, `assistant.queries`, `reports.advanced`) checked via middleware/policy. Every gate has a friendly upgrade state in the UI.
- **Rate engine:** `RateRepository` resolves the applicable rate for `(family, section/context, taxpayer_type, date)` with an `effective_from ≤ date < effective_to` rule, returns the full provenance (SRO, verified_by, verified_at). **All calculators call this — no calculator may hardcode a rate.** This is how §23's "do not hardcode regulatory information" is enforced architecturally.
- **Compliance engine:** `DeadlineGenerator` reads `ComplianceDeadline` templates + business profile → materializes per-business `ComplianceObligation` rows (idempotent, safe to re-run); `DeadlineScheduler` enqueues alerts per the cadence in §2.7.
- **Notification fan-out:** `NotificationDispatcher` with per-channel adapters, dedupe keys, quiet hours, and delivery logs (opens/clicks).
- **AI service:** `AiProvider` interface (chat + embeddings), `RetrievalService` over curated corpus (`KnowledgeChunk` with pgvector), `PromptRepository` (versioned prompt templates), `GuardrailService` (block unverifiable legal claims, force citations, PII redaction), `CostTracker` (per-business token/usage ledger + hard caps).
- **Files/documents:** uploads → virus scan queue (ClamAV) → checksum → private bucket → `Document` row; **all access via signed URLs (5–15 min TTL)**; every download writes an `AuditLog` and a `document_access` analytics event.
- **PDF pipeline:** queued job renders HTML (Blade with the DFDS print stylesheet) → PDF → stored + emailed; templates: invoice, quote, MIS report, tax computation, compliance summary, VDS certificate (Mushak 6.6-aligned layout as applicable).
- **Scheduling:** `schedule:run` tasks — rate freshness monitor, deadline materialization, alert cadence, digest builders (weekly insights email), subscription renewals/retries, storage cleanup, backup verification, SRO source watcher.
- **API conventions:** `/api/v1`, JSON:API-lite envelopes `{ data, meta, links }`, cursor pagination for large lists, `?include=` for relations, idempotency keys on all POSTs that create money-related records, RFC7807 problem+json errors, rate limiting per token/route, API versioning policy (breaking changes → `/v2`), OpenAPI 3.1 spec generated and published.
- **Testing:** Pest feature tests per endpoint (auth, tenant isolation, validation, happy path), unit tests for tax formulas with **published test vectors** (rounding rules, edge cases: TDS on ৳0, VAT inclusive/exclusive, slab boundaries, surcharge), snapshot tests for PDFs, `phpstan` level 6+, Pint formatting, `composer audit` in CI.

## 4.5 API surface (v1 — representative, not exhaustive)

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/v1/rates?family=tds&section=89&date=2026-09-20` | public | Resolve rate(s) with provenance |
| `GET` | `/api/v1/rates/{family}/changes?since=` | public | Changelog for alerts and freshness display |
| `GET` | `/api/v1/tax-slabs?year=&taxpayer_type=` | public | Slabs for calculator + table |
| `GET` | `/api/v1/sros?year=&q=` · `/api/v1/sros/{slug}` | public | SRO library |
| `GET` | `/api/v1/deadlines?entity_type=&vat_registered=&month=` | public | Compliance calendar |
| `POST` | `/api/v1/tools/{tool}/calculate` | public (rate-limited) | Server-side authoritative calculation + audit trail of anonymous usage |
| `POST` | `/api/v1/leads` | public | Lead capture (source, UTM, honeypot, Turnstile) |
| `POST` | `/api/v1/diagnostic/submit` · `GET /api/v1/diagnostic/{token}` | public | Diagnostic result (shareable token, expires 90 days) |
| `POST` | `/api/v1/rate-alerts/subscribe` | public-ish | Email/WhatsApp subscription w/ double opt-in |
| `GET` | `/api/v1/search?q=` | public | Unified search (rates, tools, services, insights, SROs) |
| `POST` | `/api/v1/auth/otp/request` · `/verify` | public | Phone-first login |
| `GET` | `/api/v1/me` | auth | Profile + active businesses + entitlements |
| `GET` | `/api/v1/business/{id}/dashboard` | auth+tenant | Dashboard payload (KPIs, trends, alerts, tasks) |
| `GET` | `/api/v1/business/{id}/insights` | auth+tenant | AI insights feed |
| `POST` | `/api/v1/business/{id}/documents` | auth+tenant | Upload (multipart, signed direct-upload flow) |
| `GET` | `/api/v1/documents/{id}/url` | auth+tenant | Signed, time-limited, audited URL |
| `GET/POST` | `/api/v1/business/{id}/tasks` · `/tasks/{id}/complete` | auth+tenant | Task loop |
| `GET/POST` | `/api/v1/business/{id}/requests` | auth+tenant | Service requests |
| `GET` | `/api/v1/business/{id}/compliance` | auth+tenant | Obligations + status + documents needed |
| `POST` | `/api/v1/business/{id}/assistant/ask` | auth+entitlement | AI copilot (streamed SSE) |
| `GET` | `/api/v1/business/{id}/reports` · `POST /reports/{id}/regenerate` | auth+tenant | Reports |
| `GET/POST` | `/api/v1/business/{id}/invoices` | auth+tenant | Billing |
| `POST` | `/api/v1/webhooks/{gateway}` | signature | Payment events |
| `POST` | `/api/v1/internal/rates` | admin token | Rate write from Filament/CLI with verification requirement |

**Contract rules:** every response that includes a rate **must** include `effective_from`, `reference_sro`, `source_url`, `verified_at`; every response that includes money includes `currency: "BDT"` and formatted helper strings; every write is audit-logged; every public POST is rate-limited + bot-protected.

## 4.6 Security architecture

| Domain | Controls |
|---|---|
| **Transport** | TLS 1.3 only, HSTS (preload), no mixed content, secure cookies, `SameSite=Lax`, `HttpOnly`, `Secure` |
| **Auth** | Phone OTP (6-digit, 5-min TTL, 5 attempts, exponential lockout) + optional password; email magic link; TOTP 2FA; session regeneration on privilege change; device/session list with revoke; admin panel requires 2FA (Filament built-in) and IP allowlist option |
| **Authorization** | Policies on every model; role matrix (§5 F11.4) tested; `business_id` never user-supplied on sensitive routes; admin actions on client data are logged and visible to the client ("who accessed my documents") |
| **Input** | Laravel validation everywhere, Form Requests, strict types, prepared statements (no raw user SQL), file MIME+extension+size validation, image re-encoding, virus scan, `Content-Disposition: attachment`, no user HTML rendering (sanitize with HTMLPurifier if ever needed) |
| **XSS/CSRF** | Blade/React escaping by default, CSP with nonces (`default-src 'self'`, explicit allowlist for PostHog/Sentry/gateways), CSRF tokens on state-changing routes, `TrustedTypes` where feasible |
| **Rate limiting** | Per-IP + per-user + per-endpoint; stricter on OTP, login, calculate, assistant, lead submission; Cloudflare bot management + Turnstile on public forms |
| **Secrets** | `.env` never in git; secrets in host/secret manager; key rotation runbook; separate keys per environment; `APP_DEBUG=false` in prod |
| **Data protection** | AES-256 at rest (DB + storage), field-level encryption for sensitive identifiers (TIN/BIN partially masked in UI, full value only to authorized roles), DB backups encrypted, PII redaction in logs (Sentry beforeSend scrubber) |
| **Audit** | `AuditLog` on: auth events, document access, rate changes, subscription changes, admin impersonation (impersonation requires reason + is announced to the client), permission changes, data export/deletion |
| **Compliance posture** | Publish `/security` with concrete statements; data residency documented; retention matrix published; DPA-style clause in Terms for business clients; incident response runbook with 72-hour breach notification commitment |
| **Dependency & appsec** | Dependabot/`composer audit`/`npm audit` in CI, weekly patch window, `phpstan`, secret scanning (gitleaks), Trivy container scan, OWASP Top-10 checklist per phase, annual external pentest before enterprise sales (Phase 8) |
| **Backups/DR** | Nightly DB dump + binlog; daily file storage snapshot; **RPO 15 min / RTO 4 h**; quarterly restore drill with a signed checklist; off-site encrypted copies; backup failure alerting |

## 4.7 Migration, seeding & data integrity

- **Rate seeding:** every rate row ships as a seeded, sourced record. Template CSV in Appendix C: `family, title, section_ref, rate_type, rate_value, base, taxpayer_type, applicability, effective_from, effective_to, reference_sro, source_url, notes`. Seeder validates: no overlapping effective periods for the same key, no missing source, no future-dated verified rows without an SRO reference.
- **Historical data:** seed the last 3 fiscal years for every rate family where retrievable — this powers the comparison view and the changelog, and is a genuine competitive moat.
- **Integrity rules:** unique constraints on `(family, section_ref, taxpayer_type, effective_from)`; `effective_to` must be > `effective_from`; a superseding insert must close the previous row in the same transaction; `verified_by` cannot be null for a `verified` rate.
- **Migrations:** forward-only with rollback scripts where safe; destructive changes require a backup + a documented plan; no schema changes without a matching factory/seeder update.

## 4.8 Background jobs, queues & scheduling

| Queue | Jobs | Priority |
|---|---|---|
| `critical` | Payment webhooks, OTP send, auth emails | Highest |
| `default` | Notifications, deadlines materialization, lead routing, CRM sync | High |
| `documents` | Virus scan, checksum, thumbnail, PDF extraction for AI corpus | Medium |
| `reports` | MIS/invoice/quote PDF rendering | Medium |
| `ai` | Embedding generation, insight generation, assistant pre-computation | Low/Medium with cost caps |
| `maintenance` | Rate freshness monitor, SRO watcher, backups, cleanup, digest builds | Low |

Rate-limit external calls (SMS/WhatsApp/AI) with retry + exponential backoff + dead-letter queue; every job idempotent; Horizon dashboards monitored; failed-job alerting to Slack/email.

## 4.9 Observability, environments & DevOps

- **Observability:** Sentry (errors + performance traces with `business_id` tag), Horizon metrics, Laravel log channels (JSON, shipped off-box), uptime checks on 6 critical URLs, synthetic checks for the "rate freshness" (alert if any rate family's `verified_at` > 45 days), product analytics for feature adoption.
- **Environments:** `local` → `staging` (seeded anonymized data, indexing disabled, mail to Mailtrap) → `production`. Feature flags (Laravel Pennant) for staged rollout of risky features (AI assistant, new dashboards).
- **CI pipeline (every PR):** lint (ESLint, Pint) → typecheck (tsc, phpstan) → unit tests (Vitest, Pest) → build → E2E smoke (Playwright, ~8 critical paths) → Lighthouse budget on 5 key URLs → axe accessibility check → bundle-size guard → security audit. **Red pipeline = no merge.**
- **Deployment:** zero-downtime (atomic symlink or container rolling), migrations run pre-traffic with `--force`, queue workers restarted gracefully, cache warm post-deploy, automatic rollback on health-check failure, deploy log + release notes auto-drafted from commits.
- **Scaling path:** vertical first → then read replica for analytics/reporting → then separate queue workers → then split heavy report generation → then Meilisearch → then per-tenant storage buckets. Documented thresholds for each step.

## 4.10 Third-party integration register

| Integration | Purpose | Phase | Fallback if unavailable |
|---|---|---|---|
| NBR website/PDF sources | Rate & SRO source of truth | 3 | Manual admin entry with source URL (always the baseline) |
| SSLCommerz | Cards + net banking (BD) | 5 | Manual bank transfer + proof upload |
| bKash / Nagad merchant | Mobile wallet subscriptions | 5 | Same as above |
| Stripe / Paddle | International cards, SaaS billing | 8 | Invoice + wire |
| SMS gateway (BD) | OTP + deadline alerts | 5 | Email only |
| WhatsApp Cloud API | Alerts, document requests | 5 | SMS |
| Email provider | Transactional + campaigns | 2 | SMTP fallback with throttle |
| OpenAI/Anthropic/Gemini | Assistant, insights, summarization | 6 | Rule-based insights (pre-authored per industry) |
| ClamAV | Virus scanning | 5 | Disable uploads + manual review queue |
| Google Business Profile / Search Console | Local + SEO ops | 3 | — |
| Cloudflare (CDN/WAF/bot) | Performance + protection | 2 | Nginx rate limits only |
| Accounting imports (CSV/XLSX from Tally/QuickBooks) | Onboarding data | 6 | Manual template upload |
---

# 5. PAGE & FEATURE SPECIFICATIONS

> Format per feature: **Purpose → Route → Structure (wireframe) → Interaction → Data → Copy → Acceptance criteria → Performance & a11y.** If an acceptance criterion cannot be tested by someone else, rewrite it.

---

## F1 — HOMEPAGE: THE SIGNATURE ENTRY EXPERIENCE

**Purpose:** Convince a Bangladeshi business owner within 8 seconds that DhakaFin is a different class of financial platform, and route them to a tool, a diagnostic, or a consultation.

**Routes:** `/` (variant A default; variant B for returning visitors with an industry profile cookie).

### 5.1.1 Homepage section order (locked)

| # | Section | Job | Depth layer |
|---|---|---|---|
| 1 | **Hero — Financial Universe** | Communicate positioning + prove it visually | 3D/5D |
| 2 | Trust ribbon | Immediate credibility (clients, registrations, "rates verified weekly") | Static |
| 3 | **Money-flow teaser** | Pull into the signature experience | 5D/6D |
| 4 | The four pillars (Understand/Control/Comply/Grow) | Message house | 4D bento |
| 5 | Platform preview (command centre) | Prove the SaaS exists and is beautiful | 6D/7D |
| 6 | Live rates strip ("Today's rates") | Prove freshness & authority | 6D |
| 7 | Free tools rail | Immediate utility | 6D |
| 8 | Cost-efficiency hook | Differentiating offer | 5D/6D |
| 9 | Services ecosystem (compact) | Depth of capability | 6D |
| 10 | Industries rail | "You are understood" | 4D |
| 11 | Diagnostic CTA band | Conversion | — |
| 12 | Compliance calendar preview | Recurring value | — |
| 13 | Proof: case studies + testimonials + metrics | Trust | — |
| 14 | Insights (3 latest) | Authority + SEO | — |
| 15 | Final CTA + FAQ (top 6, schema-marked) | Conversion + SEO | — |
| 16 | Footer | Navigation + links | — |

### 5.1.2 Hero wireframe (desktop)

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│  [◐] DhakaFin   Rates ▾  Tools ▾  Services ▾  Industries ▾  Insights   ⌘K  Sign in │
│                                                  [ Book a Consultation ]           │
├───────────────────────────────────────────────────────────────────────────────────┤
│ L0: WebGL Financial Universe (subtle, slow, mouse-reactive) + grad-depth + noise   │
│                                                                                    │
│  ▌FINANCIAL INTELLIGENCE FOR BANGLADESH                    ┌───────────────────┐   │
│                                                             │  3D ENTITY PLAZA  │   │
│  Make Better                                                │  ●Revenue  ●Tax    │   │
│  Financial Decisions.                                       │  ●Payroll  ◆Profit │   │
│  ─────────────────────                                      │  ◇VAT  ◇Cash Flow │   │
│  Accounting, audit, tax, VAT and financial                  │      ⟿ streams     │   │
│  intelligence built around one goal — helping               │  [hover → insight] │   │
│  businesses understand their numbers, control               └───────────────────┘   │
│  their costs and move forward with confidence.                                     │
│                                                                                    │
│  [ Book a Consultation ]  [ Explore the Platform ]  [ Try Free Tools ]             │
│                                                                                    │
│  ▸ Numbers tell you what happened. Intelligence tells you what to do next.         │
│                                                                                    │
│ ┌──────────────────────────── LIVE CONTROL TERMINAL (glass, L3) ─────────────────┐ │
│ │ ● NBR sources verified 4h ago │ Mushak 9.1 in 6 days │ Books reconciled 98%    │ │
│ │ Expense leak flagged: ৳2.4L ▲ │ TDS updated: sec 89 ↗ │ Cash runway 7.2 mo     │ │
│ └────────────────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────────────┘
```

### 5.1.3 Hero interaction specification

| Element | Behaviour |
|---|---|
| **WebGL scene** | 11 financial entities orbiting a central "Profit Core" in a shallow 3D field; thin luminous connection streams; slow ambient rotation (0.02 rad/s); parallax offset ≤ 18px following pointer with 0.08 lerp; on scroll, the camera eases forward and entities spread apart (scrub-linked, 0→1 over 60vh) |
| **Entity hover** | Entity scales 1.06, label fades in with a one-line insight ("Payroll ↑ 12% QoQ"), connected streams brighten, unrelated entities dim to 40% |
| **Entity click** | Jumps to the corresponding node in the money-flow section (smooth scroll + auto-select the node there) — this is the 9D continuity rule |
| **Live Control Terminal** | 5 status chips, one updates every ~6 s from the API (real rates/deadlines when available; otherwise honest, clearly-labelled illustrative values — **never fabricate client data**) |
| **Scroll cue** | A thin animated vertical line with a travelling dot, not a bouncing chevron |
| **Reduced motion / lite** | Hero renders as a static composed illustration (SVG + gradient + grain) with the same terminal chips animating values only |

### 5.1.4 Hero copy deck (final, bilingual)

| Key | English | Bangla (bn-BD) |
|---|---|---|
| `hero.overline` | FINANCIAL INTELLIGENCE FOR BANGLADESH | বাংলাদেশের জন্য আর্থিক বুদ্ধিমত্তা |
| `hero.h1` | Make Better Financial Decisions. | আরও ভালো আর্থিক সিদ্ধান্ত নিন। |
| `hero.sub` | Accounting, audit, tax, VAT and financial intelligence built around one goal — helping businesses understand their numbers, control their costs and move forward with confidence. | অ্যাকাউন্টিং, অডিট, ট্যাক্স, ভ্যাট ও ফাইন্যান্সিয়াল ইন্টেলিজেন্স — সবকিছুর একটাই লক্ষ্য: ব্যবসাকে তার সংখ্যা বুঝতে, খরচ নিয়ন্ত্রণ করতে এবং আত্মবিশ্বাসের সঙ্গে এগিয়ে যেতে সাহায্য করা। |
| `hero.cta.primary` | Book a Consultation | ফ্রি পরামর্শ নিন |
| `hero.cta.secondary` | Explore the Platform | প্ল্যাটফর্ম দেখুন |
| `hero.cta.tertiary` | Try Free Tools | ফ্রি টুল ব্যবহার করুন |
| `hero.philosophy` | Numbers tell you what happened. Intelligence tells you what to do next. | সংখ্যা বলে কী হয়েছে। বুদ্ধিমত্তা বলে এরপর কী করতে হবে। |

### 5.1.5 Section specs (2–16) — condensed

| Section | Content spec | Interaction |
|---|---|---|
| **2. Trust ribbon** | 6 logo slots (client logos w/ permission), "9 professional service lines", "৳ N Cr turnover under review" (only if true & permitted), "Rates verified within 48h of NBR publication" | Logos desaturate → colour on hover; marquee paused on hover/focus; hidden if no permission-based logos exist |
| **4. Four pillars** | Bento grid: Understand (large tile with mini-dashboard), Control (leakage funnel mini), Comply (deadline chips), Grow (arrow chart) | Each tile has a single link; hover raises tile + shows a one-line outcome metric |
| **5. Platform preview** | Screenshot-quality interactive mock of the command centre inside a browser chrome frame; tabs switch between Dashboard / Compliance / Documents / Assistant | Tab switch morphs the frame content (pre-rendered states, not real data); a "See the real thing" CTA opens a product tour video or demo booking |
| **6. Live rates strip** | 5 chips: TDS contractor 7.5% · VDS service 15% · VAT standard 15% · Income tax top slab 30%/35% · Corporate (unlisted) 27.5% — each with "Updated {date}" and an arrow → rate page. **Values come from the API; never hardcode.** | Hover shows effective-from + SRO; click → rate page (tag: `home_rates_strip`) |
| **7. Tools rail** | 6 top tools with one-line benefit + "no signup required" badge | Horizontal snap scroll; each card has a mini input preview that animates on hover |
| **8. Cost-efficiency hook** | Headline "Your Biggest Cost May Be the One You Don't See." + turnover slider teaser (read-only preview) | Slider drag animates the mini funnel; CTA → `/cost-efficiency` |
| **9. Services ecosystem** | Compact 9-node constellation (not a card grid), hover reveals one-line outcome | Click → service page; keyboard: tab through nodes |
| **10. Industries rail** | 11 industry chips with icons + a rotating "differentiator" line per industry | Click → industry page |
| **11. Diagnostic CTA** | "Not sure where to start? Get a financial health read in 2 minutes." | → `/diagnostic` |
| **12. Compliance calendar preview** | Next 3 deadlines with days-remaining rings + "Your calendar, personalized" copy | → `/compliance-calendar` |
| **13. Proof** | 3 metric-led case cards + 2 testimonial quotes (photo optional) + one-line disclaimer on measurement method | Hover raises; click → `/clients` |
| **14. Insights** | 3 latest articles with category, reading time, reviewer name | — |
| **15. Final CTA + FAQ** | 6 FAQs (schema-marked): "What does DhakaFin do?", "Are you a CA firm?", "How much do services cost?", "Is my data safe?", "Do you support Bangla?", "How often are rates updated?" + dual CTA (Book / Try tools) | Accordion, single-open |

### 5.1.6 Homepage acceptance criteria

1. LCP element (hero H1) renders ≤ 2.5 s on throttled 4G mid-tier Android; hero WebGL never blocks LCP (lazy, `requestIdleCallback`, dynamic import).
2. With WebGL disabled, JavaScript errors, or `lite` tier, the hero still presents headline, sub, 3 CTAs and the status chips, visually complete.
3. Every one of the 16 sections renders correct English **and** Bangla content when locale is `bn`.
4. All 5 rate chips display values fetched from `/api/v1/rates` with effective dates — verified by a test that stubs the API and asserts no hardcoded percentages exist in the component tree.
5. Keyboard: entire page navigable; visible focus ring on every interactive element; the WebGL canvas is `aria-hidden` with a text equivalent describing the entities.
6. CLS ≤ 0.05 including WebGL load and font swap.
7. `prefers-reduced-motion` → no scroll-scrubbed camera motion, no count-ups, loops stopped; verified in the Playwright reduced-motion project.
8. Lighthouse mobile ≥ 90 / desktop ≥ 95; axe-core: 0 violations of serious/critical level.

---

## F2 — "WHERE IS YOUR MONEY GOING?" (SIGNATURE EXPERIENCE)

**Purpose:** The single most memorable, most shareable, most differentiating page on the site. It teaches financial literacy while selling DhakaFin's service lines, anchored to the exact chain from the concept.

**Route:** `/money-flow` (also embedded in an interactive teaser form on the homepage).

### 5.2.1 The chain (9 nodes, locked)

```
Revenue → Sales → Gross Profit → Operating Expenses → Payroll → Procurement → Tax → VAT → Net Profit
```

### 5.2.2 Wireframe (desktop, pinned-scroll narrative)

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│  Where Is Your Money Going?                                                       │
│  Every taka follows a path. Most owners only see the last stop.                   │
├──────────────────────────────┬────────────────────────────────────────────────────┤
│  THE FLOW (L0 canvas)        │  STICKY INSIGHT RAIL (L3 glass, 380px)             │
│                              │                                                    │
│   ┌────────┐                 │  ┌──────────────────────────────────────────────┐ │
│   │Revenue │──⟿──┐           │  │  PROCUREMENT                    [07 / 09]    │ │
│   └────────┘      │           │  │  ৳ 4.2 Cr · 34% of operating expenses        │ │
│              ┌────▼─────┐     │  │  ▲ up 11% vs last year                       │ │
│              │  Sales   │     │  ├──────────────────────────────────────────────┤ │
│              └────┬─────┘     │  │  Are your purchasing costs increasing?       │ │
│   ┌───────────────▼───┐       │  │  [mini stacked chart: 12-month trend]        │ │
│   │   Gross Profit    │       │  ├──────────────────────────────────────────────┤ │
│   └───┬───────────┬───┘       │  │  Questions a finance head should ask:        │ │
│       │           │           │  │  • Is every supplier price benchmarked?      │ │
│  ┌────▼──────┐ ┌──▼────────┐  │  │  • Are we buying at the cheapest tier?       │ │
│  │ Operating │ │  Payroll  │  │  │  • Do duplicate vouchers exist?              │ │
│  │ Expenses  │ └───────────┘  │  ├──────────────────────────────────────────────┤ │
│  └─┬───┬───┬─┘                │  │  How DhakaFin helps:                         │ │
│    │   │   └────► Procurement │  │  Purchase benchmarking · Supplier comparison │ │
│    │   └────────► Tax         │  │  Cost efficiency · Leakage detection         │ │
│    └────────────► VAT         │  │  [ Procurement review ]  [ Leakage checker ] │ │
│           ┌───────────────┐   │  ├──────────────────────────────────────────────┤ │
│           │  Net Profit   │   │  │  [ Book a procurement review → ]             │ │
│           └───────────────┘   │  └──────────────────────────────────────────────┘ │
└──────────────────────────────┴────────────────────────────────────────────────────┘
```

### 5.2.3 Node content model (each node has all seven layers the concept demands)

| Node | Financial info | Animated chart | Business questions | Related services | Contextual tool | CTA |
|---|---|---|---|---|---|---|
| **01 Revenue** | Total inflow, ৳ value, growth %, revenue mix by product/channel | Area trend + channel donut | Is growth real or discounted? Is revenue concentration risky? Are we billing everything we deliver? | Financial Advisory, Virtual CFO | Revenue growth calculator | Book a revenue review |
| **02 Sales** | Sales volume, average order value, returns/discount impact | Bar + line combo (volume vs value) | Are margins eroding as sales grow? Are discounts authorized? | Accounting, VAT Services | Profit margin calculator | Check your margin |
| **03 Gross Profit** | GP ৳, GP %, direct cost share | Waterfall (revenue → COGS → GP) | Is COGS rising faster than sales? Is wastage/pilferage included? | Cost Efficiency, Accounting | Profit calculator | Find your true margin |
| **04 Operating Expenses** | Opex total, by category, % of revenue | Stacked bar by category over 12 months | Which category grew without a reason? Which cost has no owner? | Cost Efficiency & Internal Control | Break-even calculator | Benchmark your opex |
| **05 Payroll** | Payroll total, headcount, per-head cost, overtime | Bar + per-head line | Is headcount growing faster than output? Is payroll tax (TDS sec 86) correct? | Payroll Accounting, Tax Services, Internal Control | Payroll calculator | Review payroll compliance |
| **06 Procurement** | Purchases, supplier concentration, price variance | Supplier concentration bars + price variance scatter | Are purchasing costs rising? Are we overdependent on one supplier? Any duplicate vouchers? | Cost Efficiency & Procurement Review | Cost efficiency calculator | Book a procurement review |
| **07 Tax** | Tax provision, TDS deducted/collected, AIT, effective tax rate | Comparison bars (provision vs paid) | Is our effective tax rate higher than it should be? Are TDS deductions correct and certificates collected? | Tax Services, Corporate Compliance | TDS / Income tax calculator | Check your TDS position |
| **08 VAT** | Output VAT, input VAT, net payable, Mushak status | Bar (output vs input vs net) | Are we claiming all legitimate input credit? Is Mushak 9.1 filed on time? | VAT Services, Compliance | VAT / VDS calculator | Verify your VAT position |
| **09 Net Profit** | Net profit ৳, margin %, YoY | Trend line with benchmark band | How much profit is trapped in avoidable cost? What would change it most this quarter? | Virtual CFO, Financial Advisory | Profit & ROI calculators | Talk to a Virtual CFO |

**Data source rule:** v1 node values are **illustrative industry-median models** (clearly labelled "Example: ৳10 Cr turnover trading business — see assumptions"), computed server-side from a documented model in `packages/tax-engine/benchmarks` with an inline "How we calculated this" disclosure. When a logged-in user opens the page, they see a toggle: "Use my business numbers" (pulls their real data, tenant-scoped). **Never present illustrative numbers as though they were the visitor's own.**

### 5.2.4 Interaction specification

| Behaviour | Spec |
|---|---|
| **Node select (click/tap/Enter)** | Rail updates with a 180ms cross-fade + 40ms stagger; charts draw in 600ms; connected edges pulse once; unrelated nodes dim to 30%; URL updates to `?node=procurement` (shareable, back-button aware) |
| **Keyboard navigation** | Arrow keys move along the flow order; `Enter` selects; `Esc` returns to the overview state; a live region announces "Procurement selected, 34% of operating expenses" |
| **Scroll narrative** | Each node triggers a scrub-linked camera move; the rail pins; on mobile the narrative becomes stacked node cards with inline expandable detail |
| **Mobile** | Vertical flow of 9 node cards connected by animated SVG lines; tap opens a bottom sheet with the same seven layers; sticky summary bar shows running ৳ amounts |
| **Money-leak marker** | A "leak" indicator (gold) appears on nodes where the benchmark model shows a typical avoidable-cost range — with tooltip "Industry studies show 2–6% of opex is avoidable; see method" |
| **Share** | "Share this flow" copies a URL with the selected node; OG image is generated showing the node + headline stat |
| **Performance** | Full WebGL only on `ultra`/`high`; `balanced` uses SVG flow with CSS animations; `lite` uses a static SVG diagram with instant interactions. The insight rail is always plain DOM (fast, accessible, crawlable). |

### 5.2.5 Acceptance criteria

1. All 9 nodes present, keyboard-reachable, in the documented order; arrow-key navigation works and is announced by a screen reader.
2. Selecting a node updates: rail content, chart, service links, tool link, CTA — all 5 in the same interaction, with no full page reload.
3. URL reflects node state and deep-links correctly (fresh load with `?node=tax` shows the Tax rail content on first paint, server-rendered).
4. The page is fully usable with WebGL disabled, JS-partial (rail server-rendered), and reduced-motion.
5. Every node's numbers display an assumptions disclosure; a test asserts no node shows a value without an accompanying method link.
6. Mobile 360px: no horizontal scroll, all 9 nodes reachable by thumb, bottom sheet scroll-locked internally and dismissible by swipe + Esc-adjacent gesture + visible close button.
7. Content is CMS-editable: node titles, questions, services, tools, CTAs all editable in Filament without code (task DF-P2-041).

---

## F3 — HOMEPAGE-ADJACENT CORE PAGES (About, Contact, Pricing, Trust)

| Page | Required content | Signature elements | Acceptance |
|---|---|---|---|
| `/about` | Story, why DhakaFin exists, philosophy, the flywheel explained visually, leadership, values, location, careers link | Animated "story spine" timeline; the philosophy quote as a full-bleed typographic moment | Named team with real credentials; no placeholder bios |
| `/team` | Each member: name, role, credentials, specialities, experience, LinkedIn, optional Bangla bio | Card grid with hover reveal of specialities; "Who will handle my account?" explainer | Verification step in admin: credentials field is required |
| `/clients` | 3+ case studies (challenge → intervention → measured result), testimonials with consent flags | Metric-led case cards; before/after mini-charts | Every case study carries a "measured by / period" footnote; consent recorded |
| `/pricing` | Service retainer bands + SaaS tiers + project service bands; what's included/excluded; annual toggle | Interactive pricing table with a "compare plans" mode and a "which fits me?" 3-question filter | Prices visible (no "call us" for standard tiers); includes VAT note ("+ applicable VAT") |
| `/book-consultation` | Calendar/slot picker, mode (call/office/video), what to expect, preparation checklist, confirmation | The booking flow itself is a designed experience: 3 steps, live availability, SMS+email confirmation, add-to-calendar | Creating a booking creates `Lead` + `Consultation` rows and sends both confirmations; double-booking prevented |
| `/contact` | Form (with business context fields), phone, WhatsApp, email, office map, hours, response-time promise | Map styled to the dark theme (custom tiles/mask), "response within 1 working hour" badge | Anti-spam (Turnstile + honeypot); form creates a `Lead` with `source`; auto-acknowledgement email |
| `/security` | Encryption, access control, audit logs, data residency, retention, incident response, sub-processors list | Visual "trust architecture" diagram | Every claim must match reality (engineering sign-off required) |
| `/help` + `/faq` | Searchable help centre, FAQ categories, keyboard shortcuts, accessibility statement | Search-first help with instant results | All FAQs have schema markup; answer blocks 40–60 words for AEO |

---

## F4 — PUBLIC FINANCIAL & COMPLIANCE HUB (RATE HUB)

**Purpose:** Become *the* most trusted, fastest, most transparent source of Bangladesh tax/VAT/TDS/VDS information. This is the organic traffic engine and the proof that DhakaFin is technically serious.

**Routes:** `/rates`, `/rates/tds`, `/rates/tds/[section]`, `/rates/vds`, `/rates/vat`, `/rates/income-tax`, `/rates/corporate-tax`, `/rates/ait`, `/rates/withholding-tax`, `/rates/tax-slabs`, `/rates/thresholds`, `/rates/compare`, `/sro`, `/sro/[slug]`, `/circulars`, `/compliance-calendar`.

### 5.4.1 Rate hub landing wireframe

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│  Bangladesh Tax, VAT & TDS Rates            [ 🔍 Search a rate, section or SRO ]   │
│  Verified against NBR sources. Last full review: 12 Sep 2026.                      │
│  ⚠ Banner when a rate changed in the last 7 days: "TDS sec 89 updated (SRO 173…)"  │
├───────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │
│  │ TDS          │ │ VDS          │ │ VAT          │ │ Income Tax   │               │
│  │ 128 entries  │ │ 46 entries   │ │ 15% standard │ │ 5 slabs      │               │
│  │ ▲ 3 changed  │ │ verified 4h  │ │ + reduced    │ │ FY 2025–26   │               │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │
│  │ Corporate    │ │ AIT          │ │ Thresholds   │ │ SRO Library  │               │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘               │
├───────────────────────────────────────────────────────────────────────────────────┤
│  POPULAR RIGHT NOW (DB-driven by page views)                                       │
│  TDS on contractor payments · VDS on services · VAT registration threshold ·       │
│  Income tax slab 2026 · AIT on import                                             │
├───────────────────────────────────────────────────────────────────────────────────┤
│  WHAT CHANGED (last 90 days) — changelog list with old → new, effective date, SRO  │
└───────────────────────────────────────────────────────────────────────────────────┘
```

### 5.4.2 Rate table row anatomy (every family page)

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│ TDS Rates in Bangladesh — FY 2025–26            [ year ▾ ] [ taxpayer ▾ ] [ 🔍 ]  │
├───────────────────────────────────────────────────────────────────────────────────┤
│ Section / Description            Rate      Base          Applicability            │
│ ─────────────────────────────────────────────────────────────────────────────────  │
│ 89  Contractor / sub-contractor  7.5%  ▸  Gross payment  Resident contractor      │
│      ⓘ SRO 173-AIN/2025 · Effective 01 Jul 2025 · Verified 12 Sep 2026            │
│      [ previous: 7.5% → no change ]   [ Calculate TDS ]  [ View detail → ]        │
│ ─────────────────────────────────────────────────────────────────────────────────  │
│ 90  Professional / advisory fee  10%  ▸  Gross payment   Any payer of service     │
│      ⓘ …                                                                          │
└───────────────────────────────────────────────────────────────────────────────────┘
```

**Every row must expose (concept §8):** current rate · effective date · applicability · taxpayer type · source · reference/SRO · last updated · previous rate where relevant.

### 5.4.3 Rate detail page structure

1. **Answer block** (40–60 words, LLM/AEO friendly): "The TDS rate on contractor payments in Bangladesh is **7.5%** for resident contractors, deducted on the gross bill amount under section 89 of the Income Tax Act 2023, effective from 1 July 2025 (SRO 173-AIN/2025)."
2. **Provenance panel:** effective from/to, section ref, SRO link (PDF), source URL, verified by (DhakaFin tax team), verified at, status badge (Current / Superseded / Under review).
3. **Conditions & exceptions** (accordion): thresholds, exemptions, special cases, non-resident variations, consequences of non-deduction.
4. **Inline calculator** (pre-filled with this section): amount → deduction, net payable, deposit deadline, Mushak/certificate notes.
5. **Change history table** with dates, old value, new value, SRO.
6. **Related:** related sections, relevant tools, service CTA ("We handle TDS compliance for 200+ businesses — review your deduction process").
7. **FAQs** specific to this rate (schema-marked).
8. **Report an issue** control (feeds admin tickets — a trust signal and a data-quality mechanism).
9. **Last updated + "DhakaFin verifies all rates within 48 working hours of NBR publication"** footer note.

### 5.4.4 Rate hub features

| Feature | Spec |
|---|---|
| **Search & filter** | Debounced (250 ms) full-text search over description + section + SRO; filters: family, taxpayer type, resident/non-resident, year, status; results as you type with highlighted matches; keyboard navigable; URL-synced |
| **Year/act switcher** | FY 2023–24 / 2024–25 / 2025–26 / 2026–27 + Act version toggles (ITA 2023 vs repealed ITO 1984 for historical comparisons) |
| **Comparison workbench** (`/rates/compare`) | Side-by-side columns of any two years/acts; differences highlighted with ↑↓ and ৳/% deltas; drag-handle slider on mobile; export to PDF/Excel |
| **Change log** | Per-family changelog with filters; RSS/JSON feed; each entry links to its SRO and affected clients ("affects: businesses paying contractors") |
| **Rate change alerts** | Subscribe by family/section: email / WhatsApp / SMS; double opt-in; "you'll get notified within 24h of an NBR change" promise; unsubscribe one-click |
| **Compliance calendar** | Month + list views; obligations with applicable business profiles; "Add to my calendar" (ICS download, Google Calendar link); printing layout |
| **SRO library** | Searchable by number/year/date/keyword; plain-language summary (written by our team) + link to the official PDF; "affected rates" cross-links; version/supersede tracking |
| **Glossary tooltips** | Every statutory term in the interface has a Bangla+English glossary tooltip; glossary page with search and cross-links |
| **Admin transparency** | Each page shows "Data maintained by DhakaFin · Report an error" — and the admin has an "SRO watcher" queue: a checklist of sources checked daily, with the last check timestamp visible internally and a public "last full review" date |
| **Export** | Rate tables exportable as CSV/XLSX/PDF (gated lightly — email capture optional, never required for the data itself) |

### 5.4.5 Rate hub acceptance criteria

1. **Zero hardcoded regulatory values** anywhere in the frontend — enforced by a CI check (regex scan for `%` literals in rate components + a test that renders pages with a mocked API returning distinctive values).
2. Any rate with `verified_at` older than 45 days triggers an internal alert; the public page shows the actual verification date (never a fake "today").
3. Every rate displays: rate, effective date, applicability, taxpayer type, source, SRO reference, last updated, previous rate (when it exists) — verified per row by a test.
4. Superseding a rate in admin updates: detail page, family table, comparison view, tools' defaults, and issues alerts — within 5 minutes, without a deploy.
5. Page is fully crawlable: server-rendered tables, `Dataset` + `FAQPage` schema valid in Rich Results Test, canonical correct, sitemap includes every rate page.
6. Rate pages load ≤ 2.0 s LCP on 4G and work with JS disabled (tables + search degrade to server-side query params).
7. Changelog and comparison views are accurate to the seeded history (verified against a fixture dataset in tests).
8. Bangla translation present for all headings, labels, disclaimers, and page intros.

---

## F5 — FINANCIAL TOOLS SUITE (13 TOOLS)

**Purpose:** Give immediate, real value without signup; convert via saved results and contextual service offers. These must feel like premium SaaS modules, not form-and-button calculators.

**Routes:** `/tools` + `/tools/{slug}`.

### 5.5.1 Tool inventory & formulas (authoritative spec — implement in `packages/tax-engine` once, consume everywhere)

| # | Tool | Inputs | Formula / logic | Outputs | Cross-sell |
|---|---|---|---|---|---|
| 1 | **TDS Calculator** | payment type (section picker), amount, payer type, payee resident/non-resident, TIN status, date | Rate resolved from the Rate API for the given date; deduction = amount × rate; rounding rules documented (round to nearest taka, standard practice) | Deduction, net payable, section + SRO reference, deposit deadline, certificate note | Tax Services |
| 2 | **VDS Calculator** | service type, amount, VAT-registered status, date | VDS rate from API; deduction; Mushak 6.6 note; deposit timing | Deduction, net payment, form reference, deposit deadline | VAT Services |
| 3 | **VAT Calculator** | mode (exclusive/inclusive), amount, rate (from API: 15% standard, reduced options), input credit toggle | Exclusive: VAT = base × r; Inclusive: base = total/(1+r); net payable = output − eligible input | Base, VAT, total, net payable after credit, Mushak 9.1 note | VAT Services |
| 4 | **Income Tax Calculator (Individual/Salary)** | FY, residency, income sources (salary, business, rent, capital gain, other), deductions/investment rebate, TDS already paid | Slab engine from `TaxSlab` rows + surcharge + rebate rules; minimum tax rules | Taxable income, slab-by-slab breakdown (animated), tax, rebate, net payable/refund, effective rate | Tax Services |
| 5 | **Corporate Tax Calculator** | entity type (public/private/bank/merchant/tobacco/mobile…), turnover, taxable profit, compliance conditions (bank channel, TIN, return filed) | Rate table lookup + conditional rate adjustments (+2%/3% for non-compliance where applicable per rules) | Tax liability, effective rate, condition warnings | Tax Services, Virtual CFO |
| 6 | **Profit Calculator** | revenue lines, COGS, opex categories | GP, operating profit, net profit, margins | Waterfall chart, margin %, benchmark band | Accounting |
| 7 | **Profit Margin Calculator** | cost, selling price (or margin % target) | Margin/Markup both ways, break-even price | Margin %, markup %, price recommendation | Cost Efficiency |
| 8 | **Break-even Calculator** | fixed costs, variable cost per unit, price per unit | BEP units = FC / (P − VC); BEP revenue; margin of safety | Interactive BEP chart with current-sales marker | Cost Efficiency |
| 9 | **ROI Calculator** | investment, returns, period, optional discount rate | ROI %, annualized ROI, simple payback, NPV/IRR (advanced toggle) | Chart, payback timeline | Financial Advisory |
| 10 | **Cash Flow Calculator** | opening balance, monthly inflows/outflows (12 rows), receivables days, payables days | Monthly net, cumulative, minimum balance alert, runway months | Cash-flow chart + runway gauge + risk months highlighted | Virtual CFO, Advisory |
| 11 | **Cost Efficiency / Leakage Calculator** | industry, turnover, category spend (procurement, payroll, utilities, logistics, marketing, other), simple process questions (duplicate approvals? price benchmarking? inventory count?) | Benchmark-based avoidable-cost ranges per category (documented model) + question-weighted risk score | Estimated avoidable cost range (low–high), leakage breakdown chart, risk score, recommendations | Cost Efficiency Review |
| 12 | **Payroll Calculator** | headcount, gross per head, allowances, overtime, TDS applicability, employer contributions | Payroll cost fully loaded, TDS (sec 86) estimate, per-head cost | Cost breakdown, monthly/annual, TDS total | Payroll Accounting, Tax |
| 13 | **Working Capital Calculator** | current assets/liabilities items, inventory days, receivable days, payable days | Working capital, current ratio, quick ratio, cash conversion cycle | Ratios + CCC chart + funding gap estimate | Advisory, Virtual CFO |

### 5.5.2 Tool page structure (all 13 share the shell)

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│  VDS Calculator                                          ⓘ Based on NBR sources   │
│  Calculate VAT deducted at source on services in seconds.                          │
├───────────────────────────────┬───────────────────────────────────────────────────┤
│ INPUTS (L2 card)              │ RESULT (L3 glass, sticky on desktop)              │
│                               │                                                   │
│ Service type  [ Consulting ▾ ]│   VDS DEDUCTION                                   │
│ Amount        [ ৳ 5,00,000  ] │   ৳ 75,000                          [count-up]    │
│ VAT registered? ( ● ) Yes     │   ───────────────────────────────                 │
│ Transaction date [ 20 Sep 26 ]│   15% · Section/rule ref · SRO …                  │
│ [Advanced: exemptions ▾]      │   [ breakdown bars: gross / deduction / net ]     │
│                               │   Net payable to provider: ৳ 4,25,000             │
│ ⓘ Shows the rate in force for │   Deposit by: 15 Oct 2026 (Mushak 6.6)            │
│   the date you select.        │   ─────────────────────────────────────────────── │
│                               │   [ Save & get rate alerts ]  [ Book a review ]   │
│                               │   ▸ How this was calculated                       │
│                               │   ⚠ General information, not professional advice  │
└───────────────────────────────┴───────────────────────────────────────────────────┘
```

### 5.5.3 Tool interaction requirements

| Requirement | Spec |
|---|---|
| **Live results** | Results update as the user types (debounced 150 ms), with count-up animation on the primary figure and instant values under reduced-motion |
| **Input craft** | `৳` prefix inside the field, live thousand separators (BD grouping), numeric keypad on mobile, arrow-key increment, slider for range inputs (turnover/labour), segmented controls for binary choices |
| **Formula transparency** | Every tool has an expandable "How this was calculated" showing the formula, the rate source with SRO, the rounding rule, and a link to the rate page — this is a trust feature, not an extra |
| **Charts** | At least one meaningful visual (waterfall, bar, gauge, or timeline) that animates on change and has an accessible data table |
| **Rate provenance** | Each tool shows "Rates used: TDS sec 90 (10%) · effective 01 Jul 2025 · verified 12 Sep 2026" with links |
| **Persistence** | Anonymous: localStorage (last 5 calculations) + "save & email me the result" (email capture with consent). Authenticated: saved to the business account with a name, shareable link, and export PDF/CSV |
| **Presets & examples** | "Try an example" chips (e.g. "Consulting fee ৳5L", "Rent ৳80k"), and industry presets |
| **Related content** | 3 links: related rate page, related tool, related service — plus 2 FAQs with schema |
| **Error & edge states** | Zero/negative values, non-numeric paste, amounts over int range, missing rate for the selected date (→ "We don't have a verified rate for that date yet — here's the closest, with dates") — never a generic error |
| **Sharing** | Shareable URL encodes inputs (`?amount=500000&date=2026-09-20`), OG image renders the result summary; "Copy result" produces a clean text summary for WhatsApp |
| **CTA discipline** | Contextual, never spammy: after the first result, a single, relevant next step (save alert / book review / read explainer); no interstitials, no forced signup |

### 5.5.4 Tool acceptance criteria

1. Formula matches the published test vectors in `packages/tax-engine` (unit tests: ≥ 3 vectors per tool including boundary and rounding cases).
2. No rate, slab, or threshold literal exists in tool components — all resolved via API for the selected date; test-verified.
3. Every tool produces results that update in ≤ 50 ms of input on a mid-range device (measured with Performance API marks in dev).
4. All tools usable with keyboard only (including sliders via arrow keys) and readable by screen readers with announced result changes (`aria-live="polite"`).
5. Each tool page has: unique title/meta, `SoftwareApplication` + `FAQPage` schema, breadcrumb, 40–60 word answer block at the top, related links, and a visible disclaimer.
6. Anonymous localStorage persistence works and never leaks into another user's session after login (cleared on auth).
7. On mobile, the result panel is reachable without scrolling past the inputs (sticky summary bar or collapsed result).---

## F6 — SERVICE EXPERIENCE (INTERACTIVE SERVICE ECOSYSTEM)

**Purpose:** Present 9 service lines as one connected ecosystem — never as 9 identical cards. A visitor must be able to see the problem, the deliverable, the workflow, and the price band without a sales call.

**Routes:** `/services`, `/services/[slug]`.

### 5.6.1 The nine services (locked from v1, unchanged)

| # | Slug | Name | Problem it solves | Who needs it | Key deliverables |
|---|---|---|---|---|---|
| 01 | `accounting-bookkeeping` | Accounting & Bookkeeping | "I don't know if my numbers are even correct." | SMEs, startups, trading firms | Monthly bookkeeping, bank reconciliation, AR/AP, payroll accounting, management accounts, month-end close |
| 02 | `audit-support` | Audit Support / Statutory Audit | "Audit season is chaos and we always get findings." | Corporates, manufacturers, listed entities | Audit readiness review, schedules, working papers, document organization, FS drafting, audit coordination |
| 03 | `tax-services` | Tax Services | "I'm afraid of a tax notice and overpaying." | All businesses + individuals | Individual & corporate returns, computation, TDS compliance, AIT tracking, tax planning, notice handling |
| 04 | `vat-services` | VAT Services | "VAT filing is confusing and penalties keep coming." | VAT-registered, turnover-tax, import/export | BIN registration, Mushak 9.1 monthly returns, VAT calculation, VDS certificates (Mushak 6.6), audit defense |
| 05 | `cost-efficiency-internal-control` | Cost Efficiency & Procurement Review | "Costs keep rising but profit doesn't." | Manufacturing, retail, trading, e-commerce | Purchase benchmarking, vendor quotation review, leakage identification, duplicate voucher checks, supplier risk analysis |
| 06 | `internal-control-governance` | Internal Control & Governance | "I can't trust my own process; money leaks somewhere." | Growing SMEs, corporates | Process flow review, control assessment, risk identification, SOP development, fraud risk mitigation, dual-authorization design |
| 07 | `corporate-compliance` | Corporate Compliance | "I don't remember which filing is due where." | Companies (RJSC), corporate groups | RJSC annual filings, statutory registers, board resolutions, regulatory filings, calendar management |
| 08 | `financial-advisory` | Financial Advisory | "I need to decide with a real model, not a gut feeling." | Owners planning capex, expansion, funding | Financial planning, investment appraisal, cash-flow forecasting, profitability analysis, financial modelling |
| 09 | `virtual-cfo` | Virtual CFO | "I can't afford a full-time CFO but need one's brain." | ৳5 Cr+ businesses, funded startups | Monthly executive MIS, cash runway, budget vs actual, KPI monitoring, board-level decision support |

### 5.6.2 Service ecosystem wireframe

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│  Nine capabilities. One connected financial system.                                │
│  Hover a node to see the problem it solves · Click to go deep                      │
│                                                                                    │
│      ┌──────────────┐        ┌──────────────┐        ┌──────────────┐              │
│      │ 01 ACCOUNTING│──⟿────│ 02 AUDIT     │        │ 03 TAX       │              │
│      └───────┬──────┘        └──────────────┘        └──────┬───────┘              │
│              │                                              │                      │
│        ┌─────▼──────┐   ┌──────────────┐   ┌──────────────┐ │                      │
│        │ 05 COST    │───│ 06 INTERNAL  │───│ 04 VAT       │◄┘                     │
│        │ EFFICIENCY │   │ CONTROL      │   │              │                        │
│        └─────┬──────┘   └──────┬───────┘   └──────┬───────┘                        │
│              │                 │                  │                                │
│        ┌─────▼─────────────────▼──────────────────▼───────┐                        │
│        │        07 CORPORATE COMPLIANCE                   │                        │
│        └───────────────────────┬─────────────────────────┘                        │
│                        ┌───────▼────────┐   ┌────────────────┐                    │
│                        │ 08 FINANCIAL   │───│ 09 VIRTUAL CFO │                    │
│                        │ ADVISORY       │   │                │                    │
│                        └────────────────┘   └────────────────┘                    │
│                                                                                    │
│  [ Choose by problem ▾ ]  [ Choose by industry ▾ ]  [ Take the 2-min diagnostic ]  │
└───────────────────────────────────────────────────────────────────────────────────┘
```

**Interaction:** nodes are keyboard-navigable (`role="link"`, tab order = numbering); hover/focus shows a compact preview card (problem, 3 deliverables, price band, "who needs this"); clicking goes to the service detail; connected nodes highlight along the edges that matter (e.g. Accounting ↔ Audit ↔ Tax).

### 5.6.3 Service detail page structure (repeatable, all 9)

| Block | Content |
|---|---|
| **Hero** | Service name, one-line outcome, "Who needs this" chips, price band, dual CTA (Book consultation / Talk about scope), hero visual specific to the service (not a generic illustration) |
| **The problem** | 3–5 real pain statements in the client's own words (from discovery calls), each one line |
| **What's included** | Grouped checklist (ongoing / periodic / as-needed), with "what's not included" honesty block |
| **Who needs this** | Business types, turnover bands, triggers ("if you're VAT-registered and selling B2B…") |
| **Workflow** | 5–7 step visual timeline: Kickoff → Data handover → Setup → Monthly cycle → Review → Reporting → Advisory. Each step: what we do, what we need from you, timeline, output |
| **Deliverables** | Named documents with a sample (redacted PDF preview) — invoices, MIS packs, Mushak returns, audit schedules, board packs |
| **Timeline & SLA** | Onboarding time, monthly cycle dates, response SLAs |
| **Pricing** | Bands with what drives price (transaction volume, entity count, headcount). Transparent enough to self-qualify |
| **Related tools** | 2–3 relevant calculators embedded as entry links |
| **Related compliance** | Which deadlines/obligations this service covers |
| **Proof** | 1 case study + 1 testimonial specific to this service |
| **FAQ** | 6–8 questions with schema |
| **CTA** | Book a consultation (pre-fills the service) + "Get a quote in 24h" |
| **Internal links** | 2 sibling services ("pairs well with"), 1 industry page |

### 5.6.4 Acceptance criteria

1. All 9 service pages exist, fully written in English with Bangla versions, no lorem ipsum, each with real deliverables and honest scope boundaries.
2. Service data comes from the `Service` model (admin-editable) — a test proves adding a service in admin creates a working route and appears in nav/ecosystem/sitemap.
3. Ecosystem map is keyboard navigable in numeric order with visible focus and `aria-label`s; a non-visual list version exists in the DOM for screen readers.
4. `Service` schema + `FAQPage` schema validate; each page has a unique 150–160 char meta description.
5. Mobile: ecosystem becomes a grouped accordion (Group 1: Foundations — 01/02/03; Group 2: Control — 04/05/06; Group 3: Growth — 07/08/09), never a squashed diagram.
6. Booking CTA pre-fills the service and the source; verified end-to-end in E2E tests.

---

## F7 — FINANCIAL INTELLIGENCE PLATFORM (COMMAND CENTRE)

**Purpose:** The SaaS product must not look like a generic admin dashboard. It must look like an instrument panel a CFO would enjoy using. This spec governs both the public product tour (`/platform`) and the real portal dashboard (`app.dhakafin.com/dashboard`).

### 5.7.1 Command centre wireframe

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│ [◐ DhakaFin]  [ Business ▾ Rahim Textiles Ltd · TIN •••4821 ]   ⌘K   🔔3   ◐ RK  │
├──────────┬────────────────────────────────────────────────────────────────────────┤
│ ▸ Overview│  Good morning, Rakib.  Today: 1 filing due in 6 days.                 │
│  Dashboard│  ┌──────────────────────────────────────────────────────────────────┐  │
│  Insights │  │ BUSINESS HEALTH                          78 / 100  ▁▂▄▅▆▲      │  │
│  Assistant│  │ Improving · Profitability strong · Liquidity watch              │  │
│ ───────── │  └──────────────────────────────────────────────────────────────────┘  │
│ ▸ Finance │  ┌────────────┐┌────────────┐┌────────────┐┌────────────┐            │
│  Accounting│  │ REVENUE    ││ GROSS PROF.││ NET PROFIT ││ CASH POS.  │            │
│  Tax      │  │ ৳12.5 L    ││ ৳4.1 L     ││ ৳1.9 L     ││ ৳3.2 L     │            │
│  VAT      │  │ ↑18.4%     ││ ↑9.1%      ││ ↓2.3%      ││ →0.8%      │            │
│  Reports  │  │ Growth     ││ Margin     ││ Margin     ││ Runway     │            │
│           │  │ accelerating││ steady    ││ softening  ││ 7.2 months │            │
│ ───────── │  │ Sales vol. ││ pricing    ││ payroll ↑  ││ watch AR   │            │
│ ▸ Compli- │  └────────────┘└────────────┘└────────────┘└────────────┘            │
│  Compliance│ ┌───────────────────────────────┐┌────────────────────────────────┐  │
│  Documents│ │ CASH & PROFIT TREND (12 mo)   ││ WHERE YOUR MONEY WENT          │  │
│  Tasks    │ │ [area+line, annotated]        ││ [sankey mini: revenue→costs→   │  │
│  Requests │ │ ▲ Revenue ▲ Profit ▲ Costs    ││  payroll/tax/vat→profit]       │  │
│ ───────── │ └───────────────────────────────┘└────────────────────────────────┘  │
│ ▸ Account │ ┌───────────────────────────────┐┌────────────────────────────────┐  │
│  Billing  │ │ UPCOMING (compliance)         ││ INSIGHTS (AI)                  │  │
│  Settings │ │ ● Mushak 9.1  in 6 days  [→]  ││ ⚠ Payroll up 22% vs output 6%  │  │
│  Support  │ │ ● TDS deposit in 11 days [→]  ││   why → driver breakdown → fix │  │
│           │ │ ✓ Return filed 12 Sep         ││ ● AR aging worsening in 60+d   │  │
│           │ └───────────────────────────────┘└────────────────────────────────┘  │
│           │ ┌────────────────────────────────────────────────────────────────┐    │
│           │ │ NEEDS YOU: 2 documents · 1 approval · 1 bank statement missing │    │
│           │ └────────────────────────────────────────────────────────────────┘    │
└──────────┴────────────────────────────────────────────────────────────────────────┘
```

### 5.7.2 KPI tile specification (the anti-"bare number" rule)

Every KPI tile has **six** elements — a tile missing any of them is incomplete:

| Element | Example | Rule |
|---|---|---|
| Label | `REVENUE` | Overline, uppercase, muted |
| Value | `৳12.5 L` | Space Grotesk tabular, `--fs-metric-xl`, BD compact notation |
| Delta | `↑ 18.4%` | Arrow + sign + % vs comparison period; green/red/gold with icon, never colour alone |
| Qualifier | `Growth accelerating` | A 2–4 word plain-language judgement generated by a documented rule set |
| Driver | `Primary driver: Sales volume` | Link to the insight that explains it |
| Period/source | `Jul 2026 · vs Jun 2026 · from books` | Prevents misleading comparisons; always visible (small, muted) |

**Qualifier rule engine (v1, deterministic — AI only for the narrative, never the number):** compare current vs previous period and vs 3-period trend; thresholds documented in `Domain/Insights/Rules/`; e.g. revenue ↑>10% and accelerating → "Growth accelerating"; profit ↓ while revenue ↑ → "Margin compression — check COGS"; cash ↓ with AR ↑ → "Cash trapped in receivables".

### 5.7.3 Dashboard modules (all real product capability, per concept §7)

| Module | Content | Interaction |
|---|---|---|
| **Business Health score** | Composite 0–100 from profitability, liquidity, compliance, cost control, growth subscores | Click → breakdown drawer with each subscore's inputs and "what would move this score" |
| **KPI row** | Revenue, Gross Profit, Net Profit, Cash Position, Receivables, Payables, Tax exposure, VAT payable (user-configurable which 4–8 show) | Click a tile → detailed page with trend, drivers, transactions, benchmark |
| **Cash & profit trend** | Area (revenue) + line (profit) + bars (costs) with annotations for events | Hover crosshair with shared tooltip; toggle period 6/12/24 months; compare vs industry band |
| **Money flow (mini)** | Sankey of revenue → cost categories → tax/VAT → profit, with the current month | Click a band → filtered ledger view; "tap to explore" affordance on mobile |
| **Compliance strip** | Next 5 obligations with days remaining rings, statuses, owners | Inline actions: mark handled, upload document, ask accountant |
| **Insights (AI)** | Top 3 insights with severity, explanation, driver data, recommended action | Expand → evidence, "create task", "dismiss with reason" (feeds model eval) |
| **Needs you** | Documents to upload, approvals pending, missing data | One-tap upload/approve; empty state celebrates a clean desk |
| **Reconciliation status** | Bank/ledger reconciliation % with a progress ring and last-sync time | Click → reconciliation detail page |
| **Team activity** | What DhakaFin has done this month (filed, reviewed, flagged) — trust through visibility | Timeline with documents and completion proof |
| **Alerts** | Risk flags: overdue, penalty exposure, unusual transaction, missing document, statutory change affecting you | Each alert has: what, why, impact ৳, action, deadline |
| **Tasks & documents** | Compact lists with inline actions | — |

### 5.7.4 Platform tour page (`/platform`, public)

- Interactive, **real-looking mock** of the command centre (pre-rendered, clearly labelled as a sample business "Rahim Textiles Ltd — sample data") with working tabs and animations, no login required.
- Sections: Dashboard → Insights → Compliance → Documents → Assistant → Reports → Team, each with a short benefit line and one screen.
- A "sample data" badge is visible at all times (integrity).
- Ends with "Start free — no card required" + "Book a demo".
- **Acceptance:** the tour never calls authenticated APIs; its data is static and clearly labelled; it is fully accessible (keyboard, screen reader, contrast) and performs ≤ 2.5 s LCP with no WebGL (charts SVG/Canvas).

### 5.7.5 Dashboard acceptance criteria

1. Dashboard renders first meaningful content ≤ 2.5 s on 4G; skeletons for every module; no layout shift > 0.05.
2. Every KPI tile satisfies the six-element rule (test: DOM assertions for label, value, delta, qualifier, driver, period).
3. All figures come from the API with a `source` field; the UI shows the fiscal period; a test asserts no hardcoded numbers exist in dashboard components.
4. Insights are explainable: expanding an insight shows the underlying data points and the rule/derivation.
5. The dashboard is usable on a 360px screen: KPI row becomes a 2-col grid or horizontal snap rail; the Sankey becomes a stacked bar list; compliance strip becomes a concise list.
6. Empty states exist for every module (new business with no data) and give a specific next action, never a blank panel.
7. All charts have accessible data tables and text summaries; colour is never the only encoding.

---

## F8 — BUSINESS DIAGNOSTIC ENGINE

**Purpose:** Feel like an AI-powered financial diagnosis, not a questionnaire. Produce a personalized recommendation set, capture the lead, and pre-fill the quote/consultation flow.

**Route:** `/diagnostic` (public), result at `/diagnostic/result/[token]`.

### 5.8.1 Flow (7 stages per concept §11)

```
Stage 0  Intro ("2 minutes · 8 questions · no signup to see your result")
Stage 1  Business type        (11 industries + Other)
Stage 2  Business size        (turnover band: <30L · 30L–80L · 80L–3Cr · 3Cr–10Cr · 10Cr–50Cr · 50Cr+)
Stage 3  Accounting system    (none/Excel · part-time accountant · full-time team · software (Tally/QuickBooks/ERP) · outsourced firm)
Stage 4  Main problem         (choose up to 2: late/incorrect books · tax notice/compliance fear · VAT filing stress ·
                               rising costs · no profit visibility · cash flow crunch · audit findings · investor reporting ·
                               internal leakage/pilferage · no one to advise)
Stage 5  Growth stage         (survival · stable · growing · scaling · restructuring)
Stage 6  Financial challenges (multi-select, max 3: receivables stuck · inventory issues · high payroll % · supplier price rise ·
                               no budgeting · no MIS · manual reporting · penalties paid · no controls)
Stage 7  Analysis + Result    (score, risks, opportunities, recommended services + tools + compliance items)
Stage 8  Conversion           (book consultation / request quote / start free account · save & email result)
```

### 5.8.2 Interaction spec

| Aspect | Spec |
|---|---|
| **Progress** | Stepper shows "Question 4 of 8" + an animated progress ring + "~40 seconds left" (estimates by stage) |
| **Visual** | Each stage has a purpose-built visual (e.g. Stage 4 shows pain cards with icons; Stage 6 shows challenge chips with severity sliders) — never a plain radio list |
| **Input type** | Large tappable cards/chips; single screen per question on mobile; keyboard: number keys select, Enter advances; back always available without losing answers |
| **Live analysis feel** | Between Stage 6 and Stage 7: a 1.2 s "analyzing" sequence with 4 progressive statements ("Comparing against 1,240 businesses…", "Checking compliance exposure…", "Benchmarking cost ratios…", "Building your action list…") — honest, non-fake messaging (it *is* running the rules engine), and skippable |
| **Result page** | Financial Health Score (0–100) with subscale bars; top 3 risks with ৳ impact estimate ranges and why; top 3 opportunities; recommended services ranked with the *reason* ("because your accounting system is Excel + your problem is no profit visibility"); recommended tools; relevant compliance obligations; 30/60/90-day action plan |
| **Shareability** | Unique expiring token URL; "Share with my partner/accountant" button; PDF download of the result (branded, with disclaimer) |
| **Privacy** | No login required; result stored with token for 90 days; optional email to save permanently; clear statement of what's stored |
| **Personalization hook** | Result page CTA pre-fills consultation form with industry/size/problems; later, portal signup inherits the profile |
| **CRM handoff** | Every completion creates a `Lead` with `source=diagnostic`, the full answer set, score, and recommended services — visible in Filament with the recommended-services badge and lead score |

### 5.8.3 Scoring model (documented, deterministic, admin-tunable)

- Each answer contributes weighted points to 5 dimensions: **Compliance risk**, **Financial visibility**, **Cost control**, **Process maturity**, **Growth readiness**.
- Weights and rule mappings live in the DB (admin-editable table `diagnostic_rules`) — not in code — so the model can be tuned without a deploy.
- Recommendation ranking = rule matches → service map, sorted by (severity × feasibility) with a tie-break by typical margin/fit.
- **Documented limitation shown to the user:** "This is a rule-based assessment using industry benchmarks, not an audit or professional advice."

### 5.8.4 Acceptance criteria

1. Complete flow ≤ 2 minutes for a median user; ≤ 90 s on repeat (measured in analytics).
2. Abandonment-safe: answers persist in localStorage + server draft on each step; resuming restores position.
3. Result page renders in ≤ 1.5 s after submission; lead row created within 2 s; consultant notification email/SMS fires.
4. All scoring rules and recommendations are admin-editable and versioned; a result records which rule version produced it.
5. Works without JS for the *content* of the intro and intro-to-result explanation; the interactive flow requires JS (acceptable) but shows a no-JS alternative (a simple form that emails the result).
6. Fully keyboard navigable; screen-reader announces stage changes; contrast and touch targets compliant.
7. Bangla version available and tested with the same scoring rules.

---

## F9 — COST EFFICIENCY EXPERIENCE

**Purpose:** Own the concept "Your Biggest Cost May Be the One You Don't See." This is the strongest differentiator and the best door-opener for a paid engagement.

**Routes:** `/cost-efficiency` (experience), plus the calculator inside `/tools/cost-efficiency-calculator`.

### 5.9.1 Narrative structure (scroll-driven, 6 beats)

```
Beat 1  Headline: "Your Biggest Cost May Be the One You Don't See."
Beat 2  The visible costs: Revenue → Necessary Costs (bars animate in, all orderly, green)
Beat 3  The drift: Avoidable Costs appear (gold), gentle alarming motion — "2-6% of operating cost is
        typically avoidable" (with method link)
Beat 4  Hidden leakage: 5 pillars reveal, each with an example and a typical range:
        ① Purchase price variance  ② Supplier dependency  ③ Expense leakage (duplicate/unapproved)
        ④ Inventory variance/pilferage  ⑤ Payment controls (early payment, unauthorized credit)
Beat 5  Profit impact: interactive turnover slider + 5 category sliders → live "avoidable cost" range (৳),
        with a waterfall showing profit before/after recovery
Beat 6  "What a Cost Efficiency Review delivers" + CTA (Book a review / Get a quote / Download the checklist)
```

### 5.9.2 Estimator specification (must be honest — this is a credibility artefact)

| Element | Spec |
|---|---|
| Inputs | Industry, annual turnover (slider + input), category spends (% or ৳: procurement, payroll, utilities/logistics, marketing/other), 5 yes/no process questions |
| Model | Documented benchmark ranges per industry and category (sourced: NBR/industry reports/internal engagement data with consent), question-weighted adjustment, output as a **range** (low–high) with the mid-point labelled as a typical value |
| Output | Avoidable cost range in ৳, leakage breakdown chart by pillar, confidence label ("based on your inputs; a review validates this within ±X%"), realistic recovery timeline (3–6 months), payback on a review fee |
| Guardrails | Never promise savings; always show the range + method + disclaimer; never use the user's numbers in marketing without consent; show "how we calculated this" expandable with the benchmark table |
| Conversion | Primary: Book a Cost Efficiency Review; secondary: Get a quote; tertiary: download the 5-pillar checklist (email capture); all tagged with the estimate so the sales team sees the opportunity size |
| Persistence | Result saved as `LeakageEstimate` with token → shareable link + PDF; linked to the lead |

### 5.9.3 Interaction details

- The 5 pillars are **interactive cards**: hover/focus reveals the diagnostic question and the typical range; click expands a full example narrative with a mini chart.
- The turnover slider animates the whole page's numbers (9D continuity): the waterfall, the pillar ranges, and the profit impact band all update together, plus a sticky summary bar.
- A "compare with industry" toggle overlays the industry median band on the waterfall.
- Mobile: beats become stacked sections; sliders are large-thumb with haptics (where supported); sticky summary bar with the range and CTA.

### 5.9.4 Acceptance criteria

1. Estimator outputs a range with a method disclosure; no single "you will save ৳X" claims — verified by copy review + a test that asserts the disclosure element exists.
2. All 5 pillars have: name, the process question, the typical range, an example, and a policy note.
3. Slider interaction updates all dependent visuals ≤ 16 ms per frame on desktop; mobile uses throttled updates (rAF) and remains smooth ≥ 30fps on a mid-range device.
4. The page works with no WebGL and under reduced-motion (static but complete).
5. Result page is shareable (token), exportable (PDF), and creates a lead with the estimate attached.
6. Bangla version present; all financial figures use BD formatting.

---

## F10 — COMPLIANCE INTELLIGENCE CENTRE

**Purpose:** Calm, intelligent compliance management. Users must never be surprised by a deadline. Visual urgency is used carefully — escalating only as the date approaches.

**Routes:** `/compliance-calendar` (public), `app.dhakafin.com/compliance` (personalized).

### 5.10.1 Public calendar

| Element | Spec |
|---|---|
| Views | Month grid · Upcoming list · By-obligation table · ICS/Google Calendar export |
| Filtering | Entity type, VAT-registered or not, turnover band, industry, obligation family (VAT/TDS/Tax/RJSC) |
| Each obligation | Title, form (Mushak 9.1), due rule, applicable-to, penalty note, related rate page, "what you need to file" checklist |
| Recurring logic | Monthly VAT return by 15th; monthly TDS deposit by 15th; quarterly turnover-tax; biannual/annual returns; RJSC AGM/filing dates; advance tax instalments; changes to dates overridden by SRO and announced via banner |
| Freshness | "Calendar rules verified {date} · Next review {date}" + report-an-error |

### 5.10.2 Portal compliance centre

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│ Compliance                                    [Aug ▾]  [ Status: All ▾ ]  [Export]│
├───────────────────────────────────────────────────────────────────────────────────┤
│ ○ 6 days   MUSHak 9.1 — VAT Return (Aug)      Due 15 Oct · BIN •••952  [ Prepare ]│
│            Needs: sales register, purchase register, input tax credit ledger       │
│            ▓▓▓▓▓▓▓▓░░ 2 of 3 documents received        [ Ask accountant ]          │
│                                                                                    │
│ ○ 11 days  TDS Deposit (Sep)                   Due 15 Oct · ৳42,500 est  [ View ]   │
│ ✓ Done     Income Tax Return FY 2024-25        Filed 12 Sep · Ack #…   [ Receipt ]  │
│ ⚠ Overdue  RJSC Form …                         Was due 30 Jun · Penalty risk [ Fix ]│
├───────────────────────────────────────────────────────────────────────────────────┤
│ TIMELINE VIEW  ▸ 12-month ribbon with density heat map of obligations              │
│ REGULATORY CHANGES AFFECTING YOU  ▸ 2 items (SRO 173: TDS sec 89 rate change)      │
│ MISSING DOCUMENTS  ▸ 3 items blocking filings                    [ Request → ]     │
└───────────────────────────────────────────────────────────────────────────────────┘
```

| Feature | Spec |
|---|---|
| **Obligation generation** | From templates + business profile; idempotent; recalculated when the profile changes (e.g. user becomes VAT-registered → adds obligations) |
| **Statuses** | Not started · In progress · Waiting on client · Filed · Overdue · Not applicable |
| **Urgency styling** | Calm: `--sea` accents. T-7: `--warn` + a single accent dot. T-3/T-1: `--risk` + a progress ring + text "3 days left". Overdue: `--danger` + penalty note + escalation CTA. **No red flooding, no flashing, no countdown clocks.** |
| **Document prerequisites** | Each obligation lists required documents; the UI shows the checklist state and blocks "Prepare" until the minimum set exists (with an override that records who overrode it) |
| **Assignment** | Each obligation has an owner (client-side contact or DhakaFin consultant); "waiting on you" vs "we're handling it" is always explicit — reduces anxiety and support tickets |
| **Notifications** | Per §2.7 cadence, per-channel preferences, quiet hours, digest option ("one weekly summary") |
| **Filing evidence** | Acknowledge/receipt number, filed-by, filed-at, proof document attached to the obligation — permanent record for audits |
| **Regulatory changes affecting you** | A filtered feed: only SROs/circulars that touch the business's profile (e.g. VAT-registered manufacturer), with a plain-language "what changed for you" and an optional task |
| **Penalty exposure** | Where a rule exists, show an estimate ("late filing fee up to ৳X") — sourced, never speculative |

### 5.10.3 Acceptance criteria

1. Generating a full year of obligations takes ≤ 2 s for a business and is idempotent (re-running creates no duplicates) — unit tested.
2. Notification cadence fires exactly once per stage per obligation per channel — tested with a time-travel test suite.
3. Urgency colours match the specified thresholds exactly, and remain AA-contrast in every state — snapshot-tested per state.
4. Export (ICS/CSV/PDF) produces correct dates, timezone `Asia/Dhaka`, and obligation names in the user's locale — tested.
5. An overdue obligation always shows: what it is, penalty note, fastest remediation, and a one-click path to the responsible consultant.
6. Changing the business profile (e.g. registering for VAT) updates future obligations without losing history — tested.
7. No obligation can be marked "Filed" without an acknowledgement reference or an explicit "filed externally" flag with a reason.

---

## F11 — CLIENT SAAS PORTAL ("FINANCIAL OPERATING SYSTEM")

**Routes:** `app.dhakafin.com/*` per §2.1.

### 5.11.1 Portal module specifications

| Module | Purpose | Key features | Acceptance highlights |
|---|---|---|---|
| **Dashboard** | Command centre | See F7 | F7 criteria |
| **Insights** | Intelligence feed | Filters by severity/type/date; each insight: what, why (with data), impact ৳, recommended action, "create task", "dismiss + reason"; weekly digest email | Every insight traceable to source data; dismissals recorded and reported to ops for model tuning |
| **Accounting** | Books snapshot | Revenue/expense summary, category breakdown, AR aging buckets, AP aging, bank reconciliation status, journal-level drill-down (read-only v1), CSV/XLSX import of books from Tally/QuickBooks templates | Import validates every row, reports errors per line, shows a dry-run diff before commit; reconciliation status is honest (last-synced timestamp) |
| **Tax** | Tax position | Provision vs paid, TDS deducted/collected tracker, TDS certificates received/issued (with document links), AIT, assessment/notice tracker, return history, advance tax schedule | Every figure links to the source document or ledger entry |
| **VAT** | VAT position | Output/input/net VAT by month, Mushak 9.1 filing status + acknowledgements, VDS deducted by section, Mushak 6.6 certificate tracker, input credit at risk (expiring/unclaimed) | "Input credit at risk" is a signature value-add: shows unclaimed credit with ৳ value and action |
| **Compliance** | See F10 | — | — |
| **Documents (Vault)** | See 5.11.2 | — | — |
| **Reports** | Report library | MIS pack (monthly), P&L, balance sheet, cash flow, ratio analysis, budget vs actual, industry benchmark, custom date ranges; scheduled email delivery; export PDF/Excel | Reports render with the design system's print stylesheet; generation is queued with progress; versioned (regenerate creates a new version, never overwrites) |
| **Tasks** | Work loop | Client and platform tasks, due dates, priorities, evidence upload, reviewer approval, comments, recurring tasks, bulk actions | Uploading evidence moves the task to "Under review"; approval requires a reviewer; full audit trail |
| **Requests** | Service requests | Create a request (service, scope, urgency, attachments), track status pipeline (New → Assigned → In Progress → Waiting for client → Under review → Completed), see the assigned consultant and SLA countdown | Status changes notify both sides; every request links to its quote/invoice |
| **Messages** | Secure comms | Threaded conversations per business/topic, attachments, internal-only staff notes (never visible to clients), read receipts, @mentions of the account team | Internal notes are excluded server-side (tested), not merely hidden in CSS |
| **Assistant** | See F12 | — | — |
| **Billing** | Money in | Invoices, receipts, payment methods, subscription plan/usage, plan change (upgrade immediate, downgrade at period end), failed payment retry, GST/VAT-compliant invoice layout, auto-reminders | Payment wall handled gracefully: read-only access during dunning, never data loss; all gateway events idempotent |
| **Notifications** | Notification centre | All alerts, read/unread, channel preferences per category, quiet hours, digest mode | Preference changes take effect within one dispatch cycle — tested |
| **Business** | Company settings | Legal identity (name/TIN/BIN/RJSC), entity type, industry, turnover band, fiscal year, addresses, contacts, logo, multiple entities, integrations (bank statement import, email-in documents) | Profile completeness meter; changes trigger obligation recalculation |
| **Users & Roles** | Team access | Invite by phone/email, role assignment, granular permissions, deactivate, transfer ownership; who-accessed-what log for documents | Permission matrix tests: every role × every endpoint (403/200 as expected) |
| **Settings** | Personal | Profile, language (en/bn), number format (lakh-crore vs international), theme (dark/light), reduced-effects toggle, 2FA, sessions, connected devices, data export, account deletion | Export produces a complete machine-readable archive within 24 h (queued) |
| **Support** | Help | Help centre, ticket creation, escalation, SLA display, callback request, status page link | Tickets appear in the CRM-linked inbox with business context attached |

### 5.11.2 Secure Document Vault (detailed)

| Aspect | Spec |
|---|---|
| **Categories** | Accounting · Tax · VAT · Audit · Corporate (RJSC) · Banking · Payroll · Legal · Contracts · Other (admin-extensible) |
| **Organization** | Folder tree + tags + fiscal-period grouping + full-text search over titles and extracted text (OCR for scanned PDFs via Tesseract, queued) |
| **Upload** | Drag-drop, camera capture (mobile), bulk (folder), email-in address per business, chunked upload for large files, resumable |
| **Validation** | MIME + extension + magic-byte check, max size (configurable, default 50 MB), ClamAV scan, image re-encode, checksum (SHA-256), duplicates detected by checksum with a "keep both / replace" prompt |
| **Access** | Private bucket; access only via signed URLs (5–15 min); per-document permission (view/download) by role; client-only visibility for internal notes documents; every access logged |
| **Versions** | New version preserves history; "current version" badge; diff summary for key documents |
| **Metadata** | Category, expiry date (e.g. trade licence), issue date, issuer, reference number, related obligation, related task, confidentiality flag |
| **Expiry intelligence** | Documents with expiry dates feed reminders ("Trade licence expires in 30 days") — a genuinely useful compliance feature |
| **Expiry/retention** | Statutory retention rules (documents kept 7 years by default), deletion requests honoured after the retention check with a legal-hold exception |
| **Sharing** | Time-limited external share link with optional password and download limit; visible in a "shared links" manager with revoke |
| **Evidence integrity** | Every document shows uploaded-by, uploaded-at, checksum short-form, and an audit trail — important for audit defence |
| **Mobile** | Camera-first upload with auto-category suggestion and "which period is this?" prompt |

### 5.11.3 Onboarding flow (activation is the metric that matters)

```
Step 1  Business identity   (name, entity type, TIN/BIN optional, industry, turnover band)   ← 4 fields, skippable
Step 2  Profile completion  (fiscal year end, VAT registered?, employees, existing accounting system)
Step 3  Documents           (drag a bank statement / sales register; or "I'll do this later")
Step 4  Plan                (start free / start Growth trial / request a service)
Step 5  Handoff             (assign a consultant, schedule a kickoff call, show "what happens next")
```

- Progress saved server-side at every step; resume by email link.
- Target: ≤ 4 minutes to complete; ≥ 60% completion; every incomplete signup enters an automated 3-email nudge sequence with a "need help?" escape hatch to WhatsApp.
- A live "quick win" is surfaced immediately: the first upload generates a preview insight ("We found 3 months of transactions — here's your cash pattern").

### 5.11.4 Roles & permission matrix

| Capability | Owner | Accountant | Manager | Viewer | DhakaFin Staff | DhakaFin Admin |
|---|---|---|---|---|---|---|
| View dashboard/insights | ✅ | ✅ | ✅ | ✅ | ✅ (assigned businesses) | ✅ |
| Upload/edit documents | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Download documents | ✅ | ✅ | ✅ | ✅ (if granted) | ✅ | ✅ |
| Complete tasks | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Approve tasks/filings | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Manage users | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Billing & subscription | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Business profile | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| View audit log | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Impersonate (with reason, logged, client-notified) | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### 5.11.5 Portal acceptance criteria

1. Every module in §5.11.1 exists with the listed features, an empty state, a loading state, and an error state.
2. Tenant isolation proven by an automated test suite that attempts cross-business access on **every** endpoint and expects 403/404 (no data leakage, no existence disclosure).
3. All 10 rows of the permission matrix are enforced by policies and covered by tests.
4. Document upload → scan → store → accessible via signed URL ≤ 20 s p95 for a 5 MB PDF; every download logged.
5. Every ৳ figure in the portal is traceable to a source (document, ledger entry, filing, or estimate) via an inline "source" link.
6. Portal works on a 360px viewport with bottom-tab navigation; no horizontal scrolling in any module.
7. Portal loads ≤ 2.5 s LCP; skeletons everywhere; no unstyled flashes.
8. Language switch EN↔BN applies instantly across portal chrome and stored preference persists.
9. Every destructive action requires confirmation with an explicit consequence statement, and is undoable or reversible where technically possible (soft delete).

---

## F12 — AI FINANCIAL ASSISTANT ("ASK DHAKAFIN")

**Purpose:** A sophisticated financial copilot that answers real questions about the user's own business and about NBR rules — with citations and guardrails. It must feel like an intelligence layer, not a chatbot bolted on.

**Route:** `app.dhakafin.com/assistant` (also a compact entry in the portal topbar and a "Ask about this" affordance on rate/tool/report pages).

### 5.12.1 Supported question classes (v1, explicitly scoped)

| Class | Examples | Data sources | Guardrails |
|---|---|---|---|
| **Business data Q&A** | "Why did my profit fall last month?", "Which expense increased the most?", "What are my top 5 suppliers by spend?" | Tenant-scoped structured data (ledger imports, MIS, insights) | Numbers computed by SQL/rules engines; the model *narrates* but never calculates. If data is missing → say so + request it |
| **Compliance Q&A** | "What are my upcoming compliance deadlines?", "What documents are missing for my VAT return?" | Obligations, tasks, documents tables | Direct lookups, deterministic answers, no model inference on dates |
| **Regulatory Q&A** | "What changed in VAT rules recently?", "What's the TDS rate on contractor payments?" | Curated corpus: verified rate rows + SRO summaries + our explainers (RAG) | **Answers only from the verified corpus**; always cite the rate row/SRO/explainer; if not in corpus → human fallback. Zero free-form legal interpretation |
| **Explain my statements** | "Explain my P&L.", "What is gross margin and why did it move?" | Report data + glossary corpus | Definitions from the glossary; movements from data |
| **Action requests** | "Create a task to upload the bank statement", "Draft a reminder to my accountant" | Action registry (allow-listed tools) | Only allow-listed, reversible actions; explicit confirmation before execution; every action logged |

### 5.12.2 Answer anatomy

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│ Ask DhakaFin                                                    [ Business: ▾ ]   │
│ ┌───────────────────────────────────────────────────────────────────────────────┐ │
│ │ You: Why did my profit fall last month?                                       │ │
│ ├───────────────────────────────────────────────────────────────────────────────┤ │
│ │ ◐  Net profit fell 12% (৳1.9L → ৳1.67L) from July to August.                  │ │
│ │    Three drivers explain 94% of the drop:                                     │ │
│ │    1. Payroll +৳38,000 (overtime in packing)        ▸ 41% of the change       │ │
│ │    2. Procurement price variance +৳26,000 (3 vendors)                        │ │
│ │    3. Revenue flat, discount depth ↑ 1.4pp                                    │ │
│ │    [mini waterfall chart]                                                     │ │
│ │    Sources: Aug MIS · ledger (Aug) · vendor price list   [ open each ▸ ]      │ │
│ │    Confidence: High (complete data)                                           │ │
│ │    Suggested next: ▸ Review overtime policy  ▸ Benchmark 3 vendor prices      │ │
│ │    [ Create task ]  [ Show me the ledger rows ]                               │ │
│ │    👍 👎   ⓘ Not professional advice                                           │ │
│ └───────────────────────────────────────────────────────────────────────────────┘ │
│ [ Ask about your business, VAT, tax or compliance… ]        [ ⏎ ]  [ 🎙 ]          │
│ Suggestions: "What are my upcoming deadlines?" · "Which expense grew fastest?"     │
└───────────────────────────────────────────────────────────────────────────────────┘
```

**Non-negotiables:** every answer shows *what it's based on* (source chips that open the underlying data), a confidence indicator, and a disclaimer. Numbers are computed deterministically. Legal/regulatory answers carry the SRO/rate reference. If confidence is low: "I don't have verified information for this — here's a human who can help" (with a one-click consultation).

### 5.12.3 Technical architecture (v1)

```
User question
   → Router (intent classification: business_data | compliance | regulatory | explain | action)
   → Retrieval
        business_data → canonical metric queries (SQL views) + insight rules
        regulatory    → vector search over KnowledgeChunk (curated: rate rows, SRO summaries, explainers)
        compliance    → obligation/document/task lookups
   → Grounding pack (structured facts + retrieved passages + citations)
   → Model (provider-agnostic, streaming)
   → Guardrail pass (citation presence, no legal advice, no PII leakage, action allow-list, tone)
   → Response with source chips + confidence + feedback controls
   → Logging (question, retrieval ids, model, tokens, cost, latency, rating) → eval set
```

**Cost & safety controls:** per-business monthly query quota per plan, hard token caps, response caching for repeated regulatory questions (with identical citations), PII redaction before any provider call, provider data-retention settings configured for zero-training/zero-retention where available, and an admin toggle to disable the assistant globally.

**Evaluation:** a curated 120-question eval set (with expected facts + required citations) run before each prompt/model change; failure rate > 5% blocks release; user thumbs-down feeds weekly review.

### 5.12.4 Acceptance criteria

1. All five question classes work on seeded demo data with ≥ 90% correct factual answers on the eval set.
2. No answer appears without at least one source chip and a confidence label (asserted by test).
3. Regulatory answers never invent a rate — a test injects a fictitious rate in the question and expects the "not verified" fallback.
4. Streaming responses start ≤ 1.5 s p50; full answer ≤ 8 s p95; the UI is usable during streaming (stop button, copy, regenerate).
5. Prompt-injection resistance: documents/user content cannot alter system behaviour (test set of 20 injection attempts); outputs are sanitized before render.
6. Cost per business is tracked and capped; exceeding the cap produces a graceful upgrade prompt.
7. Every action executed via the assistant is reversible or confirmed, and appears in the audit log with the conversation id.
8. Full keyboard + screen-reader support; message history searchable; conversation exportable.

---

## F13 — INDUSTRY EXPERIENCES (11 PAGES)

**Purpose:** Prove that DhakaFin understands *your* business, with industry-specific compliance profiles, KPIs, risks and services — while keeping one coherent design language (differentiated by content, accent and illustration, not by breaking the system).

**Routes:** `/industries/[slug]` for: manufacturing · trading · retail · ecommerce · startup · sme · professional-services · real-estate · restaurant · technology · import-export.

### 5.13.1 Industry page template

| Block | Content (per industry) |
|---|---|
| **Hero** | "{Industry} accounting, tax, VAT & cost control in Bangladesh" + one-line specific promise + industry-specific visual (custom illustration/3D accent, not a generic icon) |
| **Compliance profile** | Which obligations apply (VAT registration trigger for this sector, TDS sections that matter, Mushak forms, special SROs, licences) — DB-driven from `Industry.complianceProfile` |
| **Financial DNA** | Typical revenue/cost structure of the industry (chart), typical margins, typical cost leakage hotspots, working-capital pattern |
| **KPIs that matter** | 6–8 industry KPIs with formulas and benchmark bands (e.g. manufacturing: material cost %, conversion cost, machine utilization, WIP days; retail: sales per sq ft, shrinkage %, stock turn; e-commerce: CAC, RTO rate, contribution margin, inventory days; restaurant: food cost %, labour cost %, table turn; import/export: LC cycle, duty cost %, landed cost accuracy) |
| **Pain points** | 5 industry-specific pains in owner language, each mapped to a service |
| **Industry risks & red flags** | Compliance and control risks with a "how we detect/ handle" line |
| **Recommended services** | Ranked with reasons |
| **Relevant tools** | 3 calculators with industry presets pre-filled |
| **Case study** | One industry-relevant, metric-led case study |
| **Industry FAQ** | 6–8 schema-marked questions |
| **CTA** | Book a consultation (pre-fills industry) + "Get the {industry} compliance checklist" (lead magnet) |

### 5.13.2 Visual differentiation rules

Each industry gets: a distinct illustration motif (e.g. manufacturing = machine-line geometry; e-commerce = parcel/cart flow; restaurant = circular service rhythm; real estate = layered skyline planes), an accent pair drawn from the permitted palette (sea + cyan + gold rotations), and its own KPI chart style. **Layout, components, tokens, motion and typography stay identical** — differentiation lives in content and illustration, never in structure. This keeps brand coherence and build cost sane.

### 5.13.3 Acceptance criteria

1. All 11 industries published with real, specific content for Bangladesh (no generic filler); each has ≥ 6 KPIs with formulas and ≥ 5 pain points mapped to services.
2. Compliance profile per industry is data-driven and links to the relevant rate pages and calendar entries.
3. Industry is a hook the diagnostic and consultation flows consume (pre-fill + reporting).
4. Each industry page has unique metadata, schema, and at least one internal link cluster (industry ↔ service ↔ tool ↔ rate).
5. Mobile: charts simplify to lists/bars; no horizontal scroll.
6. Admin can add a 12th industry without a developer (task DF-P6-020).

---

## F14 — GLOBAL UX, SYSTEM STATES & SIGNATURE MICRO-INTERACTIONS

### 5.14.1 Command palette (⌘K / Ctrl+K / `/`)

- Fuzzy search across: rates (with family + rate value), tools, services, industries, insights, SROs, glossary terms, and **actions** ("Book a consultation", "Download compliance calendar", "Copy today's TDS rates", "Switch language", "Reduce effects").
- Grouped results with type badges, keyboard navigation (`↑↓ Enter Esc`), recent searches, and "no results → ask a human" fallback that opens the contact form pre-filled with the query.
- Ranking: exact prefix > title match > synonyms > body match; rate results include the current value inline (e.g. "TDS sec 89 — 7.5%").
- Performance: opens ≤ 100 ms; search response ≤ 150 ms p95 (cached index); works offline for the action set.
- **Acceptance:** fully keyboard operable, screen-reader announced, no focus trap leak, results deep-link correctly, rate values come from the API (never cached stale beyond 5 minutes).

### 5.14.2 System states (every one of these must be designed, not improvised)

| State | Design requirement |
|---|---|
| **Loading** | Skeletons matching the final layout shape (never a spinner alone for > 300 ms); brand loader = animated DhakaFin glyph drawing a rising line; progressive content for slow networks |
| **Empty** | A guidance card: what this space is for, the exact next action, and (where useful) an example. No sad-face illustrations, no dead ends |
| **Error (network)** | Calm, plain-language message, retry action, offline indicator, and a link to status page; never a raw stack trace; errors logged with a correlation id shown to the user ("Reference: DF-8F2A") |
| **Error (validation)** | Inline, specific, adjacent to the field, with the fix; error summary at the top for long forms; preserved input on failure |
| **404 / 500** | Art-directed pages with a search field, top tool links, and a CTA — converting a dead end into a path |
| **Success** | Confirmation with a next step, not just a toast: e.g. after booking → "Added to your calendar · We also emailed you a checklist" |
| **Overdue/penalty** | Calm urgency, exact consequence, fastest fix, human contact |
| **Offline (PWA)** | Cached shell + "You're offline — changes will sync when you're back"; queued actions sync on reconnect |
| **Permission denied** | Explain which role is required and how to request access (with a button that notifies the owner) |
| **Rate limited** | Friendly message with a countdown, not a bare 429 |
| **Data insufficient** | "We need X to answer this" with a direct upload/connect action (never a vague "no data") |

### 5.14.3 Micro-interaction inventory (the details that create the premium feel)

| Interaction | Spec |
|---|---|
| Button hover/press | Border brightens, subtle 2px lift, magnetic drift ≤ 6px (desktop), press → scale 0.98 for 40 ms, haptic on mobile where supported |
| Link hover | Underline draws left→right (180 ms); external links get an icon |
| Input focus | Label lifts, border animates to `--sea-400`, a soft 1px glow ring appears; the cursor row highlights in tables being edited |
| Card hover | 2px lift + border glow + optional cursor spotlight; never a full-card colour flip |
| Table row hover | Row tints `--sea-tint-08`; the row's action buttons fade in from the right |
| Number change | Count-up with easing; a brief colour pulse on the changed direction; the delta chip updates simultaneously |
| Copy action | Icon morphs to a check for 1.2 s + a subtle ripple; content copied with the source link for citations |
| Filter apply | Chips animate in with a 40 ms stagger; results cross-fade with a shimmer placeholder; URL updates silently |
| Tab switch | Underline slides (FLIP), content cross-fades 160 ms, scroll position preserved per tab |
| Modal open/close | Scale 0.98→1 + blur 8→0 (220 ms); backdrop fades; focus moves to the first meaningful control; ESC closes; scroll locked |
| Wizard step | Forward: current slides left + fades, next slides in from right 12px; back reverses exactly; progress ring animates |
| Upload | Dropzone expands, file chips appear with per-file progress, scan state (scanning → verified → stored), success check |
| Chart hover | Crosshair + shared tooltip with a 120 ms follow delay; the hovered point grows; the rest of the series dims |
| Booking | Slot selection is a tactile chip grid; confirmation reveals a ticket with an add-to-calendar action |
| Notice/toast | Slides in from the bottom-right, content-aware icons, auto-dismiss 6 s, hover pauses dismissal, max 3 stacked |
| Deadlines | As days decrease, the ring closes smoothly and the label changes tone exactly at the documented thresholds |
| Scroll reveal | Sections fade + rise 16px at 20% visibility, once, 560 ms, staggered children |

**Consistency rule:** every interaction in this inventory is implemented as a shared component/variant with a documented token — no one-off animations. A PR adding a bespoke animation must reference which signature motion it extends.---

# 6. BACK OFFICE: FILAMENT ADMIN SPECIFICATION

**Principle:** if a non-technical team member cannot manage it, it is a bug. Content, rates, services, tools config, industries, leads, clients, subscriptions, documents, notifications, SEO and settings must all be manageable without code (concept §23).

## 6.1 Admin panels, roles & access

| Panel | Path | Audience | Access |
|---|---|---|---|
| **Ops panel** | `admin.dhakafin.com` | Staff (content, tax, service delivery, support, sales) | Role-based, 2FA mandatory |
| **Platform panel** | `admin.dhakafin.com/platform` | Super admins only | Subscription/user/billing/tenant management |

| Role | Can see | Can change | Restrictions |
|---|---|---|---|
| **Super Admin** | Everything | Everything | Only role that can manage roles, impersonate, delete data, change settings |
| **Tax & Compliance Lead** | Rates, SROs, slobs, deadlines, clients' compliance | Rate records, SRO library, deadline templates, verification sign-off | Cannot change pricing/content/site settings |
| **Content Editor** | Pages, services, industries, blog, FAQs, glossary, media, SEO | All content models, publish/unpublish | Cannot touch rates or client data |
| **Service Delivery** | Assigned businesses, tasks, requests, documents (scoped), messages | Task/request state, document requests, notes | Cannot see billing or other teams' clients |
| **Sales / CRM** | Leads, consultations, quotes | Lead pipeline, quotes, consultations | No document access; masked financials |
| **Support** | Tickets, businesses (read), users (read) | Ticket state, notes; trigger password reset | No financial data edit |
| **Finance/Ops Admin** | Invoices, subscriptions, payments | Invoices, refunds, plan assignment | No client document access |
| **Read-only Auditor** | Everything (logs included) | Nothing | Cannot export client documents; can export audit logs |

**Mandatory admin safety rails:** two-step verification for *any* rate change (entered by one, verified by another), reason-required impersonation with client notification, irreversible-action confirmations that state consequences, and full activity logging on every model (`spatie/laravel-activitylog`) with a per-client "who accessed my data" view.

## 6.2 Filament resource inventory

| Group | Resource | Key features |
|---|---|---|
| **Regulatory** | `RateFamilyResource` | Order, description, basis, source links |
| | `RateResource` ⭐ | Section reference, rate type (percent/fixed/range/table), value(s), base, applicability, taxpayer type, conditions, `effective_from`/`effective_to` with overlap validation, SRO relation, source URL, verification (verified_by/at), status workflow (draft → reviewed → verified → superseded), change note, auto-supersede action, "publish change" action that triggers alerts/revalidation |
| | `TaxSlabResource` | Year, taxpayer type, ordered slabs, surcharge/rebate rules, validation (no gaps/overlaps), visual slab preview |
| | `SroResource` | Number/year/date, title, plain-language summary, PDF upload, affected rate relations, status; bulk import from PDF with manual verification queue |
| | `CircularResource` | Same pattern, lighter |
| | `ComplianceDeadlineResource` | Obligation type, applies-to criteria builder (entity type, turnover band, VAT-registered, industry, seasonality), due rule DSL ("15th day of following month", "30 days after FY end"), form reference, penalty note, active window, version |
| | `RateChangeAlertResource` | Auto-created on rate publish; edit copy, preview, schedule send, delivery stats |
| | `SourceWatchResource` ⭐ | The SRO-watcher queue: list of NBR source URLs with last-checked timestamp, "mark checked", "found change → create draft rate" action, staleness alerting |
| **Content** | `PageResource` + **page builder** ⭐ | Section blocks (hero, feature-grid, flow-embed, rate-table-embed, tool-embed, faq, cta, testimonial, case-study, rich-text, comparison, gallery) with drag-drop ordering, per-block visibility by locale, preview, draft/publish, revisions with restore |
| | `ServiceResource` | All fields from §2.4; workflow steps and deliverables as repeaters; related tools/rates pickers; sample deliverable PDFs |
| | `IndustryResource` | Compliance profile builder, KPI repeater, pain point → service mapping, benchmark bands |
| | `PostResource` (Insights) | Rich editor with blocks, cover image with focal point, author/reviewer, `review_date`, categories/tags, SEO panel with SERP preview, scheduling, revision diff |
| | `FaqResource` | Polymorphic attach to page/service/tool/rate; order; schema toggle |
| | `CaseStudyResource` | Metrics repeater (metric, before, after, period), consent flag required before publishing |
| | `TestimonialResource`, `TeamMemberResource`, `GlossaryTermResource` | Bilingual EN+BN pairs, auto-linkable glossary terms, consent flags |
| | `MediaLibrary` | Folders, crop/resize, AVIF/WebP conversion, **alt text required**, duplicate detection |
| | `MenuItemResource`, `RedirectResource`, `GlobalSettingResource` | Header/footer builder with nesting + visibility rules; 301 manager with hit counts; site-wide settings (contacts, WhatsApp, address, alert banners, feature toggles) |
| **Tools** | `ToolResource` | Enable/disable, display order, category, defaults, preset chips, disclaimers, related links, SEO fields, formula config where the rule engine allows (rate lookups always live) |
| | `BenchmarkResource` | Industry benchmark bands used by the leakage estimator and dashboards — versioned, sourced, with method notes |
| | `DiagnosticRuleResource` | Scoring weights, answer→dimension maps, recommendation mappings, version + activate |
| **CRM** | `LeadResource` | Kanban + table; pipeline stages; source/UTM; diagnostic result link; estimate link; lead score; assignment; activity timeline (calls, messages, quotes, consultations); "convert to client" action creating the business + portal invite |
| | `ConsultationResource` | Calendar view with availability, slot booking, reminders, outcomes, no-show tracking |
| | `QuoteResource` ⭐ | Line items (service, qty, frequency, fee, discount), auto-totals, VAT handling, terms template, validity, PDF generation, send-by-email/WhatsApp, client accept/reject links (public token page), accept → creates service request + invoice draft |
| | `ActivityResource` | Calls, meetings, notes, emails per lead/client |
| **Platform** | `BusinessResource` | Profile, entities, contacts, users, subscription, documents (scoped), health score, statements summary, service history, notes, tags (industry/segment/risk) |
| | `UserResource` | Search by phone/email, roles, per-business memberships, 2FA status, sessions, invites, deactivate (soft), GDPR-style export/delete actions |
| | `PricingPlanResource` | Tiers, prices, features, limits, visibility, ordering, "popular" flag, trial config |
| | `SubscriptionResource` | Status, period, gateway refs, plan change (prorated), pause, cancel with reason, dunning state |
| | `InvoiceResource` | Draft from quote or manual, VAT line, due date, partial payments, gateway links, PDF, reminders, void with reason, receipt download |
| | `PaymentResource` | Gateway events, reconciliation flag, refunds with reason |
| | `NotificationTemplateResource` ⭐ | Per-event, per-channel templates with variable picker + preview + test send + bilingual variants; versions |
| | `NotificationLogResource` | Delivery status per channel, opens/clicks, failures with retry |
| | `FeatureFlagResource` | Toggles with rollout % and audience targeting |
| | `AuditLogResource` | Immutable, filterable by actor/subject/action/date, export CSV (auditor role) |
| **Service Delivery** | `ServiceRequestResource` | Pipeline board, SLA countdown chips, assignment, scope edit with reason, linked quote/invoice/documents, internal comments |
| | `TaskResource` | Board + table, type (client/platform), due dates, priority, evidence document, reviewer approval, recurring templates ("monthly bank statement request") |
| | `DocumentRequestResource` | Bulk request generator (e.g. "request all bank statements for Q3 from 40 clients") with per-client tracking |
| | `DocumentResource` | Metadata, preview, download (audited), category, expiry, permissions, share links, retention hold, bulk tag/move |
| | `ReportTemplateResource` | MIS/report templates, sections, delivery schedule, branding |
| **System** | `AssistantLogResource` | Conversation review, ratings, flagged answers, prompt version, token cost — with "mark as training example" |
| | `InsightDefinitionResource` | The rule library for dashboard/portal insights (condition, qualifier text, severity, recommended action, service mapping) |
| | `SystemHealthResource` | Queue depth, failed jobs, cache/DB status, rate freshness ages, backup status, uptime — the ops cockpit |

## 6.3 Admin UX standards (the admin must also feel premium)

- **Navigation:** grouped sidebar with icons, collapsible; a global ⌘K search (Filament's global search configured across all key resources with sensible result limits and permission filtering).
- **Tables:** saved views/filters per user, sticky headers, inline editing for safe fields, bulk actions with confirmation modals that state row counts, CSV/Excel export respecting permissions, row click → edit with a "view" split, and **relative timestamps with absolute on hover**.
- **Forms:** logical grouping into tabs/sections (Identity · Rates · Provenance · Publication · SEO), inline validation, helper text on every statutory field (e.g. "Enter the exact rate as published in the SRO; use the range type if the SRO specifies multiple rates"), preview of how the record renders publicly, and unsaved-changes guards.
- **Guardrails:** rate changes require verification, no silent overwrites (versions + activity log), destructive actions require typed confirmation, and every publish action shows a diff.
- **Widgets on the admin dashboard:** new leads today (with source breakdown), consultations this week, quotes awaiting response, revenue MRR/collections, overdue client obligations (count + penalty exposure), rates pending verification, stale sources (> 45 days), failed jobs, document requests outstanding, top-performing content, top search queries with zero results (**content gap goldmine**).
- **Accessibility:** Filament's defaults are decent — verify keyboard navigation through tables/forms, sufficient contrast in dark mode, and screen-reader labels on custom widgets.

## 6.4 Admin workflows (SOPs implemented as guided actions)

| Workflow | Steps |
|---|---|
| **Add / change a rate** ⭐ | 1) Open SourceWatch → mark source checked (timestamp + screenshot/PDF attached) → 2) Create draft rate with SRO reference → 3) Second reviewer verifies (two-person rule) → 4) "Publish change" → system supersedes the previous rate, writes the changelog, revalidates affected Next.js pages (`revalidateTag`), creates the `RateChangeAlert`, queues notifications to subscribers, opens client tasks for affected businesses, and drafts an Insights article → 5) Verify delivery stats 24 h later |
| **Publish content** | Draft → SEO panel completeness check (title, description, OG, internal links ≥ 3) → reviewer assignment → preview → schedule/publish → auto-post to sitemap + newsletter queue (optional) |
| **Handle a lead** | Auto-assigned by round-robin/industry → activity logged → qualification → consultation booked → quote generated from a service template → send → track → won → convert to client (creates Business + portal invite + onboarding checklist) |
| **Client onboarding (post-sale)** | Converted lead → onboarding checklist task list auto-created (KYC docs, bank access, ledger import, kickoff call, accountant assignment, compliance profile confirmation) → portal access sent → first MIS scheduled |
| **Monthly MIS cycle** | Scheduler creates the monthly task set for every client → documents requested → books imported/updated → review queue → manager approval → report generated → delivered to client portal + email → insights generated |
| **Handle an overdue obligation** | Automation flags → escalates to the responsible consultant → consultant contacts client (call/WhatsApp) with the consequence and remediation → resolution documented → obligation marked filed/completed with proof |
| **Refund / cancellation** | Reason required → retention offer path → approval by Finance → proration/refund via gateway → invoice credit note → access policy applied (immediate vs period end) → exit interview note saved |
| **Data subject request** | Export-all request → queued archive → secure download link (expires 72 h) → logged. Deletion request → retention check (statutory holds) → approve with documented exception list → cascade delete + anonymize analytics → confirmation |

## 6.5 Admin technical requirements

- Filament resources must not contain business logic — move to Actions/Services so the same logic is reusable by the API and CLI.
- Every resource: custom policies, scoped queries for tenant data, `authorize()` on all actions, and tests for permission enforcement.
- Rate and deadline models must be versioned (`spatie/laravel-activitylog` + explicit `version` column) — never lose the history of what the public saw and when.
- All list views paginate efficiently (no N+1; eager loading enforced by query review), with indexes on frequently filtered columns.
- Preview links from admin to the public site must include a signed preview token for drafts.
- Bulk operations are queued when they affect > 100 records; progress is visible.

---

# 7. GROWTH, SEO, CONTENT & ANALYTICS

## 7.1 Growth thesis

Bangladeshi businesses search for *facts* (rates, deadlines, deadlines' consequences) far more than they search for *services*. Therefore: **win the facts, earn the trust, then offer the service.** Every fact page is engineered to (a) rank, (b) be lifted by AI answer engines, (c) convert into a tool, then a diagnostic, then a conversation.

**Priority keyword clusters (seed list):**

| Cluster | Example queries | Landing surface | Commercial intent |
|---|---|---|---|
| TDS rates | "tds rate bangladesh", "tds on contractor payment rate", "section 89 tds", "tds on rent 2026" | `/rates/tds/*` | Medium |
| VDS / VAT | "vds rate", "vat rate bangladesh", "mushak 9.1", "vat registration limit", "turnover tax 3%" | `/rates/vds`, `/rates/vat`, `/rates/thresholds` | Medium-High |
| Income tax | "income tax slab 2026 bangladesh", "tax rebate investment limit", "minimum tax" | `/rates/income-tax` | Medium |
| Corporate tax | "corporate tax rate bangladesh", "private limited company tax", "bank company tax rate" | `/rates/corporate-tax` | Medium |
| Calculators | "vat calculator bangladesh", "tds calculator", "income tax calculator 2026", "break even calculator" | `/tools/*` | High |
| Compliance calendar | "vat return due date", "income tax return deadline 2026", "rjsc filing deadline" | `/compliance-calendar` | High |
| Service intent | "accounting firm in dhaka", "vat consultant bangladesh", "virtual cfo bangladesh", "cost reduction consultant" | `/services/*`, `/pricing` | Very High |
| Industry intent | "accounting for e-commerce business bangladesh", "restaurant vat", "import export documentation" | `/industries/*` | High |
| Bangla intent | "ভ্যাট রেট", "টিডিএস হার", "আয়কর স্ল্যাব", "মূসক ৯.১" | Bangla versions + dedicated Bangla explainer content | High (underserved) |

## 7.2 Content engine

| Content type | Cadence | Owner | Purpose |
|---|---|---|---|
| **Rate/fact pages** | Auto-maintained + reviewed weekly | Tax lead | Traffic engine; must be flawless |
| **SRO/Circular explainers** | Within 48 h of publication | Tax lead + editor | Authority + alerts + retention |
| **Deep guides** ("The complete VAT guide for Bangladeshi SMEs") | 2/month | Content + tax review | Topical authority, link magnet |
| **Industry guides** | 1/month | Content + industry specialist | Commercial intent capture |
| **Calculators** | 1–2/month per quarter plan | Product + dev | Engagement + backlinks + lead capture |
| **Case studies** | 1/quarter per service line | Delivery + client consent | Conversion proof |
| **Newsletter** ("DhakaFin Intelligence") | Weekly | Editor | Retention, re-engagement, authority |
| **Video/short-form** | 2/month | Marketing | Explainers in Bangla; social distribution |
| **Templates/downloads** (invoice, voucher, payroll sheet, cash-flow model, compliance checklist) | 4/quarter | Delivery | Lead magnets + backlinks |

**Editorial standards:** every article has an author and a named reviewer with credentials, a "reviewed on" date, a sourced fact table, and a correction policy. Claims must cite NBR sources with links. **No AI-generated publishable content without expert review** — AI may draft structure and Bangla translation, never the statutory fact.

## 7.3 Technical SEO checklist (per phase gate)

- Semantic HTML, one H1, logical heading order; server-rendered critical content.
- Unique titles (≤ 60 chars) and descriptions (150–160), OG + Twitter cards with dynamic images.
- Canonicals, hreflang (`en`/`bn-BD`), pagination handled with `rel=next` conventions and self-canonicals.
- XML sitemaps split by type (pages, rates, tools, insights, SRO) + `robots.txt` with environment rules; `app.` and `admin.` disallowed and noindexed; staging behind auth + noindex.
- Structured data: Organization (+sameAs, logo, contactPoint), WebSite+SearchAction, BreadcrumbList everywhere, Dataset for rates, FAQPage, Article, Service, SoftwareApplication, Event for deadlines, HowTo where relevant. Validate in Rich Results Test before each release.
- Core Web Vitals budgets enforced in CI (Lighthouse CI with assertions per URL).
- Internal linking: every page ≥ 3 contextual internal links; pillar/cluster architecture documented in a spreadsheet and reviewed monthly; orphan-page report automated.
- Image SEO: descriptive filenames, alt text required in the media library, AVIF/WebP, width/height set.
- International: `hreflang` pairs correct, Bangla pages self-canonical, no machine-translated thin duplicates — Bangla content is genuinely re-written, not auto-translated.
- Local SEO: Google Business Profile, consistent NAP, service-area content that is genuinely useful (not doorway pages).
- Log-file and GSC monitoring: monthly crawl-stat review, index coverage alerting, query-gap report → content backlog.

## 7.4 Analytics & event taxonomy (v1 core — full list in Appendix G)

| Event | Trigger | Key properties |
|---|---|---|
| `page_view` | Every page | route, locale, tier, referrer |
| `rate_viewed` | Rate page/detail | family, section, fiscal_year |
| `rate_searched` | Search submit/typing | query, result_count, zero_results |
| `tool_started` / `tool_calculated` / `tool_saved` | Calculator | tool_slug, input_summary (no PII), result_bucket |
| `money_flow_node_opened` | Node select | node_slug, source |
| `diagnostic_started` / `step_completed` / `completed` | Diagnostic | step, industry, size_band, duration |
| `leakage_estimated` | Estimator result | industry, turnover_band, estimate_bucket, confidence |
| `cta_clicked` | Any CTA | cta_id, location, service/industry context |
| `consultation_booked` | Booking success | service, mode, slot_lead_time |
| `lead_submitted` | Any form | source, form_id, utm_* |
| `account_created` / `onboarding_step` / `onboarding_completed` | Portal | step, time_to_complete |
| `document_uploaded` | Vault | category, size_bucket, file_type |
| `task_completed` | Portal | type, on_time (bool) |
| `insight_viewed` / `insight_actioned` / `insight_dismissed` | Insights | insight_type, severity, action |
| `assistant_asked` / `assistant_rated` | Assistant | intent_class, confidence, rating, latency_ms |
| `subscription_started` / `plan_changed` / `cancelled` | Billing | plan, mrr, reason |
| `notification_sent` / `opened` / `clicked` | Server-side | channel, template, obligation_type |
| `search_zero_results` | Site search | query (content-gap reporting) |

**Rules:** no PII in analytics (no names, phones, TIN, amounts tied to identifiable businesses); server-side events for anything money-related; UTM parameters preserved from first touch to conversion; PostHog funnels built for the flywheel (search → rate → tool → account → activation → paid).

## 7.5 CRO experiments (queued, each with a hypothesis and a primary metric)

| # | Hypothesis | Variant | Primary metric |
|---|---|---|---|
| 1 | A live rates strip in the hero increases trust and tool clicks | Hero with vs without the rates strip | Tool click-through |
| 2 | Inline rate-page calculators convert better than a link to the tool page | Inline mini calculator vs CTA link | Account creation / tool completion |
| 3 | A range-based leakage estimate converts better than a single number | Range + confidence vs point estimate | Consultation bookings (quality-adjusted) |
| 4 | Transparent pricing increases qualified leads | Prices visible vs "contact us" | Qualified lead rate |
| 5 | Diagnostic before consultation increases show-up rate | Diagnostic-first vs direct booking | Consultation show-up + close rate |
| 6 | WhatsApp CTA vs phone CTA on mobile | Channel variants | Contact rate |
| 7 | Bangla-first headline on Bangla pages | Bangla headline vs English headline on `bn` locale | Bounce + conversion |
| 8 | Checkout with local wallets first | bKash-first vs card-first | Trial→paid conversion |

**Experiment discipline:** one primary metric per test, minimum 2-week run or 100 conversions per variant, documented in a results log regardless of outcome, and never test during a rate-change news spike.

## 7.6 Launch marketing playbook (first 90 days after public launch)

| Week | Action |
|---|---|
| 1–2 | Publish the rate hub + 13 tools; submit sitemaps; GSC + GA4 verified; Google Business Profile live |
| 3–4 | 10 deep guides (top clusters); Bangla versions of the top 5; first newsletter; LinkedIn/Facebook founder content |
| 5–6 | Outreach: chambers (DCCI/MCCI), SME associations, CA firms (channel), business Facebook groups, university business clubs for startup content |
| 7–8 | Free tools PR: "Bangladesh's first live TDS/VDS rate hub with SRO references" angle; HARO-style expert commentary; LinkedIn thought-leadership on compliance |
| 9–10 | Webinars: "VAT return without penalties" + "5 hidden costs killing your profit" (Bangla), recorded and repurposed |
| 11–12 | Case-study release (first 3 clients with consent), referral program for existing clients, partner onboarding for CA firms |

**Guardrail:** growth never outpaces service capacity — leads are throttled by consultant availability (a lead that cannot be served destroys the brand faster than no lead).
---

# 8. THE MASTER ROADMAP — 11 PHASES, 281 NUMBERED TASKS, 11 GATES

**How to read the roadmap:**

- **Phase** = a shippable slice of the product with a hard gate. Never start the next phase before the gate passes.
- **Task ID** = `DF-P<phase>-<number>` — use it in branches, commits, issues and the changelog.
- **Effort** = engineering/design days for one competent full-stack developer with design support (assume 1 FTE dev + 0.5 designer + 0.3 content/tax reviewer; the founder covers product, sales and service delivery).
- **Phase duration** assumes part-time specialist help. A larger team compresses calendar time, not the task list.
- **Gate** = the objective, testable condition to move on. Gates include quality, not just features.
- **Total programme estimate:** ~380–470 working days of build effort across ~10–14 calendar months at 1 FTE; ~5–7 months with 2–3 engineers.

> **🇧🇩 Banglish:** Ekta phase shesh na hole next phase e jeyo na. Task ID diye branch banao (`feat/DF-P3-014-...`), tai progress track kora easy hobe. Gate criteria fail korle — ship koro na.

---

## PHASE 0 — DISCOVERY, DECISIONS & FOUNDATIONS
**Duration:** 1 week · **Effort:** 4–6 days · **Owner:** Founder + Product

**Objective:** Remove every unknown that would otherwise cause rework in Phases 1–3: scope, tech decisions, brand assets, legal, accounts, and content sources.

| ID | Task | Output / DoD | Days |
|---|---|---|---|
| DF-P0-001 | Run the Phase 0 checklist (§0.4) and record every outcome | Completed checklist committed to `docs/blueprint/phase0-checklist.md` | 1 |
| DF-P0-002 | Confirm stack decisions ADR-001…ADR-010 + **decide ADR-011** (portal frontend path: separate Next app vs Inertia) | ADR files committed with accepted status | 0.5 |
| DF-P0-003 | Competitor/design audit: 15 sites (BD accounting firms, local SaaS, global fintech) → notes on what to avoid and what to learn | `docs/design/competitive-audit.md` with screenshots + "never do this" list | 1 |
| DF-P0-004 | Brand asset lock: logo/wordmark, monogram, favicon set, OG template, tone-of-voice one-pager | Assets in `docs/brand/` + tokens file seeded from §3.2 | 1 |
| DF-P0-005 | NBR source-of-truth register: every URL/PDF we will monitor for rates, with owner and check frequency | `docs/compliance/nbr-sources.md` + entries ready for `SourceWatch` seeding | 0.5 |
| DF-P0-006 | Professional-services reality check: confirm which credentials, team names, addresses, registrations may be published | Approved copy list (nothing published without evidence) | 0.5 |
| DF-P0-007 | Legal pack: Terms, Privacy, Refund, Disclaimer, cookies/consent approach, NDA template | Draft documents ready for counsel review | 1 |
| DF-P0-008 | Success metrics + analytics plan agreed (KPIs from §1.8, event taxonomy from §7.4) | `docs/analytics/measurement-plan.md` | 0.5 |
| DF-P0-009 | Content inventory: list the first 60 pages to write (rates, tools, services, industries, guides) with owners and priority | Content backlog spreadsheet | 0.5 |
| DF-P0-010 | Risk register created (technical, legal, commercial, capacity) with owners and mitigations | `docs/blueprint/risk-register.md` | 0.5 |

### 🚦 GATE G0 — Foundation sign-off
- [ ] All ADRs accepted; stack and portal path fixed
- [ ] Brand assets + tokens approved by the founder
- [ ] Legal drafts exist (counsel review scheduled)
- [ ] NBR source register populated with ≥ 20 verified sources
- [ ] Analytics/event plan approved
- [ ] No unresolved "we'll decide later" item in scope, stack, or legal

---

## PHASE 1 — DESIGN SYSTEM, ARCHITECTURE FOUNDATION & CI/CD
**Duration:** 2 weeks · **Effort:** 12–18 days (the v1 PDF's "Step 1", completed properly and *audited*)

**Objective:** Build the token pipeline, component library skeleton, repository structure, environments, and CI/CD so that every later phase is assembled from a real system rather than bespoke pages.

| ID | Task | Output / DoD | Days |
|---|---|---|---|
| DF-P1-001 | **Audit v1 "Step 1" claims** — inventory what exists in code/Figma vs what was only planned | Written gap report; tasks re-opened where needed | 0.5 |
| DF-P1-002 | Create monorepo per §4.2 with package boundaries and TypeScript project references | Repo builds locally with `pnpm dev` and `composer test` | 1 |
| DF-P1-003 | Build the **token pipeline**: `df.tokens.json` → CSS vars + Tailwind theme + TS constants; validate no raw hex in components (ESLint rule) | `packages/tokens` + CI check for hardcoded values | 1.5 |
| DF-P1-004 | Font pipeline: self-host Jakarta/Space Grotesk/Hind Siliguri/JetBrains Mono, subset latin+bengali, preload strategy, font-display rules | Font budget ≤ 180 KB; CLS from font swap ≈ 0 | 1 |
| DF-P1-005 | Implement the **DFDS primitives (batch 1):** Button, Input/Field, Select, Card, Badge, Chip, Tooltip, Modal, Drawer, Tabs, Accordion, Toast, Skeleton, Breadcrumb, Progress/Stepper, Table shell | Storybook-like gallery page (`/design-system` internal) with all states | 4 |
| DF-P1-006 | Implement **layout shells:** marketing layout (header/footer/CTA bar), portal layout (rail + topbar + bottom tab bar), reading layout | All three render at 6 breakpoints with no overflow | 2 |
| DF-P1-007 | Implement the **experience-tier system** (`useExperienceTier`, cookie persistence, "Reduce effects" toggle) per §3.9 | Tier detection + manual override tested on 4 simulated devices | 1.5 |
| DF-P1-008 | Motion foundation: GSAP + Motion setup, Lenis, shared motion tokens, `MotionProvider` that disables everything under reduced-motion | A motion demo page proving each signature motion | 2 |
| DF-P1-009 | Laravel app skeleton: domain folders, base models, policies, `business_id` scoping middleware, API response envelope, error handler (RFC7807) | `GET /api/v1/ping` + architecture tests pass | 2 |
| DF-P1-010 | Filament panel skeleton at `admin.dhakafin.com` with auth, 2FA enforcement, roles, and a first resource (RateFamily) as the pattern-setting example | Admin login + role matrix test | 1.5 |
| DF-P1-011 | Environments & hosting: local, staging, production; DNS; SSL; Redis; MySQL; storage buckets; mail; queue workers; Horizon | All three environments reachable; deploys documented | 2 |
| DF-P1-012 | **CI/CD**: lint, typecheck, unit tests, build, Lighthouse budget, axe check, security audit, bundle-size guard; zero-downtime deploy; rollback | A deliberately failing PR is blocked by CI; a deploy is rolled back successfully in a drill | 2 |
| DF-P1-013 | Observability baseline: Sentry (FE+BE) with PII scrubbing, uptime checks, log shipping, Horizon dashboard, backup job + restore drill | A test error appears in Sentry with a correlation id; a restore drill succeeds and is documented | 1.5 |
| DF-P1-014 | Error/empty/loading state kit (§5.14.2) implemented as reusable components incl. art-directed 404/500 | All states viewable in the internal gallery | 1.5 |
| DF-P1-015 | Accessibility baseline: skip links, focus management on route change, live-region helper, contrast audit script over tokens | axe: 0 serious/critical on the gallery page; audit report committed | 1.5 |
| DF-P1-016 | Documentation: README, contributing guide, branch/commit conventions, ADR template, runbooks folder | A new contributor can run the project from the README alone (verified by a fresh-clone test) | 1 |

### 🚦 GATE G1 — System ready
- [ ] Design tokens are the single source of truth; CI blocks hardcoded colours/spacing
- [ ] ≥ 16 components shipped with all states and documented
- [ ] Marketing, portal and reading layouts work at 360/768/1024/1440/1920 px
- [ ] CI enforces lint + types + tests + Lighthouse + a11y + security; deploy + rollback proven
- [ ] Staging and production deployed with SSL, backups, monitoring and a documented restore drill
- [ ] Experience-tier + reduced-motion behaviour verified
- [ ] Zero accessibility violations (serious/critical) on the component gallery

---

## PHASE 2 — ULTRA-PREMIUM HOMEPAGE & SIGNATURE PUBLIC EXPERIENCE
**Duration:** 4–5 weeks · **Effort:** 33–40 days (the v1 PDF's "Step 2", extended with the money-flow signature experience, the cost-efficiency narrative and 3 industry pages)

**Objective:** Ship the homepage, the "Where Is Your Money Going?" experience, the service ecosystem, and the trust surfaces — all on real, API-driven data with the full motion/3D system in place.

| ID | Task | Output / DoD | Days |
|---|---|---|---|
| DF-P2-001 | **Audit v1 "Step 2"** — what exists, what is hardcoded, what is missing | Gap report; decide reuse vs rebuild | 0.5 |
| DF-P2-002 | Hero: layout, gradients, noise, typography, CTA cluster, philosophy line, scroll cue | Renders perfectly at all breakpoints; CLS ≤ 0.05 | 2 |
| DF-P2-003 | Hero **WebGL Financial Universe**: 11 entities, connection streams, ambient rotation, pointer parallax, scroll camera move | 60fps desktop / ≥30fps mobile-mid; ≤ 2.5 MB payload; lazy-loaded after LCP | 5 |
| DF-P2-004 | Hero **entity interaction**: hover insight labels, click → jump + auto-select money-flow node (9D continuity) | Verified interaction across both sections | 1.5 |
| DF-P2-005 | Hero **Live Control Terminal**: 5 status chips with honest data + periodic refresh, sample labelling where illustrative | No fabricated client data; test asserts API-driven rate chips | 2 |
| DF-P2-006 | Static fallback composition for `lite`/reduced-motion/no-WebGL (SVG + gradient + grain) | Identical information hierarchy without WebGL | 2 |
| DF-P2-007 | Trust ribbon (logo marquee with permission flags) | Pauses on hover/focus; hidden gracefully if no logos | 1 |
| DF-P2-008 | Four pillars bento section with mini-visuals | Each tile has an outcome metric + single link | 2 |
| DF-P2-009 | Platform preview section with tabbed command-centre mock | Pre-rendered states; clearly labelled sample data; keyboard operable tabs | 2.5 |
| DF-P2-010 | **Live rates strip** (API-driven, 5 chips, effective dates, SRO tooltips) | Values from `/api/v1/rates`; no literals; test enforced | 1.5 |
| DF-P2-011 | Free tools rail (6 cards with mini-input previews) | Horizontal snap on mobile; hover preview animation | 1.5 |
| DF-P2-012 | Cost-efficiency hook section with read-only turnover slider teaser | Slider animates mini funnel; links to `/cost-efficiency` | 2 |
| DF-P2-013 | Services ecosystem constellation (9 nodes) with preview cards | Keyboard navigable; non-visual list version in DOM | 3 |
| DF-P2-014 | Industries rail (11 chips, rotating differentiators) | Locale-aware; no overflow at 360px | 1 |
| DF-P2-015 | Diagnostic CTA band + compliance calendar preview section | Both link correctly; calendar data from API | 1.5 |
| DF-P2-016 | Proof section: 3 metric-led case cards + 2 testimonials + measurement footnote | Consent flags enforced in admin before publish | 2 |
| DF-P2-017 | Insights section (3 latest) wired to the CMS API | Renders latest published posts; empty state handled | 1 |
| DF-P2-018 | Final CTA + 6 FAQs with schema markup | Validates in Rich Results Test | 1 |
| DF-P2-019 | **"Where Is Your Money Going?" experience** — flow layout, 9 nodes, sticky insight rail, node model (7 layers each) | All 9 nodes complete with content, charts, services, tools, CTAs | 5 |
| DF-P2-020 | Money-flow **chart system**: trend/mini charts per node, draw-in animation, tooltips, accessible data tables | Every chart has a table + text summary | 3 |
| DF-P2-021 | Money-flow **interaction & states**: selection, dimming, edge pulses, URL state, keyboard nav, live-region announcements, mobile bottom sheet | Deep-link restore on first paint; back button works | 3 |
| DF-P2-022 | Money-flow **benchmark model** (`packages/tax-engine/benchmarks`) + "How we calculated this" disclosure + leak markers | Every figure traceable to the model; assumptions page published | 2.5 |
| DF-P2-023 | Money-flow **"use my numbers"** toggle for authenticated users (tenant-scoped) | Real data path works; permission tested | 2 |
| DF-P2-024 | Service ecosystem page (`/services`) + **all 9 service detail pages** with the §5.6.3 structure | Content-complete in EN; Bangla pending Phase 8 (or written now if capacity allows) | 5 |
| DF-P2-025 | Static core pages: `/about`, `/team`, `/contact`, `/clients`, `/pricing`, `/security`, `/faq`, `/help`, `/glossary`, `/editorial-policy` | Each content-complete with unique metadata + schema where applicable | 4 |
| DF-P2-026 | Booking flow (`/book-consultation`): slot picker, modes, confirmation, ICS, SMS/email | Creates Lead + Consultation; prevents double-booking; E2E tested | 3 |
| DF-P2-027 | Lead capture API + spam protection (Turnstile, honeypot, rate limits) + CRM write + auto-acknowledgement email | Verified with automated spam tests; all leads land in Filament | 1.5 |
| DF-P2-028 | **Command palette** (⌘K/`/`): fuzzy search, grouped results, actions, keyboard nav, no-results→human fallback | ≤ 100 ms open; results deep-link; a11y verified | 3 |
| DF-P2-029 | Site-wide search endpoint (rates/tools/services/insights/SRO/glossary) with ranking rules | p95 ≤ 150 ms on seeded data; zero-result queries logged | 2 |
| DF-P2-030 | Header/mega-menus + mobile full-screen nav per §2.3 | Keyboard + screen-reader verified; no focus traps | 2 |
| DF-P2-031 | Footer (5 columns + trust strip + rate-alert capture) | Links resolve; SEO surface with top 20 rate/tool links | 1 |
| DF-P2-032 | Micro-interaction pass: buttons, links, inputs, cards, table rows, copy action, toasts | Every interaction in §5.14.3 implemented via shared variants | 3 |
| DF-P2-033 | OG image generation for the homepage, service pages and money-flow nodes | Renders correctly in Slack/WhatsApp/Facebook previews | 1.5 |
| DF-P2-034 | Performance pass: lazy-load 3D, image budgets, font loading, route splitting, CLS elimination | Lighthouse mobile ≥ 90, desktop ≥ 95; LCP ≤ 2.5 s on throttled 4G | 2.5 |
| DF-P2-035 | Accessibility pass on all Phase-2 pages: keyboard, SR, contrast, reduced motion | axe 0 serious/critical; manual NVDA/VoiceOver notes documented | 2 |
| DF-P2-036 | SEO pass: metadata, canonicals, schema, sitemaps, internal linking ≥ 3 per page | Sitemap generated from the API; Rich Results validated | 1.5 |
| DF-P2-037 | Content & CMS wiring: pages/services/faqs/team/case studies all editable in Filament, with preview links | A non-developer edits a service page and publishes without help (user test) | 2.5 |
| DF-P2-038 | Analytics wiring for Phase-2 surfaces (events per §7.4) | Event QA: every CTA fires with correct properties | 1 |
| DF-P2-039 | Mobile experience pass per §3.12 (dedicated layouts, not squeezes) | Verified on real Android mid-range + iOS device or accurate emulation | 2.5 |
| DF-P2-040 | Cross-browser QA (Chrome, Safari iOS/macOS, Firefox, Edge, Samsung Internet) | Bug list burned to zero (or documented with workarounds) | 2 |
| DF-P2-041 | Copy review + Bangla translation for all Phase-2 surfaces | Native-speaker review signed off; no machine-translation artefacts | 2 |
| DF-P2-042 | Phase-2 content freeze + QA sweep + bug bash | All P0/P1 bugs closed; sign-off recorded | 2 |
| DF-P2-043 | **First 3 flagship industry pages** (manufacturing, trading, e-commerce) built on the §5.13.1 template | Live so the industries rail never dead-links; remaining 8 in Phase 8 | 3.5 |
| DF-P2-044 | **Cost Efficiency experience page** (`/cost-efficiency`) beats 1–4 + 6 per §5.9.1 (narrative, 5 pillars, profit impact preview, CTA block) | Narrative complete with static estimator preview; full estimator wired in Phase 4 | 3 |

### 🚦 GATE G2 — Public flagship ready
- [ ] Homepage: all 16 sections live, API-driven, content-complete in EN (Bangla in progress with a locked plan)
- [ ] Money-flow: 9 nodes complete with the 7-layer model, deep-linkable, accessible, benchmark-disclosed
- [ ] Cost-efficiency experience narrative live; 3 flagship industry pages live (no dead links from navigation)
- [ ] 9 service pages + static core pages live with real content
- [ ] Booking + lead capture flowing into the CRM end-to-end
- [ ] Command palette + site search working
- [ ] Lighthouse: mobile ≥ 90 / desktop ≥ 95 on home, money-flow, one service page
- [ ] axe: 0 serious/critical; reduced-motion and `lite` tier fully usable
- [ ] **No hardcoded rates anywhere** (CI-enforced)
- [ ] A non-developer published a content change unassisted

---

## PHASE 3 — REGULATORY RATE HUB, SRO LIBRARY & COMPLIANCE CALENDAR
**Duration:** 3–4 weeks · **Effort:** 26–36 days (the v1 PDF's "Step 3 / Next" — expanded)

**Objective:** Ship the traffic and trust engine: every rate family with provenance, change history, comparison, alerts, the SRO/circular library, and the public compliance calendar — all database-driven and admin-maintained.

| ID | Task | Output / DoD | Days |
|---|---|---|---|
| DF-P3-001 | Database: `rate_families`, `rates` (with all provenance + versioning fields), `tax_slabs`, `sros`, `circulars`, `rate_changes`, `compliance_deadline_templates`, `compliance_deadlines` + migrations, factories, indexes, constraints | Migrations pass; overlap/validation tests green | 2.5 |
| DF-P3-002 | **Rate resolution service** (effective-date aware, provenance-returning) + unit tests | Correct rate returned for any date incl. boundaries | 2 |
| DF-P3-003 | Historical seed data (last 3 fiscal years per family where retrievable) with sources | Seeded and spot-verified by the tax reviewer | 4 |
| DF-P3-004 | Filament `RateResource` with validation, two-person verification workflow, supersede + publish-change action | Publish triggers changelog + revalidation + alerts | 3 |
| DF-P3-005 | `SourceWatch` resource: NBR source list, checked timestamps, "found change → create draft" flow, staleness alerting | Stale source (> 45 days) raises an alert | 1.5 |
| DF-P3-006 | Public API: `/rates`, `/rates/{family}`, `/tax-slabs`, `/sros`, `/deadlines`, `/rates/{family}/changes` with caching | p95 ≤ 120 ms cached; contract tests | 2 |
| DF-P3-007 | **Rate hub landing** (`/rates`) with family cards, popular-now (DB-driven), what-changed feed | Content-complete; API-driven; schema valid | 2 |
| DF-P3-008 | **Rate family pages** (tds, vds, vat, income-tax, corporate-tax, ait, withholding-tax, tax-slabs, thresholds) with the §5.4.2 row anatomy | Every row shows all 8 required data points; filters + search work | 4 |
| DF-P3-009 | **Rate detail pages** with answer block, provenance panel, conditions, inline calculator, change history, related links, FAQs, report-an-error | §5.4.3 structure complete; AEO answer block 40–60 words | 3 |
| DF-P3-010 | Rate table component: sortable, filterable, keyboard navigable, CSV/XLSX/PDF export, print stylesheet, sticky headers | Export files open correctly in Excel; print output designed | 2.5 |
| DF-P3-011 | **Comparison workbench** (`/rates/compare`): two-year/two-act side-by-side, deltas, drag slider on mobile | Fixture-verified accuracy | 3 |
| DF-P3-012 | **Change log** per family + global, RSS/JSON feed, affected-segment descriptions | Feed validates; entries link to SROs | 2 |
| DF-P3-013 | **Rate change alerts**: subscribe (family/section, email/WhatsApp/SMS), double opt-in, unsubscribe, preference centre | Alert fires on publish within 5 min; delivery logged | 3 |
| DF-P3-014 | **Inline mini-calculators** on rate pages (TDS/VDS/VAT/tax) calling the shared engine | No duplicated formulas; results match the tools exactly | 2 |
| DF-P3-015 | **SRO & Circular library**: listing, filters, detail pages with plain-language summaries, PDF links, affected-rate cross-links, version tracking | ≥ 40 seeded SROs with summaries for the current FY | 3 |
| DF-P3-016 | **Public compliance calendar**: month/list/table views, filters, ICS + Google Calendar export, penalty notes, freshness banner | `Event` schema valid; timezone `Asia/Dhaka` correct | 3 |
| DF-P3-017 | Obligation **rule DSL** + templates (monthly VAT 15th, monthly TDS, quarterly turnover, annual returns, RJSC dates, advance tax) | Rules cover the current FY; unit-tested date math | 2.5 |
| DF-P3-018 | `GlossaryTerm` model + Bangla pairs + global tooltip component + `/glossary` page with search | Terms auto-linkable from content; tooltips a11y-compliant | 2 |
| DF-P3-019 | **Rate freshness UX**: "verified on" display, next review date, banner for recent changes, "report an error" pipeline to admin tickets | No page ever shows a fake freshness date | 1.5 |
| DF-P3-020 | Structured data for rates: `Dataset` + `Table` + `FAQPage` + `BreadcrumbList` | Rich Results validation clean | 1.5 |
| DF-P3-021 | Rate-hub SEO programme: titles/meta per family, internal linking rules, sitemap entries, programmatic page generation for TDS sections | ≥ 80 rate URLs generated and indexed-ready | 3 |
| DF-P3-022 | **On-demand revalidation** pipeline: rate publish → Laravel webhook → Next.js `revalidateTag` → verified public update ≤ 5 min | End-to-end test: publish → public page shows new value | 1.5 |
| DF-P3-023 | Redis caching layer for rate pages with correct invalidation and no stale-window bugs | Cache hit ratio ≥ 90% on anonymous traffic; stale test passes | 1.5 |
| DF-P3-024 | Performance + a11y pass on the hub (tables are the LCP risk) | LCP ≤ 2.0 s; axe clean; JS-off table access works | 2 |
| DF-P3-025 | Bangla translation of the hub navigation, intros, disclaimers, glossary, calendar labels | Native review signed off | 2 |
| DF-P3-026 | Content operations SOP documented (who updates rates, review cadence, escalation, backup person) | SOP committed + a rehearsal performed with the backup person | 1 |
| DF-P3-027 | Rate-hub QA sweep: 120-row data accuracy audit against NBR sources | Accuracy ≥ 99% on audited rows; discrepancies fixed with sources recorded | 2.5 |

### 🚦 GATE G3 — Trust engine live
- [ ] All rate families published with provenance (rate, effective date, applicability, taxpayer type, source, SRO, last updated, previous rate)
- [ ] ≥ 80 rate URLs live, all with valid schema and 40–60 word answer blocks
- [ ] Publishing a rate in admin updates every public surface within 5 minutes, without a deploy
- [ ] Alerts deliver to at least email + one messaging channel, with double opt-in and a preference centre
- [ ] Compliance calendar covers the current FY with correct dates and exports
- [ ] Data accuracy audit ≥ 99%; zero hardcoded regulatory values (CI-enforced)
- [ ] Content SOP rehearsed with a backup operator

---

## PHASE 4 — PUBLIC FINANCIAL TOOLS SUITE
**Duration:** 4–5 weeks · **Effort:** 38–45 days (the v1 PDF's "Step 4" — expanded from 7 to 13 tools, plus the Diagnostic Engine and the leakage estimator)

**Objective:** Ship 13 premium calculators that share one engine, one provenance layer and one conversion architecture.

| ID | Task | Output / DoD | Days |
|---|---|---|---|
| DF-P4-001 | `packages/tax-engine`: pure, typed calculation library (TDS, VDS, VAT, income tax slabs, corporate tax, profit, margin, break-even, ROI, cash flow, leakage, payroll, working capital) + ≥ 3 documented test vectors each | Unit tests green; rounding rules documented; engine reusable by FE, BE and PDF | 4 |
| DF-P4-002 | Server-side calculation endpoint `/tools/{tool}/calculate` (authoritative, rate-resolved, audit-logged) | FE and BE agree on every vector (cross-implementation test) | 2 |
| DF-P4-003 | Tool shell/component: input column, sticky result panel, count-up, breakdown, "how calculated", disclaimers, related links | One shell, 13 tools — no bespoke layout drift | 3 |
| DF-P4-004 | Input craft: ৳-prefixed fields, live BD thousand separators, sliders, segmented controls, numeric keypad, paste handling, validation | All inputs keyboard + touch friendly; no formatting bugs | 2.5 |
| DF-P4-005 | Tool 1 — **TDS Calculator** (section picker from the rate API, resident/non-resident, TIN status, date) | Rates resolved live; deposit deadline + certificate notes | 1.5 |
| DF-P4-006 | Tool 2 — **VDS Calculator** (service type, Mushak 6.6 note) | — | 1 |
| DF-P4-007 | Tool 3 — **VAT Calculator** (inclusive/exclusive, input credit, Mushak 9.1 note) | — | 1 |
| DF-P4-008 | Tool 4 — **Income Tax Calculator** (multi-source, slabs, rebate, surcharge, TDS paid, slab-by-slab animated breakdown) | Slab boundaries and minimum-tax rules tested | 2.5 |
| DF-P4-009 | Tool 5 — **Corporate Tax Calculator** (entity types + conditional rate adjustments) | Conditions surfaced as warnings | 1.5 |
| DF-P4-010 | Tool 6 — **Profit Calculator** (waterfall) | — | 1 |
| DF-P4-011 | Tool 7 — **Profit Margin Calculator** (margin ↔ markup both ways) | — | 1 |
| DF-P4-012 | Tool 8 — **Break-even Calculator** (interactive BEP chart, margin of safety) | — | 1.5 |
| DF-P4-013 | Tool 9 — **ROI Calculator** (+ annualized, payback, optional NPV/IRR) | — | 1.5 |
| DF-P4-014 | Tool 10 — **Cash Flow Calculator** (12-month grid, runway gauge, risk months) | — | 2 |
| DF-P4-015 | Tool 11 — **Cost Efficiency / Leakage Calculator** (benchmark model, 5 questions, range output, risk score) | Method disclosure; no savings guarantees | 2.5 |
| DF-P4-016 | Tool 12 — **Payroll Calculator** (loaded cost, TDS sec 86 estimate) | — | 1.5 |
| DF-P4-017 | Tool 13 — **Working Capital Calculator** (ratios + cash conversion cycle) | — | 1.5 |
| DF-P4-018 | Chart kit for tools (bars, waterfall, gauges, timelines) with accessible tables + reduced-motion variants | Consistent token-driven styling | 2.5 |
| DF-P4-019 | Persistence: anonymous localStorage history + email-my-result; authenticated save with names, share links, PDF/CSV export | Saved results appear in the portal library | 2.5 |
| DF-P4-020 | Conversion architecture per tool: contextual next steps, single primary CTA, related rate/service/tool links, no interstitials | Each tool mapped to exactly one primary CTA | 1.5 |
| DF-P4-021 | Tools landing page with categories, search, and "most used today" (DB-driven) | — | 1 |
| DF-P4-022 | SEO per tool: title/meta, answer block, `SoftwareApplication` + `FAQPage` schema, breadcrumbs, internal links | Rich Results clean for all 13 | 1.5 |
| DF-P4-023 | Share & virality: URL-encoded inputs, OG images with the result summary, copy-for-WhatsApp result text | Verified previews on WhatsApp/Facebook/LinkedIn | 1.5 |
| DF-P4-024 | Edge-case hardening: zero/negative/huge values, invalid dates, missing rate for a date, decimal paste, locale digits | Test suite covering 20+ hostile inputs per tool family | 2 |
| DF-P4-025 | A11y + performance pass for tools (live regions for results, mobile keypad, ≤ 220 KB JS) | axe clean; results announced; mobile UX verified | 2 |
| DF-P4-026 | Bangla tool UI + help text | Native review signed off | 2 |
| DF-P4-027 | Tool QA sweep against the engine test vectors + a manual "accountant review" of 5 real-world scenarios | Signed-off accuracy report by the tax reviewer | 2 |
| DF-P4-028 | **Business Diagnostic Engine — data model & scoring**: `diagnostic_rules` table (weights, answer→dimension maps, recommendation mappings), versioning, activation | Rules editable in admin; a result records the rule version used | 2.5 |
| DF-P4-029 | Diagnostic flow UI: 7 stages per §5.8.1 with purpose-built visuals, stepper, progress ring, keyboard shortcuts, back without data loss | Median completion ≤ 2 minutes in a 5-user test; resumable after abandonment | 3.5 |
| DF-P4-030 | Diagnostic "analysis" sequence (honest, non-fake messaging) + result page: health score, subscale bars, top 3 risks with ৳ impact ranges, top 3 opportunities, ranked recommendations, 30/60/90-day action plan | Every recommendation shows its reason; result page loads ≤ 1.5 s | 3 |
| DF-P4-031 | Diagnostic result sharing & CRM handoff: expiring token URL, PDF export, pre-filled consultation CTA, `Lead` creation with full answer set + recommended services | Lead lands in Filament with score and recommendations; PDF branded | 2.5 |
| DF-P4-032 | Diagnostic QA + a11y + Bangla version, including the no-JS fallback form | axe clean; BN flow tested with identical scoring rules | 2 |
| DF-P4-033 | **Leakage estimator → experience wiring**: connect the cost-efficiency calculator into `/cost-efficiency` beats 5–6 with the interactive turnover/category sliders and 9D continuity (all visuals update together) | Slider updates all dependent visuals ≤ 16 ms/frame desktop; mobile throttled and smooth | 2.5 |
| DF-P4-034 | Leakage result artefact: shareable token page, PDF with method disclosure, saved as `LeakageEstimate`, lead attachment, "get the 5-pillar checklist" lead magnet | No savings guarantees anywhere in copy (verified); checklist download captured | 2 |

### 🚦 GATE G4 — Tools suite live
- [ ] 13 tools published, all rate-driven (no literals) and matching the shared engine vectors
- [ ] Business Diagnostic Engine live end-to-end (flow → score → recommendations → shared result → CRM lead), admin-tunable rules, Bangla supported
- [ ] Cost-efficiency experience fully interactive with the honest range-based estimator, shareable result and method disclosure
- [ ] Every tool has: live results, breakdown, "how calculated" with source, disclaimer, one contextual CTA, related links
- [ ] Anonymous persistence + email capture + authenticated save all work
- [ ] Shareable URLs and OG result images verified
- [ ] axe clean; results announced to screen readers; mobile keypad UX verified
- [ ] Accountant-reviewed accuracy report signed off
- [ ] Lighthouse ≥ 95 desktop on all tool pages
---

## PHASE 5 — SAAS FOUNDATION: TENANCY, AUTH, ONBOARDING, SUBSCRIPTION
**Duration:** 3–4 weeks · **Effort:** 26–34 days

**Objective:** Stand up the multi-tenant SaaS core — businesses, users, roles, entitlements, onboarding, and subscription billing — with tenant isolation proven by tests before a single feature is built on top.

| ID | Task | Output / DoD | Days |
|---|---|---|---|
| DF-P5-001 | Database: `businesses`, `business_users` (pivot with role/permissions), `users`, `pricing_plans`, `subscriptions`, `invoices`, `invoice_items`, `payments`, `entitlement_overrides` + migrations/indexes | Migrations pass; ERD committed to docs | 2 |
| DF-P5-002 | **Tenant scoping**: global scope, middleware binding the active business, `business_id` never client-supplied, policies per model | Cross-tenant access test suite passes on every endpoint (403/404, no leakage) | 3 |
| DF-P5-003 | Auth: phone OTP (primary), email magic link, optional password, session hardening, device/session list, revoke | OTP flow tested end-to-end incl. lockout after 5 attempts | 3 |
| DF-P5-004 | 2FA (TOTP) with recovery codes; enforcement option per role for staff | Enrolment, verification and recovery tested | 2 |
| DF-P5-005 | Roles & permission matrix per §5.11.4 implemented in policies; role management UI | Full matrix test: every role × every capability | 3 |
| DF-P5-006 | Portal shell: rail nav, topbar (business switcher, search, notifications, help, avatar), mobile bottom tabs | Responsive at all breakpoints; keyboard navigable | 3 |
| DF-P5-007 | **Onboarding wizard** (5 steps per §5.11.3) with server-side progress, resume-by-email, skip logic | Median completion ≤ 4 minutes in a 5-user test; drafts resume correctly | 3 |
| DF-P5-008 | Invite flow: invite by phone/email, role selection, permission overrides, resend/revoke, audit | Invitee joins the correct business with the correct role | 1.5 |
| DF-P5-009 | `PricingPlan` + `Subscription` + `EntitlementService` + upgrade/downgrade proration logic | Entitlements gate features correctly; downgrade applies at period end | 3 |
| DF-P5-010 | **Local payments**: SSLCommerz + bKash/Nagad integration, webhook handling, idempotency, reconciliation report | Sandbox + live test payment succeeds; duplicate webhooks are idempotent | 3 |
| DF-P5-011 | Invoicing: generation from plan or quote, VAT line, PDF with the design system's print stylesheet, email delivery, receipts | PDF reviewed by a designer for quality; VAT arithmetic tested | 2.5 |
| DF-P5-012 | Dunning: failed payment retries, grace period, read-only mode (never data loss), reminders | Simulated card failures follow the exact policy; access transitions correct | 2 |
| DF-P5-013 | Notification centre + per-category channel preferences + quiet hours + digest option | Preference changes take effect within one dispatch cycle (tested) | 2.5 |
| DF-P5-014 | Notification dispatcher with channel adapters (mail, SMS, WhatsApp, in-app, web push) + delivery logs + dedupe | Fallback chain works; every send is logged with status | 3 |
| DF-P5-015 | Billing UI: invoices, receipts, payment methods, plan/usage view, cancel flow with reason capture | Cancel flow offers retention options; reason stored for analysis | 2.5 |
| DF-P5-016 | Free-tier limits and graceful upsell surfaces (storage, AI queries, businesses, users) | Hitting a limit shows an upgrade path, never a dead end | 2 |
| DF-P5-017 | Security hardening pass: CSP with nonces, rate limits per endpoint, secure headers, secrets review, dependency audit | Security checklist signed off; ZAP/basic scan clean | 3 |
| DF-P5-018 | Audit logging across auth, tenancy, billing, document access, admin actions | A "who accessed my data" view works per business | 2 |
| DF-P5-019 | Data export & deletion workflows (queued archive, retention checks, legal hold, anonymization) | Export produces a complete archive; deletion honours retention rules | 2.5 |
| DF-P5-020 | Portal E2E test suite: signup → onboarding → invite → pay → access | Playwright suite runs in CI on every PR | 3 |
| DF-P5-021 | Portal performance pass (≤ 2.5 s LCP, ≤ 300 KB JS, skeletons) | Budgets met on a throttled profile | 2 |
| DF-P5-022 | Portal a11y pass (focus order, SR labels, contrast, bottom-tab targets) | axe clean; keyboard-only walkthrough documented | 2 |
| DF-P5-023 | Bangla portal chrome + locale switch with persisted preference | Switch applies instantly without reload | 1.5 |
| DF-P5-024 | Admin: Business/User/Plan/Subscription/Invoice/Payment resources with scoped queries and policies | Staff can operate billing without developer help | 3 |

### 🚦 GATE G5 — SaaS core operational
- [ ] Tenant isolation proven by automated cross-tenant tests on every endpoint
- [ ] Phone OTP + magic link + 2FA work; session and device management live
- [ ] Onboarding completes in ≤ 4 minutes median; resume works
- [ ] Payments, invoices, VAT handling, dunning and downgrades all function; reconciliation report exists
- [ ] Notifications fan out across 4+ channels with preferences and logs
- [ ] Export/delete workflows operational and audited
- [ ] Portal passes performance and accessibility budgets
- [ ] Security checklist signed off with no open high findings

---

## PHASE 6 — CLIENT PORTAL: COMMAND CENTRE, VAULT, COMPLIANCE INTELLIGENCE, AI ASSISTANT
**Duration:** 5–6 weeks · **Effort:** 42–52 days

**Objective:** Deliver the product that justifies the subscription: the Financial Command Centre, the encrypted document vault, compliance intelligence, tasks/requests/messaging, reports, and the AI copilot.

| ID | Task | Output / DoD | Days |
|---|---|---|---|
| DF-P6-001 | Database: `documents`, `document_versions`, `tasks`, `task_comments`, `service_requests`, `request_events`, `messages`, `message_threads`, `reports`, `report_versions`, `insights`, `obligations`, `obligation_documents`, `assistant_conversations`, `assistant_messages`, `knowledge_chunks` | Migrations + models + policies; ERD committed | 3 |
| DF-P6-002 | **Command centre dashboard** per §5.7.1 wireframe with all modules | Renders ≤ 2.5 s; skeletons; no CLS | 4 |
| DF-P6-003 | **KPI tile component** enforcing the six-element rule + configurable tile selection | Test asserts all six elements present per tile | 2 |
| DF-P6-004 | **Business health score** engine (5 subscores, documented weights, admin-tunable) + breakdown drawer | Score reproducible from inputs; "what would move this" works | 3 |
| DF-P6-005 | Cash & profit trend chart (multi-series, annotations, period toggle, benchmark band) | Accessible table + text summary attached | 3 |
| DF-P6-006 | Money-flow mini Sankey with drill-down to ledger/category views | Click a band → filtered view; mobile becomes a stacked list | 3 |
| DF-P6-007 | **Insight engine**: rule library (DB-driven), qualifier/driver text generation, severity, recommended action, insight feed with expand/collapse and actions | Insights explainable with source data; dismissal recorded with reason | 4 |
| DF-P6-008 | "Needs you" panel (documents, approvals, missing data) with one-tap actions | Empty state celebrates completion | 2 |
| DF-P6-009 | Reconciliation status module + last-sync honesty indicators | Never shows "reconciled" without evidence | 1.5 |
| DF-P6-010 | Team activity timeline (what DhakaFin did: filed, reviewed, flagged, with proof documents) | Every entry links to a document or filing receipt | 2 |
| DF-P6-011 | **Document vault**: folder tree, categories, upload (drag/drop/camera/bulk/chunked/resumable), validation, virus scan, checksum, duplicate handling | 5 MB PDF upload → accessible ≤ 20 s p95; every access logged | 4 |
| DF-P6-012 | Vault search: title + extracted text (OCR queue for scanned PDFs), filters, tags, fiscal-period grouping | Search p95 ≤ 300 ms over seeded corpus | 3 |
| DF-P6-013 | Document detail: metadata, versions, preview (PDF/image viewer), download via signed URL (5–15 min), share links with expiry/password/download limit, revoke | Signed URL expiry tested; share manager works | 3 |
| DF-P6-014 | Expiry intelligence: document expiry reminders (trade licence, agreements) feeding notifications | Reminder fires at 30/7/1 days | 1.5 |
| DF-P6-015 | **Compliance centre** per §5.10.2: obligation list, statuses, urgency styling, prerequisites, owners, filing evidence, timeline ribbon, regulatory-change feed | Cadence notifications fire exactly once per stage (time-travel tests) | 5 |
| DF-P6-016 | Obligation generation from templates + business profile (idempotent, profile-change aware) | Re-running creates no duplicates; profile changes update future obligations only | 3 |
| DF-P6-017 | **Task board**: client/platform tasks, priorities, due dates, evidence upload, reviewer approval, comments, recurring templates, bulk actions | Uploading evidence moves to "under review"; approvals require a reviewer | 3.5 |
| DF-P6-018 | **Service requests**: creation wizard, scope, attachments, status pipeline, SLA countdown, assigned consultant, linked quote/invoice | Status changes notify both sides | 3 |
| DF-P6-019 | **Secure messaging**: threaded conversations, attachments, internal-only staff notes (server-side exclusion), read receipts | Internal notes never reachable by client API (tested) | 3 |
| DF-P6-020 | **Reports module**: templates (MIS, P&L, balance sheet, cash flow, ratios, budget vs actual, benchmark), generation queue with progress, versions, scheduled email delivery, PDF/Excel export | Regeneration never overwrites; PDF matches the design system | 5 |
| DF-P6-021 | **Accounting module**: revenue/expense summary, category breakdown, AR/AP aging, bank reconciliation status, ledger drill-down (read-only) | Every figure links to its source document or entry | 3 |
| DF-P6-022 | **Books import**: CSV/XLSX templates for Tally/QuickBooks/ERP exports with per-line validation, dry-run diff, error reporting, rollback | Import of a 10k-row file succeeds with a clear error report; rolls back cleanly | 3.5 |
| DF-P6-023 | **Tax module**: provision vs paid, TDS deducted/collected tracker, certificate tracker (received/issued), AIT, notices/assessments, return history | Every number traceable | 3 |
| DF-P6-024 | **VAT module**: output/input/net by month, Mushak 9.1 status + acknowledgements, VDS by section, certificate tracker, **input credit at risk** widget | Unclaimed credit shown with ৳ value + action | 3 |
| DF-P6-025 | **AI assistant — foundation**: provider abstraction, prompt repository (versioned), retrieval over curated corpus (pgvector), guardrail pass, citations, confidence, logging, cost tracking | Answers carry citations; cost per business tracked and capped | 5 |
| DF-P6-026 | Assistant — question routers for the 5 classes (§5.12.1): business data, compliance, regulatory, explain, actions | ≥ 90% correct on the seeded 120-question eval set | 4 |
| DF-P6-027 | Assistant — streaming UI, source chips, confidence badge, follow-ups, feedback (👍/👎), history search, export | Streaming starts ≤ 1.5 s p50; UX usable during stream | 3 |
| DF-P6-028 | Assistant — action registry (create task, request document, draft reminder) with confirmation + audit logging | Only allow-listed actions fire; every action reversible/logged | 2.5 |
| DF-P6-029 | Assistant — safety: PII redaction before provider calls, prompt-injection test set (20 attempts), provider zero-retention configuration | Injection attempts fail to alter behaviour; PII never leaves unredacted | 3 |
| DF-P6-030 | Knowledge corpus pipeline: ingest our explainers, rate rows, SRO summaries into chunks with embeddings, versioned + refreshable | Corpus rebuild job runs on publish; retrieval quality spot-checked | 3 |
| DF-P6-031 | Assistant entitlement gating per plan + graceful quota-exceeded UX | Limits enforced server-side; upgrade path shown | 1.5 |
| DF-P6-032 | Portal notifications integration for every new module (insights, obligations, tasks, requests, documents, messages) | Event → notification matrix documented and tested | 2 |
| DF-P6-033 | Settings module: profile, language, number format, theme, reduced effects, 2FA, sessions, export/delete | All preferences persist and take effect immediately | 2.5 |
| DF-P6-034 | Support module: help centre search, ticket creation with context attachment, SLA display, escalation | Tickets land in Filament with the business context | 2 |
| DF-P6-035 | Portal empty states for every module with specific next actions | No blank panels anywhere (audited page by page) | 2 |
| DF-P6-036 | Mobile portal experience: bottom tabs, sheet-based flows, camera upload, thumb-zone actions | Verified on Android mid-range; no horizontal scroll at 360px | 3 |
| DF-P6-037 | Portal performance pass: query optimisation (N+1 elimination), caching, pagination, virtualised long lists | Dashboard p95 API ≤ 400 ms; 10k-row lists scroll smoothly | 3 |
| DF-P6-038 | Portal a11y pass across all modules | axe clean; keyboard-only walkthrough completed; SR notes documented | 3 |
| DF-P6-039 | Bangla portal content for all modules | Native review signed off | 2.5 |
| DF-P6-040 | Analytics instrumented for every portal action (§7.4) | Funnel: signup → activation → insight action → retention measurable | 2 |
| DF-P6-041 | Activation instrumentation: "first value in 7 days" tracking + automated nudges for stalled onboarding | Nudge sequence live; stalled accounts reported weekly | 2 |
| DF-P6-042 | Security review for portal: signed URL policy, permission tests, file-type abuse, IDOR sweep | No open high/medium findings; report committed | 3 |
| DF-P6-043 | QA sweep + bug bash with 5 real businesses (usability sessions) | Top 10 usability issues fixed or logged with owners | 3 |
| DF-P6-044 | Report template design review (MIS pack must look like a premium artefact) | Designer + founder sign-off on 3 sample reports | 2 |
| DF-P6-045 | Documentation: user guides (EN/BN) for each module + in-app contextual help | Help centre articles published for every module | 3 |

### 🚦 GATE G6 — The product is real
- [ ] Dashboard, insights, vault, compliance, tasks, requests, messaging, reports, tax, VAT, accounting all live with real data flows
- [ ] AI assistant answers the 5 question classes with citations at ≥ 90% eval accuracy, cost-capped and guard-railed
- [ ] Every ৳ figure traces to a source; every module has loading/empty/error states
- [ ] Portal works on mobile at 360px with bottom-tab navigation and camera upload
- [ ] Tenant isolation, permissions, signed URLs and internal-note exclusion all verified by tests
- [ ] Activation metric instrumented; 5 real usability sessions completed with fixes applied
- [ ] Performance + accessibility budgets met; Bangla content live

---

## PHASE 7 — BACK OFFICE, CRM, QUOTE ENGINE & SERVICE DELIVERY OPERATIONS
**Duration:** 3–4 weeks · **Effort:** 26–34 days

**Objective:** Make DhakaFin *operable*: a real CRM pipeline, quotations, client onboarding workflows, service delivery tracking, and the full Filament content/regulatory/ops admin specified in §6.

| ID | Task | Output / DoD | Days |
|---|---|---|---|
| DF-P7-001 | Database: `leads`, `lead_activities`, `consultations`, `quotes`, `quote_items`, `service_requests` ops fields, `document_requests`, `notification_templates`, `activity_log`, `feature_flags`, `benchmarks`, `diagnostic_rules` | Migrations + models + policies | 2.5 |
| DF-P7-002 | **CRM LeadResource** — Kanban + table, pipeline stages, source/UTM capture, scoring, assignment rules, activity timeline | Lead flows from any public form into the pipeline with full context | 4 |
| DF-P7-003 | Lead routing & SLA: round-robin or industry-based assignment, first-response SLA timer, escalation | SLA breach alerts fire; response time tracked | 2 |
| DF-P7-004 | **Consultation scheduling** (admin + public): availability rules, slot locking, reminders (email/WhatsApp/SMS), outcomes, no-show tracking | Double-booking impossible under concurrent requests (tested) | 3 |
| DF-P7-005 | **Quote engine**: line items with frequency (monthly/one-time), discounts, VAT, terms templates, validity, PDF, send via email/WhatsApp | Quote PDF is design-system quality; arithmetic tested incl. VAT and rounding | 4 |
| DF-P7-006 | Quote accept/reject public token pages + acceptance → service request + invoice draft + onboarding checklist | End-to-end verified with a real quote | 3 |
| DF-P7-007 | **Convert-to-client** action: creates Business, links users/invites, seeds compliance profile, assigns consultant, creates onboarding tasks | One click turns a won deal into an operational client | 2.5 |
| DF-P7-008 | **Service delivery**: request pipeline board with SLA countdowns, assignment, scope edits with reason, linked documents/invoices | Delivery team can run a month of work entirely in the panel | 4 |
| DF-P7-009 | **Task templates & cycles**: monthly MIS cycle generator, recurring document requests, bulk document request across clients | Monthly cycle creates all client tasks automatically at the scheduled time | 3 |
| DF-P7-010 | **Document request campaigns**: select clients → request specific documents → track per-client compliance %, reminders | A 40-client campaign tracked to completion in the UI | 2.5 |
| DF-P7-011 | **Notification template manager** (per event × channel × locale) with variable picker, preview, test send, versions | All alert templates editable without code; test send works | 3 |
| DF-P7-012 | **Content admin completion**: PageResource + section page builder, ServiceResource, IndustryResource, PostResource, CaseStudyResource, Testimonial, TeamMember, Glossary, FAQ, MenuItem, Redirect, GlobalSetting | A content editor publishes a new page + menu entry with zero developer help (user test) | 6 |
| DF-P7-013 | Media library: folders, crop/resize, AVIF/WebP conversion, mandatory alt text, duplicate detection | Alt-text enforcement tested (publish blocked without it) | 2.5 |
| DF-P7-014 | **SEO admin**: per-record SEO panel with SERP preview, OG image override, sitemap ping, redirect manager with hit counts, robots controls | An editor fixes SEO metadata without a deploy | 2.5 |
| DF-P7-015 | **Insight definition admin** (rule library) + **benchmark admin** + **diagnostic rule admin** with versioning and activation | Changing a threshold changes outputs without a deploy | 3 |
| DF-P7-016 | **Ops cockpit** admin dashboard: leads, consultations, quotes, revenue/collections, overdue obligations with penalty exposure, rates pending verification, stale sources, failed jobs, document requests outstanding, top search queries with zero results | Every widget clickable to its source list | 3 |
| DF-P7-017 | Audit log viewer with filters + CSV export (auditor role) | Immutable log; export works and is itself logged | 2 |
| DF-P7-018 | Feature flags (Pennant) with rollout % and audience targeting | A flag can gate the assistant per business in production | 1.5 |
| DF-P7-019 | Internal SOP screens: guided actions for rate update, content publish, monthly cycle, overdue handling (§6.4) | Each SOP implementable by a new staff member using only the UI | 3 |
| DF-P7-020 | Admin onboarding: invite staff, assign roles, 2FA enforcement, permission matrix tests | A new staff member reaches productive use in ≤ 1 hour | 2 |
| DF-P7-021 | Admin performance: query review, eager loading, pagination, queued bulk actions with progress | Admin list pages p95 ≤ 600 ms with 10k rows | 2.5 |
| DF-P7-022 | Invoice & payment operations: manual invoice creation, partial payments, credit notes, refunds with reason, reconciliation view | Finance can close a month in the panel | 3 |
| DF-P7-023 | Reporting for the business: MRR, ARPU, churn, CAC inputs, service profitability per client, capacity utilisation | Dashboard used in the monthly leadership review | 3 |
| DF-P7-024 | Client health monitoring: engagement score, at-risk flags, renewal reminders, QBR scheduling | At-risk list reviewed weekly with automated alerts | 2.5 |
| DF-P7-025 | Staff-facing documentation + recorded walkthroughs for every admin workflow | Docs published internally; new hire can self-onboard | 2 |
| DF-P7-026 | Admin QA + security review (role enforcement, scoped queries, impersonation logging) | Permission test suite passes; no cross-tenant leakage from admin | 3 |

### 🚦 GATE G7 — The business can run on it
- [ ] Every public lead lands in the CRM with context; SLA timers and escalations work
- [ ] Quotes can be created, sent, accepted and converted into an onboarded client without developer help
- [ ] Service delivery (tasks, document requests, cycles, SLAs) runs entirely in the panel
- [ ] All content, rates, tools config, insights rules and templates are admin-editable
- [ ] Ops cockpit gives daily operational visibility; monthly leadership report exists
- [ ] Role enforcement verified; audit log complete and immutable
- [ ] A new staff member is productive using only internal docs and the UI

---

## PHASE 8 — GROWTH ENGINE, INTEGRATIONS, HARDENING & SCALE READINESS
**Duration:** 3–4 weeks · **Effort:** 26–34 days

**Objective:** Turn the platform into a growth machine and make it enterprise-credible: SEO at scale, industry experiences, content engine, benchmarking, integrations, performance, and security hardening.

| ID | Task | Output / DoD | Days |
|---|---|---|---|
| DF-P8-001 | **All 11 industry pages** built (template from §5.13) with real content, KPIs, compliance profiles, case studies | Every page has ≥ 6 KPIs with formulas and ≥ 5 mapped pain points | 6 |
| DF-P8-002 | Industry-specific compliance profiles wired to the calendar and diagnostic | Selecting an industry pre-fills obligations | 2 |
| DF-P8-003 | **Content engine**: editorial calendar tooling, reviewer workflow, correction policy page, author pages, scheduling | 10 deep guides published with reviewers named | 3 |
| DF-P8-004 | Bangla content programme: full translation of public marketing + top tools + rate intros + guides (native review) | `bn` locale completeness ≥ 90% on public surfaces | 4 |
| DF-P8-005 | **Programmatic SEO expansion**: per-section TDS pages, per-slab pages, per-form Mushak pages, deadline-month pages | ≥ 200 indexable, genuinely useful URLs with unique content blocks | 4 |
| DF-P8-006 | Internal linking engine + orphan-page report + monthly SEO health report automation | 0 orphan pages; ≥ 3 contextual links per page (automated check) | 2.5 |
| DF-P8-007 | **Benchmark data programme**: collect and publish industry benchmark bands with method notes (powers dashboards, leakage estimator, industry pages) | Benchmark model documented, versioned, publicly explained | 3 |
| DF-P8-008 | **Integrations (batch 1)**: bank statement import (CSV/MT940/PDF parse), email-in documents, Tally/QuickBooks export templates | Import tested with 3 real bank formats; error reporting per row | 4 |
| DF-P8-009 | Integrations (batch 2): WhatsApp Business (alerts + document requests + assistant handoff), web push (PWA), Google Calendar (deadline sync) | Each integration tested end-to-end with fallbacks | 3 |
| DF-P8-010 | **PWA**: installable, offline shell, cached content, queued actions, push notifications | Lighthouse PWA installable; offline mode functional | 3 |
| DF-P8-011 | Meilisearch (or equivalent) for large-scale search with typo tolerance and synonyms (rates/SRO/glossary) | p95 ≤ 80 ms; synonym tests (e.g. "mushak"→"musak") | 2.5 |
| DF-P8-012 | Performance programme: DB index audit, slow-query elimination, Redis strategy, image/font audit, CDN tuning, edge caching | All budgets met with 10× data volume; load test: 200 concurrent users, p95 ≤ 800 ms | 4 |
| DF-P8-013 | Load & soak testing with realistic scenarios + documented scaling thresholds | Capacity report published; autoscaling or vertical plan defined | 2.5 |
| DF-P8-014 | Security hardening: external penetration test (or structured internal pentest), fixes, retest | Report + remediation log; no open high findings | 4 |
| DF-P8-015 | Disaster recovery drill: restore DB + storage from backup into a clean environment, measure RTO/RPO | Drill documented with timings against the RPO 15 min / RTO 4 h targets | 2 |
| DF-P8-016 | Availability & status: `/status` page, incident runbook, on-call rotation, communication templates | An incident can be handled and communicated end-to-end in a rehearsal | 2 |
| DF-P8-017 | Compliance & legal finalisation: Terms, Privacy, DPA clause, retention matrix published on `/security`, cookie consent | Counsel-reviewed documents live; consent banner functional | 2 |
| DF-P8-018 | **Accessibility certification pass**: full-site audit (public + portal), fixes, statement published | WCAG 2.2 AA statement published with known limitations listed | 3 |
| DF-P8-019 | QA automation expansion: E2E for critical journeys, visual regression on 20 key views, API contract tests | CI suite runs < 15 min; flake rate < 2% | 3 |
| DF-P8-020 | Analytics maturity: funnels, cohorts, retention, revenue dashboards, attribution model | Monthly growth report generated from dashboards | 2.5 |
| DF-P8-021 | CRO programme launch: implement the first 4 experiments from §7.5 with a results log | Experiments running with proper sample-size discipline | 3 |
| DF-P8-022 | Partner programme foundations (CA/business associations): partner portal stub, referral tracking, commission logic | A partner can refer and be tracked end-to-end | 3 |
| DF-P8-023 | Enterprise readiness pack: SLA document, security questionnaire answers, data residency statement, user-provisioning guide | Pack ready to send to a corporate client the same day | 2 |
| DF-P8-024 | Cost optimisation review: hosting, storage lifecycle, AI usage, SMS/WhatsApp volumes + unit economics per client | Cost per active client documented; margins per service line calculated | 2.5 |
| DF-P8-025 | Documentation refresh: architecture, API docs (OpenAPI published), runbooks, onboarding guide | A new developer can be productive in ≤ 2 days using docs alone | 3 |

### 🚦 GATE G8 — Credible at scale
- [ ] 11 industry pages + 200+ useful SEO URLs live; Bangla completeness ≥ 90% on public surfaces
- [ ] Integrations (bank import, email-in, WhatsApp, calendar, PWA) working with fallbacks
- [ ] Performance verified at 10× data volume; load test passed; scaling plan documented
- [ ] Penetration test completed with no open high findings; DR drill met RPO/RTO targets
- [ ] Accessibility statement published; axe-clean site-wide
- [ ] Cost per active client and margin per service line known
- [ ] Enterprise pack ready (SLA, security answers, data residency)

---

## PHASE 9 — INTELLIGENCE MATURITY, ENTERPRISE & ECOSYSTEM
**Duration:** continuous, 4–6 week cycles · **Effort:** 20–30 days per cycle

**Objective:** Deepen the moat: sharper AI, richer benchmarks, multi-entity and group consolidation, API access, channel/partner ecosystem, and mobile apps.

| ID | Task | Output / DoD | Days |
|---|---|---|---|
| DF-P9-001 | AI maturity: multi-model routing for cost/quality, answer caching, per-industry prompt tuning, quarterly eval refresh | Eval accuracy ≥ 95%; cost per query down ≥ 30% | 4 |
| DF-P9-002 | Predictive intelligence: cash-flow forecasting, churn/risk prediction for clients, procurement price trend detection | Forecast MAPE ≤ 15% on seeded historical data; each prediction explainable | 5 |
| DF-P9-003 | Multi-entity & group consolidation: roll-up dashboards, intercompany elimination, consolidated MIS | Group dashboard validated against manual consolidation | 5 |
| DF-P9-004 | Public API for enterprise clients (rates + business data with OAuth) + developer docs portal | A partner integrates rates into their app using only the docs | 4 |
| DF-P9-005 | Partner/channel portal: white-label options, co-branded reports, revenue share, partner dashboards | A partner onboards and refers clients self-serve | 5 |
| DF-P9-006 | Mobile apps: React Native (or PWA-plus) for alerts, document upload, approvals, assistant | Push alerts + camera upload + approvals on iOS + Android | 8 |
| DF-P9-007 | Advanced document intelligence: OCR extraction into structured fields (invoice date/amount/VAT), auto-categorization, duplicate detection at scale | Extraction accuracy ≥ 90% on 200-sample set | 5 |
| DF-P9-008 | Accounting deeper integration: two-way sync with popular BD-used systems / API connectors, journal-level features | Round-trip sync validated on a real client dataset | 6 |
| DF-P9-009 | Benchmark network effects: anonymised, consented industry benchmarking ("your material cost % vs peers") | Published with strict privacy controls; opt-in only | 4 |
| DF-P9-010 | Assistant proactivity: scheduled insight briefings, WhatsApp digests, "ask about this document/insight" context actions | Weekly proactive briefings delivered; engagement measured | 3 |
| DF-P9-011 | Regulatory expansion: additional acts/regimes (customs/duty, excise, labour/EPZ, local government taxes) into the rate hub | Each new regime follows the same provenance model | 5 |
| DF-P9-012 | Service productisation: standard packages with fixed scope/SLA, client self-serve upgrades | Packages sellable without custom quoting | 3 |
| DF-P9-013 | Marketplace of templates & checklists (industry-specific) with download tracking | 20 templates live; downloads instrumented | 3 |
| DF-P9-014 | Advanced reporting: board pack generator, investor-ready MIS, KPI goal tracking with variance alerts | Board pack generated for 3 clients with sign-off | 4 |
| DF-P9-015 | Governance & audits: SOC2-style control documentation, internal audit of access, quarterly access reviews | Control docs; quarterly review executed | 3 |

---

## PHASE 10 — LAUNCH, OPERATIONS & CONTINUOUS IMPROVEMENT
**Duration:** ongoing from G6/G7 · **Effort:** steady-state engineering 30–40% of capacity + ops

**Objective:** Ship publicly, keep the promise daily, and compound: content, reliability, service quality and client outcomes.

| ID | Task | Output / DoD | Days |
|---|---|---|---|
| DF-P10-001 | Pre-launch readiness review against §9.8 | Signed checklist; blockers resolved | 2 |
| DF-P10-002 | Launch day runbook executed (deploy freeze → monitoring → comms → announcements) | Launch executed; monitoring watched for 72 h | 2 |
| DF-P10-003 | Post-launch monitoring & triage rotation: error spikes, funnel drop-offs, support volume | Daily 15-minute review; issues triaged within SLA | Ongoing |
| DF-P10-004 | Weekly growth cadence: content published, experiments reviewed, funnel analysed, backlog re-prioritised | Weekly report; 1 experiment shipped per 2 weeks | Ongoing |
| DF-P10-005 | Monthly quality cycle: performance budgets, a11y audit, security patches, dependency updates, cost review | Monthly report; regression issues fixed within the cycle | Ongoing |
| DF-P10-006 | Monthly client outcome review: results delivered per client, NPS, testimonials, case-study pipeline | Outcomes documented; NPS ≥ 50 target | Ongoing |
| DF-P10-007 | Quarterly roadmap replan: re-score backlog, kill weak bets, double down on winning channels/features | Updated roadmap committed to this document's revision history | Ongoing |
| DF-P10-008 | Rate freshness audit: every family reviewed, sources re-checked, verification dates updated | Zero families beyond 45 days; audit logged | Monthly |
| DF-P10-009 | Compliance content audit: forms, deadlines, penalties re-verified against NBR | Audit report; corrections published with changelog entries | Quarterly |
| DF-P10-010 | Service quality: SLA adherence, response times, filing accuracy, penalty incidents root-caused | Zero missed statutory deadlines; every incident root-caused publicly internally | Monthly |
| DF-P10-011 | Learning loop: support tickets → product backlog; sales objections → messaging changes; churn reasons → product fixes | Top 5 themes addressed each quarter | Monthly |
| DF-P10-012 | Backup & DR drill | Successful drill recorded | Quarterly |
| DF-P10-013 | Access review: staff permissions, client user lists, third-party access | Signed review; stale access removed | Quarterly |
| DF-P10-014 | Brand & design review: consistency audit against §3, evolution proposals | Audit report; token/component updates shipped | Quarterly |
| DF-P10-015 | Annual strategy reset: market position, pricing, expansion (products/geographies), team plan | Updated vision + roadmap v3 | Annual |

---

## 8.1 Post-launch backlog (scored, not scheduled)

| Item | Value | Effort | Score (V/E) | Trigger to start |
|---|---|---|---|---|
| Bengali-first mobile app with voice input | High | L | 2.0 | ≥ 500 active portal users |
| WhatsApp-first filing assistant (chat-based workflow) | High | M | 2.5 | WhatsApp alert engagement > 40% |
| Full double-entry ledger module | High | XL | 0.8 | ≥ 20 clients ask to leave their current ledger tool |
| Bank API integrations (open banking where available) | High | L | 1.5 | A bank offers a real API programme |
| Marketplace of vetted CAs (network model) | Medium | L | 1.0 | Platform demand exceeds internal delivery capacity |
| Payroll module with automated TDS, PF/benefits, payslips | Medium | M | 1.6 | Payroll clients > 15 |
| Inventory & cost accounting module (manufacturing) | High | XL | 1.1 | Manufacturing clients > 25 |
| Tax filing submission automation (with NBR e-filing vendor partnerships) | High | L | 1.8 | Any legitimate NBR-integration path exists |
| Investment/wealth advisory line for SME owners | Medium | M | 1.3 | Advisory retainer clients > 40 |
| Credit-readiness product (loan-readiness reporting for banks) | High | M | 2.2 | First bank partnership discussion |

## 8.2 Critical path & dependencies (what actually gates the launch)

```
P0 decisions ─► P1 tokens/CI/CD ─┬─► P2 homepage + money-flow ─┐
                                  │                              ├─► PUBLIC LAUNCH CANDIDATE (G4)
                                  ├─► P3 rate hub + calendar ───┤
                                  └─► P4 tools suite ────────────┘
                                                                 │
P5 tenancy/auth/billing ──► P6 portal + AI ──► P7 back office ──► SAAS LAUNCH (G7)
                                                                 │
P8 growth/hardening ──► P9 maturity ──► P10 operate/compound ───┘
```

**Hard dependencies:** P3 must precede P4 (tools need the rate API); P5 must precede P6 (portal needs tenancy); P7 should follow P6 only loosely — CRM can start earlier if sales pressure demands (swap order 6↔7 in that case). **Never** build P8 SEO scale before P3 rate accuracy: ranking for rates with wrong numbers is worse than not ranking.

## 8.3 Team, roles & capacity plan

| Role | Phase 1–4 (public) | Phase 5–7 (SaaS) | Phase 8+ (scale) |
|---|---|---|---|
| Product/Founder | 50% (decisions, copy, service design) | 40% + sales | 30% + strategy |
| Full-stack engineer | 1 FTE core + 0.5 (3D/3D-specialist) | 1–2 FTE | 2 FTE |
| Designer (UI/UX + brand) | 0.5–1 FTE | 0.5 FTE | 0.5 FTE |
| Content writer / editor | 0.3 (EN + BN) | 0.3 | 1 FTE |
| Tax/compliance reviewer (CA/ACCA) | 0.3 (rate verification) | 0.3 | 0.5 |
| Service delivery (accountants) | — | 0.5 → scales with clients | Scales with revenue |
| Support / client success | — | 0.5 | 1–2 |
| Sales (BD) | — | 0.5 | 1–2 |

**Capacity rule:** never plan engineering at 100% — keep 20% for quality passes, incident response and the inevitable NBR rule change.

## 8.4 Budget & cost model (indicative, monthly, at early scale)

| Category | Lean start | At 200 active businesses | Notes |
|---|---|---|---|
| Hosting (VPS/app + DB + Redis) | $40–80 | $200–400 | Vertical first, then replicas |
| Object storage + CDN | $5–20 | $50–120 | Lifecycle rules for old documents |
| Email (transactional) | $10–20 | $50–120 | Volume grows with clients |
| SMS/WhatsApp | $20 | $150–500 | Highest variable cost — enforce digests |
| AI (assistant/insights) | $30–80 | $200–600 | Cap per plan; cache aggressively |
| Monitoring/analytics | $0–30 | $80–200 | Sentry/PostHog/Uptime tiers |
| Payments (MDR) | % | % | ~2–3% of collected revenue |
| Tools/licences (design, dev, fonts) | $50 | $150 | Fonts are open-source |
| **Total infra** | **$155–280** | **$880–2,060** | Excludes salaries and marketing |
| Marketing (content + ads) | $200–1,000 | $1,500–5,000 | Prefer content/organic over paid early |

**Milestone-triggered spend:** pointer/3D asset commissioning (Phase 2), penetration test (Phase 8), mobile app (Phase 9), Meilisearch hosting (Phase 8), legal counsel review (Phase 0/8).
---

# 9. QUALITY, LAUNCH & OPERATIONS

## 9.1 Testing strategy

**Pyramid + risk weighting.** In a financial product, a wrong number is worse than a broken layout — so the deepest test investment goes to calculation and data provenance, not to pixel checks.

| Layer | Tools | What is covered | Target | Runs |
|---|---|---|---|---|
| **Unit (engine)** | Vitest / Pest | Tax & finance formulas, rate resolution by date, rounding, slabs, VAT inclusive/exclusive, leakage model, formatters (`formatBDT`, `formatDate`), SRO number parsing, eligibility rules | ≥ 90% coverage on `packages/tax-engine` + `Domain/Rates` | Every PR |
| **Unit (component)** | Testing Library | Component states, form validation, keyboard behaviour, live regions | ≥ 70% on shared components | Every PR |
| **Feature/API** | Pest | Auth, tenant isolation, permissions matrix, rate endpoints, tool calculation endpoints, quotes/invoices math, notifications dispatch, webhooks idempotency | 100% of endpoints have ≥ 1 auth + 1 happy + 1 error test | Every PR |
| **Integration** | Pest | Rate publish → revalidation → alert → task creation; payment webhook → subscription state; document upload → scan → signed URL | All critical pipelines | Every PR |
| **E2E (critical journeys)** | Playwright | 14 journeys: book consultation, complete diagnostic, calculate + save a TDS result, subscribe to rate alerts, signup → onboarding → upload → task complete, quote accept → invoice, assistant ask → action, rate publish → public update, upgrade plan, invite user, export data, delete account, portal mobile bottom-nav flow, reduced-motion walkthrough | 14 journeys green; flake < 2% | Every PR (smoke: 4 in < 5 min) + nightly (full) |
| **Visual regression** | Playwright snapshots | 20 key views (home hero, money-flow node, rate table, tool result, dashboard, vault, compliance, quote PDF, admin rate form, empty/error states) | 0 unexplained diffs | Nightly |
| **Accessibility** | axe-core + manual | All public routes + portal modules; keyboard-only walkthrough; NVDA/VoiceOver scripts; reduced-motion project | 0 serious/critical; 0 keyboard traps | Every PR (axe) + per phase (manual) |
| **Performance** | Lighthouse CI + k6/Artillery | Budgets per page type (§3.14); load test 200 concurrent users; DB query budget | Budgets enforced; query p95 thresholds | Every PR (LH) + per phase (load) |
| **Security** | Pest + ZAP + manual | Authz bypass attempts, IDOR sweep, file-upload abuse, prompt injection, rate limits, dependency audit | No high findings | Every PR (deps) + per phase |
| **Data accuracy** | Manual + scripted audits | Rate rows vs NBR sources; deadline dates vs published rules; sample of 20 tool outputs recomputed by hand | ≥ 99% on audited samples | Monthly + on every rate publish |

**Test data:** seeders generate realistic BD businesses (`Rahim Textiles Ltd`, `Nusrat Foods`, ...), 24 months of financial data, multiple rate versions across fiscal years, 40 SROs, and edge cases (zero turnover, loss-making, multi-entity, VAT-exempt). Staging uses anonymized production-like data only.

**Definition of "tested" for a task:** unit tests where logic exists, at least one E2E or integration test for any user-facing flow, plus a documented manual check for anything visual (with a screenshot in the PR).

## 9.2 Performance engineering (budgets, tactics, monitoring)

| Lever | Concrete actions |
|---|---|
| **Rendering** | Next.js server components by default; ISR for rate/content pages; dynamic import everything 3D/animation; no client-side data fetching on first paint for marketing pages |
| **Images** | AVIF/WebP with `next/image`; explicit `width/height`; `priority` only on the hero LCP image; blur placeholders; max 1 hero image ≤ 180 KB |
| **Fonts** | Self-hosted, subset (latin + bengali), preload 2 weights, `font-display: swap`, `size-adjust` to kill CLS |
| **JS** | Route-level splitting; tree-shaking; no lodash/moment; GSAP + three loaded only where used; bundle-size CI guard (fail on > 5% regression) |
| **CSS** | Tailwind v4 with content-aware purging; critical CSS inlined for the hero; avoid runtime CSS-in-JS |
| **Data** | Redis page/data cache with tag-based invalidation; DB indexes on every filtered column; cursor pagination; eliminate N+1 with eager loading + query-count assertions in tests |
| **API** | Response caching with ETags for public rate endpoints; compression (Brotli); HTTP/2; keep payloads minimal (sparse fieldsets) |
| **3D** | Lazy after LCP; DPR clamp (≤ 1.5); instancing for particles; texture budgets; no post-processing on `balanced`; dispose geometries/materials on route change |
| **Portal** | Virtualised long lists; skeleton-first rendering; optimistic updates; cached dashboard payload with a stale-while-revalidate strategy |
| **Monitoring** | Real-user Core Web Vitals via web-vitals library into PostHog/GA4; synthetic checks per release; alerting when p75 LCP > 2.5 s on any key route |

**Rule:** if an effect cannot fit the budget, the effect is cut — never the budget. Document every exception in an ADR with a measured justification.

## 9.3 Security & privacy operations

Covered technically in §4.6. Operationally:

| Ritual | Cadence | Owner |
|---|---|---|
| Dependency & CVE updates | Weekly (patch), monthly (minor) | Engineering |
| Access review (staff + client users) | Quarterly | Founder/Ops |
| Penetration test / structured adversarial review | Annually + after major features | External/Engineering |
| Backup restore drill | Quarterly | Engineering |
| Incident response rehearsal (tabletop) | Twice yearly | Founder + Engineering |
| Privacy & retention audit | Yearly | Founder + counsel |
| AI guardrail eval (injection + hallucination) | On every prompt/model change | Engineering |

**Incident response (documented runbook):** detect → classify severity → contain → communicate (client + regulator as required) → remediate → post-mortem within 5 working days → prevention tasks created with owners. Client-facing commitment: notification within 72 hours of confirming a breach affecting their data.

## 9.4 Content & regulatory operations

| SOP | Trigger | Owner | SLA |
|---|---|---|---|
| Rate change | NBR SRO/circular published | Tax lead | Published within **24–48 working hours** |
| Deadline rule change | NBR notice | Tax lead | Within 48 hours |
| Rate freshness review | Rolling 45-day timer per family | Tax lead | Re-verified, timestamps updated |
| Content correction request | "Report an error" submission | Content editor | Acknowledged in 1 working day; corrected in 3 |
| New explainer article | Editorial calendar | Content + reviewer | Published with author + reviewer + review date |
| Bangla translation | On publish of any public page | Content | Within 5 working days |
| AI knowledge corpus refresh | After any rate/content publish | System (automatic) + spot check | Within 24 hours |

**Rule:** no public regulatory content ships without a named human verifier. This is the one process in the whole roadmap that must never be automated away.

## 9.5 Support & client success model

| Tier | Coverage | Response SLA | Channel |
|---|---|---|---|
| Free tools / rate hub users | Self-serve help centre | Best effort | Help centre + contact form |
| Starter / Growth subscribers | Business hours (10:00–19:00 BST, Sun–Thu) | 4 working hours | In-app, email, WhatsApp |
| Intelligence plan | Extended hours | 2 working hours | + priority queue |
| Enterprise | Named manager, 8:00–22:00 | 1 hour (critical) | + phone + dedicated WhatsApp |
| Statutory deadline incidents | Always | Immediate escalation to the tax lead | All channels |

**Client success cadence:** welcome call ≤ 3 days after activation; 30-day value check (first MIS reviewed); quarterly business review for Intelligence/Enterprise; renewal conversation 60 days out; churn conversation with a documented reason and a win-back plan. **Health score** (engagement + outcomes + sentiment) drives proactive outreach.

**Support-to-product loop:** ticket categories are tagged (bug / data quality / usability / feature request / training gap); the top 5 themes are reviewed monthly and converted into backlog items or documentation.

## 9.6 Analytics & reporting rituals

| Ritual | Cadence | Output |
|---|---|---|
| Daily 15-min ops review | Daily | Errors, funnel anomalies, urgent tickets, deadline risks |
| Weekly growth review | Weekly | Traffic, tool usage, signups, activation, leads, content published, experiments |
| Monthly business review | Monthly | Revenue (services + SaaS), MRR/churn, CAC by channel, service margins, cost per active client, NPS, portfolio outcomes |
| Quarterly product review | Quarterly | Feature adoption, insight accuracy, AI eval results, roadmap re-score |
| Monthly quality review | Monthly | Performance budgets, accessibility, security patches, data-accuracy audit |

## 9.7 Accessibility programme

Beyond the per-phase passes (§3.13): publish an **accessibility statement** naming the conformance target (WCAG 2.2 AA) and known limitations; provide a feedback channel that is itself accessible; run a keyboard-only and screen-reader walkthrough each phase; keep an internal "a11y debt" list with owners; and include an accessibility item in every design review checklist. For a financial product, this also opens the market: government-adjacent and corporate clients often require a stated accessibility position.

## 9.8 Launch readiness checklist (hard gate — every box must be ticked)

**Product & content**
- [ ] Homepage, money-flow, services, industries, rate hub, tools, diagnostics, cost-efficiency, pricing, about, contact, legal pages all content-complete in EN with Bangla on the priority set
- [ ] All rates verified with sources; freshness dates displayed; changelog seeded
- [ ] All 13 tools accountant-reviewed and matching engine vectors
- [ ] Booking, lead capture, rate alerts, newsletter and diagnostic all flowing into the CRM
- [ ] No lorem ipsum, no placeholder images, no "coming soon" links anywhere
- [ ] 404/500/maintenance pages designed and tested

**Platform**
- [ ] Signup → onboarding → document upload → insight → task → report validated end-to-end with 5 real pilot businesses
- [ ] Payments live-tested (real small transactions) with refund path exercised
- [ ] Notifications tested on every channel including fallbacks
- [ ] AI assistant eval ≥ 90% with guardrails active and quotas enforced
- [ ] Export + delete workflows tested with a real account
- [ ] Admin: staff trained, roles assigned, SOPs rehearsed, rate-publish drill executed

**Quality**
- [ ] Lighthouse budgets met on home, rate page, tool, industry, service, portal
- [ ] axe: 0 serious/critical site-wide; keyboard and screen-reader walkthroughs complete
- [ ] Cross-browser/device matrix passed (Chrome, Safari, Firefox, Edge, Samsung Internet; iOS + Android)
- [ ] All P0/P1 bugs closed; P2 documented with owners
- [ ] Load test passed at expected launch-day peak × 3
- [ ] Security review + dependency audit clean; no secrets in the repo; backups verified

**Business & legal**
- [ ] Terms, Privacy, Refund, Disclaimer published and counsel-reviewed
- [ ] Security page accurate; retention matrix published
- [ ] Pricing final; invoice template VAT-correct; refund policy operational
- [ ] Support SLAs staffed and communicated; help centre live
- [ ] Google Business Profile, Search Console, Analytics, PostHog, Sentry all verified
- [ ] Launch-day comms drafted (announcement post, LinkedIn, newsletter, WhatsApp broadcast, partner notes)
- [ ] Monitoring dashboard + on-call rotation live; rollback path rehearsed
- [ ] **Backup operator trained** for rate updates and content publishing (bus factor ≥ 2 for every critical operation)

## 9.9 First 90 days after launch

| Window | Focus | Key metrics to watch | Common failure to avoid |
|---|---|---|---|
| **Day 1–7** | Watch, stabilise, answer every visitor personally | Errors, funnel drop-offs, first leads, support response times | Over-marketing before stability |
| **Day 8–30** | Convert early interest; publish weekly content; run first 2 experiments; onboard pilot clients properly | Signups, activation rate, consultations booked, first paid conversions, rate-page rankings | Chasing traffic while activation is < 30% |
| **Day 31–60** | Double down on the best channel; deepen Bangla content; launch the first case study; iterate pricing if objections repeat | CAC by channel, trial→paid, NPS, churn signals, feature adoption | Adding features instead of fixing the funnel |
| **Day 61–90** | Scale what works; formalise partner conversations; publish benchmark data; begin Phase 9 planning | MRR, service margin, retention, organic growth rate, referral share | Forgetting service capacity while demand grows |

**North-star check at day 90:** monthly active businesses taking an intelligence action, plus at least 5 documented client outcomes with numbers. If those two are healthy, everything else is tuneable.

## 9.10 Risk register (top risks with mitigations)

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R1 | **Incorrect regulatory data published** | Medium | Severe (trust + legal) | Two-person verification, source register, freshness timers, report-an-error, correction changelog, no hardcoding, monthly audits | Tax lead |
| R2 | Regulatory change not caught (SRO published silently) | Medium | High | SourceWatch with daily checklist + staleness alerts + subscriber-driven detection ("we were told by a user" path) | Tax lead |
| R3 | Scope explosion (10D ambitions) delays launch | High | High | Phase gates, fixed launch candidate at G4, effect budget per §3.9, defer to backlog with scoring (§8.1) | Founder |
| R4 | WebGL/3D hurts performance or accessibility | Medium | High | Tier system, static equivalents, budget enforcement in CI, `lite` is fully functional | Engineering |
| R5 | Service delivery capacity can't match lead flow | High | High | Throttle leads by consultant capacity, partner network, productise services, hire ahead of a threshold | Founder |
| R6 | Data breach or client data exposure | Low | Severe | §4.6 controls, tenant isolation tests, audit logs, signed URLs, pen test, IR runbook | Engineering |
| R7 | AI hallucinates financial/legal guidance | Medium | Severe | RAG-only over curated corpus, citations mandatory, confidence labels, fallback to human, eval gate, disclaimers | Engineering + Tax lead |
| R8 | Payment/gateway failures or reconciliation gaps | Medium | Medium | Idempotent webhooks, retry + manual reconciliation view, multiple gateways, clear dunning policy | Engineering |
| R9 | Competitor copies the rate hub | Medium | Medium | Speed of updates, depth of history, SRO summaries, brand and service moat — compete on trust, not on the table | Founder |
| R10 | Key-person dependency (founder/engineer/tax lead) | High | High | Documentation, bus factor ≥ 2 per critical SOP, rehearsal with backup operators, contractor bench | Founder |
| R11 | SEO volatility (algorithm updates) | Medium | Medium | Diversify: email/WhatsApp list, community, partnerships, paid retargeting reserve, B2B referrals | Founder |
| R12 | Licensing/credential misrepresentation risk in marketing copy | Low | High | Legal review of all credential claims; evidence file for every published claim; no implied CA-firm status unless true | Founder |
| R13 | Client statutory deadline missed by DhakaFin | Low | Severe | Automated cadence + human owner per obligation + escalation + SLA + post-mortem; insurance/indemnity review | Tax lead |
| R14 | AI/vendor cost overruns | Medium | Medium | Per-plan caps, caching, model routing, monthly cost review, alerts at 70%/90% of budget | Engineering |
| R15 | Mobile experience underperforms expectations | Medium | Medium | Dedicated mobile designs (§3.12), real-device testing each phase, mobile-first budget | Design |

## 9.11 Maintenance, evolution & documentation policy

- **Weekly:** dependency patches, error-triage, content publish, freshness checks.
- **Monthly:** quality review, cost review, data-accuracy audit, backlog grooming.
- **Quarterly:** roadmap re-score, DR drill, access review, design consistency audit, benchmark refresh.
- **Annually:** strategy reset, penetration test, privacy/retention audit, platform version upgrades, accessibility certification.
- **Documentation debt rule:** any change to architecture, an API contract, a design token, or an operational SOP must update the relevant document **in the same PR**. Undocumented changes are treated as bugs.
- **This blueprint is a living document:** every monthly review can amend it. Amend by adding a dated entry to the revision log (§11) — never silently rewrite history, because future-you needs to know why decisions were made.

**🇧🇩 Banglish closing note for §9:** Ei file ta tomar "100%" er definition. Prottek phase er gate pass korle, tomar product genuinely shesh hoyeche — shudhu feature count na, quality soho. Rag korle na, gate bypass korle na, ar rate-er moto kritikyo jinish kokhono hardcode korle na.
---

# 10. APPENDICES

## Appendix A — Database schema (core regulatory, compliance & tenancy tables)

> Full migrations live in `apps/api/database/migrations`. This DDL is the canonical reference for field names and constraints. Every table: `id`, `created_at`, `updated_at`, `deleted_at` (soft deletes) unless noted.

```sql
-- ─────────────────────────── REGULATORY CORE ───────────────────────────
CREATE TABLE rate_families (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  code          VARCHAR(40)  NOT NULL UNIQUE,      -- tds | vds | vat | income_tax | corporate_tax | ait
  name          VARCHAR(160) NOT NULL,
  short_description TEXT,
  legal_basis   VARCHAR(255),                       -- e.g. "Income Tax Act 2023"
  source_url    VARCHAR(500),
  display_order SMALLINT UNSIGNED DEFAULT 0,
  is_published  BOOLEAN DEFAULT TRUE
);

CREATE TABLE rates (
  id                BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  rate_family_id    BIGINT UNSIGNED NOT NULL,
  title             VARCHAR(255) NOT NULL,
  description       TEXT,
  section_ref       VARCHAR(80),                    -- e.g. "89", "90", "Annexure 2"
  rate_type         ENUM('percent','fixed','range','table','nil') NOT NULL,
  rate_value        DECIMAL(8,4) NULL,              -- when percent/fixed
  rate_min          DECIMAL(8,4) NULL,              -- when range
  rate_max          DECIMAL(8,4) NULL,
  rate_table        JSON NULL,                      -- when table (tiered/slabbed)
  base              VARCHAR(160),                   -- e.g. "Gross payment"
  applicability     TEXT,                           -- who/what/when
  taxpayer_type     VARCHAR(80),                    -- resident | non_resident | company | any | ...
  conditions        JSON NULL,                      -- exclusions, thresholds, special cases
  effective_from    DATE NOT NULL,
  effective_to      DATE NULL,                      -- NULL = currently in force
  reference_sro     VARCHAR(160),
  source_url        VARCHAR(500) NOT NULL,
  status            ENUM('draft','reviewed','verified','superseded') NOT NULL DEFAULT 'draft',
  verified_by       BIGINT UNSIGNED NULL,           -- user id (two-person rule)
  verified_at       TIMESTAMP NULL,
  version           INT UNSIGNED DEFAULT 1,
  previous_rate_id  BIGINT UNSIGNED NULL,
  notes             TEXT,
  UNIQUE KEY uq_rate_identity (rate_family_id, section_ref, taxpayer_type, effective_from),
  KEY idx_rate_lookup (rate_family_id, status, effective_from, effective_to),
  CONSTRAINT fk_rate_family FOREIGN KEY (rate_family_id) REFERENCES rate_families(id),
  CONSTRAINT chk_rate_dates CHECK (effective_to IS NULL OR effective_to > effective_from),
  CONSTRAINT chk_rate_verified CHECK (status <> 'verified' OR (verified_by IS NOT NULL AND verified_at IS NOT NULL))
);

CREATE TABLE rate_changes (
  id             BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  rate_id        BIGINT UNSIGNED NOT NULL,
  change_type    ENUM('created','rate_changed','sro_updated','superseded','note_added') NOT NULL,
  old_value      VARCHAR(120),
  new_value      VARCHAR(120),
  headline       VARCHAR(255),                      -- client-facing wording
  affected_segments JSON,                           -- ["businesses paying contractors", ...]
  effective_from DATE,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_change_rate (rate_id, created_at)
);

CREATE TABLE sros (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  number        VARCHAR(120) NOT NULL,              -- "173-AIN/2025"
  year          SMALLINT UNSIGNED NOT NULL,
  issued_on     DATE,
  title         VARCHAR(500) NOT NULL,
  summary_plain TEXT,                               -- our plain-language summary (verified)
  pdf_url       VARCHAR(500),
  source_url    VARCHAR(500),
  status        ENUM('active','superseded','withdrawn') DEFAULT 'active',
  verified_by   BIGINT UNSIGNED NULL,
  verified_at   TIMESTAMP NULL,
  UNIQUE KEY uq_sro (number, year)
);

CREATE TABLE sro_rate (                              -- affected rates cross-link
  sro_id  BIGINT UNSIGNED NOT NULL,
  rate_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (sro_id, rate_id)
);

CREATE TABLE tax_slabs (
  id             BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  fiscal_year    VARCHAR(9) NOT NULL,               -- "2025-26"
  taxpayer_type  ENUM('individual','woman_or_senior','company','firm','other') NOT NULL,
  slab_order     SMALLINT UNSIGNED NOT NULL,
  income_from    DECIMAL(15,2) NOT NULL,
  income_to      DECIMAL(15,2) NULL,                -- NULL = top slab
  rate_percent   DECIMAL(5,2) NOT NULL,
  surcharge_rule JSON NULL,
  rebate_rule    JSON NULL,
  source_url     VARCHAR(500),
  UNIQUE KEY uq_slab (fiscal_year, taxpayer_type, slab_order)
);

CREATE TABLE compliance_deadline_templates (
  id               BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  obligation_type  VARCHAR(80) NOT NULL,            -- vat_return | tds_deposit | turnover_return | annual_return | rjsc_annual ...
  title            VARCHAR(255) NOT NULL,
  form_ref         VARCHAR(80),                     -- "Mushak 9.1"
  due_rule         VARCHAR(255) NOT NULL,           -- "day=15;cadence=monthly"
  periodicity      ENUM('monthly','quarterly','half_yearly','annual','event') NOT NULL,
  applies_to       JSON NOT NULL,                   -- {"entity_type":["company"],"vat_registered":true,"turnover_min":8000000}
  penalty_note     TEXT,
  required_documents JSON,                          -- ["sales_register","purchase_register"]
  source_url       VARCHAR(500),
  active_from      DATE,
  active_to        DATE NULL,
  version          INT UNSIGNED DEFAULT 1
);

CREATE TABLE compliance_deadlines (                 -- materialised per business
  id                BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id       BIGINT UNSIGNED NOT NULL,
  template_id       BIGINT UNSIGNED NULL,
  period_label      VARCHAR(40),                    -- "Aug 2026"
  title             VARCHAR(255) NOT NULL,
  form_ref          VARCHAR(80),
  due_at            DATE NOT NULL,
  status            ENUM('not_started','in_progress','waiting_client','filed','overdue','not_applicable') NOT NULL DEFAULT 'not_started',
  owner_user_id     BIGINT UNSIGNED NULL,
  ack_reference     VARCHAR(160),
  filed_by          BIGINT UNSIGNED NULL,
  filed_at          TIMESTAMP NULL,
  evidence_document_id BIGINT UNSIGNED NULL,
  penalty_exposure  DECIMAL(15,2) NULL,
  UNIQUE KEY uq_obligation (business_id, template_id, period_label),
  KEY idx_due (business_id, due_at, status)
);

-- ─────────────────────────── TENANCY & BILLING ─────────────────────────
CREATE TABLE businesses (
  id             BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name           VARCHAR(255) NOT NULL,
  legal_name     VARCHAR(255),
  entity_type    ENUM('sole_proprietorship','partnership','private_limited','public_limited','branch','other'),
  tin_encrypted  VARBINARY(255) NULL,               -- app-level encrypted
  bin_encrypted  VARBINARY(255) NULL,
  rjsc_number    VARCHAR(80),
  industry_id    BIGINT UNSIGNED NULL,
  turnover_band  VARCHAR(40),                       -- "80L-3Cr"
  vat_registered BOOLEAN DEFAULT FALSE,
  fiscal_year_end CHAR(5) DEFAULT '06-30',
  address        TEXT, phone VARCHAR(30), email VARCHAR(160),
  logo_path      VARCHAR(500),
  onboarding_step TINYINT DEFAULT 1,
  onboarding_completed_at TIMESTAMP NULL,
  status         ENUM('trial','active','read_only','suspended','churned') DEFAULT 'trial',
  health_score   TINYINT UNSIGNED NULL
);

CREATE TABLE business_users (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id   BIGINT UNSIGNED NOT NULL,
  user_id       BIGINT UNSIGNED NOT NULL,
  role          ENUM('owner','accountant','manager','viewer') NOT NULL,
  permissions   JSON NULL,                          -- overrides
  invited_by    BIGINT UNSIGNED NULL,
  accepted_at   TIMESTAMP NULL,
  UNIQUE KEY uq_membership (business_id, user_id)
);

CREATE TABLE subscriptions (
  id                  BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id         BIGINT UNSIGNED NOT NULL,
  pricing_plan_id     BIGINT UNSIGNED NOT NULL,
  status              ENUM('trialing','active','past_due','cancelled','expired') NOT NULL,
  trial_ends_at       TIMESTAMP NULL,
  current_period_start TIMESTAMP NULL,
  current_period_end  TIMESTAMP NULL,
  cancel_at           TIMESTAMP NULL,
  cancel_reason       VARCHAR(255),
  gateway             VARCHAR(40),                  -- sslcommerz | bkash | nagad | stripe | manual
  gateway_ref         VARCHAR(160),
  mrr_amount          DECIMAL(12,2),
  KEY idx_sub_business (business_id, status)
);

CREATE TABLE documents (
  id              BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  business_id     BIGINT UNSIGNED NOT NULL,
  category        VARCHAR(60) NOT NULL,             -- accounting|tax|vat|audit|corporate|banking|payroll|legal
  title           VARCHAR(255) NOT NULL,
  file_path       VARCHAR(600) NOT NULL,            -- private bucket key
  mime            VARCHAR(120), size_bytes BIGINT UNSIGNED,
  checksum_sha256 CHAR(64),
  version         INT UNSIGNED DEFAULT 1,
  parent_document_id BIGINT UNSIGNED NULL,
  uploaded_by     BIGINT UNSIGNED NOT NULL,
  scan_status     ENUM('pending','scanning','clean','infected','failed') DEFAULT 'pending',
  ocr_text        LONGTEXT NULL,                    -- for search (access-controlled)
  expires_at      DATE NULL,
  confidentiality ENUM('standard','restricted') DEFAULT 'standard',
  retention_until DATE NULL,
  legal_hold      BOOLEAN DEFAULT FALSE,
  KEY idx_doc_business (business_id, category, created_at),
  FULLTEXT KEY ft_doc (title, ocr_text)
);

CREATE TABLE document_access_logs (
  id           BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  document_id  BIGINT UNSIGNED NOT NULL,
  user_id      BIGINT UNSIGNED NULL,
  action       ENUM('view','download','share_link_created','share_link_used','deleted') NOT NULL,
  ip           VARBINARY(16), user_agent VARCHAR(255),
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_access_doc (document_id, created_at)
);
```

**Remaining tables** (full DDL in migrations): `users`, `pricing_plans`, `invoices`, `invoice_items`, `payments`, `tasks`, `task_comments`, `service_requests`, `request_events`, `messages`, `message_threads`, `reports`, `report_versions`, `insights`, `insight_definitions`, `assistant_conversations`, `assistant_messages`, `knowledge_chunks` (vector), `leads`, `lead_activities`, `consultations`, `quotes`, `quote_items`, `document_requests`, `notification_templates`, `notification_logs`, `audit_logs`, `feature_flags`, `benchmarks`, `diagnostic_rules`, `services`, `industries`, `pages`, `section_blocks`, `posts`, `faqs`, `case_studies`, `testimonials`, `team_members`, `glossary_terms`, `menu_items`, `redirects`, `global_settings`, `media_assets`, `source_watch`.

## Appendix B — Design tokens (reference)

Full machine-readable file: `packages/tokens/df.tokens.json` (see the excerpt in §3.11). Reference tables for the values that must never be improvised:

| Group | Tokens |
|---|---|
| Colour (core) | `void #020b0a` · `voidDeep #010807` · `slateDeep #041312` · `surface1 #061715` · `surface2 #0a1f1c` · `surface3 #0f2a26` · `glassTint rgba(8,30,27,.65)` |
| Colour (brand) | `sea700 #0d9488` · `sea600 #0f9e93` · `sea500 #14b8a6` · `sea400 #2dd4bf` · `sea300 #5eead4` · `sea200 #99f6e4` |
| Colour (secondary) | `cyan #22d3ee` · `cyanDim #0891b2` · `gold #d97706` · `goldBright #fbbf24` · `violetDusk #7c6cf0` (AI only) |
| Colour (semantic) | `ok #34d399` · `warn #fbbf24` · `risk #fb923c` · `danger #f87171` |
| Colour (text) | `text #e2e8f0` · `textStrong #f8fafc` · `muted #94a3b8` · `muted2 #64748b` (decorative only) |
| Space | `4 8 12 16 20 24 32 40 48 64 80 96 128 160 200` px |
| Radius | `sm 8` · `md 12` · `lg 16` · `xl 20` · `2xl 28` · `full 9999` |
| Duration | `120 200 320 560 900` ms |
| Easing | `out cubic-bezier(.16,1,.3,1)` · `inOut cubic-bezier(.65,0,.35,1)` · `spring cubic-bezier(.34,1.56,.64,1)` |
| Blur | `glass 16px` · `overlay 24px` · `heavy 32px` |
| Shadow | `sh1 0 1px 2px rgba(0,0,0,.4)` · `sh2 0 4px 16px rgba(0,0,0,.45)` · `sh3 0 12px 32px rgba(0,0,0,.5)` · `sh4 0 24px 64px rgba(0,0,0,.6)` · `glow 0 0 32px rgba(45,212,191,.25)` |
| Type scale | `display 44→88` · `h1 36→60` · `h2 28→42` · `h3 22→30` · `h4 18→22` · `bodyLg 17→19` · `body 15→16` · `sm 13→14` · `xs 11→12` · `metricXl 32→52` · `metric 22→32` · `metricSm 16→20` · `overline 10→12` |
| Breakpoints | `xs 360` · `sm 480` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536` |
| Experience tiers | `ultra` · `high` · `balanced` · `lite` |

**Contrast audit (locked pairs, measured):** `#14b8a6` on `#020b0a` = 8.00:1 ✅ · `#2dd4bf` = 10.69:1 ✅ · `#5eead4` = 13.46:1 ✅ · `#0d9488` = 5.32:1 (large text/fills only) · `#94a3b8` = 7.76:1 ✅ · `#64748b` = 4.18:1 ⚠️ (decorative/≥19px bold only) · `#e2e8f0` = 16.15:1 ✅ · `#d97706` = 6.25:1 ✅ · `#fbbf24` = 11.93:1 ✅ · **`#020b0a` on `#14b8a6` = 8.00:1 ✅ (primary button)** · **`#ffffff` on `#14b8a6` = 2.49:1 ❌ NEVER**.

## Appendix C — Rate seeding template & example rows

**CSV template** (`docs/blueprint/rates_seed_template.csv`):

```csv
family,title,section_ref,rate_type,rate_value,base,taxpayer_type,applicability,effective_from,effective_to,reference_sro,source_url,verified_by,verified_at,notes
```

**Example rows (structure demonstration only — every value must be re-verified against the current NBR source before seeding):**

| family | title | section_ref | rate_type | rate_value | base | taxpayer_type | effective_from | reference_sro | status |
|---|---|---|---|---|---|---|---|---|---|
| tds | Contractor / sub-contractor payments | 89 | percent | 7.5 | Gross payment | resident | 2025-07-01 | *(FY SRO — verify)* | draft |
| tds | Professional / advisory service fees | 90 | percent | 10 | Gross payment | any | 2025-07-01 | *(Annexure 2 — verify)* | draft |
| tds | Rental income | 109 | percent | *verify* | Gross rent | any | 2025-07-01 | *(verify)* | draft |
| vds | VAT deduction on specified services | — | percent | *verify per service* | Gross bill | any | 2025-07-01 | *(verify)* | draft |
| vat | Standard VAT rate | 15 (VAT Act) | percent | 15 | Taxable supply/import | any | 2019-07-01 | — | draft |
| vat | Turnover tax (enlisted) | — | percent | *verify band* | Annual turnover | small business | *(verify)* | *(verify)* | draft |
| income_tax | Individual slab — top rate | — | percent | *verify slab table* | Taxable income | individual | *(FY start)* | *(verify)* | draft |
| corporate_tax | Private limited company (unlisted) | — | percent | *verify* | Taxable income | company | *(FY start)* | *(verify)* | draft |

> ⚠️ **Hard rule:** no row is published with `status = verified` until a named human has checked it against the official source and recorded `verified_by` + `verified_at` + `source_url`. This template intentionally shows placeholders rather than half-remembered figures — that discipline *is* the product.

## Appendix D — API endpoint index

Primary endpoints are specified in §4.5. Additional endpoints required by later phases:

| Method | Endpoint | Phase | Purpose |
|---|---|---|---|
| `POST` | `/api/v1/documents/upload-url` | 6 | Signed direct-to-storage upload initiation |
| `POST` | `/api/v1/documents/{id}/scan-complete` | 6 | Post-upload scan callback |
| `GET` | `/api/v1/business/{id}/health-score` | 6 | Health score + subscores + "what moves it" |
| `POST` | `/api/v1/business/{id}/books/import` | 6 | CSV/XLSX import with dry-run + error report |
| `GET` | `/api/v1/business/{id}/reports/{report}/versions` | 6 | Report version history |
| `POST` | `/api/v1/business/{id}/reports/{report}/schedule` | 6 | Scheduled delivery setup |
| `POST` | `/api/v1/business/{id}/assistant/{conversation}/feedback` | 6 | Thumbs up/down + comment |
| `GET` | `/api/v1/business/{id}/audit-log` | 6 | "Who accessed my data" |
| `POST` | `/api/v1/quotes/{token}/accept` \| `/decline` | 7 | Public quote decision |
| `GET` | `/api/v1/internal/leads`, `POST /leads/{id}/convert` | 7 | Internal CRM operations (token-scoped) |
| `POST` | `/api/v1/webhooks/whatsapp` | 8 | WhatsApp delivery + inbound messages |
| `GET` | `/api/v1/public/benchmarks?industry=` | 8 | Published benchmark bands |
| `POST` | `/api/v1/partners/referrals` | 8 | Partner referral tracking |
| `GET` | `/api/v1/openapi.json` | 8 | Machine-readable API contract |

**Contract rules:** versioned under `/api/v1`; JSON envelopes `{data, meta, links}`; cursor pagination; RFC7807 errors with a correlation id; idempotency keys on all money-affecting POSTs; every rate-bearing response includes provenance fields.

## Appendix E — Component checklist (ship gate per component)

- [ ] All variants implemented (per §3.6) — no one-off styles
- [ ] States: default · hover · focus-visible · active · disabled · loading · error · empty
- [ ] Token-driven (no raw hex/px values; CI-enforced)
- [ ] Responsive at all 6 breakpoints; min touch target 44px
- [ ] Reduced-motion variant
- [ ] Keyboard operable with visible focus; correct ARIA roles/state
- [ ] Screen-reader tested (NVDA or VoiceOver) with sensible announcements
- [ ] Used in ≥ 1 real page (not only in the gallery)
- [ ] Documented in the internal gallery with props and usage notes
- [ ] Visual regression snapshot committed

## Appendix F — Per-page QA matrix (apply to every published page)

| Check | How |
|---|---|
| Content completeness | No placeholder text; EN + BN present per the translation plan |
| Metadata | Title ≤ 60 chars, description 150–160, canonical, OG image, locale alternates |
| Schema | Correct type(s), validated in Rich Results Test |
| Internal links | ≥ 3 contextual links; all resolve (automated link check) |
| Performance | Lighthouse budgets met; no layout shift; images sized |
| Accessibility | axe 0 serious/critical; keyboard-only pass; reduced-motion pass |
| Analytics | Page view + primary CTA events fire with correct properties |
| Error handling | Simulated API failure shows a graceful, actionable state |
| Mobile | 360px: no horizontal scroll; primary action reachable in the thumb zone |
| Bangla | Locale switch renders correctly with no text overflow or conjunct breakage |
| Trust | Sources/disclaimers present where numbers or claims appear |

## Appendix G — Analytics event catalogue

Consolidated from §7.4 plus module events:

`page_view`, `rate_viewed`, `rate_searched`, `rate_compared`, `rate_alert_subscribed`, `sro_viewed`, `calendar_viewed`, `calendar_exported`, `tool_started`, `tool_calculated`, `tool_saved`, `tool_shared`, `tool_result_emailed`, `money_flow_opened`, `money_flow_node_opened`, `cost_efficiency_estimated`, `diagnostic_started`, `diagnostic_step_completed`, `diagnostic_completed`, `diagnostic_result_shared`, `cta_clicked`, `cta_form_opened`, `lead_submitted`, `consultation_slot_viewed`, `consultation_booked`, `consultation_rescheduled`, `quote_sent`, `quote_viewed`, `quote_accepted`, `quote_declined`, `account_created`, `onboarding_step_completed`, `onboarding_completed`, `onboarding_abandoned`, `business_profile_updated`, `document_uploaded`, `document_downloaded`, `document_shared`, `document_request_sent`, `task_created`, `task_completed`, `task_overdue`, `obligation_viewed`, `obligation_filed`, `insight_viewed`, `insight_actioned`, `insight_dismissed`, `assistant_asked`, `assistant_rated`, `assistant_action_executed`, `report_generated`, `report_downloaded`, `subscription_started`, `trial_started`, `trial_converted`, `plan_changed`, `subscription_cancelled`, `payment_failed`, `payment_succeeded`, `notification_sent`, `notification_opened`, `notification_clicked`, `notification_preference_changed`, `search_performed`, `search_zero_results`, `command_palette_opened`, `experiment_exposed`, `error_displayed`, `support_ticket_created`.

**Required properties for every event:** `timestamp`, `user_id` (if authed, hashed for anonymous), `business_id` (if applicable), `locale`, `experience_tier`, `device_class`, `route`, `referrer`, `utm_*` (when present), plus the event-specific fields. **Forbidden:** raw names, phone numbers, TIN/BIN, document names, free-text amounts tied to an identifiable business.

## Appendix H — Manual test scripts (run per phase)

**Script 1 — Rate publish drill (60 min)**
1. Pick a real NBR source, mark it checked in SourceWatch with a screenshot.
2. Create a draft rate change with SRO reference. Attempt to publish alone → system must block (two-person rule).
3. Have a second verifier approve → publish. Confirm: previous rate superseded, changelog entry created, public page updated ≤ 5 min, alert queued, affected client tasks created, Insights draft generated, sitemap pinged.
4. Verify the public page shows the new value, effective date, SRO, and "last verified" timestamp.
5. Roll back one step (supersede back) to prove reversibility with an audit trail.

**Script 2 — Compliance cadence drill (45 min)**
1. Create a test business with a VAT obligation due in 31 days.
2. Advance the system clock (test helper) through T-30, T-7, T-3, T-1, T-0, T+1.
3. Assert exactly one notification per stage per channel, correct severity styling, delivered WhatsApp/SMS/email, and in-app entries.
4. Mark filed with an acknowledgement → cadence stops, receipt stored, client timeline updated.

**Script 3 — Tenant isolation sweep (90 min)**
1. Create two businesses (A and B) with separate owners.
2. With A's session, attempt to access every B resource id via the API and UI (documents, tasks, invoices, reports, insights, assistant, exports).
3. Expect 403/404 with no data leakage and no existence disclosure.
4. Attempt to override `business_id` in request bodies → must be ignored.
5. Attempt to access an internal staff note via the client API → must be impossible.
6. Repeat with a Viewer role to confirm write restrictions.

**Script 4 — End-to-end client journey (90 min)**
Search → rate page → inline calculator → save alert → diagnostic → consultation booking → CRM lead → quote → accept → onboarding → upload → task complete → insight action → report download → upgrade subscription → export data. Every handoff must preserve context, and every email/SMS/WhatsApp must arrive.

**Script 5 — Accessibility walkthrough (60 min)**
Keyboard-only full pass of home, rate page, tool, dashboard, vault. Screen-reader pass with NVDA (Windows) and VoiceOver (Mac/iOS). Reduced-motion pass. 200% zoom pass. Document findings, fix, re-test.

## Appendix I — Asset production list (what must be designed before build)

| Asset | Quantity | Spec notes | Phase |
|---|---|---|---|
| Logo wordmark + monogram | 1 + 1 | SVG, dark/light, monogram for favicon/PWA (maskable) | 0–1 |
| Custom icon set | ~60 + 12 domain icons | 1.5px stroke, 24px grid, SVG sprite | 1 |
| 3D entities (hero + money-flow) | 9–11 | Low-poly, glTF ≤ 120 KB each, PBR-lite materials, `grad-metal` palette | 2 |
| Industry illustrations | 11 | Consistent geometric style, SVG or lite 3D stills | 2 (3) + 8 |
| Service illustrations/diagrams | 9 | Workflow visuals, SVG | 2 |
| OG image templates | 6 | Home, rate, tool, service, industry, money-flow node | 2 |
| Dashboard sample screens | 6 | For the public product tour, clearly labelled sample data | 2 |
| Report/PDF templates | 6 | MIS, invoice, quote, tax computation, compliance summary, VDS certificate | 6 |
| Error/empty state art | 8 | Light-touch, brand-consistent, never childish | 1–2 |
| Motion reference clips | 10 | Recorded prototypes for each signature motion (§3.10) | 1–2 |
| Bangla typography specimens | 1 | Sizes, line-heights, conjunct tests for the team | 1 |
| Photography (team/office) | 10–15 | Real photos only; no stock handshakes; consistent grading | 2–3 |
| Video assets | 3–5 | Product tour, founder story, client testimonials (optional, after launch) | 8 |

## Appendix J — Copy deck: master key list (excerpt)

Namespaced keys are stored in `messages/en.json` and `messages/bn.json`; all marketing copy lives in the CMS where possible.

| Key | English |
|---|---|
| `common.cta.book` | Book a Consultation |
| `common.cta.tools` | Try Free Tools |
| `common.cta.talk` | Talk to a specialist |
| `common.updated` | Updated {date} |
| `common.verified` | Verified {date} |
| `common.source` | Source / SRO |
| `common.disclaimer.short` | General information based on published NBR sources — not professional advice for your specific case. |
| `nav.rates` | Rates |
| `home.hero.h1` | Make Better Financial Decisions. |
| `home.hero.philosophy` | Numbers tell you what happened. Intelligence tells you what to do next. |
| `moneyflow.h1` | Where Is Your Money Going? |
| `moneyflow.sub` | Every taka follows a path. Most owners only see the last stop. |
| `costeff.h1` | Your Biggest Cost May Be the One You Don't See. |
| `rates.h1` | Bangladesh Tax, VAT & TDS Rates |
| `rates.trust` | Verified against NBR sources. Last full review: {date}. |
| `tools.h1` | Free financial tools, built by accountants. |
| `diagnostic.h1` | Understand your business's financial health in 2 minutes. |
| `portal.greeting` | Good morning, {name}. Today: {summary}. |
| `portal.kpi.driver` | Primary driver: {driver} |
| `compliance.due` | {obligation} is due {date} — {days} days left. |
| `compliance.overdue` | {obligation} was due {date}. Penalty risk: {penalty}. Fastest fix: {action}. |
| `assistant.disclaimer` | Answers are based on your data and our verified sources. Always confirm before filing. |
| `assistant.fallback` | I don't have a verified answer for this. Here's a specialist who can help. |
| `error.generic` | Something went wrong on our side. Reference: {id}. Please try again. |
| `empty.vault` | Nothing here yet. Upload a bank statement or sales register to see your first insight. |

## Appendix K — NBR source register (starter list — verify and extend)

| Source | Purpose | Check frequency | Owner |
|---|---|---|---|
| NBR website → Income Tax → SROs / Notifications | TDS sections, rate amendments | Daily | Tax lead |
| NBR website → VAT → SROs, VAT returns, Mushak forms | VAT/VDS rates, forms, deadlines | Daily | Tax lead |
| NBR budget/FY publications (Finance Act, rate schedules) | Annual slabs, corporate rates, thresholds | On publication (Jun–Jul) | Tax lead |
| NBR e-return portal notices | Filing deadlines, extensions | Weekly | Tax lead |
| RJSC circulars & fee schedules | Corporate compliance deadlines | Monthly | Corporate compliance |
| Bangladesh Bank circulars (where relevant to clients) | Banking/reporting obligations | Monthly | Advisory |
| Bangladesh Gazette | Statutory commencement notifications | Monthly | Tax lead |
| NBR press releases & clarifications | Interpretation changes | Weekly | Tax lead |

**Register discipline:** each source row in `source_watch` stores URL, purpose, frequency, owner, `last_checked_at`, `last_change_found_at`, notes and an attached artefact (screenshot/PDF) per check. A source unchecked beyond its frequency raises an alert in the ops cockpit — this is the mechanism that keeps the promise *"verified within 24–48 working hours."*

## Appendix L — Bilingual glossary (starter, extends into `/glossary`)

| English | Bangla | Plain-language note |
|---|---|---|
| TDS (Tax Deducted at Source) | উৎসে কর / টিডিএস | Tax you withhold when paying someone and deposit to NBR |
| VDS (VAT Deducted at Source) | উৎসে ভ্যাট / ভিডিএস | VAT you withhold on specified services and deposit to NBR |
| VAT (Value Added Tax) | মূল্য সংযোজন কর / ভ্যাট | Tax on the value a business adds |
| Turnover Tax | টার্নওভার ট্যাক্স | A simplified fixed tax for smaller businesses instead of full VAT |
| Input Tax Credit (Rebate) | ইনপুট ট্যাক্স ক্রেডিট | VAT paid on purchases that you can offset against VAT collected |
| Output Tax | আউটপুট ট্যাক্স | VAT you collect from customers |
| Supplementary Duty | সম্পূরক শুল্ক | Extra duty on specific goods/services |
| AIT (Advance Income Tax) | অগ্রিম আয়কর | Tax paid in advance, often at import stage |
| Assessment Year | কর নির্ধারণী বছর | The year in which income is assessed |
| Taxable Income | করযোগ্য আয় | Income after allowed deductions/exemptions |
| Rebate | রেয়াত | Reduction of tax for qualifying investments |
| Surcharge | সারচার্জ | Additional tax on high income/wealth |
| Minimum Tax | ন্যূনতম কর | The floor tax payable regardless of profit |
| Mushak 9.1 | মূসক ৯.১ | The monthly VAT return form |
| Mushak 6.6 | মূসক ৬.৬ | The VAT deduction certificate form |
| Mushak 6.3 | মূসক ৬.৩ | The VAT challan for taxable supply transfer |
| BIN | বিপিন / বিআইএন | Business Identification Number (VAT registration) |
| TIN | টিআইএন | Taxpayer Identification Number |
| RJSC | আরজেএসসি | Registrar of Joint Stock Companies and Firms |
| SRO (Statutory Regulatory Order) | এসআরও | The legal instrument publishing rate/rule changes |
| Fiscal Year | অর্থবছর | Bangladesh: 1 July – 30 June |
| Provisional Assessment | অস্থায়ী মূল্যায়ন | Interim VAT assessment before final determination |
| Withholding Tax | উৎসে কর্তিত কর | Umbrella term for TDS and VDS |
| Reconciliation | সমন্বয়করণ / রিকনসিলিয়েশন | Matching your records to bank/returns |
| Cash Conversion Cycle | নগদ রূপান্তর চক্র | Days from paying suppliers to collecting from customers |
| Gross Profit | স্থূল মুনাফা | Revenue minus direct costs |
| Operating Profit | পরিচালন মুনাফা | Profit after operating expenses |
| Net Profit | নিট মুনাফা | Final profit after all costs and tax |
| Working Capital | কার্যকরী মূলধন | Current assets minus current liabilities |
| Break-even Point | ব্রেক-ইভেন পয়েন্ট | Sales level with neither profit nor loss |

## Appendix M — 100% Completeness Matrix (every concept requirement → where it is delivered)

| Concept § | Requirement | Where delivered | Build tasks |
|---|---|---|---|
| 1 | Absolutely no design compromise | §3 (whole section), §10.2 review, Gates G1/G2 | DF-P1-003…016, DF-P2-032, DF-P2-040 |
| 2 | Core design philosophy & positioning | §1.1, §3.1 (DP-01…DP-10) | DF-P0-004, DF-P2-002, DF-P2-018 |
| 3 | Visual direction (palette, materials, depth, typography) | §3.2, §3.3, §3.4, Appendix B | DF-P1-003, DF-P1-004, DF-P1-005 |
| 4 | 3D → 10D experience model | §3.9 (concrete tiers, budgets, fallbacks) | DF-P1-007, DF-P2-003…006, DF-P2-012, DF-P2-019…023 |
| 5 | Hero signature experience + Financial Universe | §5.1 (F1) | DF-P2-002…006, DF-P2-010 |
| 6 | "Where Is Your Money Going?" signature section | §5.2 (F2) | DF-P2-019…023 |
| 7 | Financial Intelligence Platform (command centre) | §5.7 (F7) | DF-P6-002…012 |
| 8 | Public Financial & Compliance Hub (rates, SROs, circulars, deadlines) | §5.4 (F4) | DF-P3-001…026 |
| 9 | Financial tools (12+ calculators) | §5.5 (F5) | DF-P4-001…027 |
| 10 | Service experience (9 services, ecosystem) | §5.6 (F6) | DF-P2-024 |
| 11 | Business Diagnostic Engine | §5.8 (F8) | DF-P4-028…032 |
| 12 | Industry experience (11 industries) | §5.13 (F13) | DF-P2-043, DF-P8-001, DF-P8-002 |
| 13 | Cost Efficiency experience + leakage visualisation | §5.9 (F9) | DF-P2-012, DF-P2-044, DF-P4-015, DF-P4-033, DF-P4-034 |
| 14 | Compliance intelligence (personalised centre) | §5.10 (F10) | DF-P3-016, DF-P3-017, DF-P6-015, DF-P6-016 |
| 15 | Client SaaS portal + secure document vault | §5.11 (F11) | DF-P5-001…024, DF-P6-001…045 |
| 16 | AI Financial Assistant ("Ask DhakaFin") | §5.12 (F12) | DF-P6-025…031, DF-P9-001, DF-P9-010 |
| 17 | Motion design (GSAP/Three/ScrollTrigger/particles/magnetic/transitions) | §3.10 (motion language), §3.9 | DF-P1-008, DF-P2-003, DF-P2-032 |
| 18 | Micro-interactions (14+ states) | §5.14.3 (inventory) | DF-P2-032, DF-P1-005, DF-P1-014 |
| 19 | Typography & complete UI system (design system) | §3.4, §3.6, Appendix E | DF-P1-003…005, DF-P1-010 |
| 20 | Dedicated mobile experience | §3.12, §5.1.2/mobile specs | DF-P2-039, DF-P6-036, DF-P8-010 |
| 21 | Accessibility (WCAG 2.2 AA) | §3.13, §9.7 | DF-P1-015, DF-P2-035, DF-P6-038, DF-P8-018 |
| 22 | Performance (WebP/AVIF, code splitting, caching, CDN, Redis) | §3.14, §9.2 | DF-P2-034, DF-P3-023, DF-P6-037, DF-P8-012, DF-P8-013 |
| 23 | Admin-controlled content (Filament, no hardcoded data) | §6 (whole), §4.4 rate engine | DF-P1-010, DF-P3-004, DF-P3-005, DF-P7-012…016 |
| 24 | Design originality rule (no copying) | §3.1 DP-05, §1.6, DF-P0-003 audit, §10.2 | DF-P0-003, DF-P2-040, DF-P10-014 |
| 25 | Feature quality (design + real utility) | §0.2 DoD, all gates, §9.1 testing | Every phase gate |
| 26 | Trust & professionalism | §1.7, §5.3, `/security`, enterprise pack | DF-P2-025, DF-P2-027, DF-P8-017, DF-P8-023 |
| 27 | Final experience standard (12-question review) | §10.2 (checklist applied per screen) | Applied at every gate review |
| Final directive | Next-generation financial intelligence ecosystem, not an accounting website | Whole document — strategy §1, experience §3/§5, platform §4/§6, roadmap §8 | All phases |

## 10.1 How to keep this blueprint alive (practical rules)

1. **This file is version-controlled** in the repo at `docs/blueprint/DhakaFin_100_Percent_Master_Roadmap_Blueprint.md`. It is the single source of truth, referenced by every PR that changes scope.
2. **Scope changes require an amendment entry**, not a silent edit — see the revision log below.
3. **Task IDs are permanent.** If a task is dropped, mark it `CANCELLED` with a reason; do not renumber.
4. **Gates are recorded** in `docs/blueprint/gate-signoffs.md` with the date, who verified, and the evidence links (CI run, audit report, screenshots).
5. **Every phase retro** adds three bullets: what worked, what didn't, what changes in the next phase — and updates the estimate accuracy column.

## 10.2 The 12-Question Screen Review (run before marking ANY screen complete)

Answer honestly, in writing, for every screen at its gate review:

| # | Question | If the answer is… |
|---|---|---|
| 1 | Does this look ordinary? | Yes → redesign the hierarchy and the signature element |
| 2 | Could this be mistaken for a template? | Yes → change layout archetype (§3.5) or add the domain-specific detail (statutory data, real flows) |
| 3 | Is the hierarchy excellent? | No → one H1, one primary CTA, one primary number; delete competing elements |
| 4 | Is the interaction meaningful? | No → remove the interaction rather than decorate it |
| 5 | Is the animation purposeful? | No → delete it (DP-01) |
| 6 | Does it communicate financial intelligence (not just data)? | No → add qualifier, driver, benchmark, or "what to do next" |
| 7 | Is the UI production-ready (all states, no placeholders)? | No → build the missing states; it is not done |
| 8 | Is it responsive (all 6 breakpoints, real device tested)? | No → fix before merge |
| 9 | Is it accessible (keyboard, SR, contrast, reduced motion)? | No → fix before merge; a11y is not a follow-up |
| 10 | Is it fast (budget met)? | No → optimise or cut the effect, never the budget |
| 11 | Does it feel premium (restraint, spacing, type, micro-states)? | No → apply DP-09: remove 20% and refine |
| 12 | Does it feel uniquely DhakaFin (Bangladesh-specific, brand-specific)? | No → add the local truth: ৳, lakh-crore, Mushak, SRO, Bangla, BD fiscal year |

**If any critical answer is NO, iterate. That is the entire quality system in one table.**

---

# 11. REVISION LOG

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | (earlier) | Founder | Original 8-page "Complete Master Product, SaaS & Technology Roadmap" PDF: 3-layer architecture, 9 services, palette/typography lock, 8-step plan (Steps 1–2 claimed complete) |
| 2.0 | 2026-09-20 | DhakaFin product programme | **This document.** Full rebuild: 11 phases with 281 numbered tasks and 11 gates; complete page/feature specifications (F1–F14); the 3D→10D experience model with performance tiers; measured contrast system; motion & micro-interaction languages; multi-tenant architecture, DB schema and API contracts; Filament admin + CRM + quote engine spec; SEO/growth engine; QA, launch and operations runbooks; risk register; 13 appendices including the 100% Completeness Matrix |

**Next scheduled amendment:** after Gate G4 (public launch candidate) — update with measured performance data, actual SEO rankings, and any scope moved to the backlog.

---

## FINAL WORD

This blueprint exists so that the answer to *"are we done?"* is never a feeling — it is a checklist.

Every number on the public site will be sourced and dated. Every rate will be database-driven and human-verified. Every screen will pass twelve questions before it ships. Every phase will close with a gate rather than with hope. And every improvement will be added here first, so the product's ambition stays ahead of its codebase.

> **Make Better Financial Decisions.**
>
> *Numbers tell you what happened. Intelligence tells you what to do next.*
