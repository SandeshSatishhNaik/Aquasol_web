import * as THREE from 'three';
import { sampleEmblemParticles } from './particleSampler';
import { particleVertexShader, particleFragmentShader } from './particleShaders';
import type { EmblemGeometries } from '../scene/createEmblemGeometry';

export interface ParticleSystemContext {
  mesh: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
  update: (time: number, progress: number) => void;
  dispose: () => void;
}

export function createParticleSystem(
  geometries: EmblemGeometries,
  dpr: number
): ParticleSystemContext {
  const dataset = sampleEmblemParticles(geometries);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(dataset.initials, 3));
  geometry.setAttribute('aInitial', new THREE.BufferAttribute(dataset.initials, 3));
  geometry.setAttribute('aTarget', new THREE.BufferAttribute(dataset.targets, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(dataset.colors, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(dataset.sizes, 1));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(dataset.phases, 1));
  geometry.setAttribute('aSpiralMeta', new THREE.BufferAttribute(dataset.spiralMeta, 3));

  const material = new THREE.ShaderMaterial({
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPixelRatio: { value: Math.min(dpr, 2.0) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  const mesh = new THREE.Points(geometry, material);
  mesh.frustumCulled = false; // Always render entire particle field

  const update = (time: number, progress: number) => {
    material.uniforms.uTime.value = time;
    material.uniforms.uProgress.value = progress;
  };

  const dispose = () => {
    try {
      geometry.dispose();
      material.dispose();
    } catch {
      // ignore
    }
  };

  return {
    mesh,
    geometry,
    material,
    update,
    dispose,
  };
}
