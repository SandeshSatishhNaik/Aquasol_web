import { useEffect, useRef, useState } from 'react';

/**
 * Observe when an element first enters the viewport.
 * Returns a ref to attach and a latch-once `inView` flag.
 * Under `prefers-reduced-motion` the flag is set immediately so
 * content renders in its final state with no transition.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.3) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(
    () =>
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, inView]);

  return { ref, inView };
}
