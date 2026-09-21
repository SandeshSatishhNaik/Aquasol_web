import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, Pause, Play } from 'lucide-react';
import { LiveFarmDashboard } from './LiveFarmDashboard';
import { scrollToId } from '../../lib/scrollToId';

const HERO_POSTER = '/assets/aquasol-hero-poster.jpg';

export const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // The loop is decoration. Hold its sources back until the browser is idle so the
  // poster paints first and the video never competes with the hero for bandwidth.
  const [sourcesReady, setSourcesReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 1));
    const id = idle(() => setSourcesReady(true));
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <div id="hero" className="section hero">
      <div className="wide-container light">
        <div className="hero-wrap">
          <div className="w-layout-grid grid full-width mobile-1-col aq-hero-grid">
            <div id="w-node-_8f8f427a-a162-3030-0935-806ef126dc00-0181bba9" className="hero-text-wrap aq-hero-text">
              <h1 className="heading h1 aq-hero-title">Intelligence in Every&nbsp;Drop.</h1>
              <p className="paragraph large aq-hero-sub">
                Irrigation in India still runs on manual checks. AquaSol reads every zone and waters only the ones that need it.
              </p>
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
            </div>

            <div className="bg-video-wrap aq-hero-stage">
              <div className="aq-hero-media">
                <div
                  data-poster-url={HERO_POSTER}
                  className="background-video w-background-video w-background-video-atom"
                >
                  <video
                    ref={videoRef}
                    id="76357cac-5e72-109f-5a72-9ad65220e100-video"
                    autoPlay={!reducedMotion}
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster={HERO_POSTER}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    style={{ backgroundImage: `url(${HERO_POSTER})` }}
                    data-wf-ignore="true"
                    data-object-fit="cover"
                  >
                    {sourcesReady && (
                      <>
                        <source src="/assets/aquasol-hero-loop.webm" type="video/webm" data-wf-ignore="true" />
                        <source src="/assets/aquasol-hero-loop.mp4" type="video/mp4" data-wf-ignore="true" />
                      </>
                    )}
                  </video>
                </div>

                <button
                  type="button"
                  className="aq-video-toggle"
                  onClick={toggleVideo}
                  aria-label={playing ? 'Pause background video' : 'Play background video'}
                >
                  {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
                </button>
              </div>

              <div className="hero-illustration-wrap aq-farm-slot">
                <LiveFarmDashboard />
              </div>
            </div>
          </div>
        </div>
        <div className="container" />
      </div>
    </div>
  );
};
