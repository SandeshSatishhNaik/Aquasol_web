const { PNG } = require('pngjs');
const fs = require('fs');

function rdp(points, epsilon) {
  if (points.length <= 2) return points;
  let dmax = 0;
  let index = 0;
  const a = points[0];
  const b = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const num = Math.abs((b[1] - a[1]) * p[0] - (b[0] - a[0]) * p[1] + b[0] * a[1] - b[1] * a[0]);
    const den = Math.hypot(b[1] - a[1], b[0] - a[0]);
    const d = den === 0 ? Math.hypot(p[0] - a[0], p[1] - a[1]) : num / den;
    if (d > dmax) {
      dmax = d;
      index = i;
    }
  }
  if (dmax > epsilon) {
    const rec1 = rdp(points.slice(0, index + 1), epsilon);
    const rec2 = rdp(points.slice(index), epsilon);
    return rec1.slice(0, -1).concat(rec2);
  }
  return [a, b];
}

function traceContour(grid, w, h, targetVal) {
  let startX = -1, startY = -1;
  for (let y = 0; y < h && startX === -1; y++) {
    for (let x = 0; x < w; x++) {
      if (grid[w * y + x] === targetVal) {
        if (x === 0 || y === 0 || grid[w * y + (x - 1)] !== targetVal || grid[w * (y - 1) + x] !== targetVal) {
          startX = x;
          startY = y;
          break;
        }
      }
    }
  }
  if (startX === -1) return [];

  const dx = [1, 1, 0, -1, -1, -1, 0, 1];
  const dy = [0, 1, 1, 1, 0, -1, -1, -1];

  const points = [[startX, startY]];
  let cx = startX, cy = startY;
  let dir = 7;

  const maxSteps = w * h;
  let steps = 0;

  while (steps++ < maxSteps) {
    let found = false;
    const startSearch = (dir + 5) % 8;
    for (let i = 0; i < 8; i++) {
      const ndir = (startSearch + i) % 8;
      const nx = cx + dx[ndir];
      const ny = cy + dy[ndir];
      if (nx >= 0 && nx < w && ny >= 0 && ny < h && grid[w * ny + nx] === targetVal) {
        cx = nx;
        cy = ny;
        dir = ndir;
        found = true;
        break;
      }
    }

    if (!found) break;
    if (cx === startX && cy === startY) break;
    points.push([cx, cy]);
  }

  return points;
}

fs.createReadStream('public/assets/aquasol-emblem-hd.png')
  .pipe(new PNG())
  .on('parsed', function() {
    const w = this.width;
    const h = this.height;
    const grid = new Uint8Array(w * h);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (w * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx+1];
        const b = this.data[idx+2];
        const a = this.data[idx+3];
        if (a < 35) continue;

        if (b > r + 30 && b > g - 15) {
          grid[w * y + x] = 1; // Water
        } else if (g > r && g > b) {
          if (x > 670 && y < 450) grid[w * y + x] = 4; // Sprout
          else if (x > 380 && x < 660 && y > 150 && y < 700) grid[w * y + x] = 2; // Leaf
          else grid[w * y + x] = 3; // Ring
        }
      }
    }

    const names = { 1: 'water', 2: 'leaf', 3: 'ring', 4: 'sprout' };
    const fills = { 1: '#1F98EB', 2: '#5E9E26', 3: '#7AB336', 4: '#8CC63F' };

    let svgPaths = '';
    const componentShapes = {};

    for (let c = 1; c <= 4; c++) {
      const pts = traceContour(grid, w, h, c);
      console.log('Comp', names[c], 'raw pts:', pts.length);
      const simp = rdp(pts, 1.8);
      console.log('Comp', names[c], 'simplified pts:', simp.length);
      if (simp.length > 2) {
        componentShapes[names[c]] = simp;
        let d = 'M ' + simp[0][0] + ' ' + simp[0][1];
        for (let i = 1; i < simp.length; i++) {
          d += ' L ' + simp[i][0] + ' ' + simp[i][1];
        }
        d += ' Z';
        svgPaths += `  <path id="${names[c]}" d="${d}" fill="${fills[c]}" />\n`;
      }
    }

    const svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">\n${svgPaths}</svg>`;
    fs.writeFileSync('public/assets/aquasol-emblem-vector.svg', svg);
    fs.writeFileSync('src/components/exact/AquaSolLoader/emblemPaths.json', JSON.stringify(componentShapes, null, 2));
    console.log('Generated aquasol-emblem-vector.svg and emblemPaths.json successfully!');
  });
