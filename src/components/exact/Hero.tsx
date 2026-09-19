import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { LiveFarmDashboard } from './LiveFarmDashboard';

const HERO_POSTER =
  '/assets/68ac094ada452bf00181bba8-2F691efa8f76153a3eb69c3b11_4249212-uhd_3840_2160_24fps_-f2ea23f690.jpg';

export const Hero: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <div id="hero" className="section hero">
      <div className="wide-container light">
        <div className="hero-wrap">
          <div className="w-layout-grid grid full-width mobile-1-col">
            <div id="w-node-_8f8f427a-a162-3030-0935-806ef126dc00-0181bba9" className="hero-text-wrap">
              <div className="overflow-hidden">
                <p className="aq-eyebrow">
                  <span aria-hidden="true" className="aq-eyebrow-dot" />
                  Smart irrigation for Indian farms
                </p>
                <h1 data-w-id="f84372ae-39f3-d558-b059-862642443e0b" className="heading h1">
                  Intelligence in <span className="accent-text">Every&nbsp;Drop.</span>
                </h1>
              </div>
              <div className="text-box s">
                <p data-w-id="ba4f1ae9-7aa9-bbab-3e23-81ec90e8f9f7" className="paragraph large aq-hero-sub">
                  Irrigation in India still runs on manual checks and guesswork. AquaSol&apos;s sensors, drones and AI watch every field and water it only when needed.
                </p>
                <div className="spacer _32" />
                <div className="overlay-hidden">
                  <a href="#problem" className="aq-cta">
                    <span>See how it works</span>
                    <span className="aq-cta-icon" aria-hidden="true">
                      <ArrowDown size={15} strokeWidth={2.6} />
                    </span>
                  </a>
                </div>
                <ul className="aq-chips" aria-label="AquaSol highlights">
                  <li>Solar-powered</li>
                  <li aria-hidden="true" className="aq-chips-sep">·</li>
                  <li>Works offline</li>
                  <li aria-hidden="true" className="aq-chips-sep">·</li>
                  <li>
                    <span lang="en">English</span>, <span lang="kn">ಕನ್ನಡ</span>, <span lang="hi">हिन्दी</span>, <span lang="te">తెలుగు</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-video-wrap">
              <div
                data-poster-url="/assets/68ac094ada452bf00181bba8-2F691efa8f76153a3eb69c3b11_4249212-uhd_3840_2160_24fps_-f2ea23f690.jpg"
                className="background-video w-background-video w-background-video-atom"
              >
                <video
                  id="76357cac-5e72-109f-5a72-9ad65220e100-video"
                  autoPlay={!reducedMotion}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={HERO_POSTER}
                  style={{
                    backgroundImage: `url(${HERO_POSTER})`,
                  }}
                  data-wf-ignore="true"
                  data-object-fit="cover"
                >
                  <source
                    src="/assets/Playback_vid.webm"
                    data-wf-ignore="true"
                  />
                </video>
                <div aria-hidden="true" className="aq-video-scrim" />
              </div>

              {/* Top-Right Cutout Corner & Rotating Logomark */}
              <div className="cutout-shape-wrap">
                <img
                  loading="lazy"
                  src="/assets/68ac3b48ed60b0dfac22d447_1c83c4a424bb291297ae81064ec43af2_corner-shape-b5a357a4aa.svg"
                  alt="corner shape"
                  className="corner-shape bottom"
                />
                <img
                  loading="lazy"
                  src="/assets/68ac3b48ed60b0dfac22d447_1c83c4a424bb291297ae81064ec43af2_corner-shape-b5a357a4aa.svg"
                  alt="corner shape"
                  className="corner-shape top-left"
                />
                <img
                  src="/assets/68aeb2a5a67a4655a7dbbc84_logomark-82a1244df6.svg"
                  loading="lazy"
                  style={{ transform: 'rotate(45deg)' }}
                  data-w-id="b66b72d9-e026-fdcb-6d3c-4f988ea07a0d"
                  alt=""
                  className="logo-mark"
                />
              </div>

              {/* Bottom-Left Cutout Corner & Users Avatars */}
              <div className="cutout-shape-wrap bottom-left">
                <img
                  loading="lazy"
                  src="/assets/68ac3b48ed60b0dfac22d447_1c83c4a424bb291297ae81064ec43af2_corner-shape-b5a357a4aa.svg"
                  alt="corner shape"
                  className="corner-shape second"
                />
                <img
                  loading="lazy"
                  src="/assets/68ac3b48ed60b0dfac22d447_1c83c4a424bb291297ae81064ec43af2_corner-shape-b5a357a4aa.svg"
                  alt="corner shape"
                  className="corner-shape first"
                />
                <div className="agri-feature-wrap">
                  <div className="agri-feature-icon-box" title="Smart Agriculture">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-label="Sprout icon"
                    >
                      <path d="M7 20h10" />
                      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
                      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
                      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
                    </svg>
                  </div>
                  <div className="agri-feature-title">
                    Smart Agriculture
                  </div>
                </div>
              </div>

              {/* Floating Slogans */}
              <div className="slogans-wrap">
                <div data-w-id="1a93fbd8-50a6-3681-5f63-9f75694bf098" className="green-slogan-wrap">
                  <div className="hero-small-text light">Real-time insights.</div>
                </div>
                <div className="aq-proto-badge">
                  <div className="hero-small-text">SIH 2026 prototype</div>
                </div>
              </div>

              {/* Live farm mini-dashboard */}
              <div data-w-id="9be411ff-966f-4519-293d-878b59eb9f45" className="hero-illustration-wrap aq-farm-slot">
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
