import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createFluxParticles } from './particles/createFluxParticles';
import { startEmblemChoreography } from './animation/choreography';
import type { AquaSolLoaderProps, LoaderPhase, SceneContext } from './types';

export function AquaSolLoader({ onComplete, onRelease }: AquaSolLoaderProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<LoaderPhase>('init');
  const [showWordmark, setShowWordmark] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Dimensions: True Fullscreen Viewport
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Scene setup
    const scene = new THREE.Scene();

    // Perspective Camera at Z = 14
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);
    camera.lookAt(0, 0, 0);

    // WebGL Renderer with alpha enabled for seamless background blending
    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: false,
      alpha: true,
      stencil: false,
      depth: false,
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';

    container.appendChild(renderer.domElement);

    // Initialize 10,000 Particle Field
    const particleSystem = createFluxParticles(camera, dpr, width, height);
    scene.add(particleSystem.points);

    const ctx: SceneContext = {
      scene,
      camera,
      renderer,
      particleSystem,
    };

    // Resize Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      particleSystem.resize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Check inspection URL overrides
    const urlParams =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : null;
    const isHoldMode =
      urlParams?.has('hold') || urlParams?.get('station') === 'emblem';

    // Start Choreography
    const stopAnimation = startEmblemChoreography(ctx, {
      onPhaseChange: (nextPhase) => {
        setPhase(nextPhase);
        if (
          nextPhase === 'wordmark_reveal' ||
          nextPhase === 'emblem_settled' ||
          nextPhase === 'releasing' ||
          isHoldMode
        ) {
          setShowWordmark(true);
        }
        if (nextPhase === 'releasing') {
          onRelease?.();
        }
      },
      onComplete: () => {
        setIsDone(true);
        onComplete?.();
      },
    });

    if (isHoldMode) {
      setShowWordmark(true);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      stopAnimation();
      particleSystem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onComplete, onRelease]);

  if (isDone) {
    return null;
  }

  const isReleasing = phase === 'releasing';
  const urlParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;
  const isSettledMode =
    urlParams?.has('hold') || urlParams?.get('station') === 'emblem';

  const shouldShowTypography =
    showWordmark ||
    phase === 'wordmark_reveal' ||
    phase === 'emblem_settled' ||
    phase === 'releasing' ||
    isSettledMode;

  return (
    <div
      className={`aquasol-flux-loader ${isReleasing ? 'is-releasing' : ''}`}
      role="status"
      aria-label="AquaSol Loading Animation"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Spline+Sans+Mono:wght@500;600&display=swap');

        /* Organic Light Theme Stage - Matches AquaSol Website Exactly */
        .aquasol-flux-loader {
          position: fixed;
          inset: 0;
          z-index: 99999;
          /* Warm organic light cream matching #fafaf0 and #f5ebd0 */
          background: radial-gradient(120% 120% at 50% 40%, #FFFFFF 0%, #FAF8F2 60%, #F5EBD0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 1;
          pointer-events: auto;
          user-select: none;
          overflow: hidden;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          transition: opacity 550ms cubic-bezier(0.16, 1, 0.3, 1),
                      transform 550ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .aquasol-flux-loader.is-releasing {
          opacity: 0;
          transform: scale(1.015);
          pointer-events: none;
        }

        /* Subtle natural sunlit dew atmosphere - NO NEON */
        .aquasol-aurora-atmosphere {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            ellipse at 50% 36%,
            rgba(137, 153, 33, 0.08) 0%,
            rgba(1, 112, 200, 0.04) 45%,
            transparent 72%
          );
        }

        /* Master Centered Ident Stage */
        .aquasol-flux-stage {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 640px;
          pointer-events: none;
          z-index: 10;
        }

        /* Fullscreen 3D WebGL Canvas */
        .aquasol-gl-canvas-container {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          pointer-events: none;
          z-index: 2;
        }

        .aquasol-gl-canvas-container canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }

        /* Emblem Anchor: Reserves optical footprint of 3D particle emblem */
        .aquasol-emblem-anchor {
          width: 320px;
          height: 310px;
          flex-shrink: 0;
        }

        /* Independent Brand Typography: Placed with comfortable breathing room below emblem */
        .aquasol-typography-lockup {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          max-width: 520px;
          margin-top: 24px;
          pointer-events: none;
          z-index: 10;
        }

        .aquasol-wordmark-vector {
          width: 100%;
          max-width: 275px;
          height: auto;
          display: block;
          opacity: 0;
          transform: translateY(10px);
          /* Clean organic drop shadow - NO NEON GLOW */
          filter: drop-shadow(0 3px 12px rgba(29, 31, 20, 0.08));
          transition: opacity 440ms cubic-bezier(0.16, 1, 0.3, 1),
                      transform 440ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .aquasol-wordmark-vector.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Official Tagline: Styled to match website's dark brand black #1d1f14 & olive tone */
        .aquasol-tagline-text {
          font-family: 'Spline Sans Mono', monospace, -apple-system, sans-serif;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #1d1f14;
          white-space: nowrap;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 400ms cubic-bezier(0.16, 1, 0.3, 1),
                      transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .aquasol-tagline-text.visible {
          opacity: 0.88;
          transform: translateY(0);
        }

        /* Responsive Mobile Layout */
        @media (max-width: 640px) {
          .aquasol-emblem-anchor {
            width: 260px;
            height: 250px;
          }

          .aquasol-typography-lockup {
            margin-top: 16px;
            gap: 8px;
          }

          .aquasol-wordmark-vector {
            max-width: 220px;
          }

          .aquasol-tagline-text {
            font-size: 9.5px;
            letter-spacing: 0.18em;
          }
        }
      `}</style>

      {/* Subtle organic sunlit atmosphere */}
      <div className="aquasol-aurora-atmosphere" />

      {/* Fullscreen 3D WebGL Canvas: Particles roam freely across the entire loading page */}
      <div ref={canvasContainerRef} className="aquasol-gl-canvas-container" />

      {/* Master centered brand ident stage */}
      <div className="aquasol-flux-stage">
        {/* Emblem Anchor: Reserves optical center for settled particle emblem */}
        <div className="aquasol-emblem-anchor" />

        {/* Independent Brand Typography */}
        <div className="aquasol-typography-lockup">
          <img
            src="/assets/aquasol-wordmark-dark.png"
            alt="AquaSol"
            className={`aquasol-wordmark-vector ${shouldShowTypography ? 'visible' : ''}`}
          />
          <span
            className={`aquasol-tagline-text ${shouldShowTypography ? 'visible' : ''}`}
          >
            Intelligence in Every Drop
          </span>
        </div>
      </div>
    </div>
  );
}
export default AquaSolLoader;
