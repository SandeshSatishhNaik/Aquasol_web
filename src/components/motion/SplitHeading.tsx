import React, { useRef } from 'react';
import { gsap, MOTION_OK, SplitText, useGSAP } from '../../lib/gsap';

type Tag = 'h2' | 'h3' | 'p';

interface SplitHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: Tag;
  /** `lines` for most headings; `words` for display headings where each word should land. */
  by?: 'lines' | 'words';
  children: React.ReactNode;
}

/**
 * A heading whose lines (or words) rise out of a clipping mask as it scrolls into view.
 *
 * - `aria: 'auto'` (SplitText's default) puts the full text in `aria-label` and hides the
 *   fragments, so screen readers read whole words, not pieces.
 * - `autoSplit` re-splits when web fonts finish loading or the width changes, which is the fix for
 *   SplitText's documented caveat that splitting before fonts load misaligns lines. The tween is
 *   returned from `onSplit`, so SplitText reverts and rebuilds it on every re-split.
 * - Plays once: text should not un-reveal when you scroll back up.
 * - Under reduced motion the matchMedia branch never runs, so the heading is plain text.
 */
export const SplitHeading: React.FC<SplitHeadingProps> = ({ as: As = 'h2', by = 'lines', children, ...rest }) => {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        SplitText.create(el, {
          type: by === 'words' ? 'words,lines' : 'lines',
          mask: by,
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(by === 'words' ? self.words : self.lines, {
              yPercent: 115,
              duration: 1.05,
              ease: 'expo.out',
              stagger: by === 'words' ? 0.06 : 0.1,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }),
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <As ref={ref} {...rest}>
      {children}
    </As>
  );
};
