// Type definitions for AquaSol Flux Particle Loader

export interface AquaSolLoaderProps {
  onComplete?: () => void;
  onRelease?: () => void;
  minDisplayTimeMs?: number;
}

export type LoaderPhase =
  | 'init'
  | 'scatter_drift'
  | 'flock_morph'
  | 'emblem_settled'
  | 'wordmark_reveal'
  | 'holding'
  | 'releasing'
  | 'done';

export interface FluxParticleContext {
  points: import('three').Points;
  geometry: import('three').BufferGeometry;
  material: import('three').ShaderMaterial;
  count: number;
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  swirl: Float32Array;
  stagger: Float32Array;
  scatterBase: Float32Array;
  logoPositions: Float32Array;
  logoColors: Float32Array;
  update: (progress: number, time: number) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}

export interface SceneContext {
  scene: import('three').Scene;
  camera: import('three').PerspectiveCamera;
  renderer: import('three').WebGLRenderer;
  particleSystem: FluxParticleContext;
}
