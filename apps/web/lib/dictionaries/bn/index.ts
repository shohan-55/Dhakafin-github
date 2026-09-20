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
import { services } from './services';

export const bn = {
  ...chrome,
  home,
  states,
  services,
};
