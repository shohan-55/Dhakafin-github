import { defaultLocale, type Locale } from './i18n';
import { en, type Dictionary } from './dictionaries/en';
import { bn } from './dictionaries/bn';

/**
 * Dictionary loader — DF-P2-001
 * ---------------------------------------------------------------------------
 * Static imports rather than dynamic `import()` on purpose. Two locales of plain
 * objects cost a few kilobytes, both are needed at build time anyway because
 * every page is prerendered in both, and a dynamic import would buy nothing
 * while making it possible to ship a page whose dictionary failed to load.
 *
 * When Phase 3 moves content into Filament, this module becomes the one place
 * that changes: the loader's signature stays, and the strings come from the API.
 */
const dictionaries: Record<Locale, Dictionary> = { en, bn };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/**
 * Placeholder interpolation: `interpolate('Switch to {language}', { language: 'বাংলা' })`.
 *
 * Deliberately not a template-literal call. Translations are data, and a
 * translator editing a JSON file in the CMS cannot be expected to keep a
 * JavaScript expression intact — `{name}` survives a round-trip through a
 * translation tool, `${name}` does not.
 */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match,
  );
}

export type { Dictionary };
