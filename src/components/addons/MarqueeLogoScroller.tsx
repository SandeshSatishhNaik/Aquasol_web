import React from 'react';
import { cn } from '../../lib/utils';

export interface PartnerLogo {
  name: string;
  src?: string;
  svgIcon?: React.ReactNode;
  gradient?: {
    from: string;
    via: string;
    to: string;
  };
}

interface MarqueeLogoScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  speed?: 'normal' | 'slow' | 'fast';
}

const DEFAULT_PARTNERS: PartnerLogo[] = [
  {
    name: 'Procure',
    src: 'https://cdn.21st.dev/assets/mirror/2b/2b87e7cd0c48dbf324666f347340afc1156fc86a466021e480ac9c288c618fd6.svg',
    gradient: { from: '#5e6622', via: '#737e2a', to: '#434918' },
  },
  {
    name: 'Clerk',
    src: 'https://cdn.21st.dev/assets/mirror/86/86e19afda708cead229b714d25de147ef0b920cfea807c5b2933b30d17a234db.svg',
    gradient: { from: '#8e9636', via: '#5e6622', to: '#3d4316' },
  },
  {
    name: 'Blender',
    src: 'https://cdn.21st.dev/assets/mirror/60/60a4c31343f8356ecbaaee324bd6253deacd8a6c27c3fe33f06ecc59ed4bd164.svg',
    gradient: { from: '#4d541c', via: '#737e2a', to: '#2b2f10' },
  },
  {
    name: 'Figma',
    src: 'https://cdn.21st.dev/assets/mirror/5b/5bcdea3417293412845b8298fe357fce3b192e8ff112d9b3fef315bc5cd127f6.svg',
    gradient: { from: '#5e6622', via: '#8e9636', to: '#4d541c' },
  },
  {
    name: 'Mocha',
    src: 'https://cdn.21st.dev/assets/mirror/d3/d3f7f94d90089fd318a2649807d5d57cf353affcf9d4cd2c5d373062822cf507.svg',
    gradient: { from: '#737e2a', via: '#5e6622', to: '#3d4316' },
  },
  {
    name: 'Layers',
    src: 'https://cdn.21st.dev/assets/mirror/59/59c903cc3c11f4fc63286675a5460bbaa5c80643acf85c3dd2394b27ab00eaf5.svg',
    gradient: { from: '#8e9636', via: '#5e6622', to: '#4d541c' },
  },
  {
    name: 'Google Cloud',
    src: 'https://cdn.21st.dev/assets/mirror/e3/e314a1d65f5035bdcebb84ed740ed0341cc5ba15ecf22fa2c1b10d39fbe18880.svg',
    gradient: { from: '#4d541c', via: '#737e2a', to: '#2b2f10' },
  },
  {
    name: 'Framer',
    src: 'https://cdn.21st.dev/assets/mirror/19/192d4671a23e40c7deb8fb16c48970e27f116a6ca5cc648eb6e3b366f5c8dd6d.svg',
    gradient: { from: '#5e6622', via: '#8e9636', to: '#434918' },
  },
];

export const MarqueeLogoScroller: React.FC<MarqueeLogoScrollerProps> = ({
  title = 'Trusted by fast-moving teams across the globe',
  subtitle = 'From ambitious startups to global enterprises navigating complex product roadmaps.',
  speed = 'normal',
  className,
  ...props
}) => {
  const durationMap = {
    slow: '60s',
    normal: '35s',
    fast: '18s',
  };
  const duration = durationMap[speed];

  return (
    <div className={cn('section no-top-padding', className)} {...props}>
      <style>{`
        @keyframes tb-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .tb-marquee-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>
      <div className="container">
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(94, 102, 34, 0.15)',
            borderRadius: '24px',
            padding: '36px 32px 32px 32px',
            boxShadow: '0 4px 20px -2px rgba(40, 44, 15, 0.05)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '16px',
              paddingBottom: '24px',
              borderBottom: '1px solid rgba(94, 102, 34, 0.12)',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: '#5e6622',
                  marginBottom: '4px',
                }}
              >
                Global Social Proof
              </p>
              <h3 className="heading h5 no-margin" style={{ color: '#171717', fontWeight: 600 }}>
                {title}
              </h3>
            </div>
            <p
              className="paragraph small no-margin"
              style={{ maxWidth: '420px', color: '#666666', lineHeight: 1.5 }}
            >
              {subtitle}
            </p>
          </div>

          {/* Marquee viewport with gradient mask */}
          <div
            style={{
              marginTop: '24px',
              overflow: 'hidden',
              maskImage:
                'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
          >
            <div
              className="tb-marquee-track"
              style={{
                display: 'flex',
                width: 'max-content',
                alignItems: 'center',
                gap: '20px',
                animation: `tb-marquee ${duration} linear infinite`,
              }}
            >
              {[...DEFAULT_PARTNERS, ...DEFAULT_PARTNERS].map((logo, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    height: '72px',
                    width: '160px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '16px',
                    background: 'rgba(250, 250, 240, 0.8)',
                    border: '1px solid rgba(94, 102, 34, 0.1)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#5e6622';
                    e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(94, 102, 34, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(94, 102, 34, 0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    style={{
                      maxHeight: '32px',
                      maxWidth: '110px',
                      objectFit: 'contain',
                      filter: 'grayscale(100%) opacity(75%)',
                      transition: 'filter 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'grayscale(0%) opacity(100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'grayscale(100%) opacity(75%)';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
