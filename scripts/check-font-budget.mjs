#!/usr/bin/env node
/**
 * Font payload budget gate — DF-P1-004
 * -------------------------------------------------------------------------
 * The blueprint sets a font budget of `font.budgetKB` (180 KB). That number is
 * easy to state and easy to break: one `preload: true` on the Bengali subset
 * adds 139 KB to every English page load, and nothing visibly fails. This gate
 * exists because that exact bug shipped once already.
 *
 * It does not guess. It reconstructs the browser's font-resolution algorithm
 * from the build output:
 *
 *   1. read every @font-face from the emitted CSS (family → file, unicode-range, bytes)
 *   2. read the family stacks from globals.css (`--df-font-sans: var(--font-a), var(--font-b)…`)
 *   3. read the rendered text of every prerendered locale page (script/style
 *      stripped, so the RSC payload cannot inflate the result)
 *   4. for each codepoint, walk the stack and find the FIRST family with a face
 *      whose unicode-range covers it — that is the face the browser downloads
 *   5. add anything with a <link rel=preload as=font>, because preload fetches it
 *      whether or not a glyph needs it
 *
 * A face is counted only when a real codepoint on a real page resolves to it.
 * That is what makes this a budget rather than a byte-count of a directory.
 *
 * EVERY locale is measured, not just English. The Bengali page is the expensive
 * one — it is the page the Bengali typeface exists for — so measuring only `/`
 * would report a comfortable 49% while the page half the audience reads sits
 * somewhere else entirely.
 *
 * Run after `next build`. If .next is absent it reports SKIPPED rather than
 * pretending to have checked.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const NEXT = join(ROOT, 'apps/web/.next');
const GLOBALS = join(ROOT, 'apps/web/app/globals.css');
const TOKENS = join(ROOT, 'packages/tokens/df.tokens.json');

const budgetKB = JSON.parse(readFileSync(TOKENS, 'utf8')).font.budgetKB.value;
const budgetBytes = Number(budgetKB) * 1024;

if (!existsSync(NEXT)) {
  console.log('⚠ Font budget gate SKIPPED — apps/web/.next not found. Run `npm run build` first.\n');
  process.exit(0);
}

/* ── 1. Every @font-face in the built CSS ─────────────────────────────── */
const cssFiles = [];
(function collectCss(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collectCss(full);
    else if (entry.endsWith('.css')) cssFiles.push(full);
  }
})(join(NEXT, 'static'));

const css = cssFiles.map((f) => readFileSync(f, 'utf8')).join('\n');

/** Parse a CSS unicode-range list into [lo, hi] pairs. */
function parseRange(value) {
  const out = [];
  for (const part of value.split(',')) {
    const t = part.trim();
    if (!t) continue;
    const m = t.match(/^u\+([0-9a-f]{1,6})(?:-([0-9a-f]{1,6}))?$/i);
    if (!m) continue;
    const lo = parseInt(m[1], 16);
    const hi = m[2] ? parseInt(m[2], 16) : lo;
    out.push([lo, hi]);
  }
  return out;
}

/** A font-face with no unicode-range covers everything. */
const FULL_RANGE = [[0, 0x10ffff]];

const facesByFamily = new Map();

for (const block of css.split('@font-face').slice(1)) {
  const rule = block.slice(0, block.indexOf('}'));
  const family = rule.match(/font-family:\s*(['"]?)([^;'"]+)\1/)?.[2];
  const src = rule.match(/url\(([^)]+\.woff2)\)/)?.[1]?.replace(/["']/g, '');
  if (!family || !src) continue;

  const name = src.split('/').pop();
  const filePath = join(NEXT, 'static/media', name);
  if (!existsSync(filePath)) continue;

  const rangeMatch = rule.match(/unicode-range:([^;}]+)/);
  const face = {
    fileName: name,
    filePath,
    bytes: statSync(filePath).size,
    ranges: rangeMatch ? parseRange(rangeMatch[1]) : FULL_RANGE,
  };

  if (!facesByFamily.has(family)) facesByFamily.set(family, []);
  facesByFamily.get(family).push(face);
}

const covers = (face, cp) => face.ranges.some(([lo, hi]) => cp >= lo && cp <= hi);

/* ── 2. Map `--font-*` CSS variables to their generated family names ───── */
// next/font emits e.g.  .variable_xyz { --font-grotesk: '__grotesk_ab12', '__grotesk_Fallback_ab12' }
const varToFamilies = new Map();
for (const m of css.matchAll(/--font-([a-z0-9-]+)\s*:\s*([^;}]+)/gi)) {
  const key = `--font-${m[1]}`;
  if (varToFamilies.has(key)) continue;
  const families = [...m[2].matchAll(/(['"])([^'"]+)\1/g)]
    .map((x) => x[2])
    // Drop the metric-adjusted fallback family next/font injects.
    .filter((f) => !/_Fallback_/.test(f));
  if (families.length) varToFamilies.set(key, families);
}

/* ── 3. The family stacks the app actually applies ─────────────────────── */
const globalsCss = readFileSync(GLOBALS, 'utf8');
const stacks = [];
for (const m of globalsCss.matchAll(/--df-font-[a-z]+:\s*([^;]+);/gi)) {
  const families = [...m[1].matchAll(/var\((--font-[a-z0-9-]+)\)/gi)]
    .flatMap((v) => varToFamilies.get(v[1]) ?? []);
  if (families.length) stacks.push(families);
}

if (stacks.length === 0) {
  console.error('✗ Font budget gate FAILED — could not read any `--df-font-*` stack from globals.css.\n');
  process.exit(1);
}

/* ── 4. Every prerendered locale page, not just English ────────────────── */
const serverApp = join(NEXT, 'server/app');

/**
 * Locale home pages are emitted as `en.html`, `bn.html`, … next to their route
 * directories. Finding the home page for each locale means walking one level and
 * taking the two-letter-code files — which keeps this working when a third
 * language is added without anyone remembering to update a hardcoded list.
 */
/**
 * Discover every prerendered page, grouped by locale — not just the locale home.
 *
 * The home page is the lightest page on the site. The heavy ones are the service
 * detail pages, which carry the numeric face, the mono face for filing references
 * and a full Bengali body. A gate that only measured `/en` would report 49.9 KB
 * while a service page sat at twice that, which is exactly the failure mode this
 * file exists to prevent. So: walk the whole tree and take the worst page in each
 * locale, and report which page that was.
 */
function htmlUnder(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) htmlUnder(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

const locales = readdirSync(serverApp)
  .filter((f) => statSync(join(serverApp, f)).isDirectory() && /^[a-z]{2}$/.test(f))
  .sort();

const localePages = [];
for (const locale of locales) {
  const home = join(serverApp, `${locale}.html`);
  if (existsSync(home)) localePages.push({ locale, route: '/', path: home });
  for (const file of htmlUnder(join(serverApp, locale))) {
    const route = '/' + relative(join(serverApp, locale), file).replace(/\.html$/, '').replace(/\/index$/, '');
    localePages.push({ locale, route: route === '/' ? '' : route, path: file });
  }
}

const pages = localePages.map(({ locale, route, path }) => {
  const html = readFileSync(path, 'utf8');
  // Strip script/style so the serialised RSC payload cannot inflate the codepoint set.
  const visibleText = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');

  const codepoints = new Set();
  for (const ch of visibleText) codepoints.add(ch.codePointAt(0));

  // Preloads are unconditional: the browser fetches them whether or not a glyph needs them.
  const preloaded = new Set();
  for (const m of html.matchAll(/<link[^>]*>/g)) {
    const tag = m[0];
    if (!tag.includes('as="font"') || !tag.includes('rel="preload"')) continue;
    const href = tag.match(/href="([^"]+\.woff2)"/)?.[1];
    if (href) preloaded.add(href.split('/').pop());
  }

  return { locale, route, codepoints, preloaded };
});

/** Resolve each codepoint through each stack; the first covering face wins. */
function resolvePage(page) {
  const resolved = new Map(); // fileName → { face, reasons:Set<string> }
  const record = (face, reason) => {
    if (!resolved.has(face.fileName)) resolved.set(face.fileName, { face, reasons: new Set() });
    resolved.get(face.fileName).reasons.add(reason);
  };

  for (const stack of stacks) {
    for (const cp of page.codepoints) {
      for (const family of stack) {
        const faces = facesByFamily.get(family);
        if (!faces) continue;
        const hit = faces.find((f) => covers(f, cp));
        if (hit) {
          record(hit, `U+${cp.toString(16).toUpperCase().padStart(4, '0')} on page`);
          break; // first family in the stack wins — exactly what a browser does
        }
      }
    }
  }

  // Preloaded faces are fetched regardless of glyph need.
  for (const family of facesByFamily.keys()) {
    for (const face of facesByFamily.get(family)) {
      if (page.preloaded.has(face.fileName)) record(face, 'preloaded (fetched unconditionally)');
    }
  }

  return resolved;
}

const allFaces = [...facesByFamily.values()].flat();
const short = (n) => (n.length > 44 ? `${n.slice(0, 20)}…${n.slice(-20)}` : n);

/* ── 6. Report ─────────────────────────────────────────────────────────── */
console.log('\n  Font payload audit — heaviest page in each locale, measured separately\n');
console.log(`  Pages : ${pages.length} pages measured across ${new Set(pages.map((p) => p.locale)).size} locale(s)`);
console.log(`  Stacks : ${stacks.length} (--df-font-sans / -num / -bn)   Budget : ${budgetKB} KB\n`);

const results = pages.map((page) => {
  const resolved = resolvePage(page);
  let total = 0;
  for (const face of allFaces) if (resolved.has(face.fileName)) total += face.bytes;
  return { page, resolved, total };
});

const overBudget = results.filter((r) => r.total > budgetBytes);

/** The heaviest page in each locale — the number the budget actually protects. */
const worstPerLocale = [];
for (const locale of new Set(results.map((r) => r.page.locale))) {
  const inLocale = results.filter((r) => r.page.locale === locale);
  worstPerLocale.push(inLocale.reduce((a, b) => (b.total > a.total ? b : a)));
}
const worst = worstPerLocale.reduce((a, b) => (b.total > a.total ? b : a));

for (const { page, resolved, total } of worstPerLocale.sort((a, b) => b.total - a.total)) {
  const pct = ((total / budgetBytes) * 100).toFixed(0);
  const flag = total > budgetBytes ? '✗' : '✓';
  const label = `/${page.locale === '(default)' ? '' : page.locale}${page.route}`;
  console.log(`  ── ${label} — ${(total / 1024).toFixed(1)} KB (${pct}%) ${flag}`);
  const rows = allFaces
    .map((face) => ({ face, hit: resolved.get(face.fileName) }))
    .sort((a, b) => Number(Boolean(b.hit)) - Number(Boolean(a.hit)) || b.face.bytes - a.face.bytes);
  for (const { face, hit } of rows) {
    const kb = (face.bytes / 1024).toFixed(1).padStart(6);
    console.log(`     ${hit ? '▣' : '·'} ${kb} KB  ${short(face.fileName)}`);
    if (hit) console.log(`                ${[...hit.reasons].slice(0, 2).join(' · ')}`);
  }
  console.log('');
}

console.log(`  ${'─'.repeat(64)}`);
console.log(`  Worst page overall       : /${worst.page.locale === '(default)' ? '' : worst.page.locale} at ${(worst.total / 1024).toFixed(1)} KB`);
console.log(`  Budget (font.budgetKB)   : ${budgetKB} KB`);

if (overBudget.length > 0) {
  console.error(`\n✗ Font budget gate FAILED — ${overBudget.length} locale(s) over budget:`);
  for (const r of overBudget) {
    console.error(`    /${r.page.locale}: ${(r.total / 1024).toFixed(1)} KB (over by ${((r.total - budgetBytes) / 1024).toFixed(1)} KB)`);
  }
  console.error('\n  Remedies: set preload:false, drop a weight, narrow a unicode-range,');
  console.error('  or move the glyph to a purpose-built subset (see app/fonts/README.md).');
  console.error('  Do not raise font.budgetKB without a recorded decision — it is a performance contract.\n');
  process.exit(1);
}

console.log('  ✓ every locale within budget\n');
