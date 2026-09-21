import React from 'react';
import { ArrowRight } from 'lucide-react';

export const CtaCard: React.FC = () => (
  <section className="aq-sec aq-sec--dark" aria-labelledby="close-title">
    <div className="aq-wrap aq-close">
      <h2 id="close-title" className="aq-h2">
        Ready to see AquaSol <span className="aq-accent">in action?</span>
      </h2>
      <p className="aq-lead">
        Get in touch to see how AquaSol waters each zone only when it needs it.
      </p>
      <div className="aq-close-actions">
        <a href="#contact" className="aq-cta">
          <span>Request a demo</span>
          <span className="aq-cta-icon" aria-hidden="true">
            <ArrowRight size={15} strokeWidth={2.6} />
          </span>
        </a>
      </div>
    </div>
  </section>
);
