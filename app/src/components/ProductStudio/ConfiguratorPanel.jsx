import React from 'react';

const COLOR_PRESETS = [
  { name: 'Cyber Teal', hex: '#087f6d' },
  { name: 'Obsidian Slate', hex: '#1e293b' },
  { name: 'Titanium Silver', hex: '#94a3b8' },
  { name: 'Solar Amber', hex: '#d97706' },
  { name: 'Cosmic Indigo', hex: '#6366f1' },
];

export default function ConfiguratorPanel({
  color,
  setColor,
  metalness,
  setMetalness,
  roughness,
  setRoughness,
  emissiveIntensity,
  setEmissiveIntensity,
  wireframe,
  setWireframe,
  autoRotate,
  setAutoRotate,
  prefersReducedMotion,
  onReset,
  feedbackMessage,
}) {
  return (
    <section
      className="configurator-panel"
      aria-label="3D Product Configuration Controls"
    >
      {/* ================= HEADER ================= */}
      <div className="panel-header">
        <div>
          <p className="eyebrow">FE-AA2 · 3D EXPERIENCE</p>
          <h2>FlyRank Spatial Core</h2>
          <p className="panel-description">
            Interactive procedural 3D hardware studio built with React Three Fiber.
            Customize finishes, material properties, and view modes in real-time.
          </p>
        </div>
      </div>

      {/* ================= ACCESSIBLE LIVE REGION ================= */}
      <div className="sr-only" role="status" aria-live="polite">
        {feedbackMessage}
      </div>

      {/* ================= COLOR PRESETS ================= */}
      <div className="control-group">
        <label className="control-label" id="color-palette-label">
          Color Finish
        </label>
        <div
          className="color-preset-grid"
          role="radiogroup"
          aria-labelledby="color-palette-label"
        >
          {COLOR_PRESETS.map((preset) => {
            const isSelected = color.toLowerCase() === preset.hex.toLowerCase();
            return (
              <button
                key={preset.hex}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`${preset.name} finish (${preset.hex})`}
                className={`color-swatch-button ${isSelected ? 'active' : ''}`}
                style={{ '--swatch-color': preset.hex }}
                onClick={() => setColor(preset.hex, preset.name)}
              >
                <span className="swatch-circle" />
                <span className="swatch-name">{preset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Hex Color Picker */}
        <div className="custom-color-row">
          <label htmlFor="custom-color-input" className="custom-color-label">
            Custom Hex Color:
          </label>
          <div className="custom-color-input-wrapper">
            <input
              id="custom-color-input"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value, 'Custom')}
              aria-label="Pick a custom product color"
              className="color-picker-input"
            />
            <span className="color-hex-display" aria-hidden="true">
              {color.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* ================= MATERIAL PROPERTIES ================= */}
      <div className="control-group">
        <span className="control-label">Material Tuning</span>

        {/* Metalness Slider */}
        <div className="slider-row">
          <div className="slider-header">
            <label htmlFor="metalness-slider">Metalness</label>
            <span className="slider-value" aria-hidden="true">
              {Math.round(metalness * 100)}%
            </span>
          </div>
          <input
            id="metalness-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={metalness}
            onChange={(e) => setMetalness(parseFloat(e.target.value))}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={Math.round(metalness * 100)}
            aria-label="Metalness percentage"
            className="config-slider"
          />
        </div>

        {/* Roughness Slider */}
        <div className="slider-row">
          <div className="slider-header">
            <label htmlFor="roughness-slider">Roughness</label>
            <span className="slider-value" aria-hidden="true">
              {Math.round(roughness * 100)}%
            </span>
          </div>
          <input
            id="roughness-slider"
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={roughness}
            onChange={(e) => setRoughness(parseFloat(e.target.value))}
            aria-valuemin="5"
            aria-valuemax="100"
            aria-valuenow={Math.round(roughness * 100)}
            aria-label="Roughness percentage"
            className="config-slider"
          />
        </div>

        {/* Glow / Emissive Intensity */}
        <div className="slider-row">
          <div className="slider-header">
            <label htmlFor="glow-slider">Core Emissive Glow</label>
            <span className="slider-value" aria-hidden="true">
              {Math.round((emissiveIntensity / 2) * 100)}%
            </span>
          </div>
          <input
            id="glow-slider"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={emissiveIntensity}
            onChange={(e) => setEmissiveIntensity(parseFloat(e.target.value))}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={Math.round((emissiveIntensity / 2) * 100)}
            aria-label="Core Emissive Glow intensity"
            className="config-slider"
          />
        </div>
      </div>

      {/* ================= VIEW TOGGLES ================= */}
      <div className="control-group">
        <span className="control-label">View & Motion</span>

        <div className="toggles-grid">
          {/* Wireframe Toggle */}
          <label className="toggle-card">
            <input
              type="checkbox"
              checked={wireframe}
              onChange={(e) => setWireframe(e.target.checked)}
              className="toggle-checkbox"
            />
            <span className="toggle-switch" aria-hidden="true" />
            <div className="toggle-text">
              <strong>Wireframe View</strong>
              <span>Inspect 3D procedural topology</span>
            </div>
          </label>

          {/* Auto-Rotation Toggle */}
          <label className="toggle-card">
            <input
              type="checkbox"
              checked={autoRotate && !prefersReducedMotion}
              disabled={prefersReducedMotion}
              onChange={(e) => setAutoRotate(e.target.checked)}
              className="toggle-checkbox"
            />
            <span className="toggle-switch" aria-hidden="true" />
            <div className="toggle-text">
              <strong>Auto-Rotation & Float</strong>
              <span>
                {prefersReducedMotion
                  ? 'Disabled (prefers-reduced-motion active)'
                  : 'Idle rotation and orbital breathing'}
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="panel-actions">
        <button
          type="button"
          onClick={onReset}
          className="reset-button"
          aria-label="Reset 3D camera angle and material configuration to default"
        >
          <span className="reset-icon" aria-hidden="true">↺</span>
          <span>Reset View & Configuration</span>
        </button>
      </div>
    </section>
  );
}
