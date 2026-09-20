#!/usr/bin/env node
/**
 * Utility integrity gate  ·  DF-P2-001
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 * Phase 1 shipped with `text-strong` (52 uses), `border-quiet` (43), `border-hover`
 * (13) and `border-strong` (13) — 121 class references that emitted NO CSS AT ALL.
 * The tokens existed, the classes were written, the build was green, and the pages
 * looked almost right. That is the worst kind of design-system failure: silent.
 *
 * Root cause is structural, not a typo. Tailwind v4 resolves colour utilities from
 * one flat `--color-*` namespace, so a token named after a CSS property
 * (`borderQuiet`) emits `border-border-quiet`, and the utility a human types
 * (`border-quiet`) matches nothing. Tailwind cannot warn: for a compiler, an
 * unknown string in a class attribute is not an error — it may be your own data.
 *
 * STRATEGY — derived, never hand-maintained
 * Instead of guessing which classes look like tokens, this gate knows the exact
 * set of utilities the token file CAN produce:
 *
 *     every --color-<name>  →  text-<name>  ·  bg-<name>  ·  border-<name>  ·  …
 *     every --text-<name>   →  text-<name>          (the type scale)
 *
 * A colour-prefixed class in the source is therefore correct only if it is in
 * that derived set, a Tailwind built-in, or an arbitrary value. Everything else
 * is a class that renders nothing — which is either a typo or a missing alias.
 *
 * It runs after `next build`, so it also verifies the CSS actually emitted.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const WEB = join(ROOT, 'apps', 'web');
const THEME = join(ROOT, 'packages', 'tokens', 'dist', 'theme.css');

const COLOUR_PREFIXES = [
  'text', 'bg', 'border', 'ring', 'fill', 'stroke', 'decoration', 'divide',
  'outline', 'from', 'via', 'to', 'accent', 'caret', 'placeholder',
];

/* Tailwind keywords and scales that legitimately share these prefixes. */
const BUILTIN = new Set([
  'text-current', 'bg-current', 'border-current', 'fill-current', 'stroke-current', 'divide-current',
  'text-transparent', 'bg-transparent', 'border-transparent', 'fill-transparent', 'stroke-transparent',
  'text-white', 'bg-white', 'border-white', 'text-black', 'bg-black', 'border-black',
  'text-inherit', 'bg-inherit', 'border-inherit',
  'ring-inset', 'ring-offset', 'outline-none', 'outline-hidden', 'outline-dashed', 'outline-dotted', 'outline-double',
  'text-left', 'text-center', 'text-right', 'text-justify', 'text-start', 'text-end',
  'text-balance', 'text-pretty', 'text-wrap', 'text-nowrap', 'text-clip', 'text-ellipsis',
  'text-uppercase', 'text-lowercase', 'text-capitalize', 'text-normal',
  'bg-fixed', 'bg-local', 'bg-scroll', 'bg-clip-border', 'bg-clip-padding', 'bg-clip-content', 'bg-clip-text',
  'bg-bottom', 'bg-center', 'bg-left', 'bg-right', 'bg-top', 'bg-repeat', 'bg-no-repeat', 'bg-cover', 'bg-contain',
  'border-collapse', 'border-separate', 'border-solid', 'border-dashed', 'border-dotted', 'border-double', 'border-none',
]);

const SCALE_WORD = /^(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|none|auto|full|screen|min|max|fit|inset|inherit|initial|unset|revert|current|transparent|white|black|solid|dashed|dotted|double|hidden|clip|wrap|balance|pretty|ellipsis|left|right|center|justify|start|end|top|bottom|between|around|evenly|stretch|baseline|nowrap|uppercase|lowercase|capitalize|italic|oblique|underline|overline|line-through|collapse|separate|fixed|local|scroll|cover|contain|repeat|no-repeat|reverse|normal|from-font|text|content|opacity|offset|bleed)$/;
const BORDER_SIDE = /^(t|r|b|l|x|y|s|e)(-\d+)?$/;
const PURE_NUMBER = /^\d+$/;

/* ── 1. The set of utilities the token file can produce ────────────────── */

if (!existsSync(THEME)) {
  console.error(`  ✗ utility gate: ${relative(ROOT, THEME)} missing. Run \`npm run tokens:build\`.`);
  process.exit(1);
}

const theme = readFileSync(THEME, 'utf8');
const colourNames = [...theme.matchAll(/--color-([a-z0-9-]+)\s*:/g)].map((m) => m[1]);
const textNames = [...theme.matchAll(/--text-([a-z0-9-]+)\s*:/g)].map((m) => m[1]);

const DERIVED = new Set();
for (const p of COLOUR_PREFIXES) for (const n of colourNames) DERIVED.add(`${p}-${n}`);
for (const n of textNames) DERIVED.add(`text-${n}`);

/* ── 2. Candidate classes actually used in source ──────────────────────── */

const SKIP_DIRS = new Set(['node_modules', '.next', 'dist', '.git']);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx|ts)$/.test(full)) out.push(full);
  }
  return out;
}

/** Strip variants (`hover:`, `md:`, `motion-reduce:`) and opacity modifiers. */
const decompose = (cls) => {
  let c = cls.includes(':') ? cls.slice(cls.lastIndexOf(':') + 1) : cls;
  return c.replace(/^!/, '').replace(/\/[0-9.]+$/, '');
};

const sources = [];
for (const sub of ['app', 'components', 'lib']) {
  const dir = join(WEB, sub);
  if (existsSync(dir)) walk(dir, sources);
}

const used = new Map();
for (const file of sources) {
  for (const match of readFileSync(file, 'utf8').matchAll(/['"`]([^'"`\n]{1,400})['"`]/g)) {
    for (const raw of match[1].split(/\s+/)) {
      // Arbitrary values, interpolations and JS expressions are not our business.
      if (!raw || /[[\]$}{()]/.test(raw)) continue;
      const c = decompose(raw);
      if (!COLOUR_PREFIXES.some((p) => c.startsWith(p + '-'))) continue;
      if (!used.has(c)) used.set(c, new Set());
      used.get(c).add(relative(ROOT, file));
    }
  }
}

/* ── 3. Verify against the emitted CSS as well ─────────────────────────── */

function cssFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) cssFiles(full, out);
    else if (entry.endsWith('.css')) out.push(full);
  }
  return out;
}

const css = [...cssFiles(join(WEB, '.next', 'static')), ...cssFiles(join(WEB, '.next', 'server'))]
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');

if (css.length === 0) {
  console.error('  ✗ utility gate: no built CSS found. Run `next build` first.');
  process.exit(1);
}

const escapeRe = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

function emitted(cls) {
  const selector = cls.replace(/[.:/[\]]/g, (ch) => '\\' + ch);
  return new RegExp(`\\.${escapeRe(selector)}(?![\\w-])`).test(css);
}

function explain(cls) {
  const rest = cls.slice(cls.indexOf('-') + 1);
  if (BUILTIN.has(cls) || SCALE_WORD.test(rest) || BORDER_SIDE.test(rest) || PURE_NUMBER.test(rest))
    return 'builtin';
  return 'unknown';
}

const unresolved = [];
for (const [cls] of used) {
  if (emitted(cls)) continue;
  if (explain(cls) === 'builtin') continue;
  unresolved.push(cls);
}

/* ── 4. Report ─────────────────────────────────────────────────────────── */

console.log('\n  Utility integrity  ·  every colour utility must resolve to real CSS');
console.log('  ' + '─'.repeat(78));
console.log(
  `  ${sources.length} source files · ${used.size} colour utilities used · ` +
    `${colourNames.length} colour tokens · ${unresolved.length} unresolved\n`
);

if (unresolved.length) {
  for (const cls of unresolved) {
    const files = [...used.get(cls)];
    console.error(`  ✗ ${cls}   ${files.length} file(s)`);
    for (const f of files.slice(0, 3)) console.error(`      ${f}`);
  }
  console.error(
    `\n  ${unresolved.length} class(es) above emit no CSS. Fix the class name, or add a\n` +
      `  colour.$utilityAlias entry in packages/tokens/df.tokens.json.\n`
  );
  process.exit(1);
}

console.log(`  ✓ all ${used.size} colour utilities resolve to generated CSS.`);
console.log(`    derived from ${colourNames.length} colour tokens and ${textNames.length} type-scale steps.\n`);
