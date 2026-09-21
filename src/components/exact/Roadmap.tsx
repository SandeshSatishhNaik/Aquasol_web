import React from 'react';
import { useInView } from '../../lib/useInView';
import { Reveal } from '../motion/Reveal';

type State = 'Completed' | 'In progress' | 'Next' | 'Later';

const STAGES: { name: string; state: State; items: string[] }[] = [
  {
    name: 'Prototype',
    state: 'Completed',
    items: [
      'Smart irrigation hardware',
      'Soil moisture and environment sensing',
      'Real-time sensor data',
      'AI irrigation recommendations',
      'Mobile dashboard',
      'End-to-end hardware and software link',
    ],
  },
  {
    name: 'MVP',
    state: 'In progress',
    items: [
      'AI crop planner',
      'Crop-stage intelligence',
      'Smart irrigation automation',
      'Multilingual AI assistant',
      'Enterprise analytics dashboard',
      'Scheme assistance, marketplace and transport links',
    ],
  },
  {
    name: 'Pilot',
    state: 'Next',
    items: ['Pilot deployments with farmers', 'Platform integration', 'Partner onboarding'],
  },
  {
    name: 'Commercial scale',
    state: 'Later',
    items: ['Many farms and cooperatives', 'Marketplace and enterprise connectivity'],
  },
];

export const Roadmap: React.FC = () => {
  const { ref, inView } = useInView<HTMLOListElement>(0.2);

  return (
    <section id="roadmap" className="aq-sec aq-sec--sand" aria-labelledby="roadmap-title">
      <div className="aq-wrap">
        <Reveal className="aq-diff-head">
          <h2 id="roadmap-title" className="aq-h2">From prototype to platform.</h2>
          <p className="aq-lead">
            The prototype is built. We are now building the farmer-ready product, then testing it with farmers.
          </p>
        </Reveal>

        <ol ref={ref} className="aq-road" data-in-view={inView}>
          {STAGES.map((s) => (
            <li key={s.name} className="aq-stage" data-state={s.state}>
              <div className="aq-stage-rail" aria-hidden="true">
                <span className="aq-stage-dot" />
              </div>
              <div className="aq-stage-body">
                <h3 className="aq-stage-name">{s.name}</h3>
                <p className="aq-stage-state">{s.state}</p>
                <ul className="aq-stage-items">
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <p className="aq-source">
          Further ideas from our project report: disease and pest prediction, yield forecasting, weather and satellite data,
          a digital twin of the field, and native Android and iOS apps.
        </p>
      </div>
    </section>
  );
};
