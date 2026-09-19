import React from 'react';
import { MagneticImageGallery } from './magnetic-gallery';

export const FeatureGridSpotlight: React.FC = () => {
  return (
    <section
      id="telemetry-gallery"
      className="section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '80px',
        paddingBottom: '96px',
        background: 'linear-gradient(180deg, rgba(250, 251, 245, 0.6) 0%, rgba(246, 248, 238, 0.95) 50%, rgba(250, 251, 245, 0.8) 100%)',
      }}
    >
      {/* Background Precision GIS Dot-Matrix Grid */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(137, 153, 33, 0.14) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 65% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 65% at 50% 50%, black 40%, transparent 100%)',
          pointerEvents: 'none',
          opacity: 0.75,
        }}
      />

      {/* Atmospheric Solar Radial Auras */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(137, 153, 33, 0.16) 0%, rgba(220, 244, 143, 0.08) 45%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '0',
          left: '10%',
          width: '500px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.09) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '50px',
          right: '8%',
          width: '500px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div className="wide-container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Perimeter Telemetry Coordinate HUD Ticks */}
        <div
          aria-hidden="true"
          className="section-hud-coordinates"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '0 8px',
            fontSize: '10.5px',
            fontFamily: 'monospace',
            letterSpacing: '0.08em',
            color: 'rgba(93, 102, 54, 0.7)',
            textTransform: 'uppercase',
          }}
        >
          <span>SYS // LAT 15.3173° N • LON 75.7139° E • ELEV 612M</span>
          <span>RF MESH // 868.1 MHz SX1278 GATEWAY SYNC</span>
        </div>

        {/* Section Typography Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto', padding: '0 16px' }}>
          {/* Eyebrow Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(137, 153, 33, 0.28)',
              boxShadow: '0 2px 8px rgba(29, 31, 20, 0.04)',
              marginBottom: '18px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 8px #10b981',
                animation: 'telemetryPulse 2s ease-in-out infinite',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#47501b',
              }}
            >
              AQUASOL MOBILE ECOSYSTEM • 6 CONNECTED VECTORS
            </span>
          </div>

          <h2
            className="heading h2 centered"
            style={{
              marginBottom: '16px',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#1a1f11',
              fontFamily: '"Bricolage Grotesque", "Inter Tight", sans-serif',
            }}
          >
            Everything you need to{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #1d2214 20%, #687719 70%, #899921 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              manage your farm.
            </span>
          </h2>

          <p
            className="paragraph large centered"
            style={{
              color: '#555e34',
              fontSize: '18px',
              lineHeight: 1.55,
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            See your farm, monitor crops, track drones, check soil conditions, and manage irrigation — all from the AquaSol mobile app.
          </p>
        </div>

        {/* Magnetic Image Gallery Component */}
        <MagneticImageGallery />
      </div>
    </section>
  );
};
