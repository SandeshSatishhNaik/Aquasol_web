import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Hero } from '../components/exact/Hero';
import { scrollToId } from '../lib/scrollToId';

const loadBelow = () => import('./LandingBelow');
const LandingBelow = lazy(loadBelow);

/**
 * True once the hero has painted. Rendering all thirteen sections in the first pass made the
 * browser lay out a 16,000px page before showing a single word, which on a slow phone was the
 * bulk of the wait for first paint. The hero goes first; everything below it mounts right after.
 * First input also flips it, so a click that lands in that window is never dropped.
 */
function useAfterFirstPaint(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 1));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    let idleId: number | undefined;
    const raf = requestAnimationFrame(() => {
      void loadBelow(); // start the download alongside first paint; mounting waits for idle
      idleId = idle(() => setReady(true)) as number;
    });
    const now = () => setReady(true);
    window.addEventListener('pointerdown', now, { once: true, passive: true });
    window.addEventListener('keydown', now, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      if (idleId !== undefined) cancelIdle(idleId);
      window.removeEventListener('pointerdown', now);
      window.removeEventListener('keydown', now);
    };
  }, []);

  // A deep link such as /#tech points at a section that did not exist when the page loaded.
  useEffect(() => {
    if (!ready || !window.location.hash) return;
    scrollToId(decodeURIComponent(window.location.hash.slice(1)));
  }, [ready]);

  return ready;
}

// Holds the footer below the fold until the sections arrive, so it cannot flash into view.
const HOLD = <div aria-hidden="true" style={{ minHeight: '250svh' }} />;

export const LandingPage: React.FC = () => {
  const ready = useAfterFirstPaint();

  return (
    <>
      <Hero />
      {ready ? (
        <Suspense fallback={HOLD}>
          <LandingBelow />
        </Suspense>
      ) : (
        HOLD
      )}
    </>
  );
};
