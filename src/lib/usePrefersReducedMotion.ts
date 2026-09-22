import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** Synchronous read, for code outside React (event handlers, module setup). */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(QUERY).matches;

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/**
 * Live `prefers-reduced-motion`. Unlike a one-off `matchMedia` read, this re-renders when the
 * user changes the setting mid-session. SSR-safe: the server snapshot is `false`.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
