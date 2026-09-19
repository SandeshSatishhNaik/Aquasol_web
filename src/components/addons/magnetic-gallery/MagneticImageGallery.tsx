import React, { useState, useEffect } from 'react';
import type { AgriculturalSlide, MagneticGalleryProps } from './types';
import { AQUASOL_SLIDES } from './slidesData';
import { useMagneticTracking } from './useMagneticTracking';
import { GalleryCard } from './GalleryCard';
import { GalleryModal } from './GalleryModal';

export const MagneticImageGallery: React.FC<MagneticGalleryProps> = ({
  slides = AQUASOL_SLIDES,
  className = '',
}) => {
  const [selectedSlide, setSelectedSlide] = useState<AgriculturalSlide | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const {
    containerRef,
    setCardRef,
    handlePointerMove,
    handlePointerLeave,
    focusCardByIndex,
    activeCardIndex,
    isReducedMotion,
  } = useMagneticTracking({
    cardCount: slides.length,
    gap: 16,
    maxCardWidth: 350,
    minCardWidth: 85,
    restingCardWidth: 130,
    influenceRadius: 280,
    lerpFactor: 0.15,
  });

  const handleCardClick = (slide: AgriculturalSlide) => {
    setSelectedSlide(slide);
  };

  const handleCloseModal = () => {
    setSelectedSlide(null);
  };

  return (
    <div
      className={`magnetic-gallery-root ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1260px',
        margin: '0 auto',
      }}
    >
      {/* Machined Hardware Enclosure (Double-Bezel Chassis) */}
      <div
        className="magnetic-chassis-shell"
        style={{
          position: 'relative',
          borderRadius: '38px',
          padding: isMobile ? '16px 10px 18px 10px' : '22px 18px 18px 18px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.88) 0%, rgba(248, 250, 242, 0.74) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(137, 153, 33, 0.24)',
          boxShadow: '0 30px 70px -15px rgba(29, 31, 20, 0.08), inset 0 1.5px 2px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Specular Rim Light Highlight */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: '36px',
            right: '36px',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.95) 20%, rgba(137, 153, 33, 0.6) 50%, rgba(255, 255, 255, 0.95) 80%, transparent 100%)',
            borderRadius: '999px',
            zIndex: 2,
          }}
        />

        {/* Interactive Module Navigator Dock (Top Segmented Quick-Selector) */}
        <div
          className="magnetic-module-dock"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '20px',
            padding: '2px 6px',
          }}
        >
          {slides.map((s, sIdx) => {
            const isActive = activeCardIndex === sIdx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  focusCardByIndex(sIdx);
                  if (isMobile) {
                    setSelectedSlide(s);
                  }
                }}
                onMouseEnter={() => focusCardByIndex(sIdx)}
                aria-label={`Focus vector ${s.index}: ${s.title}`}
                className={`magnetic-dock-tab ${isActive ? 'active' : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  backgroundColor: isActive ? '#1c2212' : 'rgba(255, 255, 255, 0.82)',
                  color: isActive ? '#fafaf0' : '#49521d',
                  border: isActive
                    ? `1px solid ${s.accentColor || '#899921'}`
                    : '1px solid rgba(137, 153, 33, 0.22)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive
                    ? `0 6px 18px -4px ${s.accentGlow || 'rgba(0,0,0,0.25)'}`
                    : '0 1px 3px rgba(0, 0, 0, 0.04)',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: s.accentColor || '#899921',
                    boxShadow: isActive ? `0 0 8px ${s.accentColor || '#899921'}` : 'none',
                    transition: 'box-shadow 0.25s ease',
                  }}
                />
                <span style={{ opacity: isActive ? 0.75 : 0.55, fontSize: '11px', fontFamily: 'monospace' }}>
                  {s.index}
                </span>
                <span>{s.shortLabel || s.category}</span>
              </button>
            );
          })}
        </div>

        {/* Ambient Halo behind Cards Track */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '70px 20px 40px 20px',
            background:
              activeCardIndex !== null
                ? `radial-gradient(ellipse at center, ${slides[activeCardIndex]?.accentGlow || 'rgba(137, 153, 33, 0.2)'} 0%, transparent 68%)`
                : 'radial-gradient(ellipse at center, rgba(137, 153, 33, 0.12) 0%, transparent 68%)',
            pointerEvents: 'none',
            transition: 'background 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 0,
            opacity: 0.85,
          }}
        />

        {/* Main Magnetic Card Track */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="magnetic-gallery-track"
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: isMobile ? 'flex-start' : 'center',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: isMobile ? '8px 12px 18px 12px' : '4px 10px 14px 10px',
            boxSizing: 'border-box',
            overflowX: isMobile ? 'auto' : 'visible',
            scrollSnapType: isMobile ? 'x mandatory' : 'none',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: isMobile ? 'none' : 'auto',
          }}
        >
          {slides.map((slide, idx) => (
            <GalleryCard
              key={slide.id}
              slide={slide}
              index={idx}
              isReducedMotion={isReducedMotion || isMobile}
              onClick={handleCardClick}
              cardRef={setCardRef(idx)}
            />
          ))}
        </div>

        {/* Mobile Swipe Indicators (dots) */}
        {isMobile && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '12px',
            }}
          >
            {slides.map((s, idx) => (
              <span
                key={s.id}
                style={{
                  width: activeCardIndex === idx ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '999px',
                  backgroundColor:
                    activeCardIndex === idx ? (s.accentColor || '#899921') : 'rgba(137, 153, 33, 0.35)',
                  transition: 'all 0.25s ease',
                }}
              />
            ))}
          </div>
        )}

        {/* Sub-chassis Telemetry Footer Status Ticker */}
        <div
          className="magnetic-chassis-footer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '16px',
            padding: '14px 16px 4px 16px',
            borderTop: '1px solid rgba(137, 153, 33, 0.16)',
            fontSize: '11px',
            fontFamily: '"Inter Tight", sans-serif',
            color: '#555e2d',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#899921',
                boxShadow: '0 0 8px #899921',
                animation: 'telemetryPulse 2s ease-in-out infinite',
              }}
            />
            <span style={{ fontWeight: 800, color: '#252c13', letterSpacing: '0.04em' }}>
              LIVE TELEMETRY STREAM:
            </span>
            <span>Raspberry Pi 5 Master Gateway • 868MHz LoRa Mesh Nodes</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontWeight: 600,
              color: '#49521d',
              fontSize: '11px',
            }}
          >
            <span>⚡ RTK Centimeter GPS (±1.5cm)</span>
            <span>🤖 XGBoost v2.4 Autopilot</span>
            <span>🌐 8 Regional Languages</span>
          </div>
        </div>
      </div>

      {/* Focused Detail Modal */}
      <GalleryModal
        slide={selectedSlide}
        slides={slides}
        onClose={handleCloseModal}
        onSelectSlide={setSelectedSlide}
      />
    </div>
  );
};
