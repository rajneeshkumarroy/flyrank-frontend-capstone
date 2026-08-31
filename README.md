# FlyRank Frontend AI Engineering Capstone

A production-grade, portfolio-quality frontend engineering capstone featuring an interactive 3D WebGL product studio, state-aware micro-interactions, an AI-powered engineering assistant with streaming responses, and an automated CI/CD test suite.

---

## Tech Stack

- **Core**: React 18.3.1, JavaScript (ES6+), HTML5, Vanilla CSS3 (Custom Design System)
- **Bundler & Tooling**: Vite 5.4.10, Node.js
- **3D Graphics & WebGL**: Three.js 0.169.0, React Three Fiber (R3F) 8.18.0, `@react-three/drei` 9.122.0
- **AI Engineering**: Vercel AI SDK (`ai` & `@ai-sdk/react`), Google Gemini AI (`@ai-sdk/google`)
- **Testing & Quality Assurance**: Vitest 2.1.9, React Testing Library, `@testing-library/jest-dom`, Playwright 1.62.1 (Chromium E2E)
- **CI / Automation**: GitHub Actions (`.github/workflows/ci.yml`)
- **Deployment**: Vercel Serverless Platform

---

## Features & Modules

### 1. FE-AA2 — 3D Product Studio ("FlyRank Spatial Core")

An interactive, responsive 3D WebGL product configurator built with React Three Fiber.

- **Procedural 3D Geometry**: The "FlyRank Spatial Core" is constructed entirely out of lightweight Three.js primitives (chamfered capsule core, metallic central bezel, counter-rotating magnetic gyro ring, upper protective sensor dome with an emissive pulse core, and a weighted pedestal base).
- **Real-Time Material Customization**:
  - **Color Finishes**: Cyber Teal (`#087f6d`), Obsidian Slate (`#1e293b`), Titanium Silver (`#94a3b8`), Solar Amber (`#d97706`), Cosmic Indigo (`#6366f1`), and custom hex color picker.
  - **Physical Material Tuning**: Real-time sliders for Metalness (0–100%), Roughness (5–100%), and Emissive Glow Intensity (0–200%).
  - **Topology Inspection**: Real-time wireframe toggle to inspect procedural mesh structure.
- **Camera & Interaction**:
  - Full touch, mouse, and trackpad orbit controls with smooth damping, zoom limits (1.8m–6m), and ground polar angle clamping.
  - **Animated Reset**: Smoothly lerps camera position and target back to the default framed view.
- **Accessibility & Motion Design**:
  - Detects and respects system `prefers-reduced-motion` settings. When reduced motion is enabled, idle floating and continuous orbital rotation are cleanly disabled while keeping full interactive control.
  - Full keyboard accessibility across all sliders, buttons, toggles, and color swatches with visible focus rings.
  - Screen reader `aria-live` status announcements on configuration changes.

#### 3D Performance Notes & Lightweight Optimization
- **Dynamic Code Splitting**: The entire 3D module is lazy-loaded with `React.lazy()` and `<Suspense>`, keeping the initial application bundle lightweight (~95 kB gzip) and deferring the 3D bundle (~228 kB gzip) until needed.
- **Zero Heavy Asset Downloads**: No multi-megabyte GLTF/GLB or 4K texture downloads. Total geometry complexity is under 2,500 vertices, allowing instant loading and negligible memory footprint.
- **Render Loop Efficiency**: Device Pixel Ratio is capped at `dpr={[1, 2]}` to prevent GPU thermal throttling and battery drain on high-DPI mobile screens, consistently maintaining 60 FPS.
- **Static Skeleton Fallback**: A lightweight CSS animated wireframe skeleton provides instant visual feedback while the WebGL context initializes.

#### What would be added with more time:
- Interactive audio feedback and spatial sound effects using the Web Audio API on rotation and finish selection.
- HDRI studio reflections with customizable environment maps via Drei `<Environment>`.
- WebXR / AR Quick Look support for augmented reality preview on mobile devices.
- Screenshot generation and 3D configuration export (USDZ / GLTF).

---

### 2. FE-AA1 — Buttons with a Brain

A state-aware micro-interaction communicating four distinct states through intentional motion:
- **Idle**: Clean interactive invitation with subtle hover elevation.
- **Loading**: Inline animated SVG spinner with accessible "Sending..." status.
- **Success**: Pop animation confirming successful transmission.
- **Error**: Micro-shake motion with a quick retry action.
- Includes interactive state testing controls for reviewers (Force Success, Force Error, Reset).

---

### 3. FE-08 & FE-09 — AI Engineering Assistant & Testing Foundation

- **AI Chatbot**: Real-time streaming assistant powered by Vercel AI SDK and Google Gemini, configured with custom tools and sabotage test modes.
- **Unit & Component Testing (Vitest + RTL)**: 12 comprehensive unit and component tests covering all UI states (idle, submitted/thinking, streaming, error/retry, accessible form submission, button states).
- **End-to-End Testing (Playwright)**: End-to-end test validating the complete user flow (open, type, submit, generating state, and rendered AI response) with isolated SSE stream mocking.
- **Continuous Integration (GitHub Actions)**: Automated CI pipeline running component tests, E2E tests, and production builds on every push and pull request.

---

## Installation & Setup

### Prerequisites
- Node.js 20+ (Active LTS recommended)
- npm 10+

### Clone & Install

```bash
git clone https://github.com/rajneeshkumarroy/flyrank-frontend-capstone.git
cd flyrank-frontend-capstone/app
npm ci
```

---

## Local Development

Start the local Vite development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## Running Tests

### 1. Component & Unit Tests (Vitest)
```bash
npm run test:run
```

### 2. End-to-End Tests (Playwright)
```bash
npm run test:e2e
```

### 3. Production Build
```bash
npm run build
```

---

## Project Structure

```
flyrank-frontend-capstone/
├── .github/
│   └── workflows/
│       └── ci.yml                    # Automated GitHub Actions test & build workflow
├── app/
│   ├── api/
│   │   └── chat.js                   # Vercel serverless AI chat endpoint
│   ├── src/
│   │   ├── ai/                       # AI tools and schema definitions
│   │   ├── components/
│   │   │   ├── ProductStudio/        # FE-AA2: 3D WebGL Product Studio
│   │   │   │   ├── ProductStudio.jsx
│   │   │   │   ├── ProductCanvas.jsx
│   │   │   │   ├── ProductModel.jsx
│   │   │   │   ├── ConfiguratorPanel.jsx
│   │   │   │   └── ProductStudioSkeleton.jsx
│   │   │   ├── Chat.jsx              # FE-08: AI Assistant UI
│   │   │   ├── Chat.test.jsx         # Component test suite for Chat
│   │   │   ├── MotionSendButton.jsx  # FE-AA1: Micro-interaction button
│   │   │   ├── MotionSendButton.test.jsx
│   │   │   └── MotionDemo.jsx
│   │   ├── App.jsx                   # Main application layout & navigation
│   │   ├── App.css                   # Responsive design system & styles
│   │   └── main.jsx                  # Application entry point
│   ├── tests/
│   │   └── chat.spec.js              # Playwright E2E primary flow test
│   ├── playwright.config.js          # Playwright test configuration
│   ├── vitest.config.js              # Vitest test configuration
│   └── package.json
└── README.md
```