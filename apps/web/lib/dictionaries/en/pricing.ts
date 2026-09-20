import type { PricingCopy } from '../../content/pricing-copy';

/**
 * English copy — /pricing (DF-P2-025).
 *
 * The bands themselves are not written here. They are read from the service
 * dictionary, so the figure a visitor sees on /pricing is the figure the service
 * page publishes, character for character.
 *
 * What is written here is the part a buyer actually needs next to a number: what
 * makes it go up, what it explicitly does not cover, and what the platform's
 * status is.
 */
export const pricing: PricingCopy = {
  meta: {
    title: 'Pricing',
    metaTitle: 'DhakaFin Pricing — Services, Retainers and Platform Plans',
    metaDescription:
      'Published bands for all nine services, what drives each figure, what is quoted separately, and the platform tiers still in development with their design targets.',
  },

  hero: {
    eyebrow: 'Pricing',
    title: 'Nine published bands. No "contact us for pricing".',
    lede: 'Every service line below shows the band it starts at, what moves it up, and what it does not cover. The figure you see is the figure the service page shows — one number, kept in one place. Where we cannot publish a price yet, this page says so instead of filling the gap with a form.',
    vatNote: 'All figures are in BDT and exclude applicable VAT, which is charged at the prevailing rate on the invoice date.',
    primaryCta: 'Book a consultation',
    secondaryCta: 'Get a quote for a project',
  },

  drivers: {
    heading: 'What moves a figure up',
    lede: 'Three things, and only three. Everything else that looks like a variable is one of them in disguise.',
    items: [
      {
        title: 'Transaction volume',
        body: 'How many sales, purchases, expense claims, bank lines and payroll entries exist per month. Volume decides how many hours the work takes, and hours are what a retainer buys.',
      },
      {
        title: 'Entity count',
        body: 'Each additional company, branch or VAT registration carries its own books, its own filings and its own deadlines. Two entities are never twice one entity — they are one engagement plus a second set of obligations.',
      },
      {
        title: 'Headcount and payroll complexity',
        body: 'Staff count, but more importantly payroll structure: deductions, benefits, gratuity provisions, foreign employees and multiple payment channels all add review work to the same month.',
      },
    ],
  },

  ladder: {
    heading: 'Where each of the nine starts',
    caption:
      'The starting band of each service line, on a logarithmic scale. A bar shows where a line begins, not how far it runs — every figure here is a floor, and the top of a band is set by the work, not by this chart.',
    scaleNote:
      'Logarithmic, because on a linear scale ৳180,000 beside ৳8,000 leaves the four smaller bands a few pixels wide.',
  },

  table: {
    heading: 'Advisory and compliance lines',
    lede: 'Nine bands, grouped the way the ecosystem groups them: foundations first, then control, then growth. The starting band is a real starting point, not a teaser — a business at the bottom of the band can be served at that figure or we would not print it.',
    columns: {
      line: 'Service line',
      band: 'Starting band',
      basis: 'What drives it',
      included: 'Included',
      excluded: 'Not included',
    },
    billingMonthly: 'Monthly',
    billingAnnual: 'Twelve months',
    billingLabel: 'Show figures as',
    scrollHint: 'Scroll the table sideways to read every column, or use compare mode below.',
    billingLegend: 'View',
    compareLabel: 'Compare',
    compareHint: 'Tick up to three lines to see them side by side.',
    compareHeading: 'Side by side',
    compareClear: 'Clear selection',
    compareMax: 'Three at a time — untick one to choose another.',
    compareEmpty: 'Tick two or three lines to compare them. The differences that matter are in what each one excludes, so those are shown first.',
    annualNote:
      'Twelve months at the starting band — arithmetic on a published figure, not a discount. Annual prepayment terms, where they are agreed, are set out in the quote.',
    oneOffNote:
      'One-off lines are shown as they are charged. A review or an engagement is not a subscription, and annualising it would invent a commitment neither side has made.',
    cadence: {
      monthly: 'per month',
      annual: 'per year',
      engagement: 'per engagement',
      review: 'per review',
    },
    openLabel: 'Full scope and inclusions',
    includesLabel: 'Included at the starting band',
    excludesLabel: 'Stated exclusions',
    moreLabel: 'and the full list on the service page',
    exclusionsHeading: 'What no band includes',
    exclusionsLede: 'These are true of every line, at every band, and they are worth knowing before you compare us with anyone.',
    exclusions: [
      'A statutory audit opinion — that is an independent auditor, never the firm that keeps the books.',
      'Payment of your taxes, duties or fees on your behalf, and the cost of those third-party charges.',
      'Legal representation or advocacy before any authority.',
      'Reconstructing more than twelve months of prior-period books, which is quoted separately once we have seen them.',
      'A service line you did not buy. The nine are priced separately and nothing is bundled into a retainer by default.',
    ],
  },

  lines: {
    'accounting-bookkeeping': {
      basis: 'Monthly transaction volume and the number of bank and mobile-wallet accounts.',
      drivers: [
        'Transactions per month, not turnover — a ৳2 crore business with 40 invoices is smaller work than a ৳40 lakh business with 900.',
        'Number of bank, card and mobile-wallet accounts to reconcile.',
        'Whether inventory is held and needs costing, or the business is service-only.',
      ],
    },
    'audit-support': {
      basis: 'Entity size, sector and the state of the ledger when we start.',
      drivers: [
        'Turnover band and whether the entity is listed, a bank, an NBFI or an ordinary company.',
        'How many prior-period schedules must be rebuilt before the auditor arrives.',
        'Whether the audit is statutory, a bank facility requirement, or a group reporting deadline.',
      ],
      note: 'The auditor is independent of us. We prepare; they opine.',
    },
    'tax-services': {
      basis: 'Return complexity, income sources and the number of entities filed.',
      drivers: [
        'Number of income heads and sources, including rental, capital gains and foreign income.',
        'Entities and individuals filed together, each with its own return and assessment history.',
        'Whether prior-year assessments are open or under appeal.',
      ],
    },
    'vat-services': {
      basis: 'Number of VAT registrations, invoice volume and input-credit complexity.',
      drivers: [
        'Registrations per entity and per branch, each with its own return.',
        'Invoices issued and received per month, and how many need correction.',
        'Mixed taxable and exempt supplies, and how input credit is apportioned.',
      ],
    },
    'cost-efficiency-internal-control': {
      basis: 'Cost base under review and the number of sites or departments to visit.',
      drivers: [
        'Procurement spend and the number of repeating purchase specifications.',
        'Number of locations, warehouses or departments, because fieldwork scales with them.',
        'Whether inventory records exist at all, or must be built during the review.',
      ],
      note: 'Sized against the value the review identifies in its first year.',
    },
    'internal-control-governance': {
      basis: 'Number of processes documented, tested and handed over.',
      drivers: [
        'Processes in scope — purchase-to-pay, order-to-cash, payroll, inventory, treasury.',
        'System landscape, and how much of the control can be enforced inside the software rather than on paper.',
        'Number of people who must be trained on the new controls.',
      ],
    },
    'corporate-compliance': {
      basis: 'Entity count, licence count and filing calendar density.',
      drivers: [
        'Number of companies, partnerships and branches, each with RJSC obligations.',
        'Licences, permits and registrations held, and how many fall due in the same month.',
        'Whether the director and shareholder structure changes during the year.',
      ],
    },
    'financial-advisory': {
      basis: 'The decision being made and the work behind it.',
      drivers: [
        'Whether it is a model, a valuation, a feasibility study or a negotiation.',
        'Data availability — clean monthly accounts halve the work.',
        'Timeline, and whether a bank, board or investor set the deadline.',
      ],
    },
    'virtual-cfo': {
      basis: 'Management reporting depth, board calendar and the cadence of decisions.',
      drivers: [
        'Reporting pack scope: MIS, budget-versus-actual, forecasting, board deck.',
        'Meeting cadence and attendance expectations.',
        'Whether treasury, banking relationships or fundraising sit inside the mandate.',
      ],
    },
  },

  fit: {
    heading: 'Not sure which one you need?',
    lede: 'Three questions. They ask what your business can already do today, because that — not turnover — decides where to start.',
    stepLabel: 'Question',
    restartLabel: 'Start again',
    resultHeading: 'Start here',
    resultBandLabel: 'Starting band',
    resultWhyLabel: 'Why this one',
    openLabel: 'Read the service',
    notSureLabel: 'Still unsure? Take the 2-minute diagnostic',
    notSureNote: 'Twelve questions, a ranked answer, and no email required until you ask for the report.',
    questions: {
      close: {
        question: 'Can you answer a financial question about this month in under five minutes?',
        answers: {
          no: 'No — or someone would have to rebuild the numbers first',
          yes: 'Yes — the numbers are current and I trust them',
        },
      },
      leakage: {
        question: 'Do you know your largest cost line, who approved it, and how it compares with last quarter?',
        answers: {
          no: 'No — the total is available, the detail is not',
          yes: 'Yes — I can name the figure and the driver',
        },
      },
      pressure: {
        question: 'What is putting pressure on you right now?',
        answers: {
          filings: 'VAT and tax filings, and the notices that follow',
          audit: 'An audit, a bank facility or a group deadline',
          outsiders: 'A decision — investment, expansion, or a bank asking hard questions',
        },
      },
    },
    reasons: {
      'accounting-bookkeeping':
        'Nothing above the books can be trusted until the books close on time. Start here, and the tax, VAT and control work gets cheaper afterwards because the evidence already exists.',
      'cost-efficiency-internal-control':
        'If the numbers are current, the next question is where the cost leaks and who is allowed to commit it. This is the review that finds the answer in your own purchase and payment records.',
      'virtual-cfo':
        'Your foundation and your controls are working, so the constraint is decision-making: budget-versus-actual, a board pack that argues a position, and a forecast you can hold yourself to.',
      'vat-services':
        'Filing pressure is usually a process problem before it is a tax problem — corrections, missing invoices and input credit that was never claimed. Fix the process and the notice risk falls with it.',
      'audit-support':
        'An audit deadline is a preparation deadline. Schedules built before the auditor arrives turn an audit into a confirmation exercise rather than a negotiation.',
      'financial-advisory':
        'When the decision matters more than the reporting, the answer is a model and a defensible set of assumptions — built from your own monthly figures rather than from a template.',
      'tax-services':
        'Return preparation with the assessment history in front of it, so the numbers filed are the numbers you can support later.',
      'internal-control-governance':
        'Controls written for the people you actually employ, tested, and handed over with a named owner per control.',
      'corporate-compliance':
        'One calendar for every statutory filing and licence, so nothing falls due in the same week by accident.',
    },
  },

  platform: {
    statusBadge: 'In development',
    heading: 'The DhakaFin platform',
    lede: 'The portal — saved calculations, a personalised compliance calendar, your document vault and management dashboards — is being built. It is not on sale, and the figures below are the bands we are designing to rather than prices you can buy at.',
    targetLabel: 'Design target',
    freeLabel: 'Free tier',
    quotedLabel: 'Quoted per business',
    monthlySuffix: '/ month target',
    annualLabel: 'Annual option',
    annualNote: 'Planned: twelve months for the price of ten, on every paid tier.',
    finalNote:
      'Pricing is finalised in Phase 5 after ten client interviews, and the number will move. We would rather publish a target and its status than a price for something you cannot yet buy. Existing retainer clients will be told before anything opens.',
    featureColumn: 'Feature',
    audienceLabel: 'For',
    notOnSaleLabel: 'Not on sale yet',
    tiers: {
      starter: {
        name: 'Starter',
        description: 'Protocols and rate alerts for a business that is not ready for a retainer.',
        audience: 'Owners using the free tools who want the calendar and the alerts.',
      },
      growth: {
        name: 'Growth',
        description: 'The working layer: dashboards, workflow and the assistant, for one or two businesses.',
        audience: 'Businesses running a monthly close and at least one active service line.',
      },
      intelligence: {
        name: 'Intelligence',
        description: 'Advanced management reporting, industry benchmarks and API access.',
        audience: 'Businesses with a finance function that needs to answer harder questions.',
      },
      enterprise: {
        name: 'Enterprise',
        description: 'Unlimited entities and users, service levels, a dedicated manager and warehouse sync.',
        audience: 'Groups, listed entities and businesses with an audit committee.',
      },
    },
    features: {
      'saved-calculations': {
        label: 'Saved calculations and rate alerts',
        values: { starter: '3 alerts', growth: 'Yes', intelligence: 'Yes', enterprise: 'Yes' },
      },
      'compliance-calendar': {
        label: 'Personalised compliance calendar',
        values: { starter: 'Basic', growth: 'Yes', intelligence: 'Yes', enterprise: 'Yes' },
      },
      'document-vault': {
        label: 'Document vault',
        values: { starter: '100 MB', growth: '5 GB', intelligence: '25 GB', enterprise: 'Custom' },
      },
      dashboards: {
        label: 'Financial dashboards and MIS',
        values: {
          starter: 'Not included',
          growth: 'Yes',
          intelligence: 'Yes, with industry benchmarks',
          enterprise: 'Yes, with custom KPIs',
        },
      },
      workflow: {
        label: 'Task and service workflow',
        values: {
          starter: 'Not included',
          growth: 'Yes',
          intelligence: 'Yes',
          enterprise: 'Yes, with SLA and a dedicated manager',
        },
      },
      assistant: {
        label: 'Ask DhakaFin assistant',
        values: {
          starter: '10 questions a month',
          growth: '100 questions a month',
          intelligence: 'Unlimited, fair use',
          enterprise: 'Unlimited, private mode',
        },
      },
      'multi-business': {
        label: 'Businesses / users',
        values: { starter: '1 / 1', growth: '2 / 5', intelligence: '5 / 20', enterprise: 'Unlimited' },
      },
      'api-export': {
        label: 'API access and data export',
        values: {
          starter: 'Not included',
          growth: 'CSV and Excel',
          intelligence: 'CSV, Excel and API',
          enterprise: 'API and warehouse sync',
        },
      },
      support: {
        label: 'Support',
        values: { starter: 'Community', growth: 'Email', intelligence: 'Priority', enterprise: 'Dedicated' },
      },
    },
  },

  faqs: {
    heading: 'Questions about pricing',
    items: [
      {
        id: 'pr-quote',
        question: 'Why is the figure a band starting point rather than my price?',
        answer:
          'Because the three things that move a fee — transactions, entities and payroll — are facts about your business that we would have to guess at. The band tells you where a line starts; the first conversation turns it into a number. If your profile is inside the band we say so and quote it; if it is not, we say that too.',
      },
      {
        id: 'pr-vat',
        question: 'Is VAT included?',
        answer:
          'No. Every figure excludes applicable VAT, which is charged at the prevailing rate on the invoice date and shown as a separate line on the invoice. A vendor that quotes VAT-inclusive figures is usually quoting a rate it cannot control.',
      },
      {
        id: 'pr-change',
        question: 'What happens if we grow during the year?',
        answer:
          'A band is reviewed when the work changes — a new entity, a VAT registration, a step change in transactions or headcount. We tell you before a change takes effect rather than after it appears on an invoice, and we will say when a scope should in fact be a different service line.',
      },
      {
        id: 'pr-leave',
        question: 'Is there a minimum term or an exit fee?',
        answer:
          'No minimum term and no exit fee on retainer lines. Retainers are billed monthly and stop at the end of the month you tell us, with the books, the filings and the files handed over in a state you can give to another firm.',
      },
      {
        id: 'pr-cheaper',
        question: 'Can we start with one line and add later?',
        answer:
          'That is how the ecosystem is designed to be used. Most clients start with accounting, add VAT or tax when a filing date forces the issue, and reach control work when the numbers are good enough to test. Nothing is bundled, so adding a line is a decision rather than an upgrade.',
      },
      {
        id: 'pr-notfit',
        question: 'What if we are too small for any of these?',
        answer:
          'Then start with the free tools and the diagnostic, which are genuinely free and require no contact. If your turnover is under the band, we will tell you so in the first conversation instead of quoting around it — an engagement that does not pay for itself is bad for both sides.',
      },
    ],
  },

  cta: {
    title: 'Tell us what is on your desk this month',
    body: 'We will tell you which line solves it, what the band looks like for your profile, and which two of the nine you do not need yet.',
    primaryLabel: 'Book a consultation',
    secondaryLabel: 'Get a quote',
    footnote: 'The first consultation is free and unbilled, and it comes with no obligation to buy anything.',
  },
};
