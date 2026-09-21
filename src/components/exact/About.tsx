import React from 'react';
import { Reveal } from '../motion/Reveal';

// The old version repeated the hero sub and the Problem lead almost verbatim, and
// reused the drone screenshot that the demo section already shows. It now carries
// only what is not said elsewhere: who built this, and what it is.
const POINTS = [
  {
    term: 'Who we are',
    detail:
      'A final-year Electronics and Communication team at GM University, Davangere: Abhishek PJ, Ganesh Chaithanya and Zainab Quazi, mentored by Mr. Raviteja Balekai.',
  },
  {
    term: 'What it is',
    detail:
      'A working prototype: one master gateway, two solar-powered field nodes, an app, and the AI layer specified in our project report.',
  },
  {
    term: 'Where it is going',
    detail:
      'Submitted to Smart India Hackathon 2026 under problem statement SIH26180, AI-powered Smart Farming Assistant. The MVP is in progress; pilots with farmers come next.',
  },
];

export const About: React.FC = () => (
  <section id="about" className="aq-sec" aria-labelledby="about-title">
    <div className="aq-wrap aq-about">
      <Reveal className="aq-about-head">
        <h2 id="about-title" className="aq-h2 aq-h2--sm">Why AquaSol.</h2>
        <p className="aq-lead">
          Built by students, for farms that cannot be watched every day.
        </p>
      </Reveal>

      <dl className="aq-about-points">
        {POINTS.map((p, i) => (
          <Reveal key={p.term} className="aq-point" delay={i * 80}>
            <dt>{p.term}</dt>
            <dd>{p.detail}</dd>
          </Reveal>
        ))}
      </dl>
    </div>
  </section>
);
