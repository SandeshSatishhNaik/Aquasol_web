import React from 'react';
import { useInView } from '../../lib/useInView';

interface RevealProps {
  children: React.ReactNode;
  /** Stagger offset in ms. Callers pass an index-based value for lists. */
  delay?: number;
  /** Fraction of the element that must be visible before it reveals. */
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Section entrance. Transform and opacity only, driven by CSS so nothing ships
 * in the JS bundle for it, and latched by the shared `useInView` hook, which
 * already resolves to `true` immediately under `prefers-reduced-motion`.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  threshold = 0.2,
  className,
  style,
}) => {
  const { ref, inView } = useInView<HTMLDivElement>(threshold);
  return (
    <div
      ref={ref}
      data-reveal=""
      data-in-view={inView}
      className={className}
      style={delay ? { ...style, '--aq-reveal-delay': `${delay}ms` } as React.CSSProperties : style}
    >
      {children}
    </div>
  );
};
