import * as THREE from 'three';
import type { EmblemLights } from '../types';

export function createEmblemLights(scene: THREE.Scene): EmblemLights {
  // 1. Warm studio key light from upper right
  const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.8);
  keyLight.position.set(2.5, 3.5, 4.0);
  scene.add(keyLight);

  // 2. Cool soft fill light from lower left
  const fillLight = new THREE.DirectionalLight(0xE0F2FE, 1.4);
  fillLight.position.set(-3.0, -2.0, 3.0);
  scene.add(fillLight);

  // 3. Crisp cyan-accented rim light catching top/back bevels
  const rimLight = new THREE.DirectionalLight(0x7DD3FC, 2.8);
  rimLight.position.set(0.2, 4.0, -2.0);
  scene.add(rimLight);

  // 4. Soft warm ambient light matching stage tone
  const ambientLight = new THREE.AmbientLight(0xFDFBF7, 1.25);
  scene.add(ambientLight);

  // 5. Procedural sheen sweep point light (dormant until Phase 5)
  const sheenLight = new THREE.PointLight(0xFFFFFF, 0, 7.0, 1.5);
  sheenLight.position.set(-4.0, 3.0, 2.0);
  scene.add(sheenLight);

  return {
    keyLight,
    fillLight,
    rimLight,
    ambientLight,
    sheenLight,
  };
}
