import { scrollTo } from './smoothScroll';

/**
 * Scroll to a section by id, waiting for it to exist. Sections under the hero mount just after
 * first paint (and arrive in a lazy chunk), so a click or deep link can beat its target by a few
 * frames. Gives up after `tries` frames (about 5s at 60fps).
 */
export function scrollToId(id: string, tries = 300): void {
  const el = document.getElementById(id);
  if (el) {
    scrollTo(el);
  } else if (tries > 0) {
    requestAnimationFrame(() => scrollToId(id, tries - 1));
  }
}
