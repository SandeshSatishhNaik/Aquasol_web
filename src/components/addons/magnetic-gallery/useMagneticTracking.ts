import { useEffect, useRef, useCallback, useState } from 'react';

interface UseMagneticTrackingOptions {
  cardCount: number;
  gap?: number;
  maxCardWidth?: number;
  minCardWidth?: number;
  restingCardWidth?: number;
  influenceRadius?: number;
  lerpFactor?: number;
}

export function useMagneticTracking({
  cardCount,
  gap = 16,
  maxCardWidth = 360,
  minCardWidth = 95,
  restingCardWidth = 135,
  influenceRadius = 290,
  lerpFactor = 0.15,
}: UseMagneticTrackingOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const pointerXRef = useRef<number | null>(null);
  const isPointerInsideRef = useRef(false);
  const currentWidthsRef = useRef<number[]>(new Array(cardCount).fill(restingCardWidth));
  const targetWidthsRef = useRef<number[]>(new Array(cardCount).fill(restingCardWidth));
  const rafIdRef = useRef<number | null>(null);
  const isReducedMotionRef = useRef(false);

  const setCardRef = useCallback((index: number) => (el: HTMLElement | null) => {
    cardRefs.current[index] = el;
  }, []);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      isReducedMotionRef.current = mq.matches;
      const handler = (e: MediaQueryListEvent) => {
        isReducedMotionRef.current = e.matches;
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  // Calculate dynamic resting card width based on current container width
  const getDynamicResting = useCallback(
    (containerWidth: number) => {
      return Math.min(
        restingCardWidth,
        Math.max(minCardWidth, (containerWidth - (cardCount - 1) * gap) / (cardCount + 0.6))
      );
    },
    [cardCount, gap, minCardWidth, restingCardWidth]
  );

  // Apply initial resting widths immediately on mount & resize
  useEffect(() => {
    const applyResting = () => {
      if (typeof window === 'undefined' || window.innerWidth < 768) return;

      const container = containerRef.current;
      const containerWidth = container ? container.getBoundingClientRect().width : 1150;
      const resting = getDynamicResting(containerWidth);

      currentWidthsRef.current = new Array(cardCount).fill(resting);
      targetWidthsRef.current = new Array(cardCount).fill(resting);

      for (let i = 0; i < cardCount; i++) {
        const cardEl = cardRefs.current[i];
        if (cardEl) {
          cardEl.style.width = `${Math.round(resting)}px`;
        }
      }
    };

    applyResting();
    // Re-apply on next tick to ensure layout is settled
    const timeout = setTimeout(applyResting, 50);

    window.addEventListener('resize', applyResting);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', applyResting);
    };
  }, [cardCount, getDynamicResting]);

  const calculateTargetWidths = useCallback(
    (pointerX: number, containerWidth: number) => {
      if (cardCount <= 0) return;

      const dynamicResting = getDynamicResting(containerWidth);
      const dynamicMax = Math.min(maxCardWidth, containerWidth * 0.42);

      const targets = new Array(cardCount).fill(dynamicResting);
      const influences = new Array(cardCount).fill(0);
      let totalExtra = 0;

      // Calculate magnetic influence based on proximity to card center
      for (let i = 0; i < cardCount; i++) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        const containerRect = containerRef.current?.getBoundingClientRect();
        const cardRect = cardEl.getBoundingClientRect();
        if (!containerRect) continue;

        const cardCenterX = cardRect.left - containerRect.left + cardRect.width / 2;
        const dist = Math.abs(pointerX - cardCenterX);

        if (dist < influenceRadius) {
          const norm = dist / influenceRadius;
          const w = Math.pow(Math.max(0, 1 - norm * norm), 2);
          influences[i] = w;
          const expansion = (dynamicMax - dynamicResting) * w;
          targets[i] = dynamicResting + expansion;
          totalExtra += expansion;
        }
      }

      // Distribute compression across non-primary cards to maintain fixed container bounds
      if (totalExtra > 0) {
        const unexpandedIndices: number[] = [];
        for (let i = 0; i < cardCount; i++) {
          if (influences[i] < 0.2) {
            unexpandedIndices.push(i);
          }
        }

        if (unexpandedIndices.length > 0) {
          const deductionPerCard = totalExtra / unexpandedIndices.length;
          for (const idx of unexpandedIndices) {
            targets[idx] = Math.max(minCardWidth, targets[idx] - deductionPerCard);
          }
        }
      }

      // Track active hovered card index for UI sync
      let maxW = dynamicResting;
      let maxIdx: number | null = null;
      for (let i = 0; i < cardCount; i++) {
        if (targets[i] > maxW && targets[i] > dynamicResting * 1.1) {
          maxW = targets[i];
          maxIdx = i;
        }
      }
      setActiveCardIndex(maxIdx);

      targetWidthsRef.current = targets;
    },
    [cardCount, getDynamicResting, influenceRadius, maxCardWidth, minCardWidth]
  );

  const updateLoop = useCallback(() => {
    if (isReducedMotionRef.current) return;

    let stillMoving = false;
    const current = currentWidthsRef.current;
    const targets = targetWidthsRef.current;

    for (let i = 0; i < cardCount; i++) {
      const diff = targets[i] - current[i];
      if (Math.abs(diff) > 0.3) {
        current[i] += diff * lerpFactor;
        stillMoving = true;
      } else {
        current[i] = targets[i];
      }

      const cardEl = cardRefs.current[i];
      if (cardEl) {
        cardEl.style.width = `${Math.round(current[i] * 10) / 10}px`;
      }
    }

    if (stillMoving || isPointerInsideRef.current) {
      rafIdRef.current = requestAnimationFrame(updateLoop);
    } else {
      rafIdRef.current = null;
    }
  }, [cardCount, lerpFactor]);

  const startAnimationLoop = useCallback(() => {
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(updateLoop);
    }
  }, [updateLoop]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'touch' || isReducedMotionRef.current) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      pointerXRef.current = relativeX;
      isPointerInsideRef.current = true;

      calculateTargetWidths(relativeX, rect.width);
      startAnimationLoop();
    },
    [calculateTargetWidths, startAnimationLoop]
  );

  const handlePointerLeave = useCallback(() => {
    if (isReducedMotionRef.current) return;

    isPointerInsideRef.current = false;
    pointerXRef.current = null;
    setActiveCardIndex(null);

    const container = containerRef.current;
    const containerWidth = container ? container.getBoundingClientRect().width : 1150;
    const dynamicResting = getDynamicResting(containerWidth);

    targetWidthsRef.current = new Array(cardCount).fill(dynamicResting);
    startAnimationLoop();
  }, [cardCount, getDynamicResting, startAnimationLoop]);

  const focusCardByIndex = useCallback(
    (index: number | null) => {
      if (isReducedMotionRef.current) return;
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const dynamicResting = getDynamicResting(rect.width);

      if (index === null || index < 0 || index >= cardCount) {
        isPointerInsideRef.current = false;
        pointerXRef.current = null;
        setActiveCardIndex(null);
        targetWidthsRef.current = new Array(cardCount).fill(dynamicResting);
        startAnimationLoop();
        return;
      }

      const cardEl = cardRefs.current[index];
      if (cardEl) {
        const cardRect = cardEl.getBoundingClientRect();
        const cardCenterX = cardRect.left - rect.left + cardRect.width / 2;
        pointerXRef.current = cardCenterX;
        isPointerInsideRef.current = true;
        calculateTargetWidths(cardCenterX, rect.width);
        startAnimationLoop();
      }
    },
    [cardCount, calculateTargetWidths, getDynamicResting, startAnimationLoop]
  );

  // Attach native listeners to container for optimal performance and reliable leave detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || isReducedMotionRef.current) return;
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      pointerXRef.current = relativeX;
      isPointerInsideRef.current = true;

      calculateTargetWidths(relativeX, rect.width);
      startAnimationLoop();
    };

    const onPointerLeave = () => {
      if (isReducedMotionRef.current) return;
      isPointerInsideRef.current = false;
      pointerXRef.current = null;
      setActiveCardIndex(null);

      const rect = container.getBoundingClientRect();
      const dynamicResting = getDynamicResting(rect.width);

      targetWidthsRef.current = new Array(cardCount).fill(dynamicResting);
      startAnimationLoop();
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('pointercancel', onPointerLeave);

    return () => {
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('pointercancel', onPointerLeave);
    };
  }, [cardCount, calculateTargetWidths, getDynamicResting, startAnimationLoop]);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return {
    containerRef,
    setCardRef,
    handlePointerMove,
    handlePointerLeave,
    focusCardByIndex,
    activeCardIndex,
    isReducedMotion: isReducedMotionRef.current,
  };
}
