/**
 * BN dictionary — composition root.
 * ---------------------------------------------------------------------------
 * Each namespace lives in its own module so that a content file stays readable
 * and reviewable as the site grows. The composed object is what every component
 * sees, so splitting is invisible to consumers: `getDictionary(locale).home.hero`
 * works exactly as before.
 */
import { chrome } from './chrome';
import { home } from './home';
import { states } from './states';
import { costEfficiency } from './cost-efficiency';
import { industries } from './industries';
import { services } from './services';
import { tools } from './tools';

import type { Dictionary } from '../en';

export const bn: Dictionary = {
  ...chrome,
  home,
  states,
  services,
  industries,
  tools,
  costEfficiency,
};
