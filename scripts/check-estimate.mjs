#!/usr/bin/env node
/**
 * Cost-efficiency disclosure gate  ·  DF-P2-044
 * ---------------------------------------------------------------------------
 * Blueprint §5.9.4 criterion 1: "Estimator outputs a range with a method
 * disclosure; no single 'you will save ৳X' claims — verified by copy review + a
 * test that asserts the disclosure element exists."
 *
 * Copy review is a human activity and it decays: the reviewer who signed off on
 * this page will not read the next edit to it. So the criterion is enforced from
 * the emitted HTML instead, on every build, in both locales — the same way the
 * metadata and link gates work, and for the same reason. A disclosure that lives
 * only in a component's props, behind a conditional, or in one language is not a
 * disclosure.
 *
 * WHAT IT CHECKS
 *   1. The method-and-limitations block reached the HTML, in both locales.
 *   2. That block has content, not just a wrapper element.
 *   3. The withhold statement is present — the page must say why there is no
 *      savings figure, not merely omit one.
 *   4. All five leakage surfaces are named on the page. §5.9.4 criterion 2 asks
 *      for each of them to carry a name, a question, a range status, an example
 *      and a policy note; this gate verifies they are present at all, and the
 *      dictionary type makes the other four fields impossible to omit.
 *   5. The unpublished-rows ledger is rendered (20 rows: 5 surfaces × 4 industry
 *      choices), because "we don't have the data" is only honest if the reader
 *      can see the size of the hole.
 *   6. No savings-promise phrasing appears on the page in either language.
 *
 * Runs after `next build`. It has nothing to read before that.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const SERVER_APP = join(ROOT, 'apps', 'web', '.next', 'server', 'app');

if (!existsSync(SERVER_APP)) {
  console.error('  ✗ cost-efficiency gate: no build output. Run `npm run build` first.');
  process.exit(1);
}

const LOCALES = ['en', 'bn'];

/** Per-locale expectations. Both locales carry the same obligations. */
const EXPECT = {
  en: {
    disclosureBody: 'This estimator does not promise savings',
    withheld: 'Why there is no savings figure here',
    status: 'Not published',
    methodHeading: 'How this was calculated',
    pillars: [
      'Purchase price variance',
      'Supplier dependency',
      'Expense leakage',
      'Inventory variance',
      'Payment controls',
    ],
  },
  bn: {
    disclosureBody: 'এই যন্ত্র কোনো সাশ্রয়ের প্রতিশ্রুতি দেয় না',
    withheld: 'এখানে সাশ্রয়ের কোনো সংখ্যা নেই কেন',
    status: 'প্রকাশিত নয়',
    methodHeading: 'এটি কীভাবে হিসাব করা হলো',
    pillars: ['ক্রয়মূল্যের পার্থক্য', 'সরবরাহকারী-নির্ভরতা', 'ব্যয়ের ক্ষরণ', 'মজুতের পার্থক্য', 'পেমেন্ট নিয়ন্ত্রণ'],
  },
};

/**
 * Phrasings that would turn this page into a promise. Checked against the visible
 * text, so a claim cannot hide in a heading, a caption or an aria-label.
 *
 * Scripts are stripped first, and that detail matters. The React Server Component
 * payload embedded in every page carries the dictionary fragments that client
 * components receive — including, on this site, the service FAQ that *asks* "Do
 * you guarantee savings?" in order to answer "No". Matching on the raw document
 * flagged that rebuttal as a claim in both languages. A reader does not see the
 * flight payload; a gate should not read it either.
 */
const FORBIDDEN = [
  /you will save/i,
  /guaranteed savings?/i,
  /we guarantee/i,
  /save up to/i,
  /typical savings of/i,
  /আপনি সাশ্রয় করবেন/,
  /নিশ্চিত সাশ্রয়/,
  /গ্যারান্টি/,
];

/** Visible text only: the payload and the styles are not what a reader reads. */
const visible = (html) =>
  html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ');

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));

const errors = [];
const notes = [];

for (const locale of LOCALES) {
  const file = join(SERVER_APP, `${locale}`, 'cost-efficiency.html');
  if (!existsSync(file)) {
    errors.push(`/${locale}/cost-efficiency — page not built`);
    continue;
  }

  const html = decode(visible(readFileSync(file, 'utf8')));
  const expect = EXPECT[locale];

  // 1–2. The disclosure element, and that it is not empty.
  const marker = `data-df-disclosure="cost-efficiency"`;
  const at = html.indexOf(marker);
  if (at === -1) {
    errors.push(`/${locale}/cost-efficiency — no ${marker} element`);
  } else {
    const block = html.slice(at, at + 4000);
    const text = block.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length < 200) {
      errors.push(`/${locale}/cost-efficiency — disclosure element is effectively empty`);
    }
  }

  // 3. The page says why the range is absent.
  if (!html.includes(expect.withheld)) {
    errors.push(`/${locale}/cost-efficiency — missing the withhold statement`);
  }

  // 3b. The disclosure copy itself must be in the document.
  if (!html.includes(expect.disclosureBody)) {
    errors.push(`/${locale}/cost-efficiency — disclosure body text missing`);
  }

  // 4. All five surfaces named.
  const missing = expect.pillars.filter((pillar) => !html.includes(pillar));
  if (missing.length) {
    errors.push(`/${locale}/cost-efficiency — surface(s) not rendered: ${missing.join(', ')}`);
  }

  // 5. The ledger of unpublished rows.
  if (!html.includes(expect.methodHeading)) {
    errors.push(`/${locale}/cost-efficiency — method table heading missing`);
  }
  const rowCount = (html.match(new RegExp(expect.status, 'g')) ?? []).length;
  if (rowCount < 20) {
    errors.push(
      `/${locale}/cost-efficiency — expected at least 20 unpublished rows (5 surfaces × 4 industries), found ${rowCount}`,
    );
  }

  // 6. No savings promise, anywhere in the document.
  for (const pattern of FORBIDDEN) {
    const hit = html.match(pattern);
    if (hit) errors.push(`/${locale}/cost-efficiency — forbidden savings claim: "${hit[0]}"`);
  }

  notes.push(`/${locale}/cost-efficiency — disclosure present · ${rowCount} unpublished rows`);
}

console.log('\n  Cost-efficiency disclosure  ·  no savings figure without a sample');
console.log('  ' + '─'.repeat(74));
for (const note of notes) console.log(`  ✓ ${note}`);

if (errors.length) {
  console.log('');
  for (const error of errors) console.log(`  ✗ ${error}`);
  console.error(`\n  Disclosure gate FAILED with ${errors.length} error(s).\n`);
  process.exit(1);
}

console.log('\n  ✓ disclosure, withhold statement and method ledger present in both locales;');
console.log('    no savings claim found on the page.\n');
