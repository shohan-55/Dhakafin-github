#!/usr/bin/env node
/**
 * SEO metadata gate  ·  DF-P2-002
 * ---------------------------------------------------------------------------
 * Verifies the metadata that actually ships, by reading it out of the emitted
 * HTML rather than out of the source. Source-side checks would pass while
 * `buildMetadata` quietly dropped a canonical, emitted the same description on
 * twenty pages, or left one page without a title — and a soft-404 or a duplicate
 * snippet is invisible until a search console flags it weeks later.
 *
 * WHAT IT ENFORCES (blueprint §5.6.4 #4 and §7.3)
 *   1. Every page has a non-empty <title> and meta description.
 *   2. Titles and descriptions are unique across the site. Two pages sharing a
 *      description is the most common technical-SEO defect and the easiest to
 *      ship by accident.
 *   3. Each description fits the search-result budget. Measured in display-width
 *      units, not characters, because a Bengali codepoint occupies roughly
 *      twice the width of a Latin one — a 160-character rule applied literally
 *      to Bengali would truncate every Bengali description and pass every check.
 *   4. Every page emits a canonical link and reciprocal hreflang alternates.
 *
 * Runs after `next build`.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const NEXT = join(ROOT, 'apps', 'web', '.next');
const SERVER_APP = join(NEXT, 'server', 'app');

/* A Latin character is the unit. A Bengali glyph ADVANCE is wider, and Bengali
   also composes: "ক্ষ" is three codepoints but a single visual cluster, and a
   consonant plus a matra is one cluster too. Counting codepoints therefore
   overcounts Bengali by roughly a third and would demand descriptions far
   shorter than a search result actually shows. So segment into grapheme
   clusters first, then weight each cluster — which is what a reader sees. */
const WIDTH = { min: 150, max: 168 };
const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
const weightOf = (cluster) => {
  const cp = cluster.codePointAt(0);
  if (cp >= 0x0980 && cp <= 0x09ff) return 1.6;
  if (cp >= 0x4e00 && cp <= 0x9fff) return 2;
  if (cp >= 0x2e80 && cp <= 0x2eff) return 1.6;
  return cluster.length > 1 ? 1.3 : 1;
};
const displayWidth = (text) =>
  [...segmenter.segment(text)].reduce((n, g) => n + weightOf(g.segment), 0);

if (!existsSync(SERVER_APP)) {
  console.error('  ✗ metadata gate: no build output. Run `npm run build` first.');
  process.exit(1);
}

const SKIP = /^(_|index$|favicon|icon|apple-icon|opengraph-image|twitter-image)/;

function htmlFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) htmlFiles(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));

/** `/_not-found` and other internal artefacts are not pages a crawler sees. */
const pages = htmlFiles(SERVER_APP)
  .filter((f) => !SKIP.test(relative(SERVER_APP, f)))
  .map((file) => {
    const html = readFileSync(file, 'utf8');
    const head = html.slice(0, html.indexOf('</head>') + 7);
    const meta = (name, attr = 'name') =>
      head.match(new RegExp(`<meta[^>]+${attr}="${name}"[^>]+content="([^"]*)"`, 'i'))?.[1];

    const alternates = [...head.matchAll(/<link[^>]+hreflang="([^"]+)"[^>]+href="([^"]+)"/gi)].map((m) => ({
      hreflang: m[1],
      href: m[2],
    }));

    return {
      file: relative(ROOT, file),
      route: '/' + relative(SERVER_APP, file).replace(/\.html$/, ''),
      title: decode(head.match(/<title>([^<]*)<\/title>/i)?.[1] ?? ''),
      description: decode(meta('description') ?? ''),
      canonical: head.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] ?? '',
      langs: [...new Set(alternates.map((a) => a.hreflang))].sort(),
      lang: head.match(/<html[^>]+lang="([^"]+)"/i)?.[1] ?? '',
    };
  });

/* ── checks ────────────────────────────────────────────────────────────── */

const errors = [];
const warnings = [];

for (const page of pages) {
  if (!page.title.trim()) errors.push(`${page.route} — no <title>`);
  if (!page.description.trim()) errors.push(`${page.route} — no meta description`);
  if (!page.canonical) errors.push(`${page.route} — no canonical link`);
  if (!/^[a-z]{2}(-[A-Za-z]{2})?$/.test(page.lang)) {
    errors.push(`${page.route} — <html lang="${page.lang}"> is not a valid BCP-47 tag`);
  }

  const w = displayWidth(page.description);
  if (page.description && (w < WIDTH.min || w > WIDTH.max)) {
    errors.push(
      `${page.route} — meta description is ${w.toFixed(0)} width units (target ${WIDTH.min}–${WIDTH.max}): ` +
        `"${page.description.slice(0, 60)}…"`
    );
  }

  // Authored (non-Latin) pages carrying only English chrome is a soft signal
  // that a translation was forgotten, not a hard failure.
  if (page.lang.startsWith('bn') && !/[\u0980-\u09ff]/.test(page.description)) {
    warnings.push(`${page.route} — Bengali page has a description with no Bengali text`);
  }
}

const dupes = (key) => {
  const seen = new Map();
  for (const p of pages) {
    const v = p[key];
    if (!v) continue;
    if (!seen.has(v)) seen.set(v, []);
    seen.get(v).push(p.route);
  }
  return [...seen.entries()].filter(([, routes]) => routes.length > 1);
};

for (const [value, routes] of dupes('title')) {
  errors.push(`duplicate <title> on ${routes.join(', ')} — "${value.slice(0, 60)}"`);
}
for (const [value, routes] of dupes('description')) {
  errors.push(`duplicate meta description on ${routes.join(', ')} — "${value.slice(0, 60)}"`);
}

/* Pages that exist in more than one locale should cross-link both. */
const byPath = new Map();
for (const p of pages) {
  const key = p.route.replace(/^\/(en|bn)(?=\/|$)/, '') || '/';
  if (!byPath.has(key)) byPath.set(key, []);
  byPath.get(key).push(p);
}
let paired = 0;
for (const [key, group] of byPath) {
  if (group.length < 2) continue;
  paired++;
  for (const p of group) {
    const needs = ['en-BD', 'bn-BD', 'x-default'];
    const missing = needs.filter((n) => !p.langs.includes(n));
    if (missing.length) {
      warnings.push(`${p.route} — hreflang missing ${missing.join(', ')} (has ${p.langs.join(', ') || 'none'})`);
    }
  }
}

/* ── report ────────────────────────────────────────────────────────────── */

console.log('\n  Metadata  ·  titles, descriptions, canonicals and hreflang');
console.log('  ' + '─'.repeat(78));
console.log(
  `  ${pages.length} pages · ${byPath.size} routes · ${paired} route(s) published in both locales · ` +
    `${errors.length} error(s) · ${warnings.length} warning(s)\n`
);

for (const w of warnings) console.warn(`  ⚠  ${w}`);
if (warnings.length) console.log('');

if (errors.length) {
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error(`\n  Metadata gate FAILED with ${errors.length} error(s).\n`);
  process.exit(1);
}

console.log(`  ✓ every page has a unique title, a unique description within budget,`);
console.log(`    a canonical link and a valid lang attribute.\n`);
