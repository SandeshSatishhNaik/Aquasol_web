import React from 'react';
import { Button } from '../ui/Button';

export const FoundersSection: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
        <div className="lg:col-span-6">
          <h2 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#192823] leading-tight">
            Words from <span className="text-[#325a4d]">founders.</span>
          </h2>
        </div>
        <div className="lg:col-span-6">
          <p className="text-base sm:text-lg text-[#192823]/75 leading-relaxed">
            By identifying a market gap where existing project management tools didn&#39;t meet modern team needs, a more collaborative platform was created.
          </p>
        </div>
      </div>

      {/* Main Grid: Founder Image & Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Founder Image Container with Cutouts */}
        <div className="lg:col-span-6 relative rounded-[2.5rem] overflow-hidden bg-black/5 aspect-[4/3] lg:aspect-auto min-h-[380px] shadow-sm border border-black/[0.06]">
          <img
            src="/assets/68b93df946bf6f20096a6c62_Founders-aec245704e.avif"
            alt="Founders Michael and Sabrina"
            className="w-full h-full object-cover"
          />

          {/* Bottom Left Learn More Button */}
          <div className="absolute bottom-6 left-6 z-10">
            <Button variant="light" href="#contact">
              Learn more
            </Button>
          </div>

          {/* Bottom Right Corner Cutout */}
          <div className="absolute bottom-0 right-0 z-10 p-3 bg-[#edebe3] rounded-tl-3xl border-t border-l border-black/[0.06]">
            <img
              src="/assets/68aeb2a5a67a4655a7dbbc84_logomark-82a1244df6.svg"
              alt=""
              className="w-6 h-6 rotate-45"
            />
          </div>
        </div>

        {/* Founder Quotes Column */}
        <div className="lg:col-span-6 flex flex-col gap-6 justify-between">
          {/* Quote 1: Michael Perry (Dark Card) */}
          <div className="bg-[#192823] text-white rounded-[2rem] p-8 relative overflow-hidden shadow-md border border-white/10 flex-1 flex flex-col justify-between">
            <p className="font-['Bricolage_Grotesque'] text-lg sm:text-xl font-medium leading-relaxed text-white/95">
              &ldquo;We started this platform because managing projects always felt harder than it should be. Too many tools created more noise than clarity. We wanted to design a simpler way - one that helps teams stay aligned and <span className="text-[#8da496]">move forward</span> without the chaos.&rdquo;
            </p>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-sm font-semibold text-white/80">
                Michael Perry <span className="text-white/40 font-normal">/ Co Founder</span>
              </span>
              <img
                src="/assets/68b951fddd06761573a231f5_white-cursor-e28104a43d.svg"
                alt=""
                className="w-5 h-5 opacity-80"
              />
            </div>
          </div>

          {/* Quote 2: Sabrina Purdish (Cream Card) */}
          <div className="bg-[#edebe3] text-[#192823] rounded-[2rem] p-8 relative overflow-hidden shadow-sm border border-black/[0.04] flex-1 flex flex-col justify-between">
            <p className="font-['Bricolage_Grotesque'] text-lg sm:text-xl font-medium leading-relaxed text-[#192823]/95">
              &ldquo;From day one, our vision has been to give teams a clear path from idea to completion. We believe project management should feel like progress, not paperwork.&rdquo;
            </p>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-black/[0.06]">
              <span className="text-sm font-semibold text-[#192823]">
                Sabrina Purdish <span className="text-black/40 font-normal">/ Co Founder</span>
              </span>
              <img
                src="/assets/68adc554887e7e23cb57bf4a_arrow-light-12e713238e.svg"
                alt=""
                className="w-5 h-5 opacity-60 invert"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Demo Invite Banner */}
      <div className="mt-12 bg-white rounded-3xl p-8 border border-black/[0.04] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <h3 className="font-['Bricolage_Grotesque'] text-xl sm:text-2xl font-bold text-[#192823] max-w-xl">
          We are always ready to show you how our platform works.{' '}
          <span className="text-[#325a4d]">Signup for a quick demo presentation with us!</span>
        </h3>
        <Button variant="dark" href="#contact" className="shrink-0">
          Try demo
        </Button>
      </div>
    </section>
  );
};
