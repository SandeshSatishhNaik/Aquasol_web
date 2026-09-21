import React from 'react';
import { NumberTicker } from '../addons/NumberTicker';
import { Reveal } from '../motion/Reveal';

// `text` is the exact string shown in the source deck; the ticker parts are derived from it
// so the counted number always lands on the sourced figure.
const STATS = [
  { text: '~70%', prefix: '~', value: 70, suffix: '%', label: 'of the world’s freshwater is used by agriculture' },
  { text: '144M+', prefix: '', value: 144, suffix: 'M+', label: 'agricultural labourers in India' },
  { text: '~50%', prefix: '~', value: 50, suffix: '%', label: 'of farming household income comes from non-farm wages, so many owners cannot be in the field' },
];

const CONSEQUENCES = [
  'Watering by habit and manual checks means over-irrigation or under-irrigation.',
  'Constant field visits cost time and labour, and part-time farmers cannot make them.',
  'Rural internet is unreliable, so systems that need the cloud fall short.',
  'Most smart irrigation is costly and follows fixed schedules or simple thresholds.',
];

export const Problem: React.FC = () => (
  <section id="problem" className="aq-sec" aria-labelledby="problem-title">
    <div className="aq-wrap aq-problem">
      <Reveal>
        <h2 id="problem-title" className="aq-h2 aq-h2--display aq-problem-title">
          Irrigation still runs on guesswork.
        </h2>
        <p className="aq-lead">
          Farmers water by habit and by walking the field. Landowners with other jobs cannot be there every day.
          The result is wasted water, wasted time and lost yield.
        </p>
      </Reveal>

      <dl className="aq-stats">
        {STATS.map((s, i) => (
          <Reveal key={s.text} className="aq-stat" delay={i * 90}>
            <dt className="aq-stat-value">
              <span aria-hidden="true">
                <NumberTicker value={s.value} prefix={s.prefix} suffix={s.suffix} delay={i * 0.12} />
              </span>
              <span className="aq-sr">{s.text}</span>
            </dt>
            <dd className="aq-stat-label">{s.label}</dd>
          </Reveal>
        ))}
      </dl>

      <Reveal>
        <ul className="aq-consequences">
          {CONSEQUENCES.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className="aq-source">Figures from the AquaSol team’s pitch deck.</p>
      </Reveal>
    </div>
  </section>
);
