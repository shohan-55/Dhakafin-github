import type { EditorialCopy } from '../../content/editorial-copy';

/**
 * English copy — /editorial-policy (DF-P2-025).
 *
 * Everything here is a statement about how this practice works, so it is written
 * to be falsifiable: each commitment names what would count as breaking it. The
 * one place the page describes the future rather than the present — the rate
 * service — says so in the first sentence rather than the last.
 */
export const editorial: EditorialCopy = {
  meta: {
    title: 'Editorial policy',
    metaTitle: 'Editorial policy — who writes, who verifies and how we correct errors',
    metaDescription:
      'How DhakaFin sources a figure, who reviews it before publication, what our dates mean, where AI is allowed to help, and how a correction reaches the page.',
  },

  hero: {
    eyebrow: 'Editorial policy',
    title: 'How a number earns its place here.',
    lede: 'This page is the rulebook behind every figure, rate and recommendation on this site: who writes it, who checks it, what we refuse to publish, and what happens when we get something wrong.',
    note: 'The short version: a regulatory figure is published with its source or it is not published at all.',
  },

  sections: {
    'source-rule': {
      title: 'Where a number comes from',
      lede: 'Every regulatory figure carries its provenance, or it does not go on the page.',
      body: [
        'A rate, slab, threshold or deadline is entered by a specialist against the primary source, cross-checked by a second person, and published with the seven items below attached. Nothing is typed from memory, and nothing is typed by the person who most wants the page to look finished.',
        'Today that rule has a visible consequence: no rate is published on this site yet. The rate service is still being built, so every rate-dependent tool asks you for the figure printed on your own document and labels the result “as entered”. That is a different claim from “per NBR”, and we do not blur the two.',
        'A figure we cannot attribute is a liability to the person who relies on it. Where a source is missing we publish the gap instead — a designed state that says what is missing, what we are waiting for, and when it will be checked. Never a plausible-looking number with a footnote nobody reads.',
      ],
    },
    'who-publishes': {
      title: 'Who writes, and who verifies',
      lede: 'No page appears without a named author and, wherever it states a statutory fact, a named reviewer.',
      body: [
        'Authorship here means accountability, not credit. The person who writes a page is the person who answers for its wording; the reviewer is the person who answers for its facts, and their name and the review date are printed on the page.',
        'The two are never the same person when a statutory figure is involved, and neither of them is allowed to publish outside their own area. A reviewer may reject a page and stop it publishing; the person who needs it for a campaign cannot overrule that.',
      ],
    },
    pipeline: {
      title: 'How a page gets published',
      lede: 'Five stages, in order. A page that skips one does not ship.',
      body: [
        'The order is the point. Sourcing happens before review because a reviewer should never be the first person to look for the source, and the second verification happens before publication because “I checked it” and “someone else checked my check” are not the same sentence.',
      ],
    },
    dates: {
      title: 'Why every page carries dates',
      lede: 'A date is the cheapest form of honesty a publishing operation can offer.',
      body: [
        'Three dates matter: when the page was published, when it was last reviewed against its sources, and when it is due to be reviewed again. The first two are shown to you; the third is a work queue we hold ourselves to.',
        '“Reviewed” has a specific meaning here: someone with the relevant qualification read the page against the primary source on that date. It does not mean spell-checked, and it does not mean the page was opened and closed. Where a fact changes between reviews, the page is corrected immediately and the change is recorded in the log below.',
      ],
    },
    'artificial-intelligence': {
      title: 'How we use AI, in plain terms',
      lede: 'AI is allowed to help us write. It is not allowed to decide what is true.',
      body: [
        'A language model is good at structure, tone and the mechanical first pass of a translation, and it is confident about statutory facts in a way that has nothing to do with being right. So it may draft and summarise, and a qualified person checks every result against the primary source before anything is published. The person whose name is on the page is responsible for the page, whether or not a model helped write it.',
      ],
    },
    corrections: {
      title: 'When we get something wrong',
      lede: 'We publish corrections, and we publish them where the error was.',
      body: [
        'Tell us the page and what looks wrong. You will get an acknowledgement within one working day, and a corrected page within three — including when the correction is that we were wrong and you were right.',
        'Corrections are not quietly edited in. A corrected figure keeps its new source and date, and the change appears in the log below with the date it was made. Deleting the evidence that a page ever said something else is the kind of tidiness that costs a reader their trust.',
      ],
    },
    refusals: {
      title: 'What we will not publish',
      lede: 'Five things we are asked for often and decline every time.',
      body: [
        'Each of these would be easy, and each would work — right up to the moment someone relied on it.',
      ],
    },
  },

  sourceAnatomy: {
    heading: 'What every published figure carries',
    intro: 'Seven fields. A figure missing any of them cannot be displayed by the components that render it.',
    items: [
      { label: 'Provision', what: 'The section, rule or article the figure comes from.' },
      { label: 'Instrument', what: 'The notification, SRO or circular that set or changed it, by number.' },
      { label: 'Effective date', what: 'The date the figure started to apply — not the date it was announced.' },
      { label: 'Source link', what: 'Where we read it, so you can read it too.' },
      { label: 'Checked on', what: 'The date the figure was last compared against that source.' },
      { label: 'Verified by', what: 'The named person accountable for the figure being right.' },
      { label: 'Supersedes', what: 'The earlier figure it replaced, where there was one.' },
    ],
    footnote: 'The components enforce this rather than trusting it: a rate card cannot render without its reference, source link, verification date and verifier.',
  },

  rolesAccountableLabel: 'Accountable for',
  rolesCannotLabel: 'Cannot',

  roles: {
    'content-editor': {
      title: 'Content editor',
      accountable: 'Everything published: the words, the structure, the metadata, the translation, and the review queue that keeps pages from going stale.',
      cannot: 'Publish a statutory figure that has not been verified by the specialist responsible for it.',
    },
    'tax-compliance-lead': {
      title: 'Tax & compliance lead',
      accountable: 'Every rate, slab, threshold, deadline and form number on the site, and the verification signature that releases each one.',
      cannot: 'Publish marketing copy, change pricing, or approve their own edit to a figure they entered.',
    },
    'service-delivery-lead': {
      title: 'Service delivery lead',
      accountable: 'That service pages describe the service that is actually delivered — scope, exclusions, deliverables and turnaround.',
      cannot: 'Rewrite a regulatory figure, or commit the practice to a scope it does not staff.',
    },
    'client-partner': {
      title: 'Client partner',
      accountable: 'Client-facing claims: results, comparisons, and anything that says what an engagement achieved.',
      cannot: 'Publish a client result without the client’s written consent and the measurement method behind it.',
    },
  },

  pipelineCaption: 'The five stages every page passes through, in order.',

  pipeline: {
    drafted: {
      title: 'Drafted',
      body: 'An author writes the page against a fact list rather than from memory. Every figure in the draft is marked with the source it came from, even if that source is “needs checking”.',
    },
    sourced: {
      title: 'Sourced',
      body: 'The author attaches the primary source for each figure — the notification, the SRO, the form — and the effective date. An unattached figure stops the page here rather than later.',
    },
    'specialist-review': {
      title: 'Specialist review',
      body: 'The specialist who owns that subject reads the page against the sources, not against the draft. They can send it back, and on a statutory figure they usually do.',
    },
    'second-verification': {
      title: 'Second verification',
      body: 'A second qualified person confirms the figures independently. This is the step that turns “checked” into “verifiable”, and it is the reason a rate change cannot be published by one person.',
    },
    published: {
      title: 'Published, with a review date',
      body: 'The page goes live with its author, reviewer and review date, and enters a queue. When the queue reaches it, or when a source changes, it comes back through the same five stages.',
    },
  },

  ai: {
    mayHeading: 'AI may',
    mayItems: [
      'Draft structure, headings and first-pass copy for a human to rewrite',
      'Produce a first-pass Bengali translation that a Bengali speaker then corrects',
      'Summarise a long source document so a specialist can check the summary against the original',
      'Flag copy that has drifted into jargon or passive constructions',
    ],
    mayNotHeading: 'AI may not',
    mayNotItems: [
      'Decide a rate, slab, threshold, deadline, penalty or form number',
      'Review its own output in place of the specialist who owns the subject',
      'Publish anything — a person publishes, and that person’s name is on the page',
      'Supply a statutory fact that no primary source behind it can support',
    ],
  },

  corrections: {
    slaLabel: 'Correction service level',
    slaBody: 'A report is acknowledged within one working day and a corrected page is live within three. If a figure is wrong and you are waiting on a filing, say so and it jumps the queue.',
    logHeading: 'Correction log',
    logEmpty:
      'No corrections have been published yet. This log starts empty and stays empty only for as long as nothing on the site has been corrected — an entry appears here whenever a published fact changes.',
    logColumns: { date: 'Date', page: 'Page', what: 'What changed', verifiedBy: 'Verified by' },
    reportLabel: 'Report an error',
    reportBody: 'Send the page, what it says, and what you believe it should say. A source with your report saves everyone a day.',
    reportCta: 'Report an error',
  },

  refusals: {
    'rate-without-source': {
      title: 'A rate without its source',
      body: 'If we cannot point to the instrument and the date it took effect, the figure does not go up — even when every other page online repeats it. Three different official figures circulate for some of these thresholds; publishing one of them as settled would be worse than publishing nothing.',
    },
    'estimate-around-a-gap': {
      title: 'A guess dressed as an estimate',
      body: 'When a rate is missing, the tool stops and says so. It does not interpolate, it does not carry last year forward, and it does not average two nearby figures to look complete.',
    },
    'saving-without-a-sample': {
      title: 'A saving without a sample',
      body: 'We do not publish a cost-efficiency range until it is built on a client’s own spend data. An illustrative percentage that nobody measured is the most expensive kind of free advice.',
    },
    'guaranteed-saving': {
      title: 'A guarantee we cannot fund',
      body: 'No reduction, refund or saving is ours to guarantee — it belongs to the tax authority, the process or the client’s own operations. We state what the analysis showed and what we would do next, and we leave the promise out.',
    },
    'paid-ranking': {
      title: 'A ranking we were paid to move',
      body: 'No page here is sponsored, no tool carries paid placement, and no rate sits behind an email address. Where money changes hands it is for work, stated in an engagement letter.',
    },
  },

  cta: {
    title: 'Found something that does not hold up?',
    body: 'Tell us the page and what you expected to see. A correction is cheaper for us than a wrong figure is for you.',
    primaryLabel: 'Report an error',
    secondaryLabel: 'See how we price',
  },
};
