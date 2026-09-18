import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 0,
      name: 'Daniel Carter',
      role: 'Operations Manager',
      quote:
        "This platform keeps our team aligned from day one of every project. Before, we wasted hours chasing updates across emails and spreadsheets. Now, everything is mapped out in one clear roadmap that's easy to follow.",
      avatar: '/assets/68b5626ee534d02c268b1b26_testimonial-2-8a0bb6aeff.avif',
    },
    {
      id: 1,
      name: 'Sarah Norman',
      role: 'Creative Director',
      quote:
        'Deadlines used to feel overwhelming, especially as our projects grew in size and complexity. With this platform, every milestone is broken down into manageable steps, and we can track progress in real time.',
      avatar: '/assets/68b553a82bb82a30cbd195a6_testimonial-1-cacab22ca2.png',
    },
    {
      id: 2,
      name: 'Jessica Sower',
      role: 'Marketing Manager',
      quote:
        "It's the only tool that made collaboration enjoyable for our team. Tasks, progress, and updates are all in one dashboard, so nobody feels left out. I finally feel in sync.",
      avatar: '/assets/68b56929687bc6a168918d20_testimonial-3-198d3acda6.avif',
    },
    {
      id: 3,
      name: 'Marcus Allen',
      role: 'CEO & Founding Partner',
      quote:
        'Our productivity has doubled since switching to this platform. The visual roadmap gives clarity at every step, so everyone from leadership to interns knows where the project stands. We no longer waste time second-guessing priorities.',
      avatar: '/assets/68b569ab3f3c2a85d83bd475_testimonial-4-69f76e999a.avif',
    },
  ];

  const logos = [
    '/assets/68b573c366157f9f5c903ca2_placeholder-7-9a046f5c41.svg',
    '/assets/68b573f7a9aef3ef2ed5dd75_placeholder-8-c0bb8c49e0.svg',
    '/assets/68b57451f7c68a70370650e5_placeholder-9-de2d5eda1b.svg',
    '/assets/68b5746992d2b3414c11632b_placeholder-10-0758a83b5c.svg',
    '/assets/68b57367dcaa8695e8b127d2_placeholder-6-23dc7f0abe.svg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const active = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-[#edebe3] rounded-[2.5rem] my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border border-black/[0.05]">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#192823]">
          Voices from the Trail.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#192823]/70">
          See how other teams found their path to smoother projects.
        </p>
      </div>

      {/* Testimonial Card Slider */}
      <div className="relative max-w-4xl mx-auto">
        <div className="relative bg-white rounded-[2.5rem] p-8 sm:p-12 md:p-16 shadow-[0_8px_30px_rgba(25,40,35,0.04)] border border-black/[0.04] min-h-[320px] flex flex-col justify-between overflow-hidden">
          {/* Top-Left Logomark Accent */}
          <div className="absolute top-6 left-6 opacity-60">
            <img
              src="/assets/68aeb2a5a67a4655a7dbbc84_logomark-82a1244df6.svg"
              alt=""
              className="w-6 h-6"
            />
          </div>

          {/* Quotation Mark Graphic */}
          <div className="absolute top-8 right-8 opacity-20 hidden sm:block">
            <img
              src="/assets/68b55255c6bc26fb514c26e5_quatation-mark-fb0f2a2ac7.svg"
              alt=""
              className="w-12 h-12"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-8 my-auto"
            >
              <h3 className="font-['Bricolage_Grotesque'] text-xl sm:text-2xl md:text-3xl font-semibold text-[#192823] leading-snug">
                &ldquo;{active.quote}&rdquo;
              </h3>

              <div className="flex items-center gap-4 pt-4 border-t border-black/[0.06]">
                <img
                  src={active.avatar}
                  alt={active.name}
                  className="w-14 h-14 rounded-full object-cover shadow-sm border border-black/10"
                />
                <div>
                  <h4 className="font-bold text-[#192823] text-base">{active.name}</h4>
                  <p className="text-sm text-[#192823]/60">{active.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Arrow Controls */}
          <div className="flex items-center justify-between mt-8 pt-4">
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === i ? 'w-8 bg-[#192823]' : 'w-2 bg-black/15 hover:bg-black/30'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-11 h-11 rounded-full bg-[#edebe3] hover:bg-[#192823] hover:text-white text-[#192823] flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                aria-label="Previous testimonial"
              >
                <CaretLeft size={20} weight="bold" />
              </button>
              <button
                onClick={nextSlide}
                className="w-11 h-11 rounded-full bg-[#edebe3] hover:bg-[#192823] hover:text-white text-[#192823] flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                aria-label="Next testimonial"
              >
                <CaretRight size={20} weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Partner Logos */}
      <div className="mt-20 md:mt-28 text-center">
        <h3 className="font-['Bricolage_Grotesque'] text-xl sm:text-2xl font-bold text-[#192823]">
          You&#39;re in good company.
        </h3>
        <p className="mt-2 text-sm sm:text-base text-[#192823]/70 mb-10">
          Join the growing list of teams already using our platform every day.
        </p>

        <div className="relative overflow-hidden py-4">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 opacity-75">
            {logos.map((logo, i) => (
              <img
                key={i}
                src={logo}
                alt="Partner logo"
                className="h-7 sm:h-8 w-auto object-contain hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
