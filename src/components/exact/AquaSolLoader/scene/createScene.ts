import * as THREE from 'three';
import type { SceneContext } from '../types';
import { createFluxParticles } from '../particles/createFluxParticles';

export function createAquaSolScene(container: HTMLElement): SceneContext {
  // 1. Scene setup
  const scene = new THREE.Scene();

  // 2. Camera setup - FOV 45, distance 14 (exact Flux camera parameters)
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  const camera = new THREE.PerspectiveCamera(45, width / Math.max(1, height), 0.1, 100);
  camera.position.set(0, 0, 14);
  camera.lookAt(0, 0, 0);

  // 3. WebGL Renderer with sRGB & clamped DPR
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  container.appendChild(renderer.domElement);

  // 4. Flux GPU Particle Engine (10,000 particles)
  const particleSystem = createFluxParticles(camera, dpr, width, height);
  scene.add(particleSystem.points);

  // 5. Resize handler
  const resize = (w: number, h: number) => {
    if (w <= 0 || h <= 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    particleSystem.resize(w, h);
  };

  // 6. Cleanup and disposal function
  const dispose = () => {
    particleSystem.dispose();
    try {
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    } catch {
      // ignore
    }
  };

  return {
    scene,
    camera,
    renderer,
    particleSystem,
    resize,
    dispose,
  };
}
