# FE-AA3 — Signature Hero: Fullscreen Shader

## 1. What I Built

The **Signature Hero** is a high-performance, interactive WebGL fullscreen fragment shader hero section created specifically for the **FlyRank Frontend AI Engineering Capstone**. It combines mathematically curated GLSL procedural energy waves with the signature FlyRank obsidian-teal visual identity, layered beneath real semantic HTML typography, direct module jump actions, and technology highlight badges.

The hero establishes an immediate, portfolio-grade visual identity that feels calm, technical, and alive while maintaining 60fps rendering and WCAG AAA text contrast.

---

## 2. Shader Architecture

The custom GLSL fragment shader (`shaderSource.js`) is organized into six distinct architectural layers:

### A. Uniform Declarations
```glsl
uniform float u_time;         // Elapsed time in seconds for smooth animation
uniform vec2  u_resolution;   // Viewport canvas dimensions in physical pixels
uniform vec2  u_mouse;        // Normalized interactive mouse position [0, 1]
```
All three standard uniforms (`u_time`, `u_resolution`, `u_mouse`) are active and updated dynamically from the React component.

### B. Coordinate Normalization & Aspect Ratio
```glsl
vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
```
Coordinates are centered at `(0, 0)` and normalized by the minimum viewport dimension, preventing distortion and stretching across ultra-wide monitors, tablets, and portrait mobile devices.

### C. Procedural Flow Field & Domain Warping
The flowing energy is calculated using multi-octave harmonic wave functions combined with dynamic 2D rotational domain warping:
- **Octave 1 (Foundation)**: Low-frequency spatial wave with slow angular rotation creating broad fluid drifts.
- **Octave 2 (Harmonic Warp)**: Counter-rotating domain-warped secondary waves producing organic, non-repeating fluid currents.
- **Octave 3 (Shimmer Ribbons)**: Higher frequency sinusoidal waves generating bright luminous energy threads.

### D. Mouse Interaction
```glsl
vec2 mouseUv = (u_mouse * 2.0 - 1.0) * vec2(u_resolution.x / min(u_resolution.x, u_resolution.y),
                                            u_resolution.y / min(u_resolution.x, u_resolution.y));
float mouseDist = length(uv - mouseUv * 0.5);
float mouseInfluence = smoothstep(1.4, 0.0, mouseDist);
uv += (mouseUv * 0.10) * mouseInfluence;
```
Pointer movement gently ripples and attracts the local vector field using quadratic distance falloff, creating a responsive yet stable and calm interaction.

### E. FlyRank Signature Color Palette
The shader utilizes a tailored color ramp inspired by the FlyRank brand:
- **Deep Obsidian Base (`#061315`)**: Forms the dark backdrop to ensure > 10:1 contrast for all text.
- **Dark Ink Teal (`#0b3034`)**: Mid-tone spatial foundation.
- **Cyber Teal (`#087f6d`)**: Primary energetic current.
- **Luminous Cyan (`#2dd4bf` / `#5eead4`)**: Filament highlights and glow ribbons.

### F. Final Compositing, Vignette & Film Grain
- **Radial Vignette**: Softens edges and draws visual focus toward the central headline.
- **Procedural Micro-Grain**: High-frequency pseudo-random dither eliminates 8-bit banding on dark gradients without impacting frame rates.

---

## 3. Performance & Responsible Rendering

1. **`devicePixelRatio` Capping**:
   - WebGL render buffer is capped using `Math.min(window.devicePixelRatio, 1.5)`. This prevents GPU overheating and high memory consumption on 3x/4x retina mobile screens while preserving sharp visual fidelity.
2. **Tab Visibility Pause**:
   - Listens to `document.visibilityState`. When the user switches to another tab, the `requestAnimationFrame` render loop is cancelled immediately. When the tab becomes active again, the loop resumes seamlessly with monotonic elapsed time calculation.
3. **Viewport Culling via `IntersectionObserver`**:
   - An `IntersectionObserver` detects when the hero section scrolls out of view. Rendering is halted when offscreen, allocating 100% of GPU resources to the 3D Product Studio and AI Assistant.
4. **Zero Layout Shift (CLS = 0)**:
   - Fixed aspect and CSS container sizing prevent any layout shifts during WebGL context creation.
5. **Memory Leak Prevention**:
   - On component unmount, all WebGL shaders, buffers, programs, animation frames, and resize/visibility listeners are disposed of.

---

## 4. Accessibility

1. **Real Semantic HTML Above Canvas**:
   - All text content (eyebrow, headline, subheadline, CTAs, badges) is rendered using clean semantic HTML elements (`<h2>`, `<p>`, `<a>`, `<span>`), not inside WebGL.
2. **Decorative Canvas Isolation**:
   - The WebGL `<canvas>` is marked with `aria-hidden="true"` and `tabIndex={-1}`, ensuring it does not create extraneous keyboard stops or confuse screen readers.
3. **Text Contrast & Readability**:
   - The deep obsidian base color of the shader guarantees high contrast (exceeding WCAG AAA 7:1 standards) for white headlines and teal eyebrow text.
4. **Keyboard Operability**:
   - All action buttons and navigation links feature visible `:focus-visible` styling (`outline: 2px solid #5eead4; outline-offset: 2px;`) and are reachable via `Tab` / `Shift+Tab`.
5. **Zero Prohibited ARIA**:
   - Strict adherence to WAI-ARIA standards with zero prohibited attributes.

---

## 5. Reduced Motion

> Users who prefer reduced motion receive a static version of the hero instead of the animated shader.

When `prefers-reduced-motion: reduce` is active:
- The continuous `requestAnimationFrame` loop is disabled.
- A single static frame is rendered or the hero applies a static CSS radial gradient backdrop (`radial-gradient(circle at 60% 40%, #0b3034 0%, #061517 70%, #020b0c 100%)`).
- Smooth CSS transitions on hero buttons and decorative pulses are deactivated.

---

## 6. Verification Results

### Automated Test Suite
- **Vitest Component Tests**: `12 passed (2 test files)`
- **Playwright E2E Tests**: `1 passed (primary chat flow)`
- **Vite Production Build**: `Built in 1.46s` (initial bundle 98.94 kB gzip)

### Responsive & Device Testing
- **Desktop (1920x1080 & 1440x900)**: Full-width shader canvas with rich flowing field and smooth pointer tracking.
- **Tablet (768px - 1024px)**: Adaptive typography and balanced CTA spacing.
- **Mobile (375px - 430px)**: Zero horizontal overflow, touch-safe layout, full headline readability.

### Deployment Information
- **Production URL**: [https://flyrank-frontend-capstone-liart.vercel.app](https://flyrank-frontend-capstone-liart.vercel.app)
- **Repository**: `flyrank-frontend-capstone`
- **Branch**: `main`
