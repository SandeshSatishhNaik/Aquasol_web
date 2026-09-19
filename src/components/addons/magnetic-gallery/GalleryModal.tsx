import React, { useEffect, useCallback, useRef } from 'react';
import type { AgriculturalSlide } from './types';
import { X, ChevronLeft, ChevronRight, Activity, SunMedium, Globe2, ShieldCheck } from 'lucide-react';

interface GalleryModalProps {
  slide: AgriculturalSlide | null;
  slides: AgriculturalSlide[];
  onClose: () => void;
  onSelectSlide: (slide: AgriculturalSlide) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  slide,
  slides,
  onClose,
  onSelectSlide,
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const currentIndex = slide ? slides.findIndex((s) => s.id === slide.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelectSlide(slides[currentIndex - 1]);
    } else {
      onSelectSlide(slides[slides.length - 1]);
    }
  }, [currentIndex, onSelectSlide, slides]);

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      onSelectSlide(slides[currentIndex + 1]);
    } else {
      onSelectSlide(slides[0]);
    }
  }, [currentIndex, onSelectSlide, slides]);

  // Keyboard navigation: Escape to close, ArrowLeft/Right to paginate
  useEffect(() => {
    if (!slide) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Autofocus close button for accessibility
    closeButtonRef.current?.focus();

    // Prevent body scroll while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [slide, onClose, handlePrev, handleNext]);

  if (!slide) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-modal-title"
      className="magnetic-gallery-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        backgroundColor: 'rgba(12, 16, 8, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'agriModalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {/* Navigation Arrow Previous */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous capability"
        className="magnetic-modal-nav-btn prev"
        style={{
          position: 'absolute',
          left: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'rgba(250, 250, 240, 0.9)',
          border: '1px solid rgba(137, 153, 33, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#1d2214',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease',
        }}
      >
        <ChevronLeft size={22} strokeWidth={2.4} />
      </button>

      {/* Navigation Arrow Next */}
      <button
        type="button"
        onClick={handleNext}
        aria-label="Next capability"
        className="magnetic-modal-nav-btn next"
        style={{
          position: 'absolute',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'rgba(250, 250, 240, 0.9)',
          border: '1px solid rgba(137, 153, 33, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#1d2214',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease',
        }}
      >
        <ChevronRight size={22} strokeWidth={2.4} />
      </button>

      {/* Modal Main Content Shell */}
      <div
        ref={modalContentRef}
        className="magnetic-gallery-modal-card"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#fafaf4',
          borderRadius: '28px',
          border: '1px solid rgba(137, 153, 33, 0.3)',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.4) inset',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
          animation: 'agriModalScaleUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Specular Rim Light */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: '28px',
            right: '28px',
            height: '1.5px',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.95) 20%, rgba(137, 153, 33, 0.5) 50%, rgba(255, 255, 255, 0.95) 80%, transparent 100%)',
            borderRadius: '999px',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />

        {/* Left: Cinematic Visual Preview */}
        <div
          style={{
            position: 'relative',
            minHeight: '440px',
            backgroundColor: slide.bgColor || '#161b0f',
            borderTopLeftRadius: '28px',
            borderBottomLeftRadius: '28px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: slide.overlayTheme === 'app-screen' ? '24px 16px' : '0',
            boxSizing: 'border-box',
          }}
        >
          {/* Ambient Glow matching slide theme */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: '240px',
              height: '320px',
              borderRadius: '50%',
              background: slide.accentGlow || 'rgba(137, 153, 33, 0.3)',
              filter: 'blur(45px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          {slide.video ? (
            <video
              src={slide.video}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              style={{
                position: 'relative',
                width: 'auto',
                maxWidth: '100%',
                height: '100%',
                maxHeight: '460px',
                objectFit: 'contain',
                borderRadius: '20px',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.2)',
                filter: 'none',
                pointerEvents: 'none',
              }}
            />
          ) : (
            <img
              src={slide.image}
              alt={slide.alt}
              style={{
                position: slide.overlayTheme === 'app-screen' ? 'relative' : 'absolute',
                inset: slide.overlayTheme === 'app-screen' ? undefined : 0,
                width: slide.overlayTheme === 'app-screen' ? 'auto' : '100%',
                maxWidth: '100%',
                height: slide.overlayTheme === 'app-screen' ? '100%' : '100%',
                maxHeight: slide.overlayTheme === 'app-screen' ? '460px' : 'none',
                objectFit: slide.overlayTheme === 'app-screen' ? 'contain' : (slide.imageFit || 'cover'),
                objectPosition: slide.imagePosition || 'center',
                borderRadius: slide.overlayTheme === 'app-screen' ? '20px' : '0',
                boxShadow: slide.overlayTheme === 'app-screen' ? '0 16px 36px rgba(0, 0, 0, 0.2)' : 'none',
                filter: 'none',
              }}
            />
          )}
          {slide.overlayTheme !== 'app-screen' && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(16, 22, 10, 0.35) 0%, rgba(16, 22, 10, 0.1) 40%, rgba(16, 22, 10, 0.85) 100%)',
              }}
            />
          )}

          {/* Top category badge (for photography slides) */}
          {slide.overlayTheme !== 'app-screen' && (
            <div
              style={{
                position: 'absolute',
                top: '24px',
                left: '24px',
                zIndex: 2,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(250, 250, 240, 0.92)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(137, 153, 33, 0.4)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#283311',
              }}
            >
              <span style={{ color: '#687719' }}>Vector {slide.index}</span>
              <span>•</span>
              <span>{slide.category}</span>
            </div>
          )}
        </div>

        {/* Right: Technical Specification & Narrative */}
        <div
          style={{
            padding: '36px 32px 32px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '24px',
            backgroundColor: '#fafaf4',
          }}
        >
          {/* Header & Close Button */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#6e7a20',
                  }}
                >
                  AquaSol Architecture Spec
                </span>
                <h2
                  id="gallery-modal-title"
                  style={{
                    margin: '6px 0 8px 0',
                    fontSize: '26px',
                    fontWeight: 800,
                    color: '#1d1f14',
                    lineHeight: 1.2,
                    fontFamily: '"Bricolage Grotesque", "Inter Tight", sans-serif',
                  }}
                >
                  {slide.title}
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#555e2d',
                    lineHeight: 1.4,
                  }}
                >
                  {slide.tagline}
                </p>
              </div>

              {/* Close Button */}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close telemetry detail (Esc)"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(29, 31, 20, 0.08)',
                  border: '1px solid rgba(29, 31, 20, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#1d1f14',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
                className="magnetic-modal-close-btn"
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            {/* Comprehensive capability narrative */}
            <p
              style={{
                marginTop: '18px',
                fontSize: '14px',
                lineHeight: 1.65,
                color: '#444835',
                fontFamily: '"Inter Tight", sans-serif',
              }}
            >
              {slide.description}
            </p>
          </div>

          {/* Technical Telemetry Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: '#f1f3e4',
              border: '1px solid rgba(137, 153, 33, 0.22)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#687719', fontSize: '11px', fontWeight: 600 }}>
                <Activity size={12} />
                <span>Rate</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#1d1f14' }}>
                {slide.technicalSpecs.telemetryRate}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#687719', fontSize: '11px', fontWeight: 600 }}>
                <SunMedium size={12} />
                <span>Solar Eff.</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#1d1f14' }}>
                {slide.technicalSpecs.solarEfficiency}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#687719', fontSize: '11px', fontWeight: 600 }}>
                <Globe2 size={12} />
                <span>Coverage</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#1d1f14' }}>
                {slide.technicalSpecs.coverageArea}
              </div>
            </div>
          </div>

          {/* Tags & Action Row */}
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
              {slide.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#49521d',
                    backgroundColor: 'rgba(137, 153, 33, 0.12)',
                    padding: '3px 9px',
                    borderRadius: '6px',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5e6622', fontSize: '12px', fontWeight: 600 }}>
                <ShieldCheck size={16} />
                <span>Autonomous Fail-Safe Active</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  backgroundColor: '#1d1f14',
                  color: '#fafaf0',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
