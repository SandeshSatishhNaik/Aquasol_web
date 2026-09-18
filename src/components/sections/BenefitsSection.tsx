import React from 'react';

export const BenefitsSection: React.FC = () => {
  return (
    <section id="benefits" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Visual Illustration Block */}
        <div className="lg:col-span-6 bg-[#192823] text-white rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-xl border border-white/10 flex flex-col justify-between min-h-[440px]">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <img
              src="/assets/68b7ec421ba43f03a88bb051_bg-pattern-3fa77ace18.svg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="font-['Bricolage_Grotesque'] text-2xl sm:text-3xl font-bold tracking-tight z-10 text-white/90">
            Always on track.
          </h3>

          <div className="relative my-8 z-10 flex items-center justify-center">
            <img
              src="/assets/68b7e14cbd8cc75a319810c9_b4b54834e0fcb0b573ea394382cb5e84_benefit-illy-back-084a9f564c.svg"
              alt="Track illustration"
              className="w-full max-w-md h-auto object-contain drop-shadow-md hover:scale-[1.02] transition-transform duration-300"
            />
          </div>

          <div className="flex items-center gap-3 z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/70 uppercase tracking-widest font-semibold">
              Live Synchronization
            </span>
          </div>
        </div>

        {/* Right Content Points */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <h2 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#192823] leading-tight">
            Simplified <span className="text-[#325a4d]">workflows.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#192823]/75 leading-relaxed">
            Turn complex projects into clear, step-by-step tasks that everyone can follow. With structured workflows, your team always knows what to do next.
          </p>

          <div className="mt-10 space-y-8">
            {/* Point 1: Team Sync */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-black/[0.06] flex items-center justify-center p-2.5 shrink-0 -rotate-3 hover:rotate-0 transition-transform">
                <img
                  src="/assets/68b7fd56bb8fe2f9977feb89_team-3d7c86923a.svg"
                  alt="Team sync"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-['Bricolage_Grotesque'] text-xl font-bold text-[#192823]">
                  Team sync
                </h4>
                <p className="mt-1 text-sm text-[#192823]/70 leading-relaxed">
                  Ensure seamless collaboration by utilizing tools that offer notifications and updates. This way, team members can adapt and maintain a cohesive workflow.
                </p>
              </div>
            </div>

            {/* Point 2: Progress Insights */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-black/[0.06] flex items-center justify-center p-2.5 shrink-0 rotate-3 hover:rotate-0 transition-transform">
                <img
                  src="/assets/68b7fe6621409a7d83062f14_progress-59290c05d2.svg"
                  alt="Progress insights"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-['Bricolage_Grotesque'] text-xl font-bold text-[#192823]">
                  Progress insights
                </h4>
                <p className="mt-1 text-sm text-[#192823]/70 leading-relaxed">
                  Visual indicators provide a clear snapshot of your team&#39;s progress, milestones achieved and areas that need extra attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
