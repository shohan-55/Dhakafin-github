#!/usr/bin/env node
/**
 * Internal link integrity gate  ·  Phase 2
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 * A static site build fails on a syntax error and says nothing at all about a
 * link to a page that does not exist. Next.js will happily prerender
 * `<a href="/book-consultation">` into 24 pages when there is no
 * `/book-consultation` route, and the result is a 404 that only a human clicking
 * through the site will ever find.
 *
 * The specific defect this gate was written for is worse than a missing page,
 * because it looked right. `usePathname()` answers two different questions
 * depending on when it is asked. In a browser it returns the URL the visitor
 * sees, so the internal `/en` rewrite is invisible. During prerendering there is
 * no URL yet and it returns the route's own pathname — `/en/services`. The
 * language switcher concatenated that directly, so every English page shipped
 * `<a href="/bn/en/services">` in its HTML: correct after hydration, a 404 for
 * anyone without JavaScript, and a dead link for a crawler. Nothing in the build
 * output distinguished it from a good link.
 *
 * STRATEGY — read the emitted HTML, resolve against the emitted route set
 * The gate walks every prerendered `.html` file, extracts every internal `href`,
 * and checks it against the routes Next actually built. The proxy rewrites the
 * default locale onto the bare path, so `/services` and `/bn/services` are both
 * real while `/en/services` is a 308 — all three shapes are resolved the way a
 * browser would.
 *
 * Links to routes that exist in the blueprint but have not been built yet are
 * not failures; they are declared in `scripts/planned-routes.mjs` with the task
 * that owns them. That list may only shrink, and a stale entry is itself an
 * error — so this gate tightens automatically as Phase 2 lands, and can be
 * deleted when it is empty.
 *
 * Runs after `next build`. It has nothing to read before that.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { plannedRoutes, plannedSet } from './planned-routes.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const APP = join(ROOT, 'apps', 'web', '.next', 'server', 'app');

const LOCALES = ['en', 'bn'];
const DEFAULT_LOCALE = 'en';

if (!existsSync(APP)) {
  console.error('  ✗ link gate: no build output. Run `next build` first.');
  process.exit(1);
}

/* ── 1. Every page the build actually emitted ──────────────────────────── */

function htmlFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) htmlFiles(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

const pages = htmlFiles(APP).filter((f) => !/\/(_not-found|_global-error)\.html$/.test(f));

/** `/en/services.html` → `/en/services`; `/bn.html` → `/bn`; `/en/index.html` → `/en`. */
function routeOf(file) {
  let r = file.slice(APP.length).replace(/\.html$/, '');
  r = r.replace(/\/index$/, '');
  if (r === '/index') r = '/';
  return r.startsWith('/') ? r : `/${r}`;
}

const built = new Set(pages.map(routeOf));

/**
 * The set of paths a browser can visit. Both locale shapes are reachable: the
 * default locale is rewritten onto the bare path and the other locale carries a
 * prefix, so `/services` and `/bn/services` are both real URLs. `/en/services`
 * also resolves — the proxy 308s it — which is why it is accepted here rather
 * than reported. A redirect is not a broken link.
 */
const reachable = new Set();
for (const route of built) {
  reachable.add(route);
  for (const locale of LOCALES) {
    if (route === `/${locale}`) reachable.add('/');
    if (route.startsWith(`/${locale}/`)) reachable.add(route.slice(locale.length + 1));
  }
}

/* ── 2. Every internal link the pages contain ──────────────────────────── */

const links = new Map();
for (const file of pages) {
  const source = readFileSync(file, 'utf8');
  const from = routeOf(file);
  for (const match of source.matchAll(/href="(\/[^"#?]*)/g)) {
    // Trailing slashes are resolution-equivalent (Next normalises to no-slash).
    const href = match[1].length > 1 ? match[1].replace(/\/+$/, '') : '/';
    if (href.startsWith('/_next') || href.startsWith('/api')) continue;
    if (!links.has(href)) links.set(href, new Set());
    links.get(href).add(from);
  }
}

/* ── 3. Classify ───────────────────────────────────────────────────────── */

const broken = [];
const planned = [];
for (const [href, from] of links) {
  if (reachable.has(href)) continue;
  // A planned route is declared by its canonical path; every locale of a route
  // shares one exemption.
  const canonical = href.replace(/^\/bn(?=\/|$)/, '') || '/';
  if (plannedSet.has(canonical) || plannedSet.has(href)) {
    planned.push(href);
    continue;
  }
  broken.push([href, [...from]]);
}

/* A route that has been built but is still listed as planned is a stale entry:
   the list must shrink as work lands, or it stops meaning anything. */
const stale = plannedRoutes.filter((r) => reachable.has(r.href)).map((r) => r.href);

/* ── 4. Report ─────────────────────────────────────────────────────────── */

console.log('\n  Internal links  ·  every href must resolve to a built page');
console.log('  ' + '─'.repeat(78));
console.log(
  `  ${built.size} pages built · ${links.size} distinct internal links · ` +
    `${planned.length} pending · ${broken.length} broken · ${stale.length} stale\n`
);

if (broken.length) {
  for (const [href, from] of broken.sort(([a], [b]) => a.localeCompare(b))) {
    console.error(`  ✗ ${href}   linked from ${from.length} page(s)`);
    for (const f of from.slice(0, 4)) console.error(`      ${f}`);
  }
  console.error(
    `\n  ${broken.length} link(s) above point at no built page. Fix the href, or add\n` +
      `  the route to scripts/planned-routes.mjs with the task that owns it.\n`
  );
  process.exit(1);
}

if (stale.length) {
  console.error(
    `  ✗ ${stale.length} route(s) in scripts/planned-routes.mjs are already built:\n`
  );
  for (const href of stale) console.error(`      ${href}`);
  console.error('\n  Delete those entries — the list may only shrink.\n');
  process.exit(1);
}

if (planned.length) {
  const byTask = new Map();
  for (const href of planned) {
    const canonical = href.replace(/^\/bn(?=\/|$)/, '') || '/';
    const entry = plannedRoutes.find((r) => r.href === canonical || r.href === href);
    const task = entry ? entry.task : '—';
    byTask.set(task, (byTask.get(task) ?? 0) + 1);
  }
  console.log('  Pending routes, by owning task:');
  for (const [task, n] of [...byTask].sort()) console.log(`    ${task.padEnd(12)} ${n} link(s)`);
  console.log();
}

console.log(`  ✓ all ${links.size - planned.length} live internal links resolve.`);
console.log(`    ${planned.length} point at declared, unbuilt routes — see scripts/planned-routes.mjs.\n`);
