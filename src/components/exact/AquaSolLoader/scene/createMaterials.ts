import * as THREE from 'three';

export interface EmblemMaterials {
  waterMaterials: [THREE.MeshPhysicalMaterial, THREE.MeshStandardMaterial];
  leafMaterials: [THREE.MeshStandardMaterial, THREE.MeshStandardMaterial];
  ringLowerMaterials: [THREE.MeshStandardMaterial, THREE.MeshStandardMaterial];
  ringUpperMaterials: [THREE.MeshStandardMaterial, THREE.MeshStandardMaterial];
  sproutMaterials: [THREE.MeshStandardMaterial, THREE.MeshStandardMaterial];
  shadowMaterial: THREE.MeshBasicMaterial;
  all: THREE.Material[];
}

function createShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    // Soft warm ambient occlusion shadow on cream
    gradient.addColorStop(0, 'rgba(29, 31, 20, 0.22)');
    gradient.addColorStop(0.35, 'rgba(31, 152, 235, 0.08)');
    gradient.addColorStop(0.7, 'rgba(29, 31, 20, 0.03)');
    gradient.addColorStop(1, 'rgba(29, 31, 20, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createEmblemMaterials(): EmblemMaterials {
  // Pure Sculpted Liquid Crystal / Optical Water Glass (ZERO flat paint, ZERO color icon)
  const crystalCap = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#F4F9FF'),
    emissive: new THREE.Color('#BAE6FD'),
    emissiveIntensity: 0.22,
    roughness: 0.04,
    metalness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    reflectivity: 0.98,
    transparent: true,
    opacity: 0.96,
  });

  const crystalSide = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#E0F0FE'),
    emissive: new THREE.Color('#7DD3FC'),
    emissiveIntensity: 0.16,
    roughness: 0.06,
    metalness: 0.10,
    clearcoat: 0.95,
    clearcoatRoughness: 0.04,
    reflectivity: 0.98,
    transparent: true,
    opacity: 0.94,
  });

  // Contact Shadow: Very delicate, soft optical caustic shadow on cream
  const shadowTexture = createShadowTexture();
  const shadowMaterial = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: 0.20,
    depthWrite: false,
  });

  const all: THREE.Material[] = [crystalCap, crystalSide, shadowMaterial];

  return {
    waterMaterials: [crystalCap, crystalSide],
    leafMaterials: [crystalCap, crystalSide],
    ringLowerMaterials: [crystalCap, crystalSide],
    ringUpperMaterials: [crystalCap, crystalSide],
    sproutMaterials: [crystalCap, crystalSide],
    shadowMaterial,
    all,
  };
}

