const fs = require('fs');

const svg = fs.readFileSync('public/assets/68b9717ff1c0865a25a5058a_38043d8ac06b77f111de44f5ed12ea75_integrations-back-1fc422fa5b.svg', 'utf8');

// The SVG has:
// 1. The dashed circle
// 2. 8 integration icons (each has a white circular pill/shadow and an icon logo)
// Let's find the centers of the 8 circles!
// Looking at the circles:
// Filter 1: M215 384C... (cx: 215, cy: 411, r: 27)
// Filter 2: M215 54C... (cx: 215, cy: 27, r: 27)
// Filter 3: M98.3274 335.672C... (cx: 79.2, cy: 354.8, r: 27)
// Filter 4: M331.673 102.327C... (cx: 350.8, cy: 83.2, r: 27)
// Filter 5: M98.3273 102.328C... (cx: 79.2, cy: 83.2, r: 27)
// Filter 6: M331.672 335.672C... (cx: 350.8, cy: 354.8, r: 27)
// Filter 7: M402 251C... (cx: 402, cy: 224, r: 27)
// Filter 8: M27 196C... (cx: 27, cy: 223, r: 27)

console.log('Center of orbit: cx = 214.5, cy = 223.5');
const icons = [
  { name: 'top', cx: 215, cy: 27, angle: -90 },
  { name: 'top-right', cx: 350.8, cy: 83.2, angle: -45 },
  { name: 'right', cx: 402, cy: 224, angle: 0 },
  { name: 'bottom-right', cx: 350.8, cy: 354.8, angle: 45 },
  { name: 'bottom', cx: 215, cy: 411, angle: 90 },
  { name: 'bottom-left', cx: 79.2, cy: 354.8, angle: 135 },
  { name: 'left', cx: 27, cy: 223, angle: 180 },
  { name: 'top-left', cx: 79.2, cy: 83.2, angle: -135 }
];

icons.forEach(ic => {
  const dx = ic.cx - 214.5;
  const dy = ic.cy - 223.5;
  const dist = Math.sqrt(dx*dx + dy*dy);
  console.log(ic.name, 'dist to center:', dist.toFixed(2), 'calculated angle:', (Math.atan2(dy, dx) * 180 / Math.PI).toFixed(1));
});
