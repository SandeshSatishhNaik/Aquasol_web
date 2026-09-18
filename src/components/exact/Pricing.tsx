import React, { useState } from 'react';
import { NumberTicker } from '../addons/NumberTicker';

export const Pricing: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);

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

  const prices = {
    trailhead: isAnnual ? 22 : 29,
    basecamp: isAnnual ? 47 : 59,
    summit: isAnnual ? 71 : 89,
  };

  return (
    <div id="pricing" className="section">
      <div className="container centered">
        <h1 className="heading h2 centered">Find the right path.</h1>
        <div className="text-box m">
          <p className="paragraph large centered">
            No hidden fees, no surprises - just straightforward pricing plans built for progress.
          </p>
        </div>

        {/* Animated Billing Frequency Toggle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '24px',
            marginBottom: '8px',
            gap: '8px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '9999px',
              background: 'rgba(94, 102, 34, 0.08)',
              border: '1px solid rgba(94, 102, 34, 0.18)',
            }}
          >
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              style={{
                padding: '6px 18px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.25s ease',
                background: !isAnnual ? '#171717' : 'transparent',
                color: !isAnnual ? '#ffffff' : '#4d541c',
              }}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 18px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.25s ease',
                background: isAnnual ? '#5e6622' : 'transparent',
                color: isAnnual ? '#ffffff' : '#4d541c',
              }}
            >
              Annual
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  background: isAnnual ? '#ffffff' : '#5e6622',
                  color: isAnnual ? '#5e6622' : '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="spacer _32" />
        <div className="w-layout-grid _4-1-grid">
          {/* Starter Plan */}
          <div data-w-id="41a119fd-d6dd-4d68-fb35-b15d222f2f0c" className="pricing-card">
            <div className="plan-name-icon-wrap">
              <img
                src="/assets/68b812bfaa7cdbbcbe86dd1a_69a1c51f34def9b73f5910e834f7151c_starter-plan-5f385fcce0.svg"
                loading="lazy"
                alt="icon"
                className="accent-icon"
              />
              <h1 className="heading h6 no-margin">Trailhead</h1>
            </div>
            <p className="paragraph small">
              For individuals and small teams starting to organize basic project managemet.
            </p>
            <div className="pricing-button-wrap">
              <a
                data-wf--button--variant="dark"
                href="#contact"
                className="button-wrap w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2 w-inline-block"
              >
                <div className="button-text w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2">Start</div>
                <img
                  src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg"
                  loading="lazy"
                  alt=""
                  className="image w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2"
                />
              </a>
            </div>
            <div className="price-wrap">
              <h1 className="heading h3">${prices.trailhead} </h1>
              <p className="paragraph small">{isAnnual ? '/ month billed annually' : '/ per month'}</p>
            </div>
          </div>

          {/* Pro Plan (Dark) */}
          <div data-w-id="41a119fd-d6dd-4d68-fb35-b15d222f2f1e" className="pricing-card dark">
            <div className="plan-name-icon-wrap dark-3">
              <div className="popular-wrap">
                <img
                  src="/assets/68b812bfaa7cdbbcbe86dd1b_6b02dc51edcca4ea8ed052610903975e_pro-plan-840ba7fd58.svg"
                  loading="lazy"
                  alt="icon"
                  className="accent-icon dark-4"
                />
                <div className="popular-badge-wrap">
                  <p className="paragraph small no-margin bold">Popular</p>
                </div>
              </div>
              <h1 className="heading h6 white no-margin">Basecamp</h1>
            </div>
            <p className="paragraph small white">
              Perfect for growing teams that need collaboration and structure.
            </p>
            <div className="pricing-button-wrap">
              <a
                data-wf--button--variant="base"
                href="#contact"
                className="button-wrap w-inline-block"
              >
                <div className="button-text">Start</div>
                <img
                  src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg"
                  loading="lazy"
                  alt=""
                  className="image"
                />
              </a>
            </div>
            <div className="price-wrap dark">
              <h1 className="heading h3 white">${prices.basecamp}</h1>
              <p className="paragraph small white">{isAnnual ? '/ month billed annually' : '/ per month'}</p>
            </div>
          </div>

          {/* Agency Plan */}
          <div data-w-id="41a119fd-d6dd-4d68-fb35-b15d222f2f30" className="pricing-card">
            <div className="plan-name-icon-wrap">
              <img
                src="/assets/68b812bfaa7cdbbcbe86dd1d_49b31aef786307a2a7ffa3ec032b17bf_agency-plan-8d285beab8.svg"
                loading="lazy"
                alt="icon"
                className="accent-icon"
              />
              <h1 className="heading h6 no-margin">Summit</h1>
              <p className="paragraph small">
                Advanced tools, security, and customization for enterprises scaling fast.
              </p>
              <div className="pricing-button-wrap">
                <a
                  data-wf--button--variant="dark"
                  href="#contact"
                  className="button-wrap w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2 w-inline-block"
                >
                  <div className="button-text w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2">Start</div>
                  <img
                    src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg"
                    loading="lazy"
                    alt=""
                    className="image w-variant-4204eb55-5f95-435c-1da2-59bb19b63ce2"
                  />
                </a>
              </div>
            </div>
            <div className="price-wrap">
              <h1 className="heading h3">${prices.summit} </h1>
              <p className="paragraph small">{isAnnual ? '/ month billed annually' : '/ per month'}</p>
            </div>
          </div>

          {/* Questions banner */}
          <div data-w-id="41a119fd-d6dd-4d68-fb35-b15d222f2f01" className="faq-heading-wrap">
            <div className="testimonial-icon-wrap">
              <img
                src="/assets/68b812bfaa7cdbbcbe86dd1c_99dda191ee4428d9ec5d71091e7d5502_pink-right-arrow-b2cca1fcb4.svg"
                loading="lazy"
                alt="icon"
                className="testimonial-icon"
              />
            </div>
            <div className="questions-wrap">
              <h1 className="heading h6">Questions on pricing?</h1>
              <p className="paragraph small">Feel free to inquire about any aspect of our pricing plans or related details.</p>
            </div>
            <div className="pricing-button-wrap">
              <a
                data-wf--button--variant="outline"
                href="#contact"
                className="button-wrap w-variant-486b2865-bdcd-be19-167e-94f873d72fb3 w-inline-block"
              >
                <div className="button-text">Write</div>
                <img
                  src="/assets/68adc1ddeabbfa4390965b78_arrow-dark-18405da9fa.svg"
                  loading="lazy"
                  alt=""
                  className="image"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="spacer _64" />

        {/* FAQ Grid */}
        <div className="w-layout-grid _2-1-grid full-width mobile-1-col">
          <div className="faq-left-col">
            <div className="faq-items-wrapper">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="faq-item" style={{ cursor: 'pointer' }}>
                    <div
                      className="faq-item-question"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                    >
                      <h1 className="heading h6 no-margin">{faq.q}</h1>
                      <img
                        loading="lazy"
                        src="/assets/68b82e6d9181ca69a580f63c_561072394081e83345a435f60a8cf1c6_plus-light-f178c12b65.svg"
                        alt="Faq Question Open Icon"
                        className="faq-expand-icon"
                        style={{
                          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease',
                        }}
                      />
                    </div>
                    <div
                      className="faq-item-answer"
                      style={{
                        height: isOpen ? 'auto' : '0px',
                        opacity: isOpen ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'opacity 0.3s ease, height 0.3s ease',
                      }}
                    >
                      <div className="text-box m">
                        <p className="paragraph large padding">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="faq-right-col">
            <div className="faq-text-wrap">
              <h1 className="heading h2 light no-margin">FAQs</h1>
              <p className="paragraph large white">Your questions answered.</p>
            </div>
            <div className="faq-text-wrap">
              <div data-w-id="ed78d577-4c5f-ad5f-5fe4-47cc12fe4bff" className="counter-wrap">
                <NumberTicker
                  value={99}
                  suffix="%"
                  className="count-numbers accent-text"
                />
              </div>
              <p className="paragraph large white no-margin">* Customer satisfaction rate.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
