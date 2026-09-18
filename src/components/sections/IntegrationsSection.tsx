import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';

export const IntegrationsSection: React.FC = () => {
  return (
    <section id="integrations" className="py-20 md:py-28 bg-[#edebe3] rounded-[2.5rem] my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-black/[0.05] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Copy & CTAs */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <h2 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#192823] leading-tight">
            Connect over 70+ integrations.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#192823]/75 leading-relaxed">
            Integrate your favourite tools to keep every project moving in sync with uninterrupted data flows.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button variant="dark" href="#contact">
              View
            </Button>
            <Button variant="outline" href="#pricing">
              Integrations
            </Button>
          </div>
        </div>

        {/* Right Rotating Hub Graphic */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[340px]">
          {/* Rotating Back Ring Graphic */}
          <motion.img
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
            src="/assets/68b9717ff1c0865a25a5058a_38043d8ac06b77f111de44f5ed12ea75_integrations-back-1fc422fa5b.svg"
            alt=""
            className="w-72 sm:w-88 h-auto object-contain opacity-80"
          />

          {/* Static Front Core Graphic */}
          <img
            src="/assets/68b9714cae56b2d133bce34b_cd148818a00eac27e7fc34af4bee8147_integrations-front-d56aa35a99.svg"
            alt="Integrations hub"
            className="absolute z-10 w-44 sm:w-56 h-auto object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};
