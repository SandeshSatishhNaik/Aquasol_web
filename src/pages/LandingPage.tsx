import React from 'react';
import { Hero } from '../components/exact/Hero';
import { MarqueeLogoScroller } from '../components/addons/MarqueeLogoScroller';
import { Features } from '../components/exact/Features';
import { FeatureGridSpotlight } from '../components/addons/FeatureGridSpotlight';
import { Demo } from '../components/exact/Demo';
import { Testimonials } from '../components/exact/Testimonials';
import { Benefits } from '../components/exact/Benefits';
import { VideoPreview } from '../components/exact/VideoPreview';
import { Pricing } from '../components/exact/Pricing';
import { Integrations } from '../components/exact/Integrations';
import { About } from '../components/exact/About';
import { Contact } from '../components/exact/Contact';
import { CtaCard } from '../components/exact/CtaCard';

export const LandingPage: React.FC = () => {
  return (
    <>
      <Hero />
      <MarqueeLogoScroller />
      <Features />
      <FeatureGridSpotlight />
      <Demo />
      <Testimonials />
      <Benefits />
      <VideoPreview />
      <Pricing />
      <Integrations />
      <About />
      <Contact />
      <CtaCard />
    </>
  );
};
