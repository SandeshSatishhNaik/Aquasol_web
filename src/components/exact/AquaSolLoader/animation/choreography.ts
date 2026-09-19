import type { SceneContext, LoaderPhase } from '../types';

export interface ChoreographyCallbacks {
  onPhaseChange: (phase: LoaderPhase) => void;
  onComplete: () => void;
}

export function startEmblemChoreography(
  ctx: SceneContext,
  callbacks: ChoreographyCallbacks
): () => void {
  const { camera, renderer, scene, particleSystem } = ctx;
  let rafId: number | null = null;
  let startTime: number | null = null;
  let currentPhase: LoaderPhase = 'init';

  const updatePhase = (phase: LoaderPhase) => {
    if (currentPhase !== phase) {
      currentPhase = phase;
      callbacks.onPhaseChange(phase);
    }
  };

  const animate = (now: number) => {
    if (!startTime) startTime = now;
    const elapsed = (now - startTime) / 1000;

    // URL inspection parameter overrides
    const urlParams =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : null;

    const stationParam = urlParams?.get('station');
    const customP = urlParams?.has('p')
      ? parseFloat(urlParams.get('p')!)
      : null;
    const isHold = urlParams?.has('hold');

    // Freeze at Station 0: Free-roaming Physics Scatter
    if (
      stationParam === '0' ||
      stationParam === 'scatter' ||
      urlParams?.has('scatter')
    ) {
      updatePhase('scatter_drift');
      particleSystem.update(0.0, elapsed);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
      return;
    }

    // Freeze at specific flock morph progress
    if (customP !== null) {
      updatePhase(customP >= 1 ? 'emblem_settled' : 'flock_morph');
      particleSystem.update(customP, elapsed);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
      return;
    }

    // Freeze at Station 2: Settled Pure Particle Emblem
    if (isHold || stationParam === 'emblem' || stationParam === '2') {
      updatePhase('emblem_settled');
      particleSystem.update(1.0, elapsed);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
      return;
    }

    // ========================================================
    // ACT 1: FREE 3D FLUID PHYSICS SCATTER (0.0s - 1.30s)
    // Completely unconstrained particles roaming the entire screen.
    // Zero disk spin, zero clockwise rotation, zero box.
    // ========================================================
    if (elapsed < 1.30) {
      updatePhase('scatter_drift');
      particleSystem.update(0.0, elapsed);
    }
    // ========================================================
    // ACT 2: SLOW CINEMATIC MAGNETIC REUNION (1.30s - 4.30s)
    // Generous 3.0s duration: particles slowly curve and flock
    // inward from all directions, forming the logo piece by piece.
    // ========================================================
    else if (elapsed < 4.30) {
      updatePhase('flock_morph');
      const progress = (elapsed - 1.30) / 3.00;
      particleSystem.update(progress, elapsed);
    }
    // ========================================================
    // ACT 3: SETTLED PURE PARTICLE EMBLEM & TYPOGRAPHY (4.30s - 5.25s)
    // Particles locked with subtle living shimmer.
    // "AquaSol" + "Intelligence in Every Drop" revealed below.
    // ========================================================
    else if (elapsed < 5.25) {
      if (elapsed >= 4.65) {
        updatePhase('wordmark_reveal');
      } else {
        updatePhase('emblem_settled');
      }
      particleSystem.update(1.0, elapsed);
    }
    // ========================================================
    // ACT 4: GRACEFUL SITE HANDOFF & RELEASE (5.25s - 5.80s)
    // ========================================================
    else if (elapsed < 5.80) {
      updatePhase('releasing');
      particleSystem.update(1.0, elapsed);
    }
    // ========================================================
    // ACT 5: COMPLETE & UNMOUNT
    // ========================================================
    else {
      updatePhase('done');
      callbacks.onComplete();
      return;
    }

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  };

  rafId = requestAnimationFrame(animate);

  return () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  };
}
