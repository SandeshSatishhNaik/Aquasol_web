/**
 * The one place GSAP plugins are registered. Import GSAP from here in components, never from
 * 'gsap' directly, so registration happens exactly once.
 *
 * Only components inside the lazy LandingBelow chunk may import this module. Importing it from
 * anything in the initial chunk (Hero, Navbar, Footer, App) would pull GSAP into first load.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// Registering useGSAP is GSAP's documented guard against duplicate-React-version issues.
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Media condition every motion effect runs under. Reduced motion gets the final state, no tween. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
