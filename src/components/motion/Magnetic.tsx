import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/usePrefersReducedMotion';

interface MagneticProps {
  children: React.ReactNode;
  /** Share of the pointer's offset from centre that the element follows. */
  strength?: number;
  className?: string;
}

/**
 * The wrapped element leans toward the pointer while it is hovered and springs back on leave.
 * No GSAP, so it is safe in the initial chunk (Hero, Navbar). Transform only. Active only for a
 * fine pointer with motion allowed; touch and reduced motion get the plain element.
 */
export const Magnetic: React.FC<MagneticProps> = ({ children, strength = 0.28, className }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    };
    const leave = () => {
      el.style.transform = '';
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={className ? `aq-magnetic ${className}` : 'aq-magnetic'}>
      {children}
    </span>
  );
};
