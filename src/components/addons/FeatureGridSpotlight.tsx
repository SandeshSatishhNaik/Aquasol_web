import React from 'react';
import { ProductShowcase } from './magnetic-gallery';
import { SplitHeading } from '../motion/SplitHeading';
import { Reveal } from '../motion/Reveal';

export const FeatureGridSpotlight: React.FC = () => (
  <section id="product" className="aq-sec aq-sec--sand" aria-labelledby="product-title">
    <div className="aq-wrap">
      <div className="aq-product-head">
        <SplitHeading as="h2" id="product-title" className="aq-h2">The AquaSol app, screen by screen.</SplitHeading>
        <Reveal delay={220}><p className="aq-lead">
          Six screens from the app. The numbers on them are examples from the app&rsquo;s own data,
          not results.
        </p></Reveal>
      </div>
      <ProductShowcase />
    </div>
  </section>
);
