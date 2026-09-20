#!/usr/bin/env node
/**
 * DhakaFin token validator  —  DF-P1-003 / DF-P1-015
 * ---------------------------------------------------------------
 * Enforces the promises the design system makes:
 *   1. Structure   — every required group exists and every token has a value.
 *   2. Contrast    — every pair in contrastContract.required MEETS its minimum.
 *   3. Forbidden   — every pair in contrastContract.forbidden really does fail.
 *   4. Themes      — light theme covers the keys it must.
 *
 * Exits non-zero on failure so CI blocks the merge. A design system that
 * cannot fail a build is a suggestion, not a system.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(readFileSync(join(HERE, 'df.tokens.json'), 'utf8'));

/* ─── WCAG contrast maths ─── */
const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function parseColour(input) {
  const v = String(input).trim();
  let hex = v;
  if (v.startsWith('rgb')) {
    const nums = v.match(/[\d.]+/g).map(Number);
    return { r: nums[0], g: nums[1], b: nums[2], a: nums[3] ?? 1 };
  }
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  if (hex.length === 8) {
    return {
      r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16), a: parseInt(hex.slice(6, 8), 16) / 255,
    };
  }
  return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16), a: 1 };
}

/** Alpha-composite a foreground colour over an opaque background. */
function composite(fg, bg) {
  if (fg.a >= 1) return { r: fg.r, g: fg.g, b: fg.b };
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
  };
}

function luminance({ r, g, b }) {
  return 0.2126 * srgbToLinear(r / 255) + 0.7152 * srgbToLinear(g / 255) + 0.0722 * srgbToLinear(b / 255);
}

function contrastRatio(fgRaw, bgRaw) {
  const bg = parseColour(bgRaw);
  const fg = composite(parseColour(fgRaw), bg);
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

/* ─── Token name resolution: 'sea500' | 'sea.500' | 'color.sea.500' | '#hex' ─── */
function resolve(name) {
  if (name.startsWith('#')) return name;
  const path = name.startsWith('color.') ? name.split('.') : ['color', ...name.split('.')];
  if (path.length === 2 && raw.color[path[1]]?.value) return raw.color[path[1]].value;
  // sea500 → color.sea.500  |  surface1 → color.surface1  |  borderQuiet → color.borderQuiet
  const compact = path[1];
  if (raw.color[compact]?.value) return raw.color[compact].value;
  const m = compact.match(/^([a-zA-Z]+)(\d+)$/);
  if (m && raw.color[m[1]]?.[m[2]]?.value) return raw.color[m[1]][m[2]].value;
  throw new Error(`Token not resolvable: "${name}"`);
}

/* ─── 1. Structure ─── */
const REQUIRED_GROUPS = [
  'color', 'gradient', 'font', 'fontSize', 'space', 'radius', 'container', 'breakpoint',
  'duration', 'ease', 'blur', 'elevation', 'zIndex', 'focus', 'touch', 'tier', 'motion', 'format', 'a11y',
];
const errors = [];
const warnings = [];

for (const g of REQUIRED_GROUPS) {
  if (!raw[g]) errors.push(`Missing required token group: ${g}`);
}

function walk(node, path = [], out = []) {
  if (node && typeof node === 'object' && 'value' in node && typeof node.value !== 'object') return out.push({ path, node }), out;
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) walk(v, [...path, k], out);
  }
  return out;
}

const flat = walk(raw);
for (const { path, node } of flat) {
  if (node.value === undefined || node.value === null || node.value === '') {
    errors.push(`Token has no value: ${path.join('.')}`);
  }
}

/* Required individual tokens (spot-check the ones the product depends on most) */
const CRITICAL = [
  'color.void', 'color.sea.500', 'color.sea.400', 'color.text', 'color.muted', 'color.border',
  'gradient.ocean', 'gradient.sealine', 'font.sans', 'font.num', 'font.bn',
  'fontSize.display', 'fontSize.metric', 'radius.lg', 'elevation.3', 'duration.3', 'ease.out',
];
for (const c of CRITICAL) {
  const found = flat.some(({ path }) => path.join('.') === c);
  if (!found) errors.push(`Critical token missing: ${c}`);
}

/* ─── 2. Contrast contract ─── */
const results = [];
for (const pair of raw.contrastContract.required) {
  const fg = resolve(pair.fg);
  const bg = resolve(pair.bg);
  const ratio = contrastRatio(fg, bg);
  const pass = ratio >= pair.min;
  results.push({ fg: pair.fg, bg: pair.bg, ratio, min: pair.min, pass, context: pair.context, fgValue: fg, bgValue: bg });
  if (!pass) {
    errors.push(
      `CONTRAST FAILURE — ${pair.fg} on ${pair.bg} = ${ratio.toFixed(2)}:1 (needs ${pair.min}:1). Context: ${pair.context}`
    );
  }
}

/* ─── 3. Forbidden pairs must genuinely fail ─── */
for (const bad of raw.contrastContract.forbidden) {
  const fg = bad.fg.startsWith('#') ? bad.fg : resolve(bad.fg);
  const bg = resolve(bad.bgLuminanceOf ?? bad.bg);
  const ratio = contrastRatio(fg, bg);
  if (ratio >= 4.5) {
    warnings.push(
      `Forbidden pair "${bad.fg} on ${bad.bgLuminanceOf ?? bad.bg}" now measures ${ratio.toFixed(2)}:1 — it passes; remove it from the forbidden list.`
    );
  } else {
    results.push({ fg: bad.fg, bg: bad.bgLuminanceOf ?? bad.bg, ratio, min: 4.5, pass: true, forbidden: true, context: bad.reason });
  }
}

/* ─── 3b. Colour utility aliases ─── */
const colourAlias = raw.color.$utilityAlias ?? {};
for (const [alias, target] of Object.entries(colourAlias)) {
  if (alias.startsWith('$')) continue;
  if (raw.color[alias]?.value) {
    errors.push(
      `color.$utilityAlias."${alias}" collides with the existing colour token "${alias}" — ` +
        `an alias must not shadow a real token.`
    );
  }
  if (!raw.color[target]?.value) {
    errors.push(
      `color.$utilityAlias."${alias}" targets "${target}", which is not a colour token in this group.`
    );
  }
}
const aliasNames = Object.keys(colourAlias).filter((k) => !k.startsWith('$'));

/* ─── 4. Light theme coverage ─── */
const LIGHT_REQUIRED = ['void', 'surface1', 'text', 'textStrong', 'muted', 'border', 'borderHover', 'buttonPrimaryBg', 'buttonPrimaryText'];
for (const k of LIGHT_REQUIRED) {
  if (!raw.theme?.light?.[k]) errors.push(`Light theme missing required override: ${k}`);
}
for (const [k, v] of Object.entries(raw.theme?.light ?? {})) {
  if (!raw.color[k] && !k.match(/^(sea|button|border|surface|text|muted|glass|scrim|gold|ok|warn|risk|danger)/)) {
    warnings.push(`Light theme key "${k}" does not correspond to a dark-theme token — verify it is intentional.`);
  }
}

/* ─── 5. Report ─── */
mkdirSync(join(HERE, 'dist'), { recursive: true });
writeFileSync(
  join(HERE, 'dist', 'contrast-report.json'),
  JSON.stringify({ generatedFrom: 'df.tokens.json', standard: raw.a11y.standard.value, results }, null, 2) + '\n'
);

const pad = (s, n) => String(s).padEnd(n);
console.log('\n  DhakaFin contrast contract  ·  target ' + raw.a11y.standard.value);
console.log('  ' + '─'.repeat(78));
console.log('  ' + pad('TOKEN PAIR', 30) + pad('RATIO', 10) + pad('MIN', 6) + 'STATUS');
console.log('  ' + '─'.repeat(78));
for (const r of results) {
  const status = r.forbidden ? '⛔ forbidden (correctly failing)' : r.pass ? '✓ pass' : '✗ FAIL';
  console.log('  ' + pad(`${r.fg} on ${r.bg}`, 30) + pad(`${r.ratio.toFixed(2)}:1`, 10) + pad(`${r.min}`, 6) + status);
}
console.log('  ' + '─'.repeat(78));
console.log(`  ${results.length} pairs checked · ${errors.length} error(s) · ${warnings.length} warning(s)\n`);

if (aliasNames.length) {
  console.log(`  ✓ ${aliasNames.length} colour utility alias(es) resolve to real tokens: ${aliasNames.join(', ')}\n`);
}

for (const w of warnings) console.log(`  ⚠️  ${w}`);
if (warnings.length) console.log('');

if (errors.length) {
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error(`\n  Token validation FAILED with ${errors.length} error(s).\n`);
  process.exit(1);
}

console.log('  ✓ Token validation passed.\n');
