/**
 * EN dictionary — composition root.
 * ---------------------------------------------------------------------------
 * Each namespace lives in its own module so that a content file stays readable
 * and reviewable as the site grows. The composed object is what every component
 * sees, so splitting is invisible to consumers: `getDictionary(locale).home.hero`
 * works exactly as before.
 */
import { about } from './about';
import { chrome } from './chrome';
import { help } from './help';
import { home } from './home';
import { states } from './states';
import { costEfficiency } from './cost-efficiency';
import { industries } from './industries';
import { pricing } from './pricing';
import { services } from './services';
import { tools } from './tools';

export const en = {
  ...chrome,
  help,
  about,
  home,
  states,
  services,
  industries,
  pricing,
  tools,
  costEfficiency,
};

/**
 * The canonical dictionary type. Bengali is declared as `Dictionary`, so both
 * locales must have identical structure — enforced by `tsc`, not by review.
 */
export type Dictionary = typeof en;
