import React, { useState, useEffect, useCallback } from 'react';
import ProductCanvas from './ProductCanvas';
import ConfiguratorPanel from './ConfiguratorPanel';

const DEFAULT_STATE = {
  color: '#087f6d',
  metalness: 0.85,
  roughness: 0.25,
  emissiveIntensity: 0.8,
  wireframe: false,
  autoRotate: true,
};

export default function ProductStudio() {
  const [color, setColorState] = useState(DEFAULT_STATE.color);
  const [metalness, setMetalness] = useState(DEFAULT_STATE.metalness);
  const [roughness, setRoughness] = useState(DEFAULT_STATE.roughness);
  const [emissiveIntensity, setEmissiveIntensity] = useState(DEFAULT_STATE.emissiveIntensity);
  const [wireframe, setWireframe] = useState(DEFAULT_STATE.wireframe);
  const [autoRotate, setAutoRotate] = useState(DEFAULT_STATE.autoRotate);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check system prefers-reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const handleSetColor = useCallback((newColor, finishName = '') => {
    setColorState(newColor);
    setFeedbackMessage(`Product color updated to ${finishName || newColor}.`);
  }, []);

  const handleReset = useCallback(() => {
    setColorState(DEFAULT_STATE.color);
    setMetalness(DEFAULT_STATE.metalness);
    setRoughness(DEFAULT_STATE.roughness);
    setEmissiveIntensity(DEFAULT_STATE.emissiveIntensity);
    setWireframe(DEFAULT_STATE.wireframe);
    setAutoRotate(DEFAULT_STATE.autoRotate);
    setResetTrigger((prev) => prev + 1);
    setFeedbackMessage('3D scene viewpoint and product material reset to default.');
  }, []);

  return (
    <section
      className="product-studio-section"
      aria-label="FlyRank 3D Product Studio"
    >
      <div className="product-studio-card">
        {/* 3D WebGL Canvas Stage */}
        <div className="studio-stage">
          <ProductCanvas
            color={color}
            metalness={metalness}
            roughness={roughness}
            emissiveIntensity={emissiveIntensity}
            wireframe={wireframe}
            autoRotate={autoRotate}
            prefersReducedMotion={prefersReducedMotion}
            resetTrigger={resetTrigger}
          />
        </div>

        {/* Configuration Panel */}
        <div className="studio-panel-container">
          <ConfiguratorPanel
            color={color}
            setColor={handleSetColor}
            metalness={metalness}
            setMetalness={setMetalness}
            roughness={roughness}
            setRoughness={setRoughness}
            emissiveIntensity={emissiveIntensity}
            setEmissiveIntensity={setEmissiveIntensity}
            wireframe={wireframe}
            setWireframe={setWireframe}
            autoRotate={autoRotate}
            setAutoRotate={setAutoRotate}
            prefersReducedMotion={prefersReducedMotion}
            onReset={handleReset}
            feedbackMessage={feedbackMessage}
          />
        </div>
      </div>
    </section>
  );
}
