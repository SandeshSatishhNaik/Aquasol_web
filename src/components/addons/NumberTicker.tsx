import React, { useEffect, useRef, useState } from 'react';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  delay?: number;
  className?: string;
  decimalPlaces?: number;
  suffix?: string;
  prefix?: string;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  direction = 'up',
  delay = 0,
  className = '',
  decimalPlaces = 0,
  suffix = '',
  prefix = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState<number>(
    direction === 'down' ? value : 0
  );
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const startTime = performance.now() + delay * 1000;
          const duration = 1800; // ms

          const startVal = direction === 'down' ? value : 0;
          const endVal = direction === 'down' ? 0 : value;

          const tick = (now: number) => {
            if (now < startTime) {
              requestAnimationFrame(tick);
              return;
            }

            const elapsed = Math.min((now - startTime) / duration, 1);
            // Ease-out cubic
            const progress = 1 - Math.pow(1 - elapsed, 3);
            const current = startVal + (endVal - startVal) * progress;

            setDisplayValue(current);

            if (elapsed < 1) {
              requestAnimationFrame(tick);
            } else {
              setDisplayValue(endVal);
            }
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, direction, delay, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })}
      {suffix}
    </span>
  );
};
