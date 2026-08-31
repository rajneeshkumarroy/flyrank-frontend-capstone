import React, { useEffect, useRef, useState } from 'react';
import { vertexShader, fragmentShader } from './shaderSource';

export default function ShaderHero() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const uniformsRef = useRef({});

  // Mouse coordinates with smooth interpolation
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const currentMouseRef = useRef({ x: 0.5, y: 0.5 });

  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const isVisibleRef = useRef(true);
  const isInViewportRef = useRef(true);
  const startTimeRef = useRef(performance.now());
  const pausedTimeRef = useRef(0);
  const lastPauseTimestampRef = useRef(0);

  // 1. Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e) => setReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, []);

  // 2. Initialize WebGL Context & Shader Program
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext('webgl', { powerPreference: 'low-power', alpha: false, antialias: false }) ||
      canvas.getContext('experimental-webgl');

    if (!gl) {
      setIsWebGLSupported(false);
      return;
    }
    glRef.current = gl;

    // Helper: Compile Shader
    function createShader(glContext, type, source) {
      const shader = glContext.createShader(type);
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);

      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error('Shader compilation error:', glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);

    if (!vs || !fs) {
      setIsWebGLSupported(false);
      return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      setIsWebGLSupported(false);
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    // Setup full-screen quad geometry [-1, -1] to [1, 1]
    const quadVertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Retrieve uniform locations
    uniformsRef.current = {
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_mouse: gl.getUniformLocation(program, 'u_mouse'),
    };

    // Resize canvas with devicePixelRatio cap (max 1.5)
    function resize() {
      if (!canvas || !containerRef.current || !gl) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.floor(rect.width * dpr);
      const height = Math.floor(rect.height * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    resize();
    window.addEventListener('resize', resize);

    // IntersectionObserver to pause rendering when hero is offscreen
    let observer;
    if ('IntersectionObserver' in window && containerRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isInViewportRef.current = entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(containerRef.current);
    }

    // VisibilityChange listener to pause when tab is hidden
    function handleVisibilityChange() {
      if (document.hidden) {
        isVisibleRef.current = false;
        lastPauseTimestampRef.current = performance.now();
      } else {
        isVisibleRef.current = true;
        if (lastPauseTimestampRef.current > 0) {
          pausedTimeRef.current += performance.now() - lastPauseTimestampRef.current;
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Render loop
    function render(now) {
      if (isVisibleRef.current && isInViewportRef.current && gl && programRef.current) {
        // Smoothly interpolate mouse position (lerp factor 0.05)
        currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * 0.05;
        currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * 0.05;

        // Compute effective time excluding paused intervals
        const effectiveTime = (now - startTimeRef.current - pausedTimeRef.current) * 0.001;

        gl.useProgram(programRef.current);
        gl.uniform1f(uniformsRef.current.u_time, effectiveTime);
        gl.uniform2f(uniformsRef.current.u_resolution, canvas.width, canvas.height);
        gl.uniform2f(
          uniformsRef.current.u_mouse,
          currentMouseRef.current.x,
          currentMouseRef.current.y
        );

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      // If user prefers reduced motion, draw a single initial frame and halt loop
      if (!reducedMotion) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    }

    // Trigger first frame
    animationFrameRef.current = requestAnimationFrame(render);

    // Cleanup resources on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer && containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      if (gl) {
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
        if (program) gl.deleteProgram(program);
        if (positionBuffer) gl.deleteBuffer(positionBuffer);
      }
    };
  }, [reducedMotion]);

  // Pointer move handler
  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height; // Flip Y for WebGL
    targetMouseRef.current = {
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
    };
  };

  return (
    <section
      id="hero-section"
      ref={containerRef}
      className={`shader-hero-section ${reducedMotion ? 'reduced-motion' : ''}`}
      onPointerMove={handlePointerMove}
      aria-label="FlyRank Engineering Hero"
    >
      {/* Decorative WebGL Shader Canvas */}
      {isWebGLSupported && (
        <canvas
          ref={canvasRef}
          className="hero-shader-canvas"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      {/* Hero Content Layer */}
      <div className="hero-content-wrapper">
        <div className="hero-eyebrow-container">
          <span className="hero-eyebrow-dot" aria-hidden="true" />
          <p className="hero-eyebrow">FRONTEND AI ENGINEERING</p>
        </div>

        <h2 className="hero-headline">
          Building interfaces that feel alive.
        </h2>

        <p className="hero-subheadline">
          Interactive frontend experiences powered by thoughtful engineering, motion, and AI.
        </p>

        {/* Quick Action Navigation CTAs */}
        <div className="hero-actions">
          <a href="#3d-studio" className="hero-btn hero-btn-primary">
            <span>Explore 3D Studio</span>
            <span className="btn-arrow" aria-hidden="true">↓</span>
          </a>
          <a href="#chat-assistant" className="hero-btn hero-btn-secondary">
            <span>AI Assistant</span>
            <span className="btn-arrow" aria-hidden="true">→</span>
          </a>
          <a href="#motion-demo-section" className="hero-btn hero-btn-ghost">
            <span>Micro-Interactions</span>
          </a>
        </div>

        {/* Technical Highlights Badges */}
        <div className="hero-tech-pills" aria-label="Technical Highlights">
          <span className="tech-pill">
            <span className="pill-dot" aria-hidden="true" />
            GLSL WebGL Shader
          </span>
          <span className="tech-pill">
            <span className="pill-dot" aria-hidden="true" />
            React Three Fiber 3D
          </span>
          <span className="tech-pill">
            <span className="pill-dot" aria-hidden="true" />
            Vercel AI SDK
          </span>
          <span className="tech-pill">
            <span className="pill-dot" aria-hidden="true" />
            WCAG AA Accessible
          </span>
        </div>
      </div>
    </section>
  );
}
