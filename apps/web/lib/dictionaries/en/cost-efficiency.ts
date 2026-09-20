import type { CostEfficiencyCopy } from '../../content/cost-efficiency-copy';

/**
 * English copy — /cost-efficiency (DF-P2-044, blueprint §5.9).
 *
 * The page has one job: to be believed. Everything here is written to that end,
 * which means the places where we do not have a figure say so rather than
 * substituting a plausible one. Beat 3 is the clearest case — the widely-quoted
 * "2–6% of operating cost is avoidable" appears nowhere as our claim, and the
 * copy explains why, because a reader who has seen that number elsewhere deserves
 * to know why the page they are on refuses it.
 */
export const costEfficiency: CostEfficiencyCopy = {
  meta: {
    title: 'Cost efficiency',
    metaTitle: 'Cost efficiency: see the cost you never approved | DhakaFin',
    metaDescription:
      'Expose the avoidable cost in your own figures, across five leakage surfaces, before you commission a review — and see exactly which rows we have not published yet.',
  },

  hero: {
    eyebrow: 'Cost efficiency',
    headline: 'Your biggest cost may be the one you don’t see.',
    sub: 'Every cost you approved is on a report. The ones that matter are the prices nobody benchmarked, the payments that left early, and the stock that was never there. This page sizes your exposure from your own figures, and tells you which part of the answer we can prove.',
    premise:
      'Nothing on this page is a promise of savings. It is an exposure calculation and a method disclosure, and both are yours to check.',
  },

  beats: {
    'visible-costs': {
      marker: 'Beat 2',
      title: 'First, the costs you already know',
      lead: 'Turnover arrives, necessary costs go out, and what remains is the profit you reported. Every line is approved, documented and defensible — which is exactly why none of it is the problem. Deliberate cost sits above the line and behaves.',
    },
    drift: {
      marker: 'Beat 3',
      title: 'Then the drift',
      lead: 'You will see the figure “2–6% of operating cost is avoidable” in almost every cost-review pitch. It is repeated without a sector, a sample or a year, and we do not repeat it as ours. What we can show you today is your own exposure: the taka each leakage surface can act on, computed from the numbers you enter, with the published range withheld and the missing rows listed by name.',
    },
    leakage: {
      marker: 'Beat 4',
      title: 'Five places cost escapes',
      lead: 'These are the five surfaces a review opens first. Each one names the question we would ask your team, the example we see most often, and the policy that closes it. Open any of them to read the full case.',
    },
    'profit-impact': {
      marker: 'Beat 5',
      title: 'What it costs you, in your own numbers',
      lead: 'Move the turnover slider and change your category spends. Every figure below moves with you: the exposure by surface, the waterfall, and the priority order a review would follow. No benchmark is quoted, so nothing here can be wrong about your business — it is your arithmetic, run for you.',
    },
    delivery: {
      marker: 'Beat 6',
      title: 'What a cost efficiency review delivers',
      lead: 'A review is a fixed-fee engagement with a defined output, not an open-ended advisory retainer. Here is what leaves the building when it is finished.',
    },
  },

  chart: {
    heading: 'Where the money goes, and where it leaks',
    revenue: 'Turnover',
    necessary: 'Necessary costs',
    exposure: 'Exposed to leakage',
    profitReported: 'Profit as reported',
    profitAfter: 'Profit after recovery',
    profitAfterWithheld: 'Range withheld',
    axisNote: 'Taka. The exposed band is the cost base the five surfaces act on — not a savings figure.',
    legendNecessary: 'Approved and documented',
    legendExposure: 'Acted on by one or more surfaces',
    legendWithheld: 'Range not published',
  },

  pillars: {
    'purchase-price-variance': {
      name: 'Purchase price variance',
      question:
        'Do different people buy the same specification at different prices within the same quarter?',
      yesMeans:
        'Nothing is necessarily wrong — but it means the price you negotiated is not the price you pay, and a total-spend report cannot show the difference.',
      rangeStatus:
        'Not published. Sizing it needs your purchase register sorted by specification and date. A review produces that row first, because every other number on this page is worth more once this one is real.',
      example:
        'A factory buys the same grade of resin through three buyers, each of whom negotiates well and reports a good price. Sorted by specification rather than by supplier, the dearest purchase inside a single quarter sits well above the cheapest — on a raw-material line larger than the entire payroll. Nobody was careless. The comparison simply did not exist, so the price was never a decision, only an outcome.',
      policyNote:
        'A price file per specification, reviewed monthly, with one named owner per category. The control is not a lower approval threshold — it is having a comparison to approve against.',
      chartCaption:
        'Four bars for one specification bought at four prices, with the span between the cheapest and dearest marked.',
    },
    'supplier-dependency': {
      name: 'Supplier dependency',
      question:
        'Is more than a third of a critical input bought from a single supplier, with no tested alternative?',
      yesMeans:
        'You are paying for continuity rather than for price. That is a rational choice until the supplier knows it, which is usually the moment the terms move.',
      rangeStatus:
        'Not published. It needs your purchase concentration by input and a record of what happened the last time terms moved. Both are obtainable; neither exists on a typical ledger.',
      example:
        'A distributor’s fastest-moving line comes from one importer. The terms hold for two years, then lead times lengthen and prices move weeks before the shipping documents do. Because no second source had ever been qualified, the only lever left was to buy less — which meant losing the customers that line had brought in. The dependency was not expensive while it was invisible.',
      policyNote:
        'Qualify a second source before you need it, and review concentration quarterly. A tested alternative is leverage even in the years it is never used.',
      chartCaption:
        'A bar showing one supplier holding most of a critical input, with a small qualified alternative beside it.',
    },
    'expense-leakage': {
      name: 'Expense leakage',
      question:
        'Is any expense category approved after the cost is committed, rather than before?',
      yesMeans:
        'Approval is happening, but it is confirming a decision rather than making one. Duplicate payments and out-of-policy spend both live in that gap.',
      rangeStatus:
        'Not published. It needs a payment register checked for duplicates and a policy-to-actual comparison by category — a review produces both from your own data.',
      example:
        'A services business approves by email. Two invoices for one delivery are paid because the second carries a different reference number. A subscription renews at two group entities. Two payments go out for one purchase order, and the supplier credits the second one only if someone asks. None of it is dramatic. Taken together it is larger than the audit fee, and it is the leakage readers recognise hardest in their own books.',
      policyNote:
        'Three-way match on invoice, receipt and purchase order, a duplicate check before the payment batch is released, and a policy-to-actual review each quarter. All three are reports you can run on the systems you already own.',
      chartCaption:
        'A payment timeline with two duplicate entries flagged, and a small bar showing out-of-policy spend by category.',
    },
    'inventory-variance': {
      name: 'Inventory variance and pilferage',
      question:
        'Does physical stock differ from the ledger by more than a counting error would explain?',
      yesMeans:
        'A difference is being funded every month, and once it is inside a closing balance nobody has to explain it. More often it is a process than a person.',
      rangeStatus:
        'Not published. It needs a count history compared against movement records. Where those records do not exist, the first review deliverable is the process that creates them.',
      example:
        'A trading business counts once a year. Damage, short delivery, returns that never re-entered the system and stock that left without paperwork all blend into one annual adjustment. Because the difference arrives at year end, it is absorbed as a valuation adjustment — and nothing about the process that produced it changes. The following year produces the same number, and the same explanation.',
      policyNote:
        'Cycle counting by value class, with count results compared against move history rather than against the expected balance. High-value lines counted often, the long tail less often, and every difference traced to a mechanism before it is written off.',
      chartCaption:
        'A bridge from ledger stock to counted stock, with the gap split into recorded movements and an unexplained remainder.',
    },
    'payment-controls': {
      name: 'Payment controls',
      question:
        'Do payments leave without a second check on the invoice, the goods receipt and the agreed terms?',
      yesMeans:
        'Two of the most expensive habits in finance are early payment and unearned credit. Both give cash away for nothing, and both look like a good relationship until the year the supplier changes.',
      rangeStatus:
        'Not published. It needs your terms master compared against actual payment dates — a single report, and the fastest row a review can make real.',
      example:
        'A manufacturer pays from a file built on invoice date rather than on agreed terms, because the expiry column was never populated. Suppliers rarely object. Across a year, the interest on that early release of working capital exceeds a junior accountant’s cost to the business — and it bought nothing, because nobody on the other side was asking for it.',
      policyNote:
        'Payment runs built from the terms master, early-payment discounts taken only where the discount beats the cost of the cash, and a named approver recorded per batch. A single approver for a batch of forty payments is not a control; it is a signature.',
      chartCaption:
        'Two bars comparing agreed payment terms against actual payment days, with the early days highlighted.',
    },
  },

  estimator: {
    heading: 'Estimate your exposed cost base',
    lead: 'Four inputs and five questions. Everything updates as you move it, and nothing is stored on our side until you choose to send it.',
    turnoverLabel: 'Annual turnover',
    turnoverHint: 'Your last completed financial year, in taka.',
    turnoverFloorNote:
      'The slider starts at ৳50 lakh. Below that, a commissioned review costs more than the leakage it would be likely to find — and a tool that invites you to buy something that cannot pay for itself is not a tool.',
    turnoverInputLabel: 'Exact figure',

    categoryHeading: 'Where your operating cost sits',
    categoryNote:
      'Percentages of turnover. These start at a shape typical of the industry you picked — they are not an estimate about your business, and every one of them is yours to change.',
    categories: {
      procurement: {
        label: 'Goods and materials',
        hint: 'Everything bought to be sold, used or built into what you sell.',
      },
      payroll: {
        label: 'Payroll',
        hint: 'Salaries, wages and the contributions that move with them.',
      },
      logistics: {
        label: 'Utilities and logistics',
        hint: 'Power, fuel, freight, warehousing and delivery.',
      },
      marketing: {
        label: 'Marketing and other',
        hint: 'Customer acquisition, professional fees and everything unclassified.',
      },
    },
    operatingCostLabel: 'Total operating cost',
    operatingCostNote: 'The four categories added together, as entered.',

    questionHeading: 'Five questions about your process',
    questionNote:
      'Answer what you know. These do not change your arithmetic — they change the order in which a review would look, because a surface you have flagged is a surface we inspect first.',
    answerYes: 'Yes',
    answerNo: 'No',
    answerUnanswered: 'Not answered',

    exposureHeading: 'Exposure by surface',
    exposureNote:
      'How many taka each surface can act on. This is your cost base filtered through the mechanism — not a claim about how much is recoverable.',
    ladderHeading: 'If that share were avoided',
    ladderNote:
      'Illustration only: exposure × the share shown. The share is your assumption or ours, never a published benchmark — no such benchmark exists on this page yet.',

    withheldHeading: 'Why there is no savings figure here',
    withheldBody:
      'A range needs a measured sample: ranges per surface, per industry, with a sample size and a method a reader can repeat. We do not have one, so the estimator shows your exposure and withholds the range instead of quoting a percentage we cannot support. Every row we owe is listed below with its status.',
    methodStatus: 'Benchmark rows published',

    priorityHeading: 'Where a review would start',
    priorityNote:
      'Your flagged answers first, then by the size of the cost base each surface touches. This is the agenda we would bring to the first session.',
    priorityEmpty:
      'Answer the five questions above and this becomes a specific order of work rather than a list.',

    recoveryHeading: 'Realistic recovery window',
    recoveryNote:
      'Three to six months, measured from the first process change rather than from the invoice. Some rows move in weeks — a payment run built on correct terms — and others, such as qualifying a second supplier, take most of a year.',

    compareLabel: 'Compare against industry median',
    compareNote:
      'Unavailable. An industry median is a published figure with a sample behind it, so this control will light up when the benchmark table does — not before.',

    stickyLabel: 'Exposed cost base',
    stickyCta: 'Book a review',

    shareLabel: 'Copy share link',
    shareCopied: 'Link copied',
    shareHint:
      'The link carries your inputs in the URL itself, so it renders the same estimate for whoever opens it. Nothing is stored on our side.',
    printLabel: 'Print or save as PDF',
    resetLabel: 'Start again',
  },

  method: {
    heading: 'How this was calculated',
    lead: 'Every figure on this page comes from one of three things: a number you entered, a mapping we publish below, or a benchmark we do not yet have. This is the full ledger.',
    columns: {
      pillar: 'Surface',
      industry: 'Industry',
      range: 'Typical avoidable range',
      status: 'Status',
      source: 'Source',
    },
    statusUnverified: 'Not published',
    statusVerified: 'Published',
    reason: {
      'no-sample': 'No measured sample yet',
      'sample-too-small': 'Sample below the minimum size we publish',
      'industry-not-covered': 'Industry not covered by the sample',
      'method-under-review': 'Method under review',
    },
    sourceMissing: '—',
    summary:
      'Rows published: {published} of {required}. Each row we publish will carry its source, the period the sample covers, the number of observations behind it, and the date it was last recomputed.',
  },

  disclosure: {
    heading: 'Method and limitations',
    body: 'This estimator does not promise savings. It computes the cost base exposed to five leakage surfaces from the figures you entered, and it withholds the recoverable range because no published benchmark supports one. Every assumption is visible, none of them is a client’s data, and nothing here is financial advice.',
    numbersNote:
      'All figures are in Bangladeshi taka and rounded to the whole taka. Percentages are of turnover as you entered it.',
    privacyNote:
      'Your inputs stay in your browser. The share link carries them in its own URL rather than in a database, which also means anyone you send it to can read them.',
  },

  delivery: {
    heading: 'What a cost efficiency review delivers',
    lead: 'Six weeks of fieldwork, a fixed fee, and an output you can hand to your bank as readily as to your board.',
    items: [
      {
        title: 'A price file per specification',
        body: 'Every purchase that repeats, with the range of prices actually paid, the buyers involved and the identity of the dearest and cheapest sources. This is usually the first artefact anyone acts on.',
      },
      {
        title: 'A leakage register',
        body: 'Each surface with its measured annual value, the mechanism that produced it, the control that stops it recurring, and the named owner who now holds it.',
      },
      {
        title: 'Process controls that fit your team',
        body: 'Three-way match, duplicate checks, payment-run rules from the terms master and cycle counting by value class — written for the number of people you actually employ.',
      },
      {
        title: 'Quantified recoverable value, with method',
        body: 'The number this page refuses to guess at, produced from your data: a range with the sample, the period and the calculation behind it.',
      },
      {
        title: 'A six-month recovery plan',
        body: 'Sequenced work with an owner and a date per item, ordered by how quickly each one turns into cash rather than by how easy it is to start.',
      },
      {
        title: 'A review fee that shows its own return',
        body: 'The engagement is sized against the first year of identified value, and we will tell you in the first session whether we think there is enough there to justify us.',
      },
    ],
    bookLabel: 'Book a cost efficiency review',
    quoteLabel: 'Get a quote',
    checklistLabel: 'Download the five-surface checklist',
    checklistNote:
      'One PDF, the five questions above with the evidence each answer should be supported by. No estimate required, and no follow-up sequence.',
  },

  faqs: {
    heading: 'Questions readers ask before booking',
    items: [
      {
        id: 'ce-estimate-or-promise',
        question: 'Is this estimate a savings promise?',
        answer:
          'No, and the page is built so it cannot become one. What you see is your own cost base sorted by the five surfaces a review examines, using the figures you entered. The recoverable range is withheld because no published benchmark supports one yet, and the method table lists every row we owe you. When we quote a number, it will come with a sample, a period and a calculation — not a range from a slide.',
      },
      {
        id: 'ce-fee',
        question: 'How is the review fee set?',
        answer:
          'Against the value the review identifies in its first year. The engagement is a fixed fee rather than hourly, so the cost of a slow week is ours and not yours. In the first session we tell you whether we think there is enough leakage in your cost base to justify us — and we have said no before.',
      },
      {
        id: 'ce-timeline',
        question: 'How long before the money shows?',
        answer:
          'The recovery window is three to six months, measured from the first process change rather than from the invoice. Payment-run corrections and duplicate-payment checks move within weeks. Qualifying a second supplier, or rebuilding a purchase process, takes longer — which is why the plan sequences by how fast an item becomes cash, not by how easy it is to start.',
      },
      {
        id: 'ce-data',
        question: 'Do you need our records before the first session?',
        answer:
          'Not before it. The first session is the five questions on this page plus a walk through the purchase, payment and inventory registers you already have. Anything we need afterwards is listed with the reason we need it, and most of it comes from the systems in front of you.',
      },
    ],
  },

  share: {
    heading: 'A shared estimate',
    body: 'This is the estimate that was shared with you, rebuilt from the figures in the link. Nothing was stored to make it work, and nothing about it identifies who shared it.',
    invalidHeading: 'This estimate link is not one we recognise',
    invalidBody:
      'Share links are built from the inputs themselves, so a truncated or edited link cannot be repaired without guessing. Build a fresh estimate on the main page and share that one.',
    backLabel: 'Build an estimate',
  },
};
