import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Cloud, Pause, Play, Plane, Radio, Smartphone, Sprout } from 'lucide-react';
import { useInView } from '../../lib/useInView';

const STEP_SECONDS = 4.5;

// Scroll-driven mode: on a wide screen, with motion allowed, the section pins and scroll position
// picks the step. Everywhere else (phones, short windows, reduced motion) the original timer +
// tabs behaviour is untouched.
const PIN_MQ = '(min-width: 992px) and (prefers-reduced-motion: no-preference)';
const SCROLL_VH_PER_STEP = 0.65;
const PIN_GAP = 12;

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

// Which parts of the diagram are lit at each step. Links are keyed a (nodes and
// gateway, LoRa), b (gateway and cloud, Wi-Fi) and c (cloud and app).
const STEPS = [
  {
    title: 'Sense',
    body: 'Solar-powered nodes read soil moisture, temperature and humidity in each zone.',
    on: ['nodes'],
    links: {} as Record<string, 'fwd' | 'rev'>,
  },
  {
    title: 'Send',
    body: 'Readings travel over long-range LoRa radio to the master gateway, which also watches rain and water flow.',
    on: ['nodes', 'gate'],
    links: { a: 'fwd' } as Record<string, 'fwd' | 'rev'>,
  },
  {
    title: 'Decide',
    body: 'The gateway decides whether a zone needs water. When the internet is up it also syncs with the cloud AI. When it is not, the gateway decides on its own.',
    on: ['gate', 'cloud'],
    links: { b: 'fwd' } as Record<string, 'fwd' | 'rev'>,
  },
  {
    title: 'Water',
    body: 'The gateway tells the node to open the valve for the right time, then close it.',
    on: ['gate', 'nodes'],
    links: { a: 'rev' } as Record<string, 'fwd' | 'rev'>,
  },
  {
    title: 'Watch',
    body: 'You see the farm on your phone, get alerts and can switch any zone to manual. The results feed the next decision.',
    on: ['cloud', 'app'],
    links: { b: 'rev', c: 'fwd' } as Record<string, 'fwd' | 'rev'>,
  },
];

export const Working: React.FC = () => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [reduced, setReduced] = useState(prefersReducedMotion);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const scrollToStep = useRef<((i: number) => void) | null>(null);

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
        st = ScrollTrigger.create({
          trigger: section,
          start: () => `top ${pinTop()}px`,
          end: () => `+=${Math.round(window.innerHeight * STEPS.length * SCROLL_VH_PER_STEP)}`,
          pin: true,
          pinSpacing: false, // the wrapper already reserves this distance
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = Math.min(self.progress, 0.9999) * STEPS.length;
            const i = Math.floor(p);
            setStep(i);
            stepsEl?.style.setProperty('--p', String(p - i));
          },
        });
        const trigger = st;
        scrollToStep.current = (i) =>
          window.scrollTo({
            top: trigger.start + ((i + 0.5) / STEPS.length) * (trigger.end - trigger.start),
            behavior: 'instant',
          });
        setPinned(true);
      } catch {
        // The chunk failed to load: hand the reserved scroll distance back and stay on the timer.
        release();
      }
    };

    const engage = () => {
      if (!mq.matches) return;
      // Compact the card to sit under the header, then keep it only if it fits without clipping.
      section.style.setProperty('--aq-pin-top', `${pinTop()}px`);
      section.dataset.pin = 'on';
      if (section.offsetHeight > window.innerHeight - pinTop() - PIN_GAP + 1) {
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
    const onChange = () => {
      setReduced(mq.matches);
      if (mq.matches) setPlaying(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // In scroll mode nothing autoplays; the diagram links animate whenever the section is seen.
  const running = pinned ? inView : playing && inView && !reduced;
  const current = STEPS[step];
  const lit = (id: string) => (current.on.includes(id) ? '' : undefined);
  const dir = (id: string) => current.links[id];

  // Scroll is the single source of truth while pinned, so choosing a step moves the page to it.
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
      End: STEPS.length - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    go(Math.max(0, Math.min(STEPS.length - 1, map[e.key])), true);
  };

  return (
    // GSAP re-parents the pinned node into a pin-spacer. Keeping the section inside this wrapper
    // means React's own unmount removes the wrapper, whose parent never changes.
    <div ref={wrapRef} className="aq-work-pin" style={{ '--aq-pin-vh': STEPS.length * SCROLL_VH_PER_STEP } as React.CSSProperties}>
    <section id="how-it-works" ref={sectionRef} className="aq-sec aq-sec--dark" aria-labelledby="working-title">
      <div className="aq-wrap aq-work">
        <div className="aq-work-text">
          <h2 id="working-title" className="aq-h2">How AquaSol works.</h2>
          <p className="aq-lead">A loop that runs on the farm, with or without the internet.</p>

          <div
            className="aq-steps"
            role="tablist"
            aria-label="Steps of the irrigation loop"
            ref={stepsRef}
            data-running={running ? "true" : "false"}
            data-scroll={pinned ? 'true' : undefined}
            onKeyDown={onKeyDown}
          >
            {STEPS.map((s, i) => (
              <button
                key={s.title}
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
                <span className="aq-step-name">{s.title}</span>
                <span
                  className="aq-step-fill"
                  aria-hidden="true"
                  data-active={i === step ? 'true' : 'false'}
                  onAnimationEnd={() => go((i + 1) % STEPS.length)}
                  style={{ animationDuration: `${STEP_SECONDS}s` }}
                />
              </button>
            ))}
          </div>

          <div id="work-panel" role="tabpanel" aria-labelledby={`work-tab-${step}`} className="aq-step-detail">
            <p key={step}>{current.body}</p>
          </div>

          {!pinned && (
            <button
              type="button"
              className="aq-play"
              onClick={() => setPlaying((p) => !p)}
              aria-pressed={!playing}
            >
              {playing && !reduced ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
              <span>{playing && !reduced ? 'Pause animation' : 'Play animation'}</span>
            </button>
          )}
        </div>

        <div
          ref={ref}
          className="aq-flow"
          data-running={running ? 'true' : 'false'}
          role="img"
          aria-label="Diagram: field nodes send readings by LoRa radio to the master gateway, which syncs with the cloud AI and the app, and commands the valves."
        >
          <div className="aq-fnode aq-area-nodes" data-on={lit('nodes')}>
            <Sprout size={20} aria-hidden="true" />
            <h3>Field nodes</h3>
            <p>Soil moisture, temperature, humidity and a valve, on solar power</p>
          </div>

          <div className="aq-conn aq-area-a" data-orient="h" data-on={dir('a') ? '' : undefined} data-dir={dir('a')}>
            <span>LoRa</span>
          </div>

          <div className="aq-fnode aq-area-gate" data-on={lit('gate')}>
            <Radio size={20} aria-hidden="true" />
            <h3>Master gateway</h3>
            <p>Decides on the farm, so it works offline</p>
          </div>

          <div className="aq-conn aq-area-b" data-orient="h" data-on={dir('b') ? '' : undefined} data-dir={dir('b')}>
            <span>Wi-Fi</span>
          </div>

          <div className="aq-fnode aq-area-cloud" data-on={lit('cloud')}>
            <Cloud size={20} aria-hidden="true" />
            <h3>Cloud and AI</h3>
            <p>Stores readings and runs the AI models</p>
          </div>

          <div className="aq-conn aq-area-c" data-orient="v" data-on={dir('c') ? '' : undefined} data-dir={dir('c')} />

          <div className="aq-fnode aq-area-app" data-on={lit('app')}>
            <Smartphone size={20} aria-hidden="true" />
            <h3>AquaSol app</h3>
            <p>Farm health, alerts, manual override</p>
          </div>

          <div className="aq-fnode aq-fnode--planned aq-area-drone">
            <Plane size={20} aria-hidden="true" />
            <h3>Drone scan, planned</h3>
            <p>Thermal, multispectral and RGB cameras add a one-off view of the field</p>
          </div>

        </div>
      </div>
    </section>
    </div>
  );
};
