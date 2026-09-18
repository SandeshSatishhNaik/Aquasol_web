import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from '@phosphor-icons/react';
import { Button } from '../ui/Button';

export const PricingSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const plans = [
    {
      name: 'Trailhead',
      price: '$29',
      unit: '/ per month',
      desc: 'For individuals and small teams starting to organize basic project management.',
      icon: '/assets/68b812bfaa7cdbbcbe86dd1a_69a1c51f34def9b73f5910e834f7151c_starter-plan-5f385fcce0.svg',
      popular: false,
    },
    {
      name: 'Basecamp',
      price: '$59',
      unit: '/ per month',
      desc: 'Perfect for growing teams that need collaboration and structure.',
      icon: '/assets/68b812bfaa7cdbbcbe86dd1b_6b02dc51edcca4ea8ed052610903975e_pro-plan-840ba7fd58.svg',
      popular: true,
    },
    {
      name: 'Summit',
      price: '$89',
      unit: '/ per month',
      desc: 'Advanced tools, security, and customization for enterprises scaling fast.',
      icon: '/assets/68b812bfaa7cdbbcbe86dd1d_49b31aef786307a2a7ffa3ec032b17bf_agency-plan-8d285beab8.svg',
      popular: false,
    },
  ];

  const faqs = [
    {
      q: 'Can I change plans later?',
      a: 'Yes, you can upgrade or downgrade your plan anytime from your account settings.',
    },
    {
      q: 'Do you offer discounts for teams?',
      a: 'Yes, we provide volume discounts for larger teams and annual billing.',
    },
    {
      q: 'Is my data secure?',
      a: 'Absolutely. We use enterprise-grade encryption and regular backups to keep your data safe.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes, you can cancel at any time without penalty, and your data remains accessible until the end of the billing cycle.',
    },
    {
      q: "What's included in the Summit plan?",
      a: 'Summit plan comes with advanced security, dedicated onboarding, and custom integrations.',
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#192823]">
          Find the right path.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#192823]/70">
          No hidden fees, no surprises - just straightforward pricing plans built for progress.
        </p>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-12">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-[2.5rem] p-8 flex flex-col justify-between transition-all duration-300 ${
              plan.popular
                ? 'bg-[#192823] text-white shadow-2xl border border-white/10 scale-[1.02]'
                : 'bg-[#edebe3] text-[#192823] shadow-sm border border-black/[0.04] hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-black/10 dark:bg-white/10 flex items-center justify-center p-2.5">
                  <img src={plan.icon} alt="" className="w-full h-full object-contain" />
                </div>
                {plan.popular && (
                  <span className="bg-[#2a443b] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    Popular
                  </span>
                )}
              </div>

              <h3 className="font-['Bricolage_Grotesque'] text-2xl font-bold mb-2">
                {plan.name}
              </h3>
              <p
                className={`text-sm mb-8 leading-relaxed ${
                  plan.popular ? 'text-white/70' : 'text-[#192823]/70'
                }`}
              >
                {plan.desc}
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5 mb-8">
                <span className="font-['Bricolage_Grotesque'] text-4xl sm:text-5xl font-bold">
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.popular ? 'text-white/60' : 'text-[#192823]/60'}`}>
                  {plan.unit}
                </span>
              </div>

              <Button
                variant={plan.popular ? 'light' : 'dark'}
                href="#contact"
                className="w-full justify-center"
              >
                Start
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Question Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 mb-20 border border-black/[0.04] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
            <img
              src="/assets/68b812bfaa7cdbbcbe86dd1c_99dda191ee4428d9ec5d71091e7d5502_pink-right-arrow-b2cca1fcb4.svg"
              alt=""
              className="w-6 h-6"
            />
          </div>
          <div>
            <h4 className="font-['Bricolage_Grotesque'] text-lg font-bold text-[#192823]">
              Questions on pricing?
            </h4>
            <p className="text-sm text-[#192823]/70">
              Feel free to inquire about any aspect of our pricing plans or related details.
            </p>
          </div>
        </div>
        <Button variant="outline" href="#contact" className="shrink-0">
          Write
        </Button>
      </div>

      {/* FAQ Grid with Satisfaction Metric */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Accordion Questions */}
        <div className="lg:col-span-7 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-black/[0.04] shadow-xs overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-[#192823] cursor-pointer hover:bg-black/[0.01]"
              >
                <span className="text-base sm:text-lg">{faq.q}</span>
                <span className="w-8 h-8 rounded-full bg-[#edebe3] flex items-center justify-center text-[#192823] shrink-0">
                  {openFaq === i ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-[#192823]/70 leading-relaxed border-t border-black/[0.04] pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right Metric Card */}
        <div className="lg:col-span-5 bg-[#192823] text-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-white/10 flex flex-col justify-between min-h-[360px]">
          <div>
            <h3 className="font-['Bricolage_Grotesque'] text-3xl font-bold tracking-tight text-white mb-2">
              FAQs
            </h3>
            <p className="text-white/70 text-sm">Your questions answered.</p>
          </div>

          <div className="my-8">
            <div className="flex items-baseline gap-1 font-['Bricolage_Grotesque'] text-7xl sm:text-8xl font-black text-[#8da496] leading-none">
              <span>98</span>
              <span className="text-4xl text-[#8da496]/80">%</span>
            </div>
            <p className="mt-3 text-sm text-white/60 font-medium">
              * Customer satisfaction rate.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-white/50">
            Backed by enterprise SLA and 24/7 dedicated trail guides.
          </div>
        </div>
      </div>
    </section>
  );
};
