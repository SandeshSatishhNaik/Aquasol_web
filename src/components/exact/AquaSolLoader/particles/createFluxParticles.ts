import * as THREE from 'three';
import type { FluxParticleContext } from '../types';
import { fluxVertexShader, fluxFragmentShader } from './particleShaders';
import { getPrecomputedLogoParticles } from './logoParticleData';

function smoother(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function createFluxParticles(
  camera: THREE.PerspectiveCamera,
  dpr: number,
  initialWidth: number,
  initialHeight: number
): FluxParticleContext {
  const logoData = getPrecomputedLogoParticles();
  const count = logoData.count;

  // Geometry attributes
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const swirl = new Float32Array(count * 3);
  const stagger = new Float32Array(count);

  // Real Physics buffers: position, velocity, force seeds
  const physPos = new Float32Array(count * 3);
  const physVel = new Float32Array(count * 3);
  const seedX = new Float32Array(count);
  const seedY = new Float32Array(count);
  const seedZ = new Float32Array(count);
  const mass = new Float32Array(count);
  const scatterColors = new Float32Array(count * 3);

  const logoPositions = logoData.positions;
  const logoColors = logoData.colors;

  // Camera frustum dimensions
  let halfH = camera.position.z * Math.tan((camera.fov / 2) * (Math.PI / 180));
  let halfW = halfH * (initialWidth / Math.max(1, initialHeight));

  // Initialize particles across the entire viewport in true 3D space
  // ZERO disk, ZERO clockwise rotation, ZERO bounding box
  function initPhysicsDistribution() {
    for (let i = 0; i < count; i++) {
      sizes[i] = logoData.sizes[i];
      stagger[i] = logoData.stagger[i];
      swirl[i * 3] = logoData.swirl[i * 3];
      swirl[i * 3 + 1] = logoData.swirl[i * 3 + 1];
      swirl[i * 3 + 2] = logoData.swirl[i * 3 + 2];

      // Individual fluid frequency/phase seeds
      seedX[i] = Math.random() * Math.PI * 2;
      seedY[i] = Math.random() * Math.PI * 2;
      seedZ[i] = Math.random() * Math.PI * 2;
      mass[i] = 0.85 + Math.random() * 0.45;

      // Free 3D Cartesian distribution across the full loading screen
      // Distributed with organic variation throughout the whole visible volume
      const rx = (Math.random() - 0.5) * 2.0;
      const ry = (Math.random() - 0.5) * 2.0;
      const rz = (Math.random() - 0.5) * 2.0;

      physPos[i * 3] = rx * (halfW * 0.90);
      physPos[i * 3 + 1] = ry * (halfH * 0.86);
      physPos[i * 3 + 2] = rz * 2.6;

      // Initial independent 3D velocities (pointing in every direction)
      physVel[i * 3] = (Math.random() - 0.5) * 0.85;
      physVel[i * 3 + 1] = (Math.random() - 0.5) * 0.85;
      physVel[i * 3 + 2] = (Math.random() - 0.5) * 0.60;

      // Organic spring water & agricultural foliage palette matching website theme
      // Blues (pure water), Greens (AquaSol signature olive #899921 & crop leaves), and Aqua (morning dew)
      const hash = ((i * 9301 + 49297) % 233280) / 233280;
      if (hash < 0.42) {
        // Pure water azure & ocean blue (#0170c8, #0284c7)
        const h1 = hash / 0.42;
        scatterColors[i * 3] = 0.01 + h1 * 0.04;
        scatterColors[i * 3 + 1] = 0.42 + h1 * 0.24;
        scatterColors[i * 3 + 2] = 0.78 + h1 * 0.16;
      } else if (hash < 0.82) {
        // AquaSol signature olive (#899921) and fresh agricultural leaf green
        const h2 = (hash - 0.42) / 0.40;
        scatterColors[i * 3] = 0.20 + h2 * 0.34;
        scatterColors[i * 3 + 1] = 0.58 + h2 * 0.18;
        scatterColors[i * 3 + 2] = 0.10 + h2 * 0.14;
      } else {
        // Clear spring dew aqua / cyan (#00a6c0)
        const h3 = (hash - 0.82) / 0.18;
        scatterColors[i * 3] = 0.00 + h3 * 0.04;
        scatterColors[i * 3 + 1] = 0.62 + h3 * 0.14;
        scatterColors[i * 3 + 2] = 0.74 + h3 * 0.14;
      }
    }
  }
  initPhysicsDistribution();

  // Create geometry & attributes
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  // Create Shader Material with NormalBlending (Alpha Blending for Light Cream Canvas)
  const projectionScale =
    (initialHeight * dpr) / (2 * Math.tan((camera.fov / 2) * (Math.PI / 180)));

  const material = new THREE.ShaderMaterial({
    vertexShader: fluxVertexShader,
    fragmentShader: fluxFragmentShader,
    uniforms: {
      uSize: { value: initialWidth < 720 ? 0.060 : 0.048 },
      uScale: { value: projectionScale },
      uOpacity: { value: 1.0 },
    },
    transparent: true,
    blending: THREE.NormalBlending,
    depthTest: false,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);

  // Stagger window: spreads arrivals across 52% of the slow reunion duration
  const STAGGER_SPAN = 0.52;
  let lastTime = 0;

  // Frame update logic with real physics
  function update(morphProgress: number, time: number) {
    const dt = Math.min(0.033, lastTime > 0 ? time - lastTime : 0.016);
    lastTime = time;

    const pClamped = Math.max(0, Math.min(1, morphProgress));
    const morphT = smoother(pClamped);

    for (let q = 0; q < count; q++) {
      const q3 = q * 3;
      const m = mass[q];
      const sX = seedX[q];
      const sY = seedY[q];
      const sZ = seedZ[q];

      // ========================================================
      // 1. REAL 3D FLUID PHYSICS (COMPLETELY FREE, NO DISK SPIN)
      // Divergence-free 3D curl forces + independent Brownian drift
      // ========================================================
      let px = physPos[q3];
      let py = physPos[q3 + 1];
      let pz = physPos[q3 + 2];

      // Multi-octave 3D fluid curl forces in all 3 axes
      const fx =
        Math.sin(py * 0.65 + time * 0.95 + sX) * 1.1 +
        Math.cos(pz * 0.75 + time * 0.70 + sZ) * 0.65;
      const fy =
        Math.sin(pz * 0.65 + time * 0.85 + sY) * 1.0 +
        Math.cos(px * 0.70 + time * 0.65 + sX) * 0.60;
      const fz =
        Math.sin(px * 0.60 + time * 0.90 + sZ) * 0.95 +
        Math.cos(py * 0.65 + time * 0.75 + sY) * 0.55;

      // Soft viewport boundary guidance: repels particles smoothly from edge
      const boundX = halfW * 0.92;
      const boundY = halfH * 0.88;
      const boundZ = 2.8;

      let repX = 0;
      let repY = 0;
      let repZ = 0;
      if (Math.abs(px) > boundX) repX = -Math.sign(px) * Math.pow((Math.abs(px) - boundX) * 1.2, 1.5) * 3.5;
      if (Math.abs(py) > boundY) repY = -Math.sign(py) * Math.pow((Math.abs(py) - boundY) * 1.2, 1.5) * 3.5;
      if (Math.abs(pz) > boundZ) repZ = -Math.sign(pz) * Math.pow((Math.abs(pz) - boundZ) * 1.2, 1.5) * 3.0;

      // Physics integration (Euler with fluid damping)
      physVel[q3] += ((fx + repX) / m) * dt;
      physVel[q3 + 1] += ((fy + repY) / m) * dt;
      physVel[q3 + 2] += ((fz + repZ) / m) * dt;

      // Viscous drag
      physVel[q3] *= 0.945;
      physVel[q3 + 1] *= 0.945;
      physVel[q3 + 2] *= 0.945;

      px += physVel[q3] * dt * 2.8;
      py += physVel[q3 + 1] * dt * 2.8;
      pz += physVel[q3 + 2] * dt * 2.8;

      physPos[q3] = px;
      physPos[q3 + 1] = py;
      physPos[q3 + 2] = pz;

      // Target B position (AquaSol official emblem coordinates)
      // Scaled gracefully (0.90) and optically shifted (+1.05) so emblem & typography form a centered lockup
      const SCALE = 0.90;
      const OFFSET_Y = 1.05;
      const bx = logoPositions[q3] * SCALE;
      const by = logoPositions[q3 + 1] * SCALE + OFFSET_Y;
      const bz = logoPositions[q3 + 2] * SCALE;

      // ========================================================
      // 2. SLOW CINEMATIC MAGNETIC REUNION & STAGGER
      // Particles are unconstrained until their staggered magnetic pull
      // ========================================================
      const d = stagger[q];
      let localT = (morphT - d * STAGGER_SPAN) / (1.0 - STAGGER_SPAN);
      localT = localT < 0 ? 0 : localT > 1 ? 1 : localT;
      const pt = smoother(localT);

      // Curved flocking: individual 3D curl swirl envelope
      const swEnvelope = Math.sin(localT * Math.PI);
      const swAmt = swEnvelope * (halfH * 0.32) * (1.0 - pt * 0.7);

      // Depth gradually compresses from free 3D volume into planar emblem
      const zScale = 1.0 - pt;

      // Living organic micro-shimmer once settled
      const settleShimmer = pt >= 0.99 ? Math.sin(time * 1.3 + q * 1.4) * 0.007 : 0;

      positions[q3] = px * (1.0 - pt) + bx * pt + swirl[q3] * swAmt + settleShimmer;
      positions[q3 + 1] = py * (1.0 - pt) + by * pt + swirl[q3 + 1] * swAmt + settleShimmer;
      positions[q3 + 2] = pz * zScale + bz * pt + swirl[q3 + 2] * swAmt * zScale;

      // Color interpolation: celestial dust -> exact emblem RGBs
      const cAx = scatterColors[q3];
      const cAy = scatterColors[q3 + 1];
      const cAz = scatterColors[q3 + 2];
      const cBx = logoColors[q3];
      const cBy = logoColors[q3 + 1];
      const cBz = logoColors[q3 + 2];

      colors[q3] = cAx + (cBx - cAx) * pt;
      colors[q3 + 1] = cAy + (cBy - cAy) * pt;
      colors[q3 + 2] = cAz + (cBz - cAz) * pt;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.aColor.needsUpdate = true;
  }

  function resize(width: number, height: number) {
    halfH = camera.position.z * Math.tan((camera.fov / 2) * (Math.PI / 180));
    halfW = halfH * (width / Math.max(1, height));
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    material.uniforms.uScale.value =
      (height * pr) / (2 * Math.tan((camera.fov / 2) * (Math.PI / 180)));
    material.uniforms.uSize.value = width < 720 ? 0.064 : 0.052;
  }

  function dispose() {
    geometry.dispose();
    material.dispose();
  }

  return {
    points,
    geometry,
    material,
    count,
    positions,
    colors,
    sizes,
    swirl,
    stagger,
    scatterBase: physPos,
    logoPositions,
    logoColors,
    update,
    resize,
    dispose,
  };
}
