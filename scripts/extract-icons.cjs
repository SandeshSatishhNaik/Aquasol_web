const fs = require('fs');

const svg = fs.readFileSync('public/assets/68b9717ff1c0865a25a5058a_38043d8ac06b77f111de44f5ed12ea75_integrations-back-1fc422fa5b.svg', 'utf8');

// The SVG has defs with filters.
// Let's inspect the elements after the path (which is the dashed orbit).
const content = svg.substring(svg.indexOf('stroke-dasharray="8 8"/>') + 24, svg.indexOf('<defs>'));
console.log('Icons content length:', content.length);

// Let's write out content for inspection
fs.writeFileSync('scripts/icons-content.txt', content);
console.log('Written to scripts/icons-content.txt');
