import React, { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { Reveal } from '../motion/Reveal';
import { SplitHeading } from '../motion/SplitHeading';

const LAYERS = [
  {
    layer: 'Field nodes',
    note: 'One per zone',
    items: ['ESP32', 'LoRa SX1278', 'Capacitive soil moisture sensor', 'DHT22 temperature and humidity', '12V solenoid valve', 'Solar panel and MPPT charge controller', 'Li-ion battery'],
  },
  {
    layer: 'Master gateway',
    note: 'Decides on the farm',
    items: ['ESP32', 'LoRa SX1278', 'Rain sensor', 'Water flow sensor', 'Local display', 'Wi-Fi to the backend'],
  },
  {
    layer: 'Backend',
    note: 'Stores and serves data',
    items: ['Python', 'FastAPI', 'PostgreSQL', 'TimescaleDB'],
  },
  {
    layer: 'AI',
    note: 'Forecast and advise',
    items: ['LSTM forecasting', 'XGBoost decisions', 'Agentic RAG crop advisor'],
  },
  {
    layer: 'App and dashboard',
    note: 'What farmers use',
    items: ['Flutter', 'Dart', 'TypeScript dashboard'],
  },
  {
    layer: 'Drone (planned)',
    note: 'One-off field scan',
    items: ['Raspberry Pi 5', 'Thermal camera', 'Multispectral camera', 'RGB camera'],
  },
];

// Stack geometry (--stack-top, --stack-step) lives in index.css, the single source. The scrub
// below reads the last layer's computed sticky `top` back, so the two can never drift apart.
const STACK_MQ = '(min-width: 992px) and (prefers-reduced-motion: no-preference)';

/**
 * Signature 3: the system builds from soil to screen. On desktop each layer is `position: sticky`
 * (native, so Lenis keeps it smooth) and the next slides up over it. GSAP scrubs only `scale`
 * and the opacity of a shade layer, both compositor properties: every covered layer recedes a
 * little further with each layer that lands on top of it (the #25275 stacking maths). Phones and
 * reduced motion get the static slabs.
 */
export const TechStack: React.FC = () => {
  const list = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const ol = list.current;
      if (!ol) return;
      const mm = gsap.matchMedia();
      mm.add(STACK_MQ, () => {
        const items = [...ol.querySelectorAll<HTMLElement>(':scope > .aq-layer')];
        const n = items.length;
        const last = items[n - 1];
        items.slice(0, -1).forEach((li, i) => {
          const card = li.querySelector<HTMLElement>('.aq-layer-tone');
          const shade = li.querySelector<HTMLElement>('.aq-layer-shade');
          const tween = { ease: 'none' as const, scrollTrigger: {
            trigger: items[i + 1],
            start: 'top bottom',
            endTrigger: last,
            end: () => `top ${parseFloat(getComputedStyle(last).top) || 0}px`,
            scrub: true,
          } };
          if (card) gsap.to(card, { scale: 1 - (n - 1 - i) * 0.028, ...tween });
          if (shade) gsap.to(shade, { opacity: 1, ...tween });
        });
      });
      return () => mm.revert();
    },
    { scope: list },
  );

  return (
    <section id="tech" className="aq-sec" aria-labelledby="tech-title">
      <div className="aq-wrap aq-tech">
        <div className="aq-tech-head">
          <SplitHeading as="h2" id="tech-title" className="aq-h2">The technology underneath.</SplitHeading>
          <Reveal delay={220}>
            <p className="aq-lead">
              Common, affordable hardware and open software, from the sensor in the soil to the screen in your hand.
            </p>
          </Reveal>
        </div>

        <ol ref={list} className="aq-layers">
          {LAYERS.map((l, n) => (
            <li key={l.layer} className="aq-layer" style={{ '--i': n } as React.CSSProperties}>
              <Reveal className="aq-layer-card" delay={n * 60} threshold={0.15}>
                <div data-tone={n} className="aq-layer-tone">
                  <div className="aq-layer-name">
                    <h3>{l.layer}</h3>
                    <p>{l.note}</p>
                  </div>
                  <ul className="aq-chips">
                    {l.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                  <span className="aq-layer-shade" aria-hidden="true" />
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
