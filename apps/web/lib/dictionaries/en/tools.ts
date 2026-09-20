/**
 * English copy for the free tools — DF-P2-011.
 * Structure comes from `lib/content/tools.ts`, the contract from
 * `lib/content/tool-copy.ts`.
 *
 * The `answer` on each tool is the 40–60 word block §5.5.4 #5 requires at the
 * top of the page. It is written to be quotable on purpose: it is the paragraph
 * a search result or an assistant will lift, so it has to be true standing alone
 * with no surrounding context.
 */

import type { ToolsDictionary } from '../../content/tool-copy';

export const tools: ToolsDictionary = {
  meta: {
    title: 'Free Financial Calculators for Bangladesh',
    metaTitle: 'Free Financial Calculators for Bangladesh | DhakaFin',
    metaDescription:
      'Thirteen free calculators for Bangladeshi businesses: TDS, VAT deduction, payroll cost, break-even, margin, cash runway and working capital. No signup, formula shown.',
  },

  hero: {
    eyebrow: 'Free tools',
    title: 'Numbers you can act on, and see exactly how they were worked out.',
    lead: 'Every calculator below shows its formula, states what it does not know, and keeps working with JavaScript off. No signup, no email wall, no result held hostage.',
  },

  categories: {
    compliance: {
      label: 'Deductions and filings',
      blurb: 'What to withhold, what to deposit, and what the net payment is.',
    },
    profitability: {
      label: 'Profit and pricing',
      blurb: 'Where the margin goes, what volume covers the overheads, and what a price has to be.',
    },
    cash: {
      label: 'Cash and liquidity',
      blurb: 'How long the money lasts, and how much of it the operating cycle is holding.',
    },
    cost: {
      label: 'Cost structure',
      blurb: 'What a workforce actually costs, and where spend is escaping.',
    },
  },

  index: {
    heading: 'All thirteen tools',
    lead: 'Grouped by the question you are actually asking, not by how the maths is implemented.',
    pendingBadge: 'Awaiting verified rates',
    openLabel: 'Open calculator',
  },

  shell: {
    inputsTitle: 'Your figures',
    inputsNote: 'Results update as you type. Nothing is sent anywhere.',
    advancedTitle: 'Advanced options',
    exampleLabel: 'Try an example',
    resetLabel: 'Reset',
    resultsNote: 'Recalculated on every keystroke, in this browser only.',
    liveRegionLabel: 'Calculation result',
  },

  disclosure: {
    title: 'How this was calculated',
    formulaLabel: 'Formula',
    roundingNote:
      'Money is rounded to the nearest taka. Percentages are rounded to two decimal places. Break-even volumes round up, because a third of a unit still has to be sold.',
    rateNote:
      'This tool does not look up rates. The rate above is the one you entered — check it against the current SRO, the rate page, or the figure printed on your own invoice. The result is arithmetic on your figure, not a published rate, and it will be as current as the document you read it from.',
    rateFreeNote:
      'Nothing in this calculation depends on a published rate, a slab or a threshold. Every figure comes from what you entered, so there is no version of this answer that expires.',
  },

  pending: {
    ratesTitle: 'This one needs verified rates, and we do not have them yet',
    ratesBody:
      'The answer depends on a published rate or slab that changes with the Finance Act. We could put a figure in the code and the calculator would appear to work — and it would quietly go stale the next time the instrument changed, which is the exact failure this site exists to prevent.',
    benchmarksTitle: 'This one needs a benchmark model we can defend',
    benchmarksBody:
      'The avoidable-cost ranges this tool produces come from a benchmark model. Publishing a range we had invented would damage the only thing the tool is worth — the credibility of the number — so the model is being built and documented before the calculator is switched on.',
    outlook:
      'The page stays live and the formula below is complete and current. When the data lands, the result panel switches on and this notice disappears. No bookmark breaks.',
  },

  related: {
    heading: 'Where to go next',
    toolLabel: 'Related tool',
    serviceLabel: 'If you want this done for you',
    rateLabel: 'The rate behind this',
    ratePendingNote: 'Rate pages arrive with the verified rate service.',
  },

  disclaimer:
    'General information, not professional advice. Every figure is arithmetic on what you entered, and no result here accounts for facts we cannot see: your agreements, your entity class, your exemptions, or a circular published after you read this page. Confirm anything you intend to file with the authority or an adviser.',

  cta: {
    title: 'Want this read by someone who files these every week?',
    body: 'A paid review takes your figures, checks them against the instrument that applies to you, and tells you where the difference actually is.',
    primary: 'Book a review',
    secondary: 'See the services',
  },

  hub: {
    allToolsLabel: 'All tools',
    toolsNavLabel: 'Tools',
  },

  tools: {
    /* ── Deductions and filings ─────────────────────────────────────────── */

    'tds-calculator': {
      name: 'TDS Calculator',
      metaTitle: 'TDS Calculator Bangladesh — Deduction and Net Payment | DhakaFin',
      metaDescription:
        'Work out tax deducted at source on a payment in Bangladesh: the deduction, the net payable to the supplier, and the effective rate when a document does not reconcile.',
      tagline: 'The deduction, the net payment, and a rate you can defend.',
      answer:
        'Tax deducted at source is calculated by multiplying the payment by the rate that applies to it. Enter the amount, the section rate and any deduction already made, and this gives you the tax to withhold, the net amount payable to the supplier, and the effective rate — the figure that explains a mismatch when a document will not reconcile.',
      fields: {
        paymentType: {
          label: 'Nature of payment',
          hint: 'Determines which part of the Act applies. It does not select a rate for you.',
          options: {
            service: 'Services',
            contract: 'Contractor or subcontractor',
            rent: 'Rent',
            professional: 'Professional or technical fee',
            supply: 'Supply of goods',
            other: 'Something else',
          },
        },
        amount: { label: 'Payment amount', hint: 'The gross figure before any deduction.' },
        rate: {
          label: 'Rate to apply',
          hint: 'Take this from the SRO or the rate that applies to your payment. See the note under the result.',
          unit: '%',
        },
        date: { label: 'Payment date', hint: 'Recorded with the calculation so a later reader knows which rate was in force.' },
        alreadyDeducted: { label: 'Already deducted', hint: 'Optional. Enter it to see whether the deduction on the document matches.' },
      },
      seriesRowLabel: 'Period {n}',
      result: {
        title: 'Deduction',
        primaryLabel: 'Tax to deduct',
        primaryKey: 'deduction',
        primaryUnit: 'taka',
        empty: 'Enter a payment amount and a rate to see the deduction.',
        rows: {
          deduction: 'Tax to deduct',
          netPayable: 'Net payable to supplier',
          effectiveRate: 'Effective rate',
          difference: 'Difference against the document',
          amount: 'Gross payment',
        },
      },
      howItWorks: {
        heading: 'How withholding works here',
        paragraphs: [
          'The deduction is the gross payment multiplied by the applicable rate. The supplier receives the rest. The tax withheld is held on their behalf and deposited against their TIN, which is why the certificate matters more than the payment: it is the supplier’s evidence that tax was paid on their account, and without it they are pursued for tax they have already funded.',
          'The effective rate is the figure worth watching. It is the deduction divided by the gross, and it routinely differs from the headline rate — because a threshold applied to part of the payment, or because the deduction was computed on an amount that already had VAT removed. When an accountant says a supplier’s certificate does not reconcile, the effective rate is the number that explains why.',
        ],
      },
      examples: {
        heading: 'Worked examples',
        items: [
          {
            title: 'Consulting fee, ৳5,00,000',
            body: 'A rate of 10% gives a deduction of ৳50,000 and a net payment of ৳4,50,000. The effective rate is 10.00%, which tells you nothing unusual happened.',
          },
          {
            title: 'Contract payment with a threshold',
            body: 'If tax applies only above a threshold within the bill, the deduction comes out below the headline rate. The effective rate shows the gap, which is normally the first question an auditor asks.',
          },
        ],
      },
      faqs: {
        heading: 'Common questions',
        items: [
          {
            id: 'tds-when',
            question: 'When does the tax have to be deposited?',
            answer:
              'Deposit timing follows the rule that applies to the payment, and it is a date we publish only from a verified source. Until the rate service is live, treat the deposit deadline as something to confirm against the authority rather than assume from a calculator.',
          },
          {
            id: 'tds-net',
            question: 'Is the net payment the amount I should actually pay?',
            answer:
              'The net figure is the gross minus the tax withheld. Whether anything else changes it — a VAT line, a partial payment, a credit note — depends on the agreement, and this tool does not read your agreement.',
          },
          {
            id: 'tds-rate',
            question: 'Why do you not fill in the rate for me?',
            answer:
              'Rates change with the Finance Act and with the SRO that applies to your particular payment, and a rate that is one revision out of date produces a confidently wrong number. You almost always have the rate in front of you when you are doing this work. We would rather use it than guess at it.',
          },
        ],
      },
    },

    'vds-calculator': {
      name: 'VDS Calculator',
      metaTitle: 'VDS Calculator Bangladesh — VAT Deducted at Source | DhakaFin',
      metaDescription:
        'Calculate VAT deducted at source on a service bill in Bangladesh: the deduction, the net payment to the supplier, and the effective rate you retained.',
      tagline: 'What to retain on a service bill, and what to pay over.',
      answer:
        'VAT deducted at source is withheld from a payment for services and deposited against the supplier’s VAT registration. Enter the bill amount and the applicable rate, and this shows the amount to retain, the net payment to the supplier, and the effective rate — plus a reminder that the deposit obligation belongs to you, not to them.',
      fields: {
        serviceType: {
          label: 'Service type',
          hint: 'Recorded with the calculation. It does not select a rate for you.',
          options: {
            consulting: 'Consulting or advisory',
            contract: 'Contract or works',
            advertising: 'Advertising',
            transport: 'Transport or freight',
            other: 'Something else',
          },
        },
        amount: { label: 'Bill amount', hint: 'The service value before VAT, unless your agreement says otherwise.' },
        rate: {
          label: 'Rate to apply',
          hint: 'Take this from the SRO that governs your service. See the note under the result.',
          unit: '%',
        },
        vatRegistered: { label: 'Supplier is VAT-registered', hint: 'Affects which form the deposit is reported on, and whether the supplier can issue a tax invoice.' },
        date: { label: 'Bill date', hint: 'Recorded with the calculation.' },
      },
      seriesRowLabel: 'Period {n}',
      result: {
        title: 'Retention',
        primaryLabel: 'VAT to deduct',
        primaryKey: 'deduction',
        primaryUnit: 'taka',
        empty: 'Enter a bill amount and a rate to see the retention.',
        rows: {
          deduction: 'VAT to deduct',
          netPayable: 'Net payable to supplier',
          effectiveRate: 'Effective rate',
          amount: 'Gross bill',
        },
      },
      howItWorks: {
        heading: 'Why VDS is the buyer’s obligation',
        paragraphs: [
          'VAT deducted at source moves the collection point from the supplier to the buyer. That is why the obligation lands on you: the deposit is due whether or not you withheld it, and the fact that a supplier failed to mention it does not move the liability. A buyer who pays a bill in full without withholding owes the tax anyway.',
          'The deposit is reported with the supplier’s registration number, which is why the buyer needs it before paying. That single detail is the most common reason a withheld amount cannot be reconciled months later, and it is worth collecting at the point of the purchase order rather than at the point of the return.',
        ],
      },
      examples: {
        heading: 'Worked examples',
        items: [
          {
            title: 'Service bill, ৳5,00,000',
            body: 'At a rate of 15%, ৳75,000 is retained and ৳4,25,000 is paid to the supplier. The retained amount is then deposited and reported against their registration.',
          },
          {
            title: 'Contract with materials',
            body: 'Where a contract supplies goods as well as services, the treatment of each part can differ. Splitting the bill before calculating is what keeps the single rate from being applied to the wrong base.',
          },
        ],
      },
      faqs: {
        heading: 'Common questions',
        items: [
          {
            id: 'vds-who',
            question: 'Whose liability is the deposit, mine or the supplier’s?',
            answer:
              'Yours as the buyer. The deduction is made on the buyer’s side, so the obligation to deposit follows the payment, not the invoice. A supplier cannot discharge it for you.',
          },
          {
            id: 'vds-supplier',
            question: 'What do I need from the supplier before paying?',
            answer:
              'Their VAT registration number, and the rate that applies to the service. The number is what the deposit is reported against, and it is routine to have to ask for it — better at the purchase order than six months later at the return.',
          },
          {
            id: 'vds-goods',
            question: 'Does this apply to goods as well as services?',
            answer:
              'The scope is defined by the instrument that imposes it, and it is not simply "everything". Confirm the treatment of what you are buying before you pay the bill, because recovering an amount you withheld in error is considerably harder than withholding it correctly.',
          },
        ],
      },
    },

    'vat-calculator': {
      name: 'VAT Calculator',
      metaTitle: 'VAT Calculator Bangladesh — Inclusive, Exclusive and Net | DhakaFin',
      metaDescription:
        'Add VAT to a net amount or extract it from a VAT-inclusive total, then offset eligible input credit to get the net payable. Both directions, with the working shown.',
      tagline: 'Both directions, because entering the wrong one is a 15% error.',
      answer:
        'Entering a VAT-inclusive total into the exclusive form overstates the tax by the tax, which on a standard rate is an error of about a seventh. This calculator handles both directions explicitly and offsets eligible input credit, so you get the taxable base, the VAT, the total, and the net payable rather than a single figure whose direction you have to infer.',
      fields: {
        mode: {
          label: 'Direction',
          hint: 'Whether the amount you have is before VAT or includes it.',
          options: {
            exclusive: 'Add VAT to a net amount',
            inclusive: 'Extract VAT from a gross amount',
          },
        },
        amount: { label: 'Amount', hint: 'Net of VAT in exclusive mode; VAT-inclusive in inclusive mode.' },
        rate: {
          label: 'Rate to apply',
          hint: 'Take this from the SRO for your supply, or from the invoice. See the note under the result.',
          unit: '%',
        },
        inputCredit: { label: 'Eligible input credit', hint: 'VAT you have paid on purchases that is eligible to be offset.' },
      },
      seriesRowLabel: 'Period {n}',
      result: {
        title: 'VAT',
        primaryLabel: 'VAT',
        primaryKey: 'vat',
        primaryUnit: 'taka',
        empty: 'Enter an amount and a rate to see the VAT.',
        rows: {
          base: 'Taxable base',
          vat: 'VAT',
          total: 'Total including VAT',
          inputCredit: 'Input credit applied',
          netPayable: 'Net payable',
        },
      },
      howItWorks: {
        heading: 'The two directions, and why the choice is forced',
        paragraphs: [
          'To add VAT, multiply the net amount by the rate. To extract it, the gross has to be divided by one plus the rate — not multiplied by it. The difference is not cosmetic: applying the rate to a gross figure overstates the tax by the tax itself, and on a standard rate that is roughly a seventh too much. A reconciliation built on it will not balance, and the error is invisible unless the direction is stated.',
          'Net payable is floored at zero. When eligible input credit exceeds the output tax the position is a credit carried forward under the rules, not a refund at the counter, so showing a negative payable would suggest money is coming back when it is not.',
        ],
      },
      examples: {
        heading: 'Worked examples',
        items: [
          {
            title: 'Net ৳1,00,000 at a standard rate',
            body: 'The VAT is a straight multiplication of the base. The total is the base plus the VAT.',
          },
          {
            title: 'Gross ৳1,15,000 at the same rate',
            body: 'The base is the gross divided by one plus the rate, which is a smaller figure than dividing by the rate alone. The two directions land on the same numbers from opposite ends, which is the quickest way to check that you picked the right one.',
          },
        ],
      },
      faqs: {
        heading: 'Common questions',
        items: [
          {
            id: 'vat-direction',
            question: 'How do I know which direction I need?',
            answer:
              'By what your document shows. An invoice that lists a value and adds tax on top is exclusive. A receipt for a total that already includes the tax is inclusive. If your document says "VAT included" and you use the exclusive form, you will over-report.',
          },
          {
            id: 'vat-credit',
            question: 'Can I offset all the VAT I paid on purchases?',
            answer:
              'Only what is eligible. Eligibility depends on whether the purchase relates to a taxable supply and on the documentation requirements, which is where most of the argument in a VAT reconciliation actually happens. Enter only what you can support.',
          },
          {
            id: 'vat-reduced',
            question: 'What rate should I use?',
            answer:
              'The one that applies to your specific supply. There is more than one rate in force, and the correct one depends on what is being supplied, not on the size of the transaction. Take it from the SRO or the invoice and confirm it before filing.',
          },
        ],
      },
    },

    'payroll-calculator': {
      name: 'Payroll Cost Calculator',
      metaTitle: 'Payroll Cost Calculator Bangladesh — Fully Loaded | DhakaFin',
      metaDescription:
        'Work out the real monthly cost of your workforce: gross pay, allowances, overtime, employer contributions and the cost per head, calculated from your own figures.',
      tagline: 'What the team actually costs, not what the salaries say.',
      answer:
        'Budgeting on gross salaries understates payroll every time. This calculator builds up from headcount to gross pay, allowances and overtime, then adds the employer contributions that are the employer’s money and reports the tax withheld that is not, so you get the figure that actually leaves the bank each month and the cost per head.',
      fields: {
        headcount: { label: 'Headcount', hint: 'Employees on the payroll this month.' },
        grossPerHead: { label: 'Gross salary per head', hint: 'Before allowances and overtime.' },
        allowancesPerHead: { label: 'Allowances per head', hint: 'House rent, transport, and anything else paid every month.' },
        overtimePerHead: { label: 'Overtime per head', hint: 'At the overtime rate, already worked out.' },
        tdsRate: { label: 'Rate applied to taxable payroll', hint: 'Optional, and withheld from the employee rather than added to your cost.', unit: '%' },
        contributionRate: { label: 'Employer contribution rate', hint: 'Optional. Your own contribution, which is added to your cost.', unit: '%' },
      },
      seriesRowLabel: 'Period {n}',
      result: {
        title: 'Monthly cost',
        primaryLabel: 'Total monthly cost',
        primaryKey: 'totalMonthlyCost',
        primaryUnit: 'taka',
        empty: 'Enter a headcount and a salary to see the monthly cost.',
        rows: {
          grossPay: 'Gross salaries',
          allowances: 'Allowances',
          overtime: 'Overtime',
          totalTaxablePayroll: 'Taxable payroll',
          employerContribution: 'Employer contribution',
          tds: 'Tax withheld from employees',
          costPerHead: 'Cost per head',
          totalAnnualCost: 'Annual cost',
        },
      },
      howItWorks: {
        heading: 'Why the gross salary is not the cost',
        paragraphs: [
          'The number that matters is the total that leaves the bank, and it is made of three things: the salary, the allowances and overtime that are actually paid, and any contribution the employer owes. Only the first is in the offer letter. Overtime is consistently underestimated because the pay period is where it happens, and statutory contributions are invisible until the first filing.',
          'Tax withheld from an employee is not part of your cost and is reported separately. It reduces what the employee receives, not what you pay. Lumping it into the cost figure is a common error that makes payroll look more expensive than it is and hides the number that actually needs checking.',
        ],
      },
      examples: {
        heading: 'Worked examples',
        items: [
          {
            title: 'Forty people on salaries and allowances',
            body: 'Headcount multiplies each line independently, so a change in allowances moves the total by the headcount, not by one person’s increase. That is the arithmetic a hiring decision actually turns on.',
          },
          {
            title: 'Adding a contribution rate',
            body: 'Setting a contribution rate adds a percentage of taxable payroll to your cost without touching what the employee receives. It is the difference between the payroll you budgeted and the payroll you pay.',
          },
        ],
      },
      faqs: {
        heading: 'Common questions',
        items: [
          {
            id: 'payroll-cost',
            question: 'Should tax withheld be in my cost figure?',
            answer:
              'No. Tax withheld reduces the employee’s net pay but it is their tax, remitted on their behalf. It is shown separately here so you can see both the amount you must deposit and the amount that is genuinely your cost.',
          },
          {
            id: 'payroll-rate',
            question: 'Why are the rate fields empty?',
            answer:
              'Because the contribution treatment and the tax treatment both depend on facts this page cannot see, and a wrong rate here affects every employee at once. Enter the rate that applies to you, and the arithmetic above it is unchanged.',
          },
          {
            id: 'payroll-annual',
            question: 'Is the annual figure just twelve months?',
            answer:
              'It is a flat multiplication of the month you entered. It does not model a bonus, a seasonal peak or a mid-year hire, which is why the monthly figure is the one to trust and the annual figure is the one to sanity-check.',
          },
        ],
      },
    },

    /* ── Profit and pricing ─────────────────────────────────────────────── */

    'profit-calculator': {
      name: 'Profit Calculator',
      metaTitle: 'Profit and Margin Calculator Bangladesh — P&L in Three Lines | DhakaFin',
      metaDescription:
        'Turn revenue, cost of goods and operating expenses into gross profit, operating profit and both margins, so you can see whether the problem is pricing or overheads.',
      tagline: 'Three lines, two margins, and the one that is actually broken.',
      answer:
        'Gross profit is revenue minus the cost of goods. Operating profit is what is left after running the business. They fail for different reasons: a weak gross margin is a pricing or input-cost problem that overhead discipline cannot fix, while a healthy gross margin with a negative operating margin is pure overhead. Reporting one net figure hides which conversation you need.',
      fields: {
        revenue: { label: 'Revenue', hint: 'Net of discounts, for the period you are looking at.' },
        costOfGoods: { label: 'Cost of goods sold', hint: 'Materials, purchases, and the direct labour in what you sold.' },
        operatingExpenses: { label: 'Operating expenses', hint: 'Salaries, rent, utilities, marketing and everything else you run on.' },
      },
      seriesRowLabel: 'Period {n}',
      result: {
        title: 'Profit',
        primaryLabel: 'Operating profit',
        primaryKey: 'operatingProfit',
        primaryUnit: 'taka',
        empty: 'Enter revenue and costs to see the profit.',
        rows: {
          grossProfit: 'Gross profit',
          grossMargin: 'Gross margin',
          operatingProfit: 'Operating profit',
          operatingMargin: 'Operating margin',
          revenue: 'Revenue',
          costOfGoods: 'Cost of goods',
          operatingExpenses: 'Operating expenses',
        },
      },
      howItWorks: {
        heading: 'Why two margins, not one',
        paragraphs: [
          'Gross margin measures whether the thing you sell is worth selling. Operating margin measures whether the business that sells it is worth running. A company can be excellent at the first and hopeless at the second — a strong product sold by an organisation that costs more to run than the product earns. Reporting a single net figure collapses the two and makes the diagnosis impossible.',
          'The order matters too. When operating profit is negative but gross profit is healthy, cutting overheads is the right move. When gross profit is negative, cutting overheads delays the failure: every additional sale loses more money, and the fix has to be in price or in input cost.',
        ],
      },
      examples: {
        heading: 'Worked examples',
        items: [
          {
            title: 'A trading business with thin margins',
            body: 'Low gross margin and a small positive operating margin is the classic distribution profile. It survives on volume, so the figure to watch is the gross margin — a single point lost there wipes out the operating profit entirely.',
          },
          {
            title: 'A services business carrying too much overhead',
            body: 'High gross margin and negative operating profit is not a pricing problem. The work is profitable; the structure around it is not. That is a much easier fix, and it is only visible if the two margins are shown apart.',
          },
        ],
      },
      faqs: {
        heading: 'Common questions',
        items: [
          {
            id: 'profit-cogs',
            question: 'What belongs in cost of goods?',
            answer:
              'The costs that move with what you sell: materials, purchases, freight inwards, and the labour directly used in delivering it. If a cost would be unchanged by selling nothing next month, it is an operating expense, and putting it in the wrong line changes the diagnosis.',
          },
          {
            id: 'profit-loss',
            question: 'What does a negative gross profit mean?',
            answer:
              'That the direct cost of what you sell exceeds what you sell it for. No volume fixes that, and no overhead reduction fixes it either — it is a price or an input-cost problem, and it needs addressing at that level.',
          },
          {
            id: 'profit-period',
            question: 'Which period should I enter?',
            answer:
              'A month for operational decisions and a year for anything structural. Both are available from your own books, and a month compared against the same month last year is usually more informative than a year on its own.',
          },
        ],
      },
    },

    'profit-margin-calculator': {
      name: 'Profit Margin Calculator',
      metaTitle: 'Margin and Markup Calculator Bangladesh | DhakaFin',
      metaDescription:
        'Convert between margin and markup, and solve for the price a target margin needs. The two are different numbers, and pricing built on the wrong one erodes margin.',
      tagline: 'Margin and markup are not the same number, and the gap is expensive.',
      answer:
        'Margin is profit divided by the selling price. Markup is profit divided by the cost. A 20% markup is a 16.7% margin, so a business pricing on a cost-plus rule written in markups while reporting margins is quietly under-earning on every line. This calculator gives both, and solves for the price a target margin requires.',
      fields: {
        cost: { label: 'Unit cost', hint: 'What the item costs you, landed.' },
        price: { label: 'Selling price', hint: 'Leave at zero if you want the price solved from a target margin below.' },
        targetMargin: { label: 'Target margin', hint: 'Optional. Solves the selling price that delivers it.', unit: '%' },
      },
      seriesRowLabel: 'Period {n}',
      result: {
        title: 'Margin',
        primaryLabel: 'Gross margin',
        primaryKey: 'margin',
        primaryUnit: '%',
        empty: 'Enter a cost and a selling price to see the margin.',
        rows: {
          price: 'Selling price',
          grossProfit: 'Gross profit per unit',
          margin: 'Margin',
          markup: 'Markup',
          cost: 'Unit cost',
        },
      },
      howItWorks: {
        heading: 'The gap that costs money',
        paragraphs: [
          'Markup is measured against cost; margin is measured against price. Because the price is always the larger of the two, the margin is always the smaller number. A 25% markup is a 20% margin. A 100% markup — the classic doubling rule — is a 50% margin, not 100%. Any pricing conversation where two people are using different definitions will produce an agreement both parties believe and only one of them can afford.',
          'Solving backwards from a target margin is the useful direction. If the business has decided it needs a 30% gross margin to cover its overheads, the required price is the cost divided by 0.7, not the cost multiplied by 1.3. Those two answers differ by enough to matter across a product range.',
        ],
      },
      examples: {
        heading: 'Worked examples',
        items: [
          {
            title: 'Cost ৳800, sold at ৳1,000',
            body: 'Profit is ৳200. That is a 20% margin and a 25% markup. Whichever number the business quotes, it is describing the same ৳200 — the risk is only in which one the next person assumes.',
          },
          {
            title: 'A 30% margin target on ৳800 of cost',
            body: 'The required price is ৳800 ÷ 0.7, which is about ৳1,143. Multiplying by 1.3 gives ৳1,040 instead — a 9% underprice that looks completely reasonable in a spreadsheet.',
          },
        ],
      },
      faqs: {
        heading: 'Common questions',
        items: [
          {
            id: 'margin-diff',
            question: 'Which one should I quote in a price list?',
            answer:
              'Margin, because that is the figure the rest of the business compares against overheads. Markup is a pricing input, not a reporting output. If your system holds markups, convert before anyone uses the figure to plan.',
          },
          {
            id: 'margin-target',
            question: 'Can a margin be 100%?',
            answer:
              'Only with zero cost. As cost falls toward nothing the margin approaches 100% but never reaches it, which is why a 100% margin target has no finite selling price and this tool says so rather than returning an enormous number.',
          },
          {
            id: 'margin-volume',
            question: 'Does a higher margin always mean more profit?',
            answer:
              'Not on its own. The margin is per unit; profit is margin times volume. Raising a price by enough to lose volume is a real risk, and the volume at which a price rise stops paying is what the break-even calculator works out.',
          },
        ],
      },
    },

    'break-even-calculator': {
      name: 'Break-even Calculator',
      metaTitle: 'Break-even Calculator Bangladesh — Units and Revenue | DhakaFin',
      metaDescription:
        'Find the sales volume that covers your fixed costs, the revenue it represents, and the margin of safety between break-even and where you are selling today.',
      tagline: 'The volume that covers the overheads, and how much room you have.',
      answer:
        'Break-even volume is fixed costs divided by the contribution each unit makes — the price minus the variable cost. Above that volume every unit adds profit; below it, every unit deepens the loss. The margin of safety is the distance between where you actually sell and that line, which is a far better measure of risk than a profit figure.',
      fields: {
        fixedCost: { label: 'Fixed costs', hint: 'Rent, salaries and everything else you pay regardless of volume.' },
        pricePerUnit: { label: 'Price per unit', hint: 'Net of discount.' },
        variableCostPerUnit: { label: 'Variable cost per unit', hint: 'Materials, commission and anything else that scales with each sale.' },
        currentUnits: { label: 'Units you sell now', hint: 'Optional. Gives you the margin of safety.' },
      },
      seriesRowLabel: 'Period {n}',
      result: {
        title: 'Break-even',
        primaryLabel: 'Break-even volume',
        primaryUnit: 'units',
        empty: 'Enter fixed costs, a price and a variable cost to see the break-even volume.',
        rows: {
          contribution: 'Contribution per unit',
          breakEvenUnits: 'Break-even volume',
          breakEvenRevenue: 'Revenue at break-even',
          marginOfSafetyUnits: 'Margin of safety',
          marginOfSafetyPercent: 'Margin of safety',
        },
      },
      howItWorks: {
        heading: 'Contribution is the number that does the work',
        paragraphs: [
          'Every unit sold contributes its price minus its variable cost toward the fixed costs. Once the accumulated contributions equal the fixed costs, the business is at break-even; every unit after that is profit. This is why the volume matters more than the percentage: a low-margin product needs a great many units to cover the same rent, and that volume is the real commercial risk.',
          'When the price is at or below the variable cost, contribution is zero or negative and no volume reaches break-even — every extra sale loses money. The arithmetic would return a negative or infinite volume, which is a meaningless answer to a real question, so the calculator says the volume is unreachable and explains why instead.',
        ],
      },
      examples: {
        heading: 'Worked examples',
        items: [
          {
            title: 'Fixed costs with room to spare',
            body: 'A contribution of a few hundred taka against fixed costs in the hundreds of thousands typically lands at a few thousand units. Comparing that with current sales is the margin of safety, and it is the number to take to a pricing meeting.',
          },
          {
            title: 'The price-cut trap',
            body: 'Cutting the price reduces the contribution, which raises the break-even volume — often by more than the cut, because the denominator falls as well as the margin. A 10% price cut can raise the volume needed by 40% or more.',
          },
        ],
      },
      faqs: {
        heading: 'Common questions',
        items: [
          {
            id: 'be-fixed',
            question: 'Is rent a fixed cost or a variable cost?',
            answer:
              'Fixed, if it is the same whether you sell ten units or ten thousand. Labour is the one that trips people up: production labour that scales with output is variable, salaried staff are fixed. Splitting it wrongly changes the break-even volume substantially.',
          },
          {
            id: 'be-mos',
            question: 'What is a safe margin of safety?',
            answer:
              'There is no universal number — it depends on how volatile your sales are. What matters is knowing it. A business breaking even at 95% of current sales has almost no room for a bad quarter, and that is worth knowing before the bad quarter arrives.',
          },
          {
            id: 'be-unreachable',
            question: 'Why does it say break-even is unreachable?',
            answer:
              'Because the price does not cover the variable cost. At that point each additional sale increases the loss, so there is no volume that breaks even. The fix is a price above variable cost, or a variable cost below the price — not more sales.',
          },
        ],
      },
    },

    'roi-calculator': {
      name: 'ROI Calculator',
      metaTitle: 'ROI Calculator Bangladesh — Annualised Return and Payback | DhakaFin',
      metaDescription:
        'Calculate return on investment in Bangladesh with payback years, a geometrically annualised return, and net present value when you supply a discount rate.',
      tagline: 'Annualised properly, because dividing by years overstates it.',
      answer:
        'ROI is net return divided by investment. Annualising it means taking the geometric rate, not dividing by the number of years — 100% over five years is 14.87% a year, not 20%. This calculator gives the total return, the properly annualised figure, the payback period, and net present value when you supply a discount rate.',
      fields: {
        investment: { label: 'Investment', hint: 'Everything you have to commit: equipment, fit-out, working capital, your own time at cost.' },
        annualReturn: { label: 'Annual return', hint: 'The cash the investment produces in a year, before financing costs.' },
        years: { label: 'Years', hint: 'The period you are assessing.' },
        discountRate: { label: 'Discount rate', hint: 'Optional. Supplying it adds net present value to the result.', unit: '%' },
      },
      seriesRowLabel: 'Period {n}',
      result: {
        title: 'Return',
        primaryLabel: 'Return on investment',
        primaryKey: 'roi',
        primaryUnit: '%',
        empty: 'Enter an investment and an annual return to see the return.',
        rows: {
          totalReturn: 'Total return',
          netReturn: 'Net return',
          roi: 'Return on investment',
          annualised: 'Annualised return',
          payback: 'Payback period',
          npv: 'Net present value',
        },
      },
      howItWorks: {
        heading: 'Why the annualised figure has to be geometric',
        paragraphs: [
          'Dividing a multi-year return by the number of years assumes the return is simple, but money that is not withdrawn compounds. A return of 100% over five years is a growth factor of two, and the rate that turns one into two over five years is about 14.87% — a long way from the 20% that division suggests. The gap widens with the period, and it is the single most common error in an investment proposal.',
          'Net present value answers a different question from ROI, and a better one: not how much comes back, but whether it beats the alternative. A 40% return over five years sounds excellent until the discount rate makes clear it does not clear the cost of the money. NPV is only shown when you supply a discount rate, because without one it is a number with no meaning.',
        ],
      },
      examples: {
        heading: 'Worked examples',
        items: [
          {
            title: 'Equipment with a five-year life',
            body: 'An investment returning a multiple of its cost over five years looks strong on total return and considerably more modest annualised. Both are true. The annualised figure is the one that compares against anything else you could do with the money.',
          },
          {
            title: 'Adding a discount rate',
            body: 'Supplying a discount rate turns a gross return into a comparison against the cost of capital. An investment can show a positive total return and a negative net present value at the same time, and that combination is the one worth arguing about.',
          },
        ],
      },
      faqs: {
        heading: 'Common questions',
        items: [
          {
            id: 'roi-annual',
            question: 'Why is the annualised return lower than ROI divided by years?',
            answer:
              'Because it accounts for compounding. A return that is left in the business earns on itself, so a smaller annual rate produces the same total over several years. Dividing by the period overstates the rate, sometimes by a great deal over long horizons.',
          },
          {
            id: 'roi-npv',
            question: 'What discount rate should I use?',
            answer:
              'The rate your money costs you — your borrowing rate, or what the same capital would earn in its next-best use. There is no universal figure, and the point of supplying your own is that the answer is only meaningful relative to it.',
          },
          {
            id: 'roi-payback',
            question: 'Which matters more, payback or ROI?',
            answer:
              'Payback answers how long your money is at risk; ROI answers how much it earns. A business with tight cash cares more about the first, and a business with patient capital cares more about the second. Neither is a substitute for the other.',
          },
        ],
      },
    },

    /* ── Cash and liquidity ─────────────────────────────────────────────── */

    'cash-flow-calculator': {
      name: 'Cash Flow and Runway Calculator',
      metaTitle: 'Cash Flow and Runway Calculator Bangladesh | DhakaFin',
      metaDescription:
        'Map twelve months of net cash movement, find the month your balance goes negative, and see how many months of runway you have if you keep burning at today’s rate.',
      tagline: 'When the balance turns, and how many months you have.',
      answer:
        'Profitable businesses run out of cash, because profit is an accounting result and cash is a date. Enter your opening balance and a net movement for each month, and this shows the running balance, the lowest point it reaches, the month it first goes negative, and how many months of runway remain at your average rate of burn.',
      fields: {
        openingBalance: { label: 'Opening balance', hint: 'Cash in the bank at the start of month one.' },
        monthlyNet: { label: 'Net movement each month', hint: 'Money in minus money out. A negative figure is a month that consumed cash.' },
      },
      seriesRowLabel: 'Month {n}',
      result: {
        title: 'Cash',
        primaryLabel: 'Lowest balance',
        primaryKey: 'lowest',
        primaryUnit: 'taka',
        empty: 'Enter an opening balance and a month of movement to see the running balance.',
        rows: {
          closing: 'Closing balance',
          lowest: 'Lowest balance',
          firstNegative: 'First month negative',
          runway: 'Runway remaining',
          months: 'Months covered',
        },
      },
      howItWorks: {
        heading: 'The lowest point matters more than the closing balance',
        paragraphs: [
          'A year that ends comfortably in credit can still contain a month where the account is empty, and the account does not care what the year averages. Salaries, a quarterly deposit and a large supplier payment landing in the same fortnight is the ordinary shape of a cash crisis in a business that is otherwise healthy, and it is invisible in an annual figure. This is why the lowest balance is the primary number here.',
          'Runway is only reported while the business is burning cash on average. A forecast that is net-positive has no finite runway, and printing a large number of months would suggest a deadline that does not exist. When the average is negative, the runway is the opening balance divided by the average monthly burn — and it is reported while the balance is still healthy, which is the only time it is useful.',
        ],
      },
      examples: {
        heading: 'Worked examples',
        items: [
          {
            title: 'A seasonal business',
            body: 'A run of negative months followed by a strong season is normal and survivable if the opening balance covers the trough. The lowest balance tells you what that trough has to be, which is the figure to arrange a facility against.',
          },
          {
            title: 'A steady burn',
            body: 'Twelve months of consistent negative movement with a healthy opening balance gives a clean runway figure. It is the clearest number a founder or a board can be given, and the one that prompts a decision before it is made for them.',
          },
        ],
      },
      faqs: {
        heading: 'Common questions',
        items: [
          {
            id: 'cf-profit',
            question: 'How can a profitable business run out of cash?',
            answer:
              'Because profit is recognised when the sale is made and cash arrives when the customer pays. A business with generous credit terms and growing sales is funding its customers — the growth itself consumes cash, which is why rapid growth is a classic cause of failure.',
          },
          {
            id: 'cf-net',
            question: 'Do I enter sales and costs, or net movement?',
            answer:
              'Net movement: what actually landed in and left the account each month, from your bank statement rather than your profit and loss. Deposits, loan repayments and capital purchases all move cash and none of them are in operating profit.',
          },
          {
            id: 'cf-runway',
            question: 'Why does the runway say nothing?',
            answer:
              'Because your average monthly movement over the period is positive. There is no burn to divide by, so there is no finite runway. If you are still uneasy, the lowest balance is the number to look at — a forecast can be net-positive for the year and still dip below zero in a bad month.',
          },
        ],
      },
    },

    'working-capital-calculator': {
      name: 'Working Capital Calculator',
      metaTitle: 'Working Capital and Cash Conversion Calculator | DhakaFin',
      metaDescription:
        'Calculate working capital, the current ratio and the cash conversion cycle, and see how much cash your operating cycle is holding at your own revenue run rate.',
      tagline: 'How much cash the operating cycle is holding, and for how long.',
      answer:
        'Working capital is current assets minus current liabilities. The cash conversion cycle is more useful: inventory days plus receivable days minus payable days. A cycle of 75 days means three-quarters of a year’s revenue is sitting in the business as stock and unpaid invoices, and that is the number a growing company has to fund.',
      fields: {
        currentAssets: { label: 'Current assets', hint: 'Cash, receivables, inventory and anything else convertible within a year.' },
        currentLiabilities: { label: 'Current liabilities', hint: 'Payables, short-term loans, deposits and accruals.' },
        inventoryDays: { label: 'Inventory days', hint: 'How long stock sits before it is sold.' },
        receivableDays: { label: 'Receivable days', hint: 'How long customers take to pay.' },
        payableDays: { label: 'Payable days', hint: 'How long you take to pay suppliers.' },
        annualRevenue: { label: 'Annual revenue', hint: 'Optional. Converts the cycle into the cash it absorbs.' },
      },
      seriesRowLabel: 'Period {n}',
      result: {
        title: 'Working capital',
        primaryLabel: 'Working capital',
        primaryKey: 'workingCapital',
        primaryUnit: 'taka',
        empty: 'Enter current assets and liabilities to see the working capital position.',
        rows: {
          workingCapital: 'Working capital',
          currentRatio: 'Current ratio',
          quickRatio: 'Quick ratio (estimated)',
          ccc: 'Cash conversion cycle',
          fundingGap: 'Cash the cycle absorbs',
        },
      },
      howItWorks: {
        heading: 'The cycle is where the cash goes',
        paragraphs: [
          'You buy stock, hold it, sell it, and then wait to be paid. Every day in that sequence is a day your money is working for someone else. Payables offset it: if suppliers wait longer than your customers do, the cycle is negative and your suppliers are financing your growth. Most businesses are on the other side of that line and do not know how far.',
          'The funding gap is the cycle expressed in money. A 75-day cycle on a crore of annual revenue means about twenty lakh is permanently absorbed — not lost, but unavailable, and growing in step with sales. That is why a company can be profitable, growing and constantly short of cash at the same time, and it is the number to take to a lender.',
        ],
      },
      examples: {
        heading: 'Worked examples',
        items: [
          {
            title: 'A distributor with slow collections',
            body: 'Sixty days of stock and forty-five days of credit against thirty days on payables gives a 75-day cycle. Shortening receivables by ten days releases cash without selling anything extra — usually the fastest improvement available.',
          },
          {
            title: 'A business with supplier-funded growth',
            body: 'A short cycle against longer payables gives a negative conversion cycle: the business is paid before it has to pay. It is a strong position and it is fragile, because it depends entirely on terms that a supplier can change.',
          },
        ],
      },
      faqs: {
        heading: 'Common questions',
        items: [
          {
            id: 'wc-ratio',
            question: 'What is a good current ratio?',
            answer:
              'Conventionally above one, meaning assets cover liabilities. Well above one is not automatically better — it can mean cash sitting idle or a warehouse of stock nobody wants. The ratio gives you the question; the cycle gives you the answer.',
          },
          {
            id: 'wc-quick',
            question: 'Why is the quick ratio marked as estimated?',
            answer:
              'Because it excludes inventory and this calculator does not know your actual inventory balance, only how many days it turns in. The estimate assumes a conventional proportion, which is stated rather than hidden so you can substitute the real figure.',
          },
          {
            id: 'wc-improve',
            question: 'What is the fastest way to improve the cycle?',
            answer:
              'Usually receivables. A single policy change — an invoice raised on delivery rather than on month end, or a deposit on orders — moves the fastest element of the cycle. Inventory takes longer and payables costs you goodwill with suppliers.',
          },
        ],
      },
    },

    /* ── Held back until verified data exists ───────────────────────────── */

    'income-tax-calculator': {
      name: 'Income Tax Calculator',
      metaTitle: 'Income Tax Calculator Bangladesh — Slabs and Rebate | DhakaFin',
      metaDescription:
        'Calculate income tax on salary and other income in Bangladesh: slab-by-slab tax, the investment rebate, minimum tax rules and the effective rate you actually pay.',
      tagline: 'Slab by slab, with the rebate and the minimum tax rules.',
      answer:
        'Income tax is applied slab by slab, so the rate on your last taka of income is not the rate you pay. The effective rate is the total tax divided by total income, and it is almost always lower than the top slab. This calculator is being built to show the full breakdown, the investment rebate and the minimum tax position together.',
      fields: {
        taxableIncome: { label: 'Taxable income', hint: 'Total income after the exemptions you are entitled to claim.' },
        taxAlreadyPaid: { label: 'Tax already paid', hint: 'TDS and advance tax already deposited against your TIN.' },
      },
      seriesRowLabel: 'Period {n}',
      result: {
        title: 'Tax',
        primaryLabel: 'Tax payable',
        primaryUnit: 'taka',
        empty: 'This calculator starts working when the verified slab structure is connected.',
        rows: {
          taxableIncome: 'Taxable income',
          slabTax: 'Tax before rebate',
          rebate: 'Investment rebate',
          minimumTax: 'Minimum tax applied',
          taxPayable: 'Tax payable',
          effectiveRate: 'Effective rate',
        },
      },
      pendingState: {
        title: 'Waiting on the verified slab structure',
        body: 'Income tax is calculated from slabs that the Finance Act sets and amends, and a slab table that is one revision out of date produces a confidently wrong number for every user at once. That is precisely the failure this site exists to prevent, so the calculator stays switched off until the structure is read from the source and dated.',
        whatWeNeed: 'The current slab thresholds, rates, rebate rules and minimum tax provisions, each dated and attributed.',
      },
      howItWorks: {
        heading: 'How the calculation will work',
        paragraphs: [
          'Your income is divided across slabs, and each slab is taxed at its own rate. The rate on the highest slab you reach is your marginal rate, but it applies only to the income inside that slab. The effective rate — total tax divided by total income — is a lower figure, and it is the one that describes what you actually pay.',
          'Two provisions then adjust the result. The investment rebate reduces the tax by a proportion of eligible investment, up to a cap. Minimum tax sets a floor that applies regardless of the rebate, and it is the rule that most often surprises a taxpayer whose income is low but whose circumstances push them above it.',
        ],
      },
      examples: {
        heading: 'Worked examples',
        items: [
          {
            title: 'A salaried employee with a single employer',
            body: 'One income source, tax withheld monthly by the employer, and a rebate claim on eligible investments. The interesting output is not the tax figure but the difference between what was withheld and what is due.',
          },
          {
            title: 'The minimum tax floor',
            body: 'A taxpayer with a modest income and a large rebate claim can still owe tax, because the rebate cannot reduce the liability below the minimum. This is the case a slab-only calculator gets wrong, and it is why the minimum tax rules are part of the specification.',
          },
        ],
      },
      faqs: {
        heading: 'Common questions',
        items: [
          {
            id: 'it-effective',
            question: 'Is my tax rate the same as my slab?',
            answer:
              'No. The slab rate applies only to the income inside that slab; everything below it was taxed at lower rates. The effective rate — total tax over total income — is the comparable figure, and it is lower than your top slab rate.',
          },
          {
            id: 'it-rebate',
            question: 'Does the rebate always reduce my tax?',
            answer:
              'It reduces it up to a cap, and it cannot take the liability below the minimum tax. A large rebate claim against a small liability will not be fully absorbed, which is a common and expensive surprise if it is discovered after filing.',
          },
        ],
      },
    },

    'corporate-tax-calculator': {
      name: 'Corporate Tax Calculator',
      metaTitle: 'Corporate Tax Calculator Bangladesh — Company Rates | DhakaFin',
      metaDescription:
        'Calculate corporate income tax for a Bangladeshi company: the rate for your entity class, the conditional adjustments, and the effective rate on taxable profit.',
      tagline: 'The rate for your entity class, and the conditions attached to it.',
      answer:
        'Corporate tax in Bangladesh varies by entity class, and several rates carry conditions — a higher rate applies where the conditions are not met. This calculator will show the rate for your class, flag the conditions and give the effective rate, once the verified rate table is connected rather than typed in from memory.',
      fields: {
        taxableProfit: { label: 'Taxable profit', hint: 'Profit after allowable adjustments and deductions.' },
        entityType: {
          label: 'Entity class',
          hint: 'The class determines the base rate, and some classes carry conditions.',
          options: {
            private: 'Private limited company',
            public: 'Publicly traded company',
            bank: 'Bank or financial institution',
            other: 'Something else',
          },
        },
      },
      seriesRowLabel: 'Period {n}',
      result: {
        title: 'Corporate tax',
        primaryLabel: 'Tax liability',
        primaryUnit: 'taka',
        empty: 'This calculator starts working when the verified rate table is connected.',
        rows: {
          taxableProfit: 'Taxable profit',
          baseRate: 'Base rate for the class',
          adjustment: 'Conditional adjustment',
          liability: 'Tax liability',
          effectiveRate: 'Effective rate',
        },
      },
      pendingState: {
        title: 'Waiting on the verified rate table',
        body: 'The corporate rate depends on the entity class, on whether certain conditions have been met, and on a threshold set by the Finance Act. Competing official figures are in circulation for the same concept, so there is no responsible way to hardcode one of them into a calculator that presents itself as authoritative.',
        whatWeNeed: 'The current rates by entity class and the conditions attached to each, each dated and attributed to the instrument that sets it.',
      },
      howItWorks: {
        heading: 'How the calculation will work',
        paragraphs: [
          'The base rate follows the entity class — a private company, a listed company, a bank or a financial institution, and a few special classes are each treated differently. Certain rates then carry conditions: a lower rate is available only if specified requirements are met, and where they are not, a higher rate applies. A calculator that knows the class but not the conditions will understate the liability.',
          'The threshold matters as much as the rate. A reduced rate often applies only above or below a turnover threshold, so the same profit taxed at the same headline rate can produce a different liability in two companies of different sizes. That is why the rate table has to be resolved rather than assumed.',
        ],
      },
      examples: {
        heading: 'Worked examples',
        items: [
          {
            title: 'A private limited company',
            body: 'The commonest case: one base rate, with a conditional adjustment where the requirements for a reduced rate have not been met. The effective rate is the liability divided by taxable profit, which will differ from the headline if an adjustment applied.',
          },
          {
            title: 'Where a threshold changes the answer',
            body: 'A company whose turnover sits on the wrong side of a threshold may face a different rate on the same profit as a smaller competitor. Modelling that before the year ends is much cheaper than discovering it at filing.',
          },
        ],
      },
      faqs: {
        heading: 'Common questions',
        items: [
          {
            id: 'ct-why',
            question: 'Why is this calculator not live?',
            answer:
              'Because the corporate rate table cannot be safely typed from memory. The class, the conditions and the threshold all move the answer, competing figures are in circulation for the same threshold, and a wrong rate here is wrong for every user at once.',
          },
          {
            id: 'ct-class',
            question: 'Does a listed company pay a different rate?',
            answer:
              'Yes. Listed and non-listed companies are treated differently, and so are banks and financial institutions. Selecting the wrong class is the most consequential input on this page, which is why it is an explicit choice rather than something inferred.',
          },
        ],
      },
    },

    'cost-efficiency-calculator': {
      name: 'Cost Efficiency Calculator',
      metaTitle: 'Cost Efficiency and Leakage Calculator Bangladesh | DhakaFin',
      metaDescription:
        'Estimate the avoidable cost in your procurement, payroll, utilities, logistics and marketing spend, with a risk score built from how your approvals actually work today.',
      tagline: 'What is escaping, and where the controls are missing.',
      answer:
        'Avoidable cost is the money a business spends that a tighter process would not have spent: paid twice, bought at a price nobody benchmarked, or consumed in a quantity nobody measured. This calculator will give a range by category and a risk score from your own process answers, once the benchmark model behind the ranges is documented and defensible.',
      fields: {
        turnover: { label: 'Annual turnover', hint: 'The scale the avoidable ranges are expressed against.' },
        categorySpend: { label: 'Spend by category', hint: 'Procurement, payroll, utilities, logistics, marketing and other.' },
      },
      seriesRowLabel: 'Category {n}',
      result: {
        title: 'Avoidable cost',
        primaryLabel: 'Estimated avoidable cost',
        primaryUnit: 'taka',
        empty: 'This calculator starts working when the benchmark model is published.',
        rows: {
          low: 'Lower estimate',
          high: 'Upper estimate',
          riskScore: 'Risk score',
          breakdown: 'Largest category',
        },
      },
      pendingState: {
        title: 'Waiting on a benchmark model we can defend',
        body: 'A leakage range is only worth anything if the model behind it is real. Publishing a range we had invented would damage the one thing this tool is worth — the credibility of the number — so the model is being built and documented first, with its sources and its assumptions in the open.',
        whatWeNeed: 'Documented avoidable-cost ranges by category for Bangladeshi businesses, with the method and its limits published alongside the result.',
      },
      howItWorks: {
        heading: 'How the estimate will work',
        paragraphs: [
          'The estimate combines two things: benchmark ranges for avoidable spend by category, and a risk score built from how your processes actually work. The process questions carry most of the weight, because they are evidence rather than assumption — whether approvals are duplicated, whether prices were benchmarked, whether stock is counted, and whether the same invoice can be paid twice.',
          'The result is a range, never a single figure, and it will say so. An honest estimate of leakage in a fifty-crore business is wide, because the true answer depends on transactions nobody has examined yet. A tool that produced a precise-looking number from six inputs would be misrepresenting what it knows.',
        ],
      },
      examples: {
        heading: 'Worked examples',
        items: [
          {
            title: 'A manufacturer buying at list price',
            body: 'Where procurement is unbenchmarked and approvals are duplicated, both the price paid and the volume ordered are unmanaged. The two multiply, which is why procurement is consistently the largest category in a leakage review.',
          },
          {
            title: 'A distributor with no count discipline',
            body: 'Stock that is never counted absorbs loss invisibly, and the loss is proportional to the value held rather than to sales. Inventory accuracy is usually the cheapest control to add and one of the largest sources of recoverable value.',
          },
        ],
      },
      faqs: {
        heading: 'Common questions',
        items: [
          {
            id: 'ce-why',
            question: 'Why is this calculator not live yet?',
            answer:
              'Because the ranges depend on a benchmark model, and a benchmark is worth nothing unless it is defensible. The model is being documented and sourced first — the method, the sample, and its limits — and the calculator is switched on when that exists.',
          },
          {
            id: 'ce-range',
            question: 'Will the result be a single figure?',
            answer:
              'No, and you should be suspicious of any tool that gives you one. Avoidable cost is a range that narrows as transactions are examined. The range is the honest answer, and the review behind our cost-efficiency service is what narrows it.',
          },
        ],
      },
    },
  },
};
