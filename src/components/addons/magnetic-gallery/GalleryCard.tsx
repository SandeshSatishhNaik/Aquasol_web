import React, { useState } from 'react';
import type { AgriculturalSlide } from './types';
import { Sparkles, ArrowUpRight } from 'lucide-react';

interface GalleryCardProps {
  slide: AgriculturalSlide;
  index: number;
  isReducedMotion?: boolean;
  onClick: (slide: AgriculturalSlide) => void;
  cardRef: (el: HTMLElement | null) => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({
  slide,
  index,
  isReducedMotion = false,
  onClick,
  cardRef,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(slide);
    }
  };

  return (
    <article
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={`Inspect ${slide.title} (${slide.category})`}
      onClick={() => onClick(slide)}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`magnetic-gallery-card group ${slide.overlayTheme === 'app-screen' ? 'is-app-screen' : ''}`}
      style={{
        position: 'relative',
        width: '135px',
        height: '470px',
        minWidth: isReducedMotion ? '180px' : '90px',
        flexShrink: 0,
        borderRadius: '26px',
        overflow: 'hidden',
        cursor: 'pointer',
        outline: 'none',
        backgroundColor: slide.bgColor || '#161d0f',
        boxShadow: isFocused
          ? `0 0 0 3px ${slide.accentColor || '#899921'}, 0 20px 40px -8px ${slide.accentGlow || 'rgba(29, 31, 20, 0.35)'}`
          : '0 10px 28px -6px rgba(29, 31, 20, 0.14), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
        transform: 'translateZ(0)',
        willChange: isReducedMotion ? 'auto' : 'width',
        containerType: 'inline-size',
        transition: isReducedMotion
          ? 'transform 0.25s ease, box-shadow 0.25s ease'
          : 'box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Top Specular Rim Reflection */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '14px',
          right: '14px',
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.85) 50%, transparent 100%)',
          borderRadius: '999px',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />

      {/* Floating Micro-Telemetry HUD Pill */}
      {slide.statusBadge && (
        <div
          className="card-telemetry-pill"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 8px',
            borderRadius: '999px',
            backgroundColor: 'rgba(16, 22, 10, 0.72)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: slide.accentColor || '#899921',
              boxShadow: `0 0 6px ${slide.accentColor || '#899921'}`,
              animation: 'telemetryPulse 2s ease-in-out infinite',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#fafaf0',
              fontFamily: '"Inter Tight", sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            {slide.statusBadge}
          </span>
        </div>
      )}

      {/* Background Photography / UI / Video Asset */}
      {slide.video ? (
        <video
          src={slide.video}
          autoPlay
          loop
          muted
          playsInline
          className="magnetic-card-img"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: slide.imageFit || 'cover',
            objectPosition: slide.imagePosition || 'top center',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: 'none',
            filter: 'none',
          }}
        />
      ) : (
        <img
          src={slide.image}
          alt={slide.alt}
          loading="lazy"
          className="magnetic-card-img"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: slide.imageFit || 'cover',
            objectPosition: slide.imagePosition || 'center',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: slide.overlayTheme === 'app-screen' ? 'none' : 'scale(1.02)',
            filter: 'none',
          }}
        />
      )}

      {/* Multi-tier Atmospheric Vignette / Text Protection */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            slide.overlayTheme === 'app-screen'
              ? 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 42%, rgba(14, 20, 10, 0.48) 72%, rgba(12, 18, 8, 0.95) 100%)'
              : 'linear-gradient(180deg, rgba(14, 20, 8, 0.45) 0%, rgba(14, 20, 8, 0.03) 35%, rgba(14, 20, 8, 0.4) 60%, rgba(14, 20, 8, 0.92) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle border perimeter */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '26px',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          pointerEvents: 'none',
        }}
      />

      {/* Card Content Shell */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          height: '100%',
          padding: '18px 16px',
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      >
        {/* Bottom Details */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            width: '100%',
          }}
        >
          {/* Key Metric (Reveals when card widens) */}
          <div
            className="card-expanded-metric"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 8px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              width: 'fit-content',
              fontSize: '11px',
              fontWeight: 700,
              color: '#dcf48f',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
            }}
          >
            <Sparkles size={11} color={slide.accentColor || '#cbe66c'} />
            <span>{slide.metric.value}</span>
            <span style={{ opacity: 0.85, textTransform: 'none', fontWeight: 500 }}>
              {slide.metric.label}
            </span>
          </div>

          {/* Slide Title */}
          <h3
            className="magnetic-card-title"
            style={{
              margin: '2px 0 0 0',
              fontSize: '16px',
              fontWeight: 800,
              color: '#fafaf0',
              lineHeight: 1.25,
              fontFamily: '"Bricolage Grotesque", "Inter Tight", sans-serif',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            }}
          >
            {slide.title}
          </h3>

          {/* Expanded Subtitle & Button-in-Button CTA */}
          <div className="card-expanded-body">
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '12px',
                fontWeight: 400,
                color: '#d4d8c0',
                lineHeight: 1.4,
                fontFamily: '"Inter Tight", sans-serif',
              }}
            >
              {slide.subtitle}
            </p>

            <div
              className="card-cta-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '10px',
                padding: '4px 6px 4px 12px',
                borderRadius: '999px',
                backgroundColor: 'rgba(250, 250, 240, 0.16)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#fafaf0',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.02em',
                transition: 'all 0.25s ease',
              }}
            >
              <span>Inspect telemetry</span>
              <span
                className="card-cta-icon-wrap"
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: slide.accentColor || '#899921',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#12190c',
                  transition: 'transform 0.25s ease',
                  flexShrink: 0,
                }}
              >
                <ArrowUpRight size={11} strokeWidth={2.8} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
