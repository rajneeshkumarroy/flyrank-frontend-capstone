import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ProductModel({
  color = '#087f6d',
  metalness = 0.85,
  roughness = 0.25,
  emissiveIntensity = 0.8,
  wireframe = false,
  autoRotate = true,
  prefersReducedMotion = false,
}) {
  const groupRef = useRef(null);
  const ringRef = useRef(null);
  const coreRef = useRef(null);
  const innerSphereRef = useRef(null);

  // Animate model when autoRotate is enabled and user doesn't prefer reduced motion
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!prefersReducedMotion && autoRotate) {
      // Gentle idle float
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 1.4) * 0.08;

      // Subtle main group y-rotation
      groupRef.current.rotation.y += delta * 0.35;

      // Independent orbital counter-rotation for the outer ring
      if (ringRef.current) {
        ringRef.current.rotation.x = Math.PI / 4 + Math.sin(t * 0.8) * 0.15;
        ringRef.current.rotation.z += delta * 0.6;
      }

      // Gentle pulse for the emissive core
      if (innerSphereRef.current) {
        innerSphereRef.current.rotation.y -= delta * 0.5;
      }
    } else {
      // Return smoothly to rest position if auto-rotation is disabled
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        0,
        4,
        delta
      );
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* ================= MAIN CAPSULE CORE ================= */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.55, 0.7, 32, 64]} />
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          wireframe={wireframe}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* ================= SECONDARY CENTRAL ACCENT BEZEL ================= */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.59, 0.59, 0.15, 48]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.95}
          roughness={0.15}
          wireframe={wireframe}
        />
      </mesh>

      {/* ================= ORBITAL MAGNETIC RING ================= */}
      <mesh ref={ringRef} position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.92, 0.04, 24, 64]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* ================= UPPER SENSOR DOME & GLOW ================= */}
      <group position={[0, 0.75, 0]}>
        {/* Outer protective lens */}
        <mesh>
          <sphereGeometry args={[0.22, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.7}
            roughness={0.1}
            metalness={0.1}
            wireframe={wireframe}
          />
        </mesh>

        {/* Inner glowing pulse core */}
        <mesh ref={innerSphereRef} position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
      </group>

      {/* ================= BASE METALLIC PEDESTAL RING ================= */}
      <mesh position={[0, -0.72, 0]}>
        <cylinderGeometry args={[0.38, 0.44, 0.12, 36]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.9}
          roughness={0.25}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}
