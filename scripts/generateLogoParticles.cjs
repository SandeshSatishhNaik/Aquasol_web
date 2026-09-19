const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const logoPath = path.join(__dirname, '../public/assets/aquasol-user-logo.png');
const data = fs.readFileSync(logoPath);
const png = PNG.sync.read(data);

const lit = [];
const step = 2;
for (let y = 0; y < png.height; y += step) {
  for (let x = 0; x < png.width; x += step) {
    const idx = (png.width * y + x) << 2;
    const a = png.data[idx + 3];
    if (a > 45) {
      lit.push({
        x,
        y,
        r: png.data[idx] / 255,
        g: png.data[idx + 1] / 255,
        b: png.data[idx + 2] / 255,
      });
    }
  }
}

// Bounding box of lit points
let minX = 1024, maxX = 0, minY = 1024, maxY = 0;
for (const p of lit) {
  if (p.x < minX) minX = p.x;
  if (p.x > maxX) maxX = p.x;
  if (p.y < minY) minY = p.y;
  if (p.y > maxY) maxY = p.y;
}

const cx = (minX + maxX) / 2;
const cy = (minY + maxY) / 2;
const w = maxX - minX;
const h = maxY - minY;
const maxDim = Math.max(w, h);

const COUNT = 10000;
const positions = new Float32Array(COUNT * 3);
const colors = new Float32Array(COUNT * 3);
const swirl = new Float32Array(COUNT * 3);
const stagger = new Float32Array(COUNT);
const sizes = new Float32Array(COUNT);

const scale = 5.3; // world unit size in 3D scene (camera at Z=14 with FOV=45)

for (let i = 0; i < COUNT; i++) {
  // Stratified sampling
  const k = Math.floor((i / COUNT) * lit.length);
  const p = lit[k];
  
  // Normalized centered position
  const nx = (p.x - cx) / maxDim;
  const ny = (cy - p.y) / maxDim; // Invert Y for 3D
  
  // Add subtle 3D relief based on color
  let nz = (Math.random() - 0.5) * 0.08;
  if (p.b > p.r && p.b > 0.4) {
    // Water droplet front curve
    const distFromCenter = Math.sqrt(nx * nx + ny * ny);
    nz += Math.max(0, 0.28 - distFromCenter * 0.35);
  } else if (p.g > p.r && p.g > p.b) {
    // Leaf subtle relief
    nz += Math.sin(nx * 5.0) * 0.08;
  }
  
  positions[i * 3] = nx * scale + (Math.random() - 0.5) * 0.03;
  positions[i * 3 + 1] = ny * scale + (Math.random() - 0.5) * 0.03;
  positions[i * 3 + 2] = nz;
  
  // Exact sampled color
  colors[i * 3] = Math.round(p.r * 1000) / 1000;
  colors[i * 3 + 1] = Math.round(p.g * 1000) / 1000;
  colors[i * 3 + 2] = Math.round(p.b * 1000) / 1000;
  
  // Swirl vector (unit curl)
  const a = Math.random() * Math.PI * 2;
  const b = (Math.random() - 0.5) * Math.PI;
  swirl[i * 3] = Math.cos(a) * Math.cos(b);
  swirl[i * 3 + 1] = Math.sin(b);
  swirl[i * 3 + 2] = Math.sin(a) * Math.cos(b);
  
  stagger[i] = Math.random();
  sizes[i] = 0.65 + Math.random() * 0.95;
}

const posB64 = Buffer.from(positions.buffer).toString('base64');
const colB64 = Buffer.from(colors.buffer).toString('base64');
const swB64 = Buffer.from(swirl.buffer).toString('base64');
const stagB64 = Buffer.from(stagger.buffer).toString('base64');
const sizB64 = Buffer.from(sizes.buffer).toString('base64');

const outTs = `// Auto-generated precomputed particle data from aquasol-user-logo.png
// 10,000 sampled points with exact RGB colors, positions, swirl curl vectors, staggers, and sizes.

function b64ToFloat32Array(b64: string): Float32Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return new Float32Array(bytes.buffer);
}

const POS_B64 = '${posB64}';
const COL_B64 = '${colB64}';
const SW_B64 = '${swB64}';
const STAG_B64 = '${stagB64}';
const SIZ_B64 = '${sizB64}';

export interface PrecomputedParticleSet {
  count: number;
  positions: Float32Array;
  colors: Float32Array;
  swirl: Float32Array;
  stagger: Float32Array;
  sizes: Float32Array;
}

let cached: PrecomputedParticleSet | null = null;

export function getPrecomputedLogoParticles(): PrecomputedParticleSet {
  if (cached) return cached;
  cached = {
    count: ${COUNT},
    positions: b64ToFloat32Array(POS_B64),
    colors: b64ToFloat32Array(COL_B64),
    swirl: b64ToFloat32Array(SW_B64),
    stagger: b64ToFloat32Array(STAG_B64),
    sizes: b64ToFloat32Array(SIZ_B64),
  };
  return cached;
}
`;

const targetPath = path.join(__dirname, '../src/components/exact/AquaSolLoader/particles/logoParticleData.ts');
fs.writeFileSync(targetPath, outTs);
console.log('Successfully wrote', targetPath);
