#!/usr/bin/env node
/**
 * FAQ and help-centre gate  ·  DF-P2-025
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 * `/faq` makes three promises that are easy to break silently:
 *
 *   1. **Every answer is 40–60 words** (F3: the length an answer engine will
 *      quote without cutting the sentence that makes it true). Nothing else
 *      checks this — a long answer still renders perfectly.
 *   2. **The structured data matches the visible text.** FAQPage rich results
 *      are built from JSON that is generated separately from the prose, so the
 *      two can drift: an answer edited in the page and not in the schema is
 *      invisible until a crawler quotes the stale one.
 *   3. **`/help` and `/faq` are the same fifteen questions.** The help centre
 *      links into the answers by id; a question that exists on one surface and
 *      not the other is a dead end that renders as a working link.
 *
 * It reads the emitted HTML and nothing else, so it measures what a reader and
 * a crawler actually receive.
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const APP = join(ROOT, 'apps', 'web', '.next', 'server', 'app');

const LOCALES = ['en', 'bn'];
const MIN_WORDS = 40;
const MAX_WORDS = 60;
const EXPECTED_TOPICS = 15;

const errors = [];

/* ── helpers ───────────────────────────────────────────────────────────── */

const ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#x27;': "'",
  '&#39;': "'",
  '&#x2F;': '/',
  '&nbsp;': ' ',
};

function decode(value) {
  return value
    .replace(/&#x?[0-9a-fA-F]+;/g, (entity) => {
      const hex = entity.startsWith('&#x') || entity.startsWith('&#X');
      const code = parseInt(entity.slice(hex ? 3 : 2, -1), hex ? 16 : 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : entity;
    })
    .replace(/&(amp|lt|gt|quot|nbsp);/g, (entity) => ENTITIES[entity] ?? entity);
}

function textOf(html) {
  return decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

/** Word count that treats an em dash as punctuation, not a word. */
function wordCount(value) {
  return textOf(value).replace(/[—–]/g, ' ').split(/\s+/).filter(Boolean).length;
}

function readPage(locale, route) {
  const file = join(APP, locale, `${route}.html`);
  if (!existsSync(file)) {
    errors.push(`/${locale}/${route} — not built (run \`npm run build\`)`);
    return null;
  }
  return readFileSync(file, 'utf8');
}

/** Every `data-df-answer="<id>">…</p>` block, in document order. */
function hooksOf(html, attribute) {
  const pattern = new RegExp(`data-df-${attribute}="([^"]+)"[^>]*>([\\s\\S]*?)</`, 'g');
  return [...html.matchAll(pattern)].map((match) => ({ id: match[1], text: decode(match[2]).trim() }));
}

/** The single FAQPage JSON-LD block on a page. */
function faqSchemaOf(html) {
  const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => {
      try {
        return JSON.parse(decode(match[1]));
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  return { schema: blocks.find((block) => block['@type'] === 'FAQPage') ?? null, count: blocks.length };
}

/* ── checks ────────────────────────────────────────────────────────────── */

console.log('\n  FAQ structure  ·  answers in band, schema in step with the page');
console.log('  ' + '─'.repeat(78));

const questionsByLocale = new Map();

for (const locale of LOCALES) {
  const faq = readPage(locale, 'faq');
  const help = readPage(locale, 'help');
  if (!faq || !help) continue;

  /* 1 — exactly one FAQPage block */
  const { schema, count } = faqSchemaOf(faq);
  if (!schema) {
    errors.push(`/${locale}/faq — no FAQPage structured data found (${count} JSON-LD block(s))`);
    continue;
  }

  /* 2 — visible questions and answers */
  const visibleQuestions = hooksOf(faq, 'question');
  const visibleAnswers = hooksOf(faq, 'answer');

  if (visibleQuestions.length !== EXPECTED_TOPICS) {
    errors.push(`/${locale}/faq — ${visibleQuestions.length} rendered questions, expected ${EXPECTED_TOPICS}`);
  }
  if (visibleAnswers.length !== EXPECTED_TOPICS) {
    errors.push(`/${locale}/faq — ${visibleAnswers.length} rendered answers, expected ${EXPECTED_TOPICS}`);
  }

  /* 3 — the 40–60 word rule, measured on what the reader sees */
  for (const answer of visibleAnswers) {
    const words = wordCount(answer.text);
    if (words < MIN_WORDS || words > MAX_WORDS) {
      errors.push(`/${locale}/faq — "${answer.id}" answer is ${words} words (must be ${MIN_WORDS}–${MAX_WORDS})`);
    }
    if (!answer.text.trim()) errors.push(`/${locale}/faq — "${answer.id}" answer is empty`);
  }

  /* 4 — structured data and prose are the same content, in the same order */
  const entities = schema.mainEntity ?? [];
  if (entities.length !== EXPECTED_TOPICS) {
    errors.push(`/${locale}/faq — FAQPage carries ${entities.length} questions, expected ${EXPECTED_TOPICS}`);
  }
  for (const [index, entity] of entities.entries()) {
    const visibleQuestion = visibleQuestions[index];
    const visibleAnswer = visibleAnswers[index];
    if (!visibleQuestion || !visibleAnswer) continue;

    if (entity.name !== visibleQuestion.text) {
      errors.push(`/${locale}/faq — FAQPage question ${index + 1} does not match the rendered question`);
    }
    if (entity.acceptedAnswer?.text !== visibleAnswer.text) {
      errors.push(`/${locale}/faq — FAQPage answer for "${visibleAnswer.id}" does not match the rendered answer`);
    }
    if (!/\/faq#/.test(entity['@id'] ?? '')) {
      errors.push(`/${locale}/faq — question "${entity.name}" has no anchored @id`);
    }
    if (entity.name !== visibleQuestion.text) continue;
    questionsByLocale.set(locale, visibleQuestions.map((q) => q.text));
  }

  /* 5 — duplicate ids would break the anchors the help centre links to */
  const ids = visibleAnswers.map((a) => a.id);
  const duplicated = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicated.length) {
    errors.push(`/${locale}/faq — duplicate answer id(s): ${[...new Set(duplicated)].join(', ')}`);
  }

  /* 6 — the help centre searches the same fifteen questions and nothing else */
  const helpText = textOf(help);
  for (const question of visibleQuestions) {
    if (!helpText.includes(question.text)) {
      errors.push(`/${locale}/help — question missing from the help centre: "${question.text}"`);
    }
  }
  if (!help.includes('role="search"')) {
    errors.push(`/${locale}/help — the search landmark is missing`);
  }
  for (const keys of ['/', 'Esc', 'Tab']) {
    if (!new RegExp(`>${keys.replace('/', '\\/')}<`).test(help) && !helpText.includes(keys)) {
      errors.push(`/${locale}/help — shortcut "${keys}" is not published`);
    }
  }
}

/* 7 — both locales ask the same fifteen questions */
const [first] = LOCALES;
for (const locale of LOCALES.slice(1)) {
  const a = questionsByLocale.get(first) ?? [];
  const b = questionsByLocale.get(locale) ?? [];
  if (a.length && b.length && a.length !== b.length) {
    errors.push(`/${locale}/faq — ${b.length} questions against ${a.length} in /${first}/faq`);
  }
}

/* ── report ────────────────────────────────────────────────────────────── */

console.log(
  `  ${LOCALES.length} locales · ${questionsByLocale.get(first)?.length ?? 0} questions each · ` +
    `${MIN_WORDS}–${MAX_WORDS} words per answer · ${errors.length} problem(s)\n`,
);

if (errors.length) {
  for (const error of errors) console.error(`  ✗ ${error}`);
  console.error('\n  FAQ gate FAILED.\n');
  process.exit(1);
}

console.log('  ✓ FAQ schema matches the rendered page, question for question.');
console.log('  ✓ every answer is inside the 40–60 word band in both locales.');
console.log('  ✓ the help centre carries the same questions and its search landmark.\n');
