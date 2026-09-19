// Flux-style GPU Particle Shader for AquaSol Loader
// High-performance liquid droplet shader calibrated for light-cream organic branding.

export const fluxVertexShader = `
  uniform float uSize;
  uniform float uScale;
  uniform float uOpacity;
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vColor = aColor;
    vOpacity = uOpacity;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * aSize * (uScale / max(0.001, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`;

export const fluxFragmentShader = `
  precision highp float;
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    // Crisp, anti-aliased circular liquid droplet disc
    float alpha = smoothstep(0.5, 0.36, d);
    // Subtle physical Fresnel: rich deep pigment at rim, pure vibrant hue in core
    vec3 dropletColor = mix(vColor * 0.88, vColor, smoothstep(0.5, 0.12, d));
    gl_FragColor = vec4(dropletColor, alpha * vOpacity);
  }
`;
