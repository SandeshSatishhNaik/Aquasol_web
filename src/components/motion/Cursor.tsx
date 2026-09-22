import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/usePrefersReducedMotion';

const INTERACTIVE = 'a, button, input, textarea, select, label, [role="tab"], [data-cursor]';

/**
 * A small accent dot that trails the pointer and opens into a ring over anything interactive.
 * It never replaces or hides the native cursor. Desktop pointers only, off under reduced motion,
 * invisible to assistive tech. The animation loop runs only while the dot is catching up, so an
 * idle page spends no frames on it.
 */
export const Cursor: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = ref.current;
    if (!dot || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    let tx = -100, ty = -100, x = -100, y = -100;
    let raf = 0;

    const step = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.2 ? requestAnimationFrame(step) : 0;
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.dataset.on = '';
      if (!raf) raf = requestAnimationFrame(step);
    };
    const over = (e: PointerEvent) => {
      const hit = (e.target as Element | null)?.closest?.(INTERACTIVE);
      if (hit) dot.dataset.hover = '';
      else delete dot.dataset.hover;
    };
    const out = () => delete dot.dataset.on;

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', out);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', out);
    };
  }, []);

  return <div ref={ref} className="aq-cursor" aria-hidden="true" />;
};

export default Cursor;
