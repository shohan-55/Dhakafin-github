/**
 * Bangladeshi financial formatting.
 * DF-P1-003 · blueprint §2.8 — one central formatter, never inline formatting.
 *
 * Rules:
 *  - Money always shows ৳ and uses lakh-crore grouping: 12,34,567 (not 1,234,567).
 *  - Dashboards use the compact form: ৳12.5 L, ৳1.23 Cr.
 *  - Digits stay Latin for financial data (easier parsing); Bangla numerals are an
 *    explicit opt-in via `numerals: 'bn'`.
 */

const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'] as const;

export type NumeralSystem = 'latin' | 'bn';

export interface BdtOptions {
  /** Compact form for dashboards and tiles: ৳12.5 L */
  compact?: boolean;
  /** Hide the ৳ symbol (for table cells with a column header) */
  hideSymbol?: boolean;
  /** Latin (default) or Bangla numerals */
  numerals?: NumeralSystem;
  /** Decimal places (default: 0 for full, 2 for compact) */
  maximumFractionDigits?: number;
  /** Show an explicit sign (+/−) */
  signed?: boolean;
}

const lakhCrore = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 20 });

function toBanglaDigits(input: string): string {
  return input.replace(/[0-9]/g, (d) => BANGLA_DIGITS[Number(d)] ?? d);
}

/** Full lakh-crore grouping, e.g. 1234567 → "12,34,567" */
export function formatNumber(value: number, numerals: NumeralSystem = 'latin'): string {
  const formatted = lakhCrore.format(value);
  return numerals === 'bn' ? toBanglaDigits(formatted) : formatted;
}

/**
 * Compact Bangladeshi money: K (thousand) < 1 L (lakh) < 1 Cr (crore).
 * Thresholds follow BD usage: 1 lakh = 100,000 · 1 crore = 10,000,000.
 */
export function formatCompactNumber(value: number, numerals: NumeralSystem = 'latin'): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  let text: string;

  if (abs >= 1_00_00_000) {
    text = `${trimZeros((abs / 1_00_00_000).toFixed(2))} Cr`;
  } else if (abs >= 1_00_000) {
    text = `${trimZeros((abs / 1_00_000).toFixed(2))} L`;
  } else if (abs >= 1_000) {
    text = `${trimZeros((abs / 1_000).toFixed(1))} K`;
  } else {
    text = formatNumber(abs, 'latin');
  }

  const withSign = `${sign}${text}`;
  return numerals === 'bn' ? toBanglaDigits(withSign) : withSign;
}

function trimZeros(input: string): string {
  return input.replace(/\.?0+$/, '');
}

/** Primary money formatter. Always use this — never format currency inline. */
export function formatBDT(value: number, options: BdtOptions = {}): string {
  const { compact = false, hideSymbol = false, numerals = 'latin', maximumFractionDigits, signed = false } = options;

  const body = compact
    ? formatCompactNumber(value, numerals)
    : formatNumber(Number(value.toFixed(maximumFractionDigits ?? 0)), numerals);

  const prefix = hideSymbol ? '' : '৳';
  const sign = signed && value > 0 ? '+' : '';

  return `${sign}${prefix}${body}`;
}

/** Percentage with a fixed decimal policy: 18.4% */
export function formatPercent(value: number, digits = 1, numerals: NumeralSystem = 'latin'): string {
  const text = `${value.toFixed(digits)}%`;
  return numerals === 'bn' ? toBanglaDigits(text) : text;
}

/** Signed delta for KPI tiles: +18.4% / −2.3% */
export function formatDelta(value: number, digits = 1): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${Math.abs(value).toFixed(digits)}%`;
}

/** Direction helper — drives arrow + colour + qualifier logic. */
export function deltaDirection(value: number): 'up' | 'down' | 'flat' {
  if (value > 0.05) return 'up';
  if (value < -0.05) return 'down';
  return 'flat';
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

const BANGLA_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর',
] as const;

/** DD MMM YYYY (en) / DD <Bangla month> YYYY (bn) */
export function formatDate(date: Date | string, locale: 'en' | 'bn' = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '—';

  const day = String(d.getDate()).padStart(2, '0');
  const month = locale === 'bn' ? BANGLA_MONTHS[d.getMonth()] : MONTHS[d.getMonth()];
  const year = d.getFullYear();

  return `${locale === 'bn' ? toBanglaDigits(day) : day} ${month} ${locale === 'bn' ? toBanglaDigits(String(year)) : year}`;
}

/** Bangladesh fiscal year label: FY 2025–26 (Jul–Jun) */
export function formatFiscalYear(date: Date = new Date()): string {
  const year = date.getFullYear();
  const start = date.getMonth() >= 6 ? year : year - 1;
  return `FY ${start}–${String(start + 1).slice(2)}`;
}

/** Days remaining until a date, relative to today. Negative = overdue. */
export function daysUntil(date: Date | string, from: Date = new Date()): number {
  const target = typeof date === 'string' ? new Date(date) : date;
  const a = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const b = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((a - b) / 86_400_000);
}

/** "in 6 days" · "today" · "3 days overdue" */
export function formatDueIn(days: number): string {
  if (days === 0) return 'due today';
  if (days === 1) return 'due tomorrow';
  if (days > 1) return `in ${days} days`;
  if (days === -1) return '1 day overdue';
  return `${Math.abs(days)} days overdue`;
}

/** Relative timestamp for metadata lines: "4h ago" */
export function formatRelativeTime(date: Date | string, now: Date = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.round((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;

  return formatDate(d);
}

/**
 * Parse user-typed money input. Accepts "12,34,567", "12.5L", "1.2 Cr", "৩৪৫".
 * Returns null when the value cannot be understood (callers must handle this
 * rather than silently coercing to 0 — a wrong financial number is worse than none).
 */
export function parseMoneyInput(raw: string): number | null {
  if (!raw) return null;

  const normalised = raw
    .trim()
    .replace(/৳/g, '')
    .replace(/,/g, '')
    .replace(/[০-৯]/g, (d) => String(BANGLA_DIGITS.indexOf(d as (typeof BANGLA_DIGITS)[number])));

  const match = normalised.match(/^(-?\d*\.?\d+)\s*(k|l|lakh|lac|cr|crore)?$/i);
  if (!match) return null;

  const base = Number(match[1]);
  if (!Number.isFinite(base)) return null;

  const unit = match[2]?.toLowerCase();
  const multiplier =
    unit === 'k' ? 1_000 : unit === 'l' || unit === 'lakh' || unit === 'lac' ? 1_00_000 : unit === 'cr' || unit === 'crore' ? 1_00_00_000 : 1;

  return base * multiplier;
}

/** Human label for a turnover band — used by the diagnostic and industry pages. */
export const TURNOVER_BANDS = [
  { id: 'under-30l', label: 'Under ৳30 L', note: 'Typically outside VAT/turnover-tax registration' },
  { id: '30l-80l', label: '৳30 L – ৳80 L', note: 'Turnover tax band / enlistment' },
  { id: '80l-3cr', label: '৳80 L – ৳3 Cr', note: 'VAT registration generally required' },
  { id: '3cr-10cr', label: '৳3 Cr – ৳10 Cr', note: 'Full VAT regime, audit-ready books advised' },
  { id: '10cr-50cr', label: '৳10 Cr – ৳50 Cr', note: 'Internal control + cost efficiency priority' },
  { id: 'above-50cr', label: 'Above ৳50 Cr', note: 'Corporate governance and CFO-level reporting' },
] as const;

export type TurnoverBandId = (typeof TURNOVER_BANDS)[number]['id'];
