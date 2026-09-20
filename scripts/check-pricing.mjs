#!/usr/bin/env node
/**
 * Pricing agreement gate  ·  DF-P2-025
 * ---------------------------------------------------------------------------
 * F3's acceptance criterion for `/pricing` is one sentence: *prices visible (no
 * "call us" for standard tiers)*. Visibility is easy to satisfy and easy to lose:
 * a band edited in the service dictionary while `/pricing` keeps a hardcoded
 * figure renders two different prices, and neither page looks wrong.
 *
 * So this gate reads the published band strings out of the dictionaries — the
 * same source the service pages render from — and proves, against the emitted
 * HTML, that:
 *
 *   1. Every one of the nine bands reached `/pricing` in both locales, as text.
 *   2. The English and Bengali bands carry the same figure, so a reader is not
 *      quoted differently for switching language.
 *   3. The `Offer` structured data exists, has exactly nine offers, and each
 *      offer's `minPrice` equals the band printed on the page. Structured data
 *      that disagrees with the visible figure is worse than none at all.
 *   4. The platform tiers are absent from structured data. They are design
 *      targets for a product that cannot be bought yet (§1.5 finalises platform
 *      pricing in Phase 5), and feeding them to a search engine as offers would
 *      turn a plan into a claim.
 *   5. The page states its VAT position in both locales, and the annual column is
 *      described as arithmetic rather than as a saving.
 *
 * Runs after `next build`. Before that there is nothing to read.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const WEB = join(ROOT, 'apps', 'web');
const SERVER_APP = join(WEB, '.next', 'server', 'app');

if (!existsSync(SERVER_APP)) {
  console.error('  ✗ pricing gate: no build output. Run `npm run build` first.');
  process.exit(1);
}

const LOCALES = ['en', 'bn'];
const toLatinDigits = (text) => text.replace(/[\u09e6-\u09ef]/g, (d) => String(d.charCodeAt(0) - 0x09e6));
const digitsOf = (band) => {
  const match = toLatinDigits(band).match(/([\d,]{3,})/);
  return match ? Number(match[1].replace(/,/g, '')) : NaN;
};

/* ── 1. The published bands, read from the dictionaries ──────────────────── */

/**
 * The dictionaries import their own types with `import type`, so they are plain
 * data at runtime — but they are TypeScript, and the gates run under plain node.
 * Rather than reproduce nine prices in a fourth place, the band strings are read
 * out of the source text: `'slug': { … priceBand: '…' }`. If a dictionary is ever
 * reshaped so this stops matching, the gate fails loudly on `found.length` rather
 * than quietly checking nothing.
 */
function readServices(locale) {
  const file = join(WEB, 'lib', 'dictionaries', locale, 'services.ts');
  const text = readFileSync(file, 'utf8');
  const found = [];
  let current = null;
  for (const line of text.split('\n')) {
    const key = line.match(/^ {4}'([a-z-]+)':\s*\{/);
    if (key) {
      current = { slug: key[1], name: null, band: null };
      found.push(current);
      continue;
    }
    if (!current) continue;
    const name = line.match(/^ {6}name:\s*'([^']+)'/);
    if (name) current.name = name[1];
    const band = line.match(/priceBand:\s*'([^']+)'/);
    if (band) current.band = band[1];
  }
  return found.filter((entry) => entry.name && entry.band);
}

const enServices = readServices('en');
const bnServices = readServices('bn');

const errors = [];
/** Two strings appearing within `window` characters of each other in visible text. */
function within(text, a, b, window) {
  let from = 0;
  for (;;) {
    const at = text.indexOf(a, from);
    if (at === -1) return false;
    if (text.slice(Math.max(0, at - window), at + a.length + window).includes(b)) return true;
    from = at + 1;
  }
}

const notes = [];

if (enServices.length !== 9 || bnServices.length !== 9) {
  errors.push(
    `expected nine services per locale, read ${enServices.length} (en) and ${bnServices.length} (bn) from the dictionaries`,
  );
}

/* ── 2. The emitted pages ────────────────────────────────────────────────── */

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));

const stripScripts = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, ' ');
const stripStyles = (html) => html.replace(/<style[\s\S]*?<\/style>/gi, ' ');
const textOf = (html) =>
  decode(stripStyles(stripScripts(html)))
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');

/** Every JSON-LD block on the page, parsed. */
function structuredData(html) {
  const blocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  const out = [];
  for (const [, raw] of blocks) {
    try {
      out.push(JSON.parse(raw));
    } catch (error) {
      errors.push(`a JSON-LD block does not parse: ${error.message}`);
    }
  }
  return out;
}

const EXPECT = {
  en: {
    vat: 'exclude applicable VAT',
    arithmetic: 'not a discount',
    platform: 'Design target',
    notOnSale: 'Not on sale yet',
  },
  bn: {
    vat: 'VAT',
    arithmetic: 'কোনো ছাড় নয়',
    platform: 'লক্ষ্য-ব্যান্ড',
    notOnSale: 'এখনো বিক্রিতে নেই',
  },
};

for (const locale of LOCALES) {
  const file = join(SERVER_APP, locale, 'pricing.html');
  if (!existsSync(file)) {
    errors.push(`/${locale}/pricing — page not built`);
    continue;
  }

  const html = readFileSync(file, 'utf8');
  const text = textOf(html);
  const expect = EXPECT[locale];
  const services = locale === 'en' ? enServices : bnServices;

  // 1. Every band is visible, exactly as the service page prints it — and next
  //    to the service it belongs to. Presence alone would pass on a page that
  //    published the same figure twice and the wrong one per row, so each name is
  //    checked against its own band within a short window of text.
  for (const { slug, band, name } of services) {
    if (!text.includes(band)) {
      errors.push(`/${locale}/pricing — band for ${slug} ("${band}") is not in the page text`);
      continue;
    }
    if (!within(text, name, band, 400)) {
      errors.push(`/${locale}/pricing — ${slug}: "${band}" is not printed beside "${name}"`);
    }
  }

  // 3. Structured data: nine offers, each agreeing with the visible band.
  const data = structuredData(html);
  const catalog = data.find((block) => block['@type'] === 'OfferCatalog');
  if (!catalog) {
    errors.push(`/${locale}/pricing — no OfferCatalog in structured data`);
  } else {
    const offers = catalog.itemListElement ?? [];
    if (offers.length !== 9) {
      errors.push(`/${locale}/pricing — expected nine offers, found ${offers.length}`);
    }
    for (const offer of offers) {
      const slug = String(offer.url ?? '').split('/services/')[1] ?? '';
      const published = enServices.find((entry) => entry.slug === slug);
      if (!published) {
        errors.push(`/${locale}/pricing — offer points at an unknown service: ${offer.url}`);
        continue;
      }
      const visible = digitsOf(published.band);
      if (offer.price !== visible || offer.priceSpecification?.minPrice !== visible) {
        errors.push(
          `/${locale}/pricing — ${slug}: offer says ${offer.price}/${offer.priceSpecification?.minPrice} but the page publishes ৳${visible}`,
        );
      }
      if (offer.priceSpecification?.valueAddedTaxIncluded !== false) {
        errors.push(`/${locale}/pricing — ${slug}: offer does not state that VAT is excluded`);
      }
    }
  }

  // 4. The platform tiers never become offers.
  //    Checked structurally rather than by looking for the target numbers:
  //    ৳12,000 is both the Intelligence tier's ceiling and the published VAT
  //    retainer band, so a number-matching rule would have flagged a real price.
  //    What matters is that every offer on this page is a service line.
  const TIER_IDS = ['starter', 'growth', 'intelligence', 'enterprise'];
  for (const offer of catalog?.itemListElement ?? []) {
    const url = String(offer.url ?? '');
    if (!url.includes('/services/')) {
      errors.push(`/${locale}/pricing — offer is not a service line: ${url}`);
    }
    if (TIER_IDS.some((tier) => url.toLowerCase().includes(tier))) {
      errors.push(`/${locale}/pricing — a platform tier is offered for sale: ${url}`);
    }
    if (offer.itemOffered?.['@type'] !== 'Service') {
      errors.push(`/${locale}/pricing — offer has no Service attached: ${url}`);
    }
  }
  if (/"(Offer|Product)"[^}]{0,120}(platform tier|Starter tier)/i.test(JSON.stringify(data))) {
    errors.push(`/${locale}/pricing — structured data mentions a platform tier as an offer`);
  }

  // 5. The statements that stop the page misleading anyone.
  if (!text.includes(expect.vat)) {
    errors.push(`/${locale}/pricing — the VAT position is not stated on the page`);
  }
  if (!text.includes(expect.arithmetic)) {
    errors.push(`/${locale}/pricing — the twelve-month column is not described as arithmetic`);
  }
  if (!text.includes(expect.platform) || !text.includes(expect.notOnSale)) {
    errors.push(`/${locale}/pricing — the platform tiers are not labelled as targets that are not on sale`);
  }

  notes.push(`/${locale}/pricing — 9 bands visible · 9 offers agree · platform not sold`);
}

/* ── 6. English and Bengali quote the same money ─────────────────────────── */

for (const { slug, band } of enServices) {
  const bn = bnServices.find((entry) => entry.slug === slug);
  if (!bn) {
    errors.push(`the Bengali dictionary has no band for ${slug}`);
    continue;
  }
  if (digitsOf(band) !== digitsOf(bn.band)) {
    errors.push(
      `${slug}: English band is ৳${digitsOf(band)} but Bengali is ৳${digitsOf(bn.band)} — the same service must cost the same in both locales`,
    );
  }
}

console.log('\n  Pricing agreement  ·  one band, one place, both locales');
console.log('  ' + '─'.repeat(74));
for (const note of notes) console.log(`  ✓ ${note}`);

if (errors.length) {
  console.log('');
  for (const error of errors) console.log(`  ✗ ${error}`);
  console.error(`\n  Pricing gate FAILED with ${errors.length} error(s).\n`);
  process.exit(1);
}

console.log('\n  ✓ every published band reached the page and its structured data;');
console.log('    platform design targets are present as text and absent as offers.\n');
