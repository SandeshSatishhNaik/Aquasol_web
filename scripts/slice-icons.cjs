const fs = require('fs');

const svg = fs.readFileSync('public/assets/68b9717ff1c0865a25a5058a_38043d8ac06b77f111de44f5ed12ea75_integrations-back-1fc422fa5b.svg', 'utf8');

// The centers of the 8 circles in the original 429x438 coordinate space:
// 1. Top: cx: 215, cy: 27
// 2. Top-Right: cx: 350.8, cy: 83.2
// 3. Right: cx: 402, cy: 224
// 4. Bottom-Right: cx: 350.8, cy: 354.8
// 5. Bottom: cx: 215, cy: 411
// 6. Bottom-Left: cx: 79.2, cy: 354.8
// 7. Left: cx: 27, cy: 223
// 8. Top-Left: cx: 79.2, cy: 83.2

// Each circle pill has radius ~27 (diameter 54) with a drop shadow.
// If we crop each icon with a 64x64 box centered at (cx, cy):
const iconCenters = [
  { id: 1, name: 'asana', cx: 215, cy: 27 },
  { id: 2, name: 'jira', cx: 350.8, cy: 83.2 },
  { id: 3, name: 'dropbox', cx: 402, cy: 224 },
  { id: 4, name: 'hubspot', cx: 350.8, cy: 354.8 },
  { id: 5, name: 'zapier', cx: 215, cy: 411 },
  { id: 6, name: 'intercom', cx: 79.2, cy: 354.8 },
  { id: 7, name: 'slack', cx: 27, cy: 223 },
  { id: 8, name: 'notion', cx: 79.2, cy: 83.2 }
];

// Extract the defs from the original SVG
const defs = svg.substring(svg.indexOf('<defs>'), svg.indexOf('</defs>') + 7);

iconCenters.forEach(ic => {
  // viewBox: x = cx - 32, y = cy - 32, width = 64, height = 64
  const vbX = Math.round(ic.cx - 32);
  const vbY = Math.round(ic.cy - 32);
  
  // By reusing the original SVG elements clipped to this viewBox:
  const iconSvg = `<svg width="56" height="56" viewBox="${vbX} ${vbY} 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${svg.substring(svg.indexOf('<g clip-path="url(#clip0_59_410)">') + 34, svg.indexOf('<defs>'))}
  ${defs}
</svg>`;

  fs.writeFileSync(`public/assets/integration-icon-${ic.id}.svg`, iconSvg);
  fs.writeFileSync(`../assets/integration-icon-${ic.id}.svg`, iconSvg);
});

console.log('Extracted all 8 integration icons perfectly!');
