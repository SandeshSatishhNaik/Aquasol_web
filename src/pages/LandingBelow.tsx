import React from 'react';
import { Problem } from '../components/exact/Problem';
import { Features } from '../components/exact/Features';
import { Working } from '../components/exact/Working';
import { Hardware } from '../components/exact/Hardware';
import { Different } from '../components/exact/Different';
import { TechStack } from '../components/exact/TechStack';
import { Roadmap } from '../components/exact/Roadmap';
import { FeatureGridSpotlight } from '../components/addons/FeatureGridSpotlight';
import { VideoPreview } from '../components/exact/VideoPreview';
import { About } from '../components/exact/About';
import { Contact } from '../components/exact/Contact';
import { CtaCard } from '../components/exact/CtaCard';

/** Every section under the hero. Lazy-loaded by LandingPage so none of it is in the first download. */
export default function LandingBelow(): React.ReactElement {
  return (
    <>
      <Problem />
      <Hardware />
      <Features />
      <Working />
      <FeatureGridSpotlight />
      <VideoPreview />
      <Different />
      <TechStack />
      <Roadmap />
      <About />
      <Contact />
      <CtaCard />
    </>
  );
}
