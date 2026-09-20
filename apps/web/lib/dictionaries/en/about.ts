import type { AboutCopy } from '../../content/about-copy';

/**
 * English copy — /about (DF-P2-025).
 *
 * Two rules hold in every paragraph below: no invented people, and no claim that
 * outruns what the product does today. Where the honest sentence is "this is not
 * built yet", that is the sentence written.
 */
export const about: AboutCopy = {
  meta: {
    title: 'About',
    metaTitle: 'About DhakaFin — Accounting and Financial Intelligence in Bangladesh',
    metaDescription:
      'Why DhakaFin exists: a firm that publishes its sources, shows its method, and builds the compliance and cost tools Bangladesh businesses were expected to run without.',
  },

  hero: {
    eyebrow: 'About',
    title: 'A firm that shows its working.',
    lede: 'DhakaFin is an accounting, tax, VAT and financial-intelligence practice in Dhaka. We keep books, file returns and defend them — and we build the tooling that makes the reasoning behind every figure visible to the person relying on it.',
    chips: [{ label: 'Practising since 2019' }, { label: 'Dhaka, Bangladesh' }, { label: 'English and Bangla' }],
    premise:
      'Most of what a Bangladeshi business is told about tax, VAT and cost is unsourced, late, or explained only after something has gone wrong. We started this practice to be the opposite of that, and then wrote it down as a rule: nothing leaves the building without its source and its method attached.',
  },

  philosophy: {
    quote: 'The figure is the easy part. The reason you can trust it is the product.',
    attribution: 'The rule this practice is built on',
    body: 'Every rate we publish carries a reference, an effective date, a source link and the name of the person who verified it. Every calculator on this site states its formula, its rounding and what it refuses to assume. When we cannot source something, the page says so — in the space where the number would have been.',
  },

  story: {
    heading: 'How we got here',
    lede: 'Four decisions, in the order we made them.',
    stages: {
      'first-engagements': {
        marker: '2019',
        title: 'The first engagements',
        body: 'We started with the work most practices in Dhaka avoid: the messy close, the unfiled return, the last two years nobody reconciled. It taught us where the failures actually happen — not in the arithmetic, in the record of why it was done that way.',
      },
      'verification-rule': {
        marker: 'The rule',
        title: 'Every figure gets a source',
        body: 'We began recording where each rate came from, when it took effect, and who checked it — for our own use, because a wrong rate is a client penalty. That record became the rate contract the tools and the rate hub are built on, and the reason the platform can promise an update window: we already know what changed, because we already track it.',
      },
      'free-tools': {
        marker: 'The tools',
        title: 'Thirteen tools, no email wall',
        body: 'TDS, VDS, VAT, profit, break-even, ROI, working capital and the rest — built to work on a phone, in either language, with the formula shown. No account, no PDF hostage-taking. If a tool is not finished, the page says which piece is missing rather than estimating around it.',
      },
      platform: {
        marker: 'Next',
        title: 'The platform',
        body: 'Rate-change alerts, a compliance calendar per business, saved calculations, a document vault and management dashboards. It is in development, it has no launch date we would defend, and this site will say when it changes.',
      },
    },
  },

  flywheel: {
    heading: 'Why the free tools exist',
    lede: 'The tools are not marketing. They are the first turn of the loop this practice runs on, and the loop only works because the last turn feeds the first.',
    nodes: {
      search: 'Someone searches for a rate, a deadline or a calculation',
      tools: 'They find a tool that answers it, in their own language, with the formula shown',
      account: 'They save the answer, add their business and set an alert',
      compliance: 'The calendar tells them what falls due before it falls due',
      diagnostic: 'They see where their own numbers are weak, not a generic verdict',
      engagement: 'They hire us for the part they would rather not do themselves',
      results: 'The work produces measured results we can document',
      content: 'The rates, the corrections and the questions all become public pages',
    },
    engineLabel: 'The engine: regulatory change',
    engineNote:
      'Every NBR notification, SRO and rate change restarts the loop — it is a reason to search, a reason to be alerted, and a reason to check us. It is also why the rate pipeline is built before the portal: the loop runs on it.',
    loopLabel: 'The DhakaFin loop',
  },

  values: {
    heading: 'Five rules, and what each one costs us',
    lede: 'A value that does not change how the product behaves is a poster. These change pages you can visit.',
    behaviourLabel: 'Where you can see it',
    items: {
      'sourced-number': {
        title: 'An unsourced number is a liability',
        body: 'If we cannot show where a rate or a benchmark came from, we do not publish it — we publish the gap instead.',
        behaviour: 'The rate contract and the estimator’s withheld range',
      },
      'method-travels': {
        title: 'The method travels with the number',
        body: 'Every tool states its formula, its rounding rule and the assumptions it refuses to make.',
        behaviour: 'The "how this was calculated" block under every calculator',
      },
      'uncomfortable-first': {
        title: 'Say the uncomfortable part first',
        body: 'Scope boundaries, what a service does not include, and what we are not yet good at belong at the top of the page, not in the small print.',
        behaviour: 'Service exclusions and the cost-efficiency method disclosure',
      },
      'bangla-first': {
        title: 'Bangla is a first language, not a translation',
        body: 'The Bengali pages are written as Bengali pages: terminology kept in Latin where the law is in Latin, everything else in the language a Dhaka accountant actually speaks.',
        behaviour: 'Every page on this site, in both locales',
      },
      'cheap-pages': {
        title: 'A fast page is a service',
        body: 'A business owner on a phone with a weak connection is the person this site is for. We keep the weight down, subset the fonts, and refuse an effect that costs the reader time.',
        behaviour: 'The font budget and the no-client-JS rule for anything that reads as a table',
      },
    },
  },

  roles: {
    heading: 'Who does what on an engagement',
    lede: 'You will know which four people touch your file, what each of them is accountable for, and — the part most firms leave out — what they are not allowed to change.',
    accountableLabel: 'Accountable for',
    cannotLabel: 'Cannot',
    profilesNote:
      'Named profiles with verification status are published on this site as each member’s credentials are checked: qualification, practising certificate where one applies, and years in the discipline. We would rather show an empty page than a name we have not verified, and the admin behind this site enforces that — a team profile cannot be published without its credentials recorded.',
    items: {
      'client-partner': {
        title: 'Client partner',
        accountable: 'Your engagement as a whole: scope, what you are told, when you are told it, and the decision to hand a piece of work back if someone else does it better.',
        cannot: 'Sign off a rate, a filing or a figure without the lead responsible for it.',
      },
      'tax-compliance-lead': {
        title: 'Tax & compliance lead',
        accountable: 'Rate records, the SRO library, statutory deadlines, your filings, and the verification signature on every rate that reaches a page or an alert.',
        cannot: 'Change pricing, marketing content or site settings.',
      },
      'cost-control-lead': {
        title: 'Cost & control lead',
        accountable: 'The cost-efficiency review, internal-control design and testing, and the measurement method behind every saving we claim.',
        cannot: 'Publish a saving figure whose method is not written down beside it.',
      },
      'accounting-lead': {
        title: 'Accounting lead',
        accountable: 'The monthly close, reconciliations, the workpapers your auditor will ask for, and the payroll accounting behind them.',
        cannot: 'Alter a posted figure after close without an adjusting entry that says why.',
      },
    },
  },

  location: {
    heading: 'Where we are',
    body: 'The practice is in Dhaka and works on Bangladesh time. That is not a detail — it is most of the reason this firm exists. A business filing a VAT return in Dhaka should not be waiting on a mailbox that opens eight hours later.',
    facts: [
      { label: 'City', value: 'Dhaka, Bangladesh' },
      { label: 'Working hours', value: 'Sunday to Thursday, 10:00–18:00' },
      { label: 'Time zone', value: 'GMT+6, year-round' },
      { label: 'Languages', value: 'Bangla and English' },
      { label: 'Statutory holidays', value: 'Published in the compliance calendar' },
    ],
    note: 'Document exchange and signatures work across both languages. Bengali correspondence is not a translation service here; it is the default for anyone who prefers it.',
  },

  careers: {
    heading: 'Working here',
    body: 'We hire people who would rather write down the reason than defend the number. Practising CAs, ACCAs, CMAs and people who are still finishing a qualification are all welcome to write — say which discipline you want to be accountable for, and send one piece of work you are proud of.',
    linkLabel: 'Write to us about a role',
  },

  cta: {
    title: 'Start with the part that is already free',
    body: 'Run a number through a tool, read how we source a rate, or ask us a question you have been quoted an answer to before.',
    primaryLabel: 'Book a consultation',
    secondaryLabel: 'See how we price',
  },
};
