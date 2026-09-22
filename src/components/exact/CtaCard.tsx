import React from 'react';
import { Magnetic } from '../motion/Magnetic';
import { ArrowRight } from 'lucide-react';
import { SplitHeading } from '../motion/SplitHeading';
import { Reveal } from '../motion/Reveal';

export const CtaCard: React.FC = () => (
  <section className="aq-sec aq-sec--dark" aria-labelledby="close-title">
    <div className="aq-wrap aq-close">
      <SplitHeading as="h2" id="close-title" className="aq-h2">
        Ready to see AquaSol <span className="aq-accent">in action?</span>
      </SplitHeading>
      <Reveal delay={220}><p className="aq-lead">
        Get in touch to see how AquaSol waters each zone only when it needs it.
      </p></Reveal>
      <div className="aq-close-actions">
        <Magnetic>
        <a href="#contact" className="aq-cta">
          <span>Request a demo</span>
          <span className="aq-cta-icon" aria-hidden="true">
            <ArrowRight size={15} strokeWidth={2.6} />
          </span>
        </a>
        </Magnetic>
      </div>
    </div>
  </section>
);
