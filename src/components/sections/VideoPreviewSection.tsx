import React, { useState } from 'react';
import { Play } from '@phosphor-icons/react';
import { Button } from '../ui/Button';
import { VideoModal } from '../VideoModal';

export const VideoPreviewSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#192823] text-white rounded-[2.5rem] p-8 sm:p-12 md:p-16 relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <h2 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              See it in <span className="text-[#8da496]">action.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/75 leading-relaxed">
              Watch a quick demo and discover how easy project management can be.
            </p>
            <div className="mt-8">
              <Button
                variant="light"
                onClick={() => setModalOpen(true)}
              >
                Watch demo
              </Button>
            </div>
          </div>

          {/* Right Video Thumbnail with Play Button Overlay */}
          <div className="lg:col-span-7">
            <div
              onClick={() => setModalOpen(true)}
              className="group relative rounded-[2rem] overflow-hidden cursor-pointer aspect-video bg-black/40 border border-white/15 shadow-2xl"
              aria-label="Play video walkthrough"
            >
              <img
                src="/assets/68ca73ff0b3abba4a0867ee1_Webflow-Screenshot-3396c09185.avif"
                alt="Product video preview"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

              {/* Pulsing Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 text-[#192823] flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white">
                    <Play size={28} weight="fill" className="ml-1" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-white/30 animate-ping pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <VideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoUrl="https://www.youtube.com/embed/pLgPFfFdpDs?autoplay=1"
      />
    </section>
  );
};
