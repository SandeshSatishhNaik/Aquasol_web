const fs = require('fs');

const pngData = fs.readFileSync('public/assets/aquasol-emblem-hd.png');
const base64Png = 'data:image/png;base64,' + pngData.toString('base64');

const svgTemplate = `<svg width="285" height="285" viewBox="0 0 285 285" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g clip-path="url(#clip0_59_476)">
<g filter="url(#filter0_d_59_476)">
<path d="M285 142.5C285 63.7994 221.201 0 142.5 0C63.7994 0 0 63.7994 0 142.5C0 221.201 63.7994 285 142.5 285C221.201 285 285 221.201 285 142.5Z" fill="white"/>
</g>
<g filter="url(#filter1_d_59_476)">
<path d="M239 142.5C239 89.2045 195.795 46 142.5 46C89.2045 46 46 89.2045 46 142.5C46 195.795 89.2045 239 142.5 239C195.795 239 239 195.795 239 142.5Z" fill="white"/>
</g>
<g filter="url(#filter2_d_59_476)">
<path d="M193 142.5C193 114.61 170.39 92 142.5 92C114.61 92 92 114.61 92 142.5C92 170.39 114.61 193 142.5 193C170.39 193 193 170.39 193 142.5Z" fill="white"/>
</g>
<image href="${base64Png}" x="106.5" y="106.5" width="72" height="72" preserveAspectRatio="xMidYMid meet"/>
</g>
<defs>
<filter id="filter0_d_59_476" x="-40" y="-28" width="365" height="365" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="12"/>
<feGaussianBlur stdDeviation="20"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.541176 0 0 0 0 0.556863 0 0 0 0 0.360784 0 0 0 0.13 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_59_476"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_59_476" result="shape"/>
</filter>
<filter id="filter1_d_59_476" x="6" y="18" width="273" height="273" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="12"/>
<feGaussianBlur stdDeviation="20"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.541176 0 0 0 0 0.556863 0 0 0 0 0.360784 0 0 0 0.13 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_59_476"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_59_476" result="shape"/>
</filter>
<filter id="filter2_d_59_476" x="52" y="64" width="181" height="181" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="12"/>
<feGaussianBlur stdDeviation="20"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.541176 0 0 0 0 0.556863 0 0 0 0 0.360784 0 0 0 0.13 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_59_476"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_59_476" result="shape"/>
</filter>
<clipPath id="clip0_59_476">
<rect width="285" height="285" fill="white"/>
</clipPath>
</defs>
</svg>`;

fs.writeFileSync('public/assets/68b9714cae56b2d133bce34b_cd148818a00eac27e7fc34af4bee8147_integrations-front-d56aa35a99.svg', svgTemplate);
fs.writeFileSync('../assets/68b9714cae56b2d133bce34b_cd148818a00eac27e7fc34af4bee8147_integrations-front-d56aa35a99.svg', svgTemplate);

console.log('Successfully updated integrations-front SVG in both locations!');
