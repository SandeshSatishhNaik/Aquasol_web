import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import type { EmblemGeometries } from '../scene/createEmblemGeometry';

export interface ParticleDataset {
  initials: Float32Array;
  targets: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  phases: Float32Array;
  spiralMeta: Float32Array; // [armIndex, radius, initialAngle]
  count: number;
}

export function sampleEmblemParticles(geometries: EmblemGeometries): ParticleDataset {
  const specs: Array<{
    geom: THREE.BufferGeometry;
    count: number;
    baseColor: [number, number, number];
    highlightColor: [number, number, number];
    zOffset: number;
  }> = [
    {
      geom: geometries.water,
      count: 2800,
      baseColor: [0.18, 0.68, 0.95], // Pure luminous water droplet
      highlightColor: [0.85, 0.96, 1.00], // Prismatic crystal highlight
      zOffset: 0.04,
    },
    {
      geom: geometries.leaf,
      count: 1700,
      baseColor: [0.28, 0.72, 0.38], // Fresh botanical dewdrop
      highlightColor: [0.88, 0.98, 0.92], // Silvery leaf sheen
      zOffset: 0.00,
    },
    {
      geom: geometries.ringLower,
      count: 450,
      baseColor: [0.35, 0.78, 0.55], // Optical water ribbon
      highlightColor: [0.92, 1.00, 0.95],
      zOffset: 0.08,
    },
    {
      geom: geometries.ringUpper,
      count: 250,
      baseColor: [0.35, 0.78, 0.55],
      highlightColor: [0.92, 1.00, 0.95],
      zOffset: 0.08,
    },
    {
      geom: geometries.sprout,
      count: 300,
      baseColor: [0.45, 0.85, 0.60],
      highlightColor: [1.00, 1.00, 1.00], // Pure diamond glint
      zOffset: 0.10,
    },
  ];

  const totalCount = specs.reduce((acc, s) => acc + s.count, 0);

  const initials = new Float32Array(totalCount * 3);
  const targets = new Float32Array(totalCount * 3);
  const colors = new Float32Array(totalCount * 3);
  const sizes = new Float32Array(totalCount);
  const phases = new Float32Array(totalCount);
  const spiralMeta = new Float32Array(totalCount * 3);

  let particleIdx = 0;
  const tempPos = new THREE.Vector3();
  const numArms = 4;

  for (const spec of specs) {
    const mesh = new THREE.Mesh(spec.geom);
    const sampler = new MeshSurfaceSampler(mesh).build();

    for (let i = 0; i < spec.count; i++) {
      sampler.sample(tempPos);

      const i3 = particleIdx * 3;

      // 1. Target coordinate on the 3D emblem surface
      targets[i3] = tempPos.x;
      targets[i3 + 1] = tempPos.y;
      targets[i3 + 2] = tempPos.z + spec.zOffset;

      // 2. Multi-arm logarithmic spiral vortex initialization
      const arm = particleIdx % numArms;
      const armAngle = (arm * 2.0 * Math.PI) / numArms;

      // Distance from center: distribution biased toward outer ring
      const rRatio = Math.pow(Math.random(), 0.65);
      const radius = 1.1 + 2.5 * rRatio; // 1.1 to 3.6 world units
      const spiralTwist = 1.9 * Math.log(radius / 1.1 + 1.0);
      const angleJitter = (Math.random() - 0.5) * 0.35;
      const angle = armAngle + spiralTwist + angleJitter;

      // Shallow 3D saucer bowl elevation
      const zElevation = -0.12 + 0.08 * radius + (Math.random() - 0.5) * 0.18;

      initials[i3] = radius * Math.cos(angle);
      initials[i3 + 1] = radius * Math.sin(angle);
      initials[i3 + 2] = zElevation;

      // Spiral metadata for GPU rotation: [arm, radius, angle]
      spiralMeta[i3] = arm;
      spiralMeta[i3 + 1] = radius;
      spiralMeta[i3 + 2] = angle;

      // 3. Component gradient color with subtle per-particle variety
      const tint = Math.random();
      colors[i3] = THREE.MathUtils.lerp(spec.baseColor[0], spec.highlightColor[0], tint);
      colors[i3 + 1] = THREE.MathUtils.lerp(spec.baseColor[1], spec.highlightColor[1], tint);
      colors[i3 + 2] = THREE.MathUtils.lerp(spec.baseColor[2], spec.highlightColor[2], tint);

      // 4. Point size variation (5px to 10px scaled by perspective)
      sizes[particleIdx] = 5.2 + Math.random() * 5.0;

      // 5. Phase stagger for organic fluid arrival
      phases[particleIdx] = Math.random();

      particleIdx++;
    }
  }

  return {
    initials,
    targets,
    colors,
    sizes,
    phases,
    spiralMeta,
    count: totalCount,
  };
}
