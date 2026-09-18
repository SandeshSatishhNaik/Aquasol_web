const fs = require('fs');

const svg = fs.readFileSync('public/assets/68b9717ff1c0865a25a5058a_38043d8ac06b77f111de44f5ed12ea75_integrations-back-1fc422fa5b.svg', 'utf8');

// Notice that the SVG has the dashed orbit circle path:
// <path d="M401 223.5C401 ... stroke="#8A8E5C" stroke-width="2" stroke-dasharray="8 8"/>
// We can save the dashed orbit track as a standalone SVG!
const orbitTrackSVG = `<svg width="429" height="438" viewBox="0 0 429 438" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M401 223.5C401 120.499 317.501 37 214.5 37C111.499 37 28 120.499 28 223.5C28 326.501 111.499 410 214.5 410C317.501 410 401 326.501 401 223.5Z" stroke="#8A8E5C" stroke-width="2" stroke-dasharray="8 8" opacity="0.4"/>
</svg>`;
fs.writeFileSync('public/assets/integrations-orbit-track.svg', orbitTrackSVG);
fs.writeFileSync('../assets/integrations-orbit-track.svg', orbitTrackSVG);

console.log('Saved integrations-orbit-track.svg');
