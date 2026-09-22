import React from 'react';
import { Reveal } from '../motion/Reveal';
import { SplitHeading } from '../motion/SplitHeading';

export const Hardware: React.FC = () => (
  <section id="hardware" className="aq-sec" aria-labelledby="hardware-title">
    <div className="aq-wrap aq-hw">
      <div className="aq-hw-left">
        <div>
          <SplitHeading as="h2" id="hardware-title" className="aq-h2">Built to sit in a field.</SplitHeading>
          <Reveal delay={220}>
          <p className="aq-lead">
            The prototype is a master gateway between two solar field nodes. Each unit is weatherproof and runs on
            its own panel.
          </p>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <figure className="aq-hw-photo">
            <img
              src="/assets/aquasol-prototype-photo.png"
              alt="The AquaSol prototype: a master gateway between two solar-powered field nodes, each on a stand above a potted plant"
              width="612"
              height="420"
              loading="lazy"
              decoding="async"
            />
            <figcaption>The prototype: Node 1, the master and Node 2.</figcaption>
          </figure>
        </Reveal>
      </div>

      <div className="aq-hw-units">
        <Reveal>
          <figure className="aq-hw-unit">
            <img
              src="/assets/aquasol-node-unit-clean.png"
              className="aq-colorize"
              alt="Field node in an IP65 enclosure with an OLED display, power, LoRa and valve status lights, a DHT22 sensor, a LoRa antenna, an on-off switch and a replaceable fuse"
              width="907"
              height="497"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <strong>Field node.</strong> OLED display, status lights, DHT22 sensor, soil moisture probe, valve control
              and a LoRa antenna, in an IP65 enclosure.
            </figcaption>
          </figure>
        </Reveal>
        <Reveal delay={100}>
          <figure className="aq-hw-unit">
            <img
              src="/assets/aquasol-master-unit-clean.png"
              className="aq-colorize"
              alt="Master gateway in an IP65 enclosure with a rain sensor, an LCD display, status lights, a LoRa antenna, an on-off switch and a replaceable fuse"
              width="741"
              height="517"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <strong>Master gateway.</strong> Rain sensor, LCD display, backend connection and pump lights, and the LoRa
              radio that talks to every node.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </div>
  </section>
);
