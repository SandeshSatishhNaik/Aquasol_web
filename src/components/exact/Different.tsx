import React from 'react';
import { Reveal } from '../motion/Reveal';

const ROWS = [
  {
    topic: 'Cost',
    typical: 'High-end systems cost too much for small farms, and cheap kits lack range.',
    aquasol: 'Low-cost, off-the-shelf parts such as ESP32 boards and LoRa modules.',
  },
  {
    topic: 'Internet',
    typical: 'Many depend on a continuous connection.',
    aquasol: 'The gateway keeps irrigating on the farm when the connection drops.',
  },
  {
    topic: 'Power',
    typical: 'Need mains power or frequent battery changes.',
    aquasol: 'Solar-powered nodes with their own battery.',
  },
  {
    topic: 'Range',
    typical: 'Wi-Fi kits cover a small area.',
    aquasol: 'LoRa radio reaches across the farm at low power.',
  },
  {
    topic: 'Decisions',
    typical: 'Fixed schedules or simple thresholds.',
    aquasol: 'Designed to forecast soil moisture and water ahead of need.',
  },
  {
    topic: 'Growth',
    typical: 'Hard to extend once installed.',
    aquasol: 'Add a node per zone as the farm grows.',
  },
];

export const Different: React.FC = () => (
  <section id="different" className="aq-sec aq-sec--sand" aria-labelledby="different-title">
    <div className="aq-wrap">
      <div className="aq-diff-head">
        <h2 id="different-title" className="aq-h2">What makes AquaSol different.</h2>
        <p className="aq-lead">
          Most smart irrigation is costly, needs the internet and follows fixed rules. AquaSol was designed around
          those gaps.
        </p>
      </div>

      <Reveal className="aq-table-wrap">
        <table className="aq-diff-table">
          <caption className="aq-sr">Typical smart irrigation compared with AquaSol</caption>
          <thead>
            <tr>
              <th scope="col"><span className="aq-sr">Topic</span></th>
              <th scope="col">Typical smart irrigation</th>
              <th scope="col">AquaSol</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.topic}>
                <th scope="row">{r.topic}</th>
                <td data-label="Typical smart irrigation">{r.typical}</td>
                <td data-label="AquaSol">{r.aquasol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <p className="aq-source">
        Based on the gaps in existing systems identified in the AquaSol project report. Beyond irrigation, crop
        planning and farmer services are on the <a href="#roadmap">roadmap</a>.
      </p>
    </div>
  </section>
);
