import type { GlossaryCopy } from '../../content/glossary-copy';

/**
 * English copy — /glossary (DF-P2-025).
 *
 * Definitions stay out of the rate business on purpose: a glossary that quotes a
 * threshold becomes the second place to be wrong the day a notification lands.
 * Where a reader needs the number, the entry links to the page that carries it
 * with its source.
 */
export const glossary: GlossaryCopy = {
  meta: {
    title: 'Glossary',
    metaTitle: 'Glossary — Bangladesh tax, VAT, accounting and cost terms',
    metaDescription:
      'Every term this site uses, in English and Bangla: TDS, VDS, VAT, Mushak, TIN, BIN, working capital, contribution margin and the rest — with where you meet it.',
  },

  hero: {
    eyebrow: 'Glossary',
    title: 'Two languages, one set of terms.',
    lede: 'The words this site uses, defined in both languages. Each entry carries the English term and the Bangla one, because a glossary that translates only one way round is a glossary for one of the two readers.',
    note: 'Definitions describe what a term means and where you meet it here. The figures behind them — rates, slabs, thresholds, forms — live on the rate pages, each with its source attached.',
  },

  legend: {
    heading: 'How to read an entry',
    bothLanguages: 'Both languages: the term as you will see it on this page, then the same term in the other language.',
    scoped: 'No rates: an entry defines the term. Where it applies to a figure you can file against, it links to the page that publishes that figure with its source.',
  },

  categories: {
    'authorities-and-instruments': {
      name: 'Authorities and instruments',
      lede: 'Who administers what, and the documents you meet when you file.',
    },
    'tax-and-vat': {
      name: 'Tax and VAT',
      lede: 'The four deductions and returns that most Bangladesh businesses touch every month.',
    },
    accounting: {
      name: 'Accounting',
      lede: 'The four words that decide whether a set of books holds up under review.',
    },
    'cost-and-control': {
      name: 'Cost and control',
      lede: 'How spending goes wrong, and the five mechanisms this practice reviews it with.',
    },
    'numbers-you-meet': {
      name: 'Numbers you meet',
      lede: 'The figures the calculators compute, defined the way the calculators actually compute them.',
    },
  },

  authorities: {
    nbr: 'National Board of Revenue',
    rjsc: 'Registrar of Joint Stock Companies and Firms',
  },

  terms: {
    nbr: {
      term: 'National Board of Revenue (NBR)',
      alt: 'জাতীয় রাজস্ব বোর্ড',
      definition:
        'The authority that administers tax and VAT in Bangladesh: it issues notifications and SROs, collects returns, and is the source every rate on this site has to be verified against before it can be published.',
      where: 'How we source a rate',
    },
    sro: {
      term: 'Statutory Regulatory Order (SRO)',
      alt: 'এসআরও (প্রজ্ঞাপন)',
      definition:
        'The instrument through which the revenue authority changes how a rule applies — a rate, a condition, an exemption or a deadline. An SRO number is usually the fastest way to identify which version of a rule you are dealing with.',
      where: 'How we source a rate',
    },
    mushak: {
      term: 'Mushak',
      alt: 'মূসক',
      definition:
        'The numbered series of VAT forms, invoices, registers and returns used in Bangladesh. The number identifies which record a document is, which is why a filing discussion usually starts with a Mushak number rather than a description.',
      where: 'VAT and supplementary duty',
    },
    tin: {
      term: 'Taxpayer Identification Number (TIN)',
      alt: 'করদাতা শনাক্তকরণ নম্বর (TIN)',
      definition:
        'The number that identifies a taxpayer to the revenue authority for income tax. It appears on returns, certificates and correspondence, and a mismatch between the name on a TIN and the name on a filing is a common cause of delay.',
      where: 'Tax services',
    },
    bin: {
      term: 'Business Identification Number (BIN)',
      alt: 'ব্যবসা শনাক্তকরণ নম্বর (BIN)',
      definition:
        'The registration number a business needs for VAT: it appears on tax invoices, and the buyer of a registered business needs it to claim input credit. It is per establishment and per business activity, not per company.',
      where: 'VAT and supplementary duty',
    },
    rjsc: {
      term: 'Registrar of Joint Stock Companies and Firms (RJSC)',
      alt: 'যৌথ মূলধন কোম্পানি ও ফার্মসমূহের নিবন্ধক',
      definition:
        'The registry where companies and partnership firms are incorporated and where their annual filings, share transfers and charge registrations are recorded. Most corporate-compliance work is an RJSC deadline rather than a tax one.',
      where: 'Corporate compliance',
    },
    return: {
      term: 'Return',
      alt: 'রিটার্ন',
      definition:
        'The periodic statement a business files with the revenue authority declaring what it owes, what it has already paid and, for VAT, what credit it claims. A return is a declaration with a signature on it, not a summary.',
      where: 'Compliance calendar',
    },
    tds: {
      term: 'Tax deducted at source (TDS)',
      alt: 'উৎসে কর (TDS)',
      definition:
        'Income tax withheld by the payer at the moment of payment and deposited with the revenue authority on the recipient’s behalf. The recipient claims it against their own liability, which is why the certificate matters as much as the deposit.',
      where: 'TDS calculator',
    },
    vds: {
      term: 'VAT deducted at source (VDS)',
      alt: 'উৎসে ভ্যাট (VDS)',
      definition:
        'VAT withheld by the buyer when paying a supplier, then deposited against the supplier’s VAT account. It protects the revenue on services where the supplier is hard to trace, and it is the reason a supplier’s ledger can show a shortfall nobody expected.',
      where: 'VDS calculator',
    },
    vat: {
      term: 'Value Added Tax (VAT)',
      alt: 'মূল্য সংযোজন কর (VAT)',
      definition:
        'A consumption tax charged at each stage of supply on the value a business adds, with registered buyers recovering the tax they paid on inputs. The rate that applies to a given supply is published on the rate pages with its source.',
      where: 'VAT calculator',
    },
    'input-tax-credit': {
      term: 'Input tax credit',
      alt: 'ইনপুট ট্যাক্স ক্রেডিট',
      definition:
        'The VAT a registered business has already paid on its purchases, which it deducts from the VAT it charges its own customers. Credit is only as good as its documentation: an invoice without the buyer’s registration number does not support a claim.',
      where: 'VAT and supplementary duty',
    },
    'accrual-basis': {
      term: 'Accrual basis',
      alt: 'এক্রুয়াল ভিত্তি',
      definition:
        'Recording revenue when it is earned and costs when they are incurred, rather than when cash moves. It is what makes a month’s profit comparable with the next month’s, and what makes a closing checklist longer than a cash book.',
      where: 'Accounting and bookkeeping',
    },
    'bank-reconciliation': {
      term: 'Bank reconciliation',
      alt: 'ব্যাংক সমন্বয়',
      definition:
        'Matching the bank statement to the cash book line by line, and explaining every difference — a cheque not yet presented, a charge not yet recorded, a transfer between accounts. Unexplained differences are where both errors and fraud hide.',
      where: 'Accounting and bookkeeping',
    },
    depreciation: {
      term: 'Depreciation',
      alt: 'অবচয়',
      definition:
        'Spreading the cost of an asset across the periods it helps earn revenue, rather than charging it all in the month it was bought. It is an allocation of cost, not a valuation of what the asset is worth today.',
      where: 'Profit calculator',
    },
    'working-paper': {
      term: 'Working paper',
      alt: 'ওয়ার্কিং পেপার',
      definition:
        'The record that shows how a figure in the accounts was arrived at: the source, the calculation and the person who prepared it. A year-end file is only as strong as its working papers, because that is what an auditor tests against.',
      where: 'Audit support',
    },
    'internal-control': {
      term: 'Internal control',
      alt: 'অভ্যন্তরীণ নিয়ন্ত্রণ',
      definition:
        'The procedures that make it hard to spend money wrongly and easy to notice when someone does — approvals, reconciliations, stock counts, access limits. Controls are judged by what they catch, not by how they read in a policy document.',
      where: 'Cost efficiency and internal control',
    },
    'segregation-of-duties': {
      term: 'Segregation of duties',
      alt: 'দায়িত্ব পৃথকীকরণ',
      definition:
        'Splitting a transaction so that the person who authorises it, the person who records it and the person who holds the asset are not the same person. It is the single cheapest control, and the one small businesses drop first.',
      where: 'Internal control and governance',
    },
    'purchase-price-variance': {
      term: 'Purchase-price variance',
      alt: 'ক্রয়মূল্যের তারতম্য',
      definition:
        'The difference between what a business pays for an item and what it expected or previously paid, multiplied across volume. Tracked by item and supplier, it is usually the largest recoverable number in a cost review.',
      where: 'Cost-efficiency estimator',
    },
    'inventory-variance': {
      term: 'Inventory variance',
      alt: 'মজুতের তারতম্য',
      definition:
        'The gap between stock on the books and stock on the floor, or between units bought and units sold after allowing for returns and wastage. Persistent variance points at process, not at counting.',
      where: 'Cost efficiency and internal control',
    },
    'payment-controls': {
      term: 'Payment controls',
      alt: 'পরিশোধ নিয়ন্ত্রণ',
      definition:
        'The rules around when and to whom money leaves: approval thresholds, matched invoice and purchase order, verified bank details, and a payment run that is reviewed rather than executed by one person.',
      where: 'Internal control and governance',
    },
    'contribution-margin': {
      term: 'Contribution margin',
      alt: 'অবদান মার্জিন',
      definition:
        'Selling price minus the variable cost of one unit: what each sale leaves behind to cover fixed costs. Once fixed costs are covered, contribution is profit — which is why it drives pricing decisions more often than gross margin does.',
      where: 'Break-even calculator',
    },
    'break-even': {
      term: 'Break-even point',
      alt: 'ব্রেক-ইভেন পয়েন্ট',
      definition:
        'The sales volume at which contribution exactly covers fixed costs, leaving no profit and no loss. Our calculator divides fixed costs by contribution per unit and rounds up, because half a unit cannot be sold.',
      where: 'Break-even calculator',
    },
    'working-capital': {
      term: 'Working capital',
      alt: 'কার্যকরী মূলধন',
      definition:
        'Current assets minus current liabilities: the money tied up in running the business day to day. A profitable business can run out of working capital, which is why the calculator also reports the cash conversion cycle.',
      where: 'Working-capital calculator',
    },
    'cash-flow': {
      term: 'Cash flow',
      alt: 'নগদ প্রবাহ',
      definition:
        'Money actually moving in and out over a period, as distinct from profit, which is measured when revenue is earned. Timing is the whole difference: a large sale on credit improves profit this month and cash flow next quarter.',
      where: 'Cash-flow calculator',
    },
    roi: {
      term: 'Return on investment (ROI)',
      alt: 'রিটার্ন অন ইনভেস্টমেন্ট (ROI)',
      definition:
        'Net gain divided by what was invested to produce it, expressed as a percentage or a multiple. Useful for comparing entirely different uses of the same money, and misleading the moment the time period is left out.',
      where: 'ROI calculator',
    },
  },

  labels: {
    authority: 'Administered by',
    alsoKnownAs: 'Also written as',
    index: 'Terms on this page',
  },

  cta: {
    title: 'A term you think is missing?',
    body: 'If you had to look something up here and it was not defined, tell us — the definition probably belongs on this page for the next reader in the same position.',
    primaryLabel: 'Suggest a term',
    secondaryLabel: 'Search the help centre',
  },
};
