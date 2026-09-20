#!/usr/bin/env node
/**
 * Token discipline guard — DF-P1-003
 * ---------------------------------------------------------------
 * Fails the build if a component hardcodes a colour, a raw px/rem duration or a
 * font-family instead of using the design tokens. The design system only stays a
 * system if drift is mechanically impossible.
 *
 * Scanned: every .ts/.tsx file under apps/web/components and apps/web/app
 * Allowed: token files, generated output, and documented escape hatches
 *          (inline SVG data URIs and the token declaration files themselves).
 *
 * Escape hatch: add `// df-guard-allow: <reason>` on the offending line OR on the
 * line immediately above it. Every allow is reviewable in the diff, which is the point.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const ROOT = process.cwd();
const TARGET_DIRS = ['apps/web/components', 'apps/web/app'];

const ALLOW_LINE = 'df-guard-allow';

/**
 * An allow marker may sit on the offending line or on the line directly above it,
 * so a long JSX attribute never has to carry a trailing comment.
 */
function isAllowed(line, previousLine) {
  return line.includes(ALLOW_LINE) || (previousLine ?? '').includes(ALLOW_LINE);
}

const RULES = [
  {
    id: 'hardcoded-hex',
    // #rgb / #rrggbb / #rrggbbaa used as a colour value
    pattern: /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g,
    message: 'Hardcoded hex colour — use a design token (e.g. text-sea-400, bg-surface1) or cssVar().',
    ignoreIf: (line, prev) =>
      line.includes('data:image/svg+xml') || line.includes('xmlns') || isAllowed(line, prev),
  },
  {
    id: 'hardcoded-rgb',
    pattern: /\brgba?\(\s*\d/gi,
    message: 'Hardcoded rgb()/rgba() colour — use a token such as var(--df-color-scrim) or a color-mix() over a token.',
    ignoreIf: (line, prev) => line.includes('color-mix') || line.includes('var(--') || isAllowed(line, prev),
  },
  {
    id: 'hardcoded-font-family',
    pattern: /font-family\s*:\s*(?!var\()/gi,
    message: 'Inline font-family — the font stack is a token (font-sans / font-num / font-bn).',
    ignoreIf: (line, prev) => isAllowed(line, prev),
  },
  {
    id: 'raw-transition-duration',
    pattern: /(?:duration|delay)(?:-\[)?\s*[:=]?\s*['"]?\d{3,4}\s*ms/gi,
    message: 'Raw millisecond duration — use a duration token (duration-200 / var(--df-duration-base)).',
    ignoreIf: (line, prev) => line.includes('var(--df-duration') || isAllowed(line, prev),
  },
];

const scanned = [];
const violations = [];

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      if (entry === 'node_modules' || entry === '.next') continue;
      walk(full);
    } else if (['.tsx', '.ts'].includes(extname(full))) {
      scanned.push(full);
      const content = readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        const previousLine = index > 0 ? lines[index - 1] : '';
        for (const rule of RULES) {
          rule.pattern.lastIndex = 0;
          const matches = line.match(rule.pattern);
          if (!matches) continue;
          if (rule.ignoreIf?.(line, previousLine)) continue;
          violations.push({
            file: relative(ROOT, full),
            line: index + 1,
            rule: rule.id,
            match: matches[0],
            message: rule.message,
            snippet: line.trim().slice(0, 120),
          });
        }
      });
    }
  }
}

TARGET_DIRS.forEach((dir) => walk(join(ROOT, dir)));

if (violations.length === 0) {
  console.log(`✓ Token guard passed — ${scanned.length} files scanned, no hardcoded design values.\n`);
  process.exit(0);
}

console.error(`\n✗ Token guard FAILED — ${violations.length} violation(s) in ${scanned.length} scanned files:\n`);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  [${v.rule}]  ${v.match}`);
  console.error(`    ${v.message}`);
  console.error(`    > ${v.snippet}\n`);
}
console.error('  Fix by using design tokens. If a hardcoded value is genuinely required,');
console.error('  justify it inline with:  // df-guard-allow: <reason>\n');
process.exit(1);
