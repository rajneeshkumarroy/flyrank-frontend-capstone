/**
 * FlyRank Signature Hero — GLSL Shaders
 * FE-AA3: Custom WebGL fragment & vertex shader for interactive hero canvas
 */

export const vertexShader = `
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    // Map screen-space clip quad [-1, 1] to normalized texture coordinates [0, 1]
    vUv = (position + 1.0) * 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const fragmentShader = `
  #ifdef GL_ES
  precision highp float;
  #endif

  // =========================================================
  // 1. UNIFORM DECLARATIONS
  // =========================================================
  uniform float u_time;         // Elapsed time in seconds for smooth animation
  uniform vec2  u_resolution;   // Viewport canvas dimensions in physical pixels
  uniform vec2  u_mouse;        // Normalized interactive mouse position [0, 1]

  varying vec2 vUv;

  // 2D Rotation matrix helper for rotational domain warping
  mat2 rotate2D(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  // =========================================================
  // 3. PROCEDURAL FLOW FIELD & DOMAIN WARPING
  // =========================================================
  // Layered multi-frequency harmonic wave field generating organic cybernetic flows
  float flowField(vec2 p, float t) {
    float total = 0.0;
    vec2 drift = vec2(t * 0.04, t * 0.025);

    // Octave 1: Deep foundation wave with slow angular rotation
    vec2 p1 = p * 1.35 + drift;
    p1 = rotate2D(0.4 + sin(t * 0.035) * 0.08) * p1;
    total += sin(p1.x * 2.2 + sin(p1.y * 2.8 + t * 0.35)) * 0.45;

    // Octave 2: Counter-rotating domain-warped harmonic flow
    vec2 p2 = p * 2.1 - drift * 1.4;
    p2 = rotate2D(-0.75 + cos(t * 0.045) * 0.12) * p2;
    total += sin(p2.x * 3.4 + sin(p2.y * 2.6 + t * 0.55)) * 0.32;

    // Octave 3: Luminous high-frequency shimmer ribbons
    vec2 p3 = p * 3.8 + drift * 0.9;
    total += sin(p3.x * 5.5 + p3.y * 4.8 + t * 0.75) * 0.18;

    return total;
  }

  void main() {
    // =========================================================
    // 2. COORDINATE NORMALIZATION & ASPECT RATIO
    // =========================================================
    // Center origin (0, 0) and preserve 1:1 circular aspect ratio across all screen sizes
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    // Slow, calm temporal progression
    float t = u_time * 0.38;

    // =========================================================
    // 4. MOUSE INTERACTION
    // =========================================================
    // Convert normalized mouse coordinates [0, 1] to centered UV space [-1, 1]
    vec2 mouseUv = (u_mouse * 2.0 - 1.0) * vec2(u_resolution.x / min(u_resolution.x, u_resolution.y),
                                                u_resolution.y / min(u_resolution.x, u_resolution.y));
    
    // Calculate distance to mouse cursor with smooth quadratic falloff
    float mouseDist = length(uv - mouseUv * 0.5);
    float mouseInfluence = smoothstep(1.4, 0.0, mouseDist);

    // Subtle, stable gravitational ripple near cursor
    uv += (mouseUv * 0.10) * mouseInfluence;

    // =========================================================
    // 5. PROCEDURAL ENERGY CALCULATION
    // =========================================================
    // Primary field density
    float wave = flowField(uv, t);

    // Secondary warped sample for chromatic depth
    float waveOffset = flowField(uv + vec2(0.08, -0.06), t + 0.15);

    // Intensity mapping with soft sigmoid compression
    float intensity = clamp(wave * 0.5 + 0.5, 0.0, 1.0);
    float ribbon = smoothstep(0.35, 0.85, waveOffset * 0.5 + 0.5);

    // =========================================================
    // 6. FLYRANK SIGNATURE TEAL COLOR PALETTE & COMPOSITING
    // =========================================================
    // Deep obsidian background foundation (guarantees maximum WCAG AAA contrast for light text)
    vec3 colDeepBackground = vec3(0.024, 0.075, 0.082); // #061315
    vec3 colDarkTeal       = vec3(0.043, 0.188, 0.204); // #0b3034
    vec3 colCyberTeal      = vec3(0.031, 0.498, 0.427); // #087f6d
    vec3 colCyanRibbon     = vec3(0.180, 0.831, 0.749); // #2dd4bf
    vec3 colLuminousWhite  = vec3(0.780, 0.980, 0.940); // Soft cyan-white glow

    // Interpolate color layers across procedural field intensities
    vec3 color = mix(colDeepBackground, colDarkTeal, smoothstep(0.0, 0.55, intensity));
    color = mix(color, colCyberTeal, smoothstep(0.40, 0.82, intensity));
    color = mix(color, colCyanRibbon, ribbon * 0.65);
    color += colLuminousWhite * pow(ribbon, 4.0) * 0.25;

    // Add extra subtle radiance in mouse proximity
    color += colCyanRibbon * (mouseInfluence * 0.12);

    // =========================================================
    // 7. VIGNETTE & PROCEDURAL FILM GRAIN
    // =========================================================
    // Soft radial vignette to focus visual weight in the center
    float vignette = 1.0 - smoothstep(0.65, 1.8, length(uv * vec2(0.85, 1.05)));
    color *= vignette;

    // Micro-grain dither to prevent 8-bit banding on smooth gradients
    float grain = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.022;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;
