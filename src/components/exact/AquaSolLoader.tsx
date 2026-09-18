import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════
   AquaSolLoader — GPU-accelerated particle preloader (AquaSol brand)
   ═══════════════════════════════════════════════════════════════════════ */

// ─── Design Tokens ────────────────────────────────────────────────────
const TOKENS = {
  ink:       '#1B1D16',
  moss:      '#7C8B3E',
  mossLight: '#93A94C',
  leaf:      '#8FC63E',
  sky:       '#2E8FD1',
  skyLight:  '#59B4EA',
  cream:     '#F5F3E9',
  paper:     '#FFFFFF',
} as const;

const C_INK       = new THREE.Color(TOKENS.ink);
const C_MOSS      = new THREE.Color(TOKENS.moss);
const C_MOSS_LT   = new THREE.Color(TOKENS.mossLight);
const C_LEAF      = new THREE.Color(TOKENS.leaf);
const C_SKY       = new THREE.Color(TOKENS.sky);
const C_SKY_LT    = new THREE.Color(TOKENS.skyLight);
const C_SPARKLE   = new THREE.Color('#c8f090');    // near-white-green sparkle

// ─── Helpers ──────────────────────────────────────────────────────────
function smootherstep(x: number): number {
  const t = Math.max(0, Math.min(1, x));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number) { return a + (a === b ? 0 : (b - a) * t); }



function hash(i: number) {
  let h = i * 2654435761;
  h = ((h >> 16) ^ h) * 45679;
  return ((h >> 16) ^ h) & 0x7fffffff;
}

function hashFloat(i: number) { return (hash(i) / 0x7fffffff) * 2 - 1; }

// ─── Sample image alpha to coordinate list ────────────────────────────
function sampleImageToPoints(
  img: HTMLImageElement,
  maxPoints: number,
  canvasSize: number
): { positions: Float32Array; colors: Float32Array; count: number } {
  const cvs = document.createElement('canvas');
  cvs.width = canvasSize;
  cvs.height = canvasSize;
  const ctx = cvs.getContext('2d')!;

  // draw image centered, maintaining aspect ratio
  const scale = Math.min(canvasSize / img.width, canvasSize / img.height) * 0.82;
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (canvasSize - w) / 2, (canvasSize - h) / 2, w, h);

  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
  const { data } = imageData;

  // collect all opaque pixel coords + their color
  const candidates: { x: number; y: number; r: number; g: number; b: number }[] = [];
  for (let y = 0; y < canvasSize; y++) {
    for (let x = 0; x < canvasSize; x++) {
      const idx = (y * canvasSize + x) * 4;
      if (data[idx + 3] > 100) { // alpha threshold
        candidates.push({
          x: (x / canvasSize - 0.5) * 2,
          y: -(y / canvasSize - 0.5) * 2, // flip Y
          r: data[idx] / 255,
          g: data[idx + 1] / 255,
          b: data[idx + 2] / 255,
        });
      }
    }
  }

  // subsample
  const count = Math.min(maxPoints, candidates.length);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const step = candidates.length / count;
  for (let i = 0; i < count; i++) {
    const c = candidates[Math.floor(i * step)];
    positions[i * 3] = c.x;
    positions[i * 3 + 1] = c.y;
    positions[i * 3 + 2] = 0;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  return { positions, colors, count };
}

// ─── Sample text to coordinate list ───────────────────────────────────
function sampleTextToPoints(
  text: string,
  fontFamily: string,
  maxPoints: number,
  canvasWidth: number,
  canvasHeight: number
): { positions: Float32Array; xPositions: Float32Array; count: number } {
  const cvs = document.createElement('canvas');
  cvs.width = canvasWidth;
  cvs.height = canvasHeight;
  const ctx = cvs.getContext('2d')!;

  // find the right font size
  let fontSize = 120;
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  let metrics = ctx.measureText(text);
  while (metrics.width > canvasWidth * 0.85 && fontSize > 20) {
    fontSize -= 4;
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    metrics = ctx.measureText(text);
  }

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const { data } = imageData;

  const halfW = canvasWidth / 2;
  const halfH = canvasHeight / 2;
  const aspectScale = 1.25;

  const candidates: { x: number; y: number; nx: number }[] = [];
  for (let y = 0; y < canvasHeight; y += 2) {
    for (let x = 0; x < canvasWidth; x += 2) {
      const idx = (y * canvasWidth + x) * 4;
      if (data[idx] > 128) {
        candidates.push({
          x: ((x - halfW) / halfW) * aspectScale,
          y: -((y - halfH) / halfW) * aspectScale,
          nx: x / canvasWidth, // normalized x for two-tone split
        });
      }
    }
  }

  const count = Math.min(maxPoints, candidates.length);
  const positions = new Float32Array(count * 3);
  const xPositions = new Float32Array(count);
  const step = candidates.length / count;
  for (let i = 0; i < count; i++) {
    const c = candidates[Math.floor(i * step)];
    positions[i * 3] = c.x;
    positions[i * 3 + 1] = c.y;
    positions[i * 3 + 2] = 0;
    xPositions[i] = c.nx;
  }
  return { positions, xPositions, count };
}

// ─── Generate partial torus orbit ring ────────────────────────────────
function generateTorusArc(
  particleCount: number,
  radius: number,
  arcDegrees: number,
  tiltDeg: number
): Float32Array {
  const positions = new Float32Array(particleCount * 3);
  const arcRad = (arcDegrees * Math.PI) / 180;
  const tiltRad = (tiltDeg * Math.PI) / 180;
  const cosTilt = Math.cos(tiltRad);
  const sinTilt = Math.sin(tiltRad);
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * arcRad - arcRad * 0.15; // offset start
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    // apply tilt around X axis
    positions[i * 3] = x;
    positions[i * 3 + 1] = y * cosTilt;
    positions[i * 3 + 2] = y * sinTilt;
  }
  return positions;
}

// ─── Vertex Shader ────────────────────────────────────────────────────
const VERT = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  uniform float uSize;
  varying vec3 vColor;
  varying float vLighting;

  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // faux directional light — fixed light vector
    vec3 lightDir = normalize(vec3(0.6, 0.8, 0.5));
    // derive per-particle fake normal from position (curl-ish)
    vec3 fakeNormal = normalize(vec3(position.y, -position.x, position.z * 0.5));
    vLighting = 0.45 + 0.55 * max(dot(fakeNormal, lightDir), 0.0);

    // calibrated point size for refined stardust specks
    gl_PointSize = uSize * aSize * 22.0 / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// ─── Fragment Shader ──────────────────────────────────────────────────
const FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vLighting;

  void main() {
    // soft round particle
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;

    float alpha = 1.0 - smoothstep(0.28, 0.5, dist);
    vec3 col = vColor * vLighting;
    gl_FragColor = vec4(col, alpha * 0.88);
  }
`;

// ─── Injected CSS ─────────────────────────────────────────────────────
const LOADER_CSS = `
  .aquasol-loader-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: ${TOKENS.cream};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .aquasol-loader-overlay::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, ${TOKENS.mossLight}18 0%, transparent 70%);
    pointer-events: none;
  }
  .aquasol-loader-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .aquasol-loader-pill {
    position: absolute;
    bottom: 28px;
    left: 28px;
    height: 36px;
    min-width: 170px;
    padding: 0 20px;
    border-radius: 999px;
    background: ${TOKENS.ink};
    color: ${TOKENS.paper};
    font-family: 'Inter Tight', 'General Sans', 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.01em;
    white-space: nowrap;
    pointer-events: none;
    transition: opacity 0.3s ease;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
  .aquasol-loader-pill span {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 20px;
    transition: opacity 0.25s ease;
  }
  .aquasol-loader-fade-out {
    opacity: 0;
    transform: scale(0.98);
    transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .aquasol-site-reveal {
    opacity: 0;
    transform: scale(0.98);
    transition: opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;
  }
  .aquasol-site-reveal.visible {
    opacity: 1;
    transform: scale(1);
  }
`;

// ─── Props ────────────────────────────────────────────────────────────
interface AquaSolLoaderProps {
  logoSrc: string;
  onComplete?: () => void;
  ready?: boolean;
  forceReplay?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────
export function AquaSolLoader({
  logoSrc,
  onComplete,
  ready,
  forceReplay = false,
}: AquaSolLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const completedRef = useRef(false);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    sessionStorage.setItem('aquasol-loader-played', '1');

    // fade out overlay
    if (containerRef.current) {
      containerRef.current.classList.add('aquasol-loader-fade-out');
    }

    setTimeout(() => {
      onComplete?.();
    }, 550);
  }, [onComplete]);

  useEffect(() => {
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const forceFromUrl = searchParams ? (searchParams.has('loader') || searchParams.has('replay') || searchParams.has('station')) : false;

    // ── Session skip ────────────────────────────────────────────────
    if (!forceReplay && !forceFromUrl && sessionStorage.getItem('aquasol-loader-played')) {
      handleComplete();
      return;
    }

    // ── Reduced motion ──────────────────────────────────────────────
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── WebGL check ─────────────────────────────────────────────────
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      handleComplete();
      return;
    }

    // ── Inject CSS ──────────────────────────────────────────────────
    const styleEl = document.createElement('style');
    styleEl.textContent = LOADER_CSS;
    document.head.appendChild(styleEl);

    // ── Load logo ───────────────────────────────────────────────────
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = logoSrc;

    // ── Ready signal tracking ───────────────────────────────────────
    let readyTime = 0;
    const startTime = performance.now();

    const onWindowLoad = () => { readyTime = performance.now(); };
    if (ready !== undefined) {
      readyTime = ready ? performance.now() : 0;
    } else {
      if (document.readyState === 'complete') {
        readyTime = performance.now();
      } else {
        window.addEventListener('load', onWindowLoad);
      }
    }

    img.onload = () => {
      // Wait for fonts too
      document.fonts.ready.then(() => {
        initLoader(img);
      });
    };
    img.onerror = () => {
      handleComplete();
    };

    function initLoader(logoImg: HTMLImageElement) {
      if (!canvasRef.current) return;

      const isMobile = window.innerWidth < 768;
      const PARTICLE_COUNT = isMobile ? 2500 : 7000;
      const TORUS_COUNT = Math.floor(PARTICLE_COUNT * 0.04); // ~4% for orbit ring
      const MAIN_COUNT = PARTICLE_COUNT - TORUS_COUNT;

      // ── Sample targets ──────────────────────────────────────────
      const sampleSize = isMobile ? 256 : 512;
      const markSample = sampleImageToPoints(logoImg, MAIN_COUNT, sampleSize);

      const fontStack = getComputedStyle(document.body).fontFamily ||
        "'Inter Tight', 'General Sans', 'Plus Jakarta Sans', sans-serif";
      const wordSample = sampleTextToPoints(
        'AquaSol', fontStack, MAIN_COUNT,
        isMobile ? 400 : 800, isMobile ? 200 : 300
      );

      const torusPositions = generateTorusArc(
        TORUS_COUNT, 0.65, 270, 18
      );

      // ── Reduced motion: static frame ────────────────────────────
      if (prefersReduced) {
        // Show static mark for 600ms then complete
        setTimeout(() => { handleComplete(); }, 600);
        return;
      }

      // ── Three.js setup ──────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      canvasRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        60, window.innerWidth / window.innerHeight, 0.1, 100
      );
      camera.position.z = 2.8;

      // ── Build particle buffers ──────────────────────────────────
      const geometry = new THREE.BufferGeometry();
      geometryRef.current = geometry;

      const pos = new Float32Array(PARTICLE_COUNT * 3);
      const col = new Float32Array(PARTICLE_COUNT * 3);
      const sizes = new Float32Array(PARTICLE_COUNT);
      const baseSizes = new Float32Array(PARTICLE_COUNT);

      // per-particle persistent data
      const cloudPos = new Float32Array(PARTICLE_COUNT * 3);     // station 0 rest
      const markPos = new Float32Array(PARTICLE_COUNT * 3);      // station 1 target
      const wordPos = new Float32Array(PARTICLE_COUNT * 3);      // station 2 target
      const cloudColor = new Float32Array(PARTICLE_COUNT * 3);   // station 0 color
      const markColor = new Float32Array(PARTICLE_COUNT * 3);    // station 1 color
      const wordColor = new Float32Array(PARTICLE_COUNT * 3);    // station 2 color
      const stagger = new Float32Array(PARTICLE_COUNT);          // timing offset
      const curlVec = new Float32Array(PARTICLE_COUNT * 3);      // swirl direction
      const isTorusParticle = new Uint8Array(PARTICLE_COUNT);    // torus flag

      const tmpColor = new THREE.Color();
      const tmpA = new THREE.Color();
      const tmpB = new THREE.Color();

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const h = hash(i);
        const isTorus = i >= MAIN_COUNT;
        isTorusParticle[i] = isTorus ? 1 : 0;

        // stagger offset (±0.15)
        stagger[i] = hashFloat(i + 777) * 0.15;

        // curl vector (fixed per particle)
        const cx = hashFloat(i * 3 + 100);
        const cy = hashFloat(i * 3 + 200);
        const cz = hashFloat(i * 3 + 300);
        const cLen = Math.sqrt(cx * cx + cy * cy + cz * cz) || 1;
        curlVec[i * 3] = cx / cLen;
        curlVec[i * 3 + 1] = cy / cLen;
        curlVec[i * 3 + 2] = cz / cLen;

        // ── Cloud positions (scattered sphere) ────────────────────
        if (isTorus) {
          const ti = i - MAIN_COUNT;
          cloudPos[i * 3] = torusPositions[ti * 3];
          cloudPos[i * 3 + 1] = torusPositions[ti * 3 + 1];
          cloudPos[i * 3 + 2] = torusPositions[ti * 3 + 2];
        } else {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 0.8 + Math.random() * 0.7;
          cloudPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          cloudPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          cloudPos[i * 3 + 2] = r * Math.cos(phi) * 0.3;
        }

        // ── Mark positions (from logo sample) ─────────────────────
        const mi = i % markSample.count;
        markPos[i * 3] = markSample.positions[mi * 3] * 1.22;
        markPos[i * 3 + 1] = markSample.positions[mi * 3 + 1] * 1.22;
        markPos[i * 3 + 2] = (hashFloat(i + 500) * 0.03);

        // ── Word positions (from text sample) ─────────────────────
        const wi = i % wordSample.count;
        wordPos[i * 3] = wordSample.positions[wi * 3] * 1.1;
        wordPos[i * 3 + 1] = wordSample.positions[wi * 3 + 1] * 1.1;
        wordPos[i * 3 + 2] = (hashFloat(i + 600) * 0.02);

        // ── Particle type (color distribution) ────────────────────
        const pct = (h % 1000) / 1000;
        let baseSize: number;

        if (pct < 0.55) {
          // green family (moss/leaf)
          tmpColor.copy(Math.random() > 0.5 ? C_LEAF : C_MOSS_LT);
          baseSize = 0.8 + Math.random() * 0.5;
        } else if (pct < 0.90) {
          // blue family (sky)
          tmpColor.copy(Math.random() > 0.5 ? C_SKY : C_SKY_LT);
          baseSize = 0.8 + Math.random() * 0.5;
        } else {
          // sparkle
          tmpColor.copy(C_SPARKLE);
          baseSize = 1.3 + Math.random() * 0.8;
        }

        // cloud color = base color
        cloudColor[i * 3] = tmpColor.r;
        cloudColor[i * 3 + 1] = tmpColor.g;
        cloudColor[i * 3 + 2] = tmpColor.b;

        // ── Mark color: route blue to droplet, green to leaf ──────
        const sampleG = markSample.colors[mi * 3 + 1];
        const sampleB = markSample.colors[mi * 3 + 2];
        // blue-dominant pixels → sky color, green-dominant → leaf
        const isBlueRegion = sampleB > sampleG * 0.9 && sampleB > 0.3;

        if (isBlueRegion) {
          tmpA.copy(Math.random() > 0.4 ? C_SKY : C_SKY_LT);
        } else {
          tmpA.copy(Math.random() > 0.4 ? C_LEAF : C_MOSS);
        }
        markColor[i * 3] = tmpA.r;
        markColor[i * 3 + 1] = tmpA.g;
        markColor[i * 3 + 2] = tmpA.b;

        // ── Word color: "Aqua" → ink, "Sol" → moss ───────────────
        const xNorm = wordSample.xPositions[wi];
        if (xNorm < 0.52) {
          // left half = "Aqua" → ink
          tmpB.copy(C_INK);
        } else {
          // right half = "Sol" → moss
          tmpB.copy(C_MOSS);
        }
        wordColor[i * 3] = tmpB.r;
        wordColor[i * 3 + 1] = tmpB.g;
        wordColor[i * 3 + 2] = tmpB.b;

        // initial state = cloud
        pos[i * 3] = cloudPos[i * 3];
        pos[i * 3 + 1] = cloudPos[i * 3 + 1];
        pos[i * 3 + 2] = cloudPos[i * 3 + 2];

        col[i * 3] = cloudColor[i * 3];
        col[i * 3 + 1] = cloudColor[i * 3 + 1];
        col[i * 3 + 2] = cloudColor[i * 3 + 2];

        baseSizes[i] = baseSize;
        sizes[i] = baseSize;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geometry.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
      geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uSize: { value: isMobile ? 1.2 : 1.5 },
        },
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
        transparent: true,
      });
      materialRef.current = material;

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      // ── Animation loop ──────────────────────────────────────────
      const totalMin = 2200;
      const totalMax = 3600;
      let totalDuration = 2600; // narrative duration allowing all 4 stations to resolve

      if (ready !== undefined && readyTime > 0) {
        totalDuration = Math.max(totalMin, Math.min(totalMax, readyTime - startTime + 1000));
      }

      const debugStationStr = searchParams?.get('station');
      const debugStation = debugStationStr !== null && debugStationStr !== undefined ? parseInt(debugStationStr, 10) : null;

      const animStart = performance.now();
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const colAttr = geometry.attributes.aColor as THREE.BufferAttribute;
      const sizeAttr = geometry.attributes.aSize as THREE.BufferAttribute;

      function animate() {
        const now = performance.now();
        const elapsed = now - animStart;

        // update totalDuration if ready signal comes in
        if (readyTime === 0 && ready) {
          readyTime = now;
        }
        if (readyTime > 0 && totalDuration === 2600 && ready !== undefined) {
          totalDuration = Math.max(totalMin, Math.min(totalMax, readyTime - startTime + 1000));
        }

        let p: number;
        if (debugStation !== null) {
          if (debugStation === 0) p = 0.12;
          else if (debugStation === 1) p = 0.35;
          else if (debugStation === 2) p = 0.68;
          else p = 0.90;
        } else {
          p = Math.min(elapsed / totalDuration, 1.0);
        }

        // sp = p*3 gives us 3 transition intervals across 4 stations
        // Station 0: CLOUD       (sp: 0 → 1)
        // Station 1: MARK        (sp: 1 → 2)
        // Station 2: WORDMARK    (sp: 2 → 3)
        // Station 3: RELEASE     (implicit, handled by p > 0.95)
        const sp = p * 3;
        const stationIdx = Math.min(Math.floor(sp), 2);
        const f = sp - stationIdx;

        // ── Update pill text ────────────────────────────────────
        if (pillRef.current) {
          const spans = pillRef.current.querySelectorAll('span');
          spans.forEach((span, idx) => {
            const el = span as HTMLElement;
            if (idx === stationIdx) {
              // triangular cross-fade: ramp up then hold
              const stationProgress = f;
              el.style.opacity = stationProgress < 0.15
                ? String(stationProgress / 0.15)
                : stationProgress > 0.85
                  ? String((1 - stationProgress) / 0.15)
                  : '1';
            } else {
              el.style.opacity = '0';
            }
          });
        }

        // ── Per-particle morph ──────────────────────────────────
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const staggeredF = Math.max(0, Math.min(1, (f - 0.2 + stagger[i]) / 0.6));
          const morphT = smootherstep(staggeredF);

          // swirl amount
          const swirlAmt = Math.sin(morphT * Math.PI) * 0.15;
          const sx = curlVec[i * 3] * swirlAmt;
          const sy = curlVec[i * 3 + 1] * swirlAmt;
          const sz = curlVec[i * 3 + 2] * swirlAmt;

          let fromX: number, fromY: number, fromZ: number;
          let toX: number, toY: number, toZ: number;
          const i3 = i * 3;

          if (stationIdx === 0) {
            sizes[i] = baseSizes[i];
            // CLOUD → MARK
            fromX = cloudPos[i3];     fromY = cloudPos[i3 + 1];     fromZ = cloudPos[i3 + 2];
            toX = markPos[i3];        toY = markPos[i3 + 1];        toZ = markPos[i3 + 2];

            // idle wobble for cloud phase
            const wobble = (1 - morphT) * 0.02;
            fromX += Math.sin(elapsed * 0.001 + i) * wobble;
            fromY += Math.cos(elapsed * 0.0013 + i * 1.3) * wobble;

            // torus particles: orbit during cloud
            if (isTorusParticle[i]) {
              const orbitAngle = elapsed * 0.0008 + (i - MAIN_COUNT) * 0.08;
              const orbitR = 0.65;
              fromX = Math.cos(orbitAngle) * orbitR;
              fromY = Math.sin(orbitAngle) * orbitR * Math.cos(0.314);
              fromZ = Math.sin(orbitAngle) * orbitR * Math.sin(0.314);
            }

            // color lerp: cloud → mark
            col[i3] = lerp(cloudColor[i3], markColor[i3], morphT);
            col[i3 + 1] = lerp(cloudColor[i3 + 1], markColor[i3 + 1], morphT);
            col[i3 + 2] = lerp(cloudColor[i3 + 2], markColor[i3 + 2], morphT);
          } else if (stationIdx === 1) {
            sizes[i] = baseSizes[i];
            // MARK → WORDMARK
            fromX = markPos[i3];      fromY = markPos[i3 + 1];      fromZ = markPos[i3 + 2];
            toX = wordPos[i3];        toY = wordPos[i3 + 1];        toZ = wordPos[i3 + 2];

            col[i3] = lerp(markColor[i3], wordColor[i3], morphT);
            col[i3 + 1] = lerp(markColor[i3 + 1], wordColor[i3 + 1], morphT);
            col[i3 + 2] = lerp(markColor[i3 + 2], wordColor[i3 + 2], morphT);
          } else {
            // WORDMARK → RELEASE (radial explosion + fade)
            fromX = wordPos[i3];      fromY = wordPos[i3 + 1];      fromZ = wordPos[i3 + 2];
            // radial outward from center
            const dx = fromX || 0.001;
            const dy = fromY || 0.001;
            const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
            const explodeR = 2.5;
            toX = (dx / dist) * explodeR;
            toY = (dy / dist) * explodeR;
            toZ = fromZ + hashFloat(i + 900) * 0.5;

            col[i3] = lerp(wordColor[i3], wordColor[i3] * 0.5, morphT);
            col[i3 + 1] = lerp(wordColor[i3 + 1], wordColor[i3 + 1] * 0.5, morphT);
            col[i3 + 2] = lerp(wordColor[i3 + 2], wordColor[i3 + 2] * 0.5, morphT);

            // fade alpha via size reduction relative to baseSize
            sizes[i] = baseSizes[i] * Math.max(0, 1 - morphT * 0.85);
          }

          pos[i3] = lerp(fromX, toX, morphT) + sx;
          pos[i3 + 1] = lerp(fromY, toY, morphT) + sy;
          pos[i3 + 2] = lerp(fromZ, toZ, morphT) + sz;
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
        sizeAttr.needsUpdate = true;

        renderer.render(scene, camera);

        if (debugStation === null && p >= 1.0) {
          handleComplete();
          return;
        }

        rafRef.current = requestAnimationFrame(animate);
      }

      rafRef.current = requestAnimationFrame(animate);

      // ── Resize handler ──────────────────────────────────────────
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      // ── Cleanup stored in ref ───────────────────────────────────
      return () => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('load', onWindowLoad);
      };
    }

    // cleanup on unmount
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (geometryRef.current) geometryRef.current.dispose();
      if (materialRef.current) materialRef.current.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.domElement.remove();
      }
      window.removeEventListener('load', onWindowLoad);
    };
  }, [logoSrc, forceReplay, ready, handleComplete]);

  // ── Skip render if already completed (session skip) ─────────────
  const hasUrlOverride =
    typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).has('loader') ||
      new URLSearchParams(window.location.search).has('replay') ||
      new URLSearchParams(window.location.search).has('station'));

  if (
    !forceReplay &&
    !hasUrlOverride &&
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem('aquasol-loader-played')
  ) {
    return null;
  }

  return (
    <div ref={containerRef} className="aquasol-loader-overlay">
      <div ref={canvasRef} className="aquasol-loader-canvas" />
      <div ref={pillRef} className="aquasol-loader-pill">
        <span style={{ opacity: 1 }}>Gathering the drop.</span>
        <span style={{ opacity: 0 }}>Rooting the leaf.</span>
        <span style={{ opacity: 0 }}>AquaSol</span>
      </div>
    </div>
  );
}

export default AquaSolLoader;
