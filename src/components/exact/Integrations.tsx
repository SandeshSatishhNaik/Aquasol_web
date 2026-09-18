import React, { useState } from 'react';

interface TechItem {
  id: number;
  name: string;
  category: string;
  spec: string;
  metric: string;
  role: string;
  orbit: 'inner' | 'outer';
  angle: number;
  brandColor: string;
  brandGlow: string;
}

const TECH_STACK_ITEMS: TechItem[] = [
  // Inner Orbit: AI, Mathematics & Core Backend Engine
  {
    id: 3,
    name: 'Python',
    category: 'Core Engine',
    spec: 'Python 3.12 / AsyncIO',
    metric: 'NumPy & SciPy Engine',
    role: 'Scientific computing, data pipeline execution & neural training orchestrator.',
    orbit: 'inner',
    angle: 0,
    brandColor: '#387EB8',
    brandGlow: 'rgba(56, 126, 184, 0.55)',
  },
  {
    id: 7,
    name: 'FastAPI',
    category: 'Microservices',
    spec: 'ASGI / uvloop engine',
    metric: '< 8ms P99 Latency',
    role: 'Ultra low-latency asynchronous microservices & real-time telemetry streaming.',
    orbit: 'inner',
    angle: 90,
    brandColor: '#009688',
    brandGlow: 'rgba(0, 150, 136, 0.55)',
  },
  {
    id: 4,
    name: 'TensorFlow',
    category: 'Deep Learning',
    spec: 'CUDA 12.4 / TensorRT',
    metric: '99.98% Model Accuracy',
    role: 'Deep neural networks for predictive hydrology & water-yield optimization.',
    orbit: 'inner',
    angle: 180,
    brandColor: '#FF6F00',
    brandGlow: 'rgba(255, 111, 0, 0.55)',
  },
  {
    id: 5,
    name: 'SymPy & NumPy',
    category: 'Numerical Physics',
    spec: 'BLAS / LAPACK Kernels',
    metric: 'Arbitrary Precision',
    role: 'High-precision symbolic physics solving & multi-dimensional fluid dynamics.',
    orbit: 'inner',
    angle: 270,
    brandColor: '#013243',
    brandGlow: 'rgba(1, 50, 67, 0.55)',
  },

  // Outer Orbit: Client Interfaces & Scalable Cloud Infrastructure
  {
    id: 1,
    name: 'Flutter',
    category: 'Mobile App',
    spec: 'Impeller Engine 3.22',
    metric: '120 FPS Offline-First',
    role: 'Cross-platform mobile client for field engineers & sensor telemetry.',
    orbit: 'outer',
    angle: 45,
    brandColor: '#02569B',
    brandGlow: 'rgba(2, 86, 155, 0.55)',
  },
  {
    id: 2,
    name: 'PostgreSQL',
    category: 'ACID Database',
    spec: 'Postgres 16 / Timescale',
    metric: 'ACID Time-Series',
    role: 'High-concurrency ACID persistence & sensor time-series telemetry partition store.',
    orbit: 'outer',
    angle: 135,
    brandColor: '#336791',
    brandGlow: 'rgba(51, 103, 145, 0.55)',
  },
  {
    id: 6,
    name: 'React',
    category: 'Web Console',
    spec: 'React 19 / Vite / WASM',
    metric: 'Sub-frame UI Updates',
    role: 'Reactive high-speed web console, live sensor charts & operator dashboard.',
    orbit: 'outer',
    angle: 225,
    brandColor: '#087EA4',
    brandGlow: 'rgba(8, 126, 164, 0.55)',
  },
  {
    id: 8,
    name: 'Render',
    category: 'Edge Cloud',
    spec: 'Global Edge Anycast',
    metric: '99.99% Edge Uptime',
    role: 'Automated zero-downtime microservice orchestration & global CDN hosting.',
    orbit: 'outer',
    angle: 315,
    brandColor: '#1a1a1a',
    brandGlow: 'rgba(20, 20, 20, 0.45)',
  },
];

export const Integrations: React.FC = () => {
  const [hoveredTech, setHoveredTech] = useState<TechItem | null>(null);
  const [pinnedTech, setPinnedTech] = useState<TechItem | null>(null);

  return (
    <>
      <div id="integrations" className="section">
        <div className="wide-container cream bg-image" style={{ overflow: 'visible' }}>
          <div className="container centered">
            <div className="spacer _64"></div>
            <div className="w-layout-grid grid max-1000-width">
              {/* Left Column: Clean, Authoritative Architecture Narrative */}
              <div id="w-node-e0cec62f-f8f3-2b44-5f6f-bc6df5d9b49c-0181bba9" data-w-id="e0cec62f-f8f3-2b44-5f6f-bc6df5d9b49c" className="integrations-text-wrap">
                {/* Micro Eyebrow Kicker Pill */}
                <div className="tech-eyebrow">
                  <span className="tech-eyebrow-dot"></span>
                  <span>Full-Stack Architecture &amp; Ecosystem</span>
                </div>

                {/* Authoritative Headline */}
                <div className="text-box">
                  <h1 className="heading h2">Scientific intelligence. Built from the silicon up.</h1>
                </div>

                {/* Value-Driven Narrative */}
                <div className="text-box s">
                  <p className="paragraph large">
                    AquaSol unites high-dimensional fluid physics with real-time neural forecasting. From field-level mobile telemetry to distributed edge microservices, every layer of our stack is tuned for sub-second synchronization and zero-downtime planetary scale.
                  </p>
                </div>
              </div>

              {/* Right Column: Dual-Ring Concentric Orbit Visualization with Ultra-Stylish Popups */}
              <div id="w-node-_21303ac8-a60f-8afa-dcf8-e2ce2268f3e4-0181bba9" className="integrations-image-wrap">
                {/* Central AquaSol Emblem with concentric disc background */}
                <img
                  src="/assets/68b9714cae56b2d133bce34b_cd148818a00eac27e7fc34af4bee8147_integrations-front-d56aa35a99.svg"
                  loading="eager"
                  alt="AquaSol Central Emblem"
                  className="integrations-front-image"
                />

                {/* Concentric Dual Orbital Tracks */}
                <img
                  src="/assets/techstack/dual-orbit-tracks.svg"
                  alt="Dual Concentric Orbit Tracks"
                  className="integrations-orbit-track"
                />

                {/* 8 Orbiting Tech Stack Badges across 2 Concentric Rings */}
                {TECH_STACK_ITEMS.map((icon) => {
                  const isInner = icon.orbit === 'inner';
                  const radius = isInner ? '126px' : '196px';
                  const duration = isInner ? '26s' : '38s';
                  const isHovered = hoveredTech?.id === icon.id;
                  const isPinned = pinnedTech?.id === icon.id;
                  const isActive = isHovered || isPinned;

                  return (
                    <div
                      key={icon.id}
                      className={`orbiting-icon-wrapper ${isInner ? 'inner-orbit' : 'outer-orbit'} ${isActive ? 'active' : ''}`}
                      style={{
                        '--start-angle': `${icon.angle}deg`,
                        '--orbit-radius': radius,
                        '--duration': duration,
                        '--brand-glow': icon.brandGlow,
                      } as React.CSSProperties}
                      title={`${icon.name} - ${icon.category}`}
                      onMouseEnter={() => setHoveredTech(icon)}
                      onMouseLeave={() => setHoveredTech(null)}
                      onClick={() => setPinnedTech(isPinned ? null : icon)}
                    >
                      <img
                        src={`/assets/techstack/tech-icon-${icon.id}.svg`}
                        alt={icon.name}
                        className="orbiting-icon-img"
                      />

                      {/* Contextual Floating Doppelrand Glass Popup Tethered to Badge */}
                      <div
                        className={`tech-orbit-popup ${isActive ? 'visible' : ''}`}
                        role="tooltip"
                        style={{
                          '--popup-brand-color': icon.brandColor,
                          '--popup-brand-glow': icon.brandGlow,
                        } as React.CSSProperties}
                      >
                        <div className="tech-orbit-popup-shell">
                          {/* Specular brand rim line */}
                          <div className="tech-orbit-popup-rim"></div>

                          <div className="tech-orbit-popup-inner">
                            <div className="tech-orbit-popup-header">
                              <div
                                className="tech-orbit-popup-icon-wrap"
                                style={{
                                  backgroundColor: `${icon.brandColor}12`,
                                  borderColor: `${icon.brandColor}35`,
                                }}
                              >
                                <img
                                  src={`/assets/techstack/tech-icon-${icon.id}.svg`}
                                  alt=""
                                  className="tech-orbit-popup-icon"
                                />
                              </div>

                              <div className="tech-orbit-popup-title-group">
                                <div className="tech-orbit-popup-title-row">
                                  <span className="tech-orbit-popup-name">{icon.name}</span>
                                  <span
                                    className="tech-orbit-popup-category"
                                    style={{
                                      color: icon.brandColor,
                                      backgroundColor: `${icon.brandColor}14`,
                                      borderColor: `${icon.brandColor}30`,
                                    }}
                                  >
                                    {icon.category}
                                  </span>
                                </div>
                                <span className="tech-orbit-popup-metric">{icon.metric}</span>
                              </div>

                              <div className="tech-orbit-popup-pulse-wrap" title="Active in cluster">
                                <span className="tech-orbit-popup-beacon"></span>
                                <span className="tech-orbit-popup-dot"></span>
                              </div>
                            </div>

                            <div className="tech-orbit-popup-spec-pill">
                              <span className="tech-orbit-popup-spec-prompt">❯_</span>
                              <span className="tech-orbit-popup-spec-code">{icon.spec}</span>
                            </div>

                            <p className="tech-orbit-popup-role">{icon.role}</p>

                            <div className="tech-orbit-popup-footer">
                              <span className="tech-orbit-popup-hint">
                                {isPinned ? '● Pinned • Click to unpin' : 'Click badge to pin card'}
                              </span>
                              <span className="tech-orbit-popup-tag">AQUASOL MESH</span>
                            </div>
                          </div>

                          {/* Machined Downward Pointer Arrow */}
                          <div className="tech-orbit-popup-arrow"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="spacer _64"></div>
          </div>
        </div>
      </div>
    </>
  );
};
