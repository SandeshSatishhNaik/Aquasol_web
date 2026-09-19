import React, { useEffect, useRef } from 'react';
import { useInView } from '../../lib/useInView';

interface ZoneDatum {
  id: string;
  label: string;
  moisture: number;
  irrigating?: boolean;
}

// Clearly labelled demonstration values for the schematic only.
const ZONES: ZoneDatum[] = [
  { id: 'A', label: 'Zone A', moisture: 62 },
  { id: 'B', label: 'Zone B', moisture: 24, irrigating: true },
  { id: 'C', label: 'Zone C', moisture: 48 },
  { id: 'D', label: 'Zone D', moisture: 71 },
];

const FLIGHT_PATH =
  'M 24 216 C 70 200, 60 150, 100 138 S 170 120, 200 84 S 260 60, 296 40';

/**
 * "Live farm" mini-dashboard: top-down SVG schematic of four zones with a
 * drone following a dashed survey path, per-zone soil-moisture bars and an
 * irrigation status pill. All values are demo data for illustration.
 */
export const LiveFarmDashboard: React.FC = () => {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // SMIL motion is not governed by CSS; pause it for reduced-motion users.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof svg.pauseAnimations !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      if (mq.matches) svg.pauseAnimations();
      else svg.unpauseAnimations();
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <div
      ref={ref}
      className={`aq-farm${inView ? ' is-visible' : ''}`}
      role="img"
      aria-label="Demonstration schematic of four farm zones with a drone survey path, soil-moisture bars and an irrigating status for Zone B"
    >
      <div className="aq-farm-top">
        <span className="aq-farm-status">
          <span aria-hidden="true" className="aq-farm-pulse" />
          Irrigating: Zone B
        </span>
        <span className="aq-farm-demo">Demo data</span>
      </div>

      <svg
        ref={svgRef}
        className="aq-farm-map"
        viewBox="0 0 320 240"
        aria-hidden="true"
        focusable="false"
      >
        {/* Zone plots */}
        <g>
          <rect x="8" y="8" width="148" height="104" rx="10" className="aq-zone" />
          <rect x="164" y="8" width="148" height="104" rx="10" className="aq-zone is-irrigating" />
          <rect x="8" y="120" width="148" height="112" rx="10" className="aq-zone" />
          <rect x="164" y="120" width="148" height="112" rx="10" className="aq-zone" />
        </g>

        {/* Crop rows */}
        <g className="aq-rows" aria-hidden="true">
          {[34, 52, 70, 88].map((y) => (
            <line key={`a${y}`} x1="24" y1={y} x2="140" y2={y} />
          ))}
          {[146, 164, 182, 200].map((y) => (
            <line key={`c${y}`} x1="24" y1={y} x2="140" y2={y} />
          ))}
          {[34, 52, 70, 88].map((y) => (
            <line key={`b${y}`} x1="180" y1={y} x2="296" y2={y} />
          ))}
          {[146, 164, 182, 200].map((y) => (
            <line key={`d${y}`} x1="180" y1={y} x2="296" y2={y} />
          ))}
        </g>

        {/* Solar sensor nodes */}
        <g className="aq-nodes" aria-hidden="true">
          <circle cx="40" cy="30" r="4" />
          <circle cx="280" cy="30" r="4" className="is-active" />
          <circle cx="40" cy="210" r="4" />
          <circle cx="280" cy="210" r="4" />
        </g>

        {/* Zone labels */}
        <g className="aq-zone-labels" aria-hidden="true">
          <text x="20" y="26">A</text>
          <text x="176" y="26">B</text>
          <text x="20" y="138">C</text>
          <text x="176" y="138">D</text>
        </g>

        {/* Dashed survey flight path */}
        <path d={FLIGHT_PATH} className="aq-flight-path" fill="none" />

        {/* Drone following the path */}
        <g className="aq-drone">
          <circle cx="0" cy="0" r="9" className="aq-drone-halo" />
          <rect x="-7" y="-4" width="14" height="8" rx="4" className="aq-drone-body" />
          <circle cx="-9" cy="-7" r="3" className="aq-drone-rotor" />
          <circle cx="9" cy="-7" r="3" className="aq-drone-rotor" />
          <circle cx="-9" cy="7" r="3" className="aq-drone-rotor" />
          <circle cx="9" cy="7" r="3" className="aq-drone-rotor" />
          <circle cx="0" cy="0" r="2.4" className="aq-drone-eye" />
          <animateMotion dur="14s" repeatCount="indefinite" path={FLIGHT_PATH} />
        </g>
      </svg>

      {/* Per-zone soil-moisture bars */}
      <ul className="aq-moisture" aria-label="Demonstration soil-moisture readings">
        {ZONES.map((z, i) => (
          <li key={z.id} className="aq-moisture-row">
            <span className="aq-moisture-zone">{z.label}</span>
            <span className="aq-moisture-track">
              <span
                className={`aq-moisture-fill${z.irrigating ? ' is-low' : ''}`}
                style={{
                  transform: inView ? `scaleX(${z.moisture / 100})` : 'scaleX(0)',
                  transitionDelay: `${i * 90}ms`,
                }}
              />
            </span>
            <span className="aq-moisture-val">{z.moisture}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
