import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import ProductModel from './ProductModel';

function CameraController({ resetTrigger }) {
  const { camera } = useThree();
  const controlsRef = useRef(null);

  useEffect(() => {
    if (resetTrigger > 0 && controlsRef.current) {
      // Smoothly animate camera and target back to initial values
      const initialPos = new THREE.Vector3(0, 0.6, 3.2);
      const initialTarget = new THREE.Vector3(0, 0, 0);

      let startTime = performance.now();
      const startPos = camera.position.clone();
      const startTarget = controlsRef.current.target.clone();
      const duration = 600; // ms

      const animateReset = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Emphasized ease-out curve
        const ease = 1 - Math.pow(1 - progress, 3);

        camera.position.lerpVectors(startPos, initialPos, ease);
        controlsRef.current.target.lerpVectors(startTarget, initialTarget, ease);
        controlsRef.current.update();

        if (progress < 1) {
          requestAnimationFrame(animateReset);
        }
      };

      requestAnimationFrame(animateReset);
    }
  }, [resetTrigger, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={1.8}
      maxDistance={6}
      maxPolarAngle={Math.PI / 2 + 0.15}
      minPolarAngle={Math.PI / 6}
      makeDefault
    />
  );
}

export default function ProductCanvas({
  color,
  metalness,
  roughness,
  emissiveIntensity,
  wireframe,
  autoRotate,
  prefersReducedMotion,
  resetTrigger,
}) {
  return (
    <div
      className="canvas-container"
      role="region"
      tabIndex={0}
      aria-label="3D Interactive Product Canvas"
    >
      <Canvas
        camera={{ position: [0, 0.6, 3.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        shadows
      >
        {/* ================= LIGHTING SETUP ================= */}
        <ambientLight intensity={0.8} />

        <directionalLight
          position={[4, 6, 4]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />

        <pointLight position={[-4, 2, -3]} intensity={0.7} color="#dff3ee" />
        <pointLight position={[0, -2, -2]} intensity={0.4} color="#ffffff" />
        <directionalLight position={[-3, 3, -4]} intensity={0.6} color="#94a3b8" />

        {/* ================= 3D PROCEDURAL PRODUCT ================= */}
        <ProductModel
          color={color}
          metalness={metalness}
          roughness={roughness}
          emissiveIntensity={emissiveIntensity}
          wireframe={wireframe}
          autoRotate={autoRotate}
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* ================= SOFT CONTACT SHADOW ================= */}
        <ContactShadows
          position={[0, -1.05, 0]}
          opacity={0.65}
          scale={5.5}
          blur={2.4}
          far={3.5}
          color="#0b3034"
        />

        {/* ================= CAMERA & INTERACTION ================= */}
        <CameraController resetTrigger={resetTrigger} />
      </Canvas>

      <div className="canvas-badge" aria-hidden="true">
        <span>3D Interactive</span>
      </div>

      <div className="canvas-hint" aria-hidden="true">
        <span>Drag to rotate · Scroll to zoom · Double click to focus</span>
      </div>
    </div>
  );
}
