import * as THREE from 'three';

export interface EmblemGeometries {
  water: THREE.ExtrudeGeometry;
  leaf: THREE.ExtrudeGeometry;
  ringLower: THREE.ExtrudeGeometry;
  ringUpper: THREE.ExtrudeGeometry;
  sprout: THREE.ExtrudeGeometry;
  all: THREE.BufferGeometry[];
}

function createSmoothDropletShape(): THREE.Shape {
  const shape = new THREE.Shape();
  // Mathematically smooth liquid water droplet silhouette
  shape.moveTo(0, 1.50);
  shape.bezierCurveTo(0.20, 1.15, 0.65, 0.55, 0.88, -0.15);
  shape.bezierCurveTo(1.05, -0.65, 0.80, -1.25, 0.0, -1.35);
  shape.bezierCurveTo(-0.80, -1.25, -1.05, -0.65, -0.88, -0.15);
  shape.bezierCurveTo(-0.65, 0.55, -0.20, 1.15, 0, 1.50);
  return shape;
}

function createSmoothLeafShape(): THREE.Shape {
  const shape = new THREE.Shape();
  // Smooth organic leaf contour nestled beside the droplet
  shape.moveTo(0.18, 1.30);
  shape.bezierCurveTo(0.68, 1.00, 1.18, 0.40, 1.25, -0.30);
  shape.bezierCurveTo(1.30, -0.80, 0.95, -1.20, 0.45, -1.30);
  shape.bezierCurveTo(0.68, -0.90, 0.78, -0.40, 0.60, 0.15);
  shape.bezierCurveTo(0.48, 0.60, 0.32, 1.00, 0.18, 1.30);
  return shape;
}

function createSmoothRingShape(): THREE.Shape {
  const shape = new THREE.Shape();
  // Slender orbital elliptical sweep around the lower droplet
  shape.moveTo(-1.25, -0.15);
  shape.bezierCurveTo(-0.85, -0.75, 0.85, -0.75, 1.25, -0.15);
  shape.bezierCurveTo(1.28, -0.10, 1.25, -0.05, 1.20, -0.08);
  shape.bezierCurveTo(0.80, -0.65, -0.80, -0.65, -1.20, -0.08);
  shape.bezierCurveTo(-1.25, -0.05, -1.28, -0.10, -1.25, -0.15);
  return shape;
}

function createSmoothSproutShape(): THREE.Shape {
  const shape = new THREE.Shape();
  // Micro botanical satellite bud in upper right orbit
  shape.moveTo(1.10, 0.75);
  shape.bezierCurveTo(1.30, 0.65, 1.40, 0.35, 1.30, 0.15);
  shape.bezierCurveTo(1.10, 0.25, 1.00, 0.55, 1.10, 0.75);
  return shape;
}

export function createEmblemGeometries(): EmblemGeometries {
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.028,
    bevelSegments: 5,
    curveSegments: 36, // Silky smooth 36-segment curve resolution
    steps: 1,
  };

  const ringSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.020,
    bevelSize: 0.018,
    bevelSegments: 4,
    curveSegments: 36,
    steps: 1,
  };

  const waterShape = createSmoothDropletShape();
  const leafShape = createSmoothLeafShape();
  const ringLowerShape = createSmoothRingShape();
  const ringUpperShape = createSmoothRingShape();
  const sproutShape = createSmoothSproutShape();

  const waterGeom = new THREE.ExtrudeGeometry(waterShape, extrudeSettings);
  const leafGeom = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
  const ringLowerGeom = new THREE.ExtrudeGeometry(ringLowerShape, ringSettings);
  const ringUpperGeom = new THREE.ExtrudeGeometry(ringUpperShape, ringSettings);
  const sproutGeom = new THREE.ExtrudeGeometry(sproutShape, extrudeSettings);

  const all = [waterGeom, leafGeom, ringLowerGeom, ringUpperGeom, sproutGeom];

  return {
    water: waterGeom,
    leaf: leafGeom,
    ringLower: ringLowerGeom,
    ringUpper: ringUpperGeom,
    sprout: sproutGeom,
    all,
  };
}
