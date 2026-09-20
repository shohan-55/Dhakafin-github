import type { HelpCopy } from '../../content/help-copy';

/**
 * English copy — /help and /faq (DF-P2-025).
 *
 * Written to the F3 acceptance line: every FAQ answer is 40–60 words, because
 * that is the length a search engine will quote without cutting the sentence
 * that makes it true. `scripts/check-faq.mjs` counts them in the emitted HTML.
 */
export const help: HelpCopy = {
  meta: {
    title: 'Help centre',
    metaTitle: 'Help centre — using DhakaFin’s tools, services and rate data',
    metaDescription:
      'Short answers about working with DhakaFin: what happens on a first consultation, how the calculators handle numerals, how a rate gets verified, and what we keep.',
  },

  hero: {
    eyebrow: 'Help centre',
    title: 'Answers we would give on the phone.',
    lede: 'Fifteen questions cover most of what people ask before they work with us — what a consultation involves, what the tools do and refuse to do, how a rate is verified, and what happens to your records.',
    note: 'Every answer below is the same answer we would give a client. None of it is a summary of a longer policy.',
  },

  search: {
    label: 'Search help',
    placeholder: 'Search: VAT, verification, retention…',
    hint: 'Type to filter. Press / to jump to the search field.',
    allCategories: 'All topics',
    resultCount: '{count} of 15 questions',
    empty: 'Nothing matches that yet.',
    emptyHint: 'Try a shorter term, or ask us directly — we answer within one working hour.',
    clear: 'Clear search',
    resultsLabel: 'Search results',
    moreLabel: 'Read the full answer',
  },

  categories: {
    'getting-started': {
      name: 'Getting started',
      lede: 'What a first conversation involves, what to bring, and how fast we reply.',
    },
    tools: {
      name: 'Using the tools',
      lede: 'What the thirteen calculators cost, how they handle numerals, and when one refuses to estimate.',
    },
    'services-and-pricing': {
      name: 'Services and pricing',
      lede: 'Starting bands, VAT treatment, and the exclusions that apply across the catalogue.',
    },
    compliance: {
      name: 'Rates and deadlines',
      lede: 'How a rate reaches a page, and how you hear about a change.',
    },
    documents: {
      name: 'Documents and confidentiality',
      lede: 'Who sees your records, for how long we keep them, and what you can ask for.',
    },
    platform: {
      name: 'The platform',
      lede: 'What is in development, what is published as a design target, and what needs an account.',
    },
  },

  topics: {
    'first-consultation': {
      question: 'What happens on a first consultation?',
      answer:
        'A consultation is forty-five minutes with the partner who would run your engagement. We ask what you file, when you file it, and what you cannot currently see in your own numbers. You leave with a written scope and a fixed band, or with our honest view that you do not need us yet.',
      keywords: ['consultation', 'first meeting', 'scope', 'partner', '45 minutes'],
    },
    'what-to-send': {
      question: 'What should we send before the first meeting?',
      answer:
        'Bring whatever already exists: last filed returns, the ledger or spreadsheet you actually use, bank and wallet statements, and any notice you have received. Missing records are normal and not a problem at this stage. We would rather see the real state of things than a cleaned-up version of it.',
      keywords: ['documents', 'records', 'returns', 'ledger', 'onboarding'],
    },
    'response-times': {
      question: 'How quickly do you respond?',
      answer:
        'A first reply comes within one working hour between Sunday and Thursday, 10:00 to 18:00 Bangladesh time. Anything arriving after hours is answered the next working morning. If a statutory deadline is closing while you read this, say so in your first line and we will treat it as urgent.',
      keywords: ['response time', 'reply', 'urgent', 'working hours', 'deadline'],
    },
    'tool-cost': {
      question: 'Do the calculators cost anything?',
      answer:
        'All thirteen calculators are free and need no account. Nothing is stored, and no email address is needed to see a result. A share link carries your figures inside the link itself rather than in an account — so the address bar shows exactly what is shared, and the link deserves the same care as the figures.',
      keywords: ['free', 'cost', 'account', 'privacy', 'share link'],
    },
    'tool-numerals': {
      question: 'Which numerals do the tools use?',
      answer:
        'Bengali pages show figures in Bengali numerals, in both the inputs and the results, because that is how they are written locally. Latin numerals stay for anything quoted verbatim — a section reference, a form number or a rate identifier. Share links always carry plain Latin digits so they open correctly in either language.',
      keywords: ['numerals', 'Bengali digits', 'numbers', 'language', 'share link'],
    },
    'tool-unavailable-rate': {
      question: 'Why does a calculator refuse to give me a number?',
      answer:
        'A tool refuses to estimate when the rate behind it has not been verified against a source. Instead of a plausible figure you get the reason, the source we are waiting on, and what the tool will do once that clears. We would rather publish the gap than a number you might file against.',
      keywords: ['unavailable', 'pending', 'rate', 'verification', 'withheld'],
    },
    'starting-band': {
      question: 'What is a starting band, and is it the price?',
      answer:
        'Every service publishes a starting band: the lowest figure we will quote for that scope, before VAT. It is not a headline discount and not a fixed price. The range above it depends on transaction volume, document quality and how much of the work your team already does. The band exists so nobody has to ask what our minimum is.',
      keywords: ['price', 'band', 'quote', 'minimum', 'scope'],
    },
    'vat-included': {
      question: 'Do the published figures include VAT?',
      answer:
        'Figures on this site exclude applicable VAT. The rate applied to a service depends on the service and on your registration, so one inclusive number would be wrong for most readers. Your engagement letter states the VAT treatment before work begins, and every invoice shows it separately.',
      keywords: ['VAT', 'tax', 'inclusive', 'invoice', 'engagement letter'],
    },
    'service-exclusions': {
      question: 'What is not included in a service?',
      answer:
        'Each service page lists what it excludes, and five exclusions apply across the catalogue: prior-period reconstructions beyond the agreed window, litigation and representation before a tribunal, statutory audits reserved to another firm, software licences, and advisory work outside the agreed scope. Anything else is quoted before it starts, never after.',
      keywords: ['exclusions', 'not included', 'scope', 'audit', 'litigation'],
    },
    'rate-verification': {
      question: 'How is a rate verified before you publish it?',
      answer:
        'A specialist enters the rate, cross-checks it against the notification or SRO itself, and only then publishes it with its reference, effective date and verifier. Two people must approve a change, and the public record shows when a figure was last verified. Nothing reaches a page or an alert on one person’s word alone.',
      keywords: ['verification', 'source', 'SRO', 'two-step', 'effective date'],
    },
    'rate-change-alerts': {
      question: 'Will you tell me when a rate changes?',
      answer:
        'Rate and deadline alerts belong to the platform, which is still in development. Until it opens, the rate pages carry their effective dates and verified-on timestamps, so you can see what moved since your last visit. Tell us which families you file against and we will contact you directly when one of them changes.',
      keywords: ['alerts', 'notification', 'rate change', 'deadline', 'platform'],
    },
    'data-access': {
      question: 'Who can see our records?',
      answer:
        'Your records are handled by the four people named on your engagement, plus the specialists needed for work you have asked for. Access is granted per engagement and removed when it ends. We do not use client data for anything else, and we do not pass it to a third party without your written instruction.',
      keywords: ['access', 'confidentiality', 'who sees', 'third party', 'permission'],
    },
    'record-retention': {
      question: 'How long do you keep our records?',
      answer:
        'Working papers are retained for the period statutory rules require, and engagement records for the same window. You can ask for copies of your own documents at any time and receive them in the format they arrived in. Deletion after the retention window is scheduled, not left to chance.',
      keywords: ['retention', 'deletion', 'copies', 'records', 'working papers'],
    },
    'platform-availability': {
      question: 'When will the platform be available?',
      answer:
        'The DhakaFin platform — rate alerts, a compliance calendar per business, saved calculations and a document vault — is in development. Its design targets are published on the pricing page and marked as targets, not prices. There is no launch date we would defend, and this site will say so on the day that changes.',
      keywords: ['platform', 'roadmap', 'launch', 'availability', 'in development'],
    },
    'account-required': {
      question: 'Do I need an account to use this site?',
      answer:
        'No account is needed to use this site. Every tool, rate page and service page works without signing in, because a calculator behind an email gate is not a free tool. An account becomes useful only when you want saved calculations and deadline alerts, which arrive with the platform.',
      keywords: ['account', 'sign in', 'login', 'email gate', 'saved calculations'],
    },
  },

  shortcuts: {
    heading: 'Keyboard shortcuts',
    lede: 'Short, because we only list what actually works today.',
    keysLabel: 'Keys',
    actionLabel: 'Action',
    items: {
      'focus-search': { keys: '/', label: 'Jump to the help search field' },
      'close-overlay': { keys: 'Esc', label: 'Close a menu, drawer or dialog' },
      'tab-order': { keys: 'Tab', label: 'Move through links and controls in order' },
    },
    note: 'The site-wide search and command palette is a later phase. When it ships, its shortcut will be listed here rather than promised in advance — the same rule the rate pages follow.',
  },

  a11y: {
    heading: 'Accessibility on this site',
    lede: 'What we actually test for, stated so you can hold us to it.',
    items: {
      contrast: {
        title: 'Contrast',
        body: 'Text and interface colours are checked against WCAG AA at their real sizes. The palette is published with its measured ratios on the internal design-system page, including the values that fail and are therefore restricted to decoration.',
      },
      motion: {
        title: 'Motion',
        body: 'Animations serve clarity first and are all suppressed when your system asks for reduced motion. The footer toggle does the same thing by hand if you prefer not to change a system setting.',
      },
      keyboard: {
        title: 'Keyboard and screen readers',
        body: 'Every page has one main landmark, one top-level heading and a skip link as the first focusable element. Dialogs and drawers move focus in, trap it, and restore it on close. Tables carry captions, and each column header is a real header cell.',
      },
      numerals: {
        title: 'Bengali and screen readers',
        body: 'Bengali pages are laid out in Hind Siliguri with the interface face stacked first, so Latin words and law identifiers are announced the way they are written. Figures switch to Bengali numerals in prose, and stay Latin where they are quoted from a form or a section.',
      },
    },
    reportLabel: 'Found a barrier?',
    reportBody: 'Tell us the page and what happened, and we will treat it as a defect rather than a feature request.',
    reportCta: 'Report an accessibility problem',
  },

  cta: {
    title: 'Ask the question you actually have',
    body: 'If your question is not here, it is probably worth asking — the answer may belong on this page for the next person.',
    primaryLabel: 'Contact us',
    secondaryLabel: 'Read the full FAQ',
  },

  faq: {
    meta: {
      title: 'Frequently asked questions',
      metaTitle: 'FAQ — how DhakaFin prices, verifies and handles client work',
      metaDescription:
        'Fifteen straight answers about DhakaFin: consultation, tool behaviour, starting bands, VAT treatment, rate verification, data access, retention and the platform.',
    },
    hero: {
      eyebrow: 'Questions',
      title: 'The fifteen we get asked most.',
      lede: 'Grouped by what you are trying to decide. Each answer is written to be read on its own, and each one matches what the practice actually does today — including the parts that are not built yet.',
    },
    groups: {
      'working-together': {
        name: 'Working together',
        lede: 'Before you engage us: what a consultation is, what to bring, how fast we answer, and what falls outside a service.',
      },
      'numbers-and-tools': {
        name: 'Numbers, tools and price',
        lede: 'What the calculators do with your figures, and what a published band does and does not promise.',
      },
      'rates-and-deadlines': {
        name: 'Rates and deadlines',
        lede: 'How a rate is verified before it is published, and how a change reaches you.',
      },
      'data-and-platform': {
        name: 'Data and the platform',
        lede: 'Who sees your records, how long we hold them, and what is still being built.',
      },
    },
    related: {
      '/about': 'About DhakaFin',
      '/book-consultation': 'Book a consultation',
      '/contact': 'Contact us',
      '/editorial-policy': 'Editorial and verification policy',
      '/pricing': 'See how we price',
      '/privacy': 'Privacy notice',
      '/rates/tds': 'TDS rates',
      '/rates/vat': 'VAT rates',
      '/security': 'Security and data handling',
      '/services': 'All services',
      '/services/accounting-bookkeeping': 'Accounting and bookkeeping',
      '/services/cost-efficiency-internal-control': 'Cost efficiency and internal control',
      '/tools': 'All thirteen tools',
      '/tools/income-tax-calculator': 'Income-tax calculator',
      '/tools/tds-calculator': 'TDS calculator',
      '/tools/vat-calculator': 'VAT calculator',
    },
    questionLabel: 'Question',
    answerLabel: 'Answer',
    structuredNote:
      'These answers are also published as structured data so a search engine can quote them without paraphrasing — which is why each one is written to a fixed length.',
    helpTitle: 'Looking for something else?',
    helpBody: 'The help centre searches all fifteen questions and shows where each answer lives.',
    helpLinkLabel: 'Search the help centre',
  },
};
