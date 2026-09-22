import React, { useEffect, useRef } from 'react';
import { BrainCircuit, ChartLine, Droplets, Gauge, Mic, ScanSearch, Sun, WifiOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal } from '../motion/Reveal';
import { SplitHeading } from '../motion/SplitHeading';

type Status = 'Built' | 'Designed';

interface Feature {
  id: string;
  title: string;
  body: string;
  status: Status;
  icon: LucideIcon;
  /** Optional cropped app screen. Decorative: the copy carries the meaning. */
  peek?: string;
}

// Order is reading order. Grid placement lives in CSS (`data-cell`), so the layout can
// recompose on mobile without touching this list.
const FEATURES: Feature[] = [
  {
    id: 'offline',
    title: 'Works without internet',
    body: 'Nodes reach the master gateway over long-range LoRa radio. The gateway decides when to irrigate on the farm itself, so watering carries on when the internet drops.',
    status: 'Built',
    icon: WifiOff,
  },
  {
    id: 'solar',
    title: 'Solar-powered field nodes',
    body: 'Each zone gets a node with a soil moisture sensor and a temperature and humidity sensor, running on its own solar panel. No mains power needed.',
    status: 'Built',
    icon: Sun,
  },
  {
    id: 'lumi',
    title: 'Lumi, the voice assistant',
    body: 'Ask Lumi about soil moisture or zone temperature in English, Kannada, Hindi or Telugu.',
    status: 'Built',
    icon: Mic,
    peek: '/assets/aquasol-lumi-assistant.jpg',
  },
  {
    id: 'valves',
    title: 'Zone-by-zone valve control',
    body: 'A solenoid valve per zone opens and closes on command. Switch any zone between AI mode and manual override whenever you want.',
    status: 'Built',
    icon: Droplets,
  },
  {
    id: 'budget',
    title: 'A daily water budget',
    body: 'Set a limit and irrigation stays inside it, zone by zone, with schedules built in.',
    status: 'Built',
    icon: Gauge,
  },
  {
    id: 'dashboard',
    title: 'Farm dashboard and trends',
    body: 'A farm health score, gateway and node status, and seven days of water and sensor readings, on your phone.',
    status: 'Built',
    icon: ChartLine,
    peek: '/assets/aquasol-data-analytics.jpg',
  },
  {
    id: 'ai',
    title: 'AI irrigation advice',
    body: 'LSTM models forecast soil moisture and XGBoost chooses when and how long to water, so it waters ahead of need instead of reacting to a threshold.',
    status: 'Designed',
    icon: BrainCircuit,
  },
  {
    id: 'drone',
    title: 'Drone scouting',
    body: 'A drone with thermal, multispectral and RGB cameras surveys the crop once and flags stress spots by zone.',
    status: 'Designed',
    icon: ScanSearch,
  },
];

// Entrance order by grid diagonal (row + column), so the bento fills in as a wave rather than in
// list order. Keys match the `data-cell` placement in index.css.
const DIAGONAL: Record<string, number> = {
  offline: 0, solar: 1, lumi: 1, valves: 2, budget: 3, dashboard: 3, ai: 3, drone: 4,
};

/**
 * One delegated listener lights a radial spotlight under the pointer in whichever cell it is over.
 * On touch, the spot lands where you tap and fades. No GSAP; custom properties only.
 */
function useSpotlight(ref: React.RefObject<HTMLUListElement | null>) {
  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    let timer = 0;
    const place = (e: PointerEvent) => {
      const cell = (e.target as Element).closest<HTMLElement>('.aq-cell');
      if (!cell) return null;
      const r = cell.getBoundingClientRect();
      cell.style.setProperty('--mx', `${e.clientX - r.left}px`);
      cell.style.setProperty('--my', `${e.clientY - r.top}px`);
      return cell;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') place(e);
    };
    const tap = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      const cell = place(e);
      if (!cell) return;
      cell.dataset.lit = '';
      window.clearTimeout(timer);
      timer = window.setTimeout(() => delete cell.dataset.lit, 700);
    };
    list.addEventListener('pointermove', move, { passive: true });
    list.addEventListener('pointerdown', tap, { passive: true });
    return () => {
      window.clearTimeout(timer);
      list.removeEventListener('pointermove', move);
      list.removeEventListener('pointerdown', tap);
    };
  }, [ref]);
}

export const Features: React.FC = () => {
  const bento = useRef<HTMLUListElement>(null);
  useSpotlight(bento);
  return (
  <section id="features" className="aq-sec aq-sec--sand" aria-labelledby="features-title">
    <div className="aq-wrap aq-features">
      <div className="aq-features-head">
        <SplitHeading as="h2" id="features-title" className="aq-h2">One system, from soil to decision.</SplitHeading>
        <Reveal delay={220}>
        <p className="aq-lead">
          Sensors, a gateway, valves and an app work together to water each zone only when it needs it.
        </p>
        <p className="aq-note">
          <strong>Built</strong> means it exists in the prototype or the app. <strong>Designed</strong> means it is
          specified in our project report and not yet shown working.
        </p>
        </Reveal>
      </div>

      <ul ref={bento} className="aq-bento">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <li key={f.id} className="aq-cell-slot" data-cell={f.id}>
              <Reveal className="aq-cell" delay={DIAGONAL[f.id] * 95} threshold={0.12}>
                <div className="aq-cell-top">
                  <span className="aq-cell-icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={1.9} />
                  </span>
                  <span className="aq-status" data-status={f.status}>{f.status}</span>
                </div>
                <div className="aq-cell-copy">
                  <h3 className="aq-feature-title">{f.title}</h3>
                  <p className="aq-feature-body">{f.body}</p>
                </div>
                {f.peek && (
                  <img
                    className="aq-cell-peek aq-colorize"
                    src={f.peek}
                    alt=""
                    width={491}
                    height={1024}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </Reveal>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);
};
