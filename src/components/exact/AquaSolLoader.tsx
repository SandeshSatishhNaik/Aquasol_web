import { useEffect, useRef, useState, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════════════════
   AquaSolLoader — Awwwards / Luxury Agency Cinematic Preloader
   Brand: AquaSol — "Grow projects like forests. Reliably."
   ═══════════════════════════════════════════════════════════════════════ */

interface AquaSolLoaderProps {
  logoSrc?: string;
  onComplete?: () => void;
  ready?: boolean;
  forceReplay?: boolean;
  theme?: string;
}

// ─── Design Tokens ────────────────────────────────────────────────────
const TOKENS = {
  ink: '#1B1D16',
  inkMuted: 'rgba(27, 29, 22, 0.65)',
  moss: '#7C8B3E',
  mossLight: '#93A94C',
  mossGlow: 'rgba(124, 139, 62, 0.18)',
  leaf: '#8FC63E',
  sky: '#2E8FD1',
  skyLight: '#59B4EA',
  skyGlow: 'rgba(46, 143, 209, 0.16)',
  cream: '#F6F4EB',
  creamWarm: '#FAF8F0',
  paper: '#FFFFFF',
} as const;

// ─── Stage Protocols ──────────────────────────────────────────────────
const STAGES = [
  { threshold: 0,  label: 'INIT PROTOCOL // SENSING HYDROLOGIC FIELD', code: 'PHASE 01' },
  { threshold: 30, label: 'CALIBRATING CANOPY BIOMETRIC TELEMETRY',     code: 'PHASE 02' },
  { threshold: 65, label: 'SYNCHRONIZING DISTRIBUTED WATER MATRIX',    code: 'PHASE 03' },
  { threshold: 92, label: 'AQUASOL ONLINE // SYSTEM READY',             code: 'COMPLETE' },
];

export function AquaSolLoader({
  logoSrc = '/assets/aquasol-emblem-hd.png',
  onComplete,
  ready: _ready,
  forceReplay = false,
}: AquaSolLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const completedRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // ── Completion Handler ──────────────────────────────────────────────
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    sessionStorage.setItem('aquasol-loader-played', '1');

    setIsExiting(true);

    setTimeout(() => {
      onComplete?.();
    }, 650);
  }, [onComplete]);

  // ── Check session & URL overrides ──────────────────────────────────
  useEffect(() => {
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const forceFromUrl = searchParams
      ? searchParams.has('loader') || searchParams.has('replay') || searchParams.has('station')
      : false;

    if (!forceReplay && !forceFromUrl && sessionStorage.getItem('aquasol-loader-played')) {
      handleComplete();
      return;
    }

    // ── Prefers Reduced Motion ───────────────────────────────────────
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(100);
      setStageIdx(3);
      const timer = setTimeout(() => handleComplete(), 400);
      return () => clearTimeout(timer);
    }

    // ── Debug station anchor freeze ──────────────────────────────────
    const stationParam = searchParams?.get('station');
    if (stationParam !== null && stationParam !== undefined) {
      const s = parseInt(stationParam, 10);
      if (s === 0) { setProgress(22); setStageIdx(0); }
      else if (s === 1) { setProgress(48); setStageIdx(1); }
      else if (s === 2) { setProgress(82); setStageIdx(2); }
      else { setProgress(100); setStageIdx(3); }
      return; // Freeze for visual inspection
    }

    // ── Smooth Numerical Telemetry Loop ─────────────────────────────
    let startTimestamp: number | null = null;
    const duration = 2400; // 2.4s cinematic pacing

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const t = Math.min(elapsed / duration, 1.0);

      // Custom exponential ease for natural, deliberate acceleration & smooth settle
      const easedProgress = Math.round(
        t < 0.5
          ? 4 * t * t * t * 100
          : (1 - Math.pow(-2 * t + 2, 3) / 2) * 100
      );

      setProgress(easedProgress);

      // Update protocol stage
      if (easedProgress >= 92) setStageIdx(3);
      else if (easedProgress >= 65) setStageIdx(2);
      else if (easedProgress >= 30) setStageIdx(1);
      else setStageIdx(0);

      if (t < 1.0) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setProgress(100);
        setStageIdx(3);
        setTimeout(() => {
          handleComplete();
        }, 320);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [forceReplay, handleComplete]);

  // ── Ambient Liquid Dew Motes Canvas ────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Generate liquid dew particles
    const count = window.innerWidth < 768 ? 32 : 65;
    const particles = Array.from({ length: count }, () => {
      const type = Math.random();
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1.5 + Math.random() * 3.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.6, // gentle upward morning dew buoyancy
        alpha: 0.18 + Math.random() * 0.45,
        color:
          type < 0.50
            ? 'rgba(124, 139, 62,' // moss
            : type < 0.85
            ? 'rgba(46, 143, 209,' // sky
            : 'rgba(215, 235, 120,', // golden sunlight
        phase: Math.random() * Math.PI * 2,
      };
    });

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.phase) * 0.25;
        p.y += p.vy;

        // Wrap around smoothly
        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.x > width + 20) p.x = -10;

        // Soft radial glowing dew orb
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.2);
        g.addColorStop(0, `${p.color} ${p.alpha})`);
        g.addColorStop(0.5, `${p.color} ${p.alpha * 0.4})`);
        g.addColorStop(1, `${p.color} 0)`);

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // ── Skip render if already completed ──────────────────────────────
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const forceFromUrl = searchParams
    ? searchParams.has('loader') || searchParams.has('replay') || searchParams.has('station')
    : false;

  if (!forceReplay && !forceFromUrl && typeof sessionStorage !== 'undefined' && sessionStorage.getItem('aquasol-loader-played')) {
    return null;
  }

  const currentStage = STAGES[stageIdx] || STAGES[0];

  return (
    <div
      ref={containerRef}
      className={`aquasol-luxury-loader ${isExiting ? 'exiting' : ''}`}
      aria-label="Loading AquaSol"
      role="status"
    >
      <style>{LOADER_STYLES}</style>

      {/* Ambient Canvas Dewfield */}
      <canvas ref={canvasRef} className="aquasol-dew-canvas" />

      {/* Atmospheric Caustic & Solar Gradients */}
      <div className="aquasol-ambient-glow solar-glow" />
      <div className="aquasol-ambient-glow aquatic-glow" />
      <div className="aquasol-ambient-glow center-glow" />

      {/* Central Floating Luxury Core */}
      <div className="aquasol-center-card">
        {/* Living Jewel Emblem with Concentric Liquid Ripples */}
        <div className="aquasol-emblem-stage">
          <div className="aquasol-ripple-ring ring-1" />
          <div className="aquasol-ripple-ring ring-2" />
          <div className="aquasol-ripple-ring ring-3" />

          {/* Double-Bezel Glass Lens */}
          <div className="aquasol-glass-lens">
            <div className="aquasol-lens-specular" />
            <img
              src={logoSrc}
              alt="AquaSol Emblem"
              className="aquasol-emblem-img"
              loading="eager"
            />
            {/* Specular Liquid Caustic Light Sweep */}
            <div className="aquasol-caustic-sweep" />
          </div>
        </div>

        {/* Kinetic Typographic Wordmark */}
        <div className="aquasol-brand-block">
          <div className="aquasol-wordmark-mask">
            <h1 className="aquasol-wordmark-text">
              <span className="part-aqua">Aqua</span>
              <span className="part-sol">Sol</span>
            </h1>
          </div>
          <div className="aquasol-tagline-mask">
            <p className="aquasol-tagline-text">Grow projects like forests. Reliably.</p>
          </div>
        </div>

        {/* Linear-Grade Precision Telemetry Capsule */}
        <div className="aquasol-hud-capsule">
          <div className="aquasol-hud-header">
            <div className="aquasol-hud-beacon">
              <span className="beacon-ping" />
              <span className="beacon-dot" />
              <span className="beacon-label">{currentStage.code}</span>
            </div>
            <div className="aquasol-hud-percentage">
              <span className="pct-num">{String(progress).padStart(3, '0')}</span>
              <span className="pct-symbol">%</span>
            </div>
          </div>

          {/* Precision Specular Progress Rail */}
          <div className="aquasol-progress-track">
            <div
              className="aquasol-progress-bar"
              style={{ width: `${progress}%` }}
            >
              <div className="aquasol-progress-head" />
            </div>
          </div>

          <div className="aquasol-hud-status">
            <span className="status-copy">{currentStage.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Embedded Luxury Stylesheet ───────────────────────────────────────
const LOADER_STYLES = `
  @keyframes floatPulse {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-8px) scale(1.015); }
  }

  @keyframes causticGlide {
    0% { transform: translateX(-140%) translateY(-60%) rotate(25deg); opacity: 0; }
    20% { opacity: 0.95; }
    80% { opacity: 0.95; }
    100% { transform: translateX(180%) translateY(80%) rotate(25deg); opacity: 0; }
  }

  @keyframes rippleExpand {
    0% { transform: scale(0.85); opacity: 0.55; }
    50% { opacity: 0.25; }
    100% { transform: scale(1.65); opacity: 0; }
  }

  @keyframes beaconPing {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(2.6); opacity: 0; }
  }

  @keyframes slideUpWordmark {
    from { transform: translateY(115%); opacity: 0; }
    to { transform: translateY(0%); opacity: 1; }
  }

  @keyframes fadeInTagline {
    from { opacity: 0; transform: translateY(8px); letter-spacing: 0.12em; }
    to { opacity: 0.68; transform: translateY(0px); letter-spacing: 0.22em; }
  }

  .aquasol-luxury-loader {
    position: fixed;
    inset: 0;
    z-index: 999999;
    background-color: ${TOKENS.cream};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    user-select: none;
    transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.65s cubic-bezier(0.16, 1, 0.3, 1),
                filter 0.65s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: 'Inter Tight', 'General Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .aquasol-luxury-loader.exiting {
    opacity: 0;
    transform: scale(1.025);
    filter: blur(8px);
    pointer-events: none;
  }

  /* Atmospheric Caustics */
  .aquasol-ambient-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    opacity: 0.85;
  }

  .solar-glow {
    top: -12%;
    right: -8%;
    width: 650px;
    height: 650px;
    background: radial-gradient(circle, rgba(143, 198, 62, 0.22) 0%, rgba(246, 244, 235, 0) 70%);
  }

  .aquatic-glow {
    bottom: -15%;
    left: -10%;
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(46, 143, 209, 0.20) 0%, rgba(246, 244, 235, 0) 70%);
  }

  .center-glow {
    top: 50%;
    left: 50%;
    width: 500px;
    height: 500px;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(124, 139, 62, 0.12) 0%, rgba(246, 244, 235, 0) 65%);
  }

  .aquasol-dew-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  /* Central Floating Card */
  .aquasol-center-card {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .aquasol-luxury-loader.exiting .aquasol-center-card {
    transform: translateY(-24px) scale(0.97);
    opacity: 0;
  }

  /* Living Jewel Emblem Stage */
  .aquasol-emblem-stage {
    position: relative;
    width: 170px;
    height: 170px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 28px;
    animation: floatPulse 3.8s ease-in-out infinite;
  }

  /* Concentric Water Acoustic Ripples */
  .aquasol-ripple-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1.5px solid rgba(124, 139, 62, 0.28);
    pointer-events: none;
  }

  .ring-1 {
    animation: rippleExpand 3.4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
    animation-delay: 0s;
  }
  .ring-2 {
    animation: rippleExpand 3.4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
    animation-delay: 1.1s;
  }
  .ring-3 {
    animation: rippleExpand 3.4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
    animation-delay: 2.2s;
  }

  /* Double-Bezel Glass Lens */
  .aquasol-glass-lens {
    position: relative;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.95), rgba(246, 244, 235, 0.70));
    border: 1px solid rgba(255, 255, 255, 0.85);
    box-shadow:
      0 20px 45px -12px rgba(124, 139, 62, 0.24),
      0 8px 20px -6px rgba(46, 143, 209, 0.16),
      inset 0 1px 2px rgba(255, 255, 255, 1),
      inset 0 -2px 6px rgba(124, 139, 62, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    backdrop-filter: blur(12px);
  }

  .aquasol-lens-specular {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.9),
                inset 0 -2px 4px rgba(124, 139, 62, 0.15);
    pointer-events: none;
  }

  .aquasol-emblem-img {
    width: 90px;
    height: 90px;
    object-fit: contain;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 6px 14px rgba(27, 29, 22, 0.12));
  }

  /* Specular Light Sweep Across Emblem */
  .aquasol-caustic-sweep {
    position: absolute;
    inset: -30px;
    background: linear-gradient(
      115deg,
      transparent 30%,
      rgba(255, 255, 255, 0.82) 48%,
      rgba(255, 255, 255, 0.95) 50%,
      rgba(255, 255, 255, 0.82) 52%,
      transparent 70%
    );
    z-index: 3;
    pointer-events: none;
    animation: causticGlide 2.8s cubic-bezier(0.16, 1, 0.3, 1) infinite;
  }

  /* Wordmark Typography */
  .aquasol-brand-block {
    margin-bottom: 32px;
  }

  .aquasol-wordmark-mask {
    overflow: hidden;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .aquasol-wordmark-text {
    margin: 0;
    font-size: 40px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.04em;
    animation: slideUpWordmark 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .part-aqua {
    color: ${TOKENS.ink};
  }

  .part-sol {
    color: ${TOKENS.moss};
    margin-left: 1px;
    text-shadow: 0 0 20px rgba(124, 139, 62, 0.28);
  }

  .aquasol-tagline-mask {
    margin-top: 6px;
    overflow: hidden;
  }

  .aquasol-tagline-text {
    margin: 0;
    font-size: 11.5px;
    font-weight: 600;
    color: ${TOKENS.inkMuted};
    text-transform: uppercase;
    letter-spacing: 0.22em;
    animation: fadeInTagline 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation-delay: 0.15s;
  }

  /* Linear-Grade Precision Telemetry Capsule */
  .aquasol-hud-capsule {
    width: 330px;
    background: rgba(255, 255, 255, 0.65);
    border: 1px solid rgba(124, 139, 62, 0.22);
    border-radius: 20px;
    padding: 14px 20px;
    box-shadow:
      0 12px 32px -8px rgba(27, 29, 22, 0.06),
      inset 0 1px 1.5px rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .aquasol-hud-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .aquasol-hud-beacon {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
  }

  .beacon-ping {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: ${TOKENS.leaf};
    position: absolute;
    left: 0;
    animation: beaconPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  .beacon-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: ${TOKENS.leaf};
    box-shadow: 0 0 8px ${TOKENS.leaf};
  }

  .beacon-label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: ${TOKENS.moss};
    text-transform: uppercase;
  }

  .aquasol-hud-percentage {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 13.5px;
    font-weight: 700;
    color: ${TOKENS.ink};
    letter-spacing: -0.02em;
  }

  .pct-symbol {
    font-size: 11px;
    margin-left: 1px;
    opacity: 0.65;
  }

  /* Progress Track & Animated Liquid Fill */
  .aquasol-progress-track {
    width: 100%;
    height: 4px;
    border-radius: 999px;
    background: rgba(27, 29, 22, 0.08);
    position: relative;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .aquasol-progress-bar {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, ${TOKENS.sky} 0%, ${TOKENS.moss} 55%, ${TOKENS.leaf} 100%);
    box-shadow: 0 0 10px rgba(143, 198, 62, 0.5);
    position: relative;
    transition: width 0.08s linear;
  }

  .aquasol-progress-head {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #FFFFFF;
    box-shadow: 0 0 6px #FFFFFF, 0 0 12px ${TOKENS.leaf};
  }

  .aquasol-hud-status {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .status-copy {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: ${TOKENS.inkMuted};
    text-transform: uppercase;
    transition: color 0.3s ease;
  }

  @media (max-width: 480px) {
    .aquasol-emblem-stage {
      width: 140px;
      height: 140px;
      margin-bottom: 22px;
    }
    .aquasol-glass-lens {
      width: 105px;
      height: 105px;
    }
    .aquasol-emblem-img {
      width: 72px;
      height: 72px;
    }
    .aquasol-wordmark-text {
      font-size: 32px;
    }
    .aquasol-hud-capsule {
      width: calc(100vw - 48px);
      max-width: 320px;
    }
  }
`;

export default AquaSolLoader;
