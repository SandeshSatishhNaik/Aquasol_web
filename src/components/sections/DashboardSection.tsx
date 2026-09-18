import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';

export const DashboardSection: React.FC = () => {
  return (
    <section id="demo" className="py-20 md:py-28 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#192823]">
          Every detail, in one view.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#192823]/70">
          From the big picture to the smallest task, our dashboard gives you clarity and control at every level.
        </p>
      </div>

      {/* Interactive Dashboard Mockup with Cursors */}
      <div className="relative mx-auto max-w-5xl rounded-[2.5rem] p-2 sm:p-3 bg-black/[0.03] border border-black/[0.08] shadow-[0_20px_60px_rgba(25,40,35,0.08)]">
        <div className="relative rounded-[2rem] overflow-hidden bg-white border border-black/[0.06]">
          <img
            src="/assets/68b17368b29db635be2d2b58_0bc9048c77c347a1d758e8373cab62ba_Main-Dashboard-acb9b21a44.avif"
            alt="Main Project Management Dashboard"
            className="w-full h-auto object-cover select-none"
          />

          {/* Floating Kinetic Cursor Top-Right */}
          <motion.div
            animate={{
              x: [0, -12, 0],
              y: [0, 8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: 'easeInOut',
            }}
            className="absolute top-[28%] right-[16%] z-10 pointer-events-none drop-shadow-xl"
          >
            <img
              src="/assets/68b1891039cbf25e3a59da1d_c363d731a4fea03b1f11a8fc65ccaae8_cursor-354b217a96.svg"
              alt="Pointer cursor"
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
          </motion.div>

          {/* Floating Kinetic Hand Cursor Bottom-Left */}
          <motion.div
            animate={{
              x: [0, 10, 0],
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4.5,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            className="absolute bottom-[24%] left-[20%] z-10 pointer-events-none drop-shadow-xl"
          >
            <img
              src="/assets/68b18908d0859a06fb334d8b_905846ca57ba5ce39638dbf99257b304_hand-461e50584c.svg"
              alt="Hand cursor"
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
          </motion.div>
        </div>
      </div>

      {/* Sub-CTA Moment */}
      <div className="mt-14 text-center max-w-xl mx-auto flex flex-col items-center">
        <h3 className="font-['Bricolage_Grotesque'] text-2xl sm:text-3xl font-bold text-[#192823]">
          Try it free.
        </h3>
        <p className="mt-2 text-sm sm:text-base text-[#192823]/70 mb-6">
          Experience powerful project tracking without commitments or limits.
        </p>
        <Button variant="dark" href="#contact">
          Try free demo
        </Button>
      </div>
    </section>
  );
};
