/** Home page (Phase 1 foundation page; rebuilt as the flagship homepage in Phase 2). */
export const home = {
    meta: {
      title: 'DhakaFin — Make Better Financial Decisions.',
      description:
        'Financial intelligence, accounting, tax and VAT compliance for Bangladeshi businesses. Phase 1: the design system and engineering foundation.',
    },

    hero: {
      eyebrow: 'Financial intelligence for Bangladesh',
      phaseBadge: 'Phase 1 · Foundation',
      /* Split so the sea-green accent can wrap one word in both languages. */
      titleLead: 'Make Better',
      titleAccent: 'Financial',
      titleTail: 'Decisions.',
      lede:
        'Accounting, audit, tax, VAT and financial intelligence built around one goal — helping businesses understand their numbers, control their costs and move forward with confidence.',
      pullQuote: 'Numbers tell you what happened. Intelligence tells you what to do next.',
      terminalTitle: 'Control terminal',
      terminalFootnote:
        'Illustrative interface. Live dashboards, real business data and the full command centre ship in Phase 6.',
      stats: {
        reconciled: 'Books reconciled',
        nextFiling: 'Next filing',
        runway: 'Cash runway',
        openFlags: 'Open flags',
        atCurrentBurn: 'at current burn',
        oneHigh: '1 high',
      },
      flow: {
        heading: 'Money flow · signature motion',
        alt: 'Animated data stream from revenue to net profit',
        revenue: 'Revenue',
        core: 'Profit core',
        netProfit: 'Net profit',
      },
    },

    phaseNotice: {
      title: 'Phase 1 build — this is the foundation, not the finished homepage',
      action: 'See what is built and what is next',
      body:
        'The token pipeline, component library, motion language, experience tiers, accessibility baseline and CI quality gates are in place. The signature homepage (WebGL financial universe), the money-flow experience, the rate hub, the 13 tools and the SaaS portal follow in Phases 2–7 as specified in the master roadmap.',
    },

    intelligence: {
      eyebrow: 'Signature components',
      title: 'Numbers that explain themselves.',
      body:
        'A bare figure is not intelligence. Every KPI in DhakaFin carries its delta, a plain-language judgement, the driver behind the change and the period it refers to — so a business owner knows what to do next, not just what happened.',
      period: 'Jul 2026 · vs Jun 2026',
      fromBooks: 'from books',
      fromBank: 'from bank',
      kpi: {
        revenue: 'Revenue',
        revenueQualifier: 'Growth accelerating',
        revenueDriver: 'Sales volume, not price',
        grossProfit: 'Gross profit',
        grossProfitQualifier: 'Margin holding steady',
        grossProfitDriver: 'Direct cost in line with sales',
        netProfit: 'Net profit',
        netProfitQualifier: 'Margin softening',
        netProfitDriver: 'Payroll up 22% vs output 6%',
        cash: 'Cash position',
        cashQualifier: 'Runway steady',
        cashDriver: 'Receivables ageing in 60+ days',
      },
    },

    regulatory: {
      eyebrow: 'Regulatory trust',
      title: 'Every rate shows its source. Every time.',
      body:
        'A rate without provenance is a liability. The rate card component cannot render without an effective date, a reference and a named verifier — the database, the API contract and the component all enforce the same rule, and CI fails the build if a rate value is ever hardcoded into the frontend.',
      terms: {
        effectiveDate: 'Effective date',
        effectiveDateText: 'The date the rate took legal effect, not the date we published it.',
        reference: 'Reference / SRO',
        referenceText: 'The instrument that changed it, linked to the official PDF.',
        verified: 'Verified',
        verifiedText: 'Who checked it against the source, and when — refreshed on a 45-day cycle.',
      },
      rate: {
        title: 'Contractor / sub-contractor payments',
        base: 'Gross payment',
        applicability: 'Payments to resident contractors, sub-contractors and suppliers for works',
        taxpayerType: 'Resident',
        verifiedBy: 'DhakaFin tax team',
      },
      placeholderTitle: 'Rate values on this page are placeholders',
      placeholderBody:
        'The rows above demonstrate the component’s structure with clearly-marked sample values. The rate database — with historical versions, SRO links and comparison across fiscal years — is built in Phase 3, and no rate ships until a named reviewer verifies it against the official source.',
    },

    compliance: {
      eyebrow: 'Compliance intelligence',
      title: 'Urgency that stays calm.',
      body:
        'Deadlines escalate through four deliberate states and nothing else. No flashing, no countdown clocks, no red flooding — the interface should feel intelligent, not stressful. Each item names what it is, who owns it, what is still missing and what happens next.',
      vatTitle: 'VAT Return — August 2026',
      vatRequirements: 'Needs: sales register, purchase register, input tax credit ledger',
      vatOwner: 'DhakaFin consultant',
      vatAction: 'Upload remaining document',
      tdsTitle: 'TDS Deposit — September 2026',
      tdsOwner: 'You',
      tdsAction: 'Review deduction schedule',
    },

    designLanguage: {
      eyebrow: 'Design language',
      title: 'Ten principles, one system.',
      depth: {
        title: 'Depth with purpose',
        body: 'Five layers — canvas, grid, context, element, overlay — each one expressing a level of information, never decoration.',
      },
      motion: {
        title: 'Motion with meaning',
        body: 'Three motion layers with fixed durations: structure 560–900ms, component 120–320ms, detail 60–160ms. Detail never outruns component.',
      },
      scroll: {
        title: 'Scroll that tells the story',
        body: 'Pinned sequences are capped at two per page and always degrade to a static, complete layout.',
      },
      data: {
        title: 'Data you can interrogate',
        body: 'Charts animate their draw, never the data. Hover, keyboard and a data-table fallback reach the same numbers.',
      },
      context: {
        title: 'Context-aware by design',
        body: 'Four experience tiers detect the device, the connection and the user’s motion preference, then drop heavy effects without dropping features.',
      },
      continuity: {
        title: 'Continuity across sections',
        body: 'Selecting a node updates the insight rail, the chart, the related service and the URL together — one interaction, one state.',
      },
      tiersTitle: 'Experience tiers',
      tiersBody:
        'The full experience on capable hardware; a complete, fast, fully usable product everywhere else. The “Reduce effects” switch in the footer is the accessibility escape hatch — it is honoured before the first paint.',
    },

    faq: {
      eyebrow: 'Questions',
      title: 'What DhakaFin is — and is not.',
      note: 'These six answers carry FAQPage structured data on the production homepage in Phase 2.',
      what: 'What does DhakaFin actually do?',
      whatAnswer:
        'Three connected layers: a free public intelligence hub (verified tax, VAT, TDS and VDS rates, a compliance calendar and 13 calculators), a SaaS platform for running your books, documents and compliance, and professional services delivered by accountants, tax specialists and analysts.',
      firm: 'Is DhakaFin a chartered accountancy firm?',
      firmAnswer:
        'DhakaFin is a financial intelligence and compliance platform backed by professional financial services. We do not claim to be a CA firm; statutory audits are coordinated with licensed auditors, and our team page names the qualifications of every professional who works on your account.',
      freshness: 'How often are the rates updated?',
      freshnessAnswer:
        'Every rate row carries an effective date, a source link and the name of the person who verified it. Our commitment is to publish NBR changes within 24–48 working hours, and every family is re-verified on a 45-day cycle. The rate database ships in Phase 3.',
      security: 'Is my financial data safe?',
      securityAnswer:
        'Documents live in a private storage bucket and are reachable only through time-limited signed links. Every download is logged, access is scoped per business, and the portal enforces role-based permissions. The full security architecture is specified in the master roadmap.',
      bangla: 'Do you support Bangla?',
      banglaAnswer:
        'Yes. The design system ships a Bangla typeface, Bangla numerals and lakh-crore number formatting from day one, and the public content is written in both languages rather than machine-translated.',
      today: 'What can I use today?',
      todayAnswer:
        'Right now: the design system and this foundation build. The rate hub and tools arrive in Phases 3 and 4, the SaaS portal in Phases 5–6. The master roadmap in the repository lists every task and gate, so you can see exactly where the build stands.',
    },

    finalCta: {
      title: 'Make Better Financial Decisions.',
      body: 'Numbers tell you what happened. Intelligence tells you what to do next.',
    },
  };
