import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

interface PricingPlan {
  name: string;
  badge?: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
  ctaLink: string;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    name: 'Trailhead',
    monthlyPrice: 29,
    annualPrice: 22,
    description: 'For individuals and small teams starting to organize basic project management.',
    features: [
      'Up to 5 active project tracks',
      'Basic milestone dependency maps',
      'Community integrations',
      'Standard cloud backup',
    ],
    ctaText: 'Start Trailhead',
    ctaLink: '#contact',
  },
  {
    name: 'Basecamp',
    popular: true,
    badge: 'Most Popular',
    monthlyPrice: 59,
    annualPrice: 47,
    description: 'Perfect for growing teams that need collaboration, sprint velocity, and structure.',
    features: [
      'Unlimited projects & milestones',
      'Real-time multi-user cursor canvas',
      '70+ native app integrations',
      'Automated sprint bottleneck alerts',
      'Priority 24/7 team support',
    ],
    ctaText: 'Start Basecamp',
    ctaLink: '#contact',
  },
  {
    name: 'Summit',
    monthlyPrice: 89,
    annualPrice: 71,
    description: 'Advanced tools, enterprise security, and bespoke customization for scaling fast.',
    features: [
      'Everything in Basecamp',
      'Custom webhook triggers & CLI access',
      'Enterprise SSO & role access',
      'Dedicated onboarding strategist',
      '99.9% uptime SLA guarantee',
    ],
    ctaText: 'Start Summit',
    ctaLink: '#contact',
  },
];

export const AnimatedPricingCard: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="section no-top-padding">
      <div className="container">
        {/* Toggle Bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            gap: '12px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px',
              borderRadius: '9999px',
              background: 'rgba(94, 102, 34, 0.08)',
              border: '1px solid rgba(94, 102, 34, 0.18)',
            }}
          >
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.25s ease',
                background: !isAnnual ? '#171717' : 'transparent',
                color: !isAnnual ? '#ffffff' : '#4d541c',
              }}
            >
              Monthly billing
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.25s ease',
                background: isAnnual ? '#5e6622' : 'transparent',
                color: isAnnual ? '#ffffff' : '#4d541c',
              }}
            >
              Annual billing
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
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
          <p className="paragraph small no-margin" style={{ color: '#666666' }}>
            {isAnnual ? '✨ 2 months free included with annual billing' : 'Flexible month-to-month plans. Cancel anytime.'}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            alignItems: 'stretch',
          }}
        >
          {DEFAULT_PLANS.map((plan, idx) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const isDark = plan.popular;

            return (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '36px 32px',
                  borderRadius: '24px',
                  background: isDark
                    ? 'linear-gradient(145deg, #1b1e0f, #232712)'
                    : '#ffffff',
                  color: isDark ? '#ffffff' : '#171717',
                  border: isDark
                    ? '1px solid rgba(184, 199, 66, 0.35)'
                    : '1px solid rgba(94, 102, 34, 0.15)',
                  boxShadow: isDark
                    ? '0 16px 36px -8px rgba(30, 33, 11, 0.35)'
                    : '0 4px 20px -2px rgba(40, 44, 15, 0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '24px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 14px',
                      borderRadius: '9999px',
                      background: '#b8c742',
                      color: '#1a1c0d',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <Sparkles size={12} />
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3
                    className="heading h5 no-margin"
                    style={{
                      color: isDark ? '#ffffff' : '#171717',
                      fontWeight: 700,
                      marginBottom: '8px',
                    }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className="paragraph small"
                    style={{
                      color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#666666',
                      minHeight: '44px',
                      marginBottom: '24px',
                    }}
                  >
                    {plan.description}
                  </p>

                  {/* Price with smooth digit rolling */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '8px',
                      marginBottom: '28px',
                      paddingBottom: '24px',
                      borderBottom: isDark
                        ? '1px solid rgba(255, 255, 255, 0.12)'
                        : '1px solid rgba(94, 102, 34, 0.12)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span
                        style={{
                          fontSize: '28px',
                          fontWeight: 700,
                          color: isDark ? '#b8c742' : '#5e6622',
                          marginRight: '2px',
                        }}
                      >
                        $
                      </span>
                      <span
                        style={{
                          fontSize: '48px',
                          fontWeight: 800,
                          letterSpacing: '-0.03em',
                          color: isDark ? '#ffffff' : '#171717',
                          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                      >
                        {price}
                      </span>
                    </div>
                    <span
                      className="paragraph small no-margin"
                      style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#777777' }}
                    >
                      / user / month
                    </span>
                  </div>

                  {/* Features list */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
                    {plan.features.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '12px',
                          fontSize: '14px',
                          color: isDark ? 'rgba(255, 255, 255, 0.85)' : '#444444',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: isDark ? 'rgba(184, 199, 66, 0.2)' : 'rgba(94, 102, 34, 0.12)',
                            color: isDark ? '#b8c742' : '#5e6622',
                            flexShrink: 0,
                          }}
                        >
                          <Check size={12} strokeWidth={2.5} />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <a
                  href={plan.ctaLink}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '14px 24px',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    fontSize: '15px',
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                    background: isDark ? '#b8c742' : '#171717',
                    color: isDark ? '#181b0a' : '#ffffff',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {plan.ctaText} →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
