import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, Pause, Play } from 'lucide-react';
import { scrollToId } from '../../lib/scrollToId';
import { Magnetic } from '../motion/Magnetic';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';
import { media } from '../../lib/media';

const HERO_POSTER = media('aquasol-hero-poster.jpg');

// Scroll length: how many viewports of scroll it takes the drop to fill the screen.
// Shorter on phones, where a long pin eats too much of a short session.
const LEN_DESKTOP = 1.4;
const LEN_MOBILE = 1.1;
const MOBILE_MQ = '(max-width: 700px)';
const PIN_MQ = '(prefers-reduced-motion: no-preference)';

// The drop's tip leans right, echoing the drop in the AquaSol mark, instead of a symmetric teardrop.
const DROP_PATH = 'M61 1C57 28 8 52 8 84a42 42 0 0 0 84 0C92 56 65 36 61 1Z';
const DROP_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 130'><path d='${DROP_PATH}'/></svg>`,
)}")`;

const onIdle = (fn: () => void): number =>
  window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: 4000 }) : window.setTimeout(fn, 200);
const cancelIdle = (id: number) =>
  window.cancelIdleCallback ? window.cancelIdleCallback(id) : window.clearTimeout(id);

/** Resolves once the page has not scrolled for about 200ms (see Working.tsx for why). */
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

const pinTop = () => Math.round(document.querySelector('.header')?.getBoundingClientRect().bottom ?? 88);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeInPow2 = (t: number) => t * t;
const easeOutPow1 = (t: number) => t;
const elasticOut = (t: number) => {
  if (t === 0 || t === 1) return t;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface Geometry {
  w: number;
  h: number;
  cx: number;
  cy: number;
  /** Top of the slot within the stage - where the entrance fall starts from. */
  sy0: number;
  sw: number;
  smax: number;
  tLeft: number;
  dy: number;
  mobile: boolean;
}

interface EntranceState {
  on: boolean;
  y: number;
  sx: number;
  sy: number;
  o: number;
}

/**
 * The hero's headline has a drop-shaped window cut into it, playing the field video, echoing the
 * drop in the AquaSol mark. On load the drop falls into place; as the visitor scrolls, it grows
 * until the field fills the screen and the headline settles low-left over it. This is the
 * scroll-driven set-piece from the hero research/prep pass (see the published prep artifacts);
 * `render()` is a pure function of one progress number, shared by the load entrance (a small
 * rAF timeline, no library) and the scroll growth (GSAP ScrollTrigger, loaded dynamically at idle
 * exactly like Working.tsx's pin, for the same cross-browser reliability reasons documented there).
 */
export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rimRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const everyRef = useRef<HTMLSpanElement>(null);
  const dropWordRef = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const landRingRef = useRef<HTMLSpanElement>(null);

  const geomRef = useRef<Geometry | null>(null);
  const entRef = useRef<EntranceState>({ on: false, y: 0, sx: 1, sy: 1, o: 1 });
  const progressRef = useRef(0);
  const rippledRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [sourcesReady, setSourcesReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 1));
    const id = idle(() => setSourcesReady(true));
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
  }, []);

  // The stage sits flush under the sticky header; its exact height depends on the header's own
  // (responsive) height, so it is measured rather than guessed.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const setHeaderVar = () => {
      const h = document.querySelector('.header')?.getBoundingClientRect().height ?? 88;
      stage.style.setProperty('--aqh-hdr', `${Math.round(h)}px`);
    };
    setHeaderVar();
    window.addEventListener('resize', setHeaderVar);
    return () => window.removeEventListener('resize', setHeaderVar);
  }, []);

  // The one render function: given a 0-1 progress (scroll growth, or the load entrance overlaid
  // on top of it), sets every transform/opacity the moment needs. Kept as plain DOM writes -
  // this runs on every scroll tick, so it stays off React's render path entirely.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const drop = dropRef.current;
    const video = videoRef.current;
    const rim = rimRef.current;
    const title = titleRef.current;
    const line1 = line1Ref.current;
    const everyEl = everyRef.current;
    const dropWord = dropWordRef.current;
    const slot = slotRef.current;
    const side = sideRef.current;
    const chip = chipRef.current;
    const cue = cueRef.current;
    if (!stage || !drop || !video || !rim || !title || !line1 || !everyEl || !dropWord || !slot || !side || !chip || !cue)
      return;

    const measure = () => {
      const r = stage.getBoundingClientRect();
      const s = slot.getBoundingClientRect();
      const t = title.getBoundingClientRect();
      const mobile = window.matchMedia(MOBILE_MQ).matches;
      const sw = s.width;
      const cx = s.left - r.left + sw / 2;
      const cy = s.top - r.top + 0.84 * sw;
      const d = Math.max(
        Math.hypot(cx, cy),
        Math.hypot(r.width - cx, cy),
        Math.hypot(cx, r.height - cy),
        Math.hypot(r.width - cx, r.height - cy),
      );
      const smax = (d / 0.42) * 1.04 / sw;
      const targetY = mobile ? side.getBoundingClientRect().top - r.top - 24 : r.height - 40;
      const g: Geometry = {
        w: r.width,
        h: r.height,
        cx,
        cy,
        sy0: s.top - r.top,
        sw,
        smax,
        tLeft: s.left - r.left, // not the true title-left, just enough headroom for the parting words
        dy: Math.max(0, targetY - (t.bottom - r.top)),
        mobile,
      };
      geomRef.current = g;
    };

    const render = (p: number) => {
      const g = geomRef.current;
      if (!g) return;
      const ent = entRef.current;
      const e = easeInOutCubic(clamp01((p - 0.04) / 0.66));
      const s = Math.pow(g.smax, e);
      const close = 1 - smoothstep(0.42, 0.66, p);
      const partTotal = Math.min(g.w * 0.14, (s - 1) * g.sw * 0.55) * close;
      const partLeft = Math.min(partTotal, Math.max(0, g.tLeft - 8));
      const partRight = partTotal * 2 - partLeft;

      const restW = g.sw;
      const restH = g.sw * 1.3;
      let w = restW * s;
      let h = restH * s;
      let x = g.cx + (partRight - partLeft) / 2 - w / 2;
      let y = g.cy - 0.84 * w;
      if (ent.on) {
        w = restW * ent.sx;
        h = restH * ent.sy;
        x = g.cx - w / 2;
        y = g.sy0 + restH - h + ent.y * restH;
      }

      drop.style.webkitMaskPosition = `${x}px ${y}px`;
      drop.style.webkitMaskSize = `${w}px ${h}px`;
      drop.style.maskPosition = `${x}px ${y}px`;
      drop.style.maskSize = `${w}px ${h}px`;
      rim.style.width = `${w}px`;
      rim.style.height = `${h}px`;
      rim.style.transform = `translate(${x}px, ${y}px)`;
      drop.style.opacity = ent.on ? String(ent.o) : '1';
      rim.style.opacity = String((1 - smoothstep(0.08, 0.26, p)) * (ent.on ? ent.o : 1));
      // The video is always the stage's own size, never the mask's - a gentle Ken Burns drift is
      // just a small transform on that fixed box, so it stays cheap at any mask size.
      if (!ent.on) video.style.transform = `scale(${1.08 - 0.08 * e})`;

      everyEl.style.transform = `translateX(${-partLeft}px)`;
      dropWord.style.transform = `translateX(${partRight}px)`;
      line1.style.transform = `translateY(${-(partTotal / Math.max(1, g.w * 0.14)) * g.sw * 0.3}px)`;

      const onField = p >= 0.5;
      stage.dataset.phase = onField ? 'field' : 'text';
      slot.style.opacity = String(smoothstep(0.8, 0.94, p));

      const sideOpacity = onField ? smoothstep(0.78, 0.94, p) : 1 - smoothstep(0.05, 0.22, p);
      side.style.opacity = String(sideOpacity);
      side.style.visibility = sideOpacity < 0.02 ? 'hidden' : 'visible';
      side.style.transform = `translateY(${(1 - sideOpacity) * 14}px)`;
      const recompose = smoothstep(0.56, 0.9, p);
      title.style.transform = `translateY(${recompose * g.dy}px) scale(${1 - (g.mobile ? 0 : 0.12) * recompose})`;
      cue.style.opacity = String(1 - smoothstep(0, 0.05, p));
      chip.style.opacity = String(smoothstep(0.86, 0.98, p));

      if (p > 0.93 && !rippledRef.current) {
        rippledRef.current = true;
        fireRipple(g);
      }
      if (p < 0.6) rippledRef.current = false;
    };

    const fireRipple = (g: Geometry) => {
      const ripple = rippleRef.current;
      if (!ripple || reducedMotion) return;
      const slotEl = slot.getBoundingClientRect();
      const stageEl = stage.getBoundingClientRect();
      ripple.style.left = `${slotEl.left - stageEl.left + slotEl.width / 2}px`;
      ripple.style.top = `${slotEl.top - stageEl.top + slotEl.height * 0.62}px`;
      const reach = Math.hypot(g.w, g.h) / 20;
      ripple.animate(
        [
          { transform: 'scale(.2)', opacity: 0.8 },
          { transform: `scale(${reach})`, opacity: 0 },
        ],
        { duration: 1600, easing: 'cubic-bezier(.2,.7,.3,1)' },
      );
    };

    const runLandingRing = () => {
      const ring = landRingRef.current;
      const g = geomRef.current;
      if (!ring || !g || reducedMotion) return;
      ring.style.width = `${g.sw * 2.6}px`;
      ring.style.height = `${g.sw * 0.55}px`;
      ring.style.left = `${g.cx - g.sw * 1.3}px`;
      ring.style.top = `${g.sy0 + g.sw * 1.3 - g.sw * 0.27}px`;
      ring.animate(
        [
          { transform: 'scale(.3)', opacity: 0.9 },
          { transform: 'scale(1)', opacity: 0 },
        ],
        { duration: 900, easing: 'cubic-bezier(.2,.7,.3,1)' },
      );
    };

    measure();
    render(0);

    let entranceDone = reducedMotion;
    let raf = 0;
    if (!reducedMotion) {
      // Manual timeline (no animation library): the drop rises with the headline, waits, then
      // falls into its slot with a small squash-and-settle. Durations mirror the prep demo.
      const DELAY = 750;
      const D_OPACITY = 120;
      const D_FALL = 460;
      const D_SQUASH = 110;
      const D_SETTLE = 800;
      const t0 = performance.now() + DELAY;
      const tick = (now: number) => {
        const t = now - t0;
        if (t < 0) {
          raf = requestAnimationFrame(tick);
          return;
        }
        let o = 0;
        let y = -2.4;
        let sx = 0.74;
        let sy = 1.28;
        if (t < D_OPACITY) {
          o = t / D_OPACITY;
        } else if (t < D_OPACITY + D_FALL) {
          o = 1;
          y = -2.4 * (1 - easeInPow2((t - D_OPACITY) / D_FALL));
        } else if (t < D_OPACITY + D_FALL + D_SQUASH) {
          o = 1;
          y = 0;
          const q = easeOutPow1((t - D_OPACITY - D_FALL) / D_SQUASH);
          sx = lerp(0.74, 1.2, q);
          sy = lerp(1.28, 0.8, q);
          if (q >= 1 && !rippledRef.current) runLandingRing(); // fires once, right as the squash peaks
        } else if (t < D_OPACITY + D_FALL + D_SQUASH + D_SETTLE) {
          o = 1;
          y = 0;
          const q = elasticOut((t - D_OPACITY - D_FALL - D_SQUASH) / D_SETTLE);
          sx = lerp(1.2, 1, q);
          sy = lerp(0.8, 1, q);
        } else {
          entRef.current = { on: false, y: 0, sx: 1, sy: 1, o: 1 };
          entranceDone = true;
          render(progressRef.current);
          return;
        }
        entRef.current = { on: true, y, sx, sy, o };
        render(progressRef.current);
        raf = requestAnimationFrame(tick);
      };
      entRef.current = { on: true, y: -2.4, sx: 0.74, sy: 1.28, o: 0 };
      raf = requestAnimationFrame(tick);
    }

    let cleanupPin: (() => void) | undefined;
    if (window.matchMedia(PIN_MQ).matches) {
      let disposed = false;
      let idleId: number | null = null;
      let trigger: { kill: () => void } | null = null;
      const mm = window.matchMedia(PIN_MQ);

      const engagePin = async () => {
        try {
          const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
          await scrollSettled();
          if (disposed || !mm.matches || trigger) return;
          gsap.registerPlugin(ScrollTrigger);
          const section = heroRef.current!;
          const st = ScrollTrigger.create({
            trigger: section,
            start: () => `top ${pinTop()}px`,
            end: () => `+=${Math.round(window.innerHeight * (geomRef.current?.mobile ? LEN_MOBILE : LEN_DESKTOP))}`,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              measure();
            },
            onUpdate: (self) => {
              progressRef.current = self.progress;
              if (entranceDone) render(self.progress);
            },
          });
          trigger = st;
        } catch {
          // GSAP failed to load: the hero simply stays at rest, no growth on scroll.
        }
      };

      idleId = onIdle(() => void engagePin());
      const onResize = () => {
        measure();
        render(progressRef.current);
      };
      window.addEventListener('resize', onResize);
      document.fonts?.ready.then(onResize);

      cleanupPin = () => {
        disposed = true;
        if (idleId !== null) cancelIdle(idleId);
        trigger?.kill();
        window.removeEventListener('resize', onResize);
      };
    } else {
      const onResize = () => {
        measure();
        render(progressRef.current);
      };
      window.addEventListener('resize', onResize);
      cleanupPin = () => window.removeEventListener('resize', onResize);
    }

    return () => {
      cancelAnimationFrame(raf);
      cleanupPin?.();
    };
    // reducedMotion only flips via a live media-query change, which is rare enough mid-session
    // that re-running this whole setup (including the entrance) on that flip is the right call.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <section id="hero" ref={heroRef} className="section aqh-hero">
      <div className="aqh-stage" ref={stageRef} data-phase="text" style={{ '--aqh-mask': DROP_MASK } as React.CSSProperties}>
        <span className="aqh-landring" ref={landRingRef} aria-hidden="true" />
        <div className="aqh-drop" ref={dropRef} aria-hidden="true">
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            autoPlay={!reducedMotion}
            poster={HERO_POSTER}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            {sourcesReady && (
              <>
                <source src={media('aquasol-hero-loop.webm')} type="video/webm" />
                <source src={media('aquasol-hero-loop.mp4')} type="video/mp4" />
              </>
            )}
          </video>
        </div>
        <svg className="aqh-rim" ref={rimRef} viewBox="0 0 100 130" aria-hidden="true">
          <path d={DROP_PATH} fill="none" stroke="rgba(255,255,255,.6)" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
          <path d="M28 76C28 60 36 46 46 34" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth={3.2} strokeLinecap="round" />
          <circle cx={66} cy={92} r={3.4} fill="rgba(255,255,255,.75)" />
          <circle cx={59} cy={105} r={2.2} fill="rgba(255,255,255,.7)" />
        </svg>
        <div className="aqh-scrim" aria-hidden="true" />

        <h1 className="heading h1 aqh-title" ref={titleRef}>
          <span className="aqh-line" ref={line1Ref}>
            <span className="aq-w">
              <span style={{ '--i': 0 } as React.CSSProperties}>Intelligence</span>
            </span>{' '}
            <span className="aq-w">
              <span style={{ '--i': 1 } as React.CSSProperties}>in</span>
            </span>
          </span>
          <span className="aqh-line">
            <span className="aq-w" ref={everyRef}>
              <span style={{ '--i': 2 } as React.CSSProperties}>Every</span>
            </span>{' '}
            <span className="aqh-slot" ref={slotRef} aria-hidden="true" />{' '}
            <span className="aq-w" ref={dropWordRef}>
              <span style={{ '--i': 3 } as React.CSSProperties}>Drop.</span>
            </span>
          </span>
        </h1>

        <div className="aqh-side" ref={sideRef}>
          <p className="paragraph large aq-hero-sub">
            Irrigation in India still runs on manual checks. AquaSol reads every zone and waters only the ones that need it.
          </p>
          <Magnetic>
            <a
              href="#how-it-works"
              className="aq-cta"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('how-it-works');
              }}
            >
              <span>See how it works</span>
              <span className="aq-cta-icon" aria-hidden="true">
                <ArrowDown size={15} strokeWidth={2.6} />
              </span>
            </a>
          </Magnetic>
        </div>

        <div className="aqh-cue" ref={cueRef} aria-hidden="true">
          <b />
          Scroll to open the field
        </div>
        <div className="aqh-chip" ref={chipRef}>
          Decisions made on the farm
        </div>
        <button
          type="button"
          className="aqh-toggle"
          onClick={toggleVideo}
          aria-label={playing ? 'Pause background video' : 'Play background video'}
        >
          {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
        </button>
        <span className="aqh-ripple" ref={rippleRef} aria-hidden="true" />
      </div>
    </section>
  );
};
