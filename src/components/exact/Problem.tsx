import React, { useRef } from 'react';
import { gsap, MOTION_OK, SplitText, useGSAP } from '../../lib/gsap';
import { Reveal } from '../motion/Reveal';

// `text` is the exact string shown in the source deck; the counter parts are derived from it so
// the counted number always lands on the sourced figure.
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

/**
 * Signature 1. The statement heading's words illuminate as it is read, scrubbed to scroll, and the
 * three figures count up once as they enter view. The markup always holds the final sourced values,
 * so reduced motion and no-JS both show them; motion only rewinds and replays what is already there.
 */
export const Problem: React.FC = () => {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const title = el.querySelector<HTMLElement>('.aq-problem-title');
        if (title) {
          SplitText.create(title, {
            type: 'words',
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.words,
                { opacity: 0.16 },
                {
                  opacity: 1,
                  ease: 'none',
                  stagger: 0.14,
                  scrollTrigger: { trigger: title, start: 'top 82%', end: 'bottom 40%', scrub: 0.6 },
                },
              ),
          });
        }

        // Each figure counts up once, on a timer, when it enters view. It used to be scrubbed to
        // scroll position, so a reader who stopped part-way saw a partial number (~57%, 117M+) on
        // screen, and these are sourced statistics. On a timer it always finishes on the real value.
        const counters = [...el.querySelectorAll<HTMLElement>('[data-count]')];
        const finals = counters.map((c) => c.textContent ?? '');
        counters.forEach((c, i) => {
          const to = Number(c.dataset.count);
          const prefix = c.dataset.prefix ?? '';
          const suffix = c.dataset.suffix ?? '';
          const o = { v: 0 };
          const show = (n: number) => (c.textContent = `${prefix}${Math.round(n)}${suffix}`);
          show(0);
          gsap.to(o, {
            v: to,
            duration: 1.7,
            delay: i * 0.12,
            ease: 'power2.out',
            onUpdate: () => show(o.v),
            onComplete: () => (c.textContent = finals[i]),
            scrollTrigger: {
              trigger: c,
              start: 'top 92%',
              once: true,
              // Loaded or jumped well past the figure (a deep link): never leave it at 0.
              onLeave: () => (c.textContent = finals[i]),
            },
          });
        });

        gsap.from(el.querySelectorAll('.aq-consequences li'), {
          y: 26,
          opacity: 0,
          duration: 0.95,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el.querySelector('.aq-consequences'), start: 'top 86%', once: true },
        });

        // Leaving the motion branch (e.g. reduced motion switched on mid-session): show the finals.
        return () => counters.forEach((c, i) => (c.textContent = finals[i]));
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="problem" className="aq-sec" aria-labelledby="problem-title">
      <div ref={root} className="aq-wrap aq-problem">
        <div>
          <h2 id="problem-title" className="aq-h2 aq-h2--display aq-problem-title">
            Irrigation still runs on guesswork.
          </h2>
          <Reveal delay={220}>
            <p className="aq-lead">
              Farmers water by habit and by walking the field. Landowners with other jobs cannot be there every day.
              The result is wasted water, wasted time and lost yield.
            </p>
          </Reveal>
        </div>

        <dl className="aq-stats">
          {STATS.map((s, i) => (
            <Reveal key={s.text} className="aq-stat" delay={i * 90}>
              <dt className="aq-stat-value">
                <span aria-hidden="true" data-count={s.value} data-prefix={s.prefix} data-suffix={s.suffix}>
                  {s.text}
                </span>
                <span className="aq-sr">{s.text}</span>
              </dt>
              <dd className="aq-stat-label">{s.label}</dd>
            </Reveal>
          ))}
        </dl>

        <div>
          <ul className="aq-consequences">
            {CONSEQUENCES.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <Reveal>
            <p className="aq-source">Figures from the AquaSol team’s pitch deck.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
