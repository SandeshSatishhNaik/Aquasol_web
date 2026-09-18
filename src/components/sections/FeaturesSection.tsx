import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';

export const FeaturesSection: React.FC = () => {
  const smallBenefits = [
    {
      icon: '/assets/68af5cb2505e1fd7bd8d99e8_8fb655f92905cd8b9830c4b62cd1724c_sb-icon-ff8763170b.svg',
      text: 'Keep everyone moving in the same direction.',
    },
    {
      icon: '/assets/68af62af9031210f5f42a4bc_sb-icon-3-9151343bae.svg',
      text: 'Stay focused with clear progress tracking.',
    },
    {
      icon: '/assets/68af6216125ae28405d2a0ba_sb-icon-2-accac04924.svg',
      text: 'Turn complex projects into easy steps.',
    },
  ];

  const featureCards = [
    {
      icon: '/assets/68b04ff26bb9ffa0a0e85b23_md-graph-95301cf377.svg',
      title: 'Task tracking',
      description:
        'Break projects into manageable, measurable steps and monitor progress so nothing falls through the cracks.',
    },
    {
      icon: '/assets/68b044115dfe254197c14a3e_team-collaboration-f6b6f59bde.svg',
      title: 'Team Collaboration',
      description:
        'Share updates, assign responsibilities, and keep communication flowing with tools built for teamwork.',
    },
    {
      icon: '/assets/68b01bf8ea387e49ea3c955c_2f70f74ccf312686d206b299ac0dbcc1_task-tracking-v3-3bad456985.svg',
      title: 'Milestones & Deadlines',
      description:
        'Set goals, track deadlines, and celebrate achievements as your team makes steady goal progress.',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-[#edebe3] rounded-[2.5rem] my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-black/[0.05]">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
        <h2 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#192823] leading-tight">
          Features that make us stand out from the crowd.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#192823]/70 leading-relaxed">
          Turn complex workflows into simple, trackable steps with powerful project features.
        </p>
      </div>

      {/* Main Feature Row (Visual Roadmaps) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16 md:mb-24">
        {/* Left Copy & Bullet Checklist */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h3 className="font-['Bricolage_Grotesque'] text-2xl sm:text-3xl md:text-4xl font-bold text-[#192823]">
            Visual Roadmaps
          </h3>
          <p className="mt-4 text-[#192823]/75 leading-relaxed text-sm sm:text-base">
            Map out your projects with clear, visual roadmaps that keep every milestone and deadline in sight. These roadmaps provide a bird&#39;s-eye view of your project&#39;s progress in no time.
          </p>

          <div className="mt-8 space-y-4">
            {smallBenefits.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3.5 group">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center p-1.5 transition-transform group-hover:scale-110">
                  <img src={item.icon} alt="" className="w-full h-full object-contain" />
                </div>
                <p className="text-sm font-semibold text-[#192823]">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button variant="dark" href="#contact">
              Learn more
            </Button>
          </div>
        </div>

        {/* Right Feature Graphic Pair */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-black/[0.04] flex items-center justify-center">
            <img
              src="/assets/68b05c39f7bab6dbf47da69d_visual-roadmaps-fe55ea2adf.svg"
              alt="Visual Roadmap Interface"
              className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
          <div className="sm:col-span-1 bg-white rounded-3xl overflow-hidden shadow-sm border border-black/[0.04] aspect-[4/5] sm:aspect-auto">
            <img
              src="/assets/68aef0b86ece94964647005b_office-emberly-29800abf3f.avif"
              alt="Team at work"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featureCards.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(25,40,35,0.03)] border border-black/[0.04] flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#edebe3] flex items-center justify-center p-3 mb-6">
                <img src={card.icon} alt="" className="w-full h-full object-contain" />
              </div>
              <h4 className="font-['Bricolage_Grotesque'] text-xl font-bold text-[#192823] mb-2">
                {card.title}
              </h4>
              <p className="text-sm text-[#192823]/70 leading-relaxed">
                {card.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
