import React from 'react';
import { Reveal } from '../motion/Reveal';
import { SplitHeading } from '../motion/SplitHeading';

// This section answers "why this and not the other thing", so it carries the two claims the
// rest of the page never makes: that ground and aerial readings are correlated rather than
// collected side by side, and that every verdict shows its evidence. The comparison table in
// Different covers cost, range and power, so none of that is repeated here.

// The reasoning path, written as the three outcomes a zone can actually get. The third one is
// the point: an inconclusive zone is handed back to the farmer instead of given a fake answer.
const CASES = [
  {
    tone: 'flag',
    ground: 'Soil moisture below the zone baseline',
    aerial: 'Thermal stress signature over the zone',
    verdict: 'Water stress, flagged with its evidence',
  },
  {
    tone: 'clear',
    ground: 'Soil moisture normal for the zone',
    aerial: 'Thermal stress signature over the zone',
    verdict: 'Water stress ruled out, another cause considered',
  },
  {
    tone: 'hold',
    ground: 'Readings conflict, or the signal is weak',
    aerial: 'Nothing the ground data supports',
    verdict: 'No diagnosis. The zone is marked for a manual look',
  },
];

const POINTS = [
  {
    term: 'Root cause, not a red patch',
    detail:
      'A stress spot on a drone map does not say why it is there. Pairing what the canopy looks like from above with what the soil is doing below separates water stress from a hot afternoon.',
  },
  {
    term: 'Offline first, by design',
    detail:
      'Correlation, reasoning and valve control run on the gateway standing in the field. The farm keeps deciding through an internet outage, and syncing to the cloud stays optional.',
  },
  {
    term: 'Evidence you can audit',
    detail:
      'Every alert carries the ground reading, the aerial change and the history it was compared against, so a farmer can check the claim instead of trusting a black box.',
  },
  {
    term: 'Water where it is needed',
    detail:
      'Zone-by-zone decisions replace blanket spraying and fixed-schedule watering, so effort and water land on the part of the farm that asked for them.',
  },
];

export const About: React.FC = () => (
  <section id="about" className="aq-sec" aria-labelledby="about-title">
    <div className="aq-wrap aq-about">
      <div className="aq-about-head">
        <SplitHeading as="h2" id="about-title" className="aq-h2 aq-h2--sm">Why AquaSol.</SplitHeading>
        <Reveal delay={220}>
        <p className="aq-lead">
          Most farm technology does one half of the job: drones photograph the canopy, sensors read the
          soil, and the farmer is left to join them up. AquaSol reads both against the same zone and the
          same hour, on the farm itself, and shows its working.
        </p>
        </Reveal>
      </div>

      <div className="aq-why">
        <h3 className="aq-why-title" id="about-cases">How a zone gets its verdict</h3>
        <ul className="aq-cases" aria-labelledby="about-cases">
          {CASES.map((c, i) => (
            <li key={c.verdict} className="aq-case" data-tone={c.tone}>
              <Reveal className="aq-case-body" delay={i * 90}>
                <div className="aq-case-in">
                  <p><span>Ground</span>{c.ground}</p>
                  <p><span>Aerial</span>{c.aerial}</p>
                </div>
                <p className="aq-case-out">{c.verdict}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <dl className="aq-about-points">
        {POINTS.map((p, i) => (
          <Reveal key={p.term} className="aq-point" delay={i * 80}>
            <dt>{p.term}</dt>
            <dd>{p.detail}</dd>
          </Reveal>
        ))}
      </dl>

      <p className="aq-note">
        Built by a final-year Electronics and Communication team at GM University, Davangere: Abhishek PJ,
        Ganesh Chaithanya and Zainab Quazi, mentored by Mr. Raviteja Balekai. Submitted to Smart India
        Hackathon 2026 under problem statement SIH26180.
      </p>
    </div>
  </section>
);
