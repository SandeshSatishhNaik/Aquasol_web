import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AgriculturalSlide } from './types';
import { AQUASOL_SLIDES } from './slidesData';
import { GalleryModal } from './GalleryModal';
import { useInView } from '../../../lib/useInView';

interface ProductShowcaseProps {
  slides?: AgriculturalSlide[];
}

const SWIPE_DISTANCE = 48;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The six AquaSol app screens as a deck of phones. The selected screen sits in
 * front, its neighbours recede in depth. Movement is transform and opacity only.
 */
export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ slides = AQUASOL_SLIDES }) => {
  const [active, setActive] = useState(0);
  const [detailSlide, setDetailSlide] = useState<AgriculturalSlide | null>(null);
  const { ref: stageRef, inView } = useInView<HTMLDivElement>(0.25);
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const drag = useRef<{ x: number; swiped: boolean } | null>(null);

  const last = slides.length - 1;
  const slide = slides[active];
  const select = useCallback((i: number) => setActive(Math.max(0, Math.min(last, i))), [last]);

  // A video screen only plays while it is the selected one.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && !prefersReducedMotion()) video.play().catch(() => {});
      else video.pause();
    });
  }, [active]);

  // When the list scrolls sideways (mobile), keep the selected pill centred.
  useEffect(() => {
    const list = listRef.current;
    const tab = tabRefs.current[active];
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({
      left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [active]);

  const onListKeyDown = (e: React.KeyboardEvent) => {
    const target: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in target)) return;
    e.preventDefault();
    const next = Math.max(0, Math.min(last, target[e.key]));
    select(next);
    tabRefs.current[next]?.focus();
  };

  const onStagePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { x: e.clientX, swiped: false };
  };

  const onStagePointerUp = (e: React.PointerEvent) => {
    const start = drag.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > SWIPE_DISTANCE) {
      start.swiped = true;
      select(active + (dx < 0 ? 1 : -1));
      // Keep the flag just long enough to swallow the click that follows a swipe.
      window.setTimeout(() => {
        if (drag.current === start) drag.current = null;
      }, 0);
    } else {
      drag.current = null;
    }
  };

  return (
    <div className="aq-show">
      <div className="aq-show-panel">
        <div
          ref={listRef}
          className="aq-show-list"
          role="tablist"
          aria-label="AquaSol app screens"
          onKeyDown={onListKeyDown}
          style={{ '--i': active } as React.CSSProperties}
        >
          <span aria-hidden="true" className="aq-show-indicator" />
          {slides.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`aq-show-tab-${s.id}`}
              aria-selected={i === active}
              aria-controls="aq-show-detail"
              tabIndex={i === active ? 0 : -1}
              className="aq-show-tab"
              onClick={() => select(i)}
            >
              {s.shortLabel || s.category}
            </button>
          ))}
        </div>

        <div
          className="aq-show-detail"
          id="aq-show-detail"
          role="tabpanel"
          aria-labelledby={`aq-show-tab-${slide.id}`}
        >
          <div key={slide.id} className="aq-show-detail-inner">
            <h3 className="aq-show-title">{slide.title}</h3>
            {slide.summary && <p className="aq-show-summary">{slide.summary}</p>}
            <p className="aq-show-metric">
              <span className="aq-show-metric-value">{slide.metric.value}</span>
              <span className="aq-show-metric-label">{slide.metric.label}</span>
            </p>
            <button type="button" className="aq-show-open" onClick={() => setDetailSlide(slide)}>
              <span>View details</span>
              <ArrowUpRight size={16} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={stageRef}
          className="aq-show-stage"
          data-ready={inView}
          onPointerDown={onStagePointerDown}
          onPointerUp={onStagePointerUp}
          onPointerCancel={() => {
            drag.current = null;
          }}
        >
          {slides.map((s, i) => {
            const d = i - active;
            const a = Math.abs(d);
            return (
              <div
                key={s.id}
                className="aq-show-device"
                data-far={a > 2 ? '' : undefined}
                style={{ '--d': d, '--a': a } as React.CSSProperties}
                aria-hidden={d !== 0}
                onClick={() => {
                  if (drag.current?.swiped || d === 0) return;
                  select(i);
                }}
              >
                <div className="aq-show-phone">
                  <div className="aq-show-screen">
                    {s.video ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[i] = el;
                        }}
                        src={s.video}
                        poster={s.poster}
                        loop
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={s.image}
                        alt={d === 0 ? s.alt : ''}
                        width={489}
                        height={1024}
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="aq-show-controls">
            <button
              type="button"
              className="aq-show-arrow"
              aria-label="Previous screen"
              disabled={active === 0}
              onClick={() => select(active - 1)}
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="aq-show-arrow"
              aria-label="Next screen"
              disabled={active === last}
              onClick={() => select(active + 1)}
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <GalleryModal
        slide={detailSlide}
        slides={slides}
        onClose={() => setDetailSlide(null)}
        onSelectSlide={(s) => {
          setDetailSlide(s);
          select(slides.findIndex((x) => x.id === s.id));
        }}
      />
    </div>
  );
};
