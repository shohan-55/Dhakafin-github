/**
 * English copy for the industry pages — DF-P2-043, blueprint §5.13.1.
 *
 * Two content rules run through every page here.
 *
 * **Nobody knows your industry better than you.** Each page has to demonstrate
 * that in the specific, checkable way — the obligation that applies to this
 * sector and not to businesses in general, the KPI that a trading house watches
 * and a factory does not, the place where this sector's cash characteristically
 * gets stuck. A page that could be re-titled for another industry has failed.
 *
 * **No figure we have not measured.** Formulas are definitional and are
 * published. Benchmark bands require a source, and the note on each page says so
 * where a competitor would print a table. That is not caution for its own sake:
 * a made-up band is the one thing that would make the whole site worthless,
 * because the whole site's proposition is that its numbers can be trusted.
 */

import type { IndustriesDictionary } from '../../content/industry-copy';

export const industries: IndustriesDictionary = {
  meta: {
    title: 'Industries We Serve in Bangladesh',
    metaTitle: 'Industries We Serve in Bangladesh | DhakaFin',
    metaDescription:
      'Accounting and compliance for manufacturing, trading and e-commerce in Bangladesh: what each sector must file, and where its cash characteristically leaks.',
  },

  hero: {
    eyebrow: 'Industries',
    title: 'The same discipline, applied to the way your sector actually loses money.',
    lead: 'A distributor and a factory have different compliance profiles, different cost structures and different places where cash gets stuck. These pages are specific about which, and honest about what we have not measured.',
  },

  rail: {
    heading: 'Three sectors built, eight more commissioned',
    lead: 'Each page is a complete financial profile: the obligations your sector carries, the KPIs it lives by, the risks we look for first, and the services that answer them.',
    liveBadge: 'Live',
    plannedBadge: 'Commissioned',
    plannedNote:
      'These eight are specified and scheduled. We build them in the order the sector requests arrive rather than the order they are listed, so tell us if yours is the one you need.',
    openLabel: 'Read the profile',
  },

  accents: {
    sea: 'Sea green',
    cyan: 'Cyan',
    gold: 'Gold',
  },

  industries: {
    /* ══════════════════════════════════════════════════════════════════════
       Manufacturing
       ══════════════════════════════════════════════════════════════════════ */

    manufacturing: {
      name: 'Manufacturing',
      heroPhrase: 'Manufacturing',
      metaTitle: 'Accounting, Tax, VAT & Cost Control for Manufacturers | DhakaFin',
      metaDescription:
        'Financial services for Bangladeshi manufacturers: VAT and VDS on inputs and sales, conversion cost and yield analysis, inventory controls and factory working capital.',
      promise:
        'Your margin is decided on the shop floor, weeks before it appears in the accounts. We measure conversion cost, yield and inventory where they happen.',
      answer:
        'A manufacturer’s profit is set by three things the accounts show late: what inputs actually cost, how much of each input became sellable output, and how long material and finished goods sit before either moves. DhakaFin handles the VAT, VDS and income tax filings around them, and the cost and inventory controls that determine whether the year was profitable.',

      complianceProfile: {
        heading: 'What applies to you, and why',
        lede: 'Manufacturing carries a wider obligation set than most sectors, and the reason is structural rather than administrative: inputs and outputs are both taxable events, so the position depends on matching them.',
        rows: [
          {
            obligationId: 'vat-return-monthly',
            why: 'Output tax on finished goods and input tax on raw material and packing need to be reconciled in the same return. When the credit is understated because purchases were not documented, the business pays tax it should not owe.',
          },
          {
            obligationId: 'vds-deposit',
            why: 'Contracts for construction, transport and other services are routine in a factory and each carries its own deduction and its own reporting against a supplier registration number.',
          },
          {
            obligationId: 'tds-deposit-monthly',
            why: 'Contractor, professional and rent payments are all normal here, and the deduction basis differs between them. The certificate matters more than the payment, and it is the supplier’s evidence that tax was paid on their account.',
          },
          {
            obligationId: 'income-tax-return',
            why: 'Fixed assets, depreciation method, inventory valuation and work-in-progress all feed the computation, and each is a place where an unexamined policy choice becomes a recurring difference.',
          },
        ],
        noDatesNote:
          'We name the obligation and link you to the source rather than publishing a due date. Rates and deadlines move by SRO, and a date on a web page is how a business misses one.',
      },

      financialDna: {
        heading: 'Where a factory’s money goes',
        lede: 'The profile below is the shape to look for, not a benchmark we have measured. Your own numbers will differ, and the differences are where the money is.',
        structure: [
          { label: 'Raw material and packing', note: 'The largest single cost line in almost every factory, and the one with the widest purchase-price dispersion between suppliers and between months.' },
          { label: 'Conversion cost', note: 'Power, fuel, direct labour and factory overhead. Rises quietly with rework and with machine time lost to changeovers.' },
          { label: 'Depreciation', note: 'Real, fixed and unrelated to volume. A machine that is idle still costs the same per month, which is why utilisation belongs in the management pack.' },
          { label: 'Freight and duty', note: 'Inbound on material, outbound on finished goods. Landed cost accuracy determines whether a product is actually profitable or only appears to be.' },
          { label: 'Selling and administration', note: 'Below the gross margin and usually treated as fixed, which is why a volume collapse hurts so much more than the accounts suggest.' },
        ],
        leakage: [
          'Purchase price variance — the same specification bought at different prices by different people, in the same month.',
          'Yield loss that is recorded as a process norm rather than investigated, usually at a stage nobody owns.',
          'Rework and rejection absorbed into conversion cost, so the loss never appears as a line of its own.',
          'Inventory variance: material issued to production but not accounted for in finished goods or wastage.',
          'Duplicate and off-contract payments, most often on transport, maintenance and consumables.',
        ],
        workingCapital:
          'A factory is long in inventory and short in cash. Raw material has to be bought before production, production happens before sale, and the customer takes credit after that, so the operating cycle is long and every extra day of it is money the business has to find. This is why a growing factory can be profitable and perpetually short of cash at the same time.',
        bandsNote:
          'Proportions are deliberately not published. A benchmark band is a claim about what is normal, and it is only worth printing when it comes from a measured sample with a stated method. The formulas below are definitional and cannot mislead you; the bands will follow the same standard as everything else on this site.',
      },

      kpis: {
        heading: 'The numbers a factory should be managed on',
        lede: 'Six measures, each with its formula. If a number here is not in your monthly pack, that is the finding.',
        items: [
          {
            id: 'material-cost-pct',
            label: 'Material cost %',
            formula: '(opening stock + purchases − closing stock) ÷ net sales × 100',
            meaning:
              'How much of every taka of sales went back out as material. Because it is compared against sales it moves when either price or yield moves, so it needs the two below to explain it.',
            lever:
              'Rises when purchase prices rise without a price pass-through, or when yield falls. Buy-side benchmarking and a monthly price review are cheaper than a price increase.',
          },
          {
            id: 'conversion-cost-per-unit',
            label: 'Conversion cost per unit',
            formula: '(power + fuel + direct labour + factory overhead) ÷ units of sellable output',
            meaning:
              'What it costs to turn inputs into output, per unit that is actually sellable. Dividing by total output instead of sellable output is the common error, and it hides rejection.',
            lever:
              'Falls with utilisation and yield. Changeover time is the usual culprit: fewer, longer runs move this number more than any cost-cutting exercise.',
          },
          {
            id: 'yield',
            label: 'Yield',
            formula: 'sellable output ÷ input consumed × 100',
            meaning:
              'The proportion of each input that survives to become something you can sell. A small movement here is larger in money than most overhead decisions.',
            lever:
              'Investigate by process stage before you investigate by shift. Yield loss concentrated at one stage is a maintenance or a machine-setting answer, not a labour one.',
          },
          {
            id: 'machine-utilisation',
            label: 'Machine utilisation',
            formula: 'machine hours run ÷ machine hours available × 100',
            meaning:
              'How much of the capacity you are paying for is producing. Depreciation and much of factory overhead are fixed, so unused hours are a cost with no output.',
            lever:
              'Improves with order sequencing and planned maintenance. Unplanned downtime is measured separately from idle time, because the fixes are different.',
          },
          {
            id: 'wip-days',
            label: 'Work-in-progress days',
            formula: 'average WIP value ÷ cost of production × 365',
            meaning:
              'How long material sits half-finished. WIP is cash that has been spent and cannot be sold, and it is usually the least-examined number in a factory.',
            lever:
              'Falls with smaller batch sizes and a faster flow between stages. When it rises with sales, the business is buying growth with cash.',
          },
          {
            id: 'inventory-days',
            label: 'Inventory days',
            formula: '(average raw material + WIP + finished goods) ÷ cost of goods sold × 365',
            meaning:
              'The whole holding period from purchase to dispatch. Its composition matters more than its total, and it should be tracked in its three parts rather than as one figure.',
            lever:
              'Falls with supplier lead times and dispatch discipline. Cutting finished goods while extending material holding is a transfer, not an improvement.',
          },
        ],
        bandsNote:
          'We publish the formulas and not the bands. What counts as a good material cost percentage depends on your process, your product mix and your machine base, and a number from another factory would be worse than no number at all. A review measures yours and sets a target from your own history.',
      },

      pains: {
        heading: 'What manufacturers tell us',
        lede: 'Each of these is a sentence we have heard from an owner, and each maps to one of the services below.',
        items: [
          { text: '"We are busy all year and there is nothing left at the end of it."', serviceIndex: 0 },
          { text: '"We know what we paid last year. We do not know whether that was a good price."', serviceIndex: 0 },
          { text: '"The VAT credit was lower than we expected and nobody can tell us why."', serviceIndex: 3 },
          { text: '"Our accounts are four months late, so every decision is made on old numbers."', serviceIndex: 1 },
          { text: '"The auditors raise the same stock point every year and nothing changes."', serviceIndex: 2 },
        ],
      },

      risks: {
        heading: 'What we look for first',
        lede: 'The risks below are the ones that recur across factories. Each has a detection approach, because a risk register without one is a list of worries.',
        items: [
          {
            text: 'Input credit claimed on purchases that cannot be supported by documentation.',
            handling:
              'We reconcile the purchase register against the return rather than the ledger against the return. The gap is almost always in what was filed, not in what was bought.',
          },
          {
            text: 'Inventory counted once a year, so twelve months of variance is discovered at the wrong end of the year.',
            handling:
              'Perpetual records with cycle counts on the highest-value classes. The point is not accuracy for its own sake — it is that a variance found in month two is recoverable and the same variance found in month twelve is a write-off.',
          },
          {
            text: 'Related-party and cash purchases with no arm’s-length evidence of price.',
            handling:
              'A price file per specification, reviewed monthly. No comparison price means no way to tell whether the price was fair, which is a tax exposure before it is a cost problem.',
          },
          {
            text: 'Depreciation and capitalisation policy applied by habit rather than re-examined.',
            handling:
              'We document the policy and the reason for it, then apply it consistently. An undocumented policy is one an assessing officer can reasonably disagree with, and the disagreement is expensive.',
          },
          {
            text: 'Bond, licence and registration conditions tracked in someone’s memory.',
            handling:
              'Every licence, its authority and its condition go into the compliance register alongside the tax obligations, so renewals are a list rather than a recollection.',
          },
        ],
      },

      recommended: {
        heading: 'Where we would start',
        lede: 'Ranked by what usually moves the number fastest in a factory, not by what is easiest to sell.',
        reasons: {
          'cost-efficiency-internal-control':
            'First, because material and conversion cost are where the margin is, and because a leakage review pays for itself before any filing improvement does. It also produces the price file and the yield analysis that everything else depends on.',
          'accounting-bookkeeping':
            'Second, because cost control needs a monthly close that arrives in the month. A four-month lag is not a bookkeeping inconvenience — it removes the possibility of managing anything.',
          'audit-support':
            'Third, because an audit should not be an annual surprise. Preparing the schedules, the policy notes and the stock approach in advance turns it into a confirmation rather than a negotiation.',
          'vat-services':
            'Fourth, because input credit is real money and the documentation that supports it is decided at the point of purchase, not at the point of the return.',
          'internal-control-governance':
            'Fifth, once there is enough volume that the same person cannot sensibly approve a purchase, receive it and pay for it.',
          'virtual-cfo':
            'Sixth, when the business needs a monthly management pack and a view of capacity investment rather than a set of returns.',
        },
      },

      tools: {
        heading: 'Run your own numbers first',
        lede: 'Three calculators, preset for a manufacturing profile. They take two minutes and they will tell you whether a conversation is worth having.',
        presetNote:
          'Preset with a manufacturing-shaped cost structure. Change every field — the presets are a starting shape, not an assumption about you.',
      },

      caseStudy: {
        heading: 'What a review changes',
        challenge:
          'A mid-sized manufacturer with rising sales and falling cash. Material cost as a share of sales had moved against them over three years, and the explanation on offer was purchase price inflation.',
        intervention:
          'We built a price file by specification and found the same grades bought at materially different prices in the same quarter. Yield was measured by process stage for the first time, and the loss concentrated at one stage rather than being spread across the plant.',
        result:
          'The purchase dispersion and the single-stage yield loss were addressed inside one quarter, with the cost of the review recovered from the first month’s purchases. The KPI pack that found it is now the monthly management report.',
        sampleNote:
          'Illustrative scenario, not a client engagement. We publish real case studies only with the client’s written consent, with the measurement period and the method stated. Until then this is labelled as an example — a case study without a footnote is a testimonial.',
      },

      faqs: {
        heading: 'Questions manufacturers ask us',
        items: [
          {
            id: 'mfg-vat-credit',
            question: 'Why is our VAT credit lower than our purchase records suggest?',
            answer:
              'The usual reason is documentation rather than entitlement: input credit needs a valid tax invoice in the business’s name, and a purchase made on a delivery challan or in cash generates no credit no matter how real the transaction was. We reconcile the purchase register against the return to find where the gap is, because it is almost always in what was filed rather than in what was bought.',
          },
          {
            id: 'mfg-cost-first',
            question: 'Where should a factory start if cash is tight?',
            answer:
              'With the price file. Purchase price dispersion is the fastest recoverable money in most factories because the fix is a conversation with an existing supplier rather than a capital decision, and it compounds every month. Yield analysis is second and takes longer to act on but changes more.',
          },
          {
            id: 'mfg-inventory',
            question: 'How often should stock be counted?',
            answer:
              'Continuously, by value class, rather than once a year. The purpose is not the count itself — it is that a variance found in month two is recoverable while the same variance discovered at the year end is a write-off and a qualified opinion. Perpetual records plus cycle counts on the largest classes is the practical middle path.',
          },
          {
            id: 'mfg-accounts-late',
            question: 'Our accounts are always late. Does that matter if the business is profitable?',
            answer:
              'It matters more than most owners expect. Late accounts do not delay the profit — they delay every decision that depends on knowing it, so pricing, purchasing and capacity calls get made on stale information. A monthly close that lands in the following month is the minimum for managing a factory.',
          },
          {
            id: 'mfg-audit',
            question: 'Can you prepare us for the audit rather than just attend it?',
            answer:
              'Yes, and that is the point of the audit-support engagement. We build the schedules, document the accounting policies and their reasons, and agree the stock-count approach before the auditors arrive, so the audit confirms what is already known instead of discovering it.',
          },
        ],
      },

      cta: {
        title: 'Let us look at your cost structure before you commit to anything.',
        body: 'A cost efficiency review takes your purchase and production data and tells you where the margin went. If there is nothing to find, we will tell you that too.',
        primary: 'Book a cost efficiency review',
        magnet: 'Get the manufacturing compliance checklist',
        secondary: 'See all services',
      },
    },

    /* ══════════════════════════════════════════════════════════════════════
       Trading
       ══════════════════════════════════════════════════════════════════════ */

    trading: {
      name: 'Trading and distribution',
      heroPhrase: 'Trading and distribution',
      metaTitle: 'Accounting, Tax & VAT for Trading and Distribution | DhakaFin',
      metaDescription:
        'Accounting and compliance for Bangladeshi trading and distribution businesses: VAT and advance tax on imports, margin per SKU and supplier payment terms.',
      promise:
        'A distributor’s profit is made in the timing between buying and selling. We measure it per SKU, and we keep the returns on time.',
      answer:
        'A trading business earns its margin on the gap between what it pays and what it collects, which means two things decide the year: whether the margin on each product line is real after discounts and returns, and how long the stock and the customer credit hold the cash. DhakaFin keeps the VAT and advance tax filings current and puts a margin number on every line.',

      complianceProfile: {
        heading: 'What applies to you, and why',
        lede: 'In trading the compliance risk is concentrated at two points: the import or purchase entry, and the sale. Everything between them is where the margin lives or leaks.',
        rows: [
          {
            obligationId: 'advance-tax',
            why: 'Advance tax at the import stage is a payment against the year’s liability, and a business that treats it as a duty rather than a credit consistently overestimates what it owes in April.',
          },
          {
            obligationId: 'vat-return-monthly',
            why: 'Output tax on sales against input tax on purchases. In distribution the timing gap between the two is normal, and it is where a return gets prepared wrongly rather than late.',
          },
          {
            obligationId: 'vds-deposit',
            why: 'Transport, warehousing and commission services are routine in a trading operation, and each deduction is reported against the supplier’s registration rather than your own.',
          },
          {
            obligationId: 'income-tax-return',
            why: 'Stock valuation, bad-debt treatment and the deduction of expenses that relate to exempt and taxable supplies in the same business all affect the computation.',
          },
        ],
        noDatesNote:
          'Obligations are named and linked to the authority. We do not print due dates on a page that nobody re-checks, because the cost of a stale date falls entirely on the business that trusted it.',
      },

      financialDna: {
        heading: 'The shape of a trading business',
        lede: 'Thin margins, high turnover and a profit that depends on timing. Below is the structure to look for in your own numbers.',
        structure: [
          { label: 'Cost of goods', note: 'Dominates the profit and loss, typically by a wide margin. One percentage point of purchase price is worth more than any overhead saving available to the business.' },
          { label: 'Freight, duty and clearing', note: 'Landed cost is the number that decides whether a product is profitable, and it is the number most often estimated rather than calculated.' },
          { label: 'Discounts and returns', note: 'Subtracted after the sale in most systems, which is why a gross margin reported before them flatters the line.' },
          { label: 'Warehousing and logistics', note: 'Fixed in the short run and driven by stock levels, so it rises with inventory before it rises with sales.' },
          { label: 'Working capital financing', note: 'The real cost of a trading business, and the one least likely to be attributed to the product lines that caused it.' },
        ],
        leakage: [
          'Purchase price dispersion between suppliers, order sizes and months for the same specification.',
          'Discount and rebate schemes that are granted at the point of sale and reconciled nowhere.',
          'Stock that has been sold, returned and restocked without adjusting the margin on the original sale.',
          'Slow-moving lines occupying warehouse space and financing cost while appearing profitable on paper.',
          'Interest and bank charges treated as a general overhead rather than attributed to the stock that caused them.',
        ],
        workingCapital:
          'Trading is a working-capital business wearing a profit-and-loss disguise. If suppliers give sixty days and customers take sixty, the business funds itself; reverse the two and every taka of extra sales needs cash up front. That single relationship decides whether growth produces cash or consumes it.',
        bandsNote:
          'We publish the structure and not the percentages. A trading margin depends on the category, the territory and the terms, and a published benchmark would be a claim about somebody else’s business presented as a fact about yours.',
      },

      kpis: {
        heading: 'The numbers a trading business lives on',
        lede: 'Six measures. The first two decide whether the business makes money at all; the rest decide how much of it reaches the bank.',
        items: [
          {
            id: 'gross-margin-per-sku',
            label: 'Gross margin per SKU',
            formula: '(net sales − landed cost of goods sold) ÷ net sales × 100, per product line',
            meaning:
              'The margin on each line, after discounts and returns, against the true landed cost. A single blended margin hides the lines that are subsidising the others.',
            lever:
              'Rises by fixing the worst lines rather than by raising every price. Landed cost accuracy comes first, because a line priced off an estimated freight figure is not being managed at all.',
          },
          {
            id: 'inventory-turn',
            label: 'Inventory turn',
            formula: 'cost of goods sold ÷ average inventory value',
            meaning:
              'How many times the stock is replaced in a period. In a low-margin business this, not the margin, is what generates the return on the capital employed.',
            lever:
              'Improves by cutting the slow lines rather than by cutting stock across the board. Cutting the fast lines loses sales; cutting the slow ones releases cash and warehouse space at the same time.',
          },
          {
            id: 'stock-days',
            label: 'Stock days',
            formula: 'average inventory ÷ cost of goods sold × 365',
            meaning:
              'The same fact as turn, expressed in the unit that connects to the cash gap. Tracked by line rather than in total, because the average conceals the problem.',
            lever:
              'Falls with supplier lead times and order frequency. Ordering more often in smaller quantities usually costs less than the financing cost of the stock it removes.',
          },
          {
            id: 'receivable-days',
            label: 'Receivable days',
            formula: 'average receivables ÷ net credit sales × 365',
            meaning:
              'How long customers take to pay, which is the second half of the cash gap. In distribution this is frequently the largest single lever available.',
            lever:
              'Falls with disciplined credit terms and a collection routine that starts on the due date rather than a month after it. Discounts for early payment cost margin, so the arithmetic has to be done before offering them.',
          },
          {
            id: 'payable-days',
            label: 'Payable days',
            formula: 'average payables ÷ cost of goods sold × 365',
            meaning:
              'How long suppliers let you hold their money. Together with stock days and receivable days this gives the cash conversion cycle, which is the number to take to a lender.',
            lever:
              'Rises through negotiated terms rather than through late payment. Paying late costs the early-payment discounts and, eventually, the supply.',
          },
          {
            id: 'realised-margin',
            label: 'Realised margin after returns',
            formula: '(invoiced value − credit notes − returns − landed cost) ÷ net sales × 100',
            meaning:
              'The margin that actually happened, rather than the margin that was quoted. The gap between the two is where return rates and discount leakage appear.',
            lever:
              'Rises by fixing the cause of returns and by approving discounts against a limit rather than case by case. Both are process decisions, not pricing ones.',
          },
        ],
        bandsNote:
          'Formulas only, and the same reason as everywhere else on this site: a credible band needs a measured sample with a stated method. Your own twelve-month history is a better benchmark than anything we could publish, and it is the one we use.',
      },

      pains: {
        heading: 'What trading businesses tell us',
        lede: 'Heard from owners, each mapped to a service below.',
        items: [
          { text: '"Our sales are up and our bank balance is down."', serviceIndex: 0 },
          { text: '"We know our margin overall. We do not know which products are making it."', serviceIndex: 3 },
          { text: '"Every year the VAT return is a guess about what was exempt."', serviceIndex: 2 },
          { text: '"The advance tax and the final liability never seem to agree."', serviceIndex: 1 },
          { text: '"We are holding stock we cannot sell and cannot afford to write off."', serviceIndex: 5 },
        ],
      },

      risks: {
        heading: 'What we look for first',
        lede: 'The recurring risks in a trading operation, with how each is found.',
        items: [
          {
            text: 'A single blended margin reported while individual lines lose money.',
            handling:
              'We rebuild the margin by product line from the sales and purchase registers. The lines that are negative are usually a small minority of the catalogue and a large share of the volume.',
          },
          {
            text: 'Landed cost estimated rather than calculated, so pricing is set on a figure nobody has verified.',
            handling:
              'Every import is costed with its own freight, duty, clearing and demurrage. Only then is the margin on that shipment a fact rather than a belief.',
          },
          {
            text: 'Advance tax and other credits not being claimed or traced.',
            handling:
              'A credit register that follows each payment from the import entry to the return. Unclaimed credit is the most avoidable overpayment in the sector.',
          },
          {
            text: 'Returns and credit notes processed without reversing the original margin.',
            handling:
              'Returns are posted against the original invoice line rather than into a general returns account, so the realised margin stays honest per product.',
          },
          {
            text: 'Stock held for relationships rather than for profit.',
            handling:
              'Ageing by line with the financing cost attributed to it, so a slow-moving line is compared against the cost of the money it occupies rather than against nothing.',
          },
        ],
      },

      recommended: {
        heading: 'Where we would start',
        lede: 'Ranked by what moves a distributor’s cash fastest.',
        reasons: {
          'accounting-bookkeeping':
            'First, because margin by product line and landed cost by shipment require a close that happens monthly and a chart of accounts built for a trading business rather than inherited from a template.',
          'tax-services':
            'Second, because advance tax and the annual computation have to agree, and the reconciliation is a filing task before it is anything else.',
          'vat-services':
            'Third, because a mixed exempt and taxable catalogue is where returns go wrong, and the apportionment method should be decided once rather than argued annually.',
          'financial-advisory':
            'Fourth, when the business is choosing between territories, categories or a credit policy, and the decision has a number attached to it.',
          'corporate-compliance':
            'Fifth, to keep the statutory filings and licences running alongside the tax position rather than in a separate calendar.',
          'virtual-cfo':
            'Sixth, for the monthly pack, the pricing review and the conversation with the bank about the working-capital cycle.',
        },
      },

      tools: {
        heading: 'Run your own numbers first',
        lede: 'Three calculators preset for a distribution profile.',
        presetNote:
          'Preset with a trading-shaped structure. The margin landing near a distribution-typical level is a coincidence of the defaults, not a statement about your business — change the fields.',
      },

      caseStudy: {
        heading: 'What a margin rebuild finds',
        challenge:
          'A distributor with healthy sales growth and no cash. The blended gross margin looked stable, and the explanation offered was the cost of financing growth.',
        intervention:
          'Rebuilding margin by product line showed a large minority of lines at or below landed cost, concentrated in the slow-moving catalogue the business held for supplier relationships. Working capital was attributed to each line through stock days and financing cost.',
        result:
          'The catalogue was rationalised and the financing cost was priced into the terms on the lines that remained. Cash released from the slow lines funded the fast ones without new borrowing.',
        sampleNote:
          'Illustrative scenario, not a client engagement. Real case studies are published only with written consent and a stated measurement period.',
      },

      faqs: {
        heading: 'Questions trading businesses ask us',
        items: [
          {
            id: 'trade-margin',
            question: 'Our overall margin looks fine. Why should we look at it by product?',
            answer:
              'Because a blended margin is an average, and an average is the one number that cannot tell you which part of the business is failing. In most distribution catalogues a small minority of lines are at or below landed cost while carrying a meaningful share of the volume, and they are invisible until the margin is rebuilt line by line.',
          },
          {
            id: 'trade-cash',
            question: 'Sales are growing but cash is shrinking. What is happening?',
            answer:
              'Growth consumes cash when the cash conversion cycle is positive. If you pay suppliers before customers pay you, every additional taka of sales needs a taka of funding first. This is normal and it is manageable, but it has to be forecast rather than discovered, which is what the cash flow and working capital tools are for.',
          },
          {
            id: 'trade-advance',
            question: 'How does advance tax at import affect our year-end position?',
            answer:
              'It is a payment against your liability for the year, not a separate cost, so it should be tracked as credit from the moment the import entry is filed. The common failure is treating it as a duty and then being surprised by a large final instalment that ignores what has already been paid.',
          },
          {
            id: 'trade-returns',
            question: 'How should returns be recorded so margin stays honest?',
            answer:
              'Against the original invoice line rather than into a general returns account. Posting returns to a bucket hides which products are coming back and why, so the return rate never becomes a managed number and the margin on the original sale stays overstated.',
          },
          {
            id: 'trade-exempt',
            question: 'We sell both taxable and exempt items. Does that complicate VAT?',
            answer:
              'It does, because input tax has to be attributed or apportioned between the two, and the method has to be defensible and applied consistently. Deciding the method once, documenting it, and applying it every period is considerably cheaper than re-arguing it each return.',
          },
        ],
      },

      cta: {
        title: 'Let us rebuild your margin line by line.',
        body: 'We take your sales and purchase registers and tell you which lines are making money and which are being carried. Most distributors find the answer uncomfortable and then act on it within the quarter.',
        primary: 'Book a margin review',
        magnet: 'Get the trading compliance checklist',
        secondary: 'See all services',
      },
    },

    /* ══════════════════════════════════════════════════════════════════════
       E-commerce
       ══════════════════════════════════════════════════════════════════════ */

    ecommerce: {
      name: 'E-commerce',
      heroPhrase: 'E-commerce',
      metaTitle: 'Accounting, VAT & Unit Economics for E-commerce | DhakaFin',
      metaDescription:
        'Financial services for Bangladeshi e-commerce businesses: BIN registration and VAT on online sales, contribution margin per order, return rates and inventory funding.',
      promise:
        'Revenue is not the number. Contribution per delivered order is, and we build the accounts around it.',
      answer:
        'An online business can grow revenue every month and lose money on every order, because the costs that decide profitability arrive after the sale — delivery, return, payment fees and the marketing that produced it. DhakaFin handles the VAT and registration side and builds the unit economics that show whether growth is producing profit or absorbing it.',

      complianceProfile: {
        heading: 'What applies to you, and why',
        lede: 'E-commerce in Bangladesh is a small-trader obligation set with an unusually high transaction count, which changes both the risk and the effort.',
        rows: [
          {
            obligationId: 'bin-registration',
            why: 'Selling online at any meaningful volume brings you within the registration regime, and the threshold that triggers it depends on your turnover and your model rather than on being online.',
          },
          {
            obligationId: 'vat-return-monthly',
            why: 'The return has to be assembled from a very large number of small transactions, most of them through a marketplace that issues its own documentation. Getting the feed right once is the difference between a mechanical filing and a monthly reconstruction.',
          },
          {
            obligationId: 'vds-deposit',
            why: 'Delivery, packaging, warehousing and digital services are all supplied to you rather than by you, and each carries its own deduction and reporting requirement.',
          },
          {
            obligationId: 'income-tax-return',
            why: 'Marketing spend, return provisioning, platform fees and inventory write-downs all feed the computation. A business that does not provision for returns overstates profit and pays tax on revenue it never kept.',
          },
        ],
        noDatesNote:
          'Obligations are named and linked to the authority. The registration trigger in particular is a figure that moves, so we point you at the source rather than printing a threshold here.',
      },

      financialDna: {
        heading: 'Where online revenue actually goes',
        lede: 'The structure below is the sequence to reconcile: revenue, then everything that has to be paid before an order contributes anything.',
        structure: [
          { label: 'Cost of goods', note: 'The product plus inbound freight and packaging. Frequently calculated at list cost, which ignores the purchase terms that actually apply at volume.' },
          { label: 'Delivery and returns', note: 'Both legs of a failed order — outbound delivery and the return. A returned order can cost more than the margin it would have earned.' },
          { label: 'Payment collection', note: 'Cash-on-delivery handling, gateway fees and the cost of the float between dispatch and settlement.' },
          { label: 'Acquisition cost', note: 'Marketing divided by the orders that were actually completed, not by the orders that were placed.' },
          { label: 'Platform and marketplace fees', note: 'Commission, storage and fulfilment charges, usually deducted before the payout so the gross figure in the dashboard is not the revenue.' },
        ],
        leakage: [
          'Returned orders carrying two delivery legs, a repackaging cost and a lost acquisition cost that is never reattributed.',
          'Cash-on-delivery reconciliation differences between the courier report and the bank.',
          'Marketing measured on placed orders rather than delivered ones, which overstates the return on the spend by the return rate.',
          'Dead stock bought on a trend, held through a season and written down without being traced back to the decision that caused it.',
          'Discount codes and free delivery granted without a margin floor, so the promotion sells at a loss at the volume stage rather than at the margin stage.',
        ],
        workingCapital:
          'E-commerce pays for stock up front, pays for delivery on dispatch and collects either on delivery or on a settlement cycle from the gateway. The result is a business that grows its way into a cash hole unless the return rate and the settlement lag are modelled before the marketing budget is set.',
        bandsNote:
          'The structure is published and the percentages are not. A contribution margin that is healthy for one category is fatal for another, so a published band would mislead more often than it helped.',
      },

      kpis: {
        heading: 'The numbers an online business should be run on',
        lede: 'Six measures, in the order they determine whether the business makes money.',
        items: [
          {
            id: 'contribution-per-order',
            label: 'Contribution per delivered order',
            formula: '(net revenue − cost of goods − delivery both legs − payment fees − variable platform fees) per delivered order',
            meaning:
              'What one successfully completed order leaves before marketing and overheads. If this is negative and marketing is on top, growth makes the loss larger.',
            lever:
              'Rises by fixing the return rate and the delivery cost per order before touching price. A price change to compensate for returns perpetuates the return problem and prices out the customers who do not return anything.',
          },
          {
            id: 'return-rate',
            label: 'Return and cancellation rate',
            formula: '(orders returned + orders cancelled) ÷ orders placed × 100',
            meaning:
              'The proportion of demand that generated cost without generating revenue. It belongs on the front page of the management pack, not in a warehouse report.',
            lever:
              'Falls with product information accuracy and delivery-window reliability. Measuring the rate by product and by courier separates a listing problem from a delivery problem.',
          },
          {
            id: 'cac-per-delivered',
            label: 'Acquisition cost per delivered order',
            formula: 'marketing spend ÷ delivered orders (not placed orders)',
            meaning:
              'What it costs to acquire a customer who actually kept the order. Dividing by placed orders flatters the number by exactly the return rate.',
            lever:
              'Falls by stopping spend on the channels whose orders return. The channel with the lowest cost per placed order is frequently not the channel with the lowest cost per delivered order.',
          },
          {
            id: 'delivered-aov',
            label: 'Net AOV after returns',
            formula: 'net revenue (after returns, discounts and fees) ÷ delivered orders',
            meaning:
              'The average value that survived, rather than the basket size that was placed. Bundling raises the placed figure and does not necessarily raise this one.',
            lever:
              'Rises with product mix and margin discipline rather than with discounting. A discount raises units and lowers this figure at the same time.',
          },
          {
            id: 'inventory-days-online',
            label: 'Inventory days',
            formula: 'average inventory ÷ cost of goods sold × 365',
            meaning:
              'How long stock is held, which in online retail is driven by assortment breadth as much as by demand. The long tail of a catalogue is where this number goes wrong.',
            lever:
              'Falls by trimming the tail rather than by cutting the range. The lines removed release cash and warehouse space immediately, which is why it is usually the quickest working-capital fix available.',
          },
          {
            id: 'cash-conversion-online',
            label: 'Cash conversion cycle',
            formula: 'inventory days + settlement lag − payable days',
            meaning:
              'The real funding requirement. The settlement lag between dispatch and payout is the element that a growing online business most often fails to model.',
            lever:
              'Falls with faster settlement, negotiated supplier terms and a shorter holding period. Growth without this number forecast is the mechanism by which profitable e-commerce businesses fail.',
          },
        ],
        bandsNote:
          'Formulas, not bands. Online unit economics vary so widely between categories that a published range would be misleading, and your own category history is a better benchmark than anything we could print.',
      },

      pains: {
        heading: 'What online businesses tell us',
        lede: 'Heard from founders and finance leads, each mapped to a service below.',
        items: [
          { text: '"Revenue is growing every month and we cannot explain where the money goes."', serviceIndex: 0 },
          { text: '"Our returns are killing us but we do not know which products cause them."', serviceIndex: 2 },
          { text: '"The marketplace payout never matches what we expected."', serviceIndex: 0 },
          { text: '"We are not sure whether we needed to register for VAT, and now there is a backlog."', serviceIndex: 1 },
          { text: '"Every season we buy stock, and every season some of it does not sell."', serviceIndex: 3 },
        ],
      },

      risks: {
        heading: 'What we look for first',
        lede: 'The risks that recur across online businesses, with the approach that finds each.',
        items: [
          {
            text: 'Growing revenue on negative contribution, financed by supplier credit that will not extend.',
            handling:
              'We compute contribution per delivered order before anything else and put it next to the growth rate. A negative contribution with growth is a countdown, and it is much cheaper to find at the start of the quarter than at the end.',
          },
          {
            text: 'VAT returns assembled by hand from marketplace reports with no reconciliation to the bank.',
            handling:
              'Marketplace payout reports and courier remittances are reconciled to the bank monthly, so the return is built from a reconciled schedule rather than reconstructed from downloads.',
          },
          {
            text: 'Return liability recognised when the parcel arrives, not when the sale is recorded.',
            handling:
              'A provision based on the observed return rate by category, with the rate reviewed monthly. Without it, reported profit includes revenue that will be refunded.',
          },
          {
            text: 'Marketing attributed to orders that were never delivered.',
            handling:
              'Acquisition cost is computed on delivered orders, which changes both the figure and the decision about which channel to fund.',
          },
          {
            text: 'Dead stock written down at the point it is discarded, so the decision that caused it is never identified.',
            handling:
              'Ageing by product with the original buying decision attached. The purpose is to make the next buying season a decision rather than a repeat.',
          },
        ],
      },

      recommended: {
        heading: 'Where we would start',
        lede: 'Ranked by what usually fixes an online business’s economics fastest.',
        reasons: {
          'vat-services':
            'First, when the registration position is uncertain or a backlog has built. It is the obligation that grows more expensive with time, and the sooner the position is established the smaller the exposure.',
          'accounting-bookkeeping':
            'Second, because unit economics need revenue and cost captured per order, and a chart of accounts built for online selling rather than inherited from retail.',
          'cost-efficiency-internal-control':
            'Third, because the two largest recoverable amounts in most online businesses are the return rate and the stock tail, and both need to be measured before they can be fixed.',
          'financial-advisory':
            'Fourth, when the business is deciding between markets, categories or a funding round and the decision needs a model rather than a dashboard.',
          'corporate-compliance':
            'Fifth, to keep the statutory filings and the trade licence consistent with the registrations you actually hold.',
          'virtual-cfo':
            'Sixth, for a monthly pack that leads with contribution rather than revenue, and a view of how much growth the cash supports.',
        },
      },

      tools: {
        heading: 'Run your own numbers first',
        lede: 'Three calculators preset for an online retail profile.',
        presetNote:
          'Preset with an online-retail shape. The defaults are a starting point, not an estimate of your business — the return rate in particular changes the answer more than any other field.',
      },

      caseStudy: {
        heading: 'What a unit economics rebuild finds',
        challenge:
          'An online retailer doubling revenue year on year while cash fell. The dashboard showed a healthy gross margin and the founder’s explanation was the cost of growth.',
        intervention:
          'We computed contribution per delivered order and found it negative on a large share of volume. The cause was not the product margin but the acquisition cost being measured on placed orders while a meaningful proportion were returned, each carrying two delivery legs.',
        result:
          'Spend was paused on the channels with the worst delivered-cost ratio and the return-heavy lines were re-listed with accurate information. Contribution turned positive while revenue growth continued at a lower rate, and the business stopped consuming cash to grow.',
        sampleNote:
          'Illustrative scenario, not a client engagement. Real case studies are published only with written consent and a stated measurement period.',
      },

      faqs: {
        heading: 'Questions online businesses ask us',
        items: [
          {
            id: 'ec-contribution',
            question: 'Why is contribution per order more useful than the gross margin on my dashboard?',
            answer:
              'Because the dashboard usually stops at cost of goods, while the costs that decide whether an order made money — delivery, the return leg, payment fees and the acquisition cost that produced it — arrive later. Contribution per delivered order includes them, and it is the only figure that tells you whether growth is producing profit or absorbing it.',
          },
          {
            id: 'ec-registration',
            question: 'Do we need VAT registration if we sell online?',
            answer:
              'Selling online does not by itself decide it; turnover and the nature of what you sell do, and the threshold moves by SRO. The practical answer is to establish the position now rather than later, because an unregistered period is a liability that grows with every month you trade through it.',
          },
          {
            id: 'ec-cod',
            question: 'Our cash-on-delivery reconciliation never balances. Is that normal?',
            answer:
              'Timing differences are normal; unexplained differences are not. The two things worth separating are remittances that are in transit on the reporting date and genuine shortfalls, and the only way to do that is to reconcile the courier report to the bank line by line rather than in total.',
          },
          {
            id: 'ec-returns',
            question: 'Should we provision for returns in the accounts?',
            answer:
              'Yes, if you want the reported profit to be true. Without a provision based on your observed return rate by category, revenue includes orders that will be refunded and tax may be paid on money that never stayed. The rate should be reviewed monthly rather than set once.',
          },
          {
            id: 'ec-growth',
            question: 'We are profitable. Why is cash always tight?',
            answer:
              'Because profitable and cash-generative are different conditions when the cash conversion cycle is positive. You buy stock before you sell it, pay to deliver it before you collect, and then wait for settlement — so growth needs funding up front. It is manageable, but only if the funding requirement is forecast rather than discovered.',
          },
        ],
      },

      cta: {
        title: 'Let us find out whether your growth is profitable.',
        body: 'We take your order, courier and marketplace data and build contribution per delivered order. Most online businesses find the answer changes where they spend next month.',
        primary: 'Book a unit economics review',
        magnet: 'Get the e-commerce VAT checklist',
        secondary: 'See all services',
      },
    },
  },
};
