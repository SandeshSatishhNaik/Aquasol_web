import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { scrollTo } from '../../lib/smoothScroll';
import { LoopDiagram } from './LoopDiagram';
import { STAGES } from './loopStages';

// Scroll-driven mode: wherever motion is allowed, the section pins under the header and scroll
// position picks the stage, draws the loop and moves the camera. Under reduced motion (or if the
// card cannot fit, a safety net for very short windows) the tabs pick a stage instead.
const PIN_MQ = '(prefers-reduced-motion: no-preference)';
const SCROLL_VH_PER_STEP = 0.6;
const PIN_GAP = 12;
const MIN_LOOP_HEIGHT = 200; // below this the diagram is too small to read, so don't pin

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Resolves once the page has not scrolled for about 200ms. */
const scrollSettled = () =>
  new Promise<void>((resolve) => {
    let last = window.scrollY;
    let still = 0;
    const tick = () => {
      if (window.scrollY === last) {
        if (++still > 12) return resolve();
      } else {
        last = window.scrollY;
        still = 0;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });

/** Bottom edge of the sticky header, so the pinned card starts clear of it. */
const pinTop = () =>
  Math.round((document.querySelector('.header')?.getBoundingClientRect().bottom ?? 88) + PIN_GAP);

export const Working: React.FC = () => {
  const [step, setStep] = useState(0);
  const [reduced, setReduced] = useState(prefersReducedMotion);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const scrollToStep = useRef<((i: number) => void) | null>(null);
  const driveLoop = useRef<((pos: number) => void) | null>(null);

  // Decide, before first paint, whether this viewport can pin, and reserve the scroll distance in
  // CSS (`data-mode="pin"` on the wrapper). Because the space is already there, GSAP arriving later
  // changes nothing about layout. GSAP is dynamically imported (it is never in the initial bundle)
  // and initialised at idle after page load, not on approach: ScrollTrigger's first refresh restores
  // the scroll position, which would cancel an in-flight smooth scroll from a nav link.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const wrap = wrapRef.current;
    if (!section || !wrap) return;
    const mq = window.matchMedia(PIN_MQ);
    let disposed = false;
    let idle: number | null = null;
    let st: { kill: () => void; start: number; end: number } | null = null;

    const release = () => {
      delete section.dataset.pin;
      delete wrap.dataset.mode;
    };

    const reset = () => {
      if (idle !== null) cancelIdleCallback(idle);
      idle = null;
      st?.kill();
      st = null;
      scrollToStep.current = null;
      release();
    };

    const pin = async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
        if (disposed || !mq.matches || st) return;
        // ScrollTrigger's first refresh restores scroll position, which would cancel a smooth
        // scroll already under way (a nav click or deep link that arrived with the sections).
        await scrollSettled();
        if (disposed || !mq.matches || st) return;
        gsap.registerPlugin(ScrollTrigger);
        const stepsEl = stepsRef.current;
        const n = STAGES.length;
        st = ScrollTrigger.create({
          trigger: section,
          start: () => `top ${pinTop()}px`,
          end: () => `+=${Math.round(window.innerHeight * n * SCROLL_VH_PER_STEP)}`,
          pin: true,
          pinSpacing: false, // the wrapper already reserves this distance
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = Math.min(self.progress, 0.9999) * n;
            const i = Math.floor(p);
            setStep(i);
            stepsEl?.style.setProperty('--p', String(p - i));
            driveLoop.current?.(self.progress * n);
          },
        });
        const trigger = st;
        // Land in the middle of the stage's drawing, after the camera has arrived.
        scrollToStep.current = (i) =>
          scrollTo(trigger.start + ((i + 0.6) / n) * (trigger.end - trigger.start), { immediate: true });
        setPinned(true);
      } catch {
        // The chunk failed to load: hand the reserved scroll distance back and use the tabs.
        release();
      }
    };

    const engage = () => {
      if (!mq.matches) return;
      // Size the card to the viewport under the header, then keep it only if everything fits
      // and the diagram is still big enough to read.
      section.style.setProperty('--aq-pin-top', `${pinTop()}px`);
      section.dataset.pin = 'on';
      const loop = section.querySelector<HTMLElement>('.aql');
      if (section.scrollHeight > section.clientHeight + 1 || (loop?.clientHeight ?? 0) < MIN_LOOP_HEIGHT) {
        delete section.dataset.pin;
        return;
      }
      wrap.dataset.mode = 'pin';
      const schedule = () => {
        idle = requestIdleCallback(() => void pin(), { timeout: 4000 });
      };
      if (document.readyState === 'complete') schedule();
      else window.addEventListener('load', schedule, { once: true });
    };

    const onChange = () => {
      reset();
      setPinned(false);
      engage();
    };

    engage();
    // Web fonts change text metrics, so re-check the fit once they have loaded.
    void document.fonts?.ready.then(() => {
      if (!disposed && !st) {
        reset();
        engage();
      }
    });
    mq.addEventListener('change', onChange);

    return () => {
      disposed = true;
      mq.removeEventListener('change', onChange);
      reset();
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Scroll is the single source of truth while pinned, so choosing a stage moves the page to it.
  const go = (i: number, focus = false) => {
    if (scrollToStep.current) scrollToStep.current(i);
    else setStep(i);
    if (focus) tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowDown: step + 1,
      ArrowRight: step + 1,
      ArrowUp: step - 1,
      ArrowLeft: step - 1,
      Home: 0,
      End: STAGES.length - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    go(Math.max(0, Math.min(STAGES.length - 1, map[e.key])), true);
  };

  return (
    // GSAP re-parents the pinned node into a pin-spacer. Keeping the section inside this wrapper
    // means React's own unmount removes the wrapper, whose parent never changes.
    <div ref={wrapRef} className="aq-work-pin" style={{ '--aq-pin-vh': STAGES.length * SCROLL_VH_PER_STEP } as React.CSSProperties}>
    <section id="how-it-works" ref={sectionRef} className="aq-sec aq-sec--dark" aria-labelledby="working-title">
      <div className="aq-wrap aq-work">
        <div className="aq-work-text">
          <div className="aq-work-head">
            <h2 id="working-title" className="aq-h2">How AquaSol works.</h2>
            <p className="aq-lead">A loop that runs on the farm, with or without the internet.</p>
          </div>

          <div
            className="aq-steps"
            role="tablist"
            aria-label="Stages of the AquaSol loop"
            ref={stepsRef}
            data-scroll={pinned ? 'true' : undefined}
            onKeyDown={onKeyDown}
          >
            {STAGES.map((s, i) => (
              <button
                key={s.name}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`work-tab-${i}`}
                aria-selected={i === step}
                aria-controls="work-panel"
                tabIndex={i === step ? 0 : -1}
                className="aq-step"
                onClick={() => go(i)}
              >
                <span className="aq-step-name">{s.name}</span>
                <span className="aq-step-fill" aria-hidden="true" data-active={i === step ? 'true' : 'false'} />
              </button>
            ))}
          </div>

          {/* Every caption sits in the same grid cell, so the panel is always as tall as the longest
              one: switching stages never changes the layout, and the pin's fit check sees the worst case. */}
          <div id="work-panel" role="tabpanel" aria-labelledby={`work-tab-${step}`} className="aq-step-detail">
            {STAGES.map((s, i) => (
              <p key={i === step ? `on-${step}` : i} data-current={i === step ? 'true' : undefined} aria-hidden={i !== step}>
                {s.body}
              </p>
            ))}
          </div>
        </div>

        <LoopDiagram className="aq-work-loop" step={step} driven={pinned} reduced={reduced} drive={driveLoop} />
      </div>
    </section>
    </div>
  );
};
