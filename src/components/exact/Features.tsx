import React from 'react';
import { BrainCircuit, ChartLine, Droplets, Gauge, Mic, ScanSearch, Sun, WifiOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal } from '../motion/Reveal';

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

export const Features: React.FC = () => (
  <section id="features" className="aq-sec aq-sec--sand" aria-labelledby="features-title">
    <div className="aq-wrap aq-features">
      <Reveal className="aq-features-head">
        <h2 id="features-title" className="aq-h2">One system, from soil to decision.</h2>
        <p className="aq-lead">
          Sensors, a gateway, valves and an app work together to water each zone only when it needs it.
        </p>
        <p className="aq-note">
          <strong>Built</strong> means it exists in the prototype or the app. <strong>Designed</strong> means it is
          specified in our project report and not yet shown working.
        </p>
      </Reveal>

      <ul className="aq-bento">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <li key={f.id} className="aq-cell-slot" data-cell={f.id}>
              <Reveal className="aq-cell" delay={(i % 4) * 70} threshold={0.12}>
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
                    className="aq-cell-peek"
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
