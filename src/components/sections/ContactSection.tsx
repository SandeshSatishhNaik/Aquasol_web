import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle } from '@phosphor-icons/react';
import { Button } from '../ui/Button';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#192823', '#8da496', '#f6f4ee'],
      });
    }, 800);
  };

  return (
    <section id="contact" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Contact Form & Image Card */}
      <div className="bg-[#edebe3] rounded-[2.5rem] p-8 sm:p-12 md:p-16 border border-black/[0.05] shadow-[0_8px_32px_rgba(25,40,35,0.03)] mb-16 md:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Form Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h2 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#192823] leading-tight">
              Let&#39;s map it out.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#192823]/75 leading-relaxed">
              Every journey needs a guide. Whether you&#39;re just starting out or aiming for the summit, we&#39;re here to help you find the path forward.
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 bg-white rounded-2xl border border-emerald-200 shadow-sm flex items-start gap-4"
              >
                <CheckCircle size={32} weight="fill" className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#192823] text-lg">Thank you!</h4>
                  <p className="text-sm text-[#192823]/70 mt-1">
                    Your transmission has been logged. Our trail guides will reach out to{' '}
                    <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', message: '' });
                    }}
                    className="mt-4 text-xs font-semibold text-[#192823] underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-[#192823]/60 mb-2">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.08] focus:border-[#192823] focus:ring-2 focus:ring-[#192823]/10 outline-none text-[#192823] text-sm transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-[#192823]/60 mb-2">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Your email address"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.08] focus:border-[#192823] focus:ring-2 focus:ring-[#192823]/10 outline-none text-[#192823] text-sm transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-[#192823]/60 mb-2">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help your team?"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.08] focus:border-[#192823] focus:ring-2 focus:ring-[#192823]/10 outline-none text-[#192823] text-sm transition-all resize-none"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    variant="dark"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full justify-center py-3"
                  >
                    {isSubmitting ? 'Sending...' : 'Submit inquiry'}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Image & Composite Illustration Column */}
          <div className="lg:col-span-6 relative rounded-[2rem] overflow-hidden bg-white/50 p-4 border border-black/[0.04]">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black/5">
              <img
                src="/assets/68ba8ec8f651b2ae80f960fe_ba5500884d46502af729b760c287bb32_contact-image-4008f4fa5b.avif"
                alt="Workspace discussion"
                className="w-full h-full object-cover"
              />

              {/* Floating Graph Badges */}
              <div className="absolute top-4 right-4 max-w-[140px] drop-shadow-md">
                <img
                  src="/assets/68ba9a7a825a0321bef7f539_contact-graph-2-9ebb8ef66b.svg"
                  alt=""
                  className="w-full h-auto"
                />
              </div>

              <div className="absolute bottom-4 left-4 max-w-[160px] drop-shadow-md">
                <img
                  src="/assets/68ba96bb5377bdddf1fa26ad_2c705921994c7bc05a2108938c122481_contact-graph-1-90aeb7c403.svg"
                  alt=""
                  className="w-full h-auto"
                />
              </div>

              <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/90 shadow-sm flex items-center justify-center p-2 backdrop-blur-xs">
                <img
                  src="/assets/68aeb2a5a67a4655a7dbbc84_logomark-82a1244df6.svg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner: Ready to reach the summit? */}
      <div className="bg-[#192823] text-white rounded-[2.5rem] p-10 sm:p-16 text-center border border-white/10 shadow-2xl relative overflow-hidden">
        <h3 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          Ready to reach <span className="text-[#8da496]">the summit?</span>
        </h3>
        <p className="mt-4 text-base sm:text-lg text-white/75 max-w-xl mx-auto leading-relaxed">
          Start your free trial today and take the first step toward effortless project management.
        </p>
        <div className="mt-8 flex justify-center">
          <Button variant="light" href="#hero">
            Get started
          </Button>
        </div>
      </div>
    </section>
  );
};
