import { useEffect, useState } from 'react';

export interface AquaSolFallbackProps {
  onComplete?: () => void;
  onRelease?: () => void;
  reducedMotion?: boolean;
}

export function AquaSolFallback({
  onComplete,
  onRelease,
  reducedMotion = false,
}: AquaSolFallbackProps) {
  const [isReleasing, setIsReleasing] = useState(false);

  useEffect(() => {
    // Shorter hold for reduced motion, slightly longer for general fallback
    const holdDuration = reducedMotion ? 600 : 1200;

    const releaseTimer = setTimeout(() => {
      setIsReleasing(true);
      onRelease?.();

      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, 400);

      return () => clearTimeout(completeTimer);
    }, holdDuration);

    return () => clearTimeout(releaseTimer);
  }, [reducedMotion, onComplete, onRelease]);

  return (
    <div
      className={`aquasol-fallback-root ${isReleasing ? 'is-releasing' : ''}`}
      role="status"
      aria-label="Loading AquaSol"
    >
      <style>{`
        .aquasol-fallback-root {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background-color: #F5F3E9;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 1;
          pointer-events: auto;
          transition: opacity 400ms cubic-bezier(0.16, 1, 0.3, 1);
          width: 100vw;
          height: 100vh;
          height: 100dvh;
        }

        .aquasol-fallback-root.is-releasing {
          opacity: 0;
          pointer-events: none;
        }

        .aquasol-fallback-card {
          max-width: 520px;
          width: 86vw;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .aquasol-fallback-logo {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 10px 24px rgba(29, 31, 20, 0.08));
        }
      `}</style>
      <div className="aquasol-fallback-card">
        <img
          src="/assets/aquasol-logo-full.png"
          alt="AquaSol - Smart Water. Healthy Tomorrow."
          className="aquasol-fallback-logo"
        />
      </div>
    </div>
  );
}
