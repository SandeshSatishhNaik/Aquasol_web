import type Lenis from 'lenis';
import { prefersReducedMotion } from './usePrefersReducedMotion';

/**
 * The one Lenis instance. Components never import Lenis: they use plain ScrollTrigger, which
 * Lenis keeps in sync. Lenis, GSAP and Lenis's CSS are imported dynamically inside
 * `startSmoothScroll`, so this module stays tiny and none of them land in the initial chunk.
 */
let lenis: Lenis | null = null;
let starting: Promise<void> | null = null;

export function startSmoothScroll(): Promise<void> {
  if (starting) return starting;
  starting = (async () => {
    const [{ default: LenisCtor }, { gsap }, { ScrollTrigger }] = await Promise.all([
      import('lenis'),
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('lenis/dist/lenis.css'),
    ]);
    gsap.registerPlugin(ScrollTrigger);
    const instance = new LenisCtor({
      autoRaf: false, // driven by gsap.ticker below, so there is one rAF loop, not two
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false, // phones keep native touch scrolling
      stopInertiaOnNavigate: true,
      anchors: false, // the nav routes its own scrolling through scrollTo()
      // respectReducedMotion defaults to true: no smoothing and instant scrolls, while Lenis
      // keeps ticking so ScrollTrigger stays in sync.
    });
    instance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => instance.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Lenis ignores native scroll events while it is easing (isScrolling === 'smooth') and writes
    // its eased position back on the next frame. So a keyboard jump (End, PageDown, Space), a
    // Tab-focus scroll, or a scrollbar drag made mid-ease was undone. Before any of those, end
    // the ease: stop()+start() runs Lenis's reset(), which adopts the live scroll position, and
    // unlike an immediate scrollTo() it does not swallow the next native scroll event. Guarded on
    // 'smooth', so it never unlocks a Lenis stopped by a modal.
    const cancelEase = () => {
      if (instance.isScrolling !== 'smooth') return;
      instance.stop();
      instance.start();
    };
    window.addEventListener('keydown', cancelEase, true);
    window.addEventListener('focusin', cancelEase, true);
    window.addEventListener('pointerdown', cancelEase, true);

    lenis = instance;
  })().catch(() => {
    // The chunk failed to load: stay on native scrolling, which is fully functional.
    starting = null;
  });
  return starting;
}

/**
 * Scroll to an element or a Y position. Both paths honour the element's `scroll-margin-top`:
 * Lenis reads it itself, and so does native `scrollIntoView`, so no offset is passed.
 */
export function scrollTo(target: HTMLElement | number, { immediate = false } = {}): void {
  const behavior: ScrollBehavior = immediate || prefersReducedMotion() ? 'auto' : 'smooth';
  // Lenis is for the wheel and trackpad, where its easing is the point. Programmatic jumps (nav,
  // CTAs, deep links) use the browser's own smooth scroll, which runs on the compositor thread:
  // Lenis would ease them from JavaScript on the main thread, and measured INP showed input
  // arriving during those long eases waiting behind it. A Lenis wheel ease still in flight is
  // ended first, or it would write its own position over the jump (see cancelEase).
  if (lenis?.isScrolling === 'smooth') {
    lenis.stop();
    lenis.start();
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior });
  else target.scrollIntoView({ behavior });
}

/** Freeze page scrolling (modals, drawer). Pair with the existing body-overflow lock. */
export const lockScroll = (): void => lenis?.stop();
export const unlockScroll = (): void => lenis?.start();
