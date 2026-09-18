import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause } from '@phosphor-icons/react';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const avatars = [
    '/assets/68aeb6f92fe9039518894928_testimonial-2-a2fbfe8b70.png',
    '/assets/68aeb6f92fe9039518894925_testimonial-1-85d606003a.png',
    '/assets/68aeb6f92fe903951889492e_testimonial-3-795decde7f.png',
    '/assets/68aeb6f92fe903951889492b_user-4-a82b4f515e.png',
  ];

  return (
    <section id="hero" className="relative pt-6 md:pt-12 pb-16 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#edebe3] rounded-[2.5rem] p-6 sm:p-8 md:p-12 lg:p-16 border border-black/[0.05] shadow-[0_8px_32px_rgba(25,40,35,0.03)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col justify-center"
            >
              <h1 className="font-['Bricolage_Grotesque'] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#192823] leading-[1.08] max-w-xl">
                Grow projects like forests.{' '}
                <span className="text-[#325a4d]">Reliably.</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-[#192823]/75 leading-relaxed max-w-lg">
                Create a clear roadmap to align your entire team, track milestones, and ensure confident project advancement.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button variant="dark" href="#contact">
                  Sign up
                </Button>
                <Button variant="outline" href="#features">
                  See more
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs font-medium text-[#192823]/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#325a4d]" />
                <span>Free demo</span>
                <span className="text-black/30">•</span>
                <span>No credit card needed</span>
              </div>
            </motion.div>

            {/* Hero Right Media Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative"
            >
              {/* Main Outer Bezel Shell */}
              <div className="relative rounded-[2rem] overflow-hidden bg-black aspect-[4/3] sm:aspect-[16/11] border border-black/10 shadow-2xl">
                {/* Background Video */}
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/assets/68ac094ada452bf00181bba8-2F691efa8f76153a3eb69c3b11_4249212-uhd_3840_2160_24fps_-f2ea23f690.jpg"
                  className="w-full h-full object-cover"
                >
                  <source
                    src="/assets/68ac094ada452bf00181bba8-2F691efa8f76153a3eb69c3b11_4249212-uhd_3840_2160_24fps_-86905025ce.mp4"
                    type="video/mp4"
                  />
                </video>

                {/* Video Play/Pause Control Button */}
                <button
                  onClick={toggleVideoPlay}
                  aria-label={isPlaying ? 'Pause hero video' : 'Play hero video'}
                  className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-transform active:scale-95 border border-white/10"
                >
                  {isPlaying ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
                </button>

                {/* Top-Right Decorative Cutout Mark */}
                <div className="absolute top-0 right-0 z-10 p-3 bg-[#edebe3] rounded-bl-3xl border-b border-l border-black/[0.06] flex items-center justify-center">
                  <img
                    src="/assets/68aeb2a5a67a4655a7dbbc84_logomark-82a1244df6.svg"
                    alt="Logo mark"
                    className="w-7 h-7 transform rotate-45"
                  />
                </div>

                {/* Bottom-Left Social Proof Overlay Cutout */}
                <div className="absolute bottom-0 left-0 z-10 p-4 bg-[#edebe3] rounded-tr-3xl border-t border-r border-black/[0.06]">
                  <p className="text-xs font-semibold text-[#192823] mb-1.5">
                    Loved by <strong className="font-bold text-[#2d5246]">2.5K+</strong> users
                  </p>
                  <div className="flex items-center -space-x-2">
                    {avatars.map((avatar, idx) => (
                      <img
                        key={idx}
                        src={avatar}
                        alt="User avatar"
                        className="w-8 h-8 rounded-full border-2 border-[#edebe3] object-cover shadow-sm -rotate-6 transition-transform hover:scale-110 hover:z-20"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Slogan Badges */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -top-3 right-6 sm:-right-4 z-20 flex flex-col items-end gap-1.5 pointer-events-none"
              >
                <span className="bg-[#192823] text-white text-[11px] font-medium px-3.5 py-1.5 rounded-full shadow-lg border border-white/10">
                  Real-time insights.
                </span>
                <span className="bg-[#faf8f3] text-[#192823] text-[11px] font-semibold px-3 py-1 rounded-full shadow-md border border-black/5">
                  Available now!
                </span>
              </motion.div>

              {/* Floating Hero Illustration Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="hidden sm:block absolute -bottom-5 -right-3 z-20"
              >
                <div className="bg-white p-2 rounded-2xl shadow-xl border border-black/[0.06] hover:rotate-3 transition-transform duration-300">
                  <img
                    src="/assets/68aec695eac9b687bc4c0741_hero-illustration-b7dd9f6cd0.svg"
                    alt="Product illustration"
                    className="w-24 h-auto"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
