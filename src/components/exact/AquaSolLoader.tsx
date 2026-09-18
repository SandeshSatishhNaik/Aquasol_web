import { useEffect, useRef, useState, useId } from 'react';
import * as THREE from 'three';

export interface AquaSolLoaderProps {
  logoSrc?: string;
  onComplete?: () => void;
  onRelease?: () => void;
  ready?: boolean;
  forceReplay?: boolean;
}

// Brand Design Tokens
const COLOR_MOSS = [0.486, 0.545, 0.243];       // #7C8B3E
const COLOR_MOSS_LIGHT = [0.576, 0.663, 0.298]; // #93A94C
const COLOR_LEAF = [0.561, 0.776, 0.243];       // #8FC63E
const COLOR_SKY = [0.180, 0.561, 0.820];        // #2E8FD1
const COLOR_SKY_LIGHT = [0.349, 0.706, 0.918];  // #59B4EA
const COLOR_SPARKLE = [0.90, 0.99, 0.88];       // Near-white-green sparkle
const COLOR_INK = [0.106, 0.114, 0.086];        // #1B1D16

function smootherstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

export function AquaSolLoader({
  logoSrc = '/assets/aquasol-emblem-hd.png',
  onComplete,
  onRelease,
  ready = false,
  forceReplay = false,
}: AquaSolLoaderProps) {
  const styleId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const pillTextRef = useRef<HTMLSpanElement | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const onReleaseRef = useRef(onRelease);
  onReleaseRef.current = onRelease;

  useEffect(() => {
    // 1. Accessibility & Lifecycle: Check sessionStorage in try/catch (safe for incognito)
    const STORAGE_KEY = 'aquasol-loader-played';
    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      alreadyPlayed = false;
    }

    // Check debug parameter from URL (e.g. ?station=1 or ?loader or ?replay)
    let debugStation: number | null = null;
    let urlForceReplay = false;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('station')) {
        debugStation = parseInt(params.get('station') || '0', 10);
      }
      if (params.has('replay') || params.has('loader')) {
        urlForceReplay = true;
      }
    }

    if (alreadyPlayed && !forceReplay && !urlForceReplay && debugStation === null) {
      onCompleteRef.current?.();
      return;
    }

    // 2. Accessibility: Detect prefers-reduced-motion: reduce
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions & Particle Count
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 2500 : 7000;

    // Particle Classification:
    // 55% green (moss/leaf), 35% sky blue, 10% sparkle
    const greenCount = Math.floor(count * 0.55);
    const blueCount = Math.floor(count * 0.35);
    const particleTypes = new Uint8Array(count); // 0 = green, 1 = blue, 2 = sparkle

    for (let i = 0; i < count; i++) {
      if (i < blueCount) {
        particleTypes[i] = 1; // Sky blue
      } else if (i < blueCount + greenCount) {
        particleTypes[i] = 0; // Green
      } else {
        particleTypes[i] = 2; // Sparkle
      }
    }

    // 4. Particle Buffers & Destination Arrays for the 4 Stations:
    // Station 0: Cloud / Orbit (tilted partial torus swoosh)
    // Station 1: Mark (flock into droplet + leaf)
    // Station 2: Wordmark (dissolve into text)
    // Station 3: Release (arc outward and fade)
    const station0Pos = new Float32Array(count * 3);
    const station1Pos = new Float32Array(count * 3);
    const station2Pos = new Float32Array(count * 3);
    const station3Pos = new Float32Array(count * 3);

    const station0Col = new Float32Array(count * 3);
    const station1Col = new Float32Array(count * 3);
    const station2Col = new Float32Array(count * 3);
    const station3Col = new Float32Array(count * 3);

    const staggerOffsets = new Float32Array(count);
    const curlAxes = new Float32Array(count * 3);
    const baseSizes = new Float32Array(count);

    // Populate Station 0 (Tilted Partial Torus Swoosh) & Base Attributes
    const torusTiltX = 28 * (Math.PI / 180);
    const torusTiltY = -24 * (Math.PI / 180);
    const torusTiltZ = 12 * (Math.PI / 180);

    const cosX = Math.cos(torusTiltX), sinX = Math.sin(torusTiltX);
    const cosY = Math.cos(torusTiltY), sinY = Math.sin(torusTiltY);
    const cosZ = Math.cos(torusTiltZ), sinZ = Math.sin(torusTiltZ);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const type = particleTypes[i];

      // Stagger offset for organic flocking
      staggerOffsets[i] = (Math.random() - 0.5) * 0.3; // +/- 0.15

      // Random curl vector for swooping transit arcs and fragment fake normal
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      curlAxes[idx] = Math.sin(phi) * Math.cos(theta);
      curlAxes[idx + 1] = Math.sin(phi) * Math.sin(theta);
      curlAxes[idx + 2] = Math.cos(phi);

      // Particle size
      if (type === 2) {
        baseSizes[i] = 2.0 + Math.random() * 1.2; // Sparkle particles are larger
      } else {
        baseSizes[i] = 0.95 + Math.random() * 0.45;
      }

      // Station 0 Geometry: Tilted partial torus swoosh
      // Theta covers an open arc (~320 degrees)
      const u = Math.random();
      const arcTheta = -0.2 * Math.PI + u * (1.75 * Math.PI);
      const majorR = 1.3 + (Math.random() - 0.5) * 0.35;
      const minorR = 0.28 * Math.sqrt(Math.random());
      const minorPhi = Math.random() * Math.PI * 2;

      // Base un-rotated torus coordinate
      const bx = (majorR + minorR * Math.cos(minorPhi)) * Math.cos(arcTheta);
      const by = (majorR + minorR * Math.cos(minorPhi)) * Math.sin(arcTheta);
      const bz = minorR * Math.sin(minorPhi);

      // Apply 3D tilt
      const x1 = bx;
      const y1 = by * cosX - bz * sinX;
      const z1 = by * sinX + bz * cosX;

      const x2 = x1 * cosY + z1 * sinY;
      const y2 = y1;
      const z2 = -x1 * sinY + z1 * cosY;

      const x3 = x2 * cosZ - y2 * sinZ;
      const y3 = x2 * sinZ + y2 * cosZ;
      const z3 = z2;

      station0Pos[idx] = x3;
      station0Pos[idx + 1] = y3;
      station0Pos[idx + 2] = z3;

      // Station 0 Colors (Initial Mix)
      if (type === 1) {
        // Sky Blue
        const c = Math.random() > 0.4 ? COLOR_SKY : COLOR_SKY_LIGHT;
        station0Col[idx] = c[0];
        station0Col[idx + 1] = c[1];
        station0Col[idx + 2] = c[2];
      } else if (type === 0) {
        // Green mix (moss/leaf)
        const r = Math.random();
        const c = r < 0.4 ? COLOR_MOSS : r < 0.75 ? COLOR_LEAF : COLOR_MOSS_LIGHT;
        station0Col[idx] = c[0];
        station0Col[idx + 1] = c[1];
        station0Col[idx + 2] = c[2];
      } else {
        // Sparkle
        station0Col[idx] = COLOR_SPARKLE[0];
        station0Col[idx + 1] = COLOR_SPARKLE[1];
        station0Col[idx + 2] = COLOR_SPARKLE[2];
      }
    }

    // 5. Build Station 1 (Logo Mark) and Station 2 (Wordmark) via Offscreen Canvases
    // We prepare parametric fallbacks first in case network/images take time
    function buildParametricMarkFallback() {
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const type = particleTypes[i];

        if (type === 1) {
          // Droplet (Left)
          const t = Math.random() * Math.PI * 2;
          const r = Math.sqrt(Math.random()) * 0.42;
          const px = -0.32 + Math.sin(t) * r * (1 - Math.cos(t)) * 1.1;
          const py = -0.05 - Math.cos(t) * r * 1.5;
          station1Pos[idx] = px;
          station1Pos[idx + 1] = py;
          station1Pos[idx + 2] = (Math.random() - 0.5) * 0.15;

          const c = Math.random() > 0.35 ? COLOR_SKY : COLOR_SKY_LIGHT;
          station1Col[idx] = c[0];
          station1Col[idx + 1] = c[1];
          station1Col[idx + 2] = c[2];
        } else {
          // Leaf (Right)
          const t = (Math.random() - 0.5) * Math.PI;
          const w = Math.cos(t) * 0.45 * Math.sqrt(Math.random());
          const leafX = 0.28 + Math.sin(t) * 0.55 * Math.cos(0.65) - w * Math.sin(0.65);
          const leafY = 0.05 + Math.sin(t) * 0.55 * Math.sin(0.65) + w * Math.cos(0.65);

          station1Pos[idx] = leafX;
          station1Pos[idx + 1] = leafY;
          station1Pos[idx + 2] = (Math.random() - 0.5) * 0.15;

          if (type === 2) {
            station1Col[idx] = COLOR_SPARKLE[0];
            station1Col[idx + 1] = COLOR_SPARKLE[1];
            station1Col[idx + 2] = COLOR_SPARKLE[2];
          } else {
            const r = Math.random();
            const c = r < 0.5 ? COLOR_LEAF : COLOR_MOSS;
            station1Col[idx] = c[0];
            station1Col[idx + 1] = c[1];
            station1Col[idx + 2] = c[2];
          }
        }
      }
    }

    buildParametricMarkFallback();

    // Asynchronously sample Logo PNG for Station 1
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = logoSrc;
    logoImg.onload = () => {
      try {
        const offCanvas = document.createElement('canvas');
        const size = 160;
        offCanvas.width = size;
        offCanvas.height = size;
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
        if (!offCtx) return;

        offCtx.drawImage(logoImg, 0, 0, size, size);
        const imgData = offCtx.getImageData(0, 0, size, size).data;

        const dropletCandidates: [number, number][] = [];
        const leafCandidates: [number, number][] = [];

        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const pIdx = (y * size + x) * 4;
            const r = imgData[pIdx];
            const g = imgData[pIdx + 1];
            const b = imgData[pIdx + 2];
            const a = imgData[pIdx + 3];

            if (a > 45) {
              const nx = (x - size / 2) / (size / 2) * 1.15;
              const ny = -(y - size / 2) / (size / 2) * 1.15;

              // Route blue-dominant pixels to droplet; green-dominant to leaf
              if (b > r && b > g * 0.95 && b > 50) {
                dropletCandidates.push([nx, ny]);
              } else if (g > b * 0.95 && g > 45) {
                leafCandidates.push([nx, ny]);
              } else if (b > g) {
                dropletCandidates.push([nx, ny]);
              } else {
                leafCandidates.push([nx, ny]);
              }
            }
          }
        }

        if (dropletCandidates.length > 50 && leafCandidates.length > 50) {
          for (let i = 0; i < count; i++) {
            const idx = i * 3;
            const type = particleTypes[i];

            if (type === 1) {
              // Route blue particles to droplet
              const pt = dropletCandidates[Math.floor(Math.random() * dropletCandidates.length)];
              station1Pos[idx] = pt[0] + (Math.random() - 0.5) * 0.025;
              station1Pos[idx + 1] = pt[1] + (Math.random() - 0.5) * 0.025;
              station1Pos[idx + 2] = (Math.random() - 0.5) * 0.12;

              const c = Math.random() > 0.4 ? COLOR_SKY : COLOR_SKY_LIGHT;
              station1Col[idx] = c[0];
              station1Col[idx + 1] = c[1];
              station1Col[idx + 2] = c[2];
            } else if (type === 0) {
              // Route green particles to leaf
              const pt = leafCandidates[Math.floor(Math.random() * leafCandidates.length)];
              station1Pos[idx] = pt[0] + (Math.random() - 0.5) * 0.025;
              station1Pos[idx + 1] = pt[1] + (Math.random() - 0.5) * 0.025;
              station1Pos[idx + 2] = (Math.random() - 0.5) * 0.12;

              const r = Math.random();
              const c = r < 0.5 ? COLOR_LEAF : COLOR_MOSS;
              station1Col[idx] = c[0];
              station1Col[idx + 1] = c[1];
              station1Col[idx + 2] = c[2];
            } else {
              // Sparkles distributed across outer perimeter of both
              const useDroplet = Math.random() < 0.35;
              const pool = useDroplet ? dropletCandidates : leafCandidates;
              const pt = pool[Math.floor(Math.random() * pool.length)];
              station1Pos[idx] = pt[0] + (Math.random() - 0.5) * 0.04;
              station1Pos[idx + 1] = pt[1] + (Math.random() - 0.5) * 0.04;
              station1Pos[idx + 2] = (Math.random() - 0.5) * 0.18;

              station1Col[idx] = COLOR_SPARKLE[0];
              station1Col[idx + 1] = COLOR_SPARKLE[1];
              station1Col[idx + 2] = COLOR_SPARKLE[2];
            }
          }
        }
      } catch {
        // Fallback already built
      }
    };

    // Sample Wordmark for Station 2
    async function sampleWordmark() {
      if (typeof document !== 'undefined' && document.fonts) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore
        }
      }

      const textCanvas = document.createElement('canvas');
      const tw = 700;
      const th = 200;
      textCanvas.width = tw;
      textCanvas.height = th;
      const tctx = textCanvas.getContext('2d', { willReadFrequently: true });
      if (!tctx) return;

      tctx.fillStyle = '#000000';
      tctx.font = '700 84px "General Sans", "Plus Jakarta Sans", "Inter Tight", sans-serif';
      tctx.textAlign = 'center';
      tctx.textBaseline = 'middle';
      tctx.fillText('AquaSol', tw / 2, th / 2);

      const tData = tctx.getImageData(0, 0, tw, th).data;
      const textPixels: [number, number, boolean][] = []; // [xNorm, yNorm, isLeftHalf]

      for (let y = 0; y < th; y++) {
        for (let x = 0; x < tw; x++) {
          const pIdx = (y * tw + x) * 4;
          if (tData[pIdx + 3] > 50) {
            // Keep 1:1 aspect ratio by dividing by tw / 2 for both axes
            const xNorm = ((x - tw / 2) / (tw / 2)) * 1.65;
            const yNorm = -((y - th / 2) / (tw / 2)) * 1.65;
            const isLeftHalf = x < tw / 2; // Left half ("Aqua") vs Right half ("Sol")
            textPixels.push([xNorm, yNorm, isLeftHalf]);
          }
        }
      }

      if (textPixels.length > 50) {
        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          const pt = textPixels[Math.floor(Math.random() * textPixels.length)];
          station2Pos[idx] = pt[0] + (Math.random() - 0.5) * 0.02;
          station2Pos[idx + 1] = pt[1] + (Math.random() - 0.5) * 0.02;
          station2Pos[idx + 2] = (Math.random() - 0.5) * 0.1;

          // Route left-half wordmark pixels to var(--ink) (#1B1D16), right-half to var(--moss) (#7C8B3E)
          if (pt[2]) {
            // "Aqua" -> Ink
            station2Col[idx] = COLOR_INK[0];
            station2Col[idx + 1] = COLOR_INK[1];
            station2Col[idx + 2] = COLOR_INK[2];
          } else {
            // "Sol" -> Moss Green
            station2Col[idx] = COLOR_MOSS[0];
            station2Col[idx + 1] = COLOR_MOSS[1];
            station2Col[idx + 2] = COLOR_MOSS[2];
          }
        }
      } else {
        // Parametric block text fallback if canvas text empty
        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          station2Pos[idx] = (Math.random() - 0.5) * 2.2;
          station2Pos[idx + 1] = (Math.random() - 0.5) * 0.6;
          station2Pos[idx + 2] = (Math.random() - 0.5) * 0.1;
          const isLeft = station2Pos[idx] < 0;
          const c = isLeft ? COLOR_INK : COLOR_MOSS;
          station2Col[idx] = c[0];
          station2Col[idx + 1] = c[1];
          station2Col[idx + 2] = c[2];
        }
      }

      // Station 3: Release (arc outward and fade)
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const x2 = station2Pos[idx];
        const y2 = station2Pos[idx + 1];

        const expansion = 2.8 + Math.random() * 2.2;
        station3Pos[idx] = x2 * expansion + curlAxes[idx] * 0.8;
        station3Pos[idx + 1] = y2 * expansion + curlAxes[idx + 1] * 0.8 + 0.3;
        station3Pos[idx + 2] = station2Pos[idx + 2] + curlAxes[idx + 2] * 2.0;

        // Faded soft light colors
        station3Col[idx] = station2Col[idx] * 0.8 + COLOR_MOSS_LIGHT[0] * 0.2;
        station3Col[idx + 1] = station2Col[idx + 1] * 0.8 + COLOR_MOSS_LIGHT[1] * 0.2;
        station3Col[idx + 2] = station2Col[idx + 2] * 0.8 + COLOR_MOSS_LIGHT[2] * 0.2;
      }
    }

    sampleWordmark();

    // 6. WebGL Scene & Camera Setup: Dynamically create canvas inside container
    const container = containerRef.current;
    if (!container) {
      onCompleteRef.current?.();
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.className = 'aquasol-loader-canvas';
    container.insertBefore(canvas, container.firstChild);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.error('[AquaSolLoader] WebGL context creation failed:', e);
      onCompleteRef.current?.();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 2.8);

    // 7. Particle BufferGeometry & Attributes
    const geometry = new THREE.BufferGeometry();
    const currentPositions = new Float32Array(count * 3);
    const currentColors = new Float32Array(count * 3);
    const currentSizes = new Float32Array(count);

    currentPositions.set(station0Pos);
    currentColors.set(station0Col);
    currentSizes.set(baseSizes);

    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(currentColors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(currentSizes, 1));
    geometry.setAttribute('aCurl', new THREE.BufferAttribute(curlAxes, 3));

    // 8. Custom ShaderMaterial with Additive Blending and Depth Management
    const vertexShader = `
      attribute vec3 aColor;
      attribute float aSize;
      attribute vec3 aCurl;

      uniform float uSize;
      uniform float uTime;

      varying vec3 vColor;
      varying vec3 vCurl;

      void main() {
        vColor = aColor;
        vCurl = aCurl;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize * aSize * 300.0 / -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      precision highp float;

      varying vec3 vColor;
      varying vec3 vCurl;
      uniform float uOpacity;

      void main() {
        // Procedural soft circle using gl_PointCoord and smoothstep
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        // Soft circular falloff
        float alpha = smoothstep(0.5, 0.08, dist);

        // Faux-directional light: dot product of fixed light vector and fake normal (curl vector)
        vec3 lightDir = normalize(vec3(0.5, 0.75, 1.0));
        float z = sqrt(max(0.0, 0.25 - dist * dist));
        vec3 sphereNormal = normalize(vec3(coord.x, -coord.y, z));
        vec3 surfaceNormal = normalize(mix(sphereNormal, vCurl, 0.35));

        float diff = max(0.18, dot(surfaceNormal, lightDir));
        float specular = pow(max(0.0, dot(surfaceNormal, lightDir)), 8.0) * 0.35;

        vec3 finalRgb = (vColor * diff + vec3(specular)) * alpha * uOpacity;
        gl_FragColor = vec4(finalRgb, alpha * uOpacity);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uSize: { value: isMobile ? 0.048 : 0.055 },
        uTime: { value: 0.0 },
        uOpacity: { value: 1.0 },
      },
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false, // Crucial to prevent black quad artifacts
      transparent: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Reduced Motion Handling: Render static Station 2, hold 600ms, then complete
    if (prefersReducedMotion) {
      currentPositions.set(station2Pos);
      currentColors.set(station2Col);
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.aColor.needsUpdate = true;
      renderer.render(scene, camera);

      if (pillTextRef.current) {
        pillTextRef.current.textContent = 'AquaSol';
      }

      const t = setTimeout(() => {
        try {
          sessionStorage.setItem(STORAGE_KEY, 'true');
        } catch {
          // ignore
        }
        onCompleteRef.current?.();
      }, 600);

      return () => {
        clearTimeout(t);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      };
    }

    // 9. Motion Solver (Single rAF)
    let animationFrameId: number;
    const startTime = performance.now();
    let hasTriggeredRelease = false;

    // Pill Station Texts
    const stationTexts = [
      'Gathering the drop.',
      'Rooting the leaf.',
      'AquaSol',
      'AquaSol',
    ];

    function handleResize() {
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener('resize', handleResize);

    const renderLoop = (time: number) => {
      // If debugStation is set via URL query (?station=0, 1, 2, 3), lock to that station
      if (debugStation !== null) {
        const destPos =
          debugStation === 0 ? station0Pos :
          debugStation === 1 ? station1Pos :
          debugStation === 2 ? station2Pos : station3Pos;

        const destCol =
          debugStation === 0 ? station0Col :
          debugStation === 1 ? station1Col :
          debugStation === 2 ? station2Col : station3Col;

        currentPositions.set(destPos);
        currentColors.set(destCol);
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.aColor.needsUpdate = true;
        material.uniforms.uTime.value = time * 0.001;
        renderer.render(scene, camera);

        if (pillRef.current) {
          pillRef.current.style.opacity = '1';
        }
        if (pillTextRef.current) {
          pillTextRef.current.textContent = stationTexts[Math.min(3, debugStation)];
        }
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }

      // Total duration clamped between 600ms and 3500ms based on ready prop
      const baseDuration = ready ? 1400 : 3300;
      const totalDuration = Math.max(600, Math.min(3500, baseDuration));

      const elapsed = time - startTime;
      const p = Math.min(1.0, elapsed / totalDuration);

      // Station routing: sp = p * 3, i = floor(sp), f = sp - i
      const sp = p * 3.0;
      const i = Math.min(2, Math.floor(sp));
      const f = sp - i;

      // Smootherstep interpolation: morphT = smootherstep((f - 0.2) / 0.6)
      const morphT = smootherstep((f - 0.2) / 0.6);

      // Update pill text with triangular falloff cross-fade near each station boundary
      if (pillRef.current && pillTextRef.current) {
        let pillOpacity = 1.0;
        if (f < 0.15) {
          pillOpacity = f / 0.15;
        } else if (f > 0.85) {
          pillOpacity = (1.0 - f) / 0.15;
        }

        pillRef.current.style.opacity = `${Math.max(0.0, Math.min(1.0, pillOpacity))}`;
        const currentText = stationTexts[i];
        if (pillTextRef.current.textContent !== currentText) {
          pillTextRef.current.textContent = currentText;
        }
      }

      // Station Destination Arrays
      const fromPos = i === 0 ? station0Pos : i === 1 ? station1Pos : station2Pos;
      const toPos = i === 0 ? station1Pos : i === 1 ? station2Pos : station3Pos;

      const fromCol = i === 0 ? station0Col : i === 1 ? station1Col : station2Col;
      const toCol = i === 0 ? station1Col : i === 1 ? station2Col : station3Col;

      // Station 3 Trigger: Release site content concurrently
      if (i === 2 && morphT > 0.15 && !hasTriggeredRelease) {
        hasTriggeredRelease = true;
        setIsFadingOut(true);
        onReleaseRef.current?.();
      }

      const swirlAmount = i === 2 ? 0.35 : 0.62;
      const swirlFactor = Math.sin(morphT * Math.PI) * swirlAmount;

      // Vectorized interpolation with flocking stagger and swooping arcs
      for (let k = 0; k < count; k++) {
        const idx = k * 3;

        // Particle-specific flocking progress with boundary clamp
        const pT = Math.max(
          0.0,
          Math.min(1.0, morphT + staggerOffsets[k] * (1.0 - Math.abs(2.0 * morphT - 1.0)))
        );

        // Position with curl sine swirl
        currentPositions[idx] =
          fromPos[idx] + (toPos[idx] - fromPos[idx]) * pT + curlAxes[idx] * swirlFactor;
        currentPositions[idx + 1] =
          fromPos[idx + 1] + (toPos[idx + 1] - fromPos[idx + 1]) * pT + curlAxes[idx + 1] * swirlFactor;
        currentPositions[idx + 2] =
          fromPos[idx + 2] + (toPos[idx + 2] - fromPos[idx + 2]) * pT + curlAxes[idx + 2] * swirlFactor;

        // Colors
        currentColors[idx] = fromCol[idx] + (toCol[idx] - fromCol[idx]) * pT;
        currentColors[idx + 1] = fromCol[idx + 1] + (toCol[idx + 1] - fromCol[idx + 1]) * pT;
        currentColors[idx + 2] = fromCol[idx + 2] + (toCol[idx + 2] - fromCol[idx + 2]) * pT;

        // Particle size decay on release
        if (i === 2) {
          currentSizes[k] = baseSizes[k] * Math.max(0.0, 1.0 - morphT * 0.85);
        } else {
          currentSizes[k] = baseSizes[k];
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.aColor.needsUpdate = true;
      geometry.attributes.aSize.needsUpdate = true;

      material.uniforms.uTime.value = time * 0.001;

      // Render
      renderer.render(scene, camera);

      // Check for completion
      if (p >= 1.0) {
        try {
          sessionStorage.setItem(STORAGE_KEY, 'true');
        } catch {
          // ignore
        }

        // Clean unmount after container fade-out
        setTimeout(() => {
          onCompleteRef.current?.();
        }, 350);
        return;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    // 10. Clean Disposal on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);

      scene.remove(points);
      geometry.dispose();
      material.dispose();

      try {
        const gl = renderer.getContext();
        renderer.dispose();
        const loseContext = gl?.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
        }
      } catch {
        // ignore
      }

      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [logoSrc, ready, forceReplay]);

  return (
    <>
      <style key={styleId}>{`
        :root {
          --ink: #1B1D16;
          --moss: #7C8B3E;
          --moss-light: #93A94C;
          --leaf: #8FC63E;
          --sky: #2E8FD1;
          --sky-light: #59B4EA;
          --cream: #F5F3E9;
          --paper: #FFFFFF;
        }

        .aquasol-loader-root {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          background-color: var(--cream, #F5F3E9);
          background-image: radial-gradient(circle at 50% 50%, rgba(147, 169, 76, 0.16) 0%, rgba(245, 243, 233, 0.92) 48%, #F5F3E9 82%);
          overflow: hidden;
          user-select: none;
          pointer-events: all;
          opacity: 1;
          transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .aquasol-loader-root.fade-out {
          opacity: 0;
          pointer-events: none;
        }

        .aquasol-loader-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        .aquasol-loader-pill {
          position: absolute;
          bottom: 32px;
          left: 36px;
          background: var(--ink, #1B1D16);
          color: var(--paper, #FFFFFF);
          border-radius: 999px;
          padding: 8px 20px;
          font-family: 'Inter Tight', 'Plus Jakarta Sans', 'General Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.01em;
          line-height: 1.35;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 18px rgba(27, 29, 22, 0.12), 0 1px 3px rgba(27, 29, 22, 0.08);
          pointer-events: none;
          z-index: 10000;
          min-width: 155px;
          text-align: center;
          will-change: opacity;
          transition: opacity 0.18s ease-out;
        }

        .aquasol-site-reveal {
          opacity: 0;
          transform: scale(0.98);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .aquasol-site-reveal.visible {
          opacity: 1;
          transform: scale(1);
        }

        @media (max-width: 767px) {
          .aquasol-loader-pill {
            bottom: 22px;
            left: 20px;
            font-size: 12px;
            padding: 7px 16px;
            min-width: 130px;
          }
        }
      `}</style>
      <div
        ref={containerRef}
        className={`aquasol-loader-root ${isFadingOut ? 'fade-out' : ''}`}
        aria-label="AquaSol is loading"
        role="status"
      >
        <div ref={pillRef} className="aquasol-loader-pill">
          <span ref={pillTextRef}>Gathering the drop.</span>
        </div>
      </div>
    </>
  );
}

export default AquaSolLoader;
