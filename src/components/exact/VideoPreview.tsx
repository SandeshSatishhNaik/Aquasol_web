import React, { useEffect, useRef, useState } from 'react';
import { Magnetic } from '../motion/Magnetic';
import { Play, X } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { lockScroll, unlockScroll } from '../../lib/smoothScroll';
import { SplitHeading } from '../motion/SplitHeading';

const POSTER = '/assets/aquasol-uav-scouting.jpg';
const CLIP = '/assets/aquasol-uav-scouting.mp4';

export const VideoPreview: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!modalOpen) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
        return;
      }
      // Keep Tab inside the dialog. Without this the page behind stays reachable.
      if (e.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], video[controls], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    lockScroll();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      unlockScroll();
      trigger?.focus();
    };
  }, [modalOpen]);

  return (
    <>
      <section id="demo" className="aq-sec aq-sec--dark aq-sec--clip" aria-labelledby="demo-title">
        <div className="aq-wrap aq-demo">
          <div className="aq-demo-text">
            <SplitHeading as="h2" id="demo-title" className="aq-h2">
              Watch the <span className="aq-accent">app at work.</span>
            </SplitHeading>
            <Reveal delay={220}>
            <p className="aq-lead">
              A screen recording of the drone survey screen in the AquaSol app. Zones are flagged by
              stress spot, with the NDVI reading for each.
            </p>
            <div className="aq-demo-actions">
              <Magnetic>
              <button type="button" className="aq-cta" onClick={() => setModalOpen(true)}>
                <span>Play the recording</span>
                <span className="aq-cta-icon" aria-hidden="true">
                  <Play size={14} strokeWidth={2.6} />
                </span>
              </button>
              </Magnetic>
              <a href="#product" className="aq-btn-ghost">
                See the app screens
              </a>
            </div>
            </Reveal>
          </div>

          <Reveal className="aq-demo-stage" delay={120}>
            <Magnetic strength={0.07} className="aq-float">
            <button
              type="button"
              ref={triggerRef}
              className="aq-demo-play"
              aria-label="Play the app screen recording"
              onClick={() => setModalOpen(true)}
            >
              <span className="aq-phone">
                <span className="aq-phone-screen">
                  <img src={POSTER} alt="" width="491" height="1024" loading="lazy" decoding="async" />
                </span>
              </span>
              <span className="aq-demo-play-badge" aria-hidden="true">
                <Play size={24} strokeWidth={2.2} />
              </span>
            </button>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {modalOpen && (
        <div className="video-modal-backdrop" data-lenis-prevent onClick={() => setModalOpen(false)}>
          <div
            ref={dialogRef}
            className="video-modal-container"
            role="dialog"
            aria-modal="true"
            aria-label="AquaSol app screen recording"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              ref={closeRef}
              className="video-modal-close"
              aria-label="Close video"
              onClick={() => setModalOpen(false)}
            >
              <X size={20} aria-hidden="true" />
            </button>
            <video
              src={CLIP}
              aria-label="Screen recording of the drone survey screen in the AquaSol app"
              controls
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
            />
          </div>
        </div>
      )}
    </>
  );
};
