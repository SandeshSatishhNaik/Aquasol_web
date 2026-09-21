import React from 'react';
import { Reveal } from '../motion/Reveal';

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

export const TechStack: React.FC = () => (
  <section id="tech" className="aq-sec" aria-labelledby="tech-title">
    <div className="aq-wrap aq-tech">
      <div className="aq-tech-head">
        <h2 id="tech-title" className="aq-h2">The technology underneath.</h2>
        <p className="aq-lead">
          Common, affordable hardware and open software, from the sensor in the soil to the screen in your hand.
        </p>
      </div>

      <ol className="aq-layers">
        {LAYERS.map((l, n) => (
          <li key={l.layer} className="aq-layer">
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
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
